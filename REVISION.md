# Revisión de Claude, nitidez musical y dirección del proyecto

Fecha: 2026-10-13. Base revisada: `origin/main` `5413d5f`, PR #35. Rama de esta entrega: `review/claude-audio-clarity`. Flujo: commit/push; Jay PR/merge. Este informe acompaña [HANDOFF.md](HANDOFF.md), [CAMBIOS.md](CAMBIOS.md) y [PENDIENTES.md](PENDIENTES.md).

## Resultado principal

Claude integró instrumentos procedurales, Atlas, 18 ritmos afroamericanos (52 estilos en total), continentes/mares/vitalidad, hitos sonoros, tierras raras/mapa, PWA/joystick, anomalías/ríos, tormentas/estaciones/huellas, Subsuelo/Cielo, looper, banda y mesa de efectos. Son funciones presentes en main; varios Markdown seguían describiéndolas como pendientes o con snapshots antiguos.

La música actual gusta a Jay. Esta rama mejora rutas de mezcla y protección de salida, manteniendo composición, ritmos, notas, familias de síntesis y acciones. También corrige estados documentales y organiza propuestas futuras: primero catálogo/recetas extensibles y coherencia, después nuevos elementos e influencias culturales. No implementa esas nuevas mecánicas ni los fallos de juego enumerados abajo.

## Hallazgos de código y estado

### A. Saturación continua y picos al límite — corregido en esta rama

En `src/audio.js`, el shaper final aplicaba `tanh(1.05*x)/tanh(1.05)` a todas las muestras. Su pendiente cerca de cero supera 1 y curva la señal a niveles moderados: no actúa solo ante un pico. El compresor/limitador no evita por sí solo todos los transitorios, y el sobremuestreo del shaper puede generar pequeños overshoots. En las 13 renderizaciones de referencia, los casos normales alcanzaron picos de 1,0005–1,0066; entre 0,2–0,6 % de muestras superaban 0,98 en muchos casos.

Cambio: protección lineal hasta amplitud 0,9, rodilla suave solo por encima, sobremuestreo 4× y ganancia final 0,98. Corte de 20 Hz para energía subsónica. `src/mix.js` centraliza curva y filtros; no modifica generador ni sonidos de instrumentos. Compresión/compensación y realces existentes se conservan. Robot sigue siendo un efecto explícito del jugador.

### B. Graves en reverberación y eco — corregido en esta rama

Retornos general y del pad antes mezclaban graves sin corte dedicado. Ahora reverb general usa paso alto 150 Hz/paso bajo 7.500 Hz; pad reverb 180/8.000 Hz; ecos 110/8.000 Hz, además del tono filtrado existente. Se mantienen tiempos/feedback y señal directa: bombo/bajo conservan cuerpo seco, las colas ocupan menos espacio grave. Filtros permanentes por contexto, no nuevos nodos por nota.

Pad neutro antes conservaba Q=4 en ambos filtros. Ahora usa Q moderada en neutro y recupera resonancia 4 al barrer activamente. Los efectos siguen siendo expresivos; regreso a limpio comprobado en móvil/escritorio.

### C. Fuentes de superficie permanecen activas en otras capas — pendiente, prioridad alta

Referencias: `src/layers.js` (`enter`, `layerDNA`, `layerStep`), `src/render.js` (selección de capa) y `src/audio.js` (`MU.near`, `MU.singers`, faros y flores en playStep).

Reproducción: cargar un objeto en `MU.near` y una forma en `MU.singers`, entrar a Subsuelo y ejecutar `layerStep`. Ambos arreglos siguen con longitud 1. El loop de capa sustituye el de superficie, que reconstruye esas fuentes; el scheduler sigue consultándolas por `inWorld()`. Objetos de la superficie pueden continuar sonando y capas de faros/flores también siguen habilitadas. Definir qué acompaña al jugador y limpiar/suspender lo demás al transicionar. Añadir prueba que cruce sistemas, pues los smokes individuales no lo detectan.

