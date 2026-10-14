<!-- universo-vivo -->
Implementación en curso: **fase 6/10 · 1.1.0-alpha.6**. Cambios, pruebas, ramas y límites en [ENTREGA_UNIVERSO_VIVO.md](ENTREGA_UNIVERSO_VIVO.md). Plan: [150 ideas](UNIVERSO_150_IDEAS_FASES.md). Las secciones anteriores se conservan como historial.
<!-- /universo-vivo -->

# Interfaz integrada · V1 RC6

**1.0.0-rc.6 · polish/coherent-game-ui**, basada en **main 2a7dce0 (#84)**, que ya integra `feat/rare-discovery-cards` (14e6862). Mejora conjunta de menú, HUD, hojas, Bitácora, favoritos, mapas, Estudio, efectos, mensajes, prototipo y accesibilidad. Fondo negro y cubo siguen como centro de la experiencia. **Menú → Herramientas** muestra Efectos, Eco y Estudio; **Intensidad musical** vuelve accesible el control existente. [Auditoría, capturas y decisiones](AUDITORIA_INTERFAZ.md).

**59 suites de lógica, 45 recorridos de navegador y offline aprobados**, además de la auditoría de integridad sin errores ni avisos. Las pruebas y sus límites se registran en [evidencia RC6](scripts/interface-validation.json). Se mantienen 11 biomas, 33 hábitats, 52 géneros, 81 familias y 18 tipos de tarjeta. Sin cambios de generación/DSP ni nueva publicación. **RC6 integrada y subida a main en 9b5fe00**, por autorización explícita de Jay. La rama de interfaz y sus padres ya están integrados; no requieren otro PR. Teléfono real, CI remoto y deploy HTTPS siguen pendientes.

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

# Estado vigente · V1 RC1

Rama **audit/v1-closure**, candidata **1.0.0-rc.1**, sobre f4c112b. Main remoto sigue en 8096c8d (#77). La rama incluye las dos entregas pendientes y las correcciones de cierre, para **un PR**. [Auditoría y dictamen](AUDITORIA_V1.md) · [Continuar](HANDOFF.md) · [Pendientes de aceptación](PENDIENTES.md) · [V2](PLAN_V2.md).

| Dimensión | Estado comprobado |
|---|---|
| Catálogo | 11 biomas, 33 hábitats, 52 estilos; generadores 1/2 conservados |
| Buscar | Ocho estudios culturales, guardianes/huellas/puertas, 24 recuerdos |
| Vivir/crear | Bandadas/flora, mascota, quietud/poderes, suelo/encuentros, materia, vidrios/espejos, Estudio/eco/fijación |
| Recorrer | Original/Vivo, Clásico/Amplio/Vasto, favoritos/WD1, capas y paseo |
| UI | Cubo real, blanco/colores ganados, preview/estelas/halo, menú y auto compactos; sin jingles |
| Guardado | Respaldo/recuperación/versiones, conflicto de pestañas protegido; historial largo sin compactación general |
| Offline | 95 módulos, 106 assets precacheados; fonts locales/OFL, actualización A/B comprobada |
| Probar | Laboratorio 54, atlas 130 vistas; prototipo sigue accesible |
| Lógica | 55 suites aprobadas |
| Navegador | 39/39 recorridos y offline aprobados |
| Audio | 164 renders, 44,1/48 kHz; muestra pico máximo 0,95759; sin muestras >0,98 |
| Integridad | 224 IDs HTML, 209 imports: sin faltantes/duplicados |
| Red/cuentas | Sin backend, autenticación, sincronización o multijugador implementados |
| Publicación | Candidata local; aceptación real/host/CI del PR pendientes |

Los conteos de recetas no cuentan canciones o mundos perceptiblemente únicos. Vasto amplía terreno con el catálogo actual. “Todo integrado” corresponde a esta rama, todavía requiere merge de Jay. El inventario previo e historia completa permanecen en [HANDOFF_HISTORICO.md](HANDOFF_HISTORICO.md).
