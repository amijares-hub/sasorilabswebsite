import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { FullScreenScrollFX } from "./full-screen-scroll-fx";

const SERVICE_ROUTES: Record<string, string> = {
  ai: "/services/ai-automation",
  web: "/services/immersive-webs",
  modern: "/services/modernization",
  security: "/services/cybersecurity",
  infra: "/services/infrastructure",
};

const sections_es = [
  {
    id: "ai",
    leftLabel: "Agentes",
    title: "Inteligencia Artificial",
    rightLabel: "Automatización",
    background: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1677442136019-21780ecad995?w=1600&q=80",
  },
  {
    id: "web",
    leftLabel: "Spatial",
    title: "Webs Inmersivas",
    rightLabel: "Next-Gen",
    background: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1639762681485-074b7f938ba0?w=1600&q=80",
  },
  {
    id: "modern",
    leftLabel: "Legacy",
    title: "Modernización",
    rightLabel: "Cloud",
    background: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1614850523296-d8c1af93d400?w=1600&q=80",
  },
  {
    id: "security",
    leftLabel: "Privacidad",
    title: "Ciberseguridad",
    rightLabel: "Blindaje",
    background: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1550751827-4bd374c3f58b?w=1600&q=80",
  },
  {
    id: "infra",
    leftLabel: "Serverless",
    title: "Infraestructura",
    rightLabel: "DevOps",
    background: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1451187580459-43490279c0fa?w=1600&q=80",
  },
];

const sections_en = [
  {
    id: "ai",
    leftLabel: "Agents",
    title: "Artificial Intelligence",
    rightLabel: "Automation",
    background: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1677442136019-21780ecad995?w=1600&q=80",
  },
  {
    id: "web",
    leftLabel: "Spatial",
    title: "Immersive Webs",
    rightLabel: "Next-Gen",
    background: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1639762681485-074b7f938ba0?w=1600&q=80",
  },
  {
    id: "modern",
    leftLabel: "Legacy",
    title: "Modernization",
    rightLabel: "Cloud",
    background: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1614850523296-d8c1af93d400?w=1600&q=80",
  },
  {
    id: "security",
    leftLabel: "Privacy",
    title: "Cybersecurity",
    rightLabel: "Shielding",
    background: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1550751827-4bd374c3f58b?w=1600&q=80",
  },
  {
    id: "infra",
    leftLabel: "Serverless",
    title: "Infrastructure",
    rightLabel: "DevOps",
    background: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1451187580459-43490279c0fa?w=1600&q=80",
  },
];

const NavCTA = ({
  serviceId,
  label,
  navigate,
}: {
  serviceId: string;
  label: string;
  navigate: ReturnType<typeof useNavigate>;
}) => (
  <button
    onClick={() => navigate(SERVICE_ROUTES[serviceId] ?? "/")}
    className="fx-nav-cta"
    aria-label={`Go to ${label} page`}
  >
    {label} <ArrowUpRight className="fx-nav-cta-icon" />
  </button>
);

export function ServicesScrollFX({ lang = "es" }: { lang?: "es" | "en" }) {
  const navigate = useNavigate();
  const ctaLabel = lang === "es" ? "Explorar Servicio" : lang === "zh" ? "探索服務" : lang === "ru" ? "Изучить услугу" : lang === "pt" ? "Explorar Serviço" : "Explore Service";

  // Enrich sections with renderBackground that adds a click-through CTA
  const buildSections = (base: typeof sections_es) =>
    base.map((s) => ({
      ...s,
      renderBackground: (active: boolean) => (
        <div className="relative w-full h-full">
          <img loading="lazy"
            src={s.background}
            alt=""
            className="absolute inset-0 w-full h-full object-cover brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          {/* CTA pin at bottom center — only visible on active slide */}
          {active && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 animate-fadeInUp">
              <NavCTA serviceId={s.id} label={ctaLabel} navigate={navigate} />
              <div className="w-px h-8 bg-[#E20613]/60" />
            </div>
          )}
        </div>
      ),
    }));

  return (
    <FullScreenScrollFX
      sections={buildSections(lang === "es" ? sections_es : sections_en)}
      header={
        <>
          <div className="fx-header-tag">● SASORILABS</div>
          <div>{lang === "es" ? "NUESTRAS CAPACIDADES" : lang === "zh" ? "我們的能力" : lang === "ru" ? "НАШИ ВОЗМОЖНОСТИ" : lang === "pt" ? "NOSSAS CAPACIDADES" : "OUR CAPABILITIES"}</div>
        </>
      }
      footer={
        <div className="fx-footer-sub">
          {lang === "es" ? "TECNOLOGÍA DE PRÓXIMA GENERACIÓN" : lang === "zh" ? "下一代技術" : lang === "ru" ? "ТЕХНОЛОГИИ НОВОГО ПОКОЛЕНИЯ" : lang === "pt" ? "TECNOLOGIA DA PRÓXIMA GERAÇÃO" : "NEXT GENERATION TECHNOLOGY"}
        </div>
      }
      showProgress
      bgTransition="fade"
      parallaxAmount={4}
      durations={{ change: 0.7, snap: 800 }}
      colors={{
        text: "rgba(245,245,245,0.92)",
        overlay: "rgba(0,0,0,0.0)",
        pageBg: "#000000",
        stageBg: "#000000",
      }}
    />
  );
}
