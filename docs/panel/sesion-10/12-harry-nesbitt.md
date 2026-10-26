# 12 · Harry Nesbitt · detalle visual

Simulación de la mirada de diseño de Harry Nesbitt a partir de su obra pública. No es su opinión real.

Versión **2.3.0-alpha.207** (commit `2e7f9d1`). Revisión desde cero, sin memoria de sesiones anteriores.

**Qué revisé:**
- Las 21 capturas de `panel10/capturas/` (teléfono 390×844).
- Las 51 capturas de `panel10/menus/`: teléfono, horizontal 844×390 y escritorio 1280×800, en modo viaje y libre.
- `styles/estilo-j.css`, `styles/interface.css`, `styles/game.css` e `index.html`.
- Código de dibujo: `src/render.js`, `src/canvas.js`, `src/world-sheet.js`, `src/places-ring.js`, `src/journey-pulse.js`, `src/journey-chapters.js`, `src/journey-hint.js`, `src/journey-echo.js`, `src/house.js`, `src/house-capsules.js` y `src/refugio-lugares.js`.

**Límites:** no abrí navegador. No vi ninguna animación en movimiento: todo lo que digo de movimiento sale del código. No oí el audio. No he jugado con las manos.

## Contexto

Kubono es un punto blanco de 10 px que respira en un vacío negro. Alrededor, cada lugar dibuja su paisaje con trazos finos, glifos y luz radial. La interfaz es de terminal: Geist Mono, líneas de 1 px, esquinas rectas y un solo acento dorado. Visto por primera vez, el mundo tiene más carácter que los menús. Los paisajes son contenidos y propios. Las hojas se sienten como formularios funcionales que nadie ha alineado al píxel.

## Notas

| Eje | Nota | Por qué |
|---|---|---|
| Visual | 7 | Cada lugar tiene un motivo propio y legible: anillos en Lago, rejilla en Cristales, haz en Faros. El negro aguanta. |
| Audio | 6,5 | No lo oí. Por el código, el pulso, el «1» de la Línea y los portales suenan en compás. La nota solo dice que el código es coherente. |
| Creatividad | 7,5 | Una partitura dibujada a ras de pantalla y un anillo de portales que suena son ideas con autoría. |
| Sensación | 6 | No la puedo medir sin manos. El dedo fantasma y la Línea casi transparente (α 0,16) parecen tímidos en estático. |
| Cohesión | 6 | El mundo y las hojas usan lenguajes distintos. El rojo, el cian y el azul de algunos elementos rompen la regla blanco y dorado. |
| Pulido | 5,5 | Hay cortes de palabra, filas recortadas, botones de alturas distintas en la misma fila y textos que se pisan en el Refugio horizontal. |
| **Media** | **6,4** | |

**Detalle visual: 5,5 / 10**

| Desglose | Nota | Comentario |
|---|---|---|
| Alineación y retícula | 5 | Los huecos de rejilla aparecen cuando un botón se oculta: «Ajustes» queda huérfano y falta la tercera baldosa. |
| Tipografía | 5,5 | Hay ocho tamaños (11–26 px). Los `select` a 16 px pesan más que los títulos de sección. «diagnóstic/o» se corta. |
| Iconos | 6 | El trazo es uniforme (1,5). «Volver al salto» no tiene icono y descuadra la columna. Los triángulos ▶ conviven con «+». |
| Bordes, esquinas y estados | 5,5 | Las casillas son nativas y redondeadas. Lo seleccionado se marca de cuatro maneras distintas. |
| Contraste y jerarquía de brillos | 6 | En el juego es bueno. En los menús, el avatar blanco de 28 px brilla más que la acción principal. El dorado marca instrucciones, no solo lo ganado. |
| Recortes y bordes de pantalla | 5 | Hay columnas y rótulos cortados en el borde. Las listas se abren a mitad de fila. El pie del menú se corta en escritorio. |
| Coherencia entre formatos | 5,5 | El teléfono está cuidado. Horizontal y escritorio parecen adaptaciones sin revisar, sobre todo el Refugio. |

## Lo que funciona

