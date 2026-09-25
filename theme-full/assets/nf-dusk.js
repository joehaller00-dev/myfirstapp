/* NF-DUSK-V1 (2026-09-12) homepage day to night slider. No libraries.
   NF-MOBILE-V4 (2026-09-12): below 750px the drag slider is replaced by a toggle button that crossfades the two
   photos (opacity only, about 600ms, both photos decoded first); hotspots show once the room is lit. */
(function () {
  'use strict';
  var RM = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var PH = window.matchMedia ? window.matchMedia('(max-width: 749px)') : { matches: false };
  /* NF-DUSK-BTN (2026-09-21, owner): the on/off button everywhere, no drag slider on any device */
  function tgl() { return true; }

  function clamp(v) { return Math.max(0, Math.min(100, v)); }

  function init(root) {
    if (!root || root.__nfdk) return;
    root.__nfdk = true;
    var stage = root.querySelector('[data-nfdk-stage]');
    var handle = root.querySelector('[data-nfdk-handle]');
    var label = root.querySelector('[data-nfdk-label]');
    var toggle = root.querySelector('[data-nfdk-toggle]');
    var toggleText = root.querySelector('[data-nfdk-toggle-text]');
    var spots = Array.prototype.slice.call(root.querySelectorAll('[data-nfdk-spot]'));
    if (!stage || !handle) return;

    var start = parseFloat(root.getAttribute('data-start'));
    if (isNaN(start)) start = 16;
    var txt = {
      on: root.getAttribute('data-label-on') || 'Drag to switch the lights on',
      back: root.getAttribute('data-label-back') || 'Drag back for daylight',
      tOn: root.getAttribute('data-toggle-on') || 'Switch the lights on',
      tOff: root.getAttribute('data-toggle-off') || 'Switch the lights off'
    };
    var pos = start, pending = null, raf = 0, hintRaf = 0, interacted = false;
    var drag = null;
    root.classList.add('nfdk--js');

    /* hotspot geometry: map image % to stage px under object-fit: cover */
    function geom() {
      var img = root.querySelector('.nfdk__img--night') || root.querySelector('.nfdk__img--day');
      var W = stage.clientWidth, H = stage.clientHeight;
      if (!img || !W || !H) return;
      var iw = parseFloat(img.getAttribute('width')) || img.naturalWidth;
      var ih = parseFloat(img.getAttribute('height')) || img.naturalHeight;
      if (!iw || !ih) return;
      var s = Math.max(W / iw, H / ih), dw = iw * s, dh = ih * s;
      var op = (getComputedStyle(img).objectPosition || '50% 50%').split(' ');
      var px = parseFloat(op[0]) / 100, py = parseFloat(op[1] || '50%') / 100;
      if (isNaN(px)) px = .5;
      if (isNaN(py)) py = .5;
      var ox = (W - dw) * px, oy = (H - dh) * py;
      spots.forEach(function (sp) {
        var x = ox + parseFloat(sp.getAttribute('data-x')) / 100 * dw;
        var y = oy + parseFloat(sp.getAttribute('data-y')) / 100 * dh;
        sp.style.left = x + 'px';
        sp.style.top = y + 'px';
        sp.__xp = x / W * 100;
        sp.__out = x < 18 || x > W - 18 || y < 18 || y > H - 18;
      });
    }

    function lightSpots(test) {
      spots.forEach(function (sp) {
        var lit = !sp.__out && test(sp);
        if (lit === sp.__lit) return;
        sp.__lit = lit;
        sp.classList.toggle('is-lit', lit);
        sp.tabIndex = lit ? 0 : -1;
        sp.setAttribute('aria-hidden', lit ? 'false' : 'true');
      });
    }

    function paint() {
      raf = 0;
      if (pending === null) return;
      pos = pending;
      pending = null;
      var r = Math.round(pos);
      root.style.setProperty('--dk-pos', pos + '%');
      handle.setAttribute('aria-valuenow', r);
      handle.setAttribute('aria-valuetext', r >= 97 ? 'Night, every light on' : r <= 3 ? 'Daylight' : r + ' percent of the room lit');
      var flip = pos > 58;
      if (label) label.textContent = flip ? txt.back : txt.on;
      root.classList.toggle('nfdk--flip', flip);
      lightSpots(function (sp) { return sp.__xp < pos - 1; });
    }

    function set(p) {
      pending = clamp(p);
      if (!raf) raf = requestAnimationFrame(paint);
    }

    function pctFrom(e) {
      var r = stage.getBoundingClientRect();
      return (e.clientX - r.left) / r.width * 100;
    }

    function stopHint() {
      if (hintRaf) { cancelAnimationFrame(hintRaf); hintRaf = 0; }
    }

    /* pointer: mouse drags from anywhere, touch only after a clear horizontal move (so vertical scroll still works) */
    stage.addEventListener('pointerdown', function (e) {
      if (root.classList.contains('nfdk--rm')) return;
      if (e.target.closest && (e.target.closest('[data-nfdk-spot]') || e.target.closest('[data-nfdk-toggle]'))) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      stopHint();
      interacted = true;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, touch: e.pointerType !== 'mouse', moved: false };
      if (!drag.touch) {
        e.preventDefault();
        drag.moved = true;
        root.classList.add('is-dragging');
        set(pctFrom(e));
        try { stage.setPointerCapture(e.pointerId); } catch (_) {}
      }
    });
    stage.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      if (drag.touch && !drag.moved) {
        var dx = Math.abs(e.clientX - drag.x), dy = Math.abs(e.clientY - drag.y);
        if (dx > 6 && dx > dy) {
          drag.moved = true;
          root.classList.add('is-dragging');
          try { stage.setPointerCapture(e.pointerId); } catch (_) {}
        } else if (dy > 10) {
          drag = null;
          return;
        } else {
          return;
        }
      }
      set(pctFrom(e));
    });
    function end(e) {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      if (e && e.type === 'pointerup' && drag.touch && !drag.moved) {
        if (Math.abs(e.clientX - drag.x) < 8 && Math.abs(e.clientY - drag.y) < 8) set(pctFrom(e));
      }
      drag = null;
      root.classList.remove('is-dragging');
    }
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    stage.addEventListener('lostpointercapture', function () { if (drag && drag.moved) { drag = null; root.classList.remove('is-dragging'); } });
    stage.addEventListener('dragstart', function (e) { e.preventDefault(); });

    /* keyboard */
    handle.addEventListener('keydown', function (e) {
      var step = null;
      switch (e.key) {
        case 'ArrowRight': case 'ArrowUp': step = 5; break;
        case 'ArrowLeft': case 'ArrowDown': step = -5; break;
        case 'PageUp': step = 20; break;
        case 'PageDown': step = -20; break;
        case 'Home': stopHint(); interacted = true; set(0); e.preventDefault(); return;
        case 'End': stopHint(); interacted = true; set(100); e.preventDefault(); return;
      }
      if (step === null) return;
      e.preventDefault();
      stopHint();
      interacted = true;
      set((pending === null ? pos : pending) + step);
    });

    /* reduced motion: a plain on/off toggle */
    /* NF-MOBILE-V4: phones use the toggle too. Both photos are decoded before the first crossfade. */
    var ph = false, busy = false, ready = null, pre = null;
    var subEl = root.querySelector('.nfdk__sub'), subTxt = subEl ? subEl.textContent : '';
    var dayImg = root.querySelector('.nfdk__img--day'), nightImg = root.querySelector('.nfdk__img--night');
    function decodeBoth() {
      if (ready) return ready;
      ready = Promise.all([dayImg, nightImg].map(function (im) {
        if (!im) return null;
        try { im.loading = 'eager'; } catch (_) {}
        var loaded = new Promise(function (r) { if (im.complete && im.naturalWidth) r(); else { im.addEventListener('load', r, { once: true }); im.addEventListener('error', r, { once: true }); } });
        return im.decode ? im.decode().catch(function () { return loaded; }) : loaded;
      }));
      return ready;
    }
    function preload() {
      if (ready || pre) return;
      if (!('IntersectionObserver' in window)) { decodeBoth(); return; }
      pre = new IntersectionObserver(function (en) {
        if (en.some(function (x) { return x.isIntersecting; })) { pre.disconnect(); decodeBoth(); }
      }, { rootMargin: '500px 0px' });
      pre.observe(stage);
    }
    function labels() { return ph ? { on: 'Turn the lights on', off: 'Turn the lights off' } : { on: txt.tOn, off: txt.tOff }; }
    function setOn(on) {
      root.classList.toggle('is-on', on);
      if (toggle) toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (toggleText) toggleText.textContent = on ? labels().off : labels().on;
      lightSpots(function () { return on; });
    }
    if (toggle) toggle.addEventListener('click', function () {
      if (busy) return;
      var want = !root.classList.contains('is-on');
      busy = true;
      toggle.setAttribute('aria-busy', 'true');
      var done = function () { if (!busy) return; busy = false; toggle.removeAttribute('aria-busy'); setOn(want); };
      var cap = setTimeout(done, 1500);
      decodeBoth().then(function () { clearTimeout(cap); done(); });
    });

    function applyMode() {
      var rm = tgl();
      ph = !!PH.matches;
      root.classList.toggle('nfdk--rm', rm);
      root.classList.toggle('nfdk--ph', ph);
      if (subEl) subEl.textContent = 'Tap the button to switch every light on, then tap a glowing light to shop it.';
      if (rm) preload();
      spots.forEach(function (sp) { sp.__lit = null; });
      if (rm) {
        stopHint();
        setOn(root.classList.contains('is-on'));
      } else {
        set(pos);
      }
    }

    /* one gentle hint nudge the first time the stage is on screen */
    function hint() {
      if (interacted || tgl()) return;
      var t0 = null, dur = 1500, amp = 16;
      function frame(t) {
        if (interacted) { hintRaf = 0; return; }
        if (t0 === null) t0 = t;
        var k = Math.min(1, (t - t0) / dur);
        var e = Math.sin(k * Math.PI);
        set(start + amp * e * e);
        if (k < 1) hintRaf = requestAnimationFrame(frame); else { hintRaf = 0; set(start); }
      }
      hintRaf = requestAnimationFrame(frame);
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && en.intersectionRatio >= .55) { io.disconnect(); setTimeout(hint, 450); }
        });
      }, { threshold: [0, .55] });
      io.observe(stage);
    }

    geom();
    if ('ResizeObserver' in window) {
      new ResizeObserver(function () {
        geom();
        spots.forEach(function (sp) { sp.__lit = null; });
        if (root.classList.contains('nfdk--rm')) setOn(root.classList.contains('is-on')); else set(pending === null ? pos : pending);
      }).observe(stage);
    } else {
      window.addEventListener('resize', geom);
    }
    if (RM.addEventListener) RM.addEventListener('change', applyMode);
    else if (RM.addListener) RM.addListener(applyMode);
    if (PH.addEventListener) PH.addEventListener('change', applyMode);
    else if (PH.addListener) PH.addListener(applyMode);
    applyMode();
  }

  function boot(scope) {
    Array.prototype.forEach.call((scope || document).querySelectorAll('[data-nfdk]'), init);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { boot(); });
  else boot();
  document.addEventListener('shopify:section:load', function (e) { boot(e.target); });
})();
