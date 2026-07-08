const contactForm = document.getElementById("contactForm");

if(contactForm){
    contactForm.addEventListener("submit", async function(e){
        e.preventDefault();

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const subject = document.getElementById("contactSubject").value;
        const message = document.getElementById("contactMessage").value.trim();

        if(!name || !email || !subject || !message){
            showToast("Please fill in all fields", "error");
            return;
        }

        // Format message to include the subject
        const formattedMessage = `[Subject: ${subject}]\n\n${message}`;

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, message: formattedMessage })
            });

            const result = await response.json();

            if(!response.ok){
                showToast(result.message || "Unable to send message", "error");
                return;
            }

            showToast("🚀 Message sent successfully! We will get back to you soon.", "success");
            contactForm.reset();
        } catch(error) {
            showToast("Unable to connect to the server. Please try again later.", "error");
        }
    });
}

// Custom Toast notification for premium feel
function showToast(message, type = "success") {
    // Check if toast container exists
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

    // Trigger animation
    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    }, 10);

    // Slide out and remove
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-20px)";
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}
