# 08 · Ken Wong lee Kubono

*Simulación respetuosa basada en su trayectoria pública. No es su opinión real. Todo lo atribuido es paráfrasis con fuente.*

## Quién es y cómo crea (con fuentes)

Es un artista y diseñador australiano. Fue director de arte de *Alice: Madness Returns* (2011) y diseñador principal de *Monument Valley* (ustwo, 2014), que se hizo en unos diez meses a partir de sus propios dibujos de concepto. En 2016 fundó Mountains en Melbourne, un estudio de tres personas que se definía como *craft games studio* y quería hacer «juegos pequeños y bellos». Su primer juego fue *Florence* (2018, Annapurna Interactive).

Rasgos de su método que guían esta lectura:

- **Cada fotograma tiene que poder colgarse.** Wong quería que cualquier fotograma de *Monument Valley* mereciera exponerse como obra, y tomó como referencia los grabados japoneses y la escultura minimalista. [Wikipedia](https://en.wikipedia.org/wiki/Monument_Valley_(video_game)); [Fast Company](https://www.fastcompany.com/3023575/a-mind-bending-ipad-app-that-channels-mc-escher)
- **Menos juego, más experiencia.** Su charla de GDC Europe 2014 planteaba el juego como experiencia de usuario. En las pruebas, la mayoría de los jugadores ignoraba los objetos interactivos por mirar a su personaje, y el equipo rehízo las pistas visuales para que esos objetos destacaran. [Engadget](https://www.engadget.com/2014-08-11-monument-valley-recovered-development-investment-in-one-week.html); [GDC/Game Developer](https://gdconf.com/news/gdc_europe_2014_adds_standout_)
- **Casi sin instrucciones.** Según ustwo, el reto no es el centro del juego. Wong buscaba que el objetivo se descubriera explorando y usaba el color para marcar lo que se puede tocar. [ustwo](https://ustwo.com/blog/monument-valley-out-now/); [Wikipedia](https://en.wikipedia.org/wiki/Monument_Valley_(video_game))
- **La interacción cuenta la historia.** En *Florence* parte de un sentimiento, los nervios de una primera cita, y busca la mecánica que lo encarna: los diálogos son rompecabezas que se vuelven más fáciles a medida que crece la confianza. Cada capítulo tiene su propia mecánica, pensada para una etapa emocional de la relación. [Player.One](https://www.player.one/florence-game-ken-wong-interview-123975); [80.lv](https://80.lv/articles/the-lead-designer-of-monument-valley-discusses-florence)
- **Corto y con final.** Los dos juegos se terminan en una o dos tardes y eso no restó prestigio. *Monument Valley* ganó un Apple Design Award y dos BAFTA en 2014. *Florence* ganó el Apple Design Award de 2018 y el BAFTA a mejor juego móvil de 2019. [TechCrunch](https://techcrunch.com/2018/06/06/apple-design-award-winner-florence-breaks-new-ground-in-mobile-gaming/); [BAFTA](https://www.bafta.org/?p=365791)
- **Estudio pequeño, juego premium.** Mountains anunció desde el principio un juego móvil premium. [TouchArcade](https://toucharcade.com/2016/07/12/monument-valley-lead-designer-founds-new-studio-mountains-first-title-will-be-a-premium-mobile-game); [MCV](https://www.mcvuk.com/monument-valley-lead-designer-forms-new-studio-mountains/)

**Límites de la investigación.** La búsqueda web funcionó, pero WebFetch falló por DNS y no pude abrir ninguna página. Me apoyo en los resúmenes de búsqueda y en mi conocimiento previo. No pude verificar qué ha hecho Mountains después de 2020.

## Primer análisis

**Lo que funciona.** La premisa, «un cubo, un universo que suena», cabe en una frase, y eso es raro y valioso. El lenguaje gráfico tiene disciplina: negro, blanco, dorado solo para lo ganado y líneas finas. El Refugio rediseñado (`escritorio-3-refugio-entero.png`) es la imagen más cercana a un grabado: cuatro cámaras-partitura con objetos dorados como notas. Ahí hay una lámina. El modelo de pago único sin anuncios encaja con la tradición premium de la que vengo.

**Lo que no funciona.**

1. **El primer fotograma es un formulario** (`0-entrada-cuenta.png`). Lo primero que se ve no es el cubo, sino un campo de correo. En *Monument Valley* lo primero que hay es una torre.
2. **El Mundo no es una lámina.** En `movil-1-mundo.png` y `mundo-6.png` el 90 % de la pantalla es negro sin forma, con glifos de 10 píxeles dispersos y sin composición. Ningún fotograma se colgaría en una pared. Falta un horizonte, una masa o un primer plano.
3. **El texto le hace el trabajo a la interacción.** La ventana inicial da cinco instrucciones. El HUD del Camino (`2-camino.png`) muestra Día, Era, metros, chispas, una meta y dos pistas, con tres lecturas a la vez antes de tocar nada. Habría que preguntarse qué sentimiento debe provocar romper un cristal y diseñar ese gesto, no explicarlo.
4. **El menú es la estructura de un servicio** (`3-menu.png`): once entradas, «Tienda», «Viajar a otra semilla», 376 logros, 81 piezas. Lo que cuenta la estructura es «quédate». Un juego de autor diría «escucha».
5. **No hay final.** Sin arco, el jugador no puede contar a nadie lo que vivió.

| Eje | Nota | Justificación |
|---|---|---|
| Visual | 6 | La gramática es buena y el Refugio es bello, pero el Mundo no compone imagen. |
| Audio | 7,5 | La ambición generativa es real. No puedo oírlo, y el sonido no se ve en pantalla. |
| Creatividad | 7,5 | La partitura habitable del Refugio es una idea propia. |
| Sensación de juego | 5,5 | Arrastrar y pulsar sin peso. No hay vibración: `navigator.vibrate` no aparece en `src/`. |
| Cohesión | 5 | Hay tres juegos superpuestos: exploración musical, tienda y colección. |
| Pulido/accesibilidad | 6 | El lector de pantalla y el movimiento reducido son serios, pero la cuenta obligatoria y el exceso de texto excluyen. |

## Lectura del jurado

Coincido con casi todo. Lucía tiene razón: la cuenta mata el primer minuto. Iñaki también: es la misma lección que nos dieron las pruebas de *Monument Valley*, porque si el jugador mira lo que no importa, el diseño le está pidiendo que lo mire.

Hay dos desacuerdos. El primero: el jurado propone un «viaje curado de 30–45 min» solo como *build* de festival. Yo lo haría **el juego**. El Mundo infinito puede seguir existiendo como modo libre después del final, pero la obra es el viaje. El segundo: las fases F2 a F5 del jurado añaden cosas (vibración, clímax, color, música visible). Antes de añadir, hay que quitar. El Visual de 7,1 me parece generoso para el Mundo y justo para el Refugio. La diferencia entre las dos pantallas es el diagnóstico.

Ruth acierta al pedir tres momentos memorables. Yo los ataría a tres sentimientos, no a tres sistemas.

## Notas finales

**Notas revisadas:** Visual 6,5 · Audio 7,5 · Creatividad 8 · Sensación 5,5 · Cohesión 5 · Pulido 6. Sube la creatividad porque, después de ver el Refugio, la idea de un espacio que es una partitura me parece la tesis del juego. El resto se queda igual hasta ver cambios.

**Los 5 cambios más importantes**

1. **Entrar sin cuenta.** Se juega en local desde el primer toque y la cuenta se ofrece en Ajustes como «guardar en la nube». El progreso local ya existe y se migra al vincular la cuenta.
2. **Componer el Mundo como lámina.** Una masa por bioma dibujada en Canvas: un horizonte de líneas finas, un relieve isométrico o un gran anillo de pilares que llene un tercio de la pantalla, con el color del bioma. Los glifos se agrupan en conjuntos con forma. Las pantallas actuales sirven para comprobarlo: ¿se colgaría esta captura?
3. **El sonido se ve.** Cada pulso deja un anillo que se expande al tempo. Los objetos que suenan laten en su paso del compás. Las criaturas trazan su melodía como una línea de partitura que se desvanece. Es el mismo lenguaje del Refugio llevado al Mundo.
4. **Un gesto con peso.** Al romper un cristal, la imagen se detiene 60 ms, el cristal se parte en fragmentos que caen en la escala del bioma, `navigator.vibrate(12)` donde exista, y un acorde que **cuantiza al siguiente pulso**: la acción llega a tiempo con la música.
5. **Un arco con final.** Siete lugares en orden, cada uno con un sentimiento: soledad, curiosidad, compañía, tormenta, pérdida (Vacío), regreso y canción. El final se da en el Refugio: las cuatro cámaras tocan juntas lo que recogiste, compuesto con tus objetos. Después se abren los créditos y el Mundo libre.

**Qué cortar u ocultar:** las cifras de chispas en el HUD (solo aparecen al ganar), «Día», «Era» y «Caminado». También la tienda hasta después del final, y la reduciría de 81 piezas a unas 12. Los logros visibles quedan en ninguno: se conservan internamente y no se borra progreso. Fuera también «Viajar a otra semilla», los saltos de pago, el autopiloto y las travesuras con texto. El menú se queda en cuatro entradas: Continuar, Refugio, Sonido y Ajustes.

**Momento firma:** en el Vacío, la música se apaga. Solo queda el cubo. Cada toque produce una nota y la pantalla se queda en negro absoluto, salvo los anillos que dejas. Tras ocho notas, las criaturas que te siguieron regresan una a una y cada una toca de nuevo una de tus notas, hasta que la melodía que improvisaste se vuelve el tema del regreso. La soledad se cuenta con interacción y sin una palabra.

**Primeros 5 minutos**

- **0:00** Negro. Un punto de luz. Al tocar, el cubo aparece y suena una nota. No hay texto.
- **0:20** Un cristal pulsa a tempo en el borde de la pantalla. El jugador arrastra, el cubo se acerca y la música entra en una capa.
- **0:45** Toca cerca y sale el pulso: el cristal se rompe a tiempo, con vibración y un acorde. Única palabra en pantalla: «Pulso», que se desvanece.
- **1:30** Cada cristal añade un instrumento. Al quinto ya hay una canción y los fragmentos forman en el cielo la primera línea de una partitura.
- **3:00** Al décimo, el horizonte se abre como una lámina: la Llanura aparece entera, compuesta, con su color.
- **4:00** Una criatura se acerca y te imita. Te sigue.
- **5:00** Título: *Kubono*. Solo entonces aparece el botón de menú.

**Cómo llevaría el proceso**

- Haría primero bocetos a mano de cada lugar, como fotogramas que merezcan colgarse, antes de tocar el código.
- Una persona nueva por semana jugaría en silencio mientras yo observo sin explicar nada. Lo que no entienda se rediseña, no se explica con texto.
- Escribiría un sentimiento por capítulo en la pared y quitaría todo sistema que no sirva a alguno de ellos.
- Probaría con Luca primero: si un niño llega al minuto cinco sin leer, el diseño funciona.
- Cerraría el alcance: siete lugares pulidos valen más que once biomas a medias. Que sea pequeño y bello, y que esté terminado.
