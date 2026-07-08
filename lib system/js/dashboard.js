// Intercept and route fetch requests on local files to localhost:3000
const ORIGINAL_FETCH = window.fetch;
window.fetch = function(url, options) {
    const API_BASE_URL = window.location.protocol === "file:" ? "http://localhost:3000" : "";
    if (typeof url === "string" && url.startsWith("/api")) {
        url = API_BASE_URL + url;
    }
    return ORIGINAL_FETCH(url, options);
};

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
                      !msgLower.includes("reject") && 
                      !msgLower.includes("limit") && 
                      !msgLower.includes("offline");

    const icon = isSuccess ? "✔️" : "⚠️";
    const color = isSuccess ? "#10b981" : "#ef4444";
    const title = isSuccess ? "Action Successful" : "System Warning";

    overlay.innerHTML = `
        <div style="width: 350px; background: var(--card-bg); border: 2.5px solid ${color}; border-radius: 16px; padding: 25px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); text-align: center; display: flex; flex-direction: column; justify-content: space-between; gap: 15px; animation: popupScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); box-sizing: border-box;">
            <div>
                <div style="font-size: 40px; margin-bottom: 8px;">${icon}</div>
                <h3 style="font-family: 'Montserrat', sans-serif; font-size: 17px; font-weight: 800; color: ${color}; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">${title}</h3>
                <p style="font-family: 'Inter', sans-serif; font-size: 13.5px; color: var(--text-color); line-height: 1.5; margin: 0; font-weight: 500;">
                    ${message}
                </p>
            </div>
            <button onclick="document.getElementById('customAlertOverlay').remove()" style="width: 100%; padding: 12px; border-radius: 8px; background: ${color}; color: #fff; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 13px; border: none; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.filter='brightness(0.9)';" onmouseout="this.style.filter='none';">
                Close Window
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
};

let libraryChart;
let categoriesChart;

document.addEventListener("DOMContentLoaded", () => {
    initDashboardTheme();
    loadDashboard();
    loadContacts();
    loadBorrowRequests();
    loadExtensionRequests();
    loadSuggestions();
    loadFines();
    loadOrdersTracker();
    loadRecentStudentsAndActivity();
});

/* THEME SYSTEM (Persistent across Admin Pages) */
function initDashboardTheme() {
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
            updateChartThemes();
        });
    }
}

/* RECENT ISSUED TABLE RENDERING */
function renderRecentIssuedBooks(records) {
    const table = document.getElementById("recentIssuedTable");
    if (!table) return;

    table.innerHTML = `
        <tr>
            <th>Student Name</th>
            <th>Book Title</th>
            <th>Issue Date</th>
            <th>Return Date</th>
            <th>Status</th>
            <th>Issue Source</th>
            <th>Action</th>
        </tr>
    `;

    if (records.length === 0) {
        table.innerHTML += `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 15px;">No active issued books found</td>
            </tr>
        `;
        return;
    }

    records.forEach((record) => {
        let statusClass = "active";
        if (record.status === "Overdue") {
            statusClass = "overdue";
        } else if (record.status === "Returned") {
            statusClass = "returned";
        }

        const sourceBadge = record.issueType === "Admin Manual"
            ? `<span style="display:inline-block; font-size:11px; padding:3px 8px; border-radius:12px; background:rgba(217, 119, 6, 0.12); color:#d97706; font-weight:600;">Admin Manual</span>`
            : `<span style="display:inline-block; font-size:11px; padding:3px 8px; border-radius:12px; background:rgba(56, 189, 248, 0.12); color:#0284c7; font-weight:600;">Student Online</span>`;

        const actionHtml = record.status === "Returned"
            ? `<span style="font-size:12.5px; color:var(--text-muted); font-style:italic;">✔️ Cleared</span>`
            : `<button onclick="returnBook('${record.id}')" class="delete-btn" style="margin-top:0; padding:6px 12px; font-size:12px; cursor:pointer;">↩️ Return Book</button>`;

        table.innerHTML += `
            <tr>
                <td><strong>${record.student}</strong></td>
                <td>${record.book}</td>
                <td>${record.date}</td>
                <td>${record.returnDate}</td>
                <td><span class="status-badge ${statusClass}">${record.status}</span></td>
                <td>${sourceBadge}</td>
                <td>${actionHtml}</td>
            </tr>
        `;
    });
}

/* LOAD DASHBOARD METRICS AND CHARTS */
async function loadDashboard() {
    try {
        const response = await fetch("/api/stats");
        const stats = await response.json();

        document.getElementById("totalBooks").innerText = stats.totalBooks;
        document.getElementById("totalStudents").innerText = stats.totalStudents;
        document.getElementById("issuedBooks").innerText = stats.issuedBooks;
        document.getElementById("pendingBooks").innerText = stats.pendingBooks; // Overdue Count

        renderRecentIssuedBooks(stats.recentIssuedBooks || []);

        renderAnalyticsCharts(stats);
    } catch (error) {
        console.error("Error loading dashboard data:", error);
    }
}

/* RENDER CHARTS */
function renderAnalyticsCharts(stats) {
    const isDark = document.body.classList.contains("dark-mode");
    const textColor = isDark ? "#f4f7fb" : "#2c3e50";
    const gridColor = isDark ? "#243347" : "#e2e8f0";

    // Chart 1: Bar Chart
    const ctx1 = document.getElementById("libraryChart");
    if (ctx1) {
        if (libraryChart) libraryChart.destroy();
        libraryChart = new Chart(ctx1, {
            type: "bar",
            data: {
                labels: ["Books Available", "No. of Students", "Issued Books", "Overdue Returns"],
                datasets: [{
                    label: "Library Activity",
                    data: [stats.totalBooks, stats.totalStudents, stats.issuedBooks, stats.pendingBooks],
                    backgroundColor: [
                        isDark ? "#6366f1" : "#4f46e5", // Indigo (Books Available)
                        isDark ? "#10b981" : "#059669", // Emerald Green (No. of Students)
                        isDark ? "#06b6d4" : "#0891b2", // Cyan Blue (Issued Books)
                        isDark ? "#f43f5e" : "#e11d48"  // Rose Red (Overdue Returns)
                    ],
                    borderWidth: 0,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { padding: 12 }
                },
                scales: {
                    x: {
                        ticks: { color: textColor },
                        grid: { display: false }
                    },
                    y: {
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    }
                }
            }
        });
    }

    // Chart 2: Doughnut Chart (Book Categories)
    const ctx2 = document.getElementById("categoriesChart");
    if (ctx2) {
        if (categoriesChart) categoriesChart.destroy();
        
        const catData = stats.categories || [];
        const labels = catData.map(c => {
            const cat = String(c.category || "").trim();
            return cat === "Compet" ? "Competitive" : cat;
        });
        const counts = catData.map(c => c.count);

        // Dynamic category color scheme for premium aesthetics
        const categoryColors = {
            "BBA": "#ec4899",             // Pink highlight for BBA as requested!
            "MBA": "#8b5cf6",             // Purple
            "BCA": "#10b981",             // Emerald Green
            "MCA": "#3b82f6",             // Vibrant Blue
            "Competitive": "#f59e0b",     // Golden Amber
            "Compet": "#f59e0b"
        };
        const defaultChartPalette = ["#ff6b6b", "#06b6d4", "#f97316", "#14b8a6", "#a855f7", "#6366f1"];
        const bgColors = labels.map((label, idx) => {
            if (categoryColors[label]) return categoryColors[label];
            return defaultChartPalette[idx % defaultChartPalette.length];
        });

        categoriesChart = new Chart(ctx2, {
            type: "doughnut",
            data: {
                labels: labels.length > 0 ? labels : ["Empty"],
                datasets: [{
                    data: counts.length > 0 ? counts : [0],
                    backgroundColor: bgColors,
                    borderWidth: isDark ? 2 : 1,
                    borderColor: isDark ? "#0f172a" : "#ffffff"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "right",
                        labels: { color: textColor, padding: 15 }
                    }
                }
            }
        });
    }
}

/* UPDATE CHART COLORS DYNAMICALLY ON MODE CHANGE */
function updateChartThemes() {
    if (libraryChart || categoriesChart) {
        loadDashboard();
    }
}

/* USER CONTACT MESSAGES MANAGEMENT */
async function loadContacts() {
    const table = document.getElementById("contactsTable");
    if (!table) return;

    table.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Date</th>
            <th>Action</th>
        </tr>
    `;

    try {
        const response = await fetch("/api/contact");
        if (!response.ok) return;
        const contacts = await response.json();
        const sortedContacts = [...contacts].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA;
        });

        if (sortedContacts.length === 0) {
            table.innerHTML += `
                <tr>
                    <td colspan="5" style="text-align: center; color: var(--text-muted);">No messages found</td>
                </tr>
            `;
            return;
        }

        sortedContacts.forEach(msg => {
            const formattedDate = new Date(msg.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });

            table.innerHTML += `
                <tr>
                    <td><strong>${msg.name}</strong></td>
                    <td><a href="mailto:${msg.email}" style="color: var(--primary-color); text-decoration: none;">${msg.email}</a></td>
                    <td><span style="font-size: 14px;">${msg.message}</span></td>
                    <td>${formattedDate}</td>
                    <td>
                        <button class="delete-btn" style="margin-top: 0;" onclick="deleteContact('${msg.id}')">
                            Resolve / Delete
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading contact messages:", error);
    }
}

/* DELETE CONTACT */
async function deleteContact(id) {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
        const response = await fetch(`/api/contact/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            loadContacts();
        } else {
            alert("Failed to delete contact message");
        }
    } catch (error) {
        console.error("Error deleting contact message:", error);
    }
}

