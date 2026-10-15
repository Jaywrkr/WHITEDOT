# Pulido de identidad, colección y música

Nuevo alcance solicitado por Jay después de integrar Experiencia viva. Base: main `d7ea883`, PR #143, con F14 `b2faf63`. No reiniciar los planes anteriores.

Una rama por fase; la siguiente parte de la anterior si todavía no está integrada. Codex hace commit y push; Jay crea PR y hace merge. Mantener la ascendencia reduce conflictos; un squash, rebase o cambio externo puede exigir resolverlos. Entregar y probar fase a fase.

| Fase | Rama | Qué se implementa | Estado |
|---|---|---|---|
| 1 · Medición y escucha | `feat/pulido-01-medicion` | Recorridos reproducibles, incertidumbre y diez comparaciones en laboratorio | Implementada y probada; entrega en esta rama |
| 2 · Tu cubo | `feat/pulido-02-cubo` | Apariencia/Movimiento/Voz, vista previa fiel, estados y prueba reversible | Pendiente |
| 3 · Tarjetas y álbum | `feat/pulido-03-tarjetas` | Retratos, celebración proporcional, procedencia y uso musical claros | Pendiente |
| 4 · Explorar con intención | `feat/pulido-04-exploracion` | Memoria reciente, pistas y contraste de gestos y lugares | Pendiente |
| 5 · Dirección musical | `feat/pulido-05-curaduria` | Recetas, fraseo, percusión, registros y espacio para la interacción | Pendiente |
| 6 · Validación conjunta | `feat/pulido-06-cierre` | Integración, migraciones, offline, móvil y auditoría musical | Pendiente |

## Contrato común

- Negro, Geist Mono, esquinas rectas, selección blanca y dorado para lo ganado. Una indicación breve por momento; textos de interfaz de hasta doce palabras.
- UI silenciosa. Los instrumentos se prueban en un espacio musical deliberado; seleccionar opciones no reproduce notas.
- Conservar todo el progreso, también campos desconocidos y guardados futuros. Cosméticos sin ventajas de poder.
- No mover mapas, favoritos o premios existentes ni consumir sus flujos aleatorios. Buscar novedad seleccionando lugares que ya existen.
- Separar presencia, proximidad, interacción y premio. Una tasa espacial o una simulación no es una probabilidad horaria de jugadores.
- Primero escuchar y organizar lo existente. Las cantidades de catálogo no equivalen a canciones perceptualmente diferentes.
- Por fase: auditoría y Node completos; navegador y renders de audio afectados. Conjunto final: suites completas. CI, teléfono físico y deploy se informan por separado.

## Fase 1 · Base reproducible

### Entrega

- `scripts/encounter-model.mjs`: una hora potencial de exploración o quietud; usa los generadores reales de población, expansión, percusión, reliquias, cajas, bandadas, plantas y santuarios. Conserva la generación acuática y la elegibilidad marítima de las reliquias.
- `npm run audit:encounters`: ejecuta ambos perfiles en seis semillas, con 192 rutas por perfil por defecto. Exporta JSON mediante `--output`. No lee partidas ni entrega premios.
- Exploración: 30 minutos de desplazamiento nominal a 190 unidades/s y 30 de escucha, radio de proximidad 180, superficie. Quietud: una hora en el punto inicial; no inventa nuevas tiradas espaciales por esperar.
- Cada tipo cuenta una vez por ruta. Exporta proporciones e intervalos de Wilson; no convierte un tipo no observado en imposible. Las rutas comparten semillas: los intervalos no cubren todos los errores del modelo.
- `src/listening-reference.js`: diez parejas sobre destinos existentes. Percusión, blues, fiesta, grave/espacio, cuerda/tecla, aire/arco, filtros, óptica y quietud.
- Laboratorio → Notas → Escucha comparada. Seleccionar una pareja es silencioso; A/B abre el destino existente. Usa las notas y veredictos locales del laboratorio. El informe aclara cuando falta evaluar un lado.

### Límites

Las fuentes se muestrean en su posición inicial. No se simulan movimientos de criaturas, clima, niebla, atención humana, mezcla audible o resolución de reliquias. Los inicios son lugares terrestres aleatorios, no el tutorial. Las claves del informe mezclan funciones de diagnóstico, géneros y familias; su cantidad no cuenta nuevos elementos del juego. No se modelan Saltar, poderes ni modificadores de velocidad. El resultado representa oportunidades potenciales; no tarjetas ganadas ni probabilidades universales por hora.

