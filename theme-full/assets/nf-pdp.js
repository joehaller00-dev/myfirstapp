/* NF-PDP-V1 (2026-09-13) product page behaviours: Complete the look rows, share, reveal, image rails (one page per
   arrow press, native snap scrolling), Shop by accordions, Seen in Real Homes modal, article contents list, and the
   deferred sections (Seen in Real Homes, Standard, Shop by, Catalog are fetched from the product.nf-pdp-below view when
   they come near the viewport, so the first load stays light). Motion: transform and opacity only.
   No class is ever put on <html> or <body> at start up (that would restyle the whole page). */
(function () {
  if (window.__nfPdpV1) return;
  window.__nfPdpV1 = 1;
  var d = document;
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || d).querySelectorAll(s)); }
  var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
  var hasIO = 'IntersectionObserver' in window;

  /* reveal: only elements still below the fold get armed, so nothing visible ever blinks */
  var io = hasIO ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  function reveal(root) {
    if (!io || RM) return;
    var vh = window.innerHeight;
    $$('.nf-rv, .nf-std__card', root).forEach(function (el) {
      if (el.classList.contains('nf-rv--armed')) return;
      if (el.getBoundingClientRect().top < vh * 0.92) return;
      el.classList.add('nf-rv--armed');
      io.observe(el);
    });
  }

  /* NF-CTLIMG-V1 - images parsed in a detached node never fire native lazy loading once moved into the page,
     so they sit as grey boxes forever. Kick them after they are in the DOM. */
  function nfKick(scope) {
    try {
      var ims = scope.querySelectorAll('img');
      for (var i = 0; i < ims.length; i++) {
        var im = ims[i];
        im.loading = 'eager';
        if (!im.complete || !im.naturalWidth) {
          var ss = im.getAttribute('srcset'), sr = im.getAttribute('src');
          if (ss) { im.removeAttribute('srcset'); im.setAttribute('srcset', ss); }
          if (sr) { im.setAttribute('src', sr); }
        }
      }
    } catch (e) {}
  }

  /* D1 complete the look */
  function ctl() {
    var box = $('[data-nf-ctl]');
    if (!box || box._nf) return;
    box._nf = 1;
    var list = $('[data-nf-ctl-list]', box), pid = box.getAttribute('data-pid'), type = box.getAttribute('data-type') || '';
    var base = box.getAttribute('data-base') || '/recommendations/products';
    /* NF-CTLFIX-V1: Prestige redraws the info column on every option click; refill from the first result */
    if (window.__nfCtlCache && window.__nfCtlCache.pid === pid) { list.innerHTML = window.__nfCtlCache.html; nfKick(list); list.removeAttribute('aria-busy'); list.classList.add('is-ready'); return; }
    function get(intent) {
      /* NF-CTLFIX-V1: a request that hangs used to leave the block grey forever */
      var ac = window.AbortController ? new AbortController() : null, tm = ac ? setTimeout(function () { ac.abort(); }, 7000) : 0;
      return fetch(base + '?section_id=nf-pdp-recs&product_id=' + pid + '&limit=10&intent=' + intent, { credentials: 'same-origin', signal: ac ? ac.signal : undefined })
        .then(function (r) { return r.ok ? r.text() : ''; })
        .then(function (h) { var t = d.createElement('div'); t.innerHTML = h; return $$('[data-nf-rec]', t); })
        .then(function (x) { clearTimeout(tm); return x; }, function () { clearTimeout(tm); return []; });
    }
    get('complementary').then(function (a) {
      return a.length >= 3 ? a : get('related').then(function (b) { return a.concat(b); });
    }).then(function (rows) {
      // score: shares a room or outdoor area with this product (+2), a different product type (+1); later items in
      // the related list win ties, so the rows differ from the first cards of "Complete the Room" below
      var rooms = (box.getAttribute('data-rooms') || '').split(' ').filter(Boolean);
      var seen = {}, scored = [];
      rows.forEach(function (r, i) {
        var h = r.getAttribute('href');
        if (seen[h]) return;
        seen[h] = 1;
        var rr = (r.getAttribute('data-rooms') || '').split(' ');
        var s = (rooms.some(function (x) { return rr.indexOf(x) > -1; }) ? 2 : 0) + (type && r.getAttribute('data-type') === type ? 0 : 1);
        scored.push({ r: r, s: s + i / 100 });
      });
      scored.sort(function (a, b) { return b.s - a.s; });
      var pick = scored.slice(0, 3).map(function (x) { return x.r; });
      if (!pick.length) { box.hidden = true; return; }
      list.innerHTML = '';
      pick.forEach(function (r) { list.appendChild(r); });
      nfKick(list); /* NF-CTLIMG-V1 */
      window.__nfCtlCache = { pid: pid, html: list.innerHTML };
      list.removeAttribute('aria-busy');
      list.classList.add('is-ready');
    }).catch(function () { box.hidden = true; });
  }

  /* D4 share */
  function toast(box, msg) {
    var t = box && $('[data-nf-toast]', box);
    if (!t) return;
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(t._t);
    t._t = setTimeout(function () { t.classList.remove('is-on'); }, 2200);
  }
  function copy(url, box) {
    var ok = function () { toast(box, 'Link copied'); };
    var fallback = function () {
      var i = d.createElement('input');
      i.value = url; d.body.appendChild(i); i.select();
      try { d.execCommand('copy'); ok(); } catch (e) { toast(box, url); }
      i.remove();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, fallback); else fallback();
  }
  d.addEventListener('click', function (e) {
    var s = e.target.closest && e.target.closest('[data-nf-share],[data-nf-copy]');
    if (!s) return;
    var box = s.closest('[data-nf-sharebox]');
    var url = s.getAttribute('data-url') || location.href.split('?')[0];
    if (s.hasAttribute('data-nf-copy')) { copy(url, box); return; }
    var coarse = window.matchMedia && matchMedia('(pointer: coarse)').matches;
    if (navigator.share && coarse) {
      navigator.share({ title: s.getAttribute('data-title') || d.title, url: url }).catch(function () {});
      return;
    }
    var more = box && $('[data-nf-more]', box);
    if (more) { more.hidden = !more.hidden; s.setAttribute('aria-expanded', more.hidden ? 'false' : 'true'); }
    else copy(url, box);
  });

  /* rails: arrows move exactly one page, snap keeps cards aligned */
  function rail(root) {
    var tr = $('[data-nf-track]', root);
    if (!tr || tr._nf) return;
    tr._nf = 1;
    var prev = $('[data-nf-prev]', root), next = $('[data-nf-next]', root), dots = $('[data-nf-dots]', root), bar = $('[data-nf-bar]', root);
    var ticking = false, nd = 0;
    function pages() { return Math.max(1, Math.round(tr.scrollWidth / Math.max(1, tr.clientWidth) + 0.2)); }
    function buildDots() {
      if (!dots) return;
      var n = Math.min(8, pages());
      if (n === nd) return;
      nd = n; dots.innerHTML = '';
      if (n < 2) return;
      for (var i = 0; i < n; i++) {
        var b = d.createElement('button');
        b.type = 'button'; b.setAttribute('aria-label', 'Page ' + (i + 1));
        (function (k) { b.addEventListener('click', function () { tr.scrollTo({ left: k * tr.clientWidth, behavior: RM ? 'auto' : 'smooth' }); }); })(i);
        dots.appendChild(b);
      }
    }
    function upd() {
      ticking = false;
      var max = tr.scrollWidth - tr.clientWidth, x = tr.scrollLeft;
      if (prev) prev.disabled = x < 4;
      if (next) next.disabled = x > max - 4;
      if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, Math.max(0.12, (x + tr.clientWidth) / tr.scrollWidth)) : 1) + ')';
      if (dots && nd > 1) {
        var cur = max > 0 ? Math.round((x / max) * (nd - 1)) : 0;
        $$('button', dots).forEach(function (b, i) { b.setAttribute('aria-current', i === cur ? 'true' : 'false'); });
      }
    }
    function go(dir) {
      var w = tr.clientWidth, x = tr.scrollLeft, target = x + dir * w, best = null;
      // land on the first card edge inside the next page so no card is skipped or cut
      $$(':scope > *', tr).forEach(function (k) {
        var l = k.offsetLeft - tr.offsetLeft;
        if (dir > 0 && l > x + 4 && l <= target + 4) best = l;
        if (dir < 0 && l < x - 4 && l >= target - 4 && best === null) best = l;
      });
      tr.scrollTo({ left: best === null ? target : best, behavior: RM ? 'auto' : 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    tr.addEventListener('scroll', function () { if (!ticking) { ticking = true; raf(upd); } }, { passive: true });
    tr.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    window.addEventListener('resize', function () { buildDots(); upd(); }, { passive: true });
    buildDots(); upd();
  }

  /* Shop by accordions */
  function shopby(sec) {
    $$('[data-nf-sbacc]', sec).forEach(function (acc) {
      if (acc._nf) return;
      acc._nf = 1;
      var sum = $('summary', acc);
      function arm() {
        $$('.nf-sb__tile', acc).forEach(function (t, i) { t.style.setProperty('--i', Math.min(i, 8)); });
        rail(acc);
      }
      if (acc.open) arm();
      acc.addEventListener('toggle', function () { if (acc.open) arm(); });
      sum.addEventListener('click', function (e) {
        if (!acc.open || RM) return;
        e.preventDefault();
        acc.classList.add('is-closing');
        setTimeout(function () { acc.open = false; acc.classList.remove('is-closing'); }, 220);
      });
    });
  }

  /* Seen in Real Homes */
  function spaces(sec) {
    rail(sec);
    var dlg = $('[data-nf-dlg]', sec);
    if (!dlg || dlg._nf) return;
    dlg._nf = 1;
    var tiles = $$('[data-nf-tile]', sec), cur = 0;
    function show(i) {
      cur = (i + tiles.length) % tiles.length;
      var t = tiles[cur];
      var g = function (k) { return t.getAttribute('data-' + k) || ''; };
      var img = $('[data-nf-dimg]', dlg), tim = $('img', t);
      var hi = g('img') + '?width=1000';
      img.alt = 'Customer photo of the ' + g('pt');
      // show the tile photo already in the cache at once, then swap in the sharper copy when it has loaded
      img.src = (tim && (tim.currentSrc || tim.src)) || hi;
      var pre = new Image();
      pre.onload = function () { if (tiles[cur] === t) img.src = hi; };
      pre.src = hi;
      $('[data-nf-dname]', dlg).textContent = g('name');
      $('[data-nf-dtext]', dlg).textContent = g('text');
      $('[data-nf-dpt]', dlg).textContent = g('pt');
      $('[data-nf-dhref]', dlg).href = g('href');
      $('[data-nf-dhref2]', dlg).href = g('href');
      var pi = $('[data-nf-dpi]', dlg);
      if (g('pi')) { pi.src = g('pi') + '?width=144'; pi.hidden = false; } else pi.hidden = true;
      var box = $('.nf-sp__box', dlg);
      if (box && !RM) { box.style.animation = 'none'; void box.offsetWidth; box.style.animation = ''; }
    }
    function open(i) {
      show(i);
      if (dlg.showModal) { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute('open', '');
      d.documentElement.classList.add('nf-sp-lock');
    }
    function close() { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }
    tiles.forEach(function (b, i) { b.addEventListener('click', function () { open(i); }); });
    dlg.addEventListener('close', function () { d.documentElement.classList.remove('nf-sp-lock'); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
    $('[data-nf-close]', dlg).addEventListener('click', close);
    $('[data-nf-dprev]', dlg).addEventListener('click', function () { show(cur - 1); });
    $('[data-nf-dnext]', dlg).addEventListener('click', function () { show(cur + 1); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') show(cur + 1);
      if (e.key === 'ArrowLeft') show(cur - 1);
    });
  }

  /* article contents list */
  function toc(sec) {
    var nav = $('[data-nf-toc]', sec), body = $('[data-nf-artbody]', sec);
    if (!nav || !body || nav._nf) return;
    nav._nf = 1;
    var hs = $$('h3', body);
    if (hs.length < 3) return;
    var ol = $('ol', nav);
    hs.forEach(function (h, i) {
      if (!h.id) h.id = 'nf-art-s' + (i + 1);
      var li = d.createElement('li'), a = d.createElement('a');
      a.href = '#' + h.id; a.textContent = h.textContent;
      li.appendChild(a); ol.appendChild(li);
    });
    if ($('#nf-art-faq', sec)) {
      var li2 = d.createElement('li'), a2 = d.createElement('a');
      a2.href = '#nf-art-faq'; a2.textContent = 'Frequently asked questions';
      li2.appendChild(a2); ol.appendChild(li2);
    }
    nav.hidden = false;
  }

  function initIn(root) {
    reveal(root);
    $$('[data-nf-sp]', root).forEach(spaces);
    $$('[data-nf-std]', root).forEach(rail);
    $$('[data-nf-sb]', root).forEach(shopby);
    $$('[data-nf-art]', root).forEach(toc);
  }

  /* lazy start for sections already in the page */
  function lazy(sel, fn) {
    $$(sel).forEach(function (el) {
      if (!hasIO) { fn(el); return; }
      var o = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { o.disconnect(); fn(el); } });
      }, { rootMargin: '500px 0px' });
      o.observe(el);
    });
  }

  /* deferred sections: prefetch the HTML when the browser is idle after load, insert it when the shell comes near */
  function deferred() {
    var shells = $$('[data-nf-defer]');
    if (!shells.length) return;
    // templates/product.nf-pdp-below.json renders only these sections with "layout": false (a few KB, no header/footer)
    var url = location.pathname + '?view=nf-pdp-below';
    var p = null;
    function load() {
      if (!p) p = fetch(url, { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.text() : ''; })
        .then(function (h) { var t = d.createElement('template'); t.innerHTML = h; return t.content; })
        .catch(function () { return d.createDocumentFragment(); });
      return p;
    }
    function fill(sh) {
      if (sh._nf) return;
      sh._nf = 1;
      load().then(function (frag) {
        var key = sh.getAttribute('data-nf-defer');
        var sec = frag.querySelector('[id$="__' + key + '"]');
        if (!sec) { sh.removeAttribute('aria-busy'); sh.style.minHeight = '0'; return; }
        var holder = d.createElement('div');
        holder.className = 'nf-defer-in';
        // importNode: template content is inert until adopted, so images only start loading once they are in the page
        [].slice.call(sec.childNodes).forEach(function (n) { holder.appendChild(d.importNode(n, true)); });
        sh.parentNode.replaceChild(holder, sh);
        initIn(holder);
      });
    }
    if (d.readyState === 'complete') setTimeout(load, 1200);
    else window.addEventListener('load', function () {
      (window.requestIdleCallback || function (f) { setTimeout(f, 1500); })(load, { timeout: 3000 });
    });
    if (!hasIO) { shells.forEach(fill); return; }
    var o = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { o.unobserve(e.target); fill(e.target); } });
    }, { rootMargin: '1400px 0px' });
    shells.forEach(function (s) { o.observe(s); });
  }

  function init() {
    ctl(); window.__nfCtlRun = ctl;
    reveal(d);
    lazy('[data-nf-sp]', spaces);
    lazy('[data-nf-std]', rail);
    lazy('[data-nf-sb]', shopby);
    lazy('[data-nf-art]', toc);
    deferred();
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init();
})();

