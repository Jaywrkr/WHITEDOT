# Handoff vigente · cierre F4 · Síntesis y conexiones de señal

Rama `feat/cierre-f4-sintesis`, basada en F3. Jay autorizó continuar las diez fases; no pedir de nuevo autorización para las restantes. Commit/push por fase; Jay crea PR/merge. No reescribir ramas publicadas. Ver [plan vigente](PLAN_CIERRE_2.0.md).

- `modular-synth.js`: siete motores originales; 32 especificaciones totales. Piano modal, viento con respiración/vibrato, ensamble sostenido, mezcla entre tablas armónicas, catorce granos afinados con ventanas, cuerda de retardo fraccional/amortiguación y membrana modal. Sin grabaciones ni presets comerciales.
- Presupuesto de 24 voces avanzadas, buffers y tablas acotados; limpieza de nodos mediante un centinela que espera a todos los granos. Rutas de instrumentos avanzados duran 2,9 s, evitando cortar sus colas. La cuerda física se comprueba por amortiguación y autocorrelación, no solo metadatos.
- `modular-routing.js`, `patches.js` y tejedora: hasta seis conexiones tipadas, filtros/CV y resonancia paralela reales, sin evaluación recursiva ni feedback libre. Pasar dos anclas conecta; permanecer entre puertos sobre un hilo lo retira. Se mantienen notas/patrones anteriores y edición con dedo. Identidades externas estables por fuente/coordenadas.
- Paletas, familias y Bitácora incluyen los instrumentos; laboratorio suma siete demos orgánicas: 146 entradas/19 grupos, 15 instrumentos de Síntesis y 16 filtros. Geist Mono, UI silenciosa y controles anteriores conservados.
- Pruebas de nodos incorporan las APIs nuevas en sus dobles. La comprobación de instrumentos antiguos conserva todas sus aserciones y busca voces reales en más recetas; no presupone el reparto anterior en ocho fixtures. SW añade los dos módulos una vez. La expansión de composición corresponde a F5.

Auditoría limpia; 84 suites Node y 5 recorridos afectados aprobados. 18 renders de los siete motores y cables conectados/desconectados aprobados; pico 0.907871, cero muestras calientes, 44,1/48 kHz. CI completo y aceptación en teléfono físico pendientes. [Evidencia](scripts/cierre-f4-validation.json).

## Entregas anteriores

Lo que sigue conserva sus alcances históricos; prevalece el encabezado actual.

# Handoff vigente · cierre F3 · Hábitats y conducta local

Rama `feat/cierre-f3-ecosistemas`, basada en F2. Jay autorizó continuar las diez fases; no pedir de nuevo autorización para las restantes. Commit/push por fase; Jay crea PR/merge. No reescribir ramas publicadas. Ver [plan vigente](PLAN_CIERRE_2.0.md).

- `habitats.js`: nichos espaciales deterministas, humedad/fertilidad, visitantes y cinco estrategias ecológicas. Forrajeo, refugio, agrupación, vigilancia e incursiones locales cambian decisiones reales, con movimiento limitado al radio del individuo.
- `living-mind.js` y `living.js`: prioridad a peligro y respuesta del jugador; después necesidades del hábitat. Flora/estructuras siguen estáticas y expresan apertura. Las especies nativas anteriores reciben mentes sin alterar su ADN ni reclutamiento; las plantas cambian apertura por ambiente.
- `living-ecology.js`: reloj analítico de lugares lejanos y actualización ecológica cercana cada 250 ms. Índice espacial y hasta doce vecinos por relación; reloj y guardado se reinician correctamente al cambiar ámbito. No es migración de poblaciones entre continentes ni simulación mundial continua.
- Anatomías de F2 expresan la apertura. Hábitats, comportamiento y radio musical siguen compartiendo el paisaje F1. SW incorpora el módulo una sola vez; progreso y coordenadas se conservan.

Auditoría limpia; 83 suites Node y 5 recorridos afectados aprobados. 34 renders: 28 respuestas de linajes y seis con reloj/decisiones ecológicas activos, mezclas densas y 44,1/48 kHz aprobados; ver evidencia de audio de esta fase. CI completo y aceptación en teléfono físico pendientes. [Evidencia](scripts/cierre-f3-validation.json).

## Entregas anteriores

Lo que sigue conserva sus alcances históricos; prevalece el encabezado actual.

# Handoff vigente · cierre F2 · Anatomías reproducibles

Rama `feat/cierre-f2-especies`, basada en F1. Jay autorizó continuar las diez fases; no pedir de nuevo autorización para las restantes. Commit/push por fase; Jay crea PR/merge. No reescribir ramas publicadas. Ver [plan vigente](PLAN_CIERRE_2.0.md).

