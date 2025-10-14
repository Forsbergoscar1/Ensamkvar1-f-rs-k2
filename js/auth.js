// === auth.js ===
// Hanterar inloggningen till Nora-mappen

const VALID_PASSWORDS = [
  "20211017",
  "2021-10-17",
  "2021/10/17",
  "17-10-2021",
  "17/10/2021",
  "17102021"
];

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
  const input = pwd.value.trim();

  if (VALID_PASSWORDS.includes(input)) {
    sessionStorage.setItem("noraUnlocked", "1");
    window.location.href = "home.html";
  } else {
    err.textContent = "Fel lösenord.";
  }
});
