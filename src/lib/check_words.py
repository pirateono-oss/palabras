import re

with open('words.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the string between backticks
m = re.search(r'export const spanishWords: string\[\] = `(.*?)`', content, re.DOTALL)
if m:
    raw = m.group(1)
    words = raw.strip().split()
    unique = sorted(set(w.lower() for w in words))
    short = [w for w in unique if len(w) < 3]
    if short:
        print(f'Short words remaining: {short}')
    else:
        print('No short words remaining - clean!')
    
    filtered = [w for w in unique if len(w) >= 3]
    print(f'Words after >=3 filter: {len(filtered)}')
    
    # Check for duplicates in the final processed output
    # The pipeline: .trim().split(/\s+/).filter(w => w.length >= 3).map(w => w.toLowerCase())
    final = sorted(set(w.lower() for w in raw.strip().split() if len(w) >= 3))
    print(f'Deduplicated final count: {len(final)}')
else:
    print("Could not find the template literal")
