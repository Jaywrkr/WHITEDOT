# Kubono · Panel creativo, sesión 10 (revisión desde cero)

- **Fecha:** 26 de octubre de 2026.
- **Versión:** 2.3.0-alpha.207 (commit `2e7f9d1`, rama `review-codex`).
- **Panel:** doce perfiles simulados. Son simulaciones de una mirada de diseño a partir de obra pública. **No son opiniones reales** de esas personas.
- **Memoria borrada:** nadie recuerda sesiones, notas ni planes anteriores. Se puntúa lo que hay hoy.
- **Límite:** nadie ha jugado con las manos. Nadie ha oído el audio en un teléfono. Lo que se dice del sonido y del tacto sale del código, de las capturas y del modelo `scripts/play-curve.mjs` (jugadores simulados, no personas).
- **Coordina:** Lucas Pope (simulado).

---

## 1. Quiénes revisaron

| # | Perfil (simulado) | Lente |
|---|---|---|
| 01 | Tetsuya Mizuguchi | Sinestesia: luz, tacto y sonido en el mismo instante |
| 02 | Toshio Iwai | El juego como instrumento; libertad para hacer música |
| 03 | Masaya Matsuura | Juego de ritmo: guía, juicio, racha |
| 04 | Simogo | El juego como un disco: secuencia, cierres, final |
| 05 | Ed Key y David Kanaga (Proteus) | Mundo que suena; explorar sin reloj |
| 06 | Jenova Chen | Curva emocional, flow y atención |
| 07 | Conrad Roset | Color, ilustración, composición |
| 08 | Ken Wong | Láminas sin palabras; enseñar sin texto |
| 09 | Lucas Pope | Reglas contables, sistemas, coherencia (coordina) |
| 10 | Austin Wintory | Tema musical, silencios, finales |
| 11 | **Celia Hodent** (nueva) | Menús: jerarquía, nombres, toques, accesibilidad |
| 12 | **Harry Nesbitt** (nuevo) | Detalle visual: retícula, estados, recortes, formatos |

---

## 2. Notas

Copiadas tal cual de cada análisis.

| Perfil | Visual | Audio | Creatividad | Sensación | Cohesión | Pulido | Media |
|---|---|---|---|---|---|---|---|
| 01 Mizuguchi | 6,5 | 7 | 7 | 5,5 | 6 | 6,5 | 6,4 |
| 02 Iwai | 7 | 7,5 | 5 | 6,5 | 7,5 | 7 | 6,75 |
| 03 Matsuura | 7 | 7,5 | 8 | 6,5 | 7 | 7 | 7,2 |
| 04 Simogo | 7 | 7,5 | 8 | 6,5 | 7 | 6,5 | 7,1 |
| 05 Proteus | 6,5 | 7 | 7,5 | 6 | 6 | 6,5 | 6,6 |
| 06 Chen | 7 | 7,5 | 8 | 6,5 | 7,5 | 7 | 7,25 |
| 07 Roset | 6,5 | 7 | 7,5 | 6 | 6 | 6,5 | 6,6 |
| 08 Wong | 7 | 7 | 8 | 6,5 | 6,5 | 6,5 | 6,9 |
| 09 Pope | 7 | 7 | 7,5 | 6 | 4,5 | 6 | 6,3 |
| 10 Wintory | 7 | 6,5 | 8 | 6,5 | 7 | 6,5 | 6,9 |
| 11 Hodent | 7 | 6,5 | 7,5 | 6 | 6 | 6 | 6,5 |
| 12 Nesbitt | 7 | 6,5 | 7,5 | 6 | 6 | 5,5 | 6,4 |
| **Panel** | **6,9** | **7,0** | **7,5** | **6,2** | **6,4** | **6,5** | **6,7** |
| Meta | 8,5 | 9 | 9 | 8,5 | 8,5 | 8,5 | 8,7 |
| Distancia | −1,6 | −2,0 | −1,5 | −2,3 | −2,1 | −2,0 | −2,0 |

Notas propias de las dos lentes nuevas:

| Lente | Nota |
|---|---|
| Menús (Hodent) | **5,5 / 10** |
| Detalle visual (Nesbitt) | **5,5 / 10** |

**Lo más lejos de la meta es la Sensación (6,2; faltan 2,3).** Le siguen Cohesión (6,4) y Pulido (6,5). La Sensación se puntuó sin manos: es la nota más incierta del panel.

---

## 3. Qué es Kubono hoy, en cinco frases

1. Kubono es un juego musical con un solo gesto: tocar a tiempo con un cubo pequeño sobre negro.
2. Nada suena mal: fuera de tiempo, el toque cae en la rejilla; a tiempo, toca la nota siguiente del tema del cubo.
3. El Viaje enseña cinco variaciones del gesto en cinco capítulos con arco claro, de la Llanura al Vacío.
4. Después, once lugares en anillo dan estrellas, y cada estrella suma una capa a Tu canción.
5. Alrededor creció un segundo juego de exploración, colección y contadores que hoy tapa al primero.