- `anatomy.js`: descriptor validado, semillas independientes de linaje/individuo y topologías con ramas, segmentos, pétalos, alas, caparazones, membranas y órganos según rol. 896 variantes verificadas y 28 linajes visualmente distintos. No consume RNG del mapa.
- `anatomy-view.js`: integra especies nativas y los seis tipos de plantas anteriores, además de los 28 linajes. Caché de perfiles débil y de Path2D acotada; geometría estática reutilizada con respiración leve. Contornos pequeños, color local, movimiento reducido y sin controles nuevos.
- `living-portraits.js`, tarjetas y libro comparten la gramática del Mundo. `appearance` se normaliza aditivamente; tarjetas nuevas conservan el descriptor visto, tarjetas antiguas siguen legibles. No cambia progreso, odds ni coordenadas.
- La prueba de tarjetas compara rareza con el catálogo vigente: las probabilidades territoriales sin medir siguen siendo nulas, no se reemplazan por el antiguo 1/256. SVG/PNG y contacto musical reales comprobados.
- SW actualizado con dos módulos una sola vez. La siguiente fase es ecología, no síntesis.

Auditoría limpia; 82 suites Node y 5 recorridos afectados aprobados. Sin cambios de síntesis/audio en esta fase. CI completo y aceptación en teléfono físico pendientes. [Evidencia](scripts/cierre-f2-validation.json).

## Entregas anteriores

Lo que sigue conserva sus alcances históricos; prevalece el encabezado actual.

# Handoff vigente · cierre F1 · identidades completas

15 de octubre de 2026. `feat/cierre-f1-identidades` parte de `main 6702093` (M1 integrada). Prioridad: [PLAN_CIERRE_2.0.md](PLAN_CIERRE_2.0.md), diez fases consolidadas; solo F1 está implementada aquí. Jay crea PR/merge. La próxima rama parte de esta si aún no está integrada; comprobar remoto/ascendencia. No incorporar sin validar los trabajos locales de cubo/menú/Bitácora/logros/casa.

- `world-families.js`: ocho gramáticas compatibles con bioma y afinidad musical, variantes independientes por región. `region.worldFamily` y `recipe.worldFamily`, sin cambiar generador, direcciones ni esquema de partida. Campos espaciales proyectan habitantes comunes; terreno, posiciones brutas y raros/arquitectura conservados. Golden histórico mantiene su hash excluyendo solo la propiedad aditiva `worldFamily`.
- `world-family-art.js`, `render.js`: contornos pequeños sobre negro, coordenadas del mundo, opacidad por distancia y presencia continua según detalle. Movimiento reducido; solo superficie. Sin panel nuevo ni sonido de UI.
- `living-populations.js`, `blobs.js`: dominantes compatibles, proporción flora/fauna y nichos compartidos. Proyección de comunes sin trasladar raros. `living.js`/`living-mind.js`: material/color del trazo y velocidad de fauna. Sin anatomías nuevas ni simulación ecológica completa.
- `musical-recipes.js`/`synth-colors.js`: timbre compatible, articulación, aire, brillo y preferencia de filtro ligados a familia/material. Conserva batería, tempo, escala, identidad de género, presupuestos y protección del bajo. No es aún síntesis modular ni híbridos libres.
- `practice-travel.js`: contraste de familia; cubo dentro de la región elegida al colocarlo junto al habitante. Regreso, guardado y bloqueos conservados. Llegada, semillas y Bitácora muestran identidad de paisaje.
- Laboratorio: ocho destinos reales, habitantes naturales; 139 entradas/19 grupos. Notas/IDs antiguos conservados. Las entradas de paisaje no fuerzan instrumento ni figura.
- SW nuevo, dos módulos añadidos una vez. Pruebas Node, navegador de ocho lugares/regreso, audio de paisajes/criaturas. CI completo suma el programa de audio (13 programas, tres grupos). `tests/audio_mix.mjs` acepta destino real sin sustituir su ADN; modo anterior conservado.

Auditoría limpia, 81 suites Node, 14 recorridos afectados y 48 renders en dos programas, pico 0.909774/cero muestras calientes. [Evidencia F1](scripts/f1-validation.json). CI completo sigue requerido antes de merge. Escucha artística y rendimiento físico pendientes. Próxima fase: F2 formas; F3 ecología; F4 síntesis. Casa desde arriba ya decidida, recuperar en F9. No iniciar otra fase sin instrucción de Jay.

## Entrega anterior · M1 integrada

Lo siguiente conserva el alcance y evidencias anteriores. Prevalecen la rama y orden de cierre del encabezado.

