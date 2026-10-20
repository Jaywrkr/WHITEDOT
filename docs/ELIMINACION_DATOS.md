# Eliminación de cuenta y datos

Preparado el 19 de octubre de 2026. Instrucciones actuales y procedimiento de producción pendiente; nada publicado ni ejecutado por este documento.

## Texto preparado para la futura página pública

**Eliminar tu cuenta de Kubono**

En el juego abre **Menú → Cuenta → Eliminar cuenta**, escribe el correo y la contraseña de tu cuenta y confirma. Al completarse se eliminan tu cuenta y tus partidas online. La acción no solicita un reembolso ni elimina las operaciones que la tienda conserve por su cuenta.

Si ya no tienes la aplicación o no puedes entrar, solicita la eliminación en **[correo público pendiente]**, con el asunto «Eliminar cuenta de Kubono» y el correo de la cuenta. No envíes contraseñas, códigos ni enlaces de recuperación. Antes de borrar verificaremos que la cuenta es tuya. Objetivo aprobado: resolver en **7 días tras verificar identidad**. El buzón y el procedimiento deben estar operativos antes de publicar.

El borrado actual conserva las partidas locales en tus dispositivos. Puedes quitarlas borrando los datos del sitio o de la aplicación; esa operación puede afectar a otras cuentas de la misma instalación. Las copias exportadas se eliminan por separado. Retención aprobada para producción: registros técnicos bajo nuestro control hasta 7 días; soporte 90 días desde el cierre; respaldos gestionados con rotación de 7 días. Antes de publicar falta aplicar estos plazos y confirmar los propios de proveedores y cualquier excepción legal justificada. Reaplicar los borrados antes de poner en servicio una restauración.

## Alcance técnico comprobado

| Elemento | Comportamiento actual | Pendiente de cierre |
|---|---|---|
| Identidad y sesiones del servidor | `kubono_delete_account` elimina `auth.sessions` y `auth.users`; exige autenticación reciente | No equiparar borrado de sesiones a caducidad inmediata de todo JWT ya emitido |
| Partidas online de la cuenta | Eliminación en cascada de `kubono_saves` | Mantener este alcance al añadir futuras tablas |
| Sesión del dispositivo que solicita | El cliente limpia su sesión tras éxito y vuelve a la entrada | No anunciar éxito si falla el RPC |
| Guardados locales y copias de conflictos | Se conservan, como advierte el diálogo actual | Recomendado antes de tienda: limpiar solo datos locales de la cuenta eliminada y alinear el aviso; requiere cambio de código separado |
| Otros dispositivos offline | No hay borrado remoto del almacenamiento | Definir limpieza al confirmar revocación online, sin tratar una caída de red como orden de borrado |
| Registros, soporte y respaldos de operación | Plazos aprobados; controles de CI/copia local aplicados, resto pendiente según configuración de producción | Responsable y plazos de proveedores pendientes; aplicar la política de conservación |

No hay sesiones multijugador en este lanzamiento. No eliminar otra cuenta, su progreso local ni la partida de Jay para verificar este flujo. La evidencia existente de UI/RPC permanece válida; no se repite en esta preparación documental.

## Procedimiento de soporte propuesto

1. Recibir solicitud por el canal público que se apruebe. Registrar fecha, identificador mínimo y estado; nunca contraseñas ni tokens.
2. Verificar el control del correo de la cuenta mediante un intercambio con ese correo. Un mensaje de un tercero que indique otro correo no basta. No pedir documentos de identidad por defecto.
3. Confirmar alcance y consecuencias. Ejecutar el borrado con un procedimiento administrativo autorizado y auditable; el RPC del cliente requiere su propia sesión, no admite suplantar al usuario desde soporte. No exponer claves administrativas en web/apps.
4. Comprobar ausencia de usuario y partidas asociadas, comunicar resultado y registrar solo lo imprescindible. Explicar cualquier excepción de retención y cuándo finalizará.
5. Mantener un registro protegido de borrados durante la ventana de respaldos. Antes de volver a poner en servicio una restauración, reaplicar esos borrados para no reactivar cuentas eliminadas. Purgar ese registro cuando termine su necesidad y plazo aprobado.

Este procedimiento tiene objetivo aprobado de 7 días tras verificar identidad; está preparado, no automatizado ni operativo hasta elegir buzón y responsable y aplicar la conservación aprobada. La opción sencilla para la futura página web es instrucciones y un enlace al correo de soporte verificado: no requiere un formulario ni otro método de login.

## Referencias de tienda

Google Play exige una vía dentro de la app y un recurso web funcional para solicitar eliminación sin reinstalarla; el recurso puede facilitar un correo de soporte. [Requisitos oficiales](https://support.google.com/googleplay/android-developer/answer/13327111).

Apple exige ofrecer el inicio de eliminación dentro de las apps que permiten crear cuenta; revisar el flujo final junto con los datos asociados. [Referencia oficial](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion).
