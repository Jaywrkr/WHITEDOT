# Configuración para lanzar cuentas y guardados

Revisión documental: 20 de octubre de 2026. Borrador no publicado; la configuración de Supabase está detenida por petición de Jay para revisar el proyecto. [Índice vigente](README.md).

Preparado el 19 de octubre de 2026. Lista de preparación; no autoriza publicar, contratar, comprar dominio, crear proyectos o modificar servicios. Continuación de D06/D20/D22 del [plan](PLAN_LANZAMIENTO.md), sin otro catálogo de tareas.

## Datos que debe confirmar Jay

- [ ] Nombre legal del responsable, país y correo público de soporte/privacidad. El Gmail usado en pruebas no se convierte automáticamente en contacto público.
- [ ] Primeros mercados y quién atenderá solicitudes; ajustar privacidad y bases legales al responsable y a esos mercados.
- [x] Público objetivo de 16 años o más, aprobado por Jay el 19 de octubre de 2026; clasificación de tienda y obligaciones locales se cierran por separado.
- [x] Plazos aprobados por Jay el 19 de octubre de 2026 según la tabla siguiente; controles aplicados y pendientes diferenciados abajo; retención de proveedores y excepciones justificadas por cerrar.

`playkubono.com` es dominio previsto, no comprado. No existen aún URLs públicas de privacidad o eliminación.

## Cambios y configuración pendientes

| Área | Acción concreta antes de salir | Estado |
|---|---|---|
| Entorno | Decidir proyecto final o conversión controlada de Dev; separar datos de pruebas y usuarios reales. No reaplicar `setup.sql` sobre el proyecto existente | Pendiente; Dev Free intacto |
| Correo | Elegir envío apto para cualquier comprador; verificar remitente/dominio, cuotas, confirmación y recuperación. No confundir correo de desarrollo con servicio final | Sin proveedor contratado |
| Recuperación | Sustituir `http://localhost:3000/` hardcoded en `src/cloud-client.js` y el aviso de servidor local de `src/cloud-account.js`; configurar destino final de alta en Auth y página `recovery.html` | Requiere cambio de código posterior, no solo panel |
| URLs | Site URL y lista exacta de redirecciones HTTPS en Supabase; separar localhost/LAN de producción. Definir retorno a web/app para cada plataforma | Pendiente; sin comodines amplios |
| Privacidad | Completar [borrador](PRIVACIDAD.md), retención y proveedores; preparar URL pública accesible y enlazarla desde app/tiendas | Texto preparado, no publicado |
| Eliminación | Activar recurso web con canal real de solicitud; designar responsable y aplicar plazos aprobados. Alinear borrado local y aviso de app con [procedimiento](ELIMINACION_DATOS.md) | Pendiente; RPC online existente |
| Acceso y datos | Mantener RLS por propietario, claves publicables en cliente y secretos solo en administración/CI; revisar expiración de JWT y detección de revocación en dispositivos | Base comprobada; revisión final sobre configuración definitiva |
| Protección y capacidad | Límites de Auth, envío, solicitudes y guardados; supervisar espacio/egreso/usuarios y alertas. No activar planes/add-ons automáticamente | Presupuestar con uso real |
| Respaldos | Definir exportación cifrada, ubicación fuera del proyecto, responsable, frecuencia, ventana de retención y restauración con borrados reaplicados | No configurado por estos documentos |
| Distribución | Clave de firma de tienda custodiada y paquete final; la firma estable comprobada es de vista previa. Cuenta no equivale a licencia ni a cross-buy | Separado del cierre funcional de guardados |
| Declaraciones | Completar Data Safety/App Privacy según datos realmente enviados, incluidos cuenta, progreso y registros técnicos; revisar tratamiento de compras cuando exista | No declarar «sin recogida de datos» |

