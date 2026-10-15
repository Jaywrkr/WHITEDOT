# Experiencia · fase 9

Rama `feat/experiencia-09-creacion`. [Plan vigente](PLAN_EXPERIENCIA.md). Continuar fases autorizadas sin confirmación; Jay hace PR/merge.

Hasta cuatro tarjetas forman voces físicas en casa: función e instrumento del encuentro, posición editable y hasta ocho jardines conservados. Las tarjetas no se consumen; visitas quedan separadas y se comparte el presupuesto de cuatro voces por paso.

Validación: Auditoría/Node completos; experience_garden_smoke y house_v2_smoke; experience_garden_mix y house_mix. Sin aceptación física inventada.

## Estado anterior

# Experiencia · fase 8

Rama `feat/experiencia-08-atlas`. [Plan vigente](PLAN_EXPERIENCIA.md). Continuar fases autorizadas sin confirmación; Jay hace PR/merge.

Atlas visual con búsquedas optativas de voces complementarias, pistas locales discretas y relaciones conservadas al interactuar con otro habitante real. Sin flechas, premios artificiales ni sonido de botones. Estudios culturales previos conservan su identificación como creaciones originales.

Validación: Auditoría/Node completos; living-cards_smoke y journal_v2_smoke; audio sin cambios. Sin aceptación física inventada.

## Estado anterior

# Experiencia · fase 7

Rama `feat/experiencia-07-rareza`. [Plan vigente](PLAN_EXPERIENCIA.md). Continuar fases autorizadas sin confirmación; Jay hace PR/merge.

Reencuentros en condiciones diferentes enseñan interpretaciones reales: apagada, susurro, acento, deslizamiento o respirada. Elección silenciosa desde la tarjeta; sin duplicar premios ni descartar observaciones. Avisos repetidos del mismo tipo respetan un minuto de separación.

Validación: Auditoría/Node completos; living-cards_smoke y discovery_pacing_smoke; experience_learning_mix a 44.1/48 kHz. Sin aceptación física inventada.

## Estado anterior

# Experiencia · fase 6

Rama `feat/experiencia-06-hallazgos`. [Plan vigente](PLAN_EXPERIENCIA.md). Continuar fases autorizadas sin confirmación; Jay hace PR/merge.

Las tarjetas explican su función musical y celebran el encuentro con señales locales contenidas. El atlas conserva campos desconocidos; libros futuros quedan de solo lectura. La UI no inicia audio.

Validación: Auditoría/Node completos; living-cards_smoke y rare_cards_smoke; audio sin cambios. Sin aceptación física inventada.

## Estado anterior

# Experiencia · fase 5

Rama `feat/experiencia-05-casa`. [Plan vigente](PLAN_EXPERIENCIA.md). Continuar fases autorizadas sin confirmación; Jay hace PR/merge.

Casa con colocación anticipada, selección y arrastre directo de objetos; señales locales cuando suenan. Conserva Taller y visitas; versiones futuras quedan protegidas contra edición.

Validación: Auditoría/Node completos; house_v2_smoke y ui_silence_smoke; house_mix Web Audio. Sin aceptación física inventada.

## Estado anterior

# Experiencia · fase 4

Rama `feat/experiencia-04-viajes`. [Plan vigente](PLAN_EXPERIENCIA.md). Continuar fases autorizadas sin confirmación; Jay hace PR/merge.

Favoritos prioriza destinos con búsqueda, fichas compactas y códigos/opciones plegados. Una llegada nueva diaria conserva el punto anterior; continuar, direcciones explícitas y partidas de prueba respetan coordenadas. Guardar sigue a un toque.

Validación: Auditoría/Node completos y favorites_smoke, travel_v2_smoke, materia_smoke, favorite_save_failure_smoke. Sin aceptación física inventada.

## Estado anterior

# Experiencia · fase 3

Rama `feat/experiencia-03-camino`. [Plan vigente](PLAN_EXPERIENCIA.md). Continuar fases autorizadas sin confirmación; Jay hace PR/merge.

Camino alterna discretamente figuras de luz por día con flujo independiente. Invitación mínima a entrar, respetando movimiento reducido. Voz conserva diario y restringe presencia a introducción, solicitudes y convergencias excepcionales.

Validación: Auditoría y Node completos; guide_smoke, messages_smoke y first_level_smoke; audio sin cambios. Sin aceptación física inventada.

## Estado anterior

# Experiencia · fase 2

Rama `feat/experiencia-02-bienvenida`. [Plan vigente](PLAN_EXPERIENCIA.md). Continuar fases autorizadas sin confirmación; Jay hace PR/merge.

Bienvenida gráfica Explora/Escucha/Crea y símbolos locales del primer recorrido. Se conservan los seis gestos reales, omitir/repetir y progreso; controles iniciales blancos y silenciosos.

Validación: Auditoría y suites Node; first_level_smoke y ui_silence_smoke (resultados en registro de fase). Sin aceptación física inventada.

## Estado anterior

# Experiencia · fase 1

Rama `feat/experiencia-01-base`. [Plan vigente](PLAN_EXPERIENCIA.md). Continuar fases autorizadas sin confirmación; Jay hace PR/merge.

Auditoría inicial y plan de catorce ramas; mapa de fricciones y criterios verificables. Main observado e351584 ya integra L7. Sin cambios de audio ni guardados.

Validación: npm run audit:release aprobado sin advertencias; npm test aprobado, 104 suites; navegador/audio no requeridos para documentación. Sin aceptación física inventada.

## Estado anterior

# Handoff vigente · Laboratorio Vivo L7

