# WHITEDOT: fases, implementaciones e ideas por decidir

Revisión: 2026-10-13, sobre `main` `5413d5f` (PR #35). Contexto en [HANDOFF.md](HANDOFF.md), historial en [CAMBIOS.md](CAMBIOS.md) y resultados de esta revisión en [REVISION.md](REVISION.md).

**Una fase = una rama revisable**, implementación, pruebas, commit y push; Jay crea PR/merge. Las fases futuras son propuestas para elegir, no autorización automática. Si una fase crece demasiado, dividirla antes de implementar. La fase 1 está implementada en la rama de esta revisión; lo demás sigue pendiente salvo las bases indicadas.

## Qué quiere Jay y cómo organizar el crecimiento

La música actual le encanta. Ganar nitidez y profundidad de interacción conservando su identidad. Busca mundos muy distintos: escasos, densos, con mezclas diferentes de flora/fauna, máquinas, fenómenos, pistas, sonidos e influencias culturales; algunos culturales, otros no. Pasar tiempo haciendo música en un lugar debe ser tan interesante como viajar. Cambiar números sin cambiar la experiencia no basta.

Primero preparar reglas para multiplicar contenido, después ampliar el catálogo. Ya existen semillas, biomas, ADN regional, continentes y gramáticas musicales; falta coordinar mejor los catálogos y sus compatibilidades. No construir un mundo artesanal por cada cultura/objeto. Tampoco reescribir todo antes de aprovechar lo actual.

Mantener fondo negro y protagonista blanco. Color localizado en elementos, instalaciones, luz y señales musicales. Referencias a Felipe Pantone: explorar originales con superposición, movimiento, geometría, reflejo y color/sonido. Las referencias culturales deben relacionar música, flora, fauna, material, arquitectura, movimiento y acciones; no solo añadir un traje o etiqueta. Japón y México fueron ejemplos: interesan muchas culturas y épocas. Leonardo da Vinci, instrumentos históricos y composiciones de dominio público son otras fuentes posibles, no incorporaciones ya aprobadas.

Dirección musical: electrónica con bajos, medios, groove, motivos, espacio y cambios graduales; agudos y disonancias intencionales/acotadas. Endel, Hawtin, sintetizadores, modulación, secuenciadores y curaduría de distintas épocas orientan el proyecto. No copiar temas ni cambiar lo que Jay disfruta por una mezcla genérica. Lluvia debe conservar su sensación; viento de dunas ya reducido. Gravedad regional existe pero su percepción sigue por evaluar. UI móvil compacta y coherencia visual acompañan cada fase.

## Primer bloque: consolidar y multiplicar lo existente

### 1. Nitidez de mezcla — implementada en esta revisión, pendiente del PR de Jay

Salida lineal a niveles normales, protección de picos con margen, limpieza de graves en retornos de reverb/eco, corte subsónico y pad neutro sin resonancia elevada. Ritmos, notas, instrumentos, radio, looper/banda y efectos creativos conservados. Medición offline y escucha real cumplen papeles distintos; Jay debe comparar en móvil/auriculares. La revisión técnica y el roadmap también forman parte de esta rama. Detalles/evidencia en REVISION.

### 2. Cruces entre capas, Estudio y jam

Resolver ecos que reconstruyen claves `bajo:`/`cielo:` como coordenadas de superficie, fuentes de superficie que quedan activas al cambiar de capa, y retorno del Estudio con ADN de superficie mientras continúa en otra capa. Revisar qué se puede tocar/grabar en cada capa y documentar la decisión. Mejorar procedencia de eventos de looper: la ventana temporal actual puede capturar actividad automática. No añadir más mecánicas antes de estabilizar esos cruces.

**Probar:** entrar/grabar/reproducir/salir en superficie/Subsuelo/Cielo, abrir/cerrar Estudio en cada capa, audio suspendido/silenciado, recarga y fin de linterna. Ver hallazgos y casos reproducidos en REVISION.

### 3. Recetas de lugar y catálogo ampliable

Definir un esquema versionado que coordine geografía, vitalidad, distribución, familias de flora/fauna/objetos, materiales, rasgos físicos, acciones, roles/timbres, colores, clima, rareza e influencias culturales opcionales. Cada elemento nuevo declara afinidades, variaciones y presupuesto de apariciones/sonido; no un bloque de condiciones dispersas por cada bioma.

Semillas independientes para no desplazar todo el RNG al añadir un elemento. Diferenciar identidad persistente y estado temporal. Mantener versiones/registros previos o migrar conscientemente; cambios de generador pueden alterar coordenadas antiguas. Las influencias pueden faltar o combinarse con reglas. No generar todas las piezas en todos los lugares.

**Probar:** incorporar un elemento al catálogo sin modificar múltiples generadores; volver reconstruye identidad, los límites se cumplen, antiguos descubrimientos siguen utilizables. Usar módulos/semillas actuales como base, no crear una abstracción enorme vacía.

### 4. Combinaciones coherentes y variedad perceptible

Reglas de compatibilidad, distribución y rareza; transiciones entre vecinos; presupuestos gráficos/sonoros. Probar primero con contenido existente: lugares mínimos, densos, orgánicos, mecánicos, rítmicos, melódicos, con/sin personajes o instalación. Controlar repetición de recetas y qué diferencias se oyen/juegan, además de contar semillas distintas.

**Probar:** muestra reproducible de regiones con diversidad de acciones, roles y siluetas, continuidad musical y casos extremos estables. Actualmente una muestra de 10.000 regiones dio 1.517 combinaciones bioma/género/gravedad y 10.000 recetas detalladas distintas: identidad técnica no equivale a 10.000 experiencias totalmente diferentes. Mundo actual comparte semilla; mapas independientes por jugador no están implementados.

### 5. Lenguaje gráfico común

Guía de escalas, grosor, glifos, movimiento, profundidad, brillo, color y reacción al beat para flora/fauna, nuevos hitos, ríos, portales, ecos y capas. Reconciliar trazos/píxeles originales con curvas, halos y cuadrícula del Cielo. Evitar blanco brillante que confunda objetos con jugador. Corregir legibilidad de textos y barras de banda/looper simultáneas en móvil.

**Probar:** escenas densas/vacías, capas, lluvia y FX con protagonista visible, HUD discreto, sin solapamientos ni rellenos globales de color. No rediseñar todo el juego de golpe.

### 6. Iniciativa ambiental tras ~60 segundos quieto

Radio y fenómenos ya evolucionan. Añadir respuesta específica a inmovilidad prolongada: criaturas, objetos/texturas y secciones entran poco a poco, a frase, con límites. Definir efecto de pulsar sin moverse. Recuperar agencia suavemente al caminar, excluir menús/Escuchar del tiempo activo, respetar claros/linterna/silencio.

**Probar:** 0/60/120 s en punto con pocas/muchas fuentes, variedad audible sin acumulación creciente ni reinicios bruscos. Camino/Estudio separados.

## Segundo bloque: recordar, volver y pasear

### 7. Favoritos musicales

Marcar cualquier punto, nombrarlo, guardar coordenadas, capa, región/bioma, carácter musical y fecha; editar/borrar en Bitácora/mapa. Independiente del checkpoint del Estudio. Guardado compatible y límite razonable.

**Probar:** negativos, fronteras, recarga y cambio de generador. Coordenadas no prometen recuperar el mismo compás; receta exacta requiere escenas.

### 8. Orientación y retorno

Seleccionar favorito/Estudio, dirección/distancia y llegada, cancelación discreta. Aprovechar mapa existente: ya muestra exploración, no favoritos ni navegación automática. Decidir costo/alcance de retorno acorde a linterna y exploración, sin introducir teletransporte gratuito por accidente.

**Probar:** destinos en distintas regiones/capas y coordenadas negativas, ubicación del campamento conservada.

### 9. Autopilot

Paseo lento para escuchar y viaje a favorito, inicio explícito, cancelación al mover o por botón, pausa en menús, consumo normal de linterna y respeto a movilidad/capas. Temporizador opcional para enfoque/descanso.

**Probar:** llegada, cancelación táctil/teclado, linterna, salida/recarga y suspensión del navegador. No garantizar reproducción en segundo plano.

## Tercer bloque: nuevos verbos e instalaciones musicales

### 10. Vidrios de color musicales

Tres piezas translúcidas giratorias/deslizables; superposición revela geometrías y modifica capas, articulación o timbre. Instalación original con inspiración cinética/cromática; generador varía forma, cantidad, material y rol según receta.

**Probar:** movimiento táctil comprensible, cambio sonoro a tempo, efecto visual local, presupuesto de voces. No teñir todo el fondo.

### 11. Espejos musicales

Orientar reflejos entre objetos para activar ecos, secuencias o revelar pistas. Rutas acotadas, identidades por región: no todos los espejos hacen lo mismo. Combinar después con vidrios sin exigirlos para la primera versión.

**Probar:** rayos legibles, feedback de conexión, impedir bucles sonoros sin límite, variar rol musical manteniendo coherencia.

### 12. Tocar, sostener, tensar, deslizar y soltar

Cuerdas luminosas, piedras de ritmo, prismas secuenciadores y resonadores estáticos/móviles. Contacto sostenido abre nota/textura; tensión transforma articulación; desplazamiento reorganiza acentos o pasos. Introducir familias pequeñas por rama si hace falta. Individuos conservan rasgos distintos y mismos tipos pueden cambiar de rol entre regiones.

**Probar:** tocar varios minutos sin caminar ni sembrar, gestos compatibles con mover/pulsar/Escuchar, duración acotada y salida clara. Definir cambios temporales/persistentes.

### 13. Conversaciones musicales

Objeto/criatura responde a frase, ritmo o secuencia del jugador; turnos y silencios, respuestas entre vecinos y cambios locales. Call-response original existe, ampliar agencia y reconocimiento en lugar de sumar sonidos al azar.

**Probar:** jugador percibe relación causa/respuesta, armonía y densidad protegidas, ventana de escucha visible.

### 14. Efectos de producción ampliados

Por tandas: chorus, phaser, flanger discreto, resonadores, dub delay, congelación breve de reverb, texturas granulares. Mantener FX actuales y nitidez, asignaciones por objetos/lugares y controles simples. Granular necesita definir fuente/buffer y costo, no asumir banco de grabaciones.

**Probar:** cada efecto distingue función y carácter, bypass limpio, colas/picos/feedback acotados, móvil estable.

### 15. Mixer por capas

Silenciar/solo bajo, percusión, acordes y melodía de radio con UI breve. Necesita separación de rutas real; el bus actual no distingue todas esas familias.

**Probar:** cada solo/mute afecta únicamente capa elegida, transición suave y mantiene interacción/efectos/silencio global.

### 16. Banda más expresiva

Primera versión ya integrada: cuatro papeles, seguimiento y combos. Añadir turnos, entradas/salidas, retirar miembros, conversación y combinaciones sin doblar radio descontroladamente. Adaptación de patrones al carácter del lugar.

**Probar:** se oye organizada, roles claros y agencia del jugador, límite de voces y volumen con banda completa.

### 17. Escenas, memoria musical y ecos persistentes

Looper temporal ya existe. Guardar receta/versiones de patrones, armonía, instrumentos/materiales, tempo, ubicación/capa y capas activas; serializar eventos, no nodos Web Audio. Recuperar intención musical tras recarga y cambios de versión. También guardar/borrar ecos con límite, sin fantasmas ilimitados en mundo.

**Probar:** recuperación reproducible y distinción entre favorito, escena y grabación; tamaño del guardado y migración controlados.

## Cuarto bloque: búsqueda y significado

### 18. Pistas encadenadas

Sonidos lejanos, geometrías, rumores y señales conducen a pequeños recorridos de hallazgo. Lo raro se anuncia discretamente sin flecha permanente ni aparición de premios alrededor del jugador. Persistir progreso de pistas cuando convenga.

**Probar:** pistas comprensibles y solvibles, variaciones por semilla, hallazgo excepcional con recompensa musical significativa.

### 19. Puertas musicales e instrumentos dormidos

Comprender un ritmo o relación entre elementos para abrir/despertar algo; portales por pulsos ya existen, esta fase profundiza los enigmas. Encuentros raros con condiciones variadas, no solo más pulsos acumulados.

**Probar:** descubrible por oído/feedback, sin castigo por ausentarse ni condición imposible al mutear; alternativas visuales pertinentes.

### 20. Personajes originales

Viajeros, guardianes, coleccionistas y maestros con gesto, motivo, función y encuentros propios, integrados en fauna/receta. Distinguir personajes de criaturas genéricas sin ocupar HUD ni convertirlo en diálogo continuo.

**Probar:** apariciones/rareza estables donde corresponda, aporte jugable/musical, conducta individual y memoria.

### 21. Primer conjunto de inspiración cultural

Elegir con Jay una referencia concreta e investigar música, materiales, geometría, flora/fauna y prácticas pertinentes. Crear contenido propio: una pequeña familia de elementos, articulaciones y encuentros que alimente catálogo/recetas. Evitar que cada cultura equivalga a un único género o que un instrumento represente toda una tradición.

**Probar:** coherencia entre forma/sonido/acción, referencia explicada en Bitácora, conjunto reutilizable en múltiples regiones. No diseñar un mapa artesanal exclusivo.

### 22. Ampliación multicultural

Muchas culturas y épocas; algunas regiones sin referencia cultural, otras con una o combinaciones compatibles. Japón/México son ejemplos abiertos. Nuevos ingredientes en tandas usando el sistema, no nuevos sistemas completos por cultura. Investigar y contextualizar cada incorporación.

**Probar:** diferencias perceptibles, combinaciones con sentido, flora/fauna relacionadas y variantes individuales; no solo nuevos nombres o trajes.

### 23. Inventos, observatorios y archivos musicales

Mecanismos inspirados en Leonardo: engranajes, péndulos, dibujos y ruedas secuenciadoras. Observatorios de constelaciones/movimiento que revelan frases. Estructuras o motivos históricos de dominio público reinterpretados con síntesis electrónica; seleccionar referencias con Jay, incluidas las de compositores que mencionó. Cada familia puede ser una subrama.

**Probar:** resolver/tocar produce música, objetos originales y coherentes; material histórico/composición y grabación existente no se confunden.

### 24. Maestros de ritmos y partituras

Llamada/respuesta de pulsos, aprender patrón y llevar partitura al Estudio; Bitácora explica bombo/hats/bajo. 52 estilos actuales, colección ampliable, no promesa de 52 minijuegos idénticos. Criaturas que solo aparecen al tocar cierto ritmo pueden entrar aquí o en búsquedas.

**Probar:** aprender escuchando/jugando, dificultad razonable, puntuación a tempo y guía accesible.

## Quinto bloque: construir, actuar y compartir

### 25. Máquinas sonoras

Bloques resonadores conectables que se activan en cadena, como una red musical. Persistir construcción/receta y limitar tamaño, ciclos y simultaneidad. El sistema de cadenas actual es una base, no construcción editable/persistente.

**Probar:** montar/parar/desmontar en móvil, secuencias sincronizadas, límite de activaciones y compatibilidad con escenas.

### 26. Huertos de ritmo

Semillas en cuadrícula de 16 pasos; crecer/transformar timbre y regar con pulso. Jardín como uno de muchos verbos y lugares, no tema único del juego. Definir papel del tiempo real sin penalizar no volver.

**Probar:** secuencia musical legible, persistencia, transformación con acciones, sin obligación diaria adicional.

### 27. Escenarios, pueblos y baile

Tocar un set con banda; comunidades responden a groove y transiciones con efectos. Retos de DJ en fronteras pueden ser subrama: puntuación clara sin premiar simplemente apilar sonidos. Recompensas de muestras/colores justificadas.

**Probar:** baile y respuesta sincronizados, música agradable, evaluación comprensible y no repetitiva.

### 28. Crafting, nombres y Estudio

Combinar muestras mediante recetas descubribles, decoración y nombres de especies/lugares reflejados en Bitácora/tarjetas. Integrar favoritos/escenas/mapa preservando bolsa, colores, secuenciador y checkpoint actuales.

**Probar:** compatibilidad de partidas, recetas y consumo coherentes, UI compacta. Sintetizador modular editable con perillas/conexiones es ampliación posterior grande, a elegir.

### 29. Grabar y compartir sets

Exportar 30–60 s de audio/video con MediaRecorder cuando soportado, compartir escenas/códigos y nombres. Hoy tarjetas PNG sí, grabación de audio/video no. Definir privacidad/alcance si hay red o jugadores invitados; no publicar automáticamente.

**Probar:** archivo utilizable, sincronía audio/video, limitación de memoria, compatibilidad móvil y fallback explícito.

## Sexto bloque: vida y expansión continua

### 30. Tiempo, fenómenos y biblioteca ampliada

Ya hay tormentas móviles, estaciones semanales, huellas, campamentos, rarezas, ríos/confluencias y fenómenos. Falta migración con posición según fecha, caminos de migración, manantiales, criaturas gigantes, día/noche y encuentros con nuevos descubrimientos/muestras. Festivales semanales compartidos por fecha son propuesta, sin FOMO. Más formas de rareza/efectos si aportan función nueva.

Biblioteca hacia ~100 ritmos, en tandas y con validación audible. Tanda afroamericana de 18 ya integrada: no repetirla. Propuestas restantes: afrobeat electrónico, gqom, kuduro, baile funk, afro tech, 3-step, kwaito, Afro-Cuban house, highlife, Ethio-groove; cumbia digital, tribal guarachero, dembow/reggaetón, moombahton, bossa electrónica, salsa/latin house, dancehall, champeta, pasillo/sanjuanito; industrial/hard techno, Berlin minimal oscuro, noise/dark ambient, witch house, coldwave; UK funky, grime, 2-step, jungle, footwork jungle, halftime, future garage, bassline, big beat; trance, psytrance/goa, Balearic, Italo disco, synthwave, French house, electroclash, glitch, chillwave, vaporwave, city pop electrónico, J-ambient, Asian underground, Bollywood, maqam/Arabic house, Balkan electro, motorik, dub reggae, ambient techno; R&B alternativo y otros propuestos. Separar EBM clásico/deep/soulful/gospel solo si Jay lo quiere, pues ya hay familias cercanas.

**Probar por tanda:** recetas completas/patrones distintos, alcance en Atlas, reparto medido con generador continental actual (última prueba 0,8–2,3 %), transiciones de estilos lentos/rápidos y afinidad visual/cultural razonable. Nombre nuevo no basta. Los ~100 son orientación de catálogo, no límite de infinitud ni trabajo en una sola rama.

### 31. Encuentros y multiplayer jam

Puntos distintos visibles, verse/encontrarse y hacer música juntos. Diseñar conexión/backend/salas y reloj/armonía/tempo compartidos, latencia, dueño de composición, entradas/salidas y presupuesto de voces. Versiones/semillas del mundo compatibles. Visitas a Estudios, rastros de otros y bandas compartidas pueden venir después.

**Probar:** dos dispositivos en red real, eventos sin duplicar, reconexión, sincronía tolerable y mezcla ordenada. Hoy no hay servidor, cuentas ni multiplayer. Supabase fue idea futura, no proveedor elegido ni instalado.

## Trabajo transversal y opciones posteriores

- Escucha real en móvil/auriculares, fatiga, subgrave/agudo, transiciones y densidad en cada etapa. Tests técnicos no certifican gusto o master artístico.
- Rendimiento de sesiones largas, límites/cachés, memoria/nodos, batería y suspensión de audio. Evaluar AudioWorklet por mediciones; no migrar por preferencia.
- Revisar PWA offline real: precarga incompleta de módulos y fallback HTML para recursos pendientes; ver REVISION. Añadir pruebas/CI donde aporten evidencia, no solo cobertura nominal.
- Limpiar restos de slider `mMusic`, `rStyle`, `S.style` y handlers sin alterar intensidad por lugar.
- Portar frases finales de Voz que Jay corrija. Voz hablada robótica no existe; bitcrusher sí.
- Exportar/importar progreso, cuentas y guardado nube por decidir. LocalStorage se pierde al borrar datos. Ninguna contratación/deploy implícitos.
- Capacitor/Tauri siguen opciones posteriores; hoy web/PWA, no Godot ni promesa de consolas.
- Grabación de audio, editor modular y live coding real son funciones separadas; algorave actual es receta generativa.

## Cómo continuar

Leer documentos y código actuales, elegir una fase con Jay y mantener una rama por implementación. Revisar resultados audibles antes de expandir catálogo. Actualizar CAMBIOS solo con trabajo realmente terminado y este archivo con prioridades/decisiones nuevas. Conservar contexto de Claude y del trabajo anterior, sin marcar una propuesta como hecha.
