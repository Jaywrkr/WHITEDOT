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
| 10 | `feat/10-chromatic-glass` | rama 9 | Subida: Tres vidrios cromáticos musicales · HEAD de esta rama |

## Cómo revisar e integrar

Orden 1 → 2 → 3 → … → 10, de la más antigua a la más nueva. Mientras la base no esté integrada, el diff de una fase se revisa contra la rama anterior; al integrarla, se puede apuntar el siguiente PR a main. No aprobar los diez cambios como un único diff acumulado.

Merge normal conserva los commits antecesores y facilita la cadena. Si Jay usa squash o rebase merge, avisar para reajustar la pila: hay que trasladar solamente los commits propios de cada rama sobre la nueva base y volver a verificar. No prometer cero conflictos si main cambia o si se reescribe el historial. El asistente no hace merges ni publica directamente en main.

README/HANDOFF/CAMBIOS/PENDIENTES se actualizan por etapa. Logros/Bitácora se amplían cuando hay algo nuevo que el jugador pueda descubrir/aprender; una corrección técnica no introduce un logro artificial.

| 10a | `fix/10a-tap-delete-echo` | rama 10 | Borrado directo de ecos; integrar después de 10 y antes de 11 |
