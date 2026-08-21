(function () {
  const assets = {
    peel: "/images/immanent-v4/01_PEEL_exploded_view_final.png",
    pulp: "/images/immanent-v4/IMMANENT_01_PULP_open_action.png"
  };

  const copy = {
    en: {
      peelTitle: "PEEL 01",
      peelCaption: "Replaceable fragrance core and outer structure.",
      pulpTitle: "PULP 01",
      pulpCaption: "Opened bottle with measuring cap."
    },
    zh: {
      peelTitle: "PEEL 01",
      peelCaption: "可替换香氛内芯与外壳结构。",
      pulpTitle: "PULP 01",
      pulpCaption: "瓶盖打开后，量取方式直接可见。"
    }
  };

  const css = `
    .product-detail-insert {
      display: grid;
      gap: clamp(20px, 2.8vw, 40px);
      margin-top: clamp(24px, 3.2vw, 46px);
      margin-bottom: clamp(42px, 5.8vw, 78px);
      padding-top: clamp(28px, 3vw, 44px);
      padding-bottom: clamp(28px, 3.4vw, 48px);
      border-top: 1px solid var(--hairline-strong);
      border-bottom: 1px solid var(--hairline);
      min-width: 0;
    }
    .product-detail-gallery {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: clamp(18px, 2.4vw, 36px);
      align-items: start;
      min-width: 0;
    }
    .product-detail-figure {
      display: grid;
      gap: 13px;
      margin: 0;
      min-width: 0;
    }
    .product-detail-media {
      aspect-ratio: 1 / 1;
      display: grid;
      place-items: center;
      overflow: hidden;
      background: rgba(251, 247, 239, .72);
      box-shadow: 0 20px 54px rgba(28, 30, 26, .055);
      cursor: zoom-in;
    }
    .product-detail-media img {
      display: block;
      width: 100%;
      height: 100%;
      object-position: center;
      filter: saturate(.98) contrast(.99) brightness(1.01);
    }
    .product-detail-figure--peel .product-detail-media img {
      object-fit: cover;
    }
    .product-detail-figure--pulp .product-detail-media img {
      object-fit: contain;
    }
    .product-detail-copy {
      display: grid;
      grid-template-columns: minmax(0, .45fr) minmax(0, .55fr);
      gap: clamp(18px, 4vw, 70px);
      align-items: start;
      max-width: 100%;
      min-width: 0;
    }
    .product-detail-copy p:not(.eyebrow) {
      margin: 0;
      max-width: 36em;
      color: var(--ink-muted);
      font-size: var(--body);
      line-height: 1.7;
      text-wrap: pretty;
    }
    html[data-language="zh"] .product-detail-copy p:not(.eyebrow) {
      max-width: 26em;
      line-height: 1.86;
    }
    .product-detail-figure figcaption {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 4px 12px;
      padding-top: 13px;
      border-top: 1px solid var(--hairline);
      color: var(--ink-muted);
      font-size: var(--label);
      line-height: 1.45;
      min-width: 0;
    }
    .product-detail-figure figcaption span {
      grid-row: 1 / span 2;
      color: var(--brass);
      font-weight: 500;
      letter-spacing: .08em;
    }
    .product-detail-figure figcaption strong {
      color: var(--ink);
      font-family: var(--font-en-ui);
      font-size: var(--label);
      font-weight: 600;
      letter-spacing: .08em;
      line-height: 1.2;
    }
    .product-detail-figure figcaption em {
      font-style: normal;
    }
    @media (max-width: 1040px) {
      .product-detail-copy {
        grid-template-columns: 1fr;
        max-width: 42em;
      }
    }
    @media (max-width: 680px) {
      .product-detail-insert {
        margin-top: clamp(46px, 14vw, 72px);
        gap: 26px;
      }
      .product-detail-gallery {
        grid-template-columns: 1fr;
        gap: 26px;
      }
      .product-detail-copy {
        gap: 14px;
      }
    }
  `;

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

  function installStyles() {
    if (document.getElementById("case-product-detail-visuals-style")) return;
    const style = document.createElement("style");
    style.id = "case-product-detail-visuals-style";
    style.textContent = css;
    document.head.appendChild(style);
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
    const alt = escapeHtml(`${title} - ${caption}`);
    return `
      <figure class="product-detail-figure product-detail-figure--${kind}">
        <div class="product-detail-media" role="button" tabindex="0" data-lightbox-src="${assets[kind]}" data-lightbox-caption="${alt}">
          <img src="${assets[kind]}" alt="${alt}" loading="lazy" decoding="async">
        </div>
        <figcaption><span>${number}</span><strong>${escapeHtml(title)}</strong><em>${escapeHtml(caption)}</em></figcaption>
      </figure>
    `;
  }

  function markup() {
    const t = copy[language()];
    return `
      <div class="product-detail-gallery">
        ${figure("peel", "01", t.peelTitle, t.peelCaption)}
        ${figure("pulp", "02", t.pulpTitle, t.pulpCaption)}
      </div>
    `;
  }

  function insertVisuals() {
    installStyles();
    bindDetailLightbox();
    const target = document.getElementById("design-decisions");
    const decisionGrid = target?.querySelector(".decision-grid");
    if (!target || !decisionGrid) return;

    let block = target.querySelector(".product-detail-insert");
    if (!block) {
      block = document.createElement("aside");
      block.className = "product-detail-insert";
      block.setAttribute("aria-label", language() === "zh" ? "产品与包装细节" : "Product and packaging detail");
    }

    block.innerHTML = markup();
    if (block.nextElementSibling !== decisionGrid) target.insertBefore(block, decisionGrid);
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
