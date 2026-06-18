# AI Text Detection — Full Reference Guide

A complete reference of signals, keywords, patterns, and structural tells that indicate AI-generated text.

---

## 1. AI Signature Vocabulary

Words and phrases that LLMs statistically overuse. High frequency of these in a text is a strong signal.

### Single words

| Word | Why it's a flag |
|---|---|
| `delve` | Almost never used by humans in writing; extremely common in GPT/Claude output |
| `nuanced` | AI loves describing everything as nuanced |
| `tapestry` | Used as a metaphor constantly by AI |
| `underscore` | As in "this underscores the importance of..." |
| `pivotal` | AI's favourite synonym for "important" |
| `robust` | Overused in technical and academic AI writing |
| `multifaceted` | AI describing complexity |
| `sophisticated` | Used to describe systems, ideas, or approaches |
| `significant` | Extremely high frequency in AI output |
| `essentially` | Filler used to simplify or summarise |
| `framework` | AI structures everything as a "framework" |
| `landscape` | "The current landscape of..." |
| `realm` | "In the realm of..." |
| `leverage` | Business/tech AI writing |
| `foster` | "To foster collaboration..." |
| `facilitate` | "This facilitates..." |
| `comprehensive` | AI loves calling things comprehensive |
| `critical` | "It is critical that..." |
| `crucial` | Interchangeable with critical, used just as often |
| `vital` | Same family as critical/crucial |
| `paramount` | "This is of paramount importance" |
| `holistic` | AI's go-to for anything involving multiple factors |
| `innovative` | Especially in business or tech contexts |
| `dynamic` | "A dynamic environment..." |
| `synergy` | Corporate AI writing |
| `optimize` | AI loves optimizing things |
| `streamline` | "To streamline the process..." |
| `empower` | "To empower individuals..." |
| `catalyst` | "This acted as a catalyst..." |
| `cornerstone` | "X is the cornerstone of Y" |
| `testament` | "This is a testament to..." |
| `intricate` | AI describing complex things |
| `vibrant` | Used to describe communities, cultures, cities |
| `noteworthy` | "It is noteworthy that..." |
| `commendable` | Praise language AI uses |
| `groundbreaking` | AI describing innovations |
| `unprecedented` | Very frequent in AI news/analysis writing |
| `myriad` | "A myriad of possibilities..." |
| `plethora` | "A plethora of options..." |
| `myriad` | Variant of the above |
| `invaluable` | "Invaluable insights..." |
| `profound` | "Profound implications..." |
| `seamless` | "A seamless experience..." |

---

### Signature phrases

| Phrase | Notes |
|---|---|
| `It is worth noting that` | Classic AI filler opener |
| `It is important to note that` | Same pattern |
| `It is essential to understand that` | Same pattern |
| `In conclusion` | Overly formal, AI loves wrapping up this way |
| `To summarize` | Same as above |
| `In summary` | Same |
| `At its core` | "At its core, X is..." — very common AI construction |
| `At the end of the day` | Appears in more conversational AI output |
| `In the realm of` | Pretentious framing AI uses frequently |
| `In the context of` | Extremely common |
| `It goes without saying` | Filler phrase |
| `Needless to say` | Same |
| `This is not to say` | AI hedging |
| `That being said` | Transition phrase AI overuses |
| `With that in mind` | Same |
| `On the other hand` | AI loves presenting "both sides" |
| `By the same token` | Linking phrase |
| `In light of this` | Transition AI uses constantly |
| `As previously mentioned` | AI referencing itself |
| `As noted above` | Same |
| `As such` | Connector phrase |
| `In order to` | AI almost never writes just "to" |
| `Due to the fact that` | AI almost never writes "because" |
| `With respect to` | Formal filler |
| `In terms of` | Very frequent in AI output |
| `A wide range of` | "A wide range of factors..." |
| `A variety of` | Same category |
| `In a variety of ways` | Same |
| `Moving forward` | Business AI language |
| `Going forward` | Same |
| `It is clear that` | AI asserting something |
| `One must consider` | Academic AI tone |
| `It can be argued` | Hedging phrase |
| `It could be said` | Same |
| `Some may argue` | Presenting fake "both sides" |
| `Others may contend` | Same |
| `There is no doubt that` | Ironic — AI uses this while hedging everything else |

---

## 2. Structural Tells

### Macro structure
- Strict **intro → body → conclusion** format, even in short texts
- The conclusion **restates the introduction** almost word for word
- **Every question implied by the prompt is answered** — nothing is left open or unaddressed
- Content is divided into **neat, equal-length subsections**
- Topics are covered in a **logical textbook order**, not the organic order a human might use

### Paragraph patterns
- Each paragraph starts with a **topic sentence**, develops it, and ends with a **summary sentence**
- Paragraphs are all roughly the **same length**
- No paragraph ends abruptly or trails off
- No paragraph goes on a tangent

### Bullet and list overuse
- Bullets used even when **prose would be more natural**
- Three-item lists appearing constantly (AI likes triads)
- Numbered lists used for things that do not require ordering
- Each bullet point is approximately the **same length**

---

## 3. Hedging & Qualifier Patterns

AI avoids commitment. These phrases signal over-hedging:

```
often...
typically...
generally...
in many cases...
it depends on...
this may vary...
under certain circumstances...
in some contexts...
it is possible that...
one could argue...
it could be suggested...
this remains to be seen...
there is still debate around...
results may differ...
it is not always the case that...
```

