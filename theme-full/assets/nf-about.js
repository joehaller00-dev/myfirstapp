/* NF-ABOUT-V1 (2026-09-11) About Us page. Loaded by sections/nf-about-hero.liquid.
   1. Light switch hero ([data-nfa-hero]): the lights ON photo sits over the lights OFF photo at opacity 0. Flipping the
      switch warms it up to 1 with a short incandescent catch (a quick rise, a dip, then a smooth glow) and reveals the
      headline. Without a click, scrolling the first 45% of the hero glides the room on, and after data-auto seconds
      of no interaction it turns on by itself. Only opacity and transform are written, once per animation frame.
      prefers-reduced-motion: copy is visible from the start, no flicker, no scroll scrubbing, no auto; the switch
      still works as a 320ms crossfade.
      NF-SWITCH-SMOOTH (2026-09-12, owner: "sometimes it's glitchy, a little laggy"): the first flip dropped one
      100ms+ frame while the lit photo was decoded and rasterized. Now both photos are decoded (img.decode()) before
      the room animates; a flip that comes earlier flips the paddle at once and runs the light as soon as they are
      ready. While dark, the lit photo sits at opacity 0.002 on its own layer (will-change set by .nfa-anim) so the
      compositor keeps it rasterized; .nfa-anim is removed once the room is lit and settled, and comes back on hover,
      focus or touch of the switch. Style writes are skipped when a value has not changed, and the scroll glide uses
      cached geometry instead of reading layout every frame.
   2. Delivery steps ([data-nfa-steps]): the bulbs on the cord light one after another when the band scrolls into view.
      Reduced motion or no IntersectionObserver: all bulbs are simply on.
   No JS at all: the lit room, full copy and lit bulbs show (the inline script in the hero only adds .is-js). */
