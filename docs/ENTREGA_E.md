# Objetivo diez · entrega E

Jay autorizó ejecutar las siete fases, sin confirmación entre ellas. La meta diez no es una nota concedida: exige fiabilidad, comprensión y aceptación reales. Cada rama contiene la anterior; Jay crea los PR y hace merge. Base técnica: main `fd5dfc19`, alpha.200; E1 incluye también la auditoría9 `0457fd06` aún pendiente de integrar.

| Fase | Rama | Estado | Criterio de cierre |
|---|---|---|---|
| E1 | `excepcional/e1-fiabilidad` | Implementada; pruebas locales aprobadas | Resultados coherentes y avisos visuales a tiempo |
| E2 | `excepcional/e2-interaccion` | Implementada; pruebas locales aprobadas | Gestos legibles, cancelación segura y respuestas distintas |
| E3 | `excepcional/e3-aprender` | Implementada; pruebas locales aprobadas | Ayuda concreta en el momento necesario |
| E4 | `excepcional/e4-interfaz` | Implementada; pruebas locales aprobadas | Lectura, desplazamiento y salida consistentes |
| E5 | `excepcional/e5-descubrimientos` | Implementada; pruebas locales aprobadas | Hallazgo, uso y regreso comprensibles |
| E6 | `excepcional/e6-recorrido` | Implementada; pruebas locales aprobadas | Aportación personal y próximos pasos claros |
| E7 | `excepcional/e7-validacion` | Validación técnica en curso; personas pendientes | Revisión independiente, regresiones y protocolo humano listo |

## Límites protegidos

No se rehacen síntesis, patrones, armonías, mezcla, transiciones, mapas, flora/fauna ni RNG. El cubo mantiene su tamaño. Menús silenciosos. Guardados antiguos y futuros conservados. Los cambios al secuenciador de E1 afectan exclusivamente al instante de la luz, nunca al del sonido. Supabase/tiendas siguen en pausa.

Solo pruebas enfocadas durante las fases, más lógica/auditoría requeridas antes de cada push; no se repite el catálogo audiovisual completo con cada rama. La revisión final reutiliza evidencia de archivos intactos. CI completo antes de integrar main, no confundido con resultados locales.

## E1 · alpha.201

Porcentaje con una cifra decimal truncada:74,6% no aparenta alcanzar75%. Resultado muestra el umbral de Ritmo y Maestro. Cronómetro deriva minutos y segundos de un solo total. Flores, solistas, cantores, cola visual y Estudio siguen la latencia estimada de salida; callbacks descartados al cambiar partida, modo/capa, pausar audio, ocultar página o llegar tarde.

Verificación local aprobada:253 suites Node; result_clarity_smoke.py (móvil/horizontal/PC), places_smoke.py y round_phrase_smoke.py; siete renders foundation_mix.py, pico máximo0,876 sin saturación; auditoría0errores/0avisos. Las pruebas nuevas cubren74,6/75%, límite de minuto y cancelación de luces tardías/de otra capa. Los tests temporizados no miden latencia acústica de teléfonos. No se otorga nota nueva.

## Validación que necesita personas

Cinco sesiones formativas y una tanda independiente de8–12, altavoz/auriculares/Bluetooth, Safari móvil, lector y teléfono de gama media. Preparar no significa ejecutar. Nadie se inventa respuestas, gusto, intención de volver ni notas. Los resultados reales decidirán qué criterios se cierran y qué fase concreta se reabre.


## E2 · alpha.202

La Línea distingue acierto dorado, espera con corchete blanco y error; el primer golpe tiene mayor jerarquía sin añadir otra guía. Entradas canceladas al ocultar página, perder foco o enfocar controles: no quedan teclas, arrastres ni escáneres pendientes. Se mantienen pulso inmediato del cubo y desambiguación de arrastre/hold en vacío. Sin sonidos nuevos ni cambios de reglas. Verificación local:253 suites Node; touch_precision_smoke.py ampliado (cancelar, foco, teclado, segundo dedo y recuperación), journey_pulse_smoke.py y player_touch_smoke.py aprobados. Auditoría limpia. El pulso explícito conserva despacho menor de40ms en Chromium; no es latencia acústica física. Audio E1 reutilizado: síntesis/arreglo no cambiaron.


## E3 · alpha.203