### D. Ecos reconstruyen mal las regiones sintéticas — pendiente, prioridad alta

Referencia: `src/jam.js:55`, y claves de `src/layers.js:68`/`:69`.

Looper guarda `region.key` y luego divide por coma suponiendo una clave de superficie `rx,ry`. Para `bajo:0,0`, Number('bajo:0') produce NaN. Reproducción con generador real: clave grabada `bajo:0,0` reconstruye región `NaN,0`, género ambient en la base revisada. No se observó excepción, pero se reproduce una voz/región equivocada. Claves `cielo:` tienen el mismo problema de esquema. Conservar receta válida de capa o ubicación/capa explícitas; no parsear todos los IDs como coordenadas. Resolver también identidad/material y posición del eco por capa.

### E. Retorno del Estudio puede dejar ADN de superficie en Subsuelo/Cielo — pendiente, prioridad alta

Referencias: `src/studio.js:76` y `:83`, `src/layers.js:70`.

Estudio y su salida asignan `MU.dnaT` desde `regionOfPos(wx,wy)`, siempre superficie. La capa conserva `S.layer` y su caché privada `dnaKey`; mientras la celda no cambie, `layerDNA` no vuelve a asignar ADN sintético. Reproducción confirmada: tras abrir/cerrar Estudio y ejecutar otro paso de capa, `S.layer` sigue `bajo`, pero `MU.dnaT.key` pasa de `bajo:0,0` a `0,0`. El problema combina dos funciones aprobadas por separado. Caso de regresión: entrar a una capa, abrir/cerrar Estudio, permanecer quieto y comprobar que la música vuelve a la receta de esa capa. Verificar también bioma del Estudio desplegado en capa y retorno tras recarga.

### F. Grabación identifica autoría mediante una ventana temporal — pendiente, prioridad media

Referencia: `src/jam.js:39–43` y `bandStep`. La ventana de 1.300 ms después de input/última nota admite cualquier `playVoice`; un sonido automático cercano puede entrar. El filtro `kind.startsWith('band:')` no excluye la banda real: `bandStep` emite `forma:<id>`. Esto contradice la promesa estricta «solo lo que tú causas». Revisión estática; falta una prueba funcional de autoría. Etiquetar origen de evento (jugador/banda/ambiente/eco) o acordar que se graba mezcla de eventos y explicarlo. No confundir el looper con captura de audio.

### G. PWA offline inicial no queda demostrada — pendiente, prioridad media

Referencia: `sw.js`, `src/pwa.js`. SHELL precarga HTML/CSS/manifest/icono, no módulos `src/`. Registro ocurre al load, después de cargar módulos de la primera visita; estos no necesariamente quedan en la caché del worker. Además, cualquier fallo de recurso sin caché puede devolver index.html, incluso para un import JavaScript. Resultado probable: primer reinicio offline falla con módulo de tipo HTML. Lectura de código, no reproducción HTTPS/offline en dispositivo. Smoke móvil valida manifiesto/iconos/control, no instalación y reinicio offline completos. Precargar recursos necesarios o fijar alcance offline y devolver fallos adecuados para imports.

### H. Coherencia gráfica aún necesita dirección artística — planificada

Inspección de capturas actuales de FX, banda, Subsuelo y Cielo, en móvil/escritorio. La superficie mantiene negro, glifos y trazos; hitos/FX/capas añaden curvas/halos y el Cielo presenta bloques de regiones de color. La banda/looper añade información cerca del borde inferior: una barra puede competir con sus ranuras. No es error general de render, sino estilos y jerarquía por unificar. La nueva intención de Jay conserva fondo negro y concentra color en elementos. Fase específica con reglas comunes, sin eliminar los aportes de Claude por gusto técnico.

### I. Documentación con estados contradictorios — corregida

PENDIENTES aún refería main PR #26, Atlas pendiente y perfiles «en rama»; HANDOFF decía looper pendiente y luego documentaba su integración; CAMBIOS conservaba 34 géneros y ausencia de mapa/looper/banda en límites; pruebas, guardado y densidad estaban incompletos. Actualizados snapshots, funciones presentes, campos añadidos, comandos y plan. Se conservan las etapas históricas, marcando números/mediciones anteriores como históricos, no estado actual.

