(function () {
  'use strict';

  var LANG_KEY = 'toeshee_lang';
  var current = localStorage.getItem(LANG_KEY) || 'en';

  // ── Translations ──────────────────────────────────────────────────────────
  var t = {
    en: {
      nav_solutions:    'Solutions',
      nav_industries:   'Industries',
      nav_case_studies: 'Case Studies',
      nav_insights:     'Insights',
      nav_company:      'Company',
      nav_careers:      'Careers',
      nav_cta:          'Request Evaluation',
      // Solution dropdown
      sol_crypto:       'Crypto Customer Support',
      sol_crypto_sub:   'Critical layer of crypto security',
      sol_tech:         'Technical Support & Incident Handling',
      sol_tech_sub:     'L1–L3 escalation models',
      sol_trust:        'Trust & Safety Operations',
      sol_trust_sub:    'Platform integrity at scale',
      sol_risk:         'Risk Operations & Fraud Response',
      sol_risk_sub:     'Chain analysis signals',
      sol_sec:          'Security & Compliance Support',
      sol_sec_sub:      'KYC/AML, GDPR, MiCA, PCI-DSS',
      // Industry dropdown
      ind_fintech:      'Fintech',
      ind_igaming:      'iGaming',
      ind_exchanges:    'Crypto Exchanges',
      ind_defi:         'DeFi',
      ind_payments:     'Crypto Payment Processors',
      // Footer
      footer_solutions: 'Solutions',
      footer_company:   'Company',
      footer_legal:     'Legal',
      footer_privacy:   'Privacy Policy',
      footer_terms:     'Terms of Use',
      footer_cookies:   'Cookie Policy',
      footer_about:     'About',
      footer_careers:   'Careers',
      footer_case:      'Case Studies',
      footer_insights:  'Insights',
      // Cookie banner
      cookie_title:     'We use cookies',
      cookie_body:      'We use cookies to improve your experience. Read our',
      cookie_policy_link: 'Cookie Policy',
      cookie_body_end:  'to learn more.',
      cookie_accept:    'Accept All',
      cookie_decline:   'Decline',
    },
    es: {
      nav_solutions:    'Soluciones',
      nav_industries:   'Industrias',
      nav_case_studies: 'Casos de Éxito',
      nav_insights:     'Perspectivas',
      nav_company:      'Empresa',
      nav_careers:      'Empleo',
      nav_cta:          'Solicitar Evaluación',
      // Solution dropdown
      sol_crypto:       'Soporte al Cliente Cripto',
      sol_crypto_sub:   'Capa crítica de seguridad cripto',
      sol_tech:         'Soporte Técnico y Gestión de Incidentes',
      sol_tech_sub:     'Modelos de escalamiento L1–L3',
      sol_trust:        'Operaciones de Confianza y Seguridad',
      sol_trust_sub:    'Integridad de plataforma a escala',
      sol_risk:         'Operaciones de Riesgo y Respuesta al Fraude',
      sol_risk_sub:     'Señales de análisis en cadena',
      sol_sec:          'Soporte de Seguridad y Cumplimiento',
      sol_sec_sub:      'KYC/AML, GDPR, MiCA, PCI-DSS',
      // Industry dropdown
      ind_fintech:      'Fintech',
      ind_igaming:      'iGaming',
      ind_exchanges:    'Exchanges de Criptomonedas',
      ind_defi:         'DeFi',
      ind_payments:     'Procesadores de Pagos Cripto',
      // Footer
      footer_solutions: 'Soluciones',
      footer_company:   'Empresa',
      footer_legal:     'Legal',
      footer_privacy:   'Política de Privacidad',
      footer_terms:     'Términos de Uso',
      footer_cookies:   'Política de Cookies',
      footer_about:     'Acerca de',
      footer_careers:   'Empleo',
      footer_case:      'Casos de Éxito',
      footer_insights:  'Perspectivas',
      // Cookie banner
      cookie_title:     'Usamos cookies',
      cookie_body:      'Usamos cookies para mejorar tu experiencia. Lee nuestra',
      cookie_policy_link: 'Política de Cookies',
      cookie_body_end:  'para más información.',
      cookie_accept:    'Aceptar Todo',
      cookie_decline:   'Rechazar',
    }
  };

  // ── Apply translations to navbar & footer ─────────────────────────────────
  function applyLang(lang) {
    var tx = t[lang] || t['en'];
    var els = document.querySelectorAll('[data-i18n]');
    els.forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (tx[key] !== undefined) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = tx[key];
        } else {
          el.textContent = tx[key];
        }
      }
    });
    document.documentElement.lang = lang;
  }

  // ── Inject data-i18n keys into nav elements ───────────────────────────────
  function tagNavElements() {
    // Desktop nav links (by text content matching)
    var mappings = [
      { text: 'Solutions',    key: 'nav_solutions',    tagIndex: 0 },
      { text: 'Industries',   key: 'nav_industries',   tagIndex: 0 },
      { text: 'Case Studies', key: 'nav_case_studies' },
      { text: 'Insights',     key: 'nav_insights'     },
      { text: 'Company',      key: 'nav_company'      },
      { text: 'Careers',      key: 'nav_careers'      },
    ];

    // Tag navbar buttons/links
    var navEl = document.getElementById('navbar');
    if (!navEl) return;

    navEl.querySelectorAll('button, a').forEach(function(el) {
      var text = el.textContent.trim();
      mappings.forEach(function(m) {
        if (text === m.text && !el.getAttribute('data-i18n')) {
          el.setAttribute('data-i18n', m.key);
        }
      });
      // CTA button
      if ((text === 'Request Evaluation' || text === 'Solicitar Evaluación') && !el.getAttribute('data-i18n')) {
        el.setAttribute('data-i18n', 'nav_cta');
      }
    });

    // Tag dropdown items
    var dropdownMap = [
      { sub: 'Critical layer',  key: 'sol_crypto_sub' },
      { sub: 'L1',              key: 'sol_tech_sub'   },
      { sub: 'Platform integr', key: 'sol_trust_sub'  },
      { sub: 'Chain analysis',  key: 'sol_risk_sub'   },
      { sub: 'KYC',             key: 'sol_sec_sub'    },
      // Spanish subs
      { sub: 'Capa crítica',    key: 'sol_crypto_sub' },
      { sub: 'Modelos',         key: 'sol_tech_sub'   },
      { sub: 'Integridad',      key: 'sol_trust_sub'  },
      { sub: 'Señales',         key: 'sol_risk_sub'   },
    ];
    navEl.querySelectorAll('.text-xs.text-gray-400').forEach(function(el) {
      var text = el.textContent.trim();
      dropdownMap.forEach(function(m) {
        if (text.indexOf(m.sub) === 0 && !el.getAttribute('data-i18n')) {
          el.setAttribute('data-i18n', m.key);
        }
      });
    });

    var solMap = [
      { text: 'Crypto Customer Support',            key: 'sol_crypto'    },
      { text: 'Technical Support & Incident Hand',  key: 'sol_tech'      },
      { text: 'Trust & Safety Operations',          key: 'sol_trust'     },
      { text: 'Risk Operations & Fraud Response',   key: 'sol_risk'      },
      { text: 'Security & Compliance Support',      key: 'sol_sec'       },
      { text: 'Fintech',                            key: 'ind_fintech'   },
      { text: 'iGaming',                            key: 'ind_igaming'   },
      { text: 'Crypto Exchanges',                   key: 'ind_exchanges' },
      { text: 'DeFi',                               key: 'ind_defi'      },
      { text: 'Crypto Payment Processors',          key: 'ind_payments'  },
    ];
    navEl.querySelectorAll('.font-semibold').forEach(function(el) {
      var text = el.textContent.trim();
      solMap.forEach(function(m) {
        if (text.indexOf(m.text.substring(0,15)) === 0 && !el.getAttribute('data-i18n')) {
          el.setAttribute('data-i18n', m.key);
        }
      });
    });

    // Mobile menu links (same text nodes)
    var mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.querySelectorAll('a').forEach(function(el) {
        var text = el.textContent.trim();
        solMap.concat(mappings).forEach(function(m) {
          if (text === m.text && !el.getAttribute('data-i18n')) {
            el.setAttribute('data-i18n', m.key);
          }
        });
        if ((text === 'Case Studies' || text === 'Casos de Éxito') && !el.getAttribute('data-i18n')) el.setAttribute('data-i18n', 'nav_case_studies');
        if ((text === 'Insights'     || text === 'Perspectivas')   && !el.getAttribute('data-i18n')) el.setAttribute('data-i18n', 'nav_insights');
        if ((text === 'Company'      || text === 'Empresa')        && !el.getAttribute('data-i18n')) el.setAttribute('data-i18n', 'nav_company');
        if ((text === 'Careers'      || text === 'Empleo')         && !el.getAttribute('data-i18n')) el.setAttribute('data-i18n', 'nav_careers');
      });
    }
  }

  // ── Language toggle button ────────────────────────────────────────────────
  function injectToggle() {
    var btn = document.createElement('button');
    btn.id = 'lang-toggle';
    btn.setAttribute('aria-label', 'Switch language');
    btn.style.cssText = [
      'position:fixed', 'bottom:24px', 'right:24px', 'z-index:99998',
      'background:#0A0A0F', 'color:#fff',
      'border:1px solid rgba(255,255,255,0.15)',
      'border-radius:100px', 'padding:8px 16px',
      'font-family:Space Grotesk,sans-serif', 'font-weight:600', 'font-size:13px',
      'cursor:pointer', 'display:flex', 'align-items:center', 'gap:6px',
      'box-shadow:0 4px 20px rgba(0,0,0,0.25)',
      'transition:background .2s, transform .2s'
    ].join(';');

    function renderBtn() {
      btn.innerHTML = [
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>',
        '<span>' + (current === 'en' ? 'ES' : 'EN') + '</span>'
      ].join('');
    }

    renderBtn();

    btn.addEventListener('mouseenter', function() { btn.style.background = '#FF3A10'; btn.style.transform = 'translateY(-2px)'; });
    btn.addEventListener('mouseleave', function() { btn.style.background = '#0A0A0F'; btn.style.transform = 'translateY(0)'; });

    btn.addEventListener('click', function() {
      current = current === 'en' ? 'es' : 'en';
      localStorage.setItem(LANG_KEY, current);
      renderBtn();
      tagNavElements();
      applyLang(current);
    });

    document.body.appendChild(btn);
  }

  // ── Init ─────────────────────────────────────────────────────────────────
  function init() {
    tagNavElements();
    if (current !== 'en') applyLang(current);
    injectToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
