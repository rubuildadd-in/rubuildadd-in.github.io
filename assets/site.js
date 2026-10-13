// RuBuild site: mobile menu + AppSource links
(function () {
  var APPSOURCE_URL = "";
  var btn = document.querySelector(".menu-btn"), links = document.getElementById("nav-links");
  if (btn && links) btn.addEventListener("click", function () {
    var open = links.classList.toggle("open"); btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.querySelectorAll("a.appsource").forEach(function (a) {
    if (APPSOURCE_URL) { a.href = APPSOURCE_URL; a.target = "_blank"; a.rel = "noopener"; }
    else { var s = a.querySelector(".lbl"); if (s) s.textContent = "Coming soon to AppSource"; }
  });
})();
