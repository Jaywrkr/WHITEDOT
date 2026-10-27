# Traspaso vigente · alpha.222

**Continuar desde `main`** (27 de octubre de 2026, tras el PR de Q7). Jay crea PR y hace merge salvo que pida otra cosa.

**Lo siguiente:** una auditoría externa (Codex) según [Auditoría externa](docs/AUDITORIA_EXTERNA.md). Ellos entregan notas, hallazgos y un plan; Jay decide aquí qué se hace y qué no, con la nota que se espera mover.

Leer [AGENTS](AGENTS.md), [README](README.md), [Arquitectura](docs/ARQUITECTURA.md) y [Verificación](docs/VERIFICACION.md). [HANDOFF_CLAUDE](HANDOFF_CLAUDE.md) solo apunta aquí.

## Qué hay en `main`

| Plan | Qué | PR | Versión |
|---|---|---|---|
| E1–E7 | Fiabilidad, interacción, interfaz, recorrido | #355 | alpha.207 |
| Sesión 10 · P1–P8 | Pantallas limpias, menús, un solo reloj, color ganado, menos contadores; D1–D6 | #357, #358 | alpha.208–215 |
| Sesión 11 · Q1–Q6 | Reglas a la vista, la Cueva cuenta el eco, Tu canción crece y se cierra, Refugio legible, golpe al oírse, día nuevo y un solo gesto; D7, D10, D11 | #359 | alpha.216–221 |
| Sesión 11 · Q7 | Los dos finales en dub techno: subida, golpe en la tónica y corte seco; el tema con sus notas; el Mundo calla bajo el final de los once; D8, D9. Jay oyó y aprobó los renders | PR de Q7 | alpha.222 |

CI completo en verde en cada merge: lógica, 6 tandas de navegador y 6 de audio. Detalle en [CAMBIOS](CAMBIOS.md).

## Qué falta

1. **Auditoría externa:** [guía](docs/AUDITORIA_EXTERNA.md). Nadie ha puntuado alpha.222.
2. **Teléfono y personas:** los dos finales dentro del juego (con altavoz y auriculares), el toque, la luz con el retraso real del audio, el final del Viaje, el Refugio y volver al día siguiente. Android de gama media, Safari, altavoz, auriculares y Bluetooth. [Protocolo](docs/PRUEBAS_CON_PERSONAS.md); el [registro](docs/aceptacion-e.json) sigue sin participantes.
3. **Ramas viejas** en GitHub: borrarlas a mano (la sesión no tiene permiso).

## Notas del panel

| Sesión | Versión | Media | Menús | Detalle visual |
|---|---|---|---|---|
| [10](docs/panel/sesion-10/informe.md) | alpha.207 | 6,7 | 5,5 | 5,5 |
| [11](docs/panel/sesion-11/informe.md) | alpha.215 | 6,7 | 7 | 5,5 |

La 11 no se compara directa con la 10: nueve perfiles no puntuaron Audio y seis no puntuaron Sensación. Son lentes simuladas, no opiniones reales ni escucha humana. La meta es diez en cada categoría; no está acreditada.

## Límites que se mantienen

- Conservar música, síntesis, notas, armonías, mezcla, RNG, mundos, especies y cubo pequeño.
- Guardados antiguos y futuros se migran sin borrar progreso ni premios.
- El [verificador de preservación](scripts/verify-e-preservation.mjs) protege 301 archivos y trece contratos. Lo que cambiaron P3–P8 se compara con `main` tras P8 (`5464612`). Lo que cambiaron Q1–Q6 se compara con el final de Q6 y sus arreglos de CI (`4183856`). Los finales y el silencio del Mundo bajo el final de los once, con Q7 (`fce8496`). Lo demás, con la base E.
- UI negra, Geist Mono, esquinas rectas, menús silenciosos; dorado solo para ★ y ✦.
- Supabase y tiendas en pausa: no reaplicar SQL, no borrar cuentas, no publicar. `server/` es un prototipo histórico, no un backend activo.

## Probar en el teléfono

Abrir una vista previa de Vercel sin `?dev=1`. La de Q1–Q6 es [esta](https://whitedot-git-panel11-q6-mundo-libre-jaywrkr-1498s-projects.vercel.app) (mismo contenido que `main`).

Qué mirar: tocar donde sea y que suene al apoyar el dedo; que la onda y el cubo coincidan con la nota; la Cueva; Lugares y el Refugio; dejar el juego y volver al día siguiente.

Atajos `?lugar=jardin`, `?anillo=1`, `?festival=1` en un perfil temporal; [lista](docs/MUNDO.md#herramientas-de-prueba). No borrar la partida personal ni contar un atajo como recorrido completo.
