const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const API_BASE_URL = window.location.protocol === "file:" ? "http://localhost:3000" : "";

// --- PASSWORD TOGGLE FUNCTIONALITY ---
function setupPasswordToggle(btnId, inputId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    
    // SVG vectors for eye (hidden state) and eye-off (visible state)
    const eyeSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    const eyeOffSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
    
    btn.innerHTML = eyeSvg;
    
    btn.addEventListener("click", () => {
        const input = document.getElementById(inputId);
        if (input.type === "password") {
            input.type = "text";
            btn.innerHTML = eyeOffSvg;
        } else {
            input.type = "password";
            btn.innerHTML = eyeSvg;
        }
    });
}

setupPasswordToggle("togglePasswordBtn", "password");
setupPasswordToggle("toggleRegisterPasswordBtn", "registerPassword");

// --- SUBMIT LOGIN ---
if(loginForm){
    loginForm.addEventListener("submit", async function(e){
        e.preventDefault();

        let username = document.getElementById("username").value.trim();
        let password = document.getElementById("password").value;

        if(username === "" || password === ""){
            showToast("Please fill in all fields", "error");
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
                showToast(result.message || "Invalid credentials. Please try again.", "error");
                return;
            }

            localStorage.setItem("user", result.user.name || username);
            localStorage.setItem("userEmail", result.user.email || username);
            localStorage.setItem("userRole", result.user.role || "student");
        }catch(error){
            showToast("Server is offline. Running simulation mode...", "error");
            // Simulate login if server is offline for smooth front-end demo
            localStorage.setItem("user", username);
            localStorage.setItem("userEmail", username + "@zhi.edu.in");
            localStorage.setItem("userRole", username.toLowerCase().includes("admin") ? "admin" : "student");
        }

        showToast("🔑 Login successful! Redirecting...", "success");

        setTimeout(() => {
            if((localStorage.getItem("userRole") || "student") === "admin"){
                window.location.href = "dashboard.html";
            }else{
                window.location.href = "student_dashboard.html";
            }
        }, 50);
    });
}

// --- SUBMIT REGISTER ---
if(registerForm){
    registerForm.addEventListener("submit", async function(e){
        e.preventDefault();

        let name = document.getElementById("registerName").value.trim();
        let email = document.getElementById("registerEmail").value.trim();
        let course = document.getElementById("registerCourse").value.trim();
        let password = document.getElementById("registerPassword").value;
        let terms = document.getElementById("registerTerms").checked;

        if(name === "" || email === "" || course === "" || password === ""){
            showToast("Please fill in all fields", "error");
            return;
        }

        if(!terms){
            showToast("Please accept the terms & privacy policy", "error");
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
                showToast(result.message || "Registration failed", "error");
                return;
            }

            showToast("🎉 Registration successful! Redirecting to login...", "success");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 50);
        }catch(error){
            showToast("Server is offline. Simulated registration complete!", "success");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 50);
        }
    });
}

// Custom Toast notification for premium feel
function showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.style.cssText = `
        padding: 16px 24px;
        border-radius: 12px;
        background: ${type === "success" ? "#00875a" : "#de350b"};
        color: #ffffff;
        font-family: 'Poppins', sans-serif;
        font-size: 14.5px;
        font-weight: 600;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    toast.innerText = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    }, 10);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-20px)";
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

// --- GOOGLE OAUTH SIMULATED SIGN-IN ---
function triggerGoogleSignIn() {
    // Open official looking google sign-in modal in a popup window
    const width = 500;
    const height = 620;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    
    const popup = window.open(
        "google_auth_popup.html", 
        "GoogleAuth", 
        `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes`
    );

    if (window.focus && popup) popup.focus();

    // Listen for OAuth message response from popup window
    const messageListener = (event) => {
        // Safety verification check
        if (event.origin !== window.location.origin) return;

        if (event.data && event.data.type === 'GOOGLE_LOGIN_SUCCESS') {
            const { name, email } = event.data;
            
            // Set session details in local storage
            localStorage.setItem("user", name);
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userRole", "student");
            
            showToast(`🔑 Signed in via Google as ${name}!`, "success");
            
            // Clean up listener
            window.removeEventListener("message", messageListener);
            
            // Redirect user to student dashboard
            setTimeout(() => {
                window.location.href = "student_dashboard.html";
            }, 1000);
        }
    };

    window.addEventListener("message", messageListener);
}
