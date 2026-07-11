
document.addEventListener("DOMContentLoaded", () => {
    window.API_RESOLVED_PROMISE.then(() => {
        initDigitalLibrary();
    });
});

let digitalBooks = [];
let selectedStream = "All";

async function initDigitalLibrary() {
    const searchInput = document.getElementById("digitalSearchInput");
    const searchBtn = document.getElementById("digitalSearchBtn");
    const streamTabs = document.querySelectorAll("#streamTabs .filter-btn");

    // Fetch initial list
    await fetchDigitalBooks();

    // Event listener for Search
    const clearBtn = document.getElementById("clearDigitalSearchBtn");
    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", () => {
            fetchDigitalBooks(selectedStream, searchInput.value.trim());
        });
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                fetchDigitalBooks(selectedStream, searchInput.value.trim());
            }
        });
        searchInput.addEventListener("input", () => {
            const val = searchInput.value.trim();
            if (clearBtn) {
                clearBtn.style.display = val ? "block" : "none";
            }
            fetchDigitalBooks(selectedStream, val);
        });
    }

    window.clearDigitalSearch = function() {
        const input = document.getElementById("digitalSearchInput");
        const clearButton = document.getElementById("clearDigitalSearchBtn");
        if (input) input.value = "";
        if (clearButton) clearButton.style.display = "none";
        fetchDigitalBooks(selectedStream, "");
    };

    // Event listener for stream tabs
    streamTabs.forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Remove active class from all tabs
            streamTabs.forEach(t => t.classList.remove("active"));
            
            // Add active class to clicked tab
            btn.classList.add("active");
            
            selectedStream = btn.getAttribute("data-stream");
            const query = searchInput ? searchInput.value.trim() : "";
            fetchDigitalBooks(selectedStream, query);
        });
    });
}

async function fetchDigitalBooks(stream = "All", searchQuery = "") {
    const grid = document.getElementById("digitalBookGrid");
    if (!grid) return;

    grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
            <h3>Loading e-resources...</h3>
        </div>
    `;

    try {
        const params = new URLSearchParams();
        if (stream !== "All") {
            params.set("stream", stream);
        }
        if (searchQuery) {
            params.set("q", searchQuery);
        }

        const url = params.toString() ? `/api/digital-books?${params.toString()}` : "/api/digital-books";
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("Failed to load digital library books");
        }

        digitalBooks = await response.json();
        renderDigitalBooks(digitalBooks);
    } catch (error) {
        console.error("Error loading digital library data:", error);
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
                <h3>Server connection failed</h3>
                <p>Please make sure the backend server is running and try again.</p>
            </div>
        `;
    }
}

