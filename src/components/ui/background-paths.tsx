"use client";

import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function FloatingPaths({ position }: { position: number }) {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const paths = Array.from({ length: isMobile ? 18 : 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        color: `rgba(226,6,19,${0.05 + i * 0.01})`, // Adapted to Sasori Red
        width: 0.5 + i * 0.03,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full text-sasori-red/20"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.1 + path.id * 0.03}
                        initial={{ pathLength: 0.3, opacity: 0.6 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.3, 0.6, 0.3],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths({
    title = "Background Paths",
    subtitle = "",
    ctaText = "Discover Excellence",
    onCtaClick,
    showContent = true,
}: {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    onCtaClick?: () => void;
    showContent?: boolean;
}) {
    const words = title.split(" ");
    const heroLogoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (showContent && heroLogoRef.current) {
            gsap.to(heroLogoRef.current, {
                scale: 1.1,
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    }, [showContent]);

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#F2F2F2]">
            {/* Tech Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            
            {/* Corner Panels (Decorative) */}
            <div className="absolute top-0 left-0 w-1/4 h-1/4 bg-white shadow-[20px_20px_40px_rgba(0,0,0,0.02)] border-r border-b border-black/5 -translate-y-1/2 -translate-x-1/2 rotate-45 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-white shadow-[-20px_-20px_40px_rgba(0,0,0,0.02)] border-l border-t border-black/5 translate-y-1/2 translate-x-1/2 rotate-45 pointer-events-none" />

            {/* Red Neon Strips */}
            <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] -left-[5%] w-[40%] h-[2px] bg-sasori-red shadow-[0_0_15px_#E20613] rotate-[-25deg] opacity-60 animate-pulse" />
                <div className="absolute bottom-[10%] -right-[5%] w-[50%] h-[1px] bg-sasori-red shadow-[0_0_10px_#E20613] rotate-[-25deg] opacity-40" />
            </div>

            <div className="absolute inset-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            {showContent && (
                <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div ref={heroLogoRef} className="mb-12 flex justify-center">
                            <img loading="lazy" 
                                src="/Logo.png" 
                                alt="SasoriLabs Logo" 
                                className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>

                        <h1 className="text-4xl sm:text-7xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tighter">
                            {words.map((word, wordIndex) => (
                                <span
                                    key={wordIndex}
                                    className="inline-block mr-4 last:mr-0"
                                >
                                    {word.split("").map((letter, letterIndex) => (
                                        <motion.span
                                            key={`${wordIndex}-${letterIndex}`}
                                            initial={{ y: 100, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                delay:
                                                    wordIndex * 0.1 +
                                                    letterIndex * 0.03,
                                                type: "spring",
                                                stiffness: 150,
                                                damping: 25,
                                            }}
                                            className="inline-block text-transparent bg-clip-text 
                                            bg-gradient-to-b from-[#1A1A1A] via-[#444444] to-[#1A1A1A]"
                                        >
                                            {letter}
                                        </motion.span>
                                    ))}
                                </span>
                            ))}
                        </h1>

                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 1 }}
                                className="text-lg md:text-2xl text-gray-600 mb-12 font-light tracking-wide"
                            >
                                {subtitle}
                            </motion.p>
                        )}

                        <div
                            className="inline-block group relative bg-gradient-to-b from-sasori-red/20 to-white/10 
                            p-px rounded-2xl backdrop-blur-lg 
                            overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <Button
                                variant="ghost"
                                onClick={onCtaClick}
                                className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                                bg-sasori-red hover:bg-sasori-red/90 
                                text-white transition-all duration-300 
                                group-hover:-translate-y-0.5 border border-sasori-red/20
                                hover:shadow-md hover:shadow-sasori-red/20"
                            >
                                <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                                    {ctaText}
                                </span>
                                <span
                                    className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                                    transition-all duration-300"
                                >
                                    →
                                </span>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
