# Arquitectura actual

## Ejecución y publicación

`src/main.js` conecta módulos ES; `src/render.js` dirige los frames de Canvas 2D. Web Audio sintetiza la música localmente. `index.html`, `styles/` y `assets/` forman el cliente estático. El service worker `sw.js` conserva el shell offline.

Vercel sirve la raíz. `scripts/vercel-build.mjs` sella el artefacto con revisión y fecha mediante el mecanismo existente; un commit no prueba un despliegue. La versión base está en `package.json` y `src/release-info.js`.

## Contenedor Android de prueba

`android/` empaqueta el mismo cliente como assets HTTPS locales de WebView, sin cambios de lógica o dependencias npm. `scripts/android-assets.mjs` prepara una copia y reutiliza el sellado existente; el APK gestiona offline y actualización, sin el service worker web. El adaptador exclusivo de Android pausa contextos de audio existentes y conserva importación/exportación mediante selectores de documentos. Origen local y applicationId de vista previa estables; sin permisos generales de archivos ni puente nativo para páginas externas. [Compilación, pruebas y límites](../android/README.md).

## Progreso y chispas

- `progress.js`, `save-store.js` y `save-tools.js`: estado, normalización y respaldos locales.
- `crystal-sparks.js`: distribución determinista independiente, dibujo, impactos manuales y recogida. Camino: diez roturas únicas para entrar automáticamente. En el Mundo añade corredores, fragmentos fugitivos y cadenas; no crea pulsos musicales.
- `crystal-play-model.js`: variantes con hash independiente, reparto de fragmentos y escape acotado. Un fragmento raro añade 3 chispas; su máscara de recogida persiste en `sparkEconomy.sites`. Los registros antiguos agotados no recuperan premios. Cadenas de hasta ocho impactos adicionales por rotura inicial, radio 240; corredores y fragmentos se detienen tras dos segundos, a un máximo de 90/100 unidades. Movimiento reducido conserva las recompensas sin persecución.
- `sparks-model.js`: catálogo, normalización y reglas puras. `sparks.js`: operaciones, compras, colecciones, logros, títulos y metas; pinta la Tienda y el Viaje dentro de Tu cubo (`cube.js`).
- `practice-travel.js`: viaje pagado y regreso gratuito. El coste y destino se guardan juntos; los fallos revierten la operación. El botón principal se muestra al acumular 20 chispas ganadas y se desactiva si falta saldo; el menú conserva una acción independiente.
- `return-entrance.js`: saludo silencioso al abrir, incluso con guía pendiente. Muestra frase y `.simple` durante 2,4 segundos; tocar o Escape permite continuar. La primera guía se restaura al cerrar el saludo.
- `rare-cards.js`, `celebration.js` y `notice-lane.js`: hallazgos y avisos breves en una cola, con detalles explícitos y efectos temporales reversibles.

La minería diaria conserva daño, rotura y recogida hasta 8192 sitios por partida. El saldo es local; no es una economía competitiva ni un registro remoto. Los formatos futuros se conservan. Destellos y constelación personal siguen fuera de esta implementación.

## Bitácora

`journal.js` reúne Hoy, Colección, Lugares, Música, Logros y Tú. Las secciones de `map.js`, `favorites.js` y `player-profile.js` viven en `#journalParts` (oculto) y `render()` las mueve a `#journalBody` en Lugares (mapa y favoritos) y Tú (perfil). Sus módulos abren la Bitácora con `openJournal('places'|'you')` y exponen `renderMap`, `renderFavorites` y `renderProfile`.

## Luz del mundo

`world-light-model.js` traduce `worldVisibility.day` (ciclo de diez minutos de `world-visibility-model.js`) y la hora local a noche, amanecer, atardecer, estrellas y luciérnagas. `world-light.js` lo dibuja tras la niebla, solo en superficie: un degradado con la linterna del cubo libre y luciérnagas en pantalla. `render.js` multiplica el brillo de las estrellas por `worldLight().stars`.

