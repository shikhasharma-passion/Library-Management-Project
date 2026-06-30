const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const API_BASE_URL = window.location.protocol === "file:" ? "http://localhost:3000" : "";

if(loginForm){

    loginForm.addEventListener("submit", async function(e){

        e.preventDefault();

        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        if(username === "" || password === ""){
            alert("Please fill all fields");
            return;
        }

        try{
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({ username, password })
            });

            const result = await response.json();

            if(!response.ok){
                alert(result.message || "Login failed");
                return;
            }

            localStorage.setItem("user", result.user.name || username);
            localStorage.setItem("userEmail", result.user.email || username);
            localStorage.setItem("userRole", result.user.role || "student");
        }catch(error){
            alert("Server is not running. Please open the app from http://localhost:3000");
            return;
        }

        alert("Login Successful");

        if((localStorage.getItem("userRole") || "student") === "admin"){
            window.location.href = "dashboard.html";
        }else{
            window.location.href = "student_dashboard.html";
        }

    });

}

if(registerForm){

    registerForm.addEventListener("submit", async function(e){

        e.preventDefault();

        let name = document.getElementById("registerName").value;
        let email = document.getElementById("registerEmail").value;
        let course = document.getElementById("registerCourse").value;
        let password = document.getElementById("registerPassword").value;

        if(name === "" || email === "" || course === "" || password === ""){
            alert("Please fill all fields");
            return;
        }

        try{
            const response = await fetch(`${API_BASE_URL}/api/register`, {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({ name, email, course, password })
            });

            const result = await response.json();

            if(!response.ok){
                alert(result.message || "Registration failed");
                return;
            }

            alert("Registration Successful");
            window.location.href = "login.html";
        }catch(error){
            alert("Server is not running. Please open the app from http://localhost:3000");
        }

    });

}
