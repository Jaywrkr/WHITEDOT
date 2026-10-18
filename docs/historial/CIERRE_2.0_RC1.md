Registro histórico de la candidata RC1; prevalece CIERRE_2.0.md en la raíz.

# WHITEDOT 2.0.0-rc.1 · cierre técnico

Candidata de revisión en `feat/cierre-f10-lanzamiento`. Las diez ramas contienen sus padres; Jay crea PRs y hace merge en orden. Main no se modificó. Esta revisión local no acredita un deploy ni sustituye la escucha en un teléfono físico.

## Ascendencia de la candidata

| Fase | Rama | Commit de entrega |
|---|---|---|
| 1 | `feat/cierre-f1-identidades` | `4a819c9` |
| 2 | `feat/cierre-f2-especies` | `08521cd` |
| 3 | `feat/cierre-f3-ecosistemas` | `9164122` |
| 4 | `feat/cierre-f4-sintesis` | `35ffe3c` |
| 5 | `feat/cierre-f5-composicion` | `d64e7c0` |
| 6 | `feat/cierre-f6-interacciones` | `a00e3a6` |
| 7 | `feat/cierre-f7-hallazgos` | `d38c8a5` |
| 8 | `feat/cierre-f8-memoria` | `0ddecb8` |
| 9 | `feat/cierre-f9-juego` | `2dd4a23` |
| 10 | `feat/cierre-f10-lanzamiento` | HEAD de esta rama |

Para integrar la base auditada, el PR de F10 reúne F1–F9 y sus reparaciones. No hace falta abrir de nuevo PRs de padres que queden incluidos. Si revisas los padres por separado, exige su CI antes de merge. Después continúa con las ramas hijas de PLAN_PULIDO_FINAL.md.

Si una fase ya está integrada, comprobar ascendencia antes de abrir su sucesora. Conservar los commits de los padres reduce conflictos. Un squash/rebase o cambios paralelos pueden requerir resolverlos; ninguna pila garantiza cero conflictos. No crear PRs de trabajos locales históricos que ya se recuperaron en F9.

## Qué reúne esta candidata

- Ocho familias coherentes de paisaje; anatomías individuales en 28 linajes y flora/fauna anteriores. Nichos, clima, vecinos y excursiones locales acotadas; no se simula toda la galaxia.
- Treinta y dos especificaciones de síntesis, siete motores avanzados originales y dieciséis programas de filtro. Redes con señal/CV real, máximo seis cables, polifonía/nodos acotados.
- Cincuenta y dos estilos conservados y dieciséis influencias compositivas compatibles, con zonas puras. Armonía, fraseo, descansos y registros evolucionan estando quieto. No todo se mezcla con todo.
- Nueve cuerpos de percusión natural con articulaciones individuales; semilleros y truenos variados. El acompañamiento deja espacio al gesto sin aumentar el máster. Señales locales sincronizadas y una etiqueta musical cercana.
- Guardianes, pistas ordenadas y puertas culturales; dos habitantes relacionados por santuario. Recuerdos ganados utilizables y reliquias que puedes volver a tocar en su punto. Cincuenta tipos de tarjeta con condiciones y lugares reales; sin probabilidades inventadas.
- Memoria de conexiones, suelo editado y frases; vínculos por individuo. Límites de nuevas entradas sin expulsar ediciones existentes. Favoritos, WD1, regreso y paseo por afinidad/contraste; el tiempo continúa.
- Cincuenta personalizaciones ganadas, cinco secciones de Bitácora, doscientos cincuenta logros y casa desde arriba con cuarenta objetos/cuatro habitaciones. Taller radial conservado y visitas WH1 sin editar la colección propia.
- Geist Mono, interfaz silenciosa, fondo negro, blanco original y oro ganado. Volumen y ajustes persistentes, voz breve y contextual. Las selecciones y previsualizaciones de menús no generan notas.

## Verificación local

