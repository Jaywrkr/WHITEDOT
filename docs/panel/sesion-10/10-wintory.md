# 10 · Austin Wintory

Simulación de la mirada de diseño de Austin Wintory a partir de su obra pública. No es su opinión real.

**Versión:** 2.3.0-alpha.207 (commit `2e7f9d1`).

**Qué revisé:**
- Código: `src/song.js`, `src/song-stage.js`, `src/journey-finale.js`, `src/journey-pulse.js`, `src/journey-chapters.js`, `src/journey-victory.js`, `src/journey-games.js`, `src/theme-key.js`, `src/interactions.js` (pulso), `src/audio.js` (puerta de silencio), `src/house-audio.js`, `src/places.js` (tarjeta de la ronda), `src/refugio-lugares.js`.
- Guías: `docs/VIAJE.md` y `docs/MUNDO.md` (solo las partes del tema y de Tu canción).
- Capturas: `22-cancion`, `00-inicio`, `01-capitulo-llanura`, `04-capitulo-tormenta`, `05-capitulo-vacio`, `12-lugar-cristales`, `20-anillo`, `33-resultado`, `menus/tel-libre-sonido`, `menus/tel-viaje-sonido`.
- Medida: un script de Node que llama a `songPlan` y `stageEvents` (puro, sin audio) para contar eventos por compás en el final de Tu canción.
- No oí nada. Todo lo que digo del sonido sale del código y de esa medida.

## Contexto

Kubono es un juego musical en el que el único verbo es tocar a tiempo. Lo bonito es que cada pulso a tiempo toca la nota siguiente de un tema de seis notas. El jugador no sigue la melodía: la toca. El Viaje recorre cinco paisajes con ese tema y acaba en un final que recompone tus frases. Después, once lugares van sumando capas a una sola canción. Quiere ser un *Journey* de bolsillo, donde la música es la historia y la historia es tuya.

## Notas

| Área | Nota | Por qué · evidencia |
|---|---|---|
| Visual | 7 | El escenario de Tu canción es claro y sobrio: once anillos, los ganados en color y los que faltan en línea discontinua (`22-cancion.png`, `song-stage.js:27-31`). El dorado sube con las capas que suenan (`song-stage.js:112`). |
| Audio | 6,5 | Puntuado por el código. La música responde: sube con el juego, baja a un pedal si paras y en el Vacío no pasa del cubo (`journey-chapters.js:12,20`). En el gran final, tu frase y el tema quedan enterrados (medida abajo). |
| Creatividad | 8 | El tema está en el dedo del jugador (`journey-pulse.js:96-103`, `interactions.js:52`). Una canción hecha de once lugares es una idea fuerte y legible. |
| Sensación | 6,5 | Sin manos ni oído, solo por la estructura. Hay silencios bien puestos: un compás mudo antes del tema y oscuridad antes de los créditos. Pero el cierre de cada capítulo no da el tema entero y el tema no crece. |
| Cohesión | 7 | Un tema y una canción atan el Viaje, los lugares, las llaves (`theme-key.js`) y el Refugio. Falla en los detalles: la capa de la victoria no coincide con lo ganado y los dos finales tratan distinto la segunda vuelta del tema. |
| Pulido | 6,5 | La puerta de silencio es limpia (`audio.js:70-75`). Algunos comentarios contradicen el código y el silencio lleva rótulo. |
| **Media** | **6,9** | |

## Lo que funciona

- **El jugador toca el tema.** Cada pulso a tiempo da la nota siguiente de `THEME` en la escala del lugar (`journey-pulse.js:6,96,103`). Seis aciertos seguidos y has tocado el tema. Esto es lo más valioso del juego.
- **El tema cambia de color con el paisaje.** `themePitch` lo lleva a la escala de cada bioma (`journey-pulse.js:44`). La misma melodía en modos distintos.
- **La música espera al jugador.** Los techos van de Llegada (.38) a Pertenencia (.66) y Plenitud (1). Si dejas de tocar ocho compases, cae a .16 (`journey-chapters.js:12-13,86`). Así se escucha que la música depende de ti.
- **El Vacío como contraste.** El techo de .1 deja al cubo casi solo (`journey-chapters.js:20`). Después, las criaturas repiten tus notas un compás más tarde (`journey-chapters.js:104`). Es el mejor momento de silencio del juego.
- **El tema se reserva.** En el final de Tu canción, la capa de Faros (la melodía) no suena hasta que ha sonado el tema (`song-stage.js:62`). Es contención de verdad.
- **Silencio real antes del tema.** El compás `SILENCE_BARS` cierra toda la salida, colas de reverberación incluidas (`song-stage.js:58,101`; `audio.js:70`). Además, `stageEvents` no devuelve nada en ese compás.
- **El final del Viaje toca solo.** El Refugio calla mientras suena (`house-audio.js:12`). Las frases suenan por delante del fondo: frase .42 contra fondo .36 (`journey-finale.js:58`). El cielo se oscurece en `SILENCE` antes de los créditos (`journey-finale.js:99,113`).
- **Lo que falta se ve sin palabras.** Los anillos discontinuos de `22-cancion.png` dicen «quedan seis» sin texto.

## Lo que falla o falta

