/* NF-BUNDLE-V1 (2026-09-24): bundles and the add to cart upsell, built into the theme (no app).

   1. "Complete the room" on every product page, directly under Add to Cart: this item plus up to three
      pieces that finish the room, ticked by default, one button adds the whole set.
   2. The add to cart popup: after a normal Add to Cart, before the drawer opens, it offers two pieces
      that complete the room. It shows once per visit.
   3. The cart drawer's existing "Pairs well with" (NF-CART-V2) needed no change here: it already asks
      Shopify for complementary picks, which are now curated.

   Where the picks come from: tools/bundles_20260924. Every product's 4 curated picks live in the
   Search & Discovery metafield shopify--discovery--product_recommendation.complementary_products, and
   Shopify's recommendations endpoint (intent=complementary) returns exactly those.

   Every claim is true. The saving shown is the live automatic discounts "Buy 2+ items, save 10%" and
   (2026-09-25) "Buy 3+ items, save 15%": Shopify applies the better one at checkout without a code. Nothing here
   invents scarcity, viewers or deadlines.

   Adds follow the theme's own product form protocol (theme.js): ask cart:prepare-bundled-sections
   for the sections to re-render, POST /cart/add.js with them, read /cart.js, attach the sections,
   then dispatch cart:change with baseEvent variant:add. The cart drawer re-renders from that and opens
   itself. Our adds carry detail.nfBundle so the popup never fires on them.

   NAMING: every hook here is data-nfb-*. custom-nav.js (quick view) owns data-nf-add: it catches any
   click on [data-nf-add] in the capture phase, stops it, treats the value as a variant id, and on
   failure sends the browser to the element's href. The first build used data-nf-add and every
   "Add all" click went to /products/null with an empty cart. Keep the nfb prefix. */
