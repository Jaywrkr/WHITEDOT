# Traspaso actual para revisar Kubono

**Fecha: 20 de octubre de 2026.** Leer [AGENTS.md](AGENTS.md) y [el índice](docs/README.md). Este documento reemplaza como entrada los handoffs de `docs/historial/`; aquellos conservan contexto de otras revisiones.

## Petición vigente de Jay

La configuración de Supabase sigue detenida. Tras la revisión de solo lectura del 20 de octubre, Jay autorizó ejecutar sus tres prioridades y nada más: CI en verde con cuenta obligatoria (solo pruebas y fixtures), D20 en código (destino de recuperación configurable y borrado local coherente) y este traspaso sincronizado con el `main` real. No ampliar el juego, publicar, contratar, comprar, crear PR ni integrar main por leer este archivo. Jay define el siguiente detalle.

## Qué existe y dónde

- Repositorio: `Jaywrkr/WHITEDOT`; nombre comercial aprobado **Kubono**. No confundir decisión de marca con renombrado de código/paquetes ya completado.
- Rama de esta entrega: `claude/charming-darwin-dvbfc7`, creada desde `feature/account-recovery-link` en `3175b41` (dependencia explícita). Estado remoto comprobado el 20 de octubre: `origin/main` es `997b232` (merge de PR #232) y el ancestro común con la rama de cuentas es `076128d`; los PR #230, #231 y #232 ya integraron la cuenta obligatoria en `main` (alpha.57). Los 15 commits posteriores de `feature/account-recovery-link` (firma Android, retención, documentación) no tienen PR abierto. No resetear ni mezclar cambios por suponer otra base.
- Versión de código: `2.3.0-alpha.64` (tienda del cubo, tanda 3; ver [CAMBIOS](CAMBIOS.md) y [Tienda del cubo](docs/TIENDA_DEL_CUBO.md)). Commit de la última compilación de firma validada funcionalmente: `165a356`; el cambio alpha.59 (recuperación configurable, borrado local, fixtures) no se ha compilado ni instalado en Android. Consultar `git log` para el HEAD real.
- Cliente estático: ES modules, Canvas 2D y Web Audio. Punto de entrada `src/main.js`; no instalación npm para jugar. Android es un contenedor WebView con esos mismos assets.
- [Mapa técnico](docs/ARQUITECTURA.md), [catálogo](docs/HALLAZGOS_Y_ACTIVIDADES.md), [cuentas](docs/CUENTA_Y_RESPALDO.md), [Android](android/README.md).

## Reglas de producto que no deben reabrirse por documentación vieja

Cuenta obligatoria por correo/contraseña, sin invitado ni demo. La sesión se mantiene y el progreso se sincroniza solo; no hay botones normales de guardar, descargar o recuperar respaldo. Las dos opciones de partida aparecen únicamente ante conflicto real. Sin otros métodos de login, salas, duetos ni sesiones multijugador en este lanzamiento.

La base musical electrónica y su mezcla con otras familias es parte de la identidad. No rediseñar música, economía, mapas, controles o contenido para cerrar cuentas. Los 30 tipos de actividades, rarezas y logros ya existen: no son un backlog por implementar.

## Cuenta y progreso: funcionamiento actual

`account-entry.js` bloquea la creación del runtime hasta tener acceso válido; una sesión previa permite offline cuando no hay respuesta de red. `cloud-client.js` usa Auth/REST HTTPS, clave publicable y sesión persistente por origen. No guarda la contraseña. `progress.js` separa guardados locales por usuario. `cloud-sync.js` usa referencia canónica y CAS por usuario/mundo: no suma saldos ni decide por fecha/mayor saldo. `cloud-account.js` reconcilia y guarda cada cinco segundos mientras corresponde y reintenta al volver.

Supabase Dev: proyecto `eghmydqxsicqmbmeprgq`, organización Kubono, Free, región us-east-1. No tocar CORESOLUTIONS. `supabase/setup.sql` consolida el esquema de Dev: NO reaplicarlo sobre el proyecto existente. `src/cloud-config.js` contiene solo configuración pública, no secretos.

Recuperación: `recovery.html` y `scripts/serve-recovery.py` en `http://localhost:3000/`; enlace de correo real probado en alpha.58. Desde alpha.59 el destino es `recoveryUrl` en `src/cloud-config.js` (validado en `cloud-client.js`: solo `http://localhost` o HTTPS, sin credenciales ni fragmento) y el aviso del puerto 3000 solo aparece con destino local. Producción aún requiere publicar `recovery.html`, fijar el valor final y permitirlo en Auth → URL Configuration; el valor público no está decidido.

Eliminar cuenta exige credenciales, confirmación y reautenticación; borra usuario/sesiones servidor y guardados remotos. Desde alpha.59 también borra en ese dispositivo las partidas, referencias de sincronización y copias de conflicto de la cuenta eliminada (`purgeUserStorage`), sin tocar otras cuentas ni la partida antigua sin dueño. Otros dispositivos conservan su copia hasta borrar sus datos. No prometer JWT revocado instantáneamente ni purga de respaldos que aún no existe.

## Evidencia que ya existe — no repetir sin motivo

| Comprobación | Evidencia y límite |
|---|---|
| PC + Safari normal iPhone | Jay confirmó reapertura sin contraseña y saldo igual; Safari privado en otra pestaña fue un diagnóstico separado, no pérdida de progreso |
| Android real en emulador | Jay entró con su cuenta; migración alpha.57→alpha.58 restauró 280 archivos privados idénticos al respaldo. Actualización `install -r` y cierre/apertura conservaron cuenta conectada y 52 chispas (72 ganadas, 20 gastadas) |
| Compilación firma estable | [CI 39337750907](https://github.com/Jaywrkr/WHITEDOT/actions/runs/39337750907), fuente `165a356`, aprobado; hashes APK verificados y certificado coincidente con la copia local |
| Configuración posterior de retención | [CI 39455805125](https://github.com/Jaywrkr/WHITEDOT/actions/runs/39455805125), fuente `32e2102`, aprobado. Es compilación, no una nueva aceptación funcional de la cuenta |
| Actualización aislada | Paquete `.accounts.signingprobe`: 137 chispas y compra dust conservadas antes/después de v1→v2; la primera fixture requirió esperar persistencia de WebView antes de cerrar el proceso |
| Auth/RLS/CAS y borrado RPC | Pruebas reales con datos desechables en transacciones revertidas; nunca se eliminó la cuenta de Jay. UI de eliminación con Auth/REST simulado, no borrado de una cuenta alojada desde esa UI |
| Pruebas enfocadas | `tests/cloud-account.mjs`, `tests/cloud_account_smoke.py`, `tests/cloud_delete_smoke.py` y admisión Android; ver alcance en [Verificación](docs/VERIFICACION.md). No atribuir todos los tests a todos los commits |
| CI `Universe foundation checks` | Tras integrar alpha.59 en `main` (`9953eed`): `logic`, `audio (1)` y `audio (2)` verdes; `browser` 130/131 por una carrera de la fixture `first_level_smoke.py`, corregida en esta rama; `audio (3)` cancelado al agotar 40 minutos. No declarar CI verde hasta leer el run del siguiente PR |

El saldo anterior es evidencia de la última comprobación, no una promesa del saldo actual. Evidencia local fuera de Git: `outputs/android-account-migration/acceptance.json`, capturas y `outputs/android-stable-signing-final/update-acceptance.json`, relativas al directorio de la tarea (padre de `work/`). No están disponibles automáticamente al clonar GitHub. Los enlaces de CI son la evidencia remota; sus artefactos caducan.

## Android: conservar instalación y firma

Paquete activo de prueba: `com.jaywrkr.whitedot.accounts`; emulador local `emulator-5580`. Lanzador `AndroidPlayer/Jugar-WHITEDOT.ps1` apunta al APK estable. La firma privada de prueba está fuera de Git en `AndroidPlayer/signing/kubono-account-preview.p12` y como secreto `KUBONO_ACCOUNT_PREVIEW_KEYSTORE_B64`; el workflow falla si falta. No es firma de tienda. No leer/imprimir clave, tokens o contraseñas, ni pedirlos por chat.

La firma alpha.57 original se perdió en un runner efímero; hubo una migración única autorizada con restauración verificada. Esa incidencia está resuelta en el emulador, no es un bloqueo actual. No desinstalar otra vez ni volver a la firma basada solo en caché. Los respaldos privados locales tienen limpieza programada: no contarlos como copia permanente de la base de producción.

## Retención: estado real y trabajo detenido

- Aprobado: público objetivo **16 años o más** (clasificación de tienda aparte); cuenta/progreso hasta eliminar, sin purga por inactividad; datos online al completar eliminación; objetivo soporte 7 días tras verificar identidad; logs propios hasta 7 días; soporte 90 días tras cierre; respaldos gestionados con rotación de 7 días y borrados reaplicados al restaurar.
- Aplicado: GitHub Actions nuevos logs/artefactos en 7 días; ambos workflows alineados. Windows `Kubono-LocalRetention` ejecuta cada hora una lista restringida de respaldos de migración/logs inactivos. Nunca incluye firma o partida activa. Primera aplicación: cero archivos reales vencidos.
- **NO aplicado:** `supabase/retention.sql`. Los intentos del conector caducaron con `Invalid or expired requestState`; la última lectura confirmó pg_cron ausente, 1 usuario, 2 guardados y saldo 52 intactos. El SQL solo busca limpiar auditoría Auth e historial de su propio job, no cuentas/partidas. No ejecutarlo automáticamente.
- El panel web quedó sin sesión. La revisión automática bloqueó iniciar OAuth con GitHub por falta de autorización específica. Jay pidió detenerse antes de iniciar sesión; no pedir reconexión ni continuar autenticación durante una revisión documental.
- Pendientes: retención propia de proveedores, respaldo completo/cifrado de Auth y guardados con restauración operativa, buzón público/procedimiento de soporte, datos legales, país y mercados. No se ha contratado servicio alguno.

## Decisiones y próximos detalles para revisar

Nombre Kubono; dominio previsto `playkubono.com`, no comprado. Preparación conjunta de Android, iOS/iPadOS, web y escritorio; cada plataforma sale al estar lista/aprobada. US$2,99 móvil / US$4,99 escritorio y presupuesto inicial US$350 aprobados; ninguna compra o publicación queda autorizada por ello. Identidad local aprobada con violeta eléctrico, sin cambiar la paleta del juego. Propuesta visual y web de plan están en `outputs/kubono-visual/`, fuera de Git; no prometer que viajan en el clon.

El único backlog vigente es [D01–D22](docs/PLAN_LANZAMIENTO.md). Decisiones que siguen siendo de Jay: proyecto Supabase final o conversión de Dev, correo transaccional, exportación/restauración de respaldos, nombre legal/país/mercados/correo público, dominio y valor final de `recoveryUrl`, y qué hacer con la puerta de acceso ante respuestas 5xx/429 (`account-entry.js` solo continúa offline sin `status`; un proyecto Free pausado bloquea sesiones válidas). Dos pestañas de la misma cuenta en un navegador pueden abrir el panel de divergencia porque la referencia en memoria no se relee; es comportamiento de alpha.58, no se cambió. iOS nativo, Android físico y paquetes desktop no están aceptados; no existe todavía versión de pago publicada.

## Petición sugerida para abrir la revisión

> Lee AGENTS.md, HANDOFF_CLAUDE.md y la guía del área que te indique. Revisa contra el código actual, distingue fallos de pendientes de producción y cita archivo/línea. No implementes, publiques, contrates, borres datos ni repitas baterías completas hasta acordar el detalle. Los planes históricos solo son contexto.

## Revisión completa y fase 1 (alpha.60)

Tras volver de Codex, Jay pidió revisar jugabilidad, UI, bitácora, economía e integridad del ciclo, más ideas para divertir con lo existente, y aprobó la fase 1 del plan resultante (integridad y textos). Detalle en [CAMBIOS](CAMBIOS.md). Siguen siendo de Jay: ocultar «Viajar a otra semilla» en producción (crea partidas y copias online paralelas), mantener la reubicación en cada recarga (`practice-travel.js:99`) y la marca dentro del producto. Fases 2 (cerrar el ciclo y la economía) y 3 (ajustes de diversión) quedan propuestas, sin iniciar. Hallazgo sin cambiar: una partida quieta en el Mundo registra especies cercanas, eso cuenta como progreso y genera divergencia frente a otro dispositivo activo de la misma cuenta.

## Entrega alpha.59 (rama `claude/charming-darwin-dvbfc7`)

Cambios de código: `src/cloud-config.js` (`recoveryUrl`), `src/cloud-client.js` (validación y uso del destino), `src/cloud-sync.js` (`purgeUserStorage`), `src/cloud-account.js` (aviso condicional, orden credenciales→confirmación, purga local tras borrar). Fixtures: `release_smoke.py` instrumenta `main.js`; `interface_smoke.py`, `music_menu_smoke.py`, `panel_polish_smoke.py` y `foundation_smoke.py` cierran el menú antes de `openSaveTools()` porque el botón ya no existe; `panel_polish_smoke.py` espera el texto actual del glosario; `smoke.py` espera la radio vecina con `wait_for_function`; `cloud_account_smoke.py` tolera el panel de divergencia ya abierto; `checks.yml` da historial completo al job `browser` para `pwa_updates_smoke.py`. Evidencia local: los Node de cuentas y los nueve recorridos de navegador implicados pasan uno por uno; ver [Verificación](docs/VERIFICACION.md) para la lista y los límites. No se compiló Android, no se tocó Supabase ni se ejecutó el catálogo completo.

La consolidación documental anterior (`3175b41`) revisó 100 Markdown, 1661 enlaces locales y auditoría estática sin cambios de código; sus cifras no se repitieron aquí.
