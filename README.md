# Guías para aprobar · GIEyA

**Proyecto iniciado el 5 de noviembre de 2026.**

Página índice (https://helionacon-ui.github.io/GIEIA-UPCT/) con las guías de estudio de las asignaturas del Grado en Ingeniería Electrónica Industrial y Automática.

## Añadir una guía nueva

1. Publica la guía en su propio repositorio con GitHub Pages.
2. Edita `index.html` y busca la asignatura en la lista `CURSOS`.
3. Añádele la dirección y una descripción corta, por ejemplo:

```js
{t:'Ingeniería de control', url:'https://helionacon-ui.github.io/ingenieria-de-control/', d:'Lugar de las raíces, Bode y PID.'},
```

4. Guarda los cambios (commit). La tarjeta pasa de «Próximamente» a «Abrir la guía».

Proyecto personal de estudio; no es una página oficial de la universidad.

## Mantenimiento

- Tras cambiar una guía que está en esta misma carpeta, ejecuta `node scripts/build-busqueda.js` para regenerar `busqueda.json`. Es el índice del buscador de temas de la portada.
- Las guías que viven en otro repositorio no entran en ese índice; se añadirían a mano en `scripts/build-busqueda.js`.
- Cada lunes, la acción «Comprobar enlaces de las guías» verifica que las 33 guías enlazadas responden. Se puede lanzar a mano desde la pestaña Actions. En local: `node scripts/check-links.js http://localhost:8000/` (las guías externas necesitan conexión a internet).
