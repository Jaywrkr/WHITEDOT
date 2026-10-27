# 11 · Celia Hodent — sesión 11
> Simulación de su mirada de diseño a partir de su obra pública. No es su opinión real. Revisó alpha.215 (`5464612`): las 50 capturas de `menus/` (teléfono, horizontal y escritorio; modo viaje y libre), cuatro capturas estándar, `index.html` (`#mMenu`, `#menuMore`, hojas), `src/ui.js`, `src/controls.js`, `src/journey-mode.js`, `src/accessibility.js`, `src/refugio-lugares.js`, `src/map.js`, `src/journal.js` y `styles/estilo-j.css`. Sin navegador ni audio.

## Notas (puntuación ciega)
| Eje | Nota | Evidencia y alcance |
|---|---|---|
| Visual | 7 | Hojas coherentes: negro, esquinas rectas, Geist Mono, una acción blanca por pantalla. Defectos: Refugio con rótulos encima de líneas («PRISMA», «RAÍZ»), «Más» cortado en horizontal. |
| Audio | — | No lo oí. Solo vi la hoja Sonido; no puntúo el sonido por una hoja. |
| Creatividad | 6,5 | El botón principal cambia con tu objetivo («Seguir hacia Jardín»). El Refugio como menú habitable es propio. El resto del menú es un cajón de mosaicos convencional. |
| Sensación | — | Sin manos ni teléfono. Solo cuento toques; eso entra en «Menús». |
| Cohesión | 6 | Tres caminos al mismo mapa, «lugares» con dos sentidos en la misma pantalla, tres nombres para la guía, dorado en un contador de lugares. |
| Pulido | 6,5 | Foco atrapado, Escape y retorno de foco bien hechos. Pero Lugares abre con cuatro filas escondidas arriba, «Midiendo…» sin valor, «Ir» desalineado, «Más» cortado en 844×390. |
| **Menús** | **7** | Jerarquía clara: seguir en 2 toques, las cuatro casas en 2. Debilidades: «Más» guarda 11 botones bajo un rótulo que no parece botón, y «Vista tranquila» quita funciones además de contadores. |

### Toques hasta cada tarea (desde el juego, «Más» cerrado)
| Tarea | Completa | Tranquila | Nota |
|---|---|---|---|
| Seguir al próximo lugar | 2 | 2 | ☰ → «Seguir hacia Jardín». Mismo verbo en menú, Lugares, Guía y Resultado. |
| Ver ★ de 33 | 0 (HUD) | 2 | ☰ → Lugares (`src/ui.js:22`, `src/controls.js:17`). |
| Rejugar un lugar ya completo | 3 + deslizar hacia arriba | igual | ☰ → Lugares → subir → «Ir». Ver hallazgo 3. |
| Volumen | 2 + arrastre | igual | ☰ → Ajustes; el deslizador va primero. |
| Energía o Calma | 3 | 3 | ☰ → Ajustes → Más sonido; al cerrar vuelve a Ajustes (`src/controls.js:46`, `:58`). |
| Tienda del cubo | 3 | no existe | Tu cubo es `free-only` (`styles/estilo-j.css:540`). |
| Logros nuevos (punto dorado) | 3 | 3 | ☰ → Bitácora (abre en Mapa) → Logros. |
| Mapa y favoritos | 2 o 3 | 2 o 3 | Bitácora ya abre en Mapa; «Más › Mapa y favoritos» lleva a la misma hoja. |
| Cuenta | 3 | 3 | ☰ → Más → Cuenta. |

## Lo que funciona hoy
1. **Jerarquía de primer nivel.** Una acción blanca a todo el ancho y cuatro casas debajo: Lugares, Tu cubo, Refugio, Bitácora (`index.html:149-154`, `tel-libre-menu.png`). Lo frecuente está a 2 toques.
2. **Un verbo para avanzar.** «Seguir hacia Jardín» es igual en las cuatro hojas (`capturas/33-resultado.png`, `tel-libre-lugares.png`, `tel-libre-guia.png`).
3. **Ajustes ordenado.** Tres bloques con rótulo; el volumen primero (`index.html:395`, `tel-libre-ajustes.png`). «Más sonido» vuelve a Ajustes.
4. **Cuenta honesta.** «Opcional. Se juega sin cuenta.»; sin crear ni eliminar mientras la nube está en pausa (`tel-libre-cuenta.png`).
5. **Accesibilidad de base.** Todas las hojas reciben `role="dialog"`, `aria-modal`, foco atrapado, Escape y retorno del foco (`src/accessibility.js:8-60`). Pestañas de Bitácora con `role="tab"` (`index.html:287`). Texto de menú a 12 px como mínimo (`styles/estilo-j.css:727`).
6. **Sin rótulos vacíos.** `tidyMenu` oculta una sección sin filas (`src/controls.js:22-23`; `tel-viaje-menu-mas.png`).

