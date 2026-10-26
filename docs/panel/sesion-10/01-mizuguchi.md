# 01 · Tetsuya Mizuguchi (simulado)

Simulación de la mirada de diseño de Tetsuya Mizuguchi a partir de su obra pública. No es su opinión real.

**Versión:** 2.3.0-alpha.207 (commit `2e7f9d1`).

**Qué revisé:**
- Código: `src/journey-pulse.js`, `src/interactions.js`, `src/canvas.js`, `src/render.js`, `src/audio.js`, `src/rhythm-calibration.js`, `src/bar-beat-hint.js`, `src/journey-hint.js`, `src/journey-games.js` (`beatGlow`), `src/body.js`, `src/controls.js`. Búsqueda en todo `src/` de temporizadores visuales atados al reloj de audio.
- Guías: `docs/VIAJE.md`, `docs/MUNDO.md`, `docs/UNIVERSO.md` (solo las partes de ritmo, luz y pulso).
- Capturas (12): `00-inicio`, `01-capitulo-llanura`, `02-capitulo-lago`, `04-capitulo-tormenta`, `05-capitulo-vacio`, `12-lugar-cristales`, `13-lugar-faros`, `20-anillo`, `22-cancion`, `23-salvaje`, `33-resultado`, y `menus/tel-libre-ajustes`, `menus/tel-libre-sonido`.
- Modelo: `node scripts/play-curve.mjs` (jugadores simulados, no personas).
- Límite: no oí el audio, no toqué un teléfono, no sentí la vibración. Todo lo de sonido y tacto sale del código.

## Contexto

Kubono es un instrumento con forma de juego. Un cubo diminuto flota en negro y cada toque suena siempre dentro de la escala. Tocar a tiempo convierte ese sonido en una nota del tema y deja oro en la Línea. El Viaje enseña cinco variaciones del mismo gesto; el Mundo libre las convierte en estrellas que construyen Tu canción. Quiere ser un lugar donde el jugador no compite con la música: la toca.

## Notas

| Eje | Nota | Por qué | Evidencia |
|---|---|---|---|
| Visual | 6,5 | Lenguaje sobrio y coherente: blanco, gris y un oro que significa «a tiempo». Pero el mundo apenas respira con el pulso, y la mayoría de lugares se ven grises. | `render.js:111` (latido del cubo `b*.08`), `audio.js:594` (`beat()` decae a la cuarta potencia); capturas `01`, `04`, `05`, `12` casi monocromas |
| Audio | 7 | Por el código: síntesis propia por voz, el tema cae en la escala del lugar, nada desafina. No lo oí. | `journey-pulse.js:44` (`themePitch`), `journey-pulse.js:55` (voz de cello), `audio.js:322` (el mundo toca en el tiempo) |
| Creatividad | 7 | Un solo verbo que se vuelve tema, forma del cubo y canción final. Es una idea limpia. | `journey-pulse.js:6` (tema), `:14` (forma cada 4 aciertos), captura `22-cancion` |
| Sensación | 5,5 | El toque en espacio vacío suena al levantar el dedo, no al apoyarlo. Fuera de tiempo, el sonido llega 0,1–0,28 s después. La vibración es un solo pulso de 12 ms y no existe en iPhone. | `canvas.js:42` vs `canvas.js:66`; `audio.js:164`, `audio.js:336`; `journey-pulse.js:65,69` |
| Cohesión | 6 | Existe la regla «luz, tacto y sonido en el mismo instante» (`scheduleAudibleCue`), pero solo la usan 9 llamadas; 21 temporizadores visuales usan el reloj crudo. La calibración corrige el juicio pero no la luz. | `journey-pulse.js:30`; ver hallazgo 2 y 3 |
| Pulido | 6,5 | Detalles cuidados: la Línea anticipa, el resultado dice «74,6 % / 75 %», la calibración es invisible. Falta explicar «Ajustar el tiempo». | `journey-pulse.js:23,123`; capturas `33-resultado`, `menus/tel-libre-ajustes` |
| **Media** | **6,4** | | |

## Lo que funciona

