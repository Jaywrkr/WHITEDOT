# 11 · Celia Hodent · menús

Simulación de la mirada de diseño de Celia Hodent a partir de su obra pública. No es su opinión real.

Versión **2.3.0-alpha.207** (commit `2e7f9d1`).

Qué revisé:
- `index.html` entero, con detalle en `#mMenu`, `#menuMore`, `#mSettings`, `#mMusic`, `#mCube`, `#mLugares`, `#mJournal`, `#mGuide`, `#mConnection`, `#mPlace` y `#mPortal`.
- `styles/estilo-j.css` y `styles/interface.css`.
- La lógica del menú: `src/controls.js`, `src/ui.js`, `src/journey-mode.js`, `src/accessibility.js`, `src/save-tools.js`, `src/favorites.js`, `src/journey-finale.js`, `src/places-ring.js` y `src/refugio-lugares.js`.
- Las 50 capturas de `menus/` (teléfono vertical, horizontal y escritorio, en vista tranquila y completa) y `capturas/30` a `34`.

No abrí ningún navegador. No jugué con las manos. No oí el audio. Lo que digo del sonido y del tacto sale del código y de las capturas.

Nota sobre el material:
- En vista tranquila no se abrieron Tu cubo, Lugares, Bitácora ni Grabar. Sus capturas muestran el menú porque el botón está oculto.
- `tel-*-sonido.png` también muestra el menú. Sonido no está en el primer nivel: vive dentro de Ajustes.
- Esas dos cosas ya son hallazgos.

---

## Contexto

Kubono es un juego musical de un solo gesto: tocar a tiempo con un cubo pequeño sobre negro. Hay un Viaje guiado de cinco capítulos. Después se abre un anillo de once lugares, cada uno con tres estrellas. Alrededor hay muchas capas: un universo procedural, el Refugio, chispas, la tienda del cubo, una bitácora, favoritos, grabación y semillas. Se navega con un solo botón de menú (☰) en la esquina inferior derecha. Abre una hoja con un botón principal («Seguir hacia Jardín»), tres o cuatro baldosas, un «Más» plegado con unas diez entradas y una fila de utilidades. Hay dos vistas: la tranquila oculta casi todo y la completa lo muestra todo.

## Notas

| Área | Nota | Por qué |
|---|---|---|
| Visual | 7 | El estilo negro y recto es coherente y sobrio, pero hay alineaciones rotas, como Ajustes descentrado o «diagnóstic/o» partido. |
| Audio | 6,5 | No lo he oído. En el código, los menús son silenciosos como pide Jay, pero llegar al volumen es largo. |
| Creatividad | 7,5 | El anillo, las capas de Tu canción y el Refugio son ideas propias, aunque el menú las entierra. |
| Sensación | 6 | No lo he jugado. El menú tapa media pantalla en teléfono y «Explorar» no responde dentro del Mundo. |
| Cohesión | 6 | «Explorar», «lugares», «Mapa» y «Seguir» significan cosas distintas según la hoja. |
| Pulido | 6 | La base es sólida: foco, Escape y 44 px. Fallan las secciones vacías, los cortes de texto y el botón Sonido sin regreso. |
| **Media** | **6,5** | |

### Nota propia · Menús: **5,5 / 10**

