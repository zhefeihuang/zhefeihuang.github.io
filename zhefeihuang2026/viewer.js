/* Read the verified page artwork directly. The original PDF loads only on request. */
const pagesElement = document.querySelector('#pdf-pages');
const reader = document.querySelector('#reader');
const statusElement = document.querySelector('#reader-status');
const currentInput = document.querySelector('#current-page');
const totalElement = document.querySelector('#total-pages');
const previousButton = document.querySelector('#previous-page');
const nextButton = document.querySelector('#next-page');
const nativeOpen = document.querySelector('#native-open');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (pagesElement) {
  let activeLoads = 0;
  let currentPage = 1;
  let jumpUntil = 0;
  let scrollFrame = 0;
  let zoomTimer = 0;
  let lastJumpPage = 0;
  let lastJumpTime = 0;
  let pumping = false;
  const normalQueue = new Set();
  const zoomQueue = new Map();
  const maxConcurrentLoads = 2;

  function absolute(value) {
    if (!value) return '';
    try { return new URL(value, document.baseURI).href; } catch (_) { return ''; }
  }
  function setStatus(message) {
    if (statusElement) statusElement.textContent = message;
  }
  function setPhase(state, phase) {
    state.phase = phase;
    state.figure.dataset.renderState = phase;
    state.figure.setAttribute('aria-busy', phase === 'loading' ? 'true' : 'false');
  }
  function viewport() {
    const visual = window.visualViewport;
    const top = visual ? visual.offsetTop : 0;
    const left = visual ? visual.offsetLeft : 0;
    return {
      top, left,
      bottom: top + (visual ? visual.height : window.innerHeight),
      right: left + (visual ? visual.width : window.innerWidth),
      scale: visual ? Math.max(1, visual.scale) : 1,
    };
  }

  const states = Array.from(pagesElement.querySelectorAll('.pdf-page')).map((figure, index) => {
    const img = figure.querySelector('.page-preview');
    // Release legacy canvases as well when an older cached document is opened.
    figure.querySelectorAll('canvas').forEach(canvas => canvas.remove());
    const number = index + 1;
    figure.dataset.page = String(number);
    if (!figure.id) figure.id = 'page-' + number;
    const normalSrc = img.dataset.src || img.getAttribute('src') || img.dataset.previewSrc || '';
    const normalSet = img.dataset.srcset || img.getAttribute('srcset') || '';
    const normalSizes = img.dataset.sizes || img.getAttribute('sizes') || '100vw';
    const candidates = new Map();
    normalSet.split(',').forEach(part => {
      const match = part.trim().match(/^(\S+)\s+(\d+)w$/);
      if (match) candidates.set(absolute(match[1]), Number(match[2]));
    });
    const smallSrc = img.dataset.previewSrc || normalSrc;
    const standardSrc = img.dataset.standardSrc || normalSrc.replace(/\/small\//, '/');
    const state = {
      number, figure, img, normalSrc, normalSet, normalSizes, smallSrc, standardSrc,
      fullSrc: img.dataset.fullSrc || '', candidates,
      near: false, visible: false, phase: 'idle', active: false, token: 0,
      retries: 0, triedStandard: false, timer: 0, zoomTier: 'preview',
      zoomBusy: false, zoomToken: 0, zoomFailedUntil: 0, cancelZoom: null,
    };
    figure.dataset.resolution = 'preview';
    let fallback = figure.querySelector('.page-fallback');
    if (!fallback) {
      fallback = document.createElement('div');
      fallback.className = 'page-fallback';
      fallback.hidden = true;
      const copy = document.createElement('p');
      copy.dataset.errorCopy = '';
      copy.textContent = '这一页暂未加载完成。';
      const retry = document.createElement('button');
      retry.type = 'button'; retry.dataset.retry = ''; retry.textContent = '重新加载这一页';
      fallback.append(copy, retry);
      if (nativeOpen) {
        const open = document.createElement('a');
        const url = new URL(nativeOpen.href); url.hash = 'page=' + number;
        open.href = url.href; open.target = '_blank'; open.rel = 'noopener';
        open.textContent = '在完整 PDF 中查看';
        fallback.append(open);
      }
      figure.append(fallback);
    }
    state.fallback = fallback;
    fallback.querySelectorAll('[data-retry]').forEach(button => {
      button.addEventListener('click', () => {
        finishNormal(state);
        state.token += 1; state.zoomToken += 1;
        state.retries = 0; state.triedStandard = false;
        state.zoomTier = 'preview'; state.zoomFailedUntil = 0;
        figure.dataset.resolution = 'preview';
        fallback.hidden = true;
        setPhase(state, 'idle');
        enqueueNormal(state, true);
      });
    });
    bindImage(state, img);
    if (img.getAttribute('src') && img.complete && img.naturalWidth > 0) {
      setPhase(state, 'ready');
    } else if (img.getAttribute('src')) {
      img.hidden = true;
      state.active = true; activeLoads += 1;
      setPhase(state, 'loading');
      startTimer(state);
      // A failed eager request may have fired before the module was ready.
      if (img.complete && !img.naturalWidth) queueMicrotask(() => onImageError(state));
    } else {
      setPhase(state, 'idle');
    }
    return state;
  });
  const totalPages = states.length;

  function bindImage(state, img) {
    // A cancelled offscreen element may still dispatch a late event. A fresh
    // element keeps that event from being mistaken for its replacement.
    img.addEventListener('load', () => { if (state.img === img) onImageLoad(state); });
    img.addEventListener('error', () => { if (state.img === img) onImageError(state); });
  }
  function pauseOffscreenLoad(state) {
    if (!state.active || state.visible || state.number === currentPage) return;
    const old = state.img;
    const replacement = document.createElement('img');
    for (const attribute of old.attributes) {
      if (!['src', 'srcset', 'sizes'].includes(attribute.name)) replacement.setAttribute(attribute.name, attribute.value);
    }
    replacement.hidden = true;
    state.token += 1;
    finishNormal(state);
    state.img = replacement;
    bindImage(state, replacement);
    old.replaceWith(replacement);
    old.removeAttribute('srcset');
    old.removeAttribute('src');
    normalQueue.delete(state);
    setPhase(state, 'idle');
  }

  function startTimer(state) {
    clearTimeout(state.timer);
    const token = state.token;
    state.timer = window.setTimeout(() => {
      if (state.active && token === state.token) onImageError(state);
    }, 18000);
  }
  function finishNormal(state) {
    clearTimeout(state.timer);
    state.timer = 0;
    if (state.active) { state.active = false; activeLoads = Math.max(0, activeLoads - 1); }
  }
  function onImageLoad(state) {
    if (!state.img.naturalWidth) return;
    finishNormal(state);
    state.img.hidden = false;
    state.fallback.hidden = true;
    setPhase(state, 'ready');
    if (state.number === currentPage) setStatus('第 ' + state.number + ' 页已就绪，共 ' + totalPages + ' 页。');
    pumpQueue();
    scheduleZoom();
  }
  function onImageError(state) {
    if (!state.active && !state.img.getAttribute('src')) return;
    if (state.zoomTier !== 'preview' && !state.active) {
      restorePreview(state);
      return;
    }
    finishNormal(state);
    state.img.hidden = true;
    if (!state.visible && state.number !== currentPage &&
        Array.from(normalQueue).some(queued => queued.urgent || queued.visible)) {
      setPhase(state, 'idle');
      normalQueue.add(state);
      pumpQueue();
      return;
    }
    if (state.retries < 1 && state.smallSrc) {
      state.retries += 1;
      const url = new URL(state.smallSrc, document.baseURI);
      url.searchParams.set('retry', String(Date.now()));
      startNormal(state, url.href, '', '');
    } else if (!state.triedStandard && state.standardSrc && absolute(state.standardSrc) !== absolute(state.smallSrc)) {
      state.triedStandard = true;
      startNormal(state, state.standardSrc, '', '');
    } else {
      setPhase(state, 'failed');
      state.fallback.hidden = false;
      const copy = state.fallback.querySelector('[data-error-copy]');
      if (copy) copy.textContent = '第 ' + state.number + ' 页暂未加载完成。可重试，或打开完整 PDF。';
      if (state.number === currentPage) setStatus('第 ' + state.number + ' 页暂未加载完成，可使用这一页的重试按钮。');
      pumpQueue();
    }
  }
  function startNormal(state, src, srcset, sizes) {
    state.token += 1;
    if (!state.active) { state.active = true; activeLoads += 1; }
    setPhase(state, 'loading');
    if (!state.img.naturalWidth) state.img.hidden = true;
    state.img.loading = 'eager';
    if (sizes) state.img.setAttribute('sizes', sizes); else state.img.removeAttribute('sizes');
    if (srcset) state.img.setAttribute('srcset', srcset); else state.img.removeAttribute('srcset');
    state.img.setAttribute('src', src);
    startTimer(state);
    if (state.img.complete && state.img.naturalWidth) queueMicrotask(() => onImageLoad(state));
  }
  function enqueueNormal(state, urgent) {
    if (!state || state.active || state.phase === 'ready' || state.phase === 'failed') return;
    state.urgent = Boolean(urgent);
    normalQueue.add(state);
    pumpQueue();
  }
  function pixelsInCurrentSource(state) {
    if (state.zoomTier === 'full') return 4600;
    if (state.zoomTier === 'standard') return 2300;
    return state.candidates.get(absolute(state.img.currentSrc || state.img.src)) ||
      (String(state.img.currentSrc || state.img.src).includes('/small/') ? 960 : 2300);
  }
  function desiredZoom(state) {
    if (!state || !state.visible || state.phase !== 'ready' || state.zoomBusy || Date.now() < state.zoomFailedUntil) return null;
    // Desktop display density and browser zoom can require more pixels while
    // visualViewport.scale remains 1. Keep an adequate preview as-is.
    const required = state.figure.getBoundingClientRect().width * (window.devicePixelRatio || 1) * viewport().scale;
    const current = pixelsInCurrentSource(state);
    if (current >= required * .95) return null;
    const tier = required > 2450 ? 'full' : 'standard';
    const width = tier === 'full' ? 4600 : 2300;
    const url = tier === 'full' ? state.fullSrc : state.standardSrc;
    if (!url || current >= width * .95) return null;
    return { tier, width, url: absolute(url) };
  }
  function loadZoom(state, target) {
    state.zoomBusy = true;
    activeLoads += 1;
    const token = ++state.zoomToken;
    const probe = new Image();
    probe.decoding = 'async';
    let completed = false;
    const done = (success, cancelled = false) => {
      if (completed) return;
      completed = true;
      clearTimeout(timer);
      activeLoads = Math.max(0, activeLoads - 1);
      state.zoomBusy = false;
      state.cancelZoom = null;
      const stillNeeded = desiredZoom(state);
      if (success && token === state.zoomToken && stillNeeded && target.width > pixelsInCurrentSource(state)) {
        state.zoomTier = target.tier;
        state.figure.dataset.resolution = target.tier;
        state.img.removeAttribute('srcset');
        state.img.removeAttribute('sizes');
        state.img.src = target.url;
      } else if (!success && !cancelled) {
        state.zoomFailedUntil = Date.now() + 30000;
      }
      probe.onload = null; probe.onerror = null;
      if (cancelled) probe.removeAttribute('src');
      pumpQueue(); scheduleZoom();
    };
    const timer = window.setTimeout(() => {
      done(false);
      probe.src = '';
    }, 30000);
    probe.onload = () => {
      if (probe.decode) probe.decode().then(() => done(true), () => done(true));
      else done(true);
    };
    probe.onerror = () => done(false);
    state.cancelZoom = () => { state.zoomToken += 1; done(false, true); };
    probe.src = target.url;
  }
  function restorePreview(state) {
    if (state.zoomTier === 'preview') return;
    state.zoomToken += 1;
    state.zoomTier = 'preview'; state.figure.dataset.resolution = 'preview';
    if (state.normalSizes) state.img.setAttribute('sizes', state.normalSizes);
    if (state.normalSet) state.img.setAttribute('srcset', state.normalSet);
    state.img.src = state.normalSrc;
  }
  function pumpQueue() {
    if (pumping) return;
    pumping = true;
    try {
    const visibleWaiting = Array.from(normalQueue).some(state =>
      !state.active && state.phase !== 'ready' && state.phase !== 'failed' && (state.urgent || state.visible));
    if (visibleWaiting && activeLoads >= maxConcurrentLoads) {
      const offscreen = states.filter(state => !state.visible && state.number !== currentPage && (state.active || state.cancelZoom))
        .sort((a, b) => Math.abs(b.number - currentPage) - Math.abs(a.number - currentPage));
      for (const state of offscreen) {
        if (state.cancelZoom) state.cancelZoom();
        if (state.active) pauseOffscreenLoad(state);
        if (activeLoads < maxConcurrentLoads) break;
      }
    }
    while (activeLoads < maxConcurrentLoads) {
      const candidates = Array.from(normalQueue).filter(state => !state.active && state.phase !== 'ready' && state.phase !== 'failed');
      candidates.sort((a, b) => Number(b.urgent || b.visible) - Number(a.urgent || a.visible) || Math.abs(a.number - currentPage) - Math.abs(b.number - currentPage));
      const visible = candidates.find(state => state.urgent || state.visible);
      if (visible) {
        normalQueue.delete(visible); visible.urgent = false;
        startNormal(visible, visible.normalSrc, visible.normalSet, visible.normalSizes);
        continue;
      }
      const zoom = Array.from(zoomQueue)
        .filter(([state]) => state.visible && !state.zoomBusy)
        .sort(([a], [b]) => Math.abs(a.number - currentPage) - Math.abs(b.number - currentPage))[0];
      if (zoom) {
        zoomQueue.delete(zoom[0]);
        const target = desiredZoom(zoom[0]);
        if (target) { loadZoom(zoom[0], target); continue; }
      }
      const nearby = candidates.find(state => state.near);
      if (!nearby) break;
      normalQueue.delete(nearby);
      startNormal(nearby, nearby.normalSrc, nearby.normalSet, nearby.normalSizes);
    }
    } finally {
      pumping = false;
    }
  }

  function updateControls(number) {
    currentPage = Math.min(totalPages || 1, Math.max(1, number));
    if (currentInput && document.activeElement !== currentInput) currentInput.value = String(currentPage);
    if (previousButton) previousButton.disabled = currentPage <= 1;
    if (nextButton) nextButton.disabled = currentPage >= totalPages;
    if (reader) reader.dataset.currentPage = String(currentPage);
  }
  function goToPage(number) {
    const value = Math.min(totalPages, Math.max(1, Math.round(Number(number) || currentPage)));
    const state = states[value - 1];
    if (!state) return;
    const now = performance.now();
    if (value === lastJumpPage && now - lastJumpTime < 100) return;
    lastJumpPage = value; lastJumpTime = now;
    const instant = reducedMotion.matches || Math.abs(value - currentPage) > 3;
    jumpUntil = now + (instant ? 150 : 950);
    updateControls(value);
    if (currentInput) currentInput.value = String(value);
    enqueueNormal(state, true);
    const header = document.querySelector('.site-header');
    const toolbar = reader && reader.querySelector('.reader-toolbar');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const toolbarHeight = toolbar ? toolbar.getBoundingClientRect().height : 0;
    const top = Math.max(0, window.scrollY + state.figure.getBoundingClientRect().top - headerHeight - toolbarHeight - 20);
    if (instant) {
      const previous = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(window.scrollX, top);
      requestAnimationFrame(() => { document.documentElement.style.scrollBehavior = previous; });
    } else {
      window.scrollTo({ top, behavior: 'smooth' });
    }
    window.setTimeout(scheduleScrollUpdate, instant ? 170 : 1000);
  }
  function updateFromScroll() {
    scrollFrame = 0;
    const view = viewport();
    const header = document.querySelector('.site-header');
    const toolbar = reader && reader.querySelector('.reader-toolbar');
    const top = Math.min(view.bottom, Math.max(view.top,
      header ? header.getBoundingClientRect().bottom : 0,
      toolbar ? toolbar.getBoundingClientRect().bottom : 0));
    let chosen = null;
    let largest = 0;
    states.forEach(state => {
      const rect = state.figure.getBoundingClientRect();
      const width = Math.max(0, Math.min(rect.right, view.right) - Math.max(rect.left, view.left));
      const height = Math.max(0, Math.min(rect.bottom, view.bottom) - Math.max(rect.top, top));
      state.visible = width > 0 && height > 0;
      if (state.visible && height > largest) { chosen = state; largest = height; }
      if (!('IntersectionObserver' in window)) {
        state.near = rect.bottom > view.top - window.innerHeight && rect.top < view.bottom + window.innerHeight;
        if (state.near) enqueueNormal(state, false);
      }
      if (!state.visible) {
        zoomQueue.delete(state);
        restorePreview(state);
      }
    });
    if (view.scale <= 1.05 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 12 && states.length && states[states.length - 1].visible) chosen = states[states.length - 1];
    if (chosen && performance.now() >= jumpUntil) updateControls(chosen.number);
    // A paused prefetch can remain inside the observer's root margin. On a
    // return scroll it becomes visible without a new intersection event.
    states.forEach(state => {
      if (state.visible && state.phase === 'idle' && !state.active) {
        state.urgent = true;
        normalQueue.add(state);
      }
    });
    pumpQueue(); scheduleZoom();
  }
  function scheduleScrollUpdate() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateFromScroll);
  }
  function scheduleZoom() {
    clearTimeout(zoomTimer);
    zoomTimer = window.setTimeout(() => {
      // A pinch can leave parts of two pages visible while the page counter
      // follows only one. Upgrade every visible page, within the shared limit.
      states.forEach(state => {
        const target = desiredZoom(state);
        if (target) zoomQueue.set(state, target);
        else if (!state.zoomBusy) zoomQueue.delete(state);
      });
      pumpQueue();
    }, 200);
  }

  if (totalElement) totalElement.textContent = String(totalPages);
  if (currentInput) {
    currentInput.min = '1'; currentInput.max = String(totalPages); currentInput.value = '1';
    currentInput.addEventListener('change', () => goToPage(currentInput.value));
    currentInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') { event.preventDefault(); goToPage(currentInput.value); currentInput.blur(); }
      else if (event.key === 'Escape') { currentInput.value = String(currentPage); currentInput.blur(); }
    });
  }
  if (previousButton) previousButton.addEventListener('click', () => goToPage(currentPage - 1));
  if (nextButton) nextButton.addEventListener('click', () => goToPage(currentPage + 1));
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target instanceof Element && event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const rect = reader && reader.getBoundingClientRect();
    if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
    event.preventDefault(); goToPage(currentPage + (event.key === 'ArrowRight' ? 1 : -1));
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const state = states[Number(entry.target.dataset.page) - 1];
        if (!state) return;
        state.near = entry.isIntersecting;
        if (state.near) enqueueNormal(state, false);
        else { normalQueue.delete(state); zoomQueue.delete(state); }
      });
      scheduleScrollUpdate();
    }, { rootMargin: '90% 0px 90% 0px', threshold: 0 });
    states.forEach(state => observer.observe(state.figure));
  }
  window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
  window.addEventListener('resize', scheduleScrollUpdate, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scheduleScrollUpdate, { passive: true });
    window.visualViewport.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
  }
  const loading = document.querySelector('#reader-loading');
  const error = document.querySelector('#reader-error');
  if (loading) loading.hidden = true;
  if (error) error.hidden = true;
  updateControls(1); scheduleScrollUpdate();
}
