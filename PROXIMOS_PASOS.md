# Próximos pasos: estado real del proyecto

El bloque anterior de veinte entregas está integrado en main desde el PR #58 (`2959313`). Se agrupó en cinco fases para revisar; no equivale a haber implementado todo el plan histórico.

## Entrega actual

`feat/resonant-ground` reemplaza las cajas por suelo interactivo. Su continuación `feat/chained-musical-trails` añade una búsqueda de tres huellas y un instrumento dormido. Orden completo de ramas nuevas: [RAMAS.md](RAMAS.md). Estas entregas se prueban en Semillas como **Suelo resonante** y **Rastro musical · instrumento dormido**.

## Primera entrega de esta secuencia: profundizar interacciones

Rama `feat/deep-musical-encounters`, basada en ese main. Incluye:

- Tejedoras: redes de hasta seis hilos entre anclas y objetos cercanos; arrastre o dos toques para conectar, tocar un hilo para retirar. Red evaluada como figura finita, incluso si contiene ciclos visuales.
- Animales: mantener su cuerpo inicia dos compases de escucha. Aprende solo notas causadas por el jugador, conserva ritmo/contorno en una respuesta compacta y responde por turnos. No escucha micrófono ni guarda grabaciones. Tocar sigue cambiando papel y arrastrar sigue acercando criaturas.
- En la primera versión, cajas (ahora sustituidas por suelo resonante): tres piezas y 16 pasos editables; seleccionar, pintar, cambiar posición, silenciar con permanencia y cerrar la tapa. Modifican el arreglo existente; el groove conserva el pulso base y controla sus detalles. No es todavía un constructor libre de máquinas de cualquier tamaño.
- Descripciones, pistas, Bitácora y tres logros relacionados. Se conserva la interfaz discreta y el presupuesto compartido de respuestas.

**Cómo probar:** Menú → Prototipo → Semillas → Encuentro de prueba → Criatura tejedora, Animal de intercambio o Suelo resonante. Los estados manipulados son temporales; la opción de guardar ideas musicales fue descartada. Descubrimientos/logros sí se conservan.

## Orden de continuación

### Corrección prioritaria de dirección visual e interacción

Antes de ampliar instalaciones, se ha rediseñado la caja editable en `feat/organic-musical-seedpods`: la cuadrícula se sustituye por una vaina de semillas y núcleos, sin panel opaco. Mantener la capacidad de variar bajo, groove y melodía mediante formas del mundo: raíces que se tensan, pétalos que se desplazan, cuerpos que giran o conexiones entre objetos. Raíces, pétalos y otras formas son candidatos para futuras familias; la edición de semillas y núcleos ya existe y ahora se integra en el suelo resonante, sin objeto caja. El gesto debe producir una decisión musical audible y depender del ambiente, con límites de mezcla y afinación regional.

Toda incorporación debe compartir el lenguaje natural y electrónico del juego: fondo negro, jugador blanco, color localizado en elementos y efectos. Objetivo de diseño para una interacción activa: ocupar menos del 20 % de pantalla y evitar acercarse al 30 %, comprobando móvil vertical y horizontal. Evaluar también la suma de efectos simultáneos; evitar paneles, cuadrículas de teclado y efectos extensos que tapen el recorrido. La vaina cumple el objetivo en las tres pantallas probadas; sigue siendo necesaria una revisión del resto de elementos y sus efectos simultáneos.

Las culturas y las reliquias históricas específicas siguen pendientes. Japón y México son ejemplos dentro de muchas culturas; cada incorporación debe relacionar música, materiales, comportamiento, flora y fauna mediante investigación concreta. Referencias a compositores, inventores o artistas históricos pueden dar lugar a objetos raros y pistas musicales. Verificar el dominio público de la obra concreta y los derechos de cualquier grabación o imagen utilizada: la antigüedad del personaje no basta. Crear representaciones originales cuando corresponda. No confundir los estilos musicales actuales con esta capa cultural aún inexistente.

Esta actualización de dirección se conserva en `docs/organic-interaction-direction`, dependiente de `feat/deep-musical-encounters`. Esa rama solo modifica documentación. El rediseño del juego está en `feat/organic-musical-seedpods`, basada en ella: revisar interacciones, dirección y después vainas.