`error-log.js` se carga primero y guarda en `localStorage` (`kubono:errores`) los últimos 20 errores sin datos personales; Ajustes los copia como diagnóstico. `frame-quality.js` mide el intervalo entre fotogramas: con dos muestras lentas seguidas (mediana >25 ms) pasa a calidad ligera (lienzo a 1×, menos partículas y salpicaduras) durante la sesión; `S.quality` fija Automática, Alta o Ligera. En navegadores automatizados el cambio automático queda apagado y las pruebas lo alimentan con `qualityProbe`. `frame-state.js` contesta una vez por fotograma si hay un panel abierto (`openSurface`) y el movimiento reducido del sistema (`prefersReducedMotion`); fuera del fotograma consulta directamente.

## Tienda del cubo

`cube-shop-model.js` define las 14 ranuras y las piezas construidas; `sparkEconomy.wear` guarda una pieza por ranura simple y `sparkEconomy.on` las de ranuras múltiples, y `equipped` se conserva para dispositivos sin actualizar. `cube-shop-art.js` dibuja Movimiento, Cuerpo, Ojos, Hábitos y Accesorios desde `render.js` con cuatro ganchos (debajo del cubo, transformación, cuerpo y encima del cuerpo, dentro de su transformación; el de encima no se usa con cuerpos sorpresa ni ritual). `cubeShopMinSize` sube a 10 px el tamaño dibujado del cubo mientras se lleva cara; no cambia alcance ni colisiones. `cube-shop-world.js` dibuja Rastros (antes del cubo, en coordenadas del mundo) y Compañeros (después del cubo). `S.cubeRoute` (`normalizeRoute`/`rollRoute` en el modelo) guarda los pasos de hoy y el último día jugado, acotados, solo en superficie. `cube-shop-moves.js` añade gestos (transformación y dibujo tras el compañero) y expone `cubeShopPulseLook`; `interactions.js` guarda esa forma en cada onda del jugador (`look`, `charge`) y le pone la forma de impacto `ring-0`, así que el alcance no cambia; `cube-shop-pulse.js` la dibuja, solo en el Mundo y sin tocar colisiones, alcance, guardado ni música; cada pieza tiene variante estática con movimiento reducido. Catálogo y tandas en [Tienda del cubo](TIENDA_DEL_CUBO.md).

## Refugio (antes Casa)

`house.js` mueve el cubo, lleva la cámara y recibe los gestos; `house-view.js` dibuja las cámaras; `house-model.js` guarda los datos; `house-audio.js` la hace sonar; `house-collection.js` muestra la colección; `house-capsules.js` el Prisma, el disco del Taller y el Núcleo; `house-guide.js` la cuenta en palabras; `collection-garden.js` añade el Jardín de voces. Los ids internos (`house`, `sala`, `jardin`, `azotea`, `sotano`, `decor:*`) no cambian para no tocar partidas.

