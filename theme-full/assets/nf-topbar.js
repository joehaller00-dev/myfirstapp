/* NF-TOPBAR-V1 (2026-09-11): secondary top bar dropdowns. Markup: snippets/nf-topbar.liquid. Styles: assets/nf-topbar.css.
   Hover opens after 100ms and closes 200ms after the pointer leaves, like the main mega menu.
   Keyboard: Enter or Space toggles, ArrowDown opens and moves into the panel, Escape closes and returns focus.
   No requestAnimationFrame: a forced reflow starts the fade, so a background tab can never leave a panel stuck.
   NF-TOPBAR-V2 (2026-09-11): panel pictures are lazy and sit in hidden panels, so they would only start loading when a panel
   opens. Pointing at an item (or opening it) switches that panel's pictures to eager, which gives them the 100ms open
   delay as a head start without loading any dropdown picture for visitors who never touch the bar.
   A mouse click on a dropdown item always follows its own link (Best Sellers goes to /collections/best-sellers);
   keyboard and touch still open the dropdown first. Shop By has a tab rail (see the block at the end). */
(function () {
  "use strict";
  var root = document.querySelector("[data-nf-topbar]");
  if (!root || root.__nfTbInit) return;
  root.__nfTbInit = true;

  var OPEN_DELAY = 100, CLOSE_DELAY = 200, FADE = 180, SCROLL_CLOSE = 60, TAB_INTENT = 90;
  var hoverable = window.matchMedia("(hover: hover) and (pointer: fine)");
  var current = null, openTimer = 0, closeTimer = 0, scrollAtOpen = 0, waiting = null;

  function setVw() { root.style.setProperty("--nf-tb-vw", document.documentElement.clientWidth + "px"); }
  setVw();
  window.addEventListener("resize", setVw, { passive: true });

  function clearTimers() { clearTimeout(openTimer); clearTimeout(closeTimer); waiting = null; }

  function warm(panel) {
    if (panel.__nfTbWarm || !panel.firstElementChild) return; /* NF-MENUS-DEFER: an empty panel is warmed once its markup lands */
    panel.__nfTbWarm = true;
    Array.prototype.forEach.call(panel.querySelectorAll("img[loading='lazy']"), function (im) { im.loading = "eager"; });
  }

  function open(p, focusFirst) {
    clearTimers();
    /* NF-MENUS-DEFER (2026-09-14): the panel markup arrives after load (assets/nf-menus.js). Opened before that, wait for it
       and open the moment it lands, unless the pointer has moved on (clearTimers resets waiting). */
    var MN = window.__nfMenus;
    if (MN && !MN.loaded && !p.panel.firstElementChild) {
      waiting = p;
      MN.load().then(function () { if (waiting === p) { waiting = null; open(p, focusFirst); } });
      return;
    }
    if (current === p) {
      if (focusFirst) focusInto(p);
      return;
    }
    if (current) close(current, true);
    current = p;
    scrollAtOpen = window.scrollY;
    warm(p.panel);
    clearTimeout(p.panel.__nfTbHide);
    p.panel.hidden = false;
    void p.panel.offsetWidth; /* forced reflow so the fade runs */
    p.panel.classList.add("is-open");
    p.item.classList.add("is-open");
    p.btn.setAttribute("aria-expanded", "true");
    if (focusFirst) focusInto(p);
  }

  function focusInto(p) {
    var first = p.panel.querySelector("[role='tab'][aria-selected='true'], a[href], button:not([disabled])");
    if (first) first.focus();
  }

  function close(p, instant) {
    if (!p) return;
    p.btn.setAttribute("aria-expanded", "false");
    p.item.classList.remove("is-open");
    p.panel.classList.remove("is-open");
    clearTimeout(p.panel.__nfTbHide);
    if (instant) {
      p.panel.hidden = true;
    } else {
      p.panel.__nfTbHide = setTimeout(function () {
        if (!p.panel.classList.contains("is-open")) p.panel.hidden = true;
      }, FADE);
    }
    if (current === p) current = null;
  }

  function closeAll(instant) { clearTimers(); if (current) close(current, instant); }
  function scheduleClose() { clearTimers(); closeTimer = setTimeout(function () { closeAll(false); }, CLOSE_DELAY); }

  Array.prototype.forEach.call(root.querySelectorAll(".nf-topbar__item"), function (item) {
    var btn = item.querySelector(".nf-topbar__trigger[aria-controls]");
    var panel = btn && document.getElementById(btn.getAttribute("aria-controls"));
    if (!btn || !panel) {
      /* a plain link without children: moving onto it closes whatever is open */
      item.addEventListener("mouseenter", function () { if (current && hoverable.matches) scheduleClose(); });
      return;
    }
    var p = { item: item, btn: btn, panel: panel };

    item.addEventListener("mouseenter", function () {
      if (!hoverable.matches) return;
      warm(panel);
      if (current !== p) { clearTimeout(panel.__nfTbHide); panel.hidden = false; } /* NF-SMOOTH-V1: lay the panel out during the hover intent, not inside open() */
      clearTimers();
      openTimer = setTimeout(function () { open(p, false); }, OPEN_DELAY);
    });
    item.addEventListener("mouseleave", function () {
      if (!hoverable.matches) return;
      if (current === p) scheduleClose(); else { clearTimers(); if (!panel.classList.contains('is-open')) { clearTimeout(panel.__nfTbHide); panel.__nfTbHide = setTimeout(function () { if (!panel.classList.contains('is-open')) panel.hidden = true; }, 250); } } /* NF-SMOOTH-V1 */
    });

    btn.addEventListener("click", function (e) {
      /* e.detail > 0 means a real pointer click (keyboard activation reports 0): with a mouse the item is a link */
      if (e.detail > 0 && hoverable.matches && btn.getAttribute("data-url")) {
        window.location.href = btn.getAttribute("data-url");
        return;
      }
      if (current === p) closeAll(false); else open(p, false);
    });

    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); open(p, true); }
    });
  });

  document.addEventListener("keydown", function (e) {
    if ((e.key === "Escape" || e.key === "Esc") && current) {
      var btn = current.btn;
      var hadFocus = root.contains(document.activeElement);
      closeAll(true);
      if (hadFocus) btn.focus();
    }
  });

  /* keyboard users tabbing out of the bar close it; a click inside a panel does not */
  root.addEventListener("focusout", function (e) {
    if (!current) return;
    var next = e.relatedTarget;
    if (next && !root.contains(next)) closeAll(false);
  });

  document.addEventListener("click", function (e) {
    if (current && !root.contains(e.target)) closeAll(false);
  });

  window.addEventListener("scroll", function () {
    if (current && Math.abs(window.scrollY - scrollAtOpen) > SCROLL_CLOSE) closeAll(false);
  }, { passive: true });

  window.addEventListener("pageshow", function (e) { if (e.persisted) closeAll(true); });

  /* the tablet and phone layouts hide the centre group; never leave a panel open across that change */
  var desk = window.matchMedia("(min-width: 1000px)");
  var onDesk = function () { if (!desk.matches) closeAll(true); };
  if (desk.addEventListener) desk.addEventListener("change", onDesk); else if (desk.addListener) desk.addListener(onDesk);

  /* NF-TOPBAR-V2: Shop By tab rail. Pointing at a tab (after a short intent delay, so a diagonal move to the tiles does not
     flip panes), clicking it or focusing it shows its pane. Arrow Up/Down (or Left/Right), Home and End move between tabs
     with a roving tabindex; Tab moves on into the pane's links. All panes share one grid cell, so the panel keeps the
     height of its tallest pane and switching never makes the page jump. */
  /* NF-MENUS-DEFER: runs again when the panel markup lands after load; each box is wired once */
  function bindSb2() {
  Array.prototype.forEach.call(root.querySelectorAll("[data-nf-sb2]"), function (box) {
    if (box.__nfSb2) return;
    var tabs = Array.prototype.slice.call(box.querySelectorAll("[data-nf-sb2-tab]"));
    if (!tabs.length) return;
    box.__nfSb2 = true;
    var intent = 0;
    function show(t, focus) {
      clearTimeout(intent);
      tabs.forEach(function (x) {
        var on = x === t;
        var pane = document.getElementById(x.getAttribute("aria-controls"));
        x.setAttribute("aria-selected", on ? "true" : "false");
        x.tabIndex = on ? 0 : -1;
        if (pane) {
          pane.classList.toggle("is-active", on);
          if (on) pane.removeAttribute("aria-hidden"); else pane.setAttribute("aria-hidden", "true");
        }
      });
      if (focus) t.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("mouseenter", function () {
        if (!hoverable.matches) return;
        clearTimeout(intent);
        intent = setTimeout(function () { show(t, false); }, TAB_INTENT);
      });
      t.addEventListener("mouseleave", function () { clearTimeout(intent); });
      t.addEventListener("click", function () { show(t, false); });
      t.addEventListener("focus", function () { if (t.getAttribute("aria-selected") !== "true") show(t, false); });
      t.addEventListener("keydown", function (e) {
        var j = -1;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") j = (i + 1) % tabs.length;
        else if (e.key === "ArrowUp" || e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") j = 0;
        else if (e.key === "End") j = tabs.length - 1;
        if (j > -1) { e.preventDefault(); show(tabs[j], true); }
      });
    });
  });
  }
  bindSb2();
  document.addEventListener("nf:menus-loaded", bindSb2);
})();


