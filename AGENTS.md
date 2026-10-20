# Instrucciones para agentes

## Alcance y lectura

Leer este archivo antes de modificar código. Empezar por [README](README.md) y [el índice vigente](docs/README.md); para una revisión/traspaso consultar [HANDOFF_CLAUDE](HANDOFF_CLAUDE.md), además de [arquitectura](docs/ARQUITECTURA.md) y [verificación](docs/VERIFICACION.md). La petición actual del usuario define el trabajo: los planes de [historial](docs/historial/README.md) no autorizan fases nuevas ni reabren entregas terminadas.

## Entrega

- Trabajar en una rama desde `main` actualizado, o desde una dependencia explícita; indicar esa dependencia.
- Commit y push solo a la rama. Jay crea PR y merge. No publicar, integrar ni hacer push a `main` sin petición explícita.
- Commits en inglés, imperativo y sin identificadores de modelos. Evitar pushes innecesarios.
- Actualizar [CAMBIOS](CAMBIOS.md); actualizar la arquitectura solo cuando cambie. No mantener tablas de planes históricos.
- Durante la iteración, usar `npm run test:impact -- --base SHA_BASE`: como máximo dos procesos Node simultáneos, caché local conservadora y resumen de tiempos. No repetir navegador/audio completos sin cambios que lo justifiquen; conservar el cierre completo exigido por la guía.
- Antes del push: auditoría, suites Node afectadas y recorrido representativo del sistema cambiado. Sonido: renders afectados. Documentación sola no requiere navegador/audio. Ver comandos y cierre completo en la guía de verificación.
- Registrar resultados y limitaciones; no atribuir CI, despliegue, escucha física o pruebas completas sin comprobarlos. No desactivar pruebas ni ejecutar suites pesadas de navegador/audio simultáneamente.

## Reglas técnicas

- Módulos ES nativos, Canvas 2D y Web Audio; sin dependencias npm ni compilación del juego.
- Cada módulo o asset nuevo debe figurar una sola vez en `SHELL` de `sw.js`.
- No consumir el RNG antiguo al añadir contenido: preservar semillas y posiciones existentes.
- Normalizar y migrar guardados sin borrar progreso; conservar formatos futuros y verificar fallos de escritura.
- `runtime` no se expone en producción; las pruebas lo instrumentan al servir `src/main.js`.
- Conservar IDs HTML cuando sea posible: las pruebas dependen de ellos.
- Usar el sellado de publicación existente para versión/caché; no incrementarlas por documentación.

## Diseño

`styles/estilo-j.css`: negro puro, esquinas rectas, Geist Mono, blanco para estados y dorado para lo ganado. Textos breves en español, una idea por mensaje. Menús y botones silenciosos. Antes de añadir controles, ordenar los existentes. Conservar música, mapas y progreso salvo petición explícita de cambiarlos.

## Documentación y traspasos

El plan de lanzamiento conserva los IDs D01–D22 como único backlog vigente. No usar guías históricas para reabrir cuenta opcional, demo, respaldo manual o firma por caché. Mantener hechos y límites actuales en la guía de su área, evidencia con revisión/origen y cambios anteriores en historial. Una decisión aprobada no equivale a configuración aplicada, aceptación física o publicación. No incluir contraseñas, tokens, claves ni archivos privados en Git/documentación. La petición vigente de Jay prevalece sobre planes, traspasos y propuestas.
