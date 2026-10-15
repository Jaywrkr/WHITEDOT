# Experiencia viva · plan autorizado

Jay autorizó las catorce fases. Una rama por fase, encadenadas. Codex commit/push; Jay PR/merge. Base observada: main e351584 (PR #129 integra L7). No reiniciar planes históricos.

| Fase | Alcance | Rama | Estado |
|---|---|---|---|
| 1 | Auditoría y experiencia coherente | `feat/experiencia-01-base` | Implementada; validación registrada abajo |
| 2 | Primer encuentro jugable | `feat/experiencia-02-bienvenida` | Implementada; validación registrada abajo |
| 3 | Camino, entrada y Voz | `feat/experiencia-03-camino` | Implementada; validación registrada abajo |
| 4 | Llegadas y favoritos claros | `feat/experiencia-04-viajes` | Implementada; validación registrada abajo |
| 5 | Casa viva y edición táctil | `feat/experiencia-05-casa` | Implementada; validación registrada abajo |
| 6 | Tarjetas ganadas en encuentros | `feat/experiencia-06-hallazgos` | Implementada; validación registrada abajo |
| 7 | Rareza y observaciones útiles | `feat/experiencia-07-rareza` | Implementada; validación registrada abajo |
| 8 | Atlas y expediciones sonoras | `feat/experiencia-08-atlas` | Implementada; validación registrada abajo |
| 9 | Coleccionar para crear | `feat/experiencia-09-creacion` | Implementada; validación registrada abajo |
| 10 | Profundidad musical | `feat/experiencia-10-musica` | Pendiente |
| 11 | Espejos y percepción | `feat/experiencia-11-optica` | Pendiente |
| 12 | Biodiversidad territorial | `feat/experiencia-12-ecosistemas` | Pendiente |
| 13 | Identidad y constelaciones | `feat/experiencia-13-identidad` | Pendiente |
| 14 | Auditoría integrada | `feat/experiencia-14-cierre` | Pendiente |

## Contratos de aceptación

- Negro, Geist Mono, esquinas rectas, oro ganado y UI silenciosa. Una indicación breve cada vez; controles grandes sin ocupar el paisaje.
- El primer encuentro enseña movimiento, escucha, pulso y guardado; omitir/repetir sin borrar progreso.
- Camino diario sin reloj de exploración. Voz al inicio, a petición y excepcional; retornos explícitos no se aleatorizan.
- Viajes guardan dirección y carácter musical; nunca prometen congelar una canción.
- Casa táctil con selección, vista previa y relaciones. Las tarjetas no se consumen al crear.
- Rareza según condiciones reales; nada de porcentajes inventados ni recompensas por repetir sin sentido.
- Atlas visual, relaciones y expediciones; límites de voces, densidad y rendimiento.
- Profundizar géneros antes que sumar etiquetas. Metas de ampliación sujetas a diferencias perceptibles; no declarar cifras alcanzadas sin contenido y pruebas.
- Nuevos flujos de semillas independientes; versiones y coordenadas antiguas intactas. Guardados futuros y premios desconocidos se preservan.
- Auditoría/Node completos por rama; navegador y audio afectados; suites completas al cierre. Registrar fallos y soluciones sin desactivar pruebas. Teléfonos físicos, CI y deploy se verifican aparte.

## Auditoría inicial comprobada

| Hallazgo | Evidencia | Solución asignada |
|---|---|---|
| Bienvenida solo textual | mHelpC/mHelpW en index.html | F2: figuras y pasos con gestos reales |
| Favoritos mezcla guardar, códigos, orientación y lista | mFavorites y favorites.js | F4: jerarquía, búsqueda y herramientas plegables |
| Casa coloca sin anticipar ni seleccionar visualmente | house.js tap/palette/draw | F5: previsualización y selección táctil |
| Atlas conserva observaciones pero no las relaciona | rare-card-model/rare-cards | F7–9: técnicas, pistas y creación |
| Normalización de casa y tarjetas reconstruye campos | house-model/rare-card-model | F5–7: conservar información desconocida y versiones futuras |
| Cifras objetivo aún no alcanzadas | catálogo actual: 11/33/28 | F12: ampliar con evidencia; separar metas de entregas |

## Entrega 1 · Auditoría y experiencia coherente

Auditoría inicial y plan de catorce ramas; mapa de fricciones y criterios verificables. Main observado e351584 ya integra L7. Sin cambios de audio ni guardados.

Validación: npm run audit:release aprobado sin advertencias; npm test aprobado, 104 suites; navegador/audio no requeridos para documentación. Aceptación física y CI del PR, separados.

## Entrega 2 · Primer encuentro jugable

Bienvenida gráfica Explora/Escucha/Crea y símbolos locales del primer recorrido. Se conservan los seis gestos reales, omitir/repetir y progreso; controles iniciales blancos y silenciosos.

Validación: Auditoría y suites Node; first_level_smoke y ui_silence_smoke (resultados en registro de fase). Aceptación física y CI del PR, separados.

## Entrega 3 · Camino, entrada y Voz

Camino alterna discretamente figuras de luz por día con flujo independiente. Invitación mínima a entrar, respetando movimiento reducido. Voz conserva diario y restringe presencia a introducción, solicitudes y convergencias excepcionales.

Validación: Auditoría y Node completos; guide_smoke, messages_smoke y first_level_smoke; audio sin cambios. Aceptación física y CI del PR, separados.

## Entrega 4 · Llegadas y favoritos claros

Favoritos prioriza destinos con búsqueda, fichas compactas y códigos/opciones plegados. Una llegada nueva diaria conserva el punto anterior; continuar, direcciones explícitas y partidas de prueba respetan coordenadas. Guardar sigue a un toque.

Validación: Auditoría/Node completos y favorites_smoke, travel_v2_smoke, materia_smoke, favorite_save_failure_smoke. Aceptación física y CI del PR, separados.

## Entrega 5 · Casa viva y edición táctil

Casa con colocación anticipada, selección y arrastre directo de objetos; señales locales cuando suenan. Conserva Taller y visitas; versiones futuras quedan protegidas contra edición.

Validación: Auditoría/Node completos; house_v2_smoke y ui_silence_smoke; house_mix Web Audio. Aceptación física y CI del PR, separados.

## Entrega 6 · Tarjetas ganadas en encuentros

Las tarjetas explican su función musical y celebran el encuentro con señales locales contenidas. El atlas conserva campos desconocidos; libros futuros quedan de solo lectura. La UI no inicia audio.

Validación: Auditoría/Node completos; living-cards_smoke y rare_cards_smoke; audio sin cambios. Aceptación física y CI del PR, separados.

## Entrega 7 · Rareza y observaciones útiles

Reencuentros en condiciones diferentes enseñan interpretaciones reales: apagada, susurro, acento, deslizamiento o respirada. Elección silenciosa desde la tarjeta; sin duplicar premios ni descartar observaciones. Avisos repetidos del mismo tipo respetan un minuto de separación.

Validación: Auditoría/Node completos; living-cards_smoke y discovery_pacing_smoke; experience_learning_mix a 44.1/48 kHz. Aceptación física y CI del PR, separados.

## Entrega 8 · Atlas y expediciones sonoras

Atlas visual con búsquedas optativas de voces complementarias, pistas locales discretas y relaciones conservadas al interactuar con otro habitante real. Sin flechas, premios artificiales ni sonido de botones. Estudios culturales previos conservan su identificación como creaciones originales.

Validación: Auditoría/Node completos; living-cards_smoke y journal_v2_smoke; audio sin cambios. Aceptación física y CI del PR, separados.

## Entrega 9 · Coleccionar para crear

Hasta cuatro tarjetas forman voces físicas en casa: función e instrumento del encuentro, posición editable y hasta ocho jardines conservados. Las tarjetas no se consumen; visitas quedan separadas y se comparte el presupuesto de cuatro voces por paso.

Validación: Auditoría/Node completos; experience_garden_smoke y house_v2_smoke; experience_garden_mix y house_mix. Aceptación física y CI del PR, separados.
