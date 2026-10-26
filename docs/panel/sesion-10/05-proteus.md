# 05 · Mirada Proteus (Ed Key y David Kanaga)

Simulación de la mirada de diseño de Ed Key y David Kanaga a partir de su obra pública. No es su opinión real.

Versión **2.3.0-alpha.207** (commit `2e7f9d1`).

**Qué revisé.**
- Código: `src/wild.js`, `spatial.js`, `world-sheet.js`, `alive.js`, `quietud.js`, `expansion-music.js`, `ambience.js`, `ambient-score.js`, `world-light.js`, `world-light-model.js`, `world-weather.js`, `world-happenings.js`, `world-music.js`, `world-visibility-model.js`, `living-ecology.js`, `journey-chapters.js`, `audio.js` (planificador, l. 230–340), `render.js` (bucle de dibujo y criaturas), `index.html`.
- Guías: `docs/MUNDO.md`, `docs/UNIVERSO.md`, `docs/VIAJE.md`.
- Capturas (16): 00 a 05, 10, 11, 12, 13, 15, 20, 22, 23, 33 y 34.
- Modelo: `node scripts/play-curve.mjs`.

No oí el audio. No jugué con las manos. Lo que digo del sonido sale del código.

## Contexto

Kubono es un cubo pequeño que camina por un universo negro que suena. Cada región tiene su música, su color y su forma, y se funden en los bordes. Encima hay un juego de ritmo: tocar a tiempo da estrellas, chispas y capas de Tu canción. Quiere ser dos cosas a la vez: un paseo que se escucha y un juego que se gana. Hoy el paseo existe en el código, pero el juego habla más alto.

## Notas

| Área | Nota | Por qué | Evidencia |
|---|---|---|---|
| Visual | 6,5 | Cada región tiene firma propia y legible; las criaturas en glifos grises y los discos de Llanura parecen ruido o botones. | Capturas 02 (anillos del Lago), 03 (racimos), 12 (malla), 13 (haz del faro); 01 (discos con «+» y rombos); glifos grises en 04, 05, 12. |
| Audio | 7 | Por código: el mundo cambia de música al andar, el ambiente respira con el pulso y canta en la tonalidad. Pero las cosas cantan poco. No oído. | `render.js:206`, `ambience.js:5-10`, `world-weather.js:30-32`; `ambient-score.js:4`. |
| Creatividad | 7,5 | Quietud que transforma el lugar, huellas que el mundo recuerda, tormentas que viajan con el viento, un Vacío donde las criaturas repiten tus notas. | `quietud.js:20-42`, `alive.js:7-24` y `51-53`, `journey-chapters.js:20`. |
| Sensación | 6 | No jugado. Por código y capturas, la exploración tiene reloj: chispa salvaje de 30 s, avisos de texto, resultados con décimas de porcentaje. | `wild.js:11`, `wild.js:42`; captura 33 («74,6 % / 75 %», «8 logros nuevos»). |
| Cohesión | 6 | Muchos sistemas sueltos. Tres relojes distintos (día de 10 min, hora real, estaciones semanales). 86 funciones de dibujo y unas 20 de música por paso. | `world-visibility-model.js:8`, `world-light-model.js:4`, `alive.js:34`; `grep runtime.draw* render.js`: 86; `audio.js:302-336`. |
| Pulido | 6,5 | Capturas sin errores de página y tipografía limpia. Pero 20-anillo es igual a 10-jardín, y el resultado deja al jugador a 0,4 puntos de la ★★ sin decir qué oyó. | `manifest.json` (`pageErrors: []`); capturas 10, 20 y 33. |

**Media: 6,6.**

## Lo que funciona

