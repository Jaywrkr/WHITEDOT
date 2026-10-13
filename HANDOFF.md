# HANDOFF · WHITEDOT / Pixel Blanco

> Documento de traspaso para continuar el desarrollo con otra IA (ChatGPT, Claude, etc.) o con otro dev.
> Lee este archivo junto con [CAMBIOS.md](CAMBIOS.md) y [PENDIENTES.md](PENDIENTES.md). Última revisión: 2026-10-12 (auditoría de Claude sobre `main` `3c58c56`, PR #26). Todo lo descrito aquí está integrado en `main`; ya no hay ramas de producto pendientes de merge salvo la que se indique en CAMBIOS.

- **Juego en vivo:** https://whitedot-inky.vercel.app
- **Repo:** https://github.com/Jaywrkr/WHITEDOT (rama `main`). Cada push a `main` despliega solo en Vercel.
- **Documento de diseño (más largo, visión completa):** https://claude.ai/code/artifact/034e1ffb-4be3-4044-9a25-47da3d713190
- **Código:** HTML en `index.html`, estilos en `styles/game.css` y módulos JavaScript nativos en `src/`. No hay build.

---

## 1. Cómo trabajar con Jay (léelo primero)

- Llámalo **Jay**. Sé directo y práctico, sin halagos. Él prueba en el **móvil**, así que todo tiene que funcionar con el dedo.
- Él da feedback por sensación ("suena robótico", "no siento que cambia"). Tradúcelo a cambios concretos y hazlos. No le devuelvas preguntas técnicas.
- Responde en **español**. Todo el texto del juego está en español.
- Cuando dice "hazlo", quiere el cambio implementado y probado dentro de la etapa acordada, con commit y push en una rama nueva desde `main` actualizado. **Jay crea el PR y hace el merge.** No hacer push directo a `main`, crear PRs ni hacer merges. El despliegue de producción ocurre después de su merge.
- La autorización se da por etapa. No ejecutar todo el roadmap por una aprobación de la etapa actual.

## 2. Visión

Un pixel blanco en un mundo negro que va creciendo. **El centro de todo es la MÚSICA**: electrónica que va del ambient al minimal tech house (afro house, minimal house, rominimal, dub techno, deep…).

- **Camino diario:** corto. Construye constancia y racha, y el crecimiento tiene tope por día. Su música es casi ambient. No debe convertirse en grind.
- **Mundo:** se abre después del camino. Es infinito y procedural, y todo genera música. Ahí está la diversión de verdad.
- **Descubrimientos excepcionales:** Jay quiere encontrar cosas mágicas muy rara vez, con identidad propia y difíciles de conseguir. Las reliquias actuales le resultan demasiado fáciles. Primera implementación: sitios fijos raros y constelaciones dormidas; ver `src/relics.js`.
- **Inspiraciones:**
  - Logros absurdos y ocultos estilo *Dungeon Crawler Carl*.
  - Una "Voz del sistema" sarcástica estilo Carl pero también con el humor de Jay.
  - Descubrimiento ordenado estilo *No Man's Sky* / *Astroneer*.
  - Capas musicales estilo *Incredibox*.
  - Infinitud estilo *Minecraft*.
- **Aprender música jugando:** cada región muestra su género, escala e instrumentos.
- **Compartir en redes** (@jaywrkr): tarjetas de constancia y descubrimientos.
- **Estudio portátil:** "lo construyes y lo llevas". Es secuenciador, refugio y checkpoint, y se decora con colores que desbloqueas con logros.
- **Multiplayer o visitas:** más adelante, no ahora.

## 3. Decisiones tomadas (no revertir sin hablar con Jay)

| Tema | Decisión |
|---|---|
| Motor | **Web** (HTML5 + Canvas + Web Audio). Se descartó Godot porque las consolas no son viables y web llega a iOS, Android y PC. Para tiendas, más adelante: Capacitor (móvil) y Tauri (desktop). |
| Laberintos | **Eliminados.** No le gustaron. |
| Slider de estilo musical | **Eliminado.** La intensidad y el género los decide el lugar, no un control. |
| Drone constante | **Prohibido.** No debe quedar nada sonando todo el tiempo. El pad "respira": solo crece después de un cambio de acorde y se apaga solo. |
| Sincronía | Todo lo que toca el jugador se cuantiza al beat (8vos o 16vos), con un poco de jitter para que suene humano y no 100% estricto. |
| Biomas | Cada región tiene un **género real distinto**. Las transiciones son **graduales**, mezcladas en el espacio (como bajar de la sierra a la costa). Las regiones son anchas y tienen mini-biomas adentro. |
| Densidad | Hay lugares muy llenos y otros casi vacíos (nivel FILL). |
| Jardín | Es solo un verbo (sembrar). No es el tema del juego. |
| UI móvil | Mínima, con íconos. Un dock de 3 botones y un menú modal para lo demás. |
| Objetos | Tienen autonomía: hacen cosas, no solo suenan. Están en armonía visual y musical con su región. |

## 4. Arquitectura

El juego usa módulos JavaScript nativos (`import`/`export`), servidos por HTTP. `index.html` carga `src/main.js` con `type="module"`. No necesita compilación ni dependencias de aplicación.

`main.js` crea un contexto interno `runtime` e inicializa cada sistema una sola vez en el orden explícito de imports. Cada módulo mantiene sus variables en su propia función `initialize(runtime)`, publica únicamente las referencias usadas por otros sistemas mediante getters y, para estado reasignable, setters. Las referencias a otros sistemas usan `runtime.nombre`; no se expone este contexto en `window`. Los callbacks y eventos empiezan a ejecutarse después de completar la inicialización.

La separación conserva las relaciones originales entre sistemas. Todavía hay acoplamiento mediante el contexto compartido; no son componentes independientes. Antes de cambiar una referencia publicada, revisar sus consumidores. No reinicializar módulos sobre el mismo contexto ni cambiar el orden sin comprobar las dependencias.

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Canvas, HUD, dock, paneles y estructura accesible de la interfaz. |
| `styles/game.css` | Estilos y adaptaciones móviles, en el mismo orden de cascada que antes. |
| `src/main.js` | Contexto compartido, inicialización, normalización de la partida, autosave y arranque del loop. |
| `src/data.js` | Constantes, biomas, géneros, logros, muestras y textos. |
| `src/progress.js` | Guardado v4, días, racha, crecimiento, linterna, RNG y cachés. |
| `src/world.js` | Camino, generación de regiones/chunks, eventos y reliquias. |
| `src/spatial.js` | Presencia por distancia, selección de fuentes cercanas y actualización de voces activas. |
| `src/grammar.js` | Perfiles musicales regionales, ritmo/frase/armonía y atenuación por densidad. |
| `src/references.js` | Familias de referencia y sus patrones de bajo, melodía y percusión. |
| `src/neighborhoods.js` | Campo de tempo/afinación y selección compatible de regiones vecinas. |
| `src/palettes.js` | Paletas tropical, melódica, robótica y disco, asignación regional y patrones. |
| `src/instruments.js` | Nuevos timbres de parciales, FM y filtros, güiro y timbal electrónicos. |
| `src/audio.js` | Web Audio, scheduler, armonía, síntesis, géneros y tracks. |
| `src/session.js` | Resumen de exploración y actividad, conservación de la última sesión y tarjeta PNG. |
| `src/effects.js` | Procesamiento local por voz, perfiles regionales y liberación de nodos de audio. |
| `src/relics.js` | Sitios raros estables, resonancia y compatibilidad de reliquias antiguas. |
| `src/pockets.js` | Espacios locales de escucha, ensamble y descubrimiento; distribución estable y pistas discretas. |
| `src/personality.js` | Rasgos estables de movimiento, reacción y respuesta musical por objeto. |
| `src/playthings.js` | Nuevos elementos, generación independiente, reacciones de contacto/pulso y dibujo. |
| `src/scanner.js` | Fuentes musicales cercanas y panel Escuchar durante una pulsación larga o tecla E. |
| `src/journal.js` | Bitácora de lugares, formas, música y logros; compatibilidad de registros v4. |
| `src/gravity.js` | Gravedad estable por región y mezcla de velocidades en bordes y esquinas. |
| `src/voices.js` | Roles, registros e instrumentos de interacción por región; emite sonidos con la síntesis existente. |
| `src/radio.js` | Composición del Mundo por frases y secciones, independiente del movimiento. |
| `src/canvas.js` | Canvas, tamaño, input de movimiento y estado visual temporal. |
| `src/messages.js` | Cola y animación de la Voz del sistema. |
| `src/studio.js` | Muestras, secuenciador radial, bolsa, colores y checkpoint. |
| `src/interactions.js` | Pulsos, colisiones y respuestas sonoras/visuales de objetos y especies. |
| `src/discovery.js` | Descubrimientos, regiones, retos, recolección y recompensas. |
| `src/render.js` | Glifos, loop, dibujo y simulación del Camino y del Mundo. |
| `src/ui.js` | HUD, avisos, logros y entrada/salida del Mundo. |
| `src/sharing.js` | Constelación y tarjetas para compartir. |
| `src/feedback.js` | Señales visuales del rol musical sincronizadas con el inicio del sonido. |
| `src/phenomena.js` | Aves de eco, semilleros de caja y nubes de pulso; generación y reloj audiovisual. |
| `src/patches.js` | Perfiles de material y síntesis procedurales por región/instrumento/rol/objeto (PR #25, integrado). |
| `src/rhythms.js` | Biblioteca ampliada de ritmos por recetas (batería, bajo, frase, instrumentos, escalas, guía) y familias de todos los géneros. |
| `src/continents.js` | Continentes, mares de silencio y campo de vitalidad (densidad con contraste). |
| `src/landmarks.js` | Hitos y horizonte sonoro: se oyen, se intuyen y se ven. |
| `src/map.js` | Mapa dibujado de lo explorado (dos zooms, hitos oídos como ?, tarjeta para compartir). |
| `src/atlas.js` | Atlas de ritmos (prototipo): lista todos los géneros, verifica que existen en el mundo y viaja a la región más cercana. |
| `src/controls.js` | Botones, controles de prototipo y sonido. |
| `package.json` | Declara módulos ES para Node y `npm test`; no instala dependencias de aplicación. |
| `tests/core.mjs` | Compatibilidad del guardado, tope diario y mundo determinista. |
| `tests/smoke.py` | Flujos funcionales del navegador en móvil y escritorio. |
| `tests/rhythms.mjs` | Recetas completas, baterías distintas, instrumentos explicados y reparto equilibrado de géneros. |
| `tests/world.mjs` / `tests/world_smoke.py` | Escala del mundo: continentes, mares, vitalidad, hitos y horizonte sonoro. |
| `tests/atlas.mjs` / `tests/atlas_smoke.py` | Atlas: todos los géneros alcanzables y viaje correcto desde Camino y Mundo. |

### Estado guardado `S` (localStorage)

```
offset, lastDay, streak, best, totalDays, totalLight, todayKey, todayLight, capShown,
collected[], trail[], px, py, ach{}, sound, mode("camino"|"world"|"studio"),
wx, wy (posición en el mundo), lampDay, lampUsed, session, lastSession, journal{}, softMusic, species{}, rel, relicSites{}, stars[], help{},
zones{}, bag{muestra:cantidad}, studio{x,y,biome,slots{}}, color, cat{} (catálogo de especies),
catN, places{}, placesN, retos{}, retosN, events{}
```

Si cambias la forma de `S` de forma incompatible, sube la `KEY` (por ejemplo a `v5`) o agrega una migración. `Object.assign(fresh(), saved)` ya rellena los campos nuevos.

## 5. Mundo procedural

- **RNG con semilla:** `seedOf(str)` (hash FNV) y `rng(seed)` (tipo mulberry). La semilla es fija, así que el mundo es igual para todos.
- **Chunks:** `WCH=900` px. `wchunk(cx,cy)` genera plantas, props, especies y luces. Las reliquias se consultan aparte en `nearbyRelics()`; `todayRelics()` queda como alias interno.
- **Regiones:** `REG=4` chunks por lado (3.600 × 3.600 px). `regionAt(cx,cy)` recibe coordenadas de chunk, calcula la región y devuelve su **ADN**:
  - Identidad: `name` (generado con sílabas) y `trait`.
  - Visual: `hue`, `pal` (paleta armónica), `ground`, `air`, `plants`.
  - Música: `scale`, `trOff` (transposición), `pat` (patrón generado con `euclid()`), `kOff`, `track` (bajo y hook), `genre`, `bpm`.
  - Vida: `species` y `fill` (densidad).
  - Juego: `reto` y `mix`.
- **Bioma base:** cada región parte de un bioma de `BIOMES` (llanura, bosque, lago, ruinas, jardín, dunas, cristales, faros, tormenta, cueva, vacío). La disponibilidad depende de la distancia al origen: `d = 2 * max(abs(rx), abs(ry))`, y se eligen biomas cuyo `minD <= d`. No depende de los días jugados.
- **Gravedad regional (implementada):** semilla independiente `gravity:v1:<región>`. Ligera: velocidad ×1,65; normal: ×1; alta: ×0,55. Origen es normal. Solo modifica el movimiento del jugador en el Mundo, no el Camino, el Estudio ni la velocidad de criaturas. Se mezcla en ambos ejes dentro de 450 px de una frontera, incluyendo esquinas y coordenadas negativas. La tarjeta del lugar indica su gravedad y tipo de movimiento. Es una propiedad de movilidad, no una simulación física de gravedad vertical. No cambia mapa ni guardado v4.
- **Elementos interactivos nuevos:** luces fugitivas y cometas salen impulsadas, brotes saltan, prismas giran en su sitio y aros expanden una resonancia sin desplazarse. Generación por chunk con semilla independiente `playthings:v1`, pools por bioma y máximo 40 elementos por chunk (Vacío es más escaso). Contacto y pulso comparten voz regional, cooldown de 850 ms y sonidos a tempo. El ambiente también puede hacerlos sonar. Escuchar muestra sus nombres y roles. Los móviles vuelven gradualmente a su ancla. Su estado es temporal, como otros objetos del mundo; no se añaden muestras ni logros nuevos. Los rasgos individuales se aplican en `personality.js`.
- **Comportamiento individual (implementado):** perfiles sereno, vivaz y elástico con variaciones de periodo, flexibilidad, masa, velocidad, drag, recuperación, cooldown, salto, impulso, nota y volumen. Se generan por `personality:v1:<chunk>:<familia>:<índice>`, después del contenido original del chunk, sin cambiar posiciones ni IDs. Árboles y plantas se balancean a ritmos distintos; los árboles también responden musicalmente al pulso. Los objetos físicos responden según masa/drag y criaturas del mismo tipo pueden moverse y seguir durante tiempos distintos. Escuchar muestra el temperamento. Los rasgos se reconstruyen al volver; posiciones y reacciones siguen siendo temporales.
- **Distribución local (implementada):** tres espacios por chunk con centros separados: claro de escucha, espacio de ensamble y rincón de descubrimiento. Semillas `pockets:v1` y `pocket-layout:v1` redistribuyen solo los elementos nuevos, conservando sus IDs, tipos, rasgos y cantidades. Aproximadamente 70 % forma el ensamble y el resto un grupo pequeño de descubrimiento. Se conservan terreno, flora y criaturas anteriores. En los claros se reduce la energía de la radio y se omite el ensamble automático de objetos cercanos; tocar objetos y criaturas sigue funcionando. El HUD y Escuchar muestran el espacio local, con pistas discretas en el suelo. Son espacios de composición/exploración, no recompensas raras nuevas.
- **Mini-biomas:** cada chunk tiene una variante de `VARS` (claro / espeso / húmedo / eco / brillo).
- **Hábitat:** `HAB` (equilibrado, florido, salvaje, mineral, desierto) multiplica las cantidades de flora, fauna y minerales.
- **Bordes:** en una franja `BAND=900` px cerca del borde de la región, todo se mezcla con la región vecina:
  - el suelo, con dithering;
  - el aire, con pesos en `drawAir`;
  - las plantas del vecino, que aparecen en los chunks de borde;
  - el audio: `MU.nb` y `MU.nbW` mezclan percusión, bajo y melodía; el tempo transiciona. Solo se mezcla una región vecina a la vez, incluso en esquinas.
- **Aire (`AIRP`):** claro, esporas, niebla, polvo/arena en el aire, etc.
- **Eventos actuales por región:** lluvia de notas, eclipse, migración y aurora (`eventOf`). Cada región salvo Origen tiene un 15 % de probabilidad diaria de tener un evento, determinado por semilla. Esto no constituye todavía un sistema de encuentros únicos o de rarezas coleccionables.
- **Reliquias actuales:** sitios fijos raros de `src/relics.js`, obtenidos una sola vez por partida tras permanecer cerca y lanzar pulsos. Sin flecha global ni lista diaria nueva. Se guardan ID, nombre, fecha, región y tipo mágico en la estrella; `S.relicSites` evita repetir el sitio. Las listas antiguas pendientes solo duran hasta acabar su día.
- **Linterna:** dura 10 min más 1 min por cada día de racha, con un máximo de 60 (`lampMax`). Su consumo se pausa mientras hay un modal abierto, y no consume dentro del Estudio. El mundo y su audio pueden seguir activos; no es una pausa completa de la simulación.

## 6. Motor musical (lo más importante)

- **Scheduler con lookahead:** un `setInterval` de 25 ms agenda pasos de 16vos (`MU.step`, `playStep`).
- **Colas:**
  - `MU.queue` cuantiza las notas del jugador a 16vos.
  - `beatSoon(fn, vis)` / `MU.q8` cuantiza a 8vos con jitter. El callback visual se dispara cuando la nota suena de verdad, así lo visual y el audio quedan sincronizados.
- **Armonía generativa:**
  - Una cadena de Markov sobre los grados de la escala (`NEXTD`) elige los acordes.
  - El pad usa voice-leading con osciladores persistentes que "respiran".
  - `snap()` ajusta las notas a los tonos del acorde.
  - La melodía sigue la dirección del movimiento del jugador. Un motivo call-response repite su frase.
- **Energía `MU.E`:** sube con el movimiento y la actividad. En el Mundo, la energía musical también tiene un mínimo variable por sección (`MU.radio.energy`), que sostiene capas estando quieto sin alterar los contadores de actividad del jugador.
- **Radio generativa del Mundo (implementada):** `radio.js` genera nuevas frases de bajo y melodía cada 4–8 compases, cambia secciones más largas e instrumentos dentro del género y conserva escala y BPM regionales. Objetos cercanos, criaturas que cantan, variantes y eventos modifican su energía. Funciona aunque no haya objetos alrededor y el jugador esté inmóvil; se guía por el reloj del scheduler de Web Audio. Los patrones rítmicos del género siguen siendo reconocibles.
  - El Camino mantiene su calma y el Estudio conserva su secuenciador; el compositor solo opera en el Mundo.
  - No cambia el ADN procedural ni el formato de guardado v4. El estado de composición es temporal; no se conserva al recargar.
  - Respeta activar/silenciar sonido y la duración de la linterna. No es audio en segundo plano garantizado: depende de que el navegador mantenga activo Web Audio.
  - Las pruebas verifican evolución y programación de notas; Jay valida la sensación musical y la mezcla en teléfono.
- **Géneros (`GEN`):** 52 estilos. `src/rhythms.js` (tanda 1, raíz afroamericana) suma 18 recetas completas: Chicago house, Detroit techno, acid house, soulful/gospel house, garage house de Nueva York, ghetto house, footwork, Baltimore club, Jersey club, Miami bass, electro-funk, boogie, boom bap, lo-fi hip hop, trap, G-funk, electro de Detroit y broken beat. Los 34 anteriores: `data.js` incluye ambient, downtempo, dub techno, deep house, afro house, minimal house, rominimal, acid techno, breaks, UK garage, tribal, dub profundo, electro, progressive house, microhouse, minimal techno, dubstep y drum & bass. `palettes.js` suma tropical house, melodic house, electro robótico y nu-disco; `references.js` suma tech house, electrónica andina, cosmic disco, melodic techno, organic house, amapiano, jazztronica, Berlin School, IDM, liquid drum & bass, darkwave/EBM y algorave.
  - Cada uno define rango de BPM, swing (`sw`), patrón, instrumento de bajo (`bassI`) y de hook (`hookP`), y nivel de pad.
  - `GPOOL[bioma]` conserva las familias originales. `EXTRA_GPOOL` añade las seis nuevas mediante una semilla independiente (`extra-genres:v1:<región>`), con 45 % de probabilidad de selección fuera de Origen cuando el bioma admite géneros nuevos. Vacío mantiene ambient y Origen mantiene minimal. Cambia la música de algunas regiones, no su paisaje ni los IDs de criaturas.
  - Los géneros nuevos tienen patrones propios: electro sincopado, progressive de pulso regular y capas melódicas, microhouse con detalles y espacios, minimal techno de acentos secos, dubstep a medio tiempo y drum & bass a 166–174 BPM. Sus acentos varían cada cuatro compases. La radio adapta también las frases de bajo de progressive, dubstep y drum & bass; los géneros anteriores ganan pequeños fills compatibles con su ritmo.
  - Bitácora y Escuchar reconocen las nuevas familias. Las pruebas ejercitan instrumentos y scheduler en los 52 géneros; la valoración audible de mezcla y groove sigue siendo de Jay en teléfono.
- **`drums(gid, …)`:** los patrones de batería de cada género. Se escriben a mano con kick, clap, hats, congas, clave, rim y shaker.
- **`playTrack(dna, …)`:** bajo y hook de la región, tocados con los instrumentos del género.
- **Instrumentos (todo síntesis):**
  - Percusión: kick, snare, clap, hat, conga, clave, wood.
  - Bajos: softBass, houseBass, acid (303-like), reese, fmBass.
  - Melódicos: stab, pluck, sawLead, organ, flute, marimba, glass, keys; también dubChord y organChord.
- **Mezcla entre regiones:** en la franja del borde, pesos complementarios mezclan percusión, bajo y hook. El vecino usa la escala/afinación activas durante la mezcla; el BPM transiciona. Ver Vecindarios musicales y CAMBIOS.md.
- **Camino:** casi ambient (`GEN.ambient`).
- **Ajustes de interfaz y viento:** tarjeta de entrada breve con nombre, género y gravedad; detalles en Bitácora/Escuchar. Mensajes del sistema limitados a dos líneas, ampliables con toque o Enter/Espacio; cola de hasta tres mensajes pendientes. Avisos y tarjetas evitan superponerse. El viento de dunas/polvo tiene ganancia máxima 0,012 (antes 0,045), filtro de 260–810 Hz y transición de 0,8 s; la lluvia conserva su comportamiento.
- **Efectos existentes:** filtro de paso bajo al entrar al agua, reverb por convolución, delay sincronizado al tempo y cambios de feedback/envío en cuevas y variantes de eco. Jay quiere ampliar los efectos según acciones y lugares (filtros, reverb, eco, robot, etc.); los efectos locales de interacción se amplían en `src/effects.js`. La voz robótica no está implementada: la Voz del sistema actual es texto.
- **Identidad musical regional (implementada):** `voices.js` usa una semilla independiente (`voices:v1:<región>`) para repartir bajos, percusión, acordes, melodía media y detalles agudos entre objetos, plantas y criaturas. Un mismo objeto puede cambiar de función e instrumento en regiones del mismo bioma; el reparto permanece estable al volver.
  - `getVoice(tipo, región)` devuelve la función efectiva, instrumento y rango. Para las formas se usa `forma:<id>`; el antiguo `sp.role` permanece como dato del generador, pero ya no determina por sí solo el sonido. La futura Bitácora/escáner debe consultar `getVoice()`.
  - Choques, pulsos y autonomía usan la misma voz del objeto. Los objetos emplean la región de su posición y las criaturas su región de origen; al cruzar una frontera no adoptan arbitrariamente la voz del jugador.
  - Los registros se limitan por rol y los instrumentos se eligen entre los sintetizadores existentes con afinidad al género. Las respuestas largas añaden un segundo golpe/nota a tempo; no convierten todo en arpegios agudos.
  - El mapa, el ADN visual y los IDs de criaturas no cambian. Las voces no se guardan en v4: se reconstruyen por semilla. El Camino y los sonidos de las muestras del Estudio conservan su comportamiento actual.
- **Autonomía sonora:**
  - `physics()`: los choques entre objetos suenan.
  - `chain()`: un rayo de luz salta en cascada entre cristales, pilares, campanillas, antenas y astros.
  - Los hongos saltan y sueltan esporas.
  - Las especies te siguen y cantan (`MU.singers`), y las parejas hacen call-response.
  - Ensamble ambiental: los objetos cercanos (`MU.near`) se disparan solos en el beat.
- **Pulso / sonar:** tocar la pantalla o Espacio lanza una onda (`sonar`, `waves`, `hitW`, `updWaves`). En el camino atrae luces. En el mundo hace sonar los objetos que alcanza, en orden de distancia.

## 7. Sistemas de juego

- **Especies procedurales:**
  - Sprite de 5×5 en espejo, con rol musical, tipo de movimiento y motivo.
  - Hay unas 4,7 millones de combinaciones. `discover()` las agrega al catálogo `S.cat`.
- **Retos por región** (`RETOTXT`): cantar (hacer cantar las formas), pulsos en el beat, luces en tiempo, quieto 20 s, compás y pulso grande.
  - El reto se inicializa al entrar o volver al Mundo y al cruzar de región. Los retos completados se guardan en `S.retos`; el progreso parcial de un reto es temporal.
- **Logros** (`ACH`):
  - Formato `[id, nombre, descripción, oculto?]`. Si el 4.º elemento es `1`, el logro es oculto.
  - Se desbloquean con `unlock(id)`.
  - Algunos desbloquean colores (`COLORS`).
- **Voz del sistema** (`VOZ`, `say(key)`): frases sarcásticas con efecto typewriter. Jay va a corregir las frases en el documento de diseño (tabla "Frases de la Voz") y luego hay que portarlas a `VOZ`.
- **Estudio** (`enterStudio`, `studioStep`, `studioTap`, `deployStudio`):
  - Secuenciador radial de 16 pasos × 4 anillos.
  - Usa las muestras de la bolsa (`S.bag`, `SAMPLES`) y los colores desbloqueados.
  - Se despliega en el mundo como checkpoint.
- **Tarjeta para redes:** `shareCard()` dibuja la imagen con la racha y los stats y abre compartir/descargar.

## 8. Cómo probar

- **Sintaxis:** correr `node --check` sobre los archivos de `src/`. Ya no hay un script inline para extraer.
- **Visual y funcional:** servir el repositorio por HTTP y usar Playwright headless (Chromium) en 390×844 (móvil) y escritorio. Comprobar entrada y reentrada al Mundo con reto visible, transición de día sin reto residual, pausa de linterna en menús, colocación y persistencia de muestras en el Estudio y generación de tarjetas. Capturar errores JavaScript y screenshots. Los errores de carga de Google Fonts sin red son esperables.
- **Tope diario:** comprobar que una luz de valor 10 recogida cuando faltaba 1 solo suma 1 tanto a `todayLight` como a `totalLight`.
- **Pruebas versionadas:** `npm test` (24 suites, inventario en CAMBIOS.md) `python3 tests/smoke.py`, `python3 tests/atlas_smoke.py`, `python3 tests/world_smoke.py` y `python3 tests/journey_smoke.py`. El smoke test inicia y detiene su propio servidor en un puerto libre, usa Chromium y no modifica las partidas del navegador personal. Requiere Python Playwright (ver README); las pruebas core solo requieren Node. No hay CI configurado.
- **Audio:** en headless no se oye nada. **Jay valida el sonido en su teléfono** con la URL de Vercel. Es la prueba que importa.
- **Atajos de prototipo** (menú → Prototipo):
  - `dFill`: llena la barra del día.
  - `dNext`: avanza un día.
  - `dSkip`: salta un día y rompe la racha.
  - `dReset`: borra el progreso.

## 9. Limitaciones conocidas

- **Acoplamiento entre módulos:** la separación usa un contexto compartido para conservar el comportamiento. El loop mezcla simulación y render; todavía no hay interfaces independientes entre todos los sistemas.
- **Audio en el hilo principal:** con mucho en pantalla, en móviles viejos el timing puede variar. La solución futura es AudioWorklet.
- **Progreso solo en `localStorage`:** se pierde si borras datos del navegador. No hay cuentas ni nube.
- **Audio en iOS:** requiere un gesto del usuario para arrancar, y el modo silencio del iPhone puede mutear Web Audio.
- **El documento de diseño está desactualizado** en: motor de géneros, ADN de región, eliminación del slider y la propuesta de Bitácora.
- **Restos del slider eliminado:** siguen presentes el modal `mMusic`, `rStyle`, `S.style` y sus handlers, pero el botón Música del menú solo activa/desactiva sonido. `style()` calcula la intensidad según el modo y el bioma, no según `S.style`. La limpieza de esos restos es trabajo pendiente.
- **Bitácora implementada:** botón Bitácora del menú y cuatro pestañas. Lugares recupera el ADN por ID e incluye gravedad, género y progreso en formas/reto/evento/reliquia; Origen no exige evento porque no puede generarlo. Formas agrupa los IDs descubiertos usando `getVoice()`, sin mostrar criaturas no descubiertas. Música registra los instrumentos programados con sonido activo en el Mundo, géneros y escalas; Logros organiza categorías y oculta los secretos pendientes.
- **Compatibilidad histórica de la Bitácora:** se conservan `places`, `cat`, logros y estrellas v4. Eventos antiguos con coordenadas se recuperan de sus claves. Las estrellas nuevas guardan `region`; las antiguas sin ese dato se conservan pero no se atribuyen a un lugar. Música no inventa un historial previo: empieza a registrarse desde esta versión. El estado adicional vive en `S.journal` y se normaliza al abrir la Bitácora.

## 10. Roadmap vigente

La lista única, ordenada y con criterios de aceptación está en **[PENDIENTES.md](PENDIENTES.md)**. El historial completo de etapas terminadas está en **[CAMBIOS.md](CAMBIOS.md)**. No tratar las etapas terminadas como nuevas tareas ni asumir que una primera versión agota la visión.

La siguiente etapa de producto propuesta es dar mayor iniciativa al ambiente tras unos 60 segundos de quietud, después de escuchar en móvil la mezcla con los instrumentos procedurales ya integrados. Jay pidió además ampliar la biblioteca a ~100 ritmos (ver PENDIENTES, etapa 1b). Favoritos, retorno, autopilot, looper, escenas y multiplayer siguen pendientes. Jay autoriza cada rama por separado.

## 11. Flujo de ramas y deploy

```bash
git fetch origin main
git switch -c tipo/nombre-del-cambio origin/main
# Implementar y verificar el cambio; revisar el diff y preservar trabajo previo.
git add archivo-modificado
git commit -m "Descripción del cambio"
git push -u origin tipo/nombre-del-cambio
```

Crear la rama en el checkout aislado existente; no crear un worktree salvo petición explícita de Jay. Antes de cambiar de rama, revisar el estado de Git y preservar cambios locales. No basar una etapa nueva en una rama pendiente de merge salvo que se acuerde esa dependencia.

Después del push, entregar a Jay la rama, el commit, los cambios y el resultado de las verificaciones. **Jay crea el PR y hace el merge.** El asistente no crea PRs, no hace merges ni push directo a `main`. Vercel (proyecto `whitedot`) despliega producción al integrar en `main`; un push a la rama no confirma un despliegue de producción.

No hay build ni variables de entorno de aplicación: es un sitio estático.

## 12. Prompt sugerido para arrancar en otra IA

> Soy Jay. Estoy haciendo WHITEDOT / Pixel Blanco, un juego web de música electrónica generativa con Canvas + Web Audio y módulos JavaScript nativos. Lee HANDOFF.md, CAMBIOS.md, PENDIENTES.md y el código actual de `main`. Respeta las decisiones de la sección 3. Quiero que construyas [etapa autorizada del roadmap]. Implementa y verifica los cambios en una rama nueva desde `main` actualizado, haz commit y push y entrégame la rama y los resultados. Yo creo el PR y hago el merge. Háblame en español, directo.

### Sitios raros (octubre de 2026)

`src/relics.js` usa la semilla independiente `relic-site:v1`, excluye los chunks centrales con max(abs(cx),abs(cy)) < 2 y no modifica terreno ni objetos anteriores. `S.relicSites` conserva sitios obtenidos; la resonancia es temporal y se limpia al salir del Mundo. `tests/relics.mjs` verifica rareza, coordenadas negativas, condiciones, duplicados, recarga y compatibilidad. El logro histórico `dia3` conserva su ID y requiere tres hallazgos en un día. Ya no hay objetivo diario de tres reliquias.

### Dirección musical: electrónica contenida

Jay pide evitar ritmos y sonidos con sensación de videojuego. Priorizar groove, espacio, motivos reconocibles y evolución gradual. Las posiciones de golpes secundarios se conservan durante cuatro compases, con variaciones de intensidad; los fills quedan al final del grupo. La radio conserva motivos durante cuatro frases, con 2–3 notas por compás en familias minimal/dub y hasta 5 en las demás; el timbre cambia por sección. Se eliminan los saltos de octava por densidad y la respuesta automática de campanas a la frase del jugador en el Mundo. Los plucks del Mundo tienen filtro suave, menos armónicos brillantes y envíos de eco/reverb más contenidos; Camino y Estudio conservan su síntesis anterior. La obtención de reliquias usa un acorde suave en vez de una fanfarria ascendente. Las respuestas completas de objetos repiten la nota con menos intensidad en vez de añadir automáticamente una subida melódica. Evaluar el resultado audible en móvil: las pruebas verifican continuidad, densidad y programación del audio, no certifican calidad artística.

### Efectos locales de interacción

`effect:v1:<región>:<tipo>` asigna un carácter musical estable sin cambiar el reparto de roles ni el terreno. `withVoiceEffect` redirige solo la construcción síncrona de una nota y restaura los destinos incluso si falla el sintetizador. El eco tiene una sola repetición de tres semicorcheas, filtrada y sin feedback adicional; espacio reutiliza la convolución existente. La modulación metálica añade una banda lateral discreta y conserva la señal original. Los envíos previos de esa nota se atenúan para no apilar ecos. `effectsTick` desconecta los nodos después de su cola; con 12 grupos activos las notas adicionales siguen sonando con su voz natural. Silencio, Camino y Estudio no crean estos efectos. La función “robot” se interpreta aquí como modulación metálica de sintetizador; la Voz del sistema sigue siendo texto.

### Resumen de sesión

`src/session.js` guarda una base de contadores al entrar al Mundo, antes de registrar el lugar de entrada. `S.session` contiene actividad y música escuchada, con versión 1; `S.lastSession` es un resumen terminado e independiente de los cambios posteriores. El panel muestra la sesión actual o la última y no aparece automáticamente al salir. El botón Resumen de la pantalla de linterna agotada también lo abre. Los instrumentos se anotan desde el registro musical existente, solo cuando el sonido está activo. Las interacciones cuentan acciones sobre objetos y los pulsos del jugador, no pistas grabadas. Se mantiene la clave v4 y las partidas anteriores empiezan sin historial de sesiones inventado.

### Paletas electrónicas ampliadas

`src/palettes.js` añade tropical house, melodic house, electro robótico y nu-disco (22 géneros al terminar esa etapa; ahora 34). La semilla independiente `world-palette:v1` asigna una nueva paleta al 40 % de regiones elegibles; Origen y Vacío conservan su selección anterior. Solo cambian género, escala, tempo e instrumentos de la pista. Se conservan el terreno, nombres, criaturas, posiciones, rasgos y descubrimientos. Las paletas tropical/disco favorecen modos mayores o dóricos/mixolidios; melódico usa menor/dórico y robótico menor/frigio.

`src/instruments.js` sintetiza steel pan, kalimba FM, teclas FM cálidas, cuerdas analógicas, metales, clavinet, bajo elástico filtrado, bajo modular FM, formantes y teclas metálicas. Añade güiro y timbal sintetizados. Son aproximaciones electrónicas mediante parciales, FM y filtros, sin muestras grabadas. Sus envelopes tienen duración acotada y los destinos respetan los efectos locales. Las voces de objetos usan los instrumentos de su paleta: no se agregan teclas o marimba genéricas a esas cuatro familias. La percusión y los patrones de bajo y melodía también cambian por estilo. Bitácora y Escuchar explican los instrumentos nuevos. `tests/palettes.mjs` comprueba familias, síntesis distinta y cinco fixtures del mundo anterior; el scheduler verificaba entonces 22 géneros y ahora ejercita los 34. La calidad y el equilibrio final requieren escuchar en móvil.

### Gramática musical y curaduría

`src/grammar.js` genera perfiles independientes por región/género (`grammar:v1`): célula y rotación de acentos, instrumento de detalle, progresión armónica, duración de armonía/frase, desplazamiento del motivo, límites de densidad y brillo. La radio conserva anclas, cambia articulación dentro del motivo y desarrolla frases nuevas con el reloj musical aunque el jugador esté quieto. El reloj armónico se mide desde la entrada a la región; sus progresiones usan grados de la escala del lugar y el pad mantiene conducción de voces. Moverse ya no reinicia el pad con el mismo acorde. La etapa no añade todos los géneros de referencia ni autopilot/favoritos: son fases posteriores del plan.

La curaduría atenúa voces superpuestas por semicorchea, especialmente bajos repetidos y agudos. Un shelf suave, paso bajo y compresor controlan la salida. El menú ofrece Escucha suave: menor volumen y brillo, persistidos en `S.softMusic` dentro de v4; respeta Silencio. Escuchar muestra el carácter del perfil. Las cuatro paletas anteriores ahora tienen su percusión en `drums()`, la ruta que usa el Mundo; antes sus casos estaban por error en el dispatcher antiguo `kitPlay()`. Las pruebas del scheduler exigen bombo en las cuatro, además de bajo y melodía. Esta versión construye variación combinatoria con continuidad musical; el gusto y el equilibrio perceptivo se validan escuchando en móvil.

### Plan ampliado acordado con Jay

Trasladado y actualizado en [PENDIENTES.md](PENDIENTES.md), incluyendo prioridades musicales, puntos favoritos, navegación, autopilot y multiplayer. Ese archivo sustituye las listas anteriores.

### Audio por proximidad

`src/spatial.js` atenúa cada voz con fuente física mediante una curva suave: máxima presencia junto al objeto, mitad de amplitud a 180 px y cero a 360 px. Nunca eleva la voz por encima de su volumen normal. Sus rutas de señal directa, reverb y delay siguen la posición del objeto y del jugador durante la nota, con transiciones de 120 ms. La reverberación global ya emitida conserva su cola natural. Las fuentes más próximas tienen más probabilidad de responder en el ensamble automático; no se agregan disparos ni se altera la radio. Los claros de escucha mantienen el ensamble automático vacío.

Hasta 32 grupos de proximidad, liberados después de 3 segundos desde el inicio de la nota; al llegar al límite, las nuevas notas usan atenuación fija por distancia. Las rutas se restauran incluso al fallar la síntesis y son compatibles con efectos locales, curaduría y Escucha suave. La composición base y las capas desbloqueadas de faros no tienen fuente física y conservan su mezcla. No se introduce guardado nuevo.

### Vecindarios musicales

`src/neighborhoods.js` genera un campo suave de tempo, afinación por quintas y carácter armónico sobre una cuadrícula de cuatro regiones. La selección de género favorece los rangos de tempo cercanos al campo; se mantienen los tempos propios de cada estilo y las paletas visuales/objetos anteriores. Origen mantiene minimal y Vacío mantiene ambient. El carácter musical de algunos lugares cambia. Las fronteras mezclan ahora percusión, bajo y melodía con pesos complementarios; la voz vecina usa la escala y afinación activas mientras se mezcla para evitar choque armónico. Se conserva la banda de transición de 900 px y una sola región vecina a la vez. No se simula todavía una mezcla de cuatro regiones en esquinas.

### Nuevas referencias electrónicas

`src/references.js` añade 12 familias: tech house, electrónica andina, cosmic disco, melodic techno, organic house, amapiano, jazztronica, Berlin School, IDM, liquid drum & bass, darkwave/EBM y algorave. Junto con las anteriores hay 34 estilos base; se siguen combinando con gramáticas regionales. No se copian canciones de los artistas citados. Las referencias tienen ritmos de percusión y frases de bajo/melodía propios, paletas de instrumentos y modos compatibles. Electrónica andina usa un vocabulario melódico pentatónico; jazztronica incluye séptimas; Berlin/EBM priorizan secuencias estables; algorave rota acentos euclidianos. El nuevo log drum FM aporta el bajo percutido del amapiano. “Algorave” es una inspiración generativa, no un editor de live coding.

La selección entra en el campo de vecindarios musicales; los tempos mantienen sus rangos y se conserva la mezcla por fronteras. Las pruebas de evolución valoran cambios audibles de bajo, motivo, timbre y armonía, para permitir que una melodía hipnótica repita mientras la composición se desarrolla. Las voces de objetos, Bitácora y Escuchar reconocen los instrumentos nuevos. El mapa y los registros previos se conservan; incorporar familias cambia la elección musical de algunas regiones. La etapa de instrumentos procedurales (`6bf69f6`) quedó integrada en `main` con el PR #25.

### Fenómenos musicales ambientales

`src/phenomena.js` mantiene una caché separada (máximo 64 chunks) sin modificar la generación anterior: uno o dos fenómenos por chunk, con semilla `phenomena:v1`, y uno en Vacío. Aves de eco poco frecuentes responden al final de frases con dos notas del acorde y timbres de la paleta local. Semilleros de caja reaccionan visualmente a las cajas y claps reales de la música, sin duplicar el golpe; al tocarlos o emitir su acento propio sí generan una caja discreta. Nubes de pulso emiten notas graves con un pequeño ruido filtrado y dibujan un relámpago local.

Los sonidos usan proximidad, efectos y curaduría; el dibujo consulta los inicios programados en el reloj de audio. Máximo un fenómeno autónomo por compás, con ciclos de cuatro/ocho compases y cooldown. Los claros de escucha omiten su generación sonora automática; interacción directa sigue disponible. Escuchar incluye nombre, rol e instrumento de los fenómenos. No se agregan descubrimientos, muestras o logros nuevos; los encuentros son por ahora sonoros y visuales. Los rayos originales de Tormenta y la lluvia anterior se conservan.

### Instrumentos procedurales

`src/patches.js` deriva material, brillo, resonancia, ataque, caída, armónicos, modulación y envíos de una semilla estable por región/instrumento/rol/objeto. Usa ID o rasgos individuales inmutables; no usa la posición móvil, así que tocar o desplazar un objeto no cambia su timbre. Materiales: madera cálida, cristal suave, metal filtrado y aire sedoso, con preferencias por familia musical. La nota fundamental no se desplaza; solo los parciales secundarios reciben desafinación suave, y los bajos no se desafinan.

Las familias nuevas modifican su síntesis de parciales/FM y envolvente. Las anteriores reciben color de filtro, cambios de ataque/caída y armónicos cuando su síntesis lo permite. Percusión conserva su golpe con filtro y envolvente propios. También se aplica a la radio, las voces vecinas y los fenómenos; Escuchar muestra el material. Hasta 32 rutas de color durante dos segundos y 256 perfiles en caché, reconstruibles al revisitar. Al alcanzar el límite se conservan las variaciones de síntesis sin crear más filtros. Camino y Estudio no crean perfiles nuevos. Compatible con proximidad, efectos, curaduría y Escucha suave; sin guardado adicional.

### Atlas de ritmos (prototipo)

Menú → Prototipo → **Ritmos**. `src/atlas.js` recorre 61 × 61 regiones alrededor del origen (3.721, unos 200 ms; se calcula al abrir y queda en caché) y lista cada género de `GEN` ordenado por tempo: BPM, origen (Base / Paleta / Referencia), cuántas regiones lo tienen, la región más cercana y si ya se escuchó (`S.journal.music.genres`). **Ir** pone al jugador en el centro de esa región; si estaba en el Camino sin completar, completa el día (herramienta de prueba) y entra al Mundo. No agrega campos al guardado. Sirve para probar cada ritmo y para verificar que todo género nuevo es alcanzable: `tests/atlas.mjs` falla si algún género no aparece en el área.

El Atlas tiene filtros por familia y "Sin probar", y un cuadro para marcar cada ritmo como probado (`S.atlasTested`, dentro de v4, solo herramienta de prueba).

### Biblioteca de ritmos y reparto equilibrado

Antes, el género lo decidía en la práctica `applyNeighborhood`: entre los estilos compatibles con el tempo del campo musical elegía al azar, así que los de rango de tempo amplio acaparaban el mundo (IDM ≈ 13 %, algorave ≈ 11 %; deep house ≈ 1 %). Ahora `genreWeights()` en `src/neighborhoods.js` calcula, una vez y en caché, un peso por género con ajuste iterativo sobre los tempos de 61×61 regiones, y la elección es ponderada. La ventana de compatibilidad pasó de 3 a 5 BPM. Resultado con 52 estilos: máximo ≈ 3,4 % (footwork, que es casi el único estilo en 150–165 BPM), mínimo ≈ 0,7 %; ambient ≈ 6 % porque además ocupa el Vacío. La vecindad de tempo se conserva (≈ 9 BPM entre vecinas frente a ≈ 26 entre lejanas). Esto cambia el género de muchas coordenadas antiguas; el paisaje, nombres e IDs no cambian.

**Para añadir una tanda:** agregar recetas en `RHYTHM_GENRES` con `family` (y la familia en `FAMILIES` si es nueva). Audio (`drums`), radio (bajo y frase), voces, Bitácora, Atlas y pesos las recogen solas. Campos de batería admitidos: kick, snare, clap, clapRoll, rim, hat, hatO, hatRoll (ráfaga de tresillos), conga, tom, cowbell, shaker, chord (con `chordI`). `kickTone:[frecuencia final, decaimiento]` da el carácter del bombo (808 largo ≈ `[38,.8]`). `v` permite tres variaciones que rotan cada cuatro compases. `tests/rhythms.mjs` exige receta completa, batería no repetida, instrumentos con explicación y reparto entre 0,5 % y 3,6 %.

### Mundo infinito · fase 1: continentes, contraste y horizonte sonoro

`src/continents.js` añade una escala por encima de las regiones. Semillas de continente en celdas de 10×10 regiones con peso de tamaño muy desigual (pocos gigantes, muchos medianos, islas de 1–6 regiones), diagrama de Voronoi ponderado y deformación del dominio con ruido para que las fronteras sean curvas. El 20 % de las celdas no tiene semilla (océano abierto). Donde dos continentes casi empatan, o lejos de toda semilla, hay **mar de silencio** (~32 % del mundo): la región usa el bioma Vacío, ambient y casi nada de vida. El Origen y sus 2 anillos siempre son tierra ("Tierra de Origen", familia house, tono de Do).

Cada continente tiene nombre, tamaño, familia de géneros (elegida en proporción a cuántos estilos tiene la familia), tonalidad y color. Efectos:
- **Tono:** todas sus regiones comparten tonalidad (`trOff` sale del continente). Cruzar de continente es un cambio de tono.
- **Tempo y género:** `musicalContext()` en `neighborhoods.js` centra el campo de tempo en el tempo del continente (el campo suave queda como desviación de ±~25 BPM). Los géneros de su familia pesan ×6. `genreWeights()` incluye esa afinidad en el ajuste, así que el reparto global sigue parejo (en tierra cada estilo ≈ 1–2,3 %) y ~53 % de las regiones de tierra son de la familia de su continente. El cálculo tarda ~250 ms y se hace al cargar, durante el Camino (`main.js`).
- **Color:** el tono de color de cada región se acerca al del continente.
- **Aviso:** tarjeta de zona con el continente o "Mar de silencio"; frase grande al entrar a otro continente (espera a que la interfaz esté libre). `S.continents`, `S.continentsN`. Logros `continente3` y `mar1` (oculto, cruzar un mar entero), frases de la Voz.

**Vitalidad** (`continents.vitality`): campo continuo de ruido con contraste fuerte. Sustituye los 5 niveles de relleno en la generación de chunks (`densityOf`: 0,1× a 2,7×); `d.fill` se calcula de la vitalidad del centro de la región solo para etiquetas. En mar casi cero; cerca de la costa baja; el Origen nunca baja de 0,55. En la música, la vitalidad limita la energía (`vitCap` en `audio.js`): en lo vacío queda pulso y poco más. Si pasas más de 12 s en vacío y llegas a una zona llena, suena un **drop** (`dropHit`: bombo largo, platillo filtrado y acorde), la energía sube y aparece "Oasis". `MU.vit`, `MU.lowT`, `S.oasisN`.

**Hitos** (`src/landmarks.js`): torre de luz, árbol madre, ciudad de formas, monolito y faro (solo en el mar). 1 de cada 10 regiones de tierra y 1 de cada 6 de mar; la región (2,0) siempre tiene una torre que se oye desde el Origen. Cada hito tiene motivo propio que se ajusta al acorde actual.
- **Se oye** hasta 11.000 px: cadena propia con filtro de paso bajo según la distancia (lejos suena apagado), paneo estéreo según la dirección y envío a reverb. Máximo 2 hitos, cada uno cada 4 compases. Deja de sonar de lejos al llegar.
- **Se intuye** hasta 5.500 px: brillo en el borde de la pantalla, en su dirección, que late con su motivo.
- **Se ve** en pantalla como silueta grande, incluso fuera del radio de luz.
- **Llegar** (<170 px) lo registra en `S.landmarks`, con toast, Voz y logros `hito1` y `hito10`. Sin flechas ni brújula.

Cambios de compatibilidad: el paisaje de muchas coordenadas cambia (mares, densidad, color, géneros). Los fixtures de `tests/palettes.mjs` se recapturaron como "mundo continental v2". Nombres, IDs de criaturas y guardado v4 se conservan. Pruebas: `tests/world.mjs` (continentes deterministas, tamaños desiguales, islas, mares, identidad de familia, contraste de vitalidad, hitos) y `tests/world_smoke.py` (paneo del horizonte, mar, oasis y llegada a un hito en móvil/escritorio).

### Mundo infinito · fase 2: viaje, tierras raras, mapa y volumen

**Más lejos, más raro** (`strangeness()` en `continents.js`): 0 hasta 8 regiones del Origen, sube suave hasta 1 a 60 regiones. En `regionAt`, con semilla aparte `strange:v1`: criaturas hasta 2,4× más grandes, paleta cada vez más saturada y con acentos de tono imposible, y `tuneCents` de hasta ±55 cents por región. `hz()` en `audio.js` aplica `MU.tune` (solo en el Mundo), así que toda la música de la región, hitos incluidos, queda desafinada de forma consistente. Primer aviso de la Voz al pasar 0,35 de rareza.

**La distancia cuesta y el Estudio es campamento:** la linterna diaria ya limitaba el viaje y el Mundo ya arrancaba desde el Estudio desplegado. Ahora se ve: récord `S.maxRing` con aviso cada 5 regiones, logros `lejos10`, `lejos30` y `lejos60` (oculto), y al entrar desde un Estudio lejano aparece "Campamento · a N regiones del Origen".

**Mapa** (`src/map.js`, menú → Mapa): solo dibuja regiones visitadas (`S.places`), con el color de su continente (más saturado si es tierra rara), mares como puntos, nombres de continentes, hitos visitados con su símbolo, hitos solo oídos como "?" (`S.heardLm`, se registra cuando un hito suena de lejos; máximo 600), Origen, Estudio y tu posición. Dos zooms (todo / cerca, 15×15 regiones) y tarjeta "MI MAPA" para compartir. Logro `mapa1`.

**Volumen (pedido de Jay: "esto debe ser una fiesta"):** cadena de salida nueva: low-shelf +3 dB a 110 Hz, compresor más firme (−24 dB, 4:1), ganancia de compensación ×3,4, limitador a −3 dB y saturación suave tanh final. `musicVolume()` normal pasa de 0,85 a 1. Medido en el navegador en Origen con energía alta: RMS de ~−15,6 dB a ~−9,3 dB (unos 6 dB más fuerte) con picos bajo 0 dB. Escucha suave conserva su nivel bajo (sin realce de graves, compensación ×1,6).

Pruebas: `tests/journey.mjs` y `tests/journey_smoke.py`; fixture de `(-30,-20)` recapturado (ya cae en zona de rareza leve).

### Móvil como app (PWA) y control táctil

- **Instalable:** `manifest.webmanifest` (pantalla completa, vertical, iconos en `icons/`), `sw.js` (red primero, caché como respaldo sin conexión; cada deploy llega sin quedarse con versiones viejas) y metas de Apple. En el teléfono: Compartir → Añadir a pantalla de inicio (iOS) o Instalar app (Android).
- **Sin gestos del navegador:** `html,body` fijos, `touch-action:none`, `overscroll-behavior:none`, sin zoom (`user-scalable=no`) y `src/pwa.js` bloquea pinza, doble toque y arrastres de página (salvo listas con scroll de los paneles).
- **Control:** joystick flotante. Arrastrar desde cualquier punto de la pantalla mueve al pixel hacia donde mueves el dedo desde donde empezaste; se dibuja un círculo guía. El arrastre también funciona si empieza sobre textos del HUD o la Voz (antes no: por eso "solo iba para arriba"). Un toque en la Voz la sigue abriendo; un toque en el mundo lanza el pulso.
- **Visibilidad:** halo y anillo fino alrededor del pixel en el Mundo; densidad máxima de los oasis reducida a ~2× para no tapar al pixel.
- Prueba: `tests/mobile_smoke.py` (móvil emulado a 3×: sin zoom ni desbordes, arrastre en las cuatro direcciones desde arriba, abajo y centro, manifiesto e iconos).

