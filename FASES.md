# Alcance vigente de V1

El plan vigente es [FASES_UNIVERSO.md](FASES_UNIVERSO.md): diez fases amplias, una rama por fase. La fase 1 actual es `feat/phase-01-universe-foundation`, basada en main `7a0e8ff` (PR #67), y está documentada en [FASE_01.md](FASE_01.md). **Las cinco fases del resto de este documento son históricas y ya están integradas.**

# Estado de integración

Las cinco fases que describe este documento ya están integradas en main mediante el PR #58 (`2959313`). No requieren nuevos PR. El trabajo nuevo sigue [PROXIMOS_PASOS.md](PROXIMOS_PASOS.md); la cadena vigente de ocho ramas nuevas está en [RAMAS.md](RAMAS.md), incluyendo suelo resonante y rastros musicales.

# Cinco fases para probar e integrar

Esta cadena sustituye las veinte ramas creativas anteriores. Base actualizada: `main` en `63706eb`, que ya incluye semillas, blobs y prioridades. Las cinco ramas nacen consecutivamente de la anterior; cada fase tiene un commit propio. Jay crea los PR y realiza los merges.

**Orden: 1 → 2 → 3 → 4 → 5.** Mientras una base siga pendiente, revisar el PR contra la fase anterior. Al integrar esa base, apuntar el PR siguiente a main. Usar **merge normal / Create a merge commit**, para conservar la ascendencia: squash o rebase merge requiere reajustar las fases siguientes. La compatibilidad se verifica contra este main; cambios posteriores también pueden requerir resolución.

Las ramas antiguas se retiran de GitHub después de publicar y verificar estas cinco. Sus commits se conservan en el historial/localmente. Los PR de ramas retiradas quedan sustituidos por esta cadena; el acceso a la API de PR devolvió Forbidden en esta sesión y no se modifican sus descripciones desde aquí.

| Fase | Rama | Entregas agrupadas | Qué probar |
|---:|---|---|---|
| 1 | `phase/01-creative-foundation` | 1–4 · Base creativa | Recorrido Camino → Mundo → Estudio, pistas de gestos, sustracción y aros/prismas modelables. |
| 2 | `phase/02-exploration-and-quiet-creation` | 5–9 · Exploración con sentido | Retos abiertos, capacidades de reliquias, pistas, Voz contextual y modo de creación sin gasto de linterna. |
| 3 | `phase/03-first-interactive-families` | 10–14 · Primeros cinco encuentros | Nubes, tejedoras, pozos de silencio, semillas orbitales y piedras de capas; selector de pruebas en Semillas. |
| 4 | `phase/04-living-musical-encounters` | 15–19 · Otros cinco encuentros | Animales de intercambio, corrientes reversibles, flores de presión, esculturas de sombra y cajas de posibilidades. |
| 5 | `phase/05-music-ui-and-release-polish` | 20–20 · Pulido final | Paletas de 52 estilos, densidad musical, prioridad del borrado, accesibilidad, móvil y shell offline completo. |

Esta copia implementa las fases 1–5. La fase 5 conserva exactamente el código y las pruebas del pulido final anterior; la reorganización cambia commits y documentación, no elimina funcionalidades.

## Probar los encuentros

Desde la fase 3: Menú → Prototipo → Semillas → Encuentro de prueba. La fase 3 ofrece cinco familias; la fase 4 ofrece las diez; la fase 5 añade su pulido final. La partida habitual mantiene su guardado independiente.

No se añade guardar ideas musicales, opción descartada por Jay. En todas las fases el anillo azul conserva prioridad para borrar/soltar y la grabación explícita mantiene el pulso del punto blanco.

## Verificación de la reorganización

- `npm test` pasó en cada una de las cinco fases (40 suites en fases 1–2 y 41 en fases 3–5).
- Fase 1: grabar, borrar y banda en móvil/escritorio. Fase 2: recorrido, sustracción, retos y creación tranquila en tres tamaños. Fase 3: gestos de las cinco primeras familias. Fase 4: gestos de las diez familias. Fase 5: foco/menús en pantalla pequeña y horizontal, y recarga offline con 66 módulos.
- Código y pruebas de la fase 5 idénticos al commit final anterior `03376cd`; conserva sus mediciones musicales y funcionalidades.
- Cinco merges normales simulados consecutivamente contra `main` `63706eb`, sin conflictos, con árbol final idéntico al de la fase 5.
- Cada fase tiene exactamente un commit propio sobre la anterior. Enlaces locales y diff verificados.
- Los veinte tips anteriores se conservan en ramas locales y en un bundle Git completo verificado, `/tmp/whitedot-twenty-branches.bundle`.
