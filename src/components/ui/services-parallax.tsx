import React from "react";
import { TextParallaxContent } from "./text-parallax-content-scroll";
import { ArrowUpRight } from "lucide-react";

export const ServicesParallax = ({ t, lang }: { t: any, lang: 'es' | 'en' }) => {
  const servicesData = [
    {
      imgUrl: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1677442136019-21780ecad995?w=1600&q=80",
      subheading: lang === 'es' ? 'Inteligencia' : lang === 'zh' ? '智能' : lang === 'ru' ? 'Интеллект' : lang === 'pt' ? 'Inteligência' : 'Intelligence',
      heading: t.services.ai.title,
      description: t.services.ai.desc,
      items: t.services.ai.items,
    },
    {
      imgUrl: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1639762681485-074b7f938ba0?w=1600&q=80",
      subheading: lang === 'es' ? 'Inmersión' : lang === 'zh' ? '沉浸' : lang === 'ru' ? 'Погружение' : lang === 'pt' ? 'Imersão' : 'Immersion',
      heading: t.services.web.title,
      description: t.services.web.desc,
      items: t.services.web.items,
    },
    {
      imgUrl: "https://images.unsplash.com/p?auto=format,compress&fit=crop&w=800&q=70hoto-1614850523296-d8c1af93d400?w=1600&q=80",
      subheading: lang === 'es' ? 'Evolución' : lang === 'zh' ? '進化' : lang === 'ru' ? 'Эволюция' : lang === 'pt' ? 'Evolução' : 'Evolution',
      heading: t.services.modernization.title,
      description: t.services.modernization.desc,
      items: t.services.modernization.items,
    }
  ];

  return (
    <div className="bg-bg-dark">
      {servicesData.map((service, idx) => (
        <TextParallaxContent
          key={idx}
          imgUrl={service.imgUrl}
          subheading={service.subheading}
          heading={service.heading}
        >
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12 text-white">
            <h2 className="col-span-1 text-3xl md:text-5xl font-bold md:col-span-4 tracking-tighter uppercase text-sasori-red">
              {service.heading}
            </h2>
            <div className="col-span-1 md:col-span-8">
              <p className="mb-8 text-xl text-gray-400 md:text-2xl leading-relaxed">
                {service.description}
              </p>
              
              <div className="mb-12 space-y-4">
                {service.items.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-4 text-lg md:text-xl font-bold uppercase tracking-tight text-white/90">
                    <div className="w-2.5 h-2.5 rounded-full bg-sasori-red shadow-[0_0_12px_#E20613]" />
                    {item}
                  </div>
                ))}
              </div>

              <button className="w-full rounded-full bg-white/5 border border-white/10 px-9 py-4 text-sm font-bold tracking-[0.2em] uppercase text-white transition-all hover:bg-sasori-red hover:border-sasori-red md:w-fit group flex items-center justify-center gap-2">
                {lang === 'es' ? 'Conocer más' : lang === 'zh' ? '了解更多' : lang === 'ru' ? 'Узнать больше' : lang === 'pt' ? 'Saber mais' : 'Learn more'}
                <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </TextParallaxContent>
      ))}
    </div>
  );
};
