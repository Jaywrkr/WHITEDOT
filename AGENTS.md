# Instrucciones para agentes (Codex, Claude y otros)

WHITEDOT es un juego musical procedural de Jay (@jaywrkr): un pixel blanco en un mundo negro. Producción: https://whitedot-inky.vercel.app (Vercel, se publica al hacer merge a `main`).

## Leer primero

**Prioridad vigente:** [PLAN_CIERRE_2.0.md](PLAN_CIERRE_2.0.md) consolida el cierre por decisión de Jay. No confundir su F1 con la fase visual 1 histórica ni con M1. Conservar estados y trabajos locales de PLAN_2.0; Jay autorizó F2–F10 consecutivamente; una rama anidada por fase, con pruebas y push.

**Continuación autorizada durante la auditoría:** [PLAN_PULIDO_FINAL.md](PLAN_PULIDO_FINAL.md) organiza los ocho bloques de auditoría y soluciones. Su primer bloque es F10, no una auditoría duplicada. Seguir después con las ramas hijas de pulido, sin volver a pedir autorización. [AUDITORIA_CIERRE_2.0.md](AUDITORIA_CIERRE_2.0.md) conserva hallazgos, soluciones y límites. Jay mantiene PR/merge; nunca prometer perfección ni certificar aceptación física mediante emulación.

1. [PLAN_2.0.md](PLAN_2.0.md): **trabajo actual**. Fases, orden, ramas, criterios de "listo" y decisiones pendientes.
2. [README.md](README.md): cómo correr, verificar y publicar.
3. [HANDOFF_CLAUDE.md](HANDOFF_CLAUDE.md): mapa técnico de módulos y dirección creativa que debe conservarse.
4. [CIERRE_V1.md](CIERRE_V1.md): estilo J y decisiones de la 1.1.0.

`docs/historial/` es historia: no describe el estado actual.

## Flujo de ramas (obligatorio)

- Una rama por fase del plan vigente; para el cierre, nombres de `PLAN_CIERRE_2.0.md`, desde `main` actualizado o desde la fase de la que dependa.
- Commit y push de la rama. **Jay crea el PR y hace el merge.** No hacer push a `main` ni merges salvo que Jay lo pida explícitamente en ese momento.
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
