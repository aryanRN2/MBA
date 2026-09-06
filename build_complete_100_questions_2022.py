import json
import re

# Load the raw extracted blocks from the exact official 2022 PDF
with open('official_2022_raw_blocks.json', 'r', encoding='utf-8') as f:
    raw_blocks = json.load(f)

print(f"Loaded {len(raw_blocks)} question blocks from official PDF.")

# Let's verify and build each of the 100 questions precisely matching the PDF
questions = []

# Questions dictionary mapping
# We will define each question with its exact official text, bilingual Hindi translation, options, correct answer, and detailed step-by-step solution.

# Master questions data for 1-100:
# [We process every block from raw_blocks]