/* NF-REVIEW-FORM (2026-09-14): Judge.me's own "Write a review" popup never finishes opening (their form script leaves it
   0 by 0 px, and it is blank in the Judge.me admin preview too). This opens a small form of our own and sends the review
   to Judge.me's public review endpoint, so it lands in Judge.me for approval like any other review. Adds the owner's
   "Post as Anonymous" option. Test hook: window.__nfRv.open(), window.__nfRv.send(fields). */
(function () {
  if (window.__nfRv) return;
  var API = 'https://judge.me/api/v1/reviews';
  var SHOP = (window.Shopify && window.Shopify.shop) || 'ij7iyx-13.myshopify.com';
  function pid() {
    var w = document.querySelector('.jdgm-widget[data-id]');
    if (w && w.getAttribute('data-id')) return w.getAttribute('data-id');
    var m = window.ShopifyAnalytics && window.ShopifyAnalytics.meta && window.ShopifyAnalytics.meta.product;
    return m && m.id ? String(m.id) : null;
  }
  var CSS = '.nf-rv{border:0;padding:0;margin:0;background:transparent;max-width:none;max-height:none;width:100%;height:100%}' +
    '.nf-rv[open]{display:flex;align-items:center;justify-content:center}' +
    '.nf-rv::backdrop{background:rgba(20,17,14,.55)}' +
    '.nf-rv__box{position:relative;box-sizing:border-box;width:min(560px,calc(100vw - 32px));max-height:calc(100vh - 48px);overflow:auto;background:#fff;border-radius:18px;padding:30px 28px 26px;box-shadow:0 24px 60px rgba(0,0,0,.25);display:grid;gap:14px;color:#1c1c1c;font-family:inherit;text-align:left}' +
    '.nf-rv__x{position:absolute;top:10px;right:12px;width:38px;height:38px;border:0;background:transparent;font-size:28px;line-height:1;cursor:pointer;color:#555}' +
    '.nf-rv__eyebrow{margin:0;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#8a6640}' +
    '.nf-rv__prod{margin:0;font-family:var(--heading-font-family,serif);font-size:20px;font-weight:300;line-height:1.3;padding-right:34px}' +
    '.nf-rv__stars{display:flex;gap:4px}' +
    '.nf-rv__star{border:0;background:transparent;font-size:32px;line-height:1;color:#dadada;cursor:pointer;padding:2px;transition:color .15s,transform .15s}' +
    '.nf-rv__star.is-on{color:#c9a36a}.nf-rv__star:hover{transform:scale(1.08)}' +
    '.nf-rv__f{display:grid;gap:6px;align-content:start;font-size:13px;font-weight:500}' +
    '.nf-rv__f input,.nf-rv__f textarea{width:100%;box-sizing:border-box;border:1px solid #d8d8d8;border-radius:10px;padding:12px 14px;font-family:inherit;font-size:16px;background:#fff;color:#1c1c1c}' +
    '.nf-rv__f input:focus,.nf-rv__f textarea:focus{outline:none;border-color:#1c1c1c}' +
    '.nf-rv__f input:disabled{background:#f4f4f4;color:#777}' +
    '.nf-rv__f small{color:#8a8a8a;font-size:11.5px;font-weight:400}' +
    '.nf-rv__row{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
    '.nf-rv__anon{display:flex;align-items:center;gap:9px;font-size:13.5px;cursor:pointer}' +
    '.nf-rv__anon input{width:18px;height:18px;margin:0;accent-color:#1c1c1c}' +
    '.nf-rv__show{border:0;margin:0;padding:0;min-width:0}.nf-rv__show legend{padding:0;margin:0 0 8px;font-size:13px;font-weight:500}' +
    '.nf-rv__opts{display:flex;flex-wrap:wrap;gap:8px}.nf-rv__opts label{position:relative;cursor:pointer}' +
    '.nf-rv__opts input{position:absolute;opacity:0;width:1px;height:1px;pointer-events:none}' +
    '.nf-rv__opts span{display:inline-flex;align-items:center;height:36px;padding:0 15px;border:1px solid #d8d8d8;border-radius:999px;background:#fff;font-size:13px;color:#1c1c1c;transition:border-color .15s,background-color .15s,color .15s}' +
    '.nf-rv__opts label:hover span{border-color:#1c1c1c}.nf-rv__opts input:checked+span{border-color:#1c1c1c;background:#1c1c1c;color:#fff}' +
    '.nf-rv__opts input:focus-visible+span{outline:2px solid #1c1c1c;outline-offset:2px}' +
    '.nf-rv__preview{margin:8px 0 0;min-height:1em;font-size:12px;color:#8a6640}' +
    '.nf-rv__msg{margin:0;min-height:1em;font-size:13px;color:#b3261e}' +
    '.nf-rv__go{height:48px;border:0;border-radius:999px;background:#1c1c1c;color:#fff;font-family:inherit;font-weight:600;font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer}' +
    '.nf-rv__go[disabled]{opacity:.55;cursor:default}' +
    '.nf-rv__done{display:grid;gap:12px;justify-items:center;text-align:center;padding:14px 0 6px}' +
    '.nf-rv__done p{margin:0}.nf-rv__done .nf-rv__prod{padding:0}' +
    '@media (max-width:599px){.nf-rv[open]{align-items:flex-end}.nf-rv__box{width:100%;border-radius:18px 18px 0 0;max-height:92vh;padding:26px 18px 22px}.nf-rv__row{grid-template-columns:1fr}}';
  var dlg, rating = 0;
  function q(s) { return dlg.querySelector(s); }
  function msg(t) { q('.nf-rv__msg').textContent = t || ''; }
  function setStars(n) {
    rating = n;
    Array.prototype.forEach.call(dlg.querySelectorAll('.nf-rv__star'), function (b) {
      var v = +b.getAttribute('data-v');
      b.classList.toggle('is-on', v <= n);
      b.setAttribute('aria-checked', v === n ? 'true' : 'false');
    });
  }
  function close() { if (!dlg) return; if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }
  function build() {
    if (dlg) return;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    dlg = document.createElement('dialog');
    dlg.className = 'nf-rv';
    dlg.setAttribute('aria-label', 'Write a review');
    var stars = '';
    for (var n = 1; n <= 5; n++) stars += '<button type="button" class="nf-rv__star" data-v="' + n + '" role="radio" aria-checked="false" aria-label="' + n + (n > 1 ? ' stars' : ' star') + '">&#9733;</button>';
    dlg.innerHTML = '<form class="nf-rv__box" novalidate>' +
      '<button type="button" class="nf-rv__x" aria-label="Close">&times;</button>' +
      '<p class="nf-rv__eyebrow">Write a review</p><p class="nf-rv__prod"></p>' +
      '<div class="nf-rv__stars" role="radiogroup" aria-label="Your rating">' + stars + '</div>' +
      '<label class="nf-rv__f"><span>Review title</span><input name="title" maxlength="100" placeholder="Sum it up in a few words"></label>' +
      '<label class="nf-rv__f"><span>Your review</span><textarea name="body" rows="5" maxlength="5000" placeholder="How does it look and feel in your home?"></textarea></label>' +
      '<div class="nf-rv__row"><label class="nf-rv__f"><span>Your name</span><input name="name" maxlength="60" autocomplete="name" placeholder="First and last name"></label>' +
      '<label class="nf-rv__f"><span>Email</span><input name="email" type="email" autocomplete="email"><small>Never shown on the site</small></label></div>' +
      '<fieldset class="nf-rv__show"><legend>Show my name as</legend><div class="nf-rv__opts">' +
      '<label><input type="radio" name="show" value="full" checked><span>Full name</span></label>' +
      '<label><input type="radio" name="show" value="initial"><span>First name and last initial</span></label>' +
      '<label><input type="radio" name="show" value="anon"><span>Anonymous</span></label>' +
      '</div><p class="nf-rv__preview" aria-live="polite"></p></fieldset>' +
      '<p class="nf-rv__msg" role="status" aria-live="polite"></p>' +
      '<button type="submit" class="nf-rv__go">Submit review</button></form>';
    document.body.appendChild(dlg);
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.closest('.nf-rv__x')) { close(); return; }
      var s = e.target.closest('.nf-rv__star'); if (s) { setStars(+s.getAttribute('data-v')); msg(''); }
    });
    function shownName() {
      var f = q('form'); var raw = (f.name.value || '').trim().replace(/\s+/g, ' ');
      var sel = f.querySelector('input[name=show]:checked'); var mode = sel ? sel.value : 'full';
      if (mode === 'anon') return 'Anonymous';
      if (!raw) return '';
      if (mode === 'initial') { var parts = raw.split(' '); return parts.length > 1 ? parts[0] + ' ' + parts[parts.length - 1].charAt(0).toUpperCase() + '.' : parts[0]; }
      return raw;
    }
    function preview() { var v = shownName(); q('.nf-rv__preview').textContent = v ? 'Shown on your review as: ' + v : ''; }
    q('form').addEventListener('input', preview);
    q('form').addEventListener('change', preview);
    q('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var f = e.target;
      var fields = { name: shownName(), email: f.email.value.trim(), rating: rating, title: f.title.value.trim(), body: f.body.value.trim() };
      if (!rating) return msg('Pick a star rating.');
      if (!fields.body) return msg('Write a few words about it.');
      if (!fields.name) return msg('Add your name, or choose Anonymous.');
      if (!fields.email || !f.email.checkValidity()) return msg('Add a valid email so the review can be confirmed.');
      send(fields);
    });
  }
  function send(fields) {
    build();
    var go = q('.nf-rv__go'); go.disabled = true; msg('');
    var p = new URLSearchParams({ shop_domain: SHOP, platform: 'shopify', id: pid() || '' });
    Object.keys(fields).forEach(function (k) { if (fields[k] !== '' && fields[k] != null) p.append(k, fields[k]); });
    return fetch(API, { method: 'POST', body: p }).then(function (r) {
      return r.text().then(function (t) {
        var j = {}; try { j = JSON.parse(t); } catch (x) {}
        if (r.ok) {
          q('form').innerHTML = '<div class="nf-rv__done"><p class="nf-rv__eyebrow">Review sent</p><p class="nf-rv__prod">Thank you for sharing it.</p><p>It will appear on the page once it is approved.</p><button type="button" class="nf-rv__go nf-rv__x" style="position:static;width:auto;height:44px;padding:0 26px;font-size:12px;color:#fff">Close</button></div>';
        } else { go.disabled = false; msg((j && j.message) ? j.message : 'Something went wrong. Please try again.'); }
        return { status: r.status, body: t.slice(0, 200) };
      });
    }).catch(function () { go.disabled = false; msg('Could not send right now. Please try again.'); return { status: 0 }; });
  }
  function open() {
    build(); setStars(0); msg('');
    var h = document.querySelector('h1'); q('.nf-rv__prod').textContent = h ? h.textContent.trim() : '';
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.nf-rt__btn--solid, .jm-action-buttons__button, .jdgm-write-rev-link');
    if (!t || !/write/i.test(t.textContent || '') || !pid()) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    open();
  }, true);
  var noteCss = document.createElement('style');
  noteCss.textContent = '.nf-rv-note{margin:12px 0 0;font-size:12px;line-height:1.4;color:#8c8c8c;text-align:left}@media (max-width:749px){.nf-rv-note{text-align:center}}';
  document.head.appendChild(noteCss);
  function note() {
    var a = document.querySelector('.nf-rt__acts');
    if (!a || !a.parentNode || a.parentNode.querySelector('.nf-rv-note')) return;
    var p = document.createElement('p'); p.className = 'nf-rv-note'; p.textContent = 'Reviewers choose how their name appears.';
    a.parentNode.insertBefore(p, a.nextSibling);
  }
  note();
  var noteMo = new MutationObserver(note); noteMo.observe(document.body, { childList: true, subtree: true });
  setTimeout(function () { noteMo.disconnect(); }, 20000);
  window.__nfRv = { open: open, send: send, pid: pid };
})();

