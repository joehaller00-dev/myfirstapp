/* NF-BULK-ORDER (2026-09-14): the bulk order form at /pages/bulk-order-form (sections/nf-bulk-order.liquid).
   1. Choosing an industry fetches its product table (sections/nf-bulk-table.liquid rendered for that industry page).
      ?industry=<page handle> in the address opens one directly, and the choice is written back into the address.
   2. Plus and minus buttons or typing set a quantity (0 to 999); the size or finish menu picks the variant. Quantities are
      remembered in this browser per industry, so leaving the page or refreshing never loses them.
   3. Add all to cart posts every row with a quantity to /cart/add.js in one request, then opens the cart.
   Industry pages (sections/nf-bulk-inline.liquid, data-nfbo-inline=<page handle>) have no tiles: their own table loads
   when it comes within 900px of the screen, or at once when a link to #bulk-order is used. */
(function () {
  'use strict';
  var root = document.querySelector('[data-nfbo]');
  if (!root || root.__nfbo) return;
  root.__nfbo = true;
  var inline = root.getAttribute('data-nfbo-inline');
  function q(s) { return root.querySelector(s); }
  var slot = q('[data-nfbo-slot]'), step2 = q('[data-nfbo-step2]'), bar = q('[data-nfbo-bar]');
  var elCount = q('[data-nfbo-count]'), elSub = q('[data-nfbo-sub]'), elFor = q('[data-nfbo-for]'), elSave = q('[data-nfbo-save]');
  var btnAdd = q('[data-nfbo-add]'), btnClear = q('[data-nfbo-clear]'), msg = q('[data-nfbo-msg]'), search = q('[data-nfbo-search]'), none = q('[data-nfbo-none]');
  var tiles = Array.prototype.slice.call(root.querySelectorAll('[data-nfbo-pick]'));
  var current = null, pending = null, cache = {};
  var ADD = btnAdd.textContent;

  function money(c) { return '$' + (c / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function store(h) { return 'nfbo:' + h; }
  function saved(h) { try { return JSON.parse(localStorage.getItem(store(h)) || '{}') || {}; } catch (e) { return {}; } }
  function rows() { return Array.prototype.slice.call(slot.querySelectorAll('[data-nfbo-row]')); }
  function vEl(r) { return r.querySelector('[data-nfbo-variant]'); }
  function qEl(r) { return r.querySelector('[data-nfbo-qty]'); }
  function price(r) { var v = vEl(r), o = v.tagName === 'SELECT' ? v.options[v.selectedIndex] : v; return parseInt(o && o.getAttribute('data-price'), 10) || 0; }
  function qty(r) { var n = parseInt(String(qEl(r).value).replace(/[^0-9]/g, ''), 10); return isNaN(n) ? 0 : Math.max(0, Math.min(999, n)); }

  function paint(r) {
    var n = qty(r), p = price(r);
    Array.prototype.forEach.call(r.querySelectorAll('[data-nfbo-price]'), function (e) { e.textContent = money(p); });
    r.querySelector('[data-nfbo-line]').textContent = n ? money(p * n) : '';
    r.classList.toggle('is-on', n > 0);
  }
  function sum() {
    var n = 0, s = 0;
    rows().forEach(function (r) { var k = qty(r); if (k) { n += k; s += k * price(r); } });
    elCount.textContent = n === 1 ? '1 item' : n + ' items';
    elSub.textContent = money(s);
    btnAdd.disabled = n === 0;
    elSave.hidden = n < 2;
    bar.classList.toggle('is-on', n > 0);
  }
  /* NF-BULK-MULTI (2026-09-14, owner: 30 of one lamp as 10 black large, 10 white large, 10 black small): a product can have
     several lines, one per size or finish. Extra lines are clones of the product row (class nfbo-row--extra). Saved as a list
     per product; lines with the same variant are merged when they go to the cart. */
  function groupRows(pid) { return rows().filter(function (r) { return r.getAttribute('data-product') === pid; }); }
  function addLine(src, v, q) {
    var pid = src.getAttribute('data-product');
    var g = groupRows(pid), last = g[g.length - 1] || src;
    var c = src.cloneNode(true);
    c.classList.add('nfbo-row--extra');
    c.classList.remove('is-on');
    c.hidden = false;
    var more = c.querySelector('[data-nfbo-more]');
    if (more) { more.removeAttribute('data-nfbo-more'); more.setAttribute('data-nfbo-rm', ''); more.className = 'nfbo-more nfbo-more--rm'; more.textContent = 'Remove this line'; }
    var sel = vEl(c);
    if (sel.tagName === 'SELECT') {
      if (v && sel.querySelector('option[value="' + v + '"]')) sel.value = v;
      else {
        var used = {};
        g.forEach(function (r) { used[vEl(r).value] = 1; });
        for (var i = 0; i < sel.options.length; i++) { if (!sel.options[i].disabled && !used[sel.options[i].value]) { sel.selectedIndex = i; break; } }
      }
    }
    qEl(c).value = q || 0;
    last.parentNode.insertBefore(c, last.nextSibling);
    paint(c);
    return c;
  }
  function remember() {
    if (!current) return;
    var o = {};
    rows().forEach(function (r) { var k = qty(r); if (k) { var pid = r.getAttribute('data-product'); (o[pid] = o[pid] || []).push({ v: vEl(r).value, q: k }); } });
    try { if (Object.keys(o).length) localStorage.setItem(store(current), JSON.stringify(o)); else localStorage.removeItem(store(current)); } catch (e) {}
  }
  function filter() {
    var t = (search.value || '').trim().toLowerCase(), shown = 0;
    rows().forEach(function (r) { var hit = !t || (r.getAttribute('data-search') || '').indexOf(t) > -1; r.hidden = !hit; if (hit) shown++; });
    none.hidden = !t || shown > 0;
  }

  function pick(h, scroll) {
    var tile = null;
    tiles.forEach(function (t) { if (t.getAttribute('data-nfbo-pick') === h) tile = t; });
    if (!tile) return;
    tiles.forEach(function (t) { var on = t === tile; t.classList.toggle('is-picked', on); t.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    elFor.textContent = tile.getAttribute('data-name') || '';
    try { var u = new URL(location.href); u.searchParams.set('industry', h); history.replaceState(history.state, '', u.toString()); } catch (e) {}
    load(h, scroll);
  }

  function load(h, scroll) {
    if (current === h && (pending || slot.querySelector('[data-nfbo-table]'))) { if (scroll) step2.querySelector('.nfbo-step__h').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    current = h;
    step2.hidden = false;
    msg.textContent = '';
    search.value = '';
    none.hidden = true;
    slot.setAttribute('aria-busy', 'true');
    slot.innerHTML = '<p class="nfbo-loading">Loading the product list…</p>';
    sum();
    if (scroll) step2.querySelector('.nfbo-step__h').scrollIntoView({ behavior: 'smooth', block: 'start' });
    var req = pending = cache[h] ? Promise.resolve(cache[h]) : fetch('/pages/' + encodeURIComponent(h) + '?section_id=nf-bulk-table', { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('status ' + r.status); return r.text(); });
    req.then(function (html) {
      if (pending !== req) return;
      cache[h] = html;
      var box = document.createElement('div');
      box.innerHTML = html;
      var table = box.querySelector('[data-nfbo-table]');
      slot.innerHTML = '';
      if (table) slot.appendChild(table); else slot.innerHTML = '<p class="nfbo-empty">This list could not load. Please refresh the page.</p>';
      var keep = saved(h);
      rows().forEach(function (r) {
        var s = keep[r.getAttribute('data-product')];
        var list = s ? (Array.isArray(s) ? s : [s]) : [];
        if (list[0]) {
          var v = vEl(r);
          if (v.tagName === 'SELECT' && v.querySelector('option[value="' + list[0].v + '"]')) v.value = list[0].v;
          qEl(r).value = list[0].q;
        }
        paint(r);
        for (var x = 1; x < list.length; x++) addLine(r, list[x].v, list[x].q);
      });
      slot.removeAttribute('aria-busy');
      sum();
    }).catch(function () {
      if (pending !== req) return;
      slot.removeAttribute('aria-busy');
      slot.innerHTML = '<p class="nfbo-empty">This list could not load. Please check your connection and choose the industry again.</p>';
    });
  }

  tiles.forEach(function (t) { t.addEventListener('click', function () { pick(t.getAttribute('data-nfbo-pick'), true); }); });

  slot.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var more = e.target.closest('[data-nfbo-more]');
    if (more) {
      var c = addLine(more.closest('[data-nfbo-row]'));
      var sel = vEl(c); if (sel && sel.focus) try { sel.focus({ preventScroll: true }); } catch (err) {}
      sum(); remember(); return;
    }
    var rm = e.target.closest('[data-nfbo-rm]');
    if (rm) { rm.closest('[data-nfbo-row]').remove(); sum(); remember(); return; }
    var b = e.target.closest('[data-nfbo-step]');
    if (!b) return;
    var r = b.closest('[data-nfbo-row]');
    qEl(r).value = Math.max(0, Math.min(999, qty(r) + parseInt(b.getAttribute('data-nfbo-step'), 10)));
    paint(r); sum(); remember();
  });
  slot.addEventListener('input', function (e) {
    var r = e.target.closest && e.target.closest('[data-nfbo-row]');
    if (!r) return;
    if (e.target.matches('[data-nfbo-qty]')) { var c = e.target.value.replace(/[^0-9]/g, '').slice(0, 3); if (c !== e.target.value) e.target.value = c; }
    paint(r); sum(); remember();
  });
  slot.addEventListener('change', function (e) {
    var r = e.target.closest && e.target.closest('[data-nfbo-row]');
    if (!r) return;
    if (e.target.matches('[data-nfbo-qty]')) e.target.value = qty(r);
    paint(r); sum(); remember();
  });
  slot.addEventListener('focusin', function (e) {
    if (e.target.matches && e.target.matches('[data-nfbo-qty]') && qty(e.target.closest('[data-nfbo-row]')) === 0) e.target.select();
  });
  search.addEventListener('input', filter);

  btnClear.addEventListener('click', function () {
    rows().forEach(function (r) { if (r.classList.contains('nfbo-row--extra')) r.remove(); else { qEl(r).value = 0; paint(r); } });
    sum(); remember(); msg.textContent = '';
  });

  btnAdd.addEventListener('click', function () {
    var merged = {}, items = [];
    rows().forEach(function (r) { var k = qty(r); if (k) { var id = vEl(r).value; merged[id] = (merged[id] || 0) + k; } });
    Object.keys(merged).forEach(function (id) { items.push({ id: parseInt(id, 10), quantity: Math.min(merged[id], 9999) }); });
    if (!items.length) return;
    btnAdd.disabled = true;
    btnAdd.textContent = 'Adding…';
    msg.textContent = '';
    fetch('/cart/add.js', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ items: items }) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw j; return j; }); })
      .then(function () {
        try { localStorage.removeItem(store(current)); } catch (e) {}
        btnAdd.textContent = 'Added. Opening your cart…';
        location.href = '/cart';
      })
      .catch(function (err) {
        btnAdd.disabled = false;
        btnAdd.textContent = ADD;
        var t = err && (err.description || err.message);
        msg.textContent = t ? String(t) : 'Something went wrong. Please try again, or email info@norafurnish.com.';
      });
  });

  if (inline) {
    var go = function () { load(inline, false); };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { if (en.some(function (x) { return x.isIntersecting; })) { io.disconnect(); go(); } }, { rootMargin: '900px 0px' });
      io.observe(root);
    } else go();
    if (location.hash === '#bulk-order') go();
    window.addEventListener('hashchange', function () { if (location.hash === '#bulk-order') go(); });
    document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[href$="#bulk-order"]'); if (a) go(); }, true);
    return;
  }
  var start = null;
  try { start = new URL(location.href).searchParams.get('industry'); } catch (e) {}
  if (start) pick(start, true);
})();
