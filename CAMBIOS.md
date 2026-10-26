# Cambios recientes de Kubono

Estado: 25 de octubre de 2026. Código **2.3.0-alpha.200**. Las entradas describen su revisión, no certifican producción.

## E4 · 2.3.0-alpha.204

Lugares enfoca el siguiente destino y explica el desplazamiento; cierres de cabecera consistentes. Final5 con salida explícita, sin omisión al tocar el fondo. Etiquetas pendientes y controles de tarjeta legibles. [Entrega](docs/ENTREGA_E.md).

## E3 · 2.3.0-alpha.203

Ayuda directa desde el menú; una acción actual resaltada, sin objetivo duplicado. Jardín comparte su objetivo real con la demostración y distingue sembrar, regar y cosechar. [Entrega](docs/ENTREGA_E.md).

## E2 · 2.3.0-alpha.202

Entradas canceladas al perder foco/abrir controles, sin pulsos al cancelar. Primer tiempo legible y espera visual distinta de avance. Música y tamaño del cubo intactos. [Entrega](docs/ENTREGA_E.md).

## E1 · 2.3.0-alpha.201

Resultados precisos: porcentaje no redondea a una estrella sin ganar; cronómetro coherente y umbrales visibles. Avisos visuales residuales siguen salida audible y descartan callbacks obsoletos, sin cambiar sonido. [Plan y entrega](docs/ENTREGA_E.md).

## Panel9 · evaluación de alpha.200 integrada

Diez revisores nuevos y16 capturas actuales. Nota provisional7,6; audio técnico y sensación sin aceptación física. Se conservan todas las notas anteriores y su distinto alcance. Se reproducen redondeo de porcentaje/cronómetro en resultados y se verifica sincronía visual residual. Solo documentación y evidencia; no cambia música, mundos, progreso ni versión. [Informe](docs/panel/sesion-9/informe.md).

## Integración de alpha.200

Jay autoriza incorporar a main la pila completa de23 commits hasta `2048e245`, mediante una sola integración. El catálogo de audio pasa de tres a seis grupos aislados tras agotar40 minutos: conserva todas sus59 pruebas. Se conserva el runtime ya entregado; se actualizan estado y traspaso. El catálogo completo detectó ocho pruebas antiguas: se ajustan a recompensas K2, ayudas explícitas, menú compacto, guía/teletransporte por lugar, poderes combinados y la etiqueta «Otro paisaje», conservando sus comprobaciones funcionales. CI completo del PR354 aprobado y merge realizado. [Registro](docs/INTEGRACION_ALPHA_200.md). La aceptación con personas sigue pendiente.

## N8 · 2.3.0-alpha.200

Candidato alpha.200 con revisión independiente, cierres de fallos reproducidos y preservación verificada. Corregidos multitáctil, pausa retenida tras salto, abandono fallido, interpretación de fuente compartida, lectura de aprendizaje incompleto y métricas de Camino/once rondas. No se certifica nueve ni producción sin evidencia humana y CI.

Verificación: 253 suites Node; regresiones de táctil, tarjetas, métricas, foco, cuota y offline aprobadas. UI24 sin desbordamientos/objetivos<24px;16 capturas nuevas;186 renders de técnicas.311 archivos protegidos idénticos a la auditoría; voces/generadores conservados. Catálogo completo/CI, teléfono y personas pendientes.

## N7 · 2.3.0-alpha.199

Pausa del final11 silencia toda la salida, incluidas colas, y vuelve en el paso real del tema. Reloj visual sigue salida audible. Escenario avanza por pasos de transporte, sin saltar al cambiar tempo. Metadata absoluta real, época al reanudar campaña y ritmo nuevo en final5; corregida importación de su reloj y cancelación del escenario anterior. Generadores/voces conservados.

Verificación: 253 suites Node y regresiones focalizadas aprobadas. round_timing_smoke.py, journey_finale_smoke.py y song_stage_smoke.py reales aprobados; pausa completa pico0, retorno0,873; seis renders final5 pico0,144; final11 pico0,389. Sin saturación. Auditoría limpia. Escucha física pendiente.

## N6 · 2.3.0-alpha.198

Aviso de hallazgo permite Ver tarjeta: inspección completa voluntaria, función musical explícita, rareza/procedencia y reloj detenido hasta volver. No añade sonido ni interrumpe automáticamente. Libro conserva identidad. Cambio de interpretación revierte si guardar falla. Selector de casa agrupa disponibles y por descubrir sin ocultar objetos.

Verificación: 252 suites Node; card_inspect_smoke.py y rare_cards_smoke.py aprobados en móvil/horizontal/PC; cuenta atrás y movimiento detenidos, avisos en cola, libro y40 objetos preservados. Auditoría limpia. Valor emocional pendiente con personas.

## N5 · 2.3.0-alpha.197

Ayuda explícita distingue vuelta abierta/cerrada, luces dentro, flor próxima, círculo del rayo y falta de espacio en Vacío. Observación opcional amplía métricas por lugar: primer avance, tiempo activo/sin progreso y ayuda. No fuerza Refugio ni recorta metas sin personas; calibración de esfuerzo pendiente.

Verificación: 251 suites Node; playtest_smoke.py ampliado y after_journey_smoke.py aprobados. Marcha real27,8s hacia Jardín,6465 unidades, gasto0. Auditoría limpia. Duración, emoción y deseo de continuar requieren sesiones nuevas.

## N4 · 2.3.0-alpha.196

Finales actualizan ancho y altura de su canvas. Guía contextual reduce texto repetido y explica pulso/movimiento. Jerarquía y salidas adaptadas a pantalla baja, áreas seguras y contenido largo, sin redibujar mundo ni cubo.

Verificación: 250 suites Node; finale_resize_smoke.py, interface_smoke.py (cinco tamaños, ocho paneles) y guide_context_smoke.py aprobados. Auditoría limpia. Lector y pantalla física pendientes.

## N3 · 2.3.0-alpha.195

La canción da a cada frase los compases necesarios; no descarta notas del mismo paso. Capturas nuevas guardan posición absoluta junto al paso juzgado; campaña deja de guardar el cabezal adelantado. Guardados antiguos conservados con orden compatible; pausas muy largas se abrevían por compases completos, sin afirmar reconstrucción histórica.

Verificación: 250 suites Node, round_phrase_smoke.py y render song_stage_mix.py aprobados; pico0,389 sin saturación. Auditoría limpia. Reconocimiento/agrado físico pendientes.

## N2 · 2.3.0-alpha.194

Tocar el área del cubo emite al apoyar, una sola vez; fuera conserva arrastre, escáner y toque al soltar. Ecos, banda, cristales, Línea y reacciones comparten referencia audible. Vacío distingue pulso musical válido de avance: espera en blanco sin premio visual falso. Sin cambiar síntesis ni patrones.

Verificación: 249 suites Node; touch_precision_smoke.py y journey_pulse_smoke.py aprobados. Despacho explícito menor de40ms en navegador, no latencia acústica física. Auditoría limpia. Bluetooth/teléfono pendientes.

## N1 · 2.3.0-alpha.193

La guía recupera reglas del capítulo activo, condición pendiente y portal. Eco anuncia su acción real. Títulos y subtítulos secundarios separados. Sin nuevas interrupciones automáticas ni cambios de reglas.

Verificación: 249 suites Node aprobadas; guide_context_smoke.py en320/390/1280 aprobado; auditoría sin errores/avisos. Comprensión humana pendiente.

## Octava auditoría · revisión ciega de alpha.192

Rama documental `audit/panel-8-revision-ciega`, desde L4 `a850ceee`; misma versión y runtime intacto. Cinco revisores nuevos, diez lentes simuladas sin notas previas; media6,83 por rúbrica exigente.16 capturas y24 paneles actuales,71 comprobaciones musicales simbólicas y sondas de frase, tiempo, input y tamaño de finales. Audio técnico sin escucha; notas sensoriales provisionales. Diez hallazgos nuevos enlazados después de puntuar; M1–M4 propuestos sin implementar. Informe en docs/panel/sesion-8/informe.md.

## L4 · Validación técnica · alpha.192

- Camino táctil, marcha al Jardín, premios y final11 comprobados en recorridos enfocados.
- Corregida una carrera de avisos: un mensaje cotidiano no borra una explicación importante pendiente; aprendizaje con categoría propia.
- Un formato futuro instalado durante la espera no recibe cambios; guardado fallido restaura exactamente la ayuda anterior.
- Registro de evidencia y preservación; cinco sesiones, escucha física y CI completo de PR siguen pendientes. Sin puntuación humana inventada ni publicación en main.

