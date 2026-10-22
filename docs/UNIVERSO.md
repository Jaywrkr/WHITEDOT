# El universo

Guía de diseño aprobada por Jay el 22 de octubre de 2026. El Mundo de Kubono es un universo infinito: no tiene árboles, montañas ni lagos. Esta guía fija sus regiones, la regla de cámara, el sonido y el plan de superbiomas. Cada fase la construye en su rama.

## Reglas

- **Cámara:** el Mundo se ve siempre desde arriba, infinito en todas las direcciones y sin horizonte. Solo el Refugio se ve de lado.
- **Una firma por región:** forma, movimiento y color propios. Dos regiones no comparten dos de esas tres cosas.
- **Tres capas:**
  - *lejos*: pequeña y lenta, da sensación de abismo;
  - *medio*: la textura de la región;
  - *cerca*: los detalles con los que se juega.
- **Bordes:** al cruzar de región, las capas se mezclan durante unos 300 px.
- **Sonido:** los sonidos propios de cada región suenan muy por debajo de la música, casi al nivel del ambiente. La música de cada lugar no cambia por esta guía.
- **Datos:** las regiones conservan sus identificadores internos (`llanura`, `bosque`…), así que mapas, música y guardados no se mueven. Ningún detalle consume el azar antiguo; todo sale de hashes.

## Las regiones

| Id | Nombre | Color | Forma | Movimiento | Momento raro |
|---|---|---|---|---|---|
| `llanura` | Polvo | `#eb9a3c` ámbar | granos de 1 px | deriva en una dirección; el cubo abre un surco | un remolino |
| `bosque` | Cúmulo | `#6fe08a` verde | racimos de 5–12 estrellas | se encienden en secuencia al acercarte | un racimo te sigue |
| `lago` | Marea | `#5cc8ff` cian | anillos concéntricos | uno por compás; el cubo deja su onda | todas las fuentes laten juntas |
| `ruinas` | Restos | `#a88c6a` bronce | arcos de órbitas rotas | quietos; no laten | los arcos se alinean y cierran la órbita |
| `jardin` | Esporas | `#ff8fc8` rosa | semillas de 2 px | se abren en estrella si te quedas quieto | floración en cadena |
| `dunas` | Anillos | `#f3e6b0` crema | bandas curvas paralelas | se deslizan; piedras cambian de banda en el beat | pasa la sombra de un planeta |
| `cristales` | Prisma | `#9ef0e6` aguamarina | malla de nodos y líneas | tu pulso la recorre hacia afuera | la luz se descompone en arcoíris |
| `faros` | Púlsares | `#fff36a` amarillo | pocos puntos muy brillantes | haz giratorio, destello en el beat | dos haces se cruzan |
| `tormenta` | Tormenta solar | `#b48cff` violeta, rojo puntual | arcos de plasma | llamaradas en el beat que dejan un anillo | una eyección cruza la pantalla |
| `cueva` | Pozo | `#ff4f3a` rojo anaranjado | disco negro con anillo de luz | todo se curva hacia el centro | la imagen se dobla un compás |
| `vacio` | Vacío | `#ffffff` blanco | nada | nada | nada: esa es su firma |

El mar entre continentes es el **Abismo de silencio** (región `vacio`). Las ecologías locales y las ecorregiones tienen nombres del universo (`ecology-model.js`, `ecoregions.js`).

## Regiones nuevas

Viven en el Abismo de silencio, el espacio entre continentes (`universe-regions.js`): unas 4 de cada 10 regiones del Abismo muestran una, elegida por un hash de la región; el resto sigue siendo Vacío. No son biomas del generador, así que el mapa, los continentes, la música y lo ya explorado no cambian. En el Viaje no aparecen.

- **Aurora:** cortinas de luz que ondulan y se abren al pasar.
- **Cometas:** estelas en diagonal; a tiempo, dejan una nota.
- **Constelaciones:** estrellas que se unen en una figura al completar el tema; las figuras van a la Bitácora.
- **Nebulosa oscura:** nubes negras de borde rojo; solo se ve lo que ilumina el cubo.