| Criterio | Nota | Motivo |
|---|---|---|
| Jerarquía (lo que se ve primero) | 5 | El botón principal es excelente. Debajo, un botón que no hace nada («Explorar») ocupa una baldosa, y Lugares, el núcleo del juego, queda plegado en «Más». |
| Número de opciones | 5 | En vista completa hay 4 baldosas, unas 10 entradas en «Más» y 3 utilidades: 17 en total. En vista tranquila, el menú se queda en 7 con secciones vacías. |
| Nombres | 4,5 | «Explorar» tiene 5 sentidos y «lugares» tiene 2. «Volver al salto», «Remezcla», «Modo: explorar», «Datos del mundo», «Vista tranquila / Cambiar a completa» y «Grabar set» no se entienden a la primera. |
| Agrupación | 5 | «Camino» (cambiar de mundo) cae en «Ayuda y cuenta». Sonido está dentro de Ajustes. Hay Logros en Tu cubo y en Bitácora, y Mapa en el menú y como pestaña de Bitácora. |
| Accesibilidad | 7,5 | Foco atrapado, Escape, regreso del foco y `aria-*` correctos. Casi todo mide 44 px y el texto atenuado tiene 7,4:1. En contra: mucho texto de 11 px y dos botones de 24–26 px. |
| Cierre y regreso | 6 | Todas las hojas tienen una × arriba y un botón de cierre abajo. Pero Sonido cierra Ajustes y no vuelve a él, y los cierres se llaman de cinco maneras («Cerrar», «Salir», «Seguir jugando», «Volver al mundo», «Volver»). |
| Consistencia entre hojas | 5,5 | La filas de botones finales cambian de forma (4 botones desiguales en Guía, 4 en Lugares y 3 en Resultado). Las pestañas de Tu cubo tienen roles ARIA y las de Bitácora no. |
| Teléfono, horizontal y escritorio | 6 | En vertical, la hoja anclada abajo queda al alcance del pulgar. En horizontal y escritorio, con «Más» abierto, Ajustes queda bajo el pliegue, y en horizontal el contenido se cuela sobre la cabecera fija. |

---

## Inventario del menú

### Nivel 0 · pantalla

| Elemento | Vista completa | Vista tranquila | Nota |
|---|---|---|---|
| `#bMenu` ☰ | sí | sí | Es la única puerta a todo. |
| `#era` (nombre de región, «Veis») | sí | oculto | Su `aria-label` dice «Abrir tus lugares», pero abre **favoritos**, no los once lugares (`src/favorites.js:73`). |
| `#quickSave` 🔖 | sí | oculto | Guarda un favorito. |
| `#bAuto` ▶, `#bStyles`, `#bJump` | sí | ocultos | Paseo, estilos y salto en el dock. |

### Nivel 1 · hoja `#mMenu`

| # | ID | Texto visible | Tranquila | Completa | Problema |
|---|---|---|---|---|---|
| 1 | `bContinue` | «Seguir hacia Jardín» / «Volver a la ronda» / «Tu canción» | ✓ | ✓ | Ninguno. Es el mejor botón del juego. |
| 2 | `bCube` | Tu cubo | — | ✓ | Oculto en tranquila. El punto dorado de `journey-finale.js:86` marca un botón que puede no verse. |
| 3 | `bWorld` | «Explorar» / «Camino» / «Mundo» | ✓ | ✓ | Con el Mundo libre abierto y estando ya en el Mundo, **no hace nada**: solo cierra el menú (`src/controls.js:26` y `:17`). |
| 4 | `bStudio` | Refugio | ✓ | ✓ | |
| 5 | `bLeavePlace` | Dejar la ronda | solo en ronda | solo en ronda | |
| — | `menuMore` | «Más +» | ✓ | ✓ | Recuerda si quedó abierto. Abierto, empuja Ajustes fuera de la pantalla. |
| 6 | `bLugares` | Lugares · «Siguiente: Jardín.» | — | ✓ (en Más) | Es el núcleo del juego (11 lugares, 33 ★) y está a tres toques. |
| 7 | `bMap` | Mapa · «Regiones y favoritos» | — | ✓ (en Más) | Abre la Bitácora en su pestaña Mapa: es la misma hoja con dos nombres. |
| 8 | `bTools` | Herramientas | — | ✓ (en Más) | Su `title` habla de «Estudio», que es otro nombre del Refugio. |
| 9 | `bRecord` | Grabar set | — | ✓ (en Más) | Graba al instante, sin aviso (`tel-libre-grabar.png`). «Set» es jerga. |
| 10 | `bWorlds` | Viajar a otra semilla | — | según estado | «Semilla» es jerga de desarrollo. |
| 11 | `bShare` | Compartir | — | ✓ (en Más) | |
| 12 | `bJumpBack` | Volver al salto | ✓ | ✓ | Lo agrupa bajo «Crear». El nombre no dice adónde vuelve. |
| 13 | `bJourneyMode` | «Vista tranquila · Cambiar a completa» | ✓ | ✓ | El rótulo nombra el estado y el subtítulo nombra la acción. Al pulsarlo, el menú se cierra. |
| 14 | `bConnection` | Cuenta | ✓ | ✓ | |
| 15 | `bPrimary` | «Camino» | ✓ | ✓ | Se mueve por código a «Ayuda y cuenta» (`src/ui.js:29`). Cambia de mundo, no es ayuda. |
| 16 | `bSaveTools`, `pwaUpdate` | Guardar copia, Actualizar | según estado | según estado | |
| 17 | `bGuide` | Cómo jugar | ✓ | ✓ | |
| 18 | `bAch` | Bitácora | — | ✓ | Oculta en tranquila. El narrador vive en la Bitácora y el resultado dice «En la Bitácora» (`capturas/33`). |
| 19 | `bSettings` | Ajustes | ✓ | ✓ | En tranquila queda descentrado (`.menu-utilities #bGuide{grid-column:1/-1}`, `estilo-j.css:659`, con el hueco de `bAch`). |

