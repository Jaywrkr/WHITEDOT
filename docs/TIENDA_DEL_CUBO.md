# Tienda del cubo

Diseño aprobado por Jay el 20 de octubre de 2026: «me gusta todo». Esta guía es el catálogo de la tienda de chispas y su orden de construcción; no es un backlog de lanzamiento (ese sigue siendo D01–D22). Estado: tanda 0 hecha en alpha.61 (ranuras en `src/cube-shop-model.js`, compras antiguas migradas a su ranura, tienda ordenada por ranura). Tanda 1 hecha en alpha.62: las 17 piezas de Movimiento y Cuerpo, dibujadas en `src/cube-shop-art.js`. «Dado» cambia con cada cristal roto, no con cada golpe. Tanda 2 hecha en alpha.63: Ojos, Hábitos y Accesorios (13 piezas), dibujados sobre el cubo en píxeles enteros; con cara, el cubo se dibuja con al menos 10 px aunque el nivel lo haga más pequeño. Rubor se enciende con una tarjeta rara nueva; Saludo guiña hacia la criatura que se acerca; Estornudo ocurre en aire de esporas, polvo o niebla; Mareo tras seis giros en tres segundos. Tanda 3 hecha en alpha.64: Rastros y Compañeros (10 piezas) en `src/cube-shop-world.js`. Arcoíris aparece al romper tres cristales en 1,2 segundos. Huellas del día y Fantasma de ayer guardan un recorrido acotado en `S.cubeRoute` (600 pasos de hoy, 120 puntos del último día jugado); el Fantasma lo repite en miniatura alrededor del cubo para verse siempre. Tanda 4 hecha en alpha.66: Formas del pulso y Gestos (12 piezas) en `src/cube-shop-pulse.js` y `src/cube-shop-moves.js`. Una forma comprada solo cambia el dibujo; la onda alcanza como el pulso original, y elegirla devuelve la forma ganada al pulso original (una forma a la vez). «Cargado» brilla según la espera entre pulsos en lugar de mantener pulsado, para no cambiar los controles. Tanda 5 hecha en alpha.80: Voces del pulso, Sonido del cubo y Notas pisables (12 piezas) en `src/cube-shop-sound.js`. Las voces se sintetizan en el bus de música con la nota y la armonía del pulso original; una voz comprada quita la voz ganada y al revés. Hi-hat, Tarareo, Antena y las notas pisables suenan en la corchea siguiente; nada suena con el sonido apagado o un panel abierto. Cada pieza muestra una marca junto al cubo cuando suena (la Antena, siempre), y esa marca es su imagen en la tienda. Filtro mueve el filtro general de la música, no el volumen. Tanda 6 hecha en alpha.81: El mundo reacciona y Locuras (11 piezas) en `src/cube-shop-wild.js`, solo dibujo. Séquito son tres criaturas que dibujan tu camino, no cambia cómo te siguen las bandadas. Los charcos salen de un hash del lugar, no del azar del juego. Holograma proyecta tu tarjeta más rara (no hay tarjeta favorita). Disfraces se ponen con tres pulsos seguidos y duran un minuto; se turnan esfera, pirámide y dodecaedro. Pantalla va bajo el cubo para no tapar el holograma. Tanda 7 hecha en alpha.82: Habilidades (3 piezas) en `src/cube-shop-skills.js`. Imán corto amplía un 35 % el radio de recogida de fragmentos; Sprint se dispara solo al arrancar tras medio segundo quieto (sin controles nuevos), dura un segundo y se recarga en seis; Planeo convierte el toque del Cielo en 2,5 s de bajada dirigida y aterriza donde termina sobre tierra (sobre el mar sigue planeando hasta 6 s y avisa). Con ella se revisó la economía: las 78 piezas nuevas cuestan la mitad.

## Reglas

- Lo comprado con chispas cambia cómo se ve, se mueve, suena y reacciona el cubo. Nada da ventaja para jugar, salvo la ranura **Habilidades**, que se construye al final con su propia revisión de economía.
- Una sola ranura por tipo. El vestuario que se gana jugando (colores, materiales, formas, rastros, halos) se sigue ganando, marcado en dorado, y se lleva junto a lo comprado. Desde alpha.65 hay un solo rastro a la vez: elegir uno ganado quita el comprado y al revés.
- Todo se cambia en Tu cubo: Llevar (tocar pone o quita, al momento), Tienda (solo lo que no tienes; al comprar te lo pones y pasa a Llevar) y Viaje. Sin vista previa: la imagen de cada pieza es su dibujo real en el juego.
- Cada pieza tiene variante estática con movimiento reducido: nada comprado puede quedar invisible.
- Los sonidos usan las voces sintetizadas, la armonía y el reloj existentes, sin muestras nuevas ni cambios de volumen maestro, y siguen las reglas de silencio, pausa y menús.
- Determinismo y guardado: las compras viven en `sparkEconomy` y lo equipado en `S.cube`, ambos normalizados sin borrar progreso y conservando formatos futuros.
- Rendimiento: una pieza no puede bajar de fluido un móvil medio; compañeros y rastros con límite de partículas.

