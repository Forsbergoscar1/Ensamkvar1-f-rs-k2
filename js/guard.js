// === guard.js ===
// Sparkar ut alla som försöker gå direkt till sidor utan att ha låst upp

if (sessionStorage.getItem("noraUnlocked") !== "1") {
  // Om man är inne i /folders/, gå en nivå upp till index.html
  const back = window.location.pathname.includes("/folders/")
    ? "../index.html"
    : "index.html";
  window.location.href = back;
}
