# Tercera sesión · Tetsuya Mizuguchi (simulación)

> Simulación de su mirada de diseño (sinestesia, acción cuantizada, tacto) a partir de su obra pública. No es su opinión real. Versión: 2.3.0-alpha.167. Solo Jay ha jugado. Nadie lo oyó en un teléfono.

Revisé las capturas de `3/` y saqué las mías en `3-extra-mz/` (17 pulsos a tiempo en Tormenta y Ruinas, con `navigator.vibrate` devolviendo `true`).

## 1. Notas

| Eje | Nota | Por qué |
|---|---|---|
| Visual | 7 | El oro queda encima y Vibri se ve. El cubo mide 16 px y el color apenas tiñe. |
| Audio | 8,5 | La canción crece desde el mundo y el faro suena desde su lado. Sin escucha real. |
| Creatividad | 8,5 | Vibri y el lugar que canta su patrón son buenas ideas. |
| Sensación | 7,5 | Brillo siempre y calibración. Falta el golpe de cámara y la luz llega antes que la nota. |
| Cohesión | 7,5 | Orden de pistas y una sola canción. El menú sigue largo. |
| Pulido | 7 | Pruebas serias. Cero personas. |
| **Media** | **7,7 (7,3)** | |

## 2. Qué mejoró de verdad

- **El acierto se ve aunque vibre.** `vibrate(...);runtime.cubeGlow=1` (`src/journey-pulse.js:81`). Lo comprobé: 17 vibraciones y `glow` > 0 en cada captura. Era mi primera petición.
- **La onda a tiempo es dorada.** `w.beat?…GOLD` (`src/interactions.js:26`).
- **Calibración.** 12 pulsos, mediana, dispersión ≤ 60 ms (`src/rhythm-calibration.js:6-19`). La prueba pasa: un bot 150 ms tarde queda a tiempo. Ajustes con −/+ y «medir otra vez».
- **El ritmo se oye antes de leerlo.** Dos compases cantados con clic y nota (`src/journey-rhythm.js:54-55`). La Tormenta ya no dice «Aquí el ritmo es…».
- **Vibri.** Esquinas, rombo y doble marco dorado (`journey-pulse.js:97-101`). En `tormenta-hit17-60ms.png` se ve que vas bien sin leer nada.
- **Tu canción ya es el mundo.** Las capas se suman en su acorde. Eso es Tetris Effect.

## 3. Qué sigue faltando o salió mal

- **El cubo no llega a 28 px.** `cubeView` limita a 16–30 px (`src/render.js:186`). Medí 16 px de blanco en 01, 04 y 20. En el Camino (`00-inicio.png`) mide 6 px. Pedí 28.
- **El color no llena la pantalla.** El tinte es un degradado radial: 18–30 % solo en el centro y 0 en el borde (`src/world-sheet.js:34`). En `20-anillo.png`, con todos los colores sembrados, solo el 4,8 % de los píxeles tiene color. Pedí 15 %.
- **No hay golpe de cámara al acertar.** `cameraKick` solo lo llaman el rayo y el baile (`journey-dance.js:30`, `render.js:322`). Mi bot midió `zoom: 1` tras cada acierto.
- **La luz llega antes que el sonido.** La nota se programa en el tiempo (`interactions.js:50`). El brillo y la vibración salen al tocar (`journey-pulse.js:81`). Si tocas 60 ms antes, ojo y mano van 60 ms (más la latencia de salida) por delante del oído.
- **Vibri no late.** El marco de nivel 3 gira con `t/900` (`journey-pulse.js:100`), no con el compás.
- **La calibración es una sola vez.** Si cambias a Bluetooth, nada la vuelve a pedir. Con una latencia restante mayor de 250 ms no mide (`CAL_REACH`). Si se mide en Jardín o Cueva (todas las corcheas, ~310 ms a 96 BPM), 150 ms de retraso queda a medio camino y puede tomar el paso equivocado. No lo probé en un teléfono.
- **Paneo solo al bus seco** (`spatial.js:43`); la reverberación llega centrada. En el altavoz del teléfono casi no se oirá. No verificado de oído.

## 4. Mis tres acciones

**1. Un solo instante para ojo, mano y oído.**
- Dónde: `src/journey-pulse.js:81` y `src/interactions.js:50`.
- Cómo: programar brillo, vibración y `cameraKick(.03)` con `setTimeout` a `(t − ac.currentTime + outputLatency + nudge) × 1000`, con `t` la hora de la nota. Sin golpe con movimiento reducido.
- Bien cuando: en una prueba, el retraso entre `cubeGlow=1` y la nota es menor de 10 ms; `cameraOffset().zoom` > 1 tras un acierto.

**2. El cubo grande y el mundo de color.**
- Dónde: `src/render.js:186`, `src/world-sheet.js:34`.
- Cómo: `cubeView` con mínimo 28 px si `W < 500`. Con el color recuperado, añadir una capa plana del color al 10 % más el degradado. El bombo sube la luz 8 %.
- Bien cuando: en `20-anillo` el cubo mide ≥ 28 px y ≥ 15 % de píxeles tienen color.

**3. Calibración que se renueva y Vibri que late.**
- Dónde: `src/rhythm-calibration.js`, `journey-pulse.js:100`.
- Cómo: al cambiar `outputLatency` más de 30 ms, volver a medir. Medir solo con pasos a tiempo (cada negra). El giro de nivel 3 avanza un cuarto de vuelta en cada tiempo.
- Bien cuando: un bot +150 ms en la Cueva queda a tiempo; un bot que cambia a +300 ms se recalibra solo.

## 5. Decisiones de Jay

- **★★:** 75 %. El modelo lo dice: el jugador del 75 % pasa de 11 a 28 ★ en 2 h y nunca más de 11 min sin capa nueva. Con 85 % se queda 85 min sin que crezca la canción. Pero solo si la calibración funciona en teléfonos; si no, ninguna cifra es justa. «Mejorar tu marca» premia la mano, no la música; lo dejaría para Maestro. Ojo: el narrador dice «Ochenta y cinco por ciento» (`narrator.js:49`).
- **Festival:** sí, solo el Viaje. Ya existe `?festival=1` (`festival.js:1`), pero son 15 min y acaba en el Lago. Un jurado debe vivir la Tormenta y el final del Refugio. La descarga de Rez está al final, no al principio.
