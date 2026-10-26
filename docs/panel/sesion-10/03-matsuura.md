# 03 · Masaya Matsuura (simulado)

Simulación de la mirada de diseño de Masaya Matsuura a partir de su obra pública. No es su opinión real.

**Versión:** 2.3.0-alpha.207 (commit `2e7f9d1`).

**Qué revisé:**
- Código: `src/journey-pulse.js`, `src/journey-rhythm.js`, `src/rhythm-calibration.js`, `src/places.js`, `src/interactions.js` (`sonar`), `src/journey-games.js`, `src/journey-hint.js`, `src/bar-beat-hint.js`, `src/spark-rules.js`, `src/sparks.js`, `src/journey-stick.js`, `src/journey-surf.js`, `src/voices.js` (`playTheme`), `src/audio.js` (tempo, `onBeatNow`, `playerNote`), `src/render.js` (brillo y golpe del cubo), `src/genre-tempo.js`.
- Guías: `docs/VIAJE.md`.
- Capturas (12): `00-inicio`, `01-capitulo-llanura`, `02-capitulo-lago`, `04-capitulo-tormenta`, `05-capitulo-vacio`, `10-lugar-jardin`, `13-lugar-faros`, `15-lugar-cueva`, `22-cancion`, `23-salvaje`, `33-resultado`.
- Modelo: `node scripts/play-curve.mjs`.
- No oí el audio y no jugué con las manos. Lo que digo del sonido y de la sensación sale del código.

## Contexto

Kubono es un juego de ritmo que no parece un juego de ritmo. Hay un cubo diminuto en un cosmos negro y un solo gesto: tocar a tiempo. Cada lugar convierte ese gesto en un verbo distinto y en un patrón propio. Tus aciertos tocan la melodía del cubo, y esa melodía vuelve en «Tu canción». Quiere ser un Vib-Ribbon contemplativo: una línea, un pulso, y una canción que es tuya porque la tocaste tú.

## Notas

| Área | Nota | Por qué | Evidencia |
|---|---|---|---|
| Visual | 7 | Negro limpio y con carácter. Pero la Línea, que es la guía del ritmo, es muy tenue y queda lejos del cubo. | Base con alfa .16 y marcas de 1–3 px (`journey-pulse.js:117,123`). En `02-capitulo-lago` y `01-capitulo-llanura` el paisaje compite con ella. |
| Audio (por código) | 7,5 | Cada acierto toca la siguiente nota del tema con la voz del lugar, más su tercera y su quinta. Un fallo nunca suena mal. Pero el sonido no cambia con la racha. | `voices.js:188-192`, `interactions.js:51-53`. La forma del cubo no tiene consecuencia sonora (`cubeForm` no se usa fuera de `journey-pulse.js`). |
| Creatividad | 8 | Once ritmos para un solo gesto. La Cueva es una llamada y respuesta. Tus notas vuelven al final de la canción. | `journey-rhythm.js:7-19`, `places.js:100,120-121`, `15-lugar-cueva`, `22-cancion`. |
| Sensación (por código) | 6,5 | La latencia está bien pensada. Pero la mirada se reparte entre el cubo y la Línea. El dedo fantasma enseña un ritmo equivocado en algunos lugares. Hay ventanas tan anchas que el ritmo deja de importar. | Detalle en «Lo que falla». |
| Cohesión | 7 | Un único verbo en todo el juego. Pero hay tres rachas distintas, y la de la forma del cubo no coincide con la del juego ni con la de las chispas. | `journey-pulse.js:15`, `spark-rules.js` (`nextStreak`), `journey-stick.js:54`. |
| Pulido | 7 | El código es cuidadoso: suelo honesto en el porcentaje, deshacer si falla el guardado. Hay pequeñas incoherencias de reloj y ruido en el resultado. | `places.js:24`, `journey-hint.js:19`, `33-resultado` («8 logros nuevos»). |
| **Media** | **7,2** | | |

## Lo que funciona

