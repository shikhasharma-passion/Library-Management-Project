const publicBookList =
document.getElementById("publicBookList");

const loginPopup =
document.getElementById("loginPopup");

const publicSearchInput =
document.getElementById("publicSearchInput");

let publicBooks = [];
let activeCategory = "All";

/* DISPLAY BOOKS */

function displayPublicBooks(books){

    publicBookList.innerHTML = "";

    if(books.length === 0){

        publicBookList.innerHTML = `

        <div class="book-item">

            <h3>No Books Found</h3>

            <p>Try another category or search.</p>

        </div>

        `;

        return;

    }

    books.forEach((book)=>{

        publicBookList.innerHTML += `

        <div class="book-item">

            <img src="${book.image}">

            <h3>${book.name}</h3>

            <p>${book.author}</p>

            <p>${book.category}</p>

            <button class="access-btn"
            onclick="accessBook()">

            Explore Book

            </button>

        </div>

        `;

    });

}

async function loadPublicBooks(category = "All", searchValue = ""){

    activeCategory = category;

    try{
        const params = new URLSearchParams();

        if(category !== "All"){
            params.set("category", category);
        }

        if(searchValue){
            params.set("q", searchValue);
        }

        const query = params.toString();
        const url = query ? `/api/catalog?${query}` : "/api/catalog";

        const response = await fetch(url);

        if(!response.ok){
            const result = await response.json();
            alert(result.message || "Books not loaded");
            return;
        }

        publicBooks = await response.json();
        displayPublicBooks(publicBooks);
    }catch(error){
        alert("Server is not running");
    }

}

/* FILTER */

function filterBooks(category){
    const container = document.getElementById("categoryFilterContainer");
    if (container) {
        const buttons = container.querySelectorAll("button");
        buttons.forEach(btn => {
            const btnText = btn.innerText.trim();
            if (btnText === category) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }
    loadPublicBooks(category, publicSearchInput ? publicSearchInput.value.trim() : "");
}


if(publicSearchInput){

    publicSearchInput.addEventListener("input", function(){

        loadPublicBooks(activeCategory, publicSearchInput.value.trim());

    });

}

/* ACCESS */

function accessBook(){

    let user =
    localStorage.getItem("user");

    if(user){

        alert("Access Granted");

    }else{

        loginPopup.style.display = "flex";

    }

}

/* CLOSE POPUP */

function closePopup(){

    loginPopup.style.display = "none";

}

/* INITIAL */

const initialParams = new URLSearchParams(window.location.search);
const initialSearch = initialParams.get("q") || "";

if(publicSearchInput){
    publicSearchInput.value = initialSearch;
}

loadPublicBooks("All", initialSearch);
