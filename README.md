# WHITEDOT

**Un pixel. Un mundo que suena.**

Explora para descubrir sonidos, crear tu música y conservar tus encuentros. Un cubo blanco en negro, electrónica generativa y organismos que responden a tus gestos. La primera luz del Camino abre el Mundo del día sin reloj de exploración.

**Jugar:** https://whitedot-inky.vercel.app. La versión de producción depende de los merges de Jay. Esta rama propone **2.2.0-rc.1**. En iPhone: Compartir → Añadir a pantalla de inicio. Toca el Mundo para activar audio.

Por Jay · [@jaywrkr](https://instagram.com/jaywrkr) · [Cambios](CAMBIOS.md) · [Créditos](CREDITOS.md) · [Licencia](LICENSE)

## Cubo, colección y música · ciclo actual

[Nueve fases, ramas y aceptación](PLAN_PULIDO_CUBO_MUSICA.md). Fase 1 integrada por Jay (PR #144). Fase 2: once perfiles de producción distinguen pulso seco, cuerpo grave, teclas cálidas, madera/piel, máquina, síncopa, cuerdas, disco, cinta, dub y espacio abierto. Se elimina el órgano/pad automático de fondo. Menú ofrece volumen directo 0–100%, conservando el control de Sonido y el guardado. Ganancia general 1,5× antes del limitador. Fase 3: claros y texturas decorativas por zonas, invitados musicales por frases y acordes breves en estilos armónicos. Las fronteras mezclan el tratamiento acústico. La quietud no aumenta el eco automáticamente; salas cortas y largas se mezclan según el estilo. Las notas se conservan aparte de tu partida; los controles permanecen silenciosos. El modelo no estima tarjetas ganadas ni sustituye la escucha humana.

```bash
npm run audit:encounters -- --routes 192 --output /tmp/whitedot-encounters.json
```

Explorar y quietud se informan por separado, con sus supuestos e intervalos. El ciclo parte de main `d7ea883`, donde Jay integró Experiencia viva completa (PR #143). La fase 2 parte de main `30b2df8`, con fase 1 ya integrada. Las comparaciones del laboratorio son herramientas internas opcionales; no una tarea del jugador.

## Experiencia viva · ciclo integrado

[Catorce fases y sus ramas](PLAN_EXPERIENCIA.md) · [Auditoría, pruebas y recorrido móvil](CIERRE_EXPERIENCIA.md) · [Mapa técnico](HANDOFF_CLAUDE.md).

Fases 1–14 integradas por Jay en main `d7ea883` (PR #143). Codex entrega commits y pushes; Jay crea PR y merge. La aceptación física y CI se registran separadamente de las pruebas locales.

Auditoría sin errores ni advertencias, 113 suites Node, 86 recorridos de navegador incluido offline y 789 renders de 31 programas de audio: aprobados. Prueba HTTP/SQLite aprobada. Pico máximo medido 0.945447. [Evidencia final](scripts/experience-14-validation.json).

| Área | Alcance verificable de esta candidata |
|---|---|
| Paisajes | Ocho familias, once biomas, 33 hábitats previos y 22 ecorregiones nuevas |
| Vida | 48 linajes; veinte nuevos, anatomía reproducible y nichos territoriales |
| Composición | 52 géneros, dieciséis influencias, nueve bandas y 24 gramáticas de encuentro |
| Instrumentos | 75 especificaciones; 43 voces articuladas y filtros de 12/24/36/48 dB |
| Percusión | 21 familias acústicas naturales; doce nuevas y 168 articulaciones físicas |
| Hallazgos | Setenta tipos de tarjeta con condiciones de rareza explícitas |
| Memoria | Favoritos buscables, direcciones WD1 y constelaciones de fuentes tocadas |
| Creación | Casa desde arriba, cuarenta objetos, cuatro habitaciones y jardines de cuatro voces |
| Colección | 141 familias registrables, cincuenta personalizaciones y 250 logros previos |
| Laboratorio | 246 destinos de 21 grupos; localhost o preview con `?dev=1` |

**Saltar** busca contraste; **Volver al salto** recupera el punto anterior. Menús y botones guardan silencio. Las voces, filtros y respuestas nacen de síntesis propia mediante Web Audio, sin instrumentos comerciales. El ambiente y las secciones cambian también en quietud.

Las cifras cuentan sistemas y catálogos, no canciones únicas. No multiplicamos variables correlacionadas para afirmar millones de mundos diferentes. Ecorregiones y hábitats son capas sobre los once biomas. Las incorporaciones usan semillas independientes y conservan el terreno y las direcciones anteriores.

## Cómo se juega

1. **Camino.** Arrastra hacia una luz al comenzar el día. Recógela.
2. **Mundo.** Entra cuando quieras; explora sin límite de tiempo.
3. **Acércate.** El cubo toca los objetos. Un toque vacío lanza un pulso. Mantener permite escuchar; permanecer transforma algunas voces.
4. **Casa.** Coloca objetos ganados y compón caminando. El Taller radial conserva tus muestras.
5. **Bitácora.** Hoy, Colección, Lugares, Música y Logros. Menú → Tu recorrido explica las posibilidades.
6. **Comparte.** Tarjetas 4:5 de tu día y sets grabados de hasta 60 s, listos para publicar.

Conserva los lugares que te importan. Vuelve para escuchar qué cambia.

**Guardar y volver:** toca el marcador junto al nombre del lugar. Toca el nombre para abrir tus destinos, viajar o volver al punto anterior. El tutorial puede repetirse desde Menú → Tu recorrido → Practicar, sin borrar progreso.

Referencia histórica RC9: auditoría sin errores ni advertencias, 97 suites Node, 76 recorridos de navegador incluido offline y prueba HTTP/SQLite aprobados. Se conservan los 455 renders F8 de 22 programas, con integridad de casos verificada; no se repitieron porque no cambia el audio. CI del PR, verificación del artefacto RC9 y aceptación física pendientes. [Informe RC9](scripts/auditoria-cierre-rc9-validation.json) · [Cierre e integración](CIERRE_2.0.md).

## Correr local

```bash
python3 -m http.server 8000           # solo el juego
python3 server/app.py --port 8080     # juego + cuentas y duetos opcionales
```

Sin dependencias npm ni compilación de módulos. Los módulos necesitan HTTP; `file://` no funciona. En `localhost` o con `?dev=1` aparece el menú Prototipo. "Cuenta y duetos" solo aparece si responde el servidor opcional ([SERVIDOR_Y_DUETOS.md](SERVIDOR_Y_DUETOS.md)).

## Verificar

```bash
npm run audit:release   # integridad del shell, fuentes y enlaces
npm test                # suites de lógica (Node ≥ 18)
npm run test:browser    # recorridos de navegador y offline (Python + Playwright)
npm run test:audio      # mezclas renderizadas con Web Audio offline
python3 tests/server_api.py && python3 tests/duet_smoke.py   # servidor opcional
```

`CHROMIUM_PATH` indica el navegador si no está en el sistema. En ramas se ejecutan auditoría/lógica completas y navegador/audio enfocados en cambios. Antes de integrar/publicar `main`, se validan las suites completas una vez sobre el conjunto final. CI conserva los recorridos completos en cada PR, con navegador separado y audio repartido en tres grupos (`.github/workflows/checks.yml`); ver [AGENTS.md](AGENTS.md). Guía manual: [PROBAR_UNIVERSO_VIVO.md](PROBAR_UNIVERSO_VIVO.md).

## Publicar

El repo está conectado a Vercel (proyecto `whitedot`). Cada rama tiene vista previa; el merge a `main` publica producción. `vercel.json` fija Framework **Other** (`null`), Output Directory **`.`** y el build `node scripts/vercel-build.mjs`. El juego vive en la raíz: no genera `public`. La configuración del repo evita que Vercel busque esa carpeta inexistente. El build sella la revisión y la hora de publicación, que se ven al pie del menú. Vercel sirve solo la parte estática: el servidor de cuentas y duetos no corre ahí.

Flujo: una rama por fase del [pulido actual](PLAN_PULIDO_CUBO_MUSICA.md), desde main actualizado o desde la fase anterior pendiente de merge; commit y push. **Jay crea el PR y hace el merge.** [PLAN_2.0.md](PLAN_2.0.md) conserva los estados anteriores.

## Mapa del repositorio

| Ruta | Qué hay |
|---|---|
| `index.html`, `src/`, `styles/` | El juego: Canvas 2D, Web Audio y módulos ES nativos. `styles/estilo-j.css` es la capa visual final |
| `sw.js`, `manifest.webmanifest`, `icons/` | PWA offline |
| `server/` | Servicio opcional (Python + SQLite): cuentas, copias y salas de dueto |
| `tests/`, `scripts/` | Pruebas, auditorías y evidencias JSON |
| [PLAN_LABORATORIO_VIVO.md](PLAN_LABORATORIO_VIVO.md), [CIERRE_LABORATORIO_VIVO.md](CIERRE_LABORATORIO_VIVO.md) | Ciclo musical entregado, ramas, soluciones y aceptación |
| [PLAN_PULIDO_FINAL.md](PLAN_PULIDO_FINAL.md), [PLAN_CIERRE_2.0.md](PLAN_CIERRE_2.0.md) | Cierre y pulido anteriores |
| [PLAN_2.0.md](PLAN_2.0.md) | Fases originales, decisiones y estados conservados |
| [AGENTS.md](AGENTS.md) | Reglas para agentes (Codex, Claude): flujo de ramas, pruebas y estilo |
| [CIERRE_V1.md](CIERRE_V1.md) | Estilo J, auditoría de cierre y decisiones |
| [ACEPTACION_V1.md](ACEPTACION_V1.md) | Prueba con teléfonos y personas reales |
| [LANZAMIENTO.md](LANZAMIENTO.md) | Contenido de lanzamiento para @jaywrkr |
| [HANDOFF_CLAUDE.md](HANDOFF_CLAUDE.md) | Mapa técnico para continuar |
| [COBERTURA_150_UNIVERSO.md](COBERTURA_150_UNIVERSO.md), [PLAN_V2.md](PLAN_V2.md) | Visión y cobertura histórica; no sustituyen los planes actuales |
| [docs/historial/](docs/historial) | Fases, revisiones, handoffs y auditorías anteriores |

El guardado vive en el navegador (`localStorage`). Exporta una copia desde Menú → Guardar copia.
