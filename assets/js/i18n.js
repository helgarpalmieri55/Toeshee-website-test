(function () {
  'use strict';

  var LANG_KEY = 'toeshee_lang';
  var current = localStorage.getItem(LANG_KEY) || 'en';

  // ── Hide Google Translate toolbar & banner ────────────────────────────────
  var styleEl = document.createElement('style');
  styleEl.textContent = [
    '.goog-te-banner-frame, .goog-te-balloon-frame { display:none !important; }',
    'body { top: 0 !important; }',
    '#goog-gt-tt, .goog-te-balloon-frame { display:none !important; }',
    '.goog-tooltip, .goog-tooltip:hover { display:none !important; }',
    '.goog-text-highlight { background:none !important; box-shadow:none !important; }',
    /* Hide the injected iframe Google adds */
    'iframe.goog-te-menu-frame { display:none !important; }',
    '#google_translate_element { display:none !important; }',
  ].join('\n');
  document.head.appendChild(styleEl);

  // ── Inject hidden Google Translate element & load script ──────────────────
  var gtEl = document.createElement('div');
  gtEl.id = 'google_translate_element';
  gtEl.style.display = 'none';
  document.body.appendChild(gtEl);

  window.googleTranslateElementInit = function () {
    new window.google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,es',
      autoDisplay: false,
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
    // Google Translate reads the googtrans cookie automatically — no reload needed.
  };

  var gtScript = document.createElement('script');
  gtScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  gtScript.async = true;
  document.head.appendChild(gtScript);

  // ── Trigger Google Translate to a given language ──────────────────────────
  function triggerGoogleTranslate(lang) {
    // Google Translate uses a cookie named "googtrans" to remember the language
    // Setting it directly is the most reliable way to switch
    var domain = location.hostname === 'localhost' || location.hostname === '' ? '' : '.' + location.hostname;

    // Clear existing cookie first
    document.cookie = 'googtrans=; path=/; domain=' + domain + '; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';

    if (lang !== 'en') {
      var val = '/en/' + lang;
      document.cookie = 'googtrans=' + val + '; path=/; domain=' + domain;
      document.cookie = 'googtrans=' + val + '; path=/';
    }

    // Reload to apply — GT needs a page refresh when triggered via cookie
    location.reload();
  }

  // ── Language toggle button ────────────────────────────────────────────────
  function injectToggle() {
    // Reposition if cookie banner is visible so they don't overlap
    var rightOffset = '24px';

    var btn = document.createElement('button');
    btn.id = 'lang-toggle';
    btn.setAttribute('aria-label', 'Switch language / Cambiar idioma');
    btn.style.cssText = [
      'position:fixed', 'bottom:24px', 'right:' + rightOffset, 'z-index:99998',
      'background:#0A0A0F', 'color:#fff',
      'border:1px solid rgba(255,255,255,0.15)',
      'border-radius:100px', 'padding:8px 16px',
      'font-family:Space Grotesk,sans-serif', 'font-weight:600', 'font-size:13px',
      'cursor:pointer', 'display:flex', 'align-items:center', 'gap:6px',
      'box-shadow:0 4px 20px rgba(0,0,0,0.25)',
      'transition:background .2s, transform .2s, opacity .3s',
      'opacity:1'
    ].join(';');

    function label() {
      return current === 'en'
        ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg><span>ES</span>'
        : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg><span>EN</span>';
    }

    btn.innerHTML = label();

    btn.addEventListener('mouseenter', function () { btn.style.background = '#FF3A10'; btn.style.transform = 'translateY(-2px)'; });
    btn.addEventListener('mouseleave', function () { btn.style.background = '#0A0A0F'; btn.style.transform = 'translateY(0)'; });

    btn.addEventListener('click', function () {
      var next = current === 'en' ? 'es' : 'en';
      localStorage.setItem(LANG_KEY, next);
      btn.style.opacity = '0.5';
      btn.disabled = true;
      triggerGoogleTranslate(next);
    });

    document.body.appendChild(btn);
  }

  // ── On page load: if GT cookie is set but localStorage says EN, sync up ───
  function syncState() {
    var m = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (m && m[1] !== 'en') {
      current = m[1];
      localStorage.setItem(LANG_KEY, current);
    } else if (!m || m[1] === 'en') {
      // No active translation; make sure we're in sync
      if (current === 'es') {
        // localStorage says ES but cookie says EN → GT was cleared; treat as EN
        // (this can happen after manual cookie clear)
      }
    }
  }

  function init() {
    syncState();
    injectToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
