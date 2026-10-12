# HANDOFF · WHITEDOT / Pixel Blanco

> Documento de traspaso para continuar el desarrollo con otra IA (ChatGPT, Claude, etc.) o con otro dev.
> Pega este archivo entero como contexto y después pide lo siguiente. Última actualización: 2026-10-12.

- **Juego en vivo:** https://whitedot-inky.vercel.app
- **Repo:** https://github.com/Jaywrkr/WHITEDOT (rama `main`). Cada push a `main` despliega solo en Vercel.
- **Documento de diseño (más largo, visión completa):** https://claude.ai/code/artifact/034e1ffb-4be3-4044-9a25-47da3d713190
- **Código:** todo está en `index.html`, unas 1.600 líneas con HTML, CSS y JS juntos.

---

## 1. Cómo trabajar con Jay (léelo primero)

- Llámalo **Jay**. Sé directo y práctico, sin halagos. Él prueba en el **móvil**, así que todo tiene que funcionar con el dedo.
- Él da feedback por sensación ("suena robótico", "no siento que cambia"). Tradúcelo a cambios concretos y hazlos. No le devuelvas preguntas técnicas.
- Responde en **español**. Todo el texto del juego está en español.
- Cuando dice "hazlo", quiere el cambio implementado y desplegado, no un plan.

## 2. Visión

Un pixel blanco en un mundo negro que va creciendo. **El centro de todo es la MÚSICA**: electrónica que va del ambient al minimal tech house (afro house, minimal house, rominimal, dub techno, deep…).

- **Camino diario:** corto. Construye constancia y racha, y el crecimiento tiene tope por día. Su música es casi ambient. No debe convertirse en grind.
- **Mundo:** se abre después del camino. Es infinito y procedural, y todo genera música. Ahí está la diversión de verdad.
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

## 4. Arquitectura de `index.html`

Es un archivo único sin build. El orden importa porque todo es global.

| Línea aprox. | Sección | Qué hay |
|---|---|---|
| 1–275 | HTML + CSS | `<canvas id="w">`, HUD, dock (`bPrimary`, `bDeploy`, `bMenu`), modal del menú (`bWorld`, `bStudio`, `bSky`, `bAch`, `bSound`, `bShare` y una sección "Prototipo" con `dFill`/`dNext`/`dSkip`/`dReset`), tarjeta de zona `#zone`, línea `#reto`, `#voice`, `#studioPanel`. |
| 280–455 | Tablas de datos | `BIOMES`, `ZINFO`, `VARS`, `HAB`, `TRACKP`, `GROUNDP`, `AIRP`, `PLANTP`, `GEN`, `GPOOL`, `FILL`, `PROPK`, `SPECIES`, `ACH`, `SAMPLES`, `COLORS`, `VOZ`. |
| 456 | estado | `KEY="pixel-blanco-v4"`, `fresh()`, el objeto `S`, `save()`, `dayKey()`, días y racha. |
| 502 | camino | Camino diario `pathY(x)`, luces y tope (CAP). |
| 514 | mundo | Chunks, regiones, ADN de región, eventos, reliquias y retos. |
| 613 | música generativa | Scheduler, armonía, instrumentos sintetizados, `drums()`, `playTrack()`, `playStep()`. |
| 879 | canvas | Dibujo: suelo, plantas, props, sprites, aire, estudio, física, pulso. |
| 1125 | glifos | Pixel font o íconos. |
| 1145 | loop | `frame()`, `caminoStep()`, `worldStep()`, descubrimiento, entrar y salir del mundo. |
| 1454 | HUD | `hud()`, toasts, `unlock()` de logros. |
| 1506 | constelación | Cielo con las reliquias recogidas (`openSky`). |
| 1531 | tarjetas | `shareCard()`, una imagen para redes. |
| 1554 | botones | Eventos de UI e input (touch, mouse, teclado). |

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
- **Chunks:** `WCH=900` px. `wchunk(cx,cy)` genera el contenido de un chunk: plantas, props, especies, luces y reliquias.
- **Regiones:** `REG=4` chunks (3.600 px). `regionAt(rx,ry)` devuelve el **ADN de la región**:
  - Identidad: `name` (generado con sílabas) y `trait`.
  - Visual: `hue`, `pal` (paleta armónica), `ground`, `air`, `plants`.
  - Música: `scale`/`mode`, `trOff` (transposición), `euclid` (patrón euclidiano), `kOff`, `track` (bajo y hook), `genre`, `bpm`.
  - Vida: `species` y `fill` (densidad).
  - Juego: `reto` y `mix`.
