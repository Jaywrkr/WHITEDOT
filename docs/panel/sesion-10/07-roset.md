# 07 · Conrad Roset (simulado)

Simulación de la mirada de diseño de Conrad Roset a partir de su obra pública. No es su opinión real.

**Versión:** 2.3.0-alpha.207 (`2e7f9d1`).

**Qué revisé:**
- Código: `src/world-sheet.js`, `src/render.js` (orden de capas 60–140), `src/color-safe.js`, `src/song-stage.js`, `src/places-ring.js`, `src/distant-colors.js`, `src/journey-mode.js`, `src/journey-chapters.js`, `src/journey-pulse.js`, `src/journey-finale.js`, `src/refugio-lugares.js`, `src/house-view.js`, `src/visual.js`, `src/bar-beat-hint.js` y `styles/estilo-j.css`.
- Guías: `docs/MUNDO.md`, `docs/VIAJE.md` y `docs/UNIVERSO.md`.
- Capturas: las 21 estándar (de `00-inicio` a `34-favoritos`) y, de los menús, `tel-libre-refugio`, `tel-libre-tu-cubo`, `tel-libre-mapa` y `hor-libre-menu`.
- Medida: un script de Python con PIL recorrió las 21 capturas estándar. Midió la luminancia media, el porcentaje de píxeles encendidos y el porcentaje de píxeles con color, es decir, con croma mayor que 24 sobre 255. También calculé la ΔE76 de la paleta de lugares.
- No abrí navegadores, no jugué con las manos y no oí el audio.

## Contexto

Kubono es un cubo blanco diminuto en un vacío negro. Su único gesto es tocar a tiempo con la música. Quiere ser un viaje musical corto: cinco capítulos que enseñan cinco verbos. Después llega un mundo abierto de once lugares que compone «Tu canción». La idea visual de fondo es buena y está escrita en el código: el mundo está gris y el color se gana tocando a tiempo. Hoy esa idea existe como mecánica, pero todavía no como imagen.

## Notas

| Área | Nota | Por qué | Evidencia |
|---|---|---|---|
| Visual | 6,5 | El lenguaje de línea fina sobre negro es coherente y el cubo siempre es el foco. Pero el juego se ve casi en blanco y negro, y varias texturas se vuelven ruido. | De las 11 capturas jugables, 10 tienen menos del 0,5 % de píxeles con color; Bosque tiene el 0,79 %. Lago enciende el 41 % de los píxeles y Dunas el 45 % (`02`, `11`). |
| Audio | 7 | Lo puntúo solo por el código, sin escucharlo. Cada portal tiene su nota pentatónica, con paneo según su lado. El cierre sigue el transporte audible. | `places-ring.js:15,79-84`; `song-stage.js:9-17`. |
| Creatividad | 7,5 | Devolver el color al tocar a tiempo y la canción como anillo de capas son ideas propias y legibles sin texto. | `world-sheet.js:3-5,22`; `song-stage.js:5-7`; `22-cancion`. |
| Sensación | 6 | La deduzco del código. El momento en que vuelve el color es breve y pequeño para lo que vale. | Paso del gris al color: aproximadamente 0,06 por fotograma, ≈0,8 s hasta el 95 % (`world-sheet.js:26`). Anillos de 54 px como máximo, con alfa 0,35 (`render.js:137`). |
| Cohesión | 6 | El color ganado no recorre el resto del juego. El HUD, los portales y el mapa usan oro genérico, y las nubes lejanas usan tonos al azar. | `journey-chapters.js:166`; `places-ring.js:62`; `distant-colors.js:41`; `tel-libre-mapa`. |
| Pulido | 6,5 | Las hojas son limpias y siguen el estilo. El Refugio, en cambio, se llena de rótulos que se pisan. | `tel-libre-refugio`: «Tu Refugio» tapa la línea de estado y hay siete rótulos sobre el dibujo. |
| **Media** | **6,6** | | |

## Lo que funciona

