/* NF-STORY-V1 (2026-09-11) Our Story hub filters. Loaded by sections/nf-story-hub.liquid.
   Pills filter the cards in place (no reload), counts are filled in per pill, "Load more" reveals the next batch and
   moves focus to the first new card. The chosen topic is kept in ?topic= so a filtered view can be linked.
   Without JS every card shows. Re-runs on shopify:section:load for the theme editor. */
(function () {
  'use strict';
  var TOPICS = ['all', 'indoor', 'outdoor', 'style', 'concepts'];

  function arr(list) { return Array.prototype.slice.call(list || []); }

  function init(root) {
    if (!root || root.__nfsReady) return;
    var list = root.querySelector('[data-nfs-list]');
    if (!list) return;
    root.__nfsReady = true;

    var cards = arr(list.children).filter(function (el) { return el.classList && el.classList.contains('nfs-card'); });
    var pills = arr(root.querySelectorAll('[data-nfs-filter]'));
    var more = root.querySelector('[data-nfs-more]');
    var status = root.querySelector('[data-nfs-status]');
    var first = parseInt(list.getAttribute('data-first'), 10) || 12;
    var step = parseInt(list.getAttribute('data-step'), 10) || 9;
    var filter = 'all';
    var shown = first;

    function has(card, f) {
      return f === 'all' || (' ' + (card.getAttribute('data-cats') || '') + ' ').indexOf(' ' + f + ' ') > -1;
    }

    pills.forEach(function (pill) {
      var f = pill.getAttribute('data-nfs-filter');
      var n = cards.filter(function (c) { return has(c, f); }).length;
      var slot = pill.querySelector('.nfs-pill__n');
      if (slot) slot.textContent = String(n);
      if (!n && f !== 'all') pill.hidden = true;
    });

    function render(animateFrom, focusIndex) {
      var pool = cards.filter(function (c) { return has(c, filter); });
      var reveal = [];
      cards.forEach(function (card) {
        var i = pool.indexOf(card);
        var visible = i > -1 && i < shown;
        if (!visible) { card.hidden = true; card.classList.remove('is-in'); return; }
        if (card.hidden || (typeof animateFrom === 'number' && i >= animateFrom)) reveal.push([card, i]);
        card.hidden = false;
      });
      if (reveal.length) {
        reveal.forEach(function (r) { r[0].classList.remove('is-in'); });
        void list.offsetWidth; // restart the fade for cards shown again
        var base = typeof animateFrom === 'number' ? animateFrom : 0;
        reveal.forEach(function (r) {
          r[0].style.setProperty('--nfs-d', Math.min(Math.max(r[1] - base, 0), 8) * 45 + 'ms');
          r[0].classList.add('is-in');
        });
      }
      if (more) more.hidden = pool.length <= shown;
      if (status) {
        status.textContent = pool.length
          ? 'Showing ' + Math.min(shown, pool.length) + ' of ' + pool.length + (pool.length === 1 ? ' story' : ' stories')
          : 'Nothing in this topic yet';
      }
      if (typeof focusIndex === 'number' && pool[focusIndex]) {
        var link = pool[focusIndex].querySelector('a');
        if (link) { try { link.focus({ preventScroll: true }); } catch (e) { link.focus(); } }
      }
    }

    function setFilter(f, fromUser) {
      if (TOPICS.indexOf(f) < 0) f = 'all';
      filter = f;
      shown = first;
      pills.forEach(function (p) { p.setAttribute('aria-pressed', p.getAttribute('data-nfs-filter') === f ? 'true' : 'false'); });
      render(0);
      if (fromUser && window.history && history.replaceState) {
        try {
          var url = new URL(window.location.href);
          if (f === 'all') url.searchParams.delete('topic'); else url.searchParams.set('topic', f);
          history.replaceState(history.state, '', url.pathname + url.search + url.hash);
        } catch (e) { /* ignore */ }
      }
    }

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () { setFilter(pill.getAttribute('data-nfs-filter') || 'all', true); });
    });

    if (more) {
      more.addEventListener('click', function () {
        var from = shown;
        shown += step;
        render(from, from);
      });
    }

    var initial = 'all';
    try { initial = new URL(window.location.href).searchParams.get('topic') || 'all'; } catch (e) { /* ignore */ }
    filter = TOPICS.indexOf(initial) > -1 ? initial : 'all';
    pills.forEach(function (p) { p.setAttribute('aria-pressed', p.getAttribute('data-nfs-filter') === filter ? 'true' : 'false'); });
    render();
  }

  function boot(scope) { arr((scope || document).querySelectorAll('[data-nfs]')).forEach(init); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { boot(); });
  else boot();
  document.addEventListener('shopify:section:load', function (e) { boot(e.target); });
})();
