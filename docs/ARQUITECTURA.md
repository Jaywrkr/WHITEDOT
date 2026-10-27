# Arquitectura vigente · alpha.221

Sin módulos nuevos desde alpha.207: P1–P8 y Q1–Q6 cambiaron módulos existentes.

Mapa técnico contrastado con la entrega E. [Traspaso](../HANDOFF.md) · [diseño](MUNDO.md). Las decisiones y resultados históricos están en las entregas, no constituyen implementación pendiente.

## Cliente y publicación

`src/main.js` inicializa módulos ES nativos; `src/render.js` dirige Canvas2D. `index.html`, `styles/`, `assets/`, `icons/` y `sw.js` forman el cliente estático. `runtime` conecta módulos internamente y no se publica en `window`; las pruebas instrumentan su copia de main.

`package.json` y `src/release-info.js` comparten versión; `scripts/bump-version.mjs` actualiza también README, HTML y clave de caché. Documentación sola no sube versión.

`vercel.json` usa `framework:null`, `outputDirectory:"."` y `node scripts/vercel-build.mjs`. Este script sella revisión y fecha en el artefacto mediante `scripts/stamp-deploy.mjs`; fuera de Vercel, sin SHA, no modifica el checkout. No hay bundler ni directorio public requerido.

Cada módulo/asset de ejecución figura una vez en SHELL de `sw.js`. Scripts, pruebas y documentación no son módulos del producto.

## Mapa de sistemas

| Sistema | Fuentes principales |
|---|---|
| Inicialización y estado | `main.js`, `data.js`, `progress.js` |
| Render, cámara y calidad | `render.js`, `frame-state.js`, `frame-quality.js`, `world-sheet.js` |
| Entrada del cubo | `canvas.js`, `interactions.js`, `wow-feel.js` |
| Música y voces | `audio.js`, `voices.js`, `instruments.js`, `music-families.js`, `musical-conductor.js` |
| Territorios y transiciones | `world.js`, `continents.js`, `neighborhoods.js`, `territory-journey.js`, `territory-transition.js` |
| Capítulos y juegos | `journey-chapters.js`, `journey-games.js`, módulos `journey-*` |
| Reloj, ritmo y frases | `journey-pulse.js`, `journey-rhythm.js` |
| Rondas, premios y destinos | `places.js`, `places-ring.js`, `refugio-lugares.js` |
| Finales | `journey-finale.js` (cinco capítulos), `song-stage.js` (once lugares), `song.js` |
| Chispas y compras | `spark-rules.js`, `sparks-model.js`, `sparks.js`, `crystal-sparks.js` |
| Personalización | `cube.js`, `cube-shop-model.js`, módulos `cube-shop-*` |
| Hallazgos y tarjetas | `rare-card-model.js`, `rare-cards.js`, `musical-wonders.js` |
| Colección musical | `garden-model.js`, `collection-garden.js`, `journal.js` |
| Refugio | `house-model.js`, `house.js`, `house-view.js`, `house-audio.js`, `house-collection.js` |
| Actividades y encuentros | `universe-activities.js`, `universe-mischief.js` y sus modelos/arte |
| Guía y avisos | `voice-guide.js`, `onboarding.js`, `notice-lane.js`, `celebration.js` |
| UI y accesibilidad | `styles/estilo-j.css`, `accessibility.js`, `journal.js`, `favorites.js` |
| Guardado y cuenta | `save-store.js`, `save-tools.js`, `account-entry.js`, módulos `cloud-*` |

Las fuentes de la tabla están en `src/`. Catálogos y detalles en [Universo](UNIVERSO.md), [Hallazgos](HALLAZGOS_Y_ACTIVIDADES.md), [Tienda](TIENDA_DEL_CUBO.md) y [Casa](CASA_VIVA.md).

## Música, reloj y presentación

Web Audio sintetiza localmente; no se usan Tone ni instrumentos de Arturia. El secuenciador conserva la rejilla y la armonía del territorio, con tempos distintos entre lugares. Los modelos musicales gobiernan evolución y relevos; una limpieza de UI no autoriza modificar síntesis, patrones o mezcla.

`MU.sq` conserva paso módulo16 y tick absoluto. `journey.notes/steps/ticks` y `lugares.notes/noteSteps/noteTicks` conservan la aportación personal; formatos antiguos sin ticks siguen interpretándose sin reescribirlos.

`journey-pulse.js` comparte juicio, reloj audible (`audibleTime`, `cueDelay`: latencia de salida más calibración) y `scheduleAudibleCue`; ningún temporizador visual usa `ac.currentTime` crudo. Luz y sonido se programan por separado: flores/Estudio reciben una marca presente cuando llega su callback, no una marca futura que el dibujante interpretaría como activa. Se cancelan callbacks antiguos por partida, contexto, modo/capa, pausa o pantalla oculta.

