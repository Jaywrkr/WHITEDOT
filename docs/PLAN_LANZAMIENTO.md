# KUBONO · plan hasta las primeras ventas

Actualizado: 19 de octubre de 2026. Estado: propuesta operativa para revisar con Jay. Este archivo es la guía compartida; las fechas son objetivos, no compromisos públicos ni aprobación de tiendas.

**Decisión de Jay:** preparación conjunta de todas las plataformas; cada una sale cuando esté lista y aprobada. Android, iOS/iPadOS, web/PWA y escritorio Windows/macOS/Linux avanzan desde el principio. Una marca, un juego y materiales compartidos; fechas de publicación independientes. No esperar a ventas Android para empezar iOS o PC.

**Ventana de planificación propuesta:** ocho semanas, del 19 de octubre al 13 de diciembre de 2026, más revisiones externas. Revisar viabilidad al terminar S1; no es una promesa de tener todos los ports listos ni una fecha pública. Consolas se evalúan desde S1 como un frente con admisión y viabilidad propias, sin prometer disponibilidad antes de conocer sus condiciones.

## Punto de partida y decisiones

| Tema | Lo que sabemos / recomendación | Estado |
|---|---|---|
| Producto | Juego web existente y APK debug funcionando en Android 15 emulado; Jay ya lo jugó en su PC. | Hecho; no equivale a versión de tienda |
| Nombre | **Kubono**, elegido por Jay. Repositorio, web y APK conservan WHITEDOT hasta autorizar la implementación del cambio. | Decidido; sin renombrar producto todavía |
| Dominio | **playkubono.com**, previsto por Jay; sin registro encontrado en RDAP en la consulta del 19 oct. Confirmar disponibilidad/precio al comprar. | Elegido; no comprado ni reservado |
| Promesa | «Un cubo. Un universo que suena.» Explorar, romper cristales y descubrir rarezas musicales. Público inicial propuesto: jugadores de exploración relajada y curiosos de la música. | Hipótesis a probar |
| Modelo | Aprobado por Jay: **US$2,99 móvil / US$4,99 escritorio**, pago único, sin anuncios ni venta de chispas. Revisar precios locales al configurar tiendas. | Precios base aprobados; configurar equivalentes locales |
| Web | Jay confirma que habrá **demo web**. Recomendación pendiente: zona acotada sin cronómetro; extensión y límites por definir. La web completa actual sigue intacta. | Demo decidida; alcance e implementación pendientes |
| Identidad | Jay aprueba el estilo visual local: negro/blanco cálido, dorado para progreso, acentos menta/rosa; logo kubono con cubo, lectura simple y Geist Mono en datos. | Dirección visual aprobada; piezas finales pendientes |
| Cuentas | Jay no tiene Apple Developer Program confirmado; podría tener cuenta gratuita. Play/Steam y pagos sin confirmar. Para App Store/TestFlight se necesita membresía Apple. | Verificar estado antes de pagar |
| Recursos | Jay tiene Mac e iPhone y podría conseguir Android prestado. Faltan modelo/macOS para compatibilidad Xcode, confirmar acceso Android y prueba iPad si se anuncia soporte. | Disponibilidad declarada; compatibilidad pendiente |

La demo mostrará el juego real y dirigirá a las versiones completas; límites todavía sin decidir. No prometer compras compartidas ni usar «offline» como ventaja exclusiva si la PWA lo ofrece. El APK debug no se vende como producto final.