## Lo que falta o salió mal
1. **«Vista tranquila» dice «contadores» y quita funciones** (alta). El interruptor oculta Tu cubo, Mapa y favoritos, Grabar, Compartir, Efectos, Viajar a otra tierra, Textos del paisaje y Paseo automático (`.free-only`, `styles/estilo-j.css:540`; `index.html:151`, `:159-164`, `:395`). El subtítulo solo promete «Mostrar contadores» (`src/journey-mode.js:20`). Además el título nombra el estado y el subtítulo la acción, y está a 3 toques en «Más › Tú». Un jugador no puede deducir dónde quedó su cubo.
2. **Tres puertas al mismo mapa y «lugares» con dos sentidos** (alta). La Bitácora abre por defecto en la pestaña Mapa (`src/journal.js:47`, `tab='places'`); «Mapa y favoritos» abre la misma hoja (`src/map.js:81`). Esa hoja dice «6 lugares abiertos (○)» (`src/map.js:78`) mientras el HUD dice «5/11 lugares» (`tel-libre-bitacora.png`). Dos cifras distintas con la misma palabra en una sola pantalla.
3. **Lugares esconde lo que ya ganaste** (media). La lista abre con la fila anterior a la siguiente arriba (`src/refugio-lugares.js:66-67`). Llanura, Lago, Bosque y Tormenta quedan ocultas arriba, sin aviso: la pista solo apunta hacia abajo (`:74`). En teléfono no hay ninguna pista (`tel-libre-lugares.png`). Además, «Ir» de Vacío cae en su propia línea, desalineado con «Seguir» (`esc-libre-lugares.png`).
4. **El punto dorado lleva a otra pestaña** (media). `#bAch` se marca por logros sin leer (`src/achievements.js:7`), pero la Bitácora abre en Mapa. La novedad queda a un toque más y sin señal en la pestaña Logros.
5. **«Más» no parece un botón** (media). Es un `h3` de 12 px en gris con un «+» de 12 px (`styles/estilo-j.css:85`, `:96`). Debajo hay 11 botones (medido en `index.html:158-169`), entre ellos Cuenta y Grabar.
6. **Refugio: cifras en la vista tranquila y dorado para lugares** (media). El botón `#houseStars` muestra «5/11 lugares» con borde y texto dorados (`styles/estilo-j.css:597`) y no mira la vista (`src/refugio-lugares.js:81`). El rótulo del estante dice «LUGARES · ★ 5/33» (`:35`): la palabra lugares sobre una cifra de estrellas (`tel-viaje-refugio.png`). Contradice D3/D4.
7. **Nombres que aún chocan** (baja). «Cómo jugar» abre «Guía de juego», que tiene «Cómo jugar y guardar» (`index.html:157`, `:212`, `:219`). La pestaña «Chispas» de Tu cubo guarda salto, meta, colecciones, logros, título e historial (`index.html:111-116`). «Código» en el Refugio no dice que comparte (`index.html:397`).
8. **Detalles de pulido** (baja). «Ajustar el tiempo · Midiendo…» sin valor ni plazo (`src/rhythm-calibration.js:22`). Volumen repetido en Ajustes y en Más sonido (`tel-libre-sonido.png`). En 844×390, con «Más» abierto, la primera fila de «Ir» queda cortada (`hor-libre-menu-mas.png`). En el Refugio, la burbuja «Tu Refugio v…» sale truncada (`hor-libre-refugio.png`).

## Contraste con la sesión 10
En la sesión 10 puse Menús 5,5; hoy, 7. Visual igual (7), Cohesión igual (6), Pulido +0,5, Creatividad −1. Audio y Sensación, abstención.