- **El mundo suena al recorrerlo.** Al acercarse a otra región, su música se mezcla con la tuya hasta la mitad (`render.js:206`, `audio.js:269-283`). Cruzar es oír el cambio antes de verlo.
- **El ambiente está en el tiempo y en la tonalidad.** Un bus común respira con cada pulso (`ambience.js:5-8`). Los insectos nocturnos cantan notas de la escala que suena (`ambience.js:10`, `world-weather.js:32`). Nada chirría fuera de la música.
- **Tocar el mundo responde en el pulso.** Tocar una criatura la hace cantar en el siguiente pulso; si tiene pareja cerca, la pareja contesta un compás después (`render.js:357-359`).
- **Quedarse quieto se premia con cambios, no con puntos (casi).** A los 20 s sube el color, a los 50 s entra una voz, a los 90 s llegan visitas, a los 140 s la música gira (`expansion-music.js:31-38`). Volver a un lugar escuchado empieza más adelante (`expansion-music.js:42`). Es la idea más cercana a escuchar antes de actuar.
- **El Camino se construye por voces.** Cada cristal añade una voz hasta que el décimo abre el Mundo (`audio.js:263-264`). Captura 00: casi vacío, un punto, una línea. Bien.
- **El Vacío deja espacio.** La música no pasa de 0,1 de energía y las criaturas repiten tus notas (`journey-chapters.js:20`). Captura 05: el cubo solo con su luz.
- **El mundo recuerda.** Huellas cada 160 px, hasta 4000 (`alive.js:51-53`, `alive.js:87`). Tormentas que viajan con el viento del día y se oyen antes de verse (`alive.js:7-24`, `audio.js:253`).
- **Señales sin sonido.** La flecha de la chispa salvaje solo aparece si juegas en silencio (`wild.js:54`). El oído es lo primero.
- **Firmas de región claras.** Lago con anillos (02), Bosque con racimos (03), Tormenta con plasma (04), Cristales con malla (12), Faros con haz (13). Se distinguen en un vistazo pequeño.

## Lo que falla o falta

Ordenado por gravedad.

1. **La chispa salvaje no se busca con el oído: aparece en pantalla y se anuncia con texto.** Nace a 150 px delante del cubo (`wild.js:11`, `WILD_AHEAD=150`; `wild.js:40`). La pantalla mide 390×844 a escala 1:1 (`wild.js:49`), así que siempre se ve al nacer. El radio de escucha de 900 px (`wild.js:15`) casi no se usa. Además dice «Una chispa salvaje.» (`wild.js:40`) y «Se fue.» (`wild.js:42`). La captura 23 lo confirma: espiral dorada a ~130 px del cubo. Su comentario dice «se encuentra por el oído» (`wild.js:13`); el código no lo cumple. Y tiene reloj de 30 s: la exploración pasa a ser una cacería.
2. **Las cosas del mundo cantan poco; manda el acompañamiento.** Del entorno suena como mucho un solista por compás, en un solo paso, y nunca en el cuarto compás (`ambient-score.js:4`). Las criaturas que te siguen cantan una vez cada cuatro compases (`audio.js:322`). Son unas 4 notas del entorno cada 4 compases si no tocas nada. La densidad de voces no crece al juntarse cosas; crece la base electrónica. Visualmente pasa igual: hay 15–30 criaturas en pantalla (capturas 02, 04) y casi todas callan.
3. **Las estaciones existen pero no pasan delante de ti.** Cambian una vez por semana real y por continente (`alive.js:33-36`). En una sesión no ves llegar el otoño. Nadie las nombra: `MU.season` solo se lee en `audio.js`, `alive.js`, `vida.js` y `living-ecology.js`. Su efecto es tempo de −4 a +3 BPM, brillo del filtro y 26 partículas (`alive.js:27-32`, `alive.js:76`). El paso del tiempo que sí se ve es un día de 10 minutos (`world-visibility-model.js:8`) mezclado con la hora real (`world-light-model.js:4`). Tres relojes sin un relato común.
4. **Lo que pasa solo es mudo.** Estrellas fugaces, festival de luces y brisa son «decorativos: sin premios, sonidos ni texto» (`world-happenings.js:4`). Es justo el momento que debería sonar. El mundo hace algo raro y la música no se entera.
5. **La quietud explica lo que deberías oír.** Cada etapa lanza un aviso: «Voz del lugar · Entra una voz nueva.» (`quietud.js:22`, `expansion-music.js:33-37`). Si la voz entra, el texto sobra. Además termina en una caja regalo y un logro (`quietud.js:26-28`): la escucha se convierte en otro premio.
6. **Los resultados hablan de porcentajes, no de música.** Captura 33: «Ritmo · 74,6 % / 75 % a tiempo», «+102 ✦ · récord», «8 logros nuevos». Hay 80 logros distintos en el código (`grep unlock('…')`: 80). Lo último que se lee al salir de un lugar es una cuenta, no lo que sonó.
7. **Algunos objetos parecen interfaz.** Captura 01: discos grises grandes con «+» y rombos, del mismo tamaño que botones. Captura 02: flores blancas en discos. Compiten con el cubo pequeño y con el botón gris fijo de la derecha.
8. **Demasiados sistemas a la vez.** El planificador llama a unas 20 funciones de música por paso (`audio.js:302`, `audio.js:325-336`) y el render a 86 funciones de dibujo. Cada una es razonable. Juntas cuesta saber qué voz es de qué cosa.

