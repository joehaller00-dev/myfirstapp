/* NF-HELP-V1 (2026-09-12). Loaded by sections/nf-hc-404.liquid and sections/nf-hc-form.liquid.
   1. "Lights out" 404 ([data-nfhc-404]): the lights ON photo sits over the lights OFF photo at opacity 0. The wall switch
      (same switch and incandescent warm up as the About Us hero, assets/nf-about.js) fades it in, reveals the line
      under the heading and opens the search, category tiles and best sellers below. It also turns on when the visitor
      scrolls, tabs into the lower area, or after data-auto seconds. Only opacity and transform are written, once per
      animation frame. prefers-reduced-motion: the room is lit from the start; the switch still works as a 320ms
      crossfade. No JS: lit room and everything visible (the inline script in the section adds .is-js).
      NF-SWITCH-SMOOTH (2026-09-12): as on About Us, both photos are decoded (img.decode()) before the room animates, the
      dark state keeps the lit photo at opacity 0.002 on its own layer (.nfhc-anim sets will-change) so the first flip
      has no decode or raster spike, .nfhc-anim is removed once lit and settled, and unchanged style values are not
      rewritten. A flip before the photos are ready moves the paddle at once and runs the light when they are.
   2. Contact topic chips ([data-nfhc-form]): picking a topic fills the message box with a short starter sentence when
      the box is empty (or still holds the previous starter). ?topic=returns deep links, and any [data-nfhc-topic]
      link on the page picks a chip. The chosen topic is sent with the form as contact[Topic]. */
