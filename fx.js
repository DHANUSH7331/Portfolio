/* Page effects: preloader, square trail cursor, scroll squeeze, hero curtain, scroll-driven reveals */
(function () {
  "use strict";
  window.__fx = true;
  var doc = document, html = doc.documentElement, body = doc.body;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  /* ================= Preloader ================= */
  (function () {
    var loader = doc.getElementById("loader");
    if (!loader) { body.classList.add("ready"); return; }
    var num = doc.getElementById("loader-num"), arc = doc.getElementById("loader-arc");
    var C = 2 * Math.PI * 54, val = 0, cancelTween = null, finished = false;
    arc.style.strokeDasharray = String(C); arc.style.strokeDashoffset = String(C);
    function paint() {
      arc.style.strokeDashoffset = String(C * (1 - val / 100));
      num.textContent = String(Math.round(val)).padStart(2, "0");
    }
    paint();

    var prevHtml = html.style.overflow, prevBody = body.style.overflow;
    html.style.overflow = "hidden"; body.style.overflow = "hidden";
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    var KEYS = [" ", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown"];
    var onWheel = function (e) { if (e.ctrlKey) return; if (e.cancelable) e.preventDefault(); };
    var onKey = function (e) { if (KEYS.indexOf(e.key) > -1 && e.cancelable) e.preventDefault(); };
    var onScroll = function () { if (window.scrollY !== 0) window.scrollTo(0, 0); };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchmove", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll);

    function tween(from, to, ms, done) {
      var t0 = performance.now(), dead = false;
      cancelTween = function () { dead = true; };
      (function step(now) {
        if (dead) return;
        var p = clamp((now - t0) / ms, 0, 1), e = 1 - (1 - p) * (1 - p);
        val = from + (to - from) * e; paint();
        if (p < 1) requestAnimationFrame(step); else if (done) done();
      })(t0);
    }
    function finish() {
      if (finished) return; finished = true;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      html.style.overflow = prevHtml; body.style.overflow = prevBody;
      if (loader.parentNode) loader.parentNode.removeChild(loader);
      window.scrollTo(0, 0);
      if (window.lenis) { window.lenis.scrollTo(0, { immediate: true, force: true }); window.lenis.start(); }
      window.dispatchEvent(new Event("loader:done"));
    }
    function exit() {
      loader.classList.add("is-out");
      setTimeout(function () { window.scrollTo(0, 0); body.classList.add("ready"); }, 750);
      setTimeout(finish, 1500);
    }

    var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
    var preload = function (src) {
      return new Promise(function (res) {
        var t = setTimeout(res, 8000), i = new Image();
        i.onload = i.onerror = function () { clearTimeout(t); res(); };
        i.src = src;
      });
    };
    var fonts = function () { return doc.fonts ? Promise.race([doc.fonts.ready, wait(2500)]) : Promise.resolve(); };
    var loaded = function () {
      return doc.readyState === "complete" ? Promise.resolve() : new Promise(function (r) { window.addEventListener("load", r, { once: true }); });
    };
    var images = (loader.getAttribute("data-images") || "").split("|").filter(Boolean).map(preload);

    tween(0, 88, 3000);
    Promise.race([Promise.all(images.concat([fonts(), loaded(), wait(1800)])), wait(10000)]).then(function () {
      if (cancelTween) cancelTween();
      tween(val, 100, 600, function () { setTimeout(exit, 200); });
    });
  })();

  /* ================= Square trail cursor ================= */
  (function () {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    var N = 12, HALF = 5;
    var wrap = doc.createElement("div"); wrap.className = "cur-wrap"; wrap.setAttribute("aria-hidden", "true");
    var trailW = [], trailI = [], i;
    for (i = N - 1; i >= 0; i--) {
      var w = doc.createElement("div"); w.className = "cur";
      var s = doc.createElement("div"); s.className = "cur-trail";
      w.appendChild(s); wrap.appendChild(w); trailW[i] = w; trailI[i] = s;
    }
    var mainW = doc.createElement("div"); mainW.className = "cur";
    var mainI = doc.createElement("div"); mainI.className = "cur-main";
    mainW.appendChild(mainI); wrap.appendChild(mainW);
    body.appendChild(wrap);
    var st = doc.createElement("style"); st.textContent = "html, html * { cursor: none !important; }"; doc.head.appendChild(st);

    var shown = false, hov = false, down = false;
    var target = { x: 0, y: 0 }, main = { x: 0, y: 0 }, trail = [];
    for (i = 0; i < N; i++) trail.push({ x: 0, y: 0 });
    var SEL = 'a, button, input, textarea, select, label, summary, [role="button"], [data-cursor="hover"]';
    function place(el, p) { el.style.transform = "translate3d(" + (p.x - HALF) + "px," + (p.y - HALF) + "px,0)"; }
    function paintAll() { place(mainW, main); for (var k = 0; k < N; k++) place(trailW[k], trail[k]); }
    function look() {
      mainI.style.transform = shown ? "scale(" + ((hov ? 2.6 : 1) * (down ? 0.7 : 1)) + ") rotate(" + (hov ? 45 : 0) + "deg)" : "scale(0) rotate(0deg)";
      mainI.style.opacity = shown ? "1" : "0";
      mainI.style.backgroundColor = "rgba(255,122,26," + (hov ? 0.12 : 1) + ")";
      for (var k = 0; k < N; k++) {
        trailI[k].style.opacity = shown && !hov ? String(0.5 * (1 - k / N)) : "0";
        trailI[k].style.transform = "scale(" + (shown ? (1 - k / N * 0.55) * (down ? 0.8 : 1) : 0) + ")";
      }
    }
    function snap(x, y) {
      target.x = main.x = x; target.y = main.y = y;
      for (var k = 0; k < N; k++) { trail[k].x = x; trail[k].y = y; }
      paintAll();
    }
    function show(x, y) {
      if (shown) return;
      shown = true; snap(x, y);
      mainI.classList.add("pop"); look();
      setTimeout(function () { mainI.classList.remove("pop"); }, 450);
    }
    function hide() { shown = false; hov = false; down = false; look(); }

    var last = performance.now();
    function tick(now) {
      var dt = Math.min(now - last, 100) / 1000; last = now;
      if (shown) {
        var a = 1 - Math.pow(1 - 0.5, dt * 60), b = 1 - Math.pow(1 - 0.4, dt * 60), moved = false;
        var follow = function (p, to, f) {
          var dx = to.x - p.x, dy = to.y - p.y;
          if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;
          p.x += dx * f; p.y += dy * f; moved = true;
        };
        follow(main, target, a);
        var prev = main;
        for (var k = 0; k < N; k++) { follow(trail[k], prev, b); prev = trail[k]; }
        if (moved) paintAll();
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    window.addEventListener("mousemove", function (e) {
      if (!shown) { show(e.clientX, e.clientY); return; }
      target.x = e.clientX; target.y = e.clientY;
    }, { passive: true });
    window.addEventListener("mouseover", function (e) {
      var h = !!(e.target instanceof Element && e.target.closest(SEL));
      if (h !== hov) { hov = h; if (shown) look(); }
    }, { passive: true });
    window.addEventListener("mousedown", function () { down = true; if (shown) look(); });
    window.addEventListener("mouseup", function () { down = false; if (shown) look(); });
    html.addEventListener("mouseenter", function (e) { show(e.clientX, e.clientY); });
    html.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
  })();

  /* ================= Hero curtain (sticky hero recedes as About slides over) ================= */
  var hero = doc.getElementById("home"), about = doc.getElementById("about");
  if (hero && about && !reduce) {
    hero.style.transformOrigin = "50% 100%";
    var curtain = function () {
      var vh = window.innerHeight, top = about.getBoundingClientRect().top;
      var p = clamp((vh - top) / vh, 0, 1);
      hero.style.opacity = String(1 - p);
      hero.style.visibility = p >= 1 ? "hidden" : "visible";
      hero.style.transform = "translateY(" + (-12 * p) + "%) scale(" + (1 - 0.08 * p) + ")";
    };
    window.addEventListener("scroll", curtain, { passive: true });
    window.addEventListener("resize", curtain);
    curtain();
  }

  /* ================= Scroll squeeze (sections compress with scroll velocity) ================= */
  var mq = window.matchMedia("(min-width: 768px) and (hover: hover) and (prefers-reduced-motion: no-preference)");
  (function () {
    if (!mq.matches || !window.lenis) return;
    var els = [].slice.call(doc.querySelectorAll("main > *:not([data-no-squeeze])"));
    if (!els.length) return;
    els.forEach(function (el) { el.style.willChange = "transform"; el.style.transition = "transform .45s cubic-bezier(.215,.61,.355,1)"; });
    var offsetTop = function (el) { var t = 0; while (el) { t += el.offsetTop; el = el.offsetParent; } return t; };
    var timer;
    function apply(c) {
      var vh = window.innerHeight, sy = window.scrollY;
      els.forEach(function (el) {
        var top = offsetTop(el), inV = top + el.offsetHeight > sy && top < sy + vh;
        if (inV && c > 0) el.style.transformOrigin = "50% " + (sy + vh / 2 - top) + "px";
        el.style.transform = "scale(" + (inV ? 1 - c * 0.35 : 1) + "," + (inV ? 1 - c : 1) + ")";
      });
    }
    window.lenis.on("scroll", function (e) {
      var c = Math.min(Math.abs(e.velocity || 0) / 30, 1) * 0.3;
      apply(c);
      clearTimeout(timer); timer = setTimeout(function () { apply(0); }, 150);
    });
  })();

  /* ================= Scroll-driven reveals (titles, text, images) + sticky heading fade ================= */
  (function () {
    var blocks = [].slice.call(doc.querySelectorAll("[data-rv]"));
    blocks.forEach(function (b) {
      var k = 0;
      [].slice.call(b.querySelectorAll("[data-it]")).forEach(function (el) { el.style.setProperty("--k", Math.min(k++, 8)); });
    });
    var stks = [].slice.call(doc.querySelectorAll("[data-stk]"));
    function check() {
      var vh = window.innerHeight;
      blocks.forEach(function (b) {
        var on;
        if (reduce) on = true;
        else {
          var img = b.querySelector("[data-img]");
          if (img) { var r = img.getBoundingClientRect(); on = r.top + r.height / 2 < vh * 0.75; }
          else { on = b.getBoundingClientRect().top < vh * 0.8; }
        }
        b.classList.toggle("in", on);
      });
      stks.forEach(function (s) {
        var first = s.querySelector("[data-rv]"), h = s.querySelector("[data-heading]");
        if (!first || !h) return;
        var p = reduce ? 0 : clamp((vh * 0.85 - first.getBoundingClientRect().top) / (vh * 0.55), 0, 1);
        h.style.opacity = String(1 - 0.92 * p);
      });
    }
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    window.addEventListener("loader:done", check);
    check();

    /* "View" pill follows the cursor over linked project images */
    doc.querySelectorAll("[data-pillhost]").forEach(function (host) {
      var pill = host.querySelector("[data-pill]");
      if (!pill) return;
      host.addEventListener("mousemove", function (e) {
        var r = host.getBoundingClientRect();
        pill.style.transform = "translate(" + (e.clientX - r.left) + "px," + (e.clientY - r.top) + "px) translate(-50%,-50%)";
      });
    });
  })();
})();