(function () {
  'use strict';
  if (window.__nfBundle) return; window.__nfBundle = 1;
  var d = document, de = d.documentElement;
  var ROOT = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
  var RATE = 0.10, RATE3 = 0.15, MIN_QTY = 2;   /* must match the live automatic discounts (2+ = 10%, 3+ = 15%) */
  function rateFor(q) { return q >= 3 ? RATE3 : RATE; }
  var cache = {};

  function money(c) {
    return '$' + (Math.round(c) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
  ESC[String.fromCharCode(39)] = '&#39;';
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ESC[c]; });
  }
  function img(u, w) {
    if (!u) return '';
    u = String(u); if (u.indexOf('//') === 0) u = 'https:' + u;
    return u + (u.indexOf('?') > -1 ? '&' : '?') + 'width=' + w;
  }
  function store(k, v) {
    try { if (v === undefined) return window.sessionStorage.getItem(k); window.sessionStorage.setItem(k, v); } catch (e) {}
    return null;
  }
  function avail(p) { return (p.variants || []).filter(function (v) { return v.available; }); }
  /* default each add-on to its cheapest available option: that is the "from" price the shopper
     already saw on the product card, and for Pack Size products it is the single piece */
  /* every card shows the product's hero photo (owner 09-25: the variant shots were spec diagrams and
     measurement pictures, not the lifestyle image); a variant image is only the fallback */
  function vimg(p, vid) {
    var v = (p.variants || []).filter(function (x) { return x.id === vid; })[0];
    var f = v && v.featured_image;
    return p.featured_image || (f && (f.src || f)) || '';
  }
  function cheap(p) { var a = avail(p); return a.reduce(function (m, v) { return v.price < m.price ? v : m; }, a[0]); }

  /* the curated picks for a product, available ones only. Shopify leaves out anything already in
     the cart, so the list depends on the cart: the module may cache (it renders once), the popup
     always asks fresh, or it could offer a piece that was added a minute ago. */
  function picks(pid, n, fresh) {
    if (!fresh && cache[pid]) return Promise.resolve(cache[pid].slice(0, n));
    return fetch(ROOT + 'recommendations/products.json?intent=complementary&limit=4&product_id=' + encodeURIComponent(pid),
      { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : { products: [] }; })
      .then(function (j) {
        var list = (j.products || []).filter(function (p) { return p.available && avail(p).length; });
        cache[pid] = list; return list.slice(0, n);
      })
      .catch(function () { return []; });
  }

  function addItems(items) {
    var secs = [];
    de.dispatchEvent(new CustomEvent('cart:prepare-bundled-sections', { bubbles: true, detail: { sections: secs } }));
    return fetch(ROOT + 'cart/add.js', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ items: items, sections: secs.join(',') })
    }).then(function (r) {
      return r.json().then(function (j) { if (!r.ok) throw j; return j; });
    }).then(function (j) {
      return fetch(ROOT + 'cart.js', { credentials: 'same-origin' })
        .then(function (r) { return r.json(); })
        .then(function (cart) {
          cart.sections = j.sections;
          de.dispatchEvent(new CustomEvent('cart:change', {
            bubbles: true, detail: { baseEvent: 'variant:add', cart: cart, nfBundle: true }
          }));
          return cart;
        });
    });
  }
  function openDrawer() {
    var c = d.querySelector('cart-drawer');
    if (c && typeof c.show === 'function') c.show();
  }
  function errText(e) { return (e && (e.description || e.message)) || 'That did not go through. Please try again.'; }

  function select(p, cls) {
    var av = avail(p), lo = cheap(p);
    if (av.length < 2) return '';
    return '<select class="' + cls + '" aria-label="Option for ' + esc(p.title) + '">' + av.map(function (v) {
      return '<option value="' + v.id + '"' + (v.id === lo.id ? ' selected' : '') + '>' + esc(v.title) + '</option>';
    }).join('') + '</select>';
  }

  /* ---------------------------------------------------------------- 1. complete the room */
  function pdp() {
    var host = d.querySelector('product-form');
    var m = window.meta && window.meta.product;
    if (!host || !m || !m.id || d.querySelector('.nf-bdl')) return;
    picks(m.id, 3).then(function (list) {
      if (!list.length || d.querySelector('.nf-bdl')) return;
      var ogImg = (d.querySelector('meta[property="og:image"]') || {}).content || '';
      var box = d.createElement('section');
      box.className = 'nf-bdl';
      box.setAttribute('aria-labelledby', 'nf-bdl-h');
      /* V2 (2026-09-24, owner: "hard to tell what products you are showing ... clunky ... jumbled"):
         one grid of cards, each piece a large photo with its name and price under it and the tick in the
         photo's corner. The old version said everything twice (a strip of 64px thumbnails, then a text
         list of the same items). */
      var h1 = d.querySelector('h1.product-title') || d.querySelector('h1');
      var baseTitle = h1 ? h1.textContent.trim() : 'This item';
      var cards = '<li class="nf-bdl__card is-base"><span class="nf-bdl__tag">This item</span>' +
        '<span class="nf-bdl__img"><img data-nfb-base-img src="' + esc(img(ogImg, 400)) + '" alt="' + esc(baseTitle) + '" loading="eager" fetchpriority="low" decoding="async"></span>' +
        '<p class="nf-bdl__name">' + esc(baseTitle) + '</p><p class="nf-bdl__opt" data-nfb-base-opt></p>' +
        '<p class="nf-bdl__price" data-nfb-base-price></p></li>' +
        list.map(function (p, i) {
          var v = cheap(p);
          return '<li class="nf-bdl__card"><label class="nf-bdl__check"><input type="checkbox" checked data-i="' + i + '"' +
            ' aria-label="Include ' + esc(p.title) + '"><span class="nf-bdl__tick" aria-hidden="true"></span></label>' +
            '<a class="nf-bdl__img" href="' + esc(p.url) + '" tabindex="-1" aria-hidden="true"><img src="' + esc(img(vimg(p, v.id), 400)) +
            '" alt="" loading="eager" fetchpriority="low" decoding="async"></a>' +
            '<p class="nf-bdl__name"><a href="' + esc(p.url) + '">' + esc(p.title) + '</a></p>' + select(p, 'nf-bdl__sel') +
            '<p class="nf-bdl__price" data-nfb-price="' + i + '">' + money(v.price) + '</p></li>';
        }).join('');
      box.innerHTML =
        '<div class="nf-bdl__head"><p class="nf-bdl__eyebrow">Buy together</p>' +
        '<h3 id="nf-bdl-h" class="nf-bdl__title">Complete the room</h3>' +
        '<p class="nf-bdl__deal">Buy 2 pieces and <b>save 10%</b>, 3 or more and <b>save 15%</b>, automatically at checkout.</p></div>' +
        '<ul class="nf-bdl__grid">' + cards + '</ul>' +
        '<div class="nf-bdl__sum" aria-live="polite"><span class="nf-bdl__label">Set price</span><span class="nf-bdl__was" data-nfb-was></span>' +
        '<span class="nf-bdl__now" data-nfb-now></span><span class="nf-bdl__save" data-nfb-save></span></div>' +
        '<button type="button" class="nf-bdl__btn" data-nfb-add></button>' +
        '<p class="nf-bdl__err" role="alert" hidden></p>';
      host.parentNode.insertBefore(box, host.nextSibling);
      wire(box, list, m);
      /* the popup after Add to Cart shows the first two of these same picks at 360px; fetch those
         now, when the page is idle, so the popup opens with its pictures already in the cache */
      var warm = function () { list.slice(0, 2).forEach(function (p) { var i = new Image(); i.decoding = 'async'; i.src = img(p.featured_image, 360); }); };
      if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 4000 }); else setTimeout(warm, 2500);
    });
  }

  function wire(box, list, m) {
    var form = d.querySelector('product-form form[action*="/cart/add"]') || d.querySelector('form[action*="/cart/add"]');
    var chosen = list.map(function (p) { return cheap(p); });
    /* "This item" shows the photo of the option picked above, not the page's lifestyle share image
       (owner 09-24: the generic room shot did not show the product) */
    var baseP = null, lastImg = '';
    fetch('/products/' + location.pathname.split('/').filter(Boolean).pop() + '.js')
      .then(function (r) { return r.ok ? r.json() : null; }).then(function (p) { baseP = p; baseSel(); paint(); }).catch(function () {});
    /* NF-BDL-BASESEL (2026-09-25, owner: "This item" only printed the option name, e.g. "B"): with more than one option,
       "This item" gets a dropdown that changes the option on the page itself, so the price, photos and Add to Cart all
       follow. It ticks the page's own option radios, the same way the sticky bar's select does (nf-cart-v2.js). */
    function baseSel() {
      if (!baseP || !baseP.variants || baseP.variants.length < 2) return;
      var opt = box.querySelector('[data-nfb-base-opt]'); if (!opt || box.querySelector('.nf-bdl__sel--base')) return;
      var s = d.createElement('select');
      s.className = 'nf-bdl__sel nf-bdl__sel--base';
      s.setAttribute('aria-label', 'Option for this item');
      s.innerHTML = baseP.variants.map(function (v) {
        return '<option value="' + v.id + '"' + (v.available ? '' : ' disabled') + '>' + esc(v.title) + (v.available ? '' : ' (sold out)') + '</option>';
      }).join('');
      opt.parentNode.replaceChild(s, opt);
    }
    function setMain(vid) {
      var v = baseP && baseP.variants.filter(function (x) { return x.id === vid; })[0]; if (!v) return;
      var fid = form && form.id, ids = [];
      var so = d.querySelector('.nf-sb-native option[value="' + vid + '"]');
      if (so) ids = (so.getAttribute('data-value-ids') || '').split(',');
      (v.options || []).forEach(function (name, i) {
        var pos = i + 1, radios = [].slice.call(d.querySelectorAll('input[type="radio"][data-option-position="' + pos + '"]' + (fid ? '[form="' + fid + '"]' : '')));
        var r = ids[i] ? radios.filter(function (x) { return x.value === ids[i]; })[0] : null;
        if (!r) r = radios.filter(function (x) {
          var l = x.closest('label') || x.parentNode, txt = ((l && l.textContent) || '').replace(/\s+/g, ' ').trim();
          return txt === name || txt.indexOf(name + ' ') === 0;
        })[0];
        if (r && !r.checked) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
      });
    }
    function base() {
      var idEl = form && form.querySelector('[name="id"]');
      var id = idEl ? +idEl.value : 0;
      var v = (m.variants || []).filter(function (x) { return x.id === id; })[0] || (m.variants || [])[0] || {};
      var qEl = form && form.querySelector('[name="quantity"]');
      var q = Math.max(1, parseInt(qEl && qEl.value, 10) || 1);
      return { id: v.id, price: v.price || 0, title: v.public_title || '', qty: q };
    }
    function paint() {
      var b = base();
      if (baseP) {
        var u = vimg(baseP, b.id);
        if (u && u !== lastImg) { lastImg = u; var bi = box.querySelector('[data-nfb-base-img]'); if (bi) bi.src = img(u, 400); }
      }
      var bo = box.querySelector('[data-nfb-base-opt]'); if (bo) bo.textContent = b.title || '';
      var bs = box.querySelector('.nf-bdl__sel--base'); if (bs && b.id && +bs.value !== b.id) bs.value = String(b.id);
      box.querySelector('[data-nfb-base-price]').textContent = money(b.price * b.qty);
      var sum = b.price * b.qty, n = 0, qty = b.qty;
      box.querySelectorAll('input[type="checkbox"]').forEach(function (c) {
        var i = +c.getAttribute('data-i');
        c.closest('.nf-bdl__card').classList.toggle('is-off', !c.checked);
        if (c.checked) { sum += chosen[i].price; n++; qty++; }
      });
      /* Shopify rounds a percentage discount DOWN (406.96 x 10% = 40.696 -> it gives 40.69), so floor
         here too: the saving promised must never be a cent more than the saving delivered */
      var on = qty >= MIN_QTY, save = on ? Math.floor(sum * rateFor(qty)) : 0;
      box.querySelector('[data-nfb-was]').textContent = on ? money(sum) : '';
      box.querySelector('[data-nfb-now]').textContent = money(sum - save);
      box.querySelector('[data-nfb-save]').textContent = on ? 'You save ' + money(save) : '';
      var btn = box.querySelector('[data-nfb-add]');
      btn.disabled = n === 0;
      btn.innerHTML = n === 0 ? 'Tick a piece to build your set'
        : 'Add all ' + (n + 1) + ' to cart<span>Save ' + money(save) + '</span>';
    }
    box.addEventListener('change', function (e) {
      var t = e.target;
      if (t.classList.contains('nf-bdl__sel--base')) { setMain(+t.value); setTimeout(paint, 400); return; }
      if (t.classList.contains('nf-bdl__sel')) {
        var row = t.closest('.nf-bdl__card'), cb = row.querySelector('input[type="checkbox"]'), i = +cb.getAttribute('data-i');
        var v = avail(list[i]).filter(function (x) { return String(x.id) === t.value; })[0];
        if (v) {
          chosen[i] = v; row.querySelector('[data-nfb-price]').textContent = money(v.price);
          var im = row.querySelector('.nf-bdl__img img'); if (im) im.src = img(vimg(list[i], v.id), 400);
        }
      }
      paint();
    });
    d.addEventListener('variant:change', function () { setTimeout(paint, 0); });
    if (form) form.addEventListener('input', paint);
    box.querySelector('[data-nfb-add]').addEventListener('click', function () {
      var btn = this, err = box.querySelector('.nf-bdl__err'), b = base();
      var items = [{ id: b.id, quantity: b.qty }];
      box.querySelectorAll('input[type="checkbox"]').forEach(function (c) {
        if (c.checked) items.push({ id: chosen[+c.getAttribute('data-i')].id, quantity: 1 });
      });
      err.hidden = true; btn.disabled = true; btn.classList.add('is-busy'); btn.textContent = 'Adding your set';
      addItems(items).then(function () {
        btn.classList.remove('is-busy'); btn.classList.add('is-done'); btn.textContent = 'Added to your cart';
        setTimeout(function () { btn.classList.remove('is-done'); paint(); }, 2600);
      }).catch(function (e) {
        btn.classList.remove('is-busy'); err.textContent = errText(e); err.hidden = false; paint();
      });
    });
    paint();
  }

  /* ---------------------------------------------------------------- 2. add to cart popup
     A normal Add to Cart fires variant:add on the form, then cart:change on <html>. We note the item on
     variant:add, and in a capture listener on window (which runs before the drawer's own listener) we
     rename baseEvent so the drawer re-renders its contents but waits to open. The popup opens the drawer
     when the shopper is done, whichever way they leave it. */
  var pending = null;
  d.addEventListener('variant:add', function (e) {
    var t = e.target;
    if (t && t.closest && t.closest('cart-drawer, .nf-bdl, .nf-bpop')) return;
    var it = e.detail && e.detail.items && e.detail.items[0];
    if (it && it.product_id) pending = it;
  });
  window.addEventListener('cart:change', function (e) {
    var dt = e.detail || {};
    var it = pending; pending = null;
    if (!it || dt.nfBundle || dt.baseEvent !== 'variant:add') return;
    if (!d.querySelector('cart-drawer')) return;
    /* once per product per visit, so a second different piece still gets its own suggestions */
    var seen = (store('nf-bdl-pop') || '').split(',');
    if (seen.indexOf(String(it.product_id)) > -1) return;
    seen.push(it.product_id); store('nf-bdl-pop', seen.slice(-30).join(','));
    dt.baseEvent = 'nf-held';
    /* room sets carry their own 10% and do not count toward the 2 (see snippets/nf-cart-progress.liquid) */
    var count = dt.cart && dt.cart.items ? dt.cart.items.reduce(function (n, l) { return n + (l.product_type === 'Room Set' ? 0 : l.quantity); }, 0) : 1;
    picks(it.product_id, 2, true).then(function (list) {
      if (!list.length) { openDrawer(); return; }
      popup(it, list, count);
    });
  }, true);

  function popup(added, list, count) {
    var unlock = count < MIN_QTY;
    var dlg = d.createElement('dialog');
    dlg.className = 'nf-bpop';
    dlg.setAttribute('aria-labelledby', 'nf-bpop-h');
    var cards = list.map(function (p, i) {
      var v = cheap(p);
      return '<div class="nf-bpop__card"><a class="nf-bpop__img" href="' + esc(p.url) + '"><img src="' + esc(img(p.featured_image, 360)) +
        '" alt="" loading="eager" decoding="async"></a><p class="nf-bpop__name">' + esc(p.title) + '</p>' + select(p, 'nf-bpop__sel') +
        '<p class="nf-bpop__price" data-nfb-pp="' + i + '">' + money(v.price) + '</p>' +
        '<button type="button" class="nf-bpop__add" data-i="' + i + '">Add to my order</button></div>';
    }).join('');
    dlg.innerHTML =
      '<div class="nf-bpop__in">' +
      '<button type="button" class="nf-bpop__x" aria-label="Close and view cart">&times;</button>' +
      '<p class="nf-bpop__ok"><span aria-hidden="true">&#10003;</span> Added to your cart</p>' +
      '<p class="nf-bpop__added">' + esc(added.product_title || added.title || '') + '</p>' +
      '<h2 id="nf-bpop-h" class="nf-bpop__h">' + (unlock ? 'Add one more piece and save&nbsp;10%' : (count >= 3 ? 'Your 15%&nbsp;is on' : 'One more piece makes it&nbsp;15%')) + '</h2>' +
      '<p class="nf-bpop__sub">' + (unlock
        ? 'Add any second piece and 10% comes off, a third and it is 15%, automatically at checkout.'
        : (count >= 3 ? 'Anything you add now is 15% off as well. These two finish the room.'
                      : 'Add a third piece and the saving goes from 10% to 15%. These two finish the room.')) + '</p>' +
      '<div class="nf-bpop__cards">' + cards + '</div>' +
      '<p class="nf-bpop__err" role="alert" hidden></p>' +
      '<button type="button" class="nf-bpop__go">Continue to cart</button></div>';
    d.body.appendChild(dlg);
    var chosen = list.map(function (p) { return cheap(p); }), done = false;
    function finish(open) {
      if (done) return; done = true;
      try { dlg.close(); } catch (e) {}
      dlg.remove();
      if (open) openDrawer();
    }
    dlg.addEventListener('change', function (e) {
      var t = e.target; if (!t.classList.contains('nf-bpop__sel')) return;
      var card = t.closest('.nf-bpop__card'), i = +card.querySelector('.nf-bpop__add').getAttribute('data-i');
      var v = avail(list[i]).filter(function (x) { return String(x.id) === t.value; })[0];
      if (v) { chosen[i] = v; card.querySelector('[data-nfb-pp]').textContent = money(v.price); }
    });
    dlg.addEventListener('click', function (e) {
      var t = e.target;
      if (t === dlg) { finish(true); return; }                    /* the backdrop */
      if (t.closest('.nf-bpop__x') || t.closest('.nf-bpop__go')) { finish(true); return; }
      var btn = t.closest('.nf-bpop__add'); if (!btn) return;
      var err = dlg.querySelector('.nf-bpop__err');
      err.hidden = true; btn.disabled = true; btn.textContent = 'Adding';
      addItems([{ id: chosen[+btn.getAttribute('data-i')].id, quantity: 1 }])
        .then(function () { finish(false); })                     /* our add opens the drawer itself */
        .catch(function (x) { btn.disabled = false; btn.textContent = 'Add to my order'; err.textContent = errText(x); err.hidden = false; });
    });
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); finish(true); });
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  }

  function start() { pdp(); }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
})();