### Probar en teléfono

1. Abre el preview con `?dev=1` y entra en Prototipo → Laboratorio.
2. Abre Notas → Escucha comparada. Elige Golpe y raspado.
3. Entra en A, escucha y mueve el cubo. Compara Solo y mezcla.
4. Anota lo que funciona o falla; prueba B con el mismo volumen.
5. Copia o descarga el informe. La partida habitual permanece separada.

Repetir con Dos fiestas, Grave y silencio y Cuerda y tecla. Escuchar 90 segundos por lado, sin subir el volumen para favorecer una opción. No se presume escucha física completada.

### Resultado

Aprobados: `npm run audit:release` (0 errores y 0 advertencias), `npm test` (115 suites), `listening_reference_smoke.py`, `lab_smoke.py` (246 destinos), `ui_silence_smoke.py` (móvil y escritorio) y `offline_smoke.py` (177 módulos). Modelo: 192 rutas por perfil, 384 en total; evidencia en `scripts/pulido-01-encounters.json`. Registro de validación: `scripts/pulido-01-validation.json`.

No se modifica síntesis ni mezcla; no se repite audio para esta fase. Suite completa de navegador, CI, deploy y escucha física no se presentan como ejecutados. La revisión de móvil físico conserva el procedimiento anterior.

## Fase 2 · Tu cubo

Agrupar las siete categorías en Apariencia, Movimiento y Voz. Mostrar la apariencia real también al inspeccionar bloqueos, manteniendo explícito que no se puede equipar. Vista previa, aplicación y restauración coherentes, estados accesibles y piezas ganadas primero. Revisar rutas alternativas a requisitos largos sin retirar propiedad ni convertir cosméticos en mejoras de poder.

Lista cuando una persona identifica qué lleva, qué ganó y cómo consigue lo siguiente; puede probar y deshacer en móvil sin perder su configuración.

## Fase 3 · Tarjetas y álbum

Separar retrato/nombre/función del detalle de procedencia y probabilidad. Celebración local proporcional al primer hallazgo; repeticiones discretas y registro completo. Distinguir nuevo tipo, nuevo ejemplar e interpretación. Integrar volver al sitio y usar voces mediante las capacidades de jardín y técnicas ya existentes; no consumir tarjetas.

Lista cuando se entiende cómo despertar una reliquia, por qué el hallazgo importa y qué se puede hacer con él. Los avisos no bloquean explorar ni reproducen una fanfarria de interfaz.

## Fase 4 · Explorar con intención

Usar memoria reciente de timbres, funciones, acciones y territorios para sugerir contraste en destinos existentes. Enseñar gestos mediante señales de sus fuentes, relaciones y posibilidades opcionales. Regresar a lugares desde sus fichas y mantener el vacío, la calma y las coordenadas.

Lista cuando un jugador descubre tres acciones diferentes sin manual y reconoce sus consecuencias. La quietud desarrolla una identidad musical, no fuerza cambios arbitrarios de canción.

## Fase 5 · Dirección musical

Escuchar recetas completas con volumen comparable; seleccionar, ajustar o retirar de la selección activa sin borrar el historial. Distinguir fusiones por fraseo, ritmo, armonía y articulación. Proteger graves y medios, variar percusión y dejar espacio audible al gesto del jugador. Relacionar la respuesta visual con el sonido que realmente modifica cada fuente.

Lista cuando se reconocen familias sin ver sus etiquetas y se identifica la contribución de cada gesto. Medidas de audio y escucha física se complementan; ningún puntaje automático acredita buen gusto ni un máster profesional.

## Fase 6 · Cierre verificable

Recorrer tutorial, cubo, hallazgos, jardín, guardado, vuelta y escucha larga en conjunto. Auditoría, Node, navegador/offline y audio completos; comprobar archivos de evidencia y pendientes reales. Mantener visibles las condiciones externas: CI, artefacto desplegado y escucha en teléfonos físicos.

Lista cuando la implementación y sus pruebas están cerradas, y cada pendiente externo tiene un procedimiento concreto de comprobación. No declarar perfección ni aceptación física sin evidencia.
