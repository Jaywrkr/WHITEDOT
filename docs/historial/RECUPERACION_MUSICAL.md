> **ARCHIVO HISTÓRICO — NO VIGENTE.** Conserva el texto de otra revisión; no certifica el estado actual ni autoriza ejecutar fases, pendientes o instrucciones. Consultar [traspaso actual](../../HANDOFF_CLAUDE.md) e [índice vigente](../README.md).

# Recuperación del carácter musical

Petición de Jay: recuperar la música de hace unas 30 horas, mezclándola con los avances actuales. Entrega en `feat/juego-04-interpretacion`, desde `347e922`, versión `2.3.0-alpha.4`. Jay conserva PR y merge. La ampliación nueva de gestos de F4 queda pendiente; esta entrega atiende primero la recuperación solicitada.

## Referencia y diagnóstico comprobable

El corte usado es el **15 de octubre de 2026, 11:43 UTC**. `15bbe77` es el último commit de la línea principal anterior a ese instante: merge del 14 de octubre, 20:12 de Ecuador. Esto identifica el código disponible en main entonces; no identifica qué preview estaba escuchando Jay ni equivale a una grabación de aquella sesión.

Se compararon los archivos musicales de esa revisión con el main integrado y las tres fases actuales:

- La radio anterior elegía identidad, motivo, patrón de bajo e instrumento por región y sección. Su semilla de interpretación no dependía de la colocación de objetos.
- `06f5b8a`, posterior al corte, introdujo los arreglos del laboratorio. La ruta de producción posterior sustituyó los motivos, bajos y voces principales por los de esos arreglos.
- La dirección posterior también acortó articulaciones y aplicó techos de brillo de las bandas. Son cambios audibles de estructura y timbre; un género podía conservar su nombre y perder parte de su carácter anterior.
- Las fusiones, el reloj armónico, las técnicas instrumentales y la protección de mezcla son avances separados. No requieren sustituir aquella radio.

## Combinación implementada

`radio.js` conserva el marco regional original antes de aplicar la fusión. `labArrangement` recibe ese marco como núcleo: recupera su bajo, motivo activo, identidad, instrumento principal, swing y articulación. Recupera también la elección inicial de sección con la semilla anterior.

Los instrumentos avanzados añadidos después participan como acompañantes e interacciones; no alteran el sorteo de la voz principal antigua. `musical-recipes.js` separa esos invitados del conjunto sembrado de la radio. La familia visual y todos los instrumentos nuevos permanecen disponibles.

La composición actual aporta acordes, respuestas y secuencias complementarias. Las respuestas conservan el desarrollo regional de F3. Los territorios pueden mantener entre una y diez partes; una apertura antes silenciosa puede recibir el motivo actual cuando necesita sostener la base electrónica. Las frases activas originales se conservan. No es una restauración idéntica de todo el audio.

La percusión recupera la variación nativa cada cuatro compases y refuerza cuerpo de bombo, caja y hats dentro de los límites actuales. Se mantienen los cuatro cuerpos de caja regionales sin eco automático. Los gestos siguen el acorde y la rejilla audibles; el conductor admite el shuffle nativo de hasta 0,33 de semicorchea.

Se conservan las fusiones y su armonía común, los filtros, los miniinstrumentos, la expresividad de F2, la renovación armónica de sostenidos de F3, las transiciones y la salida protegida. No se repone el órgano continuo retirado por petición de Jay. No se modifican datos guardados, premios, coordenadas, UI ni generación.

## Evidencia y límites

`tests/music-reference-15bbe77.json` se capturó ejecutando el código real de `15bbe77` y sus dependencias, extraídos mediante `git archive` a un directorio temporal. Contiene nueve regiones nativas y 72 marcos en ocho momentos entre los compases 0 y 64. `music-recovery.mjs` compara motivos activos, bajos, instrumentos, identidades y secciones con esa referencia, y exige conservar los ensambles y el transporte acordado de duetos.

La validación de esta entrega se registra en `scripts/juego-04-validation.json`. Incluye auditoría, suites Node seleccionadas por impacto, un recorrido móvil de producción y seis mezclas renderizadas con interacciones, a 44,1/48 kHz. La suite completa queda para el cierre acordado; las métricas comprueban ejecución, niveles y tiempo, no belleza musical. La escucha en teléfono físico, CI y deploy no se atribuyen a estas pruebas locales.

## Probar en teléfono

Abre el Preview de esta rama y comprueba la versión `2.3.0-alpha.4`. Entra al Mundo y activa el sonido desde el lienzo. En **Estilos**, compara minimal techno, garage, afro, nu-disco, ambient y dub. Permanece un rato en cada destino y toca los elementos cercanos: la base mantiene su carácter mientras las voces nuevas la acompañan. Prueba también **Ensamble completo** y vuelve al lugar anterior. Los botones continúan siendo silenciosos.
