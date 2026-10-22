/* NF-M6 (2026-10-22) phone product gallery + PDP fixes. Loaded (defer) last by snippets/nf-mod-global.liquid.
   1. Gallery swipe (owner: "it flashes white and doesn't swipe"). custom-nav.js NF-MOBILE-V4 (2026-09-12) drove the
      phone gallery by hand: it set scroll-snap-type:none once per drag and wrote scrollLeft on every pointermove. The
      theme's ScrollCarousel puts scroll-snap back on every scrollend (iOS fires one ~75ms after the finger slows), so
      mid-drag the strip snapped back to the current photo on each write: no swipe, a shudder, and the white slide boxes
      flashing through. Phones now use the browser's own scroll-snap swipe (nf-m6.css allows horizontal panning again).
      custom-nav's drag listens on document, so the touch is stopped on <body> on its way up: listeners on the gallery
      itself still get it (nf-pdp-tabs "tap the photo to zoom" measures the tap from pointerdown). Covers the quick view. */
(function () {
  'use strict';
  if (window.__nfM6) return;
  window.__nfM6 = 1;
  var PHONE = window.matchMedia('(max-width: 999px)');

  function guard(e) {
    if (e.pointerType !== 'touch' || !PHONE.matches || !e.target.closest) return;
    var c = e.target.closest('product-gallery .product-gallery__carousel');
    if (!c || e.target.closest('model-viewer, model-media, video-media, video, iframe')) return;
    e.stopPropagation();
    /* clear anything a half-finished old drag left inline */
    if (c.style.scrollSnapType === 'none') c.style.removeProperty('scroll-snap-type');
    if (c.style.scrollBehavior === 'auto') c.style.removeProperty('scroll-behavior');
  }
  function on() { if (document.body && !document.body.__nfM6) { document.body.__nfM6 = 1; document.body.addEventListener('pointerdown', guard, { passive: true }); } }
  if (document.body) on(); else document.addEventListener('DOMContentLoaded', on);
})();