## Medición antes/después

`tests/audio_mix.py` usa Chromium/OfflineAudioContext con scheduler, instrumentos, voces, efectos/proximidad y perfiles reales; reloj virtual, ruido/RNG deterministas, 10 segundos por caso. Métricas calculadas desde segundo 1 hasta segundo 10, sobre ambos canales. Ocho géneros, cinco casos extra (densidad, FX, Suave, 44.100 Hz); resto a 48.000 Hz. No incluye todo el mundo visual ni todas las formas de interacción. No es LUFS, medición certificada de true peak ni prueba de calidad artística.

| Caso | Pico antes | Pico después | RMS antes (dBFS) | RMS después (dBFS) |
|---|---:|---:|---:|---:|
| Minimal | 1,0011 | 0,9294 | −13,04 | −14,83 |
| Dub techno | 1,0010 | 0,9293 | −9,52 | −11,26 |
| Ambient | 1,0005 | 0,9294 | −7,36 | −8,93 |
| Tropical | 1,0021 | 0,9299 | −11,55 | −13,30 |
| Nu-disco | 1,0033 | 0,9325 | −12,58 | −14,47 |
| Amapiano | 1,0009 | 0,9294 | −13,12 | −15,04 |
| Trap | 1,0028 | 0,9329 | −7,03 | −8,16 |
| Drum & bass | 1,0066 | 0,9381 | −14,72 | −16,64 |
| Minimal + 8 fuentes repetidas | 1,0065 | 0,9441 | −9,67 | −11,64 |
| Denso + reverb/eco de pad | 1,0021 | 0,9412 | −8,11 | −10,58 |
| Minimal Suave | 0,9661 | 0,8681 | −19,28 | −21,60 |
| Denso Suave | 0,8323 | 0,7054 | −18,09 | −20,47 |
| Denso a 44.100 Hz | 1,0026 | 0,9352 | −9,77 | −11,71 |

Todos los casos corregidos: cero muestras >0,98, picos <0,96. Se evita recuperar volumen con otra subida de ganancia que vuelva a empujar limitador. Descenso medio de ~1–2 dB en casos normales y ~2,5 dB con FX/Suave: margen y menor coloración, no cambio de patrones. Jay escucha si necesita ajuste posterior de nivel.

Prueba aislada de salida con seno de 1 kHz a amplitud 0,5: residuo relativo tras quitar fundamental pasa de −33,35 dB a −85,34 dB. Mide distorsión/ruido introducidos por shaper y sobremuestreo en ese caso, no THD de toda la música. Reverb nueva a 40 Hz: −22,61 dB; a 1 kHz: +0,19 dB, conserva medios y reduce cola grave.

## Verificación ejecutada

- Las 26 suites de `npm test`, antes y después del cambio, aprobadas; prueban los 52 estilos.
- Diez smokes: smoke, atlas, world, journey, mobile, wonders, alive, layers, jam y fx, aprobados. Todos los que incluyen ambos formatos pasan móvil/escritorio; mobile prueba táctil móvil.
- `python3 tests/audio_mix.py`: 13 renderizaciones + prueba de salida/filtros, aprobadas. Helper `tests/audio_mix.mjs` es módulo de navegador, no suite Node adicional.
- Casos de revisión de capas/looper con runtime instrumentado solo en prueba, nunca expuesto en producto.
- Sintaxis y enlaces/documentación comprobados al cerrar esta rama. Sin build ni cambio de clave v4.

Los smokes no cubren todos los cruces enumerados. Que pasen no elimina esos hallazgos. Jay valida nitidez, groove y fatiga escuchando en teléfono y auriculares; no se afirma equivalencia con un master profesional final.

## Cuántas variantes hay ahora

