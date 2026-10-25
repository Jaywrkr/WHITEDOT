# Cierre de la auditoría 4

Jay autoriza J1–J7 el 25 de octubre con una condición: conservar cómo se generan la música y los mundos. No se amplían catálogos ni se rediseña el juego. Las ramas se encadenan desde `audit/panel-4-cierre`; Jay crea PR y merge.

Se conservan semillas, RNG, mapas, distribución, criaturas, paleta, formas, composición de la radio, patrones, instrumentos, mezcla y umbrales. Las correcciones musicales se limitan al cierre de victoria y a notas incorrectas de las capas/final; no reprograman el motor generativo. Los cambios de UI corrigen nombres, recorrido y estado con el diseño existente.

| Fase | Rama | Estado |
|---|---|---|
| J1 · Base fiable | `pulido/j1-base-fiable` | Corregida y probada localmente |
| J2 · Cierre musical | `pulido/j2-cierre-musical` | Corregida; escucha de Jay pendiente |
| J3 · UI de producción | `pulido/j3-interfaz-produccion` | Corregida y probada localmente |
| J4 · Una meta | `pulido/j4-meta-compartida` | Corregida y probada localmente |
| J5 · Continuidad | `pulido/j5-continuidad` | Pendiente |
| J6 · Sincronía | `pulido/j6-sincronia` | Pendiente |
| J7 · Comprobación final | `pulido/j7-cierre` | Pendiente |

## J1

Premios, récord, notas, color, remezcla y estado previo del capítulo se guardan juntos. Si la escritura falla, se restauran los datos y la ronda admite un reintento sin duplicar premios. Los once objetos finales solo se cierran al confirmar esa operación. Los lectores de lugares futuros tienen una vista segura bloqueada y conservan el formato original.

Las anotaciones de GitHub permitieron identificar S01: `house_visit_smoke.py`, `cloud_account_smoke.py`, `blobs_smoke.py`. La visita comparaba contadores en dos tareas separadas; se captura la salida y sus logros en una misma tarea. La semilla comparaba contra bytes anteriores a la navegación, mientras el juego aún podía autoguardar; se comprueba el aislamiento contra los bytes exactos presentes al iniciar la vista previa. La cuenta publicaba runtime antes de terminar su reconciliación inicial; la prueba espera ese estado antes de modificar la partida simulada. No se desactivan aserciones ni se cambia Supabase.

Pruebas y aceptación de cada fase se anotan aquí. CI del candidato, teléfono físico y sesiones con personas se mantienen separados de las pruebas locales.

Validación J1: auditoría de release sin errores; 241 suites Node; `house_visit_smoke.py`, `blobs_smoke.py`, `cloud_account_smoke.py`, `places_smoke.py` y `journey_stick_smoke.py` aprobados en Chromium. Las tres primeras reproducen los flujos citados por las anotaciones del CI base; su comprobación completa en el candidato queda para J7. No se afirma CI verde ni prueba física.

Teléfono J1: completar un lugar, cerrar la tarjeta, recargar y comprobar estrellas/chispas; abrir otra vez y verificar el récord. Los fallos de almacenamiento se validan con fixtures, sin provocar pérdidas en una partida personal.

## J2 · Cierre dentro de la música

El cierre añade dos compases de la misma capa que el lugar aporta a Tu canción, sobre el acorde y reloj vivos. No crea riser, crash o lead independiente ni automatiza filtro, silencio global o volumen de la radio. Viajar, repetir y salir cancelan su salida propia; la tarjeta pendiente no reaparece sobre una ronda nueva.

Cristales toma la tercera o quinta del acorde en vez de restar tres semitonos fijos. La segunda pasada del tema final conserva su intención de quinta, ajustada a la escala vigente. Se mantienen todas las voces, ritmos y generadores de la base.

Validación: 242 suites Node y auditoría estática aprobadas. Armonía comprobada en los once biomas, doce transposiciones y siete grados; cierre vivo, once renders de victoria (pico máximo 0,179), capas de Tu canción (0,485) y final maestro (0,389) aprobados. La prueba offline compara la misma base con/sin cierre: idéntica antes y después, filtro y salida intactos. No certifica gusto musical.

Teléfono J2: completar un lugar, escuchar su entrada breve y repetir o salir mientras termina; la música base debe continuar. Abrir Tu canción y reconocer la capa. Falta la aceptación auditiva de Jay; no se cambian géneros ni territorios para lograrla.

## J3 · UI de producción

Una función por nombre: campaña Viaje, selector Vista completa/tranquila, pestaña Chispas y Mapa de regiones/favoritos. La práctica Laboratorio pasa a Escuchar y responder. Versión y fecha reales se conservan en Ajustes con el diagnóstico; no se inventa una fecha de despliegue. Los resultados esperan si ya hay otro panel abierto.

Validación: 242 suites Node, auditoría estática y recorridos `release_smoke.py`, `journey_entry_smoke.py`, `menu_v2_smoke.py` aprobados. Sesenta estados en cuatro tamaños con hostname normal: cero errores de página, desbordamientos, textos menores de 11 px o objetivos menores de 24 px en las superficies medidas. Menú inspeccionado visualmente a 390 px. No cambia ninguna hoja de estilo ni dibujo del mundo.

Teléfono J3: menú → Más → cambiar Vista; Tu cubo → Chispas; guía → Escuchar y responder; Ajustes → versión. Abrir el menú mientras termina una ronda: la tarjeta espera al cierre del menú. Los controles siguen silenciosos.

## J4 · Una meta compartida

`gameObjective` lee el Camino, el capítulo y el siguiente lugar sin escribir ni viajar. Guía y menú usan esa lectura; portales y resultado conservan su mismo orden de `nextOnPath`. La guía explica el objetivo actual y distingue sus cuatro experiencias opcionales. Se puede consultar durante el Viaje.

La hoja y el acceso del Refugio priorizan lugares completos /11. Las estrellas /33 siguen como maestría y las chispas siguen siendo moneda; no se cambian umbrales, precios, recompensas o puertas ganadas.

Validación: 243 suites Node, auditoría estática, `refugio_lugares_smoke.py`, `recorrido_smoke.py` (cuatro tamaños) y `journey_entry_smoke.py` aprobados. El contrato recorre los once siguientes destinos y comprueba que el saldo no cambia la meta. El diseño del mundo no se modifica.

Teléfono J4: consultar Guía, menú y Lugares en la misma partida; deben señalar el mismo destino. En Refugio se ve /11 y en Lugares se distingue la maestría /33. No hace falta comprar nada para completar lugares.
