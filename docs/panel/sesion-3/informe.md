# Kubono · Panel creativo, tercera sesión

24 de octubre de 2026, tarde, sobre `main` (2.3.0-alpha.167, plan integrado H1–H7). Mismos diez perfiles **simulados**: no son sus opiniones reales. Juzgaron código, capturas de teléfono, bots y el modelo de dos horas. **Nadie salvo Jay ha jugado esta versión y nadie la ha oído en un teléfono.** Análisis completos: `3-01-mizuguchi.md` … `3-10-wintory.md`; capturas extra en `3-extra-*/`.

## 1. Notas

| Creador | Visual | Audio | Creatividad | Sensación | Cohesión | Pulido | Media (sesión 2) |
|---|---|---|---|---|---|---|---|
| Mizuguchi | 7 | 8,5 | 8,5 | 7,5 | 7,5 | 7 | 7,7 (7,3) |
| Iwai | 7 | 8,5 | 8 | 7 | 7 | 7 | 7,4 (7,1) |
| Matsuura | 7,5 | 8,5 | 8,5 | 7,5 | 7,5 | 7 | 7,8 (7,6) |
| Simogo | 7,5 | 8,5 | 8,5 | 7,5 | 7 | 7 | 7,7 (7,3) |
| Proteus | 7 | 8,5 | 7,5 | 7 | 6,5 | 7 | 7,3 (7,0) |
| Jenova Chen | 7,5 | 9 | 8,5 | 7,5 | 7 | 6,5 | 7,7 (7,1) |
| Roset | 7 | 8,5 | 8 | 7 | 7 | 6,5 | 7,3 (7,0) |
| Ken Wong | 7,5 | 8 | 8 | 7 | 7 | 7 | 7,4 (7,1) |
| Pope | 7 | 8 | 8 | 7 | 6,5 | 6,5 | 7,2 (6,9) |
| Wintory | 7,5 | 8,5 | 8,5 | 7,5 | 7,5 | 7 | 7,8 (7,3) |
| **Hoy** | **7,3** | **8,5** | **8,2** | **7,3** | **7,1** | **6,9** | **7,5** |
| Sesión 2 | 7,0 | 8,3 | 8,0 | 6,9 | 6,4 | 6,6 | 7,2 |
| Sesión 1 (22 oct) | 6,5 | 7,9 | 7,9 | 5,6 | 4,8 | 6,1 | 6,4 |
| Meta | 8,5 | 9 | 9 | 8,5 | 8,5 | 8,5 | 8,7 |

Todos suben. Lo que más subió: **Cohesión** (+0,7: orden de pistas, una sola canción, 0 ✦ fuera de tiempo) y **Sensación** (+0,4: calibración, oro siempre, Vibri). Lo que más falta para la meta: **Pulido** (−1,6), **Cohesión** (−1,4), **Sensación** y **Visual** (−1,2).

## 2. En qué coinciden

1. **H1–H7 fue en la dirección correcta.** Diez de diez: el muro de ★ cayó, el camino tiene orden, «Tu canción» por fin es la música del mundo y el sonido orienta (faro, chispa con paneo).
2. **Quedan restos que contradicen las decisiones de Jay (verificado en código):**
   - El narrador sigue hablando en avisos del Mundo libre (`achievements.js:14`) y justo después de los créditos (logros del Viaje como «Era el prólogo…», más un aviso a los 60 s sobre ✦ en `journey-finale.js:63`). Jay pidió el narrador solo en la tarjeta y la Bitácora (Chen, Proteus, Roset).
   - Quedan rótulos «Rompe…» en `index.html` (líneas 54, 198, 216, 231) (Roset).
   - La tarjeta sigue diciendo «Ritmo: X % a tiempo (85 %)» y el narrador «Ochenta y cinco por ciento» (`narrator.js:49`) (Matsuura, Pope).
3. **El cubo y el color todavía no se leen en el teléfono:**
   - En el Camino el cubo sigue midiendo **6 px**: el aumento solo actúa en el mundo (`render.js:111,186`) (Ken Wong).
   - El color ganado ocupa solo el 5–9 % de los píxeles del anillo (Mizuguchi, Roset).
   - La columna dorada solo se dibuja con el portal casi en pantalla; a 1 500 px desaparece (`places-ring.js:59`) (Chen, Ken Wong, Proteus).
4. **El final de las 11 ★ tiene huecos (Simogo, Wintory):**
   - Lee las notas de `S.lugares.notes` y no las de los capítulos del Viaje (`S.journey.notes`): sin repetirlos, suenan notas de 6 lugares, no de 11.
   - Las notas se guardan sin ritmo y quizá fuera de la escala del mundo.
   - El tema del cubo ya suena en la capa de Faros durante todo el final, así que «su momento» no sorprende.
   - Dura 55–70 s (menos de 60 a tempo rápido; el plan decía 60–90).