## L3 · Conservar y acceder · alpha.191

- Renombre, notas y borrado de favoritos con rollback si escribir falla; mantiene datos y ruta.
- Modo de llegada vuelve a su valor anterior si no se conserva.
- Finales dinámicos con foco aislado, Tab contenido y Escape que usa su cierre real. El fondo deja de recibir acciones/avisos durante el panel.
- 248 suites y recorridos de cuota/foco en teléfono/PC aprobados; regresiones de menús y recuperación comprobadas. Sin cambios de música generativa ni arte.

## L2 · Tu frase propia · alpha.190

- Captura de hasta ocho notas por ronda, registrada antes del cierre del objeto dorado; incluye el último pulso.
- No toma notas del historial general ni de la ronda anterior. Sin notas nuevas válidas, conserva la frase guardada.
- Premio y frase comparten guardado con rollback; reintento sin pago duplicado.
- 248 suites y cierre dorado real aprobados. Motor, voces, escalas y generación del mundo conservados.

## L1 · Aprender jugando · alpha.189

- Once reglas recuperables en la guía, tres pasos por lugar.
- Jardín muestra círculo, semilla y riego sin cambiar su estado ni producir audio. Ayuda breve por falta de progreso, retirada al cosechar y repetible a voluntad.
- Ayudas guardadas como vistas al presentarse realmente; rechazo, cola, fallo de escritura y partida sustituida no inventan aprendizaje.
- 247 suites, auditoría y ciclo real de flor/cosecha en320/390/1280 aprobados. Comprensión sin ayuda humana pendiente.

## K7 · Rumbo cercano y despedida · alpha.188

Rama `pulido/k7-rumbo-y-despedida`, desde K6; Jay conserva PR y merge.

- Flecha alrededor del cubo, nombre/metraje encima y sin área táctil. Sigue el leve adelanto de cámara; favorito/casa y anillo no dan dos rumbos simultáneos.
- Final5 cambia exclusivamente su arreglo local: voces existentes suaves, pulso contenido, notas de acorde en registro medio, sin bajo cuadrado/ácido/pad de sierra ni duplicación aguda. No cambia radio, MIDI guardado ni generación de mundos.
- Esperar, omitir y Explorar abren Mundo libre con rumbo a Jardín, sin salto. Festival intacto; cierre reintentable si guardar falla.
- Séptima auditoría integral: diez lentes simuladas, referencia7,7 con feedback de Jay. Menú aceptado; escucha del nuevo final y sesiones humanas pendientes. Plan L1–L4 propuesto, no ejecutado.
- Evidencia y límites en docs/panel/sesion-7/evidencia/verificacion.json.

## Entrega unificada · alpha.181

Jay autorizó integrar el cierre completo en `main`: cubo pequeño, auditorías y fases J1–J7, hasta `e6c0a3a6`. Se conserva exactamente ese código; esta integración solo actualiza el estado documental y verifica el conjunto en GitHub. La versión no cambia y la aceptación física/de publicación sigue separada.

## J7 · Comprobación y cierre técnico · alpha.181

- Posición y parámetros conservados al fallar una entrada; tarjeta anterior invalidada al sustituir la partida.
- Reintento real del objeto final conserva su referencia; cierre cuenta compases vivos con tempo variable.
- 245 suites, regresiones enfocadas, offline y 64 estados de UI aprobados; catálogo inicial y repeticiones documentados.
- Auditoría posterior por los mismos diez perfiles simulados; evidencia y pendientes separados de la aceptación humana.
- Guardia reproducible de 305 archivos protegidos, arte SVG y reglas originales.
- Registro conserva cada ID y sus pruebas; no declara producción o un 10 por simulación.
- Ramas encadenadas J1–J7; Jay mantiene PR y merge. Ver `docs/panel/sesion-5/informe.md`.

## J6 · Sincronía · alpha.180

- El acento visual sigue el instante real programado de la nota y su salida estimada, hasta 400 ms.
- Sin recorte artificial a 250 ms; cancelación al reiniciar o cambiar de escena y sin respuestas tardías en segundo plano.
- Se conserva exactamente la regla de programación sonora; contacto y movimiento reducido intactos.

## J5 · Continuidad creativa · alpha.179

- La tarjeta confirma cuándo se conserva tu frase para el final.
- Tu canción desde Lugares permite volver al final existente, con las notas actuales; Otra vez repite esa versión.
- El modelo separa capas ganadas e interpretaciones completadas. No predice abandono ni cuenta compras como música.
- Mismos generadores, instrumentos y arreglo del final; sin contenido adicional.

## J4 · Una meta compartida · alpha.178

- Guía y menú leen el capítulo o siguiente lugar real; experiencias extra claramente opcionales.
- Lugares y Refugio priorizan completar once; estrellas de maestría y chispas se distinguen.
- La guía permanece accesible durante el Viaje. No se alteran desbloqueos, economía ni posición.

## J3 · UI de producción · alpha.177

- Viaje queda para la campaña: el selector dice Vista y la pestaña de recursos, Chispas.
- Mapa distingue las regiones guardadas de los once Lugares.
- Escuchar y responder conserva la práctica musical; diagnóstico de versión en Ajustes.
- El resultado de ronda espera a que cierre otro panel. Diseño, controles e IDs conservados.

## J2 · Cierre musical · alpha.176

- Cierre con la capa ganada en el acorde vivo; fuera riser, crash, lead ajeno y corte de salida.
- Cancelación de notas del cierre al cambiar de escena; la radio no se automatiza.
- Cristales y segunda pasada del final respetan su marco armónico.
- 242 suites, cierre vivo y renders de victoria/canción/final aprobados. Escucha de Jay pendiente.

## J1 · Base fiable · alpha.175

- Premios de ronda durables y reintentos sin duplicación en los once lugares.
- Lectura segura de formatos futuros, conservados sin mutación.
- Pruebas de visitas, semillas y cuenta esperan sus límites reales de operación.
- Generación musical, mundos, aspecto y umbrales conservados. Evidencia en `docs/PULIDO_CIERRE.md`.

## Cuarta auditoría · sin otra versión

Rama `audit/panel-4-cierre`, dependiente de `fix/cubo-pequeno` (04ae8bdd). No cambia el juego respecto a esa revisión.

- Diez lentes simuladas, expediente e informe: media orientativa 7,7 (antes 7,5). No son opiniones reales de los autores.
- 16 capturas con gate normal, 60 estados de UI en cuatro tamaños, modelo de dos horas y 11 renders de cierre. Tacto real de navegador aprobado; no personas ni teléfono físico.
- Contratos reproducidos: notas fuera de escala en capa/final, premio anunciado con guardado fallido, lector de formato futuro y límite de sincronía. El CI del main base tiene tres grupos de navegador fallidos; no se certifica como verde.
- Registro de 14 hallazgos y plan J1–J7, pendiente de Jay. Música base y contenido se conservan; Supabase sigue en pausa.
- Herramientas `panel-capture.py` y `panel-measures.py` evitan confundir el modo de desarrollo con el aspecto normal. Evidencia en `docs/panel/sesion-4/`.

## Cubo pequeño · alpha.174

Rama `fix/cubo-pequeno`, desde `main` 676ac511. Petición de Jay: quitar la ampliación general de la I2.

- Tamaño natural, entre 6 y 12 px antes de pulsos y efectos temporales. Las caras equipadas conservan su mínimo existente de 10 px.
- No cambian alcance, colisiones, movimiento, música, economía, guardados ni posiciones.
- Verificado: 240 suites Node y `cube_face_smoke.py` (13 piezas, caras visibles, movimiento, hábitos, persistencia y tamaño real del cubo).
- El tamaño definitivo requiere la aceptación de Jay en su teléfono. No se afirma despliegue ni CI de esta rama.

## Documentación y panel · sin versión

Rama `claude/charming-darwin-dvbfc7`, sobre `main` (alpha.173). Solo documentación y una herramienta; el juego no cambia.

