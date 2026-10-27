# 02 · Toshio Iwai — sesión 11
> Simulación de su mirada de diseño a partir de su obra pública. No es su opinión real. Revisó alpha.215 (`5464612`): tocar donde sea y el pulso suave (`src/canvas.js`, `src/interactions.js`), Tu canción y sus anillos (`src/song-stage.js`, `src/song.js`), el libro y el jardín de voces (`src/rare-cards.js`, `src/collection-garden.js`), los trofeos del Refugio, y las capturas 22, 20, 32, 33, 10 y 01.

## Notas (puntuación ciega)
| Eje | Nota | Evidencia y alcance |
|---|---|---|
| Visual | 7 | Anillos de Tu canción claros y sin palabras (captura 22). Lo que falta se lee solo: aro discontinuo. Pero ★ y ★★ casi no se distinguen en varios colores (medida abajo). |
| Audio | 7 | Solo por código; no lo oí. Todo cae en la rejilla y en el acorde del mundo (`song.js:20-31`, `song-stage.js:68`). Ningún toque suena fuera de tiempo. |
| Creatividad | 7,5 | La canción que crece capa a capa, y el trofeo que suena su capa al tocarlo, son juguetes de verdad (`refugio-lugares.js:48`). |
| Sensación | — | Me abstengo. Nadie ha tocado esto en un teléfono ni medido el retraso. Lo que digo del tacto sale del código. |
| Cohesión | 7 | Una sola tonalidad y un solo reloj. Pero la mitad de la regla «tocar donde sea» depende del modo (`canvas.js:27`). |
| Pulido | 7 | Pantallas limpias y textos breves (capturas 22, 33). Quedan huecos: el crecimiento por porcentaje no se ve, el libro no suena. |

## Lo que funciona hoy

- **El toque nunca es mudo en el juego guiado.** Un pulso demasiado seguido suena igual, más suave (0,45), en la siguiente semicorchea (`interactions.js:3`, `:68-70`). Es la regla de Otocky: lo que tocas siempre es música.
- **El pulso suena al apoyar el dedo** en el Camino, los capítulos y las rondas (`canvas.js:27`, `:47`). Se juzga en el instante del toque, no al soltar (`interactions.js:30`).
- **A tiempo, el pulso toca la siguiente nota del tema** en la voz del lugar (`interactions.js:38`, `:56-57`). Premio sonoro, no un número.
- **La canción se arma en el acorde que suena.** `songChord` lleva cualquier acorde al registro de la canción (`song.js:33`). Las capas usan raíz, quinta y octava o notas del acorde. Por construcción no hay choque.
- **El ★ entre ★★ crece por pulsos.** Del 55 % al 73,75 % entra un golpe más cada 1,25 puntos (`song.js:42-49`). Medido: el Bajo dub suena 12/24 golpes a ★, 16/24 a 1,5 y 23/24 a 1,94.
- **Los anillos ya hablan sin texto.** Color si suena, aro gris discontinuo si falta (`song-stage.js:41-42`, captura 22).
- **El trofeo es un instrumento.** Tocarlo suena su capa dos compases encima de la música (`refugio-lugares.js:48`, `:52`).
- **El final ordena el arreglo, no lo rehace.** Bajo y colchón sostienen tu frase; luego un compás de silencio y el tema (`song-stage.js:28-29`, `:70`).

## Lo que falta o salió mal

1. **Alta. El crecimiento por porcentaje se oye pero no se ve.** `tierInk` usa `Math.floor(tier)` (`song-stage.js:33`). Una capa a 1,94 se pinta igual que a 1,0. La ficha de resultado tampoco lo dice (captura 33: «A 0,4 de ★★» sin mención a la capa). Ningún texto del juego contiene «crece» para esto (`grep`). Un sonido sin forma.
2. **Alta. ★, ★★ y ★★★ casi no se separan en varios lugares.** Diferencia RGB entre ★ y ★★ medida con `tierInk`: Ruinas 13, Dunas 16, Cristales 19, Jardín 26. Por debajo de ~30 en un aro de 2 px sobre negro no se lee. Solo Vacío (59) y Cueva (46) se distinguen bien.
3. **Media. En el Universo abierto el pulso suena al soltar.** Fuera de rondas, `tapAnywhere` es falso (`canvas.js:27`). Un toque en vacío llama a `sonar` en `pointerup` (`canvas.js:71`). Se juzga bien (usa `tapStart.t`), pero el sonido llega tras el tiempo que el dedo estuvo apoyado, hasta 450 ms. El mismo gesto suena distinto según el modo.
4. **Media. Un toque quieto entre 450 y 500 ms es mudo.** Pasa los 450 ms del toque (`canvas.js:71`) y no llega a los 500 ms del escáner (`canvas.js:48`). Nada suena ni se abre.
5. **Media. Los anillos de Tu canción no se tocan.** La escena solo tiene «Otra vez» y «Cerrar» (`song-stage.js:89`). Los trofeos sí suenan al tocarlos; los anillos, que son la misma capa, no. El juguete está en el Refugio y no en la canción.
6. **Media. El libro de voces no suena.** La tarjeta tiene «Añadir al jardín», «Buscar una voz complementaria» y detalles (`rare-cards.js:82`). No hay forma de oír la voz antes de elegirla. El retrato solo se inclina (`wow-ui.js:13-18`). «1 / 4 voces elegidas» (captura 32) pide elegir a ciegas.
7. **Baja. Los nombres de los anillos son grises pequeños.** 11 px y `#a0a0a0` para los que faltan (`song-stage.js:43`). En 390 px los anillos miden 35 px de diámetro (`ringLayout`). Se lee, pero el aro discontinuo y el nombre gris compiten.
8. **Baja. La regla del bloque de pulsos suaves corta en capas profundas.** Fuera de la superficie, el pulso suave no suena (`interactions.js:68`). Allí manda `layerPulse`, pero un toque rápido repetido se pierde.

