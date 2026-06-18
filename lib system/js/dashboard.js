let libraryChart;
let categoriesChart;

document.addEventListener("DOMContentLoaded", () => {
    initDashboardTheme();
    loadDashboard();
    loadContacts();
    loadBorrowRequests();
    loadExtensionRequests();
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
            <th>Student</th>
            <th>Book Title</th>
            <th>Issue Date</th>
            <th>Return Date</th>
            <th>Status</th>
        </tr>
    `;

    if (records.length === 0) {
        table.innerHTML += `
            <tr>
                <td colspan="5" style="text-align: center; color: var(--text-muted);">No issued books yet</td>
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

        table.innerHTML += `
            <tr>
                <td><strong>${record.student}</strong></td>
                <td>${record.book}</td>
                <td>${record.date}</td>
                <td>${record.returnDate}</td>
                <td><span class="status-badge ${statusClass}">${record.status}</span></td>
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
                labels: ["Books Available", "Students", "Issued Books", "Overdue Returns"],
                datasets: [{
                    label: "Library Activity",
                    data: [stats.totalBooks, stats.totalStudents, stats.issuedBooks, stats.pendingBooks],
                    backgroundColor: ["#021b3a", "#f1c40f", "#3498db", "#e74c3c"],
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
        const labels = catData.map(c => c.category);
        const counts = catData.map(c => c.count);

        categoriesChart = new Chart(ctx2, {
            type: "doughnut",
            data: {
                labels: labels.length > 0 ? labels : ["Empty"],
                datasets: [{
                    data: counts.length > 0 ? counts : [0],
                    backgroundColor: [
                        "#021b3a", "#f1c40f", "#3498db", "#27ae60",
                        "#9b59b6", "#e67e22", "#1abc9c", "#e74c3c"
                    ],
                    borderWidth: isDark ? 2 : 1,
                    borderColor: isDark ? "#151f2b" : "#ffffff"
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

        if (contacts.length === 0) {
            table.innerHTML += `
                <tr>
                    <td colspan="5" style="text-align: center; color: var(--text-muted);">No messages found</td>
                </tr>
            `;
            return;
        }

        contacts.forEach(msg => {
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
            <th>Student</th>
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

        // Filter to only show Pending requests in the main action list, or show all with status badges
        if (requests.length === 0) {
            table.innerHTML += `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--text-muted);">No borrow requests found</td>
                </tr>
            `;
            return;
        }

        requests.forEach(req => {
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
            <th>Student</th>
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

        if (requests.length === 0) {
            table.innerHTML += `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--text-muted);">No extension requests found</td>
                </tr>
            `;
            return;
        }

        requests.forEach(req => {
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

