# Tetsuya Mizuguchi · revisión simulada

No son opiniones reales del creador. Revisor nuevo sin notas históricas; alpha.200, `fd5dfc19`. Audio técnico y sensación provisional no equivalen a escucha ni uso humano.

| Eje | Nota |
|---|---:|
| Visual | 6,5 |
| Audio técnico | 7,5 |
| Creatividad | 7,5 |
| Sensación* | — |
| Cohesión | 7 |
| Pulido | 7 |

[Análisis original y alcance](evidencia/mizuguchi.json). Las rutas temporales de imágenes corresponden a los mismos nombres conservados en [capturas](capturas/). No se atribuye a este revisor lo que comprobaron otros.

## Fortalezas

- Successful cube pulses share one estimated audible landing for vibration, glow and kick; reduced motion suppresses kick and stale or hidden callbacks are guarded.
- The small cube is an explicit instrument with press-time dispatch, while a repeatable six-note theme, anticipatory bar guide and graduated forms provide a coherent rhythm vocabulary.

## Hallazgos y límites

- Several world cue timers still use scheduled audio time without output-latency compensation: nearby objects, singers and queued touch visuals can light before estimated audible output. This is a code-level inconsistency with the cube's compensated landing; perceptual magnitude was not measured.
- An empty-space tap dispatches its pulse only on release, although judgement retains its press timestamp; a short press can therefore be judged accurately while its response arrives later. The cube's immediate path is limited to a 24px radius and fingerTouch=false. This is an intentional gesture tradeoff, not a demonstrated regression.
- Reported output latency is capped at 400ms, so synchrony compensation does not represent devices reporting greater delays. The focused test covers only 0–400ms.

Las clasificaciones del coordinador y las decisiones que no se reabren están en el [informe](informe.md).
