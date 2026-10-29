# El Refugio · casa viva

Sistema construido, incluido en main alpha.200, refinado en alpha.207 y simplificado en alpha.234 («Refugio simple», rama `jay/h2-refugio`). [Traspaso](../HANDOFF.md) · [mundo](MUNDO.md). El plano antiguo 2×2, las fases C0–C5 y la casa de muñecas recorrible describen su historia en Git; no son trabajo pendiente.

**Para mirar y escuchar, no para administrar** (Jay, 28 de octubre de 2026: «cada vez que veía el Refugio más me agobiaba y no hacía nada»). Lo ganado se coloca solo; moverlo es opcional; solo avisa cuando hay algo nuevo.

## Vista y habitaciones

Una sola pantalla: la casa de frente, entera, sin cámara ni escaleras. Las cuatro salas se ven de un vistazo. Las flechas y los toques no mueven el cubo; queda donde se guardó (`playerRoom`, `x`). En horizontal, la casa encaja a la izquierda del panel lateral. La Voz va bajo el último rótulo, fuera de todas las salas; si no cabe, vuelve arriba (panel 11, Q4). Los rótulos se miden con `measureText`: nunca cruzan el borde, otro texto ni una línea del marco; si no caben, se usa el nombre corto («Jardín») o no se dibujan. Rótulos a 4,5:1 o más. El cubo es pequeño y conserva su tamaño. En teléfono, la pared «★ N / 33» no se dibuja (el HUD lo dice; el estante sigue abriendo Lugares) y los trofeos se encogen para no pisarse.

Las habitaciones se abren por lugares completos o por ★, lo que ocurra primero (panel 10, P8, D3-B). Nunca por días. Una sala cerrada es una silueta: su nombre arriba y, en medio, solo la condición más cercana, con un número: «Se abre con 3 lugares más» (la menor parte que falta; empate, lugares). Tocarla dice lo mismo. La regla no cambia:

| ID conservado | Nombre | Lugares / ★ |
|---|---|---|
| `sala` | Eco | 0 / 0 |
| `jardin` | Jardín de voces | 6 / 9 |
| `azotea` | Cielo | 8 / 15 |
| `sotano` | Raíz | 11 / 24 |

El Viaje deja cinco lugares completos; la primera sala nueva pide uno más. Migración: al cargar un guardado cuya casa no tiene `roomRule: 2`, se suman a sus salas abiertas las que abría la regla antigua (3/7/14 días o 8/20/40 logros). Ninguna sala abierta se cierra. Una casa de versión futura no se toca.

Fuente: `src/house-model.js`. Se guardan IDs antiguos para no mover objetos ni invalidar visitas.

## Se decora sola

`src/house-auto.js` (modelo puro, sin RNG: `hashKey`) coloca lo que ganas y no está en la casa. Cada cosa tiene su sala: el primer pulso en Eco, los recuerdos de lugares en el Cielo, lo vivo en el Jardín de voces y las cajas en la Raíz. Una sala cerrada presta su sitio a Eco; al abrirse, lo automático se muda. El sitio depende solo del objeto y de la sala (paso del compás repartido de cinco en cinco, una fila por sala lejos de lo que ya muestra), así que lo nuevo nunca mueve lo anterior.

- Marcas en la casa: `autoRule: 1` (migrada), `auto: true` (colocado solo), `fresh: true` (llegó tras la migración; se marca en blanco al entrar y se borra al salir) y `away` (guardado a mano: no vuelve solo).
- Lo colocado a mano no lleva `auto` y no se mueve nunca. Al migrar, todo lo que ya había cuenta como colocado a mano.
- Ya estaban a la vista sin colocar: trofeos y ★ (Eco), tarjetas enmarcadas, constelación de logros, piezas compradas (columnas de la Raíz) y visitas. Nuevo: las constelaciones del Mapa del cielo, hasta 28 en lo alto del Cielo; tocar una dice su nombre.
- Los objetos se dibujan en blanco: el dorado queda para ★ y ✦ (panel 11, Q1). Un color de cápsula se sigue viendo.

## Cielo de días

