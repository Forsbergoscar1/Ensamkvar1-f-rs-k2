// === ui.js ===
// Lightbox: öppna på klick, stäng på overlay/knapp/ESC
(function () {
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

  document.addEventListener("click", (e) => {
    const img = e.target.closest(".tile img");
    const lb  = document.getElementById("lightbox");
    if (img && lb) {
      // ✅ Hämta text från data-caption eller figcaption
      const caption = img.dataset.caption || 
        img.closest(".tile")?.querySelector("figcaption")?.textContent?.trim() || "";
      lb.querySelector("img").src = img.src;
      lb.querySelector(".caption").textContent = caption;
      lb.hidden = false;
      document.body.style.overflow = "hidden";
    }
  });

  // Stäng på overlay eller knapp
  document.addEventListener("click", (e) => {
    const lb = document.getElementById("lightbox");
    if (!lb || lb.hidden) return;
    if (e.target.matches(".lightbox, .lightbox .close")) {
      lb.hidden = true;
      document.body.style.overflow = "";
    }
  });

  // Stäng på Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const lb = document.getElementById("lightbox");
      if (lb && !lb.hidden) {
        lb.hidden = true;
        document.body.style.overflow = "";
      }
    }
  });

  // Logout (hem)
  const logout = document.getElementById("logoutBtn");
  on(logout, "click", (e) => {
    e.preventDefault();
    sessionStorage.removeItem("noraUnlocked");
    window.location.href = "index.html";
  });
})();
