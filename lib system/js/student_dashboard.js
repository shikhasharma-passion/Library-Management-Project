document.addEventListener("DOMContentLoaded", () => {
    initStudentTheme();
    loadStudentDashboard();
    loadStudentBorrowRequests();
    loadStudentExtensionRequests();
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

/* LOAD STUDENT METRICS & ISSUED BOOKS */
async function loadStudentDashboard() {
    const user = localStorage.getItem("user") || "";
    const profile = document.getElementById("studentProfile");

    if (profile && user) {
        profile.innerText = `Welcome, ${user}`;
    }

    try {
        const response = await fetch(`/api/student-dashboard?name=${encodeURIComponent(user)}`);
        const data = await response.json();

        document.getElementById("studentIssuedCount").innerText = data.totalIssued;
        document.getElementById("studentPendingCount").innerText = data.pendingReturns;
        document.getElementById("studentFineAmount").innerText = `Rs. ${data.fineAmount}`;

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

async function requestBookExtension(issueId, bookName, currentReturnDate) {
    // Calculate default return date: +7 days from current return date
    const current = new Date(currentReturnDate);
    const extended = new Date(current);
    extended.setDate(current.getDate() + 7);
    const defaultDateStr = extended.toISOString().split("T")[0];

    const newDateStr = prompt(`Enter new return date (YYYY-MM-DD) for "${bookName}":\n(Current Deadline: ${currentReturnDate})`, defaultDateStr);
    if (!newDateStr) return;

    // Simple date format check
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDateStr.trim())) {
        alert("Invalid date format. Please use YYYY-MM-DD.");
        return;
    }

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
}

