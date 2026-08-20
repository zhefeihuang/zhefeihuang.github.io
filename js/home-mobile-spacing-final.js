(() => {
  "use strict";

  function patchMobileSpacing() {
    if (typeof getFloatingMotionSettings !== "function" || getFloatingMotionSettings.__homeMobileSpacingFinal) return;

    const previousGetSettings = getFloatingMotionSettings;
    getFloatingMotionSettings = function mobileSpacedFloatingSettings(bounds) {
      const base = previousGetSettings(bounds);
      const phone = Boolean(base.phone);
      const compact = Boolean(base.compact);
      const touchSafe = Boolean(base.touchSafe);

      if (!phone && !compact && !touchSafe) return base;

      return {
        ...base,
        gap: phone ? 14 : compact ? 8 : Math.max(base.gap ?? 0, 4),
        radiusScale: phone ? 0.34 : compact ? 0.3 : Math.max(base.radiusScale ?? 0.26, 0.28),
        separationStrength: phone ? 0.46 : compact ? 0.32 : Math.max(base.separationStrength ?? 0.18, 0.24),
        impulseScale: phone ? 0.16 : compact ? 0.2 : Math.max(base.impulseScale ?? 0.18, 0.2),
        kickScale: phone ? 0.1 : compact ? 0.13 : Math.max(base.kickScale ?? 0.11, 0.13),
        turnForce: phone ? Math.max(base.turnForce ?? 0, 3.4) : base.turnForce,
        turnMin: phone ? Math.max(base.turnMin ?? 0, 2.1) : base.turnMin,
        turnMax: phone ? Math.min(base.turnMax ?? 5.2, 4.8) : base.turnMax
      };
    };

    getFloatingMotionSettings.__homeMobileSpacingFinal = true;
    getFloatingMotionSettings.__homeFloatTuned = true;
  }

  function refreshSpacing() {
    patchMobileSpacing();
    try {
      if (typeof refreshFloatingProjectSizes === "function") refreshFloatingProjectSizes();
    } catch (_) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refreshSpacing, { once: true });
  } else {
    refreshSpacing();
  }

  window.addEventListener("load", refreshSpacing, { once: true });
  window.addEventListener("pageshow", refreshSpacing);
  window.addEventListener("resize", () => requestAnimationFrame(refreshSpacing), { passive: true });
})();
