# 03 · Masaya Matsuura — sesión 11
> Simulación de su mirada de diseño a partir de su obra pública. No es su opinión real. Revisó alpha.215 (`5464612`; capturas en `fe3cc68`, sin cambios de juego): el juicio del pulso, los once ritmos, la ronda y su tarjeta, el modelo de dos horas y once capturas.

## Notas (puntuación ciega)
| Eje | Nota | Evidencia y alcance |
|---|---|---|
| Visual | 7 | La Línea es una guía legible en todas las capturas. En contratiempo pierde el «1» dorado (`11-lugar-dunas.png`). En la Cueva conviven dos guías (`15-lugar-cueva.png`). |
| Audio | — | No lo oí. Del código: ningún toque es mudo (`interactions.js:35,68`) y el acierto toca la nota del tema (`interactions.js:57`). No puntúo lo que no escuché. |
| Creatividad | 8 | Once ritmos con nombre y verbo propio (`journey-rhythm.js:7-17`). El lugar canta su patrón dos compases antes de pedirlo (`journey-rhythm.js:52-55`). |
| Sensación | 6,5 | Juicio limpio: ±80 ms simétrico, un solo reloj y calibración (`journey-pulse.js:9,40,55`). Pero en Jardín y Cueva tocar al azar ya da el 53 % (medida abajo). Sin manos ni teléfono. |
| Cohesión | 7,5 | Ventana única para todo el juego (`journey-pulse.js:7-9`). La luz, la vibración y el golpe caen con la nota (`journey-pulse.js:81-85`). |
| Pulido | 7 | Tarjeta honesta: 74,6 % no se redondea y dice «A 0,4 de ★★» (`33-resultado.png`, `places.js:26,89`). Restos: dorado en «5 / 11» (`estilo-j.css:599`). |

Media de los cinco ejes puntuados: 7,2. No oí el audio ni jugué con las manos: la sensación sale del código y de las medidas.

## Lo que funciona hoy

1. **Un juicio, un reloj.** La misma ventana de ±80 ms juzga todo el juego (`journey-pulse.js:9`). El toque se juzga al apoyar el dedo y resta la latencia de salida y la del jugador (`journey-pulse.js:55`). La luz espera esa misma latencia (`journey-pulse.js:40-44`). Lo que ves, oyes y se juzga es un solo instante.
2. **El acierto es música.** Cada acierto toca la siguiente nota del tema, con su tercera y su quinta (`voices.js:188-191`). Brillo, golpe y vibración caen cuando suena la nota (`journey-pulse.js:81-85,125`).
3. **El fallo no castiga.** Suena igual, cuantizado (`interactions.js:58`). Deja una marca blanca pequeña (`journey-pulse.js:143`). La forma del cubo pierde un nivel, nunca todos (`journey-pulse.js:15`). Un toque demasiado seguido suena suave y deja marca gris (`interactions.js:35,68`).
4. **La Línea se lee.** Base a alfa .38 sobre franja negra (`journey-pulse.js:31,132`). Los pasos que cuentan crecen antes de llegar (`journey-pulse.js:138`). Un anillo se cierra sobre el cubo, sin agrandarlo (`journey-pulse.js:27-29`). En `13-lugar-faros.png` se ven los pasos 1·3·y.
5. **La ronda se cuenta en vivo, sin números.** Un tic al final de la Línea se enciende en dorado al pasar el umbral (`journey-pulse.js:141`, `places.js:84`). Usa el mismo cálculo que la tarjeta.
6. **Una tarjeta honesta.** «Ritmo · 74,6 % / 75 % a tiempo» y «A 0,4 de ★★» (`33-resultado.png`). Nunca redondea hacia arriba (`places.js:26,89`). Sin logros que distraigan (`places.js:167-168`).
7. **La calibración no castiga al que toca mal.** Solo fija el retraso si doce pulsos coinciden (`rhythm-calibration.js:6-19`).

## Lo que falta o salió mal