/* NF-CACHEBUST 1789835395662 */

/* ===== NF-PDPKIT-V2 (2026-09-20) =====
   1. free shipping + "save 10% on 2+ items" chips with a question mark note
   2. Pack Size buttons on every product: Single, 2, 4, 6, 8. They only set the add to cart quantity,
      no variants. Skipped when the product already has a real pack option (that gets the badge instead).
   3. Request a bulk quote button at the end of Complete the look, small form posting to /contact
   4. Recently viewed: bigger cards, centred, scrolls with arrows */
(function () {
  var d = document;
  var list = d.querySelector('.product-info__block-list');
  if (!list) return;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || d).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); };

  function chips() {
    if ($('.nf-pk-chips')) return;
    var anchor = $('[data-block-type="price"]', list) || $('[data-block-type="variant-picker"]', list);
    if (!anchor) return;
    var wrap = d.createElement('div');
    wrap.className = 'nf-pk-chips';
    wrap.innerHTML =
      '<div class="nf-pk-ship"><span>+Free Shipping</span></div>' +
      '<div class="nf-pk-save"><b>Save 10% on 2+ Items</b>' +
        '<i>Applied automatically <button type="button" class="nf-pk-q" aria-expanded="false" aria-label="How the 2+ item saving works">?</button></i>' +
        '<div class="nf-pk-pop" hidden role="dialog" aria-label="Multi buy saving">' +
          '<b>How it works</b><ul>' +
          '<li>Add any 2 or more items to your bag.</li>' +
          '<li>10% comes off automatically at checkout.</li>' +
          '<li>No code needed.</li>' +
          '</ul>' +
        '</div></div>';
    anchor.insertAdjacentElement('afterend', wrap);
    var q = $('.nf-pk-q', wrap), pop = $('.nf-pk-pop', wrap);
    function close() { pop.hidden = true; q.setAttribute('aria-expanded', 'false'); }
    q.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      pop.hidden = !pop.hidden;
      q.setAttribute('aria-expanded', pop.hidden ? 'false' : 'true');
    });
    d.addEventListener('click', function (e) { if (!pop.hidden && !wrap.contains(e.target)) close(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  var PACK = /(^|\b)(pack|packs|set|sets|pcs|pieces|bundle|quantity|count|lights per|bulbs)\b/i;
  var MULTI = /\b([2-9]|\d{2,})\s*(-|\s)?\s*(pack|packs|pcs|pieces|piece|pc|set|sets|bulbs|lights|lamps|units|pairs|pack of)\b|\bpack of\s*(?:[2-9]|\d{2,})|\bset of\s*(?:[2-9]|\d{2,})|\b[2-9]\s*pack\b/i;
  var MULTIV = /\bset of\s*(?:[2-9]|\d{2,})\b|\bpack of\s*(?:[2-9]|\d{2,})\b|\b(?:[2-9]|\d{2,})\s*[-\s]?(?:pcs|pieces|pack)\b/i;
  /* NF-REALPACK-V2 (2026-09-21): every copy of a real pack/set option (main picker AND the hidden sticky
     dropdown) gets the badge, and its 2+ values get the green SAVE tag like the Pack Size buttons. */
  function realPackOptions() {
    var out = [];
    $$('.variant-picker__option').forEach(function (opt) {
      var leg = $('legend, label, .variant-picker__option-name', opt);
      if (!leg) return;
      var values = $$('label, .variant-picker__option-value, option', opt)
        .map(function (n) { return (n.textContent || '').trim(); }).join(' | ');
      var nm = (leg.textContent || '').trim();
      if (PACK.test(nm) ? MULTI.test(values) : MULTIV.test(values)) out.push({ opt: opt, leg: leg });
    });
    return out;
  }
  function packBadge(real) {
    if (!real) return;
    if (!real.opt.classList.contains('nf-pk-realpack')) real.opt.classList.add('nf-pk-realpack');
    $$('label.block-swatch, label', real.opt).forEach(function (l) {
      var t = (l.textContent || '').trim();
      var multi = MULTI.test(t) && !/^(1\b|single)/i.test(t);
      if (multi && !l.hasAttribute('data-nf-multi')) l.setAttribute('data-nf-multi', '');
    });
    if ($('.nf-pk-pack', real.opt)) return;
    var b = d.createElement('span');
    b.className = 'nf-pk-pack';
    b.textContent = 'Multi pack discount applied';
    (real.leg.parentElement || real.leg).appendChild(b);
  }
  /* NF-PDPKIT-V2.4: a pack of 2+ shows the pack total with the automatic 10% taken off.
     Every write is guarded so nothing touches the DOM unless the value really changed (V2.3 looped). */
  var packSync = null;
  function money(c) { return '$' + (c / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function updPrice(n) {
    var pb = $('[data-block-type="price"]', list); if (!pb) return;
    var pl = $('price-list', pb), sp = pl && $('sale-price', pl), box = $('.nf-pk-total', pb);
    if (n <= 1 || !sp) {
      if (box) box.remove();
      if (pl && pl.classList.contains('nf-pk-hide')) pl.classList.remove('nf-pk-hide');
      return;
    }
    var unit = Math.round(parseFloat((sp.textContent || '').replace(/[^0-9.]/g, '')) * 100);
    if (!unit) return;
    var full = unit * n, now = Math.round(full * 0.9), key = n + ':' + unit;
    if (!box) { box = d.createElement('div'); box.className = 'nf-pk-total'; pl.insertAdjacentElement('afterend', box); }
    if (box.getAttribute('data-k') !== key) {
      box.setAttribute('data-k', key);
      box.innerHTML = '<span class="nf-pk-total__now">' + money(now) + '</span><s class="nf-pk-total__was">' + money(full) + '</s>' +
        '<span class="nf-pk-total__per">' + n + ' pieces, 10% off applied</span>';
    }
    if (!pl.classList.contains('nf-pk-hide')) pl.classList.add('nf-pk-hide');
  }
  var PACKS = [1, 2, 4, 6, 8];
  function qtyInputs() { return $$('input[name="quantity"]'); }
  function setQty(n) {
    qtyInputs().forEach(function (inp) {
      inp.value = n;
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
  function readQty() {
    var inp = $('input[name="quantity"][form^="product-form-main"]') || qtyInputs()[0];
    return inp ? parseInt(inp.value, 10) || 1 : 1;
  }
  function packs() {
    if ($('.nf-pk-packs')) return;
    if (!qtyInputs().length) return;
    var reals = realPackOptions();
    if (reals.length) { reals.forEach(packBadge); return; }
    var anchor = $('[data-block-type="variant-picker"]', list) || $('.nf-pk-chips') || $('[data-block-type="price"]', list);
    if (!anchor) return;
    var box = d.createElement('div');
    box.className = 'nf-pk-packs';
    box.innerHTML =
      '<p class="nf-pk-packs__h">Pack Size <span class="nf-pk-pack">Multi pack discount applied</span></p>' +
      '<div class="nf-pk-packs__row" role="group" aria-label="Pack size">' +
      PACKS.map(function (n) {
        return '<button type="button" class="nf-pk-pb" data-n="' + n + '" aria-pressed="' + (n === 1 ? 'true' : 'false') + '">' +
          (n === 1 ? 'Single' : n + '-Pack') + '</button>';
      }).join('') + '</div>' +
      '<p class="nf-pk-packs__note" hidden></p>';
    anchor.insertAdjacentElement('afterend', box);
    var note = $('.nf-pk-packs__note', box);
    function sync() {
      var n = readQty();
      updPrice(n);
      $$('.nf-pk-pb', box).forEach(function (b) {
        var want = +b.getAttribute('data-n') === n ? 'true' : 'false';
        if (b.getAttribute('aria-pressed') !== want) b.setAttribute('aria-pressed', want);
      });
      var txt = n > 1 ? n + ' will go in your bag. 10% comes off the order at checkout.' : '';
      if (note.textContent !== txt) note.textContent = txt;
      if (note.hidden !== !txt) note.hidden = !txt;
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('.nf-pk-pb');
      if (!b) return;
      setQty(+b.getAttribute('data-n'));
      sync();
    });
    d.addEventListener('change', function (e) { if (e.target && e.target.name === 'quantity') sync(); }, true);
    d.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('quantity-selector')) setTimeout(sync, 30);
    }, true);
    packSync = sync;
    sync();
  }

  function quote() {
    var host = $('[data-nf-ctl]') || $('[data-block-type="buy-buttons"]', list);
    if (!host || $('.nf-pk-quote')) return;
    var btn = d.createElement('button');
    btn.type = 'button';
    btn.className = 'nf-pk-quote';
    btn.textContent = 'Request a Bulk Quote';
    host.appendChild(btn);
    var ov = null;
    function build() {
      ov = d.createElement('div');
      ov.className = 'nf-pk-ov';
      ov.hidden = true;
      var title = (($('h1') || {}).textContent || '').trim();
      ov.innerHTML =
        '<div class="nf-pk-card" role="dialog" aria-modal="true" aria-labelledby="nf-pk-h">' +
        '<button type="button" class="nf-pk-x" aria-label="Close">&times;</button>' +
        '<h3 id="nf-pk-h">Request a quote</h3>' +
        '<p class="nf-pk-sub">Tell us how many you need and we will come back with pricing, lead time and a single invoice. We answer every request within one business day.</p>' +
        '<form class="nf-pk-f" novalidate>' +
          '<label for="nf-pk-name">Name<input id="nf-pk-name" name="name" type="text" autocomplete="name" required></label>' +
          '<label for="nf-pk-email">Email<input id="nf-pk-email" name="email" type="email" autocomplete="email" required></label>' +
          '<label for="nf-pk-phone">Phone (optional)<input id="nf-pk-phone" name="phone" type="tel" autocomplete="tel"></label>' +
          '<label for="nf-pk-msg">Message<textarea id="nf-pk-msg" name="body" required></textarea></label>' +
          '<button type="submit" class="nf-pk-send">Send message</button>' +
          '<p class="nf-pk-err" hidden></p>' +
        '</form></div>';
      d.body.appendChild(ov);
      var card = $('.nf-pk-card', ov), form = $('form', ov), err = $('.nf-pk-err', ov), send = $('.nf-pk-send', ov);
      $('.nf-pk-x', ov).addEventListener('click', close);
      ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
      d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov && !ov.hidden) close(); });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = function (id) { var el = $('#' + id, ov); return el ? el.value.trim() : ''; };
        var name = v('nf-pk-name'), email = v('nf-pk-email'), phone = v('nf-pk-phone'), body = v('nf-pk-msg');
        err.hidden = true;
        if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !body) {
          err.textContent = 'Please add your name, a valid email and a message.';
          err.hidden = false; return;
        }
        send.disabled = true; send.textContent = 'Sending';
        var fd = new FormData();
        fd.append('form_type', 'contact');
        fd.append('utf8', '✓');
        fd.append('contact[name]', name);
        fd.append('contact[email]', email);
        if (phone) fd.append('contact[phone]', phone);
        fd.append('contact[body]', 'BULK QUOTE REQUEST\nProduct: ' + (title || '(not given)') +
          '\nPage: ' + location.origin + location.pathname + (phone ? '\nPhone: ' + phone : '') + '\n\n' + body);
        fetch('/contact', { method: 'POST', body: fd, credentials: 'same-origin' })
          .then(function (r) {
            if (!r.ok || !/contact_posted=true/.test(r.url || '')) throw new Error('bad');
            card.innerHTML = '<button type="button" class="nf-pk-x" aria-label="Close">&times;</button>' +
              '<div class="nf-pk-ok"><h3>Request sent</h3>' +
              '<p>Thank you. We have your details and will reply with pricing and lead time within one business day.</p></div>';
            $('.nf-pk-x', card).addEventListener('click', close);
          })
          .catch(function () {
            send.disabled = false; send.textContent = 'Send message';
            err.textContent = 'That did not send. Please email info@norafurnish.com and we will pick it up.';
            err.hidden = false;
          });
      });
    }
    function open() {
      if (!ov) build();
      ov.hidden = false;
      requestAnimationFrame(function () { ov.classList.add('is-on'); });
      d.documentElement.style.overflow = 'hidden';
      var f = $('#nf-pk-name', ov); if (f) f.focus();
    }
    function close() {
      if (!ov) return;
      ov.classList.remove('is-on');
      d.documentElement.style.overflow = '';
      setTimeout(function () { ov.hidden = true; }, 200);
    }
    btn.addEventListener('click', open);
  }

  var RV = 'nf_rv_v1';
  function read() { try { return JSON.parse(localStorage.getItem(RV) || '[]') || []; } catch (e) { return []; } }
  function write(a) { try { localStorage.setItem(RV, JSON.stringify(a.slice(0, 16))); } catch (e) {} }
  function record() {
    var handle = location.pathname.split('/products/')[1];
    if (!handle) return null;
    handle = handle.split('/')[0];
    var title = (($('h1') || {}).textContent || '').trim();
    var img = $('product-gallery img, .product-gallery img, .product-info img');
    var src = img ? (img.currentSrc || img.src || '') : '';
    src = src.replace(/([?&])width=\d+&?/, '$1').replace(/[?&]$/, '');
    var pb = $('[data-block-type="price"]', list);
    var price = pb ? (pb.textContent || '').replace(/\s+/g, ' ').trim() : '';
    var m = price.match(/(From\s*)?\$[\d,]+\.\d{2}/);
    if (!title) return null;
    var a = read().filter(function (x) { return x.h !== handle; });
    a.unshift({ h: handle, t: title, i: src, p: m ? m[0] : '' });
    write(a);
    return handle;
  }
  function rail(current) {
    var items = read().filter(function (x) { return x.h !== current && x.t && x.i; }).slice(0, 12);
    if (!items.length || $('.nf-pk-rv')) return;
    var sec = d.createElement('section');
    sec.className = 'nf-pk-rv';
    sec.innerHTML = '<div class="nf-pk-rv__in"><div class="nf-pk-rv__head"><h2 class="nf-pk-rv__h">Recently viewed</h2>' +
      '<div class="nf-pk-rv__nav"><button type="button" class="nf-pk-rv__arr" data-dir="-1" aria-label="Scroll back">' +
      '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>' +
      '<button type="button" class="nf-pk-rv__arr" data-dir="1" aria-label="Scroll forward">' +
      '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button></div></div>' +
      '<div class="nf-pk-rv__row">' +
      items.map(function (x) {
        var im = x.i + (x.i.indexOf('?') > -1 ? '&' : '?') + 'width=600';
        return '<a class="nf-pk-rv__c" href="/products/' + esc(x.h) + '">' +
          '<span class="nf-pk-rv__im"><img src="' + esc(im) + '" alt="' + esc(x.t) + '" loading="lazy" width="600" height="600"></span>' +
          '<span class="nf-pk-rv__t">' + esc(x.t) + '</span>' +
          (x.p ? '<span class="nf-pk-rv__p">' + esc(x.p) + '</span>' : '') + '</a>';
      }).join('') + '</div></div>';
    var foot = d.querySelector('.shopify-section-group-footer-group, footer');
    if (foot && foot.parentNode) foot.parentNode.insertBefore(sec, foot);
    else d.body.appendChild(sec);
    var row = $('.nf-pk-rv__row', sec), nav = $('.nf-pk-rv__nav', sec);
    function upd() {
      var over = row.scrollWidth > row.clientWidth + 4;
      sec.classList.toggle('is-over', over);
      nav.hidden = !over;
      $$('.nf-pk-rv__arr', sec).forEach(function (b) {
        var dir = +b.getAttribute('data-dir');
        b.disabled = dir < 0 ? row.scrollLeft < 4 : row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
      });
    }
    nav.addEventListener('click', function (e) {
      var b = e.target.closest('.nf-pk-rv__arr');
      if (!b) return;
      var card = $('.nf-pk-rv__c', row);
      var step = card ? card.getBoundingClientRect().width + 22 : row.clientWidth * 0.8;
      row.scrollBy({ left: +b.getAttribute('data-dir') * step * 2, behavior: 'smooth' });
    });
    row.addEventListener('scroll', function () { requestAnimationFrame(upd); }, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }

  function run() { chips(); packs(); quote(); if (window.__nfCtlRun) window.__nfCtlRun(); }
  run();
  var handle = record();
  if ('requestIdleCallback' in window) requestIdleCallback(function () { rail(handle); });
  else setTimeout(function () { rail(handle); }, 400);
  d.addEventListener('variant:change', function () {
    setTimeout(function () { run(); if (packSync) packSync(); }, 60);
    setTimeout(function () { if (packSync) packSync(); }, 450);
    setTimeout(function () { if (packSync) packSync(); }, 1200);
  });
  new MutationObserver(function () {
    if (!$('.nf-pk-chips') || !$('.nf-pk-quote') || (!$('.nf-pk-packs') && !$('.nf-pk-pack')) || ($('[data-nf-ctl]') && !$('[data-nf-ctl]')._nf)) run();
  }).observe(list, { childList: true, subtree: true });
})();