- **El color ganado está bien escrito.** El gris se pinta solo sobre el suelo, antes de los juegos, el cubo y el oro, así que el oro nunca se vuelve gris (`world-sheet.js:4-6`, `render.js:98-105`). Por eso en un mundo gris destacan dos manchas de color:
  - el haz amarillo de Faros (`13-lugar-faros`, el 0,48 % de los píxeles con color);
  - la llama roja de Cueva (`15-lugar-cueva`).

  Es composición por color: lo único saturado es el objetivo.
- **El cubo es una masa clara.** Es un cuadrado blanco con halo y un marco fino (`render.js:125-127`), y es el único blanco pleno en todas las capturas. Pequeño y legible a la vez, como pidió Jay.
- **Tu canción es la mejor ilustración del juego** (`22-cancion`). Once anillos. Los ganados están rellenos con su color: ámbar, cian, verde, violeta y blanco. Los que faltan son discontinuos y grises (`song-stage.js:26-31`). Lo que falta se entiende sin palabras.
- **El Camino es un vacío bien compuesto** (`00-inicio`). Solo el 2,3 % de los píxeles están encendidos: el cubo, una curva de puntos y dos cristales. Es silencio visual al servicio del primer gesto.
- **La interfaz es disciplinada.** Negro, esquinas rectas, blanco para estados y oro para lo ganado (`estilo-j.css:5-7`; `33-resultado`: estrella dorada frente a dos apagadas).
- **Hay una paleta por lugar definida una sola vez**, en `LANDSCAPES` (`house-view.js:68`). Tu canción y el mundo la reutilizan.

## Lo que falla o falta

1. **El color ganado no se acumula ni se ve fuera de su lugar.** Recuperar el color de Llanura solo tiñe Llanura (`world-sheet.js:20,36`). Las marcas de capítulo del HUD se vuelven oro, no el color del capítulo (`journey-chapters.js:166`). Los once portales del anillo usan el mismo oro (`places-ring.js:62,64`). El mapa también: `tel-libre-mapa` muestra círculos dorados y grises. El jugador nunca ve su paleta crecer, salvo en la pantalla de Tu canción. El progreso por color se queda en una sola pantalla.
2. **El color recuperado es niebla, no pigmento.**
   - En `20-anillo`, el fondo pasa del negro (6,6,6) a un gris verdoso (52,58,54), y el 99,5 % de los píxeles quedan encendidos. Aun así, solo el 0,13 % tiene color medible.
   - La causa es un velo plano del color del bioma, con alfa entre 0,11 y 0,15, sobre toda la pantalla (`world-sheet.js:36`). Se suma al degradado (`:34`) y a los lavados del amanecer y del atardecer (`world-light.js:15`).
   - El negro puro se pierde, y el color no se posa sobre las formas.
3. **El momento de recuperar el color es casi invisible.** Al cerrar el tema a tiempo (`journey-pulse.js:106`), el gris se va en ≈0,8 s (`world-sheet.js:26`). El código dice «second and a half», pero el ritmo real es 0,06 por fotograma. La única marca son tres anillos de 54 px como máximo, con alfa 0,35 (`render.js:137-139`). `reencuentro` se guarda y nada lo dibuja: solo aparece en `worldSheetState`. Es el clímax de cada capítulo y dura menos que un compás.
4. **Las estrellas no cambian el color.** En el anillo de Tu canción, una capa con ★ y otra con ★★★ se dibujan igual, porque `lit` es binario (`song-stage.js:28-29`, `:116`). La intensidad del color no cuenta el progreso.
5. **Hay ruido de textura en varias capturas.**
   - Lago (41 % encendido), Dunas (45 %) y Ruinas, con círculos, bandas y glifos de píxeles que parecen letras (`卌`). Compiten con el cubo y con el objetivo (`02`, `11`, `14`).
   - Cada fotograma del mundo apila 46 llamadas `draw*` (`render.js:95-130`).
   - En un Viaje que se quiere «sin rótulos», esos glifos se leen como texto.
