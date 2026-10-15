# Auditoría y soluciones · cierre 2.0

Trabajo en `feat/cierre-f10-lanzamiento`, hija de F9. Main no se modifica. Este registro distingue defectos corregidos, mejoras de experiencia y aceptación externa; una propuesta no equivale a una función terminada.

## Hallazgos reproducibles

| ID | Problema e impacto | Solución y comprobación |
|---|---|---|
| A01 | Una dirección WD1 abierta directamente perdía el indicador de viaje al recargar y podía regresar al centro. | Conservar `travel=1` y `travelReady`; `world_family_smoke.py` comprueba coordenadas exactas después de recargar. |
| A02 | Filtro y función musical dibujaban etiquetas superpuestas. | Una etiqueta cercana combinada, prioridad a la fuente reciente; `feedback.mjs`. |
| A03 | Con volumen cero podían aparecer señales y registros de notas inaudibles. | Comprobar volumen en feedback, registro y prioridad de acompañamiento; pruebas de silencio. |
| A04 | Tras 400 cajas se eliminaba una ubicación consumida; la caja podía reaparecer. | Conservar todas las ubicaciones consumidas; regresión de contacto natural con más de 400 registros. |
| A05 | Límites de 64/96/200/512 eliminaban ángulos, construcciones, plantas, quietud y regalos anteriores. Algunos normalizadores también truncaban al recargar. | Quitar expulsión de progreso persistente y truncado de datos válidos; mantener cachés transitorias acotadas. `persistent_progress.mjs` verifica 700 entradas y protección del último guardado válido. |
| A06 | Normalizar favoritos y tarjetas podía truncar una colección válida mayor que el límite de admisión. | Conservar registros válidos existentes; el límite impide nuevas admisiones sin expulsar anteriores. Regresiones en `favorites.mjs` y `rare_cards.mjs`. |
| A07 | El acceso exigía llenar la barra y la linterna expulsaba al jugador. Contradice la nueva regla de Jay. | Una primera luz diaria abre el Mundo; no se consume tiempo de exploración en ninguna capa. No interrumpir una sesión en medianoche; la siguiente entrada requiere Camino. Mantener historia y crecimiento opcional. `guide_smoke.py`. |
| A08 | La guía inicial explicaba gestos, pero no propósito ni significado de reliquias/casa. | Propósito breve, ayuda contextual de reliquia y recorrido consultable sin controles permanentes. Pulido F2 añade el primer nivel interactivo: seis hechos, una indicación breve, salida/repetición opcional y continuidad entre mundos. |
| A09 | Títulos y celebraciones tenían demasiado peso; la apertura de poderes era casi idéntica. | Reducir títulos, seis movimientos de apertura contenidos, lugar/serial y exportación. Respetar movimiento reducido; probar dos orientaciones y área ocupada. |
| A10 | Regalos mostraban el mismo rótulo de rareza que una caja natural. El serial no incorporaba el mundo. | Identificar regalo temporal y usar la identidad de tarjeta con semilla/versiones para el serial. No atribuir probabilidades naturales a regalos. |
| A11 | La búsqueda aleatoria de confluencia hacía intermitente una regresión. Otras dos pruebas seguían la estructura de chunks/dock anterior. | Visitar una confluencia nativa verificada; inyectar el contacto en el chunk visible; exigir los tres controles actuales. Conservar los comportamientos y aserciones originales. |
| A12 | La Voz consulta el papel musical sin pasar la fuente; una demostración con instrumento forzado puede explicar un papel diferente del que suena. | Corregido y probado en pulido F2: resolver con la fuente real; probar origen, silencio, suspensión y papel musical. |
| A13 | Una luz al pie del jugador podía completar automáticamente el nuevo acceso diario. | La primera recogida exige movimiento o una luz atraída mediante un pulso; las siguientes conservan la mecánica habitual. Regresión de siguiente día y recarga en tres tamaños de pantalla. |
| A14 | El registro del regalo de quietud vive en un Set de sesión: recargar permite repetir la misma concesión diaria. | Pendiente en pulido F5: conservar la concesión por lugar/día, separarla de las probabilidades de caja natural y probar recarga. |
| A15 | Los segundos restantes de los poderes no se guardan: una recarga conserva la caja consumida, pero pierde el beneficio activo. | Pendiente en pulido F5: instantánea versionada de tiempo de juego restante, sin gastar tiempo con la app cerrada ni reiniciar duración al abrir. |

