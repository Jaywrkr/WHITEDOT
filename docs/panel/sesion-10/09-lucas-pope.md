# 09 · Lucas Pope

Simulación de la mirada de diseño de Lucas Pope a partir de su obra pública. No es su opinión real.

Versión **2.3.0-alpha.207** (commit `2e7f9d1`). Sin memoria de sesiones anteriores.

**Qué revisé.**
- Código: `index.html` (entero), `src/places.js`, `src/spark-rules.js`, `src/ui.js`, `src/journey-pulse.js` (juicio del pulso y la Línea), `src/bar-beat-hint.js`, `src/sparks.js` (HUD de chispas), `src/sharing.js`, `src/house-model.js`, `src/cube.js`, `src/achievements.js`, `src/data.js` (logros y eras), `styles/estilo-j.css` (modo tranquilo y menú).
- Guías: `docs/MUNDO.md`, `docs/VIAJE.md`.
- Medidas: `ls src | wc -l` = **312 módulos**; `src/*.js` = 20 184 líneas y 2,1 MB; `index.html` = 99 botones y 26 modales estáticos; `data.js` = unos 127 logros. `node scripts/play-curve.mjs` (modelo, no personas).
- Capturas (23): `00-inicio`, `01-capitulo-llanura`, `04-capitulo-tormenta`, `10-lugar-jardin`, `15-lugar-cueva`, `20-anillo`, `21-lugares`, `22-cancion`, `23-salvaje`, `31-guia-jardin`, `32-libro`, `33-resultado`; menús `tel-libre-menu`, `tel-libre-menu-mas`, `tel-viaje-menu`, `tel-viaje-lugares`, `tel-libre-tu-cubo`, `tel-libre-bitacora`, `tel-libre-ajustes`, `tel-libre-refugio`, `hor-libre-menu`, `esc-libre-menu`.
- No oí el audio ni jugué con las manos. Lo que digo del sonido sale del código.

## Contexto

Kubono es un juego de ritmo disfrazado de universo. En el centro hay una buena idea: un cubo pequeño, un toque a tiempo y una canción que se construye con tus propias notas. Alrededor de ese centro creció un segundo juego, de exploración, colección y economía, con su propio vocabulario y sus contadores. Hoy intenta ser las dos cosas a la vez. El núcleo (Viaje, once lugares, Tu canción) ya funciona como juego cerrado; el resto todavía no sabe para qué está.

## Notas

| Área | Nota | Por qué | Evidencia |
|---|---|---|---|
| Visual | 7 | Negro, cubo pequeño y dorado solo para lo ganado: se lee. En algunos capítulos el fondo se llena de glifos que compiten con el cubo. | `00-inicio`, `22-cancion` limpias; `01-capitulo-llanura` y `04-capitulo-tormenta` cargadas. |
| Audio | 7 | Puntúo por el código. Un acierto suena (nota del tema, vibración y brillo al oírse la nota). Un fallo no suena. Esa regla es honesta y se puede aprender de oído. No lo he escuchado. | `src/journey-pulse.js:88`, `:104`, `:110`. |
| Creatividad | 7,5 | Tu canción con tus frases a tiempo es la mejor idea del juego. Once juegos sobre el mismo toque es mucho, pero cada uno tiene una regla. | `src/places.js:100`, `:120`; `22-cancion`. |
| Sensación | 6 | La Línea y la forma del cubo (esquinas, rombo, marco dorado) dan respuesta sin números. Pero el umbral del 75 % no se ve mientras juegas. Sin manos, no puedo afirmar más. | `src/journey-pulse.js:15`, `:117–:133`; `33-resultado`. |
| Cohesión | 4,5 | Hay más de veinte contadores visibles y dos significados de ★. Un juego de un verbo con este inventario de números pierde su forma. | Lista en «Lo que falla», punto 1–2. |
| Pulido | 6 | Las hojas son sobrias y coherentes. Hay una etiqueta vacía, solapes en Refugio y apaisado, y un menú cortado en escritorio. | `tel-viaje-lugares`, `tel-libre-refugio`, `hor-libre-menu`, `esc-libre-menu`. |
| **Media** | **6,3** | (7 + 7 + 7,5 + 6 + 4,5 + 6) / 6 = 6,33 | |

