const contactForm = document.getElementById("contactForm");

if(contactForm){

    contactForm.addEventListener("submit", async function(e){

        e.preventDefault();

        let name = document.getElementById("contactName").value;
        let email = document.getElementById("contactEmail").value;
        let message = document.getElementById("contactMessage").value;

        if(name === "" || email === "" || message === ""){
            alert("Please fill all fields");
            return;
        }

        try{
            const response = await fetch("/api/contact", {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({ name, email, message })
            });

            const result = await response.json();

            if(!response.ok){
                alert(result.message || "Message not sent");
                return;
            }

            alert("Message sent successfully");
            contactForm.reset();
        }catch(error){
            alert("Server is not running");
        }

    });

}