1. **Acertar crea música.** En un acierto, el pulso toca la siguiente nota del tema de seis notas en la escala del lugar (`journey-pulse.js:6,96,103`), con arpegio (`voices.js:190`). La melodía solo avanza cuando aciertas. Es la idea de PaRappa: tu canción existe porque acertaste.
2. **Ningún castigo.** Un fallo suena igual, colocado en la rejilla (`interactions.js:53`). En la Línea queda una marca blanca pequeña en vez del pico dorado (`journey-pulse.js:125`). La forma del cubo baja un nivel, nunca todos (`journey-pulse.js:15`). Las chispas fuera de tiempo pagan la base, sin multiplicador (`spark-rules.js`).
3. **El personaje cambia con la racha.** Cada cuatro aciertos seguidos, el cubo gana una forma: esquinas, luego rombo, luego marco dorado que gira (`journey-pulse.js:14,130-133`). Es el Vibri de Vib-Ribbon, en pequeño, y respeta el cubo pequeño.
4. **Sabes al instante que acertaste.** Brillo dorado, golpe del 18 % en el cubo, destello y vibración, todo en el momento en que *suena* la nota y no cuando tocaste (`journey-pulse.js:66-70,107-110`; `render.js:111,135`).
5. **La latencia se mide de verdad.** El juicio resta la latencia de salida y la del propio jugador (`journey-pulse.js:40`). Se calibra en silencio con los primeros doce pulsos, y solo si coinciden (`rhythm-calibration.js:6,16`). Un jugador que toca mal no queda «calibrado» por error.
6. **El lugar canta antes de pedir.** Dos compases de demostración desde el siguiente «1» (`journey-rhythm.js:30,55`). La Línea anticipa el golpe: la marca crece en los cuatro pasos previos (`journey-pulse.js:23,123`).
7. **Un resultado honesto.** «74,6 % / 75 % a tiempo» (`33-resultado`). El porcentaje se redondea hacia abajo y nunca regala una estrella (`places.js:24`).
8. **Tu canción como álbum.** El anillo de once lugares con sus colores ganados se lee de un vistazo (`22-cancion`).

## Lo que falla o falta

Ordenado por gravedad.

1. **El dedo fantasma enseña el ritmo equivocado.** La pista sin palabras late siempre sobre el pulso de la música (`journey-hint.js:19`, usa `MU.bq`). No mira el ritmo del lugar (`journey-rhythm.js:19`). En Lago, Dunas (contratiempo, pasos 2·6·10·14) y Faros (1·3·y), el dedo marca justo los momentos que **no** cuentan. Además usa `ac.currentTime` y no el tiempo audible. Así marca antes de lo que se oye, hasta 400 ms con Bluetooth (`journey-pulse.js:28`). `beatGlow` sí lo corrige (`journey-games.js:9`). El dedo está en todas las capturas de lugares: el círculo gris en (320, 478) es `hintPose` (W/2+28+min(110, W·.25), H/2+56), visible en `10`, `13`, `15` y `23`.
2. **En algunos ritmos, tocar al azar ya vale.** La ventana es de ±80 ms (`journey-pulse.js:9`). Siembra (Jardín) y Eco (Cueva) cuentan todas las corcheas (`journey-rhythm.js:12,17`). Si hay una corchea cada 333 ms (90 BPM), ±80 ms cubre el 48 % del tiempo. A 120 BPM, el 64 %. Con «a tiempo» (4 pasos), el 24 % y el 32 %. Quien toca a lo loco se acerca a ★★ (75 %) en esos lugares, sin leer nada. «Saber que lo hice bien» pierde sentido. *Cálculo: 2·0,08 / duración de la corchea. No lo medí con personas.*
3. **La mirada se divide.** El cubo, donde llega la respuesta, está en H/2 (y = 422). La Línea, que es la guía, está en H·0,8 (y = 675, `journey-pulse.js:116`): 253 px más abajo en un teléfono de 844. La base tiene alfa .16. Los pasos que cuentan miden 2×6 px, y el cursor 2×8 px (`journey-pulse.js:117,123-124`). En `02-capitulo-lago` y `01-capitulo-llanura`, las flores y los iconos de 50 px tapan la Línea en la atención. En Vib-Ribbon, la línea *es* el suelo del personaje. Aquí la Línea y el cubo son dos objetos sin relación.
4. **La racha no suena.** El nivel de la forma solo se dibuja (`journey-pulse.js:130-134`). `playTheme` toca igual al nivel 0 y al 3 (`voices.js:188-192`). La única capa que crece con la racha está en otro camino, `playerNote` (`audio.js:357`, `groove>=4`), y no es el pulso del Viaje. PaRappa enseña que el oído es el primer lugar donde se siente el «Cool».
5. **Tres rachas que no coinciden.** La forma del cubo pierde un nivel al fallar (`journey-pulse.js:15`). Las chispas vuelven a 0 y se olvidan a los 4 s (`spark-rules.js`, `nextStreak`). El juego de la Llanura vuelve a 0 y además sacude el cubo (`journey-stick.js:54`). Con sonido apagado, la forma nunca cambia (`journey-pulse.js:101`). El jugador no puede formarse una idea única de «mi racha».
6. **Durante la ronda no sabes si vas hacia ★★.** El porcentaje solo aparece en la tarjeta final (`places.js:131`). Quedarse en el 74,6 % sin haberlo visto venir es un castigo diferido, aunque no se diga (`33-resultado`).
7. **La calibración no avisa y no vuelve.** Una vez hecha (`latencyCal=true`), no vuelve a medir aunque cambien los auriculares (`rhythm-calibration.js:16`). Solo se repite desde Ajustes. Además, el ajuste personal (`NUDGE`) cuenta en el juicio, pero no en el cursor de la Línea ni en la llegada de la respuesta (`journey-pulse.js:27,40,67`). Si el ajuste existe porque el teléfono miente sobre su latencia, la Línea y el juicio quedan desfasados.
8. **Ruido en el momento del premio.** «8 logros nuevos · En la Bitácora.» comparte tarjeta con las estrellas (`33-resultado`). Le quita foco a la única pregunta que importa: ¿lo hice bien?

