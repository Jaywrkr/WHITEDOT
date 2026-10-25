# Cuarta sesión · Jenova Chen (simulación)

> Simulación de una lente de diseño basada en su obra pública: curva emocional y atención. No es su opinión real ni una evaluación hecha por esa persona.

Código **2.3.0-alpha.174**, revisión de juego **04ae8bdd**, desde main **676ac511**. Material compartido: [expediente](expediente.md), dieciséis capturas normales, sesenta estados de UI, modelo de dos horas, once renders y contratos. La puntuación es interpretativa. No representa jugar como una persona ni oír la mezcla en un teléfono.

## Notas

| Eje | Nota | Fundamento |
|---|---|---|
| Visual | 7,5 | Lectura de las capturas reales a 390×844; cubo pequeño como regla. |
| Audio | 8,0 | Continuidad del motor y contratos musicales; sin escucha física propia. |
| Creatividad | 8,0 | Identidad y posibilidades ya construidas; sin puntuar ideas futuras. |
| Sensación | 7,5 | Respuesta al pulso y sus límites de tiempo; tacto de navegador, no teléfono real. |
| Cohesión | 7,5 | Relación entre campaña, anillo, mundo, canción y recompensas. |
| Pulido | 7,0 | Recorridos locales, estado de CI y defectos reproducidos. |
| **Media** | **7,6** | Sesión anterior: 7,7. Comparación provisional con mayor cobertura. |

## Qué mejoró, comprobado

- El menú tiene seis destinos principales y Más plegado; el último plano tiene una pausa y un tema reservado (`index.html:146`, `src/song-stage.js:52`).
- El modelo ya distingue compras de crecimiento de la canción (`scripts/play-curve.mjs:5`). Sus limitaciones quedan a la vista, en lugar de usar las compras para aprobar la regla.

## Qué falta o salió mal

- **P01 · Tras ganar, el crecimiento por estrellas se estanca.** El modelo da 80,1 y 81,8 min sin capas nuevas para 60 % y sin sonido. No prueba música idéntica ni abandono real: las notas personales se actualizan al rejugar, y el mundo sigue variando. Evidencia: `scripts/play-curve.mjs:19`, `scripts/play-curve.mjs:33`, `src/places.js:94`, `evidencia/progresion.json`. Criterio de cierre en [seguimiento.json](seguimiento.json).

- **U03 · La guía aún dirige a metas anteriores.** La guía recomienda cuatro experiencias antiguas y la meta de Tu cubo, mientras el juego principal pide el capítulo actual o el siguiente del anillo. Evidencia: `index.html:211`, `index.html:215`, `src/voice-guide.js`, `capturas/ui-guia.png`. Criterio de cierre en [seguimiento.json](seguimiento.json).

- **U04 · 33 estrellas domina al objetivo de once lugares.** La hoja enfatiza ★ 5/33. Ganar requiere completar once lugares; 33 es la versión maestra. La distinción existe en el código pero no ocupa la jerarquía principal. Evidencia: `src/refugio-lugares.js:12`, `src/refugio-lugares.js:35`, `src/refugio-lugares.js:56`, `capturas/ui-lugares.png`. Criterio de cierre en [seguimiento.json](seguimiento.json).

- **V01 · Falta aceptación humana y del candidato publicado.** Hay feedback de Jay y pruebas automatizadas; no sesiones documentadas de nuevos jugadores ni validación instrumentada de estos cierres en teléfono. Esta revisión no verifica deploy, tiendas o cuenta en producción. Evidencia: `docs/PRUEBAS_CON_PERSONAS.md`, `HANDOFF.md`, `capturas/manifest.json`. Criterio de cierre en [seguimiento.json](seguimiento.json).

## Qué haría ahora

1. J4: una meta actual, visible en guía, resultado y Refugio, con una sola acción que lleve a ella.

2. J5: estudiar los 80,1/81,8 min sin capas nuevas del modelo. No llamarlos abandono medido: las frases y el mundo sí pueden variar.

3. J7: observar cinco personas. Separar la satisfacción de terminar de la decisión de seguir explorando; ajustar según lo que hagan.

## Decisiones y límites

Se mantienen los umbrales 75/70 %, el cubo pequeño, la música base actual, los once lugares y el guardado compatible. Las acciones son propuestas para Jay: no están implementadas por este informe. Supabase sigue en pausa. Un panel simulado, una captura o un test verde no sustituyen la aceptación de Jay ni las sesiones con personas nuevas.
