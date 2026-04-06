import { cn } from "@/src/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 gap-4",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-sasori-red/[0.1] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <div className="flex flex-col gap-2">
              {item.icon && (
                <div className="w-10 h-10 rounded-full bg-sasori-red/10 flex items-center justify-center text-sasori-red mb-2 transition-transform group-hover:scale-110">
                  {item.icon}
                </div>
              )}
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-xl h-full w-full p-6 overflow-hidden bg-[#EDEDED] border border-black/5 group-hover:border-sasori-red/30 relative z-20 transition-all duration-500 shadow-[inset_-1px_-1px_6px_rgba(255,255,255,0.7),inset_1px_1px_6px_rgba(0,0,0,0.03),5px_5px_15px_rgba(0,0,0,0.05)]",
        className
      )}
    >
      {/* Metallic brushed effect overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
      
      {/* Red Tech Strip */}
      <div className="absolute top-0 right-4 w-[2px] h-0 bg-sasori-red shadow-[0_0_15px_#E20613] group-hover:h-full transition-all duration-700 delay-100" />
      <div className="absolute top-0 left-0 w-8 h-[1px] bg-sasori-red/30 group-hover:bg-sasori-red transition-colors duration-500" />

      <div className="relative z-50 transition-transform duration-500 group-hover:translate-x-1">
        <div>{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-[#1A1A1A] font-black uppercase tracking-tighter text-xl mt-4", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-4 text-[#1A1A1A]/60 font-medium tracking-tight leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
