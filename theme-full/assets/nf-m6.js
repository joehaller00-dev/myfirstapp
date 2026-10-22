/* NF-M6 (2026-10-22) phone product gallery + PDP fixes. Loaded (defer) last by snippets/nf-mod-global.liquid.
   1. Gallery swipe (owner: "it flashes white and doesn't swipe"). custom-nav.js NF-MOBILE-V4 (2026-09-12) drove the
      phone gallery by hand: it set scroll-snap-type:none once per drag and wrote scrollLeft on every pointermove. The
      theme's ScrollCarousel puts scroll-snap back on every scrollend (iOS fires one ~75ms after the finger slows), so
      mid-drag the strip snapped back to the current photo on each write: no swipe, a shudder, and the white slide boxes
      flashing through. Phones now use the browser's own scroll-snap swipe (nf-m6.css allows horizontal panning again);
      this capture listener on window runs before custom-nav's document listeners and stops its drag from starting. */
(function () {
  'use strict';
  if (window.__nfM6) return;
  window.__nfM6 = 1;
  var PHONE = window.matchMedia('(max-width: 999px)');

  window.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'touch' || !PHONE.matches || !e.target.closest) return;
    var c = e.target.closest('product-gallery .product-gallery__carousel');
    if (!c || e.target.closest('model-viewer, model-media, video-media, video, iframe')) return;
    e.stopImmediatePropagation();
    /* clear anything a half-finished old drag left inline */
    if (c.style.scrollSnapType === 'none') c.style.removeProperty('scroll-snap-type');
    if (c.style.scrollBehavior === 'auto') c.style.removeProperty('scroll-behavior');
  }, { capture: true, passive: true });
})();
