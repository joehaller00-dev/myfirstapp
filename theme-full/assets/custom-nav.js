// NORA FURNISH - Custom Nav JS
// Ensures close() only runs after the open animation completes,
// so the opacity transition actually fires.

(function() {
  function patchDisclosure(el) {
    var origClose = el.close.bind(el);

    el.close = function() {
      var panel = el.contentElement;
      if (!panel) { origClose(); return; }

      // If the open animation is still running, wait for it
      var anims = panel.getAnimations().filter(function(a) {
        return a.animationName === 'megaFadeIn' && a.playState === 'running';
      });

      if (anims.length > 0) {
        // Wait for the animation to finish, then close
        anims[0].finished.then(function() {
          origClose();
        }).catch(function() {
          origClose();
        });
      } else {
        origClose();
      }
    };
  }

  function init() {
    document.querySelectorAll('mega-menu-disclosure').forEach(patchDisclosure);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// NORA FURNISH - Variant image to top-left (no page scroll)
// Pulls the selected variant's image into the first (top-left) gallery cell by
// injecting a CSS `order` rule into a <style> tag in <head>. A style rule keeps
// applying to whatever element matches the data-media-id, so it survives Prestige
// re-rendering the gallery/picker on variant change (inline styles would be wiped).
// Desktop grid only; mobile keeps the native swipe carousel. DOM order and image
// count are never changed, so the 2-row grid layout is preserved exactly.
(function() {
  var STYLE_ID = 'nf-variant-order-style';

  function styleEl() {
    var el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(el);
    }
    return el;
  }

  function isDesktopGrid() {
    return window.matchMedia('(min-width: 1000px)').matches;
  }

  document.addEventListener('variant:change', function(event) {
    /* NF round 8: the redesigned product page (marker [data-nf3]) keeps the photo order fixed in CSS, so re-ordering
       here only cost a full gallery re-layout on every option change */
    if (document.querySelector('[data-nf3]')) return;
    var detail = event.detail || {};
    var variant = detail.variant;
    var el = styleEl();

    if (!variant || !variant.featured_media || !isDesktopGrid()) {
      el.textContent = '';
      return;
    }

    el.textContent = 'product-gallery .product-gallery__media[data-media-id="' +
      variant.featured_media.id + '"]{order:-1 !important}';

    var y = window.scrollY, frames = 0;
    (function hold() {
      if (window.scrollY !== y) window.scrollTo(0, y);
      if (++frames < 15) requestAnimationFrame(hold);
    })();
  }, true);
})();

;(function(){
  if(window.__nfSwatchFixer)return;window.__nfSwatchFixer=1;
  var BASE={white:'#ffffff',black:'#1c1c1c',grey:'#9aa0a6',gray:'#9aa0a6',blue:'#2563eb',green:'#2f9e44',red:'#d92d20',orange:'#f2762e',pink:'#e89ab8',purple:'#7e57c2',yellow:'#f2c200',brown:'#7b4a2b',beige:'#e3d3b3',gold:'#d4af37',golden:'#d4af37',silver:'#c0c4c8',bronze:'#8c7853',copper:'#b87333',chrome:'#c4c8cc',walnut:'#5b3a24',oak:'#c9a26a',wood:'#c9a06a',teak:'#b5793f',bamboo:'#d9b878',cream:'#f3e9d2',ivory:'#f5f0e1',khaki:'#b5a16b',kaqi:'#b5a16b',navy:'#1f2d5a',cyan:'#22b8cf',amber:'#e69a2e',coffee:'#5a3c2e',caramel:'#a9682f',camel:'#c19a6b',champagne:'#e6d2a8',burgundy:'#6b2737',wine:'#7b2d3a',terracotta:'#c96a4a',rust:'#b7410e',mauve:'#b784a7',nude:'#e3bc9a',apricot:'#f0b27a',fuchsia:'#d6488b',violet:'#7f3fbf',turmeric:'#d8a32b',ginger:'#c57a2f',hazelnut:'#b5895c',chocolate:'#5a3825',almond:'#f0e9da',sage:'#b2ac88',olive:'#6b7d3a',matcha:'#8aa86b',moss:'#6a7b3a',transparent:'#d9d9d9',clear:'#d9d9d9',tiffany:'#5fd0c5',peach:'#f5b894',blush:'#f0c4cc',lake:'#3a7ca5',peacock:'#1f6f78',azure:'#2f78c4',klein:'#002fa7',royal:'#2a4bd7',space:'#4a4f54',smoke:'#7f8488',lavender:'#b39ddb',indigo:'#3f51b5',teal:'#2aa198',maroon:'#7b2d3a',tan:'#d2b48c',sand:'#e0cda9',charcoal:'#36454f',apple:'#d2b48c',cherry:'#7a3b2e',rubberwood:'#caa473',sandalwood:'#7a3b2e',military:'#4b5320',army:'#4b5320',forest:'#244a34',grass:'#3fa34d',burnt:'#cc5500',rosy:'#c0303a',rose:'#e8a0b0',mustard:'#d4a017',fog:'#9fb0bf',ink:'#15171a',milk:'#f7f3ea',milky:'#f7f3ea',warm:'#f5eedf',natural:'#c8a979',coral:'#f1846a',avocado:'#7a9a4e',lime:'#8bc34a',brick:'#9c4a3c',burgandy:'#6b2737',champange:'#e6d2a8',lvory:'#f5f0e1',yelliow:'#f2c200',purpur:'#7e57c2',coppery:'#b87333',silvery:'#c0c4c8',rosegold:'#b76e79',ash:'#b2beb5',powder:'#f3c6d2',lilac:'#c8a2c8',mint:'#a7e8c8',lotus:'#f3d7de',kaqituo:'#b5a16b',doushafen:'#c76b7f',yanzhifen:'#e08ba0',qingcaolv:'#7cb342',qingshuilan:'#a8cfe0',xingkonghui:'#4a4f54',youyabai:'#f2efe6',walut:'#5b3a24',wihte:'#ffffff',gery:'#9aa0a6',orango:'#f2762e',winered:'#7b2d3a'};
  var PHRASE={'rose gold':'#b76e79','rose red':'#c0303a','rose pink':'#e8a0b0','rosy red':'#c0303a','sky blue':'#7db5e6','baby blue':'#9ec6e8','dusty blue':'#8aa6b8','dusty pink':'#caa0a4','dusty rose':'#c8a2a2','navy blue':'#1f2d5a','royal blue':'#2a4bd7','klein blue':'#002fa7','peacock blue':'#1f6f78','lake blue':'#3a7ca5','lake green':'#5b8a72','azure blue':'#2f78c4','space gray':'#4a4f54','space grey':'#4a4f54','smoke gray':'#7f8488','smoke grey':'#7f8488','silver gray':'#b6bcc0','silver grey':'#b6bcc0','sage green':'#b2ac88','olive green':'#6b7d3a','matcha green':'#8aa86b','moss green':'#6a7b3a','military green':'#4b5320','army green':'#4b5320','forest green':'#244a34','grass green':'#3fa34d','brick red':'#9c4a3c','wine red':'#7b2d3a','burnt orange':'#cc5500','champagne gold':'#d9c08a','peach coral':'#f1a07a','first love powder':'#f3c6d2','pity red':'#c0303a','dream blue':'#9ec6e8','fog blue':'#9fb0bf','greyish blue':'#8aa6b8','blackish green':'#243b2a','greyish green':'#8a9a82','grayish green':'#8a9a82','ink black':'#15171a','ink white':'#f4f4f0','milky white':'#f7f3ea','milk white':'#f7f3ea','warm white':'#f5eedf','cool white':'#eef2f5','cold white':'#eef2f5','marble white':'#f0eee9','almond white':'#f0e9da','ivory white':'#f5f0e1','cream white':'#f5efe2','creamy white':'#f5efe2','off white':'#f3efe6','milky coffee':'#b89a78','natural wood':'#c8a979','original wood':'#c9a06a','oak wood':'#c9a26a','walnut wood':'#5b3a24','cherry wood':'#7a3b2e','apple wood':'#d2b48c','red oak':'#b5793f','black walnut':'#2e2018','deep golden brown':'#6e4a23','coffee brown':'#6b4a36','modern brown':'#6b4a36','walnut brown':'#5e3c26','golden brown':'#8a5a2b','brownish red':'#8a4b3a','terracotta red':'#c96a4a','orange brown':'#a5562b','orange red':'#e8502e','dark sky grey':'#6b7378','tiffany blue':'#5fd0c5','matte black':'#2a2a2a','gray purple':'#9a8fa6','grey purple':'#9a8fa6','colorful blue':'#2563eb','colorful pink':'#e89ab8','dark khaki':'#9a8b4f','olive brown':'#6b5a2b','avocado green':'#7a9a4e','light orange powder':'#f6c9a8','peacock green':'#1f6f5a','lavender purple':'#b39ddb','mount fuji':'#cfd6dd','brown red':'#8a4b3a','gray blue':'#7c96ab','grey blue':'#7c96ab','apple green':'#8db600','black grey':'#3a3d40','black gray':'#3a3d40','blush pink':'#f0c4cc','blushing pink':'#f0c4cc','chocolate brown':'#5a3825','lime green':'#8bc34a','milk coffee':'#b89a78','natural white':'#f7f4ec','nature white':'#f7f4ec','neutral white':'#f4f2ec','yellowish white':'#f7f0dc','orange pink':'#f0916f','pink purple':'#c86ab5','red sandalwood':'#7a3b2e','white wood':'#f2ece2','yellow wood':'#d9b26a','walnut coffee':'#5b3a24','walut coffee':'#5b3a24','baby pink':'#f4c2c2','bohemia blue':'#3b6ea5','bohemia red':'#b3373a','bright blue':'#1e7bd6','cherry powder':'#f2c4d6','fruit green':'#a8d33a','green tea':'#a3c585','mint green':'#a7e8c8','tiffani green':'#5fd0c5','ocean green':'#48a999','light red':'#ff7b72','misty forest':'#5a7d6e','tibetan blue':'#2a5c8a','pumpkin lilac':'#c8a2c8','pumpkin winered':'#7b2d3a','waterproof orango':'#f2762e','rusticwhiterectangle':'#f4f1ea'};
  var MOD={light:1,dark:-1,deep:-1,bright:0.45,pale:1,soft:1};
  var RAINBOW='linear-gradient(to right, rgb(217,45,32) 0 20%, rgb(242,194,0) 20% 40%, rgb(47,158,68) 40% 60%, rgb(37,99,235) 60% 80%, rgb(126,87,194) 80% 100%)';
  var MULTI=['multicolor','multicolour','multi','multi-colored','multi-coloured','rgb','new color','new colour','other color','other colour','other colors','other colours','random color','random colour','seven colors','seven colours','changeable','solar color light','rgb poke ball wall mount'];
  function clamp(v){return Math.max(0,Math.min(255,Math.round(v)));}
  function adj(hex,dir){var h=hex.replace('#','');var r=parseInt(h.substr(0,2),16),g=parseInt(h.substr(2,2),16),b=parseInt(h.substr(4,2),16);var f=(dir>0?0.42:0.34)*Math.abs(dir);if(dir>0){r=r+(255-r)*f;g=g+(255-g)*f;b=b+(255-b)*f;}else if(dir<0){r=r*(1-f);g=g*(1-f);b=b*(1-f);}return '#'+[r,g,b].map(function(x){return ('0'+clamp(x).toString(16)).slice(-2);}).join('');}
  function lum(hex){var h=hex.replace('#','');return (0.299*parseInt(h.substr(0,2),16)+0.587*parseInt(h.substr(2,2),16)+0.114*parseInt(h.substr(4,2),16))/255;}
  function collapse(str){var s=String(str||''),o='';for(var i=0;i<s.length;i++){var c=s.charCodeAt(i);o+=(c<33)?' ':s[i];}while(o.indexOf('  ')>=0)o=o.split('  ').join(' ');return o.trim();}
  var phraseKeys=Object.keys(PHRASE).sort(function(a,b){return b.length-a.length;});
  var baseKeys=Object.keys(BASE).sort(function(a,b){return b.length-a.length;});
  /* NF-PERF5-0912: the light/dark x colour table (900 adj() calls) was rebuilt inside every parse(); build it once */var __mp=null;function modPairs(){if(!__mp){__mp=[];Object.keys(MOD).forEach(function(m){baseKeys.forEach(function(b){__mp.push([m+' '+b,adj(BASE[b],MOD[m])]);});});}return __mp;}function parse(label){var raw=' '+String(label).toLowerCase()+' ',clean='';for(var i=0;i<raw.length;i++){var ch=raw[i];clean+=((ch>='a'&&ch<='z')||ch===' ')?ch:' ';}while(clean.indexOf('  ')>=0)clean=clean.split('  ').join(' ');var s=' '+clean.trim()+' ';var found=[];function take(pat,hex){var needle=' '+pat+' ',idx;while((idx=s.indexOf(needle))>=0){found.push({pos:idx,hex:hex});s=s.slice(0,idx+1)+new Array(pat.length+1).join(' ')+s.slice(idx+1+pat.length);}}phraseKeys.forEach(function(p){take(p,PHRASE[p]);});modPairs().forEach(function(mp){take(mp[0],mp[1]);});baseKeys.forEach(function(b){take(b,BASE[b]);});found.sort(function(a,b){return a.pos-b.pos;});var cols=[];found.forEach(function(f){if(!cols.length||cols[cols.length-1]!==f.hex)cols.push(f.hex);});return cols;}
  /* NF-PERF5-0912: one parse per distinct label */var __bgm={};function bgFor(label){var k0=String(label);return Object.prototype.hasOwnProperty.call(__bgm,k0)?__bgm[k0]:(__bgm[k0]=bgFor0(label));}function bgFor0(label){var mk=collapse(label).toLowerCase();if(MULTI.indexOf(mk)>=0)return {bg:RAINBOW,light:false};var c=parse(label);if(!c.length)return null;if(c.length===1)return {bg:c[0],light:lum(c[0])>0.82};var seg=100/c.length,stops=c.map(function(x,i){return x+' '+(i*seg)+'% '+((i+1)*seg)+'%';}).join(', ');return {bg:'linear-gradient(to right, '+stops+')',light:c.some(function(x){return lum(x)>0.82;})};}
  var probe;function validCss(c){if(!probe)probe=document.createElement('span');probe.style.color='';try{probe.style.color=c;}catch(e){}return probe.style.color!=='';}
  function nameOf(el,cur){var t=collapse(el.textContent);if(t&&t.length<60)return t;var p=cur.indexOf('to right,');if(p>=0){var inner=cur.slice(p+9,cur.lastIndexOf(')'));var parts=inner.split(',').map(function(x){return x.trim();});if(parts.length%2===0&&parts.length>0){var hh=parts.length/2;if(parts.slice(0,hh).join(', ')===parts.slice(hh).join(', '))return parts.slice(0,hh).join(', ');}}return t;}
  function fix(el){/* NF-PERF4-0911: read the inline value first; getComputedStyle here forced a full style recalc after every DOM change */var cur=el.style.getPropertyValue('--swatch-background');if(!cur)cur=getComputedStyle(el).getPropertyValue('--swatch-background');if(!cur)return;if(cur.indexOf('#')>=0||cur.indexOf('rgb(')>=0||cur.indexOf('url(')>=0)return;var name=nameOf(el,cur);if(!name)return;var r=bgFor(name);if(r){el.style.setProperty('--swatch-background',r.bg,'important');if(r.light)el.classList.add('nf-light');}else if(validCss(name)){el.style.setProperty('--swatch-background',name,'important');}else{el.style.setProperty('--swatch-background','#e9e9e9','important');el.classList.add('nf-textchip');el.setAttribute('title',name);}}
  function sweep(){var els=document.querySelectorAll('label.color-swatch,[style*="--swatch-background"]');for(var i=0;i<els.length;i++)fix(els[i]);}
  function injectCss(){if(document.getElementById('nf-swatch-css'))return;var st=document.createElement('style');st.id='nf-swatch-css';st.textContent='.color-swatch.nf-light{box-shadow:inset 0 0 0 1px rgba(0,0,0,.22)!important;}.color-swatch.nf-textchip{background:#e9e9e9!important;box-shadow:inset 0 0 0 1px #c4c4c4!important;}';(document.head||document.documentElement).appendChild(st);}
  function run(){injectCss();sweep();}
  if(document.readyState!=='loading')run();
  document.addEventListener('DOMContentLoaded',run);
  window.addEventListener('load',function(){sweep();});
  var t,lastSweep=0;
  /* NF-PERF5-0912: fix only the swatches inside added nodes; a whole-document sweep ran after every DOM change on the page */
  var SWSEL='label.color-swatch,[style*="--swatch-background"]';
  function sched(recs){for(var i=0;i<recs.length;i++)for(var a=recs[i].addedNodes,j=0;j<a.length;j++){var n=a[j];if(n.nodeType===1){if(n.matches&&n.matches(SWSEL))fix(n);if(n.firstElementChild)for(var q=n.querySelectorAll(SWSEL),k=0;k<q.length;k++)fix(q[k]);}}}
  new MutationObserver(sched).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('variant:change',function(){setTimeout(sweep,60);});
})();


/* ============================================================
   NF MOBILE SEARCH PANEL (2026-08-06)
   Two mobile-only fixes:
   1. Dock the panel flush under the header. Its CSS 'top' is a hardcoded
      104px, but the real mobile header bottom is ~83px, so it floated
      21px low and looked detached. We read the header's live position
      at open time, which is also correct when the announcement bar is
      present or the header has resized.
   2. Lock background scroll. 'body { overflow:hidden }' does NOT hold on
      mobile, so the page still scrolled behind the open panel. Use the
      position:fixed technique and restore scroll position on close.
   Desktop is untouched.
   ============================================================ */
(function () {
  var MOBILE = '(max-width: 768px)';
  var panel = document.getElementById('header-search-panel');
  if (!panel) return;

  function isMobile() { return window.matchMedia(MOBILE).matches; }
  function header() {
    return document.querySelector('.shopify-section--header') ||
           document.querySelector('header');
  }

  // The mobile header is NOT sticky, so once the shopper has scrolled it is off
  // screen entirely. Pin it to the top of the viewport while search is open,
  // otherwise the panel docks to y=0 and visually REPLACES the nav.
  function pinHeader() {
    var h = header();
    if (!h || h.hasAttribute('data-nf-pinned')) return;
    /* NF-MOBILE-V4: the phone header is sticky and already on screen; pinning it fixed took it out of the flow and shifted the page */
    var hp = getComputedStyle(h).position, hr = h.getBoundingClientRect();
    if ((hp === 'sticky' || hp === 'fixed') && hr.top > -2 && hr.bottom > 0) return;
    h.setAttribute('data-nf-pinned', h.getAttribute('style') || '');
    h.style.position = 'fixed';
    h.style.top = '0';
    h.style.left = '0';
    h.style.right = '0';
    h.style.zIndex = '10000';
  }

  function unpinHeader() {
    var h = header();
    if (!h || !h.hasAttribute('data-nf-pinned')) return;
    var prev = h.getAttribute('data-nf-pinned');
    h.removeAttribute('data-nf-pinned');
    if (prev) { h.setAttribute('style', prev); } else { h.removeAttribute('style'); }
  }

  function dock() {
    if (!isMobile()) { panel.style.top = ''; return; }
    var h = header();
    if (!h) return;
    // Header is pinned at y=0 while open, so its bottom IS the correct offset.
    var bottom = Math.max(0, Math.round(h.getBoundingClientRect().bottom));
    panel.style.setProperty('top', bottom + 'px', 'important');
  }

  /* NF-MOBILE-V4 (2026-09-12): lock the ROOT scroller (html.nf-m4-lock, overflow hidden) instead of position:fixed
     on body. scrollY never changes, so the page cannot jump and there is nothing to restore (no scrollTo) on close.
     Older iOS that ignores overflow on the root is held by a non passive touchmove guard outside the panel. */
  function guard(e) {
    var t = e.target;
    if (t && t.closest && t.closest('#header-search-panel')) return;
    if (e.cancelable) e.preventDefault();
  }
  function lock() {
    if (document.body.hasAttribute('data-nf-scroll-lock')) return;
    var y = window.scrollY || window.pageYOffset || 0;
    document.body.setAttribute('data-nf-scroll-lock', String(y));
    document.documentElement.classList.add('nf-m4-lock');
    document.addEventListener('touchmove', guard, { passive: false });
  }

  function unlock() {
    if (!document.body.hasAttribute('data-nf-scroll-lock')) return;
    document.body.removeAttribute('data-nf-scroll-lock');
    document.documentElement.classList.remove('nf-m4-lock');
    document.removeEventListener('touchmove', guard, { passive: false });
  }

  function sync() {
    var open = panel.classList.contains('is-open');
    if (open && isMobile()) {
      pinHeader();
      dock();                          // NF-SMOOTH-V1: read the header before the root lock class write
      lock();
      requestAnimationFrame(dock);     // again after layout settles
    } else {
      unlock();
      unpinHeader();
      if (!open) panel.style.top = '';
    }
  }

  new MutationObserver(sync).observe(panel, { attributes: true, attributeFilter: ['class'] });

  window.addEventListener('resize', function () {
    if (panel.classList.contains('is-open')) dock();
  });
  window.addEventListener('orientationchange', function () {
    setTimeout(function () { if (panel.classList.contains('is-open')) dock(); }, 250);
  });

  sync();
})();


/* NF-REVIEWS-V2 START -------------------------------------------------------
   1. The star badge above the product title is an <a href='#nf-reviews'>, but
      no element with that id exists (the Judge.me app block renders as
      #judgeme_product_reviews) and #nf-curtain swallows anchor clicks, so the
      badge did nothing. Scroll to the widget instead.
   2. NF-REVIEWS-HONEST-V1 (2026-09-11): reviewer names are shown exactly as
      Judge.me provides them. Masked handles such as 'J***n' stay masked and a
      review with no name at all reads 'Verified Buyer'. This block used to
      invent full names for those reviews; that path was removed as deceptive.
   3. Tag reviews with a 'Verified Buyer' chip beside the name.
--------------------------------------------------------------------------- */
(function () {
  var CHIP_LABEL = 'Verified Buyer';

  function reviewsEl() {
    return document.getElementById('judgeme_product_reviews') ||
           document.querySelector('.jdgm-review-widget, .jm-review-widget');
  }
  document.addEventListener('click', function (e) {
    if (!e.target || !e.target.closest) return;
    var badge = e.target.closest('.nf-stars');
    if (!badge || badge.classList.contains('nf-stars--card')) return;
    var el = reviewsEl();
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    var y = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, true);

  /* NF-REVIEWS-HONEST-V1 (2026-09-11, owner approved) -----------------------
     REMOVED: the name-invention path (a list of first names plus a hash of the
     review text) that rewrote masked names like 'J***n' and the literal
     'Verified Buyer' into made up full names such as 'Dawn W.'. Showing real
     reviews under invented identities is deceptive (FTC Consumer Reviews and
     Testimonials rule, 16 CFR 465). Names now render exactly as Judge.me
     provides them; only a review with no name at all is labelled
     'Verified Buyer'. Do NOT reintroduce generated or 'plausible' names here
     or anywhere else on the storefront. Display layer only: Judge.me data is
     untouched. The pre-change file is backed up as
     newbuild/honestnames/custom-nav.js.ORIGINAL-before-honest-v1.js.
  --------------------------------------------------------------------------- */
  function dress(item) {
    if (item.getAttribute('data-nf-rev') === '1') return;
    var nameEl = item.querySelector('.jm-reviewer-info__name, .jdgm-rev__author');
    if (!nameEl) return;
    item.setAttribute('data-nf-rev', '1');

    var shown = (nameEl.textContent || '').trim();
    if (!shown || shown.indexOf('*') > -1 || shown.toLowerCase() === CHIP_LABEL.toLowerCase()) { nameEl.textContent = 'Anonymous'; shown = 'Anonymous'; } /* NF-NAMES-ANON 2026-09-14: owner, masked or missing names read Anonymous with the Verified Buyer chip */

    /* The chip goes on every review so both import batches look alike. It is
       skipped only where the name itself already reads 'Verified Buyer', so
       the label is not printed twice. */
    if (shown.toLowerCase() !== CHIP_LABEL.toLowerCase() &&
        !item.querySelector('.nf-vb') && nameEl.parentNode) {
      var chip = document.createElement('span');
      chip.className = 'nf-vb';
      chip.textContent = CHIP_LABEL;
      nameEl.parentNode.appendChild(chip);
    }
  }

  /* The widget header ships the average as a bare number. Mirror the star bar
     used above the product title so the summary reads at a glance. */
  function avgStars() {
    var host = document.querySelector('.jm-average-rating-display .jm-cluster') ||
               document.querySelector('.jm-average-rating-display');
    if (!host || host.querySelector('.nf-stars--avg')) return;
    var src = document.querySelector('.nf-stars:not(.nf-stars--card):not(.nf-stars--avg)');
    if (!src) return;
    var bar = src.cloneNode(true);
    bar.removeAttribute('href');
    bar.removeAttribute('aria-label');
    bar.setAttribute('aria-hidden', 'true');
    bar.className = 'nf-stars nf-stars--avg';
    var count = bar.querySelector('.nf-stars__count');
    if (count) count.parentNode.removeChild(count);
    host.insertBefore(bar, host.children[1] || null);
  }

  var busy = false;
  function run() {
    if (busy) return;
    busy = true;
    var items = document.querySelectorAll('.jm-review-item, .jdgm-rev');
    for (var i = 0; i < items.length; i++) { try { dress(items[i]); } catch (err) {} }
    try { avgStars(); } catch (err) {}
    busy = false;
  }

  function boot() {
    run();
    var host = reviewsEl() || document.body;
    var timer = null;
    new MutationObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(run, 60);
    }).observe(host, { childList: true, subtree: true });
    [300, 900, 2000, 4000].forEach(function (t) { setTimeout(run, t); });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
/* NF-REVIEWS-V2 END */



/* NF-QA-V1 START -----------------------------------------------------------
   Questions and answers under the reviews, the way Dazuma runs it. Judge.me
   gates Q and A behind a paid plan, so this is ours: answers live in the
   product metafield custom.qa, and new questions post through the theme
   contact form so they land in the store inbox to be answered.
   Built with DOM calls rather than HTML strings so quoting cannot break it.
--------------------------------------------------------------------------- */
(function () {
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function hidden(form, name, value) {
    var i = document.createElement('input');
    i.type = 'hidden';
    i.name = name;
    i.value = value == null ? '' : value;
    form.appendChild(i);
  }

  function start() {
    var dataEl = document.getElementById('nf-qa-data');
    var metaEl = document.getElementById('nf-qa-meta');
    if (!dataEl || !metaEl) return;

    var items = [];
    try { items = JSON.parse(dataEl.textContent) || []; } catch (e) { items = []; }
    if (!Array.isArray(items)) items = [];
    var meta = {};
    try { meta = JSON.parse(metaEl.textContent) || {}; } catch (e) { meta = {}; }

    var posted = /[?&]contact_posted=true/.test(location.search);
    var count = items.length;

    var sec = el('section', 'nf-qa');
    sec.id = 'nf-questions';
    var inner = el('div', 'nf-qa__inner');
    sec.appendChild(inner);

    var head = el('div', 'nf-qa__head');
    var h = el('h2', 'nf-qa__title', 'Questions');
    if (count) h.appendChild(el('span', 'nf-qa__n', ' (' + count + ')'));
    head.appendChild(h);
    var ask = el('button', 'nf-qa__ask', 'Ask a question');
    ask.type = 'button';
    head.appendChild(ask);
    inner.appendChild(head);

    if (posted) {
      inner.appendChild(el('p', 'nf-qa__thanks',
        'Thanks, your question has been sent. We answer every question and will post the answer here.'));
    }

    var form = el('form', 'nf-qa__form');
    form.method = 'post';
    form.action = '/contact#nf-questions';
    form.hidden = true;
    hidden(form, 'form_type', 'contact');
    hidden(form, 'utf8', String.fromCharCode(10003));
    hidden(form, 'contact[Question about]', meta.title);
    hidden(form, 'contact[Product page]', meta.url);

    var lb = el('label', 'nf-qa__label', 'Your question');
    lb.htmlFor = 'nf-qa-body';
    form.appendChild(lb);
    var ta = el('textarea', 'nf-qa__input');
    ta.id = 'nf-qa-body';
    ta.name = 'contact[body]';
    ta.rows = 3;
    ta.required = true;
    ta.placeholder = 'What would you like to know about this piece?';
    form.appendChild(ta);

    var le = el('label', 'nf-qa__label', 'Email, so we can tell you when it is answered');
    le.htmlFor = 'nf-qa-email';
    form.appendChild(le);
    var em = el('input', 'nf-qa__input');
    em.id = 'nf-qa-email';
    em.type = 'email';
    em.name = 'contact[email]';
    em.required = true;
    form.appendChild(em);

    var acts = el('div', 'nf-qa__actions');
    var send = el('button', 'nf-qa__send', 'Send question');
    send.type = 'submit';
    acts.appendChild(send);
    acts.appendChild(el('span', 'nf-qa__note',
      'We answer every question, usually within one business day.'));
    form.appendChild(acts);
    inner.appendChild(form);

    if (count) {
      var list = el('ol', 'nf-qa__list');
      items.forEach(function (it) {
        var li = el('li', 'nf-qa__item');
        var pq = el('p', 'nf-qa__q');
        pq.appendChild(el('span', 'nf-qa__mark', 'Q'));
        pq.appendChild(document.createTextNode(it.q == null ? '' : String(it.q)));
        li.appendChild(pq);

        /* Only a real asker is named. Store written entries stay unattributed
           rather than implying a customer asked them. */
        if (it.asker || it.date) {
          var pm = el('p', 'nf-qa__meta');
          if (it.asker) pm.appendChild(document.createTextNode(String(it.asker)));
          if (it.date) pm.appendChild(el('span', 'nf-qa__date', String(it.date)));
          li.appendChild(pm);
        }

        var pa = el('p', 'nf-qa__a');
        pa.appendChild(el('span', 'nf-qa__mark nf-qa__mark--a', 'A'));
        pa.appendChild(document.createTextNode(it.a == null ? '' : String(it.a)));
        li.appendChild(pa);
        li.appendChild(el('p', 'nf-qa__by', 'Answered by Nora Furnish'));
        list.appendChild(li);
      });
      inner.appendChild(list);
    } else {
      inner.appendChild(el('p', 'nf-qa__empty',
        'No questions on this piece yet. Ask the first one and we will answer it right here.'));
    }

    var widget = document.getElementById('judgeme_product_reviews') ||
                 document.querySelector('.jm-review-widget, .jdgm-review-widget');
    var anchor = widget ? (widget.closest('.shopify-section') || widget) : null;
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(sec, anchor.nextSibling);
    } else {
      var main = document.querySelector('main');
      if (main) main.appendChild(sec);
    }

    ask.addEventListener('click', function () {
      form.hidden = !form.hidden;
      if (!form.hidden) ta.focus();
    });

    /* The question count beside the star badge scrolls here. */
    document.addEventListener('click', function (e) {
      if (!e.target || !e.target.closest) return;
      if (!e.target.closest('.nf-qcount')) return;
      e.preventDefault();
      e.stopPropagation();
      window.scrollTo({ top: sec.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
    }, true);

    if (posted) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else { start(); }
})();
/* NF-QA-V1 END */


/* NF-COLLECTION-V1 START ---------------------------------------------------
   Collection toolbar rebuilt to the layout the owner asked for:
   FILTER toggle plus a small product count on the left, sort and view on the
   right, and exactly two views, the grid and a Dazuma style row list.
   Prestige ships three grid densities and no row view, so the row view is ours.
--------------------------------------------------------------------------- */
(function () {
  var FKEY = 'nf_filters_open';
  var VKEY = 'nf_view_mode';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function start() {
    var coll = document.querySelector('.collection');
    var bar = document.querySelector('.collection-toolbar');
    if (!coll || !bar) return;

    var list = coll.querySelector('product-list');
    var sidebar = coll.querySelector('.facets-sidebar');
    var count = bar.querySelector('.collection-toolbar__products-count');

    /* ---- FILTER toggle. The sidebar layout drops the theme button, so
           this puts one back and collapses the column on demand. ---- */
    if (sidebar && !bar.querySelector('.nf-filter-toggle')) {
      var fbtn = el('button', 'nf-filter-toggle', 'Filter');
      fbtn.type = 'button';
      var open = true;
      try { open = localStorage.getItem(FKEY) !== '0'; } catch (e) {}
      function applyFilters(v) {
        coll.classList.toggle('nf-nofilters', !v);
        fbtn.classList.toggle('is-active', v);
        fbtn.setAttribute('aria-expanded', v ? 'true' : 'false');
      }
      applyFilters(open);
      fbtn.addEventListener('click', function () {
        open = !open;
        try { localStorage.setItem(FKEY, open ? '1' : '0'); } catch (e) {}
        applyFilters(open);
      });
      bar.insertBefore(fbtn, bar.firstChild);
    }

    /* NF-TOOLBAR-V3: a flexible spacer pins Sort and the views to the right on
       every collection, instead of relying on the product count's auto margin
       (a collection that renders without a count put them on the left). */
    if (!bar.querySelector('.nf-tb-spacer')) {
      var spacer = el('span', 'nf-tb-spacer');
      spacer.setAttribute('aria-hidden', 'true');
      bar.appendChild(spacer);
    }

    /* ---- Two views: grid and rows ---- */
    if (list && !bar.querySelector('.nf-views')) {
      var views = el('div', 'nf-views');
      var gbtn = el('button', 'nf-view nf-view--grid');
      gbtn.type = 'button';
      gbtn.setAttribute('aria-label', 'Grid view');
      var rbtn = el('button', 'nf-view nf-view--rows');
      rbtn.type = 'button';
      rbtn.setAttribute('aria-label', 'Row view');
      views.appendChild(gbtn);
      views.appendChild(rbtn);

      function decorate() {
        var cards = list.querySelectorAll('.product-card');
        for (var i = 0; i < cards.length; i++) {
          var card = cards[i];
          if (card.querySelector('.nf-row-actions')) continue;
          var link = card.querySelector('a.product-card__media') ||
                     card.querySelector('a.product-title');
          if (!link) continue;
          var box = el('div', 'nf-row-actions');
          var a1 = el('a', 'nf-row-btn nf-row-btn--primary', 'Choose options');
          a1.href = link.getAttribute('href');
          var a2 = el('a', 'nf-row-btn', 'View details');
          a2.href = link.getAttribute('href');
          box.appendChild(a1);
          box.appendChild(a2);
          card.appendChild(box);
        }
      }

      var mode = 'grid';
      try { mode = localStorage.getItem(VKEY) === 'rows' ? 'rows' : 'grid'; } catch (e) {}
      function applyView(m) {
        var rows = m === 'rows';
        coll.classList.toggle('nf-rows', rows);
        gbtn.classList.toggle('is-active', !rows);
        rbtn.classList.toggle('is-active', rows);
        if (rows) decorate();
      }
      applyView(mode);
      gbtn.addEventListener('click', function () {
        mode = 'grid';
        try { localStorage.setItem(VKEY, mode); } catch (e) {}
        applyView(mode);
      });
      rbtn.addEventListener('click', function () {
        mode = 'rows';
        try { localStorage.setItem(VKEY, mode); } catch (e) {}
        applyView(mode);
      });
      if (count && count.parentNode === bar) {
        bar.appendChild(views);
      } else { bar.appendChild(views); }

      /* Filtering and paging swap the list, so re-decorate on change. */
      var t = null;
      new MutationObserver(function () {
        clearTimeout(t);
        t = setTimeout(function () {
          if (coll.classList.contains('nf-rows')) decorate();
        }, 80);
      }).observe(list, { childList: true, subtree: true });
    }
  }

  window.nfCollectionStart = start;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else { start(); }
})();
/* NF-COLLECTION-V1 END */

/* ==================== NF-PRICE-RANGE-V1 ====================
   The price facet is two range inputs stacked on the same track. The second
   one is absolutely positioned and comes later in the DOM, so it paints on
   top. Drag the lower thumb to the far right and it lands underneath the
   upper thumb: every click there hits the upper input, which is already at
   its maximum, so the lower dot looks welded to the right edge.

   Two rules give the top slot to whichever thumb the shopper means:
   proximity while the pointer is over the track, and, as the resting state,
   the lower thumb once it is past the halfway mark.
   z-index does nothing on a statically positioned element, so the first
   input also needs position:relative before any of this bites.           */
(function () {
  var TOP = "3";

  function thumbs(host) {
    return host.querySelectorAll('input[type="range"]');
  }

  function frac(input) {
    var lo = parseFloat(input.min) || 0;
    var hi = parseFloat(input.max) || 0;
    if (hi <= lo) return 0;
    return ((parseFloat(input.value) || 0) - lo) / (hi - lo);
  }

  function lift(host, winner) {
    var rs = thumbs(host);
    for (var n = 0; n < rs.length; n++) {
      if (!rs[n].__nfPos) { rs[n].__nfPos = 1; if (getComputedStyle(rs[n]).position === "static") rs[n].style.position = "relative"; } /* NF-PERF4-0911: once per input */
      var want = rs[n] === winner ? TOP : "";
      if (rs[n].style.zIndex !== want) rs[n].style.zIndex = want;
    }
  }

  function settle(host) {
    var rs = thumbs(host);
    if (rs.length < 2) return;
    lift(host, frac(rs[0]) > 0.5 ? rs[0] : rs[1]);
  }

  function nearest(host, x) {
    var rs = thumbs(host);
    if (rs.length < 2) return;
    var box = rs[0].getBoundingClientRect();
    if (!box.width) return;
    var at = (x - box.left) / box.width;
    var best = null, bestGap = Infinity;
    for (var n = 0; n < rs.length; n++) {
      var gap = Math.abs(frac(rs[n]) - at);
      if (gap < bestGap) { bestGap = gap; best = rs[n]; }
    }
    lift(host, best);
  }

  function host(e) {
    var t = e.target;
    return t && t.closest ? t.closest("price-range") : null;
  }

  document.addEventListener("pointermove", function (e) {
    var h = host(e);
    if (h) nearest(h, e.clientX);
  }, true);

  document.addEventListener("input", function (e) {
    var h = host(e);
    if (h) settle(h);
  }, true);

  function settleAll() {
    var hs = document.querySelectorAll("price-range");
    for (var n = 0; n < hs.length; n++) settle(hs[n]);
  }

  /* Prestige replaces the whole facet block on every filter change, so the
     fresh inputs need settling again. The listeners above are delegated and
     survive on their own. */
  /* NF-PERF5-0912: settle when idle (clean layout, no forced style recalc mid-load) and only when a price-range is added or re-rendered */
  function idleSettle(ms) { if (window.requestIdleCallback) requestIdleCallback(settleAll, { timeout: ms || 1500 }); else setTimeout(settleAll, 60); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { idleSettle(); });
  } else {
    idleSettle();
  }
  new MutationObserver(function (recs) {
    for (var i = 0; i < recs.length; i++) {
      var r = recs[i], tg = r.target;
      if (tg.nodeType === 1 && tg.closest && tg.closest("price-range")) { idleSettle(300); return; }
      for (var a = r.addedNodes, j = 0; j < a.length; j++) {
        var n = a[j];
        if (n.nodeType === 1 && (n.tagName === "PRICE-RANGE" || (n.querySelector && n.querySelector("price-range")))) { idleSettle(300); return; }
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();

/* ==================== NF-SMOOTH-V1 ====================
   The star badge and the question count both jumped the page instead of
   scrolling it, so the reader lost their place. #nf-curtain also swallows
   plain anchor clicks, which is why these needed a handler at all.
   Capture phase, so it runs before the curtain handler.                */
(function () {
  function target(el) {
    if (el.closest(".nf-stars") && !el.closest(".nf-stars--card")) {
      return document.querySelector("#judgeme_product_reviews, .jdgm-rev-widg, .jm-review-widget");
    }
    var a = el.closest('a[href^="#"]');
    if (a) {
      var id = a.getAttribute("href").slice(1);
      if (id === "nf-questions") return document.querySelector("#nf-questions");
      if (id) return document.getElementById(id);
    }
    return null;
  }
  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest ? target(e.target) : null;
    if (!t) return;
    e.preventDefault();
    e.stopPropagation();
    var header = document.querySelector(".header, header");
    var offset = (header ? header.getBoundingClientRect().height : 0) + 16;
    var y = t.getBoundingClientRect().top + window.pageYOffset - offset;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }, true);
})();

/* ==================== NF-TOOLBAR-V3 ====================
   Replaces NF-STICKY-FILTERS-V2. Two faults the owner kept hitting:
   1. Prestige re-renders the whole collection section on every filter or sort
      change. That threw away the Filter button, the view toggles and the spacer
      that pins Sort and the views to the right, so the controls moved around from
      collection to collection and after every filter click.
   2. V2 wrote the sidebar offset onto the sidebar element itself. The re-render
      swaps the sidebar out, and the new one fell back to the 120px default and slid
      up under the toolbar.
   The offsets now live on <html>, which is never replaced, the toolbar rests flush
   under the header at the theme's own --sticky-area-height (there was a 41px gap
   the grid scrolled through), and NF-COLLECTION's start() is re-run whenever a
   fresh toolbar arrives. */
(function () {
  /* NF-PERF5-0912: read the height after the frame's own layout (no forced layout mid-load); write the :root var only when it changed */
  var mq = 0, lastTb = "";
  function measure() {
    if (mq) return;
    mq = 1;
    requestAnimationFrame(function () { setTimeout(function () {
      mq = 0;
      var tb = document.querySelector(".collection-toolbar");
      if (!tb) return;
      var h = tb.offsetHeight;
      if (h > 0 && h + "px" !== lastTb) { lastTb = h + "px"; document.documentElement.style.setProperty("--nf-tb-h", lastTb); }
    }, 0); });
  }
  function heal() {
    var tb = document.querySelector(".collection-toolbar");
    if (!tb) return;
    if (!tb.querySelector(".nf-tb-spacer") && typeof window.nfCollectionStart === "function") {
      window.nfCollectionStart();
    }
    // inline offsets left by V2 on a surviving sidebar would outrank the root value
    var sb = document.querySelector(".facets-sidebar");
    if (sb) {
      sb.style.removeProperty("--nf-sticky-top");
      sb.style.removeProperty("max-height");
      sb.style.removeProperty("top");
    }
    measure();
  }
  var t = 0;
  function schedule() {
    if (t) return;
    t = setTimeout(function () { t = 0; heal(); }, 40);
  }
  function boot() {
    heal();
    /* NF-PERF5-0912: re-heal only when the collection, its toolbar or the filter column changes */
    new MutationObserver(function (recs) {
      for (var i = 0; i < recs.length; i++) {
        var r = recs[i], tg = r.target;
        if (tg.nodeType === 1 && tg.closest && tg.closest(".collection, .collection-toolbar, .facets-sidebar, .shopify-section--main-collection")) { schedule(); return; }
        for (var a = r.addedNodes, j = 0; j < a.length; j++) {
          var n = a[j];
          if (n.nodeType === 1 && (n.matches(".collection, .collection-toolbar, .facets-sidebar") || n.querySelector(".collection-toolbar, .facets-sidebar"))) { schedule(); return; }
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("shopify:section:load", schedule);
    // the Filter toggle eases the column in instead of snapping it open
    document.addEventListener("click", function (e) {
      var b = e.target && e.target.closest ? e.target.closest(".nf-filter-toggle") : null;
      if (!b) return;
      var coll = document.querySelector(".collection");
      var sb = coll && coll.querySelector(".facets-sidebar");
      if (!coll || !sb || coll.classList.contains("nf-nofilters")) return;
      sb.classList.remove("nf-side-enter");
      void sb.offsetWidth;
      sb.classList.add("nf-side-enter");
      setTimeout(function () { sb.classList.remove("nf-side-enter"); }, 420);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
/* ==================== /NF-TOOLBAR-V3 ==================== */

/* ==================== NF-QUICKVIEW-V3 ====================
   The magnifier on a card opens a small panel with the gallery, price and options.
   V3 (owner, 2026-09-10): the panel shows the reviews, and Dimensions, Materials
   and Care & Maintenance are real accordions instead of flat paragraphs.
   Everything below the price is read from the product page the panel already
   fetches, so there is no extra request. Built with createElement/textContent;
   the only markup reused is the accordion copy, which is our own metafield HTML
   cloned from our own page with scripts, handlers and inline styles stripped.
   Reviews: imported reviewers without a usable name are shown with the Verified
   Buyer chip only. The product page invents a stable display name for those from
   the rendered widget text, which this panel cannot reproduce exactly, and two
   different names for one review would read as fake. */
(function () {
  var money = function (cents) {
    return "$" + (cents / 100).toFixed(2);
  };
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function sized(src, w) {
    if (!src) return "";
    return src + (src.indexOf("?") > -1 ? "&" : "?") + "width=" + w;
  }
  var NS = "http://www.w3.org/2000/svg";
  var starSeq = 0;
  function star(fill) {
    var s = document.createElementNS(NS, "svg");
    s.setAttribute("viewBox", "0 0 20 20");
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("class", "nf-qv__star");
    var id = "nfqvs" + (++starSeq);
    var defs = document.createElementNS(NS, "defs");
    var lg = document.createElementNS(NS, "linearGradient");
    lg.setAttribute("id", id);
    var pct = Math.round(fill * 100) + "%";
    var a = document.createElementNS(NS, "stop");
    a.setAttribute("offset", pct);
    a.setAttribute("stop-color", "currentColor");
    var b = document.createElementNS(NS, "stop");
    b.setAttribute("offset", pct);
    b.setAttribute("stop-color", "#e4ddd2");
    lg.appendChild(a);
    lg.appendChild(b);
    defs.appendChild(lg);
    s.appendChild(defs);
    var p = document.createElementNS(NS, "path");
    p.setAttribute("d", "M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z");
    p.setAttribute("fill", "url(#" + id + ")");
    s.appendChild(p);
    return s;
  }
  function stars(score, cls) {
    var w = el("span", "nf-qv__stars" + (cls ? " " + cls : ""));
    for (var i = 0; i < 5; i++) w.appendChild(star(Math.max(0, Math.min(1, score - i))));
    w.setAttribute("role", "img");
    w.setAttribute("aria-label", score.toFixed(1) + " out of 5 stars");
    return w;
  }
  function anonymous(n) {
    n = (n || "").trim();
    return !n || n.indexOf("*") > -1 ||
      /^(verified buyer|aliexpress shopper|anonymous|a ?shopper|customer)$/i.test(n);
  }
  function fmtDate(s) {
    var m = String(s || "").match(/(\d{4})-(\d{2})-(\d{2})/);
    return m ? m[2] + "/" + m[3] + "/" + m[1] : "";
  }

  // Both requests start the moment the pointer reaches the magnifier, so by the
  // time it is clicked the product is usually already here.
  var cacheJ = {}, cacheH = {};
  function getJson(h) {
    if (!cacheJ[h]) {
      cacheJ[h] = fetch("/products/" + h + ".js", { headers: { Accept: "application/json" } })
        .then(function (r) { if (!r.ok) throw new Error("js"); return r.json(); })
        .catch(function (e) { delete cacheJ[h]; throw e; });
    }
    return cacheJ[h];
  }
  function getHtml(h) {
    if (!cacheH[h]) {
      cacheH[h] = fetch("/products/" + h)
        .then(function (r) { if (!r.ok) throw new Error("html"); return r.text(); })
        .catch(function (e) { delete cacheH[h]; throw e; });
    }
    return cacheH[h];
  }
  function warm(e) {
    var b = e.target && e.target.closest ? e.target.closest(".nf-qv-open") : null;
    if (!b) return;
    var h = b.getAttribute("data-handle");
    if (h) getJson(h).then(function (p) { getHtml(p.handle); }).catch(function () {});
  }
  document.addEventListener("pointerover", warm, { passive: true });
  document.addEventListener("focusin", warm);
  document.addEventListener("touchstart", warm, { passive: true });
  function favicon() {
    var l = document.querySelector('link[rel~="icon"]') || document.querySelector('link[rel*="icon"]');
    return l ? l.href : "//norafurnish.com/cdn/shop/files/CLEAN_FAVICON_5d2cf12a-af04-42d0-b484-32f64b64db3a.png";
  }

  var overlay, panel, lastFocus, seq = 0;
  function close() {
    if (!overlay) return;
    seq++;
    overlay.classList.remove("is-open");
    clearTimeout(overlay.__nfHide);
    overlay.__nfHide = setTimeout(function () { overlay.hidden = true; }, 260);
    document.documentElement.style.removeProperty("overflow");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function shell() {
    if (overlay) return;
    overlay = el("div", "nf-qv");
    overlay.hidden = true;
    panel = el("div", "nf-qv__panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "Quick view");
    var x = el("button", "nf-qv__close", "×");
    x.setAttribute("type", "button");
    x.setAttribute("aria-label", "Close");
    x.addEventListener("click", close);
    panel.appendChild(x);
    overlay.appendChild(panel);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    document.body.appendChild(overlay);
  }

  function render(p) {
    var body = el("div", "nf-qv__body");
    var left = el("div", "nf-qv__media");
    var main = el("img", "nf-qv__main");
    main.alt = p.title;
    main.src = sized(p.featured_image || (p.images && p.images[0]) || "", 800);
    left.appendChild(main);
    var strip = el("div", "nf-qv__thumbs");
    (p.images || []).slice(0, 8).forEach(function (src) {
      var t = el("img", "nf-qv__thumb");
      t.src = sized(src, 120);
      t.alt = "";
      t.addEventListener("click", function () { main.src = sized(src, 800); });
      strip.appendChild(t);
    });
    left.appendChild(strip);

    var right = el("div", "nf-qv__info");
    right.appendChild(el("h2", "nf-qv__title", p.title));
    var rate = el("a", "nf-qv__rating");
    rate.href = p.url + "#judgeme_product_reviews";
    rate.hidden = true;
    right.appendChild(rate);

    var priceRow = el("div", "nf-qv__price");
    priceRow.appendChild(el("span", "nf-qv__now", (p.price_varies ? "From " : "") + /* NF-ACC-V1: a fixture card carries its fixture From price in data-nf-from (accessory variants skipped) */ ((function () { var c = lastFocus && lastFocus.closest ? lastFocus.closest("product-card") : null; var f = c && c.getAttribute("data-nf-from"); return f || money(p.price); })())));
    if (p.compare_at_price && p.compare_at_price > p.price) {
      priceRow.appendChild(el("span", "nf-qv__was", money(p.compare_at_price)));
    }
    right.appendChild(priceRow);

    (p.options_with_values || p.options || []).forEach(function (opt) {
      if (!opt || !opt.values || opt.values.length < 2) return;
      var row = el("div", "nf-qv__opt");
      row.appendChild(el("span", "nf-qv__optname", opt.name));
      var vals = el("div", "nf-qv__vals");
      opt.values.slice(0, 14).forEach(function (v) {
        vals.appendChild(el("span", "nf-qv__val", typeof v === "string" ? v : v.name));
      });
      row.appendChild(vals);
      right.appendChild(row);
    });

    // One variant means there is nothing to choose, so the button adds to cart.
    var single = p.variants && p.variants.length === 1;
    var actions = el("div", "nf-qv__actions");
    var go = el("a", "nf-qv__cta", single ? "Add to cart" : "Choose options");
    go.href = p.url;
    if (single && p.variants[0].available !== false) go.setAttribute("data-nf-add", String(p.variants[0].id));
    actions.appendChild(go);
    var more = el("a", "nf-qv__link", "View full details");
    more.href = p.url;
    actions.appendChild(more);
    right.appendChild(actions);

    right.appendChild(el("div", "nf-qv__accs"));
    right.appendChild(el("div", "nf-qv__reviews"));

    body.appendChild(left);
    body.appendChild(right);
    return body;
  }

  function cleanBody(src) {
    var box = el("div", "nf-qv__acc-body");
    var c = src.cloneNode(true);
    var kill = c.querySelectorAll("script,style,iframe,form,button,input,select,textarea,[data-nf-dims],.nf-dc,.nf-dc-host");
    for (var i = 0; i < kill.length; i++) {
      if (kill[i].parentNode) kill[i].parentNode.removeChild(kill[i]);
    }
    var all = c.querySelectorAll("*");
    for (var j = 0; j < all.length; j++) {
      var n = all[j];
      for (var k = n.attributes.length - 1; k >= 0; k--) {
        var an = n.attributes[k].name;
        if (/^on/i.test(an) || an === "style" || an === "id" || an === "hidden") n.removeAttribute(an);
      }
    }
    while (c.firstChild) box.appendChild(c.firstChild);
    return box;
  }
  function hasText(node) {
    return node.textContent.replace(/\s+/g, "").length > 0;
  }
  function stripHint(box) {
    // "Select your preferred option above" points at a picker the panel does not have
    var tw = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = tw.nextNode())) {
      n.nodeValue = n.nodeValue.replace(/\s*Select your preferred option above\.?/i, "");
    }
  }

  function reviewsFrom(doc) {
    var w = doc.querySelector(".jdgm-rev-widg");
    if (!w) return null;
    var n = parseInt(w.getAttribute("data-number-of-reviews") || "0", 10);
    if (!n) return null;
    var avg = parseFloat(w.getAttribute("data-average-rating") || "0") || 0;
    var list = [], seen = {};
    var revs = doc.querySelectorAll(".jdgm-rev");
    for (var i = 0; i < revs.length && list.length < Math.min(3, n); i++) {
      var r = revs[i];
      // the page carries each review twice (two widget templates): keep one
      var rid = r.getAttribute("data-review-id") || "";
      if (rid) { if (seen[rid]) continue; seen[rid] = 1; }
      var body = r.querySelector(".jdgm-rev__body");
      var text = body ? body.textContent.replace(/\s+/g, " ").trim() : "";
      if (!text || seen["t" + text]) continue;
      seen["t" + text] = 1;
      var sc = r.querySelector(".jdgm-rev__rating");
      var ts = r.querySelector(".jdgm-rev__timestamp");
      var au = r.querySelector(".jdgm-rev__author");
      var tt = r.querySelector(".jdgm-rev__title");
      var sv = sc ? (parseFloat(sc.getAttribute("data-score") || "0") || 0) : 0;
      // owner: the preview shows only 4 and 5 star reviews, labelled Top reviews; every review stays on the product page
      if (sv < 4) continue;
      list.push({
        score: sc ? (parseFloat(sc.getAttribute("data-score") || "5") || 5) : 5,
        date: ts ? (ts.getAttribute("data-content") || "") : "",
        name: au ? au.textContent.trim() : "",
        title: tt ? tt.textContent.trim() : "",
        text: text
      });
    }
    return { avg: avg, n: n, list: list };
  }

  var WANT = [["dimensions", "Dimensions"], ["materials", "Materials"], ["care", "Care & Maintenance"]];

  function enhance(p, html, token) {
    if (token !== seq) return;
    var info = panel.querySelector(".nf-qv__info");
    if (!info) return;
    var doc = new DOMParser().parseFromString(html, "text/html");

    // rating under the title, linked to the reviews on the product page
    var rv = reviewsFrom(doc);
    var rate = info.querySelector(".nf-qv__rating");
    if (rv && rate) {
      rate.appendChild(stars(rv.avg));
      rate.appendChild(el("span", "nf-qv__rating-num", rv.avg.toFixed(1)));
      rate.appendChild(el("span", "nf-qv__rating-count", rv.n + (rv.n === 1 ? " review" : " reviews")));
      rate.hidden = false;
    }

    // the three accordions, in the product page's own wording
    var accs = info.querySelector(".nf-qv__accs");
    var found = {};
    var ds = doc.querySelectorAll("details");
    for (var i = 0; i < ds.length; i++) {
      var d = ds[i];
      if (d.closest(".header, header, .mega-menu, .shopify-section--header")) continue;
      var sm = d.querySelector("summary");
      if (!sm) continue;
      var lab = sm.textContent.replace(/\s+/g, " ").trim().toLowerCase();
      for (var w = 0; w < WANT.length; w++) {
        if (found[WANT[w][0]] || lab.indexOf(WANT[w][0]) !== 0) continue;
        var content = d.querySelector(".accordion__content") || sm.nextElementSibling;
        if (content) found[WANT[w][0]] = content;
      }
    }
    WANT.forEach(function (want) {
      var src = found[want[0]];
      if (!src || !accs) return;
      var payload = "";
      var hostEl = src.querySelector("[data-nf-dims]");
      if (hostEl) {
        try { payload = JSON.parse(hostEl.getAttribute("data-nf-dims") || "{}").text || ""; } catch (e) {}
      }
      var b = cleanBody(src);
      if (!hasText(b) && payload) {
        b.textContent = payload;
        b.classList.add("is-plain");
      }
      if (want[0] === "dimensions") stripHint(b);
      if (!hasText(b)) return;
      var det = el("details", "nf-qv__acc");
      var sum = el("summary", "nf-qv__acc-head");
      sum.appendChild(el("span", "nf-qv__acc-title", want[1]));
      sum.appendChild(el("span", "nf-qv__acc-icon"));
      det.appendChild(sum);
      det.appendChild(b);
      accs.appendChild(det);
    });

    // up to three reviews, in the order the product page shows them
    var host = info.querySelector(".nf-qv__reviews");
    if (rv && rv.list.length && host) {
      var head = el("div", "nf-qv__rev-head");
      head.appendChild(el("p", "nf-qv__rev-heading", "Top reviews"));
      var allLink = el("a", "nf-qv__rev-all", "Read all " + rv.n + (rv.n === 1 ? " review" : " reviews"));
      allLink.href = p.url + "#judgeme_product_reviews";
      head.appendChild(allLink);
      host.appendChild(head);
      rv.list.forEach(function (r) {
        var item = el("div", "nf-qv__rev");
        var top = el("div", "nf-qv__rev-top");
        top.appendChild(stars(r.score, "nf-qv__stars--sm"));
        var meta = el("span", "nf-qv__rev-meta");
        meta.appendChild(el("span", "nf-qv__rev-name", anonymous(r.name) ? "Anonymous" : r.name));
        meta.appendChild(el("span", "nf-qv__vb", "Verified Buyer"));
        var dt = fmtDate(r.date);
        if (dt) meta.appendChild(el("span", "nf-qv__rev-date", dt));
        top.appendChild(meta);
        item.appendChild(top);
        if (r.title) item.appendChild(el("p", "nf-qv__rev-title", r.title));
        var text = r.text.length > 260 ? r.text.slice(0, 257).replace(/\s+\S*$/, "") + "…" : r.text;
        item.appendChild(el("p", "nf-qv__rev-text", text));
        host.appendChild(item);
      });
    }
  }

  function open(handle, trigger) {
    shell();
    lastFocus = trigger;
    var token = ++seq;
    var old = panel.querySelector(".nf-qv__body");
    if (old) old.remove();
    // a blank panel the size of the finished one with the NF icon twirling, instead of a bare "Loading"
    var ld = el("div", "nf-qv__body nf-qv__body--loading");
    ld.setAttribute("aria-busy", "true");
    ld.setAttribute("aria-label", "Loading");
    var sp = el("span", "nf-qv__spin");
    var ic = el("img", "nf-qv__spin-icon");
    ic.src = favicon();
    ic.alt = "";
    sp.appendChild(ic);
    ld.appendChild(sp);
    panel.appendChild(ld);
    clearTimeout(overlay.__nfHide);
    overlay.hidden = false;
    void overlay.offsetWidth; // forced reflow: rAF stalls in background tabs
    overlay.classList.add("is-open");
    document.documentElement.style.setProperty("overflow", "hidden");
    var closeBtn = panel.querySelector(".nf-qv__close");
    if (closeBtn && closeBtn.focus) closeBtn.focus({ preventScroll: true });
    getJson(handle)
      .then(function (p) {
        if (token !== seq) return;
        var stale = panel.querySelector(".nf-qv__body");
        if (stale) stale.remove();
        panel.appendChild(render(p));
        // the .js payload carries no metafields or reviews, so read the page itself
        getHtml(p.handle)
          .then(function (html) { enhance(p, html, token); })
          .catch(function () {});
      })
      .catch(function () { close(); });
  }

  function handleOf(card) {
    var a = card.querySelector("a[href*='/products/']");
    if (!a) return null;
    var m = a.getAttribute("href").match(/\/products\/([^?#\/]+)/);
    return m ? m[1] : null;
  }
  function decorate() {
    var cards = document.querySelectorAll(".product-card");
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      if (card.getAttribute("data-nf-qv")) continue;
      var handle = handleOf(card);
      if (!handle) continue;
      card.setAttribute("data-nf-qv", "1");
      var fig = card.querySelector(".product-card__figure") || card;
      var btn = el("button", "nf-qv-open");
      btn.setAttribute("type", "button");
      btn.setAttribute("aria-label", "Quick view");
      btn.setAttribute("data-handle", handle);
      // inline SVG: a CSS background icon rendered as a bare white dot
      btn.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">' +
        '<circle cx="8.6" cy="8.6" r="5.6" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        '<path d="M12.7 12.7L17 17" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
      fig.appendChild(btn);
      var nVar = parseInt(card.getAttribute("data-nf-variants") || "0", 10);
      var vid = card.getAttribute("data-nf-variant-id") || "";
      var single = nVar === 1 && vid;
      var cta = el("a", "nf-card-cta", single ? "Add to cart" : "Choose options");
      cta.href = "/products/" + handle;
      if (single) {
        cta.setAttribute("data-nf-add", vid);
        cta.classList.add("nf-card-cta--add");
      }
      fig.appendChild(cta);
    }
    // row view: the same one-variant rule for its primary button
    var rows = document.querySelectorAll(".product-card .nf-row-btn--primary:not([data-nf-rowfix])");
    for (var r = 0; r < rows.length; r++) {
      var rc = rows[r].closest(".product-card");
      rows[r].setAttribute("data-nf-rowfix", "1");
      var rn = parseInt((rc && rc.getAttribute("data-nf-variants")) || "0", 10);
      var rv = rc && rc.getAttribute("data-nf-variant-id");
      if (rn === 1 && rv) {
        rows[r].textContent = "Add to cart";
        rows[r].setAttribute("data-nf-add", rv);
      }
    }
  }
  document.addEventListener("click", function (e) {
    var add = e.target && e.target.closest ? e.target.closest("[data-nf-add]") : null;
    if (add) {
      e.preventDefault();
      e.stopPropagation();
      var id = add.getAttribute("data-nf-add");
      var was = add.textContent;
      add.textContent = "Adding";
      fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ items: [{ id: Number(id), quantity: 1 }] })
      }).then(function (r) {
        if (!r.ok) throw new Error("add failed");
        add.textContent = "Added";
        document.dispatchEvent(new CustomEvent("cart:refresh", { bubbles: true }));
        setTimeout(function () { add.textContent = was; }, 1600);
      }).catch(function () {
        // never leave the shopper stuck on a dead button
        window.location.href = add.getAttribute("href");
      });
      return;
    }
    var b = e.target && e.target.closest ? e.target.closest(".nf-qv-open") : null;
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    open(b.getAttribute("data-handle"), b);
  }, true);
  function start() {
    decorate();
    /* the grid is replaced wholesale on filter and page changes */
    var t = 0;
    new MutationObserver(function () {
      if (t) return;
      t = setTimeout(function () { t = 0; decorate(); }, 30);
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
/* ==================== /NF-QUICKVIEW-V3 ==================== */

/* ==================== NF-REVIEW-TABS-V1 ====================
   Reviews and questions were two separate stacked sections. Dazuma puts them
   on one row of tabs with the two calls to action stacked at the right, which
   is both tidier and stops the questions being buried below a long review
   list. The Q and A section is moved into the widget rather than rebuilt, so
   the posting form and the counts keep working exactly as before.        */
(function () {
  var done = false;
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function build() {
    if (done) return;
    var widget = document.querySelector(".jm-review-widget, #judgeme_product_reviews");
    var qa = document.querySelector("#nf-questions");
    if (!widget) return;
    done = true;

    var reviewCount = 0;
    var badge = document.querySelector(".nf-stars__count");
    if (badge) {
      var m = badge.textContent.match(/(\d+)/);
      if (m) reviewCount = parseInt(m[1], 10);
    }
    var qCount = qa ? qa.querySelectorAll(".nf-qa__item").length : 0;

    var bar = el("div", "nf-rt");
    var tabs = el("div", "nf-rt__tabs");
    var tR = el("button", "nf-rt__tab is-on", "Reviews (" + reviewCount + ")");
    tR.setAttribute("type", "button");
    tabs.appendChild(tR);
    var tQ = null;
    if (qa) {
      tQ = el("button", "nf-rt__tab", "Questions (" + qCount + ")");
      tQ.setAttribute("type", "button");
      tabs.appendChild(tQ);
    }
    bar.appendChild(tabs);

    var acts = el("div", "nf-rt__acts");
    /* the widget owns the write-a-review flow, so borrow its own button */
    var wr = widget.querySelector(".jm-button");
    var write = el("button", "nf-rt__btn nf-rt__btn--solid", "Write a review");
    write.setAttribute("type", "button");
    write.addEventListener("click", function () { if (wr) wr.click(); });
    /* ours replaces the widget's own button rather than sitting beside it */
    if (wr) wr.style.setProperty("display", "none", "important");
    acts.appendChild(write);
    if (qa) {
      var ask = el("a", "nf-rt__btn", "Ask a question");
      ask.href = "#nf-questions";
      ask.addEventListener("click", function (e) {
        e.preventDefault();
        show(false);
        var form = qa.querySelector("form, textarea, input");
        if (form && form.focus) form.focus();
      });
      acts.appendChild(ask);
    }
    bar.appendChild(acts);

    /* insertBefore needs the widget's OWN parent, not an ancestor section, or
       it throws and the whole tab bar silently never appears. */
    var section = widget.parentNode;
    section.insertBefore(bar, widget);

    if (qa) {
      var qaSection = qa.closest(".shopify-section");
      section.insertBefore(qa, widget.nextSibling);
      if (qaSection && qaSection !== qa && !qaSection.contains(qa)) { qaSection.remove(); }
      qa.classList.add("nf-rt__panel");
    }

    function show(reviews) {
      tR.classList.toggle("is-on", reviews);
      if (tQ) tQ.classList.toggle("is-on", !reviews);
      widget.hidden = !reviews;
      if (qa) qa.hidden = reviews;
    }
    tR.addEventListener("click", function () { show(true); });
    if (tQ) tQ.addEventListener("click", function () { show(false); });
    show(true);
  }
  /* NF-PERF5-0912: no review widget or Q&A on this page, so there is nothing to poll for (was 30 x 400ms on every page) */
  if (!document.querySelector("#judgeme_product_reviews,.jm-review-widget,.jdgm-review-widget,#nf-questions")) return;
  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    build();
    if (done || tries > 30) clearInterval(timer);
  }, 400);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();

/* ==================== NF-DEDUPE-WRITE-V1 ====================
   Ours sits in the tab bar, so the widget's own Write a review button is a
   duplicate. It re-renders on sort and paginate, hence the observer.     */
(function () {
  function hide() {
    var w = document.querySelector(".jm-review-widget");
    if (!w) return;
    var b = w.querySelectorAll(".jm-button");
    for (var i = 0; i < b.length; i++) {
      if (/write a review/i.test(b[i].textContent || "")) {
        b[i].style.setProperty("display", "none", "important");
      }
    }
  }
  hide();
  /* NF-PERF5-0912: react only to nodes added inside a review widget */
  new MutationObserver(function (recs) {
    for (var i = 0; i < recs.length; i++) for (var a = recs[i].addedNodes, j = 0; j < a.length; j++) {
      var n = a[j], e = n.nodeType === 1 ? n : n.parentNode;
      if (e && e.nodeType === 1 && (e.closest(".jm-review-widget") || e.querySelector(".jm-button"))) { hide(); return; }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();


/* ===== NF-RCAROUSEL-V2 : arrows for the homepage customer photo rail ===== */
(function(){
  function wire(rail){
    if (rail.__nfRcWired) return;
    rail.__nfRcWired = true;
    var wrap = rail.closest('.nf-rcw__rail');
    if (!wrap) return;
    var prev = wrap.querySelector('.nf-rcw__nav--prev');
    var next = wrap.querySelector('.nf-rcw__nav--next');
    if (!prev || !next) return;
    function step(){
      var card = rail.querySelector('.nf-rc__card');
      var w = card ? card.getBoundingClientRect().width : 300;
      var per = Math.max(1, Math.floor((rail.clientWidth - 20) / (w + 18)));
      return (w + 18) * per;
    }
    function sync(){
      var max = rail.scrollWidth - rail.clientWidth - 2;
      prev.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft >= max;
    }
    function glide(delta){
      /* arrows glide even with reduced motion: short, started by the shopper */ var from = rail.scrollLeft, max = rail.scrollWidth - rail.clientWidth;
      var to = Math.max(0, Math.min(from + delta, max));
      if (to === from) return;
      rail.scrollTo({ left: to, behavior: 'smooth' }); /* NF-SMOOTH-V1: browser smooth scroll on the compositor; NF-SMOOTH-ARROWS glides it under reduced motion */
    }
    prev.addEventListener('click', function(){ glide(-step()); });
    next.addEventListener('click', function(){ glide(step()); });
    rail.addEventListener('scroll', function(){
      if (rail.__nfRcRaf) return;
      rail.__nfRcRaf = requestAnimationFrame(function(){ rail.__nfRcRaf = 0; sync(); });
    }, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }
  function init(){
    var rails = document.querySelectorAll('[data-nf-rc]');
    for (var i = 0; i < rails.length; i++) wire(rails[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  document.addEventListener('shopify:section:load', init);
  setTimeout(init, 900);
})();
/* ===== /NF-RCAROUSEL-V2 ===== */


/* ==================== NF-SORT-LABEL-V1 ====================
   Owner (Notepad doc): the Sort by button never said what it was sorting by.
   Dazuma reads "Sort by: Featured". The label is rebuilt from the option the
   theme marks aria-selected, and re-applied after every section re-render.
   Only a text node is changed, and characterData is not observed, so it
   cannot loop. */
(function () {
  function apply() {
    var sel = document.querySelector('facets-sort-popover .popover__value-option[aria-selected="true"]');
    if (!sel) return;
    // NF-TOOLBAR-COMPACT-V1: the "Sort by:" label now sits outside the pill (CSS), the pill shows only the value
    var want = sel.textContent.replace(/\s+/g, " ").trim();
    var btns = document.querySelectorAll('button[aria-controls^="sort-by"]');
    for (var i = 0; i < btns.length; i++) {
      var span = btns[i].querySelector(".text-with-icon") || btns[i];
      for (var c = span.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3 && c.nodeValue.trim()) {
          if (c.nodeValue.trim() !== want) c.nodeValue = want;
          break;
        }
      }
    }
  }
  var t = 0;
  function schedule() {
    if (t) return;
    t = setTimeout(function () { t = 0; apply(); }, 60);
  }
  function boot() {
    apply();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-selected"] });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
/* ==================== /NF-SORT-LABEL-V1 ==================== */


/* ==================== NF-TITLE-ROWS-V1 ====================
   Titles are clamped to two lines. Reserving two lines on every card (CB-V1)
   lined prices up, but on wide cards with short titles it left an empty line
   above the price ("the price is too low"). Now each row reserves the height of
   its tallest title only: a row of one-line titles has no gap, a mixed row still
   lines its prices up. The height goes into a CSS variable so the stylesheet
   stays in charge. Hidden cards (inactive homepage tabs) are skipped and picked
   up by the ResizeObserver when their tab opens. */
(function () {
  var busy = false;
  function layout() {
    if (busy) return;
    busy = true;
    var titles = document.querySelectorAll(".product-card .product-card__info .product-title");
    var rows = {}, i, t, card, r, key;
    for (i = 0; i < titles.length; i++) titles[i].style.removeProperty("--nf-title-min");
    for (i = 0; i < titles.length; i++) {
      t = titles[i];
      card = t.closest(".product-card");
      if (!card) continue;
      r = card.getBoundingClientRect();
      if (!r.width) continue;
      var host = card.parentElement ? card.parentElement.closest("product-list, .product-list, [class*=carousel], .shopify-section") : null;
      key = (host ? (host.id || host.className || "h") : "h") + "|" + Math.round(r.top + window.pageYOffset);
      (rows[key] = rows[key] || []).push(t);
    }
    for (key in rows) {
      var list = rows[key], max = 0, j, h;
      if (list.length < 2) continue;
      for (j = 0; j < list.length; j++) { h = list[j].getBoundingClientRect().height; if (h > max) max = h; }
      for (j = 0; j < list.length; j++) list[j].style.setProperty("--nf-title-min", Math.ceil(max) + "px");
    }
    busy = false;
  }
  var t0 = 0;
  function schedule() { clearTimeout(t0); t0 = setTimeout(layout, 90); }
  var ro = window.ResizeObserver ? new ResizeObserver(schedule) : null;
  function watch() {
    if (!ro) return;
    var lists = document.querySelectorAll("product-list, .product-list");
    for (var i = 0; i < lists.length; i++) {
      if (!lists[i].__nfRows) { lists[i].__nfRows = 1; ro.observe(lists[i]); }
    }
  }
  function boot() {
    watch();
    if (!ro) layout(); /* NF-PERF5-0912: the ResizeObserver's first callback runs layout() after the page's own layout; running it here forced a layout mid-load */
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("load", schedule);
    /* NF-PERF5-0912: re-run only when cards or their lists change, not after every DOM change on the page */
    new MutationObserver(function (recs) {
      for (var i = 0; i < recs.length; i++) {
        var r = recs[i], tg = r.target;
        if (tg.nodeType === 1 && tg.closest && tg.closest("product-list, .product-list, [class*=carousel], .product-card")) { watch(); schedule(); return; }
        for (var a = r.addedNodes, j = 0; j < a.length; j++) {
          var n = a[j];
          if (n.nodeType === 1 && (n.matches(".product-card, product-list, .product-list") || n.querySelector(".product-card"))) { watch(); schedule(); return; }
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
/* ==================== /NF-TITLE-ROWS-V1 ==================== */


/* ==================== NF-HEADER-STEADY-V1 ====================
   Owner: the nav and the filter bar sliding up and down on scroll felt choppy and
   got in the way. Dazuma never hides its header, so nothing moves and it is smooth.
   On desktop the header now stays put (theme.liquid's auto-hide is overruled in
   CSS), a few pixels of its top padding scroll away through a negative sticky top,
   and the toolbar and filter column sit at fixed offsets under it. This script only
   measures the header into a CSS variable; the compositor does all the scrolling. */
(function () {
  /* NF-PERF5-0912: read the header height after the frame's own layout; write the :root var only when it changed */
  var hq = 0, lastHdr = "";
  function measure() {
    if (hq) return;
    hq = 1;
    requestAnimationFrame(function () { setTimeout(function () {
      hq = 0;
      var hs = document.querySelector(".shopify-section--header");
      if (!hs) return;
      var h = hs.offsetHeight;
      if (h > 0 && h + "px" !== lastHdr) { lastHdr = h + "px"; document.documentElement.style.setProperty("--nf-hdr-h", lastHdr); }
    }, 0); });
  }
  var t = 0;
  function schedule() { clearTimeout(t); t = setTimeout(measure, 80); }
  function boot() {
    measure();
    window.addEventListener("resize", schedule, { passive: true });
    var hs = document.querySelector(".shopify-section--header");
    if (hs && window.ResizeObserver) new ResizeObserver(schedule).observe(hs);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
/* ==================== /NF-HEADER-STEADY-V1 ==================== */

/* ==================== NF-SIDE-CTA-V1 ====================
   Owner: a good looking button under the filters, like Dazuma's "Shop newest
   arrivals". On the New Arrivals collection it offers Best Sellers instead. Added
   back after every section re-render, since the sidebar is replaced on each filter. */
(function () {
  function add() {
    var sb = document.querySelector(".facets-sidebar");
    if (!sb || sb.querySelector(".nf-side-cta")) return;
    var onNew = /^\/collections\/new-arrivals(\/|$)/.test(location.pathname);
    var a = document.createElement("a");
    a.className = "nf-side-cta";
    a.href = onNew ? "/collections/best-sellers" : "/collections/new-arrivals";
    var s = document.createElement("span");
    s.textContent = onNew ? "Shop Best Sellers" : "Shop New Arrivals";
    a.appendChild(s);
    var ar = document.createElement("span");
    ar.className = "nf-side-cta__arrow";
    ar.setAttribute("aria-hidden", "true");
    ar.textContent = "\u2192";
    a.appendChild(ar);
    sb.appendChild(a);
  }
  var t = 0;
  function schedule() { if (t) return; t = setTimeout(function () { t = 0; add(); }, 60); }
  function boot() { add(); new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
/* ==================== /NF-SIDE-CTA-V1 ==================== */


/* ==================== NF-SALE-NOCLICK-V1 ====================
   Owner: "Sale" opens the dropdown, but clicking it goes nowhere; shoppers pick
   Best Sellers, New Arrivals or Clearance. Prestige follows data-follow-link on a
   summary click, so this capture listener stops that for the Sale item only. */
(function () {
  document.addEventListener("click", function (e) {
    var s = e.target && e.target.closest ? e.target.closest("summary[data-follow-link]") : null;
    if (!s) return;
    var link = s.getAttribute("data-follow-link") || "";
    var title = (s.getAttribute("data-title") || "").trim().toLowerCase();
    if (title === "sale" || /\/collections\/sale\/?$/.test(link)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
})();
/* ==================== /NF-SALE-NOCLICK-V1 ==================== */


/* NF-SMOOTH-ARROWS (2026-09-10): every carousel arrow on the store glides.
   Chrome on Windows switches native smooth scrolling off when system animations are off (the owner's setting), which
   made Prestige product sliders and the journal jump. Any element scrollTo/scrollBy asking for behavior 'smooth' now
   runs on this eased frame loop. Page (window) scrolling and instant scrolls are left alone. */
(function () {
  if (window.__nfSmoothArrows || !window.requestAnimationFrame) return;
  window.__nfSmoothArrows = true;
  var P = Element.prototype, nativeTo = P.scrollTo, nativeBy = P.scrollBy;
  if (!nativeTo || !nativeBy) return;
  var runs = new Map();
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function num(v) { if (v == null) return null; v = +v; return isFinite(v) ? v : null; }
  function skip(el, o) {
    return !o || typeof o !== 'object' || o.behavior !== 'smooth' || document.hidden || !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) /* NF-SMOOTH-V1: glide only where Chrome drops native smooth scroll */ ||
      el === document.documentElement || el === document.body || el === document.scrollingElement;
  }
  function stop(el) {
    var run = runs.get(el);
    if (!run) return;
    cancelAnimationFrame(run.raf);
    runs.delete(el);
    el.style.scrollSnapType = run.snap;
    el.style.scrollBehavior = run.sb;
  }
  function glide(el, x, y) {
    var old = runs.get(el);
    var run = old ? { snap: old.snap, sb: old.sb } : { snap: el.style.scrollSnapType, sb: el.style.scrollBehavior };
    if (old) cancelAnimationFrame(old.raf);
    var fx = el.scrollLeft, fy = el.scrollTop;
    run.tx = x == null ? fx : Math.max(0, Math.min(el.scrollWidth - el.clientWidth, x));
    run.ty = y == null ? fy : Math.max(0, Math.min(el.scrollHeight - el.clientHeight, y));
    runs.set(el, run);
    var dist = Math.max(Math.abs(run.tx - fx), Math.abs(run.ty - fy));
    if (dist < 1) { stop(el); return; }
    var dur = Math.min(760, Math.max(440, dist * 0.55)), t0 = null;
    function frame(now) {
      if (t0 === null) t0 = now;
      var k = Math.min(1, (now - t0) / dur), e = ease(k);
      /* Prestige clears the inline snap type on every scrollend, so hold it off for the whole glide */
      if (el.style.scrollSnapType !== 'none') el.style.scrollSnapType = 'none';
      if (el.style.scrollBehavior !== 'auto') el.style.scrollBehavior = 'auto';
      el.scrollLeft = fx + (run.tx - fx) * e;
      el.scrollTop = fy + (run.ty - fy) * e;
      if (k < 1) run.raf = requestAnimationFrame(frame); else stop(el);
    }
    el.style.scrollSnapType = 'none';
    el.style.scrollBehavior = 'auto';
    run.raf = requestAnimationFrame(frame);
  }
  P.scrollTo = function (o) {
    if (skip(this, o)) return nativeTo.apply(this, arguments);
    glide(this, num(o.left), num(o.top));
  };
  P.scrollBy = function (o) {
    if (skip(this, o)) return nativeBy.apply(this, arguments);
    var run = runs.get(this), dx = num(o.left), dy = num(o.top);
    /* a second click mid glide continues from where the first one was heading */
    glide(this, dx == null ? null : (run ? run.tx : this.scrollLeft) + dx, dy == null ? null : (run ? run.ty : this.scrollTop) + dy);
  };
  function interrupt(e) {
    if (!runs.size) return;
    runs.forEach(function (run, el) { if (el.contains(e.target)) stop(el); });
  }
  ['wheel', 'touchstart', 'pointerdown'].forEach(function (type) {
    document.addEventListener(type, interrupt, { capture: true, passive: true });
  });
})();


/* ==================== NF-MOBILE-UI-V1 ====================
   Owned by the mobile UI pass (2026-09-11). Phones and tablets filter through the
   theme's own facets drawer (#facets-drawer), which custom-nav.css NF-MOBILE-UI-V1
   opens full screen. The drawer already locks the page, traps focus, hands focus back
   to FILTER, closes on Escape and applies the choices as it closes. This block adds:
   1. FILTER button: the word plus a chip with the number of active filters.
   2. In the drawer: Shop New Arrivals (Shop Best Sellers on New Arrivals), a Clear all
      button beside Apply, and a live result count on Apply.
   3. html.nf-mui-open while the drawer is open (hides the chat button over Apply).
   The collection section is re-rendered on every filter or sort, which replaces the
   toolbar and the drawer, so everything is re-applied from a body observer.
   The drawer and this button are hidden by the theme from 1000px up, so desktop and
   laptop are untouched. Markup is built with createElement and textContent only. */
(function () {
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* 1. FILTER button */
  function enhanceButtons() {
    var bs = document.querySelectorAll('.collection-toolbar button[aria-controls="facets-drawer"]');
    for (var i = 0; i < bs.length; i++) {
      var b = bs[i];
      if (b.querySelector('.nf-mui-flabel')) continue;
      var raw = (b.textContent || '').replace(/\s+/g, ' ').trim();
      var m = raw.match(/\((\d+)\)/);
      var n = m ? parseInt(m[1], 10) : 0;
      var label = raw.replace(/\(\d+\)/, '').trim() || 'Filter';
      while (b.firstChild) b.removeChild(b.firstChild);
      b.appendChild(el('span', 'nf-mui-flabel', label));
      if (n > 0) {
        var c = el('span', 'nf-mui-fcount', String(n));
        c.setAttribute('aria-hidden', 'true');
        b.appendChild(c);
        b.setAttribute('aria-label', label + ', ' + n + ' active');
      }
      b.classList.toggle('nf-mui-on', n > 0);
    }
  }

  /* 2. Drawer */
  function formOf(d) { return d.querySelector('facets-form form'); }

  function activeCount(form) {
    if (!form) return 0;
    var n = form.querySelectorAll('input[type="checkbox"]:checked').length;
    var lo = form.querySelector('input[name="filter.v.price.gte"]');
    var hi = form.querySelector('input[name="filter.v.price.lte"]');
    if ((lo && lo.value !== '') || (hi && hi.value !== '')) n++;
    return n;
  }

  function buildUrl(d) {
    var ff = d.querySelector('facets-form');
    var form = formOf(d);
    if (!ff || !form) return null;
    var url = new URL(form.action, location.href);
    url.search = '';
    new URLSearchParams(new FormData(form)).forEach(function (v, k) { url.searchParams.append(k, v); });
    ['page', 'filter.v.price.gte', 'filter.v.price.lte'].forEach(function (k) {
      if (url.searchParams.get(k) === '') url.searchParams.delete(k);
    });
    url.searchParams.set('section_id', ff.getAttribute('section-id'));
    return url;
  }

  function pageCountText() {
    var c = document.querySelector('.collection-toolbar__products-count');
    return c ? c.textContent.replace(/\s+/g, ' ').trim() : '';
  }

  function setCount(d, text) {
    var s = d.querySelector('.nf-mui-apply-count');
    if (s) s.textContent = text || '';
  }

  function syncClear(d) {
    var c = d.querySelector('.nf-mui-clear');
    if (c) c.setAttribute('aria-disabled', activeCount(formOf(d)) ? 'false' : 'true');
  }

  var ctl = null, timer = 0;
  function refreshCount(d) {
    syncClear(d);
    clearTimeout(timer);
    timer = setTimeout(function () {
      var url = buildUrl(d);
      if (!url || !window.fetch || !window.DOMParser) return;
      if (ctl && ctl.abort) ctl.abort();
      ctl = window.AbortController ? new AbortController() : null;
      fetch(url.toString(), ctl ? { signal: ctl.signal } : {})
        .then(function (r) { return r.text(); })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var c = doc.querySelector('.collection-toolbar__products-count');
          if (c) setCount(d, c.textContent.replace(/\s+/g, ' ').trim());
        })
        .catch(function () {});
    }, 300);
  }

  function clearAll(d) {
    var form = formOf(d);
    if (!form) return;
    var cbs = form.querySelectorAll('input[type="checkbox"]');
    for (var i = 0; i < cbs.length; i++) cbs[i].checked = false;
    var prs = form.querySelectorAll('price-range');
    for (var p = 0; p < prs.length; p++) {
      var rs = prs[p].querySelectorAll('input[type="range"]');
      if (rs[0]) rs[0].value = rs[0].min;
      if (rs[1]) rs[1].value = rs[1].max;
      var fs = prs[p].querySelectorAll('input.field');
      for (var f = 0; f < fs.length; f++) fs[f].value = '';
      var g = prs[p].querySelector('.range-group');
      if (g) { g.style.setProperty('--range-min', '0%'); g.style.setProperty('--range-max', '100%'); }
    }
    // FacetsForm marks itself dirty on change, so Apply (closing) submits the cleared form
    form.dispatchEvent(new Event('change', { bubbles: true }));
    refreshCount(d);
  }

  function enhanceDrawer(d) {
    if (d.getAttribute('data-nf-mui') === '1') return;
    var foot = d.querySelector('[slot="footer"]');
    var ff = d.querySelector('facets-form');
    if (!foot || !ff) return;
    d.setAttribute('data-nf-mui', '1');

    // Shop New Arrivals, the same link the desktop sidebar carries
    if (!d.querySelector('.nf-mui-cta')) {
      var onNew = /^\/collections\/new-arrivals(\/|$)/.test(location.pathname);
      var a = el('a', 'nf-side-cta nf-mui-cta');
      a.href = onNew ? '/collections/best-sellers' : '/collections/new-arrivals';
      a.appendChild(el('span', null, onNew ? 'Shop Best Sellers' : 'Shop New Arrivals'));
      var ar = el('span', 'nf-side-cta__arrow', String.fromCharCode(8594));
      ar.setAttribute('aria-hidden', 'true');
      a.appendChild(ar);
      if (ff.nextSibling) d.insertBefore(a, ff.nextSibling); else d.appendChild(a);
    }

    // Apply with the live result count
    var apply = foot.querySelector('.button');
    if (apply && !apply.querySelector('.nf-mui-apply-label')) {
      while (apply.firstChild) apply.removeChild(apply.firstChild);
      apply.appendChild(el('span', 'nf-mui-apply-label', 'Apply'));
      apply.appendChild(el('span', 'nf-mui-apply-count', pageCountText()));
    }

    // Clear all, left of Apply
    if (!foot.querySelector('.nf-mui-clear')) {
      var clr = el('button', 'nf-mui-clear', 'Clear all');
      clr.type = 'button';
      clr.addEventListener('click', function () { clearAll(d); });
      foot.insertBefore(clr, foot.firstChild);
    }
    syncClear(d);

    d.addEventListener('change', function () { refreshCount(d); });
    d.addEventListener('input', function (e) {
      if (e.target && e.target.matches && e.target.matches('input.field')) refreshCount(d);
    });
    d.addEventListener('dialog:before-show', function () {
      document.documentElement.classList.add('nf-mui-open');
      setCount(d, pageCountText());
      syncClear(d);
    });
    d.addEventListener('dialog:after-hide', function () {
      document.documentElement.classList.remove('nf-mui-open');
      refocusUntil = Date.now() + 6000;
    });
  }

  /* Applying re-renders the section, which throws away the FILTER button the drawer
     handed focus back to. Once the fresh button arrives, focus it (no scroll jump). */
  var refocusUntil = 0;
  function refocus() {
    if (!refocusUntil || Date.now() > refocusUntil) return;
    var a = document.activeElement;
    if (a && a !== document.body && a !== document.documentElement && a.isConnected) return;
    var b = document.querySelector('.collection-toolbar button[aria-controls="facets-drawer"]');
    if (!b) return;
    refocusUntil = 0;
    try { b.focus({ preventScroll: true }); } catch (e) { b.focus(); }
  }

  function run() {
    enhanceButtons();
    refocus();
    var ds = document.querySelectorAll('facets-drawer');
    for (var i = 0; i < ds.length; i++) enhanceDrawer(ds[i]);
    if (!document.querySelector('facets-drawer[open]')) document.documentElement.classList.remove('nf-mui-open');
  }

  var t = 0;
  function schedule() { if (t) return; t = setTimeout(function () { t = 0; run(); }, 40); }
  function boot() {
    run();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
/* ==================== /NF-MOBILE-UI-V1 ==================== */


/* ==================== NF-COLOR-GROUPS-V1 ====================
   Owned by the color filter pass (2026-09-11). The Color filter (Search and Discovery, variant
   option "Color") lists raw supplier names: Black, black, Black+Gold, Gun Black, Black-Big size
   and hundreds more. This folds them into 21 base colors: Black, White, Gold, Brass, Silver,
   Chrome, Gray, Bronze, Copper, Brown, Wood, Beige, Green, Blue, Red, Pink, Purple, Yellow,
   Orange, Clear, Multi.
   1. A value maps by keyword (the first color word wins, "gray blue" style pairs take the
      second word, a trailing black or white is a second tone). A value with no color word goes
      by its swatch color, then to Multi. Nothing is dropped.
   2. In every facets form (desktop sidebar and the phone overlay) the Color group becomes one
      swatch per base color with a product count. A swatch ticks or clears ALL of its theme
      checkboxes and fires ONE change event, so the theme's form, URL and re-render work as
      before (Search and Discovery ORs the values of one filter). Theme swatches stay, hidden.
   3. Counts (collection pages): sections/nf-color-map.liquid lists every product's Color values
      for the current filters minus Color, so a count is products, not values.
   4. Active filter chips collapse to one chip per base color ("Color: Black").
   5. The phone FILTER chip counts base colors, not raw values.
   The collection section is replaced on every filter change, so a body observer re-applies.
   Markup is built with createElement and textContent only. */
(function () {
  if (window.__nfCgGroups) return;
  window.__nfCgGroups = 1;

  var PARAM = /^filter\.v\.option\.colou?rs?$/i;
  /* key, name, swatch, light swatch (needs a stronger ring) */
  var GROUPS = [
    ['black', 'Black', '#1c1c1c'],
    ['white', 'White', '#ffffff', 1],
    ['gold', 'Gold', 'linear-gradient(135deg,#f6e3a1 0%,#cda43f 46%,#f1d98b 62%,#b0862a 100%)'],
    ['brass', 'Brass', 'linear-gradient(135deg,#e8cf8a 0%,#b8923a 50%,#8c6a24 100%)'],
    ['silver', 'Silver', 'linear-gradient(135deg,#f3f3f3 0%,#c2c2c2 48%,#e6e6e6 60%,#a4a4a4 100%)', 1],
    ['chrome', 'Chrome', 'linear-gradient(135deg,#ffffff 0%,#8f969d 42%,#f7f9fa 55%,#6f767d 100%)', 1],
    ['gray', 'Gray', '#9a9791'],
    ['bronze', 'Bronze', 'linear-gradient(135deg,#b58f5e 0%,#7d5a32 55%,#5b3f22 100%)'],
    ['copper', 'Copper', 'linear-gradient(135deg,#e6a57c 0%,#b8703a 52%,#8a4c22 100%)'],
    ['brown', 'Brown', '#7b5234'],
    ['wood', 'Wood', 'repeating-linear-gradient(105deg,#c09062 0 4px,#a97a4d 4px 7px,#b8875a 7px 11px)'],
    ['beige', 'Beige', '#e7d9be', 1],
    ['green', 'Green', '#5f7b50'],
    ['blue', 'Blue', '#3e6698'],
    ['red', 'Red', '#b5332b'],
    ['pink', 'Pink', '#eca7b7'],
    ['purple', 'Purple', '#7b5ba7'],
    ['yellow', 'Yellow', '#f2cd52'],
    ['orange', 'Orange', '#df7b2b'],
    ['clear', 'Clear', 'linear-gradient(135deg,#ffffff 0%,#dbe7ee 48%,#ffffff 52%,#eef4f7 100%)', 1],
    ['multi', 'Multi', 'conic-gradient(#e0533d,#f0c33c,#58b368,#3f8fd2,#9a5cc6,#e0533d)']
  ];
  var NAME = {};
  GROUPS.forEach(function (g) { NAME[g[0]] = g[1]; });

  var WORDS = {
    black: 'black ebony onyx jet noir ink',
    white: 'white pearl snow milky',
    gold: 'gold champagne',
    brass: 'brass',
    silver: 'silver nickel steel stainless aluminum aluminium pewter tin metallic platinum titanium',
    chrome: 'chrome mirror',
    gray: 'gray charcoal ash slate graphite gunmetal cement concrete smoke smoky',
    bronze: 'bronze',
    copper: 'copper',
    brown: 'brown coffee chestnut hazelnut cognac caramel chocolate camel mocha espresso mahogany taupe rust',
    wood: 'wood wooden walnut oak teak bamboo rattan wicker jute cane birch log pine beech maple acacia',
    beige: 'beige cream ivory khaki tan oatmeal nude linen',
    green: 'green olive sage emerald mint jade matcha moss avocado lime forest',
    blue: 'blue navy denim teal turquoise cyan aqua azure cobalt indigo sapphire',
    red: 'red burgundy wine maroon cherry crimson scarlet rouge ruby',
    pink: 'pink rose blush blushing fuchsia magenta mauve coral peach salmon lotus',
    purple: 'purple lilac lavender violet plum purpur amethyst orchid',
    yellow: 'yellow mustard lemon turmeric honey ochre',
    orange: 'orange amber tangerine apricot terracotta',
    clear: 'clear transparent frosted',
    multi: 'multicolor multicolour multi rgb rgbw rainbow colorful colourful mixed random assorted'
  };
  var W = {};
  Object.keys(WORDS).forEach(function (g) { WORDS[g].split(' ').forEach(function (w) { W[w] = g; }); });
  var PAIRS = {
    'rose gold': 'gold', 'champagne gold': 'gold', 'off white': 'beige', 'sand nickel': 'silver',
    'natural white': 'white', 'nature white': 'white', 'warm white': 'white', 'cool white': 'white',
    'cold white': 'white', 'neutral white': 'white', 'pure white': 'white', 'red copper': 'copper',
    'gun metal': 'gray', 'dusty rose': 'pink', 'rose red': 'red', 'aqua green': 'green', 'azure green': 'green',
    'sky blue': 'blue', 'wood grain': 'wood', 'natural wood': 'wood', 'color changing': 'multi', 'seven colors': 'multi'
  };
  /* only used when nothing stronger is in the name */
  var WEAK = {
    'sand': 'beige', 'natural': 'wood', 'powder': 'pink', 'glass': 'clear', 'crystal': 'clear', 'acrylic': 'clear',
    'brushed': 'silver', 'satin': 'silver', 'metal': 'silver', 'polished': 'chrome', 'antique': 'bronze', 'iron': 'black',
    'marble': 'white', 'stone': 'gray', 'color': 'multi', 'colors': 'multi', 'tricolor': 'multi',
    'warm light': 'white', 'cool light': 'white', 'cold light': 'white', 'natural light': 'white', 'neutral light': 'white'
  };
  var FIX = {
    rosegold: 'rose gold', lilacpurple: 'lilac purple', aquagreen: 'aqua green', whitek: 'white', whtie: 'white', wihte: 'white',
    lvory: 'ivory', gary: 'gray', grey: 'gray', champange: 'champagne', colour: 'color', colours: 'colors', golden: 'gold',
    silvery: 'silver', chromed: 'chrome', woodgrain: 'wood grain', transparant: 'transparent', multicolored: 'multicolor',
    multicoloured: 'multicolor', colored: 'color', coloured: 'color'
  };

  function tokens(v) {
    var s = String(v)
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Za-z])(\d)/g, '$1 $2')
      .replace(/(\d)([A-Za-z])/g, '$1 $2')
      .toLowerCase()
      .replace(/[+\/&,]/g, ' and ')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
    return s.split(' ').map(function (t) { return FIX[t] || t; }).join(' ').split(' ');
  }

  /* swatch color of a value with no color word */
  var HEX = {};
  function hexGroup(hex) {
    var m = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i.exec(hex || '');
    if (!m) return null;
    var h = m[1];
    if (h.length === 3) h = h.replace(/./g, '$&$&');
    var r = parseInt(h.slice(0, 2), 16) / 255, g = parseInt(h.slice(2, 4), 16) / 255, b = parseInt(h.slice(4, 6), 16) / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
    var s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1)), hue = 0;
    if (d) {
      if (mx === r) hue = 60 * (((g - b) / d) % 6);
      else if (mx === g) hue = 60 * ((b - r) / d + 2);
      else hue = 60 * ((r - g) / d + 4);
    }
    if (hue < 0) hue += 360;
    if (l >= 0.93) return 'white';
    if (l <= 0.16) return 'black';
    if (s < 0.12) return l > 0.75 ? 'silver' : 'gray';
    if (hue < 15 || hue >= 345) return l > 0.7 ? 'pink' : 'red';
    if (hue < 45) return l < 0.4 ? 'brown' : (s < 0.45 && l > 0.65 ? 'beige' : 'orange');
    if (hue < 65) return s < 0.5 && l > 0.6 ? 'beige' : (l < 0.6 ? 'gold' : 'yellow');
    if (hue < 170) return 'green';
    if (hue < 260) return 'blue';
    if (hue < 300) return 'purple';
    return 'pink';
  }

  function classify(v) {
    var t = tokens(v), hits = [], weak = null;
    for (var i = 0; i < t.length; i++) {
      var pair = i + 1 < t.length ? t[i] + ' ' + t[i + 1] : '';
      if (pair && PAIRS[pair]) { hits.push({ g: PAIRS[pair], s: i, e: i + 1 }); i++; continue; }
      if (pair && WEAK[pair]) { if (!weak) weak = WEAK[pair]; i++; continue; }
      if (W[t[i]]) hits.push({ g: W[t[i]], s: i, e: i });
      else if (WEAK[t[i]] && !weak) weak = WEAK[t[i]];
    }
    if (!hits.length) return weak || hexGroup(HEX[v]) || 'multi';
    var h = hits[0];
    for (var k = 1; k < hits.length; k++) {
      var n = hits[k];
      if (n.s !== h.e + 1) break;
      if (h.g === 'multi' || n.g === 'multi') break;
      if (n.g === 'black' || n.g === 'white') break;
      if ((h.g === 'black' || h.g === 'white') && n.g !== 'brown' && n.g !== 'wood') break;
      h = n;
    }
    return h.g;
  }
  var memo = {};
  function groupOf(v) {
    var key = v + '\u0001' + (HEX[v] || '');
    if (!Object.prototype.hasOwnProperty.call(memo, key)) memo[key] = classify(v);
    return memo[key];
  }
  window.__nfCgGroupOf = groupOf;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function colorInputs(root) {
    return [].filter.call(root.querySelectorAll('input[type="checkbox"]'), function (i) { return PARAM.test(i.name); });
  }
  function readHex(i) {
    if (HEX[i.value] !== undefined) return;
    var l = i.nextElementSibling;
    if (!(l && l.tagName === 'LABEL' && l.htmlFor === i.id) && i.id) {
      l = document.querySelector('label[for="' + (window.CSS && CSS.escape ? CSS.escape(i.id) : i.id) + '"]');
    }
    var m = /#([0-9a-f]{6}|[0-9a-f]{3})\b/i.exec(l ? (l.getAttribute('style') || '') : '');
    HEX[i.value] = m ? '#' + m[1] : '';
  }

  /* 3. product counts per base color */
  var COUNTS = null, cKey = null;
  function countKey() {
    if (!/^\/collections\/[^\/]+/.test(location.pathname)) return null;
    var sp = new URLSearchParams();
    new URL(location.href).searchParams.forEach(function (v, k) { if (k.indexOf('filter.') === 0 && !PARAM.test(k)) sp.append(k, v); });
    var q = sp.toString();
    return location.pathname + '?' + (q ? q + '&' : '');
  }
  /* NF-PERF4-0911: the colour counts used to be fetched (up to 8 section renders of 250 products) on every
     collection load. They only show inside the Color filter, which starts closed, so they now load the first time the
     shopper reaches for the filters (drawer opens, a filter group opens, pointer or focus on the filter column or the
     FILTER button), and each result is kept in sessionStorage for 30 minutes per collection and filter set. After the
     first open, a filter change fetches the new counts straight away, exactly as before. */
  var cgWant = false;
  function cgCacheGet(key) {
    try { var raw = sessionStorage.getItem('nfcg:' + key); if (!raw) return null; var o = JSON.parse(raw);
      return o && o.c && Date.now() - o.t < 18e5 ? o.c : null; } catch (e) { return null; }
  }
  function cgCacheSet(key, c) { try { sessionStorage.setItem('nfcg:' + key, JSON.stringify({ t: Date.now(), c: c })); } catch (e) {} }
  function cgSyncAll() { var cs = document.querySelectorAll('.accordion__content.nfcg-on'); for (var i = 0; i < cs.length; i++) sync(cs[i]); }
  function cgOpen() { if (cgWant) return; cgWant = true; loadCounts(); }
  function cgMaybeLoad() {
    var key = countKey();
    if (!key || key === cKey) return;
    var hit = cgCacheGet(key);
    if (hit) { cKey = key; COUNTS = hit; cgSyncAll(); return; }
    if (!cgWant) { var cs = document.querySelectorAll('.accordion__content.nfcg-on'); for (var i = 0; i < cs.length; i++) { var d = cs[i].closest('details'); if (d && d.open) { cgWant = true; break; } } }
    if (cgWant) loadCounts();
  }
  function cgIntent(e) { var t = e.target; if (t && t.closest && t.closest('.facets-sidebar, facets-form, facets-drawer, button[aria-controls="facets-drawer"]')) cgOpen(); }
  document.addEventListener('toggle', function (e) { var d = e.target; if (d && d.open && d.closest && d.closest('facets-form')) cgOpen(); }, true);
  document.addEventListener('dialog:before-show', function (e) { if (e.target && e.target.localName === 'facets-drawer') cgOpen(); }, true);
  ['pointerover', 'focusin', 'touchstart'].forEach(function (type) { document.addEventListener(type, cgIntent, { capture: true, passive: true }); });

  function loadCounts() {
    var key = countKey();
    if (!key || key === cKey || !window.fetch || !window.Promise) return;
    cKey = key;
    COUNTS = null;
    var nfHit = cgCacheGet(key); if (nfHit) { COUNTS = nfHit; cgSyncAll(); return; } /* NF-PERF4-0911 */
    var base = key + 'section_id=nf-color-map';
    function get(page) {
      return fetch(base + (page > 1 ? '&page=' + page : ''), { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.text() : ''; })
        .then(function (t) {
          var m = /<script type="application\/json" data-nf-cm>([\s\S]*?)<\/script>/.exec(t);
          return m ? JSON.parse(m[1]) : null;
        });
    }
    get(1).then(function (d) {
      if (!d || !d.p || cKey !== key) return null;
      var more = [];
      for (var p = 2; p <= Math.min(d.pages || 1, 8); p++) more.push(get(p));
      return Promise.all(more).then(function (rest) {
        if (cKey !== key) return;
        var all = d.p.slice();
        rest.forEach(function (x) { if (x && x.p) all = all.concat(x.p); });
        var c = {};
        all.forEach(function (vals) {
          var seen = {};
          (vals || []).forEach(function (v) { var g = groupOf(v); if (!seen[g]) { seen[g] = 1; c[g] = (c[g] || 0) + 1; } });
        });
        COUNTS = c; cgCacheSet(key, c); /* NF-PERF4-0911 */
        var cs = document.querySelectorAll('.accordion__content.nfcg-on');
        for (var i = 0; i < cs.length; i++) sync(cs[i]);
      });
    }).catch(function () {});
  }

  function sync(content) {
    var st = {};
    colorInputs(content).forEach(function (i) {
      var k = groupOf(i.value);
      if (!st[k]) st[k] = { on: 0, live: 0 };
      if (i.checked) st[k].on++;
      if (!i.disabled) st[k].live++;
    });
    [].forEach.call(content.querySelectorAll('.nfcg__opt'), function (b) {
      var key = b.getAttribute('data-nfcg');
      var s = st[key] || { on: 0, live: 0 };
      var v = s.on ? 'true' : 'false';
      if (b.getAttribute('aria-checked') !== v) b.setAttribute('aria-checked', v);
      if (b.classList.contains('is-on') !== !!s.on) b.classList.toggle('is-on', !!s.on);
      var dead = !s.on && !s.live;
      if (b.classList.contains('is-dead') !== dead) { b.classList.toggle('is-dead', dead); b.disabled = dead; }
      var n = b.querySelector('.nfcg__n');
      var txt = COUNTS && COUNTS[key] ? '(' + COUNTS[key] + ')' : '';
      if (n && n.textContent !== txt) n.textContent = txt;
      var al = NAME[key] + (txt ? ', ' + COUNTS[key] + ' products' : '');
      if (b.getAttribute('aria-label') !== al) b.setAttribute('aria-label', al);
    });
  }

  function toggle(content, key) {
    var ins = colorInputs(content).filter(function (i) { return groupOf(i.value) === key; });
    if (!ins.length) return;
    var on = ins.some(function (i) { return i.checked; });
    var last = null;
    ins.forEach(function (i) {
      var want = !on && !i.disabled;
      if (i.checked !== want) { i.checked = want; last = i; }
    });
    sync(content);
    // one change event: the sidebar form submits once, the phone overlay marks itself dirty
    if (last) last.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function enhance(content) {
    var ins = colorInputs(content);
    if (ins.length < 2) return;
    ins.forEach(readHex);
    var box = content.querySelector(':scope > .nfcg');
    if (box && box.__nfCgFirst === ins[0] && box.__nfCgN === ins.length) { sync(content); return; }
    if (box) box.parentNode.removeChild(box);
    var have = {};
    ins.forEach(function (i) { have[groupOf(i.value)] = 1; });
    box = el('div', 'nfcg');
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Color');
    GROUPS.forEach(function (g) {
      if (!have[g[0]]) return;
      var b = el('button', 'nfcg__opt');
      b.type = 'button';
      b.setAttribute('role', 'checkbox');
      b.setAttribute('aria-checked', 'false');
      b.setAttribute('data-nfcg', g[0]);
      var sw = el('span', 'nfcg__sw' + (g[3] ? ' nfcg__sw--light' : ''));
      sw.setAttribute('aria-hidden', 'true');
      sw.style.setProperty('--nfcg-bg', g[2]);
      b.appendChild(sw);
      var tx = el('span', 'nfcg__txt');
      tx.appendChild(el('span', 'nfcg__name', g[1]));
      var n = el('span', 'nfcg__n', '');
      n.setAttribute('aria-hidden', 'true');
      tx.appendChild(n);
      b.appendChild(tx);
      box.appendChild(b);
    });
    box.__nfCgFirst = ins[0];
    box.__nfCgN = ins.length;
    box.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('.nfcg__opt') : null;
      if (b && !b.disabled) toggle(content, b.getAttribute('data-nfcg'));
    });
    content.insertBefore(box, content.firstChild);
    content.classList.add('nfcg-on');
    sync(content);
  }

  /* 4. chips: one per base color, removing the whole group */
  function activeColors() {
    var out = [];
    new URL(location.href).searchParams.forEach(function (v, k) { if (PARAM.test(k)) out.push([k, v]); });
    return out;
  }
  function chips() {
    var act = activeColors();
    if (!act.length) return;
    var boxes = document.querySelectorAll('.active-facets');
    for (var b = 0; b < boxes.length; b++) {
      var box = boxes[b];
      if (box.getAttribute('data-nfcg') === location.search) continue;
      var seen = {};
      [].forEach.call(box.querySelectorAll('.removable-facet'), function (rf) {
        var a = rf.querySelector('facet-link > a[href]') || rf.querySelector('a[href]');
        if (!a) return;
        var u;
        try { u = new URL(a.getAttribute('data-nfcg-href') || a.href, location.href); } catch (e) { return; }
        var left = [];
        u.searchParams.forEach(function (v, k) { if (PARAM.test(k)) left.push(v); });
        var removed = act.filter(function (p) { var i = left.indexOf(p[1]); if (i > -1) { left.splice(i, 1); return false; } return true; });
        if (removed.length !== 1) return;
        var key = groupOf(removed[0][1]);
        if (!a.getAttribute('data-nfcg-href')) a.setAttribute('data-nfcg-href', a.getAttribute('href'));
        if (seen[key]) { rf.hidden = true; rf.classList.add('nfcg-dup'); return; }
        seen[key] = 1;
        var nu = new URL(location.href);
        act.forEach(function (p) { nu.searchParams.delete(p[0]); });
        act.forEach(function (p) { if (groupOf(p[1]) !== key) nu.searchParams.append(p[0], p[1]); });
        nu.searchParams.delete('page');
        nu.searchParams.delete('section_id');
        a.setAttribute('href', nu.pathname + nu.search);
        var sp = rf.querySelector('span') || a;
        var txt = sp.textContent, c = txt.indexOf(': ');
        var want = (c > -1 && c < txt.length - 2 && txt.slice(c + 2).trim() === removed[0][1] ? txt.slice(0, c + 2) : '') + NAME[key];
        if (sp.children.length === 0 && txt.trim() !== want) sp.textContent = want;
        var al = a.getAttribute('aria-label');
        if (al && al.indexOf(removed[0][1]) > -1) a.setAttribute('aria-label', al.replace(removed[0][1], NAME[key]));
      });
      box.setAttribute('data-nfcg', location.search);
    }
  }

  /* 5. phone FILTER chip counts base colors */
  function fixCount() {
    var act = activeColors(), g = {};
    act.forEach(function (p) { g[groupOf(p[1])] = 1; });
    var delta = act.length - Object.keys(g).length;
    [].forEach.call(document.querySelectorAll('.collection-toolbar button[aria-controls="facets-drawer"] .nf-mui-fcount'), function (c) {
      var orig = c.getAttribute('data-nfcg-orig');
      if (orig === null) { orig = c.textContent.trim(); c.setAttribute('data-nfcg-orig', orig); }
      var n = Math.max(0, (parseInt(orig, 10) || 0) - delta);
      if (c.textContent !== String(n)) c.textContent = String(n);
      var btn = c.closest('button');
      var lab = btn.querySelector('.nf-mui-flabel');
      var al = (lab ? lab.textContent : 'Filter') + ', ' + n + ' active';
      if (btn.getAttribute('aria-label') !== al) btn.setAttribute('aria-label', al);
    });
  }

  function run() {
    var cs = document.querySelectorAll('facets-form .accordion__content');
    var any = false;
    for (var i = 0; i < cs.length; i++) { enhance(cs[i]); if (cs[i].classList.contains('nfcg-on')) any = true; }
    chips();
    fixCount();
    if (any) cgMaybeLoad(); /* NF-PERF4-0911: counts load when the filter UI is used */
  }

  var t = 0;
  function schedule() { if (t) return; t = setTimeout(function () { t = 0; run(); }, 70); }
  function boot() {
    run();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    // Clear all, the price boxes and anything else that changes the form: keep the swatches in step
    document.addEventListener('change', function (e) {
      var f = e.target && e.target.closest ? e.target.closest('facets-form') : null;
      if (!f) return;
      var cs = f.querySelectorAll('.accordion__content.nfcg-on');
      for (var i = 0; i < cs.length; i++) sync(cs[i]);
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
/* ==================== /NF-COLOR-GROUPS-V1 ==================== */


/* ==================== NF-MOBILE-UI-V3 ====================
   Owned by the mobile UI pass (2026-09-11, round 2). Phones below 750px, #facets-drawer only
   (the theme hides it from 1000px up; custom-nav.css NF-MOBILE-UI-V3 makes it a 75% bottom sheet).
   1. The sheet slides up and down (the theme's sideways slide is switched off in CSS), and it can
      be dragged down by its handle to close. Closing still applies the choices (theme behaviour).
   2. Each filter group shows its current choice under its name ("Black, Gold", "$40 to $120"),
      live as the shopper picks, before Apply. Base color names come from NF-COLOR-GROUPS-V1.
   The section is re-rendered on every filter change, so a body observer re-applies. textContent only. */
(function () {
  if (window.__nfMui3) return;
  window.__nfMui3 = 1;
  var MQ = window.matchMedia ? window.matchMedia('(max-width:749px)') : null;
  var RM = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function part(d, name) {
    var sr = d.shadowRoot;
    return sr ? sr.querySelector('[part~="' + name + '"]') : null;
  }

  /* 1. sheet motion and drag */
  function wireDrag(d, c) {
    var h = part(d, 'header');
    if (!h || h.__nfM3Drag) return;
    h.__nfM3Drag = 1;
    var y0 = null, dy = 0, t0 = 0;
    h.addEventListener('touchstart', function (e) {
      if (!MQ || !MQ.matches || e.touches.length !== 1) return;
      if (e.target && e.target.closest && e.target.closest('[part~="close-button"]')) return;
      y0 = e.touches[0].clientY; dy = 0; t0 = Date.now();
    }, { passive: true });
    h.addEventListener('touchmove', function (e) {
      if (y0 == null) return;
      dy = Math.max(0, e.touches[0].clientY - y0);
      c.style.translate = '0 ' + dy + 'px';
    }, { passive: true });
    function end() {
      if (y0 == null) return;
      y0 = null;
      var fast = dy > 40 && Date.now() - t0 < 260;
      if (dy > 110 || fast) {
        if (typeof d.hide === 'function') d.hide(); else d.removeAttribute('open');
      } else if (dy > 0) {
        var from = '0 ' + dy + 'px';
        c.style.translate = '';
        if (c.animate && !(RM && RM.matches)) c.animate([{ translate: from }, { translate: '0 0' }], { duration: 180, easing: 'ease-out' });
      }
      dy = 0;
    }
    h.addEventListener('touchend', end);
    h.addEventListener('touchcancel', end);
  }

  function onOpenChange(d) {
    if (!MQ || !MQ.matches) return;
    var c = part(d, 'content');
    if (!c) return;
    var open = d.hasAttribute('open');
    if (d.__nfM3Anim) { try { d.__nfM3Anim.cancel(); } catch (e) {} d.__nfM3Anim = null; }
    var from = c.style.translate;
    c.style.translate = '';
    if (open) wireDrag(d, c);
    if (!c.animate || (RM && RM.matches)) return;
    d.__nfM3Anim = open
      ? c.animate([{ translate: '0 100%' }, { translate: '0 0' }], { duration: 320, easing: 'cubic-bezier(.2,.8,.2,1)' })
      : c.animate([{ translate: from || '0 0' }, { translate: '0 100%' }], { duration: 260, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' });
  }

  /* 2. current choice under each group name */
  function labelFor(input) {
    var l = input.id ? document.querySelector('label[for="' + (window.CSS && CSS.escape ? CSS.escape(input.id) : input.id) + '"]') : null;
    var t = l ? (l.getAttribute('data-tooltip') || l.textContent) : input.value;
    return String(t).replace(/\s*\(\d+\)\s*$/, '').replace(/\s+/g, ' ').trim();
  }
  function summaryOf(content) {
    var box = content.querySelector('.nfcg');
    if (box) return [].map.call(box.querySelectorAll('.nfcg__opt.is-on .nfcg__name'), function (n) { return n.textContent; }).join(', ');
    var pr = content.querySelector('price-range');
    if (pr) {
      var lo = pr.querySelector('input[name$="price.gte"]'), hi = pr.querySelector('input[name$="price.lte"]');
      var a = lo && lo.value !== '' ? lo.value : '', b = hi && hi.value !== '' ? hi.value : '';
      if (a === '' && b === '') return '';
      return '$' + (a || '0') + ' to $' + (b || (hi && hi.getAttribute('max')) || '');
    }
    return [].map.call(content.querySelectorAll('input[type="checkbox"]:checked'), labelFor).filter(Boolean).join(', ');
  }
  function update(d) {
    var ds = d.querySelectorAll('facets-form details');
    for (var i = 0; i < ds.length; i++) {
      var t = ds[i].querySelector('summary .text-with-icon');
      var c = ds[i].querySelector('.accordion__content');
      if (!t || !c) continue;
      var s = t.querySelector('.nf-mui3-sum');
      if (!s) { s = document.createElement('span'); s.className = 'nf-mui3-sum'; t.appendChild(s); }
      var v = summaryOf(c);
      if (s.textContent !== v) s.textContent = v;
    }
  }
  function run() {
    var ds = document.querySelectorAll('facets-drawer');
    for (var i = 0; i < ds.length; i++) update(ds[i]);
  }

  var t = 0;
  function schedule() { if (t) return; t = setTimeout(function () { t = 0; run(); }, 90); }
  function boot() {
    run();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) if (ms[i].target.localName === 'facets-drawer') onOpenChange(ms[i].target);
    }).observe(document.body, { attributes: true, attributeFilter: ['open'], subtree: true });
    document.addEventListener('change', function (e) { if (e.target && e.target.closest && e.target.closest('facets-drawer')) schedule(); }, true);
    document.addEventListener('input', function (e) { if (e.target && e.target.closest && e.target.closest('facets-drawer price-range')) schedule(); }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
/* ==================== /NF-MOBILE-UI-V3 ==================== */


/* ==================== NF-CHAT-V2 ====================
   Owned by the chat pass (2026-09-11). Shopify Inbox renders <shopify-chat> with an OPEN shadow
   root and button[part=activator]; colours live in custom-nav.css NF-CHAT-V2.
   1. Phones: a 48px round icon button. ::part() cannot reach the label, so a small <style> goes
      into the shadow root and is put back if the chat redraws it.
   2. Opens faster: a click used to load the agent runtime, then the iframe's code (agent-iframe,
      agent-conversation 133 KB) one after another. Once the page has loaded and gone idle, or the
      pointer heads for the button, or the first touch, this preconnects to the agent servers, runs
      the chat's own hover preload (imports its runtime) and preloads those files (names read from
      the chat's own scripts, so a Shopify update cannot leave a stale name).
      Never before load, never opens the panel, skipped on Save-Data, 2g or a hidden tab.
   3. It never covers Add to Cart: html.nf-chat-dodge while an Add to Cart button is under it, and
      --nf-chat-lift above a sticky bar pinned to the bottom. */
(function () {
  if (window.__nfChatV2) return;
  window.__nfChatV2 = 1;

  var SHADOW_CSS =
    '.activator svg,.activator svg path{stroke:currentColor}' +
    '@media (max-width:749px){' +
    '.activator{width:48px !important;height:48px !important;min-width:48px !important;min-height:48px !important;' +
    'padding:0 !important;gap:0 !important;border-radius:999px !important;justify-content:center !important;align-items:center !important}' +
    '.activator__label{display:none !important}' +
    '.activator__icon{display:grid !important;place-items:center !important;margin:0 !important;width:22px !important;height:22px !important}' +
    '.activator__icon svg{width:22px !important;height:22px !important}' +
    '}';

  function chat() { return document.querySelector('shopify-chat'); }
  function activator() {
    var c = chat();
    return c && c.shadowRoot ? c.shadowRoot.querySelector('[part~="activator"]') : null;
  }

  /* 1. icon only on phones */
  function dress(host) {
    var sr = host.shadowRoot;
    if (!sr) return;
    if (!sr.querySelector('style[data-nf-chat-v2]')) {
      var st = document.createElement('style');
      st.setAttribute('data-nf-chat-v2', '');
      st.textContent = SHADOW_CSS;
      sr.appendChild(st);
    }
    if (!host.__nfChatObs) {
      host.__nfChatObs = new MutationObserver(function () {
        if (!sr.querySelector('style[data-nf-chat-v2]')) dress(host);
      });
      host.__nfChatObs.observe(sr, { childList: true });
    }
  }
  function findChat() {
    var c = chat();
    if (c && c.shadowRoot) { dress(c); return true; }
    return false;
  }

  /* 2. warm */
  var warmed = false;
  function warm() {
    if (warmed || document.visibilityState === 'hidden' || !chat()) return;
    var cn = navigator.connection;
    if (cn && (cn.saveData || /2g/.test(cn.effectiveType || ''))) return;
    warmed = true;
    var head = document.head;
    function link(rel, href, cors, as) {
      var ls = head.querySelectorAll('link[rel="' + rel + '"]');
      for (var i = 0; i < ls.length; i++) if (ls[i].href === href) return;
      var l = document.createElement('link');
      l.rel = rel;
      l.href = href;
      if (cors != null) l.crossOrigin = cors;
      if (as) l.as = as;
      head.appendChild(l);
    }
    ['https://storefront-agent-server.shopify.ai', 'https://messaging-api.shopifyapps.com'].forEach(function (o) {
      link('preconnect', o, 'anonymous');
    });
    // the chat's own "about to be used" path: it imports its agent runtime (nothing opens)
    var a = activator();
    if (a && window.PointerEvent) { try { a.dispatchEvent(new PointerEvent('pointerenter')); } catch (e) {} }
    if (!window.fetch) return;
    var src = '';
    var ns = document.querySelectorAll('link[href*="/storefront/web-components/chat.js"],script[src*="/storefront/web-components/chat.js"]');
    if (ns.length) src = ns[0].href || ns[0].src;
    var base = (src || 'https://cdn.shopify.com/storefront/web-components/chat.js').replace(/chat\.js.*$/, '');
    function names(text, dir) {
      var re = new RegExp('\\./' + dir + '/[\\w.-]+\\.js', 'g'), m = text.match(re) || [], seen = {}, out = [];
      for (var i = 0; i < m.length; i++) if (!seen[m[i]]) { seen[m[i]] = 1; out.push(m[i].slice(2)); }
      return out;
    }
    fetch(base + 'chat.js', { credentials: 'omit' })
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (t) {
        names(t, 'chat').forEach(function (n) { link('modulepreload', base + n, ''); });
        link('modulepreload', base + 'agent-iframe.js', 'anonymous');
        return fetch(base + 'agent-iframe.js', { credentials: 'omit' });
      })
      .then(function (r) { return r && r.ok ? r.text() : ''; })
      .then(function (t) {
        names(t, 'agent-iframe').forEach(function (n) { link('prefetch', base + n, 'anonymous', 'script'); });
      })
      .catch(function () {});
  }
  function idle(fn, ms) {
    if ('requestIdleCallback' in window) window.requestIdleCallback(fn, { timeout: ms });
    else setTimeout(fn, 1);
  }
  function onMove(e) {
    if (warmed) { document.removeEventListener('pointermove', onMove); return; }
    var a = activator();
    if (!a) return;
    var r = a.getBoundingClientRect();
    if (!r.width) return;
    var dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right), dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
    if (dx * dx + dy * dy < 280 * 280) { document.removeEventListener('pointermove', onMove); warm(); }
  }
  function afterLoad() {
    setTimeout(function () { idle(warm, 3000); }, 1200);
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('touchstart', function () { idle(warm, 800); }, { passive: true, once: true });
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') idle(warm, 3000); });
  }

  /* 3. never over Add to Cart */
  var ticking = false, lastLift = -1, lastDodge = null;
  function dodge() {
    ticking = false;
    var a = activator(), root = document.documentElement;
    var lift = 0, hide = false;
    if (a) {
      var ar = a.getBoundingClientRect();
      if (ar.width) {
        var W = window.innerWidth, H = window.innerHeight;
        var z = { l: W - 20 - ar.width - 8, t: H - 20 - ar.height - 8, r: W, b: H };
        var cands = document.querySelectorAll('form[action*="/cart/add"] button[type="submit"], product-sticky-bar, #nf-nl-tab');
        for (var i = 0; i < cands.length; i++) {
          var e = cands[i], r = e.getBoundingClientRect(), ecs = getComputedStyle(e);
          if (!r.width || !r.height || ecs.visibility === 'hidden' || ecs.display === 'none' || parseFloat(ecs.opacity) === 0) continue;
          if (!(r.left < z.r && r.right > z.l && r.top < z.b && r.bottom > z.t)) continue;
          var fixed = e.localName === 'product-sticky-bar' || ecs.position === 'fixed' || !!e.closest('product-sticky-bar');
          if (fixed && r.top > H / 2) lift = Math.max(lift, Math.round(H - r.top + 12));
          else if (!fixed) hide = true;
        }
      }
    }
    if (lift !== lastLift) { lastLift = lift; if (lift) root.style.setProperty('--nf-chat-lift', lift + 'px'); else root.style.removeProperty('--nf-chat-lift'); }
    if (hide !== lastDodge) { lastDodge = hide; root.classList.toggle('nf-chat-dodge', hide); }
  }
  function queue() { if (!ticking) { ticking = true; requestAnimationFrame(dodge); } }

  function boot() {
    if (!findChat()) {
      var mo = new MutationObserver(function () { if (findChat()) mo.disconnect(); });
      mo.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(function () { mo.disconnect(); }, 30000);
    }
    if (window.customElements && customElements.whenDefined) customElements.whenDefined('shopify-chat').then(function () { setTimeout(findChat, 0); });
    if (document.readyState === 'complete') afterLoad();
    else window.addEventListener('load', afterLoad, { once: true });
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
    // the newsletter tab and the sticky bar appear late: check every 1.5s for 30s, then every 5s
    var n = 0, iv = setInterval(function () { queue(); if (++n === 20) { clearInterval(iv); setInterval(queue, 5000); } }, 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
/* ==================== /NF-CHAT-V2 ==================== */

/* NF-PERF4-0911: html.nf-chat-over. custom-nav.css used html:has(.drawer[open]), html:has(.popover[open]) and
   html:has(.modal[open]) to hide the chat button over open panels. A :has() on <html> made Chrome re-style the whole page
   every time any script inserted a node (about 1,900 elements per recalc, hundreds of times per load). This keeps the
   same behaviour with a class that only touches shopify-chat. */
(function () {
  if (window.__nfChatOver) return;
  window.__nfChatOver = 1;
  var root = document.documentElement, on = null, SEL = '.drawer[open],.popover[open],.modal[open]';
  function check() { var v = !!document.querySelector(SEL); if (v !== on) { on = v; root.classList.toggle('nf-chat-over', v); } }
  check();
  /* NF-PERF5-0912: re-query only when a drawer, popover or modal opens, closes, is added or removed */
  function rel(n, deep) { return !!n && n.nodeType === 1 && (n.classList.contains('drawer') || n.classList.contains('popover') || n.classList.contains('modal') || (deep && !!n.querySelector('.drawer,.popover,.modal'))); }
  new MutationObserver(function (recs) {
    for (var i = 0; i < recs.length; i++) {
      var r = recs[i], a, j;
      if (r.type === 'attributes') { if (rel(r.target)) { check(); return; } continue; }
      for (a = r.addedNodes, j = 0; j < a.length; j++) if (rel(a[j], 1)) { check(); return; }
      for (a = r.removedNodes, j = 0; j < a.length; j++) if (rel(a[j], 1)) { check(); return; }
    }
  }).observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['open'] });
})();


/* ==================== NF-MOBILE-V4 gallery swipe (2026-09-12) ====================
   Below 1000px custom-nav.css NF-MOBILE-V4 gives the product gallery carousel touch-action: pan-y, so the browser
   always scrolls the page when a swipe that starts on a photo is vertical. A clear horizontal swipe is handled here:
   the strip follows the finger, then glides to the next or previous photo with a smooth scroll of the carousel
   itself (never the window), so the carousel's own scroll listeners keep dots and thumbnails in sync.
   Covers the quick view as well (same carousel markup). */
(function () {
  if (!window.PointerEvent || !window.matchMedia) return;
  var MQ = window.matchMedia('(max-width: 999px)');
  var st = null, noClickUntil = 0;
  function carOf(t) { return t && t.closest ? t.closest('product-gallery .product-gallery__carousel') : null; }
  function cellsOf(c) {
    return Array.prototype.filter.call(c.querySelectorAll('.product-gallery__media'), function (m) { return m.getClientRects().length > 0; });
  }
  function leftOf(c, m) {
    var cs = getComputedStyle(c), pad = parseFloat(cs.scrollPaddingLeft) || 0;
    return c.scrollLeft + (m.getBoundingClientRect().left - c.getBoundingClientRect().left) - c.clientLeft - pad;
  }
  function restore(c) { c.style.scrollSnapType = ''; c.style.scrollBehavior = ''; }
  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'touch' || !e.isPrimary || !MQ.matches) return;
    var c = carOf(e.target);
    if (!c) return;
    st = { c: c, id: e.pointerId, x: e.clientX, y: e.clientY, sl: c.scrollLeft, h: false, vx: 0, lx: e.clientX, lt: e.timeStamp };
  }, { passive: true });
  document.addEventListener('pointermove', function (e) {
    if (!st || e.pointerId !== st.id) return;
    var dx = e.clientX - st.x, dy = e.clientY - st.y;
    if (!st.h) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.15) { if (Math.abs(dy) > 14) st = null; return; }
      st.h = true;
      st.c.style.scrollSnapType = 'none';
      st.c.style.scrollBehavior = 'auto';
    }
    var dt = e.timeStamp - st.lt;
    if (dt > 0) st.vx = 0.7 * ((e.clientX - st.lx) / dt) + 0.3 * st.vx;
    st.lx = e.clientX; st.lt = e.timeStamp;
    var max = st.c.scrollWidth - st.c.clientWidth;
    st.c.scrollLeft = Math.max(0, Math.min(max, st.sl - dx));
  }, { passive: true });
  function end(e) {
    if (!st || e.pointerId !== st.id) return;
    var s = st; st = null;
    if (!s.h) return;
    noClickUntil = Date.now() + 450;
    var c = s.c, list = cellsOf(c);
    if (!list.length) { restore(c); return; }
    var lefts = list.map(function (m) { return leftOf(c, m); });
    var i0 = 0, best = Infinity;
    lefts.forEach(function (l, i) { var d = Math.abs(l - s.sl); if (d < best) { best = d; i0 = i; } });
    var dx = (e.type === 'pointercancel' ? s.lx : e.clientX) - s.x;
    var dir = (dx < -40 || s.vx < -0.35) ? 1 : (dx > 40 || s.vx > 0.35) ? -1 : 0;
    var to = Math.max(0, Math.min(list.length - 1, i0 + dir));
    var done = false;
    var fin = function () { if (done) return; done = true; restore(c); };
    try { c.scrollTo({ left: lefts[to], behavior: 'smooth' }); } catch (_) { c.scrollLeft = lefts[to]; }
    c.addEventListener('scrollend', function () { setTimeout(fin, 30); }, { once: true });
    setTimeout(fin, 750);
  }
  document.addEventListener('pointerup', end, { passive: true });
  document.addEventListener('pointercancel', end, { passive: true });
  document.addEventListener('click', function (e) {
    if (Date.now() < noClickUntil && carOf(e.target)) { e.preventDefault(); e.stopPropagation(); }
  }, true);
})();
/* ==================== /NF-MOBILE-V4 gallery swipe ==================== */

/* NF-FILTERS-V2 (2026-09-12): Product type shows clean leaf labels with "Top > " dropped and duplicates merged;
   Light Color folds into base light groups with glowing mini swatches, combined counts (sections/nf-light-map),
   whole group selection and grouped chips. Re-runs after the theme re-renders the facets. */
(function(){
if(window.__nfFl2)return;window.__nfFl2=1;
var PT=/^filter\.p\.product_type$/i,LC=/^filter\.v\.option\.light colou?r$/i;
var LG=[["warm","Warm White","2700 to 3000K"],["neutral","Neutral White","3500 to 4500K"],["cool","Cool White","5000 to 6500K"],["tri","3 Color Adjustable","Warm to cool"],["rgb","RGB and Color Changing","Colored light"],["dim","Dimmable","Brightness"],["other","Other","More"]];
var LNAME={},LSUB={};LG.forEach(function(g){LNAME[g[0]]=g[1];LSUB[g[0]]=g[2]});
var lmemo={};
function lgroup(v){v=String(v);if(Object.prototype.hasOwnProperty.call(lmemo,v))return lmemo[v];
var s=v.toLowerCase().replace(/colour/g,"color").replace(/whtie|wihte/g,"white").replace(/\s+/g," ").trim(),m=/(\d{4})\s*k\b/.exec(s),k=m?+m[1]:0,g="other";
if(/no (light )?bulbs?|not include|without bulb|bulbs? not/.test(s))g="other";
else if(/\b3[- ]?colors?\b|tri-?color|three[- ]?colors?|3 in 1|adjustable|\bcct\b|color temperature|warm.*(cool|cold)|(cool|cold).*warm|switch/.test(s))g="tri";
else if(/rgb|multi|colorful|rainbow|chang|\d+ colors?|seven|color light|sunset|\bred\b|blue|green|purple|pink|orange|violet|\bice\b/.test(s))g="rgb";
else if(/warm|yellow|amber|soft white|golden/.test(s)||(k&&k<3500))g="warm";
else if(/neutral|natur|middle|4000|4500/.test(s)||(k&&k<5000))g="neutral";
else if(/cool|cold|white|daylight|day light|pure|bright/.test(s)||k>=5000)g="cool";
else if(/dimm|dimming|dimmer|remote|triac|dali/.test(s))g="dim";
return lmemo[v]=g}
window.__nfFlGroupOf=lgroup;
function ptLabel(v){return String(v).split(">").pop().replace(/\s+/g," ").trim()}
var PTA={"pendant lighting":"pendants","pendant lights":"pendants"},PTL={"pendants":"Pendants"};
function ptKey(v){var k=ptLabel(v).toLowerCase().replace(/&/g,"and").replace(/\s+/g," ");return PTA[k]||k}
function ptName(v){return PTL[ptKey(v)]||ptLabel(v)}
function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}
function inputs(root,re){return[].filter.call(root.querySelectorAll('input[type="checkbox"]'),function(i){return re.test(i.name)})}
function labelOf(i){var l=i.nextElementSibling;if(!(l&&l.tagName==="LABEL"))l=i.id?document.querySelector('label[for="'+(window.CSS&&CSS.escape?CSS.escape(i.id):i.id)+'"]'):null;return l}
function countOf(i){var l=labelOf(i),m=l?/\((\d+)\)\s*$/.exec(l.textContent):null;return m?+m[1]:0}
function keyOf(kind,v){return kind==="pt"?ptKey(v):lgroup(v)}
var LCOUNTS=null,lKey=null,lWant=false,lFail=false;
function lcKey(){if(!/^\/collections\/[^\/]+/.test(location.pathname))return null;var sp=new URLSearchParams();new URL(location.href).searchParams.forEach(function(v,k){if(k.indexOf("filter.")===0&&!LC.test(k))sp.append(k,v)});var q=sp.toString();return location.pathname+"?"+(q?q+"&":"")}
function cacheGet(key){try{var o=JSON.parse(sessionStorage.getItem("nffl:"+key)||"null");return o&&o.c&&Date.now()-o.t<18e5?o.c:null}catch(e){return null}}
function cacheSet(key,c){try{sessionStorage.setItem("nffl:"+key,JSON.stringify({t:Date.now(),c:c}))}catch(e){}}
function lcLoad(){var key=lcKey();if(!key){lFail=true;syncAll();return}if(key===lKey||!window.fetch||!window.Promise)return;lKey=key;LCOUNTS=null;lFail=false;
var hit=cacheGet(key);if(hit){LCOUNTS=hit;syncAll();return}
var base=key+"section_id=nf-light-map";
function get(p){return fetch(base+(p>1?"&page="+p:""),{credentials:"same-origin"}).then(function(r){return r.ok?r.text():""}).then(function(t){var m=/<script type="application\/json" data-nf-lm>([\s\S]*?)<\/script>/.exec(t);return m?JSON.parse(m[1]):null})}
get(1).then(function(d){if(lKey!==key)return;if(!d||!d.p){lFail=true;syncAll();return}var more=[];for(var p=2;p<=Math.min(d.pages||1,8);p++)more.push(get(p));
return Promise.all(more).then(function(rest){if(lKey!==key)return;var all=d.p.slice();rest.forEach(function(x){if(x&&x.p)all=all.concat(x.p)});var c={};
all.forEach(function(vals){var seen={};(vals||[]).forEach(function(v){var g=lgroup(v);if(!seen[g]){seen[g]=1;c[g]=(c[g]||0)+1}})});LCOUNTS=c;cacheSet(key,c);syncAll()})}).catch(function(){if(lKey===key){lFail=true;syncAll()}})}
function lcWant(){if(!lWant){lWant=true;lcLoad()}}
function lcMaybe(){var key=lcKey();if(!key||key===lKey)return;var hit=cacheGet(key);if(hit){lKey=key;LCOUNTS=hit;syncAll();return}
if(!lWant){var cs=document.querySelectorAll(".accordion__content.nffl-on--lc");for(var i=0;i<cs.length;i++){var d=cs[i].closest("details");if(d&&d.open){lWant=true;break}}}if(lWant)lcLoad()}
function sync(content){var kind=content.__nfFlKind,re=kind==="pt"?PT:LC,st={},live=0,anyOn=false,hasN=false;
inputs(content,re).forEach(function(i){var k=keyOf(kind,i.value);if(!st[k])st[k]={on:0,live:0,n:0};if(i.checked){st[k].on++;anyOn=true}if(!i.disabled)st[k].live++;var l=labelOf(i);if(l&&/\(\d+\)\s*$/.test(l.textContent))hasN=true;st[k].n+=countOf(i)});
[].forEach.call(content.querySelectorAll(".nffl .nfcg__opt"),function(b){var k=b.getAttribute("data-nffl"),s=st[k]||{on:0,live:0,n:0},v=s.on?"true":"false";
if(b.getAttribute("aria-checked")!==v)b.setAttribute("aria-checked",v);if(b.classList.contains("is-on")!==!!s.on)b.classList.toggle("is-on",!!s.on);
var zero=kind==="pt"?(hasN&&!s.n):(LCOUNTS?!LCOUNTS[k]:(lFail&&hasN&&!s.n)),dead=!s.on&&(!s.live||zero);if(b.classList.contains("is-dead")!==dead){b.classList.toggle("is-dead",dead);b.disabled=dead}if(!dead)live++;
var n=kind==="pt"?s.n:(LCOUNTS?(LCOUNTS[k]||0):(lFail?s.n:0)),txt=n?"("+n+")":"",ne=b.querySelector(".nfcg__n");if(ne&&ne.textContent!==txt)ne.textContent=txt;
var nm=b.querySelector(".nfcg__name"),al=(nm?nm.textContent:k)+(n?", "+n+" products":"");if(b.getAttribute("aria-label")!==al)b.setAttribute("aria-label",al)});
if(kind==="pt"){var acc=content.closest("accordion-disclosure")||content.closest("details"),hide=live<2&&!anyOn;if(acc&&acc.classList.contains("nffl-hide")!==hide)acc.classList.toggle("nffl-hide",hide)}}
function syncAll(){var cs=document.querySelectorAll(".accordion__content.nffl-on");for(var i=0;i<cs.length;i++)sync(cs[i])}
function toggle(content,k){var kind=content.__nfFlKind,ins=inputs(content,kind==="pt"?PT:LC).filter(function(i){return keyOf(kind,i.value)===k});if(!ins.length)return;
var on=ins.some(function(i){return i.checked}),last=null;ins.forEach(function(i){var want=!on&&!i.disabled;if(i.checked!==want){i.checked=want;last=i}});sync(content);if(last)last.dispatchEvent(new Event("change",{bubbles:true}))}
function scene(k){var s=el("span","nffl__sc nffl__sc--"+k);s.setAttribute("aria-hidden","true");["cord","shade","beam","pool"].forEach(function(p){s.appendChild(el("span","nffl__"+p))});return s}
function enhance(content){var kind=inputs(content,PT).length?"pt":inputs(content,LC).length?"lc":"";if(!kind)return;var ins=inputs(content,kind==="pt"?PT:LC),sig=ins.map(function(i){return i.value}).join("\n"),box=content.querySelector(":scope > .nffl");
if(box&&box.__nfFlSig===sig){sync(content);return}if(box)box.parentNode.removeChild(box);
content.__nfFlKind=kind;var keys=[],lab={};ins.forEach(function(i){var k=keyOf(kind,i.value);if(!lab[k]){lab[k]=kind==="pt"?ptName(i.value):LNAME[k];keys.push(k)}});
if(kind==="pt")keys.sort(function(a,b){return lab[a].localeCompare(lab[b])});else keys=LG.map(function(g){return g[0]}).filter(function(k){return lab[k]});
box=el("div","nfcg nffl nffl--"+kind);box.setAttribute("role","group");box.setAttribute("aria-label",kind==="pt"?"Product type":"Light color");
keys.forEach(function(k){var b=el("button","nfcg__opt nffl__opt");b.type="button";b.setAttribute("role","checkbox");b.setAttribute("aria-checked","false");b.setAttribute("data-nffl",k);
if(kind==="pt"){var bx=el("span","nffl__box");bx.setAttribute("aria-hidden","true");b.appendChild(bx)}else b.appendChild(scene(k));
var tx=el("span","nfcg__txt");tx.appendChild(el("span","nfcg__name",lab[k]));var n=el("span","nfcg__n","");n.setAttribute("aria-hidden","true");
if(kind==="lc"){var meta=el("span","nffl__meta"),sub=el("span","nffl__sub",LSUB[k]);sub.setAttribute("aria-hidden","true");meta.appendChild(sub);meta.appendChild(n);tx.appendChild(meta)}else tx.appendChild(n);b.appendChild(tx);box.appendChild(b)});
box.__nfFlSig=sig;box.addEventListener("click",function(e){var b=e.target&&e.target.closest?e.target.closest(".nfcg__opt"):null;if(b&&!b.disabled)toggle(content,b.getAttribute("data-nffl"))});
content.insertBefore(box,content.firstChild);content.classList.add("nffl-on","nffl-on--"+kind);sync(content)}
function active(){var out=[];new URL(location.href).searchParams.forEach(function(v,k){if(PT.test(k)||LC.test(k))out.push([k,v])});return out}
window.nfFlDelta=function(){var a=active(),g={};a.forEach(function(p){g[(PT.test(p[0])?"pt:"+ptKey(p[1]):"lc:"+lgroup(p[1]))]=1});return a.length-Object.keys(g).length};
function chips(){var act=active();if(!act.length)return;var sig=location.search,boxes=document.querySelectorAll(".active-facets");
for(var b=0;b<boxes.length;b++){var box=boxes[b];if(box.getAttribute("data-nffl")===sig)continue;var seen={};
[].forEach.call(box.querySelectorAll(".removable-facet"),function(rf){var a=rf.querySelector("facet-link > a[href]")||rf.querySelector("a[href]");if(!a)return;var u;try{u=new URL(a.getAttribute("data-nffl-href")||a.getAttribute("href"),location.href)}catch(e){return}
var left=[];u.searchParams.forEach(function(v,k){if(PT.test(k)||LC.test(k))left.push(k+"\n"+v)});
var removed=act.filter(function(p){var i=left.indexOf(p[0]+"\n"+p[1]);if(i>-1){left.splice(i,1);return false}return true});if(removed.length!==1)return;
var p=removed[0],isPT=PT.test(p[0]),gk=isPT?"pt:"+ptKey(p[1]):"lc:"+lgroup(p[1]),name=isPT?ptName(p[1]):LNAME[lgroup(p[1])];
if(!a.getAttribute("data-nffl-href"))a.setAttribute("data-nffl-href",a.getAttribute("href"));
if(seen[gk]){rf.hidden=true;rf.classList.add("nffl-dup");return}seen[gk]=1;
var np=new URLSearchParams();new URL(location.href).searchParams.forEach(function(v,k){var mine=(PT.test(k)||LC.test(k))&&(PT.test(k)?"pt:"+ptKey(v):"lc:"+lgroup(v))===gk;if(!mine&&k!=="page"&&k!=="section_id")np.append(k,v)});
var q=np.toString();a.setAttribute("href",location.pathname+(q?"?"+q:""));
var sp=rf.querySelector("span")||a,txt=sp.textContent,c=txt.indexOf(": "),want=(c>-1&&txt.slice(c+2).trim()===p[1]?txt.slice(0,c+2):"")+name;
if(sp.children.length===0&&txt.trim()!==want)sp.textContent=want;var al=a.getAttribute("aria-label");if(al&&al.indexOf(p[1])>-1)a.setAttribute("aria-label",al.replace(p[1],name))});
box.setAttribute("data-nffl",sig)}}
var CP=/^filter\.v\.option\.colou?rs?$/i;
function fixCount(){var d=window.nfFlDelta(),cd=0,g=window.__nfCgGroupOf;if(g){var n0=0,gs={};new URL(location.href).searchParams.forEach(function(v,k){if(CP.test(k)){n0++;gs[g(v)]=1}});cd=n0-Object.keys(gs).length}
[].forEach.call(document.querySelectorAll('.collection-toolbar button[aria-controls="facets-drawer"] .nf-mui-fcount'),function(c){var raw=c.getAttribute("data-nffl-raw");
if(raw===null){var o=c.getAttribute("data-nfcg-orig");raw=o!==null?o:c.textContent.trim();c.setAttribute("data-nffl-raw",raw)}
var base=Math.max(0,(parseInt(raw,10)||0)-d),n=Math.max(0,base-cd);if(c.getAttribute("data-nfcg-orig")!==String(base))c.setAttribute("data-nfcg-orig",String(base));if(c.textContent!==String(n))c.textContent=String(n);
var btn=c.closest("button"),lab=btn&&btn.querySelector(".nf-mui-flabel"),al=(lab?lab.textContent:"Filter")+", "+n+" active";if(btn&&btn.getAttribute("aria-label")!==al)btn.setAttribute("aria-label",al)})}
function run(){var cs=document.querySelectorAll("facets-form .accordion__content"),lc=false;for(var i=0;i<cs.length;i++){enhance(cs[i]);if(cs[i].classList.contains("nffl-on--lc"))lc=true}chips();fixCount();if(lc)lcMaybe()}
var t=0;function schedule(){if(!t)t=setTimeout(function(){t=0;run()},60)}
function intent(e){var x=e.target;if(x&&x.closest&&x.closest('.facets-sidebar, facets-form, facets-drawer, button[aria-controls="facets-drawer"]'))lcWant()}
function boot(){if(!document.querySelector("facets-form, facets-drawer")&&!/^\/(collections|search)/.test(location.pathname))return;run();
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
document.addEventListener("change",function(e){var f=e.target&&e.target.closest?e.target.closest("facets-form"):null;if(f){var cs=f.querySelectorAll(".accordion__content.nffl-on");for(var i=0;i<cs.length;i++)sync(cs[i])}},true);
document.addEventListener("toggle",function(e){var d=e.target;if(d&&d.open&&d.closest&&d.closest("facets-form"))lcWant()},true);
document.addEventListener("dialog:before-show",function(e){if(e.target&&e.target.localName==="facets-drawer")lcWant()},true);
["pointerover","focusin","touchstart"].forEach(function(type){document.addEventListener(type,intent,{capture:true,passive:true})})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();


/* NF-SMOOTH-V1 accordion: accordion-disclosure opens and closes on the compositor only.
   The theme animated the details HEIGHT (layout + paint every frame of the whole filter sheet / page).
   Now: one layout at the start, then the groups below slide (transform) and the content fades (opacity). */
(function(){
  if (window.__nfSmAcc || !Element.prototype.animate) return; window.__nfSmAcc = 1;
  var OPEN_MS = 270, CLOSE_MS = 240, E_OPEN = 'cubic-bezier(.22,.8,.24,1)', E_CLOSE = 'cubic-bezier(.4,0,.2,1)';
  var mq = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  function rm(){ return !!(mq && mq.matches); }
  function fp(el){ return el.assignedSlot || el.parentElement || (el.getRootNode && el.getRootNode().host) || null; }
  function isContents(el){ return getComputedStyle(el).display === 'contents'; }
  function bgOf(el){
    for (var e = el; e && e.nodeType === 1; e = fp(e)) {
      var c = getComputedStyle(e).backgroundColor;
      if (c && c !== 'transparent' && !/rgba\([^)]*,\s*0\)$/.test(c)) return c;
    }
    return '#fff';
  }
  /* ancestors of el (flat tree) with their heights, up to the first that is a scroll box or html */
  function chainOf(el){
    var out = [];
    for (var e = fp(el); e && e.nodeType === 1 && out.length < 30; e = fp(e)) {
      if (e === document.documentElement) break;
      out.push(e);
    }
    return out;
  }
  function heights(chain){ return chain.map(function(e){ return isContents(e) ? -1 : e.getBoundingClientRect().height; }); }
  function siblingsAfter(e){
    var out = [], slot = e.assignedSlot || null;
    for (var s = e.nextElementSibling; s; s = s.nextElementSibling) {
      if ((s.assignedSlot || null) !== slot) continue;
      out.push(s);
    }
    return out;
  }
  function scrollBox(chain){
    for (var i = 0; i < chain.length; i++) {
      var e = chain[i]; if (isContents(e)) continue;
      var o = getComputedStyle(e).overflowY;
      if ((o === 'auto' || o === 'scroll') && e.clientHeight > 0) return { box: e, top: chain[i - 1] && isContents(chain[i - 1]) ? chain[i - 2] : chain[i - 1] };
    }
    return null;
  }
  /* followers = every box after the accordion that moves when it grows, stopping at the first ancestor whose height is fixed */
  function followers(chain, hb, ha, delta, viewBottom){
    /* chain[0] is the accordion host; walk up while the parent box changed size */
    var out = [], seen = [];
    for (var i = 0; i < chain.length - 1; i++) {
      var sib = siblingsAfter(chain[i]);
      for (var j = 0; j < sib.length; j++) {
        var s = sib[j];
        if (seen.indexOf(s) !== -1) continue;
        var cs = getComputedStyle(s);
        if (cs.display === 'none' || cs.position === 'fixed' || cs.position === 'sticky' || cs.position === 'absolute') continue;
        var r = s.getBoundingClientRect();
        if (r.height === 0 && r.width === 0) continue;
        if (r.top - Math.abs(delta) > viewBottom) break;     /* off screen for the whole motion */
        seen.push(s); out.push(s);
      }
      if (hb[i + 1] !== -1 && Math.abs(hb[i + 1] - ha[i + 1]) < 0.5) break;   /* the parent did not change size: nothing outside it moves */
    }
    return out;
  }
  function run(list){ return list.map(function(x){ var a = x[0].animate(x[1], x[2]); return a; }); }
  function stop(host){ var st = host.__nfSm; if (st) { host.__nfSm = null; st.end(true); } }
  function prep(els, bg){
    els.forEach(function(s){
      s.__nfSmBg = s.style.backgroundColor; s.__nfSmWc = s.style.willChange;
      var own = getComputedStyle(s).backgroundColor;
      if (!own || own === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(own)) s.style.backgroundColor = bg;
      s.style.willChange = 'transform';
    });
  }
  function unprep(els){ els.forEach(function(s){ s.style.backgroundColor = s.__nfSmBg || ''; s.style.willChange = s.__nfSmWc || ''; }); }

  function patch(C){
    if (!C || C.prototype.__nfSmPatched) return;
    C.prototype.__nfSmPatched = 1;
    var origOpen = C.prototype.open, origClose = C.prototype.close;
    C.prototype.open = function(o){
      var d = this.disclosureElement; if (!d) return origOpen.call(this, o);
      if (d.getAttribute('aria-expanded') === 'true' && d.open) return;
      stop(this);
      var instant = o && o.instant;
      var chain = chainOf(d), hb = heights(chain), before = d.getBoundingClientRect().height;
      d.open = true; d.setAttribute('aria-expanded', 'true');
      if (instant || !d.getClientRects().length) return;
      var content = this.contentElement;
      if (rm()) {
        var a0 = content && content.animate({ opacity: [0, 1] }, { duration: 200, easing: 'ease' });
        return;
      }
      var after = d.getBoundingClientRect().height, delta = after - before, ha = heights(chain);
      if (delta < 1) return;
      var sb = scrollBox(chain), vb = sb ? sb.box.getBoundingClientRect().bottom : innerHeight;
      var fol = followers(chain, hb, ha, delta, vb);
      prep(fol, bgOf(d));
      var anims = run([[content, { opacity: [0, 1], transform: ['translateY(-10px)', 'none'] }, { duration: OPEN_MS, easing: E_OPEN, fill: 'both' }]]
        .concat(fol.map(function(s){ return [s, { transform: ['translateY(' + (-delta) + 'px)', 'none'] }, { duration: OPEN_MS, easing: E_OPEN, fill: 'both', composite: 'add' }]; })));
      var self = this, done = false;
      var st = { end: function(){ if (done) return; done = true; anims.forEach(function(a){ try { a.cancel(); } catch (e) {} }); unprep(fol); if (self.__nfSm === st) self.__nfSm = null; } };
      this.__nfSm = st;
      Promise.all(anims.map(function(a){ return a.finished; })).then(function(){ st.end(); }, function(){});
    };
    C.prototype.close = function(){
      var d = this.disclosureElement; if (!d) return origClose.call(this);
      stop(this);
      d.setAttribute('aria-expanded', 'false');
      if (!d.open) return;
      var content = this.contentElement;
      if (!d.getClientRects().length || !content) { d.removeAttribute('open'); return; }
      var self = this;
      if (rm()) {
        var a1 = content.animate({ opacity: [1, 0] }, { duration: 160, easing: 'ease', fill: 'forwards' });
        a1.finished.then(function(){ if (d.getAttribute('aria-expanded') !== 'true') d.removeAttribute('open'); a1.cancel(); }, function(){});
        return;
      }
      /* measure the closed layout once, exactly, without toggling state */
      var chain = chainOf(d), ha = heights(chain), before = d.getBoundingClientRect().height;
      var sb = scrollBox(chain), st0 = sb ? sb.box.scrollTop : 0;
      var ov = content.style.display; content.style.display = 'none';
      var after = d.getBoundingClientRect().height, hc = heights(chain);
      var maxAfter = sb ? Math.max(0, sb.box.scrollHeight - sb.box.clientHeight) : 0;
      content.style.display = ov;
      if (sb) sb.box.scrollTop = st0;
      var delta = before - after;
      if (delta < 1) { d.removeAttribute('open'); return; }
      var clamp = sb && st0 > maxAfter ? st0 - maxAfter : 0;
      var vb = sb ? sb.box.getBoundingClientRect().bottom : innerHeight;
      var fol = followers(chain, hc, ha, delta, vb);
      prep(fol, bgOf(d));
      var top = clamp && sb.top && sb.top.nodeType === 1 ? sb.top : null;
      var list = [[content, { opacity: [1, 0] }, { duration: Math.round(CLOSE_MS * 0.6), easing: 'ease', fill: 'forwards' }]];
      fol.forEach(function(s){
        var inTop = top && top.contains(s), dy = -delta + (top && !inTop ? clamp : 0);
        list.push([s, { transform: ['none', 'translateY(' + dy + 'px)'] }, { duration: CLOSE_MS, easing: E_CLOSE, fill: 'forwards', composite: 'add' }]);
      });
      if (top) { top.style.willChange = 'transform'; list.push([top, { transform: ['none', 'translateY(' + clamp + 'px)'] }, { duration: CLOSE_MS, easing: E_CLOSE, fill: 'forwards', composite: 'add' }]); }
      var anims = run(list), done = false;
      var st = { end: function(){
        if (done) return; done = true;
        if (d.getAttribute('aria-expanded') !== 'true') d.removeAttribute('open');   /* layout lands exactly where the transforms were */
        anims.forEach(function(a){ try { a.cancel(); } catch (e) {} });
        unprep(fol); if (top) top.style.willChange = '';
        if (self.__nfSm === st) self.__nfSm = null;
      } };
      this.__nfSm = st;
      Promise.all(anims.map(function(a){ return a.finished; })).then(function(){ st.end(); }, function(){});
    };
  }
  var C = window.customElements && customElements.get('accordion-disclosure');
  if (C) patch(C); else if (window.customElements) customElements.whenDefined('accordion-disclosure').then(function(){ patch(customElements.get('accordion-disclosure')); });
})();


/* NF-SMOOTH-V1 story: the collection story "View more / View less" animated max-height (layout + paint every frame for
   0.5s). Now the text box changes size once and everything below it slides with transform, same as the accordions.
   The element binds its click handler at connect time, so the smooth toggle takes the click in the capture phase. */
(function(){
  if (window.__nfSmStory || !Element.prototype.animate) return; window.__nfSmStory = 1;
  var DUR = 300, EASE = 'cubic-bezier(.22,.8,.24,1)';
  function rm(){ return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function clear(c){ return !c || c === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(c); }
  function bgOf(el){
    for (var e = el; e && e.nodeType === 1; e = e.parentElement) { var c = getComputedStyle(e).backgroundColor; if (!clear(c)) return c; }
    return '#fff';
  }
  function chainOf(el){ var out = []; for (var e = el; e && e !== document.body && e !== document.documentElement; e = e.parentElement) out.push(e); return out; }
  function heights(ch){ return ch.map(function(e){ return e.getBoundingClientRect().height; }); }
  function followers(ch, h1, h2, delta){
    var out = [], vb = innerHeight;
    for (var i = 0; i < ch.length; i++) {
      for (var s = ch[i].nextElementSibling; s; s = s.nextElementSibling) {
        var cs = getComputedStyle(s);
        if (cs.display === 'none' || cs.position === 'fixed' || cs.position === 'sticky' || cs.position === 'absolute') continue;
        var r = s.getBoundingClientRect();
        if (!r.height && !r.width) continue;
        if (r.top - Math.abs(delta) > vb) break;
        out.push(s);
      }
      if (i + 1 < ch.length && Math.abs(h1[i + 1] - h2[i + 1]) < 0.5) break;
    }
    return out;
  }
  function slide(fol, from, to, bg, done){
    fol.forEach(function(s){ s.__nfSmBg = s.style.backgroundColor; if (clear(getComputedStyle(s).backgroundColor)) s.style.backgroundColor = bg; s.style.willChange = 'transform'; });
    var an = fol.map(function(s){ return s.animate({ transform: ['translateY(' + from + 'px)', 'translateY(' + to + 'px)'] }, { duration: DUR, easing: EASE, fill: 'both', composite: 'add' }); });
    var fin = false;
    function end(){ if (fin) return; fin = true; if (done) done(); an.forEach(function(a){ try { a.cancel(); } catch (e) {} }); fol.forEach(function(s){ s.style.backgroundColor = s.__nfSmBg || ''; s.style.willChange = ''; }); }
    if (!an.length) { end(); return; }
    Promise.all(an.map(function(a){ return a.finished; })).then(end, end);
  }
  function toggle(host){
    var s = host.story, more = host.more;
    var opening = more.getAttribute('aria-expanded') !== 'true';
    var ch = chainOf(s), hb = heights(ch), trans = s.style.transition;
    s.style.transition = 'none';
    more.setAttribute('aria-expanded', opening ? 'true' : 'false');
    if (host.label) host.label.textContent = opening ? 'View less' : 'View more';
    if (opening) {
      s.style.maxHeight = ''; s.classList.add('is-open');
      var ha = heights(ch), delta = ha[0] - hb[0];
      s.offsetHeight; s.style.transition = trans;
      if (delta > 1) slide(followers(ch, hb, ha, delta), -delta, 0, bgOf(s));
      return;
    }
    /* closing: measure the clamped layout, put the open one back, slide everything below up over the extra text,
       then clamp in the same frame the slide ends */
    s.classList.remove('is-open'); s.style.maxHeight = '';
    var hc = heights(ch), d2 = hb[0] - hc[0];
    s.classList.add('is-open'); s.offsetHeight;
    if (d2 <= 1) { s.classList.remove('is-open'); s.style.transition = trans; return; }
    var fol = followers(ch, hc, hb, d2), title = host.querySelector('.nfcs__title');
    host.__nfSmBusy = true;
    slide(fol, 0, -d2, bgOf(s), function(){
      s.classList.remove('is-open'); s.offsetHeight; s.style.transition = trans; host.__nfSmBusy = false;
      if (title && more.getBoundingClientRect().top < 0) title.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  }
  document.addEventListener('click', function(e){
    var b = e.target && e.target.closest ? e.target.closest('[data-nfcs-toggle]') : null;
    if (!b || rm()) return;
    var host = b.closest('nf-collection-story');
    if (!host || !host.story || host.more !== b) return;
    e.stopImmediatePropagation(); e.preventDefault();
    if (host.__nfSmBusy) return;
    toggle(host);
  }, true);
})();

/* NF-JM-NOFLASH (2026-09-14): custom-nav.css hides Judge.me's stale server copy of the reviews until the real widget renders.
   Safety net: if the real widget has not appeared 8s after the page loaded, show the server copy again. */
(function () {
  var w = document.querySelector('.jdgm-review-widget');
  if (!w || !w.querySelector('.jdgm-ssr-reviews')) return;
  function check() { if (!w.querySelector('.jm-stack')) w.classList.add('nf-jm-fallback'); }
  function arm() { setTimeout(check, 8000); }
  if (document.readyState === 'complete') arm(); else window.addEventListener('load', arm, { once: true });
})();

/* NF-TOTOP-V1 (2026-09-17, owner: "add the button to scroll to the top of the page", phones only). Styles in custom-nav.css. */
(function () {
  if (window.__nfToTop) return; window.__nfToTop = 1;
  function init() {
    var mq = window.matchMedia('(max-width: 749px)');
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'nf-totop'; b.setAttribute('aria-label', 'Back to top');
    b.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(b);
    var on = false, ticking = false;
    function place() {
      var act = null;
      try { var c = document.querySelector('shopify-chat'); act = c && c.shadowRoot && c.shadowRoot.querySelector('[part=activator], button'); } catch (e) {}
      var r = act && act.getBoundingClientRect();
      if (r && r.height > 0 && r.top > 0) {
        b.style.bottom = Math.round(window.innerHeight - r.top + 12) + 'px';
        b.style.right = Math.max(8, Math.round(window.innerWidth - r.right + (r.width - 46) / 2)) + 'px';
      } else { b.style.bottom = ''; b.style.right = ''; }
    }
    function upd() { ticking = false; var show = mq.matches && window.scrollY > window.innerHeight * 1.2; if (show) place(); if (show !== on) { on = show; b.classList.toggle('is-on', show); } }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    if (mq.addEventListener) mq.addEventListener('change', upd);
    b.addEventListener('click', function () { var r = window.matchMedia('(prefers-reduced-motion: reduce)').matches; window.scrollTo({ top: 0, behavior: r ? 'auto' : 'smooth' }); b.blur(); });
    upd();
  }
  if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
})();


/* NF-ORDERINFO-V1 - asks for the details the supplier needs, on the way into the cart */
(function () {
  var OPEN = 'nf-oi-open';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  function readConfig(form) {
    var holder = form.querySelector('.nf-oi-data');
    if (!holder) return null;
    try { return JSON.parse(holder.getAttribute('data-nf-oi')); } catch (e) { return null; }
  }

  function buildPanel(cfg) {
    var wrap = document.createElement('div');
    wrap.className = 'nf-oi';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', cfg.title || 'Order details');
    var rows = (cfg.fields || []).map(function (f) {
      var id = 'nf-oi-' + f.k;
      var input;
      if (f.t === 'select') {
        input = '<select id="' + id + '" data-k="' + esc(f.k) + '">' + (f.opts || []).map(function (o) {
          return '<option value="' + esc(o) + '"' + (String(f.d) === String(o) ? ' selected' : '') + '>' + esc(o) + '</option>';
        }).join('') + '</select>';
      } else {
        input = '<input id="' + id + '" type="text" inputmode="numeric" autocomplete="off" data-k="' + esc(f.k) + '" placeholder="' + esc(f.ph || '') + '">';
      }
      return '<div class="nf-oi__row">'
        + '<label class="nf-oi__lab" for="' + id + '">' + esc(f.l) + (f.opt ? ' <span class="nf-oi__opt">optional</span>' : '') + '</label>'
        + input
        + (f.help ? '<p class="nf-oi__help">' + esc(f.help) + '</p>' : '')
        + '</div>';
    }).join('');
    wrap.innerHTML = '<div class="nf-oi__sheet">'
      + '<button type="button" class="nf-oi__x" aria-label="Close">&times;</button>'
      + '<h2 class="nf-oi__h">' + esc(cfg.title || 'A couple of details') + '</h2>'
      + (cfg.intro ? '<p class="nf-oi__intro">' + esc(cfg.intro) + '</p>' : '')
      + '<div class="nf-oi__rows">' + rows + '</div>'
      + '<button type="button" class="nf-oi__go">Add to cart</button>'
      + '<button type="button" class="nf-oi__skip">Skip, send the details later</button>'
      + '<p class="nf-oi__foot">Skipping is fine. Nora Furnish will email this address for the details before the order ships.</p>'
      + '</div>';
    return wrap;
  }

  function apply(form, cfg, values) {
    (cfg.fields || []).forEach(function (f) {
      var input = form.querySelector('[data-nf-oi-field="' + f.k + '"]');
      if (!input) return;
      var v = (values[f.k] || '').trim();
      if (v) { input.value = v; input.disabled = false; } else { input.value = ''; input.disabled = true; }
    });
  }

  function open(form, cfg, submit) {
    var panel = buildPanel(cfg);
    document.body.appendChild(panel);
    document.documentElement.classList.add(OPEN);
    requestAnimationFrame(function () { panel.classList.add('is-on'); });
    var first = panel.querySelector('input, select');
    if (first) { try { first.focus({ preventScroll: true }); } catch (e) {} }

    function close() {
      panel.classList.remove('is-on');
      document.documentElement.classList.remove(OPEN);
      setTimeout(function () { if (panel.parentNode) panel.parentNode.removeChild(panel); }, 220);
    }
    function collect() {
      var out = {};
      panel.querySelectorAll('[data-k]').forEach(function (el) { out[el.getAttribute('data-k')] = el.value || ''; });
      return out;
    }
    function done(values) { apply(form, cfg, values); close(); submit(); }

    panel.querySelector('.nf-oi__go').addEventListener('click', function () {
      var values = collect();
      var missing = (cfg.fields || []).filter(function (f) { return !f.opt && !(values[f.k] || '').trim(); });
      if (missing.length) {
        panel.querySelectorAll('[data-k]').forEach(function (el) {
          var k = el.getAttribute('data-k');
          el.classList.toggle('is-empty', missing.some(function (m) { return m.k === k; }));
        });
        var note = panel.querySelector('.nf-oi__warn');
        if (!note) {
          note = document.createElement('p');
          note.className = 'nf-oi__warn';
          panel.querySelector('.nf-oi__go').before(note);
        }
        note.textContent = 'Fill these in, or use the skip link below and we will email you.';
        return;
      }
      done(values);
    });
    panel.querySelector('.nf-oi__skip').addEventListener('click', function () { done({}); });
    panel.querySelector('.nf-oi__x').addEventListener('click', close);
    panel.addEventListener('click', function (e) { if (e.target === panel) close(); });
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); }
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('button[type="submit"], [name="add"]');
    if (!btn) return;
    var form = btn.closest('form[action*="/cart/add"]');
    if (!form) return;
    if (form.hasAttribute('data-nf-oi-done')) return;
    var cfg = readConfig(form);
    if (!cfg || !(cfg.fields || []).length) return;
    e.preventDefault();
    e.stopPropagation();
    open(form, cfg, function () {
      form.setAttribute('data-nf-oi-done', '1');
      btn.click();
      setTimeout(function () { form.removeAttribute('data-nf-oi-done'); }, 1500);
    });
  }, true);
})();