**Pattern to look for:** A text that takes a clear position, then immediately hedges it, then presents "the other side," then hedges again — without ever landing on an actual view.

---

## 4. Transition Phrase Overload

AI uses linking phrases constantly to make text feel cohesive. High density = AI signal.

```
Furthermore...
Moreover...
In addition...
Additionally...
However...
Nevertheless...
Nonetheless...
On the contrary...
Conversely...
Subsequently...
Consequently...
As a result...
Therefore...
Thus...
Hence...
In contrast...
By comparison...
Similarly...
Likewise...
For instance...
For example...
To illustrate...
In particular...
Specifically...
Notably...
Importantly...
Interestingly...
Surprisingly...
Ultimately...
Finally...
In essence...
```

**Rule of thumb:** If more than 40% of paragraphs begin with one of these words, it's a strong AI signal.

---

## 5. Statistical & Linguistic Signals

### Perplexity
- AI text is **predictable** — each word is likely given the previous ones
- Low perplexity = AI, high perplexity = human
- Detectors can score this by running the text through a language model and measuring token probabilities

### Burstiness
- Humans write in bursts: short punchy sentences mixed with long complex ones
- AI maintains **consistent sentence length** throughout
- Check: take 20 sentences, measure word count. If the standard deviation is low (< 5–6 words), that is a flag

### Vocabulary entropy
- Humans repeat certain favourite words and use unusual ones in unpredictable places
- AI distributes vocabulary more **evenly and predictably**
- Very few "weird" word choices; very few slang terms or domain-specific jargon used unexpectedly

### Type-Token Ratio (TTR)
- Ratio of unique words to total words
- AI tends to use a **broader but shallower** vocabulary — higher TTR but less depth
- Humans reuse terms in their domain more naturally

---

## 6. Absence Signals

Things that are **not present** in AI text — and their absence is itself a detection signal:

| Missing element | What it means |
|---|---|
| No first-person voice | AI defaults to third-person neutral |
| No personal anecdotes | AI has no personal experience |
| No opinions stated directly | AI avoids taking sides |
| No incomplete thoughts | Humans trail off; AI does not |
| No tangents | Humans go off-topic; AI stays on task |
| No contradictions | AI is internally consistent |
| No emotional register | No frustration, excitement, surprise, or doubt |
| No typos or self-corrections | Too clean |
| No informal abbreviations | AI writes "do not" not "don't" (unless prompted) |
| No humour | AI humour is deliberate and labeled, not natural |
| No references to uncertainty about the reader | Humans adjust for who they're talking to |
| No "as I mentioned" referring to something actually said | AI's self-references are generic |

---

## 7. Domain-Specific Red Flags

### Academic writing
- Every claim is supported — no unsupported assertion is left standing
- References are mentioned but often **vague** ("studies have shown", "researchers suggest")
- No strong thesis — just a tour of perspectives
- Conclusion calls for "further research"

### News / analysis writing
- Balanced to the point of **saying nothing**
- Every statistic is rounded and approximate
- No named sources; or sources are well-known institutions only
- No "colour" — no scene-setting, no quotes, no human detail

### Technical writing
- Over-explains basics
- Uses formal names for everything even when informal names are standard
- Structures content as if writing documentation, even when that was not asked for

### Creative writing
- Descriptions are **generic and visual** ("the golden sunset", "her piercing eyes")
- Emotions are **stated**, not shown ("he felt sad")
- Dialogue is too clean — no interruptions, no filler words, no realistic speech patterns
- Plot resolves too neatly

---

## 8. Paraphrasing Attack Signals

When AI output has been run through a paraphraser to defeat detectors:

- **Unusual synonym choices** — words that fit the context but feel slightly off
- **Inconsistent register** — formal in one sentence, casual in the next
- **Broken coherence** — sentences that individually make sense but don't flow
- **Correct grammar but awkward phrasing** — technically right but unnatural
- **Rare words used incorrectly** — paraphrasers sometimes swap in wrong synonyms

---

## 9. Hybrid Text Signals

When a human edits AI output (or vice versa):

- Sudden shift in **sentence rhythm** mid-document
- One section with personal anecdotes surrounded by generic sections
- **Register inconsistency** — professional tone suddenly becoming casual
- One paragraph with a clear opinion embedded in otherwise neutral text
- A typo or informal phrase in an otherwise too-clean document

---

## 10. Quick Detection Checklist

Run this against any suspicious text:

```
[ ] Contains 3+ AI signature words (delve, nuanced, robust, etc.)
[ ] Contains 3+ filler opener phrases (It is worth noting, Furthermore, etc.)
[ ] Intro and conclusion say essentially the same thing
[ ] No personal voice, opinion, or anecdote anywhere
[ ] Sentence lengths are suspiciously consistent
[ ] Every section wraps up with a tidy summary sentence
[ ] Hedges every strong claim immediately after making it
[ ] Uses "framework", "landscape", or "realm" more than once
[ ] Covers all angles of the topic with equal depth
[ ] No tangents, no incomplete thoughts, no contradictions
```

**Scoring:**
- 0–3 checked → Likely human
- 4–6 checked → Possibly AI-assisted
- 7–10 checked → Strong AI signal

---

*This guide covers heuristic and pattern-based detection. For production detectors, combine these signals with perplexity scoring and a trained classifier for best accuracy.*
