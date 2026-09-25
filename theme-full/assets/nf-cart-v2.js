/* NF-CART-V2 (2026-09-12)
   1. "Pairs well with" cards in the cart drawer and on the cart page. Fetched ONLY when the drawer opens (or the
      cart page loads) from Shopify's product recommendations API: intent=complementary first, then intent=related to
      fill up to 3. Rendered by sections/nf-cart-pairs.liquid, which skips items already in the cart.
   2. Gold progress line: plays a short fill when the cart goes from 1 item to 2 or more.
   3. Cart drawer empty lamp: adds .nf-cv2-lit when the drawer opens (CSS also keys off [open]).
   4. Product sticky bar: one warm glow on the thumbnail the first time the bar appears.
   Styles: assets/nf-cart-v2.css. */
(function () {
  'use strict';
  if (window.__nfCv2Loaded) return;
  window.__nfCv2Loaded = true;

  var ROOT = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
  var MAX = 4; /* 4 fills a 2 x 2 photo grid (09-25) */
  var listCache = {};   // url -> Promise<Element|null>
  var boxCache = {};    // productId|cartKey -> Array<Element>

  function fetchList(pid, intent) {
    var url = ROOT + 'recommendations/products?product_id=' + encodeURIComponent(pid) + '&limit=8&intent=' + intent + '&section_id=nf-cart-pairs';
    if (!listCache[url]) {
      listCache[url] = fetch(url, { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.text() : ''; })
        .then(function (html) {
          var d = document.createElement('div');
          d.innerHTML = html;
          return d.querySelector('.nf-cv2-pairs__list');
        })
        .catch(function () { return null; });
    }
    return listCache[url];
  }

  function cardsOf(list) { return list ? Array.prototype.slice.call(list.querySelectorAll('.nf-cv2-card')) : []; }
  function keyOf(card) { var a = card.querySelector('.nf-cv2-card__title'); return a ? a.getAttribute('href').split('?')[0] : Math.random(); }

  function getCards(pid, cartKey) {
    var k = pid + '|' + cartKey;
    if (boxCache[k]) return Promise.resolve(boxCache[k]);
    // Cache per cart contents: the section excludes what is already in the cart at fetch time.
    listCache = {};
    return fetchList(pid, 'complementary').then(function (comp) {
      var picked = cardsOf(comp);
      if (picked.length >= MAX) return picked.slice(0, MAX);
      return fetchList(pid, 'related').then(function (rel) {
        var seen = {};
        picked.forEach(function (c) { seen[keyOf(c)] = 1; });
        cardsOf(rel).forEach(function (c) { var kk = keyOf(c); if (!seen[kk] && picked.length < MAX) { seen[kk] = 1; picked.push(c); } });
        return picked;
      });
    }).then(function (cards) { boxCache[k] = cards; return cards; });
  }

  function fill(box, suffix) {
    if (!box || box.getAttribute('data-nf-cv2-state')) return;
    var pid = box.getAttribute('data-product-id');
    var slot = box.querySelector('.nf-cv2-pairs__slot');
    if (!pid || !slot) return;
    box.setAttribute('data-nf-cv2-state', 'loading');
    getCards(pid, box.getAttribute('data-cart-key') || '').then(function (cards) {
      if (!box.isConnected) return;
      slot.innerHTML = '';
      cards.forEach(function (c) {
        var n = c.cloneNode(true);
        // Unique quick buy modal ids per context (drawer and cart page can both be in the DOM)
        var m = n.querySelector('quick-buy-modal');
        var b = n.querySelector('[aria-controls^="nf-cv2-qb-"]');
        if (m && b) { m.id = m.id + '-' + suffix; b.setAttribute('aria-controls', m.id); }
        slot.appendChild(n);
      });
      box.setAttribute('data-nf-cv2-state', cards.length ? 'done' : 'empty');
      box.hidden = !cards.length;
    });
  }

  // Progress line: animate the fill only on the step from 1 item to 2+
  function progress(scope) {
    var el = scope && scope.querySelector('.nf-cv2-progress');
    if (!el) return;
    var now = parseInt(el.getAttribute('data-nf-cv2-count') || '0', 10);
    var last = null;
    try { last = sessionStorage.getItem('nfCv2Count'); } catch (e) {}
    if (el.classList.contains('is-done') && last !== null && parseInt(last, 10) < 2 && !el.getAttribute('data-nf-cv2-anim')) {
      el.setAttribute('data-nf-cv2-anim', '1');
      el.classList.add('is-filling');
    }
    try { sessionStorage.setItem('nfCv2Count', String(now)); } catch (e) {}
  }

  // ---------- Cart drawer ----------
  function drawer() { return document.getElementById('cart-drawer'); }
  function drawerOpen(d) { return !!d && (d.hasAttribute('open') || d.classList.contains('nf-cv2-lit')); }

  var pending = false;
  function checkDrawer() {
    if (pending) return;
    pending = true;
    // setTimeout, not requestAnimationFrame: rAF never fires in a background tab, which left "pending" stuck
    setTimeout(function () {
      pending = false;
      var d = drawer();
      if (!d) return;
      if (d.hasAttribute('open')) d.classList.add('nf-cv2-lit'); else d.classList.remove('nf-cv2-lit');
      progress(d);
      if (drawerOpen(d)) fill(d.querySelector('[data-nf-cv2-pairs]'), 'd');
    }, 30);
  }

  function watchDrawer() {
    var d = drawer();
    if (!d) return;
    var host = d.closest('.shopify-section') || d.parentNode;
    // Attribute changes (open) and re-renders of the drawer content both land here
    new MutationObserver(checkDrawer).observe(host, { attributes: true, attributeFilter: ['open'], childList: true, subtree: true });
    checkDrawer();
  }

  // ---------- Cart page ----------
  function watchCartPage() {
    var page = document.querySelector('.nf-cv2-cartpage');
    if (!page) return;
    var host = page.closest('.shopify-section') || page.parentNode;
    var run = function () {
      var p = document.querySelector('.nf-cv2-cartpage');
      if (!p) return;
      progress(p);
      fill(p.querySelector('[data-nf-cv2-pairs]'), 'p');
    };
    new MutationObserver(function () { setTimeout(run, 30); }).observe(host, { childList: true, subtree: true });
    run();
  }

  // ---------- Sticky bar thumbnail glow, once ----------
  function watchSticky() {
    var wrap = document.querySelector('product-rerender[id$="-sticky-bar"]');
    if (!wrap) return;
    var mo = new MutationObserver(function () {
      var bar = wrap.querySelector('product-sticky-bar');
      if (!bar || !bar.classList.contains('is-visible')) return;
      mo.disconnect();
      var h = document.documentElement;
      h.classList.add('nf-cv2-glow');
      setTimeout(function () { h.classList.remove('nf-cv2-glow'); }, 2000);
    });
    mo.observe(wrap, { attributes: true, attributeFilter: ['class'], subtree: true });
  }

  // ---------- Sticky bar: chosen options follow the variant picker ----------
  document.addEventListener('variant:change', function (e) {
    var v = e && e.detail && e.detail.variant;
    if (!v || !v.title) return;
    var els = document.querySelectorAll('[data-nf-cv2-opts]');
    for (var i = 0; i < els.length; i++) els[i].textContent = String(v.title).split(' / ').join(', ');
    var labels = document.querySelectorAll('[data-nf-combined-label]');
    for (var j = 0; j < labels.length; j++) labels[j].textContent = v.title;
    var sels = document.querySelectorAll('.nf-sb-native');
    for (var k = 0; k < sels.length; k++) {
      if (sels[k].querySelector('option[value="' + v.id + '"]')) sels[k].value = String(v.id);
    }
  });

  // ---------- Sticky bar: native variant select (mobile) ----------
  // The phone's own picker opens on tap. Picking an option checks the matching per-option radios (still the real
  // source of truth) and dispatches change on them, so variant-picker's own listener does everything it normally
  // does (price, cart form, URL, the variant:change broadcast above). Delegated on document, so it keeps working
  // after product-rerender replaces the sticky bar's markup.
  document.addEventListener('change', function (e) {
    var sel = e.target;
    if (!sel || !sel.classList || !sel.classList.contains('nf-sb-native')) return;
    var wrap = sel.closest('.nf-sb-combined');
    var opt = sel.options[sel.selectedIndex];
    if (!wrap || !opt) return;
    var formId = wrap.getAttribute('data-form-id');
    var label = wrap.querySelector('[data-nf-combined-label]');
    if (label) label.textContent = opt.textContent;
    var ids = (opt.getAttribute('data-value-ids') || '').split(',');
    for (var p = 0; p < ids.length; p++) {
      if (!ids[p]) continue;
      var radio = document.querySelector('input[data-option-position="' + (p + 1) + '"][form="' + formId + '"][value="' + ids[p] + '"]');
      if (radio && !radio.checked) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  });

  function init() { watchDrawer(); watchCartPage(); watchSticky(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
