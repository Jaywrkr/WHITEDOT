# Quinta sesión · integración conservando el juego

**Candidato alpha.181 · desde 99a3e525 · comparación con 04ae8bdd.** Rama `pulido/j7-cierre`, encadenada desde J6. [Expediente](expediente.md) y [detalle por fase](../../PULIDO_CIERRE.md).

La corrección conserva el universo y su música base. Se solucionan contratos de progreso, cierre, interfaz y sincronía; no se amplían contenidos ni se reescriben los generadores.

## Reevaluación provisional

| Lente simulada | Media |
|---|---|
| Mizuguchi | 8,3 |
| Iwai | 8,0 |
| Matsuura | 8,2 |
| Simogo | 8,2 |
| Proteus | 8,1 |
| Chen | 7,9 |
| Roset | 8,2 |
| Wong | 7,9 |
| Pope | 8,0 |
| Wintory | 8,1 |
| **Global** | **8,1** |
| Anterior | 7,7 |

Las 60 notas y medias sin redondear están en [notas.json](evidencia/notas.json). Es un juicio provisional de diseño por **un agente con diez lentes**, no un panel humano independiente ni certificación. La música base y el arte no reciben puntos por contenido añadido: se preservan. La mejora evalúa integración y correcciones.

No se declara alcanzada la meta orientativa 8,7 ni un 10. Los siguientes pasos dependen de comprobar el candidato y de la escucha/comprensión humanas; no se inventan funciones para subir la nota.

## Contraste de los hallazgos

| ID | Resultado técnico | Qué queda |
|---|---|---|
| K01 | Cubo pequeño mantenido | Aceptación física de Jay |
| S01 | Recorridos corregidos y CI completo de integración aprobado | Sin bloqueo técnico de CI |
| D01 | Ronda durable y reintentable en once lugares, sin doble pago | Contraste de la experiencia de recuperación |
| D02 | Lectura futura segura, datos originales intactos | Candidato y aceptación |
| A01 | Capa ganada con acorde/reloj vivos, salida propia cancelable, radio intacta | Escucha de Jay |
| A02 | Cristales toma notas del acorde | Escucha integrada |
| A03 | Quinta del final ajustada a su escala | Escucha integrada |
| U01 | Viaje, Vista, Chispas y Mapa distinguidos | Comprensión con personas |
| U02 | Herramientas de desarrollo ocultas en origen normal; diagnóstico en Ajustes | Despliegue real |
| U03 | Guía y menú leen el objetivo actual | Primera partida sin ayuda |
| U04 | Once lugares, 33 estrellas y moneda separados | Comprensión de progreso y economía |
| P01 | El final vuelve a oír tus notas actuales; modelo distingue interpretaciones/capas | Interés real; no se oculta la meseta de estrellas |
| T01 | Feedback ligado a emisión y salida 0–400 ms, callbacks protegidos | Medición física |
| D03 | Entrada fallida conserva posición y parámetros previos | Contraste de recuperación en teléfono |
| D04 | Sustituir S invalida tarjeta anterior, visible o pendiente | Contraste de recuperación en teléfono |
| V01 | No se sustituye por simulación | Cinco sesiones, teléfono, escucha y candidato publicado |

La regresión de D01 con el controlador real también detectó una referencia de objeto que impedía reintentar el cierre; J7 conserva esa referencia al revertir. El cierre cuenta pasos vivos aun al variar el tempo, sin tocar el secuenciador.

J7 detectó dos límites adicionales del mismo circuito de guardado (D03–D04). Se corrigen dentro del cierre, sin abrir otra expansión. La auditoría original tuvo 14 IDs; el registro actual conserva esos y añade dos.

El [registro canónico](../sesion-4/seguimiento.json) conserva la evidencia original y añade resolución, fase, pruebas y límites. Un estado «corregido técnico» no declara aceptación humana.

## Verificación

