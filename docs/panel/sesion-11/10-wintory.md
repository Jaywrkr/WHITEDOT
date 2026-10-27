# 10 · Austin Wintory — sesión 11
> Simulación de su mirada de diseño a partir de su obra pública. No es su opinión real. Revisó alpha.215 (`5464612`): el final de los once (`src/song-stage.js`), el final del Viaje (`src/journey-finale.js`), el tema (`THEME`, `src/journey-pulse.js`), la capa de Faros por porcentaje (D1, `src/song.js`), el paso del secuenciador (`src/audio.js`) y las capturas 22, 13, 05 y 00. Nadie lo ha oído. Todo lo sonoro sale de leer el código y de trazar los eventos con Node.

## Notas (puntuación ciega)
| Eje | Nota | Evidencia y alcance |
|---|---|---|
| Visual | 6,5 | Solo cuatro capturas. Los anillos se leen sin palabras; los ganados a ★ quedan pálidos y la mitad baja está vacía (22-cancion). |
| Audio | 5,5 | Sin escucha. El final de los once está bien pensado, pero el Viaje aplana el tema a notas del acorde y el Mundo suena entero debajo del final. |
| Creatividad | 7,5 | El tema crece nota a nota con tu porcentaje en Faros. Tus frases vuelven en el final. Un compás de silencio real antes del tema. |
| Sensación | — | Me abstengo. Nadie lo ha tocado con las manos ni oído en un teléfono. |
| Cohesión | 6,5 | El tema une golpe, capítulo, capa y final. Se rompe en dos puntos: el final del Viaje y la coda que depende de Faros. |
| Pulido | 6 | Silencio con puerta de mezcla, reloj audible y pruebas puras. Swing desalineado y coda sin cadencia. |

## Lo que funciona hoy

- **El tema crece con el jugador, de verdad.** En Faros, tu porcentaje suma notas al tema: 3 notas a ★, 4 desde el 62,5 %, 5 desde el 70 %, las 6 a ★★ (`song-stage.js:74`, `song.js:189`; medido con Node). Es la idea que pedía: la melodía se completa al tocar mejor.
- **Tu frase tiene sitio.** Bajo tus frases y la primera vuelta del tema solo quedan colchón y bajo (`song-stage.js:28-29,71`). Medido con todas las capas a ★★: compás de frase con 9 eventos, 6 tuyos.
- **El silencio es silencio.** El compás antes del tema no devuelve eventos (`song-stage.js:70`). La puerta corta la mezcla entera, colas incluidas (`song-stage.js:116`, `audio.js:70-75`). Ya no lleva rótulo (`song-stage.js:52`). Dura 2 s a 120 BPM.
- **La forma del final de los once es clara.** Once entradas, tus frases en orden, silencio, tema en chelo, segunda vuelta una quinta arriba con todo el tutti, créditos (`song-stage.js:59-66,77,134`). Medido: 69 71 76 74 73 69 y después 76 78 83 81 80 76. La quinta está bien llevada a la escala.
- **Lo que falta se ve sin palabras.** En `22-cancion`, seis anillos discontinuos dicen «quedan seis».
- **El final del Viaje toca solo.** El Mundo calla mientras suena (`audio.js:223`).

## Lo que falta o salió mal

1. **Alta · El final del Viaje no toca el tema.** `voiced` lleva cada nota al tono del acorde más cercano (`journey-finale.js:54`), también las del tema (`:57`). El acorde es fijo en tónica durante el tema (`:42`). Medido: suena La La Mi Do♯ Do♯ La, dos veces igual. El tema es La Si Mi Re Do♯ La (`journey-pulse.js:125`). Se pierden el Si y el Re, que son su forma. El jugador lo ha tocado nota a nota durante veinte minutos y su final le devuelve un arpegio. Viene de antes de la sesión 10 (`5f0c5d8`); entonces no lo vi.
2. **Alta · El final de los once no termina.** Tras la segunda vuelta, que acaba en Mi (la dominante), quedan dos compases de capas (`song-stage.js:18,66`). La coda melódica es la capa de Faros: el tema en `lead` cuadrado, la voz fina que se quitó a tus frases (`:74`). Cuántas notas toca depende de tu nivel en Faros. Medido con los once a ★ (el mínimo para llegar): en la coda solo suenan La Si Mi, en un compás, y la canción se corta en el compás 30. La última nota melódica es otra vez la dominante. Nada vuelve a casa. Luego el Mundo sigue sonando como si nada.
3. **Media · El Mundo suena entero debajo del final.** `songStageStep` se llama dentro del paso del Mundo (`audio.js:302`). Su batería y su pista siguen (`audio.js:286-296`). Solo el compás de silencio las calla. «Solo colchón y bajo» vale para las capas, no para lo que se oye. En P6, el compás de frase quedó solo unos 4 dB bajo el tutti (−27,4 frente a −23,5).
4. **Media · Swing contra recto.** El Mundo retrasa las semicorcheas impares con su swing (`audio.js:283`, `tt`). El final las recibe en `t`, recto (`audio.js:302`, `song-stage.js:119`). Ácido y percusión tocan cada semicorchea: pueden sonar con flam contra la radio. No lo he oído.
5. **Media · El clímax puede quedar tapado.** La segunda vuelta trae de golpe diez capas y el Mundo. El chelo va a .09 (`song.js:215`), contra bombo a .5 y palmas a .24 (`:216,219`). La nota más alta es Si5 (MIDI 83), en una voz de triángulo. Sin render escuchado no sé si se oye.
6. **Baja · Tu frase suena corta.** La voz `arp` dura 1,6 semicorcheas siempre (`song.js:222`). La duración que calcula el plan (`len:2`, `song-stage.js:76`) no se usa. Tus notas largas suenan igual que las cortas.
7. **Baja · La versión maestra es el mismo final.** Mismo plan; solo cambian el nivel 3 y dos líneas (`song-stage.js:24,140`).
8. **Baja · Visual.** En `22-cancion` los anillos a ★ son pálidos y casi grises. Vacío parece apagado. La mitad baja de la pantalla queda vacía.

