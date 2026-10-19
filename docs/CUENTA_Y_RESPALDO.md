# Cuenta opcional y respaldo · desarrollo

Estado: rama local conectada a Kubono Dev (`eghmydqxsicqmbmeprgq`), organización Kubono (`eebalwznymfdxaexvghc`), región us-east-1 y plan Free comprobados el 19 oct 2026. Aplicación sin publicar. Rama feature/account-recovery-link desde main 20ebdf4; cuentas previas integradas en main por Jay. Sin despliegue ni contratos; Supabase Free acordado para pruebas. CORESOLUTIONS y su proyecto permanecen intactos por decisión de Jay.

## Preparación pendiente

1. Proyecto Free creado por Jay y acceso autorizado. Sin planes, add-ons ni branches de pago.
2. Esquema y endurecimiento aplicados por MCP como `kubono_optional_cloud_saves` y `harden_cloud_save_privileges`. `supabase/setup.sql` representa el esquema consolidado; no volver a ejecutarlo en este proyecto. Se usó apply_migration para DDL conforme al contrato de la herramienta; no se inventó historial CLI.
3. En `src/cloud-config.js`, indicar URL HTTPS exacta `https://REF.supabase.co` y clave **sb_publishable_...**. Es información pública. Jamás poner contraseñas de base, claves secretas ni service_role. Configuración vacía sigue admitida para modo local; esta rama usa únicamente la clave publicable del proyecto Dev. La misma API HTTPS usa Authorization/apikey, sin cookies de terceros, desde web y assets locales Android; verificar en dispositivo.
4. Confirmación de correo activada y alta por enlace real comprobada. El panel exige SMTP propio para editar plantillas; con el correo predeterminado no se pudo añadir `{{ .Token }}`. No se contrató/configuró SMTP ni se desactivó la confirmación. Se usa el enlace predeterminado: confirmación por correo y recuperación mediante página local, sin exigir códigos personalizados.
5. El correo predeterminado de Supabase está limitado a destinatarios autorizados y cuotas de desarrollo; comprobarlos. SMTP propio y dominio verificado antes de una beta pública. No se ha contratado correo. Solicitud real de recuperación aceptada con HTTP 200; cambio privado de clave pendiente de confirmación del usuario.

## Comportamiento

Menú → Cuenta y respaldo. Sin cuenta: juego/guardado local intactos. Crear cuenta, confirmar mediante enlace o entrar; primera conexión por mundo exige elegir «Usar esta partida» o «Recuperar copia». Sin elección no hay subida automática. Confirmar una subida reemplaza la copia online de ese mundo usando su revisión conocida; una revisión concurrente detiene las subidas y no sobrescribe. No hay mezcla automática de partidas.

Después de elegir, el cliente recuerda revisión por usuario/mundo en este dispositivo y respalda como máximo cada minuto en primer plano; no usa un guardado remoto como reemplazo automático. Si la revisión coincide al volver a entrar, continúa el respaldo. Sin red conserva la partida local y reintenta de forma acotada. Cerrar/suspender antes del minuto puede dejar una copia remota anterior: «respaldar» manual permite cerrar con una copia reciente. No es sincronización continua ni promesa de cero pérdida si el dispositivo se pierde.

Auth se conserva solo durante la sesión de esa pestaña/WebView (sessionStorage, con fallback en memoria), nunca dentro de la partida/exportación. Las contraseñas no se persisten. El token se renueva antes de vencer, sin almacenar claves privilegiadas. No ofrece «recordarme» persistente al cerrar el proceso: revisar UX y almacenamiento seguro de cada plataforma antes de producción. Un origen con scripts comprometidos podría leer tokens del navegador; requiere revisión de seguridad final.

Recuperar valida mundo/versión/esquema, verifica el guardado local y conserva `:before-restore`. Descargar no cambia la partida. Eliminar exige confirmación y volver a autenticar con clave; SQL exige una sesión reciente, revoca sesiones y elimina usuario/copias. La partida local se conserva. Sin salas ni llamadas a /api/rooms. El backend Python y módulo de duetos se conservan como históricos y no se inicializan desde main.

## Permisos y cuotas

