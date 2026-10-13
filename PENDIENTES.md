# WHITEDOT: plan vigente y trabajo pendiente

Revisión: 2026-10-12. Contexto y arquitectura en [HANDOFF.md](HANDOFF.md); inventario de lo implementado en [CAMBIOS.md](CAMBIOS.md). Esta es la lista vigente, que sustituye los roadmaps superpuestos anteriores. Son etapas propuestas/acordadas, no autorización para ejecutarlas todas. Cada etapa ocupa una rama; Jay autoriza, prueba, crea PR y merge.

## Dirección que debe guiar todas las ramas

Jay quiere un mundo musical que se sienta enorme, diverso y vivo, en el que también valga la pena quedarse bastante tiempo en un mismo bioma haciendo música. Explorar no debe reducirse a caminar ni sembrar sonidos. Objetos móviles/estáticos, criaturas, luces, clima y acciones deben ofrecer funciones distintas; los individuos tampoco deben reaccionar todos igual.

La música debe tener groove, bajos, medios, espacio, motivos y evolución con sensación de electrónica cuidada; evitar agudos constantes, arpegios/fanfarrias de videojuego y variación aleatoria sin intención. La misma clase de objeto puede ser bajo en un mundo y agudo/percusión/acorde en otro. Endel, sintetizadores, moduladores/secuenciadores, Richie Hawtin y curaduría electrónica de distintas épocas orientan la intención; no son instrucciones de copiar temas. No Man's Sky, Astroneer, Minecraft y Stardew Valley orientan exploración, descubrimiento y permanencia en el mundo.

Las referencias ambient, minimal techno, tech house, deep house, andina, cosmic disco, nu-disco, melodic techno, microhouse, organic house/downtempo, dub techno, afro house, amapiano, jazztronica, Berlin School, IDM, progressive house, liquid DnB, darkwave/EBM y algorave ya tienen base implementada. Tropical, melódico, robótico y disco eran ejemplos, no categorías únicas. La sensación de infinitud debe venir de combinaciones con identidad, continuidad y descubrimiento, no solo de añadir nombres de géneros.

Escucha agradable para público amplio: controlar fatiga, disonancia accidental, subgrave, acumulación y brillo, conservando variedad. Escucha suave ya existe; todavía hace falta curaduría audible. Jay ama la lluvia; conservar su sensación. Viento de dunas ya reducido. Gravedad ya existe, pero Jay duda de su percepción: revisar antes de intensificarla o eliminarla. UI compacta y móvil como prioridad continua.

## 0. Revisión e integración de lo ya implementado

**Estado (auditoría 2026-10-12):** `main` `3c58c56` contiene todas las etapas 1–25, incluidos los instrumentos procedurales (PR #25). Pruebas en verde. Pendiente de PR: `feat/rhythm-atlas` (Atlas de ritmos y correcciones de documentación).

- Jay escucha en móvil la mezcla actual (instrumentos procedurales + proximidad + efectos) usando el Atlas para saltar entre ritmos.
- Seguir con una rama por etapa; no asumir que una rama está integrada sin verlo en `main`.

## 1. Curaduría perceptiva de la base actual

**Ya hay:** motivos contenidos, gramática, perfiles materiales (en rama), filtro/shelf/compresor, atenuación por densidad, Escucha suave, efectos locales y vecindarios.

**Falta:** escuchar regiones representativas de los 52 estilos, tanto quieto como interactuando y cruzando fronteras. Afinar grave/medio/agudo, dinámica, swing, articulación, envíos y claridad de roles. Evitar que todos los sonidos se vuelvan apagados o iguales al contener brillo. Comparar auriculares/altavoz móvil, volumen bajo y sesiones prolongadas. Revisar mezcla de familias con tempos muy distintos sin volverlas genéricas.

**Aceptación:** pulso/groove reconocible, bajo legible, capas diferenciadas, sin saturación ni fatiga marcada en pruebas humanas. Registrar coordenadas/casos problemáticos y correcciones. No prometer agrado universal ni tratar tests de scheduler como validación artística. Puede acompañar todas las etapas; no exige paralizar el siguiente paso si Jay lo autoriza.

## 1b. Biblioteca de ~100 ritmos (pedido de Jay)

**Ya hay (rama `feat/rhythms-afro-roots`):** 52 estilos. Tanda 1 hecha: 18 de raíz afroamericana. Reparto ponderado (máx. ≈ 3,4 %, mín. ≈ 0,7 %). Atlas con filtro por familia y marca de probado.

**Siguientes tandas, en este orden propuesto:** 2) afro y diáspora, 3) latino y andino, 4) industrial y oscuro, 5) bass y breaks, 6) otras escenas. Cada tanda en su propia rama, siguiendo la receta descrita en HANDOFF ("Biblioteca de ritmos y reparto equilibrado"). Ya no hace falta separar EBM clásico de darkwave/EBM si Jay no lo pide.

