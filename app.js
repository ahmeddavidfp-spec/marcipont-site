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

  // Regle Scribeo : le bouton n'existe que sur Android, et n'apparait que quand
  // le navigateur propose vraiment l'installation. Rien sur ordinateur ni sur iPhone.
  var isAndroid = /android/i.test(navigator.userAgent) ||
    !!(navigator.userAgentData && /android/i.test(navigator.userAgentData.platform || ""));
  if (!isAndroid) return;
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
      }
      var mm = document.getElementById("mobileMenu");
      if (mm) mm.classList.remove("open");
    });
  }
  function show() { if (btn) btn.hidden = false; }

  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; show(); });
  window.addEventListener("appinstalled", function () { if (btn) btn.hidden = true; deferred = null; });

})();
