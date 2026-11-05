# El universo

Guía vigente del universo procedural en alpha.221 (sin cambios de generación desde alpha.207; escenas musicales en alpha.243). Paisaje abstracto sobre negro, flora/fauna estilizadas y música electrónica. Los nombres internos permanecen para conservar mapas y partidas. [Estado](../HANDOFF.md) · [reglas del juego](MUNDO.md).

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
- **Encuentros vivos (Jay, alpha.227):** cada bioma tiene algo que perseguir en el mismo mundo, uno cada 60–90 s de viaje, delante del cubo y con la luz del color de su región: la polilla de luz en Polvo, el racimo saltarín en Cúmulo, el pez de onda en Marea, el tambor rodante en Restos, la semilla traviesa en Esporas, la cometa en el viento en Anillos, tu reflejo en Prisma, el púlsar fugaz en Púlsares, la llamarada viva en Tormenta solar, tu eco en el Pozo y la estrella fugaz en el Vacío (también el Abismo). Y algo de lo que huir (alpha.228): el remolino de polvo, el enjambre celoso, la ola gigante, el derrumbe al compás, la nube de polen, la tormenta de arena, los rayos del prisma, las ondas del púlsar, la lluvia de llamaradas, el pozo que arrastra y el agujero negro; la amenaza brilla en el color de la región y lo seguro es blanco. Y algo que hacer (alpha.229): sembrar cinco motas en orden, llevar una estrellita perdida a su racimo, romper burbujas al ritmo para subir, tocar por la espalda las marcas de un guardián de piedra, regar cinco brotes antes de que se marchiten, guiar una caravana entre las piedras, tocar los nodos del Prisma en el orden en que suenan, encender cuatro púlsares a la vez, llevar una antena caída a su base, reunir cinco luciérnagas y subirlas, y dibujar una constelación pasando por sus estrellas; lo que hay que tocar brilla en el color de la región y el paso siguiente lleva un aro blanco. El mismo temporizador elige perseguir, huir o hacer, un tercio cada uno. Los 33 están completos. Salen de `hashKey`; no mueven el mapa ni cambian la música. Reglas, economía y motor en [Encuentros vivos](HALLAZGOS_Y_ACTIVIDADES.md#encuentros-vivos).
- **Mapa del cielo (Jay, alpha.231):** estrellas sueltas y tenues en el Mundo libre, tras el Viaje, que se unen en 28 figuras con nombre pasando por ellas en orden: el zodiaco, el cielo del norte y del sur y ocho propias (con «La Mano», el guiño secreto). Más de noche (hora real) y en el Vacío, los Púlsares y la región Constelaciones; las cortas cerca del origen, el zodiaco desde 5 km, las raras desde 20 y la leyenda desde 50. Cada estrella es una nota de la escala del lugar y la figura completa toca su motivo muy por debajo de la música. Salen de `hashKey`; no mueven el mapa ni cambian la música. Reglas, premios y medidas en [Mapa del cielo](HALLAZGOS_Y_ACTIVIDADES.md#mapa-del-cielo).
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
- **Constelaciones:** estrellas que se unen en una figura al completar el tema; las figuras van a la Bitácora. Es el lugar favorito del Mapa del cielo (alpha.231): allí hay más figuras, pero la región no cambia.
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

## Escenas musicales

Entrega 1 (Jay, 3 de noviembre de 2026, alpha.243). Ajuste **«Escenas: más variedad»** en Sonido (`#scenesSetting`), apagado por defecto y guardado en `S.scenes` (`{version:1,on}`; campos desconocidos se conservan; una versión futura se lee apagada y no se reescribe). Apagado, no se crea ningún nodo ni se gasta azar: el render es el de `main` (`tests/scenes_mix.py`).

- **Escenarios.** Zonas de 2×2 regiones; `hashKey('scene:v1:'+mundo+':'+zona)` pone uno en una de cada diez zonas cerca del origen y una de cada seis más allá de 5 km, cerca del centro de una región cuyo género tiene escena (`scenes-model.js`). Mar y géneros sin escena, ninguno. No mueve el mapa ni lee el azar antiguo. Se oye desde 520 m y está entera a 160 m (subida suave).
- **Almacén** (como un almacén de techno de Berlín o Fráncfort), sobre techno, minimal, acid y EBM: bombo largo justo detrás del bombo de la música, rumble en la raíz dos octavas abajo, hats de semicorchea y ride con aire, una 303 resonante cuya envolvente sube durante la subida, golpes metálicos FM en notas del acorde, stab en el breakdown, riser y caída.
- **Patio latino** (como un patio de Ibiza al aire libre), sobre tech house, minimal, deep y afro: congas y tumba afinadas al acorde (tumbao), bongós en martillo, timbal con cáscara y redobles, cencerro en clave (son o rumba), shaker con swing, bajo rodante en contratiempo, chops vocales sintéticos de formantes (ninguna voz grabada ni humana) y un filtro de paso alto que se abre en la caída.
- **La mano de cada escenario** (`handFor`, por `hashKey`): patrón de hats, swing, kit, filtro, relleno cada 8 o 16 compases y arco de 32 o 64 compases: intro → subida → caída → breakdown → vuelta. Cada vuelta del arco saca patrones nuevos (303, metales, congas, bongós, bajo, chops): no se repite.
- **Armonía y reloj.** Cada nota es una nota del acorde que suena (`chordTones`, `root`, con la afinación del lugar `runtime.hz`). El reloj es el de la música: `audio.js` llama a `runtime.sceneStep` en cada semicorchea que programa, después de sus propias voces y después de la pausa del final de los once (bajo el final, nada). Es la única línea añadida al motor, autorizada por Jay; el verificador la exige exacta (capa `approvedS`).
- **Mezcla.** Bus propio: batería y sintes (estos por el paso bajo del Almacén), eco, paso alto (el del Patio), pegamento, recorte suave y techo, nivel de sección, sidechain en cada tiempo, acercamiento y recorte final, hacia la etapa de salida después del compresor de la música (`outputStage.makeup`): la dinámica de la música no la empuja la escena; limitador, protección de picos, volumen y compuerta del final siguen mandando. En Calma, la escena baja y se oscurece (5,5 kHz). La mesa de efectos del jugador no la toca.
- **Se nota.** Al entrar, una línea: «Escena · Almacén» o «Escena · Patio latino» (no con los textos del paisaje apagados). Al irse, se apaga en unos compases y su bus se suelta: queda exactamente la música de antes.
- **Se ve** (visual 3, alpha.255). Mientras suena, haces de luz desde su lado y, en el escenario, un suelo que late con los colores de su género; en el Patio, un anillo de luces en la clave. Nunca dorado; apagado el ajuste, nada. Detalle en [El mundo](MUNDO.md#visual-3-el-ambiente).
- **Dónde no.** Solo en el Mundo libre tras el Viaje, en la superficie; nunca en el Viaje, un nivel, una ronda, una actividad, el Refugio ni los finales.
- **Medidas** (render offline en Chromium a 44,1 kHz, 64 compases unidos en cuatro tramos de 16; la auditoría musical previa medía en estos géneros menos de 0,6 % de energía sobre 4 kHz y 2–5 dB de rango p95−p10 en ventanas de 0,4 s). Almacén sobre minimal techno: picos 0,931, 3,7 % sobre 4 kHz (base 0,01 %), rango 6,8 dB (base 4,8), distancia tímbrica 9,4 dB, nivel medio +3,7 dB. Patio latino sobre tech house: picos 0,933, 3,6 % (base 0,02 %), rango 6,5 dB (base 3,6), distancia 8,7 dB, +3,7 dB. Con el ajuste apagado, mismo nivel por medio segundo que `main` en minimal techno, tech house y deep (deriva < 0,0004 dB). `tests/scenes_mix.py` comprueba lo mismo en 30 s del arco (caída, breakdown y vuelta): 7,6 y 6,1 dB de rango, 3,4 y 2,7 % sobre 4 kHz, picos 0,918 y 0,920.
- **Límites.** Sin escuchar en teléfono ni con auriculares; CPU móvil sin medir (cada semicorchea crea pocos nodos y el bus se suelta al salir). En la caída la escena suma unos 5 dB: el limitador trabaja más y la música de base baja un poco en sus picos. Sin marca en el Mapa del universo ni en la Bitácora en esta entrega.

## Sonido pro

Lote 1 (Jay, 5 de noviembre de 2026, alpha.266). Plan aprobado: la composición se queda y cambia la producción. Un solo motor de sonido compartido (`sound-pro.js`) y catorce perfiles de familia (`sound-profiles.js`). Cada género pertenece a una familia y conserva su tempo, swing, patrones, armonía y región. Este lote convierte la primera familia, **tech house y minimal** (`techhouse`, `minimal`, `rominimal`, `microhouse`), en la dirección del render 08 que Jay eligió («bien marcado»). El lote 2 convierte house clásico y el lote 3, techno (abajo); las otras once familias suenan como siempre hasta su lote.

- **Familias.** House clásico · Tech house y minimal · Techno · Melodic y orgánico · Afro y latino · Disco y funk · UK y breaks · Club de bajos · DnB y dubstep · Hip-hop · Electro · Ambient · Jazz · Experimental. Los 52 géneros, cada uno en una sola familia. Son familias de sonido; las familias de composición de `music-families.js` no cambian.
- **Cómo entra.** `audio.js` sigue decidiendo cada golpe y cada nota. Antes de sonar, pregunta al motor (`runtime.proDrum` en cada golpe de la batería, `runtime.proVoice` en el bajo y la melodía). Para un género convertido suena el motor; para los demás responde que no y suena lo de siempre. Las líneas de `audio.js` son pocas y van en un commit aparte para que Jay las revise una a una.
- **Batería.** Golpes sintetizados una vez, en JS, a `AudioBuffer`: bombo con clic, cuerpo saturado y cola corta, afinado a la raíz o a su quinta cerca de 52 Hz; hats metálicos de seis osciladores; palma de cuatro golpes con caja debajo y sala; rim, shaker, madera y percusión afinada. Cada golpe conserva la dinámica de la composición (su velocidad, en proporción a la clásica) y gasta el mismo azar que el golpe clásico, así la composición no se mueve. Hats fantasma suaves en las semicorcheas impares, desde el bombo.
- **Bajo.** Partido en sub (seno, mono) y medio (dos sierras con envolvente de filtro, sobre 110 Hz). Los dos se esconden bajo el bombo (sidechain en cada bombo).
- **Sintes.** La melodía suena una nota de cada dos, como chop vocal sintético (formantes; ninguna voz grabada). Los acordes y acompañamientos, como stab corto de dos sierras abiertas en estéreo. Eco de corchea con puntillo en ping-pong y sala con respuesta generada.
- **Bus y salida.** Un bus por región («deck»), pegamento, saturación suave y nivel hacia la etapa de salida de `audio.js` (su compresor y su limitador siguen siendo el final). Bajo una familia convertida, el techo de confort sube a 16 kHz (aire en los hats) y el último recorte (`outputStage.headroom`) baja un 12 % para que el true peak quede en −1 dBTP o menos. Calma, tormenta, estación y «detenido» siguen igual.
- **Cambios de región, como un DJ.** Lee las señales que el viaje ya envía cada compás (`territoryJourneyCue`; `territory-journey.js` no cambia). La región que llega entra filtrada y sin graves (paso alto 170 Hz, paso bajo que se abre con la mezcla). Dos compases antes del relevo, un riser. El último medio compás antes del relevo, sin bombo (de cualquier familia). En el relevo, un impacto y los graves cambian de mano. Frases de 16 compases (platillo) y de 32 (barrido de paso alto en el último compás). Solo cuando una de las dos regiones es de una familia convertida.
- **«Sonido clásico».** Ajuste en Sonido › Avanzado (`#classicSound`), apagado por defecto: suena el motor nuevo. Se guarda en `S.soundPro` (`{version:1,classic}`; campos desconocidos se conservan; una versión futura no se reescribe y se lee como el sonido nuevo). Si el guardado falla, vuelve atrás. Encendido, el motor no suena, no crea nodos y el recorte de salida vuelve a su valor.
- **Medidas y límites.** Ver [CAMBIOS](../CAMBIOS.md) (alpha.266) y los renders del lote. CPU medida solo como nodos de Web Audio creados por segundo en el render; no se midió en teléfono. Nadie lo ha escuchado todavía en teléfono ni con auriculares.

Lote 2 (alpha.267): **house clásico** (`deep`, `chicago`, `soulful`, `garagehouse`, `acidhouse`, `progressive` y `tropical`, que pasa de «Melodic y orgánico» a esta familia).

- **Familia y toques.** Un perfil de familia y un toque por género encima (`GENRE_TOUCH` en `sound-profiles.js`): kit propio (bombo, tono de hats, palma), bajo, voces, acordes, sala, bombeo y nivel. Toda la melodía; cada instrumento de la composición tiene su voz: órgano de registros, teclas tipo Rhodes (FM), pad de tres sierras, mazo tipo marimba, supersierra. Sala larga (3,2 s) solo para quien la pide. Nivel de deck 0,8.
- **Por género.** Deep: bombo suave, pads. Chicago: 909 crudo y stabs brillantes. Soulful y garage: órgano y hats fantasma con shuffle. Acid house: línea de 303 en la voz del bajo (filtro resonante, acentos y slides por paso, sin azar; ciclo de 16 compases). Progressive: apertura de filtro en cada frase de 32 compases. Tropical: mazos, aire, bombo suave.
- **Acordes.** En house, una nota del instrumento de la melodía que suena a la vez que otra es acorde. El acorde de órgano de deep y progressive pregunta al motor con una línea de `audio.js` aparte, pendiente de Jay (`PRO2_LINES`); sin ella suena el órgano clásico.
- **Medidas y límites.** Ver [CAMBIOS](../CAMBIOS.md) (alpha.267). Nadie lo ha escuchado todavía.

Lote 3 (alpha.268): **techno** (`dub`, `acid`, `minimaltechno`, `detroit` y `melodictechno`, que pasa de «Melodic y orgánico» a esta familia).

- **Familia.** Peso bajo la pista. Bombo con *rumble*: la cola del bombo como la dejaría una reverb, con paso bajo, saturada y bombeada por el siguiente bombo (un buffer por kit y tempo). Bajo en sub y medio con un sidechain más hondo. Pads y stabs más anchos (`width`), sala larga, eco en ping-pong y un eco de cinta nuevo: oscuro, saturado, con paso alto y bajo en su bucle y un vaivén lento. Toda la melodía.
- **Por género.** Dub: stabs de acorde hacia el eco de cinta y una sala brumosa, sub profundo, bombo redondo. Acid: 303 más duro que el de acid house (más resonancia, saturación, acentos y slides) y bombo con más pegada. Minimal: seco y corto, bombo de clic, casi sin sala ni eco, poco rumble. Detroit: cuerdas cálidas (cuatro sierras), hats 909 brillantes, acordes tipo Rhodes. Melodic: arpegios anchos de supersierra y pads que se abren en cada frase de 32 compases.
- **Acorde de dub.** El stab de `dubChord` (dub y heart) pregunta al motor nota a nota con una línea de `audio.js` aparte, pendiente de Jay (`PRO3_LINES`); sin ella suena el stab clásico. Heart sigue clásico. El stab no cuenta como instrumento del diario.
- **Medidas y límites.** Ver [CAMBIOS](../CAMBIOS.md) (alpha.268). El volumen final lo fija el limitador de `audio.js`: subir el nivel del deck mueve poco el LUFS. Nadie lo ha escuchado todavía.

El modelo de rareza y el censo no garantizan una probabilidad individual de encuentro en una hora. Depende de recorrido, mundo, región y condiciones. Las muestras forzadas de laboratorio no acreditan encuentros naturales.

## Estado y validación

El candidato E conserva generación, mapas, especies y música; mejora presentación, guía, entrada y guardados. [Entrega E](ENTREGA_E.md) · [auditoría](panel/candidato-e/informe.md). Las tablas de implementación y mediciones antiguas viven en Git; no son fases nuevas por ejecutar.

Las medidas automatizadas de familias/semillas no sustituyen escucha ni observación de exploración real. El panel deja la prominencia inicial de Jardín/Ruinas como riesgo visual acotado; comprobar ayuda y comprensión antes de modificar el arte.