1. **En Jardín y Cueva, tocar al azar ya vale la mitad. (alta)** Siembra y Eco cuentan las ocho corcheas (`journey-rhythm.js:12,17`). Medida con Node, toques uniformes al azar sobre el compás: 53,4 % a tiempo en ambos; 44 % en Maestro. «A tiempo» da 26,7 % y los patrones de tres pasos, 20 %. Un jugador que toca corcheas regulares sin escuchar roza el 100 %. En esos dos lugares ★★ no dice «escuchaste».
2. **La Cueva cuenta como acierto el eco equivocado. (alta)** El juicio acepta cualquier corchea (`journey-rhythm.js:17`). Un paso fuera del patrón devuelve `'wrong'` en el juego (`journey-echo.js:53`). Pero ya se contó como acierto en la ronda (`journey-games.js:60`, `places.js:118`). También los toques durante la llamada de la cueva (`'wait'`, `journey-echo.js:52`). El porcentaje de la tarjeta no mide lo que el lugar pide.
3. **La racha sigue sin sonar. (media)** `playTheme` toca lo mismo con forma 0 que con forma 3 (`voices.js:188-191`). `cubeForm` no se lee fuera de su módulo. El «Cool» de PaRappa se siente primero con el oído.
4. **Tres rachas distintas. (media)** La forma pierde un nivel (`journey-pulse.js:15`). La Llanura vuelve a cero (`journey-stick.js:54`). Las chispas vuelven a cero y olvidan a los 4 s (`spark-rules.js:13`). Tres reglas para una sola idea.
5. **En contratiempo no hay «1». (media)** El dorado del «1» solo se pinta si el paso cuenta (`journey-pulse.js:138`). En Dunas y Lago (2·6·10·14) la Línea no tiene ancla (`11-lugar-dunas.png`). Tocar el «y» se aprende contra el «1» que no se toca.
6. **Los toques de la demostración cuentan. (media)** El lugar canta dos compases antes de pedir (`journey-rhythm.js:52-55`). Pero cada pulso de esos compases ya suma al total de la ronda (`places.js:118`). Quien prueba mientras escucha baja su porcentaje antes de empezar.
7. **Cerca de ★★, el botón grande dice «Seguir». (baja)** Con «A 0,4 de ★★», «Otra vez» queda a la derecha y en contorno (`estilo-j.css:694-696`, `33-resultado.png`). El reintento es lo que el jugador quiere en ese instante.
8. **La calibración no vuelve sola. (baja)** Hecha una vez, no mide de nuevo al cambiar de auriculares (`rhythm-calibration.js:16`). Solo desde Ajustes.
9. **Dorado fuera de las ★. (baja)** «5 / 11» lugares sale en dorado (`estilo-j.css:599`, `21-lugares.png`). D4 reserva el dorado para las ★.

## Contraste con la sesión 10

Notas 10 → 11: Visual 7 → 7, Audio 7,5 → —, Creatividad 8 → 8, Sensación 6,5 → 6,5, Cohesión 7 → 7,5, Pulido 7 → 7. Me abstuve en Audio porque no lo oí.

**Cerrado (comprobado):**
- Dedo fantasma: late en los pasos del lugar y en tiempo audible (`journey-hint.js:15-20`). Era mi hallazgo 1.
- La mirada ya no se divide tanto: anillo junto al cubo y Línea a alfa .38 (`journey-pulse.js:27-31`). Hallazgo 3, cerrado en parte: la Línea sigue en H·0,8.
- Cuenta en vivo hacia ★★: el tic dorado (`journey-pulse.js:141`). Hallazgo 6.
- El ajuste personal mueve también la luz y el cursor (`journey-pulse.js:40-42`). Mitad del hallazgo 7.
- La tarjeta ya no habla de logros (`33-resultado.png`). Hallazgo 8.

**Abierto:**
- Ventana proporcional en Siembra y Eco (hallazgo 2). Sigue en 53 %.
- La racha no suena (hallazgo 4).
- Tres rachas (hallazgo 5).
- La calibración no vuelve al cambiar de salida (mitad del hallazgo 7).

**Nuevo o visto ahora:**
- La Cueva cuenta los ecos equivocados (punto 2).
- Contratiempo sin ancla del «1» (punto 5). Lo trajo P3 al pintar el «1» solo cuando cuenta.
- Toques de la demostración en el total (punto 6).
- Dorado en el contador de lugares (punto 9).

Nada de lo que pedí empeoró.

## Qué haría ahora

1. **Ventana por hueco en Siembra y Eco.** En `journey-pulse.js:102`, limitar la ventana a un cuarto del hueco entre pasos que cuentan (±37 ms a 100 BPM en corcheas).
   Bien cuando: la simulación de toques al azar da ≤ 30 % en Jardín y Cueva a 90–130 BPM, y Llanura no cambia (±1 punto).
2. **La Cueva cuenta el eco, no la corchea.** En `journey-games.js:60`, pasar a `placeHear` el resultado del juego: `'wrong'` es fallo; `'wait'` en la llamada no cuenta.
   Bien cuando: una prueba de Node con un eco correcto y uno equivocado da 50 % en la ronda, y la llamada no suma al total.
3. **La demostración no cuenta.** En `places.js:118`, ignorar los pulsos mientras `rhythmSinging` o la demostración siguen activos.
   Bien cuando: diez toques fuera de tiempo durante los dos compases cantados dejan `run.total === 0`.
4. **La racha suena.** En `voices.js:190`, la forma del cubo decide cuántas notas acompañan: 0 → solo la nota, 1 → tercera, 2 → quinta, 3 → octava. Sin cambiar la música.
   Bien cuando: `playTheme` devuelve 1, 2, 3 y 4 notas para las formas 0–3, y un render con doce aciertos seguidos muestra la octava solo tras el duodécimo.
5. **El «1» como ancla tenue.** En `journey-pulse.js:138`, el paso 0 se pinta siempre en dorado tenue (alfa ≤ .35) cuando no cuenta.
   Bien cuando: en la captura de Dunas se ve el «1» y su brillo medido es menor que el de los pasos que cuentan.