Cada paso se implementa, verifica, documenta, commitea y sube en una rama nueva. Jay crea PR y merge. Partir de main actualizado cuando la etapa anterior esté integrada; si se acuerda una dependencia, documentarla y conservar la ascendencia.

| Orden | Trabajo | Estado |
|---:|---|---|
| 1 | Profundizar familias existentes: redes, frases y cajas; después otros gestos si aportan decisiones nuevas | Esta rama implementa tres profundizaciones; ampliaciones restantes por evaluar |
| 2 | Unir vidrios, espejos y módulos en instalaciones musicales combinadas | Primera conexión regional en `feat/shared-installation-signals`; cableado libre y más combinaciones pendientes |
| 3 | Búsquedas encadenadas, puertas musicales, instrumentos dormidos y personajes originales | Rastro de tres etapas e instrumento dormido en `feat/chained-musical-trails`; puertas y personajes pendientes |
| 4 | Historia que una Camino/Mundo/Estudio, constancia y creación; Voz más contextual y referencias a Jay | Guía básica presente; historia completa pendiente |
| 5 | Culturas y épocas con música, materiales, flora/fauna y comportamiento relacionados; inventos y observatorios | Pendiente |
| 6 | Construcción musical, recetas, huertos de ritmo, escenarios/comunidades y maestros de ritmos | Pendiente |
| 7 | Encuentros de jugadores y composición compartida: red, reloj, armonía, propiedad y mezcla | Pendiente, sin proveedor/backend seleccionado |

### Entrega anterior: vaina de semillas, sustituida por suelo resonante

La rama `feat/organic-musical-seedpods` mantiene los datos musicales y gestos de la caja, pero reemplaza las teclas por 16 semillas sobre un contorno elíptico y tres núcleos orgánicos. Sin fondo opaco ni cuadrículas. El brote inferior permite cerrar; las semillas activas y el pulso actual se distinguen por relleno y halo. La forma cerrada también se reemplaza por una vaina. Geometría compartida para dibujo y contacto; prueba de blancos distintos y envolvente inferior al 20 % en las tres resoluciones probadas. El cambio visual no amplía el catálogo de mundos ni añade culturas.

Verificación específica: lógica de interacciones, gestos de vaina en 390×844, 844×390 y 1280×800, diez familias de encuentros y recarga offline. No se modifican síntesis ni niveles de audio, por lo que las mediciones musicales de la etapa anterior no se presentan como nuevas mediciones de esta entrega.

## Nueva etapa: instalaciones que comparten una señal

Rama `feat/shared-installation-signals`, basada en `feat/organic-musical-seedpods`. El jardín modular conserva sus cables y suma tres fuentes de control: reloj, vidrios descubiertos o espejos descubiertos en su misma región. Mantener el aro del núcleo durante medio segundo cambia la fuente; arrastrar a una raíz o tocar núcleo y raíz conecta, y tocar una raíz conectada retira el cable. Los ángulos de vidrio cambian variante, fuerza y cadencia; las rutas reales de espejo distinguen reflejos parciales y conexión completa. Sin fuente descubierta o sin reflejos válidos, espera. Los datos de fuente se guardan con los cables; guardados antiguos usan reloj.

Se transforma el arreglo existente mediante influencia regional, sin sumar osciladores ni crear realimentación de audio. El reloj conserva el comportamiento anterior. Núcleos y hojas reemplazan los rectángulos dibujados; controles de detalle siguen disponibles al tocar sus cuerpos. Pistas, Bitácora y logro **Una misma instalación** reflejan la conexión efectiva. Esto no es aún cableado libre entre cualquier objeto ni una simulación eléctrica completa.

Para probar: Menú → Prototipo → Semillas → Encuentro de prueba → **Instalaciones conectadas · jardín modular**. La prueba coloca al jugador en el jardín inicial (2050, 900), en una partida separada. En esa región, los vidrios están en (1080, 900) y los espejos en (1600, 900): explorarlos y orientarlos antes de volver al módulo. Otras regiones conservan su distribución y rareza; no todas tienen los tres elementos.

