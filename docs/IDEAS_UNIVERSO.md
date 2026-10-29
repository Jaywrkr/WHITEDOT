# Ideas para el universo

Catálogo de 119 ideas para que recorrer el universo sea más divertido. Más **Constelaciones**, la primera idea grande ya elegida. Lo pidió Jay el 28 de octubre de 2026. Toques musicales, cultura musical y cultura popular.

**Qué es y qué no es.** Jay aprueba el catálogo como dirección. **No autoriza construir nada.** Cada fase empieza solo cuando Jay la elige. Una idea elegida no está construida, probada con personas ni publicada.

**Estado (28 de octubre de 2026):** **F1 «Mapa del cielo» está hecha** en la rama `universo/f1-mapa-del-cielo` (alpha.231), sin PR, sin CI remoto, sin teléfono ni personas. Qué entró y qué quedó para después, en [F1](#f1--constelaciones) y en [Mapa del cielo](HALLAZGOS_Y_ACTIVIDADES.md#mapa-del-cielo). Las demás fases siguen sin empezar. **El [Mapa del universo](MUNDO.md#mapa-del-universo)** (alpha.235, rama `jay/mapa-universo`, pedido por Jay aparte de las fases) cubre parte de F2: ver [Mapa del universo y F2](#mapa-del-universo-y-f2).

**Fuera del catálogo (29 de octubre de 2026):** «Ganas de volver» (alpha.236, rama `jay/volver`), elegida por Jay aparte: racha suave en el cielo del Refugio y carta del universo al volver. Cumple las siete reglas: sin castigo, sin chispas, sin humanos. [El mundo](MUNDO.md#ganas-de-volver).

**Las dos direcciones son lentes simuladas.** Como el [panel](PANEL.md), son perfiles hechos a partir de obra pública. No son esas personas ni sus opiniones reales. Las decisiones de Jay mandan.

[Traspaso](../HANDOFF.md) · [Universo](UNIVERSO.md) · [Encuentros vivos](HALLAZGOS_Y_ACTIVIDADES.md#encuentros-vivos) · [El mundo](MUNDO.md) · [Plan](PLAN_LANZAMIENTO.md#universo-vivo--encuentros)

## Un universo sin personas

No hay humanos ni personas. Todo son astros, criaturas, máquinas, materia y luz. Si una idea nombra algo humano (una ventana, una mano, un museo), es una forma de luz o una máquina. Nadie vive allí.

## Siete reglas de claridad y reversibilidad

Jay: «que no me encuentre con que algo pasa y no puedo volver al estado anterior». Toda idea cumple las siete. Si no puede, no entra.

1. **Siempre se ve el siguiente paso.** Un aro o una flecha blanca, como en los encuentros vivos.
2. **Siempre se puede salir.** Alejándose (720 u, como los encuentros vivos) o con «Salir» en las escenas con puerta. Se vuelve al estado anterior sin perder nada.
3. **Toda transformación dura un tiempo visible.** Un arco blanco junto al cubo se vacía. Al acabar, todo vuelve solo. Se puede quitar antes.
4. **Lo inacabado queda guardado donde se dejó.** Al volver, sigue igual.
5. **Las cadenas se ven en la Bitácora.** Una línea por cadena: «Paso 2 de 5 · Ve a…». Cualquiera se puede abandonar.
6. **Sin castigos.** Fallar no quita chispas, progreso ni piezas. No hay pantalla de derrota.
7. **La música base no cambia.** Lo sonoro va encima, suave, en la tonalidad y el tempo del lugar. Se apaga al irse.

**Restricciones fijas del juego.** El cubo es pequeño y no crece. Negro puro, Geist Mono y esquinas rectas. Blanco para lo siguiente y lo seguro. Dorado solo para lo ganado. Nada con marcas, personajes ni canciones con derechos: solo homenajes genéricos o dominio público (la «Oda a la alegría», el disco de oro de la Voyager). Todo se coloca con `hashKey`: el mapa no se mueve y el RNG antiguo no se consume. Sin cuenta ni nube.

**Distancias.** 10 u son 1 m (`formatDistance`); 1 km son 10.000 u. A 190 u/s, la velocidad del cubo, un kilómetro tarda unos 53 s. 77 km son algo más de una hora de viaje seguido. Los saltos no cuentan como caminar.

## Dirección de arte · Ken Wong (lente simulada)

Director de arte de *Monument Valley* y creador de *Florence*. Simulación de su mirada a partir de su obra pública. No es su opinión real.

**Principios.**

- **Una sola forma.** Cada idea se lee en 1 s, a 390×844, junto a un cubo pequeño.
- **El color significa.** El color de la región marca lo que se toca o lo que amenaza. El blanco, lo siguiente y lo seguro. El dorado, lo ganado.
- **Geometría limpia.** Líneas, puntos, arcos y discos. Sin texturas ni degradados largos.
- **El movimiento explica.** Avisa antes de actuar (0,5–1,4 s, como las amenazas de los encuentros vivos). Se transforma en vez de desaparecer: crece desde un punto y vuelve a un punto. El final se ve.
- **Una postal antes de construir.** Una captura a 390×844 por idea, con el cubo en pantalla. Si la postal no se entiende, la idea no se construye.

**Lista de revisión de arte** (antes de entrar en `main`):

- [ ] **Silueta:** se reconoce en negro y blanco, sin color.
- [ ] **Contraste:** se lee sobre la luz de su región (las criaturas de E1 se perdían sobre Polvo y Esporas; llevan halo, disco oscuro y aro).
- [ ] **Legible junto al cubo:** el cubo no crece; la idea no lo tapa ni se confunde con él.
- [ ] **Entrada y salida animadas:** aparece y se va con un movimiento propio, nunca de golpe.
- [ ] **Coherencia de estilo:** negro puro, Geist Mono, esquinas rectas, dorado solo en lo ganado. Respeta movimiento reducido y «Textos en el universo».
- [ ] **Postal guardada** junto a su recorrido de navegador.

## Dirección de audio · Disasterpeace (Rich Vreeland, lente simulada)

Compositor de *Fez*, *Hyper Light Drifter* e *It Follows*. Simulación de su mirada a partir de su obra pública. No es su opinión real.

**Principios.**

- **La música base es sagrada.** Ninguna idea cambia notas, armonía, mezcla, tempo ni familia del lugar.
- **Cada interacción es una nota a tiempo.** En la armonía que suena, cuantizada al pulso (`journey-pulse.js`, `cueDelay`), con los instrumentos de la familia del lugar (`musicalCharacter`).
- **Espacio y distancia.** Lo lejano suena lejos: más bajo, más filtrado y desde su lado. Se oye antes de verse, como los hitos de `landmarks.js`.
- **El silencio es un recurso.** El Abismo y la nube de silencio valen tanto como una melodía.
- **Capas muy por debajo.** Notas sueltas como las de los encuentros vivos: ganancia 0,02 o menos, unos 29 dB por debajo de la música. Capas que duran, más bajas aún, cerca de la lluvia (unos 42 dB por debajo en tormenta). Siempre medido con render.
- **Escucha en teléfono con auriculares.** Lo que no se ha oído así se dice.

**Lista de revisión de audio** (antes de entrar en `main`):

- [ ] **Tonalidad y tempo:** cada nota sale de la armonía que suena y cae en el pulso.
- [ ] **Nivel medido por render:** prueba propia como `tests/live_encounters_mix.py`. La música del Mundo queda idéntica (mismo pico y nivel por medio segundo).
- [ ] **Entrada y salida suaves:** fundidos de al menos un compás; se apaga al irse.
- [ ] **Sin sonido se puede jugar:** el orden y el tiempo se leen en pantalla.
- [ ] **Escucha en teléfono con auriculares,** anotada como hecha o pendiente. Nunca se afirma sin hacerla.

## Constelaciones · ficha ampliada (F1)

La primera idea grande, elegida por Jay. Estrellas sueltas en el cielo que se unen en figuras.

**Ya existe parecido** (hay que distinguirlo bien):

| Lo que hay | Dónde | Cómo se distingue |
|---|---|---|
| Región «Constelaciones» del Abismo | [Universo](UNIVERSO.md#regiones-nuevas), `universe-regions.js` | Es el paisaje. F1 la usa como lugar favorito de las estrellas; no la sustituye |
| Encuentro vivo `constelacion` (Vacío, hacer) | [Encuentros vivos](HALLAZGOS_Y_ACTIVIDADES.md#encuentros-vivos) | Seis estrellas de una vez, 26–30 s, con chispas. F1 son figuras con nombre que se guardan y se completan en varias visitas. Propuesta: no cuentan entre sí |
| Actividad «Constelación caída» | [Treinta actividades](HALLAZGOS_Y_ACTIVIDADES.md#treinta-actividades) | Empujar estrellas a su marca dentro de un portal. Queda igual |
| Constelaciones musicales (`identity-play.js`) | Notas tocadas guardadas como figura, hasta 24 | Son tuyas y libres. F1 son figuras fijas del cielo. Nombre en la Bitácora: «Mapa del cielo», para no repetir |
| «La Constelación» de reliquias (`sharing.js`) | Reliquias del Mundo | Sin cambio. Riesgo de nombre: Jay decide si se renombra una de las dos |

**Qué la dispara.** Estrellas sueltas en el cielo, más de noche (hora real, como `world-light.js`) y en Vacío, Púlsares y el Abismo. Cada estrella aparece por `hashKey('sky:v1:'+mundo+':'+celda)`; el mapa no se mueve. Una estrella de una figura sin empezar brilla en blanco tenue.

**Cómo se une.** Pasar por una estrella o tocar a tiempo cerca de ella. Cada estrella es una nota de la armonía que suena. La línea hasta la anterior se dibuja en blanco. La siguiente estrella lleva un aro blanco y la flecha la señala.

**Al completarla.** La figura se enciende entera un compás. Suena su motivo de 5–8 notas encima de la música, a tiempo, a nivel de nota de encuentro. Se guarda en el Mapa del cielo de la Bitácora. Paga chispas una vez.

**Claridad y reversibilidad.**

- Lo empezado queda guardado: las estrellas unidas siguen unidas al volver (regla 4).
- Alejarse no borra nada. La figura a medias se ve en la Bitácora: «Orión · 4 de 7 · al norte».
- Una figura a medias se puede soltar desde la Bitácora; sus estrellas vuelven a blanco tenue.
- Sin tiempo límite y sin castigo.

**Catálogo.** Reales, de dominio público: Orión, Osa Mayor, Casiopea, Cruz del Sur, los doce del zodiaco y, por tandas, hasta las 88. Propias: Gato, Vinilo, Auricular, Cubo, Ballena, Cohete, Guitarra y Mano de Luca.

**Rareza por distancia y hora real** (propuesta):

| Banda | Qué aparece |
|---|---|
| 0–5 km | Figuras cortas (3–5 estrellas): Casiopea, Cubo, Gato |
| 5–20 km | Orión, Osa Mayor, zodiaco |
| 20–50 km | Figuras largas y propias raras: Ballena, Guitarra |
| 50+ km | Las últimas de las 88 y Mano de Luca |

Orientación: la Osa Mayor hacia el norte del mapa y la Cruz del Sur hacia el sur. El zodiaco, a lo largo de una franja (la eclíptica del mapa). Algunas figuras, solo de noche real.

**Series con premio.** Zodiaco (12), Propias (8), Cielo del norte, Cielo del sur. Cerrar una serie da un adorno dorado para el cubo (dorado: es ganado). Las series se ven en el Mapa del cielo.

**Arte.** Puntos blancos de 2 px en la capa lejana. Líneas de 1 px. La figura completa, un instante con brillo. El cubo no cambia.

**Audio.** Una nota por estrella, a 0,02 o menos. Motivo al completar, una octava arriba, con el primer instrumento melódico de la familia. Sin sonido, el orden se lee en los aros.

**Riesgos.** Rendimiento: pocas estrellas por pantalla y dibujo en la capa lejana. Legibilidad: no confundirlas con los Púlsares ni con la región Constelaciones; el aro blanco manda. Mezcla: motivo de 5–8 notas, nunca un acorde sostenido.

**Bien cuando.** Una persona sin ayuda une su primera figura en Vacío de noche. La deja a medias, vuelve y la encuentra igual. La música del Mundo queda idéntica en render. Recorrido de navegador con postal a 390×844.

## Las 119 ideas

Columnas: **Nº** · **Idea** · **Qué la dispara** · **Siguiente paso visible** · **Cómo se sale / vuelve** · **Arte** (una línea) · **Audio** (una línea) · **Fase**. «(ya existe parecido: …)» marca lo que ya hay en el juego y cómo se distingue.

Abreviaturas: *alejarse* = 720 u, como los encuentros vivos. *Nota de encuentro* = una nota de la armonía que suena, a tiempo, ganancia 0,02 o menos. *Arco* = arco blanco junto al cubo que se vacía.

### Instrumentos del cosmos

| Nº | Idea | Qué la dispara | Siguiente paso visible | Cómo se sale / vuelve | Arte | Audio | Fase |
|---|---|---|---|---|---|---|---|
| 1 | Piano de estrellas en el suelo (ya existe parecido: micro-instrumentos de `micro-instruments-model.js`; aquí es una escala entera que se pisa) | Franja de 8 estrellas en Polvo, por `hashKey` | La tecla siguiente de una frase sugerida lleva aro blanco | Alejarse; nada cambia | Ocho rectángulos de luz en fila | Cada tecla, una nota de la escala del lugar, a tiempo | F3 |
| 2 | Marimba de asteroides (ya existe parecido: hallazgo «Hueso de un animal de cristal», marimba; aquí se toca) | Hilera de asteroides en Restos | Brilla el asteroide que completa la frase | Alejarse | Rocas de tamaños en escalera | Golpe corto de marimba sintética, en la escala | F3 |
| 3 | Rejilla de 16 púlsares para programar un ritmo (ya existe parecido: encuentro «Cuatro púlsares» y Taller del Refugio; aquí es un paso a paso de 16) | Cuadrado de 4×4 púlsares en Púlsares | Una luz blanca recorre los 16 pasos | Alejarse: el ritmo se funde en un compás. El patrón queda guardado allí | Rejilla de puntos amarillos | Percusión suave encima, solo mientras estás dentro | F3 |
| 4 | Planeta-vinilo: arañas sus anillos | Planeta con surcos en Anillos | Una marca blanca en el surco donde empezar | Alejarse; el planeta sigue girando | Disco negro con bandas crema | Rasgado filtrado en el pulso; nunca para la música | F3 |
| 5 | Antena de un satélite muerto (teremín) (ya existe parecido: encuentro «Antena caída»; aquí la antena se queda y suena por distancia) | Satélite en Tormenta solar | Un aro blanco marca la distancia de la nota más grave | Alejarse: el tono baja y se apaga | Mástil y dos arcos | Tono continuo, cuantizado a la escala; nivel de capa | F3 |
| 6 | Campanas de hielo de un cometa (ya existe parecido: región Cometas y hallazgo «Campana sin interior»; aquí una melodía abre algo) | Cola de cometa con 7 campanas | Las campanas de la «Oda a la alegría» brillan en orden | Alejarse; lo tocado queda guardado | Gotas de hielo colgando | Campana suave; frase de dominio público al completar | F3 |
| 7 | Coro de ballenas cósmicas (ya existe parecido: hallazgo «Luna doblada en cuatro», coro sin palabras) | Grupo de ballenas en el Abismo | La ballena que espera tu nota abre la boca | Alejarse; se alejan nadando | Siluetas largas de línea | Notas largas en la tónica, lejanas | F3 |
| 8 | Cristal que graba tus toques y los repite en el mapa (ya existe parecido: looper ⟳ de `jam.js`; aquí es un objeto del mundo, no un botón) | Cristal hueco en Prisma | Un anillo de 2 compases se llena mientras grabas | Alejarse: se apaga. «Borrar» al tocarlo dos veces | Cristal con un anillo blanco | Tus notas repetidas, más bajas, solo cerca | F3 |
| 9 | Torre de geodas que resuenan (eco dub) | Torre en Marea | La geoda siguiente brilla | Alejarse: el eco se apaga en dos compases | Columna de hexágonos | Eco con retardo a tempo sobre tus notas | F3 |
| 10 | Duelo de ritmo con un púlsar rival (ya existe parecido: la Cueva, llamada y respuesta; aquí es corto, sin ★) | Púlsar que parpadea a destiempo | Su patrón se dibuja en la Línea antes de tu turno | Alejarse; sin derrota | Dos púlsares frente a frente | Llamada y respuesta de 2 compases | F3 |
| 70 | Arpa de rayos de luz (ya existe parecido: «Campo de espejos» y espejos musicales; aquí no es un puzle) | Abanico de rayos en Prisma | El rayo siguiente de la frase se vuelve blanco | Alejarse | Líneas paralelas aguamarina | Cuerda pulsada por rayo cruzado | F3 |
| 71 | Columnas de cristal (órgano); tres en orden abren una cripta (ya existe parecido: actividad «Catedral de acordes»; aquí está en el mundo y abre la capa `bajo`) | Tres columnas en Prisma | Números 1-2-3 sobre las columnas | Alejarse; el orden tocado se guarda. Cripta: «Salir» | Columnas altas, una nota cada una | Acorde de órgano suave al completar | F3 |
| 72 | Tambores en la superficie de un planeta-océano (ya existe parecido: encuentro «Burbujas al ritmo») | Planeta-océano en Marea | Círculos blancos donde caerá el golpe | Alejarse | Ondas que salen del golpe | Tambor grave a tiempo | F3 |
| 73 | Péndulo de un planeta (metrónomo; 16 pulsos sincronizados) | Planeta que oscila en Púlsares | Contador de 16 cuadraditos junto al cubo | Alejarse; los aciertos quedan | Arco de péndulo | Tic suave en el pulso; nada al fallar | F3 |
| 74 | Tres auroras-fader (ya existe parecido: región Aurora; aquí cada cortina abre una capa) | Tres cortinas en una Aurora | La cortina sin abrir tiene borde blanco | Salir de la cortina apaga su capa | Cortinas verticales | Capa solo mientras estás encima | F3 |
| 75 | Caracola cósmica que devuelve tus notas en otra tonalidad (ya existe parecido: hallazgo «Caracol que guarda un océano»; aquí es un instrumento) | Caracola en Anillos | Espiral blanca que se llena al tocar | Alejarse | Espiral de una línea | Tus notas, una quinta arriba, dentro de la armonía | F3 |
| 76 | Bosque de tubos de hielo que silban con tu velocidad | Tubos en un borde de Anillos | Los tubos más cerca se iluminan | Parar o alejarse | Líneas verticales de alturas distintas | Silbido según velocidad, cuantizado | F3 |
| 77 | Dunas que respiran (acordeón) | Dunas en Anillos | Las bandas se abren hacia donde vas | Alejarse | Bandas que se expanden y contraen | Acorde de acordeón sintético muy bajo | F3 |
| 78 | Estrella binaria que se alinea si tocas exacto (afinador) | Binaria en Púlsares | Dos puntos que se acercan con cada acierto | Alejarse; la alineación queda | Dos puntos y una línea | Dos notas que se funden en unísono | F3 |
| 79 | Jam de tres criaturas; eliges cuál se une a Tu canción (ya existe parecido: banda de criaturas de `jam.js` y Jardín de voces; aquí se elige una para Tu canción) | Tres criaturas tocando en círculo | La que no has oído brilla | Alejarse. Cambiable en la Bitácora | Tres siluetas con su color | Cada una, una capa; la elegida, en Tu canción | F3 |

### Escenas musicales

| Nº | Idea | Qué la dispara | Siguiente paso visible | Cómo se sale / vuelve | Arte | Audio | Fase |
|---|---|---|---|---|---|---|---|
| 11 | Rave de luciérnagas en un asteroide hueco (ya existe parecido: «Luciérnagas del pozo» y el festival de luces de `world-happenings.js`; aquí es una escena a la que se entra) | Asteroide con boca brillante | La boca tiene aro blanco | «Salir» o alejarse | Puntos que laten al pulso | Capa de hi-hats encima, en tempo | F6 |
| 12 | Batalla de giros con estrellas de neutrones (ya existe parecido: travesura «Imitador torpe»; aquí ellas giran y tú respondes) | Dos estrellas que giran | Flecha curva con el giro que toca | Alejarse | Estrellas con estelas circulares | Barrido por giro, a tiempo | F6 |
| 13 | Coro de estrellas: tocas cuando se ilumina cada símbolo (ya existe parecido: encuentro «Nodos que suenan» y actividad «Orquesta dormida») | Semicírculo de estrellas | El símbolo siguiente se enciende blanco | Alejarse | Estrellas con un símbolo geométrico | Una voz de coro por símbolo | F6 |
| 14 | Procesión de cometas (ya existe parecido: región Cometas y travesura «Público escondido») | Fila de cometas que cruza | La primera cometa tiene aro blanco | Dejar de seguirla | Estelas en diagonal | Nota por cometa alcanzada | F6 |
| 15 | Orilla de los Anillos al atardecer de dos soles (bossa) (ya existe parecido: hallazgo del caracol, bossa nova) | Atardecer real en Anillos | Dos soles bajos señalan la orilla | Alejarse | Dos discos naranjas en el borde | Guitarra suave encima, sin cambiar la familia | F6 |
| 16 | Trío de criaturas del Pozo que te deja un solo (jazz) | Tres criaturas en el borde del Pozo | Un hueco de 2 compases marcado en la Línea | Alejarse | Tres siluetas rojas | Tus notas en una escala de blues sobre la armonía | F6 |
| 17 | Nebulosa-festival que late a 20 km (ya existe parecido: hitos de `landmarks.js`, que se oyen antes de verse) | Se oye desde 20 km | Flecha lejana en el borde | Alejarse; el sonido se apaga con la distancia | Nebulosa con un pulso de luz | Bombo lejano, filtrado por distancia | F6 |
| 18 | Cápsulas de sonido: remixes de Tu canción en otros géneros (ya existe parecido: cápsulas del Refugio, `house-capsules.js`) | Cápsula en el suelo | Al tocarla, una tarjeta dice qué género | Se escucha en la Bitácora; se puede parar | Cápsula rectangular | Tu canción en otra familia, solo en la Bitácora | F6 |
| 19 | Discos de meteorito enterrados (ya existe parecido: actividad «Excavación de cristal» y reliquias) | Grieta brillante en Restos | Grieta con borde blanco | Alejarse; lo excavado queda | Disco con surcos | Frase corta al desenterrarlo | F6 |
| 20 | Prisma-gramola: eliges la familia musical del siguiente bioma por un rato (choca con la regla 7: decisión de Jay) | Gramola en Prisma | Arco con el tiempo que queda | Se quita al tocarla; vuelve sola al acabar | Prisma con diez caras | Cambia la familia un rato; necesita aprobación expresa | F6 |
| 80 | Nebulosa que canta y guía a un anfiteatro de cráteres (ya existe parecido: `landmarks.js`) | Canto lejano | Flecha blanca al anfiteatro | Alejarse | Cráteres concéntricos | Voz lejana que crece al acercarse | F6 |
| 81 | Cuarteto de cometas | Cuatro cometas en el Abismo | La cometa que falta brilla | Alejarse | Cuatro estelas paralelas | Cuatro voces, una por cometa | F6 |
| 82 | Flores de las Esporas que bailan de lado a lado (cumbia) (ya existe parecido: encuentro «Cinco brotes») | Claro de flores en Esporas | Las flores se inclinan hacia el lado del pulso | Alejarse | Flores rosas de 5 pétalos | Güiro sintético encima, en tempo | F6 |
| 83 | Viento solar que silba hacia un secreto (ya existe parecido: pistas de `clues.js`) | Ráfaga en Tormenta solar | Líneas de viento apuntan al secreto | Dejar de seguirlo | Líneas violetas | Silbido que sube al acercarte | F6 |
| 84 | Asteroides que chocan como palmas (flamenco) (ya existe parecido: hallazgo «Zapato de un gigante bailarín») | Pares de asteroides | El par siguiente se marca un pulso antes | Alejarse | Dos rocas que se juntan | Palmas en contratiempo | F6 |
| 85 | Impactos de meteoritos como taiko (ya existe parecido: «Lluvia de llamaradas» y «Derrumbe al compás»; aquí no amenazan, los lanzas tú) | Campo de cráteres | Cráter vacío con aro blanco | Alejarse | Impacto con anillo | Tambor grave en el pulso | F6 |
| 86 | Púlsar maestro que enseña patrones (ya existe parecido: rondas de los lugares; aquí sin ★) | Púlsar grande | Patrón dibujado antes de tu turno | Alejarse; lo aprendido queda | Púlsar con haz doble | Patrón de 1 compás, tu respuesta | F6 |
| 87 | Taller de enanas blancas que afina tus constelaciones (depende de F1) | Estrella blanca en el Abismo | Lista de figuras por afinar | Alejarse | Disco blanco pequeño | Motivo de una figura, otra variación | F6 |
| 88 | Trío de nebulosas de gira por tres biomas | Nebulosa con cartel de gira | Bitácora: «Paso 1 de 3 · Ve a Marea» | Abandonable en la Bitácora | Tres nubes de color | Un tema que cambia de instrumento en cada parada | F6 |
| 89 | Disco de oro (homenaje a la Voyager) al juntar 10 cápsulas (depende de 18) | Diez cápsulas reunidas | Contador en la Bitácora | Nada que salir | Disco dorado (ganado) | Saludo de sonidos del universo, no grabaciones | F6 |

### Juegos y guiños

| Nº | Idea | Qué la dispara | Siguiente paso visible | Cómo se sale / vuelve | Arte | Audio | Fase |
|---|---|---|---|---|---|---|---|
| 21 | Criatura-gato de luz que toca tres notas | Gato en un claro | El gato mira la nota siguiente | Alejarse | Silueta de gato de líneas | Tres notas de piano, a tiempo | F6 |
| 22 | 50 patitos de nebulosa escondidos | Patito al pasar cerca | Contador en la Bitácora | Nada que salir | Patito de 6 px | Graznido-nota suave | F6 |
| 23 | Bioma retro de rejilla rosa con sol partido | Región nueva del Abismo | La rejilla apunta al sol | Salir de la región | Rejilla en perspectiva, sol a franjas | La música sigue Ambient (regla del Abismo) | F6 |
| 24 | Planeta dormido con una ventana encendida (modo calma) (ya existe parecido: Quietud viva, `quietud.js`; la ventana es la escotilla de una máquina dormida) | Planeta oscuro | La escotilla brilla cálida | Moverse lo despierta todo | Disco negro y un rectángulo cálido | Baja el ambiente; la música sigue | F6 |
| 25 | Fósil de 8 bits que salta cráteres | Fósil en Restos | El cráter siguiente se marca | Alejarse | Fósil de píxeles grandes | Bip chiptune a tiempo | F6 |
| 26 | Zona chiptune (choca con la regla 7 si cambia la música) | Zona en Prisma | Borde de píxeles | Salir de la zona | Píxeles cuadrados | Capa de onda cuadrada encima, no sustituye | F6 |
| 27 | Huevo de estrella que cuidas (ya existe parecido: la compañera de `pet.js`; aquí nace de un huevo y sigue siendo la misma) | Huevo en Cúmulo | Anillo de crecimiento | Se deja en el Refugio cuando quieras | Huevo con grietas de luz | Nota más aguda al crecer | F6 |
| 28 | Anillo de baile de 4 pasos (ya existe parecido: Tormenta, verbo Bailar) | Anillo en el suelo | Las 4 flechas del paso | Salir del anillo | Círculo con 4 marcas | Nota por paso | F6 |
| 29 | Speedrun entre balizas (ya existe parecido: «Carrera contra tu eco» y «Carrera inesperada»; aquí entre balizas del mapa) | Baliza de salida | Siguiente baliza en blanco | Parar; el récord queda | Postes blancos | Tic por baliza | F6 |
| 30 | Nube de silencio (ya existe parecido: actividad «Santuario del silencio») | Nube gris en el Abismo | Borde de la nube | Salir de la nube | Nube con contorno | Todo baja dentro; vuelve al salir | F6 |
| 31 | Lente de agujero negro que saca postales (ya existe parecido: `share-tools.js`; se une con 63) | Lente en el Pozo | Marco blanco en pantalla | Cerrar el marco | Lente que curva la imagen | Clic de cámara silencioso | F6 |
| 32 | Nave de chatarra que armas y despega (ver el mapa desde arriba) | Piezas en Restos | Bitácora: «Pieza 3 de 6» | Abandonable; las piezas quedan | Nave de líneas | Motor bajo al despegar | F6 |
| 90 | Garra de gravedad (siempre da algo pequeño) (ya existe parecido: caja misteriosa) | Máquina en un satélite | La garra baja sobre lo que señalas | Alejarse | Garra de tres dedos | Nota al soltar | F6 |
| 91 | Fruta cósmica con efectos de 30 s (ya existe parecido: poderes de la caja misteriosa, `box-surprises-model.js`) | Fruta en Esporas | Arco con 30 s | Se quita al tocar el arco; vuelve sola | Fruta geométrica | Cada efecto, una nota distinta | F6 |
| 92 | Planeta helado donde se patina (ya existe parecido: «Gravedad ligera», `gravity.js`) | Planeta blanco | Huella del deslizamiento | Salir del planeta | Superficie con brillos | Siseo suave | F6 |
| 93 | Mini supernovas que lanzas al ritmo | Estrella al tocar a tiempo | Halo que crece | Parar de tocar | Estallido pequeño | Golpe de color a tiempo | F6 |
| 94 | Figura de polvo de estrellas que moldeas | Montón de polvo en Polvo | El surco del cubo la forma | Alejarse; la figura queda un tiempo | Granos ámbar | Arena suave | F6 |
| 95 | Torre de asteroides (si cae, se rehace) | Base de torre | Pieza siguiente con aro blanco | Alejarse | Rocas apiladas | Nota más aguda por piso | F6 |
| 96 | Peloteo con un púlsar (homenaje genérico, sin nombre de marca) | Púlsar con una pala | La bola marca su llegada | Alejarse | Pala, bola y púlsar | Bip a tiempo | F6 |
| 97 | Pesca en un planeta-océano (ya existe parecido: encuentro «Pez de onda») | Planeta-océano en Marea | Aro donde pica | Alejarse | Línea de pesca de luz | Nota al picar | F6 |
| 98 | Telescopio para fotografiar criaturas (ya existe parecido: «Observatorio imposible» y la colección de la Bitácora) | Telescopio en un risco | Marco blanco sobre la criatura | Cerrar el marco | Tubo y lente | Clic suave | F6 |
| 99 | Cápsulas regalo (ya existe parecido: cápsulas del Refugio y caja misteriosa) | Cápsula envuelta | Lazo blanco | Alejarse; queda allí | Caja con cinta | Campanita al abrir | F6 |
| 100 | Géiser estelar que estalla cada cierto tiempo real | Géiser con reloj | Arco con el tiempo que falta | Alejarse | Columna de luz | Subida de filtro al estallar | F6 |

### Easter eggs

| Nº | Idea | Qué la dispara | Siguiente paso visible | Cómo se sale / vuelve | Arte | Audio | Fase |
|---|---|---|---|---|---|---|---|
| 33 | Código de flechas clásico (↑↑↓↓←→←→) (homenaje genérico, sin nombre de marca) | Secuencia de gestos | Ninguno: es secreto | Vuelve solo en 20 s | Destello blanco | Arpegio de 8 notas | F5 |
| 34 | Morse con toques (ya existe parecido: pieza «Morse» de la tienda; aquí tocas tú) | Toques largos y cortos | Puntos y rayas junto al cubo | Parar de tocar | Puntos y rayas | Bip por toque | F5 |
| 35 | Quedarte quieto 2 min (ya existe parecido: Quietud viva; aquí un final propio a los 2 min) | Quieto 2 min | Etapas de color | Moverse | Lo de Quietud, más una estrella | Nota larga final | F5 |
| 36 | 10 vueltas abren un remolino (ya existe parecido: encuentro «Remolino de polvo»; aquí es amable y blanco) | 10 giros seguidos | Contador de vueltas | Parar | Espiral blanca | Barrido que sube | F5 |
| 37 | Coordenadas especiales (0,0; 42 km; 77 km; 100 km) | Llegar allí | Boya en la Bitácora | Nada que salir | Marca única por sitio | Acorde corto | F5 |
| 38 | Fechas reales: nieve de estrellas en Navidad, fuegos en Año nuevo, luna llena real, cumpleaños de Luca (fecha pendiente) | Fecha del dispositivo | Ninguno | Pasa solo; se apaga en Ajustes | Partículas de la fecha | Campanas suaves encima | F5 |
| 39 | Hora real (ya existe parecido: el día y la noche siguen la hora real, `world-light.js`) | Hora del dispositivo | Ninguno | Pasa solo | Cielo según la hora | Nada nuevo | F5 |
| 40 | Dibujar con el recorrido (ya existe parecido: encuentro `constelacion`) | Trazo cerrado del cubo | La línea queda un rato | Se borra sola | Línea blanca fina | Nota al cerrar | F5 |
| 41 | Monolito con un mensaje grabado (genérico, sin copiar ninguna película) | Monolito en el Abismo | Brillo en su cara | Alejarse | Rectángulo negro con borde | Zumbido grave | F5 |
| 42 | Cubo con cara rara | Gesto secreto | Ninguno | Vuelve solo en 10 s | Dos puntos y una línea | Nada | F5 |
| 101 | Cubo dorado a 100 km | Llegar a 100 km | Boyas de distancia | Se puede quitar en Tu cubo | Cubo dorado (ganado) | Acorde mayor | F5 |
| 102 | Asteroide secreto con una nota de Jay y Luca | Coordenada secreta | Ninguno | Alejarse | Asteroide con texto | Frase corta | F5 |
| 103 | Confeti tras 100 aciertos seguidos (la racha ×3 desde 8 existió hasta alpha.232) | 100 a tiempo seguidos | Contador de racha | Pasa solo | Confeti geométrico | Nada extra | F5 |
| 104 | Universo espejado (ya existe parecido: «Gravedad invertida» de `wonders.js`) | Puerta espejo | Arco con el tiempo | Se quita al cruzar otra vez | Mundo reflejado | La música no cambia | F5 |
| 105 | Palabra secreta en Ajustes (añade un control: decisión de Jay) | Campo de texto | Ninguno | Borrarla | Nada | Nada | F5 |
| 106 | Escena tras los créditos | Esperar tras el final | Ninguno | Tocar para salir | Cubo en el Abismo | Último acorde | F5 |
| 107 | Maquinita arcade en un satélite | Satélite con pantalla | Pantalla parpadea | «Salir» | Pantalla pequeña | Bips | F5 |
| 108 | Tu eco que recuerda (ya existe parecido: «Carrera contra tu eco» y encuentro «Tu eco») | Volver a un sitio | Rastro del eco | Alejarse | Cubo translúcido | Tus notas de antes, bajas | F5 |

### Seres que vuelven

| Nº | Idea | Qué la dispara | Siguiente paso visible | Cómo se sale / vuelve | Arte | Audio | Fase |
|---|---|---|---|---|---|---|---|
| 43 | Púlsar errante que enseña trucos (ya existe parecido: encuentro «Púlsar fugaz») | Aparece cada pocos km | Línea de la Bitácora con el truco | Alejarse | Púlsar pequeño | Patrón corto | F4 |
| 44 | Cometa mensajero | Llega con un mensaje | Flecha al destino | Abandonable | Cometa con sobre de luz | Nota de llegada | F4 |
| 45 | Medusa coleccionista de sonidos | Medusa en Marea | Lista de sonidos que pide | Abandonable | Medusa de líneas | Repite lo que guardó | F4 |
| 46 | Sonda perdida con sus registros repartidos | Sonda en Restos | «Registro 2 de 6 · Ve a…» | Abandonable | Sonda con antena | Frase al reunir | F4 |
| 47 | Cubo sombra rival (ya existe parecido: «Ladrón de sombras» e «Imitador torpe»; aquí es un rival que vuelve) | Encuentro repetido | Meta visible | Alejarse; sin derrota | Cubo negro con borde | Su nota, más grave | F4 |
| 48 | Las 8 estrellas de la orquesta (ya existe parecido: actividad «Orquesta dormida»; aquí repartidas por el mapa) | Una estrella por bioma | «3 de 8» en la Bitácora | Abandonable | Estrella con instrumento | Cada una suma una voz | F4 |
| 49 | Asteroide-bazar (ya existe parecido: Tienda del cubo; riesgo de economía) | Asteroide con tenderetes | Lista de trueques | Alejarse | Puestos de luz | Campanita | F4 |
| 50 | El Gran Silencio, agujero negro amable, jefe final a 100 km | Llegar a 100 km | Flecha y distancia | Alejarse; sin derrota | Disco negro enorme | Todo baja hasta el silencio | F4 |
| 109 | Telescopio vivo que pide constelaciones (depende de F1) | Telescopio en un risco | Figura pedida en la Bitácora | Abandonable | Telescopio con ojo | Motivo de la figura | F4 |
| 110 | Burbujas que se le escapan a una estrella (ya existe parecido: encuentro «Burbujas al ritmo») | Estrella con burbujas | La burbuja más cercana | Alejarse | Burbujas blancas | Pop a tiempo | F4 |
| 111 | Púlsar-reloj | Hora real | Agujas de luz | Nada que salir | Púlsar con agujas | Toca la hora | F4 |
| 112 | Nebulosa que mezcla notas | Nebulosa en Prisma | Dos colores que se juntan | Alejarse | Nube con dos colores | Dos notas que forman intervalo | F4 |
| 113 | Sonda cartógrafa | Sonda que deja marcas | Marca en el mapa | Abandonable | Sonda con trazo | Bip al marcar | F4 |
| 114 | Estrellas gemelas separadas (ya existe parecido: encuentro «Estrellita perdida»; aquí a kilómetros) | Una gemela sola | «Busca a su gemela · 3 km» | Abandonable | Dos estrellas iguales | Unísono al reunirlas | F4 |

### Cielo y eventos

| Nº | Idea | Qué la dispara | Siguiente paso visible | Cómo se sale / vuelve | Arte | Audio | Fase |
|---|---|---|---|---|---|---|---|
| 51 | Lluvia de meteoros (ya existe parecido: estrellas fugaces de `world-happenings.js`; aquí con fecha y recogida) | Noche real, fecha | Estelas | Pasa sola | Estelas blancas | Notas lejanas | F5 |
| 52 | Cometa diario (ya existe parecido: región Cometas) | Un cometa por día | Flecha en el borde | Pasa solo | Cometa grande | Nota al pasar | F5 |
| 53 | Eclipse (ya existe parecido: «pasa la sombra de un planeta» en Anillos) | Fecha | Sombra que avanza | Pasa solo | Disco negro sobre luz | Baja el brillo, no la música | F5 |
| 54 | Aurora (ya existe parecido: región Aurora) | Noche real en el norte | Cortina en el borde | Pasa sola | Cortinas | Capa muy baja | F5 |
| 55 | Migración de criaturas (ya existe parecido: encuentro «Caravana») | Temporada | Fila de criaturas | Alejarse | Fila de siluetas | Pasos rítmicos | F5 |
| 56 | Tormenta que acelera el tempo (choca con la regla 7; hay precedente en «Región en canon» de `wonders.js`) | Tormenta | Arco con el tiempo | Pasa sola | Rayos violetas | Propuesta: hi-hats al doble, sin tocar el tempo | F5 |
| 57 | Agujero de gusano (se une con 118) | Estación descubierta | Aro blanco | Volver a entrar | Túnel de anillos | Barrido | F2 |
| 58 | Isla flotante (ya existe parecido: actividad «Corriente de islas») | Isla sobre el Abismo | Puente de luz | Bajarse | Isla con borde | Nada nuevo | F5 |

### Recorrer lejos

| Nº | Idea | Qué la dispara | Siguiente paso visible | Cómo se sale / vuelve | Arte | Audio | Fase |
|---|---|---|---|---|---|---|---|
| 59 | Boyas de luz cada km | Cada km caminado | Boya siguiente en el borde | Nada que salir | Boya blanca con su número | Tic suave | F2 |
| 60 | Rareza por distancia (0–5, 5–20, 20–50, 50+ km) (ya existe parecido: rareza de superbiomas; aquí por distancia) | Distancia al origen | Banda en la Bitácora | Nada que salir | Marca de banda | Nada | F2 |
| 61 | Planetas que solo tocaban tambores, solo cantaban o solo silbaban | Planeta lejano | Su sonido antes de verlo | Alejarse | Planeta de una sola forma | Un solo timbre, lejano | F2 |
| 62 | Mapas estelares del tesoro (ya existe parecido: pistas de `clues.js`) | Mapa encontrado | «Paso 1 de 3 · Ve a…» | Abandonable | Mapa de líneas | Nota al llegar | F2 |
| 63 | Postales (ya existe parecido: `share-tools.js`; se une con 31) | Marco en un sitio bonito | Marco blanco | Cerrar | Postal con borde | Nada | F2 |
| 64 | Cápsulas del tiempo para tu yo futuro | Cápsula vacía | Fecha de apertura | Abrirla antes, si quieres | Cápsula con reloj | Campana al abrir | F2 |
| 65 | Balizas («Restos 3 km») (ya existe parecido: Favoritos) | Baliza | Distancia en la baliza | Nada que salir | Poste con texto | Nada | F2 |
| 66 | Satélites de descanso cada 10 km | Cada 10 km | Satélite en el borde | Alejarse | Satélite con luz cálida | La música baja un poco dentro | F2 |
| 115 | Púlsar del fin a 150 km | Llegar a 150 km | Flecha y distancia | Alejarse | Púlsar inmenso | Haz grave | F2 |
| 116 | Asteroide-museo (ya existe parecido: trofeos del Refugio) | Asteroide | Vitrinas | «Salir» | Vitrinas de luz | Frases de tus hallazgos | F2 |
| 117 | Biblioteca de cristales | Cristales en fila | Cristal sin leer | «Salir» | Estantes de cristal | Nota por cristal | F2 |
| 118 | Puertas de gusano entre estaciones descubiertas (volver de lejos sin saltos libres) (ya existe parecido: «Ir a este lugar» de Favoritos y saltos pagados) | Estación descubierta | Lista de estaciones | Volver por otra puerta | Anillo de luz | Barrido | F2 |
| 119 | Jardín de la memoria (ya existe parecido: Jardín de voces del Refugio) | Hitos del viaje | Planta nueva por hito | Nada que salir | Plantas de luz | Voz por planta | F2 |

### Con Luca

| Nº | Idea | Qué la dispara | Siguiente paso visible | Cómo se sale / vuelve | Arte | Audio | Fase |
|---|---|---|---|---|---|---|---|
| 67 | Dos cubos en un teléfono | Menú «Jugar con dos» | Cada cubo, su mitad | «Salir» vuelve a uno | Dos cubos de color | Cada uno, su nota | F6 |
| 68 | Retos diarios sin internet (ya existe parecido: el Camino del día) | Día nuevo | Reto en la Bitácora | Ignorarlo | Nada nuevo | Nada nuevo | F6 |
| 69 | Álbum de cromos (ya existe parecido: Colección de la Bitácora y tarjetas) | Hallazgos | Hueco vacío | Nada que salir | Cromos con borde | Nada | F6 |

## Fases propuestas

Jay elige la fase y el orden. Ninguna fase empieza sin su elección. Cada fase: una rama desde `main`, sus pruebas, su render si suena y su postal.

**Reglas comunes a todas.**

- **Uno a la vez.** Una sola escena activa, también con los encuentros vivos y las travesuras.
- **Sitio.** Solo en el Mundo libre. Nunca en un capítulo, una ronda, un final, una actividad, el Refugio ni bajo tierra, salvo que la idea lo diga (la cripta de 71).
- **Guardado.** Una clave nueva por sistema, con versión. Se migra sin borrar progreso y se conserva una versión futura.

### F0 · Arreglos A–E

En curso en otra rama. No es parte de este catálogo. Las demás fases esperan a que termine.

### F1 · Constelaciones

- **Qué entra:** la ficha de arriba. Además, la base común: la línea «En curso» de la Bitácora (regla 5), el arco de transformación (regla 3) y el techo de nivel de las capas (regla 7).
- **Reutiliza:** `hashKey`, la región Constelaciones, `world-light.js` (hora real), `journey-pulse.js`, la nota de los encuentros vivos y la Bitácora.
- **Riesgos:** rendimiento (estrellas en la capa lejana), legibilidad (confusión con Púlsares), mezcla (motivos encima) y nombres repetidos.
- **Bien cuando:** se une una figura sin ayuda; a medias queda guardada; la música queda idéntica en render; postal aprobada.
- **Hecha (alpha.231, rama `universo/f1-mapa-del-cielo`).** Guía y medidas en [Mapa del cielo](HALLAZGOS_Y_ACTIVIDADES.md#mapa-del-cielo). Entró: 28 figuras (las 12 del zodiaco; Osa Mayor, Osa Menor, Casiopea, Cisne y Lira en el cielo del norte; Orión, Cruz del Sur y Can Mayor en el del sur; Gato, Vinilo, Auricular, Cubo, Ballena, Cohete, Guitarra y «La Mano»), colocadas con `hashKey` en celdas de 500 m (más de noche y en Vacío, Púlsares y la región Constelaciones; bandas de 0, 5, 20 y 50 km; Osa Mayor y Osa Menor al norte, Cruz del Sur al sur, zodiaco en su franja); unir en orden con aro blanco y flecha; pulso a tiempo que cuenta doble; nota de la escala por estrella y motivo de 5–8 notas al completar (32,8 dB bajo la música, medido); a medias guardada y retomada; «Soltar» en la Bitácora; una escena a la vez con encuentros vivos y travesuras, con su reloj compartido; 10/15 ✦ la primera vez por figura, repetir no paga; zodiaco → halo de estrellas dorado, en Tu cubo; sección «Mapa del cielo» en la Bitácora por series; atajo `?cielo=`. De la base común entró la línea «A medias» de la Bitácora (regla 5); el arco de transformación (regla 3) no hacía falta (nada se transforma) y el techo de nivel de las capas (regla 7) queda en los valores medidos (estrella 0,012, motivo 0,02), sin un módulo propio.
- **Quedó para después:** las 60 figuras que faltan hasta las 88; los premios de Cielo del norte, Cielo del sur y Propias; las figuras a medias en el mapa de la Bitácora (hecho en alpha.235 con el [Mapa del universo](MUNDO.md#mapa-del-universo)); la escucha en teléfono con auriculares; una persona que una su primera figura sin ayuda. Orión va en «Cielo del sur» (es ecuatorial; se lee mejor junto a la Cruz y el Can Mayor): Jay puede moverla.

### F2 · Recorrer lejos (59–66, 115–119 y 57)

- **Qué entra:** boyas, bandas de distancia, balizas, satélites de descanso, puertas de gusano y los sitios lejanos.
- **Reutiliza:** la distancia de «Tú» en la Bitácora, Favoritos, `landmarks.js` (se oye antes de verse), `clues.js` y el Refugio.
- **Riesgos:** que las puertas sean saltos libres (rompen la economía de saltos); que haya demasiadas boyas; rendimiento lejos del origen.
- **Bien cuando:** a 10 km siempre hay algo a la vista; se vuelve de 77 km sin saltos libres; nada se mueve en el mapa.

#### Mapa del universo y F2

Construido en alpha.235 (rama `jay/mapa-universo`), fuera del orden de fases, a petición de Jay. Qué cubre de este catálogo:

- **60 · Rareza por distancia:** los anillos de 5, 20 y 50 km se ven en el mapa con el porcentaje descubierto; un anillo entero queda en dorado. La «banda en la Bitácora» de la idea es este mapa. La rareza por distancia ya existía (Mapa del cielo, `universeReward`).
- **65 · Balizas:** las balizas son un tipo de hito (`landmarks.js`); el mapa muestra los hitos visitados y los oídos («?»). No se añadieron balizas nuevas.
- **118 y 57 · Volver de lejos sin saltos libres:** solo con lo que ya existía. «Volver al anillo» y el «Ir» gratis al siguiente lugar desde lejos (alpha.230) se pueden pedir desde la tarjeta del mapa. No hay puertas de gusano nuevas.
- **62 · Mapas del tesoro (parcial):** «Marcar» deja una marca que la brújula sigue; no hay cadenas ni tesoros.
- **La niebla** (lo no visitado en negro) no es una idea numerada de este catálogo: la idea 8 es el cristal que graba. Queda registrada como parte del mapa.
- **F1, quedó para después:** las figuras a medias ya se ven en el mapa.
- **No cubre:** boyas de luz (59), planetas de un solo timbre (61), postales (63), cápsulas (64), satélites (66), el púlsar del fin (115) ni las escenas 116, 117 y 119.

#### Ritmo (alpha.237)

Construido en la rama `jay/ritmo`, a petición de Jay. No es una fase de este catálogo: son modos dentro de los once lugares, que dan ★ y nunca chispas ([El mundo](MUNDO.md#ritmo)). Sigue las siete reglas: el siguiente paso en blanco, salir sin perder nada, sin castigos, la música base intacta. Relación con el catálogo:

- **10 · Duelo con un púlsar:** sin construir. El Duelo final es otra cosa: un nivel en el centro del anillo, con su ★, tras los once.
- **103 · Confeti tras 100 aciertos:** sin construir. El combo de Ritmo es una estela desde 8 aciertos, solo dentro de una ronda.

### F3 · Instrumentos del cosmos (1–10, 70–79)

- **Qué entra:** los veinte instrumentos, por tandas de cinco.
- **Reutiliza:** `micro-instruments-model.js`, `jam.js`, `musicalCharacter`, `cueDelay` y la capa `bajo` (cripta de 71).
- **Riesgos:** mezcla (muchas capas a la vez), parecido con los micro-instrumentos y con los sonidos de la Tienda del cubo.
- **Bien cuando:** cada instrumento suena en tonalidad y tempo con la música intacta en render; se oye con auriculares en teléfono.

### F4 · Seres que vuelven (43–50, 109–114)

- **Qué entra:** seres que aparecen varias veces y llevan una cadena.
- **Reutiliza:** el motor de los encuentros vivos, la línea «En curso» y `pet.js`.
- **Riesgos:** cadenas largas que se olvidan; el Gran Silencio como «jefe» sin castigo; la economía del bazar.
- **Bien cuando:** cada cadena se ve en la Bitácora, se abandona y se retoma igual.

### F5 · Easter eggs, fechas y cielo (33–42, 101–108, 51–56, 58)

- **Qué entra:** secretos, fechas y hora real, eventos del cielo.
- **Reutiliza:** `world-light.js`, `world-happenings.js`, `wonders.js` y los logros secretos.
- **Riesgos:** fechas en otros husos; tocar la música (56); añadir controles (105).
- **Bien cuando:** cada secreto se descubre sin texto y vuelve solo; nada cambia la música.

### F6 · Escenas musicales, juegos y con Luca (11–32, 80–100, 67–69)

- **Qué entra:** por tandas que elija Jay, de cinco en cinco.
- **Reutiliza:** actividades, travesuras, caja misteriosa, cápsulas y la Bitácora.
- **Riesgos:** demasiados sistemas pequeños; solapes con lo que existe; rendimiento de escenas con muchas partículas; 67 pide un control nuevo.
- **Bien cuando:** cada escena pasa las dos listas de revisión y tiene su postal y su render.

## Solapamientos fuertes

Ideas que casi existen. Propuesta: construir sobre lo que hay, no al lado.

| Idea | Lo que ya hay | Propuesta |
|---|---|---|
| 8 Cristal que graba | Looper ⟳ de `jam.js` | El cristal es la forma visible del looper en el mundo |
| 17, 80 Nebulosas que se oyen lejos | Hitos de `landmarks.js` | Nuevos hitos sobre el mismo sistema |
| 27 Huevo de estrella | Compañera de `pet.js` | Nueva forma de llegar a la compañera |
| 35 Quedarte quieto | Quietud viva | Una etapa final a los 2 min |
| 51 Lluvia de meteoros | Estrellas fugaces de `world-happenings.js` | Mismo suceso, con fecha y recogida |
| 71 Columnas | Actividad «Catedral de acordes» | Versión en el mundo que abre una cripta; o tachar |
| 79 Jam de tres criaturas | Banda de `jam.js` y Jardín de voces | La banda elige una voz para Tu canción |
| 91 Fruta cósmica | Poderes de la caja misteriosa | Nuevos poderes en la misma tabla; o tachar |
| 104 Universo espejado | «Gravedad invertida» de `wonders.js` | Tachar o unir |
| 108 Tu eco | «Carrera contra tu eco» y encuentro «Tu eco» | Tachar o unir |
| 31 y 63 Postales | `share-tools.js` | Una sola idea |
| 57 y 118 Gusanos | Favoritos y saltos pagados | Una sola idea |

## Decisiones de Jay (28 de octubre de 2026)

1. **Orden:** F0 arreglos A–E, luego F1 «Mapa del cielo», F2 Recorrer lejos, F3 Instrumentos, F4 Seres que vuelven, F5 Easter eggs y fechas, F6 Escenas y juegos por tandas.
2. **Nombre:** F1 se llama «Mapa del cielo». Cada figura sigue siendo una constelación.
3. **Repetidas:** no se tachan. Se mejora lo que ya existe con la idea nueva (8 amplía el looper; 27 hace nacer la mascota de un huevo; 51 se caza a tiempo; 104 se une a la «Gravedad invertida»; 31 y 63 son una sola «Postal del universo»). Las demás se unen igual y se listan antes de tocarlas.
4. **20, 26 y 56:** solo como efecto breve con aviso que vuelve solo. La música base no cambia: 20 cambia solo las capas nuevas; 26 suena en 8 bits solo dentro de la zona; 56 acelera el pulso 20 s, como la «Región en canon».
5. **Distancia:** desde el origen (0,0).
6. **Melodías de dominio público:** «Oda a la alegría», «Frère Jacques» y «Estrellita, ¿dónde estás?».
7. **Cumpleaños de Luca (38):** 1 de agosto. Solo día y mes; el año no se guarda ni se muestra.

8. **«Mano de Luca»:** se llama «La Mano». Es un guiño secreto y no nombra a nadie.
9. **Premios:** lo pequeño y repetible da chispas (10–15 ✦, como los encuentros). Lo especial y único da un adorno del cubo o del Refugio y su página en la Bitácora, sin chispas. Las series completas dan un premio grande y visible (el zodiaco: halo de estrellas para el cubo).
10. **Controles nuevos:** «Dos cubos en un teléfono» (67) entra más adelante como fase propia, con su botón «Jugar de a dos». La palabra secreta (105) se cambia por un secreto sin control: tocar el logo siete veces o el código de flechas.
11. **Densidad por km:** algo a la vista cada km (boya, baliza o constelación) y como mucho una escena activa a la vez cada 60–90 s, con el reloj de los encuentros vivos. Desde 20 km lo raro sale más; desde 50 km aparecen leyendas. Un satélite de descanso cada 10 km y una puerta para volver.

Ya no quedan decisiones abiertas para empezar.

Las mediciones de F1 (render y modelo de economía) están en su [guía](HALLAZGOS_Y_ACTIVIDADES.md#mapa-del-cielo); las demás ideas no tienen medidas. Nada aquí está probado en teléfono ni con personas.
