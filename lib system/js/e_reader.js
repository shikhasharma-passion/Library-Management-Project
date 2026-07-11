
document.addEventListener("DOMContentLoaded", () => {
    initReader();
});

let currentBook = null;
let currentChapterIndex = 0;
let userRating = 0;
let isFullBookMode = false;

async function initReader() {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");

    if (!bookId) {
        alert("E-Book ID missing from URL. Returning to directory.");
        window.location.href = "digital_library.html";
        return;
    }

    // Load custom configurations (Night mode, Font sizing)
    loadReaderPreferences();

    // Fetch E-Book Content
    await fetchBookContent(bookId);

    // Event Handlers for Buttons
    setupReaderControls(bookId);

    // Auto-trigger download check if requested
    if (params.get("download") === "true") {
        setTimeout(() => {
            generateBookPDF();
        }, 800);
    }
}

async function fetchBookContent(bookId) {
    try {
        const response = await fetch(`/api/digital-books/${bookId}`);
        if (!response.ok) {
            throw new Error("Could not find book record");
        }

        currentBook = await response.json();
        
        // Render details on sidebar
        document.getElementById("sidebarBookTitle").innerText = currentBook.name;
        document.getElementById("sidebarBookAuthor").innerText = `By ${currentBook.author}`;
        
        // Render Table of Contents
        renderTOC();

        // Check if there is a saved chapter index in bookmarks or history
        const user = localStorage.getItem("user") || "Guest";
        const historyKey = `digitalReadings_${user}`;
        let history = [];
        try {
            history = JSON.parse(localStorage.getItem(historyKey)) || [];
        } catch(e) {}

        const matched = history.find(item => item.id === bookId);
        if (matched && matched.lastReadChapterIndex !== undefined) {
            currentChapterIndex = Number(matched.lastReadChapterIndex);
        } else {
            currentChapterIndex = 0;
        }

        loadChapter(currentChapterIndex);
    } catch (error) {
        console.error("Error loading e-book:", error);
        document.getElementById("bookContentWrapper").innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h3>Book Load Failed</h3>
                <p>Unable to fetch chapters from server. Please confirm backend server is running.</p>
                <br>
                <a href="digital_library.html" class="e-read-btn" style="display:inline-block;">Back to Library</a>
            </div>
        `;
    }
}

function renderTOC() {
    const list = document.getElementById("tocList");
    if (!list || !currentBook || !currentBook.chapters) return;

    list.innerHTML = "";
    currentBook.chapters.forEach((chap, index) => {
        list.innerHTML += `
            <li class="toc-item">
                <a href="#" class="toc-link" data-index="${index}" onclick="jumpToChapter(${index}); return false;">
                    ${chap.title}
                </a>
            </li>
        `;
    });

    // Append virtual final book quiz
    list.innerHTML += `
        <li class="toc-item" style="margin-top: 15px; border-top: 1px dashed rgba(255,255,255,0.15); padding-top: 10px;">
            <a href="#" class="toc-link" data-index="${currentBook.chapters.length}" onclick="jumpToChapter(${currentBook.chapters.length}); return false;" style="color: var(--reader-accent) !important; font-weight:700;">
                📝 Final Book Quiz
            </a>
        </li>
    `;
}

let finalQuizQuestions = [];
let finalQuizSelections = {};

function selectFinalOption(qIndex, oIndex) {
    finalQuizSelections[qIndex] = oIndex;
}
window.selectFinalOption = selectFinalOption;

function evaluateFinalQuiz() {
    for (let i = 0; i < finalQuizQuestions.length; i++) {
        if (finalQuizSelections[i] === undefined) {
            alert(`Please select an answer for Question ${i + 1}`);
            return;
        }
    }

    let score = 0;
    finalQuizQuestions.forEach((q, qIndex) => {
        const selected = finalQuizSelections[qIndex];
        const correct = q.answerIndex;
        
        const card = document.getElementById(`finalQCard_${qIndex}`);
        if (card) {
            const labels = card.querySelectorAll("label");
            labels.forEach((label, lIdx) => {
                const radio = label.querySelector("input");
                if (radio) radio.disabled = true;
                label.style.cursor = "default";
                
                if (lIdx === correct) {
                    label.style.borderColor = "#10b981";
                    label.style.background = "rgba(16,185,129,0.12)";
                    label.style.color = "#10b981";
                    label.style.fontWeight = "700";
                } else if (lIdx === selected) {
                    label.style.borderColor = "#ef4444";
                    label.style.background = "rgba(239,68,68,0.12)";
                    label.style.color = "#ef4444";
                } else {
                    label.style.opacity = "0.5";
                }
            });
        }

        if (selected === correct) {
            score++;
        }
    });

    const scoreArea = document.getElementById("finalQuizScoreArea");
    const scoreLabel = document.getElementById("finalScoreLabel");
    const feedbackLabel = document.getElementById("finalFeedbackLabel");
    const submitBtn = document.getElementById("submitFinalQuizBtn");

    if (scoreLabel) scoreLabel.innerText = `Score: ${score} / ${finalQuizQuestions.length} (${Math.round((score/finalQuizQuestions.length)*100)}%)`;
    if (feedbackLabel) {
        const pct = (score / finalQuizQuestions.length) * 100;
        if (pct >= 80) {
            feedbackLabel.innerText = "🏆 Outstanding! You have mastered this book!";
        } else if (pct >= 50) {
            feedbackLabel.innerText = "👍 Well Done! You have successfully passed the assessment.";
        } else {
            feedbackLabel.innerText = "📚 Keep Reading! We recommend reviewing the book content and trying again.";
        }
    }
    if (scoreArea) scoreArea.style.display = "block";
    if (submitBtn) submitBtn.style.display = "none";

    document.getElementById("readingArea").scrollTop = document.getElementById("readingArea").scrollHeight;
}
window.evaluateFinalQuiz = evaluateFinalQuiz;

function generateFinalQuizHtml() {
    finalQuizQuestions = [];
    finalQuizSelections = {};

    // Collect 15 questions from the book chapters
    currentBook.chapters.forEach((chap, idx) => {
        if (chap.quiz && chap.quiz.length > 0 && finalQuizQuestions.length < 15) {
            finalQuizQuestions.push({ ...chap.quiz[0], chapterIndex: idx });
        }
    });

    if (finalQuizQuestions.length === 0) {
        return `
            <div style="text-align:center; padding:40px;">
                <h3>No Quiz Questions Available</h3>
                <p>This book does not have assessment questions configured.</p>
            </div>
        `;
    }

    let questionsHtml = "";
    finalQuizQuestions.forEach((q, qIndex) => {
        let optionsHtml = q.options.map((opt, oIndex) => `
            <label style="display:flex; align-items:center; gap:10px; border:1px solid var(--reader-border); border-radius:8px; padding:12px; margin-bottom:8px; cursor:pointer; background:rgba(0,0,0,0.02); transition:all 0.2s; font-size:14px; font-weight:500; font-family:'Poppins', sans-serif; color: var(--reader-text);">
                <input type="radio" name="finalQ_${qIndex}" value="${oIndex}" onclick="selectFinalOption(${qIndex}, ${oIndex})" style="cursor:pointer;">
                <span>${opt}</span>
            </label>
        `).join("");

        questionsHtml += `
            <div class="quiz-question-card" id="finalQCard_${qIndex}" style="border-bottom: 1px dashed var(--reader-border); padding-bottom: 25px; margin-bottom: 25px;">
                <p style="font-weight:700; font-size:16px; margin-bottom:12px; color:var(--reader-text); line-height:1.4; font-family:'Poppins', sans-serif;">
                    Q${qIndex + 1}: ${q.question}
                </p>
                <div style="display:flex; flex-direction:column; gap:6px;">
                    ${optionsHtml}
                </div>
            </div>
        `;
    });

    return `
        <div style="font-family:'Poppins', sans-serif; padding: 10px 0;">
            <div style="text-align:center; margin-bottom:40px; border-bottom:2px solid var(--reader-accent); padding-bottom:20px;">
                <span style="font-size:48px;">📝</span>
                <h2 style="font-size:28px; font-weight:800; color:var(--reader-accent); margin:10px 0 5px 0;">Final Book Quiz</h2>
                <p style="font-size:15px; opacity:0.8; color: var(--reader-text);">Answer the following 15 questions to evaluate your understanding of this book.</p>
            </div>
            
            <div id="finalQuizListContainer">
                ${questionsHtml}
            </div>

            <div id="finalQuizScoreArea" style="display:none; margin:30px 0; padding:25px; border-radius:12px; background:rgba(16,185,129,0.1); border:2px solid #10b981; text-align:center;">
                <h3 style="color:#10b981; font-size:22px; margin-bottom:10px; font-weight:800;">Assessment Completed!</h3>
                <p style="font-weight:800; font-size:20px; color:var(--reader-text);" id="finalScoreLabel">Score: 0 / 15</p>
                <p style="font-size:14px; opacity:0.8; margin-top:5px; color: var(--reader-text);" id="finalFeedbackLabel">Great effort! Continue learning.</p>
            </div>

            <button id="submitFinalQuizBtn" onclick="evaluateFinalQuiz()" style="width:100%; padding:16px; border-radius:10px; background:var(--reader-accent); color:#0f172a; border:none; font-weight:800; font-size:16px; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 12px rgba(217,119,6,0.2);">
                Submit Assessment
            </button>
        </div>
    `;
}

function loadChapter(index) {
    if (!currentBook || !currentBook.chapters) return;
    const totalChapters = currentBook.chapters.length;
    if (index < 0 || index > totalChapters) return;

    currentChapterIndex = index;
    const pad = document.getElementById("bookContentWrapper");
    const readingPad = document.getElementById("readingPad");
    const prevBtn = document.getElementById("prevChapterBtn");
    const nextBtn = document.getElementById("nextChapterBtn");

    if (index === totalChapters) {
        // Render Final Quiz
        document.getElementById("activeChapterTitle").innerText = "Final Book Quiz";
        pad.innerHTML = generateFinalQuizHtml();

        // Highlight TOC item
        const links = document.querySelectorAll("#tocList .toc-link");
        links.forEach((link, lIndex) => {
            if (lIndex === index) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });

        // Set Prev/Next buttons
        prevBtn.classList.remove("disabled");
        nextBtn.classList.add("disabled");

        document.getElementById("readingArea").scrollTop = 0;
        updateReadingHistory(index, "Final Book Quiz");
        return;
    }

    const chapter = currentBook.chapters[index];

    // Update active chapter Title in topbar
    document.getElementById("activeChapterTitle").innerText = chapter.title;

    // Load content to Reading Pad
    pad.innerHTML = chapter.content;

    // Scroll reading area to top
    document.getElementById("readingArea").scrollTop = 0;

    // Highlight TOC item
    const links = document.querySelectorAll("#tocList .toc-link");
    links.forEach((link, lIndex) => {
        if (lIndex === index) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // Update Prev / Next Buttons state
    if (index === 0) {
        prevBtn.classList.add("disabled");
    } else {
        prevBtn.classList.remove("disabled");
    }

    // Since index totalChapters is the quiz, next is active on chapter index totalChapters - 1
    nextBtn.classList.remove("disabled");

    // Refresh Bookmark Button style for this chapter
    checkBookmarkState();

    // Trigger MathJax typesetting for equations
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise();
    }

    // Save active reading chapter to localStorage history list
    updateReadingHistory(index, chapter.title);
}

function jumpToChapter(index) {
    loadChapter(index);
}

function setupReaderControls(bookId) {
    const prevBtn = document.getElementById("prevChapterBtn");
    const nextBtn = document.getElementById("nextChapterBtn");
    const fontInc = document.getElementById("fontIncBtn");
    const fontDec = document.getElementById("fontDecBtn");
    const nightToggle = document.getElementById("nightModeToggle");
    const bookmarkBtn = document.getElementById("bookmarkBtn");

    // Prev / Next Chapter Click handlers
    prevBtn.addEventListener("click", () => {
        if (currentChapterIndex > 0) {
            loadChapter(currentChapterIndex - 1);
        }
    });

    nextBtn.addEventListener("click", () => {
        if (currentBook && currentChapterIndex < currentBook.chapters.length - 1) {
            loadChapter(currentChapterIndex + 1);
        }
    });

    // Font Sizing
    fontInc.addEventListener("click", () => {
        changeFontSize(1);
    });
    fontDec.addEventListener("click", () => {
        changeFontSize(-1);
    });

    // Night Mode Toggle
    nightToggle.addEventListener("click", () => {
        const isNight = document.body.classList.toggle("night-mode-active");
        localStorage.setItem("readerNightMode", isNight ? "dark" : "light");
        nightToggle.innerText = isNight ? "☀️" : "🌙";
    });

    // Bookmark Click
    bookmarkBtn.addEventListener("click", () => {
        toggleBookmark(bookId);
    });

    // Full Book Mode Toggle Click
    const fullBookToggleBtn = document.getElementById("fullBookViewToggle");
    if (fullBookToggleBtn) {
        fullBookToggleBtn.addEventListener("click", () => {
            toggleFullBookMode();
        });
    }

    // Download Book Content Click
    const downloadBtn = document.getElementById("downloadBookBtn");
    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
            if (!currentBook || !currentBook.chapters) {
                alert("Book content is not fully loaded yet.");
                return;
            }
            generateBookPDF();
        });
    }

    // Share Reader Link Click
    const shareBtn = document.getElementById("shareBookBtn");
    if (shareBtn) {
        shareBtn.addEventListener("click", () => {
            if (!currentBook) return;
            
            // Build absolute sharing URL
            const shareUrl = window.location.protocol + "//" + window.location.host + "/e_reader.html?id=" + (currentBook._id || currentBook.id);
            
            // Copy to clipboard
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert("🔗 E-Book direct reader link copied to clipboard! Share it with your friends.");
            }).catch(err => {
                console.error("Clipboard write failed", err);
                alert(`Direct link: ${shareUrl}`);
            });
        });
    }

    // Initialize Quiz Trigger Events
    initQuizSystem();
}

function changeFontSize(direction) {
    const root = document.documentElement;
    let size = Number(getComputedStyle(root).getPropertyValue('--reader-font-size').replace('px', ''));
    
    size += direction;
    if (size < 14) size = 14;
    if (size > 26) size = 26;

    root.style.setProperty('--reader-font-size', `${size}px`);
    localStorage.setItem("readerFontSize", size);
}

function loadReaderPreferences() {
    const isNight = localStorage.getItem("readerNightMode");
    const nightToggle = document.getElementById("nightModeToggle");
    const root = document.documentElement;

    if (isNight === "dark") {
        document.body.classList.add("night-mode-active");
        if (nightToggle) nightToggle.innerText = "☀️";
    } else {
        document.body.classList.remove("night-mode-active");
        if (nightToggle) nightToggle.innerText = "🌙";
    }

    const savedSize = localStorage.getItem("readerFontSize");
    if (savedSize) {
        root.style.setProperty('--reader-font-size', `${savedSize}px`);
    }
}

function updateReadingHistory(chapterIndex, chapterTitle) {
    if (!currentBook) return;
    const user = localStorage.getItem("user") || "Guest";
    const historyKey = `digitalReadings_${user}`;
    let history = [];

    try {
        history = JSON.parse(localStorage.getItem(historyKey)) || [];
    } catch(e) {}

    const bookId = currentBook._id || currentBook.id;
    history = history.filter(item => item.id !== bookId);

    history.unshift({
        id: bookId,
        name: currentBook.name,
        author: currentBook.author,
        image: currentBook.image,
        category: currentBook.category,
        stream: currentBook.stream,
        lastReadChapterIndex: chapterIndex,
        lastReadChapterTitle: chapterTitle,
        readDate: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    });

    if (history.length > 6) {
        history.pop();
    }

    localStorage.setItem(historyKey, JSON.stringify(history));
}

function toggleBookmark(bookId) {
    const user = localStorage.getItem("user") || "Guest";
    const bookmarkKey = `readerBookmarks_${user}`;
    let bookmarks = {};

    try {
        bookmarks = JSON.parse(localStorage.getItem(bookmarkKey)) || {};
    } catch(e) {}

    if (bookmarks[bookId] === currentChapterIndex) {
        // Remove bookmark
        delete bookmarks[bookId];
        alert("Bookmark removed for this chapter.");
    } else {
        // Save bookmark
        bookmarks[bookId] = currentChapterIndex;
        alert(`Bookmarked: ${currentBook.chapters[currentChapterIndex].title}`);
    }

    localStorage.setItem(bookmarkKey, JSON.stringify(bookmarks));
    checkBookmarkState();
}

function checkBookmarkState() {
    if (!currentBook) return;
    const bookId = currentBook._id || currentBook.id;
    const user = localStorage.getItem("user") || "Guest";
    const bookmarkKey = `readerBookmarks_${user}`;
    let bookmarks = {};

    try {
        bookmarks = JSON.parse(localStorage.getItem(bookmarkKey)) || {};
    } catch(e) {}

    const bookmarkBtn = document.getElementById("bookmarkBtn");
    if (!bookmarkBtn) return;

    if (bookmarks[bookId] === currentChapterIndex) {
        bookmarkBtn.classList.add("active");
        bookmarkBtn.style.color = "var(--reader-accent)";
        bookmarkBtn.style.borderColor = "var(--reader-accent)";
    } else {
        bookmarkBtn.classList.remove("active");
        bookmarkBtn.style.color = "";
        bookmarkBtn.style.borderColor = "";
    }
}

let activeQuizSelections = {};

function initQuizSystem() {
    const sidebarQuiz = document.getElementById("sidebarQuizBtn");
    const topbarQuiz = document.getElementById("takeQuizBtn");
    const closeBtn = document.getElementById("closeQuizBtn");
    const submitBtn = document.getElementById("submitQuizBtn");

    if (sidebarQuiz) sidebarQuiz.onclick = openQuizModal;
    if (topbarQuiz) topbarQuiz.onclick = openQuizModal;
    if (closeBtn) {
        closeBtn.onclick = () => {
            document.getElementById("quizModal").style.display = "none";
        };
    }
    if (submitBtn) submitBtn.onclick = evaluateQuiz;
}

function openQuizModal() {
    if (!currentBook || !currentBook.chapters) return;
    const chapter = currentBook.chapters[currentChapterIndex];
    if (!chapter.quiz || chapter.quiz.length === 0) return;

    activeQuizSelections = {};
    const container = document.getElementById("quizQuestionsContainer");
    const resultArea = document.getElementById("quizResultArea");
    const submitBtn = document.getElementById("submitQuizBtn");

    if (resultArea) resultArea.style.display = "none";
    if (submitBtn) {
        submitBtn.style.display = "block";
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Answers";
    }

    container.innerHTML = "";

    chapter.quiz.forEach((q, qIndex) => {
        let optionsHtml = q.options.map((opt, oIndex) => `
            <div class="quiz-option" data-q="${qIndex}" data-o="${oIndex}" style="border: 1px solid var(--reader-border); border-radius: 8px; padding: 12px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; background: rgba(0,0,0,0.02); font-size:14px; font-weight:500;">
                ${opt}
            </div>
        `).join("");

        container.innerHTML += `
            <div class="quiz-question-card" data-qindex="${qIndex}" style="border-bottom:1px dashed var(--reader-border); padding-bottom:15px;">
                <p style="font-weight:700; font-size:15px; margin-bottom:12px; color:var(--reader-text); line-height:1.4;">Q${qIndex + 1}: ${q.question}</p>
                <div class="options-container" style="display:flex; flex-direction:column; gap:6px;">
                    ${optionsHtml}
                </div>
            </div>
        `;
    });

    // Add option click selectors
    setTimeout(() => {
        const optionBlocks = container.querySelectorAll(".quiz-option");
        optionBlocks.forEach(opt => {
            opt.onclick = () => {
                const qIdx = opt.getAttribute("data-q");
                const oIdx = Number(opt.getAttribute("data-o"));

                // Clear other selections in this question
                const siblingOptions = container.querySelectorAll(`.quiz-option[data-q="${qIdx}"]`);
                siblingOptions.forEach(sib => {
                    sib.style.borderColor = "var(--reader-border)";
                    sib.style.background = "rgba(0,0,0,0.02)";
                    sib.style.color = "var(--reader-text)";
                });

                // Highlight selected
                opt.style.borderColor = "var(--reader-accent)";
                opt.style.background = "rgba(251,191,36,0.08)";
                opt.style.color = "var(--reader-accent)";

                // Record selection
                activeQuizSelections[qIdx] = oIdx;
            };
        });
    }, 100);

    document.getElementById("quizModal").style.display = "flex";
}

function evaluateQuiz() {
    if (!currentBook || !currentBook.chapters) return;
    const chapter = currentBook.chapters[currentChapterIndex];
    const quizList = chapter.quiz;

    // Check if all answered
    for (let i = 0; i < quizList.length; i++) {
        if (activeQuizSelections[i] === undefined) {
            alert(`Please select an answer for Question ${i + 1}`);
            return;
        }
    }

    let score = 0;
    const container = document.getElementById("quizQuestionsContainer");

    quizList.forEach((q, qIndex) => {
        const selectedOptionIndex = activeQuizSelections[qIndex];
        const correctIndex = q.answerIndex;

        const options = container.querySelectorAll(`.quiz-option[data-q="${qIndex}"]`);
        
        options.forEach(opt => {
            const oIdx = Number(opt.getAttribute("data-o"));
            opt.onclick = null; // Disable further clicking after submit
            opt.style.cursor = "default";

            if (oIdx === correctIndex) {
                // Correct answer is green
                opt.style.borderColor = "#10b981";
                opt.style.background = "rgba(16,185,129,0.12)";
                opt.style.color = "#10b981";
                opt.style.fontWeight = "700";
            } else if (oIdx === selectedOptionIndex) {
                // Wrong selected answer is red
                opt.style.borderColor = "#ef4444";
                opt.style.background = "rgba(239,68,68,0.12)";
                opt.style.color = "#ef4444";
            } else {
                opt.style.borderColor = "var(--reader-border)";
                opt.style.background = "rgba(0,0,0,0.02)";
                opt.style.color = "var(--reader-text)";
                opt.style.opacity = "0.5";
            }
        });

        if (selectedOptionIndex === correctIndex) {
            score++;
        }
    });

    // Show result
    const resultArea = document.getElementById("quizResultArea");
    const scoreText = document.getElementById("quizScoreText");
    const submitBtn = document.getElementById("submitQuizBtn");

    if (scoreText) scoreText.innerText = `Score: ${score} / ${quizList.length} (${Math.round((score/quizList.length)*100)}%)`;
    if (resultArea) resultArea.style.display = "block";
    if (submitBtn) submitBtn.style.display = "none";
}

function triggerReaderPurchase() {
    const user = localStorage.getItem("user");
    if (!user) {
        alert("Please log in first to purchase and download PDF editions!");
        window.location.href = "login.html";
        return;
    }

    // Reset checkout states
    document.getElementById("readerCardForm").style.display = "flex";
    document.getElementById("readerUpiView").style.display = "none";
    document.getElementById("readerPayLoader").style.display = "none";
    document.getElementById("readerSuccessReceipt").style.display = "none";
    document.querySelector("input[name='readerPayMethod'][value='card']").checked = true;

    document.getElementById("readerCheckoutModal").style.display = "flex";
}

function closeReaderCheckout() {
    document.getElementById("readerCheckoutModal").style.display = "none";
}

function toggleReaderPayView(method) {
    if (method === "card") {
        document.getElementById("readerCardForm").style.display = "flex";
        document.getElementById("readerUpiView").style.display = "none";
    } else {
        document.getElementById("readerCardForm").style.display = "none";
        document.getElementById("readerUpiView").style.display = "flex";
    }
}

function processReaderPayment(e) {
    e.preventDefault();
    document.getElementById("readerCardForm").style.display = "none";
    document.getElementById("readerPayLoader").style.display = "block";

    setTimeout(() => {
        const user = localStorage.getItem("user") || "Guest";
        const bookId = currentBook._id || currentBook.id;
        const purchasedKey = `purchasedBookDownloads_${user}_${bookId}`;
        localStorage.setItem(purchasedKey, "true");

        document.getElementById("readerPayLoader").style.display = "none";
        document.getElementById("readerSuccessReceipt").style.display = "block";
    }, 2500);
}

function processReaderPaymentDirect() {
    document.getElementById("readerUpiView").style.display = "none";
    document.getElementById("readerPayLoader").style.display = "block";

    setTimeout(() => {
        const user = localStorage.getItem("user") || "Guest";
        const bookId = currentBook._id || currentBook.id;
        const purchasedKey = `purchasedBookDownloads_${user}_${bookId}`;
        localStorage.setItem(purchasedKey, "true");

        document.getElementById("readerPayLoader").style.display = "none";
        document.getElementById("readerSuccessReceipt").style.display = "block";
    }, 2000);
}

function generateBookPDF() {
    if (!currentBook || !currentBook.chapters) return;
    
    // Open print preview window
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
        alert("Please allow pop-ups to generate and download the book PDF.");
        return;
    }
    
    let chaptersHtml = "";
    currentBook.chapters.forEach((chap, idx) => {
        chaptersHtml += `
            <div style="page-break-after: always; padding: 40px; font-family: 'Poppins', sans-serif;">
                <h2 style="font-size: 24px; color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;">
                    ${chap.title}
                </h2>
                <div style="font-size: 15px; color: #334155; line-height: 1.8;">
                    ${chap.content}
                </div>
            </div>
        `;
    });

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${currentBook.name} - Full PDF Edition</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background: #ffffff;
                }
                @media print {
                    body {
                        background: none;
                    }
                }
            </style>
        </head>
        <body>
            <!-- COVER PAGE -->
            <div style="height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; page-break-after: always; font-family: 'Poppins', sans-serif; padding: 40px; box-sizing: border-box; border: 15px double #3b82f6;">
                <span style="font-size: 54px; margin-bottom: 30px;">📖</span>
                <h1 style="font-size: 38px; color: #0f172a; margin-bottom: 10px; font-weight: 800;">${currentBook.name}</h1>
                <p style="font-size: 18px; color: #475569; margin-bottom: 40px; font-weight: 500;">By ${currentBook.author}</p>
                <div style="margin-top: auto; font-size: 13px; color: #94a3b8;">
                    <p>ZHI Library System - Premium Digital Edition</p>
                    <p>© ${new Date().getFullYear()} LibraryMS. All rights reserved.</p>
                </div>
            </div>
            
            <!-- CONTENTS -->
            ${chaptersHtml}
            
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(() => {
                        window.close();
                    }, 500);
                };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

function toggleFullBookMode() {
    isFullBookMode = !isFullBookMode;
    const btn = document.getElementById("fullBookViewToggle");
    const pad = document.getElementById("bookContentWrapper");
    const prevBtn = document.getElementById("prevChapterBtn");
    const nextBtn = document.getElementById("nextChapterBtn");
    const activeChapterTitle = document.getElementById("activeChapterTitle");

    if (!currentBook || !pad) return;

    if (isFullBookMode) {
        if (btn) {
            btn.innerText = "📖 Chapter Mode";
            btn.style.background = "rgba(59,130,246,0.15)";
            btn.style.borderColor = "var(--reader-accent)";
            btn.style.color = "var(--reader-accent)";
        }
        
        if (activeChapterTitle) {
            activeChapterTitle.innerText = "Complete Textbook View";
        }

        // Hide navigation buttons
        if (prevBtn) prevBtn.style.display = "none";
        if (nextBtn) nextBtn.style.display = "none";

        // Compile all chapters
        let fullContentHtml = `
            <div style="text-align:center; padding:30px 0 50px 0; border-bottom:2px dashed var(--reader-border); margin-bottom:40px; font-family:'Poppins', sans-serif;">
                <span style="font-size:48px;">📚</span>
                <h1 style="font-size:32px; font-weight:800; margin:15px 0 5px 0;">${currentBook.name}</h1>
                <p style="font-size:16px; opacity:0.8;">By ${currentBook.author}</p>
            </div>
        `;

        currentBook.chapters.forEach((chap, index) => {
            fullContentHtml += `
                <div id="full-chap-${index}" style="margin-bottom:60px; padding-bottom:40px; border-bottom:1px solid var(--reader-border);">
                    <h2 style="font-size:22px; font-weight:800; color:var(--reader-accent); border-bottom:1px solid var(--reader-border); padding-bottom:10px; margin-bottom:20px;">
                        ${chap.title}
                    </h2>
                    <div style="font-size:16px; line-height:1.8;">
                        ${chap.content}
                    </div>
                </div>
            `;
        });

        pad.innerHTML = fullContentHtml;

        // Highlight all links in TOC
        const links = document.querySelectorAll("#tocList .toc-link");
        links.forEach(link => link.classList.add("active"));
    } else {
        if (btn) {
            btn.innerText = "📜 Full Book Mode";
            btn.style.background = "rgba(16,185,129,0.15)";
            btn.style.borderColor = "#10b981";
            btn.style.color = "#10b981";
        }

        // Restore navigation buttons
        if (prevBtn) prevBtn.style.display = "flex";
        if (nextBtn) nextBtn.style.display = "flex";

        // Restore chapter view
        loadChapter(currentChapterIndex);
    }
}
