# Orden actual de ramas nuevas

La base verificada es main `2959313`, que integra las cinco fases anteriores. Cada rama siguiente contiene la anterior. Jay crea los PR y hace merge; el trabajo nuevo se documenta en [PROXIMOS_PASOS.md](PROXIMOS_PASOS.md).

| Orden | Rama | Entrega |
|---:|---|---|
| 1 | `feat/deep-musical-encounters` | Redes tejidas, aprendizaje de frases y edición musical |
| 2 | `docs/organic-interaction-direction` | Dirección visual y cultural documentada |
| 3 | `feat/organic-musical-seedpods` | Primer rediseño orgánico, posteriormente sustituido por suelo |
| 4 | `feat/shared-installation-signals` | Vidrios y espejos conducen módulos regionales |
| 5 | `feat/resonant-ground` | Elimina las cajas como objeto; interacción con el piso |
| 6 | `feat/chained-musical-trails` | Tres huellas encadenadas e instrumento dormido |

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
