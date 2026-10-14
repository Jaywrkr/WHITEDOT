> **Continuación RC5:** tarjetas y libro de hallazgos en `feat/rare-discovery-cards`, hija de la rama RC4 final. [Entrega vigente](HALLAZGOS_RAROS.md). El inventario y evidencia siguientes describen RC2–RC4 y permanecen como historia.

# Expansión rítmica · tres fases amplias

Autorizada por Jay después de la auditoría V1. No publicar ni hacer merge automáticamente: commit/push y Jay revisa. Base pendiente `audit/v1-closure` (797595c), que ya contiene culturas, mascota y cierre. Main observado 8096c8d.

## 1. Percusión en el paisaje · feat/percussion-landscapes · RC2

Ocho familias: piedra de bombo (kick/tom), tronco hueco (conga/tom), raíces de clave (wood/rim), juncos de raspado (guiro/wood), vainas (shaker/wood), concha de timbal (timbale/rim), polvo de palmas (clap/shaker) y charco de toms (tom/conga). El rol siempre es percusión; región/género/variante cambian el instrumento. Ambient y otros estilos tranquilos reducen los timbres brillantes. Son sintetizadores existentes, combinados en objetos/gestos nuevos, no samples descargados ni ocho instrumentos DSP nuevos.

Cruzar = golpe; mover entre juncos/vainas = raspado; rodear concha = acento; quedarse en piedra/tronco/charco = frase de dos golpes al tempo. Salir termina esa frase; ningún registro/fijación es obligatorio. Dos golpes sostenidos y hasta cuatro gestos manuales por compás de tiempo de audio, con curaduría de voces, ganancia espacial y presupuesto ambiental compartido. Quiet pockets no añaden groove sostenido; una interacción deliberada sí puede golpear. Menús, scanner, pestaña oculta, mute y cambio de partida bloquean la emisión. No existe percusión de UI.

Generación `rhythm:placement:v1`: 30% de chunks sin elementos, demás 1–3 agrupados con espacio, sin mar. Caché máxima 64 chunks. Los streams anteriores y coordenadas de favoritos no cambian. Ocho casos nuevos en Laboratorio → Percusión: **62 casos totales**. Scanner explica gesto e instrumento; bitácora lista familias tocadas; dos logros (primera y cuatro familias). Estado `S.rhythmFound` aditivo, compatible con partidas antiguas.

Pruebas: 56 suites Node; flujo móvil nuevo y laboratorio. Render offline en los 52 géneros + ocho casos ambient suave a 44,1 kHz, el artefacto `scripts/percussion-audio-validation.json` de la rama RC2 conserva esos 60; la rama final lo actualiza a 61. Medir señal no equivale a escuchar en un teléfono físico.

## 2. Identidad de publicación · feat/release-identity · RC3

Implementada sobre RC2 (9dbb987). Esquina superior derecha, dos líneas pequeñas sin botones: versión y fecha/hora del deploy en hora local del dispositivo. Permanece visible al ocultarse el HUD musical. Móvil 320/390 px y paisaje 844 px comprobados. Ningún sonido al mostrarse/usar menús.

Regla: **1.0.0-rc.N** para candidatas antes de aceptación, **1.0.0** para primera estable, **1.0.X** correcciones, **1.X.0** ampliaciones compatibles, **2.0.0** cambio mayor incompatible. No incrementar por cada commit; por entrega/probable publicación. `package.json`, HTML y `src/release-info.js` coherentes, auditados. El host conserva una release completa en la caché PWA; no mezcla metadata nueva con código viejo.

El repo aún no tiene host/pipeline de deploy confirmado. `deployedAt:null` muestra **deploy sin registrar**; nunca hora de commit ni fecha inventada. El futuro host aporta sello UTC real y revisión publicada al artefacto:

```bash
node scripts/stamp-deploy.mjs --dir /ruta/artefacto --deployed-at FECHA_ISO_UTC_REAL --revision SHA_PUBLICADO
```

Valores ilustrativos se omiten a propósito. La herramienta valida antes de escribir `src/release-info.js` y una clave de caché específica por timestamp/revisión; no hace el deploy ni verifica la plataforma. Integrarla en el proceso del host junto a la activación de la publicación y comprobar el dato servido. No usar en el checkout como sustituto de publicar. Sin pipeline no se puede certificar hora de último deploy. Los sellos sintéticos en tests son fixtures, no datos de esta entrega.

Pruebas: normalización/timestamps inválidos, sello en artefacto temporal, UI móvil y update real A→B de SW esperando aprobación y offline. Se corrige el test SW que dependía de un nombre fijo de RC1; ahora sigue la versión del repo.