En Free, Supabase recomienda exportaciones propias y copias fuera del servicio; no asumir acceso a respaldos diarios administrados de los planes de pago. [Documentación oficial](https://supabase.com/docs/guides/platform/backups). Preparar el procedimiento ahora no crea una copia de producción ni contrata un servicio. La exportación debe incluir lo necesario para recuperar Auth y guardados: un dump de tablas de juego por sí solo no restaura las cuentas.

## Conservación aprobada, todavía no aplicada

| Ámbito | Decisión aprobada |
|---|---|
| Cuenta y progreso | Hasta eliminación; sin purga por inactividad |
| Eliminación dentro del juego | Datos online al completarse la operación |
| Solicitudes por soporte | Objetivo de resolución: 7 días tras verificar identidad |
| Registros técnicos bajo nuestro control | Hasta 7 días |
| Mensajes de soporte | 90 días desde el cierre de la incidencia |
| Respaldos gestionados | Rotación de 7 días; reaplicar eliminaciones antes de servir una restauración |

Aprobación del 19 de octubre de 2026. Se aplicaron los controles gratuitos indicados a continuación; no se ha configurado exportación completa de la base de datos ni el buzón de soporte. Confirmar los plazos propios de proveedores y las excepciones legales aplicables antes de publicar. La frecuencia de las exportaciones y el tiempo de recuperación siguen pendientes: una ventana de retención de 7 días no equivale a una copia diaria ni garantiza recuperar todos los cambios.

Las copias privadas de migración del emulador contienen sesión y progreso: conservarlas solo mientras haga falta rollback; eliminar al cerrar esa ventana. Mantener la clave de firma por separado, pues sí se necesita para futuras actualizaciones. No borrar ninguna ahora.

## Criterio de cierre

No repetir PC/iPhone/emulador, RLS, sincronización o actualización ya aprobados. Cuando haya configuración/paquetes finales, comprobar una sola vez únicamente lo que cambió: enlaces y correo públicos, eliminación completa en cuenta desechable, restauración operativa aislada y continuidad en paquetes finales. Hasta entonces, documentos preparados no equivalen a cumplimiento aprobado ni servicio publicado.

## Configuración gratuita aplicada y límites

| Control | Resultado comprobado |
|---|---|
| GitHub Actions, repositorio Jaywrkr/WHITEDOT | Retención efectiva consultada por API: `days=7`, antes 90; ambos workflows Android ajustados explícitamente a 7 días. La política del proveedor no se anuncia como purga retroactiva de artefactos anteriores |
| Respaldos privados de migración del emulador | Tarea Windows `Kubono-LocalRetention`, cada hora, usuario conectado, ejecución oculta y recuperación al estar disponible. Script `scripts/prune-local-retention.ps1` instalado en `AndroidPlayer/maintenance`; solo archivos expresamente permitidos bajo `account-migration-backup` |
| Logs locales de emulador sin actividad | Solo `emulator.log` y `emulator-error.log` vencidos por última modificación; no es una purga por registro de un log activo |
| Seguridad local | No recorre carpetas ni acepta enlaces/reparse points; nunca incluye `signing`, APK activo, sesión ni almacenamiento del juego. Margen de una hora para barrido horario. PC apagado o usuario desconectado retrasan la limpieza |
| Comprobación local | Fixture vencida eliminada; backup reciente y clave ficticia preservados; dry-run no elimina. Aplicación real inicial: 0 archivos vencidos, 0 borrados; tarea Ready, repetición PT1H, clave y backup reales presentes |
| Supabase, auditoría Auth | Pendiente: los intentos de escritura expiraron (`Invalid or expired requestState`); la última lectura confirmó pg_cron no instalado. El panel requiere iniciar sesión y el intento OAuth vía GitHub fue bloqueado por revisión automática; trabajo detenido, no reintentar autenticación en una revisión documental. Configuración reproducible en `supabase/retention.sql`, aún NO aplicada |
| Datos existentes | Lectura posterior: 1 usuario, 2 guardados, saldo principal 52, 0 registros de auditoría; sin borrado de cuenta o partida |

Para desactivar solo la limpieza local, deshabilitar la tarea `Kubono-LocalRetention`; no borrar la clave de firma. Actualizar la copia instalada del script si cambia la versión del repositorio. No se crea ninguna automatización de seguimiento del chat.

Pendientes técnicos, además de datos legales/correo: aplicar/verificar el SQL de auditoría cuando Jay autorice reanudar y Supabase permita escrituras; confirmar retención de logs administrados por proveedores (no ajustada aquí); preparar exportación completa cifrada y restauración de Auth/guardados con borrados reaplicados. La tarea local rota copias existentes, no crea respaldos de producción. Soporte de 90 días y objetivo de eliminación de 7 días siguen pendientes del buzón y responsable.

Fuentes de configuración: [API de retención de GitHub](https://docs.github.com/en/rest/actions/permissions#set-artifact-and-log-retention-settings-for-a-repository), [auditoría Auth](https://supabase.com/docs/guides/auth/audit-logs), [Cron y limpieza de su historial](https://supabase.com/docs/guides/cron/quickstart). La escritura pendiente no autoriza a ejecutar el SQL sin revisar primero si ya se aplicó.