- Auditoría de release sin errores ni advertencias y 93 suites Node aprobadas.
- Suite completa: 68 recorridos de navegador y offline, 69 en total.
- Suite completa de audio: 445 renders en 21 programas; pico máximo 0,9454471469 y fracción caliente cero.
- Ambas generaciones del universo, muestra de diversidad y 49.152 sectores de frecuencia espacial.
- API opcional con HTTP/SQLite temporal: cuentas, copias, concurrencia y salas locales.

[Evidencia consolidada](../../scripts/cierre-f10-validation.json) · [Casos de audio](../../scripts/cierre-f10-audio-suite.json) · [Navegador final](../../scripts/cierre-f10-final-browser.json) · [Auditoría y soluciones](AUDITORIA_CIERRE_2.0.md). La candidata conserva pendientes de experiencia autorizados en [PLAN_PULIDO_FINAL.md](PLAN_PULIDO_FINAL.md); esta pasada técnica no los presenta como terminados.

## Diversidad comprobada

La muestra del informe examina 4096 regiones reales del mundo original: 2816 terrestres, 597 sin cruce, los 52 estilos, ocho familias y dieciséis influencias. Contiene 1606 combinaciones estructurales de género/familia/influencia y 2798 recetas distintas al comparar tres momentos. Son datos de una muestra concreta; no son un total de mundos ni prueba de canciones perceptualmente únicas. No se multiplican variables correlacionadas para afirmar millones.

Las coordenadas prácticas son muy amplias, con cinco tamaños y guardado por semilla/versiones/capa. Aumentar dimensiones no equivale a aumentar contenido reconocible. La aceptación creativa consiste en distinguir lugares al verlos y escucharlos y disfrutar sesiones largas.

## Guardados y publicación

Se conserva la partida habitual `pixel-blanco-v4`, respaldo/recuperación, premios anteriores y fechas. Las semillas mantienen sus espacios separados; WD1 conserva generación, catálogo, distribución, tamaño, capa y coordenadas. Las adiciones usan flujos de semilla independientes. Los datos futuros de memoria se conservan sin reescribirlos.

Vercel sirve la raíz estática y ejecuta `scripts/vercel-build.mjs`. El sello registra la revisión y hora UTC del artefacto construido en Vercel; localmente no se inventa un deploy. El código está marcado `2.0.0-rc.1`; nuevas candidatas incrementan `rc.N`. La versión estable se decide tras aceptación física y CI. No se publicó main desde estas ramas.

## Aceptación pendiente antes de producción estable

| Comprobación | Cómo cerrarla |
|---|---|
| CI del PR | Exigir lógica, navegador y los tres grupos de audio en verde. |
| Vercel real | Abrir el preview de F10; verificar carga, versión, revisión y sello. |
| Teléfono físico | Safari iPhone y Chrome Android: vertical/horizontal, tocar, mantener, orbitar, conectar, volver y restaurar una copia. |
| Escucha artística | Sesión de 20–30 minutos a volumen habitual y equivalente: graves/medios/agudos, descansos, timbres, percusión, cruces y quietud. Anotar lugar/WD1 y gesto si algo fatiga o se enmascara. |
| Rendimiento físico | Recorrer lugares densos, cambiar de capa y volver; comprobar tacto, audio sin cortes y temperatura. |
| PWA física | Abrir offline, actualizar con partida guardada y volver sin perder progreso; comprobar audio tras suspensión. |

Estos puntos requieren navegador/host/hardware reales o juicio auditivo humano; no se presentan como aprobados por renders ni emulación. Los defectos reproducibles se corrigen con regresión afectada. Jay añadió el pulido de tutorial, viajes, Bitácora, tarjetas y personajes al alcance actual; siguen en ramas hijas según PLAN_PULIDO_FINAL.md.

Servidor, cuentas y duetos públicos por Internet quedan fuera de este cierre. Los experimentos locales de conexión no equivalen a un servicio público multiusuario. El próximo ciclo debe definir autenticación, persistencia, sincronía, moderación operativa y costes antes de publicar ese servicio.
