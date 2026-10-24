# Panel creativo · Toshio Iwai (simulación)

> Simulación respetuosa de cómo su filosofía de diseño conocida leería Kubono. No es su opinión real. No hay citas textuales: todo está parafraseado. Nota de método: la búsqueda web funcionó, pero la lectura directa de páginas falló (DNS bloqueado); las fuentes se citan desde los resúmenes de búsqueda y desde mi conocimiento previo.

## Quién es y cómo crea (con fuentes)

- **Origen artesanal.** De niño, su madre dejó de comprarle juguetes y le dio materiales para que se los fabricara él; empezó con folioscopios en los márgenes de sus cuadernos y luego con zoótropos y otros juguetes precinematográficos. En la universidad imprimía y encuadernaba folioscopios generados por ordenador ([Rhizome, keynote Futuresonic 2006](https://old.rhizome.org/editorial/2006/jul/21/toshio-iwai-keynote-at-futuresonic); [We Make Money Not Art](https://we-make-money-not-art.com/?p=4934)).
- **Otocky (1987, Famicom Disk System).** Un shoot 'em up en el que cada una de las ocho direcciones de disparo es una nota, cuantizada al pulso de la música y limitada a las notas del acorde vigente: no puedes sonar mal ([Wikipedia: Otocky](https://en.wikipedia.org/wiki/Otocky); [StrategyWiki](https://strategywiki.org/wiki/Otocky)).
- **Music Insects (1992, Exploratorium) → Sound Fantasy (inédito) → SimTunes (Maxis, 1996).** Pintas colores en un lienzo y unos insectos, al pasar por ellos, los convierten en notas: la partitura y el dibujo son la misma cosa ([Wikipedia: SimTunes](https://en.wikipedia.org/wiki/SimTunes); [Sound Fantasy](https://en.wikipedia.org/wiki/Sound_Fantasy)).
- **Piano – as image media (ZKM, 1995)** y **Music Plays Images × Images Play Music** con Ryuichi Sakamoto, preparado por correo durante un año; Golden Nica de Arte Interactivo en Ars Electronica 1997 ([archivo Ars Electronica](https://webarchive.ars.electronica.art/en/archiv_files/19971/E1997_356.pdf); [Digital Art Archive](https://digitalartarchive.at/database/work/1724)).
- **Electroplankton (Nintendo DS, 2005).** Diez «plancton», cada uno un juguete sonoro distinto, sin puntuación ni objetivo. Iwai lo describió como una colección de obras previas, una especie de «museo en miniatura», y dijo que su idea de software creativo en consola no había cambiado desde Otocky ([Cubed3, 2006](https://cubed3.com/news/5724/1/c3-exclusive-interview-toshio-iwai-on-nintendo-wiiand-musical-fish.html); [Oliva, *The Musicking of Electroplankton*](https://um.edu.mt/library/oar/bitstream/123456789/60602/1/The_Musicking_of_Electroplankton.pdf)).
- **Tenori-on (Yamaha, 2007).** Rejilla de 16×16 botones LED donde el control y la imagen son la misma superficie; seis años de desarrollo; pensado como algo intermedio entre instrumento y aparato para escuchar ([CDM, lanzamiento](https://cdm.link/yamaha-tenori-on-launch-photos-videos-interviews-demos-and-details-and-a-music-box/)).
- **Principios recurrentes** (paráfrasis): atractivo a primera vista y comprensible al tacto, luego profundidad para explorar ([Design Week, 2006](https://www.designweek.co.uk/issues/8-june-2006/use-your-intuition/)); el instrumento que manipula imagen y sonido a la vez; el hardware (pantalla táctil, micrófono) como material del diseño; música como juguete, no como examen.

## Primer análisis

Lo que funciona. El pulso que se expande en anillo y choca con objetos es, literalmente, mi Otocky: en `interactions.js` cada impacto pasa por `beatSoon`, que encola el sonido en la siguiente subdivisión del compás, y `chain()` dibuja un rayo de objeto en objeto mientras cada uno suena. Eso es imagen y sonido en un solo gesto, y es correcto. El Refugio nuevo, con cámaras donde la horizontal es el tiempo (16 pasos) y la vertical la altura, es una rejilla de Tenori-on habitable. El negro con líneas finas es una buena hoja en blanco invertida.

Lo que no funciona. Al abrir el juego me piden un correo y una clave de doce caracteres. Un juguete no pide identificación. Después, en el Camino (`2-camino.png`), dos cristales minúsculos en una pantalla negra y cinco textos (día, era, metros, chispas, contador) que no suenan. En el Mundo (`mundo-6.png`) la música está en todas partes, pero no la veo: los glifos son del tamaño de una uña y el cubo no deja huella sonora visible. En el Refugio leo «0 sonando» y «0 de 40»: la partitura está vacía y me dice que la llene, en lugar de sonar ya en cuanto la toco. El menú tiene once entradas; Electroplankton tenía una pantalla de diez iconos y nada más.

| Eje | Nota | Justificación |
|---|---|---|
| Visual | 6,5 | Línea limpia y sobria, pero la imagen casi nunca *es* la música; el Mundo en móvil se ve vacío. |
| Audio | 8 | Síntesis propia cuantizada al compás y armónica por región; el fundamento es sólido. |
| Creatividad | 7,5 | Rejilla-partitura y pulso en cadena son ideas fuertes, diluidas entre sistemas. |
| Sensación de juego | 5,5 | El gesto central (pulso) tiene enfriamiento de 700 ms y no hay tacto; el dedo no siente el instrumento. |
| Cohesión | 5 | Chispas, tienda, 376 logros y eras hablan otro idioma que el del juguete. |
| Pulido / accesibilidad | 6 | Lector de pantalla y movimiento reducido son serios; la cuenta obligatoria y el exceso de texto pesan más. |

## Lectura del jurado

Coincido con Marina: la acción debe provocar la música al instante; la base ya existe (cola por compás), falta que el resultado se oiga y se vea más que el fondo. Coincido con Lucía en «música visible» y en eliminar la cuenta de la entrada. Coincido con Iñaki: lo de «juego de servicio» es la cuestión central.

Discrepo con Ruth en algo de fondo. Pide arco, final y tres momentos memorables. Electroplankton no tenía final ni puntuación y eso era su forma. Un juguete no necesita cierre; necesita que cada sesión deje algo, aunque sea un minuto de música que no existía antes. Acepto un cierre suave, el Refugio que toca tu viaje, pero no una narrativa impuesta. También discrepo, en parte, con el «viaje curado de 30–45 minutos» como única build de festival: en una sala lo que funciona es una superficie que cualquiera entiende en diez segundos y que suena bien con dos personas tocándola.

Lo que se les escapó. Primero, que el problema visual no es de densidad sino de correspondencia: no hace falta más decoración, hace falta que cada sonido tenga una forma y cada forma un sonido. Segundo, el hardware: el móvil tiene micrófono, vibración, inclinación y multitáctil, y Kubono usa un dedo que arrastra. Tercero, nadie propuso que el juego no pueda sonar mal (notas del acorde, cuantización) como garantía explícita, que es lo que permite a un niño, Luca, sentirse músico desde el primer toque.

## Notas finales

**Notas revisadas** (si se aplican los cambios): Visual 8 · Audio 8,5 · Creatividad 8,5 · Sensación de juego 8 · Cohesión 7,5 · Pulido/accesibilidad 7,5.

**Cinco cambios, por orden:**

1. **Entrar tocando.** Sin pantalla de cuenta: el primer toque en negro ya emite un pulso y una nota. La cuenta se ofrece después, desde Ajustes, para sincronizar; el guardado local actual no se borra y se migra al vincular.
2. **Todo lo que suena deja una forma.** Cada voz (pulso, cristal, criatura, objeto del Refugio) dibuja en Canvas 2D un trazo que dura lo que dura su nota: anillo por golpe, línea por nota sostenida, color por timbre, altura por tono. El rastro del cubo se convierte en un pentagrama que se borra solo. Sin texto nuevo.
3. **Gesto como instrumento.** Quitar el enfriamiento de 700 ms del pulso del jugador y sustituirlo por cuantización (ya existe `beatSoon`); la dirección del arrastre elige la nota del acorde, como en Otocky; `navigator.vibrate` breve en cada golpe donde exista, desactivable. Dos dedos: dos voces.
4. **El Refugio suena desde el primer segundo.** Llenar cada cámara con un patrón inicial tenue derivado de los objetos ya ganados; tocar una celda la enciende o apaga, como un Tenori-on. Nada se pierde: lo colocado conserva su paso.
5. **Un HUD que se calla.** Ocultar día, era, metros y chispas mientras el jugador toca; aparecen al detenerse. Menú reducido a cuatro: Mundo, Refugio, Grabar, Ajustes. Bitácora y Tienda dentro de Refugio.

**Recortar u ocultar:** contadores de logros visibles (dejar los logros, esconder el «376»), saltos de pago con chispas, la palabra «chispas» en el primer día, actividades y travesuras como lista; las eras como etiqueta en pantalla.

**Momento firma:** *El mar de plancton.* En el Vacío, el bioma «Nada. Solo tú y tus notas», la pantalla negra se llena de puntos que reaccionan a la voz o a un soplo en el micrófono (con permiso explícito y alternativa táctil): cada sonido del jugador lanza una ola de luz que despierta puntos, y cada punto tocado da una nota del acorde. Cuando el jugador calla, los puntos repiten lo que oyeron, en eco, y se apagan uno a uno. Sin texto, sin objetivo. Un minuto que solo existe en Kubono.

**Proceso:** prototipar cada juguete aislado, en una página, antes de integrarlo, como hacía con los folioscopios: si no se entiende en diez segundos sin palabras, no entra. Probar con Luca y con un adulto que no juega, mirándoles las manos, no la pantalla. Iterar en sesiones de sala (pantalla grande, dos personas) porque así se exhibe la obra. Medir una sola cosa: cuánto tarda alguien en sonreír al oír lo que hizo. Y mantener el progreso intacto: cada cambio es de presentación y de gesto, no de datos.
