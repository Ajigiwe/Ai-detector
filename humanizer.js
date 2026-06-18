// Humanizer Module - v2.0
// Upgraded based on empirical findings from multi-version humanization study.
//
// KEY LESSONS LEARNED:
// 1. Context-blind word swaps (framework->system, essential->basically) destroy proper nouns.
//    All substitutions must be context-aware and skip protected terms.
// 2. Surface-level vocabulary swaps alone cannot achieve <50% detection.
//    Real humanization requires structural changes at the paragraph level.
// 3. Fake hesitation patterns ("I think.", "I'm fuzzy on") are now detector signals.
//    Only use when genuinely appropriate in context.
// 4. The strongest humanization signals: unresolved stories, off-topic tangents,
//    recurring characters, genuine technical errors, voice consistency.

// ---- PROTECTED TERMS (never substitute inside these) ----
// These are proper nouns, standards, and technical terms that must survive intact.
const PROTECTED_TERMS = [
  "Cyber Essentials",
  "Cyber Essentials Plus",
  "NIST Cybersecurity Framework",
  "NIST CSF",
  "ISO 27001",
  "ISO 27002",
  "NIST Framework",
  "PCI DSS",
  "SOC 2",
  "GDPR",
  "the framework", // preceded by "the" = referring to specific one, not generic
];

/**
 * Checks whether a match position falls inside a protected term.
 */
function isInsideProtectedTerm(text, matchIndex, matchLength) {
  const lowerText = text.toLowerCase();
  for (const term of PROTECTED_TERMS) {
    const termLower = term.toLowerCase();
    let searchFrom = 0;
    while (true) {
      const termIdx = lowerText.indexOf(termLower, searchFrom);
      if (termIdx === -1) break;
      // Check overlap
      if (matchIndex >= termIdx && matchIndex < termIdx + term.length) return true;
      if (matchIndex + matchLength > termIdx && matchIndex < termIdx + term.length) return true;
      searchFrom = termIdx + 1;
    }
  }
  return false;
}

// ---- CONTEXT-AWARE SUBSTITUTIONS ----
// Only replaces words when NOT inside a protected term context.
const SAFE_WORD_SUBSTITUTIONS = {
  "delve":         ["look closely at", "examine", "dig into", "check out"],
  "nuanced":       ["complex", "layered", "subtle"],
  "tapestry":      ["mix", "blend", "collection"],
  "robust":        ["strong", "solid", "reliable"],
  "sophisticated": ["complex", "advanced", "detailed"],
  "leverage":      ["use", "apply", "make use of"],
  "facilitate":    ["help with", "enable", "make easier"],
  "furthermore":   ["also", "on top of that", "and"],
  "moreover":      ["and", "what's more", "beyond that"],
  "nevertheless":  ["but", "still", "even so"],
  "consequently":  ["so", "as a result", "which means"],
  "in conclusion": ["so", "to wrap up", "the bottom line is"],
};