1. **En el gran final, tu frase y el tema no se oyen.** Medido con `songPlan`/`stageEvents` y todas las capas en ★★:
   - Compás 11 (tus frases): 65 eventos, solo 6 tuyos.
   - Compás 23 (tema): 62 eventos, solo 3 de chelo.
   - Tu frase sale por `lead` con nivel .035 (`song.js:69`). Es la voz más baja de toda la canción: el bombo va a .5 (`song.js:59`), las conga a .12 y el eco a .08.
   - El chelo del tema va a .09 (`song.js:58`), por debajo de once capas más la música del Mundo.
   - El final que corona el juego entierra justo lo que es tuyo. El final del Viaje hace lo contrario y acierta (`journey-finale.js:58`).
2. **El tema no crece.** Siempre son las mismas seis notas en el mismo registro: `themePitch` lo encierra entre MIDI 48 y 64 (`journey-pulse.js:44`).
   - En el final del Viaje, las dos vueltas suenan igual a propósito (`journey-finale.js:53-55`, «K7»). La quinta solo existe en la partitura abstracta.
   - En el clímax del Viaje, el tema no sube. El final de Tu canción sí sube una quinta (`song-stage.js:65`). Los dos finales no cuentan lo mismo.
3. **El cierre de un capítulo no da el tema.** `plenitude` deja el tema en tutti solo como alternativa (`journey-chapters.js:108`). Con los juegos de capítulo, el cierre es «el cierre dorado del juego, no el tema» (`journey-chapters.js:112`). Al ganar suenan dos compases de la capa del lugar, a ganancia .3 y sin melodía propia (`journey-victory.js:3-4`). En la Llanura esa capa es un bombo sobre música que ya tiene bombo. El comentario de cabecera aún promete que «el tema suena entero» (`journey-chapters.js:5-7`).
4. **La victoria de una ronda no suena a lo que ganaste.** `journeyVictory` toca siempre la capa en ★★ (`journey-victory.js:24`, `tiers:{[run.id]:2}`). Con una sola ★, Tu canción toca solo un fragmento (`song.js:38`). La ronda de `33-resultado.png` (★, 74,6 % de 75 %) suena a capa entera y después se guarda a medias.
5. **El silencio lleva rótulo.** En el compás mudo, el escenario escribe «Espacio antes del tema.» (`song-stage.js:40`). Explicar el silencio le quita la fuerza. En el final del Viaje no hay rótulo, y está mejor.
6. **La versión maestra es el mismo final.** Mismo plan y mismas líneas; solo cambian el nivel de capa 3 y el título (`song-stage.js:21-22,125`). Las 33 ★ no traen ningún gesto musical propio.
7. **Menor:** las capturas `tel-*-sonido` enseñan el menú y no una hoja de sonido. El sonido no tiene una entrada directa y visible, y en un juego musical importa poder encontrarlo.

## Recomendaciones

Ninguna toca la generación, las armonías ni la mezcla del Mundo. Solo cambian cuándo entra, cuándo calla y qué voz lleva el momento.

1. **Hacer sitio a lo tuyo en el final de Tu canción.** Dónde: `song-stage.js:stageEvents`, en los compases `notesAt…silenceAt` y `themeAt…themeAt+2`. Durante tu frase y la primera vuelta del tema, solo siguen el colchón (Vacío) y el bajo (Lago); las demás capas vuelven en la segunda vuelta. Es un arreglo de entradas, no un cambio de voces.
   - Bien cuando: en el compás del tema, los eventos que no son tema bajan de 59 a 8 o menos (misma medida con Node).
   - Bien cuando: en los compases de frase, las notas `mine` son al menos el 40 % de los eventos.
2. **Dar a tu frase una voz que se oiga.** Dónde: `song-stage.js:64`. Usar para `mine` la misma voz suave del final del Viaje (arp o chelo, `journey-finale.js:56`) en lugar de `lead` a .035.
   - Bien cuando: el pico de tu frase supera al del bombo en el render del final (renders de `tests/` sobre el final completo).
3. **Hacer que el tema suba en el clímax del Viaje.** Dónde: `journey-finale.js:55`. En la segunda vuelta, subir una octava o una quinta dentro de `voiced` (52–76), como ya hace Tu canción.
   - Bien cuando: la altura media de la segunda vuelta queda al menos 5 semitonos por encima de la primera (prueba pura sobre `finaleArrangement`).
4. **Devolver el tema al cierre de cada capítulo.** Dónde: `journey-chapters.js:108` y `journey-victory.js`. Que la capa del lugar suene bajo el tema en chelo, una vez, en lugar de sustituirlo.
   - Bien cuando: completar un capítulo programa las 6 notas de `THEME` junto a la capa (contar eventos en `journeyVictoryState`).
5. **Que la victoria suene a lo ganado.** Dónde: `journey-victory.js:24`. Usar el nivel real de `placesData().stars[id]` en lugar de 2.
   - Bien cuando: una ronda de ★ programa la mitad de compases que una de ★★ (prueba pura con `dropEvents` y `tierStep`).
6. **Quitar el rótulo al silencio.** Dónde: `song-stage.js:40`. En la fase `space`, dejar el texto vacío. Opcional: atenuar los anillos a cero.
   - Bien cuando: `stageCaption(plan, silenceAt*16).text === ''`.

## Opinión en una frase

El jugador ya toca el tema con el dedo, que es lo más difícil; ahora falta que el final, el que corona el juego, le haga sitio para oírse.
