# Estado actual comprobado · WHITEDOT

**13 de octubre de 2026. Main `e27c219` (PR #73).** Esta fotografía incorpora fases 1–3, revisión musical/visual y el bloque de instalaciones de fase 4. La rama `docs/claude-handoff-current-main` actualiza documentación y atlas; no introduce funciones del juego. Entrada para continuar: [HANDOFF.md](HANDOFF.md).

## Inventario de capacidades presentes

| Sistema | Comportamiento presente | Archivos principales |
|---|---|---|
| Camino y constancia | Luz diaria, racha, eras, crecimiento, acceso al Mundo y progreso local | `data.js`, `progress.js`, `render.js` |
| Mundo y versiones | Regiones/chunks deterministas por semilla; Original y Paisajes vivos separados | `world.js`, `world-identity.js`, `seeds.js` |
| Espacios y continentes | 11 biomas, tierras/mares, vitalidad, claros, densidad regional y vecinos relacionados | `continents.js`, `neighborhoods.js`, `pockets.js`, `blobs.js` |
| Paisajes vivos | 33 hábitats, clima/fertilidad/relieve, materiales, seis familias con presencia compatible | `ecology-model.js`, `ecology.js` |
| Flora, fauna y objetos | Plantas/árboles/lotos/minerales/faros, criaturas procedurales, blobs y cinco juguetes | `world.js`, `interactions.js`, `playthings.js`, `blobs.js` |
| Individuos y contactos | Rasgos individuales; entrar responde, permanecer no repite el contacto continuamente | `personality.js`, `contact.js` |
| Radio | 52 estilos, frase/sección, bajos y silencios; evoluciona aunque no te muevas | `radio.js`, `rhythms.js`, `references.js`, `palettes.js` |
| Carácter y registros | Nueve caracteres de arreglo, paletas específicas, control de octavas y descanso de capas altas | `musical-character.js`, `voices.js`, `audio.js` |
| Composición de fase 3 | Arcos de ocho frases, articulaciones de ataque/duración/color, acentos armónicos con volumen repartido | `composition.js`, `audio.js` |
| Síntesis | Motores dedicados/modulares; reed, membrane, bowed y hollow añadidos sin redistribuir el mapa | `audio.js`, `instruments.js` |
| Producción y mezcla | Reverb/eco, FX regionales/pad, protección de salida, retornos filtrados, modo suave y proximidad espacial | `mix.js`, `effects.js`, `fxpad.js`, `patches.js`, `spatial.js` |
| Quietud | Tras 60 s de escucha activa puede iniciar respuestas ambientales; menús/suspensión no cuentan | `initiative.js` |
| Influencia y cultivo | Tocar/modelar/conectar/permanecer transforma bajo/groove/motivo/espacio; sustracción retira capas | `influence.js`, `creative.js`, `ecology.js` |
| Ecos y banda | Grabación deliberada, fijación opcional, reemplazo por papel, borrar/liberar por anillo, banda de criaturas | `jam.js` |
| Diez encuentros | Suelo resonante, sombra, flor, corriente, animal, piedra de capas, órbitas, pozo, tejedora y nube | `encounter-families.js`, `encounters.js`, `encounter-depth.js` |
| Animal de respuesta | Tocar para enseñar; aprende hasta cuatro notas de acciones del jugador y responde por turnos; no usa micrófono | `encounter-depth-model.js`, `encounter-depth.js` |
| Redes y suelo | Hilos editables/acotados; suelo con partes de bajo/groove/motivo, variación y sustracción; cajas retiradas | `encounter-depth.js`, `creative.js` |
| Vidrios | Tres aros directos, papeles graves/medios/percusivos, superposición local; color ligado al giro | `glass.js`, `glass-music.js` |
| Espejos | Reflexión finita, receptor, giro directo por arrastre o panel de precisión, rollback y color por tramo | `mirrors.js`, `canvas.js` |
| Jardines modulares | Conexiones físicas que conducen partes regionales; señales desde vidrios/espejos | `patchgarden.js`, `installation-signals.js`, `installations.js` |
| Rastros e instrumentos dormidos | Tres huellas: escuchar, responder al ritmo, mantener para despertar; etapas persistentes | `sound-trails.js`, `sound-trail-model.js` |
| Hallazgos y rarezas | Reliquias, despertar por escucha/pulsos, rarezas/anomalías y hitos que se oyen de lejos | `relics.js`, `wonders.js`, `landmarks.js` |
| Ambiente en el tiempo | Ríos/confluencias, tormentas móviles, lluvia, estaciones y huellas/campamentos | `wonders.js`, `alive.js` |
| Fenómenos musicales | Ave de eco, semillero de caja, nube de pulso; respuestas acordes al género | `phenomena.js` |
| Capas y movilidad | Superficie, Subsuelo, Cielo, portales y movilidad regional; no un teletransporte universal | `layers.js`, `gravity.js` |
| Recorrer y volver | Favoritos con identidad/coordenadas, orientación y autopilot optativo; mapa descubierto/rumores | `favorites.js`, `navigation.js`, `autopilot.js`, `map.js` |
| Estudio | Secuenciador radial, piezas recogidas y slots guardables; rutas independientes del Camino/Mundo | `studio.js` |
| Progreso visible | Bitácora musical/de mundo, logros, sesiones, constelación y tarjetas PNG | `journal.js`, `session.js`, `sharing.js`, `discovery.js` |
| Guardado y recuperación | Validación, migraciones, aviso de cuota/corrupción, copias de seguridad, JSON de exportación/restauración | `save-store.js`, `save-tools.js`, `progress.js` |
| UX y acceso | Un acceso principal, herramientas a demanda, UI silenciosa, escáner, ayudas locales, teclado/foco y cancelaciones | `focusui.js`, `ui.js`, `accessibility.js`, `scanner.js`, `controls.js` |
| Base técnica | Contratos de contenido, cachés LRU acotadas, regresión, auditorías y PWA/offline | `catalog.js`, `content-contracts.js`, `cache.js`, `sw.js` |

No implica que cada sistema tenga la profundidad propuesta en el plan. No hay multijugador, personajes/culturas históricos completos, puertas musicales generales, live coding real, construcción/crafting universal, mixer multibus con solo/mute, ni exportación de sets de audio/vídeo.

## Cifras del código, sin sumar categorías distintas

| Medida | Valor y significado |
|---|---|
| Biomas / hábitats vivos | 11 / 33 perfiles; los hábitats no son 33 biomas nuevos |
| Estilos definidos | 52; nueve caracteres de arreglo no son nueve géneros adicionales |
| IDs de instrumentos en paletas del generador | 35; se mantienen por compatibilidad |
| IDs en paletas actuales de reproducción | 38; cuentan bajo/percusión/timbres referenciados, no todas las voces del motor |
| Instrumentos descritos en Bitácora | 42; incluye percusión y voces del motor |
| Modelos de `INSTRUMENT_SPECS` | 15; son un subconjunto modular, no el total anterior |
| Familias | 10 encuentros, 5 juguetes, 6 familias vivas y 3 fenómenos; categorías diferentes |
| Contratos de contenido | 24 en Original, 30 en Paisajes vivos; registrar no equivale a generar todo en todos los lugares |
| Atlas | 118 vistas representativas ampliadas; no 118 especies nuevas ni todas las semillas/animaciones |
| Módulos / suites disponibles | 81 módulos ES, 51 suites Node, 32 recorridos Chromium más offline |

Auditoría viva conservada: **999.512 firmas detalladas** y **586.200 firmas musicales terrestres** entre **1.000.000 candidatos de cuatro semillas**. Original: **39.952 recetas detalladas** en **40.000 regiones**. Son muestras de recetas, no tamaños totales del mundo, canciones terminadas ni experiencias perceptualmente únicas. [Método y ventanas](VARIEDAD.md).

## Identidad y persistencia

Dirección completa: `{seed, layout, generatorVersion, catalogVersion, layoutVersion, layer, x, y}`. La radio evoluciona; regresar recupera un lugar, no el audio exacto de un instante. Las direcciones validadas exigen coordenadas finitas de magnitud <10¹²; las semillas/streams usan hashes de 32 bits, así que hay límites y posibles colisiones. No afirmar infinitud literal.

| Mundo | Perfil generador/catálogo/layout | Clásico | Amplio |
|---|---|---:|---:|
| Original | 1 / 1 / 1 | 3.600 unidades por región | 7.200 |
| Paisajes vivos | 2 / 2 / 2 | 3.600 | 10.800 |

La partida habitual sigue en Original/clásico (`pixel-blanco-v4`). Los ensayos de semilla/layout/generación tienen claves separadas; Mi partida vuelve al guardado habitual. No se migra automáticamente a Paisajes vivos ni se sincroniza entre dispositivos. Cachés base: 128 chunks/regiones/semillas continentales y 256 biomas/regiones continentales; otras cachés tienen presupuestos propios. [Uso de semillas](MUNDOS_SEMILLAS.md).

| Datos | Regla actual |
|---|---|
| Constancia, logros, Bitácora, estrellas y progreso | Guardados localmente; exportables mediante respaldo |
| Favoritos | Hasta 64; direcciones compatibles, nombre, capa y coordenadas |
| Ángulos de vidrios/espejos, conexiones de jardines, etapas de rastros | Guardados con sus límites/normalización |
| Estudio | Slots y ubicación en la partida |
| Radio/arcos, influencia, ecos/banda, frase aprendida y gestos de ecología | Temporales; no convertirlos en escenas persistentes sin nuevo diseño/pedido |
| Hash/receta del lugar | Reconstrucción determinista en la generación correspondiente, sin congelar su frase temporal |

## Verificación y límites de esta fotografía

[Registro reproducible del traspaso](docs/handoff-validation.json).

- **Ejecutado en este traspaso sobre e27c219:** `npm test`, 51 suites aprobadas; `python3 tests/offline_smoke.py`, recarga real sin conexión con 81 módulos y error correcto para JS inexistente; `python3 scripts/render-visual-atlas.py`, 118 vistas con los colores de fase 4.
- **Evidencia histórica conservada:** [fase 1](scripts/phase-01-validation.json), [fase 2](scripts/phase-02-validation.json), [registros/atlas](scripts/register-review-validation.json). La revisión de registros midió 125 renders, pico máximo 0,957476 y ninguna muestra >0,98, **antes** de fase 3.
- **Disponibles, no repetidos en este traspaso documental:** batería de 32 recorridos más offline; siete programas de audio (77 + 14 + 10 + 6 + 6 + 12 + 8 = 133 renders previstos); auditorías de ambos generadores. Las ocho mezclas de composición incluyen 50 notas de cada voz nueva, normal/suave, 48/44,1 kHz.
- **CI/despliegue:** el repo conserva workflow de PR/main. Se verificó la integración por Git; esta sesión no consultó el estado remoto actual de Actions/Vercel. Los informes anteriores registran aprobaciones en su momento. No presentarlas como certificación nueva de este commit.
- **Aceptación pendiente:** escucha humana de 10–30 min, claridad/groove/fatiga, Safari/iOS/Android reales, PWA instalada, mono/estéreo, batería/memoria en viajes largos, actualización y rollback. V1 aún no está certificada para producción.

## Mapa documental

- Continuación y estado: [HANDOFF](HANDOFF.md), [README](README.md), [RAMAS](RAMAS.md).
- Pendientes y dirección: [PENDIENTES](PENDIENTES.md), [FASES_UNIVERSO](FASES_UNIVERSO.md), [inventario de 64 tareas](V1_PRODUCCION.md), [PROXIMOS_PASOS](PROXIMOS_PASOS.md), [dirección narrativa](DIRECCION_JUEGO.md).
- Entregas integradas: [FASE_01](FASE_01.md), [FASE_02](FASE_02.md), [FASE_03](FASE_03.md), [bloque FASE_04](FASE_04.md), [REVISION_REGISTROS](REVISION_REGISTROS.md), [CAMBIOS](CAMBIOS.md).
- Uso/medición: [MUNDOS_SEMILLAS](MUNDOS_SEMILLAS.md), [VARIEDAD](VARIEDAD.md), [atlas PNG](docs/images/atlas-visual.png), [índice de figuras](docs/images/atlas-visual.json).
- Archivo íntegro: [HANDOFF_HISTORICO](HANDOFF_HISTORICO.md), [PLAN_HISTORICO](PLAN_HISTORICO.md), [FASES históricas](FASES.md), [ENTREGAS_CREATIVAS](ENTREGAS_CREATIVAS.md), [JUGABILIDAD_CREATIVA](JUGABILIDAD_CREATIVA.md), [REVISION](REVISION.md), [REVISION_CREATIVA](REVISION_CREATIVA.md), [REVISION_INTERACCIONES](REVISION_INTERACCIONES.md).
