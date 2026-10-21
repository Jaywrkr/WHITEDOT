# Tienda del cubo

Diseño aprobado por Jay el 20 de octubre de 2026: «me gusta todo». Esta guía es el catálogo de la tienda de chispas y su orden de construcción; no es un backlog de lanzamiento (ese sigue siendo D01–D22). Estado: tanda 0 hecha en alpha.61 (ranuras en `src/cube-shop-model.js`, compras antiguas migradas a su ranura, tienda ordenada por ranura). Tanda 1 hecha en alpha.62: las 17 piezas de Movimiento y Cuerpo, dibujadas en `src/cube-shop-art.js`. «Dado» cambia con cada cristal roto, no con cada golpe. Tanda 2 hecha en alpha.63: Ojos, Hábitos y Accesorios (13 piezas), dibujados sobre el cubo en píxeles enteros; con cara, el cubo se dibuja con al menos 10 px aunque el nivel lo haga más pequeño. Rubor se enciende con una tarjeta rara nueva; Saludo guiña hacia la criatura que se acerca; Estornudo ocurre en aire de esporas, polvo o niebla; Mareo tras seis giros en tres segundos. Tanda 3 hecha en alpha.64: Rastros y Compañeros (10 piezas) en `src/cube-shop-world.js`. Arcoíris aparece al romper tres cristales en 1,2 segundos. Huellas del día y Fantasma de ayer guardan un recorrido acotado en `S.cubeRoute` (600 pasos de hoy, 120 puntos del último día jugado); el Fantasma lo repite en miniatura alrededor del cubo para verse siempre. Tanda 4 hecha en alpha.66: Formas del pulso y Gestos (12 piezas) en `src/cube-shop-pulse.js` y `src/cube-shop-moves.js`. Una forma comprada solo cambia el dibujo; la onda alcanza como el pulso original, y elegirla devuelve la forma ganada al pulso original (una forma a la vez). «Cargado» brilla según la espera entre pulsos en lugar de mantener pulsado, para no cambiar los controles. Tanda 5 hecha en alpha.80: Voces del pulso, Sonido del cubo y Notas pisables (12 piezas) en `src/cube-shop-sound.js`. Las voces se sintetizan en el bus de música con la nota y la armonía del pulso original; una voz comprada quita la voz ganada y al revés. Hi-hat, Tarareo, Antena y las notas pisables suenan en la corchea siguiente; nada suena con el sonido apagado o un panel abierto. Cada pieza muestra una marca junto al cubo cuando suena (la Antena, siempre), y esa marca es su imagen en la tienda. Filtro mueve el filtro general de la música, no el volumen.

## Reglas

- Lo comprado con chispas cambia cómo se ve, se mueve, suena y reacciona el cubo. Nada da ventaja para jugar, salvo la ranura **Habilidades**, que se construye al final con su propia revisión de economía.
- Una sola ranura por tipo. El vestuario que se gana jugando (colores, materiales, formas, rastros, halos) se sigue ganando, marcado en dorado, y se lleva junto a lo comprado. Desde alpha.65 hay un solo rastro a la vez: elegir uno ganado quita el comprado y al revés.
- Todo se cambia en Tu cubo: Llevar (tocar pone o quita, al momento), Tienda (solo lo que no tienes; al comprar te lo pones y pasa a Llevar) y Viaje. Sin vista previa: la imagen de cada pieza es su dibujo real en el juego.
- Cada pieza tiene variante estática con movimiento reducido: nada comprado puede quedar invisible.
- Los sonidos usan las voces sintetizadas, la armonía y el reloj existentes, sin muestras nuevas ni cambios de volumen maestro, y siguen las reglas de silencio, pausa y menús.
- Determinismo y guardado: las compras viven en `sparkEconomy` y lo equipado en `S.cube`, ambos normalizados sin borrar progreso y conservando formatos futuros.
- Rendimiento: una pieza no puede bajar de fluido un móvil medio; compañeros y rastros con límite de partículas.

## Catálogo

81 piezas, 78 nuevas. Precio total: 33790 ✦. Con una minería de 20 a 40 ✦ por minuto, completar la tienda lleva del orden de 15 a 30 horas de juego activo; el salto (20 ✦) sigue siendo el gasto repetible. Las cifras se revisan al terminar cada tanda.

### Movimiento

