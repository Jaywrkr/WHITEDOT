# 2-07 · Conrad Roset, segunda lectura (24 oct)

> Simulación respetuosa de su filosofía conocida (ver `07-roset.md`). No es su opinión real. Sin citas.

Capturas propias en `panel/rw/` (navegador sin marca de automatización, 390×844 y 1280×800).

## Qué mejoró desde el 22 de octubre

- **El papel en blanco existe.** Partida nueva real (`rw/m-new-01s.png`): negro, una línea, el cubo, dos cristales y «Pulso». Sin cuenta, sin cifras, sin ventana. Es el Camino que pedí.
- **Hay formas grandes.** Llanura (`01`) y Lago (`02`) tienen discos y flores que pesan. Ruinas (`14`) es un anillo de ocho columnas. Cristales (`12`) es una malla triangular. Por fin hay composición.
- **El color se gana, en código.** `world-sheet.js` desatura el mundo (`saturate(.12)`) hasta que completas el tema a tiempo (`journey-pulse.js:66`).
- **«Tu canción» (`22`) es mi plan de color.** Ámbar, cian, verde, violeta y blanco en anillo, sobre un cielo que se dora. Es la única pantalla que cuenta el progreso sin palabras.
- **Cada nota deja marca.** La Línea guarda el oro de cada pulso a tiempo.

## Qué sigue mal

- **El color ganado casi no se ve.** Recuperé el color a mano (`rw/m-llanura-color.png`, `rw/m-lago-color.png`). Aparecen motas magenta, rojas y naranjas sueltas. No hay un tono. La Llanura no es ámbar; el Lago tiene elipses rojas. La luz del bioma es un degradado al 5–12 % (`world-sheet.js:22`). Se gana el color y no se celebra.
- **El mundo tras el Viaje sigue gris.** `?anillo=1` deja `journey.colors` vacío (`rw/d-anillo.png`). Las 11 puertas doradas no entran en el encuadre. Lo «ganado» no está en pantalla.
- **Los once lugares son once grises.** De `10` a `15` todo es blanco sobre negro con glifos de 10 px. Cristales debería brillar; Faros, ser dorado. Solo los distingue la geometría.
- **El Viaje habla.** Cada capítulo tiene dos rótulos: «Toca a tiempo junto a una flor…», «La flor dorada llegó: tócala a tiempo» (`sayOnce`/`chapterToast` en `journey-*.js`). Once veces la misma fórmula. Ruinas lo muestra en escritorio (`rw/d-ruinas.png`).
- **La capa antigua sigue viva.** `00-inicio.png` (navegador automatizado) enseña el HUD de «Día 1 · Era I · 0 chispas» y la ventana «Rompe diez para entrar al Mundo». Un jurado con herramientas de captura vería eso. Y el verbo ya no es romper.
- **El sistema crece otra vez.** Chispa salvaje, remezcla diaria, 33 ★, tienda de 17 030 ✦. El 22 pedimos una sola cosa delante.

## Notas

| Criterio | 22 oct | Hoy | Por qué |
|---|---|---|---|
| Visual | 6 | 6,5 | Hay masas y anillos; el color ganado es ruido de motas, no una mancha. |
| Audio | 8 | 8 | No lo oigo; el cierre de cada lugar (F13) es la idea correcta. |
| Creatividad | 7,5 | 8 | Once verbos con ritmo propio y «Tu canción» como mapa de color. |
| Sensación | 5,5 | 6,5 | Pulso a tiempo, vibración y Línea; el cubo aún no se deforma. |
| Cohesión | 4,5 | 6,5 | El Viaje tiene arco; la economía vuelve a pedir atención fuera de él. |
| Pulido | 6 | 6,5 | Inicio limpio; rótulos repetidos y estado `?anillo` incoherente. |
| **Media** | **6,3** | **7,0** | |

## Mis 3 acciones

1. **Un tono por lugar, a escala de pantalla.**
   - Qué: al recuperar el color, el lugar se tiñe de su tono de `docs/VIAJE.md` y nada más.
   - Cómo: en `world-sheet.js`, sustituir el degradado al 5–12 % por un lavado del tono del bioma (`placeColor`) al 18–30 % sobre el 25 % central, con `globalCompositeOperation='soft-light'`. Que los glifos y decorados del bioma usen ese mismo tono en vez de su paleta aleatoria. Que `chapter-test.js` siembre `journey.colors` de los cinco capítulos con `?anillo=1`.
   - Criterio: en una captura de cada lugar recuperado, ≥ 20 % de píxeles no negros cae a ±20° del matiz del tono (script sobre PNG). Gris antes, color después, sin leer nada.
2. **Cada pulso a tiempo deja una mancha.**
   - Qué: acuarela sobre negro; la música se ve donde se tocó.
   - Cómo: en `journey-pulse.js`, al juzgar «a tiempo», empujar una marca de mundo `{x,y,tono,radio}`; `world-sheet.js` la dibuja con `createRadialGradient` y `'lighter'`, y la seca en 8 compases. Máximo 24 manchas. Con movimiento reducido, sin expansión. Antes de recuperar el color, manchas grises.
   - Criterio: tras 16 pulsos a tiempo, la captura sin HUD muestra el recorrido tocado como una mancha continua.
3. **Un Viaje sin palabras.**
   - Qué: quitar los dos rótulos por capítulo durante el Viaje.
   - Cómo: en `journey-games.js`, `sayOnce` y `chapterToast` no muestran nada si `journeyQuiet()`. Sustituirlos por un gesto: un cubo fantasma que hace el movimiento una vez, y la llegada del objeto dorado con su sonido y un anillo dorado. El texto queda en «Guía» del menú. Retirar o reescribir `#mHelpC` (`index.html`): ni «Rompe» ni «.simple».
   - Criterio: recorrido de los cinco capítulos en modo Viaje con 0 rótulos; Luca termina la Llanura sin leer.

## Decisión de Jay

¿El Viaje es mudo? Quitar los rótulos cambia cómo aprende Luca. Si Jay los quiere, que sean una sola palabra, como «Pulso».
