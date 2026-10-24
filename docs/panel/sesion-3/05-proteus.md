# Panel 05 · Ed Key y David Kanaga (Proteus) · tercera sesión, 24 de octubre

*Simulación de su mirada de diseño. No es su opinión real. Versión 2.3.0-alpha.167. Solo Jay ha jugado. No hubo escucha en un teléfono: el audio lo juzgo por el código y por `ringSounds()` en una sesión automática (`3-extra-ip/`).*

## Notas

| Eje | Sesión 2 | Hoy | Por qué |
|---|---|---|---|
| Visual | 6,5 | 7 | El oro ya no se apaga y la columna de luz se ve de lejos. Entre portales sigue el mismo campo de glifos. |
| Audio | 8,5 | 8,5 | Paneo, faro desde el Refugio y chispa que canta. Pero se oye un portal a la vez. |
| Creatividad | 7,5 | 7,5 | La chispa salvaje sigue siendo un recado. |
| Sensación | 7 | 7 | Calibración y canto previo ayudan. El paseo no ha cambiado. |
| Cohesión | 6 | 6,5 | La canción es la música del mundo. Tras el Viaje siguen los avisos y la burla. |
| Pulido | 6,5 | 7 | Gris bajo el oro, Lugares limpio. Tres avisos de texto en la exploración. |
| **Media** | **7,0** | **7,3** | |

## Qué mejoró de verdad

- **El oro sobre el gris (lo pedimos).** El gris se pinta antes de portales y chispa (`src/world-sheet.js:156-157`). En `3/23-salvaje.png` la chispa es dorada; en `3-extra-ip/a-cerca-portal.png`, el portal y su columna también.
- **El anillo ya no calla del todo.** El siguiente portal del camino suena en el «3» con suelo de ganancia hasta 9 600 px (`src/places-ring.js:58-60`). Desde el Refugio lo medí: `v≈0,019`, paneo 0,85, hacia el Jardín.
- **Las voces vienen de su lado.** `withPan` con `StereoPannerNode` (`src/spatial.js:43`). Lo usan los portales (`places-ring.js:112`) y la chispa (`src/wild.js:58-59`).
- **La chispa canta.** En cada pulso, una nota del acorde, con suelo (`wild.js:16`). La flecha sale solo sin sonido (`wild.js:54`).
- **Tu canción nace de la música que suena.** Ya no es un house aparte: las capas entran sobre el acorde del mundo (`song-stage.js`). Eso es Dyad.

## Qué sigue faltando o salió mal

- **La chispa no se busca con el oído.** Aparece a 150 px delante del cubo (`WILD_AHEAD`, `wild.js:11`, `:40`). Con una pantalla de 390 px ya la ves. El oído no hace falta.
- **Sigue siendo un recado con texto.** «Una chispa salvaje.», «Se fue.», «Atrapada · +15 ✦» (`wild.js:40`, `:42`, `:47`). Tiene temporizador de 30 s y no te sigue: al atraparla, se borra (`spark=null`). No suma su voz a la tuya.
- **El anillo no es un paisaje.** En el «1» suena solo el portal más cercano, sin suelo (`near²`, `places-ring.js:116-117`). En el «3», solo el siguiente. Los otros nueve portales abiertos callan. En el centro no se oye el acorde de tus lugares.
- **Tras el Viaje, lo mismo.** `journey-finale.js:55` pasa a «libre». Luego vienen «Se abre el Mundo libre.» y un aviso de 60 s sobre ✦ (`journey-finale.js:56`, `:63`). Jay decidió no hacerlo tranquilo; lo respetamos. Pero hay un fallo: el narrador debía hablar solo en la tarjeta y en la Bitácora. En el Mundo libre aún lanza su frase en un aviso de 120 s (`src/achievements.js:14`). «El Mundo no estaba listo. Tú tampoco» sigue saliendo así (`narrator.js:8`).
- **Entre portales no hay lugar.** `3-extra-ip/b-refugio.png`: junto al Refugio no hay hito ni horizonte.
- **Once lugares, una plantilla.** El canto previo es igual en todos: hat y raíz o quinta (`journey-rhythm.js:54`). Las Ruinas no suenan a ruina antes de empezar.

## Nuestras tres acciones

1. **El anillo como acorde.**
   - *Qué:* cada portal abierto suena en su paso del compás, desde su dirección, siempre.
   - *Cómo:* en `places-ring.js:114-117`, recorre todos los `spots()` abiertos. Paso = `index` de `PORTAL_NOTES` llevado a semicorchea. Ganancia `max(.012, near²)·.09` y un máximo de cuatro voces por compás, las más cercanas primero.
   - *Bien cuando:* un render offline del Refugio a un portal muestra todos los niveles sin cortes, el pico no pasa de 0,6 y, con los ojos cerrados, 3 de 4 personas señalan el portal.
2. **La chispa se encuentra con el oído y se queda.**
   - *Qué:* nace lejos y fuera de pantalla, y no hay texto. Al atraparla, te sigue hasta el borde de la región como voz extra.
   - *Cómo:* en `wild.js:40`, nace a 500–800 px y en un ángulo al azar, no delante. Quita los tres `toast`; el +15 ✦ va en silencio a la Bitácora. Tras `caught`, guarda `follower={until:región}` y sigue llamando a `musicStep` con su nota.
   - *Bien cuando:* cero avisos de texto en la exploración y, con la pantalla oscura, la mediana del bot que sigue el paneo la encuentra en menos de 45 s.
3. **El narrador fuera del mundo, como se decidió.**
   - *Qué:* en el Mundo libre, el logro deja un punto en el menú; la frase solo en la Bitácora.
   - *Cómo:* en `achievements.js:14`, el aviso sin `narratorLine`, o solo `has-new` en `bMenu`. Retira el aviso de 60 s de `journey-finale.js:63` y deja la marca de Tu cubo.
   - *Bien cuando:* una prueba recorre 5 min de Mundo libre tras los créditos y no ve ninguna frase del narrador en pantalla.

## Decisiones de Jay

- **Umbral de ★★:** mejorar tu marca. Una estrella por escuchar mejor que ayer no te pone un examen delante. Si Jay quiere una cifra, 75 %: al 85 %, el jugador del 75 % pasa 84 min sin que crezca su canción (`node scripts/play-curve.mjs`). Eso es silencio que nadie eligió.
- **Festival:** solo el Viaje y su final. Es la obra cerrada. El anillo, la tienda y las 33 ★ son otro tipo de tiempo, que no cabe en diez minutos de jurado.
