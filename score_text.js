const fs = require('fs');
const { detectAI } = require('./detector.js');

try {
    const text = fs.readFileSync('pdf_text.txt', 'utf8');
    const result = detectAI(text);
    console.log("----- AI DETECTION REPORT -----");
    console.log(`AI Probability Score: ${result.score}%`);
    console.log("Metrics:");
    console.log(`  - Burstiness (Variance of sentence length): ${result.burstiness}`);
    console.log(`  - Vocabulary Diversity (MATTR): ${result.vocabDiversity}`);
    console.log(`  - Cliche Count: ${result.clicheCount}`);
    console.log(`  - Hedging Count: ${result.hedgingCount}`);
    console.log(`  - Has Watermarks: ${result.hasWatermarks}`);
    console.log(`  - Transition Flag Count: ${result.transitionFlagCount}`);
    console.log("Checklist Hits:");
    result.checklistDetails.forEach(item => {
        console.log(`  - ${item}`);
    });
    console.log("-------------------------------");
} catch(err) {
    console.log("Error processing text:", err);
}