14 de octubre de 2026. Rama `feat/m1-musical-identity` desde `main 08d1833`, que ya integró `feat/geist-and-phase-plan` mediante los PR #101/#102. Jay autoriza M1 y Geist Mono en absolutamente todo. Commit/push en rama; Jay crea el PR y merge. No se publica main desde esta fase.

- `src/musical-recipes.js`: 16 arreglos versionados, compatibilidad con los 52 estilos y selección determinista por región/género. No consume RNG del mapa ni añade campos a la partida. Motivo, bajo, progresión, instrumentos, articulación, acentos, swing, límites de energía/aire y silencios entran en reproducción.
- `radio.js`, `audio.js`: identidad de radio y vecino; conserva batería/BPM/escala nativos. Las pausas no pueden vaciar el bajo. La prueba de radio recorre ciclos completos, incluso introducciones largas de ambient/footwork.
- `src/living-mind.js`: preferencias individuales y decisiones compatibles con capacidades de fauna, flora y construcciones. `living.js` crea el perfil al activar al individuo, muestra apertura y mirada y reutiliza vecinos para decisiones. `living-behavior.js` conserva un fallback heredado para objetos sin perfil. `living-catalog.js`/`voices.js` usan la fuente al escoger voz individual; ecología consume actividad. Ningún progreso se borra; perfiles se reconstruyen por ID/semilla. Memoria durable de relaciones queda para M4.
- `src/living-populations.js`: composición territorial por bioma en bloques de 3×3 regiones; dominantes de una a tres especies, cuatro densidades y proporción fauna/flora. `living.js` conserva las estructuras y raros anteriores y añade como máximo dos individuos agrupados por chunk, con índices 10/11 sin colisión. `blobs.js` proyecta la población nativa sin mutar chunks/RNG del terreno; `vida-music.js` favorece especies de bandada comunes por territorio y conserva tiradas raras/posición. No todas las familias antiguas están integradas en el mismo modelo ecológico.
- `src/practice-travel.js`: botón **Saltar** visible en Mundo; hasta 24 candidatos con contraste y habitantes, historial de ocho recetas, retorno desde menú. Normaliza `S.practiceTravel`, guarda antes de mover y rechaza saltos si falla el guardado o hay grabación/escaneo. Reinicia fuentes/colas transitorias, conserva progreso, mascota y ecos. Actualiza `addr=WD1` para recarga exacta; `seeds.js` retira direcciones antiguas al cambiar explícitamente de semilla. La banda utiliza armonía vigente manteniendo voz individual. El retorno recupera lugar/capa, no el montaje de un elemento del laboratorio.
- `src/synth-colors.js`, `instruments.js`, `patches.js`: ocho nuevas familias (25 especificaciones totales) y 16 programas originales; filtros móviles con cascadas reales de 12/24/36/48 dB/oct en paso bajo, banda/muesca sin atribuir esas pendientes. Registro, resonancia, ganancia y filtros de bajo limitados; nodos de instrumentos se desconectan al acabar. `feedback.js` guarda el movimiento de cada nota y dibuja arcos locales de apertura/cierre; `journal.js` migra aditivamente `music.programs` y registra colores oídos.
- `lab-catalog.js`, `lab.js`: 131 entradas y 18 grupos, las 91 antiguas más 16 recetas, ocho instrumentos y 16 filtros. Las recetas localizan regiones reales compatibles; las demos usan un objeto orgánico pequeño tocado con el cubo, no teclas ni audio de botones. IDs/notas anteriores conservados.
- `rare-card-model.js`: frecuencia de flora/fauna nueva sin estimar tras cambiar la distribución; no presenta 1/256 como frecuencia observada. Probabilidades históricas guardadas se conservan, y reglas de ballenas/estructuras no cambian.
- Geist Mono es la única familia activa en CSS, Canvas y exportaciones, nueve pesos 100–900. Silkscreen y JetBrains quedan con licencias/hashes históricos fuera de CSS y precache. `sw.js` cambia su caché y suma exactamente una vez los cinco módulos nuevos.
- Pruebas nuevas de recetas, mentes, poblaciones, viaje y filtros; navegador comprueba destinos, contacto, retorno/recarga y laboratorio. Audio añade `music_identity_mix.py` y `synth_bank_mix.py` al runner completo. CI reparte sus doce programas de audio entre tres grupos, sin omitir ninguno; `browser-audio` mantiene el nombre requerido y exige navegador y todos los grupos en verde. El comando local sin `WHITEDOT_AUDIO_SHARD` conserva la ejecución completa secuencial. Auditoría estática, lógica, recorridos afectados y renders ejecutados están en [scripts/m1-validation.json](scripts/m1-validation.json). `tests/audio_mix.mjs` difiere desconexiones solicitadas durante programación virtual hasta que el contexto comienza a renderizar; las notas anteriores no pierden filtros por el reloj simulado. No aplicar este override al juego, que utiliza el reloj real. No confundir comprobación automatizada con escucha artística o rendimiento físico.