## Superbiomas

Un superbioma es una región más una **familia musical**. Las 10 familias que se distinguen al oído:

1. Ambient
2. Downtempo y hip-hop
3. Dub
4. House
5. Techno y acid
6. Breaks y garage
7. Drum & bass
8. Electro y EBM
9. Tribal, afro y andino
10. Disco y jazz

Los 52 géneros quedan como variaciones dentro de cada familia (`superbiomes.js`):

| Familia | Géneros |
|---|---|
| Ambient | Ambient, Dub profundo, Berlin School |
| Downtempo | Downtempo, Boom bap, Lo-fi hip hop, G-funk, Trap |
| Dub | Dub techno, Dubstep |
| House | Deep, Minimal, Rominimal, Progressive, Microhouse, Tech house, Melodic, Chicago, Acid house, Garage house, Ghetto, Tropical y Organic house |
| Techno | Acid techno, Minimal techno, Melodic techno, Detroit techno, Algorave, IDM |
| Breaks | Breaks, UK garage, Baltimore club, Jersey club, Broken beat |
| Drum & bass | Drum & bass, Liquid, Footwork |
| Electro | Electro, Electro robótico, Darkwave / EBM, Electro de Detroit, Miami bass |
| Tribal | Afro house, Tribal, Electrónica andina, Amapiano |
| Disco | Nu-disco, Cosmic disco, Boogie, Electro-funk, Jazztronica, Soulful house |

**Combinaciones que valen:** las diez regiones de los continentes con cualquiera de las diez familias, y el Abismo (Vacío, Aurora, Cometas, Constelaciones y Nebulosa oscura) solo con Ambient, porque el mar entre continentes siempre tiene música tranquila. Son 105 superbiomas. Cada lugar ya tiene región y género, así que su superbioma sale de datos que ya existen y el mapa no se mueve. Se nombran con la región y la familia: «Marea · Dub», «Púlsares · Techno». Antes, la música separa a los géneros gemelos: medido, 25 de 52 van entre 115 y 130 BPM y hay 26 parejas casi iguales.

## Fases

| # | Rama | Qué |
|---|---|---|
| 1 | `claude/universo-nombres` | Nombres, colores separados y textos (alpha.106) |
| 2 | `claude/universo-capas` | Sistema de tres capas, bordes y sonido bajo; Vacío y Polvo |
| 3 | `claude/universo-viaje` | Marea, Cúmulo, Tormenta solar y los momentos del Viaje |
| 4 | `claude/universo-resto` | Restos, Esporas, Anillos, Prisma, Púlsares y Pozo |
| 5 | `claude/universo-nuevas` | Aurora, Cometas, Constelaciones y Nebulosa oscura |
| 6 | `claude/universo-raros` | El momento raro de cada región |
| 7 | `claude/musica-medida` | Medidor de diferencias entre géneros y escuchas de antes |
| 8 | `claude/musica-house` | Separar las cuatro house |
| 9 | `claude/musica-robotica` | Electro, Detroit, EBM y Robotic |
| 10 | `claude/musica-groove` | Melodic, Nu-disco, Soulful, Broken beat, Cosmic, Jazztronica y Boogie |
| 11 | `claude/musica-resto` | Los demás gemelos y el abanico de tempos |
| 12 | — | Sustituida: las 10 familias y la fusión dan la identidad; la medida final quedó en la fase 11 |
| 13 | `claude/super-modelo` | Qué es un superbioma y qué combinaciones valen |
| 14 | `claude/super-mapa` | Reparto en el universo sin mover lo explorado |
| 15 | `claude/super-fusion` | Lo visual sigue a la música y la música al lugar |
| 16 | `claude/super-bordes` | Transición entre superbiomas en el compás |
| 17 | `claude/super-coleccion` | La Bitácora como mapa de superbiomas |
| 18 | `claude/super-viaje` | Un superbioma fijo por capítulo del Viaje |

