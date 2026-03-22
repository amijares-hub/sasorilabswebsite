import re
import codecs
import os

filepath = r"src/pages/service-pages.tsx"
if not os.path.exists(filepath):
    filepath = r"src\pages\service-pages.tsx"

def fix_all():
    with codecs.open(filepath, 'r', 'utf-8') as f:
        text = f.read()

    # Split into parts
    text_parts = text.split("@@@INJECTED_BLOCK@@@")

    if len(text_parts) < 2:
        print("No injected blocks found")
        return

    resolved_text = text_parts[0]

    for i in range(1, len(text_parts)):
        part = text_parts[i]
        # Regex to find sections and content
        zh_match = re.search(r'zh: \{([\w\W]*?)\},', part)
        ru_match = re.search(r'ru: \{([\w\W]*?)\},', part)
        pt_match = re.search(r'pt: \{([\w\W]*?)\},', part)

        block = ""
        if zh_match:
            block += f"    zh: {{{zh_match.group(1)}}},\n"
        if ru_match:
            block += f"    ru: {{{ru_match.group(1)}}},\n"
        if pt_match:
            block += f"    pt: {{{pt_match.group(1)}}},\n"

        resolved_text += block + part

    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write(resolved_text)

    print("Structure fixed successfully")

if __name__ == "__main__":
    fix_all()
