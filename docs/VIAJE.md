# El Viaje

Guía de diseño de la Fase 0 del panel creativo (22 de octubre de 2026). Jay aprobó seguir lo que el panel acordó: el juego principal es **el Viaje**, unos 40 minutos en 7 capítulos con un final, y después se abre **el Mundo libre** con todo lo que existe hoy. Esta guía fija la forma; cada fase siguiente la construye en su rama.

## Decisiones aprobadas por Jay

1. **El verbo es tocar a tiempo.**
   - El pulso nunca suena mal.
   - A tiempo, además rompe el cristal y su nota cuenta para la frase del capítulo.
   - Fuera de tiempo suena igual, pero no cuenta.
2. **El Viaje es el modo principal.** El Mundo libre se abre después del final; las partidas existentes conservan todo y pueden entrar al Mundo libre si ya habían llegado a él.
3. **Cuenta opcional.**
   - Se juega desde el primer toque con guardado local.
   - La cuenta se ofrece después, como «Guardar en la nube», y al vincularla se migra el progreso local sin perder nada.
   - Sustituye a la decisión anterior de «cuenta obligatoria».
4. **Durante el Viaje se oculta la economía:**
   - no se ven cifras, tienda, saltos de pago ni anuncios de logros;
   - todo sigue existiendo y lo comprado se conserva;
   - vuelve en el Mundo libre.
5. **7 capítulos** con cinco biomas (Llanura, Lago, Bosque, Tormenta y Vacío), más el Camino y el Refugio. Los otros seis biomas (Ruinas, Jardín, Dunas, Cristales, Faros y Cueva) siguen en el Mundo libre.
6. **Un músico coautor** para el tema y los clímax: recomendado y pendiente de encontrar. Mientras tanto, el tema de abajo es la versión de trabajo.

## Los capítulos

Desde alpha.106 los lugares tienen nombres del universo ([El universo](UNIVERSO.md)): Llanura es **Polvo**, Lago es **Marea**, Bosque es **Cúmulo** y Tormenta es **Tormenta solar**. Las tablas de abajo conservan los nombres con que se diseñaron.

| Cap. | Lugar | Duración | Sentimiento | Color que se recupera | Tema | Qué pasa |
|---|---|---|---|---|---|---|
| 0 | Camino | 3 min | Soledad, escucha | Papel: blanco y gris | Fragmento de 2 notas | Negro, un punto. Cada cristal suma un instrumento; al décimo la canción está completa y el horizonte se abre |
| 1 | Llanura | 5 min | Curiosidad | Ámbar | Primera frase, menor | Primer faro. Seis cristales a tiempo completan la frase |
| 2 | Lago | 5 min | Calma | Cian | Lidio, abierto | Bajo el agua todo suena distinto. Los lotos responden al tema |
| 3 | Bosque | 6 min | Compañía | Verde | El mundo contesta al tema | Primera criatura que te sigue y te imita |
| 4 | Tormenta | 6 min | Tensión | Violeta y rojo puntual | Tema roto, ritmo fuerte | El clímax del juego: los rayos caen en el beat |
| 5 | Vacío | 5 min | Pérdida | Todo se apaga | El cubo solo | La criatura no puede entrar. Tras ocho notas, las criaturas que te siguieron vuelven y repiten tus notas |
| 6 | Refugio | 3 min | Regreso | Dorado y todo junto | Tema completo con tu viaje | Final: el Refugio toca tu viaje. Silencio. Créditos. Se abre el Mundo libre |

Total diseñado: unos 40 minutos. **Jay decidió el 22 de octubre que el Viaje dure 15–20 minutos** (decisión 2B) y se mida con personas antes de alargarlo; las duraciones de la tabla son las del diseño original. **Los primeros 15 minutos (capítulos 0–2) forman un arco cerrado** y son el build de festival, con una pantalla final que muestra tu frase.

## Curva emocional

Intensidad musical de 0 a 4, minuto a minuto. Es la curva deseada; en la Fase 7 se mide con personas y se itera hasta que coincidan.

