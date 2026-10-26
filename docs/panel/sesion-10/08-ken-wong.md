# 08 · Ken Wong (simulado)

Simulación de la mirada de diseño de Ken Wong a partir de su obra pública. No es su opinión real.

Versión **2.3.0-alpha.207** (commit `2e7f9d1`). No jugué con las manos ni oí el audio. Lo que digo del sonido y del tacto sale del código.

**Revisé:**
- Código: `src/main.js`, `onboarding.js`, `onboarding-model.js`, `journey-mode.js`, `journey-hint.js`, `journey-pulse.js`, `journey-rhythm.js`, `journey-games.js`, `journey-guide.js`, `journey-chapters.js` (cabeceras y dibujo), `bar-beat-hint.js`, `canvas.js`, `interactions.js`, `creative.js`, `render.js`, `crystal-sparks.js`, `walker-forms.js`, `world-sheet.js`, `places-ring.js`, `voice-guide.js`; `index.html`, `styles/estilo-j.css`.
- Capturas (17): `00-inicio`, `01`–`05` (cinco capítulos), `10-lugar-jardin`, `12-lugar-cristales`, `13-lugar-faros`, `15-lugar-cueva`, `20-anillo`, `21-lugares`, `22-cancion`, `23-salvaje`, `30-menu`, `31-guia-jardin`, `33-resultado`, y `menus/hor-viaje-menu`.
- Medidas de píxeles sobre las capturas (Python/PIL) y `node scripts/play-curve.mjs`.

## Contexto

Kubono es un cubo blanco de seis píxeles en un cosmos negro. Tocas a tiempo y el mundo responde con música. El Viaje quiere ser una obra sin palabras: el color vuelve cuando tocas bien, y cada capítulo enseña un verbo nuevo sobre el mismo gesto. Después se abre un Mundo libre y una canción que crece con tus estrellas. Su ambición es la de una pieza contemplativa tipo «Gris con ritmo», sostenida por un sistema muy grande detrás.

## Notas

| Área | Nota | Por qué | Evidencia |
|---|---|---|---|
| Visual | 7 | Identidad clara y propia; algunas pantallas son láminas, otras son ruido. | `13-lugar-faros` y `00-inicio` componen bien; `02-capitulo-lago` y `01-capitulo-llanura` saturan. |
| Audio | 7 | Por código: el pulso a tiempo toca la siguiente nota del tema en la escala del lugar, y la luz espera al oído. No lo oí. | `journey-pulse.js:96`, `:107-110`; `interactions.js:44-46`. |
| Creatividad | 8 | Un gesto, once verbos. El color se gana. El faro que guía barcos es una idea de lámina. | `journey-games.js:21-33`; `world-sheet.js:5`; `journey-guide.js:4-9`. |
| Sensación | 6,5 | El tiempo se enseña en tres sitios lejos del cubo; la pista fantasma pesa más que el héroe. No lo toqué. | `journey-pulse.js:116`; `bar-beat-hint.js:17`; `journey-hint.js:21`; medida abajo. |
| Cohesión | 6,5 | Tres instrucciones distintas sobre dónde tocar; una palabra dentro del Viaje sin palabras. | `onboarding-model.js:7`; `index.html:216`; `crystal-sparks.js:157`. |
| Pulido | 6,5 | Premios que vuelan a una barra que no está ahí; contrastes bajo 1,5:1; marcas de 3 px. | `journey-stick.js:90` (y 9 archivos más); capturas. |
| **Media** | **6,9** | | |

## Lo que funciona