Rama `feat/lab-l7-curaduria`, versión 2.1.0-alpha.7. L1–L7 entregadas. El ciclo de código está completo; no reiniciar planes anteriores. Jay mantiene PR/merge. [Plan](PLAN_LABORATORIO_VIVO.md).

- La curaduría integra seis bandas con los 52 estilos y los dieciséis cruces previos. La muestra por género verificó 51 gramáticas de batería distintas; las membranas y cajas usan cuerpos graves/medios.
- Las voces articuladas reservan espacio para los gestos y la práctica. Las cuerdas nuevas reutilizan excitaciones con una caché de ocho buffers por contexto; las voces sostenidas tienen liberación suave y límites explícitos.
- El cierre conserva mundos, progreso, códigos anteriores y modo clásico. CIERRE_LABORATORIO_VIVO.md reúne hallazgos, soluciones, orden de ramas y aceptación física/artística pendiente.

Validación completa aprobada: auditoría, 104 suites Node, 82 recorridos incluido offline y 581 renders de 28 programas de audio. Pico máximo medido: 0.945447; señal finita y límites aprobados por cada programa. [Evidencia](scripts/lab-l7-validation.json). CI de los PR y aceptación física/artística conservan su alcance propio.

## Mapa técnico del ciclo

- `src/lab-score.js`: bandas, patrones nativos, frases, evolución y voces territoriales. `src/radio.js` aplica el arreglo; `src/audio.js` programa los offsets reales.
- `src/instrument-techniques.js`: once voces originales, articulaciones, prioridades, sostén y caché acotada. `src/instruments.js` conecta el contacto del cubo; `spatial.js` y `patches.js` mantienen las rutas largas.
- `src/lab-learning-model.js` y `src/lab-learning.js`: progreso aditivo y práctica optativa. `feedback.js`, `voice-guide.js`, `journal.js` e HTML conservan UI contextual y silenciosa.
- `src/world-memory.js`, `memory-model.js`, `favorites.js`, `world-identity.js`, `share-tools.js`, `seeds.js`, `navigation.js`: huella, contraste y regreso musical versionado, separado del generador.
- `scripts/lab-lN-validation.json`: evidencia por fase. L7 ejecuta el conjunto completo; los reportes anteriores conservan su fecha y alcance. `CIERRE_LABORATORIO_VIVO.md` explica hallazgos, soluciones y prueba física.

La versión musical 1 identifica el intérprete final de este ciclo (receta interna 4). Mantenerlo si una versión futura cambia las recetas. Un Favorito guarda carácter y dirección; no congela una canción ni la simulación. La prueba en Chromium no sustituye escuchar y jugar en teléfonos físicos.

## Entregas anteriores

# Handoff vigente · Laboratorio Vivo L6

Rama `feat/lab-l6-exploracion`, versión 2.1.0-alpha.6. L1–L7 autorizadas consecutivamente; continuar desde esta rama sin esperar confirmación. Jay mantiene PR/merge. [Plan](PLAN_LABORATORIO_VIVO.md).

- Seis secciones cambian orquestación, silencio y densidad manteniendo el ancla territorial. La iniciativa en quietud influye en la elección de voz; los vecinos mantienen reloj y centro armónico compartidos.
- Saltar compara banda, paleta y patrón además del género y paisaje. Los Favoritos guardan una huella musical ampliada; las direcciones y códigos nuevos restauran Paisaje vivo/clásico sin cambiar coordenadas ni ámbito del guardado.
- Los códigos anteriores siguen válidos. Los metadatos musicales futuros se conservan sin abrir versiones desconocidas. Auditoría, 103 suites Node, tres recorridos y seis mezclas de evolución aprobados.

Auditoría aprobada; 103 suites Node, 3 recorridos afectados y 1 programas de audio aprobados. Alcance exacto y reportes: [evidencia](scripts/lab-l6-validation.json). CI completo y aceptación física/artística conservan su requisito propio.

## Entregas anteriores

# Handoff vigente · Laboratorio Vivo L5

Rama `feat/lab-l5-aprendizaje`, versión 2.1.0-alpha.5. L1–L7 autorizadas consecutivamente; continuar desde esta rama sin esperar confirmación. Jay mantiene PR/merge. [Plan](PLAN_LABORATORIO_VIVO.md).

- Tu recorrido ofrece Escuchar y responder: eliges una voz tocándola, escuchas dos llamadas y respondes con dos pulsos espaciados. Es opcional, sin examen, castigo ni control permanente.
- Una indicación local enseña cada acción. La práctica se pausa con las hojas, ocultación o silencio y permite volver a escuchar. El progreso aditivo conserva versiones futuras y aparece en Música de la Bitácora.
- Los sonidos secundarios de una onda no se confunden con gestos nuevos. Auditoría, 102 suites Node, dos recorridos reales y dos mezclas de lección aprobados.

Auditoría aprobada; 102 suites Node, 2 recorridos afectados y 1 programas de audio aprobados. Alcance exacto y reportes: [evidencia](scripts/lab-l5-validation.json). CI completo y aceptación física/artística conservan su requisito propio.

## Entregas anteriores

# Handoff vigente · Laboratorio Vivo L4

Rama `feat/lab-l4-paisaje`, versión 2.1.0-alpha.4. L1–L7 autorizadas consecutivamente; continuar desde esta rama sin esperar confirmación. Jay mantiene PR/merge. [Plan](PLAN_LABORATORIO_VIVO.md).

- Los habitantes y objetos conservan su papel musical; territorio e individuo eligen cuerdas, vientos, teclas, pads, bajos y membranas. Las voces patrimoniales, reliquias, pulso personal y materiales de percusión conservan su identidad.
- El contacto del cubo sostiene voces compatibles; posición y cercanía cambian presión, tono y presencia. Alejarse, cambiar capa, silenciar o abrir una hoja libera la voz. El arco local señala el sostén.
- Se corrigió el corte de rutas a tres segundos y el registro de percusión viva. Auditoría, 101 suites Node, dos recorridos y 18 mezclas afectadas aprobados.

