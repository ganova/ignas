(function () {
  let cfg;

  function renderStats() {
    const wrap = document.getElementById("hero-stats");
    wrap.innerHTML = cfg.heroStats.map(s =>
      `<div class="stat-card"><b>${s.value}</b><i>${s.label}</i></div>`
    ).join("");
  }

  function renderPortfolio() {
    const grid = document.getElementById("portfolio-grid");
    grid.innerHTML = cfg.portfolio.map(item => `
      <article class="portfolio-card" data-filter="${item.filter}">
        <a class="portfolio-thumb" href="${item.url || '#'}" target="${item.url ? '_blank' : '_self'}" rel="noopener" aria-label="Lihat karya ${item.title}">
          <span class="thumb-bg" style="background:linear-gradient(150deg,${item.gradient[0]},${item.gradient[1]})"></span>
          <span class="badge-platform">${item.platform}</span>
          <span class="badge-duration">${item.duration}</span>
          <span class="thumb-play"><span>${playIconSvg(14)}</span></span>
        </a>
        <div class="portfolio-meta">
          <h4>${item.title}</h4>
          <p><b>${item.views}</b> views · ${item.category}</p>
        </div>
      </article>
    `).join("");
  }

  function playIconSvg(size) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="#0D0D14"><path d="M8 5v14l11-7z"/></svg>`;
  }

  function renderServices() {
    const wrap = document.getElementById("services-grid");
    wrap.innerHTML = cfg.services.map((s, i) => `
      <div class="service-tile reveal">
        <div class="ic">${i + 1}</div>
        <h4>${s.title}</h4>
        <p>${s.desc}</p>
      </div>
    `).join("");
  }

  function renderProcess() {
    const wrap = document.getElementById("process-grid");
    wrap.innerHTML = cfg.process.map(s => `
      <div class="step-card reveal">
        <div class="n">${s.step}</div>
        <h4>${s.title}</h4>
        <p>${s.desc}</p>
      </div>
    `).join("");
  }

  function renderQna() {
    const wrap = document.getElementById("qna-wrap");
    wrap.innerHTML = cfg.qna.map((item, i) => `
      <div class="qna-item${i === 0 ? " open" : ""}">
        <button class="qna-question" aria-expanded="${i === 0 ? "true" : "false"}">
          <span>${item.q}</span>
          <i class="qna-icon">+</i>
        </button>
        <div class="qna-answer">
          <p>${item.a || "Jawaban segera ditambahkan."}</p>
        </div>
      </div>
    `).join("");
  }

  function wireLinks() {
    document.querySelectorAll("[data-wa]").forEach(el => el.setAttribute("href", cfg.whatsappUrl));
    document.querySelectorAll("[data-email]").forEach(el => el.setAttribute("href", "mailto:" + cfg.email));
    document.getElementById("availability-text").textContent = cfg.availability;
  }

  function wireShowreel() {
    const reel = document.getElementById("reel");
    const playBtn = document.getElementById("reel-play");
    if (!cfg.showreelUrl) return;
    playBtn.addEventListener("click", () => {
      if (reel.querySelector("video")) return;
      const video = document.createElement("video");
      video.src = cfg.showreelUrl;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      reel.appendChild(video);
      playBtn.style.display = "none";
    });
  }

  function wireFilters() {
    const pills = document.querySelectorAll(".filter-pill");
    const cards = () => document.querySelectorAll(".portfolio-card");
    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        pills.forEach(p => p.setAttribute("aria-pressed", "false"));
        pill.setAttribute("aria-pressed", "true");
        const filter = pill.dataset.filter;
        cards().forEach(card => {
          const show = filter === "all" || card.dataset.filter === filter;
          card.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  function wireAccordion() {
    const items = document.querySelectorAll(".qna-item");
    items.forEach(item => {
      const btn = item.querySelector(".qna-question");
      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        items.forEach(i => {
          i.classList.remove("open");
          i.querySelector(".qna-question").setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  function wireSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener("click", e => {
        const id = link.getAttribute("href").slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function wireScrollSpy() {
    const ticks = document.querySelectorAll(".ticks span");
    const sections = Array.from(document.querySelectorAll("section[id]"));
    if (!ticks.length || !sections.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = sections.indexOf(entry.target) % ticks.length;
          ticks.forEach(t => t.classList.remove("on"));
          ticks[idx].classList.add("on");
        }
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });
    sections.forEach(s => observer.observe(s));
  }

  function wireReveal() {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => observer.observe(el));
  }

  document.addEventListener("DOMContentLoaded", () => {
    cfg = window.SITE_CONFIG;
    renderStats();
    renderPortfolio();
    renderServices();
    renderProcess();
    renderQna();
    wireLinks();
    wireShowreel();
    wireFilters();
    wireAccordion();
    wireSmoothScroll();
    wireScrollSpy();
    wireReveal();
    document.querySelectorAll(".portfolio-card, .service-tile, .step-card").forEach(el => el.classList.add("reveal"));
  });
})();