## 3. Minimalismo y búsqueda · feat/minimal-discoveries · RC4

Implementada sobre `feat/release-identity` (67aef5f). La rama final contiene las anteriores y toda la auditoría/cultura/mascota pendiente.

### Aspecto

Vidrios: tres hojas de luz curvas, una línea interior, sin rectángulos rellenos ni siete franjas por pane. Conservan radios/ángulos de las asas y las voces graves/medias/groove originales. Espejos: un punto viajero por segmento, luz de llegada local y líneas más finas; números solo junto al cubo. Prisma: rayos finos en lugar de abanico relleno, receptores y halos más pequeños. Hitos: torre como filamento, árbol de tres ramas, ciudad de ocho marcas, monolito fino y faro de alcance visual local; el punto de llegada/música/posiciones se conserva. Halo decorativo limitado al 18% del lado corto y máximo 72 px de radio; esto no certifica automáticamente que toda la escena esté bajo un porcentaje de pantalla. Sonar, lluvia y otras respuestas siguen siendo efectos del mundo.

Atlas real actualizado: **139 vistas numeradas**, con las nueve percusiones y rediseños en [la imagen](docs/images/atlas-visual.png). No imágenes generadas sustituyendo la geometría nativa. Los gestos de materia/vidrios/espejos pasan sus recorridos existentes.

### Colección

**Elementos N/81** debajo de versión/deploy, sin botón nuevo ni sonido. Cuenta familias, no cada copia ni canciones: paisaje/flora, juguetes, fenómenos, percusión, ecología, encuentros, instalaciones, vida, culturas y hallazgos. Bitácora → Elementos muestra lo encontrado y cuánto falta, sin revelar todos los secretos. Dos logros, a 10 y 30 familias. Formas individuales conservan el catálogo antiguo; no se multiplican usando `catN`.

`S.elementBook={version:1,found:{id:{day,genre}}}` se normaliza contra 81 IDs vigentes, con strings acotados; duplicados no aumentan. Cambiar/resetear partida reemplaza libro y contador; previews/semillas siguen aislados. Migración solo de evidencia explícita: familias de percusión, ecología, encuentros, instalaciones guardadas, vida, recuerdos culturales, cajas, mascota, reliquias/hitos. Un hallazgo sin prueba histórica se registra al volver a interactuar, no se inventa.

Solo contactos/gestos del jugador, visitas/hallazgos o búsquedas completadas registran familias; audio ambiental/eco no cuenta. No hay sonidos de UI añadidos. Se corrige además el fenómeno antiguo que repetía contactos sostenidos y podía responder sobre un menú: entrada y pulso únicos, pausa por scanner/menú/ocultación y presupuesto ambiental compartido.

### Sorpresa y música

**Fósil de ritmo**: espiral pequeña y voz seca de madera/tom. Stream `rhythm:fossil:v1` independiente, únicamente en un chunk que no tenía percusión ordinaria, probabilidad 1/192 condicionada al 30% vacío (aprox. 1/640 chunks de tierra en promedio). No garantizado por una ruta ni por cada 640 chunks. Escaso, no aparece en el mar. Se despierta tocándolo; permanecer cambia una respuesta de dos golpes lentamente cada cuatro compases. Logro oculto y mensaje único al descubrir su familia. Laboratorio → Percusión lo fuerza únicamente en preview, **63 casos**.

El golden hash de 1.600 chunks comprueba que posiciones/clases de la percusión RC2 ordinaria no se alteran al agregar el fósil. Para todos los elementos rítmicos: emisores de hasta cuatro gestos manuales y dos golpes sostenidos por compás **real** del secuenciador, no por tiempo de pared/commit. El golpe de piedra transforma el bajo del arreglo; los demás aportan al groove. Se respeta el presupuesto común de instalaciones y la llamada de guardianes; no añade melodías agudas como sustituto de percusión.

### Variedad medible y límite

[Auditoría de percusión](scripts/percussion-world-validation.json): **12.000 chunks / tres semillas Vasto**, 9.721 elementos, 9 fósiles naturales, nueve instrumentos percutidos, los 52 géneros representados y **4.810 recetas discretas de percusión** distintas (sin coordenadas/IDs/semilla en la firma). 7.097 chunks vacíos incluyen mar. Otra muestra del laboratorio, distinta, encontró 22 fósiles en 10.000 chunks de tierra; no confundir denominadores.

