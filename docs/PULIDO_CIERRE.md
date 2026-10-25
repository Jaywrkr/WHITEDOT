# Cierre de la auditoría 4

Jay autoriza J1–J7 el 25 de octubre con una condición: conservar cómo se generan la música y los mundos. No se amplían catálogos ni se rediseña el juego. Las ramas se encadenan desde `audit/panel-4-cierre`; Jay crea PR y merge.

Se conservan semillas, RNG, mapas, distribución, criaturas, paleta, formas, composición de la radio, patrones, instrumentos, mezcla y umbrales. Las correcciones musicales se limitan al cierre de victoria y a notas incorrectas de las capas/final; no reprograman el motor generativo. Los cambios de UI corrigen nombres, recorrido y estado con el diseño existente.

| Fase | Rama | Estado |
|---|---|---|
| J1 · Base fiable | `pulido/j1-base-fiable` | Corregida y probada localmente |
| J2 · Cierre musical | `pulido/j2-cierre-musical` | Corregida; escucha de Jay pendiente |
| J3 · UI de producción | `pulido/j3-interfaz-produccion` | Corregida y probada localmente |
| J4 · Una meta | `pulido/j4-meta-compartida` | Corregida y probada localmente |
| J5 · Continuidad | `pulido/j5-continuidad` | Integrada; interés humano pendiente |
| J6 · Sincronía | `pulido/j6-sincronia` | Corregida; medición física pendiente |
| J7 · Comprobación final | `pulido/j7-cierre` | Técnica y CI aprobados; aceptación humana pendiente |

## J1

Premios, récord, notas, color, remezcla y estado previo del capítulo se guardan juntos. Si la escritura falla, se restauran los datos y la ronda admite un reintento sin duplicar premios. Los once objetos finales solo se cierran al confirmar esa operación. Los lectores de lugares futuros tienen una vista segura bloqueada y conservan el formato original.

Las anotaciones de GitHub permitieron identificar S01: `house_visit_smoke.py`, `cloud_account_smoke.py`, `blobs_smoke.py`. La visita comparaba contadores en dos tareas separadas; se captura la salida y sus logros en una misma tarea. La semilla comparaba contra bytes anteriores a la navegación, mientras el juego aún podía autoguardar; se comprueba el aislamiento contra los bytes exactos presentes al iniciar la vista previa. La cuenta publicaba runtime antes de terminar su reconciliación inicial; la prueba espera ese estado antes de modificar la partida simulada. No se desactivan aserciones ni se cambia Supabase.

Pruebas y aceptación de cada fase se anotan aquí. CI del candidato, teléfono físico y sesiones con personas se mantienen separados de las pruebas locales.

Validación J1: auditoría de release sin errores; 241 suites Node; `house_visit_smoke.py`, `blobs_smoke.py`, `cloud_account_smoke.py`, `places_smoke.py` y `journey_stick_smoke.py` aprobados en Chromium. Las tres primeras reproducen los flujos citados por las anotaciones del CI base; su comprobación completa en el candidato queda para J7. No se afirma CI verde ni prueba física.

Teléfono J1: completar un lugar, cerrar la tarjeta, recargar y comprobar estrellas/chispas; abrir otra vez y verificar el récord. Los fallos de almacenamiento se validan con fixtures, sin provocar pérdidas en una partida personal.

## J2 · Cierre dentro de la música

El cierre añade dos compases de la misma capa que el lugar aporta a Tu canción, sobre el acorde y reloj vivos. No crea riser, crash o lead independiente ni automatiza filtro, silencio global o volumen de la radio. Viajar, repetir y salir cancelan su salida propia; la tarjeta pendiente no reaparece sobre una ronda nueva.

Cristales toma la tercera o quinta del acorde en vez de restar tres semitonos fijos. La segunda pasada del tema final conserva su intención de quinta, ajustada a la escala vigente. Se mantienen todas las voces, ritmos y generadores de la base.

Validación: 242 suites Node y auditoría estática aprobadas. Armonía comprobada en los once biomas, doce transposiciones y siete grados; cierre vivo, once renders de victoria (pico máximo 0,179), capas de Tu canción (0,485) y final maestro (0,389) aprobados. La prueba offline compara la misma base con/sin cierre: idéntica antes y después, filtro y salida intactos. No certifica gusto musical.

Teléfono J2: completar un lugar, escuchar su entrada breve y repetir o salir mientras termina; la música base debe continuar. Abrir Tu canción y reconocer la capa. Falta la aceptación auditiva de Jay; no se cambian géneros ni territorios para lograrla.

## J3 · UI de producción

Una función por nombre: campaña Viaje, selector Vista completa/tranquila, pestaña Chispas y Mapa de regiones/favoritos. La práctica Laboratorio pasa a Escuchar y responder. Versión y fecha reales se conservan en Ajustes con el diagnóstico; no se inventa una fecha de despliegue. Los resultados esperan si ya hay otro panel abierto.

Validación: 242 suites Node, auditoría estática y recorridos `release_smoke.py`, `journey_entry_smoke.py`, `menu_v2_smoke.py` aprobados. Sesenta estados en cuatro tamaños con hostname normal: cero errores de página, desbordamientos, textos menores de 11 px o objetivos menores de 24 px en las superficies medidas. Menú inspeccionado visualmente a 390 px. No cambia ninguna hoja de estilo ni dibujo del mundo.

Teléfono J3: menú → Más → cambiar Vista; Tu cubo → Chispas; guía → Escuchar y responder; Ajustes → versión. Abrir el menú mientras termina una ronda: la tarjeta espera al cierre del menú. Los controles siguen silenciosos.

## J4 · Una meta compartida

