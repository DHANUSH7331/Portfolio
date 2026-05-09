const words = ["Frontend Developer", "Full Stack Developer","Data Analyst","ML Enthusiast"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typing = document.getElementById("Designation");

function typeLoop() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
        typing.textContent = currentWord.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentWord.length) {
            setTimeout(() => isDeleting = true, 1200);
        }
    } else {
        typing.textContent = currentWord.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
    }
 
    setTimeout(typeLoop, isDeleting ? 60 : 120);
}

typeLoop();

const group = document.querySelector(".group");
const clone = group.cloneNode(true);
clone.setAttribute("aria-hidden","true");
document.querySelector(".slider").appendChild(clone);

document.getElementById("Project_List_1") 
.addEventListener("click", function(){
    this.classList.toggle("active");
});
document.getElementById("Project_List_2")   
.addEventListener("click", function(){
    this.classList.toggle("active");
});
document.getElementById("Project_List_3")   
.addEventListener("click", function(){
    this.classList.toggle("active");
});
document.getElementById("Project_List_4")   
.addEventListener("click", function(){
    this.classList.toggle("active");
});
document.getElementById("Project_List_5")   
.addEventListener("click", function(){
    this.classList.toggle("active");
});

let Linked_in = document.getElementById("Linked_in")
Linked_in.addEventListener("click",()=>{
    window.open("https://www.linkedin.com/in/siriki-sai-dhanush-404b5324a/")
})
let Github = document.getElementById("Github")
Github.addEventListener("click",()=>{
    window.open("https://github.com/")
})

document.addEventListener("DOMContentLoaded", function(){
    emailjs.init("QH51fTLwwmsby2jcc");
    
    document.getElementById("submit_button").addEventListener("click",function(e){
    e.preventDefault();
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;
    
    if (!name || !email || !message) {
        alert("Please fill in all fields.");
        return;
    }
    emailjs.send("service_oj5zrtc","template_4y9qy3s",{
        from_name: name,
        from_email: email,
        message: message
    }).then(function(response){
        alert("Message sent successfully!");
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("message").value = "";
    })
    .catch(function(error){
        alert("Failed to send message. Please try again later.");
    });
});
});


