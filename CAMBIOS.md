# Cambios recientes de Kubono

Estado: 23 de octubre de 2026. Código **2.3.0-alpha.143**. Las entradas describen su revisión, no certifican producción.

## F1 · Ritmo de los niveles · alpha.143

Rama `claude/f1-ritmo`, sobre `claude/f0-viaje-juegos` (dependencia explícita). Jay tardó 8 min en la Llanura, menos de 1 en el Lago y el Bosque, 3 en la Tormenta, y el Vacío le pareció demasiado rápido. Meta: 2:30–3:00 por capítulo.

- **Llanura:** meta 60 (antes 120); más cosas cerca (más de 8 celdas de 10) y más piedras y cometas.
- **Lago:** meta 340 (antes 100); los racimos, más separados.
- **Bosque:** meta 240 (antes 100); cada luciérnaga vale como mucho 3.
- **Tormenta:** meta 250 (antes 100); el primer círculo aparece junto al cubo, para aprender la regla de inmediato.
- **Vacío:** solo se suelta en el «1» del compás; cuatro puntos bajo el cubo cuentan el compás y el primero, dorado, es el «1». Cada estrella pide su cielo, a 100 px de las demás: hay que moverse para dibujar la constelación. Sin sonido vale cualquier pulso.
- **Medida:** un jugador simulado (150 px/s, 80 % de aciertos), calibrado con los tiempos de Jay, estima 2:20–2:55 por capítulo. Es una estimación: la confirman la prueba de Jay y las notas de `?prueba=1`.
- Los juegos reciben el paso del compás de cada pulso.

## F0 · El Viaje por juegos en `main` · alpha.142

