import { motion } from "framer-motion";
import { Car, Wrench, DollarSign, Shield } from "lucide-react";
import { fadeUp, staggerContainer, staggerItem, viewportConfig } from "@/lib/animations";

const benefits = [
  {
    icon: Car,
    title: "VARIEDADE DE CARROS",
    description: "Independente da categoria que voce atua, na Locar Lima voce encontra o carro ideal para maximizar seus ganhos.",
  },
  {
    icon: Shield,
    title: "FROTA DE QUALIDADE",
    description: "Disponibilizamos veiculos modernos e bem cuidados, garantindo seguranca, conforto e eficiencia para as suas corridas.",
  },
  {
    icon: DollarSign,
    title: "MELHORES PRECOS DO MERCADO",
    description: "Nossos planos de aluguel sao flexiveis e acessiveis, adaptando-se ao seu orcamento e permitindo que voce maximize seus ganhos.",
  },
  {
    icon: Wrench,
    title: "MANUTENCAO EM DIA",
    description: "Todos os nossos carros passam por rigorosas manutencoes preventivas, evitando imprevistos e garantindo seguranca.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="section-title text-center mb-4"
        >
          BENEFICIOS DE ALUGAR COM A{" "}
          <span className="text-gradient-cyan">LOCAR LIMA</span>
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {benefits.map((b) => (
            <motion.div
              key={b.title}
              variants={staggerItem}
              className="bg-card rounded-lg p-6 border border-border hover:border-cyan-glow transition-colors group"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <b.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-foreground text-sm uppercase mb-3">{b.title}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{b.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
