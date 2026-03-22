import React, { useState } from 'react';
import { cn } from "@/src/lib/utils";
import { AIImageHover } from '../ai/AIImageHover';

// --- Accordion Item Component ---
const AccordionItem = ({ item, isActive, onMouseEnter }: { item: any, isActive: boolean, onMouseEnter: () => void }) => {
  return (
    <div
      className={cn(
        "relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-in-out border border-white/5",
        // Desktop: horizontal expansion
        "md:h-[500px] hidden md:block",
        isActive ? "md:w-[500px]" : "md:w-[80px]"
      )}
      onMouseEnter={onMouseEnter}
    >
      {/* Background Image */}
      <AIImageHover promptContext={item.title} className="absolute inset-0">
        <img loading="lazy"
          src={item.imageUrl}
          alt={item.title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-1000",
            isActive ? "scale-105" : "scale-100"
          )}
        />
      </AIImageHover>
      
      {/* Dynamic Overlay */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-700",
        isActive ? "bg-black/40" : "bg-black/70"
      )}></div>

      {/* Caption Text (Desktop) */}
      <div
        className={cn(
          "absolute transition-all duration-500 ease-in-out",
          isActive
            ? "bottom-8 left-8 right-8 opacity-100 translate-y-0"
            : "bottom-24 left-1/2 -translate-x-1/2 rotate-90 opacity-40"
        )}
      >
        <span className={cn(
          "text-white font-bold whitespace-nowrap uppercase tracking-tighter",
          isActive ? "text-3xl md:text-4xl" : "text-lg"
        )}>
          {item.title}
        </span>
        
        {isActive && item.description && (
          <p className="text-white/70 text-sm mt-2 line-clamp-2 max-w-sm animate-fadeIn">
            {item.description}
          </p>
        )}
      </div>
      
      {/* Glowing border for active item */}
      {isActive && (
        <div className="absolute inset-0 border-2 border-sasori-red/50 rounded-3xl pointer-events-none shadow-[inset_0_0_20px_rgba(226,6,19,0.3)]" />
      )}
    </div>
  );
};

// --- Mobile Accordion Item Component ---
const MobileAccordionItem = ({ item, isActive, onClick }: { item: any, isActive: boolean, onClick: () => void }) => {
  return (
    <div
      className={cn(
        "relative w-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out border border-white/5 md:hidden",
        isActive ? "h-[300px]" : "h-[80px]"
      )}
      onClick={onClick}
    >
      <AIImageHover promptContext={item.title} className="absolute inset-0 opacity-60">
        <img loading="lazy"
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </AIImageHover>
      <div className={cn(
        "absolute inset-0 transition-opacity duration-500",
        isActive ? "bg-black/40" : "bg-black/70"
      )}></div>
      
      <div className={cn(
        "absolute left-6 transition-all duration-500",
        isActive ? "bottom-6" : "top-1/2 -translate-y-1/2"
      )}>
        <h3 className={cn(
          "text-white font-black uppercase tracking-tighter transition-all",
          isActive ? "text-2xl" : "text-base"
        )}>
          {item.title}
        </h3>
        {isActive && item.description && (
          <p className="text-white/60 text-xs mt-2 line-clamp-2 pr-4 animate-fadeInUp">
            {item.description}
          </p>
        )}
      </div>

      {isActive && (
        <div className="absolute inset-0 border border-sasori-red/50 rounded-2xl pointer-events-none shadow-[inset_0_0_15px_rgba(226,6,19,0.2)]" />
      )}
    </div>
  );
};


// --- Main App Component ---
export function LandingAccordionItem({ 
  title, 
  subtitle, 
  items, 
  ctaText = "Contáctanos",
  onCtaClick 
}: { 
  title: string, 
  subtitle: string, 
  items: any[], 
  ctaText?: string,
  onCtaClick?: () => void 
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleItemHover = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="bg-black py-12 md:py-20 px-4 md:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-16">
          
          {/* Left Side: Text Content */}
          <div className="w-full lg:w-2/5 text-center lg:text-left">
            <h2 className="text-4xl md:text-7xl font-black text-white leading-none tracking-tighter uppercase">
              {title.split(' ').map((word, i) => (
                <span key={i} className={i === title.split(' ').length - 1 ? "text-sasori-red" : ""}>
                  {word}{' '}
                </span>
              ))}
            </h2>
            <p className="mt-4 md:mt-8 text-base md:text-xl text-white/50 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              {subtitle}
            </p>
            <div className="mt-8 md:mt-10 mb-8 md:mb-0">
              <button
                onClick={onCtaClick}
                className="inline-flex items-center gap-3 bg-sasori-red text-white font-black px-8 md:px-10 py-4 md:py-5 rounded-full shadow-[0_0_40px_rgba(226,6,19,0.3)] hover:bg-white hover:text-sasori-red transition-all duration-300 uppercase tracking-widest text-xs md:text-sm"
              >
                {ctaText}
              </button>
            </div>
          </div>

          {/* Right Side: Image Accordion */}
          <div className="w-full lg:w-3/5">
            {/* Desktop View */}
            <div className="hidden md:flex flex-row items-center justify-center gap-4 p-4 min-h-[550px]">
              {items.map((item, index) => (
                <AccordionItem
                  key={index}
                  item={item}
                  isActive={index === activeIndex}
                  onMouseEnter={() => handleItemHover(index)}
                />
              ))}
            </div>
            {/* Mobile View */}
            <div className="flex flex-col gap-3 md:hidden">
               {items.map((item, index) => (
                <MobileAccordionItem
                  key={index}
                  item={item}
                  isActive={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
