// onix-plus removed
import tcross1 from "@/assets/tcross-1.jpg";
import tcross2 from "@/assets/tcross-2.jpg";
import tcross3 from "@/assets/tcross-3.jpg";
import tcross4 from "@/assets/tcross-4.jpg";
import tcross5 from "@/assets/tcross-5.jpg";
import tcross6 from "@/assets/tcross-6.jpg";
import tcross7 from "@/assets/tcross-7.jpg";
import tcross8 from "@/assets/tcross-8.jpg";
import nivus1 from "@/assets/nivus-1.jpg";
import nivus2 from "@/assets/nivus-2.jpg";
import nivus3 from "@/assets/nivus-3.jpg";
import nivus4 from "@/assets/nivus-4.jpg";
import nivus5 from "@/assets/nivus-5.jpg";
import nivus6 from "@/assets/nivus-6.jpg";
import nivus7 from "@/assets/nivus-7.jpg";
import nivus8 from "@/assets/nivus-8.jpg";
import nivus9 from "@/assets/nivus-9.jpg";
import nivus10 from "@/assets/nivus-10.jpg";
import nivus11 from "@/assets/nivus-11.jpg";
import nivus12 from "@/assets/nivus-12.jpg";
import nivus13 from "@/assets/nivus-13.jpg";
import nivus14 from "@/assets/nivus-14.jpg";
import nivus15 from "@/assets/nivus-15.jpg";
import nivus16 from "@/assets/nivus-16.jpg";
import nivus17 from "@/assets/nivus-17.jpg";
import nivus18 from "@/assets/nivus-18.jpg";
import nivus19 from "@/assets/nivus-19.jpg";
import nivus20 from "@/assets/nivus-20.jpg";
import gol1 from "@/assets/gol-1.jpg";
import gol2 from "@/assets/gol-2.jpg";
import byd1 from "@/assets/byd-1.jpg";
import byd2 from "@/assets/byd-2.jpg";
import byd3 from "@/assets/byd-3.jpg";
import byd4 from "@/assets/byd-4.jpg";
import byd5 from "@/assets/byd-5.jpg";
import byd6 from "@/assets/byd-6.jpg";
import byd7 from "@/assets/byd-7.jpg";
import byd8 from "@/assets/byd-8.jpg";
import byd9 from "@/assets/byd-9.jpg";
import byd10 from "@/assets/byd-10.jpg";
import spin1 from "@/assets/spin-1.jpg";
import spin2 from "@/assets/spin-2.jpg";
import spin3 from "@/assets/spin-3.jpg";
import spin4 from "@/assets/spin-4.jpg";
import spin5 from "@/assets/spin-5.jpg";
import spin6 from "@/assets/spin-6.jpg";
import spin7 from "@/assets/spin-7.jpg";
import onixJoy1 from "@/assets/onix-1.jpg";
import onixJoy2 from "@/assets/onix-2.jpg";
import onixJoy3 from "@/assets/onix-3.jpg";
import onixJoy4 from "@/assets/onix-4.jpg";

export interface VehiclePlan {
  name: string;
  firstWeek: string;
  weekly: string;
  kmLimit: string;
  maintenance: string;
  includes: string[];
  total: string;
  description: string;
  highlight: boolean;
}

export interface Vehicle {
  slug: string;
  name: string;
  category: string;
  coverImage: string;
  gallery: string[];
  caucao: string;
  plans: VehiclePlan[];
}

