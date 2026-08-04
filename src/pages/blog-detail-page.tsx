import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { AnimatedNavFramer } from '../components/ui/navigation-menu';
import { MorphingSquare } from '../components/ui/morphing-square';
import { ArrowLeft, Clock, Eye, Share2, Calendar, User, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { AIImageHover } from '../components/ai/AIImageHover';

interface Blog {
  id: string;
  slug: string;
  author: string;
  author_image?: string;
  cover_image: string;
  created_at: string;
  read_time: number;
  views: number;
  translations: Record<string, { title: string; content: string }>;
}

export function BlogDetailPage({ lang, setLang }: { lang: string, setLang: any }) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBlogData = async () => {
      if (!slug) return;
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();
        
      if (error || !data) {
        console.error("No blog found", error);
        navigate('/blog');
        return;
      }

      await supabase.from('blogs').update({ views: (data.views || 0) + 1 }).eq('slug', slug);
      setBlog(data);
      setLoading(false);
    };

    fetchBlogData();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center gap-12">
        <MorphingSquare message="Iniciando Protocolo de Lectura..." />
      </div>
    );
  }

  if (!blog) return null;

  const tr = blog.translations[lang] || blog.translations['en'] || blog.translations['es'] || { title: blog.slug, content: '' };
  
  const dict = {
    es: { back: "VOLVER", by: "AUTOR", read: "LECTURA", views: "VISTAS", share: "COMPARTIR ARTÍCULO", date: "PUBLICADO" },
    en: { back: "BACK", by: "AUTHOR", read: "READ TIME", views: "VIEWS", share: "SHARE ARTICLE", date: "PUBLISHED" },
    zh: { back: "返回", by: "作者", read: "閱讀時間", views: "意見", share: "分享文章", date: "發行" },
    ru: { back: "НАЗАД", by: "АВТОР", read: "ВРЕМЯ ЧТЕНИЯ", views: "ПРОСМОТРОВ", share: "ПОДЕЛИТЬСЯ", date: "ОПУБЛИКОВАНО" },
    pt: { back: "VOLTAR", by: "AUTOR", read: "TEMPO DE LEITURA", views: "VISUALIZAÇÕES", share: "PARTILHAR", date: "PUBLICADO" },
  }[lang as 'es'|'en'|'zh'|'ru'|'pt'] || { back: "BACK", by: "AUTHOR", read: "READ TIME", views: "VIEWS", share: "SHARE", date: "PUBLISHED" };

  const handleShare = () => {
    if (navigator.share) {
        navigator.share({
            title: tr.title,
            text: `Mira este artículo de SasoriLabs: ${tr.title}`,
            url: window.location.href,
        }).catch(err => console.error('Error sharing:', err));
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-sasori-red selection:text-white overflow-x-hidden">
      {/* Universal Nav is in App.tsx */}

      {/* Hero Header Area */}
      <header className="relative w-full pt-40 pb-20 px-6 overflow-hidden">
         {/* Background elements */}
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sasori-red/5 to-transparent -z-10" />
         <div className="absolute -top-24 -left-24 w-96 h-96 bg-sasori-red/10 blur-[120px] rounded-full -z-10 animate-pulse" />
         
         <div className="max-w-4xl mx-auto">
            <button 
                onClick={() => navigate('/blog')}
                className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-sasori-red transition-all mb-12 border-b border-white/5 pb-2 inline-block"
            >
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                {dict.back}
            </button>

            <div className="space-y-8">
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] animate-in slide-in-from-bottom-12 duration-1000">
                    {tr.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 md:gap-10 py-8 border-y border-white/5">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-sasori-red">{dict.by}</span>
                        <span className="text-sm font-bold uppercase text-white/80 flex items-center gap-2"><User size={14} className="text-sasori-red" /> {blog.author}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-sasori-red">{dict.date}</span>
                        <span className="text-sm font-bold uppercase text-white/40 flex items-center gap-2"><Calendar size={14} /> {new Date(blog.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-sasori-red">{dict.read}</span>
                        <span className="text-sm font-bold uppercase text-white/40 flex items-center gap-2"><Clock size={14} /> {blog.read_time || 5} MIN</span>
                    </div>
                    <div className="flex flex-col gap-1 ml-auto">
                        <span className="text-[9px] font-black uppercase tracking-widest text-sasori-red">{dict.views}</span>
                        <span className="text-sm font-bold uppercase text-white/40 flex items-center gap-2"><Eye size={14} /> {blog.views || 0}</span>
                    </div>
                </div>
            </div>
         </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-32">
        {/* Big Cover Image */}
        {blog.cover_image && (
          <div className="w-full aspect-[21/9] rounded-[3rem] overflow-hidden mb-24 relative group shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] border border-white/5">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
            <AIImageHover promptContext={tr.title} className="absolute inset-0 z-20">
              <img 
                src={blog.cover_image} 
                alt={tr.title}
                className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-[2000ms]"
              />
            </AIImageHover>
          </div>
        )}

        {/* CUERPO DEL ARTÍCULO - CENTRADO Y POTENTE */}
        <article 
            className={cn(
                "max-w-none text-white/80",
                "prose prose-invert prose-p:text-xl prose-p:leading-[1.9] prose-p:font-medium prose-p:text-white/60 prose-p:mb-20",
                "prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-white",
                "prose-h2:text-3xl prose-h2:md:text-5xl prose-h2:mt-24 prose-h2:mb-12 prose-h2:text-sasori-red",
                "prose-h3:text-xl prose-h3:md:text-3xl prose-h3:mt-16 prose-h3:mb-8",
                "prose-strong:text-sasori-red prose-strong:font-black/80",
                "prose-a:text-sasori-red prose-a:no-underline prose-a:font-black hover:prose-a:underline decoration-sasori-red/30 underline-offset-8",
                "prose-img:rounded-[3rem] prose-img:shadow-[0_50px_100px_-20px_rgba(226,6,19,0.15)] prose-img:my-32 prose-img:border prose-img:border-white/5",
                "prose-blockquote:border-l-sasori-red prose-blockquote:bg-sasori-red/5 prose-blockquote:py-16 prose-blockquote:px-16 prose-blockquote:rounded-r-[3rem] prose-blockquote:font-bold prose-blockquote:italic prose-blockquote:text-white/90 prose-blockquote:text-2xl prose-blockquote:leading-relaxed",
                "prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-[2.5rem] prose-pre:p-12 prose-pre:my-24"
            )}
            dangerouslySetInnerHTML={{ __html: tr.content }}
        />
      </div>

        {/* Mobile share footer */}
        <div className="md:hidden mt-20 pt-10 border-t border-white/5">
            <button 
                onClick={handleShare}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em]"
            >
                <Share2 size={16} className="text-sasori-red transition-transform group-hover:scale-110" /> {dict.share}
            </button>
        </div>
    </div>
  );
}
