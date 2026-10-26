# 12 · Harry Nesbitt — sesión 11
> Simulación de su mirada de diseño a partir de su obra pública. No es su opinión real. Revisó alpha.215 (`5464612`): las 21 capturas de `capturas/` y las 52 de `menus/` a tamaño real, `styles/estilo-j.css`, el texto dibujado en canvas y medidas en Node puro sobre los PNG.

## Notas (puntuación ciega)
| Eje | Nota | Evidencia y alcance |
|---|---|---|
| Visual | 7 | Cada lugar tiene un dibujo propio y legible en línea fina. La interfaz encima tiene cortes y solapes medibles. |
| Audio | — | No oí nada. Me abstengo. |
| Creatividad | 7,5 | Once verbos dibujados con el mismo trazo. Tu canción como anillo de capas es una idea clara. |
| Sensación | — | Sin manos ni movimiento, solo fotos fijas. Me abstengo. |
| Cohesión | 6 | El dorado se usa para cifras que no son ★. Tres grises distintos para «aún no». |
| Pulido | 5,5 | Solapes en el Refugio, mapa al 9 % de su caja, HUD desalineado, menús cortados en horizontal. |
| **Detalle visual** | 5,5 | Muchos defectos de 2 a 8 px. Cada uno es pequeño; juntos se notan. |

Medidas con un decodificador PNG en Node puro, sobre las capturas de 390×844, 844×390 y 1280×800. No vi movimiento ni oí el audio.

## Lo que funciona hoy
- **El mundo.** Cada lugar se reconoce sin rótulo: rejilla en Cristales (`12`), haz cálido en Faros (`13`), columnas en Ruinas (`14`). El trazo fino es el mismo en todos.
- **La Línea.** Mide 47–342 px, centrada (48 px a cada lado). Las marcas de capítulo de 4 px acaban justo en su extremo (`src/journey-chapters.js:171`). El «1» va en dorado (`src/journey-pulse.js:138`).
- **El cubo sigue pequeño.** El dedo fantasma es ahora un anillo de 1 px junto a él (`00-inicio`). No compite.
- **Estados más unidos.** Las pestañas de Bitácora y de Tu cubo usan el mismo activo: relleno gris y borde blanco (`32-libro`, `tel-libre-tu-cubo`). Las casillas de Ajustes son cuadradas.
- **El menú del teléfono.** Cuatro baldosas iguales, sin huecos, en viaje y en libre. El avatar ya es pequeño.
- **Tu canción.** Los anillos ganados se distinguen por color y saturación. Los rótulos no se pisan: Cristales y Dunas quedan a 36 px.

## Lo que falta o salió mal
1. **Refugio: textos que se pisan.** Gravedad alta. En `tel-libre-refugio` la caja de la Voz llega a y = 174. El rótulo «CIELO» empieza en y = 171: se tapan 3 px. «PRISMA» (y 490–500) cruza la línea del marco (y 495–502). En horizontal la Voz se corta en «Tu Refugio v» y «RAÍZ» queda a 6 px del borde inferior.
2. **El dorado marca cifras que no son ★.** Gravedad alta. `styles/estilo-j.css:599` pinta «5 / 11» de Lugares en dorado. `estilo-j.css:597` hace lo mismo con «5/11 lugares» en el Refugio. La regla de Jay (D4) dice dorado solo para ★. En el HUD, en cambio, los lugares van en gris. La misma cifra tiene dos colores.
3. **El mapa usa el 9 % de su caja.** Gravedad media. En `tel-libre-mapa` el dibujo ocupa 97×98 px de una caja de 316×316. `src/map.js:26` fija un mínimo de 12 regiones de lado. Con pocas regiones, el mapa es un punto en un cuadro vacío.
4. **HUD desalineado a la derecha.** Gravedad media. «★ 5/33» y «5/11 lugares» acaban en x = 372. «✦ 0 chispas» acaba en x = 364. La causa es `estilo-j.css:384`: `gap:8px` con `#sparkGain` vacío deja 8 px de hueco al final. Además, las tres cifras de D3 van a tres tamaños: 11 px, 14 px en negrita y 11 px. Las chispas pesan más que las ★.
5. **El aviso de Bitácora mueve su baldosa.** Gravedad media. El punto de no leído (`estilo-j.css:467`) no cabe junto a la palabra y salta de línea. En `hor-libre-menu` el rótulo «Bitácora» sube 5 px (y 175 frente a 180). En teléfono sube 1 px. Además, el aviso es dorado y no es una ★.
6. **Lugares esconde las filas de arriba.** Gravedad media. La lista abre en filas enteras (bien), pero empieza en Vacío. Llanura, Lago, Bosque y Tormenta quedan arriba sin señal. Solo existe el aviso hacia abajo (`index.html:141`, `#lugaresScrollHint`).
7. **Lugares: estrellas de 6 px y botones de dos anchos.** Gravedad media. Las tres ★ de Vacío miden 20×6 px en total (`21-lugares`). «Ir» mide 44 px y «Seguir» 64 px en la misma columna. La fila de Vacío no tiene subtítulo y su botón flota en una segunda línea vacía (`estilo-j.css:630`).
8. **Horizontal: lo nuevo queda bajo el borde.** Gravedad media. En `hor-libre-menu-mas`, al abrir «Más» solo se ve «Ir» y medio «Mapa y favoritos». En `hor-libre-lugares` el botón principal no se ve. En `hor-libre-tu-cubo` la hoja tapa «✦ 0 chispas» y deja «ispas».
9. **Viñetas fuera de su columna en la guía.** Gravedad baja. En `31-guia-jardin` el borde de la tarjeta está en x = 29 y el «1.» empieza en x = 31. El título «Jardín» empieza en x = 44. Lo causa `#guidePlaceSteps{padding-left:20px}` (`estilo-j.css:639`).
10. **Sobran estilos sueltos.** Gravedad baja. Hay once tamaños de letra (11–34 px) y dos dorados (`#f0d27a`, `#e9ca7d`). El texto «aún no» usa tres grises: `#8a8a8f` en el anillo (`src/places-ring.js:77`), `#a0a0a0` en Tu canción (`src/song-stage.js:43`) y `#ffffff99` en las hojas. Los `select` siguen con flecha nativa y letra de 16 px. «Automática» pesa más que el título «Calidad gráfica».
11. **Menú de escritorio con huecos.** Gravedad baja. En `esc-libre-menu-mas` las dos columnas dejan celdas vacías. «Volver al Camino» no tiene chevron y las demás filas sí.
12. **Restos menores.** Gravedad baja. Hay tres signos para desplegar: «▶», «+» y «Más +». En Dunas un círculo punteado cruza la barra superior (`11`). Tu cubo muestra un círculo alrededor del cubo y casillas bloqueadas con borde grueso. El marco de las hojas está a 12 px del borde y el HUD a 16 px.

