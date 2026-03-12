import { motion } from "framer-motion";
import { Check } from "lucide-react";
import onixImg from "@/assets/onix-plus.png";
import { fadeUp, scaleIn, staggerContainer, staggerItem, viewportConfig } from "@/lib/animations";

const WHATSAPP_URL = "https://wa.me/5511986608416";

const plans = [
  {
    name: "PLANO ECONOMICO",
    firstWeek: "R$ 699,90",
    weekly: "R$ 790,00",
    kmLimit: "7.500 km/mes",
    maintenance: "Dividida entre locadora e motorista",
    includes: ["Seguro incluso", "IPVA incluso"],
    total: "R$ 1.889,90",
    description: "Ideal para quem roda bastante e busca o melhor custo-beneficio!",
    highlight: false,
  },
  {
    name: "PLANO COMPLETO",
    firstWeek: "R$ 799,90",
    weekly: "R$ 890,00",
    kmLimit: "5.000 km/mes",
    maintenance: "Por conta da locadora",
    includes: ["Seguro incluso", "IPVA incluso", "Manutencao inclusa"],
    total: "R$ 1.999,90",
    description: "Perfeito para quem quer praticidade e custo fixo sem surpresas!",
    highlight: true,
  },
];

const PlansSection = () => {
  return (
    <section id="planos" className="py-20 bg-navy-medium">
      <div className="container mx-auto px-4">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="section-title text-center mb-4"
        >
          PLANOS DE LOCACAO{" "}
          <span className="text-gradient-cyan">SEDAN</span>
        </motion.h2>

        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex justify-center mb-8"
        >
          <img src={onixImg} alt="Onix Plus" className="h-48 md:h-64 object-contain" />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <p className="text-center text-foreground font-heading font-bold text-xl mb-2">ONIX PLUS</p>
          <p className="text-center text-muted-foreground font-body mb-2">
            Caucao: <span className="text-primary font-bold">R$ 1.200,00</span> + semana antecipada
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8 mt-10 max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={staggerItem}
              className={`rounded-xl p-6 border-2 flex flex-col ${
                plan.highlight
                  ? "border-cyan-glow shadow-cyan bg-card"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlight && (
                <span className="bg-primary text-primary-foreground text-xs font-heading font-bold px-3 py-1 rounded-full uppercase">
                  Recomendado
                </span>
              )}
              <h3 className="font-heading font-extrabold text-xl text-foreground mt-3 uppercase">{plan.name}</h3>

              <div className="mt-4 space-y-2 font-body text-sm">
                <p className="text-muted-foreground">
                  1a semana: <span className="text-primary font-bold text-lg">{plan.firstWeek}</span>
                </p>
                <p className="text-muted-foreground">
                  Semanal: <span className="text-foreground font-bold text-lg">{plan.weekly}</span>
                </p>
                <p className="text-muted-foreground">Limite: {plan.kmLimit}</p>
                <p className="text-muted-foreground">Manutencao: {plan.maintenance}</p>
              </div>

              <p className="mt-3 text-xs text-muted-foreground italic font-body">{plan.description}</p>

              <ul className="mt-4 space-y-2">
                {plan.includes.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground font-body">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6 border-t border-border">
                <p className="text-muted-foreground text-xs font-body">Valor total para retirada:</p>
                <p className="text-2xl font-heading font-extrabold text-primary">{plan.total}</p>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 block text-center py-3 rounded-full font-heading font-bold uppercase text-sm transition-all ${
                    plan.highlight
                      ? "bg-primary text-primary-foreground hover:shadow-cyan"
                      : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  Alugue Agora
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="text-center text-muted-foreground font-body text-sm mt-8"
        >
          Forma de pagamento: <span className="text-foreground font-bold">Pix</span>
        </motion.p>
      </div>
    </section>
  );
};

export default PlansSection;