export const vehicles: Vehicle[] = [
  {
    slug: "t-cross",
    name: "T-CROSS",
    category: "SUV",
    coverImage: tcross1,
    gallery: [tcross1, tcross2, tcross3, tcross4, tcross5, tcross6, tcross7, tcross8],
    caucao: "R$ 1.500,00",
    plans: [
      {
        name: "PLANO UNICO",
        firstWeek: "R$ 900,00",
        weekly: "R$ 900,00",
        kmLimit: "Consulte",
        maintenance: "Consulte",
        includes: ["Seguro incluso", "IPVA incluso"],
        total: "R$ 2.400,00",
        description: "SUV completo com teto solar, interior premium e muito conforto!",
        highlight: true,
      },
    ],
  },
  {
    slug: "nivus",
    name: "NIVUS",
    category: "SUV COMPACTO",
    coverImage: nivus1,
    gallery: [nivus1, nivus2, nivus3, nivus4, nivus5, nivus6, nivus7, nivus8, nivus9, nivus10, nivus11, nivus12, nivus13, nivus14, nivus15, nivus16, nivus17, nivus18, nivus19, nivus20],
    caucao: "R$ 1.600,00",
    plans: [
      {
        name: "PLANO UNICO",
        firstWeek: "R$ 1.000,00",
        weekly: "R$ 1.000,00",
        kmLimit: "Consulte",
        maintenance: "Consulte",
        includes: ["Seguro incluso", "IPVA incluso"],
        total: "R$ 2.600,00",
        description: "SUV compacto com design moderno, teto solar panoramico e interior premium!",
        highlight: true,
      },
    ],
  },
  {
    slug: "gol",
    name: "GOL",
    category: "HATCH",
    coverImage: gol1,
    gallery: [gol1, gol2],
    caucao: "R$ 1.200,00",
    plans: [
      {
        name: "PLANO UNICO",
        firstWeek: "R$ 680,00",
        weekly: "R$ 680,00",
        kmLimit: "Consulte",
        maintenance: "Consulte",
        includes: ["Seguro incluso", "IPVA incluso"],
        total: "R$ 1.880,00",
        description: "Hatch economico e pratico, ideal para o dia a dia na cidade!",
        highlight: true,
      },
    ],
  },
  {
    slug: "byd-dolphin",
    name: "BYD DOLPHIN",
    category: "ELETRICO",
    coverImage: byd1,
    gallery: [byd1, byd2, byd3, byd4, byd5, byd6, byd7, byd8, byd9, byd10],
    caucao: "R$ 1.500,00",
    plans: [
      {
        name: "PLANO UNICO",
        firstWeek: "R$ 950,00",
        weekly: "R$ 950,00",
        kmLimit: "Consulte",
        maintenance: "Consulte",
        includes: ["Seguro incluso", "IPVA incluso"],
        total: "R$ 2.450,00",
        description: "100% eletrico, economico e sustentavel! Ideal para quem quer inovacao e baixo custo de manutencao.",
        highlight: true,
      },
    ],
  },
  {
    slug: "spin",
    name: "SPIN",
    category: "MINIVAN",
    coverImage: spin1,
    gallery: [spin1, spin2, spin3, spin4, spin5, spin6, spin7],
    caucao: "R$ 1.200,00",
    plans: [
      {
        name: "PLANO UNICO",
        firstWeek: "R$ 650,00",
        weekly: "R$ 650,00",
        kmLimit: "Consulte",
        maintenance: "Consulte",
        includes: ["Seguro incluso", "IPVA incluso"],
        total: "R$ 1.850,00",
        description: "Minivan espacosa para familia ou grupos! 7 lugares e porta-malas generoso.",
        highlight: true,
      },
    ],
  },
  {
    slug: "onix-joy",
    name: "ONIX JOY",
    category: "HATCH",
    coverImage: onixJoy1,
    gallery: [onixJoy1, onixJoy2, onixJoy3, onixJoy4],
    caucao: "R$ 1.300,00",
    plans: [
      {
        name: "PLANO UNICO",
        firstWeek: "R$ 700,00",
        weekly: "R$ 700,00",
        kmLimit: "Consulte",
        maintenance: "Consulte",
        includes: ["Seguro incluso", "IPVA incluso"],
        total: "R$ 2.000,00",
        description: "Hatch economico e confiavel, ideal para aplicativos e dia a dia!",
        highlight: true,
      },
    ],
  },
];