- **245 suites Node** y auditoría de release aprobadas en alpha.181 (312 módulos, 500 IDs, 333 assets; cero errores/avisos).
- **Catálogo inicial completo sobre alpha.180: 186/188**; salida 1 por dos fixtures: el nombre anterior «Lugares» y un hostname local que pasaba por proxy. La primera exige ahora «Mapa»; la segunda usa origen local seguro normal y sin proxy, con respuesta 200 comprobada. Ambas se repitieron y aprobaron en alpha.181.
- El wrapper no llegó a offline al fallar ese lote; **offline se ejecutó aparte y aprobó** en alpha.181, con los 312 módulos en caché. Los 189 recorridos originales quedan cubiertos entre lote, repeticiones y offline; además aprueba la nueva regresión de durabilidad (190 distintos en total). No se presenta como un segundo catálogo completo sobre alpha.181.
- Tras D03/D04 y el ajuste de rollback de D01 se repitieron **places, journey_stick, cloud_account y victory_live**. `places_durability_smoke.py` también provoca un fallo real de escritura mediante la API del navegador, reintenta el objeto dorado, comprueba una única recompensa durable y cierra la tarjeta tras sustituir S. Todos aprobaron. Las aserciones siguen activas; la prueba del portal comprueba continuidad del secuenciador, mientras la del cierre comprueba que no toca filtro/salida.
- **Once renders actuales de victoria aprobados** (pico 0,179), y reloj variable que cuenta dos compases reales. Capas/canción, final maestro y dos mezclas reales de movimiento reutilizan sus renders J2/J6: no cambió su síntesis/arreglo.
- **64 estados de UI** en cuatro tamaños, incluido resultado con frase y cuatro botones: cero errores de página, desbordamientos, textos visibles menores de 11 px u objetivos menores de 24 px en las muestras. [Guía](capturas/guia.png), [Lugares](capturas/lugares.png), [resultado](capturas/resultado.png), [metadatos](capturas/manifest.json).

[Registro de comandos, versiones y límites](evidencia/verificacion.json). La comparación de arte/generadores sigue aprobada después de las correcciones. El CI remoto de integración se verificó después: [resultado completo](https://github.com/Jaywrkr/WHITEDOT/actions/runs/40164328278). Despliegue efectivo y aceptación humana se comprueban por separado.

Los renders afectados se ejecutaron en J2/J6 y se reutilizan porque no cambió su síntesis/arreglo después. No se ejecutan suites pesadas de audio y navegador simultáneamente ni se desactivan comprobaciones. No se afirma que la escucha sea profesional por un pico o un test.

## Preservación exigida por Jay

[Guardia reproducible](../../../scripts/pulido-preservation.mjs): **305 archivos protegidos idénticos**, arte SVG de la interfaz idéntico y reglas puras de los once juegos intactas. El listado de 26 módulos revisados es explícito; en ellos cambian integración, palabras, persistencia, respuesta visual y el cierre localizado.

- `src/audio.js`, voces, síntesis principal, patrones y datos musicales: sin cambios.
- Generadores, semillas, mapas, población y biomas: sin cambios.
- Render principal, estilos, geometrías y assets: sin cambios.
- Tu canción: mismo arreglo e instrumentos; dos correcciones de afinación y acceso al final ya existente.
- Tiempo del pulso sonoro: la misma expresión, extraída para que el acento pueda seguirla.

## Cierre y siguiente acción

Entrega integrada en `main` por autorización expresa de Jay; las tareas futuras mantienen su flujo de PR y merge. Probar en teléfono antes de publicar: ganar un lugar, recargar, comparar premios, oír su cierre y volver a Tu canción; consultar guía/Lugares; probar altavoz y auriculares. Anotar aceptación o un caso concreto, sin rehacer la base musical.

La publicación se mantiene pendiente de V01; los checks completos de integración están aprobados. Supabase sigue en pausa. No se abre otra expansión ni una cadena indefinida de fases por una nota simulada: si aparece una regresión, se enlaza al ID, se corrige y se comprueba ese contrato.

## Integración en main

[PR #353](https://github.com/Jaywrkr/WHITEDOT/pull/353) · [CI completo](https://github.com/Jaywrkr/WHITEDOT/actions/runs/40164328278): lógica, seis grupos de navegador, tres de audio y agregador aprobados sobre `6be023df`. El runtime es el mismo de `e6c0a3a6`; solo se actualizan documentación y registros de CI. [Evidencia](evidencia/ci-integracion.json). Esto cierra S01 y mantiene V01/P01 como aceptación humana pendiente.