Cómo jugar queda visible al abrir el menú, sin desplegar Más. La guía resalta una acción según el estado actual y evita repetir el objetivo en otra tarjeta. Jardín comparte distancias/etapas entre su demostración y la ayuda: acercarse, sembrar, regar o cosechar. Prioriza la planta bajo el cubo y las que realmente puede regar; una planta lejana no secuestra la explicación. Bosque, Llanura, Lago, Tormenta, Faros, Ruinas y Vacío conservan ayudas contextuales sin nuevos avisos automáticos. Reglas, semillas y sonidos intactos. Verificación local:253 suites Node; guide_context_smoke.py (320/390/1280), place_lesson_smoke.py ampliado con sembrar/regar y primera flor reales, after_journey_smoke.py aprobados. Marcha real27,6s/6436unidades hacia Jardín, gasto0. Auditoría limpia. No equivale a comprensión humana.


## E4 · alpha.204

Etiquetas pendientes de Tu canción legibles sin convertirlas en premios. Lugares señala y coloca el próximo objetivo dentro de la lista; scroll con teclado y señal discreta cuando queda contenido debajo. Cabecera con cierre consistente en Lugares, resultado y portal. El final5 solo sale mediante Seguir explorando, créditos, Escape o salida programada; el fondo no lo omite. Botones de tarjetas con área táctil44px. Sin cambiar partituras ni estética del mundo. Verificación local:253 suites Node; polish_navigation_smoke.py en cuatro tamaños, interface_smoke.py en cinco (ocho paneles), finale_resize_smoke.py, festival_smoke.py y refugio_lugares_smoke.py aprobados. Auditoría limpia. Cierres, foco, scroll y salida al Mundo comprobados; pantalla física/lector pendientes.


## E5 · alpha.205

El libro muestra cuántas voces eliges, cuáles ya están en el jardín y cuándo está completo; acceso directo al Refugio. Función musical distingue el hallazgo de su interpretación en el jardín. Añadir/retirar voces, guardar conjuntos y cargarlos revierten si falla escribir: no anuncian éxito ni consumen tarjetas. Favoritos conserva deliberadamente trabajo pendiente para exportar/reintentar y ahora lo dice dentro de su panel, con acceso al cuidado del guardado. La ayuda de una ronda no ofrece abandonar para seguir a otro destino. Sin cambiar los instrumentos. Verificación local:253 suites Node; collection_commit_smoke.py (añadir/retirar/guardar/cargar con cuota, recarga y formato futuro), favorite_save_failure_smoke.py, experience_garden_smoke.py, card_inspect_smoke.py y rare_cards_smoke.py aprobados. Auditoría limpia. Se conserva el trabajo no guardado de favoritos y las cinco tarjetas en todos los fallos simulados; jardín de versión futura queda de solo lectura incluso al reemplazarse dentro de una partida.


## E6 · alpha.206

Tu canción distingue capas ganadas de frases guardadas para el final. En el final11, una línea sigue las secciones reales del transporte audible: lugares, frase propia, espacio y tema; indica vista silenciosa al estar silenciado. El final5 identifica tu interpretación en su subtítulo y nombre accesible. No cambia notas ni armonización. El objetivo de cierre explica la apertura del Mundo, y el resultado usa Seguir hacia como Lugares/Guía. Sin nuevas ventanas o instrumentos. Verificación local:253 suites Node; song_authorship_smoke.py (reloj real y MIDI/ticks intactos), song_stage_smoke.py (final11 y Maestro completos en móvil/PC), places_smoke.py y finale_resize_smoke.py aprobados. Auditoría limpia. La etiqueta sigue el cursor audible, no el cabezal programado; no es una escucha humana de reconocimiento.


## E7 · alpha.207

Revisión del candidato completo; corregida concordancia de un lugar guardado. Detectado y cerrado el consumo anticipado de marcas futuras: flores/Estudio reciben ahora la marca solo cuando llega su callback audible, conservando los dibujantes. Una regresión usa el secuenciador real con latencia180ms y verifica ausencia de luz antes y presencia al llegar. Verificador reproducible de311 archivos protegidos y doce contratos musicales: mapas, catálogos, voces, reglas, MIDI y partituras conservados; audio.js solo contiene las seis sustituciones visuales autorizadas. Registro de aceptación con identidad del runtime, dos tandas independientes, dispositivos y puntuaciones declaradas. El validador no cuenta bots, duplicados, formularios vacíos o una confirmación de otra versión. No concede diez ni autentica personas. La revisión independiente encontró y corrigió cierre de resultados con Escape, redondeo residual de Lugares, instrucción final de Jardín, arrastre con guardado fallido y luces que se adelantaban o seguían pulsando en silencio. Los resultados identifican lugar, colección y ronda. Comprobaciones y revisión independiente en curso; no acredita CI nuevo, escucha física ni sesiones humanas.
