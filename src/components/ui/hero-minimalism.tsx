import React, { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface MinimalHeroProps {
  brandText?: string;
  ctaText?: string;
  kickerText?: string;
  title: React.ReactNode;
  subtitle?: string;
  onCtaClick?: () => void;
  scrollPrompt?: string;
}

export default function MinimalHero({
  brandText = "SASORILABS",
  ctaText = "Contact",
  kickerText = "Introducing",
  title = <>Build fast.<br/>Ship clean.</>,
  subtitle = "A minimal React starter focused on clarity, speed, and maintainability.",
  onCtaClick,
  scrollPrompt = "SCROLL"
}: MinimalHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    setSize();

    type Particle = {
      x: number;
      y: number;
      speed: number;
      opacity: number;
      fadeDelay: number;
      fadeStart: number;
      fadingOut: boolean;
      color: string;
    };

    let particles: Particle[] = [];
    let raf = 0;

    const count = () => Math.floor((canvas.width * canvas.height) / 7000);

    const make = (): Particle => {
      const fadeDelay = Math.random() * 600 + 100;
      // Añadimos algunas partículas rojas
      const isRed = Math.random() > 0.85;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() / 5 + 0.1,
        opacity: 0.7,
        fadeDelay,
        fadeStart: Date.now() + fadeDelay,
        fadingOut: false,
        color: isRed ? "226, 6, 19" : "250, 250, 250"
      };
    };

    const reset = (p: Particle) => {
      p.x = Math.random() * canvas.width;
      p.y = Math.random() * canvas.height;
      p.speed = Math.random() / 5 + 0.1;
      p.opacity = 0.7;
      p.fadeDelay = Math.random() * 600 + 100;
      p.fadeStart = Date.now() + p.fadeDelay;
      p.fadingOut = false;
    };

    const init = () => {
      particles = [];
      for (let i = 0; i < count(); i++) particles.push(make());
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) reset(p);
        if (!p.fadingOut && Date.now() > p.fadeStart) p.fadingOut = true;
        if (p.fadingOut) {
          p.opacity -= 0.008;
          if (p.opacity <= 0) reset(p);
        }
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fillRect(p.x, p.y, 1, Math.random() * 2 + 1);
      });
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      setSize();
      init();
    };

    window.addEventListener("resize", onResize);
    init();
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="minimal-root">
      <style>{`
.minimal-root, .minimal-root * {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.minimal-root {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  --bg: #000000;
  --fg: #fafafa;
  --muted: #a1a1aa;
  --border: rgba(255, 255, 255, 0.1);
  --accent: #E20613;

  background: var(--bg);
  color: var(--fg);
}

/* header */
.minimal-header {
  position: absolute;
  top: 0; left: 0; right: 0;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  z-index: 20;
}
.minimal-brand {
  font-size: 14px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
  text-decoration: none;
}
.minimal-cta {
  height: 36px;
  padding: 0 16px;
  border-radius: 9999px;
  background: var(--accent);
  color: #fff;
  border: 1px solid var(--accent);
  font-size: 13px;
  font-weight: 600;
  line-height: 34px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 0 10px rgba(226, 6, 19, 0.3);
}
.minimal-cta:hover { 
  background: #fff; 
  color: var(--accent);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
}

/* hero center */
.minimal-hero {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;
  pointer-events: none;
  z-index: 10;
  padding: 20px;
}
.minimal-kicker {
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 16px;
  font-weight: 600;
}
.minimal-title {
  font-weight: 700;
  font-size: clamp(40px, 10vw, 88px);
  line-height: 1.1;
  margin: 0;
  color: var(--fg);
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.1);
  letter-spacing: -0.02em;
}
.minimal-subtitle {
  margin-top: 24px;
  font-size: clamp(14px, 4vw, 18px);
  color: var(--muted);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

/* accent lines container */
.minimal-accent-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

/* base line visuals */
.minimal-hline, .minimal-vline {
  position: absolute;
  background: var(--border);
  opacity: .5;
  will-change: transform, opacity;
}

/* horizontal lines */
.minimal-hline {
  height: 1px; left: 0; right: 0;
  transform: scaleX(0);
  transform-origin: 50% 50%;
  animation: minimalDrawX 800ms cubic-bezier(.22,.61,.36,1) forwards;
}
.minimal-hline:nth-child(1){ top: 20%; animation-delay: 150ms; }
.minimal-hline:nth-child(2){ top: 50%; animation-delay: 280ms; }
.minimal-hline:nth-child(3){ top: 80%; animation-delay: 410ms; }

/* vertical lines */
.minimal-vline {
  width: 1px; top: 0; bottom: 0;
  transform: scaleY(0);
  transform-origin: 50% 0%;
  animation: minimalDrawY 900ms cubic-bezier(.22,.61,.36,1) forwards;
}
.minimal-vline:nth-child(4){ left: 20%; animation-delay: 520ms; }
.minimal-vline:nth-child(5){ left: 50%; animation-delay: 640ms; }
.minimal-vline:nth-child(6){ left: 80%; animation-delay: 760ms; }

/* subtle gradient shimmer while drawing */
.minimal-hline::after, .minimal-vline::after{
  content:"";
  position:absolute;
  inset:0;
  background: linear-gradient(90deg, transparent, rgba(226, 6, 19,.4), transparent);
  opacity:0;
  animation: minimalShimmer 900ms ease-out forwards;
}
.minimal-hline:nth-child(1)::after{ animation-delay: 150ms; }
.minimal-hline:nth-child(2)::after{ animation-delay: 280ms; }
.minimal-hline:nth-child(3)::after{ animation-delay: 410ms; }
.minimal-vline:nth-child(4)::after{ animation-delay: 520ms; }
.minimal-vline:nth-child(5)::after{ animation-delay: 640ms; }
.minimal-vline:nth-child(6)::after{ animation-delay: 760ms; }

/* keyframes */
@keyframes minimalDrawX {
  0% { transform: scaleX(0); opacity: 0; }
  60% { opacity: .7; }
  100% { transform: scaleX(1); opacity: .5; }
}
@keyframes minimalDrawY {
  0% { transform: scaleY(0); opacity: 0; }
  60% { opacity: .7; }
  100% { transform: scaleY(1); opacity: .5; }
}
@keyframes minimalShimmer {
  0% { opacity: .0; }
  30% { opacity: .4; }
  100% { opacity: 0; }
}

/* canvas */
.minimal-particleCanvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: .5;
  z-index: 2;
}

.minimal-scroll-prompt {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 20;
  pointer-events: auto;
}
      `}</style>

      {/* Header */}
      <header className="minimal-header">
        <span className="minimal-brand neon-glow hidden">{brandText}</span>
        <button className="minimal-cta" type="button" onClick={onCtaClick}>
          {ctaText}
        </button>
      </header>

      {/* Particles */}
      <canvas ref={canvasRef} className="minimal-particleCanvas" />

      {/* Accent Lines */}
      <div className="minimal-accent-lines">
        <div className="minimal-hline" />
        <div className="minimal-hline" />
        <div className="minimal-hline" />
        <div className="minimal-vline" />
        <div className="minimal-vline" />
        <div className="minimal-vline" />
      </div>

      {/* Hero */}
      <main className="minimal-hero">
        <div>
          <div className="minimal-kicker">{kickerText}</div>
          <h1 className="minimal-title">{title}</h1>
          <p className="minimal-subtitle">{subtitle}</p>
        </div>
      </main>

      {/* Scroll indicator */}
      <div className="minimal-scroll-prompt">
        <div className="w-[1px] h-12 bg-gradient-to-b from-sasori-red to-transparent mb-4" />
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="text-sasori-red w-6 h-6" />
        </motion.div>
      </div>
    </div>
  );
}
