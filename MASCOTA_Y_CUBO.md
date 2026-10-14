# Mascota y Tu cubo

Entrega del 13 de octubre de 2026. Rama `feat/pet-and-cube`, sobre `feat/phase-06-cultural-exploration` (`165c376`). Main sigue en `8096c8d` (#77): integrar primero culturas y después esta rama; Jay crea los PR y hace merge. Una sola rama agrupa ambos sistemas, pruebas y documentación.

## Nacer jugando

Una mascota por partida/semilla de prueba. No existe selector de especie ni botón para comprarla o crearla:

- Golondrina o grulla: confianza de la bandada y 30 segundos de formación. Una se queda la primera vez que cumples la condición sin tener mascota.
- Luciérnaga: confianza, sincronía ≥90 %, cercanía y 20 segundos adicionales de quietud compartida con audio activo.
- Caja natural muy rara: stream propio `pet:box:v1`, aproximadamente 1/128 de las cajas naturales abiertas puede contener una. Los regalos de quietud/formación y las cajas de prueba regaladas no producen mascotas por esta vía.

Si ya tienes una, otros encuentros no la sustituyen. La especie y su semilla se conservan; el nacimiento no cambia el generador, los biomas, el catálogo de 52 estilos ni la identidad de los mundos.

## Vivir y hacer música

Sigue al cubo con retraso. Su cuerpo es una figura pequeña de curvas, alas o luz; al crecer añade detalles y un rastro corto. Conserva el fondo negro y el jugador se distingue con borde/halo blanco.

Aprende grados de las voces causadas por el jugador, hasta una frase corta acotada; conserva notas relativas, no audio grabado. Responde una tercera diatónica arriba, adaptada a la escala actual. La golondrina aporta melodía con reed/kalimba/flauta; la grulla usa bajo/sub/resonadores en MIDI 36–52; la luciérnaga responde con madera/conga/rim. Su semilla y etapa cambian la voz. Las melodías respetan el registro musical del lugar.

Pasa **el cubo** por ella: devuelve su frase. No tiene handler de dedo ni un panel de instrumento. Quietud: se duerme, baja la presencia y el volumen; puede cantar una frase breve cada ocho compases. Sus respuestas se limitan a una por compás y comparten presupuesto ambiental con instalaciones/bandadas; durante la llamada de un guardián guarda silencio. No se aprende a sí misma ni se añade al looper por emitir su propia respuesta.

Menús, escáner y pestaña oculta pausan actividad; mute/audio suspendido y claros de silencio impiden respuestas. La mascota permanece guardada y puede acompañarte en las capas del Mundo, usando su escala local. Camino/Estudio no acumulan convivencia ni muestran la criatura.

Cada ~18 segundos puede mirar cajas, aves lira o objetivos culturales **cercanos** en la superficie. Se adelanta unos 90 puntos durante un breve intervalo: tú decides seguirla. No crea flechas, rutas obligatorias ni teletransportes; no busca todo el universo ni hace una exploración remota del mapa.

## Crecer sin mantenimiento

El progreso depende del tiempo activo compartido y de regiones distintas, sin barra ni contador visible. Etapas internas: 10 minutos y 3 regiones; 30 minutos y 8; 90 minutos y 20. Hay más capacidad de frase, otros timbres, detalles de cuerpo y rastro de color. No hay alimentación, pérdida de progreso, castigo por ausencia ni crecimiento automático por cerrar el juego.

`S.pet`: especie, semilla, segundos, hasta 128 claves de regiones y hasta ocho notas validadas; capacidad de aprendizaje 4–7 según etapa. Las posiciones, contactos, búsqueda, sueño y respuesta pendiente son temporales. Nacimiento/frase guardan con la partida; el progreso se persiste periódicamente. Recarga/importación conservan lo compatible; reset/reemplazo descartan el estado temporal anterior. Dos nuevos logros y una tarjeta de Bitácora describen la compañía, sin números de crecimiento.

## Tu cubo

**Menú → Tu cubo** abre una hoja compacta con vista previa en movimiento, colores, estelas y halos. Es la única entrada nueva; no ocupa el dock del Mundo. Opciones de UI no lanzan sonidos ni pulsos. Soporta scroll en horizontal y respeta movimiento reducido en la vista previa.

Se reutilizan los seis colores y sus logros existentes. Blanco siempre disponible; el color del Estudio ya elegido se adopta si está desbloqueado. El panel y el selector del Estudio comparten la elección, ahora visible en el cubo del Mundo. El Camino conserva el blanco.

- Estela: nada; puntos con Mundo; línea con Cometa; notas con la respuesta de bandada.
- Halo: suave por defecto; cercano con Ritual; pulso con En tiempo. Halo/rastro acotados y borde blanco para mantener legibilidad.
- Ritual de quietud o Cometa pueden hacer oscilar la rotación ligeramente; la figura base sigue siendo un cubo.
- La elección tiñe el sonar y el brazo del Campo de escucha; no cambia armonía, volumen ni tempo.

`S.cube` guarda color/estela/halo. Valores inválidos o sin desbloqueo vuelven a opciones disponibles; el menú impide seleccionarlos. No se agregan pagos ni progreso técnico artificial.

## Probar y continuar

Laboratorio → Vida permite encontrar bandadas: quietud para confianza, después moverse y permanecer en formación. Las instrucciones de golondrinas/grullas/luciérnagas incluyen el nacimiento, sin un selector de mascota. Para comprobar colores, usa logros de la partida y **Tu cubo**.

Pruebas: `npm test`, `npm run test:browser`, `python3 tests/pet_mix.py`. El runner de audio incorpora también `pet_mix.py`. El atlas nativo añade nacidas/crecidas de las tres especies: **130 vistas** de familias y estados de referencia, no todas las semillas.

Lógica: **54 suites Node** aprobadas. Audio: **21 renderizados nuevos** de respuestas/quietud, tres especies, minimal/tropical/dub/ambient, normal/suave y 44,1/48 kHz; pico máximo de muestra **0,9511**, sin muestras ≥0,995. [Medición completa](scripts/pet-audio-validation.json). Los registros comprobados de grulla son MIDI 36–52. Es verificación de salida, no true peak/LUFS ni criterio de gusto musical.

Navegador: **37/37 recorridos** aprobados, con recarga offline de **95 módulos**. La prueba nueva desactiva webdriver y comprueba nacimiento/voz/contacto de las tres especies, persistencia, desbloqueos, UI silenciosa y reset en 390×844, 844×390 y 1280×800. Se repitió además el camino de una **caja natural real** rara después del reset, sin fabricar una caja de regalo. La escucha en teléfono físico sigue pendiente. Nuevas animaciones, más gestos y vínculos con la historia pueden ampliarse; no se añadió inventario de mascotas, cría ni cambio de especie.
