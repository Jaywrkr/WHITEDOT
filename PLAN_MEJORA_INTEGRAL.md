# Mejora integral · consolidación 2.3

Autorizado por Jay con «hazlo». Sustituye la ampliación del ciclo anterior: mejorar los sistemas existentes, sin añadir catálogos ni mecánicas. Carreras/persecuciones nuevas quedan fuera. Base: recuperación `faa0fe9`. Cada rama nace de la anterior; Codex commit/push y Jay PR/merge. Guardados, coordenadas y premios se preservan.

| Fase | Rama | Versión | Estado | Cierre |
|---|---|---|---|---|
| 1 · Identidad musical | `mejora/01-identidad-musical` | 2.3.0-alpha.5 | Implementada y probada | Una prioridad musical; preservar la radio recuperada. |
| 2 · Composición y mezcla | `mejora/02-composicion` | 2.3.0-alpha.6 | Implementada y probada | Bajo, groove, voces y descansos coordinados. |
| 3 · Interpretación | `mejora/03-interacciones` | 2.3.0-alpha.7 | Implementada y probada | Contacto, permanencia y movimiento legibles. |
| 4 · Mundo y habitantes | `mejora/04-mundo` | 2.3.0-alpha.8 | Implementada y probada | Coherencia, apariciones suaves y siluetas legibles. |
| 5 · Encuentros | `mejora/05-encuentros` | 2.3.0-alpha.9 | Implementada y probada | Invitación, gesto, respuesta y salida comprensibles. |
| 6 · Viajes y favoritos | `mejora/06-viajes` | 2.3.0-alpha.10 | Pendiente | Guardar, encontrar y regresar con menos fricción. |
| 7 · Interfaz y cubo | `mejora/07-interfaz` | 2.3.0-alpha.11 | Pendiente | Móvil/PC, paneles y personalización congruentes. |
| 8 · Colección | `mejora/08-coleccion` | 2.3.0-alpha.12 | Pendiente | Tarjetas, rareza, bitácora y progreso claros. |
| 9 · Recorrido y Casa | `mejora/09-recorrido` | 2.3.0-alpha.13 | Pendiente | Enseñar jugando y conectar lo descubierto con Casa. |
| 10 · Cierre | `mejora/10-cierre` | 2.3.0-alpha.14 | Pendiente | Integración, rendimiento, suites y límites documentados. |

Verificación proporcional: auditoría, suites afectadas, un recorrido representativo y renders afectados cuando cambia audio. Reutilizar verde de código intacto. Completas una vez sobre el conjunto final; no desactivar pruebas. Escucha física/CI/deploy se registran aparte. UI silenciosa, Geist Mono, negro y dorado ganado.

## Fase 1

Problema comprobado: después de que la radio compusiera la pieza, living-composition aplicaba otra forma independiente cada 32 compases. En su cuarto capítulo borraba notas y reducía de nuevo la energía del motivo recuperado. El marco regional pasa a ser dueño de forma, niveles y brillo; la capa viva conserva metadatos y resta solo cuando el jugador entra en un espacio de quietud explícito. Radio histórica, armonía híbrida, ensamble y gesto mantienen sus papeles.

Resultados y comandos por fase en `scripts/mejora-NN-validation.json`; evolución técnica en HANDOFF_CLAUDE y CAMBIOS. Ninguna fase equivale a garantía de belleza musical ni publicación remota.
