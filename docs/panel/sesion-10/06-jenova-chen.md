# Jenova Chen · curva emocional, flow y atención

Simulación de la mirada de diseño de Jenova Chen a partir de su obra pública. No es su opinión real.

**Versión:** 2.3.0-alpha.207 (commit `2e7f9d1`).

**Qué revisé:**
- Modelo de dos horas: `node scripts/play-curve.mjs`, más sus eventos por perfil (llamé a `curve()` desde Node para listarlos).
- Código: `src/places.js`, `src/spark-rules.js`, `src/places-ring.js`, `src/journey-chapters.js`, `src/journey-pulse.js`, `src/journey-stick.js` (cabecera y curva de volumen), `src/song.js`, `src/song-stage.js`, `src/journey-finale.js` (cabecera), `src/wild.js` (cabecera), `src/rhythm-calibration.js`.
- Guías permitidas: `docs/VIAJE.md`, `docs/MUNDO.md`.
- Capturas (13): `00-inicio`, `01-capitulo-llanura`, `02-capitulo-lago`, `04-capitulo-tormenta`, `05-capitulo-vacio`, `10-lugar-jardin`, `12-lugar-cristales`, `15-lugar-cueva`, `20-anillo`, `21-lugares`, `22-cancion`, `23-salvaje`, `33-resultado` y el menú `menus/tel-libre-menu`.
- No jugué con las manos. No oí el audio. Lo que digo del sonido y de la sensación sale del código y del modelo, que simula jugadores y no mide personas.

## Contexto

Kubono es un juego de ritmo sin castigo. Un cubo diminuto toca a tiempo en un universo negro y la música crece cuando aciertas. El Viaje es un álbum corto de cinco capítulos con un arco claro: llegada, pertenencia, plenitud. Luego hay un anillo de once lugares que suman capas a una canción tuya. Intenta ser un juego que te lleve al flow por la música y no por la presión. Visto hoy por primera vez, el arco del Viaje está pensado. Lo que viene después de la victoria, no tanto.

## Notas

| Área | Nota | Por qué | Evidencia |
|---|---|---|---|
| Visual | 7 | Negro y contenido, con el color reservado a lo ganado. Pero los capítulos se parecen entre sí y el clímax (Tormenta) no se ve más intenso que la Llanura. | Capturas `01`, `04`, `05`; `22-cancion` |
| Audio | 7,5 | Por código: cada estado tiene su volumen máximo, la música baja a un pedal cuando dejas de tocar y los portales se encuentran de oído. No lo he oído. | `journey-chapters.js:12`, `:86`; `places-ring.js:13-15`, `:77-85` |
| Creatividad | 8 | Once verbos distintos sobre un mismo gesto. Tus notas acaban en tu canción. | `places.js:14-18`; `song.js:4-15`; `places.js:117-120` |
| Sensación | 6,5 | La ventana de ±80 ms, la calibración y las formas del cubo prometen precisión. Pero a quien acierta el 60 % se le corta el crecimiento después de ganar. Puntuado por código y modelo. | `journey-pulse.js:9`, `:14`; `rhythm-calibration.js:2-5`; play-curve |
| Cohesión | 7,5 | Las capas de Tu canción unen los once lugares. El anillo funciona como un disco. | `song.js:9-12`; `places-ring.js:6-9`; captura `22-cancion` |
| Pulido | 7 | La tarjeta es honesta (74,6 % / 75 %). Pero junto al momento clave salen «8 logros nuevos» y el menú es largo. | Capturas `33-resultado` y `tel-libre-menu` |
| **Media** | **7,25** | | |

## Lo que funciona

