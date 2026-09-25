/* NF-PIECES-V2 (2026-09-11): tabs, gliding arrows and progress rail for sections/nf-pieces-home.liquid.
   Arrows call element.scrollTo({ behavior: 'smooth' }); NF-SMOOTH-ARROWS in custom-nav.js turns that into an eased
   frame loop even when Windows animations are off, so the row glides instead of jumping.
   NF-PIECES-V4 (2026-09-12): offscreen card images preload on idle and per tab (see warm()). */
(function () {
  'use strict';

  function initAll(scope) {
    var list = (scope || document).querySelectorAll('[data-nfp]');
    for (var i = 0; i < list.length; i++) init(list[i]);
  }

  function init(root) {
    if (root.__nfpReady) return;
    root.__nfpReady = true;
    root.classList.add('nfp--js');

    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('.nfp__panel'));
    var tablist = root.querySelector('.nfp__tabs');
    var ink = root.querySelector('.nfp__ink');
    var prev = root.querySelector('[data-nfp-prev]');
    var next = root.querySelector('[data-nfp-next]');
    var cur = 0, raf = 0, snapTimer = 0;

    for (var p = 0; p < panels.length; p++) if (panels[p].classList.contains('is-active')) cur = p;

    /* NF-SPEED-A-0916: hidden tabs arrive inside <template data-nfp-lazy> (about 600 fewer elements while the page loads). A tab's cards are filled in the moment it is hovered, touched, focused or selected, before it is shown. */
    function nfHyd(pn) {
      var t = pn && pn.querySelector('template[data-nfp-lazy]');
      if (!t) return;
      t.parentNode.replaceChild(t.content, t);
      var tq = pn.querySelector('[data-nfp-track]');
      if (tq) {
        tq.addEventListener('scroll', queue, { passive: true });
        tq.addEventListener('touchstart', function () { warm(pn); }, { passive: true });
      }
    }

    function track() {
      var panel = panels[cur];
      return panel ? panel.querySelector('[data-nfp-track]') : null;
    }

    function moveInk() {
      var t = tabs[cur];
      if (!t || !ink) return;
      ink.style.width = '100px'; /* NF-SMOOTH-V1: the ink glides with transform only */
      ink.style.transform = 'translateX(' + t.offsetLeft + 'px) scaleX(' + (t.offsetWidth / 100) + ')';
      if (!ink.classList.contains('is-ready')) setTimeout(function () { ink.classList.add('is-ready'); }, 60);
    }

    function update() {
      raf = 0;
      var tr = track();
      if (!tr) return;
      var max = tr.scrollWidth - tr.clientWidth;
      var x = Math.abs(tr.scrollLeft);
      if (prev) prev.disabled = x <= 2;
      if (next) next.disabled = x >= max - 2;
      var bar = panels[cur].querySelector('.nfp__bar');
      if (bar) {
        var ratio = max > 1 ? tr.clientWidth / tr.scrollWidth : 1;
        bar.style.width = (ratio * 100).toFixed(3) + '%';
        bar.style.transform = 'translateX(' + (max > 1 ? (x / max) * (1 / ratio - 1) * 100 : 0).toFixed(3) + '%)';
        bar.parentNode.style.visibility = max > 1 ? '' : 'hidden';
      }
    }

    function queue() { if (!raf) raf = requestAnimationFrame(update); }

    function step(dir) {
      var tr = track();
      if (!tr) return;
      var first = tr.children[1] || tr.children[0];
      if (!first) return;
      var gap = parseFloat(getComputedStyle(tr).columnGap) || 0;
      var unit = first.getBoundingClientRect().width + gap;
      var max = tr.scrollWidth - tr.clientWidth;
      var perView = Math.max(1, Math.floor((tr.clientWidth + gap + 1) / unit));
      var target = Math.round(tr.scrollLeft / unit) * unit + dir * perView * unit;
      target = Math.max(0, Math.min(max, target));
      tr.scrollTo({ left: target, behavior: 'smooth' });
      clearTimeout(snapTimer);
      snapTimer = setTimeout(function () { tr.style.scrollSnapType = ''; update(); }, 1000);
    }

    function select(i, focus) {
      if (i === cur || !panels[i] || !tabs[i]) return;
      var old = panels[cur], nw = panels[i];
      tabs[cur].setAttribute('aria-selected', 'false');
      tabs[cur].tabIndex = -1;
      tabs[i].setAttribute('aria-selected', 'true');
      tabs[i].tabIndex = 0;
      if (focus) tabs[i].focus({ preventScroll: true });
      cur = i;
      old.classList.remove('is-active');
      old.hidden = true;
      nw.classList.remove('nfp--prep'); clearTimeout(nw.__nfpPrep); /* NF-SMOOTH-V1 */
      nfHyd(nw); nw.hidden = false;
      var tr = nw.querySelector('[data-nfp-track]');
      if (tr) tr.scrollLeft = 0;
      void nw.offsetWidth; // flush so the fade in runs
      nw.classList.add('is-active');
      moveInk();
      update();
      if (tablist && tablist.scrollWidth > tablist.clientWidth + 2) {
        var t = tabs[i];
        tablist.scrollTo({ left: Math.max(0, t.offsetLeft - (tablist.clientWidth - t.offsetWidth) / 2), behavior: 'smooth' });
      }
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i, false); });
      t.addEventListener('keydown', function (e) {
        var j = -1;
        if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') j = 0;
        else if (e.key === 'End') j = tabs.length - 1;
        if (j > -1) { e.preventDefault(); select(j, true); }
      });
    });
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
    panels.forEach(function (panel) {
      var tr = panel.querySelector('[data-nfp-track]');
      if (tr) tr.addEventListener('scroll', queue, { passive: true });
    });

    function refresh() { moveInk(); queue(); }
    if (window.ResizeObserver) new ResizeObserver(refresh).observe(root);
    else window.addEventListener('resize', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { requestAnimationFrame(moveInk); });
    window.addEventListener('load', moveInk);
    /* NF-PERF5-0912: the ResizeObserver's first callback (after layout, before paint) places the ink and arrows; measuring here forced a layout mid-load */
    if (!window.ResizeObserver) { moveInk(); update(); }

    /* NF-PIECES-V4 (2026-09-12): no blank squares on arrow clicks, swipes or tab changes. Lazy images inside a
       sideways scroller only start loading as they slide in, so: once the section is near the viewport and the page is
       idle, the rest of the active tab loads eagerly and decodes; hovering, focusing or pressing a tab warms its first
       six; selecting a tab loads all of it. srcset and sizes stay on each img, so the right width is fetched. */
    /* NF-SMOOTH-V1: lay the next panel out, invisible, while the pointer is on its tab, so the click only swaps */
    function prep(i) {
      var pn = panels[i];
      if (!pn || i === cur || !pn.hidden) return;
      pn.classList.add('nfp--prep'); nfHyd(pn); pn.hidden = false;
      clearTimeout(pn.__nfpPrep);
      pn.__nfpPrep = setTimeout(function () { if (i !== cur && pn.classList.contains('nfp--prep')) { pn.hidden = true; pn.classList.remove('nfp--prep'); } }, 1500);
    }
    function warm(panel, limit) {
      if (!panel) return;
      nfHyd(panel);
      var imgs = panel.querySelectorAll('img');
      var n = Math.min(imgs.length, limit || imgs.length);
      for (var w = 0; w < n; w++) {
        var im = imgs[w];
        if (im.__nfpWarm) continue;
        im.__nfpWarm = true;
        if (im.loading === 'lazy') im.loading = 'eager';
        if (im.decode) im.decode().catch(function () {});
      }
    }
    var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 200); };
    /* NF-SPEED-0913: idle warming waits for window load, so offscreen card photos never share a slow phone connection with the hero. Taps and hovers still warm at once. */
    function warmActive() { var go = function () { idle(function () { warm(panels[cur]); }, { timeout: 1500 }); }; if (document.readyState === 'complete') go(); else window.addEventListener('load', go, { once: true }); }
    function armWarm() {
      if (!('IntersectionObserver' in window)) { warmActive(); return; }
      var io = new IntersectionObserver(function (entries) {
        for (var e = 0; e < entries.length; e++) if (entries[e].isIntersecting) { io.disconnect(); warmActive(); return; }
      }, { rootMargin: '700px 0px' });
      io.observe(root);
    }
    /* arm after load, or 3.5s in on slow connections where load waits on third party apps; first paint is never touched */
    var armed = false;
    function armOnce() { if (armed) return; armed = true; armWarm(); }
    if (document.readyState === 'complete') armOnce();
    else { window.addEventListener('load', armOnce, { once: true }); setTimeout(armOnce, 3500); }
    panels.forEach(function (panel, k) {
      var tr = panel.querySelector('[data-nfp-track]');
      if (tr) tr.addEventListener('touchstart', function () { warm(panels[k]); }, { passive: true });
    });
    tabs.forEach(function (t, i) {
      var pre = function () { warm(panels[i], 6); prep(i); };
      t.addEventListener('pointerenter', pre, { passive: true });
      t.addEventListener('focus', pre);
      t.addEventListener('touchstart', pre, { passive: true });
      t.addEventListener('pointerdown', function () { warm(panels[i]); }, { passive: true });
      t.addEventListener('click', function () { warm(panels[i]); });
    });
    if (next) next.addEventListener('pointerenter', function () { warm(panels[cur]); }, { passive: true });

    root.__nfpSelect = function (blockId) {
      for (var k = 0; k < panels.length; k++) if (panels[k].id === 'nfp-panel-' + blockId) select(k, false);
    };
  }

  document.addEventListener('shopify:section:load', function (e) { initAll(e.target); });
  document.addEventListener('shopify:block:select', function (e) {
    var root = e.target && e.target.closest ? e.target.closest('[data-nfp]') : null;
    if (root && root.__nfpSelect && e.detail) root.__nfpSelect(e.detail.blockId);
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { initAll(); });
  else initAll();
})();
