# Kubono · plan hasta las primeras ventas

**Estado: 20 de octubre de 2026.** Guía única de decisiones y entregables D01–D22. Preparar no autoriza ejecutar el catálogo completo, pagar o publicar. Jay pidió detener la configuración de Supabase y preparar documentación para revisión con Claude. [Traspaso actual](../HANDOFF_CLAUDE.md).

## Decisiones aprobadas y límites

| Tema | Estado vigente |
|---|---|
| Marca | Kubono; dominio previsto `playkubono.com`, no comprado/reservado. Repositorio, paquetes y parte del producto conservan WHITEDOT; implementación completa de marca pendiente |
| Identidad | Propuesta local aprobada: negro/blanco y violeta eléctrico en identidad/web, sin cambiar los colores del juego. Maqueta/plan funcional local fuera de Git en `outputs/kubono-visual/`; no publicado |
| Promesa | Un cubo y un universo que suena. La música electrónica y su mezcla con otras familias son parte central de la comunicación |
| Modelo | Pago único US$2,99 móvil / US$4,99 escritorio, sin anuncios, suscripciones ni venta de chispas. Precios locales y licencia/recibos por tienda pendientes |
| Presupuesto | US$350 iniciales aprobados; no autoriza compras ni altas de pago. Tasas anotadas previamente: Play 25, Apple 99/año, Steam 100 por juego, antes de impuestos/conversión; revalidarlas al tramitar |
| Acceso | **Cambio aprobado por Jay el 22 de octubre ([El Viaje](VIAJE.md)):** cuenta opcional. Se juega con guardado local desde el primer toque; la cuenta se ofrece después para guardar en la nube y migra el progreso local. Hasta que se construya (Fase 2), el código sigue con cuenta obligatoria. Sin demo comercial; el build de festival es un recorte privado para jurados |
| Plataformas | Preparación conjunta Android, iOS/iPadOS, web/PWA y Windows/macOS/Linux; cada una sale al estar lista/aprobada. Consolas solo evaluación, sin port/fecha prometidos |
| Público | Objetivo de 16 años o más; clasificación de contenido por tienda aparte. Mercados, país/editor y correo público aún pendientes |
| Datos | Plazos aprobados en [Producción](CONFIGURACION_PRODUCCION.md); algunos controles aplicados, otros pendientes. No equivale a privacidad/configuración final publicadas |

La revisión inicial de marca del 19 de octubre encontró una coincidencia china de clase 4 (aceites/lubricantes), sin registro europeo encontrado en las consultas y sin resultado en Madrid Monitor. Global Brand Database no fue accesible; búsqueda fonética SENADI pendiente. No es certificación jurídica ni disponibilidad actual del dominio. [Registro de consultas y fuentes](historial/PLAN_LANZAMIENTO_ANTES_REVISION.md).

Cuenta compartida y guardado automático no conceden cross-buy. La sincronización está comprobada entre navegador, Safari iPhone y APK emulado; no afirmar aceptación iOS nativa, desktop, compras o tiendas.

## Estado por plataforma

| Frente | Hecho | Pendiente principal |
|---|---|---|
| Android | APK debug de cuentas y firma estable, migración/actualización emulada conservan sesión/saldo | Firma y AAB de tienda, cuenta/verificación, Android físico y pruebas de distribución |
| iOS/iPadOS | Juego web probado en Safari de iPhone; Jay tiene Mac/iPhone | Recursos/modelos/compatibilidad, membresía si decide contratar, proyecto iOS, TestFlight/App Review; iPad si se anuncia |
| Web/PWA | Cliente existente y recorrido de cuenta comprobado en pruebas locales | Papel comercial/entitlement web, dominio/landing, correo/callbacks/privacidad públicos. No implementar cobro propio sin decidirlo |
| Windows/macOS/Linux | Cliente reutilizable; emulador Android en PC no cuenta como port desktop | Ruta mínima de empaquetado, builds, firma/distribución y pruebas en cada sistema anunciado |
| Steam/itch.io | Material base reutilizable | Cuenta/condiciones/ficha/build de Steam; itch.io como canal complementario aún por decidir |
| Consolas | Concepto compartido | Acceso a programas, viabilidad, controles y presupuesto antes de comprometer nada |

## Entregables vigentes

Los IDs se conservan para el tracker local. Los criterios siguientes sustituyen los que hablaban de demo, cuenta opcional o respaldo manual.

