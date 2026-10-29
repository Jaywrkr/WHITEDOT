# El mundo de Kubono

Reglas vigentes en `main`, **alpha.233** (con los arreglos de Jay A–E, el Mapa del cielo, los arreglos de Jay G1–G3 y «Chispas solo en el universo», H1); el [Mapa del universo](#mapa-del-universo) (alpha.235) está en rama. [Traspaso](../HANDOFF.md) · [El Viaje](VIAJE.md) · [mapa técnico](ARQUITECTURA.md). Los planes anteriores están construidos o registrados en sus entregas; no son una nueva lista de tareas.

## Propósito y recorrido

Explorar para descubrir sonidos, tocar a tiempo y construir Tu canción. El recorrido principal enseña cinco verbos; después puedes completar los once lugares, explorar el universo y conservar tus hallazgos. El Refugio es voluntario.

| Espacio | Función |
|---|---|
| Viaje | Camino, cinco capítulos y cierre; aprende jugando |
| Once lugares | Rondas que se abren en orden y amplían Tu canción |
| Universo abierto | Música procedural, criaturas, hallazgos, actividades y favoritos |
| Refugio | Trofeos, objetos, colección y jardín de voces |

Volver no es empezar (panel 11, Q6, D7-C). Diez cristales del Camino abren el Mundo la primera vez. Después, un día nuevo te deja donde estabas: en el Mundo, también a mitad del Viaje, o en el Camino. No hay salto diario al cargar. El Camino del día vuelve como paseo: sus cristales dan luz, no ✦ (desde alpha.233, H1), y el décimo no te mete en el Mundo; «Entrar al Mundo» espera en el dock. Lo prueba `lastWorldDay` o el logro «mundo», que guarda `enterWorld`; no hace falta migrar.

El cubo permanece pequeño. Música, generación y partidas se conservan; color ganado y señales de estado orientan sin llenar el vacío de controles.

## Lugares y avance

| Orden | Lugar | Verbo |
|---|---|---|
| 1 | Llanura | Pegar |
| 2 | Lago | Encadenar |
| 3 | Bosque | Rodear |
| 4 | Tormenta | Bailar |
| 5 | Vacío | Soltar |
| 6 | Jardín | Sembrar |
| 7 | Dunas | Surfear |
| 8 | Cristales | Resonar |
| 9 | Faros | Guiar |
| 10 | Ruinas | Reconstruir |
| 11 | Cueva | Eco |

El Viaje completa las cinco primeras; Jardín queda como siguiente destino. Completar cada lugar abre el siguiente. Los guardados anteriores conservan puertas ya ganadas o visitadas. Puedes repetir los lugares abiertos; no pierdes estrellas.

| Estrella | Condición |
|---|---|
| ★ Completo | Completar la ronda y su cierre |
| ★★ Ritmo | Al menos75% de pulsos a tiempo, con sonido |
| ★★★ Maestro | Completar Maestro con70% a tiempo; requiere★★ para entrar |

Qué cuenta la ronda (panel 11, Q2): mientras el lugar canta su patrón (desde el inicio hasta el fin de sus dos compases, tal como se oyen) los pulsos no cuentan. En la Cueva cuenta el eco, no la corchea: un paso del patrón en el compás de respuesta es acierto; un paso que no está, o fuera de tiempo en ese compás, es fallo; durante la llamada no cuenta nada. La Cueva juzga con el mismo reloj calibrado que el resto (`heardTime`).

Maestro sube tempo10%, objetivo×1,5 y estrecha la ventana. Las once★ completan la canción;33★ abren su versión maestra. Sin sonido se puede ganar★. Reglas canónicas en `src/places.js`.

## Orientación y retorno

Los portales abiertos son blancos; los completos, del color de su lugar (también en el mapa y en los trofeos del Refugio). El dorado queda para lo ganado: ★ y ✦, con ✦ nunca mayor que ★ (panel 10, P7, D4; panel 11, D10-B). En el acierto, un oro por golpe: el marco del cubo y el «1»; la onda, la marca de la Línea y el arco del acierto son blancos (Q5). Las cifras de lugares, los botones y los avisos van en blanco: «Lugares 5 / 11», la marca de no leído y el botón del Refugio. El botón del Refugio dice «Lugares», sin número; el estante dice «★ N / 33» en blanco. El mapa dice «portales abiertos» y «tu Refugio». «Vista tranquila» oculta Tu cubo, cifras y herramientas; su subtítulo lo dice. En modo daltonismo, `SAFE_COLORS` da un color distinto a cada lugar. Una columna blanca y la brújula junto al cubo indican rumbo y distancia. Con el portal fuera de pantalla, la columna es una luz de 140 px en el borde, a la altura del rumbo. **Seguir hacia** activa una ruta a pie; no teletransporta al acabar la ronda. Con los once completos, objetivo y columna señalan el lugar sin ★★ con mejor porcentaje (después, sin ★★★). Con 33★ vuelve «Explora a tu ritmo». Menú → Lugares abre la lista en filas enteras, con el destino actual bajo la fila anterior, y permite viajar a los lugares habilitados para ello. Si quedan filas arriba, «↑ N más arriba» lo dice. Cada fila lleva nombre, ★ de 12 px o más y su acción («Ir» o «Seguir», del mismo ancho) en la misma línea (panel 11, Q4). Con logros sin leer, la Bitácora abre en Logros; si no, donde se dejó. El dibujo del mapa de la Bitácora llena su caja: mínimo de 16.000 u por lado (unas cuatro regiones) y margen de 24 px; desde alpha.235 es la vista quieta del [Mapa del universo](#mapa-del-universo).

Guardar un lugar conserva semilla/identidad, capa y coordenadas. Tocar el nombre del territorio abre Favoritos en el destino guardado; **Ir a este lugar** vuelve a su dirección compatible. No se promete una instantánea congelada de la música, que sigue evolucionando.

Los saltos pagados, el regreso y la distancia caminada tienen reglas propias; saltar no cuenta como caminar. [Universo](UNIVERSO.md) y `practice-travel.js`.

**Sin «Paseo musical» (Jay, alpha.232, G2).** No hay botón ▷ de paseo en ninguna vista (`#bAuto` y `#favWalk` ocultos, ids conservados); el piloto automático sigue en el código para las pruebas (`startAutopilot`). Su logro «Dejarse llevar» queda retirado. «Viajar automáticamente» en la ruta a un favorito no cambia.

**Saltar a otro lugar (Jay, alpha.226 y alpha.230).** Dentro de un nivel no hay salto: ni en un capítulo del Viaje sin terminar, ni en una ronda de un lugar, ni bajo el final del Viaje. Se ocultan «Otro paisaje», «Volver al punto anterior» y «Viajar a otra tierra», y el código también los rechaza (y las sorpresas que teletransportan). **Desde alpha.230, «Otro paisaje» y «Viajar a otra tierra» solo existen con los once lugares del anillo completos:** antes no están en el dock, en «Más» ni en Tu cubo (tampoco su meta «Ahorrar para un salto») y el código rechaza el salto. El primer salto tras los once es gratis (`S.journey.freeJumpUsed`); los siguientes cuestan 20 ✦. «Volver al punto anterior» sigue gratis y como estaba. Quien ya está en otra semilla conserva el camino de vuelta, y `?dev=1` (o un servidor local) sus herramientas. Lejos del anillo (más allá de donde se oye su siguiente portal, 9600 px), Lugares ofrece **Ir** al siguiente lugar del camino, gratis, junto a su portal: solo a ese, no es un salto libre.

**Volver al anillo (Jay, alpha.230).** Tras el Viaje, Lugares tiene siempre «Volver al anillo», gratis: lleva al centro del anillo, un paso hacia el siguiente portal; nunca a un lugar nuevo ni a otra tierra. Lejos del anillo (más de 7800 px de su centro) es la primera acción de la hoja; dentro, va bajo «Seguir hacia …». Usa el mismo viaje que los demás, así que «Volver al punto anterior» devuelve al sitio de antes. La brújula junto al cubo y la columna de luz apuntan al siguiente lugar. `places-ring.js` (`ringHome`) y `refugio-lugares.js`.

## Ganas de volver

Tanda aprobada por Jay (29 de octubre de 2026, alpha.236, rama `jay/volver`). Nada castiga faltar; nada paga chispas (lo especial no paga ✦: las chispas solo vienen del universo abierto, `universeReward`).

**Racha suave.** Cada día real que juegas (el primer cristal, chispa o hallazgo del día: `onFirstLight`, el contador de días de la decisión 5A) enciende una estrella blanca en el cielo del Refugio. Los días seguidos se unen con un hilo. Si faltas un día, las estrellas se quedan y el hilo viejo sigue dibujado; al volver empieza otro. Ayer todavía cuenta como seguido. Sin número de pérdida ni frase triste: el rótulo dice «N estrellas» y, con dos o más días seguidos, «· N días seguidos». Hitos en la Bitácora (pestaña Mapa › Recuerdos y vínculos › «Cielo del Refugio»): 3, 7, 14, 30, 60, 100 y 365 días seguidos; 10, 30, 100 y 365 estrellas. El día de un hito, el rótulo dice «Hito: …». Detalle visual en [Casa viva](CASA_VIVA.md#cielo-de-días). Fuente: `src/sky-streak.js`; guardado `S.skyStreak` (versión 1). Una partida anterior empieza con todos sus días ya jugados encendidos (`S.totalDays`; los seguidos de `S.streak` en su hilo). Los logros «Racha de 3…365» siguen como estaban.

**Carta del universo.** Al abrir el juego tras cuatro horas o más fuera (o al volver a la pestaña tras ese tiempo), un aviso pequeño dice algo que pasó mientras no estabas: «Mientras no estabas · Una ola gigante pasó por el Lago.». Sale de datos del juego: los encuentros vivos de cada bioma (31; «Tu reflejo» y «Tu eco» quedan fuera porque son tuyos) y las figuras del Mapa del cielo que uniste; primero lo que conoces (encuentros vistos, lugares pisados, figuras), si no, cualquiera del universo. Elegida con `hashKey` del día y del número de cartas; una por apertura. Va por la cola de avisos (`#toast`, nivel 2, 7 s) y se cierra con un toque; no bloquea. Espera al saludo de entrada, a cualquier hoja, al Viaje y la vista tranquila, a una ronda o su tarjeta, a una actividad o un encuentro vivo y a los finales; con «Textos del universo» apagados no sale. Sin humanos. Fuente: `src/universe-letter.js`; guardado `S.universeLetter` (versión 1: la hora vista, cuántas cartas y la última). La primera apertura de una partida no trae carta.

## Mapa del universo

Jay, 29 de octubre de 2026 (alpha.235, rama `jay/mapa-universo`): «el mapa tiene que ser perfecto». Sustituye al recuadro de cuadros marrones de la Bitácora. Código: `universe-map-model.js` (modelo), `universe-map-art.js` (dibujo) y `universe-map.js` (pantalla); `map.js` lo carga.

- **Dónde.** Un botón con un mapa junto al menú (`#bUniverseMap`) en el Mundo libre tras el Viaje, en la superficie, en las dos vistas. No sale en capítulos, rondas, finales, actividades ni en el Refugio. En la Bitácora, Mapa muestra una vista quieta de todo lo descubierto; «Abrir el mapa» (`#mapZoom`) o tocar el dibujo abre la misma pantalla. «Más › Mapa y favoritos» sigue abriendo la Bitácora. No se quitó ningún control: el dock del Mundo tenía solo el menú.
- **Tres acercamientos.** Anillo (los once lugares en su círculo, centrado en el anillo, con nombre, color de completo y sus ★), Región (alrededor de ti, unos 3 km) y Universo (centrado en el origen, todo lo descubierto, nunca menos que el anillo de 5 km). «+» y «−» pasan de uno a otro; pellizcar y la rueda acercan sin saltos, alrededor del dedo o del puntero. Arrastrar desplaza. ◎ centra en ti. El rótulo dice el acercamiento. Lejos, los once lugares se juntan en un anillo pequeño con sus colores.
- **Niebla.** Lo no visitado es negro. Cada región visitada (`S.places`) se pinta con el color de su bioma como un disco suave que se funde con los vecinos: sin cuadros duros. El Abismo, muy tenue. Anillos discontinuos a 5, 20 y 50 km del origen. Arriba, el porcentaje descubierto del primer anillo sin completar: «Hasta 5 km · 8 % descubierto».
- **Un anillo de distancia entero es ganado.** Descubrir todas las regiones de un disco (unas 608 hasta 5 km) lo guarda con su día (`S.universeMap.bands`), lo dibuja en dorado y avisa una vez: «Mapa del universo · Todo hasta 5 km descubierto». No paga chispas: la regla `universeReward` es para lo que aparece o se hace en un sitio; esto es una meta larga y única, y Jay decidió que lo especial no da chispas (decisión 9 del [catálogo](IDEAS_UNIVERSO.md#decisiones-de-jay-28-de-octubre-de-2026)). Tampoco es un logro de la lista, que sí paga chispas.
- **Tú siempre claro.** Tu cubo blanco con una flecha de rumbo. Una línea blanca fina al siguiente lugar con su distancia (`formatDistance`). Abajo a la derecha, la escala.
- **Lo tuyo.** Los once lugares, el centro del anillo, tu Refugio, tus favoritos, los hitos visitados (las balizas son un tipo de hito) y los oídos sin visitar («?», `S.heardLm`), las rarezas, las figuras del Mapa del cielo completas (estrella llena) y a medias (estrella hueca; muy de cerca, la figura con su parte unida) y los encuentros vivos que viste (rombo del color de su bioma, lleno si lo lograste). Leyenda plegada abajo a la izquierda. Si dos iconos se tapan, se dibuja el más importante. Las boyas de luz (idea 59) no existen todavía.
- **Tocar un punto** abre una tarjeta: nombre, qué hay y distancia. **«Ir»** solo donde ya se podía ir: un lugar del anillo que ya pisaste o con ★ (o, desde lejos, el siguiente del camino, gratis), «Volver al anillo» en su centro o en tu Refugio si está allí, y un favorito («Ir a este lugar», si se puede viajar). Usa las mismas funciones que Lugares y Favoritos, así que respeta la regla B: ningún salto libre antes de los once. Todo lo demás, también un punto vacío, ofrece **«Marcar»**.
- **La marca.** Una sola, guardada (`S.universeMap.mark`). Mientras existe, la brújula junto al cubo y la línea bajo el HUD llevan a ella («Tu marca · Orión · 1,2 km»); la columna de luz sigue en el siguiente lugar. Se quita desde su tarjeta («Quitar marca»), se borra sola al llegar (a 30 m, «Llegaste a tu marca») y la quita «Seguir hacia» de Lugares. Marcar no mueve el cubo ni cuesta nada.
- **Cerrar.** ×, Escape o atrás en el teléfono. Escape cierra primero la tarjeta y después el mapa. Nada cambia el juego salvo «Ir» y «Marcar».
- **Mini-mapa** en Ajustes › Ver y sentir, «Mini-mapa en una esquina», **apagado por defecto**: el Mundo ya tiene brújula, columna de luz y la línea del rumbo, y un recuadro fijo añade ruido. Encendido: 90 px abajo a la izquierda, sin tapar HUD, avisos ni dock; se redibuja como mucho dos veces por segundo; tocarlo abre el mapa. Solo en el Mundo libre.
- **Rendimiento.** Nada se dibuja con el mapa cerrado. Abierto, solo redibuja al moverlo. La niebla se cachea en un lienzo pequeño (hasta 8 px por región) y se rehace solo cuando cambian las regiones visitadas. En Chromium sin GPU abre en 24 ms con 600 regiones y 56 ms con 3.000 (5–10 ms las veces siguientes). No medido en teléfono.
- **Guardado.** `S.universeMap`, versión 1 (`normalizeUniverseMap`): la marca, los últimos 120 encuentros vivos vistos (`live`, uno por sitio, se anotan al terminar), los anillos completos (`bands`) y el mini-mapa (`mini`). Un guardado sin él empieza vacío; se conservan campos desconocidos; una versión futura no se toca. No cambia ningún otro formato.

Pruebas: `tests/universe-map.mjs` (modelo: guardado y migración, niebla, anillos y porcentaje, tres acercamientos, toques, qué se puede ir, la marca, cableado), `tests/universe_map_smoke.py` (abrir desde el botón y la Bitácora, tres niveles, rueda, arrastre, centrar, «Ir» a un lugar, a un favorito y «Volver al anillo», el siguiente desde lejos, Escape, nada dibujado cerrado, 390×844 y 1280×800), `tests/universe_map_mark_smoke.py` (figuras, encuentro vivo real, rumor y Refugio en el mapa; «Marcar», brújula, recarga, quitar, llegar, una sola marca; anillo de 5 km ganado; mini-mapa) y `tests/universe_map_english_smoke.py` (inglés a 390×844 y 844×390). No probado en teléfono ni con personas.

## Chispas y colección

Chispas✦ y estrellas★ son distintas. Las chispas compran piezas y viajes; las estrellas nunca se gastan.

**Chispas solo en el universo (Jay, 28 de octubre de 2026; H1, alpha.233).** Las chispas de los niveles no se mezclan con las del mundo abierto.

- **Los niveles dan ★ y Tu canción, nunca ✦.** Un nivel es un capítulo del Viaje, su Camino (también el paseo del día) y una ronda de los once lugares, con Maestro y remezcla, y el final del Viaje. Cerrar una ronda no paga chispas (`LEVEL_SPARKS`, `places.js`), ni la remezcla (`wild.js`). Dentro de un nivel no paga nada más: no se abren actividades ni travesuras, las esculturas suenan sin pagar y las metas de chispas (colecciones, logros) esperan a que salgas. Encuentros vivos y Mapa del cielo ya no aparecían en niveles.
- **Dentro de un nivel el HUD no muestra ✦**, solo ★ de 33 y lugares de 11. La hoja de fin de ronda muestra ★, sus umbrales, el tiempo y el récord, sin chispas. Al volver al Mundo libre, el contador ✦ reaparece con lo que tenías.
- **Las chispas se ganan en el universo abierto:** cristales del Mundo, encuentros vivos, Mapa del cielo, actividades, travesuras, la chispa salvaje, esculturas, colecciones y logros. Se gastan en la tienda del cubo y en saltos.
- **Nadie pierde chispas ni compras.** No cambia ningún formato de guardado y no hay migración: el saldo, lo gastado y lo comprado quedan igual. Quien está a mitad de una ronda al actualizar la termina con sus ★, sin chispas. Las chispas ya ganadas en rondas siguen en el saldo. Un cristal del Mundo a medio recoger conserva sus fragmentos; los que faltan valen 1 cada uno (2 si se rompió a tiempo; ×3 si se guardó con la racha de antes).

Un solo ★ (panel 10, P8, D3-A): ★ y «Estrellas» solo cuentan las de los lugares (`S.lugares.stars`, máximo 33). Las reliquias del Mundo (`S.stars`) se llaman «Reliquias» en la Constelación, la Bitácora y las tarjetas. En la vista completa, el HUD muestra tres cifras: ★ de 33, ✦ y lugares de 11, al mismo tamaño y peso y alineadas a la derecha (panel 11, Q1). Día, distancia, regiones, continentes y récord están en «Tú» de la Bitácora; la meta de chispas, en Tu cubo. Ninguna hoja de primer nivel muestra un contador a cero. Cada aviso nombra como mucho un logro; los demás esperan en la Bitácora.

Chispas del universo (H1, corrección de Jay, alpha.233). **Chispa suelta = 1 ✦**: cada fragmento de un cristal del Mundo vale 1, y romperlo o recogerlo a tiempo, 2 (×2 fijo; hasta alpha.232 la racha de ocho a tiempo daba ×3 y los fragmentos valían 1, 3 o 5 por cristal). Fuera de tempo conserva su valor. **Lo que se persigue vale más, como antes:** el fragmento raro que huye, 1 + 3 ✦; la chispa salvaje, 15 ✦. **Lo que aparece o hay que hacer** (encuentro vivo, figura nueva del [Mapa del cielo](HALLAZGOS_Y_ACTIVIDADES.md#mapa-del-cielo), actividad, travesura) sigue una sola regla, en `src/spark-rules.js` (`universeReward`):

> premio = base × dificultad × distancia × rareza (× 1,5 si lo hizo un pulso a tiempo), redondeado, como mínimo 1.

| Factor | Valores |
|---|---|
| Base | encuentro vivo 5, figura 4, actividad 10, travesura 4 |
| Dificultad | fácil ×1, media ×1,5, difícil ×2: encuentros, medida por bots a pie (90 % o más fácil, 40 % o más media); figuras, por estrellas (hasta 5, 6–7, 8 o más); actividades, por tamaño (laberinto difícil; ciudad, gigante, sombras, torre, destellos y puentes, media); travesuras, la carrera, el gemelo y la despedida, media |
| Distancia al origen | menos de 5 km ×1, hasta 20 km ×1,5, hasta 50 km ×2, más ×3 |
| Rareza | común ×1, rara ×1,5 (figuras solo de noche o desde 20 km), leyenda ×3 (La Mano). Los once biomas salen casi igual de a menudo (5–9 % del mapa cada uno, el Vacío 42–44 %), así que ningún encuentro vivo es más raro que otro |

Sin tope: un encuentro fácil cerca da 5 ✦ (8 a tiempo); uno difícil a más de 50 km, 30 (45); La Mano a más de 50 km, 54 (81). Las figuras y las actividades y travesuras pagan una vez (por figura o por lugar); los encuentros, cada vez. El aviso y el resumen dicen el premio. Hasta alpha.232 eran fijos: encuentro 10/15, figura 10/15, actividad 15, travesura 10; y una ronda daba 80–170 ✦ (Maestro ×2, mitad desde la cuarta del día) y la remezcla 30 ✦ más. [Economía antes y después](HALLAZGOS_Y_ACTIVIDADES.md#chispas-solo-en-el-universo). Fuente: `src/spark-rules.js`.

Las tarjetas guardan el hallazgo, su procedencia y una interpretación musical. Puedes elegir hasta cuatro voces para el jardín sin consumir la propiedad. Libro, filtros, selección y Refugio comparten estado. [Hallazgos](HALLAZGOS_Y_ACTIVIDADES.md) · [Casa](CASA_VIVA.md).

## Tu canción

Cada lugar aporta una capa. ★ da un fragmento,★★ la capa completa y★★★ su variación. Los trofeos permiten recordar su capa. La vista ordinaria explica qué está ganado; las frases personales se escuchan en el final.

Entre ★ y ★★ la capa crece con tu mejor porcentaje a tiempo en ese lugar (D1-B, panel 10, P6). Desde el 55 %, cada 1,25 puntos suma un tiempo de los compases que ★ deja callados: primero el último de cada uno. Al 60 % suena cerca del 62 % de la capa; al 67 %, tres cuartos. Solo sube con rondas con sonido. Los umbrales de las estrellas no cambian. El anillo de Tu canción distingue ★, ★★ y ★★★ por forma (panel 11, Q3): con ★, un arco tan largo como lo que suena de la capa, sin relleno; con ★★, el aro entero y relleno; con ★★★, además un aro exterior fino. El arco se mide en los golpes de la capa: al 60 % la mitad y algo más, al 73,75 % casi entero. Colchón (Vacío) y Eco (Cueva) ya suenan enteros con ★, así que su arco va cerrado. Sin cifra. El color sigue: saturación por estrella; el blanco del Vacío, por brillo. El velo dorado solo sale en el final. Si una ronda hace crecer la capa, la tarjeta lo dice: «Tu capa de Lago creció». Ninguna otra ronda lo muestra; una ★ o una ★★ nuevas no son crecer. La victoria de una ronda suena al nivel ganado: con ★, la mitad de los compases que con ★★.

El final de los cinco capítulos abre el Mundo libre. El final de once lugares reúne entradas, tus frases, una pausa y el tema;33★ ofrece la versión maestra. Ambos conservan la música aprobada. La UI sigue el transporte audible y distingue tu interpretación del acompañamiento.

La ronda que completa los once desemboca sola en el final (D5): la escena se abre antes de que acabe la caída y su primer compás llega con el siguiente «1». Al cerrar el final no sale la tarjeta de esa ronda (panel 11, Q3): sus ★ y su récord quedan en Lugares y sus logros en la Bitácora. Durante tus frases y la primera vuelta del tema solo siguen el colchón (Vacío) y el bajo (Lago); las demás capas vuelven en la segunda vuelta. Tu frase suena con el arpegio suave del final del Viaje. El compás de silencio no lleva rótulo. Los créditos de autoría salen una sola vez, en el final de once; el guardado anota `credited` cuando se muestran. Si el final vuelve a sonar, acaba en «Tu canción está completa». La versión maestra muestra solo sus dos líneas. El final se cierra solo 7 s después de su último compás, como el del Viaje. **Al cerrarse, una hoja sobre negro** (Jay, alpha.232, G3): «Completaste los once lugares», las ★ que quedan (★★ a tiempo, ★★★ Maestro; no sale con las 33), «Ya puedes saltar a otro paisaje» (y «El primer salto es gratis» mientras lo sea) y «El universo es infinito». Un botón blanco, «Explorar», deja en el Mundo con «Otro paisaje» en el dock. Una sola vez por partida (`S.elevenNote`); las partidas que ya tenían los once lo ven una vez al volver al Mundo. Lugares lo guarda: «Completaste los once lugares ›». `eleven-note.js`. Bajo el final de once la radio del Mundo calla desde su primer «1» hasta que se cierra la escena; el Mundo sigue su curso y el final toma su swing (panel 11, Q7, D9-B). Suena en dub techno (Q7, a petición de Jay): las voces propias de los finales (`createDub`), no las de la radio ni las de «Tu canción» desde Lugares. Las capas entran por sus ★ y el filtro de los acordes se abre compás a compás. Bajo tus frases (voz dub) y el silencio hay un respiro. Acaba en una coda escrita (D9-C): los stabs tocan el tema entero y suben. En el «1» del último compás llega el golpe en la tónica (stab sus2, sub, bombo, impacto), y en el último «1» un corte seco, eco y sala incluidos. No depende del nivel de Faros.

Los resultados nombran lugar, colección y ronda; muestran umbrales reales y siguiente paso. La tarjeta espera a que se oiga el fin de la caída de dos compases. Después, la pantalla pasa a negro opaco y la hoja sale encima (Jay, alpha.232, G1): sus ★ (dorado solo lo ganado) y un solo botón blanco, el que sigue: «Seguir hacia …» o, sin siguiente lugar en el camino, «Otra vez». Tocar el negro no la cierra ni mueve el cubo; los avisos esperan. Los capítulos del Viaje no usan esta hoja y la ronda Libre no tiene. No muestra logros: van a la Bitácora, sin aviso. Entre 70 y 74,9 % sin ★★ dice cuánto falta («A 0,4 de ★★») y pone «Otra vez» junto a «Seguir hacia». Durante la ronda, un tic al final de la Línea se enciende en dorado mientras el porcentaje alcanza la estrella siguiente (75 %; 70 % en Maestro). Salir y Escape comprueban el mismo final (la versión maestra llega así). Efectos de UI silenciosos.

## Ayuda

Menú → **Cómo jugar** recupera la regla actual. En Jardín indica aproximación, siembra en el golpe, riego entre golpes, cosecha y árbol dorado. Ver el gesto repite una demostración; la guía no obliga a abandonar una ronda ni a visitar el Refugio.

Las duraciones son objetivos de diseño, no tiempos garantizados de jugadores. El Viaje apunta a15–20min; esfuerzo, comprensión, reconocimiento musical y deseo de seguir requieren personas.

## Herramientas de prueba

| URL | Uso |
|---|---|
| `?capitulo=llanura` | Aísla uno de los cinco capítulos |
| `?lugar=jardin` | Aísla cualquiera de los once lugares |
| `?lugar=jardin&maestro=1` | Ronda Maestro |
| `?anillo=1` | Mundo libre posterior al Viaje |
| `?festival=1` | Viaje completo con guardado separado y reinicio para otra persona |
| `?prueba=1` / `?prueba=ver` | Observaciones locales de prueba |
| `?medir=1` | Medida local de fotogramas |
| `?lang=en` / `?lang=es` | Arranca en ese idioma y lo guarda en la partida ([Traducción](TRADUCCION.md)) |
| `?clasico=1` | Comparación heredada de capítulos, mantenida por compatibilidad |
| `?encuentro=polilla` | Fuerza ese encuentro vivo (cualquiera de los treinta y tres; perseguir: `polilla`, `racimo`, `pez`, `tambor`, `semilla`, `cometa`, `reflejo`, `pulsar`, `llamarada`, `eco`, `estrella`; huir: `remolino`, `enjambre`, `ola`, `derrumbe`, `polen`, `arena`, `rayos`, `ondas`, `llamaradas`, `pozo`, `agujero`; hacer: `motas`, `estrellita`, `burbujas`, `guardian`, `brotes`, `caravana`, `nodos`, `pulsares`, `antena`, `luciernagas`, `constelacion`) tras 3 s de viaje en vez de 60–90 s, una y otra vez. Solo en el Mundo libre, como los demás: no aparece en capítulos, rondas ni finales. Usa la partida normal; combinarlo con `?anillo=1` para un guardado propio ([Encuentros vivos](HALLAZGOS_Y_ACTIVIDADES.md#encuentros-vivos)) |
| `?cielo=orion` | Trae esa figura del [Mapa del cielo](HALLAZGOS_Y_ACTIVIDADES.md#mapa-del-cielo) delante del cubo tras 3 s de viaje (cualquiera de las 28: `orion`, `osamayor`, `osamenor`, `casiopea`, `cisne`, `lira`, `cruzdelsur`, `canmayor`, `aries`, `tauro`, `geminis`, `cancer`, `leo`, `virgo`, `libra`, `escorpio`, `sagitario`, `capricornio`, `acuario`, `piscis`, `gato`, `cubo`, `vinilo`, `auricular`, `ballena`, `cohete`, `guitarra`, `mano`), una y otra vez. Solo en el Mundo libre tras el Viaje: nunca en capítulos, rondas ni finales. Usa la partida normal (lo unido se guarda); combinarlo con `?anillo=1` para un guardado propio |
| `?rapido=1` | Todas las metas de los capítulos y de las rondas a un quinto, para pasar rápido. Guardado propio (`kubono:rapido`) y sin cuenta: sus ★ no cuentan en la partida normal. Con `?capitulo=` o `?lugar=` usa el guardado de esos atajos. Funciona también en la edición de venta |
| `?rapido=2` | Corto de verdad (alpha.230): metas a un veinteavo, el Camino con 2 cristales, cada capítulo en 2–3 pulsos y su portal abierto a 1 s. El Vacío conserva su cielo corto al recargar. El final del Viaje no cambia («Saltar» lo cierra). Un bot lo juega entero, de la primera pantalla al Mundo libre, en unos 70 s (`tests/rapido2_viaje_smoke.py`). Mismo guardado propio |

Usar perfiles temporales; no borrar la partida personal. Atajos no equivalen a completar el recorrido. El producto no requiere`?dev=1` ni expone runtime; las pruebas lo instrumentan al servir main.

[Verificación](VERIFICACION.md) · [aceptación pendiente](PRUEBAS_CON_PERSONAS.md) · [entrega E](ENTREGA_E.md).
