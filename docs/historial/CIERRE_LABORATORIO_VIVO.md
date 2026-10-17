# Laboratorio Vivo · revisión integrada

Candidata 2.1.0-alpha.7. Este documento cubre L1–L7; no sustituye la aceptación física del cierre 2.0. El agente entrega ramas; Jay conserva PR/merge y publicación.

## Orden de revisión

| Fase | Rama | Commit de entrega |
|---|---|---|
| L1 | `feat/lab-l1-adn-territorial` | `06f5b8a` |
| L2 | `feat/lab-l2-instrumentos` | `9329c43` |
| L3 | `feat/lab-l3-interpretacion` | `445e09b` |
| L4 | `feat/lab-l4-paisaje` | `94f31e2` |
| L5 | `feat/lab-l5-aprendizaje` | `eb88907` |
| L6 | `feat/lab-l6-exploracion` | `4112a3f` |
| L7 | `feat/lab-l7-curaduria` | Consultar HEAD de esta rama |

Instantánea verificada: `origin/main` en `01032b5`, PR123–128 de Jay integran L1–L6 y su contenido coincide con la entrega L6. Las ramas históricas se eliminaron del remoto después del merge; los commits permanecen en main. L7 contiene el conjunto sobre esa ascendencia.

Cada rama desciende de la anterior. L1–L6 están integradas; la siguiente revisión corresponde a L7. Conservar la ascendencia mediante merge commits; squash o rebase entre fases puede volver a presentar cambios anteriores o causar conflictos. Los cambios concurrentes de otras ramas requieren revisión propia.

## Hallazgos y soluciones

| Hallazgo comprobado | Solución integrada | Evidencia específica |
|---|---|---|
| Cambiar parámetros no garantizaba cambiar la interpretación | Seis bandas coordinan bajo, frases, ritmo y producción | `tests/lab-score.mjs`, `tests/lab_music_mix.py` |
| Las bandas nuevas reemplazaban las influencias anteriores | Conservar los dieciséis cruces, sus grados y progresiones | `tests/lab-curation.mjs` |
| Varios géneros convergían en la misma batería | Recuperar patrones nativos dentro del tejido territorial | `tests/lab-curation.mjs`, `tests/lab_genres_mix.py` |
| Percusiones de membrana recibían alturas demasiado agudas | Cuerpos graves/medios y timbre propio; menos aire en los shakers | `tests/lab-curation.mjs` |
| Sostener un instrumento cortaba su ruta al tercer segundo | Rutas largas acotadas y liberación al salir, pausar o silenciar | `tests/lab_landscape_smoke.py`, `tests/technique_mix.py` |
| Las voces articuladas podían agotarse antes del gesto | Prioridad de jugador/práctica y sustitución suave de ambiente | `tests/instrument-techniques.mjs` |
| Las nuevas cuerdas reconstruían dos segundos de excitación | Caché por contexto, reutilización por altura, máximo ocho buffers | `tests/instrument-techniques.mjs` |
| La práctica confundía una onda con muchos gestos nuevos | Capturar únicamente los pulsos de respuesta del jugador | `tests/lab-learning.mjs`, `tests/lab_learning_smoke.py` |
| El regreso no distinguía Paisaje vivo/clásico | Metadatos musicales opcionales en Favoritos y WD1; lectura anterior conservada | `tests/lab-evolution.mjs`, `tests/lab_memory_smoke.py`, `tests/memory_smoke.py` |
| Las voces largas podían competir con ventanas y otros modos | Liberación por menú, foco, ocultación, capa, silencio y distancia | `tests/instrument_techniques_smoke.py`, `tests/instrument-techniques.mjs` |

Las pruebas también se ajustaron a dos contratos reales: el banco ofrece 26 demostraciones de síntesis y 16 filtros (42 entradas), y el recorrido de sostén debe detener el cubo al llegar. Se mantienen las comprobaciones de audio, filtros, guardado y liberación.

