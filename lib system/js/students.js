const studentForm = document.getElementById("studentForm");

const studentList = document.getElementById("studentList");

const studentSearchInput = document.getElementById("studentSearchInput");

let students = [];

function getId(item){

    return item.id || item._id;

}

function text(value){

    return String(value || "");

}

/* DISPLAY */

function displayStudents(filteredStudents = students){

    studentList.innerHTML = "";

    if(filteredStudents.length === 0){

        studentList.innerHTML = `

        <div class="book-card">

            <h3>No Users Found</h3>

            <p>Try another search or add a new user.</p>

        </div>

        `;

        return;

    }

    filteredStudents.forEach((student)=>{

        studentList.innerHTML += `

        <div class="book-card">

            <h3>${student.name}</h3>

            <p><strong>Class/Course:</strong> ${student.course} (${student.semester || 'N/A'})</p>

            <p><strong>Roll Number:</strong> ${student.roll}</p>

            <p><strong>Student ID:</strong> ${student.studentId || 'N/A'}</p>

            <p><strong>Session:</strong> ${student.session || 'N/A'}</p>

            <p><strong>Email:</strong> ${student.email || 'N/A'}</p>

            <p><strong>Mobile:</strong> ${student.phone || 'N/A'}</p>

            <button class="delete-btn"
            onclick="deleteStudent('${getId(student)}')">

            Delete

            </button>

        </div>

        `;

    });

}

async function loadStudents(searchValue = ""){

    try{
        const url = searchValue
        ? `/api/students?q=${encodeURIComponent(searchValue)}`
        : "/api/students";

        const response = await fetch(url);

        if(!response.ok){
            const result = await response.json();
            alert(result.message || "Users not loaded");
            return;
        }

        students = await response.json();
        displayStudents();
    }catch(error){
        alert("Server is not running");
    }

}

/* ADD */

studentForm.addEventListener("submit", async function(e){

    e.preventDefault();

    let name =
    document.getElementById("studentName").value.trim();

    let course =
    document.getElementById("studentCourse").value.trim();

    let roll =
    document.getElementById("studentRoll").value.trim();

    let studentIdVal =
    document.getElementById("studentIdInput").value.trim();

    let semesterVal =
    document.getElementById("studentSemester").value;

    let emailVal =
    document.getElementById("studentEmail").value.trim();

    let phoneVal =
    document.getElementById("studentPhone").value.trim();

    let sessionVal =
    document.getElementById("studentSession").value.trim();

    if(name === "" || course === "" || roll === "" || studentIdVal === "" || !semesterVal || emailVal === "" || phoneVal === "" || sessionVal === ""){

        alert("Please fill all fields");

        return;

    }

    try{
        const response = await fetch("/api/students", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({ 
                name, 
                course, 
                roll, 
                studentId: studentIdVal, 
                semester: semesterVal,
                email: emailVal,
                phone: phoneVal,
                session: sessionVal
            })
        });

        const result = await response.json();

        if(!response.ok){
            alert(result.message || "User not added");
            return;
        }

        await loadStudents(studentSearchInput ? studentSearchInput.value.trim() : "");

        studentForm.reset();
    }catch(error){
        alert("Server is not running");
    }

});

/* DELETE */

async function deleteStudent(id){

    if(!id){
        alert("User id missing");
        return;
    }

    if(!confirm("Delete this user?")){
        return;
    }

    try{
        const response = await fetch(`/api/students/${id}`, {
            method:"DELETE"
        });

        const result = await response.json();

        if(!response.ok){
            alert(result.message || "User not deleted");
            return;
        }

        await loadStudents(studentSearchInput ? studentSearchInput.value.trim() : "");
    }catch(error){
        alert("Server is not running");
    }

}

if(studentSearchInput){

    studentSearchInput.addEventListener("input", function(){

        const searchValue = studentSearchInput.value.toLowerCase().trim();

        if(searchValue.length === 0){
            displayStudents(students);
            return;
        }

        const filteredStudents = students.filter((student)=>{

            return text(student.name).toLowerCase().includes(searchValue) ||
            text(student.course).toLowerCase().includes(searchValue) ||
            text(student.roll).toLowerCase().includes(searchValue);

        });

        displayStudents(filteredStudents);

    });

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
window.API_RESOLVED_PROMISE.then(() => {
    initTheme();
    loadStudents();
});

