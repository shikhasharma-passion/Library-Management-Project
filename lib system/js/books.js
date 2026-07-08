const bookForm = document.getElementById("bookForm");

const bookList = document.getElementById("bookList");

const searchInput = document.getElementById("searchInput");

let books = [];

function getId(item){

    return item.id || item._id;

}

function text(value){

    return String(value || "");

}

/* SHOW BOOKS */

function displayBooks(filteredBooks = books){
    if(filteredBooks.length === 0){
        bookList.innerHTML = `
        <div class="book-card">
            <h3>No Books Found</h3>
            <p>Try another search or add a new book.</p>
        </div>
        `;
        return;
    }

    let cardsHtml = "";

    filteredBooks.forEach((book)=>{
        cardsHtml += `
        <div class="book-card">
            <h3>${book.name}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Subject Code:</strong> ${book.subjectCode || 'N/A'}</p>
            <p><strong>Accession No:</strong> ${book.accessionNo || 'N/A'}</p>
            <p><strong>ISBN:</strong> ${book.isbn || 'N/A'}</p>
            <p><strong>Category:</strong> ${book.category} | ${book.semester || 'N/A'}</p>
            <p><strong>Publisher:</strong> ${book.publisher || 'N/A'}</p>
            <p><strong>Edition:</strong> ${book.edition || 'N/A'}</p>
            <p><strong>Location:</strong> ${book.rackNo || 'N/A'}, ${book.shelfNo || 'N/A'}</p>
            <p><strong>Language:</strong> ${book.language || 'English'}</p>
            <p><strong>Status:</strong> ${book.status}</p>
            <button class="delete-btn" onclick="deleteBook('${getId(book)}')">
                Delete
            </button>
        </div>
        `;
    });

    bookList.innerHTML = cardsHtml;
}

async function loadBooks(searchValue = ""){

    try{
        const url = searchValue
        ? `/api/books?q=${encodeURIComponent(searchValue)}`
        : "/api/books";

        const response = await fetch(url);

        if(!response.ok){
            const result = await response.json();
            alert(result.message || "Books not loaded");
            return;
        }

        books = await response.json();
        displayBooks();
    }catch(error){
        alert("Server is not running");
    }

}

/* ADD BOOK */

bookForm.addEventListener("submit", async function(e){

    e.preventDefault();

    let name = document.getElementById("bookName").value.trim();

    let author = document.getElementById("authorName").value.trim();

    let category = document.getElementById("bookCategory").value.trim();

    let subjectCodeVal = document.getElementById("subjectCode").value.trim();

    let isbnVal = document.getElementById("isbn").value.trim();

    let publisherVal = document.getElementById("publisher").value.trim();

    let editionVal = document.getElementById("edition").value.trim();

    let languageVal = document.getElementById("language").value.trim();

    let accessionNoVal = document.getElementById("accessionNo").value.trim();

    let rackNoVal = document.getElementById("rackNo").value.trim();

    let shelfNoVal = document.getElementById("shelfNo").value.trim();

    let semesterVal = document.getElementById("bookSemester").value;

    if(name === "" || author === "" || category === "" || subjectCodeVal === "" || isbnVal === "" || accessionNoVal === ""){

        alert("Please fill all fields");

        return;

    }

    try{
        const response = await fetch("/api/books", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({ 
                name, 
                author, 
                category, 
                subjectCode: subjectCodeVal,
                isbn: isbnVal,
                publisher: publisherVal,
                edition: editionVal,
                language: languageVal,
                accessionNo: accessionNoVal,
                rackNo: rackNoVal,
                shelfNo: shelfNoVal,
                semester: semesterVal
            })
        });

        const result = await response.json();

        if(!response.ok){
            alert(result.message || "Book not added");
            return;
        }

        await loadBooks(searchInput.value.trim());

        bookForm.reset();
    }catch(error){
        alert("Server is not running");
    }

});

/* DELETE */

async function deleteBook(id){

    if(!id){
        alert("Book id missing");
        return;
    }

    if(!confirm("Delete this book?")){
        return;
    }

    try{
        const response = await fetch(`/api/books/${id}`, {
            method:"DELETE"
        });

        const result = await response.json();

        if(!response.ok){
            alert(result.message || "Book not deleted");
            return;
        }

        await loadBooks(searchInput.value.trim());
    }catch(error){
        alert("Server is not running");
    }

}

/* SEARCH */

searchInput.addEventListener("input", function(){

    const searchValue = searchInput.value.toLowerCase().trim();

    if(searchValue.length === 0){
        displayBooks(books);
        return;
    }

    let filteredBooks = books.filter((book)=>{

        return text(book.name).toLowerCase().includes(searchValue) ||
        text(book.author).toLowerCase().includes(searchValue) ||
        text(book.category).toLowerCase().includes(searchValue) ||
        text(book.status).toLowerCase().includes(searchValue);

    });

    displayBooks(filteredBooks);

});

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
loadBooks();

