# 05 · Ed Key y David Kanaga (Proteus) — sesión 11
> Simulación de su mirada de diseño a partir de su obra pública. No es su opinión real. Revisó alpha.215 (`5464612`): universo abierto y su sonido (`src/world-*.js`, `src/voices.js`, `src/discovery.js`, `src/encounters.js`, `src/alive.js`, `src/ambience.js`), HUD y avisos (`src/ui.js`, `index.html`), capturas `20-anillo`, `23-salvaje`, `10-lugar-jardin`, `03-capitulo-bosque`, `21-lugares`, `34-favoritos`, `menus/tel-libre-mapa`, `menus/tel-libre-menu`. Sin navegador, sin manos y sin oír audio.

## Notas (puntuación ciega)
| Eje | Nota | Evidencia y alcance |
|---|---|---|
| Visual | 6,5 | Noche negra con niebla de color y glifos finos (`20-anillo`, `03-capitulo-bosque`). Pocas cosas por pantalla. El anillo se lee como un solo campo verde. |
| Audio | — | No lo oí. Nadie lo ha oído en teléfono. Juzgo su estructura en «Creatividad» y «Sensación». |
| Creatividad | 7 | Cada clase de cosa de una región tiene voz propia y estable (`voices.js:29-61`). Estaciones por continente (`alive.js:27-37`). Camas de lluvia e insectos en la tonalidad (`ambience.js:10`, `world-weather.js:32`). |
| Sensación | 5,5 | Leída en código y medidas, no en manos. El mundo canta sobre todo cuando lo tocas (`encounters.js:102`). Lo que pasa solo es mudo (`world-happenings.js:4`). |
| Cohesión | 5,5 | Tres cifras en el HUD (`ui.js:22-24`), pero los avisos siguen contando (`discovery.js:10,63,75,106,116`). El «5 / 11» de Lugares va en dorado (`estilo-j.css:599`). |
| Pulido | 6 | Capturas sin errores de página. La captura del anillo usa la vista tranquila del fixture (`chapter-test.js:24`), no la vista por defecto tras el Viaje. Etiquetas de datos en la tarjeta de región (`discovery.js:13,52`). |

## Lo que funciona hoy
- **Cruzar es oír.** Una región mide 3600 px (`data.js`: `REG=4`, `WCH=900`). El cubo anda a 190 px/s (`SPEED=190`): unos 19 s por región. A 900 px del borde empieza la mezcla con la vecina (`render.js:200-201`). La mitad de cada cruce suena a dos lugares a la vez.
- **Todo lo que hay tiene voz.** Luz, pulso, árbol, agua, plantas y formas reciben papel e instrumento estables por región (`voices.js:31-60`). La semilla `voices:v1:` no cambia con el contenido nuevo.
- **El aire está en el tiempo.** Las camas comparten un bus que se hunde en cada pulso (`ambience.js:5-8,19`). Los insectos cantan notas de la escala (`world-weather.js:30-32`). La tormenta se oye antes de verse (`alive.js:56-58`).
- **El mundo vive sin ti.** Criaturas que duermen de noche y despiertan si te acercas (`world-fauna.js:11`). Parejas que se saludan (`:22`). Bandadas de día y murciélagos de noche (`:28`). Huellas que el mundo recuerda (`alive.js:52-53`).
- **El suelo vuelve a ser negro.** En `20-anillo` y `03-capitulo-bosque` el fondo es negro con color en las formas. El cubo es lo más blanco.
- **La vista tranquila existe.** Oculta las cifras y los avisos del mundo (`estilo-j.css:541`, `ui.js:46-47`). Es el modo más cercano a un paseo sin marcador.

