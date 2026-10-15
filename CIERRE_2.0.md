# WHITEDOT 2.0.0-rc.9 · cierre integrado

Los ocho bloques están implementados en ramas encadenadas; Jay crea PR y merge. Esta candidata reúne auditoría, reparaciones, primer nivel, viajes, Bitácora, tarjetas, cincuenta caminantes y revisión musical. Codex no modificó main; las integraciones de Jay se registran abajo.

La [auditoría de aceptación posterior](AUDITORIA_ACEPTACION_2.0.md), rama `audit/cierre-2-validacion`, corrige A29: no anunciar un guardado ni completar la guía hasta confirmar la escritura. Conserva todos los bloques y establece las condiciones para cerrar publicación.

## Ramas de revisión

| Bloque | Rama | Estado | Referencia |
|---|---|---|---|
| 1 · Auditoría y defectos comprobados | `feat/cierre-f10-lanzamiento` | En main; aceptación física pendiente | `25732e6` |
| 2 · Primer nivel y guía mínima | `feat/pulido-f2-primer-nivel` | En main; aceptación física pendiente | `2e45cc0` |
| 3 · Guardar, volver y viajar | `feat/pulido-f3-viajes` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | `e5d2da5` |
| 4 · Bitácora visual | `feat/pulido-f4-bitacora` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | `e1a0897` |
| 5 · Tarjetas y ritmo de descubrimiento | `feat/pulido-f5-tarjetas` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | `4cdc59a` |
| 6 · Cincuenta variantes de personajes | `feat/pulido-f6-personajes` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | `1637aed` |
| 7 · Interacciones musicales coherentes | `feat/pulido-f7-interacciones` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | `7af93e2` |
| 8 · Limpieza y aceptación del conjunto | `feat/pulido-f8-cierre` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | `5d02c08` |

Instantánea de main `52fec80`: cierre F1–F10 y pulido F2 ya integrados. No reabrir PRs de esos padres. Pulido F3–F8, documentación y esta auditoría continúan la cadena; puede revisarse su diff acumulado evitando PRs duplicados. La fecha y ascendencia comprobadas están en scripts/auditoria-cierre-rc9-remote.json. Conservar commits de padres al integrar reduce conflictos; squash/rebase y cambios paralelos pueden requerir resolverlos. Ninguna pila garantiza cero conflictos.

## Pruebas de la candidata

RC9: auditoría sin errores ni advertencias, 97 suites Node, 76 recorridos de navegador incluido offline y prueba HTTP/SQLite aprobados. Se conservan los 455 renders F8 de 22 programas, con integridad de casos verificada; no se repitieron porque no cambia el audio. CI del PR, verificación del artefacto RC9 y aceptación física pendientes.

Pico máximo de audio renderizado: 0.945446670; fracción caliente cero. Los renders comprueban señal/margen; no certifican gusto musical, altavoces físicos ni masterización profesional.

[Informe RC9](scripts/auditoria-cierre-rc9-validation.json) · [Base F8](scripts/pulido-f8-validation.json) · [Audio por caso](scripts/pulido-f8-audio-suite.json) · [Hallazgos resueltos](AUDITORIA_CIERRE_2.0.md) · [Rutas musicales](MATRIZ_INTERACCIONES.md) · [Reporte anterior conservado](docs/historial/CIERRE_2.0_RC1.md).

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

### Verificación remota · 15 de octubre de 2026

Se comprobaron las ocho referencias remotas de la tabla: todas coinciden con sus commits. Main observado inicialmente en `15bbe77` avanzó a `52fec80` durante los merges de Jay. No queda ninguna fase de implementación de esta tabla esperando autorización. Jay mantiene PR y merge.

El preview enlazado por el check de GitHub es [pulido F8](https://whitedot-git-feat-pulido-f8-cierre-jaywrkr-1498s-projects.vercel.app). El check aprobado `Vercel Preview Comments` indica ausencia de comentarios pendientes; no acredita el despliegue ni las pruebas completas.

En la comprobación inicial, el proxy rechazó con HTTP 403 el túnel hacia Vercel y el acceso a la API de GitHub. Se guardó un borrador de red con `api.github.com`, `vercel.com`, el dominio de producción y el host exacto del preview. Guardarlo no demostró acceso efectivo en aquel momento.

En la auditoría RC9 la API y producción ya responden. La última instantánea (2026-10-15T13:00:02.314297+00:00) sirve 2.0.0-rc.2, revisión `52fec80`; las comprobaciones previas registraron 1.1.0 mientras se integraban ramas. La API confirma deploy Preview F8 completado, pero su URL redirige al login de Vercel. Por eso el juego del preview no queda aceptado mediante el HTTP 200 de la página de autenticación. Ver evidencia y puertas de cierre en el dictamen vigente.

La suite de Actions se activa con un PR o push a main, no con cada push de una rama de fase. Los fallos anteriores observados de F1/F2 no son pruebas de la candidata F8. La comprobación documental inicial aprobó auditoría y metadatos sin repetir suites pesadas. RC9 sí añade una corrección funcional: su informe registra la nueva verificación completa de navegador y lógica, separada de los renders F8 conservados.

## Próximo ciclo: servicio público

Servidor, cuentas públicas y duetos por Internet quedan fuera de este cierre. Existe un servidor opcional local probado; no equivale a un servicio público desplegado. Vercel sirve el juego estático.

El siguiente ciclo debe definir host/SQLite o base gestionada, autenticación, copias por usuario y recuperación, concurrencia entre dispositivos, salas/sincronía con latencia real, límites operativos y costes. La colección de largo plazo necesita archivo/migración antes de superar el almacenamiento local. Priorizar esas decisiones y la evidencia de sesiones reales sobre añadir más catálogos.
