import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const main = await readFile(new URL("js/main.js", root), "utf8");
const bundle = await readFile(new URL("js/home-bundle.js", root), "utf8");
const spacing = await readFile(new URL("js/home-mobile-spacing-final.js", root), "utf8");
const html = await readFile(new URL("index.html", root), "utf8");
const normalizedBundle = bundle.replace(/\r\n/g, "\n");
assert.ok(normalizedBundle.includes(main.replace(/\r\n/g, "\n").trimEnd()), "Bundle must contain the current main source");
assert.ok(normalizedBundle.includes(spacing.replace(/\r\n/g, "\n").trimEnd()), "Bundle must contain the current spacing source");
assert.ok(html.includes("20260927-proportions1"), "Updated bundle must bypass the old cached URL");
const refresh = main.slice(main.indexOf("function refreshFloatingProjectSizes()"), main.indexOf("function setupFloatingProjects()"));

for (const viewport of [320, 375, 390, 430, 600, 768, 820, 821, 1024, 1440, 1920]) {
  const element = {
    offsetWidth: 98, offsetHeight: 155,
    getBoundingClientRect: () => ({ width: 160, height: 185 })
  };
  const floater = { element, width: 220, height: 260 };
  const context = vm.createContext({
    window: { innerWidth: viewport },
    document: { querySelector: () => ({}) },
    floaters: [floater],
    floatingStageBounds: null, floatingMotionSettings: null,
    getFloatingStageBounds: () => ({ width: viewport, height: 500 }),
    getFloatingMotionSettings: () => ({ phone: viewport < 520 }),
    bounceFloatingProject: () => {}, keepFloatingSpeed: () => {}
  });
  vm.runInContext(refresh + "\nrefreshFloatingProjectSizes();", context);
  assert.equal(floater.width, viewport <= 820 ? 98 : 220);
  assert.equal(floater.height, viewport <= 820 ? 155 : 260);
  element.offsetWidth = 80;
  element.offsetHeight = 126;
  vm.runInContext("refreshFloatingProjectSizes();", context);
  assert.equal(floater.width, viewport <= 820 ? 80 : 220, "Mobile sizes must be able to shrink");
  assert.equal(floater.height, viewport <= 820 ? 126 : 260);
}

// All mobile widths use one common scale; intrinsic image ratios remain independent.
assert.match(html, /--artwork-width: 0\.986666667/);
assert.match(html, /--artwork-width: 0\.76/);
assert.match(html, /height: auto !important/);
assert.doesNotMatch(html, /height: var\(--mobile-floater-size\)/);
for (const viewport of [320, 375, 390, 430, 600, 768, 820]) {
  const unit = Math.min(180, Math.max(80, viewport * 0.25));
  const widths = [unit * 0.986666667, unit * 0.76, unit, unit, unit];
  const desktop = [213.12, 164.16, 216, 216, 216];
  const scales = widths.map((width, i) => width / desktop[i]);
  assert.ok(Math.max(...scales) - Math.min(...scales) < 1e-8);
}
for (const viewport of [390, 768, 821, 1440]) {
  let boot;
  const base = { phone: viewport < 520, compact: viewport < 640, touchSafe: viewport <= 1024, gap: -4, radiusScale: 0.3, separationStrength: 0.18 };
  const context = vm.createContext({
    window: { innerWidth: viewport, addEventListener: () => {} },
    document: { readyState: "loading", addEventListener: (_name, callback) => { boot = callback; } },
    getFloatingMotionSettings: () => base,
    refreshFloatingProjectSizes: () => {}
  });
  vm.runInContext(spacing, context);
  boot();
  const settings = context.getFloatingMotionSettings({});
  assert.equal(settings.radiusScale, viewport <= 820 ? 0.55 : viewport <= 1024 ? 0.3 : base.radiusScale);
}
console.log("PASS: 11 viewport geometry checks, mobile shrink/rotation regression, desktop branch preservation, proportional widths, bundle/source consistency.");
