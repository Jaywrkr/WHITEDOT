# Instrucciones para agentes

## Lectura

Leer este archivo antes de tocar código. Después: [README](README.md), [HANDOFF](HANDOFF.md) y la guía del tema en [el índice](docs/README.md). Para auditar el juego como el panel creativo: [docs/PANEL.md](docs/PANEL.md); una auditoría externa sigue [docs/AUDITORIA_EXTERNA.md](docs/AUDITORIA_EXTERNA.md). La petición actual de Jay define el trabajo; los planes antiguos no autorizan fases nuevas ni reabren entregas.

## Entrega

- Trabajar en una rama desde `main` actualizado, o desde una dependencia explícita; indicar esa dependencia.
- Commit y push solo a la rama. Jay crea el PR e integra, salvo que pida expresamente que lo haga el agente. No publicar ni hacer push a `main`.
- Commits en inglés, en imperativo y sin identificadores de modelos. Evitar pushes innecesarios.
- Actualizar [CAMBIOS](CAMBIOS.md) y la guía del área; la arquitectura solo si cambia.
- Durante la iteración: `npm run test:impact -- --base SHA_BASE` (como máximo dos procesos Node a la vez).
- Antes del push: `node scripts/release-audit.mjs`, `npm test` y los recorridos de navegador del sistema cambiado (`CHROMIUM_PATH=… python3 tests/X_smoke.py`). Si cambia el sonido, sus renders. Solo documentación no requiere navegador ni audio. Detalle en [Verificación](docs/VERIFICACION.md).
- Registrar resultados y límites; no afirmar CI, despliegue, escucha en teléfono ni pruebas con personas sin comprobarlo. No desactivar pruebas ni ejecutar a la vez suites pesadas de navegador y audio.

## Reglas técnicas

- Módulos ES nativos, Canvas 2D y Web Audio; sin dependencias npm ni compilación del juego. Excepción: `desktop/` (envoltorio Electron, con su `package.json`; `node_modules` fuera de Git) empaqueta aparte.
- Cada módulo o asset nuevo figura una sola vez en `SHELL` de `sw.js`.
- No consumir el RNG antiguo al añadir contenido (usar `hashKey`): se conservan semillas y posiciones.
- Normalizar y migrar guardados sin borrar progreso; conservar formatos futuros y verificar fallos de escritura.
- `runtime` no se expone en producción; las pruebas lo instrumentan al servir `src/main.js`.
- Conservar los ID de HTML: las pruebas dependen de ellos. Los botones plegados en «Más» (`#menuMore`) se abren antes de pulsarlos.
- Versión con `node scripts/bump-version.mjs 2.3.0-alpha.N`; no subirla por documentación.

## Diseño

- `styles/estilo-j.css`: negro puro, esquinas rectas, Geist Mono, blanco para estados y dorado para lo ganado.
- Textos breves en español, una idea por frase. Menús y botones silenciosos. Antes de añadir controles, ordenar los existentes.
- **El cubo es pequeño** (Jay, 24 de octubre). No agrandarlo para que se lea.
- Conservar la música, los mapas y el progreso salvo petición explícita.

## Documentación y límites

- Hechos y límites actuales en la guía de su área; lo antiguo vive en Git, no en el árbol.
- El backlog de lanzamiento es D01–D22 ([plan](docs/PLAN_LANZAMIENTO.md)). La cuenta opcional está aprobada; **la configuración de Supabase está en pausa**.
- Una decisión aprobada no equivale a configurada, probada con personas ni publicada.
- Nunca incluir contraseñas, tokens, claves ni archivos privados en Git o en la documentación.
- La petición vigente de Jay prevalece sobre planes, traspasos y propuestas.
