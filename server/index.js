import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const PAGLOOP_BASE = "https://api.pagloop.tech";
const {
  PAGLOOP_CLIENT_ID,
  PAGLOOP_CLIENT_SECRET,
  CALLBACK_BASE_URL,
  CALLBACK_URL_OVERRIDE,
  EVOLUTION_API_URL,
  EVOLUTION_INSTANCE_ID,
  EVOLUTION_API_KEY,
} = process.env;

function getCallbackUrlForApi() {
  if (CALLBACK_URL_OVERRIDE) return CALLBACK_URL_OVERRIDE.trim();
  const base = (CALLBACK_BASE_URL || "").replace(/\/$/, "");
  const url = base ? `${base}/api/payments/callback` : "";
  if (url && url.includes("localhost")) {
    console.warn("[PagLoop] localhost não é acessível pelo gateway. Usando URL placeholder para o depósito ser aceito.");
    return "https://example.com/callback";
  }
  return url;
}

function logEnv() {
  console.log("[Env] PAGLOOP_CLIENT_ID:", PAGLOOP_CLIENT_ID ? "ok" : "FALTANDO");
  console.log("[Env] PAGLOOP_CLIENT_SECRET:", PAGLOOP_CLIENT_SECRET ? "ok" : "FALTANDO");
  console.log("[Env] CALLBACK_BASE_URL:", CALLBACK_BASE_URL || "FALTANDO");
}

let cachedToken = null;
let tokenExpiry = 0;

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  const res = await fetch(`${PAGLOOP_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: PAGLOOP_CLIENT_ID,
      client_secret: PAGLOOP_CLIENT_SECRET,
    }),
  });
  const raw = await res.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    console.error("[PagLoop auth] Resposta não é JSON:", raw?.slice(0, 200));
    throw new Error("Resposta inválida do gateway de pagamento.");
  }
  if (!res.ok) {
    console.error("[PagLoop auth] Erro", res.status, data);
    throw new Error(data.message || "Falha ao autenticar no gateway.");
  }
  cachedToken = data.token;
  tokenExpiry = Date.now() + 50 * 60 * 1000; // 50 min
  return cachedToken;
}

const depositHandler = async (req, res) => {
  try {
    const { amount, external_id, payer } = req.body;
    if (!amount || !external_id || !payer?.name || !payer?.document || !payer?.email) {
      return res.status(400).json({
        error: "Campos obrigatórios: amount, external_id, payer (name, document, email)",
      });
    }
    if (!PAGLOOP_CLIENT_ID || !PAGLOOP_CLIENT_SECRET) {
      return res.status(500).json({ error: "Gateway não configurado (credenciais faltando)." });
    }
    const clientCallbackUrl = getCallbackUrlForApi();
    if (!clientCallbackUrl) {
      return res.status(500).json({ error: "CALLBACK_BASE_URL não configurada." });
    }
    const token = await getToken();
    const amountNum = Number(amount);
    const payload = {
      amount: amountNum,
      external_id: String(external_id),
      clientCallbackUrl,
      payer: {
        name: payer.name,
        document: String(payer.document).replace(/\D/g, ""),
        email: payer.email,
        ...(payer.phone && { phone: String(payer.phone).replace(/\D/g, "") }),
      },
    };
    const depositRes = await fetch(`${PAGLOOP_BASE}/api/payments/deposit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const rawDeposit = await depositRes.text();
    let data;
    try {
      data = rawDeposit ? JSON.parse(rawDeposit) : {};
    } catch {
      console.error("[PagLoop deposit] Resposta não é JSON:", rawDeposit?.slice(0, 300));
      return res.status(502).json({
        error: "Resposta inválida do gateway. Tente novamente.",
      });
    }
    if (!depositRes.ok) {
      const status = depositRes.status;
      const msg = data.message || data.error || "Erro ao criar depósito";
      console.error("[PagLoop deposit] HTTP", status, "Resposta completa:", JSON.stringify(data));
      return res.status(status >= 400 && status < 600 ? status : 502).json({
        error: msg,
      });
    }
    return res.status(201).json(data);
  } catch (e) {
    const msg = (e && (e.message || e.toString())) || "Erro inesperado";
    console.error("[Deposit] ERRO:", msg);
    if (e?.stack) console.error(e.stack);
    if (!res.headersSent) res.status(500).json({ error: msg });
  }
};
app.post("/api/payments/deposit", depositHandler);
app.post("/api/payments/deposit/", depositHandler);
app.post("/payments/deposit", depositHandler);
app.post("/payments/deposit/", depositHandler);
app.all("/api/payments/deposit", (req, res, next) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido. Use POST para criar depósito.", method: req.method });
  }
  next();
});
app.all("/api/payments/deposit/", (req, res, next) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido. Use POST para criar depósito.", method: req.method });
  }
  next();
});

app.post("/api/payments/callback", express.json(), (req, res) => {
  const { transaction_id, status, amount, type } = req.body || {};
  console.log("[PagLoop callback]", { transaction_id, status, amount, type });
  res.status(200).send("OK");
});