| Minuto | 0 | 2 | 3 | 5 | 8 | 10 | 13 | 15 | 18 | 21 | 24 | 27 | 30 | 33 | 35 | 37 | 40 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Intensidad | 0 | 1 | 2 | 1 | 2 | 3 | 2 | 3 | 2 | 3 | 3 | 4 | 4 | 0 | 1 | 3 | 4 → 0 |
| Capítulo | Camino | | Llanura | | | Lago | | | Bosque | | | Tormenta | | Vacío | | Refugio | |

Reglas:
- **Cada capítulo pasa por tres estados:**
  - Llegada (intensidad 1–2): pedal y tema en fragmentos;
  - Pertenencia (2–3): groove completo y el mundo responde al tema;
  - Plenitud (3–4): tema completo en tutti, una sola vez por capítulo.
- **Silencio:** si el jugador no toca en 8 compases, la intensidad baja a pedal y espera.
- **Clímax por densidad:** la Plenitud llega con muchas voces cerca tocando, no con una fanfarria de recompensa.

## El tema del cubo

Seis notas en **grados de la escala** (0 = tónica) y duraciones en corcheas, dos compases de 4/4:

| Nota | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Grado | 0 | 1 | 4 | 3 | 2 | 0 |
| Corcheas | 3 | 1 | 4 | 2 | 2 | 4 |

- **El tema en tus manos:** el pulso a tiempo toca al instante la siguiente nota exacta del tema con un instrumento melódico del lugar (si el pulso del lugar es de percusión o bajo, el género presta uno de sus instrumentos principales) y responde con su tercera y su quinta en la rejilla. El acierto se juzga al tocar, descontando el retraso de los auriculares, con un margen de ±80 ms igual en todo el juego. En el Camino el acierto también suena distinto del fallo. No hay un sintetizador aparte. En la Plenitud, el final y el acompañante el tema suena con un tono suave (triángulo y seno, sin diente de sierra): la sierra grave con vibrato sonaba como una bocina sobre la música.
- **Se reharmoniza con la escala de cada capítulo:**
  - Camino y Llanura: menor, en La;
  - Lago: lidio, en Do;
  - Bosque: dórico, en Sol;
  - Tormenta: menor, en Mi, a 112;
  - Vacío: lidio, solo y sin acompañamiento, a 66;
  - Refugio: mayor, en La, con el tema dos veces, la segunda a la quinta.
- **Cada pulso a tiempo toca la siguiente nota del tema**; seis aciertos completan la frase.
- **Interfaz:** sus sonidos usan las dos primeras notas del tema, muy suaves.
- **Datos:** el tema se guarda como dato fijo. No consume el RNG antiguo ni cambia guardados.

Render de trabajo (fuera de Git): `tema-del-cubo-viaje.mp3`, el tema por los siete capítulos (69 s, pico 0,62, sin saturación).

## Progresión de color

Al empezar el Viaje todo es blanco y gris. Cada capítulo cumplido, en su Plenitud, devuelve un tono para siempre:

| Etapa | Capítulos | Tonos | Lectura |
|---|---|---|---|
| Papel | Camino | Blanco y gris | Soledad |
| Calor | Llanura | Ámbar `#f0c27a` | Primer juego |
| Agua | Lago, Bosque | Cian `#8ad1ff`, verde `#7fbf6a` | Calma, compañía |
| Tensión | Tormenta | Violeta `#b8b8ff`, rojo puntual `#ff8a8a` | Ruido |
| Luz | Vacío, Refugio | Dorado `#f0d27a` y todos | Cierre |

- **Se guarda** como `coloresRecuperados`, derivado de los biomas ya visitados: quien ya jugó los recupera al cargar, con una animación de reencuentro.
- **El dorado** sigue significando «lo ganado».
- **Daltonismo:** paleta alternativa en Ajustes.

## Los primeros 5 minutos (sin texto)

