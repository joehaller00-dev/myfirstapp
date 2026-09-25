/* NF-HELP-V1 (2026-09-21): our own help button and panel, replaces the Shopify Inbox bubble.
   Quick answers plus a short message form that posts to Shopify /contact (lands in info@norafurnish.com). */
(function () {
  if (window.__nfHelp) return; window.__nfHelp = 1;
  var d = document, root = d.documentElement;
  var esc = function (s) { return String(s || '').replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); };
  var QA = [
    ['Where is my order?', 'Tap <a href="/apps/trackyourorder">Track your order</a> and enter your order number and email. You will see every step from our warehouse to your door.'],
    ['How long does shipping take?', 'Shipping is free across the USA. Most orders arrive in 6 to 9 business days in total. Made to order pieces take 3 to 4 weeks because each one is built for you.'],
    ['Can I return something?', 'Yes. You have 30 days from delivery. Send us a message below with your order number and we will walk you through it. Details are in our <a href="/policies/refund-policy">return policy</a>.'],
    ['Will it fit my room?', 'Every product page has a Dimensions section and a size chart. If you are between two sizes, send us your ceiling height or wall width below and we will tell you which one works.'],
    ['Do you offer bulk or trade pricing?', 'Yes. Buy any 2 items and 10% comes off automatically, or 3 or more for 15%. For larger projects, use Request a Bulk Quote on any product page or message us here.']
  ];
  var btn = d.createElement('button');
  btn.type = 'button'; btn.className = 'nfh-btn'; btn.setAttribute('aria-label', 'Need help? Ask us');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">' +
    '<path d="M5.2 4h13.6A2.2 2.2 0 0 1 21 6.2v8.6a2.2 2.2 0 0 1-2.2 2.2H9.6L4 21.5V17h1.2A2.2 2.2 0 0 1 3 14.8V6.2A2.2 2.2 0 0 1 5.2 4z"/>' +
    '<path d="M7.6 8.6h8.8M7.6 12.2h5.6"/></svg><span>Need help?</span>';
  var ov = null, panel = null, lastFocus = null;
  function build() {
    ov = d.createElement('div'); ov.className = 'nfh-ov'; ov.hidden = true;
    panel = d.createElement('div'); panel.className = 'nfh-panel'; panel.hidden = true;
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-labelledby', 'nfh-h');
    panel.innerHTML =
      '<div class="nfh-hd"><h2 id="nfh-h">How can we help?</h2><p>Quick answers below, or send us a note. A real person replies within one business day.</p>' +
      '<button type="button" class="nfh-x" aria-label="Close">&times;</button></div>' +
      '<div class="nfh-bd">' + QA.map(function (q) { return '<details class="nfh-q"><summary>' + esc(q[0]) + '</summary><div>' + q[1] + '</div></details>'; }).join('') +
      '<form class="nfh-form" novalidate><h3>Send us a message</h3>' +
      '<input name="name" type="text" autocomplete="name" placeholder="Your name" aria-label="Your name" required>' +
      '<input name="email" type="email" autocomplete="email" placeholder="Email" aria-label="Email" required>' +
      '<textarea name="body" placeholder="How can we help? Add your order number if you have one." aria-label="Message" required></textarea>' +
      '<p class="nfh-err" hidden></p><button type="submit" class="nfh-send">Send message</button>' +
      '<p class="nfh-note">Or email us at info@norafurnish.com</p></form></div>';
    d.body.appendChild(ov); d.body.appendChild(panel);
    panel.querySelector('.nfh-x').addEventListener('click', close);
    ov.addEventListener('click', close);
    var form = panel.querySelector('form'), err = panel.querySelector('.nfh-err'), send = panel.querySelector('.nfh-send');
    form.addEventListener('submit', function (e) {
      e.preventDefault(); err.hidden = true;
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var name = v('name'), email = v('email'), body = v('body');
      if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !body) { err.textContent = 'Please add your name, a valid email and a message.'; err.hidden = false; return; }
      send.disabled = true; send.textContent = 'Sending';
      var fd = new FormData();
      fd.append('form_type', 'contact'); fd.append('utf8', '✓');
      fd.append('contact[name]', name); fd.append('contact[email]', email);
      fd.append('contact[body]', 'HELP MESSAGE\nPage: ' + location.origin + location.pathname + '\n\n' + body);
      fetch('/contact', { method: 'POST', body: fd, credentials: 'same-origin' }).then(function (r) {
        if (!r.ok || !/contact_posted=true/.test(r.url || '')) throw 0;
        form.outerHTML = '<div class="nfh-ok"><h3>Message sent</h3><p>Thank you, ' + esc(name.split(' ')[0]) + '. We will reply to ' + esc(email) + ' within one business day.</p></div>';
      }).catch(function () {
        send.disabled = false; send.textContent = 'Send message';
        err.textContent = 'That did not send. Please email info@norafurnish.com and we will pick it up.'; err.hidden = false;
      });
    });
  }
  function open() {
    if (!panel) build();
    lastFocus = d.activeElement;
    ov.hidden = false; panel.hidden = false; root.classList.add('nfh-open');
    requestAnimationFrame(function () { ov.classList.add('is-on'); panel.classList.add('is-on'); });
    var f = panel.querySelector('summary'); if (f) f.focus();
  }
  function close() {
    if (!panel || panel.hidden) return;
    ov.classList.remove('is-on'); panel.classList.remove('is-on'); root.classList.remove('nfh-open');
    setTimeout(function () { ov.hidden = true; panel.hidden = true; }, 230);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  btn.addEventListener('click', open);
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  /* keep the button clear of the sticky Add to Cart bar on product pages */
  function lift() {
    var bar = d.querySelector('product-sticky-bar, .product-sticky-bar');
    var px = 0;
    if (bar) {
      var r = bar.getBoundingClientRect();
      if (r.height > 10 && r.top < window.innerHeight - 4) px = Math.round(window.innerHeight - r.top + 10);
    }
    var cur = root.style.getPropertyValue('--nf-chat-lift');
    var want = px ? px + 'px' : '';
    if (cur !== want) { if (want) root.style.setProperty('--nf-chat-lift', want); else root.style.removeProperty('--nf-chat-lift'); }
  }
  var ticking = false;
  function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(function () { ticking = false; lift(); }); }
  function mount() {
    d.body.appendChild(btn);
    lift();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    d.addEventListener('variant:change', onScroll);
    setTimeout(lift, 800); setTimeout(lift, 2000);
  }
  if (d.body) mount(); else d.addEventListener('DOMContentLoaded', mount);
})();
