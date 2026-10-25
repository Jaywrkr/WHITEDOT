# Cierre de la auditoría 4

Jay autoriza J1–J7 el 25 de octubre con una condición: conservar cómo se generan la música y los mundos. No se amplían catálogos ni se rediseña el juego. Las ramas se encadenan desde `audit/panel-4-cierre`; Jay crea PR y merge.

Se conservan semillas, RNG, mapas, distribución, criaturas, paleta, formas, composición de la radio, patrones, instrumentos, mezcla y umbrales. Las correcciones musicales se limitan al cierre de victoria y a notas incorrectas de las capas/final; no reprograman el motor generativo. Los cambios de UI corrigen nombres, recorrido y estado con el diseño existente.

| Fase | Rama | Estado |
|---|---|---|
| J1 · Base fiable | `pulido/j1-base-fiable` | Corregida y probada localmente |
| J2 · Cierre musical | `pulido/j2-cierre-musical` | Pendiente |
| J3 · UI de producción | `pulido/j3-interfaz-produccion` | Pendiente |
| J4 · Una meta | `pulido/j4-meta-compartida` | Pendiente |
| J5 · Continuidad | `pulido/j5-continuidad` | Pendiente |
| J6 · Sincronía | `pulido/j6-sincronia` | Pendiente |
| J7 · Comprobación final | `pulido/j7-cierre` | Pendiente |

## J1

Premios, récord, notas, color, remezcla y estado previo del capítulo se guardan juntos. Si la escritura falla, se restauran los datos y la ronda admite un reintento sin duplicar premios. Los once objetos finales solo se cierran al confirmar esa operación. Los lectores de lugares futuros tienen una vista segura bloqueada y conservan el formato original.

Las anotaciones de GitHub permitieron identificar S01: `house_visit_smoke.py`, `cloud_account_smoke.py`, `blobs_smoke.py`. La visita comparaba contadores en dos tareas separadas; se captura la salida y sus logros en una misma tarea. La semilla comparaba contra bytes anteriores a la navegación, mientras el juego aún podía autoguardar; se comprueba el aislamiento contra los bytes exactos presentes al iniciar la vista previa. La cuenta publicaba runtime antes de terminar su reconciliación inicial; la prueba espera ese estado antes de modificar la partida simulada. No se desactivan aserciones ni se cambia Supabase.

Pruebas y aceptación de cada fase se anotan aquí. CI del candidato, teléfono físico y sesiones con personas se mantienen separados de las pruebas locales.

Validación J1: auditoría de release sin errores; 241 suites Node; `house_visit_smoke.py`, `blobs_smoke.py`, `cloud_account_smoke.py`, `places_smoke.py` y `journey_stick_smoke.py` aprobados en Chromium. Las tres primeras reproducen los flujos citados por las anotaciones del CI base; su comprobación completa en el candidato queda para J7. No se afirma CI verde ni prueba física.

Teléfono J1: completar un lugar, cerrar la tarjeta, recargar y comprobar estrellas/chispas; abrir otra vez y verificar el récord. Los fallos de almacenamiento se validan con fixtures, sin provocar pérdidas en una partida personal.
