// RuBuild site v3: menu, products menu, product switcher, tabs, galleries, reveal, store links
(function () {
  var APPSOURCE_URL = "https://marketplace.microsoft.com/en-us/product/WA200013100";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // mobile menu
  var btn = document.querySelector(".menu-btn"), links = document.getElementById("nav-links");
  if (btn && links) btn.addEventListener("click", function () {
    var open = links.classList.toggle("open"); btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Products menu
  var drop = document.querySelector(".nav-drop");
  if (drop) {
    var dbtn = drop.querySelector("button"), timer;
    var set = function (open) { drop.classList.toggle("open", open); dbtn.setAttribute("aria-expanded", open ? "true" : "false"); };
    dbtn.addEventListener("click", function (e) { e.stopPropagation(); set(!drop.classList.contains("open")); });
    if (window.matchMedia("(hover: hover)").matches) {
      drop.addEventListener("mouseenter", function () { clearTimeout(timer); set(true); });
      drop.addEventListener("mouseleave", function () { timer = setTimeout(function () { set(false); }, 180); });
    }
    document.addEventListener("click", function (e) { if (!drop.contains(e.target)) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drop.classList.contains("open")) { set(false); dbtn.focus(); } });
  }

  // tabs (home product switcher + Puzzles game tabs)
  function tabs(list, onChange) {
    var ts = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function select(t, focus) {
      ts.forEach(function (x) {
        var on = x === t, p = document.getElementById(x.getAttribute("aria-controls"));
        x.setAttribute("aria-selected", on ? "true" : "false"); x.tabIndex = on ? 0 : -1;
        if (p) p.hidden = !on;
      });
      if (focus) t.focus();
      if (onChange) onChange(t);
    }
    ts.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t, false); if (onChange) onChange(t, true); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, n = null;
        if (k === "ArrowRight") n = ts[(i + 1) % ts.length];
        if (k === "ArrowLeft") n = ts[(i - 1 + ts.length) % ts.length];
        if (k === "Home") n = ts[0];
        if (k === "End") n = ts[ts.length - 1];
        if (n) { e.preventDefault(); select(n, true); if (onChange) onChange(n, true); }
      });
    });
    ts.forEach(function (t) { var p = document.getElementById(t.getAttribute("aria-controls")); if (p) p.hidden = t.getAttribute("aria-selected") !== "true"; });
    return { tabs: ts, select: select };
  }

  document.querySelectorAll("[data-tabs]").forEach(function (l) { tabs(l); });

  // home showcase: auto-advances until the visitor interacts
  var sc = document.querySelector("[data-showcase]");
  if (sc) {
    var MS = 7000, tm, stopped = reduce, api;
    var next = function () {
      var ts = api.tabs, cur = ts.findIndex(function (t) { return t.getAttribute("aria-selected") === "true"; });
      api.select(ts[(cur + 1) % ts.length], false);
    };
    var schedule = function () {
      clearTimeout(tm); sc.classList.remove("playing");
      if (stopped || api.tabs.length < 2) return;
      void sc.offsetWidth; sc.classList.add("playing");
      tm = setTimeout(next, MS);
    };
    api = tabs(sc.querySelector('[role="tablist"]'), function (t, byUser) { if (byUser) { stopped = true; } schedule(); });
    sc.style.setProperty("--sc-ms", MS + "ms");
    var pause = function () { clearTimeout(tm); sc.classList.remove("playing"); };
    sc.addEventListener("mouseenter", pause);
    sc.addEventListener("mouseleave", schedule);
    sc.addEventListener("focusin", pause);
    schedule();
  }

  // galleries: thumbnails / theme swatches swap the main picture
  document.querySelectorAll("[data-gallery]").forEach(function (g) {
    var main = g.querySelector("[data-main]"); if (!main) return;
    var img = main.querySelector("img"), src = main.querySelector("source"), cap = main.querySelector("figcaption");
    var btns = g.querySelectorAll("button[data-img]");
    btns.forEach(function (b) {
      var pre = new Image(); pre.src = "/assets/img/" + b.getAttribute("data-img") + ".webp";
      b.addEventListener("click", function () {
        var n = b.getAttribute("data-img"), c = b.getAttribute("data-cap");
        if (src) src.srcset = "/assets/img/" + n + ".webp";
        img.src = "/assets/img/" + n + ".jpg"; img.alt = c;
        if (cap) cap.textContent = c;
        btns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      });
    });
  });

  // gentle reveal on scroll
  var rv = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add("in"); });

  // Microsoft Marketplace links
  document.querySelectorAll("a.appsource").forEach(function (a) {
    if (APPSOURCE_URL) { a.href = APPSOURCE_URL; a.target = "_blank"; a.rel = "noopener"; }
    else { var s = a.querySelector(".lbl"); if (s) s.textContent = "Coming soon to Microsoft Marketplace"; }
  });
})();
