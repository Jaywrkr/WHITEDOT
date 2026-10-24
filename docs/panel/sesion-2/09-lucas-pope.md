# 2-09 · Lucas Pope (simulación) · segunda sesión, 24 de octubre

> Simulación respetuosa de su filosofía conocida (un verbo, legibilidad, sistemas contables, recortar). No es su opinión ni contiene citas suyas. Principios y fuentes: `09-lucas-pope.md`.

## Qué mejoró desde el 22 de octubre

- **Hay un verbo y un juez.** `src/journey-pulse.js` decide todo con una ventana única: `ON_TIME=.08`. Lo usan el Viaje, los lugares, los rituales y la chispa salvaje. Fuera de tiempo no pasa nada. Es el sello sin castigo que acordamos.
- **La verificación se ve.** La Línea marca un pico dorado si aciertas y uno blanco si fallas (`draw()` en `journey-pulse.js`). Los ocho puntos bajo el cubo enseñan qué corcheas cuentan (capturas 01, 02, 12, 15).
- **Hay un final contable.** 11 lugares × 3 ★ = 33. Con las 33 se gana (`song-stage.js`, `check()`). Es el número fijo de destinos que pedí.
- **Los anillos de «Tu canción» se leen sin texto.** Lleno = ganado; discontinuo = falta (captura 22). Es la mejor pantalla nueva.
- **Se entra sin cuenta.** `?festival=1` y el guardado local lo resuelven.

## ¿Once verbos traicionan «un solo verbo»?

No, si se leen bien. La entrada es siempre la misma: tocar a tiempo (y arrastrar para moverte). Lo que cambia es **la regla del día**: qué corcheas cuentan (`journey-rhythm.js`) y qué forma tiene la meta. *Papers, Please* hacía eso: el mismo sello, una regla nueva cada jornada. Cumple.

Pero hay tres grietas:
- Los nombres son ficción y el contenido real es el ritmo. Hay 7 patrones y 11 nombres. El jugador aprende 11 historias para 7 reglas.
- En el Mundo libre tocar fuera de tiempo **sí** paga chispas (`docs/MUNDO.md`, regla 1). Es el único sitio donde el juez calla. Enseña lo contrario del Viaje.
- La hoja «Lugares» (captura 21) no dice el ritmo de cada lugar. El libro de cuentas no anota la regla.

## Qué sigue mal o es nuevo

- **La primera pantalla miente.** Partida nueva sin parámetros (captura 00): ventana «Rompe diez para entrar al Mundo», «DÍA 1», «Era I · Pixel», «0 chispas», «Rompe cristales · 0 / 10». `docs/VIAJE.md` dice «sin ventana de bienvenida, HUD sin cifras» y «sin monedas en el Viaje». El texto vive en `index.html:54` y `:195-198`.
- **El libro se contradice.** Llanura tiene ★ y dice «Sin visitar» (captura 21; `refugio-lugares.js:58`, la ★ vino del Viaje pero `d.seen` está vacío). Dos botones blancos primarios a la vez: «Remezcla» y «Salir al anillo».
- **Más sistemas, no menos.** Había 269 módulos en `src/`; hoy hay 311. Entraron 44 y salieron 2. Además de los lugares llegaron superbiomas (4 módulos), llaves del tema (`theme-key.js`), remezcla diaria, chispa salvaje y narrador. Pedí congelar.
- **Contadores hoy:** chispas ✦, estrellas ★, récord %, llaves, logros (376 + 23 + narrador), 81 piezas de tienda, trofeos, día, metros, era. Diez cifras para un verbo. Solo ★ sirve al verbo.
- **El menú sigue largo.** `mMenu` tiene 17 entradas: Grabar set, Viajar a otra semilla, Compartir, Volver al salto… Las que propuse ocultar siguen ahí.
- **Legibilidad en el lugar.** En Llanura (captura 01) los discos grises con «+» y «◇» parecen botones de interfaz. En la Cueva (15) hay glifos grises sin función junto a los zócalos. El ojo no sabe qué tres cosas mirar.
- **Nadie salvo Jay lo ha jugado.** Las duraciones son de bots. No puedo puntuar Sensación por encima de lo que se ha medido.

## Notas

| Criterio | 22 oct | 24 oct | Por qué |
|---|---|---|---|
| Visual | 6,5 | 7 | Cada lugar tiene forma propia (triángulos, zócalos, barcos); los discos de Llanura siguen ensuciando. |
| Audio | 8 | 8 | El juez se oye: nota del tema al acertar, nada al fallar. Sin cambio de fondo. |
| Creatividad | 7,5 | 8 | Siete ritmos como «regla del día» y la Cueva que te canta: diseño de verdad. |
| Sensación | 5,5 | 7 | Ventana única, Línea y vibración. Tope: nadie nuevo lo ha probado. |
| Cohesión | 4,5 | 5,5 | El verbo se unificó; la economía creció a su alrededor. |
| Pulido | 6 | 6 | Primera pantalla antigua y una hoja que se contradice. |

Media: **6,9** (antes 6,3).

## Mis 3 acciones prioritarias

1. **Que la primera pantalla sea el Viaje.**
   - Qué: partida nueva sin parámetros entra al Camino en modo «Viaje», sin ventana ni cifras.
   - Cómo: retirar el texto «Rompe diez…» de `index.html` (54, 195-198) y de `onboarding.js:12` para el Viaje. Ocultar día, era, metros y chispas mientras `journeyQuiet()`.
   - Criterio: prueba de navegador con almacenamiento vacío. Ninguna cifra visible hasta el final del Viaje. Primera nota en menos de 10 s.

2. **La hoja «Lugares» como libro de cuentas.**
   - Qué: una sola pantalla que responde qué tengo, qué falta y qué regla pide cada lugar.
   - Cómo: en `refugio-lugares.js`, añadir a cada fila el patrón de ocho puntos de `journey-rhythm.js` (dorado el «1»). Cambiar «Sin visitar» por «Viaje» si la ★ vino del Viaje. Un solo botón primario.
   - Criterio: ninguna fila contradictoria (prueba de lógica). Un desconocido dice el ritmo de tres lugares mirando solo la hoja.

3. **Congelar y recortar.**
   - Qué: ni un sistema nuevo hasta F19 con personas. Menú de 6 entradas: Mundo, Refugio, Lugares, Tu cubo, Sonido, Ajustes.
   - Cómo: mover a «Herramientas» Grabar set, Viajar a otra semilla, Compartir y Volver al salto. Llaves y superbiomas, dentro de la Bitácora. En el Mundo libre, fuera de tiempo da 0 ✦ (no ×1).
   - Criterio: en el Mundo libre, como mucho dos cifras en pantalla (★ y ✦). `scripts/spark-economy.mjs` sigue cuadrando. Ningún guardado pierde nada.

## Decisión que solo Jay puede tomar

¿La economía (chispas, tienda, logros del narrador, llaves) es parte del juego que se gana, o un post-juego que aparece tras las 33 ★? Si es post-juego, el build que juzga un festival es Viaje + 11 lugares, y todo lo demás espera. Yo elegiría post-juego. Las frases del narrador siguen sin su aprobación.
