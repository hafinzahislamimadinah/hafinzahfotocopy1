const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-menu a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});


// Navbar berubah saat scroll

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

  if (window.scrollY > 30) {
    navbar.style.boxShadow = "0 8px 30px rgba(0,0,0,.05)";
  } else {
    navbar.style.boxShadow = "none";
  }

});


// Animasi saat elemen masuk layar

const observer = new IntersectionObserver(
  entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }

    });

  },
  {
    threshold: 0.15
  }
);


document
  .querySelectorAll(".service-card, .why-card, .about-content")
  .forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(25px)";
    element.style.transition = "all .7s ease";

    observer.observe(element);

  });
