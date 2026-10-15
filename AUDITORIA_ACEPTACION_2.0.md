# Auditoría de aceptación · 2.0.0-rc.9

## Dictamen

**Candidata técnica para cerrar desarrollo; cierre de publicación todavía condicionado.**

Los diez bloques de cierre y los ocho de pulido están implementados en la cadena de ramas. Esta revisión encontró y corrigió un defecto de confirmación de guardado. El cierre no requiere añadir nuevos catálogos ni empezar de nuevo los planes históricos. Requiere aprobar las comprobaciones de integración, despliegue y aceptación que se detallan abajo.

No se certifican ausencia absoluta de errores, gusto musical ni rendimiento físico mediante pruebas automatizadas. El cierre de esta fase tampoco equivale a terminar un servicio público de cuentas y duetos: ese es otro ciclo.

## Alcance y trazabilidad

- Base: `docs/cierre-estado-unificado`, commit `10b74ed`, sobre la implementación F8 en `5d02c08`.
- Rama de auditoría: `audit/cierre-2-validacion`.
- Versión candidata: `2.0.0-rc.9`; fecha y revisión de publicación las sella Vercel al construir el artefacto.
- Revisados: planes vigentes, matriz musical, código de recorrido/guardado/viajes/tarjetas, reloj de poderes, cola de celebraciones, contrato de almacenamiento, shell offline, metadatos y workflow.
- Revisados también los informes completos F8 y su procedencia. La huella de producto previa coincide con `b308785d91c0fc9ac863df5db1ac95bfb15b15e3a725b9fe3176c4c07032e6f7`; las ramas documentales no cambiaron esa implementación.
- La evidencia actual se conserva en [auditoria-cierre-rc9-validation.json](scripts/auditoria-cierre-rc9-validation.json). Los resultados definitivos se resumen en su sección de verificación.

## Verificación actual

- `npm run audit:release`: aprobado, sin errores ni advertencias.
- `npm test`: 97 suites aprobadas.
- `python3 tests/server_api.py`: aprobado con HTTP/SQLite reales y datos temporales.
- `npm run test:browser`: 75/75 recorridos más offline, **76 en total**, aprobados.
- Evidencia musical reutilizada: 22 programas únicos, 455 casos retenidos, salidas exitosas, picos finitos y reportes referenciados presentes. Pico máximo 0,945446670; fracción caliente cero. No son nuevos renders RC9: el cambio no toca síntesis, composición ni mezcla.
- Revisadas capturas de primer nivel, celebración y Bitácora móvil; la inspección es una muestra y no sustituye teléfonos físicos.

## Defecto reproducido y corregido

| ID | Impacto | Solución | Regresión |
|---|---|---|---|
| A29 · Confirmación falsa al guardar | Si localStorage estaba lleno o había otro escritor, el marcador podía anunciar un guardado exitoso, otorgar su logro y terminar la guía sin persistir el lugar. Los códigos importados también podían indicar éxito. | Exigir escritura confirmada antes del logro/tutorial/confirmación. Mantener el trabajo en sesión para copia o reintento; diferenciar fallo de almacenamiento de límite de favoritos. Reintentar el mismo marcador sin duplicar ni renombrar. | `favorite_save_failure_smoke.py`: cuota simulada, copia anterior intacta, código importado sin éxito falso, reintento y escritor concurrente conservado. |

La prueba falló primero en la implementación anterior: avanzaba el hecho `save` del tutorial tras una escritura rechazada. La corrección pasó esa misma comprobación y el resto del recorrido. No cambia el formato de guardado, las semillas, los mapas ni la música.

## Contraste de criterios

| Área | Comprobación | Resultado y límite |
|---|---|---|
| Propósito y primer nivel | Movimiento, primera luz, entrada, fuente audible, pulso y marcador; omitir/repetir/recargar | Recorrido automatizado; comprensión de personas nuevas pendiente. |
| Camino diario | Una luz intencional abre el día; sin cuota temporal; medianoche no expulsa | Regresión de tres tamaños, recarga y progreso anterior. |
| Guardar y regresar | Marcador, nombre propio, WD1, semilla, versión, capa y coordenadas | Recorridos de favoritos/viajes; fallo de almacenamiento cubierto ahora con A29. |
| Integridad del progreso | Migraciones, límites de admisión, copia, conflictos y último archivo válido | Suites de persistencia y navegador; el navegador mantiene límites reales de almacenamiento. |
| Bitácora e interfaz | Cinco secciones, detalles por demanda, filtros, foco y paginación | Mil regiones conservadas, variantes paginadas, tres tamaños; no equivale a tacto o temperatura físicos. |
| Colecciones y hallazgos | Cincuenta caminantes, recompensas, rareza condicionada, regalos y avisos | Catálogos/registros y celebración probados; no se inventan frecuencias por minuto. |
| Poderes | Tiempo de juego activo, pausa, recarga, acumulación y regalo diario | Recorridos de poderes y reloj; no se pierde ni se rellena duración al recargar. |
| Identidad musical | Papeles locales, nueve materiales, fuentes visuales, filtros, composición y quietud | Lógica, matriz y renders anteriores; la belleza y el enmascaramiento perceptivo requieren escucha humana. |
| Voz y coherencia | Propósito, glosario, siguiente acción y guía opcional | Recorridos de guía/primer nivel; no se abre otra interfaz obligatoria para avanzar. |
| Estilo y accesibilidad | Geist Mono, fondo negro, oro ganado, foco, UI silenciosa y movimiento reducido | Integridad de fuentes y recorridos; inspección visual de muestra, sin certificación exhaustiva de cada pantalla/dispositivo. |
| PWA y publicación | Shell completo, caché nueva, sellado real y carga offline | Auditoría/recorrido offline; actualización y suspensión en teléfonos físicos pendientes. |
| Servidor opcional | HTTP/SQLite, autenticación, aislamiento, CSRF, CAS y salas | Base temporal local probada; no existe por ello un backend público desplegado. |

