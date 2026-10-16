# Cierre de interacción final

## Entregas y orden

Base musical: `5c3cb2f`, ya integrada por Jay en main mediante PR #158 (`eb3230e`). Al revisar, los archivos de ejecución de ese main coinciden con la base musical. Jay integró después las entregas 3–7; main actual revisado `d4beace` (PR #164). La simulación de integración de esta entrega final contra ese main no presenta conflictos. Las ramas de esta ampliación son acumulativas; Codex solo commit/push, Jay PR/merge.

| Orden | Rama | Commit de entrega | Alcance |
|---|---|---|---|
| 3 | `feat/posmusica-03-universo-vj` | `aceffc1` | Interfaz, cola, tarjetas grandes, visuales y encuentros |
| 4 | `feat/posmusica-04-cajas` | `435de08` | Dieciséis sorpresas temporales y reversión |
| 5 | `feat/posmusica-05-perfil` | `86da617` | Perfil local, métricas nuevas y revisión integrada |
| 6 | `feat/posmusica-06-instrumentos` | `3d355dd` | Diez instrumentos vivos y cinco estelas musicales |
| 7 | `feat/posmusica-07-recorrido` | `7865a25` | Guía ilustrada y cuatro referencias VJ |
| 8 | `feat/posmusica-08-cierre` | Esta rama | Auditoría de integración, correcciones y CI completo |

Las ramas 3–7 recibieron el mismo arreglo de compatibilidad con commits normales y su informe actualizado: auditoría, npm test completo en Node 20 y navegador de avisos aprobados por rama, sin reescribir historia.

La entrega 3 incluye la interfaz 1. La rama incompleta 2 no se necesita: su trabajo útil se recuperó en 6, sobre el UI nuevo. No mezclar aquella rama antigua. Si Jay prefiere integrar todo junto, la rama 8 contiene el conjunto; después no hace falta repetir los PR de sus ancestros. No usar squash entre entregas si se quiere mantener la relación de ancestros intacta.

## Auditoría y soluciones

| Área | Revisión o problema encontrado | Resultado |
|---|---|---|
| Botones y entrada | Flecha, doble toque, teclado y movimiento reducido | Animaciones locales y silenciosas; cancelación segura |
| Avisos | Solapamiento, ráfagas, duplicados y mensajes atrasados | X1/X2/X3, prioridad, agrupación, caducidad y dueño exclusivo |
| Foco de la Voz | Marcar inert antes de consultar foco impedía devolverlo | Captura previa; Escape, lectura y devolución al Mundo probados |
| Tarjetas | Examen, tamaño táctil y avance accidental | Presentación manual completa; foco y bloqueo del fondo |
| Cajas | Duraciones, sorpresa versus poder original y reversión | Relojes separados; Deshacer/Volver; progreso conservado |
| Perfil | Saltos contados como distancia e historia inventada | Solo caminar/tiempo activo desde esta versión |
| Instrumentos | Repetición de rol, falta de gesto/filtro y exceso de actividad | Diez familias, predominio local, controles físicos y presupuesto compartido |
| Swing | Respuestas repetidas sumaban tiempo recto | Realineación de cada respuesta a la rejilla local |
| Armonía | Respuesta repetida reutilizaba el primer acorde | Consulta del marco musical disponible para su propio instante |
| Contacto visual | Instrumentos nuevos sin gesto común en silencio | Contacto conecta el gesto visual existente, sin crear audio de UI |
| Guía móvil | Abrir glosario empujaba las acciones fuera de pantalla | Contenido desplazable; encabezado y acciones visibles |
| Colección | Familias/metadatos desconocidos y versiones futuras podían perderse | Conservación, recuperación y lectura protegida; guardado/recarga real |
| Imán | Las voces acompañantes quedaban poco presentes | Ganancia por rol y vínculo visual; grupo máximo de ocho, cuatro entradas/compás |
| Percusión | Nuevas fuentes claras por hábitat | Seis cuerpos/siluetas adicionales; semilla separada y espacios conservados |
| Guardado de guía | Campos desconocidos se perdían al normalizar | Se conservan extensiones y hechos desconocidos |
| Territorio VJ | Más motivos podían reasignar coordenadas previas | Hash secundario; conserva posiciones, tamaño y huecos |
| Referencia real | Repo TouchDesigner no estaba en los checkouts | Revisión pública de cuatro escenas y previews; procedencia documentada |
| Colección sin pantalla | La cola creaba un timer de DOM en Node; fallo reproducido en Node 20 | Sin DOM no inicia el driver visual; regresión y 133 suites Node 20 aprobadas |
| Pruebas locales | Recursos heredados impiden Chromium normal | Wrapper opcional de un contexto, limpieza propia; CI normal conserva todas las pruebas |

## Catálogos actuales

52 estilos nativos, 18 influencias musicales y 14 identidades de producción existentes. Esta ampliación incorpora diez familias de miniinstrumentos: seis motores nuevos y reutilización de batería/motores avanzados. El catálogo queda en 81 especificaciones de síntesis, 157 familias del libro, 72 tipos de tarjeta y doce motivos VJ. No son 81 instrumentos simultáneos ni 151 especies biológicas; tampoco una medida del número de mundos.

