# AI Detector & Humanizer

A local heuristics-based AI content detection and text humanization toolkit built in JavaScript.

## What It Does

- **Detects** AI-generated text using a 12-point scoring system covering vocabulary clichés, structural uniformity, fake hesitation patterns, narrative arc analysis, sentence burstiness, and watermark detection.
- **Humanizes** AI-generated text by applying context-aware vocabulary substitutions, contraction injection, paragraph restructuring, and proper noun protection.

## Files

| File | Purpose |
|------|---------|
| `detector.js` | Core AI detection module (heuristics engine) |
| `humanizer.js` | Core text humanization module |
| `score_text.js` | CLI runner — scores `pdf_text.txt` using the detector |
| `app.js` | Express web server exposing `/detect` and `/humanize` endpoints |
| `index.html` | Frontend UI |
| `style.css` | UI styles |
| `docx.js` | DOCX parsing library |
| `ai_detection_guide.md` | Research notes and detection signal documentation |

## Usage

### Install
```bash
npm install
```

### Run the web app
```bash
node app.js
```

### Score a text file from CLI
```bash
# Put your text into pdf_text.txt, then:
node score_text.js
```

## Detection Signals

The detector scores text across 12 checklist items:

1. 3+ AI signature words (delve, nuanced, robust, framework…)
2. 3+ filler opener phrases (it is worth noting that…)
3. Intro/conclusion word overlap
4. No first-person voice
5. Low sentence length variance (burstiness)
6. Multiple summary-ending paragraphs
7. High hedging density
8. Repeated use of framework/landscape/realm
9. Suspicious paragraph length uniformity *(new in v2)*
10. Flawless structural flow with no informal punctuation
11. Fake hesitation patterns *(new in v2)*
12. Multiple lesson-learned narrative arcs *(new in v2)*

## Humanizer Notes

The humanizer applies context-aware substitutions that **protect proper nouns**:
- `Cyber Essentials`, `NIST Cybersecurity Framework`, `ISO 27001`, `PCI DSS` and other standards are never modified.
- Generic AI terms are replaced only when not adjacent to technical/standards terminology.

> **Important:** Surface-level word substitution alone cannot defeat advanced AI detectors. Structural changes (paragraph length variation, unresolved narratives, recurring characters, genuine voice) are required for deep humanization.
