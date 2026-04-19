'use client';

import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useAspect, useTexture } from '@react-three/drei';
import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three/webgpu';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';
import { Mesh } from 'three';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

import {
  abs,
  blendScreen,
  float,
  mod,
  mx_cell_noise_float,
  oneMinus,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  pass,
  mix,
  add
} from 'three/tsl';

const TEXTUREMAP = { src: 'https://i.postimg.cc/XYwvXN8D/img-4.png' };
const DEPTHMAP = { src: 'https://i.postimg.cc/2SHKQh2q/raw-4.webp' };

extend(THREE as any);

// Post Processing component
const PostProcessing = ({
  strength = 1,
  threshold = 1,
  fullScreenEffect = true,
}: {
  strength?: number;
  threshold?: number;
  fullScreenEffect?: boolean;
}) => {
  const { gl, scene, camera } = useThree();
  const progressRef = useRef({ value: 0 });

  const render = useMemo(() => {
    const postProcessing = new THREE.PostProcessing(gl as any);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode('output');
    const bloomPass = bloom(scenePassColor, strength, 0.5, threshold);

    // Create the scanning effect uniform
    const uScanProgress = uniform(0);
    progressRef.current = uScanProgress;

    // Create a red overlay that follows the scan line
    const scanPos = float(uScanProgress.value);
    const uvY = uv().y;
    const scanWidth = float(0.05);
    const scanLine = smoothstep(0, scanWidth, abs(uvY.sub(scanPos)));
    const redOverlay = vec3(1, 0, 0).mul(oneMinus(scanLine)).mul(0.4);

    // Mix the original scene with the red overlay
    const withScanEffect = mix(
      scenePassColor,
      add(scenePassColor, redOverlay),
      fullScreenEffect ? smoothstep(0.9, 1.0, oneMinus(scanLine)) : 1.0
    );

    // Add bloom effect after scan effect
    const final = withScanEffect.add(bloomPass);

    postProcessing.outputNode = final;

    return postProcessing;
  }, [camera, gl, scene, strength, threshold, fullScreenEffect]);

  useFrame(({ clock }) => {
    // Animate the scan line from top to bottom
    progressRef.current.value = (Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5);
    render.renderAsync();
  }, 1);

  return null;
};

const WIDTH = 300;
const HEIGHT = 300;

const Scene = () => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src]);

  const meshRef = useRef<Mesh>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show image after texture load
    if (rawMap && depthMap) {
      setVisible(true);
    }
  }, [rawMap, depthMap]);

  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0));
    const uProgress = uniform(0);

    const strength = 0.01;

    const tDepthMap = texture(depthMap);

    const tMap = texture(
      rawMap,
      uv().add(tDepthMap.r.mul(uPointer).mul(strength))
    );

    const aspect = float(WIDTH).div(HEIGHT);
    const tUv = vec2(uv().x.mul(aspect), uv().y);

    const tiling = vec2(120.0);
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);

    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));

    const dist = float(tiledUv.length());
    const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);

    const depth = tDepthMap;

    const flow = oneMinus(smoothstep(0, 0.02, abs(depth.r.sub(uProgress))));

    const mask = dot.mul(flow).mul(vec3(10, 0, 0));

    const final = blendScreen(tMap, mask);

    const material = new THREE.MeshBasicNodeMaterial({
      colorNode: final,
      transparent: true,
      opacity: 0,
    });

    return {
      material,
      uniforms: {
        uPointer,
        uProgress,
      },
    };
  }, [rawMap, depthMap]);

  const [w, h] = useAspect(WIDTH, HEIGHT);

  useFrame(({ clock }) => {
    uniforms.uProgress.value = (Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5);
    // Smooth fade in
    if (meshRef.current && 'material' in meshRef.current && meshRef.current.material) {
      const mat = meshRef.current.material as any;
      if ('opacity' in mat) {
        mat.opacity = THREE.MathUtils.lerp(
          mat.opacity,
          visible ? 1 : 0,
          0.07
        );
      }
    }
  });

  useFrame(({ pointer }) => {
    uniforms.uPointer.value = pointer;
  });

  const scaleFactor = 0.40;
  return (
    <mesh ref={meshRef} scale={[w * scaleFactor, h * scaleFactor, 1]} material={material}>
      <planeGeometry />
    </mesh>
  );
};

export interface HeroFuturisticProps {
  serviceName: string;
  tagline: string;
  description: string;
  videoSrc: string;
  lang: string;
  onCtaClick?: () => void;
  onExploreClick?: () => void;
  onBackClick?: () => void;
}

