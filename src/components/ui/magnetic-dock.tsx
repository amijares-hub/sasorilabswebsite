"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names; later/consumer classes win on conflict. */
function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/* ---- motion primitives ---- */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useVisibilityPause<T extends Element>(
  ref: React.RefObject<T | null>,
  { threshold = 0.1 }: { threshold?: number } = {},
): boolean {
  const [onScreen, setOnScreen] = React.useState(true);
  const [tabVisible, setTabVisible] = React.useState(true);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((e) => e.isIntersecting)),
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  React.useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState !== "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return onScreen && tabVisible;
}

export interface DockItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface MagneticDockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  items: DockItem[];
  magnetRadius?: number;
  maxScale?: number;
  lift?: number;
  stiffness?: number;
  damping?: number;
  idleWave?: boolean;
  tooltip?: boolean;
  onSelect?: (id: string) => void;
  seed?: number;
  pauseWhenHidden?: boolean;
  reducedMotion?: boolean;
}

interface Spring {
  x: number;
  v: number;
}

const mkSpring = (x = 0): Spring => ({ x, v: 0 });

function spring(s: Spring, target: number, k: number, c: number, dt: number): number {
  const n = dt > 0.012 ? Math.ceil(dt / 0.008) : 1;
  const h = dt / n;
  for (let i = 0; i < n; i++) {
    s.v += (-k * (s.x - target) - c * s.v) * h;
    s.x += s.v * h;
  }
  return s.x;
}

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Field constants */
const LIFT_K = 360;
const LIFT_C = 22;
const DRIFT = 0.13;
const DRIFT_K = 300;
const DRIFT_C = 20;
const TIP_K = 340;
const TIP_C = 26;
const VERTICAL_REACH = 220;

interface Base {
  x: number;
  y: number;
}

interface PointerState {
  x: number;
  y: number;
  inside: boolean;
}

