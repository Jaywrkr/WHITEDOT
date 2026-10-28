# Kubono · plan hasta las primeras ventas

**Revisión:27 de octubre de 2026.** Guía única de decisiones y entregables D01–D22. El 27 de octubre Jay decidió salir primero en **web y Android**, con cobro, en **español e inglés** y **a su nombre personal**; el plan está en [Salida web y Android](#salida-web-y-android). Preparar no autoriza pagar ni publicar: cada alta, pago y publicación los hace o autoriza Jay. [Traspaso actual](../HANDOFF.md).

## Decisiones aprobadas y límites

| Tema | Estado vigente |
|---|---|
| Editor | **A nombre personal de Jay (27 de octubre).** Nombre legal y correo público de contacto pendientes |
| Marca | Kubono; dominio previsto `playkubono.com`, no comprado/reservado. Marca visible Kubono; repositorio, paquetes y claves conservan WHITEDOT por compatibilidad. Dominio/revisión legal pendientes |
| Identidad | Propuesta local aprobada: negro/blanco y violeta eléctrico en identidad/web, sin cambiar los colores del juego. Maqueta/plan funcional local fuera de Git en `outputs/kubono-visual/`; no publicado |
| Promesa | Un cubo y un universo que suena. La música electrónica y su mezcla con otras familias son parte central de la comunicación |
| Modelo | Pago único US$2,99 móvil / US$3,99 web (27 de octubre) / US$4,99 escritorio, también en itch.io, sin anuncios, suscripciones ni venta de chispas. Precios locales y licencia/recibos por tienda pendientes |
| Presupuesto | US$350 iniciales aprobados; no autoriza compras ni altas de pago. Tasas anotadas previamente: Play 25, Apple 99/año, Steam 100 por juego, antes de impuestos/conversión; revalidarlas al tramitar |
| Acceso | **Sin cuenta ni nube (Jay, 27 de octubre):** guardado local y copia de seguridad; cobra la tienda, como Monument Valley, Alto's o Florence. Antes: **cambio aprobado por Jay el 22 de octubre ([El Viaje](VIAJE.md)):** cuenta opcional. Se juega con guardado local desde el primer toque; la cuenta se ofrece después para guardar en la nube y migra el progreso local. Construida en la Fase 2 (alpha.98). Sin demo comercial; el build de festival es un recorte privado para jurados |
| Plataformas | **Primero web y Android (27 de octubre).** iOS/iPadOS, escritorio, Steam y consolas quedan para después; cada una sale al estar lista y aprobada |
| Idiomas | **Español e inglés (27 de octubre).** El juego hoy solo está en español: hay que traducirlo entero (fase L2) |
| Público | Objetivo de 16 años o más; clasificación de contenido por tienda aparte. Mercados, país/editor y correo público aún pendientes |
| Datos | Plazos aprobados en [Producción](CONFIGURACION_PRODUCCION.md); algunos controles aplicados, otros pendientes. No equivale a privacidad/configuración final publicadas |

La revisión inicial de marca del 19 de octubre encontró una coincidencia china de clase 4 (aceites/lubricantes), sin registro europeo encontrado en las consultas y sin resultado en Madrid Monitor. Global Brand Database no fue accesible; búsqueda fonética SENADI pendiente. No es certificación jurídica ni disponibilidad actual del dominio. Registro de consultas y fuentes (en Git: `docs/historial/PLAN_LANZAMIENTO_ANTES_REVISION.md`, revisión 5914ca9).

Cuenta compartida y guardado automático no conceden cross-buy. La sincronización está comprobada entre navegador, Safari iPhone y APK emulado; no afirmar aceptación iOS nativa, desktop, compras o tiendas.

## Estado por plataforma

| Frente | Hecho | Pendiente principal |
|---|---|---|
| Android | APK debug de cuentas y firma estable, migración/actualización emulada conservan sesión/saldo | Firma y AAB de tienda, cuenta/verificación, Android físico y pruebas de distribución |
| iOS/iPadOS | Juego web probado en Safari de iPhone; Jay tiene Mac/iPhone | Recursos/modelos/compatibilidad, membresía si decide contratar, proyecto iOS, TestFlight/App Review; iPad si se anuncia |
| Web/PWA | Cliente existente y recorrido de cuenta comprobado en pruebas locales | Papel comercial/entitlement web, dominio/landing, correo/callbacks/privacidad públicos. No implementar cobro propio sin decidirlo |
| Windows/macOS/Linux | Envoltorio Electron en `desktop/` y builds de los tres sistemas (L4, [guía](ITCH.md)); Linux probado sin pantalla | Firma de macOS (cuenta de Apple) y de Windows; pruebas en Windows y macOS reales |
| Steam/itch.io | itch.io vende la descarga de escritorio (Jay, 27 de octubre; L4, [guía](ITCH.md)); zip web como entrada del envoltorio | Cuenta y borrador en itch.io (precio US$4,99 e ID `com.playkubono.kubono` confirmados por Jay el 27 de octubre); cuenta/ficha de Steam con el mismo build |
| Consolas | Concepto compartido | Acceso a programas, viabilidad, controles y presupuesto antes de comprometer nada |

## Entregables vigentes

Los IDs se conservan para el tracker local. Los criterios siguientes sustituyen los que hablaban de demo o respaldo manual; la cuenta es opcional desde el 22 de octubre (tabla de decisiones).

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
| D22 | RLS, operación, retención, respaldo y cierre final | RLS/CAS y evidencia de cuentas aprobados; CI de alpha.200 aprobado; candidato E/alpha.207 con regresiones locales y CI completo del nuevo PR pendiente; retención Supabase, respaldo completo/restore, soporte y producción pendientes. Trabajo Supabase detenido |

## Salida web y Android

Decidido por Jay el 27 de octubre de 2026: web y Android primero, con cobro, español e inglés, a su nombre personal. **Kubono sale sin cuenta**: se guarda en el dispositivo y cobra la tienda (Google Play en Android; itch.io en web, que gestiona el pago y el acceso). Supabase queda en pausa sin plan de reactivarlo.

Precios aprobados: US$2,99 Android, **US$3,99 web** (Jay, 27 de octubre) y US$4,99 escritorio. El panel recomendó igualar la web a 2,99 ([revisión de precios](panel/precios/informe.md)); **Jay mantuvo sus precios** el mismo día.

**Sin nube, como Monument Valley, Alto's o Florence (Jay, 27 de octubre):** Kubono no tendrá cuenta propia ni guardado en la nube. Se compra en la tienda, se juega al momento y guarda en el dispositivo; la copia de seguridad (exportar e importar) pasa la partida de un dispositivo a otro. **La vara de calidad son esos juegos.**

| Fase | Rama | Qué cambia | Bien cuando |
|---|---|---|---|
| L1 · Versión de venta sin nube | `lanzamiento/l1-sin-nube` | La edición de venta oculta toda la cuenta (entrar, crear, eliminar) y no llama a Supabase; el guardado local, la copia de seguridad y «Empezar de cero» siguen. Una sola bandera de edición | Un recorrido de navegador en la edición de venta no hace ninguna petición fuera de sus propios archivos; ningún botón de cuenta visible; las partidas existentes cargan igual |
| L2 · Inglés | `lanzamiento/l2-ingles` | Módulo de textos ES/EN para menús, hojas, avisos, narrador, Bitácora, Lugares, tarjetas y texto dibujado; idioma según el sistema y elegible en Ajustes; `<html lang>` correcto | En inglés, ninguna captura estándar ni de menús muestra texto en español; los textos no se cortan a 390×844; español sin cambios |
| L3 · Android de tienda | `lanzamiento/l3-android` | Edición release sin la vista previa de cuentas: identificador final, `versionCode` desde la versión, AAB firmado con la clave de subida de Jay (fuera de Git, por variable de entorno) y Play App Signing; workflow que genera el AAB | CI genera un AAB release; se instala en un Android físico, conserva la partida al actualizar y suena |
| L4 · Escritorio en itch.io | `lanzamiento/l4-itch` | **Decisión de Jay (27 de octubre): itch.io vende la versión de escritorio como descarga; la web no se publica abierta.** Motivo: itch.io no cobra por jugar un HTML en el navegador (solo bloquea descargas) y el zip web no arranca desde `file://`. Envoltorio Electron (`desktop/`) con la edición de venta del zip de itch.io, sin red y con el guardado en el perfil; script de builds y workflow manual para Windows, macOS y Linux. El mismo build sirve para Steam | Los tres builds subidos como borrador privado de pago se descargan, abren, suenan, guardan y vuelven a abrir con la partida en cada sistema |
| L5 · Ficha, privacidad y soporte | `lanzamiento/l5-fichas` | Política de privacidad de la edición sin nube (no se recogen datos personales); página de soporte; fichas ES/EN de Play e itch.io; respuestas del formulario de seguridad de datos y del cuestionario de clasificación; capturas e icono con `scripts/store-media.py` | Política y soporte publicados en una URL; fichas completas en las dos tiendas como borrador; capturas de la versión real en ES y EN |
| L6 · Prueba cerrada y salida | — | Prueba cerrada en Play (revalidar cuántos testers y días pide Google a cuentas personales nuevas) y página privada en itch.io; Jay y Luca juegan la versión de tienda; corregir lo que salga | Jay autoriza publicar cada canal |

**Orden:** L1 y L2 primero (son del juego); L3, L4 y L5 en paralelo después; L6 al final. Cada fase con su rama, pruebas y CI en verde, como Q1–Q7.

**Lo que tiene que hacer Jay** (nadie más puede):
1. Crear la cuenta de desarrollador de Google Play a su nombre (US$25, verificación de identidad).
2. Crear la cuenta de itch.io y configurar el cobro y los datos fiscales.
3. Dar un correo público de contacto y su nombre legal para la ficha y la política.
4. Guardar la clave de subida de Android fuera del repositorio, con copia segura. Nunca pegarla en el chat ni en Git.
5. Decidir el identificador final de la app Android (no se puede cambiar después de publicar).
6. Probar la versión de tienda en su teléfono y con Luca, y autorizar cada publicación.

La ventana original de ocho semanas (19 oct–13 dic 2026) queda como **estimación histórica no revalidada**. Plan anterior en Git: `docs/historial/PLAN_LANZAMIENTO_ANTES_REVISION.md`, revisión 5914ca9.

## Universo vivo · encuentros

**Decisión de Jay (27 de octubre de 2026):** viajar por el universo es bonito pero aburre. Aprobó un catálogo de **33 encuentros vivos**, tres por bioma (perseguir, huir, hacer), en el mismo mundo donde se viaja, uno cada 60–90 s de viaje, sin castigo al fallar, que solo pagan chispas al completarlos (10 ✦, 15 ✦ con un pulso a tiempo, cada vez); la música no se toca. El mismo día pidió **más chispas y la economía general al alza** sin regalar la tienda. Reglas y economía en [Encuentros vivos](HALLAZGOS_Y_ACTIVIDADES.md#encuentros-vivos). No reabre L1–L6 ni las fases de diseño cerradas; estas tandas no son E1–E7 del candidato E.

| Tanda | Rama | Qué | Estado |
|---|---|---|---|
| E1 · Perseguir | `universo/e1-perseguir`, sobre `lanzamiento/m1-notas-jay` (alpha.226, PR #365) | Motor común y los once de perseguir; rondas 80–170 ✦, actividades 15 ✦ y travesuras 10 ✦ | Hecha en la rama (alpha.227); sin PR, sin CI remoto, sin teléfono ni personas |
| E1 · Perseguir (integrada) | PR #366 en `main` (`36fab14`) | — | Integrada |
| E2 · Huir | `universo/e2-huir`, desde `main` (`36fab14`, alpha.227) | Once de huir sobre el mismo motor; el temporizador común elige perseguir o huir con `hashKey`; criaturas de E1 con más contraste | Integrada (PR #367, `fc7c4f8`) |
| E3 · Hacer | `universo/e3-hacer`, desde `main` (`fc7c4f8`, alpha.228) | Once de hacer sobre el mismo motor; la tirada se reparte en tercios | **Hecha** en la rama (alpha.229); sin PR, sin CI remoto, sin teléfono ni personas |

**Encuentros vivos completos:** con E3 están los 33 del catálogo (11 biomas × perseguir, huir, hacer). Falta lo de siempre: CI remoto tras el PR, el teléfono y personas.

**Ideas del universo (28 de octubre de 2026):** el [catálogo de 119 ideas y Constelaciones](IDEAS_UNIVERSO.md) existe, con fases F0–F6. Es una dirección aprobada; no autoriza construir nada hasta que Jay elija la fase.

| Fase | Rama | Qué | Estado |
|---|---|---|---|
| F1 · Mapa del cielo | `universo/f1-mapa-del-cielo`, desde `main` (`ccb661a`, alpha.230) | 28 figuras que se unen en orden en el Mundo libre; nota por estrella y motivo; a medias guardada; 10/15 ✦ una vez por figura; zodiaco → halo de estrellas; sección en la Bitácora ([guía](HALLAZGOS_Y_ACTIVIDADES.md#mapa-del-cielo)) | **Hecha** en la rama (alpha.231); sin PR, sin CI remoto, sin teléfono ni personas |

## Comunicación y venta

Propuesta: mostrar primero una acción del cubo y su respuesta visual/musical. Tres mensajes: explorar un universo sonoro, romper/recoger y avanzar, descubrir escenas/actividades raras. La electrónica no debe desaparecer de la identidad; mostrar cómo se mezcla con otras familias sin atribuir grabaciones ajenas.

Recorrido: clip real → landing clara → ficha de plataforma disponible → compra. Sin demo, promesas de cross-buy, publicidad contratada ni contacto automático. Medir dónde se pierde interés antes de bajar precio o ampliar contenido. Tráiler/press kit/cuentas sociales siguen sujetos al bloque que Jay autorice.

## Condición para declarar una salida

Paquete release y firma correctos; acceso/avance/eliminación y correo público coherentes; obligaciones y revisión de la tienda satisfechas; experiencia humana en sistema anunciado; precio/países y enlace comprables; autorización explícita de Jay. Commit, CI verde, APK o aprobación de una maqueta no equivalen a ventas.

Referencias de trámites consultadas previamente: [Google Play pruebas](https://support.google.com/googleplay/android-developer/answer/14151465), [Play datos](https://support.google.com/googleplay/android-developer/answer/9866151), [Apple revisión](https://developer.apple.com/app-store/review/guidelines/), [Steam salida](https://partner.steamgames.com/doc/store/releasing). Revalidar las reglas al realizar el trámite; esta revisión es documental, no una nueva comprobación comercial/legal.
