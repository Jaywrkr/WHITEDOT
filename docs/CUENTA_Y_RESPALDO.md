# Cuenta opcional y respaldo · desarrollo

Estado: código local sin proyecto Supabase configurado. Rama feature/optional-cloud-save desde main ba9c31a. Sin despliegue ni contratos; Supabase Free acordado para pruebas. CORESOLUTIONS y su proyecto permanecen intactos por decisión de Jay.

## Preparación pendiente

1. Jay elige otra organización; confirmar tarifa cero antes de crear un proyecto nuevo aislado. No activar planes, add-ons ni branches de pago.
2. Revisar `supabase/setup.sql` y aplicarlo solo al proyecto nuevo de prueba. Es un script transaccional de preparación, no una migración aplicada. No había CLI, Docker ni PostgreSQL local disponibles; no se inventó historial de migraciones. Cuando haya entorno, validar SQL, RLS y advisors y generar la migración con CLI conforme a la guía Supabase.
3. En `src/cloud-config.js`, indicar URL HTTPS exacta `https://REF.supabase.co` y clave **sb_publishable_...**. Es información pública. Jamás poner contraseñas de base, claves secretas ni service_role. Configuración vacía: sin red ni bloqueo de juego. La misma API HTTPS usa Authorization/apikey, sin cookies de terceros, desde web y assets locales Android; verificar en dispositivo.
4. Activar confirmación de correo. En plantillas de confirmación y recuperación, incluir `{{ .Token }}`: el jugador escribe el código en el juego. Evita enlaces/deep links entre navegador y contenedor. Mantener límites de intentos; no desactivar verificación para aparentar que funciona.
5. El correo predeterminado de Supabase está limitado a destinatarios autorizados y cuotas de desarrollo; comprobarlos. SMTP propio y dominio verificado antes de una beta pública. No se ha contratado correo ni enviado mensajes.

## Comportamiento

Menú → Cuenta y respaldo. Sin cuenta: juego/guardado local intactos. Crear cuenta, confirmar código o entrar; primera conexión por mundo exige elegir «Usar esta partida» o «Recuperar copia». Sin elección no hay subida automática. Confirmar una subida reemplaza la copia online de ese mundo usando su revisión conocida; una revisión concurrente detiene las subidas y no sobrescribe. No hay mezcla automática de partidas.

Después de elegir, el cliente recuerda revisión por usuario/mundo en este dispositivo y respalda como máximo cada minuto en primer plano; no usa un guardado remoto como reemplazo automático. Si la revisión coincide al volver a entrar, continúa el respaldo. Sin red conserva la partida local y reintenta de forma acotada. Cerrar/suspender antes del minuto puede dejar una copia remota anterior: «respaldar» manual permite cerrar con una copia reciente. No es sincronización continua ni promesa de cero pérdida si el dispositivo se pierde.

Auth se conserva solo durante la sesión de esa pestaña/WebView (sessionStorage, con fallback en memoria), nunca dentro de la partida/exportación. Las contraseñas no se persisten. El token se renueva antes de vencer, sin almacenar claves privilegiadas. No ofrece «recordarme» persistente al cerrar el proceso: revisar UX y almacenamiento seguro de cada plataforma antes de producción. Un origen con scripts comprometidos podría leer tokens del navegador; requiere revisión de seguridad final.

Recuperar valida mundo/versión/esquema, verifica el guardado local y conserva `:before-restore`. Descargar no cambia la partida. Eliminar exige confirmación y volver a autenticar con clave; SQL exige una sesión reciente, revoca sesiones y elimina usuario/copias. La partida local se conserva. Sin salas ni llamadas a /api/rooms. El backend Python y módulo de duetos se conservan como históricos y no se inicializan desde main.

## Permisos y cuotas

RLS filtra por auth.uid y excluye invitados anónimos. Foreign key a auth.users con cascade; ninguna clave secret en cliente. RPC con comparación atómica de revisión, máximo 64 mundos por usuario y 1 MiB por copia; el guardado local conserva su límite previo de 8 MiB. Guardados mayores siguen locales y deben mostrar error de copia online. Trigger también comprueba cuotas/revisión para escrituras directas por tabla. El borrado usa privilegios elevados solo para el propio auth.uid y sesión reciente; necesita validación/advisors en Supabase real antes de exponerlo.

No se prometen guardados para siempre con Free: política de retención, restauración operativa, abuso/capacidad y plan de producción siguen pendientes. Compra en tienda no equivale a cuenta ni a cross-buy. No existe migración automática de usuarios/passwords del backend Python anterior.

## Verificación

`node tests/cloud-account.mjs`: adaptador REST y coordinador de copias con fixtures; no verifica base real. `python tests/cloud_account_smoke.py`: navegador real con Supabase HTTP interceptado. Nunca envía datos de usuario a Supabase real. `tests/duet_smoke.py` prueba exclusivamente el módulo histórico inyectado por su fixture; no habilita salas en el lanzamiento. Los contratos de interfaz/render se actualizan para el acceso opcional sin sondeo de /api/session.

Pendiente: SQL/RLS real entre dos usuarios, carreras simultáneas, cuotas, sesión vencida/borrada, correo real, copia completa, actualización PWA y validación en Android/iOS/escritorio. Sin proyecto elegido no se declara aceptación online. Revisado changelog Supabase: retirada de cifrados TLS CBC antiguos prevista desde noviembre 2026; probar con sistemas/WebView actualizados.

Resultado local de esta iteración: 8 suites Node afectadas y auditoría aprobadas; recorrido nuevo de cuenta en Chromium aprobado con HTTP simulado. No se ejecutó la suite completa ni renders de audio. Adaptación de entorno Windows: Node con adaptador externo para python3, Playwright existente en PYTHONPATH y licencias auditadas con bytes originales de Git sin cambios versionados.

Recorridos afectados adicionales: interfaz en cinco tamaños, regresión de ojos/render y duetos históricos aprobados. El servidor histórico registró una conexión abortada al cerrar el navegador en Windows; las aserciones del recorrido pasaron. No se modificó ese backend ajeno al lanzamiento.