En vista tranquila con «Más» abierto se ven los rótulos **«Explorar» y «Crear» sin nada debajo** (`tel-viaje-menu-mas.png`, `esc-viaje-menu-mas.png`).

Totales:
- **Vista completa:** 4 baldosas, 10 a 12 entradas en «Más» y 3 utilidades, es decir, de 17 a 19 destinos. Hay tres etiquetas de sección dentro de un pliegue.
- **Vista tranquila:** 3 baldosas, 3 o 4 entradas en «Más» y 2 utilidades, es decir, de 8 a 9 destinos.

### Nivel 2 · hojas

| Hoja | Controles visibles | Observaciones |
|---|---|---|
| `#mSettings` Ajustes | Sonido (enlace), Paseo automático, Calidad gráfica, Ajustar el tiempo (− / + / Medir otra vez), Vibración, Daltonismo, Textos del paisaje, Modo: explorar, Datos del mundo, Empezar de cero, Copiar diagnóstico y Cerrar | 14 controles sin grupos. Mezcla accesibilidad, depuración y una acción destructiva. |
| `#mMusic` Sonido | Volumen, Energía, Sonido sí/no, Calma, Repetir, Estilo de La Voz y Cerrar | Solo se llega desde Ajustes. «Cerrar» vuelve al mundo, no a Ajustes. |
| `#mCube` Tu cubo | 3 pestañas (Llevar, Tienda, Chispas) | La pestaña «Chispas» es un cajón de sastre: salto, meta, colecciones, logros, título e historial. |
| `#mLugares` | Lista de 11, Remezcla, Tu canción, «Seguir hacia Jardín» (antes «Salir al anillo») y Cerrar | Abre desplazada. En `tel-libre-lugares.png` se ve medio botón «Ir» cortado arriba. |
| `#mJournal` Bitácora | 6 pestañas (Hoy, Colección, Mapa, Música, Logros, Tú), Lo próximo, Constelación, Sesión y Cerrar | Las pestañas no tienen `role="tab"`, a diferencia de Tu cubo. |
| `#mGuide` | 4 botones finales: Seguir hacia Jardín, Escuchar y responder, Practicar y Seguir jugando | «Seguir» y «Seguir jugando» compiten. Las alturas son desiguales (`tel-libre-guia.png`). |
| `#mConnection` Cuenta | Correo, Clave, Entrar, Crear cuenta, Salir de cuenta, Olvidé mi clave y Eliminar cuenta | Dice **«Entra en tu cuenta para jugar.»** (`src/cloud-account.js:9`), cuando la cuenta es opcional. Sin sesión, dice que el avance se guarda en la cuenta. |

