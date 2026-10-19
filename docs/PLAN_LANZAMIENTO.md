# WHITEDOT · plan hasta las primeras ventas

Actualizado: 19 de octubre de 2026. Estado: propuesta operativa para revisar con Jay. Este archivo es la guía compartida; las fechas son objetivos, no compromisos públicos ni aprobación de tiendas.

**Meta propuesta:** Android de pago entre el **30 de noviembre y el 7 de diciembre de 2026**. iOS se prepara comercialmente en paralelo, pero su desarrollo empieza después de cerrar Android. No se anuncia una fecha pública hasta que cuentas, pruebas y revisión estén resueltas.

## Punto de partida y decisiones

| Tema | Lo que sabemos / recomendación | Estado |
|---|---|---|
| Producto | Juego web existente y APK debug funcionando en Android 15 emulado; Jay ya lo jugó en su PC. | Hecho; no equivale a versión de tienda |
| Nombre | Repositorio, web y APK se llaman **WHITEDOT**, no Whitebox. Recomiendo conservar WHITEDOT hasta revisar coincidencias en tiendas, búsquedas, dominio y redes. WHITEBOX es solo un candidato; no hay disponibilidad comprobada de ninguno. | Jay decide en S1 |
| Promesa | «Un cubo. Un universo que suena.» Explorar, romper cristales y descubrir rarezas musicales. Público inicial propuesto: jugadores de exploración relajada y curiosos de la música. | Hipótesis a probar |
| Modelo | Android a **US$2,99**, pago único, sin anuncios ni venta de chispas. Precios locales revisados en Play Console. | Orientación acordada; configurar después |
| Web | Hoy existe una versión web completa. Antes de vender, decidir si seguirá completa gratis o se convertirá en una demo acotada. Recomiendo una demo si queremos priorizar ventas; su alcance necesita aprobación aparte. No restringirla ahora. | Decisión comercial pendiente |
| Identidad | Aprovechar negro, blanco, cubo e iconos existentes; preparar una versión legible en tamaño pequeño, no rediseñar todo. | Pendiente |
| Cuentas | No consta cuenta Play verificada, perfil de pagos ni membresía Apple. No inventar que están listos. | Jay confirma en S1 |
| Recursos | Emulador listo; falta acceso a Android físico. No consta acceso a Mac, Xcode o iPhone. | Dependencias abiertas |

Si la web sigue completa gratis, comunicarlo con claridad: la compra apoya el proyecto y ofrece la aplicación Android. No prometer contenido exclusivo, ni usar «offline» como diferencia si la PWA también lo ofrece. El APK debug no se vende como producto final.

## Timeline propuesto

Las fechas asumen decisiones y acceso a cuentas en S1. Codex prepara materiales y cambios técnicos; Jay decide, prueba con personas y autoriza pagos/publicaciones. No hay presupuesto publicitario aprobado.

| Fase | Fechas objetivo | Entrega concreta | Responsable propuesto | Condición para avanzar |
|---|---|---|---|---|
| S1 · Definir y desbloquear | 19–25 oct | Nombre provisional revisado, promesa, papel de la web, cuenta Play y plan para conseguir testers/Android prestado. Presupuesto máximo aprobado. | Jay decide; Codex prepara opciones breves | Nombre y modelo decididos; cuentas y recursos viables |
| S2 · Preparar la venta y beta | 26 oct–1 nov | AAB firmado para pruebas, ficha ES/EN, icono y capturas, landing en borrador, grupo de pruebas reclutado. | Codex técnico/materiales; Jay cuentas/testers | Instalación desde Play y pruebas reales; beta iniciada |
| S3 · Probar y mostrar | 2–8 nov | Prueba cerrada en marcha; 3 vídeos cortos reales; observación de jugadores nuevos; lista única de errores. | Jay observa y publica solo si autoriza; Codex corrige bloqueos | Sesión inicial comprensible y progreso conservado |
| S4 · Cerrar producto | 9–15 nov | Completar periodo de pruebas si aplica, solicitar acceso a producción, corregir solo fallos comprobados, cerrar soporte/privacidad/ficha. | Ambos; trámites Jay | Sin fallos bloqueantes; requisitos de Play satisfechos |
| S5 · Preparar el estreno | 16–22 nov | Paquete de lanzamiento: tráiler, piezas sociales, press kit, lista breve de creadores adecuados y borradores de contacto. Revisión de tienda según disponibilidad de la cuenta. | Codex prepara; Jay aprueba/envía | Materiales finales y versión candidata aceptable |
| S6 · Revisión y margen | 23–29 nov | Estado de revisión confirmado, precio/países comprobados, compra/instalación probadas por la vía autorizada de Play, landing y enlaces listos. | Ambos | Aprobación de tienda y autorización final de Jay |
| Venta Android | 30 nov–7 dic | Publicación manual autorizada, landing con enlace real, anuncio y seguimiento. | Jay autoriza; Codex ayuda | Todas las condiciones de salida cumplidas |
| Primeras dos semanas | Desde la venta real | Soporte, revisión de compras/reembolsos/comentarios; corregir solo problemas graves. Decidir siguiente inversión con datos. | Ambos | Decisión informada sobre iOS y promoción |
| iOS · segunda salida | Objetivo orientativo: ene 2027; revisar tras Android | Contenedor iOS, firma, TestFlight, pruebas en iPhone, ficha y App Review. | Codex prepara; Jay recursos/cuenta/aprobación | Mac/Xcode, iPhone accesible, membresía y validación. No es una fecha anunciable todavía |

