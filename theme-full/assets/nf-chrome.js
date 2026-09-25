/* NF-CHROME-V1 (2026-09-12) : behaviour for assets/nf-chrome.css.
   1. Footer lamp : one IntersectionObserver switches the pendant on when the footer scrolls into view.
                    No observer or reduced motion: the lamp simply stays lit (the CSS default).
   2. 10% pill    : the gold dot pulses twice the first time the pill shows in a session, then stays still.
                    The pill also answers Enter and Space, like the button it is.
   NF-PILL-HIDE (2026-09-12, coordinator QA): the folded dot still sat on the footer's "Sign up to our newsletter" text.
   While the footer is in view, or when even the folded 36px dot would cover text, a link or a field, the pill gets
   .nfc-gone and fades out entirely (nf-chrome.css); it comes back once the spot has been clear for 350ms. A pill that
   has keyboard focus always stays visible. */
(function () {
  'use strict';
  var root = document.documentElement;

  /* 1. footer lamp */
  function lamp() {
    var foot = document.querySelector('.nf-footer');
    if (!foot || !foot.querySelector('.nfc-lamp')) { return; }
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm || !('IntersectionObserver' in window)) { return; }
    foot.classList.add('nfc-armed');
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          foot.classList.add('nfc-lit');
          io.disconnect();
          return;
        }
      }
    }, { threshold: 0.18 });
    io.observe(foot);
  }

  /* 2. the pill */
  function pill() {
    /* NF-PILL-ALWAYS (2026-09-13, owner reversed NF-PILL-HIDE): the 10% pill is ALWAYS visible at the bottom left, on every
       page and device. The old dodge (nfc-gone over the footer, nfc-mini fold) and the phone scroll away (nf-nl-away) are
       retired. The pill only rises, with a transform, above bars pinned to the bottom of the screen (lift below). */
    var tab = document.getElementById('nf-nl-tab');
    if (!tab) { return; }
    var seen = false;
    try { seen = sessionStorage.getItem('nfc_pill_pulsed') === '1'; } catch (e) {}
    if (seen) { root.classList.add('nfc-pill-calm'); } else {
      var dot = tab.querySelector('.nf-nl-tab__dot');
      if (dot) {
        dot.addEventListener('animationend', function () {
          root.classList.add('nfc-pill-calm');
          try { sessionStorage.setItem('nfc_pill_pulsed', '1'); } catch (e) {}
        });
      }
    }
    if (!tab.hasAttribute('tabindex')) { tab.setAttribute('tabindex', '0'); }
    if (!tab.hasAttribute('role')) { tab.setAttribute('role', 'button'); }
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); tab.click(); }
    });
    tab.classList.remove('nfc-gone', 'nfc-mini', 'nf-nl-away');
    var ov = document.getElementById('nf-nl-overlay');
    if (!ov || !ov.classList.contains('open')) { tab.classList.add('visible'); }
    root.classList.add('nfc-pill-on');
    lift(tab);
  }

  /* NF-PILL-ALWAYS: rise above anything pinned to the bottom that shares the pill's column (the /cart phone checkout bar,
     a bottom product sticky bar, the cookie banner). Reads layout once per frame at most; writes one CSS variable. */
  function lift(tab) {
    var SEL = '.nfcp-mbar, product-sticky-bar, .product-sticky-bar, privacy-banner, .privacy-banner, [data-nfc-bottom-bar]';
    var cur = -1, queued = false;
    function measure() {
      queued = false;
      if (!document.querySelector(SEL)) { if (cur !== 0) { cur = 0; tab.style.setProperty('--nfc-lift', '0px'); } return; } /* NF-SMOOTH-V1: no bottom bar on this page, skip the layout read */
      var vh = window.innerHeight, r = tab.getBoundingClientRect();
      if (!r.width) { return; }
      var base = r.bottom + (cur > 0 ? cur : 0), up = 0, els = document.querySelectorAll(SEL);
      for (var i = 0; i < els.length; i++) {
        var el = els[i], cs = window.getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) { continue; }
        if (cs.position !== 'fixed' && cs.position !== 'sticky') { continue; }
        var b = el.getBoundingClientRect();
        if (b.width < 2 || b.height < 2 || b.top < vh * 0.45 || b.top >= vh) { continue; }
        if (b.right <= r.left || b.left >= r.right) { continue; }
        if (b.top < base + 10) { up = Math.max(up, base - b.top + 12); }
      }
      up = Math.round(up);
      if (up !== cur) { cur = up; tab.style.setProperty('--nfc-lift', up + 'px'); }
    }
    function queue() { if (!queued) { queued = true; window.requestAnimationFrame(measure); } }
    /* NF-SMOOTH-V1: measure once the scroll settles, not every scroll frame (it reads layout for every bottom bar) */
    var scrollT = 0;
    window.addEventListener('scroll', function () { clearTimeout(scrollT); scrollT = setTimeout(queue, 120); }, { passive: true });
    window.addEventListener('resize', queue);
    if ('MutationObserver' in window) {
      new MutationObserver(queue).observe(root, { attributes: true, attributeFilter: ['class'] });
    }
    setInterval(function () { if (!document.hidden) { queue(); } }, 700);
    queue();
  }

  function run() { lamp(); pill(); }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); }
})();
/* /NF-CHROME-V1 */