Auditoría aprobada; 101 suites Node, 2 recorridos afectados y 2 programas de audio aprobados. Alcance exacto y reportes: [evidencia](scripts/lab-l4-validation.json). CI completo y aceptación física/artística conservan su requisito propio.

## Entregas anteriores

# Handoff vigente · Laboratorio Vivo L3

Rama `feat/lab-l3-interpretacion`, versión 2.1.0-alpha.3. L1–L7 autorizadas consecutivamente; continuar desde esta rama sin esperar confirmación. Jay mantiene PR/merge. [Plan](PLAN_LABORATORIO_VIVO.md).

- La interpretación añade golpes 3:2 contra el bombo binario, articulaciones propias y pequeños pickups. Las membranas y caja acústica sustituyen golpes anteriores sin duplicar capas.
- Bajos y motivos alternan pregunta, respuesta, resolución y descanso durante ocho compases; se mantienen escala, tempo, registro y límites de eventos. Los offsets fraccionarios llegan al reloj real de Web Audio.
- Validación: 100 suites Node, dos recorridos afectados y doce mezclas territoriales densas en 44.1/48 kHz. El modo clásico y transporte de duetos conservan su contrato anterior.

Auditoría aprobada; 100 suites Node, 2 recorridos afectados y 1 programas de audio aprobados. Alcance exacto y reportes: [evidencia](scripts/lab-l3-validation.json). CI completo y aceptación física/artística conservan su requisito propio.

## Entregas anteriores

# Handoff vigente · Laboratorio Vivo L2

Rama `feat/lab-l2-instrumentos`, versión 2.1.0-alpha.2. L1–L7 autorizadas consecutivamente; continuar desde esta rama sin esperar confirmación. Jay mantiene PR/merge. [Plan](PLAN_LABORATORIO_VIVO.md).

- Once voces originales amplían el banco a 43 instrumentos: cuerdas pulsadas y de arco, vientos, membranas, caja, teclas, pad y bajo. Cada voz tiene articulación y límites propios.
- Arco, vientos y pad se sostienen mediante contacto en el laboratorio; soltar, salir, pausar u ocultar la página libera las voces. Deslizamiento, apagado, golpe suave y acento cambian el sonido sin cambiar la afinación base.
- El laboratorio reúne 179 destinos. Se verificaron 48 renders individuales y 12 mezclas territoriales densas; no se usan muestras ni presets comerciales.

Auditoría aprobada; 99 suites Node, 3 recorridos afectados y 2 programas de audio aprobados. Alcance exacto y reportes: [evidencia](scripts/lab-l2-validation.json). CI completo y aceptación física/artística conservan su requisito propio.

## Entregas anteriores

# Handoff vigente · Laboratorio Vivo L1

Rama `feat/lab-l1-adn-territorial`, versión 2.1.0-alpha.1. L1–L7 autorizadas consecutivamente; continuar desde esta rama sin esperar confirmación. Jay mantiene PR/merge. [Plan](PLAN_LABORATORIO_VIVO.md).

- Seis bandas territoriales coordinan batería, bajo, frase, instrumentos, silencios y brillo mediante semillas independientes. No se desplazan mapas ni objetos.
- La radio principal y vecina comparten el nuevo contrato; la capa de producción respeta el bajo y armonía elegidos. El transporte acordado de duetos conserva su arreglo anterior.
- Sonido permite Paisaje vivo/clásico sin lanzar notas. El laboratorio conserva las recetas clásicas y añade seis bandas en destinos reales con habitantes.

Auditoría aprobada; 98 suites Node, 5 recorridos afectados y 1 programas de audio aprobados. Alcance exacto y reportes: [evidencia](scripts/lab-l1-validation.json). CI completo y aceptación física/artística conservan su requisito propio.

## Entregas anteriores

# Handoff vigente · auditoría de aceptación 2.0.0-rc.9

Rama `audit/cierre-2-validacion`, desde `10b74ed`. [Dictamen](AUDITORIA_ACEPTACION_2.0.md). No reiniciar fases ni pedir confirmación entre ramas autorizadas; Jay mantiene PR/merge.

- A29: Favoritos verificaba tarde la escritura; podía confirmar éxito, otorgar logro y completar la guía con almacenamiento lleno o conflicto de pestaña. La regresión nativa reprodujo el fallo antes de corregirlo.
- favorites.js confirma persistencia antes de logro/guía. Conserva el lugar en sesión y permite reintentar el mismo marcador sin duplicarlo. share-tools/rare-cards distinguen fallo de almacenamiento de límite de favoritos.
- No cambian esquema de guardado, música, semillas ni coordenadas. Release y caché PWA pasan a rc.9.
- Producción avanzó durante los merges de Jay: última instantánea 2.0.0-rc.2, revisión `52fec80`. Cierre F1–F10 y pulido F2 ya integrados; los checks de esa revisión están en cola. Preview F8 construido, pero protegido por login Vercel. No equivale a RC9 público ni a CI final aprobado.
- Auditoría, 97 suites Node, 76 recorridos incluido offline y prueba HTTP/SQLite aprobados.
- La evidencia actual está en `scripts/auditoria-cierre-rc9-validation.json`; los renders F8 se reutilizan con su alcance explícito porque no cambia el audio. Aceptación física/artística sigue separada.

# Estado documental anterior · continuación automática

