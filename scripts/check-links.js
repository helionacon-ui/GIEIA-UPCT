// Comprueba que cada guía enlazada en index.html (campo url:'…') responde con éxito.
// Uso:  node scripts/check-links.js [url-base]     (por defecto, la web publicada)
// Sale con código 1 si alguna guía falla; el flujo semanal de GitHub Actions lo usa para avisar.
const fs = require('fs');
const path = require('path');

const base = process.argv[2] || 'https://helionacon-ui.github.io/GIEIA-UPCT/';
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const urls = [...html.matchAll(/url:'([^']+)'/g)].map(m => m[1]);

(async () => {
  let fallos = 0;
  for (const u of urls) {
    const absoluta = new URL(u, base).href;
    try {
      const r = await fetch(absoluta, { redirect: 'follow' });
      if (!r.ok) fallos++;
      console.log((r.ok ? 'OK    ' : 'FALLO ') + r.status + '  ' + absoluta);
    } catch (e) {
      fallos++;
      console.log('FALLO red  ' + absoluta + '  (' + e.message + ')');
    }
  }
  console.log(urls.length + ' guías comprobadas, ' + fallos + ' con fallo.');
  process.exit(fallos ? 1 : 0);
})();
