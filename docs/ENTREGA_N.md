# Objetivo excepcional · fases N

Autorizadas por Jay tras la revisión ciega de alpha.192. Meta: nueve en cada categoría, pendiente de evidencia; ninguna prueba concede una nota. Dependencia inicial: auditoría8 `3a8148b5`, desde L4. Una rama por fase, cada una desde la anterior. Jay conserva PR/merge. Generación musical, semillas, arte del mundo y progreso protegidos; integración y UI revisadas.

| Fase | Rama | Estado |
|---|---|---|
| N1 | `pulido/n1-entender-jugando` | Implementación técnica; aceptación pendiente |
| N2 | `pulido/n2-precision` | Implementación técnica; aceptación pendiente |
| N3 | `pulido/n3-frase-fiel` | Implementación técnica; aceptación pendiente |
| N4 | `pulido/n4-interfaz` | Implementación técnica; aceptación pendiente |
| N5 | `pulido/n5-recorrido` | Claridad/medición listas; calibración con personas pendiente |
| N6 | `pulido/n6-descubrimientos` | Implementación técnica; aceptación pendiente |
| N7 | `pulido/n7-integracion-musical` | Implementación técnica; aceptación pendiente |
| N8 | `pulido/n8-candidato` | Candidato técnico; nueve y cierre de producción sin acreditar |

Comprensión, emoción, aceptación sonora, rendimiento físico y puntuaciones requieren personas/dispositivos. No se sustituyen con bots, renders ni panel simulado. Supabase y tiendas siguen en pausa.

## N1 · 2.3.0-alpha.193

La guía recupera reglas del capítulo activo, condición pendiente y portal. Eco anuncia su acción real. Títulos y subtítulos secundarios separados. Sin nuevas interrupciones automáticas ni cambios de reglas.

Verificación: 249 suites Node aprobadas; guide_context_smoke.py en320/390/1280 aprobado; auditoría sin errores/avisos. Comprensión humana pendiente.

## N2 · 2.3.0-alpha.194

Tocar el área del cubo emite al apoyar, una sola vez; fuera conserva arrastre, escáner y toque al soltar. Ecos, banda, cristales, Línea y reacciones comparten referencia audible. Vacío distingue pulso musical válido de avance: espera en blanco sin premio visual falso. Sin cambiar síntesis ni patrones.

Verificación: 249 suites Node; touch_precision_smoke.py y journey_pulse_smoke.py aprobados. Despacho explícito menor de40ms en navegador, no latencia acústica física. Auditoría limpia. Bluetooth/teléfono pendientes.

## N3 · 2.3.0-alpha.195

La canción da a cada frase los compases necesarios; no descarta notas del mismo paso. Capturas nuevas guardan posición absoluta junto al paso juzgado; campaña deja de guardar el cabezal adelantado. Guardados antiguos conservados con orden compatible; pausas muy largas se abrevían por compases completos, sin afirmar reconstrucción histórica.

Verificación: 250 suites Node, round_phrase_smoke.py y render song_stage_mix.py aprobados; pico0,389 sin saturación. Auditoría limpia. Reconocimiento/agrado físico pendientes.

## N4 · 2.3.0-alpha.196

Finales actualizan ancho y altura de su canvas. Guía contextual reduce texto repetido y explica pulso/movimiento. Jerarquía y salidas adaptadas a pantalla baja, áreas seguras y contenido largo, sin redibujar mundo ni cubo.

Verificación: 250 suites Node; finale_resize_smoke.py, interface_smoke.py (cinco tamaños, ocho paneles) y guide_context_smoke.py aprobados. Auditoría limpia. Lector y pantalla física pendientes.

## N5 · 2.3.0-alpha.197

Ayuda explícita distingue vuelta abierta/cerrada, luces dentro, flor próxima, círculo del rayo y falta de espacio en Vacío. Observación opcional amplía métricas por lugar: primer avance, tiempo activo/sin progreso y ayuda. No fuerza Refugio ni recorta metas sin personas; calibración de esfuerzo pendiente.

Verificación: 251 suites Node; playtest_smoke.py ampliado y after_journey_smoke.py aprobados. Marcha real27,8s hacia Jardín,6465 unidades, gasto0. Auditoría limpia. Duración, emoción y deseo de continuar requieren sesiones nuevas.