/* NF-QJUMP-V1 (2026-09-21): "N questions" under the title, and card links ending #nf-questions, open the
   Questions tab of the reviews block and scroll to it. The panel is a hidden tab, so a plain anchor went nowhere. */
(function () {
  var d = document;
  function go(smooth) {
    var qp = d.getElementById('nf-questions');
    if (!qp) return false;
    var tab = [].slice.call(d.querySelectorAll('.nf-rt__tab')).filter(function (b) { return /question/i.test(b.textContent || ''); })[0];
    if (tab && qp.hidden) tab.click();
    var anchor = d.querySelector('.nf-rt__tabs') || qp;
    var y = anchor.getBoundingClientRect().top + window.pageYOffset - 150;
    window.scrollTo({ top: Math.max(0, y), behavior: smooth ? 'smooth' : 'auto' });
    return true;
  }
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href$="#nf-questions"]');
    if (!a) return;
    var u; try { u = new URL(a.href, location.href); } catch (err) { return; }
    if (u.pathname !== location.pathname) return;
    if (go(true)) { e.preventDefault(); try { history.replaceState(null, '', '#nf-questions'); } catch (err) {} }
  }, true);
  if (location.hash === '#nf-questions') {
    var n = 0;
    (function tryGo() {
      if (go(false)) { setTimeout(function () { go(false); }, 700); return; }
      if (++n < 40) setTimeout(tryGo, 150);
    })();
  }
})();


