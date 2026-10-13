# WHITEDOT V1: inventario, expansión y criterios de publicación

Revisión del código y planes al 13 de octubre de 2026. Propuesta de alcance para Jay, no anuncio de funciones implementadas ni promesa de perfección absoluta. El objetivo es una V1 publicable con comportamiento comprensible, música cuidada, progreso recuperable y estabilidad comprobada.

## Estado y forma de trabajar

Main remoto verificado: `e3d3086`, merge del PR #64, incluye rastros musicales y suelo resonante. Los cambios posteriores de vidrios (`cfeac0c`) y animal (`991255a`) todavía no están en ese main. Este inventario se añade a la misma rama del animal; no abre otra rama de documentación.

La instrucción más reciente de Jay reemplaza «una función = una rama»: agrupar muchas mejoras relacionadas. Propuesta: una rama `release/v1`, varios commits de alcance claro, puntos de prueba por bloque y un PR final. Puede reunir vidrios y animal pendientes además del trabajo nuevo. Conservar ascendencia, incorporar main actualizado y resolver conflictos antes de pedir revisión. Jay sigue creando PR y haciendo merge. No se modifica main ni se despliega producción desde esta revisión.

## Variedad real y cómo interpretar los números

El juego ofrece un mapa continuo generado por coordenadas; las semillas de prueba producen otros mapas. Una región no es un universo separado.

| Medida actual | Resultado |
|---|---:|
| Biomas | 11 |
| Estilos musicales definidos | 52 |
| Identificadores de instrumento en paletas de género | 35 |
| Instrumentos descritos en Bitácora, incluyendo otros del motor | 38 |
| Regiones muestreadas en el mapa original | 40.000 |
| Recetas detalladas distintas, contando mar | 39.952 |
| Perfiles musicales básicos distintos, contando mar | 9.807 |
| Regiones terrestres / recetas detalladas terrestres | 23.418 / 23.418 |
| Perfiles musicales básicos terrestres | 9.732 |

Comparación controlada: cinco semillas × 1.600 regiones, tamaño clásico de 3.600 unidades. Promedio por semilla en esa muestra: 1.600 recetas detalladas, 947,6 regiones terrestres y 837,4 perfiles musicales terrestres. Son ventanas locales, no el promedio del tamaño total de un mundo ni una muestra representativa de todas las semillas. No equivalen a 837 canciones terminadas o 1.600 experiencias reconociblemente distintas.

Resultados y método en [VARIEDAD.md](VARIEDAD.md) y [scripts/v1-variation-sample.json](scripts/v1-variation-sample.json). Las firmas excluyen coordenadas, nombres, IDs y flotantes continuos. No enumeran el mapa completo y no demuestran millones de experiencias. Las últimas mejoras de interacción no agregaron biomas o géneros; aportaron maneras de transformar la música.

## Coordenadas, guardar y volver

Ya existen coordenadas `wx/wy`, regiones y capas. Favoritos guarda hasta 64 puntos con nombre, x/y, capa, región, género y datos de receta. Orientar y autopilot permiten viajar a ellos; entre capas hay que encontrar un acceso. No existe teletransporte universal. La partida habitual y cada combinación de semilla/layout de prueba tienen claves de almacenamiento separadas.

El lugar conserva su identidad en la versión actual; la radio sigue evolucionando. Favoritos no conserva el audio exacto que sonaba ni la frase temporal del animal. Jay descartó añadir escenas/ideas musicales guardables: no se reintroducen aquí. Exportar un set es una función separada, todavía pendiente.

Para V1 propongo una dirección completa de lugar: `{worldSeed, generatorVersion, layoutVersion, layer, x, y}`; además, nombre y fecha. El objeto favorito actual no contiene todos esos campos, aunque semilla/layout están implícitos en la partida. Agregar una etiqueta de versión no basta: hay que conservar el generador/catálogo correspondiente o una migración explícita. Añadir géneros cambia probabilidades y puede cambiar identidades antiguas; proteger favoritos antes de expandir.

