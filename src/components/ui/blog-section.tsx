import React, { useEffect, useState } from 'react';
import { LazyImage } from './lazy-image';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface Blog {
  id: string;
  slug: string;
  author: string;
  cover_image: string;
  created_at: string;
  read_time: number;
  translations: Record<string, { title: string; content: string; description?: string }>;
}

export function BlogSection({ lang = 'es' }: { lang?: string }) {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublicBlogs = async () => {
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('is_published', true)
                .order('created_at', { ascending: false });
                
            if (!error && data) {
                setBlogs(data);
            }
            setLoading(false);
        };
        fetchPublicBlogs();
    }, []);

    const t = {
        es: {
            tag: "Últimas Publicaciones",
            title1: "Explora El",
            title2: "Conocimiento",
            desc: "Perspectivas y tendencias sobre el futuro de la tecnología, IA y diseño para marcas de vanguardia.",
            readMode: "Leer Más",
            by: "por",
            read: "min de lectura"
        },
        en: {
            tag: "Latest Publications",
            title1: "Explore",
            title2: "Knowledge",
            desc: "Insights and trends on the future of technology, AI, and design for vanguard brands.",
            readMode: "Read More",
            by: "by",
            read: "min read"
        },
        zh: {
            tag: "最新出版物",
            title1: "探索",
            title2: "知識",
            desc: "關於為前沿品牌打造的技術、人工智能和設計未來的見解與趨勢。",
            readMode: "閱讀更多",
            by: "作者",
            read: "分鐘閱讀"
        },
        ru: {
            tag: "Последние публикации",
            title1: "Исследуйте",
            title2: "Знания",
            desc: "Инсайты и тренды о будущем технологий, ИИ и дизайна для передовых брендов.",
            readMode: "Читать далее",
            by: "от",
            read: "мин чтения"
        },
        pt: {
            tag: "Últimas Publicações",
            title1: "Explore O",
            title2: "Conhecimento",
            desc: "Perspectivas y tendencias sobre el futuro de la tecnología, IA y diseño para marcas de vanguarda.",
            readMode: "Ler Mais",
            by: "por",
            read: "min de lectura"
        }
    }[lang as 'es'|'en'|'zh'|'ru'|'pt'] || {
            tag: "Latest Publications",
            title1: "Explore",
            title2: "Knowledge",
            desc: "Insights and trends on the future of technology, AI, and design for vanguard brands.",
            readMode: "Read More",
            by: "by",
            read: "min read"
    };

	return (
		<div className="mx-auto w-full max-w-7xl px-4 py-20 relative overflow-hidden">
			<div
				aria-hidden
				className="absolute inset-0 pointer-events-none -z-10 opacity-30 h-full"
			>
				<div className="-rotate-45 bg-[radial-gradient(circle_at_center,rgba(226,6,19,0.05)_0%,transparent_70%)] absolute top-0 left-0 h-[300%] w-[100%] rounded-full blur-3xl" />
			</div>

			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-12">
				<div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-sasori-red/30 bg-sasori-red/10 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-sasori-red animate-pulse" />
                        <span className="text-sasori-red text-[10px] uppercase font-black tracking-widest leading-none">{t.tag}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                        {t.title1} <span className="text-sasori-red">{t.title2}</span>
                    </h2>
                    <p className="text-white/40 text-base md:text-lg max-w-2xl font-medium">
                        {t.desc}
                    </p>
                </div>
			</div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <span className="text-sasori-red animate-pulse text-xs font-black uppercase tracking-widest">Cargando Bóveda...</span>
                </div>
            ) : blogs.length === 0 ? (
                <div className="flex justify-center py-20 border border-white/5 rounded-3xl bg-black/50 backdrop-blur-md">
                    <span className="text-white/30 text-xs font-bold uppercase tracking-widest">No hay artículos publicados aún.</span>
                </div>
            ) : (
			    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 z-10 relative">
				    {blogs.map((blog) => {
                        const tr = blog.translations[lang] || blog.translations['en'] || blog.translations['es'] || { title: blog.slug, content: '' };
                        const rawDesc = tr.content.substring(0, 150) + "..."; 

                        return (
                            <div
                                onClick={() => navigate(`/blog/${blog.slug}`)}
                                 key={blog.id}
                                 className="group flex flex-col gap-6 rounded-[2.5rem] p-6 transition-all duration-500 hover:bg-white/[0.03] border border-transparent hover:border-white/5 cursor-pointer"
                             >
                                <div className="overflow-hidden rounded-[2rem] relative bg-white/5">
                                    <LazyImage
                                        src={blog.cover_image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format,compress&fit=crop&w=800&q=70"}
                                        fallback="https://placehold.co/640x360?text=Sasori+Insights"
                                        inView={true}
                                        alt={tr.title}
                                        ratio={16 / 9}
                                        className="transition-all duration-700 group-hover:scale-110 grayscale-[0.8] group-hover:grayscale-0 block object-cover w-full scale-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                                
                                <div className="space-y-4 flex-grow flex flex-col">
                                    <div className="text-white/40 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <p>{t.by} {blog.author}</p>
                                        <div className="bg-sasori-red/30 w-1 h-1 rounded-full" />
                                        <p>{new Date(blog.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <h3 className="line-clamp-2 text-2xl md:text-3xl font-black tracking-tighter uppercase leading-[1.0] text-white group-hover:text-sasori-red transition-all duration-500 group-hover:tracking-tight">
                                        {tr.title}
                                    </h3>
                                    <div className="text-white/40 line-clamp-2 text-sm font-medium leading-relaxed overflow-hidden prose prose-invert prose-p:my-0" 
                                         dangerouslySetInnerHTML={{ __html: rawDesc }} 
                                    />
                                    <div className="pt-2 flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/30">
                                        <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-sasori-red" /> {blog.read_time || 5} {t.read}</span>
                                    </div>
                                    <div className="pt-4 mt-auto flex items-center gap-2 text-sasori-red text-[10px] font-black uppercase tracking-widest opacity-100 translate-x-0 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-x-2 transition-all duration-500">
                                        {t.readMode} <span className="text-lg">&rarr;</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
			    </div>
            )}
		</div>
	);
}
