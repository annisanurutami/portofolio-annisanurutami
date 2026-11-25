const slides = [...document.querySelectorAll(".slide")];
const pageButtons = [...document.querySelectorAll(".page-btn")];
const currentSlide = document.querySelector("#current-slide");
const previousButton = document.querySelector(".slide-previous");
const nextButton = document.querySelector(".slide-next");
const slideFrame = document.querySelector(".slide-frame");
let activeSlide = 0;
let pointerStartX = null;

function showSlide(index) {
  if (!slides.length) return;
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeSlide;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });
  pageButtons.forEach((btn, btnIndex) => {
    const isActive = btnIndex === activeSlide;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
  if (currentSlide) currentSlide.textContent = String(activeSlide + 1).padStart(2, "0");
}

if (slides.length && previousButton && nextButton) {
  previousButton.addEventListener("click", () => showSlide(activeSlide - 1));
  nextButton.addEventListener("click", () => showSlide(activeSlide + 1));
  pageButtons.forEach((btn) => {
    btn.addEventListener("click", () => showSlide(Number(btn.dataset.slide)));
  });

  document.addEventListener("keydown", (event) => {
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