Rama `docs/cierre-estado-unificado`, hija de `feat/pulido-f8-cierre` en `5d02c08`. Las ocho referencias de entrega están verificadas en remoto. PLAN_2.0 distingue ahora pendientes históricos de soluciones ya incluidas. No reiniciar fases ni esperar confirmación entre ramas autorizadas. Jay mantiene PR/merge.

Esta actualización solo modifica documentación. La candidata sigue en 2.0.0-rc.8 y conserva la validación final siguiente. Consultar [CIERRE_2.0.md](CIERRE_2.0.md) para el bloqueo de red y la aceptación externa; un check de comentarios de Vercel aprobado no equivale a deploy o CI aprobado.

# Handoff de implementación · pulido F8 · Cierre integrado y revisión final

Rama `feat/pulido-f8-cierre`, desde `7af93e2`. Los ocho bloques de [PLAN_PULIDO_FINAL.md](PLAN_PULIDO_FINAL.md) están implementados; no reiniciarlos. Jay crea PR/merge. Main permanece fuera de estos pushes. Main observado: `15bbe77`, con F1/F2 integradas; sus ramas remotas ya no existen.

- Lugares construye veinte resúmenes por página; los detalles de región y sus búsquedas de reliquias se calculan al desplegarlos. Mil lugares guardados se conservan en la prueba móvil.
- Los caminantes encontrados aparecen primero en su álbum. El primer nivel oculta título de región y frase competidores, conservando una indicación clara.
- Marcador de guardar reconocible; el estado redundante Sin reloj deja libre el nombre del lugar. Se repite la revisión de interfaz del ajuste final.
- Geist Mono y blancos/negros coherentes; opciones del cubo legibles, indicaciones de guardado actualizadas y párrafos estáticos breves. La Voz mantiene constancia sin castigar pausas.
- Lluvia, blobs, cajas sin abrir y quietud usan colores de fuente. El oro permanece para lo conseguido; brumas y pulsos se contienen para dejar respirar el vacío.
- La estela usa su identificador de Cometa en sus señales musicales. No se alteran coordenadas ni flujos de generación antiguos.
- README, planes, hallazgos y handoff se consolidan. Las pruebas finales distinguen automatización, CI, deploy real y aceptación física; servidor público queda para el siguiente ciclo.
- Corregido Campo acumulado: su apertura depende del tiempo desde la activación, no de la duración restante; renovar o recargar conserva el radio, incluido el paso por la duración original.
- Las formas registradas también se paginan. Búsqueda/propiedad se ocultan donde no aplican, evitando controles sin efecto; siguen disponibles en las colecciones compatibles.

Auditoría sin errores ni advertencias; 97 suites Node, 75 recorridos de navegador incluidos offline, y 455 renders de audio en 22 programas aprobados. Ambas generaciones y diversidad verificadas. CI del PR, deploy real y aceptación física pendientes. [Evidencia](scripts/pulido-f8-validation.json).


Leer [CIERRE_2.0.md](CIERRE_2.0.md) para integración y pendientes externos, [AUDITORIA_CIERRE_2.0.md](AUDITORIA_CIERRE_2.0.md) para hallazgos y [MATRIZ_INTERACCIONES.md](MATRIZ_INTERACCIONES.md) para rutas musicales. Las tablas y pendientes siguientes son historia de entregas anteriores.

Mapa nuevo: onboarding-model/onboarding (primer nivel), favorites/seeds (guardar/viajar), journal (lectura por demanda), power-clock/cajas/quietud (poderes/regalos), walker-forms (cincuenta variantes), foreground/voices/feedback (prioridad y señales). Guardados, versiones y RNG históricos se preservan.

## Entregas anteriores

Los siguientes encabezados conservan evidencia histórica; prevalece el estado actual.

# Handoff vigente · pulido F7 · Cada sonido vuelve a su fuente

Rama `feat/pulido-f7-interacciones`, desde `1637aed`. Continuar [PLAN_PULIDO_FINAL.md](PLAN_PULIDO_FINAL.md) sin pedir otra autorización; Jay crea PR/merge. Main permanece fuera de estos pushes.

- MATRIZ_INTERACCIONES.md relaciona quince rutas de gesto, función, señal y evidencia: flora, percusión, vida, reliquias, redes, poderes, casa e interfaz.
- Notas del Pincel, Cometa, Compañero y quietud reciben su señal en el punto de origen. El Pincel usa un patch creativo del género y deja espacio en la base sin subir el máster.
- Campo e Imán reproducen con prioridad, mediante un origen separado: las notas automáticas no se graban ni enseñan como nuevos toques del jugador.
- Corregido el Imán: el índice se calcula sobre fuentes musicales filtradas, evitando silencios por posiciones vacías.
- El giro de quietud restaura el corte anterior del filtro, en lugar de abrirlo siempre a 20 kHz. Añade señal de filtro y no acumula escucha con volumen cero.
- Los cincuenta caminantes combinan su forma con velocidad y grado individuales anteriores. Mantienen los mapas y responden dentro de la escala local.

Auditoría aprobada; 97 suites Node y 6 recorridos afectados aprobados. Tres programas musicales afectados: 47 renders de poderes/quietud/culturas, caminantes y materiales/tiempo; picos menores de 0,96 y cero muestras calientes. Suite completa del conjunto final y aceptación física pendientes. [Evidencia](scripts/pulido-f7-validation.json).

## Entregas anteriores

Los siguientes encabezados conservan evidencia histórica; prevalece el estado actual.

# Handoff vigente · pulido F6 · Cincuenta caminantes con identidad

Rama `feat/pulido-f6-personajes`, desde `4cdc59a`. Continuar [PLAN_PULIDO_FINAL.md](PLAN_PULIDO_FINAL.md) sin pedir otra autorización; Jay crea PR/merge. Main permanece fuera de estos pushes.

