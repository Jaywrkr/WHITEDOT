# Documentación vigente de Kubono

Actualizada el 20 de octubre de 2026. Este índice distingue estado actual, decisiones de lanzamiento y evidencia histórica. El código y los registros de una revisión concreta prevalecen sobre una frase antigua; una contradicción se investiga, no autoriza a cambiar el juego.

## Orden de lectura para revisar el proyecto

1. [Traspaso actual a Claude](../HANDOFF_CLAUDE.md).
2. [Reglas de trabajo](../AGENTS.md) y [README](../README.md).
3. La guía del área concreta, según la tabla. No hace falta leer todos los planes históricos.

| Documento | Fuente para |
|---|---|
| [Arquitectura](ARQUITECTURA.md) | Módulos, admisión, audio/render, persistencia y límites técnicos |
| [Cuenta y progreso](CUENTA_Y_RESPALDO.md) | Login obligatorio, sincronización automática, recuperación, eliminación y evidencia real |
| [Android](../android/README.md) | APK de cuentas, firma estable, migración y alcance del emulador |
| [Hallazgos y actividades](HALLAZGOS_Y_ACTIVIDADES.md) | Contenido, gestos y recompensas, no una lista de funciones pendientes |
| [Verificación](VERIFICACION.md) | Pruebas enfocadas frente a cierre completo, CI y límites de evidencia |
| [Plan de lanzamiento](PLAN_LANZAMIENTO.md) | Único catálogo vigente de entregables D01–D22 y decisiones comerciales |
| [Configuración de producción](CONFIGURACION_PRODUCCION.md) | Controles aplicados, proveedores/correo pendientes y retención |
| [Privacidad](PRIVACIDAD.md) | Borrador no publicado, público 16+, tratamiento y plazos aprobados |
| [Eliminación](ELIMINACION_DATOS.md) | Borrado online actual, copias locales conservadas y procedimiento de soporte pendiente |
| [Cambios](../CAMBIOS.md) | Resumen reciente; detalles anteriores archivados con su revisión |
| [Créditos](../CREDITOS.md) | Autoría y licencias; no sustituye la política de privacidad |
| [Servidor y duetos](SERVIDOR_Y_DUETOS.md) | Aviso de que el prototipo Python no es el backend del lanzamiento |

## Reglas de mantenimiento

- Las decisiones nuevas sustituyen las antiguas; no añadir párrafos contradictorios al final de las guías.
- Separar «aprobado», «implementado», «configurado», «probado» y «publicado». Una prueba aislada o simulada no prueba el servicio real; un APK no prueba iOS ni Android físico.
- Los plazos de privacidad aprobados no significan que todos los proveedores ya los apliquen. El estado efectivo se registra en Configuración de producción.
- No duplicar pendientes en varios planes. El traspaso resume y enlaza D01–D22; no inicia su ejecución.
- [Archivo histórico](historial/README.md): referencias y hechos de otras revisiones. Ninguna fase antigua autoriza trabajo nuevo.
