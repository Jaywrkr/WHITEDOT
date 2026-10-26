# 04 · Simogo — el juego como un disco

Simulación de la mirada de diseño de Simogo a partir de su obra pública. No es su opinión real.

Versión **2.3.0-alpha.207** (commit `2e7f9d1`).

**Qué revisé.** Código: `src/journey-chapters.js`, `src/journey-finale.js`, `src/journey-victory.js`, `src/journey-mode.js`, `src/journey-games.js`, `src/places.js`, `src/places-ring.js`, `src/song-stage.js`, los juegos de lugar (`journey-garden.js`, `journey-surf.js`, `journey-resonance.js`, `journey-guide.js`, `journey-rebuild.js`, `journey-echo.js`, `journey-stick.js`, `journey-chain.js`, `journey-lasso.js`, `journey-dance.js`), `src/superbiomes.js` e `index.html` (`#mPlace`). Guías: `docs/VIAJE.md`, `docs/MUNDO.md`. Modelo: `node scripts/play-curve.mjs`. Capturas vistas (12): `00-inicio`, `01-capitulo-llanura`, `02-capitulo-lago`, `04-capitulo-tormenta`, `05-capitulo-vacio`, `10-lugar-jardin`, `13-lugar-faros`, `15-lugar-cueva`, `20-anillo`, `21-lugares`, `22-cancion`, `33-resultado`.

No oí el audio ni jugué con las manos. Lo que digo del sonido sale del código.

## Contexto

Kubono es un disco que se juega. Un cubo pequeño toca a tiempo sobre música que ya existe. La cara A es el Viaje: cinco pistas con un arco claro, clímax en la Tormenta y coda en el Vacío. La cara B son seis lugares en anillo que se abren en orden. Al final, todo lo que tocaste vuelve como Tu canción. La idea es fuerte. La cara A está escrita como un disco; la cara B todavía se comporta como una lista de niveles.

## Notas

| Área | Nota | Por qué | Evidencia |
|---|---|---|---|
| Visual | 7 | Negro, blanco y dorado coherentes; el anillo de once se repite como motivo. Los capítulos se parecen mucho entre sí en gris. | `22-cancion`, `20-anillo`; `01`, `02`, `10` casi monocromos |
| Audio | 7,5 | Por código: la cara A tiene curva de energía por estado y por pista; el final calla un compás antes del tema. No lo oí. | `journey-chapters.js:12-20`, `song-stage.js:57-58` |
| Creatividad | 8 | Tus notas a tiempo se guardan con su ritmo y vuelven en el final. Cada lugar es una capa. Es un disco hecho de ti. | `journey-chapters.js:88-97`, `journey-finale.js:25-32`, `song-stage.js:63-64` |
| Sensación | 6,5 | La cara A respira; en la cara B la tarjeta de resultado corta la caída de la pista. Inferido del código, no jugado. | `places.js:122` |
| Cohesión | 7 | Mismo anillo en el final del Viaje, en Tu canción y en el mundo. Pero tres créditos casi iguales y una cara B sin forma propia. | `journey-finale.js:16`, `song-stage.js:21-22` |
| Pulido | 6,5 | La hoja Lugares abre recortada; la tarjeta mezcla logros con el cierre; Tu canción deja vacío el tercio inferior. | `21-lugares`, `33-resultado`, `22-cancion` |

**Media: 7,1**

## Lo que funciona

1. **La cara A tiene arco.** Cada pista sube por Llegada, Pertenencia y Plenitud (`journey-chapters.js:12`). La Tormenta tiene suelo más alto: es el clímax (`journey-chapters.js:17-18`). El Vacío queda casi en silencio, tope 0,1 (`journey-chapters.js:20`). Los tempos de familia bajan y suben con intención: house, downtempo, disco, techno, ambient (`journey-chapters.js:26`, `:64`). Eso es secuenciar un disco.
2. **Cada pista empieza callada.** Al cruzar el portal la música vuelve a Llegada (tope 0,38). Es una intro real, no un corte a tope (`journey-chapters.js:126`, `:12`).
3. **La salida de cada pista está esperada.** El portal no se abre hasta que suena la caída de dos compases y pasan cuatro segundos (`journey-chapters.js:31`, `:118`; `journey-victory.js:5`).
4. **El final del Viaje anuncia la cara B.** Cinco anillos encendidos y seis apagados, debajo de los créditos (`journey-finale.js:100-110`). Sin texto ya se entiende que el disco sigue. La línea «Quedan seis por descubrir» lo refuerza (`journey-finale.js:16`).
5. **Tu frase con nombre y verbo.** Mientras suena tu frase de cada capítulo, la pantalla dice el lugar y su verbo (`journey-finale.js:105-106`). Son las notas del libreto.
6. **Un compás de silencio antes del tema.** El gran final reúne capas, luego tus frases, luego calla, luego el tema dos veces (`song-stage.js:49-54`, `:57-58`). La melodía de Faros se guarda hasta después del tema (`song-stage.js:62`). Es el gesto correcto.
7. **Los huecos entre pistas suenan.** El portal siguiente se oye en el «3» del compás, desde su lado, aunque esté lejos (`places-ring.js:13-15`, `:82-83`). El paseo entre lugares es un interludio, no tiempo muerto.
8. **El anillo cierra el círculo.** Cueva queda junto a Llanura en Tu canción: la última pista toca la primera (`22-cancion`).

## Lo que falla o falta