Muestra reproducible: regiones con rx/ry desde −50 hasta 49, centros `(r+.5)*3600`. Contar bioma (`z`), género y multiplicador de gravedad: 1.517 combinaciones observadas entre 11 biomas, 52 estilos y 3 velocidades. La cuenta teórica de esos tres campos es 1.716, pero no implica que todas las combinaciones sean accesibles.

Al sumar hábitat, suelo, aire, escala, BPM, transposición, patrón, track, tipos de plantas y anomalía, las 10.000 regiones tienen firmas distintas. No se usaron nombre/clave de región como diferenciador. No es total del mundo ni garantía de 10.000 experiencias radicalmente distintas: campos correlacionados y diferencias pequeñas también cuentan. «Al menos 10.000 variantes comprobadas» es la respuesta conservadora; «millones» es objetivo de combinaciones futuras, no cifra total medida.

## Orden acordado como propuesta

La música gusta; limpiar antes de expandir. Después estabilizar cruces, definir recetas/catálogo extensibles, probar variedad/compatibilidad con lo actual y unificar lenguaje gráfico. Luego quietud, favoritos/retorno/autopilot, instalaciones de vidrios/espejos, gestos musicales, pistas/personajes, referencias de muchas culturas con flora/fauna congruentes, construcción y escenas, y finalmente red. PENDIENTES contiene 31 fases con implementación y aceptación. Cada aprobación autoriza su fase, no todo el catálogo de ideas.

## Seguimiento: fase 2

Los hallazgos C, D, E y F quedan corregidos en `feat/02-layer-jam-consistency`, basada en `fe32566`; el informe anterior describe la base auditada. Nueva prueba `layer_jam_smoke.py` confirma restauración de Subsuelo/Cielo después del Estudio, aislamiento de fuentes/eco por capa y exclusión de banda/ambiente de grabación. Pendientes PWA offline y refinamiento visual se mantienen separados.

## Cierre de las primeras diez fases

Además de corregir los cruces revisados, la cadena añade catálogo/recetas, distribución compatible, reglas visuales, quietud, favoritos, orientación, autopilot y vidrios cromáticos. Ya no aplicar las antiguas afirmaciones de ausencia de favoritos/autopilot a la rama 10; describían main 5413d5f. PWA offline completo, escenas y red siguen pendientes. Integración en RAMAS.md.

### Fase 11: espejos musicales

Rama `feat/11-musical-mirrors`, basada en `fix/10a-tap-delete-echo`. Un punto dorado emite luz: orienta tres espejos para dirigirla al receptor en forma de rombo. Toca un espejo para abrir sus tres controles (0–180°); el contacto no mueve al jugador. La ruta completa revela una figura local y cambia los grados musicales. El origen ofrece una instalación fácil de aprender, a la derecha del inicio, centro (1600,900); los vidrios continúan en (1080,900).

Presencia dispersa por catálogo, posiciones, orientación inicial, rotación del conjunto, figura y voces regionales deterministas. No aparece en mares ni en Vacío. Los demás conjuntos son más difíciles, pero todos tienen una solución. Rayos con un máximo de cuatro rebotes y 800 unidades de recorrido; no producen realimentación sonora. Vidrios y espejos comparten un máximo de una respuesta ambiental por compás, y cada conjunto de espejos responde como máximo cada dos compases. Respetan silencio, capa superficial y claros de escucha. Los pulsos del jugador también activan el emisor.

Hasta 64 instalaciones guardan sus orientaciones y la conexión descubierta. Menú, cambio de capa y salida mantienen la separación de sistemas; panel y vidrios se excluyen entre sí. Escuchar incluye las voces de espejos. Bitácora muestra instalaciones y rutas completadas. Logros: Luz que escucha y Al otro lado del reflejo. No incluye aún espejos unidos a vidrios, puertas ni pistas encadenadas.

Validación: 34 suites de Node, interacción real en móvil/escritorio, ruta conectada, emisión sonora limitada, persistencia, Bitácora, Escuchar y separación de capas. Detalle de variedad actual y cómo repetir la medición en [VARIEDAD.md](VARIEDAD.md).