El guardado hoy es localStorage. Se puede perder al borrar datos del navegador y no sincroniza dispositivos. Exportación/importación y recuperación deben preceder a una promesa de guardado fiable. Un código compartible de lugar debe incluir semilla/versiones/capa/coordenadas, sin publicar automáticamente datos del jugador.

## Inventario completo de trabajo

**P0**: bloqueo concreto o aceptación necesaria antes de publicar. **V1**: mejora recomendada para la primera edición, a cerrar por alcance. **Expansión**: objetivo conservado; su inclusión en V1 aumenta el trabajo y necesita decisión de alcance. No se cuentan propuestas como funciones terminadas.

### Base, guardado y producción

1. **P0 — Integración:** reunir cambios pendientes y contrastar lo que se prueba con el commit realmente publicado; no mantener numerosos PR de funciones aisladas.
2. **P0 — Guardado fiable:** validar estructura y versiones, detectar datos corruptos, fallos de cuota y almacenamiento bloqueado; avisar y recuperar sin borrar silenciosamente.
3. **P0 — Respaldo:** exportar/importar progreso con validación, copia previa y pruebas de recuperación; distinguir guardado habitual y pruebas de semillas.
4. **P0 — Identidad de mundo:** versionar generador, catálogo y layout, proteger favoritos y decisiones guardadas al ampliar contenido.
5. **P0 — Viajes largos:** residencia limitada de cachés regionales, biomas, continentes y chunks; regeneración determinista al regresar. Voces y encuentros ya tienen límites, el resto no está resuelto.
6. **P0 — Pruebas reproducibles:** automatizar lógica, navegador, audio y offline. `npm test` enumera 42 scripts y omite `glass_music`, `installation_signals` y `sound_trails`. Hay 45 scripts Node con aserciones y un ayudante Web Audio (`audio_mix.mjs`); el conteo histórico de 46 incluía ese ayudante, que no constituye una suite Node.
7. **P0 — Dispositivos:** verificar Safari/iPhone, Chrome/Android, escritorio y PWA instalada; memoria, batería, varios tamaños, auriculares, altavoz, cambio de pestaña, suspensión/reanudación y rutas largas. Los ensayos actuales de navegador se hacen en Chromium, no demuestran compatibilidad real con todos esos dispositivos.
8. **P0 — Actualizaciones:** actualización de caché sin mezclar versiones, restauración offline, vuelta atrás de una publicación y migración de partidas. El shell offline local ya funciona; las fuentes externas aún necesitan decisión de empaquetado.
9. **P0 — Operación:** versión de release identificable, registro acotado de fallos recuperables, instrucciones de soporte, créditos/licencias de recursos utilizados y política correspondiente a las funciones realmente publicadas.
10. **P0 — Regresión de reglas:** cambio de día, linterna, modo tranquilo, pausa, mute, capas y reset; confirmar que no interrumpen o pierden progreso inesperadamente.

### Música, mezcla y profundidad de composición

