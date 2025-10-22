// === ui.js ===
// Lightbox: öppna på klick, stäng på overlay/knapp/ESC
(function () {
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

  // --- Öppna lightbox ---
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".tile img");
    const lb = document.getElementById("lightbox");
    if (img && lb) {
      // ✅ Hämta text från data-caption eller figcaption
      const caption =
        img.dataset.caption ||
        img.closest(".tile")?.querySelector("figcaption")?.textContent?.trim() ||
        "";
      lb.querySelector("img").src = img.src;
      lb.querySelector(".caption").textContent = caption;
      lb.hidden = false;
      document.body.style.overflow = "hidden";
    }
  });

  // --- Stäng på overlay eller knapp ---
  document.addEventListener("click", (e) => {
    const lb = document.getElementById("lightbox");
    if (!lb || lb.hidden) return;
    if (e.target.matches(".lightbox, .lightbox .close")) {
      lb.hidden = true;
      document.body.style.overflow = "";
    }
  });

  // --- Stäng på Escape ---
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const lb = document.getElementById("lightbox");
      if (lb && !lb.hidden) {
        lb.hidden = true;
        document.body.style.overflow = "";
      }
    }
  });

  // --- Logout (hem) ---
  const logout = document.getElementById("logoutBtn");
  on(logout, "click", (e) => {
    e.preventDefault();
    sessionStorage.removeItem("noraUnlocked");
    window.location.href = "index.html";
  });

  // ===== Lightbox pinch-zoom + pan (riktig touch-zoom) =====
  const lb = document.getElementById("lightbox");
  const img = lb?.querySelector("img");
  if (!lb || !img) return;

  let startDist = 0;
  let startScale = 1;
  let currentScale = 1;
  let originX = 0, originY = 0;
  let offsetX = 0, offsetY = 0;
  let lastOffsetX = 0, lastOffsetY = 0;

  lb.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const [t1, t2] = e.touches;
      startDist = Math.hypot(t2.pageX - t1.pageX, t2.pageY - t1.pageY);
      startScale = currentScale;
      originX = (t1.pageX + t2.pageX) / 2;
      originY = (t1.pageY + t2.pageY) / 2;
    } else if (e.touches.length === 1 && currentScale > 1) {
      // börja panorera
      e.preventDefault();
      const t = e.touches[0];
      originX = t.pageX - lastOffsetX;
      originY = t.pageY - lastOffsetY;
    }
  }, { passive:false });

  lb.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const [t1, t2] = e.touches;
      const dist = Math.hypot(t2.pageX - t1.pageX, t2.pageY - t1.pageY);
      const scale = Math.min(Math.max((dist / startDist) * startScale, 1), 4);
      currentScale = scale;

      // räkna ut mittpunkten mellan fingrarna
      const midX = (t1.pageX + t2.pageX) / 2;
      const midY = (t1.pageY + t2.pageY) / 2;

      // flytta bilden så zoom sker kring fingrarna
      offsetX = (midX - originX);
      offsetY = (midY - originY);

      img.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    } else if (e.touches.length === 1 && currentScale > 1) {
      e.preventDefault();
      const t = e.touches[0];
      offsetX = t.pageX - originX;
      offsetY = t.pageY - originY;
      lastOffsetX = offsetX;
      lastOffsetY = offsetY;
      img.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${currentScale})`;
    }
  }, { passive:false });

  lb.addEventListener("touchend", () => {
    // återställ när användaren släpper
    if (currentScale !== 1) {
      setTimeout(() => {
        img.style.transform = "translate(0,0) scale(1)";
        currentScale = 1;
        offsetX = offsetY = lastOffsetX = lastOffsetY = 0;
      }, 150);
    }
  });
})();
