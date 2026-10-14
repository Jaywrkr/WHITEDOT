# Instrucciones para agentes (Codex, Claude y otros)

WHITEDOT es un juego musical procedural de Jay (@jaywrkr): un pixel blanco en un mundo negro. Producción: https://whitedot-inky.vercel.app (Vercel, se publica al hacer merge a `main`).

## Leer primero

1. [PLAN_2.0.md](PLAN_2.0.md): **trabajo actual**. Fases, orden, ramas, criterios de "listo" y decisiones pendientes.
2. [README.md](README.md): cómo correr, verificar y publicar.
3. [HANDOFF_CLAUDE.md](HANDOFF_CLAUDE.md): mapa técnico de módulos y dirección creativa que debe conservarse.
4. [CIERRE_V1.md](CIERRE_V1.md): estilo J y decisiones de la 1.1.0.

`docs/historial/` es historia: no describe el estado actual.

## Flujo de ramas (obligatorio)

- Una rama por fase de `PLAN_2.0.md` (`v2/f0-coleccion`, `v2/f1-universo-visual`, …), desde `main` actualizado o desde la fase de la que dependa.
- Commit y push de la rama. **Jay crea el PR y hace el merge.** No hacer push a `main` ni merges salvo que Jay lo pida explícitamente en ese momento.
- Mensajes de commit en inglés, en imperativo, explicando el porqué. Sin identificadores de modelos.
- Al terminar una fase: actualizar `CAMBIOS.md`, la tabla de estado de `PLAN_2.0.md` y, si cambia el mapa técnico, `HANDOFF_CLAUDE.md`.
- Vercel Hobby limita los deploys diarios: no hacer pushes innecesarios.

## Verificación antes de cada push

```sh
npm run audit:release
npm test
npm run test:browser        # CHROMIUM_PATH si Chromium no está en el PATH
npm run test:audio          # si se toca sonido o música
```

CI (`.github/workflows/checks.yml`) corre lo mismo. Si una prueba falla de forma intermitente, encontrar la causa; nunca desactivarla.

## Reglas técnicas

- Sin build ni dependencias npm: módulos ES nativos, Canvas 2D y Web Audio.
- Todo módulo o asset nuevo va **una sola vez** en el `SHELL` de `sw.js` (la auditoría lo comprueba).
- No consumir el RNG antiguo al añadir contenido: cambia posiciones de mapas existentes. Usar semillas nuevas versionadas.
- Guardados: normalizar y migrar; nunca borrar progreso ganado.
- `runtime` no se expone en producción; las pruebas lo instrumentan al servir `src/main.js`.
- Conservar los IDs de HTML existentes cuando sea posible: las pruebas de navegador dependen de ellos.

## Reglas de diseño (estilo J)

- Capa visual final: `styles/estilo-j.css`. Negro puro, esquinas rectas, blanco para estados, **dorado solo para lo ganado**, Silkscreen para una frase por pantalla, JetBrains Mono para el resto.
- Textos en español: máximo 12 palabras, una idea, imperativo. Tachado-corrección en la Voz con `"~~antes~~ después"`. Firma *Simple.* solo en momentos importantes.
- UI silenciosa: menús y botones no hacen sonido musical.
- Menos, pero mejor: antes de añadir controles, ordenar lo que existe.
