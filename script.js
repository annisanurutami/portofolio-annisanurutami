/* ============================================================
   script.js — Portofolio Annisa Nur Utami (Runa)
   ============================================================ */

// ── Projects data ──────────────────────────────────────────────
const PROJECTS = [
  {
    id: "portfolio-runa",
    title: "Portfolio Runa",
    type: "Website",
    desc: "Website profil pribadi berisi biodata, daftar keahlian, dan kumpulan proyek yang pernah aku buat.",
    tags: ["PHP Native", "JavaScript", "CSS"],
    img: "assets/projects/portfolio-runa.png",
    link: null,
  },
  {
    id: "learns-edc",
    title: "Learn's EDC",
    type: "Desain Figma",
    desc: "Desain aplikasi e-learning yang aku buat di Figma untuk tugas sekolah, berisi tampilan dashboard belajar siswa.",
    tags: ["Figma", "UI/UX"],
    img: "assets/projects/learns-edc.png",
    link: null,
  },
  {
    id: "cloud-reads",
    title: "Cloud Reads Library",
    type: "Website",
    desc: "Website buku tamu perpustakaan untuk mencatat dan mendata pengunjung yang datang.",
    tags: ["PHP Native", "MySQL", "CSS"],
    img: "assets/projects/cloud-reads-library.png",
    link: null,
  },
  {
    id: "andagen",
    title: "Andagen Auto Mobil",
    type: "Website",
    desc: "Website company profile untuk bengkel mobil, berisi info layanan servis dan perbaikan kendaraan.",
    tags: ["HTML", "CSS", "JavaScript"],
    img: "assets/projects/andagen-auto-mobil.png",
    link: null,
  },
  {
    id: "siwarga",
    title: "SIWARGA",
    type: "Website",
    desc: "Website berbasis Laravel untuk mencatat keuangan, administrasi, dan data warga di lingkungan RT/RW.",
    tags: ["Laravel", "MySQL", "Figma"],
    img: "assets/projects/siwarga.png",
    link: null,
  },
  {
    id: "yune",
    title: "Yune.co",
    type: "Website",
    desc: "Website toko online untuk jualan merchandise anime, mainan, dan barang koleksi. Ada halaman katalog, pencarian barang, dan fitur keranjang.",
    tags: ["PHP Native", "CSS", "JavaScript"],
    img: "assets/projects/yune-shop-home.png",
    link: "yune.html",
    linkLabel: "Lihat halaman proyek Yune.co ↗",
  },
];

// ── Render project cards ───────────────────────────────────────
function renderProjects() {
  const list = document.getElementById("project-list");
  if (!list) return;

  PROJECTS.forEach((p, i) => {
    const num = String(i + 1).padStart(2, "0");
    const isEven = (i + 1) % 2 === 0;

    // Card inner HTML
    const cardHTML = `
      <div class="project-card-inner reveal" style="transition-delay:${i * 80}ms">
        <p class="project-num">${num} · ${p.type.toUpperCase()}</p>
        <h3>${p.title}</h3>
        <img class="project-img" src="${p.img}" alt="Tampilan proyek ${p.title}" loading="lazy">
        <p>${p.desc}</p>
        <div class="project-tags">
          ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join("")}
        </div>
        ${p.link ? `<a class="project-link" href="${p.link}">${p.linkLabel || "Lihat proyek ↗"}</a>` : ""}
      </div>
    `;

    // Connector HTML
    const connectorHTML = `
      <div class="project-connector">
        <div class="proj-node">${num}</div>
        <div class="proj-line"></div>
      </div>
    `;

    // Wrapper div (display:contents)
    const wrapper = document.createElement("div");
    wrapper.className = "project-card";

    if (isEven) {
      // even: empty first col, connector, card
      wrapper.innerHTML = `<div></div>${connectorHTML}${cardHTML}`;
    } else {
      // odd: card, connector, empty third col
      wrapper.innerHTML = `${cardHTML}${connectorHTML}<div></div>`;
    }
    list.appendChild(wrapper);
  });
}

// ── Scroll reveal ──────────────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => obs.observe(el));
}

// ── Active nav highlight ───────────────────────────────────────
function initActiveNav() {
  const sections = document.querySelectorAll("section[id], footer[id]");
  const navLinks = document.querySelectorAll(".site-nav a");

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          navLinks.forEach((a) => {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => obs.observe(s));
}

// ── Mobile nav toggle ──────────────────────────────────────────
function initMobileNav() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });

  // Close on link click
  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    });
  });
}

// ── Internship dialog ──────────────────────────────────────────
function initInternshipDialog() {
  const dialog = document.getElementById("internship-dialog");
  if (!dialog) return;

  document.querySelectorAll("[aria-controls='internship-dialog']").forEach((btn) => {
    btn.addEventListener("click", () => dialog.showModal());
  });

  dialog.querySelectorAll("[data-dialog-close]").forEach((btn) => {
    btn.addEventListener("click", () => dialog.close());
  });

  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
}

// ── Year ───────────────────────────────────────────────────────
function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

// ── Boot ───────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  initReveal();
  initActiveNav();
  initMobileNav();
  initInternshipDialog();
  initYear();
});