### Toques hasta cada tarea frecuente

Cuento desde el juego, con «Más» cerrado, que es como se abre la primera vez.

| Tarea | Vista completa | Vista tranquila | Comentario |
|---|---|---|---|
| Seguir al próximo lugar | **2** (☰ → Seguir hacia Jardín) | **2** | Excelente. El nombre es concreto y consistente en Menú, Lugares, Guía y Resultado. |
| Cambiar el volumen | **3 + arrastre** (☰ → Ajustes → Sonido → deslizador) | **3 + arrastre** | Sonido cierra Ajustes. Al cerrar Sonido vuelves al mundo. Hay código para un volumen en el menú (`rMenuVolume`, `src/controls.js:47-48`) cuyo HTML ya no existe. |
| Ver estrellas (★ n/33) | **3** (☰ → Más → Lugares) | **6** (☰ → Más → Vista tranquila → ☰ → Más → Lugares) | En tranquila el contador del HUD está oculto. Como atajo, Refugio muestra ★ 5/33 en 2 toques, pero te lleva a otro sitio. |
| Tienda del cubo | **3** (☰ → Tu cubo → Tienda) | **6** (☰ → Más → Vista → ☰ → Tu cubo → Tienda) | La pestaña por defecto es Llevar. |
| Empezar de cero | **4 + desplazamiento** (☰ → Ajustes → bajar → Empezar de cero → «¿Seguro?» en 3 s) | igual | La confirmación es un cambio de texto en el mismo botón. Sin sesión, guarda copia. Bien protegido, pero poco visible como peligro. |
| Ver la Bitácora | **2** (☰ → Bitácora, si se ve sin bajar) | **no hay acceso desde el menú** | Solo por puertas laterales («Abrir libro» y la salida de sesión). |

---

## Lo que funciona

1. **Un botón principal claro y vivo.** `bContinue` cambia de texto según el objetivo: «Seguir hacia Jardín», «Volver a la ronda» o «Tu canción» (`src/controls.js:14`). Es blanco y ocupa todo el ancho (`tel-viaje-menu.png`). Es lo primero que se ve y lo más frecuente. Así debe ser.
2. **El mismo verbo en todas partes para la misma tarea.** «Seguir hacia Jardín» aparece igual en el menú, Lugares, Guía y Resultado (`capturas/33-resultado.png`, `tel-libre-lugares.png`).
3. **Accesibilidad de base seria.**
   - Foco atrapado, Escape cierra y el foco vuelve al botón de origen (`src/accessibility.js:1-62`).
   - Una × de 44 px se añade automáticamente a cada hoja (`accessibility.js:11`).
   - `aria-expanded` en ☰ (`accessibility.js:26`).
   - Foco visible de 2 px (`estilo-j.css:20`).
   - Altura mínima de 44 px en hojas (`estilo-j.css:423`).
   - Texto atenuado `#ffffff99`, con 7,4:1 sobre negro.
4. **En teléfono vertical, la hoja se ancla abajo.** El botón principal queda al alcance del pulgar (`interface.css:166`, `tel-viaje-menu.png`).
5. **La vista tranquila respeta la decisión de Jay.** El Viaje no muestra contadores ni tienda, y el menú se reduce a lo esencial (`estilo-j.css:540-541`).
6. **Tu cubo** usa pestañas ARIA reales (`index.html:98`). Las piezas bloqueadas se ven atenuadas y con un hueco, sin texto que estorbe (`tel-libre-tu-cubo.png`).
7. **Lugares** marca la fila actual con una barra blanca y avisa de que hay más («Más lugares al deslizar ↓»). El dorado queda para lo ganado (`5 / 11`, ★).
8. **Empezar de cero** pide confirmación, guarda una copia y se desactiva con sesión iniciada (`src/save-tools.js:23-29`). Nada ganado se borra sin red.
9. **Menús silenciosos.** No encontré sonido de interfaz en los botones del menú.

