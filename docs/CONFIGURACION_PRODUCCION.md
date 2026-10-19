# Configuración para lanzar cuentas y guardados

Preparado el 19 de octubre de 2026. Lista de preparación; no autoriza publicar, contratar, comprar dominio, crear proyectos o modificar servicios. Continuación de D06/D20/D22 del [plan](PLAN_LANZAMIENTO.md), sin otro catálogo de tareas.

## Datos que debe confirmar Jay

- [ ] Nombre legal del responsable, país y correo público de soporte/privacidad. El Gmail usado en pruebas no se convierte automáticamente en contacto público.
- [ ] Público por edades y primeros mercados; ajustar privacidad y bases legales a esa decisión.
- [ ] Plazos de registros, mensajes de soporte y respaldos; aprobar las excepciones necesarias y quién atenderá solicitudes.

`playkubono.com` es dominio previsto, no comprado. No existen aún URLs públicas de privacidad o eliminación.

## Cambios y configuración pendientes

| Área | Acción concreta antes de salir | Estado |
|---|---|---|
| Entorno | Decidir proyecto final o conversión controlada de Dev; separar datos de pruebas y usuarios reales. No reaplicar `setup.sql` sobre el proyecto existente | Pendiente; Dev Free intacto |
| Correo | Elegir envío apto para cualquier comprador; verificar remitente/dominio, cuotas, confirmación y recuperación. No confundir correo de desarrollo con servicio final | Sin proveedor contratado |
| Recuperación | Sustituir `http://localhost:3000/` hardcoded en `src/cloud-client.js` y el aviso de servidor local de `src/cloud-account.js`; configurar destino final de alta en Auth y página `recovery.html` | Requiere cambio de código posterior, no solo panel |
| URLs | Site URL y lista exacta de redirecciones HTTPS en Supabase; separar localhost/LAN de producción. Definir retorno a web/app para cada plataforma | Pendiente; sin comodines amplios |
| Privacidad | Completar [borrador](PRIVACIDAD.md), retención y proveedores; preparar URL pública accesible y enlazarla desde app/tiendas | Texto preparado, no publicado |
| Eliminación | Activar recurso web con canal real de solicitud; designar responsable y plazos. Alinear borrado local y aviso de app con [procedimiento](ELIMINACION_DATOS.md) | Pendiente; RPC online existente |
| Acceso y datos | Mantener RLS por propietario, claves publicables en cliente y secretos solo en administración/CI; revisar expiración de JWT y detección de revocación en dispositivos | Base comprobada; revisión final sobre configuración definitiva |
| Protección y capacidad | Límites de Auth, envío, solicitudes y guardados; supervisar espacio/egreso/usuarios y alertas. No activar planes/add-ons automáticamente | Presupuestar con uso real |
| Respaldos | Definir exportación cifrada, ubicación fuera del proyecto, responsable, frecuencia, ventana de retención y restauración con borrados reaplicados | No configurado por estos documentos |
| Distribución | Clave de firma de tienda custodiada y paquete final; la firma estable comprobada es de vista previa. Cuenta no equivale a licencia ni a cross-buy | Separado del cierre funcional de guardados |
| Declaraciones | Completar Data Safety/App Privacy según datos realmente enviados, incluidos cuenta, progreso y registros técnicos; revisar tratamiento de compras cuando exista | No declarar «sin recogida de datos» |

En Free, Supabase recomienda exportaciones propias y copias fuera del servicio; no asumir acceso a respaldos diarios administrados de los planes de pago. [Documentación oficial](https://supabase.com/docs/guides/platform/backups). Preparar el procedimiento ahora no crea una copia de producción ni contrata un servicio. La exportación debe incluir lo necesario para recuperar Auth y guardados: un dump de tablas de juego por sí solo no restaura las cuentas.

## Retención propuesta para decidir, todavía no aplicada

Cuenta/partida: hasta eliminación, sin prometer purga por inactividad. Elegir la menor retención útil para logs de seguridad, soporte y respaldos; registrar valores exactos, justificación, ubicación y mecanismo de purga antes de publicarlos. No inventar un plazo para el proveedor. Definir cuánto avance podría perderse entre exportaciones y el tiempo de recuperación aceptable, sin venderlos como garantía todavía.

Las copias privadas de migración del emulador contienen sesión y progreso: conservarlas solo mientras haga falta rollback; eliminar al cerrar esa ventana. Mantener la clave de firma por separado, pues sí se necesita para futuras actualizaciones. No borrar ninguna ahora.

## Criterio de cierre

No repetir PC/iPhone/emulador, RLS, sincronización o actualización ya aprobados. Cuando haya configuración/paquetes finales, comprobar una sola vez únicamente lo que cambió: enlaces y correo públicos, eliminación completa en cuenta desechable, restauración operativa aislada y continuidad en paquetes finales. Hasta entonces, documentos preparados no equivalen a cumplimiento aprobado ni servicio publicado.
