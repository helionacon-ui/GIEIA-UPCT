// Genera busqueda.json con los temas de cada guía local (carpetas que tienen buscador-index.js).
// Uso, desde la raíz del repositorio:  node scripts/build-busqueda.js
// Vuelve a ejecutarlo cada vez que cambies una guía. Las guías externas (otro repositorio) se añaden a mano.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const salida = [];

for (const dir of fs.readdirSync(root).sort()) {
  const carpeta = path.join(root, dir);
  const indice = path.join(carpeta, 'buscador-index.js');
  if (!fs.statSync(carpeta).isDirectory() || !fs.existsSync(indice)) continue;

  const ventana = {};
  new Function('window', fs.readFileSync(indice, 'utf8'))(ventana);
  const G = ventana.window && ventana.window.GSEARCH ? ventana.window.GSEARCH : ventana.GSEARCH;
  if (!G) { console.warn('Sin GSEARCH en ' + dir); continue; }

  const titulo = (fs.readFileSync(path.join(carpeta, 'index.html'), 'utf8').match(/<title>([^<]*)/) || [, dir])[1]
    .replace(/\s*·\s*Guía para aprobar.*$/, '').trim();

  // Un tema = id «t1», «t2»…; la primera entrada con ese id es el título del tema (las siguientes son secciones con el mismo ancla).
  const vistos = new Set();
  const temas = [];
  for (const e of G.e) {
    const pagina = G.pages[e[0]][0];
    if (!/^t\d+$/.test(e[1]) || !e[2] || !/^(tema-\d+|t\d+)\.html$/.test(pagina) || vistos.has(e[1])) continue;
    vistos.add(e[1]);
    temas.push({ n: e[1].toUpperCase() + ' ' + e[2], f: pagina + '#' + e[1] });
  }

  if (temas.length) salida.push({ u: dir + '/', n: titulo, t: temas });
}

fs.writeFileSync(path.join(root, 'busqueda.json'), JSON.stringify(salida));
console.log(salida.length + ' guías, ' + salida.reduce((s, g) => s + g.t.length, 0) + ' temas -> busqueda.json');