1. **La primera pantalla es una lámina.** `00-inicio.png`: negro, un cubo, dos cristales, un rastro de puntos que dibuja el camino. Solo el 0,17 % de los píxeles supera luminancia 60. El ojo va al centro sin esfuerzo.
2. **El Viaje empieza sin ventana.** `main.js:263-264` no abre bienvenida en modo Viaje. La guía con texto queda oculta con `body.journey-quiet` (`estilo-j.css:541`). Bien.
3. **La pista espera.** La mano fantasma sale solo tras 4 s sin tocar y tarda 20 s cuando ya acertaste tres veces (`journey-hint.js:5`, `:16-18`). Es la regla correcta: enseñar solo al que duda.
4. **El color se gana.** Un bioma queda pálido hasta que completas el tema a tiempo; luego se tiñe (`world-sheet.js:3-7`). Es narrativa sin texto. En `10-lugar-jardin.png` y `20-anillo.png` se nota el verde.
5. **El Faro es la mejor pantalla.** `13-lugar-faros.png`: un haz dorado que gira con el compás (`journey-guide.js:72`), un puerto punteado y barcos blancos. Hay una sola dirección de lectura: del cubo hacia la luz.
6. **Luz, vibración y sonido en el mismo instante.** El destello del acierto se programa al momento audible, no al toque (`journey-pulse.js:107-110`). Así una pantalla quieta puede sentirse viva.
7. **Tu canción se lee como un objeto.** `22-cancion.png`: once círculos en anillo, cinco con color, el resto vacíos y punteados. Se entiende sin leer.

## Lo que falla o falta

Ordenado por gravedad.

1. **La pista fantasma es mayor que el héroe.** El cubo mide 6×6 px de relleno (192–197, 419–424 en `00-inicio.png`). El dedo fantasma es un disco gris de 26 px (`journey-hint.js:21`, radio 13), medido 308–332 px. Ocupa unas 17 veces el área del cubo. Está en todas las capturas de juego, a 97 px a la derecha del cubo (`journey-hint.js:7`). Visto quieto parece un botón o un joystick, no una mano. En los primeros segundos compite con el cubo por la mirada.
2. **El ritmo se enseña lejos de donde mira el jugador.** El cubo está en y=422. La Línea de compás está en y=675 (`journey-pulse.js:116`, `H*.8`). La barra que late está en y=84 (`bar-beat-hint.js:17`; captura). Son 253 px abajo y 338 px arriba. El cubo apenas respira con el golpe (`render.js:111`, `b*.08`). El dedo y el ojo están en el centro; la información de tiempo está en los bordes.
3. **La Línea casi no se ve.** Trazo base con alfa .16 (`journey-pulse.js:117`). Píxel medido: (41,41,41) sobre negro en `00-inicio.png`, contraste ≈1,45:1. Las marcas no contadas tienen alfa .14 (`:123`). La barra superior sin llenar: (36,36,36). Todo por debajo de 3:1 para un gráfico que el jugador necesita.
4. **Tres órdenes distintas sobre dónde tocar.** La guía dice «Toca el cubo al ritmo» (`index.html:216`; `31-guia-jardin.png`). La lección dice «Toca un espacio vacío para lanzar un pulso» (`onboarding-model.js:7`). La mano fantasma toca el vacío a la derecha (`journey-hint.js:7`). El código acepta ambos: el cubo dispara al bajar el dedo (`canvas.js:42`), el vacío al soltar (`canvas.js:66`). El jugador no sabe qué es lo correcto.
5. **Una palabra en el Viaje sin palabras.** En el Camino se escribe «Pulso» bajo el cristal cercano (`crystal-sparks.js:157`; visible en `00-inicio.png`). El silencio del lienzo solo actúa dentro del Mundo (`journey-mode.js:25`, `runtime.inWorld?.()`), así que el Camino queda fuera. Es la primera palabra que ve un jugador nuevo, y no dice qué hacer.
6. **Los caminantes parecen letras.** Son siluetas de 7–12 px hechas de trazos (`walker-forms.js:9-14`). En el teléfono se leen como caracteres sueltos («卅», «耳») en `05-capitulo-vacio.png`, `12-lugar-cristales.png`, `13-lugar-faros.png`. En un juego sin texto, algo que parece texto es ruido que el ojo intenta leer.
7. **Lago y Llanura no son láminas.** `02-capitulo-lago.png`: decenas de círculos concéntricos, flores, burbujas y caminantes con el mismo peso. `01-capitulo-llanura.png`: siete discos grises con rombo, de unos 50 px, repartidos sin composición. No hay figura y fondo. El cubo de 6 px se pierde entre ellos.
8. **Los premios vuelan a una barra que no está ahí.** Los diez juegos mandan las chispas doradas a `barY=42` (`journey-stick.js:90`, `journey-chain.js:78`, `journey-lasso.js:89`, `journey-dance.js:70`, `journey-garden.js:90`, `journey-surf.js:69`, `journey-resonance.js:65`, `journey-guide.js:87`, `journey-rebuild.js:79`, `journey-echo.js:73`). La barra DOM aparece en y=84–85 en las capturas de 390×844. El vuelo termina 42 px por encima, en el vacío. El gesto de «esto se suma» no se cierra.
9. **El mapa del Viaje mide 3 px.** Las siete marcas del progreso son `fillRect` de 3×3 (`journey-chapters.js:166`). En `04-capitulo-tormenta.png` se ven como polvo dorado junto a la Línea.
10. **Menores de interfaz.** En horizontal, el menú no muestra «Ajustes» y no hay señal de que se desplace (`menus/hor-viaje-menu.png`). La hoja Lugares abre con la primera fila cortada (`21-lugares.png`). Las estrellas de cada fila miden pocos píxeles. El resultado apila cinco líneas de datos (`33-resultado.png`); falla ★★ por 0,4 puntos y lo dice en cifras, no en imagen.

