# Segunda sesión · Toshio Iwai (simulación)

> Simulación respetuosa de su filosofía conocida (música como juguete, cada sonido una forma, nunca suena mal). No es su opinión real ni hay citas. Principios y fuentes: `02-iwai.md`. Versión revisada: 2.3.0-alpha.160. Solo Jay ha jugado esta versión.

## Qué mejoró desde el 22 de octubre

- **Nunca suena mal, ahora es regla.** Un pulso fuera de tiempo no hace nada en el juego, pero su voz sigue entrando en la rejilla (`runtime.soon` en `src/interactions.js`). A tiempo, toca la nota siguiente del tema en la escala del lugar (`themePitch`, `src/journey-pulse.js`). La capa de cada lugar sigue el acorde del mundo (F13, `tests/journey-victory.mjs`). No puede desafinar.
- **Ya no hay que identificarse.** La cuenta es opcional y el Viaje se juega sin ella (`?capitulo=`, `?festival=1`).
- **Hay juguetes de verdad.** Los Cristales hacen un acorde de tres notas que suenan 16 tiempos (`12-lugar-cristales.png`). En el Jardín, cada flor añade una nota al arpegio. La Cueva canta un patrón y lo repites: es Simon con música, muy Otocky (`src/journey-echo.js`).
- **El ritmo se ve.** Ocho puntos bajo el cubo son las corcheas y el «1» es dorado (F14). En la Cueva, las casillas rojas son la llamada y las doradas, tu respuesta (`15-lugar-cueva.png`).
- **Tu canción** (`22-cancion.png`) es la primera pantalla donde imagen y música son lo mismo: once anillos, una capa por lugar, con color.
- **Vibración** en cada acierto, con ajuste para apagarla.

## Qué sigue mal o es nuevo

- **El juguete se volvió examen.** Los 11 lugares tienen barra, meta, % a tiempo, ★★ al 85 % y Maestro con la ventana más estrecha (`docs/MUNDO.md`). Para ganar hay que sacar 33 ★. Electroplankton no tenía nota. Aquí, tocar sin objetivo solo es posible en el Mundo salvaje, y allí también hay chispas.
- **El ritmo se explica con palabras.** «Aquí se toca en el «y», entre los tiempos», «Las Ruinas piden «1 · 2y · 3 · 4»» (`src/journey-rhythm.js`). Un niño no lee «2y». Debería oírse antes de tocarse.
- **Tu canción no se toca.** `song-stage.js` solo tiene «Otra vez» y «Cerrar». Once anillos de colores que no responden al dedo: es un Tenori-on bajo un cristal.
- **No todo lo que suena deja forma.** La onda a tiempo y la de fuera de tiempo se dibujan igual: el campo `beat` de la onda no se usa (`updWaves`, `interactions.js`). Las formas son líneas finas grises. El color recuperado llega como polvo (`mz-llanura-after.png`).
- **El móvil sigue siendo un solo dedo.** No hay multitáctil ni micrófono (no aparecen `touches.length` ni `getUserMedia` en `src/`). El mar de plancton no se hizo.
- **El Refugio sigue contando en lugar de sonar.** El contador «N de 40» sigue ahí (`src/house.js`). Los trofeos ya suenan al tocarlos (F6–F7). No comprobé si las cámaras-partitura tienen un patrón inicial: el 22 de octubre estaban vacías.
- **La primera pantalla** (`00-inicio.png`) sigue siendo un texto con «Empezar». Detrás se ven «DÍA 1», «Era I · Pixel» y «0 chispas».
- **Lugares** (`21-lugares.png`) es una tabla: «Llanura ★ Sin visitar». Tiene una estrella y dice que no la visitaste. Confunde.

## Notas

| Eje | 22 oct | Hoy | Por qué |
|---|---|---|---|
| Visual | 6,5 | 6,5 | Cada lugar tiene su forma, pero gris y fina. Solo Tu canción tiene color. |
| Audio | 8 | 8,5 | Cuantizado, siempre en el acorde, con capas que siguen al mundo. |
| Creatividad | 7,5 | 8 | Cristales, Jardín y Cueva son juguetes sonoros reales. |
| Sensación | 5,5 | 6,5 | Hay vibración y regla clara. Sigue siendo un dedo, sin multitáctil ni voz. |
| Cohesión | 5 | 6,5 | Un verbo común. Estrellas, %, Maestro y chispas hablan de puntuación, no de juego. |
| Pulido | 6 | 6,5 | Muchas pruebas automáticas. Texto en la entrada y en los ritmos; ninguna persona. |
| **Media** | **6,4** | **7,1** | |

## Sus 3 acciones prioritarias

**1. Tu canción se toca como un Tenori-on.**
- Qué: cada anillo ganado es un interruptor. Tocarlo quita o pone su capa en el siguiente compás. Una pulsación larga la deja sola.
- Cómo: en `src/song-stage.js`, añadir `pointerdown` a cada anillo encendido. Guardar un conjunto `muted` en memoria, sin tocar el guardado. `src/song.js` lo consulta en cada compás antes de programar la capa. El anillo apagado queda punteado y el que suena late. Las capas no ganadas no responden.
- Criterio: `tests/song_mix.py` renderiza 32 combinaciones al azar de capas y ninguna pasa de pico 0,6. Una prueba de navegador quita y pone capas y confirma que el cambio entra en el «1» siguiente. Luca cambia la canción en 10 s sin leer.

**2. El ritmo se oye antes de tocarse.**
- Qué: al llegar a un lugar, el lugar canta su patrón durante un compás y luego te toca a ti. Fuera el texto.
- Cómo: reutilizar la llamada de la Cueva (`journey-echo.js`: el secuenciador canta el patrón). En `journey-rhythm.js`, al empezar la ronda, programar un compás de llamada con `steps` del ritmo, en la voz del lugar, y encender los ocho puntos al compás. Quitar `say`, o dejarlo solo con «Todo a la vista».
- Criterio: `rhythm_smoke.py` confirma que no aparece ningún texto de ritmo en el modo Viaje y que la llamada suena en el primer compás. En las pruebas con `?prueba=1`, el primer pulso en el paso correcto llega antes de 4 compases.

**3. Cada sonido deja una forma con color.**
- Qué: todo lo que suena por el jugador dibuja algo: tipo por timbre, color por lugar, tamaño por volumen y vida por duración. Fuera de tiempo también, pero pequeño y gris, porque también suena.
- Cómo: crear un registro en `src/interactions.js` (o un módulo nuevo, que vaya en `SHELL` de `sw.js`). `playVoice` y `hearVoice` con `origin==='player'` añaden una forma en `{x,y}` que nace a la hora programada `t`. El color sale de `runtime.placeColor`. Usar `w.beat` para dibujar en dorado la onda a tiempo.
- Criterio: un contador cuenta sonidos del jugador y formas dibujadas, y deben coincidir al 100 %. Con el sonido apagado, en capturas de seis lugares se distingue cuál es cuál. El 10 % de la pantalla tiene color tras un minuto tocando.

## Una decisión que solo Jay puede tomar

**¿Un modo juguete por lugar?** Su propuesta: desde la hoja Lugares, cada lugar ya visitado se abre también «Libre»: sin barra, sin %, sin estrellas y sin chispas. Solo su verbo y su música, todo el tiempo que quieras. Las 33 ★ siguen siendo la forma de ganar. Jay decide si el juego admite tocar sin nota.