## Catálogo

81 piezas, 78 nuevas. Precio total: 17030 ✦ tras la revisión de economía de la tanda 7, que dejó a la mitad el precio de las 78 piezas nuevas (antes 33790 ✦; las tres primeras conservan el suyo). La minería medida con `scripts/sparks-calibration.mjs` da de 10 a 14 ✦ por minuto caminando a velocidad normal, así que completar la tienda lleva del orden de 20 a 28 horas de juego activo (antes de 40 a 56); el salto (20 ✦) sigue siendo el gasto repetible.

Desde F3 ([El mundo](MUNDO.md)) tocar a tiempo en el Mundo libre vale ×2 (×3 desde el octavo seguido) y las rondas de los lugares dan 60–120 ✦: con `scripts/spark-economy.mjs` la tienda completa queda en unas 9,4 horas para quien toca a tiempo seis de cada diez pulsos y unas 7 para quien toca nueve de cada diez. Los precios no cambian.

### Movimiento

Una a la vez.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Rodar | 200 ✦ | Avanza girando cara por cara, como un dado. | 1 |
| Gelatina | 75 ✦ | Se aplasta al frenar y se estira al arrancar. | 1 |
| Pogo | 125 ✦ | Avanza a saltitos con sombra que sube y baja. | 1 |
| Patinador | 100 ✦ | Se desliza con inercia visual al soltar. | 1 |
| Gusano | 150 ✦ | Se estira y se encoge para avanzar. | 1 |
| Ingravidez | 175 ✦ | Flota sobre el suelo y se balancea. | 1 |
| Patitas | 250 ✦ | Cuatro patas de píxel al caminar. | 1 |
| Parpadeo | 300 ✦ | Reaparece unos píxeles adelante, a tempo. | 1 |

### Cuerpo

Una a la vez.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Latido | 75 ✦ | Late al tempo de la región. | 1 |
| Camaleón | 150 ✦ | Toma el color del bioma. | 1 |
| Dado | 100 ✦ | Sus caras cambian de número con cada golpe. | 1 |
| Racha | 200 ✦ | Crece un poco con cada cristal de una cadena. | 1 |
| Pecera | 300 ✦ | Cubo de cristal con un pez de luz dentro. | 1 |
| Origami | 350 ✦ | Se despliega como papel al lanzar un pulso. | 1 |
| Ensamblaje | 400 ✦ | Se arma de píxeles al moverse y se desarma al parar. | 1 |
| Bola de disco | 450 ✦ | Refleja puntos de luz en el suelo. | 1 |
| Enjambre | 600 ✦ | Cuatro mini cubos en formación que se reúnen al parar. | 1 |

### Ojos

Una a la vez.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Serio | 20 ✦ | Mirada recta y tranquila. | 2 |
| Dormilón | 30 ✦ | Párpados a media asta. | 2 |
| Curioso | 30 ✦ | Mira lo más interesante que tiene cerca. | 2 |
| Travieso | 40 ✦ | Guiña y mira de reojo. | 2 |
| Rubor | 40 ✦ | Se sonroja al encontrar algo raro. | 2 |

### Hábitos

Todos los comprados activos.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Bostezo | 25 ✦ | Bosteza si te quedas quieto un rato. | 2 |
| Saludo | 30 ✦ | Guiña a las criaturas cercanas. | 2 |
| Estornudo | 40 ✦ | Estornuda chispas en zonas con polen o niebla. | 2 |
| Mareo | 60 ✦ | Se marea si giras muchas veces seguidas. | 2 |

### Accesorio

Uno a la vez.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Bigote | 25 ✦ | Bigote de píxel. | 2 |
| Gorrito | 30 ✦ | Gorrito de fiesta. | 2 |
| Gafas de sol | 40 ✦ | Gafas negras de dos píxeles. | 2 |
| Monóculo | 40 ✦ | Monóculo con cadenita. | 2 |

### Rastro

Uno a la vez · comparte ranura con los rastros ganados.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Polvo viajero | 40 ✦ | Ya existe. Pequeñas chispas al caminar. | 0 |
| Grafiti | 150 ✦ | Pinta el suelo y se borra poco a poco. | 3 |
| Cometa | 175 ✦ | Estela larga que se curva con tus giros. | 3 |
| Huellas del día | 200 ✦ | Tus pasos quedan hasta medianoche. | 3 |
| Jardín | 250 ✦ | Crecen flores donde pasas. | 3 |
| Arcoíris | 300 ✦ | Aparece tras romper tres cristales en cadena. | 3 |
| Notas pisables | 500 ✦ | Deja notas que suenan al volver a pisarlas: loops caminando. | 5 |

### Compañero

Uno a la vez.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Órbita personal | 150 ✦ | Ya existe. Tres luces giran alrededor. | 0 |
| Nube | 150 ✦ | Una nube pequeña llueve sobre el cubo. | 3 |
| Pájaro | 200 ✦ | Se posa encima cuando te quedas quieto. | 3 |
| Imitador | 250 ✦ | Mini cubo que repite tu camino con retraso. | 3 |
| Satélite DJ | 300 ✦ | Un disquito que gira marcando el tempo. | 3 |
| Fantasma de ayer | 400 ✦ | Tu recorrido del día anterior, en miniatura y transparente. | 3 |

