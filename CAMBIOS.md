# Cuenta obligatoria y partidas separadas · alpha.57

- El mundo solo se inicializa después de acceder o retomar una cuenta previamente autenticada. Sin invitado ni demo; registro, confirmación y recuperación de clave disponibles en la entrada.
- Sesión persistente, revalidación online y continuación offline de una sesión anterior. Cerrar sesión o cambiar de usuario vuelve a la entrada; otra pestaña que cierre sesión bloquea también el juego.
- Partidas locales separadas por cuenta y mundo; el ámbito remoto existente no cambia. La partida antigua se copia una vez al propietario autorizado y nunca se borra.
- La página local de enlace distingue confirmación de correo y recuperación, validando ambos sin persistir tokens.
- Validación: 87 suites Node afectadas, auditoría, cuenta obligatoria con dos contextos, un recorrido de juego, shell offline bloqueado sin cuenta y enlaces locales. Auth/REST simulados en la aceptación; no se repitió audio ni navegador completos.
- Sin verificación de compra de tiendas todavía, publicación ni contratos nuevos. Los fixtures de componentes aíslan explícitamente la entrada; la aceptación de cuentas usa la entrada real con Auth/REST simulado.

# Cuenta y progreso automáticos · alpha.56

- Menú muestra Cuenta; se retiran Guardar copia y descarga de respaldo online del flujo visible. No hay acciones manuales para guardar ni recuperar durante el juego normal.
- Guardado automático de cambios cada cinco segundos y al pasar a segundo plano; al volver al otro dispositivo se sincroniza. Sesión persistente de alpha.55.
- Solo aparecen dos opciones si existen avances incompatibles en ambos dispositivos. El progreso local durante una lectura remota ya no se interpreta por sí solo como conflicto.
- Una copia remota vacía tampoco obliga a elegir frente a progreso local: se conserva el avance ganado automáticamente.
- Sin publicación, proveedores nuevos ni contratos.

# Acceso persistente y sincronización automática · alpha.55

- Sesión persistente entre pestañas/aperturas, renovación del token existente y cierre de sesión compartido. Migra una sesión anterior por pestaña sin guardar contraseñas.
- Primer guardado automático si no hay copia online; recuperación automática en un dispositivo sin progreso. Si ambas copias tienen avances, muestra Cuenta y respaldo y exige elegir, preservando los respaldos.
- Los controles de elección solo aparecen al resolver un conflicto; correo/clave siguen siendo el único método de acceso. Sin publicación ni servicios nuevos.

# Continuidad de guardado entre dispositivos · alpha.54

- Al entrar, volver a la pestaña o recuperar conexión se compara la partida con la última copia compartida. Si solo avanzó el otro dispositivo, se recupera automáticamente conservando el respaldo local anterior.
- Si ambos avanzaron, se detienen las escrituras automáticas; no se suman saldos ni se elige por fecha o por saldo mayor. La elección manual conserva la copia reemplazada.
- Comprobación remota cada 15 segundos y respaldo de cambios cada minuto; intento adicional al salir/ocultar la página. La entrega final depende de la conexión y de que iOS no suspenda el proceso.
- Validación: recorrido Chromium con dos contextos y regresiones de continuidad, conflicto, normalización y referencia antigua.
- Referencias antiguas requieren elegir copia una vez. Sin publicación, cambios de esquema ni servicios contratados.

# Recuperación local por enlace · alpha.53

- Enlace predeterminado de Supabase y página local para elegir clave, sin SMTP contratado ni publicación.
- URL limpiada, acceso validado y token solo en memoria; no toca la partida.
- Verificación: nueve suites Node afectadas, auditoría sin errores/avisos y dos recorridos Chromium enfocados aprobados. Solicitud de correo real HTTP 200; cambio privado pendiente de confirmación.
- Rama nueva desde main 20ebdf4; sin publicación ni SMTP contratado.

# Cambios recientes

## Conexión real a Kubono Dev Free · 19 de octubre de 2026

