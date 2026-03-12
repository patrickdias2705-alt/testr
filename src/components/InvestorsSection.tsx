import { motion } from "framer-motion";
import { TrendingUp, Eye, Percent, HandCoins } from "lucide-react";
import { fadeUp, scaleIn, staggerContainer, staggerItem, viewportConfig } from "@/lib/animations";

const WHATSAPP_URL = "https://wa.me/5511986608416";

const investorBenefits = [
  {
    icon: TrendingUp,
    title: "NEGOCIO RENTAVEL",
    description: "Nossos planos garantem um retorno de mais de 3% ao mes, tornando-se uma opcao atraente e segura.",
  },
  {
    icon: HandCoins,
    title: "PRATICIDADE",
    description: "Fazemos todo o trabalho: manutencao, cobrancas, lancamento de multas, busca e entrega de veiculos.",
  },
  {
    icon: Percent,
    title: "DESCONTOS NA COMPRA",
    description: "Adquira veiculos com descontos de ate 30% abaixo da tabela Fipe com nossos fornecedores.",
  },
  {
    icon: Eye,
    title: "SEGURANCA",
    description: "Nossas vistorias sao semanais, proporcionando tranquilidade para motoristas e investidores.",
  },
];

const InvestorsSection = () => {
  return (
    <section id="investidores" className="py-20 bg-navy-medium">
      <div className="container mx-auto px-4">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="section-title text-center mb-4"
        >
          INVISTA NA LOCARLIMA:{" "}
          <span className="text-gradient-cyan">SEGURANCA E RETORNO GARANTIDO</span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="text-center max-w-2xl mx-auto text-muted-foreground font-body mb-6"
        >
          Voce tem um carro parado que nao usa? Na LocarLima, transformamos seu carro em sua renda mensal! Confie seu veiculo a nos e garantimos uma renda mensal, alugando-o para motoristas criteriosamente selecionados.
        </motion.p>

        <div className="flex justify-center mb-12">
          <motion.a
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-heading font-bold uppercase shadow-cyan hover:scale-105 transition-transform"
          >
            Quero Investir
          </motion.a>
        </div>

        <motion.h3
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="section-title text-center text-2xl md:text-3xl mb-10"
        >
          BENEFICIOS DE INVESTIR COM A{" "}
          <span className="text-gradient-cyan">LOCAR LIMA</span>
        </motion.h3>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {investorBenefits.map((b) => (
            <motion.div
              key={b.title}
              variants={staggerItem}
              className="bg-card rounded-lg p-6 border border-border hover:border-cyan-glow transition-colors group"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <b.icon className="w-7 h-7 text-primary" />
              </div>
              <h4 className="font-heading font-bold text-foreground text-sm uppercase mb-3">{b.title}</h4>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{b.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default InvestorsSection;
