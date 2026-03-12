import { getToken, getCallbackUrlForApi, PAGLOOP_BASE } from "../../lib/pagloop-vercel.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST para criar depósito.", method: req.method });
  }

  try {
    const body = typeof req.body === "object" ? req.body : {};
    const { amount, external_id, payer } = body || {};

    if (!amount || !external_id || !payer?.name || !payer?.document || !payer?.email) {
      return res.status(400).json({
        error: "Campos obrigatórios: amount, external_id, payer (name, document, email)",
      });
    }

    const clientCallbackUrl = getCallbackUrlForApi();
    if (!clientCallbackUrl) {
      return res.status(500).json({
        error: "CALLBACK_BASE_URL não configurada. Configure na Vercel.",
      });
    }

    const token = await getToken();

    const payload = {
      amount: Number(amount),
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

    const raw = await depositRes.text();
    let data = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      return res.status(502).json({ error: "Resposta inválida do gateway. Tente novamente." });
    }

    if (!depositRes.ok) {
      const msg = data.message || data.error || "Erro ao criar depósito";
      return res
        .status(depositRes.status >= 400 && depositRes.status < 600 ? depositRes.status : 502)
        .json({ error: msg });
    }

    return res.status(201).json(data);
  } catch (e) {
    const msg = (e && (e.message || e.toString())) || "Erro inesperado";
    return res.status(500).json({ error: msg });
  }
}
