/* ============ BOOT SEQUENCE ============ */
(function boot() {
    const lines = [
        "> initializing core systems...",
        "> loading profile: S. Sai Dhanush",
        "> mounting skill modules... OK",
        "> mounting project archive... OK",
        "> handshake complete."
    ];
    const logEl = document.getElementById("boot-log");
    const fillEl = document.getElementById("boot-fill");
    const screenEl = document.getElementById("boot-screen");

    document.body.style.overflow = "hidden";

    let i = 0;
    function nextLine() {
        if (i < lines.length) {
            logEl.textContent += (i > 0 ? "\n" : "") + lines[i];
            i++;
            setTimeout(nextLine, 260);
        }
    }
    nextLine();
    requestAnimationFrame(() => { fillEl.style.width = "100%"; });

    setTimeout(() => {
        screenEl.classList.add("done");
        document.body.style.overflow = "";
        setTimeout(() => screenEl.remove(), 700);
    }, 1700);
})();

/* ============ AMBIENT GRID CANVAS ============ */
(function gridBackground() {
    const canvas = document.getElementById("grid-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, nodes;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        const count = Math.min(70, Math.floor((w * h) / 22000));
        nodes = Array.from({ length: count }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25
        }));
    }

    function step() {
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = "rgba(0, 229, 255, 0.30)";
        ctx.fillStyle = "rgba(255, 43, 214, 0.58)";

        for (const n of nodes) {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > w) n.vx *= -1;
            if (n.y < 0 || n.y > h) n.vy *= -1;
        }

        for (let a = 0; a < nodes.length; a++) {
            for (let b = a + 1; b < nodes.length; b++) {
                const dx = nodes[a].x - nodes[b].x;
                const dy = nodes[a].y - nodes[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    ctx.globalAlpha = (1 - dist / 140) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(nodes[a].x, nodes[a].y);
                    ctx.lineTo(nodes[b].x, nodes[b].y);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;
        for (const n of nodes) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
            ctx.fill();
        }

        if (!prefersReducedMotion) requestAnimationFrame(step);
    }

    window.addEventListener("resize", resize);
    resize();
    step();
})();

/* ============ TYPING ROLE EFFECT ============ */
const roles = ["Junior Developer", "Python Developer", "Web Developer", "AI Automation Learner"];
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

/* ============ SKILL BARS — REVEAL ON SCROLL ============ */
document.querySelectorAll(".skill-panel").forEach((panel) => {
    const level = panel.getAttribute("data-level") || "0";
    panel.style.setProperty("--fill", level + "%");
});

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll(".skill-panel").forEach((panel) => skillObserver.observe(panel));

/* ============ PROJECT EXPAND / COLLAPSE ============ */
document.querySelectorAll(".project-row").forEach((row) => {
    const head = row.querySelector(".project-head");
    head.addEventListener("click", (event) => {
        row.classList.toggle("active");
        const button = row.querySelector(".expand-btn");
        if (button) {
            const expanded = row.classList.contains("active");
            button.setAttribute("aria-expanded", String(expanded));
            button.setAttribute("aria-label", expanded ? "Collapse project details" : "Expand project details");
        }
    });
});

/* ============ CONTACT FORM (EmailJS) ============ */
document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("QH51fTLwwmsby2jcc");

    const form = document.getElementById("contact-form");
    const statusEl = document.getElementById("form-status");
    const submitBtn = document.getElementById("submit_button");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        if (!name || !email || !message) {
            statusEl.textContent = "> all fields required.";
            statusEl.classList.add("error");
            return;
        }

        statusEl.classList.remove("error");
        statusEl.textContent = "> transmitting...";
        submitBtn.disabled = true;

        emailjs.send("service_oj5zrtc", "template_4y9qy3s", {
            from_name: name,
            from_email: email,
            message: message
        }).then(function () {
            statusEl.textContent = "> message delivered.";
            form.reset();
        }).catch(function () {
            statusEl.textContent = "> transmission failed. try again.";
            statusEl.classList.add("error");
        }).finally(function () {
            submitBtn.disabled = false;
        });
    });
});

/* ============ CYBER COMMAND INTERACTIONS ============ */
(function cyberInteractions(){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const aura = document.querySelector(".cursor-aura");
  const photo = document.querySelector(".hero-photo-frame");
  if (!reduce && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    let px=innerWidth/2, py=innerHeight/2, ax=px, ay=py;
    window.addEventListener("pointermove", e=>{
      px=e.clientX; py=e.clientY;
      if(aura){aura.style.left=px+"px";aura.style.top=py+"px";aura.style.opacity="1";}
      if(photo){
        const r=photo.getBoundingClientRect();
        const dx=(e.clientX-(r.left+r.width/2))/(r.width/2);
        const dy=(e.clientY-(r.top+r.height/2))/(r.height/2);
        if(Math.abs(dx)<1.6 && Math.abs(dy)<1.6){
          photo.style.animation="none";
          photo.style.transform="perspective(900px) rotateY("+(-dx*10)+"deg) rotateX("+(dy*8)+"deg) translateZ(8px)";
        } else photo.style.transform="";
      }
    },{passive:true});
    window.addEventListener("pointerleave",()=>{if(aura)aura.style.opacity="0";if(photo)photo.style.transform="";});
  }
  const revealTargets=document.querySelectorAll(".section-label,.experience-card,.skill-panel,.edu-node,.project-row,.contact-copy,.contact-form");
  revealTargets.forEach(el=>el.classList.add("reveal-ready"));
  if("IntersectionObserver" in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("revealed");observer.unobserve(entry.target);}
    }),{threshold:.12,rootMargin:"0px 0px -35px 0px"});
    revealTargets.forEach(el=>observer.observe(el));
  } else revealTargets.forEach(el=>el.classList.add("revealed"));
  document.querySelectorAll(".skill-panel,.project-row").forEach((el,i)=>{
    el.style.transitionDelay=(i%4)*55+"ms";
  });
})();