- **Historia:** el Refugio viaja con el cubo. Se abre donde estás (menú, botón del Mundo u «Abrir el Refugio aquí») y se despliega desde el cubo: todo crece desde él y aparece (`unfold`). Fuera solo hay negro, polvo y la luz del bioma (`LANDSCAPES`). El lugar anterior queda como campamento.
- **Cámaras:** Cielo (`azotea`), Eco (`sala`), Jardín de voces (`jardin`) y Raíz (`sotano`), en unidades propias de 1000 de ancho y tres niveles. Cada cámara es una partitura: esquinas, suelo, cinco líneas tenues y dieciséis marcas del compás; la luz y la marca dorada siguen el paso que suena. Entre niveles hay hilos de luz donde estaban las escaleras.
- **Dibujo:** las cámaras y los hilos se dibujan una vez por escala y cámaras abiertas en un lienzo aparte; el fondo, cada fotograma.
- **Cubo:** se dibuja con `drawStage`, como en la tienda, y lleva todo lo comprado.
- **Colección:** solo lee la partida. Paneles de luz con las tarjetas más raras, una constelación con una estrella por categoría de logros, columnas de cristal con las últimas piezas compradas, voces del jardín como tallos de luz, y las criaturas vistas y la mascota de visita. El pulso las hace saltar; tocar algo lo nombra.
- **Sonido:** los objetos suenan en su paso del compás, al pasar junto a ellos (una vez cada 2,5 s) y con el pulso (arpegio de los cuatro más cercanos); las criaturas responden. Cada cámara tiene su aire, que se apaga al salir, con sonido apagado o con un panel abierto.
- **Crecer:** una cámara se abre por días o por logros, lo que llegue antes (`roomOpens`): Jardín de voces 3 u 8, Cielo 7 o 20, Raíz 14 o 40.
- **Prisma:** cada giro cuesta 60 ✦ y da un ornamento (12), una pieza que suena (6) o un color para un objeto colocado. Nada se repite; el premio sale de un hash del número de giro. Las chispas solo se descuentan si la partida se guarda. Se toca con el cubo al lado: el primer toque avisa y el segundo gira.
- **Taller:** su disco radial flota en Eco y abre el panel de siempre; «Volver al Refugio» regresa. No hay otra entrada al Taller.
- **Panel:** Coloca (alterna con caminar), Ver refugio, Código y Volver. Un objeto se guarda arrastrándolo fuera. Las herramientas del Jardín de voces aparecen con el cubo en esa cámara.
- **Datos:** `S.house` versión 2: objetos `{kind,room,x,y}` (x es el paso del compás, y la nota), `decor`, `tints`, `capsules`, `visitedHouses` y `knownVisitors` (criaturas que te visitan). La versión 1 se migra en el momento; una mayor se abre solo para leer.
- **Visitas:** un código WH1 o WH2 abre otro Refugio solo para mirar y escuchar; no lleva nombre.
- **Guía:** `#houseSummary` dice en una frase qué hay en la cámara y qué está cerca; Enter usa el Prisma o el disco. La tarjeta Refugio del menú anuncia paneles nuevos, logros nuevos o el Prisma listo.

## Esculturas del universo

`sculpture-totems-model.js` define seis formas, sus siluetas y un hash independiente. Celdas de 1400 unidades: 3% con encuentro (alpha.61; antes 1,5%), aproximadamente dos tercios solitarios y el resto grupos de dos o tres. Presencia determinista en superficie, bajo y cielo, sin consumir RNG anterior ni cambiar mapas. `sculpture-totems-art.js` comparte formas/degradados entre Canvas y tarjetas SVG.

`sculpture-totems.js` conecta pulsos manuales y tres gestos: torre con tres pulsos, remate que se desprende y vuelve al acompañarlo, o guía hacia un cristal/escultura real. La esfera regresa sin premio si se abandona; no se pierde el tótem. Pausa, inspección y movimiento reducido se respetan. Caché de 48 celdas, ninguna interacción automática por proximidad.

El libro existente incorpora seis tarjetas `totem:*`, una por forma y mundo, con la dirección del primer encuentro. `sparkEconomy.totems` conserva pagos diarios: 2 chispas por lugar, hasta 64 lugares al día; rollback si falla guardar. No hay otro menú o moneda. Las respuestas reutilizan voces nativas, armonía, reloj y límites existentes: como máximo tres notas espaciadas por un pulso de grupo, con volúmenes 0,28/0,14; sin música automática de fondo nueva.

## Mundo y audio

La generación existente depende de semillas: no insertar consumos en su RNG. Los cristales usan su propio hash. `wow-feel.js` separa los ojos locales de los efectos del mundo: los offsets de cámara pertenecen al dibujo del mundo. La regresión está en `tests/wow-runtime.mjs`.

Los poderes originales de cajas duran 20 segundos; las sorpresas, entre 10 y 20, sin acumular duraciones. No añadir sonidos a botones ni modificar síntesis/composición incidentalmente. `world-visibility.js` lee `beat()` para modular suavemente el brillo cercano; no programa audio ni altera la niebla. Se desactiva con silencio, pausa y movimiento reducido.

