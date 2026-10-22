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

Aparecen solo lejos del centro, más allá de donde empieza el Vacío, para no cambiar lo ya explorado. Antes de añadirlas se verifica con mapas guardados.

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

Los 52 géneros quedan como variaciones dentro de cada familia. Antes, la música separa a los géneros gemelos: medido, 25 de 52 van entre 115 y 130 BPM y hay 26 parejas casi iguales.

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
| 12 | `claude/musica-firmas` | Sonido firma de los 52 y medida final |
| 13 | `claude/super-modelo` | Qué es un superbioma y qué combinaciones valen |
| 14 | `claude/super-mapa` | Reparto en el universo sin mover lo explorado |
| 15 | `claude/super-fusion` | Lo visual sigue a la música y la música al lugar |
| 16 | `claude/super-bordes` | Transición entre superbiomas en el compás |
| 17 | `claude/super-coleccion` | La Bitácora como mapa de superbiomas |
| 18 | `claude/super-viaje` | Un superbioma fijo por capítulo del Viaje |

Orden: los bloques visual (1–6) y musical (7–12) se alternan. Los superbiomas (13–18) empiezan cuando estén las fases 4 y 11.

## Estado

- **Fase 1 · Nombres** (alpha.106): nombres del universo para las 11 regiones, sus ecologías y ecorregiones; colores separados (la pareja más cercana, Anillos y Púlsares, a distancia 72 en RGB); consejos de cada región y el Abismo de silencio. Pendiente: los objetos que aún se ven y se nombran como antes (pilares, faros, flores, agua) cambian con sus dibujos en las fases 2–4.
- **Fase 2 · Capas** (alpha.107): `universe-layers.js` dibuja las tres capas de cada región sobre el suelo del Mundo, en celdas de 150, 120 y 110 px que se mueven al 35, 70 y 100 % de la cámara. Cerca del borde de una región las celdas de las dos se mezclan (150 px a cada lado). Polvo tiene su bruma, granos con estela de viento y motas que se apartan del cubo y vuelven en 1,5 s; el Vacío no dibuja nada. El aire de cada región es un ruido filtrado con ganancia máxima 0,012 (unos −38 dB), muy bajo la música. Polvo ya no dibuja hierba en el suelo. Coste: en el navegador de pruebas no se distingue del ruido de medida.
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
