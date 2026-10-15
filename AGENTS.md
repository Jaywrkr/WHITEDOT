# Instrucciones para agentes (Codex, Claude y otros)

WHITEDOT es un juego musical procedural de Jay (@jaywrkr): un pixel blanco en un mundo negro. Producción: https://whitedot-inky.vercel.app (Vercel, se publica al hacer merge a `main`).

## Prioridad actual

Jay autorizó [PLAN_PULIDO_CUBO_MUSICA.md](PLAN_PULIDO_CUBO_MUSICA.md): nueve fases, entregadas fase a fase. Fase 1 integrada en main `30b2df8` (PR #144). Fase 2 subida en `a3a5fa7`. Fase 3 subida en `2a60dea`. Fase 4 subida en `845e8fc`. Fase 5 subida en `b3d8f0b`. Actual: fase 6, `feat/pulido-06-cubo-ui`, desde F5. Leer el plan nuevo antes de cambiar código; las tablas de planes históricos no reabren trabajo cerrado.

El ciclo anterior [PLAN_EXPERIENCIA.md](PLAN_EXPERIENCIA.md) queda integrado por Jay. [CIERRE_EXPERIENCIA.md](CIERRE_EXPERIENCIA.md) conserva su evidencia y condiciones externas. Codex solo commit/push; Jay PR/merge. Escucha física, CI y deploy se verifican separadamente.

## Leer primero

1. [PLAN_PULIDO_CUBO_MUSICA.md](PLAN_PULIDO_CUBO_MUSICA.md): ciclo actual y entregas.
2. [CIERRE_EXPERIENCIA.md](CIERRE_EXPERIENCIA.md): auditoría, integración y prueba móvil.
3. [README.md](README.md) y [HANDOFF_CLAUDE.md](HANDOFF_CLAUDE.md): mapa técnico vigente.
4. [PLAN_2.0.md](PLAN_2.0.md): decisiones y estados anteriores; su cabecera remite al ciclo actual.

[CIERRE_LABORATORIO_VIVO.md](CIERRE_LABORATORIO_VIVO.md), [PLAN_PULIDO_FINAL.md](PLAN_PULIDO_FINAL.md), [AUDITORIA_CIERRE_2.0.md](AUDITORIA_CIERRE_2.0.md), [CIERRE_V1.md](CIERRE_V1.md) y `docs/historial/` conservan antecedentes. No sustituyen el estado actual ni autorizan repetir trabajo cerrado.

## Flujo de ramas (obligatorio)

- Una rama por fase del plan vigente. Para el pulido actual, nombres de `PLAN_PULIDO_CUBO_MUSICA.md`, desde `main` actualizado o desde la fase de la que dependa.
- Commit y push de la rama. **Jay crea el PR y hace el merge.** No hacer push a `main` ni merges salvo que Jay lo pida explícitamente en ese momento.
- Continuar con todas las fases ya autorizadas sin esperar confirmación entre ramas. Entregar una rama no detiene la siguiente; un bloqueo externo solo detiene las acciones que dependen de él.
- Mensajes de commit en inglés, en imperativo, explicando el porqué. Sin identificadores de modelos.
- Al terminar una fase: actualizar `CAMBIOS.md`, la tabla de estado de `PLAN_2.0.md` y, si cambia el mapa técnico, `HANDOFF_CLAUDE.md`.
- Vercel Hobby limita los deploys diarios: no hacer pushes innecesarios.

## Verificación proporcional (acordada con Jay)

- Durante la fase: pruebas enfocadas en los sistemas modificados.
- Antes del push de una rama: `npm run audit:release`, `npm test` completos y recorridos de navegador de los sistemas afectados. Si cambia música, renders de audio afectados. Para documentación sola no se necesitan navegador ni audio.
- Antes de integrar/publicar `main`: suite completa de navegador y audio sobre el conjunto final, además de auditoría y lógica. Ejecutarla una vez por conjunto; repetir tras cambios funcionales relevantes o fallos.
- CI (`.github/workflows/checks.yml`) conserva las suites completas: navegador separado y tres grupos de audio sin omisiones; el check `browser-audio` exige ambos resultados. Un PR con comprobaciones pendientes o fallidas no se integra; que GitHub las imponga depende de las reglas de protección del repositorio.
- Registrar comandos ejecutados, resultados y qué queda para CI o aceptación manual. No presentar pruebas enfocadas como una ejecución completa.
- Si falla una prueba intermitentemente, arreglar la causa; nunca desactivarla.
- No ejecutar varias suites pesadas de audio/navegador simultáneamente en este entorno.

## Reglas técnicas

- Sin build ni dependencias npm: módulos ES nativos, Canvas 2D y Web Audio.
- Todo módulo o asset nuevo va **una sola vez** en el `SHELL` de `sw.js` (la auditoría lo comprueba).
- No consumir el RNG antiguo al añadir contenido: cambia posiciones de mapas existentes. Usar semillas nuevas versionadas.
- Guardados: normalizar y migrar; nunca borrar progreso ganado.
- `runtime` no se expone en producción; las pruebas lo instrumentan al servir `src/main.js`.
- Conservar los IDs de HTML existentes cuando sea posible: las pruebas de navegador dependen de ellos.

## Reglas de diseño (estilo J)

- Capa visual final: `styles/estilo-j.css`. Negro puro, esquinas rectas, blanco para estados, **dorado solo para lo ganado**, Geist Mono en toda la interfaz, Canvas y exportaciones (100–900).
- Textos en español: máximo 12 palabras, una idea, imperativo. Tachado-corrección en la Voz con `"~~antes~~ después"`. Firma *Simple.* solo en momentos importantes.
- UI silenciosa: menús y botones no hacen sonido musical.
- Menos, pero mejor: antes de añadir controles, ordenar lo que existe.
