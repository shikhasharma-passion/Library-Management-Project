// Global script for public pages (index, all_books, contact, login, register)

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNavbar();
    initMobileMenu();
    initHomeSearch();
});

/* THEME SYSTEM (Light / Dark) */
function initTheme() {
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const currentTheme = localStorage.getItem("theme") || "light";

    // Set initial theme
    if (currentTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        if (themeToggleBtn) themeToggleBtn.innerText = "☀️";
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        if (themeToggleBtn) themeToggleBtn.innerText = "🌙";
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const theme = document.documentElement.getAttribute("data-theme");
            if (theme === "dark") {
                document.documentElement.setAttribute("data-theme", "light");
                localStorage.setItem("theme", "light");
                themeToggleBtn.innerText = "🌙";
            } else {
                document.documentElement.setAttribute("data-theme", "dark");
                localStorage.setItem("theme", "dark");
                themeToggleBtn.innerText = "☀️";
            }
        });
    }
}

/* NAVIGATION UPDATES BASED ON LOGIN STATUS */
function initNavbar() {
    const authLink = document.getElementById("authLink");
    if (!authLink) return;

    const user = localStorage.getItem("user");
    const role = localStorage.getItem("userRole") || "student";

    if (user) {
        // User is logged in
        const dashboardUrl = role === "admin" ? "dashboard.html" : "student_dashboard.html";
        authLink.innerHTML = `
            <a href="${dashboardUrl}" style="font-weight: 600; color: var(--accent-color);">Dashboard</a>
            <span style="color: rgba(255,255,255,0.4); margin: 0 5px;">|</span>
            <a href="logout.html" style="opacity: 0.8;">Logout</a>
        `;
    } else {
        // User is guest
        authLink.innerHTML = `<a href="login.html">Login</a>`;
    }
}

/* MOBILE RESPONSIVE HAMBURGER MENU */
function initMobileMenu() {
    const menuToggleBtn = document.getElementById("menuToggleBtn");
    const navLinks = document.getElementById("navLinks");

    if (menuToggleBtn && navLinks) {
        menuToggleBtn.addEventListener("click", () => {
            navLinks.classList.toggle("open");
            // Toggle hamburger animation
            menuToggleBtn.classList.toggle("active");
            
            // Simple visual hamburger transition
            const spans = menuToggleBtn.querySelectorAll("span");
            if (navLinks.classList.contains("open")) {
                spans[0].style.transform = "rotate(45deg) translate(5px, 6px)";
                spans[1].style.opacity = "0";
                spans[2].style.transform = "rotate(-45deg) translate(5px, -6px)";
            } else {
                spans[0].style.transform = "none";
                spans[1].style.opacity = "1";
                spans[2].style.transform = "none";
            }
        });
    }
}

