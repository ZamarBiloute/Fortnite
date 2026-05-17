const carousels = document.querySelectorAll(".carousel");

carousels.forEach((carousel) => {

  const buttons = carousel.querySelectorAll(".btn");
  const slides = carousel.querySelectorAll(".slide");

  buttons.forEach((button) => {

    button.addEventListener("click", (e) => {

      const calcNextSlide = button.id === "next" ? 1 : -1;

      const slideActive = carousel.querySelector(".active");

      let newIndex = calcNextSlide + [...slides].indexOf(slideActive);

      if (newIndex < 0) newIndex = slides.length - 1;
      if (newIndex >= slides.length) newIndex = 0;

      slideActive.classList.remove("active");
      slides[newIndex].classList.add("active");

    });

  });

});