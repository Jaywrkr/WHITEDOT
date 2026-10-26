# Documentación de Kubono

Vigente para **alpha.207**,26 de octubre de2026. La rama de continuación es `chore/claude-handoff-cleanup`; main todavía contiene alpha.200.

## Empezar

[AGENTS](../AGENTS.md) → [README](../README.md) → **[HANDOFF](../HANDOFF.md)** → guía del sistema. [Entrada para Claude](../HANDOFF_CLAUDE.md) usa el mismo traspaso.

## Entrega actual y pendientes

| Documento | Contenido |
|---|---|
| [E1–E7](ENTREGA_E.md) | Lo implementado, ramas y prueba de cada fase |
| [Auditoría E](panel/candidato-e/informe.md) | Hallazgos, correcciones, notas simuladas y límites |
| [Verificación](VERIFICACION.md) | Pruebas enfocadas, cierre completo y evidencia reutilizable |
| [Pruebas con personas](PRUEBAS_CON_PERSONAS.md) | Protocolo pendiente; [registro vacío](aceptacion-e.json) |
| [Limpieza](LIMPIEZA_REPOSITORIO.md) | Archivos retirados, preservación y recuperación |

## Guías vigentes del sistema

| Área | Guía |
|---|---|
| Recorrido, reglas, orientación y URL de prueba | [El mundo](MUNDO.md) |
| Capítulos, frase y final5 | [El Viaje](VIAJE.md) |
| Regiones, familias y direcciones guardadas | [Universo](UNIVERSO.md) |
| Inicialización, módulos, audio, UI y guardado | [Arquitectura](ARQUITECTURA.md) |
| Objetos, encuentros y actividades | [Hallazgos](HALLAZGOS_Y_ACTIVIDADES.md) |
| Personalización y catálogo construido | [Tienda del cubo](TIENDA_DEL_CUBO.md) |
| Habitaciones, objetos y jardín musical | [Casa viva](CASA_VIVA.md) |
| Guardado local, cuenta y recuperación | [Cuenta y progreso](CUENTA_Y_RESPALDO.md) |
| Auditoría creativa y método | [Panel](PANEL.md) |
| Herramientas y resultados generados | [Scripts](../scripts/README.md) |
| Procedencia de motivos visuales | [Referencias VJ](REFERENCIAS_VJ.md) y [Créditos](../CREDITOS.md) |

## Lanzamiento y plataformas

[Backlog D01–D22](PLAN_LANZAMIENTO.md) conserva decisiones y pendientes comerciales. [Producción](CONFIGURACION_PRODUCCION.md) distingue preparado/aplicado; Supabase está pausado. [Material de tienda](TIENDAS.md), [Privacidad](PRIVACIDAD.md) y [Eliminación](ELIMINACION_DATOS.md) son borradores sin publicar. [Android](../android/README.md) describe el contenedor de prueba, no una salida en tiendas.

## Historial y evidencia de entregas anteriores

Estos documentos conservan hechos de su revisión; **no son fases nuevas por ejecutar**. No reescribir capturas, mediciones o notas para aparentar una validación actual.

- [Integración alpha.200](INTEGRACION_ALPHA_200.md):main y CI aprobado.
- [Entrega N](ENTREGA_N.md), [candidato N](panel/candidato-n/informe.md), [entrega L](ENTREGA_L.md), [cierre K](CIERRE_K.md) y [cierre J](PULIDO_CIERRE.md).
- Informes del panel:[1](panel/sesion-1/informe.md), [2](panel/sesion-2/informe.md), [3](panel/sesion-3/informe.md), [4](panel/sesion-4/informe.md), [5](panel/sesion-5/informe.md), [6](panel/sesion-6/informe.md), [7](panel/sesion-7/informe.md), [8](panel/sesion-8/informe.md), [9](panel/sesion-9/informe.md).
- [CAMBIOS](../CAMBIOS.md):cronología; la guía actual de cada sistema prevalece sobre una propuesta anterior.

Los traspasos/planes retirados siguen en Git. Para la limpieza actual, revisión anterior `7f6374b3`; para el archivo eliminado el24 de octubre, `git show 5914ca9:docs/historial/NOMBRE.md`. No hace falta restaurarlos para continuar.
