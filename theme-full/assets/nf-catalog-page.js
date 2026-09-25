/* nf-catalog-page.js : /pages/catalogs presentation (NF-CATALOG-PAGE-V2, 2026-09-11).
   1. The open catalog follows the mouse a little (a few degrees of tilt, the cover copy behind moves less), eased in
      requestAnimationFrame and stopped once settled. Mouse only; off under reduced motion. No page turning.
   2. The + markers on the photo page are placed against the photo's cover crop (same math as the viewer).
   3. Chapter rail arrows. */
(function () {
  'use strict';
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)');

  function initTilt(root) {
    var hero = root.querySelector('.nfcp-hero'), tilt = root.querySelector('[data-nfcp-tilt]');
    if (!hero || !tilt) return;
    var tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    function step() {
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      if (Math.abs(tx - x) < 0.0008 && Math.abs(ty - y) < 0.0008) { x = tx; y = ty; raf = 0; }
      else raf = requestAnimationFrame(step);
      tilt.style.setProperty('--mx', x.toFixed(4));
      tilt.style.setProperty('--my', y.toFixed(4));
    }
    function kick() { if (!raf) raf = requestAnimationFrame(step); }
    hero.addEventListener('pointermove', function (e) {
      if (RM.matches || !FINE.matches || e.pointerType !== 'mouse') return;
      var r = hero.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
      kick();
    });
    hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; kick(); });
  }

  function placeHotspots(root) {
    var im = root.querySelector('.nfcp-pg--r .nfcp-ph');
    if (!im) return;
    var spots = root.querySelectorAll('.nfcp-hs');
    if (!spots.length) return;
    function run() {
      var nw = im.naturalWidth, nh = im.naturalHeight, bw = im.clientWidth, bh = im.clientHeight;
      if (!nw || !nh || !bw || !bh) return;
      var f = (im.getAttribute('data-focal') || '50% 50%').split(/\s+/);
      var fx = (parseFloat(f[0]) || 50) / 100, fy = (parseFloat(f[1] || f[0]) || 50) / 100;
      var s = Math.max(bw / nw, bh / nh), dw = nw * s, dh = nh * s;
      var ox = (bw - dw) * fx, oy = (bh - dh) * fy, shown = 0;
      Array.prototype.forEach.call(spots, function (h) {
        var px = ox + dw * (+h.getAttribute('data-x') / 100), py = oy + dh * (+h.getAttribute('data-y') / 100);
        var ok = px > bw * 0.08 && px < bw * 0.92 && py > bh * 0.08 && py < bh * 0.88 && shown < 3;
        h.style.left = (px / bw * 100) + '%';
        h.style.top = (py / bh * 100) + '%';
        h.classList.toggle('is-on', ok);
        if (ok) shown++;
      });
    }
    if (im.complete) run(); else im.addEventListener('load', run, { once: true });
    window.addEventListener('resize', run);
  }

  function initRail(root) {
    var rail = root.querySelector('[data-nfcp-rail]');
    if (!rail) return;
    var prev = root.querySelector('[data-nfcp-prev]'), next = root.querySelector('[data-nfcp-next]');
    function by() {
      var c = rail.querySelector('.nfcp-card');
      var gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
      var w = c ? c.getBoundingClientRect().width + gap : rail.clientWidth * 0.8;
      return Math.max(w, Math.floor(rail.clientWidth / w) * w - w);
    }
    function upd() {
      var max = rail.scrollWidth - rail.clientWidth - 2;
      if (prev) prev.disabled = rail.scrollLeft <= 2;
      if (next) next.disabled = rail.scrollLeft >= max;
    }
    function go(d) { rail.scrollBy({ left: d * by(), behavior: 'smooth' /* NF-CATPAGE-V3: always ask for smooth; NF-SMOOTH-ARROWS in custom-nav.js animates it when the device has reduce motion on */ }); }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    var q = 0;
    rail.addEventListener('scroll', function () { if (!q) q = requestAnimationFrame(function () { q = 0; upd(); }); }, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }

  function boot() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-nfcp]'), function (r) {
      if (r.__nfcp) return;
      r.__nfcp = 1;
      initTilt(r);
      placeHotspots(r);
      initRail(r);
      r.classList.add('is-js');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  document.addEventListener('shopify:section:load', boot);
})();
