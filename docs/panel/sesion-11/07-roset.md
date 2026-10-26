# 07 · Conrad Roset — sesión 11
> Simulación de su mirada de diseño a partir de su obra pública. No es su opinión real. Revisó alpha.215 (`5464612`): las 21 capturas estándar, `menus/tel-libre-mapa.png`, `menus/tel-libre-refugio.png`, `tel-libre-lugares`, `tel-libre-menu` y `tel-libre-tu-cubo`; el código del color ganado (D4); medidas de color en los PNG con Node puro.

## Notas (puntuación ciega)
| Eje | Nota | Evidencia y alcance |
|---|---|---|
| Visual | 6,5 | Negro, línea fina y aire: cada lugar tiene su dibujo. Pero las once rondas son casi grises: 0,00–0,05 % de píxeles con color en diez de las once capturas de juego (Faros, 0,37 %). |
| Audio | — | Me abstengo. No oigo nada y mi lente es la imagen. |
| Creatividad | 7 | La idea es buena: el bioma queda pálido hasta tocar a tiempo y el color vuelve desde el cubo en un compás (`src/world-sheet.js:38`, `:75`). Tu canción como anillo de capas de color. |
| Sensación | 6 | Solo por capturas y código. El regreso del color no aparece en ninguna captura. Lo ganado se ve en marcas de 4 px. |
| Cohesión | 5,5 | El dorado dice seis cosas: ★, a tiempo, el «1», la meta de la ronda, ✦ y la cuenta de lugares. D4 pide dorado solo para ★. |
| Pulido | 6,5 | Interfaz limpia y coherente. Fugas concretas: «5 / 11» en dorado, el Vacío completo es blanco como uno abierto, Dunas y Faros casi dorados. |

Medidas (Node puro sobre los PNG; «color» = saturación > 0,25 y valor > 0,2; «negro» = valor < 0,06): capítulos y lugares, 91,9–99,4 % negro. Las marcas de capítulo miden 4 px y coinciden con `LANDSCAPES` (`05-capitulo-vacio`: `#eb9a3c`, `#5cc8ff`, `#6fe08a`, `#b48cff`, `#fdfdfd`).

## Lo que funciona hoy

- **El negro respira.** Ninguna captura de juego pasa del 8,1 % de píxeles encendidos. El cubo es el blanco pleno de cada imagen.
- **El color ganado ya viaja.** Portales completos (`src/places-ring.js:64`), marcas de capítulo (`src/journey-chapters.js:172`), mapa (`src/map.js:59`) y trofeos del Refugio (`src/refugio-lugares.js:41`) usan `earnedColor` (`src/color-safe.js:11`). En `menus/tel-libre-mapa.png` medí los anillos: `#e09239`, `#59c3f8`, `#6fe08a`, `#b18afc`.
- **Pigmento, no velo.** El bioma recuperado entra con mezcla `color` y el negro sigue negro (`src/world-sheet.js:73`). En `20-anillo` el fondo es `#030f07`; el 2,2 % de los píxeles tiene color.
- **El regreso del color dura un compás** y se abre desde el cubo con un frente fino (`src/world-sheet.js:38`, `:75-78`). No lo vi en captura; lo leo en el código.
- **La Cueva es una ilustración.** Una llama roja sobre negro y ocho cuadros blancos (`15-lugar-cueva`). Lo único con color es lo que importa.
- **Tu canción** cuenta ★, ★★ y ★★★ por saturación (`src/song-stage.js:32-34`). Lo que falta es un círculo discontinuo. Se lee sin texto.

## Lo que falta o salió mal

1. **El dorado dice demasiadas cosas (alta).** D4 lo reserva a ★. Hoy también es: la cuenta de lugares «5 / 11» (`styles/estilo-j.css:599`, medido `#f0d27a` en `21-lugares`), el botón «5/11 lugares» del Refugio (`src/refugio-lugares.js:81` con `.house-stars`, `estilo-j.css:597`), las chispas ✦ (`estilo-j.css:384`, `:435`), el icono de Bitácora (`:466-467`), la remezcla y el narrador (`:611`, `:615`, `:619`), los hitos y el Estudio en el mapa (`src/map.js:46`, `:63`; cuadro `#695d31` en el centro de `tel-libre-mapa`) y la chispa salvaje (`23-salvaje`, `#f0d27a`). Con tantos usos, la ★ deja de brillar sola.
2. **Dentro de la ronda, el lugar no tiene su color (alta).** Diez de las once capturas de juego tienen ≤ 0,05 % de píxeles con color. El único acento es el dorado: el «1», el anillo de llegada, la gota, el barco y las chispas que vuelan a la barra (`src/journey-pulse.js:138`, `:152`; `src/journey-echo.js:145-160`; `src/journey-guide.js:58`). Lo ganado se ve fuera, en marcas de 4 px; dentro, cada lugar es gris y oro.
3. **El Vacío completo no se distingue (media).** Su color es blanco (`src/house-view.js:68`). Un portal abierto también es blanco (`src/places-ring.js:64`). En el mapa medí `#fcfcfc` (Vacío completo) frente a `#fbfbfb` (Jardín abierto). En la Línea, la marca hecha del Vacío es igual a la del capítulo actual (`src/journey-chapters.js:172`).
4. **La hoja Lugares no tiene color (media).** Los lugares completos son nombres blancos (`21-lugares`; `src/refugio-lugares.js:56-62` no usa `earnedColor`). Es la hoja que más se abre y no muestra lo ganado.
5. **Tu canción se ve sepia (media).** Un degradado dorado cubre la pantalla (`src/song-stage.js:127`; fondo medido `#332c1a`). A ★ el relleno queda en `#3e3423` para Llanura. Los colores ganados llegan apagados bajo el oro.
6. **Dunas y Faros están cerca del dorado (media).** ΔE76 frente a `#f0d27a`: Dunas 20,4; Faros 24,1. En daltonismo, Refugio *es* el dorado (`src/color-safe.js:7`, ΔE 0). Un portal completo de Dunas puede leerse como ★.
7. **El pigmento tiñe cosas que no son suelo (baja).** La mezcla se pinta después de rarezas, celebraciones y luciérnagas (`src/render.js:105-106`). Una rareza dorada en un bioma recuperado toma el tono del bioma.
8. **El Refugio sigue siendo un diagrama (media).** `tel-libre-refugio`: «CIELO · 8 LUGARES O 15 ★», «RAÍZ · 11 LUGARES O 24 ★», «LUGARES · ★ 5 / 33», «TALLER · TOCA EL DISCO», «ECO», «PRISMA». El aviso «Tu Refugio viaja» pisa la línea de Cielo.
9. **Las nubes lejanas siguen con un tono al azar (baja).** `hue:(h>>>3)%360` (`src/distant-colors.js:22`). Color que no significa nada.

