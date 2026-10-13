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

Esta copia implementa las fases 1–4. Las fases siguientes añaden contenido y pulido progresivamente.

## Probar los encuentros

Desde la fase 3: Menú → Prototipo → Semillas → Encuentro de prueba. La fase 3 ofrece cinco familias; la fase 4 ofrece las diez; la fase 5 añade su pulido final. La partida habitual mantiene su guardado independiente.

No se añade guardar ideas musicales, opción descartada por Jay. En todas las fases el anillo azul conserva prioridad para borrar/soltar y la grabación explícita mantiene el pulso del punto blanco.