Siguiente fase musical: M2 en [PLAN_MEZCLAS_MUSICALES.md](PLAN_MEZCLAS_MUSICALES.md); todavía pendiente. M1 da perfiles a los 28 linajes nuevos, no certifica personalidad única de las 109 familias. La cobertura global y la percepción son criterios de M5. Las fases locales 3→7→6→4→5 de PLAN_2.0 conservan sus trabajos pendientes; no se incluyen en esta rama.

## Handoff anterior · contexto histórico

Lo que sigue describe la entrega alpha anterior; para rama, fuente, conteos y pruebas actuales prevalece el encabezado y CAMBIOS.

> **Reglas y pendientes actualizados:** Jay aprobó pruebas proporcionales: auditoría/lógica completas y navegador/audio afectados antes de push de rama; suites completas sobre el conjunto antes de publicar main y CI verde antes de merge. [AGENTS.md](AGENTS.md) prevalece sobre los comandos históricos. Geist Mono sustituye a JetBrains en el juego; Silkscreen conserva la frase principal. Colores al tocar e instrumentos se agrupan en `feat/geist-and-phase-plan`. [PLAN_2.0.md](PLAN_2.0.md) organiza pendientes; [PLAN_MEZCLAS_MUSICALES.md](PLAN_MEZCLAS_MUSICALES.md) es SOLO DISEÑO: Jay pidió no implementar los híbridos todavía. Rebasar las fases locales pendientes sobre la base vigente antes de publicarlas, conservando progreso y decisiones.

> **Integración excepcional actual:** por instrucción explícita de Jay se reúnen en `main` las fases 0, 1 y 2 y `fix/vercel-static-output`. Validación conjunta aprobada: auditoría, 75 suites Node, 52 recorridos más offline y 259 renders de audio. [Evidencia](scripts/main-integration-validation.json). Publicación de Vercel todavía por confirmar. Las fases posteriores siguen fuera de main. La siguiente entrega usa rama, commit y push; Jay crea PR y merge. Los estados históricos de abajo no cambian esta instrucción.

> **Continuidad 2.0 · fase 2:** `v2/f2-celebracion` depende de fase 1 `88aeab1`. [src/celebration-model.js](src/celebration-model.js) gestiona cola/tiempos y fragmentos; [src/celebration.js](src/celebration.js) coordina tarjetas, pausas, apertura y exportación 4:5; [src/celebration-audio.js](src/celebration-audio.js) ejecuta el remate bajo/medio nativo a tempo. `cajas.js` conserva beneficios temporales y expone segundos restantes; `rare-cards.js` evita duplicar el aviso de caja y explica efecto/duración en el libro. `rewardEarned` es visual: ningún botón activa música. El programa [tests/celebration_mix.py](tests/celebration_mix.py) mide el evento real junto a mezclas densas y está incluido en `test:audio`.

> **Continuidad 2.0 · fase 1:** `v2/f1-universo-visual` depende de fase 0 `f8af7c4`. [src/world-visibility-model.js](src/world-visibility-model.js) contiene curvas, perfil de niebla/luz, precarga, hash visual independiente y planos. [src/world-visibility.js](src/world-visibility.js) integra niebla, suelo, huellas y adaptación de detalle. `render.js` separa radio visual/escucha; `living.js` precarga y mezcla figura/punto; `vida.js` y `visual.js` atenúan antes del corte. La niebla cubre el paisaje antes de dibujar el cubo; los controles siguen silenciosos. Aceptación física de 60 FPS pendiente. Estado y pruebas en [CAMBIOS.md](CAMBIOS.md).

> **Continuidad 2.0:** fase 0 en `v2/f0-coleccion`, desde `main c8d286e`. Reglas y estado vigente en [PLAN_2.0.md](PLAN_2.0.md) y [CAMBIOS.md](CAMBIOS.md). Las referencias alpha que siguen son históricas.
>
> **Colección:** [src/rewards-model.js](src/rewards-model.js) define catálogo, rarezas, migración y concesión idempotente. [src/rewards.js](src/rewards.js) integra `awardReward`, `recordRewardSource`, `rewardPieces`, `ownsReward` y resumen de Bitácora. `progress.js` reconcilia al cargar/cambiar ámbito/guardar; el guardado conserva fechas y piezas futuras. Los 13 cosméticos salen de `cube-model.js`; `data.js` comparte sus colores. [scripts/rewards-audit.mjs](scripts/rewards-audit.mjs) estima ritmo bajo supuestos explícitos, sin telemetría ni promesa de rareza.

