# 06 · Jenova Chen — sesión 11
> Simulación de su mirada de diseño a partir de su obra pública. No es su opinión real. Revisó alpha.215 (`5464612`): entrada y Camino (`00-inicio`), los cinco capítulos, guía, menú y Lugares en viaje y libre, anillo, Tu canción, resultado; `journey-hint.js`, `bar-beat-hint.js`, `onboarding.js`, `journey-finale.js`, `journey-mode.js`, `canvas.js`, `progress.js`; `node scripts/play-curve.mjs`. Sin navegador, sin oído, sin manos.

## Notas (puntuación ciega)
| Eje | Nota | Evidencia y alcance |
|---|---|---|
| Visual | 7 | Entrada limpia: negro, cubo, dos cristales, una senda (`00-inicio`). El Lago se llena de anillos del mismo peso que el cubo (`02-capitulo-lago`). |
| Audio | — | No lo oí. El código promete que la música crece con la barra (`journey-stick.js:63`) y que tu frase vuelve en el cierre (`journey-finale.js:24`). No puntúo lo que no escuché. |
| Creatividad | 8 | Un verbo nuevo por capítulo y tu frase como cierre del Viaje. Tu canción con capas que crecen (`22-cancion`). |
| Sensación | 6,5 | Un solo reloj para luz y nota (`journey-hint.js:22`). Sin teléfono ni latencia medida: es lectura de código. |
| Cohesión | 7 | El Viaje tiene un arco claro. El paso al Mundo libre cambia la regla del toque sin decirlo y repite el mensaje del cierre. |
| Pulido | 6,5 | Avisos duplicados en el cierre, el reinicio diario del Camino y la guía del Viaje con versión vieja. |

## Lo que funciona hoy
1. **Los primeros segundos callan bien.** El Viaje abre sin ventana (`src/main.js:263-264`) y sin saludo (`src/return-entrance.js:11`). La pantalla tiene un 1,8 % de píxeles encendidos (`00-inicio`, medido). A los 4 s aparece el dedo fantasma junto al cubo (`src/journey-hint.js:5-7`). A los 5 s late la barra (`src/bar-beat-hint.js:6`). Se ve el golpe antes de entenderlo.
2. **Un solo destino a la vista.** El menú tiene un botón blanco: «Seguir hacia Jardín» (`menus/tel-viaje-menu`). El anillo solo rotula «Jardín · 600 m» (`20-anillo`). La guía dice «Tu siguiente paso» (`menus/tel-viaje-guia`).
3. **Tras la victoria no se pierde el norte.** El objetivo apunta a la ★ más cercana (`src/places.js:72-73`). «Explora a tu ritmo» solo llega con 33 ★.
4. **El Viaje cumple el ritmo de novedades.** Hay un capítulo cada 2–3 min hasta el minuto 16,5. Después, un lugar nuevo cada 2,3–5,7 min hasta el 33–40 (eventos de `scripts/play-curve.mjs`).
5. **El cubo es lo más brillante a su alrededor.** Entre 30 y 120 px del cubo hay 1 píxel con luz > 150 en Lago y 0 en Bosque y Vacío (medido). Ningún capítulo supera el 11 % encendido.
6. **La tarjeta invita a otro intento.** Muestra «A 0,4 de ★★» y «Otra vez» junto a «Seguir», sin logros (`33-resultado`).

## Lo que falta o salió mal
1. **Alta · Cada día nuevo devuelve al Camino.** Al cargar, `checkDay(true)` vacía `pathCrystals` y saca del Mundo (`src/progress.js:63-64`, `src/main.js:251`). Entrar exige otra vez diez cristales (`src/ui.js:51`). Le pasa también a quien iba por el Bosque. En el Viaje no lo explica nada: la pista se oculta (`styles/estilo-j.css:541`) y el aviso se calla (`src/ui.js:42-43`). La segunda sesión empieza repitiendo el tutorial. Es lectura de código; no lo probé en navegador.
2. **Media · La novedad que sostiene al jugador del 60 % no se ve.** Del minuto 39,9 al 120, sus únicas novedades son 13 «crece» (play-curve). Su ★ se queda en 11/33 durante 80 min. La tarjeta no nombra el crecimiento: solo dice «récord» (`src/places.js:166`). Una novedad que no se percibe no renueva la atención.
3. **Media · El paso al Mundo libre habla tres veces.** Primero «Tu mundo se abrió» (`src/journey-finale.js:18`). Luego el aviso «Se abre el Mundo libre.» (`:82`). Después el logro «Prólogo» (`src/narrator.js:96`), cuya voz dice «Sí, todo eso era el prólogo» (`:70`). A la vez aparecen dos marcas nuevas y el HUD (`journey-finale.js:87-94`). La ironía rompe la calma del pico. El botón cambia de nombre: «Seguir explorando» y luego «Explorar a pie» (`:68`, `:96`).
4. **Media · La regla del toque cambia en la frontera sin decirlo.** Tocar donde sea solo vale con el Viaje sin terminar o en ronda (`src/canvas.js:27`). Fuera de las rondas del Mundo libre, el toque es otro. D2 no se reabre. Pero quince minutos de hábito se rompen en silencio.
5. **Baja · El clímax no se ve más alto.** La Tormenta (`04`) y la Llanura (`01`) tienen casi el mismo encendido: 10,3 % y 10,5 %. Ambas siguen grises. La subida sigue siendo solo de oído.
6. **Baja · Novedades amontonadas.** En los cuatro perfiles, el undécimo lugar y la victoria caen en el mismo minuto. Al 90 %, el lugar, su ★★ y la victoria coinciden en el 32,94 (play-curve). Las rondas del anillo siguen entre 2,2 y 2,55 min (`scripts/play-curve.mjs:17`).
7. **Baja · La guía del Viaje está desfasada.** Dice «Candidato alpha.207» (`docs/VIAJE.md:3`).

