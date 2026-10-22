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
  /* NF-MENU-SPEED (2026-10-22): 2x is the most a 48-360px menu photo needs (3x phones were pulling 1200px files), and
     cdn.shopify.com file URLs are served from the shop's own /cdn/shop/ path, so no second DNS + TLS connection. */
  function sized(u, cssW) {
    if (!u) return '';
    var need = cssW * Math.min(window.devicePixelRatio || 1, 2), b = [120, 180, 240, 360, 480, 720, 960], w = 960;
    for (var i = 0; i < b.length; i++) { if (b[i] >= need) { w = b[i]; break; } }
    u = String(u).replace(/^(https?:)?\/\/cdn\.shopify\.com\/s\/files\/1\/0750\/8380\/8820\//, '/cdn/shop/');
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
    'autumn at home': 'https://cdn.shopify.com/s/files/1/0750/8380/8820/files/Sf155150a3621467292178e7cfaea3226f.webp'
    /* 2026-10-22: 'new arrivals' removed, its photo now comes from snippets/nf-menu-picks.liquid via the photo map */
  };
  /* NF-MENU-IMG (round 16): photos printed by the server for every menu row (snippets/nf-menu-img-map.liquid):
     #nfd-img-map (first level, in the page) and #nfd-img-map-all (every level, arrives with the sub panels).
     Checked before the old copy-from-the-desktop-dropdowns fallback, which a phone never has. */
  var MAP = {};
  function readMap() {
    ['nfd-img-map', 'nfd-img-map-all'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || el._nfd) return;
      try { var o = JSON.parse(el.textContent); for (var k in o) if (!MAP[k]) MAP[k] = o[k]; el._nfd = 1; } catch (e) {}
    });
  }
  function mapFor(title, href) { var p = path(href); return (p && MAP[p]) || MAP['t:' + norm(title)] || ''; }
  function imgFor(title, href) {
    var t = norm(title), p = path(href) || path(H.tb[t]) || path(HREF[t]);
    if (IMG[t]) return IMG[t];
    return mapFor(t, p) || (p && H.h[p]) || H.t[t] || (PIC[t] && H.h[PIC[t]]) || '';
  }
  function mkImg(u, w, cls) {
    var i = document.createElement('img');
    i.className = 'nfd-img' + (cls ? ' ' + cls : '');
    i.alt = '';
    i.decoding = 'async';
    i.setAttribute('data-nfd-src', sized(u, w));
    return i;
  }
  /* NF-MENU-SPEED (2026-10-22): a photo is decoded off the main thread before it fades in, so it never pops in half
     painted; tiles and heroes ask for high fetch priority when they are the thing the shopper is looking at. */
  function reveal(i) { i.removeAttribute('data-nfd-dec'); i.classList.add('is-in'); }
  function loadIn(root, hi) {
    if (!root) return;
    Array.prototype.forEach.call(root.querySelectorAll('img[data-nfd-src]'), function (i) {
      if (hi) try { i.fetchPriority = 'high'; } catch (e) {}
      if (i.decode) i.setAttribute('data-nfd-dec', '1');
      i.addEventListener('error', function () { reveal(i); }, { once: true });
      i.addEventListener('load', function () {
        if (i.decode) i.decode().then(function () { reveal(i); }, function () { reveal(i); }); else reveal(i);
      }, { once: true });
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
    /* 2026-10-22 (owner): the four tiles use room photos from active products, each different and none of the homepage heroes:
       Best Sellers = Thicket (dining room), New Arrivals = Ginkgo (dining), Shop By = Forge (vaulted living room), Sale = Lunette (on sale, poolside deck). */
    /* NF-MENU-PICKS (2026-10-22, owner: "absolute beauties"): Best Sellers, New Arrivals and Sale take their photo from
       snippets/nf-menu-picks.liquid through the photo map (Cirrus ring chandelier in a grand foyer, Rhapsody butterfly
       chandelier in a double height living room, Nimbus cloud pendants over a cream living room); the constants below are
       only the fallback when the map is missing. w is the tile's CSS width (about 165px on a phone), not a pixel width:
       it was 520, which made 3x phones download 1200px files for each tile. */
    var TILE = { bs: 'https://cdn.shopify.com/s/files/1/0750/8380/8820/files/multi-light-pendant-chandelier-rustic-dining-room.webp', na: 'https://cdn.shopify.com/s/files/1/0750/8380/8820/files/black-geometric-chandelier-leaf-design-modern-dining-table.jpg',
      sb: 'https://cdn.shopify.com/s/files/1/0750/8380/8820/files/candles-chandelier-vaulted-living-room.jpg', sale: 'https://cdn.shopify.com/s/files/1/0750/8380/8820/files/moon-shaped-stone-light-poolside-deck-lounge.jpg' };
    var TW = 200;
    tile('Best Sellers', MAP['/collections/best-sellers'] || TILE.bs, { w: TW, href: H.tb['best sellers'] || '/collections/best-sellers' });
    tile('New Arrivals', MAP['/collections/new-arrivals'] || TILE.na, { w: TW, href: '/collections/new-arrivals' });
    /* 2026-10-19: Shop By now opens main-menu-v3's Shop By (Room, New Collections, Style, Collection) */
    if (byT['shop by']) tile('Shop By', TILE.sb, { w: TW, btn: byT['shop by'], sub: 'Room, style, collection' });
    /* 2026-10-22 (owner: cleaner menu): the four tiles (Best Sellers, New Arrivals, Shop By, Sale) are not repeated as rows below */
    ['shop by', 'best sellers', 'new arrivals', 'sale'].forEach(function (t) { var r = byT[t] && byT[t].closest('li'); if (r) r.classList.add('nfd-hide-ext'); });
    /* NF-SALE-TILE-V1 (2026-09-13): real warm photo for the Sale tile (Shopify File nf-sale-tile-lantern-v2.jpg, 720x360), sharper 520w request; red Sale chip is CSS. */
    /* 2026-10-22 (owner: the lantern photo looked off): a clean photo of an active sale product, Chandra full moon wall lamp. */
    tile('Sale', MAP['/collections/sale'] || TILE.sale, { w: TW, href: '/collections/sale', cls: 'nfd-tile--sale', sub: 'Shop the markdowns' });
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
      /* 2026-10-22 (owner): the rows under More to explore (Professionals, Trade Program) have no photo */
      var t = textOf(b), u = li.classList.contains('nf-tb-drawer-item') ? '' : imgFor(t, b.getAttribute('href'));
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
        u = mapFor(t) || imgFor(t);
        if (!u) {
          var tp = document.getElementById(b.getAttribute('data-target'));
          var fa = tp && tp.querySelectorAll('a.header-sidebar__linklist-button');
          for (var i = 0; fa && i < fa.length && !u; i++) u = H.h[path(fa[i].getAttribute('href'))] || '';
        }
      } else {
        u = mapFor(t, b.getAttribute('href')) || H.h[path(b.getAttribute('href'))] || H.t[t] || '';
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

  /* round 16: the first level (tiles, rows, photos) is built at once from the photo map in the page; the sub panels
     are decorated the moment their markup lands (assets/nf-menus.js), instead of the whole drawer waiting for it */
  function panels() {
    if (!cp) return;
    H = harvest(); readMap();
    Array.prototype.forEach.call(cp.querySelectorAll('.header-sidebar__sub-panel'), buildPanel);
    /* warm every first level panel's photos while the shopper is still looking at the list */
    if (sb.hasAttribute('open')) warmAll();
  }
  var warmed = false;
  var idleCb = window.requestIdleCallback || function (f) { return setTimeout(f, 250); };
  /* NF-MENU-SPEED (2026-10-22): warm one level ahead instead of all ~240 panel photos at once. When the drawer is open
     the first level panels (Indoor, Outdoor, Decor, Shop By, Inspirations) load; when one of those is opened, the
     panels its rows lead to load in the background; a finger on any row still loads its panel at once (pointerdown). */
  function childPanels(p) {
    var out = [];
    Array.prototype.forEach.call(p.querySelectorAll('[data-target], [aria-controls^="header-panel"]'), function (b) {
      var c = document.getElementById(b.getAttribute('data-target') || b.getAttribute('aria-controls'));
      if (c && c !== p && c.classList.contains('header-sidebar__sub-panel')) out.push(c);
    });
    return out;
  }
  function warmAhead(p) {
    if (!p) return;
    idleCb(function () { childPanels(p).forEach(function (c) { loadIn(c); }); }, { timeout: 2000 });
  }
  function warmAll() {
    if (warmed || !cp) return; warmed = true;
    /* 2026-10-22: wait until the drawer has finished sliding in (photos that start loading during the slide make it stutter) */
    setTimeout(function () { warmAhead(sb.querySelector('.header-sidebar__main-panel')); }, 700);
  }
  function build() {
    if (built) return true;
    sb = document.getElementById('sidebar-menu');
    if (!sb) return false;
    cp = sb.querySelector('header-sidebar-collapsible-panel');
    H = harvest(); readMap();
    if (!buildMain()) return false;
    sb.classList.add('nfd2');
    document.documentElement.classList.add('nfd2-on');
    built = true;
    var MN = window.__nfMenus;
    if (MN && !MN.loaded) { MN.load().then(panels); } else panels();
    if (cp) {
      new MutationObserver(function () {
        var id = activeId(), p = id && document.getElementById(id);
        if (!p) return;
        loadIn(p, true);
        warmAhead(p);
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
      if (p) loadIn(p, true);
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
    loadIn(main, true);
    var MN = window.__nfMenus;
    if (!MN || MN.loaded) warmAll();
  }
  /* NF-MENU-SPEED (2026-10-22): the first screen of the drawer (4 tiles + about 9 row thumbnails, roughly 150KB at
     200/48px CSS widths) is fetched while the page sits idle after load, so the menu opens with its photos already
     there. Skipped with Save-Data or on 2G. */
  function lowData() {
    var c = navigator.connection;
    return !!(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || '')));
  }
  function preloadFirstScreen() {
    if (!MQ.matches || lowData()) return;
    if (build()) loadIn(sb.querySelector('.header-sidebar__main-panel'));
  }
  function init() {
    var s = document.getElementById('sidebar-menu');
    if (!s) return;
    s.addEventListener('dialog:before-show', onOpen);
    if (s.hasAttribute('open')) onOpen();
    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 300); };
    idle(function () { if (MQ.matches) build(); }, { timeout: 1500 });
    var afterLoad = function () { idle(preloadFirstScreen, { timeout: 4000 }); };
    if (document.readyState === 'complete') afterLoad(); else window.addEventListener('load', afterLoad, { once: true });
    /* the drawer is usually opened with a tap on the menu button: start its first photos on touch down */
    document.addEventListener('pointerdown', function (e) {
      if (!MQ.matches || !e.target.closest || !e.target.closest('[aria-controls="sidebar-menu"]')) return;
      if (build()) loadIn(sb.querySelector('.header-sidebar__main-panel'), true);
    }, { capture: true, passive: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* NF-DRAWER-REVEAL-0927: drawer pictures sometimes stayed at opacity 0 because the markup is rebuilt after the load
   listener was attached. Reveal any .nfd-img that has loaded, whenever it loads or the drawer changes. */
(function(){if(window.__nfdReveal)return;window.__nfdReveal=1;
function on(i){if(i&&i.classList&&i.classList.contains('nfd-img')&&!i.classList.contains('is-in')&&!i.hasAttribute('data-nfd-dec')&&i.complete&&i.naturalWidth>0)i.classList.add('is-in')}
/* NF-DRAWER-LAZY-V1 (2026-10-08, site speed): only load a menu photo once the phone drawer is open and its panel is showing. Before, every DOM change hydrated all 233 drawer photos on page load (about 10 MB on the homepage). */ function nfdShown(i){var sb=i.closest('#sidebar-menu');if(sb&&!sb.hasAttribute('open'))return false;if(i.closest('[hidden]'))return false;return true} function sweep(){var a=document.querySelectorAll('img.nfd-img:not(.is-in)');for(var k=0;k<a.length;k++){var i=a[k];if(!i.getAttribute('src')&&i.getAttribute('data-nfd-src')&&nfdShown(i)){i.src=i.getAttribute('data-nfd-src');i.removeAttribute('data-nfd-src')}on(i)}}
document.addEventListener('load',function(e){on(e.target)},true);
var t;new MutationObserver(function(){clearTimeout(t);t=setTimeout(sweep,40)}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['open','class','src']});
document.addEventListener('click',function(){setTimeout(sweep,60);setTimeout(sweep,400)},true);
/* 2026-10-22: the safety sweep only runs while the drawer is open (photos now load one level ahead, so some always wait) */
setInterval(function(){if(document.querySelector('#sidebar-menu[open] img.nfd-img:not(.is-in)'))sweep()},700);
sweep();})();