Proyecto `eghmydqxsicqmbmeprgq` conectado con clave publicable; esquema y permisos endurecidos en la organización Kubono Free, sin tocar CORESOLUTIONS. Alta/enlace/login/logout reales; PostgreSQL RLS entre dos usuarios y bloqueo anónimo; REST guarda/lee y conserva copia ante conflicto. Partida real Chromium de 102 campos validada tras ida/vuelta. Recuperación por código requiere SMTP para editar plantillas, aún no configurado; aviso de contraseñas filtradas pendiente. Sin publicación ni contratación; límites/evidencias en `docs/CUENTA_Y_RESPALDO.md`.

## Cuenta opcional y respaldo Supabase Free · 19 de octubre de 2026

Rama `feature/optional-cloud-save` desde main `ba9c31a`. Base local: correo/clave, códigos de verificación/recuperación, cierre y eliminación, copias por mundo con revisión y respaldo cada minuto después de elegir partida. Guardado local conservado, sin dependencias npm ni sesiones sociales inicializadas. Configuración pública vacía y esquema SQL sin aplicar; Jay elige otra organización, sin tocar CORESOLUTIONS ni contratar/publicar. Verificación: 8 suites Node afectadas, auditoría y recorrido nuevo Chromium con HTTP simulado aprobados; sin repetir toda la batería ni renders. Pruebas y límites en `docs/CUENTA_Y_RESPALDO.md`; servicio Supabase real, SQL/RLS/correo y dispositivos pendientes. Versión/caché sincronizadas a alpha.51 por cambio funcional, sin fecha de despliegue inventada.

## Decisiones comerciales de Kubono · 19 de octubre de 2026

Plan actualizado: nombre Kubono, dominio previsto playkubono.com sin compra y demo web confirmada. Registra alcance de búsquedas de marca, equipos disponibles, precios aprobados de US$2,99 móvil / US$4,99 escritorio y presupuesto inicial aprobado de US$350. Verificación de cuentas y equipos pendiente. Paquete común en espera; sin renombrar producto, modificar juego ni contratar servicios.

## Plan compartido de lanzamiento · 19 de octubre de 2026

`docs/PLAN_LANZAMIENTO.md` concentra marca, precio, web, cuentas, materiales, landing y comunicación. Corregido según decisión de Jay: preparación conjunta de Android, iOS/iPadOS, web/PWA y Windows/macOS/Linux, con salida independiente al estar cada plataforma lista y aprobada. Incluye Steam, evaluación de consolas, dependencias y ventana orientativa de ocho semanas por reestimar con recursos reales. Sin cambios de juego, versión o caché; no autoriza ports, gastos ni publicación.

## Android instalable de prueba · 19 de octubre de 2026

Rama `android/installable-preview` desde main `8e94612`. Contenedor Java/WebView con assets locales, icono existente, audio suspendido al salir, Atrás para cerrar paneles, importación por selector y exportación de blobs por un puente restringido al origen local y frame principal. Sin cambios de juego, música, recompensas ni dependencias npm. APK debug separado de la futura aplicación de pago; sin publicación ni clave de producción.

