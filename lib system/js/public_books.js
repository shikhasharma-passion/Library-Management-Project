// Intercept and route fetch requests on local files to localhost:3000
const ORIGINAL_FETCH = window.fetch;
window.fetch = function(url, options) {
    const API_BASE_URL = window.location.protocol === "file:" ? "http://localhost:3000" : "";
    if (typeof url === "string" && url.startsWith("/api")) {
        url = API_BASE_URL + url;
    }
    return ORIGINAL_FETCH(url, options);
};

const publicBookList = document.getElementById("publicBookList");
const loginPopup = document.getElementById("loginPopup");
const publicSearchInput = document.getElementById("publicSearchInput");

let publicCatalogBooks = [];
let physicalInventory = [];
let activeCategory = "All";

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
function displayPublicBooks(catalogBooks) {
    publicBookList.innerHTML = "";

    if (catalogBooks.length === 0) {
        publicBookList.innerHTML = `
            <div class="book-item" style="grid-column: 1/-1; padding: 40px; text-align: center;">
                <h3>No Books Found</h3>
                <p>Try another category or search query.</p>
            </div>
        `;
        return;
    }

    catalogBooks.forEach((book) => {
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
        const matchedPhysical = physicalInventory.find(p => p.name.toLowerCase() === book.name.toLowerCase());
        const isIssued = matchedPhysical && matchedPhysical.status === "Issued";
        
        const availabilityBadge = isIssued
            ? `<span style="display:inline-block; font-size:11px; padding:3px 8px; border-radius:12px; background:rgba(231,76,60,0.12); color:#e74c3c; font-weight:600; text-transform:uppercase;">Out of Stock</span>`
            : `<span style="display:inline-block; font-size:11px; padding:3px 8px; border-radius:12px; background:rgba(39,174,96,0.12); color:#27ae60; font-weight:600; text-transform:uppercase;">On Shelf</span>`;

        const rack = getRackLocation(book.category);

        const price = 249 + (book.name.length % 5) * 50;

        publicBookList.innerHTML += `
            <div class="book-item">
                <div style="position: relative; width: 100%; display: flex; justify-content: center;">
                    <img src="${book.image}" alt="${book.name}" onerror="this.src='images/book1 cover.jpg'">
                    <div style="position: absolute; bottom: 10px; right: 10px;">
                        ${availabilityBadge}
                    </div>
                </div>
                <h3>${book.name}</h3>
                <p>By ${book.author}</p>
                <div style="font-size: 13.5px; color: var(--text-muted); margin-bottom: 8px; font-weight: 500;">Loc: <span style="color: var(--text-color); font-weight: 600;">${rack}</span></div>
                <div style="margin-bottom: 15px;">${reviewsText}</div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px;">
                    <button class="access-btn" onclick="openBookDetails('${book.id || book._id}')" style="background: var(--primary-color); margin-top:0;">
                        Details & Issue
                    </button>
                    <button class="access-btn" onclick="triggerPurchase('${book.name.replace(/'/g, "\\'")}', ${price})" style="background: var(--accent-color); color: #0f172a; border-color: var(--accent-color); font-weight:700; margin-top:0;">
                        ₹${price} Buy Copy
                    </button>
                </div>
            </div>
        `;
    });
}