**Cerrado** (comprobado):
- Lugares y Bitácora en la primera fila, también en la vista tranquila (`index.html:150`, `:154`; `tel-viaje-menu.png`).
- ★ n/33 primero y en dorado en la cabecera (`src/controls.js:17`).
- «Más» abre cerrado cada vez (`src/controls.js:24`, `more.open=false`).
- `#bWorld` ya no es una baldosa muerta; `#bPrimary` no cae en «Ayuda y cuenta» (`src/ui.js:34-38`).
- Rótulos vacíos ocultos (`tidyMenu`, `src/controls.js:22`).
- Ajustes con volumen primero y tres bloques; Sonido vuelve a Ajustes (`src/controls.js:46`, `:58`).
- Cierres inferiores «Cerrar»; Cuenta «Opcional» y D6 aplicada (`tel-libre-cuenta.png`).
- Pestañas de Bitácora con `role="tab"`; texto de menú desde 12 px.
- El menú cabe con «Más» cerrado en los tres tamaños (`hor-libre-menu.png`, `esc-libre-menu.png`).
- Mis metas de toques: seguir, ★, Lugares y Bitácora en ≤ 2; volumen en 2; tienda en 3 (vista completa).

**Abierto:**
- Mapa sigue con dos puertas, y la Bitácora abre en Mapa: hoy son la misma pantalla por dos caminos.
- «Lugares» sigue con dos sentidos («6 lugares abiertos» frente a «5/11 lugares»).
- El interruptor de vista sigue mezclando estado y acción, y sigue en «Más».
- Tu cubo › Chispas sigue siendo un cajón de seis temas.
- La tienda no existe en la vista tranquila. Es regla del Viaje; la acepto, pero el interruptor debe decirlo.

**Empeoró o es nuevo:**
- P1 alinea Lugares a la fila anterior a la siguiente: lo ganado queda escondido arriba, sin pista (hallazgo 3).
- P8 manda los logros solo a la Bitácora, pero la Bitácora abre en Mapa: el punto dorado no lleva a la novedad (hallazgo 4).
- P8 quitó cifras del HUD, pero el Refugio enseña «5/11 lugares» en dorado también en la vista tranquila (hallazgo 6).
- El subtítulo «Ocultar contadores» es nuevo y promete menos de lo que hace (hallazgo 1).

## Qué haría ahora
1. **Nombrar el interruptor por lo que hace.** En `src/journey-mode.js:20`: título como acción («Ver todo» / «Vista del Viaje») y subtítulo con lo que cambia («Muestra Tu cubo, cifras y herramientas»). Mantener el ID y el inicio de texto que leen las pruebas. **Bien cuando:** el texto visible nombra al menos Tu cubo y las cifras; título y subtítulo usan el mismo modo verbal.
2. **Una puerta al mapa y una palabra para los once.** La Bitácora abre en «Hoy», o en «Logros» si hay logros sin leer (`src/journal.js:47`, `:125`; `src/controls.js:39`). En `src/map.js:78`, «6 lugares abiertos» pasa a «6 portales abiertos» o desaparece. **Bien cuando:** con logros sin leer, ☰ → Bitácora muestra la pestaña Logros (2 toques); `grep -rn "lugares abiertos" src` da 0.
3. **Lugares muestra arriba lo ganado.** En `src/refugio-lugares.js:66-74`: o abrir en la primera fila con «Seguir» resaltado, o añadir la pista «↑ 4 completos» cuando `scrollTop>0`. Poner «Ir» en la misma línea que el nombre. **Bien cuando:** en `tel-libre-lugares` se ven Llanura o una pista hacia arriba; «Ir» y «Seguir» quedan a la misma altura (±2 px) en los tres tamaños.
4. **Refugio coherente con D3/D4.** `#houseStars` blanco y oculto en la vista tranquila (`src/refugio-lugares.js:81`, `styles/estilo-j.css:597`); el estante dice «★ 5 / 33» sin «LUGARES» (`:35`). **Bien cuando:** `tel-viaje-refugio` no muestra cifras; ningún dorado acompaña a «lugares».
5. **«Más» con forma de botón.** Mismo borde y altura de 44 px que las utilidades (`styles/estilo-j.css:93-97`), con el contador de entradas ocultas o un chevron. **Bien cuando:** el `summary` mide ≥ 44 px de alto y tiene borde visible. Validar que se entiende pide personas nuevas; no se ha hecho.
