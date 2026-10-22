/* NF-M4 (2026-10-21) mobile UI + speed pass for PREVIEW v4. Loaded (defer) by snippets/nf-mod-global.liquid.
   1. Account sheet: on phones the header account icon opens a MOD-style bottom sheet (snippets/nf-m4-account.liquid)
      instead of jumping to /pages/sign-in (signed out) or Shopify's popover (signed in).
   2. Search panel: drops down under the header (which turns solid), locks the page behind it; Popular chips fill the box
      and show live results.
   3. --nf-anno-h: the announcement bar's real height, for the desktop hero gradient (nf-m4.css section H).
   4. Images: phones start lazy images ~1.6 screens before they scroll into view, so they are already there.
   5. Collection "About": the Common questions column is collapsed together with the write up until View more.
   Every part checks for its own markup and does nothing when it is missing. */
(function () {
  'use strict';
  if (window.__nfM4) return;
  window.__nfM4 = 1;
  var doc = document, root = doc.documentElement;
  var PHONE = window.matchMedia('(max-width: 999px)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* 0. Back/forward, reload and prerendered (instant) pages: no scroll-reveal fade. The reveal script marks cards at the
     top of the page before the browser restores the old scroll position, so they faded/rose in after the restore and the
     page "fidgeted into place" (owner, 2026-10-21). nf-m4.css section L shows them at once. */
  try {
    var nv = (performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || {};
    if (nv.type === 'back_forward' || nv.type === 'reload' || doc.prerendering || nv.activationStart > 0) root.classList.add('nf-nomo');
    if (doc.prerendering) doc.addEventListener('prerenderingchange', function () { root.classList.add('nf-nomo'); }, { once: true });
  } catch (e) {}

  function hdrSolid(on) {
    root.classList.toggle('nf-hdr-solid', !!on);
    if (typeof window.__nfHdrSync === 'function') { try { window.__nfHdrSync(); } catch (e) {} }
  }
  function headerBottom() {
    var h = doc.querySelector('.shopify-section--header x-header.header') || doc.querySelector('.shopify-section--header');
    if (!h) return 64;
    var b = Math.round(h.getBoundingClientRect().bottom);
    return b > 0 ? b : 64;
  }

  /* ---------- 1. Account sheet ---------- */
  var sheet = null, lastFocus = null, closeT = 0;
  function wlCount() {
    var n = 0; try { n = (JSON.parse(localStorage.getItem('nf_wishlist_v1') || '[]') || []).length; } catch (e) {}
    Array.prototype.forEach.call(doc.querySelectorAll('[data-nfas-wl]'), function (b) {
      b.textContent = n ? (n > 99 ? '99+' : String(n)) : '';
      if (n) b.removeAttribute('data-zero'); else b.setAttribute('data-zero', '');
    });
  }
  function openSheet() {
    sheet = sheet || doc.getElementById('nf-acct-sheet');
    if (!sheet) return false;
    clearTimeout(closeT);
    lastFocus = doc.activeElement;
    wlCount();
    sheet.hidden = false;
    root.classList.add('nf-m4-acct');
    void sheet.offsetWidth;
    sheet.classList.add('is-on');
    var p = sheet.querySelector('.nfas__panel');
    setTimeout(function () { try { (sheet.querySelector('.nfas__cta, .nfas__list a') || p).focus({ preventScroll: true }); } catch (e) {} }, 60);
    return true;
  }
  function closeSheet() {
    if (!sheet || sheet.hidden) return;
    sheet.classList.remove('is-on');
    root.classList.remove('nf-m4-acct');
    closeT = setTimeout(function () { sheet.hidden = true; }, reduce.matches ? 0 : 520);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
  }
  function acctTrigger(t) {
    return t && t.closest && t.closest('.shopify-section--header .header__account-link a, .shopify-section--header .header__account-link shopify-account, .shopify-section--header .header__account-link button');
  }
  doc.addEventListener('click', function (e) {
    if (!PHONE.matches) return;
    if (acctTrigger(e.target) && doc.getElementById('nf-acct-sheet')) {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      openSheet();
      return;
    }
    if (sheet && !sheet.hidden && e.target.closest && e.target.closest('[data-nfas-close]')) { e.preventDefault(); closeSheet(); }
  }, true);
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sheet && !sheet.hidden) closeSheet();
    if (e.key === 'Tab' && sheet && !sheet.hidden) {
      var f = sheet.querySelectorAll('a[href], button:not([disabled])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  /* swipe the sheet down to close */
  (function () {
    var y0 = null, dy = 0, panel = null;
    doc.addEventListener('touchstart', function (e) {
      panel = e.target.closest && e.target.closest('.nfas__panel');
      if (!panel || panel.scrollTop > 0) { panel = null; return; }
      y0 = e.touches[0].clientY; dy = 0;
    }, { passive: true });
    doc.addEventListener('touchmove', function (e) {
      if (!panel || y0 === null) return;
      dy = Math.max(0, e.touches[0].clientY - y0);
      panel.style.transition = 'none';
      panel.style.transform = 'translate3d(0,' + dy + 'px,0)';
    }, { passive: true });
    doc.addEventListener('touchend', function () {
      if (!panel) return;
      panel.style.transition = ''; panel.style.transform = '';
      if (dy > 90) closeSheet();
      panel = null; y0 = null; dy = 0;
    }, { passive: true });
  })();
  window.addEventListener('pageshow', function () { if (sheet && !sheet.hidden) { sheet.classList.remove('is-on'); sheet.hidden = true; root.classList.remove('nf-m4-acct'); } });
  doc.addEventListener('nf:wishlist-change', wlCount);

  /* ---------- 2. Search panel ---------- */
  function initSearch() {
    var panel = doc.getElementById('header-search-panel');
    if (!panel || panel.__nfM4) return;
    panel.__nfM4 = 1;
    var input = doc.getElementById('header-search-panel-input');
    var prevTop = null, pinning = false;
    function pin() {
      /* another script writes top:0 !important inline on the panel; while our drop is open it sits under the header */
      var want = headerBottom() + 'px';
      root.style.setProperty('--nf-m4-top', want);
      if (panel.style.getPropertyValue('top') !== want) { pinning = true; panel.style.setProperty('top', want, 'important'); pinning = false; }
    }
    new MutationObserver(function () { if (!pinning && root.classList.contains('nf-m4-srch')) pin(); }).observe(panel, { attributes: true, attributeFilter: ['style'] });
    function sync() {
      var open = panel.classList.contains('is-open') && PHONE.matches;
      if (open) {
        if (prevTop === null) prevTop = panel.style.getPropertyValue('top') || '';
        pin();
        if (!root.classList.contains('nf-m4-srch')) { root.classList.add('nf-m4-srch'); hdrSolid(true); }
        requestAnimationFrame(pin);
        setTimeout(pin, 120);
      } else if (root.classList.contains('nf-m4-srch')) {
        root.classList.remove('nf-m4-srch'); hdrSolid(false);
        if (prevTop !== null) { pinning = true; if (prevTop) panel.style.setProperty('top', prevTop, 'important'); else panel.style.removeProperty('top'); pinning = false; prevTop = null; }
      }
    }
    new MutationObserver(sync).observe(panel, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('resize', function () { if (root.classList.contains('nf-m4-srch')) pin(); }, { passive: true });
    /* Popular chips: put the word in the box and let the live search answer, like MOD */
    panel.addEventListener('click', function (e) {
      var c = e.target.closest && e.target.closest('[data-nf-srch-term]');
      if (!c || !input) return;
      e.preventDefault();
      input.value = c.getAttribute('data-nf-srch-term');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      try { input.focus({ preventScroll: true }); } catch (er) {}
    });
    sync();
  }

  /* ---------- 3. Announcement bar height ---------- */
  function initAnno() {
    var a = doc.querySelector('.shopify-section-group-header-group.shopify-section--custom-liquid');
    if (!a) return;
    function m() { var h = a.getBoundingClientRect().height; if (h > 0) root.style.setProperty('--nf-anno-h', h + 'px'); }
    m();
    if ('ResizeObserver' in window) new ResizeObserver(m).observe(a);
    window.addEventListener('pageshow', m);
    window.addEventListener('load', m);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(m);
  }

  /* ---------- 4. Phones: fetch lazy images well before they scroll in ---------- */
  function initWarm() {
    if (!PHONE.matches || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var im = e.target; io.unobserve(im);
        if (im.loading === 'lazy') { im.loading = 'eager'; }
        if (!im.decoding || im.decoding === 'auto') im.decoding = 'async';
      });
    }, { rootMargin: '0px 0px 1600px 0px' });
    var seen = typeof WeakSet === 'function' ? new WeakSet() : null;
    function scan() {
      var list = doc.querySelectorAll('#main img[loading="lazy"], .shopify-section img[loading="lazy"]');
      for (var i = 0; i < list.length; i++) {
        var im = list[i];
        if (seen) { if (seen.has(im)) continue; seen.add(im); }
        if (im.closest('dialog, cart-drawer, header-sidebar, .mega-menu, [hidden]')) continue;
        io.observe(im);
      }
    }
    scan();
    var t = 0;
    new MutationObserver(function () { clearTimeout(t); t = setTimeout(scan, 250); }).observe(doc.body, { childList: true, subtree: true });
  }

  /* ---------- 5. Collection "About" + "Common questions" collapse ---------- */
  function initStory() {
    Array.prototype.forEach.call(doc.querySelectorAll('nf-collection-story.nfcs'), function (s) {
      if (s.__nfM4) return;
      var faq = s.querySelector('.nfcs__faq'), btn = s.querySelector('[data-nfcs-toggle]');
      if (!btn) return;
      s.__nfM4 = 1;
      if (!faq) return;
      s.classList.add('nfcs--m4');
      var story = s.querySelector('[data-nfcs-story]');
      function teaser() {
        /* the heading plus the first question (and a sliver of the next), faded */
        var t = faq.querySelector('.nfcs__faq-title'), c = faq.querySelectorAll('.nfcs__card');
        var h = (t ? t.offsetHeight + parseFloat(getComputedStyle(t).marginBottom || 0) : 0);
        if (c[0]) h += c[0].offsetHeight + 12;
        if (c[1]) h += Math.min(56, c[1].offsetHeight);
        if (h > 60) s.style.setProperty('--nfcs-m4-faq', Math.round(h) + 'px'), s.style.setProperty('--nfcs-m4-faq-m', Math.round(h) + 'px');
      }
      function setOpen(open) {
        s.classList.toggle('is-m4-open', open);
        if (open) faq.removeAttribute('inert'); else faq.setAttribute('inert', '');
        faq.setAttribute('aria-hidden', open ? 'false' : 'true');
      }
      var ids = (btn.getAttribute('aria-controls') || '').split(/\s+/);
      if (!faq.id) faq.id = (s.id || 'nfcs') + '-faq';
      if (ids.indexOf(faq.id) < 0) btn.setAttribute('aria-controls', ids.concat(faq.id).join(' ').trim());
      /* phones: the questions sit under the write up, so the one control goes under both (it reveals both) */
      if (PHONE.matches && faq.parentNode) { faq.parentNode.insertBefore(btn, faq.nextSibling); btn.classList.add('nfcs__more--below'); }
      teaser();
      setOpen(btn.getAttribute('aria-expanded') === 'true');
      /* a short write up hides the button; with questions to reveal it must stay */
      function keepBtn() { if (btn.hidden && !s.classList.contains('is-m4-open')) btn.hidden = false; }
      keepBtn();
      new MutationObserver(function () {
        keepBtn();
        var open = btn.getAttribute('aria-expanded') === 'true';
        if (open !== s.classList.contains('is-m4-open')) setOpen(open);
      }).observe(btn, { attributes: true, attributeFilter: ['aria-expanded', 'hidden'] });
      if (story && story.classList.contains('is-short')) story.classList.add('is-short');
      window.addEventListener('resize', function () { if (!s.classList.contains('is-m4-open')) teaser(); }, { passive: true });
      if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(teaser);
    });
  }

  /* ---------- 6. Product gallery (round 4, 2026-10-22, after Joe's iPhone report that swiping broke) ----------
     The round 1-3 gallery helpers wrote to the slides while they were being swiped (loading attribute, decode(), src
     re-requests, background placeholders), which on iOS Safari fought the native scroll-snap. All of that is gone.
     What is left never touches the gallery during a touch or a scroll: the listeners below only set a flag, passively.
     When the page is idle, and the shopper is not touching or scrolling the gallery, the slides are switched from lazy
     to eager one at a time, in order (low priority), so by the time they are swiped to they are already loaded. */
  function initGal() {
    Array.prototype.forEach.call(doc.querySelectorAll('product-gallery'), function (g) {
      if (g.__nfGal) return;
      var q = Array.prototype.slice.call(g.querySelectorAll('.product-gallery__media[data-media-type="image"] > img'));
      if (!q.length) return;
      g.__nfGal = 1;
      var busy = false, t = 0, ric = window.requestIdleCallback || function (f) { return setTimeout(f, 200); };
      function calm(ms) { busy = true; clearTimeout(t); t = setTimeout(function () { busy = false; pump(); }, ms); }
      g.addEventListener('touchstart', function () { busy = true; clearTimeout(t); }, { passive: true });
      g.addEventListener('touchend', function () { calm(500); }, { passive: true });
      g.addEventListener('scroll', function () { calm(400); }, { passive: true, capture: true });
      function pump() {
        if (busy) return;
        ric(function () {
          if (busy) return;
          var i;
          while ((i = q.shift()) && (i.loading !== 'lazy' || i.complete)) {}
          if (!i) return;
          try { i.fetchPriority = 'low'; } catch (e) {}
          i.loading = 'eager';
          i.addEventListener('load', pump, { once: true });
          i.addEventListener('error', pump, { once: true });
        }, { timeout: 2000 });
      }
      setTimeout(pump, 1200);
    });
  }

  /* ---------- 9. Reviews (phones, owner 2026-10-22): the first 5 reviews show in full; "Show more" adds the rest ----------
     The reviews script folds every review after the first on phones (is-shut). Its own paging already shows 5 at a time
     with a Show more button, so the reviews it shows are simply kept open. */
  function initReviews() {
    var list = doc.querySelector('#nf-pdp-reviews [data-nf-rv3-list]');
    if (!list || list.__nfM4) return;
    list.__nfM4 = 1;
    function open() { Array.prototype.forEach.call(list.querySelectorAll('.nf-rv3__row'), function (r) { if (!r.__nfOpen) { r.__nfOpen = 1; r.__nfF = 1; r.classList.remove('is-shut'); } }); }
    open();
    new MutationObserver(open).observe(list, { childList: true });
  }

  /* ---------- 7. Phone sheets: menu drawer, Filters, Sort (owner, 2026-10-22, round 3) ----------
     Joe's iPhone still showed the theme's own slides (Web Animations driven by JS, plus a second upward slide on Filters),
     which stutter while the page is busy. On phones the theme's animations on these three panels are replaced by one CSS
     transform transition (nf-m4.css section Q): the panel's animate() becomes a no-op and the open/close controls just
     toggle .nf-m5-on and resolve when the 450ms transition is over, so the theme still hides the panel after it slid out. */
  function initSheets() {
    if (!PHONE.matches || reduce.matches) return;
    root.classList.add('nf-m5');
    var DUR = 470;
    /* NF-M6 (2026-10-22): the menu drawer left this list; it now slides exactly like the cart drawer (nf-m6.js part 2) */
    [['facets-drawer', 'y'], ['facets-sort-popover', 'y']].forEach(function (d) {
      Array.prototype.forEach.call(doc.querySelectorAll(d[0]), function (el) {
        if (el.__nfM5 || typeof el.createEnterAnimationControls !== 'function') return;
        el.__nfM5 = 1;
        el.classList.add('nf-m5-sheet', d[1] === 'x' ? 'nf-m5-x' : 'nf-m5-y');
        if (el.hasAttribute('open')) el.classList.add('nf-m5-on');
        function tame() {
          var sr = el.shadowRoot; if (!sr) return;
          ['content', 'overlay'].forEach(function (n) {
            var pt = sr.querySelector('[part~="' + n + '"]');
            if (!pt || pt.__nfM5) return;
            pt.__nfM5 = 1;
            var orig = pt.animate;
            pt.animate = function (k, o) { return PHONE.matches ? orig.call(pt, [], { duration: 0 }) : orig.call(pt, k, o); };
            pt.style.removeProperty('transform'); pt.style.removeProperty('opacity'); pt.style.removeProperty('translate');
          });
        }
        tame();
        var enter = el.createEnterAnimationControls, leave = el.createLeaveAnimationControls;
        function ctl(open) {
          var done, t = 0, over = false, p = new Promise(function (r) { done = r; });
          function fin() { if (over) return; over = true; clearTimeout(t); done(); }
          if (open) {
            el.classList.remove('nf-m5-on');
            /* the theme has just set display:block: settle the closed position now (style only, no layout) and start the
               slide in this same frame instead of waiting two frames, which on a busy phone cost 200-300ms */
            var cp = el.shadowRoot && el.shadowRoot.querySelector('[part~="content"]');
            if (cp) { void getComputedStyle(cp).transform; el.classList.add('nf-m5-on'); t = setTimeout(fin, DUR); }
            else requestAnimationFrame(function () { requestAnimationFrame(function () { if (!over) el.classList.add('nf-m5-on'); t = setTimeout(fin, DUR); }); });
          } else { el.classList.remove('nf-m5-on'); t = setTimeout(fin, DUR); }
          return { finished: p, then: function (a, b) { return p.then(a, b); }, finish: function () { if (open) el.classList.add('nf-m5-on'); fin(); }, cancel: fin, stop: function () {}, complete: function () { fin(); } };
        }
        el.createEnterAnimationControls = function () { if (!PHONE.matches) return enter.apply(el, arguments); tame(); return ctl(true); };
        el.createLeaveAnimationControls = function () { if (!PHONE.matches) return leave.apply(el, arguments); return ctl(false); };
      });
    });
  }

  /* ---------- 8. Room Sets page: one row of filters instead of "Space" + "Style" rows with two "All" pills (owner, 2026-10-21) ---------- */
  function initRsf() {
    var nav = doc.querySelector('.nf-rsf[data-nf-rsf]');
    if (!nav || nav.__nfM4) return;
    var rows = nav.querySelectorAll('.nf-rsf__row');
    if (rows.length < 2) return;
    nav.__nfM4 = 1;
    var first = rows[0].querySelector('.nf-rsf__pills');
    if (!first) return;
    for (var r = 1; r < rows.length; r++) {
      var ul = rows[r].querySelector('.nf-rsf__pills');
      if (!ul) continue;
      var sep = doc.createElement('li'); sep.className = 'nf-rsf__sep'; sep.setAttribute('aria-hidden', 'true'); first.appendChild(sep);
      Array.prototype.slice.call(ul.children).forEach(function (li, i) { if (i === 0) return; first.appendChild(li); });
      rows[r].parentNode.removeChild(rows[r]);
    }
    rows[0].removeAttribute('aria-labelledby'); rows[0].setAttribute('aria-label', 'Filter room sets');
    nav.classList.add('nf-rsf--one');
    var allA = first.querySelector('li:first-child .nf-rsf__pill');
    if (allA && first.querySelector('li:not(:first-child) .nf-rsf__pill.is-on')) { allA.classList.remove('is-on'); allA.removeAttribute('aria-current'); }
    var on = first.querySelector('.nf-rsf__pill.is-on');
    if (on && on.parentNode !== first.firstElementChild) { try { first.scrollLeft = Math.max(0, on.parentNode.offsetLeft - 16); } catch (e) {} }
  }

  /* the sheet is printed inside the header group, whose transparent-header rules paint every link white: move it to <body> */
  function moveSheet() { var sh = doc.getElementById('nf-acct-sheet'); if (sh && sh.parentElement !== doc.body) doc.body.appendChild(sh); }
  function boot() { moveSheet(); initSearch(); initAnno(); initStory(); wlCount(); initRsf(); initSheets(); initReviews(); }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot); else boot();
  if (doc.readyState === 'complete') initWarm(); else window.addEventListener('load', initWarm, { once: true });
  if (doc.readyState === 'complete') initGal(); else window.addEventListener('load', initGal, { once: true });
  doc.addEventListener('shopify:section:load', boot);
  /* panels re-rendered by filtering are new elements: take them over on the touch that opens them */
  window.addEventListener('load', initSheets);
  doc.addEventListener('pointerdown', initSheets, { capture: true, passive: true });
})();