// ---- DETERMINISTIC PHRASE REPLACEMENTS ----
// These are safe to apply globally — they don't affect proper nouns.
const HUMANIZER_REPLACEMENTS = [
  // Clichés
  { regex: /\bin summary\b/gi, replacement: "to sum up" },
  { regex: /\bit is important to note that\b/gi, replacement: "keep in mind that" },
  { regex: /\bit is important to note\b/gi, replacement: "note that" },
  { regex: /\bcrucial role\b/gi, replacement: "major part" },
  { regex: /\bplay a vital role\b/gi, replacement: "matter a lot" },
  { regex: /\bplay a crucial role\b/gi, replacement: "play a huge part" },
  { regex: /\bplay a key role\b/gi, replacement: "play a big part" },
  { regex: /\bultimately\b/gi, replacement: "in the end" },
  { regex: /\btestament\b/gi, replacement: "proof" },
  { regex: /\bpinnacle\b/gi, replacement: "top" },
  { regex: /\bbeacon\b/gi, replacement: "guide" },
  { regex: /\bkey takeaway\b/gi, replacement: "main point" },
  { regex: /\bmeticulous\b/gi, replacement: "careful" },
  { regex: /\bby implementing\b/gi, replacement: "by using" },
  { regex: /\bthese challenges are real\b/gi, replacement: "these are real problems" },
  { regex: /\bleave a lot to be desired\b/gi, replacement: "are not good enough" },
  { regex: /\bit would not be honest\b/gi, replacement: "we have to admit" },
  { regex: /\bdesigned to work together\b/gi, replacement: "made to fit together" },
  { regex: /\brealistic roadmap\b/gi, replacement: "practical plan" },
  { regex: /\bunderscore\b/gi, replacement: "highlight" },
  { regex: /\bpivotal\b/gi, replacement: "key" },
  { regex: /\bmultifaceted\b/gi, replacement: "varied" },
  { regex: /\blandscape\b/gi, replacement: "situation" },
  { regex: /\brealm\b/gi, replacement: "field" },
  { regex: /\bfoster\b/gi, replacement: "build" },
  { regex: /\bparamount\b/gi, replacement: "vital" },
  { regex: /\bholistic\b/gi, replacement: "full-picture" },
  { regex: /\binnovative\b/gi, replacement: "new" },
  { regex: /\bsynergy\b/gi, replacement: "teamwork" },
  { regex: /\boptimize\b/gi, replacement: "improve" },
  { regex: /\bstreamline\b/gi, replacement: "simplify" },
  { regex: /\bempower\b/gi, replacement: "enable" },
  { regex: /\bcatalyst\b/gi, replacement: "spark" },
  { regex: /\bcornerstone\b/gi, replacement: "basis" },
  { regex: /\bintricate\b/gi, replacement: "complex" },
  { regex: /\bvibrant\b/gi, replacement: "lively" },
  { regex: /\bnoteworthy\b/gi, replacement: "interesting" },
  { regex: /\bgroundbreaking\b/gi, replacement: "significant" },
  { regex: /\bunprecedented\b/gi, replacement: "rare" },
  { regex: /\bmyriad\b/gi, replacement: "many" },
  { regex: /\bplethora\b/gi, replacement: "lot" },
  { regex: /\binvaluable\b/gi, replacement: "very useful" },
  { regex: /\bseamless\b/gi, replacement: "smooth" },
  { regex: /\bcomprehensive\b/gi, replacement: "thorough" },

  // Hedging
  { regex: /\btypically\b/gi, replacement: "usually" },
  { regex: /\bgenerally\b/gi, replacement: "mostly" },
  { regex: /\bin many cases\b/gi, replacement: "often" },
  { regex: /\bit is possible that\b/gi, replacement: "maybe" },
  { regex: /\bone could argue\b/gi, replacement: "some think" },
  { regex: /\bit is worth noting that\b/gi, replacement: "worth noting:" },
  { regex: /\bit is essential to understand that\b/gi, replacement: "remember that" },
  { regex: /\bat its core\b/gi, replacement: "at heart" },
  { regex: /\bin the realm of\b/gi, replacement: "in" },
  { regex: /\bin the context of\b/gi, replacement: "during" },
  { regex: /\bit goes without saying\b/gi, replacement: "of course" },
  { regex: /\bneedless to say\b/gi, replacement: "obviously" },
  { regex: /\bthis is not to say\b/gi, replacement: "to be clear" },
  { regex: /\bthat being said\b/gi, replacement: "even so" },
  { regex: /\bwith that in mind\b/gi, replacement: "so" },
  { regex: /\bon the other hand\b/gi, replacement: "however" },
  { regex: /\bby the same token\b/gi, replacement: "similarly" },
  { regex: /\bin light of this\b/gi, replacement: "therefore" },
  { regex: /\bas previously mentioned\b/gi, replacement: "as mentioned" },
  { regex: /\bas noted above\b/gi, replacement: "as before" },
  { regex: /\bas such\b/gi, replacement: "so" },
  { regex: /\bin order to\b/gi, replacement: "to" },
  { regex: /\bdue to the fact that\b/gi, replacement: "because" },
  { regex: /\bwith respect to\b/gi, replacement: "about" },
  { regex: /\bin terms of\b/gi, replacement: "on" },
  { regex: /\ba wide range of\b/gi, replacement: "many" },
  { regex: /\ba variety of\b/gi, replacement: "several" },
  { regex: /\bin a variety of ways\b/gi, replacement: "differently" },
  { regex: /\bmoving forward\b/gi, replacement: "from now on" },
  { regex: /\bgoing forward\b/gi, replacement: "from now on" },
  { regex: /\bit is clear that\b/gi, replacement: "clearly" },
  { regex: /\bone must consider\b/gi, replacement: "you should think about" },
  { regex: /\bit can be argued\b/gi, replacement: "some say" },
  { regex: /\bit could be said\b/gi, replacement: "one might say" },
  { regex: /\bsome may argue\b/gi, replacement: "some say" },
  { regex: /\bothers may contend\b/gi, replacement: "others say" },
  { regex: /\bthere is no doubt that\b/gi, replacement: "clearly" },
  { regex: /\bfrom a practical standpoint\b/gi, replacement: "in practice" },
  { regex: /\bfrom a technical standpoint\b/gi, replacement: "technically" },

  // AI list openers
  { regex: /\bthere are several different reasons why\b/gi, replacement: "a few reasons explain why" },
  { regex: /\bthere are several reasons why\b/gi, replacement: "here's why" },
  { regex: /\bthere are several\b/gi, replacement: "several" },
  { regex: /\bthere are many\b/gi, replacement: "many" },
  { regex: /\bchoose to carry out\b/gi, replacement: "decide to run" },
  { regex: /\bcarry out\b/gi, replacement: "run" },
  { regex: /\bthe user may\b/gi, replacement: "you might" },

  // Sequential starters
  { regex: /\bthe first step\b/gi, replacement: "first" },
  { regex: /\bthe second step\b/gi, replacement: "next" },
  { regex: /\bthe third step\b/gi, replacement: "after that" },
  { regex: /\bto start with\b/gi, replacement: "for starters" },

  // Contractions injection
  { regex: /\bdo not\b/gi, replacement: "don't" },
  { regex: /\bcannot\b/gi, replacement: "can't" },
  { regex: /\bit is\b/gi, replacement: "it's" },
  { regex: /\bwe will\b/gi, replacement: "we'll" },
  { regex: /\bthey are\b/gi, replacement: "they're" },
  { regex: /\bwould not\b/gi, replacement: "wouldn't" },
  { regex: /\bshould not\b/gi, replacement: "shouldn't" },
  { regex: /\bcould not\b/gi, replacement: "couldn't" },
  { regex: /\bdoes not\b/gi, replacement: "doesn't" },
  { regex: /\bis not\b/gi, replacement: "isn't" },
  { regex: /\bare not\b/gi, replacement: "aren't" },

  // Paragraph transition starters
  { regex: /^firstly,?\s+/gi, replacement: "first, " },
  { regex: /^secondly,?\s+/gi, replacement: "then, " },
  { regex: /^thirdly,?\s+/gi, replacement: "after that, " },
  { regex: /^finally,?\s+/gi, replacement: "last, " },
  { regex: /^lastly,?\s+/gi, replacement: "last, " },
  { regex: /^in conclusion,?\s+/gi, replacement: "all in all, " },
  { regex: /^furthermore,?\s+/gi, replacement: "also, " },
  { regex: /^moreover,?\s+/gi, replacement: "beyond that, " },
];

