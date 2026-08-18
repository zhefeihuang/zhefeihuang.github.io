(() => {
  "use strict";

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");

  function cleanupOldPatchState() {
    document.body?.classList.remove("calm-floating", "project-opening");
    document.getElementById("home-speed-fix-style")?.remove();
    document.querySelectorAll(".floating-project").forEach((item) => {
      item.style.pointerEvents = "auto";
      item.style.animation = "";
    });
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
    patchMotionSettings();

    try {
      if (typeof refreshFloatingProjectSizes === "function") refreshFloatingProjectSizes();
    } catch (_) {}

    try {
      if (
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