Una a la vez.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Rodar | 400 ✦ | Avanza girando cara por cara, como un dado. | 1 |
| Gelatina | 150 ✦ | Se aplasta al frenar y se estira al arrancar. | 1 |
| Pogo | 250 ✦ | Avanza a saltitos con sombra que sube y baja. | 1 |
| Patinador | 200 ✦ | Se desliza con inercia visual al soltar. | 1 |
| Gusano | 300 ✦ | Se estira y se encoge para avanzar. | 1 |
| Ingravidez | 350 ✦ | Flota sobre el suelo y se balancea. | 1 |
| Patitas | 500 ✦ | Cuatro patas de píxel al caminar. | 1 |
| Parpadeo | 600 ✦ | Reaparece unos píxeles adelante, a tempo. | 1 |

### Cuerpo

Una a la vez.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Latido | 150 ✦ | Late al tempo de la región. | 1 |
| Camaleón | 300 ✦ | Toma el color del bioma. | 1 |
| Dado | 200 ✦ | Sus caras cambian de número con cada golpe. | 1 |
| Racha | 400 ✦ | Crece un poco con cada cristal de una cadena. | 1 |
| Pecera | 600 ✦ | Cubo de cristal con un pez de luz dentro. | 1 |
| Origami | 700 ✦ | Se despliega como papel al lanzar un pulso. | 1 |
| Ensamblaje | 800 ✦ | Se arma de píxeles al moverse y se desarma al parar. | 1 |
| Bola de disco | 900 ✦ | Refleja puntos de luz en el suelo. | 1 |
| Enjambre | 1200 ✦ | Cuatro mini cubos en formación que se reúnen al parar. | 1 |

### Ojos

Una a la vez.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Serio | 40 ✦ | Mirada recta y tranquila. | 2 |
| Dormilón | 60 ✦ | Párpados a media asta. | 2 |
| Curioso | 60 ✦ | Mira lo más interesante que tiene cerca. | 2 |
| Travieso | 80 ✦ | Guiña y mira de reojo. | 2 |
| Rubor | 80 ✦ | Se sonroja al encontrar algo raro. | 2 |

### Hábitos

Todos los comprados activos.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Bostezo | 50 ✦ | Bosteza si te quedas quieto un rato. | 2 |
| Saludo | 60 ✦ | Guiña a las criaturas cercanas. | 2 |
| Estornudo | 80 ✦ | Estornuda chispas en zonas con polen o niebla. | 2 |
| Mareo | 120 ✦ | Se marea si giras muchas veces seguidas. | 2 |

### Accesorio

Uno a la vez.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Bigote | 50 ✦ | Bigote de píxel. | 2 |
| Gorrito | 60 ✦ | Gorrito de fiesta. | 2 |
| Gafas de sol | 80 ✦ | Gafas negras de dos píxeles. | 2 |
| Monóculo | 80 ✦ | Monóculo con cadenita. | 2 |

### Rastro

Uno a la vez · comparte ranura con los rastros ganados.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Polvo viajero | 40 ✦ | Ya existe. Pequeñas chispas al caminar. | 0 |
| Grafiti | 300 ✦ | Pinta el suelo y se borra poco a poco. | 3 |
| Cometa | 350 ✦ | Estela larga que se curva con tus giros. | 3 |
| Huellas del día | 400 ✦ | Tus pasos quedan hasta medianoche. | 3 |
| Jardín | 500 ✦ | Crecen flores donde pasas. | 3 |
| Arcoíris | 600 ✦ | Aparece tras romper tres cristales en cadena. | 3 |
| Notas pisables | 1000 ✦ | Deja notas que suenan al volver a pisarlas: loops caminando. | 5 |

### Compañero

Uno a la vez.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Órbita personal | 150 ✦ | Ya existe. Tres luces giran alrededor. | 0 |
| Nube | 300 ✦ | Una nube pequeña llueve sobre el cubo. | 3 |
| Pájaro | 400 ✦ | Se posa encima cuando te quedas quieto. | 3 |
| Imitador | 500 ✦ | Mini cubo que repite tu camino con retraso. | 3 |
| Satélite DJ | 600 ✦ | Un disquito que gira marcando el tempo. | 3 |
| Fantasma de ayer | 800 ✦ | Tu recorrido del día anterior, en miniatura y transparente. | 3 |

### Forma del pulso