Orden: los bloques visual (1–6) y musical (7–12) se alternan. Los superbiomas (13–18) empiezan cuando estén las fases 4 y 11.

## Estado

- **Pendientes revisados** (alpha.127):
  - **Sin restos terrestres:** las criaturas, plantas y construcciones del mundo tienen nombres del universo; se conservan sus ids para no tocar los guardados. Cometa resonante, Asteroide lento y Sombra del vacío sustituyen al ciervo, la tortuga y la ballena, y el satélite, el prisma y la chispa tienen dibujo propio.
  - **Hitos vistos desde arriba:** Estrella guía, Nebulosa madre, Cúmulo de formas, Monolito y Baliza; ninguno sube de una línea de suelo. El escáner nombra fuentes de ondas, órbitas rotas, chispas, estrellas de luz, destellos y púlsares.
  - **Onda del pulso:** de los objetos que responden a una misma onda, solo uno grave suena; así muchos graves juntos ya no retumban.
  - **Fase 12:** sustituida. Las 10 familias, la fusión y los bordes ya dan identidad a cada lugar, y la medida de la fase 11 (0 parejas de géneros bajo la línea) sigue valiendo porque ningún género cambió desde entonces.
  - **Viaje:** los capítulos buscan su superbioma hasta unos 60 000 px, porque el portal lleva el cubo. En seis mundos Marea encuentra su familia en cinco y Tormenta solar en todos.
- **Fase 18 · Viaje** (alpha.126): cada capítulo del Viaje busca su superbioma sin cambiar el mapa. Prueba las familias en orden y, si ninguna está cerca, va al lugar más cercano de su región (`CHAPTER_FAMILIES`, `findChapter`):
  - **Polvo:** House, luego Downtempo.
  - **Marea:** Downtempo, Dub o Ambient.
  - **Cúmulo:** Disco, luego House.
  - **Tormenta solar:** Techno, Electro, Breaks o Dub.
  - **Vacío:** siempre Ambient.
  - **Medido en seis mundos:** Polvo, Cúmulo y Vacío casi siempre llegan a su superbioma. Marea y Tormenta solar solo cuando el mapa lo tiene cerca, porque las Mareas tranquilas son raras.
- **Fase 17 · Colección** (alpha.125): en la Bitácora, la pestaña de lugares tiene el mapa de superbiomas, una fila por región y una columna por familia, con el Abismo solo en Ambient. Lo oído sale en dorado con su día; lo que falta, en contorno y marcado si es raro (◇), muy raro (◆) o si no aparece (×). Debajo, las constelaciones unidas, cada una con su figura (hasta 12).
- **Fase 16 · Bordes** (alpha.124): el movimiento sigue a la familia que suena de verdad (`MU.dnaA`), no a la que hay bajo el cubo, así que cambia cuando cambia la música. El cambio espera al siguiente primer tiempo del compás y se mezcla durante un compás entero (`createBorder`, `blend`). Si la música vuelve antes del primer tiempo, no hay cambio.
- **Fase 15 · Fusión** (alpha.123): `superbiome-fusion.js` da a cada familia su forma de mover las capas de la región en la que suena; la forma y el color de la región no cambian.
  - **Ambient:** casi quieto, a 0,45 de velocidad, y el pulso apenas se nota.
  - **Downtempo:** lento, a 0,75.
  - **Dub:** lento, a 0,6, y la capa media deja un eco más tenue 0,4 s detrás.
  - **House:** late con el bombo.
  - **Techno:** rápido, a 1,35, con golpe seco y movimiento en líneas rectas.
  - **Breaks:** a 1,2, con saltos en los golpes fuertes.
  - **Drum & bass:** muy rápido, a 1,7, con saltos más grandes.
  - **Electro:** a 1,2, se enciende o se apaga en el pulso, en líneas rectas.
  - **Tribal:** la capa media se balancea con el compás.
  - **Disco:** las capas lejana y media giran un poco alrededor del centro.
  - Con movimiento reducido no hay giro, eco ni saltos. El reloj de la región nunca salta al cambiar de familia.