1. **La cara B no tiene forma.** Los seis lugares nuevos usan la misma curva de energía: suelo `.2+.6·p`, tope `.4+.6·p` (`journey-garden.js:59`, `journey-surf.js:50`, `journey-resonance.js:44`, `journey-guide.js:56`, `journey-rebuild.js:61`, `journey-echo.js:53`). Fuera del Viaje no hay Llegada ni Plenitud: `tick()` borra tope y suelo (`journey-chapters.js:133`). No hay clímax ni coda en la cara B. Seis pistas con la misma dinámica.
2. **Las pistas de la cara B no tienen sonido fijo.** Los capítulos eligen familia musical (`journey-chapters.js:64-69`). Las rondas solo buscan el bioma más cercano, sin familia (`places.js:94`). Jardín puede sonar distinto para dos personas. Un disco necesita que la pista 6 sea la pista 6.
3. **La última pista no fluye al final.** Tras la ronda 11 sale la tarjeta de resultado con porcentajes y logros. «Seguir hacia» se oculta y queda «Salir» (`places.js:137`; `index.html:138`). El gran final solo llega al pulsar «Salir» (`places.js:135`, `song-stage.js:123-124`). Si pulsas «Otra vez», el clímax del juego se aplaza. El momento más grande depende de un botón administrativo.
4. **La tarjeta corta la caída de cada pista.** La caída dura dos compases (unos 4 s a 120 bpm; `journey-victory.js:5-6`). La tarjeta sale a los 1,2 s fijos (`places.js:122`), sin esperar la duración que devuelve `journeyVictory`. En la cara A el portal sí espera (`journey-chapters.js:118`). Las dos caras cierran sus pistas de forma distinta.
5. **Tres créditos casi iguales.** El final del Viaje, el de once lugares y el maestro terminan con las mismas tres líneas (`journey-finale.js:16`, `song-stage.js:21-22`). Créditos a los 15–20 min y otra vez a los ~35–40 min (modelo: victoria a 32,9–39,9 min). Los créditos pierden peso la segunda vez. La versión maestra repite el mismo plan con otras palabras (`song-stage.js:125`).
6. **Las capas entran demasiado rápido en el gran final.** Una capa por compás (`song-stage.js:18`, `FINAL_ENTRY_BARS=1`): once capas en unos 22 s. Las pistas que costaron minutos aparecen en dos segundos cada una. No lo oí; es una medida del plan.
7. **El tracklist abre mal.** La hoja Lugares aparece desplazada: un botón cortado arriba y el final de la lista abajo (`21-lugares`). Para un disco, la portada trasera debería leerse de 1 a 11 de un vistazo.
8. **La pista termina en una hoja de cálculo.** «74,6 % / 75 % a tiempo», «+102 ✦», «8 logros nuevos» (`33-resultado`). Es información útil, pero llega encima del último compás de la pista.
9. **Los capítulos se parecen a la vista.** Llanura, Lago, Jardín y Cueva son gris sobre negro con glifos distintos (`01`, `02`, `10`, `15`). El color de cada pista sí existe en Tu canción (`22-cancion`), pero en el mundo casi no se ve. Las cinco marcas de capítulo miden 3 px (`journey-chapters.js:166`).

## Recomendaciones

1. **Dar forma a la cara B.** Aplicar a las rondas una curva por lugar, como `STATE_CAP`/`STORM_FLOOR` de la cara A. Por ejemplo: Jardín abre suave, Faros es el clímax (lleva la melodía), Cueva es la coda con tope bajo. Tocar en `places.js` (tabla por lugar) y en el cálculo de suelo de cada juego.
   *Bien cuando:* una tabla en `places.js` asigna suelo/tope distinto a los seis lugares, y en una ronda completa Faros mide más voces por segundo que Jardín y Cueva menos que Faros (misma medida que la Tormenta en la cara A).
2. **Fijar el sonido de cada pista.** Dar a los seis lugares una familia, como `CHAPTER_FAMILIES`, y buscarla con `findChapter` en `places.js:94`. Sin tocar la generación: solo elegir dónde empieza la ronda.
   *Bien cuando:* con tres guardados de centros distintos, cada lugar suena siempre en la misma familia (prueba unitaria sobre `familyOf` del punto elegido).
3. **Que la pista 11 desemboque en el final.** Al cerrar la ronda que completa los once, saltar la tarjeta o mostrarla después del final. Tocar en `places.js:122` y `song-stage.js:123`.
   *Bien cuando:* tras la última ★ que completa los once, el final empieza sin pulsar nada, en menos de un compás tras acabar la caída.
4. **Esperar la caída antes de la tarjeta.** Usar el valor que devuelve `journeyVictory(id)` en `places.js:122` en vez de 1200 ms fijos.
   *Bien cuando:* la tarjeta nunca aparece antes del fin de los dos compases de caída (prueba con `journeyVictoryState().end`).
5. **Un solo crédito largo.** El final del Viaje cierra la cara A sin créditos de autoría: solo «Tu mundo se abrió» y los seis anillos apagados. Los nombres quedan para el final de once. La versión maestra añade algo propio (por ejemplo, las capas en su variación entrando juntas). Tocar `journey-finale.js:16` y `song-stage.js:21-22`.
   *Bien cuando:* las líneas de autoría aparecen en un único final, y el maestro difiere del de once en su plan, no solo en el texto.
6. **Dar tiempo a cada capa en el gran final.** Subir `FINAL_ENTRY_BARS` a 2 manteniendo el mínimo de un minuto. Es presentación, no cambia la música.
   *Bien cuando:* cada capa suena sola al menos dos compases antes de la siguiente y el final sigue entre 60 y 120 s (medido con `songPlan`).

## Opinión en una frase

La cara A ya es un disco con clímax y coda; la cara B y el gran final todavía son una lista de pistas que terminan en una tarjeta.
