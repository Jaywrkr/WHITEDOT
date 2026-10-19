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
- `sparks-model.js`: catálogo, normalización y reglas puras. `sparks.js`: operaciones, compras, colecciones, logros, títulos, metas e interfaz.
- `practice-travel.js`: viaje pagado y regreso gratuito. El coste y destino se guardan juntos; los fallos revierten la operación. El botón principal se muestra al acumular 20 chispas ganadas y se desactiva si falta saldo; el menú conserva una acción independiente.
- `return-entrance.js`: saludo silencioso al abrir, incluso con guía pendiente. Muestra frase y `.simple` durante 2,4 segundos; tocar o Escape permite continuar. La primera guía se restaura al cerrar el saludo.
- `rare-cards.js`, `celebration.js` y `notice-lane.js`: hallazgos y avisos breves en una cola, con detalles explícitos y efectos temporales reversibles.

La minería diaria conserva daño, rotura y recogida hasta 8192 sitios por partida. El saldo es local; no es una economía competitiva ni un registro remoto. Los formatos futuros se conservan. Destellos y constelación personal siguen fuera de esta implementación.

## Esculturas del universo

`sculpture-totems-model.js` define seis formas, sus siluetas y un hash independiente. Celdas de 1400 unidades: 1,5% con encuentro (16 veces menos que antes), aproximadamente dos tercios solitarios y el resto grupos de dos o tres. Presencia determinista en superficie, bajo y cielo, sin consumir RNG anterior ni cambiar mapas. `sculpture-totems-art.js` comparte formas/degradados entre Canvas y tarjetas SVG.

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

`universe-activities-model.js` define treinta tipos con mecanismos compartidos, soluciones por semilla y movimiento con colisiones barridas. El laberinto tiene 51 × 51 casillas, pasajes alternativos y cámaras. `universe-activities.js` distribuye portales en celdas de 6000 unidades (6% ocupadas): entrar requiere quedarse con el cubo, sin pulsos ni otro dedo. La escena local conserva la posición del mundo; el bucle no ejecuta interacción/autopaseo del mundo mientras se juega. Salida y reinicio se resuelven caminando. `universe-activities-art.js` dibuja solo las casillas cercanas y conserva señales gráficas cuando se ocultan textos.

`activities` guarda hasta 32 recorridos recientes en progreso y 8192 lugares completados. Completar concede 5 chispas una sola vez por lugar, con economía/registro guardados atómicamente; repetir no vuelve a pagar. No hay muerte, cuenta atrás obligatoria ni gasto de entrada. Los subdocumentos futuros se conservan. Catálogo e instrucciones en [Hallazgos y actividades](HALLAZGOS_Y_ACTIVIDADES.md).

`universe-texts.js` filtra texto del canvas del Mundo y sincroniza el ajuste persistente; menús, vista previa y avisos de guardado conservan su función. En actividades se despeja el HUD exterior y permanece el menú. El Camino permite roturas posteriores al décimo sin chispas, luces, objetivo extra ni reentrada automática. La campana aleatoria de quietud se sustituye por una intervención de piano cálida y espaciada; se mantienen respuestas manuales e instrumentos regionales.

## Servicio opcional

[Servidor y duetos](SERVIDOR_Y_DUETOS.md) describe el backend Python/SQLite. El alojamiento estático no ejecuta esa API: `GET /api/session` puede devolver 404 y la conexión lo controla. Es independiente del renderizado. Cada contexto SQLite confirma o revierte su transacción y cierra la conexión, incluso si falla la operación. No presentar el servicio opcional como desplegado o aceptado en producción.

## Evidencia

La entrega de chispas registra comandos, huellas y límites en [su informe](../scripts/sparks-progression-validation.json). Los documentos de [historial](historial/README.md) describen revisiones anteriores; sus estados y cifras no certifican la revisión actual.

## Familias musicales y repetición ambiental

`music-families.js` amplía la radio de producción con seis familias originales: funk/disco, dub/reggae, jazz/bossa, afro/latino, folk/cuerdas y ambient/cámara. Cada una tiene bajo, dos motivos, percusión, progresión, swing y un compás de descanso por frase de ocho. Se aplican al frame de reproducción después de la referencia; no cambian el catálogo GEN, BPM, escala regional, generación ni guardados. Los otros géneros y duetos mantienen su ruta anterior. Viaje musical indica la familia junto al género y permite buscarla.

La referencia histórica sigue verificándose por separado; los géneros ampliados ya no prometen igualdad musical con ella. La producción conserva los acompañantes y presupuestos existentes. Los descansos de familia no se rellenan con la nota automática de fundación.

En `audio.js`, float/heart/ambient dejan de añadir las llamadas fijas de campana/cristal. `createAmbientPunctuation` admite una voz metálica automática por región cada ocho compases, con caché de 64 regiones, reiniciada al cambiar partida o retroceder el reloj. Las voces de pistas, gestos y celebraciones conservan su origen y no consumen ese límite. El hook opcional `audioNoteCue` registra instrumento, origen y tiempo sin exponer runtime en producción. No modifica síntesis ni volumen maestro.

Tu cubo conserva el selector y el guardado existente; los regalos incluyen retrato, nombre corto, encontrados y estado de vista previa/equipado. Ajustes distingue textos del paisaje, estilo de La Voz y datos del mundo.

