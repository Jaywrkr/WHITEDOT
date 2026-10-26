# Panel9 · alpha.200 integrada

**Panel simulado: no opiniones reales ni jurado humano. Diez revisores nuevos, sin notas anteriores.** [Expediente](expediente.md), [cálculo y cobertura](evidencia/notas.json).

## Resultado actual

**7,6/10 provisional** (media calculada de ejes7,6472). Se juzga con exigencia; CI verde no se convierte en una nota sensorial. Audio describe estructura y sincronía, no una escucha del panel. Sensación es inferencia de tres revisores; siete se abstuvieron. Esta cifra no certifica nueve, perfección ni aceptación de lanzamiento.

| Categoría | Nota | Revisores con nota |
|---|---:|---:|
| Visual | 7,5 | 9/10 |
| Audio técnico | 7,9 | 5/10 |
| Creatividad | 8,1 | 10/10 |
| Sensación* | 7,3 | 3/10 |
| Cohesión | 7,8 | 10/10 |
| Pulido | 7,3 | 10/10 |

*Sensación: provisional y de confianza baja. Sin jugar ni escuchar en un teléfono físico. Audio también es exclusivamente técnico. Las notas brutas de cada revisor son medios puntos; las medias pueden tener decimales.*

| Lente | Visual | Audio técnico | Creatividad | Sensación* | Cohesión | Pulido |
|---|---:|---:|---:|---:|---:|---:|
| [Tetsuya Mizuguchi](01-mizuguchi.md) | 6,5 | 7,5 | 7,5 | — | 7 | 7 |
| [Toshio Iwai](02-iwai.md) | 7,5 | 8 | 8 | — | 7,5 | 7,5 |
| [Masaya Matsuura](03-matsuura.md) | 7,5 | 8 | 8 | — | 8 | 7,5 |
| [Simogo](04-simogo.md) | 7,5 | — | 8 | — | 8 | 7 |
| [Ed Key y David Kanaga](05-proteus.md) | 7 | 8 | 8 | 6,5 | 7,5 | 7 |
| [Jenova Chen](06-chen.md) | 8 | — | 8,5 | — | 8 | 7,5 |
| [Conrad Roset](07-roset.md) | 8,5 | — | 8,5 | 8 | 8,5 | 8 |
| [Ken Wong](08-wong.md) | 8 | — | 8,5 | 7,5 | 8 | 7,5 |
| [Lucas Pope](09-pope.md) | 7 | — | 7,5 | — | 7 | 6,5 |
| [Austin Wintory](10-wintory.md) | — | 8 | 8,5 | — | 8 | 7,5 |

## Lo más logrado

Identidad negra consistente, cubo pequeño, color ganado y controles contenidos. La guía contextual y el camino al siguiente lugar ya tienen estructura verificable. La colección puede usarse como conjunto musical y la canción conserva frases/tiempos del jugador. El guardado protege operaciones fallidas. Son fortalezas observadas, no pruebas de emoción o comprensión humana.

## Qué corregir primero, sin rehacer música ni mundos

