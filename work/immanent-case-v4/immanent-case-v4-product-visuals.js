(function () {
  const assets = {
    peel: "/images/immanent-v4/01_PEEL_exploded_view_final.png",
    pulp: "/images/immanent-v4/IMMANENT_case_PULP_open_cap_original_440.webp"
  };

  const copy = {
    en: {
      label: "Product & Packaging Detail",
      title: "Open structure comes first.",
      body: "This section opens with the two product mechanisms: PEEL shows the replaceable fragrance core; PULP shows the lifted measuring cap and bottle opening.",
      peelTitle: "PEEL 01",
      peelCaption: "Replaceable fragrance core and outer structure.",
      pulpTitle: "PULP 01",
      pulpCaption: "Opened bottle with measuring cap."
    },
    zh: {
      label: "产品与包装细节",
      title: "先看到打开方式，再理解设计。",
      body: "这一节先展示两款产品的打开结构：PEEL 是可替换的香氛内芯，PULP 是带量取功能的瓶盖与瓶口关系。",
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
      grid-template-columns: minmax(0, 1fr) minmax(0, .92fr);
      gap: clamp(16px, 2.2vw, 34px);
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
      overflow: hidden;
      background: rgba(251, 247, 239, .68);
      box-shadow: 0 20px 54px rgba(28, 30, 26, .055);
    }
    .product-detail-media img {
      display: block;
      width: 100%;
      height: auto;
      filter: saturate(.98) contrast(.99) brightness(1.01);
    }
    .product-detail-copy {
      display: grid;
      grid-template-columns: minmax(0, .45fr) minmax(0, .55fr);
      gap: clamp(18px, 4vw, 70px);
      align-items: start;
      max-width: 100%;
      min-width: 0;
    }
    .product-detail-copy h3 {
      margin: 0;
      color: var(--ink);
      font-family: var(--font-en-display);
      font-size: clamp(25px, 2vw, 38px);
      font-weight: 400;
      line-height: 1.08;
      text-wrap: balance;
    }
    html[data-language="zh"] .product-detail-copy h3 {
      font-family: var(--font-zh-display);
      font-size: clamp(24px, 1.9vw, 34px);
      line-height: 1.2;
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

  function installStyles() {
    if (document.getElementById("case-product-detail-visuals-style")) return;
    const style = document.createElement("style");
    style.id = "case-product-detail-visuals-style";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function figure(kind, number, title, caption) {
    const alt = escapeHtml(`${title} - ${caption}`);
    return `
      <figure class="product-detail-figure product-detail-figure--${kind}">
        <div class="product-detail-media">
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
      <div class="product-detail-copy">
        <p class="eyebrow">${escapeHtml(t.label)}</p>
        <h3>${escapeHtml(t.title)}</h3>
        <p>${escapeHtml(t.body)}</p>
      </div>
    `;
  }

  function insertVisuals() {
    installStyles();
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
