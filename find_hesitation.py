from docx import Document

doc = Document(r"docs/cyber_security_assessment_final.docx")
text = ' '.join([p.text for p in doc.paragraphs if p.text.strip()])

FAKE_HESITATION = [
    "i think.", "i think,", "if i'm honest", "if i'm being honest",
    "i'm fuzzy on", "i'd have to check", "i'd have to look that up",
    "i always get those two confused", "or maybe it was", "it blurs together",
    "i'm not entirely sure", "don't quote me on that", "i want to say",
    "i believe it was", "something like that"
]

lower = text.lower()
for phrase in FAKE_HESITATION:
    if phrase in lower:
        idx = lower.index(phrase)
        start = max(0, idx - 60)
        end = min(len(text), idx + 80)
        print("HIT:", phrase)
        print("  context:", text[start:end])
        print()
