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

    bookList.innerHTML = "";

    if(filteredBooks.length === 0){

        bookList.innerHTML = `

        <div class="book-card">

            <h3>No Books Found</h3>

            <p>Try another search or add a new book.</p>

        </div>

        `;

        return;

    }

    filteredBooks.forEach((book)=>{

        bookList.innerHTML += `

        <div class="book-card">

            <h3>${book.name}</h3>

            <p><strong>Author:</strong> ${book.author}</p>

            <p><strong>Category:</strong> ${book.category}</p>
            
            <p><strong>Status:</strong> ${book.status}</p>
            
            <button class="delete-btn" onclick="deleteBook('${getId(book)}')">
                Delete
            </button>

        </div>

        `;

    });

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

    if(name === "" || author === "" || category === ""){

        alert("Please fill all fields");

        return;

    }

    try{
        const response = await fetch("/api/books", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({ name, author, category })
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

