/* Progressive, local-only PDF reader. The static pages and PDF links work without JS. */
const pagesElement = document.querySelector('#pdf-pages');
const reader = document.querySelector('#reader');
const statusElement = document.querySelector('#reader-status');
const errorElement = document.querySelector('#reader-error');
const loadingElement = document.querySelector('#reader-loading');
const currentInput = document.querySelector('#current-page');
const totalElement = document.querySelector('#total-pages');
const previousButton = document.querySelector('#previous-page');
const nextButton = document.querySelector('#next-page');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (pagesElement) {
  const figures = [...pagesElement.querySelectorAll('.pdf-page')];
  const states = figures.map((figure, index) => {
    const preserveAppearance = figure.dataset.renderMode === 'vector';
    figure.dataset.page = String(index + 1);
    if (!figure.id) figure.id = `page-${index + 1}`;
    figure.setAttribute('aria-label', `作品集第 ${index + 1} 页，共 ${figures.length} 页`);
    let canvas = figure.querySelector('.page-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'page-canvas';
      figure.append(canvas);
    }
    canvas.hidden = true;
    canvas.setAttribute('aria-hidden', 'true');
    figure.dataset.renderState = preserveAppearance ? 'ready' : 'idle';
    return {
      number: index + 1, figure, canvas, preserveAppearance, visible: false, near: false,
      renderedWidth: 0, renderedScale: 0, rendering: false, renderTask: null, page: null,
      pixels: 0, lastUsed: 0, revision: 0,
    };
  });
  const totalPages = states.length;
  let currentPage = 1;
  let jumpUntil = 0;
  let scrollFrame = 0;
  let pdf = null;
  let activeRenders = 0;
  let resizeTimer;
  let viewportTimer;
  let readerWidth = Math.round(pagesElement.getBoundingClientRect().width);
  const queue = new Set();
  const narrowScreen = () => window.innerWidth < 800;
  const concurrentRenders = navigator.hardwareConcurrency > 4 ? 2 : 1;
  const maxCanvasPixels = () => narrowScreen() ? 3_000_000 : 6_000_000;
  const memoryBudget = () => narrowScreen() ? 10_000_000 : 25_000_000;

  function setStatus(message) {
    if (statusElement) statusElement.textContent = message;
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
    const instant = reducedMotion.matches || Math.abs(value - currentPage) > 3;
    jumpUntil = performance.now() + (instant ? 100 : 900);
    updateControls(value);
    if (currentInput) currentInput.value = String(value);
    state.lastUsed = performance.now();
    requestRender(state);
    // Position below the two sticky bars directly: scrollIntoView would add
    // both the document scroll-padding and the figure scroll-margin.
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 0;
    const toolbarHeight = reader?.querySelector('.reader-toolbar')?.getBoundingClientRect().height || 0;
    const top = Math.max(0, window.scrollY + state.figure.getBoundingClientRect().top - headerHeight - toolbarHeight - 20);
    window.scrollTo({ top, behavior: instant ? 'instant' : 'smooth' });
    window.setTimeout(scheduleScrollUpdate, instant ? 120 : 950);
  }

  if (totalElement) totalElement.textContent = String(totalPages);
  if (currentInput) {
    currentInput.min = '1';
    currentInput.max = String(totalPages);
    currentInput.value = '1';
    currentInput.addEventListener('change', () => goToPage(currentInput.value));
    currentInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        goToPage(currentInput.value);
        currentInput.blur();
      } else if (event.key === 'Escape') {
        currentInput.value = String(currentPage);
        currentInput.blur();
      }
    });
  }
  previousButton?.addEventListener('click', () => goToPage(currentPage - 1));
  nextButton?.addEventListener('click', () => goToPage(currentPage + 1));
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const rect = reader?.getBoundingClientRect();
    if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
    event.preventDefault();
    goToPage(currentPage + (event.key === 'ArrowRight' ? 1 : -1));
  });
  updateControls(1);
  if (loadingElement) loadingElement.hidden = true;

  function currentRenderWidth(state) {
    return Math.max(1, Math.round(state.figure.getBoundingClientRect().width));
  }

  function targetRenderScale(state, width = currentRenderWidth(state)) {
    const rect = state.figure.getBoundingClientRect();
    const aspect = rect.width / Math.max(1, rect.height);
    const cssPixels = width * width / aspect;
    const zoom = Math.max(1, window.visualViewport?.scale || 1);
    const desiredScale = (window.devicePixelRatio || 1) * zoom;
    return Math.min(desiredScale, Math.sqrt(maxCanvasPixels() / cssPixels));
  }

  function needsRender(state) {
    const width = currentRenderWidth(state);
    return !state.pixels || Math.abs(width - state.renderedWidth) > 1 ||
      targetRenderScale(state, width) > state.renderedScale * 1.05;
  }

  function unload(state) {
    if (state.rendering || !state.pixels) return;
    state.canvas.hidden = true;
    state.canvas.width = 0;
    state.canvas.height = 0;
    state.pixels = 0;
    state.renderedWidth = 0;
    state.renderedScale = 0;
    state.figure.dataset.renderState = 'idle';
    state.page?.cleanup();
  }

  function trimCanvases() {
    let pixels = states.reduce((sum, state) => sum + state.pixels, 0);
    let canvases = states.filter(state => state.pixels > 0).length;
    const candidates = states.filter(state => state.pixels && !state.rendering && !state.visible)
      .sort((a, b) => Number(a.near) - Number(b.near) || a.lastUsed - b.lastUsed);
    for (const state of candidates) {
      if (pixels <= memoryBudget() && canvases <= 6) break;
      pixels -= state.pixels;
      canvases -= 1;
      unload(state);
    }
  }

  function requestRender(state) {
    // Verified vector previews preserve nested transparency that this PDF.js
    // version cannot composite faithfully. Keep them sharp at any zoom level.
    if (state.preserveAppearance) return;
    if (!pdf || state.rendering) return;
    if (!needsRender(state)) return;
    queue.add(state);
    pumpQueue();
  }

  function pumpQueue() {
    if (!pdf || activeRenders >= concurrentRenders || !queue.size) return;
    const candidates = [...queue].sort((a, b) =>
      Number(b.visible) - Number(a.visible) || Math.abs(a.number - currentPage) - Math.abs(b.number - currentPage));
    const state = candidates[0];
    queue.delete(state);
    if (state.rendering) return pumpQueue();
    activeRenders += 1;
    state.rendering = true;
    renderPage(state).finally(() => {
      state.rendering = false;
      state.renderTask = null;
      activeRenders -= 1;
      trimCanvases();
      if (state.near && needsRender(state)) {
        // A resize can invalidate a render while it is finishing.
        if (state.figure.dataset.renderState !== 'failed') queue.add(state);
      }
      pumpQueue();
    });
    pumpQueue();
  }

  async function renderPage(state) {
    const revision = state.revision;
    const canvas = state.canvas;
    try {
      const page = state.page || await pdf.getPage(state.number);
      state.page = page;
      if (revision !== state.revision) return;
      const width = currentRenderWidth(state);
      const baseViewport = page.getViewport({ scale: 1 });
      const cssScale = width / baseViewport.width;
      const outputScale = targetRenderScale(state, width);
      const viewport = page.getViewport({ scale: cssScale * outputScale });
      canvas.hidden = true;
      canvas.width = Math.max(1, Math.floor(viewport.width));
      canvas.height = Math.max(1, Math.floor(viewport.height));
      state.figure.dataset.renderState = 'rendering';
      const context = canvas.getContext('2d', { alpha: false });
      if (!context) throw new Error('canvas-unavailable');
      state.renderTask = page.render({ canvasContext: context, viewport, background: '#ffffff' });
      await state.renderTask.promise;
      if (revision !== state.revision) {
        canvas.width = 0;
        canvas.height = 0;
        return;
      }
      canvas.hidden = false;
      state.figure.dataset.renderState = 'ready';
      state.renderedWidth = width;
      state.renderedScale = outputScale;
      state.pixels = canvas.width * canvas.height;
      state.lastUsed = performance.now();
      if (state.number === 1) setStatus('作品集已就绪');
      page.cleanup();
    } catch (error) {
      canvas.hidden = true;
      canvas.width = 0;
      canvas.height = 0;
      state.pixels = 0;
      state.renderedWidth = 0;
      state.renderedScale = 0;
      if (error?.name === 'RenderingCancelledException' || revision !== state.revision) {
        state.figure.dataset.renderState = 'idle';
      } else {
        state.figure.dataset.renderState = 'failed';
        // The full static page remains visible, with original PDF links available.
        setStatus('可直接阅读；也可打开或下载完整 PDF');
      }
    }
  }

  function updateFromScroll() {
    scrollFrame = 0;
    const height = window.innerHeight;
    const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0;
    const toolbarBottom = reader?.querySelector('.reader-toolbar')?.getBoundingClientRect().bottom || 0;
    const readingTop = Math.min(height, Math.max(0, headerBottom, toolbarBottom));
    let mostVisible = null;
    let largestVisibleHeight = 0;
    for (const state of states) {
      const rect = state.figure.getBoundingClientRect();
      const visibleHeight = Math.max(0, Math.min(rect.bottom, height) - Math.max(rect.top, readingTop));
      state.visible = visibleHeight > 0;
      if (state.visible) {
        state.lastUsed = performance.now();
        if (visibleHeight > largestVisibleHeight) {
          largestVisibleHeight = visibleHeight;
          mostVisible = state;
        }
      }
      if (!('IntersectionObserver' in window)) {
        state.near = rect.bottom > -height && rect.top < height * 2;
        if (state.near) requestRender(state);
      }
    }
    const atDocumentEnd = window.scrollY + height >= document.documentElement.scrollHeight - 12;
    if (atDocumentEnd && states.at(-1)?.visible) mostVisible = states.at(-1);
    if (mostVisible && performance.now() >= jumpUntil) updateControls(mostVisible.number);
    trimCanvases();
  }

  function scheduleScrollUpdate() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateFromScroll);
  }
  window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
  window.addEventListener('resize', scheduleScrollUpdate, { passive: true });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const state = states[Number(entry.target.dataset.page) - 1];
        if (!state) continue;
        state.near = entry.isIntersecting;
        if (state.near) requestRender(state);
        else queue.delete(state);
      }
      scheduleScrollUpdate();
    }, { rootMargin: '100% 0px 100% 0px', threshold: 0 });
    states.forEach(state => observer.observe(state.figure));
  }

  function handleWidthChange() {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const width = Math.round(pagesElement.getBoundingClientRect().width);
      if (Math.abs(width - readerWidth) <= 1) return;
      readerWidth = width;
      for (const state of states) {
        state.revision += 1;
        state.renderTask?.cancel();
        if (!state.rendering) unload(state);
      }
      for (const state of states) if (state.near) requestRender(state);
      scheduleScrollUpdate();
    }, 160);
  }
  if ('ResizeObserver' in window) new ResizeObserver(handleWidthChange).observe(pagesElement);
  else window.addEventListener('resize', handleWidthChange, { passive: true });

  function handleVisualViewportChange() {
    clearTimeout(viewportTimer);
    viewportTimer = window.setTimeout(() => {
      const viewportTop = window.visualViewport?.offsetTop || 0;
      const viewportBottom = viewportTop + (window.visualViewport?.height || window.innerHeight);
      for (const state of states) {
        const rect = state.figure.getBoundingClientRect();
        if (rect.bottom > viewportTop && rect.top < viewportBottom) requestRender(state);
      }
    }, 180);
  }
  window.visualViewport?.addEventListener('resize', handleVisualViewportChange, { passive: true });
  window.visualViewport?.addEventListener('scroll', handleVisualViewportChange, { passive: true });
  scheduleScrollUpdate();

  async function enhanceWithPDF() {
    if (!totalPages) return;
    setStatus('正在准备清晰阅读…');
    try {
      const pdfjs = await import('./vendor/pdf.mjs');
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('./vendor/pdf.worker.mjs', import.meta.url).href;
      const task = pdfjs.getDocument({
        url: document.querySelector('#native-open')?.href ||
          new URL('./ZhefeiHuang_SelectedWorks202611.pdf', import.meta.url).href,
        cMapUrl: new URL('./vendor/cmaps/', import.meta.url).href,
        cMapPacked: true,
        standardFontDataUrl: new URL('./vendor/standard_fonts/', import.meta.url).href,
        isEvalSupported: false,
      });
      pdf = await task.promise;
      if (pdf.numPages !== totalPages) throw new Error('unexpected-page-count');
      setStatus('作品集已就绪');
      for (const state of states) if (state.near) requestRender(state);
      requestRender(states[currentPage - 1]);
    } catch {
      setStatus('作品集已就绪');
      if (errorElement) {
        errorElement.textContent = '可直接阅读下方作品集，或打开、下载原始 PDF。';
        errorElement.hidden = false;
      }
    }
  }
  enhanceWithPDF();
}
