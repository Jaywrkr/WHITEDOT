# 3-09 · Lucas Pope (simulación), tercera sesión, 24 oct tarde

> Simulación de su mirada de diseño a partir de su obra pública (un verbo, reglas legibles, cuentas que cuadran, recortar). No es su opinión real. Sin citas.

Conté yo: `ls src | wc -l` = **312** (311 en la sesión 2). Capturas propias en `3-extra-rp/` (anillo, Mundo libre y menú abierto).

## Notas

| Criterio | Sesión 2 | Hoy | Por qué |
|---|---|---|---|
| Visual | 7 | 7 | Los discos con «+» y «◇» de la Llanura siguen pareciendo botones (captura 01). |
| Audio | 8 | 8 | Portales y chispa con paneo: buena idea, sin oír en un teléfono. |
| Creatividad | 8 | 8 | Sin sistemas nuevos. Correcto. |
| Sensación | 7 | 7 | Calibración y Vibri, medidos con bots. Nadie nuevo lo ha probado. |
| Cohesión | 5,5 | 6,5 | El juez manda en todas partes y el camino tiene orden. |
| Pulido | 6 | 6,5 | La hoja ya no se contradice. El menú y la tarjeta, no. |
| **Media** | **6,9** | **7,2** | |

## Qué mejoró de verdad

- **Un solo juez, también en el Mundo libre.** `rhythmMultiplier` da 0 fuera de tiempo (`src/spark-rules.js:6`). Era mi acción 3.
- **Se congeló.** De 311 a 312 módulos: solo entró `rhythm-calibration.js`. Lo pedí y se cumplió.
- **La hoja no se contradice.** «Sin visitar» solo si no hay visita ni ★ (`src/refugio-lugares.js:59`). Un único botón blanco (captura 21). «Siguiente: Jardín» (`:13`).
- **Una sola guía.** Los puntos bajo el cubo se fueron; los pasos que cuentan están en la Línea (`src/journey-pulse.js:89-92`).

## Qué sigue faltando o salió mal

- **El menú no se acortó** (CAMBIOS, H5). En el Mundo libre hay **15 entradas visibles** (contadas en el DOM): Tu cubo, Camino, Refugio, Mapa, Bitácora, Sonido, Herramientas, Grabar set, Viajar a otra semilla, Compartir, Volver al salto, Viaje, Ajustes, Guía, Cuenta (`index.html:142-171`). En el anillo, 7. Y **Lugares, el libro de cuentas, no está en el menú**: solo se abre desde el Refugio.
- **La hoja no dice la regla.** Ninguna fila muestra el ritmo del lugar (captura 21).
- **La tarjeta se lee al revés.** «Ritmo: X % (85 %)» y luego «Maestro: 80 %» (`src/places.js:98`). La estrella más difícil pide menos número. La dificultad real está en la ventana (`MAESTRO_WINDOW=.06`, `:20`), que no se ve.
- **Cifras en el Mundo libre:** «Caminado · 0 m», «✦ 0 chispas», «Próximo salto · 0/20 ✦» y la era. La ★ (`starsN`, `index.html:49`) no se ve.
- **El narrador sigue en los avisos** fuera de las rondas (`src/achievements.js:14`). Contradice la regla de Jay.
- **Texto antiguo:** «Rompe diez cristales…» en `index.html:54` y `:198`.
- **Cinco puntos dorados junto a la Línea** (capturas 02, 12, 13): no verifiqué qué cuentan; si es progreso, es otra guía.

## Cómo ordenar el menú

Seis entradas fijas y un «Más» plegado. Mismos IDs: las pruebas no se rompen.

1. **Camino / Mundo** (`bWorld`)
2. **Lugares** (nuevo `bLugares` → `openLugares()`)
3. **Refugio** (`bStudio`)
4. **Tu cubo** (`bCube`, tienda dentro)
5. **Sonido** (`bMusicSettings`)
6. **Ajustes** (`bSettings`; dentro, Cuenta y el cambio Viaje/Mundo libre)

**Más** (un `<details id="menuMore">` cerrado): Bitácora, Mapa, Guía, Grabar set, Herramientas, Viajar a otra semilla, Compartir, Volver al salto.

Para las ~30 pruebas: un solo ayudante `menu_click(page, id)` que abre `#menuMore` si el botón está dentro. Un cambio, no treinta.

## Mis tres acciones

1. **Menú de seis.**
   - `index.html:142-171` como arriba; `bLugares` en `src/controls.js`; ayudante en las pruebas.
   - Bien cuando: en el Mundo libre se ven 6 entradas más «Más», y las pruebas del menú pasan sin tocar sus IDs.
2. **La hoja dice la regla.**
   - `src/refugio-lugares.js:59`: en cada fila, los 8 pasos del patrón de `journey-rhythm.js`, el «1» dorado.
   - Bien cuando: una prueba lee las 11 filas y cada una lleva su patrón; un desconocido dice el ritmo de tres lugares mirando solo la hoja.
3. **Una sola cifra en el Mundo libre: ★. Y una tarjeta legible.**
   - Ocultar «Caminado» y «Próximo salto» fuera de Tu cubo; mostrar ★ (`index.html:43-50`). En `src/places.js:98`, un umbral único y la condición escrita: «Maestro: más rápido, mismo %».
   - Bien cuando: la captura del Mundo libre muestra como mucho ★ y ✦, y la tarjeta usa el mismo número en ★★ y ★★★.

## Decisiones de Jay

- **Umbral: 75 % para ★★ y para ★★★.** Un número fijo, impreso en la tarjeta. Maestro ya es más difícil por tempo y ventana; no hace falta otro número. «Mejorar tu marca» es una regla que cambia con cada jugador: no se puede enseñar en una línea.
- **Festival: solo el Viaje y su final.** Es el único tramo sin economía. Un jurado ve un verbo, cinco reglas y un cierre. El anillo, la tienda y la remezcla, fuera. Mantengo lo de la sesión 2: la economía es post-juego.
