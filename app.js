/* PWA - Jardinerie Marcipont : service worker + installation */
(function () {
  "use strict";

  // 1) Service worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }

  // 2) Installation "vraie app"
  var standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (standalone) return; // deja installee

  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var deferred = null;

  // Injecte un bouton "Installer l'app" dans le menu mobile
  var panel = document.querySelector(".mobile-panel");
  var btn = null;
  if (panel) {
    btn = document.createElement("a");
    btn.className = "mm-link mm-install";
    btn.href = "#";
    btn.hidden = true;
    btn.textContent = "Installer l'app";
    var cta = panel.querySelector(".mm-cta");
    if (cta) panel.insertBefore(btn, cta); else panel.appendChild(btn);
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (deferred) {
        deferred.prompt();
        deferred.userChoice.then(function () { deferred = null; btn.hidden = true; });
      } else {
        iosSheet();
      }
      var mm = document.getElementById("mobileMenu");
      if (mm) mm.classList.remove("open");
    });
  }
  function show() { if (btn) btn.hidden = false; }

  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; show(); });
  window.addEventListener("appinstalled", function () { if (btn) btn.hidden = true; deferred = null; });
  if (isIOS) show(); // iOS ne declenche pas beforeinstallprompt

  function iosSheet() {
    var ex = document.getElementById("iosInstall");
    if (ex) { ex.hidden = false; return; }
    var o = document.createElement("div");
    o.id = "iosInstall";
    o.style.cssText = "position:fixed;inset:0;z-index:200;display:flex;align-items:flex-end;justify-content:center;background:rgba(6,16,10,.6);backdrop-filter:blur(4px)";
    o.innerHTML =
      '<div style="background:#fff;color:#16241a;max-width:460px;width:100%;margin:12px;border-radius:20px;padding:26px 24px;font-family:system-ui,-apple-system,sans-serif;box-shadow:0 24px 60px -20px rgba(0,0,0,.5)">' +
      '<div style="font-family:Georgia,serif;font-size:1.3rem;font-weight:700;margin-bottom:10px">Installer Jardinerie Marcipont</div>' +
      '<p style="color:#4c5d50;font-size:.98rem;line-height:1.6;margin:0 0 12px">Ajoutez le site à votre écran d\'accueil comme une application :</p>' +
      '<p style="color:#16241a;font-size:1rem;line-height:1.8;margin:0 0 20px">1. Touchez <b>Partager</b> (le carré avec une flèche vers le haut, en bas de Safari).<br>2. Choisissez <b>« Sur l\'écran d\'accueil »</b>.<br>3. Touchez <b>Ajouter</b>.</p>' +
      '<button type="button" style="width:100%;padding:13px;border:none;border-radius:999px;background:#2d6a4f;color:#f3f7ea;font-weight:700;font-size:.98rem;cursor:pointer">J\'ai compris</button></div>';
    o.addEventListener("click", function (ev) { if (ev.target === o || ev.target.tagName === "BUTTON") o.remove(); });
    document.body.appendChild(o);
  }
})();