**Camino crítico:** cuenta/verificación → AAB y prueba de Play → periodo cerrado cuando corresponda → acceso a producción/revisión → autorización → venta. Logo, landing y vídeos avanzan en paralelo. Si una dependencia se retrasa, se mueve la fecha; no se compensa añadiendo funciones o saltándose pruebas.

Para cuentas personales nuevas sujetas a la regla, planificar al menos 12 testers inscritos de forma continua durante 14 días. Reclutar 15–20 es un margen propuesto ante bajas, no un requisito de Google. Empezar el reloj solo cuando Play confirme las inscripciones; instalar el APK por fuera no cuenta. La duración y aprobación posterior no se garantizan. [Requisito oficial](https://support.google.com/googleplay/android-developer/answer/14151465).

Para una cuenta personal nueva también puede exigirse verificar acceso a un Android físico sin root, Android 10 o superior, desde la app Play Console. Jay puede conseguir uno prestado y hacer personalmente la verificación con su cuenta; el emulador no cumple este requisito. [Verificación de dispositivo](https://support.google.com/googleplay/android-developer/answer/14316361).

## Entregables mínimos, sin ampliar el juego

| ID | Entrega y criterio de terminado | Ventana | Responsable propuesto | Estado |
|---|---|---|---|---|
| D01 | Nombre decidido y revisión básica de coincidencias documentada; confirmar identificación del editor y uso de @jaywrkr. Esto no certifica disponibilidad jurídica. | S1 | Jay + Codex | Pendiente |
| D02 | Precio/base, países, idioma y política web/app decididos. No cambiar el nombre del proyecto antes de esa decisión. | S1 | Jay | Pendiente |
| D03 | Cuenta Play, identidad y pagos verificados; correo de soporte y contacto público definidos; Android físico accesible. | S1–S2 | Jay | No confirmado |
| D04 | Identificador de producción definitivo, versionCode, firma/upload key y respaldo seguro, AAB release sin depuración. Mantener separada la edición `.preview`; no guardar claves en Git. | S2 | Codex prepara; Jay custodia | Pendiente |
| D05 | Primera instalación y actualización desde Play probadas; audio/Home/regreso, guardado, restauración de copia y descarga de archivos en al menos dos Android reales de distinta capacidad. | S2–S4 | Jay/testers + Codex | Pendiente |
| D06 | Formularios de privacidad/Data Safety, anuncios, público y clasificación completados según el comportamiento real, incluidos servicios opcionales; revisar licencias/créditos. No declarar «no recoge datos» sin comprobarlo. | S2–S4 | Codex prepara; Jay confirma | Pendiente |
| D07 | Texto ES y EN: título, descripción breve/larga, tres beneficios, requisitos/limitaciones y notas de versión. Traducción de ficha no significa juego completamente localizado al inglés. | S2 | Codex; Jay aprueba | Pendiente |
| D08 | Icono Play 512×512, gráfico destacado 1024×500 y seis capturas reales con una idea clara por imagen. Verificar legibilidad a tamaño pequeño; reutilizar estética actual. | S2 | Codex; Jay aprueba | Pendiente |
| D09 | Tráiler de 20–30 s y seis clips verticales de 10–20 s con audio original del juego: cristal/fragmento, encuentro raro, música al moverse, actividad, personalización y sorpresa. Material real, sin promesas inventadas. | S2–S5 | Codex edita con capturas; Jay aprueba | Pendiente |
| D10 | Landing de una página: vídeo corto, frase principal, tres motivos para jugar, precio/modelo, requisitos, preguntas frecuentes, soporte y privacidad. Antes de salir: enlace real a beta si existe; después: Google Play. Sin tienda propia ni otra app. | S2–S5 | Codex; Jay aprueba | Pendiente |
| D11 | Press kit pequeño: icono, 4 capturas, tráiler, descripción, autor/contacto y enlaces. Una carpeta o ZIP; no hace falta un portal adicional. | S5 | Codex | Pendiente |
| D12 | Lista revisada de 15–20 creadores pequeños/comunidades pertinentes y tres borradores de contacto personalizados. No comprar listas ni enviar mensajes sin instrucciones de Jay. | S3–S5 | Codex investiga; Jay selecciona/envía | Pendiente |
| D13 | Prueba cerrada completa y acceso a producción; evidencias y defectos pendientes registrados. No pedir reseñas positivas ni sustituir pruebas reales por intercambios de reseñas. | S2–S4 | Jay + testers | Pendiente |
| D14 | Candidato final probado una vez en conjunto, revisión de Play, precio y enlaces comprobados; plan de despublicación/hotfix y copia segura de firma. | S5–S6 | Ambos | Pendiente |
| D15 | Ficha iOS en borrador reutilizando mensajes/arte; confirmar Mac/Xcode, iPhone y membresía antes de comprometer fecha o pagar infraestructura. Recursos finales según requisitos de App Store Connect. | S5; desarrollo tras Android | Jay + Codex | Pospuesto |

Las dimensiones y reglas finales se revisan al exportar, no se mantienen dos catálogos de requisitos. [Material de Google Play](https://support.google.com/googleplay/android-developer/answer/9866151).

## Comunicación y venta: experimento inicial

**Hipótesis comercial, no demanda demostrada:** vender el placer de descubrir sonidos y rarezas con el cubo. No vender «millones de funciones» ni compararlo como sustituto de Minecraft/No Man's Sky. El primer vídeo debe mostrar una acción y su respuesta en los primeros segundos.

Recorrido propuesto: clip real → landing clara → probar/entender el juego → ficha de Play → compra. Primero validar esta secuencia; no abrir cinco plataformas de contenido a la vez.

| Momento | Acción propuesta | Qué queremos aprender |
|---|---|---|
| Antes de beta | Tres clips con enfoques diferentes: curiosidad, música y humor. Elegir un canal principal que Jay ya use; adaptar los mismos materiales a un segundo solo si cuesta poco. | Qué promesa genera interés real |
| Durante beta | Dos publicaciones semanales con escenas reales y avances pequeños; observar a 5 jugadores nuevos sin explicarles cada paso. Contacto individual solo autorizado. | Si entienden qué hacer y quieren regresar |
| Semana de salida | Un tráiler principal, tres clips reutilizados, enlace de compra visible y contactos aprobados. No anunciar antes de tener enlace y aprobación. | Si el interés se convierte en visitas y compras |
| Después de salir | Dos comunicaciones semanales como máximo al inicio; resolver dudas repetidas en la ficha/landing y atender incidencias. | Qué frena la compra o causa reembolsos |

Capturar visitas a landing/enlace de tienda con medios disponibles y consentimientos adecuados; empezar con estadísticas de Play y conteos manuales. Medir: visitas a ficha, compradores, ingreso real tras ajustes, reembolsos, fallos y preguntas repetidas. No hay todavía una tasa de conversión, audiencia ni volumen de ventas verificados; no proyectar ingresos como si los hubiera.

Si pocos llegan a la ficha, mejorar distribución o primer clip. Si llegan y no compran, revisar claridad, confianza, precio y papel de la web. Si compran y abandonan/reembolsan, priorizar la primera sesión y estabilidad. No bajar precio automáticamente por pocas ventas sin saber en qué paso se pierden.

## Precio y presupuesto

- Mantener US$2,99 como hipótesis inicial de pago único; revisar moneda/precio final por país. No añadir suscripciones, anuncios o pagos por chispas.
- Propuesta: promoción orgánica al principio. No autorizar gasto en anuncios en este plan. Si Jay decide una prueba pagada, fijar importe máximo y una métrica de compra antes de gastarlo.
- Google Play: registro de US$25 una vez; cuenta, verificación y datos deben pertenecer a Jay/editor real. [Alta oficial](https://support.google.com/googleplay/android-developer/answer/6112435). Ecuador figura como ubicación admitida para desarrollador/comerciante en USD; confirmar el país real del perfil, no inferirlo de la zona horaria. [Ubicaciones](https://support.google.com/googleplay/android-developer/answer/9306917).
- Las comisiones dependen de mercado/programa. Revisar elegibilidad e inscripción al nivel aplicable en Play; no tratar US$2,99 como ingreso neto. Impuestos, devoluciones y otros ajustes cambian lo recibido. [Tarifas](https://support.google.com/googleplay/android-developer/answer/112622).
- Apple Developer: US$99/año o equivalente local; no pagarlo todavía sin confirmar recursos y calendario iOS. [Membresía](https://developer.apple.com/help/account/membership/program-enrollment/).
- No publicar la aplicación de producción gratis «para luego cobrar»: Play indica que una app ofrecida gratis no se puede convertir después en app de pago con el mismo paquete. Planificar desde el principio el precio y el mecanismo de prueba permitido. [Precios oficiales](https://support.google.com/googleplay/android-developer/answer/6334373).
- Dominio, alojamiento extra, Mac/remoto y dispositivo prestado/comprado: importes sin aprobar. Reutilizar alojamiento e icono actuales mientras se decide; no comprar nada por este plan.

## Condiciones para decir «ya está a la venta»

- [ ] Nombre, editor, precio y papel de la web aprobados por Jay.
- [ ] Cuenta/verificaciones/pagos completos y producción habilitada.
- [ ] AAB release con firma adecuada y versión de producción; sin debug ni pruebas instrumentadas dentro de la app.
- [ ] Pruebas obligatorias y prueba humana en Android físico completadas; audio y copias de seguridad verificados.
- [ ] Candidato final sin fallos bloqueantes y comprobaciones requeridas para integración aprobadas. Reutilizar resultados válidos; no repetir toda la batería en cada tarea.
- [ ] Privacidad, clasificación, créditos, soporte, ficha y materiales coherentes con lo que realmente hace el juego.
- [ ] Tienda aprobada, precio/países y enlaces comprobados; autorización explícita de Jay para publicar.
- [ ] Una persona puede encontrar la ficha pública y comprar/instalar por la vía normal; registrar fecha real y país de comprobación. Una subida de rama, APK, AAB o revisión aprobada no equivale a ventas.

## Cómo usamos esta guía sin gastar de más

Al empezar una sesión: leer «Próxima acción» y los IDs implicados; trabajar en un bloque pequeño. Al terminar: actualizar estado/evidencia y dejar el siguiente paso. Jay conserva decisiones comerciales, cuentas, credenciales, compras, contacto con terceros y publicación. Codex prepara opciones, materiales, código autorizado y comprobaciones afectadas.

No añadir actividades, monedas, menús o sistemas nuevos para justificar el precio. No ejecutar todo el plan porque este documento exista. No crear otro backlog paralelo: mantener aquí tareas y decisiones, y enlazar los materiales finales. Los planes históricos no son autorización vigente.

**Próxima acción:** cerrar D01–D03: nombre, relación web/app y situación de Play Console. Después preparar un único paquete de identidad + textos de tienda, todavía sin publicar.

| Fecha | Decisión o evidencia | Consecuencia |
|---|---|---|
| 19 oct 2026 | Jay confirma haber jugado al APK en su emulador local; CI Android previo aprobado. | Base técnica de vista previa disponible; no certifica hardware físico ni tienda |
| 19 oct 2026 | Se propone este calendario y US$2,99; fechas y decisiones abiertas. | Android primero; iOS después; no hay autorización de publicación |

Fuentes oficiales consultadas el 19 de octubre de 2026. Revalidar al efectuar cada trámite; las reglas de tiendas y plazos pueden cambiar.
