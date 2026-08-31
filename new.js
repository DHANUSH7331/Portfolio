/* ============ TYPING ROLE EFFECT ============ */
const roles = ["Full Stack Developer", "Python Developer", "Data Analyst", "ML Enthusiast"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById("typed-role");

function typeLoop() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
        typedEl.textContent = currentRole.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentRole.length) {
            setTimeout(() => { isDeleting = true; }, 1400);
        }
    } else {
        typedEl.textContent = currentRole.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    setTimeout(typeLoop, isDeleting ? 50 : 90);
}
typeLoop();

/* ============ PROJECT EXPAND / COLLAPSE ============ */
document.querySelectorAll(".project-row").forEach((row) => {
    const head = row.querySelector(".project-head");
    head.addEventListener("click", () => {
        row.classList.toggle("active");
    });
});

/* ============ CONTACT FORM (EmailJS) ============ */
document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("QH51fTLwwmsby2jcc");

    document.getElementById("contact-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        if (!name || !email || !message) {
            alert("Please fill in all fields.");
            return;
        }

        emailjs.send("service_oj5zrtc", "template_4y9qy3s", {
            from_name: name,
            from_email: email,
            message: message
        }).then(function () {
            alert("Message sent successfully!");
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("message").value = "";
        }).catch(function () {
            alert("Failed to send message. Please try again later.");
        });
    });
});