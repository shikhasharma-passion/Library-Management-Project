
const publicBookList = document.getElementById("publicBookList");
const loginPopup = document.getElementById("loginPopup");
const publicSearchInput = document.getElementById("publicSearchInput");

let publicCatalogBooks = [];
let physicalInventory = [];
let activeCategory = "All";
let activeSemester = "All";

/* RACK LOCATION MAPPING */
function getRackLocation(category) {
    const cat = String(category || "").toLowerCase();
    if (cat.includes("bca") || cat.includes("mca") || cat.includes("operating") || cat.includes("networking") || cat.includes("dbms") || cat.includes("algorithm")) {
        return "Rack CS-14";
    }
    if (cat.includes("bba") || cat.includes("mba") || cat.includes("management") || cat.includes("business")) {
        return "Rack MG-03";
    }
    if (cat.includes("programming") || cat.includes("development") || cat.includes("javascript") || cat.includes("react")) {
        return "Rack PR-08";
    }
    if (cat.includes("self") || cat.includes("psychology") || cat.includes("finance") || cat.includes("habit")) {
        return "Rack SF-02";
    }
    if (cat.includes("fiction")) {
        return "Rack FC-01";
    }
    return "Rack GN-03";
}

/* DISPLAY BOOKS */
function renderBookListHtml(booksList) {
    let listHtml = "";
    booksList.forEach((book) => {
        // Calculate average rating
        const reviews = book.reviews || [];
        let avgRating = 0;
        let starHtml = "";
        
        if (reviews.length > 0) {
            const sum = reviews.reduce((acc, r) => acc + Number(r.rating), 0);
            avgRating = Math.round((sum / reviews.length) * 10) / 10;
        }

        // Generate stars
        const roundedRating = Math.round(avgRating);
        for (let i = 1; i <= 5; i++) {
            starHtml += (i <= roundedRating) ? "⭐" : "☆";
        }

        const reviewsText = reviews.length > 0 
            ? `${starHtml} <span style="font-size: 13px; color: var(--text-muted); font-weight: 500;">(${avgRating}/5)</span>` 
            : `<span style="font-size: 13px; color: var(--text-muted); font-weight: 500;">No reviews yet</span>`;

        // Check real-time physical availability from physical inventory
        const copies = physicalInventory.filter(p => p.name.toLowerCase() === book.name.toLowerCase());
        const hasAvailable = copies.length > 0 && copies.some(p => p.status === "Available");
        const isOutOfStock = copies.length === 0 || !hasAvailable;
        
        const availabilityBadge = isOutOfStock
            ? `<span style="display:inline-block; font-size:11px; padding:3px 8px; border-radius:12px; background:rgba(231,76,60,0.12); color:#e74c3c; font-weight:600; text-transform:uppercase;">Out of Stock</span>`
            : `<span style="display:inline-block; font-size:11px; padding:3px 8px; border-radius:12px; background:rgba(39,174,96,0.12); color:#27ae60; font-weight:600; text-transform:uppercase;">On Shelf</span>`;

        const rack = getRackLocation(book.category);

        // Content/category related fallback image
        let fallbackImage = 'images/book1 cover.jpg';
        const catLower = String(book.category || '').toLowerCase();
        if (catLower.includes('bca') || catLower.includes('mca') || catLower.includes('computer') || catLower.includes('programming') || catLower.includes('operating') || catLower.includes('networking') || catLower.includes('dbms') || catLower.includes('algorithm')) {
            fallbackImage = 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400';
        } else if (catLower.includes('bba') || catLower.includes('mba') || catLower.includes('management') || catLower.includes('business')) {
            fallbackImage = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400';
        } else if (catLower.includes('fiction') || catLower.includes('sci')) {
            fallbackImage = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400';
        } else if (catLower.includes('psychology')) {
            fallbackImage = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400';
        } else if (catLower.includes('self') || catLower.includes('development') || catLower.includes('habit') || catLower.includes('focus')) {
            fallbackImage = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400';
        }

        listHtml += `
            <div class="book-item">
                <div style="position: relative; width: 100%; display: flex; justify-content: center;">
                    <img src="${book.image}" alt="${book.name}" onerror="this.onerror=null; this.src='${fallbackImage}';">
                    <div style="position: absolute; bottom: 10px; right: 10px;">
                        ${availabilityBadge}
                    </div>
                </div>
                <h3>${book.name}</h3>
                <p>By ${book.author}</p>
                <div style="font-size: 13.5px; color: var(--text-muted); margin-bottom: 8px; font-weight: 500;">Loc: <span style="color: var(--text-color); font-weight: 600;">${rack}</span></div>
                <div style="margin-bottom: 15px;">${reviewsText}</div>
                <div style="display:grid; grid-template-columns:1fr; gap:10px; margin-top:8px;">
                    <button class="access-btn" onclick="openBookDetails('${book.id || book._id}')" style="background: var(--accent-color); color: #0f172a; font-weight: 700; margin-top:0; width:100%;">
                        Details & Request Issue
                    </button>
                </div>
            </div>
        `;
    });
    return listHtml;
}