1. **El acierto aterriza cuando se oye, no cuando se toca.** El brillo dorado, el golpe del cubo y la vibración esperan al tiempo audible estimado. Es exactamente la idea correcta. `journey-pulse.js:66-70`, `journey-pulse.js:107-110`.
2. **El juicio usa el instante del dedo abajo.** Aunque el sonido salga al levantar, la nota se juzga con `tapStart.t` y resta la latencia de salida. `canvas.js:39`, `journey-pulse.js:40`.
3. **Calibración sin menú.** Doce pulsos coherentes (dispersión ≤ 60 ms) fijan el retraso personal. Los pulsos dispersos no se «calibran» como si fueran latencia. `rhythm-calibration.js:6-19`.
4. **El objeto que suena es el objeto que se ilumina.** El mundo toca solo en el pulso y cada fuente se enciende en su tiempo audible. Esto es sinestesia de verdad. `audio.js:322-324`.
5. **Fallar no castiga el oído.** Fuera de tiempo, el pulso se cuantiza a la rejilla y suena dentro del acorde. Solo el oro distingue el acierto. `interactions.js:53`, `journey-pulse.js:125`.
6. **La Línea anticipa.** Los pasos que cuentan crecen durante los cuatro pasos previos; el «1» es dorado. Se ve el golpe antes de entenderlo. `journey-pulse.js:23`, `journey-pulse.js:123`; capturas `01`, `04` (marcas en y≈675).
7. **La forma del cubo es una recompensa de flujo, no de tamaño.** Esquinas, rombo, doble marco dorado. Un fallo quita un nivel, nunca todo. `journey-pulse.js:15`, `journey-pulse.js:130-134`. Respeta «el cubo es pequeño».

## Lo que falla o falta

Ordenado por gravedad.

1. **El pulso en espacio vacío suena al levantar el dedo.** Solo el toque a ≤ 24 px del cubo dispara en `pointerdown` (`canvas.js:42`). Cualquier otro toque espera a `pointerup` (`canvas.js:66`, ventana de hasta 450 ms). Con un cubo de 6–12 px (`render.js:188`), la mayoría de toques caen fuera de esa zona. El juicio es justo, pero el oído recibe la nota un toque entero tarde: lo que dure el dedo apoyado (en un toque normal, decenas de milisegundos a más de 100; no medido en personas). Para un juego cuyo verbo es «tocar a tiempo», es la falla central de la sensación.
2. **Dos relojes visuales.** `scheduleAudibleCue` compensa la latencia de salida (`journey-pulse.js:30`), pero solo 9 llamadas lo usan (6 en `audio.js`, 2 en `house.js`, 1 en `journey-pulse.js`). Hay 21 líneas que programan luz con `ac.currentTime` crudo, entre ellas `journey-hint.js:19`, `journey-moments.js:31`, `ambience.js:15`, `glass.js:47`, `landmarks.js:55`, `initiative.js:32`, `journey-echo.js:40`, `journey-victory.js:17`, `feedback.js:30,34`, `cube-shop-sound.js:76-99`, `render.js:360`. Con auriculares Bluetooth (`outputLatency` hasta 0,4 s, `journey-pulse.js:28`), esa luz llega antes que su sonido. Incluso el dedo fantasma que enseña el pulso abre su anillo antes del golpe que se oye.
3. **La calibración corrige el juicio, no la luz.** `NUDGE` entra en `heardTime` (`journey-pulse.js:40`), pero no en `audibleTime` (`:27`), ni en el cursor de la Línea (`:77`), ni en el aterrizaje del acierto (`:67`). En iPhone, Safari no da `outputLatency`; cae a `baseLatency` (unos ms). Si la calibración mide 150 ms con AirPods, el cursor de la Línea y el brillo dorado siguen 150 ms adelantados respecto al sonido. El jugador ve una cosa y oye otra.
4. **El toque fuera de tiempo responde lento y en dos tiempos.** La onda y el engorde del cubo salen al instante (`interactions.js:48,50`), pero el sonido va a `MU.queue` (`audio.js:592`), que se vacía en el siguiente paso programado (`audio.js:336`) con 120 ms de anticipación (`audio.js:164`). A 96 BPM (`audio.js:38`, semicorchea 0,156 s) son unos 95–276 ms más la latencia de salida. Cuantizar es correcto; separar la imagen del sonido, no. En el acierto pasa algo parecido: el cubo crece al tocar (`runtime.pulse=.6`, `interactions.js:50`; `render.js:111`) y vuelve a golpear al oírse (`cubeKick`, `journey-pulse.js:69`). Dos picos visuales para un solo golpe.
5. **El tacto es un solo color.** Toda la vibración del juego vive en `journey-pulse.js:69`: 12 ms por acierto, `[12,40,18]` al cerrar la frase. Nada al ganar forma, ni al subir el oro del «1», ni en la Plenitud. En iPhone no hay `navigator.vibrate`; el respaldo es el brillo dorado (`render.js:132-135`). No es un fallo, pero el tacto no está tocando música.
6. **El mundo no es un instrumento de luz.** El latido global `beat()` cae a la cuarta potencia y pesa poco: cubo `b*.08`, la mayoría de capas entre `b*.04` y `b*.35` (`render.js`). El pulso solo existe en negras (`audio.js:270`); el bombo, el hat y el bajo no tienen luz propia. Las capturas de los capítulos (`01`, `04`, `05`, `12`) son casi monocromas. El color aparece de verdad en `22-cancion` y en el resultado, lejos del juego.
7. **La mirada se parte en dos.** El cubo está en el centro (y≈422) y la Línea, que da la anticipación, está abajo (y≈675, `journey-pulse.js:116`, `H*.8`). Para anticipar hay que mirar la Línea; para jugar hay que mirar el cubo. El oro del acierto vive en los dos sitios.
8. **«Ajustar el tiempo» no se explica.** El ajuste muestra «Midiendo…» y botones − / + sin una frase (captura `menus/tel-libre-ajustes`). No hay forma de comprobar el resultado con el oído.

