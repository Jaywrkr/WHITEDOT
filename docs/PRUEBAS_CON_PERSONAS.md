# Pruebas con personas

Fase 7 del plan del Viaje ([El Viaje](VIAJE.md)): ver jugar a personas que no conocen Kubono y comparar lo que pasa con lo diseñado. Estado: herramienta lista desde alpha.136; **hay feedback real de Jay; faltan cinco sesiones instrumentadas sin ayuda**.

## Qué se prueba

Los primeros 15 minutos (Camino, Llanura y Lago), el arco cerrado de la decisión 2B. Preguntas:

1. ¿Entienden sin palabras que hay que tocar a tiempo?
2. ¿Dónde se quedan quietos sin saber qué hacer?
3. ¿Cuánto dura cada capítulo de verdad?
4. ¿Quieren seguir al terminar?

## Preparación

- Un teléfono con sonido y auriculares o altavoz. Batería cargada.
- Abrir una vez `…/?festival=1&prueba=1`. El festival juega sin cuenta, con su propio guardado, y no toca la partida de nadie. `prueba=1` queda encendido en ese teléfono.
- Cinco personas, de una en una. Que al menos dos no jueguen videojuegos.

Para probar un capítulo suelto: `…/?capitulo=tormenta` (sin cuenta, con guardado propio; cada carga empieza de nuevo).

## Durante la sesión

1. Decir solo: «Es un juego de música. Juega como quieras; yo no puedo ayudarte. Dime en voz alta lo que piensas».
2. No ayudar, no señalar, no explicar. Si alguien pide ayuda: «¿Qué crees tú?».
3. Anotar en papel el minuto y lo que dice cuando se ríe, se frustra, se sorprende o pregunta.
4. A los 20 minutos, o si quiere dejarlo, se termina.
5. «Otra persona», en el Refugio, empieza de cero para la siguiente.

## Después: cinco preguntas

1. ¿Qué había que hacer?
2. ¿Qué momento recuerdas?
3. ¿En qué momento no sabías qué hacer?
4. Del 1 al 10: ¿cuánto quieres seguir jugando?
5. Del 1 al 10: lo visual, el sonido, lo original, cómo se siente al tocar, si todo encaja y si se ve terminado (los seis criterios del panel).

## Las notas del teléfono

- `…/?prueba=ver` muestra una nota por persona y una línea por capítulo: tiempo, ✓ si lo cumplió, pulsos a tiempo, el rato más largo sin tocar y cuántas veces apareció el dedo fantasma.
- **Copiar** y enviarlas junto con las notas en papel y las respuestas.
- **Borrar notas** pide dos toques. `…/?prueba=0` apaga las notas.
- Cada vez que se abre el juego cuenta como una persona nueva; recargar a mitad parte una sesión en dos.

## Privacidad

Las notas se quedan en ese teléfono (`kubono:prueba` en el almacenamiento local), separadas de la partida. No se envían a ningún sitio ni guardan nombres, posición o lo que se dice. No anotar nombres en el papel: «Persona 1, 2…».

## Qué haremos con los resultados

Comparar la duración real con la estimada (15–18 min), los momentos de quietud con los lugares donde hace falta guía, y las notas del 1 al 10 con las metas del panel. Los cambios se proponen a Jay antes de hacerse.

## Aceptación de las fases L

Además del Camino, observar el Jardín sin dar instrucciones externas. Registrar si reconoce el círculo, siembra, riega y logra su primera flor; si abre la guía interna, anotarlo sin impedirlo. Comprobar que guardar/editar un lugar se comprende, que cada ronda conserva su frase y que sabe regresar al juego desde los finales.

Escuchar final5 y final11 en altavoz y auriculares, sin confundir claridad técnica con gusto musical. Registrar rechazo o aceptación, con el momento concreto. Para el anillo: observar rumbo, distancia, primera llegada y siguiente puerta, sin saltos pagados. No contar un bot o una fixture como una de las cinco personas.

La plantilla de [ENTREGA_L.md](ENTREGA_L.md) separa aprobación humana, pruebas locales, CI y preview. No publicar una puntuación humana ni declarar cierre de producción antes de estas comprobaciones.


## Candidato N · objetivo excepcional

