import React from 'react';
import { BlogPostSection } from '../components/ui/blog-posts';
import { BlogSection } from '../components/ui/blog-section';
import { useNavigate } from 'react-router-dom';
import EnhancedBackgroundPaths from '../components/ui/modern-background-paths';

export default function BlogPage({ lang = 'es' }: { lang?: 'es' | 'en' | 'zh' | 'ru' | 'pt' }) {
  const navigate = useNavigate();

  const translations = {
    es: {
      title: "Perspectivas Tecnológicas",
      description: "Explora nuestra visión sobre el futuro de la tecnología, la inteligencia artificial y el diseño inmersivo.",
      bgLabel: "INSIGHTS"
    },
    en: {
      title: "Tech Insights",
      description: "Explore our vision on the future of technology, artificial intelligence, and immersive design.",
      bgLabel: "INSIGHTS"
    },
    zh: {
      title: "技術洞察",
      description: "探索我們對技術、人工智能和沉浸式設計未來的願景。",
      bgLabel: "洞察"
    },
    ru: {
      title: "Технологические Инсайты",
      description: "Исследуйте наше видение будущего технологий, искусственного интеллекта и иммерсивного дизайна.",
      bgLabel: "ИНСАЙТЫ"
    },
    pt: {
      title: "Perspectivas Tecnológicas",
      description: "Explore nossa visão sobre o futuro da tecnologia, inteligência artificial e design imersivo.",
      bgLabel: "INSIGHTS"
    }
  };

  const t = translations[lang] || translations.es;

  return (
    <div className="min-h-screen bg-bg-dark text-white relative">
      <main className="relative z-10">
        <div className="pt-32">
          <BlogPostSection 
            lang={lang}
            title={t.title}
            description={t.description}
            backgroundLabel={t.bgLabel}
          />
        </div>

        <section className="relative z-10 border-t border-white/5 py-10">
          <BlogSection lang={lang} />
        </section>

        <section className="mt-20 px-4">
          <EnhancedBackgroundPaths lang={lang} />
        </section>
      </main>

      <div className="fixed inset-0 -z-10 bg-bg-dark">
      </div>
    </div>
  );
}