export const HeroFuturistic = ({
  serviceName,
  tagline,
  description,
  videoSrc,
  lang,
  onCtaClick,
  onExploreClick,
  onBackClick
}: HeroFuturisticProps) => {
  const titleWords = tagline.split(' ');
  const subtitle = description;
  const [visibleWords, setVisibleWords] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [delays, setDelays] = useState<number[]>([]);
  const [subtitleDelay, setSubtitleDelay] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Only on client: generate random glitch delays
    setDelays(titleWords.map(() => Math.random() * 0.07));
    setSubtitleDelay(Math.random() * 0.1);
  }, [titleWords.length]);

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(() => setVisibleWords(visibleWords + 1), 600);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setSubtitleVisible(true), 800);
      return () => clearTimeout(timeout);
    }
  }, [visibleWords, titleWords.length]);

  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.playbackRate = 1.5;
    }
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#F2F2F2]">
      {/* Tech Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      {/* Corner Panels (Decorative) */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-white shadow-[-20px_20px_40px_rgba(0,0,0,0.02)] border-l border-b border-black/5 -translate-y-1/2 translate-x-1/2 rotate-45 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-white shadow-[20px_-20px_40px_rgba(0,0,0,0.02)] border-t border-r border-black/5 translate-y-1/2 -translate-x-1/2 rotate-45 pointer-events-none" />

      {/* Red Neon Strips (Inspired by images) */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] -right-[10%] w-[50%] h-[2px] bg-sasori-red shadow-[0_0_15px_#E20613] rotate-[-25deg] opacity-60 animate-pulse" />
        <div className="absolute bottom-[20%] -left-[5%] w-[40%] h-[1px] bg-sasori-red shadow-[0_0_10px_#E20613] rotate-[-25deg] opacity-40" />
        <div className="absolute top-[40%] left-[10%] w-[2px] h-[30%] bg-sasori-red/30 shadow-[0_0_15px_#E20613] skew-x-[-25deg] opacity-30" />
      </div>
      {/* Background Video */}
      <div className="absolute inset-0 z-0 opacity-20 contrast-[1.1] mix-blend-multiply">
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop={false}
          muted
          playsInline
          onTimeUpdate={(e) => {
            const video = e.currentTarget;
            if (video.currentTime >= 4) {
              video.pause();
            }
          }}
          onEnded={(e) => {
            const video = e.currentTarget;
            video.pause();
          }}
          className="w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F2F2F2] via-transparent to-[#F2F2F2]/80" />
      </div>

      {/* Top navigation bar overlay for "Back" button consistency */}
      <nav className="fixed top-0 left-0 right-0 z-[110] flex items-center justify-between px-4 md:px-10 py-4 md:py-6 pointer-events-none">
        <button
          onClick={onBackClick}
          className="flex items-center gap-2 p-1 md:px-6 md:py-3 border border-black/10 rounded-full bg-white/50 backdrop-blur-md hover:bg-sasori-red hover:border-sasori-red transition-all shadow-lg group pointer-events-auto"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-black/5 flex items-center justify-center bg-white/40 backdrop-blur-md group-hover:border-sasori-red group-hover:bg-sasori-red/20 transition-all text-black hover:text-white">
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="hidden sm:inline font-bold uppercase tracking-widest text-[10px] md:text-xs text-black group-hover:text-white">{lang === "es" ? "Volver" : lang === "zh" ? "返回" : lang === "ru" ? "НАЗАД" : lang === "pt" ? "VOLTAR" : "Back"}</span>
        </button>
      </nav>

      <div className="relative z-60 pointer-events-none px-4 md:px-6 flex justify-center flex-col items-center text-center max-w-5xl">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 border border-[#E20613]/30 bg-[#E20613]/10 rounded-full mb-6 md:mb-8 animate-fadeInUp">
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#E20613] animate-pulse shadow-[0_0_8px_#E20613]" />
          <span className="text-[#E20613] text-[9px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Sasorilabs &mdash; {serviceName}</span>
        </div>

        <div className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-4 md:mb-6">
          <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 overflow-hidden text-[#1A1A1A]">
            {titleWords.map((word, index) => (
              <div
                key={index}
                className={index < visibleWords ? 'fade-in' : ''}
                style={{ animationDelay: `${index * 0.13 + (delays[index] || 0)}s`, opacity: index < visibleWords ? undefined : 0 }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>
        <div className="text-sm md:text-xl text-black/70 leading-relaxed mb-8 md:mb-12 max-w-2xl overflow-hidden font-bold uppercase tracking-tight px-4 md:px-0">
          <div
            className={subtitleVisible ? 'fade-in-subtitle' : ''}
            style={{ animationDelay: `${titleWords.length * 0.13 + 0.2 + subtitleDelay}s`, opacity: subtitleVisible ? undefined : 0 }}
          >
            {subtitle}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto">
            <button
              onClick={onCtaClick}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E20613] px-8 py-4 text-sm font-black text-white uppercase tracking-widest transition-all hover:bg-white hover:text-[#E20613] shadow-[0_0_40px_rgba(226,6,19,0.3)]"
            >
              {lang === "es" ? "Iniciar Proyecto" : lang === "zh" ? "啟動項目" : lang === "ru" ? "НАЧАТЬ ПРОЕКТ" : lang === "pt" ? "INICIAR PROJETO" : "Start Project"} <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreClick}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 px-8 py-4 text-sm font-bold text-black uppercase tracking-widest transition-all hover:bg-black/5 backdrop-blur-sm"
            >
              {lang === "es" ? "Explorar" : lang === "zh" ? "探索" : lang === "ru" ? "ИССЛЕДОВАТЬ" : lang === "pt" ? "EXPLORAR" : "Explore"}
            </button>
          </div>
      </div>

      <button
        onClick={onExploreClick}
        className="explore-btn pointer-events-auto flex flex-col items-center gap-1"
        style={{ animationDelay: '2.2s' }}
      >
        <span className="text-[10px] md:text-sm uppercase tracking-[0.2em] text-black/40">
          {lang === 'es' ? 'Desliza para explorar' : lang === 'zh' ? '滑動探索' : lang === 'ru' ? 'Прокрутите, чтобы исследовать' : lang === 'pt' ? 'Deslize para explorar' : 'Scroll to explore'}
        </span>
        <span className="explore-arrow border-black/10">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-svg scale-75 md:scale-100">
            <path d="M11 5V17" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6 12L11 17L16 12" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
      </button>

      <div className="absolute inset-0 z-10 opacity-60">
        <Canvas
            flat
            gl={async (props) => {
            const renderer = new THREE.WebGPURenderer(props as any);
            await renderer.init();
            return renderer;
            }}
        >
            <PostProcessing fullScreenEffect={true} />
            <Scene />
        </Canvas>
      </div>
    </section>
  );
};

export default HeroFuturistic;
