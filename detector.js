// AI Detector Module (Local Heuristics) - v2.0
// Upgraded based on empirical findings from multi-version humanization study.
// Key new signals: macro-structural uniformity, fake hesitation patterns,
// "lesson-learned" narrative arc, generic anecdote markers, AI personality openers.

const AI_CLICHES = [
  // Core AI vocabulary
  "delve", "nuanced", "tapestry", "underscore", "pivotal", "robust",
  "multifaceted", "sophisticated", "significant", "essentially", "framework",
  "landscape", "realm", "leverage", "foster", "facilitate", "comprehensive",
  "critical", "crucial", "vital", "paramount", "holistic", "innovative",
  "dynamic", "synergy", "optimize", "streamline", "empower", "catalyst",
  "cornerstone", "testament", "intricate", "vibrant", "noteworthy",
  "commendable", "groundbreaking", "unprecedented", "myriad", "plethora",
  "invaluable", "profound", "seamless", "furthermore", "moreover", "consequently",
  "meticulous", "key takeaway", "look no further", "demystify", "by implementing",
  "in this section", "ultimately", "the basic concept is simple", "designed to work together",
  "phased approach", "realistic roadmap", "leave a lot to be desired", "it would not be honest",
  "these challenges are real", "play a vital role", "beacon", "pinnacle",

  // AI personality opener phrases (learned from study)
  "it is worth noting that", "it is important to note that", "it is essential to understand that",
  "in conclusion", "to summarize", "in summary", "at its core", "at the end of the day",
  "in the realm of", "in the context of", "it goes without saying", "needless to say",
  "this is not to say", "that being said", "with that in mind", "on the other hand",
  "by the same token", "in light of this", "as previously mentioned", "as noted above",
  "as such", "in order to", "due to the fact that", "with respect to", "in terms of",
  "a wide range of", "a variety of", "in a variety of ways", "moving forward",
  "going forward", "it is clear that", "one must consider", "it can be argued",
  "it could be said", "some may argue", "others may contend", "there is no doubt that",
  "there are several different reasons why", "there are several reasons why", "choose to carry out",
  "the user may", "there are many", "can include many information", "many information",

  // Newly identified AI structural tells (from humanization study)
  "it is important to", "from a practical standpoint", "from a technical standpoint",
  "in practical terms", "in real-world scenarios", "in today's digital age",
  "plays a critical role", "plays a key role", "when it comes to",
  "the importance of", "the need for", "the ability to",
  "this highlights", "this underscores", "this demonstrates"
];

// Fake hesitation phrases: AI mimicking human uncertainty
// These appear genuine but are placed too precisely on minor details only
const FAKE_HESITATION_PHRASES = [
  "i think.", "i think,", "if i'm honest", "if i'm being honest",
  "i'm fuzzy on", "i'd have to check", "i'd have to look that up",
  "i always get those two confused", "or maybe it was", "it blurs together",
  "i'm not entirely sure", "don't quote me on that", "i want to say",
  "i believe it was", "something like that"
];

// Structural AI tells: "lesson learned" arc indicators
// Real humans sometimes don't learn, or the story has no lesson
const LESSON_LEARNED_INDICATORS = [
  "this taught me", "that's why i always", "i learned from this",
  "retesting is how you", "this is why", "the lesson here",
  "the key takeaway", "this demonstrates why", "that's when i realized",
  "from that point on", "after that experience"
];

// Generic anecdote markers: perfectly formed stories with no mess
const GENERIC_ANECDOTE_MARKERS = [
  "a few years ago,", "at a previous employer", "at my last job",
  "some time ago,", "not long ago,", "in one instance,",
  "in one case,", "on one occasion,"
];

const AI_HEDGING = [
  "often", "typically", "generally", "in many cases", "it depends on",
  "this may vary", "under certain circumstances", "in some contexts",
  "it is possible that", "one could argue", "it could be suggested",
  "this remains to be seen", "there is still debate around", "results may differ",
  "it is not always the case that"
];

const UNCONTRACTED_FORMS = [
  /\bdo not\b/gi, /\bcannot\b/gi, /\bit is\b/gi, /\bwe will\b/gi,
  /\bthey are\b/gi, /\bwould not\b/gi, /\bshould not\b/gi, /\bcould not\b/gi,
  /\bdoes not\b/gi, /\bhave not\b/gi, /\bhad not\b/gi, /\bis not\b/gi,
  /\bare not\b/gi, /\bwas not\b/gi, /\bwere not\b/gi
];

