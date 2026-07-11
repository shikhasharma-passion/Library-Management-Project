
// Global Custom Centered Warning/Success Alert Override
window.alert = function(message) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0, 34, 68, 0.4)";
    overlay.style.backdropFilter = "blur(4px)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "100000";
    overlay.id = "customAlertOverlay";

    const msgLower = String(message).toLowerCase();
    const isSuccess = !msgLower.includes("fail") && 
                      !msgLower.includes("error") && 
                      !msgLower.includes("invalid") && 
                      !msgLower.includes("limit") && 
                      !msgLower.includes("offline");

    const icon = isSuccess ? "✔️" : "⚠️";
    const color = isSuccess ? "#10b981" : "#ef4444";
    const title = isSuccess ? "Action Successful" : "System Warning";

    overlay.innerHTML = `
        <div style="width: 350px; background: var(--card-bg); border: 2.5px solid ${color}; border-radius: 16px; padding: 25px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); text-align: center; display: flex; flex-direction: column; justify-content: space-between; gap: 15px; animation: popupScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); box-sizing: border-box; position: relative;">
            <button onclick="document.getElementById('customAlertOverlay').remove()" style="position: absolute; top: 12px; right: 15px; background: transparent; border: none; color: var(--text-muted); font-size: 18px; font-weight: bold; cursor: pointer; padding: 5px; outline: none; transition: color 0.2s;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='var(--text-muted)'">✕</button>
            <div>
                <div style="font-size: 40px; margin-bottom: 8px;">${icon}</div>
                <h3 style="font-family: 'Montserrat', sans-serif; font-size: 17px; font-weight: 800; color: ${color}; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">${title}</h3>
                <p style="font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--text-color); line-height: 1.5; margin: 0; font-weight: 500;">
                    ${message}
                </p>
            </div>
        </div>
    `;

    if (!document.getElementById("popupAnimationStyles")) {
        const style = document.createElement("style");
        style.id = "popupAnimationStyles";
        style.innerHTML = `
            @keyframes popupScaleIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(overlay);
};

document.addEventListener("DOMContentLoaded", () => {
    window.API_RESOLVED_PROMISE.then(() => {
        initStudentTheme();
        loadStudentDashboard();
        initAvailableBookSearch();
        loadAvailableBooks();
        loadStudentBorrowRequests();
        loadStudentExtensionRequests();
        loadDigitalReadingHistory();
        initSuggestionForm();
        loadStudentSuggestions();
    });
});

/* THEME SYSTEM (Persistent across Student Dashboard) */
function initStudentTheme() {
    const darkBtn = document.getElementById("darkModeBtn");
    const currentTheme = localStorage.getItem("theme") || "light";

    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode");
        if (darkBtn) darkBtn.innerHTML = "☀️ Light Mode";
    } else {
        document.body.classList.remove("dark-mode");
        if (darkBtn) darkBtn.innerHTML = "🌙 Dark Mode";
    }

    if (darkBtn) {
        darkBtn.addEventListener("click", () => {
            const isDark = document.body.classList.toggle("dark-mode");
            if (isDark) {
                localStorage.setItem("theme", "dark");
                darkBtn.innerHTML = "☀️ Light Mode";
            } else {
                localStorage.setItem("theme", "light");
                darkBtn.innerHTML = "🌙 Dark Mode";
            }
        });
    }
}

function getBookId(book) {
    return book.id || book._id;
}

/* CUSTOM MODAL CONFIRMATION DIALOG */
function showCustomConfirm(message, onConfirm) {
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.55)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "9999";
    modal.style.backdropFilter = "blur(4px)";
    
    modal.innerHTML = `
        <div style="background:var(--card-bg); color:var(--text-color); width: 400px; padding: 30px; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
            <h3 style="margin-bottom: 12px; font-weight:800; display:flex; align-items:center; gap:8px;">
                💡 Action Confirmation
            </h3>
            <p style="font-size: 14.5px; line-height: 1.6; margin-bottom: 25px; opacity:0.9;">${message.replace(/\n/g, '<br>')}</p>
            <div style="display: flex; gap: 10px;">
                <button id="custConfirmYes" class="action-btn" style="margin-top:0; flex:1; background:var(--accent-color); color:#0f172a; padding:10px;">Confirm</button>
                <button id="custConfirmNo" class="delete-btn" style="margin-top:0; flex:1; background:rgba(0,0,0,0.05); color:var(--text-color); border:1px solid var(--border-color); padding:10px;">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector("#custConfirmYes").onclick = () => {
        modal.remove();
        onConfirm();
    };
    modal.querySelector("#custConfirmNo").onclick = () => {
        modal.remove();
    };
}

