# 02 · Toshio Iwai (simulado)

Simulación de la mirada de diseño de Toshio Iwai a partir de su obra pública. No es su opinión real.

**Versión:** 2.3.0-alpha.207 (commit `2e7f9d1`).

**Qué revisé.**
- Código: `src/interactions.js`, `src/canvas.js`, `src/body.js`, `src/controls.js`, `src/control-motion.js`, `src/journey-pulse.js`, `src/journey-rhythm.js`, `src/journey-games.js`, `src/journey-hint.js`, `src/song-stage.js`, `src/collection-garden.js`, `src/house.js`, `src/house-model.js`, `src/house-audio.js`, `src/audio.js` (secuenciador y colas), `src/voices.js` (cabecera).
- Guías: `docs/VIAJE.md`.
- Medida: `node scripts/play-curve.mjs` (jugadores simulados, no personas).
- Capturas (15): `00-inicio`, `01-capitulo-llanura`, `03-capitulo-bosque`, `04-capitulo-tormenta`, `05-capitulo-vacio`, `10-lugar-jardin`, `12-lugar-cristales`, `20-anillo`, `22-cancion`, `23-salvaje`, `31-guia-jardin`, `33-resultado`; menús `tel-libre-refugio`, `tel-libre-grabar`, `tel-viaje-menu`.
- Límite: no oí el audio ni toqué un teléfono. Audio y sensación se puntúan por el código.

## Contexto

Kubono es un instrumento de un solo gesto: tocar la pantalla lanza un pulso desde un cubo pequeño. El pulso siempre suena bien. Si cae a tiempo, toca la siguiente nota del tema del cubo. El juego quiere que cualquiera sienta que toca la música del lugar. Hoy es sobre todo un juego de **precisión rítmica**, con una canción que se escucha al final. El juguete musical libre existe, pero está escondido en el Refugio.

## Notas

| Área | Nota | Por qué · evidencia |
|---|---|---|
| Visual | 7 | Cada objeto sonoro tiene forma propia (`interactions.js:57-65`, `:70-81`) y el anillo de Tu canción se lee sin palabras (captura `22-cancion`). Pero el campo está lleno de glifos grises de bajo contraste y el Refugio se amontona (`tel-libre-refugio`: el rótulo «Tu Refugio» tapa el texto). |
| Audio | 7,5 | Por código: nada suena fuera de la rejilla. Lo que va fuera de tiempo se coloca en la siguiente semicorchea (`audio.js:336`). Luz, vibración y nota se programan para el instante audible (`journey-pulse.js:30`, `:66-70`). No lo oí. |
| Creatividad | 5 | El jugador elige *cuándo*, nunca *qué nota*. El acierto toca siempre el mismo tema de seis grados (`journey-pulse.js:6`, `:96`). «Tu frase» es ese tema con tu ritmo (`song-stage.js:63-64`). |
| Sensación | 6,5 | Por código: el pulso se juzga al apoyar el dedo (`canvas.js:42`, `:66`), hay calibración de latencia (`journey-pulse.js:37-40`) y vibración en el acierto. Pero los toques rápidos se descartan en silencio (`interactions.js:33`). Fuera de Android no hay vibración (`journey-pulse.js:65`, `navigator.vibrate`). |
| Cohesión | 7,5 | Un verbo para todo. Una sola guía: la Línea de 16 pasos (`journey-pulse.js:115-128`). Cada lugar canta su patrón dos compases antes de pedirlo (`journey-rhythm.js:50-56`). Las estrellas son capas de la misma canción (`song-stage.js:5-13`). |
| Pulido | 7 | Hay mucho cuidado con la latencia, los cierres y el guardado. Fallan detalles: el «74,6 % / 75 %» castiga un 0,4 % (`33-resultado`) y el punto gris de la pista parece un objeto más (todas las capturas de capítulo, en 320,478). |
| **Media** | **6,75** | (7 + 7,5 + 5 + 6,5 + 7,5 + 7) / 6 = 6,75 |

## Lo que funciona