`gameObjective` lee el Camino, el capítulo y el siguiente lugar sin escribir ni viajar. Guía y menú usan esa lectura; portales y resultado conservan su mismo orden de `nextOnPath`. La guía explica el objetivo actual y distingue sus cuatro experiencias opcionales. Se puede consultar durante el Viaje.

La hoja y el acceso del Refugio priorizan lugares completos /11. Las estrellas /33 siguen como maestría y las chispas siguen siendo moneda; no se cambian umbrales, precios, recompensas o puertas ganadas.

Validación: 243 suites Node, auditoría estática, `refugio_lugares_smoke.py`, `recorrido_smoke.py` (cuatro tamaños) y `journey_entry_smoke.py` aprobados. El contrato recorre los once siguientes destinos y comprueba que el saldo no cambia la meta. El diseño del mundo no se modifica.

Teléfono J4: consultar Guía, menú y Lugares en la misma partida; deben señalar el mismo destino. En Refugio se ve /11 y en Lugares se distingue la maestría /33. No hace falta comprar nada para completar lugares.

## J5 · Continuidad creativa

La ronda distingue si conservó una frase nueva o la misma. Desde Lugares → Tu canción, una partida con los once completos puede reproducir el final existente con sus notas actuales. Al llegar a los créditos, Otra vez repite esa misma versión; no paga premios ni modifica las marcas de victoria. No cambia el arreglo ni la síntesis del final.

El modelo conserva los huecos sin capas nuevas (80,1/81,8 min en 60 %/sin sonido); también informa de 25 interpretaciones completadas en esos perfiles. Eso no demuestra 25 melodías diferentes ni disfrute: el modelo no genera sus notas. Se retira la predicción textual de abandono, conservando `quitAt` por compatibilidad como inicio de un hueco estructural.

Validación: 243 suites, auditoría estática, `creative_continuity_smoke.py` y `places_smoke.py` aprobados. La prueba abre dos veces el final con frases guardadas diferentes y comprueba que no hay otra recompensa. Los renders de ese mismo arreglo están aprobados en J2; aquí solo cambia su acceso. Interés y comprensión con personas quedan pendientes.

Teléfono J5: después de ganar, tocar otra ronda, abrir Lugares → Tu canción y escuchar el final con la frase guardada. En los créditos, Otra vez. No es necesario ganar más estrellas ni comprar para volver a escucharlo.

## J6 · Sincronía

La nota mantiene exactamente su expresión anterior de tiempo; `pulseNoteTime` permite compartirla con la respuesta visual. El pulso confirma el instante emitido y el acento usa ese tiempo más la latencia de salida, sin recortarla a 250 ms. Hasta doce respuestas pendientes; reinicio, cambio de estado, pantalla oculta, panel abierto o callback excesivamente tardío evitan destellos fuera de contexto. Contacto inmediato y movimiento reducido se conservan.

Validación: 244 suites Node, auditoría estática, `player_touch_smoke.py` y `journey_pulse_smoke.py` aprobados. La prueba de reloj cubre salidas 0/50/180/400 ms, cancelación y equivalencia exacta de la programación sonora. `journey_mix.py` también aprueba dos mezclas reales en movimiento de 30 s (picos 0,873/0,883), con relevo de territorios, armonía y salida protegida. La medida de Bluetooth o altavoz físico sigue pendiente; se respeta la estimación del navegador, no se inventa una calibración real.

Teléfono J6: tocar a tiempo con altavoz y después con auriculares; comparar el acento con la nota. Abrir un panel o cambiar de capítulo mientras hay retraso: no debe llegar un destello de la escena anterior. No cambia ninguna nota, ritmo o figura.

## J7 · Comprobación del candidato

El catálogo inicial usa `99a3e525`, alpha.180. El candidato final alpha.181 añade las correcciones de J7, con regresiones enfocadas y 245 suites, desde las seis ramas anteriores. Las pruebas de esta fase se registran en la [quinta sesión](panel/sesion-5/informe.md). El guardián `scripts/pulido-preservation.mjs` compara los generadores, radio, estilos, assets y SVG con 04ae8bdd; también comprueba reglas puras de los once juegos y síntesis de las capas. Es una comprobación de preservación, no una medida de belleza musical.

Los renders afectados aprobados se reutilizan cuando su código no cambia; el catálogo de navegador se ejecuta una sola vez sobre el candidato, con las dos tareas que admite el runner. Se documenta cualquier fallo y su causa, sin retirar recorridos. No se declara CI remoto, despliegue, teléfono físico o aceptación humana por tener pruebas locales.

J7 cerró D03 (posición/parámetros tras entrada fallida), D04 (tarjeta al sustituir partida) y el reintento real de D01 conservando la referencia del objeto jugado al revertir. El cierre de victoria cuenta pasos del secuenciador incluso si cambia el tempo; no cambia el secuenciador. En el modelo las interpretaciones tampoco se suman a `novelties60`.

El lote inicial aprobó 186/188 recorridos; las dos expectativas de fixtures corregidas aprobaron en la repetición. Offline, los caminos afectados y la medición de 64 estados también aprobaron. Se reutilizan los demás resultados sin afirmar otro lote entero sobre alpha.181. Véase el registro completo de versiones y límites en la quinta sesión.

La regresión nueva `places_durability_smoke.py` también aprueba: fallo de escritura en el navegador, reintento del objeto real, un solo premio persistido y tarjeta visible invalidada tras sustituir S. No usa una partida personal.

Integración de toda la entrega en `main` autorizada por Jay: [PR #353](https://github.com/Jaywrkr/WHITEDOT/pull/353). [CI completo](https://github.com/Jaywrkr/WHITEDOT/actions/runs/40164328278) aprobado antes de integrar; no se añaden cambios de generación o arte.