/* RENDER DIGITAL READING HISTORY */
function loadDigitalReadingHistory() {
    const user = localStorage.getItem("user") || "Guest";
    const historyKey = `digitalReadings_${user}`;
    const section = document.getElementById("digitalHistorySection");
    const grid = document.getElementById("digitalReadingHistoryGrid");

    if (!section || !grid) return;

    let history = [];
    try {
        history = JSON.parse(localStorage.getItem(historyKey)) || [];
    } catch(e) {
        history = [];
    }

    if (history.length === 0) {
        section.style.display = "none";
        return;
    }

    section.style.display = "block";
    grid.innerHTML = "";

    history.forEach(item => {
        const coverImg = item.image || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400";
        grid.innerHTML += `
            <div class="book-card" style="display:flex; gap:15px; border: 1px solid var(--border-color); background:var(--card-bg); border-radius:12px; padding:18px; transition:var(--transition);">
                <img src="${coverImg}" alt="${item.name}" style="width:75px; height:105px; border-radius:6px; object-fit:cover; box-shadow:0 4px 10px rgba(0,0,0,0.15); flex-shrink:0;">
                <div style="display:flex; flex-direction:column; justify-content:space-between; flex:1; min-width:0;">
                    <div style="min-width:0;">
                        <span class="status-badge" style="font-size: 10px; margin-bottom: 6px; padding: 2px 8px; background:rgba(217,119,6,0.1); color:var(--accent-color); font-weight:600; text-transform:uppercase; width:fit-content; display:block;">${item.stream}</span>
                        <h3 style="margin-top: 4px; margin-bottom: 4px; font-size:15.5px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--text-color);">${item.name}</h3>
                        <p style="font-size: 12.5px; margin-bottom: 3px; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"><strong>Author:</strong> ${item.author}</p>
                        <p style="font-size: 12.5px; margin-bottom: 3px; color:var(--accent-color); font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                            📖 Resume: ${item.lastReadChapterTitle || "Chapter 1"}
                        </p>
                    </div>
                    <a href="e_reader.html?id=${item.id}" class="action-btn" style="text-decoration:none; text-align:center; padding: 7px 12px; margin-top: 10px; background:var(--accent-color); color:#0f172a; display:block; border-radius:6px; font-weight:700; border:none; transition:var(--transition); font-size:12.5px; width:fit-content;">
                        Resume Reading
                    </a>
                </div>
            </div>
        `;
    });
}