/* NF-QAJUMP-V1 (2026-09-20): "N questions" under the title (and #nf-questions links from cards) open the
   Questions tab and scroll to it; before, the link pointed at a hidden tab panel and did nothing. */
(function () {
  var d = document;
  function go(smooth) {
    var panel = d.getElementById('nf-questions'); if (!panel) return false;
    var tab = [].slice.call(d.querySelectorAll('.nf-rt__tab')).find(function (b) { return /question/i.test(b.textContent); });
    if (tab && !tab.classList.contains('is-on')) tab.click();
    var target = (tab && tab.parentElement) || panel;
    var head = d.querySelector('.header, header, [class*="header"]');
    var off = Math.min(140, (head && head.getBoundingClientRect().height) || 90) + 16;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - off, behavior: smooth ? 'smooth' : 'auto' });
    return true;
  }
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#nf-questions"]');
    if (!a || a.closest('#nf-questions')) return;
    if (go(true)) { e.preventDefault(); if (history.replaceState) history.replaceState(null, '', '#nf-questions'); }
  }, true);
  if (location.hash === '#nf-questions') {
    var tries = 0; (function wait() { if (go(false) || ++tries > 20) return; setTimeout(wait, 250); })();
  }
})();


/* ===== NF-TRUST-V1 (2026-09-23) =====
   The premium and secure band. Every line here is backed by a published policy or by the
   Fulfiz sourcing instruction, nothing is aspirational:
   - damage cover  -> refund policy, "no return cost to you" when damaged, defective or incorrect
   - fragile pack  -> shipping policy, crystal, glass and stone "packed individually"
   - 30 day return -> refund policy
   Sits directly under the price chips so it is read before the Add to Cart, not after. */
