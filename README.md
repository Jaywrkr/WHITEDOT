# WHITEDOT

**Un pixel. Un mundo que suena.**

Un pixel blanco en un mundo negro. Cada día recorres un Camino corto. Al terminarlo se abre un Mundo que compone mientras lo exploras: 11 biomas, 33 hábitats, 52 géneros electrónicos y 28 linajes vivos de flora, fauna y construcciones. Todo lo que tocas suena a tiempo.

**Jugar:** https://whitedot-inky.vercel.app. En el teléfono puedes instalarlo como app (en iPhone: Compartir → Añadir a pantalla de inicio). Toca la pantalla una vez para activar el sonido.

Por Jay · [@jaywrkr](https://instagram.com/jaywrkr) · Versión **1.1.0** · [Cambios](CAMBIOS.md) · [Créditos](CREDITOS.md) · [Licencia](LICENSE)

## Cómo se juega

1. **Camino.** Arrastra. Cada luz es una nota. Llena la barra del día.
2. **Mundo.** Se abre al completar el Camino. Tu linterna dura más con cada día de racha.
3. **Toca.** Lanzas un pulso. **Mantén.** Escuchas las voces cercanas. **Choca.** Lo dorado se puede tocar. **Quédate.** El lugar responde.
4. **Estudio.** Un secuenciador radial con los sonidos que recoges. También es tu campamento.
5. **Bitácora.** Lugares, formas, hallazgos raros, elementos, música y logros.
6. **Comparte.** Tarjetas 4:5 de tu día y sets grabados de hasta 60 s, listos para publicar.

Vuelve mañana. Creces. Simple.

## Correr local

```bash
python3 -m http.server 8000           # solo el juego
python3 server/app.py --port 8080     # juego + cuentas y duetos opcionales
```

No hay dependencias ni build. Los módulos necesitan HTTP; `file://` no funciona. En `localhost` o con `?dev=1` aparece el menú Prototipo. "Cuenta y duetos" solo aparece si responde el servidor opcional ([SERVIDOR_Y_DUETOS.md](SERVIDOR_Y_DUETOS.md)).

## Verificar

```bash
npm run audit:release   # integridad del shell, fuentes y enlaces
npm test                # suites de lógica (Node ≥ 18)
npm run test:browser    # recorridos de navegador y offline (Python + Playwright)
npm run test:audio      # mezclas renderizadas con Web Audio offline
python3 tests/server_api.py && python3 tests/duet_smoke.py   # servidor opcional
```

`CHROMIUM_PATH` indica el navegador si no está en el sistema. CI corre lo mismo en cada PR (`.github/workflows/checks.yml`). Guía manual: [PROBAR_UNIVERSO_VIVO.md](PROBAR_UNIVERSO_VIVO.md).

## Publicar

El repo está conectado a Vercel (proyecto `whitedot`). Cada rama tiene vista previa; el merge a `main` publica producción. El build (`scripts/vercel-build.mjs`) sella la revisión y la hora de publicación, que se ven al pie del menú. Vercel sirve solo la parte estática: el servidor de cuentas y duetos no corre ahí.

Flujo: una rama por fase de [PLAN_2.0.md](PLAN_2.0.md), commit y push. **Jay crea el PR y hace el merge.**

## Mapa del repositorio

| Ruta | Qué hay |
|---|---|
| `index.html`, `src/`, `styles/` | El juego: Canvas 2D, Web Audio y módulos ES nativos. `styles/estilo-j.css` es la capa visual final |
| `sw.js`, `manifest.webmanifest`, `icons/` | PWA offline |
| `server/` | Servicio opcional (Python + SQLite): cuentas, copias y salas de dueto |
| `tests/`, `scripts/` | Pruebas, auditorías y evidencias JSON |
| [PLAN_2.0.md](PLAN_2.0.md) | **Trabajo actual:** fases de la 2.0, ramas y criterios |
| [AGENTS.md](AGENTS.md) | Reglas para agentes (Codex, Claude): flujo de ramas, pruebas y estilo |
| [CIERRE_V1.md](CIERRE_V1.md) | Estilo J, auditoría de cierre y decisiones |
| [ACEPTACION_V1.md](ACEPTACION_V1.md) | Prueba con teléfonos y personas reales |
| [LANZAMIENTO.md](LANZAMIENTO.md) | Contenido de lanzamiento para @jaywrkr |
| [HANDOFF_CLAUDE.md](HANDOFF_CLAUDE.md) | Mapa técnico para continuar |
| [COBERTURA_150_UNIVERSO.md](COBERTURA_150_UNIVERSO.md), [PLAN_V2.md](PLAN_V2.md) | Qué está hecho, qué es parcial y qué viene |
| [docs/historial/](docs/historial) | Fases, revisiones, handoffs y auditorías anteriores |

El guardado vive en el navegador (`localStorage`). Exporta una copia desde Menú → Guardar copia.
