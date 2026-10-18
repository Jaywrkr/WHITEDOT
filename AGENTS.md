# Instrucciones para agentes

## Alcance y lectura

Leer este archivo antes de modificar código. Consultar [README](README.md), [arquitectura](docs/ARQUITECTURA.md) y [verificación](docs/VERIFICACION.md). La petición actual del usuario define el trabajo: los planes de [historial](docs/historial/README.md) no autorizan fases nuevas ni reabren entregas terminadas.

## Entrega

- Trabajar en una rama desde `main` actualizado, o desde una dependencia explícita; indicar esa dependencia.
- Commit y push solo a la rama. Jay crea PR y merge. No publicar, integrar ni hacer push a `main` sin petición explícita.
- Commits en inglés, imperativo y sin identificadores de modelos. Evitar pushes innecesarios.
- Actualizar [CAMBIOS](CAMBIOS.md); actualizar la arquitectura solo cuando cambie. No mantener tablas de planes históricos.
- Durante la iteración, usar `npm run test:impact -- --base SHA_BASE`: dos suites Node como máximo, caché local conservadora y resumen de tiempos. No repetir navegador/audio completos sin cambios que lo justifiquen; conservar el cierre completo exigido por la guía.
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
