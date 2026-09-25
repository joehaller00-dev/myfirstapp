/* Patched 2026-09-09: the AFTER-label alternation carried only the adjective
   forms (wide / tall / deep / long), so a spec written with the noun after the
   number, which is how most of this catalogue is written, matched nothing and
   the chart quietly rendered for none of those products. The bare nouns now sit
   in the list, each placed after its longer "in <noun>" form so the longer
   alternative still wins the match.
   Measured over all 1,268 active products: 643 -> 669 render. The rest are not
   a parser gap. They describe several PARTS (shade diameter, pole height, base
   diameter), and the option-name gate refuses them on purpose rather than draw
   one box out of two different objects. Do not loosen that gate to chase the
   count. */
/* ---------------------------------------------------------------------------
   NORA FURNISH - VISUAL DIMENSION CHART
   ---------------------------------------------------------------------------
   Draws a simple line-art size sketch (or a size table for multi-size items)
   inside the "Dimensions" accordion on the product page.

   Data source: the custom.dimensions metafield text + the product's option
   values. Nothing is ever invented: if the text cannot be parsed into at least
   two unambiguous measurements, NOTHING is rendered and the plain text below
   stands on its own.

   Rendered by: snippets/nf-dimension-chart.liquid
   Styles in:   assets/custom-nav.css  (section "NF DIMENSION CHART")
   --------------------------------------------------------------------------- */
