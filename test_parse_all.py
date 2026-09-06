import json
import re

with open('/Users/aryanmaurya/MBA/raw_2022_ocr_dump.txt', 'r', encoding='utf-8') as f:
    raw_ocr = f.read()

# Let's inspect each question block in raw_ocr
blocks = re.split(r'SI\.\s*No\.\s*(\d+)', raw_ocr)
print(f"Total blocks split: {len(blocks)}")

# Let's write a python script that accurately parses all questions from 1 to 100