- **Cubo pequeño con marco de 1 px.** `src/render.js:127` dibuja un marco a 3,5 px y α 0,55. El cubo se lee sobre cualquier fondo sin crecer: se ve en `01`–`15`. `src/render.js:186-188` lo limita a 12 px. Es la decisión correcta.
- **Un motivo por lugar.** Los anillos concéntricos de Lago (`02`), la rejilla triangular de Cristales (`12`), las estrías diagonales de Dunas (`11`) y el haz cálido de Faros (`13`) bastan para reconocer el lugar en un vistazo sin rótulos.
- **Luz radial del bioma.** `src/world-sheet.js:27` centra el degradado en el cubo, sin horizonte. Da profundidad sin ensuciar. En Jardín (`20-anillo`) el verde es justo.
- **Un dorado sobrio.** `#f0d27a` es cálido sin ser amarillo. En `33-resultado` la estrella ganada junto a dos grises es la imagen más clara de la app.
- **Botón principal invertido.** El blanco sobre negro de «Seguir hacia Jardín» (`30-menu`, `estilo-j.css:619`) es la única masa blanca de la hoja. Se sabe adónde ir.
- **Iconos de línea coherentes.** Todos usan trazo 1,5 en un `viewBox` de 24 (`estilo-j.css:63`, `index.html:157`). Lugares, Mapa, Herramientas y Grabar parecen de la misma familia.
- **Línea de pulso.** `src/journey-pulse.js:116-127` mantiene el compás a ras de pantalla, al 80 % del alto. La anticipación que hace crecer el paso es una idea de diseño sólida.
- **Refugio en escritorio** (`esc-viaje-refugio`). Las esquinas de visor, las cápsulas punteadas y los rótulos espaciados dan una estética de plano técnico propia.

## Lista de detalles a corregir

