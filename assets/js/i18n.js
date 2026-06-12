(function () {
  'use strict';

  var LANG_KEY = 'toeshee_lang';
  var current = localStorage.getItem(LANG_KEY) || 'en';

  // ── Hide ALL Google Translate UI ──────────────────────────────────────────
  var styleEl = document.createElement('style');
  styleEl.textContent = [
    '.goog-te-banner-frame { display:none !important; }',
    '.goog-te-balloon-frame { display:none !important; }',
    '.goog-te-menu-frame { display:none !important; }',
    '#goog-gt-tt { display:none !important; }',
    '.goog-tooltip { display:none !important; }',
    '.goog-text-highlight { background:none !important; box-shadow:none !important; }',
    '.goog-te-gadget { display:none !important; }',
    '.goog-te-gadget-simple { display:none !important; }',
    '#google_translate_element { display:none !important; }',
    '#google_translate_element * { display:none !important; }',
    'body { top:0 !important; position:static !important; }',
  ].join('\n');
  document.head.appendChild(styleEl);

  // ── Inject hidden GT container ────────────────────────────────────────────
  var gtEl = document.createElement('div');
  gtEl.id = 'google_translate_element';
  gtEl.setAttribute('aria-hidden', 'true');
  gtEl.style.cssText = 'display:none!important;visibility:hidden!important;width:0;height:0;overflow:hidden;position:absolute;left:-9999px';
  document.body.appendChild(gtEl);

  window.googleTranslateElementInit = function () {
    new window.google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,es',
      autoDisplay: false,
    }, 'google_translate_element');
    // GT reads googtrans cookie automatically — no reload needed.
  };

  var gtScript = document.createElement('script');
  gtScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  gtScript.async = true;
  document.head.appendChild(gtScript);

  // ── Trigger language change via cookie + reload ───────────────────────────
  function triggerGoogleTranslate(lang) {
    var domain = location.hostname && location.hostname !== 'localhost'
      ? '.' + location.hostname : '';
    // Clear
    document.cookie = 'googtrans=; path=/; domain=' + domain + '; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    if (lang !== 'en') {
      var val = '/en/' + lang;
      if (domain) document.cookie = 'googtrans=' + val + '; path=/; domain=' + domain;
      document.cookie = 'googtrans=' + val + '; path=/';
    }
    location.reload();
  }

  // ── Language toggle button ────────────────────────────────────────────────
  function injectToggle() {
    var btn = document.createElement('button');
    btn.id = 'lang-toggle';
    btn.setAttribute('aria-label', 'Switch language / Cambiar idioma');
    btn.style.cssText = [
      'position:fixed', 'bottom:24px', 'right:24px', 'z-index:99998',
      'background:#0A0A0F', 'color:#fff',
      'border:1px solid rgba(255,255,255,0.15)',
      'border-radius:100px', 'padding:8px 16px',
      'font-family:Space Grotesk,sans-serif', 'font-weight:600', 'font-size:13px',
      'cursor:pointer', 'display:flex', 'align-items:center', 'gap:6px',
      'box-shadow:0 4px 20px rgba(0,0,0,0.25)',
      'transition:background .2s, transform .2s, opacity .3s',
    ].join(';');

    function renderBtn() {
      btn.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>' +
        '<span>' + (current === 'en' ? 'ES' : 'EN') + '</span>';
    }
    renderBtn();

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

  // ── Sync localStorage with active googtrans cookie ────────────────────────
  function syncState() {
    var m = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (m && m[1] && m[1] !== 'en') {
      current = m[1];
      localStorage.setItem(LANG_KEY, current);
    }
  }

  // ── Periodically nuke any GT UI that slipped through ─────────────────────
  function suppressGtUI() {
    var selectors = [
      '.goog-te-banner-frame', '.goog-te-balloon-frame',
      '.goog-te-menu-frame', '#goog-gt-tt',
      '.goog-te-gadget', '.goog-te-gadget-simple',
    ];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.style.setProperty('display', 'none', 'important');
      });
    });
    // Keep body at top
    document.body.style.setProperty('top', '0', 'important');
  }

  function init() {
    syncState();
    injectToggle();
    // Run once after GT loads, then every 2s briefly to catch late-injected elements
    setTimeout(suppressGtUI, 1500);
    setTimeout(suppressGtUI, 3000);
    setTimeout(suppressGtUI, 5000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
