/* NF collection story (sections/nf-collection-story.liquid), 2026-09-10.
 * Custom element, so it initializes itself whenever the section is (re)inserted, including the theme editor.
 * - Write up: collapsed to a few lines with a fade; the pill toggles View more / View less with a smooth height change.
 *   A story short enough to fit is shown in full and the pill is hidden.
 * - FAQ cards: answers shown by default; the question button hides or shows its answer (aria-expanded, native keyboard).
 * Touches nothing outside its own element. */
(function () {
  if (!window.customElements || window.customElements.get('nf-collection-story')) return;
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  function afterTransition(el, done) {
    if (reduce.matches) { done(); return; }
    var finished = false;
    function finish(e) {
      if (finished || (e && (e.target !== el || e.propertyName !== 'max-height'))) return;
      finished = true;
      el.removeEventListener('transitionend', finish);
      done();
    }
    el.addEventListener('transitionend', finish);
    setTimeout(finish, 700);
  }

  class NfCollectionStory extends HTMLElement {
    connectedCallback() {
      if (this._nfcsReady) return;
      this._nfcsReady = true;
      this.story = this.querySelector('[data-nfcs-story]');
      this.more = this.querySelector('[data-nfcs-toggle]');
      this.label = this.querySelector('[data-nfcs-label]');
      if (this.story && this.more) {
        this.more.addEventListener('click', this.toggleStory.bind(this));
        this.checkShort();
        var self = this, t = null;
        this._onResize = function () { clearTimeout(t); t = setTimeout(function () { self.checkShort(); }, 150); };
        window.addEventListener('resize', this._onResize, { passive: true });
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { self.checkShort(); });
      }
      var buttons = this.querySelectorAll('[data-nfcs-q]');
      for (var i = 0; i < buttons.length; i++) buttons[i].addEventListener('click', this.toggleFaq.bind(this, buttons[i]));
    }

    disconnectedCallback() {
      if (this._onResize) window.removeEventListener('resize', this._onResize);
    }

    checkShort() {
      var s = this.story;
      if (s.classList.contains('is-open')) return;
      s.classList.remove('is-short');
      var fits = s.scrollHeight <= s.clientHeight + 8;
      s.classList.toggle('is-short', fits);
      this.more.hidden = fits;
    }

    toggleStory() {
      var s = this.story;
      var opening = this.more.getAttribute('aria-expanded') !== 'true';
      this.more.setAttribute('aria-expanded', opening ? 'true' : 'false');
      if (this.label) this.label.textContent = opening ? 'View less' : 'View more';
      if (opening) {
        s.style.maxHeight = s.scrollHeight + 'px';
        s.classList.add('is-open');
        afterTransition(s, function () { s.style.maxHeight = ''; });
      } else {
        s.style.maxHeight = s.scrollHeight + 'px';
        void s.offsetHeight;
        s.classList.remove('is-open');
        s.style.maxHeight = '';
        var title = this.querySelector('.nfcs__title');
        var self = this;
        afterTransition(s, function () {
          if (title && self.more.getBoundingClientRect().top < 0) {
            title.scrollIntoView({ block: 'start', behavior: reduce.matches ? 'auto' : 'smooth' });
          }
        });
      }
    }

    toggleFaq(btn) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      var show = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', show ? 'true' : 'false');
      panel.classList.toggle('is-hidden', !show);
      var card = btn.closest('.nfcs__card');
      if (card) card.classList.toggle('is-closed', !show);
    }
  }

  window.customElements.define('nf-collection-story', NfCollectionStory);
})();