(function () {
  'use strict';
  if (window.__nfDimChartLoaded) return;
  window.__nfDimChartLoaded = true;

  /* ---------------- measurement parsing ---------------- */

  var U = '(?:inches|inch|in\\.|in(?![a-z])|"|″|ft(?![a-z])|feet|foot|\')';
  var NUMU = new RegExp('(\\d+(?:\\.\\d+)?)\\s*(' + U + ')', 'gi');
  // a descriptor that FOLLOWS the measurement: "9.8 inches tall"
  var AFTER = /^[\s,)]*(?:tall|high|in height|height|in overall height|wide|in width|width|across|in diameter|diameter|long|in length|length|deep|in depth|depth)(?![a-z])/i;
  // a single letter that follows a measurement: '23.6" W'
  var AFTERL = /^\s*\(?([WHDL])\)?(?![a-z0-9])/;
  // a descriptor that PRECEDES the measurement: "Width: 7.08 in"
  var BEFORE = /(?:^|[^a-z])(height|width|depth|length|diameter|dia|tall|high|wide|long|deep|across)\s*(?:is|of|:|=|-|–|about|approximately|approx\.?|roughly|\s)*$/i;

  var MAP = {
    height: 'H', tall: 'H', high: 'H', 'in height': 'H', 'in overall height': 'H',
    width: 'W', wide: 'W', 'in width': 'W',
    depth: 'D', deep: 'D', 'in depth': 'D',
    length: 'L', long: 'L', 'in length': 'L',
    diameter: 'DIA', dia: 'DIA', 'in diameter': 'DIA', across: 'DIA',
    W: 'W', H: 'H', D: 'D', L: 'L'
  };

  function canon(w) {
    w = String(w).trim().toLowerCase().replace(/^in\s+/, '').replace(/^overall\s+/, '');
    return MAP[w] || null;
  }
  function normUnit(u) {
    u = u.toLowerCase();
    return (u === 'ft' || u === 'feet' || u === 'foot' || u === "'") ? 'ft' : 'in';
  }

  // every measurement in the text that carries an explicit dimension descriptor
  function hits(t) {
    var out = [], m;
    NUMU.lastIndex = 0;
    while ((m = NUMU.exec(t)) !== null) {
      var end = m.index + m[0].length;
      var tail = t.slice(end, end + 28);
      var head = t.slice(Math.max(0, m.index - 30), m.index);
      var lab = null, a;
      if ((a = tail.match(AFTER))) lab = canon(a[0].replace(/^[\s,)]*/, ''));
      if (!lab && (a = tail.match(AFTERL))) lab = canon(a[1]);
      if (!lab && (a = head.match(BEFORE))) lab = canon(a[1]);
      if (lab) out.push({ label: lab, val: parseFloat(m[1]), unit: normUnit(m[2]), at: m.index });
    }
    return out;
  }

  // "23.6 x 15.7 x 27.5 in" / "9.3*5.3*6.9" / "20 by 30 in"
  var CHAIN = new RegExp(
    '(\\d+(?:\\.\\d+)?)\\s*(' + U + ')?\\s*(?:x|×|\\*|by)\\s*' +
    '(\\d+(?:\\.\\d+)?)\\s*(' + U + ')?' +
    '(?:\\s*(?:x|×|\\*|by)\\s*(\\d+(?:\\.\\d+)?)\\s*(' + U + ')?)?', 'gi');
  // an explicit ordering hint printed after the chain: "(W x H)"
  var HINT = /^[\s.,]*\(?\s*([WLDH])\s*(?:x|×|\*)\s*([WLDH])(?:\s*(?:x|×|\*)\s*([WLDH]))?\s*\)?/i;

  function chainOne(t) {
    CHAIN.lastIndex = 0;
    var m;
    while ((m = CHAIN.exec(t)) !== null) {
      var nums = [m[1], m[3], m[5]].filter(function (x) { return x !== undefined; }).map(parseFloat);
      var units = [m[2], m[4], m[6]].filter(Boolean).map(normUnit);
      if (!units.length) continue;                 // no unit anywhere: not a measurement
      var unit = units[units.length - 1];          // a trailing unit governs the whole chain
      var end = m.index + m[0].length;
      var h = t.slice(end, end + 18).match(HINT), order;
      if (h) order = [h[1], h[2], h[3]].filter(Boolean).map(function (x) { return x.toUpperCase(); });
      if (!order || order.length !== nums.length) {
        order = nums.length === 3 ? ['W', 'D', 'H'] : ['W', 'H'];
      }
      return {
        dims: nums.map(function (n, i) { return { label: order[i], val: n, unit: unit }; }),
        at: m.index
      };
    }
    return null;
  }

  function dedupe(list) {
    var seen = {}, out = [];
    list.forEach(function (o) { if (!seen[o.label]) { seen[o.label] = 1; out.push(o); } });
    return out;
  }

  // dimensions expressed by one segment of text (a sentence, or an option value)
  function segDims(seg) {
    var raw = hits(seg), h = dedupe(raw);
    if (h.length >= 2) return { dims: h, at: raw[0].at };
    var c = chainOne(seg);
    if (c && c.dims.length >= 2) return c;
    if (h.length === 1) return { dims: h, at: h[0].at };
    return null;
  }

  // true when the text describes more than one distinct size / component
  function ambiguous(t) {
    var h = hits(t), by = {};
    for (var i = 0; i < h.length; i++) {
      if (by[h[i].label] !== undefined && by[h[i].label] !== h[i].val) return true;
      by[h[i].label] = h[i].val;
    }
    CHAIN.lastIndex = 0;
    var m, prev = null;
    while ((m = CHAIN.exec(t)) !== null) {
      var sig = [m[1], m[3], m[5]].join(',');
      if (prev !== null && prev !== sig) return true;
      prev = sig;
    }
    return false;
  }

  var BOILERPLATE = /^\s*dimensions?[^.]{0,60}(?:vary|varies)[^.]*\.\s*(?:select your preferred option above\.?\s*)?/i;
  function normKey(s) { return String(s).toLowerCase().replace(/[^a-z0-9.]+/g, ''); }

  /* ---------------- decide what (if anything) to draw ---------------- */

  function classify(payload) {
    var text = String(payload.text || '').replace(/\s+/g, ' ').trim().replace(BOILERPLATE, '');
    var options = payload.options || [];

    // 1. Best source: option values that themselves carry measurements. Exact, no guessing.
    var best = null;
    options.forEach(function (o) {
      var rows = (o.values || []).map(function (v) {
        var d = segDims(v);
        return d ? { key: v, dims: d.dims } : null;
      }).filter(Boolean);
      if (rows.length >= 2 && (!best || rows.length > best.rows.length)) {
        best = { title: o.name, rows: rows };
      }
    });
    if (best) return { mode: 'table', title: best.title, rows: best.rows };

    if (!text) return { mode: 'none' };

    // 2. Split the prose into segments and pull a measurement set out of each.
    var segs = text.split(/(?:[.;]\s+|\n)/).map(function (s) { return s.trim(); }).filter(Boolean);
    var rows = [];
    segs.forEach(function (sg) {
      var d = segDims(sg);
      if (!d) return;
      var key = sg.slice(0, d.at)
        .replace(/^[\s.,;:)\-–]+/, '')
        .replace(/[\s.,;:(\-–]+$/, '')
        .replace(/\b(?:measures|measuring|is|are|has|comes in|available in|approximately|approx\.?|about)\b\s*$/i, '')
        .replace(/[\s.,;:(\-–]+$/, '');
      rows.push({ key: key.length <= 38 ? key : '', dims: d.dims });
    });

    if (ambiguous(text)) {
      // More than one size described. Only build a table when every row carries a
      // key that is genuinely a variant name; otherwise render nothing.
      var optVals = {};
      options.forEach(function (o) {
        (o.values || []).forEach(function (v) { optVals[normKey(v)] = 1; });
      });
      var dimRows = rows.filter(function (r) { return r.dims.length >= 1; });
      var keyed = dimRows.filter(function (r) { return r.key; });
      var namesOk = keyed.length >= 2 && keyed.length === dimRows.length &&
        keyed.every(function (r) {
          var k = normKey(r.key);
          if (!k) return false;
          for (var ov in optVals) {
            if (ov && (ov === k || ov.indexOf(k) >= 0 || k.indexOf(ov) >= 0)) return true;
          }
          return /^(small|smaller|medium|large|larger|mini|standard|round|square|option[a-z0-9 ]*|design [a-z]|style [a-z]|type [a-z]|size [a-z0-9]+|[a-z]\)|\d+\))$/i.test(r.key);
        });
      if (namesOk) return { mode: 'table', title: 'Size', rows: keyed };
      return { mode: 'none' };
    }

    // 3. One consistent set of measurements: draw the sketch.
    var merged = dedupe([].concat.apply([], rows.map(function (r) { return r.dims; })));
    if (merged.length >= 2) return { mode: 'diagram', dims: merged };
    return { mode: 'none' };
  }

  /* ---------------- drawing ---------------- */

  var NAMES = { W: 'Width', L: 'Length', D: 'Depth', H: 'Height', DIA: 'Diameter' };
  var COLS = ['W', 'L', 'DIA', 'D', 'H'];

  function fmt(d) {
    var v = Math.round(d.val * 100) / 100;
    return d.unit === 'ft' ? v + ' ft' : v + '″';
  }
  function inches(d) { return d.unit === 'ft' ? d.val * 12 : d.val; }
  function svgEl(n, a) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', n);
    for (var k in a) e.setAttribute(k, a[k]);
    return e;
  }

  function diagram(dims) {
    var by = {};
    dims.forEach(function (d) { if (!by[d.label]) by[d.label] = d; });
    var across = by.W || by.L || by.DIA;
    var vert = by.H;
    var dep = by.D;
    var round = !!by.DIA && !by.W && !by.L;
    if (!across && !vert) return null;

    var VB_W = 300, PAD_L = 10, LABEL_R = 66, PAD_T = 14, LABEL_B = 44;
    var maxW = VB_W - PAD_L - LABEL_R;
    var maxH = 176;

    // proportional, but clamped so extreme ratios stay legible
    var w, h;
    if (across && vert) {
      var ratio = Math.min(3.4, Math.max(0.3, inches(across) / inches(vert)));
      if (ratio >= 1) { w = maxW; h = maxW / ratio; if (h > maxH) { h = maxH; w = maxH * ratio; } }
      else { h = maxH; w = maxH * ratio; if (w > maxW) { w = maxW; h = maxW / ratio; } }
    } else if (across) { w = maxW; h = round ? Math.min(maxW, maxH) : maxH * 0.42; }
    else { h = maxH; w = maxW * 0.5; }

    var depPx = 0;
    if (dep && !round) {
      var dr = inches(dep) / (inches(across || vert) || 1);
      depPx = Math.max(12, Math.min(38, dr * w));
    }

    var x0 = PAD_L, y0 = PAD_T + depPx, W = w, H = h;
    var vbH = y0 + H + LABEL_B;
    var svg = svgEl('svg', {
      viewBox: '0 0 ' + VB_W + ' ' + Math.round(vbH),
      class: 'nf-dc-svg', role: 'img',
      'aria-label': dims.map(function (d) { return NAMES[d.label] + ' ' + fmt(d); }).join(', ')
    });

    var defs = svgEl('defs', {});
    defs.innerHTML =
      '<marker id="nf-dc-ar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">' +
      '<path d="M0,0 L8,4 L0,8 z" class="nf-dc-arh"/></marker>' +
      '<marker id="nf-dc-al" viewBox="0 0 8 8" refX="1" refY="4" markerWidth="7" markerHeight="7" orient="auto">' +
      '<path d="M8,0 L0,4 L8,8 z" class="nf-dc-arh"/></marker>';
    svg.appendChild(defs);

    var shapeRight = x0 + W + depPx;

    if (round) {
      // cylinder / drum silhouette: elliptical top + straight sides
      var ry = Math.max(6, Math.min(18, W * 0.16));
      if (vert) {
        svg.appendChild(svgEl('path', {
          class: 'nf-dc-line',
          d: 'M' + x0 + ',' + (y0 + ry) + ' L' + x0 + ',' + (y0 + H - ry) +
             ' A' + (W / 2) + ',' + ry + ' 0 0 0 ' + (x0 + W) + ',' + (y0 + H - ry) +
             ' L' + (x0 + W) + ',' + (y0 + ry)
        }));
        svg.appendChild(svgEl('ellipse', { class: 'nf-dc-line', cx: x0 + W / 2, cy: y0 + ry, rx: W / 2, ry: ry }));
      } else {
        svg.appendChild(svgEl('circle', { class: 'nf-dc-line', cx: x0 + W / 2, cy: y0 + H / 2, r: Math.min(W, H) / 2 }));
      }
      shapeRight = x0 + W;
    } else {
      svg.appendChild(svgEl('rect', { class: 'nf-dc-line', x: x0, y: y0, width: W, height: H, rx: 2 }));
      if (depPx) {
        // light isometric extrusion so depth reads as depth
        svg.appendChild(svgEl('path', {
          class: 'nf-dc-line nf-dc-line--soft',
          d: 'M' + x0 + ',' + y0 + ' L' + (x0 + depPx) + ',' + (y0 - depPx) +
             ' L' + (x0 + W + depPx) + ',' + (y0 - depPx) + ' L' + (x0 + W) + ',' + y0
        }));
        svg.appendChild(svgEl('path', {
          class: 'nf-dc-line nf-dc-line--soft',
          d: 'M' + (x0 + W) + ',' + y0 + ' L' + (x0 + W + depPx) + ',' + (y0 - depPx) +
             ' L' + (x0 + W + depPx) + ',' + (y0 + H - depPx) + ' L' + (x0 + W) + ',' + (y0 + H)
        }));
      }
    }

    function ext(x1, y1, x2, y2) {
      svg.appendChild(svgEl('line', { class: 'nf-dc-ext', x1: x1, y1: y1, x2: x2, y2: y2 }));
    }
    function dimLine(x1, y1, x2, y2) {
      svg.appendChild(svgEl('line', {
        class: 'nf-dc-dim', x1: x1, y1: y1, x2: x2, y2: y2,
        'marker-start': 'url(#nf-dc-al)', 'marker-end': 'url(#nf-dc-ar)'
      }));
    }
    function label(x, y, txt, anchor, cls) {
      var t = svgEl('text', { x: x, y: y, class: 'nf-dc-val ' + (cls || ''), 'text-anchor': anchor || 'start' });
      t.textContent = txt;
      svg.appendChild(t);
    }

    // vertical (height) dimension, to the right
    if (vert) {
      var vx = shapeRight + 20;
      ext(shapeRight + 3, y0, vx + 4, y0);
      ext(shapeRight + 3, y0 + H, vx + 4, y0 + H);
      dimLine(vx, y0, vx, y0 + H);
      label(vx + 7, y0 + H / 2 - 1, fmt(vert), 'start');
      label(vx + 7, y0 + H / 2 + 11, NAMES.H, 'start', 'nf-dc-cap');
    }
    // horizontal (width / length / diameter) dimension, underneath
    if (across) {
      var hy = y0 + H + 17;
      ext(x0, y0 + H + 3, x0, hy + 4);
      ext(x0 + W, y0 + H + 3, x0 + W, hy + 4);
      dimLine(x0, hy, x0 + W, hy);
      label(x0 + W / 2, hy + 13, fmt(across), 'middle');
      label(x0 + W / 2, hy + 24, NAMES[across.label], 'middle', 'nf-dc-cap');
    }
    // depth along the top-left diagonal
    if (depPx && dep) {
      dimLine(x0 + 2, y0 - 2, x0 + depPx - 2, y0 - depPx + 2);
      label(x0 + depPx + 10, y0 - depPx + 2, fmt(dep), 'start');
      label(x0 + depPx + 10, y0 - depPx + 12, NAMES.D, 'start', 'nf-dc-cap');
    }
    return svg;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function table(cls) {
    var used = COLS.filter(function (c) {
      return cls.rows.some(function (r) { return r.dims.some(function (d) { return d.label === c; }); });
    });
    if (!used.length) return null;
    var wrap = document.createElement('div');
    wrap.className = 'nf-dc-tablewrap';
    var html = '<table class="nf-dc-table"><thead><tr><th scope="col">' +
      esc(cls.title || 'Size') + '</th>' +
      used.map(function (c) { return '<th scope="col">' + NAMES[c] + '</th>'; }).join('') +
      '</tr></thead><tbody>';
    cls.rows.forEach(function (r) {
      var by = {};
      r.dims.forEach(function (d) { if (!by[d.label]) by[d.label] = d; });
      html += '<tr><th scope="row">' + esc(r.key) + '</th>' +
        used.map(function (c) { return '<td>' + (by[c] ? fmt(by[c]) : '') + '</td>'; }).join('') + '</tr>';
    });
    html += '</tbody></table>';
    wrap.innerHTML = html;
    return wrap;
  }

  /* ---------------- boot ---------------- */

  function build(host) {
    if (host.getAttribute('data-nf-done')) return;
    host.setAttribute('data-nf-done', '1');
    var payload;
    try { payload = JSON.parse(host.getAttribute('data-nf-dims') || '{}'); }
    catch (e) { return; }

    var cls;
    try { cls = classify(payload); } catch (e) { return; }
    if (!cls || cls.mode === 'none') return;   // render nothing at all

    var node = null;
    try { node = cls.mode === 'table' ? table(cls) : diagram(cls.dims); } catch (e) { node = null; }
    if (!node) return;

    var fig = document.createElement('div');
    fig.className = 'nf-dc' + (cls.mode === 'table' ? ' nf-dc--table' : ' nf-dc--diagram');
    fig.appendChild(node);
    host.appendChild(fig);
    /* The Dimensions accordion renders the written measurements underneath as a
       fallback. Now that a chart has drawn, the text is redundant, so it is hidden
       here rather than in Liquid: only this point knows a chart actually rendered. */
    var fallback = host.parentNode && host.parentNode.querySelector(".nf-dc-fallback");
    if (fallback) fallback.style.display = "none";
  }

  function boot() {
    var list = document.querySelectorAll('[data-nf-dims]');
    for (var i = 0; i < list.length; i++) build(list[i]);
  }

  // Exposed so snippets/product-gallery.liquid can re-run the renderer after the
  // gallery is re-rendered (variant / section reload) without a full page load.
  window.nfDimChartBoot = boot;
  /* NF-DIMSIL-V5: the outline renderer below reuses this parser for products that have no dim_chart */
  window.__nfDimParse = function (p) { var c = classify(p); if (!c || c.mode !== 'diagram' || !c.dims) return null;
    return c.dims.map(function (d) { return { label: d.label, txt: fmt(d) }; }); };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  document.addEventListener('shopify:section:load', boot);
})();


