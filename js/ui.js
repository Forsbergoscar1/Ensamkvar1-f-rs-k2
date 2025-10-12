// === ui.js ===

// Klick på bilder öppnar lightbox
document.addEventListener("click", (e) => {
  const lb = document.getElementById("lightbox");
  const imgEl = e.target.closest(".tile img");

  // Öppna lightbox
  if (imgEl && lb) {
    const fig = e.target.closest(".tile");
    lb.querySelector("img").src = imgEl.src;
    lb.querySelector("img").alt = imgEl.alt || "";
    lb.querySelector(".caption").textContent =
      fig?.querySelector("figcaption")?.textContent || "";
    lb.hidden = false;
  }

  // Stäng lightbox
  if (e.target.matches(".lightbox, .lightbox .close")) {
    lb.hidden = true;
  }
});

// Logout-knappen i home.html
const logout = document.getElementById("logoutBtn");
if (logout) {
  logout.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.removeItem("noraUnlocked");
    window.location.href = "index.html";
  });
}
