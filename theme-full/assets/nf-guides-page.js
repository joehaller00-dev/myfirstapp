/* Nora Furnish Ideas & Guides resource center (2026-09-11). Loaded by sections/nf-guides-page-hero.liquid.
   1. Stories and Projects grid ([data-nfg-stories]): filter pills and "Load more", in place, no page reload.
      Without JS every card simply shows.
   2. Review wall ([data-nfg-rv]): on phones only the first cards show until "Show more reviews" is pressed.
   Re-runs for the theme editor on shopify:section:load. */
(function () {
  'use strict';

  function toArray(list) { return Array.prototype.slice.call(list || []); }

  function initStories(root) {
    if (!root || root.__nfgReady) return;
    var list = root.querySelector('[data-nfg-posts]');
    if (!list) return;
    root.__nfgReady = true;
    var cards = toArray(list.children).filter(function (el) { return el.classList.contains('nfg-post'); });
    var pills = toArray(root.querySelectorAll('[data-nfg-filter]'));
    var more = root.querySelector('[data-nfg-more]');
    var status = root.querySelector('[data-nfg-status]');
    var first = parseInt(list.getAttribute('data-first'), 10) || 9;
    var step = parseInt(list.getAttribute('data-step'), 10) || 6;
    var filter = 'all';
    var shown = first;

    function matches(card) {
      if (filter === 'all') return true;
      return (' ' + (card.getAttribute('data-cats') || '') + ' ').indexOf(' ' + filter + ' ') > -1;
    }

    function render(focusIndex) {
      var pool = cards.filter(matches);
      cards.forEach(function (card) { card.hidden = true; });
      pool.forEach(function (card, i) { if (i < shown) card.hidden = false; });
      if (more) more.hidden = pool.length <= shown;
      if (status) {
        status.textContent = pool.length
          ? 'Showing ' + Math.min(shown, pool.length) + ' of ' + pool.length + (pool.length === 1 ? ' post' : ' posts')
          : 'No posts in this topic yet';
      }
      if (typeof focusIndex === 'number' && pool[focusIndex]) {
        var link = pool[focusIndex].querySelector('a');
        if (link) {
          try { link.focus({ preventScroll: true }); } catch (e) { link.focus(); }
        }
      }
    }

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        filter = pill.getAttribute('data-nfg-filter') || 'all';
        shown = first;
        pills.forEach(function (p) { p.setAttribute('aria-pressed', p === pill ? 'true' : 'false'); });
        render();
      });
    });

    if (more) {
      more.addEventListener('click', function () {
        var from = shown;
        shown += step;
        render(from);
      });
    }

    render();
  }

  function initReviews(wall) {
    if (!wall || wall.__nfgReady) return;
    wall.__nfgReady = true;
    wall.setAttribute('data-ready', '');
    var section = wall.closest('section') || wall.parentNode;
    var btn = section ? section.querySelector('[data-nfg-rv-more]') : null;
    if (!btn) return;
    btn.addEventListener('click', function () {
      wall.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      var firstExtra = wall.querySelector('.nfg-rv--extra a, .nfg-rv--extra');
      if (firstExtra && firstExtra.focus) {
        if (!firstExtra.hasAttribute('tabindex') && firstExtra.tagName !== 'A') firstExtra.setAttribute('tabindex', '-1');
        try { firstExtra.focus({ preventScroll: true }); } catch (e) { firstExtra.focus(); }
      }
    });
  }

  function boot(scope) {
    var root = scope || document;
    toArray(root.querySelectorAll('[data-nfg-stories]')).forEach(initStories);
    toArray(root.querySelectorAll('[data-nfg-rv]')).forEach(initReviews);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { boot(); });
  } else {
    boot();
  }
  document.addEventListener('shopify:section:load', function (e) { boot(e.target); });
})();