## Lo que funciona

- **Un verbo con una regla contable.** Un toque está a tiempo si cae a ±80 ms del golpe; Maestro estrecha la ventana. Sin sonido, todo cuenta, pero no da ★★. `src/journey-pulse.js:9`, `:88`; `src/places.js:22`, `:30`.
- **Las estrellas dicen exactamente qué piden.** La tarjeta muestra «Ritmo · 74,6 % / 75 % a tiempo». Redondea hacia abajo para no regalar una estrella. Es la pantalla más clara del juego. `src/places.js:24`, `:131`; `33-resultado`.
- **Los números de la recompensa cuadran.** 74,6 % → 60 + 6×7 = 102 ✦, y la tarjeta dice «+102 ✦». Una sola fuente para juego y simulación. `src/spark-rules.js:9–11`; `33-resultado`.
- **Las estrellas no se gastan.** Avanzar nunca cuesta chispas. Separar progreso y moneda es correcto. `src/places.js:8`; `index.html:232`.
- **El fallo no castiga el oído.** Un toque fuera de tiempo no toca la nota del tema y deja un pico blanco, no dorado. Es una diferencia legible. `src/journey-pulse.js:104`, `:125`.
- **La forma del cubo es un contador sin dígitos.** Cuatro aciertos suben un nivel; un fallo baja uno. Se ve junto al cubo, donde miras. `src/journey-pulse.js:15`, `:129–:133`.
- **El modo tranquilo vacía la pantalla.** Durante el Viaje se ocultan día, era, distancia, chispas, metas y frases. `styles/estilo-j.css:541`; `01-capitulo-llanura`, `15-lugar-cueva`.
- **Tu canción como anillo de capas.** Once círculos, cinco con color, seis vacíos. Se cuenta de un vistazo. `22-cancion`.
- **El siguiente paso es único.** Menú, tarjeta y hoja Lugares dicen lo mismo: «Seguir hacia Jardín». `src/places.js:58`, `:70`, `:137`; `21-lugares`, `tel-libre-menu`.

## Lo que falla o falta

Ordenado por gravedad.

1. **Demasiados contadores para un verbo.** Conté los que un jugador puede ver: chispas, ★ de lugares, lugares 5/11, cristales 10, DÍA, Era (I · Pixel… ∞), días, noches, caminado en metros, regiones, continentes, récord, formas, logros (unos 127), tarjetas, colecciones, títulos, hitos, rarezas, favoritos, piezas «9 de 50», objetos «0 de 40», «Otro paisaje 0/20 ✦». Casi ninguno cambia lo que haces con el dedo. Evidencia: `src/ui.js:16`, `:18`; `src/data.js:10` (eras hasta 365 días), `:75`; `src/cube.js:51`; `index.html:296–298`, `:310–311`; `tel-libre-bitacora` (1 · 1 · 1 y «0 favoritos · 0 hitos visitados · 0 oídos sin visitar · 0 rarezas»), `tel-libre-tu-cubo`, `tel-libre-refugio`.
2. **★ significa dos cosas.** En lugares, ★ es una estrella ganada a tiempo (máximo 33). En Bitácora → Constelación, «Estrellas» es `S.stars.length`, que cuenta reliquias. El HUD también calcula `starsN` con reliquias (hoy oculto por CSS). Mismo símbolo, regla distinta. `src/sharing.js:23`; `src/ui.js:18`; `src/discovery.js:101`; `index.html:50`, `:273`. (`#oStars`, `index.html:259`, usa la misma cuenta, pero no encontré ninguna llamada a `exitWorld(true)`: parece código muerto.)
3. **El umbral no se puede contar mientras juegas.** ★★ exige 75 %, pero durante la ronda no hay cuenta de aciertos ni de toques. Las marcas de la Línea desaparecen en 1,8 s. El jugador sabe que falló por 0,4 puntos solo al final. `src/journey-pulse.js:125`; `src/places.js:131`; `33-resultado`.
4. **El Refugio se abre por días jugados.** Las salas piden «7 días o 20 logros» y «14 días o 40 logros». Volver otro día no es una habilidad, y el número no dice nada del juego. `src/house-model.js:3`, `:20–21`; `tel-libre-refugio`.
5. **Logros inflados.** Una sola ronda de Lago da «8 logros nuevos». Ocho de golpe no significan nada. `src/achievements.js:10`; `33-resultado`.
6. **La curva se para para quien juega al 60 %.** El modelo da victoria a los 39,9 min y luego 80 min sin capas nuevas. Al 75 % se llega a 28★ en 120 min, nunca a 33. Es un modelo, no personas. `node scripts/play-curve.mjs`.
7. **Etiqueta vacía en modo Viaje.** «Explorar» aparece sola porque sus botones son `free-only` y la etiqueta no. `index.html:157`; `styles/estilo-j.css:540`; `tel-viaje-lugares`.
8. **Solapes y cortes.** En Refugio, el rótulo «Tu Refugio» tapa «Refugio · 0 sonando … Coloca. Escucha.» (`tel-libre-refugio`). En apaisado, «Más −» asoma por encima de la cabecera del menú y tapa «Jugar» (`hor-libre-menu`). A 1280×800, Bitácora y Ajustes quedan cortados bajo el pliegue (`esc-libre-menu`).
9. **Superficie de código desproporcionada.** 312 módulos y 2,1 MB de JS para un toque y once rondas. Hay módulos de rarezas, superbiomas, VJ, tótems, travesuras, culturas, laboratorio. Cada sistema añade su número y su hoja. La deuda de diseño se ve antes que la de código: 26 modales estáticos y 99 botones en `index.html`.