## Recomendaciones

1. **Que el toque suene al apoyar el dedo.** En `canvas.js:42`, disparar el pulso en `pointerdown` en todo el lienzo durante el Camino y los capítulos (donde el gesto principal es tocar). Si en ese mismo toque el dedo se arrastra ≥ 14 px, se sigue caminando: el pulso ya sonó, como un paso con nota. En el Mundo libre, ampliar solo la zona táctil (no el cubo) de 24 px a ~64 px.
   *Bien cuando:* en una prueba con puntero simulado, el tiempo entre `pointerdown` y el `start()` del oscilador de la nota es ≤ 15 ms + `outputLatency` en el 95 % de los toques, con un `pointerup` 120 ms después.
2. **Un solo reloj para la luz.** Sustituir los 21 temporizadores con `ac.currentTime` crudo por `scheduleAudibleCue` o `audibleTime` (`journey-hint.js:19`, `journey-moments.js:31`, `ambience.js:15`, `glass.js:47`, `landmarks.js:55`, `initiative.js:32`, `journey-echo.js:40`, `journey-victory.js:17`, `feedback.js`, `cube-shop-sound.js`, `cajas.js`, `mirrors.js:76`, `patches.js:40`, `quietud.js:50`, `render.js:360`).
   *Bien cuando:* `grep -rnE "currentTime" src | grep "\*1000" | grep -v "outputLatency\|landDelay"` devuelve 0 líneas, y una prueba con `outputLatency=0,25` simulado muestra cada brillo ≤ 20 ms después de su nota.
3. **Que la calibración mueva también la luz.** Añadir la parte del retraso que pertenece al dispositivo a `audibleTime` y a `landDelay` (`journey-pulse.js:24,27`). Separar el retraso del aparato del retraso humano si hace falta; como mínimo, aplicar el `NUDGE` al cursor de la Línea.
   *Bien cuando:* con `latencyNudge=0,15`, el cursor de la Línea cruza el paso 0 en el mismo fotograma (±16 ms) en que suena el bombo programado para ese paso.
4. **Un golpe, una imagen.** En `interactions.js:50` y `:48`, no engordar el cubo ni lanzar la onda al tocar; lanzarlos cuando suena la nota (cuantizada o no), con `scheduleAudibleCue`. Al tocar, solo una marca mínima en la Línea para que el toque nunca desaparezca.
   *Bien cuando:* en la traza de un toque fuera de tiempo, `waves.push` y la nota quedan a ≤ 20 ms de distancia; en un acierto hay un solo pico de escala del cubo.
5. **Tacto con vocabulario.** En `journey-pulse.js:65-69` (sin cambiar la música): 8 ms en el acierto, 12 ms en el «1» del compás, `[10,30,10,30,20]` al ganar forma y un pulso suave en el bombo solo en Plenitud con forma 3. Respetar el interruptor «Vibración».
   *Bien cuando:* una prueba registra al menos cuatro patrones distintos en `journeyPulseState().vibrations` por tipo, y ninguno suena con «Vibración» apagado.
6. **Llevar la anticipación al cubo con luz, no con tamaño.** En `journey-pulse.js:130` (`drawForm`), un anillo fino que se cierra sobre el cubo durante los cuatro pasos previos a un paso que cuenta (usando `approach`), dorado en el «1». El cubo no crece. Y una frase en «Ajustar el tiempo»: «Toca con el golpe. Lo medimos solo.»
   *Bien cuando:* en un test de dibujo, el anillo llega a radio mínimo en el mismo paso que la marca de la Línea, y el tamaño del cubo (`s`) no cambia respecto a hoy.

## Opinión en una frase

Kubono ya entiende que la luz, el tacto y el sonido deben ser un solo instante, y lo hace bien en el acierto; ahora tiene que cumplirlo en el primer milisegundo del dedo y en cada rincón del mundo.
