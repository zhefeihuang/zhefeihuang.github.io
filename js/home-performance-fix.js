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

    tuneImages();

    const roomView = document.querySelector("#room-view");
    if (roomView) {
        new MutationObserver(() => tuneImages(roomView)).observe(roomView, {
            childList: true,
            subtree: true
        });
    }

    new MutationObserver(() => {
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
            resumeFloatingMotion();
        }
    });

    window.addEventListener("pageshow", () => {
        tuneImages();
        resumeFloatingMotion();
    });
})();
