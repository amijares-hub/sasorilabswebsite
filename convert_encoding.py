import os
import codecs

def convert_to_utf8(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.css', '.html', '.sql', '.txt', '.log')):
                filepath = os.path.join(root, file)
                try:
                    # Try reading as UTF-16 LE
                    with codecs.open(filepath, 'r', 'utf-16-le') as f:
                        content = f.read()
                    
                    # If successful, check if it starts with a BOM or null chars
                    if content.startswith('\ufeff') or '浩潰瑲' not in content:
                         if '浩潰瑲' in content: # Still garbled
                             content = content.encode('utf-16-le').decode('utf-16-le') # No
                             pass

                    # Direct way: read bytes
                    with open(filepath, 'rb') as f:
                        blob = f.read()
                    
                    # Try decodings
                    text = None
                    for enc in ['utf-16-le', 'utf-16-be', 'utf-8']:
                        try:
                            text = blob.decode(enc)
                            if 'import' in text or '@import' in text or '<!doctype' in text or 'CREATE' in text:
                                break
                        except:
                            continue
                    
                    if text is not None:
                        with codecs.open(filepath, 'w', 'utf-8') as f:
                            f.write(str(text))
                        print(f"Converted {filepath} to UTF-8 using detected encoding")
                except Exception as e:
                    pass

if __name__ == "__main__":
    convert_to_utf8('.')
