## Profundización posterior

La rama `feat/deep-musical-encounters` amplía las tres familias: redes libres, piezas/pasos de cajas y frases aprendidas. Instrucciones actuales en [PROXIMOS_PASOS.md](PROXIMOS_PASOS.md). Lo siguiente describe su primera versión, integrada en main.

# Jugabilidad creativa: guía de las veinte entregas

Las nueve mejoras seleccionadas y los diez elementos nuevos están implementados en una cadena de cinco ramas. La última entrega reúne correcciones y verificación. El orden está en [FASES.md](FASES.md). Jay conserva la creación de PR y los merges.

## Probar sin buscar un encuentro raro

1. Menú → Prototipo → Semillas.
2. Escribe una semilla o elige una existente; selecciona Amplio o Clásico.
3. En «Encuentro de prueba», elige una de las diez familias; visita esa semilla.
4. El encuentro aparece cerca del centro. Los animales aparecen en pareja. Toca su cuerpo, arrastra encima o permanece a su lado. Arrastrar el vacío sigue caminando.
5. Vuelve a Semillas y elige otro encuentro. «Mi partida» elimina los parámetros de prueba y recupera el guardado habitual.

Elegir un encuentro es una herramienta de prototipo: no concede sus descubrimientos antes de interactuar. La distribución natural no garantiza tener todas las familias en una región. Seleccionar otra familia no crea un nuevo guardado: las partidas de prueba siguen separadas por semilla y disposición, como antes.

## Las nueve mejoras

- **Recorrido:** la Bitácora conecta Camino, escuchar un lugar, transformar y crear en el Estudio. No obliga a grabar ni añade una función de guardar escenas.
- **Gestos:** pistas locales breves y descripciones en el escáner. Mantener el dedo en el vacío abre el escáner; hacerlo encima de un instrumento permite interactuar con él.
- **Sustracción:** tocar tu punto blanco reduce por turnos motivo, detalles de percusión y bajo. La composición recupera sus capas gradualmente. Durante una grabación explícita, ese toque sigue siendo un pulso para grabar; tocar un anillo azul siempre tiene prioridad para soltar o borrar.
- **Objetos profundos:** aros y prismas permiten tocar, cultivar y modelar. En un arrastre, el eje horizontal cambia la figura y el vertical la intensidad positiva o negativa.
- **Reto abierto:** transformar dos partes de dos maneras en un lugar. Puedes elegir libremente combinaciones de tocar, cultivar, modelar, conectar o retirar. Se registra en Bitácora y tiene un logro, sin cronómetro.
- **Rarezas útiles:** un eco antiguo enseña a sostener una parte permaneciendo junto a un aro; una constelación mágica añade evolución del motivo. No bloquea los gestos básicos ni altera la frecuencia original de hallazgos.
- **Orientación:** ecos discretos afinados al lugar y tres puntos locales orientan hacia reliquias cercanas; no requiere tener abierto el mapa.
- **Voz:** evita repeticiones y comentarios genéricos mientras creas; ofrece una posibilidad contextual tras un período de exploración. Los descubrimientos musicales tienen mensajes relacionados con sus gestos.
- **Crear sin prisa:** Menú → «Modo: crear sin límite» detiene el gasto de linterna y evita su expulsión por agotamiento, también en otras capas. Puedes volver a explorar con las reglas habituales. Completar el Camino sigue siendo la condición para entrar al Mundo; los cambios de día conservan sus reglas actuales.

## Las diez familias

