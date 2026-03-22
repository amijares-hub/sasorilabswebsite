import React, { useState, useEffect } from 'react';
import { useAdmin } from '../providers/AdminProvider';
import { Sparkles, X, Image as ImageIcon, Copy, Check, Loader2, DownloadCloud } from 'lucide-react';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabaseClient';

const STYLES = [
  { id: 'photorealistic', label: 'Realista', prompt: 'Photorealistic, 8k, highly detailed, professional photography' },
  { id: 'cinematic', label: 'Cinemático', prompt: 'Cinematic lighting, movie scene, dramatic, hyper-detailed' },
  { id: 'digital-art', label: 'Arte Digital', prompt: 'Digital art, trending on artstation, masterpiece, vibrant' },
  { id: 'cyberpunk', label: 'Cyberpunk', prompt: 'Cyberpunk style, neon lights, dark synthwave, futuristic' },
  { id: 'minimalist', label: 'Minimalista', prompt: 'Minimalist, clean, modern, simple geometric shapes' },
  { id: 'anime', label: 'Anime/Manga', prompt: 'High quality anime style, studio ghibli, beautiful scenery' }
];

const ASPECT_RATIOS = [
  { id: '16:9', label: 'Panorámica (16:9)', w: 1024, h: 576 },
  { id: '1:1', label: 'Cuadrada (1:1)', w: 1024, h: 1024 },
  { id: '9:16', label: 'Vertical (9:16)', w: 576, h: 1024 }
];