> **Trabajo actual: [PLAN_2.0.md](PLAN_2.0.md)** (fases de la 2.0) y reglas de agentes en [AGENTS.md](AGENTS.md).

> **Actualización 14 oct · cierre 1.1.0 con estilo J.** Las ramas `cierre/f1`→`f6` (ver [CAMBIOS.md](CAMBIOS.md)) parten de `main` 959e95e, que ya integra las diez fases. Añaden la capa `styles/estilo-j.css`, textos J, licencia, Open Graph, sets 4:5, sello de deploy en Vercel, ocultan "Cuenta y duetos" sin servidor y estabilizan tres pruebas de navegador. Producción: https://whitedot-inky.vercel.app (Vercel estático; el servidor opcional no corre ahí). Lo que sigue es la [aceptación](ACEPTACION_V1.md). El resto de este documento describe el estado alpha.10.

# Handoff para Claude · Universo vivo

Estado del juego: **1.1.0-alpha.10**. Esta actualización modifica documentación; conserva el código y la versión de la entrega probada. Leer este documento primero: los estados RC y los planes antiguos se conservan como historia y no describen el alcance actual.

## 1. Desde qué rama continuar

- **Rama de este handoff:** `docs/claude-handoff-universe-alpha`, hija de la fase 10; incluye las diez fases y añade esta documentación.
- **Última entrega de código:** `feat/universe-10-server-duets-validation`, commit `57fb5d2a90970edcf9d29cb046dd80e6b16e86b3`.
- **Main remoto comprobado al preparar este handoff:** `704ae071a38785fe1b3af534d8e94d9c98d36d43`. Las diez fases todavía no estaban integradas en main. Volver a comprobar GitHub antes de trabajar: Jay puede haber hecho merge después.
- Flujo acordado: rama nueva, commit y push; Jay revisa, crea los PR y hace merge. Agrupar cambios relacionados para evitar decenas de ramas pequeñas. La petición de este turno es dejar documentación para continuar en Claude.

Si main sigue en esa revisión, partir de esta rama de documentación para conservar todo lo nuevo. No partir de un main antiguo y recrear funcionalidades ya implementadas. No resetear cambios de Jay ni reescribir las ramas publicadas.

[RAMAS.md](docs/historial/RAMAS.md) contiene el orden. Merge normal que conserve los commits: 01 → 10 → este handoff. Evitar squash/rebase de los padres mientras existan ramas dependientes. Las ramas archivadas de entregas anteriores no se vuelven a integrar. El plan `docs/universe-150-phases` ya está incluido en la fase 01.

## 2. Qué se entregó realmente

| Sistema | Estado actual |
|---|---|
| Base procedural | 11 biomas, 33 hábitats y 52 géneros conservados; semillas y posiciones antiguas compatibles |
| Contenido nuevo | 28 linajes: 10 flora, 10 fauna, 8 construcciones; aparición natural, gestos y respuestas musicales |
| Registro y laboratorio | 109 familias registrables, 91 entradas del laboratorio, 49 tipos de tarjeta |
| Música | Gramática regional, swing, articulación, bajos por género, capítulos de radio, acordes con conducción, arpegios, timbres y presupuesto ambiental compartido |
| Vida | Personalidades individuales, actividad, crecimiento visual, ciclos, relaciones por proximidad y transmisión local de frases |
| Arquitectura | Gestos de quietud, órbita, alineación y recorrido; recuerdos persistentes, 12 estudios originales y narrativa opcional del Camino |
| Voz | Texto contextual opcional: discreta, guía o poética; recuerda aprendizajes y guarda mensajes completos |
| Cajas y mascotas | Beneficios nuevos temporales con reloj de juego; compañía de caja temporal; mascotas permanentes ya ganadas conservadas |
| Exploración | Regiones Gran territorio/Inmenso, microhábitats, tres capas existentes, paseo automático con intención y regreso entre semillas |
| Hallazgos | Retratos propios, contexto, observaciones, filtros de colección, exportación PNG y códigos de lugar |
| Servicio opcional | Cuentas/invitados, copias con revisión y conflicto, salas privadas de dos personas y construcciones compartidas; experimental |

Las diez ramas tienen una implementación integrada. Eso no significa que se hayan terminado todas las ampliaciones de las 150 ideas: **105 base jugable, 40 parciales, 2 pendientes y 3 externas**. La lista exacta, con alcance y fuentes para cada idea, está en [COBERTURA_150_UNIVERSO.md](COBERTURA_150_UNIVERSO.md). No marcar los parciales como completos al actualizar los documentos.