11. **P0 — Escucha curada:** sesiones de 10–30 minutos por familias, incluyendo quietud y transiciones; comparar cuerpo, claridad, groove, repetición, fatiga y graves/agudos en equipos reales.
12. **P0 — Mezcla común:** presupuestos de voces y transitorios para radio, gestos, clima, banda y pistas; subgrave ordenado, balance espectral, mono/estéreo, sidechain suave cuando corresponda, retornos limpios y dinámica; compensar niveles al cambiar instrumentos. Las mediciones actuales controlan picos, no certifican preferencia artística.
13. **V1 — Mixer real:** rutas separadas para bajo, percusión, acordes, motivo y ambiente, con mute/solo y entradas suaves; presentación compacta y opcional.
14. **V1 — Timbres nuevos:** modelos de cuerdas pulsadas, membranas, tubos, láminas, síntesis aditiva, FM más expresiva, tablas de onda y ruido articulado; identidades audibles y rangos por papel musical.
15. **V1 — Instrumentos personales del lugar:** ataque, cuerpo, articulación, resonancia, anchura y modulación según semilla/material/gesto; evitar contar cada preset como un instrumento nuevo.
16. **V1 — Expansión de estilos:** avanzar de 52 hacia 80 y después alrededor de 100 estilos solo cuando tengan baterías, bajos, armonía, timbres, swing y evolución propios. Esa cifra es una meta de catálogo, no contenido ya implementado.
17. **V1 — Desarrollo musical:** frases, silencios, variaciones, entradas, retiradas, tensión/resolución y secciones más largas; alternar comportamiento sin exigir desplazamiento del jugador.
18. **V1 — Mezcla entre vecinos:** mejorar afinidad de tempo, tonalidad, densidad y timbre; soportar cambios lentos/rápidos con transiciones agradables. Afinidad vecinal ya existe, necesita revisión artística.
19. **V1 — Escucha accesible:** perfil agradable por defecto, sensibilidad/intensidad opcional y variedad a volumen moderado, conservando estilos con carácter; no depender de más volumen para aparentar calidad.
20. **V1 — Efectos nuevos:** chorus, phaser, flanger, resonadores, freeze breve y granular con fuente/buffer definidos; bypass, colas, realimentación y coste acotados. Reverb, delay y efectos actuales ya existen.
21. **V1 — Banda y diálogos:** turnos, entradas/salidas, papeles complementarios y memoria breve más expresiva; adaptar respuestas al arreglo sin duplicar radio. El animal ya aprende una frase corta, no improvisa una conversación general.

### Mundo procedural y nuevas relaciones

22. **V1 — Contrato de contenido:** unir catálogo, encuentros, terrenos, fenómenos, instalaciones y recompensas bajo presencia/compatibilidad/rareza/versiones comunes. Hoy hay familias fuera de la firma de medición y contratos repartidos entre módulos.
23. **V1 — Identidad regional completa:** asociar sonido, terreno, flora/fauna, materiales, densidad, interacción y evolución; regiones escasas, medias y densas con motivos reales para permanecer.
24. **V1 — Matices dentro del bioma:** variaciones grandes de suelo y relieve visual, distribución y hábitat, con espacio suficiente para caminar y componer; los mundos de blobs y biomas amplios ya existen.
25. **V1 — Individuos distintos:** diferencias en temperamento, respuesta, movimiento y papel musical, con relaciones entre especies; rasgos individuales ya existen, falta más profundidad conductual.
26. **V1 — Objetos que colaboran:** cableado libre limitado entre vidrios, espejos, módulos y otros elementos; rutas acotadas, control de ciclos y decisiones claras. La conexión regional actual es un primer caso, no una red universal editable.
27. **V1 — Cuerdas luminosas:** tensar, soltar y sostener para articular graves, cuerdas o ritmos según el lugar; respuestas físicas y musicales, sin convertirlas en teclas.
28. **V1 — Suelo expresivo ampliado:** presión, fricción, ondas, crecimiento y sustracción; máscaras musicales y materiales diferentes. El suelo resonante ya sustituye las cajas; no reintroducir cajas como objetos.
29. **V1 — Luz y color:** profundizar vidrios, espejos, prismas y geometrías móviles con interferencias locales que afecten composición. Fondo negro, punto blanco, color localizado; inspiración geométrica y cromática, sin replicar obras específicas.
30. **V1 — Fenómenos nuevos:** aves especiales, semilleros de snares, descargas y cuerpos que se sacuden o vuelan con función musical diferenciada; varias primeras versiones ya existen, no empezar desde cero.
31. **V1 — Vida en quietud:** sucesión ambiental, conversaciones, visitas y cambios de arreglos con periodos largos; la radio y la iniciativa tras quietud ya funcionan.
32. **Expansión — Ecosistemas vivos:** migraciones reales, rutas estacionales, manantiales, gigantes y ciclo día/noche. Clima, lluvia, ríos y estaciones ya existen.
33. **Expansión — Relaciones persistentes del mundo:** cambios ecológicos o mecánicos ligados a intervenciones con límites y recuperación, sin convertir todo en grabaciones o escenas guardadas.

### Búsqueda, culturas y sentido

