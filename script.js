(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var body = document.body;
  var nav = document.getElementById("nav");
  var lenis = null;

  /* ---------- Hero entrance ---------- */
  /* The preloader (fx.js) adds "ready"; fall back if it did not load. */
  function releasePage() {
    body.classList.add("ready");
    var l = document.getElementById("loader");
    if (l && l.parentNode) l.parentNode.removeChild(l);
    document.documentElement.style.overflow = ""; body.style.overflow = "";
    if (lenis) lenis.start();
  }
  setTimeout(function () { if (!window.__fx) releasePage(); }, 1500);
  setTimeout(function () { if (!body.classList.contains("ready")) releasePage(); }, 14000);

  /* ---------- Smooth scroll (Lenis, optional) ---------- */
  if (window.Lenis && !reduce) {
    lenis = new Lenis({
      duration: 1.5,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }
    });
    window.lenis = lenis;
    if (document.getElementById("loader")) lenis.stop();
    var raf = function (time) { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById("menu-btn");
  var menu = document.getElementById("mobile-menu");
  function setMenu(open) {
    body.classList.toggle("menu-open", open);
    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (menu) menu.setAttribute("aria-hidden", String(!open));
    if (lenis) { open ? lenis.stop() : lenis.start(); }
    else { body.style.overflow = open ? "hidden" : ""; }
  }
  if (menuBtn) menuBtn.addEventListener("click", function () { setMenu(!body.classList.contains("menu-open")); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---------- Anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (!id || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var wasOpen = body.classList.contains("menu-open");
      if (wasOpen) setMenu(false);
      if (lenis) lenis.scrollTo(target, { offset: -60 });
      else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      if (history.replaceState) history.replaceState(null, "", id);
    });
  });
  var topLink = document.querySelector(".to-top");
  if (topLink) topLink.addEventListener("click", function (e) {
    e.preventDefault();
    if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Scroll progress + nav state ---------- */
  var fill = document.getElementById("progress-fill");
  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (fill) fill.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Active nav link ---------- */
  var links = document.querySelectorAll(".nav-links a");
  var map = {};
  links.forEach(function (l) { map[l.getAttribute("href")] = l; });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          var l = map["#" + en.target.id];
          if (l) l.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["about", "experience", "education", "skills", "projects", "contact"].forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  /* ---------- Rotating roles ---------- */
  var roles = Array.prototype.slice.call(document.querySelectorAll(".roles li"));
  if (roles.length) {
    var ri = 0;
    roles[0].classList.add("on");
    if (!reduce) {
      setInterval(function () {
        roles[ri].classList.remove("on");
        ri = (ri + 1) % roles.length;
        roles[ri].classList.add("on");
      }, 2200);
    }
  }

  /* ---------- About: word-by-word reveal ---------- */
  var para = document.querySelector("[data-words]");
  if (para) {
    var words = para.textContent.trim().split(/\s+/);
    para.textContent = "";
    var spans = words.map(function (w) {
      var s = document.createElement("span");
      s.className = "w";
      s.textContent = w;
      para.appendChild(s);
      para.appendChild(document.createTextNode(" "));
      return s;
    });
    var update = function () {
      if (reduce) { spans.forEach(function (s) { s.classList.add("on"); }); return; }
      var r = para.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.3)));
      var n = Math.round(p * spans.length);
      spans.forEach(function (s, i) { s.classList.toggle("on", i < n); });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Local time (IST) ---------- */
  var clock = document.getElementById("clock");
  if (clock && window.Intl && Intl.DateTimeFormat) {
    var fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    var tick = function () { clock.textContent = fmt.format(new Date()) + " IST"; };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Contact form (EmailJS, same keys as before) ---------- */
  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");
  var submitBtn = document.getElementById("submit_button");
  if (form && window.emailjs) {
    emailjs.init("QH51fTLwwmsby2jcc");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("name").value.trim();
      var email = document.getElementById("email").value.trim();
      var message = document.getElementById("message").value.trim();
      if (!name || !email || !message) {
        statusEl.textContent = "Please fill in all fields.";
        statusEl.classList.add("error");
        return;
      }
      statusEl.classList.remove("error");
      statusEl.textContent = "Sending...";
      submitBtn.disabled = true;
      emailjs.send("service_oj5zrtc", "template_4y9qy3s", {
        from_name: name, from_email: email, message: message
      }).then(function () {
        statusEl.textContent = "Message sent. Thank you!";
        form.reset();
      }).catch(function () {
        statusEl.textContent = "Could not send. Please try again or email me directly.";
        statusEl.classList.add("error");
      }).finally(function () {
        submitBtn.disabled = false;
      });
    });
  } else if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      statusEl.textContent = "The form is unavailable right now. Please email me directly.";
      statusEl.classList.add("error");
    });
  }

  /* ---------- Background footage playback (unchanged behaviour) ---------- */
  var video = document.getElementById("silk-video-bg");
  if (video) {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    var start = function () {
      var p = video.play();
      if (p && typeof p.catch === "function") p.catch(function () {});
    };
    if (video.readyState >= 2) start();
    else video.addEventListener("canplay", start, { once: true });
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && video.paused) start();
    });
  }
})();