Primera tanda: cinco personas nuevas, al menos dos que no suelen jugar. Observar la primera acción sin ayuda externa, después permitir la guía interna y registrar su uso. Metas propuestas para el piloto: cuatro de cinco reconocen el gesto inicial en60s, la siguiente regla en90s y su aportación en el cierre. No son resultados ni estimaciones de toda la población.

Con `?prueba=1`, las rondas de los once lugares se distinguen de la campaña. Las notas locales incluyen primer avance, tiempo activo, mayor periodo sin avance y ayudas abiertas. Menús y tarjetas en inspección no suman tiempo activo. El tiempo sin progreso no demuestra aburrimiento; contrastarlo con lo que dice la persona. No recoge nombres, coordenadas, audio ni respuestas. Repetir un lugar agrega su tiempo dentro de esa sesión; para comparar intentos individuales, abrir una sesión nueva.

Segunda tanda independiente:8–12 personas tras corregir lo observado. Valorar comprensión, reconocimiento de la frase, deseo de continuar, orientación sin salto y las seis categorías. Escucha con altavoz/auriculares y al menos una ruta Bluetooth. El candidato también requiere teléfono físico de gama media, Safari móvil y lector real. La evaluación ciega posterior no recibe la nota objetivo; se informa tal como resulte.

La duración de Bosque y la relación entre campaña, colección y casa quedan pendientes de estas observaciones. No se reducen metas ni se fuerza visitar el Refugio para aparentar una mejora.


## Candidato E · objetivo diez

Registro listo en [aceptacion-e.json](aceptacion-e.json). **No contiene participantes ni respuestas reales.** La versión/digest deben corresponder al candidato probado; [preservación](../scripts/verify-e-preservation.mjs) calcula el identificador reproducible. No introducir nombres, correos, coordenadas ni grabaciones. Las observaciones se quedan locales hasta que Jay decida compartirlas.

1. Cinco personas nuevas: P1–P5, al menos dos no jugadores. Registrar éxito, atasco o abandono tal como ocurra. La primera tanda sirve para encontrar problemas; puede pertenecer a un candidato anterior identificado.
2. Tras corregir lo observado, ocho a doce personas distintas: P6–P13 como mínimo. Esta confirmación sí debe corresponder al digest actual. No contar recargas, bots ni varias sesiones de una persona como personas nuevas.
3. Observar objetivo, primera acción, primera flor en Jardín, siguiente lugar y reconocimiento de su frase. Anotar uso de guía interna y ayuda externa por separado. Criterio propuesto:80% de confirmación completa cada tarea sin ayuda externa y quiere continuar. Los abandonos/no observados no se sustituyen por éxitos.
4. Pedir las seis valoraciones sin mostrar las notas del panel. Para la meta diez, el registro exige ocho respuestas válidas por eje y mediana declarada10; incluso eso **no certifica diez**, autenticidad ni representatividad estadística. Registrar también qué rechazaron y por qué.
5. Android de gama media, Safari iOS, altavoz, auriculares, Bluetooth y lector: cada comprobación necesita evidencia y digest. Probar ocultar/volver, bloquear, llamada, rotación y pérdida de conexión conservando la partida.

Usar una instalación/perfil temporal para nuevos jugadores, nunca borrar la partida personal. Festival aísla el inicio; `?lugar=jardin&prueba=1` y `?anillo=1&prueba=1` aíslan tareas concretas. Las aperturas generan registros distintos de la herramienta: reunirlas bajo la misma persona Pn en la observación manual. Un recorrido por atajo no demuestra haber completado el viaje continuo.

Copiar `sessionTemplate` a la tanda correspondiente **solo después de observar**: marcar `observed:true`, conservar el digest y referenciar las notas reales. `externalHelp` y cada resultado deben reflejar lo ocurrido; `null` queda sin observar. El script no convierte esas declaraciones en una comprobación independiente.

```sh
node scripts/acceptance-gate.mjs docs/aceptacion-e.json
node scripts/acceptance-gate.mjs docs/aceptacion-e.json --require-ready
```

El primer comando informa. El segundo termina con código2 si quedan criterios pendientes. No cambia la partida, no manda datos y no publica nada. CI completo del candidato también debe aprobarse antes de integrar; un catálogo anterior o las regresiones enfocadas no rellenan `browserFull`, `audioFull` o `ci` por sí solos.
