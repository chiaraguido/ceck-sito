/* ceck.me → app.ceck.me (25/11/2026): passa all'iscrizione da dove è arrivata la persona
   (annuncio Google = gclid, utm_*, oppure il sito da cui arriva), così la pagina iscritti lo sa.
   Niente cookie: solo sessionStorage di questa visita. */
(function () {
  var K = 'ceck_prov', p = {}, q;
  try { p = JSON.parse(sessionStorage.getItem(K) || '{}') || {}; } catch (e) { p = {}; }
  try { q = new URLSearchParams(location.search); } catch (e) { q = null; }
  if (q) {
    var nuovo = false;
    ['utm_source', 'utm_campaign', 'gclid'].forEach(function (k) { var v = q.get(k); if (v) { p[k] = v.slice(0, 120); nuovo = true; } });
    if (nuovo || !p.da) {
      var r = document.referrer || '';
      p.da = (r && r.indexOf(location.host) < 0 ? r : location.href).slice(0, 300);
    }
  }
  try { sessionStorage.setItem(K, JSON.stringify(p)); } catch (e) {}
  function sistema(a) {
    try {
      var u = new URL(a.href);
      if (u.host !== 'app.ceck.me' || u.pathname !== '/iscriviti') return;
      ['utm_source', 'utm_campaign', 'gclid', 'da'].forEach(function (k) { if (p[k] && !u.searchParams.get(k)) u.searchParams.set(k, p[k]); });
      a.href = u.toString();
    } catch (e) {}
  }
  function tutti() { var l = document.querySelectorAll('a[href*="app.ceck.me/iscriviti"]'); for (var i = 0; i < l.length; i++) sistema(l[i]); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tutti); else tutti();
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a'); if (a) sistema(a); }, true);
})();

/* Modalità di consenso AVANZATA di Google (27/11/2026, sì di Guido).
   Il banner resta uguale. Se il visitatore non ha (ancora) accettato la pubblicità, il tag Google Ads parte lo stesso
   ma con consenso «denied» (già impostato dal banner): niente cookie, solo segnali anonimi, così Google può stimare
   le conversioni di chi rifiuta. Chi accetta: il banner aggiorna il consenso a «granted» come prima. */
(function () {
  try {
    var C = window.CECK_STRUMENTI || {};
    if (!C.ADS || !window.gtag || document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) return;
    window.gtag('set', 'ads_data_redaction', true);
    window.gtag('set', 'url_passthrough', true);
    var t = document.createElement('script'); t.async = true;
    t.src = 'https://www.googletagmanager.com/gtag/js?id=' + C.ADS;
    document.head.appendChild(t);
    window.gtag('js', new Date());
    window.gtag('config', C.ADS);
  } catch (e) {}
})();