No son 4.810 mundos ni canciones perceptiblemente únicas. Se mantienen 11 biomas, 33 hábitats, 52 estilos, terreno Original/Vivo/Vasto y códigos de coordenadas WD1. Esta entrega amplía combinaciones de objetos, timbre, gesto, patrón y evolución; **no declara millones nuevos de mundos distintos a oído**. Para seguir creciendo conviene crear varios motores percutivos con diferencias espectrales/temporales, curarlos por género y luego más ecosistemas/eventos con streams versionados. Ampliar etiquetas sin esas diferencias no aporta infinidad real.

### Verificación y aceptación

**58/58 suites Node, 42/42 recorridos de navegador + offline y 225 renders reales de audio** (164 del proyecto + 61 nuevos de percusión). Pico máximo global **0,95759**, nuevo lote rítmico **0,94354**, ninguna muestra >0,98. Los 52 estilos están cubiertos; 44,1/48 kHz, normal/suave y escenas densas. Integridad: 102 módulos, 228 IDs HTML, 232 imports, 113 assets de shell, sin faltantes. Muestreo de 12.000 regiones Vasto: 12.000 firmas detalladas y 7.536 firmas musicales terrestres; no se cuentan como canciones únicas. [Registro consolidado](scripts/expansion-validation.json) · [universo](scripts/expansion-universe-validation.json) · [audio rítmico](scripts/percussion-audio-validation.json). Después del presupuesto final se repiten los recorridos afectados de percusión/descubrimientos; no se repite toda la suite sin necesidad.

Pendientes reales: teléfono físico (auriculares/altavoz, fatiga, controles, FPS/batería), primera sesión humana, host HTTPS, sello del deploy servido y CI remoto del PR. Las medidas de salida detectan saturación/valores inválidos, no certifican gusto artístico ni master profesional percibido. No se publica ni hace merge desde aquí.

## Probar la rama final en cinco minutos

1. Menú → Prototipo → Laboratorio → Notas → Percusión. Elige Piedra, toca con el cubo, permanece y sal; compara Solo y mezcla. Prueba juncos/vainas moviéndote y concha rodeándola. El fósil del laboratorio es una muestra forzada, no hace común su aparición natural.
2. Regresa a tu partida con Salir del laboratorio. Toca una familia nueva y mira Elementos arriba a la derecha; tocarla otra vez no suma. Bitácora → Elementos conserva el nombre y primer género registrado.
3. Busca un hallazgo natural y usa Favoritos/código WD1 si quieres volver al punto. Favoritos conserva semilla, layout, versiones, capa y coordenadas; el contador de familias no sustituye ese sistema de regreso.
4. Revisa vidrios, prisma y espejos: los mismos gestos, menos relleno/halo. Menú, scanner y mute no deben causar nuevos golpes. La música de fondo puede seguir; no confundas una cola de reverb de un gesto anterior con un sonido de UI.
5. Verifica v1.0.0-rc.4. «Deploy sin registrar» es esperado en estas ramas: subir a Git no publica ni acredita la fecha del host. La aceptación siguiente sigue siendo en tu teléfono real y después el pipeline de publicación.

## Siguiente orden recomendado después de probar RC4

Estos son candidatos, todavía **sin implementar**: (1) aceptación/ajustes de esta versión y publicación con sello real; (2) lote pequeño de nuevos motores de percusión con diferencias de cuerpo, ataque y textura, escuchados antes de añadir etiquetas de estilos; (3) búsquedas que combinan percusión, color y guardianes sin subir densidad; (4) ecosistemas/eventos temporales con reglas de descanso y relaciones entre criaturas; (5) infraestructura de usuario/progreso/dueto según [PLAN_V2.md](PLAN_V2.md). Mantener una rama amplia por bloque y datos independientes para no mover mundos anteriores.

## Orden de integración

| Orden | Rama | Base | Versión |
|---:|---|---|---|
| 0 | `audit/v1-closure` | mascota/cultura | RC1 |
| 1 | `feat/percussion-landscapes` | 797595c | RC2 |
| 2 | `feat/release-identity` | 9dbb987 | RC3 |
| 3 | `feat/minimal-discoveries` | 67aef5f | RC4 |

`audit/v1-closure` → fase 1 → fase 2 → fase 3. Cada hija contiene toda la anterior. Puedes probar cada fase y hacer merge normal en orden, o usar **un PR de la última hacia main** para incluir todo. No reintroducir ramas ya contenidas. Squash/rebase o cambios paralelos en main pueden requerir reajuste; no se promete cero conflictos ante modificaciones externas.