## Recomendaciones

1. **Que la pista nazca del cubo.** Cambiar el disco de 26 px por un anillo fino que se abre desde el cubo en cada golpe, más una estela corta de arrastre. Dónde: `journey-hint.js:7` y `:20-25`. No se toca el tamaño del cubo.
   *Bien cuando:* en `00-inicio.png` ningún elemento de pista supera el área de la caja del cubo (14×14 px) en reposo; y el centro de la pista está a ≤30 px del cubo.
2. **Llevar el golpe al centro.** Un halo de 1 px alrededor del marco del cubo que se enciende en cada tiempo contado, con el mismo `approach` de la Línea. Dónde: `render.js:126-127` (halo existente) usando `journeyRhythmState().steps` y `approach` de `journey-pulse.js:23`. La Línea se queda como apoyo.
   *Bien cuando:* en una grabación de 4 compases, el píxel más brillante de cada golpe contado cae a ≤40 px del cubo; y en un estudio de ojos o de preguntas con 5 personas nuevas, al menos 4 dicen que miraban el cubo al tocar.
3. **Una sola orden: tocar el cubo o tocar donde sea.** Elegir una y alinear guía, lección y mano. Dónde: `index.html:216`, `onboarding-model.js:7`, `voice-guide.js:25`, `journey-hint.js:7`.
   *Bien cuando:* `grep` de «Toca» en esos cuatro sitios da la misma idea; y la mano fantasma toca donde dice el texto.
4. **Silencio también en el Camino.** Extender el silencio del lienzo al modo `camino` mientras dura el Viaje, o quitar «Pulso» de `crystal-sparks.js:157` y señalar el cristal con un parpadeo al golpe.
   *Bien cuando:* en modo Viaje, un contador de llamadas a `fillText` durante los primeros 60 s del Camino da 0.
5. **Contraste y destino.** Subir la Línea base a ≥3:1 (alfa ≈.35) sin tocar las marcas contadas; poner `barY` a la posición real de `#bar` (leer `getBoundingClientRect` una vez por cambio de tamaño). Dónde: `journey-pulse.js:117`, `:123`; los diez `barY=42`.
   *Bien cuando:* la Línea medida en captura da ≥(90,90,90); y el último cuadro del vuelo dorado cae a ≤4 px de la barra en 390×844, 844×390 y 1280×800.
6. **Una figura por pantalla en Lago y Llanura.** Bajar el peso de lo que no se puede tocar ahora (ondas, caminantes, flores lejanas) a alfa ≤.25 y dejar a plena luz solo el objetivo cercano. Dónde: dibujo de esos capítulos (`journey-stick.js`, `journey-chain.js`) y el dibujo de fauna (`world-fauna.js`).
   *Bien cuando:* en `01` y `02`, a lo sumo 3 objetos además del cubo superan luminancia 120; y los caminantes no superan luminancia 80 durante un capítulo.

## Opinión en una frase

Kubono ya sabe hacer láminas (el Camino, el Faro, Tu canción), pero todavía enseña el ritmo en los bordes de la pantalla mientras el jugador mira un cubo que no late.
