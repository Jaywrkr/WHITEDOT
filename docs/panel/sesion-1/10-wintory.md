# 10 · Austin Wintory (simulación)

> Simulación respetuosa de cómo leería Kubono la filosofía pública de Austin Wintory. No es su opinión real. Las fuentes se consultaron mediante resultados de búsqueda web; la descarga directa de las páginas falló por DNS, así que algunos detalles se completan con conocimiento previo y se indican como paráfrasis.

## Quién es y cómo crea (con fuentes)

Compositor estadounidense de flOw, Journey, The Banner Saga, ABZÛ, The Pathless y Erica. Journey fue la primera partitura de videojuego nominada en la categoría Best Score Soundtrack for Visual Media de los Grammy de 2013, junto a películas como Hugo o The Artist ([Wikipedia](https://en.wikipedia.org/wiki/Austin_Wintory); [Engadget](https://www.engadget.com/2012-12-06-journey-soundtrack-receives-grammy-nomination.html); [Engadget, camino a los Grammy](https://www.engadget.com/2012-12-27-austin-wintorys-journey-to-the-2013-grammys.html)).

Rasgos de su método:

- **Un solo tema que evoluciona.** Ha dicho que Journey tiene un único tema que se transforma durante todo el juego; «Nascence» lo expone limpio, y sus notas de pista afirman que de esas notas sale todo lo demás, aunque esa versión exacta no suena en el juego ([The Sixth Axis](https://www.thesixthaxis.com/?p=130533); [Destructoid](https://destructoid.com/?p=126775)).
- **El jugador es el solista.** Describe Journey como un concierto para chelo: el chelo (Tina Guo) eres tú y la orquesta es el mundo, incluidos los otros jugadores ([The Sixth Axis](https://www.thesixthaxis.com/?p=130533); [Game Informer, regrabación de 2022](https://gameinformer.com/2022/03/13/why-austin-wintory-re-recorded-journeys-soundtrack-10-years-later)).
- **Composición con implementación.** Cuenta que no escribía una pieza sin indicaciones detalladas de thatgamecompany sobre cómo se iba a implementar, y que la refinaba una vez dentro del juego ([The Sixth Axis](https://www.thesixthaxis.com/?p=130533)). En la GDC de 2012 comparó Journey y Monaco para explicar cómo conciliar adaptabilidad y musicalidad ([GDC Vault](https://gdcvault.com/play/1015342/Journey-vs-Monaco-Music-is)).
- **Mundo abierto ≠ arco ausente.** Sobre The Pathless explicó que su equipo ajustaba constantemente cuándo acompañar en silencio al que vaga y cuándo inyectar emoción sin disculpas; los jefes funcionan como hitos que suman heroísmo aunque se derroten en cualquier orden ([PlayStation Blog](https://blog.playstation.com/2020/11/04/inside-the-layered-global-music-of-the-pathless/); [MusicTech](https://musictech.com/features/interviews/austin-wintory-the-pathless-soundtrack/)).
- **Clímax ganado.** El final de Journey («Apotheosis») reúne chelos, violas, arpa y coro como cierre del mismo tema ([NME](https://www.nme.com/features/journey-anniversary-austin-wintory-traveler-soundtrack-3181421); [GameSpot](https://www.gamespot.com/articles/sound-byte-journey/1100-6326086/)).

## Primer análisis

Lo primero que noto es lo honesto que es el gesto: un cubo blanco sobre negro, y el mundo es música. Es la misma apuesta que flOw y Journey: quitar todo hasta que el sonido sea el personaje. Y bajo el capó hay oficio real. El conductor musical (`musical-conductor.js`) alinea cada contacto con la rejilla y las salas de producción hacen fundidos sin cortar frases. Los biomas tienen escala y tempo propios (Lago lidio y lento, Cueva frigia a −22, Vacío sin percusión). Las acciones del jugador entran cuantizadas a la siguiente corchea, y si aciertas el pulso se suma una tercera y luego una quinta arriba. Eso ya es pensar como compositor.

Lo que no funciona es que **no hay tema**. Hay 52 géneros, 11 biomas e híbridos, pero no una melodía que yo pueda tararear al salir. El jugador toca `nextMel()`, un paso por la escala según la dirección vertical: es un gesto, no una identidad. El cubo no tiene voz propia. En Journey el chelo eres tú; aquí tu voz cambia de timbre en cada región, así que no hay solista, solo orquesta.

Segundo problema, el arco. Las capturas muestran un HUD que cuenta (día, metros, chispas, 0/10) y una música que no deja de sonar con la misma intensidad. Encontré algo precioso que casi no se usa: en el Camino, si dejas de tocar, el juego te devuelve tus últimas notas una octava abajo (`MU.motif`). Eso es una conversación. Pero solo pasa fuera del Mundo, justo donde más falta haría.

El Refugio como partitura (cámaras con compás de 16 pasos) es la mejor idea visual del juego, pero en la captura dice «0 sonando»: el lugar que debería contener tu viaje empieza mudo.

| Criterio | Nota | Justificación |
|---|---|---|
| Visual | 7 | Lenguaje claro y propio; en móvil el Mundo se lee como vacío con glifos diminutos. |
| Audio | 8 | Motor serio y bien mezclado; sin tema ni solista, la variedad sustituye a la identidad. |
| Creatividad | 8 | «El universo suena y tú lo cambias» es una premisa de autor. |
| Sensación de juego | 6 | El acierto rítmico existe pero apenas se oye ni se siente en la mano. |
| Cohesión | 5 | Tienda, chispas y logros hablan otro idioma que la música. |
| Pulido/accesibilidad | 6,5 | Cuenta obligatoria al inicio; buen trabajo de lector de pantalla y teclado. |

## Lectura del jurado

Coincido con Marina y Ruth, y añado la causa. Marina pide respuesta instantánea y clímax; Ruth pide arco y final. Las dos cosas se resuelven con lo mismo: **un tema**. Un clímax sin tema solo sube el volumen; un final sin tema es una pantalla de créditos. El tema da al jugador algo que reconocer cuando vuelva transformado.

Con Iñaki estoy de acuerdo en el fondo: tantos sistemas paralelos fragmentan el oído igual que la vista. Cada sistema trae su campanita, y eso es ruido semántico. Discrepo un poco de la F3 del jurado («cambio audible en menos de un compás»): está bien como piso, pero en mundo abierto lo difícil no es reaccionar rápido, sino saber cuándo **no** reaccionar. En The Pathless se decidía a mano cuándo acompañar y cuándo empujar. Lucía tiene razón con el tacto: la vibración en el tiempo fuerte es una percusión más.

## Notas finales

**Puntuación revisada:** Visual 7 · Audio 7,5 (bajo un punto: tras leer el código, la ausencia de tema es estructural) · Creatividad 8 · Sensación 6 · Cohesión 5 · Pulido 6,5.

**Los cinco cambios más importantes**

1. **El tema del cubo.** Cinco o seis notas fijas por intervalos, no por alturas (por ejemplo 0, +2, +7, +5, +4, 0). Se guarda como dato, no consume el RNG antiguo y no toca guardados. Cada bioma lo reharmoniza con su escala vía `consonantPitch`: menor en Llanura, lidio en Lago, frigio en Cueva, solo en Vacío. La generación sigue libre a su alrededor; el tema es el ancla. Una sola voz fija para el cubo (un `p_cellobody` o `lowbow` con vibrato lento), igual en todos los biomas: el solista no cambia de instrumento.
2. **Acción → música en tres escalas.** Inmediata: cada pulso es una nota del tema, no un paso de escala; diez pulsos seguidos completan la frase. En el compás: si aciertas el tiempo, el bioma contesta con la frase siguiente (el `MU.resp` del Camino, llevado al Mundo). En la región: lo que haces abre capas (como los Faros) que se mantienen mientras sigues ahí. Y una regla de silencio: si no tocas en ocho compases, el mundo baja a pedal y espera.
3. **Arco en tres estados por bioma.** Llegada (pedal y tema fragmentado), Pertenencia (groove completo, tema en la voz del mundo) y Plenitud (tema completo en tutti, una vez por bioma, al cumplir su consigna). La Plenitud se recuerda en el guardado, añadiendo un campo nuevo sin migrar nada.
4. **Final: el Refugio toca tu viaje.** Al llevar el tema a Plenitud en, por ejemplo, siete biomas, el Refugio se enciende solo: cada cámara toca la variación del tema de un bioma visitado, en el orden en que los descubriste, y convergen en una versión completa con todas las voces. No se cierra el juego; después sigue siendo infinito, pero ya tiene un hito.
5. **Afinar la cohesión sonora.** Una paleta de sonidos de interfaz derivada del tema (la tienda, los logros y las chispas usan sus dos primeras notas, muy suaves) y vibración en el tiempo fuerte cuando aciertas.

**Qué cortar:** la variedad de voces del pulso en la tienda (el solista no se vende por piezas; que se vendan colores, no la voz), las campanas de logro durante la música y las cifras del HUD durante la Plenitud. Al menos en la build de festival, los 52 géneros se reducen a los once biomas más claros.

**Momento firma:** en el Vacío, sin percusión ni armonía, el cubo toca el tema solo. Tras un compás de silencio, cada criatura que te siguió en el viaje responde desde lejos con la frase siguiente, en su timbre. Es el mismo principio de Journey: los otros forman la orquesta, tú eres el solista.

**Cómo llevaría el proceso:** primero el tema, escrito y cantado, antes de tocar código. Después, una sesión semanal compositor-diseñador con el juego abierto, sin escribir nada que no tenga su regla de implementación. Haría renders de cada bioma en los tres estados y los escucharía en orden, como un disco: si no se oye un viaje, no está terminado. Haría pruebas con Luca y cinco personas más, preguntando una sola cosa: «¿qué melodía recuerdas?». Si nadie puede tararear nada, se vuelve al paso uno.