- **Fase 14 · Reparto** (alpha.122): Jay eligió no tocar el mapa. `scripts/superbiome-census.mjs` cuenta las regiones de cada superbioma en seis mundos (1846 de continente y 800 del Abismo) y escribe `src/superbiome-rarity.js`: 70 comunes (al menos 0,5 % de las regiones), 31 raros, 3 muy raros (Drum & bass en Polvo, Cúmulo y Anillos) y 1 ausente (Restos · Drum & bass). El aviso de región marca los raros: «Marea · Dub (raro)». La prueba repite el censo y exige la misma tabla.
- **Fase 13 · Modelo de superbiomas** (alpha.121): diez familias para los 52 géneros y 105 combinaciones válidas. En el mundo principal (61 × 61 regiones) aparecen 62. Al entrar a una región, su aviso empieza por el superbioma (`Polvo · House — Deep house · 120 BPM`), y el primer día que se oye cada uno queda en `S.universe.super`. El reparto (fase 14) decidirá cómo llegan los que faltan, como Drum & bass en Polvo o Restos.
- **Fase 1 · Nombres** (alpha.106): nombres del universo para las 11 regiones, sus ecologías y ecorregiones; colores separados (la pareja más cercana, Anillos y Púlsares, a distancia 72 en RGB); consejos de cada región y el Abismo de silencio. Pendiente: los objetos que aún se ven y se nombran como antes (pilares, faros, flores, agua) cambian con sus dibujos en las fases 2–4.
- **Fase 2 · Capas** (alpha.107): `universe-layers.js` dibuja las tres capas de cada región sobre el suelo del Mundo, en celdas de 150, 120 y 110 px que se mueven al 35, 70 y 100 % de la cámara. Cerca del borde de una región las celdas de las dos se mezclan (150 px a cada lado). Polvo tiene su bruma, granos con estela de viento y motas que se apartan del cubo y vuelven en 1,5 s; el Vacío no dibuja nada. El aire de cada región es un ruido filtrado con ganancia máxima 0,012 (unos −38 dB), muy bajo la música. Polvo ya no dibuja hierba en el suelo. Coste: en el navegador de pruebas no se distingue del ruido de medida.
- **Sin restos terrestres** (alpha.116): hierba, árboles de luz, pilares, plantas, flora de la vida del mundo, plantas que se riegan, bandadas y lluvia se dibujan desde arriba; los textos de vida y logros usan palabras del universo. Completado en alpha.127.
- **Fase 6 · Momentos raros** (alpha.115): `universe-rare.js` da un momento raro a cada región salvo el Vacío, con probabilidad 1/48 por compás según el hash del lugar y el compás; dura 4,5 s y se cuenta en `S.universe.rare`.
- **Fase 5 · Regiones nuevas** (alpha.114): Aurora, Cometas, Constelaciones (se unen al completar el tema, guardado en `S.universe.constellations`) y Nebulosa oscura, en el Abismo. Las figuras de constelación ya están en la Bitácora (fase 17).
- **Fase 4 · El resto de regiones** (alpha.113): Restos, Esporas, Anillos, Prisma, Púlsares y Pozo con sus tres capas y su aire. Las diez regiones con detalle ya están dibujadas. El pulso del jugador llega a las capas (`universePulse`) para la onda del Prisma. Pendiente: los objetos que aún vienen de antes (pilares de Restos, plantas, flores, lluvia inclinada) y las regiones nuevas.
- **Fase 11 · Los últimos gemelos** (alpha.112): Boom bap y G-funk, Drum & bass y Liquid quedan separados por ritmo y tempo. **Medida final de los 52 géneros: 0 parejas bajo la línea (antes 16)**; la más cercana, Deep house ~ Tribal, a 0,13.
- **Fase 10 · Groove** (alpha.111): Boogie baja a 98–104 con bombo sincopado; Cosmic disco queda en 110–116, sin palmada y con timbales. De 0,084 a 0,478 entre ellos.
- **Fase 9 · Las robóticas** (alpha.110): Electro robótico baja a 108–114 y se vuelve exacto; Electro es la 808 con semicorcheas; Breaks sube a 132–138 con cajas fantasma. Ninguno queda bajo la línea.
- **Fase 3 · Regiones del Viaje** (alpha.109):
  - **Marea:** anillos enormes y lentos a lo lejos, fuentes que sueltan un anillo por compás y una estela de ondas detrás del cubo.
  - **Cúmulo:** galaxias pequeñas a lo lejos, racimos de 5–12 estrellas que se encienden en secuencia cuando el cubo se acerca y estrellas que parpadean en el beat.
  - **Tormenta solar:** superficie que hierve, arcos de plasma que tiemblan y llamaradas en el beat que dejan un anillo, algunas en rojo. Las descargas existentes se ven desde arriba (se ramifican desde donde caen, no caen del cielo).
  - Cada una tiene su aire propio, muy bajo: un zumbido grave (Marea), un brillo agudo (Cúmulo) y un chisporroteo (Tormenta solar).
  - **Momentos del Viaje vistos desde arriba:** el faro de Polvo es un púlsar (núcleo, halo y un haz que barre el suelo); los lotos de la Marea son fuentes de ondas; la criatura del Cúmulo es un racimo de tres estrellas; el faro de regreso es una luz dorada en el borde con una flecha, sin columna vertical.
  - El Cúmulo ya no dibuja hierba en el suelo.
  - Pendiente: la flora y los objetos que aún vienen de antes (plantas, flores, lluvia inclinada del clima) cambian en las fases 4 y 6.
