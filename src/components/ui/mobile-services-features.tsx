import React from "react";
import { Features } from "./features";
import { Rocket, Building, Store, Cpu, Brain, Globe, Code } from "lucide-react";
import { translations } from "../../i18n/translations";

export function MobileServicesFeatures({ lang = 'es' }: { lang?: string }) {
  const t = translations[lang as keyof typeof translations] || translations['es'];

  const features = [
    {
      id: 1,
      icon: Rocket,
      title: t.services?.entrepreneurs?.title || "Fundadores",
      description: t.services?.entrepreneurs?.desc || "Infraestructura tecnológica para crecimiento exponencial.",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      icon: Building,
      title: t.services?.companies?.title || "Corporativos",
      description: t.services?.companies?.desc || "Optimización de sistemas legacy y procesos complejos.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      icon: Store,
      title: t.services?.pymes?.title || "PYMES Elite",
      description: t.services?.pymes?.desc || "Digitalización y gemelos operativos para negocios locales.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 4,
      icon: Cpu,
      title: t.servicesPages?.automation?.hero || "Agentes Autónomos",
      description: t.servicesPages?.automation?.subtext || "Automatización de procesos para ahorrar tiempo.",
      image: "https://images.unsplash.com/photo-148527404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 5,
      icon: Brain,
      title: t.servicesPages?.employees?.hero || "Empleados Digitales",
      description: t.servicesPages?.employees?.subtext || "Tu negocio en piloto automático con precisión.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 6,
      icon: Globe,
      title: t.servicesPages?.immersive?.hero || "Webs Inmersivas",
      description: t.servicesPages?.immersive?.subtext || "Experiencias de vanguardia visual en 3D.",
      image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 7,
      icon: Code,
      title: t.servicesPages?.modernization?.hero || "Aceleración",
      description: t.servicesPages?.modernization?.subtext || "Eliminamos lastre tecnológico para ganar velocidad.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="bg-bg-dark border-y border-black/5">
      <Features 
        primaryColor="sasori-red"
        progressGradientLight="bg-gradient-to-r from-sasori-red to-sasori-red/50"
        progressGradientDark="bg-gradient-to-r from-sasori-red to-sasori-red/50" 
        features={features} 
        headerTitle={t.services?.section_title || "Nuestros Servicios"}
        headerSubtitle={t.ecosystem?.title || "SasoriLabs Ecosystem"}
      />
    </div>
  );
}