Racha suave (alpha.236, rama `jay/volver`; reglas en [El mundo](MUNDO.md#ganas-de-volver)). Encima de la casa, en el cielo libre, una estrella blanca por cada día que jugaste, en orden, de izquierda a derecha y fila a fila; las últimas filas quedan a la vista. Los días seguidos se unen con un hilo fino; el hilo de ahora brilla un poco más y la estrella de hoy respira (quieta con movimiento reducido). En pantalla ancha, sin sitio encima, el cielo va a la derecha del Cielo. El rótulo («19 estrellas · 5 días seguidos», «Juega hoy y se enciende una estrella.» sin estrellas) se mide como los demás y no pisa textos, marco ni la Voz. Tocar el cielo: «Cada día que juegas enciende una estrella. Si faltas, se quedan.». La posición de cada estrella depende solo de su número (`hashKey`), así que la de mañana no mueve las de hoy. No se dibuja de visita en otro refugio. Blanco, no dorado: no es ★ ni ✦.

## Botones

Tres a la vista, del mismo ancho: **Escuchar**, **Colocar** y **Salir**. Encima, una línea con el siguiente paso: lo nuevo, lo que hace Colocar o el siguiente lugar («Siguiente: Bosque.»).

- **Escuchar** (`#houseListen`): la casa toca lo que tiene durante cuatro compases con `house-audio.js` (mismas voces, armonía, notas y eco por sala), cada sala tan cerca como la del cubo; la barra de pasos se ilumina. «Parar» lo corta. Sin Escuchar, la casa no secuencia sus objetos: suenan su aire y lo que tocas. Sin sonido, la línea lo dice.
- **Colocar** (`#housePlace`, «Listo» para salir): arrastrar un objeto lo mueve; fuera de la casa, se guarda; tocar una pared pone el objeto elegido en la lista. Mirar nunca arrastra.
- **Salir** (`#houseExit`).
- **«Más»** (`#houseMore`, cerrado al entrar): Lugares, Taller (el secuenciador anterior; cuenta para «Disco del Taller»), Prisma · 60 ✦ (el primer toque pregunta, el segundo abre la cápsula; precio y premios iguales), Código (visitas de solo lectura) y Jardín de voces con sus conjuntos. «Ver refugio» queda oculto. El Prisma y el disco del Taller ya no se dibujan en Eco ni responden a Enter.

Tocar un objeto lo hace sonar; tocar un trofeo, una tarjeta, una ★ de logros, una constelación o una visita dice su nombre. Tocar un trofeo recuerda su capa de Tu canción. Menús silenciosos.

## Un solo aviso

El botón Refugio del menú lleva un punto blanco cuando hay algo nuevo **a la vista** desde la última visita: trofeos, ★, objetos, constelaciones, voces, tarjetas enmarcadas, piezas, visitas o salas. Lo de una sala cerrada espera a que se abra. Al entrar: «1 nuevo» en blanco y «Nuevo: 1 trofeo, 2 ★» durante 8 s; queda visto (`house.seen`, `v: 2`) y el punto se apaga. Sin nada nuevo no hay punto ni texto; «Prisma listo» ya no se anuncia.

## Jardín de voces

Se llena solo, cuando la sala está abierta, con tus cuatro voces más oídas: las tarjetas oídas en más momentos (`learning.contexts` y observaciones), después la más rara y la más nueva. Van en lo alto del Jardín (`garden.auto`) y siguen a tus voces mientras no elijas. Si eliges una en el libro, quitas una o cargas un conjunto, la elección es tuya (`garden.manual`) y no cambia sola. Un jardín ya elegido antes de alpha.234 se respeta. El libro permite elegir hasta cuatro voces; su propiedad permanece en la colección.

Añadir, retirar, guardar/cargar conjuntos y mover posiciones se confirman al escribir. Si falla, se restaura la disposición y no se anuncia éxito. El arrastre fuera tampoco consume ni pierde una tarjeta.

## Guardado y compartir

Modelo de casa versión 2: migra versión 1, conserva campos desconocidos y abre versiones futuras para lectura. El Refugio simple no sube la versión: sus marcas son campos nuevos que una versión anterior conserva sin usar. WH1 conserva compatibilidad con casas de objetos; WH2 añade adornos/tintes. Las visitas son de solo lectura y no mezclan la colección del dueño con la propia.

Módulos: `house-model.js`, `house-auto.js`, `sky-streak.js` (cielo de días), `house-view.js`, `house.js`, `house-audio.js`, `house-collection.js`, `house-capsules.js`, `house-guide.js`, `collection-garden.js` y `refugio-lugares.js`.

Tienda y apariencia viven solo en Tu cubo (Llevar, Tienda, Chispas), donde se gastan las chispas; el Refugio no tiene accesos a ellas.

## Estado comprobado

Las regresiones E verifican colocación, visitas, lectura futura, cuota agotada, rollback, arrastres reales y recarga. [Evidencia](panel/candidato-e/informe.md). alpha.234: `tests/refugio-simple.mjs` (colocación determinista, migración v1/v2, aviso) y los recorridos de la casa ajustados a una pantalla. Lectura física, escucha en teléfono y comprensión con personas siguen pendientes; la casa no es un paso obligatorio al cerrar el Viaje.