RLS filtra por auth.uid y excluye invitados anónimos. Foreign key a auth.users con cascade; ninguna clave secret en cliente. RPC con comparación atómica de revisión, máximo 64 mundos por usuario y 1 MiB por copia; el guardado local conserva su límite previo de 8 MiB. Guardados mayores siguen locales y deben mostrar error de copia online. Trigger también comprueba cuotas/revisión para escrituras directas por tabla. El borrado usa privilegios elevados solo para el propio auth.uid y sesión reciente; necesita validación/advisors en Supabase real antes de exponerlo.

No se prometen guardados para siempre con Free: política de retención, restauración operativa, abuso/capacidad y plan de producción siguen pendientes. Compra en tienda no equivale a cuenta ni a cross-buy. No existe migración automática de usuarios/passwords del backend Python anterior.

## Verificación

`node tests/cloud-account.mjs`: adaptador REST y coordinador de copias con fixtures; no verifica base real. `python tests/cloud_account_smoke.py`: navegador real con Supabase HTTP interceptado. Nunca envía datos de usuario a Supabase real. `tests/duet_smoke.py` prueba exclusivamente el módulo histórico inyectado por su fixture; no habilita salas en el lanzamiento. Los contratos de interfaz/render se actualizan para el acceso opcional sin sondeo de /api/session.

Pendiente: carreras HTTP simultáneas, cuotas completas, sesión vencida/borrada, recuperación por enlace, eliminación real, actualización PWA y validación en Android/iOS/escritorio. El servicio real tiene aceptación parcial, no cierre de lanzamiento. Revisado changelog Supabase: retirada de cifrados TLS CBC antiguos prevista desde noviembre 2026; probar con sistemas/WebView actualizados.

Resultado local de esta iteración: 8 suites Node afectadas y auditoría aprobadas; recorrido nuevo de cuenta en Chromium aprobado con HTTP simulado. No se ejecutó la suite completa ni renders de audio. Adaptación de entorno Windows: Node con adaptador externo para python3, Playwright existente en PYTHONPATH y licencias auditadas con bytes originales de Git sin cambios versionados.

Recorridos afectados adicionales: interfaz en cinco tamaños, regresión de ojos/render y duetos históricos aprobados. El servidor histórico registró una conexión abortada al cerrar el navegador en Windows; las aserciones del recorrido pasaron. No se modificó ese backend ajeno al lanzamiento.

## Evidencia real · 19 oct 2026

