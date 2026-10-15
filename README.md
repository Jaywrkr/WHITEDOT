# WHITEDOT

**Un pixel. Un mundo que suena.**

Un pixel blanco en un mundo negro. Descubre cómo suena el universo y crea tu propia música: 11 biomas, 33 hábitats, 52 géneros electrónicos y 28 linajes vivos de flora, fauna y construcciones. En esta candidata, una primera luz del Camino abre el Mundo del día sin reloj de exploración.

**Jugar:** https://whitedot-inky.vercel.app. En el teléfono puedes instalarlo como app (en iPhone: Compartir → Añadir a pantalla de inicio). Toca la pantalla una vez para activar el sonido.

Por Jay · [@jaywrkr](https://instagram.com/jaywrkr) · Candidata de esta rama **2.1.0-alpha.7** · [Cambios](CAMBIOS.md) · [Créditos](CREDITOS.md) · [Licencia](LICENSE)

L1–L6 están en main por los PR de Jay. L7 se entrega para su PR; el agente no hace merges ni push a main. [Auditoría y soluciones](AUDITORIA_CIERRE_2.0.md) · [Pulido final autorizado](PLAN_PULIDO_FINAL.md).

El cierre anterior y sus ocho fases de pulido están subidos. El ciclo musical actual se detalla abajo. Los pendientes históricos de PLAN_2.0 se distinguen de la aceptación externa actual en [CIERRE_2.0.md](CIERRE_2.0.md).

<!-- laboratorio-vivo -->
## Laboratorio Vivo · L7

Curaduría y cierre del laboratorio. La curaduría integra seis bandas con los 52 estilos y los dieciséis cruces previos. La muestra por género verificó 51 gramáticas de batería distintas; las membranas y cajas usan cuerpos graves/medios.

[Plan y ramas](PLAN_LABORATORIO_VIVO.md) · [Validación](scripts/lab-l7-validation.json). Sonido → Paisaje vivo/clásico. Para comparar bandas en el teléfono: abre el preview con `?dev=1`, Menú → Prototipo → Laboratorio → Paisaje vivo.

Validación completa aprobada: auditoría, 104 suites Node, 82 recorridos incluido offline y 581 renders de 28 programas de audio. Pico máximo medido: 0.945447; señal finita y límites aprobados por cada programa. [Evidencia](scripts/lab-l7-validation.json). CI de los PR y aceptación física/artística conservan su alcance propio.

[Hallazgos, ramas y prueba en teléfono](CIERRE_LABORATORIO_VIVO.md). Integración L1 → L7 conservando la ascendencia.
<!-- /laboratorio-vivo -->

## Cierre anterior

**Auditoría de aceptación.** Corregida la confirmación falsa de Favoritos cuando el almacenamiento falla. Se conserva la sesión para copia/reintento; tutorial y logro esperan escritura confirmada. [Dictamen y condiciones de cierre](AUDITORIA_ACEPTACION_2.0.md).

**F8 · Cierre integrado y revisión final.** Bitácora por demanda, guía sin superposiciones y validación completa de la candidata. [Plan y ramas](PLAN_PULIDO_FINAL.md) · [Evidencia](scripts/pulido-f8-validation.json).

## Base anterior · auditoría F10

`feat/cierre-f10-lanzamiento` continúa la fase anterior. Corrige retorno WD1, pérdidas de progreso persistente, silencio y señales; simplifica el acceso diario y documenta el pulido final autorizado. [Plan anterior](PLAN_CIERRE_2.0.md) · [Pruebas](scripts/cierre-f10-validation.json).

## Qué reúne esta candidata

| Área | Alcance integrado |
|---|---|
| Paisajes | Ocho familias espaciales sobre 11 biomas y 33 hábitats |
| Vida | 28 linajes, cincuenta caminantes explícitos, anatomías y comportamiento territorial |
| Composición | 52 estilos, dieciséis influencias compatibles y regiones sin cruce |
| Instrumentos | 43 especificaciones, siete motores avanzados y once voces articuladas originales; dieciséis programas de filtro |
| Interacción | Percusión natural de nueve materiales, prioridad del gesto y señales locales |
| Descubrimiento | Guardianes, pistas, reliquias recuperables y cincuenta tipos de tarjeta |
| Memoria | Instrumentos editados, vínculos, favoritos, capas y direcciones WD1 |
| Creación | Casa desde arriba con cuarenta objetos/cuatro habitaciones; Taller radial conservado |
| Colección | Cincuenta personalizaciones ganadas, doscientos cincuenta logros y cinco secciones de Bitácora |
| Laboratorio | 179 entradas/21 grupos; herramienta de prototipo en localhost o `?dev=1` |

**Saltar** busca contraste musical y habitantes; **Volver al salto** recupera el punto anterior. El mundo varía también en quietud. Las familias mantienen género, tempo, escala y batería nativos; las influencias compatibles cambian frases, armonía y paleta. Hay filtros reales de 12/24/36/48 dB por octava y conexiones de señal/modulación acotadas. No contiene instrumentos ni presets comerciales.

El juego conserva terreno, coordenadas y progreso anteriores. Las poblaciones comunes pueden reorganizarse en nichos; las rarezas anteriores conservan sus direcciones. La simulación es local y acotada. Las recetas distintas no prueban canciones perceptualmente únicas.

[Plan de cierre y ramas](PLAN_CIERRE_2.0.md) · [Cambios por entrega](CAMBIOS.md) · [Prueba en teléfono](PROBAR_UNIVERSO_VIVO.md). Los ocho bloques de pulido están implementados; aceptación física, CI y deploy real siguen separados en el cierre.

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

Flujo: una rama por fase del [Laboratorio Vivo](PLAN_LABORATORIO_VIVO.md), desde main actualizado o desde la fase anterior pendiente de merge; commit y push. **Jay crea el PR y hace el merge.** [PLAN_2.0.md](PLAN_2.0.md) conserva los estados anteriores.

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