Las nuevas ubicaciones usan semillas independientes. Las dieciséis sorpresas no cambian los seis poderes ni las probabilidades de cajas anteriores. Las dos tarjetas micro exigen una variante entre 64 de su familia; la frecuencia territorial y por hora no está medida. No se inventan probabilidades conjuntas ni historia del perfil.

## Validación del conjunto

- Auditoría de release: sin errores/advertencias.
- Node: 134 suites completas en la ampliación final; entregas anteriores conservan sus cifras.
- Entrega 6: navegador real a 390/844/1280 px y 25 renders a 44.1/48 kHz, presión/filtro extremos, cinco estelas sobre banda densa y pico máximo 0,8792.
- Entrega 7: guía, guardado, controles y cuatro motivos nativos a 320/390/844/1280 px; capturas inspeccionadas.
- Entrega 8: recorrido integrado a 320/390/844/1280 px y 25 renders finales aprobados. Se comprueban además las alturas de acordes y tiempos fuertes. El primer intento de Chromium agotó hilos al arrancar el audio; el perfil local de audio reduce un hilo de composición y completó todos los renders. Esa opción se limita al audio offline mediante `WHITEDOT_CHROMIUM_NO_COMPOSITOR=1`; las pruebas visuales conservan el compositor. CI completo se ejecuta sobre esta rama, sin abrir PR ni hacer merge. La primera ejecución remota reveló el timer sin DOM: se reprodujo y corrigió, sin omitir pruebas ni cambiar la versión de CI para ocultarlo. El resultado final se registra en `scripts/posmusica-08-ci.json` cuando exista.

`checks.yml` conserva navegador completo y tres grupos de audio; todos condicionan `browser-audio`. El push de la rama final activa la ejecución. Actualizar exclusivamente documentación/informes no repite ese push de pruebas; los PR siguen ejecutando todo sin filtros de archivos. No se elimina ningún programa o aserción. Los comandos completos son `npm run audit:release`, `npm test`, `npm run test:browser` y `npm run test:audio`.

La automatización comprueba ejecución, tiempos, límites, armonía y salida protegida. No certifica gusto musical ni una masterización comercial. Aceptación humana pendiente: escucha en iOS/Android, altavoces/auriculares y prueba táctil física. Preview y producción se verifican por commit; no atribuir a producción cambios que Jay aún no ha integrado.

## Cómo probar

Ver [PROBAR_INTERACCION_FINAL.md](PROBAR_INTERACCION_FINAL.md). Entrar al Mundo; Estilos → Explora instrumentos vivos. Contactar, permanecer y rodear. Probar una sorpresa de caja y Deshacer. Revisar Tu perfil y Tu recorrido en el menú. Abrir una tarjeta, inspeccionarla y continuar; las notificaciones deben esperar.

## Última ampliación y controles enfocados

- Avisos X1/X2/X3: cuatro tamaños, ráfagas de 50 eventos, prioridad, agrupación, caducidad, salida sin solapamientos y UI silenciosa. Tarjetas completas conservan lectura, foco y pausa. La Voz devuelve correctamente el foco al desaparecer.
- Colección: guardado/recarga real a 390/844 px; conserva familias/metadatos desconocidos y libros futuros, sin inflar contadores del HUD ni del perfil.
- Seis percusiones: contacto nativo y respuesta visual sin sonido, roles/álbum y persistencia a 390/844/1280 px. Las posiciones de las fuentes anteriores conservan su hash.
- Recorrido integrado final: 320/390/844/1280 px. Un intento agotó un hilo al abrir AudioContext en este contenedor; la ejecución directa completó las cuatro vistas sin omitir aserciones.
- Audio nuevo: 16 renders de seis cuerpos y cuatro conjuntos con Imán, 44.1/48 kHz, pico máximo 0,876724 y cero muestras calientes. Error máximo frente a rejilla: 8,462 ms; el conductor conserva deliberadamente microtiempo programado menor a 9 ms. No se elimina ese groove ni se exige una cuadrícula robótica. El harness offline aísla el arranque de la aplicación para no crear un segundo motor.
- Totales a verificar en CI: 103 recorridos más offline, 41 programas de audio y 134 suites Node. El resultado debe corresponder al commit final. La ejecución previa `38914350592` aprobó lógica y los tres grupos de audio, pero falló navegador; no se presenta como un cierre aprobado. Los fallos futuros de cada recorrido se incluyen en anotaciones de GitHub para poder diagnosticarlos.

Último ajuste: los logros rutinarios se conservan sin aviso, comprobado con `ui.unlock` real en cuatro tamaños. El recorrido antiguo de nueve percusiones cierra ahora la tarjeta del fósil antes de comenzar otro gesto, respetando la pausa de lectura; sus aserciones siguen activas. Su ejecución adicional local no llegó a cargar por `pthread_create: EAGAIN`; no se afirma aprobada. Las regresiones Node de las nueve familias, los seis contactos nuevos y los 16 renders sí están aprobados. CI normal conserva ese recorrido completo.