Rama `claude/f0-viaje-juegos`, desde `main` (alpha.141, con los cinco capítulos integrados en las PR #315–#319). Primera fase del plan aprobado en [El mundo](docs/MUNDO.md).

- **[El mundo](docs/MUNDO.md):** el plan completo, F0–F16, con chispas para comprar y estrellas para avanzar y ganar.
- **`?capitulo=`** (`llanura`, `lago`, `bosque`, `tormenta`, `vacio`): abre el Viaje directamente en ese capítulo, sin cuenta y con su propio guardado; cada carga empieza el capítulo de nuevo.
- **El festival** juega el Lago nuevo: termina al abrir la flor dorada.
- Cada juego vuelve a leer su estado si el guardado lo reemplaza.
- **Bosque:** la estela dura 8 s (antes 5): una vuelta a paso normal tarda unos 4,6 s y en un teléfono lento no llegaba a cerrarse.
- El saludo de regreso ya no reabre la bienvenida del Camino si ya se dio por vista (`?capitulo=` la dejaba encima del capítulo).
- Pruebas: `tests/chapter_test_smoke.py`; `tests/festival_smoke.py` usa el Lago nuevo.

## Viaje por juegos · Vacío «Suelta» · alpha.141

Rama `claude/viaje-vacio`, sobre `claude/viaje-tormenta` (alpha.140, dependencia explícita). Con ella el Viaje entero se juega con la regla de Jay: solo a tiempo pasa algo.

- **Vacío · soltar:** el cubo llega cargando lo que se le pegó en la Llanura (entre 12 y 24 cosas) y algo más grande. Cada pulso a tiempo suelta una: sube, se vuelve estrella donde estás y, un compás después, canta tu nota una octava arriba. Las estrellas se unen en una constelación. El cubo vuelve a su tamaño.
- **Tu luz dorada** llega junto al cubo al soltarlo todo; un pulso a tiempo abre el camino al Refugio.
- En este Vacío las criaturas no repiten tus notas: lo hacen tus estrellas.
- Las pistas de cada capítulo se descartan si ya no estás en él cuando les toca salir.
- Pruebas: `tests/journey-release.mjs` y `tests/journey_release_smoke.py`.

## Viaje por juegos · Tormenta «Baila» · alpha.140

Rama `claude/viaje-tormenta`, sobre `claude/viaje-bosque` (alpha.139, dependencia explícita).

- **Tormenta · bailar:** la tormenta marca un círculo cerca del cubo y su rayo cae en un compás y medio (un arco alrededor cuenta el tiempo). Dentro del círculo y a tiempo devuelves el rayo al cielo: 10, 15 y 20 puntos seguidos. El rayo que no devuelves cae blanco y la racha empieza de nuevo. Meta: 100. A tiempo fuera del círculo, o fuera de tiempo dentro, no pasa nada.
- La tormenta solo descarga en los círculos; los rayos sueltos de antes se callan en este capítulo.
- **El ojo de la tormenta** llega junto al cubo con la barra llena y se cierra con un pulso a tiempo.
- Pruebas: `tests/journey-dance.mjs` y `tests/journey_dance_smoke.py`.

## Viaje por juegos · Bosque «Rodea» · alpha.139

Rama `claude/viaje-bosque`, sobre `claude/viaje-lago` (alpha.138, dependencia explícita).

- **Bosque · rodear:** el cubo deja una estela de luz de 5 s. Al dar una vuelta alrededor de un grupo de luciérnagas la estela se cierra: el interior se ilumina con el beat y las luciérnagas de dentro se marcan. Un pulso a tiempo las atrapa todas; cada una vale tantas como se atraparon juntas (hasta 5). Meta: 100. Fuera de tiempo no pasa nada.
- La vuelta cerrada se mantiene 1,5 s, para poder levantar el dedo y tocar.
- **La criatura del Bosque** llega junto al cubo con la barra llena; un pulso a tiempo la hace tu compañera para el resto del Viaje.
- Pruebas: `tests/journey-lasso.mjs` y `tests/journey_lasso_smoke.py`.

## Viaje por juegos · Lago «Encadena» · alpha.138

Rama `claude/viaje-lago`, sobre `claude/viaje-pegate` (alpha.137, dependencia explícita). Arco aprobado por Jay el 23 de octubre: cada capítulo conserva la regla «solo a tiempo pasa algo», llena la barra y termina con algo dorado que cierra un pulso a tiempo; cada uno añade un verbo.

- **Lago · encadenar:** las flores crecen en racimos de 3 a 7, en línea. Un pulso a tiempo lanza una onda desde el cubo; cada flor que alcanza se enciende, suena un tono más arriba y pasa la onda a la siguiente. La enésima flor de una cadena vale n (hasta 5), así que las cadenas largas llenan más. Meta: 100. Fuera de tiempo no pasa nada.
- **La flor dorada** llega junto al cubo con la barra llena y se abre con un pulso a tiempo.
- Sin lotos en este Lago. `?clasico=1` (o `?faro=1`) conserva los capítulos anteriores para comparar.
- Los juegos de capítulo comparten un registro (`journey-games.js`); el «Pégate» se pasó a él.
- Pruebas: `tests/journey-chain.mjs` y `tests/journey_chain_smoke.py`; el festival se prueba con `?clasico=1`.

## «Pégate» tras la prueba de Jay · alpha.137

Rama `claude/viaje-pegate`, con `main` (alpha.136) integrado. Decisiones de Jay del 23 de octubre:

- **Sin monedas en el Viaje:** las chispas quedan para el Mundo libre. Los cristales del Camino dan luz pero no chispas, y los cristales del Mundo no aparecen mientras viajas.
- **Solo a tiempo pasa algo:** fuera de tiempo nada se mueve ni desaparece; solo tiembla el cubo. A tiempo, lo cercano se pega.
- **Todo se pega y llena según su tamaño:** motas (1), cruces (3), rombos (8) y cometas (20); las pequeñas abundan, las grandes escasean. La barra pide 120 y cada cosa pegada lanza una gota dorada hacia ella.
- **Se ve qué atrapar:** lo que se pega late con el beat y tiene halo; lo que está al alcance brilla más y tiembla. El resto del lugar se atenúa.
- **La nube dorada llega sola:** con la barra llena aparece junto al cubo y lo sigue; se traga con un pulso a tiempo.

## Fase 7 · Pruebas con personas · alpha.136

Rama `claude/fase7-personas`, desde `main` (alpha.134). El número alpha.135 lo usa el prototipo «Pégate», en su rama.

- **Notas de las pruebas:** `?prueba=1` las enciende en ese teléfono. Por persona y capítulo anotan el tiempo, si lo cumplió, los pulsos a tiempo, el rato más largo sin tocar y el dedo fantasma. El juego no cambia y nada se envía.
- `?prueba=ver` las muestra para copiarlas; borrar pide dos toques; `?prueba=0` las apaga. Viven en `kubono:prueba`, fuera de la partida.
- **Guía de las sesiones:** [Pruebas con personas](docs/PRUEBAS_CON_PERSONAS.md), con el festival (`?festival=1&prueba=1`), qué decir, qué no hacer y cinco preguntas.
- Pruebas: `tests/playtest.mjs` y `tests/playtest_smoke.py`.

## Prototipo «Pégate» en la Llanura · alpha.135

Rama `claude/viaje-pegate`, sobre `claude/fase6-experiencia` (alpha.134, dependencia explícita). Prototipo para que Jay y Luca lo prueben; no se integra en `main` sin su visto bueno.

- **La Llanura sin faro:** el cubo empieza diminuto. Un pulso a tiempo junto a algo pequeño lo pega al cubo y suena; fuera de tiempo, rebota con un «boing».
- **Crecer:** solo se pega lo que mide hasta la mitad del cubo; tres aciertos seguidos atraen tres cosas. El cubo se dibuja más grande, la barra de arriba se llena y la música sube con él.
- **El gigante:** una nube de polvo te empuja mientras eres pequeño. Al tamaño completo se vuelve dorada; tragarla cumple la Llanura y abre el portal al Lago.
- **Dos pistas breves:** «Toca a tiempo cerca de algo: se pega.» al llegar, y «Ya eres grande: trágate la nube dorada.» al llegar al tamaño completo.
- **Comparar:** `?faro=1` conserva la Llanura anterior con el faro.
- Pruebas: `tests/journey-stick.mjs` y `tests/journey_stick_smoke.py`; las pruebas del faro abren con `?faro=1`.

## Fase 6 · Experiencia completa · alpha.134

Rama `claude/fase6-experiencia`, sobre `claude/fase5-llave` (alpha.133, dependencia explícita). Recorrido como jugador nuevo en un teléfono, de abrir el juego al Mundo libre.

- **Empezar de cero** (Ajustes): dos toques empiezan una partida nueva y guardan la actual; «Volver a la partida anterior» la recupera. Con una cuenta abierta no se ofrece, para que la nube no tome la partida vacía como la más nueva.
- **El Viaje callado desde el principio:** sin saludo al abrir, el menú sin chispas, y sin el atajo de lugares ni el paseo automático mientras viajas. Ajustes muestra solo lo que sirve en el Viaje.
- **El primer toque no regala:** antes del primer beat un pulso no cuenta como a tiempo; solo con el sonido apagado cuenta cualquier pulso.
- **Del final al Mundo libre:** al salir del Refugio, los contadores y botones aparecen poco a poco y el menú lleva un punto dorado hasta abrirlo.
- **Guardado:** los compases de cada capítulo se guardan cada 8; salir y volver no pierde la estancia.
- **Qué hacer en cada capítulo** (Jay no sabía qué hacer al entrar al Mundo):
  - la barra de arriba, la misma del Camino, se llena con el capítulo: la mitad con su momento y la mitad con los compases tocando; dorada cuando el capítulo se cumple;
  - una luz en el borde señala el faro o el loto más cercano a los 3 s de llegar, mientras estén fuera de la pantalla. Sin palabras;
  - el faro sin alcanzar llama: haz largo que barre la pantalla y un anillo que se abre en cada beat (antes casi no se veía: halo al 10 % y haz al 4 %);
  - la barra de arriba se ve también en el Mundo durante el Viaje (antes la ocultaba el modo Mundo).
- **Para qué sirven las chispas:** al pasar al Mundo libre, «Tu cubo» lleva un punto dorado y un aviso dice «Tus ✦ cambian tu cubo: Menú → Tu cubo.», una sola vez.
- Pendiente: al terminar el Viaje llegan juntos varios avisos (Mundo libre, color nuevo, logros); conviene ordenarlos tras las pruebas con personas.
- Verificación local: 214 suites Node, nuevas `start_over_smoke.py` y `start-over.mjs`, y recorridos del Viaje, final, festival, interfaz, coherencia, paseo automático y sin conexión en PASS.

## Fase 5 · El tema como llave · alpha.133

Rama `claude/fase5-llave`, sobre `main` (alpha.132). Jay aprobó esta idea de la Fase 5; las otras (pregunta y respuesta, rejugar el Viaje, clip del viaje) esperan a las pruebas con personas.

- **El universo reconoce el tema:** en el Mundo libre, completar el tema a tiempo junto a un hito hace que el hito toque su motivo y luego el tema contigo. En un superbioma raro, el lugar lo contesta una quinta arriba.
- **Llaves en la Bitácora:** cada una se guarda una vez, con su día; en Lugares aparecen como «Llaves · n».
- Solo en el Mundo libre: durante el Viaje, el tema es de los capítulos.
- **Camino más claro** (lo notó Jay en iPhone): un pulso fuera de tiempo llega al cristal y lo hace temblar sin romperlo, y los cristales brillan en cada beat. Antes no pasaba nada y parecían rotos.
- **La Línea dice la verdad** (también de Jay): el pico de un acierto se dibuja en el beat que acertaste, sobre su marca; antes salía donde estaba el cursor un instante después del toque y parecía fuera de tiempo.
- **Dedo fantasma más discreto:** no aparece mientras el dedo camina (antes solo contaba el toque inicial y aparecía al caminar más de 4 s), y después de 3 aciertos espera 20 s sin tocar.
- Verificación local: 213 suites Node, auditoría sin errores, `theme_key_smoke.py` nueva y recorridos del pulso, capítulos, coherencia y sin conexión, más las mezclas `exploration_mix.py` y `journey_mix.py`, en PASS.
- Medida de Jay en iPhone (Camino, calidad alta): p50 17 ms y p95 17 ms, 60 imágenes por segundo estables. Falta medir el Mundo.

## Fase 4 · Rendimiento real · alpha.132

Rama `claude/fase4-rendimiento`, sobre `claude/fase3-coherencia` (alpha.131, dependencia explícita).

- **La calidad ligera aligera de verdad:** antes solo bajaba la resolución y las partículas; ahora las capas del universo dibujan la mitad de sus puntos y la vida de píxeles solo las 12 criaturas más cercanas. Medido en el navegador de pruebas: de 4185 a 2256 puntos por fotograma (54 %).
- **Medir en tu teléfono:** abre el juego con `?medir=1` y una esquina muestra la mediana y el percentil 95 del tiempo de fotograma, la calidad y la densidad de píxeles. No se envía nada.
- Verificación local: 212 suites Node, auditoría sin errores y recorridos del universo, calidad, visibilidad, interfaz y el general en PASS.
- Pendiente (necesita tu teléfono): medir en tu iPhone y en un Android la fluidez, la batería y el audio con llamadas o al bloquear. Con esos datos se decide si simplificar más el dibujo.

## Fase 3 · Coherencia · alpha.131

Rama `claude/fase3-coherencia`, sobre `claude/fase2-viaje` (alpha.130, dependencia explícita).

- **Sin restos terrestres, de verdad:** golondrinas, grullas, luciérnagas, el ave lira, bandadas, ríos y jardines pasan a Meteoros de eco, Planetas graves, Estrellas de pulso, el Quásar imitador, enjambres, corrientes y campos. Los ids no cambian. La prueba revisa ahora todas las cadenas, no una lista fija.
- **La racha deja de castigar** (5A): el Mundo crece con los días que vuelves y no encoge si faltas. Se ven «Días», no «Racha». Fuera las frases de disciplina; la tarjeta para compartir muestra los lugares escuchados. `streak` y `best` se conservan.
- **Superbiomas completables:** el contador es n/104; el que nunca aparece solo cuenta si lo oyes.
- **Momentos raros:** suenan con dos notas suaves del acorde y se listan en la Bitácora.
- **Lectura:** ningún texto por debajo de 11 px; en el teléfono los avisos ya no tapan «Próximo salto»; el botón de modo se lee en dos líneas y Mundo y «Viajar a otra semilla» tienen iconos distintos.
- **Sin sonido:** con el sonido apagado cada pulso cuenta como a tiempo, así el Viaje se puede completar sin oírlo.
- Queda: «Tierra de Origen» no se renombró, porque forma parte de la huella fija del mapa.
- Verificación local: 211 suites Node, auditoría sin errores, catálogo de navegador 161/163 y luego los 2 fallos corregidos en PASS (`mobile_smoke.py`: la burbuja de voz se queda arriba; `house_visit_smoke.py`: arreglo del Refugio de la Fase 2), nueva `coherence_smoke.py`, y las mezclas `exploration_mix.py` y `universe_mischief_mix.py` en PASS.

## Fase 2 · El Viaje con tiempo · alpha.130

Rama `claude/fase2-viaje`, sobre `claude/fase1-pulso` (alpha.129, dependencia explícita).

El Viaje duraba lo que tardabas en acertar seis veces por capítulo. Ahora cada capítulo se vive (decisión 2B: 15–20 minutos).

- **Capítulos con momento y tiempo:** la Plenitud pide el momento del capítulo (faro, 3 lotos, paseo con la criatura, 4 rayos tuyos, el eco del Vacío) y un mínimo de compases tocando (48–64). Estimación: 15–18 minutos en total, por medir con personas.
- **Portal tras el tema:** se abre cuando el tema termina de sonar en tutti, no encima.
- **Tema desde el principio:** cada capítulo empieza el tema por su primera nota.
- **Camino a tiempo:** en el Viaje solo un pulso a tiempo rompe cristal, y uno por pulso.
- **Mi rayo:** en la Tormenta tus rayos caen dorados junto al cubo y la tormenta deja de lanzar los suyos.
- **El final toca tu ritmo:** se guarda cuándo sonó cada nota; las partidas viejas suenan en negras.
- **Silencio real:** durante el final callan la música del Mundo y los objetos del Refugio.
- **Sin avisos en el Viaje:** los cotidianos esperan (la nube se ofrece en el Mundo libre); los problemas se muestran.
- **Mundo libre cerrado hasta el final** (6A). Quien ya lo tenía lo conserva.
- **Dedo fantasma** (7A): tras 4 s sin tocar, enseña a arrastrar y tocar en el beat. Sin palabras.
- **Arreglo:** un capítulo cumplido antes de recargar vuelve a abrir su portal (antes quedaba sin salida).
- **Arreglo:** «Trofeos nuevos» en el menú ya no reaparece por un logro que llegó mientras estabas dentro del Refugio: al salir también cuenta como visto (la CI lo detectaba de forma intermitente en `house_visit_smoke.py`).
- **Sin sonido:** en el Camino, si no suena música (sonido apagado o audio sin arrancar), cualquier pulso rompe un cristal, uno por pulso.
- Pendiente: medir la duración con personas; escucha de Jay en iPhone. Los capítulos del Mundo seguían necesitando música para acertar: resuelto en la Fase 3.
- Verificación local: 210 suites Node, auditoría sin errores, 24 recorridos de navegador (Viaje, festival, final, toque real, cristales, guía, sin conexión y los que juegan sin marca de automatización) y la mezcla del ambiente del Refugio en PASS. La duración no se midió: el jugador simulado de `journey-curve.py` no vive los momentos.

## Fase 1 · El pulso justo · alpha.129

Rama `claude/fase1-pulso`, sobre `claude/fase0-base` (alpha.128, dependencia explícita).

El pulso a tiempo es el verbo del juego; la auditoría encontró que era injusto y que no sonaba a tema.

- **Se juzga al tocar:** el acierto cuenta cuando el dedo toca, no cuando se levanta (antes el táctil iba siempre tarde frente al teclado).
- **Descuenta los auriculares:** el juicio y el cursor de la Línea restan la latencia de salida del dispositivo (Bluetooth incluido).
- **Un solo margen:** ±80 ms para el Viaje, los rituales de portal, los retos y el groove (antes ±60 y ±90).
- **El tema suena:** cada acierto toca al instante la nota exacta del tema con un instrumento melódico del lugar, y luego su tercera y su quinta. Antes la nota se movía con el acorde y en más de la mitad de las regiones el pulso era percusión o acordes. En el Camino el acierto ya suena distinto del fallo.
- **Ningún toque se pierde:** un toque cuenta hasta 450 ms (antes 240) y un pulso demasiado seguido deja una marca gris en la Línea.
- **iPhone:** sin vibración, el cubo brilla en dorado durante un tiempo.
- **Arreglo posterior:** un pulso a tiempo en el Mundo dejó de llegar a lo que escucha el pulso (laboratorio, looper, seres vivos, mascota): sonaba el tema y nada más. Ahora lo oyen igual, sin sonido propio (`hearVoice`). La CI lo detectaba de forma intermitente en `lab_learning_smoke.py`.
- **Dedo quieto y luego caminar:** si el dedo descansa y abre el escáner, al moverlo el escáner se cierra y el cubo camina (antes no se movía).
- Pendiente: escucha y prueba de Jay en iPhone con auriculares; medir la latencia real en dispositivos.
- Verificación local: 209 suites Node, 11 recorridos de navegador y 3 mezclas de audio en PASS. `guide_smoke.py` falló una vez esperando el Mundo tras recargar y pasó en las dos repeticiones con el mismo código: queda anotado como recorrido inestable.

## Fase 0 · Base protegida · alpha.128

Rama `claude/fase0-base`, sobre `main` (alpha.127). Primera fase del plan de la auditoría del 22 de octubre; no cambia lo que se siente al jugar.

- **El juego no se congela:** si un fotograma falla, el siguiente llega igual y el error queda en el registro. Antes, una sola excepción dejaba la imagen fija para siempre (medido: 0 fotogramas después del error).
- **CI repartida:** la prueba de navegador corre en cuatro grupos con un trabajador cada uno y 30 minutos de límite, en Node 22. Se quitan disparadores de ramas que ya no existen y el workflow «Focused browser closure».
- **Movimiento reducido de verdad:** seis sistemas (momentos raros, cartas raras, forma del pulso de la tienda, ramas de encuentros, cajas y caminantes) solo miraban un ajuste que nada asigna; ahora siguen también la preferencia del sistema (`calmMotion`).
- **Dueto retirado:** `connection.js`, `duet-model.js` y sus pruebas salen del juego y de la descarga.
- **Una prueba que juega como una persona:** `player_touch_smoke.py` recorre el Camino con toques reales en un teléfono y entra al Mundo, y comprueba que un fotograma fallido no congela el juego.
- **Prueba sin conexión al día:** `offline_smoke.py` esperaba la hoja de cuenta obligatoria y fallaba desde alpha.98 (en CI no llegaba a correr porque el catálogo de navegador fallaba antes). Ahora comprueba que, sin red, el juego arranca desde la caché sin pedir cuenta.
- **Documentación al día:** traspaso nuevo (el anterior, de alpha.66, va al historial), README, arquitectura, plan y créditos dicen lo mismo: cuenta opcional.
- **Pendiente:** el resultado de la CI se lee en el PR; ninguna integración debe hacerse con ella en rojo.

## Pendientes revisados · alpha.127

Rama `claude/pendientes`, sobre `claude/super-viaje` (alpha.126).

Jay pidió revisar los cuatro pendientes después de todo lo implementado y arreglarlos.

- **Sin restos terrestres:**
  - las criaturas son Cometa resonante, Asteroide lento y Sombra del vacío (antes ciervo, tortuga y ballena), además de Satélite reloj, Prisma andante y Chispa del eco;
  - las plantas y construcciones tienen nombres del universo;
  - los hitos se ven desde arriba: Estrella guía, Nebulosa madre, Cúmulo de formas, Monolito y Baliza.
- **La onda del pulso:** de los objetos que responden a una misma onda, solo uno grave suena; así muchos graves juntos ya no retumban.
- **Fase 12 (firmas musicales):** se sustituye; las familias, la fusión y los bordes ya dan la identidad, y la medida de géneros no cambió.
- **El Viaje:** los capítulos buscan su superbioma mucho más lejos. En el mundo principal todos llegan: Polvo · House, Marea · Downtempo, Cúmulo · Disco, Tormenta solar · Techno y Vacío · Ambient.
- Ids, guardados, mapa y música de cada lugar no cambian.

## Superbiomas: el Viaje · alpha.126

Rama `claude/super-viaje`, sobre `claude/super-coleccion` (alpha.125). Fase 18 de [El universo](docs/UNIVERSO.md), la última de superbiomas.

Cada capítulo del Viaje va a un superbioma que encaja con lo que siente, sin cambiar el mapa:

- **Polvo · House:** curiosidad.
- **Marea:** calma, con Downtempo, Dub o Ambient.
- **Cúmulo · Disco:** compañía.
- **Tormenta solar:** tensión, con Techno, Electro, Breaks o Dub.
- **Vacío · Ambient:** el cubo solo.
- **Si no hay uno cerca:** el capítulo va al lugar más cercano de su región, como antes.
- En los seis mundos medidos, Polvo, Cúmulo y Vacío casi siempre llegan a su superbioma; Marea y Tormenta solar solo cuando el mapa lo tiene cerca.

## Superbiomas: la colección · alpha.125

Rama `claude/super-coleccion`, sobre `claude/super-bordes` (alpha.124). Fase 17 de [El universo](docs/UNIVERSO.md).

- **Mapa de superbiomas en la Bitácora:** en la pestaña de lugares hay una cuadrícula con las regiones en filas y las familias en columnas. El Abismo solo tiene Ambient.
- **Oído en dorado:** cada superbioma oído sale con su día; los que faltan salen en contorno y dicen si son raros, muy raros o si no aparecen.
- **Constelaciones:** las que uniste aparecen con su figura.
- Los guardados con datos raros o futuros no rompen la Bitácora.

## Superbiomas: los bordes · alpha.124

Rama `claude/super-bordes`, sobre `claude/super-fusion` (alpha.123). Fase 16 de [El universo](docs/UNIVERSO.md).

- **Sigue a la música de verdad:** el movimiento de las capas usa la familia que está sonando, no la del suelo bajo el cubo, así que cambia cuando cambia la música.
- **En el compás:** al pasar de un superbioma a otro, el cambio espera al primer tiempo del compás y se mezcla durante un compás entero.
- **Sin cambios a medias:** si vuelves antes del primer tiempo, no cambia nada.

## Superbiomas: la fusión · alpha.123

Rama `claude/super-fusion`, sobre `claude/super-mapa` (alpha.122). Fase 15 de [El universo](docs/UNIVERSO.md).

Lo que se ve sigue a la música: cada región conserva su forma y su color, pero se mueve como la familia que suena en ella.

- **Ambient:** casi quieto.
- **Dub:** lento, con eco.
- **House:** late con el bombo.
- **Techno:** rápido y en líneas rectas.
- **Drum & bass:** corre a ráfagas.
- **Disco:** gira un poco.
- **Las demás:** Downtempo, Breaks, Electro y Tribal tienen también su propio movimiento.
- Con movimiento reducido no hay giro, eco ni saltos. Mapa, música y progreso no cambian.

## Superbiomas: el reparto · alpha.122

Rama `claude/super-mapa`, sobre `main` (alpha.121). Fase 14 de [El universo](docs/UNIVERSO.md).

Jay eligió no tocar el mapa: los superbiomas quedan donde ya estaban y los que salen poco son raros.

- **Censo de seis mundos:** 70 superbiomas comunes, 31 raros, 3 muy raros (Drum & bass en Polvo, Cúmulo y Anillos) y 1 que no aparece (Restos · Drum & bass).
- **Se ve al entrar:** el aviso marca los raros, por ejemplo «Marea · Dub (raro)».
- El mapa, la música y el progreso no cambian; la tabla sale de `scripts/superbiome-census.mjs` y la prueba repite el censo.

## Superbiomas: el modelo · alpha.121

Rama `claude/super-modelo`, sobre `main` (alpha.120). Fase 13 de [El universo](docs/UNIVERSO.md).

- **Diez familias** agrupan los 52 géneros (Ambient, Downtempo, Dub, House, Techno, Breaks, Drum & bass, Electro, Tribal y Disco).
- **Un superbioma es una región más una familia:** «Marea · Dub», «Púlsares · Techno». Valen las diez regiones de los continentes con cualquier familia y el Abismo solo con Ambient: 105 en total.
- **Se ven y se guardan:** el aviso al entrar a una región empieza por su superbioma, y el primer día que oyes cada uno queda guardado para la colección.
- El mapa, la música y el progreso no cambian.

## CI de navegador estable · sin versión

Rama `claude/ci-navegador`, sobre `main` (alpha.120). Solo pruebas; el juego no cambia.

En GitHub fallaban dos recorridos que en local pasan, por tiempos de una máquina lenta:

- `first_level_smoke.py` leía el texto del primer paso una sola vez; ahora espera a que diga «cristales».
- `world_visibility_smoke.py` contaba las huellas antes de abrir el menú, y en ese intervalo podía caducar o sumarse una; ahora cuenta con el menú ya abierto y comprueba que no cambien.

## El acento del pulso a tiempo · alpha.120

Rama `claude/pulso-acento`, sobre `main` (alpha.119).

Sin el chelo, Jay no notaba diferencia entre un pulso a tiempo y uno fuera de tiempo. Ahora el pulso a tiempo responde con un arpegio corto en la voz del lugar: su nota, la tercera y la quinta, en la rejilla del ritmo y un poco más fuerte. Suena al bioma y al género en que estás; el pulso fuera de tiempo no cambia.

## El ambiente bajo la música · alpha.119

Rama `claude/ambiente-leve`, sobre `claude/pulso-tiempo`.

Jay pidió que el ruido propio de algunos biomas sea leve: es un juego para hacer música y el ambiente debe acompañarla, como fondo.

- **A la mitad:** el aire de cada región, la lluvia, el viento y los insectos pasan por un solo nivel de ambiente, unos 6 dB más bajo que antes.
- **Respira con el compás:** el ambiente baja un poco en cada pulso y vuelve antes del siguiente, así se mueve con la música en vez de sonar plano.
- **En la tonalidad:** las bandas estrechas del aire y el canto de los insectos se afinan a la nota más cercana de la escala que suena.
- Los mapas, la música y el progreso no cambian.

## El pulso a tiempo · alpha.118

Rama `claude/pulso-tiempo`, sobre `main` (alpha.117).

Jay encontró el sonido que molestaba en el iPhone con auriculares: aparecía al pulsar **a tiempo**, cuando la marca de la Línea se vuelve dorada. Era el chelo sintetizado del tema (una sierra grave con vibrato), que sonaba como una bocina o una silla arrastrándose.

- **Sin sintetizador aparte:** el pulso a tiempo toca la siguiente nota del tema con su propia voz, el instrumento del lugar.
- **El tema en la Plenitud, el final y el acompañante:** el mismo chelo pero suave, triángulo y seno sin diente de sierra.
- **Se deshace alpha.117:** el pulso vuelve a la voz de la región, como antes; se retiran la campana del cubo y el cambio de registro de las voces compradas.
- La marca dorada, el destello, la vibración y la frase de seis aciertos no cambian.

## Universo · Sin restos terrestres · alpha.116

Rama `claude/universo-limpieza`, sobre `claude/universo-raros`.

Lo que todavía se veía de perfil o terrestre ahora se ve desde arriba, como parte del universo. Nada cambia de sitio, de sonido ni de forma de tocarse:

- **Hierba y árboles de luz:** motas y pequeñas estrellas que giran con el viento, sin tallos.
- **Pilares de Restos:** fragmentos de órbitas (anillos rotos) en vez de columnas.
- **Plantas y flores:** formas radiales: motas, estrellas de cuatro puntas, racimos, espirales, anillos y cristales. Las de la vida del mundo (helechos, ramas, juncos, cactus, setas, flores) también salen de un centro.
- **Plantas que se riegan:** esporas que abren un rayo por etapa.
- **Bandadas de pájaros y murciélagos:** enjambres de luces, sin alas.
- **Lluvia inclinada:** polvo estelar que cae sobre el plano, destella y deja un anillo pequeño.
- **Textos:** especies, nombres de muestras, logros y frases dicen motas, estrellas fijas, ondas, enjambres, fragmentos, esporas y púlsares en vez de luciérnagas, árboles, agua, bandadas, pilares, flores y faros.
- **Pruebas:** nueva `universe-cleanup.mjs` (cada planta se dibuja centrada en su sitio; ningún nombre de vida terrestre); `anatomy.mjs` sigue comprobando que cada individuo es distinto.
- **Pendiente:** algunas criaturas siguen siendo de la Tierra (ciervo, tortuga, ballena) y los hitos «Árbol madre» y «Ciudad de formas».

## Universo · Fase 6 · Momentos raros · alpha.115

Rama `claude/universo-raros`, sobre `claude/universo-nuevas`.

Cada región tiene un momento raro que llega de vez en cuando (más o menos cada 48 compases en la misma región) y dura unos segundos:

- **Polvo:** un remolino. **Cúmulo:** un racimo que te rodea. **Marea:** todas las fuentes laten juntas.
- **Restos:** la órbita se cierra. **Esporas:** floración en cadena. **Anillos:** pasa la sombra de un planeta.
- **Prisma:** un arcoíris desde el cubo. **Púlsares:** dos haces se cruzan y destellan. **Tormenta solar:** una eyección cruza la pantalla.
- **Pozo:** el espacio se dobla. **Aurora:** cambia de color. **Cometas:** lluvia de cometas. **Constelaciones:** una figura grande en el cielo. **Nebulosa oscura:** una estrella nace.
- **Vacío:** nada; esa es su firma.
- Cuándo llega sale de un hash del lugar y del compás, no del azar antiguo. Cada momento visto se cuenta en la partida (`S.universe.rare`) para la colección. Con movimiento reducido se cuenta pero no se dibuja.
- **Pruebas:** nuevas `universe-rare.mjs` y `universe_rare_smoke.py` (móvil y computadora).

## Universo · Fase 5 · Regiones nuevas · alpha.114

Rama `claude/universo-nuevas`, sobre `claude/universo-resto`.

Cuatro regiones nuevas llenan parte del Abismo de silencio, el espacio entre continentes que antes era todo igual. El mapa, los continentes y la música de cada lugar no cambian; en el Viaje no aparecen, para que el Vacío siga solo.

- **Aurora:** cortinas de luz que ondulan con la música y se abren al pasar, en verde agua y magenta.
- **Cometas:** cometas con cabeza y cola que cruzan en diagonal, estelas lejanas y polvo de hielo.
- **Constelaciones:** grupos de estrellas que laten; si completas el tema allí, se unen con líneas doradas para siempre.
- **Nebulosa oscura:** nubes negras de borde rojo; dentro solo se ve lo que ilumina el cubo.
- **Reparto:** unas 4 de cada 10 regiones del Abismo, elegidas por un hash de la región; el resto sigue siendo Vacío.
- **Aviso y sonido:** el aviso de lugar dice su nombre; cada una tiene su aire, muy por debajo de la música.
- **Pruebas:** nuevas `universe-regions.mjs` y `universe_regions_smoke.py` (móvil y computadora).

## Universo · Fase 4 · El resto de regiones · alpha.113

Rama `claude/universo-resto`, sobre `claude/musica-resto`.

- **Restos:** órbitas enteras a lo lejos, arcos rotos que giran muy lento y fragmentos que se apartan del cubo. Es la única región que no late.
- **Esporas:** semillas que respiran; si te quedas quieto, las cercanas se abren en estrellas de cuatro puntas que laten.
- **Anillos:** el anillo de un planeta visto desde arriba: bandas curvas que se deslizan y piedritas que viajan por ellas y cambian de banda en el beat.
- **Prisma:** una malla cristalina; un nodo se enciende en cada beat y tu pulso la recorre hacia afuera.
- **Púlsares:** destellos lejanos con su propio ritmo y púlsares con un haz que gira y destella en el beat.
- **Pozo:** discos negros con un anillo de luz que gira más rápido en el beat; el polvo cae en espiral hacia el centro.
- **Sonido:** cada región tiene su aire, muy por debajo de la música.
- **Coste:** en el navegador de pruebas, unos 5 ms más por fotograma en Prisma y Pozo (390×844 a 2×, con otra prueba en paralelo). Falta medir en teléfonos.
- **Pruebas:** `universe-layers.mjs` y `universe_layers_smoke.py` cubren las diez regiones.

## Música · Fase 11 · Los últimos gemelos · alpha.112

Rama `claude/musica-resto`, sobre `claude/musica-groove`.

| Género | Tempo | Firma |
|---|---|---|
| Boom bap | 86–90 | Bombo grave, caja seca en 2 y 4, hi-hats en corcheas con swing |
| G-funk | 94–98 | Más relajado: bombo en el 1 y el 3, palmada con la caja, hi-hats en cada semicorchea |
| Liquid drum & bass | 168–172 | El dos pasos suave: bombo en el 1 y en el «y» del 3, hi-hats solo a contratiempo, acordes dos veces por compás |
| Drum & bass | 174–178 | El break rápido: cajas fantasma bajo el backbeat y hi-hats en cada semicorchea |

- **Medida:** Drum & bass ~ Liquid pasó de 0,082 a 0,222; Boom bap ~ G-funk, de 0,124 a 0,324.
- **Los 52 géneros:** medidos de nuevo, ninguna pareja queda bajo la línea (antes 16). La más cercana es Deep house ~ Tribal, a 0,13. Pico máximo de los renders: 0,89.
- **El mapa no cambia** (`genre-tempo.js`, `genre-map.mjs`).

## Música · Fase 10 · Groove · alpha.111

Rama `claude/musica-groove`, sobre `claude/musica-robotica`.

| Género | Tempo | Firma |
|---|---|---|
| Boogie | 98–104 | Funk post-disco: bombo sincopado (no en cada tiempo), caja y palmada, hi-hats en corcheas |
| Cosmic disco | 110–116 | Espacial y recto: sin palmada, timbales que caen como ecos y cuerdas al cerrar el compás |

- **Medida:** Cosmic disco ~ Boogie pasó de 0,084 a 0,478. Ninguno queda bajo la línea con otro género (el más cercano, Cosmic disco ~ Amapiano, a 0,144).
- Melodic house, Nu-disco, Soulful, Broken beat y Jazztronica ya se distinguían tras la fase de las house; no cambian.
- **El mapa no cambia** (`genre-tempo.js`, `genre-map.mjs`); `references.mjs` comprueba el tempo guardado en el rango original.

## Música · Fase 9 · Las robóticas · alpha.110

Rama `claude/musica-robotica`, sobre `claude/universo-viaje`.

| Género | Tempo | Firma |
|---|---|---|
| Electro robótico | 108–114 | Lento y exacto: bombo en el 1 y el 3, hi-hat metálico solo a contratiempo, timbal que contesta como una máquina |
| Electro | 124–130 | La caja de ritmos 808: bombos sincopados, palmada junto a la caja, hi-hats en cada semicorchea |
| Breaks | 132–138 | Breakbeat cortado: cajas fantasma que siempre contestan y hi-hat abierto al final del compás |

- **Medida:** Electro ~ Electro robótico pasó de 0,061 a 0,346; Breaks ~ Electro, de 0,077 a más de 0,2. Ninguno de los tres queda bajo la línea con otro género (el más cercano, Electro robótico ~ Electro funk, a 0,14).
- **El mapa no cambia:** los tres guardan su rango original (`genre-tempo.js`); el mapa es idéntico al de `main` (`genre-map.mjs`) y `palettes.mjs` comprueba el tempo guardado en ese rango.

## Universo · Fase 3 · Regiones del Viaje · alpha.109

Rama `claude/universo-viaje`, sobre `claude/musica-house`.

- **Marea:** anillos que se abren uno por compás desde fuentes fijas y una estela de ondas detrás del cubo.
- **Cúmulo:** racimos de estrellas que se encienden en secuencia al acercarte y estrellas que parpadean en el beat.
- **Tormenta solar:** arcos de plasma, llamaradas en el beat que dejan un anillo y descargas vistas desde arriba.
- **Sonido:** cada región tiene su aire, muy por debajo de la música.
- **Viaje desde arriba:** el faro es un púlsar con haz giratorio, los lotos son fuentes de ondas, la criatura es un racimo de tres estrellas y el faro de regreso es una luz con flecha en el borde, sin columna.
- **Pruebas:** `universe-layers.mjs` y `universe_layers_smoke.py` cubren las cuatro regiones.

## Música · Fase 8 · Las house · alpha.108

Rama `claude/musica-house`, sobre `claude/universo-capas`.

Cada house tiene ahora una firma que se oye en los primeros compases:

| Género | Tempo | Firma |
|---|---|---|
| Melodic house | 114–118 | Sin palmada: un tom grave cierra el compás, solo shaker arriba y cuerdas cada dos compases |
| Deep house | 118–122 | Golpe de aro en vez de palmada, hi-hats cerrados suaves, acordes de órgano largos |
| Soulful y gospel house | 118–121 | Palmadas en cada tiempo, congas, órgano y más swing |
| Garage house (Nueva York) | 119–121 | El swing más marcado, hi-hats en la última semicorchea de cada tiempo y shaker que salta |
| Progressive house | 122–125 | Hi-hats en cada semicorchea, una sola palmada por compás, bombo corto; el hi-hat abierto llega cuando todo suena |
| Chicago house | 124–126 | Piano en cada contratiempo, palmada en el 2 y el 4, hi-hat abierto y congas |
| Acid house | 127–130 | Solo la línea ácida en el bajo, una palmada por compás y cencerro |

- **Medida (52 géneros):** de 16 parejas casi gemelas quedan 5, ninguna house (antes 11). Las que quedan son de las fases siguientes: Electro, Electro robótico y Breaks; Drum & bass y Liquid; Cosmic disco y Boogie; Boom bap y G-funk. Pico máximo de los renders: 0,89.
- Separar solo por tempo movía el problema a otros géneros (Progressive se acercaba a Detroit, Acid house al techno); por eso las firmas son sobre todo de ritmo.
- **El mapa no cambia:** cada lugar conserva su género, su región y su tempo guardado. El mapa sigue usando el rango de tempo original (`genre-tempo.js`); solo la música, al sonar, lleva ese tempo al mismo punto del rango nuevo, y el aviso de lugar muestra el tempo que suena. Comprobado en 1.326 regiones de dos mundos con la huella de `main` (prueba nueva `genre-map.mjs`); `ecology.mjs` y `neighborhoods.mjs` comprueban el tempo guardado en el rango original.
- La música de los lugares con estos géneros cambia de batería y de tempo, a propósito. Nada más cambia.
- `genre-distance.py` ya mide un solo género, para probar variantes.

## Universo · Fase 2 · Capas · alpha.107

Rama `claude/universo-capas`, sobre `claude/musica-medida`.

- **Tres capas desde arriba:** cada región dibuja una capa lejana que se mueve lento (sensación de profundidad), una de textura y una cercana que responde al cubo. Se mueven en todas las direcciones, sin horizonte.
- **Polvo:** bruma ámbar, granos con estela de viento y motas que se apartan al paso del cubo y vuelven a cerrarse. Ya no hay hierba en su suelo.
- **Vacío:** no dibuja nada ni suena.
- **Bordes:** al cruzar de región, las dos se mezclan durante unos 300 px.
- **Sonido:** cada región tiene un aire propio, muy por debajo de la música (Polvo: un siseo fino que sube un poco con tu velocidad).
- **Pruebas:** nuevas `universe-layers.mjs` y `universe_layers_smoke.py` (móvil y computadora).
  - `world_visibility_smoke` sigue fallando como antes del Viaje (las huellas caducan durante la prueba en computadora); no es de esta fase.
  - El aire de región no entra en los renders de música (`audio_mix.mjs` no carga las capas); su nivel se comprueba en la prueba de navegador.

## Música · Fase 7 · Medida de los géneros

Rama `claude/musica-medida`, sobre `claude/universo-nombres`. Solo herramienta y documentación; el juego no cambia.

- **Medidor:** `scripts/genre-distance.py` renderiza los 52 géneros con el motor real y compara tempo, ritmo, timbre y densidad. Deja un informe y clips de las parejas más parecidas para escucharlas.
- **Resultado:** 16 parejas casi gemelas entre 16 géneros; 11 de ellas en el grupo house. Tabla en `docs/UNIVERSO.md`.

## Universo · Fase 1 · Nombres · alpha.106

Rama `claude/universo-nombres`, sobre `main`.

- **Las 11 regiones del universo:** Polvo, Cúmulo, Marea, Restos, Esporas, Anillos, Prisma, Púlsares, Tormenta solar, Pozo y Vacío. Sus ids no cambian: mapas, música y guardados siguen igual.
- **Colores separados:** cada región tiene un color propio; Polvo y Cúmulo ya no comparten verde. El final del Viaje usa los mismos.
- **Textos:** consejos de cada región, ecologías locales y ecorregiones con nombres del universo. El mar entre continentes es el Abismo de silencio.
- **Guía:** nueva `docs/UNIVERSO.md`, con las regiones, las reglas, los superbiomas y sus 18 fases.
- **Pruebas:** nueva `universe-names.mjs`: ids intactos, ninguna palabra de paisaje terrestre en nombres y consejos, colores separados.

## Mundo cenital · Fase 1 · Quitar lo lateral · alpha.105

Rama `claude/mundo-cenital-limpio`, sobre `main`.

- **Regla de cámara:** el Mundo se ve siempre desde arriba, infinito en todas las direcciones; solo el Refugio se ve de lado.
- **Sin horizonte:** se quitan las siluetas de perfil de cada bioma (colinas, agua, árboles, nubes…), que hacían parecer el Mundo un camino.
- **Luz:** la luz del bioma queda centrada en el cubo y sigue latiendo con el compás. El color que se gana en el Viaje no cambia.
- **Pruebas:** `world-sheet.mjs` y `world_sheet_smoke.py` comprueban que solo se dibuja la luz, sin formas ni horizonte.

## Viaje · Momentos de los capítulos 1–3 · alpha.104

Rama `claude/viaje-f8-momentos`, sobre `claude/viaje-f7-medida`.

- **Llanura:** un faro a lo lejos con su propia voz, que crece al acercarte. Al llegar, late con el compás.
- **Lago:** cinco lotos alrededor. Una nota a tiempo junto a uno lo abre y responde una quinta arriba.
- **Bosque:** la primera criatura que te sigue. Repite tus notas una octava abajo y te acompaña hasta el Vacío, donde no puede entrar.
- **Sin palabras:** en el Viaje el Mundo ya no muestra pistas ni etiquetas escritas, ni avisos de voz. El Mundo libre las conserva.
- **Final:** bajo el tema suenan un latido y la criatura que te siguió. Render de 25 s con pico 0,53, sin saturación.
- **Pruebas:** nuevas `journey-moments.mjs` y `journey_moments_smoke.py` (móvil y computadora).

## Viaje · Fase 7 · Medida · alpha.103

Rama `claude/viaje-f7-medida`, sobre `claude/viaje-f6-festival`.

- **Medida automática:** `scripts/journey-curve.py` juega el Viaje entero y mide nivel y voces por segundo en cada estado. Resultados en `docs/VIAJE.md`.
- **Tormenta:** al tocar, la música se sostiene desde abajo; pasa de 46 a 59 voces por segundo y es el clímax del juego.
- **Plenitud:** sostiene la música en todos los capítulos menos el Vacío.
- **Final:** tus notas suenan sobre un pedal de La y el tema sobre el acorde de La mayor. Render de 25 s con pico 0,46, sin saturación.
- **Pruebas:** `journey-chapters.mjs` cubre los suelos de la música.

## Viaje · Fase 6 · Festival y accesibilidad · alpha.102

Rama `claude/viaje-f6-festival`, sobre `claude/viaje-f5-final`.

- **Build de festival:** `?festival=1` abre los primeros 15 minutos (Camino, Llanura y Lago).
  - Sin cuenta y siempre en el Viaje; el menú no muestra Cuenta ni el cambio de modo.
  - Guarda aparte: nunca toca la partida del jugador ni la nube.
  - Tras el Lago, el Refugio toca tu frase y la deja en pantalla. «Otra persona» empieza de nuevo para quien sigue.
- **Daltonismo:** «Colores para daltonismo» en Ajustes cambia los colores de lugares y capítulos por una paleta que se distingue con daltonismo. Se recuerda.
- **Coste:** en el navegador de pruebas el Viaje cuesta lo mismo por fotograma que el Mundo libre. Falta medir en teléfonos reales.
- **Pruebas:** nuevas `festival-color.mjs` y `festival_smoke.py` (móvil y computadora); `journey-finale.mjs` cubre el final de festival.

## Viaje · Fase 5 · Momentos firma y final · alpha.101

Rama `claude/viaje-f5-final`, sobre `claude/viaje-f4-disco`.

- **Tormenta:** cada nota a tiempo trae un rayo en el beat; su Plenitud es un compás de cuatro rayos.
- **Vacío:** la música calla y queda el cubo solo. Tras ocho notas vuelven las criaturas que te siguieron y repiten cada nota un compás después. El tema se completa con ellas.
- **Final:** el último portal lleva al Refugio, que toca tu viaje.
  - Primero tus notas de cada capítulo, en orden y con su color; luego el tema en mayor, dos veces.
  - El cielo se vuelve dorado y la imagen se aleja. Silencio. Créditos.
  - Se abre el Mundo libre y se recuerda. Se puede saltar tocando la pantalla.
- **Arreglo:** la nota que completa el tema ahora cuenta para el capítulo.
- **Sonido:** render del final de 25 s con pico 0,40, sin saturación.
- **Pruebas:** nuevas `journey-finale.mjs` y `journey_finale_smoke.py` (móvil y computadora); `journey-chapters.mjs` cubre Tormenta y Vacío.

## Viaje · Fase 4 · El disco · alpha.100

Rama `claude/viaje-f4-disco`, sobre `claude/viaje-f3-lamina`.

- **Siete capítulos:** Camino, Llanura, Lago, Bosque, Tormenta, Vacío y Refugio, guardados en la partida. Entrar al Mundo en el Viaje empieza en la Llanura.
- **Tres estados:** al llegar la música queda contenida; al tocar a tiempo crece; al completar el tema llega la Plenitud. Si no tocas en 8 compases, baja a un pedal y espera.
- **Plenitud:** el tema suena entero con su octava, el lugar recupera su color y se abre un portal dorado al capítulo siguiente.
- **Faro:** si te alejas del bioma del capítulo, una columna dorada en el borde señala el camino.
- **Tus notas:** cada nota a tiempo se guarda por capítulo para el final.
- **Línea:** cinco marcas muestran los capítulos cumplidos y el actual.
- **Pruebas:** nuevas `journey-chapters.mjs` y `journey_chapters_smoke.py` (móvil y computadora).

## Viaje · Fase 3 · El Mundo como lámina · alpha.99

Rama `claude/viaje-f3-lamina`, sobre `claude/viaje-f2-entrada`.

- **Luz del bioma:** el color del lugar llena la pantalla con una luz que respira con el compás.
- **Siluetas:** cada bioma tiene sus formas grandes y tenues, en dos capas con parallax lento. Hay colinas, árboles, agua, columnas, tallos, dunas, cristales, faros, nubes y cuevas; el Vacío queda vacío. Salen de un hash, no del azar del juego.
- **El color se gana:** en el Viaje, un bioma nuevo se ve pálido. Completar el tema del cubo a tiempo allí le devuelve su color para siempre. Quien ya exploraba conserva sus colores; el Mundo libre siempre tiene color.
- **Camino:** cada cristal roto suma voces a la canción; en el Viaje la etiqueta del cristal dice solo «Pulso».
- **Silencio:** en el Viaje los logros se ganan sin aviso (se anuncian al volver al Mundo libre) y se oculta la caja del continente.
- **Coste:** de 4 a 6 ms por fotograma en el Mundo (móvil 390×844 a 2×), como antes.
- **Pruebas:** nuevas `world-sheet.mjs` y `world_sheet_smoke.py` (móvil y computadora); `journey-mode.mjs` cubre la siembra de colores.

## Viaje · Fase 2 · Entrar y callar · alpha.98

Rama `claude/viaje-f2-entrada`, sobre `claude/viaje-f1-pulso`.

- **Sin cuenta para empezar:** la primera visita juega al instante con guardado local.
  - Desde el menú, «Cuenta» permite crear o entrar en una cuenta. La partida local pasa a la cuenta si es la primera del dispositivo.
  - En el Mundo, un aviso ofrece una vez guardar en la nube.
  - Si una sesión caduca, vuelve la hoja con el correo recordado y la opción «Jugar sin cuenta», que se recuerda.
- **Viaje silencioso:** los jugadores nuevos empiezan en el Viaje.
  - Sin ventana de bienvenida, sin Día, Era, Caminado ni chispas, sin Saltar ni Estilos, sin meta escrita.
  - Menú corto: Mundo, Refugio, Sonido, Ajustes, Cuenta y «Mundo libre».
- **Mundo libre:** un toque devuelve todo (tienda, mapa, Bitácora, crear, semillas, compartir, guía) y se recuerda. Quien ya llegó al Mundo empieza aquí y no pierde nada.
- **Pruebas:**
  - nuevas: `journey-mode.mjs` y `journey_entry_smoke.py`, que simula a un jugador nuevo real en móvil y computadora;
  - `account_flow_smoke` prueba la cuenta opcional: entrar sin cuenta, registrarse desde el menú con el progreso local conservado, sesión lenta, sesión caducada y juego local recordado.
  - `cloud_account_smoke` y `cloud_delete_smoke` siguen la cuenta opcional (sin configuración se juega local; tras borrar la cuenta se sigue en local).
  - Catálogo de navegador: 151 de 154 en la primera pasada; las dos de nube pasan tras actualizarlas. `world_visibility_smoke` falla igual en la base anterior al Viaje (las huellas caducan a los 12 s mientras corre la prueba en computadora): no es de esta fase.

## Viaje · Fase 1 · El pulso · alpha.97

Rama `claude/viaje-f1-pulso`, sobre `claude/viaje-f0-papel`. El verbo del Viaje: tocar a tiempo.

- **A tiempo** (±60 ms del pulso): el pulso toca la siguiente nota del **tema del cubo** con su voz de chelo, en la escala del lugar. Vibra y deja un destello dorado. Seis aciertos completan el tema, con una vibración distinta.
- **Fuera de tiempo:** suena el pulso de siempre, sin tema ni vibración. Nunca suena mal.
- **Ritmo:** entre pulsos hay 240 ms en lugar de 700. La rejilla del compás ya los ordena.
- **La Línea:** en la parte baja de la pantalla se dibuja el compás con un cursor dorado y un pico por cada pulso, dorado si fue a tiempo.
- **Ajustes:** nuevo «Vibración», que se guarda.
- **Pruebas:**
  - nuevas: `journey-pulse.mjs` y `journey_pulse_smoke.py` en móvil y computadora;
  - en PASS: `smoke`, `interface`, `accessibility`, `crystal_sparks`, `cube_moves`, `jam`, `world_music` y `cube_sound`. Esta última falló dos veces con otra prueba pesada en paralelo y pasó dos veces sola; también pasa en la rama base.

## Viaje · Fase 0 · Papel

Rama `claude/viaje-f0-papel`, sobre `claude/casa-c7-refugio`. Solo diseño y documentación; el juego no cambia.

- **Panel creativo:** diez perfiles simulados de creadores (Mizuguchi, Iwai, Matsuura, Simogo, Proteus, Jenova Chen, Roset, Ken Wong, Pope y Wintory) analizaron Kubono y acordaron un plan para competir en el IGF. Jay aprobó seguirlo.
- **[El Viaje](docs/VIAJE.md):**
  - el juego principal pasa a ser un viaje de 7 capítulos y unos 40 minutos con final; después se abre el Mundo libre;
  - el verbo es tocar a tiempo;
  - un tema de seis notas para el cubo, reharmonizado por capítulo;
  - el color se gana capítulo a capítulo;
  - incluye los primeros 5 minutos sin texto y la lista de lo que se oculta durante el Viaje.
- **Decisiones registradas:** cuenta opcional con guardado local (en el [plan de lanzamiento](docs/PLAN_LANZAMIENTO.md) y en AGENTS.md), economía oculta durante el Viaje y un músico coautor pendiente.
- **Render de trabajo del tema:** 69 s por los siete capítulos, pico 0,62, fuera de Git.

## Refugio · C7 · alpha.96

Rama `claude/casa-c7-refugio`, sobre `claude/l2-tienda`. Pedido de Jay: la Casa se veía infantil y no encajaba con un juego abstracto y musical. Se rediseña sin tocar lo ganado.

- **Nombre:** la Casa pasa a llamarse **Refugio**. Las cámaras son Cielo, Eco, Jardín de voces y Raíz.
- **Forma:**
  - cuatro cámaras de líneas finas en el negro, sin tejado, muebles ni ladrillos;
  - cada cámara es una partitura: cinco líneas tenues y dieciséis marcas del compás, con la luz y la marca dorada siguiendo lo que suena;
  - hilos de luz en lugar de escaleras.
- **Despliegue:** el Refugio se abre desde el cubo con un pulso. Fuera solo hay polvo y la luz del bioma.
- **Piezas:**
  - la máquina de cápsulas pasa a ser el **Prisma**, al mismo precio y con los mismos premios;
  - el Taller es su **disco** radial flotando en Eco;
  - el motor pasa a ser el **Núcleo**, que late en la Raíz.
- **Colección:** paneles de luz con tus tarjetas, una constelación dorada con tus logros, columnas de cristal con tus piezas y tallos de luz para las voces del jardín.
- **Ornamentos:** los 12 adornos se conservan con formas abstractas: Órbita (marca la hora real), Brote de luz, Esfera, Lluvia lenta, Destellos, Lámpara, Vela, Brújula, Arco, Media luna, Monolito y Partitura.
- **Textos:** menú, botones, La Voz, Bitácora y logros dicen Refugio. Logros del Prisma renombrados; sus ids no cambian.
- **Se conserva:** chispas, premios, objetos, colores, logros, visitas, Taller y sonido.
- **Pruebas:** 190 conjuntos de Node, auditoría sin errores, 152/152 recorridos de navegador y renders de audio del Refugio sin saturación. Las pruebas usan los textos nuevos.
- **Tienda:** las fichas y el guion hablan del Refugio; `store-media.py` guarda `*-refugio*`.

## L2 · Material de tienda (borradores)

Rama `claude/l2-tienda`, sobre `claude/l1-candidato`. Sin cambios en el juego ni en la versión.

- **`scripts/store-media.py`:** abre el juego real y genera en `outputs/tienda/` (fuera de Git):
  - 30 capturas en los tamaños de Google Play, App Store y Steam;
  - iconos y gráficos de tienda sin canal alfa;
  - tres clips de 12–14 s con el audio real del juego.
- **[Material de tienda](docs/TIENDAS.md):** fichas en español e inglés, guion de tráiler, textos de landing y press kit. La ficha en inglés avisa que el juego está en español.
- **Plan de lanzamiento:** D07, D08, D09 y D11 pasan a borrador; falta la aprobación de Jay y la identidad violeta, que está fuera de Git.

## L1 · Candidato · Revisión de la Casa · alpha.95

Rama `claude/l1-candidato`, sobre `claude/casa-c6-viaje`. Revisión de código de todas las fases de la Casa antes del candidato.

- **Toques:** la mesa del Taller, la máquina y el motor solo responden con el cubo al lado; desde lejos, tocarlos camina hasta allí. Un objeto colgado delante se toca primero. Los toques fuera de las paredes (suelo, partes bajas) también caminan.
- **Solo lectura:** una marca de solo lectura guardada por una versión anterior ya no bloquea para siempre la casa.
- **Visitas:** un código manipulado con una habitación desconocida ya no rompe la música. Las piezas que suenan en habitaciones cerradas callan. Al visitar se guarda antes el lugar del cubo en tu casa.
- **Corrección de C5:** «Puertas abiertas» siempre contó las criaturas que visitan tu casa; C5 lo había cambiado por error a casas visitadas. Vuelve a decir «Recibe N visitas diferentes» y las casas que visitas se guardan aparte (`visitedHouses`), sin logro.
- **Pruebas:** `house-v2.mjs` y `house-capsules.mjs` cubren los arreglos; recorridos de la Casa, Taller, visitas, Jardín y `smoke` en PASS.

## Casa viva · C6 · La casa viaja contigo · alpha.94

Rama `claude/casa-c6-viaje`, sobre `claude/casa-c5-visitas`. Pedido de Jay: que la Casa tenga sentido en la historia, menos botones, y Casa y Taller en uno solo.

- **Historia:** el cubo lleva su casa. Se abre donde estás y aterriza con propulsores; tiene patas, una antena que parpadea y, fuera, el suelo y el paisaje del bioma donde aterrizó (dunas, árboles, cristales, faros…). El lugar anterior queda como campamento.
- **Una sola entrada:** el menú Casa, el botón de la casa en el Mundo y «Abrir la casa aquí» hacen lo mismo. «Desplegar Taller aquí» ya no existe.
- **Taller:** es la mesa de la Sala, abierta desde el primer día. «Volver a la casa» regresa a la Casa.
- **Bodega:** el Sótano pasa a llamarse Bodega y guarda el motor de la casa en lugar de la mesa.
- **Menos botones:** el panel pasa de ocho botones a cuatro: Coloca, Ver casa, Código y Volver.
  - Caminar es lo normal; Coloca se activa y se desactiva.
  - Para guardar un objeto, se arrastra fuera de la casa (antes, Retira).
  - El Jardín de voces solo aparece cuando el cubo está en el Jardín.
- **Textos:** la tarjeta Casa del menú dice «Tu casa viaja contigo»; La Voz lo cuenta la primera vez.
- **Pruebas:**
  - `smoke`, `wonders`, `alive`, `house_v2`, `house_capsules`, `experience_garden` y `house-guide` siguen el camino nuevo (mesa del Taller, Jardín para sus herramientas).
  - Cierre: 190 conjuntos de Node, auditoría sin errores, 152/152 recorridos de navegador y renders de la Casa (`house_mix`, `experience_garden_mix`, `house_ambience_mix`) sin saturación.

## Casa viva · C5 · Visitas y cierre · alpha.93

Rama `claude/casa-c5-visitas`, sobre `claude/casa-c4-crece`. Cierra la Casa viva.

- **Visitas:** un código WH2 abre la casa de otra persona con sus adornos y colores. Se recorre y se escucha, pero no se cambia ni se gasta nada. El código no lleva nombre.
  - Cada casa distinta se guarda una vez; tu propio código no cuenta. (Corregido en L1: «Puertas abiertas» sigue contando las criaturas que te visitan.)
- **Bitácora:** «Ver en tu casa» en Colección y Logros.
- **Menú:** la tarjeta Casa dice qué hay de nuevo: cuadros nuevos, trofeos nuevos o una cápsula lista.
- **Accesibilidad:**
  - un lector de pantalla oye en una frase qué hay en la habitación y qué está cerca;
  - Enter usa la máquina de cápsulas o la mesa del Taller.
- **Rendimiento:** 2,7 ms por fotograma en la Casa con todo a la vista, frente a 4,7 ms en el Mundo (móvil 390×844 a 2×, sin sonido).
- **Pruebas:**
  - Nuevas: `house-guide.mjs` (Node) y `house_visit_smoke.py` en móvil y computadora.
  - Cierre completo: 190 conjuntos de Node, auditoría sin errores, 152/152 recorridos de navegador y 54/54 renders de audio.

## Casa viva · C4 · Crece y juega · alpha.92

Rama `claude/casa-c4-crece`, sobre `claude/casa-c3-sonido`. La Casa crece contigo y tiene un juguete.

- **Habitaciones:** se abren por días o por logros, lo que llegue antes. Jardín: 3 días u 8 logros. Azotea: 7 o 20. Sótano: 14 o 40. Nadie pierde una habitación abierta.
- **Máquina de cápsulas:** está en la Sala. El primer toque dice el precio; el segundo gira. Cada cápsula cuesta 60 ✦, unos cinco minutos de juego.
  - Da 12 adornos (reloj con la hora real, cometa, luna de papel, baúl…), 6 piezas que suenan (campanas, caja de música, gong…) o un color nuevo para un objeto colocado.
  - Nada se repite. Las piezas que suenan tocan en el compás de la Casa y se pueden mover.
  - Las chispas solo se cobran si la partida se guarda.
- **Logros de la Casa:** seis nuevos (primera cápsula, diez cápsulas, todos los adornos, todos los sonidos, tres colores y la mesa del Taller). El libro pasa de 370 a 376 logros.
- **Taller:** la mesa del Sótano abre el Taller. «Desplegar Estudio aquí» ahora dice «Desplegar Taller aquí».
- **Pruebas:**
  - Nuevas: `house-capsules.mjs` (Node) y `house_capsules_smoke.py` en móvil y computadora.
  - `achievements_v2_smoke`, `universe_mischief_smoke` y `universe-mischief-runtime` cuentan 376 logros.
  - En PASS: `house_walk`, `house_v2`, `house_collection`, `house_sound`, `experience_garden`, `wonders`, `journal_v2`, `journal_scale`, `house_mix` y `smoke`.

## Casa viva · C3 · Todo suena · alpha.91

Rama `claude/casa-c3-sonido`, sobre `claude/casa-c2-coleccion`. La Casa se escucha al recorrerla.

- **Al pasar:** el cubo toca cada objeto junto al que camina, una vez cada 2,5 s.
- **Pulso:** suena la voz del cubo y después los cuatro objetos más cercanos, en arpegio. Las criaturas cercanas responden con un pío corto.
- **Ambiente:** cada habitación tiene su aire. La Sala queda en silencio, el Jardín tiene hojas, la Azotea viento y el Sótano un zumbido. Todo se apaga al salir, con el sonido apagado o con un panel abierto.
- **Tienda:** los sonidos comprados para el cubo (sombrero, zumbido, notas al pisar, filtro) también suenan en la Casa.
- **Pruebas:**
  - Nuevas: `house_sound_smoke.py` y `house_ambience_mix.py`. Los cuatro ambientes quedan por debajo de 0,08 de pico a 44,1 y 48 kHz.
  - En PASS: `house_walk`, `house_collection`, `house_v2`, `experience_garden`, `cube_sound`, `house_mix`, `experience_garden_mix`, `shop_sound_mix` y `smoke`.

## Casa viva · C2 · Colección viva · alpha.90

Rama `claude/casa-c2-coleccion`, sobre `claude/casa-c1-caminar`. Lo que coleccionas aparece en la Casa. Mirar nunca cambia la partida.

- **Cuadros en la Sala:** las cuatro tarjetas más raras, con su retrato real y el marco del color de su rareza. Un cuadro vacío anima a buscar más.
- **Estante de trofeos:** un trofeo por cada una de las siete categorías de logros (Camino, Mundo, Música, Vida, Colección, Casa, Secretos). Es dorado si ya ganaste alguno y crece y se llena según la parte completada.
- **Vitrinas en el Sótano:** las seis últimas piezas compradas en la tienda, con su imagen.
- **Jardín de voces:** cada voz es una planta en maceta debajo del lugar donde suena.
- **Criaturas de visita:** las que conociste pasean por su planta, descansan y a veces se acercan al cubo; la mascota lo sigue. El pulso, con la tecla de pulso, las hace saltar con un corazón.
- **Mirar:** tocar un cuadro, un trofeo, una vitrina o una criatura dice qué es, sin caminar.
- **Coste:** 2,8 ms por fotograma en la Casa con todo a la vista (5,3 ms en el Mundo, misma medición).
- **Pruebas:**
  - Nuevas: `house-collection.mjs` (Node) y `house_collection_smoke.py` en móvil y computadora.
  - `house_walk_smoke.py` toca una zona libre de la pared.
  - En PASS: `house_v2`, `experience_garden`, `smoke`, `wonders`, los pulsos del Camino y del Mundo, los gestos de la tienda y los 188 conjuntos de Node.

## Casa viva · C1 · Casa caminable · alpha.89

Rama `claude/casa-c1-caminar`, sobre `claude/casa-c0-modelo`. La Casa deja de ser un plano de cuatro cuadros y pasa a ser una casa de muñecas vista en corte.

- **Plantas:** Azotea arriba, Sala y Jardín al medio, Sótano bajo tierra.
- **Detalles:** tejado de tejas con chimenea, cielo y estrellas según la hora real, suelo con hierba y paredes distintas en cada habitación.
  - Sala: rayas, ventana, sofá, alfombra y lámpara.
  - Jardín: invernadero, macetas y enredadera.
  - Azotea: baranda, telescopio y guirnalda de luces.
  - Sótano: ladrillos, tuberías, el banco del Taller y una lámpara.
  - De noche las lámparas iluminan.
- **Caminar:**
  - El cubo camina con las mismas teclas que en el Mundo y sube o baja con las flechas en las escaleras.
  - Tocar una habitación lo lleva hasta allí, también a otra planta.
  - Las paredes lo detienen, la puerta a una habitación cerrada no se abre y al tocar una habitación cerrada se explica cuántos días faltan.
- **Vista:** la cámara encuadra la planta del cubo entre los contadores y el panel; «Ver casa» muestra la casa entera.
- **El cubo** lleva todo lo que compraste en la tienda, igual que en el Mundo.
- **La música se ve:** en cada habitación, una luz recorre el compás y los objetos brillan al sonar. La izquierda-derecha sigue siendo el tiempo y la altura en la pared la nota; el secuenciador suena igual.
- **Se conserva:** colocar, mover, retirar, el Jardín de voces, el Taller, las visitas y la posición del cubo al recargar.
- **Coste:** 2,1 ms por fotograma en la Casa, frente a 5,2 ms en el Mundo en la misma medición (móvil 390×844 a 2×, sin sonido).
- **Pruebas:**
  - Nuevo `house_walk_smoke.py` en móvil y computadora.
  - `house_v2_smoke.py` y `experience_garden_smoke.py` adaptados a habitaciones rectangulares; esperan a que la cámara se asiente.
  - En PASS: `smoke`, `wonders`, `interface`, `panel_polish`, `accessibility`, `visual_closure`, recorridos de la tienda, `house_mix`, `experience_garden_mix` y los 187 conjuntos de Node.

## Casa viva · C0 · Base · alpha.88

Rama `claude/casa-c0-modelo`, sobre `claude/casa-plan`. Primera fase de la nueva Casa en vista de casa de muñecas (plan en [Casa viva](docs/CASA_VIVA.md)). Sin cambios visibles.

- **Datos versión 2:**
  - Se conservan objetos, habitaciones, posición y visitantes; los datos desconocidos se guardan sin tocar.
  - Se añaden adornos, colores de objetos y cápsulas, siempre normalizados.
  - El secuenciador suena igual.
  - Una casa de una versión futura se abre solo para leer.
- **Código para visitar:** si la casa solo tiene objetos sigue siendo WH1, que leen versiones anteriores; con adornos o colores es WH2. Se leen los dos.
- Una casa completa ocupa menos de 50 KB dentro de la partida.
- **Pruebas:**
  - Nueva `house-v2.mjs`.
  - En PASS: `house.mjs`, `house_v2_smoke`, `experience_garden_smoke`, `wonders_smoke`, `experience_future_smoke`, `cloud_account_smoke`, el render `house_mix` (pico 0,91) y los 187 conjuntos de Node.
  - Catálogo completo de navegador de la rama `claude/fase-i-textos`: 147/147.

## Fase I · Textos y paneles · alpha.87

Rama `claude/fase-i-textos`, sobre `claude/fase-h2-calidad`. Revisión con capturas de los 23 paneles en móvil y computadora y de todos sus textos visibles.

- **Cerrar:** la «×» de texto, diminuta y desalineada, pasa a ser una X dibujada del mismo tamaño en todos los paneles, centrada con el título.
- **Guardar copia:** el selector de archivo del navegador salía en inglés («Choose File / No file chosen»). Ahora es un botón «Elegir archivo» con el nombre del archivo o «Ningún archivo elegido».
- **Viaja a otra semilla:** fuera del modo de desarrollo ya no muestra semillas de prueba (Blobs, Basalto…), opciones técnicas de paisaje y espacio ni «Biomas de 3600 unidades». El jugador ve dónde está: semilla, lugar y estilo.
- **Ajustes:** cada opción en su línea a lo ancho (el selector de paseo ya no se corta) y los interruptores «Modo» y «Datos del mundo» como filas de lista.
- **Gotas de luz:** con un panel completo abierto se detienen y dejan de aparecer. Antes podían caer sobre el cubo y sonar con el juego pausado. Los paneles ligeros (Sonido, Tu cubo) mantienen el mundo vivo detrás, como antes.
- **Textos:** no quedan textos en inglés ni palabras de prueba visibles para el jugador; los términos (chispas, Bitácora, Tu cubo) se usan igual en todo el juego.
- **Pruebas:**
  - `interface_smoke.py` fallaba a veces porque una gota caía sobre el cubo durante la medición. Ahora retira las gotas antes de medir y pasa 6 de 6.
  - `world_weather_smoke.py` comprueba que las gotas esperan detrás de un panel.

## Fase H · Estabilidad · alpha.86

Ramas `claude/fase-h-estabilidad` (ya en `main`) y `claude/fase-h2-calidad`, sobre `main`.

- **Pruebas que fallaban a veces:**
  - `encounter_depth_smoke.py`: una nota tardía del clic anterior ocupaba el primer lugar de la frase. Ahora la prueba borra las notas en el mismo turno en que toca la frase.
  - `crystal_play_smoke.py`: la persecución usaba una sola flecha a la vez. Ahora persigue en diagonal, como un jugador.
  - Ambas pasan 6 de 6 veces. No eran errores del juego.
- **Calidad gráfica:** Ajustes ofrece Automática, Alta y Ligera. En Automática, si el dispositivo dibuja más lento que unos 40 fotogramas por segundo en dos muestras seguidas, pasa a ligera hasta cerrar el juego: lienzo a 1× en vez de 2×, como máximo 150 partículas en vez de 400 y menos salpicaduras de lluvia. La elección se guarda.
- **Diagnóstico:** los errores que ocurren al jugar se guardan en el dispositivo (los últimos 20, sin datos personales) y Ajustes los copia con «Copiar diagnóstico». Política de privacidad actualizada.
- Pruebas nuevas: `quality-diagnostic.mjs` (Node) y `quality_diagnostic_smoke.py` (calidad a 1× y 2×, cambio automático, recarga, error registrado y copiado). Recorridos de Ajustes, menú, clima, cámara y `smoke` en PASS.

## Fase G · Revisión integral · alpha.85

Rama `claude/fase-g-revision`, sobre `claude/fase-f-cuenta`. Revisión del código nuevo (tienda, menú, cuenta) y cierre completo local.

- **Filtro (tienda):** la música ya no se queda apagada al salir del Mundo, entrar en Casa o empezar una actividad; el filtro se revisa al inicio de cada fotograma y solo actúa en la superficie del Mundo.
- **Subsuelo y Cielo:** el movimiento se mide en la escala de la capa (1:8 y 1:6); hi-hat y Modo DJ ya no se disparan con poco movimiento y el Séquito solo aparece en la superficie.
- **Menú en Casa:** el resumen dice «Casa», no «Camino».
- **Rendimiento:** catálogo consultado por mapa, morse calculado una vez por nombre y la Hierba preguntada una vez por fotograma en vez de una vez por brizna.
- **Medición** (Chromium local, 390×844, sin sonido, paseo de 6 s): 3,8 ms por fotograma sin piezas; 5,3 ms (p95 7,9) con 26 piezas puestas, nuevas y antiguas. Presupuesto: 16,6 ms.
- **Cierre completo local** sobre esta rama, antes del arreglo de `audio_mix.mjs`: navegador 143/146 y audio con un fallo.
  - `interface_smoke` y `sparks_notice_smoke` fallaron por carga con dos trabajadores y pasan al repetirlos.
  - `shop_sound_mix` falló porque el arnés no llamaba a la revisión del filtro; corregido, pasa.
  - `encounter_depth_smoke` es intermitente desde antes de estas fases: falla 3 de 3 en `main` (alpha.66) y también falló en su CI (run 39538532680). En estas ramas falló 2 de 7 veces. En los fallos, la primera de las cuatro notas enseñadas queda con otro desfase armónico que las demás. No se tocó la prueba; queda pendiente de diagnóstico.
- La rama de la tanda 7 pasó el catálogo de navegador completo, 145/145. `crystal_play_smoke` falló una vez en una ejecución suelta y pasó las dos siguientes.
- No verificado: CI de estas ramas (no hay PR), escucha física y dispositivos reales.

## Fase F · Cuenta sin fricción · alpha.84

Rama `claude/fase-f-cuenta`, sobre `claude/fase-e-menu`. Sin cambios en la configuración de Supabase.

- **Con sesión guardada:** el juego arranca al momento, sin hoja de acceso ni espera de red; la identidad se comprueba en segundo plano. Si Auth la rechaza, el juego vuelve solo a la entrada.
- **Entrada:** título Kubono, «Entrar» como acción principal, el último correo ya escrito y el cursor en la clave; los botones dicen «Entrando…», «Creando…» o «Confirmando…» mientras trabajan.
- **Alta:** si el correo pide confirmación, el código se escribe en la misma hoja y entras directamente.
- El correo recordado se borra al eliminar la cuenta.
- Recorrido nuevo `account_flow_smoke.py` (Auth simulado y lento, sesión revocada, código de alta); `cloud_account_smoke.py`, `cloud_delete_smoke.py` y `cloud_recovery_smoke.py` en PASS.

## Fase E · Menú profesional · alpha.83

Rama `claude/fase-e-menu`, sobre `claude/tienda-tanda-7`.

- **Cabecera:** tu cubo en su color, tu nombre (o Kubono) y un resumen con tus chispas y el lugar donde estás.
- **Jugar:** cuatro tarjetas con título y una línea que dice qué hay dentro; la de Mundo/Camino cambia su ayuda según dónde estés.
- **Resto:** filas de lista con icono y flecha, una columna en el móvil y dos en pantallas anchas. Grupos: Jugar, Tu viaje, Crear y General.
- **Logros nuevos:** un punto dorado en la Bitácora en lugar del «·».
- Recorridos `menu_v2_smoke.py` e `interface_smoke.py` adaptados a los grupos nuevos.

## Tienda · tanda 7 · Habilidades y economía · alpha.82

Rama `claude/tienda-tanda-7`, sobre `claude/tienda-tanda-6`. Las únicas piezas que ayudan a jugar, en `src/cube-shop-skills.js`, cada una con su límite:

- **Imán corto:** recoge fragmentos un 35 % más lejos.
- **Sprint:** al arrancar tras medio segundo quieto, un acelerón de un segundo; se recarga en seis. Sin botones nuevos y solo con tu propio movimiento, nunca con el piloto automático.
- **Planeo:** en el Cielo, el toque de bajar se convierte en 2,5 s de planeo que puedes dirigir; aterriza donde termina sobre tierra y sobre el mar sigue hasta 6 s y avisa.
- **Economía:** las 78 piezas nuevas cuestan la mitad (catálogo 33790 → 17030 ✦; las tres primeras igual). Con 10 a 14 ✦/min medidos, la tienda completa pasa de 40–56 h a 20–28 h de juego activo. Lo ya comprado no cambia.
- Pruebas: `cube-shop-skills.mjs` (Node) y `cube_skills_smoke.py` (compra, sprint y recarga, planeo y aterrizaje, recarga de página); sumas de tandas anteriores actualizadas a los nuevos precios.

## Tienda · tanda 6 · El mundo reacciona y Locuras · alpha.81

Rama `claude/tienda-tanda-6`, sobre `claude/tienda-tanda-5`. Once piezas (7350 ✦) en `src/cube-shop-wild.js`, solo dibujo:

- **El mundo reacciona:** Linterna (luz cálida en el Subsuelo y farolillo junto al cubo), Hierba (se aparta más ancho y más lejos), Charcos (fijos por lugar; reflejan el cubo al pisarlos y hacen ondas con lluvia), Séquito (tres criaturas conocidas siguen tu camino) y Tu constelación (tu inicial en estrellas, más clara de noche).
- **Locuras:** Morse (tu nombre en el reloj de la música), Mochila (tus tres últimas tarjetas), Pantalla (BPM y género, bajo el cubo), Holograma (tu tarjeta más rara), Disfraces (tres pulsos seguidos: esfera, pirámide o dodecaedro un minuto) y Piel VJ (franjas que laten en los colores de la región).
- Todas tienen versión quieta con movimiento reducido y su imagen en la tienda es su dibujo real.
- Pruebas: `cube-shop-wild.mjs` (Node) y `cube_wild_smoke.py` (compra, juego en movimiento y quieto, recarga, Llevar).

## Tienda · tanda 5 · Sonido · alpha.80

Rama `claude/tienda-tanda-5`, sobre `claude/fase-d-casa`. Doce piezas nuevas (6050 ✦) en `src/cube-shop-sound.js`:

- **Voz del pulso** (una a la vez): Bombo 808, Campana FM, Ácido, Corte vocal, Scratch y Acorde. Sintetizadas en el bus de música con la nota del pulso; Acorde toca la armonía de la región. Elegir una voz ganada quita la comprada y al revés.
- **Sonido del cubo** (varias a la vez): Hi-hat al caminar (corcheas), Filtro (la música se abre al acelerar), Tarareo (quieto, tararea bajito), Modo DJ (scratch al dar media vuelta) y Antena (oye la región vecina).
- **Notas pisables** (rastro): deja una nota cada pocos pasos; al volver a pisarla suena. El mismo camino toca siempre la misma melodía.
- Con el sonido apagado o un panel abierto no suena nada nuevo; las marcas se siguen viendo. Cada pieza enseña una marca junto al cubo al sonar, y esa marca es su imagen en la tienda.
- Pruebas: `cube-shop-sound.mjs` (Node), `cube_sound_smoke.py` (compra, juego, silencio, recarga) y `shop_sound_mix.py` (renders a 44,1/48 kHz, pico 0,88 sin saturación; `scripts/shop-sound-audio-validation.json`). `audio_mix.mjs` acepta `shopPieces`.

## Fase D · Casa y Crear · alpha.79

Rama `claude/fase-d-casa`, sobre `claude/fase-c-menu`.

- **Casa:** el panel se ordena en dos filas siempre visibles. Arriba los modos (Camina, Coloca, Retira), con el activo en blanco; abajo Taller, Código y Volver, que antes quedaban ocultos bajo el borde. El selector de objeto solo aparece al colocar. En horizontal el panel pasa a la derecha y deja libre el plano.
- **Casa:** el anuncio de la región ya no tapa las habitaciones.
- **Grabar set:** con el sonido apagado, grabar lo enciende en lugar de no hacer nada.
- **Menú:** Ajustes, Guía de juego y Cuenta llevan icono y la misma letra que el resto; «Cuenta» ya no pierde su estilo al iniciar la cuenta.
- Recorrido `house_v2_smoke.py`: comprueba que todas las acciones de la casa estén a la vista.

## Fase C · Menú y paneles · alpha.78

Rama `claude/fase-c-menu`, sobre `claude/fase-b-sonido`.

- **Menú:** cuatro grupos (Jugar, Tu espacio, Crear, Más); «Sonido» se une a la Bitácora en Tu espacio en lugar de ocupar un grupo para él solo.
- **Botones de cierre:** todos dicen «Cerrar» salvo los que nombran una acción («Seguir jugando», «Volver al mundo»); antes se mezclaban Volver, Listo y Cerrar.
- **Guía:** «Laboratorio» y «Practicar» se quedan: son la lección de escucha y el recorrido de práctica, no botones de prueba.

## Fase B · Sonido en un panel · alpha.77

Rama `claude/fase-b-sonido`, sobre `claude/fase-a-tu-viaje`. El menú ya no repite el control de volumen: volumen, energía, sonido sí/no, calma, repetir y Estilo de La Voz (que sale de Ajustes) viven en el panel «Sonido». El selector conserva su ID y su comportamiento. Recorridos adaptados: `volume_control_smoke.py` y `menu_v2_smoke.py`.

## Fase A · Tu viaje en la Bitácora · alpha.76

Rama `claude/fase-a-tu-viaje`, sobre `claude/fase-3-diversion`. Mapa, Favoritos y Perfil dejan de ser paneles sueltos y pasan a la Bitácora:

- **Lugares:** primero el mapa (con sus cifras, «Ver cerca» y «Compartir»), después guardar y buscar lugares, y debajo los recuerdos y la constelación.
- **Tú:** pestaña nueva con el perfil (nombre, tiempo, distancia y universo descubierto).
- **Menú:** «Tu espacio» queda solo con «Bitácora»; desaparecen «Favoritos» y «Tu perfil». «Mapa» (Jugar) y el nombre del lugar arriba siguen siendo atajos y abren la Bitácora en Lugares.

Las secciones conservan todos sus IDs y eventos: la Bitácora las coloca en su cuerpo al cambiar de pestaña y las guarda en un contenedor oculto al salir, así que nunca dejan de existir en el documento.

Se adaptaron 13 recorridos que abrían los paneles antiguos para que entren por la Bitácora.

## Fase 3 · Diversión · alpha.75

Rama `claude/fase-3-diversion`, sobre `claude/fase-v6-sucesos`. Los ocho ajustes aprobados de la revisión:

1. **Carrera real:**
   - la meta está a 300–380 u, en el sentido contrario a donde llegaste;
   - cuenta 3·2·1 con las notas de la escena;
   - el rival corre a 150 u/s (110 con movimiento reducido) y puede ganar;
   - el texto muestra el tiempo y el resultado («Ganaste la carrera» o «Tu rival llegó primero»).
2. **Fragmento raro:** huye 5 s, hasta 180 u y a 120 u/s, y se puede atrapar mientras corre. Si escapa se apaga y vale 1 ✦ en lugar de su bonificación. La máscara guardada no cambia.
3. **Racha de cadena:** cada aro se aviva con las roturas; desde la tercera aparece «×N» en dorado.
4. **Eco que compite:** su recorrido completo, el eco como cubo con ojos, «Tú 12,3 s · tu eco 14,0 s» y al final «Ganaste a tu eco» o «Tu eco fue más rápido».
5. **Encuentros:**
   - la sombra deja sus pistas a 160 u, corre a 120 u/s y solo cuenta (y se ve) la siguiente;
   - la lluvia sube de verdad y hay que atrapar las gotas a su altura;
   - el imitador y la procesión muestran su progreso («gira 1/2», «140/220»).
6. **Volumen:** travesuras de 0,012/0,014 a 0,06/0,09 y final de actividad de 0,018 a 0,06; los tótems siguen más fuertes (0,28).
7. **Encadenar encuentros:** tras resolver uno, la espera baja de 45 a 12 s y durante los 20 s siguientes la pista dorada alcanza 600 u (en el borde de la pantalla si queda fuera).
8. **Llegada de salto:** el aviso nombra la familia y el estilo del lugar, y suenan dos notas de su música a tempo.

**Pruebas:** nueva `tests/fun-tweaks.mjs`. Dos pruebas se adaptan a los cambios aprobados:
- `crystal_play_smoke.py` persigue sin esperar a que el fragmento se pare y sosteniendo la tecla;
- `universe_mischief_mix.py` admite la nueva ganancia, con pico de 0,87 y sin saturación.

## Fase V6 · Sucesos vivos · alpha.74

Rama `claude/fase-v6-sucesos`, sobre `claude/fase-v5-sensacion`. Sucesos que llegan solos, uno a la vez, con 90 a 180 s entre ellos (el primero tras 40 a 80 s), solo en superficie y fuera de actividades:

- **Estrellas fugaces:** de noche.
- **Festival de luces:** unos 12 s de motas que suben del suelo con los colores de la música.
- **Brisa de luz:** de día, una franja cálida que cruza el campo.

Son decorativos: sin premios, sonido ni texto, y ninguno con movimiento reducido.

**Medición de las fases V1–V6 juntas** (Chromium local sin GPU):
- sin sonido: 3,7 ms por fotograma de media sin piezas y 3,8 ms con 16 piezas, frente a 8,3 y 9,6 ms antes de la fase R;
- con sonido: 7,0 ms, frente a 6,1 ms tras R y 12,1 ms antes.

Los módulos `world-*.js` no aparecen entre los que más consumen.

Archivo nuevo: `world-happenings.js`. Recorrido: `tests/world_happenings_smoke.py`.

## Fase V5 · Cámara y sensación · alpha.73

Rama `claude/fase-v5-sensacion`, sobre `claude/fase-v4-musica` (incluye el arreglo de prueba de la fase R).

Una transformación envuelve el mundo y el cubo, así que todos los sistemas siguen alineados:

- **Anticipación:** al caminar, la vista se adelanta hasta 18 px en la dirección de la marcha y vuelve al centro al parar. No se aplica mientras hay un dedo en la pantalla, para que los toques caigan donde se apunta.
- **Golpe de zoom:** romper un cristal da un toque breve (2 %); una cadena de tres o más, un 4,5 % con una pequeña sacudida.
- **Tormenta:** truenos y rayos sacuden la vista suavemente.

Controles, joystick y avisos quedan fuera de la transformación. Con movimiento reducido no hay nada de esto.

Archivo nuevo: `world-camera.js`. Recorrido: `tests/world_camera_smoke.py`.

## Fase V4 · El mundo respira la música · alpha.72

Rama `claude/fase-v4-musica`, sobre `claude/fase-v3-fauna`. Con sonido:

- el primer tiempo de cada compás tiñe levemente el mundo con el color de la música, algo más cada cuatro compases;
- cada fuente que suena (criaturas, plantas, objetos) suelta un aro de luz, hasta 10 a la vez;
- la hierba guarda algo del pulso.

Sin sonido no pasa nada; con movimiento reducido, ni aros que crecen ni oleadas.

Es solo dibujo y no cambia la música. `feedback.js` expone `soundCuesNow` para reutilizar sus avisos de nota.

Archivo nuevo: `world-music.js`. Recorrido: `tests/world_music_smoke.py`.

## Fase V3 · Fauna que convive · alpha.71

Rama `claude/fase-v3-fauna`, sobre `claude/fase-v2-clima`. Las criaturas de las tres familias (especies del suelo, habitantes de píxel y fauna de la capa viva):

- se mecen al pulso de la música;
- duermen con una «z» lejos del cubo: las de la capa viva siguen su propio descanso, el resto duermen dos de cada tres de noche; cerca del cubo despiertan;
- de día, dos vecinas de la misma especie se saludan con un corazón de píxel.

Cada 45 a 100 s cruza el cielo una bandada: pájaros de día, murciélagos de noche.

Es solo dibujo: movimiento, sonido y reglas de captura no cambian. Con movimiento reducido no hay balanceo, corazones ni bandadas.

La lista de criaturas vivas cercanas (`livingNear`) se calcula una vez por fotograma con `frameMemo`, en lugar de cuatro.

Archivo nuevo: `world-fauna.js`. Recorrido: `tests/world_fauna_smoke.py`.

## Fase V2 · Clima y viento · alpha.70

Rama `claude/fase-v2-clima`, sobre `claude/fase-v1-luz`.

- **Viento:** ráfagas que cruzan el campo en la dirección del viento del día (cambia cada día).
- **Paso del cubo:** la hierba se aparta a ambos lados.
- **Lluvia:** cuando llueve (tormenta o lluvia de notas), el suelo muestra salpicaduras, hasta 36 a la vez.
- **Sonido:**
  - lluvia de fondo, ruido filtrado y muy bajo;
  - de noche, fuera de mar, cueva, vacío y dunas, grillos breves repartidos a izquierda y derecha.

Todo pasa por el bus del juego y queda en silencio con el sonido apagado. Con movimiento reducido no hay ráfagas, estela ni salpicaduras.

Archivo nuevo: `world-weather.js`. `audio.js` expone `noiseBuffer` para reutilizar el ruido existente. Recorrido: `tests/world_weather_smoke.py`.

## Fase V1 · Luz y hora · alpha.69

Rama `claude/fase-v1-luz`, sobre `claude/fase-r-rendimiento`. El ciclo de día del mundo (diez minutos, ya existía y solo movía la niebla) se ve:

- **Noche:** un azul profundo cubre todo menos la linterna del cubo, las estrellas brillan más y salen luciérnagas (6 a 16 puntos).
- **Amanecer y atardecer:** un tinte cálido al amanecer y rosado al atardecer.
- **Hora real:** si es de noche en la hora del jugador, las noches del mundo son algo más oscuras.

Solo en la superficie; con movimiento reducido, las luciérnagas quedan quietas.

Coste: un degradado y unos 16 puntos por fotograma.

Archivos: `world-light-model.js` (pura, `tests/world-light.mjs`) y `world-light.js`. Recorrido: `tests/world_light_smoke.py`.

## Fase R · Rendimiento · alpha.68

Rama `claude/fase-r-rendimiento`, sobre `claude/charming-darwin-dvbfc7` (alpha.67). Primera de las [Fases 2026](docs/FASES_2026.md).

- Cada fotograma preguntaba unas 150 veces si había un panel abierto (`document.querySelector`) y 78 veces si se pedía movimiento reducido (`matchMedia`). Ahora `frame-state.js` contesta una vez por fotograma y los 68 módulos lo leen de ahí. Fuera del fotograma (teclas, temporizadores) se sigue preguntando directamente.
- La niebla dibujaba 18 degradados por fotograma; ahora reutiliza una mancha ya pintada por tono.
- Las partículas tienen un tope de 400.
- Con la pestaña oculta, el audio se suspende y vuelve como estaba al regresar.

Medido en Chromium local sin GPU, recorrido con sonido: media de 12,1 a 6,1 ms por fotograma, p95 de 16,2 a 9,0 ms. No equivale a una medición en un móvil físico. Catálogo de navegador local: `lab_score_smoke.py` comparaba el número de ondas en dos momentos y la onda de su propio toque podía terminar entre medias; ahora comprueba que abrir Sonido no lanza pulsos.

## Rendimiento con muchas piezas · alpha.67

Medido en Chromium local sin GPU, como tiempo de dibujo por fotograma tras un recorrido en ocho:

| Piezas puestas | Media | p95 |
|---|---|---|
| Ninguna | 8,3 ms | 12,8 ms |
| 16 piezas (Patitas, Enjambre, cara, cuatro hábitos, Jardín, Imitador, Eco rítmico y los cinco gestos) | 9,6 ms | 13,7 ms |
| Grafiti, Bola de disco y Fantasma | 9,8 ms | 14,1 ms |

Grafiti costaba 10,8 ms de media porque trazaba cada tramo por separado. Ahora agrupa los tramos por color y cinco pasos de desvanecimiento, con el mismo aspecto. La variación entre mediciones ronda ±0,8 ms. No equivale a una medición en un móvil físico.

## Tienda del cubo, tanda 4 · alpha.66

**Formas del pulso** (cada onda lleva su forma; el alcance es siempre el del pulso original):
- Cuadrado, Estrella, Doble anillo, Espiral y Rayo.
- Eco rítmico: dos ecos detrás de la onda, a una corchea.
- Cargado: brilla más cuanto más esperas entre pulsos, hasta 4 s. Sustituye a «mantén pulsado» para no cambiar los controles.

Una forma a la vez: comprar o elegir una devuelve la forma ganada al pulso original, y elegir una ganada la quita.

**Gestos** (puedes llevar varios):
- Pose: quieto 5 s.
- Voltereta: dos pulsos seguidos.
- Confeti: al ganar un logro o una recompensa de chispas.
- Baile: cuatro giros en 2,5 s.
- Baile de victoria: al volver de una actividad completada.

2770 ✦ en total. Nuevos `cube-shop-pulse.js` (dibujo de formas, también usado por las imágenes de la tienda) y `cube-shop-moves.js` (gestos), con un gancho más en `render.js`.

`tests/cube_moves_smoke.py` comprueba:
- las 12 piezas, en movimiento y quietas;
- que cada onda lleva la forma con el alcance y la forma de impacto del pulso original;
- la exclusión de formas;
- que cada gesto salta con su causa real;
- que todo se conserva tras recargar.

## Tu cubo, un solo lugar · alpha.65

Pedido por Jay: «Tu cubo» y «Viajar y chispas» se juntan en un solo panel. Arriba, el cubo vivo con todo lo que llevas y tus ✦. Tres pestañas:

- **Llevar:** lo ganado jugando y lo comprado, por ranura; tocar lo pone o lo quita al momento, sin Aplicar ni Cancelar. Un solo rastro a la vez.
- **Tienda:** solo lo que no tienes, con precio junto al nombre. Al comprar te lo pones y pasa a Llevar. Sin vista previa: cada imagen es el dibujo real de la pieza. `cube-shop-preview.js` la genera en una escena corta (andar, pararse, girar) usando los mismos módulos de dibujo del juego.
- **Viaje:** saltar, volver, meta, colecciones, título e historial.

El menú pierde «Viajar y chispas» y «Tu cubo» pasa a Jugar.

Corrige un fallo de alpha.64: si se reemplazaba la partida en marcha, el dibujo de rastros fallaba en cada fotograma; lo destapó `pet_smoke.py`.

Pruebas adaptadas sin quitar aserciones de comportamiento: `cube_editor`, `wardrobe`, `music_menu`, `musical_wonders`, `pet`, `pulse_forms`, `panel_polish`, `sparks_economy`, `game_loop` y las tres de la tienda. La de rastros además comprueba que un rastro ganado y uno comprado se excluyen.

## Tienda del cubo, tanda 3 · alpha.64

Rastros: Grafiti (pinta el suelo con los colores de la música y se borra en 25 s), Cometa, Huellas del día, Jardín (flores que crecen y se marchitan en 45 s) y Arcoíris (12 s tras romper tres cristales en 1,2 s). Compañeros: Nube, Pájaro (se posa encima al parar), Imitador (repite tu camino con 0,7 s de retraso, sin alejarse), Satélite DJ (avanza un octavo de vuelta por pulso; sin sonido gira despacio) y Fantasma de ayer (tu recorrido del día anterior en miniatura alrededor del cubo). 4750 ✦. Nuevo `cube-shop-world.js` con dos ganchos en `render.js`: rastros antes del cubo y compañero después. Huellas y Fantasma guardan `S.cubeRoute`: hasta 600 pasos de hoy y 120 puntos del último día jugado, solo en superficie y solo con una de esas piezas puesta; el resto vive en memoria y se reinicia al saltar. `tests/cube_trails_smoke.py` compra y equipa las 10, comprueba el arcoíris tras una cadena, el paso de hoy a ayer y la recarga.

## Tienda del cubo, tanda 2 · alpha.63

Ojos: Serio, Dormilón, Curioso, Travieso y Rubor. Hábitos, que se encienden juntos: Bostezo (quieto más de seis segundos), Saludo (guiña a la criatura que llega), Estornudo (aire de esporas, polvo o niebla) y Mareo (seis giros en tres segundos). Accesorios: Bigote, Gorrito, Gafas de sol y Monóculo. 900 ✦ en total. Nuevo gancho `drawCubeShopOver` en `render.js`; la cara se dibuja en píxeles enteros y, mientras llevas ojos, accesorio o hábitos, el cubo se dibuja con al menos 10 px (niveles 1 a 3; desde el nivel 4 ya los supera). Es solo dibujo: alcance y colisiones conservan el tamaño real. Con Enjambre la cara va en el primer mini cubo. Si un hábito necesita cara y no llevas ojos, usa unos ojos simples mientras dura. Solo dibujo y partículas, sin cambios de juego. `tests/cube_face_smoke.py` compra las 13, las ve en movimiento y quietas, dispara los cuatro hábitos y el rubor con sus causas reales y comprueba la recarga.

## Tienda del cubo, tanda 1 · alpha.62

Movimiento: Gelatina, Patinador, Pogo, Gusano, Ingravidez, Rodar, Patitas y Parpadeo. Cuerpo: Latido, Dado, Camaleón, Racha, Pecera, Origami, Ensamblaje, Bola de disco y Enjambre. Precios del catálogo (150 a 1.200 ✦). Nuevo `cube-shop-art.js` enganchado a `render.js`; solo dibujo, sin cambios de juego. `tests/cube_shop_smoke.py` compra y equipa las 17, comprueba que el cubo se ve en movimiento y quieto, y que lo equipado sobrevive a la recarga; la revisión visual ampliada corrigió Enjambre, Patitas y Racha en cubos pequeños.

## Tienda del cubo, tanda 0 · alpha.61

Nuevo `cube-shop-model.js` con las 14 ranuras del catálogo. Polvo viajero, Pulso facetado y Órbita personal pasan a Rastro, Forma del pulso y Compañero, y se pueden llevar las tres a la vez; lo equipado en guardados anteriores se migra a su ranura y `equipped` se conserva para dispositivos sin actualizar. Piezas de versiones futuras se mantienen mientras estén compradas. El panel de chispas agrupa la tienda por ranura. Pruebas: `tests/cube-shop.mjs` y equipar/quitar por ranura en `tests/sparks-economy.mjs`.

## Fase 2 y catálogo de la tienda · alpha.61

Fase 2: meta y título «Universo completo» (actividades, hallazgos, travesuras y esculturas); Polvo viajero visible con movimiento reducido; portales de actividad del 6 % al 15 % de celdas y esculturas del 1,5 % al 3 %, sin mover sitios existentes. Arreglos pedidos por Jay: «Viajar a otra semilla» y el catálogo de laboratorio ocultos en producción, con bloqueo de viajes a otras semillas; marca Kubono en todo lo visible (identificadores internos conservados); un lugar nuevo por día en lugar de en cada recarga. El tope de minería quedó descartado a favor de una tienda grande: catálogo aprobado en [Tienda del cubo](docs/TIENDA_DEL_CUBO.md), sin implementar.

## Fase 1 de pulido: integridad y textos · alpha.60

Rama `claude/charming-darwin-dvbfc7` desde `main` `9953eed`, tras la revisión completa del juego. Bitácora con etiquetas «Elementos», «Linajes» y «Caminantes» en lugar de cifras desfasadas (109/28 frente a 157/48 reales). Seis avisos y el Perfil dejaban de apuntar a «Menú → Guardar copia» u «Otros mundos», controles que ya no existen; ahora dicen qué pasó o nombran «Viajar a otra semilla». Retirado el panel de logros antiguo `mAch`, sin acceso. Viaje musical y galería reciben la × común. «Saltar · N ✦» se deriva de `SPARK_JUMP_COST`; el panel de chispas deja de invitar a ahorrar cuando ya tienes todas las apariencias; las insignias «en un paseo» reinician tarjetas y vecinos al saltar, como ya hacían distancia y ancla. Aviso breve al cambiar el día dentro del Mundo. Restaurar desde la nube una copia en el otro modo pasa por la transición normal: antes, elegir la copia online del Camino estando en el Mundo dejaba región y música del Mundo activas. `cloud_account_smoke.py` lo comprueba (falla sin la corrección) y su paso de Cuenta ya no compite con el aviso de divergencia.


## Fixture del visitante nuevo · tras 9953eed

CI de `main` sobre alpha.59: `logic`, `audio (1)` y `audio (2)` verdes, `browser` 130/131 por una carrera de tiempo en `first_level_smoke.py` (ventana del saludo). Solo cambia la fixture; sin cambios de producto ni versión.

## Recuperación configurable, borrado local y CI · alpha.59

Rama `claude/charming-darwin-dvbfc7` desde `feature/account-recovery-link` (`3175b41`). `recoveryUrl` en `cloud-config.js`, validado en `cloud-client.js` (local HTTP o HTTPS limpio) y aviso de puerto 3000 solo con destino local. Eliminar cuenta pide credenciales, luego confirmación, y tras el RPC `purgeUserStorage` borra en el dispositivo solo las claves de esa cuenta. Fixtures de navegador adaptadas a la cuenta obligatoria y al menú sin «Guardar copia»; `checks.yml` con historial completo en `browser`; `bump-version.mjs` reconoce la etiqueta «Versión del código» del README consolidado. Evidencia local: Node de cuentas y nueve recorridos en PASS; catálogo completo, Android y Supabase sin ejecutar. CI de `main` sigue rojo hasta integrar.

## Consolidación para revisión con Claude · 3175b41

Documentación vigente con índice y traspaso en raíz. Corregidas referencias a cuenta opcional, guardado manual, demo, firma por caché y migración pendiente. Plan de lanzamiento con decisiones actuales y estados separados de implementación/prueba/publicación. Documentos históricos identificados como archivo; evidencia anterior preservada y enlazada. 100 Markdown revisados (16 vigentes/84 históricos); 1661 enlaces locales sin roturas y referencias de código/locales comprobadas. Auditoría estática sin errores/avisos; selección de impacto: cero suites Node. Sin cambios de código, nuevas pruebas funcionales ni actividad Supabase.

## Retención gratuita · 32e2102

GitHub Actions configurado a siete días para nuevos logs/artefactos; workflows alineados y [CI aprobado](https://github.com/Jaywrkr/WHITEDOT/actions/runs/39455805125). Tarea local horaria con archivos permitidos para respaldos de migración y logs inactivos, sin incluir firma ni partida activa. Fixture vencida borrada, reciente/clave conservadas; aplicación real inicial cero borrados. Limpieza de Supabase preparada pero no aplicada por solicitud caducada. Trabajo detenido por Jay para revisión documental.

## Privacidad y producción · 8a8a20a, 200da32

Borradores de privacidad, eliminación y lista de producción. Jay aprueba público de 16 años o más y los plazos registrados en [configuración](docs/CONFIGURACION_PRODUCCION.md). Datos legales, país, mercados y correo público pendientes; no se activó verificación de edad ni se publicó política.

## Firma estable y migración · 165a356, c538a1d

[Compilación estable](https://github.com/Jaywrkr/WHITEDOT/actions/runs/39337750907), copia privada local y secreto CI; sin regeneración silenciosa de identidad por perder una caché. Actualización aislada mantiene 137 chispas y compra. Migración real autorizada en emulador: 280 archivos privados restaurados idénticos, cuenta conectada y saldo 52/72 ganadas/20 gastadas tras actualización y reapertura. Lanzador actualizado y respaldos locales retenidos temporalmente. Firma de vista previa, no de tienda.

## Cuenta obligatoria y progreso automático · alpha.55–58

Admisión antes del runtime, sesión persistente, guardados locales aislados por cuenta y conciliación automática cada cinco segundos. Sin invitado/demo ni controles normales de respaldo. Conflictos reales conservan ambas copias y piden elegir; CAS evita reemplazar revisiones ajenas. Reautenticación de eliminación corregida sin recarga prematura. Evidencia real PC/iPhone/emulador y pruebas enfocadas en [cuentas](docs/CUENTA_Y_RESPALDO.md), con límites explícitos.

## Entregas anteriores

[Registro detallado hasta alpha.58](docs/historial/CAMBIOS_HASTA_ALPHA_58.md) conserva comandos, revisiones, incidencias y pruebas de sus entregas. [Archivo anterior a la primera consolidación](docs/historial/CAMBIOS_ANTES_CONSOLIDACION.md). No usar las instrucciones antiguas de cuenta opcional, guardar manualmente o firmar solo con caché como comportamiento vigente.