- **Fase 8 · Las house** (alpha.108): Deep, Progressive y Melodic house dejan de compartir batería; Chicago, Acid, Soulful y Garage house separan tempo y firma. Medida completa: de 16 parejas bajo la línea quedan 5 y ninguna es house; quedan Electro, Electro robótico y Breaks, Drum & bass y Liquid, Cosmic disco y Boogie, Boom bap y G-funk.
- **Fase 7 · Medida de la música:** `scripts/genre-distance.py` renderiza los 52 géneros con el programador real y compara tempo, ritmo (16 pasos por compás), timbre (8 bandas) y densidad. La línea es la mayor distancia de un mismo género consigo mismo en otras variaciones (10 géneros), más un cuarto.

## Medida de los géneros (Fase 7)

Revisión `claude/musica-medida`, renders de 12 s a 44,1 kHz, pico máximo 0,89. Línea: 0,125. **16 parejas quedan por debajo**, entre 16 géneros:

| Distancia | Pareja |
|---|---|
| 0,061 | Electro ~ Electro robótico |
| 0,068 | Melodic house ~ Soulful y gospel house |
| 0,069 | Melodic house ~ Garage house (Nueva York) |
| 0,077 | Breaks ~ Electro |
| 0,082 | Drum & bass ~ Liquid drum & bass |
| 0,084 | Cosmic disco ~ Boogie |
| 0,093 | Progressive house ~ Melodic house |
| 0,097 | Progressive house ~ Soulful y gospel house |
| 0,102 | Soulful y gospel house ~ Garage house (Nueva York) |
| 0,105 | Progressive house ~ Chicago house |
| 0,106 | Progressive house ~ Garage house (Nueva York) |
| 0,112 | Deep house ~ Melodic house |
| 0,116 | Melodic house ~ Acid house |
| 0,116 | Acid house ~ Soulful y gospel house |
| 0,118 | Deep house ~ Progressive house |
| 0,124 | Boom bap ~ G-funk |

- **El grupo house es el problema mayor:** Melodic, Soulful, Garage house, Progressive, Chicago, Deep y Acid house se confunden entre sí (11 de las 16 parejas).
- **Otros gemelos:** Electro, Electro robótico y Breaks; Drum & bass y Liquid; Cosmic disco y Boogie; Boom bap y G-funk.
- **Distintos ya:** los otros 36 géneros superan la línea con todos.
- **Límite:** es una medida para guiar la escucha, no un juicio artístico. Las parejas se escuchan antes de cambiar nada.
