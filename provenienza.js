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
