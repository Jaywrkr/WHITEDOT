# Cuarta sesión · Ed Key y David Kanaga (simulación)

> Simulación de una lente de diseño basada en su obra pública: un mundo que suena al recorrerlo. No es su opinión real ni una evaluación hecha por esa persona.

Código **2.3.0-alpha.174**, revisión de juego **04ae8bdd**, desde main **676ac511**. Material compartido: [expediente](expediente.md), dieciséis capturas normales, sesenta estados de UI, modelo de dos horas, once renders y contratos. La puntuación es interpretativa. No representa jugar como una persona ni oír la mezcla en un teléfono.

## Notas

| Eje | Nota | Fundamento |
|---|---|---|
| Visual | 8,0 | Lectura de las capturas reales a 390×844; cubo pequeño como regla. |
| Audio | 8,0 | Continuidad del motor y contratos musicales; sin escucha física propia. |
| Creatividad | 8,5 | Identidad y posibilidades ya construidas; sin puntuar ideas futuras. |
| Sensación | 7,5 | Respuesta al pulso y sus límites de tiempo; tacto de navegador, no teléfono real. |
| Cohesión | 7,5 | Relación entre campaña, anillo, mundo, canción y recompensas. |
| Pulido | 7,5 | Recorridos locales, estado de CI y defectos reproducidos. |
| **Media** | **7,8** | Sesión anterior: 7,3. Comparación provisional con mayor cobertura. |

## Qué mejoró, comprobado

- La chispa salvaje y los portales tienen dirección y cercanía sonora (`src/wild.js`, `src/places-ring.js:66`, `src/spatial.js`).
- Las dieciséis capturas mantienen un fondo negro y distinguen las geometrías de Lago, Dunas, Cristales y Faros. El cubo vuelve a ser una presencia pequeña en el paisaje.

## Qué falta o salió mal

- **A01 · El cierre sigue usando un remate externo.** Añade un riser 300–7000 Hz, crash por encima de 5 kHz y tema agudo con lead propio por bioma. Jay rechaza cómo suena. Once renders no saturan (pico máximo 0,573), lo que no certifica gusto ni integración. Evidencia: `src/journey-victory.js:7`, `src/journey-victory.js:17`, `src/journey-victory.js:36`, `src/journey-victory.js:40`, `evidencia/cierres-audio.json`. Criterio de cierre en [seguimiento.json](seguimiento.json).

- **U01 · Tres sentidos distintos de Viaje.** El Viaje es la historia; Viaje en Tu cubo agrupa chispas/saltos; Viaje en el menú alterna densidad visual. El anillo y los favoritos también comparten Lugares. Evidencia: `index.html:97`, `src/journey-mode.js:20`, `src/journey-mode.js:27`, `capturas/ui-cubo-viaje.png`, `capturas/ui-menu-mas.png`. Criterio de cierre en [seguimiento.json](seguimiento.json).

- **P01 · Tras ganar, el crecimiento por estrellas se estanca.** El modelo da 80,1 y 81,8 min sin capas nuevas para 60 % y sin sonido. No prueba música idéntica ni abandono real: las notas personales se actualizan al rejugar, y el mundo sigue variando. Evidencia: `scripts/play-curve.mjs:19`, `scripts/play-curve.mjs:33`, `src/places.js:94`, `evidencia/progresion.json`. Criterio de cierre en [seguimiento.json](seguimiento.json).

## Qué haría ahora

1. J2: la celebración debe pertenecer al lugar y a su arreglo; no convertir todos los mundos en el mismo drop.

2. J3: el interruptor de pantalla tranquila no debe llamarse como la campaña.

3. J5: reconocer el final de la campaña y el valor de explorar por sí mismo. El modelo de estrellas no mide la variación de la radio ni el interés por un paisaje.

## Decisiones y límites

Se mantienen los umbrales 75/70 %, el cubo pequeño, la música base actual, los once lugares y el guardado compatible. Las acciones son propuestas para Jay: no están implementadas por este informe. Supabase sigue en pausa. Un panel simulado, una captura o un test verde no sustituyen la aceptación de Jay ni las sesiones con personas nuevas.