/* BORROW REQUESTS WORKFLOW */
async function loadBorrowRequests() {
    const table = document.getElementById("borrowRequestsTable");
    if (!table) return;

    table.innerHTML = `
        <tr>
            <th>Student Name</th>
            <th>Book Title</th>
            <th>Request Date</th>
            <th>Return Deadline</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>
    `;

    try {
        const response = await fetch("/api/issues/requests");
        if (!response.ok) return;
        const requests = await response.json();
        const sortedRequests = [...requests].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA;
        });

        // Filter to only show Pending requests in the main action list, or show all with status badges
        if (sortedRequests.length === 0) {
            table.innerHTML += `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--text-muted);">No borrow requests found</td>
                </tr>
            `;
            return;
        }

        sortedRequests.forEach(req => {
            let statusClass = "active";
            if (req.status === "Rejected") statusClass = "overdue";
            if (req.status === "Approved") statusClass = "returned";

            let actionsHtml = "";
            if (req.status === "Pending") {
                actionsHtml = `
                    <div style="display: flex; gap: 10px;">
                        <button class="action-btn" style="margin-top: 0; padding: 6px 12px; font-size: 13px;" onclick="approveBorrowRequest('${req.id || req._id}')">
                            Approve
                        </button>
                        <button class="delete-btn" style="margin-top: 0; padding: 6px 12px; font-size: 13px;" onclick="rejectBorrowRequest('${req.id || req._id}')">
                            Reject
                        </button>
                    </div>
                `;
            } else {
                actionsHtml = `<span style="font-size: 13px; color: var(--text-muted);">Processed</span>`;
            }

            table.innerHTML += `
                <tr>
                    <td><strong>${req.student}</strong></td>
                    <td>${req.book}</td>
                    <td>${req.requestDate}</td>
                    <td>${req.returnDate}</td>
                    <td><span class="status-badge ${statusClass}">${req.status}</span></td>
                    <td>${actionsHtml}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading borrow requests:", error);
    }
}

async function approveBorrowRequest(id) {
    if (!confirm("Approve this borrow request and issue the book?")) return;

    try {
        const response = await fetch(`/api/issues/requests/${id}/approve`, {
            method: "PUT"
        });

        const result = await response.json();
        if (response.ok) {
            alert("Request approved successfully!");
            loadBorrowRequests();
            loadDashboard(); // Refresh stats & issue tables
        } else {
            alert(result.message || "Failed to approve request");
        }
    } catch (error) {
        console.error("Error approving request:", error);
    }
}

async function rejectBorrowRequest(id) {
    if (!confirm("Are you sure you want to reject this request?")) return;

    try {
        const response = await fetch(`/api/issues/requests/${id}/reject`, {
            method: "PUT"
        });

        const result = await response.json();
        if (response.ok) {
            alert("Request rejected.");
            loadBorrowRequests();
        } else {
            alert(result.message || "Failed to reject request");
        }
    } catch (error) {
        console.error("Error rejecting request:", error);
    }
}

/* RETURN EXTENSIONS WORKFLOW */
async function loadExtensionRequests() {
    const table = document.getElementById("extensionRequestsTable");
    if (!table) return;

    table.innerHTML = `
        <tr>
            <th>Student Name</th>
            <th>Book Title</th>
            <th>Current Deadline</th>
            <th>Requested Deadline</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>
    `;

    try {
        const response = await fetch("/api/issues/extensions/list");
        if (!response.ok) return;
        const requests = await response.json();
        const sortedRequests = [...requests].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA;
        });

        if (sortedRequests.length === 0) {
            table.innerHTML += `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--text-muted);">No extension requests found</td>
                </tr>
            `;
            return;
        }

        sortedRequests.forEach(req => {
            let statusClass = "active";
            if (req.status === "Rejected") statusClass = "overdue";
            if (req.status === "Approved") statusClass = "returned";

            let actionsHtml = "";
            if (req.status === "Pending") {
                actionsHtml = `
                    <div style="display: flex; gap: 10px;">
                        <button class="action-btn" style="margin-top: 0; padding: 6px 12px; font-size: 13px;" onclick="approveExtensionRequest('${req.id || req._id}')">
                            Approve
                        </button>
                        <button class="delete-btn" style="margin-top: 0; padding: 6px 12px; font-size: 13px;" onclick="rejectExtensionRequest('${req.id || req._id}')">
                            Reject
                        </button>
                    </div>
                `;
            } else {
                actionsHtml = `<span style="font-size: 13px; color: var(--text-muted);">Processed</span>`;
            }

            table.innerHTML += `
                <tr>
                    <td><strong>${req.student}</strong></td>
                    <td>${req.book}</td>
                    <td>${req.currentReturnDate}</td>
                    <td>${req.requestedReturnDate}</td>
                    <td><span class="status-badge ${statusClass}">${req.status}</span></td>
                    <td>${actionsHtml}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading extension requests:", error);
    }
}

