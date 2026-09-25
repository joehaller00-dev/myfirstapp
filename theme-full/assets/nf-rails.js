/* NF-RAILS-V1 (2026-09-22): every left and right rail on the site scrolls smoothly, and its
   images are loaded up front so nothing paints grey while you click through. */
(function () {
  if (window.__nfRails) return; window.__nfRails = 1;
  var d = document;
  function isRail(el) {
    if (!el || el.nodeType !== 1) return false;
    var s = getComputedStyle(el);
    if (s.overflowX !== 'auto' && s.overflowX !== 'scroll') return false;
    return el.scrollWidth - el.clientWidth > 8;
  }
  function tidy(el) {
    if (el.__nfRail) return; el.__nfRail = 1;
    var s = getComputedStyle(el);
    /* mandatory snapping fights a smooth programmatic scroll and makes it look choppy */
    if (/mandatory/.test(s.scrollSnapType)) el.style.scrollSnapType = 'x proximity';
    if (s.scrollBehavior !== 'smooth') el.style.scrollBehavior = 'smooth';
    /* Many sections ask for behavior:'auto' when the device has Reduce Motion on, which turns an arrow click into a
       jump. Upgrade those calls to 'smooth' so they go through NF-SMOOTH-ARROWS (custom-nav.js), which animates them
       and switches scroll snapping off for the duration. Calling the prototype keeps that wrapper in the chain. */
    el.scrollBy = function (o) {
      if (o && typeof o === 'object' && o.behavior !== 'smooth') { o = { left: o.left, top: o.top, behavior: 'smooth' }; }
      return Element.prototype.scrollBy.call(this, o);
    };
    el.scrollTo = function (o) {
      if (o && typeof o === 'object' && o.behavior !== 'smooth') { o = { left: o.left, top: o.top, behavior: 'smooth' }; }
      return Element.prototype.scrollTo.call(this, o);
    };
    eager(el);
  }
  function eager(root) {
    /* NF-DEFERIMG (2026-09-24): never wake images inside a panel nobody has opened. The top bar
       dropdowns are display:none and hold about 50 photos; pulling them in here undid the deferral
       in snippets/nf-topbar-img.liquid and cost most of the homepage image weight before first paint. */
    if (!root.getClientRects || !root.getClientRects().length) return;
    if (root.closest && root.closest('.nf-tbp, .nf-sb2, .nf-pr2, [class*="nf-topbar"]')) return;
    var imgs = root.querySelectorAll('img[loading="lazy"], img[data-nfd-src]');
    for (var i = 0; i < imgs.length; i++) {
      var im = imgs[i];
      if (im.getAttribute('data-nfd-src') && !im.getAttribute('src')) im.setAttribute('src', im.getAttribute('data-nfd-src'));
      im.loading = 'eager';
      if (!im.getAttribute('fetchpriority')) im.setAttribute('fetchpriority', 'low');
      if (im.decode) { try { im.decode().catch(function () {}); } catch (e) {} }
    }
  }
  function sweep() {
    var all = d.querySelectorAll('[class*="rail"], [class*="carousel"], [class*="slider"], [class*="scroller"], [class*="__row"], [class*="-row"], ul, div');
    for (var i = 0; i < all.length; i++) if (isRail(all[i])) tidy(all[i]);
  }
  function run() {
    sweep();
    /* a second pass once sections further down have rendered */
    setTimeout(sweep, 1200);
    setTimeout(sweep, 3000);
  }
  /* Smooth arrow glides are handled by NF-SMOOTH-ARROWS in custom-nav.js, which turns scroll snapping off
     while it animates. That is what keeps the homepage rails buttery, so we do not animate here. */
  if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 1500 }); else setTimeout(run, 600);
  /* the rails are set up at idle; run once early too so the first arrow click is already smooth */
  setTimeout(sweep, 200);
  /* any rail that appears later (tab switch, quick view) gets the same treatment on first touch */
  d.addEventListener('pointerdown', function (e) {
    var el = e.target && e.target.closest && e.target.closest('[class*="rail"], [class*="carousel"], [class*="slider"]');
    if (el) { if (isRail(el)) tidy(el); else sweep(); }
  }, { passive: true });
})();
