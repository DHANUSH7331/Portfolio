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
        ctx.strokeStyle = "rgba(218, 180, 123, 0.28)";
        ctx.fillStyle = "rgba(239, 211, 164, 0.5)";

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

/* ============ PROJECT ACCORDION — EXCLUSIVE & CACHE-BUSTED FIX ============ */
(function projectAccordion(){
 const rows=[...document.querySelectorAll("#projects .project-row")];
 if(!rows.length)return;

 function updateRow(row,open){
  const body=row.querySelector(".project-body");
  const button=row.querySelector(".expand-btn");
  row.classList.toggle("active",open);
  if(button){
   button.setAttribute("aria-expanded",String(open));
   button.setAttribute("aria-label",open?"Collapse project details":"Expand project details");
  }
  if(body){
   body.style.setProperty("--project-body-height",open?"0px":"0px");
   if(open){
    requestAnimationFrame(()=>body.style.setProperty("--project-body-height",body.scrollHeight+"px"));
   }
  }
 }

 rows.forEach(row=>{
  updateRow(row,false);
  const head=row.querySelector(".project-head");
  if(!head)return;
  head.addEventListener("click",event=>{
   if(event.target.closest("a"))return;
   const wasOpen=row.classList.contains("active");
   rows.forEach(item=>updateRow(item,false));
   if(!wasOpen)updateRow(row,true);
  });
 });

 window.addEventListener("resize",()=>{
  const openRow=rows.find(row=>row.classList.contains("active"));
  if(!openRow)return;
  const body=openRow.querySelector(".project-body");
  if(body)body.style.setProperty("--project-body-height",body.scrollHeight+"px");
 },{passive:true});
})();
/* ============ CONTACT FORM/* ============ CONTACT FORM (EmailJS) ============ */
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

/* ============ MOTION CONTROLLER ============ */
(function motionController(){
  const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const progress=document.getElementById("scroll-progress-fill");
  const glow=document.querySelector(".cursor-glow");
  const photo=document.querySelector(".hero-photo-frame");
  let pointerX=window.innerWidth/2,pointerY=window.innerHeight/2;
  let targetX=pointerX,targetY=pointerY;
  let framePending=false;

  function updateScroll(){
    const max=document.documentElement.scrollHeight-window.innerHeight;
    if(progress)progress.style.width=(max>0?(window.scrollY/max)*100:0)+"%";
  }
  window.addEventListener("scroll",updateScroll,{passive:true});
  updateScroll();

  if(!reduceMotion && window.matchMedia("(hover:hover) and (pointer:fine)").matches){
    window.addEventListener("pointermove",event=>{
      targetX=event.clientX;targetY=event.clientY;
      if(!framePending){
        framePending=true;
        requestAnimationFrame(()=>{
          pointerX+=(targetX-pointerX)*.22;
          pointerY+=(targetY-pointerY)*.22;
          if(glow){glow.style.left=pointerX+"px";glow.style.top=pointerY+"px";}
          framePending=false;
        });
      }
      const card=event.target.closest(".skill-panel,.project-row,.experience-card,.contact-form");
      if(card){
        const rect=card.getBoundingClientRect();
        card.style.setProperty("--mx",(event.clientX-rect.left)+"px");
        card.style.setProperty("--my",(event.clientY-rect.top)+"px");
      }
      if(photo){
        const rect=photo.getBoundingClientRect();
        const x=(event.clientX-(rect.left+rect.width/2))/rect.width;
        const y=(event.clientY-(rect.top+rect.height/2))/rect.height;
        photo.style.setProperty("--tilt-x",(-y*5)+"deg");
        photo.style.setProperty("--tilt-y",(x*7)+"deg");
      }
    },{passive:true});
    if(photo)photo.addEventListener("pointerleave",()=>{photo.style.setProperty("--tilt-x","0deg");photo.style.setProperty("--tilt-y","0deg");});
    document.querySelectorAll(".hero-actions .btn").forEach(btn=>{
      btn.addEventListener("pointermove",event=>{
        const r=btn.getBoundingClientRect();
        btn.style.transform="translate("+((event.clientX-r.left-r.width/2)*.08)+"px,"+((event.clientY-r.top-r.height/2)*.12)+"px)";
      });
      btn.addEventListener("pointerleave",()=>btn.style.transform="");
    });
  }

  const links=[...document.querySelectorAll(".sidebar-nav a")];
  const sections=links.map(link=>document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if("IntersectionObserver" in window){
    const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting)links.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+entry.target.id));
    }),{rootMargin:"-35% 0px -55% 0px",threshold:0});
    sections.forEach(section=>navObserver.observe(section));
  }
  const revealTargets=document.querySelectorAll(".section-label,.experience-card,.skill-panel,.edu-node,.project-row,.contact-copy,.contact-form");
  revealTargets.forEach((el,index)=>{el.classList.add("reveal-ready");el.style.transitionDelay=(index%4)*90+"ms";});
  if("IntersectionObserver" in window){
    const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("revealed");revealObserver.unobserve(entry.target);}
    }),{threshold:.1});
    revealTargets.forEach(el=>revealObserver.observe(el));
  }else revealTargets.forEach(el=>el.classList.add("revealed"));

  const toggle=document.getElementById("mobile-menu-toggle");
  if(toggle)toggle.addEventListener("click",()=>{
    const sidebar=document.getElementById("portfolio-sidebar");
    const open=sidebar.classList.toggle("mobile-open");
    toggle.setAttribute("aria-expanded",String(open));
    toggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");
  });
})();

/* ============ TOP NAV SCROLL STATE + ACTIVE SECTION ============ */
(function topNavigation(){
 const nav=document.getElementById("top-nav");
 const links=[...document.querySelectorAll(".top-nav-links a")];
 const sections=links.map(link=>document.querySelector(link.getAttribute("href"))).filter(Boolean);
 const update=()=>{if(nav)nav.classList.toggle("scrolled",window.scrollY>24)};
 window.addEventListener("scroll",update,{passive:true});update();
 if("IntersectionObserver" in window){
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(entry.isIntersecting)links.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+entry.target.id));
   });
  },{rootMargin:"-35% 0px -55% 0px",threshold:0});
  sections.forEach(section=>observer.observe(section));
 }
})();


/* ============ PORTRAIT PARALLAX ============ */
(function portraitParallax(){
 const portrait=document.querySelector(".hero-photo-frame");
 if(!portrait || window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !window.matchMedia("(hover:hover) and (pointer:fine)").matches)return;
 let raf=0;
 portrait.addEventListener("pointermove",event=>{
  if(raf)return;
  raf=requestAnimationFrame(()=>{
   const rect=portrait.getBoundingClientRect();
   const x=(event.clientX-rect.left)/rect.width-.5;
   const y=(event.clientY-rect.top)/rect.height-.5;
   portrait.style.setProperty("--tilt-x",(-y*6)+"deg");
   portrait.style.setProperty("--tilt-y",(x*8)+"deg");
   raf=0;
  });
 });
 portrait.addEventListener("pointerleave",()=>{
  portrait.style.setProperty("--tilt-x","0deg");
  portrait.style.setProperty("--tilt-y","0deg");
 });
})();
