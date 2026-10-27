# 04 · Simogo — sesión 11
> Simulación de su mirada de diseño a partir de su obra pública. No es su opinión real. Revisó alpha.215 (`5464612`; el árbol leído está en `fe3cc68`, que solo toca el verificador): el arco del Viaje y su final, el paso de la ronda once al final de Tu canción, los créditos; capturas 01–05, 20, 21, 22 y 33; medidas con Node sobre `songPlan` y `finaleScore`.

## Notas (puntuación ciega)
| Eje | Nota | Evidencia y alcance |
|---|---|---|
| Visual | 7 | Cada pista del Viaje tiene su forma (rombos, lotos, círculo del Bosque, rayas de la Tormenta, vacío casi negro: capturas 01–05). Todas en gris hasta recuperar el color (`world-sheet.js:31`). El escenario de Tu canción es claro, pero deja vacío el tercio bajo (captura 22). |
| Audio | 6,5 | Solo estructura leída, sin escucha. El final de los once tiene forma de disco: entradas, frases sobre colchón y bajo, un compás de silencio, tema dos veces (`song-stage.js:59-77`). El Viaje cierra con 28 s de tus notas y el tema (medido). |
| Creatividad | 8 | Los anillos son la portada del disco: el Viaje enciende cinco y deja seis apagados como cara B (`journey-finale.js:106-112`). Tus notas vuelven en el final con tu ritmo (`journey-finale.js:27-34`). |
| Sensación | — | Me abstengo. Nadie ha tocado con las manos ni oído en teléfono. El arco se lee en el código, no se siente. |
| Cohesión | 7,5 | Un mismo dibujo (`drawSongRings`) une el final del Viaje, Tu canción y el final de los once. El último golpe falla: tras los créditos vuelve la tarjeta de la ronda (`places.js:155`). |
| Pulido | 6,5 | Dorado fuera de las ★ (`estilo-j.css:599`, `:609`). Tres textos dicen lo mismo al salir del Viaje (`journey-finale.js:18`, `:82`). Los créditos vuelven en cada «Otra vez» (`song-stage.js:104`, `:134`). |

## Lo que funciona hoy
- **El orden de pistas existe.** Cinco capítulos con clímax en el cuarto: la Tormenta tiene suelo de energía propio (`journey-chapters.js:18`). El quinto, el Vacío, baja casi a silencio (`VOID_CAP=.1`, `:21`). Es la forma correcta de un disco: clímax y luego la pista quieta.
- **Cara A y cara B.** El Viaje cierra con una sola línea, «Tu mundo se abrió» (`journey-finale.js:18`). Debajo, once anillos pequeños: cinco encendidos y seis por encontrar (`:111-112`). No hace falta explicar nada.
- **La paleta se gana pista a pista.** Las marcas del Viaje guardan el color de cada capítulo terminado (`journey-chapters.js:171-172`). En las capturas 04 y 05 se ve crecer: naranja, azul, verde, violeta.
- **La ronda once fluye sola al final.** La tarjeta espera; el escenario abre en el compás siguiente al golpe de la ronda (`places.js:143-153`, `FINALE_LEAD=.3`).
- **El final de los once tiene forma.** Medido a `SIX=.125`: once compases de entradas, once de tus frases, uno de silencio, cuatro de tema; créditos al segundo 54, total 60 s. El silencio no lleva texto (`song-stage.js:52`).
- **Los créditos son breves y humanos.** «Jay · diseño y código», «Luca · primer jugador» (`song-stage.js:23`). Una sola vez en la cara B, no en el Viaje.

## Lo que falta o salió mal
1. **Alta. Tras los créditos vuelve el marcador.** Al pulsar «Seguir» en el final, `close()` llama a `placeFinaleClosed` (`song-stage.js:109`) y este abre la tarjeta de la ronda (`places.js:155`, `results()`). Después de «Luca · primer jugador» aparece «Cueva · Completo», un porcentaje, ✦ y «Seguir hacia …» para la siguiente ★★ (la captura 33, forzada, muestra cómo es esa tarjeta). Es poner el ticket de compra después de la última canción.
2. **Media. Los créditos no son únicos.** «Otra vez» del final y «Tu canción» en Lugares abren el final completo otra vez (`song-stage.js:104`, `:142`; `refugio-lugares.js:82`; `controls.js:26`). Cada repetición vuelve a mostrar los cinco créditos (`:134`). Los créditos dejan de ser un acontecimiento.
3. **Media. La salida del Viaje habla tres veces.** «Tu mundo se abrió» en dorado, luego el aviso «Se abre el Mundo libre.» (`journey-finale.js:82`), y el logro «Prólogo» queda pendiente (`narrator.js:70`, `:117`). La línea única pierde su peso.
4. **Media. Dorado fuera de las ★.** El contador «5 / 11» de Lugares es dorado (`estilo-j.css:599`; captura 21). El botón «Explorar a pie» es un bloque dorado (`:609`). «Tu frase · verbo» del Viaje también (`journey-finale.js:108`). Va contra D4.
5. **Media. El final de los once no termina.** La música de capas acaba (`song-stage.js:115`, `run.done`), pero el escenario queda abierto sin límite. El final del Viaje sí se cierra solo a los 7 s (`journey-finale.js:116`). Dos finales con dos gramáticas.
6. **Baja. La cola depende del tempo.** El mínimo de 60 s alarga la cola tras los créditos: 6 s a `SIX=.125`, 17,6 s a `SIX=.1` (medido). En tempo rápido los créditos caen a mitad del minuto.
7. **Baja. El escenario de Tu canción deja vacío el tercio bajo.** Anillos en `H*.44` (`song-stage.js:35`); entre «Vacío» y los botones hay unos 250 px negros (captura 22). Ahí cabría el texto que ahora va arriba.
8. **Baja. Los capítulos se parecen en color.** Las cinco capturas son grises hasta recuperar el bioma. La identidad la llevan las formas. Es una decisión fuerte; pide que la forma de cada pista sea muy distinta. La Llanura y el Bosque se parecen (capturas 01 y 03).

