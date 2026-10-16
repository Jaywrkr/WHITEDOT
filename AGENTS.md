# Instrucciones para agentes (Codex, Claude y otros)

WHITEDOT es un juego musical procedural de Jay (@jaywrkr): un pixel blanco en un mundo negro. Producción: https://whitedot-inky.vercel.app (Vercel, se publica al hacer merge a `main`).

## Prioridad actual

Jay autorizó [PLAN_DIRECCION_MUSICAL.md](PLAN_DIRECCION_MUSICAL.md): siete fases de música, una rama por fase. Fase 1 subida en `e2876a9`. Fase 2 subida en `b47d099`. Fase 3 subida en `92ebd5c`. Fase 4 subida en `b4d12fd`. Fase 5 subida en `9042c83`. Fase 6 subida en `97f7c98`. Fase 7 implementada y probada en `feat/musica-07-auditoria`, desde F6: 127 suites Node, 92 recorridos más offline y 39 programas de audio aprobados. Siguiente ciclo autorizado: [PLAN_INTERACCION_FINAL.md](PLAN_INTERACCION_FINAL.md), interfaz y miniinstrumentos, cada entrega en una rama dependiente. F2–F8 del pulido ya están subidas; el cierre F9 se incorpora a la auditoría musical final. Leer el plan nuevo antes de cambiar código. Interacción 1 está incluida y validada con la entrega visual 3. Entregas 3–5 implementadas y probadas en ramas dependientes; Jay mantiene PR/merge. Jay autorizó completar lo pendiente con «Hazlo entonces»: los miniinstrumentos se recuperan en entrega 6, desde perfil; siguen guía/referencias VJ (7) y cierre integral (8). Las tablas históricas no reabren trabajo cerrado.

El ciclo anterior [PLAN_EXPERIENCIA.md](PLAN_EXPERIENCIA.md) queda integrado por Jay. [CIERRE_EXPERIENCIA.md](CIERRE_EXPERIENCIA.md) conserva su evidencia y condiciones externas. Codex solo commit/push; Jay PR/merge. Escucha física, CI y deploy se verifican separadamente.

## Leer primero

1. [PLAN_DIRECCION_MUSICAL.md](PLAN_DIRECCION_MUSICAL.md): ciclo actual y entregas.
2. [CIERRE_EXPERIENCIA.md](CIERRE_EXPERIENCIA.md): auditoría, integración y prueba móvil.
3. [README.md](README.md) y [HANDOFF_CLAUDE.md](HANDOFF_CLAUDE.md): mapa técnico vigente.
4. [PLAN_2.0.md](PLAN_2.0.md): decisiones y estados anteriores; su cabecera remite al ciclo actual.

[CIERRE_LABORATORIO_VIVO.md](CIERRE_LABORATORIO_VIVO.md), [PLAN_PULIDO_FINAL.md](PLAN_PULIDO_FINAL.md), [AUDITORIA_CIERRE_2.0.md](AUDITORIA_CIERRE_2.0.md), [CIERRE_V1.md](CIERRE_V1.md) y `docs/historial/` conservan antecedentes. No sustituyen el estado actual ni autorizan repetir trabajo cerrado.

## Flujo de ramas (obligatorio)

- Una rama por fase del plan vigente. Para el pulido actual, nombres de `PLAN_DIRECCION_MUSICAL.md`, desde `main` actualizado o desde la fase de la que dependa.
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

## Continuación visual

Jay pidió no tocar la música y autorizó zonas VJ, encuentros visuales, sorpresas reversibles y perfil. Ver la ampliación de `PLAN_INTERACCION_FINAL.md`. Entrega 3 incluye la interfaz anterior y su conexión real a controles. Validada con 130 suites Node y tres programas de navegador enfocados. El contenedor tiene numerosos procesos zombis heredados; `WHITEDOT_CHROMIUM_SINGLE_PROCESS=1` en el wrapper local sirve solamente para pruebas que reutilizan un único contexto. No habilitarlo por defecto en CI ni omitir aserciones. Mininstrumentos sin terminar conservados aparte.

Cierre de esta ampliación: 130/131/132 suites Node por entrega, auditorías sin errores/advertencias y recorridos de navegador enfocados aprobados. La entrega final conserva exactamente los archivos de ejecución de la revisión integrada probada `ba0ee2a`; solo cambia la cadena local y su documentación. Ver informes `scripts/posmusica-03-validation.json` a `05`. No afirmar suite completa, escucha física ni deploy de esta ampliación. La autorización posterior de Jay permite miniinstrumentos y sonidos de estelas, con validación musical propia.

## Reanudación autorizada

`feat/posmusica-06-instrumentos` recupera selectivamente el trabajo conservado, sin aplicar controles antiguos sobre el UI nuevo. Diez familias; seis motores nuevos y tres motores avanzados reutilizados, batería electrónica existente con kit regional. `micro-instruments-model.js` distribuye por hábitat con semillas nuevas; `micro-instruments.js` conecta contacto, cercanía, escáner, colección y reloj. Cinco estelas musicales, máximo dos entradas por compás, usan la misma ruta de voces. No hacer sonar botones. Las respuestas repetidas vuelven a la rejilla antes de emitirse. Siguiente: guía y referencias reales de Jaywrkr/TDAI2026; después suites completas en un entorno con recursos.