| # | Captura | Qué se ve mal exactamente | Dónde se arregla | Prioridad |
|---|---|---|---|---|
| 1 | `hor-libre-refugio`, `hor-viaje-refugio` | En horizontal, el Refugio se comprime en x 25–255. «ECO» queda bajo «Refugio · 0 sonando». «PRISMA» cruza la línea del suelo. «RAÍZ · 14 DÍAS» toca el marco. La burbuja «Tu Refugio via» tapa «JARDÍN DE VOCES». | Escala de cámara del Refugio en `src/house.js:80` y `src/house-view.js`. En horizontal, reservar la franja del panel (`estilo-j.css:203`) antes de encajar la casa. | alta |
| 2 | `tel-viaje-ajustes`, `esc-viaje-ajustes` | «Copiar diagnóstico» se parte en «diagnóstic / o». «v2.3.0-alpha.207» se parte en el guion. | `estilo-j.css:424`: `.sheet button{overflow-wrap:anywhere}`. Usar `overflow-wrap:break-word` y `hyphens:auto` con `lang="es"`. Dar 2 columnas a `.settings-diagnostic`. | alta |
| 3 | `21-lugares`, `tel-libre-lugares`, `hor-libre-lugares`, `esc-libre-lugares` | La lista se abre con la fila anterior cortada: un botón «--» o «Ir» aparece bajo la cabecera, sin su nombre. | `src/refugio-lugares.js:64`: el desplazamiento resta `clientHeight*.25`. Alinear con el borde superior de la fila anterior (`li.offsetTop` de `previousElementSibling`) o usar `scroll-snap-align:start` en `.lugares-list li` (`estilo-j.css:595`). | alta |
| 4 | `20-anillo`, `23-salvaje`, `tel-libre-grabar` | Una franja dorada de 18 px y toda la altura queda pegada al borde derecho (x≈370–388). Se lee como un fallo de pintura, no como una columna de luz. | `src/places-ring.js`: en `edgeColumn` el margen es 12, y `col(e.x,H,0,…)` pinta de arriba abajo. Con el portal fuera de pantalla, pintar solo 120–160 px a la altura del rumbo y con un degradado lateral. | alta |
| 5 | `30-menu`, `tel-viaje-menu`, `esc-viaje-menu`, `esc-viaje-menu-mas` | En modo viaje, «Cómo jugar» ocupa toda la fila centrado (x≈190) y «Ajustes» cae sola en la columna izquierda (x≈110). Parece un error de maquetación. | `estilo-j.css:659`: `#bGuide{grid-column:1/-1}`, con Bitácora (`free-only`) oculta. Hacer que `.menu-utilities` use `display:flex;justify-content:center;gap:24px`, o que el último hijo visible ocupe `1/-1`. | alta |
| 6 | `30-menu`, `tel-viaje-menu`, `hor-viaje-menu`, `esc-viaje-menu` | Las baldosas principales usan 3 columnas, pero en viaje solo hay dos (Explorar y Refugio). Queda un hueco de 1/3 a la derecha. | `estilo-j.css:619`: `.menu-group.primary .tiles{grid-template-columns:repeat(3,…)}`. Usar `repeat(auto-fit,minmax(0,1fr))` o pasar a 2 columnas cuando `#bCubeTile` esté oculto. | media |
| 7 | `tel-viaje-menu-mas`, `esc-viaje-menu-mas`, `tel-viaje-bitacora` | El rótulo «Explorar» aparece sin ninguna fila debajo: sus botones son `free-only`. Queda un rótulo huérfano a 34 px de «Crear». | `index.html:157`: ocultar el `<p class="menu-section-label">` si su grupo no tiene botones visibles, por ejemplo con `:has()` o desde `src/ui.js`. | media |
| 8 | `tel-libre-menu`, `esc-libre-menu`, `tel-viaje-menu-mas` | «Volver al salto» no tiene icono. Su texto empieza en x=33 y los demás en x=61, así que la columna de texto se rompe. | `index.html:164`: añadir un `<svg>` (por ejemplo una flecha de retorno) a `#bJumpBack`, como en `#bStartOver`. | media |
| 9 | `tel-viaje-guia`, `tel-libre-guia`, `31-guia-jardin` | En la fila de acciones, «Escuchar y responder» va en dos líneas (53 px) y «Seguir hacia Jardín» o «Practicar» en una (44 px). Los bordes superiores quedan a 657 y 662. Luego «Practicar» queda sola en media fila. | `estilo-j.css:309`: añadir `.guide-sheet>.row{align-items:stretch}` y `button{min-height:52px}`. Acortar el texto («Escuchar») o poner 3 columnas. | media |
| 10 | `33-resultado`, `21-lugares`, `esc-libre-lugares` | «Seguir hacia Jardín» ocupa dos líneas (60 px) junto a «Otra vez» o «Cerrar» (44 px). En la misma fila hay botones de alturas distintas y bases desalineadas. | Igualar la fila con `align-items:stretch` en `.row` de esas hojas. Mejor: el primario en su propia fila a todo el ancho (`grid-column:1/-1`). | media |
| 11 | `tel-libre-ajustes`, `esc-libre-ajustes`, `tel-viaje-ajustes` | Las casillas de Vibración, Daltonismo y Textos son nativas: esquinas redondeadas, relleno blanco y check negro de sistema. Rompen «esquinas rectas». | Las casillas no están en la regla de esquinas cuadradas (`estilo-j.css:11-13`). Añadir `input[type=checkbox]{appearance:none;width:20px;height:20px;border:1px solid var(--line)}` y `:checked` con un cuadrado blanco interior de 10 px. Hoy solo hay `accent-color` en `estilo-j.css:450`. | media |
| 12 | `tel-libre-ajustes`, `hor-libre-ajustes`, `32-libro` | Los `select` muestran la flecha nativa (⌄) y su texto va a 16 px. «Paisaje y descanso» pesa más que «Ajustar el tiempo», que es título. | `estilo-j.css:422` y `:324` fuerzan 16 px para evitar el zoom de iOS. Mantener 16 px en el control, pero con `appearance:none`, un chevron SVG de trazo 1,5 y `font-weight:300`/color `--dim`. Subir los títulos de sección a 14 px. | media |
| 13 | `tel-libre-mapa`, `34-favoritos` | La misma Bitácora › Mapa tiene dos estilos de cifras. Uno es «REGIONES / CONTINENTES / RÉCORD», en mayúsculas y con divisores verticales. Otro es «Regiones / Guardados / Instrumentos», en minúscula y sin divisores. | Unificar `.journal-summary` (`estilo-j.css:209`) con el bloque del atlas (`src/atlas.js`). Una sola regla: etiqueta en minúscula, 11 px, `--dim`, sin divisores. | media |
| 14 | `tel-libre-mapa` | La línea «0 favoritos (◇) · … · 0 rarezas (✱) ·» termina en un « ·» colgante. Además queda pegada al botón Cerrar (8 px). | Quitar el separador final al unir el texto en `src/atlas.js`, o usar `join(' · ')`. Dar un margen inferior de 16 px antes de `.row`. | baja |
| 15 | `22-cancion` | «Otra vez» aparece con doble marco: el anillo de foco de 2 px a 3 px se ve sin que nadie haya usado el teclado. Parece seleccionado y compite con «Cerrar». | `estilo-j.css:20`. El foco programático al abrir la hoja dispara `:focus-visible`. Enfocar el `h2` (`tabindex=-1`) o el contenedor en lugar del botón. | media |
| 16 | `22-cancion` | La rueda de lugares ocupa y 210–540. Debajo quedan 240 px vacíos hasta los botones. Los rótulos de la derecha («Tormenta», «Vacío») van centrados bajo el disco, y los de la izquierda también, así que la rueda pierde simetría óptica. | Centrar la rueda en el alto libre (`flex:1;display:grid;place-items:center`). Rótulos radiales: a la izquierda alineados a la derecha y a la derecha alineados a la izquierda. | baja |
| 17 | `tel-libre-tu-cubo`, `esc-libre-tu-cubo` | Lo seleccionado se marca de cuatro maneras. Las pestañas de Tu cubo usan relleno gris. Las de Bitácora, un borde blanco sin relleno. Las muestras, un `outline` de 1 px a 2 px. El foco, 2 px a 3 px. | Un solo estado activo: borde blanco de 1 px + `background:#ffffff14`. Revisar `estilo-j.css:23`, `:172` y `:189`. | media |
| 18 | `tel-libre-tu-cubo`, `esc-libre-tu-cubo` | Las muestras bloqueadas llevan un borde de 5 px `#09090b` (casi negro sobre negro) y un cuadradito de 6 px dentro. Parecen casillas vacías, no «bloqueado». La muestra celeste lleva un borde verde agua que no está en la paleta. | `game.css:260` (`border:5px solid #09090b`) y `estilo-j.css:172`. Para lo bloqueado: borde punteado `--line` sin icono interior. Para lo ganado: borde dorado 66 %, como dice la propia regla `[data-earned]`. | baja |
| 19 | `tel-libre-tu-cubo`, `hor-libre-tu-cubo` | En la vista previa, el cubo lleva un círculo de 1 px alrededor, que no existe en el juego. En horizontal, la vista previa ocupa 96 px y deja solo la cabecera de «CUERPO Y CARA» visible. | `estilo-j.css:471` (`height:96px`). Quitar el círculo y usar el marco cuadrado de `render.js:127`. En `max-height:500px`, bajar la vista previa a 56 px. | baja |
| 20 | `tel-libre-refugio`, `esc-libre-refugio` | La burbuja de la Voz («Tu Refugio viaja contigo…») cae en y≈64. Tapa la línea «Refugio · 0 sonando · … Coloca. Escucha.» y queda pegada a la regla de la cabecera. | `game.css:273` / `interface.css:120` (`body.world-focus .voice{top:…}`). En el Refugio, bajarla por debajo de y=120 (`body.house .voice{top:calc(var(--safe-top)+128px)}`). | media |
| 21 | `esc-libre-refugio`, `esc-viaje-refugio` | «JARDÍN DE VOCES · 3 DÍAS O 8 …» se corta en el borde derecho, en x=1274. | `src/house.js:80`: el rótulo se dibuja en `b.x+26` sin medir. Medir con `measureText` y, si no cabe, alinear a la derecha con `textAlign='right'` dentro de `W-16`. | media |
| 22 | `esc-viaje-refugio`, `tel-libre-refugio` | En el Refugio, el cubo es un bloque blanco plano de 48 px, el elemento más brillante de la pantalla. Contradice la decisión «el cubo es pequeño» y la jerarquía del resto de la app. | Escala del jugador en `src/house-view.js`. Mantener el tamaño en relación con el mundo (≤12 px más el marco), como en `render.js:188`. | media |
| 23 | `tel-libre-refugio`, `esc-libre-refugio` | El dorado se usa para instrucciones: «TALLER · TOCA EL DISCO» y la etiqueta «5/11 lugares». La regla dice que el dorado es para lo ganado. | `src/house-capsules.js:113`: `fillStyle=on?'#f0d27a'`. Pasar el estado «cerca» a blanco (`#fff`) y dejar el dorado para lo conseguido. | media |
| 24 | `15-lugar-cueva` | La llama y los cuadros del eco son rojo `#ff4f3a`, fuera de la paleta. Los cuadros del patrón alternan 8 y 6 px y no comparten línea base. | `src/journey-echo.js:55` (`red='#ff4f3a'`) y `:64` (`z=i%2===0?8:6`). Usar blanco para el eco propio y dorado para el acierto. Tamaño fijo de 7 px, centrado en una sola línea. | media |
| 25 | `tel-libre-grabar` | La píldora de grabación es roja (`#ff6b6b`, fondo `#100809`). Es el único rojo de la interfaz. | `game.css:232` / `interface.css:150`. Usar un borde blanco con un punto que parpadee en blanco. Un rojo solo si Jay lo aprueba como color de estado. | baja |
| 26 | `32-libro` | La carta muestra «LABORATORIO» en cian y el código «#FAB6989B». Es una etiqueta de pruebas que se ve en la Bitácora del jugador, en un color fuera de la paleta. | `src/rare-cards.js:81` (`card.forced?'Laboratorio':tier.name`). No mostrar `forced` fuera del laboratorio. El color de rango sale de `--rare-ink`. | media |
| 27 | `01`–`15`, `20-anillo` | La Línea de pulso va a α 0,16, con marcas de 1 px. En Dunas (`11`) y Lago (`02`) se confunde con las estrías y los anillos del fondo. El «1», que el comentario dice que va en dorado, se pinta en blanco. | `src/journey-pulse.js:117` (`globalAlpha=.16`) y `:123` (`fillStyle='#fff'` también para `one`). Subir la línea a α 0,28 con un fondo `#000` de 6 px detrás. Pintar el «1» en `GOLD` cuando cuenta. | media |
| 28 | `01`–`15` | Los cinco puntos de capítulo miden 3×3 px con 9 px de separación. A 390 px casi no se ven y quedan a 9 px de la Línea, como si fueran ruido. Siguen visibles en los lugares del Mundo libre (`10`–`15`), donde no aportan. | `src/journey-chapters.js:165-166`. Puntos de 4 px separados 10 px, a 14 px de la Línea, y ocultos fuera de los capítulos. | baja |
| 29 | `00`–`15`, `20` | El dedo fantasma es un disco gris plano de 26 px a α 0,32. En estático parece un botón muerto o un planeta más (en Jardín se confunde con las esporas). | `src/journey-hint.js:21` (`fillStyle='#ffffff'`, `arc(...,13)`). Dibujarlo como anillo de 1 px con un punto central de 3 px. Así se distingue del mundo. | baja |
| 30 | `hor-libre-menu`, `hor-libre-menu-mas` | En horizontal, el texto «Más –» se ve encima de la cabecera fija (y≈10). La fila de Lugares se corta bajo el borde de la cabecera. | La cabecera `.menu-heading` es fija, pero la hoja tiene relleno superior. Añadir `top:0;margin-top:-16px;padding-top:16px` o `scroll-padding-top` en `.menu-sheet` (`estilo-j.css:619`). | media |
| 31 | `esc-libre-menu`, `esc-libre-menu-mas` | En escritorio (800 px de alto), la fila «Bitácora · Ajustes» se corta en el borde inferior de la hoja (y=785) sin indicar que hay más. | Dar a `.menu-sheet` `max-height:calc(100dvh - 32px)` con un degradado inferior de 24 px o una sombra. O bien, a partir de 1000 px de ancho, el menú «Más» en dos columnas reales con la cabecera más baja. | media |
| 32 | `tel-libre-menu`, `esc-libre-menu` | La fila «Vista completa» enfocada muestra un fondo gris y una línea blanca solo abajo. Parece subrayado, no un foco. | `estilo-j.css:500` (`:focus-visible{background:#ffffff0d}`) combinado con `border-bottom`. Usar el mismo `outline` de 2 px que el resto (`estilo-j.css:20`) o un borde izquierdo de 2 px. | baja |
| 33 | `30-menu`, `tel-libre-menu`, `esc-libre-menu` | El avatar del menú es un cuadrado blanco macizo de 28 px con doble anillo. Es lo más brillante de la hoja y compite con el botón primario. | `estilo-j.css:493` (`#menuAvatar{width:28px;background:#fff}`). Bajarlo a 12 px dentro del mismo marco de 36 px, igual que el cubo del juego. | baja |
| 34 | `tel-libre-lugares`, `esc-libre-lugares` | Las estrellas de cada fila miden ≈6 px. La estrella ganada de Vacío se distingue de las grises casi solo por el tono. Además, «Ir» (44 px) y «Seguir» (64 px) tienen anchos distintos en la misma columna. | `estilo-j.css:597-599` y `:624`. Estrellas a 13 px con `letter-spacing:2px`. Botón de ancho fijo de 72 px en `.lugares-list button`. | media |
| 35 | `tel-libre-lugares` | «Remezcla de hoy: Llanura en «1 · 2y · 3 · 4».» parte la cita en dos líneas y deja «4».» solo. | `src/refugio-lugares.js:63`. Envolver el nombre de la remezcla en `<span style="white-space:nowrap">`. | baja |
| 36 | `32-libro`, `31-guia-jardin`, `34-favoritos`, `30-menu` | Hay tres signos para desplegar: «▶ Filtrar hallazgos», «+ Recuerdos y vínculos» y «Más +» (con el signo detrás). | `estilo-j.css:96` y `:209`. Usar un solo signo: «+» / «−» a la izquierda, en `--dim`, en todos los `summary`. | baja |
| 37 | `tel-libre-ajustes`, `esc-libre-ajustes` | El hint «Se guarda una copia» va en blanco y a 11 px. Los demás subtítulos de fila («Cambiar a tranquila», «Siguiente: Jardín.») van en `--dim`. | Aplicar `.tiles button small{color:var(--dim)}` también en `#mSettings .tiles` (`estilo-j.css:532`). | baja |
| 38 | `11-lugar-dunas` | Un círculo punteado del fondo cruza la barra superior (y=85) y queda medio encima de ella. La barra no tiene zona protegida. | Darle a `.bar` (`game.css:22`) un fondo negro de 8 px (`box-shadow:0 0 0 4px #000`) o hacer que el mundo no dibuje motivos por encima de y=96. | baja |

