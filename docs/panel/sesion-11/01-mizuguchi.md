# 01 · Tetsuya Mizuguchi — sesión 11
> Simulación de su mirada de diseño a partir de su obra pública. No es su opinión real. Revisó alpha.215 (`5464612`; capturas tomadas en `fe3cc68`, que solo toca el verificador): el pulso y su respuesta (`src/canvas.js`, `src/interactions.js`, `src/journey-pulse.js`, `src/render.js`, `src/audio.js`), el golpe en el cubo y las capturas de entrada, cinco capítulos, seis lugares, anillo, menú, resultado y Tu canción. Sin navegador, sin manos y sin altavoz.

## Notas (puntuación ciega)

| Eje | Nota | Evidencia y alcance |
|---|---|---|
| Visual | 7,5 | Cada lugar tiene firma propia: haz de Faros, red de Cristales, torres de Ruinas, líneas de Dunas. El Camino es limpio. Lago y Bosque cargan ruido de círculos y glifos a baja opacidad. Vacío queda casi vacío. |
| Audio | — | Me abstengo. Nadie lo ha oído en un teléfono y yo tampoco. Solo leo el código: nota del tema en la voz del lugar, tercera y quinta en la rejilla, pulso suave al 45 %. |
| Creatividad | 8 | Un solo verbo que toca el tema del cubo nota a nota. Lugares con ritmo propio. Un anillo que se cierra sobre el cubo antes de cada paso contado. |
| Sensación | 6,5 | Medido en el código, no con las manos. El golpe a tiempo es un solo instante. El pulso fuera de tiempo suena entre 95 y 320 ms después del toque, y su onda ya salió en el ms 0. |
| Cohesión | 7 | Casi todo sigue un reloj (`audibleTime`). Quedan tres relojes sueltos: la Cueva, el «EN TIEMPO ×N» y las marcas de la Línea. |
| Pulido | 7,5 | Resultado, menú y Tu canción son sobrios y legibles. La Línea y el anillo son finos y ordenados. Ruido de fondo y oro repartido en cinco señales a la vez. |

## Lo que funciona hoy

1. **El acierto es un solo instante.** Nota, vibración, brillo dorado y golpe del cubo esperan al tiempo audible (`journey-pulse.js:80-85`). El cubo ya no engorda al tocar.
2. **El dedo suena al bajar.** En el Camino, los capítulos y las rondas, el pulso sale en `pointerdown` en todo el lienzo (`canvas.js:29`, `:47`). Del dedo a la nota a tiempo: 10 ms más la latencia de salida (`pulseNoteTime`, `journey-pulse.js:35`).
3. **Un reloj para la luz.** `lightLatency` suma la latencia del aparato y la calibración (`journey-pulse.js:40-44`). El cursor de la Línea, los brillos y las fuentes del mundo lo usan. El grep de P5 da 0 líneas.
4. **La anticipación llega al cubo con luz, no con tamaño.** Medí `cubeRing`: radio 17,5 → 15 → 12,5 → 10 px en los cuatro pasos previos, alfa 0,15 → 0,6, dorado en el «1» (`journey-pulse.js:25-27`). El cubo sigue de 6–12 px (`render.js:190`).
5. **Ningún toque mudo.** El toque demasiado seguido suena al 45 % y deja su marca gris (`interactions.js:63-70`, `journey-pulse.js:127`).
6. **Los lugares se reconocen sin texto.** Haz dorado en Faros, red de triángulos en Cristales, torres en Ruinas, franjas en Dunas (capturas `11` a `15`). El Camino (`00`) es negro y casi vacío, como debe.
7. **La tarjeta de resultado es honesta.** «74,6 % / 75 % a tiempo» y «A 0,4 de ★★» (captura `33`). Tu canción (`22`) da color a lo ganado y gris punteado a lo que falta.

## Lo que falta o salió mal

1. **Alta · La onda sale antes que el sonido.** La onda se dibuja al tocar (`interactions.js:50`), en dorado si acierta (`:29`). El golpe del cubo, en cambio, espera al oído (`journey-pulse.js:84`). Con Bluetooth (`outputLatency` hasta 0,4 s, `journey-pulse.js:37`) son dos imágenes para un golpe. P5 lo dejó así a propósito («la onda sigue saliendo al tocar»).
2. **Alta · Fuera de tiempo, el sonido llega tarde.** La nota va a `MU.queue` (`interactions.js:58`, `audio.js:592`). Se vacía al programar el siguiente paso, con 120 ms de anticipación (`audio.js:164`, `:336`). Modelo en Node: a 96 BPM, del toque a la nota 120–276 ms (mediana 200); a 76 BPM, hasta 317 ms. Más la latencia de salida. El engorde del cubo espera a esa nota; la onda no.
3. **Media · La Cueva juzga con otro reloj.** `journey-echo.js:37` calcula `heard()` con `outputLatency` crudo y sin la calibración. El resto juzga con `heardTime`, que sí la suma (`journey-pulse.js:55`). Con `latencyNudge` 0,05 medí 50 ms de diferencia. La ventana de respuesta de ±100 ms (`journey-echo.js:52`) queda corrida.
4. **Media · El tacto sigue teniendo una sola palabra.** Una única llamada en todo el juego: 12 ms por acierto y `[12,40,18]` al cerrar la frase (`journey-pulse.js:84`). Nada al ganar forma, ni en el «1», ni al cerrar una ronda. En iPhone no hay vibración.
5. **Media · Cinco oros a la vez.** En un acierto brillan la onda (`interactions.js:29`), la marca de la Línea (`journey-pulse.js:127`), el marco del cubo (`render.js:136`), el arco del destello (`render.js:137`) y el anillo del «1». La onda y la marca salen al tocar; el resto, al oírse. El oro dice «a tiempo» y también «★». Demasiadas voces para un mismo golpe.
6. **Baja · Los motes muestran el acierto antes de su nota.** `playerNote` enciende `grooveFx` y «EN TIEMPO ×N» al contacto (`audio.js:354`, `render.js:117-118`). Su nota va a la cola (`audio.js:357`).
7. **Baja · Ruido de fondo.** Lago y Bosque llenan la pantalla de círculos y glifos de criaturas a baja opacidad (capturas `02`, `03`). Tormenta (`04`) suma franjas y discos. Compiten con la onda del pulso, que es fina.
8. **Baja · «Ajustar el tiempo» sigue sin una frase.** Solo «−», la cifra en ms, «+» y «Medir otra vez» (`index.html:395`).
9. **Baja · Mundo libre: el vacío suena al soltar.** Fuera del cubo, el pulso espera a `pointerup` (`canvas.js:70`). Es la decisión D2-A y no la reabro. Solo anoto que ahí el tacto y el sonido se separan lo que dure el dedo apoyado.