- **Panel creativo para repetirlo:** [docs/PANEL.md](docs/PANEL.md) explica quiénes son los diez perfiles simulados, los seis ejes, el historial de notas (6,4 → 7,2 → 7,5), los pasos de una sesión, el formato de los informes, lo que Jay ya decidió y la petición para la cuarta sesión. Los informes, expedientes y los treinta análisis están en `docs/panel/sesion-1…3/`.
- **`scripts/panel-capture.py`:** las 16 capturas de teléfono que juzga el panel.
- **El cubo pequeño:** Jay no quiere el cubo grande de la I2. Queda anotado en el panel, en [El mundo](docs/MUNDO.md) (regla 6), en [HANDOFF](HANDOFF.md) y en [AGENTS](AGENTS.md); el cambio de código está pendiente.
- **Repositorio más limpio:** README, índice, AGENTS y traspaso reescritos (`HANDOFF_CLAUDE.md` pasa a `HANDOFF.md`). Se borraron `docs/historial/` (85 documentos), `docs/FASES_2026.md`, `docs/SERVIDOR_Y_DUETOS.md`, `docs/handoff-validation.json`, cuatro capturas sueltas en la raíz y las entradas de este archivo anteriores a alpha.142. Todo sigue en Git en la revisión `5914ca9`.

## I6 · Menos ruido y modelo honesto · alpha.173

Rama `claude/i6-menos-ruido`, sobre `claude/i5-decisiones` (dependencia explícita).

- **Menú de seis entradas:** Tu cubo, Mundo, Lugares (nuevo en el menú), Refugio, Sonido y Ajustes. El resto (Mapa, Bitácora, Herramientas, Grabar set, otra semilla, Compartir, Mundo libre, Guía, Cuenta…) queda plegado en «Más», cerrado por defecto. Mismos ID.
- **Modelo honesto (`scripts/play-curve.mjs`):** la regla de 12 min cuenta solo lo que hace crecer la canción; las piezas compradas ya no la cumplen. Nuevo jugador sin sonido y un minuto de «riesgo de abandono».
- **Lo que mide:** el jugador del 75 % y el del 90 % cumplen (máximo 10,7 y 5,6 min sin crecer). **El del 60 % y el que juega sin sonido no:** sin ★★, su canción deja de crecer al ganar (minutos 38–40) durante unos 80 min. Queda abierto; es un modelo, no una medida con personas.
- Pruebas: `menu_v2_smoke.py` (seis entradas y «Más» cerrado), `play-curve.mjs` y las pruebas que pulsan botones del menú abren «Más» antes.

## I5 · Decisiones de Jay · alpha.172

Rama `claude/i5-decisiones`, sobre `claude/i4-final` (dependencia explícita). Jay aprobó las recomendaciones de la tercera sesión del panel.

- **★★ al 75 %** de pulsos a tiempo (antes 85 %) y **★★★ al 70 %** en la ronda Maestro (antes 80 %). En el modelo de dos horas, el jugador que acierta 75 de cada 100 llega a 28 ★ y su canción nunca pasa más de 11 min sin crecer (antes 85 min parada tras ganar). El del 60 % sigue sin ★★.
- **Festival = el Viaje entero:** `?festival=1` ya no termina tras el Lago; sigue por el Bosque, la Tormenta y el Vacío, y el último portal abre el final del Refugio con tu frase y «Otra persona». Créditos: «El Viaje».
- Pruebas: `places.mjs` (75/70 %), `play-curve.mjs` (sin muro al 75 %), `festival-color.mjs`, `journey-finale.mjs` y `festival_smoke.py` (el Lago lleva al Bosque; el Vacío al final).

## I4 · El final que respira · alpha.171

Rama `claude/i4-final`, sobre `claude/i3-instante` (dependencia explícita).

- **Tus notas de los 11 lugares:** el final de «Tu canción» toma las notas de la última ronda de cada lugar y, para los cinco del Viaje que no hayas rejugado, las de su capítulo (antes solo sonaban las de 6 lugares).
- **Con tu ritmo y en la escala del mundo:** cada nota suena en el paso del compás en que la tocaste (se guarda `S.lugares.noteSteps`, normalizado) y se lleva a la nota más cercana de la escala que suena (`snapToScale`).
- **El tema es un momento:** la capa de Faros ya no repite el tema durante el final; tras tus notas, un compás de silencio y el chelo toca el tema dos veces, la segunda una quinta arriba. Los créditos salen al final, no antes.
- **Al menos un minuto:** a tempo rápido, las capas siguen sonando tras el tema hasta llegar a 60 s.
- **No hecho:** el ritardando. El final suena sobre el secuenciador del mundo, que no puede frenar una sola canción.
- Pruebas: `song-tiers.mjs`, `places.mjs`, `song_stage_smoke.py` (créditos con más margen) y `song_stage_mix.py` (render: pico 0,389; «lleno» medido en la cola).

## I3 · Un solo instante · alpha.170

Rama `claude/i3-instante`, sobre `claude/i2-se-vea` (dependencia explícita).

- **Luz, tacto y sonido a la vez:** en un acierto, el brillo dorado del cubo, la vibración y un pequeño golpe del cubo se programan para el momento en que suena la nota (`landDelay`: entre 0 y 250 ms después del toque, contando la latencia de salida). Con movimiento reducido no hay golpe.
- **La Línea anticipa:** cada paso que cuenta crece y se enciende durante los cuatro pasos anteriores a que llegue el cursor (`approach`).
- **Calibración más segura:** solo mide sobre las negras (en el Jardín o la Cueva, que cuentan corcheas, podía tomar el paso equivocado) y nunca mientras el lugar canta su patrón.
- Pruebas: `journey-pulse.mjs` (`landDelay`, `approach`).

## I2 · Que se vea · alpha.169

Rama `claude/i2-se-vea`, sobre `claude/i1-coherencia` (dependencia explícita).

- **El cubo se lee en todas partes:** 1,6× su tamaño, entre 24 y 36 px, en el Camino (antes 6 px), el Mundo y los lugares; las caras caben siempre.
- **El color ganado se ve:** un bioma recuperado lava toda la pantalla con su color además de la luz alrededor del cubo. En el anillo, el 24 % de la pantalla tiene color (antes 5–9 %, medido en capturas de teléfono).
- **La columna dorada desde lejos:** el portal siguiente del camino se marca desde cualquier distancia; fuera de pantalla, la columna queda en el borde de su lado y sustituye a la flecha (`edgeColumn`).
- Pruebas: `cube_face_smoke.py` (24–36 px) y `places-ring.mjs` (columna en el borde).

## I1 · Coherencia · alpha.168

Rama `claude/i1-coherencia`, desde `main`. Tercera sesión del panel: restos que contradecían las decisiones de Jay.

- **El narrador solo en la tarjeta y la Bitácora:** los avisos de logro ya no llevan su frase.
- **Calma tras los créditos:** entre el final del Viaje y el primer portal no se anuncia ningún logro (quedan en la Bitácora) y desaparece el aviso «Tus ✦ cambian tu cubo»; Tu cubo queda marcado.
- **Fuera «Rompe…»:** el Camino, la ayuda y los avisos hablan de tocar a tiempo y de abrir el Mundo con diez cristales.
- **Sin cifras de umbral:** la tarjeta dice «Ritmo · X % a tiempo» y «Maestro», y el narrador ya no dice «Ochenta y cinco por ciento».
- Pruebas: `release-closure.mjs` (aviso sin narrador y calma tras los créditos) y `journey_finale_smoke.py` (marca sin aviso).

## H7 · Medir · alpha.167

Rama `claude/h7-medir`, sobre `claude/h6-escucha` (dependencia explícita).

- **Modelo de las dos primeras horas** (`scripts/play-curve.mjs`, prueba `tests/play-curve.mjs`): tres jugadores al 60, 75 y 90 % a tiempo, del Viaje a los 11 lugares en orden y luego ★★ y Maestro. Los tres ganan antes de 40 minutos y nunca pasan más de 7 sin una novedad (la regla del panel es 12).
- **Hallazgo:** con ★★ al 85 %, a quien acierta 60 o 75 de cada 100 la canción deja de crecer tras ganar (80–85 min sin una capa nueva). El modelo compara la variante ★★ 75 % / ★★★ 70 %. No se cambió ninguna regla: lo decide Jay (`docs/MUNDO.md`, «Las dos primeras horas»).
- `scripts/journey-curve.py` (nivel y densidad del Viaje en el navegador) sigue igual: dos horas no caben en un navegador; el modelo nuevo mide el progreso, no el audio.
- Pendientes: festival (recomendación: solo el Viaje), sesiones con Luca y escucha en un teléfono.

## H6 · Mundo que se escucha · alpha.166

Rama `claude/h6-escucha`, sobre `claude/h5-reglas` (dependencia explícita).

