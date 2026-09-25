/* NF-DIRECTORY-V1 (2026-09-11): behaviour of the /collections directory (sections/nf-directory-*.liquid).
   One "find a collection" box filters every department card, collection chip, Shop your way tile and featured card
   on the page (every word must match). Enter with exactly one match opens it; otherwise the form falls through to
   the store search. Sideways rails get arrow buttons. ?q= prefills the filter. */
(function () {
  'use strict';
  if (window.__nfdReady) return;
  window.__nfdReady = true;
  var doc = document.documentElement;
  var input = document.querySelector('[data-nfd-input]');
  var form = document.querySelector('[data-nfd-form]');
  var clearBtn = document.querySelector('[data-nfd-clear]');
  var statusEl = document.querySelector('[data-nfd-status]');
  var hero = document.querySelector('[data-nfd-hero]');
  var items = [].slice.call(document.querySelectorAll('[data-nfd-item]'));
  var cards = [].slice.call(document.querySelectorAll('[data-nfd-card]')).reverse();
  var groups = [].slice.call(document.querySelectorAll('[data-nfd-group]'));
  var secs = [].slice.call(document.querySelectorAll('[data-nfd-sec]'));

  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
  }
  items.forEach(function (it) { it._k = norm((it.getAttribute('data-nfd-k') || '') + ' ' + it.textContent.replace(/\d+/g, ' ')); });
  cards.forEach(function (c) { c._k = norm(c.getAttribute('data-nfd-k') || ''); });

  function collectHrefs(onlyVisible) {
    var set = {};
    items.forEach(function (it) {
      if (onlyVisible && it.hidden) return;
      var a = it.matches('a') ? it : it.querySelector('a[href]');
      if (a) set[a.getAttribute('href').split('?')[0]] = a;
    });
    cards.forEach(function (c) {
      if (onlyVisible && c.hidden) return;
      var a = c.querySelector('.nfd-dept__t a');
      if (a && (!onlyVisible || c.classList.contains('is-hit'))) set[a.getAttribute('href').split('?')[0]] = a;
    });
    return set;
  }
  var totalN = Object.keys(collectHrefs(false)).length;
  var defaultStatus = totalN + ' collections to explore, each with its own picture';
  if (statusEl) statusEl.textContent = defaultStatus;

  function setStatus(n, raw) {
    if (!statusEl) return;
    statusEl.textContent = '';
    var s = document.createElement('strong');
    s.textContent = n === 0 ? 'No collections' : n + (n === 1 ? ' collection' : ' collections');
    statusEl.appendChild(s);
    statusEl.appendChild(document.createTextNode((n === 1 ? ' matches' : ' match') + ' “' + raw + '”' + (n === 0 ? '. Press Enter to search every product.' : '')));
  }

  function run() {
    if (!input) return;
    var raw = input.value.trim();
    var q = norm(raw);
    var terms = q ? q.split(' ') : [];
    if (clearBtn) clearBtn.hidden = !raw;
    if (!terms.length) {
      doc.classList.remove('nfd-filtering');
      items.forEach(function (it) { it.hidden = false; });
      cards.forEach(function (c) { c.hidden = false; c.classList.remove('is-hit'); });
      groups.forEach(function (g) { g.hidden = false; });
      secs.forEach(function (s) { s.hidden = false; });
      if (statusEl) statusEl.textContent = defaultStatus;
      rails.forEach(function (r) { r.update(); });
      return;
    }
    doc.classList.add('nfd-filtering');
    var m = function (k) { return terms.every(function (t) { return k.indexOf(t) > -1; }); };
    items.forEach(function (it) { it.hidden = !m(it._k); });
    cards.forEach(function (c) {
      var hit = m(c._k);
      c.classList.toggle('is-hit', hit);
      if (hit) [].forEach.call(c.querySelectorAll('[data-nfd-item]'), function (i) { i.hidden = false; });
    });
    groups.forEach(function (g) { g.hidden = !g.querySelector('[data-nfd-item]:not([hidden])'); });
    cards.forEach(function (c) { c.hidden = !(c.classList.contains('is-hit') || c.querySelector('[data-nfd-item]:not([hidden])')); });
    cards.forEach(function (c) { if (!c.hidden) { var p = c.parentElement && c.parentElement.closest('[data-nfd-card]'); if (p) p.hidden = false; } });
    secs.forEach(function (s) { s.hidden = !s.querySelector('[data-nfd-item]:not([hidden]), [data-nfd-card]:not([hidden])'); });
    setStatus(Object.keys(collectHrefs(true)).length, raw);
    rails.forEach(function (r) { r.update(); });
  }

  if (input) {
    var tId = 0;
    input.addEventListener('input', function () { clearTimeout(tId); tId = setTimeout(run, 60); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { input.value = ''; run(); } });
  }
  if (form) form.addEventListener('submit', function (e) {
    var raw = input ? input.value.trim() : '';
    if (!raw) { e.preventDefault(); return; }
    var hrefs = Object.keys(collectHrefs(true));
    if (hrefs.length === 1 && doc.classList.contains('nfd-filtering')) { e.preventDefault(); location.href = hrefs[0]; }
  });
  if (clearBtn) clearBtn.addEventListener('click', function () { input.value = ''; run(); input.focus(); });

  if (hero) hero.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var el = document.getElementById(a.getAttribute('href').slice(1));
    if (!el) return;
    e.preventDefault();
    if (input && input.value) { input.value = ''; run(); }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    try { history.replaceState(history.state, '', '#' + el.id); } catch (x) {}
  });

  var rails = [].slice.call(document.querySelectorAll('[data-nfd-rail]')).map(function (rail) {
    var row = rail.closest('.nfd-row');
    var prev = row && row.querySelector('[data-nfd-prev]');
    var next = row && row.querySelector('[data-nfd-next]');
    function update() {
      var max = rail.scrollWidth - rail.clientWidth - 2;
      if (row) row.classList.toggle('has-overflow', max > 2);
      if (prev) prev.disabled = rail.scrollLeft <= 2;
      if (next) next.disabled = rail.scrollLeft >= max;
    }
    function step(dir) {
      var li = rail.querySelector('li');
      var w = li ? li.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).columnGap || 0) : rail.clientWidth * 0.8;
      var n = Math.max(1, Math.floor(rail.clientWidth / w) - 1);
      rail.scrollBy({ left: dir * w * n, behavior: 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
    rail.addEventListener('scroll', update, { passive: true });
    return { update: update };
  });
  var rT = 0;
  window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(function () { rails.forEach(function (r) { r.update(); }); }, 120); });
  rails.forEach(function (r) { r.update(); });
  window.addEventListener('load', function () { rails.forEach(function (r) { r.update(); }); });

  var pre = '';
  try { pre = new URLSearchParams(location.search).get('q') || ''; } catch (e) {}
  if (pre && input) { input.value = pre; run(); }
})();
