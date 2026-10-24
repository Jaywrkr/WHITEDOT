# 09 · Lucas Pope (simulación)

> Simulación respetuosa de cómo la filosofía de diseño conocida de Lucas Pope leería Kubono. No es su opinión real ni contiene citas suyas: todo está parafraseado y atribuido a fuentes.

## Quién es y cómo crea (con fuentes)

Lucas Pope trabajó en Naughty Dog en *Uncharted* y *Uncharted 2* antes de irse a hacer juegos pequeños por su cuenta [1]. *Papers, Please* (2013), hecho en solitario, ganó el Seumas McNally Grand Prize del IGF, premios GDCA y un BAFTA [1][2]. *Return of the Obra Dinn* (2018) volvió a ganar el Gran Premio del IGF en 2019, además de Excelencia en Narrativa [3]. *Mars After Midnight* (2024) salió solo para Playdate [4]. En 2024 recibió el Pioneer Award de los GDCA y pidió juegos raros, experimentales y personales [5].

Rasgos de su proceso, según las fuentes:

- **Una restricción fuerte como punto de partida.** En *Obra Dinn* la estética llegó primero: un 3D de 1 bit como los juegos de Macintosh Plus de su infancia. La mecánica de deducción vino después [6][7].
- **La legibilidad por encima de todo.** Explicó que priorizó leer el espacio: contornos donde ayudan, ninguno donde ensucian, y un tramado (dithering) estable que no "hierva" al mover la cámara [6][8][9].
- **Devlog público y técnico.** Documentó en TIGSource los experimentos de tramado, sus fallos y sus arreglos [8][9]. También publicó lo que recortó de *Papers, Please*: inspección de equipaje, sellos con luz UV, tiroteos y un final alternativo [10].
- **Recortar para terminar.** *Obra Dinn* bajó de 80 a 60 tripulantes porque cada personaje costaba demasiado [7][11]. Dijo que el juego iba a ser pequeño y creció más de lo previsto, y que quiere que los siguientes sean pequeños [4][12].
- **Una mecánica central con verificación precisa.** En *Papers, Please* hay una sola acción: comparar documentos y sellar. En *Obra Dinn* hay que deducir y anotar en el libro. La confirmación por grupos de tres destinos (lo cuento de memoria) impide resolver probando al azar.
- **La herramienta pide el juego.** En *Mars After Midnight*, la pantalla pequeña de Playdate inspiró la mirilla. Los personajes son procedurales y las voces son sintéticas, con un sistema propio [4][12].

Fuentes: no pude abrir directamente las páginas (WebFetch falló por DNS en este entorno). Me baso en los resúmenes de búsqueda de estas URLs y en conocimiento previo:
[1] https://en.wikipedia.org/wiki/Lucas_Pope · [2] https://en.wikipedia.org/wiki/Seumas_McNally_Grand_Prize · [3] https://igf.com/article/return-obra-dinn-takes-grand-prize-21st-igf-awards · [4] https://www.techradar.com/gaming/lucas-pope-interview-march-2024 · [5] https://rss.boorghani.com/?p=301878 · [6] https://blog.playstation.com/archive/2019/10/17/lucas-pope-on-return-of-the-obra-dinns-art-style · [7] https://www.pcgamer.com/uk/lucas-pope-on-the-challenge-of-creating-obra-dinns-1-bit-aesthetic/ · [8] https://simonwillison.net/2017/Nov/23/return-of-the-obra-dinn/ · [9] https://setsideb.com/?p=5672 · [10] https://www.killscreen.com/peek-behind-scenes-papers-please-reveals-baggage-search-and-gun-fights/ · [11] https://killscreen.com/articles/return-obra-dinn-update-details-challenges-1-bit-rendering/ · [12] https://www.timeextension.com/news/2024/03/lucas-pope-made-playdate-classic-mars-after-midnight-for-his-kids-not-money

## Primer análisis

Miré las capturas de entrada, Camino, menú, Mundo (móvil y escritorio) y Refugio entero. También ojeé `src/`: 269 módulos y unas 17 000 líneas muy densas. Hay familias enteras de sistemas (`living-*` 16, `world-*` 14, `cube-*` 13, `lab-*`, `cloud-*`, `wow-*`, `vj-*`, `celebration-*`).

**Lo que funciona.** La restricción visual existe y es buena: negro puro, blanco, dorado solo para lo ganado, una fuente monoespaciada y esquinas rectas. Es el equivalente de Kubono al 1 bit. El Camino es la mejor pantalla del juego. Hay un cuadrado blanco, dos cristales, una línea de puntos que te lleva y una sola instrucción. Se lee en un segundo. El Refugio como partitura (horizontal = paso, vertical = nota) es una idea de diseño de verdad: el espacio *es* la notación. Eso tiene la honestidad de un libro de registro. En el código ya existe `onBeatNow()`, y el pulso ya sabe si cayó en el tiempo. La semilla de una mecánica precisa está ahí.

**Lo que no.** Hay muchos más sistemas que mecánica. En el Mundo, a escala de móvil, veo un punto blanco y glifos de color de 8 píxeles que no sé leer. No sé qué es un tambor, qué es una criatura ni qué es un cristal. Para el ojo, el mundo es ruido. Pope empezó *Obra Dinn* resolviendo la legibilidad, y aquí está sin resolver. Además, la primera pantalla es un formulario con clave de 12 caracteres: lo primero que se toca no es el juego. El HUD cuenta días, metros, chispas, era y reto, cuatro números sin relación con la música. Y no hay verificación: no sé cuándo toqué *bien*.

