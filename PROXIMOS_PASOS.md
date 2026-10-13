# Próximos pasos: estado real del proyecto

El bloque anterior de veinte entregas está integrado en main desde el PR #58 (`2959313`). Se agrupó en cinco fases para revisar; no equivale a haber implementado todo el plan histórico.

## Paso actual: profundizar interacciones

Rama `feat/deep-musical-encounters`, basada en ese main. Incluye:

- Tejedoras: redes de hasta seis hilos entre anclas y objetos cercanos; arrastre o dos toques para conectar, tocar un hilo para retirar. Red evaluada como figura finita, incluso si contiene ciclos visuales.
- Animales: mantener su cuerpo inicia dos compases de escucha. Aprende solo notas causadas por el jugador, conserva ritmo/contorno en una respuesta compacta y responde por turnos. No escucha micrófono ni guarda grabaciones. Tocar sigue cambiando papel y arrastrar sigue acercando criaturas.
- Cajas: tres piezas y 16 pasos editables; seleccionar, pintar, cambiar posición, silenciar con permanencia y cerrar la tapa. Modifican el arreglo existente; el groove conserva el pulso base y controla sus detalles. No es todavía un constructor libre de máquinas de cualquier tamaño.
- Descripciones, pistas, Bitácora y tres logros relacionados. Se conserva la interfaz discreta y el presupuesto compartido de respuestas.

**Cómo probar:** Menú → Prototipo → Semillas → Encuentro de prueba → Criatura tejedora, Animal de intercambio o Caja de posibilidades. Los estados manipulados son temporales; la opción de guardar ideas musicales fue descartada. Descubrimientos/logros sí se conservan.

## Orden de continuación

### Corrección prioritaria de dirección visual e interacción

Antes de ampliar instalaciones, rediseñar la caja editable: su cuadrícula actual de teclas no representa la dirección deseada. Mantener la capacidad de variar bajo, groove y melodía mediante formas del mundo: raíces que se tensan, pétalos que se desplazan, cuerpos que giran o conexiones entre objetos. Estos son candidatos de diseño, todavía no implementados. El gesto debe producir una decisión musical audible y depender del ambiente, con límites de mezcla y afinación regional.

Toda incorporación debe compartir el lenguaje natural y electrónico del juego: fondo negro, jugador blanco, color localizado en elementos y efectos. Objetivo de diseño para una interacción activa: ocupar menos del 20 % de pantalla y evitar acercarse al 30 %, comprobando móvil vertical y horizontal. Evaluar también la suma de efectos simultáneos; evitar paneles, cuadrículas de teclado y efectos extensos que tapen el recorrido. Esta es una regla para el próximo diseño, no una garantía ya verificada para todos los elementos existentes.

Las culturas y las reliquias históricas específicas siguen pendientes. Japón y México son ejemplos dentro de muchas culturas; cada incorporación debe relacionar música, materiales, comportamiento, flora y fauna mediante investigación concreta. Referencias a compositores, inventores o artistas históricos pueden dar lugar a objetos raros y pistas musicales. Verificar el dominio público de la obra concreta y los derechos de cualquier grabación o imagen utilizada: la antigüedad del personaje no basta. Crear representaciones originales cuando corresponda. No confundir los estilos musicales actuales con esta capa cultural aún inexistente.

Esta actualización de dirección se conserva en `docs/organic-interaction-direction`, dependiente de `feat/deep-musical-encounters`. No modifica el juego; revisar primero la rama de interacciones y después esta documentación.

Cada paso se implementa, verifica, documenta, commitea y sube en una rama nueva. Jay crea PR y merge. Partir de main actualizado cuando la etapa anterior esté integrada; si se acuerda una dependencia, documentarla y conservar la ascendencia.

| Orden | Trabajo | Estado |
|---:|---|---|
| 1 | Profundizar familias existentes: redes, frases y cajas; después otros gestos si aportan decisiones nuevas | Esta rama implementa tres profundizaciones; ampliaciones restantes por evaluar |
| 2 | Unir vidrios, espejos y módulos en instalaciones musicales combinadas | Pendiente |
| 3 | Búsquedas encadenadas, puertas musicales, instrumentos dormidos y personajes originales | Pendiente |
| 4 | Historia que una Camino/Mundo/Estudio, constancia y creación; Voz más contextual y referencias a Jay | Guía básica presente; historia completa pendiente |
| 5 | Culturas y épocas con música, materiales, flora/fauna y comportamiento relacionados; inventos y observatorios | Pendiente |
| 6 | Construcción musical, recetas, huertos de ritmo, escenarios/comunidades y maestros de ritmos | Pendiente |
| 7 | Encuentros de jugadores y composición compartida: red, reloj, armonía, propiedad y mezcla | Pendiente, sin proveedor/backend seleccionado |

## Trabajo musical y técnico que acompaña las etapas

- Más instrumentos y estilos realmente distintos, por tandas; el catálogo actual tiene 52 estilos. La lista extensa de candidatos culturales y musicales se conserva en [PLAN_HISTORICO.md](PLAN_HISTORICO.md).
- Más efectos: chorus, phaser, flanger, resonadores, congelación breve y granular. Los efectos actuales permanecen.
- Mixer con rutas reales por bajo, percusión, acordes y melodía. Sustracción y cajas no equivalen a un mixer completo.
- Conversaciones y bandas más expresivas; lo de esta rama aprende una frase breve, no inteligencia musical general ni una partitura transportable.
- Escucha prolongada, repetición, transiciones, balance y fatiga en auriculares/altavoces. Mediciones técnicas no certifican preferencia musical ni un máster comercial.
- Vida ambiental: migraciones con recorridos, manantiales, criaturas gigantes y día/noche; clima/ríos/estaciones ya existen.
- Exportar audio/vídeo de sets y compartir archivos/códigos; hoy hay tarjetas PNG.
- Respaldo/exportación/importación del progreso, recuperación y límites restantes de cachés en viajes largos.
- Limpiar restos del slider musical, evaluar visibilidad de movilidad/gravedad y continuar pulido visual/móvil.

## Decisiones y límites

No reintroducir guardar escenas/ideas musicales como pendiente automático: Jay descartó esa opción. Favoritos y guardados existentes siguen presentes. Exportar un set es otra función distinta, aún propuesta.

No marcar como pendientes lo que ya existe: favoritos, regreso, autopilot, espejos, vidrios, radio que evoluciona en quietud, blobs, semillas de prueba, interfaz silenciosa y shell offline local completo. Tampoco marcar como terminado lo que solo tiene una primera versión.

## Validación de esta etapa

42 suites de lógica. Gestos nuevos probados en móvil vertical, horizontal y escritorio: conectar y retirar hilos, cancelar, pintar, reordenar/silenciar piezas, cerrar/reabrir tapa, aprender de un pulso real del canvas, ignorar ambiente y responder con audio. 29 recorridos de regresión de navegador y recarga offline con 68 módulos.

14 renderizados reales de audio ejercitan redes, cajas densas y respuestas aprendidas en minimal, tropical, dub y amapiano, más modo suave y 44,1 kHz. Pico máximo medido 0,954511 y ninguna muestra por encima de 0,98. Conserva presupuestos y afinación regional; la evaluación artística también requiere escucha humana.
