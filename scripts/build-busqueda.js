// Genera busqueda.json con los temas de cada guía, para el buscador de la portada.
//
// Uso, desde la raíz del repositorio:
//   node scripts/build-busqueda.js                          → guías de esta carpeta
//   node scripts/build-busqueda.js RUTA=URL_PUBLICA ...     → además, guías en otros repositorios
// Ejemplo: node scripts/build-busqueda.js ../ciencia-e-ingenier-a-de-materiales=https://helionacon-ui.github.io/Ciencia-e-ingenier-a-de-materiales/
//
// Formatos reconocidos (en orden):
//   1. buscador-index.js con GSEARCH (generador de las guías de la serie): temas = entradas con id «tN».
//   2. Páginas tN.html cuyo <title> empieza por «TN · Nombre» (Termodinámica, Tecnología medioambiental).
// Las guías con otro formato de índice no aparecen hasta que se añada un caso aquí.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function tituloDePagina(html) {
  return (html.match(/<title>([^<]*)/) || [, ''])[1];
}

function temasDesdeGSearch(carpeta) {
  const ventana = {};
  new Function('window', fs.readFileSync(path.join(carpeta, 'buscador-index.js'), 'utf8'))(ventana);
  const G = ventana.GSEARCH;
  if (!G) return null;
  const vistos = new Set(), temas = [];
  for (const e of G.e) {
    const pagina = G.pages[e[0]][0];
    if (!/^t\d+$/.test(e[1]) || !e[2] || !/^(tema-\d+|t\d+)\.html$/.test(pagina) || vistos.has(e[1])) continue;
    vistos.add(e[1]);
    temas.push({ n: e[1].toUpperCase() + ' ' + e[2], f: pagina + '#' + e[1] });
  }
  return temas;
}

function temasDesdeTitulos(carpeta) {
  const temas = [];
  for (const f of fs.readdirSync(carpeta).sort()) {
    if (!/^t\d+\.html$/.test(f)) continue;
    const partes = tituloDePagina(fs.readFileSync(path.join(carpeta, f), 'utf8')).split(' · ').map(s => s.trim());
    if (partes.length < 2) continue;
    const n = /^T\d+$/.test(partes[0]) && partes.length > 2 ? partes[0] + ' ' + partes[1] : partes[0];
    temas.push({ n, f });
  }
  return temas;
}

function indexar(carpeta, url) {
  const html = path.join(carpeta, 'index.html');
  if (!fs.existsSync(html)) return null;
  const partes = tituloDePagina(fs.readFileSync(html, 'utf8')).split(' · ').map(p => p.trim()).filter(Boolean);
  const nombre = (partes[0] && /^inicio$/i.test(partes[0]) && partes[1] ? partes[1] : partes[0]) || path.basename(carpeta);
  let temas = fs.existsSync(path.join(carpeta, 'buscador-index.js')) ? temasDesdeGSearch(carpeta) : null;
  if (!temas || !temas.length) temas = temasDesdeTitulos(carpeta);
  return temas.length ? { u: url, n: nombre, t: temas } : null;
}

const salida = [];

// Guías de esta carpeta
for (const dir of fs.readdirSync(root).sort()) {
  const carpeta = path.join(root, dir);
  if (!fs.statSync(carpeta).isDirectory() || dir.startsWith('.')) continue;
  const g = indexar(carpeta, dir + '/');
  if (g) salida.push(g);
}

// Guías en otros repositorios: RUTA=URL
for (const arg of process.argv.slice(2)) {
  const [ruta, url] = arg.split('=');
  const g = indexar(path.resolve(ruta), url.endsWith('/') ? url : url + '/');
  if (g) salida.push(g); else console.warn('Sin temas reconocibles en ' + ruta);
}

fs.writeFileSync(path.join(root, 'busqueda.json'), JSON.stringify(salida));
console.log(salida.length + ' guías, ' + salida.reduce((s, g) => s + g.t.length, 0) + ' temas -> busqueda.json');
