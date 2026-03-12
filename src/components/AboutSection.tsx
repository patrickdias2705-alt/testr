import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem, viewportConfig } from "@/lib/animations";

const AboutSection = () => {
  return (
    <section id="sobre" className="py-20 bg-navy-medium">
      <div className="container mx-auto px-4">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <h2 className="section-title mb-2">
            <span className="border-b-4 border-cyan-glow pb-2">SOBRE A LOCARLIMA</span>
          </h2>
        </motion.div>

        <motion.div
          className="mt-12 max-w-3xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <motion.p
            variants={staggerItem}
            className="text-lg text-muted-foreground leading-relaxed font-body mb-6"
          >
            Ha 5 anos no mercado, a LocarLima se destaca como uma referencia no aluguel de carros para motoristas de aplicativo. Somos reconhecidos pela nossa excelencia e rentabilidade, proporcionando solucoes eficazes tanto para motoristas quanto para investidores.
          </motion.p>
          <motion.p
            variants={staggerItem}
            className="text-lg text-muted-foreground leading-relaxed font-body"
          >
            Na LocarLima, voce encontra mais do que um servico de aluguel de carros; encontra uma parceria solida para o seu crescimento e sucesso. Seja voce um motorista buscando um veiculo de qualidade ou um investidor em busca de alta rentabilidade, a LocarLima e a escolha certa.
          </motion.p>
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mt-8 text-sm text-muted-foreground font-body"
        >
          CNPJ 38.178.171/0001-88 — LOCAR LIMA LOCACAO DE VEICULOS LTDA-ME
        </motion.p>
      </div>
    </section>
  );
};

export default AboutSection;
