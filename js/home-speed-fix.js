(() => {
  "use strict";

  const coarsePointer = window.matchMedia?.("(hover: none), (pointer: coarse)");
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  let lastTrailAt = 0;
  let lastFrameAt = 0;

  function isCoarse() {
    return Boolean(coarsePointer?.matches || window.innerWidth <= 760);
  }

  function isHeavyVideoAudio(project) {
    if (!project || !project.audio) return false;
    const audio = String(project.audio).split("?")[0].toLowerCase();
    const video = String(project.video || "").split("?")[0].toLowerCase();
    return audio === video || /\.(mp4|mov|webm|m4v)$/.test(audio);
  }

  function stopHeavySound() {
    try {
      if (typeof stopProjectSound === "function") stopProjectSound();
    } catch (_) {}
    try {
      if (typeof soundControl !== "undefined" && soundControl) soundControl.hidden = true;
    } catch (_) {}
  }

  try {
    if (typeof setupProjectSound === "function") {
      const originalSetupProjectSound = setupProjectSound;
      setupProjectSound = function patchedSetupProjectSound(project) {
        if (isHeavyVideoAudio(project)) {
          stopHeavySound();
          return;
        }
        return originalSetupProjectSound(project);
      };
    }
  } catch (_) {}

  try {
    if (typeof openProject === "function") {
      const originalOpenProject = openProject;
      openProject = function patchedOpenProject(key) {
        try {
          if (typeof floatingAnimationFrame !== "undefined" && floatingAnimationFrame) {
            cancelAnimationFrame(floatingAnimationFrame);
            floatingAnimationFrame = null;
          }
        } catch (_) {}
        return originalOpenProject(key);
      };
    }
  } catch (_) {}

  try {
    if (typeof makeTrail === "function") {
      const originalMakeTrail = makeTrail;
      makeTrail = function patchedMakeTrail(x, y) {
        if (reducedMotion?.matches) return;
        const now = performance.now();
        const minGap = isCoarse() ? 260 : 120;
        if (now - lastTrailAt < minGap) return;
        lastTrailAt = now;
        return originalMakeTrail(x, y);
      };
    }
  } catch (_) {}

  try {
    if (typeof animateFloatingProjects === "function") {
      const originalAnimateFloatingProjects = animateFloatingProjects;
      animateFloatingProjects = function patchedAnimateFloatingProjects(timestamp = performance.now()) {
        if (document.hidden || document.body.classList.contains("room-open")) {
          try { floatingAnimationFrame = null; } catch (_) {}
          return;
        }
        const minFrameGap = isCoarse() ? 82 : 34;
        if (timestamp - lastFrameAt < minFrameGap) {
          try { floatingAnimationFrame = requestAnimationFrame(animateFloatingProjects); } catch (_) {}
          return;
        }
        lastFrameAt = timestamp;
        return originalAnimateFloatingProjects(timestamp);
      };
    }
  } catch (_) {}

  document.addEventListener("click", (event) => {
    const trigger = event.target?.closest?.("[data-project]");
    if (!trigger) return;
    document.body.classList.add("project-opening");
    window.setTimeout(() => document.body.classList.remove("project-opening"), 700);
  }, true);
})();
