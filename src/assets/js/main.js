const menu = document.querySelector(".navigation"),
  toggle = document.querySelector(".toggle");

function toggleToggle() {
  menu.classList.toggle("navigation-closed");
}

toggle.addEventListener("click", toggleToggle, false);