- Cincuenta variantes explícitas: cinco cuerpos, cinco cabezas y dos pasos, con cincuenta retratos distinguibles; tamaño de mundo pequeño y sin paneles nuevos.
- Grupos corporales por territorios de tres regiones; cabezas y paso individuales por semillas independientes. Las posiciones y flujos antiguos conservan sus hashes de referencia.
- Cinco estrategias: acercarse, orbitar, mantener distancia, alternar descanso y desplazamiento, o caminar a pulsos. Confianza, separación y tiempo de compañía varían.
- Respuesta diatónica una tercera sobre tu gesto, con papel e instrumento del género: graves, percusión, armonía o melodía. Máximo dos respuestas por compás, sin grabado automático ni cadenas recursivas.
- Corregida la respuesta antigua fuera del recorrido de audio del Mundo. La fuente real recibe su señal de onset y el movimiento se pausa en menús.
- Colección → 50 caminantes muestra miniaturas y descubrimientos conservados por variante. No sustituye la mascota permanente ni altera sus logros; datos desconocidos permanecen.

Auditoría aprobada; 96 suites Node y 5 recorridos afectados aprobados. Diez renders de respuesta real de caminantes en deep/dub a 44,1/48 kHz; picos menores de 0,96, sin muestras calientes. La suite completa del conjunto final incluye este programa nuevo. Suite completa del conjunto final y aceptación física pendientes. [Evidencia](scripts/pulido-f6-validation.json).

## Entregas anteriores

Los siguientes encabezados conservan evidencia histórica; prevalece el estado actual.

# Handoff vigente · pulido F5 · Hallazgos con valor y poderes que se conservan

Rama `feat/pulido-f5-tarjetas`, desde `e1a0897`. Continuar [PLAN_PULIDO_FINAL.md](PLAN_PULIDO_FINAL.md) sin pedir otra autorización; Jay crea PR/merge. Main permanece fuera de estos pushes.

- Las tarjetas simultáneas de un mismo punto comparten aviso: se presenta la más excepcional, pero se guardan todas. Tipos ya encontrados avisan tres segundos; los primeros, ocho.
- Cada apertura conserva su pequeño movimiento. Repetir un poder muestra una confirmación de dos segundos; la primera conserva su tarjeta especial. Cerrar devuelve el foco al mundo.
- Probabilidades naturales sin cambios: una caja concreta ≈1/150 sectores de tierra; cualquier caja ≈1/25. Regalos y muestras no se presentan como suerte natural. Las tasas territoriales conjuntas no medidas siguen explícitas.
- Instantánea versionada de milisegundos de juego restantes: recargar no pierde ni rellena poderes; menús y app cerrada no consumen duración. Se conservan marcas del pincel y especie/frase del compañero temporal.
- Regalo de quietud registrado por región y día, con caja pendiente persistente hasta recogerla. Recargar no concede otro ni hace desaparecer el pendiente.
- Formatos futuros de poderes, campos desconocidos y regalos no reconocidos se preservan. No cambia ningún flujo de generación antiguo.

Auditoría aprobada; 95 suites Node y 7 recorridos afectados aprobados. Dos programas de audio afectados: 32 renders de culturas, poderes, quietud y aperturas; picos finitos menores de 0,96 y cero muestras calientes. Suite completa del conjunto final y aceptación física pendientes. [Evidencia](scripts/pulido-f5-validation.json).

## Entregas anteriores

Los siguientes encabezados conservan evidencia histórica; prevalece el estado actual.

# Handoff vigente · pulido F4 · Bitácora con lectura por capas

Rama `feat/pulido-f4-bitacora`, desde `e5d2da5`. Continuar [PLAN_PULIDO_FINAL.md](PLAN_PULIDO_FINAL.md) sin pedir otra autorización; Jay crea PR/merge. Main permanece fuera de estos pushes.

- Lugares abre con tres cifras y los seis destinos más recientes, con viaje directo y acceso a todos los favoritos.
- Recuerdos, ecosistemas e interacciones se agrupan en secciones plegables. Cada región conserva bioma, gravedad, flora, tareas y progreso tras su nombre.
- El índice musical muestra nombres compactos y abre las explicaciones al pedirlas; no reproduce instrumentos ni cambia la música.
- Siete categorías de logros muestran el progreso antes de desplegar los registros completos. Ninguna recompensa ni fecha desaparece.
- Se conserva el desplazamiento y las secciones abiertas al cambiar de pestaña y volver. Colección mantiene búsqueda, filtros y paginación.

Auditoría aprobada; 94 suites Node y 11 recorridos afectados aprobados. Sin cambios de DSP; interfaz silenciosa comprobada. Suite completa del conjunto final y aceptación física pendientes. [Evidencia](scripts/pulido-f4-validation.json).

## Entregas anteriores

Los siguientes encabezados conservan evidencia histórica; prevalece el estado actual.

# Handoff vigente · pulido F3 · Guardar y regresar sin rodeos

Rama `feat/pulido-f3-viajes`, desde `2e45cc0`. Continuar [PLAN_PULIDO_FINAL.md](PLAN_PULIDO_FINAL.md) sin pedir otra autorización; Jay crea PR/merge. Main permanece fuera de estos pushes.

- Marcador junto al lugar: guarda con un toque. Tocar su nombre abre tus destinos; repetir no pisa nombres personalizados.
- Ir a este lugar conserva semilla, versiones, capa y coordenadas. Volver al punto anterior conserva la salida en la pestaña; cerrar la pestaña termina ese retorno temporal.
- Editar y compartir quedan plegados; veinte lugares por página y admisión de 256 sin truncar registros anteriores.
- Corregidos IDs coincidentes entre mundos y normalización donde un duplicado inválido ocultaba un destino válido. Ningún RNG histórico cambia.
- Encabezado muestra el nombre; gravedad sigue disponible en detalles. Todos los controles permanecen silenciosos.

