// === ui.js ===
// Lightbox: öppna på klick, stäng på overlay/knapp/ESC
(function () {
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

  document.addEventListener("click", (e) => {
    const img = e.target.closest(".tile img");
    const lb = document.getElementById("lightbox");
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

  // ===== Lightbox pinch-zoom på bilden (mobil) =====
(function () {
  const lightbox = document.getElementById("lightbox");
  const img = lightbox?.querySelector("img");

  if (!img) return;

  let startDist = 0;
  let currentScale = 1;

  lightbox.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].pageX - e.touches[1].pageX;
      const dy = e.touches[0].pageY - e.touches[1].pageY;
      startDist = Math.hypot(dx, dy);
    }
  }, { passive: false });

  lightbox.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].pageX - e.touches[1].pageX;
      const dy = e.touches[0].pageY - e.touches[1].pageY;
      const dist = Math.hypot(dx, dy);
      const scale = Math.min(Math.max(dist / startDist, 1), 3); // mellan 1x och 3x
      currentScale = scale;
      img.style.transform = `scale(${scale})`;
    }
  }, { passive: false });

  lightbox.addEventListener("touchend", (e) => {
    if (e.touches.length < 2 && currentScale !== 1) {
      // liten “snap-back” om man släpper fingrarna
      setTimeout(() => {
        img.style.transform = "scale(1)";
        currentScale = 1;
      }, 150);
    }
  });
});


})();
