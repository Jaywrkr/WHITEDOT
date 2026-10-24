# Tercera sesión · Simogo (simulación)

> Simulación de su mirada (el juego como disco). No es su opinión real. Leí el código de alpha.167, las capturas de `3/` y ejecuté `play-curve` y `song-tiers`. No jugué ni escuché nada en un teléfono.

## Notas

| Eje | Sesión 2 | Hoy | Por qué |
|---|---|---|---|
| Visual | 7,5 | 7,5 | Entrada limpia (`00`). Los anillos no muestran las ★ de cada capa (`22`). |
| Audio | 8,5 | 8,5 | La canción ya es la música del mundo. Sin escucha real. |
| Creatividad | 8 | 8,5 | El portal siguiente se encuentra con el oído. |
| Sensación | 7 | 7,5 | Vibri, calibración y «Siguiente». La tarjeta sigue cortando. |
| Cohesión | 6 | 7 | La cara B ya tiene orden y un final alcanzable. Le faltan clímax y coda. |
| Pulido | 7 | 7 | El menú no se acortó. Las notas del final tienen huecos (ver abajo). |
| **Media** | **(7,3)** | **7,7** | |

## Qué mejoró de verdad

- **Hay orden de pistas.** Cada lugar se abre al completar el anterior (`src/places.js:44`, `:47-48`). El siguiente se señala con columna de luz y flecha (`src/places-ring.js:57-61`) y suena desde su lado (`:68-69`).
- **El disco termina con 11 ★.** El final llega con los once lugares completos (`src/song-stage.js:87`); las 33 ★ son la versión maestra (`:88`). Según el modelo se gana a los 33–40 min: la duración de un álbum.
- **El final usa tus notas.** Capas una por compás, después tus notas por lugar y luego el tema (`src/song-stage.js:28-39`).
- **De una pista a la siguiente sin caminar.** «Siguiente · X» en la tarjeta te lleva al portal y empieza la ronda (`src/places.js:104`, `src/places-ring.js:41`).
- **Los créditos del Viaje ya no cuentan ★** (`src/journey-finale.js:18`).

## Qué sigue faltando o salió mal

- **Sigue habiendo menú entre pistas.** `setTimeout(results,1200)` sigue ahí (`src/places.js:91`). Pedí cero toques; hace falta uno.
- **La cara B no tiene clímax ni coda.** Los seis juegos nuevos suben la energía con la misma fórmula, `.2+.6*p` (`journey-garden.js:54`, `journey-echo.js:53`, `journey-rebuild.js` y otros). Las Ruinas no son la Tormenta. La Cueva no es el Vacío.
- **El final no respira.** No hay un compás de silencio antes del tema. Los créditos salen en el compás 11 (`src/song-stage.js:82`), encima de tus notas, no después.
- **El tema no llega: ya estaba sonando.** La capa de Faros toca el tema cada dos compases desde que entra (`src/song-stage.js:37`). Cuando llega «el tema sobre todo» (`:39`), ya se ha oído varias veces.
- **Faltan las notas del Viaje.** El final lee `S.lugares.notes` (`src/song-stage.js:52`)., que solo llena una ronda de lugar (`src/places.js:90`). Las notas de los capítulos (`src/journey-chapters.js:87`) no se usan: sin repetirlos, se oyen seis lugares, no once.
- **La versión maestra es la misma pieza con más capas** (`src/song-stage.js:47`). No es más rápida ni distinta.
- **Las cinco primeras pistas siguen repitiendo el Viaje.**
- **No puedo verificar** Vibri, el faro sonoro ni la tarjeta con narrador: las capturas no los muestran.

## Tres acciones

1. **Encadenar sin tarjeta** (completar una pista abre la siguiente).
   - Cómo: en `places.js` (`finish`), si la ronda da una ★ nueva y hay `nextOnPath`, no abrir `results`. Esperar al final del cierre (`journeyVictory` devuelve los ms) y llamar `ringGo(next.id)` en el «1». Mostrar «★ · Jardín» 3 s sobre el mundo. La tarjeta pasa a la hoja Lugares.
   - Bien cuando: un recorrido de navegador mide 10 s o menos entre el objeto dorado y el primer pulso de la pista siguiente, sin pulsar nada y sin cortar la música.
2. **Clímax en Ruinas, coda en la Cueva.**
   - Cómo: en `PLACES` añadir `peak` y `coda`. `journey-rebuild.js` usa un suelo como `STORM_FLOOR`, hasta .92. `journey-echo.js` limita la energía con `journeyCap` y su último eco es el ritmo del tema.
   - Bien cuando: `play-curve` calcula la energía media por pista. Sube hasta la 10 y baja en la 11.
3. **Un final que respire:** entradas, tus notas, silencio, tema, créditos.
   - Cómo: en `song-stage.js`, la capa de Faros no toca el tema en el final antes de `themeAt`. Un compás de silencio con el `hush` de `journey-victory.js`. Créditos después del tema. `FINAL_LINES` sin cifras («Tu canción está completa», no «Los 11 lugares»). Unir las notas de los capítulos del Viaje.
   - Bien cuando: una prueba Node sobre `songPlan`/`stageEvents` confirma que no hay notas del tema antes de `themeAt`, que hay un compás vacío y que suenan notas de los 11 lugares.

## Decisiones de Jay

- **Umbral de ★★: 75 %.** Con 85 %, quien acierta el 75 % no ve crecer su canción durante 84 min tras ganar (`play-curve`). Con 75 % llega a 28 ★ en 2 h. «Mejorar tu marca» premia repetir, no escuchar, y el modelo no lo mide.
- **Festival: solo el Viaje.** Es el disco cerrado, con clímax, coda y un final tuyo. Hoy `festival.js:5` solo incluye Llanura y Lago. Si el jurado tiene 15 min, mostraría el Viaje entero. La cara B todavía no tiene la forma para enseñarla.
