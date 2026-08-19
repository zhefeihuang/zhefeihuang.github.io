(() => {
    const eagerZones = ".preloader, .cursor, .floating-stage";

    function tuneImages(root = document) {
        root.querySelectorAll("img").forEach((image) => {
            if (!image.hasAttribute("decoding")) image.setAttribute("decoding", "async");
            if (!image.closest(eagerZones) && !image.hasAttribute("loading")) {
                image.setAttribute("loading", "lazy");
            }
        });
    }

    function clearOldBackgroundArtifacts() {
        document
            .querySelectorAll(".home-vertical-bg-canvas, .home-vertical-bg-image")
            .forEach((node) => node.remove());
    }

    function pauseFloatingMotion() {
        try {
            if (typeof floatingAnimationFrame !== "undefined" && floatingAnimationFrame) {
                cancelAnimationFrame(floatingAnimationFrame);
                floatingAnimationFrame = null;
            }
        } catch (_) {
            // Older cached scripts can omit the floating globals.
        }
    }

    function resumeFloatingMotion() {
        try {
            if (
                typeof floatingAnimationFrame === "undefined" ||
                typeof animateFloatingProjects !== "function" ||
                floatingAnimationFrame ||
                document.hidden ||
                document.body.classList.contains("room-open")
            ) {
                return;
            }
            if (typeof lastFloatingTime !== "undefined") lastFloatingTime = performance.now();
            floatingAnimationFrame = requestAnimationFrame(animateFloatingProjects);
        } catch (_) {
            // The visual experience should never depend on this optimisation.
        }
    }

    clearOldBackgroundArtifacts();
    tuneImages();

    const roomView = document.querySelector("#room-view");
    if (roomView) {
        new MutationObserver(() => tuneImages(roomView)).observe(roomView, {
            childList: true,
            subtree: true
        });
    }

    new MutationObserver(() => {
        clearOldBackgroundArtifacts();
        if (document.body.classList.contains("room-open")) {
            pauseFloatingMotion();
        } else {
            resumeFloatingMotion();
        }
    }).observe(document.body, {
        attributes: true,
        attributeFilter: ["class"]
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            pauseFloatingMotion();
        } else {
            clearOldBackgroundArtifacts();
            resumeFloatingMotion();
        }
    });

    window.addEventListener("pageshow", () => {
        clearOldBackgroundArtifacts();
        tuneImages();
        resumeFloatingMotion();
    });
})();