/* NF-SALEEND-V1 (2026-09-24): the fall sale countdown under the price on sale products (markup in
   snippets/product-info.liquid). It re-finds the bars every second, so a variant change that redraws the
   price block keeps its timer. Once the end date passes the bars are removed for good. */
(function () {
  if (window.__nfSaleEnd) return; window.__nfSaleEnd = 1;
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    var bars = document.querySelectorAll('.nf-saleend[data-ends]');
    if (!bars.length) return;
    for (var i = 0; i < bars.length; i++) {
      var el = bars[i], left = Date.parse(el.getAttribute('data-ends')) - Date.now();
      if (!(left > 0)) { el.remove(); continue; }
      var s = Math.floor(left / 1000), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600),
          m = Math.floor(s % 3600 / 60), t = el.querySelector('.nf-saleend__t');
      if (t) t.textContent = (d ? d + 'd ' : '') + two(h) + 'h ' + two(m) + 'm ' + two(s % 60) + 's';
      el.hidden = false;
    }
  }
  tick(); setInterval(tick, 1000);
})();

/* NF-PULSE-V1 (2026-09-25): the small line above the product title (markup in snippets/product-info.liquid).
   Real product page visits when there are 5 or more in the last 7 days and the count is under 4 days old,
   otherwise the delivery window (6 to 9 business days from today). Re-checked every 2s because the theme
   redraws the info column on option change. */