## Contraste con la sesión 10

En la sesión 10 puse 6,5 · 7 · 7 · 5,5 · 6 · 6,5. Hoy: 7,5 · — · 8 · 6,5 · 7 · 7,5. Me abstuve en Audio porque nadie lo ha oído.

**Cerrado (comprobado en el código):**
- El pulso suena al apoyar el dedo en el Camino, capítulos y rondas (`canvas.js:29`, `:47`). La prueba de P6 mide p95 ≈ 12,5 ms hasta la nota.
- Un reloj para la luz: el grep de P5 da 0 líneas. `audibleTime` y `cueDelay` usan `lightLatency` (`journey-pulse.js:40-44`).
- La calibración mueve la luz y el cursor de la Línea (`NUDGE` en `lightLatency`).
- Un pico por acierto: el cubo solo golpea al oírse (`interactions.js:55-57`).
- El anillo que se cierra sobre el cubo, dorado en el «1», sin cambiar `s` (`journey-pulse.js:25-27`, `:139-142`).
- El mundo tiene algo más de color ganado (P7). Las capturas de lugares ya no son todas grises.

**Abierto:**
- La onda sale al tocar, no al oírse (mi recomendación 4 de la sesión 10, solo a medias).
- La espera fuera de tiempo sigue en 95–320 ms: P5 movió la imagen, no acortó la espera.
- El tacto con vocabulario (recomendación 5): sin cambios.
- La frase de «Ajustar el tiempo» (recomendación 6, segunda parte): sin cambios.
- El vacío del Mundo libre al soltar: abierto por decisión de Jay (D2-A). No lo pido.

**Empeoró o es nuevo:**
- No lo vi en la sesión 10: la Cueva juzga sin la calibración (`journey-echo.js:37`). P5 llevó la calibración al resto, así que ahora la Cueva es la excepción.
- Nuevo por acumulación: cinco señales doradas por acierto, en dos momentos distintos.

## Qué haría ahora

1. **La onda nace con la nota.** En `interactions.js:50`, empujar la onda dentro de `scheduleAudibleCue` (como el engorde de `:58`) y, en el acierto, junto con el aterrizaje (`journey-pulse.js:84`). Al tocar queda solo la marca de la Línea, que ya existe.
   *Bien cuando:* con `outputLatency` 0,25 simulado, en un toque fuera de tiempo y en un acierto, `waves.push` cae a ≤ 20 ms de su nota audible.
2. **Acortar la espera del toque fuera de tiempo.** Programar la voz del pulso del jugador en la siguiente semicorchea de la rejilla que quede a ≥ 20 ms (desde `MU.sq`), no en el siguiente paso aún sin programar. No cambia la música, solo cuándo suena tu toque.
   *Bien cuando:* a 96 BPM, del toque a la nota mediana ≤ 100 ms y p95 ≤ 180 ms, sin latencia de salida, y nunca más de 4 voces por paso.
3. **Un reloj también para juzgar.** En `journey-echo.js:37`, usar `heardTime(runtime.ac)` de `journey-pulse.js`.
   *Bien cuando:* `grep -rn "outputLatency||" src` solo aparece en `journey-pulse.js`, y una prueba con `latencyNudge` 0,15 acepta una respuesta en el borde del compás de respuesta.
4. **Un oro por golpe.** En el acierto, dejar el marco del cubo (`render.js:136`) como única luz dorada. La onda y el arco van en blanco. La marca de la Línea nace blanca y se vuelve dorada al oírse. El «1» del anillo sigue dorado.
   *Bien cuando:* un test de dibujo de un acierto cuenta ≤ 2 trazos dorados nuevos, y los dos aparecen en el mismo fotograma (±16 ms) que el golpe del cubo.
5. **Tacto con vocabulario y una frase.** En `journey-pulse.js:84`, patrones distintos para acierto, «1», forma ganada y cierre de ronda, con el interruptor «Vibración». En `index.html:395`, una línea: «Toca con el golpe. Lo medimos solo.».
   *Bien cuando:* una prueba registra 4 patrones distintos y 0 con «Vibración» apagada; la captura `tel-libre-ajustes` muestra la frase en una línea.
