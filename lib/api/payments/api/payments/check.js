import { getToken } from "../../lib/pagloop-vercel.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Use GET." });
  }

  try {
    if (!process.env.PAGLOOP_CLIENT_ID || !process.env.PAGLOOP_CLIENT_SECRET) {
      return res.status(500).json({
        ok: false,
        error: "PAGLOOP_CLIENT_ID ou PAGLOOP_CLIENT_SECRET faltando. Configure na Vercel.",
      });
    }

    if (!process.env.CALLBACK_BASE_URL) {
      return res.status(500).json({
        ok: false,
        error: "CALLBACK_BASE_URL faltando. Use a URL do seu app na Vercel.",
      });
    }

    await getToken();
    return res.json({ ok: true, message: "Credenciais OK. Gateway funcionando." });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: (e && e.message) || "Erro ao testar gateway",
    });
  }
}
