# Juego musical · ciclo 2.3

Autorizado por Jay: ejecutar las doce fases consecutivamente, sin pedir aprobación entre ellas. Cada rama nace de la anterior. Codex hace commit/push; Jay PR/merge, en orden. No integrar main desde Codex.

Versiones: `2.3.0-alpha.1` a `alpha.12`, una por fase. `node scripts/bump-version.mjs VERSION` sincroniza package, release-info y caché. Fecha/hora y revisión se sellan únicamente en el artefacto real de Vercel. Semillas antiguas, premios y campos desconocidos se conservan.

| Fase | Rama | Versión | Estado | Resultado esperado |
|---|---|---|---|---|
| 1 · Llegadas variadas | `feat/juego-01-llegadas` | `2.3.0-alpha.1` | Subida en `07cd4b4` | Contraste musical entre visitas; regreso exacto y guardado seguro. |
| 2 · Instrumentos expresivos | `feat/juego-02-sonido` | `2.3.0-alpha.2` | Subida en `7e01e1c` | Articulación y dinámica por rol, percusión variada y mezcla controlada. |
| 3 · Composición regional | `feat/juego-03-composicion` | `2.3.0-alpha.3` | Implementada y probada; entrega en esta rama | Motivos, bajos, groove, descansos y arreglos de dos a diez instrumentos. |
| 4 · Interpretación | `feat/juego-04-interpretacion` | `2.3.0-alpha.4` | Pendiente | Gestos audibles a tiempo, filtros y respuesta visual localizada. |
| 5 · Encuentros vivos | `feat/juego-05-encuentros` | `2.3.0-alpha.5` | Pendiente | Invitaciones legibles por hábitat, personalidades y límites de densidad. |
| 6 · Perseguir y encontrar | `feat/juego-06-perseguir` | `2.3.0-alpha.6` | Pendiente | Mensajeros, cometas e individuos; observar e interceptar también sirve. |
| 7 · Escapar y refugiarse | `feat/juego-07-escapar` | `2.3.0-alpha.7` | Pendiente | Persecuciones suaves, refugios y salida voluntaria sin perder progreso. |
| 8 · Carreras musicales | `feat/juego-08-carreras` | `2.3.0-alpha.8` | Pendiente | Circuitos naturales, atajos y marcas sin alterar el reloj musical. |
| 9 · Desafíos musicales | `feat/juego-09-desafios` | `2.3.0-alpha.9` | Pendiente | Llamada/respuesta y pistas; aprender escuchando, sin castigar errores. |
| 10 · Fiestas regionales | `feat/juego-10-fiestas` | `2.3.0-alpha.10` | Pendiente | Procesiones y voces complementarias con desarrollo y final. |
| 11 · Progresión útil | `feat/juego-11-progresion` | `2.3.0-alpha.11` | Pendiente | Premios por interpretar; memoria, colección y regreso sin molienda. |
| 12 · Auditoría y guía | `feat/juego-12-cierre` | `2.3.0-alpha.12` | Pendiente | Recorrido breve; suites completas, auditoría de música y límites explícitos. |

## Condiciones de cierre por entrega

- Acuerdo actualizado de Jay: auditoría rápida, Node afectado y un recorrido representativo por cambio; reutilizar evidencia de código intacto.
- Navegador de sistemas afectados; audio renderizado si cambia sonido.
- No reemplazar escucha por métricas. El teléfono físico queda como aceptación externa explícita.
- Última fase: Node, navegador y audio completos, guardados, rendimiento y revisión musical. Ampliar antes solo si un fallo o cambio transversal lo exige.
- Una sola pista visible, UI silenciosa, Geist Mono, negro, esquinas rectas; dorado ganado.
- Retos opcionales: ni penalización de progreso ni recompensas por botones de navegación.
- Dos a diez instrumentos significa variedad de arreglos; no diez voces tocando sin descanso.

## Auditoría inicial del main integrado

CI de main `9fb6864`: lógica verde; navegador detecta metadatos de región desactualizados si un aviso se omite, tarjeta sobre grabación, guía tapada, catálogo de laboratorio con expectativa antigua (248 frente a 254), y prueba que aún exige tarjetas grandes para repetidos. Corregir causas, conservar suites y registrar nueva evidencia. No atribuir el verde de otra revisión a esta.

## Aceptación musical

Minimal: economía, interacción bombo/bajo y evolución tímbrica. Blues electrónico: fraseo, llamada/respuesta y resolución. Garage: síncopa y swing. Afro house: capas complementarias y repetición evolutiva. Son criterios generales de composición, no copias de artistas ni supuestas escuchas de grabaciones no disponibles. Auditar cambios de tempo, armonía y silencios, además del contraste entre territorios.

## Evidencia de fase 1

Leer [CIERRE_JUEGO_MUSICAL.md](CIERRE_JUEGO_MUSICAL.md). Auditoría y 137 suites Node aprobadas; 13 recorridos enfocados de navegador aprobados. Navegador recuperado con Headless Shell 153 verificado desde npm, aislado del juego. Cada fase siguiente nace de la anterior y conserva su validación propia.
