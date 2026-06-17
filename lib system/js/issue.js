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

            <p><strong>Book:</strong>
            ${book.book}</p>

            <p><strong>Date:</strong>
            ${book.date}</p>

            <p><strong>Return Date:</strong>
${book.returnDate}</p>

            <p>
<strong>Fine:</strong>

Rs. ${fine}

</p>

<p>

<strong>Status:</strong>

${fine > 0
? "Overdue"
: "Issued"}

</p>

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

   if(student === "" ||
book === "" ||
date === "" ||
returnDate === ""){

        alert("Please fill all fields");

        return;

    }

    try{
        const response = await fetch("/api/issues", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({ student, book, date, returnDate })
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

