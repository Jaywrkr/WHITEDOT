# 2-08 · Ken Wong, segunda lectura (24 oct)

> Simulación respetuosa basada en su trayectoria pública (ver `08-ken-wong.md`). No es su opinión real. Sin citas.

Capturas propias en `panel/rw/`, con un navegador que no se anuncia como automatizado (390×844 y 1280×800).

## Qué mejoró desde el 22 de octubre

- **El primer fotograma ya no es un formulario.** Partida nueva real (`rw/m-new-01s.png`): negro, el cubo, dos cristales, «Pulso». Sin cuenta ni ventana. Era mi primer cambio.
- **El Viaje es la obra.** Camino, cinco capítulos y un final en el Refugio con créditos (`journey-finale.js`). Tiene principio y fin.
- **Hay láminas.** Ruinas (`14`, `rw/d-ruinas.png`) es un anillo de ocho columnas: se colgaría. Cristales (`12`) y Faros (`13`) tienen una idea gráfica clara.
- **Cada lugar, un verbo con su sentimiento.** Rodear, soltar, guiar barcos al puerto. Es el método de *Florence*.
- **El ritmo se ve antes de entenderse.** La barra late si no tocas (F12) y los ocho puntos marcan el compás (F14).
- **Gesto con peso.** `navigator.vibrate` existe ya (`journey-pulse.js:38`).

## Qué sigue mal

- **El cubo es una mota.** Mide unos 10 px en 390×844 y en 1280×800 (`rw/d-new-04s.png`). El protagonista se pierde en su propia lámina. Pedí ≥ 48 px.
- **El inicio depende de quién mire.** Con navegador automatizado sale el juego viejo (`00-inicio.png`): HUD de cifras y ventana «Rompe diez para entrar al Mundo» (`journey-mode.js:7` → `'libre'`). Las capturas del propio equipo enseñan la pantalla que ya no existe.
- **Los lugares no se leen a un brazo.** En `10`–`15` todo es gris: lo que se toca, lo que suena y el decorado pesan igual. Glifos de 10 px por todas partes. Un disco gris junto al cubo sin función evidente.
- **Las instrucciones vuelven como rótulos.** Dos por capítulo (`sayOnce`/`chapterToast`), la misma fórmula once veces.
- **La estructura vuelve a decir «quédate».** Hoja Lugares (`21`): una tabla con «Sin visitar» junto a una ★ ganada, dos botones blancos que compiten («Remezcla», «Salir al anillo»), remezcla diaria y 33 ★. Pedí siete lugares pulidos: hay once y una economía.
- **El anillo no se ve.** En `20` y `rw/d-anillo.png` las 11 puertas doradas quedan fuera del encuadre.

**Un jurado, primeros 60 segundos hoy (móvil, sin automatización):**
1. 0:00 · Negro. Una línea fina arriba, una regla abajo, un botón ≡. Un punto blanco diminuto.
2. 0:02 · Dos cristales y la palabra «Pulso». Entiende: tocar algo.
3. 0:05 · Si no toca, la barra de arriba late. Lo nota si mira arriba; el cubo está en el centro.
4. 0:10 · Toca. Suena una nota. Bien. ¿Dónde está el cubo? Hay que buscarlo.
5. 0:20 · Arrastra a un cristal; el pulso a tiempo lo rompe con vibración.
6. 0:30 · La línea superior avanza un décimo. No sabe qué mide.
7. 0:45 · Aparece un gran círculo tenue (`rw/m-new-15s.png`). Aún negro, aún gris.
8. 0:60 · Calma y buen gusto, pero ninguna imagen que recordar ni enseñar a otro.

## Notas

| Eje | 22 oct | Hoy | Por qué |
|---|---|---|---|
| Visual | 6,5 | 7 | Ruinas y Cristales son láminas; el Camino y el Mundo siguen vacíos. |
| Audio | 7,5 | 7,5 | No puedo oírlo; el ritmo ya se ve (Línea, puntos). |
| Creatividad | 8 | 8 | Once verbos con sentimiento; falta un momento firma visible en captura. |
| Sensación | 5,5 | 6,5 | Pulso a tiempo, sin castigo, con vibración; el cubo minúsculo no transmite peso. |
| Cohesión | 5 | 6,5 | Viaje con arco; después, 33 ★, remezcla y tienda compiten con él. |
| Pulido | 6 | 7 | Sin cuenta y sin texto al entrar; tabla incoherente e inicio doble. |
| **Media** | **6,4** | **7,1** | |

## Mis 3 acciones

1. **Un protagonista que se vea.**
   - Qué: el cubo mide ≥ 32 px en teléfono y ≥ 40 px en escritorio en el Viaje y en los lugares.
   - Cómo: subir el zoom de cámara del Viaje en `worldCamera` (`journey-games.js`) y en `render.js`, no el tamaño del cubo en el mundo, para no tocar distancias ni semillas. Glifos de decorado ≥ 16 px y al 30 %; lo que se toca con contorno blanco; lo que suena late.
   - Criterio: en `390×844`, el cubo se señala en < 1 s por alguien que no lo ha visto; capturas `10`–`15` con tres pesos distinguibles en gris.
2. **Un solo primer fotograma.**
   - Qué: lo que ve un jurado, una captura o un humano es lo mismo.
   - Cómo: en `journey-mode.js`, que `automated` no cambie el modo por defecto si la URL no lo pide (las pruebas que necesiten el Mundo libre lo piden con un parámetro). Reescribir o retirar `#mHelpC` en `index.html`. En el Camino, que cada cristal haga crecer la luz y que al décimo se abra la Llanura con su color y el título, como dice `docs/VIAJE.md`.
   - Criterio: `capture.py` con y sin `webdriver` produce el mismo `00-inicio.png`; a los 60 s hay una imagen distinta de la de los 0 s.
3. **La hoja Lugares como dibujo, no como tabla.**
   - Qué: el anillo de «Tu canción» (`22`) es el mapa; que sirva también para elegir lugar.
   - Cómo: en `refugio-lugares.js`, dibujar con `drawSongRings` (`song-stage.js`): anillo lleno si tiene trofeo, tres puntos por estrellas, candado con la cifra si está cerrado. Quitar «Sin visitar» cuando hay ★. Un solo botón blanco: el lugar sugerido. «Remezcla» como entrada secundaria.
   - Criterio: Luca elige su siguiente lugar sin leer; la hoja no muestra ninguna contradicción entre ★ y estado.

## Decisión de Jay

¿Qué ve el jurado del festival? Recomiendo `?festival=1` solo con el Viaje y sus créditos, sin 33 ★, remezcla ni tienda. Los once lugares, después.
