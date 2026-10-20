# Traspaso actual para revisar Kubono

**Fecha: 20 de octubre de 2026.** Leer [AGENTS.md](AGENTS.md) y [el índice](docs/README.md). Este documento reemplaza como entrada los handoffs de `docs/historial/`; aquellos conservan contexto de otras revisiones.

## Petición vigente de Jay

Detener la configuración de Supabase y dejar toda la documentación clara para revisar detalles con Claude. Esta entrega es documental: no ampliar el juego, implementar pendientes, reejecutar pruebas completas, publicar, contratar, comprar, crear PR o integrar main por leer este archivo. Jay define el siguiente detalle que quiera revisar.

## Qué existe y dónde

- Repositorio: `Jaywrkr/WHITEDOT`; nombre comercial aprobado **Kubono**. No confundir decisión de marca con renombrado de código/paquetes ya completado.
- Rama: `feature/account-recovery-link`, continuación explícita del trabajo de cuentas. Referencia local de `origin/main` y ancestro común observados al preparar este traspaso: `20ebdf4`; no se hizo fetch ni se certifica el main remoto actual. No resetear ni mezclar cambios por suponer otra base.
- Versión de código: `2.3.0-alpha.58`. Commit de la última compilación de firma validada funcionalmente: `165a356`; documentación/configuración posterior en la misma rama. Consultar `git log` para su HEAD real.
- Cliente estático: ES modules, Canvas 2D y Web Audio. Punto de entrada `src/main.js`; no instalación npm para jugar. Android es un contenedor WebView con esos mismos assets.
- [Mapa técnico](docs/ARQUITECTURA.md), [catálogo](docs/HALLAZGOS_Y_ACTIVIDADES.md), [cuentas](docs/CUENTA_Y_RESPALDO.md), [Android](android/README.md).

## Reglas de producto que no deben reabrirse por documentación vieja

Cuenta obligatoria por correo/contraseña, sin invitado ni demo. La sesión se mantiene y el progreso se sincroniza solo; no hay botones normales de guardar, descargar o recuperar respaldo. Las dos opciones de partida aparecen únicamente ante conflicto real. Sin otros métodos de login, salas, duetos ni sesiones multijugador en este lanzamiento.

La base musical electrónica y su mezcla con otras familias es parte de la identidad. No rediseñar música, economía, mapas, controles o contenido para cerrar cuentas. Los 30 tipos de actividades, rarezas y logros ya existen: no son un backlog por implementar.

## Cuenta y progreso: funcionamiento actual

`account-entry.js` bloquea la creación del runtime hasta tener acceso válido; una sesión previa permite offline cuando no hay respuesta de red. `cloud-client.js` usa Auth/REST HTTPS, clave publicable y sesión persistente por origen. No guarda la contraseña. `progress.js` separa guardados locales por usuario. `cloud-sync.js` usa referencia canónica y CAS por usuario/mundo: no suma saldos ni decide por fecha/mayor saldo. `cloud-account.js` reconcilia y guarda cada cinco segundos mientras corresponde y reintenta al volver.

Supabase Dev: proyecto `eghmydqxsicqmbmeprgq`, organización Kubono, Free, región us-east-1. No tocar CORESOLUTIONS. `supabase/setup.sql` consolida el esquema de Dev: NO reaplicarlo sobre el proyecto existente. `src/cloud-config.js` contiene solo configuración pública, no secretos.

Recuperación: `recovery.html` y `scripts/serve-recovery.py` en `http://localhost:3000/`; enlace de correo real probado. El destino todavía está hardcoded en `cloud-client.js` y hay texto de servidor local en UI. Falta sustituirlo al preparar producción; la sola configuración del panel no basta.

Eliminar cuenta exige confirmación y reautenticación; borra usuario/sesiones servidor y guardados remotos. **El código actual conserva copias locales.** No prometer borrado completo en todos los dispositivos, JWT revocado instantáneamente o purga de respaldos que aún no existe. Reautenticación alpha.58 corregida para evitar que se recargue antes de terminar el borrado.

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

El único backlog vigente es [D01–D22](docs/PLAN_LANZAMIENTO.md). Posibles detalles de revisión, sin iniciarlos por este texto: coherencia de eliminación local/online, destino público de recuperación, operación/respaldos, formularios de tiendas y límites de la sincronización offline. iOS nativo, Android físico y paquetes desktop no están aceptados; no existe todavía versión de pago publicada.

## Petición sugerida para abrir la revisión

> Lee AGENTS.md, HANDOFF_CLAUDE.md y la guía del área que te indique. Revisa contra el código actual, distingue fallos de pendientes de producción y cita archivo/línea. No implementes, publiques, contrates, borres datos ni repitas baterías completas hasta acordar el detalle. Los planes históricos solo son contexto.

## Revisión documental de esta entrega

100 Markdown revisados: 16 vigentes y 84 de historial (índice incluido). Los 83 textos históricos llevan aviso propio. Se comprobaron 1661 enlaces locales sin roturas, referencias a archivos del código y recursos locales expresamente distinguidos. Auditoría estática sin errores/avisos; selección de impacto de los 100 cambios Markdown: cero suites Node. Diff revisado, sin cambios de juego, versión, claves ni servicios. No se reejecutó gameplay, audio, cuentas o dispositivos ni se retomó Supabase.