- **La chispa salvaje se encuentra con el oído:** canta una nota del acorde en cada pulso, desde su lado (izquierda o derecha) y más fuerte cuanto más cerca. La flecha en el borde de la pantalla solo aparece con el sonido apagado.
- **Los portales suenan desde su dirección:** el más cercano, en el «1», como antes, pero desde su lado. El siguiente del camino suena suave en el «3» desde mucho más lejos (se oye ya en el Refugio) y guía hasta él.
- La remezcla diaria no cambia.
- Pruebas: `spatial.mjs` (paneo y su cadena), `wild.mjs`, `places-ring.mjs`; `wild_smoke.py` comprueba que la chispa canta y `ring_smoke.py` que el siguiente portal se oye desde su lado. No se oyó en un teléfono ni con auriculares.

## H5 · Reglas claras · alpha.165

Rama `claude/h5-reglas`, sobre `claude/h4-cancion` (dependencia explícita).

- **Solo a tiempo da chispas, también en el Mundo libre:** fuera de tiempo el pulso suena y rompe, pero vale ×0 (antes ×1); a tiempo ×2 y con racha de 8, ×3. Sin sonido no hay compás que cumplir y todo cuenta ×1. La simulación de la economía da la tienda completa en 10,5 h a quien acierta seis de cada diez (antes 9,4) y en 7,2 h a quien acierta nueve (antes 7,0).
- **El Viaje sin rótulos:** los capítulos ya no escriben sus reglas ni avisan del objeto dorado; lo enseñan el gesto, la barra que late y el lugar que canta su patrón.
- **Cada lugar dice cada frase una vez**, la primera vez, y nunca más (guardado en `S.journey.lines`).
- **El narrador en su sitio:** durante una ronda no aparece ningún aviso de logro; la tarjeta de la ronda dice el logro ganado con la frase del narrador. Fuera de las rondas, como siempre. El logro «Treinta y tres» llega con las 33 ★, no con los 11 lugares.
- **Menú:** no se acortó. Ya está en grupos («Jugar» y el resto) y unas 30 pruebas pulsan sus botones; recortarlo merece su propia fase con Jay.
- Pruebas actualizadas: `spark-rules.mjs` y `spark_rhythm_smoke.py` (fuera de tiempo rompe pero no da), `spark-economy-sim.mjs`, y los juegos del Viaje (`journey-*.mjs`, `journey_stick_smoke.py`, `journey_chain_smoke.py`) comprueban que no hay rótulos.

## H4 · Tu canción · alpha.164

Rama `claude/h4-cancion`, sobre `claude/h3-camino` (dependencia explícita).

- **Tu canción es la música del juego:** ya no es un house aparte en La mayor a 120 BPM que callaba el Mundo. El Mundo sigue sonando en su tono y tempo, y el secuenciador añade encima, desde el siguiente «1», la capa de cada lugar ganado sobre el acorde que suena.
- **Las estrellas la hacen crecer:** ★ un fragmento (un compás de cada dos), ★★ la capa entera, ★★★ su variación (una octava arriba, más suave, y los golpes con eco). La capa de los Faros es el tema del cubo en el tono del lugar.
- **El final con los 11 (60–90 s según el tempo):** las capas entran una por compás; después, tus notas de cada lugar en orden (las 8 últimas de su mejor ronda, un compás por lugar); al final, el tema del cubo sobre todo. La versión maestra (33 ★) lo toca todo en su variación.
- **Trofeos:** tocar uno en el Refugio suena su capa dos compases, con sus estrellas, sobre la música.
- Las notas de cada lugar se guardan en `S.lugares.notes` (hasta 8, normalizadas).
- Pruebas: `tests/song-tiers.mjs` (niveles, plan del final, tus notas y el tema); `tests/song_stage_mix.py` (el final maestro renderizado sobre una música de prueba: pico 0,39, más lleno al entrar las capas); `song_stage_smoke.py` comprueba que el Mundo sigue sonando debajo. Límite: falta oírlo en un teléfono.

## H3 · El camino · alpha.163

Rama `claude/h3-camino`, sobre `claude/h2-que-se-sienta` (dependencia explícita).

- **En orden:** tras el Viaje, Jardín → Dunas → Cristales → Faros → Ruinas → Cueva; cada uno se abre al completar el anterior. Ya no hacen falta ★★ para avanzar: un niño que acierta el 75 % llega al final.
- **Ganar = los 11 completos.** Suena el final verdadero («Los 11 lugares»). Con las 33 ★ vuelve, una vez, como versión maestra («Las 33 ★»).
- **Luz al siguiente:** una columna dorada sobre el portal del siguiente lugar del camino; la flecha del borde apunta a él.
- **«Siguiente · lugar»** en la tarjeta de la ronda: lleva a su portal y empieza su ronda.
- **Modo Libre:** un lugar completo ofrece Jugar, Libre y Maestro (con ★★). Libre no tiene barra, estrellas ni chispas; al cerrar su objeto dorado vuelve al portal con su música.
- Textos: un portal cerrado dice «X se abre al completar Y»; Lugares dice «Siguiente: X»; los créditos del Viaje, «Once lugares te esperan».
- **Guardados:** versión 2 de `S.lugares`. Un guardado de antes conserva abiertos los lugares que sus estrellas abrían (`kept`). Nada se borra.
- Pruebas actualizadas a las reglas nuevas: `places.mjs`, `places-ring.mjs`, `refugio-lugares.mjs`, `journey-finale.mjs`, `ring_smoke.py` (Libre sin barra), `refugio_lugares_smoke.py`, `song_stage_smoke.py` (final con 11 y versión maestra con 33), `places_smoke.py` («Siguiente · Jardín»).

## H2 · Que se sienta · alpha.162

Rama `claude/h2-que-se-sienta`, sobre `claude/h1-que-se-vea` (dependencia explícita).

- **Calibración sin menú:** los primeros 12 pulsos cerca de un tiempo miden cuánto tarde oyen y tocan este jugador, este teléfono y estos auriculares. Si coinciden (la mitad central dentro de 60 ms), ese retraso se guarda y cuenta en todo «a tiempo». Quien toca disperso no queda «calibrado»: se sigue midiendo. En Ajustes, «Ajustar el tiempo» lo mueve de 10 en 10 ms o lo mide otra vez.
- **Una sola guía:** los pasos que cuenta el lugar se levantan en la Línea (el «1» en dorado cuando cuenta). Se quitan los puntos bajo el cubo y los del Vacío.
- **El lugar canta su patrón antes:** al empezar una ronda o un capítulo con ritmo, durante dos compases desde el siguiente «1» suenan un golpe y una nota en cada paso que cuenta, y la Línea brilla con ellos. Se retiran las frases «Aquí se toca en el «y»…».
- **El cubo cambia con la racha (Vibri):** cada 4 aciertos seguidos gana una forma (esquinas, rombo, doble marco dorado que gira); un fallo quita una, nunca todas.
- **Ruinas, arreglo:** los pulsos se agrupan por compás con el reloj de audio. Antes se redondeaba una hora del reloj de la página y, si el compás empezaba cerca del borde del redondeo, tres pasos del mismo compás contaban en dos compases distintos y no ponían piedra.
- Pruebas: `tests/rhythm-calibration.mjs` (un jugador simulado 150 ms tarde pasa de fuera de tiempo a tiempo); `tests/journey-rhythm.mjs` (formas y canto de dos compases). Las pruebas de navegador que pulsan en un paso concreto aceptan el primer fotograma tras el paso (antes podían saltarlo).

## H1 · Que se vea · alpha.161

Rama `claude/h1-que-se-vea`, desde `main`. Primera fase del plan integrado que Jay aprobó tras la segunda sesión del panel ([El mundo](docs/MUNDO.md)).

- **El acierto se ve siempre:** el cubo brilla en dorado en cada pulso a tiempo, también en teléfonos que vibran (antes solo sin vibración). La onda de un pulso a tiempo es dorada y algo más gruesa.
- **El cubo se ve en el teléfono:** en el Mundo se dibuja 1,6 veces su tamaño, entre 16 y 30 px (antes 6–22). Solo cambia el dibujo: alcances, choques y el crecimiento por nivel siguen igual.
- **El oro sigue dorado:** el gris de un lugar aún sin color ya no filtra toda la pantalla; se pinta solo sobre el suelo, antes de los juegos, el cubo y los portales.
- **Color como tono:** un lugar con su color recuperado se tiñe más de él (luz del 18–30 % en vez de 5–12 %).
- **Cerrar un lugar recupera su color** para siempre.
- **Lugares:** un lugar con ★ ya no dice «Sin visitar»; la remezcla deja de ser un segundo botón dorado.
- **Ruinas, arreglo** (visto en la CI de esta fase): los pulsos se agrupan por compás con el reloj de audio; redondear una hora del reloj de la página podía partir un compás en dos y tres pasos no ponían piedra. Las pruebas que pulsan en un paso concreto aceptan el primer fotograma tras el paso.
- `cube_face_smoke` mide el cubo nuevo: 16 px sin cara, unos 27 con ella.
- Pruebas: `world-sheet.mjs` y `world_sheet_smoke.py` comprueban el gris en el lienzo y la pantalla sin filtro. `?anillo=1` y `?lugar=` siembran los colores de los cinco capítulos, como una partida real tras el Viaje.

