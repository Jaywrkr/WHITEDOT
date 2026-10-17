# Entrega prioritaria · Radio recuperada

Versión `2.3.0-alpha.4`, rama `feat/juego-04-interpretacion`, base `347e922`. [Comparación histórica y alcance](RECUPERACION_MUSICAL.md). Auditoría sin errores/avisos, 108 suites Node afectadas, 72 marcos históricos de nueve estilos, recorrido móvil de producción y seis mezclas renderizadas aprobados. Evidencia propia en scripts/juego-04-validation.json; no equivale al cierre de las doce fases ni a escucha física/deploy. Ampliación nueva de gestos de F4 pendiente. Jay mantiene PR/merge.

# Evidencia y reanudación · Juego musical 2.3

Fecha de revisión: 2026-10-16 UTC. No representa un deploy.

## Estado

Fase 1 implementada y verificada en `feat/juego-01-llegadas`, desde main `9fb6864`. Versión `2.3.0-alpha.1`. Entrega para PR/merge de Jay; Codex no cambia main. Las fases 2–12 continúan desde esta rama, cada una con versión y evidencia propias. No equivale al cierre de las doce fases.

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

## Pruebas de fase 1

- `npm run audit:release`: 0 errores, 0 advertencias; 201 módulos, 221 assets.
- `npm test`: 137 suites aprobadas, Node 24.19.0; también aprobadas en 20.20.2. Se repite la suite completa antes del push final.
- 13 recorridos enfocados: arrival, practice_travel, travel_v2, world, smoke, alive, recorrido, materia, lab, discovery_pacing, notice_lane, notice_priority y accessibility (archivos en tests/). Todos aprobados. Detalle en scripts/juego-01-validation.json.
- Laboratorio: 254 entradas, ubicaciones, notas persistentes e informe. Guía: 320/390/844/1280 px. Grabación y materia: PC y móvil. Avisos: ráfagas, prioridad, foco y ausencia de superposición.
- La prueba del oasis comprueba recuperación de energía, contador y explicación conservada: un aviso cotidiano puede suprimirse. La Voz se solicita por su cola real, evitando una clase CSS inyectada sin turno. No se reducen las aserciones para recuperar avisos ruidosos.
- La prueba de grabación lee cualquier tarjeta anterior con su botón; después recoge una nueva durante el set, verifica que se guarda sin cubrir controles y detiene mediante el botón real.
- `python3 -m py_compile tests/*smoke.py tests/smoke.py scripts/prepare-cloud-browser.py` y `git diff --check`: aprobados.
- No cambia síntesis ni reproducción en F1; audio no requerido. No afirmar escucha física, suites completas, CI ni deploy.

## Recuperación del entorno

Chromium del sistema fallaba por `pthread_create EAGAIN` ante unos 19.000 zombis heredados. La descarga de Playwright fue bloqueada por HTTP 403. Se recuperó navegador con Headless Shell 153.0.0 desde npm, comprobando SHA-512 y licencia, fuera de dependencias/runtime del juego. `scripts/prepare-cloud-browser.py` reproduce la herramienta local. No se mató supervisor ni procesos ajenos.

Perfil local: `UV_THREADPOOL_SIZE=1 NODE_OPTIONS=--v8-pool-size=1 WHITEDOT_TEST_SERIAL_HTTP=1 WHITEDOT_CHROMIUM_SINGLE_PROCESS=1 WHITEDOT_SYSTEM_CHROMIUM=/tmp/whitedot-headless/chromium CHROMIUM_PATH=$PWD/scripts/chromium-constrained.sh python3 scripts/browser-processes.py --timeout=180 python3 tests/PRUEBA.py`. Compositor normal para UI. Cada viewport independiente libera su navegador; se conserva el estado dentro de cada recorrido. CI mantiene su perfil normal y todas las suites.

## Continuación autorizada

F2 desde la entrega F1, siguiendo PLAN_JUEGO_MUSICAL.md, sin solicitar otra confirmación. Una versión por fase. Acuerdo posterior de Jay: antes de cada push, auditoría rápida y pruebas de lógica/navegador/audio afectadas. No repetir todo en cada fase; completas una vez en F12. F12 ejecutará navegador/audio completos y auditorías. Jay mantiene PR/merge.

## Prueba en teléfono cuando exista el preview

Abrir la partida habitual sin `addr`, recoger la luz si corresponde y entrar. Cerrar y abrir una nueva página: debe variar el lugar sin perder colección. Menú → Volver al salto regresa al punto anterior. Volver de segundo plano conserva posición. Abrir un enlace compartido conserva sus coordenadas. Grabar mientras aparece un hallazgo: se guarda y espera; detener debe seguir accesible. Repetir la guía: una sola pista clara. Abrir el preview de Vercel correspondiente a esta rama cuando termine su deploy.
