<!-- universo-vivo -->
Implementación en curso: **fase 4/10 · 1.1.0-alpha.4**. Cambios, pruebas, ramas y límites en [ENTREGA_UNIVERSO_VIVO.md](ENTREGA_UNIVERSO_VIVO.md). Plan: [150 ideas](UNIVERSO_150_IDEAS_FASES.md). Las secciones anteriores se conservan como historial.
<!-- /universo-vivo -->

# Interfaz integrada · V1 RC6

**1.0.0-rc.6 · polish/coherent-game-ui**, basada en **main 2a7dce0 (#84)**, que ya integra `feat/rare-discovery-cards` (14e6862). Mejora conjunta de menú, HUD, hojas, Bitácora, favoritos, mapas, Estudio, efectos, mensajes, prototipo y accesibilidad. Fondo negro y cubo siguen como centro de la experiencia. **Menú → Herramientas** muestra Efectos, Eco y Estudio; **Intensidad musical** vuelve accesible el control existente. [Auditoría, capturas y decisiones](AUDITORIA_INTERFAZ.md).

**59 suites de lógica, 45 recorridos de navegador y offline aprobados**, además de la auditoría de integridad sin errores ni avisos. Las pruebas y sus límites se registran en [evidencia RC6](scripts/interface-validation.json). Se mantienen 11 biomas, 33 hábitats, 52 géneros, 81 familias y 18 tipos de tarjeta. Sin cambios de generación/DSP ni nueva publicación. **RC6 integrada y subida a main en 9b5fe00**, por autorización explícita de Jay. La rama de interfaz y sus padres ya están integrados; no requieren otro PR. Teléfono real, CI remoto y deploy HTTPS siguen pendientes.

Para continuar: leer `UNIVERSO_150_IDEAS_FASES.md` para el plan y `AUDITORIA_INTERFAZ.md` para la base implementada. UI común en `styles/interface.css`, cargada después de la base y precacheada en SW RC6 (117 assets). Se preservan IDs y handlers de cierre; las cabeceras se montan en accesibilidad. El fondo se vuelve inerte solo con modal; cambios repetidos de `hidden` no roban foco. La Voz separa anuncio completo de escritura visual, conserva lectura expandida y no recibe Tab al ocultarse. Las tarjetas pausan su reloj con herramientas o lectura. El pad acepta flechas (Shift = paso mayor) e Inicio; al soltar vuelve a limpio salvo Fijar. No exponer runtime en producción; tests lo instrumentan al servir main.

**Plan actual:** rama `docs/universe-150-phases`, sobre el plan anterior `219750a` y main observado `704ae07`; solo planificación/documentación, sin código, nuevo deploy ni cambios de versión. Primero ajustar temporizadores de cajas y la Voz contextual; después familias reutilizables, gramática musical y flora/fauna. Los ejemplos musicales de criaturas admiten otro registro/rol según hábitat. Al continuar, trabajar por fases amplias; no interpretar esta lista como cien funciones existentes ni como autorización para desplegar servicios.

Los estados RC5/RC4/RC1 siguientes son fotografías históricas; la entrega vigente está arriba.

**Plan ampliado vigente:** [150 propuestas en 10 fases](UNIVERSO_150_IDEAS_FASES.md): las cien anteriores, treinta musicales, diez funciones de la Voz y diez propuestas de tarjetas. Son propuestas; los planes de 50/100 quedan como historia. Primera prioridad: beneficios temporales de cajas, techo de acumulación y revisar la compañía permanente procedente de una caja; no borrar progreso ya ganado.

# Libro de hallazgos · V1 RC5

**1.0.0-rc.5 · feat/rare-discovery-cards**, hija de **feat/minimal-discoveries (30d337f)**. Tarjetas discretas para hallazgos raros con nombre, ilustración, lugar, rareza contextual, fecha y coordenadas. **Bitácora → Hallazgos** guarda cada ejemplar y ofrece código/Orientar. 18 tipos de tarjeta; el contador de 81 familias permanece aparte. [Detalle y pruebas](HALLAZGOS_RAROS.md).

**59 suites de lógica, 43 recorridos de navegador + offline aprobados**, con rechecks de los flujos afectados. Las 225 mezclas pertenecen a RC4: esta entrega añade UI/registro y conserva la música. Versión/deploy visible actualizado a RC5; fecha de publicación aún sin registrar. Main comprobado: 8096c8d. Un PR de esta rama hacia main contiene todas las anteriores pendientes; Jay crea PR/merge.

Los estados RC4/RC1 siguientes son fotografías históricas; la entrega vigente está arriba.

# Expansión autorizada después de la auditoría

Estado actual: **1.0.0-rc.4 · feat/minimal-discoveries**, hija de **feat/release-identity (67aef5f)**. La petición nueva de Jay reabre desarrollo: percusión jugable, versión/deploy visible, minimalismo y registro de elementos en tres ramas amplias. [Entrega vigente y orden](EXPANSION_RITMICA.md). Main sigue en **8096c8d**; Jay crea PR/merge. La auditoría y los pendientes de teléfono/host/CI siguen vigentes.

Actualización RC4: **nueve familias de percusión (incluido fósil raro), contador de 81 familias, versión/deploy visible, instalaciones simplificadas y atlas de 139 vistas**. Laboratorio de 63 casos. Generador base preservado: 11 biomas, 33 hábitats y 52 estilos. No hay deploy nuevo registrado ni cambios en main desde esta sesión. **58 suites de lógica, 42 recorridos + offline y 225 renders de audio aprobados**; [evidencias de esta entrega](scripts/expansion-validation.json). Un PR de la rama final hacia main incluye las tres fases y todos sus padres pendientes; puedes probar cada rama por separado.

Los datos RC1 siguientes son la fotografía anterior, conservada como historia; su congelación queda sustituida por este alcance nuevo.

# Continuar desde WHITEDOT V1 RC1

**Candidata `1.0.0-rc.1` · rama `audit/v1-closure` · base f4c112b.** Main remoto observado: **8096c8d (#77)**. Esta rama contiene culturas + mascota + auditoría/correcciones: **un único PR hacia main integra todo**. Jay crea PR/merge; no volver a aplicar ramas padres ni declarar main actualizado hasta comprobarlo.

Leer [AUDITORIA_V1.md](AUDITORIA_V1.md), [ESTADO_ACTUAL.md](ESTADO_ACTUAL.md), [PENDIENTES.md](PENDIENTES.md) y [PLAN_V2.md](PLAN_V2.md). Handoffs/inventarios previos conservados íntegramente en [HANDOFF_HISTORICO.md](HANDOFF_HISTORICO.md).

## Cierre y reglas

Funciones de V1 congeladas. Solo corregir fallos de aceptación; cuentas/servidor/sincronización/multijugador y ampliaciones culturales/musicales pasan al plan V2. No hay backend publicado. Teléfono real, primera sesión humana y host/CI de PR siguen como aceptación necesaria; no confundir emulación/mediciones con preferencia artística.

Dedo = mover/pulso; cubo = contacto/recorrido/quietud. `?dedo=1` y webdriver conservan edición experimental heredada. Pruebas nuevas de cuerpo/culturas/mascota desactivan webdriver. Fondo negro, blanco disponible, UI silenciosa; color ganado y mascotas siguen vigentes. No reintroducir escenas musicales guardables, selección de mascota ni jardín modular/rastro retirados.

Guardado `pixel-blanco-v4`/previews aislados, generadores 1/2 e identidad/capas/coordenadas preservados. No modificar GEN/colocación sin versión/migración. `S.pet`, `S.cube`, `S.cultures`, bandadas/materia y favoritos se normalizan; algunos históricos grandes no están compactados aún. Conflictos entre pestañas conservan el guardado de disco y permiten exportar la copia en memoria; es protección optimista, no sincronización atómica. Recomendación V1: una pestaña activa.

SW de RC1: shell completo en caché propia, espera y actualiza explícitamente; URLs de preview no llenan caché. Fonts locales/OFL. Primera migración desde trabajadores anteriores: cerrar pestañas viejas y revisar backup. Cambiar origen exige exportar/importar. Grabar usa salida final, para tracks/libera URLs y maneja fallos; no interrumpirlo para actualizar.

## Evidencias y arranque

Estático sin build/npm install: `python3 -m http.server 8000`. Node >=18 y Python/Playwright/Chromium. `npm run audit:release`, `npm test`, `npm run test:browser`, `npm run test:audio`; auditor de universo admite classic/wide/vasto.

**55 suites Node; 39/39 recorridos + offline; 164 mezclas en 52 estilos; 95 módulos y 106 assets de shell; integridad sin faltantes.** [Registro global](scripts/v1-closure-validation.json) · [audio](scripts/v1-audio-audit.json). Las consultas de CI remoto devolvieron 403: comprobar workflow al crear PR, no inventar aprobación remota.

Nuevo auditor usa firma v2 y excluye flags retirados de patch/trail; las recetas de los mapas permanecen intactas. Las auditorías históricas de millones usan otra firma y no son canciones únicas. Original/Vivo/Vasto: 12.000 candidatos por perfil, datos en el informe.

Punto final de desarrollo V1; después aceptación y publicación de esa release. Abrir V2 solo con el siguiente alcance autorizado por Jay.