## Contraste con la sesión 10

Sesión 10: Visual 7, Audio 6,5, Creatividad 8, Sensación 6,5, Cohesión 7, Pulido 6,5. Hoy salen más bajas porque miré los finales nota a nota.

**Cerrado:**
- Hueco para tu frase y el primer tema: `UNDER_PHRASE` y `held` (`song-stage.js:28-29`). Medido: 6 de 9 eventos tuyos.
- Voz de tu frase: `arp` en vez de `lead` (`song-stage.js:76`).
- Silencio sin rótulo (`song-stage.js:52`).
- La victoria suena al nivel ganado: `run.tier` (`journey-victory.js:27`).
- El tema crece: Faros por porcentaje (D1). Es mejor de lo que pedí.

**Abierto:**
- El tema no sube en el clímax del Viaje. Las dos vueltas siguen iguales (`journey-finale.js:55-57`).
- El cierre de un capítulo no da el tema (`journey-chapters.js:106-113`).
- La versión maestra no tiene gesto propio.
- Nadie ha oído los renders del final. CAMBIOS lo pide a Jay antes de integrar; no me consta que se hiciera.

**Empeoró o es nuevo:**
- Nuevo: el tema aplanado a notas del acorde en el Viaje (punto 1).
- Nuevo: la coda depende del nivel de Faros y no cadencia (punto 2).
- Nuevo: el Mundo y su swing debajo del final (puntos 3 y 4). El arreglo cerró el hueco entre capas, no el de la mezcla.

## Qué haría ahora

1. **Que el Viaje toque su tema.** Dónde: `journey-finale.js:57`. Para las notas del tema, usar `snapToScale` y el registro 52–76, sin `voiced`. La segunda vuelta, una quinta u octava arriba.
   - Bien cuando: `finaleArrangement` da las 6 alturas de `THEME` en orden, con el Si y el Re. La media de la segunda vuelta queda ≥ 5 semitonos sobre la primera.
2. **Una cadencia escrita para el final de los once.** Dónde: `song-stage.js:74,77`. En la coda, el chelo toca el tema completo en su altura original, sin depender de `tiers.faros`, y acaba en la tónica sobre el «1». Después, un compás con colchón y bajo, y cortar en el «1» siguiente.
   - Bien cuando: con los once a ★, la coda tiene las 6 notas. La última nota melódica es la tónica. Ningún evento empieza después del último «1».
3. **Bajar el Mundo durante el final.** Dónde: `audio.js:223` y `song-stage.js:116-117`. Dejar la radio fuera desde las entradas hasta el fin de la coda, como hace el final del Viaje. Sin cambiar sus notas.
   - Bien cuando: `song_stage_mix.py` mide el compás de frase al menos 8 dB por debajo del tutti, no 4.
4. **Llevar el swing al final.** Dónde: `audio.js:302`. Pasar `tt` (o el swing) a `songStageStep`.
   - Bien cuando: los eventos impares del final y del Mundo caen a la vez (±2 ms) en una prueba pura.
5. **Escuchar antes de puntuar el sonido.** Jay oye el final de once con los once a ★ y con todos a ★★, en teléfono y con auriculares.
   - Bien cuando: hay una nota de escucha en `docs/VERIFICACION.md` con fecha y dispositivo.
