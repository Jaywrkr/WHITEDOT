# 08 · Ken Wong — sesión 11
> Simulación de su mirada de diseño a partir de su obra pública. No es su opinión real. Revisó alpha.215 (`5464612`): las 21 capturas estándar, 16 capturas de teléfono y 2 apaisadas de `menus/`, `src/render.js`, `src/journey-games.js`, `src/places-ring.js`, `src/journey-pulse.js`, `src/house*.js`, `src/refugio-lugares.js` y `styles/estilo-j.css`. Sin navegador ni audio.

## Notas (puntuación ciega)
| Eje | Nota | Evidencia y alcance |
|---|---|---|
| Visual | 7,5 | Cada lugar es una lámina con su propia figura. El cubo es siempre el punto más claro (medida abajo). Lago, Tormenta y Dunas cargan demasiado el fondo. |
| Audio | — | No lo oí. Mi lente es la imagen. No puntúo lo que no escuché. |
| Creatividad | 8 | Faro con cono, columnas de Ruinas, eco de cuadros en la Cueva, Tu canción como anillo de planetas. Ideas propias, no plantillas. |
| Sensación | 6,5 | Solo desde capturas y código: anillo que se cierra, dedo fantasma, golpe al oírse. Bien planteado. Sin manos ni teléfono no lo confirmo. |
| Cohesión | 7 | Estilo J se sostiene en menús y hojas. El Refugio habla otro idioma (mayúsculas espaciadas, rótulos encima de dibujos). El dorado se reparte más allá de las ★. |
| Pulido | 6,5 | Rótulos del Refugio a 2,5:1 de contraste y solapados. Mucho texto de 11 px. Filas de Lugares de alto desigual. |

Medida de figura y fondo (Python/PIL sobre las capturas estándar). «Campo» = píxeles con luminancia > 90 entre y=100 y y=650. «Zona del cubo» = ventana de 120×120 centrada en él.

| Captura | Campo | Zona del cubo | Blanco puro del cubo |
|---|---|---|---|
| 00 Inicio | 0,12 % | 0,78 % | 6×6 px |
| 02 Lago | 0,28 % | 0,84 % | 6×6 px |
| 04 Tormenta | 0,54 % | 2,00 % | 6×6 px |
| 11 Dunas | 0,59 % | 0,93 % | 6×6 px |
| 13 Faros | 0,30 % | 2,23 % | 6×6 px |
| 20 Anillo | 0,28 % | 1,72 % | 6×6 px |

El cubo sigue pequeño (`render.js:188-189`, `CUBE_MIN=6,CUBE_MAX=12`) y siempre gana al campo. Dunas es el caso más justo: solo 1,6 veces.

## Lo que funciona hoy

1. **La primera pantalla sigue siendo una lámina.** `00-inicio.png`: negro, el cubo, dos cristales y un rastro de puntos. Sin una sola palabra. Solo el 0,12 % del campo pasa de luminancia 90.
2. **El golpe vive junto al cubo.** El dedo fantasma es un anillo fino a unos 27 px (recorte ampliado de `01`). Un arco se cierra sobre el cubo antes de cada paso que cuenta (`journey-pulse.js:28`, `:147-154`). El ojo ya no tiene que ir al borde.
3. **La Línea se lee.** Píxel medido en `00-inicio.png`, y=675: (97,97,97). Base a alfa .38 sobre franja negra (`journey-pulse.js:31`, `:132`). El «1» va en dorado.
4. **Faros y Ruinas son láminas de verdad.** `13-lugar-faros.png`: un cono amarillo, un círculo punteado y barcos. Una sola dirección. `14-lugar-ruinas.png`: siete columnas en corona, simetría clara.
5. **Tu canción es un objeto.** `22-cancion.png`: once astros en anillo, cinco con color, el resto punteados. Se entiende sin leer. El degradado cálido arriba da hora del día.
6. **Las hojas son sobrias.** Menú, Guía, Resultado y Lugares respetan negro, esquinas rectas y un primario blanco (`30-menu.png`, `31-guia-jardin.png`, `33-resultado.png`). El resultado dice «A 0,4 de ★★» en una línea.
7. **Una sola orden.** La guía dice «Toca al ritmo. Arrastra para moverte.» (`31-guia-jardin.png`; `onboarding-model.js:7`).

## Lo que falta o salió mal