- **Bioma base:** cada región parte de un bioma de `BIOMES` (llanura, bosque, lago, ruinas, jardín, dunas, cristales, faros, tormenta, cueva, vacío). Los biomas se desbloquean por días jugados (`minD`).
- **Mini-biomas:** cada chunk tiene una variante de `VARS` (claro / espeso / húmedo / eco / brillo).
- **Hábitat:** `HAB` (equilibrado, florido, salvaje, mineral, desierto) multiplica las cantidades de flora, fauna y minerales.
- **Bordes:** en una franja `BAND=900` px cerca del borde de la región, todo se mezcla con la región vecina:
  - el suelo, con dithering;
  - el aire, con pesos en `drawAir`;
  - las plantas del vecino, que aparecen en los chunks de borde;
  - el audio: `MU.nb` y `MU.nbW` hacen crossfade de drums y BPM.
- **Aire (`AIRP`):** claro, esporas, niebla, polvo/arena en el aire, etc.
- **Eventos raros por región:** lluvia de notas, eclipse, migración y aurora (`eventOf`).
- **Reliquias:** 3 por día (`todayRelics`). Se guardan en la constelación (`openSky`).
- **Linterna:** dura 10 min más 1 min por cada día de racha, con un máximo de 60 (`lampMax`).

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
- **Energía `MU.E`:** sube con el movimiento y la actividad, y abre capas por umbrales (L1/L2/L3).
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

- **Sintaxis:** extrae el `<script>` y corre `node --check`.
- **Visual:** Playwright headless (chromium), abriendo `index.html` local y sacando screenshots en 390×844 (móvil) y desktop. Los errores de carga de Google Fonts sin red son esperables.
- **Audio:** en headless no se oye nada. **Jay valida el sonido en su teléfono** con la URL de Vercel. Es la prueba que importa.
- **Atajos de prototipo** (menú → Prototipo):
  - `dFill`: llena la barra del día.
  - `dNext`: avanza un día.
  - `dSkip`: salta un día y rompe la racha.
  - `dReset`: borra el progreso.

## 9. Limitaciones conocidas

- **Un solo archivo grande:** cuesta editarlo. Conviene refactorizar a módulos (TypeScript + Vite) antes de crecer mucho más.
- **Audio en el hilo principal:** con mucho en pantalla, en móviles viejos el timing puede variar. La solución futura es AudioWorklet.
- **Progreso solo en `localStorage`:** se pierde si borras datos del navegador. No hay cuentas ni nube.
- **Audio en iOS:** requiere un gesto del usuario para arrancar, y el modo silencio del iPhone puede mutear Web Audio.
- **El documento de diseño está desactualizado** en: motor de géneros, ADN de región, eliminación del slider y la propuesta de Bitácora.

## 10. Roadmap priorizado

**Siguiente (Parte 3, propuesta ya aceptada en espíritu, falta construir):**

1. **Bitácora** (estilo No Man's Sky / Astroneer), con 4 pestañas:
   - **Lugares:** regiones visitadas con % completado (especies, reto, evento, reliquia).
   - **Formas:** especies agrupadas por rol musical.
   - **Música:** géneros, escalas e instrumentos escuchados, cada uno con una explicación corta. Aquí se aprende música.
   - **Logros:** por categoría, con los ocultos como "???".
2. **Escuchar (escáner):** mantener presionado muestra qué suena cerca: género, escala, la especie y su rol.
3. **Resumen del día** al cerrar sesión o al apagarse la linterna: qué descubriste, cuánta música hiciste, y la tarjeta para compartir.
4. **Looper / ecos:** graba 1–2 compases de lo que tocas y déjalo plantado en el mundo como un "eco" que sigue sonando.
5. **Fusión / crafting en el Estudio:** combinar 2 muestras para crear una nueva (por ejemplo cristal + agua = campana húmeda).
6. **Banda estilo Incredibox:** cada criatura que te sigue suma una capa (bajo, percusión, melodía, voz). Hay combos secretos que desbloquean un "bonus" musical y un logro.
7. **Nombrar descubrimientos:** el jugador pone nombre a especies y lugares, y el nombre sale en la tarjeta.

**Después:**

- Portar las frases corregidas de la Voz.
- Refactor a TypeScript + Vite con módulos (`world/`, `audio/`, `render/`, `ui/`, `systems/`).
- AudioWorklet para el scheduler y la síntesis pesada.
- Cuentas y guardado en la nube (Supabase).
- Empaquetar con Capacitor (iOS/Android) y Tauri (desktop).
- Multiplayer o visitas a Estudios de otros jugadores.

## 11. Flujo de deploy

```bash
git add -A && git commit -m "mensaje" && git push origin main
# Vercel (proyecto "whitedot") despliega solo en ~30 s → https://whitedot-inky.vercel.app
```

No hay build ni variables de entorno: es un sitio estático.

## 12. Prompt sugerido para arrancar en otra IA

> Soy Jay. Estoy haciendo WHITEDOT / Pixel Blanco, un juego web de música electrónica generativa en un solo `index.html` (Canvas + Web Audio). Te paso HANDOFF.md con todo el contexto y el `index.html`. Respeta las decisiones de la sección 3. Quiero que construyas [X del roadmap]. Dame el código como cambios concretos (o el archivo completo) que pueda pegar y subir a GitHub. Háblame en español, directo.
