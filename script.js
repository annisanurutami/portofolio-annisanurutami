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

/* Active nav link on scroll */
const navLinks = document.querySelectorAll(".site-nav a[data-nav]");
const sections = Array.from(navLinks)
  .map((link) => document.getElementById(link.dataset.nav || ""))
  .filter((section) => section instanceof HTMLElement);

if ("IntersectionObserver" in window && sections.length > 0) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.dataset.nav === entry.target.id);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach((section) => navObserver.observe(section));
}

/* Skills Workbench Filter */
const skillFilterButtons = document.querySelectorAll("[data-skill-filter]");
const skillItems = document.querySelectorAll("#skill-app-list li");
const workbenchTitle = document.querySelector(".workbench-title");

skillFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-skill-filter") || "all";
    skillFilterButtons.forEach((btn) => {
      const isMatch = btn === button;
      btn.classList.toggle("is-active", isMatch);
      btn.setAttribute("aria-pressed", String(isMatch));
    });

    let visibleCount = 0;
    skillItems.forEach((item) => {
      const categories = (item.getAttribute("data-skill-cat") || "").split(/\s+/);
      const shouldShow = filter === "all" || categories.includes(filter);
      item.classList.toggle("is-hidden", !shouldShow);
      if (shouldShow) visibleCount += 1;
    });

    if (workbenchTitle) {
      workbenchTitle.textContent = `toolbox.stack — ${visibleCount} items`;
    }
  });
});

/* Portfolio Category Filter */
const projectFilterButtons = document.querySelectorAll("[data-project-filter]");
const projectCards = document.querySelectorAll("#project-grid .project-card");

projectFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-project-filter") || "all";
    projectFilterButtons.forEach((btn) => {
      const isMatch = btn === button;
      btn.classList.toggle("is-active", isMatch);
      btn.setAttribute("aria-pressed", String(isMatch));
    });

    projectCards.forEach((card) => {
      const categories = (card.getAttribute("data-project-cat") || "").split(/\s+/);
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
      if (shouldShow) card.classList.add("is-visible");
    });
  });
});

/* Project Quick-View Dialog */
const projectDialog = document.querySelector("#project-dialog");
const projectDialogTitle = document.querySelector("#project-dialog-title");
const projectDialogType = document.querySelector("#project-dialog-type");
const projectDialogImage = document.querySelector("#project-dialog-image");
const projectDialogDesc = document.querySelector("#project-dialog-desc");
const projectDialogTech = document.querySelector("#project-dialog-tech");

if (projectDialog instanceof HTMLDialogElement) {
  document.querySelectorAll("[data-project-modal]").forEach((card) => {
    const inspectBtn = card.querySelector(".project-inspect-btn");
    const openProjectModal = () => {
      const title = card.querySelector("h3")?.textContent || "";
      const type = card.querySelector(".project-type")?.textContent || "";
      const desc = card.querySelector(".project-description")?.textContent || "";
      const img = card.querySelector(".project-shot img");
      const techItems = card.querySelectorAll(".project-tech li");

      if (projectDialogTitle) projectDialogTitle.textContent = title;
      if (projectDialogType) projectDialogType.textContent = type;
      if (projectDialogDesc) projectDialogDesc.textContent = desc;
      if (projectDialogImage instanceof HTMLImageElement && img instanceof HTMLImageElement) {
        projectDialogImage.src = img.src;
        projectDialogImage.alt = img.alt;
      }
      if (projectDialogTech) {
        projectDialogTech.innerHTML = "";
        techItems.forEach((li) => {
          const clone = document.createElement("li");
          clone.textContent = li.textContent || "";
          projectDialogTech.appendChild(clone);
        });
      }
      projectDialog.showModal();
    };

    if (inspectBtn) {
      inspectBtn.addEventListener("click", openProjectModal);
    }
  });

  projectDialog.querySelectorAll("[data-project-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => projectDialog.close());
  });
  projectDialog.addEventListener("click", (event) => {
    if (event.target === projectDialog) projectDialog.close();
  });
}

/* Internship Dialog */
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
}

/* Copy Email Button */
const copyEmailBtn = document.querySelector("[data-copy-email]");
if (copyEmailBtn instanceof HTMLButtonElement) {
  const label = copyEmailBtn.querySelector("span");
  const email = copyEmailBtn.getAttribute("data-copy-email") || "";
  const defaultLabel = label?.textContent || "";
  let resetTimer;

  copyEmailBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const tempInput = document.createElement("input");
      tempInput.value = email;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      tempInput.remove();
    }

    copyEmailBtn.classList.add("is-copied");
    if (label) label.textContent = "Email tersalin! ✓";
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      copyEmailBtn.classList.remove("is-copied");
      if (label) label.textContent = defaultLabel;
    }, 2200);
  });
}

/* Scroll Reveal */
const revealItems = document.querySelectorAll([
  ".hero-copy > *",
  ".portrait-frame",
  ".section-heading",
  ".about-copy",
  ".about-card",
  ".skill-workbench",
  ".skill-card-expertise",
  ".project-card",
  ".project-footnote",
  ".timeline-card",
  ".contact-card"
].join(", "));

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("reveal-ready");
  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${(index % 3) * 65}ms`);
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });

  revealItems.forEach((item) => revealObserver.observe(item));
}
