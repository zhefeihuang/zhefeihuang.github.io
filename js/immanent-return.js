(function () {
  const enabledPaths = ["/work/immanent-case-v4/", "/work/immanent-brand-v4/"];
  if (!enabledPaths.some((path) => window.location.pathname.includes(path))) return;

  const rootHref = "/";

  function isZh() {
    const lang = (document.documentElement.dataset.language || document.documentElement.lang || "").toLowerCase();
    return lang.includes("zh");
  }

  function label() {
    return isZh() ? "返回作品集" : "Back to portfolio";
  }

  function ensureReturnControl() {
    let link = document.querySelector("[data-immanent-return]");
    if (!link) {
      link = document.createElement("a");
      link.className = "immanent-return";
      link.dataset.immanentReturn = "";
      link.href = rootHref;
      link.innerHTML = '<span aria-hidden="true">←</span><em></em>';
      document.body.appendChild(link);
    }
    const text = label();
    link.href = rootHref;
    link.setAttribute("aria-label", text);
    const copy = link.querySelector("em");
    if (copy) copy.textContent = text;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureReturnControl, { once: true });
  } else {
    ensureReturnControl();
  }

  window.addEventListener("pageshow", ensureReturnControl);

  const observer = new MutationObserver(ensureReturnControl);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-language", "lang"]
  });
})();
