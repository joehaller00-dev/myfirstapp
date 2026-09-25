/* NF-DRAWER-V2 (2026-09-12): phone drawer redesign.
   Enhances the markup printed by snippets/header-sidebar.liquid: quick tiles, rounded category thumbnails,
   hero image on every sub panel, photo grids for Shop By lists, grouped info links, Sale in red,
   Escape and phone back step out one level. Images come from the header's own desktop panels
   (Shop By tiles, mega menu figures, best seller cards) and load only when the drawer or a panel opens.
   Rollback: remove the two NF-DRAWER-V2 lines at the top of snippets/header-sidebar.liquid. */
(function () {
  'use strict';
  if (window.__nfd2) return;
  window.__nfd2 = 1;
  var MQ = window.matchMedia('(max-width: 999px)');
  var BAN = /BRANDED_1_CLEAN|nf-custom-chandelier-foyer|image_1787959349000_216dae9f|rgb-dimmable/i;
  // title -> page used for the "Shop all" link when a panel has no "All ..." row
  var HREF = {
    'sale': '/collections/sale', 'ceiling lights': '/collections/ceiling-light', 'wall lights': '/collections/wall-lights',
    'lamps': '/collections/lamps', 'ambient lighting': '/collections/ambient-lighting', 'outdoor lighting': '/collections/outdoor-lighting',
    'decor': '/collections/decor', 'soft furnishings': '/collections/soft-furnishings', 'home fragrance': '/collections/home-fragrance',
    'shelves & storage': '/collections/storage-shelves', 'poufs & floor seating': '/collections/poufs-floor-cushions',
    'poufs & floor cushions': '/collections/poufs-floor-cushions', 'best sellers': '/collections/best-sellers',
    'new arrivals': '/collections/new-arrivals', 'professionals': '/pages/professionals'
  };
  // title -> page whose photo stands in when the title itself has none
  var PIC = {
    'sale': '/collections/clearance', 'best sellers': '/collections/best-sellers-indoor', 'shop by': '/collections/living-room',
    'ideas & guides': '/pages/catalog', 'professionals': '/pages/hospitality-lighting-projects', 'featured': '/collections/new-arrivals',
    'made to order': '/pages/hospitality-lighting-projects', 'industries': '/pages/hospitality-lighting-projects'
  };
  var H = null, sb = null, cp = null, built = false, waitBuild = false;

  function norm(t) { return String(t || '').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function path(u) {
    if (!u) return '';
    try { return new URL(u, location.origin).pathname.replace(/\/+$/, '').toLowerCase(); } catch (e) { return ''; }
  }
  function srcOf(img) {
    var s = img.getAttribute('src') || img.getAttribute('data-src') || '';
    if (!s || s.indexOf('data:') === 0) {
      var ss = img.getAttribute('srcset') || img.getAttribute('data-srcset') || '';
      s = ss.split(',')[0].trim().split(' ')[0];
    }
    return s;
  }
  function sized(u, cssW) {
    if (!u) return '';
    var need = cssW * Math.min(window.devicePixelRatio || 1, 2.6), b = [120, 180, 240, 360, 480, 720, 960, 1200], w = 1200;
    for (var i = 0; i < b.length; i++) { if (b[i] >= need) { w = b[i]; break; } }
    if (u.indexOf('//') === 0) u = 'https:' + u;
    try {
      var x = new URL(u, location.origin);
      ['width', 'height', 'crop'].forEach(function (k) { x.searchParams.delete(k); });
      x.searchParams.set('width', w);
      return x.toString();
    } catch (e) { return u; }
  }
  function harvest() {
    var byHref = {}, byTitle = {};
    var sel = '.nf-sb2__tile, .nf-sb2__feat, .nf-bs2__card, .mega-menu__figure, .nf-pr2__ind-main';
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (a) {
      if (a.closest('#sidebar-menu')) return;
      var img = a.querySelector('img');
      if (!img) return;
      var s = srcOf(img);
      if (!s || BAN.test(s)) return;
      var p = path(a.getAttribute('href'));
      if (p && !byHref[p]) byHref[p] = s;
      if (a.matches('.nf-sb2__tile, .mega-menu__figure')) {
        var cap = a.querySelector('figcaption, .mega-menu__figure-caption, span, p');
        var t = norm((cap && cap.textContent) || a.textContent);
        if (t && t.length < 40 && !byTitle[t]) byTitle[t] = s;
      }
    });
    var tb = {};
    Array.prototype.forEach.call(document.querySelectorAll('.nf-topbar a[href]'), function (a) {
      var t = norm(a.textContent);
      if (t && t.length < 30 && !tb[t]) tb[t] = a.getAttribute('href');
    });
    return { h: byHref, t: byTitle, tb: tb };
  }
  // NF-DRAWER-V3 (2026-09-13): a sub panel hero uses its collection's own photo (the curated NF-COLHEAD band image and
  // its custom.nf_band_pos), printed by snippets/header-sidebar.liquid as #nfd-hero-map, so the 16:10 crop no longer cuts
  // tall products out of the portrait mega menu figures. Falls back to imgFor() when a group has no entry.
  var HM = null;
  function heroMap() {
    if (HM === null) { try { var s = document.getElementById('nfd-hero-map'); HM = s ? JSON.parse(s.textContent) : {}; } catch (e) { HM = {}; } }
    return HM;
  }
  function heroFor(href) { var p = path(href), e = p && heroMap()[p]; return e && e.u && !BAN.test(e.u) ? e : null; }
  /* NF-DRAWER-IMG-0921: hand picked row and tile photos (owner 2026-09-21) */
  var IMG = {
    'grand collection': 'https://cdn.shopify.com/s/files/1/0750/8380/8820/files/ceramic-crystal-led-chandelier-bedroom.jpg',
    'autumn at home': 'https://cdn.shopify.com/s/files/1/0750/8380/8820/files/Sf155150a3621467292178e7cfaea3226f.webp',
    'new arrivals': 'https://cdn.shopify.com/s/files/1/0750/8380/8820/files/staircase-lighting-chandelier-sleek-luxurious-living-room.jpg'
  };
  function imgFor(title, href) {
    var t = norm(title), p = path(href) || path(H.tb[t]) || path(HREF[t]);
    if (IMG[t]) return IMG[t];
    return (p && H.h[p]) || H.t[t] || (PIC[t] && H.h[PIC[t]]) || '';
  }
  function mkImg(u, w, cls) {
    var i = document.createElement('img');
    i.className = 'nfd-img' + (cls ? ' ' + cls : '');
    i.alt = '';
    i.decoding = 'async';
    i.setAttribute('data-nfd-src', sized(u, w));
    return i;
  }
  function loadIn(root) {
    if (!root) return;
    Array.prototype.forEach.call(root.querySelectorAll('img[data-nfd-src]'), function (i) {
      i.addEventListener('load', function () { i.classList.add('is-in'); }, { once: true });
      i.src = i.getAttribute('data-nfd-src');
      i.removeAttribute('data-nfd-src');
    });
  }
  function thumb(u) {
    var s = document.createElement('span');
    s.className = 'nfd-thumb';
    s.setAttribute('aria-hidden', 'true');
    s.appendChild(mkImg(u, 48));
    return s;
  }
  function textOf(el) {
    var t = '';
    Array.prototype.forEach.call(el.childNodes, function (n) { if (n.nodeType === 3) t += n.textContent; });
    return norm(t) || norm(el.textContent);
  }
  function isSale(t) { return t === 'sale'; }

  function buildTiles(list) {
    var rows = list.querySelectorAll(':scope > li > .header-sidebar__linklist-button');
    var byT = {};
    Array.prototype.forEach.call(rows, function (b) { byT[textOf(b)] = b; });
    var wrap = document.createElement('div');
    wrap.className = 'nfd-tiles';
    function tile(label, u, opts) {
      var el = document.createElement(opts.btn ? 'button' : 'a');
      el.className = 'nfd-tile' + (opts.cls ? ' ' + opts.cls : '');
      if (opts.btn) { el.type = 'button'; el.setAttribute('data-nfd-open', opts.btn.getAttribute('aria-controls') || ''); }
      else el.href = opts.href;
      if (u) el.appendChild(mkImg(u, opts.w || 160));
      var s = document.createElement('span');
      s.className = 'nfd-tile__t';
      s.textContent = label;
      el.appendChild(s);
      if (opts.sub) { var d = document.createElement('span'); d.className = 'nfd-tile__s'; d.textContent = opts.sub; el.appendChild(d); }
      if (opts.btn) el.addEventListener('click', function () { opts.btn.click(); });
      wrap.appendChild(el);
    }
    tile('Best Sellers', H.h['/collections/best-sellers-indoor'] || imgFor('best sellers'), { href: H.tb['best sellers'] || '/collections/best-sellers' });
    tile('New Arrivals', IMG['new arrivals'], { href: '/collections/new-arrivals' });
    if (byT['shop by']) tile('Shop By', imgFor('shop by'), { btn: byT['shop by'], sub: 'Room, style, material' });
    /* NF-SALE-TILE-V1 (2026-09-13): real warm photo for the Sale tile (Shopify File nf-sale-tile-lantern-v2.jpg, 720x360), sharper 520w request; red Sale chip is CSS. */
    tile('Sale', 'https://cdn.shopify.com/s/files/1/0750/8380/8820/files/nf-sale-tile-lantern-v2.jpg', { w: 520, href: '/collections/sale', cls: 'nfd-tile--sale', sub: 'Shop the markdowns' });
    return wrap;
  }

  function buildMain() {
    var main = sb.querySelector('.header-sidebar__main-panel');
    var scroller = main && main.querySelector('.header-sidebar__scroller');
    var list = scroller && scroller.querySelector(':scope > .header-sidebar__linklist');
    if (!list) return false;
    scroller.insertBefore(buildTiles(list), list);
    list.classList.add('nfd-main');
    var firstTb = true;
    Array.prototype.forEach.call(list.querySelectorAll(':scope > li'), function (li) {
      var b = li.querySelector(':scope > .header-sidebar__linklist-button');
      if (!b) return;
      var t = textOf(b), u = imgFor(t, b.getAttribute('href'));
      if (u) b.insertBefore(thumb(u), b.firstChild);
      b.classList.add('nfd-row');
      if (isSale(t)) { li.classList.add('nfd-sale'); b.classList.add('nfd-sale'); }
      if (li.classList.contains('nf-tb-drawer-item') && firstTb) { li.classList.add('nfd-first-tb'); firstTb = false; }
    });
    var util = scroller.querySelector('.header-sidebar__utility-links') || sb.querySelector('.header-sidebar__utility-links');
    if (util) {
      util.classList.add('nfd-util');
      var order = ['faq', 'track your order', 'contact', 'about us', 'our story', 'blogs', 'catalog'];
      var links = Array.prototype.slice.call(util.querySelectorAll('a.header-sidebar__utility-link'));
      links.sort(function (a, b) {
        var ia = order.indexOf(norm(a.textContent)), ib = order.indexOf(norm(b.textContent));
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
      }).forEach(function (a) { util.appendChild(a); });
    }
    return true;
  }

  function buildPanel(panel) {
    if (panel.getAttribute('data-nfd')) return;
    panel.setAttribute('data-nfd', '1');
    var back = panel.querySelector(':scope > .header-sidebar__back-button');
    var ul = panel.querySelector(':scope > .header-sidebar__linklist');
    if (!ul) return;
    var title = back ? textOf(back) : '';
    var allA = ul.querySelector('.nf-all-link');
    var href = allA ? allA.getAttribute('href') : (H.tb[title] || HREF[title] || '');
    var rows = Array.prototype.filter.call(ul.querySelectorAll(':scope > li > .header-sidebar__linklist-button'), function (b) {
      return !b.classList.contains('nf-all-link');
    });
    var pics = rows.map(function (b) {
      var t = textOf(b), u;
      if (b.classList.contains('nf-panel-btn')) {
        u = imgFor(t);
        if (!u) {
          var tp = document.getElementById(b.getAttribute('data-target'));
          var fa = tp && tp.querySelectorAll('a.header-sidebar__linklist-button');
          for (var i = 0; fa && i < fa.length && !u; i++) u = H.h[path(fa[i].getAttribute('href'))] || '';
        }
      } else {
        u = H.h[path(b.getAttribute('href'))] || H.t[t] || '';
      }
      return u;
    });
    var have = pics.filter(Boolean).length;
    var anchorsOnly = rows.every(function (b) { return b.tagName === 'A'; });
    var grid = rows.length >= 4 && have === rows.length && anchorsOnly;
    // a photo grid already shows the pictures, so it gets no hero on top
    var heroE = href ? heroFor(href) : null;
    var hero = grid && !href ? '' : ((heroE && heroE.u) || imgFor(title, href) || pics.filter(Boolean)[0] || '');
    if (hero) {
      var el = document.createElement(href ? 'a' : 'div');
      el.className = 'nfd-hero' + (isSale(title) ? ' nfd-hero--sale' : '');
      if (href) el.href = href;
      var heroImg = mkImg(hero, 340);
      if (heroE && heroE.p && /^\d/.test(heroE.p)) heroImg.style.objectPosition = heroE.p;
      el.appendChild(heroImg);
      var tx = document.createElement('span');
      tx.className = 'nfd-hero__txt';
      var h = document.createElement('span');
      h.className = 'nfd-hero__t';
      h.textContent = back ? back.textContent.replace(/\s+/g, ' ').trim() : '';
      tx.appendChild(h);
      if (href) {
        var c = document.createElement('span');
        c.className = 'nfd-hero__cta';
        c.textContent = isSale(title) ? 'Shop the sale' : 'Shop all';
        tx.appendChild(c);
        if (allA && path(allA.getAttribute('href')) === path(href)) allA.closest('li').classList.add('nfd-hide');
      } else el.setAttribute('aria-hidden', 'true');
      el.appendChild(tx);
      if (back) back.insertAdjacentElement('afterend', el); else panel.insertBefore(el, ul);
    }
    if (isSale(title) && back) back.classList.add('nfd-sale');
    if (grid) {
      ul.classList.add('nfd-grid');
      rows.forEach(function (b, i) {
        var f = document.createElement('span');
        f.className = 'nfd-grid__img';
        f.setAttribute('aria-hidden', 'true');
        f.appendChild(mkImg(pics[i], 160));
        b.insertBefore(f, b.firstChild);
      });
    } else if (have === rows.length && rows.length) {
      ul.classList.add('nfd-thumbs');
      rows.forEach(function (b, i) { b.insertBefore(thumb(pics[i]), b.firstChild); });
    }
    rows.forEach(function (b) { b.classList.add('nfd-row'); if (isSale(textOf(b))) b.classList.add('nfd-sale'); });
  }

  function activeId() { return cp && cp.getAttribute('aria-activedescendant'); }
  function goBack(id) {
    var p = document.getElementById(id);
    var bb = p && p.querySelector(':scope > .header-sidebar__back-button');
    if (!bb) return false;
    var parent = bb.getAttribute('data-parent-panel');
    bb.click();
    setTimeout(function () {
      var f = parent ? sb.querySelector('[data-target="' + id + '"]') : sb.querySelector('.header-sidebar__main-panel [aria-controls="' + id + '"]');
      if (f) try { f.focus({ preventScroll: true }); } catch (e) {}
    }, 360);
    return true;
  }

  function build() {
    if (built) return true;
    /* NF-MENUS-DEFER (2026-09-14): the sub panels and the desktop panels this drawer takes its photos from arrive after load
       (assets/nf-menus.js). Build once they are in, so every tile, thumbnail and hero is still there. */
    var MN = window.__nfMenus;
    if (MN && !MN.loaded) {
      if (!waitBuild) {
        waitBuild = true;
        MN.load().then(function () {
          waitBuild = false;
          var s = document.getElementById('sidebar-menu');
          if (s && s.hasAttribute('open')) onOpen(); else if (MQ.matches) build();
        });
      }
      return false;
    }
    sb = document.getElementById('sidebar-menu');
    if (!sb) return false;
    cp = sb.querySelector('header-sidebar-collapsible-panel');
    H = harvest();
    if (!buildMain()) return false;
    sb.classList.add('nfd2');
    document.documentElement.classList.add('nfd2-on');
    built = true;
    if (cp) {
      Array.prototype.forEach.call(cp.querySelectorAll('.header-sidebar__sub-panel'), buildPanel);
      new MutationObserver(function () {
        var id = activeId(), p = id && document.getElementById(id);
        if (!p) return;
        loadIn(p);
        var tries = 0;
        (function settle() {
          if (activeId() !== id) return;
          // the theme fades the old panel for 150ms before it unhides the new one
          if (p.hidden || !p.offsetParent) { if (++tries < 12) setTimeout(settle, 60); return; }
          var bb = p.querySelector(':scope > .header-sidebar__back-button');
          var ae = document.activeElement;
          if (bb && (!ae || ae === document.body || !p.contains(ae))) try { bb.focus({ preventScroll: true }); } catch (e) {}
          var sc = p.closest('.header-sidebar__scroller');
          if (sc && tries < 2) sc.scrollTop = 0;
        })();
      }).observe(cp, { attributes: true, attributeFilter: ['aria-activedescendant'] });
    }
    // warm a panel's hero while the finger is still down
    sb.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('[aria-controls^="header-panel"], [data-target], [data-nfd-open]');
      if (!b) return;
      var id = b.getAttribute('aria-controls') || b.getAttribute('data-target') || b.getAttribute('data-nfd-open');
      var p = id && document.getElementById(id);
      if (p) { var hi = p.querySelector('.nfd-hero img[data-nfd-src]'); if (hi) { hi.src = hi.getAttribute('data-nfd-src'); hi.removeAttribute('data-nfd-src'); hi.addEventListener('load', function () { hi.classList.add('is-in'); }, { once: true }); } }
    }, { passive: true });
    wireHistory();
    return true;
  }

  // Escape steps back one level; at the top level the theme closes the drawer as before
  window.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !built || !sb.hasAttribute('open')) return;
    var id = activeId();
    if (id && goBack(id)) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);

  // Phone back gesture: steps out of a panel, then closes the drawer, instead of leaving the page
  var pushed = false, pending = null;
  function wireHistory() {
    sb.addEventListener('dialog:after-show', function () {
      if (!MQ.matches || pushed) return;
      try { history.pushState({ nfd2: 1 }, ''); pushed = true; } catch (e) {}
    });
    sb.addEventListener('dialog:after-hide', function () {
      if (pushed && !pending) { pushed = false; if (history.state && history.state.nfd2) history.back(); }
    });
    sb.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (!a || !pushed || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
      var u = a.href;
      if (!u || /^(mailto|tel|javascript):/i.test(u) || (path(u) === path(location.href) && u.indexOf('#') > -1)) return;
      e.preventDefault();
      pending = u;
      pushed = false;
      history.back();
      setTimeout(function () { if (pending) { var go = pending; pending = null; location.assign(go); } }, 450);
    });
    window.addEventListener('popstate', function () {
      if (pending) { var go = pending; pending = null; location.assign(go); return; }
      if (!pushed) return;
      pushed = false;
      if (!sb.hasAttribute('open')) return;
      var id = activeId();
      if (id && goBack(id)) { try { history.pushState({ nfd2: 1 }, ''); pushed = true; } catch (e) {} }
      else if (typeof sb.hide === 'function') sb.hide();
      else sb.removeAttribute('open');
    });
  }

  function onOpen() {
    if (!MQ.matches) return;
    if (!build()) return;
    var main = sb.querySelector('.header-sidebar__main-panel');
    loadIn(main);
  }
  function init() {
    var s = document.getElementById('sidebar-menu');
    if (!s) return;
    s.addEventListener('dialog:before-show', onOpen);
    if (s.hasAttribute('open')) onOpen();
    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 1200); };
    idle(function () { if (MQ.matches) build(); }, { timeout: 4000 });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
