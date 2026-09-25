/* NF-SEARCH-V2 (2026-09-12) "Lamplight" instant search for the header search panel.
   Shopify Predictive Search through the Section Rendering API (sections/nf-search-suggest.liquid), no app,
   no library. Debounced, stale requests aborted, answers cached per query.
   Keyboard: ArrowDown / ArrowUp browse, Enter opens, Escape clears the highlight then closes.
   Also fills "Did you mean" chips on the nothing found search page.
   NF-SEARCH-V3 (2026-09-12, owner: "make that fade in together"): the empty panel content (Popular right now and the
   four category tiles) is server rendered into <template id="nf-srch-empty-tpl"> (layout/theme.liquid), so it is on
   screen the moment the panel opens, never waiting on a network call. On page idle (or header hover) the stylesheet
   loads and the tile and chip images are fetched and decoded. Once the stylesheet is in, the panel gets .nf-srch-fx and
   opens as one unit: opacity plus a short slide, 220ms (nf-search.css). Typed results crossfade instead of popping. */
(function () {
  'use strict';
  if (window.__nfsV2) return;
  window.__nfsV2 = 1;

  var me = document.currentScript;
  var CSS = me && me.getAttribute('data-nf-srch-css');
  var ROOT = (window.Shopify && Shopify.routes && Shopify.routes.root) || '/';
  var SEC = 'nf-search-suggest';
  var PARAMS = 'resources%5Btype%5D=product%2Ccollection%2Carticle%2Cquery&resources%5Blimit%5D=6' +
    '&resources%5Blimit_scope%5D=each&resources%5Boptions%5D%5Bunavailable_products%5D=last';
  var DEBOUNCE = 200;
  var rm = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var desk = window.matchMedia ? window.matchMedia('(min-width: 700px)') : null;
  function reduced() { return !!(rm && rm.matches); }

  var cssOn = false, cssReady = false, fx = false;
  function loadCss() {
    if (cssOn || !CSS) return;
    cssOn = true;
    var ex = document.querySelector('link[data-nf-srch-css]');
    if (ex) {
      if (ex.sheet) cssLoaded(); else ex.addEventListener('load', cssLoaded, { once: true });
      return;
    }
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = CSS;
    l.setAttribute('data-nf-srch-css', '');
    l.addEventListener('load', cssLoaded, { once: true });
    document.head.appendChild(l);
  }
  function cssLoaded() {
    cssReady = true;
    if (built) enableFx();
  }
  function enableFx() {
    if (fx || !panel) return;
    fx = true;
    if (!panel.classList.contains('nf-srch-fx')) panel.classList.add('nf-srch-fx');
  }

  /* ---------- nothing found page: spelling suggestions from Shopify ---------- */
  function fillDym() {
    var box = document.querySelector('[data-nf-srch-dym]');
    if (!box || box.querySelector('a')) return;
    var t = (box.getAttribute('data-nf-srch-terms') || '').trim();
    if (!t || !window.fetch) return;
    fetch(ROOT + 'search/suggest.json?q=' + encodeURIComponent(t) + '&resources%5Btype%5D=query&resources%5Blimit%5D=5', {
      headers: { Accept: 'application/json' }, credentials: 'same-origin'
    }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      var qs = (d && d.resources && d.resources.results && d.resources.results.queries) || [];
      var n = 0, low = t.toLowerCase();
      qs.forEach(function (q) {
        var s = (q && q.text || '').trim();
        if (n >= 3 || !s || s.toLowerCase() === low) return;
        var a = document.createElement('a');
        a.className = 'nf-srch-chip nf-srch-chip--dark';
        a.href = ROOT + 'search?q=' + encodeURIComponent(s);
        a.textContent = s;
        box.appendChild(a);
        n++;
      });
      if (n) box.hidden = false;
    }).catch(function () {});
  }

  /* ---------- header instant search ---------- */
  var panel, input, form, inner, drop, line, live, scrim, closeBtn;
  var ctrl = null, timer = 0, hideT = 0, seq = 0, shownKey = null, cache = {}, active = -1, opts = [], built = false;
  var preloaded = false, keep = [];

  function el(tag, cls, attrs) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function isOpen() { return !!panel && panel.classList.contains('is-open'); }

  function build() {
    if (built) return true;
    panel = document.getElementById('header-search-panel');
    input = document.getElementById('header-search-panel-input');
    if (!panel || !input) return false;
    built = true;
    form = input.form;
    inner = panel.querySelector('.header-search-panel__inner') || panel;
    closeBtn = panel.querySelector('.header-search-panel__close');

    line = el('span', 'nf-srch-line', { 'aria-hidden': 'true' });
    inner.appendChild(line);
    drop = el('div', 'nf-srch', { id: 'nf-srch-drop', role: 'listbox', 'aria-label': 'Search suggestions' });
    drop.hidden = true;
    panel.appendChild(drop);
    live = el('div', 'nf-srch-sr', { role: 'status', 'aria-live': 'polite' });
    panel.appendChild(live);
    scrim = el('div', 'nf-srch-scrim', { 'aria-hidden': 'true' });
    document.body.appendChild(scrim);

    // the empty box answer is already in the page: no request, no wait
    var tpl = document.getElementById('nf-srch-empty-tpl');
    if (tpl) cache[urlFor('')] = tpl.innerHTML;

    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-controls', 'nf-srch-drop');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('enterkeyhint', 'search');
    input.setAttribute('spellcheck', 'false');
    if (form && !form.querySelector('input[name="options[prefix]"]')) {
      var h = el('input', '', { type: 'hidden', name: 'options[prefix]', value: 'last' });
      form.appendChild(h);
    }

    input.addEventListener('focus', function () { loadCss(); schedule(0); });
    input.addEventListener('input', function () { schedule(DEBOUNCE); });
    input.addEventListener('keydown', onKey);
    scrim.addEventListener('click', function () { if (closeBtn) closeBtn.click(); });
    drop.addEventListener('mousemove', function (e) {
      var a = e.target.closest && e.target.closest('[data-nf-srch-opt]');
      if (a && opts.indexOf(a) !== active && active !== -1) setActive(-1);
    });

    // Opening: fill the drop in the same task as the class change (a microtask, before the first painted frame), so
    // the content rides in with the panel. Closing: hide. Every class write below is guarded, so this cannot loop.
    new MutationObserver(function () {
      if (isOpen()) {
        if (drop.hidden && cssReady) openNow();
      } else if (panel.classList.contains('nf-srch-open') || !drop.hidden) {
        hide();
      }
    }).observe(panel, { attributes: true, attributeFilter: ['class'] });

    if (cssReady) enableFx();
    return true;
  }

  /* fetch and decode the empty box images ahead of time, so the tiles are painted in the panel's first frame */
  function preload() {
    if (preloaded) return;
    var tpl = document.getElementById('nf-srch-empty-tpl');
    if (!tpl || !tpl.content) return;
    preloaded = true;
    var imgs = tpl.content.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      var s = imgs[i], im = new Image();
      im.decoding = 'async';
      if (s.getAttribute('sizes')) im.sizes = s.getAttribute('sizes');
      if (s.getAttribute('srcset')) im.srcset = s.getAttribute('srcset');
      im.src = s.getAttribute('src');
      keep.push(im);
      if (im.decode) im.decode().catch(function () {});
    }
  }

  function warm() { loadCss(); if (build()) preload(); }

  function norm() {
    var q = (input.value || '').trim().replace(/\s+/g, ' ');
    return q.length < 2 ? '' : q;
  }

  function openNow() {
    clearTimeout(hideT);
    var url = urlFor(norm());
    if (cache[url]) render(cache[url], url, false);
    else schedule(0);
  }

  function schedule(ms) {
    clearTimeout(timer);
    timer = setTimeout(run, ms);
  }

  function urlFor(q) {
    return q
      ? ROOT + 'search/suggest?q=' + encodeURIComponent(q) + '&' + PARAMS + '&section_id=' + SEC
      : ROOT + 'search?section_id=' + SEC;
  }

  function run() {
    if (!isOpen() && document.activeElement !== input) return;
    var q = norm();
    var url = urlFor(q);
    if (url === shownKey && !drop.hidden) return;
    if (ctrl) { try { ctrl.abort(); } catch (e) {} ctrl = null; }
    var my = ++seq;
    var soft = !drop.hidden;
    if (cache[url]) { render(cache[url], url, soft); loading(false); return; }
    ctrl = window.AbortController ? new AbortController() : null;
    loading(true);
    fetch(url, { credentials: 'same-origin', signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { if (!r.ok) throw new Error('nfs ' + r.status); return r.text(); })
      .then(function (html) {
        if (my !== seq) return;
        if (q.length >= 4 && html.indexOf('data-nf-srch-state="none"') > -1) {
          /* predictive search found nothing relevant: ask full search, which forgives typos (cahndelier) */
          return fetch(ROOT + 'search?q=' + encodeURIComponent(q) + '&type=product&options%5Bprefix%5D=last&section_id=' + SEC,
            { credentials: 'same-origin', signal: ctrl ? ctrl.signal : undefined })
            .then(function (r) { return r.ok ? r.text() : ''; })
            .then(function (h2) {
              if (my !== seq) return;
              var use = h2.indexOf('data-nf-srch-state="results"') > -1 ? h2 : html;
              cache[url] = use;
              render(use, url, soft);
              loading(false);
            });
        }
        cache[url] = html;
        render(html, url, soft);
        loading(false);
      })
      .catch(function () { if (my === seq) loading(false); });
  }

  function loading(on) {
    if (!line) return;
    if (on) {
      line.classList.remove('is-done');
      void line.offsetWidth;
      line.classList.add('is-loading');
      panel.setAttribute('aria-busy', 'true');
      // the old answer dims while the new one loads, then the new one fades up: a crossfade, not a pop
      if (drop && !drop.hidden && !drop.classList.contains('is-stale')) drop.classList.add('is-stale');
    } else {
      if (line.classList.contains('is-loading')) {
        line.classList.remove('is-loading');
        line.classList.add('is-done');
      }
      panel.removeAttribute('aria-busy');
      if (drop && drop.classList.contains('is-stale')) drop.classList.remove('is-stale');
    }
  }

  function fadeImages(r) {
    var imgs = r.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      var im = imgs[i];
      if (im.complete && im.naturalWidth) continue;
      im.classList.add('nf-srch-fade');
      im.addEventListener('load', function () { this.classList.add('is-in'); }, { once: true });
      im.addEventListener('error', function () { this.classList.add('is-in'); }, { once: true });
    }
  }

  function render(html, key, soft) {
    var t = document.createElement('template');
    t.innerHTML = html;
    var r = t.content.querySelector('.nf-srch-r');
    if (!r) return;
    if (!isOpen()) return;
    clearTimeout(hideT);
    if (drop.classList.contains('is-stale')) drop.classList.remove('is-stale');
    drop.textContent = '';
    drop.appendChild(r);
    drop.scrollTop = 0;
    shownKey = key;
    opts = [].slice.call(drop.querySelectorAll('[data-nf-srch-opt]'));
    opts.forEach(function (a, i) {
      a.id = 'nf-srch-o-' + i;
      a.setAttribute('role', 'option');
      a.setAttribute('aria-selected', 'false');
    });
    active = -1;
    input.removeAttribute('aria-activedescendant');
    if (!reduced()) {
      fadeImages(r);
      if (soft && r.animate) r.animate([{ opacity: 0.55 }, { opacity: 1 }], { duration: 180, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
    drop.hidden = false;
    if (!panel.classList.contains('nf-srch-open')) panel.classList.add('nf-srch-open');
    input.setAttribute('aria-expanded', 'true');
    if (scrim && (!desk || desk.matches) && !scrim.classList.contains('is-on')) scrim.classList.add('is-on');
    say(r.getAttribute('data-nf-srch-say') || '');
  }

  function say(msg) {
    if (!live) return;
    live.textContent = '';
    setTimeout(function () { live.textContent = msg; }, 60);
  }

  function hide() {
    if (!built) return;
    clearTimeout(timer);
    seq++;
    if (ctrl) { try { ctrl.abort(); } catch (e) {} ctrl = null; }
    loading(false);
    setActive(-1);
    shownKey = null;
    input.setAttribute('aria-expanded', 'false');
    if (scrim && scrim.classList.contains('is-on')) scrim.classList.remove('is-on');
    var finish = function () {
      if (isOpen()) return;
      drop.hidden = true;
      if (panel.classList.contains('nf-srch-open')) panel.classList.remove('nf-srch-open');
    };
    // with the fade on, the content leaves together with the panel; clear it once the 220ms fade is over
    if (fx && !drop.hidden) { clearTimeout(hideT); hideT = setTimeout(finish, 240); }
    else finish();
  }

  function setActive(i) {
    if (active >= 0 && opts[active]) {
      opts[active].classList.remove('is-active');
      opts[active].setAttribute('aria-selected', 'false');
    }
    active = i;
    if (i < 0 || !opts[i]) { active = -1; if (input) input.removeAttribute('aria-activedescendant'); return; }
    var a = opts[i];
    a.classList.add('is-active');
    a.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', a.id);
    try { a.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduced() ? 'auto' : 'smooth' }); } catch (e) { a.scrollIntoView(false); }
  }

  function onKey(e) {
    var k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowUp') {
      if (drop.hidden || !opts.length) { if (k === 'ArrowDown') schedule(0); return; }
      e.preventDefault();
      var n = opts.length;
      if (k === 'ArrowDown') setActive(active + 1 >= n ? 0 : active + 1);
      else setActive(active <= 0 ? (active === 0 ? -1 : n - 1) : active - 1);
    } else if (k === 'Enter') {
      if (active >= 0 && opts[active] && !e.isComposing) {
        e.preventDefault();
        var href = opts[active].getAttribute('href');
        if (href) window.location.href = href;
      }
    } else if (k === 'Escape' || k === 'Esc') {
      if (active >= 0) { e.preventDefault(); e.stopPropagation(); setActive(-1); }
    } else if (k === 'Home' || k === 'End') {
      if (active >= 0) setActive(-1);
    }
  }

  function intent(e) {
    var t = e.target;
    if (t && t.closest && t.closest('.header__search-toggle, #header-search-panel')) warm();
  }

  function idle() {
    if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 3000 });
    else setTimeout(warm, 1500);
  }

  function init() {
    fillDym();
    document.addEventListener('pointerover', intent, { passive: true });
    document.addEventListener('touchstart', intent, { passive: true });
    document.addEventListener('focusin', function (e) {
      if (e.target && e.target.id === 'header-search-panel-input') {
        warm();
        schedule(0);
      }
    });
    var inp = document.getElementById('header-search-panel-input');
    if (inp && document.activeElement === inp) { warm(); schedule(0); }
    if (document.readyState === 'complete') idle();
    else window.addEventListener('load', idle, { once: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
