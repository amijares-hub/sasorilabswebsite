import codecs
import os

def update_file(path, replacements):
    if not os.path.exists(path):
        print(f"Warning: {path} not found")
        return

    with codecs.open(path, 'r', 'utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        if old not in content:
            print(f"Warning: could not find:\n{old}\nin {path}")
            # Try varying quotes
            old_alt = old.replace('"', "'")
            if old_alt in content:
                content = content.replace(old_alt, new)
        else:
            content = content.replace(old, new)
        
    with codecs.open(path, 'w', 'utf-8') as f:
        f.write(content)

# hero-futuristic.tsx
hf_replacements = [
    (
        '{lang === "es" ? "Volver" : "Back"}',
        '{lang === "es" ? "Volver" : lang === "zh" ? "返回" : lang === "ru" ? "НАЗАД" : lang === "pt" ? "VOLTAR" : "Back"}'
    ),
    (
        '{lang === "es" ? "Iniciar Proyecto" : "Start Project"}',
        '{lang === "es" ? "Iniciar Proyecto" : lang === "zh" ? "啟動項目" : lang === "ru" ? "НАЧАТЬ ПРОЕКТ" : lang === "pt" ? "INICIAR PROJETO" : "Start Project"}'
    ),
    (
        '{lang === "es" ? "Explorar" : "Explore"}',
        '{lang === "es" ? "Explorar" : lang === "zh" ? "探索" : lang === "ru" ? "ИССЛЕДОВАТЬ" : lang === "pt" ? "EXPLORAR" : "Explore"}'
    ),
    (
        "{lang === 'es' ? 'Desliza para explorar' : 'Scroll to explore'}",
        "{lang === 'es' ? 'Desliza para explorar' : lang === 'zh' ? '滑動探索' : lang === 'ru' ? 'Прокрутите, чтобы исследовать' : lang === 'pt' ? 'Deslize para explorar' : 'Scroll to explore'}"
    )
]

# text-scroll-animation.tsx
tsa_replacements = [
    (
        "{lang === 'es' ? 'Desliza para ver más' : 'Scroll to see more'}",
        "{lang === 'es' ? 'Desliza para ver más' : lang === 'zh' ? '滑動查看更多' : lang === 'ru' ? 'Прокрутите, чтобы увидеть больше' : lang === 'pt' ? 'Deslize para ver mais' : 'Scroll to see more'}"
    )
]

# App.tsx
app_replacements = [
    (
        "{lang === 'es' ? 'NUESTRO ECOSISTEMA' : 'OUR ECOSYSTEM'}",
        "{lang === 'es' ? 'NUESTRO ECOSISTEMA' : lang === 'zh' ? '我們的生態系統' : lang === 'ru' ? 'НАША ЭКОСИСТЕМА' : lang === 'pt' ? 'NOSSO ECOSSISTEMA' : 'OUR ECOSYSTEM'}"
    ),
    (
        "{lang === 'es' ? 'EXPLORA EL ECOSISTEMA' : 'EXPLORE THE ECOSYSTEM'}",
        "{lang === 'es' ? 'EXPLORA EL ECOSISTEMA' : lang === 'zh' ? '探索生態系統' : lang === 'ru' ? 'ИССЛЕДУЙТЕ ЭКОСИСТЕМУ' : lang === 'pt' ? 'EXPLORE O ECOSSISTEMA' : 'EXPLORE THE ECOSYSTEM'}"
    ),
    (
        "title={lang === 'es' ? 'TRANSFORMA TU FUTURO' : 'TRANSFORM YOUR FUTURE'}",
        "title={lang === 'es' ? 'TRANSFORMA TU FUTURO' : lang === 'zh' ? '改變你的未來' : lang === 'ru' ? 'ПРЕОБРАЗИТЕ СВОЕ БУДУЩЕЕ' : lang === 'pt' ? 'TRANSFORME SEU FUTURO' : 'TRANSFORM YOUR FUTURE'}"
    ),
    (
        "title={lang === 'es' ? 'NUESTRO BLOG' : 'OUR BLOG'}",
        "title={lang === 'es' ? 'NUESTRO BLOG' : lang === 'zh' ? '我們的博客' : lang === 'ru' ? 'НАШ БЛОГ' : lang === 'pt' ? 'NOSSO BLOG' : 'OUR BLOG'}"
    )
]

# Blog replacements
blog_replacements = [
    (
        "title: lang === 'es' ? \"El Futuro de la IA\" : \"The Future of AI\",",
        "title: lang === 'es' ? \"El Futuro de la IA\" : lang === 'zh' ? \"AI的未來\" : lang === 'ru' ? \"Будущее ИИ\" : lang === 'pt' ? \"O Futuro da IA\" : \"The Future of AI\","
    ),
    (
        '<BlogPostSection',
        '<BlogPostSection lang={lang}'
    )
]

if __name__ == "__main__":
    update_file('src/components/ui/hero-futuristic.tsx', hf_replacements)
    update_file('src/components/ui/text-scroll-animation.tsx', tsa_replacements)
    update_file('src/App.tsx', app_replacements)
    update_file('src/pages/blog-page.tsx', blog_replacements)
    print("Executed all exact replacements!")
