# El mundo de Kubono: Viaje, 11 lugares y Refugio

Diseño aprobado por Jay el 23 de octubre de 2026. Es la fuente única del plan por fases F0–F16. Estado de cada fase: en [Cambios](../CAMBIOS.md). Una decisión aprobada no equivale a construida ni probada con personas.

## Las cuatro capas

| Capa | Qué es | Para qué sirve |
|---|---|---|
| **Viaje** (prólogo, 15–17 min) | Cinco capítulos con historia: Llanura, Lago, Bosque, Tormenta y Vacío, más el Camino y el Refugio | Aprender los cinco primeros verbos y llegar a casa |
| **Los 11 lugares** | Retos fijos, cada uno con su juego y tres estrellas | Avanzar: las estrellas abren lugares y ganan el juego |
| **Mundo salvaje** | El mundo infinito alrededor | Explorar, encuentros sorpresa, chispas y coleccionables |
| **Refugio** | La casa, en el centro del anillo | Trofeos, estrellas, mapa, tienda, espejo, logros y Bitácora |

## Reglas fijas

1. **Solo a tiempo pasa algo** en los lugares y en el Viaje. En el Mundo libre se toca cuando se quiera; a tiempo da más chispas.
2. **Cada lugar:** una barra, un verbo, un objeto dorado al final y un último pulso a tiempo para cerrarlo.
3. **Nadie pierde:** no hay derrota; solo más o menos estrellas y chispas.
4. **Texto mínimo:** una idea por mensaje. Solo los logros del narrador hablan con gracia.
5. **Nada ganado se borra:** los guardados se migran.

## Chispas y estrellas

| | Chispas ✦ | Estrellas ★ |
|---|---|---|
| Para qué | Comprar: tienda del cubo y salto lejano | Ganar (★ de los 11 lugares) y hacer crecer tu canción |
| De dónde | Jugar: lugares, Mundo libre, encuentros, remezcla diaria y algunos logros | Solo los retos de los 11 lugares |
| ¿Se gastan? | Sí | Nunca; como máximo 33 (11 ganan; 33 son la versión maestra) |
| En el Viaje | No aparecen | Se dan al terminarlo |

### Estrellas de cada lugar

| Estrella | Cómo |
|---|---|
| ★ Completo | Cerrar el objeto dorado |
| ★★ Ritmo | Completarlo con al menos el 85 % de pulsos a tiempo |
| ★★★ Maestro | Se abre con ★★: tempo +10 %, barra ×1,5 y margen a tiempo más estrecho; completarlo con al menos el 80 % a tiempo |

Sin sonido se gana ★; ★★ y ★★★ piden escuchar. Al terminar el Viaje cada capítulo da su ★, y su ★★ si se jugó con el 85 % a tiempo; quien ya lo había terminado recibe esas mismas estrellas.

### El camino (plan H3)

Tras el Viaje, el anillo se abre **en orden**, como las pistas de un disco: cada lugar se abre al completar el anterior.

| Pista | Lugar | Verbo | Se abre |
|---|---|---|---|
| 1–5 | Llanura, Lago, Bosque, Tormenta, Vacío | Pegar, Encadenar, Rodear, Bailar, Soltar | Al terminar el Viaje |
| 6 | Jardín | Sembrar | Al completar el Vacío |
| 7 | Dunas | Surfear | Al completar el Jardín |
| 8 | Cristales | Resonar | Al completar las Dunas |
| 9 | Faros | Guiar | Al completar los Cristales |
| 10 | Ruinas | Reconstruir | Al completar los Faros |
| 11 | Cueva | Eco | Al completar las Ruinas |
| **Ganar** | Los 11 completos (11 ★): suena el final verdadero de tu canción | | |
| **Versión maestra** | Las 33 ★ | | |

- Una columna de luz dorada y la flecha del borde señalan el siguiente lugar del camino. La tarjeta de la ronda tiene «Siguiente · lugar», que lleva a su portal y empieza su ronda.
- Un lugar ya completo ofrece **Jugar**, **Libre** (su música y su verbo, sin barra, estrellas ni chispas) y **Maestro** (con ★★).
- Nadie pierde una puerta: un guardado de antes conserva abiertos los lugares que sus estrellas ya abrían (`kept`), y un lugar con su ★ o ya visitado sigue abierto.

### Chispas