Auditoría aprobada; 94 suites Node y 7 recorridos afectados aprobados. Sin cambios de DSP; interfaz silenciosa comprobada. Suite completa del conjunto final y aceptación física pendientes. [Evidencia](scripts/pulido-f3-validation.json).

## Entregas anteriores

Los siguientes encabezados conservan evidencia histórica; prevalece el estado actual.

# Handoff vigente · pulido F2 · Primer nivel jugable y guía mínima

Rama `feat/pulido-f2-primer-nivel`, desde `25732e6`. Continuar [PLAN_PULIDO_FINAL.md](PLAN_PULIDO_FINAL.md) sin pedir otra autorización; Jay crea PR/merge. Main permanece fuera de estos pushes.

- onboarding-model.js define seis hechos del primer recorrido; onboarding.js los observa sin imponer objetivos ni entregar rarezas artificiales. Las partidas previas conservan progreso; los datos futuros quedan intactos.
- Una franja pequeña enseña una acción cada vez. La ayuda se retira al terminar y puede omitirse o repetirse desde Menú → Tu recorrido → Practicar, sin reiniciar el juego.
- Movimiento y primera luz, entrada al Mundo, respuesta real de una fuente, pulso y guardado completan la guía mediante acciones. Marcas locales pequeñas sugieren un elemento cercano; los menús y celebraciones tienen prioridad visual.
- La introducción terminada no se repite en otras semillas; una lección incompleta continúa tras recargar. Los visitantes nuevos de un lugar compartido reciben ayuda breve. El modo laboratorio conserva su acceso de pruebas.
- La Voz resuelve el papel musical usando la fuente real. Un sonido ambiente, volumen cero, audio suspendido o un pulso vacío no completa la lección de encuentro. Esto corrige A12 de la auditoría.
- Bienvenida más corta, objetivos táctiles de 44 px, foco restaurado al omitir y Geist Mono. No se añadió sonido a ningún control ni se modificó la síntesis.
- Versión 2.0.0-rc.2 y shell offline con los dos módulos nuevos una sola vez.

Auditoría aprobada; 94 suites Node y 7 recorridos afectados aprobados. Sin cambios de DSP; interfaz silenciosa comprobada. Suite completa del conjunto final y aceptación física pendientes. [Evidencia](scripts/pulido-f2-validation.json).

## Entregas anteriores

Los siguientes encabezados conservan evidencia histórica; prevalece el estado actual.

# Handoff vigente · cierre F10 · Auditoría y candidata 2.0.0-rc.1

Rama `feat/cierre-f10-lanzamiento`, basada en F9. F1–F10 están reunidas en esta candidata. Jay autorizó continuar el pulido de PLAN_PULIDO_FINAL.md sin pedir de nuevo autorización. Commit/push por fase; Jay crea PR/merge. No reescribir ramas publicadas. Ver [plan vigente](PLAN_CIERRE_2.0.md).

- Conservar coordenadas y estado de viaje al recargar una dirección WD1.
- Conservar cajas consumidas, construcciones abiertas, ángulos, plantas, regalos y escucha; no truncar colecciones válidas al normalizar. Las cachés y protección global del guardado siguen acotadas.
- Una primera luz diaria abre el Mundo sin reloj de exploración. No interrumpir una sesión a medianoche; conservar los contadores históricos y el crecimiento opcional del Camino.
- Propósito y reliquias explicados con brevedad; recorrido y glosario consultables en el menú. El primer nivel completo continúa en pulido F2.
- Celebraciones contenidas, seis movimientos de apertura, serial ligado al mundo, lugar y regalos identificados. Títulos menores y una etiqueta musical cercana; volumen cero no registra música inaudible.
- Auditoría espacial de 49.152 sectores y diversidad de 4.096 regiones: condiciones y conteos de muestra, sin prometer millones de canciones perceptualmente únicas.
- Auditoría documentada y plan de ocho bloques; F10 es el primero. Tutorial, viajes, Bitácora, tarjetas, cincuenta personajes, integración musical y cierre continúan en ramas hijas.
- Versión candidata local sin fecha inventada de deploy. Main no se modifica; Jay crea PR y merge.

Auditoría limpia; 93 suites Node y 69 recorridos completos aprobados. 445 renders en 21 programas de audio completos, con pico máximo 0,945447 y cero fracción caliente. Las pruebas no sustituyen escucha artística ni teléfonos físicos. CI completo y aceptación en teléfono físico pendientes. [Evidencia](scripts/cierre-f10-validation.json).

Consulta [auditoría](AUDITORIA_CIERRE_2.0.md), [cierre técnico](CIERRE_2.0.md) y [pulido pendiente autorizado](PLAN_PULIDO_FINAL.md). A12, A14 y A15 siguen asignados a sus ramas hijas. Para integrar la base reparada, el PR de F10 incluye sus padres; no volver a abrir los trabajos locales antiguos.

## Entregas anteriores

Lo que sigue conserva sus alcances históricos; prevalece el encabezado actual.

# Handoff vigente · cierre F9 · Cubo, Bitácora, logros y casa unidos

Rama `feat/cierre-f9-juego`, basada en F8. Jay autorizó continuar las diez fases; no pedir de nuevo autorización para las restantes. Commit/push por fase; Jay crea PR/merge. No reescribir ramas publicadas. Ver [plan vigente](PLAN_CIERRE_2.0.md).