## F18 · Mundo salvaje · alpha.160

Rama `claude/f18-salvaje`, sobre `claude/f17-cueva` (dependencia explícita).

- **Chispa salvaje:** al explorar el Mundo libre, entre uno y dos minutos después de la anterior (y tras unos 1 200 px andados), aparece una chispa dorada por delante del cubo. Cinco pulsos a tiempo a su lado la atrapan: +15 ✦. Cada pulso la hace saltar un poco; a los 30 s se va sin castigo. Si sale de la pantalla, una flecha dorada la señala.
- **Remezcla diaria:** cada día un lugar abierto se juega con el ritmo de otro (por ejemplo, la Llanura en «1 · 3 · y»). Está en la hoja Lugares del Refugio. Paga 30 ✦ más al cerrarla y 20 más si superas el mejor porcentaje a tiempo del día. No hay Maestro de la remezcla. Jardín, Dunas, Vacío y Cueva no se remezclan: su juego depende de su propio ritmo.
- Pruebas: `tests/wild.mjs`, `tests/wild_smoke.py` (teléfono y escritorio). Límite: el ritmo de aparición se fijó por diseño, no se midió con personas.

## F17 · Cueva · alpha.159

Rama `claude/f17-cueva`, sobre `claude/f16-ruinas` (dependencia explícita).

- **Eco:** la cueva canta un patrón durante un compás y tú lo repites en el siguiente. Bajo el cubo, ocho casillas son las corcheas del compás: mientras canta se encienden en rojo sus pasos; mientras respondes, esperan los tuyos y se vuelven doradas.
- Todos los pasos a tiempo y ninguno de más es un eco: vale 6 más 2 por paso y el siguiente patrón tiene un paso más (de 2 a 5). Una respuesta con errores suma 2 por paso acertado y acorta el siguiente. El patrón siempre empieza en el «1».
- El secuenciador de la música canta la llamada, así que siempre cae en su compás.
- **Final:** con la barra llena cae una gota dorada; un pulso a tiempo la atrapa. Su trofeo son ondas de eco. Se abre con 24 ★; `?lugar=cueva`.
- **Con la Cueva, los once lugares tienen juego: ya se pueden ganar las 33 ★.**
- Meta 250. Media de 30 jugadores simulados: 2:27 con el 75 % a tiempo, 1:34 con el 90 % (los patrones largos valen más), 3:08 en Maestro.
- Pruebas: `tests/journey-echo.mjs`, `tests/echo_smoke.py` (teléfono y escritorio). Las pruebas de navegador de Faros, Ruinas y ritmos pulsan teniendo en cuenta la latencia de salida.

## F16 · Ruinas · alpha.158

Rama `claude/f16-ruinas`, sobre `claude/f15-faros` (dependencia explícita).

- **Reconstruye:** ocho columnas rotas en anillo; algunas conservan una o dos piedras. Junto a una columna, toca el patrón de las Ruinas, «1 · 2y · 3 · 4». Tres de sus cuatro pasos en un mismo compás ponen una piedra (los cuatro en Maestro). Bajo la columna, tres marcas cuentan los pasos de este compás.
- **Arcos:** una columna tiene siete piedras. Dos columnas enteras vecinas levantan un arco dorado, que vale más.
- **Final:** con la barra llena llega una piedra dorada; un pulso a tiempo la coloca. Su trofeo es un arco. Se abre con 20 ★; `?lugar=ruinas`.
- Meta 265 de 284 posibles; en Maestro, toda la ruina. Simulación (modelo, jugador que no se distrae): 2:13 con el 75 % a tiempo, 1:51 con el 90 %, 4:15 en Maestro. Una persona tardará algo más.
- Pruebas: `tests/journey-rebuild.mjs`, `tests/rebuild_smoke.py` (teléfono y escritorio).

## F15 · Faros · alpha.157

Rama `claude/f15-faros`, sobre `claude/f14-ritmos` (dependencia explícita).

- **Guía:** el cubo es un faro. Seis barcos esperan perdidos en la oscuridad alrededor del puerto, donde empieza la ronda. Un pulso a tiempo cerca de un barco lo enciende: te sigue dos compases, y cada pulso a tiempo cerca lo mantiene encendido. Llévalo encendido al puerto y atraca. Otro barco ocupa su lugar.
- **Convoy:** un barco vale 4; cada otro barco encendido que venga con él suma 2 (hasta 10). Traer varios a la vez rinde más.
- **Ritmo:** destellos en «1 · 3 · y». El haz gira con el compás desde el cubo y destella al tocar.
- Una flecha dorada en el borde señala el puerto mientras llevas barcos; si no llevas, una blanca señala el barco más cercano.
- **Final:** con la barra llena llega un barco dorado; un pulso a tiempo lo enciende. Su trofeo es un faro. Se abre con 16 ★; `?lugar=faros`.
- Meta 260. Simulación (modelo): 2:28 con el 75 % a tiempo, 2:23 con el 90 %, 3:30 en Maestro.
- Pruebas: `tests/journey-guide.mjs`, `tests/guide_smoke.py` (teléfono y escritorio).

## F14 · Ritmos · alpha.156

Rama `claude/f14-ritmos`, sobre `claude/f13-victoria-musica` (dependencia explícita).

- **Cada lugar con su ritmo** (tabla aprobada en [El mundo](docs/MUNDO.md)): el Lago como lugar y las Dunas en el «y»; la Tormenta «1 · 2 · y» (también en el Viaje); los Cristales «1 · y · 2»; el Jardín siembra y cosecha a tiempo y riega en el «y». Llanura y Bosque siguen a tiempo; el Vacío, en el «1».
- **Solo cuenta el paso del ritmo:** un pulso en otro paso, aunque caiga en un tiempo, no hace nada. La marca de la Línea se pone en el paso que respondiste.
- **Guía de puntos bajo el cubo:** ocho corcheas; las que cuentan se ven, el «1» en dorado, la del momento brilla y un aro marca el último acierto. La primera vez que aparece un ritmo nuevo, una línea lo dice.
- Dos corcheas seguidas están a 250 ms a 120 BPM y el toque descartaba pulsos a menos de 240 ms; con un ritmo de corcheas ese límite baja a dos tercios de una corchea.
- La ola de las Dunas pasa en el «y».
- Pruebas: `tests/journey-rhythm.mjs`; `tests/rhythm_smoke.py` (Lago, Cristales y Tormenta del Viaje: sus pasos cuentan, los demás no); `garden_smoke` siembra en el tiempo y riega en el «y»; `surf_smoke` comprueba la ola en el «y»; los pulsos de prueba de 19 pruebas siguen el ritmo del lugar. Límite: la simulación del Jardín da el mismo tiempo (2:24); los demás tiempos no se volvieron a medir.

## F13 · Victoria con tu música · alpha.155

Rama `claude/f13-victoria-musica`, sobre `claude/f12-primer-minuto` (dependencia explícita).

- **El cierre sale de la música que suena:** durante un compás el filtro de la música se cierra bajo un ruido que sube; el último medio tiempo es silencio de verdad (también el eco); en el «1» vuelve la misma música, en su tono y tempo, con algo más encima.
- **Lo que se suma:** la capa del lugar en Tu canción (bombo en la Llanura, bajo dub en el Lago, arpegio en el Jardín…) y el tema del cubo con el timbre del lugar. La capa la toca el secuenciador semicorchea a semicorchea, sobre el acorde que suena en el mundo en cada compás; por eso no puede desafinar.
- Los drops de género propio (house, dub, disco…) se retiran: Jay los oyó ajenos al resto de la música.
- Pruebas: `tests/journey-victory.mjs` (la capa sigue al acorde del mundo); `tests/victory_mix.py` renderiza los once cierres sobre una música de prueba (silencio de −109 dB, vuelta más llena, pico 0,57); `tests/victory_live_smoke.py` en el juego real (32 semicorcheas, salida y filtro enteros después, la música sigue). Límite: falta la escucha de Jay.