async function loadPublicBooks(category = "All", searchValue = "") {
    activeCategory = category;

    try {
        const params = new URLSearchParams();
        if (category !== "All") params.set("category", category);
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

/* FILTER */
function filterBooks(category) {
    const container = document.getElementById("categoryFilterContainer");
    if (container) {
        const buttons = container.querySelectorAll("button");
        buttons.forEach(btn => {
            const btnText = btn.innerText.trim();
            if (btnText === category) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }
    loadPublicBooks(category, publicSearchInput ? publicSearchInput.value.trim() : "");
}

if (publicSearchInput) {
    publicSearchInput.addEventListener("input", function() {
        loadPublicBooks(activeCategory, publicSearchInput.value.trim());
    });
}

/* OPEN BOOK DETAILS MODAL */
function openBookDetails(bookId) {
    const book = publicCatalogBooks.find(b => (b.id || b._id) === bookId);
    if (!book) return;

    const user = localStorage.getItem("user");
    const matchedPhysical = physicalInventory.find(p => p.name.toLowerCase() === book.name.toLowerCase());
    const isIssued = matchedPhysical && matchedPhysical.status === "Issued";
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
            <form id="reviewSubmitForm" style="margin-top: 25px; border-top: 1px solid var(--border-color); padding-top: 20px; text-align: left;">
                <h4 style="margin-bottom: 12px;">Add Your Review</h4>
                <div style="margin-bottom: 12px;">
                    <label style="display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px;">Rating</label>
                    <select id="reviewRating" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color);" required>
                        <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                        <option value="4">⭐⭐⭐⭐ (4/5)</option>
                        <option value="3">⭐⭐⭐ (3/5)</option>
                        <option value="2">⭐⭐ (2/5)</option>
                        <option value="1">⭐ (1/5)</option>
                    </select>
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px;">Comment</label>
                    <textarea id="reviewComment" placeholder="Write your review here..." style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); height: 80px; resize: none;" required></textarea>
                </div>
                <button type="submit" class="btn" style="width: 100%; border-radius: 8px; margin: 0;">Submit Review</button>
            </form>
        `;
    } else {
        formHtml = `
            <div style="margin-top: 25px; border-top: 1px solid var(--border-color); padding-top: 20px; text-align: center;">
                <p style="color: var(--text-muted); font-size: 14px;">Please <a href="login.html" style="color: var(--primary-color); font-weight: 600; text-decoration: none;">Login</a> to submit a review.</p>
            </div>
        `;
    }

    const borrowButtonText = isIssued ? "Out of Stock (Join Waitlist)" : "Request Physical Issue";
    const borrowButtonDisabledAttr = isIssued ? "disabled style='background:var(--text-muted); cursor:not-allowed; opacity:0.6;'" : "";

    modal.innerHTML = `
        <div class="popup-content" style="width: 600px; max-height: 90vh; overflow-y: auto; text-align: center; border-radius:20px; border:1px solid var(--border-color); background:var(--card-bg); color:var(--text-color); padding:30px;">
            <h2 style="margin-bottom: 6px; font-weight:800;">${book.name}</h2>
            <p style="color: var(--text-muted); margin-bottom: 20px;">By ${book.author} | Category: ${book.category}</p>
            
            <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 25px;">
                <div style="flex: 1; min-width: 180px;">
                    <img src="${book.image}" alt="${book.name}" style="width: 100%; max-width: 180px; border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.12);">
                </div>
                <div style="flex: 1.5; min-width: 220px; text-align: left; display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                        <h4 style="font-weight:600; margin-bottom:8px;">Availability & Location</h4>
                        <p style="margin-bottom: 8px; font-size:14.5px;">
                            Status: ${isIssued 
                                ? `<strong style="color:#e74c3c;">Issued (Checked Out)</strong>` 
                                : `<strong style="color:#27ae60;">Available on Shelf</strong>`}
                        </p>
                        <p style="margin-bottom: 8px; font-size:14.5px;">
                            Shelf Location: <strong style="color:var(--text-color);">${rack}</strong>
                        </p>
                        <div style="font-size: 20px; color: var(--accent-color); margin: 10px 0;">
                            ${starHtml} <span style="font-size: 14px; color: var(--text-color); font-weight: 600;">(${avgRating}/5)</span>
                        </div>
                    </div>
                    <button class="access-btn" style="width: 100%; margin-top: 15px; padding: 10px 16px; border-radius: 8px; background:var(--primary-color);" ${borrowButtonDisabledAttr} onclick="openBorrowModal('${book.name}')">
                        ${borrowButtonText}
                    </button>
                </div>
            </div>

            <div style="text-align: left; margin-top: 20px;">
                <h4 style="font-weight:600; margin-bottom:10px;">Reviews (${reviews.length})</h4>
                <div style="max-height: 200px; overflow-y: auto; margin-top: 10px; padding-right: 5px;">
                    ${reviewsListHtml}
                </div>
            </div>

            ${formHtml}

            <button onclick="closeDetailsModal()" class="close-btn" style="margin-top: 20px; width: 100%; border-radius: 8px; background:rgba(0,0,0,0.05); color:var(--text-color); border:1px solid var(--border-color);">Close Details</button>
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
                Confirm details to send a request for physical pick-up at the campus counter.
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
            alert(`Success! Borrow Request sent for "${bookName}". Keep track of approval on your student dashboard.`);
            closeBorrowModal();
            loadPublicBooks(activeCategory, publicSearchInput ? publicSearchInput.value.trim() : "");
        } else {
            alert(result.message || "Failed to submit borrow request");
        }
    } catch (error) {
        console.error("Error submitting borrow request:", error);
        alert("Server connection failed");
    }
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
const initialCat = initialParams.get("cat") || "All";

if (publicSearchInput) {
    publicSearchInput.value = initialSearch;
}

if (initialCat !== "All") {
    filterBooks(initialCat);
} else {
    loadPublicBooks("All", initialSearch);
}

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
        qrImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=smartlib@upi%26pn=SmartLib%26am=" + price + "%26cu=INR";
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
