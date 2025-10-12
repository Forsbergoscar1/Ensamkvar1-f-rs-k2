// === auth.js ===
// Hanterar inloggningen till Nora-mappen

const PASSWORD = "astrid1963"; // <-- ändra lösenordet här om du vill
const form = document.getElementById("loginForm");
const err = document.getElementById("err");
const pwd = document.getElementById("password");

// Om användaren redan har låst upp tidigare, hoppa direkt till home
if (sessionStorage.getItem("noraUnlocked") === "1") {
  window.location.href = "home.html";
}

// Lyssna på formuläret
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (pwd.value.trim() === PASSWORD) {
    sessionStorage.setItem("noraUnlocked", "1");
    window.location.href = "home.html";
  } else {
    err.textContent = "Fel lösenord.";
  }
});
