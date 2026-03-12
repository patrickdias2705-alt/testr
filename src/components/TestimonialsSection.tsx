import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { fadeUp, staggerContainer, staggerItem, viewportConfig } from "@/lib/animations";

const testimonials = [
  {
    name: "Caroline",
    location: "Sao Paulo",
    text: "Investir com a Locarlima foi a minha melhor escolha, meu carro estava parado na garagem e hoje e a minha fonte de renda mensal.",
  },
  {
    name: "Israel",
    location: "Sao Paulo",
    text: "Sou motorista ha 2 anos, e a Locarlima me deu todo o suporte para hoje eu ter uma renda! Os carros sao otimos e o profissionalismo de voces, excelente!",
  },
  {
    name: "Julio",
    location: "Sao Paulo",
    text: "Investi meu carro na Locarlima e foi a melhor coisa que fiz! Alem de ver meu carro render muito todo mes, fiquei impressionado com a competencia e atendimento.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="section-title text-center mb-12"
        >
          CONFIRA O QUE FALAM{" "}
          <span className="text-gradient-cyan">SOBRE NOS</span>
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={staggerItem}
              className="bg-card rounded-xl p-6 border border-border"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-gold fill-gold" />
                ))}
              </div>
              <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              <div>
                <p className="font-heading font-bold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground font-body">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
