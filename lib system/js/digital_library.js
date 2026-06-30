document.addEventListener("DOMContentLoaded", () => {
    initDigitalLibrary();
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
    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", () => {
            fetchDigitalBooks(selectedStream, searchInput.value.trim());
        });
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                fetchDigitalBooks(selectedStream, searchInput.value.trim());
            }
        });
    }

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
        
        grid.innerHTML += `
            <div class="e-card">
                <div>
                    <img src="${book.image}" alt="${book.name}" onerror="this.src='images/book1 cover.jpg'">
                    <span class="e-badge">${book.stream}</span>
                    <h3>${book.name}</h3>
                    <p class="author">By ${book.author} | ${book.category}</p>
                    <p class="desc">${book.description}</p>
                </div>
                
                <div class="e-footer">
                    <span class="e-reads">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.7;">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                        ${readCount} reads
                    </span>
                    <button class="e-read-btn" onclick="startReadingDigital('${bookId}', '${encodeURIComponent(book.name)}')">
                        Read Now
                    </button>
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
