/**
 * Lógica PagLoop para uso nas Serverless Functions (Vercel).
 * Lê credenciais de process.env (na Vercel, configurar em Environment Variables).
 */

export const PAGLOOP_BASE = "https://api.pagloop.tech";

export function getCallbackUrlForApi() {
  const override = process.env.CALLBACK_URL_OVERRIDE;
  if (override) return override.trim();

  const base = (process.env.CALLBACK_BASE_URL || "").replace(/\/$/, "");
  const url = base ? `${base}/api/payments/callback` : "";

  // Em ambiente local, o gateway não acessa localhost; use um placeholder só para testes
  if (url && url.includes("localhost")) {
    return "https://example.com/callback";
  }

  return url;
}

export async function getToken() {
  const clientId = process.env.PAGLOOP_CLIENT_ID;
  const clientSecret = process.env.PAGLOOP_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Gateway não configurado (PAGLOOP_CLIENT_ID ou PAGLOOP_CLIENT_SECRET faltando).");
  }

  const res = await fetch(`${PAGLOOP_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret }),
  });

  const raw = await res.text();
  let data;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error("Resposta inválida do gateway de pagamento.");
  }

  if (!res.ok) {
    throw new Error(data.message || "Falha ao autenticar no gateway.");
  }

  return data.token;
}
