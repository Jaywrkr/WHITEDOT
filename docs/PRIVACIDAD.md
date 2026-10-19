# Privacidad de Kubono · borrador

Preparado el 19 de octubre de 2026. No publicado. Describe la versión actual; completar los campos pendientes antes de usarlo en tiendas. Configuración y decisiones pendientes en [Producción](CONFIGURACION_PRODUCCION.md).

## Responsable y contacto

Kubono es un juego de exploración y música. Responsable: **[nombre legal y país pendientes]**. Contacto para privacidad y soporte: **[correo público pendiente]**. Fecha de entrada en vigor: **[pendiente de lanzamiento]**.

## Datos y finalidad

| Datos | Para qué se utilizan | Dónde se procesan |
|---|---|---|
| Correo, identificador de cuenta y credenciales de autenticación | Crear la cuenta, iniciar sesión, confirmar correo y recuperar acceso | Supabase Auth; la contraseña se transmite por HTTPS a Auth, que almacena su hash, no una copia legible |
| Tokens de sesión | Mantener el acceso sin pedir la contraseña cada vez | Almacenamiento local del navegador o aplicación y servicio de autenticación; el cliente no guarda tu contraseña |
| Partida: mundos/semillas, posición dentro del juego, chispas, compras con chispas, colecciones, logros y preferencias incluidas en el guardado | Conservar el avance y continuar entre dispositivos | Dispositivo y base de datos de Supabase vinculada a la cuenta |
| Datos técnicos de las solicitudes, como IP, hora y errores | Entregar y proteger el servicio, diagnosticar fallos | Proveedores de infraestructura, según su configuración de registros |
| Mensajes que envíes a soporte | Resolver incidencias y solicitudes sobre tus datos | Buzón de soporte y herramientas que finalmente se seleccionen |

Las coordenadas del cubo son del mundo virtual, no tu ubicación GPS. La música se genera en el dispositivo; el cliente revisado no graba micrófono. No incorpora SDK publicitario ni de analítica de terceros. Los registros de infraestructura se tratan por separado: no se declara que el juego «no recoge datos».

## Proveedores y transferencias

Supabase presta autenticación y almacenamiento online. El entorno de desarrollo está en Estados Unidos (us-east-1); confirmar región y condiciones del entorno final antes de publicar. La web utiliza Vercel como alojamiento; confirmar la configuración final. Los proveedores de correo y las plataformas de distribución se identificarán al seleccionarlos. No se ha incorporado venta de datos ni publicidad dirigida.

Para la distribución de pago, las tiendas gestionarán sus propias operaciones conforme a sus políticas. No se ha implementado todavía recepción/validación de recibos en Kubono: esta política debe actualizarse si el juego empieza a tratarlos. Una cuenta de juego no concede por sí sola compra compartida entre tiendas.

Antes de publicar se documentarán las condiciones contractuales, bases legales y mecanismos de transferencia aplicables al responsable y a los mercados elegidos. Este borrador no declara ese trabajo completado.

## Conservación, seguridad y eliminación

La cuenta y el avance online se mantienen mientras utilizas el servicio y hasta su eliminación. No hay una purga automática por inactividad configurada. Se aplican HTTPS y controles de acceso por cuenta; ninguna medida garantiza seguridad absoluta.

Puedes eliminar la cuenta desde **Menú → Cuenta → Eliminar cuenta**, confirmando tus credenciales. El sistema actual elimina el usuario, sus sesiones del servidor y sus partidas online. Conserva las partidas locales y las copias de conflictos en los dispositivos: cerrar sesión o eliminar la cuenta no equivale a borrar esos archivos. Las sesiones de otros dispositivos pueden tardar en detectar la eliminación; una copia offline no se borra a distancia.

Para retirar las copias locales, borra los datos del sitio en el navegador o los datos de la aplicación desde el sistema operativo; esto puede borrar también partidas de otras cuentas que usen esa misma instalación. Los archivos que hayas exportado o respaldado fuera del juego requieren eliminación por separado. Consulta [Eliminación de datos](ELIMINACION_DATOS.md).

Política aprobada por Jay el 19 de octubre de 2026 para producción:

| Datos o solicitud | Conservación o atención aprobada |
|---|---|
| Cuenta y progreso | Hasta eliminación, sin borrado por inactividad |
| Eliminación desde el juego | Datos online al completarse la operación |
| Solicitud de eliminación por soporte | Objetivo: resolver en 7 días tras verificar identidad |
| Registros técnicos bajo nuestro control | Hasta 7 días |
| Conversaciones de soporte | 90 días después de cerrar la incidencia |
| Respaldos que gestionemos | Rotación de 7 días; reaplicar eliminaciones antes de volver a servir una restauración |

**Aprobado no significa configurado:** aplicar la rotación/purga y confirmar los plazos propios de proveedores antes de publicar; documentar cualquier excepción legal justificada. El objetivo de soporte no está operativo mientras no exista el canal público. No se promete borrado instantáneo de copias históricas. La copia técnica local usada para migrar el APK de desarrollo no es un respaldo del servicio de producción.

## Solicitudes y público

Escribe a **[correo pendiente]** para solicitar acceso, corrección, eliminación o información sobre tus datos y los derechos aplicables en tu país. Verificaremos que la solicitud corresponde a tu cuenta sin pedir tu contraseña ni códigos de acceso. La vía web de solicitud está pendiente de activar; el objetivo de resolución aprobado es de 7 días tras verificar identidad.

Público objetivo aprobado: personas de **16 años o más**. La clasificación de contenido de cada tienda se determinará por su cuestionario y no se sustituye por esta decisión. Este texto no implementa verificación de edad; antes de publicar se alinearán la comunicación y las obligaciones de los mercados elegidos con ese público. Los cambios materiales se comunicarán en los canales del juego que se habiliten para el lanzamiento.
