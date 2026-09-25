/* nf-catalog.js : Nora Furnish digital catalog viewer (pages/lighting-catalog). */
(function () {
  'use strict';
  if (window.__nfCatalogBooted) return;
  window.__nfCatalogBooted = true;

  var RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  var MQ = window.matchMedia('(max-width: 749px)');
  var ZOOMS = [1, 1.25, 1.5, 2, 2.5, 3];
  var WIDTHS = [240, 360, 480, 640, 800, 1000, 1200, 1500, 1800, 2200];
  var AR = 0.75;
  var SITE = 'norafurnish.com';
  var PLUS = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.5v11M2.5 8h11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/></svg>';
  var CLOSE = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none"/></svg>';
  var FS_ON = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 7.5V3h4.5M12.5 3H17v4.5M17 12.5V17h-4.5M7.5 17H3v-4.5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var FS_OFF = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 3v4.5H3M17 7.5h-4.5V3M12.5 17v-4.5H17M3 12.5h4.5V17" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function cdn(u, w) {
    if (!u) return '';
    u = String(u);
    if (u.indexOf('//') === 0) u = 'https:' + u;
    if (!/cdn\.shopify\.com|\/cdn\/shop\//.test(u)) return u;
    u = u.replace(/([?&])width=\d+(&|$)/, '$1').replace(/[?&]$/, '');
    return u + (u.indexOf('?') > -1 ? '&' : '?') + 'width=' + w;
  }
  function img(u, f, cls, alt, pos, lazy) {
    if (!u) return '';
    var ss = WIDTHS.map(function (w) { return cdn(u, w) + ' ' + w + 'w'; }).join(', ');
    return '<img' + (cls ? ' class="' + cls + '"' : '') + ' src="' + esc(cdn(u, 800)) + '" srcset="' + esc(ss) +
      '" sizes="300px" data-f="' + f + '" alt="' + esc(alt || '') + '"' +
      (pos ? ' style="object-position:' + esc(pos) + '"' : '') +
      (lazy ? ' loading="lazy"' : '') + ' decoding="async" draggable="false">';
  }
  var KW = { left: 0, top: 0, center: 50, right: 100, bottom: 100 };
  function focalXY(f) {
    if (!f) return [50, 50];
    if (typeof f === 'object') return [isNaN(+f.x) ? 50 : +f.x, isNaN(+f.y) ? 50 : +f.y];
    var parts = String(f).trim().split(/\s+/), out = [50, 50];
    parts.slice(0, 2).forEach(function (p, i) {
      var v = p in KW ? KW[p] : parseFloat(p);
      if (!isNaN(v)) out[i] = v;
    });
    if (parts.length === 1 && (parts[0] === 'top' || parts[0] === 'bottom')) out = [50, KW[parts[0]]];
    return out;
  }
  function focalCSS(f) { var p = focalXY(f); return p[0] + '% ' + p[1] + '%'; }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function mod(n, m) { return ((n % m) + m) % m; }
  var ICONS = {
    'ship': '<path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3.2v2.8h-7"/><circle cx="6.5" cy="17" r="1.7"/><circle cx="16.5" cy="17" r="1.7"/>',
    'clock': '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    'return': '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v4h4"/>',
    'lock': '<rect x="5" y="10.5" width="14" height="9.5" rx="1.8"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
    'mail': '<rect x="3.5" y="6" width="17" height="12" rx="1.6"/><path d="M4 7l8 6 8-6"/>',
    'dot': '<circle cx="12" cy="12" r="2.6"/>'
  };
  function icon(k) { return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[k] || ICONS.dot) + '</svg>'; }
  /* mail and site links inside copy that is already escaped */
  function linkify(s) {
    return String(s)
      .replace(/[A-Za-z0-9._%+]+@[A-Za-z0-9.]+\.[a-z]{2,}/g, function (m) { return '<a href="mailto:' + m + '">' + m + '</a>'; })
      .replace(/(^|\s)(norafurnish\.com)(?=[\s.,]|$)/gi, '$1<a href="/">$2</a>');
  }
  /* used only if the catalog metafield has no back_cover.promises */
  var DEF_PROMISES = [
    { icon: 'ship', label: 'Free shipping', detail: 'On every order in the USA' },
    { icon: 'clock', label: 'Delivery', detail: 'About 6 to 9 business days in total' },
    { icon: 'return', label: 'Easy 30 day returns', detail: 'If a piece is not right for your room' },
    { icon: 'lock', label: 'Secure checkout', detail: 'Encrypted and safe payments' },
    { icon: 'mail', label: 'Email support', detail: 'info@norafurnish.com, Monday to Friday' }
  ];
  /* shrink the text in one page box until it fits. Every size is in container units, so the ratio found
     at one size holds at any size (the book measures its pages once, off screen, at 300 by 400). */
  var FIT_SEL = '.nfcat-leaf:not(.nfcat-leaf--products) > .nfcat-in';
  function fitBox(box) {
    var leaf = box.parentNode;
    if (!box.firstElementChild) return;
    leaf.style.removeProperty('--fit');
    var f = 1;
    for (var i = 0; i < 14; i++) {
      var r = box.getBoundingClientRect();
      if (!r.height) return;
      var top = box.firstElementChild.getBoundingClientRect().top;
      var bot = box.lastElementChild.getBoundingClientRect().bottom;
      if (top >= r.top - 1 && bot <= r.bottom + 1) break;
      f *= 0.93;
      leaf.style.setProperty('--fit', f.toFixed(3));
    }
  }

  function Viewer(root) {
    this.root = root;
    this.viewer = root.querySelector('[data-viewer]');
    this.bar = root.querySelector('[data-bar]');
    this.stage = root.querySelector('[data-stage]');
    this.track = root.querySelector('[data-track]');
    this.slot = root.querySelector('[data-slot]');
    this.gridEl = root.querySelector('[data-grid]');
    this.live = root.querySelector('[data-live]');
    var dj = root.querySelector('[data-nfcat-json]');
    var pj = root.querySelector('[data-nfcat-products]');
    try { this.d = dj ? JSON.parse(dj.textContent) : null; } catch (e) { this.d = null; }
    try { this.pm = pj ? JSON.parse(pj.textContent) : {}; } catch (e) { this.pm = {}; }
    if (!this.d || !this.d.chapters) { this.bar.style.visibility = 'hidden'; return; }
    this.money = root.getAttribute('data-money') || '${{amount}}';
    this.coll = root.getAttribute('data-collection') || '';
    this.z = 0;
    this.cur = -1;
    this.cache = {};
    this.index();
    this.mobile = MQ.matches;
    this.buildViews();
    this.bind();
    this.layout();
    this.go(this.viewFromHash(), 0, true);
    this.fillMissingPrices();
    root.classList.add('is-ready');
    var self = this;
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { Object.keys(self.cache).forEach(function (k) { self.fit(self.cache[k]); }); });
    window.__nfCatalog = this;
  }
  var P = Viewer.prototype;

  P.index = function () {
    var d = this.d, L = [], names = {}, imgs = {};
    L.push({ k: 'cover', s: 'Cover' });
    if (d.welcome) {
      L.push({ k: 'welcome', s: 'Welcome' });
      L.push({ k: 'photo', s: 'Welcome', im: d.welcome.image, alt: d.welcome.alt, fo: d.welcome.focal, hs: d.welcome.hotspots });
    }
    L.push({ k: 'contents', s: 'Contents' });
    L.push({ k: 'mosaic', s: 'Contents' });
    (d.chapters || []).forEach(function (ch, ci) {
      ch._n = L.length + 1;
      L.push({ k: 'photo', s: ch.title, im: ch.opener_image, alt: ch.opener_alt, fo: ch.opener_focal, ch: ci });
      L.push({ k: 'opener', s: ch.title, ch: ci });
      (ch.spreads || []).forEach(function (sp, si) {
        (sp.products || []).forEach(function (p) {
          if (p && p.handle) {
            if (!names[p.handle]) names[p.handle] = p.name;
            if (!imgs[p.handle]) imgs[p.handle] = p.image;
          }
        });
        L.push({ k: 'products', s: ch.title, ch: ci, sp: si });
        L.push({ k: 'life', s: ch.title, ch: ci, sp: si });
      });
      ch._end = L.length;
    });
    /* closing page (index and promises) sits opposite the back cover, so the last spread is full */
    if (d.back_cover) L.push({ k: 'close', s: 'Index' });
    L.push({ k: 'back', s: 'Back cover' });
    L.forEach(function (x, i) { x.n = i + 1; });
    this.leaves = L;
    this.names = names;
    this.imgs = imgs;
  };

  P.buildViews = function () {
    var V = [], n = this.leaves.length;
    if (this.mobile) {
      for (var i = 0; i < n; i++) V.push([i]);
    } else {
      /* cover alone, then facing pages; with the closing page the back cover lands on the right of the last spread */
      V.push([0]);
      var last = this.leaves[n - 2] && this.leaves[n - 2].k === 'close' ? n : n - 1;
      for (var j = 1; j < last; j += 2) V.push(j + 1 < last ? [j, j + 1] : [j]);
      if (last === n - 1) V.push([n - 1]);
    }
    this.views = V;
  };
  P.viewOfLeaf = function (li) {
    for (var i = 0; i < this.views.length; i++) if (this.views[i].indexOf(li) > -1) return i;
    return 0;
  };
  P.viewFromHash = function () {
    var m = /^#p(\d+)$/.exec(location.hash || '');
    if (!m) return 0;
    return this.viewOfLeaf(clamp(parseInt(m[1], 10) - 1, 0, this.leaves.length - 1));
  };

  /* ---------- markup ---------- */
  P.priceHTML = function (m) {
    if (!m || !m.p) return '';
    var s = (m.v ? '<span class="nfcat-price__from">From </span>' : '') + '<span class="nfcat-price__now">' + esc(m.p) + '</span>';
    if (m.c) s += '<s class="nfcat-price__was">' + esc(m.c) + '</s><span class="nfcat-price__sale">Sale</span>';
    return s;
  };
  P.url = function (h) { var m = this.pm[h]; return (m && m.u) || ('/products/' + h); };
  /* page numbers as the viewer counts them (NF-CATALOG-PAGE-V2, 2026-09-11): the cover is page 1, then one number per
     spread, so the owner's count holds everywhere (93 leaves = 47 pages). Links (#pN, data-go) stay leaf numbers. */
  function pgNo(n) { return n <= 1 ? 1 : Math.floor(n / 2) + 1; }
  P.foot = function (x, light) {
    var left = x.n % 2 === 0;
    return '<div class="nfcat-foot' + (left ? '' : ' nfcat-foot--r') + (light ? ' nfcat-foot--light' : '') + '">' +
      (left ? '<span>' + pgNo(x.n) + '</span><span>' + SITE + '</span>' : '<span>' + SITE + '</span><span>' + pgNo(x.n) + '</span>') + '</div>';
  };
  P.leafHTML = function (x, thumb) {
    var d = this.d, self = this, h = '', foot = true, light = false, ch = x.ch != null ? d.chapters[x.ch] : null;
    var lazy = !!thumb;
    switch (x.k) {
      case 'cover':
        var c = d.cover || {};
        h = img(c.image, 1, 'nfcat-ph', c.alt, focalCSS(c.focal), lazy) +
          '<div class="nfcat-cover__mark"><span class="nfcat-cover__name">Nora Furnish</span><span class="nfcat-cover__ed">Catalog<br>' + esc(c.edition || '2026') + '</span></div>' +
          '<span class="nfcat-cover__site">' + SITE + '</span>';
        foot = false;
        break;
      case 'welcome':
        var w = d.welcome;
        h = '<div class="nfcat-in"><p class="nfcat-label">Welcome</p><h2 class="nfcat-h">' + esc(w.heading) + '</h2>' +
          (w.paragraphs || []).map(function (p) { return '<p class="nfcat-p">' + esc(p) + '</p>'; }).join('') +
          ((w.offers && w.offers.length) ? '<dl class="nfcat-offers">' + w.offers.map(function (o) {
            return '<div><dt>' + esc(o.label) + '</dt><dd>' + esc(o.detail) + '</dd></div>';
          }).join('') + '</dl>' : '') + '</div>';
        break;
      case 'photo':
        h = img(x.im, 1, 'nfcat-ph', x.alt, focalCSS(x.fo), lazy) + this.hotspotsHTML(x.hs);
        light = true;
        break;
      case 'contents':
        h = '<div class="nfcat-in"><p class="nfcat-label">' + esc(d.title || 'Lighting Catalog') + '</p><h2 class="nfcat-h">Contents</h2><ol class="nfcat-toc">' +
          d.chapters.map(function (c2, i) {
            return '<li><a href="#p' + c2._n + '" data-go="' + c2._n + '"><span class="nfcat-toc__n">' + pad2(i + 1) + '</span><span class="nfcat-toc__t">' + esc(c2.title) + '</span><span class="nfcat-toc__p">' + pgNo(c2._n) + '</span></a></li>';
          }).join('') + '</ol></div>';
        break;
      case 'mosaic':
        h = '<div class="nfcat-mosaic">' + d.chapters.slice(0, 4).map(function (c2) {
          return '<a href="#p' + c2._n + '" data-go="' + c2._n + '"><span class="nfcat-mosaic__im">' + img(c2.opener_image, 0.4, '', c2.opener_alt, focalCSS(c2.opener_focal), lazy) + '</span><span class="nfcat-mosaic__cap">' + esc(c2.title) + '</span></a>';
        }).join('') + '</div>';
        break;
      case 'opener':
        h = '<p class="nfcat-label nfcat-opener__pages">' + (pgNo(ch._n) === pgNo(ch._end) ? 'Page ' + pgNo(ch._n) : 'Pages ' + pgNo(ch._n) + ' to ' + pgNo(ch._end)) + '</p><div class="nfcat-in"><p class="nfcat-opener__n">' + pad2(x.ch + 1) + '</p><p class="nfcat-label">Chapter ' + pad2(x.ch + 1) + '</p><h2 class="nfcat-h">' + esc(ch.title) + '</h2><span class="nfcat-rule"></span>' +
          (ch.intro ? '<p class="nfcat-p">' + esc(ch.intro) + '</p>' : '') +
          (ch.collection ? '<a class="nfcat-textlink" href="/collections/' + esc(ch.collection) + '">Shop ' + esc(ch.title) + '</a>' : '') + '</div>';
        break;
      case 'products':
        var sp = ch.spreads[x.sp];
        h = '<div class="nfcat-in"><div class="nfcat-prodhead"><p class="nfcat-label">' + esc(ch.title) + '</p>' +
          (ch.collection ? '<a class="nfcat-label" href="/collections/' + esc(ch.collection) + '">Shop all</a>' : '') + '</div><div class="nfcat-grid4">' +
          (sp.products || []).slice(0, 4).map(function (p) {
            var m = self.pm[p.handle];
            var nm = p.name || (m && m.t) || '';
            return '<a class="nfcat-prod" href="' + esc(self.url(p.handle)) + '" draggable="false"><span class="nfcat-prod__img">' + img(p.image || (m && m.i), 0.4, '', nm, '', lazy) + '</span>' +
              '<span class="nfcat-prod__name">' + esc(nm) + '</span><span class="nfcat-price" data-price="' + esc(p.handle) + '">' + self.priceHTML(m) + '</span></a>';
          }).join('') + '</div></div>';
        break;
      case 'life':
        var life = ch.spreads[x.sp].lifestyle || {};
        h = img(life.image, 1, 'nfcat-ph', life.alt, focalCSS(life.focal), lazy) + this.hotspotsHTML(life.hotspots);
        light = true;
        break;
      case 'close':
        var bc = d.back_cover || {};
        var prom = (bc.promises && bc.promises.length) ? bc.promises : DEF_PROMISES;
        h = '<div class="nfcat-in nfcat-close__in"><p class="nfcat-label">' + esc(bc.index_label || 'Index') + '</p><h2 class="nfcat-h">' + esc(bc.index_heading || 'Inside This Catalog') + '</h2><ol class="nfcat-close__toc">' +
          d.chapters.map(function (c2, i) {
            return '<li><a href="#p' + c2._n + '" data-go="' + c2._n + '"><span class="nfcat-close__n">' + pad2(i + 1) + '</span><span class="nfcat-close__t">' + esc(c2.title) + '</span><span class="nfcat-close__p">' + pgNo(c2._n) + '</span></a></li>';
          }).join('') + '</ol>' +
          '<p class="nfcat-label nfcat-close__sub">' + esc(bc.promise_label || 'Shop With Confidence') + '</p><ul class="nfcat-close__prom">' +
          prom.map(function (p) {
            return '<li><span class="nfcat-close__ic">' + icon(p.icon) + '</span><span class="nfcat-close__pt"><b>' + esc(p.label) + '</b><span>' + linkify(esc(p.detail)) + '</span></span></li>';
          }).join('') + '</ul></div>';
        light = true;
        break;
      case 'back':
        var b = d.back_cover || {};
        var stats = [
          [(d.counts && d.counts.fixtures) || this.uniqueCount(), 'Fixtures'],
          [d.chapters.length, 'Chapters'],
          [(d.counts && d.counts.pages) || pgNo(this.leaves.length), 'Pages']
        ];
        h = img(b.image, 1, 'nfcat-ph', b.alt, focalCSS(b.focal), lazy) + '<span class="nfcat-back__veil"></span>' +
          '<div class="nfcat-in nfcat-back__in"><p class="nfcat-back__brand"><span class="nfcat-cover__name">Nora Furnish</span><span class="nfcat-cover__ed">Catalog<br>' + esc((d.cover && d.cover.edition) || '2026') + '</span></p>' +
          '<div class="nfcat-back__low">' + (b.kicker ? '<p class="nfcat-back__kicker">' + esc(b.kicker) + '</p>' : '') +
          '<h2 class="nfcat-back__h">' + esc(b.heading || 'Light Every Room') + '</h2><span class="nfcat-back__rule"></span>' +
          (b.closing ? '<p class="nfcat-back__line">' + esc(b.closing) + '</p>' : '') +
          '<dl class="nfcat-back__stats">' + stats.map(function (s) { return '<div><dt>' + esc(s[0]) + '</dt><dd>' + s[1] + '</dd></div>'; }).join('') + '</dl>' +
          '<a class="nfcat-back__cta" href="/collections/' + esc(b.cta_collection || 'lighting-catalog-2026') + '">' + esc(b.cta_label || 'Shop the collection at norafurnish.com') + '</a>' +
          (b.fine ? '<p class="nfcat-back__fine">' + esc(b.fine) + '</p>' : '') + '</div></div>';
        foot = false;
        break;
    }
    return '<div class="nfcat-leaf nfcat-leaf--' + x.k + '" data-n="' + x.n + '">' + h + (foot ? this.foot(x, light) : '') + '</div>';
  };

  P.hotspotsHTML = function (list) {
    var self = this;
    return (list || []).map(function (s) {
      var nm = self.names[s.handle] || (self.pm[s.handle] && self.pm[s.handle].t) || 'this fixture';
      return '<button type="button" class="nfcat-hs" data-h="' + esc(s.handle) + '" data-x="' + (+s.x) + '" data-y="' + (+s.y) + '" style="left:' + (+s.x) + '%;top:' + (+s.y) + '%" aria-label="View ' + esc(nm) + '" aria-expanded="false">' + PLUS + '</button>';
    }).join('');
  };
  /* every product reference in the catalog: grid products plus all hotspots (welcome photo included) */
  P.allItems = function () {
    var out = [].concat((this.d.welcome && this.d.welcome.hotspots) || []);
    this.d.chapters.forEach(function (ch) {
      (ch.spreads || []).forEach(function (sp) { out = out.concat(sp.products || [], (sp.lifestyle && sp.lifestyle.hotspots) || []); });
    });
    return out.filter(function (p) { return p && p.handle; });
  };
  P.makeView = function (vi, ph, thumb) {
    var self = this, leaves = this.views[vi];
    var el = document.createElement('div');
    el.className = 'nfcat-view ' + (leaves.length > 1 ? 'nfcat-view--spread' : 'nfcat-view--single') + (thumb ? ' nfcat-view--thumb' : '');
    el.setAttribute('data-v', vi);
    el.innerHTML = leaves.map(function (li) { return self.leafHTML(self.leaves[li], thumb); }).join('');
    this.sizeView(el, ph);
    if (!thumb) {
      Array.prototype.forEach.call(el.querySelectorAll('.nfcat-leaf--life, .nfcat-leaf--photo'), function (leaf) {
        if (!leaf.querySelector('.nfcat-hs')) return;
        var im = leaf.querySelector('.nfcat-ph');
        if (!im) return;
        if (im.complete && im.naturalWidth) self.placeHotspots(leaf);
        else im.addEventListener('load', function () { self.placeHotspots(leaf); });
      });
    }
    return el;
  };
  /* shrink the text on a page until it fits: long copy, or the legibility floor on small screens */
  P.fit = function (el) {
    Array.prototype.forEach.call(el.querySelectorAll(FIT_SEL), fitBox);
  };
  P.uniqueCount = function () {
    var s = {};
    this.allItems().forEach(function (p) { s[p.handle] = 1; });
    return Object.keys(s).length;
  };
  P.sizeView = function (el, ph) {
    el.style.setProperty('--ph', ph + 'px');
    var pw = ph * AR;
    Array.prototype.forEach.call(el.querySelectorAll('img[data-f]'), function (im) {
      im.sizes = Math.max(60, Math.round(pw * parseFloat(im.getAttribute('data-f')))) + 'px';
    });
  };

  /* keep hotspots on the fixture after object-fit cover cropping */
  P.placeHotspots = function (leaf) {
    var im = leaf.querySelector('.nfcat-ph');
    if (!im || !im.naturalWidth) return;
    var W = leaf.clientWidth, H = leaf.clientHeight;
    if (!W || !H) return;
    var iw = im.naturalWidth, ih = im.naturalHeight, s = Math.max(W / iw, H / ih);
    var rw = iw * s, rh = ih * s, fo = focalXY(im.style.objectPosition);
    var ox = (W - rw) * fo[0] / 100, oy = (H - rh) * fo[1] / 100;
    Array.prototype.forEach.call(leaf.querySelectorAll('.nfcat-hs'), function (b) {
      var px = ox + (+b.getAttribute('data-x')) / 100 * rw;
      var py = oy + (+b.getAttribute('data-y')) / 100 * rh;
      var inside = px >= W * 0.03 && px <= W * 0.97 && py >= H * 0.03 && py <= H * 0.95;
      b.style.left = (px / W * 100).toFixed(3) + '%';
      b.style.top = (py / H * 100).toFixed(3) + '%';
      b.classList.toggle('is-off', !inside);
    });
  };

  /* ---------- layout and zoom ---------- */
  P.isFS = function () {
    var f = document.fullscreenElement || document.webkitFullscreenElement;
    return (!!f && f === this.viewer) || this.viewer.classList.contains('is-pfs'); /* NF-CATALOG-FS */
  };
  P.headerH = function () {
    var t = 0;
    ['.shopify-section--header', '.shopify-section--announcement-bar'].forEach(function (sel) {
      var e = document.querySelector(sel);
      if (e && /sticky|fixed/.test(getComputedStyle(e).position)) t += e.offsetHeight;
    });
    return Math.min(t, window.innerHeight * 0.3);
  };
  P.layout = function () {
    var fs = this.isFS();
    var top = fs ? 0 : this.headerH();
    this.root.style.setProperty('--nfcat-top', (top + 8) + 'px');
    var barH = this.bar.offsetHeight || 48;
    var avail = window.innerHeight - top - barH - (fs ? 0 : 18);
    var W = this.stage.clientWidth || this.viewer.clientWidth;
    var pad = W < 750 ? 10 : 22;
    this.pad = pad;
    this.root.style.setProperty('--nfcat-pad', pad + 'px');
    var byW = (W - pad * 2) / (this.mobile ? AR : AR * 2);
    var ph = Math.floor(Math.max(240, Math.min(avail - pad * 2, byW)));
    this.basePh = ph;
    this.stage.style.height = (fs ? Math.max(avail, ph + pad * 2) : ph + pad * 2) + 'px';
    this.applyZoom(true);
  };
  P.applyZoom = function (keepCenter) {
    var self = this, st = this.stage;
    var cx = (st.scrollLeft + st.clientWidth / 2) / (st.scrollWidth || 1);
    var cy = (st.scrollTop + st.clientHeight / 2) / (st.scrollHeight || 1);
    var ph = Math.round(this.basePh * ZOOMS[this.z]);
    this.ph = ph;
    Object.keys(this.cache).forEach(function (k) {
      var el = self.cache[k];
      self.sizeView(el, ph);
      self.fit(el);
      Array.prototype.forEach.call(el.querySelectorAll('.nfcat-leaf--life, .nfcat-leaf--photo'), function (l) { self.placeHotspots(l); });
    });
    this.sizeSlot();
    st.classList.toggle('is-zoomed', this.z > 0);
    if (this.z > 0 && keepCenter) {
      st.scrollLeft = cx * st.scrollWidth - st.clientWidth / 2;
      st.scrollTop = cy * st.scrollHeight - st.clientHeight / 2;
    } else if (this.z === 0) { st.scrollLeft = 0; st.scrollTop = 0; }
    this.updateBar();
  };
  P.sizeSlot = function () {
    var n = this.views[this.cur] ? this.views[this.cur].length : 1;
    this.slot.style.width = Math.round(this.ph * AR * n) + 'px';
    this.slot.style.height = this.ph + 'px';
  };
  P.zoom = function (dir) {
    var z = clamp(this.z + dir, 0, ZOOMS.length - 1);
    if (z === this.z) return;
    this.closeCard();
    this.z = z;
    this.applyZoom(true);
  };

  /* ---------- navigation ---------- */
  P.ensure = function (vi) {
    if (!this.cache[vi]) {
      var el = this.makeView(vi, this.ph || this.basePh, false);
      el.classList.add('is-pre');
      this.slot.appendChild(el);
      this.fit(el);
      this.cache[vi] = el;
    }
    return this.cache[vi];
  };
  P.go = function (vi, dir, first) {
    vi = clamp(vi, 0, this.views.length - 1);
    if (vi === this.cur) return;
    this.closeCard();
    var prev = this.cache[this.cur];
    dir = dir || (vi > this.cur ? 1 : -1);
    this.cur = vi;
    var el = this.ensure(vi);
    if (prev && prev !== el) prev.classList.add('is-pre');
    el.classList.remove('is-pre');
    this.sizeSlot();
    if (this.z > 0) { this.stage.scrollLeft = (this.stage.scrollWidth - this.stage.clientWidth) / 2; this.stage.scrollTop = 0; }
    if (!first && prev && el.animate) { /* arrows glide under reduced motion too, just shorter (2026-09-10) */ el.animate([{ opacity: 0, transform: 'translateX(' + (dir * (RM.matches ? 10 : 18)) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: RM.matches ? 240 : 300, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
    var self = this;
    Array.prototype.forEach.call(el.querySelectorAll('.nfcat-leaf--life, .nfcat-leaf--photo'), function (l) { self.placeHotspots(l); });
    this.preload();
    this.updateBar();
    if (!first) {
      var n = this.leaves[this.views[vi][0]].n;
      try { history.replaceState(history.state, '', '#p' + n); } catch (e) {}
    }
  };
  P.preload = function () {
    var self = this, c = this.cur;
    [c + 1, c - 1, c + 2].forEach(function (i) { if (i >= 0 && i < self.views.length) self.ensure(i); });
    Object.keys(this.cache).forEach(function (k) {
      if (Math.abs(+k - c) > 3) { self.cache[k].remove(); delete self.cache[k]; }
    });
  };
  P.next = function () { this.go(this.cur + 1, 1); };
  P.prev = function () { this.go(this.cur - 1, -1); };
  P.updateBar = function () {
    var q = this.root;
    var total = this.views.length;
    q.querySelector('[data-cur]').textContent = pgNo((this.leaves[(this.views[this.cur] || [0])[0]] || { n: 1 }).n);
    q.querySelector('[data-total]').textContent = pgNo(this.leaves.length);
    q.querySelector('[data-act="prev"]').disabled = this.cur <= 0;
    q.querySelector('[data-act="next"]').disabled = this.cur >= total - 1;
    q.querySelector('[data-act="zoomout"]').disabled = this.z <= 0;
    q.querySelector('[data-act="zoomin"]').disabled = this.z >= ZOOMS.length - 1;
    q.querySelector('[data-zoom]').textContent = Math.round(ZOOMS[this.z] * 100) + '%';
    var v = this.views[this.cur] || [0];
    var ns = v.map(function (li) { return this.leaves[li].n; }, this);
    if (this.live) this.live.textContent = 'Page ' + pgNo(ns[0]) + ' of ' + pgNo(this.leaves.length);
  };
  P.remode = function () {
    var m = MQ.matches;
    if (m === this.mobile) return;
    var li = this.views[this.cur] ? this.views[this.cur][0] : 0;
    this.mobile = m;
    this.closeCard();
    this.toggleGrid(false);
    var self = this;
    Object.keys(this.cache).forEach(function (k) { self.cache[k].remove(); });
    this.cache = {};
    this.gridMode = null;
    this.buildViews();
    this.cur = -1;
    this.layout();
    this.go(this.viewOfLeaf(li), 0, true);
  };

  /* ---------- hotspot cards ---------- */
  P.openCard = function (btn) {
    if (this.cardBtn === btn) { this.closeCard(); return; }
    this.closeCard();
    var h = btn.getAttribute('data-h'), m = this.pm[h] || {};
    var nm = this.names[h] || m.t || '';
    var im = this.imgs[h] || m.i;
    var leaf = btn.closest('.nfcat-leaf');
    var c = document.createElement('div');
    c.className = 'nfcat-card';
    c.setAttribute('role', 'dialog');
    c.setAttribute('aria-label', nm);
    c.innerHTML = '<a class="nfcat-card__img" href="' + esc(this.url(h)) + '" tabindex="-1">' + (im ? '<img src="' + esc(cdn(im, 240)) + '" srcset="' + esc(cdn(im, 180) + ' 1x, ' + cdn(im, 360) + ' 2x') + '" alt="" draggable="false">' : '') + '</a>' +
      '<div><p class="nfcat-card__name">' + esc(nm) + '</p><span class="nfcat-price">' + this.priceHTML(m) + '</span>' +
      '<a class="nfcat-card__link" href="' + esc(this.url(h)) + '">View product</a></div>' +
      '<button type="button" class="nfcat-card__x" aria-label="Close">' + CLOSE + '</button>';
    leaf.appendChild(c);
    var W = leaf.clientWidth, H = leaf.clientHeight, cw = c.offsetWidth, chh = c.offsetHeight;
    var bx = btn.offsetLeft, by = btn.offsetTop, g = btn.offsetWidth / 2 + 10, m8 = 8;
    var left = bx + g;
    if (left + cw > W - m8) left = bx - g - cw;
    if (left < m8) left = clamp(bx - cw / 2, m8, W - cw - m8);
    var top = by - chh / 2;
    if (left === clamp(bx - cw / 2, m8, W - cw - m8)) top = by + g;
    top = clamp(top, m8, Math.max(m8, H - chh - m8 - H * 0.05));
    c.style.left = left + 'px';
    c.style.top = top + 'px';
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    this.cardBtn = btn;
    this.cardEl = c;
    var self = this;
    c.querySelector('.nfcat-card__x').addEventListener('click', function (e) { e.stopPropagation(); self.closeCard(true); });
    var link = c.querySelector('.nfcat-card__link');
    if (link && this.kbOpen) link.focus({ preventScroll: true });
  };
  P.closeCard = function (refocus) {
    if (!this.cardEl) return;
    this.cardEl.remove();
    this.cardBtn.classList.remove('is-open');
    this.cardBtn.setAttribute('aria-expanded', 'false');
    if (refocus) this.cardBtn.focus({ preventScroll: true });
    this.cardEl = this.cardBtn = null;
  };

  /* ---------- thumbnail grid ---------- */
  P.buildGrid = function () {
    var mode = this.mobile ? 'm' : 'd';
    if (this.gridMode === mode) return;
    this.gridMode = mode;
    var self = this, g = this.gridEl, tph = this.mobile ? 150 : 128;
    g.innerHTML = '';
    this.views.forEach(function (v, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'nfcat-thumb';
      b.setAttribute('data-thumb', i);
      var ns = v.map(function (li) { return self.leaves[li].n; });
      var first = self.leaves[v[0]];
      var label = first.k === 'cover' ? 'Cover' : first.k === 'back' ? 'Back cover' : 'Page ' + pgNo(ns[0]);
      b.setAttribute('aria-label', label + ', ' + first.s);
      var tv = self.makeView(i, tph, true);
      b.appendChild(tv);
      var t = document.createElement('span');
      t.innerHTML = esc(label) + (first.k === 'cover' || first.k === 'back' ? '' : '<small>' + esc(first.s) + '</small>');
      b.appendChild(t);
      g.appendChild(b);
      self.fit(tv);
    });
  };
  P.toggleGrid = function (open) {
    var g = this.gridEl, btn = this.root.querySelector('[data-act="pages"]');
    if (open === undefined) open = g.hidden;
    if (open) {
      this.closeCard();
      if (this.z) { this.z = 0; this.applyZoom(false); }
      g.hidden = false;
      this.buildGrid();
      Array.prototype.forEach.call(g.querySelectorAll('.nfcat-thumb'), function (t, i) { t.classList.toggle('is-current', i === this.cur); }, this);
      var curT = g.querySelector('.nfcat-thumb.is-current');
      if (curT) { g.scrollTop = Math.max(0, curT.offsetTop - g.clientHeight / 2 + curT.offsetHeight / 2); curT.focus({ preventScroll: true }); }
    } else {
      g.hidden = true;
    }
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  /* ---------- prices fallback (only if a handle is missing from the Liquid map) ---------- */
  P.fmt = function (cents) {
    var a = (cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return this.money.replace(/\{\{\s*(\w+)\s*\}\}/, function (m0, k) {
      return k === 'amount_no_decimals' ? a.replace(/\.\d+$/, '') : a;
    });
  };
  P.fillMissingPrices = function () {
    var self = this, need = {};
    this.allItems().forEach(function (p) {
      if (p && p.handle && !(self.pm[p.handle] && self.pm[p.handle].p)) need[p.handle] = 1;
    });
    var list = Object.keys(need);
    this.missing = list;
    if (!list.length || !this.coll || !window.fetch) return;
    fetch('/collections/' + encodeURIComponent(this.coll) + '/products.json?limit=250').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j || !j.products) return;
      j.products.forEach(function (p) {
        if (!need[p.handle]) return;
        var vs = p.variants || [], min = null, cmp = 0, varies = false;
        vs.forEach(function (v) { var c = Math.round(parseFloat(v.price) * 100); if (min === null || c < min) min = c; });
        vs.forEach(function (v) {
          var c = Math.round(parseFloat(v.price) * 100);
          if (c !== min) varies = true;
          var k = v.compare_at_price ? Math.round(parseFloat(v.compare_at_price) * 100) : 0;
          if (c === min && k > cmp) cmp = k;
        });
        if (min === null) return;
        self.pm[p.handle] = { t: p.title, u: '/products/' + p.handle, p: self.fmt(min), c: cmp > min ? self.fmt(cmp) : '', v: varies, i: p.images && p.images[0] && p.images[0].src };
        Array.prototype.forEach.call(self.root.querySelectorAll('[data-price="' + p.handle + '"]'), function (el) { el.innerHTML = self.priceHTML(self.pm[p.handle]); });
      });
      self.missing = list.filter(function (h) { return !(self.pm[h] && self.pm[h].p); });
    }).catch(function () {});
  };

  /* ---------- events ---------- */
  P.bind = function () {
    var self = this, st = this.stage;
    this.root.addEventListener('click', function (e) {
      var a = e.target.closest('[data-act]');
      if (a && self.root.contains(a)) {
        var act = a.getAttribute('data-act');
        if (act === 'prev') self.prev();
        else if (act === 'next') self.next();
        else if (act === 'zoomin') self.zoom(1);
        else if (act === 'zoomout') self.zoom(-1);
        else if (act === 'pages') self.toggleGrid();
        else if (act === 'fs') self.fullscreen();
        return;
      }
      if (self.suppress) { e.preventDefault(); e.stopPropagation(); self.suppress = false; return; }
      var t = e.target.closest('[data-thumb]');
      if (t) { self.toggleGrid(false); self.go(+t.getAttribute('data-thumb')); st.focus({ preventScroll: true }); return; }
      var goEl = e.target.closest('[data-go]');
      if (goEl && !goEl.closest('.nfcat-view--thumb')) {
        e.preventDefault();
        self.go(self.viewOfLeaf(+goEl.getAttribute('data-go') - 1));
        return;
      }
      var hs = e.target.closest('.nfcat-hs');
      if (hs) { e.preventDefault(); self.kbOpen = e.detail === 0; self.openCard(hs); return; }
      if (self.cardEl && !e.target.closest('.nfcat-card')) self.closeCard();
    }, true);

    /* swipe at 100%, drag to pan when zoomed */
    var p0 = null;
    st.addEventListener('pointerdown', function (e) {
      if (!self.gridEl.hidden || (e.pointerType === 'mouse' && e.button !== 0)) return;
      if (e.target.closest('.nfcat-card')) return;
      p0 = { x: e.clientX, y: e.clientY, l: st.scrollLeft, t: st.scrollTop, id: e.pointerId, moved: false };
    });
    st.addEventListener('pointermove', function (e) {
      if (!p0 || e.pointerId !== p0.id) return;
      var dx = e.clientX - p0.x, dy = e.clientY - p0.y;
      if (!p0.moved && Math.abs(dx) + Math.abs(dy) > 8) {
        p0.moved = true;
        if (self.z > 0) { st.classList.add('is-dragging'); try { st.setPointerCapture(e.pointerId); } catch (x) {} }
      }
      if (p0.moved && self.z > 0) { st.scrollLeft = p0.l - dx; st.scrollTop = p0.t - dy; }
    });
    function end(e) {
      if (!p0 || e.pointerId !== p0.id) return;
      var dx = e.clientX - p0.x, dy = e.clientY - p0.y, moved = p0.moved;
      st.classList.remove('is-dragging');
      if (moved) {
        self.suppress = true;
        setTimeout(function () { self.suppress = false; }, 0);
        if (self.z === 0 && e.type === 'pointerup' && Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
          if (dx < 0) self.next(); else self.prev();
        }
      }
      p0 = null;
    }
    st.addEventListener('pointerup', end);
    st.addEventListener('pointercancel', end);
    st.addEventListener('dragstart', function (e) { e.preventDefault(); });

    document.addEventListener('keydown', function (e) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      var t = e.target;
      if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
      if (!self.isFS() && !self.inView()) return;
      var open = document.querySelector('[aria-modal="true"]:not([hidden])');
      if (open && !self.root.contains(open) && open.offsetParent !== null) return;
      var k = e.key;
      if (k === 'Escape') {
        if (self.cardEl) { self.closeCard(true); e.preventDefault(); }
        else if (!self.gridEl.hidden) { self.toggleGrid(false); self.root.querySelector('[data-act="pages"]').focus(); e.preventDefault(); }
        return;
      }
      if (!self.gridEl.hidden) return;
      if (k === 'ArrowRight' || k === 'PageDown') { self.next(); e.preventDefault(); }
      else if (k === 'ArrowLeft' || k === 'PageUp') { self.prev(); e.preventDefault(); }
      else if (k === 'Home' && self.root.contains(t)) { self.go(0); e.preventDefault(); }
      else if (k === 'End' && self.root.contains(t)) { self.go(self.views.length - 1); e.preventDefault(); }
      else if (k === '+' || k === '=') { self.zoom(1); e.preventDefault(); }
      else if (k === '-' || k === '_') { self.zoom(-1); e.preventDefault(); }
    });

    var FS_X = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg>'; /* NF-CATALOG-FS close icon */
    var fsOK = document.fullscreenEnabled || document.webkitFullscreenEnabled;
    var fsb = this.root.querySelector('[data-act="fs"]');
    if (fsb) { fsb.hidden = false; fsb.innerHTML = FS_ON + '<span class="nfcat-fs-lbl">Full screen</span>'; } /* NF-CATALOG-FS: never hidden, phones without the API get the overlay */
    function onFs() {
      var on = self.isFS(); self.viewer.classList.toggle('is-fs', on); if (fsb) { fsb.innerHTML = on ? (self.mobile ? FS_X : FS_OFF) : FS_ON + '<span class="nfcat-fs-lbl">Full screen</span>'; fsb.setAttribute('aria-label', on ? 'Exit full screen' : 'Full screen'); }
      self.layout();
    }
    self.onFs = onFs;
    document.addEventListener('fullscreenchange', onFs);
    document.addEventListener('webkitfullscreenchange', onFs);

    var tmr;
    function relayout() { clearTimeout(tmr); tmr = setTimeout(function () { self.remode(); self.layout(); }, 80); }
    window.addEventListener('resize', relayout);
    if (MQ.addEventListener) MQ.addEventListener('change', relayout);
    if (window.ResizeObserver) {
      var lastW = 0;
      new ResizeObserver(function () { var w = self.viewer.clientWidth; if (w !== lastW) { lastW = w; relayout(); } }).observe(this.viewer);
    }
    window.addEventListener('hashchange', function () { self.go(self.viewFromHash()); });
  };
  P.inView = function () {
    var r = this.viewer.getBoundingClientRect(), vh = window.innerHeight;
    var vis = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    return vis > Math.min(r.height, vh) * 0.4;
  };
  P.fullscreen = function () {
    /* NF-CATALOG-FS (2026-09-12): full screen on every phone. The Fullscreen API where the browser has it,
       otherwise (iPhone Safari) a fixed full viewport overlay with the page scroll locked. */
    var v = this.viewer, self = this;
    if (this.isFS()) {
      if (v.classList.contains('is-pfs')) this.pfs(false);
      else (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      return;
    }
    var ok = document.fullscreenEnabled || document.webkitFullscreenEnabled;
    if (ok && v.requestFullscreen) v.requestFullscreen().catch(function () { self.pfs(true); });
    else if (ok && v.webkitRequestFullscreen) v.webkitRequestFullscreen();
    else this.pfs(true);
  };
  P.pfs = function (on, fromPop) {
    var v = this.viewer, de = document.documentElement, self = this;
    if (!!on === v.classList.contains('is-pfs')) return;
    if (on) {
      this.pfsY = window.pageYOffset || 0;
      v.classList.add('is-pfs');
      de.classList.add('nfcat-pfs-lock');
      document.body.style.top = (-this.pfsY) + 'px';
      try { history.pushState({ nfcatfs: 1 }, ''); this.pfsPushed = true; } catch (e) {}
      if (!this.pfsWired) {
        this.pfsWired = true;
        window.addEventListener('popstate', function () {
          if (v.classList.contains('is-pfs')) { self.pfsPushed = false; self.pfs(false, true); }
        });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && !e.defaultPrevented && v.classList.contains('is-pfs')) { e.preventDefault(); self.pfs(false); }
        });
      }
    } else {
      v.classList.remove('is-pfs');
      de.classList.remove('nfcat-pfs-lock');
      document.body.style.top = '';
      window.scrollTo(0, this.pfsY || 0);
      if (this.pfsPushed && !fromPop) { this.pfsPushed = false; if (history.state && history.state.nfcatfs) history.back(); }
    }
    if (this.onFs) this.onFs();
    var fb = this.root.querySelector('[data-act="fs"]');
    if (fb) try { fb.focus({ preventScroll: true }); } catch (e) {}
  };

  /* verification helper for the build and for later refreshes */
  P.audit = function () {
    var self = this, out = { views: this.views.length, pages: this.leaves.length, priced: Object.keys(this.pm).length, noPrice: [], offHotspots: [], badImages: [] };
    this.allItems().forEach(function (p) { if (!(self.pm[p.handle] && self.pm[p.handle].p)) out.noPrice.push(p.handle); });
    Array.prototype.forEach.call(this.slot.querySelectorAll('.nfcat-hs.is-off'), function (b) { out.offHotspots.push(b.closest('.nfcat-leaf').getAttribute('data-n') + ':' + b.getAttribute('data-h')); });
    Array.prototype.forEach.call(this.slot.querySelectorAll('img'), function (i) { if (i.complete && !i.naturalWidth) out.badImages.push(i.closest('.nfcat-leaf').getAttribute('data-n')); });
    out.noPrice = out.noPrice.filter(function (h, i, a) { return a.indexOf(h) === i; });
    return out;
  };

  /* ---------- open book mockup: the real catalog pages, turned like paper (NFBOOK5, 2026-09-11) ----------
     Desktop (mouse or pen): anywhere over the book it eases toward the viewer, lifts and holds. Across its width
     the book is split in thirds. The middle third never turns a page. The right third turns forward and the left
     third turns back, one page at a time at a constant cadence: every turn takes TURN ms, then a PAUSE, whatever
     the cursor does inside that third. Moving to the middle or off the book lets the page in the air finish at
     the same speed; off the book it then settles. Endless loop. Reduced motion: same cadence, gentler lift and bend.
     Touch screens: no turning. The book lifts while it sits in the middle of the screen and settles once scrolled
     away (IntersectionObserver plus a Web Animation, run by the compositor). A tap opens the catalog.
     How a page turns: an opaque sheet of NP flat panels hinged edge to edge, rotated about the spine in 3D. Every
     panel face carries its own perspective transform from the same origin, so nothing relies on preserve-3d and
     overlap is plain DOM order (outer panels on top): no depth sorting, no z-fighting. A gentle bend follows turn
     progress only: the free edge leads a little as the sheet lifts, trails a little as it lands, and the sheet is
     straight while it stands up, so a change of direction can never jump. Faces are white paper and never fade:
     each face is shown or hidden outright by which side faces the viewer. Matte shading only: a tone per panel by
     its angle plus a ramp that carries it across the next hinge (the kinks read as one curve), and a thin soft
     shadow beside the free edge on the page below. All zero when a sheet lies flat.
     Cost per frame while turning: about fifteen transform and opacity writes, nothing that lays out or repaints.
     Pages are real DOM drawn once from the catalog data; the panels past the first show a copy, made in idle time
     or in the pause between turns, never while a page is in the air. */
  var TURN = 760, PAUSE = 240, DWELL = 140, NP = 3, SPL = [0, 0.42, 0.74], KP = [-0.5, 0.05, 0.75], BEND = 13,
    PERSP = 5.5, SF = 0.26, SB = 0.22, OV = 3, XF = 5, TX = 3.2, TY = 2.5, TONE = '43,34,25';
  function sstep(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
  function ez(t) { return 0.5 - 0.5 * Math.cos(Math.PI * t); }
  function sty(el, p, v) { var k = '_nf' + p; if (el && el[k] !== v) { el[k] = v; el.style[p] = v; } }
  function op(el, v) { sty(el, 'opacity', v < 0.004 ? '0' : v > 0.996 ? '1' : v.toFixed(3)); }
  function h31(s) { var x = 0; for (var i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) | 0; return x; }
  /* the text of this stylesheet (nf-catalog.css, same origin) for the book's shadow root; '' if it cannot be read */
  function bookCSS() {
    try {
      for (var i = 0; i < document.styleSheets.length; i++) {
        var s = document.styleSheets[i];
        if (s.href && /\/nf-catalog\.css(\?|$)/.test(s.href)) {
          var r = s.cssRules, out = [];
          for (var j = 0; j < r.length; j++) out.push(r[j].cssText);
          return out.join('\n');
        }
      }
    } catch (e) {}
    return '';
  }
  /* inside the shadow root the page rules scoped under .nfcat-bk cannot match, so they are restated */
  var SHADOW_CSS = '\n.nfcat-leaf{position:absolute;inset:0;width:100%;height:100%}.nfcat-hs{display:none}';
  /* text fit per page, remembered on this device (read once, written back when a new page was measured) */
  var FITKEY = 'nfBook4Fit', fitCache;
  function fitMemo(save) {
    try {
      if (save) { var ks = Object.keys(save); if (ks.length > 200) ks.slice(0, ks.length - 200).forEach(function (k) { delete save[k]; }); localStorage.setItem(FITKEY, JSON.stringify(save)); return save; }
      if (!fitCache) fitCache = JSON.parse(localStorage.getItem(FITKEY) || '{}') || {};
      return fitCache;
    } catch (e) { return fitCache || (fitCache = {}); }
  }
  var ric = window.requestIdleCallback ? function (f) { window.requestIdleCallback(f, { timeout: 400 }); } : function (f) { setTimeout(f, 50); };

  function Book(root) {
    this.root = root;
    this.a = root.querySelector('.nfcat-book');
    this.inn = root.querySelector('.nfcat-book__in');
    this.gs = root.querySelector('.nfcat-book__gs');
    this.Ls = root.querySelector('[data-book-l]');
    this.Rs = root.querySelector('[data-book-r]');
    if (!this.a || !this.inn || !this.Ls || !this.Rs) return;
    this.blocks();
    var self = this, fine = false;
    try { fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches; } catch (x) {}
    var dj = root.querySelector('[data-nfcat-book-data]');
    try { this.d = dj ? JSON.parse(dj.textContent) : null; } catch (e) { this.d = null; }
    this.pos = 0; this.lift = 0; this.lv = 0; this.zone = 0; this.zs = 0; this.dir = 1; this.turn = null; this.rest = -1e9;
    this.hover = false; this.focus = false; this.raf = 0; this.last = 0; this.rect = null;
    this.meas = document.createElement('div');
    this.meas.className = 'nfcat-book__meas';
    this.meas.setAttribute('aria-hidden', 'true');
    root.appendChild(this.meas);
    this.tick = function (t) { self.step(t); };
    var fitStatic = function () {
      [self.Ls, self.Rs].forEach(function (s) { var l = s.querySelector('.nfcat-leaf'); if (l) self.fitLeaf(l); });
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitStatic); else fitStatic();
    (window.__nfCatBooks = window.__nfCatBooks || []).push(this);
    if (!fine) { this.touch(); return; }
    if (!this.d || !this.d.chapters || !this.d.chapters.length) return;
    function mouse(e) { return e.pointerType !== 'touch'; }
    this.a.addEventListener('pointerenter', function (e) { if (mouse(e)) { self.hover = true; self.rect = null; self.eager(); self.track(e); } });
    this.a.addEventListener('pointermove', function (e) { if (mouse(e)) { self.hover = true; self.track(e); } });
    this.a.addEventListener('pointerleave', function (e) { if (mouse(e)) { self.hover = false; self.zone = 0; self.kick(); } });
    this.a.addEventListener('focus', function () {
      var fv = true;
      try { fv = self.a.matches(':focus-visible'); } catch (x) {}
      if (fv) { self.focus = true; self.kick(); }
    });
    this.a.addEventListener('blur', function () { self.focus = false; self.kick(); });
    var drop = function () { self.rect = null; };
    window.addEventListener('scroll', drop, { passive: true });
    window.addEventListener('resize', drop);
    /* build the sheets and place the pages next to the open spread in idle time once the book is near the
       screen, so the first turn starts without a hitch */
    try {
      if (window.IntersectionObserver) {
        var io = new IntersectionObserver(function (es) {
          if (!es.some(function (x) { return x.isIntersecting; })) return;
          io.disconnect();
          ric(function () { if (!self.raf && self.build()) self.warm(); });
        }, { rootMargin: '800px 0px' });
        io.observe(root);
      }
      if (window.ResizeObserver) new ResizeObserver(function () { if (self.st && self.size()) self.render(); }).observe(this.inn);
    } catch (x) {}
  }
  var B = Book.prototype;
  /* page edge blocks under both sides (the snippet prints them; this covers older cached markup) */
  B.blocks = function () {
    var inn = this.inn;
    if (!inn.querySelector('.nfcat-book__blk')) {
      ['r', 'l'].forEach(function (s) {
        var b = document.createElement('div');
        b.className = 'nfcat-book__blk nfcat-book__blk--' + s;
        b.innerHTML = '<span class="nfcat-book__stk"></span>';
        inn.insertBefore(b, inn.firstChild);
      });
    }
    this.Lk = inn.querySelector('.nfcat-book__blk--l .nfcat-book__stk');
    this.Rk = inn.querySelector('.nfcat-book__blk--r .nfcat-book__stk');
  };
  /* touch: lift toward the viewer while the book is in the middle band of the screen, settle when it leaves */
  B.touch = function () {
    var root = this.root, inn = this.inn, gs = this.gs, anims = [];
    if (!window.IntersectionObserver || !inn.animate) return;
    root.classList.add('is-tl');
    function go(up) {
      var rm = RM.matches, dur = rm ? 1500 : 1100, ez = 'cubic-bezier(.22,.75,.24,1)';
      var tIn = up ? (rm ? 'translate3d(0,-6px,20px) rotateX(11.8deg)' : 'translate3d(0,-10px,34px) rotateX(9deg)') : 'translate3d(0,0,0) rotateX(16deg)';
      var tGs = up ? (rm ? 'translate3d(0,4px,0) scale(1.06)' : 'translate3d(0,6px,0) scale(1.1)') : 'translate3d(0,0,0) scale(1)';
      var oGs = up ? (rm ? 0.77 : 0.62) : 1;
      var fIn = getComputedStyle(inn).transform, fGs = gs ? getComputedStyle(gs).transform : '', oG = gs ? getComputedStyle(gs).opacity : '1';
      anims.forEach(function (a) { a.cancel(); });
      anims = [inn.animate([{ transform: fIn === 'none' ? 'rotateX(16deg)' : fIn }, { transform: tIn }], { duration: dur, easing: ez, fill: 'forwards' })];
      if (gs) anims.push(gs.animate([{ transform: fGs === 'none' ? 'none' : fGs, opacity: oG }, { transform: tGs, opacity: oGs }], { duration: dur, easing: ez, fill: 'forwards' }));
    }
    var up = false;
    var io = new IntersectionObserver(function (es) {
      var on = es[es.length - 1].isIntersecting;
      if (on !== up) { up = on; root.classList.toggle('is-up', on); go(on); }
    }, { rootMargin: '-30% 0px -30% 0px' });
    io.observe(inn);
  };
  /* which third of the book the cursor is over: -1 left, 0 middle, 1 right */
  B.track = function (e) {
    var r = this.rect || (this.rect = this.a.getBoundingClientRect());
    if (!r.width) return;
    var f = (e.clientX - r.left) / r.width, z = f > 2 / 3 ? 1 : f < 1 / 3 ? -1 : 0;
    if (z !== this.zone) { this.zone = z; this.zs = performance.now(); if (z) this.dir = z; }
    this.kick();
  };
  B.kick = function () {
    if (this.raf || !this.build()) return;
    this.last = 0;
    this.raf = requestAnimationFrame(this.tick);
  };
  /* the reader has shown interest: fetch the pictures of every page drawn so far and draw the rest in idle time */
  B.eager = function () {
    if (this.all) return;
    this.all = true;
    var c = this.cache || {};
    for (var k in c) Array.prototype.forEach.call(c[k].querySelectorAll('img[loading="lazy"]'), function (im) { im.loading = 'eager'; });
    this.warm();
  };
  /* page list: cover, welcome, contents, then opener, products and room photo of each chapter the snippet sent
     a spread for, then the closing page and the back cover (always an even count). Then the sheets. */
  B.build = function () {
    if (this.seq) return true;
    var d = this.d;
    if (!d || !d.chapters) return false;
    var ctx = Object.create(P);
    ctx.d = d;
    ctx.pm = {};
    ctx.hotspotsHTML = function () { return ''; };
    ctx.index();
    var L = ctx.leaves, seq = [];
    function pick(fn) { for (var i = 0; i < L.length; i++) if (fn(L[i])) return L[i]; return null; }
    function kind(k) { return function (x) { return x.k === k; }; }
    seq.push(pick(kind('cover')), pick(kind('welcome')), pick(kind('contents')), pick(kind('mosaic')));
    d.chapters.forEach(function (ch, ci) {
      var sp = ch.spreads && ch.spreads[0];
      if (!sp || !sp.products || !sp.products.length) return;
      ['photo', 'opener', 'products', 'life'].forEach(function (k) {
        seq.push(pick(function (x) { return x.k === k && x.ch === ci && (x.sp == null || x.sp === 0); }));
      });
    });
    seq.push(pick(kind('close')), pick(kind('back')));
    seq = seq.filter(Boolean);
    if (seq.length % 2) seq.splice(seq.length - 2, 1);
    if (seq.length < 6) return false;
    var st = document.createElement('div');
    st.className = 'nfcat-book__st';
    this.st = st;
    if (!this.size()) { this.st = null; return false; }
    this.ctx = ctx;
    this.seq = seq;
    this.N = seq.length;
    this.M = this.N / 2;
    this.cache = {};
    var l0 = this.Ls.querySelector('.nfcat-leaf'), r0 = this.Rs.querySelector('.nfcat-leaf');
    if (l0) this.cache[0] = l0;
    if (r0) this.cache[1] = r0;
    /* the sheets live in a shadow root: nothing the book adds or moves reaches the document's MutationObservers or
       its style sweeps (custom-nav.js watches the whole document and restyles it on every change). The catalog CSS
       is copied in once from the page's own stylesheet; without it, the sheets stay in the page as before. */
    var sr = st, css = bookCSS();
    if (css && st.attachShadow) {
      try {
        sr = st.attachShadow({ mode: 'open' });
        var se = document.createElement('style');
        se.textContent = css + SHADOW_CSS;
        sr.appendChild(se);
        sr.appendChild(this.meas);
      } catch (e) { sr = st; }
    }
    this.sr = sr;
    /* one cell per sheet; the sheets around the open spread are visible, two each side (one for a tiny book) */
    this.HW = this.M >= 5 ? 2 : 1;
    this.win = {};
    this.cells = [];
    for (var c = 0; c < this.M; c++) this.cells.push(this.cell(sr, c));
    /* the soft shadow a turning sheet casts on the page below, clipped to the spread, under the turning sheet */
    var cw = document.createElement('div');
    cw.className = 'nfcat-book__cw';
    cw.innerHTML = '<span class="nfcat-book__cs2"></span>';
    sr.appendChild(cw);
    this.cs = cw.firstChild;
    var g = document.createElement('span');
    g.className = 'nfcat-book__gut';
    sr.appendChild(g);
    this.inn.appendChild(st);
    this.render();
    this.root.classList.add('is-st');
    return true;
  };
  /* one sheet: NP panels, each with a front and a back face (a clip box holding a page) followed by its tone (a flat
     tone and, past the first panel, a ramp). DOM order is the paint order: each panel and its tone over the panels
     inside it. The tones are not clipped by the faces: a tone fades out over the last XF pixels before its hinge and
     the next panel's tone reaches back over that band and fades in, so no tone has an edge on a hinge (an edge there
     showed as a fine light line). */
  B.cell = function (st, j) {
    var el = document.createElement('div'), html = '', p, q, k = 0;
    el.className = 'nfcat-book__cl';
    for (p = 0; p < NP; p++) {
      for (q = 0; q < 2; q++) html += '<div class="nfcat-book__fa nfcat-book__fa--' + (q ? 'b' : 'f') + (p === NP - 1 ? ' nfcat-book__fa--e' : '') + '"><div class="nfcat-book__fw"></div></div>';
      html += '<span class="nfcat-book__tn"></span>' + (p ? '<span class="nfcat-book__tn"></span>' : '');
    }
    el.innerHTML = html;
    st.appendChild(el);
    var c = { j: j, el: el, t: -1, on: false, ex: 0, ez: 0, F: { f: [], b: [] }, K: { f: [], b: [] }, T: [] }, ch = el.children;
    for (p = 0; p < NP; p++) {
      for (q = 0; q < 2; q++) { var fa = ch[k++]; c.F[q ? 'b' : 'f'].push({ el: fa, w: fa.firstChild }); c.K[q ? 'b' : 'f'].push(null); }
      c.T.push({ l: ch[k++], r: p ? ch[k++] : null });
    }
    this.lay(c);
    return c;
  };
  /* panel boxes: each is as wide as its panel plus OV pixels under the next panel, enough to stay under it even when
     the panel is seen steeply from the side (no seam at the hinge); the page
     inside is shifted so the panels together show one whole page. A back face is mirrored, so its page is placed
     from the other end. */
  B.lay = function (c) {
    c.t = -1;
    for (var p = 0; p < NP; p++) {
      var f = c.F.f[p], b = c.F.b[p], T = c.T[p], L = this.L[p], fi = p ? XF : 0, fo = p < NP - 1 ? XF : 0, w = fi + L;
      f.el.style.width = b.el.style.width = this.bw[p] + 'px';
      f.w.style.left = -this.sp[p] + 'px';
      b.w.style.left = (this.sp[p] + this.bw[p] - this.W) + 'px';
      /* tones: the box starts XF px before the panel (past the first one) and fades in there; it fades out over the
         last XF px before the next hinge. The ramp runs from 0 at the panel's inner edge to 1 at its outer edge. */
      T.l.style.width = w + 'px';
      T.l.style.background = 'linear-gradient(to right,rgba(' + TONE + ',0) 0px,rgb(' + TONE + ') ' + fi + 'px,rgb(' + TONE + ') ' +
        (w - fo).toFixed(2) + 'px,rgba(' + TONE + ',' + (fo ? 0 : 1) + ') ' + w.toFixed(2) + 'px)';
      if (T.r) {
        T.r.style.width = w + 'px';
        T.r.style.background = 'linear-gradient(to right,rgba(' + TONE + ',0) ' + fi + 'px,rgba(' + TONE + ',' + ((L - fo) / L).toFixed(3) + ') ' +
          (w - fo).toFixed(2) + 'px,rgba(' + TONE + ',' + (fo ? 0 : 1) + ') ' + w.toFixed(2) + 'px)';
      }
    }
  };
  B.size = function () {
    var cs = getComputedStyle(this.inn), w = parseFloat(cs.width) / 2, h = parseFloat(cs.height);
    if (!(w > 0) || !(h > 0)) return false;
    if (w === this.W && h === this.H) return true;
    this.W = w; this.H = h; this.P = Math.round(PERSP * w);
    var s = this.st.style, p;
    s.setProperty('--nfb-w', w + 'px');
    s.setProperty('--nfb-h', h + 'px');
    this.sp = []; this.L = []; this.bw = [];
    for (p = 0; p < NP; p++) this.sp.push(Math.round(SPL[p] * w));
    for (p = 0; p < NP; p++) { this.L.push((p < NP - 1 ? this.sp[p + 1] : w) - this.sp[p]); this.bw.push(this.L[p] + (p < NP - 1 ? OV : 0)); }
    if (this.cells) for (var i = 0; i < this.cells.length; i++) this.lay(this.cells[i]);
    return true;
  };
  /* the page on one face of a sheet: front of sheet j is page 2j+1, back is 2j+2 (the cover is the back of the last
     sheet). Every page belongs to exactly one face: the page itself sits in its first panel, copies in the others. */
  B.fk = function (c, side) { return mod(side === 'f' ? 2 * c.j + 1 : 2 * c.j + 2, this.N); };
  /* one job on one face: draw its page, or put the page (or a copy) in the next empty panel. 0 when complete */
  B.fill = function (c, side) {
    var K = c.K[side];
    for (var p = 0; p < NP; p++) {
      if (K[p] !== null) continue;
      var k = this.fk(c, side), pg = this.cache[k];
      if (!pg) { this.page(k); return 1; }
      var cp = p ? pg.cloneNode(true) : pg;
      if (p && this.all) Array.prototype.forEach.call(cp.querySelectorAll('img[loading="lazy"]'), function (im) { im.loading = 'eager'; });
      c.F[side][p].w.appendChild(cp);
      K[p] = k;
      return 1;
    }
    return 0;
  };
  B.full = function (c, side) { while (this.fill(c, side)) {} };
  /* one page, drawn once from the catalog data and kept. Inner links lose their href (the page CSS still styles
     them, and the whole book stays one link to the catalog); headings become paragraphs. */
  B.page = function (k) {
    k = mod(k, this.N);
    var el = this.cache[k];
    if (el) return el;
    var PF = window.__nfBook4Prof, t0 = PF ? performance.now() : 0;
    var html = this.ctx.leafHTML(this.seq[k], false)
      .replace(/(<a\b[^>]*?)\s(href|data-go)="[^"]*"/g, '$1')
      .replace(/(<a\b[^>]*?)\s(href|data-go)="[^"]*"/g, '$1')
      .replace(/<(\/?)(button|h2)\b/g, function (m0, sl, tag) { return '<' + sl + (tag === 'h2' ? 'p' : 'span'); });
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    el = tmp.firstChild;
    var pw = Math.max(120, this.W || 260), eager = this.all;
    Array.prototype.forEach.call(el.querySelectorAll('img'), function (im) {
      if (im.hasAttribute('data-f')) im.sizes = Math.max(60, Math.round(pw * parseFloat(im.getAttribute('data-f')))) + 'px';
      if (eager && im.loading === 'lazy') im.loading = 'eager';
    });
    this.fitLeaf(el);
    this.cache[k] = el;
    if (PF) (PF.pb = PF.pb || []).push([k, Math.round(performance.now() - t0), this.raf ? 1 : 0]);
    return el;
  };
  /* shrink the text of one page until it fits, off screen at 300 by 400 (every size is in container units, so the
     ratio holds at any size). Same ladder as fitBox (steps of 0.93) but it measures once and jumps close to the
     answer from below, so it takes two or three layouts instead of up to fourteen. */
  B.fitLeaf = function (leaf) {
    if (leaf.classList.contains('nfcat-leaf--products')) return;
    var box = null;
    for (var c = leaf.firstElementChild; c; c = c.nextElementSibling) if (c.classList.contains('nfcat-in')) { box = c; break; }
    if (!box || !box.firstElementChild) return;
    /* a page measured before (on this device, same text) reuses its fit and skips the layouts entirely */
    var key = 'k' + h31(leaf.innerHTML), memo = fitMemo(), fontsIn = !document.fonts || document.fonts.status === 'loaded';
    if (memo && memo[key] != null) {
      if (memo[key] < 1) leaf.style.setProperty('--fit', String(memo[key])); else leaf.style.removeProperty('--fit');
      return;
    }
    var parent = leaf.parentNode, next = leaf.nextSibling, hgt = 0, room = 0, got = 1;
    this.meas.appendChild(leaf);
    leaf.style.removeProperty('--fit');
    function fits() {
      var r = box.getBoundingClientRect();
      if (!r.height) return true;
      var a = box.firstElementChild.getBoundingClientRect().top, b = box.lastElementChild.getBoundingClientRect().bottom;
      hgt = b - a; room = r.height;
      return a >= r.top - 1 && b <= r.bottom + 1;
    }
    if (!fits() && hgt > 0) {
      var j = Math.max(1, Math.floor(Math.log(Math.sqrt(room / hgt)) / Math.log(0.93)));
      for (var n = 0; n < 14 && j <= 14; n++, j++) {
        got = +Math.pow(0.93, j).toFixed(3);
        leaf.style.setProperty('--fit', String(got));
        if (fits()) break;
      }
    }
    if (parent) parent.insertBefore(leaf, next); else this.meas.removeChild(leaf);
    if (memo && fontsIn) { memo[key] = got; fitMemo(memo); }
  };
  /* faces a turn needs on screen, for the turn k turns ahead in direction dir: the sheet that turns (both faces)
     and the page it uncovers */
  B.need = function (dir, k) {
    var i = Math.round(this.pos) + k * dir, M = this.M;
    return dir > 0 ? [[mod(i, M), 'f'], [mod(i, M), 'b'], [mod(i + 1, M), 'f']] : [[mod(i - 1, M), 'b'], [mod(i - 1, M), 'f'], [mod(i - 2, M), 'b']];
  };
  /* at most one job toward that turn; true when everything it needs is in place */
  B.prep = function (dir, k) {
    var L = this.need(dir, k);
    for (var n = 0; n < L.length; n++) if (this.fill(this.cells[L[n][0]], L[n][1])) return false;
    return true;
  };
  B.step = function (t) {
    this.raf = 0;
    var PF = window.__nfBook4Prof, t0 = PF ? performance.now() : 0;
    var dt = this.last ? Math.min(0.05, (t - this.last) / 1000) : 1 / 60;
    this.last = t;
    var rm = RM.matches, tu = this.turn, zone = this.hover ? this.zone : 0;
    /* the page in the air: position is a straight function of time, so every turn takes exactly TURN ms */
    if (tu) {
      var s = (t - tu.t0) / TURN;
      if (s >= 1) { this.pos = mod(tu.from + tu.dir, this.M); this.turn = tu = null; this.rest = t; }
      else this.pos = tu.from + tu.dir * s;
    }
    /* at rest over an outer third: after the pause (or a short dwell on first entering it) start the next turn.
       Pages still missing for it are put in place first, one job per frame, never during a turn; with time to
       spare in the pause the turn after it is prepared too. */
    if (!tu && zone) {
      var due = t - this.rest >= PAUSE && t - this.zs >= DWELL;
      if (this.prep(zone, 0)) {
        if (due) { this.turn = tu = { dir: zone, t0: t, from: this.pos }; this.dir = zone; }
        else if (PAUSE - (t - this.rest) > 60) this.prep(zone, 1);
      }
    }
    /* lift: forward and up while the cursor is over the book or a page is still in the air, a critically damped
       spring so it eases in, holds and settles without a bounce */
    var lt = this.hover || tu ? 1 : this.focus ? 0.6 : 0, ol = rm ? 3 : 3.8;
    this.lv += (ol * ol * (lt - this.lift) - 2 * ol * this.lv) * dt;
    this.lift += this.lv * dt;
    var still = !tu && !zone && Math.abs(lt - this.lift) < 0.003 && Math.abs(this.lv) < 0.01;
    if (still) { this.lift = lt; this.lv = 0; }
    this.render();
    if (!still) this.raf = requestAnimationFrame(this.tick);
    else if (!this.hover && !this.focus) this.warm();
    if (PF) { var ms = performance.now() - t0; PF.n++; PF.ms += ms; if (ms > PF.max) PF.max = ms; }
  };
  /* one sheet at turn progress t (0 flat on the right, 1 flat on the left) */
  B.shape = function (c, t) {
    if (c.t === t) return;
    c.t = t;
    var P = this.P, pi = Math.PI, th = pi * ez(t);
    var be = (t > 0 && t < 1 ? Math.sin(2 * pi * t) : 0) * (RM.matches ? BEND * 0.6 : BEND) * pi / 180;
    var hx = 0, hz = 0, sPrev = 0, dg = 180 / pi;
    for (var p = 0; p < NP; p++) {
      var a = clamp(th + be * KP[p], 0, pi), ca = Math.cos(a), sn = Math.max(0, Math.sin(a));
      /* which side of this panel faces the viewer (eye on the spine axis, P in front of the page) */
      var front = hx * sn + (P - hz) * ca > 0, F = c.F.f[p], Bk = c.F.b[p], T = c.T[p];
      var tf = 'perspective(' + P + 'px) translate3d(' + hx.toFixed(2) + 'px,0,' + hz.toFixed(2) + 'px) rotateY(' + (-a * dg).toFixed(3) + 'deg)';
      sty((front ? F : Bk).el, 'transform', front ? tf : tf + ' translateX(' + this.bw[p] + 'px) rotateY(180deg)');
      sty(F.el, 'opacity', front ? '1' : '0');
      sty(Bk.el, 'opacity', front ? '0' : '1');
      /* matte tone by angle; past the first panel it starts from the tone of the panel before and ramps to its own */
      var S = front ? SF : SB, sa = Math.pow(sn, 1.5), base = p ? S * sPrev : S * sa, rp = Math.max(0, S * sa - base);
      if (base > 0.004 || rp > 0.004) {
        var tt = p ? tf + ' translateX(' + (-XF) + 'px)' : tf;
        sty(T.l, 'transform', tt);
        if (T.r) sty(T.r, 'transform', tt);
      }
      op(T.l, base);
      if (T.r) op(T.r, rp);
      sPrev = sa;
      hx += this.L[p] * ca;
      hz += this.L[p] * sn;
    }
    c.ex = hx; c.ez = hz;
  };
  /* the soft shadow beside the free edge of the turning sheet, on whichever page it is over */
  B.cast = function (c, t) {
    var o = 0;
    if (c && t > 0 && t < 1) {
      var W = this.W, P = this.P, z = Math.max(0, c.ez), xe = c.ex * P / (P - z), h = z / W;
      o = Math.min(1, h / 0.06) * (1 - 0.45 * h) * Math.min(1, Math.abs(xe) / (0.1 * W));
      sty(this.cs, 'transform', 'translate3d(' + (W + xe).toFixed(2) + 'px,0,0) scaleX(' + ((xe < 0 ? -1 : 1) * (0.07 + 0.2 * h)).toFixed(4) + ')');
    }
    op(this.cs, (RM.matches ? 0.8 : 1) * o);
  };
  B.render = function () {
    var pos = this.pos, i = Math.floor(pos + 1e-6), t0 = pos - i, HW = this.HW, now = {}, j, d, c, t, turning = null;
    if (t0 < 1e-6) t0 = 0;
    for (d = -HW; d <= HW; d++) {
      j = mod(i + d, this.M);
      c = this.cells[j];
      t = d < 0 ? 1 : d > 0 ? 0 : t0;
      now[j] = 1;
      /* faces that can be seen at this position must be complete now (normally they were prepared ahead) */
      if (d === -1) this.full(c, 'b');
      else if (d === 0) { if (t < 1) this.full(c, 'f'); if (t > 0) this.full(c, 'b'); turning = c; }
      else if (d === 1 && t0 > 0) this.full(c, 'f');
      this.shape(c, t);
      sty(c.el, 'zIndex', d === 0 ? '4' : d === 1 || d === -1 ? '3' : '2');
      if (!c.on) { c.on = true; sty(c.el, 'visibility', 'visible'); }
    }
    for (j in this.win) if (!now[j]) { var q = this.cells[j]; q.on = false; sty(q.el, 'visibility', 'hidden'); }
    this.win = now;
    this.cast(turning, t0);
    /* page blocks: the share of the book already turned sits on the left. Over the loop seam (back cover to
       cover) they trade places while that sheet turns. Bottom edges show a little less as the book lifts. */
    var l = this.lift * (RM.matches ? 0.6 : 1);
    var p = mod(pos, this.M), M1 = this.M - 1, fr = p <= M1 ? p / M1 : 1 - sstep(p - M1), ky = 1 - 0.25 * l;
    sty(this.Lk, 'transform', 'translate3d(' + (-TX * fr).toFixed(3) + '%,' + (TY * fr * ky).toFixed(3) + '%,0)');
    sty(this.Rk, 'transform', 'translate3d(' + (TX * (1 - fr)).toFixed(3) + '%,' + (TY * (1 - fr) * ky).toFixed(3) + '%,0)');
    sty(this.inn, 'transform', 'translate3d(0,' + (-10 * l).toFixed(2) + 'px,' + (34 * l).toFixed(2) + 'px) rotateX(' + (16 - 7 * l).toFixed(2) + 'deg)');
    if (this.gs) {
      op(this.gs, 1 - 0.38 * l);
      sty(this.gs, 'transform', 'translate3d(0,' + (6 * l).toFixed(1) + 'px,0) scale(' + (1 + 0.1 * l).toFixed(3) + ')');
    }
  };
  /* idle time, from the moment the book comes near the screen: complete both faces of the sheets around the open
     spread (nearest first), then draw every other page of the book, text pages first (their fit takes a slow
     laptop around 100ms each), one job per idle slot. Copies for far sheets wait until the spread comes near. */
  B.warm = function () {
    if (this.wq || !this.seq) return;
    var self = this;
    this.wq = 1;
    function again() { self.wq = 1; idle(); }
    function idle() {
      if (window.requestIdleCallback) window.requestIdleCallback(job, self.raf ? undefined : { timeout: 600 });
      else setTimeout(job, self.raf ? 120 : 50);
    }
    function job() {
      self.wq = 0;
      if (self.raf) return;   /* animating: step() prepares at safe moments and calls warm() again at rest */
      var i = Math.round(self.pos), M = self.M, n, c, sd, q, k;
      for (n = 0; n < 2 * self.HW + 2; n++) {
        c = self.cells[mod(i + (n % 2 ? -(n + 1) / 2 : n / 2), M)];
        for (q = 0; q < 2; q++) if (self.fill(c, q ? 'b' : 'f')) return again();
      }
      for (var pass = 0; pass < 2; pass++) {
        for (n = 0; n < M; n++) {
          c = self.cells[mod(i + (n % 2 ? -(n + 1) / 2 : n / 2), M)];
          for (q = 0; q < 2; q++) {
            sd = q ? 'b' : 'f';
            k = self.fk(c, sd);
            if (self.cache[k] || (!pass && !TEXT.test(self.seq[k].k))) continue;
            self.page(k);
            return again();
          }
        }
      }
    }
    idle();
  };
  var TEXT = /^(contents|opener|close|back|welcome)$/;

  /* ---------- homepage band: reveal and count up once it scrolls into view ---------- */
  function countUp(el, to, dur, delay) {
    var t0 = 0;
    function f(t) {
      if (!t0) t0 = t + delay;
      var p = clamp((t - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(to * e));
      if (p < 1) requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
    /* never leave a wrong number behind if frames stall (background tab) */
    setTimeout(function () { el.textContent = String(to); }, delay + dur + 400);
  }
  function promo(root) {
    if (!('IntersectionObserver' in window)) return;
    var nums = root.querySelectorAll('[data-count]');
    root.classList.add('is-js');
    var io = new IntersectionObserver(function (es) {
      if (!es.some(function (e) { return e.isIntersecting; })) return;
      io.disconnect();
      /* the facts are still transparent here (their fade starts later), so the reset to 0 never shows */
      void root.offsetWidth;
      root.classList.add('is-in');
      Array.prototype.forEach.call(nums, function (n) {
        var to = parseInt(n.getAttribute('data-count'), 10) || 0;
        n.textContent = '0';
        countUp(n, to, RM.matches ? 800 : 1400, 380);
      });
    }, { threshold: 0.2 });
    io.observe(root);
  }

  function boot() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-nfcat-viewer]:not(.is-booted)'), function (el) {
      el.classList.add('is-booted');
      try { new Viewer(el); } catch (e) { if (window.console) console.error('nf-catalog', e); }
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-nfcat-book]:not(.is-booted)'), function (el) {
      el.classList.add('is-booted');
      try { new Book(el); } catch (e) { if (window.console) console.error('nf-catalog book', e); }
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-nfcat-promo]:not(.is-booted)'), function (el) {
      el.classList.add('is-booted');
      try { promo(el); } catch (e) { if (window.console) console.error('nf-catalog promo', e); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  document.addEventListener('shopify:section:load', function () { window.__nfCatalogBooted = true; boot(); });
})();