Compilación y prueba enfocadas en Actions: Android 15 emulado sin red, táctil/audio, menú/Atrás, Home/regreso, rotación y reinstalación conservando una compra y saldo. [CI Android aprobado sobre `7aeae6a`](https://github.com/Jaywrkr/WHITEDOT/actions/runs/39277322334): compilación y dos pruebas instrumentadas aprobadas (arranque/recuperación y reinstalación). Artefacto descargado a `outputs/android-preview/` fuera del repositorio; APK de 2.383.197 bytes, SHA-256 `2b44a7dd8bd2a070173a8f3ac33536ccc4dc27c6824deab1669212cd95dcc35d`, verificado localmente. Vídeo y cuatro capturas del emulador incluidos. Se corrigieron únicamente la selección de paquetes SDK obsoletos del action y la sincronización del documento nuevo en la instrumentación; no se repitieron suites completas. Contrato local verifica que todos los módulos y recursos originales se conservan sin cambios. Límites y prueba sin dispositivo en `android/README.md`.

## Suspensión, actualización y CI enfocado · 19 de octubre de 2026

Rama `fix/browser-lifecycle-closure` desde main `8553298`. Sin cambios de producto, música, versión ni caché. Regresión con congelación/descongelación real de Chromium, interrupción de AudioContext, recuperación por gesto, transporte acotado, posición/saldo y silencio persistente. Actualización PWA desde el código real alpha.49 (`8924f16`) al actual: saldo, compras, equipo, meta, logros, diez cristales e identidad conservados; activación explícita, recursos coherentes y offline.

CI anterior `39178363929`: lógica, audio 1/3 y 124/127 recorridos aprobados. Corregidas preparaciones de los tres recorridos fallidos: foco nativo para responder a la lección, verificar la misma criatura por ID y distinguir pulsos del jugador de la cola ambiental en A/B. Contrato de percusión acepta rim, presente en la familia jazz/bossa actual, conservando exigencias de mezcla y transporte. Nueva ejecución enfocada de Actions solo para esta rama: dos contratos Node, auditoría, suspensión/actualización, tres recorridos fallidos y audio fallido más los cuatro renders no alcanzados por la interrupción anterior. No sustituye ni cambia los checks completos requeridos para integrar.

Validación local aprobada: cinco recorridos enfocados, dos contratos Node y auditoría sin errores/avisos usando bytes originales de licencias Git (CRLF local restaurado). Sin certificar suspensión del sistema operativo móvil ni dispositivos físicos. CI enfocado aprobado sobre `03bd690`: [ejecución 39272406574](https://github.com/Jaywrkr/WHITEDOT/actions/runs/39272406574), incluidos cinco renders/suites de audio pendientes. La actualización de esta evidencia no repite CI por el filtro de documentación. Los checks completos históricos siguen conservados y se exigirán al integrar; esta ejecución es enfocada. Sin PR, merge ni Android.

## Revisión enfocada de navegador · 18 de octubre de 2026

Sobre `0752b5c`, sin cambios de juego, contenido, audio, versión ni caché. Corregida una carrera en `first_level_smoke.py`: cerrar el saludo explícitamente y esperar la visibilidad del texto, que los avisos temporales ocultan por diseño. Conservadas todas las aserciones.

Chrome local: aprobados `first_level_smoke.py` (320/390/844 y visitante compartido), `menu_v2_smoke.py` (320/390/844), `release_closure_smoke.py` (320/390/844/1280), `sparks_economy_smoke.py` y `offline_smoke.py` (240 módulos). Cubren entrada real, contacto/pulsos, menús, compras/reembolsos, logros y persistencia tras recargar. Auditoría: cero errores y avisos al comparar licencias con sus bytes Git originales; conversión CRLF local restaurada sin cambios de licencia.

Audio enfocado: funk y dub, renders densos de 20 s; jazz, afro, folk y cámara, renders de 5 s con las mismas aserciones del test existente; 44,1/48 kHz, sin clipping ni campana de pista en esas muestras. Camino quieto de 30 s sin campana/glass automáticos. El intento original de seis renders largos alcanzó el límite local de 145 s tras dos aprobados; no se presenta como suite completa. Evidencia local en `work/browser-closure-focused-rest.json`, `work/browser-closure-intro.log` y `work/music-families-audio.json`, fuera del repositorio. No se repitieron Node/navegador/audio completos. Pendientes de certificación: CI de rama (no se dispara para este nombre), dispositivos físicos, escucha humana, suspensión real del navegador, migración entre versiones y transiciones largas. Sin Android, PR, merge ni despliegue.

## Cierre de claridad y descubrimiento

Rama `polish/release-closure` desde `main` actualizado `8924f16`. Cristales con mayor contraste y fragmentos recogibles más legibles, conservando posiciones, golpes, tamaños de cristal, escapes, premios y radios de recogida. El HUD identifica el saldo como chispas. Saltar conserva su desbloqueo y coste existentes. Corregido el inicio de audio del laboratorio con sonido desactivado y el cierre de conexiones SQLite del servicio opcional, conservando commit/rollback; sin modificar rutas ni el 404 del alojamiento estático.

Los logros nuevos y anteriores usan avisos breves, silenciosos y agrupados en la cola existente. Bitácora marca los logros sin consultar; leer Logros reconoce el registro guardado, con reversión ante fallo de escritura. Las partidas previas no reciben avisos por logros ya ganados. Una única pista dorada anticipa una travesura cercana sin textos, sonido, premios ni cambios de distribución.

Pruebas históricas del Mundo actualizadas al requisito de diez cristales mediante una preparación compartida; se conservan sus aserciones funcionales y la minería real tiene sus recorridos dedicados. Versión alpha.50 con sellado/caché existentes. Resultados finales y límites en `scripts/release-closure-validation.json`. 175 suites Node, 127 recorridos Chrome y arranque offline con 240 módulos aprobados; auditoría sin errores/avisos. El audio completo se inició y se detuvo por coste/tiempo señalado por Jay; no se certifica completo. Sin certificar CI de esta rama, dispositivos físicos ni escucha física.

## Travesuras del universo y 120 logros nuevos

Rama `feat/universe-mischief` desde main actualizado `9d92778`. Diez encuentros ocasionales: cristal ayudante, imitador torpe, lluvia ascendente, ladrón de sombras, público/procesión, escultura bailarina, carrera amistosa, paisaje contenido, copia de fragmentos y despedida encadenada. Movimiento/contacto sin botones nuevos; el cristal grande conserva la minería por pulsos existente. Esculturas y cristales objetivo son reales. La procesión puede orbitar o llegar a una escultura para celebrar; copia y despedida acompañan el viaje continuo.

Cada lugar da tres chispas una sola vez, con reclamación y saldo guardados juntos, rollback y reintento acotado. Una escena y caché de 48 celdas; sin progreso por paseo automático, menús, laboratorio o previews. Pausa, textos opcionales y movimiento reducido conservados. Las escenas interrumpidas se reinician; las reclamaciones y logros persisten. Hasta 4096 lugares premiados; después se puede seguir jugando sin pagos nuevos.

120 logros originales añadidos al catálogo anterior (370 registrados, incluido el retirado): 40 hitos de encuentros distintos, 30 actividades, 20 hallazgos, seis esculturas, 14 de variedad y diez secretos. «Abogado de las piedras», «Después de usted», «Festival sin permisos» y otros. Reconoce progreso anterior de actividades/hallazgos sin repetir sus pagos. Guardado de nuevos logros en lote con reversión ante error; sin avisos ni moneda adicional. Guía y catálogo actualizados. Alpha.49 con el sellado existente.

Verificación: 174 suites Node completas; 240 soluciones de escenas, los diez secretos alcanzables y compatibilidad de partidas anteriores. Diez escenas naturales completadas por teclado/contacto en Chrome, minería real, vuelta a escultura y persistencia tras recarga; regresiones adicionales de procesión orbital y viaje continuo. Menús en 320/390/844/1280 px y offline con 240 módulos. Cuatro renders densos alternando 44,1/48 kHz, pico 0,876539 sin saturación. Auditoría, comandos y límites en [el informe](scripts/universe-mischief-validation.json). Adaptador externo Windows para python3. Sin certificar suites completas de navegador/audio, CI, despliegue, dispositivos físicos ni escucha física.

## Identidad musical, campanas y controles nuevos

Rama `fix/music-identity-menu` desde main actualizado `4c5c237`. Eliminadas las llamadas automáticas fijas de campana/cristal de float, heart y ambient. Las voces metálicas ambientales tienen un límite compartido por región de una cada ocho compases; las pistas, gestos y celebraciones conservan sus notas. Traza opcional de instrumento/origen/tiempo para verificar las rutas. No se garantiza identificar un sonido subjetivo sin una grabación del usuario; se corrigieron las rutas reproducibles encontradas.

Seis familias originales amplían la reproducción de géneros compatibles: funk/disco, dub/reggae, jazz/bossa, afro/latino, folk/cuerdas y ambient/cámara, con bajos, motivos, percusión, progresiones, articulaciones y descansos propios. Buscables por nombre en Viaje musical. Sin nuevos IDs de género ni cambios de mapas, BPM, escalas, guardados, volúmenes maestros o duetos. La referencia histórica se comprueba intacta por separado; los estilos ampliados cambian su arreglo de producción deliberadamente.

Regalos de Tu cubo con retrato, nombre corto, contador y estados de vista previa/equipado. Ajustes distingue textos del paisaje, La Voz y datos del mundo. Corregido checkbox estirado por reglas generales, que desbordaba en 320 px; etiquetas de familias adaptables. Versión alpha.48 mediante sellado existente.

172 suites Node completas y regresiones enfocadas; 6.144 compases deterministas, rutas reales de síntesis y seis notas de celebración conservadas. Seis renders densos de veinte segundos alternando 44,1/48 kHz, pico máximo 0,915755 sin saturación, y Camino de treinta segundos sin campana/cristal automático. Chrome en 320/390/844/1280 px: regalos vacíos/completos, equipo, rollback, recarga, búsqueda y diez paneles; offline con 236 módulos. Detalle de auditoría y comandos en [el informe](scripts/music-menu-validation.json). Adaptador externo de Windows para python3. Sin certificar suites completas de navegador/audio, CI, despliegue, dispositivos físicos ni escucha física.

## Hallazgos musicales y actividades del universo

Rama `feat/rare-musical-wonders`, dependiente de `b8166c0` (pulido del cubo y cristales); main remoto observado `290cd2f`. Seis esculturas dieciséis veces más raras, con celebraciones iniciales y repetidas. Veinte hallazgos con tarjeta, adorno cosmético equipable y frase musical original; treinta actividades procedurales de movimiento/contacto, con cinco chispas una vez por lugar. Catálogo en [hallazgos y actividades](docs/HALLAZGOS_Y_ACTIVIDADES.md). Semillas independientes, progreso persistente y reversión de premios ante fallos de escritura.

Ajustes permite ocultar textos del universo sin ocultar controles ni avisos de guardado. El Camino admite roturas después de diez sin puntos adicionales. Reducida la campana automática repetitiva; respuestas manuales conservadas. Corregida la transformación visual duplicada de la superficie del cubo. Publicación alpha.47 mediante sellado existente.

Verificación: 171 suites Node completas, 97 afectadas, 360 soluciones de actividades, recorridos Chrome de hallazgos/equipo y actividad por teclado, y arranque offline con 235 módulos. Veinte frases en cinco mezclas densas a 44,1/48 kHz: pico 0,882477, sin saturación; Camino de treinta segundos sin campanas automáticas. El ejecutable python3 de las pruebas antiguas se resolvió mediante adaptador externo de Windows. Auditoría, comandos y límites en [el informe](scripts/rare-universe-validation.json). Sin certificar suites completas de navegador/audio, CI, despliegue, dispositivos físicos ni escucha física.


## Respuesta visual del cubo y cristales

Rama `polish/cube-crystal-feedback` desde main `290cd2f`. Cubo con inclinación suavizada al caminar, deformación de arranque existente y compresión breve al pulsar, en Camino y Mundo. La superficie sigue la misma transformación que el cuerpo. Pausa, inspección, cambio de capa, teletransporte y movimiento reducido eliminan la pose añadida.

Cristales con retroceso visual de menos de dos píxeles y esquirlas decorativas al impactar/romperse: hasta 48 respuestas, de 0,48 segundos, sin alterar fragmentos recogibles, posición real, golpes, cadenas, pagos, sonido ni guardado. La rotura emite 4–6 esquirlas según tamaño; no se añaden partículas móviles con movimiento reducido. Versión alpha.46 con el mecanismo existente.

Regresiones Node sobre hooks Canvas reales, estado intacto al dibujar, caducidad, pausa y movimiento reducido; recorrido Chrome en móvil/escritorio con movimiento y pulsos reales, cristal natural de dos golpes y pago de tres chispas. Auditoría y suites afectadas registradas en `scripts/cube-crystal-feedback-validation.json`. Sin certificar CI, despliegue ni suites completas de navegador/audio; audio intacto.

## Integración del recorrido, menús y guía

Rama `fix/unified-game-loop` desde main `97f0729`. El Camino mantiene su objetivo único de diez cristales; la meta opcional aparece en el Mundo, indica cuándo hay saldo para saltar y reconoce compras, conjuntos e hitos cumplidos. El panel de chispas explica cómo obtenerlas y respeta saldo y bloqueos del viaje. Los logros del Mundo no absorben distancia acumulada en el Camino o en pausa. Precios, premios, distribución, mapas, música y formatos de guardado conservados.

Menú agrupado con cuatro accesos principales y una sección para el espacio/progreso personal. Paneles con cabecera/cierre accesibles, controles táctiles, campos legibles, filas adaptables y estados uniformes. Guía diferenciada de Tu recorrido, instrucciones reales de cristales, tótems, chispas, tarjetas y copia de seguridad. El tutorial muestra cristales rotos y recuerda el pulso aprendido en el Camino; no vuelve a exigirlo al explorar. Intro breve existente, omitible, con `.simple`. Sin pantallas, monedas ni catálogo nuevos. Versión alpha.45 mediante sellado existente.

Prueba real del ciclo completo aprobada: Camino, tótem/tarjeta, fondos obtenidos por minería, compra/equipo, salto pagado, vuelta gratuita y persistencia. Paneles comprobados en 320/390/844/1280 px, teclado y movimiento reducido. Offline: 227 módulos. Diez suites Node afectadas y auditoría aprobadas. `npm test`: 168 suites aprobadas con adaptador externo de Windows que resuelve `python3` al ejecutable `python` instalado. El primer intento sin adaptador se detuvo por ese nombre ausente; no se modificó ni omitió ninguna prueba. Sin renders de audio (sonido intacto), suites completas de navegador/audio, CI, dispositivos físicos ni despliegue. Detalles en `scripts/unified-game-validation.json`.

## Pruebas locales más rápidas

`test:impact` ejecuta hasta dos suites Node en paralelo y reutiliza aciertos durante una hora solo con los mismos archivos, runtime y entorno. Un cambio invalida toda la caché por seguridad; los fallos se repiten y detienen nuevas tareas. Resumen y reporte distinguen ejecución y reutilización. Opciones `--no-cache` y `--jobs 1`. Sin cambios en juego, versiones, suites completas ni CI.

Regresión con procesos reales: concurrencia, reutilización, invalidación por huella, caducidad, ejecución forzada, fallos y señales. Tres suites afectadas aprobadas: 6496 ms sin caché y 3022 ms reutilizando las tres. Auditoría sin errores/avisos y diff revisado. Corregida importación de la prueba de publicación en Windows mediante file URL. No se ejecutaron suites completas de navegador/audio ni CI; el juego no cambia. Comandos: `node scripts/test-impact.mjs --base af47928 --no-cache`, repetición sin `--no-cache`, y `npm run audit:release`.

## Tótems de esculturas de color

Rama `feat/sculpture-totems`, dependiente de `9889252`; main remoto observado `81856a3`, con las entregas previas pendientes. Seis siluetas/degradados inspirados en la referencia visual de Jay: torres violetas, reloj verde, esfera de ámbar, rombo azul, botella rosa y aguja de cobalto. Dibujos Canvas y retratos SVG, sin imagen externa, dependencias ni otro menú.

Encuentros poco densos en celdas de 1400 unidades: 24% ocupadas, generalmente solitarios y algunos grupos de dos o tres. Semillas independientes en superficie, bajo y cielo; mapas originales intactos. Tres pulsos despiertan la torre; acompañar el remate desprendido lo devuelve; los alargados señalan un cristal o escultura real cercana. Abandonar la esfera la devuelve sin penalización. Respuestas visuales breves, sin interacción por paseo automático. Movimiento reducido usa poses estáticas.

Cada forma nueva guarda su tarjeta en el libro existente. Cada lugar da 2 chispas una vez al día, hasta 64 lugares diarios; pagos persistentes y reversión en fallos de escritura. Repetir sigue permitido sin duplicar premios. Los grupos responden con hasta tres voces nativas espaciadas en la cuadrícula musical y niveles bajos; no se reescribe composición, mezcla ni síntesis. Módulos incluidos una sola vez en el shell; publicación mediante el sellado existente.

Auditoría sin errores/avisos y 93 suites Node afectadas aprobadas. Recorridos Chrome en 390/1280 px, tarjetas coloreadas reales, pagos únicos tras recarga, compatibilidad de economía y offline con 227 módulos. Tres renders con las seis voces sobre mezclas densas a 44,1/48 kHz: pico 0,882648, sin saturación. Diff y capturas revisados. Comandos, huellas y límites en [el informe](scripts/sculpture-totems-validation.json). Sin certificar suites completas de navegador/audio, CI, dispositivos físicos ni despliegue.

## Cristales juguetones y chispas visibles

Rama `feat/playful-crystal-sparks`, dependiente de `6fd8ec6` (entregas anteriores aún pendientes en main remoto `81856a3`). Fragmentos con esquirla de centro blanco, halo, flotación lenta y estela corta. Contador de 14 px, saldo dorado y +✦ hacia él; destello de recogida, grietas más visibles y aviso/luz única al alcanzar el primer salto disponible.

En el Mundo, aproximadamente uno de cada ocho cristales puede soltar un fragmento cian con estrella y bono de 3 chispas. Escapa durante dos segundos hasta 100 unidades y queda disponible; se recoge al acercarse a 32 unidades. Algunos cristales medianos/grandes corren al primer golpe, con patas y rastro breve, durante dos segundos hasta 90 unidades. Sin penalización por dejarlos: se detienen. Los fragmentos normales mantienen radio 70. Con movimiento reducido no hay persecución ni vuelo; todos conservan alcance 70 y sus premios.

Romper un cristal del Mundo envía una onda de radio 240, un impacto por vecino y hasta ocho impactos adicionales por cadena inicial. El Camino conserva sus diez cristales sin cadenas ni persecuciones. Solo los pulsos manuales inician minería; paseo automático no recoge. Reparto normal total 1/3/5, más el bono raro cuando corresponde; cada fragmento cobrado se guarda por separado, con rollback de escritura y sin duplicación al recargar. Sin premio retroactivo en cristales antiguos agotados. Hash nuevo independiente, misma retícula y mapas.

El paisaje modula suavemente su brillo cercano con el beat real existente. No añade sonido ni cambia composición, mezcla, física o controles. Se desactiva con silencio, pausa y movimiento reducido. Shell actualizado una sola vez para el módulo nuevo; sellado de versión/caché existente.

Auditoría sin errores/avisos, 87 suites Node afectadas y pruebas Chrome de persecución/bono, guardados, economía, Camino, intro/salto y offline aprobadas. Diff y capturas revisados. Comandos, huellas y límites en [el informe](scripts/crystal-play-validation.json). No se certifican suites completas de navegador/audio, CI, dispositivos físicos ni despliegue.

## Salto ganado e intro visible

Rama `fix/earned-jump-and-intro`, dependiente de la limpieza documental `7f77842` y de la entrega de chispas aún no integrada en main remoto `81856a3`. Al acumular 20 chispas ganadas aparece Saltar en el dock. Permanece visible tras gastar y recargar; sin saldo suficiente se desactiva. Cada salto conserva el coste de 20 y el regreso gratuito. El menú mantiene su propio control, sin duplicar IDs ni sobrescribir el botón principal.

La intro ya no se omite por tutorial pendiente o primera visita: frase y `.simple`, cierre automático a los 2,4 s o por toque/Escape. Al cerrar se recupera la primera guía, sin saltarse sus pasos. Movimiento reducido sin animación de sistema; sin cambios musicales ni de progreso. Versión y caché mediante el sellado existente.

Verificación: auditoría sin errores/avisos; diez suites Node afectadas aprobadas. Regresión Chrome de entrada, firma legible, guía pendiente, minería manual de la chispa 20, salto cobrado, botón persistente, recarga y regreso gratuito en 320/390/844/1280 px; además movimiento reducido. Compatibilidad de viajes, economía y regreso, más diez roturas reales del Camino, probadas por separado. Comandos y huellas en [el informe](scripts/entry-jump-validation.json). Pruebas enfocadas; sin suite completa, audio nuevo, CI ni despliegue certificado.

## Documentación consolidada

Cuatro documentos en la raíz y tres guías operativas en `docs/`. Planes, cierres, inventarios y handoffs anteriores se conservan en [historial](docs/historial/README.md), sin autorizar trabajo nuevo. README y mapa técnico reflejan las chispas; las instrucciones ya no declaran varios ciclos vigentes. Créditos distinguen cliente local de servidor opcional. Sin cambios del juego, versión ni caché.

Validación: auditoría de publicación, contrato de actualización de versión, selección de pruebas afectadas, enlaces de guías vigentes y revisión de diff. La evidencia histórica conserva sus revisiones originales; no implica CI ni despliegue actual.

## Chispas · economía, recorrido y avisos

Rama `feat/sparks-progression`, desde main remoto `81856a3`. Primera etapa del plan acordado: una moneda por partida, saldo conservado, total ganado/gastado y minería diaria persistente. Daño, rotura y recogida se guardan; ni recargar ni volver al mismo cristal duplica el pago. Las operaciones revierten saldo/propiedad si falla la escritura, y el salto guarda destino y coste juntos. Las demostraciones no generan saldo; sus tarjetas se marcan como muestras. Se conservan formatos futuros y el progreso anterior.

Saltar sale del dock y pasa a Menú → Viajar y chispas: 20 chispas, regreso gratuito. Compras permanentes con vista previa y equipar/quitar: Polvo viajero 40, Pulso facetado 80, Órbita personal 150. Son capas visuales adicionales; conservan las apariencias ganadas, la física y el alcance del pulso. Tres colecciones retroactivas pagan una vez: Primera banda (+15), Vecinos extraños (+15), Pequeñas maravillas (+25). Ocho logros secretos, hitos de 1/5/10 km, títulos elegibles, historial y una meta opcional bajo el saldo. Distancia caminada existente, sin sumar teletransportes ni pagar monedas por estar inactivo.

Dos formas de aviso: delta agrupado junto al saldo durante 1,5 s y tarjeta breve (~3 s), una a la vez. Los duplicados no interrumpen. Los hallazgos permanecen en el libro; abrir detalles es una decisión del jugador. Los problemas de guardado quedan visibles hasta recuperarse o abrir su atención. Cajas originales de 20 s; sorpresas de 10–20 s; sin acumular duraciones. Indicadores y Deshacer; compartir/leer conserva acceso explícito. Sin nuevos sonidos de interfaz ni cambios de síntesis/composición.

Validación: auditoría sin errores/advertencias; 106 suites Node afectadas; pruebas de economía/rollback, minería tras recarga, compra/equipamiento, salto y regreso, metas, tarjetas sin pausa, cajas/Deshacer y tres tamaños. Seis renders de celebración a 44,1/48 kHz, pico 0,882635. Simulación reproducible de tres recorridos de diez minutos: 31/90/129 chispas; precios iniciales, no medición con jugadores. Comandos y límites en scripts/sparks-progression-validation.json; revisión visual y diff sin errores. Adaptaciones Windows de ESM/licencias y Playwright externo sin dependencias nuevas del juego. No se certifican suites completas de navegador/audio, CI ni despliegue. Jay conserva PR/merge.

Límites: libro de minería diario de hasta 8192 sitios; saldo local de cada partida, sin validación remota ni intercambio. Destellos y constelación personal corresponden a la ampliación posterior acordada.

## Cristales · distribución, Camino y entrada directa

Rama `feat/crystal-path-entry`, desde main `d404b52`. Cristales facetados con relleno tenue y caras interiores; una retícula independiente separa sus posiciones y regiones de 1200 unidades alternan abundancia escasa, media y alta. Se conservan los tres tamaños, impactos y valores del Mundo.

El Camino conserva su trazado y cambia sus luces recogibles por cristales pequeños. Diez cristales distintos rotos por pulso manual completan la entrada diaria; el décimo entra automáticamente, sin botón ni bienvenida del Mundo. Cada rotura cuenta una vez y aporta una chispa; el progreso parcial se guarda, no se duplica tras recargar y se reinicia al cambiar de día. Las luces antiguas no abren esta puerta. Las partidas antiguas que ya estaban dentro del Mundo conservan el acceso; regresar voluntariamente al Camino no fuerza otra entrada. Las vistas de prueba por semilla mantienen su acceso directo.

Firma literal `.simple` después de la frase de regreso y en la primera bienvenida. El contador pasa de Canvas a un elemento debajo de la distancia, alineado y adaptable al área segura en móvil, horizontal y escritorio. Sin cambios de audio; caché mediante el sellado de publicación existente.

Verificación: `npm run test:impact -- --base d404b52`, 87 suites afectadas aprobadas; `node tests/crystal-path.mjs` y `node tests/crystal-sparks.mjs`, incluyendo migración, densidad, separación, diez roturas únicas y regreso al Camino. `npm run audit:release` sin errores/advertencias; recorridos Chrome `tests/crystal_path_smoke.py` y `tests/crystal_sparks_smoke.py`, revisión visual y `git diff --check`. Entorno Windows con adaptación ESM y licencias originales para auditoría, fuera del commit. Pruebas enfocadas; sin suite completa navegador/audio, aceptación física ni despliegue certificado. Jay conserva PR/merge.


[Historial completo anterior](docs/historial/CAMBIOS_ANTES_CONSOLIDACION.md). Las entradas antiguas describen su revisión; la persistencia diaria actual sustituye el reinicio de cristales por sesión.