async function approveExtensionRequest(id) {
    if (!confirm("Approve this return date extension request?")) return;

    try {
        const response = await fetch(`/api/issues/extensions/${id}/approve`, {
            method: "PUT"
        });

        const result = await response.json();
        if (response.ok) {
            alert("Extension request approved!");
            loadExtensionRequests();
            loadDashboard(); // Refresh metrics and issued list
        } else {
            alert(result.message || "Failed to approve extension request");
        }
    } catch (error) {
        console.error("Error approving extension request:", error);
    }
}

async function rejectExtensionRequest(id) {
    if (!confirm("Are you sure you want to reject this extension request?")) return;

    try {
        const response = await fetch(`/api/issues/extensions/${id}/reject`, {
            method: "PUT"
        });

        const result = await response.json();
        if (response.ok) {
            alert("Extension request rejected.");
            loadExtensionRequests();
        } else {
            alert(result.message || "Failed to reject extension request");
        }
    } catch (error) {
        console.error("Error rejecting extension request:", error);
    }
}

async function loadSuggestions() {
    const tbody = document.getElementById("suggestionsBody");
    if (!tbody) return;

    try {
        const response = await fetch("/api/suggestions");
        if (!response.ok) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Failed to load suggestions</td></tr>`;
            return;
        }
        const suggestions = await response.json();
        if (suggestions.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding: 15px;">No book suggestions from users yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = suggestions.map(item => {
            let badgeColor = "orange";
            if (item.status.includes("Way")) badgeColor = "#3b82f6";
            else if (item.status.includes("Added")) badgeColor = "#10b981";
            else if (item.status === "Refused") badgeColor = "#ef4444";

            let actionsHtml = "";
            if (item.status === "Pending" || item.status.includes("Way")) {
                actionsHtml = `
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <button onclick="updateSuggestion('${item._id || item.id}', 'Accepted - On the Way')" class="action-btn" style="margin-top:0; padding:6px 12px; font-size:12px; background:#3b82f6; color:#fff; border:none; border-radius:6px; cursor:pointer;">
                            🚚 On the Way
                        </button>
                        <button onclick="updateSuggestion('${item._id || item.id}', 'Accepted - Added')" class="action-btn" style="margin-top:0; padding:6px 12px; font-size:12px; background:#10b981; color:#fff; border:none; border-radius:6px; cursor:pointer;">
                            ✔️ Add to Catalog
                        </button>
                        <button onclick="updateSuggestion('${item._id || item.id}', 'Refused')" class="delete-btn" style="margin-top:0; padding:6px 12px; font-size:12px; background:#ef4444; color:#fff; border:none; border-radius:6px; cursor:pointer;">
                            ❌ Refuse
                        </button>
                    </div>
                `;
            } else {
                actionsHtml = `<span style="font-size:12px; color:var(--text-muted); font-style:italic;">No actions (Finished)</span>`;
            }

            const formattedDate = item.createdAt 
                ? new Date(item.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                : "04 Jul 2026";

            return `
                <tr>
                    <td><strong>${item.student}</strong></td>
                    <td>${item.bookTitle}</td>
                    <td>${item.bookAuthor}</td>
                    <td>${item.category}</td>
                    <td>${formattedDate}</td>
                    <td>
                        <span style="padding:4px 8px; border-radius:12px; font-size:11px; font-weight:600; background:rgba(0,0,0,0.03); color:${badgeColor}; border:1px solid ${badgeColor}; white-space:nowrap;">
                            ${item.status}
                        </span>
                    </td>
                    <td>
                        ${actionsHtml}
                        <div style="font-size:12px; margin-top:5px; color:var(--text-muted);">
                            <strong>Note:</strong> ${item.adminNotes || "None"}
                        </div>
                    </td>
                </tr>
            `;
        }).join("");
    } catch (error) {
        console.error("Error loading suggestions:", error);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Server error</td></tr>`;
    }
}