## Contraste con la sesión 10
**Cerrado.**
- El 60 % ya no cae por el acantilado. Cumple la regla de 12 min hasta el 120, con un hueco máximo de 8,9 min (P6). Lo comprobé en play-curve. Ojo: el modelo cambió su supuesto de reintentos. Con el anterior quedaba en 12,2 min (`CAMBIOS.md`, P6).
- Hay objetivo después de ganar (P4, `places.js:72-73`).
- La tarjeta ya no muestra logros (P4, `33-resultado`).
- El entorno deja sitio al cubo en Lago y Llanura (P7, medida del punto 5).

**A medias.**
- La canción del 60 % ya no suena a fragmentos sueltos: cada capa toca ≈ 62 %, pero aún no entera (`src/song.js:43-45`).

**Abierto.**
- El anillo sigue siendo una escalera plana, y la victoria sigue pegada a la última novedad (punto 6).
- El clímax visual de la Tormenta (punto 5).

**Nuevo para mí (no lo causan P1–P8).**
- El reinicio diario del Camino (punto 1).
- El triple mensaje del cierre (punto 3).
- El cambio de regla del toque (punto 4).
- El «crece» invisible (punto 2) sí nace de P6: el modelo lo cuenta, pero la pantalla no.

Diferencia con la sesión 10: Cohesión 7,5 → 7 y Pulido 7 → 6,5, por el paso al Mundo libre. Audio 7,5 → abstención, porque no lo oí.

## Qué haría ahora
1. **Que volver no sea empezar.** Si el Viaje empezó o el Mundo ya se abrió, el día nuevo no saca del Mundo ni vacía la entrada. Se tocaría `src/progress.js:63-64`, `src/main.js:251` y la condición de `src/ui.js:51`.
   *Bien cuando:* un guardado en el Bosque con `todayKey` de ayer carga en el Bosque, sin pasar por el Camino. Lo comprueban una prueba de Node y un recorrido de navegador. Un jugador nuevo sigue empezando en el Camino.
2. **Nombrar el crecimiento.** Una línea en la tarjeta cuando la capa crece, por ejemplo «Tu capa de Lago creció». No sale en ninguna otra ronda. Se tocaría `src/places.js:166`, con `growthSteps` (`src/song.js:43`).
   *Bien cuando:* en play-curve, cada «crece» corresponde a una tarjeta con esa línea, y ninguna ronda sin crecimiento la muestra.
3. **Un solo mensaje en la frontera.** Quitar el aviso «Se abre el Mundo libre.» (`journey-finale.js:82`). Llevar «Prólogo» a la Bitácora sin aviso. Usar un nombre para el botón.
   *Bien cuando:* en los 10 s que siguen a los créditos aparece como mucho un texto, además del rótulo del anillo. Una prueba cuenta los avisos de la cola.
4. **Contar una vez que el toque cambia.** El primer toque en el Mundo libre fuera de ronda muestra el dedo fantasma con el gesto nuevo, una sola vez, sin texto o con menos de 8 palabras. Se tocaría `src/journey-hint.js` (`where`) con una marca en el guardado.
   *Bien cuando:* se muestra en la primera sesión libre y nunca después. Un guardado que ya pasó por el Mundo libre no lo ve.
5. **Corregir la cabecera de `docs/VIAJE.md`** para que diga la versión vigente.
   *Bien cuando:* `release-audit` o un `grep` no encuentran versiones viejas en las cabeceras de las guías.
