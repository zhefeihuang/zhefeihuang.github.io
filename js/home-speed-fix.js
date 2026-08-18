(() => {
  "use strict";

  const coarsePointer = window.matchMedia?.("(hover: none), (pointer: coarse)");
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  let lastTrailAt = 0;
  let lastOpenAt = 0;
  let calmStyleInstalled = false;

  function isCoarse() {
    return Boolean(coarsePointer?.matches || window.innerWidth <= 760);
  }

  function isHeavyVideoAudio(project) {
    if (!project || !project.audio) return false;
    const audio = String(project.audio).split("?")[0].toLowerCase();
    const video = String(project.video || "").split("?")[0].toLowerCase();
    return audio === video || /\.(mp4|mov|webm|m4v)$/.test(audio);
  }

  function installCalmFloatingStyle() {
    if (calmStyleInstalled) return;
    calmStyleInstalled = true;
    const style = document.createElement("style");
    style.id = "home-speed-fix-style";
    style.textContent = `
      body.calm-floating:not(.room-open) .floating-project {
        animation: homeCalmFloat var(--float-duration, 18s) ease-in-out var(--float-delay, 0s) infinite alternate !important;
        will-change: transform, translate, rotate !important;
      }

      body.calm-floating:not(.room-open) .floating-project img {
        animation: homeCalmImageBreath calc(var(--float-duration, 18s) * 1.35) ease-in-out var(--float-delay, 0s) infinite alternate !important;
      }

      body.project-opening .floating-project {
        pointer-events: none !important;
      }

      @keyframes homeCalmFloat {
        from {
          translate: calc(var(--float-x, 8px) * -1) calc(var(--float-y, 6px) * -1);
          rotate: calc(var(--float-rot, 2deg) * -1);
        }
        to {
          translate: var(--float-x, 8px) var(--float-y, 6px);
          rotate: var(--float-rot, 2deg);
        }
      }

      @keyframes homeCalmImageBreath {
        from { filter: drop-shadow(0 18px 20px rgba(23, 20, 18, 0.10)); }
        to { filter: drop-shadow(0 28px 34px rgba(23, 20, 18, 0.14)); }
      }

      @media (prefers-reduced-motion: reduce) {
        body.calm-floating:not(.room-open) .floating-project,
        body.calm-floating:not(.room-open) .floating-project img {
          animation: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function stopPhysicsLoop() {
    try {
      if (typeof floatingAnimationFrame !== "undefined" && floatingAnimationFrame) {
        cancelAnimationFrame(floatingAnimationFrame);
        floatingAnimationFrame = null;
      }
    } catch (_) {}

    try {
      animateFloatingProjects = function disabledFloatingPhysics() {
        try { floatingAnimationFrame = null; } catch (_) {}
      };
    } catch (_) {}
  }

  function calmFloatingLayout() {
    const stage = document.querySelector(".floating-stage");
    const items = [...document.querySelectorAll(".floating-project")];
    if (!stage || !items.length || document.body.classList.contains("room-open")) return;

    installCalmFloatingStyle();
    stopPhysicsLoop();
    document.body.classList.add("calm-floating");

    const rect = stage.getBoundingClientRect();
    const phone = window.innerWidth <= 560;
    const tablet = window.innerWidth <= 1020 && !phone;
    const lanes = phone
      ? [[0.15, 0.16], [0.62, 0.24], [0.26, 0.56], [0.72, 0.66], [0.46, 0.42]]
      : tablet
        ? [[0.16, 0.2], [0.66, 0.22], [0.3, 0.62], [0.74, 0.66], [0.49, 0.44]]
        : [[0.12, 0.16], [0.68, 0.2], [0.28, 0.62], [0.78, 0.68], [0.48, 0.42]];

    items.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const lane = lanes[index % lanes.length];
      const pad = phone ? 14 : tablet ? 22 : 30;
      const x = Math.max(pad, Math.min(rect.width - itemRect.width - pad, rect.width * lane[0] - itemRect.width / 2));
      const y = Math.max(pad, Math.min(rect.height - itemRect.height - pad, rect.height * lane[1] - itemRect.height / 2));
      const baseRot = [-7, 5, -4, 6, -2][index % 5];

      item.style.left = "0px";
      item.style.top = "0px";
      item.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${baseRot}deg)`;
      item.style.setProperty("--float-x", `${phone ? 9 : 14 + index * 2}px`);
      item.style.setProperty("--float-y", `${phone ? 7 : 10 + index}px`);
      item.style.setProperty("--float-rot", `${phone ? 1.5 : 2.4}deg`);
      item.style.setProperty("--float-duration", `${phone ? 18 + index * 2 : 16 + index * 2.5}s`);
      item.style.setProperty("--float-delay", `${index * -1.7}s`);
      item.style.pointerEvents = "auto";
    });
  }

  function deferHeavySoundPatch() {
    try {
      if (typeof setupProjectSound !== "function" || setupProjectSound.__speedFixed) return;
      const originalSetupProjectSound = setupProjectSound;
      setupProjectSound = function patchedSetupProjectSound(project) {
        if (!isHeavyVideoAudio(project)) return originalSetupProjectSound(project);

        try {
          if (typeof soundControl !== "undefined" && soundControl) soundControl.hidden = false;
          if (typeof soundToggle !== "undefined" && soundToggle) soundToggle.dataset.soundText = "play";
          if (typeof updateSoundText === "function") updateSoundText();
        } catch (_) {}

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.setTimeout(() => originalSetupProjectSound(project), 120);
          });
        });
      };
      setupProjectSound.__speedFixed = true;
    } catch (_) {}
  }

  function patchTrail() {
    try {
      if (typeof makeTrail !== "function" || makeTrail.__speedFixed) return;
      const originalMakeTrail = makeTrail;
      makeTrail = function patchedMakeTrail(x, y) {
        if (reducedMotion?.matches) return;
        const now = performance.now();
        const minGap = isCoarse() ? 420 : 220;
        if (now - lastTrailAt < minGap) return;
        lastTrailAt = now;
        return originalMakeTrail(x, y);
      };
      makeTrail.__speedFixed = true;
    } catch (_) {}
  }

  function fastOpen(projectKey) {
    if (!projectKey || typeof openProject !== "function") return;
    const now = performance.now();
    if (now - lastOpenAt < 520) return;
    lastOpenAt = now;
    document.body.classList.add("project-opening");
    stopPhysicsLoop();
    requestAnimationFrame(() => {
      try { openProject(projectKey); } catch (_) {}
      window.setTimeout(() => document.body.classList.remove("project-opening"), 700);
    });
  }

  function installFastOpenEvents() {
    ["pointerup", "click"].forEach((type) => {
      document.addEventListener(type, (event) => {
        const trigger = event.target?.closest?.("[data-project]");
        if (!trigger) return;
        event.preventDefault();
        event.stopPropagation();
        fastOpen(trigger.dataset.project);
      }, true);
    });
  }

  function boot() {
    deferHeavySoundPatch();
    patchTrail();
    calmFloatingLayout();
    installFastOpenEvents();
    window.setTimeout(calmFloatingLayout, 80);
    window.setTimeout(calmFloatingLayout, 480);
    window.setTimeout(calmFloatingLayout, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.addEventListener("load", calmFloatingLayout, { once: true });
  window.addEventListener("resize", () => window.requestAnimationFrame(calmFloatingLayout), { passive: true });
  window.addEventListener("pageshow", calmFloatingLayout);
})();