export function AIImageModal() {
  const { isAIGeneratorOpen, closeAIGenerator, generatorContext } = useAdmin();
  
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('sasori_openai_key') || '');
  const [isApiKeySetup, setIsApiKeySetup] = useState(() => !!localStorage.getItem('sasori_openai_key'));

  const [prompt, setPrompt] = useState(generatorContext);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (generatorContext) setPrompt(generatorContext);
  }, [generatorContext]);

  if (!isAIGeneratorOpen) return null;

  const handleSaveApiKey = (key: string) => {
    localStorage.setItem('sasori_openai_key', key);
    setApiKey(key);
    setIsApiKeySetup(true);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !apiKey) return;
    setIsGenerating(true);
    setGeneratedUrl(null);
    setCopied(false);
    
    try {
      const fullPrompt = `${prompt}, ${selectedStyle.prompt}`;
      
      // Map ratios to DALL-E 3 supported sizes
      let size = '1024x1024';
      if (selectedRatio.id === '16:9') size = '1792x1024';
      if (selectedRatio.id === '9:16') size = '1024x1792';

      // 1. Generate Image (OpenAI or HuggingFace)
      let tempImageUrl = '';
      let blob;

      if (apiKey.startsWith('hf_')) {
        // HUGGING FACE (Stable Diffusion XL) - Free
        const hfRes = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            inputs: fullPrompt,
            parameters: {
              width: selectedRatio.w,
              height: selectedRatio.h
            }
          })
        });

        if (!hfRes.ok) {
           const err = await hfRes.text();
           throw new Error(`Hugging Face Error: ${err}`);
        }
        blob = await hfRes.blob();
        setIsUploading(true);

      } else {
        // OPENAI (DALL-E 3)
        const openAiRes = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: fullPrompt,
            n: 1,
            size: size
          })
        });

        if (!openAiRes.ok) {
          const errData = await openAiRes.json();
          throw new Error(errData.error?.message || "Error conectando con OpenAI");
        }

        const openAiData = await openAiRes.json();
        tempImageUrl = openAiData.data[0].url;

        // Fetch the generated image into a Blob
        setIsUploading(true);
        const imgRes = await fetch(tempImageUrl);
        if (!imgRes.ok) throw new Error("Error obteniendo la imagen de DALL-E");
        blob = await imgRes.blob();
      }
      
      // 3. Upload to Supabase to make it permanent
      const fileName = `dalle3_${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(`generated/${fileName}`, blob);
        
      if (uploadError) throw new Error(`Error en Supabase Storage (blog-images): ${uploadError.message}`);
      
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(`generated/${fileName}`);
        
      setGeneratedUrl(publicUrl);
      setIsGenerating(false);
      setIsUploading(false);
      
    } catch (error: any) {
       console.error(error);
       setIsGenerating(false);
       alert(`Error del sistema: ${error.message || error}`);
    }
  };

  const handleCopy = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={closeAIGenerator} />
      
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-[2rem] shadow-[0_0_100px_rgba(226,6,19,0.15)] flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh]">
        
        {/* Editor Sidebar */}
        <div className="w-full md:w-[400px] p-8 border-r border-white/5 flex flex-col gap-8 flex-shrink-0 overflow-y-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
              <Sparkles className="text-sasori-red" size={20} />
              AI Image Studio
            </h2>
            <button onClick={closeAIGenerator} className="text-white/50 hover:text-white md:hidden">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Tu Idea (Prompt)</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe lo que quieres ver... ej: Un robot de neon leyendo un libro en tokio"
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-sasori-red transition-colors"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Estilo Artístico</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-colors border",
                    selectedStyle.id === style.id ? "bg-sasori-red border-sasori-red text-white" : "bg-transparent border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                  )}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Formato (Aspect Ratio)</label>
            <div className="grid grid-cols-3 gap-2">
              {ASPECT_RATIOS.map(ratio => (
                <button
                  key={ratio.id}
                  onClick={() => setSelectedRatio(ratio)}
                  className={cn(
                    "p-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors border flex flex-col items-center gap-2",
                    selectedRatio.id === ratio.id ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                  )}
                >
                  {ratio.id === '16:9' ? <div className="w-6 h-3 border-2 border-current rounded-sm" /> : 
                   ratio.id === '1:1' ? <div className="w-4 h-4 border-2 border-current rounded-sm" /> : 
                   <div className="w-3 h-6 border-2 border-current rounded-sm" />}
                  {ratio.id}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || isUploading || !isApiKeySetup}
            className="w-full py-4 mt-auto rounded-xl bg-sasori-red hover:bg-white text-white hover:text-black font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(isGenerating || isUploading) ? (
              <><Loader2 className="animate-spin" size={18} /> GENERANDO...</>
            ) : (
              <><Sparkles size={18} /> {apiKey.startsWith('hf_') ? 'CREAR MAGIA (SDXL)' : 'CREAR MAGIA (DALL-E 3)'}</>
            )}
          </button>
        </div>

        {/* Display Area */}
        <div className="flex-1 bg-black p-4 md:p-8 flex flex-col items-center justify-center relative min-h-[400px]">
          <button onClick={closeAIGenerator} className="absolute top-6 right-6 text-white/50 hover:text-white hidden md:block z-10 transition-colors bg-black/50 p-2 rounded-full backdrop-blur-md">
            <X size={24} />
          </button>

          {!isApiKeySetup ? (
            <div className="flex flex-col items-center justify-center text-center max-w-sm p-8 glass-card border-sasori-red/30 rounded-3xl">
              <Sparkles className="w-12 h-12 text-sasori-red mb-4" />
              <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-2">Motor de I.A. Apagado</h3>
              <p className="text-white/50 text-sm font-medium mb-6 leading-relaxed">
                Ingresa tu llave de <strong className="text-white">OpenAI (DALL-E 3)</strong> pagada, o si quieres usar un motor 100% gratuito e igual de potente, ingresa una llave de <strong className="text-white">Hugging Face (Stable Diffusion XL)</strong>.
              </p>
              <input 
                type="password"
                placeholder="sk-proj-... o hf_..."
                className="w-full bg-black/50 border border-white/10 text-white rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-sasori-red text-center font-mono text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveApiKey(e.currentTarget.value);
                }}
                onBlur={(e) => {
                  if (e.target.value) handleSaveApiKey(e.target.value);
                }}
              />
              <p className="text-[9px] uppercase tracking-widest text-white/30">
                Presiona Enter para guardar
              </p>
            </div>
          ) : isGenerating ? (
            <div className="flex flex-col items-center gap-4 text-white/50 animate-pulse">
              <Sparkles size={48} className="text-sasori-red animate-bounce" />
              <p className="text-sm uppercase tracking-widest font-black">Visualizando...</p>
            </div>
          ) : isUploading ? (
            <div className="flex flex-col items-center gap-4 text-white/50 animate-pulse">
              <DownloadCloud size={48} className="text-white" />
              <p className="text-sm uppercase tracking-widest font-black">Guardando en Nube...</p>
            </div>
          ) : generatedUrl ? (
            <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-700">
               <img src={generatedUrl} alt="Generado por IA" className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl border border-white/10 object-contain" />
               <div className="mt-8 flex gap-4">
                 <button onClick={handleCopy} className={cn(
                   "px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all",
                   copied ? "bg-emerald-500 text-white" : "bg-white text-black hover:bg-white/80"
                 )}>
                   {copied ? <Check size={16} /> : <Copy size={16} />} 
                   {copied ? "URL COPIADA" : "COPIAR URL PÚBLICA"}
                 </button>
                 <a href={generatedUrl} target="_blank" rel="noreferrer" className="px-5 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 font-black uppercase tracking-widest text-xs transition-colors">
                   VER ORIGINAL
                 </a>
               </div>
               <p className="text-white/40 text-[10px] mt-4 uppercase tracking-widest max-w-sm text-center">
                 Pega la URL copiada en cualquier componente del código fuente (en Dashboard o en archivos .tsx) para reemplazar la imagen permanentemente.
               </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-white/10">
              <ImageIcon size={64} />
              <p className="text-sm uppercase tracking-widest font-black max-w-[200px] text-center">TU CREACIÓN APARECERÁ AQUÍ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
