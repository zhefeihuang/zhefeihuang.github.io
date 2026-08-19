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

    function installVerticalHomeBackground() {
        const main = document.querySelector("main#top") || document.querySelector("main");
        if (!main) return null;

        let canvas = main.querySelector(":scope > .home-vertical-bg-canvas");
        if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.className = "home-vertical-bg-canvas";
            canvas.setAttribute("aria-hidden", "true");
            main.insertBefore(canvas, main.firstChild);
        }

        const context = canvas.getContext("2d", { alpha: false });
        if (!context) return null;

        const source = new Image();
        source.decoding = "async";
        source.src = "images/oxidation-supplement/oxidation-outcome-detail-01.jpg";

        let resizeTimer = null;
        let ready = false;

        function draw() {
            if (!ready) return;

            const width = Math.max(1, Math.ceil(main.clientWidth));
            const height = Math.max(window.innerHeight, Math.ceil(main.scrollHeight));
            const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
            const pixelWidth = Math.ceil(width * ratio);
            const pixelHeight = Math.ceil(height * ratio);

            if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
                canvas.width = pixelWidth;
                canvas.height = pixelHeight;
            }

            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            context.setTransform(1, 0, 0, 1, 0, 0);
            context.fillStyle = "#262a2c";
            context.fillRect(0, 0, pixelWidth, pixelHeight);
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";

            // Rotate the original horizontal piece so its left side becomes the top of the page.
            context.translate(width, 0);
            context.rotate(Math.PI / 2);
            context.drawImage(source, 0, 0, height, width);
        }

        function scheduleDraw(delay = 80) {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => window.requestAnimationFrame(draw), delay);
        }

        source.addEventListener("load", () => {
            ready = true;
            draw();
            scheduleDraw(500);
            scheduleDraw(1400);
        }, { once: true });

        window.addEventListener("resize", () => scheduleDraw(120), { passive: true });
        window.addEventListener("load", () => scheduleDraw(120), { once: true });

        if ("ResizeObserver" in window) {
            const observer = new ResizeObserver(() => scheduleDraw(120));
            observer.observe(main);
        }

        return () => scheduleDraw(40);
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
    const redrawVerticalBackground = installVerticalHomeBackground();

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
            if (redrawVerticalBackground) redrawVerticalBackground();
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
            if (redrawVerticalBackground) redrawVerticalBackground();
            resumeFloatingMotion();
        }
    });

    window.addEventListener("pageshow", () => {
        tuneImages();
        if (redrawVerticalBackground) redrawVerticalBackground();
        resumeFloatingMotion();
    });
})();
