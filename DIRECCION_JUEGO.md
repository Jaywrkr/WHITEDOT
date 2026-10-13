# Dirección del juego: una práctica creativa que se vuelve mundo

## Nueve mejoras de jugabilidad seleccionadas por Jay

Las nueve mejoras seleccionadas ya están implementadas; ver [JUGABILIDAD_CREATIVA.md](JUGABILIDAD_CREATIVA.md) y su cadena de entregas. Jay descartó la opción 7 de la lista presentada: guardar ideas musicales, conexiones y ajustes mientras evoluciona el ambiente. No se añade esa función al nuevo plan; esto no elimina los favoritos ni los guardados que ya existen.

1. Un primer recorrido con sentido: Camino → descubrir un lugar → transformar su música → llevar la experiencia al Estudio, sin exigir una nueva función de guardar ideas.
2. Gestos descubribles mediante respuestas visuales pequeñas: tocar, permanecer, girar y conectar.
3. Crear también retirando capas, dejando silencio y reduciendo el groove.
4. Objetos con varios gestos y posibilidades para jugar un buen rato en un mismo lugar.
5. Retos musicales abiertos, como un jardín, diálogo con criaturas o ruta luminosa, con varias soluciones.
6. Hallazgos raros que habiliten una interacción o un instrumento, además de coleccionar.
7. Orientación mediante sonidos lejanos y pistas, sin consultar un mapa constantemente.
8. Una Voz contextual que recuerde descubrimientos, ayude cuando haga falta y deje espacio durante la creación.
9. Separar exploración con recursos de composición tranquila, para poder crear sin que la linterna interrumpa.

Prioridad recomendada: primer recorrido, gestos descubribles y creación por sustracción. Jay autorizó posteriormente las nueve mejoras, las diez familias nuevas y una revisión final.

## Qué une el proyecto

Propuesta para Jay, no una historia ya implementada: **cada día recoges atención en el Camino, en el Mundo la conviertes en música y en el Estudio conservas lo que quieres volver a trabajar**. La constancia abre posibilidades; explorar encuentra materiales; escuchar y quitar también son crear. Eso une lo que Jay ha descrito sobre música, creación y constancia sin inventar una biografía ni convertir el juego en una lista de tareas.

El jugador no necesita llenar el vacío. Puede decidir que un lugar tenga un bajo, un intercambio breve o silencio. El propósito sería descubrir un paisaje, aprender su lenguaje, darle una forma musical y decidir qué conservar. El crecimiento se percibe por nuevas capacidades y relaciones, no solo por contadores.

## Lo que ya se implementó en este pedido

| Rama, en orden después de 11 | Resultado |
|---|---|
| `feat/12-musical-influence` | Acciones transforman arreglo de bajo/groove/motivo/espacio; cultivar aros/prismas por permanencia. |
| `feat/12a-optional-sound-pins` | Fijación voluntaria, reemplazo por papel y liberación tocando el anillo. |
| `feat/12b-patch-gardens` | Módulos y cables físicos que controlan composición regional; conexiones guardadas y sonidos afinados. |
| `polish/12c-mobile-space` | Un acceso permanente, herramientas a pedido, detalles voluntarios y feedback local. |
| `fix/12d-contact-intent` | Paisaje tradicional distingue un contacto nuevo de permanecer encima; muestra inicial de Bajo/Groove/Motivo. |

Ese bloque histórico no incluía cajas. La primera versión de cajas y encuentros ya está en main; esta nueva rama profundiza redes, cajas y frases aprendidas. Cuerdas tensables, personajes y capítulos narrativos siguen pendientes. No se deben marcar como hechos por pertenecer al mismo bloque del plan antiguo.

## Orden que recomiendo para continuar