| Entrada | Chispas |
|---|---|
| Ronda completada en un lugar | 60 + 6 por cada 10 % a tiempo (60–120) |
| Ronda Maestro | El doble (120–240) |
| Mundo libre | Lo de siempre; a tiempo ×2; con racha de 8 o más, ×3 |
| Encuentro salvaje | 15 |
| Remezcla diaria | 30, y 20 más con récord |
| Logros | 0–25 |

Cada lugar da chispas completas en sus tres primeras rondas del día y la mitad después. La tienda conserva sus precios (17 030 ✦): con estas reglas el catálogo completo lleva unas 9,4 horas a quien toca a tiempo seis de cada diez pulsos y unas 7 a quien toca nueve de cada diez, según `scripts/spark-economy.mjs` (F3; un modelo, no una medida con personas). El viaje rápido a lugares visitados es gratis y el salto lejano conserva su precio.

## Tiempos

| Qué | Duración |
|---|---|
| Viaje completo | 15–17 min |
| Un lugar | 2:30–3:00 (la Llanura hasta 3:30) |
| Un lugar Maestro | 3–4 min |
| Del Refugio a cualquier portal, a pie | 30–60 s |
| Encuentro salvaje | ~30 s |

## Dónde están y cómo se llega

- Los 11 portales dorados forman un anillo alrededor del Refugio, cada uno en su bioma. Cada portal suena, más fuerte cuanto más cerca; los cerrados muestran las estrellas que piden.
- Una flecha en el borde de la pantalla señala el lugar más cercano sin jugar; el mapa los muestra todos con sus estrellas.
- Viaje rápido desde la mesa del mapa del Refugio o desde el menú, a lugares ya visitados.
- No hay orden obligatorio: se juega cualquiera de los abiertos.

## El Refugio

- **Sala de trofeos:** el objeto dorado de cada lugar completado; al tocarlo suena su capa de música.
- **Muro de estrellas**, **mesa del mapa** y **puerta al anillo**.
- Siguen las cápsulas, la colección, la guía, la tienda, el espejo y las visitas; en una visita se ven las estrellas del dueño.

## Tu canción

Cada lugar da una capa de una canción. El final del Viaje junta las cinco primeras y abre el mundo («Tu mundo se abrió · Once lugares te esperan», botón Explorar). Con los 11 lugares completos suenan las once juntas: es ganar el juego («Los 11 lugares»). Con las 33 ★ vuelve como versión maestra («Las 33 ★»). Desde H4 la canción es la música del propio juego: el Mundo sigue sonando en su tono y tempo, y encima entra la capa de cada lugar ganado sobre el acorde que suena. Las estrellas la hacen crecer: ★ un fragmento (un compás de cada dos), ★★ la capa entera, ★★★ su variación (una octava arriba y con eco). El final con los 11: las capas entran una por compás, luego tus notas de cada lugar en orden y al final el tema del cubo; la versión maestra lo toca todo en su variación. Los trofeos del Refugio tocan su capa dos compases sobre la música.

## Logros del narrador

Unos 40 logros con voz burlona, al estilo de *Dungeon Crawler Carl*. Los actuales se reescriben o se retiran sin perder lo ganado. Jay aprueba primero una muestra de 20.

## Fases

Cada fase sale de `main` actualizado, en su rama, y se integra cuando Jay la aprueba.

