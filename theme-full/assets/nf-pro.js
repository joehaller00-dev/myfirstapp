/* Nora Furnish Professionals (2026-09-11): tabs and rails, concept filters and dialogs, quote form prefill and checks.
   Loaded by sections/nf-pro-*.liquid (may be included more than once per page, so it guards itself). */
(function () {
  if (window.__nfProJS) return;
  window.__nfProJS = true;

  var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
  function glide(el, to) {
    var from = el.scrollLeft, d = to - from, t0 = null, dur = 360;
    if (Math.abs(d) < 2) return;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      el.scrollLeft = from + d * ease(p);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    setTimeout(function () { if (Math.abs(el.scrollLeft - to) > 4 && document.hidden) el.scrollLeft = to; }, dur + 80);
  }

  /* ---------- tabs + rails ---------- */
  function initRails(root) {
    root.querySelectorAll('[data-nfp-tabs]').forEach(function (tabs) {
      if (tabs.dataset.nfpOn) return; tabs.dataset.nfpOn = '1';
      var btns = tabs.querySelectorAll('[role="tab"]');
      btns.forEach(function (b, i) {
        b.addEventListener('click', function () { select(i); });
        b.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            var n = (i + (e.key === 'ArrowRight' ? 1 : btns.length - 1)) % btns.length;
            select(n); btns[n].focus();
          }
        });
      });
      function select(i) {
        btns.forEach(function (b, j) {
          var on = i === j;
          b.setAttribute('aria-selected', on ? 'true' : 'false');
          b.tabIndex = on ? 0 : -1;
          var p = document.getElementById(b.getAttribute('aria-controls'));
          if (p && on) warmPanel(p);
          if (p) p.hidden = !on;
        });
      }
    });
    root.querySelectorAll('[data-nfp-rail]').forEach(function (rail) {
      if (rail.dataset.nfpOn) return; rail.dataset.nfpOn = '1';
      var track = rail.querySelector('.nfp-rail__track');
      var prev = rail.querySelector('[data-nfp-prev]'), next = rail.querySelector('[data-nfp-next]');
      if (!track) return;
      function upd() {
        var max = track.scrollWidth - track.clientWidth - 2;
        if (prev) prev.disabled = track.scrollLeft <= 2;
        if (next) next.disabled = track.scrollLeft >= max;
      }
      /* NF-PRO3: exactly one card per click. Native smooth scrolling lands on the snap point; the old rAF glide paged
         several cards at once and fought scroll-snap, which made it skid. Rapid clicks queue from the pending target. */
        var tgt = null, tgtT = 0;
        function page(dir) {
          var cards = track.children; if (!cards.length) return;
          var x0 = cards[0].offsetLeft, step = cards.length > 1 ? cards[1].offsetLeft - x0 : cards[0].offsetWidth;
          if (step <= 0) return;
          var max = track.scrollWidth - track.clientWidth;
          var base = (tgt !== null && Date.now() - tgtT < 700) ? tgt : track.scrollLeft;
          var i = Math.max(0, Math.min(cards.length - 1, Math.round(base / step) + dir));
          var to = Math.max(0, Math.min(max, cards[i].offsetLeft - x0));
          tgt = to; tgtT = Date.now();
          var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          track.scrollTo({ left: to, behavior: rm ? 'auto' : 'smooth' });
        }
      if (prev) prev.addEventListener('click', function () { page(-1); });
      if (next) next.addEventListener('click', function () { page(1); });
      track.addEventListener('scroll', upd, { passive: true });
      window.addEventListener('resize', upd);
      upd();
    });
    warmRails(root);
  }

  /* NF-PRO3: warm every rail image before anyone needs it, so a tab click or a sideways scroll never shows a blank card.
     Hidden tab panels and off screen cards are lazy images the browser only fetched on demand (the 1.5s white gap).
     When a rail section comes within about 1.5 screens, or on idle after load, its images switch to eager and are
     decoded; a tab also warms its own panel on pointerenter, focus or touchstart. */
  function warmPanel(p) {
    if (!p || p.__nfpWarm) return; p.__nfpWarm = 1;
    p.querySelectorAll('img').forEach(function (im) {
      if (im.loading === 'lazy') im.loading = 'eager';
      if (im.decode) im.decode().catch(function () {});
    });
  }
  function warmRails(root) {
    var scope = root.querySelectorAll ? root : document, secs = [];
    scope.querySelectorAll('[data-nfp-tabs], [data-nfp-rail]').forEach(function (el) { var s = el.closest('section') || el; if (secs.indexOf(s) < 0) secs.push(s); });
    if (!secs.length) return;
    function warmSec(s) { if (s.__nfpWarmSec) return; s.__nfpWarmSec = 1; s.querySelectorAll('.nfp-panel, [data-nfp-rail]').forEach(warmPanel); }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { warmSec(e.target); io.unobserve(e.target); } }); }, { rootMargin: '1400px 0px' });
      secs.forEach(function (s) { io.observe(s); });
    }
    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 1200); };
    var late = function () { idle(function () { secs.forEach(warmSec); }, { timeout: 3000 }); };
    if (document.readyState === 'complete') late(); else window.addEventListener('load', late, { once: true });
    scope.querySelectorAll('[data-nfp-tabs] [role="tab"]').forEach(function (b) {
      var w = function () { warmPanel(document.getElementById(b.getAttribute('aria-controls'))); };
      b.addEventListener('pointerenter', w, { passive: true }); b.addEventListener('focus', w); b.addEventListener('touchstart', w, { passive: true });
    });
  }

  /* ---------- concept filters + dialogs ---------- */
  function initConcepts(root) {
    root.querySelectorAll('[data-nfp-concepts]').forEach(function (wrap) {
      if (wrap.dataset.nfpOn) return; wrap.dataset.nfpOn = '1';
      var chips = wrap.querySelectorAll('[data-nfp-filter]');
      var cards = wrap.querySelectorAll('[data-nfp-cat]');
      function apply(f) {
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.nfpFilter === f ? 'true' : 'false'); });
        cards.forEach(function (c) { c.hidden = !(f === 'all' || c.dataset.nfpCat === f); });
        var live = wrap.querySelector('[data-nfp-count]');
        if (live) {
          var n = 0; cards.forEach(function (c) { if (!c.hidden) n++; });
          live.textContent = n + (n === 1 ? ' concept' : ' concepts');
        }
      }
      chips.forEach(function (c) { c.addEventListener('click', function () { apply(c.dataset.nfpFilter); }); });
      var q = new URLSearchParams(location.search).get('filter');
      if (q && wrap.querySelector('[data-nfp-filter="' + q + '"]')) apply(q);
    });
    root.querySelectorAll('[data-nfp-open]').forEach(function (b) {
      if (b.dataset.nfpOn) return; b.dataset.nfpOn = '1';
      b.addEventListener('click', function (e) {
        var d = document.getElementById(b.dataset.nfpOpen);
        if (!d || typeof d.showModal !== 'function') return;
        e.preventDefault(); openDialog(d);
      });
    });
    root.querySelectorAll('dialog.nfp-dialog').forEach(function (d) {
      if (d.dataset.nfpOn) return; d.dataset.nfpOn = '1';
      d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
      d.querySelectorAll('[data-nfp-close]').forEach(function (x) { x.addEventListener('click', function () { d.close(); }); });
      d.addEventListener('close', function () {
        if (location.hash === '#' + d.id) history.replaceState(null, '', location.pathname + location.search);
        if (d.__nfpReturn) { try { d.__nfpReturn.focus(); } catch (e) {} }
      });
    });
    openFromHash();
  }
  function openDialog(d) {
    document.querySelectorAll('dialog.nfp-dialog[open]').forEach(function (o) { if (o !== d) o.close(); });
    d.__nfpReturn = document.activeElement;
    if (!d.open) d.showModal();
    var body = d.querySelector('.nfp-dialog__body'); if (body) body.scrollTop = 0;
    if (location.hash !== '#' + d.id) history.replaceState(null, '', location.pathname + location.search + '#' + d.id);
  }
  function openFromHash() {
    var h = location.hash.slice(1);
    if (!h || h.indexOf('concept-') !== 0) return;
    var d = document.getElementById(h);
    if (d && d.tagName === 'DIALOG' && !d.open) openDialog(d);
  }
  window.addEventListener('hashchange', openFromHash);

  /* ---------- quote form ---------- */
  var SERVICE = {
    'custom-lighting': ['Custom lighting', null],
    'led-strip-neon': ['Custom LED strip or neon', null],
    'neon-signs': ['Neon sign or logo light', 'shape'],
    'linear': ['Linear lighting system', null],
    'bulk': ['Bulk or project order', null],
    'hospitality': ['Hospitality project', 'Hotel or guest house'],
    'office': ['Office project', 'Office or workspace'],
    'retail': ['Retail project', 'Shop or showroom'],
    'home': ['Home project', 'Home'],
    'outdoor': ['Outdoor project', 'Outdoor or garden']
  };
  function initForms(root) {
    root.querySelectorAll('form[data-nfp-form]').forEach(function (form) {
      if (form.dataset.nfpOn) return; form.dataset.nfpOn = '1';
      var qs = new URLSearchParams(location.search);
      var $ = function (s) { return form.querySelector(s); };
      var page = $('[data-nfp-pageurl]'); if (page) page.value = location.origin + location.pathname;
      var ctx = form.querySelector('[data-nfp-context]'), ctxText = ctx && ctx.querySelector('[data-nfp-context-text]'), ctxImg = ctx && ctx.querySelector('img');
      function showCtx(text, img) {
        if (!ctx) return;
        ctxText.textContent = text;
        if (img && ctxImg) { ctxImg.src = img; ctxImg.hidden = false; } else if (ctxImg) { ctxImg.hidden = true; }
        ctx.classList.add('is-on');
      }
      var product = (qs.get('product') || '').replace(/[^a-z0-9\-]/gi, '').slice(0, 200);
      if (product) {
        var ref = $('[data-nfp-ref]');
        if (ref && !ref.value) ref.value = location.origin + '/products/' + product;
        fetch('/products/' + product + '.js', { headers: { Accept: 'application/json' } })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (p) {
            if (!p) return;
            var img = p.featured_image ? p.featured_image + (p.featured_image.indexOf('?') > -1 ? '&' : '?') + 'width=120' : null;
            showCtx('Your request is about: ' + p.title, img);
            var hp = $('[data-nfp-product]'); if (hp) hp.value = p.title;
          }).catch(function () {});
      }
      var concept = (qs.get('concept') || '').toLowerCase();
      if (concept) {
        var sel = $('[data-nfp-concept]');
        if (sel) {
          var opt = sel.querySelector('option[data-slug="' + concept.replace(/[^a-z0-9\-]/g, '') + '"]');
          if (opt) { sel.value = opt.value; showCtx('Starting from the design concept ' + opt.value, null); }
        }
      }
      var service = (qs.get('service') || '').toLowerCase();
      if (SERVICE[service]) {
        var hs = $('[data-nfp-service]'); if (hs) hs.value = SERVICE[service][0];
        var extra = SERVICE[service][1];
        if (extra === 'shape') { var t = $('[data-nfp-tile="shape"]'); if (t) t.checked = true; }
        else if (extra) { var st = $('[data-nfp-space]'); if (st) st.value = extra; }
      }
      var unsure = $('[data-nfp-tile="unsure"]');
      if (unsure) {
        form.querySelectorAll('[data-nfp-tile]').forEach(function (cb) {
          cb.addEventListener('change', function () {
            if (!cb.checked) return;
            if (cb === unsure) form.querySelectorAll('[data-nfp-tile]').forEach(function (o) { if (o !== unsure) o.checked = false; });
            else unsure.checked = false;
          });
        });
      }
      function fieldOf(el) { return el.closest('.nfp-field'); }
      function check(el) {
        var v = (el.value || '').trim(), ok = true;
        if (el.required && !v) ok = false;
        if (ok && el.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) ok = false;
        var f = fieldOf(el); if (f) f.classList.toggle('is-invalid', !ok);
        el.setAttribute('aria-invalid', ok ? 'false' : 'true');
        return ok;
      }
      form.querySelectorAll('[required]').forEach(function (el) {
        el.addEventListener('blur', function () { if (el.value) check(el); });
        el.addEventListener('input', function () { var f = fieldOf(el); if (f && f.classList.contains('is-invalid')) check(el); });
      });
      form.addEventListener('submit', function (e) {
        var bad = null;
        form.querySelectorAll('[required]').forEach(function (el) { if (!check(el) && !bad) bad = el; });
        if (bad) { e.preventDefault(); bad.focus(); return; }
        var changes = [];
        form.querySelectorAll('[data-nfp-tile]:checked').forEach(function (cb) { changes.push(cb.dataset.label); });
        var sum = $('[data-nfp-changes]'); if (sum) sum.value = changes.join(', ') || 'Not given';
        form.querySelectorAll('[data-nfp-optional]').forEach(function (h) { if (!h.value) h.disabled = true; });
        var btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.setAttribute('aria-busy', 'true'); btn.style.opacity = '.75'; }
      });
    });
    if (/contact_posted=true/.test(location.search)) {
      var ok = document.querySelector('.nfp-success');
      if (ok) setTimeout(function () { ok.scrollIntoView({ block: 'center' }); }, 60);
    }
  }

  function boot() { initRails(document); initConcepts(document); initForms(document); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  document.addEventListener('shopify:section:load', function (e) { initRails(e.target); initConcepts(e.target); initForms(e.target); });
})();
