# Segunda sesión · Tetsuya Mizuguchi (simulación)

> Simulación respetuosa de su filosofía conocida (sinestesia, acción cuantizada a la música, tacto). No es su opinión real ni hay citas. Principios y fuentes: `01-mizuguchi.md`. Versión revisada: 2.3.0-alpha.160. Solo Jay ha jugado esta versión.

## Qué mejoró desde el 22 de octubre

- **El verbo es el ritmo.** «Solo a tiempo pasa algo» en el Viaje y en los 11 lugares (`docs/MUNDO.md`, regla 1). Era mi tesis.
- **Se juzga lo que oye el oído, no el reloj.** `heardTime()` resta la latencia de salida y el tiempo desde el toque (`src/journey-pulse.js`). Ventana única de ±80 ms. Es oficio serio.
- **El acierto toca el tema.** Cada pulso a tiempo es la nota siguiente del tema del cubo, en la escala del lugar. Seis aciertos devuelven el color del bioma (`recoverJourneyColor`). Lo comprobé: tras 6 pulsos a tiempo en la Llanura aparece el color (`mz-llanura-after.png`).
- **Ya hay tacto.** `navigator.vibrate(12)` por acierto y `[12,40,18]` al cerrar la frase, con ajuste para apagarlo.
- **El cierre sale de la música.** Filtro que se cierra, medio tiempo de silencio real (−109 dB) y vuelta en el «1» con la capa del lugar (F13, `tests/victory_mix.py`). Es la descarga de Rez.
- **Hay un viaje con final.** Camino → 5 capítulos → el Refugio toca tu viaje (`src/journey-finale.js`). Mi momento firma existe.
- **Ritmos distintos por lugar** (F14) y la guía de ocho corcheas bajo el cubo. La Cueva (llamada y respuesta) es pura cuantización.

## Qué sigue mal o es nuevo

- **El acierto no se ve si el teléfono vibra.** `if(!vibrate(...))runtime.cubeGlow=1` (`journey-pulse.js`, línea 68). En Android el brillo dorado nunca sale. Lo medí en Chromium: 6 aciertos, `cubeGlow` nulo. Ojo y mano deben sentir lo mismo a la vez, no uno u otro.
- **La onda a tiempo es igual que la de fuera de tiempo.** La onda guarda `beat:!!hit`, pero `updWaves` no lo usa al dibujar (`src/interactions.js`). El único signo es un pico en la Línea, abajo, lejos de los ojos (`mz-llanura-hit60ms.png`).
- **El mundo no late.** La luz del bioma es un degradado con opacidad de 0,05 + 0,07 × beat (`src/world-sheet.js`): un 12 % como máximo. El color recuperado son motas sueltas. En 01–05 y 10–15 todo es gris sobre negro.
- **El cubo sigue diminuto.** Mide unos 10 px en 390×844. `world-camera.js` no tiene zoom base; solo un golpe de +6 %. No se aplicó lo de 48 px.
- **La Tormenta no parece un clímax.** En `04-capitulo-tormenta.png` y `mz-tormenta-hit60ms.png` hay líneas grises, un círculo y un texto: «Aquí el ritmo es «1 · 2 · y»». El pico del Viaje se explica con palabras.
- **La primera pantalla sigue siendo texto.** `00-inicio.png`: cuatro frases, «.simple» y «Empezar». Detrás se ven «DÍA 1», «Era I · Pixel», «0 chispas» y «Caminado 0 m». Pedí que el primer pulso sonara antes que cualquier palabra.
- **Latencia sin medir en un teléfono.** Solo hay medida de fotogramas (p50 17 ms en iPhone). Nadie midió del toque al sonido. Con Bluetooth, `outputLatency` puede llegar a 0,4 s y no hay calibración.
- **El viaje es un prólogo.** 15–17 min y luego 11 rondas con %, ★★ y Maestro. La emoción del recorrido se vuelve un examen de puntuación.
- **El narrador burlón** (F8) se gana al cerrar una ronda, junto al cierre musical. No comprobé si su aviso pisa el silencio y el «1», pero el riesgo es real: rompe el trance.