| Familia | Acciones | Resultado musical |
|---|---|---|
| Nube amasable | Comprimir, estirar, soltar | Modela bajo y espacio; vuelve lentamente a su forma. |
| Criatura tejedora | Retirar hilos, cambiar uniones | Figuras y silencios; conexiones visibles alrededor de tres anclas. |
| Pozo de silencio | Elegir capa, ampliar radio, acercarse o alejarse | Absorbe una parte; no añade voz propia. |
| Semillas orbitales | Tomar o soltar en el ancla, modificar órbita | Figura de groove y bajo; órbitas alrededor del jugador mientras permanece cerca. |
| Piedra de capas | Descubrir, recubrir, variar velocidad | Apertura del motivo, espacio y selección de figura. |
| Animal de intercambio | Elegir papel, acercar dos criaturas | Bajo, percusión, motivo o acorde; llamadas y respuestas alternadas dentro del mismo presupuesto. |
| Corriente reversible | Invertir sentido, crear remolino | Invierte el motivo y repite una célula dentro del arreglo existente. |
| Flor de presión | Permanecer, elegir pétalo, tensar | Cultiva una parte; modifica motivo o silencios según el pétalo. |
| Escultura de sombra | Mover luz y proyección | La sombra abre y cierra pasos del bajo; los huecos dejan silencio. |
| Caja de posibilidades | Abrir, frenar ruedas, retirar piezas | Modifica bajo, groove y densidad; quitar piezas reduce la música. |

No son diez sonidos idénticos con formas diferentes. Tienen estado y gestos propios, y varias familias modifican directamente la secuencia existente. La afinación, el instrumento y, para distintas familias, el papel musical dependen de la región. Cada individuo también tiene una variante estable de movimiento, acento y figura. Nubes conservan su función grave, pozos su función de silencio y animales/pétalos permiten elegir partes explícitamente.

## Convivencia musical y visual

Los encuentros usan semillas separadas del terreno. Hay como máximo una familia por chunk (dos individuos si son animales); el mar no genera estos encuentros. Se combinan como máximo dos influencias próximas, limitadas entre −1 y 1. La caché nueva conserva hasta 64 chunks de encuentros; las voces regionales hasta 128 regiones. El paisaje previo mantiene sus coordenadas y sus identidades.

Una respuesta adicional de encuentro puede entrar cada dos compases como máximo; comparte el presupuesto de instalaciones con vidrios, espejos y pistas de descubrimiento. Los motivos nuevos tienen como máximo seis ataques y los bajos ocho. La radio del mundo sigue evolucionando. Pausar con un menú, silenciar o suspender audio detiene la evolución activa de estos encuentros.

El fondo permanece negro y el jugador blanco. Color y movimiento pertenecen a los objetos. Solo Menú permanece visible; pistas, herramientas y escáner aparecen por contexto o elección. Los paneles se desplazan en pantallas cortas, los nuevos controles tienen al menos 44 px y el teclado queda dentro del diálogo abierto. Escape cierra el diálogo y devuelve el foco; WASD recupera el movimiento al volver al mundo.

## Qué se conserva

Se conservan las preferencias de modo, progreso del recorrido, retos, capacidades aprendidas, descubrimientos y logros. Los estados manipulados de estos nuevos encuentros son temporales: no se implementó guardar ideas musicales, opción descartada por Jay. Favoritos, módulos, vidrios y espejos mantienen sus reglas anteriores de persistencia. Recorrer más de la caché de encuentros puede reconstruirlos desde su estado inicial.

El shell sin conexión incluye los módulos locales. Un módulo ausente falla como recurso ausente: no recibe HTML. Las fuentes externas pueden depender de red; el juego tiene fuentes de reserva.

## Alcance de la revisión final

Pruebas de lógica, navegador y renderizado real de Web Audio verifican determinismo, gestos, pausas, guardados, densidad y margen de salida. Las mediciones cubren los 52 estilos actuales y las diez familias nuevas; no significan que cada combinación haya recibido una sesión de escucha humana ni garantizan el sonido de un máster comercial en todos los altavoces.

Esta cadena no implementa multijugador, culturas adicionales, cadenas narrativas completas ni persistencia de escenas musicales. Esos temas siguen en el plan mayor. El total de mundos perceptualmente distintos no se obtiene multiplicando familias: [VARIEDAD.md](VARIEDAD.md) conserva el método de medición y sus límites.
