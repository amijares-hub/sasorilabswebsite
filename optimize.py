import os
import re

def optimize_images(directory):
    print("Optimizing Images & Responsiveness...")
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.jsx')):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()

                original = content
                
                # 1. Optimize Unsplash images globally by adding auto=format&fit=crop&q=60 if not present
                content = re.sub(
                    r'(https://images\.unsplash\.com/[^"\']+?)(\?)?(&)?(w=\d+)?(&)?(q=\d+)?',
                    lambda m: m.group(1) + '?auto=format,compress&fit=crop&w=800&q=70',
                    content
                )
                
                # 2. Convert some known non-responsive texts:
                # E.g. text-[15rem] should be text-[8rem] md:text-[15rem]
                # Actually, let's keep this safe and target explicit things.
                # In hover-footer.tsx, we already have text-[120px]. Let's make it text-[80px] md:text-[120px].
                if 'hover-footer.tsx' in file:
                    content = content.replace('text-[120px]', 'text-[60px] md:text-[120px]')
                
                if 'footer.tsx' in file:
                    content = content.replace('h-[30vh] md:h-[40vh]', 'h-[20vh] md:h-[40vh]')
                
                # We can also add loading="lazy" to <img> tags without it
                content = re.sub(r'<img([^>]+)(?<!loading="lazy")>', r'<img loading="lazy"\1>', content)
                
                if content != original:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Optimized: {file}")

optimize_images('src')