/* HOMEPAGE BOOK SEARCH DATA & CONTROLLER */
const mockCollegeCatalog = [
    { id: "1", name: "Software Engineering: A Practitioner's Approach", author: "Roger S. Pressman", category: "BCA / MCA", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400" },
    { id: "2", name: "Marketing Management", author: "Philip Kotler", category: "BBA / MBA", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400" },
    { id: "3", name: "Introduction to Algorithms", author: "Thomas H. Cormen", category: "BCA / MCA", image: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=400" },
    { id: "4", name: "Financial Accounting & Analysis", author: "Dr. S. N. Maheshwari", category: "BBA / MBA", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400" },
    { id: "5", name: "Core Java: Volume I", author: "Cay S. Horstmann", category: "BCA / MCA", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400" },
    { id: "6", name: "Organizational Behavior", author: "Stephen P. Robbins", category: "BBA / MBA", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400" },
    { id: "7", name: "Operating System Concepts", author: "Abraham Silberschatz", category: "BCA / MCA", image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400" },
    { id: "8", name: "Database System Concepts", author: "Korth & Silberschatz", category: "BCA / MCA", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400" },
    { id: "9", name: "Computer Networks", author: "Andrew S. Tanenbaum", category: "BCA / MCA", image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400" },
    { id: "10", name: "Business Communication Skills", author: "K.K. Sinha", category: "BBA / MBA", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400" }
];

window.clearHomeSearch = function() {
    const searchSection = document.getElementById("homeSearchResultsSection");
    if (searchSection) searchSection.style.display = "none";
    const input = document.getElementById("homeSearchInput");
    if (input) input.value = "";
};

function initHomeSearch() {
    const homeSearchInput = document.getElementById("homeSearchInput");
    const homeSearchBtn = document.getElementById("homeSearchBtn");
    const resultsSection = document.getElementById("homeSearchResultsSection");
    const resultsContainer = document.getElementById("homeSearchResultsContainer");

    if (!homeSearchInput || !homeSearchBtn || !resultsSection || !resultsContainer) return;

    async function performSearch() {
        const query = homeSearchInput.value.trim().toLowerCase();
        if (!query) {
            resultsSection.style.display = "none";
            return;
        }

        resultsContainer.innerHTML = `
            <div class="book-item" style="grid-column: 1/-1; padding: 40px; text-align: center; width: 100%;">
                <div style="border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid var(--accent-color); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 15px auto;"></div>
                <p>Searching college catalog...</p>
            </div>
        `;
        resultsSection.style.display = "block";
        resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });

        const API_BASE_URL = window.location.protocol === "file:" ? "http://localhost:3000" : "";
        try {
            const [catalogRes, physicalRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/catalog?q=${encodeURIComponent(query)}`),
                fetch(`${API_BASE_URL}/api/books`)
            ]);

            if (!catalogRes.ok || !physicalRes.ok) throw new Error("Offline");

            const catalog = await catalogRes.json();
            const physical = await physicalRes.json();

            renderSearchResults(catalog, physical);
        } catch (err) {
            // Server offline: filter local mock database for seamless simulation experience!
            const filteredCatalog = mockCollegeCatalog.filter(book => 
                book.name.toLowerCase().includes(query) || 
                book.author.toLowerCase().includes(query) || 
                book.category.toLowerCase().includes(query)
            );
            const dummyPhysical = filteredCatalog.map(book => ({ name: book.name, status: "Available" }));
            
            setTimeout(() => {
                renderSearchResults(filteredCatalog, dummyPhysical);
            }, 500);
        }
    }

    function renderSearchResults(catalog, physical) {
        if (catalog.length === 0) {
            resultsContainer.innerHTML = `
                <div class="book-item" style="grid-column: 1/-1; padding: 40px; text-align: center; background: var(--card-bg); border-radius: 20px; border: 1px solid var(--border-color); width: 100%;">
                    <h3>No Campus Books Found</h3>
                    <p>Try searching for "java", "software", "algorithms", or "accounting".</p>
                </div>
            `;
            return;
        }

        let html = "";
        catalog.forEach(book => {
            const copies = physical.filter(p => p.name.toLowerCase() === book.name.toLowerCase());
            const hasAvailable = copies.length > 0 && copies.some(p => p.status === "Available");
            const isOutOfStock = copies.length === 0 || !hasAvailable;
            const availabilityBadge = isOutOfStock
                ? `<span style="display:inline-block; font-size:11px; padding:3px 8px; border-radius:12px; background:rgba(231,76,60,0.12); color:#e74c3c; font-weight:600; text-transform:uppercase;">Out of Stock</span>`
                : `<span style="display:inline-block; font-size:11px; padding:3px 8px; border-radius:12px; background:rgba(39,174,96,0.12); color:#27ae60; font-weight:600; text-transform:uppercase;">On Shelf</span>`;

            // Calculate location rack
            const cat = String(book.category || "").toLowerCase();
            let rack = "Rack GN-03";
            if (cat.includes("bca") || cat.includes("mca") || cat.includes("computer") || cat.includes("software")) {
                rack = "Rack CS-14";
            } else if (cat.includes("bba") || cat.includes("mba") || cat.includes("management") || cat.includes("account")) {
                rack = "Rack MG-03";
            }

            // Fallback image logic
            let fallbackImage = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400';
            if (cat.includes("operating") || cat.includes("systems") || cat.includes("algorithm") || cat.includes("coding")) {
                fallbackImage = 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400';
            }

            const reviews = book.reviews || [];
            let starHtml = "⭐⭐⭐⭐☆";
            if (reviews.length > 0) {
                const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
                starHtml = "";
                for (let i = 1; i <= 5; i++) {
                    starHtml += (i <= Math.round(avg)) ? "⭐" : "☆";
                }
            }

            html += `
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
                    <div style="margin-bottom: 15px;">${starHtml}</div>
                    <div style="display:grid; grid-template-columns:1fr; gap:10px; margin-top:8px;">
                        <button class="access-btn" onclick="window.location.href='all_books.html?q=${encodeURIComponent(book.name)}'" style="background: var(--primary-color); margin-top:0; width:100%;">
                            Request Issue / Details
                        </button>
                    </div>
                </div>
            `;
        });

        resultsContainer.innerHTML = html;
    }

    homeSearchBtn.addEventListener("click", performSearch);
    homeSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") performSearch();
    });
}

/* GLOBAL SHOPPING CART SYSTEM */
let cartItems = [];

function initShoppingCart() {
    // 1. Inject sliding drawer HTML to body
    const drawerHtml = `
        <div id="cartDrawer" style="display:none; position:fixed; top:0; right:0; width:380px; height:100vh; background:var(--card-bg); border-left:1px solid var(--border-color); box-shadow:-10px 0 30px rgba(0,0,0,0.15); z-index:99999; flex-direction:column; padding:25px; box-sizing:border-box; transition: transform 0.3s ease;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid var(--border-color); padding-bottom:15px;">
                <h3 style="margin:0; font-size:20px; font-weight:700; color:var(--text-color); display:flex; align-items:center; gap:8px;">🛒 Shopping Cart</h3>
                <button onclick="toggleCartDrawer()" style="background:transparent; border:none; color:var(--text-color); font-size:26px; cursor:pointer;">&times;</button>
            </div>
            <div id="cartItemsList" style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:15px; margin-bottom:20px;">
                <p id="emptyCartText" style="text-align:center; color:var(--text-muted); padding-top:40px;">Your cart is empty.</p>
            </div>
            <div style="border-top:1px solid var(--border-color); padding-top:15px;">
                <div style="display:flex; justify-content:space-between; font-weight:700; font-size:16px; margin-bottom:20px; color:var(--text-color);">
                    <span>Subtotal:</span>
                    <span id="cartSubtotal">₹0</span>
                </div>
                <button onclick="triggerCartCheckout()" style="width:100%; padding:14px 0; border:none; border-radius:8px; background:var(--primary-color); color:#fff; font-weight:700; cursor:pointer; font-size:14.5px; transition:all 0.2s;">
                    Proceed to Checkout
                </button>
            </div>
        </div>
        <div id="cartDrawerOverlay" onclick="toggleCartDrawer()" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.4); backdrop-filter:blur(4px); z-index:99998;"></div>
    `;

    // 2. Inject checkout modal HTML to body
    const checkoutModalHtml = `
        <div id="globalCheckoutModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.85); backdrop-filter:blur(8px); z-index:999999; justify-content:center; align-items:center; padding:20px;">
            <div style="background:var(--card-bg); border:1px solid var(--border-color); color:var(--text-color); width:100%; max-width:480px; padding:35px; border-radius:20px; box-shadow:0 25px 50px rgba(0,0,0,0.3); max-height:90vh; overflow-y:auto; position:relative;">
                <button onclick="closeGlobalCheckout()" style="position:absolute; top:20px; right:20px; background:transparent; border:none; color:var(--text-color); font-size:24px; cursor:pointer;">&times;</button>
                <h2 id="globalCheckoutTitle" style="font-size:22px; font-weight:800; color:var(--accent-color); margin-bottom:5px;">Secure Checkout</h2>
                <p style="font-size:13.5px; color:var(--text-muted); margin-bottom:20px;">Enter your details to process transaction securely.</p>
                
                <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color); padding:15px; border-radius:10px; display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                    <span style="font-weight:600; font-size:14px; color:var(--text-color);">Total Amount Due:</span>
                    <span id="globalCheckoutPrice" style="font-size:18px; font-weight:800; color:var(--accent-color);">₹0</span>
                </div>

                <!-- PAYMENT OPTIONS -->
                <div style="display:flex; justify-content:center; gap:20px; margin-bottom:25px;">
                    <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:600; font-size:14px; color:var(--text-color);">
                        <input type="radio" name="globalPayMethod" value="card" checked onclick="toggleGlobalPayView('card')"> 💳 Credit/Debit Card
                    </label>
                    <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:600; font-size:14px; color:var(--text-color);">
                        <input type="radio" name="globalPayMethod" value="upi" onclick="toggleGlobalPayView('upi')"> 📱 UPI Scanner
                    </label>
                </div>

                <!-- CARD FORM -->
                <form id="globalCardForm" onsubmit="processGlobalPayment(event)" style="display:flex; flex-direction:column; gap:12px;">
                    <input type="text" placeholder="Cardholder Name" required style="padding:12px; border:1px solid var(--border-color); border-radius:8px; background:var(--card-bg); color:var(--text-color);">
                    <input type="text" placeholder="Card Number (XXXX-XXXX-XXXX-XXXX)" required pattern="\\d{4}-\\d{4}-\\d{4}-\\d{4}" title="Please match card format 1234-5678-9012-3456" style="padding:12px; border:1px solid var(--border-color); border-radius:8px; background:var(--card-bg); color:var(--text-color);">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                        <input type="text" placeholder="MM/YY" required pattern="\\d{2}/\\d{2}" title="Expiry MM/YY" style="padding:12px; border:1px solid var(--border-color); border-radius:8px; background:var(--card-bg); color:var(--text-color);">
                        <input type="password" placeholder="CVV" required pattern="\\d{3}" title="3-digit CVV" style="padding:12px; border:1px solid var(--border-color); border-radius:8px; background:var(--card-bg); color:var(--text-color);">
                    </div>
                    <button type="submit" style="width:100%; border:none; padding:12px 0; border-radius:8px; background:var(--primary-color); color:#fff; font-weight:700; cursor:pointer; font-size:14px;">Authorize Payment & Place Order</button>
                </form>

                <!-- UPI VIEW -->
                <div id="globalUpiView" style="display:none; text-align:center; flex-direction:column; align-items:center; gap:15px;">
                    <p style="font-size:13px; color:var(--text-muted);">Scan this QR Code with BHIM, GooglePay, PhonePe or Paytm to pay instantly.</p>
                    <div style="background:#ffffff; padding:15px; border-radius:12px; display:inline-block; border:2px solid var(--accent-color);">
                        <img id="globalUpiQr" src="" alt="UPI QR Code" style="display:block; width:150px; height:150px;">
                    </div>
                    <button onclick="processGlobalPaymentDirect()" style="width:100%; border:none; padding:12px 0; border-radius:8px; background:var(--primary-color); color:#fff; font-weight:700; cursor:pointer; font-size:14px;">I Have Paid / Confirm Payment</button>
                </div>

                <!-- LOADER -->
                <div id="globalPayLoader" style="display:none; text-align:center; padding:30px 0;">
                    <div style="border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid var(--accent-color); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 15px auto;"></div>
                    <p style="font-size:13.5px; font-weight:600; color:var(--text-color);">Securing payment connection. Please do not close...</p>
                </div>

                <!-- SUCCESS receipt -->
                <div id="globalSuccessReceipt" style="display:none; text-align:center; padding:10px 0;">
                    <span style="font-size:48px;">🎉</span>
                    <h3 style="color:#10b981; font-size:20px; font-weight:800; margin:10px 0 5px 0;">Order Placed Successfully!</h3>
                    <p style="font-size:13.5px; color:var(--text-color); margin-bottom:5px;">Receipt: <span style="font-weight:700; color:var(--accent-color);" id="globalReceiptId">#ORD-9481</span></p>
                    <p style="font-size:13px; color:var(--text-muted); margin-bottom:20px;">A shipment copy has been ordered for your campus library account.</p>
                    <button onclick="closeGlobalCheckout()" style="width:100%; border:none; padding:12px 0; border-radius:8px; background:var(--primary-color); color:#fff; font-weight:700; cursor:pointer;">Done</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", drawerHtml);
    document.body.insertAdjacentHTML("beforeend", checkoutModalHtml);

    // 3. Inject Cart Item in Navbar
    const navLinks = document.getElementById("navLinks");
    if (navLinks) {
        // Insert Cart link right before the auth/login link
        const authLi = document.getElementById("authLink");
        const cartLi = `
            <li style="position:relative;">
                <a href="#" onclick="toggleCartDrawer(); return false;" id="cartNavLink" style="display:flex; align-items:center; gap:6px;">
                    🛒 Cart <span id="cartCountBadge" style="background:var(--accent-color); color:#0f172a; padding:1px 6px; border-radius:50%; font-size:11px; font-weight:700; display:none;">0</span>
                </a>
            </li>
        `;
        if (authLi) {
            authLi.insertAdjacentHTML("beforebegin", cartLi);
        } else {
            navLinks.insertAdjacentHTML("beforeend", cartLi);
        }
    }

    // 4. Load initial cart state
    try {
        cartItems = JSON.parse(localStorage.getItem("smartCart")) || [];
    } catch(e) {
        cartItems = [];
    }
    updateCartUI();
}

function toggleCartDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartDrawerOverlay");
    if (!drawer) return;

    if (drawer.style.display === "none" || drawer.style.display === "") {
        drawer.style.display = "flex";
        overlay.style.display = "block";
    } else {
        drawer.style.display = "none";
        overlay.style.display = "none";
    }
}

function addToCart(title, price, image) {
    cartItems.push({ title, price, image });
    localStorage.setItem("smartCart", JSON.stringify(cartItems));
    updateCartUI();
    
    // Automatically open drawer to show item added
    const drawer = document.getElementById("cartDrawer");
    if (drawer && drawer.style.display === "none") {
        toggleCartDrawer();
    }
}

function removeFromCart(index) {
    cartItems.splice(index, 1);
    localStorage.setItem("smartCart", JSON.stringify(cartItems));
    updateCartUI();
}

function updateCartUI() {
    const list = document.getElementById("cartItemsList");
    const countBadge = document.getElementById("cartCountBadge");
    const subtotalText = document.getElementById("cartSubtotal");
    
    if (!list) return;

    list.innerHTML = "";
    let subtotal = 0;

    if (cartItems.length === 0) {
        list.innerHTML = `<p id="emptyCartText" style="text-align:center; color:var(--text-muted); padding-top:40px;">Your cart is empty.</p>`;
        if (countBadge) countBadge.style.display = "none";
        if (subtotalText) subtotalText.innerText = "₹0";
        return;
    }

    // Update count badge
    if (countBadge) {
        countBadge.innerText = cartItems.length;
        countBadge.style.display = "inline-block";
    }

    cartItems.forEach((item, index) => {
        subtotal += item.price;
        list.innerHTML += `
            <div style="display:flex; gap:12px; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
                <img src="${item.image}" alt="${item.title}" onerror="this.src='images/book1 cover.jpg'" style="width:50px; height:65px; object-fit:cover; border-radius:6px;">
                <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
                    <span style="font-size:13.5px; font-weight:600; color:var(--text-color); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; line-height:1.4;">${item.title}</span>
                    <span style="font-size:13px; font-weight:700; color:var(--accent-color);">₹${item.price}</span>
                </div>
                <button onclick="removeFromCart(${index})" style="background:transparent; border:none; color:#ef4444; font-size:18px; cursor:pointer; padding:5px;">&times;</button>
            </div>
        `;
    });

    if (subtotalText) subtotalText.innerText = "₹" + subtotal;
}

function triggerCartCheckout() {
    const user = localStorage.getItem("user");
    if (!user) {
        alert("Please log in first to purchase books!");
        window.location.href = "login.html";
        return;
    }

    if (cartItems.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    toggleCartDrawer();

    let subtotal = 0;
    cartItems.forEach(item => subtotal += item.price);

    document.getElementById("globalCheckoutTitle").innerText = `Purchase: ${cartItems.length} Books`;
    document.getElementById("globalCheckoutPrice").innerText = "₹" + subtotal;
    document.getElementById("globalUpiQr").src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=zhilibrary@upi%26pn=ZHILibrary%26am=${subtotal}%26cu=INR`;

    // Reset payment states
    document.getElementById("globalCardForm").style.display = "flex";
    document.getElementById("globalUpiView").style.display = "none";
    document.getElementById("globalPayLoader").style.display = "none";
    document.getElementById("globalSuccessReceipt").style.display = "none";
    document.querySelector("input[name='globalPayMethod'][value='card']").checked = true;

    document.getElementById("globalCheckoutModal").style.display = "flex";
}

function closeGlobalCheckout() {
    document.getElementById("globalCheckoutModal").style.display = "none";
}

function toggleGlobalPayView(method) {
    if (method === "card") {
        document.getElementById("globalCardForm").style.display = "flex";
        document.getElementById("globalUpiView").style.display = "none";
    } else {
        document.getElementById("globalCardForm").style.display = "none";
        document.getElementById("globalUpiView").style.display = "flex";
    }
}

function processGlobalPayment(e) {
    e.preventDefault();
    document.getElementById("globalCardForm").style.display = "none";
    document.getElementById("globalPayLoader").style.display = "block";

    setTimeout(() => {
        // Clear cart
        cartItems = [];
        localStorage.setItem("smartCart", JSON.stringify(cartItems));
        updateCartUI();

        document.getElementById("globalReceiptId").innerText = "#ORD-" + Math.floor(100000 + Math.random() * 900000);
        document.getElementById("globalPayLoader").style.display = "none";
        document.getElementById("globalSuccessReceipt").style.display = "block";
    }, 2500);
}

function processGlobalPaymentDirect() {
    document.getElementById("globalUpiView").style.display = "none";
    document.getElementById("globalPayLoader").style.display = "block";

    setTimeout(() => {
        // Clear cart
        cartItems = [];
        localStorage.setItem("smartCart", JSON.stringify(cartItems));
        updateCartUI();

        document.getElementById("globalReceiptId").innerText = "#ORD-" + Math.floor(100000 + Math.random() * 900000);
        document.getElementById("globalPayLoader").style.display = "none";
        document.getElementById("globalSuccessReceipt").style.display = "block";
    }, 2000);
}
