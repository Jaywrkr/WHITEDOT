# Cuarta sesión · Simogo (simulación)

> Simulación de una lente de diseño basada en su obra pública: el juego como disco. No es su opinión real ni una evaluación hecha por esa persona.

Código **2.3.0-alpha.174**, revisión de juego **04ae8bdd**, desde main **676ac511**. Material compartido: [expediente](expediente.md), dieciséis capturas normales, sesenta estados de UI, modelo de dos horas, once renders y contratos. La puntuación es interpretativa. No representa jugar como una persona ni oír la mezcla en un teléfono.

## Notas

| Eje | Nota | Fundamento |
|---|---|---|
| Visual | 8,0 | Lectura de las capturas reales a 390×844; cubo pequeño como regla. |
| Audio | 7,5 | Continuidad del motor y contratos musicales; sin escucha física propia. |
| Creatividad | 8,5 | Identidad y posibilidades ya construidas; sin puntuar ideas futuras. |
| Sensación | 7,5 | Respuesta al pulso y sus límites de tiempo; tacto de navegador, no teléfono real. |
| Cohesión | 8,0 | Relación entre campaña, anillo, mundo, canción y recompensas. |
| Pulido | 7,5 | Recorridos locales, estado de CI y defectos reproducidos. |
| **Media** | **7,8** | Sesión anterior: 7,7. Comparación provisional con mayor cobertura. |

## Qué mejoró, comprobado

- I4 recoge las notas y pasos de los once lugares y reserva el tema para el final (`src/song-stage.js:68`, `src/song-stage.js:52`).
- Festival ya recorre los cinco capítulos y el final (`src/festival.js:6`). La campaña tiene un arco; el mundo abierto puede funcionar como la cara siguiente.

## Qué falta o salió mal

- **A01 · El cierre sigue usando un remate externo.** Añade un riser 300–7000 Hz, crash por encima de 5 kHz y tema agudo con lead propio por bioma. Jay rechaza cómo suena. Once renders no saturan (pico máximo 0,573), lo que no certifica gusto ni integración. Evidencia: `src/journey-victory.js:7`, `src/journey-victory.js:17`, `src/journey-victory.js:36`, `src/journey-victory.js:40`, `evidencia/cierres-audio.json`. Criterio de cierre en [seguimiento.json](seguimiento.json).

- **A03 · La quinta fija del final introduce alteraciones.** La segunda pasada del tema suma siete semitonos: en La menor la nota Si se convierte en Fa♯. No pasa por snapToScale al emitir ese chelo. Evidencia: `src/song-stage.js:52`, `evidencia/contratos.json`. Criterio de cierre en [seguimiento.json](seguimiento.json).

- **U01 · Tres sentidos distintos de Viaje.** El Viaje es la historia; Viaje en Tu cubo agrupa chispas/saltos; Viaje en el menú alterna densidad visual. El anillo y los favoritos también comparten Lugares. Evidencia: `index.html:97`, `src/journey-mode.js:20`, `src/journey-mode.js:27`, `capturas/ui-cubo-viaje.png`, `capturas/ui-menu-mas.png`. Criterio de cierre en [seguimiento.json](seguimiento.json).

- **U04 · 33 estrellas domina al objetivo de once lugares.** La hoja enfatiza ★ 5/33. Ganar requiere completar once lugares; 33 es la versión maestra. La distinción existe en el código pero no ocupa la jerarquía principal. Evidencia: `src/refugio-lugares.js:12`, `src/refugio-lugares.js:35`, `src/refugio-lugares.js:56`, `capturas/ui-lugares.png`. Criterio de cierre en [seguimiento.json](seguimiento.json).

## Qué haría ahora

1. J2: hacer un solo acontecimiento de ganar: acento del arreglo, capa reconocible y tarjeta en el momento correcto; comprobar las notas de la segunda pasada.

2. J3–J4: reservar El Viaje para la campaña, El anillo para los once retos y una etiqueta de vista para el interruptor de densidad.

3. J7: confirmar el paso del final al mundo abierto con personas antes de añadir más capítulos.

## Decisiones y límites

Se mantienen los umbrales 75/70 %, el cubo pequeño, la música base actual, los once lugares y el guardado compatible. Las acciones son propuestas para Jay: no están implementadas por este informe. Supabase sigue en pausa. Un panel simulado, una captura o un test verde no sustituyen la aceptación de Jay ni las sesiones con personas nuevas.