## Alcance musical

- 52 estilos electrónicos nativos y 16 influencias compatibles conservados.
- Seis bandas territoriales. En la muestra automática por género se observaron 51 patrones de batería diferentes; no es un recuento de canciones únicas.
- 43 especificaciones de instrumento: once voces articuladas nuevas y siete motores avanzados, además de voces anteriores. Síntesis propia; sin presets o grabaciones comerciales.
- Técnicas: apagado, deslizamiento, golpe suave, acento y soplo. Arco, vientos y pad permiten sostener/soltar. Polirritmia 3:2, respuesta, resolución, pickup y descanso.
- Secciones musicales y orquestación cambian sin caminar. La iniciativa en quietud sigue usando tiempo activo; el menú no cuenta como escucha.
- El gesto conserva espacio mediante la prioridad existente de mezcla, registro acotado, proximidad y señales locales. Los menús siguen silenciosos.

## Compatibilidad

No se cambia el generador del terreno, las coordenadas, la colocación anterior ni el ámbito de guardado. Los nuevos selectores usan semillas independientes. Las voces y arreglos de Paisaje vivo cambian deliberadamente; el modo clásico permanece disponible.

La identidad de mundo sigue separada de la identidad musical. Los códigos WD1 nuevos pueden llevar `musicVersion: 1` y `musicMode`; los antiguos siguen válidos. Esta versión identifica el intérprete final del ciclo, no una grabación ni un instante congelado. Una versión musical futura debe conservar este intérprete para regresar a su carácter. Los favoritos con versiones desconocidas se conservan sin permitir abrirlas.

Los duetos mantienen el transporte acordado anterior; la interpretación nueva se aplica al juego local. La práctica musical es optativa y no altera logros, reliquias o colecciones existentes.

## Prueba breve en teléfono

1. Abre el preview con `?dev=1`. Activa el sonido tocando el Mundo.
2. Menú → Prototipo → Laboratorio → Paisaje vivo. Compara las seis bandas durante varios compases.
3. Síntesis: compara cuerdas, arco, vientos, membranas, teclas, pad y bajo. Quédate junto a una voz sostenida; sal y verifica su liberación.
4. En el Mundo, toca habitantes y materiales. Distingue el papel que aporta cada fuente.
5. Tu recorrido → Escuchar y responder. Elige una voz, escucha dos llamadas y responde con dos pulsos espaciados.
6. Quédate quieto al menos 90 segundos. Escucha el cambio de secciones sin perder la identidad.
7. Guarda un lugar, pulsa Saltar, vuelve mediante su código. Comprueba música, capa, coordenadas y colección.
8. Abre y cierra menús. Silencia, bloquea el teléfono, vuelve y verifica una recuperación tranquila.

## Resultado automático

Validación completa aprobada: auditoría, 104 suites Node, 82 recorridos incluido offline y 581 renders de 28 programas de audio. Pico máximo medido: 0.945447; señal finita y límites aprobados por cada programa. [Evidencia](../../scripts/lab-l7-validation.json). CI de los PR y aceptación física/artística conservan su alcance propio.

Validado en UTC: `2026-10-15T17:07:34.070877+00:00`. Esta fecha corresponde a pruebas, no a un despliegue.

## Condiciones de publicación

La evidencia final incluye los comandos completos `audit:release`, `test`, `test:browser` y `test:audio` sobre el mismo código: [informe L7](../../scripts/lab-l7-validation.json).

Pendientes externos: escucha con altavoz y auriculares en Android/iPhone físicos; gusto musical, claridad y fatiga en sesiones largas; CI de cada PR; preview autenticado y comprobación del artefacto desplegado por Vercel. El render automático mide señales y contratos; no certifica calidad artística ni el sonido de un teléfono real.

No se promete ausencia absoluta de fallos o experiencias perceptualmente infinitas. Las recetas permiten mucha variedad; el criterio de producto es que explorar y tocar permita reconocerla.
