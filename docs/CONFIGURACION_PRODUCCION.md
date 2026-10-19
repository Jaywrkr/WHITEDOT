# Configuración para lanzar cuentas y guardados

Preparado el 19 de octubre de 2026. Lista de preparación; no autoriza publicar, contratar, comprar dominio, crear proyectos o modificar servicios. Continuación de D06/D20/D22 del [plan](PLAN_LANZAMIENTO.md), sin otro catálogo de tareas.

## Datos que debe confirmar Jay

- [ ] Nombre legal del responsable, país y correo público de soporte/privacidad. El Gmail usado en pruebas no se convierte automáticamente en contacto público.
- [ ] Primeros mercados y quién atenderá solicitudes; ajustar privacidad y bases legales al responsable y a esos mercados.
- [x] Público objetivo de 16 años o más, aprobado por Jay el 19 de octubre de 2026; clasificación de tienda y obligaciones locales se cierran por separado.
- [x] Plazos aprobados por Jay el 19 de octubre de 2026 según la tabla siguiente; configuración, retención de proveedores y excepciones justificadas siguen pendientes.

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

Aprobación del 19 de octubre de 2026. No se ha configurado purga, exportación ni automatización por esta decisión. Confirmar los plazos propios de proveedores y las excepciones legales aplicables antes de publicar. La frecuencia de las exportaciones y el tiempo de recuperación siguen pendientes: una ventana de retención de 7 días no equivale a una copia diaria ni garantiza recuperar todos los cambios.

Las copias privadas de migración del emulador contienen sesión y progreso: conservarlas solo mientras haga falta rollback; eliminar al cerrar esa ventana. Mantener la clave de firma por separado, pues sí se necesita para futuras actualizaciones. No borrar ninguna ahora.

## Criterio de cierre

No repetir PC/iPhone/emulador, RLS, sincronización o actualización ya aprobados. Cuando haya configuración/paquetes finales, comprobar una sola vez únicamente lo que cambió: enlaces y correo públicos, eliminación completa en cuenta desechable, restauración operativa aislada y continuidad en paquetes finales. Hasta entonces, documentos preparados no equivalen a cumplimiento aprobado ni servicio publicado.
