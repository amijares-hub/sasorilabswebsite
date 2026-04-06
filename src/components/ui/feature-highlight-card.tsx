import * as React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { Button } from "./button";
import { AIImageHover } from "../ai/AIImageHover";

interface FeatureHighlightCardProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description: string;
  buttonText: string;
  className?: string;
  onButtonClick?: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const imageContainerVariants: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    }
}

export const FeatureHighlightCard = React.forwardRef<
  HTMLDivElement,
  FeatureHighlightCardProps
>(({ imageSrc, imageAlt = "Feature image", title, description, buttonText, className, onButtonClick }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative w-full max-w-4xl overflow-hidden rounded-xl border border-black/10 bg-[#EDEDED] p-6 md:p-12 text-center shadow-[inset_-2px_-2px_10px_rgba(255,255,255,0.8),inset_2px_2px_10px_rgba(0,0,0,0.05),0_40px_80px_rgba(0,0,0,0.1)] mx-auto group",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Metallic brushed effect overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />

      {/* Tech Red Strips - inspired by image 1 */}
      <div className="absolute top-0 left-0 w-24 h-[2px] bg-sasori-red shadow-[0_0_15px_#E20613]" />
      <div className="absolute top-0 left-0 w-[2px] h-24 bg-sasori-red shadow-[0_0_15px_#E20613]" />
      
      <div className="absolute bottom-0 right-0 w-32 h-[1px] bg-sasori-red/40 rotate-[-15deg] shadow-[0_0_10px_#E20613] translate-x-10 translate-y-4" />
      <div className="absolute top-[20%] -right-4 w-1 h-32 bg-sasori-red/20 shadow-[0_0_15px_#E20613] skew-y-12" />

      {/* Decorative corner cutouts */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-white rotate-45 translate-x-6 -translate-y-6 border-l border-b border-black/10 transition-colors group-hover:bg-sasori-red/5" />
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-white rotate-45 -translate-x-6 translate-y-6 border-r border-t border-black/10 transition-colors group-hover:bg-sasori-red/5" />

      {/* Background glow effect */}
      <div className="absolute left-1/2 top-0 -z-10 h-[300px] md:h-[500px] w-[300px] md:w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sasori-red/10 blur-[80px] md:blur-[120px]" />
      
      {/* Image Section */}
      <motion.div variants={imageContainerVariants} className="mb-6 md:mb-10 flex justify-center px-4">
        <AIImageHover promptContext={title} className="w-auto h-auto inline-block">
          <img loading="lazy"
            src={imageSrc}
            alt={imageAlt}
            className="h-auto w-full max-w-xs md:max-w-md object-contain rounded-2xl shadow-xl border border-black/5"
          />
        </AIImageHover>
      </motion.div>

      {/* Title Section */}
      <motion.h2
        variants={itemVariants}
        className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tighter text-[#1A1A1A] uppercase leading-none mb-4 md:mb-6 px-2"
      >
        {title.split(' ').map((word, i) => (
          <span key={i} className={word.toLowerCase() === "gratuita" || word.toLowerCase() === "free" ? "text-sasori-red" : ""}>
            {word}{' '}
          </span>
        ))}
      </motion.h2>

      {/* Description Section */}
      <motion.p
        variants={itemVariants}
        className="mt-2 md:mt-4 text-sm md:text-xl text-[#1A1A1A]/50 max-w-2xl mx-auto font-medium leading-relaxed px-4 md:px-0"
      >
        {description}
      </motion.p>

      {/* Button Section */}
      <motion.div variants={itemVariants} className="mt-8 md:mt-12">
        <Button 
          size="lg" 
          onClick={onButtonClick}
          className="bg-sasori-red text-white font-black hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 rounded-full px-8 md:px-12 py-6 md:py-8 text-sm md:text-lg uppercase tracking-widest shadow-[0_0_50px_rgba(226,6,19,0.3)] hover:shadow-black/10"
        >
          {buttonText}
        </Button>
      </motion.div>
    </motion.div>
  );
});

FeatureHighlightCard.displayName = "FeatureHighlightCard";