## Interfaz y aprendizaje

`styles/estilo-j.css` unifica paneles, cabeceras, campos y controles adaptables. El menú conserva IDs y funciones; agrupa juego y espacio personal. `onboarding-model.js` mantiene hechos aprendidos en el guardado, incluido el pulso del Camino. `onboarding.js` muestra el progreso real de cristales; `voice-guide.js` conserva la guía opcional de consulta. El HUD de chispas se limita al Mundo y distingue metas cumplidas; el panel usa las mismas restricciones de viaje que el control principal.

La respuesta del cubo en `wow-feel.js` usa una pose local de presentación para Camino/Mundo; `render.js` aplica la misma matriz al cuerpo y superficie. `crystal-sparks.js` mantiene una cola efímera de hasta 48 impactos de 0,48 s, separada del guardado y de los fragmentos recogibles. No interviene en colisiones, golpes, cadenas ni pagos.

## Hallazgos musicales y actividades

`musical-wonders-model.js` contiene veinte hallazgos/regalos y frases originales. Celdas de 2200 unidades con 3,5% de ocupación, semilla independiente y presencia en las tres capas. `musical-wonders.js` concede por contacto del cubo o pulso, fuera de demostraciones y paseo automático. Regalo y tarjeta se escriben juntos, con rollback y reintento espaciado. `musicalWonders` es un subdocumento versionado; las versiones futuras se conservan. `cube.wonder` equipa un regalo visual desde el editor existente, con vista previa y aplicación atómica.

`musical-wonders-art.js` comparte siluetas de mundo/tarjetas y veinte adornos cosméticos. Seis espectáculos geométricos duran 4,8 s la primera vez y 1,2 s al repetir cada forma. `musical-wonders-audio.js` usa síntesis nativa, armonía y reloj actuales: seis notas por primera celebración, dos en repeticiones; sin muestras ni cambios de volumen maestro. Pausa, silencio, inspección, cambios de mundo/capa y movimiento reducido se respetan. No se programa una capa musical autónoma nueva.

`universe-activities-model.js` define treinta tipos con mecanismos compartidos, soluciones por semilla y movimiento con colisiones barridas. El laberinto tiene 51 × 51 casillas, pasajes alternativos y cámaras. `universe-activities.js` distribuye portales en celdas de 6000 unidades (15% ocupadas desde alpha.61; los portales del 6% anterior conservan celda, tipo y posición): entrar requiere quedarse con el cubo, sin pulsos ni otro dedo. La escena local conserva la posición del mundo; el bucle no ejecuta interacción/autopaseo del mundo mientras se juega. Salida y reinicio se resuelven caminando. `universe-activities-art.js` dibuja solo las casillas cercanas y conserva señales gráficas cuando se ocultan textos.

`activities` guarda hasta 32 recorridos recientes en progreso y 8192 lugares completados. Completar concede 5 chispas una sola vez por lugar, con economía/registro guardados atómicamente; repetir no vuelve a pagar. No hay muerte, cuenta atrás obligatoria ni gasto de entrada. Los subdocumentos futuros se conservan. Catálogo e instrucciones en [Hallazgos y actividades](HALLAZGOS_Y_ACTIVIDADES.md).

`universe-texts.js` filtra texto del canvas del Mundo y sincroniza el ajuste persistente; menús, vista previa y avisos de guardado conservan su función. En actividades se despeja el HUD exterior y permanece el menú. El Camino permite roturas posteriores al décimo sin chispas, luces, objetivo extra ni reentrada automática. La campana aleatoria de quietud se sustituye por una intervención de piano cálida y espaciada; se mantienen respuestas manuales e instrumentos regionales.

## Prototipo histórico Python