/**
 * Context-aware em dash handling.
 */
function handleEmDashes(text) {
  return text.replace(/—/g, (match, offset) => {
    const before = text.substring(Math.max(0, offset - 20), offset).trim();
    const beforeWords = before.split(/\s+/).filter(w => w.length > 0);
    const after = text.substring(offset + 1, Math.min(text.length, offset + 21)).trim();
    const afterWords = after.split(/\s+/).filter(w => w.length > 0);
    if (beforeWords.length < 4 && afterWords.length < 4 && Math.random() < 0.4) return '—';
    if (/\b(is|was|are|were|has|had|have|did|do|does|can|will|should|would|could)\b/i.test(before)) return '; ';
    return ', ';
  });
}

/**
 * Context-aware word substitutions that skip protected proper nouns.
 */
function applyContextAwareSubstitutions(text) {
  let result = text;

  for (const [aiWord, replacements] of Object.entries(SAFE_WORD_SUBSTITUTIONS)) {
    const regex = new RegExp(`\\b${aiWord}\\b`, 'gi');
    result = result.replace(regex, (match, offset) => {
      // Skip if inside a protected term
      if (isInsideProtectedTerm(result, offset, match.length)) return match;

      // Skip if preceded by "NIST", "cyber", "the" within 3 words (likely a proper/technical reference)
      const preceding = result.substring(Math.max(0, offset - 30), offset).toLowerCase();
      if (/\b(nist|cyber|iso|pci|soc|gdpr|the)\s+\w*\s*$/.test(preceding)) return match;

      // Apply substitution
      const replacement = replacements[Math.floor(Math.random() * replacements.length)];
      if (match.charAt(0) === match.charAt(0).toUpperCase() && match.charAt(0) !== match.charAt(0).toLowerCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }

  return result;
}

/**
 * Applies deterministic phrase replacements safely.
 * Skips matches that fall inside protected terms.
 */
function applyDeterministicReplacements(text) {
  let result = text;
  HUMANIZER_REPLACEMENTS.forEach(rule => {
    result = result.replace(rule.regex, (match, ...args) => {
      // args includes groups, then offset, then original string
      const offset = typeof args[args.length - 2] === 'number' ? args[args.length - 2] : 0;
      if (isInsideProtectedTerm(result, offset, match.length)) return match;
      return rule.replacement;
    });
  });
  return result;
}

/**
 * Main humanizer function.
 * Applies all humanization strategies paragraph-by-paragraph.
 */
function humanizeText(text) {
  if (!text || text.trim().length === 0) return "";

  const paragraphs = text.split(/\r?\n/);
  const humanizedParagraphs = paragraphs.map(paragraph => {
    if (paragraph.trim().length === 0) return "";

    // 1. Strip watermarks + fix spacing
    let clean = paragraph.replace(/[\u200B-\u200D\uFEFF\u200E\u200F]/g, "");
    clean = handleEmDashes(clean);
    clean = clean
      .replace(/\s+,\s*/g, ", ")
      .replace(/\s+\.\s*/g, ". ")
      .replace(/\s+;\s*/g, "; ")
      .replace(/\s+:\s*/g, ": ")
      .replace(/\s+/g, " ");

    // 2. Apply deterministic phrase replacements (context-aware)
    clean = applyDeterministicReplacements(clean);

    // 3. Apply word-level context-aware substitutions
    clean = applyContextAwareSubstitutions(clean);

    // 4. Sentence-level restructuring (merge short / split long)
    const sentenceParts = clean.split(/([.!?]\s+)/);
    const sentences = [];
    for (let j = 0; j < sentenceParts.length; j += 2) {
      if (sentenceParts[j]) {
        const sText = sentenceParts[j].trim();
        const sDelim = sentenceParts[j + 1] || "";
        sentences.push({ text: sText, delim: sDelim });
      }
    }

    const processedSentences = [];
    for (let k = 0; k < sentences.length; k++) {
      let current = sentences[k];

      // Merge two consecutive short sentences
      if (k % 2 === 0 && k + 1 < sentences.length) {
        const next = sentences[k + 1];
        const cWords = current.text.split(/\s+/).filter(w => w.length > 0).length;
        const nWords = next.text.split(/\s+/).filter(w => w.length > 0).length;
        if (cWords > 0 && cWords < 8 && nWords > 0 && nWords < 8) {
          const connectors = ["and", "but", "so", "which means"];
          const connector = connectors[Math.floor(Math.random() * connectors.length)];
          const nextTextDecap = next.text.charAt(0).toLowerCase() + next.text.slice(1);
          current = {
            text: `${current.text.replace(/[.,!?]$/, "")}, ${connector} ${nextTextDecap}`,
            delim: next.delim
          };
          k++;
        }
      }

      // Split very long sentences at clause boundaries
      const wCount = current.text.split(/\s+/).filter(w => w.length > 0).length;
      if (wCount > 22) {
        const splitWords = ["which", "but", "although", "because", "since", "while"];
        for (const connector of splitWords) {
          const regex = new RegExp(`\\b,?\\s+(${connector})\\s+`, "i");
          if (regex.test(current.text)) {
            const parts = current.text.split(regex);
            if (parts.length >= 3) {
              const part1 = parts[0].trim();
              const part2 = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
              const part3 = parts.slice(2).join(" ").trim();
              current = { text: `${part1}. ${part2} ${part3}`, delim: current.delim };
              break;
            }
          }
        }
      }

      processedSentences.push(current.text + (current.delim || ""));
    }

    return processedSentences.join("").trim();
  });

  return humanizedParagraphs.join("\n");
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { humanizeText };
} else {
  window.humanizeText = humanizeText;
}
