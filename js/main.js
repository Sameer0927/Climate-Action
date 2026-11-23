// Open and close the menu on mobile
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", function () {
  navLinks.classList.toggle("open");
});

// Share the website on WhatsApp
function shareSite() {
  const message = "I'm taking climate action! Check your carbon footprint here: " + window.location.href;
  window.open("https://wa.me/?text=" + encodeURIComponent(message), "_blank");
}