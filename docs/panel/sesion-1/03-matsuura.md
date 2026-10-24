# Panel creativo · Masaya Matsuura (simulación)

> Simulación respetuosa de cómo la filosofía de diseño conocida de Masaya Matsuura leería Kubono. No es su opinión real ni contiene citas textuales suyas.

## Quién es y cómo crea (con fuentes)

Matsuura fue músico pop antes que diseñador: con PSY·S grabó para CBS/Sony, y antes de PaRappa publicó software musical experimental (Tunin' Glue, Seven Colors). En la conversación con Shuhei Yoshida cuenta que entró en la industria porque los jugadores trataban esos experimentos como juegos de verdad [1]. Fundó NanaOn-Sha y codiseñó **PaRappa the Rapper** (1996) con Rodney Greenblat: Matsuura aportó el estilo musical y la idea de personajes recortados como papel; Greenblat, la forma final y el estilo gráfico [2]. Siguieron **UmJammer Lammy**, **Vib-Ribbon** (1999), Mojib-Ribbon, **Vib-Ripple** (2004, los niveles salen de las fotos del jugador), **Musika** (iPod, 2007) y **Project Rap Rabbit**, un Kickstarter de 2017 con iNiS que no alcanzó su meta [3][4].

Principios que aparecen en sus proyectos y entrevistas:

- **La restricción da forma.** Vib-Ribbon es una sola línea vectorial blanca. Ese estilo nació de su gusto por los primeros gráficos por computadora y de que el programa tenía que caber en la memoria de la PlayStation para poder sacar el disco y meter un CD de música del jugador [5].
- **La música del jugador genera el nivel.** Vib-Ribbon fue de los primeros juegos que usó música propia como banda sonora [6]. Vib-Ripple aplicó la misma idea a las fotos.
- **El cuerpo antes que el periférico.** Vib-Ribbon pide las dos manos porque Matsuura tocaba la batería [5]. Además, quiere que el atractivo esté en el software, no en un instrumento de plástico [7]. Raph Koster destaca que Vib-Ribbon llevó los acordes al ritmo de una manera propia [8].
- **Personaje y humor.** Vibri se degrada (conejo → rana → gusano) al fallar y evoluciona al acertar: el estado se ve en el personaje, no en un número [5].
- **Reconocimiento.** Vib-Ribbon entró en la colección de videojuegos del MoMA en 2012, junto con flOw, Passage y Canabalt (dato de mi memoria; la búsqueda sólo lo confirmó de forma indirecta [9]).

Fuentes:
1. PlayStation Blog, Matsuura y Yoshida sobre el nacimiento de PaRappa (2017): https://blog.playstation.com/archive/2017/04/04/masaya-matsuura-and-shuhei-yoshida-on-the-birth-of-parappa-the-rapper
2. Wikipedia, «PaRappa»: https://en.wikipedia.org/wiki/PaRappa · Time Extension, entrevista: https://www.timeextension.com/features/interview-music-is-pretty-much-all-i-think-about-parappa-the-rappers-masaya-matsuura-on-his-journey-from-pop-star-to-game-dev
3. GamesBeat, Project Rap Rabbit en Kickstarter: https://gamesbeat.com/pa-rappa-gitaroo-man-devs-put-rap-rabbit-rhythm-game-on-kickstarter/
4. Anime News Network, el Kickstarter no alcanza la meta: https://cdn.animenewsnetwork.com/news/2017-06-19/project-rap-rabbit-rhythm-game-kickstarter-fails-to-reach-goal/.117712
5. Wikipedia, «Vib-Ribbon»: https://en.wikipedia.org/wiki/Vib-Ribbon
6. Game Developer (Gamasutra), preguntas y respuestas sobre el estado de los juegos musicales: https://www.gamedeveloper.com/game-platforms/q-a-nanaon-sha-s-matsuura-i-parappa-i-on-the-state-of-music-games
7. Venus Patrol, extracto de esa entrevista: https://venuspatrol.com/2009/03/parappa-creator-matsuura-waxes/
8. Raph Koster, prólogo de Matsuura y comentario: https://www.raphkoster.com/?p=253
9. Cook & Becker, ficha del artista: https://www.cookandbecker.com/en/artist/22/masaya-matsuura.html · Gemubaka, entrevista (2012): https://gemubaka.com/2012/05/10/interview-with-nana-onshas-masaya-matsuura/ · Insert Credit Gaiden #4: https://insertcredit.com/gaiden/icg4/

*Limitación:* WebSearch funcionó, pero WebFetch no resolvía ningún dominio. Todo sale de los fragmentos de búsqueda y de mi conocimiento previo; no leí las entrevistas completas.

## Primer análisis

Vi las capturas del Camino, el primer minuto, el Mundo en móvil y el Refugio en escritorio, y leí `interactions.js`.

**Lo que funciona.** El Camino es casi Vib-Ribbon: un punto blanco, una línea de puntos y dos cristales sobre negro. Esa pobreza es un acierto. El código encola las acciones del jugador a la siguiente corchea (`beatSoon` → `q8`), así que el pulso siempre cae a tiempo. Es la decisión de PaRappa: el jugador nunca suena mal. El Refugio como cuatro partituras (horizontal = paso, vertical = nota) es la mejor idea del juego: una casa que es un instrumento. Las consignas de bioma («Los pilares son tambores. Choca con ellos.») son reglas de juego escritas como letras de canción.

**Lo que no funciona.** Leo demasiado antes de oír. «Día 1», «Era I · Pixel», «Caminado 0 m», «0 chispas», «Rompe cristales 0/10», un tutorial 1/6 y la ventana de bienvenida: siete textos antes de la primera nota. En el Mundo móvil el cubo mide unos 20 píxeles en una pantalla negra con glifos dispersos. No veo la música en ningún sitio: los objetos se encienden pero el ritmo no se dibuja. Nada te dice si fuiste preciso, porque la cuantización te salva siempre. Ese salvavidas es bueno para empezar, pero sin un premio a la precisión no hay dominio. Y el cubo no tiene cuerpo: Vibri se transformaba según cómo tocabas, y aquí el estado se mide en chispas.

| Eje | Nota | Justificación |
|---|---|---|
| Visual | 6,5 | El Camino y el Refugio son puros; el Mundo móvil es ilegible y no muestra la música. |
| Audio | 8 | Síntesis propia con géneros por región y acciones cuantizadas: el material es serio. |
| Creatividad | 8 | «El Refugio es una partitura» y «el mundo es tu canción» son ideas propias. |
| Sensación de juego | 5,5 | No hay error ni acierto rítmico ni cuerpo; arrastrar y pulsar no tiene peso. |
| Cohesión | 5 | La línea musical se pierde entre tienda, logros y moneda. |
| Pulido/accesibilidad | 6,5 | Hay lector de pantalla y movimiento reducido; la cuenta obligatoria cierra la puerta. |

## Lectura del jurado

Estoy de acuerdo con **Marina**: la música suena aunque no hagas nada. Yo iría más allá: debería existir un silencio que sólo el jugador pueda romper. **Iñaki** acierta en lo esencial. Vib-Ribbon tenía un personaje, una línea y cuatro obstáculos; Kubono tiene 81 piezas de tienda y 376 logros. Una idea fuerte no necesita acumulación. El «momento final» que pide **Ruth** me sirve sólo si es musical: una canción que se cierra, no un epílogo con texto. A **Lucía** le doy la razón con la cuenta y la vibración, pero a la «música visible» le pondría una condición: tiene que ser una sola línea, no un ecualizador decorativo. Con **Tomás** discrepo en parte: el negro no sobra, sobra el texto. Lo que no veo en el plan del jurado es lo que yo pediría primero: que el jugador **lleve el tiempo con el cuerpo** y que el juego le responda con un personaje que cambia.

## Notas finales

**Notas revisadas:** Visual 6,5 · Audio 8 · Creatividad 8,5 · Sensación de juego 5,5 · Cohesión 5 · Pulido/accesibilidad 6. La creatividad sube porque el Refugio-partitura merece más peso. El pulido baja porque el primer minuto está tapado por la cuenta y el texto.

**Los cinco cambios más importantes**

1. **La Línea.** Dibujar en Canvas 2D una sola línea blanca horizontal en el tercio inferior: el compás del bioma. Que se ondule con el bajo (con un `AnalyserNode` o, mejor, con los eventos del conductor) y que cada voz del jugador deje un pico en su paso. Es la música visible en un trazo; con movimiento reducido, la línea queda estática con marcas.
2. **Acierto con premio, nunca castigo.** Mantener la cuantización y medir la distancia al pulso real. Si el pulso cae dentro de unos ±60 ms, se dobla una voz (una octava o una quinta), sale un destello dorado en la Línea y suena un `navigator.vibrate(8)` donde exista. Fuera de esa ventana suena igual, sólo que sin el adorno. El jugador nunca suena mal, pero oye cuándo lo hizo bien.
3. **El cubo como Vibri.** Darle tres estados visuales a la forma del cubo según la racha a tiempo: cubo, cubo con aristas que vibran y cubo que se abre en líneas. Se guardan en la sesión, no en el perfil, así que el progreso no cambia. Este estado sustituye el contador de chispas en pantalla durante el juego.
4. **Silencio inicial y sin cuenta.** El Camino arranca mudo y sin HUD: sólo el cubo y un cristal. El primer pulso hace sonar la primera nota; cada cristal suma una voz, y al décimo la canción está completa y se abre el Mundo. La cuenta pasa a ser opcional y se ofrece después del primer viaje, migrando el progreso local. *Nota del redactor:* la cuenta opcional choca con una decisión vigente del proyecto (AGENTS.md); Jay tiene que decidir.
5. **El Refugio toca tu viaje.** Cada bioma visitado deja una frase de ocho pasos en la partitura del Refugio, sacada de las notas que tocaste allí. Volver a casa es oír tu recorrido como canción. Son datos nuevos que se suman sin tocar las semillas ni el RNG.

**Qué cortar u ocultar:** «Día», «Era», «Caminado» y el contador de chispas fuera del menú. La tienda, reducida a lo que cambia el sonido o la forma del pulso, con lo demás oculto tras el primer final. Los logros, fuera de la vista: que la Bitácora los muestre como constelación, sin cifra. Los saltos de pago, el autopiloto y los «encuentros traviesos» sólo después del primer cierre.

**Momento firma:** en el Vacío («Nada. Solo tú y tus notas.») se apaga todo menos la Línea. El jugador toca y, si mantiene ocho compases a tiempo, la Línea se enrolla y forma el contorno de su Refugio, que empieza a sonar con todas las frases del viaje a la vez. Ese es el final: una canción que el jugador compuso sin saberlo.

**Cómo llevaría el proceso:** primero el sonido y después la imagen. Una semana sólo con el Camino, sin texto, hasta que Luca entienda qué hacer sin leer. Después, la Línea y el acierto, probados con el sonido apagado: si el juego todavía se entiende, la vista funciona. Restringirse a propósito, con un solo color por bioma y una sola línea. Cada sistema que no haga sonar algo se queda fuera del primer viaje. Probar con personas que no juegan, como en PaRappa, y mirar si mueven la cabeza al ritmo.
