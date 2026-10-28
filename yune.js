const slides = [...document.querySelectorAll(".slide")];
const dots = [...document.querySelectorAll(".slide-dot")];
const currentSlide = document.querySelector("#current-slide");
const previousButton = document.querySelector(".slide-previous");
const nextButton = document.querySelector(".slide-next");
const gallery = document.querySelector(".gallery");
const slideFrame = document.querySelector(".slide-frame");
let activeSlide = 0;
let pointerStartX = null;

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeSlide;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });
  dots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeSlide;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-pressed", String(isActive));
  });
  if (currentSlide) currentSlide.textContent = String(activeSlide + 1).padStart(2, "0");
}

if (slides.length && previousButton && nextButton) {
  previousButton.addEventListener("click", () => showSlide(activeSlide - 1));
  nextButton.addEventListener("click", () => showSlide(activeSlide + 1));
  dots.forEach((dot) => {
    dot.addEventListener("click", () => showSlide(Number(dot.dataset.slide)));
  });
  gallery?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showSlide(activeSlide - 1);
    if (event.key === "ArrowRight") showSlide(activeSlide + 1);
  });
  slideFrame?.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerStartX = event.clientX;
  });
  slideFrame?.addEventListener("pointerup", (event) => {
    if (pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(distance) < 45) return;
    showSlide(activeSlide + (distance < 0 ? 1 : -1));
  });
  slideFrame?.addEventListener("pointercancel", () => {
    pointerStartX = null;
  });
}
