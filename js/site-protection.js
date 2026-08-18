(() => {
  const protectedSelector = [
    "img",
    "picture",
    "video",
    "canvas",
    "svg"
  ].join(",");

  const skipSelector = [
    ".cursor",
    ".preloader",
    ".loader-mark",
    ".protection-toast",
    ".site-rights-note"
  ].join(",");

  const shortcutKeys = new Set(["s", "u", "p", "i", "j", "c"]);
  let toastTimer = 0;
  let protectTimer = 0;

  const isZh = () => {
    const html = document.documentElement;
    return (html.dataset.language || html.lang || "").toLowerCase().startsWith("zh");
  };

  const message = () => isZh()
    ? "\u4f5c\u54c1\u3001\u56fe\u7247\u4e0e\u6587\u5b57\u5df2\u53d7\u7248\u6743\u4fdd\u62a4\u3002"
    : "Images, copy and concepts are protected.";

  const rightsText = () => isZh()
    ? "\u00a9 Zhefei Huang\u3002\u672c\u7ad9\u6240\u6709\u9879\u76ee\u6982\u5ff5\u3001\u6587\u5b57\u3001\u89c6\u89c9\u3001\u8bbe\u8ba1\u4e0e\u54c1\u724c\u7ec3\u4e60\u5747\u4e3a\u4e2a\u4eba\u539f\u521b\u4f5c\u54c1\u3002\u672a\u7ecf\u8bb8\u53ef\uff0c\u8bf7\u52ff\u4fdd\u5b58\u3001\u590d\u5236\u3001\u8f6c\u8f7d\u6216\u7528\u4e8e\u5546\u4e1a\u7528\u9014\u3002"
    : "\u00a9 Zhefei Huang. All project concepts, copy, visuals, design and brand practice work on this site are original. Please do not save, copy, reproduce or use commercially without permission.";

  const isEditable = (target) => {
    if (!target || target === document) return false;
    return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
  };

  const isAllowedCopyTarget = (target) => {
    if (!target || target === document) return false;
    return Boolean(target.closest(".contact, .email-address, .email-links, .copy-email"));
  };

  const showToast = () => {
    let toast = document.querySelector(".protection-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "protection-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }

    toast.textContent = message();
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 1600);
  };

  const block = (event) => {
    if (isEditable(event.target)) return;
    event.preventDefault();
    showToast();
  };

  const protectNode = (node) => {
    if (!node || node.closest?.(skipSelector)) return;
    node.setAttribute("draggable", "false");
    node.dataset.protectedAsset = "true";
  };

  const protectMedia = (root = document) => {
    if (root instanceof Element && root.matches(protectedSelector)) protectNode(root);
    root.querySelectorAll?.(protectedSelector).forEach(protectNode);
  };

  const scheduleProtectMedia = () => {
    window.clearTimeout(protectTimer);
    protectTimer = window.setTimeout(() => protectMedia(), 180);
  };

  const addRightsNote = () => {
    if (document.querySelector(".site-rights-note")) return;
    const note = document.createElement("p");
    note.className = "site-rights-note";
    note.textContent = rightsText();

    const target = document.querySelector("main") || document.querySelector("#app") || document.body;
    target.appendChild(note);
  };

  const installObserver = () => {
    const observer = new MutationObserver((mutations) => {
      let hasMediaChange = false;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(protectedSelector) || node.querySelector?.(protectedSelector)) {
            hasMediaChange = true;
          }
        });
      });

      if (hasMediaChange) scheduleProtectMedia();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  const installEvents = () => {
    document.addEventListener("contextmenu", (event) => {
      if (isEditable(event.target) || isAllowedCopyTarget(event.target)) return;
      event.preventDefault();
      showToast();
    }, true);

    document.addEventListener("dragstart", (event) => {
      if (event.target.closest(protectedSelector)) block(event);
    }, true);

    document.addEventListener("copy", (event) => {
      if (isEditable(event.target) || isAllowedCopyTarget(event.target)) return;
      event.preventDefault();
      event.clipboardData?.setData("text/plain", rightsText());
      showToast();
    }, true);

    document.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      const protectedCombo = (event.ctrlKey || event.metaKey) && shortcutKeys.has(key);
      const devtoolsCombo = (event.ctrlKey || event.metaKey) && event.shiftKey && ["i", "j", "c"].includes(key);
      if (!protectedCombo && !devtoolsCombo) return;
      if (isEditable(event.target) || (key === "c" && isAllowedCopyTarget(event.target))) return;
      event.preventDefault();
      showToast();
    }, true);
  };

  const boot = () => {
    document.documentElement.classList.add("protection-active");
    protectMedia();
    addRightsNote();
    installEvents();
    installObserver();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