/* LOAD AVAILABLE PHYSICAL BOOKS FOR RESERVATION */
async function loadAvailableBooks(searchValue = "") {
    const list = document.getElementById("availableBookList");
    if (!list) return;

    list.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-muted);">
            <h3>Loading available books...</h3>
        </div>
    `;

    try {
        const params = new URLSearchParams();
        params.set("status", "Available");

        if (searchValue) {
            params.set("q", searchValue);
        }

        const response = await fetch(`/api/books?${params.toString()}`);
        if (!response.ok) {
            const result = await response.json();
            list.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-muted);">
                    <h3>Books not loaded</h3>
                    <p>${result.message || "Please try again"}</p>
                </div>
            `;
            return;
        }

        const books = await response.json();
        renderAvailableBooks(books, !!searchValue);
    } catch (error) {
        console.error("Error loading available books:", error);
        list.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-muted);">
                <h3>Server connection failed</h3>
                <p>Please make sure the backend is running.</p>
            </div>
        `;
    }
}

function getRackLocation(category) {
    const cat = String(category || "").toLowerCase();
    if (cat.includes("bca") || cat.includes("mca") || cat.includes("operating") || cat.includes("networking") || cat.includes("dbms")) {
        return "Rack CS-14";
    }
    if (cat.includes("bba") || cat.includes("mba") || cat.includes("management")) {
        return "Rack MG-03";
    }
    if (cat.includes("programming") || cat.includes("development")) {
        return "Rack PR-08";
    }
    if (cat.includes("self") || cat.includes("psychology") || cat.includes("finance")) {
        return "Rack SF-02";
    }
    if (cat.includes("fiction")) {
        return "Rack FC-01";
    }
    return "Rack GN-03";
}

function renderAvailableBooks(books, isSearchActive) {
    const list = document.getElementById("availableBookList");
    const viewMoreContainer = document.getElementById("viewMoreBooksContainer");
    if (!list) return;

    list.innerHTML = "";

    // Deduplicate books by name so only one copy of each book title is shown
    const uniqueBooksMap = new Map();
    books.forEach(book => {
        const nameKey = String(book.name || "").trim().toLowerCase();
        if (!uniqueBooksMap.has(nameKey)) {
            uniqueBooksMap.set(nameKey, book);
        }
    });
    const uniqueBooks = Array.from(uniqueBooksMap.values());

    if (uniqueBooks.length === 0) {
        list.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-muted);">
                <h3>No Available Shelf Books</h3>
                <p>Try another search or check again later.</p>
            </div>
        `;
        if (viewMoreContainer) viewMoreContainer.innerHTML = "";
        return;
    }

    // Limit to 8 books initially on page load if search is inactive
    let booksToRender = uniqueBooks;
    if (!isSearchActive && uniqueBooks.length > 8) {
        booksToRender = uniqueBooks.slice(0, 8);
        if (viewMoreContainer) {
            viewMoreContainer.innerHTML = `
                <button onclick="location.href='all_books.html'" style="padding:12px 28px; border-radius:10px; background:var(--accent-color); color:#0f172a; border:none; cursor:pointer; font-weight:700; font-size:14.5px; transition:var(--transition); box-shadow:0 8px 20px var(--shadow-color);" onmouseover="this.style.filter='brightness(1.15)';" onmouseout="this.style.filter='none';">
                    📚 View More Campus Catalog Books
                </button>
            `;
        }
    } else {
        if (viewMoreContainer) viewMoreContainer.innerHTML = "";
    }

    booksToRender.forEach((book) => {
        const rack = getRackLocation(book.category);
        list.innerHTML += `
            <div class="book-card" style="display:flex; flex-direction:column; justify-content:space-between; border: 1px solid var(--border-color); background:var(--card-bg); border-radius:12px; padding:20px;">
                <div>
                    <h3 style="font-size:17px; font-weight:700; margin-bottom:6px;">${book.name}</h3>
                    <p style="font-size:13.5px; margin-bottom:4px; color:var(--text-muted);"><strong>Author:</strong> ${book.author}</p>
                    <p style="font-size:13.5px; margin-bottom:4px; color:var(--text-muted);"><strong>Category:</strong> ${book.category}</p>
                    <p style="font-size:13.5px; margin-bottom:4px; color:var(--text-color);">Loc: <strong style="color:var(--text-color);">${rack}</strong></p>
                    <p style="font-size:13.5px; margin-bottom:4px;"><span class="status-badge active" style="font-size:11px;">Shelf Available</span></p>
                </div>
                <button class="action-btn" onclick="requestIssueFromDashboard('${getBookId(book)}', '${encodeURIComponent(book.name)}')" style="width:100%; margin-top:15px; padding:9px 14px; border-radius:8px; font-weight:600; border:none; transition:var(--transition);">
                    Request Issue
                </button>
            </div>
        `;
    });
}

