(function () {
  const data = window.IMMANENT_CASE_V4_DATA;
  const storageKey = "immanent-case-v4-language";
  let language = getInitialLanguage();
  let lightboxItems = [];
  let lightboxIndex = 0;
  let lockedScrollY = 0;
  let tapFeedbackBound = false;

  function getInitialLanguage() {
    const saved = window.localStorage.getItem(storageKey);
    return saved === "zh" || saved === "en" ? saved : data.settings.defaultLanguage || "en";
  }

  function value(input) {
    if (input == null) return "";
    if (typeof input === "string" || typeof input === "number") return input;
    if (Array.isArray(input)) return input.map(value);
    return input[language] || input.en || "";
  }

  function escapeHtml(input) {
    return String(input)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function text(input) {
    return escapeHtml(value(input));
  }

  function lineTitle(lines) {
    const resolved = value(lines);
    const safeLines = Array.isArray(resolved) ? resolved : [resolved];
    return safeLines.map((line) => `<span class="title-line">${escapeHtml(line)}</span>`).join("");
  }

  function copyLines(lines, className = "copy-lines") {
    return `<div class="${className}">${value(lines).map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>`;
  }

  function list(items, className = "detail-list") {
    return `<ul class="${className}">${value(items).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function ratioToCss(ratio) {
    const [width, height] = String(ratio || "1:1").split(":").map(Number);
    return `${width || 1} / ${height || 1}`;
  }

  function cssUrl(input) {
    return String(input).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "");
  }

  function assetFigure(key, className = "", loading = "lazy") {
    const asset = data.assets[key];
    if (!asset) return "";
    const fit = asset.fit || (asset.type === "packshot" || asset.type === "diagram" ? "contain" : "cover");
    const caption = value(asset.alt);
    const priority = loading === "eager" ? ' fetchpriority="high"' : "";
    return `
      <figure class="asset-frame zoomable asset-${asset.type} ${className}" data-fit="${escapeHtml(fit)}" data-lightbox-src="${escapeHtml(asset.src)}" data-lightbox-caption="${escapeHtml(caption)}" tabindex="0" style="--asset-ratio:${ratioToCss(asset.ratio)}; --asset-focal:${escapeHtml(asset.focal || "50% 50%")}; --asset-url:url('${escapeHtml(cssUrl(asset.src))}')">
        <img src="${escapeHtml(asset.src)}" alt="${escapeHtml(caption)}" loading="${loading}" decoding="async"${priority}>
        <span class="view-label">${text(data.ui.view)}</span>
      </figure>
    `;
  }

  function wordmark() {
    return `
      <a class="brand-lockup" href="#overview" aria-label="IMMANENT / 蕴">
        <span>IMMANENT</span><span class="brand-divider">/</span><span class="brand-zh">蕴</span>
      </a>
    `;
  }

  function header() {
    const navItems = data.nav.map((item) => `<a href="#${item.id}" data-nav-link="${item.id}">${text(item.label)}</a>`).join("");
    return `
      <a class="skip-link" href="#main">${text(data.ui.skip)}</a>
      <header class="site-header">
        <div class="header-inner page-shell">
          ${wordmark()}
          <nav class="desktop-nav" aria-label="Primary">${navItems}</nav>
          <div class="header-actions">
            <a class="brand-site-link" href="${escapeHtml(data.settings.brandSiteUrl)}">${text(data.ui.viewBrandSite)}</a>
            <button class="lang-toggle" type="button" data-language-toggle aria-label="Switch language">
              <span class="${language === "en" ? "is-active" : ""}">EN</span>
              <span aria-hidden="true">/</span>
              <span class="${language === "zh" ? "is-active" : ""}">中文</span>
            </button>
            <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-label="${text(data.ui.menu)}">
              <span class="menu-open">${text(data.ui.menu)}</span>
              <span class="menu-close">${text(data.ui.close)}</span>
            </button>
          </div>
        </div>
        <nav class="mobile-nav" data-mobile-nav aria-label="Mobile">${navItems}<a href="${escapeHtml(data.settings.brandSiteUrl)}">${text(data.ui.viewBrandSite)}</a></nav>
      </header>
    `;
  }

  function sectionIntro(section, titleId) {
    return `
      <div class="section-intro">
        <p class="eyebrow">${escapeHtml(section.number)} / ${text(section.eyebrow)}</p>
        <h2 id="${titleId}">${lineTitle(section.titleLines)}</h2>
      </div>
    `;
  }

  function chapterIndex() {
    return `
      <nav class="chapter-index" aria-label="${language === "zh" ? "章节索引" : "Chapter index"}">
        ${data.chapters.map((chapter) => `
          <a href="#${escapeHtml(chapter.id)}">
            <span>${escapeHtml(chapter.number)}</span>
            <strong>${text(chapter.title)}</strong>
            <em>${text(chapter.descriptor)}</em>
          </a>
        `).join("")}
      </nav>
    `;
  }

  function overviewSection() {
    const section = data.overview;
    return `
      <section class="overview-section page-shell nav-section" id="${section.id}" data-nav-section="overview" aria-labelledby="overview-title">
        <div class="overview-copy">
          <p class="eyebrow">${text(section.eyebrow)}</p>
          <h1 id="overview-title">${text(section.title)}</h1>
          <h2>${lineTitle(section.headlineLines)}</h2>
          ${copyLines(section.bodyLines)}
          <div class="hero-actions">
            <a class="secondary-button" href="${escapeHtml(data.settings.brandSiteUrl)}">${text(data.ui.viewBrandSite)}</a>
            <button class="secondary-button" type="button" data-source-open>${text(data.ui.viewSources)}</button>
          </div>
          <div class="scope-line">${value(section.scope).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
        </div>
        ${assetFigure("heroDuo", "overview-image", "eager")}
        ${chapterIndex()}
      </section>
    `;
  }

  function referenceTable() {
    const cols = data.research.referenceColumns;
    return `
      <div class="reference-table" role="table" aria-label="${language === "zh" ? "参考案例与设计判断" : "References and design decisions"}">
        <div class="table-row table-head" role="row">
          ${cols.map((col) => `<span role="columnheader">${text(col.label)}</span>`).join("")}
        </div>
        ${data.research.referenceRows.map((row) => `
          <div class="table-row" role="row" tabindex="0" data-source-row>
            ${cols.map((col) => `<span role="cell">${text(row[col.key])}</span>`).join("")}
          </div>
        `).join("")}
      </div>
    `;
  }

  function researchSection() {
    const section = data.research;
    return `
      <section class="case-section research-section page-shell nav-section" id="${section.id}" data-nav-section="research" aria-labelledby="research-title">
        <div class="section-spread">
          <div>
            ${sectionIntro(section, "research-title")}
            <p class="section-lede">${text(section.intro)}</p>
            <button class="text-link" type="button" data-source-open>${text(data.ui.viewSources)}</button>
          </div>
          ${assetFigure("sourceStill", "research-image")}
        </div>
        <div class="evidence-grid">
          ${section.blocks.map((block) => `
            <article>
              <h3>${text(block.title)}</h3>
              <p>${text(block.body)}</p>
            </article>
          `).join("")}
        </div>
        ${referenceTable()}
      </section>
    `;
  }

  function strategySection() {
    const opportunity = data.strategy.opportunity;
    const audience = data.strategy.audience;
    const positioning = data.strategy.positioning;
    const brandIdea = data.strategy.brandIdea;
    return `
      <section class="case-section strategy-section page-shell nav-section" id="strategy" data-nav-section="strategy">
        <div class="strategy-panel" id="${opportunity.id}">
          ${sectionIntro(opportunity, "opportunity-title")}
          <p class="section-lede">${text(opportunity.body)}</p>
        </div>
        <div class="audience-panel" id="${audience.id}">
          ${sectionIntro(audience, "audience-title")}
          <div class="audience-grid">
            ${audience.groups.map((group) => `
              <article>
                <h3>${text(group.title)}</h3>
                <p>${text(group.body)}</p>
              </article>
            `).join("")}
            <article class="scene-list">
              <p class="eyebrow">${language === "zh" ? "使用场景" : "Use scenes"}</p>
              ${list(audience.scenes)}
            </article>
          </div>
        </div>
        <div class="positioning-panel" id="${positioning.id}">
          <div>
            ${sectionIntro(positioning, "positioning-title")}
            <p class="section-lede">${text(positioning.body)}</p>
          </div>
          <blockquote>${text(positioning.statement)}</blockquote>
        </div>
        <div class="brand-idea-panel" id="${brandIdea.id}">
          <div class="strategy-statement">
            <p class="eyebrow">${escapeHtml(brandIdea.number)} / ${text(brandIdea.eyebrow)}</p>
            <strong>${lineTitle(brandIdea.titleLines)}</strong>
            <p>${text(brandIdea.body)}</p>
          </div>
          <article class="naming-note">
            <h3>${text(brandIdea.naming.title)}</h3>
            <p>${text(brandIdea.naming.body)}</p>
          </article>
        </div>
      </section>
    `;
  }

  function productCard(item) {
    return `
      <article class="system-product">
        ${assetFigure(item.image, "system-product-image")}
        <div>
          <p class="eyebrow">${text(item.role)}</p>
          <h3>${escapeHtml(item.code)}</h3>
          <p>${text(item.body)}</p>
          <div class="product-meta">
            <span>${text(item.size)}</span>
            <span>${text(item.price)}</span>
          </div>
          ${list(item.notes)}
        </div>
      </article>
    `;
  }

  function productSystemSection() {
    const section = data.product.system;
    return `
      <section class="case-section product-system-section page-shell nav-section" id="${section.id}" data-nav-section="product" aria-labelledby="product-title">
        <div class="section-spread">
          <div>
            ${sectionIntro(section, "product-title")}
            <p class="section-lede">${text(section.intro)}</p>
          </div>
          <p class="pricing-note">${text(section.pricingNote)}</p>
        </div>
        <div class="system-grid">
          ${section.items.map(productCard).join("")}
        </div>
      </section>
    `;
  }

  function sourceProcessSection() {
    const section = data.product.sourceProcess;
    return `
      <section class="case-section source-process-section page-shell" id="${section.id}" aria-labelledby="source-process-title">
        <div class="section-spread">
          <div>
            ${sectionIntro(section, "source-process-title")}
            <p class="section-lede">${text(section.body)}</p>
          </div>
          ${assetFigure("pulpStill", "source-process-image")}
        </div>
        <p class="source-note">${text(section.note)}</p>
        <div class="material-split">
          ${section.split.map((item) => `
            <article>
              <span>${text(item.material)}</span>
              <strong>${text(item.path)}</strong>
              <em>${escapeHtml(item.product)}</em>
            </article>
          `).join("")}
        </div>
        <div class="process-routes">
          ${section.routes.map((route) => `
            <article>
              <h3>${escapeHtml(route.title)}</h3>
              ${list(route.steps, "process-list")}
            </article>
          `).join("")}
        </div>
        <p class="source-note">${text(section.routeNote)}</p>
      </section>
    `;
  }

  function decisionsSection() {
    const section = data.product.decisions;
    return `
      <section class="case-section decisions-section page-shell" id="${section.id}" aria-labelledby="decisions-title">
        ${sectionIntro(section, "decisions-title")}
        <div class="decision-grid">
          ${section.items.map((item) => `
            <article>
              <div>
                <span>${escapeHtml(item.number)}</span>
                <h3>${text(item.title)}</h3>
                <p>${text(item.body)}</p>
              </div>
              ${assetFigure(item.image, "decision-image")}
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function useExperienceSection() {
    const section = data.product.useExperience;
    return `
      <section class="case-section use-experience-section page-shell" id="${section.id}" aria-labelledby="use-title">
        ${sectionIntro(section, "use-title")}
        <div class="use-grid">
          ${section.items.map((item) => `
            <article>
              ${assetFigure(item.image, "use-image")}
              <div>
                <h3>${text(item.title)}</h3>
                <p>${text(item.body)}</p>
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function identitySection() {
    const section = data.identitySystem;
    return `
      <section class="case-section identity-section page-shell nav-section" id="${section.id}" data-nav-section="identity" aria-labelledby="identity-title">
        <div class="section-spread">
          <div>
            ${sectionIntro(section, "identity-title")}
            <p class="section-lede">${text(section.intro)}</p>
          </div>
          ${assetFigure(section.left.image, "identity-image")}
        </div>
        <div class="identity-layout">
          <div class="master-lockup">
            <strong>${escapeHtml(section.left.title)}</strong>
            <p>${text(section.left.caption)}</p>
          </div>
          <div class="identity-notes">
            ${section.right.map((item) => `
              <article>
                <p class="eyebrow">${text(item.label)}</p>
                <strong>${text(item.value)}</strong>
              </article>
            `).join("")}
          </div>
        </div>
        <p class="palette-note">${text(section.paletteNote)}</p>
        <div class="palette-row">
          ${section.palette.map((swatch) => `
            <article>
              <span class="swatch" style="background:${escapeHtml(swatch.hex)}"></span>
              <strong>${text(swatch)}</strong>
              <code>${escapeHtml(swatch.hex)}</code>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function experienceSection() {
    const section = data.experience;
    return `
      <section class="case-section experience-section page-shell nav-section" id="${section.id}" data-nav-section="experience" aria-labelledby="experience-title">
        <div class="section-spread">
          <div>
            ${sectionIntro(section, "experience-title")}
            <p class="section-lede">${text(section.body)}</p>
            ${list(section.points)}
          </div>
          ${assetFigure("retail", "experience-hero-image")}
        </div>
        <div class="editorial-sequence">
          ${section.images.map((key, index) => assetFigure(key, index === 0 ? "sequence-large" : "sequence-image")).join("")}
        </div>
        <a class="secondary-button" href="${escapeHtml(data.settings.brandSiteUrl)}">${text(data.ui.viewBrandSite)}</a>
      </section>
    `;
  }

  function completionSection() {
    const section = data.completion;
    return `
      <section class="case-section completion-section page-shell" id="${section.id}" aria-labelledby="completion-title">
        ${sectionIntro(section, "completion-title")}
        <div class="completion-columns">
          ${section.completed.map((item) => `
            <article>
              <span>${escapeHtml(item.number)}</span>
              <h3>${text(item.title)}</h3>
              <p>${text(item.body)}</p>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function appendixSection() {
    const section = data.appendix;
    return `
      <section class="case-section appendix-section page-shell" id="${section.id}" aria-labelledby="appendix-title">
        <details>
          <summary id="appendix-title">
            <span>${escapeHtml(section.number)} / ${text(section.title)}</span>
            <em>${text(data.ui.appendixOpen)}</em>
          </summary>
          <p>${text(section.note)}</p>
          ${list(section.items)}
        </details>
      </section>
    `;
  }

  function sourceDrawer() {
    return `
      <aside class="source-drawer" data-source-drawer aria-hidden="true" aria-label="${text(data.ui.sourceDrawerTitle)}">
        <div>
          <header>
            <h2>${text(data.ui.sourceDrawerTitle)}</h2>
            <button type="button" data-source-close aria-label="${text(data.ui.close)}">×</button>
          </header>
          ${list(data.research.sourceNames, "source-list")}
        </div>
      </aside>
    `;
  }

  function lightbox() {
    return `
      <div class="lightbox" data-lightbox hidden>
        <button class="lightbox-close" type="button" data-lightbox-close aria-label="${text(data.ui.close)}">×</button>
        <button class="lightbox-arrow is-prev" type="button" data-lightbox-prev aria-label="${language === "zh" ? "上一张" : "Previous image"}">‹</button>
        <figure>
          <div class="lightbox-stage" data-lightbox-image role="img"></div>
          <figcaption data-lightbox-caption></figcaption>
        </figure>
        <button class="lightbox-arrow is-next" type="button" data-lightbox-next aria-label="${language === "zh" ? "下一张" : "Next image"}">›</button>
      </div>
    `;
  }

  function logoMarkSvg() {
    return `
      <svg viewBox="0 0 64 64" focusable="false">
        <path d="M54.85 14.15A29 29 0 1 1 52.15 11.14"></path>
        <path d="M51.86 16.49A25.2 25.2 0 1 1 49.51 13.87"></path>
        <circle cx="32" cy="32" r="2.6"></circle>
        <path d="M32 6.8v22.6M32 34.6v22.6M6.8 32h22.6M34.6 32h22.6M14.18 14.18l15.98 15.98M33.84 33.84l15.98 15.98M49.82 14.18 33.84 30.16M30.16 33.84 14.18 49.82"></path>
      </svg>
    `;
  }

  function customCursor() {
    return `
      <div class="custom-cursor case-custom-cursor" data-custom-cursor aria-hidden="true">
        <span class="cursor-symbol">${logoMarkSvg()}</span>
        <span class="cursor-ring"><em data-cursor-label></em></span>
      </div>
    `;
  }

  function tapFeedback() {
    return `
      <div class="tap-feedback" data-tap-feedback aria-hidden="true">
        <span class="tap-symbol">${logoMarkSvg()}</span>
      </div>
    `;
  }

  function footer() {
    return `
      <footer class="case-footer page-shell">
        <span>IMMANENT / 蕴 · ${language === "zh" ? "独立虚构品牌概念" : "Independent fictional brand concept"} · 2026</span>
        <a href="#overview">${language === "zh" ? "回到顶部" : "Back to top"}</a>
      </footer>
    `;
  }

  function render() {
    document.documentElement.dataset.language = language;
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title = language === "zh" ? "IMMANENT / 蕴 — 品牌案例 V4.6" : "IMMANENT / 蕴 — V4.6 Brand Case Study";
    document.getElementById("app").innerHTML = `
      ${header()}
      <main id="main">
        ${overviewSection()}
        ${researchSection()}
        ${strategySection()}
        ${productSystemSection()}
        ${sourceProcessSection()}
        ${decisionsSection()}
        ${useExperienceSection()}
        ${identitySection()}
        ${experienceSection()}
        ${completionSection()}
        ${appendixSection()}
      </main>
      ${footer()}
      ${sourceDrawer()}
      ${lightbox()}
      ${customCursor()}
      ${tapFeedback()}
    `;
    bindEvents();
    setupActiveNav();
    setupReveal();
    setupImageHealth();
    setupCustomCursor();
    setupTapFeedback();
    refreshLightboxItems();
  }

  function refreshLightboxItems() {
    lightboxItems = Array.from(document.querySelectorAll("[data-lightbox-src]")).map((node) => ({
      src: node.dataset.lightboxSrc,
      caption: node.dataset.lightboxCaption || ""
    }));
  }

  function openLightbox(src) {
    refreshLightboxItems();
    lightboxIndex = Math.max(0, lightboxItems.findIndex((item) => item.src === src));
    lockPageScroll();
    const box = document.querySelector("[data-lightbox]");
    if (box) box.hidden = false;
    updateLightbox();
  }

  function closeLightbox() {
    const box = document.querySelector("[data-lightbox]");
    if (box) box.hidden = true;
    clearLightboxChrome();
    unlockPageScroll();
    window.requestAnimationFrame(() => window.requestAnimationFrame(recoverAssetImages));
  }

  function moveLightbox(delta) {
    if (!lightboxItems.length) return;
    lightboxIndex = (lightboxIndex + delta + lightboxItems.length) % lightboxItems.length;
    updateLightbox();
  }

  function updateLightbox() {
    const item = lightboxItems[lightboxIndex];
    const stage = document.querySelector("[data-lightbox-image]");
    const caption = document.querySelector("[data-lightbox-caption]");
    if (!item || !stage || !caption) return;
    stage.style.backgroundImage = `url("${cssUrl(item.src)}")`;
    stage.setAttribute("aria-label", item.caption);
    caption.textContent = item.caption;
  }

  function clearLightboxChrome() {
    const stage = document.querySelector("[data-lightbox-image]");
    const caption = document.querySelector("[data-lightbox-caption]");
    if (stage) {
      stage.style.backgroundImage = "";
      stage.removeAttribute("aria-label");
    }
    if (caption) caption.textContent = "";
  }

  function setupImageHealth() {
    document.querySelectorAll("[data-lightbox-src] img").forEach((image) => {
      image.addEventListener("load", () => {
        image.dataset.loaded = "true";
        image.dataset.retrying = "false";
        image.dataset.retryCount = "0";
        image.closest("[data-lightbox-src]")?.classList.remove("has-image-error");
      });
      image.addEventListener("error", () => {
        const frame = image.closest("[data-lightbox-src]");
        const src = frame?.dataset.lightboxSrc;
        if (!src) return;
        frame.classList.add("has-image-error");
        retryAssetImage(image, src);
      });
    });
  }

  function retryAssetImage(image, src) {
    if (image.dataset.retrying === "true") return;
    const retries = Number(image.dataset.retryCount || 0);
    if (retries >= 4) return;
    image.dataset.retrying = "true";
    image.dataset.retryCount = String(retries + 1);
    window.setTimeout(() => {
      const probe = new Image();
      probe.decoding = "async";
      const retrySrc = `${src}${src.includes("?") ? "&" : "?"}immanentReload=${Date.now()}-${retries}`;
      probe.onload = () => {
        image.dataset.retrying = "false";
        image.dataset.loaded = "true";
        image.closest("[data-lightbox-src]")?.classList.remove("has-image-error");
        image.setAttribute("src", retrySrc);
      };
      probe.onerror = () => {
        image.dataset.retrying = "false";
        retryAssetImage(image, src);
      };
      probe.src = retrySrc;
    }, 220 * (retries + 1));
  }

  function isSameAssetSrc(current, src) {
    return current === src || current.startsWith(`${src}?`) || current.startsWith(`${src}&`);
  }

  function recoverAssetImages() {
    document.querySelectorAll("[data-lightbox-src]").forEach((frame) => {
      const image = frame.querySelector("img");
      const src = frame.dataset.lightboxSrc;
      if (!image || !src) return;
      image.style.opacity = "";
      image.style.visibility = "";
      if (!isSameAssetSrc(image.getAttribute("src") || "", src)) image.setAttribute("src", src);
      if (image.complete && image.naturalWidth === 0) {
        image.loading = "eager";
        frame.classList.add("has-image-error");
        retryAssetImage(image, src);
      }
    });
  }

  function lockPageScroll() {
    if (document.body.classList.contains("is-lightbox-open")) return;
    lockedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.top = "";
    document.documentElement.classList.add("is-lightbox-open");
    document.body.classList.add("is-lightbox-open");
  }

  function unlockPageScroll() {
    if (!document.body.classList.contains("is-lightbox-open") && !document.documentElement.classList.contains("is-lightbox-open")) return;
    document.documentElement.classList.remove("is-lightbox-open");
    document.body.classList.remove("is-lightbox-open");
    document.body.style.top = "";
    const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    if (Math.abs(currentScrollY - lockedScrollY) > 2) {
      const previousBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, lockedScrollY);
      document.documentElement.style.scrollBehavior = previousBehavior;
    }
  }

  function openSourceDrawer() {
    const drawer = document.querySelector("[data-source-drawer]");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
  }

  function closeSourceDrawer() {
    const drawer = document.querySelector("[data-source-drawer]");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
  }

  function setupActiveNav() {
    const links = Array.from(document.querySelectorAll("[data-nav-link]"));
    const sections = Array.from(document.querySelectorAll("[data-nav-section]"));
    if (!("IntersectionObserver" in window) || !links.length || !sections.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.toggle("is-active", link.dataset.navLink === entry.target.dataset.navSection));
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 });
    sections.forEach((section) => observer.observe(section));
  }

  function setupReveal() {
    const targets = Array.from(document.querySelectorAll("main > section, .evidence-grid article, .system-product, .completion-columns article"));
    if (!targets.length) return;
    targets.forEach((target) => target.classList.add("reveal-target"));
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    targets.forEach((target) => observer.observe(target));
  }

  function setupCustomCursor() {
    const cursor = document.querySelector("[data-custom-cursor]");
    if (!cursor) return;
    const canUse = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canUse) return;
    const label = cursor.querySelector("[data-cursor-label]");
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let moving = false;
    document.body.classList.add("has-case-cursor");

    function draw() {
      currentX += (targetX - currentX) * 0.46;
      currentY += (targetY - currentY) * 0.46;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      if (moving) window.requestAnimationFrame(draw);
    }

    function stateFor(node) {
      if (node.closest("[data-lightbox-src]")) return { state: "view", label: "VIEW" };
      if (node.closest("[data-source-row]")) return { state: "read", label: "READ" };
      if (node.closest("summary, [data-source-open], [data-source-close]")) return { state: "open", label: "OPEN" };
      if (node.closest("a, button")) return { state: "link", label: "" };
      return { state: "default", label: "" };
    }

    document.addEventListener("pointermove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.classList.add("is-visible");
      const state = stateFor(event.target);
      cursor.dataset.state = state.state;
      label.textContent = state.label;
      if (!moving) {
        moving = true;
        window.requestAnimationFrame(draw);
      }
    }, { passive: true });

    document.addEventListener("pointerleave", () => {
      cursor.classList.remove("is-visible");
      moving = false;
    });
  }

  function setupTapFeedback() {
    if (tapFeedbackBound) return;
    tapFeedbackBound = true;

    function show(x, y) {
      const mark = document.querySelector("[data-tap-feedback]");
      if (!mark) return;
      mark.style.left = `${x}px`;
      mark.style.top = `${y}px`;
      mark.classList.remove("is-active");
      void mark.offsetWidth;
      mark.classList.add("is-active");
      window.clearTimeout(mark.tapFeedbackTimer);
      mark.tapFeedbackTimer = window.setTimeout(() => mark.classList.remove("is-active"), 720);
    }

    if ("PointerEvent" in window) {
      document.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "mouse" || event.button > 0 || event.isPrimary === false) return;
        show(event.clientX, event.clientY);
      }, { passive: true });
      return;
    }

    document.addEventListener("touchstart", (event) => {
      const touch = event.changedTouches[0];
      if (!touch) return;
      show(touch.clientX, touch.clientY);
    }, { passive: true });
  }

  function bindEvents() {
    const languageToggle = document.querySelector("[data-language-toggle]");
    const menuToggle = document.querySelector("[data-menu-toggle]");
    const mobileNav = document.querySelector("[data-mobile-nav]");

    languageToggle.addEventListener("click", () => {
      language = language === "en" ? "zh" : "en";
      window.localStorage.setItem(storageKey, language);
      render();
    });

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      mobileNav.classList.toggle("is-open", !isOpen);
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("is-open");
      });
    });

    document.querySelectorAll("[data-source-open]").forEach((button) => button.addEventListener("click", openSourceDrawer));
    document.querySelectorAll("[data-source-close]").forEach((button) => button.addEventListener("click", closeSourceDrawer));
    document.querySelectorAll("[data-source-row]").forEach((row) => {
      row.addEventListener("click", openSourceDrawer);
      row.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openSourceDrawer();
        }
      });
    });
    document.querySelector("[data-source-drawer]").addEventListener("click", (event) => {
      if (event.target.matches("[data-source-drawer]")) closeSourceDrawer();
    });

    document.querySelectorAll("[data-lightbox-src]").forEach((node) => {
      node.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openLightbox(node.dataset.lightboxSrc);
      });
      node.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          openLightbox(node.dataset.lightboxSrc);
        }
      });
    });
    document.querySelector("[data-lightbox-close]").addEventListener("click", closeLightbox);
    document.querySelector("[data-lightbox-prev]").addEventListener("click", () => moveLightbox(-1));
    document.querySelector("[data-lightbox-next]").addEventListener("click", () => moveLightbox(1));
    document.querySelector("[data-lightbox]").addEventListener("click", (event) => {
      if (event.target.matches("[data-lightbox]")) closeLightbox();
    });
    let touchStartX = null;
    document.querySelector("[data-lightbox]").addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    document.querySelector("[data-lightbox]").addEventListener("touchend", (event) => {
      if (touchStartX == null) return;
      const delta = event.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(delta) > 44) moveLightbox(delta > 0 ? -1 : 1);
    }, { passive: true });
    document.addEventListener("keydown", (event) => {
      const box = document.querySelector("[data-lightbox]");
      if (!box || box.hidden) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") moveLightbox(-1);
      if (event.key === "ArrowRight") moveLightbox(1);
    });
  }

  render();
})();
