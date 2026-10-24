# Segunda sesión · Masaya Matsuura (simulación)

> Simulación respetuosa de su filosofía conocida (ritmo, una línea, acierto sin castigo). No es su opinión real; no hay citas. Principios y fuentes: `03-matsuura.md`.

Revisé las capturas, dos propias (`frames/ms/m01-real-6s.png`, `m02-real-toques.png`) y `journey-pulse.js`, `journey-rhythm.js`, `places.js`, `journey-echo.js`, `journey-mode.js`, `song.js` y `docs/MUNDO.md`.

**Aviso sobre la evidencia.** `00-inicio.png` no es la primera pantalla real. Muestra «DÍA 1», «Rompe diez» y la bienvenida porque Playwright marca `navigator.webdriver` y `journeyDefault()` abre entonces el Mundo libre (`journey-mode.js`). Sin esa marca, la partida empieza en silencio: el cubo, dos cristales y la Línea (`m01`).

## Qué mejoró desde el 22 de octubre

- **El verbo existe.** Solo un pulso a tiempo hace algo (`journeyPulse` → `journeyGamePulse`). Fuera de tiempo deja una marca blanca en la Línea y nada más. Es acierto sin castigo, como pedí.
- **La Línea está.** `drawJourneyLine` dibuja el compás en el 80 % de la altura, con un cursor dorado y picos donde tocaste. Lo dorado marca un acierto y lo blanco, un pulso fuera de tiempo (`m02`).
- **Se juzga lo que oye el jugador**, no lo que programó el reloj: `heardTime()` resta la latencia de salida. Es un detalle serio.
- **Cada lugar tiene su ritmo** (F14): contratiempo, «1 · 2 · y», el «1» o patrones. El Viaje los enseña en orden y no todos a la vez.
- **La Cueva es PaRappa.** La cueva canta y tú repites (`journey-echo.js`). Si fallas, el patrón siguiente es más corto, no hay castigo. Es la mejor idea rítmica del juego.
- **La primera pantalla real es casi Vib-Ribbon**: negro, un punto y una línea, sin HUD (`m01`). Se cumplió el silencio inicial.

## Qué sigue mal o es nuevo

- **Hay tres reglas en pantalla, no una línea.** Bajo el cubo, ocho puntos de 2 a 5 px (`journey-rhythm.js`, `guide`). Abajo, la Línea con 16 marcas. A su derecha, cinco puntos de capítulo (`journey-chapters.js:157`). El ojo no sabe cuál mirar (`01`, `12`, `15`).
- **La Línea no anticipa.** Es un compás fijo con un cursor que lo recorre. En Vib-Ribbon el obstáculo viene hacia ti y lo lees antes de tocarlo. Aquí, el «1 · 2 · y» de la Tormenta o el «1 · 2y · 3 · 4» de las Ruinas se aprenden a base de fallar.
- **No hay calibración.** La ventana es de ±80 ms y de ±60 ms en Maestro (`ON_TIME`, `MAESTRO_WINDOW`). Las ★★ piden un 85 % y la latencia que reportan los auriculares Bluetooth suele ser inexacta. Hoy algunas estrellas se ganan o se pierden por el auricular, no por la mano. `grep calibr src/` no devuelve nada.
- **El cubo sigue sin cuerpo.** No tiene estados de racha. El único «Racha» es una pieza de tienda de 200 ✦ (`cube-shop-model.js:36`). El cuerpo que responde al ritmo se vende en vez de ganarse tocando.
- **El juicio final es un número.** La tarjeta dice «Ritmo: 73 % a tiempo (85 %)» (`places.js`, `results`). PaRappa te lo decía con el personaje.
- **Algunos lugares no exigen nada.** Jardín y Cueva cuentan las ocho corcheas (`siembra`, `eco`) y la guía las enciende todas, así que no informa. Dunas repite el contratiempo del Lago.
- **El Mundo libre desenseña el verbo.** Ahí se toca cuando se quiera y a tiempo solo se ganan más chispas (MUNDO.md, regla 1). Lo que premia el ritmo es dinero, no música.
- **La hoja Lugares se contradice:** pone ★ y «Sin visitar» en la misma fila (`21-lugares.png`, `refugio-lugares.js:58`).

