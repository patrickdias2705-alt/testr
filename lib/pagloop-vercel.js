/**
 * Lógica PagLoop para uso no servidor Express (local) e nas serverless functions (Vercel).
 * Lê credenciais de process.env (no Vercel, configurar em Environment Variables).
 */

const PAGLOOP_BASE = "https://api.pagloop.tech";

function getCallbackUrlForApi() {
  const override = process.env.CALLBACK_URL_OVERRIDE;
  if (override) return override.trim();
  const base = (process.env.CALLBACK_BASE_URL || "").replace(/\/$/, "");
  const url = base ? `${base}/api/payments/callback` : "";
  if (url && url.includes("localhost")) {
    return "https://example.com/callback";
  }
  return url;
}

async function getToken() {
  const clientId = process.env.PAGLOOP_CLIENT_ID;
  const clientSecret = process.env.PAGLOOP_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Gateway não configurado (credenciais faltando).");
  const res = await fetch(`${PAGLOOP_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret }),
  });
  const raw = await res.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("Resposta inválida do gateway de pagamento.");
  }
  if (!res.ok) throw new Error(data.message || "Falha ao autenticar no gateway.");
  return data.token;
}

module.exports = { getToken, getCallbackUrlForApi, PAGLOOP_BASE };
