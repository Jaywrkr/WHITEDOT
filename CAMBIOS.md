# WHITEDOT: inventario de cambios y contexto para revisión

Revisión: 2026-10-13. Leer junto con [HANDOFF.md](HANDOFF.md), [PENDIENTES.md](PENDIENTES.md) y [REVISION.md](REVISION.md). Inventario desde prototipo `596fa31` hasta main `5413d5f` (PR #35), más esta rama de revisión/nitidez. Las mediciones de cada etapa se conservan como historia, no nivel actual garantizado.

## Estado exacto para revisión

- Main `5413d5f` incluye etapas 1–35: instrumentos procedurales, Atlas, 52 ritmos, continentes, mapas, PWA, rarezas, vida, capas, looper, banda y FX.
- Ninguna de esas funciones sigue pendiente del PR indicado en textos antiguos. Etapas 26–35 conservan los nombres de sus ramas originales como trazabilidad.
- Esta rama `review/claude-audio-clarity` añade etapa 36; pendiente de PR/merge de Jay.
- 26 suites Node y diez smokes aprobados durante esta revisión. Render de audio real y hallazgos pendientes en REVISION.
- Flujo: rama por etapa, implementar/verificar, commit/push. Jay crea PR/merge. No publicar directamente en main ni ejecutar todas las propuestas por una aprobación.

## Lo que ya existía en el prototipo

El prototipo ya tenía Camino diario, luces, crecimiento/racha, Mundo procedural, regiones/biomas/mini-biomas, criaturas generadas, descubrimientos, retos, logros y colores, texto de la Voz, pulsos, choques y cadenas de objetos, lluvia/rayos/otros eventos, síntesis Web Audio, géneros iniciales y mezcla por bordes, criaturas que siguen/cantan, recolección de muestras, Estudio radial y checkpoint, tarjetas y guardado local v4. La nueva arquitectura distribuye esos sistemas en módulos; no significa que todos esos sistemas hayan sido creados durante estas etapas.

Ya existían ambient, downtempo, dub techno, deep house, afro house, minimal house, rominimal, acid techno, breaks, UK garage, tribal y dub profundo. El Estudio ya era de 16 pasos × 4 anillos. La lluvia que le encanta a Jay se conservó. No atribuir la lluvia ni los rayos originales de Tormenta a la etapa nueva de fenómenos.

## Inventario de todas las etapas añadidas o modificadas

### 1. Base del juego corregida — `80a9020`, PR #1

- Entrar/reentrar al Mundo pasa por la inicialización completa de región: reto, lugar, bioma, música y aviso; antes el reto podía quedar sin activar.
- Cambio de día limpia colecciones y cachés del Camino/Mundo, cierra avisos residuales y sale correctamente del Mundo. Si ocurre dentro del Estudio, el modo de retorno se ajusta al Camino.
- Una luz que rebasa el tope diario solo suma lo que faltaba tanto al total diario como al total acumulado; antes el total podía crecer de más.
- Menús detienen consumo de linterna. No es pausa global de simulación/audio. Se conservaron reglas de racha, límites y duración de linterna.

### 2. Documentación y proceso — `8d1de03`, `3c50b39`, PR #2

README/HANDOFF documentaron sistemas reales, diferencias con el diseño externo, ejecución, pruebas, decisiones y roadmap. Se fijó el proceso de ramas y la responsabilidad de Jay sobre PR/merge. Esta entrega consolida ese contexto sin cambiar jugabilidad.

### 3. Modularización y regresiones — `31aec25`, PR #3

El HTML monolítico se separó en `index.html`, `styles/game.css` y módulos ES nativos. `main.js` inicializa un contexto privado `runtime`; módulos publican getters/setters según necesidad, sin exponerlo en `window`. Se conservó orden de inicialización, estado v4 y comportamiento previo. No se introdujeron build, framework, TypeScript ni dependencias de aplicación. Se añadieron `package.json`, pruebas Node y smoke Playwright móvil/escritorio.

Módulos del sistema anterior: data, progress, world, audio, canvas, messages, studio, interactions, discovery, render, ui, sharing, controls y main. Los módulos nuevos de producto aparecen en las etapas siguientes. Radio, gravity, personality, grammar, palettes, references y neighborhoods también contienen funciones puras consumidas por otros módulos: no todos requieren un `initialize` en main.

### 4. Radio generativa estando quieto — `ad9287d`, PR #4

`src/radio.js` compone frases de bajo/melodía y secciones por reloj musical aunque el jugador no se mueva. Frases de 4–8 compases, cambios de instrumentos dentro del género y un mínimo de energía variable por sección. Objetos, criaturas, variantes y eventos influyen sin fingir movimiento/actividad del jugador. Conserva BPM/escala regional y carácter rítmico. Funciona sin objetos alrededor. Estado compositivo temporal, no grabado en v4. Camino/Estudio conservan sus funciones. Depende de Web Audio activo; no garantiza ejecución en segundo plano.

### 5. Funciones musicales regionales — `db33b3a`, PR #5

`src/voices.js` asigna por semilla roles bajo, percusión, acorde, lead y agudo a familias de objetos, plantas y formas. Un árbol puede ser bajo en un lugar y agudo en otro, también entre regiones del mismo bioma. Registros e instrumentos se eligen con afinidad al género; notas ajustadas a armonía. Contacto, pulso y ensamble ambiental usan este reparto, con respuestas a tempo. Voces reconstruibles, sin cambiar mapa/IDs ni guardar perfiles nuevos. El Estudio mantiene las muestras existentes. Los commits de integración `2eb4af7` y `f957941` resolvieron compatibilidad entre ramas sin eliminar voces o gravedad; no fueron etapas de producto adicionales.

### 6. Gravedad / velocidad regional — `824c310`, PR #6

`src/gravity.js`: ligera 1,65×, normal 1×, alta 0,55×; Origen normal. Semilla independiente. Mezcla en ambos ejes en 450 px del borde, incluyendo esquinas y negativos. Solo velocidad del jugador en Mundo; no gravedad vertical ni cambio de BPM, criaturas, Camino o Estudio. Aviso de entrada y Bitácora muestran la propiedad. Jay luego expresó dudas sobre cuánto se percibe: sigue implementada, pendiente de evaluar, no eliminada.

### 7. Bitácora — `4fe4052`, PR #7

`src/journal.js`, botón y panel de cuatro pestañas:

- Lugares: regiones visitadas y progreso en formas, retos, eventos/reliquias; gravedad y ADN recuperado por ID. Origen no exige evento inexistente.
- Formas: descubiertas agrupadas por función musical; no revela las no descubiertas.
- Música: géneros, escalas e instrumentos programados con sonido activo en Mundo, con explicaciones breves.
- Logros: categorías y secretos pendientes como `???`.

Conserva historial v4 disponible, recupera región de eventos antiguos por coordenadas, conserva estrellas antiguas sin inventarles región. Registro musical comienza desde esta versión; no inventa escucha histórica. Normaliza `S.journal`.

### 8. Escuchar — `d2c477d`, PR #8

`src/scanner.js`: mantener 500 ms sin arrastrar, o tecla E, muestra hasta cinco fuentes dentro de 250 px, región/género/escala, función e instrumento. Desplazamiento de 14 px cancela el gesto y empieza arrastre; toque breve sigue siendo pulso. Se cierra al soltar/cancelar/perder foco/abrir modal/salir del Mundo. Formas no descubiertas ocultan nombre. No descubre por sí solo ni analiza los nodos que están sonando: identifica voces potenciales. Etapas posteriores añadieron temperamento, espacio local, efecto, carácter musical y fenómenos; materiales llegan en la rama pendiente.

### 9. UI compacta y viento — `d3fb69c`, PR #9

Tarjeta de entrada breve con nombre/género/gravedad; detalles a Bitácora/Escuchar. Voz limitada a dos líneas y ampliable por toque o Enter/Espacio, cola de tres pendientes. Avisos y tarjetas evitan superponerse. Viento de dunas/polvo más grave y discreto: ganancia máxima 0,012 frente a 0,045, filtro 260–810 Hz y transición 0,8 s. Lluvia conservada.

### 10. Seis ritmos electrónicos más — `1a713c2`, PR #10

Electro, progressive house, microhouse, minimal techno, dubstep y drum & bass: patrones, swing, bajos/hooks y acentos propios. Selección por semilla independiente entre regiones elegibles; Origen/Vacío conservados. DnB 166–174 BPM y dubstep a medio tiempo; radio adapta frases a familias. Detalles y fills por grupos de compases. Biblioteca pasa de 12 a 18 estilos; Bitácora/Escuchar y pruebas reconocen los nuevos.

### 11. Más elementos interactivos — `dadddf7`, PR #11

`src/playthings.js`: luces fugitivas, brotes saltarines, cometas flotantes, prismas giratorios y aros resonantes. Unos se desplazan/saltan, otros giran o expanden resonancia en su sitio. Contacto/pulso/ensamble generan sonido cuantizado, con cooldown base 850 ms. Móviles recuperan ancla. Semilla `playthings:v1`, pools por bioma, hasta 40/chunk y Vacío escaso. Generación independiente preserva mundo anterior; reacciones temporales, sin nuevas muestras/logros.

### 12. Personalidad individual — `9109fa9`, PR #12

`src/personality.js`: perfiles sereno, vivaz y elástico, con variación individual de velocidad, masa, drag, regreso, cooldown, periodo/balanceo, recuperación, salto, giro, grado, volumen y duración de seguimiento. Aplicados después de generar contenido para no alterar posiciones/IDs/RNG anterior. Árboles/plantas dejan de moverse idénticos; árboles responden al pulso; objetos y criaturas reaccionan de formas distintas. Rasgos reconstruibles, posiciones/reacciones temporales. Escuchar muestra temperamento.

### 13. Distribución en espacios locales — `00bc9ef`, PR #13

`src/pockets.js`: claro de escucha, espacio de ensamble y rincón de descubrimiento por chunk. Centros separados; aproximadamente 70 % de nuevos elementos agrupados en ensamble, resto en rincón pequeño. Reorganiza solo elementos nuevos, conservando IDs/cantidades/tipos/rasgos y flora/fauna anteriores. Claros reducen energía y omiten ensamble automático; interacción directa permanece. Pistas discretas en suelo, HUD/Escuchar identifican espacio. No son recompensas raras adicionales.

### 14. Feedback audiovisual por función — `67cbfd3`, PR #14

`src/feedback.js` señala fuente/rol al inicio programado del audio: círculos amplios para bajos, marcas de percusión, trazos de lead/agudo y anillos de acorde. Cola máxima 32, duración 650 ms. No aparece con audio suspendido/silenciado; se limpia fuera del Mundo. Sigue objeto y reloj de inicio, no solo el momento del contacto. No añade más disparos sonoros.

### 15. Reliquias realmente raras — `cf09be3`, PR #15

`src/relics.js` sustituye búsqueda nueva diaria alrededor del jugador por sitios fijos compartidos por semilla: probabilidad 1/48 por chunk, constelaciones dormidas 1/384, excluyendo chunks centrales con max(abs(cx),abs(cy)) < 2. Sin flecha global ni cuota diaria de tres. Ecos requieren permanecer a 100 px seis segundos y tres pulsos; constelaciones doce segundos y cinco. Alejarse >140 px reinicia resonancia; menús/Escuchar no suman tiempo. Una obtención por sitio/partida, guardada con ID/nombre/fecha/región/tipo mágico; `S.relicSites` evita duplicados. Estrellas antiguas se conservan; listas pendientes antiguas disponibles hasta terminar su día. Logro `dia3` conserva ID y pide tres hallazgos en un día. Primera versión de rareza, no catálogo completo de encuentros mágicos.

### 16. Dirección musical más contenida — `4d0e075`, PR #16

Golpes secundarios conservan posiciones cuatro compases con variaciones de intensidad, fills al cierre. Radio conserva motivos cuatro frases, menos notas (2–3 por compás minimal/dub, hasta cinco otros), cambios de timbre por sección. Se retiraron saltos de octava por densidad y campanas automáticas a frase del jugador en Mundo. Plucks de Mundo filtrados, armónicos/envíos más suaves. Respuestas largas repiten nota con menor intensidad en vez de subida automática. Reliquias usan acorde suave, no fanfarria ascendente. Camino/Estudio mantienen síntesis previa. Es dirección hacia electrónica con groove; no certificación artística automática.

### 17. Efectos locales — `3d1da88`, PR #17

`src/effects.js`: natural, filtro suave, eco rítmico, espacio profundo y modulación metálica por región/tipo. Solo procesa voz emitida y restaura buses incluso ante excepción. Bajo natural, percusión natural/filtrada. Eco: una repetición de tres semicorcheas, filtrada, sin feedback extra. Espacio reutiliza convolución. Metal añade banda lateral discreta conservando señal original. Atenúa envíos existentes para evitar acumulación. Máximo 12 grupos/colas de tres segundos; al alcanzar límite, voz natural. Sin procesamiento en Camino/Estudio/silencio. Escuchar identifica efecto potencial. No hay voz hablada robótica: Voz sigue siendo texto.

### 18. Resumen de sesión — `5a79c32`, PR #18

`src/session.js`: sesión al entrar al Mundo, continúa en Estudio, termina al salir. Base de contadores tomada antes del lugar de entrada; lugares/formas/retos/hallazgos nuevos, interacciones/pulsos, lugares visitados y géneros/instrumentos. Tiempo excluye menús/Escuchar. Recarga conserva `S.session`; `S.lastSession` conserva última terminada. Panel en menú y acceso al agotar linterna, sin apertura automática al salir. Tarjeta PNG 1080×1350 para compartir. No graba ni exporta audio ni inventa sesiones anteriores.

### 19. Paletas e instrumentos electrónicos — `8a3a974`, PR #19

`src/palettes.js`: tropical house, melodic house, electro robótico y nu-disco, 22 estilos en total entonces. Semilla `world-palette:v1`, 40 % de regiones elegibles; cambia identidad musical, no paisaje/nombres/IDs/descubrimientos. Modos mayores/dóricos/mixolidios para cálido/disco; menor/dórico melódico y menor/frigio robótico. Patrones específicos y voces usan instrumentos de paleta sin añadir siempre keys/marimba genéricos.

`src/instruments.js`: steel pan, kalimba FM, teclas FM cálidas/Rhodes, cuerdas analógicas, metales, clavinet, bajo elástico filtrado, bajo modular FM, formantes y teclas metálicas; güiro y timbal sintetizados. Parciales, FM y filtros, no grabaciones ni instrumentos acústicos reales. Envolventes/duración acotadas y destinos compatibles con efectos. Explicaciones en Bitácora/Escuchar.

### 20. Gramática regional, curaduría y Escucha suave — `aa6f09a`, PR #20

`src/grammar.js` genera célula/rotación de acentos, instrumento de detalle, progresión, duración de armonía/frase, desplazamiento del motivo, límites de densidad/brillo y carácter por región/género. Radio conserva anclas y desarrolla articulación y frases por reloj musical. Reloj armónico desde entrada de región; progresiones en su escala y conducción de voces; moverse no reinicia pad con mismo acorde.

Curador atenúa voces superpuestas por semicorchea, bajos repetidos y agudos. Salida con shelf suave, paso bajo y compresor. Escucha suave en menú reduce nivel/brillo y se guarda en `S.softMusic`; respeta Silencio. Escuchar muestra carácter. Corrección importante: patrones de cuatro paletas estaban en `kitPlay()` antiguo; se trasladaron a `drums()`, usado por Mundo. Pruebas exigen bombo, bajo y melodía. No garantiza agrado universal ni introduce autopilot/favoritos.

### 21. Audio por cercanía — `d341673`, PR #21

`src/spatial.js`: fuente física máxima junto al jugador, mitad de amplitud a 180 px, cero a 360 px, curva suave sin amplificar sobre nivel original. Directo/reverb/delay siguen jugador/objeto durante nota con transición 120 ms; cola global ya emitida permanece. Cercanos más probables en ensamble, sin sumar disparos. Claros mantienen ensamble omitido. Máximo 32 grupos durante tres segundos; fallback de atenuación fija al alcanzar límite. Compatible con curaduría/efectos y restauración ante fallos. Radio base/capas de faros sin fuente física conservan mezcla. No es audio 3D/HRTF.

### 22. Vecindarios para ir mezclando — `646fd8d`, PR #22

`src/neighborhoods.js`: campo suave de tempo, afinación por quintas y carácter armónico en cuadrícula de cuatro regiones. Selección musical favorece estilos con rangos compatibles; cada familia mantiene tempos propios, Origen minimal y Vacío ambient. Cambia música de algunos lugares, conserva mundo visual. Banda de 900 px mezcla ahora baterías, bajos y melodías con pesos complementarios; vecino armonizado a escala/afinación activas. Una región vecina a la vez; no mezcla cuatro regiones simultáneas en esquinas.

### 23. Doce familias de referencia más — `5f26942`, PR #23

`src/references.js`: tech house, electrónica andina, cosmic disco, melodic techno, organic house, amapiano, jazztronica, Berlin School, IDM, liquid drum & bass, darkwave/EBM y algorave. Total 34 estilos base. Ritmos/bajos/melodías/instrumentos/modos propios; andina pentatónica, jazztronica séptimas, Berlin/EBM secuencias estables, algorave acentos euclidianos rotados. Log drum FM para amapiano, llevando a once familias nuevas de síntesis tonal. Integra vecindarios, radio, objetos, Bitácora y Escuchar. Pruebas aceptan repetición hipnótica si cambian bajo/motivo/timbre/armonía. Algorave es inspiración generativa, no editor de código en vivo. No copia canciones ni implica modelos de Endel o artistas. Las veinte referencias de Jay son ingredientes, no techo de variedad.

### 24. Fenómenos musicales ambientales — `4e769e6`, PR #24

`src/phenomena.js`: aves de eco poco frecuentes que responden al final de frases con dos notas del acorde/timbre local; semilleros de caja que se sacuden con snare/clap reales sin duplicar golpe y pueden emitir caja discreta por contacto/acento propio; nubes de pulso que emiten grave/ruido filtrado y relámpago local. Contacto/pulso, efectos, proximidad y curaduría; visual sincronizado con reloj de audio. Semilla independiente `phenomena:v1`, uno/dos por chunk (uno en Vacío), caché 64. Máximo un evento autónomo/compás, ciclos 4/8 compases y cooldown. Claros omiten generación automática, no interacción directa. Escuchar incluye nombre/rol/instrumento. No añade muestras/logros/registro de rareza; lluvia y rayos originales conservados.

### 25. Instrumentos procedurales — `6bf69f6`, PR #25 (integrado)

`src/patches.js`: perfil estable por región/género/instrumento/rol/objeto. ID o rasgos inmutables, nunca posición móvil: desplazarse no cambia timbre. Materiales madera cálida, cristal suave, metal filtrado y aire sedoso con preferencias por familia/rol. Variación acotada de brillo/cutoff, resonancia, ataque/caída, armónicos, profundidad FM, anchura y envíos. Niveles atenuados, fundamentales conservadas y bajos sin desafinación adicional.

Síntesis nueva modifica parciales/FM y envolvente; heredada recibe filtro/envolvente y armónicos donde aplica, flauta incluida. Radio/vecino toman perfil de su región; objetos/fenómenos perfil propio. Escuchar muestra material. Hasta 32 grupos de color por dos segundos y 256 perfiles en caché; reconstrucción determinista tras expulsión. Límite conserva diferencias de síntesis sin más rutas. Restituye buses/perfil incluso ante error y no duplica perfiles al invocar voz de bajo/hook. Camino/Estudio omiten creación. Sin nuevos campos guardados. No equivale a sintetizador modular editable ni banco ilimitado de samples.

### 26. Atlas de ritmos (prototipo) — rama `feat/rhythm-atlas`

`src/atlas.js` y botón **Ritmos** en Menú → Prototipo. Lista los 34 géneros ordenados por tempo con BPM, origen, número de regiones, región más cercana y si ya se escucharon. **Ir** viaja al centro de la región más cercana con ese ritmo, desde el Mundo o desde el Camino (en el Camino completa el día, solo como herramienta de prueba). Escanea 3.721 regiones en ~200 ms al abrir. Sin campos nuevos en el guardado. Pruebas: `tests/atlas.mjs` (todos alcanzables, destino correcto, determinista) y `tests/atlas_smoke.py` (móvil/escritorio, viaje desde Camino y desde Mundo).

### 27. Tanda 1 de ritmos: raíz afroamericana y reparto equilibrado — rama `feat/rhythms-afro-roots`

- `src/rhythms.js`: 18 estilos nuevos con receta completa (tempo, swing, batería con variaciones, bajo, frase, instrumentos, escalas y guía para la Bitácora): Chicago house, Detroit techno, acid house, soulful/gospel house, garage house de Nueva York, ghetto house, footwork, Baltimore club, Jersey club, Miami bass, electro-funk, boogie, boom bap, lo-fi hip hop, trap, G-funk, electro de Detroit y broken beat. Total: 52.
- Batería: soporte de ráfagas de hi-hat en tresillo, claps dobles, hi-hat abierto, toms, cencerro nuevo y bombos con tono propio (808 largo en trap y Miami bass).
- `src/neighborhoods.js`: elección de género ponderada por `genreWeights()` y ventana de tempo de 5 BPM. Máximo ≈ 3,4 %, mínimo ≈ 0,7 % (antes 13 % / 1 %). Cambia el género de coordenadas antiguas.
- Atlas: filtros por familia y "Sin probar", cuadro de probado guardado en `S.atlasTested`. Todos los géneros tienen familia (`familyOf`).
- Voces: la caja (`snare`) suena como caja; antes caía en tom. Lo-fi cuenta como estilo calmo en la gramática.
- Pruebas: `tests/rhythms.mjs` nueva; `tests/atlas_smoke.py` cubre filtros y marca; las 22 suites y el smoke pasan.

### 28. Mundo infinito, fase 1 — rama `feat/infinite-world-foundation`

Continentes sonoros con tamaños desiguales, fronteras curvas, tonalidad, familia de géneros y color propios; mares de silencio (~32 %) entre ellos. Campo de vitalidad que reemplaza los niveles de relleno, con música que se adelgaza en lo vacío y un drop al llegar a un oasis. Hitos (torre, árbol madre, ciudad, monolito, faro) que se oyen desde lejos con filtro y paneo, se intuyen por un brillo en el borde y se ven como siluetas grandes. Logros `hito1`, `hito10`, `continente3`, `mar1`. Detalle en HANDOFF ("Mundo infinito · fase 1"). Cambia el paisaje y la música de muchas coordenadas antiguas; fixtures recapturados. Pruebas nuevas `tests/world.mjs` y `tests/world_smoke.py`; 23 suites y los tres smokes pasan.

### 29. Mundo infinito, fase 2 + volumen — rama `feat/infinite-world-journey`

Tierras raras por distancia (criaturas más grandes, colores imposibles, afinación torcida por región), récord de distancia con logros y aviso de campamento, mapa dibujado con hitos oídos como "?" y tarjeta para compartir, y cadena de salida más fuerte (+~6 dB RMS con limitador y saturación suave). Detalle en HANDOFF ("Mundo infinito · fase 2"). Pruebas `tests/journey.mjs` y `tests/journey_smoke.py`; 24 suites y cuatro smokes pasan.

### 30. Móvil como app (PWA) y control táctil — rama `fix/mobile-pwa`

Instalable con manifiesto, iconos y service worker; sin zoom, rebote ni gestos del navegador; joystick flotante que funciona desde cualquier punto de la pantalla (corrige que el arrastre no respondiera al empezar sobre el HUD); halo del pixel y oasis algo menos densos. Prueba `tests/mobile_smoke.py`.

### 31. Mundo infinito, fase 3 — rama `feat/infinite-world-wonder`

Rarezas en tres niveles con reglas propias (gravedad invertida, canon, frenesí, tiempo detenido, espejo del Origen, luna de oro), muestras únicas para el Estudio, logros y estrellas en el mapa; rumores de la Voz con dirección y distancia; ríos infinitos que corren río abajo con energía creciente y gotas a tempo. Detalle en HANDOFF ("fase 3"). Pruebas `tests/wonders.mjs` y `tests/wonders_smoke.py`; 25 suites y seis smokes pasan.

### 32. Mundo vivo y volumen de fiesta — rama `feat/infinite-world-alive`

Confluencias entre dos familias de ríos con mezcla musical, ríos en el mapa, tormentas que viajan con el viento (lluvia de notas, truenos, se pueden perseguir), estaciones semanales por continente con tempo, color de sonido y partículas, huellas y campamentos antiguos. Segunda subida de volumen (RMS ~−5,7 dB) y sesión de audio de iPhone en modo música. Pruebas `tests/alive.mjs` y `tests/alive_smoke.py`; 26 suites y siete smokes pasan.

### 33. Capas: Subsuelo y Cielo — rama `feat/world-layers`

Portales (grietas y escaleras de luz) que se abren con pulsos seguidos en el beat; Subsuelo donde un paso vale ocho de arriba, con salidas en columnas de luz y música grave propia; Cielo con vista del continente para elegir dónde bajar. Logros `bajo1`, `cielo1` y `atajo`. Prueba `tests/layers_smoke.py`; 26 suites y ocho smokes pasan.

### 34. Mezcla limpia — rama `fix/cleaner-loud-mix`

Menos saturación con volumen alto: compresión más suave con ataque más lento, saturación casi lineal, compensación ×5,6. RMS ~−8,4 dB y la mitad de muestras calientes que antes.

### 35. Hacer música en el lugar — rama `feat/looper-band` (incluye la 34)

Looper de ecos de 2 compases que se quedan sonando en el mundo; banda de criaturas por papeles con combos; mesa de efectos estilo Kaoss pad con filtro, espacio, eco, robot y stop de cinta. Pruebas `tests/jam_smoke.py` y `tests/fx_smoke.py`; 26 suites y diez smokes pasan.

### 36. Revisión, nitidez y plan consolidado — esta rama

Revisados Markdown, historial y código de Claude, ejecutadas 26 suites y diez smokes. `mix.js` + cambios en audio/FX: salida lineal hasta 0,9, rodilla de protección y margen, corte subsónico, filtrado de retornos reverb/eco y resonancia neutra moderada. Composición/instrumentos actuales conservados. Prueba real `tests/audio_mix.py`/helper mjs: 13 casos y distorsión de salida; resultados en REVISION. Actualizados documentos y organizado plan de 31 fases con nuevas ideas y prioridad de generador ampliable. No se implementan vidrios/espejos, culturas, favoritos ni otras fases futuras. Fallos de cruces documentados, pendientes de rama propia.

## Persistencia y compatibilidad

Clave `pixel-blanco-v4` conservada, progreso local. Además de campos originales: journal, softMusic, relicSites y estrellas con metadatos, session/lastSession, atlasTested, continents/continentsN, landmarks/landmarksN/heardLm, maxRing/oasisN, anomalies/anomaliesN, storms/confluences, steps/camps, layer/under y ecosN. Muchos se inicializan al usarse, no todos aparecen en fresh(). Partidas previas conservan datos disponibles, sin inventar historial. Esta rama no añade guardado nuevo.

Ecos son temporales (máximo cuatro), banda y estado de FX también; ecosN conserva contador, no eventos. Radio y receta exacta del compás no se guardan. Reacciones/posiciones móviles pueden perderse al reconstruir chunk. Continentes cambiaron paisaje, densidad, color y música de coordenadas antiguas; fixtures se recapturaron. IDs/nombres/registros anteriores se mantienen donde aplica: no afirmar conservación visual total tras esos cambios.

Favoritos/escenas/versiones para recuperar música exacta siguen pendientes. Sin cuentas/guardado remoto/multiplayer.

## Pruebas y reproducción

Servir por HTTP (`python3 -m http.server 8000`); Node >=18 sin npm install para aplicación. `npm test` ejecuta 26 suites: core, radio, voices, gravity, journal, scanner, playthings, personality, pockets, feedback, relics, effects, session, palettes, grammar, spatial, neighborhoods, references, phenomena, patches, atlas, rhythms, world, journey, wonders y alive.

Diez smokes Python: smoke, atlas_smoke, world_smoke, journey_smoke, mobile_smoke, wonders_smoke, alive_smoke, layers_smoke, jam_smoke, fx_smoke. Requieren Playwright/Chromium (`CHROMIUM_PATH` opcional), servidor propio y contexto de prueba, no partida personal. Esta rama añade audio_mix.py, con módulo de navegador audio_mix.mjs; no es suite Node ni test artístico. Pasaron las pruebas indicadas; casos cruzados aún faltan (REVISION).

## Límites actuales

52 estilos y 11 biomas con gramáticas/catálogos acotados, gran espacio procedural compartido, no infinitud literal de tipos. Muestra de 10.000 regiones: 1.517 combinaciones bioma/género/gravedad, 10.000 recetas detalladas diferentes; no certifica diferencias perceptivas equivalentes.

Sin favoritos, orientación a ellos, autopilot, escenas exactas, ecos persistentes, grabación audio/video ni red. Mapa sí existe y puede compartirse; looper/banda/FX también. Audio/render comparten hilo, cacheado/profiling de sesiones largas pendiente. Linterna/gesto inicial/suspensión y localStorage condicionan uso. PWA instalable no equivale a offline completo probado. Restos de slider/diseño externo/editorial de Voz pendientes. Ver REVISION para cruces de capas/Estudio/jam y PENDIENTES para orden de mejoras.

## Trazabilidad exhaustiva

Se inventarían todas las etapas de producto del historial desde `596fa31`, incluidos correcciones, arquitectura, interfaz, audio, mundo, persistencia y pruebas. Los commits repetidos de radio/voces y resolución de conflictos representan integración de las mismas etapas, no funciones adicionales. Para auditar líneas concretas: `git log --reverse --oneline`, `git show <commit>` y `git diff 596fa31..main`. HANDOFF conserva explicación de los sistemas originales y detalles de ejecución; PENDIENTES separa acuerdos futuros de funciones actuales.

### 37. Fase 2: capas, Estudio y looper — rama encadenada

`feat/02-layer-jam-consistency`, base `fe32566`. Corrige fuentes de superficie en capas, ADN tras Estudio, regiones sintéticas/rasgos/capa de ecos y autoría explícita de eventos. 26 suites y smokes de jam, capas e integración móvil/escritorio aprobados. Sin nuevos logros/campos de partida; se conserva la banda para volver a superficie. Cadena en RAMAS.md.

### Fase 3 de la cadena: Catálogo y recetas de lugar

`feat/03-world-recipe-catalog`. Cada región tiene una receta estable de carácter, materiales, distribución, acciones y presupuestos. Bitácora y Escuchar muestran su carácter; también reconocen Subsuelo y Cielo. El catálogo valida entradas y usa semillas independientes por elemento. Esta base conserva paisaje y música existentes; la distribución se aplica en fase 4. No añade culturas ni objetos nuevos todavía. Pruebas: 27 suites Node y smoke móvil/escritorio. Ver RAMAS.md.

### Fase 4 de la cadena: Combinaciones coherentes

`feat/04-coherent-world-combinations`. Las recetas ya distribuyen los elementos nuevos: tres disposiciones, 35 tamaños de población observados, afinidad de movimiento y materiales, y claros de escucha libres. En fronteras se usa el bioma real del chunk con el presupuesto regional. Flora, criaturas, suelo, reliquias y sus IDs anteriores se conservan; las posiciones y tipos de juguetes se regeneran según receta. Se mantiene la música y sus límites, con afinidad suave de material. Pruebas: 28 suites Node (fixtures de paisaje excluyen juguetes), combinaciones y smoke móvil/escritorio. Ver RAMAS.md.

### Fase 5 de la cadena: Lenguaje gráfico y capas de información

`polish/05-world-visual-language`. Elementos nuevos, fenómenos e hitos comparten trazos, materiales y límites de brillo; el jugador conserva el blanco principal. Subsuelo y Cielo usan fondo negro, y el Cielo muestra contornos en vez de llenar regiones de color. La banda desplaza sus ranuras cuando hay FX, Escuchar o avisos; la mesa adapta su altura en pantallas cortas. Guía reutilizable en visual.js, sin alterar música. Pruebas: 28 suites Node; smokes FX, jam, capas y táctil; capturas móvil/escritorio revisadas. Ver RAMAS.md.
