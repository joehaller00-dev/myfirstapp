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

/* 2. Menu drawer (phones, owner 2026-10-22: "the menu needs the exact same pop out animation as the cart, I love the cart").
      The menu now uses the cart drawer's own motion from sections/cart-drawer.liquid (Web Animations on the compositor):
      overlay fades in over 320ms, the panel slides 500ms on cubic-bezier(.455,.03,.515,.955); closing is 300ms. Mirrored
      from the left. nf-m4.js part 7 no longer takes this drawer over.
      The theme also hid the menu's rows until the slide had finished and then faded them in one by one (HeaderSidebar
      revealItems on dialog:after-show), so the items felt late. html.nf-m6-mopen (nf-m6.css H) keeps the first level
      visible while it slides in; it is dropped the moment a category is opened, so the theme's panel switch is untouched.
      The first level's photos are preloaded on idle by nf-drawer-v2.js (NF-MENU-SPEED). */
(function () {
  'use strict';
  if (window.__nfM6Menu) return;
  window.__nfM6Menu = 1;
  var doc = document, root = doc.documentElement;
  var PHONE = window.matchMedia('(max-width: 999px)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var EASE = 'cubic-bezier(.455,.03,.515,.955)';
  function ctl(list) {
    return {
      finished: Promise.all(list.map(function (a) { return a.finished; })).then(function () {}, function () {}),
      finish: function () { list.forEach(function (a) { try { a.finish(); } catch (e) {} }); },
      cancel: function () { list.forEach(function (a) { try { a.cancel(); } catch (e) {} }); }
    };
  }
  function from() { return 'translateX(calc(var(--transform-logical-flip, 1) * -100%))'; }

  customElements.whenDefined('header-sidebar').then(function () {
    var el = doc.getElementById('sidebar-menu');
    if (!el || el.__nfM6) return;
    el.__nfM6 = 1;
    var origIn = el.createEnterAnimationControls, origOut = el.createLeaveAnimationControls, anim = null;
    function parts() { return [el.getShadowPartByName && el.getShadowPartByName('overlay'), el.getShadowPartByName && el.getShadowPartByName('content')]; }
    el.createEnterAnimationControls = function () {
      var p = parts();
      if (!PHONE.matches || reduce.matches || !p[0] || !p[1] || !p[1].animate) return origIn.apply(el, arguments);
      if (anim) anim.cancel();
      p[1].style.marginInlineStart = '0';
      return (anim = ctl([
        p[0].animate({ opacity: [0, 1] }, { duration: 320, easing: EASE, fill: 'both' }),
        p[1].animate({ transform: [from(), 'translate(0, 0)'] }, { duration: 500, easing: EASE, fill: 'both' })
      ]));
    };
    el.createLeaveAnimationControls = function () {
      var p = parts();
      if (!PHONE.matches || reduce.matches || !p[0] || !p[1] || !p[1].animate) return origOut.apply(el, arguments);
      if (anim) anim.cancel();
      return (anim = ctl([
        p[0].animate({ opacity: [1, 0] }, { duration: 300, easing: EASE, fill: 'both' }),
        p[1].animate({ transform: ['translate(0, 0)', from()] }, { duration: 300, easing: EASE, fill: 'both' })
      ]));
    };
    /* rows visible during the slide */
    el.addEventListener('dialog:before-show', function () { if (PHONE.matches) root.classList.add('nf-m6-mopen'); });
    el.addEventListener('dialog:after-hide', function () { root.classList.remove('nf-m6-mopen'); });
    el.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.header-sidebar__main-panel [aria-controls], .nfd-tile[data-nfd-open]')) root.classList.remove('nf-m6-mopen');
    }, true);
  });

})();

/* 3. Phone search: one full screen MOD-style page (owner 2026-10-22: "it doesn't go all the way down ... you're still able
      to scroll behind on the actual page, it's really confusing"). Three older scripts each ran part of the phone panel
      (custom-nav.js NF MOBILE SEARCH PANEL, nf-m4.js part 2, the nf-search-panel-align script in theme.liquid): they docked
      it under the header with an inline top:<px>!important, sized it to the screen minus the header, and locked the page
      only with overflow:hidden plus a touch guard that let touches on the panel's own search row through, so iOS scrolled
      the page behind it. custom-nav.js also only loads after the window load event, so an early tap had no lock at all.
      On phones the panel now lives directly in <body> (no header styles or transforms around it), covers the whole screen
      (nf-m6.css I), and the page behind is frozen with position:fixed and put back exactly where it was on close.
      Its inline 'top' is ignored on phones, so the older docking code can no longer pull it under the header. */