---

## 4. Lo que funciona (consenso)

- **El acierto aterriza cuando se oye.** Brillo, golpe del cubo y vibración esperan al sonido (`journey-pulse.js:66-70`). Lo dicen 8 de 12.
- **Nada suena mal.** El toque fuera de tiempo se coloca en la rejilla y en la escala (`interactions.js:53`).
- **El jugador toca el tema.** Cada acierto da la nota siguiente (`journey-pulse.js:6`, `:96`). Tus notas vuelven en el final.
- **El Viaje tiene arco.** Llegada, Pertenencia y Plenitud; clímax en la Tormenta; silencio en el Vacío (`journey-chapters.js:12-20`).
- **Tu canción se lee sin palabras.** Once anillos: los ganados en color, los que faltan punteados (captura `22-cancion`).
- **El botón principal del menú.** «Seguir hacia Jardín» es claro y dice lo mismo en todas las hojas (`controls.js:14`).
- **La tarjeta es honesta.** «74,6 % / 75 %» redondea hacia abajo y nunca regala una estrella (`places.js:24`).
- **Láminas buenas.** El Camino (`00-inicio`), el Faro (`13`) y el Vacío (`05`) están bien compuestos.
- **Accesibilidad de base.** Foco atrapado, Escape y botones de 44 px (`accessibility.js`).

---

## 5. En qué coinciden

Ordenado por gravedad. Cada cita `archivo:línea` marcada con ✔ la comprobé yo en el código.

1. **El ritmo se enseña lejos del cubo y casi no se ve.**
   - Quién: Matsuura, Wong, Mizuguchi, Nesbitt, Chen, Iwai.
   - Prueba: la Línea está en `H*.8` (y = 675) y el cubo en y = 422 ✔ `journey-pulse.js:116`. Su trazo va a alfa 0,16 ✔ `:117`. El «1» se pinta blanco aunque el comentario dice dorado ✔ `:123`. Las marcas de capítulo miden 3 px ✔ `journey-chapters.js:166`. Wong midió un contraste de 1,45:1.
2. **El dedo fantasma parece un objeto y enseña el ritmo equivocado.**
   - Quién: Matsuura, Wong, Iwai, Nesbitt, Roset.
   - Prueba: disco gris de 26 px, 17 veces el área del cubo ✔ `journey-hint.js:21`. Siempre en (320, 478) ✔ `:7`. Late con el pulso de la música (`MU.bq`) y el reloj crudo (`ac.currentTime`), no con el ritmo del lugar ✔ `:19`. En Lago, Dunas y Faros marca justo lo que no cuenta.
3. **El toque se siente tarde o no se oye.**
   - Quién: Mizuguchi, Iwai, Wong, Matsuura.
   - Prueba: solo un toque a ≤ 24 px del cubo suena al apoyar el dedo ✔ `canvas.js:42`. El resto suena al levantarlo ✔ `canvas.js:66`. Dos toques a menos de 240 ms: el segundo se descarta sin sonido ✔ `interactions.js:33`. La calibración corrige el juicio, pero no la luz ni el cursor ✔ `journey-pulse.js:27`, `:40`.
   - Además, tres órdenes distintas: «Toca el cubo al ritmo» ✔ `index.html:216`, «Toca un espacio vacío» ✔ `onboarding-model.js:7`, y el dedo fantasma toca el vacío.
4. **Quien acierta el 60 % deja de crecer al ganar.**
   - Quién: Chen, Iwai, Pope, Matsuura.
   - Prueba: lo ejecuté. `play-curve.mjs`: perfil 60 %, victoria a los 39,9 min y **80,1 min sin capas nuevas**. Sin sonido, 81,8 min. Maestro exige ★★ antes ✔ `places.js:90`. Tras la victoria, el objetivo dice «Explora a tu ritmo» aunque falten 22 ★ ✔ `places.js:70`. No hay cuenta en vivo durante la ronda: el 74,6 % se descubre al final.
5. **La tarjeta de resultado corta la música y mete ruido.**
   - Quién: Simogo, Matsuura, Proteus, Chen, Pope, Wong.
   - Prueba: sale a los 1200 ms fijos y corta la caída de dos compases ✔ `places.js:122`. «8 logros nuevos · En la Bitácora» comparte tarjeta con las estrellas (captura `33-resultado`). Tras la ronda 11, el gran final espera a que pulses «Salir» ✔ `places.js:135-137`.
