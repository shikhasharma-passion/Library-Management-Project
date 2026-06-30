// Intercept and route fetch requests on local files to localhost:3000
const ORIGINAL_FETCH = window.fetch;
window.fetch = function(url, options) {
    const API_BASE_URL = window.location.protocol === "file:" ? "http://localhost:3000" : "";
    if (typeof url === "string" && url.startsWith("/api")) {
        url = API_BASE_URL + url;
    }
    return ORIGINAL_FETCH(url, options);
};

document.addEventListener("DOMContentLoaded", () => {
    initReader();
});

let currentBook = null;
let currentChapterIndex = 0;
let userRating = 0;

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
        
        // Configure Open Full Version buttons
        const sidebarFullBtn = document.getElementById("sidebarFullBookBtn");
        const topbarFullBtn = document.getElementById("topbarFullBookBtn");
        
        if (currentBook.fullBookUrl) {
            if (sidebarFullBtn) {
                sidebarFullBtn.href = currentBook.fullBookUrl;
                sidebarFullBtn.style.display = "block";
            }
            if (topbarFullBtn) {
                topbarFullBtn.href = currentBook.fullBookUrl;
                topbarFullBtn.style.display = "flex";
            }
        }
        
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
}

function loadChapter(index) {
    if (!currentBook || !currentBook.chapters || !currentBook.chapters[index]) return;

    currentChapterIndex = index;
    const chapter = currentBook.chapters[index];

    // Update active chapter Title in topbar
    document.getElementById("activeChapterTitle").innerText = chapter.title;

    // Load content to Reading Pad
    const pad = document.getElementById("bookContentWrapper");
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
    const prevBtn = document.getElementById("prevChapterBtn");
    const nextBtn = document.getElementById("nextChapterBtn");

    if (index === 0) {
        prevBtn.classList.add("disabled");
    } else {
        prevBtn.classList.remove("disabled");
    }

    if (index === currentBook.chapters.length - 1) {
        nextBtn.classList.add("disabled");
    } else {
        nextBtn.classList.remove("disabled");
    }

    // Refresh Bookmark Button style for this chapter
    checkBookmarkState();

    // Toggle Quiz Buttons
    const sidebarQuiz = document.getElementById("sidebarQuizBtn");
    const topbarQuiz = document.getElementById("takeQuizBtn");
    const hasQuiz = chapter.quiz && chapter.quiz.length > 0;

    if (sidebarQuiz) sidebarQuiz.style.display = hasQuiz ? "block" : "none";
    if (topbarQuiz) topbarQuiz.style.display = hasQuiz ? "block" : "none";

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