(function () {
  'use strict';
  if (window.__nfM6Srch) return;
  window.__nfM6Srch = 1;
  var doc = document, root = doc.documentElement;
  var PHONE = window.matchMedia('(max-width: 999px)');
  var panel = null, y = 0, locked = false;

  function own() {
    panel = panel || doc.getElementById('header-search-panel');
    if (!panel || panel.__nfM6) return panel;
    panel.__nfM6 = 1;
    var st = panel.style, set = st.setProperty;
    st.setProperty = function (prop, val, pri) {
      if (prop === 'top' && PHONE.matches) return;
      return set.call(st, prop, val, pri);
    };
    if (PHONE.matches) st.removeProperty('top');
    if (PHONE.matches && panel.parentNode !== doc.body) doc.body.appendChild(panel);
    new MutationObserver(sync).observe(panel, { attributes: true, attributeFilter: ['class'] });
    return panel;
  }
  function lock() {
    if (locked) return;
    locked = true;
    y = window.pageYOffset || root.scrollTop || 0;
    var b = doc.body.style;
    b.position = 'fixed'; b.top = (-y) + 'px'; b.left = '0'; b.right = '0'; b.width = '100%';
    root.classList.add('nf-m6-srch');
  }
  function unlock() {
    if (!locked) return;
    locked = false;
    var b = doc.body.style;
    b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = '';
    root.classList.remove('nf-m6-srch');
    var sb = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, y);
    root.style.scrollBehavior = sb;
  }
  function sync() {
    if (!panel) return;
    var open = panel.classList.contains('is-open') && PHONE.matches;
    if (open) { panel.style.removeProperty('top'); lock(); fit(); } else unlock();
  }
  /* MOD: the search icon opens the page and the keyboard in the same tap. iOS only raises the keyboard for a focus()
     made inside the tap itself, so the panel is opened here (document capture, before the theme's own toggle handler,
     which focused the input before the panel was laid out full screen) and the input is focused at once. */
  doc.addEventListener('click', function (e) {
    if (!PHONE.matches || !e.target.closest || !e.target.closest('.header__search-toggle') || !own()) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (panel.classList.contains('is-open')) { var c = panel.querySelector('.header-search-panel__close'); if (c) c.click(); return; }
    lock();
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    fit();
    var inp = doc.getElementById('header-search-panel-input');
    if (inp) { try { inp.focus({ preventScroll: true }); } catch (er) { inp.focus(); } }
  }, true);

  /* MOD: while typing, the page shrinks to the space above the keyboard, so the bottom button sits right on top of it and
     nothing of the store shows. The panel follows the visible viewport (visualViewport) while it is open. */
  var vv = window.visualViewport;
  function fit() {
    if (!panel || !vv || !locked) return;
    /* the panel's cream reaches the very bottom of the screen (behind Safari's floating address bar and the keyboard), and
       its content (search row, list, bottom button) ends where the visible area ends, just above the address bar */
    var H = Math.max(window.innerHeight || 0, root.clientHeight || 0, (window.screen && screen.height) || 0);
    panel.style.setProperty('--nf-vvt', Math.round(vv.offsetTop) + 'px');
    panel.style.setProperty('--nf-ph', H + 'px');
    panel.style.setProperty('--nf-kb', Math.max(0, Math.round(H - vv.height)) + 'px');
  }
  if (vv) { vv.addEventListener('resize', fit); vv.addEventListener('scroll', fit); }

  /* one bottom button for the whole search page: Shop All Lighting while the box is empty, View all results while typing */
  var foot = null, footA = null;
  function footer() {
    if (foot || !panel) return;
    foot = doc.createElement('div'); foot.className = 'nf-m6-sfoot';
    footA = doc.createElement('a'); footA.className = 'nf-m6-sfoot__btn';
    foot.appendChild(footA); panel.appendChild(foot);
    var inp = doc.getElementById('header-search-panel-input');
    function label() {
      var q = inp ? inp.value.trim() : '';
      if (q) { footA.textContent = 'View all results'; footA.href = '/search?q=' + encodeURIComponent(q) + '&options%5Bprefix%5D=last'; }
      else { footA.textContent = 'Shop All Lighting'; footA.href = '/collections/lighting'; }
    }
    if (inp) inp.addEventListener('input', label);
    label();
  }
  function boot() { if (own()) { if (PHONE.matches) footer(); sync(); } }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot); else boot();
  /* a tap on the search icon before this ran: take the panel over first */
  doc.addEventListener('pointerdown', function (e) {
    if (PHONE.matches && e.target.closest && e.target.closest('.header__search-toggle')) own();
  }, { capture: true, passive: true });
  window.addEventListener('pageshow', function () { if (panel && !panel.classList.contains('is-open')) unlock(); });
})();