## Recomendaciones

1. **Un solo ★.** Renombrar la cuenta de reliquias («Reliquias» o un glifo propio) en Constelación y quitar `starsN` del HUD.
   - Dónde: `src/sharing.js:23`, `index.html:50`, `:273`, `src/ui.js:18`; quitar `#oStars` si se confirma muerto.
   - Bien cuando: `grep -n "Estrellas\|★" index.html src/*.js` solo devuelve usos que leen `S.lugares.stars`, y una prueba lo comprueba.
2. **Un contador en vivo durante la ronda.** Dos cifras pequeñas junto a la Línea: aciertos / toques, o un tic en el 75 %. Sin texto nuevo.
   - Dónde: `src/journey-pulse.js` (`draw`), con datos de `placeRun()` (`src/places.js:139`).
   - Bien cuando: en `?lugar=jardin`, la cifra en pantalla coincide con el `%` de la tarjeta final en 10 de 10 rondas de prueba, y el cubo no cambia de tamaño.
3. **Podar la vista completa a tres números.** ✦, ★ de 33 y lugares de 11. Pasar día, era, metros, regiones, continentes y récord a «Tú» en la Bitácora, o retirarlos.
   - Dónde: `src/ui.js:16–18`, `src/sparks.js:104`, `index.html:42–52`, `:295–299`.
   - Bien cuando: en `tel-libre-*`, el HUD muestra como máximo tres cifras y ninguna hoja de primer nivel muestra un contador a cero.
4. **El Refugio se abre jugando, no esperando.** Salas por ★ o por lugares completos, no por días.
   - Dónde: `src/house-model.js:3`, `:21`, con migración que conserve las salas abiertas.
   - Bien cuando: ninguna sala menciona «días»; un guardado antiguo conserva todas sus salas abiertas (prueba de migración).
5. **Logros de uno en uno.** Agrupar los logros que salen en la misma ronda y mostrar como mucho uno en la tarjeta. Revisar los 127 y retirar los que solo cuentan tiempo o distancia.
   - Dónde: `src/achievements.js:10`, `src/data.js:75`.
   - Bien cuando: la tarjeta de una primera ronda muestra como mucho un logro; la lista activa baja de 127 a menos de 40.
6. **Arreglar los tres fallos de pantalla.** Etiqueta «Explorar» con `free-only`; solape del rótulo del Refugio; cabecera del menú en apaisado.
   - Dónde: `index.html:157`, `styles/estilo-j.css` (menú y `house-panel`).
   - Bien cuando: las capturas `tel-viaje-lugares`, `tel-libre-refugio` y `hor-libre-menu` no muestran etiquetas vacías ni texto superpuesto.

## Opinión en una frase

El juego del toque a tiempo ya está y se puede contar; ahora sobran contadores y sistemas que no sirven a ese toque y lo tapan.
