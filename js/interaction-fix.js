(() => {
    "use strict";

    const interactiveSelector = [
        "a",
        "button",
        "input",
        "textarea",
        "select",
        "[role='button']",
        "[data-project]",
        "[data-room-tab]",
        "[data-lightbox]",
        ".language-toggle",
        ".room-close",
        ".sound-toggle",
        ".sound-volume",
        ".copy-email"
    ].join(",");

    const mediaSelector = [
        "img",
        "video",
        "audio",
        "canvas",
        "svg",
        "[data-protected-media]",
        ".lightbox-image"
    ].join(",");

    function releaseProtectionState() {
        document.body?.classList.remove("content-protection-active");
        const preloader = document.querySelector(".preloader");
        if (preloader?.classList.contains("is-hidden")) {
            preloader.setAttribute("hidden", "");
        }
    }

    function protectMediaOnly(root = document) {
        root.querySelectorAll(mediaSelector).forEach((node) => {
            node.setAttribute("draggable", "false");
            node.setAttribute("data-protected-media", "true");
            node.addEventListener("contextmenu", (event) => event.preventDefault(), { capture: true });
            node.addEventListener("dragstart", (event) => event.preventDefault(), { capture: true });
        });
    }

    function keepControlsResponsive(event) {
        releaseProtectionState();
        const target = event.target;
        if (!target?.closest) return;

        const control = target.closest(interactiveSelector);
        if (!control) return;

        control.style.pointerEvents = "auto";
    }

    function reduceTouchDecoration() {
        if (!window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
        document.documentElement.classList.add("touch-interaction-safe");
        document.querySelectorAll(".trail-image, .touch-burst, .cursor-fx-trail, .cursor-fx-pop").forEach((node) => {
            node.remove();
        });
    }

    ["pointerdown", "touchstart", "click", "scroll"].forEach((type) => {
        document.addEventListener(type, keepControlsResponsive, { capture: true, passive: true });
    });

    window.addEventListener("pageshow", releaseProtectionState, { passive: true });
    window.addEventListener("load", () => {
        protectMediaOnly();
        reduceTouchDecoration();
        releaseProtectionState();
        window.setTimeout(releaseProtectionState, 250);
        window.setTimeout(releaseProtectionState, 1000);
    }, { passive: true });

    document.addEventListener("visibilitychange", releaseProtectionState, { passive: true });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            protectMediaOnly();
            reduceTouchDecoration();
            releaseProtectionState();
        }, { once: true });
    } else {
        protectMediaOnly();
        reduceTouchDecoration();
        releaseProtectionState();
    }

    window.setInterval(releaseProtectionState, 1200);
})();