6. **La paleta pierde fuerza en la segunda mitad.** Vacío, Dunas, Cristales y Faros son blancos o pálidos. La ΔE76 más baja es 29 (Cristales frente a Vacío), y le sigue 29,6 (Dunas frente a Vacío). El recorrido de color no tiene arco: no sube hacia un clímax. Además, en el modo para daltonismo, tres pares comparten el mismo color: Dunas y Llanura, Cristales y Lago, Faros y Ruinas (`color-safe.js:4-5`). En el anillo de Tu canción dejan de distinguirse.
7. **Las nubes lejanas usan un tono al azar** (`hue:(h>>>3)%360`, `distant-colors.js:22,41`). Es un color que no significa nada en un juego donde el color debería significar algo.
8. **El Refugio es un diagrama, no una ilustración.** En `tel-libre-refugio` hay rótulos en mayúsculas («CIELO · 7 DÍAS O 20 LOGROS», «RAÍZ · 14 DÍAS…», «TALLER · TOCA EL DISCO») y un cartel que se solapa con otra línea. El dibujo queda debajo del texto.
9. **Hay un detalle sin resolver.** En todas las capturas del mundo aparece un disco gris fijo en (320,478). No pude atribuirlo con certeza a un módulo. Hay que comprobar si es intencional.

## Recomendaciones

1. **Que el color ganado viaje contigo.** Las marcas de capítulo de la Línea (`journey-chapters.js:166`), los portales abiertos y completos (`places-ring.js:62-64`) y los puntos del mapa deberían usar `placeColor(id)` en vez del oro. El oro se reserva para las estrellas.
   *Bien cuando:* tras el Viaje, una captura del anillo o del HUD muestra al menos 5 tonos distintos de `LANDSCAPES`, y ningún portal completo sigue en `#f0d27a`.
2. **Pigmento en las formas, no velo.** Hay que bajar o quitar el relleno plano de `world-sheet.js:36` y llevar el color a las líneas y figuras del bioma, que ya reciben `ink`.
   *Bien cuando:* en un bioma recuperado, la mediana del fondo queda por debajo de RGB 20, y más del 2 % de los píxeles tiene croma mayor que 24, medido con el mismo script.
3. **Un momento de color que se vea.** La recuperación debería durar un compás entero, de 2 a 3 s, con el color abriéndose desde el cubo, por ejemplo con un radio de recorte que crece. `reencuentro` (`world-sheet.js:22`) ya tiene la marca de tiempo. La música no se toca; solo se acompaña su golpe.
   *Bien cuando:* `worldSheetState().grey` tarda al menos 2 s en pasar de 1 a 0,05, y el frente de color alcanza el borde de la pantalla.
4. **Las estrellas como saturación en Tu canción.** En `drawSongRings` (`song-stage.js:26-31`), ★ sería solo el contorno, ★★ el relleno con alfa 0,35 y ★★★ el relleno pleno con halo.
   *Bien cuando:* tres capas con 1, 2 y 3 ★ dan tres valores de luminancia media distintos en la captura del anillo, separados entre sí por 15 % o más.
5. **Limpiar la masa de textura.** En Lago, Dunas y Ruinas hay que reducir la densidad del plano medio, y durante el Viaje esconder los glifos de píxeles que parecen letras.
   *Bien cuando:* ninguna captura de capítulo o de lugar supera el 25 % de píxeles encendidos, y el cubo sigue siendo el píxel blanco más brillante.
6. **Paleta con arco y daltonismo sin repeticiones.** Hay que ordenar la luz de los once lugares para que suba hacia Cueva. En `SAFE_COLORS`, el modo para daltonismo debería tener un tono por lugar, o la misma tinta con distinto patrón de contorno.
   *Bien cuando:* en `SAFE_COLORS` no hay dos lugares con el mismo hex, y la ΔE76 mínima entre lugares de la paleta normal es de al menos 35.

## Opinión

Kubono ya tiene la idea correcta, el mundo gris que se colorea al tocar a tiempo, pero hoy esa idea se ve en una sola pantalla y el resto del juego sigue siendo un dibujo en gris.