1. **Unir el primer recorrido.** Afinar la transición Camino → Mundo → Estudio, con una introducción breve en la que tocar, permanecer, conectar y retirar tengan un resultado audible. No añadir cinco tutoriales seguidos ni exigir grabar. Una primera visita puede terminar guardando un lugar o una idea; no necesita conseguir una reliquia.
2. **Ordenar los verbos y la Voz.** Un vocabulario: tocar = responder, permanecer = cultivar, conectar = transformar, fijar = repetir por elección, retirar = hacer espacio, guardar = recordar. Una Voz que observa el contexto y ofrece la siguiente posibilidad solo cuando hace falta. Mantener humor, pero revisar burlas al empezar, por fallar un día o por tocar fuera del beat. Dar mensajes relacionados con lo que ocurre, evitar acumulaciones de logros/anuncios/rumores que compiten por pantalla.
3. **Definir qué se conserva.** Distinguir claramente identidad del lugar, objetos/cables guardados, favoritos, sonidos temporales y composición del Estudio. Jay descartó añadir una «idea musical» guardable. Mantener favoritos y las reglas actuales de objetos/cables guardados; no añadir persistencia de escenas musicales en esta cadena.
4. **Hacer la exploración significativa.** Pistas sonoras, señales locales y rutas a rarezas; hallazgos que enseñan una interacción o desbloquean una herramienta expresiva. Preferir pequeñas cadenas de descubrimiento frente a recoger cantidades grandes de objetos equivalentes. Evitar que una reliquia rara sea solo un nombre y color distintos.
5. **Revisar el ritmo de progreso.** Separar escuchar/crear de perseguir rachas. Evaluar un modo de escucha tranquila que no corte una composición por linterna, conservando la exploración con sus reglas. El modo de creación tranquila ya evita el gasto de linterna por elección. Revisar recompensas repetitivas y logros arbitrarios sigue siendo propuesta; la exploración y el crecimiento diario conservan sus reglas.
6. **Consolidar antes de ampliar.** Límites de memoria/cachés en viajes largos, recuperación de guardados, offline correcto, límites compartidos de sonido y una prueba móvil prolongada. Revisar mezcla por familias de bajo/batería/motivo/ambiente, no corregir todos los casos con más volumen. Comparar grabaciones de varios minutos y fatiga en dispositivos reales.
7. **Añadir pocas familias con mucha profundidad.** Cajas musicales y cuerdas primero: abrir/cerrar, tensar/soltar, sostener/retirar con respuestas distintas por región. Cada familia debe servir para jugar varios minutos con la composición. Después combinar vidrios, espejos y módulos mediante contratos comunes; no multiplicar sistemas desconectados.
8. **Introducir lugares con historia e influencias culturales.** Flora, fauna, materiales, movimiento, escala y ritmo relacionados, con pistas y encuentros originales. Muchas culturas y épocas como fuentes, sin reducirlas a una decoración o asignarles un único género. Nuevos personajes deben responder musicalmente y aportar contexto o una capacidad.
9. **Música compartida.** Solo después de ordenar sincronía, propiedad de acciones, presupuestos y escenas: dos puntos que se encuentran, se escuchan y aportan papeles complementarios. Evitar que dos radios y todas las interacciones compitan con el mismo nivel.

## Qué reduciría o quitaría

- Contadores y herramientas permanentemente encima del paisaje: ya se redujeron; mantener esa regla en lo nuevo.
- Notas repetidas por seguir encima de un objeto: corregidas en esta cadena. Repetir debe venir de ambiente musical, una conexión o elección de fijar.
- Popups por pequeñas acciones que no enseñan nada: priorizar señales locales y Bitácora consultable.
- Premios por repetir golpes y recorridos sin resultado musical: revisar para que el juego valore descubrimiento y composición.
- Más objetos que solo cambian forma/color y disparan el mismo tipo de nota: exigir un verbo o relación nuevos antes de incorporarlos.

## Cómo sabremos si va mejor

En una visita de cinco minutos, el jugador debería poder escuchar la identidad del lugar, transformar al menos dos partes sin caminar constantemente, deshacer su decisión y guardar una referencia para volver. La interfaz no debe tapar el paisaje ni obligar a memorizar iconos. Una segunda región debería ofrecer otra forma de componer, no solamente otra escala o un nombre nuevo.

La cantidad de semillas sigue siendo una capacidad del generador. El objetivo jugable es variedad reconocible, relaciones y decisiones: tener motivos para quedarse, volver y descubrir.
