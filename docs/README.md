# Documentación de Kubono

Actualizada el 25 de octubre de 2026. Cada tema tiene una sola guía; si dos documentos se contradicen, manda el código y se corrige la guía.

## Orden de lectura

1. [Traspaso](../HANDOFF.md): estado y lo que pide Jay ahora.
2. [Reglas de trabajo](../AGENTS.md).
3. La guía del tema, según la tabla.

## Guías

| Documento | Para qué |
|---|---|
| [Entrega N1–N8](ENTREGA_N.md) | Mejoras autorizadas hacia nueve por categoría; cierre técnico separado de aceptación humana |
| [Auditoría 7](panel/sesion-7/informe.md) y [plan L1–L4](panel/sesion-7/plan.md) | K7 y fases L; nota con feedback real y límites de aceptación |
| [Panel 8 ciego](panel/sesion-8/informe.md) | Diez lentes sin notas previas, evaluación exigente por categoría y defectos reproducidos |
| [Entrega L1–L4](ENTREGA_L.md) | Ayuda de lugares, frase propia, persistencia, accesibilidad y cierre técnico; aceptación humana pendiente |
| [Entrega K1–K6](CIERRE_K.md) | Ramas, correcciones verificadas y prueba en teléfono |
| [Auditoría 6](panel/sesion-6/informe.md) y [plan K1–K5](panel/sesion-6/plan.md) | Feedback real, acceso al anillo, final5 y UI; propuesta sin implementar |
| [Auditoría 4](panel/sesion-4/informe.md) | Diez análisis, evidencia, 14 hallazgos y J1–J7 propuestas; registro para cerrar el ciclo |
| [Panel creativo](PANEL.md) | Cómo funciona el panel simulado, sus notas, decisiones de Jay y cómo hacer la próxima sesión. Informes en [panel/](panel/) |
| [El mundo](MUNDO.md) | Diseño vigente: cuatro capas, 11 lugares, estrellas, chispas, Refugio, Tu canción, planes H e I y herramientas de prueba |
| [El Viaje](VIAJE.md) | Capítulos, curva, tema del cubo, color y primeros minutos |
| [Arquitectura](ARQUITECTURA.md) | Módulos, render, audio, guardado y límites técnicos |
| [Verificación](VERIFICACION.md) | Qué pruebas ejecutar y cuándo |
| [Pruebas con personas](PRUEBAS_CON_PERSONAS.md) | Cómo hacer sesiones con jugadores (`?prueba=1`); aún no hay ninguna |
| [El universo](UNIVERSO.md) | Regiones, cámara, sonido y superbiomas del Mundo libre |
| [Hallazgos y actividades](HALLAZGOS_Y_ACTIVIDADES.md) | Contenido ya construido: esculturas, hallazgos, actividades y premios |
| [Tienda del cubo](TIENDA_DEL_CUBO.md) | Catálogo de piezas compradas con chispas |
| [Casa viva](CASA_VIVA.md) | La casa recorrible del Refugio y su secuenciador |
| [Cuenta y progreso](CUENTA_Y_RESPALDO.md) | Cuenta opcional, sincronización, recuperación y borrado |
| [Plan de lanzamiento](PLAN_LANZAMIENTO.md) | Backlog D01–D22 y decisiones comerciales |
| [Material de tienda](TIENDAS.md) | Borradores de fichas, capturas y tráiler |
| [Configuración de producción](CONFIGURACION_PRODUCCION.md) | Lo aplicado y lo pendiente en los servicios |
| [Privacidad](PRIVACIDAD.md) · [Eliminación de datos](ELIMINACION_DATOS.md) | Borradores no publicados |
| [Referencias VJ](REFERENCIAS_VJ.md) | Procedencia de los cuatro motivos VJ (para [Créditos](../CREDITOS.md)) |
| [Android](../android/README.md) | APK de prueba |
| [Cambios](../CAMBIOS.md) | Lo integrado desde alpha.142 |

## Reglas

- Una decisión nueva reemplaza a la antigua en su guía; no se añaden párrafos que la contradigan.
- Separar **aprobado**, **construido**, **probado** y **publicado**. Un bot o una captura no prueban lo que siente una persona.
- Los documentos antiguos (planes, cierres, traspasos anteriores) se borraron del árbol el 24 de octubre. Siguen en Git: `git show 5914ca9:docs/historial/NOMBRE.md`. Ninguno autoriza trabajo nuevo.

[Cierre de la auditoría 4 · fases J1–J7](PULIDO_CIERRE.md): correcciones autorizadas, evidencia y límites.

[Quinta sesión del panel](panel/sesion-5/informe.md): reevaluación de las correcciones sin rehacer música ni mundos.
