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

/* Active navigation state */
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
  }, { rootMargin: "-30% 0px -60% 0px" });

  sections.forEach((section) => navObserver.observe(section));
}

/* Interactive Split-Index Project Stage */
const PROJECTS = [
  {
    type: "WEBSITE · 01",
    title: "Portfolio Runa",
    desc: "Website portofolio pribadi untuk memperkenalkan diri, menampilkan keahlian, dan mengumpulkan karya.",
    img: "assets/projects/portfolio-runa.png",
    alt: "Tampilan website portofolio Runa",
    tech: ["PHP Native", "JavaScript", "CSS"],
    href: ""
  },
  {
    type: "DESAIN UI/UX · FIGMA · 02",
    title: "Learn's EDC",
    desc: "Desain e-learning untuk tugas sekolah, dirancang di Figma dengan tampilan dashboard belajar yang informatif.",
    img: "assets/projects/learns-edc.png",
    alt: "Desain dashboard Learn's EDC di Figma",
    tech: ["Figma", "UI/UX Design"],
    href: ""
  },
  {
    type: "WEB DEVELOPMENT · 03",
    title: "Cloud Reads Library",
    desc: "Website penerima tamu perpustakaan untuk mencatat dan mendata pengunjung yang masuk.",
    img: "assets/projects/cloud-reads-library.png",
    alt: "Tampilan masuk website Cloud Reads Library",
    tech: ["PHP Native", "CSS", "JavaScript", "Database"],
    href: ""
  },
  {
    type: "WEB DEVELOPMENT · 04",
    title: "Andagen Auto Mobil",
    desc: "Website profil untuk UMKM bengkel mobil, memperkenalkan layanan perawatan dan perbaikan kendaraan.",
    img: "assets/projects/andagen-auto-mobil.png",
    alt: "Tampilan halaman utama website Andagen Auto Mobil",
    tech: ["PHP Native", "JavaScript", "CSS"],
    href: ""
  },
  {
    type: "WEB DEVELOPMENT · LARAVEL · 05",
    title: "SIWARGA",
    desc: "Website pengelolaan keuangan, administrasi, dan layanan warga di tingkat RT/RW.",
    img: "assets/projects/siwarga.png",
    alt: "Tampilan login aplikasi pengelolaan warga SIWARGA",
    tech: ["Laravel", "PHP", "CSS", "Database", "JavaScript"],
    href: ""
  },
  {
    type: "WEBSITE · E-COMMERCE · 06",
    title: "Yune.co",
    desc: "Website toko online untuk merchandise anime, mainan, dan barang koleksi, dengan katalog produk serta fitur pencarian dan keranjang.",
    img: "assets/projects/yune-shop-home.png",
    alt: "Halaman utama toko online Yune.co",
    tech: ["E-Commerce", "Katalog Produk", "Online Store"],
    href: "yune.html"
  }
];

const projectRows = document.querySelectorAll(".project-item");
const stageImage = document.querySelector("#stage-image");
const stageType = document.querySelector("#stage-type");
const stageTitle = document.querySelector("#stage-title");
const stageDesc = document.querySelector("#stage-desc");
const stageTech = document.querySelector("#stage-tech");
const stageLink = document.querySelector("#stage-link");
let activeProjectIndex = 0;

function selectProject(index) {
  const data = PROJECTS[index];
  if (!data) return;
  activeProjectIndex = index;

  projectRows.forEach((row, idx) => {
    row.classList.toggle("is-selected", idx === index);
  });

  if (stageImage instanceof HTMLImageElement) {
    stageImage.src = data.img;
    stageImage.alt = data.alt;
  }
  if (stageType) stageType.textContent = data.type;
  if (stageTitle) stageTitle.textContent = data.title;
  if (stageDesc) stageDesc.textContent = data.desc;
  if (stageTech) {
    stageTech.innerHTML = "";
    data.tech.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      stageTech.appendChild(li);
    });
  }
  if (stageLink instanceof HTMLAnchorElement) {
    if (data.href) {
      stageLink.href = data.href;
      stageLink.hidden = false;
    } else {
      stageLink.hidden = true;
    }
  }
}

projectRows.forEach((row) => {
  const index = Number(row.getAttribute("data-index"));
  if (Number.isNaN(index)) return;

  row.addEventListener("mouseenter", () => selectProject(index));
  row.addEventListener("focus", () => selectProject(index));
  row.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) return;
    selectProject(index);
  });
  row.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectProject(index);
    }
  });
});

/* Lightbox Zoom for Active Project */
const previewZoomBtn = document.querySelector("#preview-zoom-btn");
const projectDialog = document.querySelector("#project-dialog");
const projectDialogTitle = document.querySelector("#project-dialog-title");
const projectDialogType = document.querySelector("#project-dialog-type");
const projectDialogImage = document.querySelector("#project-dialog-image");
const projectDialogDesc = document.querySelector("#project-dialog-desc");

if (previewZoomBtn && projectDialog instanceof HTMLDialogElement) {
  previewZoomBtn.addEventListener("click", () => {
    const data = PROJECTS[activeProjectIndex];
    if (!data) return;
    if (projectDialogTitle) projectDialogTitle.textContent = data.title;
    if (projectDialogType) projectDialogType.textContent = data.type;
    if (projectDialogDesc) projectDialogDesc.textContent = data.desc;
    if (projectDialogImage instanceof HTMLImageElement) {
      projectDialogImage.src = data.img;
      projectDialogImage.alt = data.alt;
    }
    projectDialog.showModal();
  });

  projectDialog.querySelectorAll("[data-project-dialog-close]").forEach((btn) => {
    btn.addEventListener("click", () => projectDialog.close());
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

/* Copy Email */
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
    if (label) label.textContent = "Tersalin ✓";
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      copyEmailBtn.classList.remove("is-copied");
      if (label) label.textContent = defaultLabel;
    }, 2000);
  });
}