// Diagnóstico: GET /api/payments/check = testa só login. GET /api/payments/test-deposit = testa depósito completo
app.get("/api/payments/check", async (req, res) => {
  try {
    const ok = (msg) => res.json({ ok: true, message: msg });
    const fail = (msg) => res.status(500).json({ ok: false, error: msg });
    if (!PAGLOOP_CLIENT_ID || !PAGLOOP_CLIENT_SECRET) {
      return fail("PAGLOOP_CLIENT_ID ou PAGLOOP_CLIENT_SECRET faltando no .env");
    }
    if (!CALLBACK_BASE_URL) return fail("CALLBACK_BASE_URL faltando no .env");
    const token = await getToken();
    return ok("Credenciais OK. Token obtido. Gateway funcionando.");
  } catch (e) {
    console.error("[Check] Erro:", e?.message || e);
    return res.status(500).json({
      ok: false,
      error: e?.message || "Erro ao testar gateway",
    });
  }
});

// Testa depósito com dados mínimos e devolve o erro exato (só para diagnóstico)
app.get("/api/payments/test-deposit", async (req, res) => {
  try {
    if (!PAGLOOP_CLIENT_ID || !PAGLOOP_CLIENT_SECRET || !CALLBACK_BASE_URL) {
      return res.status(500).json({ error: "Variáveis de ambiente faltando." });
    }
    const token = await getToken();
    const payload = {
      amount: 1,
      external_id: "test-" + Date.now(),
      clientCallbackUrl: getCallbackUrlForApi(),
      payer: { name: "Teste", document: "12345678901", email: "teste@teste.com" },
    };
    const depositRes = await fetch(`${PAGLOOP_BASE}/api/payments/deposit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const raw = await depositRes.text();
    let data = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = { _raw: raw?.slice(0, 200) };
    }
    if (!depositRes.ok) {
      return res.status(depositRes.status).json({
        error: data.message || data.error || "Erro ao criar depósito",
        pagloopResponse: data,
      });
    }
    return res.json({ ok: true, message: "Depósito de teste criado.", data });
  } catch (e) {
    const msg = (e && (e.message || e.toString())) || "Erro inesperado";
    return res.status(500).json({ error: msg });
  }
});

// Envio de mensagem WhatsApp com botão de copiar PIX
app.post("/api/whatsapp/send-pix", async (req, res) => {
  try {
    const { phone, vehicleName, caucao, weekly, total, qrcode, imageUrl } = req.body || {};

    if (!phone || !vehicleName || !qrcode || !total) {
      return res.status(400).json({
        error: "Campos obrigatórios: phone, vehicleName, qrcode, total.",
      });
    }

    if (!EVOLUTION_API_URL || !EVOLUTION_INSTANCE_ID || !EVOLUTION_API_KEY) {
      return res.status(500).json({
        error: "EVOLUTION_API_URL, EVOLUTION_INSTANCE_ID ou EVOLUTION_API_KEY faltando no .env.",
      });
    }

    const url = `${EVOLUTION_API_URL.replace(/\/$/, "")}/message/sendButtons/${EVOLUTION_INSTANCE_ID}`;

    const title = `🚗 ${vehicleName} — Confirme sua locação!`;
    const description =
      `Olá! 👋\n\nSeu veículo ${vehicleName} está reservado. Confira os detalhes da locação:\n\n` +
      (caucao ? `💳 Caução: ${caucao}\n` : "") +
      (weekly ? `💰 Valor semanal: ${weekly}\n` : "") +
      `\n💵 Total para retirada: ${total}\n\n` +
      `Para confirmar sua locação, utilize o botão abaixo para copiar o código PIX e realizar o pagamento.\n\n` +
      `Após o pagamento, envie o comprovante neste mesmo número.`;

    const body = {
      number: String(phone),
      title,
      description,
      footer: "Locar Lima - Segurança e Praticidade",
      thumbnailUrl: imageUrl || undefined,
      buttons: [
        {
          type: "copy",
          displayText: "Copiar Pix Copia e Cola",
          copyCode: qrcode,
        },
      ],
    };

    const evoRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: EVOLUTION_API_KEY,
      },
      body: JSON.stringify(body),
    });

    const evoRaw = await evoRes.text();
    let evoData;
    try {
      evoData = evoRaw ? JSON.parse(evoRaw) : {};
    } catch {
      evoData = { raw: evoRaw };
    }

    if (!evoRes.ok) {
      return res.status(evoRes.status).json({
        error: "Erro ao enviar mensagem no WhatsApp.",
        evolutionResponse: evoData,
      });
    }

    return res.json({ ok: true, response: evoData });
  } catch (e) {
    const msg = e?.message || e?.toString() || "Erro inesperado ao enviar WhatsApp.";
    console.error("[WhatsApp] ERRO:", msg);
    return res.status(500).json({ error: msg });
  }
});

// Qualquer erro não tratado retorna JSON (evita 500 sem mensagem)
app.use((err, req, res, next) => {
  console.error("[Express] Erro não tratado:", err?.message || err);
  res.status(500).json({ error: err?.message || "Erro interno no servidor." });
});

// 404 para rotas da API não encontradas (evita HTML do Express)
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Rota não encontrada", path: req.path, method: req.method });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  logEnv();
  console.log(`Diagnóstico: http://localhost:${PORT}/api/payments/check`);
  console.log(`Teste depósito:  http://localhost:${PORT}/api/payments/test-deposit`);
});