## Lo que falla

Ordenado por gravedad.

1. **«Explorar» es una baldosa principal que no hace nada.**
   - Con el Mundo libre abierto y estando ya en el Mundo, `bWorld` no entra en ninguna rama (`src/controls.js:26`). El escuchador genérico solo cierra el menú (`:17`).
   - Ocupa uno de los tres huecos más valiosos (`tel-viaje-menu.png`).
   - Un botón principal que no responde enseña al jugador que el menú no es fiable.
2. **Jerarquía invertida: lo central está plegado.**
   - Lugares (11 lugares, 33 ★, la meta de victoria) vive dentro de «Más» (`index.html:157`). Allí está a 3 toques y en tranquila a 6.
   - En cambio, Refugio, que es voluntario, está en la primera fila.
   - Las estrellas, la recompensa principal, no se ven en el menú: la cabecera solo dice «✦ 0 chispas · Veis».
3. **La vista tranquila deja sin salida lo ganado.**
   - En tranquila desaparecen Tu cubo, Lugares y Bitácora (`.free-only`, `estilo-j.css:540`).
   - Para volver a verlos hay que adivinar que «Vista tranquila · Cambiar a completa», dentro de «Ayuda y cuenta», es el interruptor (`tel-viaje-menu-mas.png`).
   - El Resultado dice «8 logros nuevos · En la Bitácora» (`capturas/33`), y en tranquila la Bitácora no está en el menú.
   - Quedan visibles los rótulos «Explorar» y «Crear» sin entradas.
4. **Nombres que chocan: «Explorar» y «lugares».**
   - «Explorar» es a la vez la baldosa, el rótulo de sección en «Más», «Otras formas de explorar» (Guía), «Modo: explorar» (Ajustes) y «Salir a explorar» (Refugio).
   - «Lugares» son los once del anillo (`bLugares`). Pero `#era` dice «Abrir tus lugares» y abre **favoritos** (`src/favorites.js:73`), y en Bitácora aparecen «Buscar lugares» y «Volver a tus lugares».
   - Son dos modelos mentales con una sola palabra.
5. **Cada tarea frecuente tiene un camino distinto.**
   - Volumen: 3 toques y regreso roto. `bMusicSettings` cierra Ajustes (`src/controls.js:38`) y `muClose` devuelve al mundo, no a Ajustes.
   - Además, `rMenuVolume` y `menuVolumeNow` siguen en `controls.js:47-48` sin HTML: es código muerto de un atajo que se perdió.
6. **«Camino» aparece en «Ayuda y cuenta».**
   - `ui.js:29` mueve `bPrimary` dentro de `#menuMore` en el Mundo.
   - Al final de la lista queda «← Camino», bajo Cuenta (`tel-viaje-menu-mas.png`). Cambiar de mundo no es ayuda.
   - Duplica el papel de `bWorld`: son dos botones para el mismo viaje, con nombres distintos.
7. **La cuenta se contradice.**
   - «Entra en tu cuenta para jugar.» (`src/cloud-account.js:9`, `tel-*-cuenta.png`).
   - Se juega sin cuenta y la nube está en pausa. Mostrar «Crear cuenta» y «Eliminar cuenta» sin servicio genera dudas y riesgo de abandono.
8. **Ajustes es un cajón de 14 controles sin grupos.**
   - Están juntos Sonido (que es un enlace, no un ajuste), latencia («Ajustar el tiempo · Midiendo…»), accesibilidad, «Modo: explorar», «Datos del mundo», Empezar de cero y el diagnóstico.
   - Empezar de cero queda pegado a «Datos del mundo», sin separación visual de peligro (`tel-viaje-ajustes.png`).
   - «Copiar diagnóstico» se parte en «diagnóstic / o».
