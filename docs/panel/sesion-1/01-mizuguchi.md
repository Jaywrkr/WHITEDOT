# Panel creativo · Tetsuya Mizuguchi (simulación)

> Simulación respetuosa de cómo leería Kubono la filosofía de diseño conocida de Mizuguchi. No es su opinión real. No hay citas inventadas: todo es paráfrasis con fuente. Nota de método: la búsqueda web funcionó, pero WebFetch no pudo abrir las páginas (error de DNS), así que trabajé con los resúmenes de búsqueda y con lo que ya sabía. Las fuentes de abajo deberían verificarse antes de citarlas en público.

## Quién es y cómo crea (con fuentes)

Productor y director japonés. En Sega Rally y Space Channel 5, después **Rez** (2001, United Game Artists), **Lumines** y Every Extend Extra (Q Entertainment, PSP), **Child of Eden** (2011, Kinect), **Rez Infinite** (2016, PS VR, con el nuevo Area X) y **Tetris Effect** (2018, Enhance, con Monstars y Resonair). Rez Infinite y Tetris Effect recibieron premios importantes y nominaciones de la industria; Tetris Effect fue candidato a juego del año en The Game Awards 2018.

Principios recurrentes:

1. **Sinestesia como objetivo, no como decoración.** Kandinsky es su referencia explícita: un pintor que intentaba hacer sonar lo que se ve. Antes de diseñar sistemas, Mizuguchi pregunta qué sensación debe unir oído, vista y tacto ([PlayStation Blog, 2016](https://blog.eu.playstation.com/2016/03/17/how-tetsuya-mizuguchi-was-inspired-to-make-rez-infinite-on-playstation-vr); [Meta/Oculus](https://www.meta.com/blog/introducing-rez-infinite-for-pc-and-rift-plus-rez-oculus-avatars-coming-soon/)).
2. **Cuantizar la acción a la música.** En Rez cada disparo y explosión cae a tiempo y en tono; él lo compara con un DJ que sincopa la realidad a la música ([PlayStation Blog, Area X](https://blog.playstation.com/archive/2016/09/20/why-the-all-new-area-x-might-be-the-most-exciting-level-of-rez-infinite/); [Time Extension, «The Making of Rez»](https://timeextension.com/features/the-making-of-rez-tetsuya-mizuguchis-timeless-masterpiece)).
3. **El cuerpo y el tacto.** El Trance Vibrator, el Synesthesia Suit para Rez Infinite y su interés por la háptica del PS5. En Child of Eden quería quitar la «prótesis» del mando para que el jugador fuera un director de orquesta ([Kill Screen](https://www.killscreen.com/synesthesia-and-vibrators-a-history-of-innovation-from-rez/); [State Press, 2011](https://www.statepress.com/article/2011/06/qa-child-of-eden-with-tetsuya-mizuguchi); [VGC](https://videogameschronicle.com/news/mizuguchi-confirms-next-gen-project-and-says-rez-infinite-was-a-prologue)).
4. **Emoción por encima de la mecánica.** Ha dicho que si Tetris Effect se hubiera leído solo como «Tetris con buena música», habría fracasado. La meta es una respuesta emocional nueva ([Wccftech, 2019](https://wccftech.com/interview-tetsuya-mizuguchi-synesthesia-tetris-effect-rez-lumines/amp/)).
5. **Mecánica familiar y un viaje con arco.** En Tetris Effect la regla debía reconocerse al instante, y la novedad era la emoción del recorrido del modo Journey ([GamesBeat](https://gamesbeat.com/tetsuya-mizuguchi-interview-taking-tetris-on-a-ps-vr-acid-trip/)).

**Cómo trabaja.** Proyectos largos con iteración paciente: Tetris Effect tardó unos 15 años desde la idea hasta su lanzamiento. Trabaja con músicos dentro del equipo: Genki Rockets, Takayuki Nakamura, Hydelic y Adam Freeland, que analizó con él la Area 5 ([PlayStation Blog EU](https://blog.eu.playstation.com/2017/10/20/classic-levels-deconstructed-tetsuya-mizuguchi-musician-adam-freeland-dissect-rez-infinites-area-5)). En Lumines alternaron entre empezar por el sonido o por la imagen en cada skin ([Wikipedia, Lumines](https://en.wikipedia.org/wiki/Lumines)). Prototipa la latencia antes que nada: el primer jugable de Child of Eden era malo porque el sonido llegaba tarde, y eso era lo primero que había que arreglar ([Game Developer](https://gamedeveloper.com/design/-i-child-of-eden-i-mizuguchi-demos-his-orchestra-of-blips)). Su postmortem de Rez en GDC 2016 cuenta la misma idea: primero la sensación y luego todo lo demás ([Game Developer, historia oral](https://gamedeveloper.com/audio/oral-history-of-i-rez-i-recounts-a-marriage-of-game-and-music)).

## Primer análisis

**Lo que funciona.** La premisa es suya casi por herencia: un cubo blanco en un vacío negro, un universo que suena y acciones que tocan voces. Hay buen oficio musical. El código programa en el reloj de Web Audio, tiene una cola de octavos (`q8` en `src/audio.js`) que coloca sonidos en la rejilla, una función `onBeatNow` y comentarios como «todo cuantizado a tempo con la escala del lugar» (`src/materia.js`). El camino inicial, con un punto de luz, dos cristales y un rastro de puntos, tiene la pureza de un primer nivel de Rez. El Refugio como partitura (eje horizontal para el compás de 16 pasos, eje vertical para la nota) es la mejor idea sinestésica del proyecto: el espacio se convierte en música.

**Lo que no.** La sinestesia está en el código, pero no en la pantalla. En las capturas del Mundo casi todo es negro, con glifos de 10 px y el cubo diminuto. La música no se ve: nada late, nada pulsa con el bombo y el color del bioma apenas se nota. El primer contacto pasa por una cuenta, contadores de «chispas», «Caminado 0 m», «Era I · Pixel» y una guía de seis pasos. Es el polo opuesto a la entrada de Rez, donde se pulsa y ya hay música. No encontré `navigator.vibrate` ni ninguna háptica: el cuerpo no participa. Tampoco hay un viaje con arco: once biomas de igual intensidad equivalen a un modo zen sin Journey.

| Eje | Nota | Justificación |
|---|---|---|
| Visual | 6 | La estética es coherente, pero la música no se ve. El Mundo es demasiado oscuro y pequeño en el móvil. |
| Audio | 8 | El motor generativo es serio y se cuantiza en parte. Le falta un clímax y que cada acción sea la protagonista. |
| Creatividad | 8 | El Refugio como partitura y los continentes con género son ideas propias. |
| Sensación de juego | 5,5 | El pulso no tiene peso corporal. No hay tacto, ni sacudida en el beat, ni respuesta inmediata. |
| Cohesión | 5 | La economía de servicio (tienda de 81 piezas y 376 logros) compite con el flujo. |
| Pulido/accesibilidad | 6 | Hay lector de pantalla y movimiento reducido. Pierde puntos por la cuenta obligatoria, el exceso de texto y la falta de háptica. |

## Lectura del jurado

**Coincido** con Marina: la música debe responder al instante. Para él, esto no es solo un ajuste: es la tesis entera. También con Ruth: le falta arco y final, y Tetris Effect resolvió ese problema con el modo Journey. Lucía acierta con el tacto, que en su trayectoria es tan importante como el sonido.

**Discrepo** del orden del plan. El jurado empieza por una build de festival (F1) y por quitar sistemas (F2), y deja la respuesta musical para F3 y la sensación para F5. Él lo invertiría: se prototipa primero la latencia y la sensación del pulso, porque si el primer segundo no emociona, ninguna limpieza lo salva. También creo que el jurado subestima el Refugio. Lo trata como uno más entre muchos sistemas, cuando es el corazón sinestésico y debería ser el destino del viaje, no un menú.

**Lo que no vieron:** (1) La **luz como instrumento**: el jurado pide «música visible», pero nadie propone que el bombo mueva la luz del mundo entero, como hace Rez con su cuadrícula. (2) La **cuantización como regla de diseño**: no basta con que la música cambie en menos de un compás. Cada acción debe caer en la rejilla rítmica y en la escala del lugar. (3) La **colaboración con un músico**: el juego necesita un oído externo que componga los clímax, no solo sistemas generativos.

## Notas finales

**Notas revisadas:** Visual 6 · Audio 8 · Creatividad 8 · Sensación 5,5 · Cohesión 5 · Pulido 6 → **media 6,4**. No las cambio: el jurado puntuó el potencial, y él puntúa lo que se siente hoy.

**Sus 5 cambios (Canvas 2D + Web Audio, sin tocar el progreso):**

1. **Cuantizar el pulso y los cristales a la rejilla.** El sonido sale en el siguiente semicorchea con la nota de la escala del bioma, y el destello visual se programa en ese mismo instante (`ac.currentTime` → `setTimeout`, como ya hace `q8`). Si el jugador pulsa en `onBeatNow`, el golpe es más grande, abre más el filtro y deja más rastro. La recompensa es el ritmo, no las chispas.
2. **El mundo late.** Un `beat()` global (ya existe) escala el halo del cubo, la luminosidad del fondo y el tamaño de los glifos en cada negra. El color del bioma ocupa el 15–25 % de la pantalla en gradientes radiales, no solo en los puntos. En móvil, la cámara se acerca para que el cubo y la fauna midan como mínimo 3 veces su tamaño actual.
3. **Tacto.** Usar `navigator.vibrate` con patrones cortos en el bombo durante el pulso, en la rotura de cristal y en el clímax, y añadir un ajuste para desactivarlo. Donde no haya vibración, usar un leve temblor de cámara (respetando el modo de movimiento reducido).
4. **Un viaje.** Crear un modo «Viaje» curado de 30–40 min con 5 biomas en orden de intensidad creciente, modulación tonal entre ellos y un pico en Tormenta antes del silencio del Vacío. Se guarda como una ruta de semillas existentes y no consume RNG nuevo.
5. **Entrada sin fricción.** El primer pulso suena antes de cualquier texto. La cuenta se pide después del primer bioma, sin perder nada. Las cifras de chispas, metros y era se ocultan hasta que el jugador abre el menú.

**Qué recortar u ocultar:** «Caminado 0 m», «Era I · Pixel» y «Día N» del HUD. Las chispas solo aparecen al comprar. La tienda, los 376 logros, las travesuras, las actividades y los saltos de pago salen del primer contacto y se esconden tras «Tu cubo». El autopiloto se mantiene, porque es buen modo contemplativo.

**Momento firma:** **«El Refugio toca tu viaje».** Al terminar el Vacío, el cubo vuelve al Refugio y las cuatro cámaras se llenan solas con una nota por cada bioma recorrido, en el orden en que los visitaste. Suena como una partitura que crece: primero en monocromo y luego con el color de cada bioma, mientras la cámara se aleja hasta mostrar la constelación del recorrido. Termina en silencio y el cubo es el único punto blanco. Todo se hace con datos ya guardados (constelación de recorridos, cámaras de 16 pasos) y no se borra nada.

**Cómo llevaría el proceso:** (1) Un prototipo de sensación de una semana, solo con el cubo, el pulso y un bioma, medido con un osciloscopio de latencia (tiempo entre toque y sonido, objetivo < 50 ms) y probado a ciegas con auriculares. (2) Un músico externo como coautor de los clímax y las transiciones, con sesiones en las que se toca el juego como un instrumento. (3) Pruebas de juego observando el cuerpo, no las respuestas: si la gente mueve la cabeza al ritmo, sonríe o se queda quieta en el silencio, como hacía Mizuguchi en sus demos de club y de VR. Luca y diez desconocidos juegan sin instrucciones. (4) Solo cuando el primer minuto emociona se vuelve a la tienda y a los logros.
