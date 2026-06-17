const publicBookList = document.getElementById("publicBookList");
const loginPopup = document.getElementById("loginPopup");
const publicSearchInput = document.getElementById("publicSearchInput");

let publicBooks = [];
let activeCategory = "All";

/* DISPLAY BOOKS */
function displayPublicBooks(books) {
    publicBookList.innerHTML = "";

    if (books.length === 0) {
        publicBookList.innerHTML = `
            <div class="book-item" style="grid-column: 1/-1; padding: 40px;">
                <h3>No Books Found</h3>
                <p>Try another category or search query.</p>
            </div>
        `;
        return;
    }

    books.forEach((book) => {
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
            if (i <= roundedRating) {
                starHtml += "⭐";
            } else {
                starHtml += "☆";
            }
        }

        const reviewsText = reviews.length > 0 
            ? `${starHtml} <span style="font-size: 13px; color: var(--text-muted); font-weight: 500;">(${avgRating}/5 - ${reviews.length} reviews)</span>` 
            : `<span style="font-size: 13px; color: var(--text-muted); font-weight: 500;">No reviews yet</span>`;

        publicBookList.innerHTML += `
            <div class="book-item">
                <img src="${book.image}" alt="${book.name}">
                <h3>${book.name}</h3>
                <p>By ${book.author}</p>
                <div style="margin-bottom: 12px;">${reviewsText}</div>
                <button class="access-btn" onclick="openBookDetails('${book.id || book._id}')">
                    Explore & Review
                </button>
            </div>
        `;
    });
}

async function loadPublicBooks(category = "All", searchValue = "") {
    activeCategory = category;

    try {
        const params = new URLSearchParams();

        if (category !== "All") {
            params.set("category", category);
        }

        if (searchValue) {
            params.set("q", searchValue);
        }

        const query = params.toString();
        const url = query ? `/api/catalog?${query}` : "/api/catalog";

        const response = await fetch(url);

        if (!response.ok) {
            const result = await response.json();
            alert(result.message || "Books not loaded");
            return;
        }

        publicBooks = await response.json();
        displayPublicBooks(publicBooks);
    } catch (error) {
        console.error("Error loading public catalog books:", error);
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
    const book = publicBooks.find(b => (b.id || b._id) === bookId);
    if (!book) return;

    const user = localStorage.getItem("user");
    
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
                <div style="background: var(--bg-color); padding: 12px; border-radius: 8px; margin-bottom: 12px; text-align: left; border: 1px solid var(--border-color);">
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

    modal.innerHTML = `
        <div class="popup-content" style="width: 600px; max-height: 90vh; overflow-y: auto; text-align: center;">
            <h2 style="margin-bottom: 6px;">${book.name}</h2>
            <p style="color: var(--text-muted); margin-bottom: 20px;">By ${book.author} | Category: ${book.category}</p>
            
            <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 25px;">
                <div style="flex: 1; min-width: 180px;">
                    <img src="${book.image}" alt="${book.name}" style="width: 100%; max-width: 180px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                </div>
                <div style="flex: 1.5; min-width: 220px; text-align: left;">
                    <h4>Average Rating</h4>
                    <div style="font-size: 24px; color: var(--accent-color); margin: 6px 0;">
                        ${starHtml} <span style="font-size: 16px; color: var(--text-color); font-weight: 600;">(${avgRating}/5)</span>
                    </div>
                    <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">Based on ${reviews.length} ratings</p>
                    <button class="access-btn" style="width: auto; margin-top: 0; padding: 8px 16px; border-radius: 6px;" onclick="borrowBookRequest('${book.name}')">
                        Borrow Request
                    </button>
                </div>
            </div>

            <div style="text-align: left; margin-top: 20px;">
                <h4>Reviews (${reviews.length})</h4>
                <div style="max-height: 250px; overflow-y: auto; margin-top: 10px; padding-right: 5px;">
                    ${reviewsListHtml}
                </div>
            </div>

            ${formHtml}

            <button onclick="closeDetailsModal()" class="close-btn" style="margin-top: 20px; width: 100%; border-radius: 8px;">Close</button>
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
                    // Reload books list
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

/* REQUEST BORROW */
function borrowBookRequest(bookName) {
    const user = localStorage.getItem("user");
    if (!user) {
        closeDetailsModal();
        loginPopup.style.display = "flex";
        return;
    }
    alert(`Borrow Request sent for "${bookName}". Librarian will approve your record shortly!`);
}

function closeDetailsModal() {
    const modal = document.getElementById("bookDetailsPopup");
    if (modal) {
        modal.remove();
    }
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
