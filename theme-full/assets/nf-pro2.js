/* NF-PRO-V2 (2026-09-11). Professionals and custom service pages:
   1. Application references: the images switch on in sequence when the dark band scrolls into view, and a small wall
      switch turns them off and on again (echoing the About Us light switch). No JS: everything stays lit.
   2. "Quote this look": picks that reference in the quote form's "Seen in a project?" select and moves to the form.
      ?ref=<label-handle> does the same from a link.
   3. Tidy email: on submit the adjust tiles become one readable "What to adjust" line and empty fields are dropped.
   Guarded so it runs once even when several sections include it. */
(function () {
  if (window.__nfPro2JS) return;
  window.__nfPro2JS = true;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- 1. references: lights on ---------- */
  function initRefs(root) {
    (root.querySelectorAll ? root : document).querySelectorAll('[data-nfp2-refs]').forEach(function (sec) {
      if (sec.dataset.nfp2On) return; sec.dataset.nfp2On = '1';
      var sw = sec.querySelector('[data-nfp2-switch]');
      function set(on, instant) {
        sec.classList.toggle('is-off', !on);
        sec.classList.toggle('is-instant', !!instant);
        if (sw) sw.setAttribute('aria-checked', on ? 'true' : 'false');
      }
      if (!('IntersectionObserver' in window)) return;
      set(false, true);
      sec.classList.add('is-armed');
      var done = false;
      function lightUp() {
        if (done) return; done = true;
        requestAnimationFrame(function () { requestAnimationFrame(function () { set(true, false); }); });
      }
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { lightUp(); io.disconnect(); } });
      }, { threshold: 0.18 });
      io.observe(sec);
      /* failsafe: if the band is already on screen at load, or observers stall in a background tab */
      setTimeout(function () {
        var r = sec.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) lightUp();
      }, 2500);
      if (sw) sw.addEventListener('click', function () {
        done = true;
        set(sw.getAttribute('aria-checked') !== 'true', false);
      });
    });
    document.querySelectorAll('[data-nfp2-ref]').forEach(function (a) {
      if (a.dataset.nfp2On) return; a.dataset.nfp2On = '1';
      a.addEventListener('click', function (e) {
        if (pickRef(a.getAttribute('data-nfp2-ref'))) {
          var q = document.getElementById((a.getAttribute('href') || '#quote').slice(1));
          if (q) { e.preventDefault(); q.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
            var sel = q.querySelector('[data-nfp2-seen]'); if (sel) setTimeout(function () { try { sel.focus({ preventScroll: true }); } catch (x) {} }, reduce ? 0 : 600); }
        }
      });
    });
  }
  function pickRef(key) {
    if (!key) return false;
    var ok = false;
    document.querySelectorAll('[data-nfp2-seen]').forEach(function (sel) {
      var o = sel.querySelector('option[data-ref="' + String(key).replace(/[^a-z0-9\-]/gi, '') + '"]');
      if (o) { sel.value = o.value; ok = true; sel.dispatchEvent(new Event('change', { bubbles: true }));
        var f = sel.closest('.nfp-field'); if (f) { f.classList.remove('nfp2-flash'); void f.offsetWidth; f.classList.add('nfp2-flash'); } }
    });
    return ok;
  }

  /* ---------- 3. tidy the email ---------- */
  function initForms() {
    document.querySelectorAll('form[data-nfp2-form]').forEach(function (form) {
      if (form.dataset.nfp2On) return; form.dataset.nfp2On = '1';
      form.addEventListener('formdata', function (e) {
        var fd = e.formData, picks = [], drop = [];
        form.querySelectorAll('input[data-nfp-tile]:checked').forEach(function (cb) { picks.push(cb.getAttribute('data-label')); });
        fd.forEach(function (v, k) {
          if (/^contact\[Adjust: /.test(k)) drop.push(k);
          else if (typeof v === 'string' && !v.trim() && /^contact\[/.test(k) && !/^contact\[(name|email|subject)\]$/.test(k)) drop.push(k);
        });
        drop.forEach(function (k) { fd.delete(k); });
        if (picks.length) fd.set('contact[What to adjust]', picks.join(', ')); else fd.delete('contact[What to adjust]');
      });
    });
    var q = new URLSearchParams(location.search).get('ref');
    if (q) pickRef(q.toLowerCase());
  }

  function boot() { initRefs(document); initForms(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  document.addEventListener('shopify:section:load', function (e) { initRefs(e.target); initForms(); });
})();
