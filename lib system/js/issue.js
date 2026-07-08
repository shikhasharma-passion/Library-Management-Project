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

// Intercept and route fetch requests on local files to localhost:3000
const ORIGINAL_FETCH = window.fetch;
window.fetch = function(url, options) {
    const API_BASE_URL = window.location.protocol === "file:" ? "http://localhost:3000" : "";
    if (typeof url === "string" && url.startsWith("/api")) {
        url = API_BASE_URL + url;
    }
    return ORIGINAL_FETCH(url, options);
};

const issueForm =
document.getElementById("issueForm");

const issueList =
document.getElementById("issueList");

let issuedBooks = [];

function getId(item){

    return item.id || item._id;

}

/* DISPLAY */

function displayIssuedBooks(){

    issueList.innerHTML = "";

    if(issuedBooks.length === 0){

        issueList.innerHTML = `

        <div class="book-card">

            <h3>No Issued Books</h3>

            <p>Issue a book to see records here.</p>

        </div>

        `;

        return;

    }

    issuedBooks.forEach((book)=>{

        const fine =
        Number(book.fine || calculateFine(book.returnDate));

        issueList.innerHTML += `

        <div class="book-card">

            <h3>${book.student}</h3>

            <p><strong>Student ID:</strong> ${book.studentId || 'N/A'}</p>

            <p><strong>Book Title:</strong> ${book.book}</p>

            <p><strong>Accession No:</strong> ${book.accessionNo || 'N/A'}</p>

            <p><strong>Issue Date:</strong> ${book.date}</p>

            <p><strong>Return Deadline:</strong> ${book.returnDate}</p>

            <p><strong>Remarks:</strong> ${book.remarks || 'N/A'}</p>

            <p><strong>Issue Source:</strong> ${book.issueType || 'Student Online'}</p>

            <p><strong>Fine:</strong> Rs. ${fine}</p>

            <p><strong>Status:</strong> ${fine > 0 ? "Overdue" : "Issued"}</p>

            <button class="delete-btn"
            onclick="returnBook('${getId(book)}')">

            Return Book

            </button>

        </div>

        `;

    });

}


/* FINE CALCULATOR */

function calculateFine(returnDate){

    let today = new Date();

    let dueDate = new Date(returnDate);

    let difference =
    today - dueDate;

    let daysLate =
    Math.floor(difference /
    (1000 * 60 * 60 * 24));

    if(daysLate > 0){

        return daysLate * 10;

    }else{

        return 0;

    }

}

async function loadIssuedBooks(){

    try{
        const response = await fetch("/api/issues");

        if(!response.ok){
            const result = await response.json();
            alert(result.message || "Issued books not loaded");
            return;
        }

        issuedBooks = await response.json();
        displayIssuedBooks();
    }catch(error){
        alert("Server is not running");
    }

}

/* ISSUE */

issueForm.addEventListener("submit",
async function(e){

    e.preventDefault();

    let student =
    document.getElementById("issueStudent").value.trim();

    let book =
    document.getElementById("issueBook").value.trim();

    let date =
    document.getElementById("issueDate").value;

    let returnDate =
    document.getElementById("returnDate").value;

    let studentIdVal =
    document.getElementById("issueStudentId").value.trim();

    let accessionNoVal =
    document.getElementById("issueAccessionNo").value.trim();

    let remarksVal =
    document.getElementById("issueRemarks").value.trim();

   if(student === "" ||
    book === "" ||
    date === "" ||
    returnDate === "" ||
    studentIdVal === "" ||
    accessionNoVal === "" ||
    remarksVal === ""){

        alert("Please fill all fields");

        return;

    }

    try{
        const response = await fetch("/api/issues", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({ 
                student, 
                book, 
                date, 
                returnDate,
                studentId: studentIdVal,
                accessionNo: accessionNoVal,
                remarks: remarksVal
            })
        });

        const result = await response.json();

        if(!response.ok){
            alert(result.message || "Book not issued");
            return;
        }

        await loadIssuedBooks();

        issueForm.reset();
    }catch(error){
        alert("Server is not running");
    }

});

/* RETURN */

async function returnBook(id){

    if(!id){
        alert("Issue id missing");
        return;
    }

    if(!confirm("Return this book?")){
        return;
    }

    try{
        const response = await fetch(`/api/issues/${id}`, {
            method:"DELETE"
        });

        const result = await response.json();

        if(!response.ok){
            alert(result.message || "Book not returned");
            return;
        }

        await loadIssuedBooks();
    }catch(error){
        alert("Server is not running");
    }

}

/* THEME SYSTEM (Persistent across Admin Pages) */
function initTheme() {
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

/* INITIAL */
initTheme();
loadIssuedBooks();
loadActiveStudentsFeed();

async function loadActiveStudentsFeed() {
    const feed = document.getElementById("activeStudentsFeed");
    if (!feed) return;

    try {
        const response = await fetch("/api/students");
        if (!response.ok) {
            feed.innerHTML = `<div style="text-align:center; color:#ef4444; font-size:12.5px; padding:15px;">Failed to load students</div>`;
            return;
        }

        const students = await response.json();
        const sortedStudents = [...students].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA;
        });

        if (sortedStudents.length === 0) {
            feed.innerHTML = `<div style="text-align:center; color:var(--text-muted); font-size:12.5px; padding:15px;">No students registered.</div>`;
            return;
        }

        feed.innerHTML = sortedStudents.map(student => {
            const escapedName = student.name.replace(/'/g, "\\'");
            const escapedId = (student.studentId || "").replace(/'/g, "\\'");
            return `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:8px; border-radius:8px; border:1px solid var(--border-color); background:rgba(0,0,0,0.01); gap:8px;">
                    <div style="display:flex; align-items:center; gap:8px; overflow:hidden;">
                        <div style="width:28px; height:28px; border-radius:50%; background:var(--primary-light); color:var(--primary-color); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:11px; flex-shrink:0;">
                            ${student.name.charAt(0).toUpperCase()}
                        </div>
                        <div style="overflow:hidden;">
                            <div style="font-size:12px; font-weight:700; color:var(--text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${student.name}</div>
                            <div style="font-size:10px; color:var(--text-muted); font-weight:500;"><code>${student.studentId || "N/A"}</code> | ${student.course || "BCA"}</div>
                        </div>
                    </div>
                    <button type="button" onclick="fillForm('${escapedName}', '${escapedId}')" style="margin-top:0; padding:4px 8px; font-size:10px; border-radius:6px; background:var(--accent-color); color:#0f172a; font-weight:700; border:none; cursor:pointer; flex-shrink:0;">
                        ✏️ Fill
                    </button>
                </div>
            `;
        }).join("");
    } catch (err) {
        console.error(err);
        feed.innerHTML = `<div style="text-align:center; color:#ef4444; font-size:12.5px; padding:15px;">Server error loading students</div>`;
    }
}

window.fillForm = function(name, studentId) {
    const studentInput = document.getElementById("issueStudent");
    const idInput = document.getElementById("issueStudentId");
    if (studentInput) studentInput.value = name;
    if (idInput) idInput.value = studentId;
};