| ID | Entrega | Estado y siguiente condición |
|---|---|---|
| D01 | Nombre/dominio, editor y revisión de marca | Nombre/dominio previsto decididos; editor/contacto y evaluación legal pendientes |
| D02 | Precio, países, idiomas y papel comercial web | Precios/pago único/sin demo aprobados; países, idiomas y venta web pendientes |
| D03 | Cuentas Play, contacto/pagos y Android físico | Sin confirmación de alta final ni acceso físico verificado |
| D04 | Firma/paquete Android de producción y AAB | Firma de vista previa resuelta; release/identificador/versionCode/custodia comercial pendientes |
| D05 | Instalación/actualización y comportamiento Android físico | Emulador aceptado; distribución y dispositivos físicos pendientes, sin repetir pruebas emuladas sin cambio |
| D06 | Privacidad, edades, clasificación y formularios | Borradores y decisiones aprobadas; datos legales/correo, controles pendientes y formularios de tiendas por completar |
| D07 | Fichas ES/EN y requisitos reales | Borradores ES/EN en [Material de tienda](TIENDAS.md); la ficha EN dice que el juego está en español. Pendiente aprobación y requisitos de cada tienda |
| D08 | Icono y recursos de tienda/capturas reales | `scripts/store-media.py` genera capturas reales (Play, App Store, Steam), iconos y gráficos; falta rehacer gráficos con la identidad violeta (fuera de Git) y aprobarlos |
| D09 | Tráiler y clips con música original del juego | Clips con audio real del juego y guion en [Material de tienda](TIENDAS.md); montaje final pendiente |
| D10 | Landing y enlaces/soporte/privacidad | Maqueta/plan local existen; landing pública no publicada ni dominio comprado |
| D11 | Press kit pequeño con medios/contacto/enlaces | Borrador en [Material de tienda](TIENDAS.md); faltan editor, contacto y enlaces |
| D12 | Creadores/comunidades y borradores personalizados | Pendiente; foco exploración y música electrónica/cultura musical. No enviar mensajes ni comprar listas |
| D13 | Prueba cerrada y acceso a producción Play si aplica | Pendiente de cuenta/reglas aplicables; emulador/sideload no sustituyen distribución exigida |
| D14 | Candidato y autorización de salida por canal | Pendiente; cerrar checks/correcciones necesarias y precio/enlaces reales antes de publicar |
| D15 | iOS/iPadOS y distribución | Pendiente; sin proyecto iOS ni aceptación nativa |
| D16 | Builds desktop por sistema | Pendiente; sin builds aceptados |
| D17 | Steam y decisión itch.io | Pendiente; no se ha pagado una tarifa por esta preparación |
| D18 | Web/PWA coherente con compra y cuentas | Pendiente de decisión comercial y configuración pública; sin demo |
| D19 | Evaluar viabilidad de consolas | Sin viabilidad confirmada; no ejecutar port |
| D20 | Cuenta/correo/recuperación/eliminación | Núcleo y enlaces locales comprobados; destino de recuperación configurable y borrado local del dispositivo solicitante en código (alpha.59); correo, página pública y valor final de `recoveryUrl` pendientes |
| D21 | Continuidad automática y conflictos | Aprobado funcional PC/Safari iPhone/APK emulado; no reabrir salvo cambio o fallo concreto. Plataformas finales en D05/D15/D16 |
| D22 | RLS, operación, retención, respaldo y cierre final | RLS/CAS y evidencia de cuentas aprobados; CI de navegador en rojo en `main` con fixtures corregidas en rama pendiente de PR; retención Supabase, respaldo completo/restore, soporte y producción pendientes. Trabajo Supabase detenido |

## Secuencia y calendario

1. **Ahora:** revisar con Claude un detalle concreto, usando la documentación vigente y el código. No continuar autenticación ni SQL pendientes durante esta revisión.
2. **Al autorizar reanudación:** completar datos del responsable/país/mercados/correo; resolver escritura Supabase y operación de datos; definir correo/callbacks finales. No contratar automáticamente.
3. Preparar paquetes y materiales compartidos, conservando prioridad paralela por plataforma. Validar solo lo nuevo/afectado y registrar evidencia específica de cada canal.
4. Candidato por canal: formularios, precio, firma, pruebas exigidas y experiencia humana real. Publicar solo tras aprobación/autorización explícitas; no esperar a que todas las plataformas estén aprobadas el mismo día.

La ventana original de ocho semanas (19 oct–13 dic 2026) es una **estimación histórica no revalidada**, no un compromiso de salida. Reestimar al confirmar recursos, cuentas y bloqueos; no añadir funciones para justificar retrasos. [Plan anterior](historial/PLAN_LANZAMIENTO_ANTES_REVISION.md).

## Comunicación y venta

Propuesta: mostrar primero una acción del cubo y su respuesta visual/musical. Tres mensajes: explorar un universo sonoro, romper/recoger y avanzar, descubrir escenas/actividades raras. La electrónica no debe desaparecer de la identidad; mostrar cómo se mezcla con otras familias sin atribuir grabaciones ajenas.

Recorrido: clip real → landing clara → ficha de plataforma disponible → compra. Sin demo, promesas de cross-buy, publicidad contratada ni contacto automático. Medir dónde se pierde interés antes de bajar precio o ampliar contenido. Tráiler/press kit/cuentas sociales siguen sujetos al bloque que Jay autorice.

## Condición para declarar una salida

Paquete release y firma correctos; acceso/avance/eliminación y correo público coherentes; obligaciones y revisión de la tienda satisfechas; experiencia humana en sistema anunciado; precio/países y enlace comprables; autorización explícita de Jay. Commit, CI verde, APK o aprobación de una maqueta no equivalen a ventas.

Referencias de trámites consultadas previamente: [Google Play pruebas](https://support.google.com/googleplay/android-developer/answer/14151465), [Play datos](https://support.google.com/googleplay/android-developer/answer/9866151), [Apple revisión](https://developer.apple.com/app-store/review/guidelines/), [Steam salida](https://partner.steamgames.com/doc/store/releasing). Revalidar las reglas al realizar el trámite; esta revisión es documental, no una nueva comprobación comercial/legal.