- Integración selectiva de los trabajos locales a28c4b2, d6676e5, 7a99011, 4e77a14 y la casa preparada. Se resolvieron diferencias conservando anatomías, ecosistemas, híbridos, percusión, reliquias, memoria y retornos exactos. Las ramas antiguas no se reescribieron ni se hicieron merges a main.
- Cincuenta personalizaciones ganadas: color, material, forma, estela, halo, aura y voz del pulso. Conserva los trece IDs anteriores, fechas, piezas retiradas y recompensas desconocidas. El blanco es original; el timbre elegido se usa con el cubo en el Mundo. Vista previa animada y elecciones completamente silenciosas.
- Menú Jugar/Crear/Sonido/Más, seis destinos principales y ajustes separados. Una sola hoja de sonido con volumen persistente, calma y silencio. Saltar y su regreso siguen disponibles; viajar realmente entre semillas conserva progreso y posición por mundo.
- Bitácora: Hoy, Colección, Lugares, Música y Logros. Álbum con búsqueda/filtros/siluetas, paginación de piezas, coordenadas/WD1, constelación, sets, cruces y memoria musical. Guarda el historial real, sin fabricar fechas ni hallazgos.
- Doscientos cincuenta logros en siete categorías, con métricas de exploración, música, vida, colección y casa. Migración de logros ganados y secretos; conserva los retirados sin promoverlos como objetivos nuevos.
- Casa desde arriba con cuatro habitaciones, cuarenta objetos ganados, posición que define paso/nota y proximidad, acústicas contenidas por habitación y visitas WH1 sin editar la colección anfitriona. Conserva el Taller radial y sus muestras. El plano se toca para caminar, colocar o retirar.
- Geist Mono también en los dibujos recuperados. Frases de historia breves ligadas a atención, creación, regreso y Jay. Se conserva el lenguaje negro, cubo blanco y oro ganado. No se añadió servidor ni cuentas.
- La revisión visual corrigió transparencia heredada del plano y cabecera desactualizada. Una prueba sobre Canvas exige contraste visible y cabecera Casa; vertical y horizontal aprobados tras el ajuste.

Auditoría limpia; 92 suites Node y 10 recorridos afectados aprobados. 31 renders: cinco timbres del pulso sobre cinco estilos y cuarenta objetos de casa/cuatro acústicas en seis mezclas. Evidencia en cierre-f9-wardrobe-audio-validation.json y cierre-f9-house-audio-validation.json. CI completo y aceptación en teléfono físico pendientes. [Evidencia](scripts/cierre-f9-validation.json).

## Entregas anteriores

Lo que sigue conserva sus alcances históricos; prevalece el encabezado actual.

# Handoff vigente · cierre F8 · Memoria de instrumentos y encuentros

Rama `feat/cierre-f8-memoria`, basada en F7. Jay autorizó continuar las diez fases; no pedir de nuevo autorización para las restantes. Commit/push por fase; Jay crea PR/merge. No reescribir ramas publicadas. Ver [plan vigente](PLAN_CIERRE_2.0.md).

- memory-model.js/world-memory.js guardan modelos finitos de redes, partes del suelo resonante y respuestas aprendidas. Se reconstruyen al volver, recargar o regenerar caché; quitar un hilo también queda guardado. Los temporizadores, audio y simulación siguen vivos, sin congelar el lugar.
- Hasta 128 instrumentos editados y 256 vínculos nuevos por partida. Al llegar al límite no se expulsan ediciones existentes; las entradas existentes siguen editables y se avisa. Datos de una versión futura se conservan sin modificarlos.
- Las criaturas conservan frases y encuentros por individuo y coordenadas. Tras varios encuentros pueden acercarse si caminas despacio; peligro, descanso y territorio siguen mandando. La mascota existente conserva su guardado propio.
- Favoritos incluyen firma musical versionada de paisaje/cruce/género/tempo. WD1 conserva semilla, versiones, tamaño, capa y coordenadas. El código no graba un instante de la canción.
- Paseo automático ofrece Afinidad y Contraste entre favoritos cercanos del mismo mundo y capa, dentro de tres regiones. Sin favoritos compatibles conserva el paseo libre; no inventa destinos conocidos ni atraviesa guardados.
- La Bitácora muestra instrumentos editados y vínculos. Cancelar una edición no confirma cambios. Guardados, premios y mapas anteriores conservados.

Auditoría limpia; 88 suites Node y 5 recorridos afectados aprobados. Seis renders comparan runtimes vacíos/restaurados en minimal, deep y ambient; comprueban rutas reales de señal/CV, sin cambios del DSP. Evidencia en cierre-f8-memory-audio-validation.json. CI completo y aceptación en teléfono físico pendientes. [Evidencia](scripts/cierre-f8-validation.json).

## Entregas anteriores

Lo que sigue conserva sus alcances históricos; prevalece el encabezado actual.

# Handoff vigente · cierre F7 · Hallazgos que puedes volver a tocar

Rama `feat/cierre-f7-hallazgos`, basada en F6. Jay autorizó continuar las diez fases; no pedir de nuevo autorización para las restantes. Commit/push por fase; Jay crea PR/merge. No reescribir ramas publicadas. Ver [plan vigente](PLAN_CIERRE_2.0.md).

