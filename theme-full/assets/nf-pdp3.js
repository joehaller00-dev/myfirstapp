/* NF-PDP3-V2 (2026-09-25) product page redesign behaviours. Styles in assets/nf-pdp3.css.
   1. gallery: left and right arrows plus an "n / total" counter on the main image, and the page always opens on the
      product's FIRST image (unless the link asks for a variant); the theme used to open on the cheapest option's
      picture, which is often a spec drawing
   2. "In stock" line follows the selected option (snippets/nf-pdp-stock.liquid)
   3. Bundle & Save (snippets/nf-bundle-tiers.liquid): a card sets the quantity and the quantity box picks the card
      (2 = 2 Items, 3 or more = 3+ Items). The 2 and 3+ cards get one option dropdown per item; when the items differ,
      Add to Cart adds the mix in one request. Prestige re-renders the info column on every option change, so the
      choice is kept here and put back after each re-render.
   4. "Why customers love us" carousel (sections/nf-pdp-story.liquid)
   5. hand-offs: Complete the room moves into its own band, Enquire opens the existing bulk quote form
   6. wishlist kept in this browser (snippets/nf-pdp-wish.liquid); shoppers who are not signed in are asked for their
      email first (a Shopify customer signup, tagged wishlist) or to sign in
   V3 (2026-09-25, owner round 3):
   7. desktop layout like Baskoraa: the story sits under the gallery and "Why customers love us" under the buy column, so
      there is no empty gap under the thumbnails (phones keep the story band below the product)
   8. when the Bundle & Save items are different options, the express buttons (PayPal etc.) are swapped for a Buy it now
      that adds the exact mix and goes to checkout (the express buttons can only buy one option)
   No class is put on <html> or <body>. */
