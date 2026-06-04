import React from "react";
import { motion } from "framer-motion";

interface FeaturesProps {
  features: {
    id: number;
    icon: React.ElementType;
    title: string;
    description: string;
    image?: string;
  }[];
  primaryColor?: string;
  progressGradientLight?: string;
  progressGradientDark?: string;
  headerTitle?: string;
  headerSubtitle?: string;
}

export function Features({ features, headerTitle = "Nuestros Servicios", headerSubtitle = "SasoriLabs Ecosystem" }: FeaturesProps) {
  // Duplicate cards to create a seamless infinite loop
  const doubled = [...features, ...features];

  return (
    <div className="py-20 bg-transparent overflow-hidden">
      {/* Keyframe style injected inline */}
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-left 40s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-12 px-4">
        <span className="text-sasori-red font-black text-[10px] md:text-xs uppercase tracking-[0.3em]">
          {headerSubtitle}
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-black dark:text-white mt-4 uppercase tracking-tighter">
          {headerTitle}
        </h2>
        <div className="w-12 h-1 bg-sasori-red mx-auto mt-6 rounded-full" />
      </div>

      {/* Infinite Marquee */}
      <div className="relative w-full overflow-hidden">
        {/* Left fade mask */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10"
          style={{ background: "linear-gradient(to right, var(--bg-dark, #080808), transparent)" }} />
        {/* Right fade mask */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10"
          style={{ background: "linear-gradient(to left, var(--bg-dark, #080808), transparent)" }} />

        <div className="marquee-track flex gap-6 w-max py-4 px-3">
          {doubled.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={`${feature.id}-${index}`}
                whileHover={{ scale: 1.03, y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative flex-shrink-0 w-[280px] h-[420px] rounded-[2rem] overflow-hidden cursor-pointer group"
                style={{
                  background: "linear-gradient(160deg, #0a0a0a 0%, #1c0505 40%, #3d0808 100%)",
                  border: "1px solid rgba(180, 10, 10, 0.25)",
                }}
              >
                {/* Glow accent */}
                <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-sasori-red/20 blur-3xl group-hover:bg-sasori-red/40 transition-colors duration-700" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-sasori-red/10 blur-2xl group-hover:bg-sasori-red/25 transition-colors duration-700" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-20 h-20 rounded-full bg-sasori-red/90 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(226,6,19,0.5)] border border-white/20"
                  >
                    <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                  </motion.div>

                  <h3 className="text-xl font-black uppercase tracking-[0.15em] text-white mb-4 leading-tight">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-white/70 font-medium leading-relaxed max-w-[220px]">
                    {feature.description}
                  </p>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-1 bg-sasori-red rounded-full" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
