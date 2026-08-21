(function () {
  const assets = {
    peel: "/images/immanent-v4/01_PEEL_exploded_view_final.png",
    pulp: "/images/immanent-v4/IMMANENT_01_PULP_open_action.png"
  };

  const copy = {
    en: {
      aria: "Product and packaging details",
      peelTitle: "PEEL 01",
      peelCaption: "Replaceable fragrance core and outer structure.",
      pulpTitle: "PULP 01",
      pulpCaption: "Opened bottle with measuring cap."
    },
    zh: {
      aria: "产品与包装细节",
      peelTitle: "PEEL 01",
      peelCaption: "可替换香氛内芯与外壳结构。",
      pulpTitle: "PULP 01",
      pulpCaption: "瓶盖打开后，量取方式直接可见。"
    }
  };

  function language() {
    return document.documentElement.dataset.language === "zh" ? "zh" : "en";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function cssUrl(input) {
    return String(input).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "");
  }

  function openDetailLightbox(node) {
    const src = node.dataset.lightboxSrc;
    if (!src) return;
    const box = document.querySelector("[data-lightbox]");
    const stage = document.querySelector("[data-lightbox-image]");
    const caption = document.querySelector("[data-lightbox-caption]");
    if (!box || !stage || !caption) return;
    const label = node.dataset.lightboxCaption || "";
    stage.style.backgroundImage = `url("${cssUrl(src)}")`;
    stage.setAttribute("aria-label", label);
    caption.textContent = label;
    box.hidden = false;
  }

  function bindDetailLightbox() {
    if (document.documentElement.dataset.productDetailLightboxBound === "true") return;
    document.documentElement.dataset.productDetailLightboxBound = "true";
    document.addEventListener("click", (event) => {
      const node = event.target.closest(".product-detail-media[data-lightbox-src]");
      if (!node) return;
      event.preventDefault();
      event.stopPropagation();
      openDetailLightbox(node);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const node = event.target.closest(".product-detail-media[data-lightbox-src]");
      if (!node) return;
      event.preventDefault();
      event.stopPropagation();
      openDetailLightbox(node);
    });
  }

  function figure(kind, number, title, caption) {
    const alt = `${title} - ${caption}`;
    return `
      <figure class="product-detail-figure product-detail-figure--${kind}">
        <div class="product-detail-media" role="button" tabindex="0" data-lightbox-src="${escapeHtml(assets[kind])}" data-lightbox-caption="${escapeHtml(alt)}">
          <img src="${escapeHtml(assets[kind])}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">
        </div>
        <figcaption><span>${number}</span><strong>${escapeHtml(title)}</strong><em>${escapeHtml(caption)}</em></figcaption>
      </figure>
    `;
  }

  function markup(lang) {
    const t = copy[lang];
    return `
      <div class="product-detail-gallery">
        ${figure("peel", "01", t.peelTitle, t.peelCaption)}
        ${figure("pulp", "02", t.pulpTitle, t.pulpCaption)}
      </div>
    `;
  }

  function insertVisuals() {
    bindDetailLightbox();
    const target = document.getElementById("design-decisions");
    const decisionGrid = target?.querySelector(".decision-grid");
    if (!target || !decisionGrid) return;

    const lang = language();
    let block = target.querySelector(".product-detail-insert");
    if (!block) {
      block = document.createElement("aside");
      block.className = "product-detail-insert";
    }

    block.setAttribute("aria-label", copy[lang].aria);
    if (block.dataset.language !== lang) {
      block.innerHTML = markup(lang);
      block.dataset.language = lang;
    }

    if (block.nextElementSibling !== decisionGrid) {
      target.insertBefore(block, decisionGrid);
    }
  }

  function scheduleInsert() {
    window.requestAnimationFrame(insertVisuals);
  }

  document.addEventListener("DOMContentLoaded", scheduleInsert);
  window.addEventListener("load", scheduleInsert, { once: true });

  const app = document.getElementById("app");
  if (app) new MutationObserver(scheduleInsert).observe(app, { childList: true });
  new MutationObserver(scheduleInsert).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-language"]
  });
  scheduleInsert();
})();