(function () {
  'use strict';
  if (window.__nfPdp3) return; window.__nfPdp3 = 1;
  var d = document, de = d.documentElement;
  var ROOT = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || d).querySelectorAll(s)); }
  var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
  function money(c) { return '$' + (Math.round(c) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }; ESC[String.fromCharCode(39)] = '&#39;';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); }

  /* shared variant data */
  var VL = null;
  function vlist() {
    if (VL) return VL;
    try { VL = JSON.parse(($('[data-nf3-variants]') || {}).textContent || '[]'); } catch (e) { VL = []; }
    return VL;
  }
  function vById(id) { return vlist().filter(function (v) { return v.id === +id; })[0] || null; }
  function mainForm() { return $('form[id^="product-form-main"]'); }
  function curId() {
    var f = mainForm(), el = f && f.querySelector('[name="id"]');
    return el ? +el.value : ((vlist()[0] || {}).id || 0);
  }

  /* ------------------------------------------------------------------ 1. gallery */
  var ARL = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
  var ARR = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
  function gallery() {
    if (!$('[data-nf3]')) return;
    $$('.shopify-section--main-product product-gallery').forEach(function (gal) {
      var list = $('.product-gallery__image-list', gal), car = list && $('scroll-carousel', list);
      if (!car || car._nf3) return;
      car._nf3 = 1;
      $$('.product-gallery__thumbnail img', gal).forEach(function (im) { im.sizes = '110px'; });
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
      function slides() { return $$('.product-gallery__media', car).filter(function (m) { return !m.hidden; }); }
      function upd() {
        var s = slides(); if (!s.length) return;
        var left = car.getBoundingClientRect().left, best = 0, dist = Infinity;
        s.forEach(function (m, i) {
          var dd = Math.abs(m.getBoundingClientRect().left - left);
          if (dd < dist) { dist = dd; best = i; }
        });
        iEl.textContent = best + 1;
        nEl.textContent = s.length;
        prev.classList.toggle('is-end', best === 0);
        next.classList.toggle('is-end', best === s.length - 1);
      }
      var q = 0;
      car.addEventListener('scroll', function () { if (!q) { q = 1; raf(function () { q = 0; upd(); }); } }, { passive: true });
      window.addEventListener('resize', upd);
      upd(); setTimeout(upd, 400);
    });
  }
  /* open on the first image: the theme scrolls to the selected option's picture while it starts up, so hold slide 1
     for the first seconds, until the shopper touches anything */
  function firstImage() {
    if (/[?&]variant=/.test(location.search) || !$('[data-nf3]')) return;
    var stop = false, t0 = Date.now();
    function halt() { stop = true; }
    ['pointerdown', 'wheel', 'keydown', 'touchstart'].forEach(function (e) { d.addEventListener(e, halt, { once: true, passive: true }); });
    (function hold() {
      if (stop || Date.now() - t0 > 6000) return;
      var gal = $('.shopify-section--main-product product-gallery'), car = gal && $('scroll-carousel', gal);
      if (car) {
        var first = $$('.product-gallery__media', car).filter(function (m) { return !m.hidden; })[0];
        if (first && Math.abs(first.getBoundingClientRect().left - car.getBoundingClientRect().left) > 2) {
          car.scrollTo({ left: first.offsetLeft - car.offsetLeft, behavior: 'instant' });
        }
        $$('.product-gallery__thumbnail', gal).filter(function (b) { return !b.hidden; }).forEach(function (b, i) {
          var want = i === 0 ? 'true' : 'false';
          if (b.getAttribute('aria-current') !== want) b.setAttribute('aria-current', want);
        });
      }
      setTimeout(hold, 80);
    })();
  }

  /* ------------------------------------------------------------------ 2. stock line */
  function stock() {
    var el = $('[data-nf-stock]'); if (!el) return;
    var v = vById(curId()); if (!v) return;
    el.classList.toggle('is-out', !v.a);
    var t = $('[data-nf-stock-t]', el), txt = v.a ? 'In stock' : 'Sold out';
    if (t && t.textContent !== txt) t.textContent = txt;
  }

  /* ------------------------------------------------------------------ 3. Bundle & Save */
  var st = { n: 1, q3: 3, picks: [], base: 0 };
  var MAX3 = 50, muting = false;
  function qtyInputs() {
    var f = mainForm(); if (!f) return [];
    return $$('input[name="quantity"]').filter(function (i) { return i.form === f || i.getAttribute('form') === f.id; });
  }
  function wantQty() { return st.n === 3 ? st.q3 : st.n; }
  function setQty(n) {
    muting = true;
    qtyInputs().forEach(function (inp) {
      if (String(inp.value) === String(n)) return;
      inp.value = n;
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
    });
    muting = false;
  }
  function multi() { return vlist().filter(function (v) { return v.a; }).length > 1; }
  function syncPicks() {
    var cur = curId(), len = wantQty();
    if (st.base !== cur) { st.base = cur; st.picks = []; }
    while (st.picks.length < len) st.picks.push(cur);
    st.picks.length = len;
  }
  function pickHtml(i, val) {
    return '<label class="nf-bt__pick"><span>' + (i + 1) + '.</span><select data-pick="' + i + '" aria-label="Option for item ' + (i + 1) + '">' +
      vlist().filter(function (v) { return v.a || v.id === val; }).map(function (v) {
        return '<option value="' + v.id + '"' + (v.id === val ? ' selected' : '') + '>' + esc(v.t) + '</option>';
      }).join('') + '</select></label>';
  }
  function paint(root) {
    syncPicks();
    var cur = vById(curId()); if (!cur) return;
    var p2 = +root.getAttribute('data-pct2') || 0, p3 = +root.getAttribute('data-pct3') || p2, many = multi();
    $$('.nf-bt__opt', root).forEach(function (o) {
      var tier = +o.getAttribute('data-n'), on = tier === st.n, n = tier === 3 ? st.q3 : tier;
      var pct = tier === 1 ? 0 : (tier === 2 ? p2 : p3);
      var ids = on ? st.picks.slice(0, n) : [];
      while (ids.length < n) ids.push(cur.id);
      var full = ids.reduce(function (s, id) { var v = vById(id); return s + (v ? v.price : cur.price); }, 0);
      var save = Math.floor(full * pct / 100), now = full - save;   /* round the saving DOWN, like Shopify */
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
      var box = $('[data-picks]', o);
      if (box) {
        if (!on || !many) { if (box.innerHTML) box.innerHTML = ''; }
        else {
          var sels = $$('select', box);
          if (sels.length !== n) { box.innerHTML = ids.map(function (id, i) { return pickHtml(i, id); }).join(''); }
          else sels.forEach(function (s, i) { if (+s.value !== ids[i]) s.value = ids[i]; });
        }
      }
      if (cur.img && o._img !== cur.img) {
        o._img = cur.img;
        $$('.nf-bt__img', o).forEach(function (im) { im.removeAttribute('srcset'); im.src = cur.img.indexOf('//') === 0 ? 'https:' + cur.img : cur.img; });
      }
    });
  }
  function choose(n) {
    st.n = n;
    var root = $('[data-nf-bt]');
    if (root) paint(root);
    setQty(wantQty());
    express();
  }
  function tiers() {
    var root = $('[data-nf-bt]');
    if (!root) return;
    if (!root._nf3) {
      root._nf3 = 1;
      root.addEventListener('click', function (e) {
        if (e.target.closest('select, label.nf-bt__pick')) return;
        var sb = e.target.closest('[data-step-dir]');
        if (sb) {
          e.preventDefault(); e.stopPropagation();
          st.q3 = Math.max(3, Math.min(MAX3, st.q3 + +sb.getAttribute('data-step-dir')));
          choose(3); return;
        }
        var o = e.target.closest('.nf-bt__opt');
        if (o) choose(+o.getAttribute('data-n'));
      });
      root.addEventListener('change', function (e) {
        var s = e.target.closest('select[data-pick]'); if (!s) return;
        st.picks[+s.getAttribute('data-pick')] = +s.value;
        paint(root); express();
      });
      root.addEventListener('keydown', function (e) {
        if (e.target.closest('select')) return;
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
  /* the quantity box drives the cards: 1 = 1 Item, 2 = 2 Items, 3 or more = 3+ Items */
  function onQty(e) {
    var t = e.target;
    if (muting || !t || t.name !== 'quantity' || !$('[data-nf-bt]')) return;
    var f = mainForm(); if (!f || !(t.form === f || t.getAttribute('form') === f.id)) return;
    var q = parseInt(t.value, 10);
    if (!(q >= 1)) return;
    if (q >= 3) { st.n = 3; st.q3 = Math.min(MAX3, q); } else st.n = q;
    var root = $('[data-nf-bt]'); if (root) paint(root);
    if (q > MAX3) setQty(MAX3);
    express();
  }
  d.addEventListener('change', onQty, true);
  d.addEventListener('input', onQty, true);
  /* quantity-selector +/- buttons change the value without an input event in some builds */
  d.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.shopify-section--main-product quantity-selector')) {
      setTimeout(function () { var i = qtyInputs()[0]; if (i) onQty({ target: i }); }, 40);
    }
  }, true);

  /* Add to Cart with a mix of options: one /cart/add.js with every item, then the theme's own cart:change so the
     drawer re-renders and opens (the same protocol assets/nf-bundle.js uses) */
  function addItems(items) {
    var secs = [];
    de.dispatchEvent(new CustomEvent('cart:prepare-bundled-sections', { bubbles: true, detail: { sections: secs } }));
    return fetch(ROOT + 'cart/add.js', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ items: items, sections: secs.join(',') })
    }).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw j; return j; }); })
      .then(function (j) {
        return fetch(ROOT + 'cart.js', { credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (cart) {
          cart.sections = j.sections;
          de.dispatchEvent(new CustomEvent('cart:change', { bubbles: true, detail: { baseEvent: 'variant:add', cart: cart, nfBundle: true } }));
          var cd = $('cart-drawer'); if (cd && typeof cd.show === 'function') setTimeout(function () { cd.show(); }, 50);
          return cart;
        });
      });
  }
  d.addEventListener('submit', function (e) {
    var f = mainForm(), root = $('[data-nf-bt]');
    if (!f || e.target !== f || !root || st.n < 2 || !multi()) return;
    syncPicks();
    var cur = curId(), mixed = st.picks.some(function (id) { return id !== cur; });
    if (!mixed) return;                                   /* same option for every item: the theme adds it as usual */
    e.preventDefault(); e.stopImmediatePropagation();
    var counts = {}, order = [];
    st.picks.forEach(function (id) { if (!counts[id]) { counts[id] = 0; order.push(id); } counts[id]++; });
    var btn = f.querySelector('[type="submit"]'), err = $('.nf-bt__err', root);
    if (!err) { err = d.createElement('p'); err.className = 'nf-bt__err'; err.setAttribute('role', 'alert'); root.appendChild(err); }
    err.hidden = true;
    if (btn) { btn.disabled = true; btn.setAttribute('aria-busy', 'true'); }
    addItems(order.map(function (id) { return { id: id, quantity: counts[id] }; }))
      .catch(function (x) { err.textContent = (x && (x.description || x.message)) || 'That did not go through. Please try again.'; err.hidden = false; })
      .then(function () { if (btn) { btn.disabled = false; btn.removeAttribute('aria-busy'); } });
  }, true);

  /* ------------------------------------------------------------------ 4. reviews carousel */
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

  /* ------------------------------------------------------------------ 5. hand-offs to the existing scripts */
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

  /* ------------------------------------------------------------------ 6. wishlist (this browser only) */
  var WK = 'nf_wishlist_v1';
  function wlRead() { try { return JSON.parse(localStorage.getItem(WK) || '[]') || []; } catch (e) { return []; } }
  function wlWrite(a) { try { localStorage.setItem(WK, JSON.stringify(a.slice(0, 60))); } catch (e) {} }
  function wlPaint() {
    var box = $('[data-nf-wl]'); if (!box) return;
    var list = wlRead(), h = box.getAttribute('data-handle'), on = list.some(function (x) { return x.h === h; });
    var btn = $('[data-nf-wl-btn]', box), lab = $('[data-nf-wl-label]', box), view = $('[data-nf-wl-view]', box);
    /* write only what changed: this runs from a MutationObserver */
    var pr = on ? 'true' : 'false', lt = on ? 'Saved to your Wishlist' : 'Add to Wishlist', cnt = $('[data-nf-wl-count]', box);
    if (btn.getAttribute('aria-pressed') !== pr) btn.setAttribute('aria-pressed', pr);
    if (lab.textContent !== lt) lab.textContent = lt;
    if (view.hidden !== !list.length) view.hidden = !list.length;
    if (cnt.textContent !== String(list.length)) cnt.textContent = list.length;
  }
  function wlOpen() {
    var dlg = $('.nf-wlm');
    if (!dlg) {
      dlg = d.createElement('dialog'); dlg.className = 'nf-wlm'; dlg.setAttribute('aria-label', 'Your wishlist');
      d.body.appendChild(dlg);
      dlg.addEventListener('click', function (e) {
        if (e.target === dlg || e.target.closest('.nf-wlm__x')) { dlg.close(); return; }
        var rm = e.target.closest('[data-rm]');
        if (rm) { wlWrite(wlRead().filter(function (x) { return x.h !== rm.getAttribute('data-rm'); })); fill(); wlPaint(); }
      });
    }
    function fill() {
      var list = wlRead();
      dlg.innerHTML = '<div class="nf-wlm__in"><button type="button" class="nf-wlm__x" aria-label="Close">&times;</button>' +
        '<h2 class="nf-wlm__h">Your wishlist</h2>' +
        (list.length ? '<ul class="nf-wlm__list">' + list.map(function (x) {
          return '<li><a href="' + esc(x.u) + '"><img src="' + esc(x.i) + '" alt="" loading="lazy"><span><b>' + esc(x.t) + '</b><small>' + esc(x.p) + '</small></span></a>' +
            '<button type="button" data-rm="' + esc(x.h) + '">Remove</button></li>';
        }).join('') + '</ul>' : '<p class="nf-wlm__empty">Nothing saved yet.</p>') +
        '<p class="nf-wlm__note">Saved on this device.</p></div>';
    }
    fill();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  function wlItem(box) {
    var im = box.getAttribute('data-img') || '';
    return { h: box.getAttribute('data-handle'), t: box.getAttribute('data-title'), u: box.getAttribute('data-url'), i: im.indexOf('//') === 0 ? 'https:' + im : im, p: box.getAttribute('data-price') };
  }
  function wlAdd(item) { var list = wlRead().filter(function (x) { return x.h !== item.h; }); list.unshift(item); wlWrite(list); wlPaint(); }
  function known(box) {
    if (box.getAttribute('data-customer')) return true;
    try { return !!localStorage.getItem('nf_wl_email'); } catch (e) { return false; }
  }
  /* not signed in: ask for an email (Shopify customer signup with the wishlist tag) or a sign in, then save */
  function wlGate(box) {
    var item = wlItem(box), back = location.pathname + location.search;
    var dlg = d.createElement('dialog'); dlg.className = 'nf-wlm nf-wlg'; dlg.setAttribute('aria-labelledby', 'nf-wlg-h');
    dlg.innerHTML = '<div class="nf-wlm__in"><button type="button" class="nf-wlm__x" aria-label="Close">&times;</button>' +
      '<p class="nf-wlg__eyebrow">Your wishlist</p><h2 class="nf-wlm__h" id="nf-wlg-h">Save it for later</h2>' +
      '<p class="nf-wlg__sub">Enter your email and we will keep <b>' + esc(item.t) + '</b> on your list, and let you know if it goes on sale.</p>' +
      '<form class="nf-wlg__f" novalidate><input type="email" name="email" autocomplete="email" placeholder="Email address" required aria-label="Email address">' +
      '<button type="submit">Save to wishlist</button></form>' +
      '<p class="nf-wlg__err" role="alert" hidden></p>' +
      '<p class="nf-wlg__or">Already have an account? <a href="/account/login?return_url=' + encodeURIComponent(back) + '">Sign in</a> or <a href="/account/register?return_url=' + encodeURIComponent(back) + '">create one</a></p>' +
      '<p class="nf-wlm__note">By saving you agree to receive Nora Furnish emails. Unsubscribe anytime.</p></div>';
    d.body.appendChild(dlg);
    function close() { try { dlg.close(); } catch (e) {} dlg.remove(); }
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('.nf-wlm__x')) close(); });
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
    var form = $('form', dlg), err = $('.nf-wlg__err', dlg), btn = $('button[type="submit"]', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.email.value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = 'Please enter a valid email address.'; err.hidden = false; return; }
      err.hidden = true; btn.disabled = true; btn.textContent = 'Saving';
      var fd = new FormData();
      fd.append('form_type', 'customer'); fd.append('utf8', '\u2713');
      fd.append('contact[email]', email); fd.append('contact[tags]', 'newsletter,wishlist');
      fetch(ROOT + 'contact', { method: 'POST', body: fd, credentials: 'same-origin' })
        .then(function (r) {
          if (!r.ok || /challenge/.test(r.url || '')) throw new Error('challenge');
          try { localStorage.setItem('nf_wl_email', email); } catch (x) {}
          wlAdd(item);
          $('.nf-wlm__in', dlg).innerHTML = '<button type="button" class="nf-wlm__x" aria-label="Close">&times;</button>' +
            '<p class="nf-wlg__eyebrow">Saved</p><h2 class="nf-wlm__h">It is on your wishlist</h2>' +
            '<p class="nf-wlg__sub">We will email ' + esc(email) + ' if anything on your list goes on sale.</p>';
          setTimeout(close, 2600);
        })
        .catch(function () {
          /* Shopify asked for a captcha: send the same signup as a normal form post, which shows it, then come back */
          try { sessionStorage.setItem('nf_wl_pending', JSON.stringify(item)); localStorage.setItem('nf_wl_email', email); } catch (x) {}
          var f = d.createElement('form'); f.method = 'post'; f.action = ROOT + 'contact#nf-wishlist'; f.hidden = true;
          [['form_type', 'customer'], ['utf8', '\u2713'], ['contact[email]', email], ['contact[tags]', 'newsletter,wishlist'], ['return_to', back]].forEach(function (kv) {
            var i = d.createElement('input'); i.type = 'hidden'; i.name = kv[0]; i.value = kv[1]; f.appendChild(i);
          });
          d.body.appendChild(f); f.submit();
        });
    });
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    setTimeout(function () { form.email.focus(); }, 50);
  }
  try {
    var pend = sessionStorage.getItem('nf_wl_pending');
    if (pend) { sessionStorage.removeItem('nf_wl_pending'); wlAdd(JSON.parse(pend)); }
  } catch (e) {}
  d.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-nf-wl-btn], [data-nf-wl-view]');
    if (!b) return;
    var box = b.closest('[data-nf-wl]');
    if (b.hasAttribute('data-nf-wl-view')) { wlOpen(); return; }
    var h = box.getAttribute('data-handle');
    if (wlRead().some(function (x) { return x.h === h; })) { wlWrite(wlRead().filter(function (x) { return x.h !== h; })); wlPaint(); return; }
    if (!known(box)) { wlGate(box); return; }
    wlAdd(wlItem(box));
  });

  /* ------------------------------------------------------------------ 7. desktop layout */
  var DESK = window.matchMedia('(min-width: 1000px)');
  function layout() {
    var prod = $('.shopify-section--main-product .product'), info = prod && $('.product-info', prod);
    var story = $('.nf-st__story'), lv = $('[data-nf-lv]'), band = $('.nf-st__in'), sp = $('[data-nfsp]');
    if (!prod || !$('[data-nf3]', prod) || (!band && !sp)) return;
    var below = $('.nf3-below', prod);
    if (DESK.matches) {
      if (!below) { below = d.createElement('div'); below.className = 'nf3-below'; prod.appendChild(below); }
      if (sp && sp.parentNode !== below) { if (!sp._home) sp._home = sp.parentNode; below.insertBefore(sp, below.firstChild); }
      if (story && story.parentNode !== below) below.appendChild(story);
      if (lv && info && lv.parentNode !== info) { info.appendChild(lv); lv.classList.add('nf-lv--side'); }
      prod.classList.add('nf3-split');
    } else {
      if (story && band && story.parentNode !== band) band.insertBefore(story, band.firstChild);
      if (lv && band && lv.parentNode !== band) { band.appendChild(lv); lv.classList.remove('nf-lv--side'); }
      if (sp && sp._home && sp.parentNode !== sp._home) sp._home.appendChild(sp);
      if (below) below.remove();
      prod.classList.remove('nf3-split');
    }
    var sec = band && band.closest('.nf-st'); if (sec) sec.hidden = !band.children.length;
  }
  if (DESK.addEventListener) DESK.addEventListener('change', function () { layout(); $$('[data-nf-lv]').forEach(function (b) { b._nf3 = 0; }); loves(); });

  /* ------------------------------------------------------------------ 8. express checkout with a mix of options */
  function mixedNow() {
    if (!$('[data-nf-bt]') || st.n < 2 || !multi()) return false;
    syncPicks();
    var cur = curId();
    return st.picks.some(function (id) { return id !== cur; });
  }
  function mixItems() {
    var counts = {}, order = [];
    st.picks.forEach(function (id) { if (!counts[id]) { counts[id] = 0; order.push(id); } counts[id]++; });
    return order.map(function (id) { return { id: id, quantity: counts[id] }; });
  }
  function express() {
    var mixed = mixedNow();
    $$('.shopify-payment-button, shopify-accelerated-checkout, .nf-buynow').forEach(function (el) {
      if (el.closest('.nf3-buymix')) return;
      if (mixed) { if (!el.hasAttribute('data-nf3-hid')) { el.setAttribute('data-nf3-hid', ''); el.style.display = 'none'; } }
      else if (el.hasAttribute('data-nf3-hid')) { el.removeAttribute('data-nf3-hid'); el.style.display = ''; }
    });
    var host = $('.shopify-section--main-product .nf-buynow') || $('.shopify-section--main-product .nf-qty-atc-row');
    var btn = $('.nf3-buymix');
    if (mixed && host && !btn) {
      btn = d.createElement('button'); btn.type = 'button'; btn.className = 'nf3-buymix'; btn.textContent = 'Buy it now';
      host.parentNode.insertBefore(btn, host.nextSibling);
      btn.addEventListener('click', function () {
        btn.disabled = true; btn.textContent = 'One moment';
        fetch(ROOT + 'cart/add.js', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ items: mixItems() }) })
          .then(function (r) { if (!r.ok) throw r; location.href = ROOT + 'checkout'; })
          .catch(function () { btn.disabled = false; btn.textContent = 'Buy it now'; });
      });
    }
    if (btn) btn.hidden = !mixed;
  }

  /* ------------------------------------------------------------------ 9. review header (V4, Baskoraa layout)
     The tab bar is built by custom-nav.js (NF-REVIEW-TABS-V1) a moment after load. Put a header row above it: the average
     and the count on the left (from the product's review metafields, printed on [data-nf3]), and its two buttons on the
     right. */
  function rhead() {
    var rt = $('.nf-rt');
    if (!rt) return false;
    if (rt._nf3h) return true;
    rt._nf3h = 1;
    var m = $('[data-nf3]'), r = parseFloat(m && m.getAttribute('data-rating')) || 0, n = parseInt(m && m.getAttribute('data-count'), 10) || 0;
    var h = d.createElement('div');
    h.className = 'nf-rh';
    h.innerHTML = '<div class="nf-rh__sum">' +
      (n ? '<p class="nf-rh__score">' + r.toFixed(1) + ' <span class="nfsr__stars" style="--r:' + Math.round(r * 20) + '%" aria-label="' + r.toFixed(1) + ' out of 5 stars"></span></p>' +
           '<p class="nf-rh__n">' + n + (n === 1 ? ' review' : ' reviews') + '</p>'
         : '<p class="nf-rh__score">No reviews yet</p><p class="nf-rh__n">Be the first to share how it looks at home.</p>') +
      '</div>';
    var acts = $('.nf-rt__acts', rt);
    if (acts) h.appendChild(acts);
    rt.parentNode.insertBefore(h, rt);
    return true;
  }
  (function () { var k = 0, iv = setInterval(function () { if (rhead() || ++k > 60) clearInterval(iv); }, 300); })();

  /* ------------------------------------------------------------------ 10. room set piece photos: tap to view large */
  d.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-nfsp-img]');
    if (!b) return;
    var strip = b.parentNode, all = $$('[data-nfsp-img]', strip), i = all.indexOf(b);
    var name = (b.closest('.nfsp__piece') && $('.nfsp__t', b.closest('.nfsp__piece')) || {}).textContent || '';
    var dlg = $('.nfsp-dlg');
    if (!dlg) {
      dlg = d.createElement('dialog'); dlg.className = 'nfsp-dlg';
      dlg.innerHTML = '<img alt=""><div class="nfsp-dlg__bar"><button type="button" data-p aria-label="Previous photo">&larr;</button><span data-c></span><button type="button" data-n aria-label="Next photo">&rarr;</button><button type="button" data-x aria-label="Close">&times;</button></div>';
      d.body.appendChild(dlg);
      dlg.addEventListener('click', function (ev) {
        if (ev.target === dlg || ev.target.closest('[data-x]')) { dlg.close(); return; }
        if (ev.target.closest('[data-p]')) show(dlg._i - 1);
        if (ev.target.closest('[data-n]')) show(dlg._i + 1);
      });
      dlg.addEventListener('keydown', function (ev) { if (ev.key === 'ArrowLeft') show(dlg._i - 1); if (ev.key === 'ArrowRight') show(dlg._i + 1); });
    }
    function show(k) {
      var l = dlg._all; k = (k + l.length) % l.length; dlg._i = k;
      var im = $('img', dlg); im.src = l[k].getAttribute('data-nfsp-img'); im.alt = dlg._name + ', photo ' + (k + 1);
      $('[data-c]', dlg).textContent = dlg._name + '  ' + (k + 1) + ' / ' + l.length;
    }
    dlg._all = all; dlg._name = name.trim();
    show(i);
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  });

  /* ------------------------------------------------------------------ wiring */
  function run() { layout(); gallery(); stock(); tiers(); loves(); room(); wlPaint(); express(); }
  function start() {
    run();
    firstImage();
    d.addEventListener('variant:change', function () {
      setTimeout(run, 60); setTimeout(run, 450); setTimeout(run, 1200);
    });
    /* Prestige swaps parts of the product section on option change; put the counter, the stock line and the chosen
       card back */
    var host = $('.shopify-section--main-product') || d.body, t = 0;
    var rt = 0, rw = setInterval(function () { room(); if ($('[data-nfb-mount] .nf-bdl') || ++rt > 60) clearInterval(rw); }, 250);
    new MutationObserver(function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var root = $('[data-nf-bt]'), stage = $('.shopify-section--main-product product-gallery scroll-carousel');
        if ((root && !root._nf3) || (stage && !stage._nf3) ||
            (root && qtyInputs().some(function (i) { return String(i.value) !== String(wantQty()); }))) run();
        else { stock(); wlPaint(); express(); if (DESK.matches && $('.nf-st__story') && !$('.nf3-below .nf-st__story')) layout(); }
      }, 30);
    }).observe(host, { childList: true, subtree: true });
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
})();
