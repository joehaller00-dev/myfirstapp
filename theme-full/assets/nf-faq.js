/* NF-FAQ-V2 (2026-09-11): FAQ page behaviour for sections/nf-faq.liquid.
   Live search (every word must match the question, the answer or the hidden keywords; matches are marked in the
   question), smooth accordions, deep links (#question-handle opens and scrolls to that answer; opening an answer
   writes its hash), copy link buttons, a ?q= prefill and the active topic in the side rail. */
(function () {
  'use strict';
  var root = document.querySelector('[data-nfq]');
  if (!root || root.__nfqReady) return;
  root.__nfqReady = true;
  document.documentElement.classList.add('nfq-js');

  var items = [].slice.call(root.querySelectorAll('[data-nfq-item]'));
  var topics = [].slice.call(root.querySelectorAll('[data-nfq-topic]'));
  var input = root.querySelector('[data-nfq-input]');
  var clearBtn = root.querySelector('[data-nfq-clear]');
  var statusEl = root.querySelector('[data-nfq-status]');
  var emptyEl = root.querySelector('[data-nfq-empty]');
  var termEl = root.querySelector('[data-nfq-term]');
  var sideLinks = [].slice.call(root.querySelectorAll('[data-nfq-side]'));
  var defaultStatus = statusEl ? statusEl.textContent : '';

  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9%]+/g, ' ').trim();
  }
  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  items.forEach(function (it) {
    it._btn = it.querySelector('.nfq-q__btn');
    it._q = it.querySelector('.nfq-q__t');
    it._qText = it._q ? it._q.textContent : '';
    it._txt = norm(it.textContent + ' ' + (it.getAttribute('data-nfq-keys') || ''));
  });

  function setHash(id) {
    try { history.replaceState(history.state, '', location.pathname + location.search + (id ? '#' + id : '')); } catch (e) {}
  }
  function setOpen(it, open, writeHash) {
    it.classList.toggle('is-open', open);
    if (it._btn) it._btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) it._auto = false;
    if (writeHash) setHash(open ? it.id : '');
  }
  items.forEach(function (it) {
    if (!it._btn) return;
    it._btn.addEventListener('click', function () {
      var open = !it.classList.contains('is-open');
      it._auto = false;
      setOpen(it, open, true);
    });
  });

  function scrollToEl(el, smooth) {
    requestAnimationFrame(function () {
      el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    });
  }
  function goHash(smooth) {
    var id = '';
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (e) { return; }
    if (!id) return;
    var el = document.getElementById(id);
    if (!el || !root.contains(el)) return;
    if (el.hasAttribute('data-nfq-item')) {
      if (input && input.value) { input.value = ''; run(); }
      setOpen(el, true, false);
      el.classList.add('is-flash');
      setTimeout(function () { el.classList.remove('is-flash'); }, 2200);
      if (el._btn) { try { el._btn.focus({ preventScroll: true }); } catch (e) {} }
    }
    scrollToEl(el, smooth);
  }
  window.addEventListener('hashchange', function () { goHash(true); });

  root.addEventListener('click', function (e) {
    var copy = e.target.closest('[data-nfq-copy]');
    if (copy) {
      var it = copy.closest('[data-nfq-item]');
      var url = location.origin + location.pathname + '#' + it.id;
      var label = copy.querySelector('span');
      var done = function () {
        var old = label.getAttribute('data-old') || label.textContent;
        label.setAttribute('data-old', old);
        label.textContent = 'Link copied';
        copy.classList.add('is-done');
        clearTimeout(copy._t);
        copy._t = setTimeout(function () { label.textContent = old; copy.classList.remove('is-done'); }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done);
      else done();
      setHash(it.id);
      return;
    }
    if (e.target.closest('[data-nfq-reset]')) { if (input) { input.value = ''; run(); input.focus(); } return; }
    var a = e.target.closest('a[href^="#"]');
    if (a && root.contains(a)) {
      var id = a.getAttribute('href').slice(1);
      var el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      if (input && input.value) { input.value = ''; run(); }
      setHash(id);
      scrollToEl(el, true);
    }
  });

  function mark(el, text, re) {
    var parts = text.split(re);
    el.textContent = '';
    for (var i = 0; i < parts.length; i++) {
      if (!parts[i]) continue;
      if (i % 2) { var m = document.createElement('mark'); m.textContent = parts[i]; el.appendChild(m); }
      else el.appendChild(document.createTextNode(parts[i]));
    }
  }

  function run() {
    if (!input) return;
    var raw = input.value.trim();
    var q = norm(raw);
    var terms = q ? q.split(' ') : [];
    if (clearBtn) clearBtn.hidden = !raw;
    var re = null;
    var hl = terms.filter(function (t) { return t.length > 1; }).map(escRe);
    if (hl.length) re = new RegExp('(' + hl.join('|') + ')', 'gi');
    var shown = [];
    items.forEach(function (it) {
      var ok = !terms.length || terms.every(function (t) { return it._txt.indexOf(t) > -1; });
      it.hidden = !ok;
      if (it._q) {
        if (ok && re) mark(it._q, it._qText, re);
        else it._q.textContent = it._qText;
      }
      if (ok) shown.push(it);
    });
    topics.forEach(function (t) { t.hidden = !t.querySelector('[data-nfq-item]:not([hidden])'); });
    sideLinks.forEach(function (l) {
      var t = document.getElementById(l.getAttribute('data-nfq-side'));
      l.parentNode.hidden = !!(t && t.hidden);
    });
    items.forEach(function (it) { if (it._auto && (it.hidden || !terms.length || shown.length > 3)) setOpen(it, false, false); });
    if (terms.length && shown.length > 0 && shown.length <= 3) {
      shown.forEach(function (it) { if (!it.classList.contains('is-open')) { it._auto = true; setOpen(it, true, false); } });
    }
    if (emptyEl) {
      emptyEl.hidden = !(terms.length && shown.length === 0);
      if (termEl) termEl.textContent = raw;
    }
    if (statusEl) {
      if (!terms.length) statusEl.textContent = defaultStatus;
      else {
        statusEl.textContent = '';
        var s = document.createElement('strong');
        s.textContent = shown.length === 0 ? 'No answers' : shown.length + (shown.length === 1 ? ' answer' : ' answers');
        statusEl.appendChild(s);
        statusEl.appendChild(document.createTextNode(' for “' + raw + '”'));
      }
    }
  }

  if (input) {
    var tId = 0;
    input.addEventListener('input', function () { clearTimeout(tId); tId = setTimeout(run, 60); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { input.value = ''; run(); }
      if (e.key === 'Enter') {
        e.preventDefault();
        var first = root.querySelector('[data-nfq-item]:not([hidden])');
        if (first && input.value.trim()) { setOpen(first, true, true); scrollToEl(first, true); }
      }
    });
    var form = root.querySelector('[data-nfq-form]');
    if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });
  }
  if (clearBtn) clearBtn.addEventListener('click', function () { input.value = ''; run(); input.focus(); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || !input || e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName))) return;
    e.preventDefault();
    input.focus();
  });

  if ('IntersectionObserver' in window && sideLinks.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        sideLinks.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('data-nfq-side') === en.target.id); });
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    topics.forEach(function (t) { io.observe(t); });
  }

  var pre = '';
  try { pre = new URLSearchParams(location.search).get('q') || ''; } catch (e) {}
  if (pre && input) { input.value = pre; run(); }
  if (location.hash) goHash(false);
})();
