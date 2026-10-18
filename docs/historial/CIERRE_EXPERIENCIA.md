# Experiencia viva · cierre de implementación

Candidata **2.2.0-rc.1**. Este documento reúne las catorce fases, sus soluciones y la prueba móvil. Las pruebas automáticas no sustituyen escuchar el juego en un teléfono físico. La fecha de validación no es una fecha de deploy.

## Integración

Jay integró fases 1–13 en main `88c96b0` (PR #130–142). F13 `4625f2f` está integrada; F14 desciende de ella. Codex no hizo PR, merges ni push a main. Las ramas históricas eliminadas después del merge no necesitan recrearse: sus commits siguen en main.

La siguiente revisión corresponde a F14; F13 ya está en main. Conservar la ascendencia con merge commits; squash/rebase o cambios concurrentes pueden requerir resolver conflictos. La cadena común evita repetir el trabajo anterior, pero no garantiza ausencia de conflictos ante cualquier cambio externo.

| Fase / cambio | Rama | Commit | Prueba en teléfono |
|---|---|---|---|
| 1 · Auditoría y experiencia coherente | `feat/experiencia-01-base` | `0b0f1b2` | Lee este informe y abre el preview de la siguiente fase. |
| 2 · Primer encuentro jugable | `feat/experiencia-02-bienvenida` | `b89a9c2` | Menú → Tu recorrido → Practicar. Mueve, escucha, pulsa y guarda. |
| 3 · Camino, entrada y Voz | `feat/experiencia-03-camino` | `645a19f` | Entra otro día: recoge una luz; explora sin reloj. |
| 4 · Llegadas y favoritos claros | `feat/experiencia-04-viajes` | `d04867f` | Toca el marcador y después el nombre. Busca y vuelve. |
| 5 · Casa viva y edición táctil | `feat/experiencia-05-casa` | `8c8f741` | Casa → coloca un objeto; arrástralo sobre el plano. |
| 6 · Tarjetas ganadas en encuentros | `feat/experiencia-06-hallazgos` | `bd0175a` | Encuentra una rareza; abre su tarjeta y observa su función. |
| 7 · Rareza y observaciones útiles | `feat/experiencia-07-rareza` | `320fcbc` | Vuelve con otro clima o gesto; cambia la interpretación aprendida. |
| 8 · Atlas y expediciones sonoras | `feat/experiencia-08-atlas` | `af0e093` | Tarjeta → Buscar una voz complementaria. Sigue sus señales locales. |
| 9 · Coleccionar para crear | `feat/experiencia-09-creacion` | `22fc6c7` | Añade tarjetas al jardín; entra a casa, mueve y conserva. |
| 10 · Profundidad musical | `feat/experiencia-10-musica` | `bd0cf29` | Laboratorio → Síntesis. Compara cuerdas, vientos, teclas y bajos. |
| 11 · Espejos y percepción | `feat/experiencia-11-optica` | `7efed53` | Laboratorio → Vidrios o Espejos. Gira y escucha el filtro. |
| 12 · Biodiversidad territorial | `feat/experiencia-12-ecosistemas` | `d96172b` | Laboratorio → Flora/Fauna/Percusión. Recorre los nuevos linajes y cuerpos. |
| 13 · Identidad y constelaciones | `feat/experiencia-13-identidad` | `4625f2f` | Toca fuentes. Bitácora → Música → Conservar constelación; exporta y vuelve. |
| 14 · Auditoría integrada | `feat/experiencia-14-cierre` | `HEAD de esta rama` | Laboratorio → Paisaje vivo → Patio tropical/Jardín disco/Verbena eléctrica. |

Abrir el preview de la última rama con `?dev=1` permite probar el conjunto. Menú → Prototipo → Laboratorio ofrece los destinos controlados; la partida habitual queda separada. Para tutorial, usar Practicar en Tu recorrido; no borrar el guardado.

## Hallazgos y soluciones verificables

| Problema | Solución | Evidencia |
|---|---|---|
| Inicio solo textual | Bienvenida gráfica, símbolos locales y seis gestos reales | first_level_smoke, guide_smoke |
| Demasiada voz rutinaria | Introducción, solicitud explícita y eventos excepcionales; diario conservado | messages_smoke, experience-voice.mjs |
| Volver a comenzar siempre igual | Llegada nueva diaria con punto anterior guardado; retornos explícitos intactos | favorites_smoke, travel_v2_smoke |
| Favoritos mezcla destinos y herramientas | Búsqueda, fichas compactas y códigos plegados | favorites_smoke, materia_smoke |
| Casa sin anticipación ni manipulación directa | Selección, fantasma previo y arrastre; cancelación segura | house_v2_smoke, house.mjs |
| Hallazgos sin función musical clara | Rol visible, tarjeta con retrato y señal local contenida | living-cards_smoke, rare_cards_smoke |
| Repetición sin progreso | Aprender técnicas al cambiar clima/fase/gesto; no duplicar premios | experience_learning_mix, living-cards_smoke |
| Atlas sin relaciones jugables | Expediciones optativas a fuentes reales complementarias | atlas-play.mjs, living-cards_smoke |
| Tarjetas solo para mirar | Jardines de cuatro voces, posiciones y ocho sets nuevos; colección intacta | experience_garden_smoke, experience_garden_mix |
| Paleta demasiado parecida entre encuentros | 32 instrumentos articulados nuevos y 24 gramáticas de respuesta escasas | technique_mix, performance_mix |
| Filtros ópticos poco audibles | Ángulo/alineación abren filtros de la fuente en una a cuatro etapas | glass_smoke, synth_bank_mix |
| Vida y percusión poco diversas | Veinte linajes, doce cuerpos acústicos y 22 perfiles territoriales | expanded-ecology.mjs, living_mix, percussion_mix |
| Sesiones sin recuerdo propio | Constelación de fuentes tocadas, imagen y dirección completa | experience_identity_smoke, constellations.mjs |
| Pocos lugares de fiesta | Tres bandas originales en géneros bailables compatibles | festive-territories.mjs, experience_festival_smoke, lab_music_mix |
| Una casa futura podía cambiar al tocar | Bloquear interacción, reproducción y exportación del esquema desconocido | house_v2_smoke, house.mjs |
| Objetos futuros competían por presupuesto de voces | Filtrar objetos reproducibles, conservando los datos desconocidos | house-audio.js, house.mjs |
| Editar un objeto podía perder campos adicionales | Fusionar posición nueva con metadatos existentes | house.mjs |
| Una tarjeta archivada no volvía al catálogo | Rehidratar reconocidas, deduplicar y conservar las aún desconocidas | rare_cards.mjs |
| Quedaban respuestas después de viajar o cambiar de capa | Rechazar colas a más de 360 px o en otra capa | performance.mjs, performance_mix |
| Figuras ampliadas se volvían elipses en casa | Usar anatomía del ejemplar y glifos ampliados | living-art.js, experience_garden_smoke |
| Listas futuras podían romper paneles | Filtrar la vista sin destruir datos; proteger jardín/atlas | atlas-play.js, collection-garden.js, identity-play.js |
| Laboratorio esperaba 250 ms por destino | Esperar el estado real manteniendo todos los destinos y comprobaciones | lab_smoke |
| Contador de colección de prueba quedó en 109 | Exigir el catálogo actual de 141 familias | discoveries_smoke |

Durante el cierre se atendió la petición adicional de Jay: más fiesta feliz. Patio tropical, Jardín disco y Verbena eléctrica usan grooves nativos, maderas, membranas, cuerdas, teclas y vientos articulados. Solo se seleccionan en doce géneros bailables compatibles; no convierten ambient ni las zonas tranquilas. Se eligió un 65% del hash de territorios elegibles; no equivale al 65% del universo. La muestra de 2.601 regiones contiene 237 zonas festivas entre 353 regiones compatibles. Cada tercer Saltar da prioridad a encontrarlas, con búsqueda acotada y posibilidad de otro destino si no encuentra una. La animación local oscila como máximo 1,8 px y respeta movimiento reducido. No sube el máster ni añade audio a botones.

La prueba de celebración solicita ahora explícitamente la Voz: su apertura manual debe respetar el contrato solicitado, mientras los avisos rutinarios permanecen discretos. Se mantienen las comprobaciones de pausa, tamaño y exportación.

También se corrigió la importación en caliente de una casa futura: se normaliza antes de habilitar controles, aunque la identidad de la sesión no cambie. Una tarjeta de tipo conocido con versión de mundo futura se archiva intacta, en lugar de descartarse por no poder interpretarla todavía.

## Inventario final y límites

- Once biomas y 33 hábitats anteriores; 22 ecorregiones nuevas son perfiles sobre esos biomas. No se entregaron 22 biomas nuevos.
- 48 linajes vivos, 75 especificaciones de instrumentos, 43 voces articuladas, 21 familias acústicas naturales y 168 articulaciones físicas.
- 52 géneros, dieciséis influencias de radio, nueve bandas territoriales y 24 gramáticas de respuesta. Esas gramáticas no son géneros nuevos.
- Setenta tipos de tarjetas, 141 familias registrables y 246 destinos del laboratorio en 21 grupos.
- Casa: cuarenta objetos previos, cuatro habitaciones, hasta cuatro voces de tarjetas activas y un brote ganado; todos comparten el límite de cuatro voces por paso.
- Jardines: hasta ocho sets nuevos. Constelaciones: hasta 24 recuerdos nuevos y 32 fuentes por figura. Guardados anteriores por encima de esos límites se conservan; solo se limita admitir nuevos.
- Anatomías, perfiles y cuerpos nuevos usan flujos independientes; no cambian terreno, semilla, coordenadas ni colocación anterior. Se añaden encuentros escasos en huecos elegibles.
- Negro, Geist Mono, esquinas rectas y controles silenciosos. El contenido musical usa Web Audio propio; no incluye muestras o presets comerciales.

No hay una cifra comprobada de canciones únicas ni se afirma que los productos de estos catálogos sean independientes. El universo se genera por coordenadas y semilla; favoritos y tarjetas conservan dirección de mundo, capa y versión. Volver conserva el carácter y lugar, no un instante musical congelado. Las constelaciones tampoco son grabaciones: representan relaciones de fuentes tocadas.

## Resultado automático

Auditoría sin errores ni advertencias, 113 suites Node, 86 recorridos de navegador incluido offline y 789 renders de 31 programas de audio: aprobados. Prueba HTTP/SQLite aprobada. Pico máximo medido 0.945447. [Evidencia final](../../scripts/experience-14-validation.json).

| Comando completo | Resultado |
|---|---|
| `npm run audit:release` | Aprobado · salida 0 |
| `npm test` | Aprobado · salida 0 |
| `npm run test:browser` | Aprobado · salida 0 |
| `npm run test:audio` | Aprobado · salida 0 |
| `python3 tests/server_api.py` | Aprobado · salida 0 |

Validado en UTC: `2026-10-15T21:29:06.192006+00:00`. Huella del código: `011dcb5c094a26aeaefb328312f7fa4b4e30d0d0387f9dab857c0488ce0d8b42`. Las pruebas completas se ejecutaron sobre esa huella; después solo se actualizó documentación. El informe conserva métricas por render y programa. Los informes 02–13 conservan su estado histórico; F1 documental registra auditoría y 104 suites en PLAN_EXPERIENCIA.md.

Los intentos parciales y sus correcciones constan en el informe: se reinició al añadir las fiestas y al corregir la casa futura; se actualizaron dos expectativas antiguas de pruebas. Ninguna prueba fue desactivada.

## Qué no cambia

El catálogo previo sigue jugable. Guardar y viajar sigue usando semilla, coordenadas, capa y versión; no sustituimos esas direcciones por nombres. La partida normal, las pruebas del laboratorio y las visitas a casas se mantienen separadas. No caducan logros, tarjetas o favoritos por no entrar. Los poderes de las cajas conservan su duración de juego activo. La música no se inicia al elegir una tarjeta, abrir un panel, guardar un jardín ni exportar una imagen.

## Condiciones externas

- Escuchar con altavoz y auriculares en Android/iPhone físicos: graves, fatiga, diferencias entre ambientes y respuesta al tocar.
- Probar tacto, desplazamiento de paneles y selección/arrastre en vertical/horizontal; reanudar tras bloquear el teléfono.
- Verificar CI de los PR y el preview Vercel; tras merge, comprobar actualización offline y sello de versión/deploy en el menú.
- Decidir artísticamente si las bandas festivas y las nuevas voces tienen el carácter esperado. Los límites numéricos de audio no certifican gusto musical ni dominio público de contenidos externos futuros.

El servidor opcional se conserva: una prueba HTTP local no significa que las cuentas estén desplegadas. Vercel sigue sirviendo el juego estático; cuentas/duetos requieren alojar el servicio Python por separado.
