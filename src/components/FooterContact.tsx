import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";
import { fadeUp, staggerContainer, staggerItem, viewportConfig } from "@/lib/animations";

const WHATSAPP_URL = "https://wa.me/5511986608416";

const FooterContact = () => {
  return (
    <footer id="contato" className="py-16 bg-navy-deep border-t border-border w-full overflow-x-hidden">
      <div className="container mx-auto px-4 w-full max-w-[100vw] box-border">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="section-title text-center mb-12"
        >
          <span className="text-gradient-cyan">FALE CONOSCO</span>
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full min-w-0"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {/* WhatsApp Numbers - Centralized */}
          <div className="md:col-span-2 flex flex-wrap justify-center gap-8">
            <motion.a
              variants={staggerItem}
              href="https://wa.me/5511986608416"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <span className="text-foreground font-body">(11) 98660-8416</span>
            </motion.a>

            <motion.a
              variants={staggerItem}
              href="https://wa.me/5511989639642"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <span className="text-foreground font-body">(11) 98963-9642</span>
            </motion.a>
          </div>

          {/* Email */}
          <motion.a
            variants={staggerItem}
            href="mailto:contatolocar@gmail.com"
            className="flex flex-col items-center gap-3 group"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <span className="text-foreground font-body text-sm break-all">contatolocar@gmail.com</span>
          </motion.a>

          {/* Address */}
          <motion.div
            variants={staggerItem}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <span className="text-foreground font-body text-sm">Itaquaquecetuba - SP</span>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mt-16 pt-8 border-t border-border flex flex-col items-center gap-4"
        >
          <img src={logo} alt="Locar Lima" className="h-10 opacity-60" />
          <p className="text-muted-foreground text-xs font-body">
            Locar Lima Locacao de Veiculos LTDA-ME. Todos os direitos reservados.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterContact;