function initAvailableBookSearch() {
    const input = document.getElementById("studentBookSearchInput");
    if (!input) return;

    let timer;
    input.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            loadAvailableBooks(input.value.trim());
        }, 250);
    });
}

async function requestIssueFromDashboard(bookId, encodedBookName) {
    const user = localStorage.getItem("user") || "";
    const bookName = decodeURIComponent(encodedBookName);

    if (!user) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    if (!bookId || !bookName) {
        alert("Book details missing");
        return;
    }

    const today = new Date();
    const requestDate = today.toISOString().split("T")[0];
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 14);
    const returnDate = dueDate.toISOString().split("T")[0];

    showCustomConfirm(`Request physical borrow issue for "${bookName}"?\nReturn deadline will be ${returnDate}.`, async () => {
        try {
            const response = await fetch("/api/issues/requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    student: user,
                    book: bookName,
                    date: requestDate,
                    returnDate
                })
            });

            const result = await response.json();

            if (response.ok) {
                showBorrowSuccessPopup(bookName);
                loadAvailableBooks(document.getElementById("studentBookSearchInput")?.value.trim() || "");
                loadStudentBorrowRequests();
            } else {
                if (response.status === 400 || (result.message && result.message.includes("limit")) || (result.message && result.message.includes("3 books"))) {
                    showLimitWarningPopup(result.message || "You already have issued 3 books. You can issue further after returning old issues.");
                } else {
                    alert(result.message || "Issue request failed");
                }
            }
        } catch (error) {
            console.error("Error submitting issue request:", error);
            alert("Server connection failed");
        }
    });
}

