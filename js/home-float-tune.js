(() => {
  "use strict";

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  let languageSwitching = false;

  function cleanupOldPatchState() {
    document.body?.classList.remove("calm-floating", "project-opening");
    document.getElementById("home-speed-fix-style")?.remove();
    document.querySelectorAll(".floating-project").forEach((item) => {
      item.style.pointerEvents = "auto";
      item.style.animation = "";
    });
  }

  function pauseFloatingLoop() {
    try {
      if (typeof floatingAnimationFrame !== "undefined" && floatingAnimationFrame) {
        cancelAnimationFrame(floatingAnimationFrame);
        floatingAnimationFrame = null;
      }
    } catch (_) {}
  }

  function patchFastLanguageApply() {
    if (typeof applyLanguage !== "function" || applyLanguage.__homeFast) return;

    applyLanguage = function fastApplyLanguage() {
      const lang = typeof currentLang !== "undefined" ? currentLang : "en";
      document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
      document.documentElement.dataset.language = lang;

      try {
        document.querySelectorAll("[data-i18n]").forEach((node) => {
          node.textContent = t(node.dataset.i18n);
        });
      } catch (_) {}

      try {
        if (typeof lightboxClose !== "undefined" && lightboxClose) {
          lightboxClose.setAttribute("aria-label", t("close"));
        }
      } catch (_) {}

      document.querySelectorAll("[data-lang-choice]").forEach((node) => {
        node.classList.toggle("is-active", node.dataset.langChoice === lang);
      });

      try {
        document.querySelectorAll(".floating-project").forEach((button) => {
          const project = projectData[button.dataset.project];
          const label = button.querySelector("span");
          if (project && label) label.textContent = localize(project.title);
        });
      } catch (_) {}

      try {
        if (typeof updateSoundText === "function") updateSoundText();
      } catch (_) {}

      try {
        if (typeof currentProjectKey !== "undefined" && currentProjectKey && typeof renderProjectShell === "function") {
          renderProjectShell();
        }
      } catch (_) {}
    };

    applyLanguage.__homeFast = true;
  }

  function patchLanguageToggle() {
    if (document.documentElement.dataset.fastLanguageGuard === "true") return;
    document.documentElement.dataset.fastLanguageGuard = "true";

    document.addEventListener("click", (event) => {
      const toggle = event.target?.closest?.(".language-toggle");
      if (!toggle) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      if (languageSwitching) return;

      languageSwitching = true;
      cleanupOldPatchState();
      pauseFloatingLoop();
      document.documentElement.classList.add("language-switching");

      try {
        currentLang = currentLang === "en" ? "zh" : "en";
        localStorage.setItem("portfolioLanguage", currentLang);
      } catch (_) {}

      requestAnimationFrame(() => {
        try {
          patchFastLanguageApply();
          if (typeof applyLanguage === "function") applyLanguage();
        } catch (_) {}

        window.setTimeout(() => {
          document.documentElement.classList.remove("language-switching");
          languageSwitching = false;
          reviveMotion();
        }, 160);
      });
    }, true);
  }

  function patchProjectOpen() {
    if (typeof openProject !== "function" || openProject.__homeFloatGuarded) return;

    const originalOpenProject = openProject;
    let opening = false;

    openProject = function guardedOpenProject(key) {
      if (opening) return;
      opening = true;
      cleanupOldPatchState();
      pauseFloatingLoop();

      try {
        return originalOpenProject(key);
      } finally {
        window.setTimeout(() => {
          opening = false;
        }, 520);
      }
    };

    openProject.__homeFloatGuarded = true;
  }

  function patchMotionSettings() {
    if (typeof getFloatingMotionSettings !== "function" || getFloatingMotionSettings.__homeFloatTuned) return;

    const originalGetSettings = getFloatingMotionSettings;
    getFloatingMotionSettings = function tunedFloatingMotion(bounds) {
      const base = originalGetSettings(bounds);
      const phone = Boolean(base.phone);
      const compact = Boolean(base.compact);
      const touchSafe = Boolean(base.touchSafe);

      return {
        ...base,
        speedMin: phone ? 30 : touchSafe ? (compact ? 50 : 70) : 86,
        speedMax: phone ? 58 : touchSafe ? (compact ? 90 : 128) : 148,
        radiusScale: phone ? 0.18 : touchSafe ? (compact ? 0.22 : 0.26) : 0.3,
        gap: phone ? -22 : touchSafe ? (compact ? -12 : -6) : -4,
        edgeBounce: phone ? 0.84 : touchSafe ? 0.9 : 0.94,
        turnForce: phone ? 2.8 : touchSafe ? (compact ? 5.8 : 7.8) : 10.5,
        turnMin: phone ? 2.4 : touchSafe ? 2.1 : 1.7,
        turnMax: phone ? 5.2 : touchSafe ? 4.5 : 3.4,
        separationStrength: phone ? 0.08 : touchSafe ? 0.13 : 0.18,
        impulseScale: phone ? 0.08 : touchSafe ? 0.18 : 0.26,
        kickScale: phone ? 0.05 : touchSafe ? 0.11 : 0.16
      };
    };

    getFloatingMotionSettings.__homeFloatTuned = true;
  }

  function reviveMotion() {
    cleanupOldPatchState();
    patchFastLanguageApply();
    patchLanguageToggle();
    patchProjectOpen();
    patchMotionSettings();

    try {
      if (typeof refreshFloatingProjectSizes === "function") refreshFloatingProjectSizes();
    } catch (_) {}

    try {
      if (
        !languageSwitching &&
        !reducedMotion?.matches &&
        !document.hidden &&
        !document.body.classList.contains("room-open") &&
        typeof animateFloatingProjects === "function" &&
        typeof floatingAnimationFrame !== "undefined" &&
        !floatingAnimationFrame
      ) {
        if (typeof lastFloatingTime !== "undefined") lastFloatingTime = performance.now();
        floatingAnimationFrame = requestAnimationFrame(animateFloatingProjects);
      }
    } catch (_) {}
  }

  function boot() {
    reviveMotion();
    window.setTimeout(reviveMotion, 120);
    window.setTimeout(reviveMotion, 700);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.addEventListener("load", reviveMotion, { once: true });
  window.addEventListener("pageshow", reviveMotion);
  window.addEventListener("resize", () => requestAnimationFrame(reviveMotion), { passive: true });
})();
