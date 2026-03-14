/**
 * API de pagamento PIX via backend (PagLoop).
 * O backend em server/ expõe /api/payments/deposit e mantém as credenciais em segredo.
 */

// Em dev o Vite faz proxy de /api para o backend (3001). Em produção use VITE_API_URL.
const API_BASE =
  typeof import.meta.env.VITE_API_URL === "string" && import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
    : "";

export interface PayerPayload {
  name: string;
  document: string; // CPF/CNPJ (pode ser formatado; será limpo no backend)
  email: string;
  phone?: string;
}

export interface CreateDepositPayload {
  amount: number;
  external_id: string;
  payer: PayerPayload;
}

export interface QrCodeResponse {
  transactionId: string;
  status: string;
  qrcode: string;
  amount: number;
}

export interface DepositSuccessResponse {
  message: string;
  qrCodeResponse: QrCodeResponse;
}

export async function createDeposit(
  payload: CreateDepositPayload
): Promise<DepositSuccessResponse> {
  const res = await fetch(`${API_BASE}/api/payments/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const raw = await res.text();
  let data: { error?: string } = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = {};
  }
  if (!res.ok) {
    const msg =
      typeof data?.error === "string"
        ? data.error
        : res.status === 500
          ? "Erro 500 no servidor. Reinicie o servidor e veja o terminal, ou abra /api/payments/check no navegador."
          : "Erro ao gerar PIX. Tente novamente.";
    throw new Error(msg);
  }
  return data as DepositSuccessResponse;
}

/** Gera PIX apenas com o valor. Backend preenche payer e external_id. */
export async function createDepositSimple(amount: number): Promise<DepositSuccessResponse> {
  const res = await fetch(`${API_BASE}/api/payments/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  const raw = await res.text();
  let data: { error?: string } = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = {};
  }
  if (!res.ok) {
    const msg =
      typeof data?.error === "string"
        ? data.error
        : res.status === 500
          ? "Erro 500 no servidor."
          : "Erro ao gerar PIX. Tente novamente.";
    throw new Error(msg);
  }
  return data as DepositSuccessResponse;
}