[Servidor y duetos](SERVIDOR_Y_DUETOS.md) conserva un backend Python/SQLite fuera del lanzamiento y de la inicialización actual. El 404 histórico de `/api/session` no explica el fallo del render; no sustituir el flujo Supabase vigente por esa API. Los límites del prototipo están archivados.

## Evidencia

La entrega de chispas registra comandos, huellas y límites en [su informe](../scripts/sparks-progression-validation.json). Los documentos de [historial](historial/README.md) describen revisiones anteriores; sus estados y cifras no certifican la revisión actual.

## Familias musicales y repetición ambiental

`music-families.js` amplía la radio de producción con seis familias originales: funk/disco, dub/reggae, jazz/bossa, afro/latino, folk/cuerdas y ambient/cámara. Cada una tiene bajo, dos motivos, percusión, progresión, swing y un compás de descanso por frase de ocho. Se aplican al frame de reproducción después de la referencia; no cambian el catálogo GEN, BPM, escala regional, generación ni guardados. Los otros géneros y duetos mantienen su ruta anterior. Viaje musical indica la familia junto al género y permite buscarla.

La referencia histórica sigue verificándose por separado; los géneros ampliados ya no prometen igualdad musical con ella. La producción conserva los acompañantes y presupuestos existentes. Los descansos de familia no se rellenan con la nota automática de fundación.

En `audio.js`, float/heart/ambient dejan de añadir las llamadas fijas de campana/cristal. `createAmbientPunctuation` admite una voz metálica automática por región cada ocho compases, con caché de 64 regiones, reiniciada al cambiar partida o retroceder el reloj. Las voces de pistas, gestos y celebraciones conservan su origen y no consumen ese límite. El hook opcional `audioNoteCue` registra instrumento, origen y tiempo sin exponer runtime en producción. No modifica síntesis ni volumen maestro.

Tu cubo es el único lugar para cambiar el cubo (alpha.65): pestañas Llevar (lo ganado y lo comprado, se aplica y guarda al tocar), Tienda (solo lo que falta) y Viaje (saltar, volver, meta, colecciones, título e historial, antes «Viajar y chispas»). Las imágenes de la tienda y el cubo de arriba salen de `cube-shop-preview.js`, que monta un escenario con su propio reloj y posición e inicializa `cube-shop-art.js` y `cube-shop-world.js` sobre él: la imagen es el dibujo real de la pieza, no un icono. Los regalos incluyen retrato, nombre corto y encontrados. Ajustes distingue textos del paisaje, estilo de La Voz y datos del mundo.

## Encuentros traviesos y logros ampliados

`universe-mischief-model.js` define diez escenas locales y sus transiciones. El hash propio usa celdas de 1800 unidades con un 12% ocupado; excluye mar y vincula la danza a esculturas reales. `universe-mischief.js` mantiene una escena, caché de 48 celdas, pausa/inspección/preview/autopilot protegidos y cola musical acotada. Alejarse 650 unidades cancela (1400 para copia y despedida, que acompañan al viajero); tras terminar hay 45 segundos de separación. La ayuda del cristal usa el campo mineral existente y observa su rotura, sin alterar daño ni coordenadas.

`universe-mischief-art.js` dibuja actores procedurales, pistas, fragmentos, sombras y la escultura prestada. El paisaje contenido congela temporalmente posiciones y poses de presencias cercanas, dejando libre al cubo y sus controles. La procesión puede alcanzar una escultura y reutilizar su celebración. Los sonidos se colocan en la cuadrícula musical con voces de la familia regional y volúmenes 0,012/0,014; no modifican síntesis ni mezcla.

`S.mischief` versión 1 conserva hasta 4096 lugares completados, contadores por tipo, trucos y esculturas. Cada premio de tres chispas guarda reclamación y saldo juntos; un fallo revierte ambos y espera dos segundos para reintentar. Repetir no paga ni aumenta contadores. Escenas incompletas son efímeras. Versiones futuras se preservan sin conceder premios.