## F12 · Primer minuto · alpha.154

Rama `claude/f12-primer-minuto`, desde `main`.

- **La barra late antes del primer pulso:** en el Camino y en un capítulo del Viaje, si pasan cinco segundos sin cuadros abiertos y sin ningún pulso, la barra de arriba se ilumina suave en cada tiempo de la música (a 120 BPM antes de que suene, como en un teléfono antes del primer toque). El primer pulso la apaga. Se suma al dedo fantasma de la pista.
- **Llanura más larga:** meta 150 (antes 60). Jay la terminó en menos de un minuto ya sabiendo jugar; con esta meta debería durar unos 2:30. Los demás capítulos se miden en su prueba antes de tocarlos.
- **Plan nuevo F12–F19** en [El mundo](docs/MUNDO.md): victoria con la música que suena (F13), ritmos distintos por lugar (F14, con el reparto aprobado), Faros, Ruinas y Cueva (F15–F17), Mundo salvaje (F18) y cierre con personas (F19).
- CI: las pruebas de navegador pasan de 4 a 6 grupos; con las pruebas de los lugares, dos grupos superaban los 30 minutos y se cancelaban.
- Pruebas: `tests/bar-beat-hint.mjs`, `tests/bar_beat_hint_smoke.py` (teléfono y escritorio: no bajo la bienvenida, sí cinco segundos después, se apaga con el primer pulso); `journey_stick_smoke` usa la meta nueva. Límite: la duración de la Llanura es una estimación a partir del tiempo de Jay.

## F11 · Cristales · alpha.153

Rama `claude/f11-cristales`, sobre `claude/f10-dunas` (dependencia explícita).

- **Resuena:** nueve cristales alrededor de donde empieza la ronda, tres de cada nota (triángulo, rombo y hexágono). Un pulso a tiempo cerca hace sonar los cristales al alcance; cada uno sigue sonando unos 16 tiempos mientras su arco dorado se apaga. Fuera de tiempo no suena nada.
- **Acorde:** cuando suenan a la vez las tres notas distintas, forman un acorde: vale mucho más y los tres callan para empezar el siguiente. Tres marcas bajo el cubo muestran qué notas suenan.
- **Final:** con la barra llena llega un cristal dorado; un pulso a tiempo lo hace cantar. Su drop es trance y su trofeo, un hexágono. Se abre con 12 ★; `?lugar=cristales`.
- **Ritmo:** meta 260. Media de 100 rondas simuladas: 2:27 con el 70 % a tiempo, 2:03 con el 90 %, 3:29 en Maestro (sonido de 15 tiempos y barra ×1,5). Es un modelo.
- El fondo se oscurece un poco más que en otros lugares: la malla de triángulos del bioma competía con los cristales.
- Pruebas: `tests/journey-resonance.mjs`, `tests/resonance_smoke.py` (teléfono y escritorio), `victory_mix.py` con ocho drops.

## F10 · Dunas · alpha.152

Rama `claude/f10-dunas`, sobre `claude/f9-jardin` (dependencia explícita).

- **Surfea:** olas de arena cruzan las dunas, una por compás. Un círculo marca dónde pasará la cresta de la próxima y un arco alrededor se cierra hasta su tiempo. Dentro del círculo, un pulso a tiempo justo cuando pasa la cresta la surfea: la ola te empuja y la barra se llena. Dentro del círculo pero en otro tiempo, o fuera de tiempo, no pasa nada.
- **Racha:** 2, 3 y 4 por ola seguida (marcas doradas bajo el cubo); dejar pasar una ola empieza de nuevo. En Maestro el círculo es más pequeño y la barra ×1,5.
- **Final:** con la barra llena llega una ola dorada; surfearla cierra la ronda. Su drop es afro house y su trofeo, una ola.
- **Se abre con 8 ★.** `?lugar=dunas` da a su guardado de prueba las estrellas que pide.
- Las olas siguen la rejilla de tiempos de la música aunque cambie de tempo (al llegar a las Dunas o en Maestro).
- **Ritmo:** meta 150. Media de 200 rondas simuladas (una ola cada dos segundos): 2:33 surfeando el 65 %, 1:41 con el 85 %, 3:48 en Maestro. Es un modelo.
- Pruebas: `tests/journey-surf.mjs`, `tests/surf_smoke.py` (teléfono y escritorio), `victory_mix.py` con siete drops.

## F9 · Jardín · alpha.151

Rama `claude/f9-jardin`, sobre `claude/f8-logros` (dependencia explícita).

- **Siembra:** ocho parcelas alrededor de donde empieza la ronda, cerca y lejos alternadas. Un pulso a tiempo sobre una parcela vacía siembra; cada pulso a tiempo hace crecer lo que hay al alcance (semilla, brote, capullo, flor); sobre una flor, la recoge y la parcela queda libre. Fuera de tiempo no pasa nada.
- **Cuidar:** una planta sin atender ocho compases se marchita un paso. Un arco dorado alrededor de cada planta muestra el tiempo que le queda; parpadea al final. En Maestro, seis compases y barra ×1,5.
- **Sonido:** cada flor añade la nota siguiente de un arpegio sobre el acorde (la capa del Jardín en tu canción); su cierre suena a garage.
- **Final:** con la barra llena llega un árbol dorado; un pulso a tiempo lo hace florecer y cierra la ronda con estrellas, chispas y su tarjeta. Su trofeo es una flor.
- **Abre con 5 ★:** el Viaje terminado ya lo abre; su portal está en el anillo y `?lugar=jardin` lo prueba.
- **Arreglo para todas las rondas (F4):** con «Todo a la vista», la barra de arriba no se veía ni mostraba el avance de la ronda, y los efectos sobre el cubo no se dibujaban. Ahora la barra sigue la ronda en los dos modos.
- **Ritmo:** meta 360. Un jugador simulado (150 px/s, un pulso por segundo, un segundo para situarse en cada parcela) tarda 2:24 con el 75 % a tiempo, 2:08 con el 90 % y 3:31 en Maestro; una persona tarda algo más. Es un modelo, no una medida con personas.
- Pruebas: `tests/journey-garden.mjs` (lógica y ritmo), `tests/garden_smoke.py` (teléfono y escritorio, los dos modos de pantalla), `victory_mix.py` con seis drops; `places`, `places-ring`, `refugio-lugares` y sus pruebas de navegador ahora usan las Dunas como lugar cerrado.

## F8 · Logros del narrador · alpha.150

Rama `claude/f8-logros`, sobre `claude/f7-cancion` (dependencia explícita).

- **El narrador:** los logros hablan con voz burlona, al estilo de *Dungeon Crawler Carl*, para todas las edades. Al ganar uno, el aviso muestra el título y debajo su frase; en la Bitácora, la frase va en dorado bajo cada logro ganado.
- **Nada ganado se pierde:** 40 logros que ya existían conservan su id, su título y su fecha; solo cambia su voz (Día 1, El Mundo, Cajas, Cometa, Freeze, Contratiempo, Atlas, Rachas, la Luna de oro…).
- **23 logros nuevos** para los lugares, las estrellas, el anillo y tu canción: Una estrella, Ritmo, Maestro, Cinco Maestros, Casi ritmo, Con prisa, Sin prisa, Inquilino, Contra ti, Turismo intensivo, 10/20/33 estrellas, Puerta cerrada, Conocido del anillo, A medias, Caminar es de otros, Presumido, Fan número uno y Prólogo; y tres secretos (Sospechoso, Valiente, Madrugada).
- Se ganan solos al cerrar una ronda, al tocar un portal cerrado, al dejar una ronda, al viajar rápido, al tocar un trofeo, al escuchar tu canción y al terminar el Viaje. Varios a la vez se anuncian juntos («4 logros nuevos»), como antes.
- Pruebas: `tests/narrator.mjs` (cada frase pertenece a un logro que existe, ningún id nuevo reutiliza uno viejo, frases de 20 palabras o menos, lo que gana cada ronda); `achievements_v2_smoke` y `universe_mischief_smoke` cuentan 376 + 23 logros. Límite: los textos siguen el tono de la muestra que vio Jay; él no los ha aprobado uno por uno y cualquier frase se cambia en `narrator.js` sin tocar nada más.

## F7 · Tu canción · alpha.149

Rama `claude/f7-cancion`, sobre `claude/f6-refugio` (dependencia explícita).

