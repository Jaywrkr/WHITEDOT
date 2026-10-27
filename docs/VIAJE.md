# El Viaje · diseño vigente

Candidato **alpha.216**. El Viaje enseña a participar en la música y abre el Mundo libre; el Refugio queda voluntario. [Reglas](MUNDO.md) · [estado y pendientes](../HANDOFF.md).

## Recorrido

| Etapa | Qué se aprende |
|---|---|
| Camino | Acercarse, mover el cubo, pulsar y recoger diez luces. Solo abre el Mundo la primera vez (D7-C) |
| Llanura | Pegar elementos cercanos |
| Lago | Encadenar flores |
| Bosque | Rodear y cerrar una vuelta |
| Tormenta | Participar en el ritmo del rayo |
| Vacío | Soltar estrellas con espacio |
| Cierre | Reconocer tu frase y continuar al Mundo libre |

El código conserva siete IDs de capítulo (`camino`, cinco lugares y`refugio`); el último identifica el cierre, no una visita obligatoria a la casa. Los juegos actuales están registrados en `journey-games.js`; las reglas/momentos anteriores siguen como compatibilidad y comparación, no como instrucciones paralelas.

La duración objetivo es15–20min, pendiente de sesiones reales. Las antiguas tablas de40min y el Festival reducido al Lago quedaron sustituidos.

## Ritmo y frase propia

El pulso encaja con la escala y el reloj del lugar. En el Camino, los capítulos y las rondas de lugar, tocar en cualquier punto del lienzo es el pulso y suena al apoyar el dedo (D2-A, panel 10, P6); si el dedo se arrastra, el cubo camina, y si descansa, se abre el escáner. En el Universo abierto también suena al apoyar (panel 11, Q6, D11-B): un solo gesto en todo el juego; mantener 500 ms abre el escáner y arrastrar camina. Solo el modo dedo de las pruebas (`?dedo`) juzga el vacío al soltar, para sus gestos sobre objetos; ahí un toque quieto que no abre el escáner es pulso, dure lo que dure (Q5). La guía dice «Toca al ritmo. Arrastra para moverte.». Los aciertos avanzan el juego y guardan notas, pasos y ticks para el cierre; un toque fuera de tiempo no borra lo ganado. En el Mundo libre, recoger fragmentos también paga su base fuera de tempo.

`journey-pulse.js` define el tema en grados `[0,1,4,3,2,0]`, con duraciones `[3,1,4,2,2,4]` en corcheas. La voz depende del contexto musical; no hay un instrumento separado de premio. La ventana base es±80ms y Maestro la estrecha. No fijar un único tempo para todo el universo.

`journey-rhythm.js` distingue patrones por lugar y canta dos compases de demostración. La Línea anticipa el golpe y diferencia espera de acierto. Colas visuales usan tiempo audible estimado y conservan la nota actualmente oída aunque se programe otra futura.

El golpe se ve junto al cubo (panel 10, P3). Un anillo de 1 px se cierra sobre el cubo en los cuatro pasos previos a cada paso que cuenta, con el mismo `approach` y el mismo reloj que la Línea; es dorado en el «1». No cambia el tamaño del cubo; con movimiento reducido no se mueve, solo se ilumina. El dedo fantasma es un anillo de 1 px con punto de 3 px junto al cubo (caja de 14×14, centro a ≤ 30 px). Marca los pasos del lugar (`journeyRhythmState().steps`) en tiempo audible. La Línea tiene base de alfa .38 sobre una franja negra y el «1» dorado cuando cuenta. Las marcas de capítulo miden 4 px y solo se ven dentro de un capítulo. Las chispas doradas vuelan a la posición real de `#bar` (`barTarget` en `journey-games.js`).

Un solo reloj (panel 10, P5). Toda luz que acompaña a una nota espera a que se oiga: `cueDelay`, `audibleTime` o `scheduleAudibleCue` (`journey-pulse.js`). El retraso visual es la latencia de salida más el ajuste medido por la calibración (`latencyNudge`), nunca negativo. Así se mueven juntos la Línea, el anillo, el dedo fantasma, el aterrizaje del acierto y las luces del Mundo. El juicio no cambia (±80 ms, `heardTime`).
Un golpe, una imagen: el acierto golpea el cubo una vez, al oírse (`cubeKick`); cualquier otro pulso lo engorda cuando suena su nota cuantizada, no al tocar. La onda nace con su nota (panel 11, Q5): se crea en el punto del toque y se dibuja, y empieza a alcanzar objetos, cuando su nota se oye (`cueDelay`). Esa espera no caduca: la onda juega. Al tocar solo aparece la marca de la Línea.
El toque fuera de tiempo suena en la siguiente semicorchea ya programada a 20 ms o más (`touchSlot`, `touchSoon` en `audio.js`), no en el siguiente paso aún sin programar. Comparte el límite de 4 voces por paso con la cola. Si no hay paso libre, espera en la cola como antes. Modelo a 96 BPM: del toque a la nota, mediana 98 ms y p95 167 ms (antes, 195 y 265). Notas, voces y mezcla no cambian; solo se adelanta el momento.
Un oro por golpe (D10-B): en el acierto solo son dorados el marco del cubo y el «1» (del anillo y de la Línea). La onda, la marca de la Línea y el arco del acierto (`hitFlash`) son blancos. El tic de la ronda y los cuadros del eco en la Cueva no cambian.
Ningún toque mudo: un pulso demasiado seguido (240 ms; dos tercios de corchea en ritmos de corcheas, `journey-rhythm.js`) no se juzga, deja la marca gris y suena con la misma voz al 45 % en la siguiente semicorchea a 20 ms o más. Cada paso toca como mucho 4 de la cola y de estos toques; con más de 8 pendientes (un dedo desbocado) el resto se descarta.