34. **V1 — Búsquedas variadas:** varias clases de rastros y maneras de resolverlas, pistas de oído/forma/comportamiento, recompensas que abren capacidades. El rastro de tres huellas ya existe; no equivale a todo un sistema de aventuras.
35. **V1 — Puertas musicales:** resolver ritmo, tensión o relación entre objetos para abrir un acceso, con ayuda local y alternativas visuales pertinentes.
36. **V1 — Instrumentos dormidos ampliados:** distintas condiciones de despertar, funciones regionales y regreso; un primer instrumento dormido ya existe.
37. **V1 — Rarezas valiosas:** reliquias difíciles de encontrar, condiciones variadas y rareza verificable, con recompensas expresivas; evitar premios que solo cambian nombre/color o se consiguen por repetir sin intención.
38. **V1 — Personajes originales:** viajeros, guardianes, coleccionistas y maestros, con conducta, función musical y recuerdos claros; diferenciarlos de la fauna genérica.
39. **V1 — Historia y Voz:** unir Camino → Mundo → Estudio con escuchar, crear y constancia, relacionado con la dirección de Jay; introducción breve, lenguaje coherente y menos avisos repetidos o burlas.
40. **V1 — Primeras culturas:** conjuntos investigados que relacionen música, materiales, flora/fauna, símbolos y acciones. Japón y México son ejemplos dentro de muchas culturas, sin asignar una tradición completa a un solo género.
41. **Expansión — Ampliación multicultural:** influencias andinas, afrodiásporas, distintas tradiciones asiáticas, mediterráneas y otras referencias concretas, incluyendo regiones sin influencia cultural; combinar con reglas justificadas, no decoración aleatoria.
42. **V1 — Historia musical y reliquias:** compositores, inventores y motivos históricos en representaciones originales; comprobar la obra concreta de dominio público y distinguirla de grabaciones/imágenes actuales con otros derechos.
43. **Expansión — Leonardo y mecanismos:** péndulos, ruedas, engranajes y dibujos que secuencien/modulen, además de observatorios y archivos que revelen música.
44. **Expansión — Maestros y partituras:** aprender patrones por llamada/respuesta, criaturas que responden a figuras y llevar aprendizajes al Estudio. Live coding real sigue siendo una función distinta del estilo algorave actual.

### Crear, construir y compartir

45. **V1 — Profundizar Estudio:** organizar instrumentos y papeles, editar/retirar con facilidad, articular mejor el secuenciador, coordinar banda y favoritos; explicar qué se conserva.
46. **Expansión — Construcción musical:** mecanismos orgánicos montables, redes sincronizadas, parar/desmontar, límites de tamaño y persistencia de construcción. No guardar automáticamente un audio o una escena musical.
47. **Expansión — Huertos de ritmo:** semillas crecen y cambian articulación por pulso/gesto, con secuencias legibles en el suelo, sin panel cuadrado ni obligación diaria.
48. **Expansión — Crafting:** recetas de materiales/sonidos descubribles, decoración, nombres de especies/lugares y conexión con Bitácora/Estudio.
49. **Expansión — Escenarios y comunidades:** lugares para actuaciones, baile y criaturas que reaccionen al groove; retos de mezcla que valoren composición y retirada de capas.
50. **V1 opcional — Exportar sets:** audio y vídeo cortos, archivos utilizables, límites de memoria y compatibilidad móvil. PNG ya existe. Exportar no publica automáticamente.
51. **V1 — Compartir lugares:** códigos con semilla, versión, layout, capa y coordenadas; identidad compatible al abrirlos y explicación si falta una versión. No transportar por defecto una composición congelada.
52. **Expansión — Sintetizador modular avanzado:** conexiones y modulaciones de síntesis editables, más allá de influencia regional; coste, fuentes y bucles claramente acotados.

### Interfaz y cierre de la experiencia