- **Una canción, once capas:** ocho compases de house a 120 BPM en La mayor (La, Mi, Fa♯m, Re). Cada lugar da una capa: Llanura bombo, Lago bajo dub, Bosque palmas y platillos, Tormenta ácido, Vacío colchón, Jardín arpegio, Dunas percusión, Cristales campanas, Faros la melodía del cubo, Ruinas acordes y Cueva eco.
- **Final del Viaje nuevo:** cada capítulo ocupa dos compases; su capa entra bajo tus notas a tiempo, con tu ritmo, y su anillo se enciende con su nombre y su verbo. Después, el tema dos veces sobre las cinco capas, y aparecen apagados los seis lugares por venir. Termina en «Tu mundo se abrió · 11 lugares · 33 ★», con los once anillos y el botón «Explorar». Ya no hay violonchelo.
- **En el Refugio:** tocar un trofeo hace sonar su capa dos compases. En Lugares, «Tu canción» la toca con las capas ganadas: once anillos, los tuyos encendidos y latiendo, los que faltan punteados («Tu canción · 5 de 11»). La música del Mundo espera mientras suena.
- **Ganar el juego:** con las 33 ★, al cerrar la tarjeta de la ronda, entran las once capas una por compás y termina en «Las 33 ★ · Tu canción está completa». Solo una vez; luego se escucha desde Lugares.
- El festival conserva su final con «Otra persona».
- Pruebas: `tests/song_mix.py` (render sin conexión: cada capa se oye, las once juntas sin saturar, pico 0,50), `tests/song_stage_smoke.py`, y `journey-finale.mjs`, `journey_finale_smoke.py` y `festival_smoke.py` actualizadas. Límite: no se escuchó en un teléfono; las capas de los seis lugares nuevos suenan desde ya, aunque sus juegos lleguen en F9–F14.

## F6 · El Refugio como centro · alpha.148

Rama `claude/f6-refugio`, sobre `claude/f5-anillo` (dependencia explícita).

- **Muro de estrellas:** en la Sala, «LUGARES · ★ N / 33»; en la barra de la casa, el botón «★ N / 33».
- **Sala de trofeos:** once zócalos; cada lugar con su ★ pone ahí el objeto dorado de su juego (pegar, cadena, lazo, espiral, estrella), más brillante con cada estrella. Al tocarlo dice su lugar, sus estrellas y su % a tiempo, y suena su nota en tres pasos (su capa de la canción llega en F7).
- **Mesa de lugares:** tocar el muro o «★ N / 33» abre Lugares: los once con sus estrellas, su % o lo que piden, «Sin visitar», la siguiente meta («Jardín se abre con 5 ★. Faltan 2.») e «Ir» a los ya visitados.
- **Puerta al anillo:** «Salir al anillo» e «Ir» dejan el Refugio; «Ir» te deja junto al portal.
- En una visita a otro Refugio no se muestran tus estrellas.
- Pruebas: `tests/refugio-lugares.mjs` y `tests/refugio_lugares_smoke.py` (teléfono y escritorio); las seis pruebas de navegador de la casa siguen pasando. Límites: en una visita aún no se ven las estrellas del dueño (el código de casa no las lleva); la capa musical de cada trofeo llega en F7.

## F5 · El anillo · alpha.147

Rama `claude/f5-anillo`, sobre `claude/f4-estrellas` (dependencia explícita).

- **Portales:** los 11 lugares forman un anillo dorado alrededor del Refugio, a 6000 px de su puerta (unos 32 s a pie). Si un portal cae en el mar, se corre por su radio hasta tierra. El anillo sigue al Refugio cuando se mueve; antes del primer Refugio queda donde se abrió el Mundo libre.
- **Entrar:** caminar hacia un portal abierto empieza su ronda. Con ★★, primero «Jugar» o «Maestro». Uno cerrado avisa cuántas ★ pide y cuántas tienes.
- **Sin palabras en la pantalla tranquila:** las estrellas se dibujan; un cerrado muestra un arco dorado con las ★ que llevas de las que pide. Con «Todo a la vista» también se escriben el nombre y lo que pide.
- **Sonido:** en cada «1» del compás suena la nota del portal más cercano (una por lugar), más fuerte al acercarse; los cerrados, más bajo.
- **Flecha:** en el borde de la pantalla, hacia el lugar abierto más cercano que aún no has visitado o que no tiene su ★.
- **Volver:** «Salir» en la tarjeta, «Dejar la ronda» en el menú (solo durante una ronda) y una recarga a mitad de ronda te dejan junto al portal.
- **Mapa:** los portales con sus estrellas, y «Ir a» con los lugares ya visitados: viaje rápido gratis junto a su portal.
- **`?anillo=1`:** el Mundo libre tras el Viaje, sin ronda, con el guardado de prueba de `?lugar=`.
- Pruebas: `tests/places-ring.mjs` y `tests/ring_smoke.py` (teléfono y escritorio). Límites: los portales aún no están en su bioma (la ronda sí lleva a él); la mesa del mapa del Refugio llega en F6; no se midió el paseo con personas.

## F4 · Lugares y estrellas · alpha.146

Rama `claude/f4-estrellas`, sobre `claude/f3-chispas` (dependencia explícita).

- **Rondas:** tras el Viaje, cada capítulo es un lugar que se puede volver a jugar. Una ronda es su juego con la barra vacía, en su bioma, y termina con su objeto dorado y su drop.
- **Estrellas:** ★ al completar; ★★ con el 85 % de pulsos a tiempo; ★★★ en la versión Maestro (se abre con ★★: tempo +10 %, barra ×1,5 y margen a tiempo más estrecho) con el 80 %. Sin sonido, solo ★. Las estrellas no dan chispas.
- **Del Viaje:** al cumplir un capítulo se gana su ★, y su ★★ si se jugó con el 85 % a tiempo. Quien ya lo había cumplido recibe su ★.
- **Chispas:** cada ronda paga 60–120 ✦ según el % a tiempo (Maestro el doble; desde la cuarta del día en ese lugar, la mitad).
- **Tarjeta de resultado:** las tres estrellas (las nuevas brillan), qué pide cada una con tu %, el tiempo, las chispas, «récord», y los botones «Otra vez», «Maestro» y «Salir».
- El estado del capítulo del Viaje no se pierde: se guarda aparte durante la ronda y vuelve al terminar. Una ronda a medias se descarta al recargar.
- Las estrellas viven en `S.lugares`: `S.places` ya guarda las regiones visitadas del mapa y no se toca.
- **`?lugar=lago`** (`&maestro=1`) prueba una ronda con su propio guardado. Los portales para entrar llegan en F5.
- Pruebas: `tests/places.mjs` y `tests/places_smoke.py` (incluye recarga). Límite: no se probó la sincronización en la nube de `S.lugares`.

## F3 · Economía de chispas · alpha.145

Rama `claude/f3-chispas`, sobre `claude/f2-victoria` (dependencia explícita). Las chispas sirven para comprar; las estrellas, para avanzar y ganar.

- **Tocar a tiempo vale más en el Mundo libre:** lo que rompe un pulso a tiempo da el doble de chispas, y desde el octavo pulso a tiempo seguido, el triple. El «+n ✦» lo dice en dorado: «×2», «×3». La racha se rompe fuera de tiempo o tras 4 s sin tocar. Sin sonido no hay multiplicador, porque sin beat todo pulso cuenta como a tiempo.
- **Rondas de los lugares** (se usarán en F4): 60 ✦ + 6 por cada 10 % a tiempo (60–120), Maestro el doble; desde la cuarta ronda del día en un mismo lugar, la mitad.
- **Simulación** (`scripts/spark-economy.mjs`): la minería medida a ×2 y ×3 es exactamente el doble y el triple; con la mitad del tiempo en lugares, la tienda completa (17 030 ✦, sin cambiar precios) lleva unas 9,4 horas tocando a tiempo seis de cada diez pulsos y unas 7 tocando nueve de cada diez. Antes, de 20 a 28 horas. Es un modelo, no una medida con personas.
- Pruebas: `tests/spark-rules.mjs`, `tests/spark-economy-sim.mjs` y `tests/spark_rhythm_smoke.py`.

## F2 · Sonido de victoria · alpha.144

Rama `claude/f2-victoria`, sobre `claude/f1-ritmo` (dependencia explícita). A Jay el sonido al completar un nivel le pareció horrible, triste y nada electrónico: era el tema en violonchelo.