1. **El Refugio no es una lámina: es un plano con rótulos encima** (alta). `menus/tel-libre-refugio.png`, recorte ampliado. «RAÍZ · 11 LUGARES O 24 ★» queda cruzado por las esquinas punteadas y una franja de luz. «PRISMA» se apoya sobre la línea del suelo. «LUGARES · ★ 5 / 33» choca con la fila de cajas punteadas. Las salas cerradas usan `#ffffff4d` a 11 px (`house.js:85`): contraste ≈ 2,5:1. Las de taller, `#ffffff73` (`house-capsules.js:113`): ≈ 4,4:1. Es la pantalla del juego que más se parece a un formulario.
2. **El número más fuerte de la pantalla es ✦ 0** (media, nuevo). En `menus/tel-libre-tu-cubo.png` y `tel-libre-grabar.png`, «✦ 0 chispas» va a 14 px, peso 600 y dorado (`estilo-j.css:384`). «★ 5/33» va a 11 px (`estilo-j.css:546-547`). Lo ganado de verdad (★) susurra; la moneda, a cero, grita. Además «✦» se pinta dorado y el dorado quería ser solo de las ★.
3. **Lago, Tormenta y Dunas siguen sin una figura clara** (media). `02-capitulo-lago.png`: decenas de anillos del mismo grosor que el anillo del cubo. `04-capitulo-tormenta.png`: un disco blanco de ~85 px compite con el cubo. `11-lugar-dunas.png`: una línea y un círculo blancos de trazo pleno arriba. El cubo gana, pero por poco (tabla).
4. **Los caminantes siguen pareciendo letras** (media). A un tercio de brillo, pero aún se leen como «卅» o «耳» en `05-capitulo-vacio.png`, `12-lugar-cristales.png` y `15-lugar-cueva.png`. En un juego sin palabras, algo que parece texto distrae.
5. **Dos cuentas de lugares en dos hojas vecinas** (media). Lugares dice «5 / 11» (`21-lugares.png`). Mapa dice «6 lugares abiertos (○)» (`menus/tel-libre-mapa.png`; `map.js:78`). El Refugio dice «5/11 lugares». Una persona nueva no sabe cuál es el suyo.
6. **Demasiado texto a 11 px y medio blanco** (media). 75 reglas de `font-size` de 10–11 px en `estilo-j.css`. Ejemplos: el HUD de lugares (`.hud-tally`, 11 px, 70 %), los rótulos del Refugio, «Capas ganadas» en Tu canción. En un teléfono a un brazo de distancia, es letra de nota al pie.
7. **El mapa de la Bitácora desperdicia su lámina** (baja). `menus/tel-libre-mapa.png`: el anillo de once ocupa unos 90 px de un marco de 316 px. Los círculos miden unos 8 px.
8. **El cubo del Refugio mide 19 px** (baja). En `tel-libre-refugio.png` el cuadro blanco va de x=186 a 205. En el Mundo mide 6 px. No pido agrandar el del Mundo. Digo que son dos escalas para el mismo héroe.
9. **Filas de Lugares de alto desigual** (baja). En `21-lugares.png`, «Ir» cae bajo las estrellas de Vacío; la fila mide unos 70 px frente a 54 de las cerradas.
10. **La barra superior vacía casi no se ve** (baja). Píxel (36,36,36) en `00-inicio.png`, y=84: ≈ 1,4:1. Es la meta del capítulo.

## Contraste con la sesión 10

**Cerrado (comprobado):**
- Dedo fantasma pequeño y junto al cubo (`01`, recorte; CAMBIOS P3: 14×14, 27 px).
- Golpe junto al cubo con anillo que se cierra (`journey-pulse.js:28`, `:147-154`).
- Línea ≥ (90,90,90): medida 97.
- Chispas que vuelan a la barra real (`journey-games.js:12-18`, `barTarget`).
- Marcas de capítulo de 4 px (`journey-chapters.js:171`).
- Una sola orden de toque (`onboarding-model.js:7`).
- Sin «Pulso» en el Camino (`00-inicio.png`).
- Menú horizontal con Ajustes a la vista (`menus/hor-libre-menu.png`).

**Abierto:**
- Lago y Llanura aún sin figura y fondo claros. P7 bajó la textura; `01` sigue con siete discos grises repartidos sin composición.
- Caminantes que parecen letras: más tenues, no resueltos.
- La barra superior vacía sigue a ≈ 1,4:1.

**Empeoró o es nuevo:**
- El HUD de tres cifras pone ✦ por encima de ★ (punto 2).
- El Refugio sumó rótulos de regla de salas («8 lugares o 15 ★») que se pisan con el dibujo (punto 1).
- Dos cuentas de lugares (punto 5).

Respecto a la sesión 10: Visual +0,5 y Pulido igual. No puntué Audio esta vez.

## Qué haría ahora

1. **Ordenar el Refugio como una lámina.** Los rótulos de sala fuera del dibujo, a la izquierda y arriba de cada sala, con un margen medido. Cerradas a `#ffffff8c` como mínimo. Dónde: `house.js:85-88`, `house-capsules.js:113`.
   *Bien cuando:* en `tel-*-refugio.png` y `hor-*-refugio.png` ningún rótulo cruza una línea, caja o esquina (prueba de cajas con `measureText`); y todo rótulo da ≥ 4,5:1.
2. **Invertir el peso del HUD.** ★ de 33 a 14 px; ✦ y lugares a 11 px. ✦ en blanco, no dorado. Dónde: `estilo-j.css:384`, `:410`, `:546-547`.
   *Bien cuando:* en `tel-libre-*.png`, el texto más grande de la esquina es «★ n/33»; y ningún texto del HUD salvo ★ usa `var(--earned)`.
3. **Una figura por pantalla en Lago, Tormenta y Dunas.** Lo que no se puede tocar ahora, a alfa ≤ .25; lo de trazo pleno, solo el objetivo cercano. Dónde: dibujo de `journey-chain.js`, `journey-dance.js`, `journey-surf.js`.
   *Bien cuando:* en `02`, `04` y `11`, la zona del cubo tiene al menos 5 veces la densidad del campo (hoy 3,0, 3,7 y 1,6).
4. **Una cuenta de lugares.** Mapa dice «5 de 11 completos», como Lugares y el HUD. Dónde: `map.js:78`.
   *Bien cuando:* `grep "lugares abiertos" src` da 0 y las tres hojas muestran la misma cifra.
5. **Caminantes como siluetas, no glifos.** Rellenar o redondear sus trazos para que no lean como caracteres. Dónde: `walker-forms.js`.
   *Bien cuando:* tres personas, ante `05` y `12` sin contexto, no nombran ninguna letra.