53. **P0 — Gramática de gestos:** aprender sin memorizar manual; tocar/arrastrar/mantener/quedarse tienen respuestas consistentes, con ayudas contextualizadas por familia.
54. **P0 — Espacio móvil:** orientación vertical/horizontal, zonas seguras, escalado de texto, objetivos táctiles, contraste y cancelación; efectos locales y revisión de la suma de objetos visibles. Objetivo de diseño: cada interacción activa por debajo del 20 % de pantalla, y bastante menos cuando sea posible; auditar escenas completas, no solo un objeto aislado.
55. **P0 — Menos ruido:** interfaz silenciosa, un acceso principal, ayudas a demanda, notificaciones ordenadas y límites de superposición. Los vidrios ya no tienen panel; decidir cómo simplificar el panel restante de espejos y módulos sin perder control.
56. **V1 — Accesibilidad:** teclado equivalente a gestos importantes, tamaño de texto, opciones de movimiento, señales visuales para desafíos sonoros y navegación de menús; revisar el bloqueo actual de zoom de la página.
57. **V1 — Limpieza:** retirar restos del slider de estilo y handlers antiguos, revisar exposición de gravedad/movilidad, textos y documentación que aún mencionan cajas/vainas históricas como si fueran actuales.
58. **V1 — Retorno comprensible:** favoritos, orientación, autopilot y capa visible; decidir viaje rápido opcional, evitando teletransportes accidentales o atajos que trivialicen búsqueda.
59. **V1 — Progreso justo:** logros relacionados con descubrimiento/creación, recompensas y rareza equilibradas, constancia sin castigo adicional por ausentarse.
60. **P0 — Prueba de primera sesión:** comprobar con personas nuevas que pueden entrar, transformar dos partes, retirar una decisión y guardar/volver a un lugar sin ayuda externa. Esta aceptación humana todavía no se ha realizado en esta revisión.

### Encuentros entre personas

61. **Expansión grande — Presencia compartida:** dos puntos distinguibles, mismo mundo/versión y encuentros; backend y proveedor aún no elegidos, sin multijugador implementado.
62. **Expansión grande — Jam compartida:** reloj/tempo/armonía comunes, asignación de papeles y propiedad, latencia y presupuesto conjunto; evitar dos radios compitiendo.
63. **Expansión grande — Fiabilidad de red:** reconexión, entradas/salidas, eventos idempotentes, límites de salas y controles apropiados a la modalidad publicada.
64. **Expansión grande — Guardado compartido:** sincronización opcional, visitas a Estudios, construcciones comunes y rastros de otras personas; cuentas/nube requieren un diseño real antes de prometerlas.

## Cómo aumentar una infinidad que se perciba

1. **Proteger identidad primero.** Versionar mapas y catálogos; un favorito debe seguir llevando a un lugar reconocible después de ampliar estilos.
2. **Separar sorteos sin perder coherencia.** Streams deterministas por terreno, instrumento, comportamiento, presencia, cultura y encuentros. El catálogo ya utiliza algunos streams independientes; extender ese principio a las familias repartidas, con compatibilidades y pesos explícitos.
3. **Diseñar recetas por varias dimensiones.** Género/familia + gramática + conjunto instrumental + articulación + swing + sección + hábitat + relaciones + densidad. Las dependencias impiden multiplicar todos los tamaños como si fueran independientes.
4. **Crear motores tímbricos, no solo más nombres.** Propuesta inicial: 50–60 instrumentos identificables y después ampliar según escucha; cientos de patches validados que conserven su papel musical. Un bajo puede ser pulsado, resonante, granular o FM y responder a gestos diferentes.
5. **Dar acciones distintas a los mismos ingredientes.** Un árbol puede sostener un bajo en una región y moldear percusión en otra; material, gesto y vecinos determinan articulación y desarrollo. La asignación de papel regional ya existe, falta que cambie más profundamente el comportamiento.
6. **Añadir interacción entre sistemas.** Una cuerda puede conducir un espejo, una criatura cambiar la articulación del suelo, lluvia activar membranas o módulos reorganizar una bandada. Una familia añadida debe alimentar varias recetas y encuentros.
7. **Componer en el tiempo.** Desarrollo de varios minutos, frases que descansan, estados con pocas voces, transformaciones lentas y respuestas a la intención del jugador. Evolución en quietud ya existe; profundizar forma y memoria breve.
8. **Dar forma espacial al descubrimiento.** Vecinos emparentados para mezclar, regiones con acentos propios y rarezas más lejanas o condicionadas. Evitar que la variedad sea ruido distribuido uniformemente.
9. **Medir diferencia útil.** Comparar perfiles de ritmo, espectro, instrumentación, armonía, densidad y verbos jugables; muestrear rutas reales y duración de sesiones. Revisar a oído pares que la firma declare distintos para detectar repetición perceptual.
10. **Meta verificable, no promesa:** auditar hasta un millón de recetas candidatas en lotes de semillas/regiones con memoria acotada, deduplicación y reglas de calidad; reportar cuántas sobreviven. Hoy hay 39.952 recetas comprobadas en una muestra. Un millón de firmas distintas seguiría requiriendo una evaluación musical y jugable.

