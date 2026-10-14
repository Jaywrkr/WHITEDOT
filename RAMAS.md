<!-- universo-vivo -->
Implementación en curso: **fase 8/10 · 1.1.0-alpha.8**. Cambios, pruebas, ramas y límites en [ENTREGA_UNIVERSO_VIVO.md](ENTREGA_UNIVERSO_VIVO.md). Plan: [150 ideas](UNIVERSO_150_IDEAS_FASES.md). Las secciones anteriores se conservan como historial.
<!-- /universo-vivo -->

# Interfaz integrada · V1 RC6

**1.0.0-rc.6 · polish/coherent-game-ui**, basada en **main 2a7dce0 (#84)**, que ya integra `feat/rare-discovery-cards` (14e6862). Mejora conjunta de menú, HUD, hojas, Bitácora, favoritos, mapas, Estudio, efectos, mensajes, prototipo y accesibilidad. Fondo negro y cubo siguen como centro de la experiencia. **Menú → Herramientas** muestra Efectos, Eco y Estudio; **Intensidad musical** vuelve accesible el control existente. [Auditoría, capturas y decisiones](AUDITORIA_INTERFAZ.md).

**59 suites de lógica, 45 recorridos de navegador y offline aprobados**, además de la auditoría de integridad sin errores ni avisos. Las pruebas y sus límites se registran en [evidencia RC6](scripts/interface-validation.json). Se mantienen 11 biomas, 33 hábitats, 52 géneros, 81 familias y 18 tipos de tarjeta. Sin cambios de generación/DSP ni nueva publicación. **RC6 integrada y subida a main en 9b5fe00**, por autorización explícita de Jay. La rama de interfaz y sus padres ya están integrados; no requieren otro PR. Teléfono real, CI remoto y deploy HTTPS siguen pendientes.

Culturas, mascota/cubo, auditoría RC1, percusión RC2, versión RC3, minimalismo/elementos RC4 y tarjetas RC5 ya están integradas en main (#78–#84). La rama `polish/coherent-game-ui` también está integrada en main (9b5fe00). No reaplicar los padres ni las ramas locales históricas sustituidas por las cinco fases de #58. Conservar ascendencia mediante merge normal; cambios paralelos o squash pueden requerir ajuste.

**Plan actual:** `docs/universe-150-phases`, hija del plan de cien (`219750a`), agrupa las ciento cincuenta propuestas y referencias en una rama. Main observado sigue en `704ae07`; un PR de esta rama incluye ambos planes pendientes. Las diez ramas futuras corresponderán a las fases completas, no a cada idea. Esta rama de documentación no inicia la fase 1 ni modifica la release RC6.

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

# Integración final · V1 RC1

**audit/v1-closure** parte de **f4c112b** y contiene culturas (`165c376`), mascota (`d597b54`/`f4c112b`) y auditoría/correcciones. Main remoto comprobado sigue en **8096c8d (#77)**. **Un PR de esta rama hacia main integra todo**: no hace falta crear tres PR ni aplicar ramas previas de nuevo. Jay crea PR y hace merge.

Si se integran padres antes, volver a comparar la rama final con main y conservar ascendencia mediante merge normal. Cambios paralelos/squash pueden requerir ajuste; no se promete ausencia de conflictos si main cambia. [Auditoría](AUDITORIA_V1.md) · [Handoff](HANDOFF.md). Desarrollo V1 congelado; la siguiente etapa es aceptación/publicación y después V2.

<details><summary>Órdenes de integración anteriores, conservados como historia</summary>

# Rama actual · mascota y cubo

Main remoto sigue en **8096c8d (#77)**. Orden pendiente: **1. feat/phase-06-cultural-exploration (`165c376`); 2. feat/pet-and-cube (basada en esa)**. Esta segunda rama agrupa mascota, personalización, pruebas, atlas y documentos; [detalle](MASCOTA_Y_CUBO.md). Jay crea PR/merge. Revisar contra la rama cultural mientras esté pendiente; tras integrarla, contra main.

La sección siguiente corresponde a la entrega cultural y a integraciones anteriores.

# Integración y continuación

Base verificada **main 8096c8d, #77**. #74 integró el handoff, #75 materia/FX/códigos/set, #76 laboratorio/vida y #77 cubo/expansión. Las fases 1–3 y entregas anteriores también están integradas. No reaplicar sus ramas.

Rama actual: **feat/phase-06-cultural-exploration**, basada directamente en main 8096c8d. Una sola rama para revisión/primer bloque cultural/exploración/laboratorio/golondrinas; [detalle](FASE_06.md). Commit/push; Jay crea PR hacia main y hace merge. No genera una cadena nueva de muchas ramas pequeñas.

Los registros siguientes son historia de las integraciones previas; no usarlos como pendientes actuales. [Handoff](HANDOFF.md) · [Estado](ESTADO_ACTUAL.md) · [Pendientes](PENDIENTES.md).

<details><summary>Historial de integración; no usar como lista de trabajo pendiente</summary>

## Cadena de referencia

La base verificada es main `2959313`, que integra las cinco fases anteriores. Cada rama siguiente contiene la anterior. Jay crea los PR y hace merge; el trabajo nuevo se documenta en [PROXIMOS_PASOS.md](PROXIMOS_PASOS.md).

| Orden | Rama | Entrega |
|---:|---|---|
| 1 | `feat/deep-musical-encounters` | Redes tejidas, aprendizaje de frases y edición musical |
| 2 | `docs/organic-interaction-direction` | Dirección visual y cultural documentada |
| 3 | `feat/organic-musical-seedpods` | Primer rediseño orgánico, posteriormente sustituido por suelo |
| 4 | `feat/shared-installation-signals` | Vidrios y espejos conducen módulos regionales |
| 5 | `feat/resonant-ground` | Elimina las cajas como objeto; interacción con el piso |
| 6 | `feat/chained-musical-trails` | Tres huellas encadenadas e instrumento dormido |
| 7 | `feat/expressive-glass-gestures` | Vidrios sin panel, voces equilibradas y movimiento expresivo |
| 8 | `feat/intuitive-animal-dialogue` | Enseñar al animal por toque, respuesta automática y turnos visibles |

Revisar cada PR contra la rama anterior mientras esté pendiente, y contra main después de integrar esa base. Usar merge normal para conservar ascendencia. Squash/rebase merge o cambios nuevos en main pueden requerir reajustar las ramas; una cadena no garantiza ausencia de conflictos ante esos cambios. No recrear PR de las cinco fases históricas ya integradas.

<details><summary>Documentación histórica de ramas</summary>

# Orden vigente: cinco fases

Consultar [FASES.md](FASES.md). La cadena antigua de veinte ramas queda sustituida. Main ya incluye las ramas 14, 15 y docs/16.

<details><summary>Historial de etapas anteriores, ya integrado o sustituido</summary>

# Orden de ramas de la sesión

Jay autorizó completar las primeras diez fases encadenadas. Se parte de la fase 1 pendiente, cada fase nueva nace del commit final de la anterior. El asistente implementa, prueba, hace commit y push; Jay crea PR y merge.

| Orden | Rama | Base | Estado |
|---:|---|---|---|
| 1 | `review/claude-audio-clarity` | main `5413d5f` | Subida, `fe32566`: revisión, nitidez y plan · fe32566 |
| 2 | `feat/02-layer-jam-consistency` | rama 1 | Subida: capas, Estudio y autoría de ecos · eda226a |
| 3 | `feat/03-world-recipe-catalog` | rama 2 | Subida: Catálogo y recetas de lugar · 35fcd5c |
| 4 | `feat/04-coherent-world-combinations` | rama 3 | Subida: Combinaciones coherentes · d912160 |
| 5 | `polish/05-world-visual-language` | rama 4 | Subida: Lenguaje gráfico y capas de información · bacfc98 |
| 6 | `feat/06-stationary-environment` | rama 5 | Subida: El ambiente responde a la quietud · 45f69ea |
| 7 | `feat/07-musical-favorites` | rama 6 | Subida: Favoritos musicales · dfda3f3 |
| 8 | `feat/08-return-navigation` | rama 7 | Subida: Orientación y regreso · a610bd7 |
| 9 | `feat/09-musical-autopilot` | rama 8 | Subida: Autopilot musical · 55c2701 |
| 10 | `feat/10-chromatic-glass` | rama 9 | Subida: Tres vidrios cromáticos musicales · 73567ab |
| 10a | `fix/10a-tap-delete-echo` | rama 10 | Subida · `0bd05ce`: borrar ecos con un toque |
| 11 | `feat/11-musical-mirrors` | rama 10a | Subida: espejos musicales · 77bec9d |
| 12 | `feat/12-musical-influence` | rama 11 | Subida · `6da3dc5`: influencia y cultivo |
| 12a | `feat/12a-optional-sound-pins` | rama 12 | Subida · `4c9089a`: fijación voluntaria |
| 12b | `feat/12b-patch-gardens` | rama 12a | Subida · `545a7e9`: módulos y cables |
| 12c | `polish/12c-mobile-space` | rama 12b | Subida · `9a19b0c`: espacio móvil |
| 12d | `fix/12d-contact-intent` | rama 12c | Subida: contactos intencionales y dirección de juego · commit final de rama |
| 13 | `fix/13-silent-interface` | rama 12d | Subida · f1b18b5: interfaz silenciosa |
| 14 | `feat/14-seed-laboratory` | rama 13 | Subida · c00c27d: semillas completas |
| 15 | `feat/15-spacious-blob-worlds` | rama 14 | Subida: blobs, biomas amplios y calma · commit final de rama |

## Cómo revisar e integrar

Orden 1 → 2 → 3 → … → 10 → 10a → 11 → 12 → 12a → 12b → 12c → 12d → 13 → 14 → 15, de la más antigua a la más nueva. Mientras la base no esté integrada, el diff de una fase se revisa contra la rama anterior; al integrarla, se puede apuntar el siguiente PR a main. No aprobar los diez cambios como un único diff acumulado.

Merge normal conserva los commits antecesores y facilita la cadena. Si Jay usa squash o rebase merge, avisar para reajustar la pila: hay que trasladar solamente los commits propios de cada rama sobre la nueva base y volver a verificar. No prometer cero conflictos si main cambia o si se reescribe el historial. El asistente no hace merges ni publica directamente en main.

README/HANDOFF/CAMBIOS/PENDIENTES se actualizan por etapa. Logros/Bitácora se amplían cuando hay algo nuevo que el jugador pueda descubrir/aprender; una corrección técnica no introduce un logro artificial.

Jay autorizó la mejora 10a y la fase 11 en el siguiente mensaje; el pedido posterior autoriza las cinco unidades siguientes; las demás ideas continúan pendientes.


</details>


</details>

</details>

- `feat/phase-04-materia-y-compartir` (Claude): materia (cuerdas, prisma, membrana), FX chorus/phaser/freeze, códigos de lugar y grabar set. Integrada en #75. Ver `FASE_04_MATERIA.md`.
- `feat/laboratorio-y-fase-05` (Claude, creada sobre la anterior): Laboratorio + fase 5 Vida. Integrada en #76. Ver `LABORATORIO_Y_FASE_05.md`.
- `feat/expansion-fase-06` (Claude, sobre las dos anteriores): el cubo toca el mundo, quitados jardín modular y rastro, colores, quietud, música experimental, cajas y poderes. Integrada en #77. Ver `CUBO_Y_EXPANSION.md`.

</details>
