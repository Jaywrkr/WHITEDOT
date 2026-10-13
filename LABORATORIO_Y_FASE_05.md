# Laboratorio de pruebas + Fase 5 · Vida (rama `feat/laboratorio-y-fase-05`)

Entrega de Claude. Pendiente de merge por Jay. **Incluye la rama anterior `feat/phase-04-materia-y-compartir`** (se creó encima): basta con hacer merge de esta.

## Laboratorio (para mejorar cada elemento)
Un mundo de prueba aparte (semilla `laboratorio`): **no toca tu partida**.
- Entrar: Menú → Prototipo → **Laboratorio**, o abrir `/?lab=1&testSeed=laboratorio&layout=wide&generation=2`.
- Barra inferior: `‹ ›` recorre los 34 elementos y te pone frente a cada uno; muestra **qué probar**.
  - **Ponerme enfrente**: vuelve a colocarte frente al elemento.
  - **Solo**: calla la música del lugar (batería, pista y pad) para oír solo el elemento.
  - **Notas**: veredicto (Bien / Mejorar / Quitar), cinco preguntas iguales para todos (tocar rota ✓ → ✗ → sin marcar), texto libre y lista de todos con su estado.
- **Copiar informe** / **Descargar .md**: informe agrupado en Markdown para pegarlo en Claude/ChatGPT. Así cada mejora sale de una nota concreta.
- Las notas se guardan en este navegador (`whitedot-lab-v1`), no en la partida.
- Elementos: Materia (3), Instalaciones (vidrios, espejos, jardín modular, rastro), Vida (golondrinas, grullas, luciérnagas, ave lira, flora), Encuentros (10 familias), Juguetes (5), Fenómenos (3), Herramientas (FX, pulso, código de lugar, grabar set).
- Módulos: `src/lab-catalog.js` (puro), `src/lab.js`. Encuentros y rastro aceptan ahora una petición del laboratorio sin recargar (`runtime.labEncounter`, `runtime.labTrail`, `encounterReset`, `trailReset`).

## Fase 5 · Vida e intercambio musical (primer bloque)
Presencia con flujos de semilla propios (`vida:*:v1`): **no cambia catálogo, recetas ni lugares existentes**.
- **Bandadas** (~30 % de regiones de tierra): golondrinas (melodía), grullas (bajo), luciérnagas (groove) y **ave lira** (rara, ~5 % de bandadas).
  - Cantan su llamada y se contestan en canon. Cada cuánto depende de la **estación** del continente (primavera/verano cada 2 compases, otoño 4, invierno 8).
  - **Tocar un ave** = tu llamada (más arriba en la bandada, más aguda). Dos compases después **te la devuelven** con su voz y tu ritmo.
  - **Quieto cerca** ~3 s: ganan confianza, vienen a tu alrededor y cantan el doble de seguido.
  - **Entrar corriendo**: se dispersan con un aleteo descendente y pierden la confianza.
  - **Luciérnagas**: parpadean desordenadas; quieto cerca se **sincronizan** y sus destellos caen en un groove.
- **Flora que crece** (~28 % de regiones; tres matas en el Origen): crece mientras estás cerca y quieto (primavera ×1.6 … invierno ×0.35); tocarla la riega y suena su arpegio. Cada etapa suma una nota (1 → 5). **Decrece** una etapa cada 6 h sin visitas.
- Todo comparte el presupuesto ambiental de instalaciones: no se acumulan capas.
- Guardado mínimo: especies vistas y crecimiento de matas. Confianza, llamadas y posiciones son temporales.
- Logros: bandada1, bandadaAmiga, luciernagasSync (oculto), aveLira (oculto), flor1, jardinVivo (oculto). Voz para cada especie y la flora.
- Módulos: `src/vida-music.js` (puro), `src/vida.js` (runtime). En el Origen: bandada en 2800,1650 y matas en 540–760,1700–1860.

## Otros
- La ayuda de un juguete ya no se superpone a la de la materia.
- Los avisos (toast) suben cuando la barra del laboratorio está visible.

## Pruebas
- Node: `tests/lab.mjs`, `tests/vida.mjs` (55 suites PASS).
- Navegador: `tests/lab_smoke.py` (34 elementos localizados, Solo, notas persistentes, informe, salir a tu partida), `tests/vida_smoke.py` (móvil y escritorio).
- Suite completa `npm run test:browser`: 33/35 en paralelo. `encounter_depth_smoke` y `wonders_smoke` fallaron por tiempos bajo carga y **pasan al correrlos solos** (móvil y escritorio); vigilar si se repite.
- `tests/offline_smoke.py`: cobertura de módulos en caché OK; la aserción final falla igual en `main` limpio en este contenedor (no es de esta rama).

## Pendiente de la fase 5
- Escuchar en teléfono que las bandadas no saturen con instalaciones cerca.
- Criaturas con instrumentos propios que viajan entre regiones; agrupaciones mixtas; flora que reaccione a la música del lugar (no solo a tu presencia); fenómenos que conduzcan partes.
