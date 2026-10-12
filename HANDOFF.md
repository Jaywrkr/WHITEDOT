# HANDOFF · WHITEDOT / Pixel Blanco

> Documento de traspaso para continuar el desarrollo con otra IA (ChatGPT, Claude, etc.) o con otro dev.
> Pega este archivo entero como contexto y después pide lo siguiente. Última actualización: 2026-10-12.

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
- **Descubrimientos excepcionales:** Jay quiere encontrar cosas mágicas muy rara vez, con identidad propia y difíciles de conseguir. Las reliquias actuales le resultan demasiado fáciles. Esta dirección está acordada; su implementación sigue pendiente.
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
| `src/audio.js` | Web Audio, scheduler, armonía, síntesis, géneros y tracks. |
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
| `src/controls.js` | Botones, controles de prototipo y sonido. |
| `package.json` | Declara módulos ES para Node y `npm test`; no instala dependencias de aplicación. |
| `tests/core.mjs` | Compatibilidad del guardado, tope diario y mundo determinista. |
| `tests/smoke.py` | Flujos funcionales del navegador en móvil y escritorio. |

### Estado guardado `S` (localStorage)

```
offset, lastDay, streak, best, totalDays, totalLight, todayKey, todayLight, capShown,
collected[], trail[], px, py, ach{}, sound, mode("camino"|"world"|"studio"),
wx, wy (posición en el mundo), lampDay, lampUsed, species{}, rel, stars[], help{},
zones{}, bag{muestra:cantidad}, studio{x,y,biome,slots{}}, color, cat{} (catálogo de especies),
catN, places{}, placesN, retos{}, retosN, events{}
```

Si cambias la forma de `S` de forma incompatible, sube la `KEY` (por ejemplo a `v5`) o agrega una migración. `Object.assign(fresh(), saved)` ya rellena los campos nuevos.

## 5. Mundo procedural

- **RNG con semilla:** `seedOf(str)` (hash FNV) y `rng(seed)` (tipo mulberry). La semilla es fija, así que el mundo es igual para todos.
- **Chunks:** `WCH=900` px. `wchunk(cx,cy)` genera plantas, props, especies y luces. Las reliquias se generan aparte en `todayRelics()`.
- **Regiones:** `REG=4` chunks por lado (3.600 × 3.600 px). `regionAt(cx,cy)` recibe coordenadas de chunk, calcula la región y devuelve su **ADN**:
  - Identidad: `name` (generado con sílabas) y `trait`.
  - Visual: `hue`, `pal` (paleta armónica), `ground`, `air`, `plants`.
  - Música: `scale`, `trOff` (transposición), `pat` (patrón generado con `euclid()`), `kOff`, `track` (bajo y hook), `genre`, `bpm`.
  - Vida: `species` y `fill` (densidad).
  - Juego: `reto` y `mix`.
- **Bioma base:** cada región parte de un bioma de `BIOMES` (llanura, bosque, lago, ruinas, jardín, dunas, cristales, faros, tormenta, cueva, vacío). La disponibilidad depende de la distancia al origen: `d = 2 * max(abs(rx), abs(ry))`, y se eligen biomas cuyo `minD <= d`. No depende de los días jugados.
- **Gravedad regional (implementada):** semilla independiente `gravity:v1:<región>`. Ligera: velocidad ×1,35; normal: ×1; alta: ×0,7. Origen es normal. Solo modifica el movimiento del jugador en el Mundo, no el Camino, el Estudio ni la velocidad de criaturas. Se mezcla en ambos ejes dentro de 900 px de una frontera, incluyendo esquinas y coordenadas negativas. La tarjeta del lugar indica su gravedad y tipo de movimiento. Es una propiedad de movilidad, no una simulación física de gravedad vertical. No cambia mapa ni guardado v4.
- **Mini-biomas:** cada chunk tiene una variante de `VARS` (claro / espeso / húmedo / eco / brillo).
- **Hábitat:** `HAB` (equilibrado, florido, salvaje, mineral, desierto) multiplica las cantidades de flora, fauna y minerales.
- **Bordes:** en una franja `BAND=900` px cerca del borde de la región, todo se mezcla con la región vecina:
  - el suelo, con dithering;
  - el aire, con pesos en `drawAir`;
  - las plantas del vecino, que aparecen en los chunks de borde;
  - el audio: `MU.nb` y `MU.nbW` hacen crossfade de drums y BPM.
- **Aire (`AIRP`):** claro, esporas, niebla, polvo/arena en el aire, etc.
- **Eventos actuales por región:** lluvia de notas, eclipse, migración y aurora (`eventOf`). Cada región salvo Origen tiene un 15 % de probabilidad diaria de tener un evento, determinado por semilla. Esto no constituye todavía un sistema de encuentros únicos o de rarezas coleccionables.
- **Reliquias actuales:** 3 por día (`todayRelics()`), a distancias de 520, 1.300 y 2.400 px de la posición del jugador cuando se genera la lista de ese día. Una flecha apunta a la más cercana sin recoger. Al recogerlas se añaden estrellas a la constelación; no se conserva en ellas la región de procedencia. Jay quiere revisar su dificultad, no dar por definitivo este sistema.
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
- **Géneros (`GEN`):** ambient, downtempo, dub techno, deep house, afro house, minimal house, rominimal, acid techno, breaks, UK garage, tribal y dub profundo.
  - Cada uno define rango de BPM, swing (`sw`), patrón, instrumento de bajo (`bassI`) y de hook (`hookP`), y nivel de pad.
  - `GPOOL[bioma]` define qué géneros puede tener cada bioma.