## Lo que falta o salió mal
1. **Alta · Lo que pasa solo sigue mudo.** Estrellas fugaces, festival de luces y brisa: «sin premios, sonidos ni texto» (`world-happenings.js:4`). Las bandadas tampoco suenan (`world-fauna.js:28-29`, solo dibujo). Lo más raro del mundo no entra en la música.
2. **Alta · La chispa salvaje se ve antes de oírse.** Nace a 150 px delante del cubo (`wild.js:11`, `:40`). En 390×844 siempre está en pantalla (`23-salvaje`: espiral dorada a ~110 px). Se anuncia «Una chispa salvaje.» y «Se fue.» (`wild.js:40,42`). Llega cada 60–120 s (`WILD_AFTER`, `WILD_SURE`) y paga 15 ✦. Es un premio con horario, no un hallazgo.
3. **Alta · Los avisos siguen contando.** El HUD tiene tres cifras, pero los avisos de la vista completa dicen «Forma nueva · nombre · 47» (`discovery.js:10`), «Vida · x · n / N» (`:75`), «Familia nueva · n / N» (`:116`), «Reliquia N» (`:106`), «Récord · N regiones» (`:63`) y «Faro · n / 3» (`render.js:300`). Hay unos 127 logros en `data.js:75-364`; 67 llevan un umbral en el nombre. La vista completa es la que queda tras el Viaje (`journey-finale.js:80`).
4. **Media · Las cosas cantan poco.** El entorno da un solista en un solo paso por compás y calla el cuarto (`ambient-score.js:4`). Las criaturas solo cantan si te siguen, una cada cuatro compases (`render.js:352`, `audio.js:322`). Los encuentros solo suenan tras tocarlos (`encounters.js:102`, `state.used`). Unas 4 notas del entorno cada 4 compases si no tocas.
5. **Media · Las estaciones no pasan delante de ti.** Cambian cada semana real por continente (`alive.js:34-36`). En una sesión no ves llegar el otoño. Su efecto: −4 a +3 BPM, filtro y 26 partículas (`alive.js:27-32,76`).
6. **Media · La tarjeta de región habla en datos.** «Género · 120 BPM» (`discovery.js:13`) y «continente · tamaño · familia · tono de X» (`:52`). Nombra la ficha técnica del lugar en vez de dejar oírlo.
7. **Baja · Dorado fuera de las ★.** «Lugares 5 / 11» va en `#f0d27a` (`estilo-j.css:599`; `21-lugares`). D4 deja el dorado para las ★.
8. **Baja · La captura no muestra la vista real.** El fixture `?anillo=1` fuerza la vista tranquila (`chapter-test.js:24`). En `tel-libre-menu` se ven las tres cifras arriba a la derecha. No hay captura del universo lejos del anillo.

## Contraste con la sesión 10
- **Cerrado.** Los logros salen de la tarjeta de resultado (`33-resultado`; P4). «Estrella» de las reliquias pasa a «Reliquia» (`discovery.js:106`; P8). Un logro por aviso (`achievements.js`, P8). El color se gana y el fondo vuelve al negro (P7). Las criaturas en glifos bajan a un tercio en Viaje y rondas (`world-fauna.js:35-36`).
- **Abierto.** Mis seis pedidos pasaron a «Ideas sin consenso» (informe, §8). Sigue igual en código: chispa a 150 px con texto (`wild.js:11,40`), un solista por compás (`ambient-score.js:4`), sucesos mudos (`world-happenings.js:4`), estaciones semanales (`alive.js:34`), quietud con cartel en cada etapa (`quietud.js:23`). El resultado aún muestra «74,6 %», «A 0,4 de ★★», tiempo y ✦, y ninguna línea de lo que sonó (`33-resultado`).
- **Empeoró o es nuevo.** Nada empeoró en el sonido del mundo. Lo nuevo: el «5 / 11» dorado contradice D4. Los avisos con cifras no entraron en P8, que miró el HUD y las hojas.
- Mis notas bajan en Creatividad, Sensación, Cohesión y Pulido (medio punto cada una) y me abstengo en Audio. No es que el mundo empeorase: P1–P8 pulieron el juego de rondas y el paseo quedó igual.

## Qué haría ahora
1. **Avisos sin cifras.** Quitar el número de los avisos de `discovery.js:10,63,75,106,116` y `render.js:300`. Las cuentas siguen en la Bitácora.
   *Bien cuando:* ningún aviso del mundo lleva dígitos (`grep` de `toast(` con números en `discovery.js` da 0); los logros y la Bitácora no cambian.
2. **La chispa salvaje, de oído.** En `wild.js:11` y `:40`, nacer a 500–700 px a un lado del rumbo. Con sonido, sin «Una chispa salvaje.» ni «Se fue.»; la flecha y el texto solo sin sonido.
   *Bien cuando:* distancia inicial ≥ 450 px en el 100 % de los nacimientos; 0 avisos con sonido; ✦ y reglas de captura iguales.
3. **Que suenen los sucesos.** En `world-happenings.js`, una voz suave existente por suceso, en la escala y por `ambienceBus`. Estrella fugaz: tres notas que bajan. Festival: arpegio lento. Bandada: un trino que cruza de lado a lado con `spatial.js`.
   *Bien cuando:* cada suceso programa ≥ 1 nota en la tonalidad actual; ninguna supera `AMBIENCE_LEVEL`; con sonido apagado no cambia nada; renders de audio sin cambios fuera de esos momentos.
4. **Densidad por cercanía.** En `ambient-score.js:4`, un segundo y tercer solista cuando hay 3 o más fuentes a menos de 280 px, a ganancia baja.
   *Bien cuando:* parado junto a 5 criaturas suenan ≥ 8 notas del entorno cada 4 compases (hoy ≈ 4); solo, ≤ 4; el pico de salida no sube más de 1 dB.
5. **Estaciones que se recorren.** En `alive.js:34`, sumar al ciclo semanal un paso por distancia andada (una estación cada 10–15 min de caminar), con fundido de partículas y filtro, sin texto.
   *Bien cuando:* en 45 min de paseo se ven ≥ 3 estaciones; el cambio tarda ≥ 20 s; 0 avisos; semillas y mapas iguales.