`journey-rhythm.js` conserva una cola acotada de notas demostradas y elige la actualmente audible. `song-stage.js` cuenta pasos del transporte, conserva golpes visuales y respeta la pausa sin pulsos inventados. `audio.js` tiene una compuerta para el silencio deliberado del final11; salir restaura la mezcla. No se cambia el control de volumen del jugador.

El final5 usa voces suaves existentes, contexto actual y frases guardadas; todas sus salidas normales dejan en Mundo libre. El identificador interno `refugio` también nombra el cierre; no obliga a visitar la casa. Festival tiene guardado separado y termina en sus créditos.

## Progreso y transacciones

`save-store.js` conserva copias antes de restaurar; normalizadores mantienen campos desconocidos y formatos futuros. No borrar claves de jugadores ni cambiar identidades de mundo como limpieza.

`places.js` guarda premio, frase y restauración de capítulo juntos, con rollback ante error. Un resultado muestra porcentajes truncados con precisión consistente y minutos/segundos derivados del mismo total. Escape y Salir comparten cierre y comprobación del final.

`collection-garden.js` revierte selección/conjuntos fallidos. `house.js` extiende ese contrato a posición de objetos y arrastres fuera del Refugio. La propiedad de tarjetas no se consume. Favoritos conserva deliberadamente una nueva entrada pendiente si falla escribir; ediciones destructivas restauran lo anterior y la UI ofrece recuperación.

## Interfaz y guía

Negro, Geist Mono, esquinas rectas, blanco para estados y dorado ganado. Cubo pequeño conservado. Controles silenciosos y sin menús demo públicos. Las palabras se cortan enteras o con guion; los botones de una fila miden lo mismo y la acción que sigue va primero, a todo el ancho. Al abrir, el foco va al título, no a un botón. Las muestras de laboratorio no enseñan «Laboratorio» ni código fuera del laboratorio.

Menú (panel 10, P2): «Seguir hacia …» y, debajo, Lugares, Tu cubo, Refugio y Bitácora; Ajustes y Cómo jugar siempre a la vista. «Más» se abre cerrado y agrupa Ir (vuelta al Camino o «Explorar», Mapa y favoritos, punto anterior, otra tierra), Crear y Tú. Un rótulo sin filas visibles se oculta (`tidyMenu`); la fila principal reparte el ancho entre los botones que se ven. La vista tranquila conserva Lugares y Bitácora sin cifras; Tu cubo y la tienda siguen solo en la completa. En el Mundo, `#bPrimary` («Volver al Camino») encabeza Ir y `#bWorld` se oculta. Ajustes empieza por el volumen y se ordena en Sonido y tiempo, Ver y sentir y Partida, con «Empezar de cero» al final; «Más sonido» vuelve a Ajustes. Todo cierre inferior dice «Cerrar». Texto de menú desde 12 px.

`journal.js` reúne Hoy, Colección, Mapa, Música, Logros y Tú. Mueve paneles existentes desde `#journalParts` al contenido de la pestaña. El libro pliega filtros secundarios y muestra primero el hallazgo; Favoritos desplaza al destino guardado y no duplica listados. IDs existentes conservados.

`voice-guide.js` comparte la acción de Jardín con `gardenTarget`; distingue acercarse, sembrar, regar, cosechar y árbol final. `accessibility.js` gestiona aislamiento, foco y cierres. `canvas.js` cancela entradas al perder foco/ocultarse/enfocar UI. `notice-lane.js` coordina avisos para evitar solapamientos.

## Cuenta, Android y código heredado

Cuenta opcional y progreso local por defecto. Auth/REST, CAS, RLS y recuperación en [Cuenta y progreso](CUENTA_Y_RESPALDO.md). Configuración de Supabase pausada; no reaplicar SQL ni modificar servicios por leer esta guía. Cuenta compartida no implica multijugador ni cross-buy.

`android/` empaqueta el mismo cliente con WebView; `scripts/android-assets.mjs` prepara assets y sellado. [Estado y límites](../android/README.md). No equivale a publicación en Play ni a pruebas físicas recientes.

`server/` conserva el prototipo Python/SQLite usado por `tests/server_api.py`; no es el backend del producto ni la solución al antiguo404 de `/api/session`. Las salas/duetos antiguos no están activos; ganchos opcionales y datos heredados se conservan por compatibilidad.

## Evidencia

[Entrega E](ENTREGA_E.md), [auditoría E](panel/candidato-e/informe.md) y [verificación](VERIFICACION.md). El verificador de E protege 301 archivos y trece contratos (P1 abrió `map.js` y `places-ring.js`, solo dibujo; P2, ocho módulos de menú y cuenta); las notas del panel son simulaciones con alcance declarado. CI, despliegue, escucha física y personas se registran por separado.