6. **El menú esconde lo central y tiene un botón que no hace nada.**
   - Quién: Hodent, Pope, Nesbitt, Wong, Wintory.
   - Prueba: «Explorar», ya en el Mundo libre, solo cierra el menú ✔ `controls.js:17`, `:26`. Lugares vive plegado en «Más» ✔ `index.html:157`. En vista tranquila desaparecen Lugares, Tu cubo y Bitácora ✔ `estilo-j.css:540`. El volumen está a 3 toques y «Sonido» cierra Ajustes sin regreso ✔ `controls.js:38`. La cuenta dice «Entra en tu cuenta para jugar.» ✔ `cloud-account.js:9`, y la cuenta es opcional.
7. **Demasiados contadores para un verbo.**
   - Quién: Pope, Proteus, Hodent.
   - Prueba: más de veinte contadores visibles. «Estrellas» de la Constelación cuenta reliquias, no ★ ✔ `sharing.js:23`. Las salas del Refugio se abren por días ✔ `house-model.js:3`, `:21`. Una ronda da «8 logros nuevos» (`33-resultado`).
8. **El color ganado casi no se ve.**
   - Quién: Roset, Mizuguchi, Simogo, Chen, Wong.
   - Prueba: Roset midió que 10 de 11 capturas de juego tienen menos del 0,5 % de píxeles con color. El color recuperado es un velo plano de alfa 0,11–0,15 ✔ `world-sheet.js:36`. Pasa del gris al color en menos de un segundo ✔ `world-sheet.js:26`. Portales y marcas usan el mismo oro, no el color del lugar ✔ `places-ring.js:63`, `journey-chapters.js:166`. En daltonismo, tres pares de lugares repiten color ✔ `color-safe.js:4-5`.
9. **El gran final entierra lo tuyo.**
   - Quién: Wintory, Simogo, Chen.
   - Prueba: tu frase suena con `lead` a 0,035, la voz más baja de la canción ✔ `song.js:69`, `song-stage.js:64`. La victoria de una ronda suena siempre como ★★ ✔ `journey-victory.js:24`. El silencio lleva rótulo: «Espacio antes del tema.» ✔ `song-stage.js:40`. Con ★, cada capa suena a medias, y el jugador del 60 % oye un final de fragmentos.
10. **Detalle de pantalla sin cerrar.**
    - Quién: Nesbitt, Hodent, Pope, Roset.
    - Prueba: «diagnóstic/o» partido por `overflow-wrap:anywhere` ✔ `estilo-j.css:424`. La hoja Lugares abre con una fila cortada ✔ `refugio-lugares.js:64`. «Ajustes» huérfano en vista tranquila ✔ `estilo-j.css:659` (captura `tel-viaje-menu`). El Refugio se pisa en horizontal y en teléfono (capturas). Una carta muestra «Laboratorio» al jugador ✔ `rare-cards.js:81`. Dorado en instrucciones del Refugio ✔ `house-capsules.js:113`.

**Citas que no se sostienen o hay que matizar:**
- Mi propio análisis dice «un fallo no suena» (`journey-pulse.js:104`). **No es así:** el fallo no toca el tema, pero sí suena cuantizado (`interactions.js:53`, `runtime.soon`). Lo retiro.
- Iwai dice que el límite entre toques es 240 ms. Es el valor por defecto. En ritmos con corcheas seguidas baja a dos tercios de corchea (`journey-rhythm.js:47`). El hallazgo se mantiene.
- La pantalla de victoria «sin sonido» llega a los 38,2 min, no a los 38,3. Diferencia irrelevante.

---

## 6. Decisiones que necesitan a Jay

Todo lo demás del plan no necesita decisión. Ninguna opción toca el tamaño del cubo, la generación musical, los umbrales ni el progreso guardado.

### D1 · El jugador que no llega al 75 %

Hoy gana a los 40 min y pasa 80 sin oír crecer su canción.

| Opción | Qué es |
|---|---|
| A | No hacer nada. |
| B | La capa de cada lugar se alarga con tu **mejor porcentaje** (ya guardado en `best[id].onTime`). Por ejemplo: medio fragmento al 60 %, tres cuartos al 67 %, entera con ★★. Los umbrales no cambian. |
| C | Completar con ≥ 40 % da una variación audible de la capa (otra octava u otro timbre). |
| D | Bajar el umbral de ★★. Descartado: Jay ya lo fijó. |

- **Opinión del panel:** Chen propone B; Iwai propone C; Pope y Matsuura piden además ver el progreso durante la ronda.
- **Recomendación: B**, junto con un objetivo tras la victoria que señale el lugar más cercano a ★★ («Lago · 74,6 %»). B premia la mejora real y usa un dato que ya existe. No cambia cómo suena una capa entera; solo cuánto de ella suena.

### D2 · Dónde se toca y cuándo suena

| Opción | Qué es |
|---|---|
| A | Tocar **donde sea**. Durante el Camino y los capítulos, el pulso suena al apoyar el dedo en todo el lienzo. Si el dedo se arrastra, se camina igual. |
| B | Tocar **el cubo**. La zona táctil del cubo crece de 24 a unos 64 px (el cubo no crece). El vacío sigue sonando al soltar. |
| C | Dejarlo como está y solo alinear los textos. |