5. **El acierto aún no cae en un solo instante (Mizuguchi, Matsuura).** El brillo y la vibración salen al tocar; la nota, en el tiempo. La Línea sigue fija: no anticipa lo que viene.
6. **El modelo se aprueba con trampa (Chen).** La regla de 12 min se cumple solo porque cuenta las compras como novedad. Sin ellas, el jugador del 60–75 % pasa 80–85 min sin que crezca su canción tras ganar.
7. **El menú sigue largo (Pope).** 15 entradas visibles en el Mundo libre, y «Lugares» no está en el menú.

## 3. Decisiones pendientes de Jay

| | Opinión del panel |
|---|---|
| **Umbral de ★★** | **Diez de diez lo quieren por debajo del 85 %.** Seis piden un **75 % fijo**, que se lee mejor (Mizuguchi, Simogo, Wintory, Ken Wong, Pope, Roset). Cuatro prefieren **«mejorar tu marca»** con el 75 % como camino fijo (Iwai, Proteus, Matsuura, Chen; Chen: +10 puntos con suelo del 60 %). Wintory y Pope bajarían también ★★★ (70–75 %). |
| **Festival** | **Diez de diez: solo el Viaje.** Pero hoy `?festival=1` acaba en el Lago (`festival.js:5`, unos 7 min). Mizuguchi y Chen piden el Viaje entero, con la Tormenta y el final del Refugio. Iwai añadiría un minuto de Libre sin cifras. |

**Mi recomendación:** ★★ al **75 %** (y ★★★ al 70 % en Maestro), con el texto de la tarjeta en palabras, no en cifras. Festival: **el Viaje entero hasta los créditos**, sin anillo, tienda ni remezcla.

## 4. Plan: qué hacer y cómo

Cada fase en su rama, como siempre. Primero lo que no necesita decisión.

### I1 · Coherencia (sin decisión, ~½ día)
- Narrador fuera de los avisos del Mundo libre y de después de los créditos: logros del Viaje a la Bitácora, sin aviso de ✦ a los 60 s (`achievements.js`, `journey-finale.js`).
- Quitar «Rompe…» de `index.html`.
- Tarjeta y narrador sin cifras de umbral (`places.js:98`, `narrator.js:49`).
- *Bien cuando:* tras los créditos no aparece ningún texto hasta el primer portal.

### I2 · Que se vea (Ken Wong, Mizuguchi, Roset)
- Cubo de 24–36 px también en el Camino y en los lugares (`render.js`).
- El color ganado lava toda la pantalla al 18 % (`world-sheet.js:34`); los glifos del bioma recuperado usan su color.
- Columna dorada visible desde lejos, pegada al borde, en lugar de la flecha (`places-ring.js:57-61`).
- *Bien cuando:* en una captura de teléfono el color ocupa ≥ 20 % de los píxeles y la columna se ve desde el Refugio.

### I3 · Un solo instante (Mizuguchi, Matsuura)
- Brillo, vibración y un pequeño golpe de cámara se programan para el instante en que suena la nota (`journey-pulse.js:81`, `interactions.js:50`).
- La Línea muestra los pasos que vienen hacia el cursor.
- La calibración solo mide sobre las negras y nunca durante el canto del lugar (`journey-pulse.js:68`).

### I4 · El final que respira (Simogo, Wintory)
- Notas de los 11 lugares, Viaje incluido, con grado y ritmo, tocadas en la escala actual (`places.js:90`, `song-stage.js`).
- Faros calla el tema hasta su momento; un compás de silencio; el tema en el chelo dos veces (la segunda una quinta arriba) y un ritardando. Créditos al final. Mínimo 60 s.
- *Bien cuando:* Jay lo oye en un teléfono y el tema llega como sorpresa.

### I5 · Decisiones de Jay aplicadas
- Umbral de ★★ elegido (`places.js:20,25`), con el modelo actualizado.
- `?festival=1` hasta el final del Viaje (`festival.js`).

### I6 · Menos ruido y modelo honesto (Pope, Chen)
- Menú de 6 entradas (Camino/Mundo, Lugares, Refugio, Tu cubo, Sonido, Ajustes) y un «Más» plegado, con los mismos ID y un ayudante común para las ~30 pruebas.
- `scripts/play-curve.mjs`: sacar las compras de la regla de 12 min y añadir abandono y un perfil sin sonido.

### Ideas para más adelante (no hay consenso)
- Libre que no se acaba y «Tu canción» que se toca, capa a capa (Iwai).
- El anillo como acorde: hasta 4 portales sonando a la vez desde su dirección (Proteus).
- Pasar de un lugar al siguiente sin tarjeta; clímax en Ruinas y coda en la Cueva (Simogo).

## 5. Lo que ningún panel puede sustituir

Jugarlo con Luca y oírlo en un teléfono con auriculares. Sin eso no sabemos si la calibración, el paneo, el faro sonoro y el final funcionan de verdad.