9. **«Más» recuerda su estado y rompe el pliegue.**
   - Una vez abierto, sigue abierto en la siguiente visita. En `tel-libre-menu.png`, Bitácora y Ajustes quedan fuera de la pantalla.
   - En horizontal, el texto «Más −» se ve por encima de la cabecera fija (`hor-libre-menu.png`).
   - En escritorio a 1280×800, Ajustes queda cortado (`esc-libre-menu.png`).
10. **Utilidades desalineadas.** «Cómo jugar» está centrado y «Ajustes» flota a la izquierda (`tel-viaje-menu.png`, `esc-viaje-menu.png`). Lo causa la rejilla con `bAch` oculto.
11. **Cierres con cinco nombres.**
    - «Cerrar» (Lugares, Bitácora, Ajustes, Sonido).
    - «Salir» (Resultado).
    - «Seguir jugando» (Guía).
    - «Volver al mundo» (Cuenta).
    - «Volver» (perfil).
    - La × de arriba es uniforme, pero el botón de abajo no.
12. **Hojas con demasiadas salidas iguales.**
    - Guía: 4 botones de peso parecido y alturas distintas.
    - Lugares: 4, y «Remezcla» no se explica.
    - Tu cubo › Chispas mezcla siete temas, y sus Logros duplican los de la Bitácora.
13. **Texto pequeño.**
    - Subtítulos y etiquetas a 11 px en muchas hojas (`interface.css:75`, `estilo-j.css:143`).
    - `.spark-goal` mide 24 px de alto y `.spark-power button` 26 px (`estilo-j.css:389`, `:397`), por debajo de 44 px.
14. **Grabar set graba al instante desde el menú.** No hay paso previo ni explicación de qué es un «set» (`tel-libre-grabar.png`). Es aceptable si es reversible, pero el nombre no lo anuncia.
15. **Las pestañas de Bitácora no son pestañas para el lector de pantalla.** Son botones sueltos sin `role="tab"` ni `aria-selected` (`index.html:289`), al contrario que Tu cubo.

---

## Propuesta de menú

Principios:
- Lo frecuente arriba, sin pliegues.
- Una palabra por concepto.
- Todo lo ganado siempre a la vista.
- Nada se añade: se reordena.
- Se conservan todos los ID. Estilo: negro, esquinas rectas, Geist Mono, sin sonido, blanco para estados y dorado solo para lo ganado.

### Nivel 1 · `#mMenu`

```
[cubo]  Nombre                       ×        ← header .menu-heading
        ★ 5/33 · ✦ 120 · Veis                 ← #menuSummary: estrellas primero, en dorado

[ Seguir hacia Jardín            → ]          ← #bContinue (sin cambios)

Jugar
[ Lugares ★5/33 ] [ Tu cubo ✦ ] [ Refugio ] [ Bitácora ]
   #bLugares        #bCube        #bStudio     #bAch
   (subtítulo: «Siguiente: Jardín»)

[ Ajustes ]  [ Cómo jugar ]                   ← .menu-utilities, siempre a la vista
   #bSettings   #bGuide

Más +                                          ← #menuMore, se abre cerrado cada vez
  Ir
    ← Volver al Camino / → Ir al Mundo        #bWorld (un solo botón, se oculta si no aplica)
    Volver al punto anterior                  #bJumpBack (antes «Volver al salto»)
    Viajar a otra tierra                       #bWorlds
  Crear
    Efectos y eco                              #bTools
    Grabar 60 s                                #bRecord
    Compartir                                  #bShare
  Tú
    Vista tranquila · Mostrar contadores      #bJourneyMode (el texto empieza igual: las pruebas lo leen)
    Cuenta · opcional                          #bConnection
    Guardar copia / Actualizar                 #bSaveTools, #pwaUpdate
```

