/* NF-MENUS-DEFER (2026-09-14, owner: "make the page load faster", "don't remove anything that makes the store look good").
   The phone drawer's sub panels (46 of them) and the four desktop top bar dropdowns (Best Sellers, Shop By, Ideas & Guides,
   Professionals) used to be printed into every page: about 107KB of HTML and 1,280 elements that nobody sees until they
   open a menu. They now come from sections/nf-menus-deferred.liquid (same snippets, same markup) and this file puts them
   back into their places:
     1. a copy saved earlier in this browser tab session is used at once (every page after the first is instant);
     2. otherwise the section is fetched after the page has loaded, or sooner on the first pointer, touch or key;
     3. a saved copy is refreshed in the background after load, so menu edits show up on the next page.
   nf-topbar.js and nf-drawer-v2.js wait for window.__nfMenus before opening or decorating anything, so a menu opened in
   the first split second fills the moment the markup lands instead of showing empty.
   Rollback: set nf_menus_defer to false in snippets/nf-topbar.liquid and snippets/header-sidebar.liquid. */
(function () {
  'use strict';
  if (window.__nfMenus) return;
  var me = document.currentScript;
  var KEY = 'nfMenus:' + ((me && me.getAttribute('data-nf-menus-key')) || '0');
  var URL_ = ((me && me.getAttribute('data-nf-menus-url')) || '/') + '?section_id=nf-menus-deferred';
  var M = window.__nfMenus = { loaded: false };
  var resolveReady;
  M.ready = new Promise(function (r) { resolveReady = r; });

  function inject(html) {
    if (M.loaded || M.busy) return true;
    if (!html || html.indexOf('data-nf-menus-') < 0) return false;
    var box = document.createElement('div');
    box.innerHTML = html;
    var dr = box.querySelector('template[data-nf-menus-drawer]');
    var tbs = box.querySelectorAll('template[data-nf-menus-tb]');
    if (!dr && !tbs.length) return false;
    var sc = document.querySelector('#sidebar-menu header-sidebar-collapsible-panel > .header-sidebar__scroller');
    /* NF-SPEED-A-0916: the drawer, each top bar panel and the finish now go in as separate short tasks instead of one ~130ms block on phones. */
    var nfSteps = [];
    nfSteps.push(function () { if (dr && sc && !sc.querySelector('.header-sidebar__sub-panel')) sc.appendChild(document.importNode(dr.content, true)); });
    Array.prototype.forEach.call(tbs, function (t) { nfSteps.push(function () {
      var slot = document.getElementById('nf-tb-panel-' + t.getAttribute('data-nf-menus-tb'));
      if (slot && !slot.firstElementChild) slot.appendChild(document.importNode(t.content, true));
    }); });
    nfSteps.push(function () {
    M.loaded = true;
    document.documentElement.classList.add('nf-menus-in');
    /* a drawer panel tapped before the markup arrived: show it now */
    var cp = document.querySelector('#sidebar-menu header-sidebar-collapsible-panel');
    var id = cp && cp.getAttribute('aria-activedescendant');
    var p = id && document.getElementById(id);
    if (p && p.hidden) p.hidden = false;
    try { document.dispatchEvent(new CustomEvent('nf:menus-loaded')); } catch (e) {}
    resolveReady();
    });
    M.busy = true;
    (function nfRun() { var f = nfSteps.shift(); if (f) f(); if (nfSteps.length) setTimeout(nfRun, 0); })();
    return true;
  }

  var inflight = null, tries = 0;
  function get() {
    if (!inflight) {
      inflight = fetch(URL_, { credentials: 'same-origin' })
        .then(function (r) { if (!r.ok) throw new Error('status ' + r.status); return r.text(); })
        .then(function (h) {
          if (h.indexOf('data-nf-menus-') < 0) throw new Error('empty');
          try { sessionStorage.setItem(KEY, h); } catch (e) {}
          return h;
        });
      inflight.catch(function () {
        inflight = null;
        if (++tries < 3 && !M.loaded) setTimeout(function () { M.load(); }, 1200 * tries);
      });
    }
    return inflight;
  }
  M.load = function () {
    if (!M.loaded) get().then(inject, function () {});
    return M.ready;
  };

  var cached = null;
  try { cached = sessionStorage.getItem(KEY); } catch (e) {}
  var fromCache = !!(cached && inject(cached));

  var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 300); };
  function afterLoad(f) {
    if (document.readyState === 'complete') idle(f, { timeout: 1200 });
    else window.addEventListener('load', function () { idle(f, { timeout: 1200 }); }, { once: true });
  }

  if (fromCache) {
    afterLoad(function () { get().catch(function () {}); });
    return;
  }
  function early() {
    ['pointerover', 'pointerdown', 'touchstart', 'keydown', 'focusin'].forEach(function (t) { document.removeEventListener(t, early, true); });
    M.load();
  }
  ['pointerover', 'pointerdown', 'touchstart', 'keydown', 'focusin'].forEach(function (t) { document.addEventListener(t, early, { capture: true, passive: true }); });
  afterLoad(function () { M.load(); });
})();