## Contraste con la sesión 10

En la sesión 10 puse 7 / 7,5 / 5 / 6,5 / 7,5 / 7 (media 6,75). Hoy: 7 / 7 / 7,5 / — / 7 / 7 (media 7,1 sin Sensación). La subida es Creatividad; Audio y Cohesión bajan medio punto porque esta vez miré huecos que antes no miré.

**Cerrado**
- **Ningún toque mudo (mi recomendación 3).** Cerrado en el juego normal. El pulso seguido suena al 45 % en la siguiente semicorchea (`interactions.js:68-70`). CAMBIOS P5 lo prueba a 8 Hz con ≤ 4 por paso.
- **Una capa para quien juega (mi recomendación 4).** Cerrado por D1. `play-curve.mjs` hoy: el perfil del 60 % crece 13 veces y su mayor hueco es 8,9 min (cumple 12). En la sesión 10 eran 80,1 min.
- **El pulso al apoyar el dedo.** Cerrado en Camino, capítulos y rondas (`canvas.js:27`, `:47`).
- **Contador a cero en el Refugio.** Ya no dice «0 sonando» (P8; captura `tel-libre-refugio`). Las salas se abren por lugares o ★, no por días.
- **«74,6 % / 75 %».** Sigue el decimal, pero ahora dice «A 0,4 de ★★» (captura 33). Es una distancia, no un castigo. Medio cerrado.

**Abierto**
- **Tu canción se escucha, no se toca (mi recomendación 2).** Igual que antes (`song-stage.js:89`). Los anillos siguen sin escucha de toque.
- **El jugador no elige nota (mi recomendación 1).** El acierto sigue tocando el siguiente grado de `THEME` (`journey-pulse.js:6`, `:111`). No entró en P1–P8; no lo reabro como fase, lo dejo como idea.
- **El Refugio como primer juguete (mi recomendación 5).** Mejor contado, pero la captura `tel-libre-refugio` sigue amontonada: «Tu Refugio viaja» tapa la fila «CIELO · 8 LUGARES O 15 ★» y «PRISMA» cae sobre la línea del suelo.
- **El teléfono como instrumento (mi recomendación 6).** Sin inclinación ni multitoque. Era opcional.

**Empeoró o es nuevo**
- **El crecimiento de D1 no tiene forma** (hallazgo 1). Es nuevo porque D1 es nuevo. Se construyó el sonido y no la imagen.
- **La saturación por ★ que pedí se queda corta** (hallazgo 2). Se hizo lo que pedí, pero medido no basta en Ruinas, Dunas y Cristales.
- **El mismo gesto, dos tiempos** (hallazgo 3). D2 se aplicó a las rondas y no al Universo abierto. CAMBIOS P6 lo dice: «En el Mundo libre no cambia». Fue una decisión, pero el contraste ahora se nota más.

## Qué haría ahora

1. **Que el crecimiento se vea en el anillo.** En `drawSongRings` (`song-stage.js:38-44`), dibujar el arco del aro en proporción a lo que suena: a ★ medio aro lleno, a 1,5 tres cuartos, a ★★ entero. Sin tocar la saturación ni el sonido. **Bien cuando:** una prueba de Node con `tier` 1, 1,5 y 1,94 da tres longitudes de arco distintas, y la fracción del arco coincide con la fracción de golpes de `tierStep` (12/24, 16/24, 23/24 para Lago) con error ≤ 1/16.
2. **Separar las tres ★ por forma, no solo por color.** En `drawSongRings`: ★ un aro, ★★ aro y relleno, ★★★ un segundo aro exterior fino. Mantener `tierInk`. **Bien cuando:** en una captura de 390×844 con un lugar en cada nivel, Ruinas ★ y Ruinas ★★ se distinguen por píxeles (relleno > 0 solo en ★★) y no por una diferencia RGB de 13.
3. **Tocar un anillo es tocar su capa.** En `song-stage.js`, una escucha en el lienzo: el anillo tocado se aísla un compás, como hace el trofeo (`refugio-lugares.js:48`). Mismo código de capa, sin notas nuevas. **Bien cuando:** en `songStageState().pulses`, tras tocar «Lago», solo Lago > 0 durante el compás siguiente, y luego vuelven todas.
4. **Oír una voz antes de elegirla.** En la tarjeta del libro (`rare-cards.js:82`), un botón «Escuchar» que toca la voz de la carta una vez, cuantizada a la siguiente semicorchea. **Bien cuando:** pulsar «Escuchar» programa exactamente un sonido de esa voz, y el botón existe en las tarjetas con `data-garden-add`.
5. **Cerrar el hueco del toque quieto.** En `canvas.js:71` y `:48`, que un toque de 450–500 ms sin moverse suene como pulso o abra el escáner, no ninguno de los dos. Sin cambiar D2 en el Mundo libre. **Bien cuando:** una prueba de puntero con toques de 100, 300, 470 y 600 ms da siempre un sonido o el escáner, nunca nada.