| Fase | Rama | Qué | Terminada cuando |
|---|---|---|---|
| F0 · El Viaje por juegos en `main` | `claude/f0-viaje-juegos` | Los cinco capítulos en `main` (PR #315–#319), el festival con el Lago nuevo, `?capitulo=` y este documento | El Viaje se juega de punta a punta en `main` |
| F1 · Ritmo de los niveles | `claude/f1-ritmo` | Llanura meta 60; Lago 340; Bosque 240 (luciérnaga hasta 3); Tormenta 250; primer círculo de la Tormenta junto al cubo; el Vacío suelta en el «1» y pide cielo libre | Una partida real da 2:30–3:00 por nivel en `?prueba=1` |
| F2 · Sonido de victoria | `claude/f2-victoria` | Drop electrónico por género al completar, en lugar del violonchelo; mezcla de los cinco juegos | Sustituido por F13 |
| F3 · Economía de chispas | `claude/f3-chispas` | Tabla de chispas, límite diario, ×2/×3 a tiempo, tienda reajustada y simulación | La simulación cuadra y ningún saldo baja |
| F4 · Lugares y estrellas | `claude/f4-estrellas` | Ronda, Maestro, récords, estrellas retroactivas y pantalla de resultado | Los cinco lugares dan sus estrellas y chispas |
| F5 · El anillo | `claude/f5-anillo` | Portales, flecha, mapa y viaje rápido | Cualquier portal a 30–60 s de la puerta |
| F6 · El Refugio como centro | `claude/f6-refugio` | Trofeos, muro de estrellas, mesa del mapa y puerta | La casa dice qué tengo, qué falta y a dónde voy |
| F7 · Tu canción | `claude/f7-cancion` | Capas por lugar, final del Viaje y final verdadero | Se entiende qué se logró sin explicación |
| F8 · Logros del narrador | `claude/f8-logros` | ~40 logros nuevos y revisión de los actuales | Jay aprueba los textos; nadie pierde un logro |
| F9–F11 · Jardín, Dunas, Cristales | `claude/f9-jardin` … `claude/f11-cristales` | Juego, objeto dorado, capa, trofeo y Maestro | Hechos (en `main`) |
| F12 · Primer minuto | `claude/f12-primer-minuto` | Pista en la barra antes del primer pulso; Llanura a 2:30–3:00 para quien ya sabe jugar | Alguien nuevo da su primer pulso sin ayuda; la Llanura dura lo que debe |
| F13 · Victoria con tu música | `claude/f13-victoria-musica` | Los cierres salen de la música que suena: filtro, silencio y la misma canción con algo más (su capa y el tema), en su tono y tempo | Hecho; falta la escucha de Jay |
| F14 · Ritmos | `claude/f14-ritmos` | Contratiempo, el «1» y patrones; guía de puntos bajo el cubo; el reparto de abajo | Hecho; falta que Jay lo juegue |
| F15 · Faros | `claude/f15-faros` | Guiar, con su ritmo | Hecho; falta la prueba de Jay |
| F16 · Ruinas | `claude/f16-ruinas` | Reconstruir, con su ritmo | Hecho; falta la prueba de Jay |
| F17 · Cueva | `claude/f17-cueva` | Eco: repetir el patrón que canta | Hecho; las 33 ★ se pueden ganar; falta la prueba de Jay |
| F18 · Mundo salvaje | `claude/f18-salvaje` | Encuentros de 30 s y remezcla diaria | Hecho; falta la prueba de Jay |
| F19 · Cierre con personas (pasa a H7) | `claude/f19-cierre` | Sesiones con `?prueba=1`, ajuste final, rendimiento, material de tienda | Las notas cumplen los tiempos |

Plan revisado por Jay el 23 de octubre tras jugar F0–F11: las F12–F19 sustituyen a las antiguas F12–F16.

### Ritmo de cada lugar (F14, aprobado)

| Lugar | En el Viaje | Como lugar |
|---|---|---|
| Llanura | A tiempo | A tiempo |
| Lago | A tiempo | Contratiempo («y») |
| Bosque | A tiempo | A tiempo |
| Tormenta | Mezcla «1 · 2 · y» | Mezcla «1 · 2 · y» |
| Vacío | El «1» | El «1» |
| Jardín | — | Sembrar a tiempo, regar a contratiempo |
| Dunas | — | La cresta en el «y» |
| Cristales | — | Acorde en «1 · y · 2» |
| Faros | — | Destellos en «1 · 3 · y» |
| Ruinas | — | Patrón «1 · 2y · 3 · 4» |
| Cueva | — | Repetir el patrón que canta |

En el Viaje cada capítulo enseña un ritmo nuevo solo cuando toca: los tres primeros a tiempo, la Tormenta la primera mezcla y el Vacío el «1».

Cómo se juega (`journey-rhythm.js`): solo cuenta un pulso en un paso del ritmo, con la misma ventana de siempre; en otro paso, aunque sea un tiempo, no hace nada. Desde H2 la guía es la Línea: los pasos que cuentan se levantan en ella (el «1» en dorado), y al empezar el lugar canta su patrón dos compases antes de pedirlo, sin texto. El Vacío conserva su espera suave y sus propios cuatro puntos. En el Jardín, el tiempo siembra y cosecha y el «y» riega; en las Dunas la ola pasa en el «y».

## Plan integrado H1–H7 (24 de octubre)

El panel creativo revisó el juego por segunda vez (media 7,2; antes 6,4) y Jay aprobó el plan el 24 de octubre. Una idea une todo: **tocas a tiempo → avanzas por un camino → lo que ganas se vuelve tu canción**.

Decisiones de Jay (aprobadas; se aplican en la fase indicada, hasta entonces rige lo de arriba):

| Tema | Decisión | Fase |
|---|---|---|
| Desbloqueos | Los lugares del anillo se abren **en orden**, al completar el anterior, como pistas de un disco | H3 |
| Ganar | Completar los 11 lugares (11 ★) hace sonar el final verdadero. Las 33 ★ dan la **versión maestra** | H3–H4 |
| Estrellas | No abren puertas: hacen crecer tu canción (★ fragmento, ★★ capa completa, ★★★ variación) | H4 |
| Tu canción | Hecha con el mismo motor que la música del juego, en tu tono; no un house aparte | H4 |
| Chispas | Fuera de tiempo, 0 ✦ también en el Mundo libre. La tienda sigue abierta (oculta solo en el Viaje). Las chispas solo compran | H5 |
| Texto | Viaje sin rótulos; lugares, una frase la primera vez; el narrador solo en la tarjeta final y la Bitácora | H5 |
| Mundo libre tras el Viaje | Sigue con todo a la vista | — |
| Modo Libre por lugar | Sí: jugar con la música del lugar sin barra ni estrellas | H3 |
| Festival | Pendiente de Jay (recomendación: solo el Viaje y el final) | H7 |

| Fase | Rama | Qué |
|---|---|---|
| H1 · Que se vea | `claude/h1-que-se-vea` | Lugares sin «Sin visitar» con ★; brillo dorado y onda dorada en cada acierto; cubo de 16–30 px en el Mundo; el gris de un lugar no recuperado solo en el suelo (el oro sigue dorado); color recuperado como tono; cerrar un lugar recupera su color |
| H2 · Que se sienta | `claude/h2-que-se-sienta` | Calibrar el retraso con los primeros pulsos y en Ajustes; una sola guía de ritmo; cada lugar canta su patrón antes; el cubo cambia de forma con la racha (hecho) |
| H3 · El camino | `claude/h3-camino` | Orden de pistas, luz al portal siguiente, portal siguiente tras la ronda, modo Libre, ganar con 11 (hecho) |
| H4 · Tu canción | `claude/h4-cancion` | Capas con el motor del juego y niveles por estrella; final verdadero con tus notas; versión maestra (hecho) |
| H5 · Reglas claras | `claude/h5-reglas` | 0 ✦ fuera de tiempo; Viaje sin rótulos; narrador en su sitio; menú más corto |
| H6 · Mundo que se escucha | `claude/h6-escucha` | Voces salvajes que se encuentran con el oído; portales que suenan desde su dirección |
| H7 · Medir y personas | `claude/h7-medir` | Simulación de 2 h (60, 75 y 90 % a tiempo); festival; sesiones con Luca |

## Cuándo una fase está terminada

Regla «solo a tiempo» y textos breves; capturas en teléfono, teléfono horizontal y escritorio, con paleta para daltonismo y movimiento reducido; renders de mezcla de lo que cambió; guardado migrado y sincronizado sin pérdidas; pruebas de lógica y navegador sin desactivar ninguna; `?medir=1` sin empeorar; documentación al día; y una lista de cinco minutos para el teléfono de Jay. Lo que falle se corrige dentro de esa fase.

## Fuera de este plan

Duetos en línea, más de 11 lugares, la configuración de la cuenta (Supabase sigue en pausa) y la publicación en tiendas.

## Herramientas de prueba

- `?capitulo=llanura` (o `lago`, `bosque`, `tormenta`, `vacio`): abre el Viaje directamente en ese capítulo, sin cuenta y con un guardado propio (`kubono:capitulo`); cada carga empieza el capítulo de nuevo.
- `?lugar=lago` (o `llanura`, `bosque`, `tormenta`, `vacio`, `jardin`, `dunas`, `cristales`; `&maestro=1` para la Maestro): una ronda del lugar con el Viaje terminado, sin cuenta y con su propio guardado (`kubono:lugar`).
- `?anillo=1`: el Mundo libre tras el Viaje, sin ronda y con el guardado de `?lugar=`, para recorrer el anillo de portales.
- `?clasico=1`: los capítulos anteriores, para comparar mientras dure el cambio.
- `?prueba=1` y `?prueba=ver`: las notas de las pruebas con personas ([guía](PRUEBAS_CON_PERSONAS.md)).
- `?festival=1`: los primeros 15 minutos sin cuenta, con «Otra persona».