/* ===== NF-DIMCHART-SHAPES-V1 : line-art diagram from custom.dim_chart ===== */
(function () {
  "use strict";
  if (window.__nfDimShapes) return;
  window.__nfDimShapes = 1;
  var NS = "http://www.w3.org/2000/svg";
  var INK = "#1c1c1c", HAIR = "#c9c3ba", MUTE = "#7d746a";
  var FONT = "Poynter Oldstyle, Roboto Serif, Georgia, serif";
  function el(n, a) { var e = document.createElementNS(NS, n), k; for (k in a) if (Object.prototype.hasOwnProperty.call(a, k)) e.setAttribute(k, a[k]); return e; }
  function num(v) { if (typeof v !== "string") return null; var m = v.match(/(\d+(?:\.\d+)?)/); return m ? parseFloat(m[1]) : null; }
  function has(d, k) { return d && typeof d[k] === "string" && d[k]; }
  function primitive(g, shape, x, y, w, h) {
    var cx = x + w / 2, ry = Math.max(5, Math.min(14, w * 0.16));
    function add(n, a) { if (!a.fill) a.fill = "none"; if (!a.stroke) a.stroke = INK; if (!a["stroke-width"]) a["stroke-width"] = 1.25; a["stroke-linejoin"] = "round"; g.appendChild(el(n, a)); }
    var dep, top, r, dh, rw;
    switch (shape) {
      case "box":
        dep = Math.max(8, Math.min(26, w * 0.26));
        add("path", { d: "M" + x + " " + (y + dep) + " L" + (x + dep) + " " + y + " L" + (x + w) + " " + y + " L" + (x + w) + " " + (y + h - dep) + " L" + (x + w - dep) + " " + (y + h) + " L" + x + " " + (y + h) + " Z" });
        add("path", { d: "M" + x + " " + (y + dep) + " L" + (x + w - dep) + " " + (y + dep) + " L" + (x + w) + " " + y });
        add("path", { d: "M" + (x + w - dep) + " " + (y + dep) + " L" + (x + w - dep) + " " + (y + h) });
        break;
      case "cylinder": case "tube": case "lantern":
        add("path", { d: "M" + x + " " + (y + ry) + " L" + x + " " + (y + h - ry) });
        add("path", { d: "M" + (x + w) + " " + (y + ry) + " L" + (x + w) + " " + (y + h - ry) });
        add("ellipse", { cx: cx, cy: y + ry, rx: w / 2, ry: ry });
        add("path", { d: "M" + x + " " + (y + h - ry) + " A" + (w / 2) + " " + ry + " 0 0 0 " + (x + w) + " " + (y + h - ry) });
        if (shape === "lantern") add("path", { d: "M" + (cx - w * 0.18) + " " + y + " Q" + cx + " " + (y - h * 0.14) + " " + (cx + w * 0.18) + " " + y });
        break;
      case "cone":
        top = w * 0.42;
        add("path", { d: "M" + (cx - top / 2) + " " + (y + ry) + " L" + x + " " + (y + h - ry) });
        add("path", { d: "M" + (cx + top / 2) + " " + (y + ry) + " L" + (x + w) + " " + (y + h - ry) });
        add("ellipse", { cx: cx, cy: y + ry, rx: top / 2, ry: Math.max(3, ry * 0.5) });
        add("path", { d: "M" + x + " " + (y + h - ry) + " A" + (w / 2) + " " + ry + " 0 0 0 " + (x + w) + " " + (y + h - ry) });
        break;
      case "sphere":
        r = Math.min(w, h) / 2;
        add("circle", { cx: cx, cy: y + h / 2, r: r });
        add("ellipse", { cx: cx, cy: y + h / 2, rx: r, ry: r * 0.32, stroke: HAIR });
        break;
      case "dome":
        add("path", { d: "M" + x + " " + (y + h) + " A" + (w / 2) + " " + h + " 0 0 1 " + (x + w) + " " + (y + h) + " Z" });
        add("ellipse", { cx: cx, cy: y + h, rx: w / 2, ry: Math.max(3, ry * 0.5), stroke: HAIR });
        break;
      case "ring":
        add("ellipse", { cx: cx, cy: y + h / 2, rx: w / 2, ry: h / 2 });
        add("ellipse", { cx: cx, cy: y + h / 2, rx: w / 2 * 0.62, ry: h / 2 * 0.62 });
        break;
      case "disc": case "plate":
        dh = Math.max(7, h * 0.34);
        add("ellipse", { cx: cx, cy: y + dh / 2 + 2, rx: w / 2, ry: dh / 2 });
        add("path", { d: "M" + x + " " + (y + dh / 2 + 2) + " L" + x + " " + (y + h - dh / 2) });
        add("path", { d: "M" + (x + w) + " " + (y + dh / 2 + 2) + " L" + (x + w) + " " + (y + h - dh / 2) });
        add("path", { d: "M" + x + " " + (y + h - dh / 2) + " A" + (w / 2) + " " + (dh / 2) + " 0 0 0 " + (x + w) + " " + (y + h - dh / 2) });
        break;
      case "panel":
        add("rect", { x: x, y: y, width: w, height: h, rx: 2 });
        add("path", { d: "M" + (x + 6) + " " + (y + 6) + " L" + (x + w - 6) + " " + (y + 6), stroke: HAIR });
        break;
      case "rod":
        rw = Math.max(10, w * 0.22);
        add("rect", { x: cx - rw / 2, y: y, width: rw, height: h, rx: rw / 2 });
        break;
      default:
        add("rect", { x: x, y: y, width: w, height: h, rx: 2 });
    }
  }
  function dim(g, o) {
    function ln(d) { g.appendChild(el("path", { d: d, fill: "none", stroke: MUTE, "stroke-width": 1 })); }
    function txt(x, y, t, rot) { var e = el("text", { x: x, y: y, "text-anchor": "middle", fill: MUTE, "font-size": "13", "font-family": FONT }); if (rot) e.setAttribute("transform", "rotate(-90 " + x + " " + y + ")"); e.textContent = t; g.appendChild(e); }
    if (o.axis === "x") {
      ln("M" + o.a + " " + o.p + " L" + o.b + " " + o.p);
      ln("M" + o.a + " " + (o.p - 4) + " L" + o.a + " " + (o.p + 4));
      ln("M" + o.b + " " + (o.p - 4) + " L" + o.b + " " + (o.p + 4));
      txt((o.a + o.b) / 2, o.p + 16, o.label);
    } else {
      ln("M" + o.p + " " + o.a + " L" + o.p + " " + o.b);
      ln("M" + (o.p - 4) + " " + o.a + " L" + (o.p + 4) + " " + o.a);
      ln("M" + (o.p - 4) + " " + o.b + " L" + (o.p + 4) + " " + o.b);
      txt(o.p - 8, (o.a + o.b) / 2, o.label, true);
    }
  }
  function draw(spec, dims, partsIn) {
    var needsRight = !!(partsIn && partsIn.length) || (dims && typeof dims.d === "string");
    var W = 340, PADL = 50, PADR = needsRight ? 92 : 34, PADT = 22, PADB = 38;
    var parts = partsIn && partsIn.length ? partsIn.slice(0, 4) : null;
    var rows = parts || [{ name: null, shape: spec.shape, dims: dims }];
    var rowH = parts ? 78 : 152;
    var H = PADT + rows.length * rowH + PADB;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, width: "100%", role: "img" });
    var g = el("g", {}); svg.appendChild(g);
    var boxL = PADL, boxR = W - PADR, boxW = boxR - boxL;
    var y = PADT, drew = false, i, r, d, wv, hv, shape, pw, ph, px, t, nm;
    for (i = 0; i < rows.length; i++) {
      r = rows[i]; d = r.dims || {};
      wv = num(d.w) || num(d.dia) || num(d.dBottom) || num(d.len);
      hv = num(d.h) || num(d.thk);
      if (wv === null && hv === null) { y += rowH; continue; }
      shape = r.shape || spec.shape || "box";
      pw = boxW * (parts ? 0.56 : 0.84);
      ph = rowH - (parts ? 24 : 36);
      px = boxL + (boxW - pw) / 2;
      primitive(g, shape, px, y, pw, ph); drew = true;
      if (wv !== null) dim(g, { axis: "x", a: px, b: px + pw, p: y + ph + 15, label: d.w || d.dia || d.dBottom || d.len });
      if (hv !== null) dim(g, { axis: "y", a: y, b: y + ph, p: px - 14, label: d.h || d.thk });
      if (has(d, "d") && !parts) { t = el("text", { x: px + pw + 12, y: y + ph / 2, fill: MUTE, "font-size": "11.5", "font-family": FONT }); t.textContent = "Depth " + d.d; g.appendChild(t); }
      if (r.name) { nm = el("text", { x: boxR + 10, y: y + ph / 2 + 4, fill: INK, "font-size": "12", "font-family": FONT }); nm.textContent = r.name; g.appendChild(nm); }
      y += rowH;
    }
    return drew ? svg : null;
  }
  function render(spec) {
    var wrap = document.createElement("div");
    wrap.className = "nf-dc nf-dc--diagram nf-dc--shape";
    var stage = document.createElement("div"); stage.className = "nf-dc__stage"; wrap.appendChild(stage);
    var variants = spec.variants && spec.variants.length ? spec.variants : null;
    function paint(dims, parts) { var svg = draw(spec, dims, parts); stage.textContent = ""; if (svg) stage.appendChild(svg); return !!svg; }
    var ok, bar;
    if (variants) {
      bar = document.createElement("div"); bar.className = "nf-dc__chips";
      variants.forEach(function (v, i) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "nf-dc__chip" + (i === 0 ? " is-active" : ""); b.textContent = v.key;
        b.addEventListener("click", function () { var all = bar.querySelectorAll(".nf-dc__chip"), k; for (k = 0; k < all.length; k++) all[k].classList.remove("is-active"); b.classList.add("is-active"); paint(v.dims, spec.parts); });
        bar.appendChild(b);
      });
      ok = paint(variants[0].dims, spec.parts);
      if (ok) wrap.appendChild(bar);
    } else {
      ok = paint(spec.overall || (spec.parts && spec.parts[0] && spec.parts[0].dims) || {}, spec.parts);
    }
    if (!ok) return null;
    if (spec.note) { var n = document.createElement("p"); n.className = "nf-dc__note"; n.textContent = spec.note; wrap.appendChild(n); }
    return wrap;
  }
  /* ----- NF-DIMSIL-V1 : traced product silhouette (custom.dim_outline) -----
     ol = {v:1, vb:[w,h], d:"M..Z", in:"M..", cord:x|null, view:"top"|"vlen", x:[variant idx]}
     The outline is traced from the product's own photo; every number still comes from dim_chart.
     view "top": the photo is a plan view, so the vertical line is depth and height becomes text.
     view "vlen": a linear piece photographed upright, so its length runs on the vertical line.
     x: variants whose proportions do not match the photo; those chips keep the generic shape. */
  function inch(v) {
    if (typeof v !== "string") return null;
    var m = v.match(/(\d+(?:\.\d+)?)\s*(ft|feet|foot|')?/i);
    if (!m) return null;
    return parseFloat(m[1]) * (m[2] ? 12 : 1);
  }
  function olSize(d, ol) {
    d = d || {};
    if (ol && ol.st) return inch(d.h) || inch(d.len) || inch(d.w);
    return inch(d.w) || inch(d.dia) || inch(d.dBottom) || inch(d.len) || inch(d.h) || inch(d.thk);
  }
  function drawOutline(spec, ol, dims, kScale, extra) {
    /* NF-DIMSIL-V3: views side (depth x height) and p (drawn at the photo's own proportions, only the
       lines listed in ol.m are drawn, everything else is written out), ol.bb = the box the lines measure,
       ol.sk = thin parts (wires, arms) drawn as lines, ol.pu = figures are per unit */
    var d = dims || {}, view = ol.view || "front";
    var wl, hl, side = [], t = null, fixed = false;
    var W0 = d.w || d.dia || d.dBottom || d.len, H0 = d.h || d.thk;
    var wName = d.w ? "Width " : d.dia ? "Diameter " : d.dBottom ? "Base " : "Length ";
    if (view === "top") { wl = W0; hl = d.d; if (d.h) side.push("Height " + d.h); }
    else if (view === "vlen") { wl = d.w || d.dia || d.dBottom; hl = d.len || d.h; if (d.d) side.push("Depth " + d.d); }
    else if (view === "q") {
      /* three quarter photo: only the height is a true line; width and depth are written out */
      hl = d.h; wl = null;
      if (d.w || d.dia) side.push("Width " + (d.w || d.dia));
      if (d.d) side.push("Depth " + d.d);
      if (inch(d.w || d.dia) && inch(d.d) && inch(d.h)) t = 0.707 * (inch(d.w || d.dia) + inch(d.d)) / inch(d.h);
    }
    else if (view === "side") { wl = d.d; hl = H0; if (W0) side.push(wName + W0); }
    else if (view === "p") {
      fixed = true;
      var m = ol.m || "";
      if (m.indexOf("l") >= 0 && d.len) { wl = d.len; if (d.w || d.dia) side.push((d.w ? "Width " : "Diameter ") + (d.w || d.dia)); }
      else if (W0) { if (m.indexOf("w") >= 0) wl = W0; else side.push(wName + W0); }
      if (H0) { if (m.indexOf("h") >= 0) hl = H0; else side.push((d.h ? "Height " : "Thickness ") + H0); }
      if (d.d) side.push("Depth " + d.d);
    }
    else { wl = W0; hl = H0; if (d.d) side.push("Depth " + d.d); }
    if (ol.pu) side.push("Per unit");
    extra = extra || [];
    if (!wl && !hl && !side.length && !extra.length) return null;
    var cordOn = ol.cord !== null && ol.cord !== undefined;
    /* NF-DIMSIL-V6: the drawing fills the chart and the chart is only as tall as the drawing; the written numbers
       sit in centred lines under it instead of a side column. kScale (size by chip) is no longer used. */
    var lines = side.concat(extra);
    var W = 340, PADL = hl ? 40 : 16, PADR = 16, PADT = cordOn ? 40 : 14, PADB = wl ? 40 : 10, MAXH = 230, FILL = 0.94;
    var UW = W - PADL - PADR;
    var vbw = ol.vb[0], vbh = ol.vb[1];
    var bb = ol.bb && ol.bb.length === 4 ? ol.bb : [0, 0, vbw, vbh];
    var arb = (bb[2] - bb[0]) / Math.max(1, bb[3] - bb[1]), f = 1, wIn = inch(wl), hIn = inch(hl);
    if (wIn && hIn) t = wIn / hIn;
    if (t && !fixed) {
      if ((ol.st || ol.fit) && wIn && hIn) f = t / arb;                   /* length series / drawn silhouette: this chip's ratio */
      else if (Math.abs(Math.log(t / arb)) < Math.log(1.3)) f = t / arb;  /* small correction to the real ratio */
    }
    var ar = vbw * f / vbh, pw, ph;
    if (ar >= UW * FILL / MAXH) { pw = UW * FILL; ph = pw / ar; } else { ph = MAXH; pw = ph * ar; }
    var px = PADL + (UW - pw) / 2, py = PADT;
    var H = py + ph + PADB + (lines.length ? lines.length * 15 + 4 : 0);
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H.toFixed(1), width: "100%", role: "img", "class": "nf-dc-sil" });
    var g = el("g", {}); svg.appendChild(g);
    var sx = pw / vbw, sy = ph / vbh;
    var tf = "translate(" + px.toFixed(2) + " " + py.toFixed(2) + ") scale(" + sx.toFixed(5) + " " + sy.toFixed(5) + ")";
    if (cordOn) {
      var cx = px + ol.cord * sx;
      g.appendChild(el("path", { d: "M" + cx + " 9 L" + cx + " " + py, fill: "none", stroke: INK, "stroke-width": 1 }));
      g.appendChild(el("path", { d: "M" + (cx - 13) + " 9 L" + (cx + 13) + " 9 L" + (cx + 10) + " 4 L" + (cx - 10) + " 4 Z", fill: "#efe9e0", stroke: INK, "stroke-width": 1, "stroke-linejoin": "round" }));
    }
    if (ol.sk) g.appendChild(el("path", { d: ol.sk, transform: tf, fill: "none", stroke: INK, "stroke-width": ol.sw || 1.4, "stroke-linecap": "round", "stroke-linejoin": "round", "vector-effect": "non-scaling-stroke" }));
    if (ol.d) g.appendChild(el("path", { d: ol.d, transform: tf, fill: "#efe9e0", "fill-rule": "evenodd", stroke: INK, "stroke-width": 1.25, "stroke-linejoin": "round", "vector-effect": "non-scaling-stroke" }));
    if (ol["in"]) g.appendChild(el("path", { d: ol["in"], transform: tf, fill: "none", stroke: "#b9afa3", "stroke-width": 1, "stroke-linecap": "round", "stroke-linejoin": "round", "vector-effect": "non-scaling-stroke" }));
    var lx0 = px + bb[0] * sx, lx1 = px + bb[2] * sx, ly0 = py + bb[1] * sy, ly1 = py + bb[3] * sy;
    if (wl) dim(g, { axis: "x", a: lx0, b: lx1, p: py + ph + 15, label: wl });
    if (hl) dim(g, { axis: "y", a: ly0, b: ly1, p: px - 14, label: hl });
    lines.forEach(function (s, k2) {
      var tx = el("text", { x: W / 2, y: py + ph + PADB + 12 + k2 * 15, "text-anchor": "middle", fill: MUTE, "font-size": "11.5", "font-family": FONT });
      tx.textContent = s; g.appendChild(tx);
    });
    return svg;
  }
  function renderOutline(spec, ol) {
    if (!ol || !(ol.d || ol.sk) || !ol.vb || !(ol.vb[0] > 0) || !(ol.vb[1] > 0)) return null;
    /* NF-DIMSIL-V4: parts-only charts keep the drawing; each part is one text line with its stored values */
    var PN = { w: "width", h: "height", d: "depth", dia: "diameter", len: "length", thk: "thickness", dBottom: "base" };
    var partsOnly = !!(spec.parts && spec.parts.length && !spec.overall && !(spec.variants && spec.variants.length)), pl = [];
    if (partsOnly) spec.parts.slice(0, 5).forEach(function (p) {
      var dd = p.dims || {}, b = [], q, nm = String(p.name || "").trim();
      for (q in PN) if (typeof dd[q] === "string" && dd[q]) b.push([PN[q], dd[q]]);
      if (!b.length) return;
      var line = (b.length === 1 && nm && nm.toLowerCase().indexOf(b[0][0]) >= 0) ? nm + " " + b[0][1] :
        (nm ? nm + " " : "") + b.map(function (e, j) { return (j || nm ? e[0] : e[0].charAt(0).toUpperCase() + e[0].slice(1)) + " " + e[1]; }).join(", ");
      pl.push(line.slice(0, 58));
    });
    if (partsOnly && !pl.length) return null;
    var wrap = document.createElement("div");
    wrap.className = "nf-dc nf-dc--diagram nf-dc--shape nf-dc--sil";
    var stage = document.createElement("div"); stage.className = "nf-dc__stage"; wrap.appendChild(stage);
    var variants = spec.variants && spec.variants.length ? spec.variants : null;
    var skip = ol.x && ol.x.length ? ol.x : [];
    var maxS = 0;
    if (variants) variants.forEach(function (v, i) { var s = olSize(v.dims, ol); if (skip.indexOf(i) < 0 && s && s > maxS) maxS = s; });
    function paint(dims, i) {
      var svg = null;
      var s = olSize(dims, ol), k = maxS && s ? s / maxS : 1;
      if (skip.indexOf(i) < 0) svg = drawOutline(spec, ol, dims, k, pl);
      else svg = drawOutline(spec, { v: 1, vb: ol.vb, d: ol.d, "in": ol["in"], sk: ol.sk, bb: ol.bb, cord: ol.cord, pu: ol.pu, sw: ol.sw, view: "p", m: "" }, dims, 1, pl); /* NF-DIMSIL-V4: chip proportions differ from the photo: drawing kept, numbers as text */
      if (!svg) svg = draw(spec, dims, spec.parts);
      stage.textContent = ""; if (svg) stage.appendChild(svg); return !!svg;
    }
    var ok, bar;
    if (variants) {
      bar = document.createElement("div"); bar.className = "nf-dc__chips";
      variants.forEach(function (v, i) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "nf-dc__chip" + (i === 0 ? " is-active" : ""); b.textContent = v.key;
        b.addEventListener("click", function () { var all = bar.querySelectorAll(".nf-dc__chip"), j; for (j = 0; j < all.length; j++) all[j].classList.remove("is-active"); b.classList.add("is-active"); paint(v.dims, i); });
        bar.appendChild(b);
      });
      ok = paint(variants[0].dims, 0);
      if (ok) wrap.appendChild(bar);
    } else {
      ok = paint(spec.overall || {}, -1);
    }
    if (!ok) return null;
    if (spec.note) { var n = document.createElement("p"); n.className = "nf-dc__note"; n.textContent = spec.note; wrap.appendChild(n); }
    return wrap;
  }
  /* ----- /NF-DIMSIL-V1 ----- */
  function textSpec(payload) { /* NF-DIMSIL-V5: no dim_chart: numbers come from the written dimensions */
    if (!payload || !payload.outline || !window.__nfDimParse) return null;
    var dims = null; try { dims = window.__nfDimParse(payload); } catch (e) { dims = null; }
    if (!dims || !dims.length) return null;
    var K = { W: "w", H: "h", D: "d", L: "len", DIA: "dia" }, o = {}, n = 0;
    dims.forEach(function (d) { var k = K[d.label]; if (k && !o[k]) { o[k] = d.txt; n++; } });
    return n ? { v: 1, shape: "box", overall: o, source: "text" } : null;
  }
  function apply() {
    var list = document.querySelectorAll("[data-nf-dims]"), i, host, payload, spec, node, old, fb;
    for (i = 0; i < list.length; i++) {
      host = list[i];
      if (host.getAttribute("data-nf-shape-done")) continue;
      try { payload = JSON.parse(host.getAttribute("data-nf-dims") || "{}"); } catch (e) { continue; }
      spec = payload && payload.chart;
      if ((!spec || !spec.shape) && payload && payload.outline) spec = textSpec(payload);
      if (!spec || !spec.shape) continue;
      node = null;
      if (payload.outline) { try { node = renderOutline(spec, payload.outline); } catch (e3) { node = null; } } /* NF-DIMSIL-V1 */
      if (!node) { try { node = render(spec); } catch (e2) { node = null; } }
      if (!node) continue;
      host.setAttribute("data-nf-shape-done", "1");
      host.setAttribute("data-nf-done", "1");
      old = host.querySelector(".nf-dc");
      if (old && old.parentNode) old.parentNode.removeChild(old);
      host.appendChild(node);
      fb = host.parentNode && host.parentNode.querySelector(".nf-dc-fallback");
      if (fb) fb.style.display = "none";
    }
  }
  window.nfDimShapesApply = apply;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply); else apply();
  document.addEventListener("shopify:section:load", apply);
  setTimeout(apply, 400); setTimeout(apply, 1400);
})();
/* ===== /NF-DIMCHART-SHAPES-V1 ===== */
