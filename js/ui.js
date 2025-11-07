// === ui.js (Lightbox med stöd för både bild + ljud + zoom/pinch) ===
(function () {
  // ===== Logout (tillbaka till låsskärmen) =====
  const logout = document.getElementById("logoutBtn");
  if (logout) {
    logout.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("noraUnlocked");
      window.location.href = "index.html";
    });
  }

  // ===== Lightbox-element =====
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const lbImg = lightbox.querySelector("img");
  const lbAudio = lightbox.querySelector("audio"); // Kan vara null på vissa sidor
  const lbCaption = lightbox.querySelector(".caption");
  const closeBtn = lightbox.querySelector(".close");

  let scale = 1, offsetX = 0, offsetY = 0, originX = 0, originY = 0;
  let lastOffsetX = 0, lastOffsetY = 0, startDist = 0, startScale = 1;

  // ===== Öppna Lightbox =====
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".tile img");
    if (!img) return;

    const audioSrc = img.dataset.audio || null;
    const captionText = img.dataset.caption || "";

    // Reset zoom och position
    scale = 1;
    offsetX = offsetY = lastOffsetX = lastOffsetY = 0;
    lbImg.style.transform = "translate(0,0) scale(1)";

    if (audioSrc && lbAudio) {
      // === VISA LJUD ===
      lbImg.hidden = true;
      lbImg.src = ""; // ✅ Viktigt: rensa gammal bild helt
      lbAudio.hidden = false;
      lbAudio.src = audioSrc;
      lbAudio.load();
    } else {
      // === VISA BILD ===
      lbImg.src = img.src;
      lbImg.hidden = false;
      if (lbAudio) {
        lbAudio.pause();
        lbAudio.hidden = true;
        lbAudio.src = "";
      }
    }

    lbCaption.textContent = captionText;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  });

  // ===== Stäng Lightbox =====
  function closeLightbox() {
    if (!lightbox.hidden) {
      if (lbAudio && !lbAudio.hidden) lbAudio.pause();
      lightbox.hidden = true;
      document.body.style.overflow = "";
    }
  }

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // ===== Zoom med mus =====
  lbImg?.addEventListener("wheel", (e) => {
    e.preventDefault();
    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(scale, 1), 4);
    lbImg.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  });

  // ===== Touch / pinch-zoom =====
  lightbox.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const [t1, t2] = e.touches;
        startDist = Math.hypot(t2.pageX - t1.pageX, t2.pageY - t1.pageY);
        startScale = scale;
        originX = (t1.pageX + t2.pageX) / 2;
        originY = (t1.pageY + t2.pageY) / 2;
      } else if (e.touches.length === 1 && scale > 1) {
        const t = e.touches[0];
        originX = t.pageX - lastOffsetX;
        originY = t.pageY - lastOffsetY;
      }
    },
    { passive: false }
  );

  lightbox.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const [t1, t2] = e.touches;
        const dist = Math.hypot(t2.pageX - t1.pageX, t2.pageY - t1.pageY);
        scale = Math.min(Math.max((dist / startDist) * startScale, 1), 4);
        offsetX = (t1.pageX + t2.pageX) / 2 - originX;
        offsetY = (t1.pageY + t2.pageY) / 2 - originY;
        lbImg.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      } else if (e.touches.length === 1 && scale > 1) {
        e.preventDefault();
        const t = e.touches[0];
        offsetX = t.pageX - originX;
        offsetY = t.pageY - originY;
        lastOffsetX = offsetX;
        lastOffsetY = offsetY;
        lbImg.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      }
    },
    { passive: false }
  );

  lightbox.addEventListener("touchend", () => {
    if (scale === 1) {
      offsetX = offsetY = lastOffsetX = lastOffsetY = 0;
      lbImg.style.transform = "translate(0,0) scale(1)";
    }
  });
})();