| Criterio | Nota | Justificación |
|---|---|---|
| Visual | 6,5 | Paleta disciplinada; el Mundo no se lee a tamaño real. |
| Audio | 8 | Motor propio ambicioso y limpio; la acción no se oye como causa. |
| Creatividad | 7,5 | La partitura habitable es original; enterrada bajo sistemas genéricos. |
| Sensación de juego | 5,5 | Arrastrar y pulsar sin objetivo musical medible. |
| Cohesión | 4,5 | Tienda, 376 logros, era, días y chispas no sirven a la música. |
| Pulido/accesibilidad | 6 | Lector de pantalla y teclado bien hechos; cuenta obligatoria y exceso de texto. |

## Lectura del jurado

El jurado acierta en el diagnóstico. Coincido más con Iñaki (parece un juego de servicio) y con Ruth (no hay arco ni final). Hay un matiz al estilo de Pope: su plan F1–F6 es otra lista de seis fases. Kubono no necesita seis fases. Necesita **una decisión**: qué verbo es el juego. Las fases F2 a F5 salen solas de esa decisión.

Marina pide que la acción provoque la música al instante. Estoy de acuerdo, pero falta la otra mitad: la música tiene que **juzgar** la acción. El sello de *Papers, Please* funciona porque llega la citación cuando te equivocas. Tomás y Lucía hablan de oscuridad y HUD. Para mí es un problema de legibilidad, no de "más color": antes de añadir nada hay que decidir qué tres cosas debe distinguir el ojo. Un final, como pide Ruth, es imprescindible. *Obra Dinn* tiene un número fijo de destinos y una carta final que los cuenta.

Discrepo de dos puntos. Llevar ES+EN al build de festival es trabajo de producción, no de diseño, y debería ir al final. Y un "viaje curado de 30–45 min" es demasiado. Un festival juzga en 10–15 minutos.

## Notas finales

**Notas revisadas:** Visual 6,5 · Audio 8 · Creatividad 7,5 · Sensación 5,5 · Cohesión 4,5 · Pulido 6. Media: **6,3**. Hoy el juego es un motor brillante. Con los cambios de abajo veo un techo de 8 o más en Creatividad y Cohesión.

**Los 5 cambios más importantes** (Canvas 2D + Web Audio, sin tocar guardados):

1. **El pulso en el tiempo como verbo único.** Un pulso dentro de la ventana de `onBeatNow()` rompe el cristal y suma su nota a un motivo. Fuera de tiempo, el cristal solo vibra y suena desafinado. Es una verificación binaria y audible, como el sello.
2. **El cristal como frase.** Cada bioma tiene 6–8 cristales que, rotos en orden y en tiempo, completan una frase de 4 compases. Al completarla, la región "se resuelve": se oye la frase entera y el bioma se enciende. Así hay un número fijo y contable, como los destinos de *Obra Dinn*.
3. **Legibilidad antes que contenido.** Tres clases visuales y nada más en primer plano: cristal (contorno blanco), lo que suena (pulsa con el beat) y decorado (atenuado al 30 %). Los glifos de 8 px pasan a 16 px con contorno de 1 px. Es la misma regla que los contornos de *Obra Dinn*.
4. **Entrar jugando.** Modo invitado local con el guardado actual. La cuenta se ofrece después, para sincronizar. El progreso existente se migra sin cambios.
5. **Un final contable.** Once frases resueltas abren el Vacío. Allí el Refugio reproduce en orden las frases que tocaste y aparece una pantalla final con tu partitura. Al terminar, la partida sigue abierta.

**Recortes para el build de festival** (ocultar, no borrar código ni datos):
Tienda y las 81 piezas · contador de chispas y "Saltar · 20 ✦" · 376 logros y Bitácora (dejar solo "Música") · Día, Caminado, Era · Estilos · encuentros traviesos, actividades por semilla, tarjetas raras · Viajar a otra semilla, Compartir, Grabar set, laboratorio, duetos · Subsuelo y Cielo · autopiloto · nube. El menú queda en Mundo, Refugio, Mapa, Sonido, Ajustes. Un build de festival de tres biomas y 15 minutos.

**La mecánica que afilaría:** el pulso. Hoy dispara voces, retos, reliquias, portales y desbloqueos a la vez (`interactions.js`). Lo dejaría en una sola regla: **en tiempo = nota correcta y cristal roto; fuera = error audible**. Después añadiría una única capa: la escala del bioma cambia qué notas valen. Esa es la "deducción" de Kubono, escuchar antes de golpear.

**Proceso:**
- Un devlog público semanal (itch.io o TIGSource) con GIFs del Mundo a tamaño de móvil. Que la legibilidad se juzgue en público.
- Una publicación de "lo recortado", como hizo con *Papers, Please*.
- Prototipar el verbo nuevo en un solo bioma durante dos semanas, sin tocar otros sistemas, antes de decidir.
- Congelar funciones. Cada sistema nuevo tiene que justificar que mejora el pulso, o no entra.
- Probar con Luca y con cinco desconocidos. La única métrica: ¿saben en un minuto qué hacer y cuándo lo hicieron bien?
