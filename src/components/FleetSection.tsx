import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import { fadeUp, staggerContainer, staggerItem, viewportConfig } from "@/lib/animations";

const fleetViewport = { once: true, margin: "0px", amount: 0 };

const FleetSection = () => {
  return (
    <section id="frota" className="py-20 bg-navy-medium">
      <div className="container mx-auto px-4">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={fleetViewport}
          className="section-title text-center mb-4"
        >
          NOSSA <span className="text-gradient-cyan">FROTA</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={fleetViewport}
          className="text-center text-muted-foreground font-body mb-12 max-w-xl mx-auto"
        >
          Escolha o veiculo ideal para voce. Clique para ver mais fotos e alugar.
        </motion.p>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={fleetViewport}
        >
          {vehicles.map((vehicle) => (
            <motion.div key={vehicle.slug} variants={staggerItem} viewport={fleetViewport}>
              <Link
                to={`/veiculo/${vehicle.slug}`}
                className="group block rounded-xl overflow-hidden border-2 border-border bg-card hover:border-cyan-glow transition-all duration-300 hover:shadow-cyan"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={vehicle.coverImage}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-heading text-primary uppercase tracking-wider">
                    {vehicle.category}
                  </span>
                  <h3 className="font-heading font-extrabold text-xl text-foreground mt-1">
                    {vehicle.name}
                  </h3>
                  <p className="text-muted-foreground text-sm font-body mt-1">
                    A partir de{" "}
                    <span className="text-primary font-bold">
                      {vehicle.plans[0].weekly}/semana
                    </span>
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-primary text-sm font-heading font-bold group-hover:gap-2 transition-all">
                    Ver detalhes <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
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

export default FleetSection;
