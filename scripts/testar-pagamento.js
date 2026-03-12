/**
 * Testa se o backend está respondendo e se o PagLoop gera PIX.
 * Execute com o SERVIDOR JÁ RODANDO (npm run server):
 *   node scripts/testar-pagamento.js
 */

const API = "http://localhost:3001";

async function testar() {
  console.log("Testando API de pagamento...\n");

  const payload = {
    amount: 1.0,
    external_id: `teste-${Date.now()}`,
    payer: {
      name: "Teste Pagamento",
      document: "12345678901",
      email: "teste@email.com",
      phone: "11999999999",
    },
  };

  try {
    const res = await fetch(`${API}/api/payments/deposit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("❌ Erro:", res.status, data?.error || data?.message || data);
      process.exit(1);
    }

    const qr = data?.qrCodeResponse;
    if (qr?.qrcode) {
      console.log("✅ PIX gerado com sucesso!");
      console.log("   Transaction ID:", qr.transactionId);
      console.log("   Valor: R$", qr.amount);
      console.log("   Status:", qr.status);
      console.log("   QR Code (início):", qr.qrcode?.slice(0, 50) + "...");
    } else {
      console.log("⚠️ Resposta inesperada:", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("❌ Falha na requisição:", err.message);
    console.log("\nCertifique-se de que o servidor está rodando: npm run server");
    process.exit(1);
  }
}

testar();
