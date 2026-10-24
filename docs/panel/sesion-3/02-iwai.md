# Tercera sesión · Toshio Iwai (simulación)

> Simulación de su mirada de diseño (la música como juguete, cada sonido deja una forma, nunca suena mal). No es su opinión real. Versión 2.3.0-alpha.167. Solo Jay ha jugado. No escuché nada en un teléfono: juzgo código, capturas de `3/` y tres capturas mías en `3-extra-ip/`.

## Notas

| Eje | Sesión 2 | Hoy | Por qué |
|---|---|---|---|
| Visual | 6,5 | 7 | El cubo se lee, el oro queda encima del gris y la onda a tiempo es dorada. El mundo sigue lleno de glifos grises diminutos. |
| Audio | 8,5 | 8,5 | El lugar canta antes de pedir. Tu canción es la música del mundo. Pero el canto usa una voz genérica. |
| Creatividad | 8 | 8 | El modo Libre existe, pero se acaba solo. Tu canción sigue sin tocarse. |
| Sensación | 6,5 | 7 | Calibración sin menú, el brillo dorado siempre y el cubo Vibri. Sigue siendo un dedo. |
| Cohesión | 6,5 | 7 | El tema crece con las ★ y el final usa tus notas. Las ★ siguen mandando. |
| Pulido | 6,5 | 7 | Lugares ya no se contradice. Queda texto en el Libre y en los avisos del narrador. |
| **Media** | **7,1** | **7,4** | |

## Qué mejoró de verdad

- **El ritmo se oye antes de tocarse (mi acción 2).** El lugar canta su patrón dos compases desde el «1» (`src/journey-rhythm.js:29`, `:54`). Las frases «Aquí el ritmo es…» siguen en la tabla (`journey-rhythm.js:8-14`), pero ya nadie las dice: no encuentro quién lea `say`.
- **La onda a tiempo es dorada (parte de mi acción 3).** `src/interactions.js:26` usa `w.beat` para el color, la opacidad y el grosor.
- **El oro ya no se apaga.** El gris va debajo (`src/world-sheet.js:156-157`) y el cubo se dibuja 1,6× (`src/render.js:185`). En `3-extra-ip/a-cerca-portal.png` el portal y su columna son dorados.
- **Tu canción ya es esta música.** `song-stage.js` programa cada capa en el acorde del mundo y crece con las ★. El final mete tus notas, una por compás, y luego el tema. Eso es lo que pedía: imagen y música, una sola cosa.

## Qué sigue faltando o salió mal

- **El Libre no es un juguete.** Solo se abre en lugares completos (`src/places.js:66`) y termina cuando el juego llega a su objeto dorado: `finish` te devuelve al portal (`places.js:83`). Sin barra, sí, pero con final. Un juguete no se termina.
- **Texto dentro del Libre.** En `3-extra-ip/c-libre-llanura.png` sale «Toca a tiempo cerca de lo que brilla: se pega.» (`src/journey-stick.js:59`). Puede ser un efecto de `?anillo=1`: una partida real lo habría visto en el Viaje (`places.js:71` guarda `hinted`). No pude verificarlo con una partida real.
- **Tu canción sigue bajo cristal (mi acción 1, no hecha).** Solo «Otra vez» y «Cerrar» (`src/song-stage.js:59`). No hay `pointerdown` en los anillos ni capas silenciables.
- **El canto no tiene la voz del lugar.** `sing` toca un hat y la misma nota, raíz o quinta (`journey-rhythm.js:54`). Las Ruinas y los Faros cantan igual. Pedí que el lugar cantara con su voz.
- **No todo sonido deja forma.** Sin registro de «un sonido, una forma». La chispa salvaje suena en cada pulso y solo dibuja un anillo cuando la tocas (`src/wild.js:45`, `:55`).
- **Un solo dedo.** No hay multitáctil ni micrófono en `src/` (solo `pwa.js:4` bloquea el pellizco).
- **El narrador sigue hablando en el mundo.** `src/achievements.js:14` lanza un aviso con su frase en el Mundo libre durante 120 s. La decisión era «solo en la tarjeta y la Bitácora».

## Mis tres acciones

1. **Libre sin final, y Tu canción que se toca.**
   - *Qué:* el Libre no termina. Al llegar al objeto dorado, el juego se vacía y vuelve a empezar; sales tú con el menú. En Tu canción, tocar un anillo encendido quita o pone su capa en el «1» siguiente.
   - *Cómo:* en `places.js:83`, con `r.free`, reinicia el estado del juego (`j[key]={hinted:true}`) en vez de `back(r.from)`. En `song-stage.js`, `pointerdown` sobre `ringLayout`, y un `Set` `muted` en memoria que `stageEvents` consulta.
   - *Bien cuando:* una prueba juega tres objetos dorados seguidos en Libre sin salir, y otra quita y pone una capa que entra en el «1».
2. **Cada lugar canta con su voz.**
   - *Qué:* el canto inicial usa el timbre de la capa del lugar, no un hat genérico.
   - *Cómo:* en `journey-rhythm.js:54`, pide a `song.js` la voz de `SONG_LAYERS[id]` (`tierStep` del paso) y tócala en los pasos del patrón.
   - *Bien cuando:* con los ojos cerrados se distinguen los once cantos en un render offline, y el pico no pasa de 0,6.
3. **Un sonido, una forma.**
   - *Qué:* todo lo que suena por el jugador dibuja algo con el color del lugar; fuera de tiempo, pequeño y gris.
   - *Cómo:* un registro en `interactions.js` alimentado por `runtime.soon(...,'player')`. Que la chispa salvaje deje un anillo en cada nota que canta.
   - *Bien cuando:* un contador de sonidos del jugador y de formas dibujadas coincide al 100 %.

## Decisiones de Jay

- **Umbral de ★★:** mejorar tu marca. Premia escuchar mejor, no llegar a una cifra. Si hace falta un número, 75 %: el modelo da 28 ★ en 2 h al 75 % y la canción nunca calla más de 11 min (`play-curve.mjs`). Con 85 %, ese jugador pasa 84 min sin que crezca su canción.
- **Festival:** solo el Viaje. Es lo que mejor sabe ser juguete y no pide estrellas. Pero añadiría el Libre de un lugar al final, sin cifras: que el jurado toque sin meta un minuto.