1. **El arco dentro de cada capítulo.** Hay tres estados con su volumen máximo (0,38, 0,66 y 1) y un pedal a 0,16 si te callas (`journey-chapters.js:12`). La música te espera tras 8 compases sin tocar (`:13`, `:86`). Es la curva de «llegada, pertenencia, plenitud» bien escrita.
2. **La música sigue a tu progreso, no a un reloj.** Cada juego sube el volumen máximo con la barra: `.4+.6*p` (`journey-stick.js:63` y sus diez vecinos, p. ej. `journey-lasso.js:63`). Tocar mejor se oye.
3. **El clímax y el silencio están en su sitio.** La Tormenta tiene el suelo más alto (`journey-chapters.js:17`). El Vacío deja al cubo casi solo (`:20`). La captura `05-capitulo-vacio` lo confirma: un cubo con halo en un negro casi vacío. Es el contraste que pide una curva emocional.
4. **Atención dirigida por la luz y el oído, no por texto.** Una columna dorada marca el siguiente lugar y se ve desde cualquier sitio (`places-ring.js:69-74`). El portal siguiente suena en el «3» del compás desde su lado (`:12-15`, `:83`). La chispa salvaje también se busca de oído (`wild.js:13-15`). En `20-anillo` solo hay una etiqueta: «Jardín · 600 m».
5. **El ritmo de novedades se cumple para quien acierta el 75 % o más.** En el modelo, el 75 % nunca pasa 10,7 min sin una capa nueva y el 90 % nunca pasa 5,6 min (salida de play-curve).
6. **El casi-logro es transparente.** La tarjeta enseña «Ritmo · 74,6 % / 75 % a tiempo» (`33-resultado`; `places.js:24`, `:131`). El redondeo nunca regala una estrella. El jugador sabe exactamente cuánto le falta.
7. **La calibración es invisible.** Mide los primeros 12 pulsos y no necesita menú (`rhythm-calibration.js:2-5`). Si el «a tiempo» es justo, el flow es posible.

## Lo que falla o falta

Ordenado por gravedad.

1. **Al jugador del 60 % se le acaba la experiencia al ganar.** Gana en el minuto 39,9 y luego pasa 80,1 min sin ninguna capa nueva (play-curve, perfil 60). Sin sonido, 81,8 min desde el 38,3. La causa está en el código:
   - ★★ exige el 75 % (`places.js:22`, `:30`).
   - Maestro exige tener ★★ antes (`places.js:90`: `maestro&&!s.stars[id][1]` devuelve false).
   - El modelo suma como mucho un 6 % de práctica (`scripts/play-curve.mjs:18`). Así, del 60 % no se llega al 75 %.
   
   Para ese jugador, el pico emocional (la victoria) es también el final del crecimiento. Es un acantilado en la curva de flow: el reto se queda fijo por encima de su habilidad y no hay un escalón intermedio. Límite: es un modelo. Una persona real podría mejorar más rápido.
2. **Su canción final suena a fragmentos.** Con ★ cada capa toca solo un compás de cada dos (`song.js:35`). El nivel de cada capa es su número de estrellas (`song-stage.js:73`). La victoria de quien acierta el 60 % reúne once capas a medias, y ninguna llega entera. El clímax de la obra suena incompleto justo a quien más necesita sentirlo completo.
3. **Después de ganar, el objetivo desaparece.** `gameObjective` devuelve «Tu canción está completa. Explora a tu ritmo.» en cuanto no queda lugar siguiente (`places.js:70`), aunque falten 22 estrellas. La columna dorada y la brújula dependen de `nextOnPath` (`places-ring.js:28`, `:69`). Esa función devuelve null cuando los once están completos. La atención pierde su guía en el mismo minuto en que se abre el hueco del punto 1.
4. **El anillo es una escalera plana.** Las seis rondas nuevas duran casi lo mismo, entre 2,2 y 2,55 min (`scripts/play-curve.mjs:17`). En el modelo caen cada 3,3–5,7 min sin ningún cambio de intensidad. El Viaje tiene un clímax (Tormenta) y una calma (Vacío). El anillo no tiene ni lo uno ni lo otro antes de la victoria. Además, en el perfil del 90 % el ★★ de la Cueva y la victoria llegan en el mismo instante (32,94). Las novedades se amontonan en lugar de espaciarse.
5. **En los capítulos con muchos objetos, la atención compite con el cubo.** En `02-capitulo-lago` y `01-capitulo-llanura` hay docenas de círculos y discos grises del mismo valor que el cubo. El cubo es pequeño (y debe seguir siéndolo), pero nada más baja de brillo para dejarle sitio. En `05-capitulo-vacio` sí se lee, porque el entorno se apaga.
6. **El clímax visual no se distingue.** La Tormenta (`04`) y la Cristales (`12`) usan los mismos grises de línea fina que la Llanura (`01`). El audio sube hasta la Tormenta (`journey-chapters.js:17`), pero la imagen no acompaña esa subida.
7. **Ruido extrínseco en el momento de la recompensa.** En `33-resultado` aparece «8 logros nuevos · En la Bitácora» bajo la estrella. Compite con la emoción de la ronda y con el 74,6 % que debería invitar a otro intento.