function displayPublicBooks(catalogBooks) {
    if (catalogBooks.length === 0) {
        publicBookList.innerHTML = `
            <div class="book-item" style="grid-column: 1/-1; padding: 40px; text-align: center; background: var(--card-bg); border-radius: 20px; border: 1px solid var(--border-color);">
                <h3>No Books Found</h3>
                <p>Try another category or search query.</p>
            </div>
        `;
        return;
    }

    publicBookList.innerHTML = renderBookListHtml(catalogBooks);
}

async function loadPublicBooks(category = "All", searchValue = "") {
    activeCategory = category;

    try {
        const semDropdown = document.getElementById("semesterFilter");
        const semesterValue = semDropdown ? semDropdown.value : "All";

        const params = new URLSearchParams();
        if (category !== "All") params.set("category", category);
        if (semesterValue !== "All") params.set("semester", semesterValue);
        if (searchValue) params.set("q", searchValue);

        const catalogUrl = params.toString() ? `/api/catalog?${params.toString()}` : "/api/catalog";
        
        // Fetch both catalog details and physical inventory status in parallel
        const [catalogRes, physicalRes] = await Promise.all([
            fetch(catalogUrl),
            fetch("/api/books")
        ]);

        if (!catalogRes.ok || !physicalRes.ok) {
            throw new Error("Failed to load library resources");
        }

        publicCatalogBooks = await catalogRes.json();
        physicalInventory = await physicalRes.json();

        displayPublicBooks(publicCatalogBooks);
    } catch (error) {
        console.error("Error loading library catalogs:", error);
        if (publicBookList) {
            publicBookList.innerHTML = `
                <div class="book-item" style="grid-column: 1/-1; padding: 40px; text-align: center;">
                    <h3>Server Connection Failure</h3>
                    <p>Make sure the backend is running and try again.</p>
                </div>
            `;
        }
    }
}

/* SELECT SEMESTER PILL BUTTON */
function selectSemester(semesterValue) {
    activeSemester = semesterValue;
    
    // Update active class on semester buttons
    const container = document.getElementById("semesterFilterContainer");
    if (container) {
        const buttons = container.querySelectorAll(".sem-btn");
        buttons.forEach(btn => {
            const btnOnClick = btn.getAttribute("onclick");
            if (btnOnClick && btnOnClick.includes(`'${semesterValue}'`)) {
                btn.classList.add("active");
                btn.style.background = "var(--primary-color)";
                btn.style.color = "var(--accent-color)";
                btn.style.borderColor = "transparent";
            } else {
                btn.classList.remove("active");
                btn.style.background = "var(--bg-color)";
                btn.style.color = "var(--text-color)";
                btn.style.borderColor = "var(--border-color)";
            }
        });
    }

    loadPublicBooks(activeCategory, publicSearchInput ? publicSearchInput.value.trim() : "");
}

/* FILTER */
function filterBooks(category) {
    const container = document.getElementById("categoryFilterContainer");
    if (container) {
        const buttons = container.querySelectorAll("button");
        buttons.forEach(btn => {
            const btnOnClick = btn.getAttribute("onclick");
            if (btnOnClick && btnOnClick.includes(`'${category}'`)) {
                btn.classList.add("active");
                btn.style.background = "var(--primary-color)";
                btn.style.color = "var(--accent-color)";
                btn.style.borderColor = "transparent";
            } else {
                btn.classList.remove("active");
                btn.style.background = "var(--bg-color)";
                btn.style.color = "var(--text-color)";
                btn.style.borderColor = "var(--border-color)";
            }
        });
    }

    // Toggle visibility and value of semester filter select based on category type
    const semDropdown = document.getElementById("semesterFilter");
    if (semDropdown) {
        const isAcademic = ["All", "BCA", "BBA", "MCA", "MBA", "Computer", "Management"].includes(category);
        semDropdown.style.display = isAcademic ? "block" : "none";
        if (!isAcademic) {
            semDropdown.value = "All";
        }
    }

    loadPublicBooks(category, publicSearchInput ? publicSearchInput.value.trim() : "");
}

