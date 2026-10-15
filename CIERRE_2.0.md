# WHITEDOT 2.0.0-rc.8 · cierre integrado

Los ocho bloques están implementados en ramas encadenadas; Jay crea PR y merge. Esta candidata reúne auditoría, reparaciones, primer nivel, viajes, Bitácora, tarjetas, cincuenta caminantes y revisión musical. No se publicó main.

## Ramas de revisión

| Bloque | Rama | Estado | Referencia |
|---|---|---|---|
| 1 · Auditoría y defectos comprobados | `feat/cierre-f10-lanzamiento` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | `25732e6` |
| 2 · Primer nivel y guía mínima | `feat/pulido-f2-primer-nivel` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | `2e45cc0` |
| 3 · Guardar, volver y viajar | `feat/pulido-f3-viajes` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | `e5d2da5` |
| 4 · Bitácora visual | `feat/pulido-f4-bitacora` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | `e1a0897` |
| 5 · Tarjetas y ritmo de descubrimiento | `feat/pulido-f5-tarjetas` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | `4cdc59a` |
| 6 · Cincuenta variantes de personajes | `feat/pulido-f6-personajes` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | `1637aed` |
| 7 · Interacciones musicales coherentes | `feat/pulido-f7-interacciones` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | `7af93e2` |
| 8 · Limpieza y aceptación del conjunto | `feat/pulido-f8-cierre` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | HEAD de esta rama |

Main observado en `15bbe77` ya contiene F1 y F2; no reabrir esas ramas eliminadas tras sus merges. F10 contiene F1–F9 y las reparaciones de su auditoría: puede revisarse como una sola base. Después, F2 a F8 son hijas sucesivas. También puede revisarse el diff acumulado de F8; no abrir PRs duplicados de padres ya incluidos. Conservar commits de padres al integrar reduce conflictos; squash/rebase y cambios paralelos pueden requerir resolverlos. Ninguna pila garantiza cero conflictos.

## Pruebas de la candidata

Auditoría sin errores ni advertencias; 97 suites Node, 75 recorridos de navegador incluidos offline, y 455 renders de audio en 22 programas aprobados. Ambas generaciones y diversidad verificadas. CI del PR, deploy real y aceptación física pendientes.

Pico máximo de audio renderizado: 0.945446670; fracción caliente cero. Los renders comprueban señal/margen; no certifican gusto musical, altavoces físicos ni masterización profesional.

[Informe final](scripts/pulido-f8-validation.json) · [Audio por caso](scripts/pulido-f8-audio-suite.json) · [Hallazgos resueltos](AUDITORIA_CIERRE_2.0.md) · [Rutas musicales](MATRIZ_INTERACCIONES.md) · [Reporte anterior conservado](docs/historial/CIERRE_2.0_RC1.md).

## Qué probar en teléfono

1. Menú → Tu recorrido → Practicar: aprende sin borrar tu partida.
2. Guarda con el marcador, abre el nombre del lugar, viaja y vuelve.
3. Abre Bitácora; despliega una región y revisa música/colección.
4. Escucha percusión, una reliquia, un caminante y tus marcas de Pincel.
5. Recarga con un poder y un regalo pendiente; conserva beneficio/progreso.
6. Prueba ambas orientaciones, suspensión/reanudación y PWA offline.

[Guía ampliada](PROBAR_UNIVERSO_VIVO.md). Si algo falla: WD1, gesto, navegador, orientación y teléfono; esos datos permiten una regresión reproducible.

## Diversidad y memoria

Se conservan 11 biomas, 33 hábitats, ocho familias espaciales, 52 estilos y dieciséis influencias compatibles, con zonas puras. Hay 28 linajes procedurales y cincuenta variantes explícitas de caminantes. La muestra de 4096 regiones conserva 1606 combinaciones estructurales y 2798 recetas en tres momentos; no es un total de mundos ni una medición de canciones perceptualmente únicas. No afirmamos millones multiplicando variables correlacionadas.

WD1 guarda semilla, versiones, tamaño, capa y coordenadas. Las semillas guardan progreso separado. Los nuevos flujos no desplazan mapas antiguos. Favoritos admiten 256 sin truncar anteriores; tarjetas admiten 512 sin expulsar una colección existente mayor. El guardado global mantiene límites de 8 MiB/complejidad y conserva el último archivo válido ante error. El almacenamiento del navegador no es infinito.

## Antes de declarar estable

| Pendiente externo | Cómo cerrarlo |
|---|---|
| CI del PR | Lógica, navegador y los tres grupos de audio aprobados. |
| Vercel real | Abrir el preview de la rama final y comprobar versión, revisión y hora del artefacto. |
| iPhone y Android físicos | Tacto, orientación, teclado, audio tras suspensión y restauración de copia. |
| Escucha humana | 20–30 minutos con volumen equivalente; anotar fuentes enmascaradas o fatiga. |
| Personas nuevas | Ver si entienden explorar, crear y conservar sin explicaciones externas. |
| Rendimiento y PWA físicos | Zonas densas, cambios de capa, temperatura, offline y actualización segura. |

Estos puntos no se presentan como aprobados mediante emulación. No se necesita otra expansión de contenido para ejecutar esta aceptación.

## Próximo ciclo: servicio público

Servidor, cuentas públicas y duetos por Internet quedan fuera de este cierre. Existe un servidor opcional local probado; no equivale a un servicio público desplegado. Vercel sirve el juego estático.

El siguiente ciclo debe definir host/SQLite o base gestionada, autenticación, copias por usuario y recuperación, concurrencia entre dispositivos, salas/sincronía con latencia real, límites operativos y costes. La colección de largo plazo necesita archivo/migración antes de superar el almacenamiento local. Priorizar esas decisiones y la evidencia de sesiones reales sobre añadir más catálogos.
