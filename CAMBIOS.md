# Cambios recientes de Kubono

Estado: 28 de octubre de 2026. Código **2.3.0-alpha.233** en la rama `jay/h1-chispas`. Las entradas describen su revisión, no certifican producción.


## Chispas solo en el universo (H1) · 2.3.0-alpha.233

Rama `jay/h1-chispas`, desde `main` (`2b3daf3`, alpha.231). En paralelo van `jay/arreglos-g` (alpha.232) y `jay/h2-refugio`. Decisión de Jay: las chispas de los niveles no se mezclan con las del mundo abierto. Guía: [El mundo](docs/MUNDO.md#chispas-y-colección) y [economía antes y después](docs/HALLAZGOS_Y_ACTIVIDADES.md#chispas-solo-en-el-universo).

- **Los niveles dan ★ y Tu canción, no ✦.** Cerrar una ronda (también Maestro y remezcla) no paga chispas (`LEVEL_SPARKS` en `spark-rules.js`; `places.js`, `wild.js`). El Camino es parte del Viaje: sus cristales dan luz, no ✦, también en el paseo del día (`sparks.js`, `crystal-sparks.js`). Dentro de un nivel no se abren actividades ni travesuras, las esculturas no pagan y las metas de chispas esperan a que salgas.
- **HUD y hoja.** Dentro de un nivel (y con la hoja de la ronda abierta) el HUD muestra ★ y lugares, sin ✦. La hoja de fin de ronda dice el tiempo y el récord, sin chispas. En el Mundo libre el contador ✦ vuelve igual.
- **El universo paga más.** Cristales del Mundo ×3 (3, 9 o 15 ✦, mismos fragmentos), encuentros vivos 30/45 ✦ (eran 10/15), figura nueva del Mapa del cielo 20/30 ✦ (10/15), actividad 30 ✦ (15), travesura 20 ✦ (10), chispa salvaje 45 ✦ (15). Precios de la tienda iguales.
- **Economía** (`node scripts/play-curve.mjs`; el modelo ya no paga rondas y supone 1,6 min de Mundo tras cada ronda). Chispas a 30/60/120 min, alpha.231 → alpha.233: 60 %, 486/1.626/3.915 → 394/1.545/3.848; 75 %, 679/2.175/6.054 → 668/2.091/4.841; 90 %, 890/3.074/7.217 → 872/3.046/7.005; sin sonido, 532/1.634/3.884 → 352/1.256/3.107. Veinte minutos solo explorando: 11–20 % del precio de la tienda (antes 4–7 %). Tienda completa con la mitad del tiempo en lugares: 6,9 → 5,6 h y 5,2 → 3,8 h.
- **Guardado.** Sin migración ni cambio de formato: nadie pierde chispas ni compras; las ya ganadas en rondas se quedan. Una ronda a medias se termina sin chispas.
- **Textos.** «Cómo jugar» dice que las chispas se ganan en el universo abierto, no en los niveles, que los lugares dan estrellas y Tu canción, y los importes nuevos de encuentros y travesuras; inglés en `i18n-en.js`.
- Pruebas actualizadas sin quitar aserciones de otras cosas: lógica (`spark-rules`, `play-curve`, `spark-economy-sim`, `sparks-economy`, `places*`, `crystal-*`, encuentros vivos, Mapa del cielo) y recorridos de navegador (lugares, hoja de ronda, remezcla, Camino, cristales, encuentros vivos, Mapa del cielo, Viaje, inglés). Capturas a 390×844 del HUD en un nivel, la hoja y el HUD en el Mundo.
- Preservación: cambian a propósito archivos protegidos (rondas, chispas, cristales, actividades, travesuras, remezcla y la lista offline de `sw.js` por la versión), con su capa `approvedH1`. Probado en local; sin CI remoto, sin teléfono ni personas.


## Arreglos de Jay G1–G3 · 2.3.0-alpha.232

Rama `jay/arreglos-g`, desde `main` (`2b3daf3`, alpha.231 con A–E y el Mapa del cielo). Jay jugó alpha.231 y pidió tres arreglos.

- **G1 · El cierre de cada ronda, limpio.** Jay: «Cuando se acabe un nivel, pantalla en negro, sale el botón de las estrellas, se presiona lo que el usuario quiera y seguimos». El orden de P4 no cambia: la hoja espera a que se oiga el fin de la caída de dos compases. Ahora la pantalla pasa a negro opaco (antes un velo negro al 80 % dejaba ver el Mundo detrás) y la hoja aparece encima con sus ★: dorado solo lo ganado. Un solo botón blanco, el que sigue: «Seguir hacia …»; sin siguiente lugar en el camino (antes no quedaba ninguno blanco), «Otra vez». Tocar el negro no la cierra ni mueve el cubo; el Mundo no se ve detrás y los avisos esperan a que se cierre. «Otra vez», «Seguir hacia …», «Maestro» y «Cerrar» siguen como estaban. Los capítulos del Viaje no usan esta hoja (abren su portal en el Mundo) y la ronda Libre sigue sin hoja (solo música). La ronda que completa los once sigue pasando sola al final (D5).
- **G2 · Sin «Paseo musical».** El botón ▷ del Mundo (`#bAuto`) y su gemelo en Favoritos (`#favWalk`) quedan ocultos en todas las vistas; ids y código se conservan y las pruebas lo activan por código (`startAutopilot`). Su logro «Dejarse llevar» queda retirado: lo conserva quien ya lo tenga y no se pide a nadie más. «Viajar automáticamente» (▶ de una ruta a un favorito) no cambia.
- **G3 · Mensaje al completar los once.** Al cerrarse el final de los once (su música no cambia), una hoja sobre negro: «Completaste los once lugares. Aún te quedan estrellas por ganar en cada uno: ★★ a tiempo, ★★★ Maestro. Ya puedes saltar a otro paisaje. El primer salto es gratis. El universo es infinito. Explóralo: encontrarás maravillas.» Un botón blanco, «Explorar», la cierra y te deja en el Mundo, con «Otro paisaje» en el dock (regla B de alpha.230). Sale una sola vez (`S.elevenNote`, versión 1, migrado sin perder campos; una versión futura se respeta); si falla el guardado, no se repite en la sesión. Las partidas que ya tenían los once lo ven una vez al volver al Mundo. Lugares lo guarda: «Completaste los once lugares ›». Sin ★ por ganar, la línea de estrellas no sale; con el salto gratis ya usado, solo «Ya puedes saltar a otro paisaje». Módulo nuevo `src/eleven-note.js`.
- Inglés de todo lo nuevo en `i18n-en.js`.
- Pruebas nuevas: `tests/eleven-note.mjs`, `tests/arreglos_g_smoke.py` (G1 y G2), `tests/eleven_note_smoke.py` (G3, también en inglés). Ajustadas: `focusui_smoke.py` y `cultures_smoke.py` (ya no pulsan ▷).
- Preservación: cambian a propósito dos archivos protegidos (`main.js`, que carga el módulo nuevo, y `achievement-metadata.js`, el logro retirado) y la lista offline de `sw.js` (un módulo nuevo), con su capa `approvedG`. Sonido sin cambios (sin render nuevo). Probado en local; sin CI remoto, sin teléfono ni personas.

## Mapa del cielo (F1) · 2.3.0-alpha.231

Rama `universo/f1-mapa-del-cielo`, desde `main` (`ccb661a`, alpha.230). Primera fase del [catálogo del universo](docs/IDEAS_UNIVERSO.md), elegida por Jay con sus decisiones del 28 de octubre. Guía: [Mapa del cielo](docs/HALLAZGOS_Y_ACTIVIDADES.md#mapa-del-cielo).

- **Estrellas que se unen.** En el Mundo libre, tras el Viaje, estrellas tenues forman 28 figuras con nombre: el zodiaco (12), el cielo del norte (5), el del sur (3) y ocho propias, con «La Mano» como guiño secreto. Se colocan con `hashKey` en celdas de 500 m, como mucho una por celda; más de noche (hora real) y en el Vacío, los Púlsares y la región Constelaciones. Rareza por distancia al origen: cortas cerca, zodiaco desde 5 km, raras desde 20, la leyenda desde 50; Osa Mayor al norte, Cruz del Sur al sur. Nada del mapa se mueve.
- **Unir en orden.** Al acercarse: «Mapa del cielo · Orión». La siguiente estrella va en blanco con aro y la flecha blanca la señala; pasar por otra no hace nada. Un pulso a tiempo cerca enciende la siguiente y la de después si está igual de cerca. Cada estrella suena con una nota de la escala del lugar a la corchea siguiente y su línea crece en un pulso. Completa, brilla 3 s, toca su motivo de 5–8 notas una octava arriba y queda como un dibujo tenue.
- **Reversible.** Alejarse la deja a medias y guardada («Orión · 4 de 7 · guardada»); al volver sigue igual. La Bitácora la muestra con su dirección y «Soltar». Sin tiempo límite ni castigo.
- **Uno a la vez.** Las estrellas esperan mientras hay un encuentro vivo o una travesura; mientras se une una figura no empieza ninguno, el reloj de los encuentros espera y vuelve a cero al acabar (`liveEncounterRest`).
- **Premios.** 10 ✦, o 15 ✦ con un pulso a tiempo, la primera vez por figura, con un aviso; repetir no paga (la ficha dice «paga chispas una vez»; lo repetible ya lo pagan los encuentros). El zodiaco completo da el **halo de estrellas** dorado alrededor del cubo, con su aviso; se quita y se pone en Tu cubo → Llevar («Mapa del cielo», `#cubeSkyHalo`). Economía (`node scripts/play-curve.mjs`, alpha.230 → alpha.231, a los 120 min): 60 % 3.874 → 3.915, 75 % 6.010 → 6.054, 90 % 7.133 → 7.217, sin sonido 3.852 → 3.884 ✦; menos del 3 %, y se detiene.
- **Bitácora.** Mapa → «Mapa del cielo · N de 28»: las figuras a medias y cada serie con sus figuras dibujadas o en silueta.
- **Sonido.** Estrella a 0,012 y motivo a 0,02, en la escala y la corchea del lugar. Render (`tests/sky_map_mix.py`): la música del Mundo igual que en alpha.230 y alpha.226; las notas, 32,8–32,9 dB por debajo. Escucha en teléfono: pendiente.
- **Guardado.** `S.skyMap` versión 1, migrado sin perder nada (campos y figuras desconocidos conservados, versión futura intacta), acotado a 64 figuras a medias y 200 completas por sitio.
- **Atajo** `?cielo=orion` (cualquiera de los 28 ids), en [herramientas](docs/MUNDO.md#herramientas-de-prueba).
- Inglés de todo lo nuevo en `i18n-en.js` («Sky map»).
- Pruebas nuevas: `tests/sky-map.mjs`, `tests/sky-map-runtime.mjs`, `tests/sky_map_smoke.py`, `tests/sky_map_halo_smoke.py`, `tests/sky_map_mix.py`. Ampliadas: `tests/play-curve.mjs` y `tests/audio_mix.mjs` (`skyBatch`).
- Preservación: cambian a propósito cuatro archivos protegidos (`main.js`, `render.js`, `universe-mischief.js` y la vista previa de `cube.js`) y la lista offline de `sw.js` (tres módulos nuevos), con su capa `approvedF1`. Probado en local; sin CI remoto, sin teléfono ni personas.

## Arreglos de Jay A–E · 2.3.0-alpha.230

Rama `jay/arreglos-a-e`, desde `main` (`25ed913`, alpha.229 con `?rapido=2`). Jay jugó alpha.229 y pidió cinco arreglos. Regla para todos: siempre se ve el siguiente paso, siempre se puede volver sin perder nada, nada cambia para siempre sin avisar, sin castigos.

- **A · `?rapido=2` corto de verdad.** Además del veinteavo: el Camino pide **2 cristales** (los otros ocho cuentan como hechos, marcados `rapido:`), y un capítulo cumplido abre su portal **a 1 s** en vez de esperar a que suene su cierre (4–6 s). Cada capítulo se cierra en 2–3 pulsos. Tras recargar, el Vacío conserva su cielo corto (antes volvía a 12 estrellas). El final del Viaje no cambia (su música está aprobada; «Saltar» lo cierra al momento). `?rapido=1` y el juego normal, igual. **Medido** con un bot que camina a la velocidad del cubo y toca a tiempo, de la primera pantalla al Mundo libre a 390×844 (`tests/rapido2_viaje_smoke.py`): **69,0 s** (antes 112,7 s; final 35,6 s incluido). Una persona tardará más (leer, buscar): unos 2–3 min estimados, no medidos.
- **B · «Otro paisaje» y «Viajar a otra tierra» tras los once lugares.** Antes no aparecen en ninguna parte: ni en el dock, ni en «Más», ni en Tu cubo (su botón, su texto y la meta «Ahorrar para un salto»), y el código rechaza el salto. El primer salto gratis (`S.journey.freeJumpUsed`) es el primero tras los once. «Volver al punto anterior» sigue igual. Quien ya está en otra semilla conserva el camino de vuelta; `?dev=1` y un servidor local conservan sus herramientas.
- **C · Sin «Estilos».** `#bStyles` queda oculto en todas las vistas (id y hoja conservados; `openMusicTravel` la abre por código para las pruebas).
- **D · Encuentros vivos más claros.** Al empezar, su nombre y su verbo («Polilla de luz · atrápala») con su línea debajo. En los tres verbos, un aro blanco fino alrededor del cubo con el tiempo que queda (se llena en los de huir que basta aguantar, como antes) y una flecha blanca siempre visible al siguiente paso (la de perseguir era del color del bioma). Al ganar, una explosión de luz breve en el color del bioma; al escaparse o fallar, se aleja despacio desvaneciéndose (1,4 s) con su despedida. Después, una línea: «Polilla · atrapada · +15 ✦», «Ola · te alcanzó · sin premio». Las palabras siguen «Textos en el universo» y la vista tranquila; el aro, la flecha y el final no. Reglas, premios y frecuencia sin cambios.
- **E · No quedar a 77 km sin salida.** Lugares ofrece **«Volver al anillo»** siempre tras el Viaje, gratis: lleva al centro del anillo, un paso hacia el siguiente portal (nunca a un lugar nuevo ni a otra tierra), y la brújula apunta al siguiente lugar. Lejos del anillo va primero; dentro, bajo «Seguir hacia …». Pasa por el mismo viaje que los demás, así que «Volver al punto anterior» te devuelve donde estabas. El «Ir» de lejos (alpha.226) sigue siendo solo al siguiente lugar, junto a su portal, a más de 9600 px: no es un salto libre.
- Inglés de todo lo nuevo en `i18n-en.js`.
- Pruebas nuevas: `tests/rapido-2.mjs`, `tests/live-encounters-clear.mjs`, `tests/rapido2_viaje_smoke.py`, `tests/live_clear_smoke.py`, `tests/arreglos_ae_smoke.py`. Ajustadas a la nueva regla del salto: `practice-travel.mjs`, `sparks-economy.mjs`, `notas_jay_smoke.py`, `crystal_play_smoke.py`, `entry_jump_smoke.py`, `journey_ui_smoke.py`, `practice_travel_smoke.py`, `game_loop_smoke.py`, `sparks_economy_smoke.py`. Abren «Estilos» por código: `ambient_world`, `focusui`, `lab_score`, `micro_instruments`, `music_menu`, `music_travel`.
- Preservación: cambian a propósito siete archivos protegidos (`chapter-test.js`, `crystal-sparks.js`, `journey-chapters.js`, `journey-release.js`, `music-travel.js`, `practice-travel.js`, `sparks.js`), con su capa `approvedAE`. Sonido sin cambios (sin render nuevo). Probado en local; sin CI remoto, sin teléfono ni personas.

## Prueba más rápida · `?rapido=2`

Jay pidió pasar los cinco capítulos aún más rápido para probarlo todo. `?rapido=2` pone las metas de capítulos y rondas a un veinteavo, con el mismo guardado propio que `?rapido=1`. Sin el parámetro nada cambia. Recorrido `notas_jay_smoke` ampliado.

## Encuentros vivos · tanda 3 (hacer) · 2.3.0-alpha.229

Rama `universo/e3-hacer`, desde `main` (`fc7c4f8`, alpha.228, con las tandas 1 y 2 integradas). Tercera y última de las tandas que aprobó Jay: con ella están los 33. Guía: [Encuentros vivos](docs/HALLAZGOS_Y_ACTIVIDADES.md#encuentros-vivos).

- **Los once de hacer**, sobre el mismo motor (filas, un comportamiento corto cada uno y la regla `hacer`): cinco motas en orden, estrellita perdida, burbujas al ritmo, guardián de piedra, cinco brotes, caravana, nodos que suenan, cuatro púlsares, antena caída, luciérnagas del pozo y constelación. Tareas de 26–30 s con el objetivo a la vista: números, destino marcado, pasos en cuadraditos bajo el cubo y un arco que se vacía con el tiempo.
- **Perseguir, huir o hacer:** el temporizador común de 60–90 s no cambia; la misma tirada (`live:pick:v1`) se reparte ahora en tercios. Frente a alpha.228, las tiradas de 1/3 a 0,5 pasan de perseguir a huir y las de 2/3 en adelante, de huir a hacer (en 20.000 tiradas: 33,3 / 33,4 / 33,3 %).
- **Tocar a tiempo ayuda siempre:** suma 1 s (hasta 6) y cuenta doble, acelera, protege o evita que se apague, según el encuentro. Se completa también sin tocar a tiempo y sin sonido (reloj fijo; los nodos quedan numerados). **Fallar no castiga:** si se acaba el tiempo, se seca un brote o te alejas, una despedida amable y sin premio. 10 ✦, o 15 ✦ con un pulso a tiempo; la primera vez de cada uno, a la Bitácora (33 en «Encuentros vivos», 190 familias) con un aviso (D3).
- **Dificultad medida** (bots en `tests/live-encounters.mjs`, 20 posiciones): reaccionando 1,5 s tarde y sin tocar a tiempo se completan los once siempre (también a 140 u/s y sin sonido); con pulsos a tiempo, siempre y más rápido. Un bot no duda: una persona tardará más.
- **Sonido:** la música no cambia. Al completar suena la nota discreta de las otras tandas; los nodos del Prisma suenan, más bajo, al encenderse y al tocarlos. Render: música igual a alpha.226 y las treinta y ocho notas 28,8–29,6 dB bajo la música.
- **Economía** sin cambios de importes ni precios. Modelo de dos horas, alpha.228 → alpha.229, jugador al 75 %: 30 min 671 → 673 ✦, 60 min 2.149 → 2.154, 120 min 6.000 → 6.010; tienda entera 6,9 h (casual) y 5,3 → 5,2 h (a tiempo).
- «Cómo jugar» dice «huir o hacer algo». Inglés completo en `i18n-en.js`. Atajo `?encuentro=motas` (o cualquiera de los treinta y tres).
- Pruebas nuevas: `tests/live_do_a_smoke.py`, `tests/live_do_b_smoke.py`, `tests/live_do_c_smoke.py` (con `tests/live_do_helpers.py`). Ampliadas: `live-encounters.mjs`, `live-encounters-runtime.mjs`, `live_encounters_mix.py` y `audio_mix.mjs`. Ajustadas a las 190 familias: `element_book`, `journal-album`, `discoveries_smoke.py`.
- Preservación: no cambia ningún archivo protegido (sin capa `approvedE3`). No probado en teléfono ni con personas; sin CI remoto.

## Encuentros vivos · tanda 2 (huir) · 2.3.0-alpha.228

Rama `universo/e2-huir`, desde `main` (`36fab14`, alpha.227, con la tanda 1 integrada). Segunda de las tres tandas que aprobó Jay. Guía: [Encuentros vivos](docs/HALLAZGOS_Y_ACTIVIDADES.md#encuentros-vivos).

- **Los once de huir**, sobre el mismo motor (filas, un comportamiento corto cada uno y la regla `huir`): remolino de polvo, enjambre celoso, ola gigante, derrumbe al compás, nube de polen, tormenta de arena, rayos del prisma, ondas del púlsar, lluvia de llamaradas, pozo que arrastra y agujero negro. Escapar es llegar a un lugar seguro visible, salir de un círculo, alejarse o aguantar 10–14 s.
- **Perseguir o huir:** el temporizador común de 60–90 s no cambia; la tirada que ya existía (`live:pick:v1`) elige: por debajo de 0,5, el de perseguir de siempre; desde 0,5, el de huir del bioma. Cuándo y dónde aparecen, igual.
- **Tocar a tiempo ayuda siempre:** un pulso a tiempo protege 1 s y, según el encuentro, deshace, frena, sopla o te hace saltar fuera. **Que te alcance no castiga:** el cubo se desvía un segundo, una despedida amable y sin premio. 10 ✦ al escapar, 15 ✦ si usaste un pulso a tiempo; la primera vez de cada uno, a la Bitácora (22 en «Encuentros vivos», 179 familias) con un aviso (D3).
- **Legibilidad:** amenaza en el color del bioma, lugar seguro en blanco, flecha blanca junto al cubo y arco que se llena si basta aguantar. Las criaturas de la tanda 1 se perdían sobre algunas luces: halo más fuerte, disco oscuro y aro fino de su color; mismo tamaño, cubo igual de pequeño.
- **Sonido:** la música no cambia. Al escapar suena la misma nota discreta de la tanda 1. Render: música igual a alpha.226 y las veintidós notas 28,6–29,8 dB bajo la música.
- **Economía** sin cambios de importes ni precios. Modelo de dos horas, alpha.227 → alpha.228, jugador al 75 %: 30 min 669 → 671 ✦, 60 min 2.142 → 2.149, 120 min 5.985 → 6.000; tienda entera, 7 → 6,9 h (casual).
- «Cómo jugar» dice que unas veces hay que atrapar y otras huir. Inglés completo en `i18n-en.js`. Atajo `?encuentro=ola` (o cualquiera de los veintidós).
- Pruebas nuevas: `tests/live_flee_a_smoke.py`, `tests/live_flee_b_smoke.py`, `tests/live_flee_c_smoke.py` (con `tests/live_flee_helpers.py`; tres archivos para quedar bajo 145 s). Ampliadas: `live-encounters.mjs`, `live-encounters-runtime.mjs`, `live_encounters_mix.py` (y `audio_mix.mjs`). Ajustadas a las 179 familias: `element_book`, `journal-album`, `discoveries_smoke.py`; `live_encounters_smoke.py` filtra los de perseguir.
- Preservación: no cambia ningún archivo protegido (sin capa nueva). No probado en teléfono ni con personas; sin CI remoto. La tanda 3 (hacer), pendiente.

## Encuentros vivos · tanda 1 (perseguir) · 2.3.0-alpha.227

Rama `universo/e1-perseguir`, **sobre `lanzamiento/m1-notas-jay`** (`2ae74a8`, alpha.226, PR #365 aún sin merge): dependencia explícita. Jay pidió algo que perseguir, huir o hacer en cada bioma; aprobó 33 encuentros en tres tandas. Esta es la primera. Guía: [Encuentros vivos](docs/HALLAZGOS_Y_ACTIVIDADES.md#encuentros-vivos).

- **Motor común** (`src/live-encounters-model.js`, `src/live-encounters.js`, `src/live-encounters-art.js`, en `SHELL` una vez cada uno). Uno cada 60–90 s de viaje en el Mundo libre, delante del cubo, de `hashKey`; nunca en capítulos, rondas, su tarjeta, finales, actividades, el Refugio ni bajo tierra. Uno a la vez, también con las travesuras (`universe-mischief.js` espera a que acabe). Las tandas 2 y 3 añaden filas, un comportamiento corto y la regla de su verbo.
- **Los once de perseguir**: polilla de luz, racimo saltarín, pez de onda, tambor rodante, semilla traviesa, cometa en el viento, tu reflejo, púlsar fugaz, llamarada viva, tu eco y estrella fugaz. Un pulso a tiempo cerca lo atrapa (o lo frena); alcanzarlo moviéndose también vale, pero cuesta más. Si se escapa, una línea de despedida y nada más.
- **Chispas al completarlos**: 10 ✦, 15 ✦ con un pulso a tiempo, cada vez. La primera de cada tipo va a la Bitácora (Colección, «Encuentros vivos»: 157 → 168 familias) con un solo aviso que la nombra (D3). Cobro y Bitácora, atómicos.
- **Economía al alza** (Jay): rondas 60–120 → 80–170 ✦; actividades 5 → 15 ✦ y travesuras 3 → 10 ✦, una vez por lugar (`spark-rules.js` reúne los importes). Precios sin cambios. Modelo de dos horas, jugador al 75 %: 30 min 474 → 669 ✦, 60 min 1.524 → 2.142, 120 min 4.259 → 5.985, piezas 45 → 53; toda la tienda, de 9,4 a 7 h (casual). Ningún guardado pierde chispas ni compras; no cambia ningún formato.
- **Sonido**: la música no cambia. Al atrapar, una nota de la armonía que suena con el instrumento melódico del lugar, a 0,02 de ganancia y en el pulso. `tests/live_encounters_mix.py` (nuevo): la música del Mundo renderizada desde este árbol y desde `2ae74a8` tiene el mismo pico y el mismo nivel en cada medio segundo (deriva ≤ 0,0003 dB, la del propio render), y las once notas quedan 29–31 dB bajo la música.
- **Dibujo**: formas simples en la luz del color de su bioma, del tamaño del cubo; una flecha pequeña junto al cubo (o en el borde) dice hacia dónde. Se dibujan sobre la luz del Mundo (`render.js`), para que se lean de noche. Una línea al aparecer; «Textos en el universo» la oculta. Cubo igual de pequeño.
- **Ayuda**: «Cómo jugar» explica los encuentros vivos en una línea y que las travesuras dan diez chispas. Inglés completo en `i18n-en.js`.
- **Atajo** `?encuentro=polilla` (o cualquiera de los once): ese encuentro tras 3 s de viaje. [Herramientas de prueba](docs/MUNDO.md#herramientas-de-prueba).
- Pruebas nuevas: `tests/live-encounters.mjs`, `tests/live-encounters-runtime.mjs`, `tests/live_encounters_smoke.py` (los once forzados, persecución, atrapar a tiempo, chispas, escape sin castigo, uno a la vez con travesuras, nunca en rondas, capítulos ni final; capturas a 390×844) y `tests/live_encounters_mix.py`. Ajustadas a los importes nuevos: `spark-rules`, `places`, `places-boundaries`, `places-durability`, `play-curve`, `spark-economy-sim`, `universe-activities-runtime`, `universe-mischief-runtime`, `universe_activities_smoke.py`; a las 168 familias: `element_book`, `journal-album`, `discoveries_smoke.py`. `tests/audio_mix.mjs` gana `liveBatch`.
- Preservación: capa `approvedE1` para los archivos protegidos que cambian a propósito (`main.js`, `render.js`, `universe-mischief.js`, `universe-mischief-art.js`, `universe-activities.js`, `spark-rules.js`, `element-book-model.js`, `content-manifest.js` y la lista offline de `sw.js`).
- No probado en teléfono ni con personas; sin CI remoto. Las tandas 2 (huir) y 3 (hacer), pendientes.


## Notas de Jay · 2.3.0-alpha.226

Rama `lanzamiento/m1-notas-jay`, desde `main` (`7106240`, alpha.225). Jay jugó `main` y pidió seis cambios.

- **Lluvia ligera.** La cama de ruido de la lluvia (`RAIN_BED`, `world-weather.js`) baja 12 dB, en calma y en tormenta. Render aislado nuevo, `tests/rain_mix.py`: −52,3 → −64,3 dBFS en calma y −43,8 → −55,8 dBFS en tormenta, a 48 kHz, frente a −13,6 dBFS de la música. Notas, armonías y el resto de la mezcla, iguales. Guía: [Universo](docs/UNIVERSO.md).
- **Final del Viaje más corto y «Saltar».** Mismo arreglo de Q7; el marco es más corto (reunión 0,8 s, silencio 1 s, «Tu mundo se abrió» 3,5 s) y nunca más lento que 120 BPM. Con el tempo por defecto y notas en los cinco capítulos: 44 s → 33 s; en el mundo más lento, 48 s → 33 s. «Saltar» (antes «Seguir explorando», abajo y a los 2 s) va arriba a la derecha, pequeño y negro, y responde a los 0,6 s; Escape igual. Deja el mismo estado que esperar al final. Guía: [Viaje](docs/VIAJE.md).
- **Ir a otro lugar tras el Viaje.** «Otro paisaje» está a la vista desde el primer momento y el primer salto es gratis; volver al punto anterior sigue gratis. Lejos del anillo, Lugares ofrece «Ir» al siguiente lugar, gratis.
- **Sin salto en los niveles.** En un capítulo del Viaje, en una ronda y bajo el final se ocultan «Otro paisaje», «Volver al punto anterior» y «Viajar a otra tierra»; el código también los rechaza. IDs conservados. Guía: [Mundo](docs/MUNDO.md#orientación-y-retorno).
- **Caja mágica.** Una línea con gracia y los segundos («¡Zum! Eres cometa: corre y suena. 20 s»), con «Ver» y ×; 300 × 60 px y entera en 390×844 y en escritorio (antes 180 px recortados). Inglés incluido. Guía: [Hallazgos](docs/HALLAZGOS_Y_ACTIVIDADES.md).
- **`?rapido=1`.** Metas de capítulos y rondas a un quinto, en un guardado propio (`kubono:rapido`) y sin cuenta. Sin el parámetro nada cambia. [Herramientas de prueba](docs/MUNDO.md#herramientas-de-prueba).
- Pruebas: `tests/notas_jay_smoke.py` (nuevo) y `tests/rain_mix.py` (nuevo); `tests/journey-finale.mjs` ajustado a «Saltar» a los 0,6 s y al marco corto.
- Preservación: capa `approvedM1` para los archivos protegidos que cambian a propósito (`world-weather.js`, `practice-travel.js`, `chapter-test.js`, `celebration.js`, `sparks.js`, `progress.js`, `main.js`). La partitura y el arreglo del final siguen protegidos tal como los aprobó Q7.
- No probado en teléfono ni con personas; la lluvia, medida en render, no escuchada en altavoz.


## L4 · Escritorio en itch.io · 2.3.0-alpha.225

Rama `lanzamiento/l4-itch`, sobre `main` (con L1 y L2). Fila L4 de la [salida web y Android](docs/PLAN_LANZAMIENTO.md#salida-web-y-android). Guía: [itch.io](docs/ITCH.md).

**Decisión de Jay (27 de octubre): itch.io vende la versión de escritorio como descarga** (Windows, macOS, Linux). itch.io no cobra por jugar un HTML en el navegador, y el zip web no arranca desde `file://`. La web no se publica abierta.

- Envoltorio Electron 44.7.1 en `desktop/` (`main.cjs`, `serve.cjs`; su `package.json` y `package-lock.json`; `node_modules` fuera de Git). Es la única excepción a «sin npm»: empaqueta aparte, el juego no cambia. Carga la carpeta sellada de `itch-package.mjs` por `app://kubono/`; ventana 1280×800 redimensionable, F11 o Alt+Intro para pantalla completa; sin menús (macOS: el mínimo), sin DevTools empaquetado, sin red (cancela toda petición ajena y la descarga de diccionarios), una sola instancia, guardado en el perfil bajo `com.playkubono.kubono` (ID provisional, lo confirma Jay).
- `node scripts/desktop-package.mjs --platform linux|win32|darwin|all` escribe `dist/desktop/`: Windows x64 zip portable (151 MB), Linux x64 tar.gz (119 MB), macOS zip `.app` sin firmar (arm64: 125 MB; universal desde el workflow). Workflow manual `desktop-builds.yml`: artefactos, nada se sube a itch.io.
- `docs/ITCH.md` reescrita para la descarga: archivos y etiquetas por sistema, precio US$4,99 e ID `com.playkubono.kubono` confirmados por Jay, borrador privado, `butler` opcional, firma de macOS y SmartScreen pendientes, sandbox de Linux.
- Pruebas nuevas: `tests/desktop-package.mjs` y `tests/desktop_smoke.py` (build de Linux en Xvfb: arranca en edición de venta, F11 real para el envoltorio, sonido tras el clic, guarda, cierra con código 0, reabre con la partida, ninguna conexión vista por un proxy que lo anota todo). No probado en Windows ni macOS reales.

Primera parte de la fase (zip web, sigue y es la entrada del envoltorio):

- `node scripts/itch-package.mjs` escribe `dist/kubono-itch-<versión>.zip` (`dist/` fuera de Git), sin dependencias: copia solo el juego, sella la edición de venta con `set-edition.mjs` y la versión con el commit, y deja `index.html` en la raíz. alpha.225: 340 archivos, 1,44 MB.
- En itch.io no hay service worker: el zip no lleva `sw.js` y su `index.html` lleva una marca que `src/pwa.js` respeta. Sin enlaces a la vista previa de Vercel. Las rutas ya eran relativas. Vercel y Android no cambian.
- `docs/ITCH.md`: textos ES/EN, etiquetas, marco 390×844 con pantalla completa, pasos del borrador privado. Resultó que un juego HTML se juega gratis en itch.io y que el zip no sirve como descarga (`file://`): de ahí la decisión de arriba.
- Música, mapas, guardado y textos del juego sin cambios.
- Pruebas: `tests/itch-package.mjs` y `tests/itch_package_smoke.py` (zip en `/html/123456/`, en un marco de otro sitio: arranca, suena tras tocar, guarda y recarga, exporta la copia, español e inglés, nada fuera de su carpeta). No probado en itch.io real ni en teléfono.

## L2 · Inglés · 2.3.0-alpha.224

Rama `lanzamiento/l2-ingles`, sobre `lanzamiento/l1-sin-nube`. Fila L2 de la [salida web y Android](docs/PLAN_LANZAMIENTO.md#salida-web-y-android). Guía: [Español e inglés](docs/TRADUCCION.md).

- Sistema de textos sin dependencias: `src/i18n.js` (`t(clave, variables)`, `translate`) y el diccionario `src/i18n-en.js` (más de 4000 textos), los dos en `SHELL`. La clave es el texto español. En inglés se traduce en las salidas: texto y etiquetas de la página, texto del canvas y diálogos del navegador. En español no se instala nada: el juego es el mismo.
- Traducido todo lo visible: menús, hojas, avisos, narrador y La Voz, Bitácora, Lugares, tarjetas, logros, nombres de lugares, especies y regiones, Ajustes, Refugio, Tu canción, créditos, guía «Cómo jugar», `recovery.html` y el texto del canvas. Glosario en la guía («Tu canción» → «Your Song», «El Viaje» → «The Journey», Refugio → Refuge, Bitácora → Logbook).
- Idioma: el del sistema en el primer arranque; las partidas anteriores siguen en español. Se guarda en la partida (`lang`) y se elige en Ajustes → «Idioma / Language» (cambia al momento; si guardar falla, se queda el anterior). `<html lang>` acorde. `?lang=en|es` para probar. Un arranque en inglés espera su texto (como mucho 4 s) para no mostrar español.
- «Cómo jugar»: «El progreso se guarda en este dispositivo.» (antes «este navegador»), válido para la app Android. Es el único cambio de texto en español.
- Los nombres que el jugador escribió (favoritos) no se traducen. En inglés, los nombres de superbiomas de la Bitácora ya no se cortan.
- No cambian la música, los mapas, el progreso ni los ID de HTML.
- Pruebas nuevas: `tests/i18n-keys.mjs`, `tests/i18n-coverage.mjs`, `tests/i18n.mjs`, `tests/english_screens_smoke.py`, `tests/english_panels_smoke.py`, `tests/english_menus_smoke.py` y `tests/language_choice_smoke.py`. Herramienta: `scripts/i18n-scan.mjs`.
- Límites: el texto cortado se mide en el DOM; el canvas se revisó en capturas. Búsquedas y órdenes alfabéticos siguen los nombres en español. Manifiesto y metas para buscadores siguen en español (L5). Sin revisión de una persona nativa.

## L1 · Versión de venta sin nube · 2.3.0-alpha.223

Rama `lanzamiento/l1-sin-nube`, sobre `claude/charming-darwin-dvbfc7`. Fila L1 de la [salida web y Android](docs/PLAN_LANZAMIENTO.md#salida-web-y-android).

- Una sola bandera: `EDITION` en `src/edition.js` (nuevo, en `SHELL`). La fuente dice `'web'`; la edición de venta es `'store'`. El empaquetador la sella en su copia con `scripts/set-edition.mjs` (nuevo), que no toca el árbol fuente. Android: `KUBONO_EDITION=store` al compilar. Un valor desconocido también apaga la nube.
- En `'store'`: ningún cliente de cuenta ni petición a Supabase; Cuenta y su hoja ocultas; «Guardar copia» aparece en «Más» en su lugar; los textos de la cuenta en Cómo jugar y Tú se ocultan; `recovery.html` no consulta nada.
- Siguen el guardado local, exportar e importar copia y «Empezar de cero».
- Partidas existentes: sin sesión, la de siempre. Con sesión guardada, su identificador se lee solo en el dispositivo para cargar `kubono:user:ID:…`; no se borra nada.
- La web de Vercel sigue en `'web'`: es lo de menos riesgo para quien tiene sesión. La nube sigue en pausa. Supabase no se tocó.
- No cambian la música, los mapas, el cubo ni la web actual.
- Pruebas: `tests/sale_edition_smoke.py` (partida guardada por la web, con y sin sesión, carga en la edición de venta; inicio, Viaje, Mundo, menú, Ajustes y Refugio sin peticiones fuera del origen; ningún botón de cuenta; exportar copia; «Empezar de cero» disponible) y `tests/sale-edition.mjs` (bandera, sello y lectura local de la sesión).
- Límites: el recorrido bloquea el service worker para ver todas las peticiones de la página. Aún no probado en el AAB (L3) ni en el zip de itch.io (L4). · sin cambio de versión

Rama `claude/charming-darwin-dvbfc7`, sobre Q7. Petición de Jay del 27 de octubre.

- Nota de cierre en [HANDOFF](HANDOFF.md): E1–E7, P1–P8 y Q1–Q7 en `main`; sin fases de diseño abiertas; cómo retomar.
- La auditoría con Codex queda descartada; su guía se conserva como método.
- [Plan de salida web y Android](docs/PLAN_LANZAMIENTO.md#salida-web-y-android): decisiones de Jay (web y Android, cobro, español e inglés, a su nombre) y la recomendación aceptada de salir sin nube. Fases L1–L6 y tareas que solo puede hacer Jay.
- No cambia el juego.
## Q7 · Los finales suenan a final · 2.3.0-alpha.222

Rama `panel11/q7-finales`, con `main` integrado (alpha.221). **Jay oyó los renders en dub techno y los aprobó el 27 de octubre.** Wintory; Simogo para la forma. Decisiones de Jay: D8-B y D9-B + C. Es la única fase que cambia música. Tras oír los primeros renders («parece música de videojuego de niños»), Jay pidió algo más radical: **dub techno / minimal**, y que cada final acabe con **subida, golpe y corte seco**. Esta entrada describe ya ese arreglo; el de chelo queda en Git.

- Voces propias de los finales (`createDub` en `song-stage.js`, sin módulo nuevo): bombo 4/4 profundo, sub-bajo (seno con su octava para altavoces pequeños), hats a contratiempo, rim lanzado al eco, stabs de acorde con sierras desafinadas y su propio filtro, eco de corchea con puntillo con realimentación y reverb larga oscura. Ruido y sala deterministas: no usan `Math.random` ni el RNG antiguo. Fuera el chelo y el arpegio. La radio, las voces y la mezcla del Mundo libre no cambian; «Tu canción» desde Lugares y la vista previa de un trofeo siguen con las voces de `song.js`.
- Subida: el paso bajo de los acordes se abre de 260 Hz a 5,2 kHz y el cuerpo pasa del 25 % al 100 % del nivel. Golpe: bombo, sub, impacto y un stab sostenido de tónica sus2 con la tónica arriba. Corte seco en el último «1»: la salida del final, eco y sala incluidos, baja a cero en 6 ms y la realimentación se corta.
- D8-B (final del Viaje): el tema conserva sus seis alturas (en La mayor, La Si Mi Re Do♯ La, dos vueltas iguales, una octava en 52–76), ahora como nota superior de los stabs dub. Entra el bombo con el sub; por capítulo se suman bajo dub, hats y rim, stabs y la sala (vi, IV, vi, V; tónica bajo el tema). Riser en la segunda vuelta; el golpe es la última nota del tema, la tónica; corte al final de la partitura. Misma duración, mismos visuales y «Tu mundo se abrió».
- D9-B (final de los once): la radio del Mundo calla desde su primer «1» hasta cerrar la escena; el Mundo sigue su curso y el final toma su swing. Las capas entran por sus ★ (D1) con voces dub. Tus frases suenan en la voz dub, fuera del filtro cerrado. Bajo tus frases y el silencio la subida hace un respiro (*breakdown*) y deja sitio; sigue con el tema.
- D9-C: coda escrita. En los tres últimos compases los stabs tocan el tema entero, con anacrusa de medio compás. Los dos primeros suben (filtro abierto y riser). En el «1» del último compás llega el golpe en la tónica, y en el siguiente «1», el último, el corte seco. Nada empieza después del golpe. No depende del nivel de Faros. Se conservan el arco, `credited`, el cierre a los 7 s y la falta de tarjeta (Q3).
- Pruebas: `tests/journey-finale-harmony.mjs` (seis alturas del tema en stabs, 396 contextos; frases en la voz dub; inicio solo con bombo y sub; golpe en la tónica sostenido hasta el corte; riser que cae en el golpe; nada tras el golpe), `tests/song-tiers.mjs` (coda con las seis notas, golpe sus2 en la tónica, riser, nada tras el último «1», con los once a ★ y a ★★ en tres escalas), `tests/song-transport.mjs` (silencio de la radio; las fuentes dub caen en el swing del Mundo, ±2 ms; el final no usa las voces de `song.js`), `tests/song-for-everyone.mjs` (frase en voz dub). `journey_finale_mix.py` y `song_stage_mix.py` exigen ahora corte seco (300 ms tras el último «1» ≥ 40 dB bajo el pico) y subida (primer cuarto ≥ 6 dB bajo el segundo más fuerte).
- Renders en `docs/panel/sesion-11/escucha/` (WAV mono, 22 050 Hz), con el mismo método: final del Viaje con su reproductor offline (normalizado a pico −1,9 dBFS); final de los once sobre el programador real del Mundo (`audio.js`, género minimal, La menor), a ★ y a ★★. Los «antes» son los de antes de Q7.
- Medidas de los renders: pico −1,9 / −1,0 / −1,1 dBFS; los 300 ms tras el último «1» quedan 127 / 76 / 76 dB bajo el pico; subida 16 / 11 / 8,5 dB. En los once el «1» se mide como se oye: la cadena maestra retrasa unos 21 ms. Las seis notas del tema son la clase de altura dominante en cada nota de las dos vueltas.
- Límites: medidas, no escucha. Jay aún no ha oído este arreglo; no hay escucha en teléfono. El sub-bajo apenas se oye en altavoces de teléfono: su octava y el clic del bombo llevan el pulso. `journey_finale_smoke.py` tarda ≈ 130 s, igual que en la base (CI corta a 145 s).


## Documentación al día y guía de auditoría externa · sin cambio de versión

Rama `claude/charming-darwin-dvbfc7`, sobre `main` (`1a898ce`). Petición de Jay antes de una auditoría en Codex.

- Nueva [guía de auditoría externa](docs/AUDITORIA_EXTERNA.md): qué queremos, qué no se discute, cómo se puntúa, qué entregar y cómo se decide aquí cada propuesta (sí, no o después, con la nota esperada).
- README, HANDOFF, HANDOFF_CLAUDE, índice, PANEL y AGENTS reflejan alpha.221 en `main` y Q7 pendiente de escucha.
- No cambia el juego.
## Q6 · Volver y tocar en el Mundo libre · 2.3.0-alpha.221

Rama `panel11/q6-mundo-libre`, sobre `panel11/q5-golpe-al-oirse` (informe de la sesión 11). Chen e Iwai. Decisiones de Jay: D7-C y D11-B.

- D7-C: quien abrió el Mundo alguna vez no vuelve a pagar diez cristales. Un día nuevo ya no saca del Mundo, tampoco a mitad del Viaje: cargas donde estabas, sin salto diario. Quien estaba en el Camino sigue en el Camino, con «Entrar al Mundo» en el dock.
- El dato es `lastWorldDay` o el logro «mundo»; los dos los guarda `enterWorld` y nada los borra. No hace falta marcador nuevo ni migración. El Estudio abierto desde el Mundo vuelve al Mundo.
- El Camino del día vuelve como paseo: sus diez primeros cristales dan ✦ (en el Viaje siguen callados, como antes). El décimo solo abre la puerta la primera vez; después no te mete en el Mundo.
- D11-B: en el Universo abierto el pulso suena al apoyar el dedo, como en el Camino, los capítulos y las rondas. Mantener 500 ms abre el escáner y arrastrar camina; al soltar no suena otro pulso. Se integra el cambio de Q5: el modo dedo de las pruebas (`?dedo`) conserva sus gestos sobre objetos al soltar, y ahí un toque quieto que no abre el escáner sigue siendo pulso.
- Jugador nuevo: igual que antes, empieza en el Camino y necesita diez cristales, también en un día nuevo.
- No cambia: notas, voces, mezcla, el cubo (pequeño), mapas, semillas ni guardados.
- Pruebas: `tests/crystal-path.mjs` afirma que el jugador nuevo sigue necesitando los diez cristales en un día nuevo (línea 26) y añade el que vuelve: guardado en el Mundo a mitad del Viaje con `todayKey` de ayer, guardado antiguo con solo el logro, Estudio, ✦ del paseo y sin entrada forzada. `tests/free_world_return_smoke.py` (navegador): jugador nuevo en el Camino; un guardado en el Bosque con `todayKey` de ayer carga en el Bosque; en el Universo abierto, 40 toques a tiempo con mediana ≤ 15 ms y p95 ≤ 30 ms del `pointerdown` a la nota (sin latencia de salida), un pulso por toque, escáner a los 500 ms y arrastre que camina. `tests/touch_precision_smoke.py` afirma ahora que en el Mundo libre el vacío pulsa al apoyar, una sola vez, y que arrastrar camina y mantener abre el escáner. `tests/strike_heard_smoke.py`: los toques quietos de 100, 300, 470 y 600 ms pulsan una vez al apoyar; el de 600 ms abre además el escáner.
- Límite: sin prueba en teléfono ni con personas. Quien se queda en el Mundo ya no recibe el salto diario al cargar; lo recibe al entrar desde el Camino.

## Q5 · El golpe al oírse · 2.3.0-alpha.220

Rama `panel11/q5-golpe-al-oirse`, sobre `panel11/q4-refugio-y-lugares` (informe de la sesión 11). Mizuguchi; Iwai para el toque. Incluye D10-B en el acierto.

- La onda nace con su nota: se crea en el punto del toque y se dibuja, y empieza a alcanzar objetos, cuando su nota se oye (`cueDelay`, en el acierto y fuera de tiempo). Al tocar solo aparece la marca de la Línea. Sin sonido o con el audio suspendido, sale al momento.
- El toque fuera de tiempo (y el pulso demasiado seguido) suena en la siguiente semicorchea ya programada a 20 ms o más (`touchSlot`, `touchSoon`), no en el siguiente paso aún sin programar. Comparte con la cola el límite de 4 voces por paso. Modelo a 96 BPM: mediana 98 ms y p95 167 ms (antes, 195 y 265).
- En el Mundo libre, un toque quieto que no abre el escáner es pulso, dure lo que dure: de 450 a 500 ms ya no queda mudo.
- D10-B: en el acierto, solo el marco del cubo y el «1» son dorados. La onda, la marca de la Línea y el arco del acierto (`hitFlash`) pasan a blanco.
- No cambia: notas, voces, mezcla, la regla D2 del Mundo libre, el tic de la ronda, los cuadros del eco de la Cueva, el cubo (pequeño), mapas, semillas ni guardados.
- Pruebas: `tests/touch-timing.mjs` (modelo del programador a 96 BPM: mediana ≤ 100 ms, p95 ≤ 180 ms, ≤ 4 voces por paso) y `tests/strike_heard_smoke.py` (latencia 0,25 s: la onda vence a ≤ 20 ms de su nota; tras un acierto, el único trazo dorado es el marco; toques de 100, 300, 470 y 600 ms dan pulso o escáner). `tests/journey-pulse.mjs` afirma ahora el arco blanco del acierto.
- Límite: en Chromium sin pantalla el temporizador dispara la onda 2–60 ms tarde bajo carga, como el aterrizaje del cubo. Sin prueba en teléfono ni con personas.

## Q4 · Refugio y Lugares legibles · 2.3.0-alpha.219

Rama `panel11/q4-refugio-y-lugares`, sobre `panel11/q3-tu-cancion` (informe de la sesión 11). Wong, Nesbitt y Hodent.

- Refugio: los rótulos de sala se miden con `measureText` y van tras la esquina de su sala, sin cruzar otro texto ni el marco. Si no caben enteros en la franja de la casa, no se dibujan (antes «RAÍZ» salía cortado en horizontal). La barra de pasos y la luz de cada sala quedan sobre su suelo; antes cruzaban el rótulo de la sala de abajo.
- En vertical, la Voz va bajo el último rótulo de sala, en la franja libre antes del panel. Ya no tapa «Cielo». En horizontal sigue sobre el panel lateral.
- «PRISMA» va encima del prisma, no sobre la línea del suelo.
- Salas cerradas, Taller, Prisma y Núcleo a 4,5:1 o más (`#ffffff8c`; eran `#ffffff4d` y `#ffffff73`). Las salas abiertas, `#ffffffcc`.
- Cada sala cerrada muestra solo la condición más cercana, con un número: «Cielo · faltan 3 lugares» (`roomNeed`: la menor parte que falta; empate, lugares). Tocarla dice lo mismo. La regla D3 no cambia: lugares o ★, lo que ocurra primero.
- Lugares: «↑ N más arriba» cuando hay filas arriba. ★ a 17 px (cada ★ mide 12 px o más). «Ir» y «Seguir» de 72 px, en la línea del nombre.
- Con logros sin leer, ☰ → Bitácora abre en Logros (2 toques). Si no, donde se dejó.
- El mapa llena su caja: mínimo de 4 regiones por lado (eran 12) y margen fijo de 24 px. El círculo del origen no pasa de 12 px.
- Se conserva lo de Q1: lugares en blanco y `#houseStars` dice «Lugares», sin número. Nuevo ID `#lugaresScrollUp`; los demás se conservan.
- No cambia: cubo (tampoco el del Refugio), música, mapas, semillas, guardados, salas ni objetos.
- Pruebas: `tests/refugio-legible.mjs` (la condición más cercana en todos los estados cerrados, un solo número, D3 igual) y `tests/refugio_legible_smoke.py` (teléfono, horizontal y escritorio: ningún texto cruza otro, la Voz ni el marco; rótulos ≥ 4,5:1; Llanura o «↑»; ★ ≥ 10 px; «Ir» y «Seguir» del mismo ancho a ±2 px del nombre; Bitácora en Logros; mapa ≥ 40 % de su caja). `favorites_smoke.py` comprueba que la Bitácora abre en Logros solo con logros sin leer; ese recorrido, `creative_smoke.py`, `glass_smoke.py`, `mirrors_smoke.py`, `encounter_depth_smoke.py` y `smoke.py` pasan a la pestaña Mapa antes de buscar en ella.

## Q3 · Tu canción se ve crecer y se cierra · 2.3.0-alpha.218

Rama `panel11/q3-tu-cancion`, sobre `panel11/q2-lo-que-cuenta` (informe de la sesión 11). Iwai, Simogo y Chen; Pope para el arco.

- El aro de cada capa con ★ se llena en proporción a lo que suena, contado en sus golpes (`layerShare`): Lago a ★ 12/24, a 1,5 16/24, a 1,94 23/24. Sin cifra. Colchón y Eco ya suenan enteros con ★: su arco va cerrado.
- ★, ★★ y ★★★ también por forma: arco sin relleno; aro relleno; aro relleno con un aro exterior fino. El color por saturación sigue.
- Sin velo dorado fuera del final.
- La tarjeta dice «Tu capa de Lago creció» solo si la ronda hizo crecer la capa (`layerGrew`, la misma regla que «crece» en `play-curve.mjs`).
- Tras el final de once no vuelve la tarjeta. La ronda se conserva: ★ y récord en Lugares, logros en la Bitácora.
- Créditos una vez de verdad: al mostrarlos se guarda `credited` (campo nuevo, `false` por defecto; se normaliza sin borrar nada). Un final repetido acaba en «Tu canción está completa».
- El final de once (y la versión maestra) se cierra solo 7 s después de su último compás.
- No cambia: notas, voces, arreglo, mezcla, umbrales, cubo ni ID de HTML. El final del Viaje sigue dibujando sus anillos como antes.
- Pruebas: `tests/song-grows.mjs` (arco ≤ 1/16 de los golpes que suenan en las once capas, tres arcos distintos, forma por estrella, línea de crecimiento igual a «crece», `credited` en el guardado). Se actualizan `song-for-everyone.mjs`, `song_finale_flow_smoke.py` (sin tarjeta tras «Seguir»; el segundo final sin nombres y cerrado 5–10 s después del último compás), `result_clarity_smoke.py` y `song_stage_smoke.py` (Ruinas ★ sin relleno, ★★ relleno, sin velo).

## Q2 · Lo que cuenta la ronda · 2.3.0-alpha.217

Rama `panel11/q2-lo-que-cuenta`, sobre `panel11/q1-reglas-a-la-vista` (informe de la sesión 11). Matsuura; Mizuguchi para el reloj.

- La Cueva cuenta el eco, no la corchea. El juego dice qué cuenta cada pulso (`counts`) antes de actuar: un paso del patrón es acierto; un paso equivocado, o fuera de tiempo en el compás de respuesta, es fallo; durante la llamada no cuenta. La gota dorada sigue contando y cierra la ronda.
- La Cueva juzga con `heardTime` (el reloj calibrado). `journey-pulse.js` le pasa el momento oído del toque.
- Los pulsos mientras el lugar canta su patrón no cuentan: desde el inicio de la ronda hasta el fin de sus dos compases, tal como se oyen (`rhythmDemo` en `journey-rhythm.js`). Vale también para los capítulos del Viaje. Sin sonido no se canta y todo cuenta, como antes.
- Aviso: la Cueva será algo más difícil. Es lo justo: la tarjeta mide lo que el lugar pide.
- No cambia: ventana de ±80 ms, umbrales, ★ ya ganadas, música, guardados.
- Pruebas: `tests/round-counts.mjs` (un acierto y un eco equivocado dan 50 %; la llamada no suma; con calibración 0,15 se acepta el borde del compás de respuesta; doce toques durante los dos compases cantados dejan `run.total` a 0).

## Q1 · Reglas a la vista · 2.3.0-alpha.216

Rama `panel11/q1-reglas-a-la-vista`, sobre `claude/charming-darwin-dvbfc7` (informe de la sesión 11). Nesbitt y Hodent; Roset para el dorado. D10-B de Jay para ✦.

- Dorado solo para lo ganado. Las cifras de lugares van en blanco: «Lugares 5 / 11», el estante del Refugio («★ N / 33», sin «LUGARES») y la línea de remezcla. «Explorar a pie» es un botón blanco. Las marcas de no leído de Bitácora, Menú y Tu cubo van en blanco. En el mapa, la marca del Refugio también. Las ★ bajo trofeos y portales siguen doradas.
- ✦ sigue dorada, pero ya no es mayor que ★: las tres cifras del HUD miden 11 px, peso 500. Sin hueco cuando `#sparkGain` está vacío; las tres acaban en la misma x.
- Una cifra por concepto: `#houseStars` dice «Lugares», sin número (conserva su ID). Una palabra por cuenta: el mapa dice «portales abiertos» y «tu Refugio».
- «Vista tranquila»: título y subtítulo dicen el estado. El subtítulo nombra Tu cubo, cifras y herramientas.
- Un mensaje al salir del Viaje: fuera «Se abre el Mundo libre.». «Prólogo» va a la Bitácora sin aviso. El final aterriza en el Refugio sin la voz de primera visita (se oye en la primera visita real). Hasta el primer portal, un color o una pieza ganados esperan en Tu cubo sin aviso.
- No cambia: música, cubo, mapas, guardados, umbrales ni el dorado de los objetos de juego, del cielo del final ni de los títulos de cierre.
- Pruebas: `tests/rules-in-sight.mjs` y `tests/rules_in_sight_smoke.py` (sin píxel dorado fuera de ★/✦ en Lugares, Refugio y mapa; HUD alineado). Se actualizan `journey-finale.mjs`, `journey_finale_smoke.py` (ningún aviso entre «Tu mundo se abrió» y el primer toque) y `refugio_lugares_smoke.py`; `crystal_play_smoke.py` y `entry_jump_smoke.py` piden ahora ✦ al tamaño de ★ (antes ≥ 14 px). Auditoría, `npm test` y 49 recorridos de navegador aprobados. `verify-e-preservation` señala `achievements.js` y `celebration.js` (solo avisos). Cabeceras de `docs/VIAJE.md` y `docs/MUNDO.md` en alpha.216.

- Arreglo en el PR de Q1–Q6: los avisos de descubrimiento («Vida», «Forma nueva», «Familia nueva», «Reliquia», «Récord») también callan desde «Tu mundo se abrió» hasta el primer portal; lo encontrado se guarda igual (`src/discovery.js`).

## Sesión 11 del panel · sin cambio de versión

Rama `claude/charming-darwin-dvbfc7`. Petición de Jay: revisar de nuevo con puntuación.

- Doce perfiles sobre alpha.215: puntuación ciega y después contraste con la sesión 10. [Informe](docs/panel/sesion-11/informe.md), [expediente](docs/panel/sesion-11/expediente.md) y doce análisis en `docs/panel/sesion-11/`.
- Media 6,7, Menús 7, Detalle visual 5,5. Plan Q1–Q7 y decisiones D7–D11. No cambia el juego.
- Capturas de menús adaptadas al menú de P2 (`docs/panel/sesion-11/evidencia/capturas-menus.py`).

## Verificador de preservación tras P3–P8 · sin cambio de versión

Rama `claude/charming-darwin-dvbfc7`, sobre `main` (`5464612`). Petición de Jay.

- `scripts/verify-e-preservation.mjs` añade una segunda referencia: `main` tras P8 (`5464612`, PR #357 y #358 con CI completo). Los 56 archivos protegidos que cambiaron P3–P8 y los contratos del final de once, el final del Viaje, el Jardín, la ronda y el paso del final se comparan con ella byte a byte. El resto sigue comparándose con la base E.
- No abre ningún archivo nuevo a cambios: la lista permitida no crece. Revisado antes de fijarlo: en los módulos de sonido, P5 solo movió las luces a la nota oída y añadió el pulso suave aprobado; notas y síntesis no cambian.
- Pruebas: el verificador pasa (301 archivos, 13 contratos) y falla al tocar un archivo fijado (`interactions.js`) o una nota del final (`song-stage.js`). Auditoría y `npm test` aprobados. Sin navegador ni audio: no cambia el juego.

## P8 · Menos contadores · 2.3.0-alpha.215

Rama `panel10/p8-menos-contadores`, sobre `panel10/p7-color-ganado`. Pope, con Hodent para las hojas (panel 10); D3 = A + B de Jay.

- Un solo ★: las reliquias del Mundo (`S.stars`) se llaman «Reliquias» en la Constelación, la Bitácora, la hoja de salida, el aviso al encontrarlas, las imágenes para compartir y tres logros (`estrella1`, `e30`, `e100`; mismos ID, nada ganado se pierde). El HUD ya no escribe `#starsN`; el elemento sigue en la página, oculto. `#oStars` (hoja `#mOut`, sin llamada viva a `exitWorld(true)`) se conserva y dice «Reliquias».
- Vista completa con tres cifras: ★ de 33 (`#hudStars`, dorado), ✦ y lugares de 11 (`#hudPlaces`), desde que se abren los lugares. Día, distancia, elementos y la meta de chispas salen del HUD (los ID siguen). Regiones, continentes y récord pasan de Mapa a «Tú» en la Bitácora. En el Mundo, la línea de objetivo dice «Explora a tu ritmo» en vez de «Regiones N · Formas N».
- Sin contadores a cero en hojas de primer nivel: menú (✦ y ★ solo con valor), Tu cubo (saldo y regalos), Mapa (favoritos, hitos, oídos, rarezas, lugares abiertos) y Refugio («0 sonando», «0 de 40»).
- Refugio (D3-B): las salas se abren por lugares completos o por ★ (Jardín 6 o 9 ★, Cielo 8 o 15 ★, Raíz 11 o 24 ★), nunca por días. Al cargar, una casa sin `roomRule: 2` suma las salas que abría la regla antigua (3/7/14 días o 8/20/40 logros): ninguna sala abierta se cierra. Casas de versión futura intactas.
- Como mucho un logro por aviso: «✦ Logro · nombre»; los demás esperan, sin leer, en la Bitácora. No se retira ningún logro ni se crean logros de tiempo o distancia.
- No cambian el cubo, la música, chispas, piezas compradas, semillas ni mapas.
- Pruebas: `tests/fewer-counters.mjs` (migración, regla de salas, ★ único, tres cifras, un logro por aviso); actualizadas a la regla nueva `house*.mjs`, `release-closure.mjs` y los recorridos de Refugio, menú, HUD y Tu cubo. `menus_smoke.py` comprueba que el HUD muestra como máximo tres cifras.

## P7 · El color se gana y se ve · 2.3.0-alpha.214

Rama `panel10/p7-color-ganado`, sobre `panel10/p6-tu-cancion`. Roset, Nesbitt, Wong y Mizuguchi (panel 10); D4 de Jay.

- Color del lugar (D4): portales completos, marcas de capítulo, mapa y trofeos del Refugio toman el color de su lugar (`earnedColor`, `color-safe.js`). Abiertos sin completar, en blanco; la columna y la baliza, en blanco. El dorado queda para las ★.
- Pigmento, no velo: se quita el relleno plano del bioma recuperado. Su color entra en las formas con una mezcla `color` que deja el negro negro. La luz del bioma es un charco menor alrededor del cubo; el amanecer y el atardecer ya no tiñen toda la pantalla; la niebla es algo más fina.
- El color vuelve en un compás (2,4–3 s): el gris se retira en un círculo desde el cubo hasta el borde, con un frente fino de su color. Con movimiento reducido, fundido del mismo largo.
- Menos textura en Lago (dos ondas por estanque), Dunas (una de cada dos franjas) y Ruinas (marcas del suelo más tenues). Caminantes y criaturas de píxeles a un tercio de brillo en el Viaje y en las rondas.
- El Camino del Viaje no escribe «Pulso»: el cristal cercano late con el golpe.
- Daltonismo: `SAFE_COLORS` sin repetidos. Dunas, Cristales y Ruinas pasan a ocre, verde pálido y azul pizarra, separados en deuteranopía, protanopía y tritanopía simuladas.
- Cueva: la llama roja se queda; los cuadros del eco pasan a blanco y dorado, todos de 7 px. Refugio: «cerca», «armado» y el paso del Taller en blanco. «Grabar»: píldora blanca con un punto cuadrado que parpadea.
- No cambian el cubo, la música, las semillas, las posiciones ni los mapas.
- Medida de Roset con `scripts/panel-capture.py` (390×844; «encendido» = canal máximo > 10, «color» = croma > 24). Capítulos y lugares, antes → después: Lago 34 → 14 % encendido, Dunas 57 → 19 %, Vacío 29 → 7 %, Cristales 25 → 10 %, Ruinas 15 → 8 %; máximo 19 % (Dunas). Anillo (Bosque recuperado, con niebla): mediana (33,42,37) → (3,17,8) y color 0,13 → 17,8 %. Los capítulos aún pálidos siguen grises a propósito. En un capítulo de Lago recuperado: mediana (1,7,12) y 5,5 % con color; el gris pasa de 1 a 0,05 en 2,2 s.
- Pruebas: `tests/color-earned.mjs` (Node) y `tests/color_earned_smoke.py` (navegador). `echo_smoke.py` falla también en la rama base (la tarjeta de la Cueva no sale en 15 s); no lo causa esta fase.

## P6 · Tocar donde sea y Tu canción para todos · 2.3.0-alpha.213

Rama `panel10/p6-tu-cancion`, sobre `panel10/p5-un-solo-reloj`. Mizuguchi, Chen, Wintory, Simogo e Iwai (panel 10); D1-B, D2-A y D5 de Jay.

- Tocar donde sea (D2-A): en el Camino, los capítulos del Viaje y las rondas de lugar, el pulso suena al apoyar el dedo en cualquier punto del lienzo. Arrastrar sigue caminando y descansar abre el escáner. En el Mundo libre no cambia: el cubo al apoyar, el vacío al soltar. Guía, lección y pista del Camino dicen «Toca al ritmo. Arrastra para moverte.».
- La capa crece (D1-B): entre ★ y ★★, cada 1,25 puntos de tu mejor porcentaje desde el 55 % suma un tiempo de los compases callados (≈ 62 % de la capa al 60 %, tres cuartos al 67 %). La melodía de Faros gana una cuarta y quinta nota. Una ronda sin sonido ya no sube el mejor porcentaje. Umbrales de estrellas sin cambio.
- `scripts/play-curve.mjs` cuenta el evento «crece» en la regla de 12 min. El modelo cambia su supuesto de reintentos: tras un segundo reintento que no suma nada, pasa al lugar siguiente. Resultado: el 60 % cumple hasta el minuto 120 (mayor hueco 8,9 min; 13 veces crece). Con el supuesto anterior quedaba en 12,2 min. Sin sonido sigue sin cumplir (81,8 min).
- La victoria de una ronda suena al nivel ganado (su ★ con crecimiento, ★★ o ★★★), no siempre ★★. Los capítulos del Viaje siguen con la capa entera.
- El gran final (D5): la ronda que completa los once desemboca sola en él, sin tarjeta delante; la escena se abre 0,3 s antes del fin de la caída y su primer compás es el siguiente «1». La tarjeta sale al cerrar el final. Durante tus frases y la primera vuelta del tema solo siguen colchón y bajo; las demás capas vuelven en la segunda vuelta. Tu frase suena con el arpegio suave del final del Viaje en lugar de `lead`. Créditos de autoría solo en el final de once; el del Viaje dice solo «Tu mundo se abrió» y la versión maestra solo sus dos líneas.
- Sin rótulo en el compás de silencio. En el anillo de Tu canción, ★, ★★ y ★★★ se distinguen por saturación (45, 75 y 100 %); el blanco del Vacío, por brillo.
- No cambian la generación, las notas, las armonías, la síntesis, la música del Mundo ni las notas guardadas. Medida de Wintory (todas las capas en ★★, seis notas por lugar): compás de frase 6 de 9 eventos tuyos (antes 6 de 65); compás del tema 3 ajenos (antes 59). En ★★★: 6 de 12 y 6 ajenos.
- Pruebas: `tests/song-for-everyone.mjs` (Node), `tests/tap_anywhere_smoke.py` y `tests/song_finale_flow_smoke.py` (navegador). Se actualizan `play-curve.mjs`, `journey-finale.mjs`, `touch_precision_smoke.py`, `song_authorship_smoke.py`, `journey_finale_smoke.py` y `result_clarity_smoke.py`, que afirmaban lo anterior. `tap_anywhere_smoke.py`: 40 toques en un capítulo, del `pointerdown` a la nota p95 ≈ 12,5 ms (sin contar la latencia de salida). `song_stage_mix.py` mide el hueco: frase −27,4 dB frente a −23,5 dB con todas las capas (base: −23,6); primera vuelta del tema −26,0 frente a −23,1 en la segunda (base: −23,1 y −23,0). `journey_finale_mix.py` y `victory_mix.py` sin cambios (picos 0,144 y 0,179). `victory_live_smoke.py` falla igual en la rama base (7532 ms frente a un margen de 7500), no por esta fase. `surf_smoke.py` espera la tarjeta 15 s. Renders sin escucha humana: Jay debe oír el final antes de integrar. Sin teléfono.

## P5 · Un solo reloj · 2.3.0-alpha.212

Rama `panel10/p5-un-solo-reloj`, sobre `panel10/p4-cierre-de-ronda`. Mizuguchi e Iwai (panel 10).

- Un reloj para la luz: `cueDelay` y `audibleTime` incluyen la latencia de salida y la calibración (`latencyNudge`). Pasan a él los temporizadores con `ac.currentTime` crudo: vidrio, espejos, materia, vida, iniciativa, hitos, quietud, cajas, especies (`render.js`), señales (`feedback.js`), parches, eco, victoria, tienda del cubo y `jam.js`. También los dibujos que comparaban con el reloj crudo: Momentos, capas del universo, encuentros, estudio, culturas, percusión, microinstrumentos, fenómenos y la espera de la tarjeta.
- La calibración mueve la luz: con `latencyNudge` 0,15 el cursor de la Línea cruza el paso 0 cuando se oye su bombo, y el aterrizaje del acierto espera lo mismo. El juicio no cambia.
- Un golpe, una imagen: el acierto ya no engorda el cubo al tocar; solo golpea al oírse. Fuera de tiempo, el cubo engorda cuando suena su nota cuantizada. La onda sigue saliendo al tocar.
- Ningún toque mudo: el pulso demasiado seguido suena con su misma voz al 45 % en la siguiente semicorchea (como mucho 4 por paso, 8 pendientes). Sigue sin juzgarse y deja su marca gris.
- No cambian la generación musical, las voces, la mezcla, la ventana de ±80 ms ni el límite entre toques (240 ms, o dos tercios de corchea en ritmos de corcheas). El ambiente sigue con el reloj de audio: es sonido, no luz. El rayo de Tormenta tampoco cambia: su destello dispara el trueno en el mismo instante, y retrasarlo movería el sonido.
- Pruebas: `tests/one-clock.mjs` (Node): sin temporizadores crudos, brillo ≤ 20 ms tras su nota con 250 ms de latencia, cursor y aterrizaje con `latencyNudge` 0,15, un pico por acierto, diez toques a 8 Hz con diez sonidos y ≤ 4 por semicorchea. `echo_smoke.py` espera la tarjeta 15 s, como los recorridos que P4 ya ajustó (la espera de la caída rozaba los 5 s). Renders aprobados: `shop_sound_mix`, `wardrobe_mix`, `music_direction_mix`, `glass_mix`, `percussion_mix`, `micro_mix`, `journey_mix`, `journey_finale_mix`, `victory_mix` y `audio_mix`. Picos frente a la base: tienda 0,88252 / 0,88252, vestuario 0,88169 / 0,88168, percusión 0,87975 / 0,87975. Sin teléfono físico, auriculares Bluetooth ni personas.

## P4 · El cierre de la ronda · 2.3.0-alpha.211

Rama `panel10/p4-cierre-de-ronda`, sobre `panel10/p3-golpe-en-el-cubo`. Simogo, Chen, Matsuura y Pope (panel 10); D1 y D3 de Jay.

- La tarjeta de resultado espera el fin de la caída de la victoria, tal como se oye (`journeyVictoryState().end` más la latencia de salida). Sin sonido sigue a 1,2 s.
- La tarjeta ya no muestra logros. Los de la ronda van a la Bitácora, con su marca de no leídos y sin aviso; mientras la tarjeta espera tampoco sale ninguno.
- Entre 70 y 74,9 % sin ★★: «A 0,4 de ★★» (décimas que faltan, sin redondear hacia arriba) y «Otra vez» junto a «Seguir hacia».
- Cuenta en vivo sin texto: un tic al final de la Línea se enciende en dorado mientras los pulsos a tiempo alcanzan el 75 % (70 % en Maestro). Usa el mismo cálculo que la tarjeta. No sale en Libre ni sin sonido.
- Tras la victoria (D1): objetivo, menú, columna dorada, brújula, nota guía del portal y «Seguir hacia» de la tarjeta apuntan al lugar sin ★★ con mejor porcentaje; con todas las ★★, al que no tiene ★★★. Con 33 ★ vuelve «Explora a tu ritmo».
- Sin cambios en umbrales, redondeo, música ni guardados. El final de los once sigue llegando al cerrar la tarjeta (P6).
- Pruebas: `tests/round-close.mjs` (Node) y `tests/round_close_smoke.py` (navegador; diez rondas del Jardín). Se actualizan `game-objective.mjs`, `places-ring.mjs` y `clean_screens_smoke.py`, que afirmaban lo anterior. En seis recorridos de lugar la espera de la tarjeta pasa de 5 a 15 s, porque ahora espera la caída. `scripts/panel-capture.py` espera a la tarjeta en `33-resultado`. Sin teléfono físico ni personas.

## P3 · El golpe junto al cubo · 2.3.0-alpha.210

Rama `panel10/p3-golpe-en-el-cubo`, sobre `panel10/p2-menus`. Matsuura, Wong y Mizuguchi (panel 10).

- Dedo fantasma: anillo de 1 px con punto de 3 px que nace junto al cubo. En reposo cabe en 14×14 y su centro queda a 27 px del cubo. Arrastra desde el cubo y vuelve a su lado para tocar.
- El dedo late en los pasos del lugar (`journeyRhythmState().steps`), en tiempo audible: Dunas y Lago en 2·6·10·14, Faros en 1·3·y. Antes latía con el pulso crudo y antes de oírse.
- Un anillo fino se cierra sobre el cubo en los cuatro pasos previos a cada paso que cuenta; llega al radio mínimo con la marca de la Línea y es dorado en el «1». El cubo no cambia de tamaño. Con movimiento reducido no se mueve.
- Línea: base a alfa .38 sobre una franja negra (medida en captura: 97, antes 41–48). El «1» se pinta en dorado cuando cuenta.
- Marcas de capítulo de 4 px, solo dentro de un capítulo; ya no aparecen en las rondas de lugar.
- Las chispas doradas de los diez juegos vuelan a la posición real de `#bar`, leída una vez por tamaño, no a `barY=42`.
- Sin cambios en música, ventana de ±80 ms, umbrales, guardados ni tamaño del cubo (6×6 px en `00-inicio`, igual que antes).
- Pruebas: `tests/beat-by-cube.mjs` (Node) y `tests/beat_by_cube_smoke.py` (navegador). El vuelo de la chispa se prueba con su función de dibujo y la barra real, no con una ronda jugada. Sin teléfono físico ni personas.

## P2 · Menús · 2.3.0-alpha.209

Rama `panel10/p2-menus`, sobre `panel10/p1-pantallas-limpias`. Estructura de Hodent y retícula de Nesbitt (panel 10). Se reordena; no se añaden destinos.

- Jugar: «Seguir hacia …» y debajo Lugares, Tu cubo, Refugio y Bitácora. Ajustes y Cómo jugar, siempre a la vista. La fila reparte el ancho entre los botones visibles: sin huecos.
- Cabecera: ★ n/33 primero y en dorado. La vista tranquila no muestra cifras, pero conserva Lugares (★ a dos toques) y Bitácora. Tu cubo y la tienda siguen solo en la completa (regla del Viaje).
- «Más» se abre cerrado. Ir: «Volver al Camino» en el Mundo o «Explorar» fuera de él, Mapa y favoritos, «Volver al punto anterior», «Viajar a otra tierra». Crear: Efectos y eco, «Grabar 60 s», Compartir. Tú: Vista, Cuenta («Opcional»), Guardar copia, Actualizar. Un rótulo sin filas se oculta.
- Un botón para cada viaje: `#bPrimary` ya no cae en «Ayuda y cuenta» y `#bWorld` se oculta cuando no haría nada.
- Una palabra por concepto: favoritos en `#era`, Mapa, la búsqueda y el perfil; «Modo crear: sí/no»; «Otras formas de jugar».
- Ajustes empieza con el volumen y va en tres bloques: Sonido y tiempo, Ver y sentir, Partida («Empezar de cero» al final, con borde). «Más sonido» vuelve a Ajustes al cerrarse o con Escape.
- Todos los cierres inferiores dicen «Cerrar». Pestañas de la Bitácora con `role="tab"` y `aria-selected`; un solo estado activo. Casillas cuadradas. Texto de menú desde 12 px; `.spark-goal` y `.spark-power button` a 44 px. Avatar de 12 px en su marco; foco de «Más» con el contorno común.
- Cuenta (D6 = A): «Opcional. Se juega sin cuenta.». Con la nube en pausa (`CLOUD_CONFIG.paused`) no hay «Crear cuenta» ni «Eliminar cuenta», ni aviso de nube en el Mundo. «Salir de cuenta» solo con sesión.
- En horizontal la fila principal va en una línea por botón; el menú cabe con «Más» cerrado en 390×844, 844×390 y 1280×800.
- Sin cambios en música, cubo, mapas ni guardados. IDs conservados; nuevos `rMenuVolume` y `menuVolumeNow` (el código ya los esperaba).
- Pruebas: `tests/menus_smoke.py` (tres tamaños, ambas vistas, cada botón visible actúa) y `tests/menu_v2_smoke.py` actualizada. Sin teléfono físico ni personas.

## P1 · Pantallas limpias · 2.3.0-alpha.208

Rama `panel10/p1-pantallas-limpias`, sobre `claude/charming-darwin-dvbfc7`. Detalle visual de Nesbitt (panel 10), prioridad alta y media.

- Palabras enteras o con guion: «Copiar diagnóstico» y la versión ya no se parten; el diagnóstico va en dos columnas.
- Lugares abre en filas enteras en teléfono, horizontal y escritorio; la cita de la remezcla no se parte.
- Fuera de pantalla, la columna dorada del portal es una luz de 140 px a la altura del rumbo, con degradado.
- Refugio: en horizontal la casa encaja a la izquierda del panel; la Voz baja bajo y = 120 (en horizontal, sobre el panel); los rótulos se miden y no cruzan el borde.
- Menú: la cabecera tapa el margen superior en horizontal; el pie se funde cuando hay más debajo.
- Filas de botones con la misma altura; «Seguir» va primero y a todo el ancho en resultado, Lugares, portal y guía.
- Tu canción abre con el foco en su título oculto, no en «Otra vez».
- Las muestras forzadas no muestran «Laboratorio» ni su código fuera del laboratorio.
- Mapa: la leyenda va por elementos, sin separador colgante, y deja aire antes de los botones. «Se guarda una copia» en gris.
- Sin cambios en música, cubo, guardados ni estructura del menú (P2).
- Pruebas: `tests/clean_screens_smoke.py` (tres tamaños) y `tests/places-ring.mjs` ampliada. Sin teléfono físico.

## Panel, sesión 10 · sin versión

Rama `claude/charming-darwin-dvbfc7`, sobre `main` (alpha.207, tras integrar E1–E7 y la limpieza en el PR #355). Solo documentación.

- Doce perfiles simulados revisaron la app con la memoria borrada: los diez de siempre más Celia Hodent (menús) y Harry Nesbitt (detalle visual). Media 6,7; Menús 5,5; Detalle visual 5,5.
- Pope consolidó un plan por fases P1–P8, cada una con su rama `panel10/…`, y seis decisiones para Jay (D1–D6). [Informe](docs/panel/sesion-10/informe.md).
- Sin escucha en teléfono ni pruebas con personas.

## Traspaso y limpieza · misma versiónalpha.207

README, HANDOFF canónico y entrada para Claude; guías técnicas consolidadas, historial separado y estados corregidos. Retirados163 informes generados sin referencias, con manifiesto recuperable en Git. Código, música, mundos y partidas intactos. [Detalle](docs/LIMPIEZA_REPOSITORIO.md).

## E7 · 2.3.0-alpha.207

Candidato de validación, verificador de preservación y registro de aceptación sin puntuaciones inventadas. Libro compacto, filtros plegables, favoritos directos sin listado duplicado, destinos cerrados legibles; concordancia en Favoritos; cierre con Escape, porcentajes, final del Jardín y arrastres transaccionales. Luces de patrones, Refugio y canción siguen su instante audible y respetan los silencios. [Entrega](docs/ENTREGA_E.md).

## E6 · 2.3.0-alpha.206

La canción identifica tu aporte en el tramo real y distingue la vista de capas del final personal. Cierre coherente hacia el Mundo libre. Música y notas guardadas intactas. [Entrega](docs/ENTREGA_E.md).

## E5 · 2.3.0-alpha.205

Selección de voces clara y acceso al Refugio desde el libro. Ediciones del jardín con rollback al fallar escritura; tarjetas conservadas. Favoritos identifica trabajo pendiente sin eliminarlo. [Entrega](docs/ENTREGA_E.md).

## E4 · 2.3.0-alpha.204

Lugares enfoca el siguiente destino y explica el desplazamiento; cierres de cabecera consistentes. Final5 con salida explícita, sin omisión al tocar el fondo. Etiquetas pendientes y controles de tarjeta legibles. [Entrega](docs/ENTREGA_E.md).

## E3 · 2.3.0-alpha.203

Ayuda directa desde el menú; una acción actual resaltada, sin objetivo duplicado. Jardín comparte su objetivo real con la demostración y distingue sembrar, regar y cosechar. [Entrega](docs/ENTREGA_E.md).

## E2 · 2.3.0-alpha.202

Entradas canceladas al perder foco/abrir controles, sin pulsos al cancelar. Primer tiempo legible y espera visual distinta de avance. Música y tamaño del cubo intactos. [Entrega](docs/ENTREGA_E.md).

## E1 · 2.3.0-alpha.201

Resultados precisos: porcentaje no redondea a una estrella sin ganar; cronómetro coherente y umbrales visibles. Avisos visuales residuales siguen salida audible y descartan callbacks obsoletos, sin cambiar sonido. [Plan y entrega](docs/ENTREGA_E.md).

## Panel9 · evaluación de alpha.200 integrada

Diez revisores nuevos y16 capturas actuales. Nota provisional7,6; audio técnico y sensación sin aceptación física. Se conservan todas las notas anteriores y su distinto alcance. Se reproducen redondeo de porcentaje/cronómetro en resultados y se verifica sincronía visual residual. Solo documentación y evidencia; no cambia música, mundos, progreso ni versión. [Informe](docs/panel/sesion-9/informe.md).

## Integración de alpha.200

Jay autoriza incorporar a main la pila completa de23 commits hasta `2048e245`, mediante una sola integración. El catálogo de audio pasa de tres a seis grupos aislados tras agotar40 minutos: conserva todas sus59 pruebas. Se conserva el runtime ya entregado; se actualizan estado y traspaso. El catálogo completo detectó ocho pruebas antiguas: se ajustan a recompensas K2, ayudas explícitas, menú compacto, guía/teletransporte por lugar, poderes combinados y la etiqueta «Otro paisaje», conservando sus comprobaciones funcionales. CI completo del PR354 aprobado y merge realizado. [Registro](docs/INTEGRACION_ALPHA_200.md). La aceptación con personas sigue pendiente.

## N8 · 2.3.0-alpha.200

Candidato alpha.200 con revisión independiente, cierres de fallos reproducidos y preservación verificada. Corregidos multitáctil, pausa retenida tras salto, abandono fallido, interpretación de fuente compartida, lectura de aprendizaje incompleto y métricas de Camino/once rondas. No se certifica nueve ni producción sin evidencia humana y CI.

Verificación: 253 suites Node; regresiones de táctil, tarjetas, métricas, foco, cuota y offline aprobadas. UI24 sin desbordamientos/objetivos<24px;16 capturas nuevas;186 renders de técnicas.311 archivos protegidos idénticos a la auditoría; voces/generadores conservados. Catálogo completo/CI, teléfono y personas pendientes.

## N7 · 2.3.0-alpha.199

Pausa del final11 silencia toda la salida, incluidas colas, y vuelve en el paso real del tema. Reloj visual sigue salida audible. Escenario avanza por pasos de transporte, sin saltar al cambiar tempo. Metadata absoluta real, época al reanudar campaña y ritmo nuevo en final5; corregida importación de su reloj y cancelación del escenario anterior. Generadores/voces conservados.

Verificación: 253 suites Node y regresiones focalizadas aprobadas. round_timing_smoke.py, journey_finale_smoke.py y song_stage_smoke.py reales aprobados; pausa completa pico0, retorno0,873; seis renders final5 pico0,144; final11 pico0,389. Sin saturación. Auditoría limpia. Escucha física pendiente.

## N6 · 2.3.0-alpha.198

Aviso de hallazgo permite Ver tarjeta: inspección completa voluntaria, función musical explícita, rareza/procedencia y reloj detenido hasta volver. No añade sonido ni interrumpe automáticamente. Libro conserva identidad. Cambio de interpretación revierte si guardar falla. Selector de casa agrupa disponibles y por descubrir sin ocultar objetos.

Verificación: 252 suites Node; card_inspect_smoke.py y rare_cards_smoke.py aprobados en móvil/horizontal/PC; cuenta atrás y movimiento detenidos, avisos en cola, libro y40 objetos preservados. Auditoría limpia. Valor emocional pendiente con personas.

## N5 · 2.3.0-alpha.197

Ayuda explícita distingue vuelta abierta/cerrada, luces dentro, flor próxima, círculo del rayo y falta de espacio en Vacío. Observación opcional amplía métricas por lugar: primer avance, tiempo activo/sin progreso y ayuda. No fuerza Refugio ni recorta metas sin personas; calibración de esfuerzo pendiente.

Verificación: 251 suites Node; playtest_smoke.py ampliado y after_journey_smoke.py aprobados. Marcha real27,8s hacia Jardín,6465 unidades, gasto0. Auditoría limpia. Duración, emoción y deseo de continuar requieren sesiones nuevas.

## N4 · 2.3.0-alpha.196

Finales actualizan ancho y altura de su canvas. Guía contextual reduce texto repetido y explica pulso/movimiento. Jerarquía y salidas adaptadas a pantalla baja, áreas seguras y contenido largo, sin redibujar mundo ni cubo.

Verificación: 250 suites Node; finale_resize_smoke.py, interface_smoke.py (cinco tamaños, ocho paneles) y guide_context_smoke.py aprobados. Auditoría limpia. Lector y pantalla física pendientes.

## N3 · 2.3.0-alpha.195

La canción da a cada frase los compases necesarios; no descarta notas del mismo paso. Capturas nuevas guardan posición absoluta junto al paso juzgado; campaña deja de guardar el cabezal adelantado. Guardados antiguos conservados con orden compatible; pausas muy largas se abrevían por compases completos, sin afirmar reconstrucción histórica.

Verificación: 250 suites Node, round_phrase_smoke.py y render song_stage_mix.py aprobados; pico0,389 sin saturación. Auditoría limpia. Reconocimiento/agrado físico pendientes.

## N2 · 2.3.0-alpha.194

Tocar el área del cubo emite al apoyar, una sola vez; fuera conserva arrastre, escáner y toque al soltar. Ecos, banda, cristales, Línea y reacciones comparten referencia audible. Vacío distingue pulso musical válido de avance: espera en blanco sin premio visual falso. Sin cambiar síntesis ni patrones.

Verificación: 249 suites Node; touch_precision_smoke.py y journey_pulse_smoke.py aprobados. Despacho explícito menor de40ms en navegador, no latencia acústica física. Auditoría limpia. Bluetooth/teléfono pendientes.

## N1 · 2.3.0-alpha.193

La guía recupera reglas del capítulo activo, condición pendiente y portal. Eco anuncia su acción real. Títulos y subtítulos secundarios separados. Sin nuevas interrupciones automáticas ni cambios de reglas.

Verificación: 249 suites Node aprobadas; guide_context_smoke.py en320/390/1280 aprobado; auditoría sin errores/avisos. Comprensión humana pendiente.

## Octava auditoría · revisión ciega de alpha.192

Rama documental `audit/panel-8-revision-ciega`, desde L4 `a850ceee`; misma versión y runtime intacto. Cinco revisores nuevos, diez lentes simuladas sin notas previas; media6,83 por rúbrica exigente.16 capturas y24 paneles actuales,71 comprobaciones musicales simbólicas y sondas de frase, tiempo, input y tamaño de finales. Audio técnico sin escucha; notas sensoriales provisionales. Diez hallazgos nuevos enlazados después de puntuar; M1–M4 propuestos sin implementar. Informe en docs/panel/sesion-8/informe.md.

## L4 · Validación técnica · alpha.192

- Camino táctil, marcha al Jardín, premios y final11 comprobados en recorridos enfocados.
- Corregida una carrera de avisos: un mensaje cotidiano no borra una explicación importante pendiente; aprendizaje con categoría propia.
- Un formato futuro instalado durante la espera no recibe cambios; guardado fallido restaura exactamente la ayuda anterior.
- Registro de evidencia y preservación; cinco sesiones, escucha física y CI completo de PR siguen pendientes. Sin puntuación humana inventada ni publicación en main.

## L3 · Conservar y acceder · alpha.191

- Renombre, notas y borrado de favoritos con rollback si escribir falla; mantiene datos y ruta.
- Modo de llegada vuelve a su valor anterior si no se conserva.
- Finales dinámicos con foco aislado, Tab contenido y Escape que usa su cierre real. El fondo deja de recibir acciones/avisos durante el panel.
- 248 suites y recorridos de cuota/foco en teléfono/PC aprobados; regresiones de menús y recuperación comprobadas. Sin cambios de música generativa ni arte.

## L2 · Tu frase propia · alpha.190

- Captura de hasta ocho notas por ronda, registrada antes del cierre del objeto dorado; incluye el último pulso.
- No toma notas del historial general ni de la ronda anterior. Sin notas nuevas válidas, conserva la frase guardada.
- Premio y frase comparten guardado con rollback; reintento sin pago duplicado.
- 248 suites y cierre dorado real aprobados. Motor, voces, escalas y generación del mundo conservados.

## L1 · Aprender jugando · alpha.189

- Once reglas recuperables en la guía, tres pasos por lugar.
- Jardín muestra círculo, semilla y riego sin cambiar su estado ni producir audio. Ayuda breve por falta de progreso, retirada al cosechar y repetible a voluntad.
- Ayudas guardadas como vistas al presentarse realmente; rechazo, cola, fallo de escritura y partida sustituida no inventan aprendizaje.
- 247 suites, auditoría y ciclo real de flor/cosecha en320/390/1280 aprobados. Comprensión sin ayuda humana pendiente.

## K7 · Rumbo cercano y despedida · alpha.188

Rama `pulido/k7-rumbo-y-despedida`, desde K6; Jay conserva PR y merge.

- Flecha alrededor del cubo, nombre/metraje encima y sin área táctil. Sigue el leve adelanto de cámara; favorito/casa y anillo no dan dos rumbos simultáneos.
- Final5 cambia exclusivamente su arreglo local: voces existentes suaves, pulso contenido, notas de acorde en registro medio, sin bajo cuadrado/ácido/pad de sierra ni duplicación aguda. No cambia radio, MIDI guardado ni generación de mundos.
- Esperar, omitir y Explorar abren Mundo libre con rumbo a Jardín, sin salto. Festival intacto; cierre reintentable si guardar falla.
- Séptima auditoría integral: diez lentes simuladas, referencia7,7 con feedback de Jay. Menú aceptado; escucha del nuevo final y sesiones humanas pendientes. Plan L1–L4 propuesto, no ejecutado.
- Evidencia y límites en docs/panel/sesion-7/evidencia/verificacion.json.

## Entrega unificada · alpha.181

Jay autorizó integrar el cierre completo en `main`: cubo pequeño, auditorías y fases J1–J7, hasta `e6c0a3a6`. Se conserva exactamente ese código; esta integración solo actualiza el estado documental y verifica el conjunto en GitHub. La versión no cambia y la aceptación física/de publicación sigue separada.

## J7 · Comprobación y cierre técnico · alpha.181

- Posición y parámetros conservados al fallar una entrada; tarjeta anterior invalidada al sustituir la partida.
- Reintento real del objeto final conserva su referencia; cierre cuenta compases vivos con tempo variable.
- 245 suites, regresiones enfocadas, offline y 64 estados de UI aprobados; catálogo inicial y repeticiones documentados.
- Auditoría posterior por los mismos diez perfiles simulados; evidencia y pendientes separados de la aceptación humana.
- Guardia reproducible de 305 archivos protegidos, arte SVG y reglas originales.
- Registro conserva cada ID y sus pruebas; no declara producción o un 10 por simulación.
- Ramas encadenadas J1–J7; Jay mantiene PR y merge. Ver `docs/panel/sesion-5/informe.md`.

## J6 · Sincronía · alpha.180

- El acento visual sigue el instante real programado de la nota y su salida estimada, hasta 400 ms.
- Sin recorte artificial a 250 ms; cancelación al reiniciar o cambiar de escena y sin respuestas tardías en segundo plano.
- Se conserva exactamente la regla de programación sonora; contacto y movimiento reducido intactos.

## J5 · Continuidad creativa · alpha.179

- La tarjeta confirma cuándo se conserva tu frase para el final.
- Tu canción desde Lugares permite volver al final existente, con las notas actuales; Otra vez repite esa versión.
- El modelo separa capas ganadas e interpretaciones completadas. No predice abandono ni cuenta compras como música.
- Mismos generadores, instrumentos y arreglo del final; sin contenido adicional.

## J4 · Una meta compartida · alpha.178

- Guía y menú leen el capítulo o siguiente lugar real; experiencias extra claramente opcionales.
- Lugares y Refugio priorizan completar once; estrellas de maestría y chispas se distinguen.
- La guía permanece accesible durante el Viaje. No se alteran desbloqueos, economía ni posición.

## J3 · UI de producción · alpha.177

- Viaje queda para la campaña: el selector dice Vista y la pestaña de recursos, Chispas.
- Mapa distingue las regiones guardadas de los once Lugares.
- Escuchar y responder conserva la práctica musical; diagnóstico de versión en Ajustes.
- El resultado de ronda espera a que cierre otro panel. Diseño, controles e IDs conservados.

## J2 · Cierre musical · alpha.176

- Cierre con la capa ganada en el acorde vivo; fuera riser, crash, lead ajeno y corte de salida.
- Cancelación de notas del cierre al cambiar de escena; la radio no se automatiza.
- Cristales y segunda pasada del final respetan su marco armónico.
- 242 suites, cierre vivo y renders de victoria/canción/final aprobados. Escucha de Jay pendiente.

## J1 · Base fiable · alpha.175

- Premios de ronda durables y reintentos sin duplicación en los once lugares.
- Lectura segura de formatos futuros, conservados sin mutación.
- Pruebas de visitas, semillas y cuenta esperan sus límites reales de operación.
- Generación musical, mundos, aspecto y umbrales conservados. Evidencia en `docs/PULIDO_CIERRE.md`.

## Cuarta auditoría · sin otra versión

Rama `audit/panel-4-cierre`, dependiente de `fix/cubo-pequeno` (04ae8bdd). No cambia el juego respecto a esa revisión.

- Diez lentes simuladas, expediente e informe: media orientativa 7,7 (antes 7,5). No son opiniones reales de los autores.
- 16 capturas con gate normal, 60 estados de UI en cuatro tamaños, modelo de dos horas y 11 renders de cierre. Tacto real de navegador aprobado; no personas ni teléfono físico.
- Contratos reproducidos: notas fuera de escala en capa/final, premio anunciado con guardado fallido, lector de formato futuro y límite de sincronía. El CI del main base tiene tres grupos de navegador fallidos; no se certifica como verde.
- Registro de 14 hallazgos y plan J1–J7, pendiente de Jay. Música base y contenido se conservan; Supabase sigue en pausa.
- Herramientas `panel-capture.py` y `panel-measures.py` evitan confundir el modo de desarrollo con el aspecto normal. Evidencia en `docs/panel/sesion-4/`.

## Cubo pequeño · alpha.174

Rama `fix/cubo-pequeno`, desde `main` 676ac511. Petición de Jay: quitar la ampliación general de la I2.

- Tamaño natural, entre 6 y 12 px antes de pulsos y efectos temporales. Las caras equipadas conservan su mínimo existente de 10 px.
- No cambian alcance, colisiones, movimiento, música, economía, guardados ni posiciones.
- Verificado: 240 suites Node y `cube_face_smoke.py` (13 piezas, caras visibles, movimiento, hábitos, persistencia y tamaño real del cubo).
- El tamaño definitivo requiere la aceptación de Jay en su teléfono. No se afirma despliegue ni CI de esta rama.

## Documentación y panel · sin versión

Rama `claude/charming-darwin-dvbfc7`, sobre `main` (alpha.173). Solo documentación y una herramienta; el juego no cambia.

- **Panel creativo para repetirlo:** [docs/PANEL.md](docs/PANEL.md) explica quiénes son los diez perfiles simulados, los seis ejes, el historial de notas (6,4 → 7,2 → 7,5), los pasos de una sesión, el formato de los informes, lo que Jay ya decidió y la petición para la cuarta sesión. Los informes, expedientes y los treinta análisis están en `docs/panel/sesion-1…3/`.
- **`scripts/panel-capture.py`:** las 16 capturas de teléfono que juzga el panel.
- **El cubo pequeño:** Jay no quiere el cubo grande de la I2. Queda anotado en el panel, en [El mundo](docs/MUNDO.md) (regla 6), en [HANDOFF](HANDOFF.md) y en [AGENTS](AGENTS.md); el cambio de código está pendiente.
- **Repositorio más limpio:** README, índice, AGENTS y traspaso reescritos (`HANDOFF_CLAUDE.md` pasa a `HANDOFF.md`). Se borraron `docs/historial/` (85 documentos), `docs/FASES_2026.md`, `docs/SERVIDOR_Y_DUETOS.md`, `docs/handoff-validation.json`, cuatro capturas sueltas en la raíz y las entradas de este archivo anteriores a alpha.142. Todo sigue en Git en la revisión `5914ca9`.

## I6 · Menos ruido y modelo honesto · alpha.173

Rama `claude/i6-menos-ruido`, sobre `claude/i5-decisiones` (dependencia explícita).

- **Menú de seis entradas:** Tu cubo, Mundo, Lugares (nuevo en el menú), Refugio, Sonido y Ajustes. El resto (Mapa, Bitácora, Herramientas, Grabar set, otra semilla, Compartir, Mundo libre, Guía, Cuenta…) queda plegado en «Más», cerrado por defecto. Mismos ID.
- **Modelo honesto (`scripts/play-curve.mjs`):** la regla de 12 min cuenta solo lo que hace crecer la canción; las piezas compradas ya no la cumplen. Nuevo jugador sin sonido y un minuto de «riesgo de abandono».
- **Lo que mide:** el jugador del 75 % y el del 90 % cumplen (máximo 10,7 y 5,6 min sin crecer). **El del 60 % y el que juega sin sonido no:** sin ★★, su canción deja de crecer al ganar (minutos 38–40) durante unos 80 min. Queda abierto; es un modelo, no una medida con personas.
- Pruebas: `menu_v2_smoke.py` (seis entradas y «Más» cerrado), `play-curve.mjs` y las pruebas que pulsan botones del menú abren «Más» antes.

## I5 · Decisiones de Jay · alpha.172

Rama `claude/i5-decisiones`, sobre `claude/i4-final` (dependencia explícita). Jay aprobó las recomendaciones de la tercera sesión del panel.

- **★★ al 75 %** de pulsos a tiempo (antes 85 %) y **★★★ al 70 %** en la ronda Maestro (antes 80 %). En el modelo de dos horas, el jugador que acierta 75 de cada 100 llega a 28 ★ y su canción nunca pasa más de 11 min sin crecer (antes 85 min parada tras ganar). El del 60 % sigue sin ★★.
- **Festival = el Viaje entero:** `?festival=1` ya no termina tras el Lago; sigue por el Bosque, la Tormenta y el Vacío, y el último portal abre el final del Refugio con tu frase y «Otra persona». Créditos: «El Viaje».
- Pruebas: `places.mjs` (75/70 %), `play-curve.mjs` (sin muro al 75 %), `festival-color.mjs`, `journey-finale.mjs` y `festival_smoke.py` (el Lago lleva al Bosque; el Vacío al final).

## I4 · El final que respira · alpha.171

Rama `claude/i4-final`, sobre `claude/i3-instante` (dependencia explícita).

- **Tus notas de los 11 lugares:** el final de «Tu canción» toma las notas de la última ronda de cada lugar y, para los cinco del Viaje que no hayas rejugado, las de su capítulo (antes solo sonaban las de 6 lugares).
- **Con tu ritmo y en la escala del mundo:** cada nota suena en el paso del compás en que la tocaste (se guarda `S.lugares.noteSteps`, normalizado) y se lleva a la nota más cercana de la escala que suena (`snapToScale`).
- **El tema es un momento:** la capa de Faros ya no repite el tema durante el final; tras tus notas, un compás de silencio y el chelo toca el tema dos veces, la segunda una quinta arriba. Los créditos salen al final, no antes.
- **Al menos un minuto:** a tempo rápido, las capas siguen sonando tras el tema hasta llegar a 60 s.
- **No hecho:** el ritardando. El final suena sobre el secuenciador del mundo, que no puede frenar una sola canción.
- Pruebas: `song-tiers.mjs`, `places.mjs`, `song_stage_smoke.py` (créditos con más margen) y `song_stage_mix.py` (render: pico 0,389; «lleno» medido en la cola).

## I3 · Un solo instante · alpha.170

Rama `claude/i3-instante`, sobre `claude/i2-se-vea` (dependencia explícita).

- **Luz, tacto y sonido a la vez:** en un acierto, el brillo dorado del cubo, la vibración y un pequeño golpe del cubo se programan para el momento en que suena la nota (`landDelay`: entre 0 y 250 ms después del toque, contando la latencia de salida). Con movimiento reducido no hay golpe.
- **La Línea anticipa:** cada paso que cuenta crece y se enciende durante los cuatro pasos anteriores a que llegue el cursor (`approach`).
- **Calibración más segura:** solo mide sobre las negras (en el Jardín o la Cueva, que cuentan corcheas, podía tomar el paso equivocado) y nunca mientras el lugar canta su patrón.
- Pruebas: `journey-pulse.mjs` (`landDelay`, `approach`).

## I2 · Que se vea · alpha.169

Rama `claude/i2-se-vea`, sobre `claude/i1-coherencia` (dependencia explícita).

- **El cubo se lee en todas partes:** 1,6× su tamaño, entre 24 y 36 px, en el Camino (antes 6 px), el Mundo y los lugares; las caras caben siempre.
- **El color ganado se ve:** un bioma recuperado lava toda la pantalla con su color además de la luz alrededor del cubo. En el anillo, el 24 % de la pantalla tiene color (antes 5–9 %, medido en capturas de teléfono).
- **La columna dorada desde lejos:** el portal siguiente del camino se marca desde cualquier distancia; fuera de pantalla, la columna queda en el borde de su lado y sustituye a la flecha (`edgeColumn`).
- Pruebas: `cube_face_smoke.py` (24–36 px) y `places-ring.mjs` (columna en el borde).

## I1 · Coherencia · alpha.168

Rama `claude/i1-coherencia`, desde `main`. Tercera sesión del panel: restos que contradecían las decisiones de Jay.

- **El narrador solo en la tarjeta y la Bitácora:** los avisos de logro ya no llevan su frase.
- **Calma tras los créditos:** entre el final del Viaje y el primer portal no se anuncia ningún logro (quedan en la Bitácora) y desaparece el aviso «Tus ✦ cambian tu cubo»; Tu cubo queda marcado.
- **Fuera «Rompe…»:** el Camino, la ayuda y los avisos hablan de tocar a tiempo y de abrir el Mundo con diez cristales.
- **Sin cifras de umbral:** la tarjeta dice «Ritmo · X % a tiempo» y «Maestro», y el narrador ya no dice «Ochenta y cinco por ciento».
- Pruebas: `release-closure.mjs` (aviso sin narrador y calma tras los créditos) y `journey_finale_smoke.py` (marca sin aviso).

## H7 · Medir · alpha.167

Rama `claude/h7-medir`, sobre `claude/h6-escucha` (dependencia explícita).

- **Modelo de las dos primeras horas** (`scripts/play-curve.mjs`, prueba `tests/play-curve.mjs`): tres jugadores al 60, 75 y 90 % a tiempo, del Viaje a los 11 lugares en orden y luego ★★ y Maestro. Los tres ganan antes de 40 minutos y nunca pasan más de 7 sin una novedad (la regla del panel es 12).
- **Hallazgo:** con ★★ al 85 %, a quien acierta 60 o 75 de cada 100 la canción deja de crecer tras ganar (80–85 min sin una capa nueva). El modelo compara la variante ★★ 75 % / ★★★ 70 %. No se cambió ninguna regla: lo decide Jay (`docs/MUNDO.md`, «Las dos primeras horas»).
- `scripts/journey-curve.py` (nivel y densidad del Viaje en el navegador) sigue igual: dos horas no caben en un navegador; el modelo nuevo mide el progreso, no el audio.
- Pendientes: festival (recomendación: solo el Viaje), sesiones con Luca y escucha en un teléfono.

## H6 · Mundo que se escucha · alpha.166

Rama `claude/h6-escucha`, sobre `claude/h5-reglas` (dependencia explícita).

- **La chispa salvaje se encuentra con el oído:** canta una nota del acorde en cada pulso, desde su lado (izquierda o derecha) y más fuerte cuanto más cerca. La flecha en el borde de la pantalla solo aparece con el sonido apagado.
- **Los portales suenan desde su dirección:** el más cercano, en el «1», como antes, pero desde su lado. El siguiente del camino suena suave en el «3» desde mucho más lejos (se oye ya en el Refugio) y guía hasta él.
- La remezcla diaria no cambia.
- Pruebas: `spatial.mjs` (paneo y su cadena), `wild.mjs`, `places-ring.mjs`; `wild_smoke.py` comprueba que la chispa canta y `ring_smoke.py` que el siguiente portal se oye desde su lado. No se oyó en un teléfono ni con auriculares.

## H5 · Reglas claras · alpha.165

Rama `claude/h5-reglas`, sobre `claude/h4-cancion` (dependencia explícita).

- **Solo a tiempo da chispas, también en el Mundo libre:** fuera de tiempo el pulso suena y rompe, pero vale ×0 (antes ×1); a tiempo ×2 y con racha de 8, ×3. Sin sonido no hay compás que cumplir y todo cuenta ×1. La simulación de la economía da la tienda completa en 10,5 h a quien acierta seis de cada diez (antes 9,4) y en 7,2 h a quien acierta nueve (antes 7,0).
- **El Viaje sin rótulos:** los capítulos ya no escriben sus reglas ni avisan del objeto dorado; lo enseñan el gesto, la barra que late y el lugar que canta su patrón.
- **Cada lugar dice cada frase una vez**, la primera vez, y nunca más (guardado en `S.journey.lines`).
- **El narrador en su sitio:** durante una ronda no aparece ningún aviso de logro; la tarjeta de la ronda dice el logro ganado con la frase del narrador. Fuera de las rondas, como siempre. El logro «Treinta y tres» llega con las 33 ★, no con los 11 lugares.
- **Menú:** no se acortó. Ya está en grupos («Jugar» y el resto) y unas 30 pruebas pulsan sus botones; recortarlo merece su propia fase con Jay.
- Pruebas actualizadas: `spark-rules.mjs` y `spark_rhythm_smoke.py` (fuera de tiempo rompe pero no da), `spark-economy-sim.mjs`, y los juegos del Viaje (`journey-*.mjs`, `journey_stick_smoke.py`, `journey_chain_smoke.py`) comprueban que no hay rótulos.

## H4 · Tu canción · alpha.164

Rama `claude/h4-cancion`, sobre `claude/h3-camino` (dependencia explícita).

- **Tu canción es la música del juego:** ya no es un house aparte en La mayor a 120 BPM que callaba el Mundo. El Mundo sigue sonando en su tono y tempo, y el secuenciador añade encima, desde el siguiente «1», la capa de cada lugar ganado sobre el acorde que suena.
- **Las estrellas la hacen crecer:** ★ un fragmento (un compás de cada dos), ★★ la capa entera, ★★★ su variación (una octava arriba, más suave, y los golpes con eco). La capa de los Faros es el tema del cubo en el tono del lugar.
- **El final con los 11 (60–90 s según el tempo):** las capas entran una por compás; después, tus notas de cada lugar en orden (las 8 últimas de su mejor ronda, un compás por lugar); al final, el tema del cubo sobre todo. La versión maestra (33 ★) lo toca todo en su variación.
- **Trofeos:** tocar uno en el Refugio suena su capa dos compases, con sus estrellas, sobre la música.
- Las notas de cada lugar se guardan en `S.lugares.notes` (hasta 8, normalizadas).
- Pruebas: `tests/song-tiers.mjs` (niveles, plan del final, tus notas y el tema); `tests/song_stage_mix.py` (el final maestro renderizado sobre una música de prueba: pico 0,39, más lleno al entrar las capas); `song_stage_smoke.py` comprueba que el Mundo sigue sonando debajo. Límite: falta oírlo en un teléfono.

## H3 · El camino · alpha.163

Rama `claude/h3-camino`, sobre `claude/h2-que-se-sienta` (dependencia explícita).

- **En orden:** tras el Viaje, Jardín → Dunas → Cristales → Faros → Ruinas → Cueva; cada uno se abre al completar el anterior. Ya no hacen falta ★★ para avanzar: un niño que acierta el 75 % llega al final.
- **Ganar = los 11 completos.** Suena el final verdadero («Los 11 lugares»). Con las 33 ★ vuelve, una vez, como versión maestra («Las 33 ★»).
- **Luz al siguiente:** una columna dorada sobre el portal del siguiente lugar del camino; la flecha del borde apunta a él.
- **«Siguiente · lugar»** en la tarjeta de la ronda: lleva a su portal y empieza su ronda.
- **Modo Libre:** un lugar completo ofrece Jugar, Libre y Maestro (con ★★). Libre no tiene barra, estrellas ni chispas; al cerrar su objeto dorado vuelve al portal con su música.
- Textos: un portal cerrado dice «X se abre al completar Y»; Lugares dice «Siguiente: X»; los créditos del Viaje, «Once lugares te esperan».
- **Guardados:** versión 2 de `S.lugares`. Un guardado de antes conserva abiertos los lugares que sus estrellas abrían (`kept`). Nada se borra.
- Pruebas actualizadas a las reglas nuevas: `places.mjs`, `places-ring.mjs`, `refugio-lugares.mjs`, `journey-finale.mjs`, `ring_smoke.py` (Libre sin barra), `refugio_lugares_smoke.py`, `song_stage_smoke.py` (final con 11 y versión maestra con 33), `places_smoke.py` («Siguiente · Jardín»).

## H2 · Que se sienta · alpha.162

Rama `claude/h2-que-se-sienta`, sobre `claude/h1-que-se-vea` (dependencia explícita).

- **Calibración sin menú:** los primeros 12 pulsos cerca de un tiempo miden cuánto tarde oyen y tocan este jugador, este teléfono y estos auriculares. Si coinciden (la mitad central dentro de 60 ms), ese retraso se guarda y cuenta en todo «a tiempo». Quien toca disperso no queda «calibrado»: se sigue midiendo. En Ajustes, «Ajustar el tiempo» lo mueve de 10 en 10 ms o lo mide otra vez.
- **Una sola guía:** los pasos que cuenta el lugar se levantan en la Línea (el «1» en dorado cuando cuenta). Se quitan los puntos bajo el cubo y los del Vacío.
- **El lugar canta su patrón antes:** al empezar una ronda o un capítulo con ritmo, durante dos compases desde el siguiente «1» suenan un golpe y una nota en cada paso que cuenta, y la Línea brilla con ellos. Se retiran las frases «Aquí se toca en el «y»…».
- **El cubo cambia con la racha (Vibri):** cada 4 aciertos seguidos gana una forma (esquinas, rombo, doble marco dorado que gira); un fallo quita una, nunca todas.
- **Ruinas, arreglo:** los pulsos se agrupan por compás con el reloj de audio. Antes se redondeaba una hora del reloj de la página y, si el compás empezaba cerca del borde del redondeo, tres pasos del mismo compás contaban en dos compases distintos y no ponían piedra.
- Pruebas: `tests/rhythm-calibration.mjs` (un jugador simulado 150 ms tarde pasa de fuera de tiempo a tiempo); `tests/journey-rhythm.mjs` (formas y canto de dos compases). Las pruebas de navegador que pulsan en un paso concreto aceptan el primer fotograma tras el paso (antes podían saltarlo).

## H1 · Que se vea · alpha.161

Rama `claude/h1-que-se-vea`, desde `main`. Primera fase del plan integrado que Jay aprobó tras la segunda sesión del panel ([El mundo](docs/MUNDO.md)).

- **El acierto se ve siempre:** el cubo brilla en dorado en cada pulso a tiempo, también en teléfonos que vibran (antes solo sin vibración). La onda de un pulso a tiempo es dorada y algo más gruesa.
- **El cubo se ve en el teléfono:** en el Mundo se dibuja 1,6 veces su tamaño, entre 16 y 30 px (antes 6–22). Solo cambia el dibujo: alcances, choques y el crecimiento por nivel siguen igual.
- **El oro sigue dorado:** el gris de un lugar aún sin color ya no filtra toda la pantalla; se pinta solo sobre el suelo, antes de los juegos, el cubo y los portales.
- **Color como tono:** un lugar con su color recuperado se tiñe más de él (luz del 18–30 % en vez de 5–12 %).
- **Cerrar un lugar recupera su color** para siempre.
- **Lugares:** un lugar con ★ ya no dice «Sin visitar»; la remezcla deja de ser un segundo botón dorado.
- **Ruinas, arreglo** (visto en la CI de esta fase): los pulsos se agrupan por compás con el reloj de audio; redondear una hora del reloj de la página podía partir un compás en dos y tres pasos no ponían piedra. Las pruebas que pulsan en un paso concreto aceptan el primer fotograma tras el paso.
- `cube_face_smoke` mide el cubo nuevo: 16 px sin cara, unos 27 con ella.
- Pruebas: `world-sheet.mjs` y `world_sheet_smoke.py` comprueban el gris en el lienzo y la pantalla sin filtro. `?anillo=1` y `?lugar=` siembran los colores de los cinco capítulos, como una partida real tras el Viaje.

## F18 · Mundo salvaje · alpha.160

Rama `claude/f18-salvaje`, sobre `claude/f17-cueva` (dependencia explícita).

- **Chispa salvaje:** al explorar el Mundo libre, entre uno y dos minutos después de la anterior (y tras unos 1 200 px andados), aparece una chispa dorada por delante del cubo. Cinco pulsos a tiempo a su lado la atrapan: +15 ✦. Cada pulso la hace saltar un poco; a los 30 s se va sin castigo. Si sale de la pantalla, una flecha dorada la señala.
- **Remezcla diaria:** cada día un lugar abierto se juega con el ritmo de otro (por ejemplo, la Llanura en «1 · 3 · y»). Está en la hoja Lugares del Refugio. Paga 30 ✦ más al cerrarla y 20 más si superas el mejor porcentaje a tiempo del día. No hay Maestro de la remezcla. Jardín, Dunas, Vacío y Cueva no se remezclan: su juego depende de su propio ritmo.
- Pruebas: `tests/wild.mjs`, `tests/wild_smoke.py` (teléfono y escritorio). Límite: el ritmo de aparición se fijó por diseño, no se midió con personas.

## F17 · Cueva · alpha.159

Rama `claude/f17-cueva`, sobre `claude/f16-ruinas` (dependencia explícita).

- **Eco:** la cueva canta un patrón durante un compás y tú lo repites en el siguiente. Bajo el cubo, ocho casillas son las corcheas del compás: mientras canta se encienden en rojo sus pasos; mientras respondes, esperan los tuyos y se vuelven doradas.
- Todos los pasos a tiempo y ninguno de más es un eco: vale 6 más 2 por paso y el siguiente patrón tiene un paso más (de 2 a 5). Una respuesta con errores suma 2 por paso acertado y acorta el siguiente. El patrón siempre empieza en el «1».
- El secuenciador de la música canta la llamada, así que siempre cae en su compás.
- **Final:** con la barra llena cae una gota dorada; un pulso a tiempo la atrapa. Su trofeo son ondas de eco. Se abre con 24 ★; `?lugar=cueva`.
- **Con la Cueva, los once lugares tienen juego: ya se pueden ganar las 33 ★.**
- Meta 250. Media de 30 jugadores simulados: 2:27 con el 75 % a tiempo, 1:34 con el 90 % (los patrones largos valen más), 3:08 en Maestro.
- Pruebas: `tests/journey-echo.mjs`, `tests/echo_smoke.py` (teléfono y escritorio). Las pruebas de navegador de Faros, Ruinas y ritmos pulsan teniendo en cuenta la latencia de salida.

## F16 · Ruinas · alpha.158

Rama `claude/f16-ruinas`, sobre `claude/f15-faros` (dependencia explícita).

- **Reconstruye:** ocho columnas rotas en anillo; algunas conservan una o dos piedras. Junto a una columna, toca el patrón de las Ruinas, «1 · 2y · 3 · 4». Tres de sus cuatro pasos en un mismo compás ponen una piedra (los cuatro en Maestro). Bajo la columna, tres marcas cuentan los pasos de este compás.
- **Arcos:** una columna tiene siete piedras. Dos columnas enteras vecinas levantan un arco dorado, que vale más.
- **Final:** con la barra llena llega una piedra dorada; un pulso a tiempo la coloca. Su trofeo es un arco. Se abre con 20 ★; `?lugar=ruinas`.
- Meta 265 de 284 posibles; en Maestro, toda la ruina. Simulación (modelo, jugador que no se distrae): 2:13 con el 75 % a tiempo, 1:51 con el 90 %, 4:15 en Maestro. Una persona tardará algo más.
- Pruebas: `tests/journey-rebuild.mjs`, `tests/rebuild_smoke.py` (teléfono y escritorio).

## F15 · Faros · alpha.157

Rama `claude/f15-faros`, sobre `claude/f14-ritmos` (dependencia explícita).

- **Guía:** el cubo es un faro. Seis barcos esperan perdidos en la oscuridad alrededor del puerto, donde empieza la ronda. Un pulso a tiempo cerca de un barco lo enciende: te sigue dos compases, y cada pulso a tiempo cerca lo mantiene encendido. Llévalo encendido al puerto y atraca. Otro barco ocupa su lugar.
- **Convoy:** un barco vale 4; cada otro barco encendido que venga con él suma 2 (hasta 10). Traer varios a la vez rinde más.
- **Ritmo:** destellos en «1 · 3 · y». El haz gira con el compás desde el cubo y destella al tocar.
- Una flecha dorada en el borde señala el puerto mientras llevas barcos; si no llevas, una blanca señala el barco más cercano.
- **Final:** con la barra llena llega un barco dorado; un pulso a tiempo lo enciende. Su trofeo es un faro. Se abre con 16 ★; `?lugar=faros`.
- Meta 260. Simulación (modelo): 2:28 con el 75 % a tiempo, 2:23 con el 90 %, 3:30 en Maestro.
- Pruebas: `tests/journey-guide.mjs`, `tests/guide_smoke.py` (teléfono y escritorio).

## F14 · Ritmos · alpha.156

Rama `claude/f14-ritmos`, sobre `claude/f13-victoria-musica` (dependencia explícita).

- **Cada lugar con su ritmo** (tabla aprobada en [El mundo](docs/MUNDO.md)): el Lago como lugar y las Dunas en el «y»; la Tormenta «1 · 2 · y» (también en el Viaje); los Cristales «1 · y · 2»; el Jardín siembra y cosecha a tiempo y riega en el «y». Llanura y Bosque siguen a tiempo; el Vacío, en el «1».
- **Solo cuenta el paso del ritmo:** un pulso en otro paso, aunque caiga en un tiempo, no hace nada. La marca de la Línea se pone en el paso que respondiste.
- **Guía de puntos bajo el cubo:** ocho corcheas; las que cuentan se ven, el «1» en dorado, la del momento brilla y un aro marca el último acierto. La primera vez que aparece un ritmo nuevo, una línea lo dice.
- Dos corcheas seguidas están a 250 ms a 120 BPM y el toque descartaba pulsos a menos de 240 ms; con un ritmo de corcheas ese límite baja a dos tercios de una corchea.
- La ola de las Dunas pasa en el «y».
- Pruebas: `tests/journey-rhythm.mjs`; `tests/rhythm_smoke.py` (Lago, Cristales y Tormenta del Viaje: sus pasos cuentan, los demás no); `garden_smoke` siembra en el tiempo y riega en el «y»; `surf_smoke` comprueba la ola en el «y»; los pulsos de prueba de 19 pruebas siguen el ritmo del lugar. Límite: la simulación del Jardín da el mismo tiempo (2:24); los demás tiempos no se volvieron a medir.

## F13 · Victoria con tu música · alpha.155

Rama `claude/f13-victoria-musica`, sobre `claude/f12-primer-minuto` (dependencia explícita).

- **El cierre sale de la música que suena:** durante un compás el filtro de la música se cierra bajo un ruido que sube; el último medio tiempo es silencio de verdad (también el eco); en el «1» vuelve la misma música, en su tono y tempo, con algo más encima.
- **Lo que se suma:** la capa del lugar en Tu canción (bombo en la Llanura, bajo dub en el Lago, arpegio en el Jardín…) y el tema del cubo con el timbre del lugar. La capa la toca el secuenciador semicorchea a semicorchea, sobre el acorde que suena en el mundo en cada compás; por eso no puede desafinar.
- Los drops de género propio (house, dub, disco…) se retiran: Jay los oyó ajenos al resto de la música.
- Pruebas: `tests/journey-victory.mjs` (la capa sigue al acorde del mundo); `tests/victory_mix.py` renderiza los once cierres sobre una música de prueba (silencio de −109 dB, vuelta más llena, pico 0,57); `tests/victory_live_smoke.py` en el juego real (32 semicorcheas, salida y filtro enteros después, la música sigue). Límite: falta la escucha de Jay.

## F12 · Primer minuto · alpha.154

Rama `claude/f12-primer-minuto`, desde `main`.

- **La barra late antes del primer pulso:** en el Camino y en un capítulo del Viaje, si pasan cinco segundos sin cuadros abiertos y sin ningún pulso, la barra de arriba se ilumina suave en cada tiempo de la música (a 120 BPM antes de que suene, como en un teléfono antes del primer toque). El primer pulso la apaga. Se suma al dedo fantasma de la pista.
- **Llanura más larga:** meta 150 (antes 60). Jay la terminó en menos de un minuto ya sabiendo jugar; con esta meta debería durar unos 2:30. Los demás capítulos se miden en su prueba antes de tocarlos.
- **Plan nuevo F12–F19** en [El mundo](docs/MUNDO.md): victoria con la música que suena (F13), ritmos distintos por lugar (F14, con el reparto aprobado), Faros, Ruinas y Cueva (F15–F17), Mundo salvaje (F18) y cierre con personas (F19).
- CI: las pruebas de navegador pasan de 4 a 6 grupos; con las pruebas de los lugares, dos grupos superaban los 30 minutos y se cancelaban.
- Pruebas: `tests/bar-beat-hint.mjs`, `tests/bar_beat_hint_smoke.py` (teléfono y escritorio: no bajo la bienvenida, sí cinco segundos después, se apaga con el primer pulso); `journey_stick_smoke` usa la meta nueva. Límite: la duración de la Llanura es una estimación a partir del tiempo de Jay.

## F11 · Cristales · alpha.153

Rama `claude/f11-cristales`, sobre `claude/f10-dunas` (dependencia explícita).

- **Resuena:** nueve cristales alrededor de donde empieza la ronda, tres de cada nota (triángulo, rombo y hexágono). Un pulso a tiempo cerca hace sonar los cristales al alcance; cada uno sigue sonando unos 16 tiempos mientras su arco dorado se apaga. Fuera de tiempo no suena nada.
- **Acorde:** cuando suenan a la vez las tres notas distintas, forman un acorde: vale mucho más y los tres callan para empezar el siguiente. Tres marcas bajo el cubo muestran qué notas suenan.
- **Final:** con la barra llena llega un cristal dorado; un pulso a tiempo lo hace cantar. Su drop es trance y su trofeo, un hexágono. Se abre con 12 ★; `?lugar=cristales`.
- **Ritmo:** meta 260. Media de 100 rondas simuladas: 2:27 con el 70 % a tiempo, 2:03 con el 90 %, 3:29 en Maestro (sonido de 15 tiempos y barra ×1,5). Es un modelo.
- El fondo se oscurece un poco más que en otros lugares: la malla de triángulos del bioma competía con los cristales.
- Pruebas: `tests/journey-resonance.mjs`, `tests/resonance_smoke.py` (teléfono y escritorio), `victory_mix.py` con ocho drops.

## F10 · Dunas · alpha.152

Rama `claude/f10-dunas`, sobre `claude/f9-jardin` (dependencia explícita).

- **Surfea:** olas de arena cruzan las dunas, una por compás. Un círculo marca dónde pasará la cresta de la próxima y un arco alrededor se cierra hasta su tiempo. Dentro del círculo, un pulso a tiempo justo cuando pasa la cresta la surfea: la ola te empuja y la barra se llena. Dentro del círculo pero en otro tiempo, o fuera de tiempo, no pasa nada.
- **Racha:** 2, 3 y 4 por ola seguida (marcas doradas bajo el cubo); dejar pasar una ola empieza de nuevo. En Maestro el círculo es más pequeño y la barra ×1,5.
- **Final:** con la barra llena llega una ola dorada; surfearla cierra la ronda. Su drop es afro house y su trofeo, una ola.
- **Se abre con 8 ★.** `?lugar=dunas` da a su guardado de prueba las estrellas que pide.
- Las olas siguen la rejilla de tiempos de la música aunque cambie de tempo (al llegar a las Dunas o en Maestro).
- **Ritmo:** meta 150. Media de 200 rondas simuladas (una ola cada dos segundos): 2:33 surfeando el 65 %, 1:41 con el 85 %, 3:48 en Maestro. Es un modelo.
- Pruebas: `tests/journey-surf.mjs`, `tests/surf_smoke.py` (teléfono y escritorio), `victory_mix.py` con siete drops.

## F9 · Jardín · alpha.151

Rama `claude/f9-jardin`, sobre `claude/f8-logros` (dependencia explícita).

- **Siembra:** ocho parcelas alrededor de donde empieza la ronda, cerca y lejos alternadas. Un pulso a tiempo sobre una parcela vacía siembra; cada pulso a tiempo hace crecer lo que hay al alcance (semilla, brote, capullo, flor); sobre una flor, la recoge y la parcela queda libre. Fuera de tiempo no pasa nada.
- **Cuidar:** una planta sin atender ocho compases se marchita un paso. Un arco dorado alrededor de cada planta muestra el tiempo que le queda; parpadea al final. En Maestro, seis compases y barra ×1,5.
- **Sonido:** cada flor añade la nota siguiente de un arpegio sobre el acorde (la capa del Jardín en tu canción); su cierre suena a garage.
- **Final:** con la barra llena llega un árbol dorado; un pulso a tiempo lo hace florecer y cierra la ronda con estrellas, chispas y su tarjeta. Su trofeo es una flor.
- **Abre con 5 ★:** el Viaje terminado ya lo abre; su portal está en el anillo y `?lugar=jardin` lo prueba.
- **Arreglo para todas las rondas (F4):** con «Todo a la vista», la barra de arriba no se veía ni mostraba el avance de la ronda, y los efectos sobre el cubo no se dibujaban. Ahora la barra sigue la ronda en los dos modos.
- **Ritmo:** meta 360. Un jugador simulado (150 px/s, un pulso por segundo, un segundo para situarse en cada parcela) tarda 2:24 con el 75 % a tiempo, 2:08 con el 90 % y 3:31 en Maestro; una persona tarda algo más. Es un modelo, no una medida con personas.
- Pruebas: `tests/journey-garden.mjs` (lógica y ritmo), `tests/garden_smoke.py` (teléfono y escritorio, los dos modos de pantalla), `victory_mix.py` con seis drops; `places`, `places-ring`, `refugio-lugares` y sus pruebas de navegador ahora usan las Dunas como lugar cerrado.

## F8 · Logros del narrador · alpha.150

Rama `claude/f8-logros`, sobre `claude/f7-cancion` (dependencia explícita).

- **El narrador:** los logros hablan con voz burlona, al estilo de *Dungeon Crawler Carl*, para todas las edades. Al ganar uno, el aviso muestra el título y debajo su frase; en la Bitácora, la frase va en dorado bajo cada logro ganado.
- **Nada ganado se pierde:** 40 logros que ya existían conservan su id, su título y su fecha; solo cambia su voz (Día 1, El Mundo, Cajas, Cometa, Freeze, Contratiempo, Atlas, Rachas, la Luna de oro…).
- **23 logros nuevos** para los lugares, las estrellas, el anillo y tu canción: Una estrella, Ritmo, Maestro, Cinco Maestros, Casi ritmo, Con prisa, Sin prisa, Inquilino, Contra ti, Turismo intensivo, 10/20/33 estrellas, Puerta cerrada, Conocido del anillo, A medias, Caminar es de otros, Presumido, Fan número uno y Prólogo; y tres secretos (Sospechoso, Valiente, Madrugada).
- Se ganan solos al cerrar una ronda, al tocar un portal cerrado, al dejar una ronda, al viajar rápido, al tocar un trofeo, al escuchar tu canción y al terminar el Viaje. Varios a la vez se anuncian juntos («4 logros nuevos»), como antes.
- Pruebas: `tests/narrator.mjs` (cada frase pertenece a un logro que existe, ningún id nuevo reutiliza uno viejo, frases de 20 palabras o menos, lo que gana cada ronda); `achievements_v2_smoke` y `universe_mischief_smoke` cuentan 376 + 23 logros. Límite: los textos siguen el tono de la muestra que vio Jay; él no los ha aprobado uno por uno y cualquier frase se cambia en `narrator.js` sin tocar nada más.

## F7 · Tu canción · alpha.149

Rama `claude/f7-cancion`, sobre `claude/f6-refugio` (dependencia explícita).

- **Una canción, once capas:** ocho compases de house a 120 BPM en La mayor (La, Mi, Fa♯m, Re). Cada lugar da una capa: Llanura bombo, Lago bajo dub, Bosque palmas y platillos, Tormenta ácido, Vacío colchón, Jardín arpegio, Dunas percusión, Cristales campanas, Faros la melodía del cubo, Ruinas acordes y Cueva eco.
- **Final del Viaje nuevo:** cada capítulo ocupa dos compases; su capa entra bajo tus notas a tiempo, con tu ritmo, y su anillo se enciende con su nombre y su verbo. Después, el tema dos veces sobre las cinco capas, y aparecen apagados los seis lugares por venir. Termina en «Tu mundo se abrió · 11 lugares · 33 ★», con los once anillos y el botón «Explorar». Ya no hay violonchelo.
- **En el Refugio:** tocar un trofeo hace sonar su capa dos compases. En Lugares, «Tu canción» la toca con las capas ganadas: once anillos, los tuyos encendidos y latiendo, los que faltan punteados («Tu canción · 5 de 11»). La música del Mundo espera mientras suena.
- **Ganar el juego:** con las 33 ★, al cerrar la tarjeta de la ronda, entran las once capas una por compás y termina en «Las 33 ★ · Tu canción está completa». Solo una vez; luego se escucha desde Lugares.
- El festival conserva su final con «Otra persona».
- Pruebas: `tests/song_mix.py` (render sin conexión: cada capa se oye, las once juntas sin saturar, pico 0,50), `tests/song_stage_smoke.py`, y `journey-finale.mjs`, `journey_finale_smoke.py` y `festival_smoke.py` actualizadas. Límite: no se escuchó en un teléfono; las capas de los seis lugares nuevos suenan desde ya, aunque sus juegos lleguen en F9–F14.

## F6 · El Refugio como centro · alpha.148

Rama `claude/f6-refugio`, sobre `claude/f5-anillo` (dependencia explícita).

- **Muro de estrellas:** en la Sala, «LUGARES · ★ N / 33»; en la barra de la casa, el botón «★ N / 33».
- **Sala de trofeos:** once zócalos; cada lugar con su ★ pone ahí el objeto dorado de su juego (pegar, cadena, lazo, espiral, estrella), más brillante con cada estrella. Al tocarlo dice su lugar, sus estrellas y su % a tiempo, y suena su nota en tres pasos (su capa de la canción llega en F7).
- **Mesa de lugares:** tocar el muro o «★ N / 33» abre Lugares: los once con sus estrellas, su % o lo que piden, «Sin visitar», la siguiente meta («Jardín se abre con 5 ★. Faltan 2.») e «Ir» a los ya visitados.
- **Puerta al anillo:** «Salir al anillo» e «Ir» dejan el Refugio; «Ir» te deja junto al portal.
- En una visita a otro Refugio no se muestran tus estrellas.
- Pruebas: `tests/refugio-lugares.mjs` y `tests/refugio_lugares_smoke.py` (teléfono y escritorio); las seis pruebas de navegador de la casa siguen pasando. Límites: en una visita aún no se ven las estrellas del dueño (el código de casa no las lleva); la capa musical de cada trofeo llega en F7.

## F5 · El anillo · alpha.147

Rama `claude/f5-anillo`, sobre `claude/f4-estrellas` (dependencia explícita).

- **Portales:** los 11 lugares forman un anillo dorado alrededor del Refugio, a 6000 px de su puerta (unos 32 s a pie). Si un portal cae en el mar, se corre por su radio hasta tierra. El anillo sigue al Refugio cuando se mueve; antes del primer Refugio queda donde se abrió el Mundo libre.
- **Entrar:** caminar hacia un portal abierto empieza su ronda. Con ★★, primero «Jugar» o «Maestro». Uno cerrado avisa cuántas ★ pide y cuántas tienes.
- **Sin palabras en la pantalla tranquila:** las estrellas se dibujan; un cerrado muestra un arco dorado con las ★ que llevas de las que pide. Con «Todo a la vista» también se escriben el nombre y lo que pide.
- **Sonido:** en cada «1» del compás suena la nota del portal más cercano (una por lugar), más fuerte al acercarse; los cerrados, más bajo.
- **Flecha:** en el borde de la pantalla, hacia el lugar abierto más cercano que aún no has visitado o que no tiene su ★.
- **Volver:** «Salir» en la tarjeta, «Dejar la ronda» en el menú (solo durante una ronda) y una recarga a mitad de ronda te dejan junto al portal.
- **Mapa:** los portales con sus estrellas, y «Ir a» con los lugares ya visitados: viaje rápido gratis junto a su portal.
- **`?anillo=1`:** el Mundo libre tras el Viaje, sin ronda, con el guardado de prueba de `?lugar=`.
- Pruebas: `tests/places-ring.mjs` y `tests/ring_smoke.py` (teléfono y escritorio). Límites: los portales aún no están en su bioma (la ronda sí lleva a él); la mesa del mapa del Refugio llega en F6; no se midió el paseo con personas.

## F4 · Lugares y estrellas · alpha.146

Rama `claude/f4-estrellas`, sobre `claude/f3-chispas` (dependencia explícita).

- **Rondas:** tras el Viaje, cada capítulo es un lugar que se puede volver a jugar. Una ronda es su juego con la barra vacía, en su bioma, y termina con su objeto dorado y su drop.
- **Estrellas:** ★ al completar; ★★ con el 85 % de pulsos a tiempo; ★★★ en la versión Maestro (se abre con ★★: tempo +10 %, barra ×1,5 y margen a tiempo más estrecho) con el 80 %. Sin sonido, solo ★. Las estrellas no dan chispas.
- **Del Viaje:** al cumplir un capítulo se gana su ★, y su ★★ si se jugó con el 85 % a tiempo. Quien ya lo había cumplido recibe su ★.
- **Chispas:** cada ronda paga 60–120 ✦ según el % a tiempo (Maestro el doble; desde la cuarta del día en ese lugar, la mitad).
- **Tarjeta de resultado:** las tres estrellas (las nuevas brillan), qué pide cada una con tu %, el tiempo, las chispas, «récord», y los botones «Otra vez», «Maestro» y «Salir».
- El estado del capítulo del Viaje no se pierde: se guarda aparte durante la ronda y vuelve al terminar. Una ronda a medias se descarta al recargar.
- Las estrellas viven en `S.lugares`: `S.places` ya guarda las regiones visitadas del mapa y no se toca.
- **`?lugar=lago`** (`&maestro=1`) prueba una ronda con su propio guardado. Los portales para entrar llegan en F5.
- Pruebas: `tests/places.mjs` y `tests/places_smoke.py` (incluye recarga). Límite: no se probó la sincronización en la nube de `S.lugares`.

## F3 · Economía de chispas · alpha.145

Rama `claude/f3-chispas`, sobre `claude/f2-victoria` (dependencia explícita). Las chispas sirven para comprar; las estrellas, para avanzar y ganar.

- **Tocar a tiempo vale más en el Mundo libre:** lo que rompe un pulso a tiempo da el doble de chispas, y desde el octavo pulso a tiempo seguido, el triple. El «+n ✦» lo dice en dorado: «×2», «×3». La racha se rompe fuera de tiempo o tras 4 s sin tocar. Sin sonido no hay multiplicador, porque sin beat todo pulso cuenta como a tiempo.
- **Rondas de los lugares** (se usarán en F4): 60 ✦ + 6 por cada 10 % a tiempo (60–120), Maestro el doble; desde la cuarta ronda del día en un mismo lugar, la mitad.
- **Simulación** (`scripts/spark-economy.mjs`): la minería medida a ×2 y ×3 es exactamente el doble y el triple; con la mitad del tiempo en lugares, la tienda completa (17 030 ✦, sin cambiar precios) lleva unas 9,4 horas tocando a tiempo seis de cada diez pulsos y unas 7 tocando nueve de cada diez. Antes, de 20 a 28 horas. Es un modelo, no una medida con personas.
- Pruebas: `tests/spark-rules.mjs`, `tests/spark-economy-sim.mjs` y `tests/spark_rhythm_smoke.py`.

## F2 · Sonido de victoria · alpha.144

Rama `claude/f2-victoria`, sobre `claude/f1-ritmo` (dependencia explícita). A Jay el sonido al completar un nivel le pareció horrible, triste y nada electrónico: era el tema en violonchelo.

- **El drop:** al cerrar un capítulo, desde el siguiente «1»: un compás de ruido que sube mientras la música se filtra hacia abajo, medio tiempo de silencio y dos compases con el beat completo y el tema del cubo en un sintetizador. El filtro de la música se abre de golpe en el drop.
- **Un estilo por capítulo:** Llanura house (bombo a negras, palmas, acordes a contratiempo), Lago dub (medio tiempo, ecos), Bosque disco (bajo en octavas, charles en semicorcheas), Tormenta techno (bombo duro, bajo grave, línea ácida) y Vacío ambient (sin percusión: un pad y el tema en campanas con eco).
- El portal se abre al terminar el drop. Sin sonido no suena nada y el portal espera lo de siempre.
- **Mezcla:** `tests/victory_mix.py` renderiza los cinco drops: sube, hay silencio antes del drop, el drop es lo más fuerte y el pico queda en 0,57 (margen sobre la música). Los sonidos de los cinco juegos se revisaron por nivel frente a los del juego; no se renderizaron aparte.
- Pruebas: `tests/journey-victory.mjs`, `tests/victory_mix.py`; la prueba de la Llanura comprueba que el filtro de la música se vuelve a abrir.

## F1 · Ritmo de los niveles · alpha.143

Rama `claude/f1-ritmo`, sobre `claude/f0-viaje-juegos` (dependencia explícita). Jay tardó 8 min en la Llanura, menos de 1 en el Lago y el Bosque, 3 en la Tormenta, y el Vacío le pareció demasiado rápido. Meta: 2:30–3:00 por capítulo.

- **Llanura:** meta 60 (antes 120); más cosas cerca (más de 8 celdas de 10) y más piedras y cometas.
- **Lago:** meta 340 (antes 100); los racimos, más separados.
- **Bosque:** meta 240 (antes 100); cada luciérnaga vale como mucho 3.
- **Tormenta:** meta 250 (antes 100); el primer círculo aparece junto al cubo, para aprender la regla de inmediato.
- **Vacío:** solo se suelta en el «1» del compás; cuatro puntos bajo el cubo cuentan el compás y el primero, dorado, es el «1». Cada estrella pide su cielo, a 100 px de las demás: hay que moverse para dibujar la constelación. Sin sonido vale cualquier pulso.
- **Medida:** un jugador simulado (150 px/s, 80 % de aciertos), calibrado con los tiempos de Jay, estima 2:20–2:55 por capítulo. Es una estimación: la confirman la prueba de Jay y las notas de `?prueba=1`.
- Los juegos reciben el paso del compás de cada pulso.

## F0 · El Viaje por juegos en `main` · alpha.142

Rama `claude/f0-viaje-juegos`, desde `main` (alpha.141, con los cinco capítulos integrados en las PR #315–#319). Primera fase del plan aprobado en [El mundo](docs/MUNDO.md).

- **[El mundo](docs/MUNDO.md):** el plan completo, F0–F16, con chispas para comprar y estrellas para avanzar y ganar.
- **`?capitulo=`** (`llanura`, `lago`, `bosque`, `tormenta`, `vacio`): abre el Viaje directamente en ese capítulo, sin cuenta y con su propio guardado; cada carga empieza el capítulo de nuevo.
- **El festival** juega el Lago nuevo: termina al abrir la flor dorada.
- Cada juego vuelve a leer su estado si el guardado lo reemplaza.
- **Bosque:** la estela dura 8 s (antes 5): una vuelta a paso normal tarda unos 4,6 s y en un teléfono lento no llegaba a cerrarse.
- El saludo de regreso ya no reabre la bienvenida del Camino si ya se dio por vista (`?capitulo=` la dejaba encima del capítulo).
- Pruebas: `tests/chapter_test_smoke.py`; `tests/festival_smoke.py` usa el Lago nuevo.

## Antes de alpha.142

Las entradas anteriores (alpha.58–alpha.141: universo, superbiomas, fases 0–7, Viaje por juegos) se quitaron de este archivo el 24 de octubre de 2026. Siguen en Git: `git show 5914ca9:CAMBIOS.md`.

## Integración confirmada en main

[PR #353](https://github.com/Jaywrkr/WHITEDOT/pull/353) · [CI de integración](https://github.com/Jaywrkr/WHITEDOT/actions/runs/40164328278) aprobado: lógica, seis grupos de navegador, tres de audio y agregador. Se conserva alpha.181 y el mismo runtime; aceptación humana y tiendas permanecen pendientes.

## Sexta auditoría · experiencia real de Jay

Rama `audit/panel-6-experiencia-real`, desde main `3c5fd7b6`, misma versión alpha.181. Revisión documental, sin cambios al juego. Se verifica la falta de acceso inicial gratuito al siguiente lugar, salto de paisaje ajeno al anillo, rumbo sin Y, centro móvil del anillo y ruta musical final5 que conservaba su arreglo anterior. Aviso X1 recortado reproducido con geometría controlada.

[Sexta sesión](docs/panel/sesion-6/informe.md): media provisional7,2 frente a8,1 por nueva evidencia humana, no por una regresión de código nueva. [K1–K5](docs/panel/sesion-6/plan.md) propuestas; no implementadas. U03/U04 reabiertos; A04/U05–U08 nuevos; V01 con rechazo concreto de Jay. Pruebas y límites en el expediente; generadores, arte y progreso intactos.

## alpha.182 · K1 · guía a pie al anillo

Desde la auditoría `7476aa7a`, rama `pulido/k1-guia-anillo`. Seguir hacia el siguiente lugar orienta sin mover ni cobrar. Nombre/distancia, indicador de ocho rumbos y ancla del anillo migrada desde la ubicación vigente, independiente de la casa portátil. Si falla guardar, se revierte la migración. El siguiente resultado también propone caminar. Música, generación y estrellas conservadas.

## alpha.183 · K2 · recoger siempre tiene valor

Rama `pulido/k2-economia-chispas` desde K1. Fuera de tempo×1, a tiempo×2 y racha×3. Recuperación de pendientes con multiplicador cero, sin reemitir fragmentos cobrados ni alterar saldo/precios/estrellas. Simulación económica alineada con esa regla. Música y mundo conservados.

## alpha.184 · K3 · final5 en su contexto musical

Rama `pulido/k3-final-viaje` desde K2. El final de cinco círculos interpreta las notas guardadas en escala/tono y tempo de salida (90–150 BPM), con las mismas voces existentes, entradas separadas y menor ácido. La cama y las frases comparten armonía; una envolvente local deja silencio real antes de créditos y se cancela al salir. Cada círculo sigue ataques de su capa. No se modifican radio, instrumentos, generadores o MIDI guardados.

## alpha.185 · K4 · menú y avisos adaptables

Rama `pulido/k4-interfaz-clara` desde K3. Continuar/Seguir principal, tres destinos, utilidades discretas y sonido en Ajustes, conservando IDs/capacidades. Explorar en la partida terminada conserva el Mundo. Avisos territoriales cortos con columnas mínimas y ajuste de línea; ayuda de guardar situada junto al marcador. No cambia música o dibujo del mundo.

## alpha.186 · K5 · guía tras el Viaje

Rama `pulido/k5-recorrido-contextual` desde K4. Créditos explican cinco completados y seis nuevos; Explorar a pie sale del Refugio y activa el rumbo, sin trasladar al portal. La guía ofrece el mismo destino y agrupa experiencias opcionales. Tras terminar el Viaje se oculta la antigua lección automática de guardar sin borrar hechos; Practicar la reactiva voluntariamente. Formatos futuros y progreso se conservan.

## alpha.187 · K6 · verificación e integración del cierre

Rama `pulido/k6-validacion-cierre` desde K5. Marcha con teclas reales hasta Jardín sin asignar coordenadas, recompensa acelerada por el controlador real, rumbo a Dunas y recarga. Seguir también funciona tras volver al Camino; regreso al Camino queda en Más y sus controles/pruebas reflejan su ubicación. Regiones y Otro paisaje distinguen metas; viaje rápido voluntario a capítulos ya completos. Dos desbordamientos con texto doble corregidos. Guardia de preservación permite solo la integración/UI autorizadas y conserva297 archivos/voz/generación/arte.

[Entrega](docs/CIERRE_K.md):246 suites,48 muestras UI y recorridos afectados aprobados; cinco renders final5 reutilizados con código sonoro intacto. Canonical U03–U09/A04/E01 actualizados; aceptación humana/CI remoto no declarados. Nota técnica provisional7,9 del panel simulado, sin escucha del auditor. Main no se modifica.
