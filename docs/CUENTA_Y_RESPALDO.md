# Cuenta y progreso automático · alpha.59

Revisión: 20 de octubre de 2026. La configuración de Supabase está **detenida por petición de Jay**. Alpha.59 solo cambia el destino configurable de recuperación y el borrado local al eliminar la cuenta; no ejecutar otros pendientes por leer esta guía.

## Funcionamiento vigente

- Cuenta obligatoria por correo/contraseña, confirmación y recuperación por enlace. Sin invitado, demo ni otros proveedores. `main.js` espera `requireAccount()` antes de crear el runtime; configuración vacía no abre el mundo.
- Sesión persistente en localStorage, sin guardar contraseña. Se valida con Auth al abrir y se renueva para solicitudes. Una sesión previa permite continuar offline si no hay red; una respuesta de acceso inválido se trata de otra forma, no como fallo de red.
- Guardado local periódico y conciliación online automática cada cinco segundos cuando corresponde, al reanudar y con intento adicional al salir. No hay botones normales de guardar/recuperar/respaldar; la salida no garantiza envío si el sistema mata el proceso.
- Primera copia remota ausente se sube; dispositivo sin avance propio recupera la remota. Si la local no avanzó, se adopta el remoto; cambios solo locales se envían. Si ambas avanzaron, se detiene el reemplazo y se pide elegir, preservando copias. No sumar balances ni decidir por fecha o saldo máximo.
- Cerrar sesión vuelve a la entrada. Cambiar usuario no mezcla guardados. Cada dispositivo/origen necesita su primer acceso: los tokens no se transfieren entre navegador y APK.

## Proyecto, almacenamiento y límites

Kubono Dev: `eghmydqxsicqmbmeprgq`, organización Kubono `eebalwznymfdxaexvghc`, us-east-1. Free confirmado durante el desarrollo el 19 de octubre; no se contrató un plan. CORESOLUTIONS está fuera de alcance.

`cloud-config.js` contiene URL HTTPS y clave publicable, nunca service_role/secretos. `supabase/setup.sql` es esquema consolidado aplicado a Dev: **no reaplicarlo sobre el proyecto existente**. Identidad, Auth y claves administrativas no se deben imprimir ni guardar en informes.

Local: `kubono:user:USER_ID:CLAVE_MUNDO`. Remoto: ámbito histórico por usuario/mundo. La migración local conserva el original y asigna un propietario solo si no hay evidencia de otro. Baseline canónica, CAS, respaldos previos a restauración y copia de remoto antes de conservar local evitan reemplazos silenciosos. Si no hay espacio se cancela el reemplazo. Resúmenes de sesión/tiempo no crean divergencias por sí solos.

Servidor: 64 mundos por cuenta y 1 MiB por estado; JSON objeto con worldIdentity. RLS, cuotas y revisiones se aplican también a peticiones directas. El backend Python/SQLite y las salas no son este servicio.

## Recuperación de desarrollo

Correo predeterminado de Supabase, limitado a destinatarios/cuotas de desarrollo; sin SMTP contratado. Alta, enlace y cambio de clave reales comprobados. Callback local:

```sh
python scripts/serve-recovery.py
```

Abrir el enlace del correo en ese computador con `http://localhost:3000/` activo y autorizado en Auth → URL Configuration. La página limpia el fragmento, valida Auth y no persiste los tokens del enlace. No compartir contraseña, códigos o enlace en el chat.

El destino es `recoveryUrl` en `src/cloud-config.js`; `cloudConfig()` solo admite `http://localhost` o `127.0.0.1` para desarrollo y HTTPS sin credenciales ni fragmento para producción. `src/cloud-account.js` muestra el aviso del puerto 3000 únicamente con destino local. La producción requiere publicar `recovery.html`, fijar el valor final y permitirlo en Auth → URL Configuration junto al correo; no solo tocar Site URL.

## Eliminación y retención

Credenciales, confirmación y reautenticación recientes antes del RPC. Se eliminan sesiones del servidor, usuario y guardados online; después `purgeUserStorage` borra en ese dispositivo las claves `kubono:user:`, `kubono:cloud:` y `kubono:before-cloud-replace:` de la cuenta eliminada, se limpia la sesión solicitante y se vuelve a la entrada. Otras cuentas, la partida antigua sin dueño y la marca `kubono:legacy-owner` no se tocan. Alpha.58 mantiene la sesión durante reautenticación para evitar la recarga prematura.

**Otros dispositivos y los archivos exportados conservan su copia.** No prometer purga remota de dispositivos offline ni revocación instantánea de cada JWT emitido. Alcance y pendientes en [Eliminación](ELIMINACION_DATOS.md) y [Privacidad](PRIVACIDAD.md).

Plazos aprobados y configuración real en [Producción](CONFIGURACION_PRODUCCION.md). GitHub y limpieza local están configurados; `supabase/retention.sql` no está aplicado por errores del conector y el trabajo está detenido. No hay exportación completa/rotación de la base de producción configurada.

## Evidencia existente y límites

| Área | Resultado registrado |
|---|---|
| PC y Safari normal iPhone | Jay confirmó persistencia tras cerrar/reabrir y saldo automático igual. Un diagnóstico previo en otra pestaña privada no medía el mismo almacenamiento |
| Android emulado | Acceso real, migración a firma estable, 280 archivos restaurados idénticos y actualización/reapertura sin contraseña; último saldo comprobado 52, 72 ganadas y 20 gastadas |
| RLS, CAS y RPC | Aislamiento entre dos usuarios, anonimato rechazado y datos desechables borrados en transacciones revertidas; nunca se borró la cuenta de Jay |
| UI de eliminación | Cancelar/reautenticar/RPC/purga local limitada a la cuenta/retorno a entrada con Auth/REST simulado (`tests/cloud_delete_smoke.py`, alpha.59 local). No equivale a borrar un usuario alojado desde esa UI |
| Destino de recuperación | `tests/cloud-account.mjs` valida local/HTTPS, rechaza otros esquemas y comprueba el `redirect_to` enviado. Ningún correo real se envió con el destino configurable |
| Código y empaquetado | Pruebas enfocadas y auditorías registradas; [CI Android estable](https://github.com/Jaywrkr/WHITEDOT/actions/runs/39337750907) y [CI de configuración posterior](https://github.com/Jaywrkr/WHITEDOT/actions/runs/39455805125) aprobados |

No certificar a partir de esto dispositivo Android físico, app iOS, builds desktop, correo público o despliegue actual. Una lectura puntual del saldo no prueba una futura sincronización. La fixture `live-verification` quedó en Dev porque se canceló su limpieza; no reintentar ese borrado sin autorización.

Últimos avisos de seguridad registrados: sin advertencias de RLS/permisos; protección frente a contraseñas filtradas desactivada y pendiente revisión sin activar un plan de pago. No es un nuevo análisis de seguridad realizado por esta revisión documental.

Antes de vender: correo/callbacks públicos, limpieza local y política coherente, respaldo/restauración operativa, datos legales y mercados, recibos/licencia de tienda y aceptación de paquetes finales. Cuenta no equivale a compra ni a cross-buy. Ver D20–D22 del [plan](PLAN_LANZAMIENTO.md).
