# Tercera sesión · Masaya Matsuura (simulación)

> Simulación de su mirada de diseño (ritmo, una línea, acierto sin castigo) a partir de su obra pública. No es su opinión real. Versión: 2.3.0-alpha.167. Solo Jay ha jugado. Nadie lo oyó en un teléfono.

Revisé `3/`, mis capturas en `3-extra-mz/` (Tormenta y Ruinas, 17 aciertos) y `journey-pulse.js`, `journey-rhythm.js`, `rhythm-calibration.js`, `places.js`.

## 1. Notas

| Eje | Nota | Por qué |
|---|---|---|
| Visual | 7,5 | Ya no hay puntos bajo el cubo. La Línea sigue fija y diminuta. |
| Audio | 8,5 | El lugar canta su patrón antes de pedirlo. Es PaRappa. |
| Creatividad | 8,5 | Vibri existe. La Línea no inventa nada nuevo. |
| Sensación | 7,5 | Calibración y cuerpo que responde. Falta leer lo que viene. |
| Cohesión | 7,5 | 0 ✦ fuera de tiempo: el verbo es el mismo en todo el juego. |
| Pulido | 7 | La hoja Lugares ya no se contradice. El juicio sigue siendo un número. |
| **Media** | **7,8 (7,6)** | |

## 2. Qué mejoró de verdad

- **Una guía, no tres.** «no dots under the cube» (`src/journey-rhythm.js:48-50`). Los pasos que cuentan se levantan en la Línea y el «1» va en dorado (`src/journey-pulse.js:91-92`).
- **Calibrar sin menú.** Lo que pedí, casi literal: 12 pulsos, mediana, se guarda, limitado (`src/rhythm-calibration.js:6-19`). La prueba del bot +150 ms pasa. Toques al azar no lo mueven (`tests/rhythm-calibration.mjs`).
- **El lugar canta primero.** Dos compases de clic y nota en los pasos que cuentan (`journey-rhythm.js:54-55`). La Línea brilla con ellos. Llamada y respuesta en todos los lugares, no solo en la Cueva.
- **Vibri.** Un fallo baja un nivel y no reinicia (`journey-pulse.js:15`). En `tormenta-hit17-60ms.png` el cubo con doble marco dorado dice «vas bien» sin texto.
- **El Mundo libre ya no desenseña.** Fuera de tiempo, 0 ✦. Mi duda de la sesión 2 queda resuelta.
- **La hoja Lugares** pone «Cerrado» o «Sin visitar» sin ★ (`21-lugares.png`).

## 3. Qué sigue faltando o salió mal

- **La Línea no anticipa.** Es el mismo compás fijo con un cursor que lo recorre (`journey-pulse.js:92-93`). Pedí que los pasos vinieran hacia ti. Hoy el «1 · 2y · 3 · 4» de las Ruinas se lee solo si lo oíste antes. El canto de dos compases ayuda, pero después no hay nada que leer.
- **La Línea es casi invisible.** Los pasos que cuentan miden 2 × 6 px a un 55 % de opacidad (`journey-pulse.js:92`). En `ruinas-0-start.png` cuesta distinguir los cuatro pasos de los otros doce.
- **Los puntos de capítulo siguen junto a la Línea** (cinco puntos dorados a la derecha en 01–23). Pedí moverlos arriba.
- **Vibri no baila.** Nivel 2 casi quieto; nivel 3 gira con `t/900` (`journey-pulse.js:100`), no con el compás. Pedí aristas que vibren al tiempo.
- **El juicio sigue siendo un número.** «Ritmo: 73 % a tiempo (85 %)» (`src/places.js:98`). La forma máxima de Vibri no sale en la tarjeta.
- **Texto al entrar.** Ruinas muestra «Junto a una columna, toca el patrón: pon una piedra» encima del canto (`ruinas-0-start.png`). Es la primera vez, como decidió Jay, pero tapa el momento de escuchar.
- **Calibración frágil en lugares densos.** En Jardín y Cueva cuentan las ocho corcheas. Con 150 ms de retraso a 96 BPM el toque queda casi a medio camino entre dos pasos (`journey-pulse.js:68` toma el más cercano). «Medir otra vez» ahí puede dar un valor falso. No lo verifiqué con un bot.

## 4. Mis tres acciones

**1. La Línea que anticipa (pendiente desde la sesión 2).**
- Dónde: `src/journey-pulse.js`, `draw`.
- Cómo: cursor fijo al 25 %. Cada paso de los dos compases siguientes se dibuja en `x = cursor + (t − oído) / dosCompases · ancho`, 3 × 10 px, el «1» dorado. Los aciertos salen por la izquierda. Puntos de capítulo arriba. Con movimiento reducido, quieta como hoy.
- Bien cuando: tres personas nuevas, sin sonido, superan el 70 % en la Tormenta al primer intento.

**2. El juicio con el cuerpo.**
- Dónde: `src/places.js:98` y `journey-pulse.js:97-101`.
- Cómo: guardar la forma máxima de la ronda; la tarjeta la dibuja grande y el porcentaje queda en letra pequeña. El nivel 2 late en cada tiempo y el 3 gira un cuarto por tiempo.
- Bien cuando: en un vídeo mudo de 10 s, 4 de 5 observadores saben si el jugador va bien.

**3. Calibrar solo sobre negras.**
- Dónde: `journey-pulse.js:68`, `src/rhythm-calibration.js`.
- Cómo: tomar muestra solo cuando el paso objetivo es un tiempo (0, 4, 8, 12), y no durante el canto. Volver a medir si cambia `outputLatency`.
- Bien cuando: un bot +150 ms en la Cueva sube de < 30 % a > 95 %.

## 5. Decisiones de Jay

- **★★:** «mejorar tu marca», con un suelo del 70 %. PaRappa te dejaba repetir hasta ser «Cool»: compites contigo. El 85 % fijo castiga a quien tiene auriculares raros. Si Jay prefiere un número, 75 %: el modelo da 28 ★ en 2 h al 75 % y nunca 11 min sin capa (`scripts/play-curve.mjs`). Cambiar también «Ochenta y cinco por ciento» del narrador (`src/narrator.js:49`).
- **Festival:** solo el Viaje, sí. Un jurado tiene 15 minutos. `?festival=1` ya existe (`src/festival.js`). Que termine en el Lago con la Línea clara vale más que enseñar 11 lugares.
