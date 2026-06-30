document.addEventListener("DOMContentLoaded", () => {
    initLearningHub();
});

const learningResources = [
    {
        name: "Harvard CS50: Introduction to Computer Science",
        provider: "Harvard University",
        stream: "Computer Science",
        type: "youtube",
        icon: "💻",
        desc: "The world-famous introductory course on computational thinking, data structures, C, Python, SQL, HTML/CSS, and Javascript.",
        link: "https://www.youtube.com/playlist?list=PLhQjrBD253YEykX_xN1L50U6tA4xG9rYF"
    },
    {
        name: "MIT 6.006: Introduction to Algorithms",
        provider: "MIT OpenCourseWare",
        stream: "Computer Science",
        type: "youtube",
        icon: "🧮",
        desc: "High-fidelity lecture series covering algorithm designs, heaps, binary search trees, hashing, sorting, and graph search parameters.",
        link: "https://www.youtube.com/playlist?list=PLUl4u3cNGP61Oq3tWYp6V_F-5jb5L2iHb"
    },
    {
        name: "freeCodeCamp: Full Stack Web Developer Guide",
        provider: "freeCodeCamp",
        stream: "Computer Science",
        type: "youtube",
        icon: "🌐",
        desc: "Thousands of hours of free programming lessons covering HTML, CSS, JavaScript, React, Node.js, databases, and APIs.",
        link: "https://www.youtube.com/c/Freecodecamp"
    },
    {
        name: "W3Schools: Complete Web Reference",
        provider: "W3Schools Org",
        stream: "Computer Science",
        type: "library",
        icon: "💻",
        desc: "Easy, structured coding document references and interactive compiler examples for HTML, CSS, JS, Python, SQL, and PHP.",
        link: "https://www.w3schools.com"
    },
    {
        name: "Stanford Machine Learning (by Andrew Ng)",
        provider: "Stanford Online",
        stream: "Computer Science",
        type: "youtube",
        icon: "🤖",
        desc: "The classic introductory course to machine learning, neural networks, supervised learning models, and algorithm design.",
        link: "https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtTIPoAlj3VyL"
    },
    {
        name: "CrashCourse: Business & Strategic Management",
        provider: "CrashCourse",
        stream: "Business Administration",
        type: "youtube",
        icon: "📈",
        desc: "A lively, visual course introducing strategic business planning, SWOT models, marketing channels, and team operations.",
        link: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtMw5N9H35_6Q_K0vT_J4B1y"
    },
    {
        name: "Khan Academy: Economics & Corporate Finance Hub",
        provider: "Khan Academy",
        stream: "Business Administration",
        type: "library",
        icon: "💵",
        desc: "Clear tutorials on financial markets, supply and demand, accounting methods, taxation, interest rates, and macroeconomics.",
        link: "https://www.khanacademy.org/economics-finance-domain"
    },
    {
        name: "Financial Accounting Tutorials Course",
        provider: "Edspira Accounting",
        stream: "Business Administration",
        type: "youtube",
        icon: "📝",
        desc: "Step-by-step video guides on bookkeeping, general journals, income statements, balances, cash flow, and cost estimation.",
        link: "https://www.youtube.com/playlist?list=PL_KGEFWqEaTBhK1kEbUskDq1-bZis8Vq6"
    },
    {
        name: "MIT 18.06: Linear Algebra Lectures",
        provider: "MIT (Gilbert Strang)",
        stream: "Natural Sciences",
        type: "youtube",
        icon: "📐",
        desc: "Professor Gilbert Strang's world-famous mathematical courses covering matrix equations, vector spaces, and eigenvalues.",
        link: "https://www.youtube.com/playlist?list=PL49CF3715CB72B641"
    },
    {
        name: "arXiv.org Academic Repository",
        provider: "Cornell University",
        stream: "Natural Sciences",
        type: "library",
        icon: "📄",
        desc: "Access over 2 million scientific preprints and peer-reviewed studies in physics, computer science, and quantitative biology.",
        link: "https://arxiv.org"
    },
    {
        name: "MIT OpenCourseWare Portal",
        provider: "MIT OCW Team",
        stream: "Natural Sciences",
        type: "google",
        icon: "⚛",
        desc: "Comprehensive syllabus, lecture notes, exam papers, and video directories for thousands of courses taught at MIT.",
        link: "https://ocw.mit.edu"
    },
    {
        name: "Project Gutenberg: Free Public Domain Books",
        provider: "Gutenberg Org",
        stream: "General Studies",
        type: "library",
        icon: "📚",
        desc: "A catalog of over 70,000+ free digital books. Perfect for reading classics, world histories, philosophy, and classic literature.",
        link: "https://www.gutenberg.org"
    },
    {
        name: "Google Scholar Academic Search",
        provider: "Google Research",
        stream: "General Studies",
        type: "google",
        icon: "🔍",
        desc: "An incredibly powerful search tool targeting academic textbooks, journal articles, citation maps, and university research papers.",
        link: "https://scholar.google.com"
    },
    {
        name: "DOAJ: Directory of Open Access Journals",
        provider: "DOAJ Indexing",
        stream: "General Studies",
        type: "library",
        icon: "🎓",
        desc: "Community-curated search directory listing thousands of peer-reviewed scientific journals with free text accessibility.",
        link: "https://doaj.org"
    },
    {
        name: "Coursera Free Audit Course Finder",
        provider: "Coursera Hub",
        stream: "General Studies",
        type: "google",
        icon: "🏫",
        desc: "Auditable online lecture portal offering syllabus, coding projects, and reading materials from top universities for free.",
        link: "https://www.coursera.org"
    }
];

function initLearningHub() {
    const tabs = document.querySelectorAll("#hubTabs .filter-btn");

    // Initial render
    renderResources("All");

    // Event listeners for tabs
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active classes
            tabs.forEach(t => t.classList.remove("active"));
            
            // Add active class
            tab.classList.add("active");

            const selectedStream = tab.getAttribute("data-stream");
            renderResources(selectedStream);
        });
    });
}

function renderResources(stream = "All") {
    const grid = document.getElementById("resourceGrid");
    if (!grid) return;

    grid.innerHTML = "";

    const filtered = stream === "All"
        ? learningResources
        : learningResources.filter(r => r.stream === stream);

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:50px; color:var(--text-muted);">
                <h3>No Resources Available</h3>
                <p>Try selecting another tab category.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(res => {
        let typeBadgeClass = "youtube";
        let typeText = "Video Course";

        if (res.type === "google") {
            typeBadgeClass = "google";
            typeText = "Research Portal";
        } else if (res.type === "library") {
            typeBadgeClass = "library";
            typeText = "Digital Library";
        }

        grid.innerHTML += `
            <div class="resource-card">
                <div>
                    <div class="resource-header">
                        <span class="resource-icon">${res.icon}</span>
                        <span class="resource-type-badge ${typeBadgeClass}">${typeText}</span>
                    </div>
                    <h3>${res.name}</h3>
                    <p class="provider">Provider: ${res.provider}</p>
                    <p class="desc">${res.desc}</p>
                </div>
                
                <div class="resource-footer">
                    <span class="resource-stream-tag">${res.stream}</span>
                    <a href="${res.link}" target="_blank" class="resource-link">
                        Open Resource
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                    </a>
                </div>
            </div>
        `;
    });
}