**Pendiente de esta etapa:** Jay escucha la tanda 1 con el Atlas y marca cuáles suenan bien; ajustar las que no. Dar a cada familia una afinidad suave por bioma si se quiere que el paisaje y el ritmo se correspondan más (hoy el campo de tempo decide casi todo, salvo Origen y Vacío).

**Objetivo:** llegar a unos 100 ritmos agradables y distintos entre sí, con muchas raíces afro/afrolatinas/afroamericanas, industriales, latinas, asiáticas y de todas las épocas de la electrónica. Cada uno con patrón de batería propio, bajo, hook, swing, tempo y escala; no un renombre de otro.

**Lista propuesta de ~66 nuevos** (agrupados; ajustar con Jay):
- Raíz afroamericana / house y techno clásicos: Chicago house, Detroit techno, acid house, deep/soulful house, gospel house, garage house (NY), ghetto house, juke/footwork, Baltimore club, Jersey club, Miami bass, electro-funk, boogie, hip hop instrumental (boom bap), lo-fi hip hop, trap, G-funk, R&B alternativo, Detroit electro, broken beat.
- Afro y diáspora: afrobeat electrónico, gqom, kuduro, baile funk, afro tech, 3-step, kwaito, Afro-Cuban house, highlife electrónico, Ethio-groove.
- Latinas y andinas: cumbia digital, tribal guarachero, reggaetón/dembow, moombahton, bossa electrónica, salsa house, latin house, dancehall, champeta electrónica, pasillo/sanjuanito electrónico.
- Industrial y oscuro: industrial techno, EBM clásico (ya está darkwave/EBM; separar), hard techno, Berlin minimal oscuro, noise ambient, dark ambient, witch house, coldwave.
- Bass y breaks: UK funky, grime, 2-step, jungle, footwork jungle, halftime, future garage, bassline, big beat.
- Otras escenas: trance clásico, psytrance, goa, Balearic, Italo disco, synthwave, French house, electroclash, glitch, chillwave, vaporwave, city pop electrónico, J-ambient (kankyō ongaku), Bollywood/Asian underground, Arabic/maqam house, Balkan electro, krautrock motorik, dub reggae, ambient techno.

**Cómo construirlo:**
- Hacerlo en tandas de ~15–20 por rama (por ejemplo: raíz afroamericana primero), cada una con prueba en `tests/atlas.mjs` de que todos aparecen y con patrones distintos (como `tests/references.mjs`).
- Mover la elección de género de "pools por bioma + probabilidades sueltas" a una tabla única con peso por género y afinidad por bioma, para que el reparto sea parejo (hoy IDM ≈ 13 % y deep house ≈ 1 %).
- Tempos > 150 BPM (jungle, footwork, psytrance) y < 80 BPM necesitan revisar la mezcla de fronteras y el campo de vecindarios.
- Atlas con filtro por familia y marca de "probado" para que Jay valide uno por uno.

**Aceptación:** ~100 géneros en `GEN`, todos alcanzables en el Atlas dentro de 30 anillos, reparto sin géneros por encima de ~3 % ni debajo de ~0,5 %, patrones de batería distintos verificados por prueba, y validación audible de Jay por tandas.

## 1c. Plan del mundo infinito (acordado con Jay, 2026-10-12)

**Principio:** el infinito no se siente por cantidad, sino por escala, contraste y promesa de que más allá hay algo distinto. Evitar la "avena procedural" de No Man's Sky: muchas combinaciones que se sienten iguales.