(function () {
  if (window.__nfTrustV1) return;
  window.__nfTrustV1 = 1;
  var d = document;
  var list = d.querySelector('.product-info__block-list');
  if (!list) return;

  var css = d.createElement('style');
  css.textContent =
    '.nf-tr{border:1px solid #e0ddd6;border-radius:10px;padding:14px 16px;margin:14px 0 4px;background:#fff}' +
    '.nf-tr__r{display:flex;gap:11px;align-items:flex-start;padding:9px 0;border-bottom:1px solid #f0eeea}' +
    '.nf-tr__r:last-child{border-bottom:0}.nf-tr__r:first-child{padding-top:0}' +
    '.nf-tr__i{flex:0 0 auto;width:18px;height:18px;margin-top:1px;color:#c9a36a}' +
    '.nf-tr__t{font-weight:600;font-size:13.5px;color:#1c1c1c;line-height:1.35;margin:0}' +
    '.nf-tr__s{font-size:12.5px;color:#5f5a52;line-height:1.45;margin:2px 0 0}' +
    '@media (max-width:749px){.nf-tr{padding:12px 13px}.nf-tr__s{font-size:12px}}';
  d.head.appendChild(css);

  var SH = '<svg class="nf-tr__i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3l7 3v5c0 4.2-2.9 7.6-7 9c-4.1-1.4-7-4.8-7-9V6l7-3z"/></svg>';
  var BX = '<svg class="nf-tr__i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 8l9-4 9 4v8l-9 4-9-4V8z"/><path d="M3 8l9 4 9-4M12 12v8"/></svg>';
  var RT = '<svg class="nf-tr__i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 12a9 9 0 109-9"/><path d="M3 4v5h5"/></svg>';

  function row(icon, t, s) {
    return '<div class="nf-tr__r">' + icon + '<div><p class="nf-tr__t">' + t + '</p><p class="nf-tr__s">' + s + '</p></div></div>';
  }
  function pageText() {
    var m = d.querySelector('main');
    return ((m ? m.innerText : d.body.innerText) || '').toLowerCase();
  }
  function build() {
    if (d.querySelector('.nf-tr')) return;
    var anchor = d.querySelector('.nf-pk-chips') || d.querySelector('[data-block-type="price"]', list);
    if (!anchor) return;
    var t = pageText();
    var fragile = /\b(crystal|glass|capiz|porcelain|ceramic|marble|alabaster|stone)\b/.test(t);
    var html = '';
    html += fragile
      ? row(BX, 'Packed for a safe trip', 'Crystal and glass are packed individually, with extra protection around the box.')
      : row(BX, 'Packed for a safe trip', 'Fragile parts are packed individually, with extra protection around the box.');
    html += row(SH, 'Damage is covered', 'If it arrives damaged, defective or incorrect, returning it costs you nothing.');
    html += row(RT, '30 day returns', 'From the day it is delivered. US support replies in 1 to 2 business days.');
    var box = d.createElement('div');
    box.className = 'nf-tr';
    box.innerHTML = html;
    anchor.insertAdjacentElement('afterend', box);
  }
  build();
  var mo = new MutationObserver(build);
  mo.observe(list, { childList: true, subtree: true });
  setTimeout(function () { mo.disconnect(); }, 15000);
})();