Los selectores de Prototipo de las pruebas se acotan a su menú: añadir un glosario plegable no debe hacer ambiguo un clic de una regresión ajena. La prueba de paseo verifica ahora reloj activo de sesión y ausencia de consumo de exploración; conserva movimiento, pausa y cancelación.

Las soluciones de esta tabla deben acompañarse del informe de validación final. No confundir una comprobación de lógica con navegador, escucha humana o teléfono físico.

## Frecuencia de descubrimientos

`node scripts/discovery-frequency-audit.mjs` examina **49.152 sectores**, en original, bosque-01 y blobs-01; reconstruye poblaciones visibles, además de cajas, reliquias y fósiles. Evidencia en `scripts/cierre-f10-discovery-frequency.json`.

| Mundo / generación | Sectores terrestres | Cajas naturales | Individuos visibles | Individuos raros |
|---|---:|---:|---:|---:|
| Original / 1 | 10.288 | 465 | 10.460 | 106 |
| bosque-01 / 2 | 9.312 | 393 | 10.075 | 82 |
| blobs-01 / 2 | 7.968 | 305 | 8.427 | 66 |

La regla de caja natural es 4 % por sector terrestre; un poder concreto, aproximadamente 1/150. La reliquia mágica tiene 1/384 por sector elegible; la ordinaria excluye ese subconjunto. No son tasas por minuto ni garantías por recorrido. Los regalos son otra fuente.

Las tiradas de variante rara ordinaria son 1/256; la distribución y filtrado territorial cambian la proporción visible por linaje. Por eso la tarjeta distingue variante de frecuencia territorial desconocida. Construcciones y ballena tienen condiciones específicas; relaciones, convergencias y guardianes no tienen una probabilidad conjunta demostrada.

Antes de cambiar tasas: medir recorridos a pie, quietud y saltos por separado; distinguir repetición de ejemplar, de familia y de recompensa. El objetivo de UX es registrar lo cotidiano discretamente, celebrar novedades relevantes y reservar mayor protagonismo para lo excepcional. No cambiar semillas existentes ni inventar minutos medios a partir de densidad espacial.

## Revisión de experiencia pendiente de implementación

| Área | Diagnóstico | Solución siguiente |
|---|---|---|
| Primer nivel | Las hojas de ayuda no sustituyen aprender haciendo. | F2: una acción breve, respuesta visible, avance por hechos y salida opcional. |
| Guardar y viajar | Requiere buscar Favoritos dentro del menú. | F3: guardar desde el lugar, fichas compactas y regreso sencillo. Conservar escucha prolongada como gesto existente. |
| Bitácora | Cinco secciones útiles; Lugares y Música aún presentan demasiadas tarjetas de texto. | F4: resumen visual, fichas desplegables y conservación de filtro/desplazamiento. |
| Tarjetas | Hay arte y condiciones, pero avisos de ejemplares de una misma familia compiten por atención. | F5: jerarquía de novedades, repeticiones discretas y presentación según contexto/rareza. |
| Personajes | Anatomías procedurales existentes no equivalen a cincuenta variantes explícitas de los pequeños personajes pedidos. | F6: catálogo de cincuenta, siluetas/comportamientos/roles comprobables y distribución territorial. |
| Respuesta musical | Hay prioridades y percusión variada; queda verificar perceptibilidad por gesto y fuente en uso real. | F7: matriz de interacciones y ajustes de integración sin subir el máster. |
| Cierre de interfaz | Herramientas históricas y explicaciones pueden confundir. | F8: retirar duplicados visibles, revisar primer uso, acceso táctil y actualizar documentación. |

## Límites conservados y aceptación

Las cachés de render, nodos/voz, trazas efímeras y diario reciente permanecen acotados. Las restricciones globales de guardado (8 MiB y complejidad máxima) conservan el último archivo válido ante error; no convierten el navegador en almacenamiento infinito. No se borra una edición antigua para guardar otra. Una arquitectura de archivo/servidor de largo plazo será otro alcance.

No certificar por emulación: escucha artística, tacto/latencia/temperatura en iPhone y Android, comprensión de personas nuevas y deploy real de Vercel. Registrar cada incidencia con WD1, gesto, navegador y orientación. Servidor público y cuentas siguen fuera de este cierre.

Orden y ramas del trabajo solicitado: `PLAN_PULIDO_FINAL.md`.