## 3. Dirección creativa que debe conservarse

- Fondo negro, espacio y silencio visual. Cubo blanco por defecto; personalización ganada. Color principalmente en objetos, encuentros y huellas musicales.
- Línea gráfica sencilla, natural y electrónica. Mantener objetos grandes contenidos; evitar paneles permanentes, teclados cuadrados y efectos que tapen la exploración.
- La interacción normal sucede **con el cubo**: caminar, tocar, permanecer, rodear, empujar. El dedo mueve el cubo; `?dedo=1` y automatización conservan un modo de pruebas heredado.
- UI silenciosa: menús, botones, autenticación, tarjetas y exportaciones no generan sonidos musicales.
- Música electrónica cálida, agradable y nítida. Alternar graves, medios, percusión, espacio y melodía según género y ambiente; no resolver toda interacción con una nota aguda. Preservar la lluvia y el viento suave.
- La música debe evolucionar aunque la persona permanezca quieta. Más elementos deben aportar funciones distintas y pausas, sin aumentar continuamente la densidad.
- Fijar sonidos permanece desactivado por defecto. Conservar borrado/sustitución de ecos y explicar sus gestos con claridad.
- Hallazgos raros por condiciones reales, sin inflar probabilidades ni confundir familias con ejemplares. Culturas diversas como inspiración documentada; no afirmar autenticidad de una interpretación sin investigación.
- Todo debe sentirse unido al Camino, la atención, crear, perseverar y compartir. Primero ordenar y mejorar lo existente antes de añadir capas de controles.

## 4. Mapa técnico para continuar

Aplicación estática de módulos JS nativos, Canvas y Web Audio. No requiere instalar dependencias npm ni compilar para ejecutarse. Node >=18 para pruebas; Python para servidor y pruebas de navegador. La aceptación de navegador usa Playwright y Chromium.

| Archivos | Responsabilidad y precaución |
|---|---|
| [src/main.js](src/main.js) | Composición de sistemas y runtime. Inicialización única; getters no redefinibles. No exponer runtime en producción; las pruebas lo instrumentan al servir el módulo |
| [src/world-identity.js](src/world-identity.js), [src/seeds.js](src/seeds.js) | Identidad, versiones, perfiles, separación de partidas y retorno WD1. Guardar antes de salir y preservar coordenadas/capa exactas |
| [src/living-catalog.js](src/living-catalog.js), [src/living.js](src/living.js) | Catálogo/distribución y comportamiento integrado; semillas independientes `living:*:v1`, caché de 48 sectores, escucha y presupuesto ambiental |
| [src/living-art.js](src/living-art.js), [src/living-portraits.js](src/living-portraits.js) | Glifos y retratos originales de los 28 linajes |
| [src/living-synthesis.js](src/living-synthesis.js), [src/living-voicing.js](src/living-voicing.js), [src/instruments.js](src/instruments.js) | Timbres, articulaciones y acordes. Mantener niveles, registro y cachés acotados; no introducir notas fuera de la armonía por ratios mayores fijos |
| [src/living-composition.js](src/living-composition.js), [src/radio.js](src/radio.js) | Capítulos, bancos y variación. En duetos, frase y armonía derivan del reloj de sala para admitir entrada tardía |
| [src/living-behavior.js](src/living-behavior.js), [src/living-ecology.js](src/living-ecology.js), [src/living-terrain.js](src/living-terrain.js) | Movimiento, relaciones/ciclos y microhábitats. Movimiento nuevo local y acotado; no es simulación de poblaciones completa |
| [src/living-buildings.js](src/living-buildings.js), [src/living-studies.js](src/living-studies.js) | Construcciones, gestos, recuerdos y estudios culturales/históricos originales |
| [src/living-state.js](src/living-state.js) | Normalizar importaciones/guardados y reiniciar extensiones al cambiar ámbito; no filtrar progreso entre semillas |
| [src/power-clock.js](src/power-clock.js), [src/cajas.js](src/cajas.js), [src/voice-guide.js](src/voice-guide.js) | Tiempo activo, beneficios y Voz; pausar con herramientas, paneles, pestaña oculta y fuera del mundo |
| [src/living-discoveries.js](src/living-discoveries.js), [src/rare-cards.js](src/rare-cards.js), [src/favorites.js](src/favorites.js) | Registro real, contexto, tarjetas, rutas y favoritos |
| [src/connection.js](src/connection.js), [src/duet-model.js](src/duet-model.js), [server/app.py](server/app.py) | Cliente/API opcionales, sincronía, reparto de voces, cuentas y copias |
| [styles/interface.css](styles/interface.css), [src/accessibility.js](src/accessibility.js), [sw.js](sw.js) | Interfaz común, foco/cierres y shell offline. Todo módulo nuevo debe precachearse una sola vez |

