/* ============================================================
   yune.js — Slide gallery for Yune.co project page
   ============================================================ */

(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const dots = Array.from(document.querySelectorAll(".dot"));
  const prevBtn = document.querySelector(".slide-prev");
  const nextBtn = document.querySelector(".slide-next");

  if (!slides.length) return;

  let current = 0;

  function goTo(index) {
    slides[current].classList.remove("is-active");
    slides[current].setAttribute("aria-hidden", "true");
    dots[current].classList.remove("is-active");
    dots[current].setAttribute("aria-selected", "false");

    current = (index + slides.length) % slides.length;

    slides[current].classList.add("is-active");
    slides[current].setAttribute("aria-hidden", "false");
    dots[current].classList.add("is-active");
    dots[current].setAttribute("aria-selected", "true");
  }

  if (prevBtn) prevBtn.addEventListener("click", () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(current + 1));

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => goTo(i));
  });

  // Touch / swipe support
  const frame = document.getElementById("slides");
  if (frame) {
    let startX = 0;
    frame.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    frame.addEventListener("touchend", (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    });
  }

  // Keyboard navigation when frame is focused
  if (frame) {
    frame.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") goTo(current + 1);
      if (e.key === "ArrowLeft") goTo(current - 1);
    });
  }
})();