/* NF-DEFERIMG (2026-09-24): the top bar dropdown panels hold ~50 photos that a visitor only sees if
   they open a menu. Chrome ignores loading="lazy" on an image whose container is display:none and
   fetches it anyway, so on the homepage that was most of the image weight before first paint.
   snippets/nf-topbar-img.liquid now emits data-nfd-src instead of src, and this puts the src back:
   the moment a panel is opened or hovered, and otherwise once the page has been idle for a while. */
(function () {
  if (window.__nfDeferImg) return; window.__nfDeferImg = 1;
  var d = document;
  function hydrate(root) {
    if (!root || !root.querySelectorAll) return 0;
    var a = root.querySelectorAll('img[data-nfd-src]'), n = 0;
    for (var i = 0; i < a.length; i++) {
      var im = a[i], u = im.getAttribute('data-nfd-src');
      if (!u) continue;
      im.removeAttribute('data-nfd-src');
      /* the panels are laid out at zero height until they open, and a lazy image with no size is
         never fetched, so hydration has to opt out of lazy or the menu would show empty boxes */
      im.loading = 'eager';
      im.src = u; n++;
    }
    return n;
  }
  window.__nfHydrateImgs = hydrate;
  /* opening or even approaching the menu fills that panel first */
  function near(e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var p = t.closest('.nf-topbar__item, .nf-tbp, .nf-sb2, .nf-pr2, [data-nf-sb2]');
    if (p) hydrate(p);
  }
  d.addEventListener('pointerenter', near, true);
  d.addEventListener('pointerdown', near, true);
  d.addEventListener('focusin', near, true);
  /* whatever is left gets filled once the page is quiet, so the menu is warm before it is opened */
  function rest() { hydrate(d); }
  function schedule() {
    if ('requestIdleCallback' in window) requestIdleCallback(rest, { timeout: 6000 });
    else setTimeout(rest, 3500);
  }
  if (d.readyState === 'complete') setTimeout(schedule, 2500);
  else window.addEventListener('load', function () { setTimeout(schedule, 2500); });
})();