## Recomendaciones

1. **Que el dedo fantasma toque el ritmo del lugar y en el tiempo audible.** En `journey-hint.js:19`, usar `audibleTime` y los pasos de `journeyRhythmState().steps`, igual que la Línea.
   *Bien cuando:* una prueba de unidad en Dunas muestra el anillo del dedo en los pasos 2·6·10·14 y en ningún paso múltiplo de 4. Con `outputLatency = .2`, el pico del anillo cae 200 ms después de `currentTime` del pulso.
2. **Un acierto también responde en la Línea, junto al cubo.** Sin agrandar el cubo, dibujar un eco del cursor bajo el cubo, o un hilo de la Línea que suba al cubo en cada acierto. Se tocaría en `journey-pulse.js` `draw`/`drawForm`. Subir el alfa de la base y de los pasos que cuentan (`journey-pulse.js:117,123`).
   *Bien cuando:* en las capturas de Lago y Llanura, el contraste de los pasos que cuentan contra el fondo es ≥ 4,5:1. En una sesión de 5 personas, 4 dicen sin ayuda dónde mirar para saber cuándo tocar.
3. **La racha también suena.** No se cambia la música: cambia la respuesta del pulso. En `voices.js:190`, el nivel de forma decide cuántas notas del arpegio suenan: 0 → solo la nota, 1 → +tercera, 2 → +quinta, 3 → +octava.
   *Bien cuando:* una prueba sobre `playTheme` devuelve 1, 2, 3 y 4 notas para los niveles 0–3. El render de audio de una ronda con 12 aciertos seguidos muestra la capa extra solo tras el acierto número 12.
4. **Una ventana proporcional al hueco.** En `journey-pulse.js:87`, limitar la ventana a ≤ 25 % del espacio entre pasos que cuentan cuando el ritmo usa todas las corcheas (Siembra, Eco).
   *Bien cuando:* una simulación de toques al azar en Jardín y Cueva, a 90–130 BPM, queda por debajo del 35 % a tiempo. La de un jugador regular sigue igual (±1 punto) en Llanura.
5. **Una sola racha, visible y que suena.** Unificar el criterio (fallo = −1 nivel, nunca 0) para la forma, las chispas y los juegos (`spark-rules.js`, `journey-stick.js:54`). Mostrar el ritmo en curso de la ronda con la forma y no con números. Por ejemplo, el marco dorado aparece cuando vas por encima del 75 %.
   *Bien cuando:* las pruebas de `formStep`, `nextStreak` y del juego de la Llanura dan el mismo nivel ante la misma secuencia de aciertos y fallos. En la tarjeta, el porcentaje final coincide con lo que la forma anunciaba en el último compás (±5 puntos).
6. **La tarjeta del resultado habla solo del ritmo.** Llevar «N logros nuevos» a la Bitácora, fuera de `#mPlace`.
   *Bien cuando:* la captura `33-resultado` muestra estrellas, porcentaje, tiempo y chispas, y ninguna línea ajena a la ronda.

## Opinión

Kubono ya entiende lo esencial de un juego de ritmo amable: acertar crea tu música y fallar no duele. Le falta que la Línea, el cubo, el oído y la pista digan exactamente lo mismo en el mismo instante.