- Plan Free y proyecto ACTIVE_HEALTHY verificados por la conexión; CORESOLUTIONS intacto.
- Alta real aceptada, correo confirmado, login HTTP 200 y logout 204. Contraseña aleatoria/tokens de prueba solo en memoria, sin escribirlos en archivos ni commits; la cuenta de prueba requiere establecer una clave propia por un flujo de recuperación antes de uso personal.
- PostgreSQL real: dos usuarios efímeros dentro de una transacción revertida; aislamiento de lectura/escritura, rechazo anónimo, revisión conflictiva preservada y ausencia de TRUNCATE para authenticated. Fixtures de ese test no persistieron.
- REST real: insertar copia, leerla y rechazar revisión obsoleta sin sobrescribir. Después subió una partida generada por Chromium: 102 campos, seed cloud-live-check, 43 chispas; lectura desde la base idéntica al original y validación de restauración con save-store.js aprobada. No es un recorrido UI completo autenticado contra Supabase: UI/recuperación se probaron antes con HTTP simulado.
- La copia aislada `live-verification` quedó en Dev: su limpieza fue cancelada por la herramienta y no se reintentó. No es una partida personal ni modifica el mundo principal.
- Correcciones reales: eliminar grants TRUNCATE/REFERENCES/TRIGGER heredados; revocar EXECUTE público del helper rls_auto_enable; mover borrado privilegiado a kubono_private con envoltorio público invoker. Advisors posteriores sin avisos de permisos/RLS; queda aviso `auth_leaked_password_protection` (protección contra contraseñas filtradas desactivada), a revisar antes de producción sin contratar nada ahora. [Detalle oficial](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
- Hubo errores transitorios de la conexión MCP; luego se recuperó. No se ocultaron errores ni se amplió el acceso de CORESOLUTIONS.

## Recuperación local gratuita

Ejecutar `python scripts/serve-recovery.py` y mantenerlo abierto. Usa `http://localhost:3000/`, Site URL predeterminada de Supabase; si fue modificada, autorizar esa URL exacta en Authentication → URL Configuration. En el juego, escribe el correo autorizado y pulsa «Olvidé mi clave». Abre el último enlace recibido y elige una clave propia (no compartirla en el chat). Después vuelve al juego e inicia sesión.

Sin editar plantillas ni contratar SMTP. Solo destinatarios autorizados y cuota gratuita de desarrollo; no reenviar repetidamente ante límites. El callback borra el fragmento, valida el acceso contra Auth y conserva el token solo en memoria, sin tocar la partida. Recargar requiere otro enlace. Falta el cierre público/móvil, sus callbacks y correo de producción.

## Continuidad entre dispositivos · alpha.54

Después de establecer una copia común (Usar esta partida o Recuperar copia), guardamos por usuario/mundo su revisión y representación canónica exacta. Al entrar/volver/reconectar y cada 15 segundos se compara local, referencia y remoto. Avance solo remoto: restauración validada con copia local anterior. Avance solo local: respaldo sujeto a CAS. Avances en ambos: pausa y elección explícita; sin sumar monedas, elegir el máximo ni resolver por reloj. Las copias anteriores sin referencia completa requieren una elección inicial, sin inferir que son descartables.

El reloj de sesión, sus resúmenes y contadores de tiempo pasivo no se usan para declarar divergencia. El saldo, gastos, premios, posiciones, distancia y demás progreso sí. Una mutación local durante la lectura cancela la restauración. Reemplazar manualmente lo remoto preserva primero esa copia en el dispositivo; si no hay espacio, se cancela el reemplazo. La restauración conserva `:before-restore`.

Respaldo cada minuto si cambió el estado, más intento al salir/ocultar. Cargas pequeñas usan keepalive; no garantiza entrega si iOS suspende o no hay conexión. En ese caso el avance local se conserva y se reintenta al volver. Para pasar inmediatamente de dispositivo, comprobar «Respaldo online guardado»; trabajar offline en ambos requiere elegir entre copias, no fusionarlas.

Safari normal: usuario confirmó conservación de saldo al cerrar/reabrir. La discrepancia del diagnóstico correspondía a pestañas privadas distintas; en la pestaña del juego se confirmaron 4 disponibles, 24 ganadas y 20 gastadas. No se detectó pérdida de esas chispas. La nueva sincronización necesita una comprobación humana corta tras actualizar ambas páginas.

## Flujo normal · alpha.55

Entrar una vez con correo/clave; la sesión se conserva en localStorage por origen y se renueva automáticamente antes de las peticiones. No guardamos la contraseña. Una sesión antigua en sessionStorage se migra una vez. Cerrar sesión borra el acceso local y lo notifica a los otros clientes del mismo origen al comprobar su sesión; no borra la partida. Navegación privada/borrado de datos del navegador pueden eliminar la persistencia. Si el navegador bloquea almacenamiento, solo queda acceso en memoria.

No hay elección inicial obligatoria: servidor sin copia permite subir la local automáticamente; dispositivo sin moneda ganada/gastada, desplazamiento, descubrimientos ni historial de progreso permite traer la online. Copias con avances distintos sin referencia común se consideran conflicto y requieren elegir. Con referencia común se mantiene el protocolo de alpha.54. Los controles de elección se ocultan durante el uso normal y el conflicto abre Cuenta y respaldo; descarga de respaldo sigue disponible.

La persistencia sigue el patrón de cliente web descrito por [Supabase Auth](https://supabase.com/docs/reference/javascript/auth), sin añadir SDK ni métodos de acceso. La prueba automatizada usa Auth/REST simulado; falta comprobar la nueva versión una vez en Safari normal con el servicio real. No equivale a publicación ni aceptación de Android.

## Uso final · alpha.56

Menú → Cuenta: correo, contraseña y acceso persistente. Sin Guardar copia, descargar respaldo ni acciones iniciales de subida/recuperación en el flujo visible. Las elecciones de avance solo aparecen ante divergencia real. La conservación interna de copias anteriores sigue activa y no depende de un botón del jugador. Guardado/comprobación cada cinco segundos con cambios, más intento al ocultar; sin conexión se conserva localmente y se reintenta al volver. Una edición local durante una petición no causa aviso si el remoto sigue en la referencia común.

Las herramientas internas de reparación conservan sus IDs por compatibilidad, pero no tienen entrada en el menú. El servicio remoto y la conectividad siguen siendo necesarios para continuar en otro dispositivo; no se promete envío si el sistema suspende antes de completarlo.