(function () {
  if (window.__nfPulse) return; window.__nfPulse = 1;
  var FLAME = '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M8.6 1c.3 2.2-.9 3.4-2 4.6C5.5 6.8 4.5 8 4.5 9.9 4.5 12.2 6.1 14 8 14s3.5-1.6 3.5-4c0-1.2-.5-2.3-1.2-3.1.1 1.1-.4 2-1.2 2.3.5-2.4-.1-5.1-.5-8.2z"/></svg>';
  var TRUCK = '<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1.5 4h8v6.5h-8zM9.5 6.5h3l2 2.2v1.8h-5"/><circle cx="4.5" cy="11.5" r="1.3" fill="#fff"/><circle cx="11.8" cy="11.5" r="1.3" fill="#fff"/></svg>';
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function addBiz(d, n) { d = new Date(d); while (n > 0) { d.setDate(d.getDate() + 1); var w = d.getDay(); if (w !== 0 && w !== 6) n--; } return d; }
  function fmt(d) { return MON[d.getMonth()] + ' ' + d.getDate(); }
  function fill() {
    var els = document.querySelectorAll('[data-nf-pulse]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.getAttribute('data-done')) continue;
      var v = parseInt(el.getAttribute('data-views'), 10) || 0, ds = el.getAttribute('data-date');
      var fresh = ds && (Date.now() - Date.parse(ds + 'T12:00:00')) < 4 * 864e5;
      var ic = el.querySelector('.nf-pulse__i'), t = el.querySelector('.nf-pulse__t');
      if (v >= 5 && fresh) {
        el.classList.add('is-views'); ic.innerHTML = FLAME;
        t.innerHTML = '<b>' + v + ' people</b> viewed this in the last 7 days';
      } else if (el.getAttribute('data-mto') !== '1') {
        var now = new Date();
        el.classList.add('is-ship'); ic.innerHTML = TRUCK;
        t.innerHTML = 'Order today, arrives <b>' + fmt(addBiz(now, 6)) + ' to ' + fmt(addBiz(now, 9)) + '</b>';
      } else { el.setAttribute('data-done', '1'); continue; }
      el.hidden = false; el.setAttribute('data-done', '1');
    }
  }
  fill(); setInterval(fill, 2000);
})();
