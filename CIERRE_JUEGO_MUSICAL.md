# Evidencia y reanudación · Juego musical 2.3

Fecha de revisión: 2026-10-16 UTC. No representa un deploy.

## Estado

Fase 1 implementada en `feat/juego-01-llegadas`, desde main `9fb6864` (integración de Jay). Versión `2.3.0-alpha.1`. Commit local; no push, PR, merge ni cambio de main. Fases 2–12 pendientes con autorización vigente. No afirmar cierre completo.

## Cambios

- Una llegada nueva por documento para jugadores habituales, con semilla independiente y memoria de timbres; tempo añade contraste a la selección. Cada tercera llegada favorece un territorio festivo compatible.
- Punto anterior exacto conservado, incluyendo capa. Preferencia continuar, coordenadas compartidas, laboratorio, demos y formato futuro conservan destino. Guardado rechazado revierte antes de tocar URL o colas.
- Una llegada automática no convierte la URL en destino explícito; de lo contrario la siguiente visita quedaba fijada por error.
- No se reinicia el viaje al volver del fondo. El primer jugador conserva su guía y el ritual de luz diario continúa.
- Metadatos actuales de región/temporada/gravedad/tempo se actualizan aunque se descarte un aviso. La cola continúa limitada, no se aumenta frecuencia.
- Tarjetas y notificaciones esperan mientras se graba o se arma un loop. Los hallazgos siguen guardados.
- Repetir guía retira Voz automática/avisos rutinarios. Conserva diario y mensajes pedidos; una lectura importante tiene prioridad.
- Laboratorio verifica sus 254 entradas actuales. Repetidos se siguen coleccionando sin tarjetas grandes; prueba alineada con esa regla previa.
- Script de versión actualiza package, release-info, caché, HTML de reserva y README. Valida antes de escribir. No inventa fecha de publicación.

## Pruebas

- `npm run audit:release`: 0 errores, 0 advertencias; 201 módulos, 221 assets.
- `npm test`: 137 suites aprobadas, Node 24.19.0.
- `UV_THREADPOOL_SIZE=1 NODE_OPTIONS=--v8-pool-size=1 /tmp/node-v20.20.2-linux-x64/bin/node scripts/run-tests.mjs`: 137 suites aprobadas.
- Nuevas regresiones: llegadas reales repetidas, regreso exacto, premios conservados, preferencia continuar y enlaces; metadata independiente del aviso; bloqueo de tarjetas durante grabación; versión atómica coherente.
- `python3 -m py_compile tests/arrival_smoke.py tests/discovery_pacing_smoke.py tests/lab_smoke.py`: aprobado. Compilar Python no equivale a ejecutar navegador.
- `git diff --check`: aprobado.
- `WHITEDOT_TEST_SERIAL_HTTP=1 WHITEDOT_CHROMIUM_SINGLE_PROCESS=1 CHROMIUM_PATH=$PWD/scripts/chromium-constrained.sh python3 scripts/browser-processes.py --timeout=140 python3 tests/world_smoke.py`: bloqueado al arrancar Chromium, antes de ejecutar aserciones. Perfil de compositor conservado.
- No cambia síntesis ni reproducción: audio no ejecutado en F1; escuchar y renderizar es obligatorio al cambiarlo en F2.

## Bloqueo externo

El contenedor contiene aproximadamente 19.000 procesos zombis heredados. Chromium devuelve `pthread_create: Resource temporarily unavailable (11)` aun en el perfil local de un proceso. La descarga alternativa de Chromium Headless Shell devuelve HTTP 403 `Domain forbidden` para cdn.playwright.dev. No hubo rechazo de aprobación automática: la ejecución fuera de la restricción fue permitida; el límite de recursos y la política de red impiden validar.

No matar supervisor ni procesos ajenos, ni usar el flag que desactiva compositor para UI. No desactivar pruebas ni publicar una fase sin evidencias. Se guardaron instrucciones corregidas en el borrador del entorno; guardarlas no reinicia este contenedor. Para activarlas, revisar/guardar y publicar desde ajustes del entorno. Un contenedor nuevo es necesario para reintentar. Conservar el commit y su bundle antes de reemplazar el entorno; no se ha verificado restauración de commits solo locales.

## Reanudación sin nueva autorización

1. Restaurar esta rama y comprobar Chromium en un contenedor limpio.
2. Ejecutar arrival_smoke, practice_travel_smoke, travel_v2_smoke, world_smoke, smoke, alive_smoke, recorrido_smoke, materia_smoke, lab_smoke y discovery_pacing_smoke (todos en tests/). Corregir causas si fallan; no reducir aserciones. Las pruebas heredadas con varios contextos usan Chromium normal, no single-process.
3. Repetir auditoría y npm test tras correcciones; registrar evidencia por revisión y subir explícitamente `git push -u origin feat/juego-01-llegadas`.
4. Desde esa rama validada crear F2; continuar hasta F12 con versiones y evidencias propias. No crear PR ni merge desde Codex.
5. En F12: navegador/audio completos, auditorías de diversidad y revisión musical. Escucha real en teléfono y deploy se registran aparte.

## Prueba en teléfono cuando exista el preview

Abrir la partida habitual sin `addr`, recoger la luz si corresponde y entrar. Cerrar y abrir una nueva página: debe variar el lugar sin perder colección. Menú → Volver al salto regresa al punto anterior. Volver de segundo plano conserva posición. Abrir un enlace compartido conserva sus coordenadas. Grabar mientras aparece un hallazgo: se guarda y espera; detener debe seguir accesible. Repetir la guía: una sola pista clara. Todavía no hay preview de esta rama.