## Recomendaciones de conjunto

1. **Una retícula que no se rompa al ocultar botones.** El modo viaje oculta botones y deja huecos (#5, #6, #7). Toda rejilla de botones debe reajustarse sola.
   Bien cuando: en `tel-viaje-menu` y `esc-viaje-menu` no hay ninguna celda vacía, ningún rótulo sin filas y ningún botón fuera de su columna.

2. **Un solo vocabulario de estado.** Activo, foco, bloqueado, ganado y desactivado deben tener una regla cada uno, documentada en `estilo-j.css` (#11, #15, #17, #18, #32).
   Bien cuando: un `grep` de `aria-pressed`, `:focus-visible`, `.selected` y `outline` en los CSS da como máximo cinco reglas de estado. Además, ninguna casilla, `select` ni muestra usa apariencia nativa.

3. **Paleta cerrada en el mundo y en la interfaz.** Blanco para estados y dorado solo para lo ganado. El rojo de la Cueva y de la grabación, el cian de «Laboratorio» y el dorado de las instrucciones del Refugio deben pasar por Jay (#23–#26).
   Bien cuando: buscar `#ff` (rojos), cian y `#f0d27a` en el código solo devuelve usos ligados a algo conseguido o a un color de bioma aprobado.

4. **Revisar horizontal y escritorio como formatos propios, no como estiramientos.** El Refugio horizontal (#1), los cortes del pie en escritorio (#31) y la cabecera transparente (#30) son los fallos más visibles.
   Bien cuando: en las 24 capturas `hor-*` y `esc-*` ningún texto se pisa con otro, ninguno se corta en el borde y cada hoja muestra su última acción o una señal de que hay más.

5. **Botones con altura fija por fila y cortes de palabra correctos.** Esto resuelve #2, #9, #10 y #35.
   Bien cuando: en todas las hojas, los botones de una misma fila miden lo mismo (±1 px). Además, ninguna palabra se parte sin guion y ninguna cita queda partida con su signo de cierre solo en una línea.

## Opinión en una frase

El mundo de Kubono ya tiene la calma y la autoría de un buen paisaje minimalista, pero las hojas todavía no tienen esa precisión: falta una pasada de retícula, estados y cortes para que cada píxel parezca decidido.