No consumir RNG antiguo para añadir contenido: cambia posiciones existentes. Versionar los flujos de generación cuando corresponda. Mantener el control de audio también en callbacks programados, para que abrir UI no deje disparar una nota pendiente. El shell offline tuvo un fallo por un asset duplicado: ya corregido y auditado; no duplicar rutas al ampliar el precache.

## 5. Tamaño, coordenadas y variedad: cifras que sí podemos afirmar

Los tamaños son lados de **región**, no el borde total del mapa:

| Perfil | Unidades por lado de región |
|---|---|
| Clásico | 3.600 |
| Amplio | 7.200 en generación 1; 10.800 en generación 2 |
| Vasto | 18.000 |
| Gran territorio | 50.400 |
| Inmenso | 100.800 |

Tres capas actuales: superficie, bajo y cielo. Direcciones de magnitud menor de 10^12 por eje. Semilla + versiones de generador/catálogo/layout + tamaño + capa + coordenadas permiten guardar y volver con WD1; los favoritos ya permiten abrir lugares de otra semilla. Volver al punto no garantiza que un animal móvil o evento temporal siga allí.

[La muestra registrada](scripts/living-universe-validation.json) cubre 10.000 regiones en 20 semillas: 10.000 recetas estructurales distintas; 6.327 regiones terrestres con 6.327 firmas musicales distintas; aparecen los 52 géneros, 11 biomas y 28 linajes. **No es un conteo total de mundos ni prueba de 10.000 canciones perceptiblemente diferentes.** No extrapolar a millones ni multiplicar variables correlacionadas. La variedad que importa todavía debe comprobarse escuchando y jugando.

## 6. Pruebas y cómo reproducirlas

La entrega de código dejó **71 suites Node, 49 recorridos de navegador más offline y 253 renders de audio en 9 programas** aprobados. Audio a 44,1/48 kHz, pico máximo observado 0,9576108456 y cero muestras calientes. HTTP/SQLite y duetos entre dos navegadores también comprobados. [Evidencia consolidada](scripts/universe-phase-validation.json), [audio de los linajes](scripts/living-audio-validation.json).

Desde la raíz:

```sh
npm test
npm run audit:release
npm run test:browser
npm run test:audio
python3 tests/server_api.py
python3 tests/duet_smoke.py
node scripts/living-universe-audit.mjs
```

Consultar [PROBAR_UNIVERSO_VIVO.md](PROBAR_UNIVERSO_VIVO.md) para los gestos, laboratorio y pruebas manuales. Las pruebas de API usan datos temporales. La auditoría de integridad comprobó 123 módulos, 263 IDs de HTML, 287 imports estáticos y 135 assets únicos del shell; detecta rutas/enlaces rotos y duplicados offline. Las cifras registran la entrega, no sustituyen ejecutar los checks afectados tras cambiar código.

Estas métricas comprueban regresiones, audio finito y margen de nivel. **No certifican gusto musical, masterización profesional, batería, latencia física, rendimiento en teléfonos reales o preparación de producción.** La actualización de este handoff solo requiere auditoría documental e integridad; no atribuirle una nueva ejecución de toda la suite.

## 7. Pendientes y orden de continuación

1. **Aceptación del juego actual.** Probar encuentros naturales y laboratorio; escuchar géneros contrastantes, quietud larga, zonas densas, percusión, registros bajos y duetos. Registrar repetición real, acumulación de agudos y ruido visual con casos reproducibles. Quitar/afinar lo que distraiga antes de sumar contenido.
2. **Interacción y orientación.** Mejor anticipación por especie (idea 5), recorrido natural corto (7), deshacer general (3) y comparador de variantes/densidades (25). Afinar gestos continuos de flores/membranas y edición de conexiones; mantener movilidad con una mano y UI silenciosa.
3. **Profundidad musical.** Transiciones más largas (66), tensión/resolución (74), conducción de voces antiguas además de los acordes nuevos (75) y relación continua de viento/agua con swing (107). Revisar percepción de género sin renumerar los 52 IDs existentes.
4. **Ecología y territorios.** Redes extensas, colonización persistente, poblaciones, migraciones, bordes híbridos, jardines, rutas costeras/cielo y constelación de lugares. La fauna nueva se mueve localmente; los microhábitats dibujados no son aún rutas físicas o archipiélagos navegables.
5. **Arquitectura, búsqueda e historia.** Espacios acústicos/residentes, puentes que abran rutas reales, laberintos ópticos, expediciones ecológicas y colecciones instrumentales/culturales. Los espejos y vidrios previos funcionan; la arboleda nueva no es todavía un laberinto completo. Investigar y citar referencias antes de profundizar las culturas.
6. **Ideas aún no iniciadas.** 101: más alturas que las tres capas actuales. 114: réplicas/partituras históricas funcionales y documentadas. Los 12 estudios originales actuales no cumplen por sí solos esa segunda propuesta.
7. **Servicio y publicación.** Aceptación física en iPhone/Android (141), alojamiento HTTPS y deploy real (143), escucha/playtest y publicación gradual (150). Cuentas, copias, salas y edición compartida tienen bases, pero la operación pública y la calibración por Internet siguen parciales (144–149).

