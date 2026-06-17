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

/* HOMEPAGE BOOK SEARCH */
function initHomeSearch() {
    const homeSearchInput = document.getElementById("homeSearchInput");
    const homeSearchBtn = document.getElementById("homeSearchBtn");

    if (!homeSearchInput || !homeSearchBtn) return;

    function goToBookSearch() {
        const query = homeSearchInput.value.trim();
        if (query) {
            window.location.href = `all_books.html?q=${encodeURIComponent(query)}`;
        } else {
            window.location.href = "all_books.html";
        }
    }

    homeSearchBtn.addEventListener("click", goToBookSearch);
    homeSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            goToBookSearch();
        }
    });
}