if (publicSearchInput) {
    const clearBtn = document.getElementById("clearSearchBtn");
    publicSearchInput.addEventListener("input", function() {
        const val = publicSearchInput.value.trim();
        if (clearBtn) {
            clearBtn.style.display = val ? "block" : "none";
        }
        loadPublicBooks(activeCategory, val);
    });
}

window.clearPublicSearch = function() {
    const input = document.getElementById("publicSearchInput");
    const clearBtn = document.getElementById("clearSearchBtn");
    if (input) input.value = "";
    if (clearBtn) clearBtn.style.display = "none";
    loadPublicBooks(activeCategory, "");
};

/* OPEN BOOK DETAILS MODAL */
function openBookDetails(bookId) {
    const book = publicCatalogBooks.find(b => (b.id || b._id) === bookId);
    if (!book) return;

    const user = localStorage.getItem("user");
    const copies = physicalInventory.filter(p => p.name.toLowerCase() === book.name.toLowerCase());
    const hasAvailable = copies.length > 0 && copies.some(p => p.status === "Available");
    const isIssued = copies.length === 0 || !hasAvailable;
    const totalCopies = copies.length || book.quantity || 1;
    const availableCopies = copies.filter(p => p.status === "Available").length;
    const rack = getRackLocation(book.category);
    
    // Create details modal dynamically
    const modal = document.createElement("div");
    modal.className = "popup show";
    modal.id = "bookDetailsPopup";
    modal.style.display = "flex";

    // Calculate rating details
    const reviews = book.reviews || [];
    let avgRating = 0;
    let starHtml = "";
    if (reviews.length > 0) {
        const sum = reviews.reduce((acc, r) => acc + Number(r.rating), 0);
        avgRating = Math.round((sum / reviews.length) * 10) / 10;
    }
    const roundedRating = Math.round(avgRating);
    for (let i = 1; i <= 5; i++) {
        starHtml += (i <= roundedRating) ? "⭐" : "☆";
    }

    // Generate reviews markup list
    let reviewsListHtml = "";
    if (reviews.length === 0) {
        reviewsListHtml = `<p style="color: var(--text-muted); font-style: italic; margin: 15px 0;">No reviews written yet. Be the first to review!</p>`;
    } else {
        reviews.forEach(r => {
            let itemStars = "";
            for (let i = 1; i <= 5; i++) {
                itemStars += (i <= r.rating) ? "⭐" : "☆";
            }
            const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric"
            }) : "";

            reviewsListHtml += `
                <div style="background: var(--bg-color); padding: 12px; border-radius: 8px; margin-bottom: 12px; text-align: left; border: 1px solid var(--border-color); transition: var(--transition);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                        <strong>${r.studentName}</strong>
                        <span style="font-size: 12px; color: var(--text-muted);">${dateStr}</span>
                    </div>
                    <div style="font-size: 13px; color: var(--accent-color); margin-bottom: 4px;">${itemStars}</div>
                    <p style="font-size: 14px; margin: 0; line-height: 1.5; color: var(--text-color);">${r.comment}</p>
                </div>
            `;
        });
    }

    // Review submission form block
    let formHtml = "";
    if (user) {
        formHtml = `
            <form id="reviewSubmitForm" style="margin-top: 10px; border-top: 1px solid var(--border-color); padding-top: 8px; text-align: left; font-size: 12.5px;">
                <h5 style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: var(--text-color);">Add Your Review</h5>
                <div style="display: flex; gap: 10px; margin-bottom: 6px;">
                    <div style="flex: 1;">
                        <select id="reviewRating" style="width: 100%; padding: 6px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); font-size: 12px;" required>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>
                    <div style="flex: 2;">
                        <input type="text" id="reviewComment" placeholder="Write a comment..." style="width: 100%; padding: 6px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); font-size: 12px; box-sizing: border-box;" required>
                    </div>
                </div>
                <button type="submit" class="btn" style="width: 100%; border-radius: 6px; margin: 0; padding: 8px; font-size: 12.5px;">Submit Review</button>
            </form>
        `;
    } else {
        formHtml = `
            <div style="margin-top: 10px; border-top: 1px solid var(--border-color); padding-top: 8px; text-align: center; font-size: 12.5px;">
                <p style="color: var(--text-muted); margin: 0;">Please <a href="login.html" style="color: var(--primary-color); font-weight: 600; text-decoration: none;">Login</a> to submit a review.</p>
            </div>
        `;
    }

    const borrowButtonText = isIssued ? "Out of Stock (Join Waitlist)" : "Request Physical Issue";
    const borrowButtonDisabledAttr = isIssued ? "disabled style='background:var(--text-muted); cursor:not-allowed; opacity:0.6;'" : "";

    modal.innerHTML = `
        <div class="popup-content" style="position: relative; width: 500px; max-height: 90vh; overflow-y: auto; text-align: center; border-radius:16px; border:1px solid var(--border-color); background:var(--card-bg); color:var(--text-color); padding:25px; box-sizing: border-box; display: flex; flex-direction: column; gap: 15px;">
            <button onclick="closeDetailsModal()" style="position: absolute; top: 12px; right: 15px; background: transparent; border: none; font-size: 24px; color: var(--text-color); cursor: pointer; opacity: 0.7; transition: var(--transition); line-height: 1;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">&times;</button>
            
            <div>
                <h2 style="margin: 0 0 4px 0; font-weight:800; font-size: 20px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${book.name}</h2>
                <p style="color: var(--text-muted); margin: 0 0 12px 0; font-size: 12.5px;">By ${book.author} | Category: ${book.category}</p>
            </div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 10px; text-align: left;">
                <div style="flex: 1; max-width: 110px;">
                    <img src="${book.image}" alt="${book.name}" style="width: 100%; max-height: 140px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); object-fit: cover;">
                </div>
                <div style="flex: 1.5; text-align: left; display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                        <h5 style="font-weight:600; margin: 0 0 4px 0; font-size: 13px;">Availability & Location</h5>
                        <p style="margin: 0 0 4px 0; font-size: 12.5px;">
                            Status: ${isIssued 
                                ? `<strong style="color:#e74c3c;">Out of Stock</strong>` 
                                : `<strong style="color:#27ae60;">Available on Shelf</strong>`}
                        </p>
                        <p style="margin: 0 0 4px 0; font-size: 12.5px;">
                            <strong>Available Copies:</strong> <span style="color:#27ae60; font-weight:700;">${availableCopies}</span> / ${totalCopies} copies
                        </p>
                        <div style="font-size: 15px; color: var(--accent-color); margin: 2px 0;">
                            ${starHtml} <span style="font-size: 12px; color: var(--text-color); font-weight: 600;">(${avgRating}/5)</span>
                        </div>
                    </div>
                    
                    <div style="margin-top: 6px; border-top: 1px solid var(--border-color); padding-top: 6px;">
                        <h5 style="font-weight:600; margin: 0 0 4px 0; font-size: 13px;">Bibliographic Details</h5>
                        <div style="display: grid; grid-template-columns: 1fr; gap: 2px; font-size: 11.5px; line-height: 1.4;">
                            <div><strong>ISBN:</strong> ${book.isbn || 'N/A'}</div>
                            <div><strong>Publisher:</strong> ${book.publisher || 'N/A'}</div>
                            <div><strong>Rack & Shelf:</strong> ${book.rackNo || rack}, ${book.shelfNo || 'Shelf 1'}</div>
                        </div>
                    </div>
                </div>
            </div>

            <button class="access-btn" style="width: 100%; margin-bottom: 10px; padding: 10px 16px; border-radius: 8px; background:var(--accent-color); color: #0f172a; font-weight: 700; font-size: 13px; border: none; cursor: pointer;" ${borrowButtonDisabledAttr} onclick="openBorrowModal('${book.name.replace(/'/g, "\\'")}')">
                ${borrowButtonText}
            </button>

            <div style="text-align: left; border-top: 1px solid var(--border-color); padding-top: 8px;">
                <h5 style="font-weight:600; margin: 0 0 4px 0; font-size: 13px; color: var(--text-color);">Reviews (${reviews.length})</h5>
                <div style="max-height: 55px; overflow-y: auto; margin-top: 4px; padding-right: 5px;">
                    ${reviewsListHtml}
                </div>
            </div>

            ${formHtml}
        </div>
    `;

    document.body.appendChild(modal);

    // Register review form submit handler
    const rForm = document.getElementById("reviewSubmitForm");
    if (rForm) {
        rForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const rating = document.getElementById("reviewRating").value;
            const comment = document.getElementById("reviewComment").value.trim();

            try {
                const response = await fetch(`/api/catalog/${bookId}/review`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        studentName: user,
                        rating: Number(rating),
                        comment: comment
                    })
                });

                const result = await response.json();
                if (response.ok) {
                    alert("Review added successfully!");
                    closeDetailsModal();
                    loadPublicBooks(activeCategory, publicSearchInput ? publicSearchInput.value.trim() : "");
                } else {
                    alert(result.message || "Failed to add review");
                }
            } catch (err) {
                console.error("Error submitting review:", err);
            }
        });
    }
}