## Contraste con la sesión 10
Notas de la sesión 10: 7 · 7,5 · 8 · 6,5 · 7 · 6,5. Hoy: 7 · 6,5 · 8 · — · 7,5 · 6,5. El audio baja porque esta vez solo puntúo la estructura que leo, no porque algo empeorara; la sensación pasa a abstención.

**Cerrado**
- La pista 11 desemboca en el final sin tarjeta delante (`places.js:143-153`; P6, D5-A). Era mi punto 3.
- La tarjeta espera el fin de la caída (`places.js:148-151`; P4). Era mi punto 4.
- Créditos de autoría en un solo final; el Viaje dice solo «Tu mundo se abrió»; la maestra, sus dos líneas (`journey-finale.js:18`, `song-stage.js:23-24`). Era mi punto 5, en su parte de texto.
- La tarjeta ya no lista logros (captura 33; P4). Era mi punto 8.
- Marcas de capítulo de 4 px con el color ganado (`journey-chapters.js:171-172`; P3, P7). Parte de mi punto 9.

**Abierto**
- La cara B sigue sin forma: los seis juegos usan el mismo suelo `.2+.6·p` (`journey-garden.js:59`, `journey-surf.js:50`, `journey-guide.js:56`, `journey-echo.js:56`). Quedó «sin consenso» en el informe.
- Las rondas siguen buscando el bioma sin familia musical (`places.js:112`).
- Una capa por compás en el gran final (`song-stage.js:18`, `FINAL_ENTRY_BARS=1`): once capas en 22 s. También «sin consenso».
- La hoja Lugares tiene filas enteras (P1), pero abre a mitad de lista: no se lee de 1 a 11 (captura 21).
- El maestro sigue siendo el mismo plan con otras palabras (`song-stage.js:140`, solo cambia `MASTER_LINES`).

**Empeoró o es nuevo**
- Nuevo: la tarjeta de la ronda once llega **después** de los créditos (`places.js:155`). P6 lo dejó así a propósito; como disco, es el punto más débil del final.
- Nuevo: los créditos se repiten en cada «Otra vez» del final (`song-stage.js:104`, `:134`). D5-C cerró los textos, no las repeticiones.
- Sigue y ahora choca con D4: el contador «5 / 11» y «Explorar a pie» en dorado (`estilo-j.css:599`, `:609`).

## Qué haría ahora
1. **La tarjeta de la ronda once, antes o nunca.** Mostrar sus ★ y porcentaje dentro del escenario, en la fase de entradas, o guardarla en la Bitácora. Al cerrar el final, volver al anillo en silencio. Tocar `places.js:154-155` y `song-stage.js:109`.
   *Bien cuando:* tras pulsar «Seguir» en el final de once, no se abre `#mPlace` y la siguiente pantalla es el Mundo (prueba en `song_finale_flow_smoke.py`).
2. **Créditos una vez de verdad.** Guardar `d.credited` al mostrarlos; en repeticiones, el final termina en «Tu canción está completa» sin nombres. Tocar `song-stage.js:134` y `places.js:51` (normalizar el campo, sin borrar nada).
   *Bien cuando:* en dos aperturas seguidas del final, la segunda no muestra «Jay · diseño y código» (prueba Node sobre el estado).
3. **Un solo mensaje al salir del Viaje.** Quitar el aviso «Se abre el Mundo libre.»; la línea dorada y los seis anillos ya lo dicen. Tocar `journey-finale.js:82`.
   *Bien cuando:* entre «Tu mundo se abrió» y el primer toque libre no aparece ningún aviso de texto.
4. **Dorado solo para ★.** Contador de Lugares en blanco y «Explorar a pie» como botón blanco. Tocar `estilo-j.css:599` y `:609`.
   *Bien cuando:* en las capturas 21 y del final del Viaje, el único dorado son ★ y la línea del título.
5. **Que el final de los once acabe como el del Viaje.** Al terminar la cola, cerrar solo tras unos segundos de silencio, como `CREDITS=7`. Tocar `song-stage.js:115`.
   *Bien cuando:* sin tocar nada, el escenario se cierra entre 5 y 10 s después del último compás (medido con `songStageState()`).
