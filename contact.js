/* Contact: particle "LET'S TALK", magnetic round CTA, pointer glow, copy buttons */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var sec = document.getElementById("contact");
  if (!sec) return;

  function clamp(v, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a === undefined ? 0 : a, v)); }
  var pointer = { x: -9999, y: -9999 };
  window.addEventListener("pointermove", function (e) { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
  document.addEventListener("pointerleave", function () { pointer.x = pointer.y = -9999; });

  /* ---------- particle text ---------- */
  var box = document.getElementById("ct-title");
  var cv = document.getElementById("ct-canvas");
  if (box && cv && cv.getContext) {
    var ctx = cv.getContext("2d");
    var PAD = 90, COLORS = ["#ffe9d0", "#ff7a1a", "#b8691f"];
    var DESKTOP = ["LET\u2019S TALK"], MOBILE = ["LET\u2019S", "TALK"];
    var W = 0, H = 0, dpr = 1, n = 0, radius = 110, pull = 0, pullStart = 0, inView = false, ready = false, running = false;
    var tx, ty, px, py, vx, vy, thr, sz, col;

    function draw() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);
      ctx.globalAlpha = 0.28 + 0.72 * clamp(pull * 1.5);
      for (var c = 0; c < COLORS.length; c++) {
        ctx.fillStyle = COLORS[c];
        for (var i = 0; i < n; i++) {
          if (col[i] !== c) continue;
          var s = sz[i];
          ctx.fillRect(px[i] - s / 2, py[i] - s / 2, s, s);
        }
      }
      ctx.globalAlpha = 1;
    }

    function build(width, force) {
      if (!ready || !width) return;
      if (!force && n && Math.abs(width - W) < 1) return;
      var cs = getComputedStyle(cv), mobile = width < 700, lines = mobile ? MOBILE : DESKTOP;
      var m = document.createElement("canvas").getContext("2d");
      m.font = cs.fontWeight + " 100px " + cs.fontFamily;
      var tw = Math.max.apply(null, lines.map(function (l) { return m.measureText(l).width; }));
      if (!tw) return;
      var fs = Math.min(width * 0.98 / tw * 100, mobile ? 150 : 190);
      W = Math.round(width); H = Math.ceil(fs * lines.length);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      box.style.height = H + "px";
      cv.width = Math.round((W + PAD * 2) * dpr); cv.height = Math.round((H + PAD * 2) * dpr);
      cv.style.width = (W + PAD * 2) + "px"; cv.style.height = (H + PAD * 2) + "px";
      cv.style.left = -PAD + "px"; cv.style.top = -PAD + "px";

      var off = document.createElement("canvas"); off.width = W; off.height = H;
      var o = off.getContext("2d", { willReadFrequently: true });
      o.font = cs.fontWeight + " " + fs + "px " + cs.fontFamily;
      o.textAlign = "center"; o.textBaseline = "middle"; o.fillStyle = "#fff";
      lines.forEach(function (l, i) { o.fillText(l, W / 2, fs * (i + 0.5)); });
      var data = o.getImageData(0, 0, W, H).data, step = mobile ? 4 : 5, X = [], Y = [];
      for (var y = 0; y < H; y += step) {
        for (var x = 0; x < W; x += step) {
          var sx = Math.min(W - 1, x + (step >> 1)), sy = Math.min(H - 1, y + (step >> 1));
          if (data[(sy * W + sx) * 4 + 3] > 140) { X.push(x + step / 2); Y.push(y + step / 2); }
        }
      }
      n = X.length;
      tx = Float32Array.from(X); ty = Float32Array.from(Y);
      px = new Float32Array(n); py = new Float32Array(n); vx = new Float32Array(n); vy = new Float32Array(n);
      thr = new Float32Array(n); sz = new Float32Array(n); col = new Uint8Array(n);
      var settled = pull >= 1;
      for (var i = 0; i < n; i++) {
        thr[i] = tx[i] / W * 0.5;
        sz[i] = step * (0.62 + Math.random() * 0.3);
        var r = Math.random(); col[i] = r < 0.72 ? 0 : r < 0.92 ? 1 : 2;
        if (settled) { px[i] = tx[i]; py[i] = ty[i]; } else { px[i] = Math.random() * W; py[i] = Math.random() * H; }
      }
      radius = clamp(W * 0.11, 90, 170);
      draw();
    }

    function tick(t) {
      if (!n) return;
      var rect = box.getBoundingClientRect();
      var mx = pointer.x - rect.left, my = pointer.y - rect.top, R2 = radius * radius;
      for (var i = 0; i < n; i++) {
        var e = clamp((pull - thr[i]) / 0.5);
        var k = 0.085 * e;
        var gx = tx[i] + Math.sin(t * 0.0012 + i) * 0.8, gy = ty[i] + Math.cos(t * 0.001 + i * 1.3) * 0.8;
        var ax = (gx - px[i]) * k, ay = (gy - py[i]) * k;
        if (e < 1) { ax += (Math.random() - 0.5) * 0.06 * (1 - e); ay += (Math.random() - 0.5) * 0.06 * (1 - e); }
        var dx = px[i] - mx, dy = py[i] - my, d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 0.01) {
          var d = Math.sqrt(d2), f = (1 - d / radius); f = f * f * 4.5;
          ax += dx / d * f; ay += dy / d * f;
        }
        vx[i] = (vx[i] + ax) * 0.86; vy[i] = (vy[i] + ay) * 0.86;
        px[i] += vx[i]; py[i] += vy[i];
      }
    }

    function burst(cx, cy) {
      if (!n) return;
      var rect = box.getBoundingClientRect(), mx = cx - rect.left, my = cy - rect.top;
      if (mx < -40 || mx > W + 40 || my < -40 || my > H + 40) return;
      var reach = radius * 1.8;
      for (var i = 0; i < n; i++) {
        var dx = px[i] - mx, dy = py[i] - my, d = Math.hypot(dx, dy);
        if (d < reach && d > 0.01) {
          var f = 1 - d / reach; f = f * f * 26;
          vx[i] += dx / d * f + (Math.random() - 0.5) * 6;
          vy[i] += dy / d * f + (Math.random() - 0.5) * 6;
        }
      }
    }
    if (!reduce) window.addEventListener("pointerdown", function (e) { burst(e.clientX, e.clientY); });

    function loop(now) {
      if (!running) return;
      if (pullStart) pull = clamp((now - pullStart) / 2600);
      pull = pull < 0.5 ? 4 * pull * pull * pull : 1 - Math.pow(-2 * pull + 2, 3) / 2;
      tick(now); draw();
      requestAnimationFrame(loop);
    }
    var rawPull = 0;
    function startLoop() { if (running || reduce) return; running = true; requestAnimationFrame(loop); }
    function stopLoop() { running = false; }

    var fontSpec = function () { var cs = getComputedStyle(cv); return cs.fontWeight + " 100px " + cs.fontFamily; };
    var go = function () { ready = true; build(box.clientWidth, true); };
    if (document.fonts && document.fonts.load) document.fonts.load(fontSpec(), "LET\u2019S TALK").catch(function () {}).then(go); else go();

    if ("ResizeObserver" in window) new ResizeObserver(function () { build(box.clientWidth); }).observe(box);
    else window.addEventListener("resize", function () { build(box.clientWidth); });

    if (reduce || !("IntersectionObserver" in window)) {
      pull = 1; var finish = function () { for (var i = 0; i < n; i++) { px[i] = tx[i]; py[i] = ty[i]; } draw(); };
      setTimeout(function () { build(box.clientWidth, true); finish(); }, 300);
    } else {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          inView = e.isIntersecting;
          if (inView) { if (!pullStart) pullStart = performance.now(); startLoop(); } else { stopLoop(); }
        });
      }, { rootMargin: "0px 0px -10% 0px" }).observe(box);
    }
  }

  /* ---------- magnetic CTA ---------- */
  var mag = document.getElementById("ct-magnet");
  if (mag && fine && !reduce) {
    var cx = 0, cy = 0, gx = 0, gy = 0, magRun = false;
    var magTick = function () {
      cx += (gx - cx) * 0.16; cy += (gy - cy) * 0.16;
      mag.style.transform = "translate(" + cx.toFixed(2) + "px," + cy.toFixed(2) + "px)";
      if (Math.abs(gx - cx) > 0.1 || Math.abs(gy - cy) > 0.1) requestAnimationFrame(magTick); else magRun = false;
    };
    window.addEventListener("pointermove", function (e) {
      var r = mag.getBoundingClientRect();
      var ox = r.left + r.width / 2 - cx, oy = r.top + r.height / 2 - cy;
      var dx = e.clientX - ox, dy = e.clientY - oy, d = Math.hypot(dx, dy), reach = r.width * 0.95;
      if (d < reach) { gx = dx * 0.35; gy = dy * 0.35; } else { gx = 0; gy = 0; }
      if (!magRun) { magRun = true; requestAnimationFrame(magTick); }
    }, { passive: true });
  }

  /* ---------- pointer glow ---------- */
  var glow = document.getElementById("ct-glow");
  if (glow && fine && !reduce) {
    var gx2 = 0, gy2 = 0, tx2 = 0, ty2 = 0, on = false, gRun = false;
    var gTick = function () {
      gx2 += (tx2 - gx2) * 0.12; gy2 += (ty2 - gy2) * 0.12;
      glow.style.transform = "translate(" + (gx2 - 320).toFixed(1) + "px," + (gy2 - 320).toFixed(1) + "px)";
      if (on || Math.abs(tx2 - gx2) > 0.5) requestAnimationFrame(gTick); else gRun = false;
    };
    sec.addEventListener("pointermove", function (e) {
      var r = sec.getBoundingClientRect();
      tx2 = e.clientX - r.left; ty2 = e.clientY - r.top;
      if (!on) { on = true; glow.style.opacity = "1"; if (!gRun) { gx2 = tx2; gy2 = ty2; } }
      if (!gRun) { gRun = true; requestAnimationFrame(gTick); }
    });
    sec.addEventListener("pointerleave", function () { on = false; glow.style.opacity = "0"; });
  }

  /* ---------- copy buttons ---------- */
  sec.addEventListener("click", function (e) {
    var btn = e.target.closest(".ct-copy");
    if (!btn) return;
    var text = btn.getAttribute("data-copy");
    var done = function () {
      var old = btn.getAttribute("data-label") || btn.textContent;
      btn.setAttribute("data-label", old);
      btn.textContent = "Copied";
      clearTimeout(btn._t);
      btn._t = setTimeout(function () { btn.textContent = old; }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () {});
    } else {
      var t = document.createElement("textarea"); t.value = text; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select(); try { document.execCommand("copy"); done(); } catch (err) {} document.body.removeChild(t);
    }
  });
})();
