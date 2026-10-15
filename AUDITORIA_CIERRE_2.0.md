# Auditoría y soluciones · cierre 2.0

Base auditada en F10, con soluciones continuadas en las ramas de PLAN_PULIDO_FINAL.md. Main no se modifica. Este registro distingue defectos corregidos, mejoras de experiencia y aceptación externa; una propuesta no equivale a una función terminada.

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
| A14 | El registro del regalo de quietud vive en un Set de sesión: recargar permite repetir la misma concesión diaria. | Corregido en pulido F5: concesión persistente por región/día y caja pendiente recuperable; recarga y recogida probadas. |
| A15 | Los segundos restantes de los poderes no se guardan: una recarga conserva la caja consumida, pero pierde el beneficio activo. | Corregido en pulido F5: instantánea versionada de tiempo activo restante, pincel y compañero; pausa, recarga y formatos futuros probados. |
| A16 | IDs de favoritos podían coincidir al guardar dos mundos simultáneamente. | Corregido en pulido F3: sufijo único, sin cambiar IDs existentes; prueba de ambos registros. |
| A17 | Un duplicado inválido podía ocultar otro favorito válido. | Corregido en pulido F3: validar antes de reservar ID; prueba de normalización. |
| A18 | La respuesta del caminante estaba después del retorno anticipado de audio del Mundo y podía no sonar. | Corregido en pulido F6: respuesta desde playVoice con fuente, escala y reloj reales; pruebas nativas y diez renders. |
| A19 | El Imán usaba la longitud sin filtrar para seleccionar una fuente musical filtrada y perdía golpes. | Corregido en pulido F7: índice sobre la lista musical; cuatro golpes comprobados con una lista mixta. |
| A20 | El giro de quietud devolvía siempre el filtro a 20 kHz, pisando un corte previo más suave. | Corregido en pulido F7: cerrar y regresar al valor previo; prueba de automatización y renders. |
| A21 | Pincel, estela, compañero y quietud emitían notas sin la señal común de su fuente. | Corregido en pulido F7: onsets locales y prioridad del Pincel; gesto nativo y audio comprobados. |
| A22 | Abrir Lugares reconstruía todas las regiones y buscaba reliquias aun con fichas plegadas. | F8: veinte resúmenes y detalle por demanda; mil registros conservados en tres tamaños. |
| A23 | Título de región y frase podían competir con el primer nivel. | F8: una indicación, con título/frase ocultos durante la guía; recorridos táctiles y revisión visual. |
| A24 | Un caminante encontrado podía quedar al fondo del álbum. | F8: ordenar encontrados primero; aserción en el recorrido nativo. |
| A25 | Quedaban oro de interacción en lluvia/blobs/cajas no abiertas y brumas extensas. | F8: color musical local, oro ganado y pulsos/brumas contenidos. |
| A26 | La estela heredaba un identificador de Pincel en su señal técnica tras F7. | F8: distinguir Cometa y Pincel; renders completos del conjunto final. |
| A27 | Acumular duración de Campo hacía colapsar su radio y repetir apertura a mitad del beneficio. | F8: edad de activación separada, guardada y restaurada; regresiones de acumulación y paso de duración original. |
| A28 | Formas generaba todos los registros; búsqueda/propiedad no se aplicaban a algunas colecciones. | F8: paginar formas y ocultar controles sin efecto; prueba de carga/paginación y retorno a filtros válidos. |

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

## Revisión de experiencia y avance

| Área | Diagnóstico | Solución siguiente |
|---|---|---|
| Primer nivel | Las hojas de ayuda no sustituyen aprender haciendo. | Implementado en F2: una acción breve, respuesta visible, avance por hechos y salida opcional. |
| Guardar y viajar | Requiere buscar Favoritos dentro del menú. | Implementado en F3: guardar desde el lugar, fichas compactas y regreso sencillo. Conservar escucha prolongada como gesto existente. |
| Bitácora | Cinco secciones útiles; Lugares y Música aún presentan demasiadas tarjetas de texto. | Implementado en F4: resumen visual, fichas desplegables y conservación de filtro/desplazamiento. |
| Tarjetas | Hay arte y condiciones, pero avisos de ejemplares de una misma familia compiten por atención. | Implementado en F5: jerarquía de novedades, repeticiones discretas y presentación según contexto/rareza. |
| Personajes | Anatomías procedurales existentes no equivalen a cincuenta variantes explícitas de los pequeños personajes pedidos. | Implementado en F6: catálogo de cincuenta, siluetas/comportamientos/roles comprobables y distribución territorial. |
| Respuesta musical | Hay prioridades y percusión variada; queda verificar perceptibilidad por gesto y fuente en uso real. | Implementado en F7: matriz de interacciones y ajustes de integración sin subir el máster. |
| Cierre de interfaz | Herramientas históricas y explicaciones pueden confundir. | Implementado en F8: retirar duplicados visibles, revisar primer uso, acceso táctil y actualizar documentación. |

## Límites conservados y aceptación

Las cachés de render, nodos/voz, trazas efímeras y diario reciente permanecen acotados. Las restricciones globales de guardado (8 MiB y complejidad máxima) conservan el último archivo válido ante error; no convierten el navegador en almacenamiento infinito. No se borra una edición antigua para guardar otra. Una arquitectura de archivo/servidor de largo plazo será otro alcance.

No certificar por emulación: escucha artística, tacto/latencia/temperatura en iPhone y Android, comprensión de personas nuevas y deploy real de Vercel. Registrar cada incidencia con WD1, gesto, navegador y orientación. Servidor público y cuentas siguen fuera de este cierre.

Orden y ramas del trabajo solicitado: `PLAN_PULIDO_FINAL.md`.


## Resultado automatizado final

Auditoría sin errores ni advertencias; 97 suites Node, 75 recorridos de navegador incluidos offline, y 455 renders de audio en 22 programas aprobados. Ambas generaciones y diversidad verificadas. CI del PR, deploy real y aceptación física pendientes. [Informe](scripts/pulido-f8-validation.json) · [Audio por caso](scripts/pulido-f8-audio-suite.json). La prueba de frecuencia espacial de F10 se conserva: no se cambiaron las probabilidades naturales.