Límite: no oí nada. Puede que en el teléfono la mezcla ya deje oír al entorno; el código sugiere que no.

## Recomendaciones

1. **Que la chispa salvaje se oiga antes de verse.** En `wild.js:40` hacerla nacer fuera de pantalla (por ejemplo a 500–700 px, a un lado del rumbo) y quitar el aviso «Una chispa salvaje.» cuando hay sonido. Mantener la flecha solo sin sonido (`wild.js:54`). Ampliar o quitar el límite de 30 s mientras se acerca.
   *Bien cuando:* con sonido, la chispa nace fuera de los 390×844 en el 100 % de los casos y sin texto; en `wildState()` la distancia inicial media es ≥ 450 px; una persona la encuentra sin flecha en una prueba guiada.
2. **Densidad de voces por cercanía, sin tocar la música.** En `ambient-score.js:4` permitir un segundo y tercer solista cuando hay 3 o más fuentes a menos de 280 px, con la misma frase y la misma tonalidad, a ganancia baja vía `spatial.js:2`. Es presentación del entorno; la base electrónica no cambia.
   *Bien cuando:* parado junto a un grupo de 5 criaturas suenan ≥ 8 notas del entorno cada 4 compases (hoy ≈ 4); alejado, vuelve a ≤ 4; el pico de salida no sube más de 1 dB.
3. **Que los sucesos raros suenen.** En `world-happenings.js` dar a cada suceso una voz suave ya existente (`runtime.pluck` en notas de `chordTones`), pasada por `ambienceBus`. Estrella fugaz = tres notas descendentes; festival = arpegio lento.
   *Bien cuando:* cada suceso registra al menos una nota en la tonalidad actual; ninguna supera el nivel del ambiente (`AMBIENCE_LEVEL`); con sonido apagado no cambia nada.
4. **Un ciclo de estaciones que se vive en una sesión.** En `alive.js:34` sumar al ciclo semanal una «estación de sesión»: avanzar una estación cada 10–15 min de caminar, con fundido de partículas y brillo. Sin nombrarla con texto.
   *Bien cuando:* en 45 min de paseo se ven al menos tres estaciones distintas; el cambio de partículas tarda ≥ 20 s; no aparece ningún aviso; las semillas y mapas no cambian.
5. **Quietud sin carteles.** En `quietud.js:22` mostrar el aviso solo la primera vez de cada etapa (o nunca, si el sonido está activo) y dejar que el anillo de progreso (`quietud.js:71`) y la voz digan el resto.
   *Bien cuando:* tras la primera vez, una sesión de 5 min de quietud muestra 0 avisos de texto y conserva todas sus etapas sonoras.
6. **Resultados que recuerdan lo oído.** En la tarjeta de resultado, sobre las cifras, una línea con la frase que tocaste (ya guardada para el cierre, `journey-finale.js`) y un botón para oírla. Redondear el ritmo a enteros cuando faltan menos de 1 punto.
   *Bien cuando:* la primera línea de la tarjeta nombra la frase y se puede oír; no aparecen decimales en el porcentaje; el número de líneas de premio no crece.

## Opinión en una frase

Kubono tiene un mundo que ya sabe sonar, pero todavía le pone reloj, carteles y premios a los momentos en que solo debería dejarte escuchar.
