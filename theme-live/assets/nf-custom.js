/* NF-CUSTOM3-V1 (2026-09-11), chandelier guide rebuilt NF-CUSTOM3-V2. Custom services tools for /pages/custom-curtains, /pages/custom-chandeliers and
   /pages/custom-name-signs: a curtain measuring helper, a chandelier sizing guide and a live neon sign preview.
   Every tool writes a plain text summary of the customer's choices into the quote form field [data-nfc-summary]
   (snippets/nf-custom-quote-form.liquid), which is emailed to info@ with the NFPRO subject.
   Loaded by sections/nf-custom-tool.liquid and nf-custom-quote.liquid; guarded so it runs once. No libraries. */
(function () {
  if (window.__nfCustomJS) return;
  window.__nfCustomJS = true;

  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function num(el, def, min, max) {
    if (!el) return def;
    var raw = String(el.value).replace(',', '.').trim();
    var v = parseFloat(raw);
    var ok = raw !== '' && isFinite(v) && v >= min && v <= max;
    el.setAttribute('aria-invalid', raw === '' || ok ? 'false' : 'true');
    return ok ? v : def;
  }
  function radio(root, name) { var el = root.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : ''; }
  function radioLabel(root, name) { var el = root.querySelector('input[name="' + name + '"]:checked'); return el ? (el.getAttribute('data-label') || el.value) : ''; }
  function half(v) { return Math.round(v * 2) / 2; }
  function fmt(v) { v = half(v); return v % 1 ? v.toFixed(1) : String(v); }
  function inch(v) { return fmt(v) + ' in'; }
  function ftin(v) { v = Math.round(v); var f = Math.floor(v / 12), i = v - f * 12; return f + ' ft' + (i ? ' ' + i + ' in' : ''); }
  function len(v) { return v >= 24 ? ftin(v) + ' (' + Math.round(v) + ' in)' : inch(v); }
  function r1(v) { return Math.round(v * 10) / 10; }
  function set(root, key, val) { $$('[data-out="' + key + '"]', root).forEach(function (el) { el.textContent = val; }); }
  function show(root, key, on) { $$('[data-when="' + key + '"]', root).forEach(function (el) { el.hidden = !on; }); }
  function syncChoices(root) {
    $$('.nfc-choice, .nfc-sw', root).forEach(function (l) { var i = l.querySelector('input'); if (i) l.classList.toggle('is-on', i.checked); });
  }
  function warnings(root, list) {
    var w = root.querySelector('[data-out-warn]');
    if (!w) return;
    if (!list.length) { w.hidden = true; w.innerHTML = ''; return; }
    w.innerHTML = list.join(' ');
    w.hidden = false;
  }
  function announcer(root) {
    var el = root.querySelector('[data-out="sentence"]'), t = null;
    return function (text) { if (!el) return; clearTimeout(t); t = setTimeout(function () { el.textContent = text; }, 700); };
  }
  function hexMix(a, b, t) {
    function p(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
    var x = p(a), y = p(b), o = '#';
    for (var i = 0; i < 3; i++) { var c = Math.round(x[i] * t + y[i] * (1 - t)); o += (c < 16 ? '0' : '') + c.toString(16); }
    return o;
  }
  function onChange(root, fn) { root.addEventListener('input', fn); root.addEventListener('change', fn); }

  /* SVG helpers */
  function n(v) { return Math.round(v * 10) / 10; }
  function dimV(p, x, y1, y2, label, side) {
    if (Math.abs(y2 - y1) < 6) return;
    p.push('<g stroke="#1c1c1c" stroke-width="1"><line x1="' + n(x) + '" x2="' + n(x) + '" y1="' + n(y1) + '" y2="' + n(y2) + '"/>' +
      '<line x1="' + n(x - 4) + '" x2="' + n(x + 4) + '" y1="' + n(y1) + '" y2="' + n(y1) + '"/><line x1="' + n(x - 4) + '" x2="' + n(x + 4) + '" y1="' + n(y2) + '" y2="' + n(y2) + '"/></g>');
    var tx = side === 'end' ? x - 7 : x + 7;
    p.push('<text x="' + n(tx) + '" y="' + n((y1 + y2) / 2 + 4) + '" text-anchor="' + (side === 'end' ? 'end' : 'start') + '" stroke="#f7f7f7" stroke-width="4" paint-order="stroke" stroke-linejoin="round">' + label + '</text>');
  }
  function dimH(p, x1, x2, y, label) {
    if (Math.abs(x2 - x1) < 6) return;
    p.push('<g stroke="#1c1c1c" stroke-width="1"><line x1="' + n(x1) + '" x2="' + n(x2) + '" y1="' + n(y) + '" y2="' + n(y) + '"/>' +
      '<line x1="' + n(x1) + '" x2="' + n(x1) + '" y1="' + n(y - 4) + '" y2="' + n(y + 4) + '"/><line x1="' + n(x2) + '" x2="' + n(x2) + '" y1="' + n(y - 4) + '" y2="' + n(y + 4) + '"/></g>');
    p.push('<text x="' + n((x1 + x2) / 2) + '" y="' + n(y + 16) + '" text-anchor="middle" stroke="#f7f7f7" stroke-width="4" paint-order="stroke" stroke-linejoin="round">' + label + '</text>');
  }
  function person(p, x, yFloor, h) {
    var hr = h * 0.075;
    p.push('<g fill="#cfcfcf"><circle cx="' + n(x) + '" cy="' + n(yFloor - h + hr) + '" r="' + n(hr) + '"/>' +
      '<rect x="' + n(x - h * 0.12) + '" y="' + n(yFloor - h + hr * 2.3) + '" width="' + n(h * 0.24) + '" height="' + n(h - hr * 2.3) + '" rx="' + n(h * 0.09) + '"/></g>');
  }

  /* ---------- bridge to the quote form ---------- */
  var lastLines = null;
  function summaryEl() { return $('[data-nfc-summary]'); }
  function push(lines, force) {
    lastLines = lines;
    var ta = summaryEl();
    if (!ta) return;
    var rs = $('[data-nfc-resync]');
    if (ta.getAttribute('data-edited') === '1' && !force) { if (rs) rs.hidden = false; return; }
    ta.value = lines.join('\n');
    ta.setAttribute('data-edited', '0');
    if (rs) rs.hidden = true;
  }
  function bindSummary() {
    var ta = summaryEl();
    if (!ta || ta.getAttribute('data-nfc-on')) return;
    ta.setAttribute('data-nfc-on', '1');
    ta.addEventListener('input', function () { ta.setAttribute('data-edited', '1'); });
    var rs = $('[data-nfc-resync]');
    if (rs) rs.addEventListener('click', function () { if (lastLines) push(lastLines, true); ta.focus(); });
    if (lastLines && !ta.value) push(lastLines, true);
  }
  function goQuote(lines) {
    push(lines, true);
    var ta = summaryEl();
    var q = document.getElementById('quote') || (ta && ta.closest('section'));
    if (!q) return;
    q.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (!ta) return;
    ta.classList.remove('is-flash'); void ta.offsetWidth; ta.classList.add('is-flash');
    var name = q.querySelector('input[name="contact[name]"]');
    setTimeout(function () { try { (name && !name.value ? name : ta).focus({ preventScroll: true }); } catch (e) {} }, reduce ? 60 : 700);
  }
  function bindGo(root, getLines) {
    $$('[data-nfc-go]', root).forEach(function (b) { b.addEventListener('click', function () { goQuote(getLines()); }); });
  }

  /* =====================================================================
     Curtains: measuring helper
     ===================================================================== */
  var FABRIC = { blackout: '#3f454d', sheer: '#ffffff', linen: '#a5a39e', velvet: '#34514a' };
  function drawCurtains(svg, o) {
    var VW = 600, VH = 470, pt = 34, pb = 24, p = [];
    var rod = o.W + 2 * o.ext;
    var topIn = o.mount === 'ceiling' ? o.gap + 4 : o.R + 16;
    var worldH = topIn + o.H + o.S + 4;
    var worldW = Math.max(rod, o.W) + 80;
    var s = Math.min((VW - 20) / worldW, (VH - pt - pb) / worldH);
    var cx = VW / 2 - 14;
    var yF = pt + ((VH - pt - pb) - worldH * s) / 2 + topIn * s;
    function X(i) { return cx + i * s; }
    function Y(i) { return yF + i * s; }
    var yFloor = Y(o.H + o.S), yRod = Y(-o.R), ySill = Y(o.H);
    var fab = FABRIC[o.fabric] || FABRIC.linen, sheer = o.fabric === 'sheer';
    var fold = Math.max(6, 17 - o.full * 3.4);
    p.push('<defs><linearGradient id="nfcDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2540"/><stop offset="1" stop-color="#4a5f86"/></linearGradient>' +
      '<pattern id="nfcFold" width="' + n(fold) + '" height="8" patternUnits="userSpaceOnUse"><rect width="' + n(fold) + '" height="8" fill="' + fab + '"' + (sheer ? ' fill-opacity=".55"' : '') + '/>' +
      '<rect width="' + n(fold * 0.38) + '" height="8" fill="#000" fill-opacity="' + (sheer ? '.05' : '.17') + '"/><rect x="' + n(fold * 0.64) + '" width="1.4" height="8" fill="#fff" fill-opacity="' + (sheer ? '.5' : '.14') + '"/></pattern></defs>');
    p.push('<rect width="' + VW + '" height="' + VH + '" fill="#f4f4f4"/>');
    if (o.mount === 'ceiling') {
      var yC = Y(-o.gap);
      p.push('<rect width="' + VW + '" height="' + n(Math.max(0, yC)) + '" fill="#e4e4e4"/><line x1="0" x2="' + VW + '" y1="' + n(yC) + '" y2="' + n(yC) + '" stroke="#b3b3b3"/>');
      p.push('<text x="10" y="' + n(Math.max(14, yC - 6)) + '" fill="#6b6b6b" style="fill:#6b6b6b;font-size:11px">Ceiling</text>');
    }
    p.push('<rect y="' + n(yFloor) + '" width="' + VW + '" height="' + n(VH - yFloor) + '" fill="#dcdcdc"/><line x1="0" x2="' + VW + '" y1="' + n(yFloor) + '" y2="' + n(yFloor) + '" stroke="#9a9a9a"/>');
    p.push('<text x="10" y="' + n(yFloor + 15) + '" style="fill:#6b6b6b;font-size:11px">Floor</text>');
    var wx = X(-o.W / 2), ww = o.W * s, wh = o.H * s;
    p.push('<rect x="' + n(wx) + '" y="' + n(yF) + '" width="' + n(ww) + '" height="' + n(wh) + '" fill="url(#nfcDusk)" stroke="#fff" stroke-width="5"/>');
    p.push('<rect x="' + n(wx - 2.5) + '" y="' + n(yF - 2.5) + '" width="' + n(ww + 5) + '" height="' + n(wh + 5) + '" fill="none" stroke="#c2c2c2"/>');
    p.push('<line x1="' + n(X(0)) + '" x2="' + n(X(0)) + '" y1="' + n(yF) + '" y2="' + n(ySill) + '" stroke="#fff" stroke-width="3"/><line x1="' + n(wx) + '" x2="' + n(wx + ww) + '" y1="' + n(yF + wh / 2) + '" y2="' + n(yF + wh / 2) + '" stroke="#fff" stroke-width="3"/>');
    p.push('<rect x="' + n(X(-o.W / 2 - 2.5)) + '" y="' + n(ySill) + '" width="' + n((o.W + 5) * s) + '" height="' + n(Math.max(3, 1.6 * s)) + '" fill="#fff" stroke="#c2c2c2"/>');
    if (o.len === 'sill' || o.len === 'apron') p.push('<text x="' + n(wx + ww + 8) + '" y="' + n(ySill + 4) + '" style="fill:#6b6b6b;font-size:11px">Sill</text>');

    var hang = o.top === 'pinch' || o.top === 'hooks';
    var topY = hang ? yRod + 4 : yRod - 4;
    var yHem = Math.min(yRod + o.L * s, yFloor);
    var rodLine = '<line x1="' + n(X(-rod / 2)) + '" x2="' + n(X(rod / 2)) + '" y1="' + n(yRod) + '" y2="' + n(yRod) + '" stroke="#1c1c1c" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="' + n(X(-rod / 2) - 3) + '" cy="' + n(yRod) + '" r="4.2" fill="#1c1c1c"/><circle cx="' + n(X(rod / 2) + 3) + '" cy="' + n(yRod) + '" r="4.2" fill="#1c1c1c"/>';
    if (o.top === 'rodpocket') p.push(rodLine);
    var vis = o.panels === 2 ? Math.min(rod / 2, Math.max(o.ext + o.W * 0.2, rod * 0.25)) : Math.min(rod, Math.max(o.ext + o.W * 0.36, rod * 0.44));
    function panel(x1, x2) {
      var w = x2 - x1;
      p.push('<rect x="' + n(x1) + '" y="' + n(topY) + '" width="' + n(w) + '" height="' + n(Math.max(4, yHem - topY)) + '" fill="url(#nfcFold)" stroke="#000" stroke-opacity=".2"/>');
      if (o.len === 'puddle') p.push('<ellipse cx="' + n((x1 + x2) / 2) + '" cy="' + n(yFloor - 1) + '" rx="' + n(w / 2 + 5 * s) + '" ry="' + n(Math.max(3, 2.2 * s)) + '" fill="' + fab + '" fill-opacity="' + (sheer ? '.55' : '1') + '" stroke="#000" stroke-opacity=".15"/>');
      if (o.top === 'rodpocket') p.push('<rect x="' + n(x1) + '" y="' + n(topY) + '" width="' + n(w) + '" height="' + n(Math.max(5, 3 * s)) + '" fill="#000" fill-opacity=".14"/>');
      var k = Math.max(2, Math.round(w / Math.max(11, 7 * s)));
      for (var i = 0; i < k; i++) {
        var mx = x1 + (i + 0.5) * w / k;
        if (o.top === 'grommet') p.push('<circle cx="' + n(mx) + '" cy="' + n(yRod) + '" r="' + n(Math.max(2.2, 1.1 * s)) + '" fill="none" stroke="#1c1c1c" stroke-width="1.4"/>');
        else if (o.top === 'pinch') p.push('<path d="M' + n(mx - 3) + ' ' + n(topY) + ' L' + n(mx) + ' ' + n(topY + 9) + ' L' + n(mx + 3) + ' ' + n(topY) + '" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="1.2"/><circle cx="' + n(mx) + '" cy="' + n(yRod) + '" r="2.3" fill="none" stroke="#1c1c1c" stroke-width="1.2"/>');
        else if (o.top === 'hooks') p.push('<path d="M' + n(mx) + ' ' + n(yRod + 1) + ' v' + n(topY - yRod + 1) + '" stroke="#1c1c1c" stroke-width="1.2"/><circle cx="' + n(mx) + '" cy="' + n(yRod) + '" r="2.3" fill="none" stroke="#1c1c1c" stroke-width="1.2"/>');
      }
    }
    panel(X(-rod / 2), X(-rod / 2 + vis));
    if (o.panels === 2) panel(X(rod / 2 - vis), X(rod / 2));
    if (o.top !== 'rodpocket') p.push(rodLine);
    p.push('<text x="' + n(X(0)) + '" y="' + n(yRod - 11) + '" text-anchor="middle" stroke="#f4f4f4" stroke-width="4" paint-order="stroke">Rod about ' + inch(rod) + '</text>');
    p.push('<text x="' + n(X(0)) + '" y="' + n(ySill - 10) + '" text-anchor="middle" stroke="#1b2540" stroke-width="4" paint-order="stroke" stroke-linejoin="round" style="fill:#fff;font-size:11.5px">Window ' + fmt(o.W) + ' x ' + fmt(o.H) + ' in</text>');
    var xd = Math.min(VW - 64, X(rod / 2) + 18);
    dimV(p, xd, yRod, o.len === 'puddle' ? yFloor : yHem, inch(o.L), 'start');
    var xr = X(-rod / 2) - 16;
    if (xr > 44 && yF - yRod > 12) dimV(p, xr, yRod, yF, fmt(o.R) + ' in', 'end');
    svg.innerHTML = svg.querySelector('title') ? svg.querySelector('title').outerHTML + p.join('') : p.join('');
  }

  function initCurtains(root) {
    if (root.getAttribute('data-nfc-on')) return;
    root.setAttribute('data-nfc-on', '1');
    function g(k) { return root.querySelector('[name="nfc-' + k + '"]'); }
    var svg = root.querySelector('[data-nfc-svg]'), say = announcer(root), lines = [];
    function run() {
      syncChoices(root);
      var W = num(g('cw'), 48, 8, 400), H = num(g('ch'), 60, 8, 240);
      var mount = g('mount').value, ext = parseFloat(g('ext').value) || 6;
      var gap = num(g('gap'), 18, 2, 120), S = num(g('sf'), 30, 0, 120);
      var lenStyle = radio(root, 'nfc-len') || 'floor';
      var full = parseFloat(radio(root, 'nfc-full')) || 2;
      var panels = radio(root, 'nfc-panels') === '1' ? 1 : 2;
      var R = mount === 'ceiling' ? Math.max(1.5, gap - 1.5) : (parseFloat(mount) || 8);
      show(root, 'ceiling', mount === 'ceiling');
      show(root, 'floor', lenStyle === 'floor' || lenStyle === 'puddle');
      var rod = W + 2 * ext, total = rod * full, pw = Math.ceil(total / panels);
      var L = lenStyle === 'sill' ? R + H - 0.5 : lenStyle === 'apron' ? R + H + 4 : lenStyle === 'floor' ? R + H + S - 0.5 : R + H + S + 6;
      L = half(L);
      set(root, 'pw', inch(pw));
      set(root, 'pwnote', 'Flat width, ' + (panels === 2 ? 'each of a pair' : 'one single panel'));
      set(root, 'len', inch(L));
      set(root, 'lennote', 'Top of the rod to the hem');
      set(root, 'rod', inch(rod));
      set(root, 'rodnote', fmt(R) + ' in above the frame, ' + ext + ' in past each side');
      set(root, 'total', inch(total));
      set(root, 'totalnote', full + ' times the rod width');
      var w = [];
      if (pw > 120) w.push('Each panel would be about ' + inch(pw) + ' of flat fabric. Very wide panels are usually split into more panels so they hang and open well, and we will suggest the best split in your quote.');
      if (L > 132) w.push('Long drops like this are welcome. We confirm the fabric and length limits for your choice in your quote.');
      if (mount === 'ceiling' && gap < 4) w.push('With so little space above the frame, a ceiling track or an inside mount may suit better. Tell us in the form and we will advise.');
      warnings(root, w);
      var fabric = radio(root, 'nfc-fabric') || 'linen', top = radio(root, 'nfc-top') || 'pinch';
      drawCurtains(svg, { W: W, H: H, R: R, ext: ext, S: S, gap: gap, mount: mount, len: lenStyle, L: L, full: full, panels: panels, fabric: fabric, top: top });
      lines = [
        'Made to measure curtains',
        'Window: ' + fmt(W) + ' in wide x ' + fmt(H) + ' in tall (outside edges of the frame)',
        'Rod: ' + (mount === 'ceiling' ? 'just below the ceiling (' + fmt(gap) + ' in from the frame to the ceiling)' : fmt(R) + ' in above the frame') + ', ' + ext + ' in past each side, about ' + inch(rod) + ' long',
        'Length: ' + radioLabel(root, 'nfc-len') + (lenStyle === 'floor' || lenStyle === 'puddle' ? ' (sill to floor ' + fmt(S) + ' in)' : ''),
        'Fullness: ' + radioLabel(root, 'nfc-full'),
        'Panels: ' + panels + ', each about ' + inch(pw) + ' wide (flat)',
        'Finished length: about ' + inch(L) + ' from the top of the rod',
        'Fabric: ' + radioLabel(root, 'nfc-fabric'),
        'Top style: ' + radioLabel(root, 'nfc-top'),
        'Lining: ' + radioLabel(root, 'nfc-lining')
      ];
      var col = (g('color') && g('color').value || '').trim();
      if (col) lines.push('Color or pattern: ' + col.slice(0, 140));
      push(lines);
      say('Each panel about ' + inch(pw) + ' wide and ' + inch(L) + ' long. Rod about ' + inch(rod) + '.');
    }
    onChange(root, run);
    bindGo(root, function () { return lines; });
    run();
  }

  /* =====================================================================
     Chandeliers: sizing guide with a staircase mode.
     NF-CUSTOM3-V2: a detailed, glowing fixture (crystal, candle or ring style) drawn true to scale, a canvas that
     grows with the ceiling, labels sized for the screen, a two story foyer by default, three plain rules with worked
     examples plus the customer's own numbers, and a positive tip for tall spaces.
     ===================================================================== */
  var FINISH = { gold: '#c49a4c', brass: '#9c7230', chrome: '#9ea7b1', black: '#262626', unsure: '#c49a4c' };
  var FINISH_HI = { gold: '#f0d796', brass: '#d9ae66', chrome: '#f4f6f8', black: '#6a6a6a', unsure: '#f0d796' };
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rnd(i) { var x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }
  function pth(a) { return a.map(function (v) { return typeof v === 'number' ? n(v) : v; }).join(' '); }
  function beads(p, d, bw, gap) {
    p.push('<path d="' + d + '" fill="none" stroke="#8494a6" stroke-width="' + n(bw) + '" stroke-linecap="round" stroke-dasharray="0 ' + n(gap) + '"/>' +
      '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="' + n(bw * 0.55) + '" stroke-linecap="round" stroke-dasharray="0 ' + n(gap) + '"/>');
  }
  function candle(p, x, y, cw, chh, back, col) {
    var fy = y - chh - cw * 0.8;
    p.push('<g' + (back ? ' opacity=".5"' : '') + '>' +
      '<circle cx="' + n(x) + '" cy="' + n(fy) + '" r="' + n(Math.max(3.4, cw * 3.1)) + '" fill="url(#nfcCFlame)"/>' +
      '<ellipse cx="' + n(x) + '" cy="' + n(y) + '" rx="' + n(cw * 1.5) + '" ry="' + n(Math.max(0.8, cw * 0.42)) + '" fill="' + col + '"/>' +
      '<rect x="' + n(x - cw / 2) + '" y="' + n(y - chh) + '" width="' + n(cw) + '" height="' + n(chh) + '" rx="' + n(cw * 0.35) + '" fill="#fcfaf5" stroke="#d6cbb8" stroke-width=".5"/>' +
      '<ellipse cx="' + n(x) + '" cy="' + n(fy) + '" rx="' + n(Math.max(0.9, cw * 0.42)) + '" ry="' + n(Math.max(1.5, cw * 0.85)) + '" fill="#fffaf0"/></g>');
  }
  function drop(p, x, y, dl) {
    var dw = dl * 0.34;
    p.push('<path d="' + pth(['M', x, y, 'L', x + dw, y + dl * 0.58, 'L', x, y + dl, 'L', x - dw, y + dl * 0.58, 'Z']) + '" fill="#f4f7fa" stroke="#9aa9b8" stroke-width=".6"/>');
  }
  function sparkle(p, x, y, sz) {
    var a = sz * 0.22;
    p.push('<circle cx="' + n(x) + '" cy="' + n(y) + '" r="' + n(sz * 1.3) + '" fill="#fff4d6" fill-opacity=".55"/>' +
      '<path d="' + pth(['M', x, y - sz, 'L', x + a, y - a, 'L', x + sz, y, 'L', x + a, y + a, 'L', x, y + sz, 'L', x - a, y + a, 'L', x - sz, y, 'L', x - a, y - a, 'Z']) + '" fill="#fff"/>');
  }
  /* points along the front (or back) half of a ring seen from a little below */
  function ringPts(cx, y, w, ry, count, back) {
    var out = [];
    for (var j = 0; j < count; j++) {
      var th = Math.PI * (j + 0.5) / count;
      out.push({ x: cx - (w / 2) * Math.cos(th), y: y + (back ? -1 : 1) * ry * Math.sin(th) });
    }
    return out;
  }
  function ring(p, cx, y, w, ry, col, hi, mw) {
    p.push('<ellipse cx="' + n(cx) + '" cy="' + n(y) + '" rx="' + n(w / 2) + '" ry="' + n(ry) + '" fill="none" stroke="' + col + '" stroke-width="' + n(mw * 1.3) + '"/>' +
      '<ellipse cx="' + n(cx) + '" cy="' + n(y - mw * 0.25) + '" rx="' + n(w / 2) + '" ry="' + n(ry) + '" fill="none" stroke="' + hi + '" stroke-width="' + n(mw * 0.45) + '" stroke-opacity=".9"/>');
  }

  /* The fixture itself, top at yTop, wp wide and hp tall (px, already to scale) */
  function fixture(p, cx, yTop, wp, hp, o) {
    var col = FINISH[o.finish] || FINISH.gold, hi = FINISH_HI[o.finish] || FINISH_HI.gold;
    var T = clamp(o.tiers || 3, 1, 4), mw = clamp(wp * 0.016, 1.1, 3.2);
    var cw = clamp(wp * 0.03, 1.5, 4.2), chh = clamp(hp * 0.07, 4.5, 16);
    var yBot = yTop + hp, i, t;
    var bw = clamp(wp * 0.022, 1.3, 2.6), gap = bw * 1.55, dl = clamp(hp * 0.05, 3.5, 12);

    if (o.style === 'rings') {
      var R = T, rings = [];
      for (i = 0; i < R; i++) {
        var fr = R > 1 ? i / (R - 1) : 1, rw = wp * (R > 1 ? 1 - 0.46 * fr : 1);
        rings.push({ w: rw, ry: Math.max(2.5, rw * 0.11), f: fr });
      }
      var yA = yTop + rings[0].ry, yB = yBot - rings[R - 1].ry;
      if (R === 1) yA = yB;
      rings.forEach(function (r) { r.y = yA + (yB - yA) * r.f; });
      p.push('<g stroke="' + col + '" stroke-width=".8" opacity=".85">');
      rings.forEach(function (r) {
        [-0.34, 0, 0.34].forEach(function (u) { p.push('<line x1="' + n(cx + u * r.w) + '" x2="' + n(cx + u * r.w) + '" y1="' + n(yTop) + '" y2="' + n(r.y) + '"/>'); });
      });
      if (R === 1) [-0.34, 0, 0.34].forEach(function (u) { p.push('<line x1="' + n(cx) + '" x2="' + n(cx + u * wp) + '" y1="' + n(yTop) + '" y2="' + n(yB) + '"/>'); });
      p.push('</g>');
      rings.forEach(function (r) {
        p.push('<ellipse cx="' + n(cx) + '" cy="' + n(r.y) + '" rx="' + n(r.w / 2) + '" ry="' + n(r.ry) + '" fill="none" stroke="#ffd58c" stroke-opacity=".5" stroke-width="' + n(clamp(wp * 0.07, 4, 16)) + '"/>' +
          '<ellipse cx="' + n(cx) + '" cy="' + n(r.y) + '" rx="' + n(r.w / 2) + '" ry="' + n(r.ry) + '" fill="none" stroke="' + col + '" stroke-width="' + n(clamp(wp * 0.03, 2.2, 7)) + '"/>' +
          '<ellipse cx="' + n(cx) + '" cy="' + n(r.y + clamp(wp * 0.008, 0.6, 2)) + '" rx="' + n(r.w / 2) + '" ry="' + n(r.ry) + '" fill="none" stroke="#fff6df" stroke-width="' + n(clamp(wp * 0.013, 1, 3)) + '"/>');
      });
      return;
    }

    if (o.style === 'crystal') {
      var tall = hp / wp > 1.75;
      var crownY = yTop + hp * (tall ? 0.03 : 0.05), crownW = wp * (tall ? 0.34 : 0.3);
      var tiers = [], botY, botW, yW;
      if (!tall) {
        var yHigh = yTop + hp * 0.34, yLow = yTop + hp * (T > 1 ? 0.58 : 0.5);
        for (t = 0; t < T; t++) { var ft = T > 1 ? t / (T - 1) : 1; tiers.push({ y: yHigh + (yLow - yHigh) * ft, w: wp * (T > 1 ? 0.6 + 0.4 * ft : 1) }); }
        botY = yTop + hp * 0.86; botW = wp * 0.2; yW = yLow;
      } else {
        var K = clamp(Math.round(hp / wp * 2), 4, 9), y1 = yTop + hp * 0.15, y2 = yTop + hp * 0.8;
        for (t = 0; t < K; t++) { var fk = t / (K - 1); tiers.push({ y: y1 + (y2 - y1) * fk, w: wp * (1 - 0.78 * Math.pow(fk, 0.85)), plain: t >= T }); }
        botY = yTop + hp * 0.9; botW = wp * 0.1; yW = y1;
      }
      var L = cx - wp / 2, Rr = cx + wp / 2, mass;
      tiers.forEach(function (tr) {
        if (tr.plain) return;
        var ry = Math.max(1.6, tr.w * 0.075), nc = clamp(Math.round(tr.w / 11), 4, 14);
        ringPts(cx, tr.y, tr.w, ry, nc, true).forEach(function (q) { candle(p, q.x, q.y, cw * 0.85, chh * 0.85, true, col); });
      });
      if (!tall) {
        mass = pth(['M', cx - crownW / 2, crownY, 'Q', cx - wp * 0.3, crownY + (yW - crownY) * 0.5, L, yW,
          'C', L, yW + (botY - yW) * 0.55, cx - botW / 2 - wp * 0.06, botY, cx - botW / 2, botY,
          'L', cx + botW / 2, botY, 'C', cx + botW / 2 + wp * 0.06, botY, Rr, yW + (botY - yW) * 0.55, Rr, yW,
          'Q', cx + wp * 0.3, crownY + (yW - crownY) * 0.5, cx + crownW / 2, crownY, 'Z']);
      } else {
        mass = pth(['M', cx - crownW / 2, crownY, 'Q', cx - wp * 0.36, crownY + (yW - crownY) * 0.4, L, yW,
          'C', L + wp * 0.04, yW + (botY - yW) * 0.45, cx - wp * 0.08, botY - hp * 0.08, cx, botY,
          'C', cx + wp * 0.08, botY - hp * 0.08, Rr - wp * 0.04, yW + (botY - yW) * 0.45, Rr, yW,
          'Q', cx + wp * 0.36, crownY + (yW - crownY) * 0.4, cx + crownW / 2, crownY, 'Z']);
      }
      p.push('<path d="' + mass + '" fill="url(#nfcCMass)" stroke="#b7c2cc" stroke-width=".7" stroke-opacity=".7"/>');
      var Ns = clamp(Math.round(wp / 6), 7, 25);
      for (i = 0; i < Ns; i++) {
        var sx = Math.sin(-Math.PI / 2 + Math.PI * (i + 0.5) / Ns);
        var xc = cx + sx * crownW / 2, xw = cx + sx * wp / 2, xb = cx + sx * (tall ? wp * 0.05 : botW / 2);
        beads(p, pth(['M', xc, crownY, 'Q', xc + (xw - xc) * 0.25, crownY + (yW - crownY) * 0.55, xw, yW]), bw, gap);
        if (!tall) beads(p, pth(['M', xw, yW, 'C', xw, yW + (botY - yW) * 0.5, xb + (xw - xb) * 0.35, botY - (botY - yW) * 0.12, xb, botY]), bw, gap);
        else beads(p, pth(['M', xw, yW, 'C', xw, yW + (botY - yW) * 0.35, xb + (xw - xb) * 0.3, botY - (botY - yW) * 0.25, xb, botY]), bw, gap);
      }
      tiers.forEach(function (tr) {
        var ry = Math.max(1.6, tr.w * 0.075);
        ring(p, cx, tr.y, tr.w, ry, col, hi, mw);
        if (tr.plain) { beads(p, pth(['M', cx - tr.w / 2, tr.y, 'Q', cx, tr.y + ry * 2, cx + tr.w / 2, tr.y]), bw, gap); return; }
        var pts = ringPts(cx, tr.y, tr.w, ry, clamp(Math.round(tr.w / 11), 4, 14), false), sag = clamp(tr.w * 0.07, 2.5, 14), j;
        for (j = 0; j < pts.length - 1; j++) beads(p, pth(['M', pts[j].x, pts[j].y + 1, 'Q', (pts[j].x + pts[j + 1].x) / 2, (pts[j].y + pts[j + 1].y) / 2 + sag * 2, pts[j + 1].x, pts[j + 1].y + 1]), bw * 0.9, gap);
        pts.forEach(function (q) { drop(p, q.x, q.y + 1.5, dl); });
        pts.forEach(function (q) { candle(p, q.x, q.y - 0.5, cw, chh, false, col); });
      });
      /* crown, bottom ring and finial */
      var sp = clamp(hp * 0.04, 2.5, 9);
      p.push('<line x1="' + n(cx) + '" x2="' + n(cx) + '" y1="' + n(yTop) + '" y2="' + n(crownY) + '" stroke="' + col + '" stroke-width="' + n(mw * 1.4) + '"/>');
      for (i = 0; i < 7; i++) { var lx = cx - crownW / 2 + crownW * (i + 0.5) / 7; p.push('<path d="' + pth(['M', lx - sp * 0.3, crownY, 'L', lx, crownY - sp, 'L', lx + sp * 0.3, crownY, 'Z']) + '" fill="' + col + '"/>'); }
      ring(p, cx, crownY, crownW, Math.max(1.2, crownW * 0.14), col, hi, mw);
      if (!tall) ring(p, cx, botY, botW, Math.max(1, botW * 0.18), col, hi, mw * 0.8);
      var br = clamp(wp * 0.04, 1.8, 7), by = botY + (yBot - botY) * 0.4;
      p.push('<circle cx="' + n(cx) + '" cy="' + n(by) + '" r="' + n(br) + '" fill="#f4f7fa" stroke="#9aa9b8" stroke-width=".7"/>');
      drop(p, cx, by + br * 0.8, Math.max(2, yBot - by - br * 0.8));
      var ns = clamp(Math.round(wp * hp / 240), 6, 36);
      for (i = 0; i < ns; i++) {
        var yy = crownY + (botY - crownY) * (0.08 + 0.86 * rnd(i * 3 + 1)), ww;
        if (yy < yW) ww = crownW + (wp - crownW) * (yy - crownY) / Math.max(1, yW - crownY);
        else ww = wp + ((tall ? wp * 0.1 : botW) - wp) * Math.pow((yy - yW) / Math.max(1, botY - yW), tall ? 1 : 1.6);
        sparkle(p, cx + (rnd(i * 3 + 2) - 0.5) * ww * 0.85, yy, clamp(wp * 0.022, 1.4, 4.5) * (0.6 + rnd(i * 3 + 3) * 0.9));
      }
      return;
    }

    /* candle style: baluster column, S curved arms, bobeches, candles and a few crystal drops */
    var colW = clamp(wp * 0.035, 1.8, 6), armD = clamp(hp * 0.1, 4, 40);
    p.push('<line x1="' + n(cx) + '" x2="' + n(cx) + '" y1="' + n(yTop) + '" y2="' + n(yTop + hp * 0.9) + '" stroke="' + col + '" stroke-width="' + n(colW) + '"/>');
    [0.1, 0.24, 0.72, 0.84].forEach(function (f, q) {
      var ex = colW * (q % 2 ? 1.5 : 2.3), ey = clamp(hp * 0.03, 2, 9);
      p.push('<ellipse cx="' + n(cx) + '" cy="' + n(yTop + hp * f) + '" rx="' + n(ex) + '" ry="' + n(ey) + '" fill="' + col + '"/><ellipse cx="' + n(cx - ex * 0.3) + '" cy="' + n(yTop + hp * f - ey * 0.3) + '" rx="' + n(ex * 0.35) + '" ry="' + n(ey * 0.4) + '" fill="' + hi + '" fill-opacity=".8"/>');
    });
    var tc = [], yHi = yTop + hp * (T > 1 ? 0.3 : 0.5), yLo = yTop + hp * 0.58;
    for (t = 0; t < T; t++) { var fc = T > 1 ? t / (T - 1) : 1; tc.push({ y: yHi + (yLo - yHi) * fc, w: wp * (T > 1 ? 0.58 + 0.42 * fc : 1) }); }
    function arm(q, ry0, back) {
      p.push('<path d="' + pth(['M', cx, ry0 + armD * 0.9, 'C', cx + (q.x - cx) * 0.35, ry0 + armD * 1.5, q.x, q.y + armD * 1.1, q.x, q.y]) + '" fill="none" stroke="' + col + '" stroke-width="' + n(mw * 1.1) + '"' + (back ? ' opacity=".5"' : '') + '/>');
    }
    tc.forEach(function (tr) {
      var ry = Math.max(1.6, tr.w * 0.075), nc = clamp(Math.round(tr.w / 12), 4, 12);
      ringPts(cx, tr.y, tr.w, ry, nc, true).forEach(function (q) { arm(q, tr.y, true); candle(p, q.x, q.y, cw * 0.85, chh * 0.85, true, col); });
    });
    tc.forEach(function (tr) {
      var ry = Math.max(1.6, tr.w * 0.075), nc = clamp(Math.round(tr.w / 12), 4, 12);
      ringPts(cx, tr.y, tr.w, ry, nc, false).forEach(function (q) {
        arm(q, tr.y, false);
        if (wp > 40) drop(p, q.x, q.y + cw * 0.5, dl);
        candle(p, q.x, q.y, cw, chh, false, col);
      });
    });
    var fb = yTop + hp * 0.9;
    p.push('<path d="' + pth(['M', cx - colW * 1.6, fb, 'Q', cx, fb - colW, cx + colW * 1.6, fb, 'L', cx, yBot, 'Z']) + '" fill="' + col + '"/>');
  }

  function drawChand(svg, o) {
    var VW = 600, bw0 = svg.getBoundingClientRect().width || VW, narrow = bw0 < 560;
    var VH = Math.round(VW * (narrow ? clamp(o.ceilIn / 185, 0.8, 1.32) : clamp(o.ceilIn / 210, 0.7, 1.08)));
    svg.setAttribute('viewBox', '0 0 ' + VW + ' ' + VH);
    var bx = svg.getBoundingClientRect(), sc = bx.width > 0 ? Math.min(bx.width / VW, bx.height > 0 ? bx.height / VH : 9) : 1;
    var k = clamp(1 / (sc || 1), 0.95, 2.4), fs = 12.5 * k, hw = 4 * k;
    o.k = k;
    var pt = 16, pb = 24 + 6 * k, p = [];
    var s = (VH - pt - pb) / o.ceilIn;
    s = Math.min(s, (VW - 200 * k) / Math.max(o.dia, 1));
    if (o.mode === 'table') s = Math.min(s, (VW - 150 * k) / (o.tw + 44));
    var y0 = pt + ((VH - pt - pb) - o.ceilIn * s) / 2;
    function Y(i) { return y0 + i * s; }
    function est(t) { return t.length * fs * 0.56; }
    function label(x, y, anchor, t, muted) {
      p.push('<text x="' + n(x) + '" y="' + n(y) + '" text-anchor="' + anchor + '" style="font-size:' + n(muted ? fs * 0.9 : fs) + 'px' + (muted ? ';fill:#6b6b6b' : '') + '" stroke="#f7f7f7" stroke-opacity=".92" stroke-width="' + n(hw) + '" paint-order="stroke" stroke-linejoin="round">' + t + '</text>');
    }
    function dv(x, y1, y2, t, side) {
      if (Math.abs(y2 - y1) < 6) return;
      var e = 4 * k;
      p.push('<g stroke="#1c1c1c" stroke-width="' + n(Math.max(1, k * 0.9)) + '"><line x1="' + n(x) + '" x2="' + n(x) + '" y1="' + n(y1) + '" y2="' + n(y2) + '"/><line x1="' + n(x - e) + '" x2="' + n(x + e) + '" y1="' + n(y1) + '" y2="' + n(y1) + '"/><line x1="' + n(x - e) + '" x2="' + n(x + e) + '" y1="' + n(y2) + '" y2="' + n(y2) + '"/></g>');
      label(side === 'end' ? x - 7 * k : x + 7 * k, (y1 + y2) / 2 + fs * 0.35, side === 'end' ? 'end' : 'start', t);
    }
    function dh(x1, x2, y, t) {
      if (Math.abs(x2 - x1) < 6) return;
      var e = 4 * k;
      p.push('<g stroke="#1c1c1c" stroke-width="' + n(Math.max(1, k * 0.9)) + '"><line x1="' + n(x1) + '" x2="' + n(x2) + '" y1="' + n(y) + '" y2="' + n(y) + '"/><line x1="' + n(x1) + '" x2="' + n(x1) + '" y1="' + n(y - e) + '" y2="' + n(y + e) + '"/><line x1="' + n(x2) + '" x2="' + n(x2) + '" y1="' + n(y - e) + '" y2="' + n(y + e) + '"/></g>');
      label((x1 + x2) / 2, y + fs * 1.25, 'middle', t);
    }
    var yFl = Y(o.ceilIn), wp = o.dia * s, hp = o.h * s, col = FINISH[o.finish] || FINISH.gold;
    var cx = clamp(VW * (o.mode === 'foyer' || o.mode === 'stair' ? 0.57 : 0.5), wp / 2 + 100 * k, VW - wp / 2 - 96 * k);
    var yTop = Y(o.drop), yBot = yTop + hp;

    p.push('<defs>' +
      '<linearGradient id="nfcCWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fcfcfc"/><stop offset="1" stop-color="#efefef"/></linearGradient>' +
      '<radialGradient id="nfcCGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd27d" stop-opacity=".74"/><stop offset=".42" stop-color="#ffd27d" stop-opacity=".3"/><stop offset="1" stop-color="#ffd27d" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="nfcCFlame" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2c9" stop-opacity=".95"/><stop offset=".45" stop-color="#ffc861" stop-opacity=".5"/><stop offset="1" stop-color="#ffc861" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="nfcCMass" cx=".5" cy=".42" r=".62"><stop offset="0" stop-color="#fffaf0"/><stop offset=".55" stop-color="#fcefd0" stop-opacity=".92"/><stop offset="1" stop-color="#e6ecf1" stop-opacity=".9"/></radialGradient>' +
      '<clipPath id="nfcCRoom"><rect y="' + n(y0) + '" width="' + VW + '" height="' + n(yFl - y0) + '"/></clipPath>' +
      '</defs>');
    p.push('<rect width="' + VW + '" height="' + VH + '" fill="#f7f7f7"/><rect y="' + n(y0) + '" width="' + VW + '" height="' + n(yFl - y0) + '" fill="url(#nfcCWall)"/>');
    p.push('<rect width="' + VW + '" height="' + n(y0) + '" fill="#e4e4e4"/><line x1="0" x2="' + VW + '" y1="' + n(y0) + '" y2="' + n(y0) + '" stroke="#b1b1b1"/>');

    /* a tall arched window behind the fixture in a tall foyer */
    if (o.mode === 'foyer' && o.ceilIn >= 168) {
      var ww = Math.min(60 * s, VW * 0.3), wx = cx - ww / 2, wt = Y(30), wb = Y(o.ceilIn - 30), ar = ww / 2;
      p.push('<path d="' + pth(['M', wx, wb, 'L', wx, wt + ar, 'A', ar, ar, 0, 0, 1, wx + ww, wt + ar, 'L', wx + ww, wb, 'Z']) + '" fill="#eceef0" stroke="#d2d5d8" stroke-width="1.2"/>');
      var mu = '<g stroke="#dcdfe2" stroke-width=".9"><line x1="' + n(cx) + '" x2="' + n(cx) + '" y1="' + n(wt) + '" y2="' + n(wb) + '"/>';
      for (var my = wt + ar; my < wb - 4; my += Math.max(14, 26 * s)) mu += '<line x1="' + n(wx) + '" x2="' + n(wx + ww) + '" y1="' + n(my) + '" y2="' + n(my) + '"/>';
      p.push(mu + '</g>');
    }

    /* upper floors with a balustrade, and stairs in staircase mode */
    var edge = Math.max(44, cx - wp / 2 - Math.max(100 * k, 40 * s));
    if ((o.mode === 'foyer' || o.mode === 'stair') && o.floors > 1) {
      for (var q = 1; q < o.floors; q++) {
        var yL = Y(o.ceilIn - q * o.fh), slab = Math.max(5, 10 * s), railH = 36 * s;
        if (o.mode === 'stair') {
          var yB0 = Y(o.ceilIn - (q - 1) * o.fh), steps = clamp(Math.round(o.fh / 7.5), 10, 18), run = Math.min(VW - 8 - edge, o.fh * s * 1.3);
          var rise = (yB0 - yL) / steps, tread = run / steps, d = 'M' + n(edge + run) + ' ' + n(yB0);
          for (var st = 0; st < steps; st++) d += ' v' + n(-rise) + ' h' + n(-tread);
          p.push('<path d="' + d + ' L' + n(edge) + ' ' + n(yL + slab) + ' L' + n(edge + run) + ' ' + n(yB0) + ' Z" fill="#e0e0e0" stroke="#b1b1b1"/>');
          var ba = '<g stroke="#c4c4c4" stroke-width="' + n(Math.max(1, 1.1 * s)) + '">';
          for (st = 1; st < steps; st += 1) { var nx = edge + run - st * tread + tread * 0.5, ny = yB0 - st * rise; ba += '<line x1="' + n(nx) + '" x2="' + n(nx) + '" y1="' + n(ny) + '" y2="' + n(ny - 34 * s) + '"/>'; }
          p.push(ba + '</g><line x1="' + n(edge + run - tread * 0.5) + '" x2="' + n(edge) + '" y1="' + n(yB0 - rise - 34 * s) + '" y2="' + n(yL - 34 * s) + '" stroke="#999" stroke-width="' + n(Math.max(2, 2.2 * s)) + '" stroke-linecap="round"/>');
        }
        p.push('<rect x="0" y="' + n(yL) + '" width="' + n(edge) + '" height="' + n(slab) + '" fill="#d4d4d4"/>');
        var bl = '<g stroke="#c2c2c2" stroke-width="' + n(Math.max(1, 1.1 * s)) + '">';
        for (var b = edge - 4; b > 2; b -= Math.max(6, 5 * s)) bl += '<line x1="' + n(b) + '" x2="' + n(b) + '" y1="' + n(yL - railH) + '" y2="' + n(yL) + '"/>';
        p.push(bl + '</g><rect x="0" y="' + n(yL - railH - 2) + '" width="' + n(edge + 2) + '" height="' + n(Math.max(3, 2.5 * s)) + '" fill="#999"/><rect x="' + n(edge - Math.max(4, 4 * s)) + '" y="' + n(yL - railH - 4) + '" width="' + n(Math.max(4, 4 * s)) + '" height="' + n(railH + 4) + '" fill="#a5a5a5"/>');
        label(8, yL - railH - 8 * k, 'start', 'Floor ' + (q + 1), true);
      }
    } else if (o.mode === 'stair') {
      var st1 = 7, run1 = Math.min(VW - 8 - edge, 66 * s), r1 = (48 * s) / st1, t1 = run1 / st1, d1 = 'M' + n(edge + run1) + ' ' + n(yFl);
      for (var z = 0; z < st1; z++) d1 += ' v' + n(-r1) + ' h' + n(-t1);
      p.push('<path d="' + d1 + ' L' + n(edge) + ' ' + n(yFl) + ' Z" fill="#e0e0e0" stroke="#b1b1b1"/>');
    }

    /* floor, and a table with chairs in table mode */
    p.push('<rect y="' + n(yFl) + '" width="' + VW + '" height="' + n(VH - yFl) + '" fill="#e2e2e2"/><line x1="0" x2="' + VW + '" y1="' + n(yFl) + '" y2="' + n(yFl) + '" stroke="#a6a6a6"/>');
    var target = yFl, px;
    if (o.mode === 'table') {
      var tt = Y(o.ceilIn - 30), tx = cx - o.tw / 2 * s, tws = o.tw * s;
      target = tt;
      [[tx - 22 * s, 1], [tx + tws + 22 * s, -1]].forEach(function (c) {
        var cxh = c[0], dir = c[1];
        p.push('<g fill="#d0d0d0"><rect x="' + n(cxh - 8 * s) + '" y="' + n(Y(o.ceilIn - 18)) + '" width="' + n(16 * s) + '" height="' + n(Math.max(2, 2 * s)) + '"/>' +
          '<rect x="' + n(dir > 0 ? cxh - 8 * s : cxh + 6 * s) + '" y="' + n(Y(o.ceilIn - 36)) + '" width="' + n(Math.max(2, 2 * s)) + '" height="' + n(36 * s) + '"/>' +
          '<rect x="' + n(dir > 0 ? cxh + 6 * s : cxh - 8 * s) + '" y="' + n(Y(o.ceilIn - 18)) + '" width="' + n(Math.max(2, 2 * s)) + '" height="' + n(18 * s) + '"/></g>');
      });
      p.push('<rect x="' + n(tx) + '" y="' + n(tt) + '" width="' + n(tws) + '" height="' + n(Math.max(3, 1.8 * s)) + '" rx="1" fill="#8a8a8a"/>' +
        '<g stroke="#8a8a8a" stroke-width="' + n(Math.max(2, 2.2 * s)) + '"><line x1="' + n(tx + 5 * s) + '" x2="' + n(tx + 5 * s) + '" y1="' + n(tt) + '" y2="' + n(yFl) + '"/><line x1="' + n(tx + tws - 5 * s) + '" x2="' + n(tx + tws - 5 * s) + '" y1="' + n(tt) + '" y2="' + n(yFl) + '"/></g>');
      px = tx - 48 * s;
    } else if (o.mode === 'stair') {
      px = Math.max(20 * k, edge - 34 * s);
    } else {
      px = cx - wp / 2 - 24 * s;
    }

    /* the 5 ft 9 in person for scale */
    var ph = 69 * s, u = ph / 69;
    p.push('<g fill="#c8c8c8"><circle cx="' + n(px) + '" cy="' + n(yFl - ph + 4.6 * u) + '" r="' + n(4.4 * u) + '"/><path d="' + pth(['M', px - 8.4 * u, yFl - ph + 12 * u, 'Q', px, yFl - ph + 8.6 * u, px + 8.4 * u, yFl - ph + 12 * u, 'L', px + 7 * u, yFl - ph + 37 * u, 'L', px + 5 * u, yFl, 'L', px + 0.9 * u, yFl, 'L', px, yFl - ph + 41 * u, 'L', px - 0.9 * u, yFl, 'L', px - 5 * u, yFl, 'L', px - 7 * u, yFl - ph + 37 * u, 'Z']) + '"/></g>');
    var plx = px - 11 * u - 4 * k, pa = 'end';
    if (plx - est('5 ft 9 in') < 2) { plx = px + 11 * u + 4 * k; pa = 'start'; }
    label(plx, yFl - ph * 0.62, pa, '5 ft 9 in', true);

    /* warm light around the fixture, kept inside the room */
    p.push('<g clip-path="url(#nfcCRoom)"><ellipse cx="' + n(cx) + '" cy="' + n(yTop + hp * 0.5) + '" rx="' + n(wp * 2.4 + 20) + '" ry="' + n(hp * 1.7 + 20) + '" fill="url(#nfcCGlow)" opacity=".45"/>' +
      '<ellipse cx="' + n(cx) + '" cy="' + n(yTop + hp * 0.5) + '" rx="' + n(wp * 1.2 + 10) + '" ry="' + n(hp * 0.95 + 10) + '" fill="url(#nfcCGlow)"/></g>');

    /* canopy and chain (cables for rings) */
    var capW = Math.max(12, wp * 0.18);
    p.push('<rect x="' + n(cx - capW / 2) + '" y="' + n(y0) + '" width="' + n(capW) + '" height="' + n(Math.max(3.5, 3 * s)) + '" rx="1.5" fill="' + col + '"/>');
    if (yTop - y0 > 5) {
      if (o.style === 'rings') {
        p.push('<g stroke="' + col + '" stroke-width=".8" opacity=".85">');
        [-0.34, 0, 0.34].forEach(function (uu) { p.push('<line x1="' + n(cx + uu * capW) + '" x2="' + n(cx + uu * wp) + '" y1="' + n(y0 + 3) + '" y2="' + n(yTop) + '"/>'); });
        p.push('</g>');
      } else {
        var lk = clamp(3.2 * s, 3.5, 9), cwid = clamp(1.4 * s, 1.8, 3.6);
        p.push('<line x1="' + n(cx) + '" x2="' + n(cx) + '" y1="' + n(y0 + 3) + '" y2="' + n(yTop) + '" stroke="' + col + '" stroke-width="' + n(cwid) + '" stroke-dasharray="' + n(lk * 0.62) + ' ' + n(lk * 0.38) + '"/>' +
          '<line x1="' + n(cx) + '" x2="' + n(cx) + '" y1="' + n(y0 + 3) + '" y2="' + n(yTop) + '" stroke="' + (FINISH_HI[o.finish] || FINISH_HI.gold) + '" stroke-width="' + n(cwid * 0.35) + '" stroke-dasharray="' + n(lk * 0.62) + ' ' + n(lk * 0.38) + '"/>');
      }
    }
    fixture(p, cx, yTop, wp, hp, o);

    /* dimensions */
    var wl = fmt(o.dia) + ' in wide';
    dh(cx - wp / 2, cx + wp / 2, yBot + 10 * k, wl);
    dv(cx - wp / 2 - 12 * k, yTop, yBot, fmt(o.h) + ' in tall', 'end');
    var dropT = 'drop ' + (o.drop >= 24 ? ftin(o.drop) : inch(o.drop));
    if (yTop - y0 > 26 * k) dv(cx + Math.max(capW / 2 + 8, 12 * k), y0 + 4, yTop, dropT, 'start');
    var bt = o.mode === 'table' ? inch(o.bottom - 30) : ftin(o.bottom);
    var xb = Math.min(VW - est(bt) - 12 * k, cx + Math.max(wp / 2 + 18 * k, est(wl) / 2 + 10 * k));
    dv(xb, yBot, target, bt, 'start');
    svg.innerHTML = (svg.querySelector('title') ? svg.querySelector('title').outerHTML : '') + p.join('');
  }

  function initChand(root) {
    if (root.getAttribute('data-nfc-on')) return;
    root.setAttribute('data-nfc-on', '1');
    function g(k) { return root.querySelector('[name="nfc-' + k + '"]'); }
    var svg = root.querySelector('[data-nfc-svg]'), say = announcer(root), lines = [], lastO = null;
    var tipEl = root.querySelector('[data-out-tip]');
    function run() {
      syncChoices(root);
      var mode = radio(root, 'nfc-mode') || 'foyer';
      $$('[data-mode]', root).forEach(function (el) { el.hidden = el.getAttribute('data-mode').split(' ').indexOf(mode) < 0; });
      $$('[data-l-foyer]', root).forEach(function (el) { el.textContent = mode === 'stair' ? el.getAttribute('data-l-stair') : el.getAttribute('data-l-foyer'); });
      var o = { mode: mode, finish: radio(root, 'nfc-finish') || 'gold', tiers: parseInt(radio(root, 'nfc-tiers'), 10) || 3, style: radio(root, 'nfc-style') || 'crystal' };
      if (o.style === 'unsure') o.style = 'crystal';
      var w = [], tip = '', dia, lo, hi, hLo, hHi, bottom, bottomTxt, spaceTxt, ceilFt, y1 = '', y2 = '', y3 = '', place = 'ceiling';
      if (mode === 'room' || mode === 'table') {
        ceilFt = num(g('ceil'), 9, 7, 30);
        o.ceilIn = ceilFt * 12;
        if (mode === 'room') {
          var rl = num(g('rl'), 16, 4, 80), rw = num(g('rw'), 14, 4, 80);
          dia = rl + rw; lo = dia - 2; hi = dia + 2;
          y1 = 'Yours: ' + fmt(rl) + ' + ' + fmt(rw) + ' = ' + fmt(dia) + ', so about ' + inch(Math.round(dia)) + '.';
          if (ceilFt >= 10) { hi = Math.max(hi, Math.round(dia * 1.15)); tip = 'With a ' + fmt(ceilFt) + ' ft ceiling you can go bigger. Up to about ' + hi + ' in across still looks in proportion.'; }
          bottom = 84;
          spaceTxt = 'Room: ' + fmt(rl) + ' x ' + fmt(rw) + ' ft, ' + fmt(ceilFt) + ' ft ceiling';
          bottomTxt = ftin(bottom) + ' above the floor';
        } else {
          var tw = num(g('tw'), 42, 20, 80), tl = num(g('tl'), 72, 24, 240);
          o.tw = tw;
          lo = tw * 0.5; hi = tw * 2 / 3; dia = (lo + hi) / 2;
          y2 = 'Yours: a ' + fmt(tw) + ' in table, so ' + Math.round(lo) + ' to ' + Math.round(hi) + ' in.';
          var clear = 33 + Math.max(0, ceilFt - 8) * 3;
          bottom = 30 + clear;
          spaceTxt = 'Dining table: ' + fmt(tw) + ' in wide x ' + fmt(tl) + ' in long, ' + fmt(ceilFt) + ' ft ceiling';
          bottomTxt = Math.round(clear) + ' in above the tabletop';
          if (tl >= tw * 1.8) w.push('For a long table, two matching chandeliers or a <a href="/collections/linear-suspension">linear suspension</a> spread the light more evenly. You can ask for either in your quote.');
        }
        hLo = ceilFt * 2.5; hHi = ceilFt * 3;
      } else {
        var floors = parseInt(g('floors').value, 10) || 2, fh = num(g('fh'), 10, 7, 20);
        var fl = num(g('fl'), 18, 3, 80), fw = num(g('fw'), 16, 3, 80);
        ceilFt = floors * fh;
        o.ceilIn = ceilFt * 12; o.floors = floors; o.fh = fh * 12;
        var story = floors === 3 ? 'three story' : 'two story';
        if (mode === 'foyer') {
          place = 'foyer';
          dia = fl + fw; lo = dia - 2; hi = floors > 1 ? Math.round(dia * 1.2) : dia + 2; hLo = ceilFt * 2.5; hHi = ceilFt * 3;
          y1 = 'Yours: ' + fmt(fl) + ' + ' + fmt(fw) + ' = ' + fmt(dia) + ', so about ' + inch(Math.round(dia)) + '.';
          if (floors > 1) tip = 'A ' + story + ' foyer can carry a statement piece. Up to about ' + hi + ' in across still looks in proportion here, because it is seen from both floors.';
        } else {
          place = 'stairwell';
          var cap = Math.max(14, Math.min(fl, fw) * 12 - 24), rule = fl + fw;
          dia = Math.min(rule, cap); lo = Math.min(dia, Math.max(12, dia - 4)); hi = Math.min(cap, floors > 1 ? Math.round(dia * 1.2) : dia + 2);
          hLo = ceilFt * 3; hHi = ceilFt * 4.5;
          y1 = 'Yours: ' + fmt(fl) + ' + ' + fmt(fw) + ' = ' + fmt(rule) + (rule > cap ? ', kept to ' + Math.round(cap) + ' in so it clears the walls and railing.' : ', so about ' + inch(Math.round(dia)) + '.');
        }
        var bsel = g('bottom').value;
        show(root, 'custombottom', bsel === 'custom');
        if (bsel === 'level' && floors > 1) {
          bottom = (floors - 1) * fh * 12;
          bottomTxt = 'level with the ' + (floors === 2 ? 'upper floor' : 'top landing') + ', ' + ftin(bottom) + ' above the floor';
        } else if (bsel === 'custom') {
          bottom = num(g('bft'), 9, 7, 60) * 12;
          bottomTxt = ftin(bottom) + ' above the floor';
        } else {
          bottom = 84;
          bottomTxt = '7 ft above the ' + (mode === 'stair' ? 'floor or stair below' : 'floor');
          if (bsel === 'level') w.push('With one floor there is no upper level to line up with, so the guide uses 7 ft above the floor.');
        }
        spaceTxt = (mode === 'foyer' ? 'Foyer: ' : 'Staircase: ') + floors + (floors > 1 ? ' floors' : ' floor') + ' of ' + fmt(fh) + ' ft (' + fmt(ceilFt) + ' ft to the ceiling), ' + (mode === 'foyer' ? 'entry ' : 'stairwell opening ') + fmt(fl) + ' x ' + fmt(fw) + ' ft';
      }
      y3 = mode === 'stair'
        ? 'Yours: a ' + fmt(ceilFt) + ' ft stairwell. Cascades there can run taller, about 3 to 4.5 in per foot, so ' + Math.round(hLo) + ' to ' + Math.round(hHi) + ' in.'
        : 'Yours: a ' + fmt(ceilFt) + ' ft ' + place + ', so ' + Math.round(hLo) + ' to ' + Math.round(hHi) + ' in.';
      dia = Math.round(dia); lo = Math.round(lo); hi = Math.round(hi);
      var space = o.ceilIn - bottom, maxFix = space - 6;
      if (space < 18) {
        w.push('At that height there is little room for a hanging fixture. A <a href="/collections/flush-mount-lighting">flush</a> or <a href="/collections/semi-flush-mount-lighting">semi flush</a> light may fit better, or tell us about the space in the form.');
        maxFix = Math.max(8, space - 2);
      }
      if (hHi > maxFix) {
        hHi = Math.max(8, maxFix);
        if (hLo > hHi) hLo = hHi * 0.8;
        if (space >= 18) w.push('With the bottom ' + bottomTxt + ', a fixture up to about ' + inch(Math.round(hHi)) + ' tall fits best.');
      }
      if (hLo >= hHi) hLo = hHi * 0.8;
      hLo = Math.round(hLo); hHi = Math.round(hHi);
      if (mode === 'stair' && o.floors > 1) tip = 'An open stairwell suits a tall cascade. A fixture up to about ' + hHi + ' in tall' + (hi > dia ? ' and ' + hi + ' in across' : '') + ' looks right in this space.';
      var h = Math.round((hLo + hHi) / 2), drop = Math.max(0, Math.round(space - h));
      o.dia = dia; o.h = h; o.drop = drop; o.bottom = bottom;
      set(root, 'dia', 'About ' + inch(dia));
      set(root, 'dianote', lo + ' to ' + hi + ' in across');
      set(root, 'h', hLo + ' to ' + hHi + ' in');
      set(root, 'hnote', 'Top of the fixture to the bottom');
      set(root, 'drop', drop >= 24 ? ftin(drop) : inch(drop));
      set(root, 'dropnote', 'Chain or cord from the ceiling to the fixture');
      set(root, 'bottom', mode === 'table' ? Math.round(bottom - 30) + ' in' : ftin(bottom));
      set(root, 'bottomnote', mode === 'table' ? 'Above the tabletop' : 'Above the floor');
      set(root, 'y1', y1); set(root, 'y2', y2); set(root, 'y3', y3);
      $$('[data-rule]', root).forEach(function (li) { var y = li.querySelector('[data-out]'); li.classList.toggle('is-off', !(y && y.textContent)); });
      if (tipEl) { tipEl.textContent = tip; tipEl.hidden = !tip; }
      warnings(root, w);
      lastO = o;
      drawChand(svg, o);
      lines = [
        'Custom size chandelier',
        spaceTxt,
        'Bottom of the fixture: ' + bottomTxt,
        'Suggested diameter: about ' + dia + ' in (' + lo + ' to ' + hi + ' in)',
        'Suggested fixture height: ' + hLo + ' to ' + hHi + ' in',
        'Drop length: about ' + len(drop) + ' from the ceiling to the top of the fixture',
        'Finish: ' + radioLabel(root, 'nfc-finish'),
        'Tiers: ' + radioLabel(root, 'nfc-tiers'),
        'Style: ' + radioLabel(root, 'nfc-style')
      ];
      push(lines);
      say('Diameter about ' + dia + ' inches, fixture height ' + hLo + ' to ' + hHi + ' inches, drop about ' + len(drop) + '.');
    }
    onChange(root, run);
    bindGo(root, function () { return lines; });
    if (window.ResizeObserver && svg) {
      var lastW = 0;
      new ResizeObserver(function () {
        var wNow = svg.getBoundingClientRect().width;
        if (Math.abs(wNow - lastW) > 8) { lastW = wNow; if (lastO) drawChand(svg, lastO); }
      }).observe(svg);
    }
    run();
  }

  /* =====================================================================
     Name signs: live neon preview
     ===================================================================== */
  var COLORS = {
    warm: ['Warm white', '#fff4e2', '#ffb957'], cool: ['Cool white', '#f6fbff', '#bfe3ff'], pink: ['Pink', '#ffe6f4', '#ff4fae'],
    red: ['Red', '#ffe3e3', '#ff2d3f'], orange: ['Orange', '#fff0e0', '#ff7a1c'], yellow: ['Yellow', '#fffbe0', '#ffd21f'],
    green: ['Green', '#e9ffea', '#2fe05a'], ice: ['Ice blue', '#e8fcff', '#35d4ff'], blue: ['Blue', '#e6ecff', '#3a62ff'], purple: ['Purple', '#f3e8ff', '#a64dff']
  };
  var WALL = 110; /* inches of wall shown across the preview */
  var GFONTS = 'https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=Dancing+Script:wght@500&family=Pacifico&family=Righteous&family=Sacramento&family=Tilt+Neon&display=swap';
  function loadFonts(cb) {
    if (document.getElementById('nfc-gfonts')) return;
    var pc = document.createElement('link'); pc.rel = 'preconnect'; pc.href = 'https://fonts.gstatic.com'; pc.crossOrigin = 'anonymous';
    var l = document.createElement('link'); l.id = 'nfc-gfonts'; l.rel = 'stylesheet'; l.href = GFONTS;
    l.onload = function () { cb(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(cb); };
    document.head.appendChild(pc); document.head.appendChild(l);
    if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', cb);
  }

  /* Ink bounds of the lettering at 100px (canvas metrics), so the backing hugs the letters rather than the CSS
     line box. Script fonts have tall line boxes; without this a 30 in "Ella" read as 19 in tall. Returns the ink
     width and height plus the shift that centers the ink in the element (line-height 1.14 as in nf-custom.css). */
  var inkCtx = null;
  function inkBox(text, family) {
    if (!inkCtx) { var cv = document.createElement('canvas'); inkCtx = cv.getContext && cv.getContext('2d'); }
    var lines = String(text).split('\n'), L = 114;
    if (!inkCtx) return { w: 60 * Math.max(1, text.length), h: L * lines.length, offX: 0, offY: 0 };
    inkCtx.font = '400 100px ' + (family || 'sans-serif');
    var maxW = 1, offX = 0, asc = 0, desc = 0, fa = 0, fd = 0;
    lines.forEach(function (ln) {
      var m = inkCtx.measureText(ln || ' ');
      var left = m.actualBoundingBoxLeft || 0, right = m.actualBoundingBoxRight || m.width;
      var w = left + right;
      if (w > maxW) { maxW = w; offX = m.width / 2 - (right - left) / 2; }
      asc = Math.max(asc, m.actualBoundingBoxAscent || 72);
      desc = Math.max(desc, m.actualBoundingBoxDescent || 18);
      fa = m.fontBoundingBoxAscent || fa || 92; fd = m.fontBoundingBoxDescent || fd || 24;
    });
    var nl = lines.length, b1 = (L - (fa + fd)) / 2 + fa, bN = b1 + (nl - 1) * L;
    var top = b1 - asc, bot = bN + desc;
    return { w: maxW, h: bot - top, offX: offX, offY: (nl * L) / 2 - (top + bot) / 2 };
  }

  function initSign(root) {
    if (root.getAttribute('data-nfc-on')) return;
    root.setAttribute('data-nfc-on', '1');
    function g(k) { return root.querySelector('[name="nfc-' + k + '"]'); }
    var stage = root.querySelector('[data-nfc-stage]'), sign = root.querySelector('[data-nfc-sign]'), neon = root.querySelector('[data-nfc-neon]');
    var logo = root.querySelector('[data-nfc-logo]'), ref = root.querySelector('[data-nfc-ref]'), cap = root.querySelector('[data-out="cap"]');
    var glowBtn = root.querySelector('[data-nfc-glow]'), wallBtn = root.querySelector('[data-nfc-wall]'), file = root.querySelector('[data-nfc-file]');
    var say = announcer(root), lines = [], lastColor = null, logoURL = null, logoName = '', isLogo = false, dims = { w: 30, h: 10 };

    function fit() {
      var sw = stage.clientWidth, sh = stage.clientHeight;
      if (!sw || !sh) return;
      var size = num(g('size'), 30, 12, 72), ppi = sw / WALL;
      var signW = size * ppi, pad = Math.max(8, signW * 0.07), contentH, fs = 0;
      var useLogo = isLogo && logoURL && logo.naturalWidth;
      if (useLogo) {
        contentH = (signW - 2 * pad) * (logo.naturalHeight / logo.naturalWidth);
      } else {
        var ib = inkBox(neon.textContent, neon.style.fontFamily);
        fs = 100 * (signW - 2 * pad) / ib.w;
        contentH = ib.h * fs / 100;
      }
      var signH = contentH + 2 * pad;
      var k = Math.min(1, (sh * 0.64) / signH);
      signW *= k; signH *= k; pad *= k; contentH *= k; fs *= k;
      if (useLogo) { logo.style.width = n(signW - 2 * pad) + 'px'; logo.style.height = n(contentH) + 'px'; }
      else {
        neon.style.fontSize = n(fs) + 'px';
        neon.style.transform = 'translate(' + n(ib.offX * fs / 100) + 'px,' + n(ib.offY * fs / 100) + 'px)';
      }
      sign.style.width = n(signW) + 'px';
      sign.style.height = n(signH) + 'px';
      if (ref) ref.style.width = n(60 * ppi * k) + 'px';
      if (cap) cap.textContent = 'Queen bed, 60 in wide, shown for scale' + (k < 1 ? ' (zoomed out to fit)' : '');
      dims = { w: size, h: half(size * signH / signW) };
      set(root, 'dims', fmt(dims.w) + ' x ' + fmt(dims.h) + ' in');
    }

    function run() {
      syncChoices(root);
      isLogo = radio(root, 'nfc-type') === 'logo';
      show(root, 'text', !isLogo); show(root, 'logo', isLogo);
      var ta = g('text');
      var raw = (ta.value || '').replace(/\r/g, '').split('\n').slice(0, 2).map(function (s) { return s.replace(/\s+$/, ''); }).join('\n');
      var fontIn = root.querySelector('input[name="nfc-font"]:checked');
      neon.style.fontFamily = fontIn ? fontIn.getAttribute('data-family') : "'Sacramento', cursive";
      var shown = isLogo ? 'Your logo' : (raw.trim() ? raw : 'Your name');
      neon.textContent = shown;
      neon.setAttribute('data-text', shown);
      var hasLogo = isLogo && !!logoURL;
      neon.hidden = hasLogo; logo.hidden = !hasLogo;
      var ck = radio(root, 'nfc-color') || 'warm', c = COLORS[ck] || COLORS.warm;
      stage.style.setProperty('--core', c[1]);
      stage.style.setProperty('--glow', c[2]);
      stage.style.setProperty('--tube', hexMix(c[2], '#eeeeee', 0.3));
      root.style.setProperty('--glow', c[2]);
      set(root, 'colorname', c[0]);
      if (lastColor && lastColor !== ck && !reduce) { neon.classList.remove('is-flick'); void neon.offsetWidth; neon.classList.add('is-flick'); }
      lastColor = ck;
      var back = radio(root, 'nfc-back') || 'clear';
      sign.className = 'nfc-sign nfc-sign--' + back;
      set(root, 'sizeval', fmt(num(g('size'), 30, 12, 72)) + ' in wide');
      fit();
      var fontLbl = fontIn ? fontIn.getAttribute('data-label') : 'Signature';
      lines = ['Custom name sign', 'Type: ' + (isLogo ? 'Logo or artwork' : 'Name or words')];
      if (!isLogo) lines.push('Text: ' + (raw.trim() ? raw.replace(/\n/g, ' / ') : '(not typed yet)'), 'Font: ' + fontLbl);
      lines.push('Color: ' + c[0], 'Size: about ' + fmt(dims.w) + ' in wide x ' + fmt(dims.h) + ' in tall', 'Backing: ' + radioLabel(root, 'nfc-back'), 'Where: ' + radioLabel(root, 'nfc-where'), 'Power: US plug in adapter with a dimmer included');
      if (isLogo) {
        if (logoName) lines.push('Logo file: ' + logoName + ' (previewed on the page, I will attach it when I reply to your email)');
        var lk = (g('logolink').value || '').trim(), ld = (g('logodesc').value || '').trim();
        if (lk) lines.push('Logo link: ' + lk.slice(0, 300));
        if (ld) lines.push('Logo description: ' + ld.slice(0, 600));
        if (!logoName && !lk && !ld) lines.push('Logo: I will send it by email');
      }
      push(lines);
      say((isLogo ? 'Logo sign' : shown.replace(/\n/g, ' ')) + ', ' + c[0] + ', about ' + fmt(dims.w) + ' by ' + fmt(dims.h) + ' inches.');
    }

    if (glowBtn) glowBtn.addEventListener('click', function () {
      var off = stage.classList.toggle('nfc-stage--off');
      glowBtn.setAttribute('aria-pressed', off ? 'false' : 'true');
      set(root, 'glowlbl', off ? 'Light off' : 'Light on');
    });
    if (wallBtn) wallBtn.addEventListener('click', function () {
      var light = stage.classList.toggle('nfc-stage--light');
      wallBtn.setAttribute('aria-pressed', light ? 'true' : 'false');
      set(root, 'walllbl', light ? 'Light wall' : 'Dark wall');
    });
    if (file) file.addEventListener('change', function () {
      var f = file.files && file.files[0];
      if (logoURL) { try { URL.revokeObjectURL(logoURL); } catch (e) {} logoURL = null; logoName = ''; }
      if (f && /^image\//.test(f.type) && f.size < 20 * 1024 * 1024) {
        logoURL = URL.createObjectURL(f);
        logoName = f.name.replace(/[^\w .\-()]/g, '').slice(0, 80);
        logo.onload = run;
        logo.src = logoURL;
      } else if (f) {
        file.value = '';
      }
      run();
    });
    onChange(root, function (e) { if (e && e.target === file) return; run(); });
    bindGo(root, function () { return lines; });
    if (window.ResizeObserver) new ResizeObserver(function () { fit(); }).observe(stage);
    else window.addEventListener('resize', fit);
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { if (en.some(function (x) { return x.isIntersecting; })) { io.disconnect(); loadFonts(run); } }, { rootMargin: '900px 0px' });
      io.observe(root);
    } else loadFonts(run);
    root.addEventListener('focusin', function () { loadFonts(run); }, { once: true });
    run();
  }

  /* ---------- boot ---------- */
  function boot(scope) {
    scope = scope || document;
    $$('[data-nfc-curtains]', scope).forEach(initCurtains);
    $$('[data-nfc-chand]', scope).forEach(initChand);
    $$('[data-nfc-signtool]', scope).forEach(initSign);
    bindSummary();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { boot(); });
  else boot();
  document.addEventListener('shopify:section:load', function (e) { boot(e.target); });
})();