## Recomendaciones

1. **Un escalón audible entre ★ y ★★, sin cambiar los umbrales.** Que el fragmento de cada capa se haga más largo según tu mejor porcentaje a tiempo, que ya se guarda (`best[id].onTime`, `places.js:118`). Por ejemplo: 1 de cada 2 compases al 60 %, 3 de cada 4 al 67 % y entero con ★★. Se tocaría en `song.js:35` (`layerStep`/nivel) y en `song-stage.js:73` (`tiersOf`). Se añadiría un evento «crece» a `scripts/play-curve.mjs`.
   *Bien cuando:* en play-curve, el perfil 60 % cumple «sin nuevas capas ≤ 12 min» hasta el minuto 120. ★★ sigue al 75 % y ★★★ al 70 %. Una prueba unitaria confirma que una mejora de 5 puntos alarga la capa.
2. **Un objetivo después de la victoria.** Cuando los once estén completos, `gameObjective` (`places.js:70`) y `nextPortal` (`places-ring.js:28`) deberían apuntar al lugar sin ★★ con el mejor porcentaje: «Lago · 74,6 %. Falta poco para ★★.» La columna dorada se quedaría encendida sobre ese portal.
   *Bien cuando:* en un estado de prueba con 11 ★ y menos de 33 ★, el objetivo nombra un lugar concreto y `ringState().next` no es null. Con 33 ★ vuelve el «Explora a tu ritmo».
3. **El casi-logro, en primer plano en la tarjeta.** Entre el 70 % y el 74,9 %, la tarjeta diría «A 0,4 de ★★» y «Otra vez» iría al lado de «Seguir hacia». Los logros nuevos pasarían a la Bitácora sin línea propia en la tarjeta. Se tocaría en `places.js:128-135` (`results`).
   *Bien cuando:* la captura de `33-resultado` en ese estado muestra la distancia exacta y ninguna línea de logros.
4. **Dejar sitio al cubo pequeño bajando el entorno, nunca agrandándolo.** En Lago y Llanura, los objetos que no están al alcance en el próximo pulso bajarían de brillo. El cubo y el objeto alcanzable serían lo más brillante en 120 px a la redonda. Se tocaría en el dibujo de los juegos (`journey-stick.js`, `journey-chain.js`).
   *Bien cuando:* en `01` y `02`, el brillo máximo dentro de 120 px del cubo es del cubo o del objeto alcanzable. Los demás quedan al menos un 40 % por debajo, medido sobre la captura.
5. **Una curva de intensidad en el anillo.** Sin tocar la música, que Faros o Ruinas sea un pico y la Cueva una calma antes de la victoria. Se haría con la meta de la ronda o con la densidad visual, por ejemplo con el `goal` de cada juego. La victoria quedaría separada de la última ★★ al menos un minuto.
   *Bien cuando:* en play-curve las duraciones de ronda del anillo varían al menos un 30 % entre la más corta y la más larga. Ningún perfil tiene dos novedades estructurales en el mismo minuto.

## Opinión en una frase

El Viaje tiene una curva emocional de verdad, pero el Mundo libre deja caer a quien acierta el 60 % justo en la cima: gana a los 40 minutos y pasa 80 sin oír crecer su canción.
