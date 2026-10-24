# 3-08 · Ken Wong, tercera lectura (24 oct, tarde)

> Simulación basada en su trayectoria pública. No es su opinión real. Base: `2-08-ken-wong.md`, capturas `3/` y propias en `3-extra-ck/` (390×844, navegador sin marca de automatización), código de `main` alpha.167. No he oído nada.

## Notas

| Eje | Sesión 2 | Hoy | Por qué |
|---|---|---|---|
| Visual | 7 | 7,5 | El cubo ya se ve en el mundo y la columna dorada es una imagen. Camino y lugares, igual. |
| Audio | 7,5 | 8 | El sonido ya orienta: faro desde el Refugio, chispa con paneo. Sin escuchar. |
| Creatividad | 8 | 8 | La columna es casi un momento firma; falta verla desde lejos. |
| Sensación | 6,5 | 7 | Oro al acertar también con vibración; cubo con peso. |
| Cohesión | 6,5 | 7 | Un camino en orden y una tarjeta que dice «Siguiente». |
| Pulido | 7 | 7 | Arreglado el inicio y «Sin visitar». La hoja sigue siendo una tabla y el menú sigue igual. |
| **Media** | **7,1** | **7,4** | |

## Qué mejoró respecto a lo que pedí

- **Un solo primer fotograma.** `3/00-inicio.png` es la entrada real: negro, cubo, dos cristales, «Pulso». Era mi segunda acción. Hecha.
- **El cubo se ve en el mundo.** Se dibuja 1,6×, entre 16 y 30 px (`src/render.js:185-186`). En capítulos y lugares mide unos 22 px (`3/01`, `3/10`, `3/20`). Antes eran 10.
- **La contradicción de Lugares desapareció** (`src/refugio-lugares.js:59`; `3/21`).
- **La columna dorada** sobre el portal siguiente (`src/places-ring.js:59`). En `3-extra-ck/b-next-300.png` se lee sin texto: luz, portal y tres estrellas. Es la mejor imagen del juego tras Ruinas.
- **El color ganado se nota** como halo del lugar alrededor del cubo (`3/20`, `3/23`). Ojo: es un degradado radial (`world-sheet.js:34`), no un tinte de todo el lienzo. En los bordes queda al ~6 %.

## Qué sigue mal

- **El Camino conserva la mota.** `cubeView` solo actúa si `inWorld()` (`render.js:111`). En el Camino `inWorld()` es falso (lo comprobé). El cubo mide **6 px** en `3/00-inicio.png` y en `3-extra-ck/a-camino-60s.png`. Lo primero que ve el jurado sigue siendo una mota.
- **Llega a 22 px, no a 32.** Pedí ≥ 32 px en teléfono y se quedó en un tope de 30 px. Además se agrandó el cubo, no la cámara: los glifos del decorado siguen en ~10 px.
- **Los lugares no se leen a un brazo.** `3/10` (Jardín) y `3/14` (Ruinas) son iguales que en la sesión 2. Todo es gris y punteado. Lo que se toca no tiene contorno blanco y lo que suena no late. No hay tres pesos.
- **La columna solo se ve de cerca.** Solo se dibuja con el portal casi en pantalla (`places-ring.js:59`). A 1 500 px ya no está (`c-next-1500.png`): queda una flecha dorada de ~20 px pegada a la Línea, que compite con ella. Desde el Refugio, a 6 000 px, no hay montaña que mirar.
- **El disco gris sin explicación.** En todas las capturas hay un círculo gris a la derecha del cubo. Parece el mando táctil (`a-camino-60s.png` muestra su línea). En el primer fotograma no dice qué es.
- **La hoja Lugares sigue siendo una tabla** (`3/21`). Tiene cuatro botones y el blanco es «Salir al anillo», no el lugar sugerido. «Siguiente: Jardín.» es texto, no se puede tocar. La remezcla diaria ocupa el centro. El anillo de `3/22` existe, pero en otra pantalla.

## Mis 3 acciones

1. **Cubo legible también en el Viaje.**
   - *Dónde:* `src/render.js:111` y `:186`.
   - *Cómo:* aplicar `cubeView` también en el modo `camino` y subir el rango a 24–36 px en teléfono. Glifos del decorado a ≥ 16 px y al 30 %; lo que se toca, con contorno blanco.
   - *Bien cuando:* en `00-inicio` el cubo mide ≥ 24 px y en `10`–`15` hay tres pesos de gris distinguibles.
2. **La columna, de lejos.**
   - *Dónde:* `src/places-ring.js:57-61`.
   - *Cómo:* si el portal está fuera de pantalla, la columna sube desde el borde, en su dirección, sustituyendo la flecha. Cuanto más cerca, más fina y brillante. La columna no debe tocar la Línea.
   - *Bien cuando:* la captura desde la puerta del Refugio muestra la banda dorada. Alguien que no ha jugado señala hacia dónde ir en < 2 s.
3. **Lugares como dibujo.**
   - *Dónde:* `src/refugio-lugares.js:55-64`, con el dibujo de anillos de `song-stage.js`.
   - *Cómo:* el anillo de `22` sirve de mapa. Se toca un lugar para ir. Un solo botón blanco: «Siguiente · Jardín» (`ringGo`). La remezcla, como entrada secundaria y pequeña.
   - *Bien cuando:* la hoja tiene dos botones como mucho y Luca elige su siguiente lugar sin leer.

## Decisiones de Jay

- **Umbral de ★★:** 75 %, una cifra fija. «Mejorar tu marca» es justo, pero no se lee: el jugador no sabe cuál es su marca ni cuánto le falta. Si se elige, la tarjeta debe dibujarla: una marca en la barra con tu récord.
- **Festival:** solo el Viaje, sin anillo, tienda ni remezcla. Para un jurado con poco tiempo, el corte actual (`festival.js:5`: Camino, Llanura y Lago, unos 7 min) es buena primera impresión. Siempre que el cubo del Camino deje de ser una mota antes de enviarlo.