/* LOAD STUDENT METRICS & ISSUED BOOKS */
async function loadStudentDashboard() {
    const user = localStorage.getItem("user") || "";
    const profile = document.getElementById("studentProfile");

    try {
        const response = await fetch(`/api/student-dashboard?name=${encodeURIComponent(user)}`);
        const data = await response.json();

        if (profile && user) {
            const semStr = data.studentInfo ? ` (${data.studentInfo.course} | ${data.studentInfo.semester})` : "";
            profile.innerText = `Welcome, ${user}${semStr}`;
        }

        document.getElementById("studentIssuedCount").innerText = data.totalIssued;
        document.getElementById("studentPendingCount").innerText = data.pendingReturns;
        document.getElementById("studentFineAmount").innerText = `Rs. ${data.fineAmount}`;

        // Fetch real-time library live monitor status
        try {
            const statusRes = await fetch("/api/system/status");
            if (statusRes.ok) {
                const statusData = await statusRes.json();
                
                const badge = document.getElementById("liveStatusBadge");
                const shiftText = document.getElementById("liveShiftText");
                const footfallText = document.getElementById("liveFootfallText");
                const occupancyText = document.getElementById("liveOccupancyDetails");

                if (badge) {
                    badge.innerText = statusData.status || "OPEN";
                    if (statusData.status === "CLOSED") {
                        badge.style.background = "rgba(239, 68, 68, 0.12)";
                        badge.style.color = "#ef4444";
                    } else {
                        badge.style.background = "rgba(16, 185, 129, 0.12)";
                        badge.style.color = "#10b981";
                    }
                }
                if (shiftText) {
                    shiftText.innerHTML = `Current Shift: ${statusData.shift}<br>Duty Librarian: ${statusData.librarian}<br>Stack Hall gate: Active`;
                }
                if (footfallText) {
                    footfallText.innerText = `Today's Footfall: ${statusData.footfall}`;
                }
                if (occupancyText) {
                    occupancyText.innerHTML = `Digital Lab: ${statusData.labActive}/25 active PCs<br>Reading Room: ${statusData.readingOccupancy}% occupancy<br>Gate scanner: Normal`;
                }
            }
        } catch (statusErr) {
            console.error("Error loading system status:", statusErr);
        }

        // Show/Hide Overdue return alert warning
        const alertCard = document.getElementById("overdueAlert");
        if (alertCard) {
            if (Number(data.fineAmount) > 0 || Number(data.pendingReturns) > 0) {
                alertCard.style.display = "block";
            } else {
                alertCard.style.display = "none";
            }
        }

        const table = document.getElementById("studentIssuedTable");
        if (!table) return;

        table.innerHTML = `
            <tr>
                <th>Book Title</th>
                <th>Issue Date</th>
                <th>Return Deadline</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        `;

        if (data.issuedBooks.length === 0) {
            table.innerHTML += `
                <tr>
                    <td colspan="5" style="text-align: center; color: var(--text-muted);">You have no books issued currently</td>
                </tr>
            `;
            return;
        }

        data.issuedBooks.forEach((record) => {
            let statusClass = "active";
            let statusText = "Issued";
            
            if (record.fine > 0) {
                statusClass = "overdue";
                statusText = `Overdue (Rs. ${record.fine})`;
            }

            table.innerHTML += `
                <tr>
                    <td><strong>${record.book}</strong></td>
                    <td>${record.date}</td>
                    <td>${record.returnDate}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="action-btn" style="margin-top: 0; padding: 6px 12px; font-size: 13px; width: auto;" onclick="requestBookExtension('${record.id}', '${record.book}', '${record.returnDate}')">
                            Extend
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading student dashboard details:", error);
    }
}

async function loadStudentBorrowRequests() {
    const user = localStorage.getItem("user") || "";
    const table = document.getElementById("studentRequestsTable");
    if (!table) return;

    table.innerHTML = `
        <tr>
            <th>Book Title</th>
            <th>Request Date</th>
            <th>Return Deadline</th>
            <th>Status</th>
        </tr>
    `;

    try {
        const response = await fetch(`/api/issues/requests/student?name=${encodeURIComponent(user)}`);
        if (!response.ok) return;
        const requests = await response.json();

        if (requests.length === 0) {
            table.innerHTML += `
                <tr>
                    <td colspan="4" style="text-align: center; color: var(--text-muted);">No borrow requests submitted yet</td>
                </tr>
            `;
            return;
        }

        requests.forEach(req => {
            let statusClass = "active";
            if (req.status === "Rejected") statusClass = "overdue";
            if (req.status === "Approved") statusClass = "returned";

            table.innerHTML += `
                <tr>
                    <td><strong>${req.book}</strong></td>
                    <td>${req.requestDate}</td>
                    <td>${req.returnDate}</td>
                    <td><span class="status-badge ${statusClass}">${req.status}</span></td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading student borrow requests:", error);
    }
}

async function loadStudentExtensionRequests() {
    const user = localStorage.getItem("user") || "";
    const table = document.getElementById("studentExtensionsTable");
    if (!table) return;

    table.innerHTML = `
        <tr>
            <th>Book Title</th>
            <th>Current Deadline</th>
            <th>Requested Deadline</th>
            <th>Status</th>
        </tr>
    `;

    try {
        const response = await fetch(`/api/issues/extensions/student?name=${encodeURIComponent(user)}`);
        if (!response.ok) return;
        const requests = await response.json();

        if (requests.length === 0) {
            table.innerHTML += `
                <tr>
                    <td colspan="4" style="text-align: center; color: var(--text-muted);">No extension requests submitted yet</td>
                </tr>
            `;
            return;
        }

        requests.forEach(req => {
            let statusClass = "active";
            if (req.status === "Rejected") statusClass = "overdue";
            if (req.status === "Approved") statusClass = "returned";

            table.innerHTML += `
                <tr>
                    <td><strong>${req.book}</strong></td>
                    <td>${req.currentReturnDate}</td>
                    <td>${req.requestedReturnDate}</td>
                    <td><span class="status-badge ${statusClass}">${req.status}</span></td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading student extension requests:", error);
    }
}

/* REQUEST BOOK EXTENSION WITH CUSTOM DATE-PICKER MODAL */
function requestBookExtension(issueId, bookName, currentReturnDate) {
    const current = new Date(currentReturnDate);
    const extended = new Date(current);
    extended.setDate(current.getDate() + 7);
    const defaultDateStr = extended.toISOString().split("T")[0];

    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.55)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "9999";
    modal.style.backdropFilter = "blur(4px)";
    
    modal.innerHTML = `
        <div style="background:var(--card-bg); color:var(--text-color); width: 420px; padding: 30px; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
            <h3 style="margin-bottom: 8px; font-weight:800; display:flex; align-items:center; gap:8px;">
                📅 Request Return Extension
            </h3>
            <p style="font-size: 13.5px; color:var(--text-muted); margin-bottom: 20px; line-height:1.5;">
                Book: <strong>${bookName}</strong><br>
                Current Deadline: <strong>${currentReturnDate}</strong>
            </p>
            
            <div style="margin-bottom: 25px;">
                <label style="display:block; font-size:13px; font-weight:600; margin-bottom:6px;">New Requested Return Date</label>
                <input type="date" id="newExtDate" value="${defaultDateStr}" style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--border-color); background:var(--input-bg); color:var(--text-color);">
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button id="custExtSubmit" class="action-btn" style="margin-top:0; flex:1; background:var(--accent-color); color:#0f172a; padding:10px;">Submit Request</button>
                <button id="custExtCancel" class="delete-btn" style="margin-top:0; flex:1; background:rgba(0,0,0,0.05); color:var(--text-color); border:1px solid var(--border-color); padding:10px;">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector("#custExtSubmit").onclick = async () => {
        const newDateStr = modal.querySelector("#newExtDate").value;
        if (!newDateStr) return;
        
        // Simple date format check
        if (!/^\d{4}-\d{2}-\d{2}$/.test(newDateStr.trim())) {
            alert("Invalid date format. Please use YYYY-MM-DD.");
            return;
        }
        
        modal.remove();
        
        try {
            const response = await fetch(`/api/issues/${issueId}/extension`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    requestedReturnDate: newDateStr.trim()
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Extension request submitted successfully!");
                loadStudentDashboard();
                loadStudentExtensionRequests();
            } else {
                alert(result.message || "Failed to submit extension request");
            }
        } catch (error) {
            console.error("Error requesting book extension:", error);
            alert("Server connection failed");
        }
    };
    
    modal.querySelector("#custExtCancel").onclick = () => {
        modal.remove();
    };
}

function initSuggestionForm() {
    const form = document.getElementById("suggestionForm");
    if (!form) return;
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("suggestTitle").value.trim();
        const author = document.getElementById("suggestAuthor").value.trim();
        const category = document.getElementById("suggestCategory").value;
        const user = localStorage.getItem("user") || "Guest";
        
        try {
            const response = await fetch("/api/suggestions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    student: user,
                    bookTitle: title,
                    bookAuthor: author,
                    category: category
                })
            });
            const result = await response.json();
            if (response.ok) {
                alert("Book suggestion submitted successfully!");
                form.reset();
                loadStudentSuggestions();
            } else {
                alert(result.message || "Failed to submit suggestion");
            }
        } catch(err) {
            console.error(err);
            alert("Server connection failed");
        }
    });
}