## Notas

| Eje | 22 oct | Hoy | Por qué |
|---|---|---|---|
| Visual | 6 | 6,5 | El color se gana, pero el mundo sigue gris, sin latido y con el cubo diminuto. |
| Audio | 8 | 8,5 | Tema, capas que siguen el acorde y silencio antes del «1». Falta la escucha en teléfono. |
| Creatividad | 8 | 8,5 | Once verbos rítmicos; la Cueva y Tu canción son ideas propias. |
| Sensación | 5,5 | 7 | Regla a tiempo, compensación de latencia y vibración. El acierto no se ve. |
| Cohesión | 5 | 7 | Viaje con arco y final. Tienda, 399 logros y narrador siguen tirando hacia fuera. |
| Pulido | 6 | 6,5 | Mucha prueba automática, cero personas. HUD y texto en la entrada. |
| **Media** | **6,4** | **7,3** | |

## Sus 3 acciones prioritarias

**1. El acierto se ve, se oye y se siente en el mismo instante.**
- Qué: un pulso a tiempo dispara a la vez nota, luz dorada, golpe de cámara y vibración. Fuera de tiempo, solo la onda blanca.
- Cómo: en `journey-pulse.js`, separar la vibración del brillo: siempre `runtime.cubeGlow=1`, y vibrar además. En `interactions.js` (`updWaves`), dibujar en dorado las ondas con `w.beat`, con trazo de 3 px y un segundo anillo. Llamar a `runtime.cameraKick(.02)` con un `setTimeout` a `(t − ac.currentTime + outputLatency) × 1000`, donde `t` es la hora del sonido. Así la imagen cae cuando suena, no cuando tocas.
- Criterio: en `tests/journey-pulse.mjs`, `cubeGlow` vale 1 aunque `vibrate` devuelva `true`. Capturas a 60 ms de un pulso a tiempo y de uno fuera de tiempo: la primera tiene al menos 10 veces más píxeles dorados. Con movimiento reducido no hay golpe de cámara.

**2. El mundo late con el bombo y el cubo se ve.**
- Qué: la luz es instrumento. El color recuperado llena la pantalla y respira en cada tiempo.
- Cómo: en `world-sheet.js`, subir el degradado a 0,10 + 0,18 × beat si el color está recuperado y a 0,04 + 0,06 si no. En la Tormenta, el bombo sube la luminancia del fondo un 10 %. En `world-camera.js`, añadir zoom base `z = base × (1 + punch)`, con `base = 1,8` si `W < 500`. `cameraOffset().zoom` ya lo lleva a los toques.
- Criterio: en 390×844 el cubo mide 28 px o más. Con el color recuperado, el 15 % o más de los píxeles tiene color. La luminancia media en el tiempo supera en un 8 % o más a la del contratiempo. Las pruebas de toque (`player_touch_smoke.py`) siguen pasando.

**3. Medir y calibrar la latencia en teléfonos reales.**
- Qué: del toque al sonido, menos de 50 ms, y un ajuste para auriculares Bluetooth.
- Cómo: ampliar `?medir=1` para anotar, en cada pulso, `pointerdown` frente a la hora programada del sonido más `outputLatency`. En Ajustes, «Ajustar ritmo»: tocas 8 veces con un clic y se guarda `S.latencyOffset` (normalizado, de 0 a 300 ms). `heardTime()` lo suma.
- Criterio: p95 menor de 50 ms en un Android de gama media y en iPhone con altavoz. Con Bluetooth y calibrado, el % a tiempo de Jay no cae más de 10 puntos frente al altavoz.

## Una decisión que solo Jay puede tomar

**¿Habla el narrador durante el trance?** Su propuesta: dentro del Viaje y de las rondas, los logros esperan callados hasta la tarjeta final o la Bitácora. Su voz burlona no debe pisar el silencio ni el «1» del cierre. Jay aprobó el tono, pero no dónde suena.