function renderDigitalBooks(books) {
    const grid = document.getElementById("digitalBookGrid");
    if (!grid) return;

    grid.innerHTML = "";

    if (books.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px; color: var(--text-muted);">
                <h3>No Digital Books Found</h3>
                <p>Try searching another keyword or changing the category filter.</p>
            </div>
        `;
        return;
    }

    books.forEach(book => {
        const bookId = book._id || book.id;
        const readCount = book.readCount || 0;
        
        // Content/section related fallback image
        let fallbackImage = 'images/book1 cover.jpg';
        const streamLower = String(book.stream || '').toLowerCase();
        if (streamLower.includes('bca') || streamLower.includes('mca') || streamLower.includes('computer')) {
            fallbackImage = 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400';
        } else if (streamLower.includes('bba') || streamLower.includes('mba') || streamLower.includes('management') || streamLower.includes('business')) {
            fallbackImage = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400';
        } else if (streamLower.includes('fiction') || streamLower.includes('sci')) {
            fallbackImage = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400';
        } else if (streamLower.includes('psychology')) {
            fallbackImage = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400';
        } else if (streamLower.includes('self') || streamLower.includes('development') || streamLower.includes('habit') || streamLower.includes('focus')) {
            fallbackImage = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400';
        }
        
        grid.innerHTML += `
            <div class="book-item" style="text-align: center; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
                <div style="position: relative; width: 100%; display: flex; flex-direction: column; align-items: center;">
                    <img src="${book.image}" alt="${book.name}" onerror="this.onerror=null; this.src='${fallbackImage}';" style="width: 100%; max-width: 220px; height: 280px; object-fit: cover; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); transition: var(--transition);">
                    <span class="e-badge" style="margin-top: 15px; display: inline-block;">${book.stream}</span>
                </div>
                <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; margin-top: 10px; width: 100%;">
                    <div>
                        <h3 style="font-size: 18px; font-weight: 600; color: var(--text-color); margin-bottom: 5px; min-height: 48px; display: flex; align-items: center; justify-content: center;">${book.name}</h3>
                        <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 8px;">By ${book.author} | ${book.category}</p>
                        <p style="font-size: 13.5px; color: var(--text-muted); line-height: 1.5; margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 40px; text-align: center;">${book.description}</p>
                    </div>
                    
                    <div style="border-top: 1px solid var(--border-color); padding-top: 15px; margin-top: 10px; width: 100%;">
                        <div style="display:flex; justify-content:center; align-items:center; width:100%; margin-bottom: 12px;">
                            <span class="e-reads" style="font-size: 13px; color: var(--text-muted); font-weight: 500; display: flex; align-items: center; gap: 4px;">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.7;">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                                ${readCount} reads
                            </span>
                        </div>
                        <div style="width:100%; margin-bottom:10px;">
                            <button class="access-btn" onclick="startReadingDigital('${bookId}', '${encodeURIComponent(book.name)}')" style="width:100%; padding:12px 0; margin-top:0; font-weight:600; border-radius:10px; background: var(--primary-color); color:#ffffff; cursor:pointer;">
                                📖 Read Now
                            </button>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; width:100%;">
                            <button onclick="downloadBookById('${bookId}')" class="e-source-btn" style="border: 1px solid var(--border-color); border-radius: 10px; font-size:12px; padding:10px 0; display:flex; align-items:center; justify-content:center; gap:4px; font-weight:600; cursor:pointer; width:100%;">
                                📥 PDF
                            </button>
                            <button onclick="shareBookById('${bookId}')" class="e-source-btn" style="border: 1px solid var(--border-color); border-radius: 10px; font-size:12px; padding:10px 0; display:flex; align-items:center; justify-content:center; gap:4px; font-weight:600; cursor:pointer; width:100%;">
                                🔗 Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

async function startReadingDigital(bookId, encodedName) {
    const bookName = decodeURIComponent(encodedName);
    
    // Register read increment asynchronously
    try {
        fetch(`/api/digital-books/${bookId}/read`, { method: "POST" }).catch(() => {});
    } catch(e) {}

    // Save recently read digital book to local storage history
    const user = localStorage.getItem("user") || "Guest";
    const historyKey = `digitalReadings_${user}`;
    let history = [];
    
    try {
        history = JSON.parse(localStorage.getItem(historyKey)) || [];
    } catch(e) {
        history = [];
    }

    const matchedBook = digitalBooks.find(b => (b._id || b.id) === bookId);
    
    if (matchedBook) {
        // Remove existing if any to push to front
        history = history.filter(item => item.id !== bookId);
        
        // Add at the beginning of list
        history.unshift({
            id: bookId,
            name: matchedBook.name,
            author: matchedBook.author,
            image: matchedBook.image,
            category: matchedBook.category,
            stream: matchedBook.stream,
            lastReadChapterIndex: 0,
            lastReadChapterTitle: matchedBook.chapters?.[0]?.title || "Chapter 1",
            readDate: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
        });

        // Limit to 6 items in history
        if (history.length > 6) {
            history.pop();
        }

        localStorage.setItem(historyKey, JSON.stringify(history));
    }

    // Redirect to e-reader
    window.location.href = `e_reader.html?id=${bookId}`;
}

function shareBookById(id) {
    const shareUrl = window.location.protocol + "//" + window.location.host + "/e_reader.html?id=" + id;
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert("🔗 E-Book direct reader link copied to clipboard! Share it with your friends.");
    }).catch(err => {
        alert(`Direct link: ${shareUrl}`);
    });
}

function downloadBookById(id) {
    const book = digitalBooks.find(b => (b._id || b.id) === id);
    if (!book) {
        alert("Book details not found.");
        return;
    }
    
    // Open clean print window
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
        alert("Please allow pop-ups to generate and download the book PDF.");
        return;
    }
    
    let chaptersHtml = "";
    book.chapters.forEach((chap, idx) => {
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
            <title>${book.name} - Full PDF Edition</title>
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
                <h1 style="font-size: 38px; color: #0f172a; margin-bottom: 10px; font-weight: 800;">${book.name}</h1>
                <p style="font-size: 18px; color: #475569; margin-bottom: 40px; font-weight: 500;">By ${book.author}</p>
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
