(function () {
  const data = window.IMMANENT_BRAND_V4_DATA;
  const languageKey = "immanent-brand-v4-language";
  const bagKey = "immanent-brand-v4-bag";
  const rootPath = data.settings.brandRoot || "/work/immanent-brand-v4/";
  let language = getInitialLanguage();
  let bag = loadBag();
  let lightboxItems = [];
  let lightboxIndex = 0;
  let lockedScrollY = 0;
  let tapFeedbackBound = false;

  function getInitialLanguage() {
    const saved = window.localStorage.getItem(languageKey);
    return saved === "zh" || saved === "en" ? saved : data.settings.defaultLanguage || "en";
  }

  function loadBag() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(bagKey) || "[]");
      return Array.isArray(parsed) ? parsed.filter((item) => data.products[item.id]) : [];
    } catch {
      return [];
    }
  }

  function saveBag() {
    window.localStorage.setItem(bagKey, JSON.stringify(bag));
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

  function productUrl(id) {
    return `${rootPath}${data.products[id].slug}/`;
  }

  function currentProductId() {
    const path = window.location.pathname.replace(/\/+$/, "");
    return Object.keys(data.products).find((id) => path.endsWith(`/${data.products[id].slug}`)) || null;
  }

  function lineTitle(lines) {
    return value(lines).map((line) => `<span class="title-line">${escapeHtml(line)}</span>`).join("");
  }

  function copyLines(lines, className = "copy-lines") {
    return `<div class="${className}">${value(lines).map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>`;
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
    const fit = asset.fit || (asset.type === "packshot" ? "contain" : "cover");
    const caption = value(asset.alt);
    const priority = loading === "eager" ? ' fetchpriority="high"' : "";
    return `
      <figure class="asset-frame zoomable asset-${asset.type} ${className}" data-fit="${escapeHtml(fit)}" data-lightbox-src="${escapeHtml(asset.src)}" data-lightbox-caption="${escapeHtml(caption)}" tabindex="0" style="--asset-ratio:${ratioToCss(asset.ratio)}; --asset-focal:${escapeHtml(asset.focal || "50% 50%")}; --asset-url:url('${escapeHtml(cssUrl(asset.src))}')">
        <img src="${escapeHtml(asset.src)}" alt="${escapeHtml(caption)}" loading="${loading}" decoding="async"${priority}>
        <span class="view-label">${language === "zh" ? "查看" : "View"}</span>
      </figure>
    `;
  }

  function money(amount) {
    return `£${amount}`;
  }

  function bagCount() {
    return bag.reduce((sum, item) => sum + item.quantity, 0);
  }

  function bagSubtotal() {
    return bag.reduce((sum, item) => sum + data.products[item.id].price * item.quantity, 0);
  }

  function lockup() {
    return `
      <a class="brand-lockup" href="${rootPath}" aria-label="IMMANENT / 蕴">
        <span>IMMANENT</span><span class="brand-divider">/</span><span class="brand-zh">蕴</span>
      </a>
    `;
  }

  function header() {
    const activeProduct = currentProductId();
    const navLinks = data.nav.map((item) => {
      const href = item.product ? productUrl(item.product) : `${rootPath}#${item.id}`;
      const activeClass = activeProduct && item.product === activeProduct ? " is-active" : "";
      return `<a class="${activeClass}" href="${href}" data-nav-link="${escapeHtml(item.id)}">${text(item.label)}</a>`;
    }).join("");
    return `
      <a class="skip-link" href="#main">${text(data.ui.skip)}</a>
      <header class="site-header">
        <div class="header-inner page-shell">
          ${lockup()}
          <nav class="desktop-nav" aria-label="Primary">${navLinks}</nav>
          <div class="header-actions">
            <button class="lang-toggle" type="button" data-language-toggle aria-label="Switch language">
              <span class="${language === "en" ? "is-active" : ""}">EN</span>
              <span aria-hidden="true">/</span>
              <span class="${language === "zh" ? "is-active" : ""}">中文</span>
            </button>
            <button class="bag-button" type="button" data-bag-open>
              <span>${text(data.ui.bag)}</span>
              <span class="bag-count">${bagCount()}</span>
            </button>
            <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-label="${text(data.ui.menu)}">
              <span class="menu-open">${text(data.ui.menu)}</span>
              <span class="menu-close">${text(data.ui.close)}</span>
            </button>
          </div>
        </div>
        <nav class="mobile-nav" data-mobile-nav aria-label="Mobile">${navLinks}</nav>
      </header>
    `;
  }

  function productCard(id) {
    const product = data.products[id];
    const ctaLabel = id === "peel" ? data.ui.discoverPeel : id === "pulp" ? data.ui.discoverPulp : data.ui.viewGiftSet;
    return `
      <article class="product-card">
        <a href="${productUrl(id)}" aria-label="${text(product.name)}">
          <div class="product-card-media">
            ${assetFigure(product.thumbnail, "product-card-image is-main")}
            ${assetFigure(product.hoverImage || product.thumbnail, "product-card-image is-hover")}
          </div>
          <div class="product-card-copy">
            <p class="eyebrow">${text(product.category)}</p>
            <h3>${text(product.name)}</h3>
            <p>${text(product.oneLine)}</p>
            <div class="product-meta">
              <span>${escapeHtml(product.size)}</span>
              <span>${escapeHtml(product.priceLabel)}</span>
            </div>
          </div>
        </a>
        <a class="secondary-button" href="${productUrl(id)}">${text(ctaLabel)}</a>
      </article>
    `;
  }

  function sectionIntro(eyebrow, titleLines, id) {
    return `
      <div class="section-intro">
        <p class="eyebrow">${text(eyebrow)}</p>
        <h2 id="${id}">${lineTitle(titleLines)}</h2>
      </div>
    `;
  }

  function homePage() {
    const home = data.home;
    return `
      <main id="main">
        <section class="brand-hero page-shell" id="top">
          <div class="hero-copy">
            <h1>${lineTitle(home.hero.titleLines)}</h1>
            ${copyLines(home.hero.bodyLines)}
            <div class="hero-actions">
              <a class="primary-button" href="${productUrl("peel")}">${text(data.ui.discoverPeel)}</a>
              <a class="secondary-button" href="${productUrl("pulp")}">${text(data.ui.discoverPulp)}</a>
            </div>
          </div>
          ${assetFigure("heroDuo", "hero-image", "eager")}
        </section>

        <section class="shop-section page-shell" id="shop" aria-labelledby="shop-title">
          <div class="shop-head">
            <p class="eyebrow">${text(home.shop.eyebrow)}</p>
            <h2 id="shop-title">${text(home.shop.title)}</h2>
          </div>
          <div class="product-pair-grid">
            ${productCard("peel")}
            ${productCard("pulp")}
          </div>
        </section>

        <section class="origin-section page-shell" id="source" aria-labelledby="source-title">
          <div class="origin-copy">
            ${sectionIntro(home.origin.eyebrow, home.origin.titleLines, "source-title")}
            ${copyLines(home.origin.bodyLines)}
            <p class="source-note">${text(home.origin.sourcing)}</p>
          </div>
          ${assetFigure("sourceStill", "origin-image")}
        </section>

        <section class="feature-product page-shell" id="peel-01" aria-labelledby="peel-title">
          ${assetFigure("peelTactile", "feature-image")}
          <div class="feature-copy">
            <p class="eyebrow">${text(data.products.peel.category)}</p>
            <h2 id="peel-title">PEEL 01</h2>
            <p>${text(data.products.peel.oneLine)}</p>
            <a class="secondary-button" href="${productUrl("peel")}">${text(data.ui.discoverPeel)}</a>
          </div>
        </section>

        <section class="feature-product is-reverse page-shell" id="pulp-01" aria-labelledby="pulp-title">
          <div class="feature-copy">
            <p class="eyebrow">${text(data.products.pulp.category)}</p>
            <h2 id="pulp-title">PULP 01</h2>
            <p>${text(data.products.pulp.oneLine)}</p>
            <a class="secondary-button" href="${productUrl("pulp")}">${text(data.ui.discoverPulp)}</a>
          </div>
          ${assetFigure("pulpPour", "feature-image")}
        </section>

        <section class="ritual-section page-shell" id="process" aria-labelledby="process-title">
          ${assetFigure("pulpPour", "ritual-detail")}
          <div class="ritual-copy">
            ${sectionIntro(home.ritual.eyebrow, home.ritual.titleLines, "process-title")}
            <p>${text(home.ritual.body)}</p>
            <div class="serve-ratio" aria-label="PULP serve ratio">
              <span>25 mL</span>
              <i>+</i>
              <span>150–200 mL</span>
            </div>
          </div>
        </section>

        <section class="duo-section page-shell" id="duo" aria-labelledby="duo-title">
          ${assetFigure("giftBox", "duo-image")}
          <div class="duo-copy">
            <p class="eyebrow">${text(data.products.duo.category)}</p>
            <h2 id="duo-title">${text(home.duo.title)}</h2>
            <p>${text(home.duo.body)}</p>
            <div class="product-meta">
              <span>${escapeHtml(data.products.duo.size)}</span>
              <span>${escapeHtml(data.products.duo.priceLabel)}</span>
            </div>
            <a class="secondary-button" href="${productUrl("duo")}">${text(data.ui.viewGiftSet)}</a>
          </div>
        </section>

        <section class="about-section page-shell" id="about" aria-labelledby="about-title">
          <div class="about-copy">
            ${sectionIntro(home.about.eyebrow, home.about.titleLines, "about-title")}
            ${copyLines(home.about.bodyLines)}
          </div>
          ${assetFigure("retail", "about-image")}
        </section>
      </main>
    `;
  }

  function pdpGallery(product) {
    const galleryLabel = `${value(product.name)} ${language === "zh" ? "图片" : "gallery"}`;
    return `
      <div class="pdp-gallery" aria-label="${escapeHtml(galleryLabel)}">
        ${product.gallery.map((key, index) => assetFigure(key, index === 0 ? "pdp-image is-primary" : "pdp-image", index === 0 ? "eager" : "lazy")).join("")}
      </div>
    `;
  }

  function accordion(product) {
    const details = {
      details: `${product.size} · ${product.priceLabel} · ${value(product.object)}`,
      profile: value(product.profile),
      howToUse: value(product.howToUse),
      origin: value(product.origin),
      formulaNote: value(product.formulaNote),
      delivery: value(product.delivery)
    };
    return `
      <div class="pdp-accordion">
        ${data.accordion.map((item, index) => `
          <details ${index === 0 ? "open" : ""}>
            <summary>${text(item.label)}</summary>
            <p>${escapeHtml(details[item.key])}</p>
          </details>
        `).join("")}
      </div>
    `;
  }

  function productPage(productId) {
    const product = data.products[productId];
    const related = data.products[product.related];
    return `
      <main id="main">
        <section class="pdp page-shell" id="top">
          ${pdpGallery(product)}
          <aside class="pdp-info">
            <p class="eyebrow">${text(product.category)}</p>
            <h1>${text(product.name)}</h1>
            <p class="pdp-one-line">${text(product.oneLine)}</p>
            <div class="pdp-meta">
              <span>${escapeHtml(product.size)}</span>
              <span>${escapeHtml(product.priceLabel)}</span>
            </div>
            <button class="primary-button" type="button" data-add-to-bag="${productId}">${text(data.ui.addToBag)}</button>
            ${accordion(product)}
          </aside>
        </section>

        <section class="pdp-story page-shell">
          ${assetFigure(product.storyImage, "story-image")}
          <div>
            <h2>${text(product.storyTitle)}</h2>
            <p>${text(product.story)}</p>
          </div>
        </section>

        <section class="related-section page-shell">
          <p class="eyebrow">${language === "zh" ? "相关产品" : "Related product"}</p>
          <a class="related-link" href="${productUrl(product.related)}">
            <span>${text(related.name)}</span>
            <em>${text(related.oneLine)}</em>
            <strong>${escapeHtml(related.priceLabel)}</strong>
          </a>
        </section>
      </main>
    `;
  }

  function bagDrawer() {
    const items = bag.map((item) => {
      const product = data.products[item.id];
      return `
        <li class="bag-item">
          ${assetFigure(product.thumbnail, "bag-thumb")}
          <div>
            <strong>${text(product.name)}</strong>
            <span>${text(product.category)}</span>
            <span>${escapeHtml(product.priceLabel)}</span>
            <div class="quantity-control">
              <button type="button" data-quantity="${item.id}" data-delta="-1">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-quantity="${item.id}" data-delta="1">+</button>
            </div>
            <button class="text-button" type="button" data-remove="${item.id}">${text(data.ui.remove)}</button>
          </div>
        </li>
      `;
    }).join("");
    return `
      <aside class="bag-drawer" data-bag-drawer aria-hidden="true" aria-label="${text(data.ui.bag)}">
        <div class="bag-panel">
          <div class="bag-head">
            <h2>${text(data.ui.bag)}</h2>
            <button type="button" data-bag-close aria-label="${text(data.ui.close)}">×</button>
          </div>
          ${bag.length ? `<ul class="bag-list">${items}</ul>` : `<p class="empty-bag">${text(data.ui.emptyBag)}</p>`}
          <div class="bag-foot">
            <p><span>${text(data.ui.subtotal)}</span><strong>${money(bagSubtotal())}</strong></p>
            <button class="primary-button" type="button" data-checkout ${bag.length ? "" : "disabled"}>${text(data.ui.checkout)}</button>
          </div>
        </div>
      </aside>
    `;
  }

  function checkoutModal() {
    return `
      <div class="checkout-modal" data-checkout-modal hidden>
        <div role="dialog" aria-modal="true" aria-labelledby="checkout-title">
          <h2 id="checkout-title">${text(data.ui.conceptPrototype)}</h2>
          <p>${text(data.ui.checkoutDisabled)}</p>
          <button class="secondary-button" type="button" data-checkout-close>${text(data.ui.continueBrowsing)}</button>
        </div>
      </div>
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
      <div class="custom-cursor brand-custom-cursor" data-custom-cursor aria-hidden="true">
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
      <footer class="brand-footer page-shell">
        <span>${text(data.home.footerNote)}</span>
        <a href="#top">${language === "zh" ? "回到顶部" : "Back to top"}</a>
      </footer>
    `;
  }

  function render() {
    const productId = currentProductId();
    document.documentElement.dataset.language = language;
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title = productId
      ? `${value(data.products[productId].name)} — IMMANENT / 蕴`
      : language === "zh"
        ? "IMMANENT / 蕴 — 来源 01"
        : "IMMANENT / 蕴 — Harvest 01";

    document.getElementById("app").innerHTML = `
      ${header()}
      ${productId ? productPage(productId) : homePage()}
      ${footer()}
      ${bagDrawer()}
      ${checkoutModal()}
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

  function addToBag(productId) {
    const existing = bag.find((item) => item.id === productId);
    if (existing) existing.quantity += 1;
    else bag.push({ id: productId, quantity: 1 });
    saveBag();
    render();
    const count = document.querySelector(".bag-count");
    if (count) {
      count.classList.add("is-pulsing");
      window.setTimeout(() => count.classList.remove("is-pulsing"), 220);
    }
    openBag();
  }

  function updateQuantity(productId, delta) {
    const item = bag.find((entry) => entry.id === productId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) bag = bag.filter((entry) => entry.id !== productId);
    saveBag();
    render();
    openBag();
  }

  function removeItem(productId) {
    bag = bag.filter((item) => item.id !== productId);
    saveBag();
    render();
    openBag();
  }

  function openBag() {
    const drawer = document.querySelector("[data-bag-drawer]");
    if (!drawer) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
  }

  function closeBag() {
    const drawer = document.querySelector("[data-bag-drawer]");
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
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

  function setupActiveNav() {
    if (currentProductId()) return;
    const links = Array.from(document.querySelectorAll("[data-nav-link]"));
    const sections = Array.from(document.querySelectorAll("#source, #peel-01, #pulp-01, #process, #duo, #about"));
    if (!links.length || !sections.length || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.toggle("is-active", link.dataset.navLink === entry.target.id));
      });
    }, { rootMargin: "-38% 0px -56% 0px", threshold: 0.01 });
    sections.forEach((section) => observer.observe(section));
  }

  function setupReveal() {
    const targets = Array.from(document.querySelectorAll("main > section, .product-card, .pdp-accordion details, .related-link"));
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
    document.body.classList.add("has-custom-cursor");

    function draw() {
      currentX += (targetX - currentX) * 0.38;
      currentY += (targetY - currentY) * 0.38;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      if (moving) window.requestAnimationFrame(draw);
    }

    function stateFor(node) {
      if (node.closest(".lightbox, .checkout-modal")) return { state: "light", label: "" };
      if (node.closest("[data-lightbox-src]")) return { state: "view", label: "VIEW" };
      if (node.closest(".product-card a, .related-link, .pdp-gallery")) return { state: "open", label: "OPEN" };
      if (node.closest("a, button, summary")) return { state: "link", label: "" };
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
    document.querySelector("[data-language-toggle]").addEventListener("click", () => {
      language = language === "en" ? "zh" : "en";
      window.localStorage.setItem(languageKey, language);
      render();
    });

    const menuToggle = document.querySelector("[data-menu-toggle]");
    const mobileNav = document.querySelector("[data-mobile-nav]");
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

    document.querySelectorAll("[data-add-to-bag]").forEach((button) => {
      button.addEventListener("click", () => addToBag(button.dataset.addToBag));
    });
    document.querySelectorAll("[data-bag-open]").forEach((button) => button.addEventListener("click", openBag));
    document.querySelectorAll("[data-bag-close]").forEach((button) => button.addEventListener("click", closeBag));
    document.querySelectorAll("[data-quantity]").forEach((button) => {
      button.addEventListener("click", () => updateQuantity(button.dataset.quantity, Number(button.dataset.delta)));
    });
    document.querySelectorAll("[data-remove]").forEach((button) => {
      button.addEventListener("click", () => removeItem(button.dataset.remove));
    });
    document.querySelectorAll("[data-checkout]").forEach((button) => {
      button.addEventListener("click", () => {
        const modal = document.querySelector("[data-checkout-modal]");
        modal.hidden = false;
      });
    });
    document.querySelectorAll("[data-checkout-close]").forEach((button) => {
      button.addEventListener("click", () => {
        const modal = document.querySelector("[data-checkout-modal]");
        modal.hidden = true;
      });
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