**Fase 1 · Base del mundo — integrada (PR #29); falta que Jay la escuche y la juegue en móvil:**
1. **Continentes sonoros:** capa por encima de las regiones, fronteras curvas, tamaños desiguales (pocos gigantes, muchos medianos, archipiélagos). Cada continente tiene nombre, tonalidad, familia de géneros y color. Al cruzar se siente un cambio de tono, como la transición de un DJ. Entre continentes hay **mares de silencio** con faros aislados. Sin cuadrícula visible.
2. **Contraste de densidad:** un campo continuo de vitalidad reemplaza los 5 niveles de relleno. El vacío funciona como la subida de un track y el lugar lleno como el drop: la música se adelgaza en lo vacío y entra completa al llegar a un oasis.
3. **Horizonte sonoro:** hitos grandes (torres, árboles gigantes, ciudades de criaturas, monolitos, faros). Primero se oyen (apagados y desde su dirección), luego se intuyen (brillo en el borde) y luego se ven. Cada uno tiene su motivo musical. Máximo 2 sonando a la vez. Sin flechas ni brújula.

**Fase 2 · Viaje — implementada en `feat/infinite-world-journey` (pendiente de PR). Falta de esta fase: reflejar "ritmos más extraños" lejos del Origen sin romper el reparto global; tarjeta de récord propia si el mapa no basta:**
5. **Más lejos, más raro, y la distancia cuesta:** afinación torcida, objetos más grandes, colores imposibles y ritmos extraños lejos del origen. Expediciones de varios días con el Estudio como campamento base. Récord de distancia con tarjeta para compartir.
8. **Mapa dibujado:** solo lo que viste, con símbolos de lo que escuchaste, en zoom de continente y región, exportable como imagen. El mapa recuerda, no revela.

**Fase 3 · Asombro:**
4. **Rarezas que rompen reglas:** niveles raro/legendario/mítico con frecuencia real. Cada una deja una muestra o instrumento único para el Estudio. La Voz suelta rumores con pistas. Lo raro se anuncia, no se regala.
2. **Ríos y caminos:** un río es un set de DJ (la energía sube río abajo). Nacen en manantiales, mueren en mares de silencio, y donde dos se juntan sus géneros se mezclan. Los caminos los marcan las migraciones.

**Fase 4 · Vida:**
7. **El tiempo cambia el mundo:** clima que se desplaza por el mapa y se puede perseguir, migraciones con posición según la fecha, estaciones semanales por continente. Da razones para volver, nunca castigo por no volver (nada de FOMO).
9. **Capas:** bajo tierra 1 paso equivale a 8 arriba (atajo de viaje, dub y graves). La capa del cielo da vista de continente. Se entra con un ritual: tocar el ritmo correcto con pulsos.
10. **El mundo te recuerda:** tu rastro, lo sembrado, los ecos y los Estudios quedan. Más adelante, rastros de otros jugadores.

## 2. Más iniciativa del ambiente tras aproximadamente 60 segundos quieto

**Siguiente etapa de producto propuesta.** Radio ya cambia sin movimiento y fenómenos ya tienen autonomía; falta respuesta específica a quietud prolongada.

- Medir inmovilidad real del jugador; al llegar al umbral introducir lentamente iniciativa de criaturas/objetos/texturas y nuevas secciones.
- Mantener estilo, armonía y tempo; usar momentos de frase y límites de densidad. No convertir quietud en festival de sonidos aleatorios.
- Al volver a moverse, recuperar agencia sin salto brusco ni reiniciar todo cada frame. Definir qué ocurre al pulsar/interactuar sin desplazarse.
- Excluir menús y Escuchar del tiempo de quietud activa, respetar silencio/linterna y claros de escucha; mantener Camino y Estudio.

**Aceptación:** comparar 0–60–120 s en mismo punto, sin fuentes y con muchas. Cambios perceptibles y musicales, sin repetición fija infinita ni acumulación creciente, retorno suave a movimiento. Umbral de 60 s es aproximado y afinable.

## 3. Favoritos musicales en cualquier coordenada

Marcar el punto que guste, independiente del Estudio/checkpoint: nombre, coordenadas, región/bioma, género, escala, carácter/materiales y fecha. Acceso compacto desde menú/Bitácora, con edición y borrado. Guardado local compatible, límite razonable y registros antiguos normalizados.

**Aceptación:** favorito sobrevive recarga, funciona en negativos/fronteras y distingue ubicación de escena exacta. Coordenadas recuperan entorno/identidad, pero radio puede estar en otra frase y versiones futuras pueden cambiar música. No prometer reproducción exacta todavía.

## 4. Orientación y retorno a lugares guardados

Seleccionar favorito o Estudio, mostrar distancia/dirección de forma discreta y permitir cancelar selección. Mapa o lista inicial según alcance de rama; no llenar pantalla con indicadores. Definir retorno compatible con linterna y exploración, evitar perder el punto de regreso al usar Estudio.

**Aceptación:** orientar correctamente desde distintas regiones/negativos, actualizar distancia y reconocer llegada. Viaje automático se implementa en la etapa siguiente; no confundir orientación con teletransporte gratuito.

## 5. Autopilot

Paseo lento para explorar/escuchar y desplazamiento hacia favorito seleccionado. Controles claros de empezar/parar, cancelación inmediata por movimiento manual y botón; pausa con menús, consume linterna normalmente. Respetar velocidad/gravedad regional, límites de interacción y transición musical. Definir conducta al llegar, agotar linterna o salir del Mundo.

**Aceptación:** no toma control sin acción del jugador, no bloquea salida/cancelación ni genera pulsos automáticos ilimitados. Recorrido musical continuo y sesión larga estable. No promete audio en segundo plano del navegador. Validar táctil y teclado.

## 6. Interacciones musicales profundas

**Ya hay:** contacto, pulso, ensamble autónomo, choques/cadenas, nuevos objetos físicos, personalidad y reparto de roles.

**Falta:** acciones que permitan componer y desarrollar un lugar sin caminar siempre: sostener un acorde, activar/desactivar una secuencia, cambiar acentos/divisiones, intercambiar respuestas entre vecinos o transformar temporalmente un objeto. Más elementos/luz y diferencias individuales donde aporten un verbo nuevo.

Implementar por grupos pequeños con gesto móvil comprensible; no cada objeto hace todo. Roles distintos según región, resultados a tempo y limitados armónicamente. Escuchar/feedback explican acción sin tutorial técnico invasivo. Decidir qué cambios son temporales y cuáles persistentes.

**Aceptación:** poder pasar varios minutos haciendo música en un bioma con agencia clara y distintas acciones, sin paredes sonoras ni crecimiento ilimitado de emisores.

## 7. Looper y ecos musicales

Capturar uno/dos compases de acciones musicales y dejarlos temporalmente en mundo, con entrada/cierre a compás, borrar/silenciar y límite de capas. Elegir representación de eventos musicales antes de asumir grabación de audio. Proximidad y espacio local deben importar.

**Aceptación:** reproducción sincronizada, sin deriva ni duplicación de disparos; editar/parar claro en móvil; capas respetan armonía/densidad y se limpian al salir o según duración definida. Exportación de audio es alcance separado, no existe ahora.

## 8. Escenas y memoria musical

Guardar una combinación recuperable de patrón, instrumentos/perfiles, armonía, tempo y capas, junto con ubicación y versión del generador. Resolver qué significa recuperar exactamente una música que gustó; favorito solo no lo hace. Evitar persistir nodos Web Audio; serializar recetas/eventos con migración.

**Aceptación:** reabrir escena reproduce intención musical, distingue reproducción exacta de reconstrucción adaptada y se comporta al cambiar versión. UI y tamaño del guardado acotados. Integrar con looper/Estudio cuando existan.

## 9. Banda de criaturas

Convertir seguidores/cantantes actuales en roles coordinados: bajo, percusión, melodía/textura y call-response, con turnos, entradas/salidas y combos. No sumar cada criatura encima de todas las demás. Comportamientos y temperamentos propios conservados; interacción musical entre ellas.

**Aceptación:** una pequeña banda se oye organizada, jugador entiende aportes y puede alterar composición; límites de voces y sincronía claros. No es todavía sesión multiplayer.

## 10. Vida ambiental y encuentros mágicos más variados

**Ya hay:** reliquias raras fijas y de obtención única, aves de eco, semilleros de caja y nubes de pulso, además de eventos originales.

**Falta:** ampliar encuentros únicos y difíciles de conseguir, familias bioma-dependientes, comportamientos emergentes y relaciones entre objetos/criaturas/clima. Nuevos fenómenos pueden revelar capas musicales, responder a acciones/contexto o aparecer excepcionalmente. Considerar muestras/descubrimientos/logros para fenómenos: hoy no se registran como colección nueva.

**Aceptación:** rareza real por mundo/condiciones, identidad estable donde proceda, señales descubribles y recompensa musical significativa. No volver a generar premios alrededor del jugador ni cuotas fáciles. No añadir un evento por frame o más sonido solo por añadir objetos. Mantener lluvia y contener viento; ampliar efectos locales si la escucha lo justifica.

## 11. Estudio, mapa y descubrimientos

Ampliar Estudio con combinación de muestras/escenas, decoración y nombres; integrar favoritos y retorno. Nombrar especies/lugares y reflejar esos nombres en Bitácora/tarjetas. Mapa que ayude a explorar sin revelar todo ni borrar sensación de hallazgo. Revisar flujo de checkpoint y Estudio portátil.

**Aceptación:** conserva secuenciador/bolsa/colores/guardado existente, integra nuevas funciones sin saturar HUD móvil. Hacer varias ramas si el conjunto deja de ser revisable; no introducir todo en una sola etapa.

## 12. Interfaz y feedback continuos

Revisar cuánto ocupa información simultánea de lugar, gravedad, espacio, reto, mensajes, Escuchar y sesiones. Priorizar información contextual/ampliable, controles táctiles y legibilidad. Evaluar percepción de gravedad: aviso existe y velocidad cambia; Jay decidirá si se afina o retira tras probar. No sumar un panel permanente para cada nueva función.

**Aceptación:** pantalla útil para explorar, sin superposición ni interferencias entre pulsar, arrastrar, escuchar y autopilot; comprobar 390×844 y escritorio. Mostrar lenguaje musical que ayude al jugador, no detalles internos del motor.

## 13. Escucha, rendimiento y robustez en sesiones largas

Profiling de audio/render y memoria con radio, fenómenos, criaturas, materiales, efectos/proximidad, bordes, looper y autopilot. Medir cachés/grupos activos y limpieza, energía/linterna/recarga, suspensión/reanudación de audio y errores. Ampliar tests solo donde verifiquen comportamiento relevante.

Evaluar AudioWorklet u otra separación de audio si mediciones detectan timing deficiente; no migración automática por preferencia técnica. Limpiar restos del slider musical eliminado (`mMusic`, `rStyle`, `S.style`, handlers) sin cambiar intensidad por región. Revisar interfaces runtime si cambios lo requieren.

**Aceptación:** sesiones largas estables en dispositivos reales, sin crecimiento de nodos/cachés ni deriva audible; compatibilidad v4 preservada o migración explícita. No hay CI hoy: añadirlo puede ser una rama técnica acotada si Jay lo acuerda.

## 14. Encuentros entre jugadores y música compartida

Jay quiere que otra persona entre como punto distinguible, puedan verse/encontrarse y hacer música juntos. Es funcionalidad pendiente, no basta compartir tarjeta o coordenadas.

- Diseñar backend/salas/conexión y presencia antes de implementar. Hoy no hay servicio de red ni cuentas.
- Compartir semilla/versión de mundo, posición e interacciones musicales necesarias; no enviar nodos Web Audio ni asumir relojes locales iguales.
- Coordinar reloj, cuantización, armonía/tempo, capas y presupuesto de voces para evitar desastre musical.
- Definir quién conduce composición y cómo entran/salen aportes, latencia, desconexión/reconexión, llegada y visibilidad; no imponer experiencia de combate/chat no solicitada.
- Separar cuentas/guardado remoto de requisito mínimo para encontrarse: arquitectura por decidir, Supabase fue idea futura, no dependencia instalada.

**Aceptación:** dos dispositivos ven puntos distintos, se encuentran y colaboran con sincronía tolerable y mezcla controlada; reconexión no duplica eventos. Pruebas con red real y límites de sesión. Proponer implementación concreta antes de contratar/desplegar servicios.

## Después o sujeto a prioridad de Jay

- Portar frases de Voz corregidas por Jay desde tabla del diseño; texto actual no debe darse por versión editorial final. Voz hablada/robotizada sería una función adicional, no está hecha.
- Guardado en nube/cuentas/exportar-importar progreso; hoy localStorage puede perderse al borrar datos. Proveedor por decidir.
- Empaquetar Capacitor para móvil y Tauri para escritorio; hoy web estática. No Godot ni promesa de consolas.
- Visitas a Estudios y tarjetas con nombres/escenas; depende de sistemas previos.
- Exportar/grabar audio, sintetizador modular editable o live coding real: no están implementados ni se consideran automáticamente autorizados por las referencias musicales. Consultar alcance si Jay los pide.
- Seguir ampliando vocabulario musical sin convertirlo en lista cerrada: nuevos timbres, articulaciones, ritmos y relaciones armónicas, solo cuando aporten diferencias audibles y mantengan continuidad.

## Cómo continuar con Claude

Primero leer los tres Markdown y el código de `main`. Revisar/escuchar lo actual, presentar hallazgos concretos, y acordar una etapa. Si se implementa: main actualizado, rama nueva, cambio acotado, pruebas, commit/push; Jay PR/merge. Registrar en CAMBIOS lo que realmente terminó y actualizar esta lista. No marcar como hecha una propuesta ni borrar contexto de decisiones al reorganizar documentos.
