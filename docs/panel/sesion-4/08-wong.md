# Cuarta sesión · Ken Wong (simulación)

> Simulación de una lente de diseño basada en su obra pública: primeros minutos y legibilidad. No es su opinión real ni una evaluación hecha por esa persona.

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
| **Media** | **7,6** | Sesión anterior: 7,4. Comparación provisional con mayor cobertura. |

## Qué mejoró, comprobado

- Sesenta estados de interfaz en cuatro tamaños no producen errores de página ni desbordamientos en las superficies medidas (`evidencia/ui-medidas.json`).
- El mínimo visual del cubo con cara sigue siendo 10 px; el recorrido ve ojos, hábitos y accesorios. Esta lente acepta el cubo pequeño como regla, no propone aumentarlo.

## Qué falta o salió mal

- **U01 · Tres sentidos distintos de Viaje.** El Viaje es la historia; Viaje en Tu cubo agrupa chispas/saltos; Viaje en el menú alterna densidad visual. El anillo y los favoritos también comparten Lugares. Evidencia: `index.html:97`, `src/journey-mode.js:20`, `src/journey-mode.js:27`, `capturas/ui-cubo-viaje.png`, `capturas/ui-menu-mas.png`. Criterio de cierre en [seguimiento.json](seguimiento.json).

- **U02 · Terminología interna en rutas normales.** Laboratorio abre una práctica musical legítima, no el panel Prototipo. Puede llamarse Escuchar y responder. Alpha/build/fecha aparecen en el menú; deploy sin registrar es el fallback local no sellado, no un defecto probado de Vercel. Evidencia: `index.html:234`, `src/lab-learning.js:8`, `src/release-model.js:15`, `capturas/ui-guia.png`, `evidencia/ui-medidas.json`. Criterio de cierre en [seguimiento.json](seguimiento.json).

- **U03 · La guía aún dirige a metas anteriores.** La guía recomienda cuatro experiencias antiguas y la meta de Tu cubo, mientras el juego principal pide el capítulo actual o el siguiente del anillo. Evidencia: `index.html:211`, `index.html:215`, `src/voice-guide.js`, `capturas/ui-guia.png`. Criterio de cierre en [seguimiento.json](seguimiento.json).

- **U04 · 33 estrellas domina al objetivo de once lugares.** La hoja enfatiza ★ 5/33. Ganar requiere completar once lugares; 33 es la versión maestra. La distinción existe en el código pero no ocupa la jerarquía principal. Evidencia: `src/refugio-lugares.js:12`, `src/refugio-lugares.js:35`, `src/refugio-lugares.js:56`, `capturas/ui-lugares.png`. Criterio de cierre en [seguimiento.json](seguimiento.json).

- **V01 · Falta aceptación humana y del candidato publicado.** Hay feedback de Jay y pruebas automatizadas; no sesiones documentadas de nuevos jugadores ni validación instrumentada de estos cierres en teléfono. Esta revisión no verifica deploy, tiendas o cuenta en producción. Evidencia: `docs/PRUEBAS_CON_PERSONAS.md`, `HANDOFF.md`, `capturas/manifest.json`. Criterio de cierre en [seguimiento.json](seguimiento.json).

## Qué haría ahora

1. J3: una función por nombre y una jerarquía consistente entre las hojas; explicar acciones de música sin vocabulario de herramientas de desarrollo.

2. J4: la guía debe conocer capítulo, siguiente lugar y propósito de las estrellas; mostrar una sola acción inmediata.

3. J7: pedir a alguien nuevo que juegue sin ayuda. Las capturas y los bots no demuestran que la instrucción se entienda.

## Decisiones y límites

Se mantienen los umbrales 75/70 %, el cubo pequeño, la música base actual, los once lugares y el guardado compatible. Las acciones son propuestas para Jay: no están implementadas por este informe. Supabase sigue en pausa. Un panel simulado, una captura o un test verde no sustituyen la aceptación de Jay ni las sesiones con personas nuevas.
