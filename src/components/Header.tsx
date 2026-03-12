import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";

const WHATSAPP_NUMBERS = [
  { label: "(11) 98660-8416", url: "https://wa.me/5511986608416" },
  { label: "(11) 98963-9642", url: "https://wa.me/5511989639642" },
];

const NAV_LINKS = [
  { label: "Inicio", href: "#hero" },
  { label: "Sobre", href: "#sobre" },
  { label: "Frota", href: "#frota" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Investidores", href: "#investidores" },
  { label: "Contato", href: "#contato" },
];

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-navy-deep/90 backdrop-blur-md border-b border-border w-full max-w-[100vw]"
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-4 w-full max-w-[100vw] box-border">
        <a href="#hero">
          <img src={logo} alt="Locar Lima" className="h-12" />
        </a>
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors font-heading uppercase tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-heading font-bold text-sm uppercase hover:shadow-cyan transition-all flex items-center gap-2"
          >
            Contato
            <ChevronDown className="w-4 h-4" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 bg-navy-deep border border-border rounded-lg shadow-lg overflow-hidden min-w-[180px]">
              {WHATSAPP_NUMBERS.map((num) => (
                <a
                  key={num.url}
                  href={num.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 text-sm text-foreground hover:bg-primary/10 transition-colors font-body"
                  onClick={() => setShowDropdown(false)}
                >
                  {num.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