Cambios concretos:
1. **Sacar `bLugares` y `bAch` de «Más» a la fila principal.** Mover `bWorld` a «Más › Ir» y ocultarlo cuando no haga nada. `bPrimary` vuelve solo al dock fuera del Mundo, sin moverse a «Más» (`ui.js:29`).
2. **En vista tranquila, mantener visibles Lugares y Bitácora**, aunque sin números ni tienda si Jay quiere silencio. Los rótulos de sección sin entradas se ocultan.
3. **Estrellas en la cabecera** del menú, en dorado.
4. **`#menuMore` se abre siempre cerrado.** Hay que respetar que las pruebas lo abren por atributo.
5. **Un nombre por concepto:**
   - «Lugares» solo para los once.
   - Favoritos se llama «Favoritos» en `#era`, en `#bMap` («Mapa y favoritos») y en la Bitácora.
   - «Explorar» solo para entrar al Mundo.
   - «Modo: explorar» pasa a ser «Modo crear: no».
6. **Volumen a un toque desde Ajustes.** Ajustes empieza con el deslizador de volumen (reutilizar `rVolume` dentro de `#mSettings` o recuperar `rMenuVolume`, que ya está en el código). Sonido (`#bMusicSettings`) queda como «Más sonido». Su «Cerrar» devuelve a Ajustes si se entró desde Ajustes.
7. **Ajustes en tres bloques con rótulo:**
   - Sonido y tiempo: volumen, Más sonido y ajustar el tiempo.
   - Ver y sentir: calidad, vibración, daltonismo, textos y paseo.
   - Partida: Datos del mundo, diagnóstico y, al final, separado por una línea y en blanco con borde, Empezar de cero.
8. **Cierre uniforme:** el botón de abajo dice «Cerrar» en todas las hojas. Las acciones de avance se llaman «Seguir hacia …». «Seguir jugando» de la Guía pasa a «Cerrar».
9. **Cuenta:** sin sesión, decir «Opcional. Se juega sin cuenta.». Ocultar «Salir de cuenta» y «Eliminar cuenta» hasta que haya sesión. Mientras la nube esté en pausa, no ofrecer «Crear cuenta».
10. **Bitácora:** dar `role="tablist"`, `role="tab"` y `aria-selected` a sus pestañas, igual que Tu cubo.
11. **Texto mínimo de 12 px** en subtítulos. `.spark-goal` y `.spark-power button` a 44 px.

**Bien cuando:**
- Desde el juego, en ambas vistas, se llega en **≤ 2 toques** a seguir al próximo lugar, ver las estrellas, abrir Lugares y abrir la Bitácora. Se llega en **≤ 3** a la tienda y al volumen.
- Ninguna baldosa visible del menú cierra el menú sin hacer nada. Una prueba recorre todos los `#mMenu button:visible` y comprueba que cambian el estado o abren una hoja.
- Con «Más» cerrado, el menú cabe sin desplazamiento en 390×844, 844×390 y 1280×800, con Ajustes y Cómo jugar visibles.
- No hay rótulos de sección sin entradas visibles.
- «Explorar» y «lugares» aparecen con un solo sentido en todo `index.html`.
- Todos los botones de cierre inferiores dicen «Cerrar».
- Ningún control de menú baja de 44 px y ningún texto de menú baja de 12 px.
- En la hoja de Cuenta no aparece «para jugar».
- Lo mido en capturas y en el DOM. Validar que se entiende exige probarlo con personas nuevas, y eso aún no se ha hecho.

---

## Opinión en una frase

El menú tiene el mejor botón posible arriba y la accesibilidad bien resuelta, pero debajo esconde lo que el juego premia (lugares, estrellas, bitácora) detrás de un «Más» y un interruptor de vista, y usa las mismas palabras para cosas distintas: hay que reordenar, no añadir.