El detalle de los 40 parciales está en la matriz; esta priorización agrupa trabajo y no elimina propuestas. La próxima rama debe responder a la instrucción nueva de Jay; este handoff no exige implementar todos los pendientes antes de mostrarle mejoras concretas.

## 8. Servicio, despliegue y límites operativos

```sh
python3 server/app.py --host 127.0.0.1 --port 8080
```

Servidor opcional Python estándar/SQLite, mismo origen. Consultar [SERVIDOR_Y_DUETOS.md](SERVIDOR_Y_DUETOS.md). Progreso local/offline sigue disponible sin cuentas. SQLite en `server/data` está excluido de Git; no subir bases, sesiones ni credenciales.

Cuentas con scrypt, sesiones HttpOnly/SameSite, origen/CSRF y límites. Copias con revisión y conflicto sin sobrescribir. Salas privadas de dos voces; audio sintetizado localmente, reloj/armonía compartidos, invitación, presencia y construcciones abiertas persistentes. Salas de hasta dos horas, presencia de 30 segundos, ámbito ±5.000 unidades. Salas en RAM de un proceso: un reinicio las corta; cuentas/copias/marcas quedan en SQLite.

Faltan recuperación/borrado de cuentas, operación/respaldos/monitorización, revisión de abuso y escalado, dispositivos/redes reales y host público. No hay servidor público desplegado ni sesión de escucha física realizada. El borrador guardado de configuración del entorno Codex tampoco publica el juego.

[src/release-info.js](src/release-info.js) conserva `deployedAt: null` y `revision: null`. Registrar revisión y hora real con [scripts/stamp-deploy.mjs](scripts/stamp-deploy.mjs) **sobre el artefacto publicado** cuando haya deploy. Un commit, una prueba o este handoff no generan una fecha de publicación.

## 9. Lectura recomendada y actualización al devolverlo

1. Este handoff y [ESTADO_ACTUAL.md](docs/historial/ESTADO_ACTUAL.md).
2. [PROBAR_UNIVERSO_VIVO.md](PROBAR_UNIVERSO_VIVO.md) y [ENTREGA_UNIVERSO_VIVO.md](docs/historial/ENTREGA_UNIVERSO_VIVO.md).
3. [COBERTURA_150_UNIVERSO.md](COBERTURA_150_UNIVERSO.md), [PENDIENTES.md](docs/historial/PENDIENTES.md) y [SERVIDOR_Y_DUETOS.md](SERVIDOR_Y_DUETOS.md).
4. [UNIVERSO_150_IDEAS_FASES.md](docs/historial/UNIVERSO_150_IDEAS_FASES.md) como visión de diseño; [CUBO_Y_EXPANSION.md](docs/historial/CUBO_Y_EXPANSION.md) como contexto heredado de Claude. Sus estados originales son históricos.

Al terminar en Claude, actualizar estado, pendientes, matriz afectada, guía de prueba, entrega/ramas y handoff. Anotar rama/commit, comportamiento cambiado, migraciones, pruebas realmente ejecutadas y pendientes. Mantener evidencias históricas separadas de las nuevas; no declarar main actualizado ni un deploy sin comprobarlo.

## 10. Reparación prioritaria de Vercel

> **Reparación de Vercel · 14 oct:** `fix/vercel-static-output` parte de fase 0 `f8af7c4`, la rama del preview fallido. `vercel.json` fija `framework: null` y `outputDirectory: "."`; mantiene el sello de build y el SW sin caché HTTP. La auditoría protege esa configuración. Jay autorizó integrar esta reparación y las fases 0–2 en `main` solo en este caso; el deploy remoto queda por confirmar. Al continuar las fases dependientes, conservar estas opciones. Las cuatro nuevas peticiones de interacción/percusión figuran como pendientes en [PLAN_2.0.md](PLAN_2.0.md).