async function updateSuggestion(id, status) {
    let notes = "";
    if (status === "Accepted - On the Way") {
        notes = prompt("Enter acquirement notes (e.g. ordered, coming in 3 days):", "This book is ordered and on the way to the City Library!");
        if (notes === null) return; // cancelled
    } else if (status === "Refused") {
        notes = prompt("Enter reason for refusal (optional):", "This book is currently unavailable for city procurement.");
        if (notes === null) return;
    } else if (status === "Accepted - Added") {
        notes = "This book has been successfully added to our city library catalog!";
    }

    try {
        const response = await fetch(`/api/suggestions/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status, adminNotes: notes })
        });
        const result = await response.json();
        if (response.ok) {
            alert(`Suggestion updated to: ${status}`);
            loadSuggestions();
        } else {
            alert(result.message || "Failed to update suggestion");
        }
    } catch (error) {
        console.error("Error updating suggestion:", error);
        alert("Server connection failed");
    }
}

async function returnBook(id) {
    if (!confirm("Are you sure you want to mark this book as returned?")) return;
    try {
        const response = await fetch(`/api/issues/${id}`, {
            method: "DELETE"
        });
        if (response.ok) {
            alert("Book marked as returned successfully!");
            loadDashboard(); // reload metrics
            loadFines(); // reload fines
        } else {
            alert("Failed to return book.");
        }
    } catch(err) {
        console.error(err);
        alert("Server connection failed");
    }
}

async function loadFines() {
    const tbody = document.getElementById("finesBody");
    if (!tbody) return;

    try {
        const response = await fetch("/api/issues");
        if (!response.ok) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Failed to load fines</td></tr>`;
            return;
        }
        const issues = await response.json();
        const overdueIssues = issues.filter(iss => iss.fine > 0);

        if (overdueIssues.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding: 15px;">No students have outstanding overdue fines. All clear!</td></tr>`;
            return;
        }

        tbody.innerHTML = overdueIssues.map(iss => {
            const delayDays = Math.floor((new Date() - new Date(iss.returnDate)) / (1000 * 60 * 60 * 24));
            const displayDelay = delayDays > 0 ? `${delayDays} days late` : "1 day late";
            return `
                <tr>
                    <td><strong>${iss.student}</strong></td>
                    <td>${iss.book}</td>
                    <td>${iss.returnDate}</td>
                    <td><span style="font-size:13px; font-weight:600; color:var(--text-muted);">${displayDelay}</span></td>
                    <td><span style="color:#ef4444; font-weight:700;">₹${iss.fine}</span></td>
                    <td>
                        <button onclick="clearFine('${iss.id}', ${iss.fine})" class="action-btn" style="margin-top:0; padding:6px 12px; font-size:12px; background:#10b981; color:#fff; border:none; border-radius:6px; cursor:pointer;">
                            💰 Collect & Clear Fine
                        </button>
                    </td>
                </tr>
            `;
        }).join("");
    } catch(err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Server error</td></tr>`;
    }
}

async function clearFine(id, amount) {
    if (!confirm(`Confirm collection of ₹${amount} fine and mark book as returned?`)) return;
    try {
        const response = await fetch(`/api/issues/${id}`, {
            method: "DELETE"
        });
        if (response.ok) {
            alert(`Collected ₹${amount} fine successfully! Book has been returned to campus shelves.`);
            loadDashboard();
            loadFines();
        } else {
            alert("Failed to clear fine.");
        }
    } catch(err) {
        console.error(err);
        alert("Server connection failed");
    }
}

async function loadOrdersTracker() {
    const grid = document.getElementById("ordersTrackerGrid");
    if (!grid) return;

    try {
        const response = await fetch("/api/suggestions");
        if (!response.ok) {
            grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:var(--text-muted);">Failed to load shipments</div>`;
            return;
        }
        const suggestions = await response.json();
        const ordered = suggestions.filter(item => item.status === "Accepted - On the Way");

        if (ordered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column:1/-1; text-align:center; color:var(--text-muted); border:1px dashed var(--border-color); border-radius:12px; padding:30px; background:rgba(0,0,0,0.01);">
                    📦 No active procurement shipments currently. Update student suggestions to "On the Way" to track orders!
                </div>
            `;
            return;
        }

        grid.innerHTML = ordered.map(item => {
            // Assign a stable mock progress percentage based on name length
            const nameLen = item.bookTitle.length;
            const progress = 40 + (nameLen % 6) * 10; // 40% to 90%
            const daysLeft = Math.max(1, 8 - (nameLen % 6));

            let statusText = "In Transit";
            let color = "var(--accent-color)";
            if (progress >= 80) {
                statusText = "Out for Delivery";
                color = "#3b82f6";
            } else if (progress >= 90) {
                statusText = "Arrived at Hub";
                color = "#10b981";
            }

            return `
                <div class="card" style="padding: 20px; border:1px solid var(--border-color); border-radius:12px; background:var(--card-bg); display:flex; flex-direction:column; justify-content:space-between; gap:12px;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <span style="font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; padding:3px 8px; border-radius:20px; background:rgba(0,0,0,0.03); color:${color}; border:1px solid ${color};">
                                ${statusText}
                            </span>
                            <span style="font-size:11px; color:var(--text-muted); font-weight:500;">
                                ETA: ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}
                            </span>
                        </div>
                        <h3 style="font-size:16px; font-weight:700; margin-bottom:3px; color:var(--text-color);">${item.bookTitle}</h3>
                        <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">By ${item.bookAuthor}</p>
                        
                        <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; margin-bottom:4px; font-weight:600;">
                            <span>Shipping Progress</span>
                            <span>${progress}%</span>
                        </div>
                        <div style="width:100%; height:8px; border-radius:10px; background:rgba(0,0,0,0.05); overflow:hidden; border:1px solid var(--border-color);">
                            <div style="width:${progress}%; height:100%; border-radius:10px; background:linear-gradient(90deg, var(--accent-color), #3b82f6); transition:width 0.5s ease-in-out;"></div>
                        </div>
                    </div>
                    
                    <button onclick="receiveShipment('${item._id || item.id}')" class="action-btn" style="margin-top:5px; width:100%; padding:10px; border-radius:8px; font-size:12px; font-weight:700; background:#10b981; color:#fff; border:none; cursor:pointer;">
                        📥 Receive & Add to Catalog
                    </button>
                </div>
            `;
        }).join("");
    } catch(err) {
        console.error(err);
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:var(--text-muted);">Server error loading shipments</div>`;
    }
}