Una a la vez · mismo alcance.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Cuadrado | 40 ✦ | Onda cuadrada. | 4 |
| Facetado | 80 ✦ | Ya existe. Rombos sobre la onda. | 0 |
| Estrella | 80 ✦ | Onda en estrella. | 4 |
| Doble anillo | 100 ✦ | Dos ondas casi juntas. | 4 |
| Espiral | 150 ✦ | La onda gira al abrirse. | 4 |
| Rayo | 250 ✦ | La onda se quiebra en zigzag. | 4 |
| Eco rítmico | 400 ✦ | Dos ecos siguen a la onda, a corcheas. | 4 |
| Cargado | 600 ✦ | Cuanto más esperas entre pulsos (hasta 4 s), más brilla el siguiente; nunca llega más lejos. | 4 |

### Voz del pulso

Una a la vez · voces sintetizadas existentes.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Bombo 808 | 250 ✦ | Golpe grave y redondo. | 5 |
| Campana FM | 250 ✦ | Campana metálica brillante. | 5 |
| Ácido | 300 ✦ | Squelch tipo 303. | 5 |
| Corte vocal | 350 ✦ | Sílaba cortada y afinada. | 5 |
| Scratch | 400 ✦ | Arrastre de vinilo. | 5 |
| Acorde | 500 ✦ | El pulso suena en la armonía de la región. | 5 |

### Sonido del cubo

Todos los comprados activos.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Hi-hat al caminar | 300 ✦ | Pasos a tempo. | 5 |
| Filtro | 500 ✦ | Al acelerar, la música se abre como un barrido. | 5 |
| Tarareo | 600 ✦ | Tararea bajito la melodía de la región. | 5 |
| Modo DJ | 700 ✦ | Scratch al cambiar de dirección. | 5 |
| Antena | 900 ✦ | Oye de lejos la radio de la región vecina. | 5 |

### Gestos

Todos los comprados activos.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Pose | 100 ✦ | Quieto cinco segundos: posa. | 4 |
| Voltereta | 150 ✦ | Dos pulsos seguidos: da una vuelta. | 4 |
| Confeti | 200 ✦ | Confeti de píxeles al ganar un logro. | 4 |
| Baile | 300 ✦ | Gira en círculo y baila. | 4 |
| Baile de victoria | 400 ✦ | Al completar una actividad (las carreras son actividades). | 4 |

### El mundo reacciona

Todos los comprados activos.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Linterna | 250 ✦ | Luz propia en el Subsuelo. | 6 |
| Hierba | 300 ✦ | La hierba se aparta a tu paso. | 6 |
| Charcos | 400 ✦ | Los charcos reflejan el cubo. | 6 |
| Séquito | 500 ✦ | Las criaturas te siguen un poco más. | 6 |
| Tu constelación | 800 ✦ | Las estrellas forman tu inicial. | 6 |

### Locuras

Todos los comprados activos.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Morse | 300 ✦ | Parpadea tu nombre en morse. | 6 |
| Mochila | 500 ✦ | Lleva colgadas tus tres últimas tarjetas. | 6 |
| Pantalla | 600 ✦ | Muestra el BPM o el género que suena. | 6 |
| Holograma | 700 ✦ | Proyecta tu tarjeta favorita encima. | 6 |
| Disfraces | 1500 ✦ | Esfera, pirámide o dodecaedro durante un minuto. | 6 |
| Piel VJ | 1500 ✦ | Los visuales VJ sobre el cuerpo del cubo. | 6 |

### Habilidades

Todas las compradas activas · dan ventaja.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Imán corto | 1000 ✦ | Recoge fragmentos un poco más lejos. | 7 |
| Sprint | 1200 ✦ | Acelerón breve con recarga. | 7 |
| Planeo | 1500 ✦ | Planea en el Cielo en lugar de caer. | 7 |

## Orden de construcción

Cada tanda es una rama desde `main`, con pruebas unitarias del modelo, recorrido de navegador de compra/equipo/recarga y, en la tanda 5, renders de audio. Precios y nombres pueden ajustarse al ver cada pieza en movimiento.

0. **Base: ranuras, migración de las tres compras actuales y tienda ordenada por ranura con vista previa**
1. **Movimiento y cuerpo** · 17 piezas, 8000 ✦
2. **Ojos, hábitos y accesorios** · 13 piezas, 900 ✦
3. **Rastros y compañeros** · 10 piezas, 4750 ✦
4. **Formas del pulso y gestos** · 12 piezas, 2770 ✦
5. **Sonido: voces del pulso, sonido del cubo y notas pisables** · 12 piezas, 6050 ✦
6. **El mundo reacciona y locuras** · 11 piezas, 7350 ✦
7. **Habilidades y revisión de economía** · 3 piezas, 3700 ✦