- **Opinión del panel:** Mizuguchi pide A; Wong pide una sola orden, cualquiera; Iwai pide que ningún toque quede mudo.
- **Recomendación: A.** Es lo que ya enseña el dedo fantasma. Los textos pasan a decir lo mismo: «Toca al ritmo. Arrastra para moverte.».

### D3 · Contadores, logros y Refugio

| Opción | Qué es |
|---|---|
| A | Podar la vista completa a tres cifras (★ de 33, ✦, lugares de 11). Lo demás pasa a «Tú» en la Bitácora. |
| B | Además, el Refugio abre sus salas por lugares completos o por ★, no por días. Las salas ya abiertas se quedan abiertas. |
| C | Además, retirar logros de tiempo y distancia. |

- **Opinión del panel:** Pope pide A, B y C. Proteus y Hodent apoyan A.
- **Recomendación: A + B.** De C, solo mostrar como mucho un logro por tarjeta y no crear logros nuevos de tiempo o distancia. No retirar ninguno ganado: «nada ganado se borra».

### D4 · Colores fuera de la regla blanco y dorado

| Caso | Recomendación |
|---|---|
| Portales, marcas de capítulo y mapa usan oro genérico | Pasar al **color del lugar** cuando está completo. El dorado queda para las estrellas. |
| Llama roja de la Cueva | Mantenerla como color del bioma. Los cuadros del eco pasan a blanco y dorado. |
| Píldora roja de «Grabar» | Pasar a blanco con un punto que parpadea. |
| «Laboratorio» en cian | No mostrarlo al jugador (no requiere decisión; va en P1). |

- **Opinión del panel:** Roset pide color de lugar en todo el mundo. Nesbitt pide paleta cerrada.
- **Recomendación:** la de la tabla. El color se gana y viaja contigo; la interfaz sigue en blanco y dorado.

### D5 · El gran final

| Opción | Qué es |
|---|---|
| A | La ronda que completa los once **desemboca sola** en el final, sin tarjeta delante. |
| B | Durante tu frase y la primera vuelta del tema, callan las capas salvo colchón y bajo. Tu frase suena con la voz suave del final del Viaje. Es un arreglo de entradas; la música del Mundo no se toca. |
| C | Créditos de autoría una sola vez, en el final de once. El final del Viaje dice solo «Tu mundo se abrió». |

- **Opinión del panel:** Wintory pide B; Simogo pide A y C; Chen apoya A.
- **Recomendación: A + B + C.** Jay oye el resultado antes de integrar, con los renders de audio.

### D6 · La cuenta mientras Supabase está en pausa

- Opciones: A, ocultar «Crear cuenta» y «Eliminar cuenta» hasta que haya servicio; B, dejarlos.
- **Recomendación: A.** El texto «para jugar» se corrige igual en P2, sin decisión.

---

## 7. Plan por fases

Reglas para todas las fases:
- Cada fase en su rama. Commit y push solo a la rama. Jay crea el PR.
- Se conservan **todos los ID de HTML**, la música, el cubo pequeño, los mapas, las semillas y los guardados.
- Módulo nuevo: una vez en `SHELL` de `sw.js`. Contenido nuevo: `hashKey`, nunca el RNG antiguo.
- Antes del push: `node scripts/release-audit.mjs`, `npm test` y los recorridos de navegador del sistema tocado. Si cambia el sonido, sus renders.
- Primero van las fases que no necesitan decisión (P1–P5). P6–P8 esperan a Jay.

### P1 · Pantallas limpias