| Tiempo | Pantalla | Sonido |
|---|---|---|
| 0:00 | Negro y un punto de luz. Sin cuenta, sin ventanas | Silencio |
| 0:03 | Al tocar aparece el cubo | Primera nota del tema |
| 0:20 | Un cristal pulsa a tempo en el borde | Pedal suave |
| 0:45 | El jugador se acerca y lanza el pulso; el cristal se rompe a tiempo, con vibración y un acorde | La palabra «Pulso» aparece y se desvanece: es la única palabra |
| 1:30 | Cada cristal suma un instrumento; los fragmentos dibujan en el cielo la primera línea de una partitura | Capas que entran |
| 3:00 | Al décimo cristal el horizonte se abre: la Llanura entera, en ámbar | La canción completa |
| 4:00 | Un faro lejano con su propia voz | Su nota crece al acercarse |
| 5:00 | Título: *Kubono*. Solo entonces aparece el botón de menú | |

## Lo que se oculta durante el Viaje

Todo se oculta, no se borra; los datos y lo comprado se conservan y vuelven en el Mundo libre.

- **HUD:** Día, Era, Caminado, chispas, «Saltar · 20 ✦», «Estilos» y «Rompe cristales n/10».
- **Menú:** queda en Continuar, Refugio, Sonido y Ajustes. Bitácora y Tienda viven en el Refugio. Viajar a otra semilla, Compartir, Grabar set, laboratorio y duetos pasan al Mundo libre o a Ajustes.
- **Sistemas:** tienda, saltos de pago, anuncios de logros (se siguen ganando en silencio), travesuras, actividades por semilla, tarjetas como lista, Subsuelo y Cielo, autopiloto y voces del pulso a la venta.
- **Texto:** el Viaje no tiene texto salvo el título y «Pulso». Menús, ajustes y fichas se traducen al inglés.

## Estado

- **Fase 1 · El pulso** (alpha.97): pulso a tiempo con el tema del cubo, vibración con ajuste, la Línea del compás y 240 ms entre pulsos. Pendiente para fases siguientes: congelar la imagen 60 ms al romper, los fragmentos en la escala y que los cristales sumen notas a la frase del capítulo (Fase 4).
- **Fase 2 · Entrar y callar** (alpha.98): sin cuenta al empezar (la cuenta se ofrece después y adopta el progreso local), sin ventana de bienvenida en el Viaje, HUD sin cifras, menú corto y botón Mundo libre / Viaje. Pendiente: el Camino mudo con su guion de 5 minutos (que cada cristal sume un instrumento y el horizonte se abra) va con la Fase 3, junto a la lámina del Mundo.
- **Fase 3 · El Mundo como lámina** (alpha.99; en alpha.105 se quitaron las siluetas laterales, porque el Mundo se ve siempre desde arriba): luz del bioma que late, siluetas con parallax, color que se gana completando el tema, Camino cuya canción crece con cada cristal y la palabra «Pulso». Pendiente: el faro con voz, el sonido que crece al acercarse y las tres clases visuales con contorno (quedan para la Fase 4, con los capítulos).
- **Fase 4 · El disco** (alpha.100): siete capítulos guardados, con Llegada, Pertenencia y Plenitud como topes de la música, pedal tras 8 compases sin tocar, notas recordadas para el final, portal al capítulo siguiente y faro hacia el bioma del capítulo. Pendiente: los momentos firma de cada capítulo (Tormenta, Vacío) y el final, en la Fase 5.
- **Fase 5 · Momentos firma y final** (alpha.101): rayos en el beat de tus notas en la Tormenta, el cubo solo en el Vacío con criaturas que repiten tus notas, y el final: el Refugio toca tu viaje, cielo dorado, silencio, créditos y Mundo libre. Pendiente: la criatura del Bosque que te sigue, los lotos del Lago y la Llanura con faro propio (momentos de los capítulos 1–3); los créditos son provisionales hasta que Jay los revise.
- **Fase 6 · Festival y accesibilidad** (alpha.102): `?festival=1` abre los primeros 15 minutos sin cuenta y con guardado propio; termina en el Refugio con tu frase y «Otra persona». Paleta para daltonismo en Ajustes. Coste: en el navegador de pruebas (sin GPU, 390×844 a 2×) el Viaje y el Mundo libre cuestan lo mismo por fotograma. Pendiente: medir en teléfonos reales y traducir menús al inglés.
- **Fase 7 · Medida** (alpha.103): `scripts/journey-curve.py` juega el Viaje entero como un jugador simulado y mide, cada medio segundo, el nivel y las voces por segundo (densidad, la medida de intensidad del panel). Con ella se ajustaron la Tormenta, la Plenitud y el final. Las pruebas con personas siguen pendientes.
- **Fase 8 · Momentos de los capítulos 1–3** (alpha.104): faro con voz en la Llanura, lotos que responden al tema en el Lago, la criatura del Bosque que te sigue e imita, el Mundo sin palabras en el Viaje y un final con latido y la criatura. Pendiente: pruebas con personas, el músico coautor y los créditos definitivos.