1. **Que nunca suene mal es real, no solo un lema.** Un pulso a destiempo no se pierde. Entra en la cola y suena en la siguiente semicorchea, en la escala del lugar (`interactions.js:53`, `audio.js:336`). Lo que toca la onda se reparte en arpegio, cuatro por paso (`audio.js:336`) y doce por onda como máximo (`interactions.js:25`).
2. **La onda es un instrumento espacial.** Dónde te paras decide qué objetos suenan y en qué orden (`interactions.js:25`; en cadena, `:17-20`). Es la idea de Electroplankton: el lugar es la partitura.
3. **Cada sonido tiene una forma.** Piedra, hongo, campanilla, gota y astro se dibujan distinto y se encienden con el color de su nota (`interactions.js:57-65`). Las plantas son luz, no dibujo de planta (`interactions.js:70-81`).
4. **Luz, mano y oído llegan juntos.** El brillo del cubo, el golpe visual y la vibración se programan para cuando la nota llega al altavoz (`journey-pulse.js:66-70`, `:107-110`). Pocos juegos web lo hacen.
5. **Llamada y respuesta.** Cada lugar toca su patrón dos compases antes de pedirlo (`journey-rhythm.js:50-56`). La Cueva canta y tú repites (`journey-games.js:32`). Es enseñar con música, sin texto.
6. **La pista sin palabras.** Tras 4 s quieto, un dedo fantasma arrastra y luego toca en el golpe (`journey-hint.js:2-9`). Captura `00-inicio`: la pantalla de entrada no necesita leer.
7. **El Refugio esconde un Tenori-on.** En la pared, x es el paso del compás y la altura es la nota (`house-model.js:26-28`). Cada sala tiene su propio aire (`house-audio.js:4`). Es el juguete más libre del juego.
8. **Las estrellas se ven como capas.** Once anillos: el lleno suena y late, el punteado falta (`song-stage.js:26-31`, captura `22-cancion`). Es claro sin palabras.

## Lo que falla o falta

Ordenado por gravedad.

1. **El jugador nunca elige una nota.** Todo acierto toca el siguiente grado del tema `[0,1,4,3,2,0]` (`journey-pulse.js:6`, `:96`, `:103`). Fuera de tiempo suena siempre el grado 0 de la voz «pulso» (`interactions.js:53`). En 15–20 minutos de Viaje se repite la misma frase de seis notas cientos de veces. «Tu frase» del final es ese tema con tus pasos, ajustado a la escala (`song-stage.js:63-64`, `:81-83`). Un niño no puede hacer una melodía suya. Solo puede acertar o fallar.
2. **Tu canción se escucha, no se toca.** La pantalla tiene un lienzo sin ninguna escucha de toque. Solo hay «Otra vez» y «Cerrar» (`song-stage.js:74-75`). Los anillos no se pueden callar, aislar ni mover (captura `22-cancion`). La recompensa más musical es pasiva.
3. **Al jugador impreciso no le crece la canción.** Medida con `play-curve.mjs`: el jugador al 60 % consigue 11 ★ a los 60 min y 11 ★ a los 120. Pasa **80,1 min sin capas nuevas** (el modelo marca «NO cumple 12 min»). Igual sin sonido: 81,8 min. ★★ pide 75 % de precisión. Para un niño, la canción se congela en su primera capa.
4. **El juguete libre está cerrado y escondido.** El secuenciador del Refugio solo usa objetos ganados con logros (`house-model.js:5-9`, `houseOwns` en `:25`). Las salas se abren a los 3, 7 y 14 días (`house-model.js:3`, `roomOpens` en `:21`). La captura `tel-libre-refugio` muestra «Refugio · 0 sonando», texto amontonado y un rótulo encima de la instrucción. No se entiende como instrumento.
5. **Hay toques que no suenan.** Dos pulsos con menos de 240 ms de separación: el segundo se descarta. Solo deja una marca gris (`interactions.js:33`, `journey-pulse.js:112-113`). Eso son unos cuatro toques por segundo. Un niño que golpea rápido pierde la mitad sin sonido. Cada toque debería oírse.
6. **El teléfono casi no se usa.** Solo hay toque y `navigator.vibrate` (`journey-pulse.js:65`). No hay inclinación, micrófono ni multitoque (`canvas.js:28`: solo el puntero primario). `vibrate` no existe en Safari de iPhone, así que allí el acierto no se siente en la mano. El tacto directo de los objetos existe pero es solo para pruebas (`body.js:4`, `:33`).
7. **El umbral binario castiga casi acertar.** Captura `33-resultado`: «Ritmo · 74,6 % / 75 % a tiempo», sin ★★. El decimal hace visible la frustración.
8. **La pista se queda en pantalla como un objeto.** El dedo fantasma es un disco gris de 13 px en (W/2+125, H/2+56) (`journey-hint.js:7-8`, `:21`). En `01`, `03`, `04`, `05` y `12` parece una criatura más del campo.