## N6 · 2.3.0-alpha.198

Aviso de hallazgo permite Ver tarjeta: inspección completa voluntaria, función musical explícita, rareza/procedencia y reloj detenido hasta volver. No añade sonido ni interrumpe automáticamente. Libro conserva identidad. Cambio de interpretación revierte si guardar falla. Selector de casa agrupa disponibles y por descubrir sin ocultar objetos.

Verificación: 252 suites Node; card_inspect_smoke.py y rare_cards_smoke.py aprobados en móvil/horizontal/PC; cuenta atrás y movimiento detenidos, avisos en cola, libro y40 objetos preservados. Auditoría limpia. Valor emocional pendiente con personas.

## N7 · 2.3.0-alpha.199

Pausa del final11 silencia toda la salida, incluidas colas, y vuelve en el paso real del tema. Reloj visual sigue salida audible. Escenario avanza por pasos de transporte, sin saltar al cambiar tempo. Metadata absoluta real, época al reanudar campaña y ritmo nuevo en final5; corregida importación de su reloj y cancelación del escenario anterior. Generadores/voces conservados.

Verificación: 253 suites Node y regresiones focalizadas aprobadas. round_timing_smoke.py, journey_finale_smoke.py y song_stage_smoke.py reales aprobados; pausa completa pico0, retorno0,873; seis renders final5 pico0,144; final11 pico0,389. Sin saturación. Auditoría limpia. Escucha física pendiente.

## N8 · 2.3.0-alpha.200

Candidato alpha.200 con revisión independiente, cierres de fallos reproducidos y preservación verificada. Corregidos multitáctil, pausa retenida tras salto, abandono fallido, interpretación de fuente compartida, lectura de aprendizaje incompleto y métricas de Camino/once rondas. No se certifica nueve ni producción sin evidencia humana y CI.

Verificación: 253 suites Node; regresiones de táctil, tarjetas, métricas, foco, cuota y offline aprobadas. UI24 sin desbordamientos/objetivos<24px;16 capturas nuevas;186 renders de técnicas.311 archivos protegidos idénticos a la auditoría; voces/generadores conservados. Catálogo completo/CI, teléfono y personas pendientes.

## Orden y commits

| Orden | Rama | Commit | Versión |
|---|---|---|---|
| 1 | `pulido/n1-entender-jugando` | `5c9c5d40` | alpha.193 |
| 2 | `pulido/n2-precision` | `598439bf` | alpha.194 |
| 3 | `pulido/n3-frase-fiel` | `cab18f6a` | alpha.195 |
| 4 | `pulido/n4-interfaz` | `60f9d91c` | alpha.196 |
| 5 | `pulido/n5-recorrido` | `9e454c81` | alpha.197 |
| 6 | `pulido/n6-descubrimientos` | `91b0ef2c` | alpha.198 |
| 7 | `pulido/n7-integracion-musical` | `c8b9194b` | alpha.199 |
| 8 | `pulido/n8-candidato` | Ver HEAD de esta rama | alpha.200 |

N1 depende de `audit/panel-8-revision-ciega` (`3a8148b5`), que contiene L4. Cada rama siguiente contiene la anterior. Jay mantiene PR/merge; no se garantiza ausencia de conflictos si se cambia o reescribe la base por otro lado.

[Auditoría del candidato y pruebas por fase](panel/candidato-n/informe.md). Todos los criterios humanos siguen separados del cierre técnico. Prueba habitual: preview de N8; las fixtures con guardado aislado se explican en el informe. Reabrir una fase solo ante un problema concreto; no cambiar música o gráfica para fabricar una nota.


Para conservar la ascendencia de la pila, integrar en orden mediante commits de merge. Squash/rebase de una base requiere reajustar las ramas dependientes antes de compararlas. Esta entrega no ejecuta esos merges.


## Integración autorizada por Jay

La petición «Deja todo en main» autoriza reunir la pila completa hasta `2048e245` en `integracion/alpha-200-main` y fusionarla tras controles aprobados. No hace falta integrar individualmente las ocho ramas para esta entrega. Se preservan sus commits mediante merge, sin borrarlas ni cambiar la generación musical. La aceptación humana permanece pendiente.
