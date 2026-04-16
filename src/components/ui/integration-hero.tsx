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
  { name: "Slack", color: "#4A154B", slug: "slack" },
  { name: "Shopify", color: "#7AB55C", slug: "shopify" },
  { name: "WhatsApp", color: "#25D366", slug: "whatsapp" },
  { name: "HubSpot", color: "#FF7A59", slug: "hubspot" },
  { name: "Salesforce", color: "#00A1E0", slug: "salesforce" },
  { name: "Stripe", color: "#635BFF", slug: "stripe" },
  { name: "Notion", color: "#000000", slug: "notion" },
  { name: "Zapier", color: "#FF4F00", slug: "zapier" },
  { name: "Gmail", color: "#EA4335", slug: "gmail" },
  { name: "Figma", color: "#F24E1E", slug: "figma" },
  { name: "TikTok", color: "#000000", slug: "tiktok" },
  { name: "Meta", color: "#0668E1", slug: "meta" },
  { name: "Google Drive", color: "#4285F4", slug: "googledrive" },
  { name: "Airtable", color: "#18BFFF", slug: "airtable" },
  { name: "Intercom", color: "#000000", slug: "intercom" },
  { name: "Mailchimp", color: "#FFE01B", slug: "mailchimp" },
  { name: "Typeform", color: "#262627", slug: "typeform" },
  { name: "Webflow", color: "#4353FF", slug: "webflow" },
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

      <div className="max-w-4xl mx-auto text-center relative z-10 mb-10 md:mb-20">
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
          className="text-3xl sm:text-4xl md:text-7xl font-black uppercase tracking-tighter text-[#1A1A1A] mb-8 leading-none"
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
            <LogoIcon key={i} name={logo.name} color={logo.color} slug={logo.slug} />
          ))}
        </motion.div>
        
        {/* Row 2 */}
        <motion.div style={{ x: x2 }} className="flex gap-8 whitespace-nowrap px-4 justify-center">
          {[...row2, ...row2, ...row2].map((logo, i) => (
            <LogoIcon key={i} name={logo.name} color={logo.color} slug={logo.slug} />
          ))}
        </motion.div>

        {/* Row 3 */}
        <motion.div style={{ x: x3 }} className="flex gap-8 whitespace-nowrap px-4 justify-center">
          {[...row3, ...row3, ...row3].map((logo, i) => (
            <LogoIcon key={i} name={logo.name} color={logo.color} slug={logo.slug} />
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
          className="group flex items-center gap-4 bg-[#1A1A1A] text-white px-4 md:px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-sasori-red transition-all duration-300 shadow-2xl"
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

function LogoIcon({ name, color, slug }: { name: string; color: string; slug?: string }) {
  const logoUrl = slug 
    ? `https://api.iconify.design/simple-icons:${slug}.svg?color=white` 
    : null;

  return (
    <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-[18px] border border-black/5 shadow-sm hover:shadow-md hover:border-sasori-red/10 transition-all duration-500 group cursor-default min-w-[160px]">
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white overflow-hidden transition-all duration-700 p-2.5 shadow-inner"
        style={{ backgroundColor: color }}
      >
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt={name} 
            className="w-full h-full object-contain" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const span = document.createElement('span');
                span.className = "font-bold text-lg leading-none";
                span.innerText = name.charAt(0);
                parent.appendChild(span);
              }
            }}
          />
        ) : (
          <span className="font-bold text-lg italic">{name.charAt(0)}</span>
        )}
      </div>
      <span className="text-[14px] font-black uppercase tracking-tight text-[#1A1A1A]/40 group-hover:text-[#1A1A1A] transition-colors duration-500">
        {name}
      </span>
    </div>
  );
}
