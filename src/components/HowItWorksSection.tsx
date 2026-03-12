import { motion } from "framer-motion";
import { ClipboardList, Car, ShieldCheck } from "lucide-react";
import { fadeUp, fadeLeft, fadeRight, staggerContainer, staggerItem, viewportConfig } from "@/lib/animations";

const steps = [
  {
    icon: ClipboardList,
    title: "CADASTRO",
    description: "Preencha nosso formulario, realize seu cadastro e envie todos os documentos necessarios. As nossas analises sao feitas em ate 48h.",
  },
  {
    icon: Car,
    title: "ESCOLHA SEU CARRO",
    description: "Temos uma frota diversificada. Escolha o modelo predileto no momento da retirada. Nao fazemos reservas de modelos.",
  },
  {
    icon: ShieldCheck,
    title: "DIRIJA COM TRANQUILIDADE",
    description: "Dirija com tranquilidade. Nossos carros possuem seguro total e manutencao em dia.",
  },
];

const documents = [
  "CNH (aberta e legivel)",
  "Comprovante de endereco (ate 3 meses)",
  "Print do App (Uber/99) com foto, corridas e estrelas",
  "Foto da frente da residencia com garagem",
  "Certidao de Pontuacao da CNH (site do Detran)",
  "3 contatos de pessoas proximas",
  "E-mail para envio do contrato",
];

const requirements = [
  "Morar em Itaquaquecetuba ou regiao (Poa, Suzano, Aruja, Mogi das Cruzes, Guarulhos e regiao)",
  "Ter cadastro em aplicativo de corrida ha 6 meses ou mais",
  "Ter 25 anos ou mais",
  "CNH valida com 3 anos ou mais de habilitacao",
  "Possuir no minimo 500 corridas comprovadas",
  "Possuir garagem na propria residencia",
];

const HowItWorksSection = () => {
  return (
    <section id="como-funciona" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="section-title text-center mb-12"
        >
          <span className="text-gradient-cyan">COMO FUNCIONA</span>
        </motion.h2>

        {/* Steps */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={staggerItem}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <span className="text-primary font-heading font-extrabold text-4xl">{i + 1}</span>
              <h3 className="font-heading font-bold text-foreground uppercase mt-2 mb-3">{step.title}</h3>
              <p className="text-muted-foreground font-body text-sm">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Documents & Requirements */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <h3 className="font-heading font-bold text-foreground uppercase mb-4 border-b-2 border-cyan-glow pb-2 inline-block">
              Documentos Necessarios
            </h3>
            <ul className="space-y-3">
              {documents.map((doc) => (
                <li key={doc} className="flex items-start gap-2 text-sm text-muted-foreground font-body">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {doc}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <h3 className="font-heading font-bold text-foreground uppercase mb-4 border-b-2 border-cyan-glow pb-2 inline-block">
              Pre-Requisitos
            </h3>
            <ul className="space-y-3">
              {requirements.map((req) => (
                <li key={req} className="flex items-start gap-2 text-sm text-muted-foreground font-body">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