## Presentación y ayuda

Negro, cubo pequeño, marcas contenidas y color ganado. Los rótulos del paisaje y la economía se reducen durante el Viaje. Menús y controles son silenciosos; no usan notas del tema como sonido de UI.

El color se gana y se ve (panel 10, P7, D4). Un bioma pálido recupera su color en un compás (2,4–3 s): el gris se retira en un círculo que nace en el cubo y llega al borde, con un frente fino de su color; con movimiento reducido, un fundido del mismo largo. Después el color va en las formas como pigmento (mezcla `color`, `world-sheet.js`), no como velo: el fondo sigue negro. El amanecer y el atardecer tiñen solo la luz del cubo. Las marcas de capítulo hechas toman el color de su lugar; el portal de un capítulo completo también. El Camino del Viaje no escribe «Pulso»: el cristal cercano late con el golpe. Durante el Viaje y las rondas, caminantes y criaturas de píxeles bajan a un tercio de brillo (`faunaDim`). Lago, Dunas y Ruinas llevan menos textura de suelo (`textureWeight`). En la Cueva, la llama roja se queda; los cuadros del eco son blancos (el canto) y dorados (tu acierto), de 7 px en una línea.

La ayuda se consulta en menú → Cómo jugar y destaca una acción actual. La primera demostración enseña jugando; no depende de leer una lista larga. Los resultados y el narrador aparecen en su contexto, con salidas y foco accesibles.

La aportación personal se guarda de forma aditiva y compatible: notas históricas sin ticks siguen interpretándose. No reemplazar las frases ni borrar progreso para adaptar una versión nueva.

## Final de los cinco capítulos

`journey-finale.js` reconstruye tus frases y el tema con voces suaves existentes, armonizadas al contexto. El tema suena con sus alturas, como lo toca el cubo, sin llevarlo al acorde (panel 11, Q7, D8-B): en La mayor, La Si Mi Re Do♯ La, dos veces igual, en el chelo y en una octava del registro 52–76. Tus frases sí van al acorde. Su partitura abstracta y el arreglo audible son capas distintas; leer la partitura sola no demuestra cómo suena.

El cierre dice solo «Tu mundo se abrió», con los seis anillos apagados; los créditos de autoría quedan para el final de los once (D5-C). La UI nombra la frase que está sonando. El fondo no salta el final al tocarlo; **Seguir explorando** se habilita tras dos segundos, y Escape/salida normal conservan el cierre. Esperar, omitir o explorar terminan en Mundo libre con rumbo al siguiente lugar. **Explorar a pie** es un botón blanco. Después del cierre no sale ningún aviso de texto; «Prólogo» va a la Bitácora sin aviso (panel 11, Q1). No llevan al jugador al Refugio como destino obligatorio.

Guardar el cierre debe funcionar antes de darlo por terminado. Una falla deja posibilidad de reintento. La configuración musical actual se conserva; reconocimiento y emoción requieren escucha real.

## Festival

`?festival=1` recorre Camino y los cinco capítulos hasta sus créditos. `kubono:festival` guarda aparte del jugador; **Otra persona** reinicia esa copia. No incluye el anillo posterior, la tienda ni una demostración comercial pública. No es el antiguo recorte que terminaba en Lago.

## Continuación

Tras el Viaje quedan seis lugares nuevos en orden: Jardín, Dunas, Cristales, Faros, Ruinas y Cueva. Los once completos abren el final de Tu canción;33★, su versión maestra. Detalle en [El mundo](MUNDO.md).

## Verificación y límites

La entrega E comprobó entrada, ayuda, lectura, cierres y memoria de frases sin rehacer música ni mundos. [Resultados](panel/candidato-e/informe.md) · [protocolo humano](PRUEBAS_CON_PERSONAS.md). Una simulación de duración o un render no prueba comprensión, emoción ni gusto. Los planes anteriores se conservan en Git y las entregas históricas del [índice](README.md).
