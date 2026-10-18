# Arquitectura actual

## Ejecución y publicación

`src/main.js` conecta módulos ES; `src/render.js` dirige los frames de Canvas 2D. Web Audio sintetiza la música localmente. `index.html`, `styles/` y `assets/` forman el cliente estático. El service worker `sw.js` conserva el shell offline.

Vercel sirve la raíz. `scripts/vercel-build.mjs` sella el artefacto con revisión y fecha mediante el mecanismo existente; un commit no prueba un despliegue. La versión base está en `package.json` y `src/release-info.js`.

## Progreso y chispas

- `progress.js`, `save-store.js` y `save-tools.js`: estado, normalización y respaldos locales.
- `crystal-sparks.js`: distribución determinista independiente, dibujo, impactos manuales y recogida. Camino: diez roturas únicas para entrar automáticamente. En el Mundo añade corredores, fragmentos fugitivos y cadenas; no crea pulsos musicales.
- `crystal-play-model.js`: variantes con hash independiente, reparto de fragmentos y escape acotado. Un fragmento raro añade 3 chispas; su máscara de recogida persiste en `sparkEconomy.sites`. Los registros antiguos agotados no recuperan premios. Cadenas de hasta ocho impactos adicionales por rotura inicial, radio 240; corredores y fragmentos se detienen tras dos segundos, a un máximo de 90/100 unidades. Movimiento reducido conserva las recompensas sin persecución.
- `sparks-model.js`: catálogo, normalización y reglas puras. `sparks.js`: operaciones, compras, colecciones, logros, títulos, metas e interfaz.
- `practice-travel.js`: viaje pagado y regreso gratuito. El coste y destino se guardan juntos; los fallos revierten la operación. El botón principal se muestra al acumular 20 chispas ganadas y se desactiva si falta saldo; el menú conserva una acción independiente.
- `return-entrance.js`: saludo silencioso al abrir, incluso con guía pendiente. Muestra frase y `.simple` durante 2,4 segundos; tocar o Escape permite continuar. La primera guía se restaura al cerrar el saludo.
- `rare-cards.js`, `celebration.js` y `notice-lane.js`: hallazgos y avisos breves en una cola, con detalles explícitos y efectos temporales reversibles.

La minería diaria conserva daño, rotura y recogida hasta 8192 sitios por partida. El saldo es local; no es una economía competitiva ni un registro remoto. Los formatos futuros se conservan. Destellos y constelación personal siguen fuera de esta implementación.

## Esculturas del universo

`sculpture-totems-model.js` define seis formas, sus siluetas y un hash independiente. Celdas de 1400 unidades: 24% con encuentro, aproximadamente dos tercios solitarios y el resto grupos de dos o tres. Presencia determinista en superficie, bajo y cielo, sin consumir RNG anterior ni cambiar mapas. `sculpture-totems-art.js` comparte formas/degradados entre Canvas y tarjetas SVG.

`sculpture-totems.js` conecta pulsos manuales y tres gestos: torre con tres pulsos, remate que se desprende y vuelve al acompañarlo, o guía hacia un cristal/escultura real. La esfera regresa sin premio si se abandona; no se pierde el tótem. Pausa, inspección y movimiento reducido se respetan. Caché de 48 celdas, ninguna interacción automática por proximidad.

El libro existente incorpora seis tarjetas `totem:*`, una por forma y mundo, con la dirección del primer encuentro. `sparkEconomy.totems` conserva pagos diarios: 2 chispas por lugar, hasta 64 lugares al día; rollback si falla guardar. No hay otro menú o moneda. Las respuestas reutilizan voces nativas, armonía, reloj y límites existentes: como máximo tres notas espaciadas por un pulso de grupo, con volúmenes 0,28/0,14; sin música automática de fondo nueva.

## Mundo y audio

La generación existente depende de semillas: no insertar consumos en su RNG. Los cristales usan su propio hash. `wow-feel.js` separa los ojos locales de los efectos del mundo: los offsets de cámara pertenecen al dibujo del mundo. La regresión está en `tests/wow-runtime.mjs`.

Los poderes originales de cajas duran 20 segundos; las sorpresas, entre 10 y 20, sin acumular duraciones. No añadir sonidos a botones ni modificar síntesis/composición incidentalmente. `world-visibility.js` lee `beat()` para modular suavemente el brillo cercano; no programa audio ni altera la niebla. Se desactiva con silencio, pausa y movimiento reducido.

## Servicio opcional

[Servidor y duetos](SERVIDOR_Y_DUETOS.md) describe el backend Python/SQLite. El alojamiento estático no ejecuta esa API: `GET /api/session` puede devolver 404 y la conexión lo controla. Es independiente del renderizado. No presentar el servicio opcional como desplegado o aceptado en producción.

## Evidencia

La entrega de chispas registra comandos, huellas y límites en [su informe](../scripts/sparks-progression-validation.json). Los documentos de [historial](historial/README.md) describen revisiones anteriores; sus estados y cifras no certifican la revisión actual.