(function () {
  'use strict';
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduced() { return !!(mq && mq.matches); }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function arr(list) { return Array.prototype.slice.call(list || []); }

  // Incandescent warm up for 0..1: catches fast, dips, then settles into a smooth glow.
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

  function initHero(hero) {
    if (!hero || hero.__nfa) return;
    var on = hero.querySelector('.nfa-hero__on');
    var off = hero.querySelector('.nfa-hero__off');
    var sw = hero.querySelector('[data-nfa-switch]');
    if (!on || !sw) { hero.classList.remove('is-js'); return; }
    hero.__nfa = true;
    hero.classList.add('is-js');
    var RM = reduced();
    hero.classList.toggle('is-reduced', RM);

    var glow = hero.querySelector('.nfa-hero__glow');
    var hint = hero.querySelector('[data-nfa-hint]');
    var reveals = arr(hero.querySelectorAll('[data-nfa-reveal]'));
    var labelOn = sw.getAttribute('data-label-on') || 'Turn on the lights';
    var labelOff = sw.getAttribute('data-label-off') || 'Turn off the lights';
    var p = 0, raf = 0, locked = false, ticking = false, autoTimer = 0, coolT = 0;
    var ready = false, queued = null, primed = false, top0 = 0, h0 = 1, last = {};

    function put(node, prop, v, key) {
      if (last[key] === v) return;
      last[key] = v;
      node.style[prop] = v;
    }

    // will-change only around the animation: set before (dark and waiting, hover, focus, touch), removed after lit
    function heat() {
      clearTimeout(coolT);
      if (!hero.classList.contains('nfa-anim')) hero.classList.add('nfa-anim');
    }
    function cool() {
      clearTimeout(coolT);
      coolT = setTimeout(function () {
        if (p >= 1 && hero.classList.contains('nfa-anim')) hero.classList.remove('nfa-anim');
      }, 450);
    }

    function setChecked(v) {
      sw.setAttribute('aria-checked', v ? 'true' : 'false');
      sw.setAttribute('aria-label', v ? labelOff : labelOn);
      if (hero.classList.contains('is-lit') !== v) hero.classList.toggle('is-lit', v);
    }

    // the look at light level v: lit photo and glow opacity (a hair above 0 while dark keeps the lit layer
    // rasterized), the headline reveal, the hint
    function look(v) {
      var s = { o: v <= 0 ? (primed ? '0.002' : '0') : v.toFixed(3), h: clamp(1 - v * 1.8).toFixed(3), r: [] };
      if (!RM) {
        var q = clamp((v - 0.28) / 0.62);
        for (var i = 0; i < reveals.length; i++) {
          var qi = clamp(q * 1.3 - i * 0.15);
          s.r.push([qi.toFixed(3), 'translate3d(0,' + ((1 - qi) * 16).toFixed(1) + 'px,0)']);
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

    // NF-SWITCH-SMOOTH v2: the light plays as Web Animations (opacity and transform only, sampled from the same
    // incandescent curve) so the COMPOSITOR runs it. The first tap on a page also wakes deferred third party scripts
    // (gtag.js measured 113ms at 4x CPU), which froze the old one write per frame fade for about 6 frames.
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
      var dur = RM ? 320 : (up ? (flicker ? 1700 : 900) : 560);
      var f = function (k) {
        var e;
        if (RM) e = k;
        else if (up && flicker) e = warm(k);
        else if (up) e = 1 - Math.pow(1 - k, 3);
        else e = k * k * (3 - 2 * k);
        return from + (target - from) * e;
      };
      if (!on.animate) { // old browsers: one write per frame
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
      // 41 keyframes, 1/40 apart: that grid lands exactly on the flicker corners (0.05, 0.1, 0.15)
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
        p = target; curve = null; paint(); // inline styles hold the end state, then the animations let go
        anims = [];
        for (var m = 0; m < list.length; m++) list[m].cancel();
        if (target >= 1) cool();
      };
    }

    // run fn once both photos are decoded and the lit layer has been painted (two frames, or 120ms if rAF is paused)
    function whenReady(fn) {
      if (ready) { fn(); return; }
      queued = fn;
    }

    function stopScroll() { window.removeEventListener('scroll', onScroll); }

    sw.addEventListener('click', function () {
      locked = true;
      clearTimeout(autoTimer);
      stopScroll();
      var turnOn = sw.getAttribute('aria-checked') !== 'true';
      setChecked(turnOn); // the paddle answers at once
      whenReady(function () { animateTo(turnOn ? 1 : 0, turnOn && level() < 0.2); });
    });
    ['pointerenter', 'focus', 'touchstart'].forEach(function (ev) {
      sw.addEventListener(ev, function () { if (ready) heat(); }, { passive: true });
    });

    function measure() {
      var r = hero.getBoundingClientRect();
      top0 = r.top + (window.scrollY || window.pageYOffset || 0);
      h0 = r.height || 1;
    }

    function onScroll() {
      if (locked || ticking || !ready) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        if (locked) return;
        var prog = clamp(((window.scrollY || window.pageYOffset || 0) - top0) / (h0 * 0.45));
        if (prog > 0) clearTimeout(autoTimer);
        if (Math.abs(prog - p) > 0.001) { p = prog; paint(); }
        if (prog >= 1) { locked = true; setChecked(true); stopScroll(); cool(); }
      });
    }

    measure();
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('load', measure, { once: true });

    if (!RM) {
      window.addEventListener('scroll', onScroll, { passive: true });
      var secs = parseInt(hero.getAttribute('data-auto'), 10) || 0;
      if (secs > 0) {
        autoTimer = setTimeout(function () {
          if (locked || document.hidden || p > 0.05) return;
          var r = hero.getBoundingClientRect();
          if (r.bottom < 80 || r.top > window.innerHeight) return;
          locked = true;
          stopScroll();
          setChecked(true);
          whenReady(function () { animateTo(1, true); });
        }, secs * 1000);
      }
    }
    paint();

    decodeAll([off, on], function () {
      primed = true;
      heat();
      paint();
      var go = function () {
        if (ready) return;
        ready = true;
        var f = queued; queued = null;
        if (f) f(); else if (!locked && !RM) onScroll();
      };
      requestAnimationFrame(function () { requestAnimationFrame(go); });
      setTimeout(go, 120);
    });
    hero.__nfaApi = { state: function () { return level(); }, ready: function () { return ready; } };
  }

  function initSteps(band) {
    if (!band || band.__nfa) return;
    band.__nfa = true;
    var steps = arr(band.querySelectorAll('[data-nfa-step]'));
    if (!steps.length || reduced() || !('IntersectionObserver' in window)) return; // bulbs stay lit
    band.classList.add('is-js');
    var target = band.querySelector('[data-nfa-steps-list]') || band;
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) continue;
        io.disconnect();
        steps.forEach(function (s, n) { setTimeout(function () { s.classList.add('is-on'); }, 180 + n * 340); });
        return;
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -12% 0px' });
    io.observe(target);
  }

  function boot(scope) {
    var root = scope || document;
    arr(root.querySelectorAll('[data-nfa-hero]')).forEach(initHero);
    arr(root.querySelectorAll('[data-nfa-steps]')).forEach(initSteps);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { boot(); });
  else boot();
  document.addEventListener('shopify:section:load', function (e) { boot(e.target); });
})();