## Encuentros traviesos y logros ampliados

`universe-mischief-model.js` define diez escenas locales y sus transiciones. El hash propio usa celdas de 1800 unidades con un 12% ocupado; excluye mar y vincula la danza a esculturas reales. `universe-mischief.js` mantiene una escena, caché de 48 celdas, pausa/inspección/preview/autopilot protegidos y cola musical acotada. Alejarse 650 unidades cancela (1400 para copia y despedida, que acompañan al viajero); tras terminar hay 45 segundos de separación. La ayuda del cristal usa el campo mineral existente y observa su rotura, sin alterar daño ni coordenadas.

`universe-mischief-art.js` dibuja actores procedurales, pistas, fragmentos, sombras y la escultura prestada. El paisaje contenido congela temporalmente posiciones y poses de presencias cercanas, dejando libre al cubo y sus controles. La procesión puede alcanzar una escultura y reutilizar su celebración. Los sonidos se colocan en la cuadrícula musical con voces de la familia regional y volúmenes 0,012/0,014; no modifican síntesis ni mezcla.

`S.mischief` versión 1 conserva hasta 4096 lugares completados, contadores por tipo, trucos y esculturas. Cada premio de tres chispas guarda reclamación y saldo juntos; un fallo revierte ambos y espera dos segundos para reintentar. Repetir no paga ni aumenta contadores. Escenas incompletas son efímeras. Versiones futuras se preservan sin conceder premios.

`adventure-achievements.js` añade 120 reglas al catálogo anterior: total registrado 370, incluido el logro retirado existente. Los premios de logros nuevos se guardan en lote y revierten fechas/recompensas ante error. No añaden chispas. Los avisos de logros se agrupan en la cola silenciosa existente; `journal.achievementSeen` conserva IDs consultados como registro compatible con respaldos. Partidas anteriores parten de sus logros actuales sin avisos retroactivos; la marca se borra al consultar Logros, con reversión si falla guardar. `activities.types` conserva tipos completados y se reconstruye para partidas anteriores a partir de sitios deterministas, sin repetir pagos. Las metas de logros usan datos propios conocidos de cada versión.

La presentación alpha.50 aclara el saldo de chispas y refuerza el contraste de minerales y fragmentos sin cambiar minería, posiciones ni pagos. Una única pista dorada anticipa la travesura no completada más cercana entre 95 y 320 unidades, dentro de pantalla, sin sonidos, textos, interacción o sitios nuevos. Respeta pausa, capas, paseo automático, movimiento reducido y separación entre escenas.

## Cuenta opcional Supabase · proyecto Dev conectado

`main.js` inicializa `cloud-account.js` en vez del módulo histórico `connection.js`. `cloud-client.js` usa Auth/Data REST HTTPS con clave publicable, tokens persistentes por origen y renovación compartida; `cloud-sync.js` coordina elección inicial, revisión por usuario/mundo y respaldos de un minuto. `cloud-config.js` apunta a Kubono Dev Free con clave publicable; vacío mantiene el juego offline sin llamadas API. No se inicializan salas ni música de duetos; backend Python y pruebas históricas siguen aparte. `supabase/setup.sql` consolida RLS, cuotas y CAS aplicados en Dev; el borrado privilegiado vive en kubono_private, con envoltorio invoker. Alta/login, aislamiento y copia completa reales verificados; recuperación por enlace local en pruebas. [Configuración y límites](CUENTA_Y_RESPALDO.md).

Recuperación de desarrollo: `recovery.html` valida el token con `cloud-recovery.js`, cambia la clave y cierra esa sesión; sin persistencia ni sincronización de partida. `scripts/serve-recovery.py` sirve solo los archivos necesarios en localhost:3000. El correo usa el enlace predeterminado, sin plantilla personalizada.

`cloud-sync.js` conserva una referencia canónica por usuario/mundo y hace comparación de tres copias al reanudar: local intacta permite recuperar remoto; cambios divergentes detienen envío. Lectura periódica de 15 s, CAS en cada escritura, respaldo de reemplazos manuales y envío adicional de salida con keepalive acotado. La referencia completa evita decidir por saldo/fecha; fallos de cuota conservan la copia local y requieren elección al reabrir.

Alpha.55: sesión localStorage con migración de sessionStorage y lectura compartida al consultar usuario/token. Reconciliación inicial automática: primera subida si no existe remoto, recuperación en dispositivo sin progreso y elección solo ante divergencias. Controles de elección ocultos mientras la sincronización esté resuelta.

Alpha.56 elimina la entrada visible a exportación/importación y descarga remota. Cuenta conserva login persistente, sincronización automática cada 5 s y resolución excepcional de divergencias. Copias internas previas y CAS se conservan. Ediciones locales con remoto intacto no generan conflictos falsos.

Alpha.57: `main.js` espera `requireAccount()` antes de crear el runtime. `progress.js` separa almacenamiento local por accountUserId y expone cloudScope estable para el remoto. Frame/guardado verifican la identidad; logout/cambio recargan a la entrada. No hay bypass de acceso por URL ni bandera de producción. Fixtures de gameplay instrumentan main sustituyendo solo su llamada de admisión, mientras la prueba de cuentas verifica la llamada real.
