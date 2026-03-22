import re
import codecs
import os

filepath = r"src/pages/service-pages.tsx"
if not os.path.exists(filepath):
    filepath = r"src\pages\service-pages.tsx"

def translate():
    with codecs.open(filepath, 'r', 'utf-8') as f:
        code = f.read()

    # Define translations in a clean dictionary structure first
    translations = {
        "zh": {
            "serviceName": "人工智能自動化",
            "tagline": "為你工作的智能代理",
            "description": "我們設計人工智能代理解決方案...",
        },
        "ru": {
            "serviceName": "ИИ Автоматизация",
            "tagline": "Агенты на связи",
            "description": "Мы проектируем ИИ системы...",
        },
        "pt": {
            "serviceName": "Automação IA",
            "tagline": "Agentes a Trabalhar",
            "description": "Projetamos ecossistemas de IA...",
        }
    }

    # Simplify the replacement logic
    def inject_langs(match):
        en_block = match.group(0)
        # Add zh, ru, pt after en
        return en_block + "\n" + f"        zh: {translations['zh']},\n        ru: {translations['ru']},\n        pt: {translations['pt']},"

    # Regex to find the 'en' block in the translations object
    pattern = re.compile(r'en: \{[\w\W]*?serviceName: ".*?"[\w\W]*?\}\s*,')
    
    new_code = pattern.sub(inject_langs, code)

    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write(new_code)

    print("Translation injected successfully")

if __name__ == "__main__":
    translate()