async function loadStudentSuggestions() {
    const tbody = document.getElementById("studentSuggestionsBody");
    if (!tbody) return;
    
    const user = localStorage.getItem("user") || "Guest";
    
    try {
        const response = await fetch(`/api/suggestions/student?student=${encodeURIComponent(user)}`);
        if (!response.ok) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Failed to load suggestions</td></tr>`;
            return;
        }
        const data = await response.json();
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding: 15px;">No suggestions submitted yet.</td></tr>`;
            return;
        }
        
        tbody.innerHTML = data.map(item => {
            let badgeColor = "orange";
            if (item.status.includes("Way")) badgeColor = "#3b82f6";
            else if (item.status.includes("Added")) badgeColor = "#10b981";
            else if (item.status === "Refused") badgeColor = "#ef4444";
            
            return `
                <tr>
                    <td><strong>${item.bookTitle}</strong></td>
                    <td>${item.bookAuthor}</td>
                    <td>${item.category}</td>
                    <td>
                        <span style="padding:4px 8px; border-radius:12px; font-size:11px; font-weight:600; background:rgba(0,0,0,0.03); color:${badgeColor}; border: 1px solid ${badgeColor}; white-space:nowrap;">
                            ${item.status}
                        </span>
                    </td>
                    <td style="font-style:italic; color:${item.adminNotes ? 'var(--text-color)' : 'var(--text-muted)'};">
                        ${item.adminNotes || "Waiting for admin review..."}
                    </td>
                </tr>
            `;
        }).join("");
    } catch(err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Server error</td></tr>`;
    }
}

function showBorrowSuccessPopup(bookName) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0, 34, 68, 0.4)";
    overlay.style.backdropFilter = "blur(4px)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "100000";
    overlay.id = "borrowSuccessPopupOverlay";

    overlay.innerHTML = `
        <div style="width: 350px; background: var(--card-bg); border: 2.5px solid #10b981; border-radius: 16px; padding: 25px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); text-align: center; display: flex; flex-direction: column; justify-content: space-between; gap: 15px; animation: popupScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); box-sizing: border-box;">
            <div>
                <div style="font-size: 50px; margin-bottom: 8px; color: #10b981; display: inline-block; animation: tickBounce 0.5s ease;">✔️</div>
                <h3 style="font-family: 'Montserrat', sans-serif; font-size: 18px; font-weight: 800; color: #10b981; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">Request Submitted</h3>
                <p style="font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--text-color); line-height: 1.5; margin: 0; font-weight: 500;">
                    Your borrow request for <strong>"${bookName}"</strong> has been sent successfully. Please keep track of approval on your student dashboard.
                </p>
            </div>
            <button onclick="document.getElementById('borrowSuccessPopupOverlay').remove()" style="width: 100%; padding: 12px; border-radius: 8px; background: #10b981; color: #fff; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 13px; border: none; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">
                Awesome!
            </button>
        </div>
    `;

    document.body.appendChild(overlay);
}

function showLimitWarningPopup(message) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0, 34, 68, 0.4)";
    overlay.style.backdropFilter = "blur(4px)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "99999";
    overlay.id = "limitWarningPopupOverlay";

    overlay.innerHTML = `
        <div style="width: 350px; background: var(--card-bg); border: 2.5px solid #d97706; border-radius: 16px; padding: 25px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); text-align: center; display: flex; flex-direction: column; justify-content: space-between; gap: 15px; animation: popupScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); box-sizing: border-box;">
            <div>
                <div style="font-size: 50px; margin-bottom: 8px;">🛑</div>
                <h3 style="font-family: 'Montserrat', sans-serif; font-size: 17px; font-weight: 800; color: #d97706; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">Borrow Limit Breached</h3>
                <p style="font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--text-color); line-height: 1.5; margin: 0; font-weight: 500;">
                    ${message}
                </p>
            </div>
            <button onclick="document.getElementById('limitWarningPopupOverlay').remove()" style="width: 100%; padding: 12px; border-radius: 8px; background: #d97706; color: #fff; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 13px; border: none; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='#b45309'" onmouseout="this.style.background='#d97706'">
                Understood & Close
            </button>
        </div>
    `;
    
    if (!document.getElementById("popupAnimationStyles")) {
        const style = document.createElement("style");
        style.id = "popupAnimationStyles";
        style.innerHTML = `
            @keyframes popupScaleIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(overlay);
}