### Familias musicales candidatas todavía por evaluar

Conservar la lista histórica, verificando duplicados y diferencias con los 52 estilos presentes: gqom, kuduro, baile funk, afro tech, 3-step, kwaito, highlife/Ethio-groove, afrobeat electrónico, Afro-Cuban house; cumbia digital, tribal guarachero, dembow/reggaetón electrónico, moombahton, bossa/salsa/latin house, dancehall, champeta, pasillo/sanjuanito electrónico; UK funky, grime, 2-step, jungle/halftime/future garage/bassline/big beat; trance, psy/goa, Balearic, Italo disco, synthwave, French house, electroclash, glitch, chillwave/vaporwave, city pop electrónico, J-ambient, Asian underground, maqam/Arabic house, Balkan electro, motorik, dub reggae/ambient techno, coldwave/industrial/witch house y R&B alternativo. No se incorporan variantes agresivas como opción obligatoria por defecto. No añadir un nombre para una receta equivalente.

## Paquetes de implementación dentro de una rama amplia

| Bloque de prueba | Trabajo agrupado |
|---|---|
| A — Base confiable | Integración, guardado/versiones/respaldo, cachés, CI, offline y dispositivos |
| B — Más música con control | Mezcla por rutas, timbres, formas largas, primeras tandas de estilos/FX, transiciones y escucha |
| C — Mundo que invita a quedarse | Catálogo común, terrenos/relaciones, cuerdas y suelo, instalaciones, búsqueda y primeras referencias culturales/personajes |
| D — Experiencia V1 | Estudio, retorno y compartir lugares, historia/Voz, accesibilidad, UI completa y pruebas humanas |
| E — Cierre de publicación | Candidata congelada, matriz de regresión y escucha, migraciones, actualización/rollback y correcciones finales |

Cada bloque puede tener muchos commits; no necesita una rama por objeto. Guardar builds/commits para probar sin imponer cinco PR. Mi recomendación es publicar primero una V1 individual y contemplativa con creación profunda, y continuar construcción/comunidades/multijugador como ampliaciones. Es una propuesta de alcance: si Jay necesita multijugador en V1, el bloque de red pasa a ser requisito de release y debe probarse en dos dispositivos reales antes de publicar.

## Criterios de aceptación para publicar

- Todos los P0 resueltos o retirados del alcance con una razón explícita; cero fallos críticos de audio, controles o pérdida de progreso en la matriz acordada.
- Guardar, actualizar, recuperar y volver a favoritos comprobados; reglas de día/linterna/capas legibles.
- Sesiones largas en dispositivos objetivos con presupuestos de memoria/audio medidos y sin crecimiento continuo injustificado.
- Pruebas de lógica, navegador, audio y offline incluidas en el flujo de release; no confundir scripts auxiliares con tests ejecutados.
- Escucha curada de géneros, transiciones y lugares quietos, junto a jugadores nuevos capaces de entender sus gestos.
- Interfaz consistente, silenciosa y discreta; documentación/Bitácora/ayudas coinciden con el comportamiento publicado.
- Un commit de candidata, versión y plan de actualización/rollback claros. Publicar la web no equivale a haber verificado todos esos criterios.
