# Jenova Chen lee Kubono · tercera sesión, 24 de octubre (simulación)

*Simulación de su mirada de diseño (flow, curva emocional, atención). No es su opinión real. Base: `2-06-jenova-chen.md`, código de `main` alpha.167, capturas `3/` y propias en `3-extra-ck/`. Nadie ha jugado salvo Jay; nada de esto está oído en un teléfono.*

## Notas

| Área | Sesión 2 | Hoy | Por qué |
|---|---|---|---|
| Visual | 7 | 7,5 | La columna dorada cerca del portal es una imagen clara (`3-extra-ck/b-next-300.png`). De lejos no se ve. |
| Audio | 8,5 | 9 | Faro del siguiente portal desde el Refugio, lugares que cantan su patrón, canción que crece en la música del mundo. Sin escuchar. |
| Creatividad | 8 | 8,5 | La canción ya es la del mundo, no un house aparte. |
| Sensación | 7 | 7,5 | Calibración sin menú, oro siempre al acertar, Vibri. |
| Cohesión | 6 | 7 | Un camino en orden, «Siguiente · X», clímax a los ~36 min. |
| Pulido | 6 | 6,5 | El muro cayó; el paso del final al Mundo sigue ruidoso y el modelo se aprueba con trampa. |
| **Media** | **7,1** | **7,7** | |

## Qué mejoró de verdad

- **El muro de 6 ★ ya no existe.** El anillo se abre en orden (`src/places.js:47-50`). En el modelo, todos ganan entre 33 y 40 min. Antes el clímax llegaba a los ~130 min. Es el cambio más importante.
- **La montaña existe, de cerca.** Columna de luz sobre el siguiente portal (`src/places-ring.js:59`) y faro sonoro en el «3» audible desde el Refugio (`places-ring.js:12-14,69`). Es lo que pedí en sonido.
- **El tema crece:** ★ fragmento, ★★ capa, ★★★ variación. Mi tercera acción, hecha.
- **La tarjeta lleva al siguiente** (`places.js:104`).

## Qué sigue faltando o salió mal

1. **La columna no se ve «de lejos».** Solo se dibuja si el portal está a menos de una pantalla en horizontal (`places-ring.js:59`, `x>-60&&x<W+60`). A 1 500 px ya no está (`c-next-1500.png`). Desde el Refugio, a 6 000 px, queda la flecha de 10 px. El comentario de la línea 58 promete algo que el código no hace.
2. **El pico sigue cayendo en ruido.** Al terminar el Viaje: aviso «Se abre el Mundo libre» (`journey-finale.js:56`), aviso de ✦ (`:63`) y, a los 2 s, todos los logros guardados en el Viaje como aviso con la frase del narrador (`achievements.js:14`). Entre ellos «Era el prólogo. Sí, todo eso era el prólogo» (`narrator.js:70`). Eso contradice la decisión de Jay: narrador solo en la tarjeta y la Bitácora.
3. **El modelo play-curve, críticamente:**
   - **La regla de 12 min se cumple con la tienda.** `longest()` cuenta `compra` como novedad (`play-curve.mjs:47`) y la prueba solo exige esa regla (`tests/play-curve.mjs:9`). Sin compras, los jugadores del 60 y 75 % pasan **80–85 min sin que crezca su canción** tras ganar. Comprar una pieza no es una emoción nueva: el modelo se aprueba solo.
   - **No hay abandono.** El jugador repite 3 intentos × 6 vueltas a por un ★★ que nunca llega (`:38-42`). Una persona real se va antes. Mide tiempo, no ganas de seguir.
   - **No hay intensidad.** Un «lugar» del Jardín pesa lo mismo que la victoria. No ve el valle tras los créditos.
   - **Falta la calibración.** H2 sube el «a tiempo» de quien tiene retraso; el modelo usa un porcentaje fijo con ±5 % y práctica hasta +6 % (`:15,27`). El umbral se decide sobre un número que la calibración mueve.
   - **Caminar cuesta siempre 24 s** (`WALK=.4`). El primer viaje del Refugio al Jardín son 6 000 px a 190 px/s, guiado solo por una flecha pequeña. Tampoco hay perfil sin sonido, que nunca gana ★★ (`places.js:25`).

## Tres acciones

1. **Que el modelo diga la verdad.**
   - *Qué y dónde:* `scripts/play-curve.mjs` y `tests/play-curve.mjs`.
   - *Cómo:* quitar `compra` de la regla de 12 min. Añadir abandono: tras 3 rondas seguidas sin estrella nueva, el jugador para. Añadir un perfil sin sonido y uno al 60 % con +120 ms antes de calibrar. Sacar por minuto una intensidad 0–4 y marcar el valle tras los créditos.
   - *Bien cuando:* la prueba falla hoy con ★★ al 85 % y pasa con la regla que Jay elija. Después se compara con dos sesiones de Luca (`?prueba=1`).
2. **★★ que se adapta a la persona.**
   - *Dónde:* `roundStars` en `src/places.js:25`, con `best` ya guardado (`:30`).
   - *Cómo:* ★★ al 75 %, o al superar tu mejor marca del lugar en 10 puntos tras tres rondas, con suelo del 60 %.
   - *Bien cuando:* en el modelo corregido ningún perfil pasa más de 12 min sin que crezca la canción en la primera hora tras ganar.
3. **Proteger el pico.**
   - *Dónde:* `journey-finale.js:56,63` y `achievements.js:14`.
   - *Cómo:* sin avisos hasta entrar en el primer portal. Los logros del Viaje se dicen en la primera tarjeta de ronda, como manda H5. La columna se ve en el borde de la pantalla, en la dirección del portal, cuando está lejos.
   - *Bien cuando:* de los créditos al Jardín no aparece ningún texto. 4 de 5 personas entran en menos de 90 s.

## Decisiones de Jay

- **Umbral de ★★:** mejorar tu marca, con 75 % como camino fijo. El 85 % es un umbral fijo: lo contrario del flow. El propio modelo lo dice: con 85 %, el jugador medio pierde hora y media de canción. Mejor decidir tras ver a Luca con la calibración puesta.
- **Festival:** sí, solo el Viaje. Pero `?festival=1` hoy son Camino, Llanura y Lago (`festival.js:5`), unos 7 min sin la Tormenta ni el Vacío. Sin pico ni valle no hay curva. Si el jurado tiene 15 min, el Viaje entero.