- heritage.js deriva cuatro roles estables para reliquias, con bajos, percusión, cuerdas, pianos y vientos. Regresar al punto de una reliquia ganada permite tocarla, sin duplicar estrellas ni recompensas. Las tasas y coordenadas originales siguen intactas.
- Ocho santuarios existentes reúnen parejas de flora/fauna relacionadas con su estudio. Son habitantes reales con anatomía y mente, en un flujo nuevo independiente, no imágenes decorativas ni sustitución de poblaciones antiguas.
- Cada recuerdo cultural ganado deja un resonador pequeño junto al guardián: voz, ritmo y armonía. Se toca con el cubo; no requiere menú. Sus señales y las lecciones pasan por filtros de fuente y dejan espacio en el acompañamiento.
- Nueva tarjeta Recuerdo del guardián con lugar, estudio, gesto y rol reales. Requiere escuchar, recorrer huellas y resolver la puerta. Frecuencia conjunta sin estimar; no se inventa un porcentaje de rareza. El catálogo tiene 50 tipos de tarjeta.
- La rareza de tarjetas ahora alimenta correctamente las recompensas desde odds.tier, incluyendo migración de tarjetas existentes y compatibilidad con tier antiguo. No se elimina progreso.
- Pistas aún no ganadas usan cian; oro para recuerdos recuperados. Celebración de reliquia contenida. Estudios originales inspirados en tradiciones: no se atribuyen interpretaciones auténticas ni se usan grabaciones ajenas.
- Corrección de superposición real: en laboratorio horizontal, el aviso de hallazgo queda al lado opuesto de Saltar. Cada render usa almacenamiento efímero propio; la prueba exige cuatro notas reales por llamada y restaura el almacenamiento original.

Auditoría limpia; 87 suites Node y 5 recorridos afectados aprobados. 12 renders: ocho llamadas culturales, tres recuerdos utilizables y una reliquia recuperada; evidencia en cierre-f7-heritage-audio-validation.json. CI completo y aceptación en teléfono físico pendientes. [Evidencia](scripts/cierre-f7-validation.json).

## Entregas anteriores

Lo que sigue conserva sus alcances históricos; prevalece el encabezado actual.

# Handoff vigente · cierre F6 · Percusión y gestos en primer plano

Rama `feat/cierre-f6-interacciones`, basada en F5. Jay autorizó continuar las diez fases; no pedir de nuevo autorización para las restantes. Commit/push por fase; Jay crea PR/merge. No reescribir ramas publicadas. Ver [plan vigente](PLAN_CIERRE_2.0.md).

- foreground.js crea tres rutas persistentes para acompañamiento seco, reverberación y eco. Un gesto del Mundo reduce suavemente esas rutas al 62 %, con recuperación automática, sin bajar su propia voz ni cambiar el máster. La ruta se restaura incluso si falla una emisión.
- percussion-material.js sintetiza nueve cuerpos originales: piedra, tronco, raíces, juncos, vainas, concha, polvo, fósil y charco. Setenta y dos articulaciones deterministas combinan parciales amortiguados, caída y ruido filtrado. Conserva posiciones, roles y límites compartidos de golpes.
- El semillero ya no repite siempre una caja: cinco voces regionales. Los truenos varían cuerpo, filtro, duración y envío según región/compás. No cambian los patrones nativos de batería.
- Señales sincronizadas con el inicio del sonido, trazos locales más claros y una sola etiqueta de rol cercana. Respeta movimiento reducido, silencio y modales; tocar interfaz sigue sin generar música.
- Prueba aislada de dos señales comprueba que baja el acompañamiento, recupera y mantiene intacta la voz del jugador; recorridos móviles verifican los nueve materiales reales y la persistencia de descubrimientos. Sin migraciones destructivas.

Auditoría limpia; 86 suites Node y 6 recorridos afectados aprobados. 11 renders densos de materiales/fenómeno/tormenta y una medición aislada de contraste; resultados en cierre-f6-foreground-audio-validation.json. CI completo y aceptación en teléfono físico pendientes. [Evidencia](scripts/cierre-f6-validation.json).

## Entregas anteriores

Lo que sigue conserva sus alcances históricos; prevalece el encabezado actual.

# Handoff vigente · cierre F5 · Cruces musicales y espacio

Rama `feat/cierre-f5-composicion`, basada en F4. Jay autorizó continuar las diez fases; no pedir de nuevo autorización para las restantes. Commit/push por fase; Jay crea PR/merge. No reescribir ramas publicadas. Ver [plan vigente](PLAN_CIERRE_2.0.md).

- musical-hybrids.js: 16 gramáticas compatibles por carácter; blues solo sobre escala menor, jazz/soul con armonía espaciada, dub, funk, vientos y propuestas graves. No son grabaciones ni mezclas arbitrarias de etiquetas.
- El arreglo comparte batería, tempo, escala y bajo nativos. Motivos diatónicos, respuesta/desarrollo/descanso, progresión y swing acotados; máximo cuatro ataques del motivo, dos en cinta y uno en Grave y espacio. Blues usa doce posiciones armónicas a dos compases por posición.
- Paletas de instrumentos avanzados diferenciadas por carácter. Registros y brillo contenidos, descansos respetados; zonas puras conservadas. El contrato armónico de las salas compartidas sigue sin híbridos.
- Laboratorio: 16 destinos Cruces en regiones reales, 162 entradas y 20 grupos. Saltar valora contraste de cruce además del paisaje; historial acotado y compatible.
- Bitácora registra cruces al sonar realmente. La llegada los identifica sin añadir controles. Guardados y ADN histórico de colocación conservados.
- Pruebas de vidrios y voces comparan la ruta completa de registro/caracter/cruce; conservan comprobaciones de instrumentos, roles y notas emitidas. Los 16 cruces evolucionan en 128 compases sin alterar la receta.

Auditoría limpia; 85 suites Node y 6 recorridos afectados aprobados. 16 renders de regiones reales, densos/alternando suave y 44,1/48 kHz; valores exactos en cierre-f5-hybrid-audio-validation.json. CI completo y aceptación en teléfono físico pendientes. [Evidencia](scripts/cierre-f5-validation.json).

## Entregas anteriores

Lo que sigue conserva sus alcances históricos; prevalece el encabezado actual.

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