### Forma del pulso

Una a la vez · mismo alcance.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Cuadrado | 20 ✦ | Onda cuadrada. | 4 |
| Facetado | 80 ✦ | Ya existe. Rombos sobre la onda. | 0 |
| Estrella | 40 ✦ | Onda en estrella. | 4 |
| Doble anillo | 50 ✦ | Dos ondas casi juntas. | 4 |
| Espiral | 75 ✦ | La onda gira al abrirse. | 4 |
| Rayo | 125 ✦ | La onda se quiebra en zigzag. | 4 |
| Eco rítmico | 200 ✦ | Dos ecos siguen a la onda, a corcheas. | 4 |
| Cargado | 300 ✦ | Cuanto más esperas entre pulsos (hasta 4 s), más brilla el siguiente; nunca llega más lejos. | 4 |

### Voz del pulso

Una a la vez · voces sintetizadas existentes.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Bombo 808 | 125 ✦ | Golpe grave y redondo. | 5 |
| Campana FM | 125 ✦ | Campana metálica brillante. | 5 |
| Ácido | 150 ✦ | Squelch tipo 303. | 5 |
| Corte vocal | 175 ✦ | Sílaba cortada y afinada. | 5 |
| Scratch | 200 ✦ | Arrastre de vinilo. | 5 |
| Acorde | 250 ✦ | El pulso suena en la armonía de la región. | 5 |

### Sonido del cubo

Todos los comprados activos.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Hi-hat al caminar | 150 ✦ | Pasos a tempo. | 5 |
| Filtro | 250 ✦ | Al acelerar, la música se abre como un barrido. | 5 |
| Tarareo | 300 ✦ | Tararea bajito la melodía de la región. | 5 |
| Modo DJ | 350 ✦ | Scratch al cambiar de dirección. | 5 |
| Antena | 450 ✦ | Oye de lejos la radio de la región vecina. | 5 |

### Gestos

Todos los comprados activos.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Pose | 50 ✦ | Quieto cinco segundos: posa. | 4 |
| Voltereta | 75 ✦ | Dos pulsos seguidos: da una vuelta. | 4 |
| Confeti | 100 ✦ | Confeti de píxeles al ganar un logro. | 4 |
| Baile | 150 ✦ | Gira en círculo y baila. | 4 |
| Baile de victoria | 200 ✦ | Al completar una actividad (las carreras son actividades). | 4 |

### El mundo reacciona

Todos los comprados activos.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Linterna | 125 ✦ | Luz propia en el Subsuelo. | 6 |
| Hierba | 150 ✦ | La hierba se aparta a tu paso. | 6 |
| Charcos | 200 ✦ | Los charcos reflejan el cubo. | 6 |
| Séquito | 250 ✦ | Tres criaturas te siguen un rato. | 6 |
| Tu constelación | 400 ✦ | Las estrellas forman tu inicial. | 6 |

### Locuras

Todos los comprados activos.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Morse | 150 ✦ | Parpadea tu nombre en morse. | 6 |
| Mochila | 250 ✦ | Lleva colgadas tus tres últimas tarjetas. | 6 |
| Pantalla | 300 ✦ | Muestra el BPM o el género que suena. | 6 |
| Holograma | 350 ✦ | Proyecta encima tu tarjeta más rara. | 6 |
| Disfraces | 750 ✦ | Tres pulsos seguidos: esfera, pirámide o dodecaedro durante un minuto. | 6 |
| Piel VJ | 750 ✦ | Los visuales VJ sobre el cuerpo del cubo. | 6 |

### Habilidades

Todas las compradas activas · dan ventaja.

| Pieza | Precio | Qué hace | Tanda |
|---|---|---|---|
| Imán corto | 500 ✦ | Recoge fragmentos un poco más lejos. | 7 |
| Sprint | 600 ✦ | Al arrancar tras parar, un acelerón breve. Se recarga en 6 s. | 7 |
| Planeo | 750 ✦ | En el Cielo, toca y planea unos segundos antes de bajar. | 7 |

## Orden de construcción

Cada tanda es una rama desde `main`, con pruebas unitarias del modelo, recorrido de navegador de compra/equipo/recarga y, en la tanda 5, renders de audio. Precios y nombres pueden ajustarse al ver cada pieza en movimiento.

0. **Base: ranuras, migración de las tres compras actuales y tienda ordenada por ranura con vista previa**
1. **Movimiento y cuerpo** · 17 piezas, 4000 ✦
2. **Ojos, hábitos y accesorios** · 13 piezas, 450 ✦
3. **Rastros y compañeros** · 10 piezas, 2375 ✦
4. **Formas del pulso y gestos** · 12 piezas, 1385 ✦
5. **Sonido: voces del pulso, sonido del cubo y notas pisables** · 12 piezas, 3025 ✦
6. **El mundo reacciona y locuras** · 11 piezas, 3675 ✦
7. **Habilidades y revisión de economía** · 3 piezas, 1850 ✦