1. **P2 · Porcentaje que aparenta premio cumplido.** `src/places.js:125,128` redondea74,6% a75%, mientras `:22,27` exige75% real. Sonda: muestra75 y no da ★★. Mostrar precisión/umbral coherentes, conservando la regla y los premios.
2. **P3 · Tiempo de resultado incoherente.** `src/places.js:125,129` calcula minutos truncados y segundos redondeados:59.999ms aparece0:00. Derivar ambos de los mismos segundos totales.
3. **P2 · Sincronía visual residual.** `src/audio.js:308,320–324` programa varias luces de flores/solistas/cantores/cola sin sumar latencia de salida; el cubo sí la incluye (`src/journey-pulse.js:63–65`). Discrepancia de código confirmada, magnitud perceptiva sin medir. Alinear solo esos avisos visuales y probar salida demorada; no cambiar notas, mezcla ni generación. Es un remanente del ámbito S04; no declarar que todas las luces están resueltas.
4. **Lectura local.** Nombres pendientes de Tu canción usan `#8a8a8f` con alpha0,4 (`src/song-stage.js:31`): contraste aproximado1,8:1 sobre negro. La captura confirma lectura tenue. Dar legibilidad al texto sin cambiar el negro, el cubo ni el color ganado. Jardín/Ruinas comparten siluetas de poco contraste: validar en movimiento antes de alterar su jerarquía.
5. **Descubrir la acción.** En Lugares, el listado tiene desplazamiento y el destino próximo cae bajo el borde del área; la acción «Seguir» permanece visible. Una señal de desplazamiento/jerarquía más clara podría ayudar. Jardín y Vacío requieren comprobar si se entiende ayuda y «pulso válido sin avance» sin explicación externa. Son riesgos de comprensión; no fallos humanos demostrados.
6. **Final5.** La pantalla completa permite omitir tras dos segundos (`src/journey-finale.js:73`) sin acción visible durante la reproducción. Evaluar un cierre/salto explícito y discreto para evitar abandono accidental; no tocar su música.

No se encontró aquí un bloqueo P1 reproducido nuevo. Esto no demuestra ausencia de todos los defectos: las revisiones fueron acotadas.

## Propuestas que no se convierten en errores

- La entrada libre antes de ganar un lugar y saltarse el orden son propuestas de Proteus, contrarias al diseño vigente de Jay. No se aplican ni se presentan como regresión.
- La transición musical lenta y la armonización del final son decisiones deliberadas para conservar continuidad/agrado. Hay límites expresivos verificables, pero no una prueba de que suenen mal. No reabrir la música que Jay quiere conservar sin escucha y decisión suya.
- Soltar el toque fuera del cubo permite distinguir arrastre/escáner; no es el fallo ya corregido del toque inmediato en el cubo. El límite400ms de compensación pide datos de dispositivos antes de una corrección.
- La tarjeta explica que Detalle/Cambio se interpreta como melodía en el jardín (`rare-cards.js:81`, `garden-model.js:8`). Es un límite de expresión, no una promesa silenciosamente incumplida. Preescuchar una interpretación sería una mejora opcional, no un sonido de menú automático.

## Puntuaciones anteriores

| Evaluación | Versión | Media registrada |
|---|---|---:|
| Sesión1 | alpha.96 | 6,4 |
| Sesión2 | alpha.160 | 7,2 |
| Sesión3 | alpha.167 | 7,5 |
| Sesión4 | alpha.174 | 7,7 |
| Sesión5 | alpha.181 | 8,1 |
| Sesión6, nuevo feedback de Jay | alpha.181 | 7,2 |
| Cierre K6, técnico | alpha.187 | 7,9 |
| Sesión7 | alpha.187 | 7,74 |
| Sesión8, ciega exigente | alpha.192 | 6,83 |
| Dictamen durante N8 | alpha.200 aún en corrección | Sin media final comparable |
| Sesión9, actual | alpha.200 integrada | **7,6 provisional** |

Fuentes: [historial del panel](../../PANEL.md#4-historial), [K6](../sesion-6/cierre-k6.md), [sesión7](../sesion-7/informe.md), [sesión8](../sesion-8/informe.md) y [dictamen N8](../candidato-n/revision-ciega.md). Las cifras se conservan tal como fueron registradas. Cambiaron alcance, rigor, revisores y evidencia; una bajada de nota no prueba por sí sola que el producto haya empeorado. La integración en main no constituye otra mejora artística.

## Próximo cierre propuesto

Primero corregir los errores de presentación reproducidos y el remanente de sincronía visual; después probar comprensión de Jardín/Vacío/Lugares y escuchar el final sin ayuda. Mantener música, generadores y estética. Son recomendaciones de esta auditoría: esta rama solo registra evidencias y notas. Aceptación sensorial, sesiones nuevas, lectores, Safari y rendimiento físico siguen en V01/P01 y el registro canónico; no se cierran por el7,6.
