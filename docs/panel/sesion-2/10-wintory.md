# 2-10 · Austin Wintory (simulación) · segunda sesión, 24 de octubre

> Simulación respetuosa de su filosofía conocida (un tema que crece con el jugador, la música como estructura). No es su opinión ni contiene citas suyas. Principios y fuentes: `10-wintory.md`.

## Qué mejoró desde el 22 de octubre

- **Hay tema.** `THEME` en `src/journey-pulse.js`: seis notas por grados, dos compases. Se guarda como dato y se reharmoniza con la escala del lugar (`themePitch`). Es exactamente lo que pedí.
- **El jugador lo toca.** Cada pulso a tiempo da la siguiente nota del tema, no un paso de escala (`judge()`). Al cerrar la frase hay vibración doble y destello.
- **El cierre sale de la música que suena** (`journey-victory.js`, F13). Filtro que se cierra, medio tiempo de silencio real y, en el «1», la misma música con la capa del lugar y el tema encima. Ese silencio es oficio: el clímax se gana con un hueco.
- **El final del Viaje cuenta tu viaje.** `journey-finale.js` toca hasta seis de tus notas por capítulo, con tu ritmo, y luego el tema dos veces, la segunda una quinta arriba, en la voz de chelo (`playCello`). Es la forma de «Apotheosis».
- **El mundo reconoce el tema.** `theme-key.js`: completarlo junto a un hito hace que el hito responda. Es la conversación que pedí fuera del Camino.
- **La canción se ve.** Once anillos, lleno = ganado (captura 22). Se entiende qué falta sin palabras.

## ¿El tema crece de verdad hasta las 33 ★?

No. Se **repite**; no se **desarrolla**.
- El tema es el mismo en todas partes: mismas seis notas, mismo ritmo. Solo cambia la escala. No hay fragmento, ni inversión, ni aumentación, ni reharmonización de acordes.
- Cada seis aciertos suena entero. Además suena en cada cierre de lugar (`journey-victory.js`, línea 40). En una ronda de 2:30 se oye muchas veces. Se convierte en un jingle de «nivel completado».
- **22 de las 33 ★ no suenan.** `song-stage.js` enciende una capa con `stars[id][0]`. ★★ y ★★★ no cambian nada en la música.
- **El final de las 33 ★ es más pequeño que el del Viaje.** Once capas entran una por compás: 11 + 4 compases, unos 30 s (`FINAL_ENTRY_BARS=1`, `FINAL_TAIL_BARS=4`). No están tus notas. No está el chelo. El tema solo aparece dentro de la capa de Faros, en onda cuadrada a ganancia .035 (`song.js`). El clímax del prólogo supera al del juego.
- **«Tu canción» es otra pieza.** House a 120 BPM en La mayor, fija (`SONG_BPM`, `SONG_CHORDS`). El mundo suena en la tonalidad y el tempo de cada género. No es el mundo transformado; es un tema aparte que se ensambla.
- **El solista cambia de voz.** El pulso usa el instrumento del lugar (`docs/VIAJE.md`, «El tema en tus manos»); los cierres usan once timbres (`VICTORY_LEADS`). El chelo solo aparece en el final del Viaje y en las llaves. No eres el chelo; eres once instrumentos.
- **La Cueva desperdicia su forma.** `journey-echo.js` pide repetir patrones de 2 a 5 pasos al azar. Es la llamada y respuesta perfecta para el tema, y no lo usa.

## Notas

| Criterio | 22 oct | 24 oct | Por qué |
|---|---|---|---|
| Visual | 7 | 7,5 | Los anillos de la canción y el color ganado dan forma visible a la música. |
| Audio | 7,5 | 8 | Tema, silencio antes del drop y cierre en la música viva. Falta desarrollo. |
| Creatividad | 8 | 8 | Ritmos por lugar y la Cueva que canta; la canción por capas es convencional. |
| Sensación | 6 | 7 | Tocar a tiempo da una nota del tema: se siente tuyo. Nadie más lo probó. |
| Cohesión | 5 | 6,5 | El tema cruza Viaje, cierres, llaves y Faros. La canción final vive en otro tempo y tono. |
| Pulido | 6,5 | 7 | Mezcla sin saturar en los renders; final de 33 ★ corto y sin créditos con música propia. |

Media: **7,3** (antes 6,7).

## Mis 3 acciones prioritarias

1. **Que las estrellas cambien el tema, no solo lo añadan.**
   - Qué: tres formas por lugar. ★ = fragmento (dos primeras notas). ★★ = tema entero. ★★★ = variación propia del lugar (Ruinas en acordes, Lago a contratiempo, Vacío en aumentación).
   - Cómo: en `song.js`, `layerEvents(id, tier)` añade a cada capa su forma del tema. `song-stage.js` lee el número de ★ del lugar, no solo `stars[id][0]`. Datos nuevos, sin tocar RNG ni guardados.
   - Criterio: renders de «Tu canción» con 5, 16 y 33 ★ claramente distintos. Prueba de lógica: cada nivel de ★ cambia los eventos de su capa.

2. **Rehacer el final de las 33 ★ como apoteosis.**
   - Qué: más largo y más alto que el final del Viaje.
   - Cómo: guardar por lugar tus mejores notas a tiempo (campo nuevo normalizado, como hace `journey-finale.js` con los capítulos). Orden: tus frases de los 11 lugares; un compás de silencio; el tema en `playCello` sobre las 11 capas, una quinta arriba y de vuelta a casa; un ritardando final. Reutilizar `finaleScore`.
   - Criterio: dura 60 s o más. En el render, el chelo queda por encima de las capas. Se oyen notas del jugador de al menos 8 lugares.

3. **Racionar el tema y darle la Cueva.**
   - Qué: el tema completo es un acontecimiento, no un sonido de acierto.
   - Cómo: en los lugares, el pulso a tiempo toca la capa del lugar; el tema solo en la frase completa y en el cierre. En `journey-echo.js`, la Cueva canta prefijos del tema (2, 3, 4, 5 notas: coincide con `ECHO_MIN`/`ECHO_MAX`). El último eco, en Maestro, es el tema entero. Una sola voz solista: `playCello` para el tema en todas partes.
   - Criterio: como máximo cuatro enunciados completos del tema por ronda (contador en el estado). Quien gana la Cueva lo ha cantado entero con sus manos.

## Decisión que solo Jay puede tomar

¿«Tu canción» sigue siendo un house fijo en La mayor a 120 BPM, o se reescribe desde el tema, con un músico coautor si hace falta? Lo primero se oye ensamblado. Lo segundo hace que las 33 ★ suenen a tu viaje.