/* OPEN CUSTOM BORROW INPUT OVERLAY MODAL */
function openBorrowModal(bookName) {
    const user = localStorage.getItem("user");
    if (!user) {
        closeDetailsModal();
        loginPopup.style.display = "flex";
        return;
    }

    closeDetailsModal(); // Close the details modal

    const borrowModal = document.createElement("div");
    borrowModal.className = "popup show";
    borrowModal.id = "customBorrowRequestModal";
    borrowModal.style.display = "flex";

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    
    const defaultReturn = new Date();
    defaultReturn.setDate(today.getDate() + 14);
    const returnStr = defaultReturn.toISOString().split("T")[0];

    borrowModal.innerHTML = `
        <div class="popup-content" style="width: 450px; text-align: left; border-radius:20px; background:var(--card-bg); color:var(--text-color); padding:30px; border:1px solid var(--border-color);">
            <h3 style="font-weight:800; margin-bottom:10px; display:flex; align-items:center; gap:8px;">
                📖 Issue Book Request
            </h3>
            <p style="font-size:14px; color:var(--text-muted); margin-bottom:20px;">
                Confirm details to send a request for physical pick-up or home delivery from the library counter.
            </p>
            
            <div style="margin-bottom:15px;">
                <label style="display:block; font-size:13.5px; font-weight:600; margin-bottom:5px;">Book Selected</label>
                <input type="text" value="${bookName}" disabled style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-color); font-weight:600;">
            </div>

            <div style="margin-bottom:15px;">
                <label style="display:block; font-size:13.5px; font-weight:600; margin-bottom:5px;">Desired Pick-up Date</label>
                <input type="date" id="borrowPickUpDate" value="${todayStr}" style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--border-color); background:var(--input-bg); color:var(--text-color);">
            </div>

            <div style="margin-bottom:25px;">
                <label style="display:block; font-size:13.5px; font-weight:600; margin-bottom:5px;">Return Deadline Date (14 Days period)</label>
                <input type="date" id="borrowReturnDate" value="${returnStr}" style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-muted);" disabled>
            </div>

            <div style="display:flex; gap:12px;">
                <button class="btn" style="flex:1; border-radius:8px; margin:0;" onclick="submitBorrowRequest('${bookName}')">
                    Submit Request
                </button>
                <button class="close-btn" style="flex:1; border-radius:8px; margin:0; background:rgba(0,0,0,0.05); color:var(--text-color); border:1px solid var(--border-color);" onclick="closeBorrowModal()">
                    Cancel
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(borrowModal);

    // Auto-update return date when pick up date changes
    const pickUpInput = document.getElementById("borrowPickUpDate");
    const returnInput = document.getElementById("borrowReturnDate");
    if (pickUpInput && returnInput) {
        pickUpInput.addEventListener("change", () => {
            const pickDate = new Date(pickUpInput.value);
            if (!isNaN(pickDate.getTime())) {
                const retDate = new Date(pickDate);
                retDate.setDate(pickDate.getDate() + 14);
                returnInput.value = retDate.toISOString().split("T")[0];
            }
        });
    }
}

/* SUBMIT BORROW REQUEST */
async function submitBorrowRequest(bookName) {
    const user = localStorage.getItem("user");
    const pickUpDate = document.getElementById("borrowPickUpDate").value;
    const returnDate = document.getElementById("borrowReturnDate").value;

    if (!pickUpDate || !returnDate) {
        alert("Please select dates correctly.");
        return;
    }

    try {
        const response = await fetch("/api/issues/requests", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                student: user,
                book: bookName,
                date: pickUpDate,
                returnDate: returnDate
            })
        });

        const result = await response.json();

        if (response.ok) {
            showBorrowSuccessPopup(bookName);
            closeBorrowModal();
            loadPublicBooks(activeCategory, publicSearchInput ? publicSearchInput.value.trim() : "");
        } else {
            if (response.status === 400 || (result.message && result.message.includes("limit")) || (result.message && result.message.includes("3 books"))) {
                showLimitWarningPopup(result.message || "You already have issued 3 books. You can issue further after returning old issues.");
            } else {
                alert(result.message || "Failed to submit borrow request");
            }
        }
    } catch (error) {
        console.error("Error submitting borrow request:", error);
        alert("Server connection failed");
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

function closeBorrowModal() {
    const modal = document.getElementById("customBorrowRequestModal");
    if (modal) modal.remove();
}

function closeDetailsModal() {
    const modal = document.getElementById("bookDetailsPopup");
    if (modal) modal.remove();
}

/* PUBLIC ACCESS POPUP */
function closePopup() {
    loginPopup.style.display = "none";
}

/* INITIAL SETUP */
const initialParams = new URLSearchParams(window.location.search);
const initialSearch = initialParams.get("q") || "";
let initialCat = initialParams.get("cat") || "All";

if (initialCat === "Computer") {
    initialCat = "BCA";
} else if (initialCat === "Management") {
    initialCat = "BBA";
}

if (publicSearchInput) {
    publicSearchInput.value = initialSearch;
    const clearBtn = document.getElementById("clearSearchBtn");
    if (clearBtn && initialSearch) {
        clearBtn.style.display = "block";
    }
}

window.API_RESOLVED_PROMISE.then(() => {
    if (initialCat !== "All") {
        filterBooks(initialCat);
    } else {
        loadPublicBooks("All", initialSearch);
    }
});

/* BOOKSTORE CHECKOUT CONTROLLER */
function triggerPurchase(bookTitle, price) {
    const user = localStorage.getItem("user");
    if (!user) {
        if (loginPopup) {
            loginPopup.style.display = "flex";
        } else {
            alert("Please log in first to purchase books!");
        }
        return;
    }

    document.getElementById("checkoutTitle").innerText = "Purchase: " + bookTitle;
    document.getElementById("receiptBookTitle").innerText = bookTitle;
    document.getElementById("checkoutPrice").innerText = "₹" + price;

    // Update UPI QR Code
    const qrImg = document.querySelector("#upiView img");
    if (qrImg) {
        qrImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=zhilibrary@upi%26pn=ZHILibrary%26am=" + price + "%26cu=INR";
    }

    // Reset checkout states
    document.getElementById("cardForm").style.display = "flex";
    document.getElementById("upiView").style.display = "none";
    document.getElementById("payLoader").style.display = "none";
    document.getElementById("successReceipt").style.display = "none";
    document.querySelector("input[name='payMethod'][value='card']").checked = true;

    document.getElementById("checkoutModal").style.display = "flex";
}

function closeCheckout() {
    document.getElementById("checkoutModal").style.display = "none";
}

function togglePayView(method) {
    if (method === "card") {
        document.getElementById("cardForm").style.display = "flex";
        document.getElementById("upiView").style.display = "none";
    } else {
        document.getElementById("cardForm").style.display = "none";
        document.getElementById("upiView").style.display = "flex";
    }
}

function processPayment(e) {
    e.preventDefault();
    document.getElementById("cardForm").style.display = "none";
    document.getElementById("payLoader").style.display = "block";

    setTimeout(() => {
        document.getElementById("payLoader").style.display = "none";
        document.getElementById("successReceipt").style.display = "block";
    }, 2500);
}

function processPaymentDirect() {
    document.getElementById("upiView").style.display = "none";
    document.getElementById("payLoader").style.display = "block";

    setTimeout(() => {
        document.getElementById("payLoader").style.display = "none";
        document.getElementById("successReceipt").style.display = "block";
    }, 2000);
}

function filterSemester() {
    const searchInput = document.getElementById("publicSearchInput");
    loadPublicBooks(activeCategory, searchInput ? searchInput.value.trim() : "");
}