Validación: 44 suites Node; conexiones por toque/arrastre, cancelación, selección por permanencia, ángulos reales, influencia, logro y persistencia en móvil y escritorio. Diez renderizados del secuenciador real con módulos conducidos por vidrios/espejos, minimal, tropical, dub, amapiano, nu-disco suave y ambient a 44,1 kHz: pico máximo 0,954510, sin muestras por encima de 0,98. Recarga offline con 69 módulos. Estas mediciones no sustituyen la escucha artística en equipos reales.

## Nueva etapa: suelo resonante en lugar de cajas

Rama `feat/resonant-ground`, basada en `feat/shared-installation-signals`. La Caja de posibilidades se elimina como objeto visible y pasa a ser una huella del terreno: tocarla o permanecer quieto cerca despierta sus raíces musicales. Se conservan los gestos de edición de Bajo, Groove y Motivo. El arco inferior permite dejarla reposar; ese reposo se respeta mientras permanezcas cerca, y el terreno vuelve a estar disponible al salir y regresar. Alejarse más de 180 unidades lo deja reposar automáticamente.

Sin caja, tapa ni contenedor; en reposo solo quedan pequeñas curvas sobre el piso. Las formas activas siguen siendo locales y transparentes. El suelo en reposo deja de modificar el arreglo o producir respuestas; la influencia anterior se disipa con el mecanismo existente. Pistas, selector de pruebas, Bitácora y nombre del logro se actualizan. Se conserva la clave interna `box` y el identificador `cajaEditable` para compatibilidad de descubrimientos, sin presentarlos como cajas en el juego.

Probar: Prototipo → Semillas → Encuentro de prueba → **Suelo resonante**. Gestos probados en 390×844, 844×390 y 1280×800, incluyendo despertar por permanencia, respetar reposo, alejarse y volver, edición, cancelación, logros y respuestas de animales. 44 suites Node y regresión de las diez familias.

## Nueva etapa: rastros musicales encadenados

Rama `feat/chained-musical-trails`, basada en `feat/resonant-ground`. Añade una búsqueda opcional de tres huellas sobre el suelo: permanecer quieto dos segundos con música activa en la primera; seguir sus puntos locales y responder a tres golpes en la segunda; mantener la última huella 650 ms para despertar un instrumento. La semilla elige entre cuatro figuras rítmicas de tres golpes; el primer toque captura el tempo local y hay margen para reintentar. Las etapas futuras permanecen ocultas; no se pueden saltar ni resolver con toques rápidos indiscriminados.

Un candidato por región terrestre, con probabilidad de generación de 1/16; posiciones y papel musical dependen de la semilla. En la prueba de 1.600 regiones aparecieron 71 rastros, pues el mar también se excluye. La rareza no garantiza que cada región contenga uno. Su sonido usa instrumentos y afinación de la región, alternando papeles de bajo, groove y motivo. Una pista puede emitir tres notas contenidas cada cuatro compases, compartiendo presupuesto con las otras instalaciones. El instrumento despierto responde a toques, sin sumar una capa ambiental continua ni un sonido de interfaz.

El dibujo usa pequeñas curvas, tres marcas de respuesta y puntos de orientación locales; sin panel ni flecha global. Las etapas se guardan hasta en 64 rastros por partida. Alejarse, silenciar, pausar o cambiar de pestaña limpia la respuesta rítmica parcial; no borra etapas completadas. Bitácora y logro **Algo estaba dormido** muestran el descubrimiento. Las pruebas vuelven a la etapa pendiente o al instrumento ya despierto.

Probar: Prototipo → Semillas → Encuentro de prueba → **Rastro musical · instrumento dormido**. No necesita encontrar primero un rastro raro; la partida habitual permanece separada. Culturas, reliquias históricas, puertas musicales y personajes originales siguen pendientes: esta entrega implementa una primera búsqueda y un instrumento dormido, sin dar por cerrado ese bloque.

Verificación: 45 suites Node; 30 recorridos de regresión de navegador; búsqueda completa mediante gestos reales en móvil vertical, horizontal y escritorio, incluyendo música apagada, orden, reintentos, cancelación, guardado y Bitácora. Recarga offline con 71 módulos. Seis renderizados reales de pistas junto a música regional densa en minimal, tropical, dub, amapiano, nu-disco suave y ambient: pico máximo 0,934887, ninguna muestra por encima de 0,98. La evaluación artística también requiere escucha humana.

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
