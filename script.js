const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Buka navigasi" : "Tutup navigasi");
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Buka navigasi");
      siteNav.classList.remove("is-open");
    }
  });
}

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const anchor = event.target.closest('a[href^="#"]');
  if (!(anchor instanceof HTMLAnchorElement)) return;

  const targetId = anchor.hash.slice(1);
  if (!targetId) return;

  const target = document.getElementById(decodeURIComponent(targetId));
  if (!target) return;

  event.preventDefault();
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  target.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
  });
});

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

const internshipDialog = document.querySelector("#internship-dialog");
const internshipDetailsTrigger = document.querySelector(".internship-details-trigger");
if (internshipDialog instanceof HTMLDialogElement && internshipDetailsTrigger instanceof HTMLButtonElement) {
  internshipDetailsTrigger.addEventListener("click", () => internshipDialog.showModal());

  internshipDialog.querySelectorAll("[data-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => internshipDialog.close());
  });

  internshipDialog.addEventListener("click", (event) => {
    if (event.target === internshipDialog) internshipDialog.close();
  });

  internshipDialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") internshipDialog.close();
  });
}

const revealItems = document.querySelectorAll([
  ".hero-copy > .eyebrow",
  ".hero-copy > h1",
  ".hero-copy > .hero-intro",
  ".hero-copy > .hero-actions",
  ".hero-copy > .hero-note",
  ".hero-photo",
  ".section-heading",
  ".about-copy > p",
  ".about-copy > a",
  ".about-card",
  ".skill-card",
  ".project-card",
  ".project-footnote",
  ".timeline-card",
  ".contact-card > .eyebrow",
  ".contact-card > h2",
  ".contact-card > p",
  ".contact-actions",
  ".contact-signoff",
  ".site-footer > *"
].join(", "));
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("reveal-ready");
  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${(index % 4) * 75}ms`);
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });

  revealItems.forEach((item) => revealObserver.observe(item));
}