`adventure-achievements.js` añade 120 reglas al catálogo anterior: total registrado 370, incluido el logro retirado existente. `house-capsules.js` añade seis logros de la Casa (376); se ganan en la Casa, no solo en el Mundo. Los premios de logros nuevos se guardan en lote y revierten fechas/recompensas ante error. No añaden chispas. Los avisos de logros se agrupan en la cola silenciosa existente; `journal.achievementSeen` conserva IDs consultados como registro compatible con respaldos. Partidas anteriores parten de sus logros actuales sin avisos retroactivos; la marca se borra al consultar Logros, con reversión si falla guardar. `activities.types` conserva tipos completados y se reconstruye para partidas anteriores a partir de sitios deterministas, sin repetir pagos. Las metas de logros usan datos propios conocidos de cada versión.

La presentación alpha.50 aclara el saldo de chispas y refuerza el contraste de minerales y fragmentos sin cambiar minería, posiciones ni pagos. Una única pista dorada anticipa la travesura no completada más cercana entre 95 y 320 unidades, dentro de pantalla, sin sonidos, textos, interacción o sitios nuevos. Respeta pausa, capas, paseo automático, movimiento reducido y separación entre escenas.

## Cuenta obligatoria y sincronización Supabase

`main.js` espera `account-entry.js:requireAccount()` antes del runtime. Sin configuración o sin primer acceso no hay mundo. Con una sesión guardada el juego arranca sin esperar a la red y la identidad se comprueba en segundo plano; si Auth la rechaza, el cliente la olvida y `cloud-account.js` recarga a la entrada. `cloud-account.js` sustituye la inicialización histórica de `connection.js`; no hay salas ni duetos activos.

`cloud-client.js` usa Auth/Data REST HTTPS con clave publicable y tokens persistentes por origen, renovación compartida y validación de identidad. `progress.js` separa claves locales por usuario y mantiene ámbito remoto compatible. `cloud-sync.js` usa baseline canónica, CAS y copias previas para reconciliar sin decidir por saldo/fecha. `cloud-account.js` comprueba/sube cada cinco segundos cuando corresponde, al reanudar y con intento de salida. Si ambas copias avanzaron pide elegir; no hay controles de respaldo normales. Al restaurar una copia que está en el otro modo, `cloud-account.js:settleMode` pasa por `exitWorld`/`enterWorld` para que región, sesión y música sigan al modo, conservando el lugar restaurado.

`cloud-config.js` apunta a Kubono Dev Free y define `recoveryUrl`; vacío bloquea el acceso. `supabase/setup.sql` describe el esquema aplicado, no se reaplica sobre Dev. Borrado privilegiado en `kubono_private` con envoltorio invoker, comprobación de autenticación reciente y RLS/cuotas/revisiones por cuenta. Tras el RPC, `cloud-sync.js:purgeUserStorage` elimina en ese dispositivo solo las claves locales de la cuenta borrada; otros dispositivos conservan su copia.

`recovery.html`/`cloud-recovery.js` validan el enlace, permiten cambiar clave y limpian esa sesión sin sincronizar partida. `cloud-client.js` valida `recoveryUrl` (local HTTP o HTTPS limpio) y lo envía como `redirect_to`; el aviso del puerto 3000 solo aparece con destino local. `scripts/serve-recovery.py` sirve el mínimo local. Correo de desarrollo, no SMTP público contratado. Detalles/evidencia en [Cuenta y progreso](CUENTA_Y_RESPALDO.md).

## Retención operativa de desarrollo

GitHub Actions conserva artefactos/logs nuevos durante siete días. Windows ejecuta `prune-local-retention.ps1` cada hora desde una copia instalada fuera del checkout; solo elimina respaldos de migración y logs inactivos permitidos, nunca la clave de firma ni los datos activos del juego. `supabase/retention.sql` prepara limpieza de auditoría sin cuentas/partidas, todavía no aplicada por error de solicitud del conector. Alcance y pendientes en [configuración de producción](CONFIGURACION_PRODUCCION.md).
