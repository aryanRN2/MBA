import os
import json
import re
import fitz
import pytesseract
from PIL import Image
import io

def clean_ocr(text):
    if not text:
        return ""
    text = re.sub(r'MP\.\s*(?:oNiegedunia|sliegedunia|ecedunia|aliesedunia)\b', '', text, flags=re.IGNORECASE)
    text = re.sub(r'https?://\S+', '', text)
    text = re.sub(r'cdn3\.digialm\.com\S*', '', text)
    text = re.sub(r'www\.abhiconcept\.com\S*', '', text)
    text = re.sub(r'ABHI\s*CONCEPT', '', text, flags=re.IGNORECASE)
    text = re.sub(r'GET IT ON.*?Google Play', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Complete CUET.*?Visit\s*:', '', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'Enquire\s*:\s*\d+', '', text)
    text = re.sub(r'[\r\n]+', '\n', text)
    return text.strip()

def parse_options_from_text(raw_text):
    lines = [line.strip() for line in raw_text.split('\n') if line.strip()]
    question_lines = []
    options = {}
    
    # Check for (1)/(2)/(3)/(4) or 1./2./3./4. or 1)/2)/3)/4)
    opt_pattern = re.compile(r'^(?:\(?([1-4])\)?[\.\:\-\s]+|\(([1-4])\))\s*(.*)$')
    
    for line in lines:
        m = opt_pattern.match(line)
        if m:
            opt_num = m.group(1) or m.group(2)
            opt_val = m.group(3).strip()
            options[opt_num] = opt_val
        else:
            if not options:
                question_lines.append(line)
            else:
                # continuation of last option
                last_key = str(max([int(k) for k in options.keys()]))
                options[last_key] = (options[last_key] + " " + line).strip()
                
    q_text = "\n".join(question_lines).strip()
    return q_text, options

print("OCR & Cleaner Engine initialized.")
