# Segunda sesión · Simogo (simulación)

> Simulación respetuosa de la filosofía conocida de Simogo (el juego como disco: pistas, orden, clímax, final). No es su opinión real; no hay citas. Fuentes: `04-simogo.md`.

Revisé las capturas, una partida nueva propia sin la marca de Playwright (`frames/ms/m01-real-6s.png`), `docs/MUNDO.md`, `places.js`, `song.js`, `song-stage.js`, `journey-finale.js`, `journey-chapters.js` y `refugio-lugares.js`. `00-inicio.png` engaña: con `navigator.webdriver` la partida se abre en el Mundo libre (`journey-mode.js`). La portada real es negra y sin texto.

## Qué mejoró desde el 22 de octubre

- **Ya hay un disco.** El Viaje tiene intro (Camino), cinco pistas con un verbo cada una, un clímax (la Tormenta, con el suelo de energía más alto, `STORM_FLOOR`), una coda casi muda (el Vacío) y un final musical. Es justo la forma que pedimos.
- **El final del Viaje es tuyo.** `finaleScore()` toca hasta seis de tus notas por capítulo, con tu ritmo, sobre su capa, y después el tema dos veces. Termina con créditos.
- **La portada es buena.** Primera nota sin cuenta ni texto, con un punto blanco y una línea (`m01`).
- **«Tu canción» se ve sin palabras.** Once anillos con los apagados en discontinua (`22-cancion.png`). Es la contraportada del disco.
- **Los cierres salen de la música que suena** (F13) y no de un jingle. La remezcla diaria es una cara B con sentido.

## Qué sigue mal: ¿disco o lista de minijuegos?

**Veredicto: un EP coherente de 15 minutos seguido de una lista de minijuegos con un candado al final.**

- **La cara B no tiene orden.** MUNDO.md dice «No hay orden obligatorio». Los lugares se abren por umbrales de estrellas (5, 8, 12…) y no por secuencia. Cada uno es la misma plantilla: barra, verbo, objeto dorado y tarjeta. No hay clímax en la cara B ni coda.
- **Cinco pistas repetidas.** Los cinco primeros «lugares» son los capítulos del Viaje otra vez, con la barra vacía (`places.js`, `start`). Solo el Lago cambia de ritmo, y las Dunas repiten ese mismo contratiempo (`PLACE_RHYTHMS`).
- **El final verdadero está tras un muro de perfección.** Hacen falta las 33 ★, es decir, las 11 versiones Maestro al 80 % (`song-stage.js`, `check`). La mayoría de quienes compren el disco no oirá nunca la última pista.
- **Y ese final es menos tuyo que el del prólogo.** Son 11 capas fijas de house en La mayor a 120 BPM (`song.js`), 15 compases (unos 30 s) y texto. No usa tus notas. El clímax de 1,5 a 3 horas pesa menos que el de 15 minutos.
- **Entre pista y pista hay un menú.** Ronda cerrada → tarjeta con «Completo», ★, %, tiempo, ✦ y tres botones → vuelta al portal → caminar de 30 a 60 s hasta otro. En Sayonara una pista entra en la siguiente.
- **El prólogo anuncia una cuota.** Sus créditos dicen «Tu mundo se abrió · 11 lugares · 33 ★» (`CREDIT_LINES`). Es un contador donde debería haber un silencio.
- **El Mundo salvaje sigue siendo economía.** Tienda de 81 piezas y 17 030 ✦ (7–9 h), 376+23 logros y un narrador burlón al estilo *Dungeon Crawler Carl* que choca con el tono del Viaje. Jay aún no ha aprobado sus frases.
- **Hay una contradicción a la vista:** ★ y «Sin visitar» en la misma fila (`21-lugares.png`).

## Notas

| Eje | 22 oct | Hoy | Por qué |
|---|---|---|---|
| Visual | 7 | 7,5 | La portada y «Tu canción» son láminas. Lago y Cristales están saturados en móvil (`02`, `12`). |
| Audio | 8 | 8,5 | Los cierres salen de la música y el final del Viaje es tuyo. No lo escuchamos en un dispositivo real. |
| Creatividad | 8 | 8 | Once verbos y once ritmos, pero en una sola plantilla de ronda. |
| Sensación | 5,5 | 7 | Tocar a tiempo ya coreografía. Las tarjetas cortan el flujo. |
| Cohesión | 4,5 | 6 | La cara A es un disco. La cara B es una lista y el Mundo salvaje, otra capa de economía. |
| Pulido | 6 | 7 | La entrada y las pruebas son sólidas. Solo lo ha jugado Jay y hay una contradicción en la hoja. |
| **Media** | **6,5** | **7,3** | |

## Tres acciones

1. **Cara B con orden y clímax.**
   - **Qué.** Que los 11 lugares formen una lista de pistas.
   - **Cómo.** En `places.js`, añadir `track` (1–11) y `after` a cada lugar. Una pista se abre al completar la anterior (★) o al llegar a su umbral de estrellas, lo que ocurra antes. `refugio-lugares.js` agrupa la hoja en «Cara A · Viaje» y «Cara B» por número de pista. Las Ruinas (pista 10) son el clímax: su `journeyFloor` es el más alto de la cara B. La Cueva (11) es la coda y su último patrón es el tema del cubo (`THEME`) cantado por la cueva, para que el disco cierre con su primera frase.
   - **Cómo saber que está bien.** Un script mide las voces por segundo de cada ronda simulada. La curva sube hasta la 10 y cae en la 11, como Tormenta → Vacío. Con 6 ★ hay un siguiente paso obvio y nunca tres.
2. **Pistas encadenadas, sin menú.**
   - **Qué.** Que un lugar entre en el siguiente.
   - **Cómo.** En `places.js` (`finish`), sustituir `setTimeout(results,1200)` por un rótulo de 3 s sobre el mundo («★★ · Jardín») y abrir, en el «1» del cierre de F13, un portal dorado a la pista siguiente, como `PORTAL_WAIT` en `journey-chapters.js`. Detrás queda otro portal a «Otra vez». La tarjeta completa pasa a la hoja Lugares.
   - **Cómo saber que está bien.** Entre el objeto dorado y el primer tiempo de la pista siguiente pasan 10 s o menos, sin pulsar botones y sin que la música se corte.
3. **Un final verdadero tuyo y alcanzable.**
   - **Qué.** El final debe ser personal y debe poder oírlo casi todo el mundo.
   - **Cómo.** En `places.js` (`hear`), guardar las seis últimas notas a tiempo de cada lugar en `S.lugares.notes`, normalizadas y migradas. En `song-stage.js`, el final usa `finaleScore(notes, SONG_IDS)` de `journey-finale.js` sobre las 11 capas. Estructura: entradas, tutti, un compás de silencio, el tema y créditos, unos 90 s. Cambiar «11 lugares · 33 ★» de `CREDIT_LINES` por una línea sin cifras.
   - **Cómo saber que está bien.** Dos partidas simuladas distintas dan finales distintos (prueba Node sobre la partitura). Una persona de nivel medio llega al final en menos de 2 h según `scripts/spark-economy.mjs` o una simulación equivalente.

## Decisión de Jay

¿Con cuántas estrellas se gana el juego? Recomendamos que el disco termine con las 11 ★ básicas: cada pista completada una vez da el final y los créditos. Las 33 ★ quedarían como pista oculta: «Tu canción» en versión Maestro, más rápida y dorada. MUNDO.md aprobó «con las 33 se gana», así que solo Jay puede cambiarlo.