## Notas

| Eje | 22 oct | Hoy | Por qué |
|---|---|---|---|
| Visual | 6,5 | 7,5 | El Camino real es una línea sobre negro. Los lugares acumulan círculos y rejillas, y hay tres reglas. |
| Audio | 8 | 8,5 | El tema suena en cada acierto y el cierre sale de la música (F13). No lo escuché en un teléfono. |
| Creatividad | 8,5 | 8,5 | Hay 11 ritmos y la Cueva tiene llamada y respuesta. La Línea todavía no inventa nada. |
| Sensación | 5,5 | 7 | El acierto se ve y vibra. Falta anticipación, calibración y un cuerpo que responda. |
| Cohesión | 5 | 7 | El verbo ordena el Viaje y los lugares. El Mundo libre lo contradice. |
| Pulido | 6 | 7 | Mucha prueba automática y movimiento reducido. Nadie aparte de Jay lo ha jugado y hay una contradicción en la hoja. |
| **Media** | **6,6** | **7,6** | |

## Tres acciones

1. **Una sola Línea que anticipa.**
   - **Qué.** Los pasos que cuentan vienen hacia el cursor, como los obstáculos de Vib-Ribbon.
   - **Cómo.** En `journey-pulse.js` (`draw`), fijar el cursor al 25 % de la Línea. Por cada paso de `runtime.journeyRhythm()?.steps` en los dos compases siguientes, calcular su hora con `MU.bq` y `SIX` y dibujarlo en `x = cursor + (t − oído) / dosCompases · ancho`. El «1» va en dorado y el resto en blanco, con 6 px de alto como mínimo. Los aciertos pasados salen por la izquierda. Retirar la `guide()` de puntos bajo el cubo y llevar los puntos de capítulo a la barra superior. Con movimiento reducido, la Línea queda quieta, como hoy.
   - **Cómo saber que está bien.** Tres personas nuevas, con el volumen a cero, superan el 70 % a tiempo en la Tormenta al primer intento. Además, `tests/journey-rhythm.mjs` comprueba la posición de cada paso.
2. **Calibrar sin menú.**
   - **Qué.** Medir el desfase real del jugador.
   - **Cómo.** En `journey-pulse.js`, guardar la distancia firmada de los primeros 12 pulsos del Camino al tiempo más cercano. Si la desviación típica es menor de 35 ms y la mediana pasa de 25 ms, guardar `S.latencyNudge`, limitado a ±0,25 s y normalizado en `progress.js`, y sumarlo en `outputLatency()`. Añadir «Ajustar el tiempo» en Ajustes: 8 toques sobre el bombo y ningún texto más.
   - **Cómo saber que está bien.** En una prueba Node con una latencia falsa de +150 ms y 20 ms de dispersión, el bot pasa de menos del 30 % a más del 95 % a tiempo. Unos toques al azar no mueven el ajuste.
3. **El cubo como Vibri.**
   - **Qué.** La racha se ve en el cuerpo, no en un número.
   - **Cómo.** En `journey-pulse.js`, llevar `state.run`: +1 por cada acierto y −1 nivel por cada fallo, sin volver a cero. Exponer `runtime.cubeForm()` con cuatro formas: 0 cubo, 1 con 4 aciertos, 2 con 8 (las aristas vibran al compás) y 3 con 16 (se abre en líneas). Dibujarlo en `render.js` junto a `cubeGrowth`, encima de la pieza de tienda. En la tarjeta de `places.js` (`results`), la forma máxima alcanzada sustituye al titular del porcentaje, que queda en letra pequeña.
   - **Cómo saber que está bien.** En un vídeo mudo de 10 s, 4 de cada 5 observadores distinguen si el jugador va bien o mal.

## Decisión de Jay

En el Mundo salvaje, ¿un pulso fuera de tiempo debe seguir rompiendo cristales? Mi recomendación: que suene, pero que solo actúe a tiempo, con una ventana amplia de ±120 ms. Así el verbo es el mismo en todo el juego. Cambia una regla aprobada (MUNDO.md, regla 1) y la economía de chispas, así que solo Jay puede decidirlo.