- **`drums(gid, …)`:** los patrones de batería de cada género. Se escriben a mano con kick, clap, hats, congas, clave, rim y shaker.
- **`playTrack(dna, …)`:** bajo y hook de la región, tocados con los instrumentos del género.
- **Instrumentos (todo síntesis):**
  - Percusión: kick, snare, clap, hat, conga, clave, wood.
  - Bajos: softBass, houseBass, acid (303-like), reese, fmBass.
  - Melódicos: stab, pluck, sawLead, organ, flute, marimba, glass, keys; también dubChord y organChord.
- **Mezcla espacial:** en la franja del borde, `VW` escala el volumen de las dos baterías y el BPM hace lerp entre las dos regiones.
- **Camino:** casi ambient (`GEN.ambient`).
- **Efectos existentes:** filtro de paso bajo al entrar al agua, reverb por convolución, delay sincronizado al tempo y cambios de feedback/envío en cuevas y variantes de eco. Jay quiere ampliar los efectos según acciones y lugares (filtros, reverb, eco, robot, etc.); los efectos nuevos siguen pendientes. La voz robótica no está implementada: la Voz del sistema actual es texto.
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
- **Pruebas versionadas:** `npm test` (core, radio y voces regionales) y `python3 tests/smoke.py`. El smoke test inicia y detiene su propio servidor en un puerto libre, usa Chromium y no modifica las partidas del navegador personal. Requiere Python Playwright (ver README); las pruebas core solo requieren Node. No hay CI configurado.
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
- **Bitácora aún sin interfaz propia:** `S.cat` y `S.places` guardan identificadores, y Logros muestra una lista breve de formas recientes. No se guarda un historial completo de géneros/instrumentos escuchados ni se vinculan las estrellas a sus regiones; esa información necesita un diseño de persistencia para la futura Bitácora.

## 10. Roadmap priorizado

**Etapas acordadas como orden de trabajo; cada implementación requiere que Jay autorice su etapa:**

1. **Corregir la base — completado:** activar retos al entrar/reentrar al Mundo, limpiar la transición de día, respetar el tope de crecimiento y pausar el consumo de linterna en menús. Integrado en `main` mediante el PR #1.
2. **Actualizar documentación — completado:** estado real del juego, diferencias con el diseño y flujo de ramas. No incluye cambios de jugabilidad.
3. **Organizar el código en módulos — completado:** JavaScript nativo, CSS separado y contexto interno para conservar comportamiento y partidas v4. Sin introducir TypeScript, Vite o un build.
4. **Radio generativa — implementada:** evolución del Mundo por frases y secciones incluso estando quieto.
5. **Identidad musical regional — esta etapa:** reparto de roles, registros e instrumentos entre objetos y criaturas, estable por semilla y variable entre regiones del mismo bioma.
**Propiedades físicas regionales — implementadas antes de la Bitácora:** gravedad, velocidad y aviso al entrar. La Bitácora deberá registrar esta propiedad.

6. **Bitácora** (estilo No Man's Sky / Astroneer), con 4 pestañas:
   - **Lugares:** regiones visitadas con % completado (especies, reto, evento, reliquia).
   - **Formas:** especies agrupadas por rol musical.
   - **Música:** géneros, escalas e instrumentos escuchados, cada uno con una explicación corta. Aquí se aprende música.
   - **Logros:** por categoría, con los ocultos como "???".
7. **Escuchar (escáner):** mantener presionado muestra qué suena cerca: género, escala, la especie y su rol.
8. **Encuentros mágicos y reliquias:** hallazgos muy raros y memorables; revisar la dificultad de las reliquias y su guía directa. Diseñar pistas, condiciones y recompensas al abordar esta etapa.
9. **Efectos por acciones y lugares:** ampliar filtros, reverb, eco y transformaciones robóticas con respuestas musicales claras, sin tapar la mezcla. Pendiente de implementación.
10. **Resumen de la sesión:** descubrimientos, retos y música creada, con tarjeta para compartir.
11. **Looper / ecos y banda de criaturas:** grabar 1–2 compases y dejarlos en el mundo; sumar capas de bajo, percusión, melodía y voz con las criaturas que siguen al jugador y combos musicales.
12. **Ampliar el Estudio y los descubrimientos:** combinar muestras, decorar y nombrar especies y lugares; mostrar esos nombres en las tarjetas.
13. **Optimizar según pruebas en móvil:** rendimiento visual y estabilidad del audio. Evaluar AudioWorklet si las pruebas detectan problemas de timing.

La rareza y los efectos nuevos siguen pendientes. Para los hallazgos falta definir si «único» significa único en una partida o compartido entre jugadores; aún no hay probabilidades, reglas de obtención ni recompensas nuevas implementadas.

**Después:**

- Portar las frases corregidas de la Voz.
- Cuentas y guardado en la nube (Supabase).
- Empaquetar con Capacitor (iOS/Android) y Tauri (desktop).
- Multiplayer o visitas a Estudios de otros jugadores.

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

> Soy Jay. Estoy haciendo WHITEDOT / Pixel Blanco, un juego web de música electrónica generativa con Canvas + Web Audio y módulos JavaScript nativos. Lee HANDOFF.md y el código actual. Respeta las decisiones de la sección 3. Quiero que construyas [etapa autorizada del roadmap]. Implementa y verifica los cambios en una rama nueva desde `main` actualizado, haz commit y push y entrégame la rama y los resultados. Yo creo el PR y hago el merge. Háblame en español, directo.