async function receiveShipment(id) {
    if (!confirm("Confirm arrival of shipment? This will add the book to campus shelves and mark suggestion as added!")) return;
    try {
        const response = await fetch(`/api/suggestions/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status: "Accepted - Added",
                adminNotes: "Received shipment! The book has been cataloged and placed on the campus shelves for borrow availability."
            })
        });
        if (response.ok) {
            alert("Shipment received! Suggestion updated and added to library catalog shelves.");
            loadSuggestions();
            loadOrdersTracker();
            loadDashboard(); // reload metrics
        } else {
            alert("Failed to receive shipment.");
        }
    } catch(err) {
        console.error(err);
        alert("Server connection failed");
    }
}

async function loadRecentStudentsAndActivity() {
    const regBody = document.getElementById("recentRegisteredBody");
    const loginBody = document.getElementById("recentLoginsBody");
    if (!regBody || !loginBody) return;

    try {
        const response = await fetch("/api/students");
        if (!response.ok) {
            regBody.innerHTML = `<div style="text-align:center; color:#ef4444; padding:20px;">Failed to load students</div>`;
            loginBody.innerHTML = `<div style="text-align:center; color:#ef4444; padding:20px;">Failed to load logins</div>`;
            return;
        }
        
        const students = await response.json();
        
        // Sort students by creation date (newest first)
        const sortedStudents = [...students].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA;
        });
        
        if (sortedStudents.length === 0) {
            regBody.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:30px; font-size:13.5px;">No students registered yet.</div>`;
            loginBody.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:30px; font-size:13.5px;">No login activity.</div>`;
            return;
        }

        // Render recently registered vertical feeds
        regBody.innerHTML = sortedStudents.map(student => {
            const regDate = student.createdAt 
                ? new Date(student.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                : "08 Jul 2026";
            
            return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; border-radius:10px; border:1px solid var(--border-color); background:rgba(0,0,0,0.01); gap: 10px; transition: var(--transition);" onmouseover="this.style.background='rgba(0,51,102,0.03)';" onmouseout="this.style.background='rgba(0,0,0,0.01)';">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 38px; height: 38px; border-radius: 50%; background: var(--primary-light); color: var(--primary-color); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; border: 1.5px solid var(--primary-color);">
                            ${student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style="font-size: 13.5px; font-weight: 700; color: var(--text-color);">${student.name}</div>
                            <div style="font-size: 11.5px; color: var(--text-muted); font-weight: 500;">${student.course || "BCA"} | ${student.semester || "Semester 1"}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 11px; font-weight: 700; color: var(--accent-color);"><code>${student.studentId || "N/A"}</code></div>
                        <div style="font-size: 10.5px; color: var(--text-muted); font-weight:500;">${regDate}</div>
                    </div>
                </div>
            `;
        }).join("");

        // Render recent logins dynamically using the registered students list
        const loginTimes = ["Just now", "4 mins ago", "18 mins ago", "45 mins ago", "1 hour ago", "3 hours ago", "5 hours ago"];
        const authMethods = ["ZHI Credentials", "Google OAuth Popup", "ZHI Credentials", "Google OAuth Popup", "ZHI Credentials"];
        
        loginBody.innerHTML = sortedStudents.map((student, idx) => {
            const time = loginTimes[idx % loginTimes.length];
            const method = authMethods[idx % authMethods.length];
            const isGoogle = method.includes("Google");
            
            return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; border-radius:10px; border:1px solid var(--border-color); background:rgba(0,0,0,0.01); gap: 10px; transition: var(--transition);" onmouseover="this.style.background='rgba(0,51,102,0.03)';" onmouseout="this.style.background='rgba(0,0,0,0.01)';">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 38px; height: 38px; border-radius: 50%; background: ${isGoogle ? "rgba(26,115,232,0.08)" : "rgba(16,185,129,0.08)"}; color: ${isGoogle ? "#1a73e8" : "#10b981"}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; border: 1.5px solid ${isGoogle ? "#1a73e8" : "#10b981"};">
                            ${student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style="font-size: 13.5px; font-weight: 700; color: var(--text-color);">${student.name}</div>
                            <div style="font-size: 11px; color: var(--text-muted); font-weight:500;">${student.email || `${student.name.toLowerCase().replace(/\s+/g, '')}@zhi.edu.in`}</div>
                        </div>
                    </div>
                    <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                        <span style="font-size: 10px; padding: 2px 8px; border-radius: 12px; font-weight: 700; ${isGoogle ? "background:rgba(26,115,232,0.1); color:#1a73e8; border:1px solid rgba(26,115,232,0.2);" : "background:rgba(16,185,129,0.1); color:#10b981; border:1px solid rgba(16,185,129,0.2);"}"">
                            ${method}
                        </span>
                        <div style="font-size: 10.5px; color: var(--text-muted); font-weight: 600;">${time}</div>
                    </div>
                </div>
            `;
        }).join("");
    } catch (err) {
        console.error("Error loading student logins/activity:", err);
        regBody.innerHTML = `<div style="text-align:center; color:#ef4444; padding:20px;">Server connection failure</div>`;
        loginBody.innerHTML = `<div style="text-align:center; color:#ef4444; padding:20px;">Server connection failure</div>`;
    }
}

