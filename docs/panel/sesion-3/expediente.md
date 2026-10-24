# Kubono: expediente para la tercera sesión del panel (24 de octubre de 2026, tarde)

Versión 2.3.0-alpha.167, rama `main` en `/home/user/WHITEDOT`. Mismo día que la segunda sesión (informe `KUBONO-PANEL-2.md`, análisis `2-01…2-10-*.md` en esta carpeta). Desde entonces se construyó el **plan integrado H1–H7**, que salió de vuestras recomendaciones G1–G7 y de las decisiones de Jay.

**Importante:** nadie más que Jay ha jugado. No hay pruebas con personas ni escucha en un teléfono real. Los tiempos salen de modelos y bots.

## Decisiones de Jay tras la segunda sesión

| Pregunta del panel | Decisión |
|---|---|
| Estrellas | El anillo se abre **en orden**: cada lugar al completar el anterior. Se gana con los 11 lugares completos; las 33 ★ son la versión maestra. |
| Tema que crece | ★ = fragmento de la capa del lugar, ★★ = capa entera, ★★★ = variación. |
| Chispas | Fuera de tiempo, 0 ✦ (también en el Mundo libre). La tienda sigue abierta, oculta solo durante el Viaje. |
| Texto | Viaje sin rótulos; en los lugares, cada frase solo la primera vez; el narrador solo en la tarjeta de la ronda y la Bitácora. |
| Tu canción | «Mucho más parecida o igual a la música que ya generamos». |
| Mundo libre tranquilo por defecto | No. |
| Festival | Sin decidir (recomendación: solo el Viaje y su final). |
| Modo Libre por lugar | Sí. |

## Qué se hizo (H1–H7)

- **H1 · Que se vea:** el cubo se dibuja 1,6× en el mundo (16–30 px en teléfono). El color ganado tiñe el lienzo (18–30 %) en vez de motas; el gris de «saturación» se pinta en el canvas antes de los juegos, así el oro queda encima. El brillo dorado del cubo sale siempre al acertar (también si vibra) y la onda a tiempo es dorada. La hoja Lugares ya no pone «Sin visitar» con ★. `?anillo=1` siembra los colores.
- **H2 · Que se sienta:** calibración de latencia sin menú (`src/rhythm-calibration.js`): los 12 primeros pulsos cerca del compás miden el retraso y se guarda; en Ajustes «− / + / medir otra vez». La Línea dibuja los pasos que cuentan (se quitaron los puntos bajo el cubo). Cada lugar **canta su patrón dos compases** al empezar y desaparecieron las frases «Aquí el ritmo es…». **Cubo Vibri**: cuatro formas según la racha; un fallo baja un nivel.
- **H3 · El camino:** orden de pistas; columna de luz dorada en el portal siguiente; portal cerrado: «X se abre al completar Y». Al tocar un portal ya completado: Jugar / Libre / Maestro (con ★★). Tarjeta de fin con «Siguiente · X». Modo Libre: sin barra, sin estrellas, vuelves al portal.
- **H4 · Tu canción:** ya no es un house aparte: el secuenciador del mundo añade, en su acorde, la capa de cada lugar ganado según sus ★. Final: capas una por compás, después tus notas guardadas de cada lugar, después el tema del cubo (unos 60–90 s); 33 ★ = todas las capas en variación. Los trofeos tocan su capa encima de la música.
- **H5 · Reglas claras:** reglas de chispas y texto de arriba. Logros durante una ronda: se dicen en la tarjeta con la frase del narrador. «Treinta y tres» llega con las 33 ★. **El menú no se acortó** (unas 30 pruebas pulsan sus botones; queda pendiente).
- **H6 · Mundo que se escucha:** la chispa salvaje canta una nota del acorde en cada pulso **desde su lado** (paneo estéreo) y más fuerte cerca; la flecha del borde solo sin sonido. El portal más cercano suena en el «1» desde su dirección; el siguiente del camino es un faro suave en el «3» que se oye desde el Refugio.
- **H7 · Medir:** `node scripts/play-curve.mjs` (modelo, no medida):

| A tiempo | Gana (11 lugares) | ★ a 60 / 120 min | Mayor hueco sin novedad | Sin que crezca la canción |
|---|---|---|---|---|
| 60 % | 40 min | 11 / 11 | 7 min | 80 min tras ganar |
| 75 % | 36 min | 11 / 11 | 6 min | 85 min tras ganar |
| 90 % | 33 min | 24 / 33 (33 ★ a los 94) | 6 min | 6 min |

Con ★★ al 75 % y ★★★ al 70 %, el jugador del 75 % llega a 28 ★ en 2 h y nunca pasa 11 min sin capa nueva. **Jay aún no ha decidido el umbral.**

## Lo que sigue igual

Las cuatro capas (Viaje 15–17 min → 11 lugares en anillo → Mundo salvaje → Refugio), los cinco juegos del Viaje (Pegar, Encadenar, Rodear, Bailar, Soltar) y los seis lugares nuevos (Jardín, Dunas, Cristales, Faros, Ruinas, Cueva). Tienda 17 030 ✦ (modelo: 10,5 h al 60 %, 7,2 h al 90 %). Narrador sin aprobación línea a línea. ~311 módulos, 240 suites Node, ~100 recorridos de navegador.

## Capturas (teléfono 390×844, carpeta `3/`)

Las mismas que la segunda sesión, sobre `main` alpha.167. **Corrección respecto a la sesión 2:** `00-inicio.png` ahora simula un navegador normal y muestra la entrada real. El resto se toma ~5 s después de cargar, sin jugar: no muestran Vibri, el faro sonoro ni la tarjeta con narrador. Puedes sacar más tú (ver `capture3.py`; inyecta `window.__r=runtime;` al servir `src/main.js`).

## Archivos útiles

`docs/MUNDO.md` (sección «Plan integrado H1–H7» y «Las dos primeras horas»), `CAMBIOS.md` (H1–H7 arriba), `docs/ARQUITECTURA.md`, `src/rhythm-calibration.js`, `src/journey-pulse.js`, `src/places.js`, `src/places-ring.js`, `src/song.js`, `src/song-stage.js`, `src/wild.js`, `src/spatial.js`, `src/world-sheet.js`, `src/render.js`, `scripts/play-curve.mjs`.
