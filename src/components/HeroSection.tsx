import { motion } from "framer-motion";
import heroImg from "@/assets/hero-driver.jpg";
import { fadeUp, scaleIn } from "@/lib/animations";

const WHATSAPP_URL = "https://wa.me/5511986608416";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          src={heroImg}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-24">
        <div className="max-w-2xl">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="section-title text-foreground leading-tight mb-4"
          >
            ONDE ALUGAR E INVESTIR SE TRANSFORMAM{" "}
            <span className="text-gradient-cyan">EM SUCESSO E RENTABILIDADE</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 font-body"
          >
            Descubra como a Locar Lima pode ser o seu melhor investimento, seja para alugar ou para investir!
          </motion.p>

          <motion.a
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-full font-heading font-bold text-lg uppercase shadow-cyan hover:scale-105 transition-transform"
          >
            Entre em Contato Agora
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