- **Prototipo «Pégate»** (alpha.137, rama `claude/viaje-pegate`, aprobado por Jay tras probarlo el 23 de octubre, pendiente de integrar): en la Llanura lo que late con el beat se pega al cubo con un pulso a tiempo y llena la barra según su tamaño (motas 1, cruces 3, rombos 8, cometas 20; meta 120); fuera de tiempo nada se mueve. Con la barra llena una nube dorada llega junto al cubo y se traga con un pulso a tiempo. `?faro=1` conserva el faro para comparar.
- **Viaje por juegos** (arco aprobado por Jay el 23 de octubre): cada capítulo mantiene una regla, solo a tiempo pasa algo, llena la barra y cierra con algo dorado y un pulso a tiempo; cada uno añade un verbo.

| Capítulo | Verbo | Juego | Estado |
|---|---|---|---|
| Camino | Romper | Cristales a tiempo | Hecho |
| Llanura | Pegar | Lo que late se pega y el cubo crece; la nube dorada | Prototipo, alpha.137 |
| Lago | Encadenar | Una onda enciende racimos de flores en cadena; la flor dorada | Prototipo, alpha.138 |
| Bosque | Rodear | Una estela que cierra un círculo alrededor de luciérnagas; la criatura se une | Prototipo, alpha.139 |
| Tormenta | Bailar | Estar en el círculo del rayo y devolverlo a tiempo; el ojo de la tormenta | Prototipo, alpha.140 |
| Vacío | Soltar | Lo que pegaste se vuelve estrellas que cantan tu nota; el cubo vuelve a su tamaño; tu luz dorada | Prototipo, alpha.141 |
| Refugio | Escuchar | Tu viaje suena entero | Hecho |
- **Sin monedas en el Viaje** (decisión de Jay, 23 de octubre): las chispas son del Mundo libre; el Camino del Viaje da luz sin chispas y los cristales del Mundo no aparecen en los capítulos.
- **Fase 7 de la auditoría · Pruebas con personas** (alpha.136): notas en el teléfono con `?prueba=1` y guía de las sesiones en [Pruebas con personas](PRUEBAS_CON_PERSONAS.md). Faltan las sesiones.

## Plan de la auditoría · Fase 2 · El Viaje con tiempo (alpha.130)

Cada capítulo se cumple **viviendo su momento y quedándose en su música**, no con seis aciertos:

| Capítulo | Momento | Compases mínimos tocando |
|---|---|---|
| Llanura | llegar al faro | 48 |
| Lago | abrir 3 lotos | 56 |
| Bosque | caminar 600 px con la criatura | 56 |
| Tormenta | 4 rayos tuyos | 64 |
| Vacío | que las criaturas repitan una nota | 40 |

