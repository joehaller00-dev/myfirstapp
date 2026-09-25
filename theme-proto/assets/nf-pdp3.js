/* NF-PDP3-V1 (2026-09-25) product page redesign behaviours. Styles in assets/nf-pdp3.css.
   1. gallery: the "n / total" counter and the end state of the arrows (the arrows themselves are the theme's
      carousel-prev-button / carousel-next-button, see snippets/product-gallery.liquid)
   2. Bundle & Save cards (snippets/nf-bundle-tiers.liquid): picking a card sets the add to cart quantity; prices
      follow the selected variant. Prestige re-renders the info column on every option change (the quantity resets to
      1 and the cards come back unselected), so the choice is kept here and put back after each re-render.
   3. "Why customers love us" carousel (sections/nf-pdp-story.liquid): arrows, one dot per page, native snap scroll.
   No class is put on <html> or <body>. */
(function () {
  'use strict';
  if (window.__nfPdp3) return; window.__nfPdp3 = 1;
  var d = document;
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || d).querySelectorAll(s)); }
  var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
  function money(c) { return '$' + (Math.round(c) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  /* ------------------------------------------------------------------ 1. gallery arrows and counter
     The template uses the theme's "carousel, thumbnails bottom" layout; this adds a left and right arrow (the theme's
     own carousel-prev-button / carousel-next-button elements, so they drive its scroll-carousel) and an
     "n / total" counter on top of the main image, and asks for sharper square thumbnails. */
  var ARL = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
  var ARR = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
  function gallery() {
    if (!$('[data-nf3]')) return;
    $$('.shopify-section--main-product product-gallery').forEach(function (gal) {
      var list = $('.product-gallery__image-list', gal), car = list && $('scroll-carousel', list);
      if (!car || car._nf3) return;
      car._nf3 = 1;
      $$('.product-gallery__thumbnail img', gal).forEach(function (im) { im.sizes = '96px'; });
      if ($$('.product-gallery__media', car).length < 2) return;
      list.classList.add('nf3-stage');
      $$('.nf3-ui', list).forEach(function (n) { n.remove(); });
      var id = car.id;
      var ui = d.createElement('div');
      ui.className = 'nf3-ui contents';
      ui.innerHTML =
        '<carousel-prev-button aria-controls="' + id + '" class="contents"><button type="button" class="nf3-arrow nf3-arrow--prev"><span class="sr-only">Previous image</span>' + ARL + '</button></carousel-prev-button>' +
        '<carousel-next-button aria-controls="' + id + '" class="contents"><button type="button" class="nf3-arrow nf3-arrow--next"><span class="sr-only">Next image</span>' + ARR + '</button></carousel-next-button>' +
        '<span class="nf3-count" aria-hidden="true"><b data-nf3-i>1</b> / <span data-nf3-n></span></span>';
      list.appendChild(ui);
      var iEl = $('[data-nf3-i]', ui), nEl = $('[data-nf3-n]', ui);
      var prev = $('.nf3-arrow--prev', ui), next = $('.nf3-arrow--next', ui);
      function upd() {
        var slides = $$('.product-gallery__media', car).filter(function (m) { return !m.hidden; });
        if (!slides.length) return;
        var left = car.getBoundingClientRect().left, best = 0, dist = Infinity;
        slides.forEach(function (m, i) {
          var dd = Math.abs(m.getBoundingClientRect().left - left);
          if (dd < dist) { dist = dd; best = i; }
        });
        iEl.textContent = best + 1;
        nEl.textContent = slides.length;
        prev.classList.toggle('is-end', best === 0);
        next.classList.toggle('is-end', best === slides.length - 1);
      }
      var q = 0;
      car.addEventListener('scroll', function () { if (!q) { q = 1; raf(function () { q = 0; upd(); }); } }, { passive: true });
      window.addEventListener('resize', upd);
      upd(); setTimeout(upd, 400);
    });
  }

  /* ------------------------------------------------------------------ 2. Bundle & Save */
  var st = { n: 1, q3: 3 };
  var MAX3 = 20;
  function mainForm() { return $('form[id^="product-form-main"]'); }
  function qtyInputs() {
    var f = mainForm(); if (!f) return [];
    return $$('input[name="quantity"]').filter(function (i) { return i.form === f || i.getAttribute('form') === f.id; });
  }
  function wantQty() { return st.n === 3 ? st.q3 : st.n; }
  function setQty(n) {
    qtyInputs().forEach(function (inp) {
      if (String(inp.value) === String(n)) return;
      inp.value = n;
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
  function variants(root) {
    if (root._v) return root._v;
    try { root._v = JSON.parse(($('[data-nf-bt-variants]', root) || {}).textContent || '[]'); } catch (e) { root._v = []; }
    return root._v;
  }
  function current(root) {
    var f = mainForm(), idEl = f && f.querySelector('[name="id"]');
    var id = idEl ? +idEl.value : 0, list = variants(root);
    return list.filter(function (v) { return v.id === id; })[0] || list[0] || null;
  }
  function paint(root) {
    var v = current(root); if (!v) return;
    var p2 = +root.getAttribute('data-pct2') || 0, p3 = +root.getAttribute('data-pct3') || p2;
    $$('.nf-bt__opt', root).forEach(function (o) {
      var tier = +o.getAttribute('data-n'), n = tier === 3 ? st.q3 : tier;
      var pct = tier === 1 ? 0 : (tier === 2 ? p2 : p3);
      var full = v.price * n, save = Math.floor(full * pct / 100), now = full - save;   /* round the saving DOWN, like Shopify */
      var on = tier === st.n;
      o.classList.toggle('is-on', on);
      o.setAttribute('aria-checked', on ? 'true' : 'false');
      o.tabIndex = on ? 0 : -1;
      var a = $('[data-now]', o), b = $('[data-was]', o), c = $('[data-save]', o);
      if (a) a.textContent = money(now);
      if (b) b.textContent = tier === 1 ? '' : money(full);
      if (c) c.textContent = save > 0 ? 'You save ' + money(save) : '';
      if (tier === 3) {
        var stp = $('[data-step]', o), val = $('[data-step-val]', o);
        if (stp) stp.hidden = !on;
        if (val) val.textContent = st.q3;
        $$('[data-step-dir]', o).forEach(function (btn) {
          var dir = +btn.getAttribute('data-step-dir');
          btn.disabled = dir < 0 ? st.q3 <= 3 : st.q3 >= MAX3;
        });
      }
      if (v.img && root._img !== v.img) $$('.nf-bt__img', o).forEach(function (im) {
        im.removeAttribute('srcset'); im.src = v.img.indexOf('//') === 0 ? 'https:' + v.img : v.img;
      });
    });
    if (v.img) root._img = v.img;
  }
  function choose(n) {
    st.n = n;
    var root = $('[data-nf-bt]');
    if (root) paint(root);
    setQty(wantQty());
  }
  function tiers() {
    var root = $('[data-nf-bt]');
    if (!root) return;
    if (!root._nf3) {
      root._nf3 = 1;
      root.addEventListener('click', function (e) {
        var sb = e.target.closest('[data-step-dir]');
        if (sb) {
          e.preventDefault(); e.stopPropagation();
          st.q3 = Math.max(3, Math.min(MAX3, st.q3 + +sb.getAttribute('data-step-dir')));
          choose(3); return;
        }
        var o = e.target.closest('.nf-bt__opt');
        if (o) choose(+o.getAttribute('data-n'));
      });
      root.addEventListener('keydown', function (e) {
        var o = e.target.closest && e.target.closest('.nf-bt__opt'); if (!o) return;
        var n = +o.getAttribute('data-n'), to = 0;
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); choose(n); return; }
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = n === 3 ? 1 : n + 1;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = n === 1 ? 3 : n - 1;
        if (to) { e.preventDefault(); choose(to); var t = $('.nf-bt__opt[data-n="' + to + '"]', root); if (t) t.focus(); }
      });
    }
    paint(root);
    setQty(wantQty());
  }

  /* ------------------------------------------------------------------ 3. reviews carousel */
  function loves() {
    $$('[data-nf-lv]').forEach(function (box) {
      if (box._nf3) return; box._nf3 = 1;
      var tr = $('[data-nf-lv-track]', box), dots = $('[data-nf-lv-dots]', box), nav = $('.nf-lv__nav', box);
      if (!tr) return;
      function pages() { return Math.max(1, Math.ceil((tr.scrollWidth - 4) / Math.max(1, tr.clientWidth))); }
      function page() { return Math.min(pages() - 1, Math.round(tr.scrollLeft / Math.max(1, tr.clientWidth))); }
      function build() {
        var n = pages();
        nav.hidden = n < 2;
        if (dots.children.length !== n) {
          dots.innerHTML = '';
          for (var i = 0; i < n; i++) {
            var b = d.createElement('button');
            b.type = 'button'; b.className = 'nf-lv__dot';
            b.setAttribute('aria-label', 'Reviews page ' + (i + 1));
            b.setAttribute('data-p', i);
            dots.appendChild(b);
          }
        }
        upd();
      }
      function upd() {
        var p = page(), n = pages();
        $$('.nf-lv__dot', dots).forEach(function (b, i) { b.setAttribute('aria-current', i === p ? 'true' : 'false'); });
        $$('.nf-lv__arr', box).forEach(function (b) {
          var dir = +b.getAttribute('data-dir');
          b.disabled = dir < 0 ? p === 0 && tr.scrollLeft < 4 : p >= n - 1 || tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4;
        });
      }
      box.addEventListener('click', function (e) {
        var a = e.target.closest('.nf-lv__arr'), dt = e.target.closest('.nf-lv__dot');
        if (a) tr.scrollBy({ left: +a.getAttribute('data-dir') * tr.clientWidth, behavior: 'smooth' });
        if (dt) tr.scrollTo({ left: +dt.getAttribute('data-p') * tr.clientWidth, behavior: 'smooth' });
      });
      var q = 0;
      tr.addEventListener('scroll', function () { if (!q) { q = 1; raf(function () { q = 0; upd(); }); } }, { passive: true });
      window.addEventListener('resize', build);
      build();
    });
  }

  /* ------------------------------------------------------------------ 4. hand-offs to the existing scripts
     - "Complete the room" (assets/nf-bundle.js) builds itself under Add to Cart; move it into its own band
       (sections/nf-pdp-ctr.liquid). Its listeners are on the box, so moving it keeps it working.
     - Enquire (story band) opens the existing bulk quote form from assets/nf-pdp.js (its own button is hidden
       here); without it the link simply goes to the Bulk and Project Orders page. */
  function room() {
    var box = $('.nf-bdl'), mount = $('[data-nfb-mount]');
    if (!box || !mount || mount.contains(box)) return;
    mount.appendChild(box);
    var band = mount.closest('[data-nf-ctr]'); if (band) band.hidden = false;
  }
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-nf-quote-trigger]');
    if (!a) return;
    var q = $('.nf-pk-quote');
    if (q) { e.preventDefault(); q.click(); }
  });

  /* ------------------------------------------------------------------ wiring */
  function run() { gallery(); tiers(); loves(); room(); }
  function start() {
    run();
    d.addEventListener('variant:change', function () {
      setTimeout(run, 60); setTimeout(run, 450); setTimeout(run, 1200);
    });
    /* Prestige swaps parts of the product section on option change; put the gallery counter and the chosen tier back */
    var host = $('.shopify-section--main-product') || d.body, t = 0;
    var rt = 0, rw = setInterval(function () { room(); if ($('[data-nfb-mount] .nf-bdl') || ++rt > 60) clearInterval(rw); }, 250);
    new MutationObserver(function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var root = $('[data-nf-bt]'), stage = $('.shopify-section--main-product product-gallery scroll-carousel');
        var qs = qtyInputs();
        if ((root && !root._nf3) || (stage && !stage._nf3) || (root && qs.some(function (i) { return String(i.value) !== String(wantQty()); }))) run();
      }, 30);
    }).observe(host, { childList: true, subtree: true });
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
})();
