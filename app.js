// Application State and Event Handlers

document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("input-textarea");
  const charCount = document.getElementById("char-count");
  const fileDropzone = document.getElementById("file-dropzone");
  const fileInput = document.getElementById("file-input");
  
  const btnDetect = document.getElementById("btn-detect");
  const btnHumanize = document.getElementById("btn-humanize");
  
  const resultTabTitle = document.getElementById("result-tab-title");
  const aiGauge = document.getElementById("ai-gauge");
  const aiPercentage = document.getElementById("ai-percentage");
  const aiStatus = document.getElementById("ai-status");
  const outputView = document.getElementById("output-view");
  
  const statBurstiness = document.getElementById("stat-burstiness");
  const statDiversity = document.getElementById("stat-diversity");
  const statContractions = document.getElementById("stat-contractions");
  const statTransitions = document.getElementById("stat-transitions");
  const flaggedItemsList = document.getElementById("flagged-items-list");
  const checklistItemsList = document.getElementById("checklist-items-list");
  
  const btnCopy = document.getElementById("btn-copy");
  const btnDownload = document.getElementById("btn-download");
  const btnPdf = document.getElementById("btn-pdf");
  const btnWord = document.getElementById("btn-word");
  const toast = document.getElementById("toast-notif");

  const tabWorkspace = document.getElementById("tab-workspace");
  const tabAnalysis = document.getElementById("tab-analysis");
  const sectionWorkspace = document.getElementById("section-workspace");
  const sectionAnalysis = document.getElementById("section-analysis");

  let lastHumanizedText = "";
  let currentOutputMode = "clean"; // "clean", "analysis", "humanized"

  // Tab Navigation Handling
  tabWorkspace.addEventListener("click", () => {
    tabWorkspace.classList.add("active");
    tabAnalysis.classList.remove("active");
    sectionWorkspace.style.display = "grid";
    sectionAnalysis.style.display = "block"; // Changed below in css to hold block
    sectionAnalysis.style.setProperty("display", "none", "important");
  });

  tabAnalysis.addEventListener("click", () => {
    tabAnalysis.classList.add("active");
    tabWorkspace.classList.remove("active");
    sectionWorkspace.style.setProperty("display", "none", "important");
    sectionAnalysis.style.display = "block";
  });

  // Char count updater
  textarea.addEventListener("input", () => {
    charCount.textContent = `${textarea.value.length} chars`;
  });

  // Dropzone file uploader
  fileDropzone.addEventListener("click", () => fileInput.click());
  
  fileDropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    fileDropzone.style.borderColor = "var(--border-focus)";
  });

  fileDropzone.addEventListener("dragleave", () => {
    fileDropzone.style.borderColor = "var(--border-color)";
  });

  fileDropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    fileDropzone.style.borderColor = "var(--border-color)";
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  function handleFile(file) {
    const reader = new FileReader();
    const fileNameLower = file.name.toLowerCase();
    
    if (fileNameLower.endsWith(".docx")) {
      reader.onload = function(event) {
        const arrayBuffer = event.target.result;
        mammoth.extractRawText({ arrayBuffer: arrayBuffer })
          .then((result) => {
            textarea.value = result.value;
            charCount.textContent = `${textarea.value.length} chars`;
          })
          .catch((err) => {
            alert("Error parsing DOCX file: " + err.message);
          });
      };
      reader.readAsArrayBuffer(file);
    } else if (fileNameLower.endsWith(".pdf")) {
      reader.onload = function(event) {
        const typedarray = new Uint8Array(event.target.result);
        const pdfjsLib = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
        if (!pdfjsLib) {
          alert("PDF library not loaded yet. Please wait a moment or reload the page.");
          return;
        }
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
          let maxPages = pdf.numPages;
          let countPromises = [];
          for (let j = 1; j <= maxPages; j++) {
            countPromises.push(
              pdf.getPage(j).then(function(page) {
                return page.getTextContent().then(function(textContent) {
                  return textContent.items.map(function(item) {
                    return item.str;
                  }).join(' ');
                });
              })
            );
          }
          Promise.all(countPromises).then(function(texts) {
            textarea.value = texts.join('\n\n');
            charCount.textContent = `${textarea.value.length} chars`;
          });
        }).catch(function(err) {
          alert("Error parsing PDF file: " + err.message);
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = function(event) {
        textarea.value = event.target.result;
        charCount.textContent = `${textarea.value.length} chars`;
      };
      reader.readAsText(file);
    }
  }

  // AI Detection Handler
  btnDetect.addEventListener("click", () => {
    const text = textarea.value;
    if (!text.trim()) {
      alert("Please enter some text first.");
      return;
    }

    const results = window.detectAI(text);
    updateMetrics(results.score, results.hasWatermarks);
    updateStats(results.burstiness, results.vocabDiversity, results.contractionRatio, results.transitionFlagCount);
    
    resultTabTitle.textContent = "AI Indicators Highlighted";
    
    // Highlight sentences and inject unique index IDs for scroll linking
    outputView.innerHTML = results.sentences.map((s, idx) => {
      if (s.isLikelyAI) {
        const titleText = s.foundCliche ? `Indicator: ${s.foundCliche}` : "Low style variance";
        return `<span class="hl-ai" id="sentence-${idx}" title="${titleText}">${s.text}</span>`;
      }
      return s.text;
    }).join(". ") + ".";
    
    // Populate Flagged items dashboard list
    populateFlaggedList(results.sentences);
    populateChecklist(results.checklistDetails);
    
    currentOutputMode = "analysis";
  });

  // Humanizer Handler
  btnHumanize.addEventListener("click", () => {
    const text = textarea.value;
    if (!text.trim()) {
      alert("Please enter some text first.");
      return;
    }

    lastHumanizedText = window.humanizeText(text);
    
    // Auto-detect on new humanized text to show improvement
    const results = window.detectAI(lastHumanizedText);
    updateMetrics(results.score, results.hasWatermarks);
    updateStats(results.burstiness, results.vocabDiversity, results.contractionRatio, results.transitionFlagCount);
    
    resultTabTitle.textContent = "Humanized Output";
    outputView.textContent = lastHumanizedText;
    populateFlaggedList(results.sentences);
    populateChecklist(results.checklistDetails);
    currentOutputMode = "humanized";
  });

  function updateMetrics(score, hasWatermarks = false) {
    aiPercentage.textContent = `${score}%`;
    aiGauge.style.width = `${score}%`;
    
    if (hasWatermarks) {
      aiStatus.textContent = "Watermark Detected";
      aiStatus.style.color = "var(--color-danger)";
      aiGauge.style.backgroundColor = "var(--color-danger)";
    } else if (score < 30) {
      aiStatus.textContent = "Human-written";
      aiStatus.style.color = "var(--color-success)";
      aiGauge.style.backgroundColor = "var(--color-success)";
    } else if (score < 60) {
      aiStatus.textContent = "Mixed / Unsure";
      aiStatus.style.color = "var(--color-warning)";
      aiGauge.style.backgroundColor = "var(--color-warning)";
    } else {
      aiStatus.textContent = "AI-generated";
      aiStatus.style.color = "var(--color-danger)";
      aiGauge.style.backgroundColor = "var(--color-danger)";
    }
  }

  function updateStats(burstiness, diversity, contractionRatio, transitionFlagCount) {
    statBurstiness.textContent = burstiness.toFixed(1);
    statDiversity.textContent = `${Math.round(diversity * 100)}%`;
    statContractions.textContent = `${Math.round(contractionRatio * 100)}%`;
    statTransitions.textContent = transitionFlagCount;
  }

  function populateFlaggedList(sentences) {
    flaggedItemsList.innerHTML = "";
    const flagged = sentences.filter(s => s.isLikelyAI);
    
    if (flagged.length === 0) {
      flaggedItemsList.innerHTML = '<div class="no-flags-msg">No AI indicators detected. Clean score!</div>';
      return;
    }

    sentences.forEach((s, idx) => {
      if (s.isLikelyAI) {
        const flagItem = document.createElement("div");
        flagItem.className = "flag-item";
        
        const typeLabel = s.foundCliche ? `Cliché: "${s.foundCliche}"` : "Uniform sentence structure";
        
        flagItem.innerHTML = `
          <div class="flag-meta">${typeLabel}</div>
          <div class="flag-text">${s.text}</div>
        `;
        
        // Scroll & Flash highlight linking
        flagItem.addEventListener("click", () => {
          const el = document.getElementById(`sentence-${idx}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.add("hl-active-flash");
            setTimeout(() => {
              el.classList.remove("hl-active-flash");
            }, 1500);
          }
        });
        
        flaggedItemsList.appendChild(flagItem);
      }
    });
  }

  function populateChecklist(checklistDetails) {
    checklistItemsList.innerHTML = "";
    
    // The full checklist items from the guide
    const allChecklistItems = [
      { text: "Contains 3+ AI signature words", matching: "Contains 3+ AI signature words" },
      { text: "Contains 3+ filler opener phrases", matching: "Contains 3+ filler opener phrases" },
      { text: "Intro and conclusion say essentially the same thing", matching: "Intro and conclusion paragraphs have high word overlap" },
      { text: "No personal voice, opinion, or anecdote anywhere", matching: "No first-person voice or pronouns detected" },
      { text: "Sentence lengths are suspiciously consistent", matching: "Sentence lengths are highly uniform (low burstiness)" },
      { text: "Every section wraps up with a tidy summary sentence", matching: "Multiple paragraphs wrap up with summary indicators" },
      { text: "Hedges every strong claim immediately after making it", matching: "High density of hedging terms or qualifiers" },
      { text: "Uses 'framework', 'landscape', or 'realm' more than once", matching: "Uses 'framework', 'landscape', or 'realm' multiple times" },
      { text: "Covers all angles of the topic with equal depth", matching: "Paragraph lengths are extremely uniform" },
      { text: "No tangents, no incomplete thoughts, no contradictions", matching: "Flawless structural flow with no informal punctuation" }
    ];

    allChecklistItems.forEach(item => {
      const isTriggered = checklistDetails.includes(item.matching);
      const row = document.createElement("div");
      row.className = `checklist-row ${isTriggered ? 'triggered' : 'passed'}`;
      
      row.innerHTML = `
        <span class="checklist-icon">${isTriggered ? '✕' : '✓'}</span>
        <span class="checklist-text">${item.text}</span>
      `;
      
      checklistItemsList.appendChild(row);
    });
  }

  // Copy to clipboard
  btnCopy.addEventListener("click", () => {
    const textToCopy = currentOutputMode === "humanized" ? lastHumanizedText : outputView.textContent;
    if (!textToCopy || textToCopy.startsWith("Original or humanized")) {
      alert("No output available to copy.");
      return;
    }
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast("Text copied to clipboard!");
    });
  });

  // Download text file
  btnDownload.addEventListener("click", () => {
    const textToDownload = currentOutputMode === "humanized" ? lastHumanizedText : outputView.textContent;
    if (!textToDownload || textToDownload.startsWith("Original or humanized")) {
      alert("No output available to download.");
      return;
    }

    const blob = new Blob([textToDownload], { type: "text/plain;charset=utf-8" });
    saveBlob(blob, currentOutputMode === "humanized" ? "humanized_report.txt" : "analysis_results.txt");
  });

  // Export to PDF (Client-side jsPDF text writer)
  btnPdf.addEventListener("click", () => {
    const text = currentOutputMode === "humanized" ? lastHumanizedText : outputView.textContent;
    if (!text || text.startsWith("Original or humanized")) {
      alert("No output available to export.");
      return;
    }

    const jsPDFClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (!jsPDFClass) {
      alert("PDF library is loading. Please try again in a moment.");
      return;
    }

    const doc = new jsPDFClass({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxLineWidth = pageWidth - (margin * 2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    const paragraphs = text.split("\n");
    let y = margin;

    paragraphs.forEach(p => {
      if (p.trim() === "") {
        y += 6; // Spacing for blank lines
        return;
      }
      
      const lines = doc.splitTextToSize(p, maxLineWidth);
      lines.forEach(line => {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 6.5; // Line height spacing
      });
      y += 4; // Spacing between paragraphs
    });

    doc.save("humanized_report.pdf");
    showToast("PDF report generated with parseable text!");
  });

  // Export to Word DOCX (Client-side docx.js)
  btnWord.addEventListener("click", () => {
    const text = currentOutputMode === "humanized" ? lastHumanizedText : outputView.textContent;
    if (!text || text.startsWith("Original or humanized")) {
      alert("No output available to export.");
      return;
    }

    const { Document, Packer, Paragraph, TextRun } = window.docx;
    
    const docParagraphs = text.split("\n").map(line => {
      return new Paragraph({
        spacing: { after: 140 },
        children: [new TextRun({ text: line, font: "Arial", size: 22 })]
      });
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: docParagraphs
      }]
    });

    Packer.toBlob(doc).then(blob => {
      saveBlob(blob, "humanized_report.docx");
      showToast("Word document generated!");
    });
  });

  function saveBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 2000);
  }
});