(function () {
  'use strict';
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduced() { return !!(mq && mq.matches); }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function arr(list) { return Array.prototype.slice.call(list || []); }

  // Incandescent warm up for 0..1: catches fast, dips, then settles into a smooth glow (as on About Us).
  function warm(k) {
    if (k < 0.05) return (k / 0.05) * 0.46;
    if (k < 0.1) return 0.46 - ((k - 0.05) / 0.05) * 0.2;
    if (k < 0.15) return 0.26 + ((k - 0.1) / 0.05) * 0.34;
    var r = (k - 0.15) / 0.85;
    return 0.6 + 0.4 * (1 - Math.pow(1 - r, 3));
  }

  // Resolve when every image is loaded AND decoded (4s cap, so the switch can never be left dead).
  function decodeAll(imgs, cb) {
    var done = false;
    function fin() { if (done) return; done = true; cb(); }
    var ps = imgs.filter(Boolean).map(function (i) {
      var loaded = (i.complete && i.naturalWidth) ? Promise.resolve() : new Promise(function (res) {
        i.addEventListener('load', res, { once: true });
        i.addEventListener('error', res, { once: true });
      });
      return loaded.then(function () { return i.decode ? i.decode().catch(function () {}) : null; });
    });
    Promise.all(ps).then(fin, fin);
    setTimeout(fin, 4000);
  }

  function init404(root) {
    if (!root || root.__nfhc) return;
    root.__nfhc = true;
    var sw = root.querySelector('[data-nfhc-switch]');
    var on = root.querySelector('.nfhc-404__on');
    var off = root.querySelector('.nfhc-404__off');
    if (!sw || !on) { root.classList.remove('is-js'); root.classList.add('is-lit', 'is-open'); return; }
    var RM = reduced();
    var glow = root.querySelector('.nfhc-404__glow');
    var hint = root.querySelector('[data-nfhc-hint]');
    var reveals = arr(root.querySelectorAll('[data-nfhc-reveal]'));
    var more = root.querySelector('[data-nfhc-more]');
    var labelOn = sw.getAttribute('data-label-on') || 'Turn on the light';
    var labelOff = sw.getAttribute('data-label-off') || 'Turn off the light';
    var p = 0, raf = 0, done = false, autoTimer = 0, coolT = 0;
    var ready = false, queued = null, primed = false, last = {};

    function put(node, prop, v, key) {
      if (last[key] === v) return;
      last[key] = v;
      node.style[prop] = v;
    }
    function heat() {
      clearTimeout(coolT);
      if (!root.classList.contains('nfhc-anim')) root.classList.add('nfhc-anim');
    }
    function cool() {
      clearTimeout(coolT);
      // the lower area fades in over 1.1s (CSS); keep its layer until that is over too
      coolT = setTimeout(function () {
        if (p >= 1 && root.classList.contains('nfhc-anim')) root.classList.remove('nfhc-anim');
      }, 1300);
    }

    function setChecked(v) {
      sw.setAttribute('aria-checked', v ? 'true' : 'false');
      sw.setAttribute('aria-label', v ? labelOff : labelOn);
      if (root.classList.contains('is-lit') !== v) root.classList.toggle('is-lit', v);
      if (v && !root.classList.contains('is-open')) root.classList.add('is-open');
    }

    function look(v) {
      var s = { o: v <= 0 ? (primed ? '0.002' : '0') : v.toFixed(3), h: clamp(1 - v * 1.8).toFixed(3), r: [] };
      if (!RM) {
        var q = clamp((v - 0.3) / 0.6);
        for (var i = 0; i < reveals.length; i++) {
          var qi = clamp(q * 1.3 - i * 0.15);
          s.r.push([qi.toFixed(3), 'translate3d(0,' + ((1 - qi) * 14).toFixed(1) + 'px,0)']);
        }
      }
      return s;
    }

    function paint() {
      var s = look(p);
      put(on, 'opacity', s.o, 'on');
      if (glow) put(glow, 'opacity', s.o, 'glow');
      for (var i = 0; i < s.r.length; i++) {
        put(reveals[i], 'opacity', s.r[i][0], 'o' + i);
        put(reveals[i], 'transform', s.r[i][0] === '1.000' ? 'none' : s.r[i][1], 't' + i);
      }
      if (hint) put(hint, 'opacity', s.h, 'h');
    }

    // NF-SWITCH-SMOOTH v2: Web Animations (opacity and transform only) so the compositor plays the light even while
    // the first tap wakes deferred third party scripts on the main thread (see assets/nf-about.js).
    var anims = [], curve = null, dur0 = 1;
    function level() {
      if (!curve || !anims.length) return p;
      return curve(clamp((anims[0].currentTime || 0) / dur0));
    }
    function freeze() {
      if (!anims.length) return;
      p = level(); curve = null; paint();
      var a = anims; anims = [];
      for (var i = 0; i < a.length; i++) a[i].cancel();
    }

    function animateTo(target, flicker) {
      cancelAnimationFrame(raf);
      freeze();
      heat();
      var from = p, up = target > from;
      var dur = RM ? 320 : (up ? (flicker ? 1500 : 800) : 520);
      var f = function (k) {
        var e;
        if (RM) e = k;
        else if (up && flicker) e = warm(k);
        else if (up) e = 1 - Math.pow(1 - k, 3);
        else e = k * k * (3 - 2 * k);
        return from + (target - from) * e;
      };
      if (!on.animate) {
        var t0 = 0;
        var frame = function (now) {
          if (!t0) t0 = now;
          var k = clamp((now - t0) / dur);
          p = f(k); paint();
          if (k < 1) raf = requestAnimationFrame(frame); else if (target >= 1) cool();
        };
        raf = requestAnimationFrame(frame);
        return;
      }
      var kOn = [], kHint = [], kRev = reveals.map(function () { return []; });
      for (var j = 0; j <= 40; j++) {
        var k = j / 40, s = look(f(k));
        kOn.push({ offset: k, opacity: +s.o });
        kHint.push({ offset: k, opacity: +s.h });
        for (var r = 0; r < s.r.length; r++) kRev[r].push({ offset: k, opacity: +s.r[r][0], transform: s.r[r][1] });
      }
      var o = { duration: dur, easing: 'linear', fill: 'forwards' };
      var list = [on.animate(kOn, o)];
      if (glow) list.push(glow.animate(kOn, o));
      if (hint) list.push(hint.animate(kHint, o));
      for (var n = 0; n < kRev.length; n++) if (kRev[n].length) list.push(reveals[n].animate(kRev[n], o));
      anims = list; curve = f; dur0 = dur;
      list[0].onfinish = function () {
        if (anims !== list) return;
        p = target; curve = null; paint();
        anims = [];
        for (var m = 0; m < list.length; m++) list[m].cancel();
        if (target >= 1) cool();
      };
    }

    function whenReady(fn) {
      if (ready) { fn(); return; }
      queued = fn;
    }

    function stop() { done = true; clearTimeout(autoTimer); window.removeEventListener('scroll', onScroll); }
    function turnOn() {
      if (sw.getAttribute('aria-checked') === 'true') return;
      stop();
      setChecked(true);
      whenReady(function () { animateTo(1, level() < 0.2); });
    }
    function onScroll() { if ((window.scrollY || window.pageYOffset || 0) > 40) turnOn(); }

    sw.addEventListener('click', function () {
      stop();
      var v = sw.getAttribute('aria-checked') !== 'true';
      setChecked(v);
      whenReady(function () { animateTo(v ? 1 : 0, v && level() < 0.2); });
    });
    ['pointerenter', 'focus', 'touchstart'].forEach(function (ev) {
      sw.addEventListener(ev, function () { if (ready) heat(); }, { passive: true });
    });
    if (more) more.addEventListener('focusin', turnOn);

    if (RM) {
      root.classList.remove('is-js');
      root.classList.add('is-reduced');
      p = 1;
      setChecked(true);
      paint();
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
      var secs = parseInt(root.getAttribute('data-auto'), 10) || 0;
      var tick = function () {
        if (done) return;
        if (document.hidden) { autoTimer = setTimeout(tick, 1000); return; }
        turnOn();
      };
      if (secs > 0) autoTimer = setTimeout(tick, secs * 1000);
      paint();
    }

    decodeAll([off, on], function () {
      primed = true;
      if (p < 1) heat();
      paint();
      var go = function () {
        if (ready) return;
        ready = true;
        var f = queued; queued = null;
        if (f) f();
      };
      requestAnimationFrame(function () { requestAnimationFrame(go); });
      setTimeout(go, 120);
    });
    root.__nfhcApi = { state: function () { return level(); }, on: turnOn, ready: function () { return ready; } };
  }

  function pickChip(form, r) {
    var ta = form.querySelector('textarea[name="contact[body]"]');
    if (!r || !ta) return;
    var starter = r.getAttribute('data-starter') || '';
    var last = form.__nfhcLast || '';
    if (starter && (ta.value.trim() === '' || ta.value === last)) {
      ta.value = starter;
      form.__nfhcLast = starter;
    }
  }

  function initForm(form) {
    if (!form || form.__nfhc) return;
    form.__nfhc = true;
    arr(form.querySelectorAll('input[data-nfhc-chip]')).forEach(function (r) {
      r.addEventListener('change', function () { if (r.checked) pickChip(form, r); });
    });
    var m = (window.location.search || '').match(/[?&]topic=([a-z-]+)/);
    if (m) {
      var r = form.querySelector('input[data-nfhc-chip][data-key="' + m[1] + '"]');
      if (r && !r.checked) { r.checked = true; pickChip(form, r); }
    }
  }

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('[data-nfhc-topic]') : null;
    if (!a) return;
    var form = document.querySelector('[data-nfhc-form]');
    if (!form) return;
    var r = form.querySelector('input[data-nfhc-chip][data-key="' + a.getAttribute('data-nfhc-topic') + '"]');
    if (r && !r.checked) { r.checked = true; pickChip(form, r); }
  });

  function boot(scope) {
    var root = scope || document;
    arr(root.querySelectorAll('[data-nfhc-404]')).forEach(init404);
    arr(root.querySelectorAll('[data-nfhc-form]')).forEach(initForm);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { boot(); });
  else boot();
  document.addEventListener('shopify:section:load', function (e) { boot(e.target); });
})();
