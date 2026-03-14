import { useState } from "react";
import { Copy, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { createDepositSimple, type QrCodeResponse } from "@/lib/payment-api";
import { toast } from "sonner";

const GerarPix = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QrCodeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const copyPix = () => {
    if (!result?.qrcode) return;
    navigator.clipboard.writeText(result.qrcode).then(
      () => toast.success("Código PIX copiado!"),
      () => toast.error("Não foi possível copiar.")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    const valor = parseFloat(amount.replace(",", "."));
    if (!valor || valor <= 0) {
      setError("Informe um valor válido.");
      return;
    }
    setLoading(true);
    try {
      const res = await createDepositSimple(valor);
      setResult(res.qrCodeResponse);
      toast.success("PIX gerado!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar PIX.");
      toast.error("Erro ao gerar PIX.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="font-heading font-bold text-xl text-foreground mb-1 flex items-center gap-2">
          <QrCode className="w-6 h-6 text-primary" />
          Gerar PIX
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          Informe o valor e gere o PIX para pagamento.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Valor (R$)</label>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d,.]/g, ""))}
              placeholder="Ex: 150,00 ou 1500"
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground font-body text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 rounded-full font-heading font-bold uppercase text-sm bg-primary text-primary-foreground"
          >
            {loading ? "Gerando..." : "Gerar PIX"}
          </Button>
        </form>

        {result && (
          <div className="rounded-xl border-2 border-border bg-card p-4 space-y-4">
            <p className="text-primary font-heading font-bold text-lg">
              R$ {result.amount.toFixed(2).replace(".", ",")}
            </p>
            <div className="bg-white p-3 rounded-lg flex justify-center">
              <QRCodeSVG value={result.qrcode} size={200} level="M" />
            </div>
            <Button
              type="button"
              onClick={copyPix}
              variant="outline"
              className="w-full gap-2"
            >
              <Copy className="w-4 h-4" />
              Copiar código PIX (copia e cola)
            </Button>
            <p className="text-xs text-muted-foreground">
              Cole no app do banco para pagar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GerarPix;