## Contraste con la sesión 10

Mis notas: 6,5 / — / 7 / 6 / 5,5 / 6,5. En la sesión 10: 6,5 / 7 / 7,5 / 6 / 6 / 6,5. Bajan Creatividad y Cohesión; el resto igual. Me abstengo en Audio.

**Cerrado:**
- Color del lugar en portales, marcas, mapa y trofeos (mi punto 1). Comprobado en código y en `tel-libre-mapa`.
- Pigmento en lugar de velo (punto 2). Fondo del anillo `#030f07`; 2,2 % con color.
- El momento del color dura un compás y se abre desde el cubo (punto 3). Solo en código.
- Estrellas como saturación en Tu canción (punto 4).
- Menos textura (punto 5). Máximo 8,1 % encendido en mis medidas.
- `SAFE_COLORS` sin repetidos (punto 6, parte).
- El disco gris en (320,478) ya no está (punto 9). Medí `#060606`.

**Abierto:**
- La paleta sigue sin arco: ΔE mínimo 29,2 (Cristales–Vacío), igual que antes.
- Las nubes lejanas, con tono al azar (punto 7).
- El Refugio, con rótulos encima del dibujo (punto 8). Ahora con reglas de salas en mayúsculas.
- Glifos de píxeles que parecen letras: más tenues, pero se ven en `01`, `02`, `10`, `12`.

**Empeoró o es nuevo:**
- El dorado ganó usos: tic de la Línea (P4), anillo del «1» (P3) y cifras del HUD (P8). D4 pedía lo contrario.
- La cuenta de lugares en dorado (`.lugares-count`, `#houseStars`).
- Tu canción a ★ queda sepia bajo el degradado dorado.
- Vacío completo = blanco = abierto.

## Qué haría ahora

1. **Dorado solo en ★, de verdad.** Pasar a blanco `.lugares-count`, `.house-stars` cuando dice lugares, `.lugares-remix`, `.place-narrator`, `.narrator-line`, el icono de Bitácora y los hitos y el Estudio del mapa (`styles/estilo-j.css:597-619`, `:466`; `src/map.js:46`, `:63`). Las ✦ las decide Jay.
   *Bien cuando:* en `21-lugares`, `tel-libre-refugio` y `tel-libre-mapa` todo píxel a ΔE < 15 del dorado cae dentro de una ★.
2. **Completo = relleno; abierto = solo contorno.** En portal, mapa y Línea, el completo se rellena con su color al 35 %; así el Vacío se distingue por masa, no por tono (`src/places-ring.js:71`, `src/map.js:59`, `src/journey-chapters.js:172`).
   *Bien cuando:* en el mapa, la luminancia media del marcador del Vacío completo supera en ≥ 30 % la del Jardín abierto.
3. **El color del lugar dentro de su ronda.** La meta de cada ronda (gota, barco, flor) y las chispas que vuelan a la barra toman `earnedColor` del lugar; el dorado queda para la ★ de la tarjeta (`src/journey-echo.js:159-160`, `src/journey-guide.js:58`, `drawBarDrop`, `src/journey-games.js:21`).
   *Bien cuando:* en una captura de ronda con la barra llena, ≥ 0,5 % de píxeles tiene color con tono a ≤ 20° del de su lugar.
4. **Tu canción sin velo.** Quitar el degradado dorado mientras no es el final, y subir el relleno de ★ (`src/song-stage.js:41`, `:127`).
   *Bien cuando:* en `22-cancion`, el fondo superior queda con canal máximo ≤ 20 y el relleno de Llanura a ★ tiene croma ≥ 40.
5. **Lugares con su color.** Un cuadro de 4 px del color del lugar junto a cada nombre completo (`src/refugio-lugares.js:56-62`).
   *Bien cuando:* en `21-lugares`, cada fila completa tiene un píxel a ΔE < 10 de su `earnedColor`.
