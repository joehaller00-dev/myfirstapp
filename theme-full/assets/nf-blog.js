/* nf-blog.js : Nora Furnish blog. Topic pills and pagination that swap in place on the blog listing, carousels
   ("More From Our Blogs", homepage journal), smooth Key Takeaways links, and "shop the photo" hotspots on
   article figures (figure.nf-fig[data-product="<product handle>"]). */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ROOT = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';

  /* ---------- Carousels ---------- */
  function initCarousel(root) {
    if (root.__nfBlogInit) return;
    root.__nfBlogInit = true;
    var track = root.querySelector('[data-nf-track]');
    var prev = root.querySelector('[data-nf-prev]');
    var next = root.querySelector('[data-nf-next]');
    if (!track) return;
    /* data-nf-smooth: arrow clicks glide even with reduced motion (short, user started movement) */
    var smooth = true; /* every arrow glides, reduced motion included (2026-09-10 owner request) */

    function stepSize() {
      var item = track.firstElementChild;
      if (!item) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      var w = item.getBoundingClientRect().width + gap;
      var per = Math.max(1, Math.floor((track.clientWidth + gap) / w));
      return per * w;
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      root.classList.toggle('is-static', max <= 2);
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
    }
    function go(dir) {
      track.scrollBy({ left: dir * stepSize(), behavior: smooth ? 'smooth' : 'auto' });
    }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    track.addEventListener('scroll', update, { passive: true });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    window.addEventListener('resize', update);
    update();
  }

  function initToc() {
    document.querySelectorAll('.nf-article__body .nf-toc a[href^="#"]').forEach(function (a) {
      if (a.__nfBlogToc) return;
      a.__nfBlogToc = true;
      a.addEventListener('click', function (e) {
        var id = decodeURIComponent(a.getAttribute('href').slice(1));
        var target = id && document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        if (history.replaceState) history.replaceState(null, '', '#' + id);
      });
    });
  }

  /* ---------- Shop the photo ---------- */
  var cache = {};
  var card = null, cardBody = null, openBtn = null, openFig = null, openHandle = null;
  var SVG_PLUS = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 2.5v11M2.5 8h11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  var SVG_X = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m4 4 8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  function getProduct(handle) {
    if (!cache[handle]) {
      cache[handle] = fetch(ROOT + 'products/' + encodeURIComponent(handle) + '.js', { headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error('status ' + r.status); return r.json(); })
        .catch(function (e) { delete cache[handle]; throw e; });
    }
    return cache[handle];
  }

  function groups(n, sep) { return n.replace(/\B(?=(\d{3})+(?!\d))/g, sep); }
  function money(cents) {
    var s = window.themeVariables && window.themeVariables.settings;
    var fmt = (s && s.moneyFormat) || '${{amount}}';
    var v = (Number(cents) || 0) / 100;
    return fmt.replace(/\{\{\s*(\w+)\s*\}\}/, function (m, k) {
      var p = v.toFixed(2).split('.');
      if (k === 'amount_no_decimals') return groups(String(Math.round(v)), ',');
      if (k === 'amount_with_comma_separator') return groups(p[0], '.') + ',' + p[1];
      if (k === 'amount_no_decimals_with_comma_separator') return groups(String(Math.round(v)), '.');
      return groups(p[0], ',') + '.' + p[1];
    });
  }
  function sized(src, w) {
    if (!src) return '';
    src = String(src);
    if (src.indexOf('//') === 0) src = 'https:' + src;
    return src + (src.indexOf('?') > -1 ? '&' : '?') + 'width=' + w;
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function productUrl(p, handle) { return (p && p.url) || (ROOT + 'products/' + handle); }

  function ensureCard() {
    if (card) return card;
    card = el('div', 'nfb-card');
    card.id = 'nfb-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'false');
    card.setAttribute('aria-labelledby', 'nfb-card-title');
    card.tabIndex = -1;
    var x = el('button', 'nfb-card__x');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close');
    x.innerHTML = SVG_X;
    x.addEventListener('click', function () { close(true); });
    cardBody = el('div', 'nfb-card__body');
    card.appendChild(x);
    card.appendChild(cardBody);
    card.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.preventDefault(); close(true); } });
    card.addEventListener('focusout', function (e) {
      var t = e.relatedTarget;
      if (t && !card.contains(t) && t !== openBtn) close(false);
    });
    return card;
  }

  function renderLoading() {
    cardBody.textContent = '';
    card.classList.add('is-loading');
    var media = el('span', 'nfb-card__media');
    var info = el('div', 'nfb-card__info');
    var t = el('p', 'nfb-card__name', 'Loading product');
    t.id = 'nfb-card-title';
    info.appendChild(t);
    info.appendChild(el('span', 'nfb-card__sk'));
    cardBody.appendChild(media);
    cardBody.appendChild(info);
  }

  function renderError(handle) {
    card.classList.remove('is-loading');
    cardBody.textContent = '';
    var info = el('div', 'nfb-card__info nfb-card__info--full');
    var t = el('p', 'nfb-card__name', 'This product could not be loaded right now.');
    t.id = 'nfb-card-title';
    info.appendChild(t);
    cardBody.appendChild(info);
    var actions = el('div', 'nfb-card__actions nfb-card__actions--one');
    var view = el('a', 'nfb-card__btn nfb-card__btn--primary', 'View product');
    view.href = productUrl(null, handle);
    actions.appendChild(view);
    cardBody.appendChild(actions);
  }

  function render(p, handle) {
    card.classList.remove('is-loading');
    cardBody.textContent = '';
    var url = productUrl(p, handle);
    var variants = p.variants || [];
    var available = variants.filter(function (v) { return v.available; });
    var single = variants.length === 1;
    var cheapest = (available.length ? available : variants).slice().sort(function (a, b) { return a.price - b.price; })[0];
    var price = cheapest ? cheapest.price : p.price;
    var compare = cheapest ? cheapest.compare_at_price : p.compare_at_price;
    var onSale = compare && compare > price;

    var media = el('a', 'nfb-card__media');
    media.href = url;
    media.tabIndex = -1;
    media.setAttribute('aria-hidden', 'true');
    var src = p.featured_image || (p.images && p.images[0]);
    if (src) {
      var img = document.createElement('img');
      img.src = sized(src, 200);
      img.srcset = sized(src, 200) + ' 1x, ' + sized(src, 400) + ' 2x';
      img.alt = '';
      img.width = 88;
      img.height = 88;
      img.decoding = 'async';
      media.appendChild(img);
    }

    var info = el('div', 'nfb-card__info');
    var name = el('p', 'nfb-card__name');
    name.id = 'nfb-card-title';
    var nameLink = el('a', null, p.title);
    nameLink.href = url;
    name.appendChild(nameLink);
    var pr = el('p', 'nfb-card__price');
    if (!single && p.price_varies) pr.appendChild(el('span', 'nfb-card__from', 'From'));
    var now = el('span', 'nfb-card__now' + (onSale ? ' is-sale' : ''));
    if (onSale) now.appendChild(el('span', 'nfb-sr', 'Sale price '));
    now.appendChild(document.createTextNode(money(price)));
    pr.appendChild(now);
    if (onSale) {
      var s = el('s', 'nfb-card__cmp');
      s.appendChild(el('span', 'nfb-sr', 'Regular price '));
      s.appendChild(document.createTextNode(money(compare)));
      pr.appendChild(s);
    }
    info.appendChild(name);
    info.appendChild(pr);

    var actions = el('div', 'nfb-card__actions');
    var primary;
    if (single && variants[0].available) {
      primary = el('button', 'nfb-card__btn nfb-card__btn--primary', 'Add to cart');
      primary.type = 'button';
      primary.addEventListener('click', function () { addToCart(variants[0].id, primary); });
    } else if (single) {
      primary = el('button', 'nfb-card__btn nfb-card__btn--primary', 'Sold out');
      primary.type = 'button';
      primary.disabled = true;
    } else {
      primary = el('a', 'nfb-card__btn nfb-card__btn--primary', 'Choose options');
      primary.href = url;
    }
    var view = el('a', 'nfb-card__btn nfb-card__btn--ghost', 'View product');
    view.href = url;
    actions.appendChild(primary);
    actions.appendChild(view);

    var msg = el('p', 'nfb-card__msg');
    msg.setAttribute('role', 'status');

    cardBody.appendChild(media);
    cardBody.appendChild(info);
    cardBody.appendChild(actions);
    cardBody.appendChild(msg);
  }

  function headerBottom() {
    var h = document.querySelector('.shopify-section--header, header');
    if (!h) return 0;
    var r = h.getBoundingClientRect();
    return r.bottom > 0 && r.top < 10 ? r.bottom : 0;
  }

  function place() {
    if (!card || !openFig || !openBtn) return;
    var fr = openFig.getBoundingClientRect();
    var br = openBtn.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var vh = window.innerHeight;
    var w = card.offsetWidth, h = card.offsetHeight;
    var left = Math.max(12, Math.min(br.right - w, vw - 12 - w));
    var aboveTop = br.top - h - 10;
    var belowTop = br.bottom + 10;
    var topLimit = Math.max(12, headerBottom() + 8);
    var above = aboveTop >= topLimit || belowTop + h > vh - 12;
    var top = above ? aboveTop : belowTop;
    card.style.left = Math.round(left - fr.left) + 'px';
    card.style.top = Math.round(top - fr.top) + 'px';
    card.style.setProperty('--nfb-origin', Math.round(br.left + br.width / 2 - left) + 'px ' + (above ? '100%' : '0'));
    card.classList.toggle('is-below', !above);
  }

  function open(fig, btn, handle) {
    ensureCard();
    if (openBtn && openBtn !== btn) close(false);
    openFig = fig; openBtn = btn; openHandle = handle;
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-controls', 'nfb-card');
    btn.insertAdjacentElement('afterend', card);
    card.classList.remove('is-open');
    var cached = cache[handle];
    renderLoading();
    place();
    void card.offsetWidth;
    card.classList.add('is-open');
    card.focus({ preventScroll: true });
    getProduct(handle).then(function (p) {
      if (openHandle !== handle) return;
      render(p, handle);
      place();
    }).catch(function () {
      if (openHandle !== handle) return;
      renderError(handle);
      place();
    });
    return cached;
  }

  function close(returnFocus) {
    if (!openBtn) return;
    var btn = openBtn;
    btn.setAttribute('aria-expanded', 'false');
    card.classList.remove('is-open');
    openBtn = null; openFig = null; openHandle = null;
    if (returnFocus) btn.focus({ preventScroll: true });
  }

  function addToCart(variantId, btn) {
    if (btn.getAttribute('aria-busy') === 'true') return;
    var label = btn.textContent;
    var msg = card.querySelector('.nfb-card__msg');
    if (msg) msg.textContent = '';
    btn.setAttribute('aria-busy', 'true');
    btn.disabled = true;
    btn.textContent = 'Adding';
    var html = document.documentElement;
    html.dispatchEvent(new CustomEvent('theme:loading:start', { bubbles: true }));
    var sections = [];
    html.dispatchEvent(new CustomEvent('cart:prepare-bundled-sections', { bubbles: true, detail: { sections: sections } }));
    var fd = new FormData();
    fd.set('id', variantId);
    fd.set('quantity', '1');
    if (sections.length) {
      fd.set('sections', sections.join(','));
      fd.set('sections_url', ROOT + 'variants/' + variantId);
    }
    function reset() {
      btn.removeAttribute('aria-busy');
      btn.disabled = false;
      btn.textContent = label;
    }
    fetch(ROOT + 'cart/add.js', { method: 'POST', body: fd, headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' } })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        html.dispatchEvent(new CustomEvent('theme:loading:end', { bubbles: true }));
        if (!res.ok) throw new Error(res.j.description || res.j.message || 'error');
        var s = window.themeVariables && window.themeVariables.settings;
        if (s && s.cartType === 'page') { window.location.href = ROOT + 'cart'; return; }
        return fetch(ROOT + 'cart.js', { headers: { Accept: 'application/json' } }).then(function (r) { return r.json(); }).then(function (cart) {
          cart.sections = res.j.sections;
          btn.textContent = 'Added';
          if (msg) msg.textContent = 'Added to your cart.';
          setTimeout(function () { reset(); close(false); }, 450);
          html.dispatchEvent(new CustomEvent('variant:add', { bubbles: true, detail: { items: res.j.hasOwnProperty('items') ? res.j.items : [res.j], cart: cart } }));
          html.dispatchEvent(new CustomEvent('cart:change', { bubbles: true, detail: { baseEvent: 'variant:add', cart: cart } }));
        });
      })
      .catch(function (e) {
        html.dispatchEvent(new CustomEvent('theme:loading:end', { bubbles: true }));
        reset();
        if (msg) msg.textContent = (e && e.message && e.message !== 'error' ? e.message : 'This could not be added to your cart. Please try again.');
        document.dispatchEvent(new CustomEvent('cart:refresh'));
      });
  }

  function initHotspots() {
    document.querySelectorAll('.nf-article__body figure.nf-fig[data-product]').forEach(function (fig) {
      if (fig.__nfbHs) return;
      var handle = (fig.getAttribute('data-product') || '').trim();
      var img = fig.querySelector('img');
      if (!handle || !img) return;
      fig.__nfbHs = true;
      fig.classList.add('nfb-has-hs');
      var b = el('button', 'nfb-hs');
      b.type = 'button';
      b.setAttribute('aria-haspopup', 'dialog');
      b.setAttribute('aria-expanded', 'false');
      b.setAttribute('aria-label', 'Shop the product in this photo');
      b.innerHTML = SVG_PLUS;
      b.addEventListener('click', function (e) {
        e.preventDefault();
        if (openBtn === b) close(false);
        else open(fig, b, handle);
      });
      b.addEventListener('pointerenter', function () { getProduct(handle).catch(function () {}); }, { once: true });
      img.insertAdjacentElement('afterend', b);
      /* lazy images have no size until they load: keep the button out of sight until the photo is there */
      if (!(img.complete && img.naturalWidth)) {
        b.style.visibility = 'hidden';
        img.addEventListener('load', function () { b.style.visibility = ''; }, { once: true });
      }
    });
  }

  /* ---------- Blog listing: topic pills and pagination swap in place (no page reload) ---------- */
  function initBlogFilters(root) {
    if (root.__nfBlogF) return;
    var sid = root.getAttribute('data-section-id');
    var blogPath = (root.getAttribute('data-blog-url') || '').replace(/\/$/, '');
    if (!sid || !blogPath || !window.fetch || !window.DOMParser || !window.URL || !(window.history && history.pushState)) return;
    root.__nfBlogF = true;
    var status = root.querySelector('[data-nf-status]');
    var views = {};
    var token = 0;
    var FADE = reduce ? 140 : 240;

    function results() { return root.querySelector('[data-nf-results]'); }
    function key(href) {
      var u = new URL(href, location.href);
      u.hash = '';
      u.searchParams.delete('section_id');
      if (u.searchParams.get('page') === '1') u.searchParams.delete('page');
      return u.pathname.replace(/\/$/, '') + u.search;
    }
    function isListing(u) {
      if (u.origin !== location.origin) return false;
      var p = u.pathname.replace(/\/$/, '');
      return p === blogPath || p.indexOf(blogPath + '/tagged/') === 0;
    }
    var shown = key(location.href);
    /* the theme's page transition curtain (layout/theme.liquid) covers the page on any same site link click unless
       the link has data-no-instant; mark the links this script handles so the swap is not hidden behind it */
    function markLinks() {
      root.querySelectorAll('[data-nf-pills] a[href], .nf-blog__pagination a[href], .nf-blog__empty a[href]').forEach(function (a) {
        a.setAttribute('data-no-instant', '');
      });
    }
    markLinks();

    function fetchView(href) {
      var k = key(href);
      if (!views[k]) {
        var u = new URL(k, location.origin);
        u.searchParams.set('section_id', sid);
        views[k] = fetch(u.toString(), { headers: { Accept: 'text/html' } })
          .then(function (r) { if (!r.ok) throw new Error('status ' + r.status); return r.text(); })
          .then(function (html) {
            var res = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-nf-results]');
            if (!res) throw new Error('no results');
            return res;
          })
          .catch(function (e) { delete views[k]; throw e; });
      }
      return views[k];
    }
    function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
    function headerBottomNow() {
      var h = document.querySelector('.shopify-section--header');
      if (!h) return 0;
      var r = h.getBoundingClientRect();
      return r.bottom > 0 ? r.bottom : 0;
    }
    function setPills(tag) {
      root.querySelectorAll('[data-nf-filter]').forEach(function (a) {
        var on = a.getAttribute('data-nf-filter') === tag;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
    }
    function announce(res) {
      if (!status) return;
      var n = parseInt(res.getAttribute('data-nf-count'), 10) || 0;
      var pill = root.querySelector('[data-nf-filter].is-active');
      var label = pill ? pill.textContent.trim() : '';
      status.textContent = (label ? label + ': ' : '') + (n === 1 ? '1 post shown' : n + ' posts shown');
    }

    function go(href, opts) {
      opts = opts || {};
      var my = ++token;
      var cur = results();
      if (!cur) { window.location.href = href; return; }
      if (opts.push) {
        try { history.replaceState(Object.assign({}, history.state || {}, { nfBlog: true, y: window.scrollY }), '', location.href); } catch (e) {}
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      }
      root.classList.add('is-busy');
      cur.setAttribute('aria-busy', 'true');
      cur.style.minHeight = cur.offsetHeight + 'px';
      cur.classList.add('is-loading');
      Promise.all([fetchView(href), wait(FADE)]).then(function (out) {
        if (my !== token) return;
        var res = out[0];
        cur.innerHTML = res.innerHTML;
        ['data-nf-tag', 'data-nf-count', 'data-nf-title'].forEach(function (a) {
          var v = res.getAttribute(a);
          if (v != null) cur.setAttribute(a, v);
        });
        setPills(res.getAttribute('data-nf-tag') || '');
        markLinks();
        if (opts.push) history.pushState({ nfBlog: true, y: 0 }, '', href);
        shown = key(href);
        var t = res.getAttribute('data-nf-title');
        if (t) document.title = t;
        cur.removeAttribute('aria-busy');
        root.classList.remove('is-busy');
        void cur.offsetWidth;
        cur.classList.remove('is-loading');
        announce(cur);

        var release = function () { cur.style.minHeight = ''; };
        if (typeof opts.y === 'number') {
          release();
          window.scrollTo(0, opts.y);
        } else if (opts.scrollTop) {
          var anchor = root.querySelector('[data-nf-pills]') || cur;
          var top = Math.max(0, anchor.getBoundingClientRect().top + window.scrollY - headerBottomNow() - 16);
          if (top < window.scrollY - 1) {
            window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
            setTimeout(release, reduce ? 0 : 700);
          } else {
            release();
          }
        } else {
          release();
        }
        if (opts.focus) cur.focus({ preventScroll: true });
        document.dispatchEvent(new CustomEvent('nf-blog:updated', { detail: { url: href } }));
      }).catch(function () {
        if (my !== token) return;
        window.location.href = href;
      });
    }

    root.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || !root.contains(a) || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      if (!a.closest('[data-nf-pills], .nf-blog__pagination, .nf-blog__empty')) return;
      var u = new URL(a.href, location.href);
      if (!isListing(u)) return;
      e.preventDefault();
      if (key(u.href) === shown) return;
      var inPager = !!a.closest('.nf-blog__pagination, .nf-blog__empty');
      go(u.href, { push: true, scrollTop: true, focus: inPager });
    });

    function prefetch(e) {
      var a = e.target.closest && e.target.closest('[data-nf-pills] a[href], .nf-blog__pagination a[href]');
      if (!a || a.__nfPre) return;
      var u = new URL(a.href, location.href);
      if (!isListing(u) || key(u.href) === shown) return;
      a.__nfPre = true;
      fetchView(u.href).catch(function () { a.__nfPre = false; });
    }
    root.addEventListener('pointerover', prefetch);
    root.addEventListener('focusin', prefetch);

    window.addEventListener('popstate', function (e) {
      var u = new URL(location.href);
      if (!isListing(u) || !document.body.contains(root)) return;
      var st = e.state || {};
      if (key(u.href) === shown) {
        if (typeof st.y === 'number') window.scrollTo(0, st.y);
        return;
      }
      go(u.href, { push: false, y: typeof st.y === 'number' ? st.y : undefined });
    });
  }

  document.addEventListener('pointerdown', function (e) {
    if (!openBtn || !card) return;
    if (card.contains(e.target) || openBtn.contains(e.target)) return;
    close(false);
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openBtn) close(true);
  });
  window.addEventListener('resize', function () { if (openBtn) place(); });

  function init() {
    document.querySelectorAll('[data-nf-carousel]').forEach(initCarousel);
    document.querySelectorAll('[data-nf-blog]').forEach(initBlogFilters);
    initToc();
    initHotspots();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('shopify:section:load', init);
})();
