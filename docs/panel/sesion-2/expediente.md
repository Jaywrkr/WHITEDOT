# Kubono: expediente para la segunda sesión del panel (24 de octubre de 2026)

Versión 2.3.0-alpha.160, rama `main` del repositorio en `/home/user/WHITEDOT`. Dos días después de la primera sesión (22 de octubre, expediente `kubono-dossier.md`, informe `KUBONO-PANEL-CREATIVO.md`, análisis `01-…10-*.md` en esta misma carpeta). Desde entonces se construyeron unas 30 fases siguiendo lo que acordó el panel y lo que pidió Jay al jugarlo.

**Importante:** nadie más que Jay ha jugado esta versión. No hay pruebas con personas. Las duraciones salen de simulaciones (bots) salvo donde se diga. Juzga por código, capturas y lo que puedas medir tú.

## Lo que el panel pidió y qué se hizo

| Acuerdo del 22 de octubre | Estado hoy |
|---|---|
| El verbo es tocar a tiempo; nunca suena mal | Hecho: en el Viaje y en los lugares solo un pulso a tiempo hace algo. Fuera de tiempo no pasa nada (sin castigo). En el Mundo libre se toca cuando se quiera; a tiempo da el doble de chispas |
| El Viaje como juego principal, ~40 min, 7 capítulos | Cambió: Jay jugó y el Viaje quedó en **15–17 min**: Camino + 5 capítulos (Llanura, Lago, Bosque, Tormenta, Vacío) + Refugio. Cada capítulo es un juego con un verbo (Pegar, Encadenar, Rodear, Bailar, Soltar) |
| Primeros 15 min como build de festival | `?festival=1`: sin cuenta, guardado propio |
| El Refugio toca tu viaje como final; luego créditos y Mundo libre | Hecho (`journey-finale.js`) |
| Ocultar HUD, tienda, logros durante el Viaje | Hecho en el modo «Viaje» de pantalla; hay un modo «Todo a la vista» |
| Entrar sin cuenta | Aprobado por Jay el 22 de octubre: cuenta opcional |
| La Línea de Matsuura, tema del cubo de Wintory, color que se gana (Roset), faro con voz (Chen) | Hechos en fases 1–8 del Viaje |

## Las cuatro capas de hoy (`docs/MUNDO.md`)

1. **Viaje** (prólogo, 15–17 min): Camino → Llanura «Pégate» → Lago «Encadena» → Bosque «Rodea» → Tormenta «Baila» → Vacío «Suelta» → Refugio (final musical y créditos).
2. **Los 11 lugares**: anillo de 11 portales dorados alrededor del Refugio, cada uno en su bioma. Cada lugar es una ronda de ~2:30 con un verbo, una barra que se llena, un objeto dorado al final y tres estrellas (★ completar, ★★ 85 % a tiempo, ★★★ Maestro: más rápido, ventana más estrecha, barra ×1,5). 33 ★ en total; las estrellas abren lugares y **con las 33 se gana el juego** («Tu canción» completa: 11 capas, una por lugar, y créditos). Repetir da chispas, no estrellas.

| Lugar | Verbo | Ritmo (F14) | Se abre con |
|---|---|---|---|
| Llanura | Pegar | A tiempo | Viaje |
| Lago | Encadenar | Contratiempo «y» (como lugar) | Viaje |
| Bosque | Rodear | A tiempo | Viaje |
| Tormenta | Bailar | «1 · 2 · y» | Viaje |
| Vacío | Soltar | El «1» | Viaje |
| Jardín | Sembrar (a tiempo) y regar (en el «y») | — | 5 ★ |
| Dunas | Surfear la ola en el «y» | — | 8 ★ |
| Cristales | Resonar: acorde de tres cristales en «1 · y · 2» | — | 12 ★ |
| Faros | Guiar barcos al puerto («1 · 3 · y») | — | 16 ★ |
| Ruinas | Reconstruir columnas con el patrón «1 · 2y · 3 · 4» | — | 20 ★ |
| Cueva | Eco: la cueva canta un patrón y lo repites | — | 24 ★ |

3. **Mundo salvaje**: el mundo infinito alrededor (52 géneros, continentes, criaturas, tienda de 81 piezas, 376+23 logros, Bitácora). Nuevo (F18): una chispa salvaje cada 1–2 min al explorar (5 pulsos a tiempo, 15 ✦) y una **remezcla diaria** (un lugar con el ritmo de otro, 30 ✦ + 20 con récord).
4. **Refugio**: casa en el centro del anillo. Estante de 11 trofeos que tocan su capa de música, muro «★ N / 33», hoja «Lugares» con viaje rápido, puerta al anillo, «Tu canción».

## Otras piezas nuevas

- **Cierre de cada lugar (F13):** sale de la música que suena: el filtro se cierra un compás, medio tiempo de silencio total y en el «1» vuelve la misma música con la capa del lugar en su acorde y el tema del cubo encima.
- **Guía de ritmo (F14):** ocho puntos bajo el cubo son las corcheas del compás: los que cuentan se ven, el «1» en dorado.
- **Primer minuto (F12):** si no hay primer pulso en 5 s, la barra de arriba late con el compás.
- **Narrador (F8):** logros con voz burlona tipo Dungeon Crawler Carl para niños. Jay no ha aprobado las frases una por una.
- **Economía (F3):** chispas por jugar (60–120 por ronda de lugar), tienda de 17 030 ✦ ≈ 7–9 h según simulación.

## Números (modelos, no medidas)

- Ronda de lugar simulada al 75 % a tiempo: Jardín 2:24, Dunas 2:33, Cristales 2:27, Faros 2:28, Ruinas 2:13, Cueva 2:27 (la Cueva baja a 1:34 al 90 %). Llanura meta 150 «~2:30» estimado desde que Jay la acabó en <1 min con meta 60.
- 33 ★ ≈ 11 lugares × (1–3 rondas) ≈ 1,5–3 h según destreza (estimación gruesa).
- Pruebas automáticas: 237 suites Node y ~100 recorridos de navegador; audio renderizado sin saturar.

## Capturas de esta sesión (teléfono 390×844, en esta carpeta)

`00-inicio.png` (partida nueva sin parámetros), `01…05-capitulo-*.png` (los 5 capítulos del Viaje con `?capitulo=`), `10…15-lugar-*.png` (Jardín, Dunas, Cristales, Faros, Ruinas, Cueva con `?lugar=`), `20-anillo.png` (Mundo libre tras el Viaje, `?anillo=1`), `21-lugares.png` (hoja Lugares), `22-cancion.png` (Tu canción), `23-salvaje.png` (chispa salvaje). Las capturas se tomaron ~5 s después de cargar, sin jugar: no muestran momentos de juego avanzados. Puedes sacar más tú: sirve el repo con `python3 -m http.server` y Playwright con `executable_path='/opt/pw-browsers/chromium'` (ver `capture.py` aquí; `window.__r` expone el runtime si inyectas `window.__r=runtime;` al final de `src/main.js` vía `page.route`).

## Archivos útiles

`docs/MUNDO.md` (plan y reglas de hoy), `docs/VIAJE.md` (el Viaje), `CAMBIOS.md` (qué cambió en cada fase, arriba lo último), `docs/ARQUITECTURA.md`, `src/journey-*.js` (juegos del Viaje y de los lugares), `src/places*.js`, `src/refugio-lugares.js`, `src/song*.js`, `src/wild.js`, `src/journey-rhythm.js`, `src/journey-victory.js`.