- **El drop:** al cerrar un capítulo, desde el siguiente «1»: un compás de ruido que sube mientras la música se filtra hacia abajo, medio tiempo de silencio y dos compases con el beat completo y el tema del cubo en un sintetizador. El filtro de la música se abre de golpe en el drop.
- **Un estilo por capítulo:** Llanura house (bombo a negras, palmas, acordes a contratiempo), Lago dub (medio tiempo, ecos), Bosque disco (bajo en octavas, charles en semicorcheas), Tormenta techno (bombo duro, bajo grave, línea ácida) y Vacío ambient (sin percusión: un pad y el tema en campanas con eco).
- El portal se abre al terminar el drop. Sin sonido no suena nada y el portal espera lo de siempre.
- **Mezcla:** `tests/victory_mix.py` renderiza los cinco drops: sube, hay silencio antes del drop, el drop es lo más fuerte y el pico queda en 0,57 (margen sobre la música). Los sonidos de los cinco juegos se revisaron por nivel frente a los del juego; no se renderizaron aparte.
- Pruebas: `tests/journey-victory.mjs`, `tests/victory_mix.py`; la prueba de la Llanura comprueba que el filtro de la música se vuelve a abrir.

## F1 · Ritmo de los niveles · alpha.143

Rama `claude/f1-ritmo`, sobre `claude/f0-viaje-juegos` (dependencia explícita). Jay tardó 8 min en la Llanura, menos de 1 en el Lago y el Bosque, 3 en la Tormenta, y el Vacío le pareció demasiado rápido. Meta: 2:30–3:00 por capítulo.

- **Llanura:** meta 60 (antes 120); más cosas cerca (más de 8 celdas de 10) y más piedras y cometas.
- **Lago:** meta 340 (antes 100); los racimos, más separados.
- **Bosque:** meta 240 (antes 100); cada luciérnaga vale como mucho 3.
- **Tormenta:** meta 250 (antes 100); el primer círculo aparece junto al cubo, para aprender la regla de inmediato.
- **Vacío:** solo se suelta en el «1» del compás; cuatro puntos bajo el cubo cuentan el compás y el primero, dorado, es el «1». Cada estrella pide su cielo, a 100 px de las demás: hay que moverse para dibujar la constelación. Sin sonido vale cualquier pulso.
- **Medida:** un jugador simulado (150 px/s, 80 % de aciertos), calibrado con los tiempos de Jay, estima 2:20–2:55 por capítulo. Es una estimación: la confirman la prueba de Jay y las notas de `?prueba=1`.
- Los juegos reciben el paso del compás de cada pulso.

## F0 · El Viaje por juegos en `main` · alpha.142

Rama `claude/f0-viaje-juegos`, desde `main` (alpha.141, con los cinco capítulos integrados en las PR #315–#319). Primera fase del plan aprobado en [El mundo](docs/MUNDO.md).

- **[El mundo](docs/MUNDO.md):** el plan completo, F0–F16, con chispas para comprar y estrellas para avanzar y ganar.
- **`?capitulo=`** (`llanura`, `lago`, `bosque`, `tormenta`, `vacio`): abre el Viaje directamente en ese capítulo, sin cuenta y con su propio guardado; cada carga empieza el capítulo de nuevo.
- **El festival** juega el Lago nuevo: termina al abrir la flor dorada.
- Cada juego vuelve a leer su estado si el guardado lo reemplaza.
- **Bosque:** la estela dura 8 s (antes 5): una vuelta a paso normal tarda unos 4,6 s y en un teléfono lento no llegaba a cerrarse.
- El saludo de regreso ya no reabre la bienvenida del Camino si ya se dio por vista (`?capitulo=` la dejaba encima del capítulo).
- Pruebas: `tests/chapter_test_smoke.py`; `tests/festival_smoke.py` usa el Lago nuevo.

## Antes de alpha.142

Las entradas anteriores (alpha.58–alpha.141: universo, superbiomas, fases 0–7, Viaje por juegos) se quitaron de este archivo el 24 de octubre de 2026. Siguen en Git: `git show 5914ca9:CAMBIOS.md`.

## Integración confirmada en main

[PR #353](https://github.com/Jaywrkr/WHITEDOT/pull/353) · [CI de integración](https://github.com/Jaywrkr/WHITEDOT/actions/runs/40164328278) aprobado: lógica, seis grupos de navegador, tres de audio y agregador. Se conserva alpha.181 y el mismo runtime; aceptación humana y tiendas permanecen pendientes.

## Sexta auditoría · experiencia real de Jay

Rama `audit/panel-6-experiencia-real`, desde main `3c5fd7b6`, misma versión alpha.181. Revisión documental, sin cambios al juego. Se verifica la falta de acceso inicial gratuito al siguiente lugar, salto de paisaje ajeno al anillo, rumbo sin Y, centro móvil del anillo y ruta musical final5 que conservaba su arreglo anterior. Aviso X1 recortado reproducido con geometría controlada.

[Sexta sesión](docs/panel/sesion-6/informe.md): media provisional7,2 frente a8,1 por nueva evidencia humana, no por una regresión de código nueva. [K1–K5](docs/panel/sesion-6/plan.md) propuestas; no implementadas. U03/U04 reabiertos; A04/U05–U08 nuevos; V01 con rechazo concreto de Jay. Pruebas y límites en el expediente; generadores, arte y progreso intactos.

## alpha.182 · K1 · guía a pie al anillo

Desde la auditoría `7476aa7a`, rama `pulido/k1-guia-anillo`. Seguir hacia el siguiente lugar orienta sin mover ni cobrar. Nombre/distancia, indicador de ocho rumbos y ancla del anillo migrada desde la ubicación vigente, independiente de la casa portátil. Si falla guardar, se revierte la migración. El siguiente resultado también propone caminar. Música, generación y estrellas conservadas.

## alpha.183 · K2 · recoger siempre tiene valor

Rama `pulido/k2-economia-chispas` desde K1. Fuera de tempo×1, a tiempo×2 y racha×3. Recuperación de pendientes con multiplicador cero, sin reemitir fragmentos cobrados ni alterar saldo/precios/estrellas. Simulación económica alineada con esa regla. Música y mundo conservados.

## alpha.184 · K3 · final5 en su contexto musical

Rama `pulido/k3-final-viaje` desde K2. El final de cinco círculos interpreta las notas guardadas en escala/tono y tempo de salida (90–150 BPM), con las mismas voces existentes, entradas separadas y menor ácido. La cama y las frases comparten armonía; una envolvente local deja silencio real antes de créditos y se cancela al salir. Cada círculo sigue ataques de su capa. No se modifican radio, instrumentos, generadores o MIDI guardados.

## alpha.185 · K4 · menú y avisos adaptables

Rama `pulido/k4-interfaz-clara` desde K3. Continuar/Seguir principal, tres destinos, utilidades discretas y sonido en Ajustes, conservando IDs/capacidades. Explorar en la partida terminada conserva el Mundo. Avisos territoriales cortos con columnas mínimas y ajuste de línea; ayuda de guardar situada junto al marcador. No cambia música o dibujo del mundo.

## alpha.186 · K5 · guía tras el Viaje

Rama `pulido/k5-recorrido-contextual` desde K4. Créditos explican cinco completados y seis nuevos; Explorar a pie sale del Refugio y activa el rumbo, sin trasladar al portal. La guía ofrece el mismo destino y agrupa experiencias opcionales. Tras terminar el Viaje se oculta la antigua lección automática de guardar sin borrar hechos; Practicar la reactiva voluntariamente. Formatos futuros y progreso se conservan.

## alpha.187 · K6 · verificación e integración del cierre

Rama `pulido/k6-validacion-cierre` desde K5. Marcha con teclas reales hasta Jardín sin asignar coordenadas, recompensa acelerada por el controlador real, rumbo a Dunas y recarga. Seguir también funciona tras volver al Camino; regreso al Camino queda en Más y sus controles/pruebas reflejan su ubicación. Regiones y Otro paisaje distinguen metas; viaje rápido voluntario a capítulos ya completos. Dos desbordamientos con texto doble corregidos. Guardia de preservación permite solo la integración/UI autorizadas y conserva297 archivos/voz/generación/arte.

[Entrega](docs/CIERRE_K.md):246 suites,48 muestras UI y recorridos afectados aprobados; cinco renders final5 reutilizados con código sonoro intacto. Canonical U03–U09/A04/E01 actualizados; aceptación humana/CI remoto no declarados. Nota técnica provisional7,9 del panel simulado, sin escucha del auditor. Main no se modifica.
