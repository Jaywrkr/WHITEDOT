# Cuarta sesión · Toshio Iwai (simulación)

> Simulación de una lente de diseño basada en su obra pública: la música como juguete. No es su opinión real ni una evaluación hecha por esa persona.

Código **2.3.0-alpha.174**, revisión de juego **04ae8bdd**, desde main **676ac511**. Material compartido: [expediente](expediente.md), dieciséis capturas normales, sesenta estados de UI, modelo de dos horas, once renders y contratos. La puntuación es interpretativa. No representa jugar como una persona ni oír la mezcla en un teléfono.

## Notas

| Eje | Nota | Fundamento |
|---|---|---|
| Visual | 7,5 | Lectura de las capturas reales a 390×844; cubo pequeño como regla. |
| Audio | 7,5 | Continuidad del motor y contratos musicales; sin escucha física propia. |
| Creatividad | 8,5 | Identidad y posibilidades ya construidas; sin puntuar ideas futuras. |
| Sensación | 8,0 | Respuesta al pulso y sus límites de tiempo; tacto de navegador, no teléfono real. |
| Cohesión | 7,5 | Relación entre campaña, anillo, mundo, canción y recompensas. |
| Pulido | 7,5 | Recorridos locales, estado de CI y defectos reproducidos. |
| **Media** | **7,8** | Sesión anterior: 7,4. Comparación provisional con mayor cobertura. |

## Qué mejoró, comprobado

- Refugio, trofeos y Tu canción ya comparten capas sobre el acorde del Mundo (`src/song-stage.js:64`, `src/refugio-lugares.js:47`).
- El llamado Laboratorio de la guía es una práctica auténtica de escuchar y contestar; no es el Prototipo de desarrollo (`src/lab-learning.js:8`, `src/lab-learning.js:23`). Conservar esa interacción es mejor que borrarla por su nombre.

## Qué falta o salió mal

- **A01 · El cierre sigue usando un remate externo.** Añade un riser 300–7000 Hz, crash por encima de 5 kHz y tema agudo con lead propio por bioma. Jay rechaza cómo suena. Once renders no saturan (pico máximo 0,573), lo que no certifica gusto ni integración. Evidencia: `src/journey-victory.js:7`, `src/journey-victory.js:17`, `src/journey-victory.js:36`, `src/journey-victory.js:40`, `evidencia/cierres-audio.json`. Criterio de cierre en [seguimiento.json](seguimiento.json).

- **A02 · La capa de Cristales puede salir de escala.** La resta fija de tres semitonos genera MIDI 73 (Do♯) sobre La menor/La-Do-Mi. También se reproduce sobre un acorde menor dentro de la escala mayor de Prisma. La usan cierre y canción. Evidencia: `src/song.js:28`, `src/journey-victory.js:48`, `src/song-stage.js:44`, `evidencia/contratos.json`. Criterio de cierre en [seguimiento.json](seguimiento.json).

- **P01 · Tras ganar, el crecimiento por estrellas se estanca.** El modelo da 80,1 y 81,8 min sin capas nuevas para 60 % y sin sonido. No prueba música idéntica ni abandono real: las notas personales se actualizan al rejugar, y el mundo sigue variando. Evidencia: `scripts/play-curve.mjs:19`, `scripts/play-curve.mjs:33`, `src/places.js:94`, `evidencia/progresion.json`. Criterio de cierre en [seguimiento.json](seguimiento.json).

- **U02 · Terminología interna en rutas normales.** Laboratorio abre una práctica musical legítima, no el panel Prototipo. Puede llamarse Escuchar y responder. Alpha/build/fecha aparecen en el menú; deploy sin registrar es el fallback local no sellado, no un defecto probado de Vercel. Evidencia: `index.html:234`, `src/lab-learning.js:8`, `src/release-model.js:15`, `capturas/ui-guia.png`, `evidencia/ui-medidas.json`. Criterio de cierre en [seguimiento.json](seguimiento.json).

## Qué haría ahora

1. J2: conectar el cierre con el instrumento existente y comprobar la capa de Cristales en acordes menores.

2. J3: llamar Escuchar y responder a la práctica; conservar su silencio al abrir y sus sonidos únicamente al jugar.

3. J5: hacer perceptible que tus frases cambian al rejugar y dejar claros los usos creativos de lo ya ganado. No inventar otra moneda o catálogo.

## Decisiones y límites

Se mantienen los umbrales 75/70 %, el cubo pequeño, la música base actual, los once lugares y el guardado compatible. Las acciones son propuestas para Jay: no están implementadas por este informe. Supabase sigue en pausa. Un panel simulado, una captura o un test verde no sustituyen la aceptación de Jay ni las sesiones con personas nuevas.