**Revisión del nombre, 19 oct:** sin título exacto encontrado en las consultas de tiendas realizadas (App Store estadounidense, Play y Steam); USPTO sin resultados para KUBONO. TMview, búsqueda «contiene» sin restringir clases, devolvió una coincidencia china: 久保农 KUBONO, solicitud 55781613, registrada en clase 4 para aceites/lubricantes; no devolvió registros europeos. Madrid Monitor de WIPO: cero resultados, incluyendo activos, pendientes e inactivos; Global Brand Database no accesible. Esto no certifica disponibilidad jurídica ni descarta similitudes. Búsqueda fonética SENADI pendiente, sin trámite ni pago iniciado. [Ficha encontrada](https://www.tmdn.org/tmview/#/tmview/detail/CN500005578161304), [Madrid Monitor](https://www3.wipo.int/madrid/monitor/en/), [USPTO](https://tmsearch.uspto.gov/).

## Plataformas y dependencias

| Frente desde S1 | Base que reutilizamos | Qué falta para vender / distribuir |
|---|---|---|
| Android · Google Play | APK debug probado en emulador; juego y recursos locales | Cuenta, firma y AAB release, Android físico, pruebas exigidas y revisión |
| iPhone/iPad · App Store | Juego web, audio, identidad y materiales | Contenedor iOS por implementar; acceso a Mac/Xcode e iPhone/iPad, firma, TestFlight y App Review. La aceptación de un contenedor web no está garantizada |
| Web/PWA | Versión completa ya publicada | Resolver modelo gratis/demo/pago antes de comunicar ventajas; landing, soporte y recorrido coherente. No añadir un sistema de cobro propio sin decidirlo |
| Windows/macOS/Linux · Steam; itch.io como canal complementario por decidir | Canvas/WebAudio y controles existentes | Elegir y validar empaquetado mínimo; instaladores/builds, persistencia, audio, archivos y actualizaciones por sistema; cuentas, materiales y revisión de tienda. No existe todavía un port de escritorio |
| Consolas · evaluación de alcance | Concepto y juego actual | Comprobar acceso a programas, requisitos, controles, coste y viabilidad técnica antes de comprometer ports o fechas. No quedan prometidas por tener una versión web |

No prometer compras compartidas ni sincronización automática de guardados entre tiendas: hoy no existen. La copia manual existente debe probarse por plataforma. Una ficha en inglés no implica que el juego esté localizado; decidir idiomas en S1. No asumir que servicios opcionales del backend están desplegados.

## Timeline conjunto

Fechas orientativas. Todos los frentes se abren en S1; compartir trabajo no obliga a realizar todas las tareas el mismo día. Jay decide y habilita cuentas/recursos; Codex prepara bloques técnicos y comerciales autorizados. Publicar requiere autorización explícita por canal.

| Fase | Fechas objetivo | Trabajo compartido | Trabajo por plataforma |
|---|---|---|---|
| S1 · Desbloquear todo | 19–25 oct | Nombre, promesa, precio por canal, web, idiomas, presupuesto, cuentas y recursos; revisión de viabilidad de consolas | Confirmar Play/Apple/Steam, Android físico y acceso a Mac/iPhone/iPad; elegir ruta mínima de escritorio y medios de prueba Linux/macOS |
| S2 · Candidatos iniciales | 26 oct–1 nov | Icono maestro, textos ES/EN, capturas y landing en borrador | Android release; prototipo iOS y escritorio; detectar bloqueos de audio, guardados y archivos antes de ampliar el empaquetado |
| S3–S4 · Probar en paralelo | 2–15 nov | Observación de jugadores nuevos; lista única de defectos; primeros clips reales | Play cerrado si corresponde, TestFlight cuando esté disponible y pruebas desktop por sistema. Preparar ficha Steam y Coming Soon sujeto a autorización |
| S5–S6 · Cerrar candidatos | 16–29 nov | Tráiler, press kit, soporte, privacidad y contactos en borrador | Corregir solo fallos; firma/distribución y revisión independiente por canal. Cada plataforma puede salir al cumplir sus condiciones |
| S7–S8 · Completar salidas | 30 nov–13 dic | Landing con estados reales y campaña común adaptada a cada disponibilidad | Publicar únicamente builds aprobadas y autorizadas; atender incidencias. Lo bloqueado conserva su trabajo y fecha revisada |
| Primeras dos semanas de cada salida | Desde su fecha real | Revisar visitas, compras, reembolsos y dudas por canal | Hotfix de problemas graves; actualizar estado aquí sin detener los demás frentes |

**Regla de calendario:** una demora en iOS, Steam o cualquier otro canal no frena a los que estén listos. No anunciar enlaces ni fechas sin comprobarlos. Al cerrar S1 se reestima cada plataforma con recursos reales, sin añadir funciones para justificar retrasos.

Play: las cuentas personales nuevas sujetas a la regla necesitan al menos 12 testers inscritos continuamente durante 14 días; reclutar 15–20 es solo un margen. El APK instalado por fuera no cuenta. El acceso a producción posterior no está garantizado. [Pruebas oficiales](https://support.google.com/googleplay/android-developer/answer/14151465). La verificación de una cuenta nueva puede exigir Android físico sin root, Android 10 o superior; el emulador no lo sustituye. [Dispositivo](https://support.google.com/googleplay/android-developer/answer/14316361).

iOS: confirmar recursos y cuenta desde S1; probar por TestFlight y completar App Review. [Distribución beta](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases), [revisión](https://developer.apple.com/app-store/review/guidelines/). Para distribución macOS externa, planificar Developer ID y notarización. [Apple](https://developer.apple.com/developer-id/).

Steam: preparar cuenta, página y build en paralelo; contempla un mínimo de dos semanas de Coming Soon antes de publicar y revisión de materiales/build. Comprobar también la espera aplicable al alta/pago antes de fijar fecha. [Proceso oficial](https://partner.steamgames.com/doc/store/releasing).

## Entregables mínimos, sin ampliar el juego

| ID | Entrega y criterio de terminado | Ventana | Responsable propuesto | Estado |
|---|---|---|---|---|
| D01 | Kubono y playkubono.com decididos; revisión inicial registrada arriba. Confirmar editor/contacto y valorar búsqueda fonética SENADI. No renombrar ni comprar todavía. | S1 | Jay + Codex | Nombre/dominio decididos; resto pendiente |
| D02 | Precio/base, países, idioma y política web/app decididos. No implementar el cambio de nombre hasta autorizar el paquete correspondiente. | S1 | Jay | Pendiente |
| D03 | Cuenta Play, identidad y pagos verificados; correo de soporte y contacto público definidos; Android físico accesible. | S1–S2 | Jay | No confirmado |
| D04 | Identificador de producción definitivo, versionCode, firma/upload key y respaldo seguro, AAB release sin depuración. Mantener separada la edición `.preview`; no guardar claves en Git. | S2 | Codex prepara; Jay custodia | Pendiente |
| D05 | Primera instalación y actualización desde Play probadas; audio/Home/regreso, guardado, restauración de copia y descarga de archivos en al menos dos Android reales de distinta capacidad. | S2–S4 | Jay/testers + Codex | Pendiente |
| D06 | Formularios de privacidad/Data Safety, anuncios, público y clasificación completados según el comportamiento real, incluidos servicios opcionales; revisar licencias/créditos. No declarar «no recoge datos» sin comprobarlo. | S2–S4 | Codex prepara; Jay confirma | Pendiente |
| D07 | Texto ES y EN: título, descripción breve/larga, tres beneficios, requisitos/limitaciones y notas de versión. Traducción de ficha no significa juego completamente localizado al inglés. | S2 | Codex; Jay aprueba | Pendiente |
| D08 | Icono Play 512×512, gráfico destacado 1024×500 y seis capturas reales con una idea clara por imagen. Verificar legibilidad a tamaño pequeño; reutilizar estética actual. | S2 | Codex; Jay aprueba | Pendiente |
| D09 | Tráiler de 20–30 s y seis clips verticales de 10–20 s con audio original del juego: cristal/fragmento, encuentro raro, música al moverse, actividad, personalización y sorpresa. Material real, sin promesas inventadas. | S2–S5 | Codex edita con capturas; Jay aprueba | Pendiente |
| D10 | Landing de una página: vídeo corto, frase principal, tres motivos para jugar, precio/modelo, requisitos, preguntas frecuentes, soporte y privacidad. Antes de salir: enlace real a beta si existe; después: enlaces de cada plataforma disponible. Sin tienda propia ni otra app. | S2–S5 | Codex; Jay aprueba | Pendiente |
| D11 | Press kit pequeño: icono, 4 capturas, tráiler, descripción, autor/contacto y enlaces. Una carpeta o ZIP; no hace falta un portal adicional. | S5 | Codex | Pendiente |
| D12 | Lista revisada de 15–20 creadores pequeños/comunidades pertinentes, incluyendo electrónica, producción musical y exploración indie y tres borradores de contacto personalizados. No comprar listas ni enviar mensajes sin instrucciones de Jay. | S3–S5 | Codex investiga; Jay selecciona/envía | Pendiente |
| D13 | Prueba cerrada completa y acceso a producción; evidencias y defectos pendientes registrados. No pedir reseñas positivas ni sustituir pruebas reales por intercambios de reseñas. | S2–S4 | Jay + testers | Pendiente |
| D14 | Candidato final por plataforma, checks afectados, revisión, precio y enlaces comprobados; plan de retirada/hotfix y respaldo seguro de firma. Registrar evidencia por canal. | Desde S5 | Ambos | Pendiente |
| D15 | iOS/iPadOS: recursos y cuenta desde S1, contenedor mínimo, firma, TestFlight, instalación/actualización, audio, suspensión, guardados y archivos; ficha y App Review. Reutilizar arte/textos y adaptar formatos. | S1–S8 | Jay + Codex | Pendiente; sin proyecto iOS |
| D16 | Windows/macOS/Linux: decidir empaquetado mínimo, crear builds, probar instalación/actualización/audio/guardados/archivos en cada sistema y completar distribución/firma. No anunciar sistemas sin prueba real. | S1–S8 | Jay + Codex | Pendiente; sin builds desktop |
| D17 | Steam: cuenta/pagos, tarifa, ficha, recursos específicos, Coming Soon, revisión y build; decidir si itch.io aporta suficiente para abrir otro canal. | S1–S8 | Jay cuentas/aprobación; Codex prepara | Pendiente |
| D18 | Web/PWA: decisión comercial, landing común con estados disponibles/próximamente y enlaces por plataforma; verificar recorrido existente sin convertirlo en otro proyecto. | S1–S6 | Ambos | Pendiente |
| D19 | Consolas: registrar programas de acceso, requisitos y estimación de viabilidad; Jay decide alcance/presupuesto antes de cualquier port. | Evaluación S1; fecha de salida por definir | Ambos | Sin viabilidad confirmada |

Las dimensiones y reglas finales se revisan al exportar, no se mantienen dos catálogos de requisitos. [Material de Google Play](https://support.google.com/googleplay/android-developer/answer/9866151).

## Comunicación y venta: experimento inicial

**Hipótesis comercial, no demanda demostrada:** presentar Kubono como exploración musical con una identidad de música electrónica: descubrir ritmos, texturas y rarezas con el cubo. Fans de electrónica y jugadores de exploración son dos públicos iniciales a validar. Mostrar música real del juego en clips; no prometer un DAW, licencias de artistas ni géneros aún no comprobados. No vender «millones de funciones» ni compararlo como sustituto de Minecraft/No Man's Sky. El primer vídeo debe mostrar una acción y su respuesta en los primeros segundos.

Recorrido propuesto: clip real → landing clara → probar/entender el juego → ficha de la plataforma elegida → compra. Primero validar esta secuencia; no abrir cinco plataformas de contenido a la vez.

| Momento | Acción propuesta | Qué queremos aprender |
|---|---|---|
| Antes de beta | Tres clips con enfoques diferentes: curiosidad, música y humor. Elegir un canal principal que Jay ya use; adaptar los mismos materiales a un segundo solo si cuesta poco. | Qué promesa genera interés real |
| Durante beta | Dos publicaciones semanales con escenas reales y avances pequeños; observar a 5 jugadores nuevos sin explicarles cada paso. Contacto individual solo autorizado. | Si entienden qué hacer y quieren regresar |
| Semana de salida | Un tráiler principal, tres clips reutilizados, enlace de compra visible y contactos aprobados. No anunciar antes de tener enlace y aprobación. | Si el interés se convierte en visitas y compras |
| Después de salir | Dos comunicaciones semanales como máximo al inicio; resolver dudas repetidas en la ficha/landing y atender incidencias. | Qué frena la compra o causa reembolsos |

Capturar visitas a landing/enlace de tienda con medios disponibles y consentimientos adecuados; empezar con estadísticas de cada tienda y conteos manuales. Medir: visitas a ficha, compradores, ingreso real tras ajustes, reembolsos, fallos y preguntas repetidas. No hay todavía una tasa de conversión, audiencia ni volumen de ventas verificados; no proyectar ingresos como si los hubiera.

Si pocos llegan a la ficha, mejorar distribución o primer clip. Si llegan y no compran, revisar claridad, confianza, precio y papel de la web. Si compran y abandonan/reembolsan, priorizar la primera sesión y estabilidad. No bajar precio automáticamente por pocas ventas sin saber en qué paso se pierden.

## Precio y presupuesto

Aprobado por Jay el 19 oct: **US$2,99 móvil / US$4,99 escritorio** y **US$350 de presupuesto inicial**. La aprobación del presupuesto no inicia compras ni suscripciones; en esta etapa solo se verifican cuentas y equipos. Base publicada de registros: Play US$25 una vez + Apple US$99/año + Steam US$100 por juego = **US$224**, antes de impuestos/conversión. El margen no es una cotización completa: excluye hardware, publicidad, consumo Codex y posibles servicios/certificados adicionales. Aprovechar Mac/iPhone propios y Android prestado; sin compras autorizadas.

- Aplicar los precios base aprobados: US$2,99 en móvil y US$4,99 en escritorio. Revisar moneda/precio por país. No añadir suscripciones, anuncios o pagos por chispas.
- Propuesta: promoción orgánica al principio. No autorizar gasto en anuncios en este plan. Si Jay decide una prueba pagada, fijar importe máximo y una métrica de compra antes de gastarlo.
- Google Play: registro de US$25 una vez; cuenta, verificación y datos deben pertenecer a Jay/editor real. [Alta oficial](https://support.google.com/googleplay/android-developer/answer/6112435). Ecuador figura como ubicación admitida para desarrollador/comerciante en USD; confirmar el país real del perfil, no inferirlo de la zona horaria. [Ubicaciones](https://support.google.com/googleplay/android-developer/answer/9306917).
- Las comisiones dependen de mercado/programa. Revisar elegibilidad e inscripción al nivel aplicable en Play; no tratar US$2,99 como ingreso neto. Impuestos, devoluciones y otros ajustes cambian lo recibido. [Tarifas](https://support.google.com/googleplay/android-developer/answer/112622).
- Apple Developer: US$99/año o equivalente local; preparar alta junto con las demás cuentas, tras confirmar recursos y autorización del gasto. [Membresía](https://developer.apple.com/help/account/membership/program-enrollment/).
- No publicar la aplicación de producción gratis «para luego cobrar»: Play indica que una app ofrecida gratis no se puede convertir después en app de pago con el mismo paquete. Planificar desde el principio el precio y el mecanismo de prueba permitido. [Precios oficiales](https://support.google.com/googleplay/android-developer/answer/6334373).
- Steam Direct: presupuestar la tarifa por producto y verificar condiciones vigentes antes de pagar. [Tarifa oficial](https://partner.steamgames.com/doc/gettingstarted/appfee). No hay gasto autorizado.
- Dominio, alojamiento extra, Mac/remoto y dispositivo prestado/comprado: importes sin aprobar. Reutilizar alojamiento e icono actuales mientras se decide; no comprar nada por este plan.

## Condiciones por plataforma para decir «ya está a la venta»

- [ ] Nombre, editor, precio y papel de la web aprobados por Jay.
- [ ] Cuenta/verificaciones/pagos completos y producción habilitada.
- [ ] Paquete release adecuado al canal (AAB, app iOS o build desktop), firma/distribución resueltas; sin debug ni pruebas dentro del producto.
- [ ] Pruebas obligatorias y prueba humana en el sistema/dispositivo anunciado; audio, suspensión, actualización y copias verificados. El emulador Android no certifica iOS ni desktop.
- [ ] Candidato final sin fallos bloqueantes y comprobaciones requeridas para integración aprobadas. Reutilizar resultados válidos; no repetir toda la batería en cada tarea.
- [ ] Privacidad, clasificación, créditos, soporte, ficha y materiales coherentes con lo que realmente hace el juego.
- [ ] Tienda aprobada, precio/países y enlaces comprobados; autorización explícita de Jay para publicar.
- [ ] Una persona puede encontrar la ficha pública y comprar/instalar por la vía normal; registrar fecha real y país de comprobación. Una subida de rama, APK, AAB o revisión aprobada no equivale a ventas.

## Cómo usamos esta guía sin gastar de más

Al empezar una sesión: leer «Próxima acción» y los IDs implicados; trabajar en un bloque pequeño. Al terminar: actualizar estado/evidencia y dejar el siguiente paso. Jay conserva decisiones comerciales, cuentas, credenciales, compras, contacto con terceros y publicación. Codex prepara opciones, materiales, código autorizado y comprobaciones afectadas.

No añadir actividades, monedas, menús o sistemas nuevos para justificar el precio. No ejecutar todo el plan porque este documento exista. No crear otro backlog paralelo: mantener aquí tareas y decisiones, y enlazar los materiales finales. Los planes históricos no son autorización vigente.

**Próxima acción:** comprobar estado de cuentas y compatibilidad de equipos; precios y presupuesto ya aprobados. Jay facilita modelo de Mac/macOS y modelo de iPhone; confirma cuentas Play/Steam y acceso Android. La demo está decidida, sus límites aún no. **Dirección visual aprobada por Jay; tablero local funcional autorizado.** Las piezas comerciales finales, fichas y ports siguen esperando la revisión de cuentas/equipos. Sin compra de dominio ni cambio del producto.

| Fecha | Decisión o evidencia | Consecuencia |
|---|---|---|
| 19 oct 2026 | Jay confirma haber jugado al APK en su emulador local; CI Android previo aprobado. | Base técnica de vista previa disponible; no certifica hardware físico ni tienda |
| 19 oct 2026 | Jay decide preparación conjunta y salida de cada plataforma cuando esté lista/aprobada. | Sustituye Android primero/iOS después; recursos y fechas siguen por confirmar; sin autorización de publicación |

| 19 oct 2026 | Jay elige Kubono y playkubono.com como dominio previsto, sin comprar; confirma demo, Mac e iPhone. | Documentar decisiones; precios y presupuesto pendientes; paquete común en espera |

| 19 oct 2026 | Jay aprueba US$2,99 móvil, US$4,99 escritorio y US$350 de presupuesto inicial. | Verificar cuentas/equipos antes del paquete común; sin ejecutar pagos |

| 19 oct 2026 | Jay aprueba el estilo visual y pide tablero funcional local; destaca la música electrónica como nicho importante. | Incorporar electrónica en posicionamiento, clips y público; sin cambiar audio ni publicar |

Fuentes oficiales consultadas el 19 de octubre de 2026. Revalidar al efectuar cada trámite; las reglas de tiendas y plazos pueden cambiar.

## Tablero local de seguimiento

La web local vive fuera del juego en `outputs/kubono-visual/` (raíz de esta tarea). El servidor escucha solo en 127.0.0.1:8768 y guarda estados/notas en `progress.json`; el catálogo de entregables parte de D01–D19. El MD conserva alcance y decisiones; el JSON conserva el seguimiento operativo. Leer ambos al retomar y reconciliar estados antes de informar avances. Se puede exportar/importar una copia JSON; no subir cuentas, credenciales ni datos de pago. No hay colaboración remota ni autenticación: es una herramienta local, no publicarla con este servidor.