function MagneticDockBase({
  items,
  magnetRadius = 78,
  maxScale = 1.5,
  lift = 24,
  stiffness = 420,
  damping = 26,
  idleWave = true,
  tooltip = true,
  onSelect,
  seed = 1,
  pauseWhenHidden = true,
  reducedMotion,
  className,
  style,
  ...props
}: MagneticDockProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const barRef = React.useRef<HTMLDivElement | null>(null);
  const tipRef = React.useRef<HTMLDivElement | null>(null);
  const iconsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
  const basesRef = React.useRef<Base[]>([]);
  const pointerRef = React.useRef<PointerState>({ x: -1e4, y: -1e4, inside: false });
  const focusRef = React.useRef(-1);

  const systemReduced = useReducedMotion();
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  const staticMode = reducedMotion === true || (hydrated && systemReduced);
  const onScreen = useVisibilityPause(rootRef, { threshold: 0.06 });
  const paused = pauseWhenHidden && !onScreen;
  const animate = !staticMode && !paused;

  const count = items.length;
  const labels = items.map((i) => i.label).join("\u0000");

  const params = React.useRef({ magnetRadius, maxScale, lift, stiffness, damping, idleWave, tooltip });
  params.current = { magnetRadius, maxScale, lift, stiffness, damping, idleWave, tooltip };

  React.useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const measure = () => {
      const bx = bar.offsetLeft;
      const by = bar.offsetTop;
      basesRef.current = iconsRef.current.slice(0, count).map((el) =>
        el ? { x: bx + el.offsetLeft + el.offsetWidth / 2, y: by + el.offsetTop + el.offsetHeight / 2 } : { x: 0, y: 0 },
      );
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(bar);
    if (rootRef.current) ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, [count, labels]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (!animate) {
      iconsRef.current.forEach((el) => {
        if (el) el.style.transform = "";
      });
      if (tipRef.current) tipRef.current.style.opacity = "0";
      return;
    }

    const states = Array.from({ length: count }, () => ({ s: mkSpring(1), y: mkSpring(0), dx: mkSpring(0) }));
    const tipX = mkSpring(0);
    const tipO = mkSpring(0);
    const rng = makeRng(seed);
    let idleT = rng() * 20;
    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      let dt = (now - last) / 1000;
      last = now;
      if (!(dt > 0) || dt > 0.05) dt = 0.016;
      idleT += dt;

      const cfg = params.current;
      const bases = basesRef.current;
      const p = pointerRef.current;
      const w = root.clientWidth;
      const grow = Math.max(0, cfg.maxScale - 1);
      const sigma = Math.max(8, cfg.magnetRadius);

      let px: number;
      let py: number;
      let amp: number;
      const fi = focusRef.current;
      if (p.inside) {
        px = p.x;
        py = p.y;
        amp = 1;
      } else if (fi >= 0 && bases[fi]) {
        px = bases[fi].x;
        py = bases[fi].y;
        amp = 1;
      } else if (cfg.idleWave) {
        px = w / 2 + Math.sin(idleT * 0.55) * w * 0.34;
        py = bases[0]?.y ?? root.clientHeight - 70;
        amp = 0.42;
      } else {
        px = -1e4;
        py = -1e4;
        amp = 0;
      }

      let bestI = -1;
      let bestInf = 0;
      for (let i = 0; i < count; i++) {
        const b = bases[i];
        const el = iconsRef.current[i];
        const st = states[i];
        if (!b || !el || !st) continue;
        const d = px - b.x;
        const vert = Math.max(0, 1 - Math.abs(py - b.y) / VERTICAL_REACH);
        const inf = Math.exp(-(d * d) / (2 * sigma * sigma)) * amp * vert;
        if (inf > bestInf) {
          bestInf = inf;
          bestI = i;
        }
        spring(st.s, 1 + grow * inf, cfg.stiffness, cfg.damping, dt);
        spring(st.y, -cfg.lift * inf, LIFT_K, LIFT_C, dt);
        spring(st.dx, d * DRIFT * inf, DRIFT_K, DRIFT_C, dt);
        el.style.transform = `translate3d(${st.dx.x.toFixed(2)}px,${st.y.x.toFixed(2)}px,0) scale(${st.s.x.toFixed(3)})`;
      }

      const tip = tipRef.current;
      if (!tip) return;
      const showTip = cfg.tooltip && (p.inside || fi >= 0) && bestInf > 0.55 && bestI >= 0;
      if (showTip) {
        const next = items[bestI]?.label ?? "";
        if (tip.textContent !== next) tip.textContent = next;
        spring(tipX, bases[bestI].x, TIP_K, TIP_C, dt);
      }
      spring(tipO, showTip ? 1 : 0, 220, 24, dt);
      const o = clamp(tipO.x, 0, 1);
      if (o > 0.01 && bestI >= 0 && bases[bestI]) {
        const ty = bases[bestI].y - 72 - states[bestI].y.x * -0.4 - 18 * o;
        tip.style.opacity = o.toFixed(3);
        tip.style.transform = `translate3d(${(tipX.x - tip.offsetWidth / 2).toFixed(1)}px,${ty.toFixed(1)}px,0)`;
      } else {
        tip.style.opacity = "0";
      }
    };

    last = typeof performance !== "undefined" ? performance.now() : 0;
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [animate, count, items, seed]);

  const track = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    if (!root) return;
    const r = root.getBoundingClientRect();
    pointerRef.current = { x: e.clientX - r.left, y: e.clientY - r.top, inside: true };
  }, []);

  const release = React.useCallback(() => {
    pointerRef.current = { x: -1e4, y: -1e4, inside: false };
  }, []);

  return (
    <div
      ref={rootRef}
      data-motion={staticMode ? "static" : "animated"}
      data-paused={paused ? "true" : "false"}
      className={cn("relative w-full select-none", className)}
      style={{ touchAction: "pan-y", ...style }}
      onPointerMove={track}
      onPointerDown={track}
      onPointerLeave={release}
      onPointerCancel={release}
      {...props}
    >
      <div className="flex w-full justify-center px-3 pb-3 pt-24">
        {/* Contenedor del Dock */}
        <div
          ref={barRef}
          className="relative flex max-w-full flex-wrap items-end justify-center gap-5 px-[18px] py-3"
        >
          {items.map((item, i) => {
            // Lógica de alternancia: Pares = Negro, Impares = Rojo
            const iconColor = i % 2 === 0 ? "#1a1a22" : "#E20613";
            
            return (
              <button
                key={item.id}
                type="button"
                ref={(el) => {
                  iconsRef.current[i] = el;
                }}
                data-dock-item={item.id}
                aria-label={item.label}
                onClick={() => onSelect?.(item.id)}
                onFocus={() => {
                  focusRef.current = i;
                }}
                onBlur={() => {
                  if (focusRef.current === i) focusRef.current = -1;
                }}
                className={cn(
                  "relative grid h-[72px] w-[72px] shrink-0 origin-bottom place-items-center rounded-xl", // <-- AUMENTADO de 52px a 72px
                  "cursor-pointer border-0 p-0 text-[15px] font-bold",
                  "[&_svg]:h-[45px] [&_svg]:w-[45px] [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.5]", // <-- AUMENTADO EXACTAMENTE 40% (de 32px a 45px)
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#E20613]",
                  staticMode &&
                    "transition-transform duration-150 ease-[cubic-bezier(0.2,0,0,1)] hover:-translate-y-2 hover:scale-[1.14]",
                )}
                style={{
                  color: iconColor,
                  willChange: "transform",
                }}
              >
                {item.icon ?? <span aria-hidden="true">{item.label.slice(0, 1).toUpperCase()}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {tooltip && !staticMode ? (
        <div
          ref={tipRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-20 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-bold tracking-wide opacity-0 shadow-lg"
          style={{
            background: "#1a1a22", // Fondo oscuro
            color: "#ffffff", // Texto blanco
            transform: "translate3d(-999px,-999px,0)",
            willChange: "transform, opacity",
          }}
        />
      ) : null}
    </div>
  );
}

export { MagneticDockBase as MagneticDock };