## Contraste con la sesión 10
Notas de la sesión 10: Visual 7, Creatividad 7,5, Cohesión 6, Pulido 5,5 y Detalle 5,5. Hoy son casi iguales; ahora me abstengo en Audio y Sensación.

**Cerrado (comprobado en captura o código):**
- Huecos de la retícula del menú, rótulos huérfanos y avatar grande (#5–#8, #33).
- Filas de botones de la misma altura (#9, #10).
- Casillas cuadradas y un solo estado activo en las pestañas (#11, #17).
- «Laboratorio» oculto; cita de la remezcla entera; Lugares abre en filas enteras (#26, #35, #3).
- Rojo de grabación y del eco de la Cueva fuera; Taller en blanco (#24, #25, parte de #23).
- La Línea es más visible, el «1» va en dorado y las marcas de capítulo miden 4 px (#27, #28). El dedo fantasma es un anillo (#29).
- La columna del borde ya no pinta toda la altura (#4). El pie del menú de escritorio se funde (#31). El rótulo «JARDÍN DE VOCES» cabe (#21).

**Abierto:**
- Refugio en horizontal: mejor encaje, pero la Voz y PRISMA siguen pisando (#1, #20).
- Estrellas de 6 px y botones de dos anchos en Lugares (#34).
- `select` nativos (#12), Tu canción con 240 px vacíos (#16), muestras bloqueadas y círculo de la vista previa (#18, #19).
- El cubo del Refugio sigue siendo un bloque blanco de 19 px en teléfono y 48 px en escritorio (#22).
- Tres signos de despliegue (#36). El círculo de Dunas sobre la barra (#38).

**Empeoró o es nuevo:**
- Lugares en dorado en la hoja y en el Refugio, en contra de D4 (hallazgo 2).
- HUD de tres cifras con tres tamaños y 8 px de desfase (hallazgo 4).
- Punto dorado de Bitácora que rompe la fila (hallazgo 5).
- El mapa reducido a un punto (hallazgo 3) y la Voz del Refugio sobre «CIELO» (hallazgo 1).

## Qué haría ahora
1. **El dorado solo para ★.** En `estilo-j.css:597`, `:599` y `:467`, los lugares y el aviso de no leído pasan a blanco o a `--dim`.
   Bien cuando: en las 52 capturas de `menus/`, ningún píxel dorado (R > 200, B < 150) cae fuera de una ★ o de una ✦.
2. **Un HUD con un ritmo.** En `estilo-j.css:384`, quitar el `gap` cuando `#sparkGain` está vacío. Las tres cifras van al mismo tamaño y peso.
   Bien cuando: las tres filas del HUD acaban en la misma x (±1 px) y tienen la misma altura de letra (±1 px).
3. **Refugio sin solapes.** La Voz se coloca bajo el último rótulo de sala (`src/house.js:60`). «PRISMA» va encima de la línea del suelo (`src/house-view.js`).
   Bien cuando: en `tel-`, `hor-` y `esc-*-refugio` ninguna caja de texto se cruza con otra ni con una línea del marco.
4. **Un mapa que llena su caja.** En `src/map.js:26`, el mínimo de 12 regiones baja a 3–4, con un margen fijo de 24 px.
   Bien cuando: en `tel-libre-mapa` el dibujo ocupa al menos el 40 % del lado de la caja.
5. **Lugares legible en una columna.** Estrellas a 12–13 px en `estilo-j.css:603`. Botón de ancho fijo (72 px) en `:630`. Un aviso «↑» cuando hay filas arriba.
   Bien cuando: en `21-lugares` cada ★ mide ≥ 10 px, «Ir» y «Seguir» miden lo mismo y se ve que hay lugares encima de Vacío.
