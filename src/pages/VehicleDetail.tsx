import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Phone, Copy, QrCode, Upload, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { vehicles } from "@/data/vehicles";
import Header from "@/components/Header";
import FooterContact from "@/components/FooterContact";
import { fadeLeft, fadeRight } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { createDeposit, type QrCodeResponse } from "@/lib/payment-api";
import type { VehiclePlan } from "@/data/vehicles";

const ANALYZING_SECONDS = 20;

const WHATSAPP_NUMBERS = [
  { label: "(11) 98660-8416", url: "5511986608416" },
  { label: "(11) 98963-9642", url: "5511989639642" },
];

/** Converte "R$ 2.400,00" para 2400 */
function parsePlanTotal(totalStr: string): number {
  const cleaned = totalStr.replace(/[R$\s]/g, "").replace(/\./g, "").replace(",", ".");
  return Math.round(parseFloat(cleaned || "0") * 100) / 100;
}

const OFFICIAL_WHATSAPP = "5511986608416";

const VehicleDetail = () => {
  const { slug } = useParams();
  const vehicle = vehicles.find((v) => v.slug === slug);
  const [currentImg, setCurrentImg] = useState(0);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    whatsapp: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);
  const [pixLoading, setPixLoading] = useState(false);
  const [pixResult, setPixResult] = useState<QrCodeResponse | null>(null);
  const [pixDialogOpen, setPixDialogOpen] = useState(false);
  const [pixError, setPixError] = useState<string | null>(null);
  const [paymentUnlocked, setPaymentUnlocked] = useState(false);
  const [documentsSent, setDocumentsSent] = useState(false);
  const [analyzingSecondsLeft, setAnalyzingSecondsLeft] = useState<number | null>(null);
  const [whatsAppClicked, setWhatsAppClicked] = useState(false);
  const [docFilesCount, setDocFilesCount] = useState(0);
  const docsInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Timer de 34 segundos "Analisando seus documentos"
  useEffect(() => {
    if (analyzingSecondsLeft === null || analyzingSecondsLeft <= 0) return;
    const t = setInterval(() => {
      setAnalyzingSecondsLeft((s) => (s === null ? null : s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [analyzingSecondsLeft]);

  useEffect(() => {
    if (analyzingSecondsLeft === 0) {
      setAnalyzingSecondsLeft(null);
      toast.success("Análise concluída! Envie uma mensagem no WhatsApp para saber o processo de aprovação.");
    }
  }, [analyzingSecondsLeft]);

  // Quando o usuário volta da aba (ex.: voltou do WhatsApp), libera o PIX
  useEffect(() => {
    if (typeof document === "undefined") return;
    const onVisibility = () => {
      if (document.visibilityState === "visible" && whatsAppClicked && !paymentUnlocked) {
        setPaymentUnlocked(true);
        toast.success("Documentos recebidos! Você já pode gerar o PIX para pagamento.");
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [whatsAppClicked, paymentUnlocked]);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-4">Veículo não encontrado</h1>
          <Link to="/" className="text-primary hover:underline">Voltar ao início</Link>
        </div>
      </div>
    );
  }

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % vehicle.gallery.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + vehicle.gallery.length) % vehicle.gallery.length);

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const validateForm = (): boolean => {
    if (formData.nome.trim().length < 3) {
      toast.error("Digite seu nome completo");
      return false;
    }
    if (formData.cpf.replace(/\D/g, "").length !== 11) {
      toast.error("CPF inválido");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("E-mail inválido");
      return false;
    }
    if (formData.whatsapp.replace(/\D/g, "").length < 10) {
      toast.error("WhatsApp inválido");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateForm();
  };

  const handleEnviarDocumentos = () => {
    if (!validateForm()) return;
    if (docFilesCount < 1) {
      toast.error("Envie a foto da sua CNH para continuar.");
      return;
    }
    setDocumentsSent(true);
    setAnalyzingSecondsLeft(ANALYZING_SECONDS);
    toast.info("Documentos enviados! Estamos analisando.");
  };

  const handleWhatsAppAprovacao = () => {
    if (!validateForm()) return;
    const digits = formData.whatsapp.replace(/\D/g, "");
    if (digits.length < 10) {
      toast.error("Informe um WhatsApp válido para continuar.");
      return;
    }
    const randomIndex = Math.floor(Math.random() * WHATSAPP_NUMBERS.length);
    const selected = WHATSAPP_NUMBERS[randomIndex];
    const message = encodeURIComponent(
      `Olá! Enviei meus documentos pelo site para análise do veículo ${vehicle?.name}.\n\n` +
        `Meus dados:\nNome: ${formData.nome}\nCPF: ${formData.cpf}\nE-mail: ${formData.email}\nWhatsApp: ${formData.whatsapp}\n\n` +
        `Gostaria de saber como está o processo de aprovação. Obrigado!`
    );
    window.open(`https://wa.me/${selected.url}?text=${message}`, "_blank");
    setWhatsAppClicked(true);
    toast.success("Ao voltar para esta página, o botão de PIX será liberado.");
  };

  const handleGeneratePix = async () => {
    if (!vehicle || !validateForm()) return;
    if (!paymentUnlocked) {
      toast.error("Envie primeiro seus documentos no WhatsApp para liberar o pagamento via PIX.");
      return;
    }
    const plan: VehiclePlan = vehicle.plans[selectedPlanIndex];
    const amount = parsePlanTotal(plan.total);
    if (amount <= 0) {
      toast.error("Valor do plano inválido");
      return;
    }
    setPixLoading(true);
    setPixResult(null);
    setPixError(null);
    try {
      const externalId = `locarlima-${vehicle.slug}-${plan.name.replace(/\s/g, "-")}-${Date.now()}`;
      const res = await createDeposit({
        amount,
        external_id: externalId,
        payer: {
          name: formData.nome.trim(),
          document: formData.cpf.replace(/\D/g, ""),
          email: formData.email.trim(),
          phone: formData.whatsapp.replace(/\D/g, "") || undefined,
        },
      });
      setPixResult(res.qrCodeResponse);
      setPixDialogOpen(true);
      toast.success("PIX gerado! Escaneie o QR Code ou copie o código.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao gerar PIX.";
      setPixError(msg);
      toast.error(msg);
    } finally {
      setPixLoading(false);
    }
  };

  const copyPixCode = () => {
    if (!pixResult?.qrcode) return;
    navigator.clipboard.writeText(pixResult.qrcode).then(
      () => toast.success("Código PIX copiado!"),
      () => toast.error("Não foi possível copiar.")
    );
  };

  const handlePhoneSelect = (phoneUrl: string) => {
    setSubmitting(true);
    const message = encodeURIComponent(
      `Olá! Tenho interesse no ${vehicle?.name}.\n\nNome: ${formData.nome}\nCPF: ${formData.cpf}\nE-mail: ${formData.email}\nWhatsApp: ${formData.whatsapp}\n\nJá enviei meus documentos pelo site e gostaria de saber sobre a análise.`
    );
    window.open(`https://wa.me/${phoneUrl}?text=${message}`, "_blank");
    toast.success("Redirecionando para o WhatsApp...");
    setSubmitting(false);
    setShowPhoneDropdown(false);
  };

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <Header />
      <div className="pt-24 pb-20 w-full max-w-[100vw] box-border">
        <div className="container mx-auto px-4 w-full max-w-[100vw] box-border">
          <Link
            to="/#frota"
            className="inline-flex items-center gap-2 text-primary hover:underline font-heading font-bold text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar à frota
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 w-full min-w-0">
            {/* Gallery */}
            <motion.div variants={fadeLeft} initial="hidden" animate="visible" className="min-w-0">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-card border-2 border-border w-full min-w-0">
                <img
                  src={vehicle.gallery[currentImg]}
                  alt={`${vehicle.name} - foto ${currentImg + 1}`}
                  className="w-full h-full object-cover max-w-full"
                />
                {vehicle.gallery.length > 1 && (
                  <>
                    <button
                      onClick={prevImg}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImg}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-heading text-foreground">
                      {currentImg + 1} / {vehicle.gallery.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {vehicle.gallery.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {vehicle.gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImg(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        i === currentImg ? "border-primary shadow-cyan" : "border-border opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info + Form */}
            <motion.div variants={fadeRight} initial="hidden" animate="visible" className="min-w-0">
              <span className="text-xs font-heading text-primary uppercase tracking-wider">
                {vehicle.category}
              </span>
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-foreground mt-1">
                {vehicle.name}
              </h1>
              <p className="text-muted-foreground font-body mt-2">
                Caução: <span className="text-primary font-bold">{vehicle.caucao}</span> + semana antecipada
              </p>

              {/* Plans */}
              <div className="mt-6 space-y-4">
                {vehicle.plans.map((plan, index) => (
                  <button
                    type="button"
                    key={plan.name}
                    onClick={() => setSelectedPlanIndex(index)}
                    className={`w-full text-left rounded-xl p-5 border-2 transition-all ${
                      selectedPlanIndex === index
                        ? "border-primary shadow-cyan bg-card ring-2 ring-primary/30"
                        : plan.highlight
                          ? "border-cyan-glow shadow-cyan bg-card hover:border-primary/50"
                          : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    {plan.highlight && vehicle.plans.length > 1 && (
                      <span className="bg-primary text-primary-foreground text-xs font-heading font-bold px-3 py-1 rounded-full uppercase">
                        Recomendado
                      </span>
                    )}
                    <h3 className="font-heading font-extrabold text-lg text-foreground mt-2">{plan.name}</h3>
                    <div className="mt-2 space-y-1 font-body text-sm">
                      <p className="text-muted-foreground">
                        Semanal: <span className="text-primary font-bold text-xl">{plan.weekly}</span>
                      </p>
                      {plan.firstWeek !== plan.weekly && (
                        <p className="text-muted-foreground">
                          1ª semana: <span className="text-foreground font-bold">{plan.firstWeek}</span>
                        </p>
                      )}
                      <p className="text-muted-foreground">Limite: {plan.kmLimit}</p>
                      <p className="text-muted-foreground">Manutenção: {plan.maintenance}</p>
                    </div>
                    <ul className="mt-3 space-y-1">
                      {plan.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-foreground font-body">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-muted-foreground italic">{plan.description}</p>
                    <p className="mt-2 text-muted-foreground text-xs">
                      Total retirada: <span className="text-primary font-extrabold text-lg">{plan.total}</span>
                    </p>
                  </button>
                ))}
              </div>

              {/* Contact Form */}
              <div className="mt-8 rounded-xl border-2 border-border bg-card p-4 sm:p-6 min-w-0 overflow-visible">
                <h3 className="font-heading font-extrabold text-lg text-foreground mb-4">
                  Quero alugar este veículo
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-body text-muted-foreground mb-1 block">Nome completo</label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground font-body text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-body text-muted-foreground mb-1 block">CPF</label>
                    <input
                      type="text"
                      required
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground font-body text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-body text-muted-foreground mb-1 block">E-mail</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground font-body text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-body text-muted-foreground mb-1 block">WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: formatPhone(e.target.value) })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground font-body text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  {/* Documentos para análise */}
                  <div className="mt-4 space-y-3">
                    <h4 className="font-heading font-semibold text-sm text-foreground">
                      Envio da CNH para análise
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Envie aqui apenas a <strong>foto da sua CNH</strong> (frente e verso ou aberta e legível). Clique em Enviar para iniciar a análise.
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-500 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 break-words">
                      No WhatsApp, ao validar seu cadastro, nosso time vai pedir o envio dos outros documentos (comprovante de endereço, print do app, foto da garagem, certidão de pontuação etc.). Por isso, já deixe tudo separado.
                    </p>
                    {!documentsSent && (
                      <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-4 text-center">
                        <input
                          ref={docsInputRef}
                          type="file"
                          multiple
                          accept="image/*,.pdf"
                          className="hidden"
                          id="docs-upload"
                          onChange={(e) => setDocFilesCount(e.target.files?.length ?? 0)}
                        />
                        <label
                          htmlFor="docs-upload"
                          className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Upload className="w-8 h-8" />
                          <span className="text-sm font-medium">
                            Clique para enviar a foto da CNH
                          </span>
                          <span className="text-xs">
                            {docFilesCount > 0
                              ? `${docFilesCount} arquivo(s) selecionado(s)`
                              : "Nenhum arquivo selecionado"}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 pt-2">
                    {!documentsSent && (
                      <Button
                        type="button"
                        onClick={handleEnviarDocumentos}
                        disabled={submitting}
                        className="w-full min-h-[48px] py-5 rounded-full font-heading font-bold uppercase text-sm bg-primary text-primary-foreground hover:shadow-cyan transition-all whitespace-normal text-center break-words"
                      >
                        Enviar documentos
                      </Button>
                    )}
                    {documentsSent && analyzingSecondsLeft !== null && (
                      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5 text-center">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-2" />
                        <p className="font-heading font-bold text-foreground">Analisando seus documentos</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Aguarde a conclusão para falar no WhatsApp.
                        </p>
                      </div>
                    )}
                    {documentsSent && analyzingSecondsLeft === null && !paymentUnlocked && (
                      <>
                        <Button
                          type="button"
                          onClick={handleWhatsAppAprovacao}
                          disabled={submitting}
                          className="w-full min-h-[48px] py-5 px-4 rounded-full font-heading font-bold uppercase text-xs sm:text-sm bg-primary text-primary-foreground hover:shadow-cyan transition-all flex items-center justify-center gap-2 whitespace-normal text-center break-words"
                        >
                          <Phone className="w-5 h-5 flex-shrink-0" />
                          <span>Enviar no WhatsApp e saber processo de aprovação</span>
                        </Button>
                        {whatsAppClicked && (
                          <p className="text-xs text-center text-muted-foreground break-words px-1">
                            Quando voltar para esta página (após falar no WhatsApp), o botão de PIX será liberado.
                          </p>
                        )}
                      </>
                    )}
                    {paymentUnlocked && (
                      <>
                        <Button
                          type="button"
                          onClick={handleGeneratePix}
                          disabled={pixLoading || submitting}
                          className="w-full min-h-[52px] py-6 px-4 rounded-full font-heading font-bold uppercase text-sm bg-primary text-primary-foreground hover:shadow-cyan transition-all flex items-center justify-center gap-2 whitespace-normal text-center"
                        >
                          <QrCode className="w-5 h-5 flex-shrink-0" />
                          {pixLoading ? "Gerando PIX..." : "Pagar com PIX"}
                        </Button>
                        <p className="text-[11px] text-muted-foreground text-center break-words px-1">
                          Após realizar o pagamento, envie o comprovante no nosso WhatsApp oficial.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            window.open(
                              `https://wa.me/${OFFICIAL_WHATSAPP}?text=${encodeURIComponent(
                                "Olá! Fiz o pagamento do PIX da locação e estou enviando o comprovante."
                              )}`,
                              "_blank"
                            )
                          }
                          className="w-full min-h-[48px] py-4 px-4 rounded-full font-heading font-bold uppercase text-xs sm:text-sm border-2 border-primary text-primary hover:bg-primary/10 transition-all flex items-center justify-center gap-2 whitespace-normal text-center break-words"
                        >
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>Enviar comprovante no WhatsApp oficial</span>
                        </Button>
                      </>
                    )}
                  </div>
                  {pixError && (
                    <div className="mt-3 p-3 rounded-lg bg-destructive/15 border border-destructive/50 text-sm text-destructive">
                      <strong>Erro ao gerar PIX:</strong> {pixError}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground text-center">
                    Forma de pagamento: <span className="text-foreground font-bold">Pix</span>
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <FooterContact />

      <Dialog open={pixDialogOpen} onOpenChange={setPixDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-2 border-border">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <QrCode className="w-5 h-5 text-primary" />
              Pagamento PIX
            </DialogTitle>
            <DialogDescription>
              Escaneie o QR Code com o app do seu banco ou copie o código PIX para colar no aplicativo.
              O pagamento é confirmado em até alguns minutos.
            </DialogDescription>
          </DialogHeader>
          {pixResult && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="bg-white p-4 rounded-xl">
                <QRCodeSVG value={pixResult.qrcode} size={220} level="M" />
              </div>
              <p className="text-lg font-heading font-bold text-primary">
                Valor: R$ {pixResult.amount.toFixed(2).replace(".", ",")}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={copyPixCode}
                className="w-full gap-2"
              >
                <Copy className="w-4 h-4" />
                Copiar código PIX
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Status: <span className="font-medium text-foreground">{pixResult.status}</span>. Você receberá uma confirmação quando o pagamento for aprovado.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleDetail;