## Despliegue e integración observados

Comprobados el 15 de octubre de 2026; [instantáneas remotas](scripts/auditoria-cierre-rc9-remote.json):

1. Main cambió durante esta revisión por los merges de Jay. La última instantánea es `52fec80cfd9d0d8329d81ce876306b5505b77be6`: cierre F1–F10 y pulido F2 integrados; sus checks estaban en cola.
2. Producción responde con JavaScript real: **2.0.0-rc.2**, revisión `52fec80`, sello `2026-10-15T12:58:34.000Z`. Antes se observó 1.1.0 mientras se integraban ramas. La candidata RC9 de esta auditoría no es todavía la versión pública. Fecha de instantánea: `2026-10-15T13:00:02.314297+00:00`.
3. GitHub registra el deploy Preview F8 como `success`, con descripción `Deployment has completed`, del 15 de octubre a las 05:49:31 UTC. Esto confirma la construcción/publicación del preview F8; no la aceptación de RC9.
4. Abrir el host de preview F8 redirige a `vercel.com/login`. El HTTP 200 posterior es una página de autenticación, no el juego. No se verificaron desde allí la versión, el audio ni los gestos.
5. Para el commit F8 solo existe el check `Vercel Preview Comments`, aprobado. No sustituye lógica, navegador ni audio. No había PR abierto al consultar la API.
6. El workflow exige PR o push a main para ejecutar sus suites completas. Los resultados locales no se presentan como CI del PR aprobado.

El bloqueo previo de red dejó de reproducirse para la API y producción; el límite actual del preview es autenticación. No se desactivó su protección ni se cambió main.

## Condiciones de cierre

| Puerta | Estado | Acción suficiente para cerrarla |
|---|---|---|
| Desarrollo y regresiones locales | Aprobadas en esta revisión | Auditoría, lógica y recorridos aprobados; resolver cualquier fallo reproducible antes del push. |
| Integración | Pendiente, Jay mantiene PR/merge | Abrir el PR del conjunto deseado; aprobar lógica, navegador y los tres grupos de audio. Resolver los cambios respecto del main de ese momento. |
| Artefacto publicado | Producción anterior; preview F8 protegido | Abrir RC9 con sesión autorizada, comprobar menú: versión, revisión y hora reales. Tras merge, repetir en producción y probar actualización de la PWA. |
| Aceptación física y musical | No certificada | Una sesión en iPhone y Android, ambas orientaciones, suspensión/reanudación, copia/restauración y offline; escucha a volumen comparable. |
| Comprensión inicial | No certificada | Una persona nueva completa luz → fuente → pulso → guardar sin explicación externa y reconoce para qué explora. |

La autorización de avanzar sin confirmaciones entre ramas se mantiene. Una puerta externa no obliga a detener verificaciones independientes ni autoriza sustituirlas por una afirmación de aprobación.

## Prueba final acotada

1. En el preview de RC9, verifica la versión en el pie del menú.
2. Menú → Tu recorrido → Practicar. Completa fuente, pulso y marcador.
3. Guarda un nombre propio, cambia de destino y vuelve. Recarga.
4. Abre una región en Bitácora y revisa una tarjeta de hallazgo.
5. Escucha una fuente de percusión, una grave y una sostenida. Comprueba su señal.
6. Recarga con un poder; comprueba duración, regalo pendiente y progreso.
7. Suspende/reanuda, gira el teléfono y prueba offline tras la carga completa.

Si aparece un fallo, registrar teléfono, navegador, WD1, gesto y orientación; corregirlo con una regresión reproducible. La escucha final y la aceptación física se registran con fecha/dispositivo, sin convertirlas en porcentajes de perfección.

## Fuera de este cierre

Servidor público, cuentas entre dispositivos, duetos por Internet, costes y operación; más contenido o simulación global. Se conserva el inventario histórico de ideas sin declararlas terminadas ni convertirlo en requisito nuevo de esta fase.
