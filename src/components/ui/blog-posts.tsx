import { cn } from "../../lib/utils";
import { useState, useEffect } from "react";
import { MoveRight, Star } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  href: string;
  views: number;
  readTime?: number;
  rating?: number;
  className?: string;
  slug?: string;
}

interface GridSectionProps {
  title: string;
  description: string;
  backgroundLabel?: string;
  backgroundPosition?: "left" | "right";
  posts?: BlogPost[];
  className?: string;
  lang?: string;
  onPostClick?: (post: BlogPost) => void;
}

import { MorphingSquare } from "./morphing-square";

export const BlogPostSection = ({
    title,
    description,
    backgroundLabel,
    backgroundPosition = "left",
    posts: initialPosts,
    className,
    onPostClick,
    lang = "es",
  }: GridSectionProps) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts || []);
  const [loading, setLoading] = useState(!initialPosts);

  useEffect(() => {
    if (!initialPosts) {
      const fetchLatestPosts = async () => {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (!error && data) {
          const formattedPosts: BlogPost[] = data.map(blog => {
            const tr = blog.translations?.[lang] || blog.translations?.['en'] || blog.translations?.['es'] || { title: blog.title || blog.slug };
            return {
              id: blog.id,
              title: tr.title || blog.title || blog.slug || "Sin título",
              category: blog.author || "SasoriLabs",
              imageUrl: blog.cover_image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format,compress&fit=crop&w=800&q=70",
              href: `/blog/${blog.slug}`,
              slug: blog.slug,
              views: blog.views || 0,
              readTime: blog.read_time,
              rating: 5
            };
          });
          setPosts(formattedPosts);
        }
        setLoading(false);
      };
      fetchLatestPosts();
    } else {
      setPosts(initialPosts);
      setLoading(false);
    }
  }, [initialPosts, lang]);

  const t = {
    es: { views: "Vistas", read: "min de lectura" },
    en: { views: "Views", read: "min read" },
    zh: { views: "次觀看", read: "分鐘閱讀" },
    ru: { views: "Просмотров", read: "мин чтения" },
    pt: { views: "Visualizações", read: "min de lectura" },
  }[lang as 'es' | 'en' | 'zh' | 'ru' | 'pt'] || { views: "Views", read: "min read" };

  if (loading) return (
    <div className="flex justify-center py-40">
        <MorphingSquare message="Sincronizando Artículos..." />
    </div>
  );
  if (posts.length === 0) return null;

  return (
    <section className={cn(
      "container relative my-20 py-10 mx-auto px-4",
      className
    )}>
      <h1 className="text-center text-4xl font-black uppercase tracking-tighter !leading-[1.1] md:text-5xl lg:text-7xl mb-6 text-white font-display">
        {title.split(' ').map((word, i) => (
          <span key={i} className={i === title.split(' ').length - 1 ? "text-sasori-red" : ""}>
            {word}{' '}
          </span>
        ))}
      </h1>
      
      {backgroundLabel && (
        <span
          className={cn(
            "absolute top-0 -z-10 select-none text-[120px] font-black leading-[1] text-white/[0.02] md:text-[200px] lg:text-[300px] uppercase tracking-tighter",
            backgroundPosition === "left" ? "-left-[5%]" : "-right-[5%]"
          )}
        >
          {backgroundLabel}
        </span>
      )}
      
      <p className="mx-auto max-w-3xl text-center text-lg !leading-relaxed text-white/50 md:text-xl mb-12 font-medium">
        {description}
      </p>
      
      <div className={cn(
          "grid h-auto gap-6 sm:h-[400px] md:h-[600px] lg:h-[700px]",
          posts.length === 1 ? "grid-cols-1" : 
          posts.length === 2 ? "grid-cols-1 md:grid-cols-2" : 
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_0.5fr]"
      )}>
        {posts.map((post, index) => {
          const {
            id,
            title: postTitle,
            category,
            imageUrl,
            views,
            readTime,
            rating = 5,
            className: postClassName,
            slug
          } = post;
          
          const isPrimary = index === 0;

          return (
            <div
              key={id || index}
              style={{ backgroundImage: `url(${imageUrl})` }}
              className={cn(
                "group relative row-span-1 flex size-full cursor-pointer flex-col justify-end overflow-hidden rounded-[2.5rem] bg-cover bg-center bg-no-repeat p-8 text-white transition-all duration-700 hover:scale-[0.98] border border-white/5",
                isPrimary && posts.length > 1 ? "col-span-1 row-span-1 md:col-span-2 md:row-span-2 lg:col-span-1" : "",
                posts.length === 3 && index === 2 && "lg:col-start-2 lg:row-start-2",
                postClassName
              )}
              onClick={() => {
                if (onPostClick) onPostClick(post);
                else if (slug) navigate(`/blog/${slug}`);
              }}
            >
              <div className="absolute inset-0 -z-0 h-[100%] w-full bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-all duration-500" />
              
              <article className="relative z-10 flex items-end justify-between gap-4 w-full">
                <div className="flex flex-1 flex-col gap-4">
                   <div className="flex flex-col gap-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black py-1.5 px-4 rounded-full bg-sasori-red text-white w-fit shadow-[0_0_20px_rgba(226,6,19,0.3)]">
                      {category}
                    </span>
                    <h3 className={cn(
                        "font-black uppercase tracking-tighter leading-none group-hover:text-sasori-red transition-colors duration-300",
                        isPrimary && posts.length > 1 ? "text-3xl md:text-5xl" : "text-xl md:text-2xl"
                    )}>
                        {postTitle}
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            width={14}
                            height={14}
                            key={idx}
                            stroke={idx < rating ? "#E20613" : "#ffffff20"}
                            fill={idx < rating ? "#E20613" : "#ffffff20"}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
                        {views} {t.views}
                      </span>
                      {readTime && (
                        <div className="text-xs font-bold text-sasori-red uppercase tracking-widest pl-3 border-l border-white/10">
                          {readTime} {t.read}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-sasori-red transition-all duration-500 flex-shrink-0">
                    <MoveRight
                        className="transition-all duration-300 group-hover:translate-x-1"
                        width={20}
                        height={20}
                    />
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
};
