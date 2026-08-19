(() => {
    const eagerZones = ".preloader, .cursor, .floating-stage, .home-vertical-bg-image";

    function tuneImages(root = document) {
        root.querySelectorAll("img").forEach((image) => {
            if (!image.hasAttribute("decoding")) image.setAttribute("decoding", "async");
            if (!image.closest(eagerZones) && !image.hasAttribute("loading")) {
                image.setAttribute("loading", "lazy");
            }
        });
    }

    function installVerticalHomeBackground() {
        const main = document.querySelector("main#top") || document.querySelector("main");
        if (!main) return null;

        main.querySelectorAll(":scope > .home-vertical-bg-canvas").forEach((node) => node.remove());

        let image = main.querySelector(":scope > .home-vertical-bg-image");
        if (!image) {
            image = document.createElement("img");
            image.className = "home-vertical-bg-image";
            image.alt = "";
            image.decoding = "async";
            image.setAttribute("aria-hidden", "true");
            image.src = "images/oxidation-supplement/oxidation-outcome-detail-01.jpg";
            main.insertBefore(image, main.firstChild);
        }

        let resizeTimer = null;

        function layout() {
            const width = Math.max(1, Math.ceil(main.clientWidth));
            const height = Math.max(window.innerHeight, Math.ceil(main.scrollHeight));

            image.style.width = `${height}px`;
            image.style.height = `${width}px`;
            image.style.transform = `translateX(${width}px) rotate(90deg)`;
        }

        function scheduleLayout(delay = 80) {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => window.requestAnimationFrame(layout), delay);
        }

        image.addEventListener("load", () => {
            layout();
            scheduleLayout(400);
            scheduleLayout(1200);
        }, { once: true });

        if (image.complete) layout();

        window.addEventListener("resize", () => scheduleLayout(120), { passive: true });
        window.addEventListener("load", () => scheduleLayout(120), { once: true });

        if ("ResizeObserver" in window) {
            const observer = new ResizeObserver(() => scheduleLayout(120));
            observer.observe(main);
        }

        return () => scheduleLayout(40);
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
    const relayoutVerticalBackground = installVerticalHomeBackground();

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
            if (relayoutVerticalBackground) relayoutVerticalBackground();
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
            if (relayoutVerticalBackground) relayoutVerticalBackground();
            resumeFloatingMotion();
        }
    });

    window.addEventListener("pageshow", () => {
        tuneImages();
        if (relayoutVerticalBackground) relayoutVerticalBackground();
        resumeFloatingMotion();
    });
})();