/* NF-CARE-V1 (2026-09-23): three alternating image and text rows near the foot of every
   product page. Row 1 image left, row 2 image right on a charcoal panel, row 3 image left.
   Today the copy is reassurance about how we look after an order. Later each product gets
   its own three OpenArt images and its own three reasons it is special, which is why the
   rows are DATA, not markup: set the product metafield custom.pdp_care to an array of
   {img, eyebrow, title, body} and it overrides the defaults below with no code change.
   theme.liquid publishes that metafield as window.NF_CARE on product templates. */
(function () {
  if (!/\/products\//.test(location.pathname)) return;
  if (document.getElementById('nf-care')) return;

  var CDN = 'https://cdn.shopify.com/s/files/1/0750/8380/8820/files/';
  var DEFAULTS = [
    {
      img: CDN + 'nf-newsletter-bedroom.jpg',
      eyebrow: 'Talk to a person',
      title: 'Email us before you buy, not only after',
      body: 'Send your room measurements, your ceiling height or a photo of the wall to info@norafurnish.com and a real person answers, usually within 1 to 2 business days. We would rather help you choose the right piece than process a return.'
    },
    {
      img: CDN + 'black-outdoor-sconce-light-grid-gray-stone-wall-wooden-door.jpg',
      eyebrow: 'Covered in transit',
      title: 'If it arrives damaged, that is ours to fix',
      body: 'Fragile pieces are packed individually with extra protection around the box, and every order ships free across the USA with tracking. If something turns up damaged, defective or incorrect, putting it right costs you nothing.'
    },
    {
      img: CDN + 'modern-linear-wall-sconce-wood-accent-wall.webp',
      eyebrow: 'No surprises',
      title: "Every listing tells you what you're getting",
      body: 'Exact measurements, materials, finish, bulb details and care notes sit on every product page, with a scale drawing on most of them. Check it before you order, and ask us if anything is unclear. You still have 30 days from delivery to change your mind.'
    }
  ];

  function rows() {
    var d = window.NF_CARE;
    if (!d) return DEFAULTS;
    try { if (typeof d === 'string') d = JSON.parse(d); } catch (e) { return DEFAULTS; }
    if (!Array.isArray(d)) return DEFAULTS;
    d = d.filter(function (r) { return r && r.img && r.title; }).slice(0, 3);
    return d.length === 3 ? d : DEFAULTS;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function src(u, w) {
    if (u.indexOf('cdn.shopify.com') === -1) return u;
    return u.split('?')[0] + '?width=' + w;
  }

  function build() {
    var data = rows();
    var html = '<div class="nf-care__in">';
    data.forEach(function (r, i) {
      var flip = i === 1 ? ' nf-care__row--flip' : '';
      html +=
        '<div class="nf-care__row' + flip + '">' +
          '<div class="nf-care__media">' +
            /* src and srcset go on AFTER insertion, see hydrate(). An img parsed inside a
               detached node never fires native lazy loading, which is the same trap
               NF-CTLIMG-V1 hit, and the pictures silently stay blank. */
            '<img data-src="' + esc(src(r.img, 900)) + '" ' +
              'data-srcset="' + esc(src(r.img, 640)) + ' 640w, ' + esc(src(r.img, 900)) + ' 900w, ' + esc(src(r.img, 1300)) + ' 1300w" ' +
              'sizes="(max-width: 899px) 100vw, 46vw" ' +
              'alt="' + esc(r.title) + '" loading="lazy" decoding="async" width="900" height="900">' +
          '</div>' +
          '<div class="nf-care__text">' +
            (r.eyebrow ? '<p class="nf-care__eyebrow">' + esc(r.eyebrow) + '</p>' : '') +
            '<h3 class="nf-care__title">' + esc(r.title) + '</h3>' +
            '<p class="nf-care__body">' + esc(r.body) + '</p>' +
          '</div>' +
        '</div>';
    });
    html += '</div>';

    var sec = document.createElement('section');
    sec.id = 'nf-care';
    sec.className = 'nf-care';
    sec.setAttribute('aria-label', 'How we look after your order');
    sec.innerHTML = html;
    return sec;
  }

  function hydrate(sec) {
    [].forEach.call(sec.querySelectorAll('img[data-src]'), function (img) {
      var s = img.getAttribute('data-srcset');
      if (s) img.setAttribute('srcset', s);
      img.setAttribute('src', img.getAttribute('data-src'));
      img.removeAttribute('data-src');
      img.removeAttribute('data-srcset');
    });
  }

  function place() {
    var sec = document.getElementById('nf-care');
    if (!sec) { sec = build(); }
    /* Sit above the related products carousel; fall back to the trust icon bar,
       then to the end of the main product section. */
    var anchor =
      document.querySelector('.shopify-section--related-products') ||
      document.querySelector('.shopify-section--image-with-text-overlay') ||
      document.querySelector('.shopify-section--text-with-icons');
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(sec, anchor);
      hydrate(sec);
      return true;
    }
    var main = document.querySelector('.shopify-section--main-product');
    if (main && main.parentNode) {
      main.parentNode.insertBefore(sec, main.nextSibling);
      hydrate(sec);
      return true;
    }
    return false;
  }

  function start() {
    if (place()) return;
    var tries = 0;
    var t = setInterval(function () {
      if (place() || ++tries > 40) clearInterval(t);
    }, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
