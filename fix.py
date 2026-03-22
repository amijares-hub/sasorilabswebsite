import re
import codecs
import os

filepath = r"src/pages/service-pages.tsx"
if not os.path.exists(filepath):
    filepath = r"src\pages\service-pages.tsx"

with codecs.open(filepath, 'r', 'utf-8') as f:
    code = f.read()

# Find tagline: "something\nsomething" and replace with tagline: "something\nsomething"
# Note that we want literal backslash n in the resulting TSX file
code = re.sub(r'(tagline:\s*"[^"]*)\n([^"]*")', r'\1\\n\2', code)

with codecs.open(filepath, 'w', 'utf-8') as f:
    f.write(code)

print("Fixed syntax errors in service-pages.tsx!")
