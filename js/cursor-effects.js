(() => {
    "use strict";

    if (window.PortfolioCursorEffects) return;

    const script = document.currentScript;
    const assetBase = new URL("../", script ? script.src : window.location.href);
    const asset = (path) => new URL(path, assetBase).toString();
    const keys = ["generative", "oxidation", "mossy", "cherries", "trending", "greenpepper", "photography"];
    const aliases = {
        project1: "oxidation",
        project2: "mossy",
        project3: "cherries",
        project4: "trending",
        project5: "greenpepper",
        project6: "photography",
        green: "greenpepper",
        pepper: "greenpepper",
        photo: "photography",
        photos: "photography"
    };
    const cursorAssets = {
        default: asset("images/cursors/oxidation.png"),
        generative: asset("images/cursors/generative.png"),
        oxidation: asset("images/cursors/oxidation.png"),
        mossy: asset("images/cursors/mossy.png"),
        cherries: asset("images/cursors/cherries.png"),
        trending: asset("images/cursors/trending.png"),
        greenpepper: asset("images/cursors/greenpepper.png"),
        photography: asset("images/cursors/photography.png")
    };
    const projectPageThemes = [
        [/project1\.html/i, "oxidation"],
        [/project2\.html/i, "mossy"],
        [/project3\.html/i, "cherries"],
        [/project4\.html/i, "trending"],
        [/project5\.html/i, "greenpepper"],
        [/project6\.html/i, "photography"]
    ];

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cursor = ensureCursor();
    const pageKey = inferPageKey();
    let currentKey = pageKey || "oxidation";
    let hoverKey = "";
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let cursorX = pointerX;
    let cursorY = pointerY;
    let idleSwapAt = 0;
    let idleIndex = 1;
    let raf = 0;

    preloadAssets();
    applyKey(currentKey);
    start();

    window.PortfolioCursorEffects = {
        set(projectKey) {
            const key = normalizeKey(projectKey);
            if (!key) return;
            hoverKey = key;
            applyKey(key);
        },
        reset(fallbackKey) {
            hoverKey = "";
            applyKey(normalizeKey(fallbackKey) || pageKey || "oxidation");
        },
        trail(x, y, projectKey) {
            spawnBurst(x, y, normalizeKey(projectKey) || currentKey, 2);
        },
        burst(x, y, projectKey) {
            spawnBurst(x, y, normalizeKey(projectKey) || currentKey, 4);
        }
    };

    function start() {
        document.addEventListener("pointermove", handlePointerMove, { passive: true });
        document.addEventListener("pointerdown", handlePointerDown, { passive: true });
        document.addEventListener("pointerover", handlePointerOver, { passive: true });
        document.addEventListener("pointerout", handlePointerOut, { passive: true });
        window.addEventListener("blur", () => cursor.root.classList.remove("is-visible"));
        updatePointerMode();
        finePointer.addEventListener?.("change", updatePointerMode);
        reducedMotion.addEventListener?.("change", updatePointerMode);
    }

    function ensureCursor() {
        let root = document.querySelector(".cursor");
        if (!root) {
            root = document.createElement("div");
            root.className = "cursor";
            root.setAttribute("aria-hidden", "true");
            document.body.appendChild(root);
        }

        let image = root.querySelector(".cursor-image");
        if (!image) {
            image = document.createElement("img");
            image.className = "cursor-image";
            image.alt = "";
            root.appendChild(image);
        }

        return { root, image };
    }

    function preloadAssets() {
        Object.values(cursorAssets).forEach((src) => {
            const image = new Image();
            image.src = src;
        });
    }

    function inferPageKey() {
        const path = window.location.pathname;
        const match = projectPageThemes.find(([pattern]) => pattern.test(path));
        if (match) return match[1];
        return "";
    }

    function normalizeKey(value) {
        if (!value) return "";
        const raw = String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
        const key = aliases[raw] || raw;
        return cursorAssets[key] ? key : "";
    }

    function keyFromElement(element) {
        const target = element?.closest?.("[data-cursor], [data-project]");
        if (!target) return "";
        return normalizeKey(target.dataset.cursor || target.dataset.project);
    }

    function applyKey(key) {
        currentKey = key || "oxidation";
        cursor.image.src = cursorAssets[currentKey] || cursorAssets.default;
        cursor.root.dataset.cursor = currentKey;
        cursor.root.classList.add("is-active");
        document.body.dataset.cursorEffect = currentKey;
    }

    function updatePointerMode() {
        const isFine = finePointer.matches && !reducedMotion.matches;
        document.body.classList.toggle("cursor-effects-ready", isFine);
        if (isFine && !raf) raf = window.requestAnimationFrame(animateCursor);
        if (!isFine) cursor.root.classList.remove("is-visible");
    }

    function handlePointerMove(event) {
        pointerX = event.clientX;
        pointerY = event.clientY;

        if (event.pointerType === "touch") return;

        const key = keyFromElement(event.target);
        if (key && key !== currentKey) {
            hoverKey = key;
            applyKey(key);
        }

        if (finePointer.matches && !reducedMotion.matches) {
            cursor.root.classList.add("is-visible");
            maybeSwapIdleCursor(performance.now());
        }
    }

    function handlePointerDown(event) {
        if (event.button && event.button !== 0) return;

        const key = keyFromElement(event.target) || hoverKey || currentKey || randomKey();
        applyKey(key);

        cursor.root.classList.add("is-pressed");
        window.setTimeout(() => cursor.root.classList.remove("is-pressed"), 220);

        const isTouchLike = event.pointerType === "touch" || event.pointerType === "pen" || !finePointer.matches;
        spawnBurst(event.clientX, event.clientY, key, isTouchLike ? 4 : 3);
    }

    function handlePointerOver(event) {
        const key = keyFromElement(event.target);
        if (!key) return;
        hoverKey = key;
        applyKey(key);
    }

    function handlePointerOut(event) {
        const target = event.target?.closest?.("[data-cursor], [data-project]");
        if (!target || target.contains(event.relatedTarget)) return;
        hoverKey = "";
        applyKey(pageKey || "oxidation");
    }

    function animateCursor() {
        const dx = pointerX - cursorX;
        const dy = pointerY - cursorY;
        cursorX += dx * 0.28;
        cursorY += dy * 0.28;

        const speed = Math.min(24, Math.hypot(dx, dy));
        const tilt = clamp(dx * 0.08, -12, 12);
        const scale = 1 + speed * 0.003;
        cursor.root.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) rotate(${tilt.toFixed(2)}deg) scale(${scale.toFixed(3)})`;

        raf = window.requestAnimationFrame(animateCursor);
    }

    function maybeSwapIdleCursor(now) {
        if (hoverKey || pageKey || now < idleSwapAt) return;
        idleIndex = (idleIndex + 1 + Math.floor(Math.random() * 2)) % keys.length;
        applyKey(keys[idleIndex]);
        idleSwapAt = now + 1600 + Math.random() * 1200;
    }

    function spawnBurst(x, y, key, count) {
        if (reducedMotion.matches) return;
        for (let index = 0; index < count; index += 1) {
            const burstKey = index % 3 === 0 ? randomKey() : key;
            const image = makeEffectImage("touch-burst cursor-fx-pop", burstKey);
            const angle = (Math.PI * 2 * index) / count + Math.random() * 0.3;
            const distancePx = 24 + Math.random() * 34;
            image.style.left = `${x}px`;
            image.style.top = `${y}px`;
            image.style.setProperty("--dx", `${Math.cos(angle) * distancePx}px`);
            image.style.setProperty("--dy", `${Math.sin(angle) * distancePx}px`);
            image.style.setProperty("--rot", `${Math.round((Math.random() - 0.5) * 90)}deg`);
            image.style.setProperty("--scale", String((0.58 + Math.random() * 0.3).toFixed(2)));
            window.setTimeout(() => appendEffect(image, 12), index * 18);
        }
    }

    function makeEffectImage(className, key) {
        const image = document.createElement("img");
        const finalKey = normalizeKey(key) || randomKey();
        image.className = className;
        image.src = cursorAssets[finalKey] || cursorAssets.default;
        image.alt = "";
        image.dataset.cursor = finalKey;
        image.decoding = "async";
        return image;
    }

    function appendEffect(image, limit) {
        document.body.appendChild(image);
        const nodes = document.querySelectorAll(".cursor-fx-trail, .cursor-fx-pop");
        const overflow = nodes.length - limit;
        for (let index = 0; index < overflow; index += 1) nodes[index].remove();
        image.addEventListener("animationend", () => image.remove(), { once: true });
        window.setTimeout(() => image.remove(), 850);
    }

    function randomKey() {
        return keys[Math.floor(Math.random() * keys.length)];
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }
})();