const CONTRACTED_FORMS = [
  /\bdon't\b/gi, /\bcan't\b/gi, /\bit's\b/gi, /\bwe'll\b/gi,
  /\bthey're\b/gi, /\bwouldn't\b/gi, /\bshouldn't\b/gi, /\bcouldn't\b/gi,
  /\bdoesn't\b/gi, /\bhaven't\b/gi, /\bhadn't\b/gi, /\bisn't\b/gi,
  /\baren't\b/gi, /\bwasn't\b/gi, /\bweren't\b/gi
];

const TRANSITION_STARTERS = [
  /^(firstly|secondly|thirdly|finally|lastly|consequently|furthermore|moreover|in conclusion|to sum up|specifically|additionally|to address this)/i
];

function getSentences(text) {
  return text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function calculateBurstiness(sentences) {
  if (sentences.length <= 1) return 0;
  const wordCounts = sentences.map(s => s.split(/\s+/).filter(w => w.length > 0).length);
  const mean = wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length;
  const variance = wordCounts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (wordCounts.length - 1);
  return Math.sqrt(variance);
}

function calculateVocabDiversity(text) {
  const words = text.toLowerCase().match(/\b[a-z']+\b/g);
  if (!words || words.length === 0) return 0;
  const uniqueWords = new Set(words);
  const basicTTR = uniqueWords.size / words.length;
  const windowSize = Math.min(50, words.length);
  let totalTTR = 0;
  let windowsCount = 0;
  for (let i = 0; i <= words.length - windowSize; i++) {
    const windowWords = words.slice(i, i + windowSize);
    const windowUnique = new Set(windowWords);
    totalTTR += windowUnique.size / windowSize;
    windowsCount++;
  }
  return windowsCount > 0 ? totalTTR / windowsCount : basicTTR;
}

/**
 * Detects structural uniformity across a multi-section document.
 * AI answers all questions with equal depth; humans don't.
 * Returns a score 0-1 where 1 = perfectly uniform (AI signal).
 */
function detectStructuralUniformity(paragraphs) {
  if (paragraphs.length < 4) return 0;
  const lengths = paragraphs.map(p => p.split(/\s+/).filter(w => w.length > 0).length);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  if (mean === 0) return 0;
  const variance = lengths.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / lengths.length;
  const cv = Math.sqrt(variance) / mean; // Coefficient of variation
  // Low CV = high uniformity = AI signal. Threshold: CV < 0.5
  return cv < 0.5 ? (0.5 - cv) * 2 : 0; // Returns 0-1
}

/**
 * Counts "fake hesitation" patterns: AI mimicking uncertainty,
 * placed precisely on minor/unimportant details.
 */
function countFakeHesitation(lowerText) {
  return FAKE_HESITATION_PHRASES.filter(phrase => lowerText.includes(phrase)).length;
}

/**
 * Counts "lesson learned" arc completions in a single paragraph.
 * Real humans sometimes tell stories with no moral.
 */
function countLessonLearnedArcs(paragraphs) {
  return paragraphs.filter(p => {
    const lower = p.toLowerCase();
    return LESSON_LEARNED_INDICATORS.some(ind => lower.includes(ind));
  }).length;
}

/**
 * Main detection function.
 */
function detectAI(text) {
  if (!text || text.trim().length < 10) {
    return { score: 0, sentences: [], burstiness: 0, vocabDiversity: 0, clicheCount: 0, contractionRatio: 1.0, transitionFlagCount: 0, checklistScore: 0, checklistDetails: [] };
  }

  const sentences = getSentences(text);
  const burstiness = calculateBurstiness(sentences);
  const vocabDiversity = calculateVocabDiversity(text);
  const lowerText = text.toLowerCase();

  // Count AI clichés
  let clicheCount = 0;
  AI_CLICHES.forEach(cliche => {
    if (lowerText.includes(cliche)) clicheCount += 1;
  });

  // Count hedging
  let hedgingCount = 0;
  AI_HEDGING.forEach(h => {
    if (lowerText.includes(h)) hedgingCount += 1;
  });

  // Count fake hesitation (new signal)
  const fakeHesitationCount = countFakeHesitation(lowerText);

  // Em dashes
  const emDashCount = (text.match(/—/g) || []).length;

  // Unicode watermarks
  const watermarkRegex = /[\u200B-\u200D\uFEFF\u200E\u200F]/g;
  const watermarkCount = (text.match(watermarkRegex) || []).length;
  const hasWatermarks = watermarkCount > 0;

  // Contractions ratio
  let uncontractedCount = 0;
  let contractedCount = 0;
  UNCONTRACTED_FORMS.forEach(regex => { uncontractedCount += (text.match(regex) || []).length; });
  CONTRACTED_FORMS.forEach(regex => { contractedCount += (text.match(regex) || []).length; });
  const contractionRatio = (uncontractedCount + contractedCount > 0)
    ? contractedCount / (uncontractedCount + contractedCount)
    : 1.0;

  // Paragraph transition starters
  const paragraphs = text.split(/\r?\n/).map(p => p.trim()).filter(p => p.length > 0);
  let transitionFlagCount = 0;
  paragraphs.forEach(p => {
    TRANSITION_STARTERS.forEach(regex => {
      if (regex.test(p)) transitionFlagCount += 1;
    });
  });

  // Structural uniformity score (new)
  const uniformityScore = detectStructuralUniformity(paragraphs);

  // Lesson-learned arcs (new)
  const lessonLearnedCount = countLessonLearnedArcs(paragraphs);

  // --- 12-Point Checklist Scoring ---
  let checklistScore = 0;
  const checklistDetails = [];

  // Item 1: Contains 3+ AI signature words
  const sigWordMatches = AI_CLICHES.filter(w => !w.includes(" ") && lowerText.includes(w));
  if (sigWordMatches.length >= 3) {
    checklistScore++;
    checklistDetails.push("Contains 3+ AI signature words");
  }

  // Item 2: Contains 3+ filler opener phrases
  const sigPhraseMatches = AI_CLICHES.filter(w => w.includes(" ") && lowerText.includes(w));
  if (sigPhraseMatches.length >= 3) {
    checklistScore++;
    checklistDetails.push("Contains 3+ filler opener phrases");
  }

  // Item 3: Intro and conclusion overlap heavily
  if (paragraphs.length >= 3) {
    const firstPWords = new Set(paragraphs[0].toLowerCase().match(/\b[a-z']+\b/g) || []);
    const lastPWords = new Set(paragraphs[paragraphs.length - 1].toLowerCase().match(/\b[a-z']+\b/g) || []);
    if (firstPWords.size > 0 && lastPWords.size > 0) {
      let intersection = 0;
      firstPWords.forEach(w => { if (lastPWords.has(w) && w.length > 3) intersection++; });
      const overlapRatio = intersection / Math.min(firstPWords.size, lastPWords.size);
      if (overlapRatio > 0.35) {
        checklistScore++;
        checklistDetails.push("Intro and conclusion paragraphs have high word overlap");
      }
    }
  }

  // Item 4: No personal voice
  const personalPronouns = /\b(i|me|my|we|our|us)\b/i;
  if (!personalPronouns.test(text)) {
    checklistScore++;
    checklistDetails.push("No first-person voice or pronouns detected");
  }

  // Item 5: Low sentence length variance
  if (sentences.length > 3 && burstiness < 4.0) {
    checklistScore++;
    checklistDetails.push("Sentence lengths are highly uniform (low burstiness)");
  }

  // Item 6: Multiple summary endings
  let summaryEnds = 0;
  paragraphs.forEach(p => {
    const pSentences = getSentences(p);
    if (pSentences.length > 0) {
      const lastSentence = pSentences[pSentences.length - 1].toLowerCase();
      const summaryIndicators = ["in summary", "to sum up", "in conclusion", "ultimately", "all in all", "in essence"];
      if (summaryIndicators.some(ind => lastSentence.includes(ind))) summaryEnds++;
    }
  });
  if (paragraphs.length > 1 && summaryEnds >= paragraphs.length / 2) {
    checklistScore++;
    checklistDetails.push("Multiple paragraphs wrap up with summary indicators");
  }

  // Item 7: High hedging density
  if (hedgingCount >= 3) {
    checklistScore++;
    checklistDetails.push("High density of hedging terms or qualifiers");
  }

  // Item 8: Uses framework/landscape/realm repeatedly
  let frameworkWordCount = 0;
  ["framework", "landscape", "realm"].forEach(w => {
    const regex = new RegExp(`\\b${w}\\b`, "g");
    frameworkWordCount += (lowerText.match(regex) || []).length;
  });
  if (frameworkWordCount >= 2) {
    checklistScore++;
    checklistDetails.push("Uses 'framework', 'landscape', or 'realm' multiple times");
  }

  // Item 9: Highly uniform paragraph lengths (structural uniformity)
  if (uniformityScore > 0.3) {
    checklistScore++;
    checklistDetails.push("Paragraph lengths are suspiciously uniform across the document");
  }

  // Item 10: No informal punctuation + low contractions
  if (contractionRatio < 0.1 && !/!|\?/.test(text)) {
    checklistScore++;
    checklistDetails.push("Flawless structural flow with no informal punctuation");
  }

  // Item 11 (NEW): Fake hesitation pattern detected
  if (fakeHesitationCount >= 2) {
    checklistScore++;
    checklistDetails.push("Fake hesitation phrases detected (AI mimicking uncertainty)");
  }

  // Item 12 (NEW): Multiple "lesson-learned" narrative arcs
  if (lessonLearnedCount >= 3) {
    checklistScore++;
    checklistDetails.push("Multiple 'lesson-learned' narrative arcs (all stories resolve cleanly)");
  }

  // --- Score Calculation ---
  let burstinessScore = 0;
  if (burstiness < 3) burstinessScore = 20;
  else if (burstiness < 5) burstinessScore = 12;
  else if (burstiness < 7) burstinessScore = 5;

  let clicheScore = Math.min(clicheCount * 5, 20);
  let hedgingScore = Math.min(hedgingCount * 8, 15);
  let emDashScore = Math.min(emDashCount * 5, 10);

  let vocabScore = 0;
  const words = text.split(/\s+/).length;
  if (words > 100 && vocabDiversity < 0.45) vocabScore = 8;

  let contractionPenalty = 0;
  if (uncontractedCount > 2 && contractionRatio < 0.2) contractionPenalty = 12;

  let transitionPenalty = 0;
  if (transitionFlagCount >= 2) transitionPenalty = 10;

  // New: structural uniformity penalty (up to 10 pts)
  let uniformityPenalty = Math.round(uniformityScore * 10);

  // New: fake hesitation bonus reduction (each fake hesitation = slight AI signal)
  let fakeHesitationPenalty = Math.min(fakeHesitationCount * 3, 9);

  let watermarkScore = hasWatermarks ? 50 : 0;

  // Checklist weight (now 12 items, up to 30 points)
  let checklistWeight = checklistScore * 2.5;

  let totalScore = burstinessScore + clicheScore + hedgingScore + emDashScore + vocabScore
    + contractionPenalty + transitionPenalty + uniformityPenalty + fakeHesitationPenalty
    + watermarkScore + checklistWeight;
  totalScore = Math.min(Math.max(totalScore, 0), 100);

  // Analyze individual sentences
  const analyzedSentences = sentences.map(s => {
    const sLower = s.toLowerCase();
    let isAiCliche = false;
    let foundCliche = "";

    if (watermarkRegex.test(s)) {
      isAiCliche = true;
      foundCliche = "hidden watermark character";
    } else if (s.includes("—")) {
      isAiCliche = true;
      foundCliche = "em dash (—)";
    } else {
      for (const cliche of AI_CLICHES) {
        if (sLower.includes(cliche)) { isAiCliche = true; foundCliche = cliche; break; }
      }
      if (!isAiCliche) {
        for (const hedging of AI_HEDGING) {
          if (sLower.includes(hedging)) { isAiCliche = true; foundCliche = `hedging: "${hedging}"`; break; }
        }
      }
      if (!isAiCliche) {
        for (const phrase of FAKE_HESITATION_PHRASES) {
          if (sLower.includes(phrase)) { isAiCliche = true; foundCliche = `fake hesitation: "${phrase}"`; break; }
        }
      }
    }

    const sWords = s.split(/\s+/).filter(w => w.length > 0).length;
    const isLikelyAI = isAiCliche || (burstiness < 4 && sWords > 12 && sWords < 18);

    return { text: s, isLikelyAI, foundCliche };
  });

  return {
    score: Math.round(totalScore),
    sentences: analyzedSentences,
    burstiness: parseFloat(burstiness.toFixed(2)),
    vocabDiversity: parseFloat(vocabDiversity.toFixed(2)),
    clicheCount,
    hedgingCount,
    fakeHesitationCount,
    lessonLearnedCount,
    structuralUniformityScore: parseFloat(uniformityScore.toFixed(2)),
    hasWatermarks,
    watermarkCount,
    contractionRatio: parseFloat(contractionRatio.toFixed(2)),
    transitionFlagCount,
    checklistScore,
    checklistDetails
  };
}

// Export for node or window context
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { detectAI };
} else {
  window.detectAI = detectAI;
}
