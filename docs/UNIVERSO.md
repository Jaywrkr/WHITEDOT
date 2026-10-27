# El universo

Guía vigente del universo procedural en alpha.221 (sin cambios de generación desde alpha.207). Paisaje abstracto sobre negro, flora/fauna estilizadas y música electrónica. Los nombres internos permanecen para conservar mapas y partidas. [Estado](../HANDOFF.md) · [reglas del juego](MUNDO.md).

## Reglas

- **Cámara:** el Mundo se ve siempre desde arriba, infinito en todas las direcciones y sin horizonte. Solo el Refugio se ve de lado.
- **Una firma por región:** forma, movimiento y color propios. Dos regiones no comparten dos de esas tres cosas.
- **Tres capas:**
  - *lejos*: pequeña y lenta, da sensación de abismo;
  - *medio*: la textura de la región;
  - *cerca*: los detalles con los que se juega.
- **Bordes:** al cruzar de región, las capas se mezclan durante unos 300 px.
- **Sonido:** los sonidos propios de cada región suenan muy por debajo de la música, casi al nivel del ambiente. La música de cada lugar no cambia por esta guía.
- **Lluvia (Jay, alpha.226):** una textura ligera bajo la música. Su cama de ruido (`RAIN_BED` en `world-weather.js`) baja 12 dB: 0,003 en calma y 0,008 en tormenta (antes 0,012 y 0,032). Render aislado (`tests/rain_mix.py`): −64 dBFS en calma y −56 dBFS en tormenta (antes −52 y −44), frente a −13,6 dBFS de una mezcla de música. Las gotas que tocan el cubo siguen sonando como notas; no cambiaron.
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

Un superbioma es una región más una **familia musical**. El catálogo organiza52 géneros en10 familias:

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

**Combinaciones que valen:** las diez regiones de los continentes con cualquiera de las diez familias, y el Abismo (Vacío, Aurora, Cometas, Constelaciones y Nebulosa oscura) solo con Ambient, porque el mar entre continentes siempre tiene música tranquila. Son 105 superbiomas. Cada lugar ya tiene región y género, así que su superbioma sale de datos que ya existen y el mapa no se mueve. Se nombran con la región y la familia: «Marea · Dub», «Púlsares · Techno». Esta cifra cuenta tipos de superbioma; no es el número total de mundos ni una medición de variedad percibida.

## Generación y direcciones

Una dirección conserva semilla, perfil de generación/catálogo/layout, coordenadas y capa. `world-identity.js` admite generaciones1 y2 y tamaños classic, wide, vasto, grand e immense. No cambiar versiones ni consumir el RNG antiguo para añadir contenido.

Favoritos conserva esa identidad y puede volver a una dirección compatible. El lugar es reproducible; el tiempo, ambiente y composición continúan evolucionando. No equivale a guardar una grabación exacta. Las coordenadas están acotadas por validación numérica; el producto no promete infinito matemático ni un conteo de mundos únicos comprobados.

## Música y vida

`audio.js` sintetiza con Web Audio nativo; géneros, familias, técnicas, instrumentos y territorio definen la base electrónica. Cada lugar puede tener distinto tempo/densidad. Las transiciones mantienen frases y armonía; ninguna tarea de UI autoriza sustituir esta música aprobada.

`universe-layers.js` dibuja capas, `superbiome-fusion.js` relaciona familias y movimiento, `world-light-model.js` y `world-weather.js` gestionan luz/clima. Criaturas, flora y fenómenos tienen sistemas propios; [mapa técnico](ARQUITECTURA.md) y [catálogo de hallazgos](HALLAZGOS_Y_ACTIVIDADES.md).

El modelo de rareza y el censo no garantizan una probabilidad individual de encuentro en una hora. Depende de recorrido, mundo, región y condiciones. Las muestras forzadas de laboratorio no acreditan encuentros naturales.

## Estado y validación

El candidato E conserva generación, mapas, especies y música; mejora presentación, guía, entrada y guardados. [Entrega E](ENTREGA_E.md) · [auditoría](panel/candidato-e/informe.md). Las tablas de implementación y mediciones antiguas viven en Git; no son fases nuevas por ejecutar.

Las medidas automatizadas de familias/semillas no sustituyen escucha ni observación de exploración real. El panel deja la prominencia inicial de Jardín/Ruinas como riesgo visual acotado; comprobar ayuda y comprensión antes de modificar el arte.
