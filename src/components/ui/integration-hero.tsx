"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";
import { Zap, Puzzle, Combine, ArrowRight } from "lucide-react";

interface IntegrationHeroProps {
  lang?: string;
  className?: string;
  badge?: string;
  title?: string;
  subtext?: string;
  ctaText?: string;
}

const integrationLogos = [
  { name: "Slack", color: "#4A154B" },
  { name: "Shopify", color: "#95BF47" },
  { name: "WhatsApp", color: "#25D366" },
  { name: "HubSpot", color: "#FF7A59" },
  { name: "Salesforce", color: "#00A1E0" },
  { name: "Stripe", color: "#008CDD" },
  { name: "Notion", color: "#000000" },
  { name: "Zapier", color: "#FF4A00" },
  { name: "Gmail", color: "#EA4335" },
  { name: "Figma", color: "#F24E1E" },
  { name: "TikTok", color: "#000000" },
  { name: "Meta", color: "#0668E1" },
  { name: "Google Drive", color: "#4285F4" },
  { name: "Airtable", color: "#18BFFF" },
  { name: "Intercom", color: "#000000" },
  { name: "Mailchimp", color: "#FFE01B" },
  { name: "Typeform", color: "#262627" },
  { name: "Webflow", color: "#4353FF" },
];

export function IntegrationHero({
  lang = "es",
  className,
  badge = "⚡ Integraciones",
  title = "Integra tus herramientas favoritas",
  subtext = "Más de 250 aplicaciones líderes disponibles para integrarse sin fricciones en tu flujo de trabajo.",
  ctaText = "Comenzar ahora"
}: IntegrationHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const x3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  // Split logos into 3 rows
  const row1 = integrationLogos.slice(0, 6);
  const row2 = integrationLogos.slice(6, 12);
  const row3 = integrationLogos.slice(12, 18);

  return (
    <section
      ref={containerRef}
      className={cn(
        "py-32 px-6 bg-white relative overflow-hidden flex flex-col items-center justify-center",
        className
      )}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,6,19,0.1)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sasori-red/5 border border-sasori-red/10 mb-8"
        >
          <Zap className="w-4 h-4 text-sasori-red" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sasori-red">
            {badge}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-[#1A1A1A] mb-8 leading-none"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-black/50 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12"
        >
          {subtext}
        </motion.p>
      </div>

      {/* Integration Logos Grid / Marquee */}
      <div className="w-full relative space-y-8 overflow-hidden py-10">
        {/* Row 1 */}
        <motion.div style={{ x: x1 }} className="flex gap-8 whitespace-nowrap px-4 justify-center">
          {[...row1, ...row1, ...row1].map((logo, i) => (
            <LogoIcon key={i} name={logo.name} color={logo.color} />
          ))}
        </motion.div>
        
        {/* Row 2 */}
        <motion.div style={{ x: x2 }} className="flex gap-8 whitespace-nowrap px-4 justify-center">
          {[...row2, ...row2, ...row2].map((logo, i) => (
            <LogoIcon key={i} name={logo.name} color={logo.color} />
          ))}
        </motion.div>

        {/* Row 3 */}
        <motion.div style={{ x: x3 }} className="flex gap-8 whitespace-nowrap px-4 justify-center">
          {[...row3, ...row3, ...row3].map((logo, i) => (
            <LogoIcon key={i} name={logo.name} color={logo.color} />
          ))}
        </motion.div>

        {/* Ambient Gradients to hide edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      </div>

      {/* Final CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-20"
      >
        <button
          onClick={() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group flex items-center gap-4 bg-[#1A1A1A] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-sasori-red transition-all duration-300 shadow-2xl"
        >
          {ctaText}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      {/* Connectivity Lines - Subtle Background */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-black/5 w-full pointer-events-none" />
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-black/5 -translate-x-1/2 pointer-events-none" />
    </section>
  );
}

function LogoIcon({ name, color }: { name: string; color: string }) {
  return (
    <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl border border-black/5 shadow-lg shadow-black/[0.02] hover:shadow-xl transition-all duration-500 group cursor-default">
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500"
        style={{ backgroundColor: color }}
      >
        {name.charAt(0)}
      </div>
      <span className="text-sm font-bold tracking-tight text-[#1A1A1A] opacity-40 group-hover:opacity-100 transition-opacity">
        {name}
      </span>
    </div>
  );
}
