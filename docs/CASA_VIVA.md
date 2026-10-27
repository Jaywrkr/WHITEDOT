# El Refugio · casa viva

Sistema construido, incluido en main alpha.200 y refinado en el candidato alpha.207. [Traspaso](../HANDOFF.md) · [mundo](MUNDO.md). El plano antiguo2×2 y las fases C0–C5 describen su historia en Git; no son trabajo pendiente.

## Vista y habitaciones

Casa de muñecas recorrible con cámara, escaleras y vista general. En horizontal, la casa encaja a la izquierda del panel lateral y la Voz habla sobre el panel. En vertical, la Voz va bajo el último rótulo de sala, en la franja libre antes del panel; si no cabe, vuelve arriba (panel 11, Q4). Los rótulos de habitación se miden con `measureText`: van tras la esquina de la sala y nunca cruzan el borde, otro texto ni una línea del marco; si no caben enteros, no se dibujan (tocar la sala lo dice). La barra de pasos y la luz de cada sala quedan sobre su suelo. «PRISMA» va encima del prisma. Rótulos de sala, Taller, Prisma y Núcleo a 4,5:1 o más. El cubo conserva sus controles y tamaño aprobados. Las habitaciones se abren por lugares completos o por ★, lo que ocurra primero (panel 10, P8, D3-B). Nunca por días. El rótulo de una sala cerrada muestra solo la condición más cercana, con un número: «Cielo · faltan 3 lugares» (la menor parte que falta; empate, lugares). Tocarla dice lo mismo. La regla no cambia:

| ID conservado | Nombre | Lugares / ★ |
|---|---|---|
| `sala` | Eco | 0 / 0 |
| `jardin` | Jardín de voces | 6 / 9 |
| `azotea` | Cielo | 8 / 15 |
| `sotano` | Raíz | 11 / 24 |

El Viaje deja cinco lugares completos; la primera sala nueva pide uno más. Migración: al cargar un guardado cuya casa no tiene `roomRule: 2`, se suman a sus salas abiertas las que abría la regla antigua (3/7/14 días o 8/20/40 logros). Ninguna sala abierta se cierra. Una casa de versión futura no se toca.

Fuente: `src/house-model.js`. Se guardan IDs antiguos para no mover objetos ni invalidar visitas.

## Interacción musical

Toca el espacio para caminar, pasa junto a un objeto para escucharlo, arrastra para colocarlo y arrastra fuera para guardarlo. Taller conserva el secuenciador anterior.

Los40 objetos del catálogo se agrupan en Puedes colocar y Por descubrir. La posición horizontal conserva su paso y la vertical su nota; cada habitación aporta filtro/eco. `house-audio.js` usa las voces y armonía del juego. Luces y recorrido de compás siguen la salida audible estimada; menús silenciosos.

Trofeos, tarjetas enmarcadas, piezas compradas, visitantes y cápsulas hacen visible lo ganado. Tocar un trofeo permite recordar su capa de Tu canción; Lugares conserva el siguiente destino.

## Jardín de voces

El libro permite elegir hasta cuatro voces; su propiedad permanece en la colección. El contador y cada tarjeta indican selección, capacidad y formatos de solo lectura. Ir a mi Refugio reutiliza el acceso existente.

Añadir, retirar, guardar/cargar conjuntos y mover posiciones se confirman al escribir. Si falla, se restaura la disposición y no se anuncia éxito. El arrastre fuera tampoco consume ni pierde una tarjeta.

## Guardado y compartir

Modelo de casa versión2: migra versión1, conserva campos desconocidos y abre versiones futuras para lectura. WH1 conserva compatibilidad con casas de objetos; WH2 añade adornos/tintes. Las visitas son de solo lectura y no mezclan la colección del dueño con la propia.

Módulos: `house-model.js`, `house-view.js`, `house.js`, `house-audio.js`, `house-collection.js`, `house-capsules.js`, `collection-garden.js` y `refugio-lugares.js`.

## Estado comprobado

Las regresiones E verifican colocación, visitas, lectura futura, cuota agotada, rollback, arrastres reales y recarga. [Evidencia](panel/candidato-e/informe.md). Lectura física, escucha y comprensión con personas siguen pendientes; la casa no es un paso obligatorio al cerrar el Viaje.