- **Rama:** `panel10/p1-pantallas-limpias`
- **Depende de:** `main`.
- **Qué cambia** (lista de Nesbitt, prioridad alta y media):
  - Cortes de palabra: `overflow-wrap:break-word` y `hyphens:auto` (`styles/estilo-j.css:424`). (#2)
  - Lugares abre alineada a una fila entera (`src/refugio-lugares.js:64`). (#3)
  - Columna dorada del borde: solo a la altura del rumbo y con degradado (`src/places-ring.js`, `edgeColumn`). (#4)
  - Refugio: la burbuja de la Voz baja bajo y = 120; rótulos medidos con `measureText`; encaje en horizontal (`src/house.js:80`, `src/house-view.js`, `styles/game.css`). (#1, #20, #21)
  - Cabecera del menú en horizontal y pie cortado en escritorio (`styles/estilo-j.css`, `.menu-sheet`). (#30, #31)
  - Filas de botones con la misma altura (`.row{align-items:stretch}`; primario a todo el ancho). (#9, #10)
  - «Otra vez» no aparece enfocado al abrir Tu canción (enfocar el título). (#15)
  - «Laboratorio» y su código no se muestran al jugador (`src/rare-cards.js:81`). (#26)
  - Separador colgante en Mapa y cita partida en Lugares (`src/atlas.js`, `src/refugio-lugares.js:63`). (#14, #35)
- **No se toca:** música, cubo, guardados, estructura del menú (eso es P2).
- **Bien cuando:**
  - En las 24 capturas `hor-*` y `esc-*`, ningún texto se pisa ni se corta en el borde.
  - Ninguna palabra se parte sin guion; «diagnóstico» y «v2.3.0-alpha.207» salen enteros.
  - Lugares abre sin fila cortada en los tres tamaños.
  - Los botones de una misma fila miden lo mismo (±1 px).
- **Vigila:** Nesbitt.
- **Tamaño:** media.

### P2 · Menús

- **Rama:** `panel10/p2-menus`
- **Depende de:** P1 (comparten `styles/estilo-j.css`).
- **Qué cambia** (estructura de Hodent; se reordena, no se añade):
  - Primera fila: **Lugares, Tu cubo, Refugio, Bitácora** (`#bLugares`, `#bCube`, `#bStudio`, `#bAch`). Las utilidades **Ajustes** y **Cómo jugar** siempre visibles.
  - Cabecera del menú con ★ n/33 primero, en dorado (`#menuSummary`, `src/controls.js`).
  - «Más» se abre siempre cerrado. Dentro: Ir (`#bWorld`, `#bJumpBack` → «Volver al punto anterior», `#bWorlds` → «Viajar a otra tierra»), Crear (`#bTools`, `#bRecord` → «Grabar 60 s», `#bShare`) y Tú (`#bJourneyMode`, `#bConnection`, `#bSaveTools`, `#pwaUpdate`).
  - `#bWorld` se oculta cuando no hace nada. `#bPrimary` deja de moverse a «Ayuda y cuenta» (`src/ui.js:29`).
  - Vista tranquila: Lugares y Bitácora siguen visibles, sin números. Los rótulos sin entradas se ocultan.
  - Una palabra por concepto: «Lugares» solo para los once; «Favoritos» para `#era` y `#bMap`; «Explorar» solo para entrar al Mundo.
  - Ajustes empieza con el volumen y se ordena en tres bloques: Sonido y tiempo; Ver y sentir; Partida (con «Empezar de cero» al final, separado). «Sonido» vuelve a Ajustes al cerrar (`src/controls.js:38`, `:50`). Se borra o recupera `rMenuVolume` (`:47-48`).
  - Botón inferior de cierre: «Cerrar» en todas las hojas.
  - Cuenta: «Opcional. Se juega sin cuenta.» (`src/cloud-account.js:9`). Ocultar crear y eliminar cuenta solo si Jay elige D6-A.
  - Pestañas de Bitácora con `role="tab"` y `aria-selected`. Texto mínimo de 12 px; `.spark-goal` y `.spark-power button` a 44 px.
  - Retícula que no deja huecos al ocultar botones (Nesbitt #5–#8, #11, #17, #32, #33).
- **No se toca:** ningún ID de HTML; menús silenciosos; música; cubo; guardados. Las pruebas que abren «Más» por atributo siguen funcionando.
- **Bien cuando:**
  - En ambas vistas: seguir, ver ★, abrir Lugares y abrir Bitácora en **≤ 2 toques**; tienda y volumen en **≤ 3**.
  - Una prueba recorre todos los `#mMenu button` visibles y cada uno abre algo o cambia el estado.
  - Con «Más» cerrado, el menú cabe sin desplazar en 390×844, 844×390 y 1280×800.
  - Ningún rótulo de sección vacío. Todos los cierres inferiores dicen «Cerrar». La hoja de Cuenta no dice «para jugar».
- **Vigila:** Hodent (con Nesbitt para la retícula).
- **Tamaño:** grande.

### P3 · El golpe junto al cubo

- **Rama:** `panel10/p3-golpe-en-el-cubo`
- **Depende de:** `main`.
- **Qué cambia:**
  - Dedo fantasma: anillo fino de 1 px con punto central de 3 px que nace junto al cubo (`src/journey-hint.js:7`, `:21`).
  - El dedo marca **los pasos del lugar** (`journeyRhythmState().steps`) en el **tiempo audible** (`audibleTime`), no el pulso crudo (`journey-hint.js:19`).
  - Un anillo fino alrededor del cubo se cierra en los cuatro pasos previos a cada paso que cuenta, dorado en el «1» (`src/journey-pulse.js`, `drawForm`; `src/render.js:126-127`). El cubo no crece.
  - Línea más visible: base a alfa ≈ 0,3 con fondo negro detrás; el «1» en dorado cuando cuenta (`journey-pulse.js:117`, `:123`).
  - Marcas de capítulo a 4 px y ocultas fuera de los capítulos (`src/journey-chapters.js:165-166`).
  - Las chispas doradas vuelan a la posición real de la barra, no a `barY=42` (diez juegos, p. ej. `src/journey-stick.js:90`).
- **No se toca:** tamaño del cubo (`render.js:186-188`), música, ventana de ±80 ms, umbrales.
- **Bien cuando:**
  - En `00-inicio`, ninguna pista supera el área de la caja del cubo (14×14 px) en reposo y su centro está a ≤ 30 px del cubo.
  - Prueba de unidad en Dunas: el dedo late en los pasos 2·6·10·14 y en ninguno múltiplo de 4. Con `outputLatency = 0,2`, el pico cae 200 ms después.
  - La Línea medida en captura da ≥ (90,90,90). El tamaño del cubo (`s`) no cambia.
  - El último cuadro del vuelo dorado cae a ≤ 4 px de la barra en los tres tamaños.
- **Vigila:** Matsuura y Wong.
- **Tamaño:** media.

### P4 · El cierre de la ronda

- **Rama:** `panel10/p4-cierre-de-ronda`
- **Depende de:** `main`.
- **Qué cambia:**
  - La tarjeta espera el fin de la caída que devuelve `journeyVictory` (`src/places.js:122`).
  - Los logros nuevos salen de la tarjeta y van solo a la Bitácora (`src/places.js:134`, `src/achievements.js:10`).
  - Entre 70 % y 74,9 %: «A 0,4 de ★★» y «Otra vez» junto a «Seguir hacia» (`places.js:128-137`).
  - Una cuenta en vivo durante la ronda, sin texto nuevo: un tic en la Línea que se enciende al pasar el 75 % (`journey-pulse.js`, datos de `placeRun()`).
  - Tras la victoria, el objetivo y la columna dorada apuntan al lugar sin ★★ con mejor porcentaje (`places.js:70`, `places-ring.js:28`). Con 33 ★ vuelve «Explora a tu ritmo».
- **No se toca:** umbrales (75 % y 70 %), redondeo hacia abajo, música, guardados.
- **Bien cuando:**
  - La tarjeta nunca aparece antes de `journeyVictoryState().end`.
  - La captura de resultado no muestra ninguna línea de logros.
  - En `?lugar=jardin`, el tic en vivo coincide con el % final en 10 de 10 rondas de prueba.
  - Con 11 ★ y menos de 33, el objetivo nombra un lugar y `ringState().next` no es null.
- **Vigila:** Chen y Pope.
- **Tamaño:** media.

### P5 · Un solo reloj

- **Rama:** `panel10/p5-un-solo-reloj`
- **Depende de:** P3 (comparten `journey-pulse.js` y `journey-hint.js`).
- **Qué cambia:**
  - Los temporizadores de luz que usan `ac.currentTime` crudo pasan a `scheduleAudibleCue` o `audibleTime` (lista de Mizuguchi: `journey-moments.js:31`, `ambience.js:15`, `glass.js:47`, `landmarks.js:55`, `initiative.js:32`, `journey-echo.js:40`, `journey-victory.js:17`, `feedback.js`, `render.js:360` y vecinos).
  - La calibración mueve también la luz y el cursor de la Línea (`journey-pulse.js:24`, `:27`).
  - Un golpe, una imagen: el cubo no engorda al tocar y otra vez al oírse (`interactions.js:48-50`).
  - Ningún toque mudo: el toque demasiado seguido suena suave en la siguiente semicorchea, con el límite de 4 por paso (`interactions.js:33`).
- **No se toca:** la generación musical, las voces, la mezcla, la ventana de juicio.
- **Bien cuando:**
  - `grep -rnE "currentTime" src | grep "\*1000" | grep -v "outputLatency\|landDelay"` da 0 líneas.
  - Con `outputLatency = 0,25` simulado, cada brillo cae ≤ 20 ms después de su nota.
  - Con `latencyNudge = 0,15`, el cursor cruza el paso 0 en el mismo fotograma (±16 ms) que suena su bombo.
  - Diez toques a 8 Hz programan diez sonidos, nunca más de 4 por semicorchea.
  - Renders de audio sin cambios fuera de esos toques.
- **Vigila:** Mizuguchi.
- **Tamaño:** grande.

### P6 · Tocar donde sea y Tu canción para todos

- **Rama:** `panel10/p6-tu-cancion`
- **Depende de:** P4 y P5. **Necesita D1, D2 y D5.**
- **Qué cambia:**
  - D2-A: en Camino y capítulos el pulso suena al apoyar el dedo en todo el lienzo; arrastrar sigue caminando (`src/canvas.js:42`, `:66`). Textos alineados: `index.html:216`, `src/onboarding-model.js:7`, `src/voice-guide.js:25`.
  - D1-B: la capa crece con el mejor porcentaje (`src/song.js:35`, `src/song-stage.js:73`). Nuevo evento «crece» en `scripts/play-curve.mjs`.
  - La victoria de ronda suena al nivel ganado, no siempre ★★ (`src/journey-victory.js:24`).
  - D5: la ronda 11 desemboca en el final (`places.js:122`, `song-stage.js:123`); tu frase con la voz suave del Viaje y capas en pausa durante tu frase y la primera vuelta del tema (`song-stage.js:64`, `stageEvents`); créditos una sola vez (`journey-finale.js:16`, `song-stage.js:21-22`).
  - Sin rótulo en el compás de silencio (`song-stage.js:40`).
  - En el anillo de Tu canción, ★, ★★ y ★★★ se distinguen por saturación (`song-stage.js:26-31`).
- **No se toca:** umbrales, generación, armonías, mezcla del Mundo, notas guardadas.
- **Bien cuando:**
  - En play-curve, el perfil 60 % cumple «sin nuevas capas ≤ 12 min» hasta el minuto 120.
  - Una ronda de ★ programa la mitad de compases que una de ★★.
  - En los compases de tu frase, tus notas son ≥ 40 % de los eventos; en el compás del tema, los eventos ajenos bajan a ≤ 8.
  - `stageCaption(plan, silenceAt*16).text === ''`.
  - Tras la última ★ que completa los once, el final empieza sin pulsar nada.
  - Prueba con puntero: entre `pointerdown` y la nota pasan ≤ 15 ms + `outputLatency` en el 95 % de los toques.
  - Renders de audio del final escuchados por Jay.
- **Vigila:** Wintory y Chen (Mizuguchi para el toque).
- **Tamaño:** grande.

### P7 · El color se gana y se ve

- **Rama:** `panel10/p7-color-ganado`
- **Depende de:** P3 (comparten marcas de capítulo y dibujo del mundo). **Necesita D4.**
- **Qué cambia:**
  - Portales completos, marcas de capítulo y mapa con el color del lugar (`places-ring.js:62-64`, `journey-chapters.js:166`). Dorado solo para ★.
  - Pigmento en las formas, no velo plano (`world-sheet.js:36`).
  - El momento de recuperar el color dura un compás (2–3 s) y se abre desde el cubo (`world-sheet.js:22`, `:26`).
  - Menos textura en Lago, Dunas y Ruinas. Los caminantes que parecen letras bajan de brillo durante el Viaje (`walker-forms.js`, `world-fauna.js`).
  - «Pulso» deja de escribirse en el Camino del Viaje (`crystal-sparks.js:157`).
  - Daltonismo sin colores repetidos (`color-safe.js:4-5`).
  - Cuadros del eco de la Cueva en blanco y dorado; píldora de grabación en blanco; dorado del Refugio solo para lo conseguido (`journey-echo.js:55`, `house-capsules.js:113`).
- **No se toca:** tamaño del cubo, semillas, posiciones, mapas, música.
- **Bien cuando:**
  - Tras el Viaje, una captura del anillo muestra al menos 5 tonos de `LANDSCAPES`; ningún portal completo sigue en `#f0d27a`.
  - En un bioma recuperado, la mediana del fondo queda por debajo de RGB 20 y más del 2 % de píxeles tiene croma > 24.
  - `worldSheetState().grey` tarda ≥ 2 s en pasar de 1 a 0,05.
  - Ninguna captura de capítulo o lugar supera el 25 % de píxeles encendidos; el cubo sigue siendo el blanco más brillante.
  - En `SAFE_COLORS` no hay dos lugares con el mismo hex.
- **Vigila:** Roset (Wong para la composición).
- **Tamaño:** grande.

### P8 · Menos contadores

- **Rama:** `panel10/p8-menos-contadores`
- **Depende de:** P2 (menú). **Necesita D3.**
- **Qué cambia:**
  - Un solo ★: la Constelación llama «Reliquias» a `S.stars.length` (`sharing.js:23`, `index.html:273`); se quita `starsN` del HUD (`ui.js:18`). Se retira `#oStars` si se confirma muerto.
  - Vista completa con tres cifras: ★ de 33, ✦ y lugares de 11 (`ui.js:16-18`, `sparks.js:104`, `index.html:42-52`).
  - Ninguna hoja de primer nivel muestra contadores a cero (Bitácora, Tu cubo, Refugio).
  - D3-B: salas del Refugio por lugares o ★, con migración que conserva las salas abiertas (`house-model.js:3`, `:21`).
  - Como mucho un logro por tarjeta o aviso (`achievements.js:10`).
- **No se toca:** ningún logro ganado, chispas, piezas compradas, guardados (migración sin borrar).
- **Bien cuando:**
  - Los usos de «Estrellas» y ★ solo leen `S.lugares.stars` (prueba con `grep`).
  - En `tel-libre-*`, el HUD muestra como máximo tres cifras.
  - Ninguna sala menciona «días»; un guardado antiguo conserva sus salas abiertas (prueba de migración).
- **Vigila:** Pope (Hodent para las hojas).
- **Tamaño:** media.

### Resumen de fases

| Código | Nombre | Rama | Depende de | Decisión | Tamaño |
|---|---|---|---|---|---|
| P1 | Pantallas limpias | `panel10/p1-pantallas-limpias` | main | no | media |
| P2 | Menús | `panel10/p2-menus` | P1 | D6 (solo un punto) | grande |
| P3 | El golpe junto al cubo | `panel10/p3-golpe-en-el-cubo` | main | no | media |
| P4 | El cierre de la ronda | `panel10/p4-cierre-de-ronda` | main | no | media |
| P5 | Un solo reloj | `panel10/p5-un-solo-reloj` | P3 | no | grande |
| P6 | Tocar donde sea y Tu canción | `panel10/p6-tu-cancion` | P4 y P5 | D1, D2, D5 | grande |
| P7 | El color se gana y se ve | `panel10/p7-color-ganado` | P3 | D4 | grande |
| P8 | Menos contadores | `panel10/p8-menos-contadores` | P2 | D3 | media |

P1, P3 y P4 pueden ir en paralelo.

---

## 8. Ideas sin consenso (para más adelante)

- **Elegir la nota** con la altura del toque (Iwai). Cambia el corazón del verbo.
- **Tu canción tocable:** callar o aislar anillos (Iwai).
- **Inclinar el teléfono** para abrir el filtro (Iwai). Opcional y apagado.
- **Refugio desde el día 1** con tres objetos que ya suenan (Iwai).
- **La racha suena:** más notas del arpegio según la forma del cubo (Matsuura).
- **Una sola racha** para forma, chispas y juegos (Matsuura).
- **Ventana proporcional** en Jardín y Cueva, donde tocar al azar acierta mucho (Matsuura). Antes, medir con una simulación de toques al azar.
- **Vibración con vocabulario** (Mizuguchi). No existe en iPhone.
- **Cara B con forma:** curva de energía y familia musical fija por lugar (Simogo).
- **Más compases por capa** en el gran final (Simogo).
- **El tema sube** en el clímax del Viaje y vuelve al cierre de cada capítulo (Wintory).
- **Chispa salvaje que se busca de oído:** nace fuera de pantalla y sin texto (Proteus).
- **Más voces del entorno** cerca de grupos; **sucesos raros que suenan**; **estaciones dentro de una sesión**; **quietud sin carteles** (Proteus).
- **Curva de intensidad en el anillo**, con un pico y una calma antes de la victoria (Chen).
- **Paleta con arco** hacia la Cueva (Roset).
- **Podar módulos:** 312 módulos y 2,1 MB de JS para un toque y once rondas (Pope). Es deuda, no urgencia.

---

## 9. Lo que ningún panel sustituye

- **Jugarlo con Luca.** Ver dónde mira, si toca el cubo o el vacío, si entiende el dedo fantasma y qué hace al quedarse en 74 %.
- **Oírlo en un teléfono con auriculares**, mejor Bluetooth. La latencia y la mezcla del final solo se juzgan así.
- Hasta entonces, la Sensación (6,2) es una estimación desde el código.

---

## 10. Resumen para Jay

- **Media del panel: 6,7 sobre 10.** Meta 8,7. Lo más lejos: la Sensación (6,2). Menús 5,5 y detalle visual 5,5.
- **Lo que más importa:**
  1. El ritmo se enseña lejos del cubo, y el dedo fantasma parece un objeto y marca el ritmo equivocado.
  2. El toque en el vacío suena al soltar el dedo y algunos toques no suenan.
  3. Quien acierta el 60 % gana a los 40 min y pasa 80 sin oír crecer su canción.
  4. El menú esconde Lugares y Bitácora y tiene un «Explorar» que no hace nada.
- **Te toca decidir:** D1 (recomiendo que la capa crezca con tu mejor %), D2 (tocar donde sea), D3 (tres cifras y Refugio por lugares), D4 (color del lugar en el mundo), D5 (final que fluye y deja oír tu frase), D6 (ocultar crear cuenta).
- **Fases sin decisión:** P1 `panel10/p1-pantallas-limpias`, P2 `panel10/p2-menus`, P3 `panel10/p3-golpe-en-el-cubo`, P4 `panel10/p4-cierre-de-ronda`, P5 `panel10/p5-un-solo-reloj`.
- **Fases tras tu decisión:** P6 `panel10/p6-tu-cancion`, P7 `panel10/p7-color-ganado`, P8 `panel10/p8-menos-contadores`.
- Nada de esto agranda el cubo, rehace la música ni toca los umbrales.
- Antes de dar nada por bueno: jugarlo con Luca y oírlo en un teléfono.
