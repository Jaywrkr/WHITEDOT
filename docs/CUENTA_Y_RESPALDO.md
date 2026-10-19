# Cuenta y progreso automático · alpha.58

## Funcionamiento vigente

- Cuenta obligatoria por correo/contraseña. Crear cuenta, confirmar el enlace del correo y entrar. Sin invitado, demo ni otros proveedores.
- Sesión persistente en localStorage, sin guardar la contraseña. Se valida con Auth al abrir y se renueva antes de las peticiones. Una sesión previa permite continuar offline; sin sesión no se inicializa el mundo.
- Guardado y comprobación automática cada cinco segundos con cambios, al volver a la pestaña y con intento adicional al salir. Sin botones de guardar/recuperar/respaldar en el flujo normal.
- Se trae la copia remota cuando la local no avanzó; una copia vacía no provoca conflictos. Si ambas tienen avances diferentes, se conserva todo y se pide elegir. No se suman saldos ni se elige el máximo o la fecha más reciente.
- Sin red o con suspensión prematura, el avance permanece local. No se garantiza envío antes de que iOS cierre el proceso. Reabrir permite reintentar.
- Cerrar sesión vuelve a la entrada. Cambiar de usuario no mezcla partidas. Cada dispositivo requiere su propio primer acceso; los tokens no se comparten entre orígenes.

## Proyecto y datos

Kubono Dev: `eghmydqxsicqmbmeprgq`, organización Kubono `eebalwznymfdxaexvghc`, región us-east-1, Free comprobado el 19 oct 2026. Sin publicación ni planes contratados. CORESOLUTIONS permanece intacto.

`cloud-config.js` contiene únicamente URL HTTPS y clave publicable; nunca secretos/service_role. Vacío bloquea el acceso, no abre un modo invitado. Esquema consolidado en `supabase/setup.sql`; no reaplicarlo al proyecto existente. Migraciones aplicadas: `kubono_optional_cloud_saves` y `harden_cloud_save_privileges`.

Local: `kubono:user:USER_ID:CLAVE_MUNDO`. Remoto: la clave de mundo histórica con RLS por usuario. La migración copia sin borrar el original y registra un único propietario; si hay evidencia de otro propietario no asigna esa partida automáticamente.

La referencia canónica por usuario/mundo distingue cambios locales/remotos; los contadores de tiempo y resúmenes de sesión no generan divergencias. CAS impide sobrescribir una revisión nueva. Restaurar conserva `:before-restore`; elegir la local conserva primero la remota. Si no hay espacio, se cancela el reemplazo.

Servidor: máximo 64 mundos por cuenta y 1 MiB por estado; JSON de objeto con worldIdentity. Trigger y RPC controlan revisiones/cuotas, incluso ante acceso directo por tabla. El backend Python y duetos son históricos, no parte del lanzamiento.

Eliminar cuenta exige confirmación y reautenticación. La sesión permanece durante la comprobación para evitar una recarga prematura. El RPC requiere una sesión reciente y elimina sesiones, usuario y copias remotas. Los archivos locales anteriores se conservan según el aviso actual; su política definitiva de eliminación/retención debe cerrarse antes de vender.

## Correo local

Correo predeterminado de Supabase, limitado a destinatarios/cuotas de desarrollo. Sin SMTP contratado ni plantillas personalizadas. Alta y recuperación por enlace real comprobadas.

`python scripts/serve-recovery.py` sirve el callback local en `http://localhost:3000/`, Site URL predeterminada. Si fue cambiada, autorizar esa URL exacta en Auth → URL Configuration. Mantener el servidor mientras se abre el correo en ese computador. Confirmación muestra «Correo confirmado»; recuperación permite elegir clave. Se borra el fragmento antes de pedir datos, se valida Auth y no se persisten tokens del enlace. Nunca compartir contraseña ni enlace en el chat.

## Evidencia y límites

- PC e iPhone/Safari normal: Jay confirmó sesión tras cerrar/reabrir y mismo saldo automático en alpha.57. La comparación anterior entre contextos privados distintos no fue pérdida: en la pestaña del juego había 4 disponibles, 24 ganadas y 20 gastadas.
- Android emulado: APK alpha.57 compilado en Actions 39334695709 (0481194), SHA-256 verificado, instalación separada que conserva la app anterior. Puerta de acceso real aprobada. Jay confirmó saldo igual; cierre forzado y apertura en frío conservaron sesión y 52 chispas, también consultadas en Supabase (revisión 28).
- RLS y RPC real: aislamiento de dos usuarios, anonimato rechazado, CAS y borrado de usuario/sesión/copia desechables aprobados en transacciones revertidas. Nunca se borró la cuenta de Jay.
- UI de eliminación: cancelación, reautenticación, RPC y retorno sin sesión aprobados con Auth/REST simulado; no equivale a eliminar una cuenta alojada a través de Auth HTTP.
- Alpha.58 corrige la reautenticación de eliminación. Build 39335918044 y hashes aprobados, pero la actualización fue rechazada por firma debug distinta: alpha.57 validada continúa instalada con datos intactos. Ruta de firma/caché corregida; antes de tienda hace falta custodiar una clave permanente. No se desinstaló para forzar la actualización.
- Lógica afectada, auditoría y recorridos enfocados aprobados. No se atribuyen audio completo, dispositivo Android físico, app iOS nativa, builds desktop ni publicación.
- La copia de fixture `live-verification` quedó en Dev porque su limpieza fue cancelada y no se reintentó. No es la partida personal.
- Últimos advisors tras endurecimiento: sin avisos de RLS/permisos; protección contra contraseñas filtradas desactivada, pendiente revisión sin activar un plan de pago.

## Antes de vender

Correo de producción y dominio/callbacks HTTPS de web/apps; política de privacidad, retención/eliminación y restauración operativa; cuotas/capacidad y condiciones de Free; dispositivos/plataformas finales; compra/recibos y configuración de cada tienda. Cuenta no equivale a compra ni cross-buy. Ninguno autoriza contratar o publicar ahora.

Cierre de firma Android (19-10-2026): CI [39337750907](https://github.com/Jaywrkr/WHITEDOT/actions/runs/39337750907) aprobado con clave estable, copia local fuera de Git y secreto de repositorio; falta de secreto detiene build. Huella pública SHA-256 `1f7b2c71e607180eb3b7f949de02b1e5c5c994cd414be16fe25d7ac501fa2490`. APKs y hashes comprobados. En `.accounts.signingprobe`, guardado local por cuenta con 137 chispas/compra dust persiste antes y después de actualización v1→v2 con `install -r`. No se repitieron login/audio/suites completas. Alpha.57 real sigue intacta; existe copia privada local del APK y datos para volver atrás. Migración desde su firma perdida autorizada y completada: 280 archivos privados restaurados con hashes idénticos; sesión conectada y 52 chispas (72 ganadas/20 gastadas) conservadas. Actualización real posterior mediante `install -r`, cierre forzado y reapertura mantienen esos mismos valores y acceso sin clave. Lanzador apunta al APK estable; respaldo privado de rollback retenido. La extracción por stdin falló; se restauró desde archivo temporal del emulador, eliminado tras verificar. La clave estable corresponde a vista previa, no a publicación en tiendas.
