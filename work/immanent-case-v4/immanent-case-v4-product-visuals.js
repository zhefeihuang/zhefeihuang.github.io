(function () {
  const assets = {
    pulp: "/images/immanent-v4/IMMANENT_08_PULP_measuring_cap_detail.png",
    peel: "/images/immanent-v4/01_PEEL_exploded_view_final.png"
  };

  const copy = {
    en: {
      label: "Product & Packaging Detail",
      title: "The use is built into the object.",
      body: "PULP makes the 25 mL measure visible at the cap. PEEL shows the fragrance architecture as a small, replaceable object close to skin.",
      pulpTitle: "PULP 01",
      pulpCaption: "Measured cap as use ritual.",
      peelTitle: "PEEL 01",
      peelCaption: "Replaceable fragrance architecture."
    },
    zh: {
      label: "产品与包装细节",
      title: "把使用动作做进包装里。",
      body: "PULP 把 25 mL 的量取动作放在瓶盖上。PEEL 用拆解图说明香氛结构：可替换、可握持，也更贴近随身使用。",
      pulpTitle: "PULP 01",
      pulpCaption: "瓶盖就是量取动作的一部分。",
      peelTitle: "PEEL 01",
      peelCaption: "可替换的贴肤香氛结构。"
    }
  };

  const css = `
    .product-detail-insert {
      min-width: 0;
      display: grid;
      grid-template-columns: minmax(220px, 0.34fr) minmax(0, 1fr);
      gap: clamp(30px, 5vw, 82px);
      align-items: end;
      margin-top: clamp(58px, 7vw, 106px);
      padding-top: clamp(28px, 3vw, 44px);
      border-top: 1px solid var(--hairline-strong);
    }

    .product-detail-copy {
      min-width: 0;
      display: grid;
      gap: 15px;
      max-width: 31em;
      padding-bottom: clamp(10px, 2vw, 28px);
    }

    .product-detail-copy h3 {
      margin: 0;
      color: var(--ink);
      font-family: var(--font-en-display);
      font-size: clamp(26px, 2.3vw, 42px);
      font-weight: 400;
      line-height: 1.08;
      text-wrap: balance;
    }

    html[data-language="zh"] .product-detail-copy h3 {
      font-family: var(--font-zh-display);
      font-size: clamp(25px, 2.05vw, 38px);
      line-height: 1.2;
    }

    .product-detail-copy p:not(.eyebrow) {
      margin: 0;
      max-width: 34em;
      color: var(--ink-muted);
      font-size: var(--body);
      line-height: 1.7;
      text-wrap: pretty;
    }

    html[data-language="zh"] .product-detail-copy p:not(.eyebrow) {
      max-width: 26em;
      line-height: 1.86;
    }

    .product-detail-gallery {
      min-width: 0;
      display: grid;
      grid-template-columns: minmax(0, 0.86fr) minmax(0, 1fr);
      gap: clamp(16px, 2.2vw, 34px);
      align-items: end;
    }

    .product-detail-figure {
      min-width: 0;
      margin: 0;
      display: grid;
      gap: 13px;
    }

    .product-detail-media {
      position: relative;
      overflow: hidden;
      background:
        linear-gradient(145deg, rgba(251, 247, 239, 0.52), rgba(232, 183, 165, 0.08)),
        rgba(251, 247, 239, 0.72);
      box-shadow: 0 26px 70px rgba(28, 30, 26, 0.07);
    }

    .product-detail-figure--pulp .product-detail-media {
      aspect-ratio: 4 / 5;
    }

    .product-detail-figure--peel .product-detail-media {
      aspect-ratio: 1 / 1;
    }

    .product-detail-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      filter: saturate(0.96) contrast(0.98) brightness(1.01);
    }

    .product-detail-figure--peel .product-detail-media img {
      object-fit: cover;
      object-position: 50% 50%;
    }

    .product-detail-figure figcaption {
      min-width: 0;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 4px 12px;
      padding-top: 13px;
      border-top: 1px solid var(--hairline);
      color: var(--ink-muted);
      font-size: var(--label);
      line-height: 1.45;
    }

    .product-detail-figure figcaption span {
      grid-row: 1 / span 2;
      color: var(--brass);
      font-weight: 500;
      letter-spacing: 0.08em;
    }

    .product-detail-figure figcaption strong {
      color: var(--ink);
      font-family: var(--font-en-ui);
      font-size: var(--label);
      font-weight: 600;
      letter-spacing: 0.08em;
      line-height: 1.2;
    }

    .product-detail-figure figcaption em {
      font-style: normal;
    }

    html[data-language="zh"] .product-detail-figure figcaption strong {
      font-family: var(--font-en-ui);
    }

    @media (max-width: 1040px) {
      .product-detail-insert {
        grid-template-columns: 1fr;
        align-items: start;
      }

      .product-detail-copy {
        max-width: 38em;
        padding-bottom: 0;
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

      .product-detail-figure--pulp .product-detail-media,
      .product-detail-figure--peel .product-detail-media {
        aspect-ratio: 4 / 5;
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

  function markup() {
    const t = copy[language()];
    return `
      <div class="product-detail-copy">
        <p class="eyebrow">${escapeHtml(t.label)}</p>
        <h3>${escapeHtml(t.title)}</h3>
        <p>${escapeHtml(t.body)}</p>
      </div>
      <div class="product-detail-gallery">
        <figure class="product-detail-figure product-detail-figure--pulp">
          <div class="product-detail-media">
            <img src="${assets.pulp}" alt="${escapeHtml(t.pulpTitle + ' — ' + t.pulpCaption)}" loading="lazy" decoding="async">
          </div>
          <figcaption><span>01</span><strong>${escapeHtml(t.pulpTitle)}</strong><em>${escapeHtml(t.pulpCaption)}</em></figcaption>
        </figure>
        <figure class="product-detail-figure product-detail-figure--peel">
          <div class="product-detail-media">
            <img src="${assets.peel}" alt="${escapeHtml(t.peelTitle + ' — ' + t.peelCaption)}" loading="lazy" decoding="async">
          </div>
          <figcaption><span>02</span><strong>${escapeHtml(t.peelTitle)}</strong><em>${escapeHtml(t.peelCaption)}</em></figcaption>
        </figure>
      </div>
    `;
  }

  function insertVisuals() {
    installStyles();
    const target = document.getElementById("design-decisions");
    if (!target) return;

    let block = target.querySelector(".product-detail-insert");
    if (!block) {
      block = document.createElement("aside");
      block.className = "product-detail-insert";
      block.setAttribute("aria-label", language() === "zh" ? "产品与包装细节" : "Product and packaging detail");
      target.appendChild(block);
    }

    block.innerHTML = markup();
  }

  function scheduleInsert() {
    window.requestAnimationFrame(insertVisuals);
  }

  document.addEventListener("DOMContentLoaded", scheduleInsert);
  window.addEventListener("load", scheduleInsert, { once: true });

  const app = document.getElementById("app");
  if (app) {
    new MutationObserver(scheduleInsert).observe(app, { childList: true });
  }

  new MutationObserver(scheduleInsert).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-language"]
  });

  scheduleInsert();
})();