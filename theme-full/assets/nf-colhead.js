/* NF-COLHEAD-V1 (2026-09-12) Collection page upgrades kept out of the shared custom-nav files.
   1. Filter "no matches" state: one removable gold outline chip per active filter (facet-link, so the
      theme re-renders in place), Clear all, a bulb that brightens while Clear all is hovered or focused,
      and 4 of the collection's best sellers from sections/nf-colhead-picks.liquid (sort_by=best-selling).
   2. Pagination: "Showing 50 of 98", a thin gold progress line and a Show more link that appends the next
      page in place. The link keeps the real ?page=N href, so crawlers and visitors without JS still page.
   Prestige replaces the main-collection section on every filter or sort change, so a debounced
   MutationObserver re-applies both. The band image warm-up is inline in sections/nf-collection-head.liquid. */
(function () {
  'use strict';
  if (window.__nfColheadV1) return;
  window.__nfColheadV1 = 1;

  var SVGNS = 'http://www.w3.org/2000/svg';

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function svgEl(tag, attrs) {
    var e = document.createElementNS(SVGNS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function bulb() {
    var s = svgEl('svg', { viewBox: '0 0 48 48', width: '52', height: '52', 'aria-hidden': 'true', focusable: 'false', 'class': 'nf-ch-empty__bulb' });
    s.appendChild(svgEl('circle', { cx: '24', cy: '19', r: '16', 'class': 'nf-ch-empty__halo' }));
    s.appendChild(svgEl('path', { d: 'M24 6.5a12 12 0 0 0-7 21.8c1.3 1 2 2.4 2 4v1.2h10v-1.2c0-1.6.7-3 2-4A12 12 0 0 0 24 6.5z', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6', 'stroke-linejoin': 'round' }));
    s.appendChild(svgEl('path', { d: 'M19.5 37.5h9M20.5 41.5h7', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6', 'stroke-linecap': 'round' }));
    s.appendChild(svgEl('path', { d: 'M20.5 27l2-4.5 1.5 3 1.5-3 2 4.5', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.3', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
    return s;
  }

  function q(v) { return String(v).replace(/["\\]/g, '\\$&'); }
  function clean(t) { return (t || '').replace(/\s+/g, ' ').replace(/\s*\(\d+\)\s*$/, '').trim(); }

  function money(v) {
    var n = Number(v);
    if (!isFinite(n)) return String(v);
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: n % 1 ? 2 : 0 });
  }

  function mainSection() { return document.querySelector('.shopify-section--main-collection'); }

  function band() { return document.querySelector('.nf-ch[data-handle]'); }

  function handle() {
    var b = band();
    if (b) return b.getAttribute('data-handle');
    var m = location.pathname.match(/\/collections\/([^\/?#]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function title() {
    var b = band();
    if (b) return b.getAttribute('data-title');
    var h = document.querySelector('h1');
    return h ? clean(h.textContent) : '';
  }

  /* ---------- Filter "no matches" state ---------- */

  function valueLabel(name, value) {
    var inputs = document.querySelectorAll('input[name="' + q(name) + '"]');
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].value !== value) continue;
      var lab = inputs[i].id ? document.querySelector('label[for="' + q(inputs[i].id) + '"]') : null;
      if (!lab) lab = inputs[i].closest('label');
      var t = lab ? clean(lab.textContent) : '';
      if (t && t.length < 60) return t;
    }
    return value;
  }

  function facetTitle(name) {
    var inp = document.querySelector('[name="' + q(name) + '"]');
    var d = inp && inp.closest('details');
    var s = d && d.querySelector('summary');
    var t = '';
    if (s) { /* first text node only: NF-MOBILE-UI-V3 prints the current choice inside the summary too */
      var w = document.createTreeWalker(s, NodeFilter.SHOW_TEXT), n;
      while ((n = w.nextNode())) { t = clean(n.nodeValue); if (t) break; }
    }
    if (t) return t;
    var k = name.replace(/^filter\.(v|p)\.(option\.|m\.[^.]+\.)?/, '').replace(/[._]/g, ' ');
    return k.charAt(0).toUpperCase() + k.slice(1);
  }

  function colorGroups() {
    var out = [], seen = {};
    [].forEach.call(document.querySelectorAll('.nfcg__opt[aria-checked="true"] .nfcg__name'), function (n) {
      var t = clean(n.textContent);
      if (t && !seen[t]) { seen[t] = 1; out.push(t); }
    });
    return out;
  }

  function activeFilters() {
    var url = new URL(location.href), groups = {}, order = [];
    url.searchParams.forEach(function (v, k) {
      if (!/^filter\./.test(k) || v === '') return;
      var g = /^filter\.v\.price\.(gte|lte)$/.test(k) ? 'price' : k;
      if (!groups[g]) { groups[g] = { keys: [], vals: [] }; order.push(g); }
      if (groups[g].keys.indexOf(k) < 0) groups[g].keys.push(k);
      groups[g].vals.push([k, v]);
    });
    return order.map(function (g) {
      var G = groups[g], label;
      if (g === 'price') {
        var lo = url.searchParams.get('filter.v.price.gte'), hi = url.searchParams.get('filter.v.price.lte');
        label = 'Price ' + (lo && hi ? money(lo) + ' to ' + money(hi) : lo ? 'from ' + money(lo) : 'up to ' + money(hi));
      } else {
        var vals = [];
        if (/option\.colou?r$/i.test(g)) vals = colorGroups();
        if (!vals.length) {
          var seen = {};
          G.vals.forEach(function (p) {
            var t = valueLabel(p[0], p[1]), lk = t.toLowerCase();
            if (!seen[lk]) { seen[lk] = 1; vals.push(t); }
          });
        }
        label = facetTitle(g) + ': ' + vals.slice(0, 2).join(', ') + (vals.length > 2 ? ' +' + (vals.length - 2) : '');
      }
      var rm = new URL(location.href);
      G.keys.forEach(function (k) { rm.searchParams.delete(k); });
      rm.searchParams.delete('page');
      return { label: label, href: rm.pathname + rm.search };
    });
  }

  function facetAnchor(cls, href, text) {
    var fl = document.createElement('facet-link');
    var a = el('a', cls, text);
    a.href = href;
    a.setAttribute('data-no-instant', '');
    fl.appendChild(a);
    return { wrap: fl, a: a };
  }

  function loadPicks(box) {
    var h = handle();
    if (!h) return;
    var wrap = el('div', 'nf-ch-empty__picks is-loading');
    wrap.appendChild(el('p', 'nf-ch-empty__eyebrow', 'Best sellers'));
    wrap.appendChild(el('h3', 'nf-ch-empty__h', 'Popular in ' + title()));
    var grid = el('div', 'nf-ch-picks');
    wrap.appendChild(grid);
    box.appendChild(wrap);
    fetch('/collections/' + encodeURIComponent(h) + '?section_id=nf-colhead-picks&sort_by=best-selling', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var cards = doc.querySelectorAll('product-card');
        if (!cards.length) { wrap.remove(); return; }
        for (var i = 0; i < cards.length && i < 4; i++) {
          var c = document.adoptNode(cards[i]);
          c.removeAttribute('reveal-on-scroll');
          grid.appendChild(c);
        }
        wrap.classList.remove('is-loading');
      })
      .catch(function () { wrap.remove(); });
  }

  function enhanceEmpty(sec) {
    var es = sec.querySelector('.empty-state');
    if (!es || es.getAttribute('data-nfch') === '1') return;
    if (!es.querySelector('facet-link')) return; /* the empty collection state has no filters: leave it */
    es.setAttribute('data-nfch', '1');
    es.classList.add('nf-ch-empty-host');
    var filters = activeFilters();
    var oldClear = es.querySelector('facet-link a[href]');
    var clearHref = oldClear ? oldClear.getAttribute('href') : location.pathname;

    var box = el('div', 'nf-ch-empty');
    box.setAttribute('data-nf-colhead', 'empty');
    box.appendChild(bulb());
    box.appendChild(el('h2', 'nf-ch-empty__title', 'No pieces match these filters'));
    box.appendChild(el('p', 'nf-ch-empty__sub', filters.length > 1
      ? 'Tap a filter to remove just that one, or clear them all.'
      : 'Tap the filter to remove it and see every piece again.'));

    if (filters.length) {
      var ul = el('ul', 'nf-ch-empty__chips');
      ul.setAttribute('aria-label', 'Active filters');
      filters.forEach(function (f) {
        var li = el('li');
        var fa = facetAnchor('nf-ch-fchip', f.href, null);
        fa.a.setAttribute('aria-label', 'Remove filter ' + f.label);
        fa.a.appendChild(el('span', 'nf-ch-fchip__t', f.label));
        var x = el('span', 'nf-ch-fchip__x', '\u00d7');
        x.setAttribute('aria-hidden', 'true');
        fa.a.appendChild(x);
        li.appendChild(fa.wrap);
        ul.appendChild(li);
      });
      box.appendChild(ul);
    }

    var clr = facetAnchor('button nf-ch-empty__clear', clearHref, 'Clear all');
    box.appendChild(clr.wrap);
    ['mouseenter', 'focus'].forEach(function (ev) { clr.a.addEventListener(ev, function () { box.classList.add('is-hot'); }); });
    ['mouseleave', 'blur'].forEach(function (ev) { clr.a.addEventListener(ev, function () { box.classList.remove('is-hot'); }); });

    es.textContent = '';
    es.appendChild(box);
    loadPicks(box);
  }

  /* ---------- Show more pagination ---------- */

  function countTotal(sec) {
    var c = sec.querySelector('.collection-toolbar__products-count');
    var n = c ? parseInt(c.textContent.replace(/[^0-9]/g, ''), 10) : NaN;
    return isFinite(n) ? n : 0;
  }

  function curPage(nav) {
    var c = nav.querySelector('[aria-current="page"]');
    var n = c ? parseInt(c.textContent, 10) : 1;
    return n > 0 ? n : 1;
  }

  function enhancePager(sec) {
    var list = sec.querySelector('product-list');
    var nav = sec.querySelector('nav.pagination');
    if (!list || !nav || nav.getAttribute('data-nfch') === '1') return;
    nav.setAttribute('data-nfch', '1');
    var stale = sec.querySelectorAll('.nf-ch-more');
    for (var i = 0; i < stale.length; i++) stale[i].remove();

    var shown = list.querySelectorAll('product-card').length;
    var total = Math.max(countTotal(sec), shown);
    var page = curPage(nav);
    var next = nav.querySelector('a[rel="next"]');
    var hideNav = page === 1;
    var st = { start: 1, end: shown, total: total };
    if (page > 1) {
      st.start = next ? (page - 1) * shown + 1 : Math.max(1, total - shown + 1);
      st.end = st.start + shown - 1;
    }

    var box = el('div', 'nf-ch-more');
    box.setAttribute('data-nf-colhead', 'more');
    var txt = el('p', 'nf-ch-more__txt');
    txt.setAttribute('aria-live', 'polite');
    var bar = el('div', 'nf-ch-more__bar');
    bar.setAttribute('aria-hidden', 'true');
    var fill = el('span');
    bar.appendChild(fill);
    box.appendChild(txt);
    box.appendChild(bar);
    var btn = null;
    if (next) {
      btn = el('a', 'nf-ch-more__btn', 'Show more');
      btn.href = next.getAttribute('href');
      btn.setAttribute('data-no-instant', '');
      box.appendChild(btn);
    }

    function paint() {
      txt.textContent = '';
      txt.appendChild(document.createTextNode('Showing '));
      txt.appendChild(el('b', null, st.start > 1 ? st.start + ' to ' + st.end : String(st.end)));
      txt.appendChild(document.createTextNode(' of '));
      txt.appendChild(el('b', null, String(st.total)));
      fill.style.width = Math.min(100, Math.round(st.end / Math.max(1, st.total) * 1000) / 10) + '%';
    }
    paint();
    nav.parentNode.insertBefore(box, nav);
    if (hideNav) nav.classList.add('nf-ch-pag-off');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return;
      e.preventDefault();
      if (btn.getAttribute('aria-busy') === 'true') return;
      var keyboard = e.detail === 0;
      var href = btn.href;
      btn.setAttribute('aria-busy', 'true');
      btn.textContent = 'Loading';
      var u = new URL(href, location.href);
      u.searchParams.set('section_id', sec.id.replace(/^shopify-section-/, ''));
      fetch(u.toString(), { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var cards = doc.querySelectorAll('product-list product-card');
          if (!cards.length) throw new Error('no cards');
          var frag = document.createDocumentFragment(), first = null;
          for (var i = 0; i < cards.length; i++) {
            var c = document.adoptNode(cards[i]);
            c.removeAttribute('reveal-on-scroll');
            frag.appendChild(c);
            if (!first) first = c;
          }
          list.appendChild(frag);
          st.end += cards.length;
          var nn = doc.querySelector('nav.pagination');
          var nx = nn && nn.querySelector('a[rel="next"]');
          if (nn) {
            nn = document.adoptNode(nn);
            nn.setAttribute('data-nfch', '1');
            if (hideNav) nn.classList.add('nf-ch-pag-off');
            nav.replaceWith(nn);
            nav = nn;
          }
          if (nx) {
            btn.href = nx.getAttribute('href');
            btn.removeAttribute('aria-busy');
            btn.textContent = 'Show more';
          } else {
            btn.remove();
          }
          paint();
          if (keyboard && first) {
            var link = first.querySelector('a[href]');
            if (link) link.focus({ preventScroll: true });
          }
        })
        .catch(function () { location.href = href; });
    });
  }

  /* ---------- Band chip row fade ---------- */

  function chipFade() {
    [].forEach.call(document.querySelectorAll('.nf-ch__chips'), function (u) {
      var over = u.scrollWidth > u.clientWidth + 2;
      u.classList.toggle('is-over', over);
      u.classList.toggle('is-end', !over || u.scrollLeft + u.clientWidth >= u.scrollWidth - 2);
      if (!u.__nfch) {
        u.__nfch = 1;
        u.addEventListener('scroll', chipFade, { passive: true });
      }
    });
  }

  /* ---------- Run, and re-run after facet re-renders ---------- */

  var timer = 0;
  function run() {
    timer = 0;
    var sec = mainSection();
    if (!sec) return;
    try { enhanceEmpty(sec); } catch (e) { /* leave the theme state as is */ }
    try { enhancePager(sec); } catch (e) { /* leave the theme pagination as is */ }
  }
  function schedule() { if (!timer) timer = setTimeout(run, 90); }

  function start() {
    run();
    requestAnimationFrame(function () { setTimeout(chipFade, 0); }); /* NF-PERF5-0912: measure the chip row after layout, not mid-load */
    var rt = 0;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(chipFade, 150); }, { passive: true });
    new MutationObserver(schedule).observe(document.querySelector('main') || document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