- Los compases solo cuentan mientras tocas (hasta 8 compases después del último pulso). A los tempos de cada familia suman unos 10 minutos de música; con el Camino, los trayectos y el final, la estimación es 15–18 minutos. **Es una estimación**: se mide con personas en la Fase 7 del plan.
- Con el momento y los compases, el tema completo trae la Plenitud. El portal se abre **después** del tema en tutti (al menos 4 s).
- Cada capítulo empieza el tema desde la primera nota.
- **Camino:** en el Viaje solo un pulso a tiempo rompe cristal, y uno por pulso (el más cercano). Cada cristal ya sumaba un instrumento.
- **Tormenta:** tus rayos caen dorados y cerca del cubo; cuando cae el primero, la tormenta deja de lanzar los suyos.
- **Final:** toca tus notas con tu ritmo (la distancia entre aciertos, de una a tres negras). Las partidas anteriores, sin ritmo guardado, suenan en negras. Mientras suena, el Refugio y la música del Mundo callan: hay silencio real antes de los créditos.
- **Sin avisos durante el Viaje:** los avisos cotidianos esperan; los problemas (guardado, errores) sí se muestran. La oferta de la nube llega en el Mundo libre.
- **Mundo libre cerrado hasta el final** (decisión 6A): el botón no aparece y no se puede elegir. Quien ya lo había alcanzado lo conserva.
- **Hacia el momento:** a los 3 s de llegar al capítulo, mientras el faro o los lotos estén fuera de la pantalla, una luz tenue en el borde, con su color, señala hacia ellos.
- **La barra de arriba** se llena con el capítulo: la mitad con su momento y la mitad con los compases; se vuelve dorada al cumplirlo.
- **Al llegar al Mundo libre**, «Tu cubo» se marca y un aviso dice para qué son las chispas.
- **Dedo fantasma** (decisión 7A): tras 4 s sin tocar, un dedo translúcido arrastra hacia la derecha y luego toca en el beat. Se va al primer toque. Sin palabras.
- Guardado: `S.journey.steps` (cuándo sonó cada nota), `S.journey.progress` (compases, paseo, rayos y ecos por capítulo) y `S.journey.free`. Se normalizan; las partidas viejas no pierden nada.

## Medida de la curva (Fase 7)

Recorrido simulado de 200 s (Llanura a final), navegador de pruebas, revisión `claude/viaje-f7-medida`. Densidad en voces por segundo:

| Estado | Llanura | Lago | Bosque | Tormenta | Vacío |
|---|---|---|---|---|---|
| Llegada | 14 | 19 | 12 | 11 | 5 |
| Pertenencia (tocando) | 37 | 20 | 31 | 59 | 23 |
| Plenitud | 26 | 21 | 39 | 48 | 10 |

- **Cumple:** la Tormenta es el momento más denso; el Vacío, el más vacío (−48 dB al llegar); el silencio tras 8 compases baja al nivel de la Llegada; la Plenitud suena 5–8 dB más fuerte que la Pertenencia.
- **Falta:** el nivel general casi no cambia (el máster lo sostiene), así que la intensidad se lee en densidad. En la Llanura y el Lago la Plenitud no es más densa que tocar: la diferencia la dan el tema completo y el color. El final dura 35 s y es un solo con pedal y acorde.
- **Límite:** jugador simulado, sin personas. La curva por minuto de arriba se compara cuando haya pruebas reales.

## Fases siguientes

Detalle completo en el informe del panel. Cada fase, en su rama:

1. El pulso (Camino y Llanura).
2. Entrar y callar (en paralelo con la 1).
3. El Mundo como lámina.
4. El disco.
5. Momentos firma y final.
6. Recorte, festival y accesibilidad.
7. Pruebas con personas y panel.
8. Presentación.

**Metas del panel** (media de 6,4 a 8,7):

| Criterio | De | A |
|---|---|---|
| Visual | 6,5 | 8,5 |
| Audio | 7,9 | 9 |
| Creatividad | 7,9 | 9 |
| Sensación | 5,6 | 8,5 |
| Cohesión | 4,8 | 8,5 |
| Pulido | 6,1 | 8,5 |
