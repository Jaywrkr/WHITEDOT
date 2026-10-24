# Jenova Chen lee Kubono (simulación)

> Simulación respetuosa de cómo su filosofía de diseño conocida leería el juego. No es su opinión real. Las ideas atribuidas son paráfrasis de las fuentes citadas, no citas.

## Quién es y cómo crea (con fuentes)

- **Flow como tesis.** Su máster en el Interactive Media Program de USC (2006) trató el ajuste dinámico de dificultad: el juego se adapta al jugador sin que este lo note. flOw nació ahí: el jugador baja de plano cuando quiere y elige qué comer. Así controla su propia dificultad. [Wikipedia: Flow](https://en.wikipedia.org/wiki/Flow_(video_game)) · [Gamasutra, entrevista](https://gamedeveloper.com/design/go-with-the-i-fl0w-i-jenova-chen-on-console-independence)
- **El artículo de 2007.** En «Flow in Games (and Everything Else)» (*Communications of the ACM* 50:4) dice que un buen juego mantiene a cada jugador en su propia zona de flow, y que es más difícil cuanto más amplio es el público. [Crossref DOI 10.1145/1232743.1232769](https://api.crossref.org/works/10.1145%2F1232743.1232769) · [PDF](https://khoury.northeastern.edu/~lieber/courses/csu670/f08/materials/p31-chen-flow-in-games.pdf)
- **Flower.** Eres el viento y guías pétalos. Contó al recibir el GDCA a Mejor juego descargable que el juego le sirvió de terapia en una pérdida personal. Para él, el estudio busca hacer sentir algo, no lucir mecánicas. [Wikipedia: Jenova Chen](https://en.wikipedia.org/wiki/Jenova_Chen)
- **Journey.** Tres años para unas dos horas de juego, con muchas ideas descartadas. Pasados los dos años previstos, la curva de picos y valles emocionales aún no funcionaba. La reconstruyeron: un jugador se conmovió cuando su personaje «moría» antes de la cumbre, y eso llevó a ahondar la ola final. Añadieron animaciones en la nieve para que el jugador se sintiera débil. Una crónica afirma que el estudio rozó la quiebra. [GDC Vault: Designing Journey](https://gdcvault.com/play/1017700/Designing) · [recapitulación](https://www.destructoid.com/journey-took-thatgamecompany-into-bankruptcy/) · [vídeo](https://gamedeveloper.com/audio/video-designing-a-new-emotional-experience-in-i-journey-i-)
- **Comunicación sin palabras.** Sin nombres, chat ni armas, solo un canto. La idea vino de la soledad que sintió jugando a un MMO: quería un intercambio de emociones, no de golpes. [Digital Citizen](https://www.digitalcitizen.life/world-of-warcraft-helped-inspire-journey-creators-wordless-multiplayer-design/) · [NBC News](https://www.nbcnews.com/tech/tech-news/journey-contains-millions-grains-sand-no-words-flna413168)
- **Equipo y principios.** Robin Hunicke produjo Journey y resumió el ideario del estudio: juegos abstractos, artísticos y accesibles. También reconoció plazos incumplidos y conflictos creativos. [Gamasutra](https://www.gamedeveloper.com/business/interview-tgc-s-hunicke-on-i-journey-i-s-unique-creative-hallmarks)
- **Premios.** Journey ganó 8 premios D.I.C.E. en 2013, entre ellos Juego del año, y el GDCA a Juego del año. La partitura de Austin Wintory fue nominada al Grammy; esto lo afirmo de memoria, sin fuente verificada en esta sesión. Sky ganó un Apple Design Award en 2020. [USC Cinema](https://cinema.usc.edu/news/article.cfm?id=13315) · [Apple](https://apps.apple.com/story/id1521580255)

*Límite:* la búsqueda funcionó, pero no pude abrir ninguna página por un fallo de DNS en WebFetch. Me basé en los fragmentos de los resultados y en conocimiento previo. No vi la charla completa de la GDC.

## Primer análisis

Lo primero que pregunto es qué quieres que sienta el jugador, y Kubono no lo responde. Tiene una premisa preciosa: un cubo solo en la oscuridad y un universo que suena cuando te mueves. Encaja con lo que buscamos en flOw y Flower: una sola acción, un sentido y una estética contenida.

**Lo que funciona**
- Negro puro, un punto blanco y cristales pálidos. La captura del Camino (`2-camino.png`) tiene el silencio de un primer plano de Journey: un ser pequeño y un mundo inmenso.
- Arrastrar y lanzar un pulso es un verbo simple y sin violencia.
- El Refugio como partitura, con cámaras que son compases, es la mejor idea del juego. Ahí el mundo y la música son lo mismo.
- La música sigue a la región y al bioma. Esa respuesta del entorno es la base de una experiencia emocional.

**Lo que no funciona**
- **Hay palabras por todas partes.** «Día 1», «Era I · Pixel», «Caminado 0 m», «0 chispas», «Rompe cristales 0/10», «1/6». En Journey quitamos los nombres para que la emoción no pasara por el lenguaje. Aquí el texto está antes que la emoción.
- **Pides permiso antes de dar asombro.** La cuenta obligatoria es lo contrario de la accesibilidad que buscamos.
- **No hay curva.** Todo tiene la misma intensidad y todo es infinito. No hay soledad que luego se convierta en compañía, ni pérdida, ni regreso.
- **El flow lo rompe la economía.** Chispas, 81 piezas, 376 logros, saltos de pago y la tienda. Cada número desvía la atención hacia la gestión. flOw ajustaba la dificultad sin mostrarla; Kubono muestra todos sus contadores.
- **El Mundo se lee mal en el teléfono.** En `mundo-6.png` hay glifos minúsculos dispersos sobre negro. No se ve hacia dónde ir. En Journey la montaña siempre está a la vista.

**Notas**
| Área | Nota | Justificación |
|---|---|---|
| Visual | 6,5 | La paleta tiene disciplina, pero en el Mundo no hay escala, horizonte ni meta visible. |
| Audio | 8 | Música generativa por región, ambiciosa y coherente; falta que crezca con el jugador. |
| Creatividad | 8 | Un universo que suena y un hogar que es partitura: ideas propias. |
| Sensación de juego | 5,5 | El verbo es correcto, pero falta respuesta física: no hay vibración ni inercia emocional. |
| Cohesión | 4,5 | Doce sistemas compiten con una sola emoción. |
| Pulido/accesibilidad | 6 | Tiene lector de pantalla y movimiento reducido, pero la cuenta obligatoria cierra la puerta. |

## Lectura del jurado

Coincido con el diagnóstico del jurado y le daría más peso a una cosa. Ruth tiene la clave: sin arco no hay obra. Marina pide un clímax. Iñaki ve un juego de servicio. Las tres cosas son la misma enfermedad: el diseño reparte la atención en lugar de dirigirla.

La respuesta del jurado son seis fases, y yo no planificaría por fases. Primero dibujaría la curva emocional en una hoja y después borraría todo lo que no la sirva. Con Journey nos pasamos de plazo justo porque la curva no funcionaba aún. No hay que lanzar antes de que funcione.

Discrepo un poco de Lucía: la vibración y la «música visible» son medios, y sin una curva no salvan nada. Su crítica a la cuenta sí la suscribo entera. Le subiría a Visual menos nota que el jurado: la estética es bella en reposo, pero no orienta.

## Notas finales

**Notas revisadas** (si se aplican los cambios): Visual 7 → 8,5 · Audio 8 → 9 · Creatividad 8 → 8,5 · Sensación 5,5 → 8 · Cohesión 4,5 → 8 · Pulido 6 → 8.

**Cinco cambios**
1. **Faro siempre visible.** En cada región, una columna de luz lejana dibujada en Canvas, con su propia voz que crece en volumen al acercarte. Da la meta sin texto, como la montaña de Journey.
2. **Música que crece con el recorrido.** Una capa de intensidad del 0 al 4 que el conductor musical sube con la distancia recorrida y los cristales tocados seguidos. El cambio entra en el siguiente compás. Si el jugador se detiene, la intensidad baja. Es el ajuste dinámico de flOw aplicado a la orquesta.
3. **HUD invisible por defecto.** Quitar los contadores de la pantalla de juego y llevarlos a la Bitácora. El progreso se ve en el mundo: el cubo brilla más cuantas más chispas lleva y deja un rastro más largo.
4. **Entrar sin cuenta.** La cuenta se ofrece después, como «Guardar en la nube», migrando el guardado local sin perder nada.
5. **El primer encuentro en silencio.** Antes del Mundo, una criatura que responde a tu pulso con su propio canto sin ningún texto. Usar `navigator.vibrate` donde haya soporte; ahora no se usa en ninguna parte del código.

**Qué cortar u ocultar:** las cifras de chispas en pantalla, los saltos de pago, «Era I · Pixel», el «Día N» y la numeración «1/6». Esconder la tienda hasta la segunda hora y dejar de anunciar los 376 logros: que aparezcan como sorpresas. Las travesuras, campamentos y actividades por semilla que no sigan la curva quedan como secretos.

**Momento firma.** En el último bioma, el Vacío, la música se apaga y solo suenan tus notas. Al volver, el Refugio reproduce tu viaje entero comprimido en dieciséis compases, una nota por lugar visitado, mientras el cubo se ilumina en dorado.

**Arco emocional** (sesión de unos 40 minutos)
- 0–3: soledad y curiosidad. Negro, un solo tono, el primer cristal suena.
- 3–10: descubrimiento. El faro aparece y la música suma capas.
- 10–20: juego y compañía. Primera criatura que te sigue y responde.
- 20–28: tensión. Tormenta o Cueva, ritmo roto, sientes al cubo frágil.
- 28–35: pérdida. Vacío y silencio; la criatura no puede entrar.
- 35–40: llegada y regreso. Clímax en el faro y el Refugio toca tu viaje.

**Proceso**
- Equipo pequeño y una sola frase de emoción pegada en la pared.
- Pruebas semanales con desconocidos, empezando por Luca, sin explicarles nada. Observar caras, no preguntar opiniones. Anotar en cada minuto dónde sonríen, dónde se aburren y dónde se pierden.
- Dibujar la curva medida encima de la curva deseada e iterar hasta que coincidan.
- Cortar sin piedad y respetar el progreso de los jugadores actuales.
- No buscar premios con fases: buscar el momento en que alguien, sin palabras, se queda callado mirando su pantalla.