## Recomendaciones

1. **Que la altura del toque elija la nota del tema.** Al acertar, la altura del dedo en la pantalla (o su distancia al cubo) elige el grado dentro de la escala del lugar. Sin cambiar la música ni la armonía: solo `degree` en `journey-pulse.js:96`. El tema sigue como guía si no hay intención. Se guarda en `notes` como ahora. *Bien cuando:* en una prueba de unidad, tocar a tres alturas distintas da tres grados distintos y siempre dentro de la escala; y en el final, «Tu frase» de dos jugadores distintos tiene alturas distintas, no solo ritmos.
2. **Tu canción, tocable.** En `song-stage.js`, tocar un anillo encendido lo calla o lo aísla durante un compás, sin cambiar su contenido. Tocar el centro lanza el pulso del cubo sobre la canción. *Bien cuando:* el lienzo `#songStage canvas` tiene escucha de toque; una prueba de navegador callando «Lago» ve su pulso a 0 en `songStageState().pulses` mientras los otros siguen > 0.
3. **Ningún toque mudo.** En `interactions.js:33`, en vez de descartar el pulso, tocar una nota suave de la voz del lugar en la siguiente semicorchea (la cola ya limita a 4 por paso). *Bien cuando:* diez toques a 8 Hz producen diez eventos de sonido programados (sin `journeyPulseDropped` sin sonido) y nunca más de 4 por semicorchea.
4. **Una capa para quien juega, no solo para quien acierta.** Que completar un lugar con al menos un 40 % a tiempo dé una variación audible de su capa (otra octava u otro timbre), sin tocar los umbrales de ★★ y ★★★ que Jay fijó. Va en `song.js` (`tierStep`) y en `song-stage.js:72-73`. *Bien cuando:* en `play-curve.mjs`, el perfil del 60 % baja su mayor hueco «sin nuevas capas» de 80 min a menos de 12.
5. **El Refugio como primer juguete.** Abrir desde el día 1 una pared del «Eco» con tres objetos básicos ya colocados que suenan (`house-model.js:3`, `:5-9`). Reducir el texto a una frase: «Mueve un objeto. Escucha.». *Bien cuando:* un guardado nuevo entra al Refugio y ve «3 sonando», no «0 sonando»; y en `tel-libre-refugio` no hay rótulos encima de otros textos.
6. **El teléfono como instrumento (opcional).** Inclinar el teléfono abre o cierra el filtro de la voz del cubo. Así es expresión, no puntuación. Con permiso explícito en Ajustes y apagado por defecto. Va en `canvas.js`, junto a un nuevo `S.tilt`. *Bien cuando:* con la inclinación apagada, el comportamiento es idéntico (pruebas actuales en verde); con ella encendida, una prueba de unidad mapea −30°…30° a una frecuencia de corte dentro de un rango fijo.

## Opinión en una frase

Kubono ya cumple lo más difícil, que nada suene mal y que luz, mano y oído lleguen juntos; pero todavía pide al jugador que acierte una música hecha, en vez de dejarle hacer la suya.
