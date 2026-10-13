Warning: truncated output (original token count: 26952)
Total output lines: 733

# Continuar WHITEDOT · base consolidada

Base vigente: `main` · `f7bcf84`, PR #70 integrado el 13 de octubre de 2026. Fases 1 y 2 y revisión visual/musical integradas. Verificaciones de lógica, auditorías, navegador y audio aprobadas en GitHub Actions; despliegue del merge aprobado por Vercel. Iniciar el siguiente bloque desde `origin/main`, sin reaplicar ramas históricas. [Estado de integración](RAMAS.md). [Entrega y pruebas](REVISION_REGISTROS.md). [Imagen numerada](docs/images/atlas-visual.png).

Se revisaron los registros de los 52 estilos, sus paletas y frases de descanso. La política vive en `src/musical-character.js`, fuera del generador: no añadir estilos a GEN globalmente sin revisar compatibilidad de mundos. La música en Original y vivo cambia deliberadamente; sus posiciones/guardados no. El nuevo SW incluye ese módulo. No rediseñar figuras antes de recibir las elecciones de Jay sobre la lámina. La fase 3 mayor y las fases 4–10 permanecen pendientes; el balance previo ya está integrado. El PR #57 fue sustituido: su recorrido creativo existe en main y no debe recuperarse mediante cherry-pick.

<details><summary>Entrega de fase 2 e historial anterior (ya integrado)</summary>

# Continuar WHITEDOT · Fase 2

Rama actual: `feat/phase-02-living-world-recipes`. Comenzó desde fase 1 `7bed0ca`; actualizada al cierre sobre main `e26ef93`, después de que Jay integrara fase 1 mediante PR #68. Crear el PR de fase 2 hacia main. Una rama amplia por fase; el asistente prepara, prueba, hace commit/push; Jay crea PR/merge.

## Entrega actual

[FASE_02.md](FASE_02.md) documenta todo el bloque. Acceso: **Menú → Explorar mundos → Paisajes vivos**, Amplio, presets Humedal/Salinas/Basalto/Micelio. El selector anterior en Prototipo también funciona. El generador original permanece disponible; claves y coordenadas antiguas conservadas.

- 33 perfiles de hábitat sobre los 11 biomas; campos de humedad/temperatura/elevación/fertilidad, terreno visual pequeño, flora/fauna/materiales/densidad regionales y eventos diarios acordes al clima.
- Amplio vivo: REG 12 × WCH 900 = 10.800 unidades; Amplio original: REG 8 = 7.200; Clásico de ambos: REG 4 = 3.600. La generación nueva usa identidad `{generatorVersion:2,catalogVersion:2,layoutVersion:2}` y claves de prueba `v2:`.
- Seis familias (`ecology:reed/pod/lichen/stone/filament/coral`) aplican contratos reales: compatibilidad, presencia regional/local, papel, material y variante. Máximo cuatro por chunk; centro de prueba garantiza uno compatible. Modelos/gestos son temporales y no exportan audio.
- Tocar/contacto/pulso responde a tempo; arrastrar cambia carga y variante, sin mover al jugador; permanencia cultiva una parte durante 6–14 segundos según familia. Vaina vuela/regresa, otras figuras tienen siluetas/movimientos distintos. Menú, mute, Escuchar, ocultación y cambio de capa pausan o cancelan; cancelación restaura el gesto.
- Funciones graves/medias/percusivas con instrumentos actuales; conducción de partes existentes. Arquitecturas de frase afectan progresión, rotación, acentos, duración y número de notas. Radio/quietud anteriores permanecen; margen de salida vivo .96 frente al .98 original (aproximadamente −0,18 dB adicionales).
- Biomas vecinos por clima/bloques; estilo comparte contexto en bloques de dos regiones y tonalidad/tempo continental. Pesos musicales v2 separados por semilla y caché máxima ocho entradas; los límites de caché de fase 1 permanecen.
- Bitácora registra hábitats/familias; logros Materia que escucha, Un lugar contigo y Cuatro maneras de tocar. Registry de logros mantiene referencias mutables para que los módulos registren sus logros posteriores; los tres nuevos no aparecen en Original.
- Dos módulos nuevos en SW; runner de audio añade `ecology_mix.py`; CI audita Original y vivo. 52 estilos y 35 identificadores de instrumentos en paletas conservados; no agregar a sus conteos las seis familias de objetos.

## Auditoría reproducible

[40.000 candidatos vivos](scripts/phase-02-universe-sample.json): 39.998 firmas detalladas y 24.371 firmas musicales terrestres; aparecieron los 33 perfiles y los 52 estilos. Vecinos terrestres con igual bioma: 57,2 % frente al 9,7 % [original](scripts/phase-02-original-sample.json); igual género: 34,0 % frente al 14,8 %.

[Un millón de candidatos](scripts/phase-02-million-sample.json): **999.512 firmas detalladas** y **586.200 firmas musicales terrestres** entre cuatro semillas. Los caches de terreno permanecen dentro de 128/256 entradas. El auditor acumula sets de firmas proporcionalmente a la muestra; no confundir esa memoria de investigación con la residencia del juego.

Son recetas/fingerprints discretos, no mundos completos ni canciones terminadas ni diferencias perceptuales garantizadas. La firma viva incorpora ecología y arquitectura; la muestra grande tiene otra ventana, no se compara directamente con la de 40.000. La medición antigua del Original sigue siendo exactamente 39.952 recetas detalladas / 9.732 perfiles musicales terrestres en 40.000 regiones. Captura dorada de fase 1 comprueba también posiciones reales de chunks; no usar la implementación nueva como su propia referencia.

## Verificación de cierre

Pasaron **49 suites Node**, **32 recorridos Chromium** y offline con **79 módulos**. Los gestos finales se revalidaron en 390×844, 844×390 y 1280×800, incluyendo arrastre/cancelación, cultivo, pausa/mute, Bitácora, favoritos y respaldo aislado entre Original/vivo. Se verificaron los 33 hábitats en 1.200 regiones y el regreso determinista después de expulsión de caché.

Audio: **12 renders vivos** densos en minimal/tropical/dub/amapiano/nu-disco/ambient, normal/suave a 44,1/48 kHz; pico máximo **0.941087**, sin muestras por encima de 0,98. Otros **6 renders del Original** conservan sus voces de vidrios; pico máximo **0.940234**. [Resumen medido](scripts/phase-02-validation.json). Estos renders no certifican preferencia artística ni master profesional.

Comandos en [FASE_02.md](FASE_02.md). Dispositivos reales, escucha curada larga y ejecución remota de CI siguen pendientes.

## Siguiente fase

[Fase 3](FASES_UNIVERSO.md): más instrumentos/síntesis, estilos con identidades audibles, secuencias moduladas y escucha curada prolongada. Solo fase 2 está autorizada en este turno; no continuar automáticamente a la 3. Antes de agregar géneros o cambiar síntesis, conservar catálogos/modelos correspondientes a v1/v2 y verificar capturas doradas: ampliar GEN globalmente puede redistribuir géneros antiguos. No reintroducir escenas guardables; mantener UI silenciosa, fondo negro, punto blanco y elementos pequeños. Migrar voluntariamente el habitual a un mundo vivo requiere un bloque explícito de compatibilidad/actualización, sin mover favoritos silenciosamente.

<details><summary>Handoff de fase 1 e historial anterior</summary>

# Continuar WHITEDOT · Fase 1

Rama actual: `feat/phase-01-universe-foundation`. Base: main remoto `7a0e8ff` (PR #67). Una sola rama con código, pruebas y documentación; Jay crea PR y hace merge, el asistente no crea PR ni hace push directo a main.

## Qué quedó preparado

- Identidad `{seed, layout, generatorVersion, catalogVersion, layoutVersion}` y dirección de favorito con capa/x/y. Migración de favoritos antiguos y bloqueo de rutas/versiones ajenas, también tras varias recargas.
- `save-store.js`: migración del JSON local existente, validación de estructuras/tamaño UTF-8, avisos de cuota/lectura, copia previa a sobrescritura/restauración, recuperación explícita con original protegido.
- `save-tools.js`: Menú → Progreso y respaldo; descarga JSON, selección/validación y confirmación separada. No añade controles al HUD ni sonidos de UI. Semilla/layout y partida habitual aislados.
- `BoundedMap`: límites de 128/256 entradas para regiones/biomas/chunks/continentes, estadísticas y regeneración determinista. Estados temporales no se vuelven persistentes por estar en caché.
- `contentDirectory`: 24 contratos versionados y API de expansión con flujos aleatorios independientes. Generadores existentes conservados para no redistribuir lugares actuales; el registro no dibuja contenido automáticamente.
- Runners para todas las suites Node, navegador/offline y cinco programas de audio; Playwright fijado en `requirements-dev.txt`; CI de PR/main y auditoría multisemilla.

## Cómo seguir

Leer [FASE_01.md](FASE_01.md), [FASES_UNIVERSO.md](FASES_UNIVERSO.md) y [V1_PRODUCCION.md](V1_PRODUCCION.md). Solo fase 1 autorizada en esta entrega. La siguiente reúne muchas variables de mundo y reglas de convivencia, preservando la versión actual o migrando explícitamente los lugares. No ampliar arrays de géneros/biomas sin verificar qué mapas y favoritos cambia.

No reintroducir escenas/ideas musicales guardables: Jay las descartó. Relación entre gráfica, música y mundo; fondo negro, punto blanco, colores locales, electrónica/naturaleza y UI silenciosa. Culturas/reliquias históricas, más instrumentos y gestos, construcción y multijugador siguen pendientes; [las diez fases](FASES_UNIVERSO.md) conservan esas ideas.

## Validación de cierre

Pasaron 48 suites Node, los 31 recorridos Chromium y offline con 77 módulos. Revisión final de respaldos en 390×844, 844×390 y 1280×800: descarga/importación, cuota, original corrupto/futuro protegido y favorito futuro sin ruta; favoritos/autopilot también revalidados en móvil/escritorio. Se comprobó el regreso determinista tras expulsión de regiones y chunks reales del Camino/Mundo.

Los cinco programas de audio completaron **113 renders**, incluidos los 52 estilos y las interacciones. Pico máximo **0,954512**, sin muestras por encima de 0,98. Medidas resumidas en [scripts/phase-01-validation.json](scripts/phase-01-validation.json); no certifican calidad artística de master.

Auditoría multisemilla: 40.000 candidatos, 39.880 firmas detalladas y 24.350 firmas musicales terrestres. Auditoría antigua del original sin cambios: 39.952 recetas detalladas y 9.732 perfiles musicales terrestres. Las firmas y ventanas son distintas: no compararlas como aumento de diversidad. Comandos en [FASE_01.md](FASE_01.md).

Pendientes: dispositivos reales Safari/iPhone/Android/PWA, escucha curada larga, ejecución remota de CI al abrir el PR, rollback de publicación y compatibilidad de futuras versiones del generador. La rama permite probar fase 1; no declara lista toda la V1.

<details><summary>Handoff histórico de entregas anteriores</summary>

## Nueva etapa: animal de respuesta más intuitivo

Rama `feat/intuitive-animal-dialogue`, basada en `feat/expressive-glass-gestures`. Sustituye el gesto oculto de mantener para enseñar por un toque sencillo: tocar el cuerpo inicia la escucha; tocar objetos o el vacío le enseña una frase; volver a tocarlo pide la respuesta. También contesta automáticamente tras una pausa de al menos 1,2 segundos u ocho semicorcheas, o al alcanzar dos compases. El tiempo de la frase comienza con la primera nota, no al activar la escucha. Espera hasta 20 segundos por esa primera nota; si no llega, muestra cómo reintentar. Tocar otra vez sin notas termina la escucha vacía.

Mantener el cuerpo cambia su voz y muestra brevemente Bajo/Groove/Motivo/Espacio; no borra una lección en curso. Arrastrar conserva el acercamiento. Orejas abiertas y cuatro puntos confirman las notas recibidas; textos locales distinguen escucha, espera, respuesta sonora real y frase aprendida. “Mi turno” se muestra durante el intervalo programado de audio, evitando anunciar una respuesta antes de que suene. Las pistas locales se ajustan a los bordes de la pantalla.

No escucha micrófono, ambiente ni grabaciones: solo sonidos causados por el jugador en esa región. Mantiene afinación regional, máximo de cuatro notas aprendidas, turnos espaciados, volumen compartido y pausa por menú/ocultación. El aprendizaje es temporal; el logro y la Bitácora conservan descubrimientos. El nombre visible pasa a **Animal de respuesta**.

Probar: Prototipo → Semillas → Encuentro de prueba → **Animal de respuesta**. Un toque al animal, unos toques al mundo y otro toque al animal; o dejar de tocar para recibir la respuesta automática.

Validación: 46 suites Node; gestos reales en móvil vertical, horizontal y escritorio; diez familias de encuentros; recarga offline con 72 módulos. Catorce renderizados reales de redes, suelos y respuestas aprendidas mantienen el pico en 0,954511, sin muestras por encima de 0,98. Se conserva la música anterior; el cambio central es cómo se enseña y cómo se muestran los turnos.

## Nueva etapa: vidrios sin panel y con música de cuerpo

Rama `feat/expressive-glass-gestures`, basada en `feat/chained-musical-trails`. Elimina completamente el panel de ángulos y sus controles: los vidrios se giran mediante sus aros en el mundo. Los tres aros tienen radios distintos para poder seleccionarlos incluso cuando las placas están alineadas. Cancelar, perder captura o cambiar de pestaña restaura los ángulos del arrastre; salir o pausar cancela el gesto. Se conservan guardados y descubrimientos anteriores.

Cada región asigna los tres vidrios a bajo, percusión y armonía/melodía media. Usa instrumentos del género local, evita la voz aguda y limita las voces con altura a los registros graves y medios. Los giros emplean grados de acorde (0, 2, 4), controlan variantes y fuerza de la parte existente, y sus notas se sincronizan con el pulso. Se reducen los niveles de respuesta respecto a la versión anterior. El movimiento cambia las curvas internas y sus cruces producen una resonancia pequeña de color; no añade efectos que cubran el mundo.

Probar: Prototipo → Semillas → Encuentro de prueba → **Vidrios · movimiento y música**. Entrada directa a los vidrios iniciales en una prueba separada. Pistas y Bitácora actualizadas, sin nuevos botones de exploración. Las conexiones con jardines modulares conservan los ángulos como fuente regional.

Validación: 46 suites Node y 30 recorridos de navegador, incluyendo las tres funciones musicales con instrumentos nativos en los 52 estilos; giros reales, alineación sin sliders, cancelación, influencia, escáner y persistencia en móvil/escritorio. Caché offline con 72 módulos. Seis renderizados reales verifican emisión de las tres funciones musicales en minimal, tropical, dub, amapiano, nu-disco suave y ambient a 44,1 kHz: pico máximo 0,940233, sin muestras por encima de 0,98. Las mediciones técnicas acompañan la escucha artística; no certifican un máster comercial.

## Nueva etapa: rastros musicales encadenados

Rama `feat/chained-musical-trails`, basada en `feat/resonant-ground`. Añade una búsqueda opcional de tres huellas sobre el suelo: permanecer quieto dos segundos con música activa en la primera; seguir sus puntos locales y responder a tres golpes en la segunda; mantener la última huella 650 ms para despertar un instrumento. La semilla elige entre cuatro figuras rítmicas de tres golpes; el primer toque captura el tempo local y hay margen para reintentar. Las etapas futuras permanecen ocultas; no se pueden saltar ni resolver con toques rápidos indiscriminados.

Un candidato por región terrestre, con probabilidad de generación de 1/16; posiciones y papel musical dependen de la semilla. En la prueba de 1.600 regiones aparecieron 71 rastros, pues el mar también se excluye. La rareza no garantiza que cada región contenga uno. Su sonido usa instrumentos y afinación de la región, alternando papeles de bajo, groove y motivo. Una pista puede emitir tres notas contenidas cada cuatro compases, compartiendo presupuesto con las otras instalaciones. El instrumento despierto responde a toques, sin sumar una capa ambiental continua ni un sonido de interfaz.

El dibujo usa pequeñas curvas, tres marcas de respuesta y puntos de orientación locales; sin panel ni flecha global. Las etapas se guardan hasta en 64 rastros por partida. Alejarse, silenciar, pausar o cambiar de pestaña limpia la respuesta rítmica parcial; no borra etapas completadas. Bitácora y logro **Algo estaba dormido** muestran el descubrimiento. Las pruebas vuelven a la etapa pendiente o al instrumento ya despierto.

Probar: Prototipo → Semillas → Encuentro de prueba → **Rastro musical · instrumento dormido**. No necesita encontrar primero un rastro raro; la partida habitual permanece separada. Culturas, reliquias históricas, puertas musicales y personajes originales siguen pendientes: esta entrega implementa una primera búsqueda y un instrumento dormido, sin dar por cerrado ese bloque.

Verificación: 45 suites Node; 30 recorridos de regresión de navegador; búsqueda completa mediante gestos reales en móvil vertical, horizontal y escritorio, incluyendo música apagada, orden, reintentos, cancelación, guardado y Bitácora. Recarga offline con 71 módulos. Seis renderizados reales de pistas junto a música regional densa en minimal, tropical, dub, amapiano, nu-disco suave y ambient: pico máximo 0,934887, ninguna muestra por encima de 0,98. La evaluación artística también requiere escucha humana.

## Nueva etapa: suelo resonante en lugar de cajas

Rama `feat/resonant-ground`, basada en `feat/shared-installation-signals`. La Caja de posibilidades se elimina como objeto visible y pasa a ser una huella del terreno: tocarla o permanecer quieto cerca despierta sus raíces musicales. Se conservan los gestos de edición de Bajo, Groove y Motivo. El arco inferior permite dejarla reposar; ese reposo se respeta mientras permanezcas cerca, y el terreno vuelve a estar disponible al salir y regresar. Alejarse más de 180 unidades lo deja reposar automáticamente.

Sin caja, tapa ni contenedor; en reposo solo quedan pequeñas curvas sobre el piso. Las formas activas siguen siendo locales y transparentes. El suelo en reposo deja de modificar el arreglo o producir respuestas; la influencia anterior se disipa con el mecanismo existente. Pistas, selector de pruebas, Bitácora y nombre del logro se actualizan. Se conserva la clave interna `box` y el identificador `cajaEditable` para compatibilidad de descubrimientos, sin presentarlos como cajas en el juego.

Probar: Prototipo → Semillas → Encuentro de prueba → **Suelo resonante**. Gestos probados en 390×844, 844×390 y 1280×800, incluyendo despertar por permanencia, respetar reposo, alejarse y volver, edición, cancelación, logros y respuestas de animales. 44 suites Node y regresión de las diez familias.

## Nueva etapa: instalaciones que comparten una señal

Rama `feat/shared-installation-signals`, basada en `feat/organic-musical-seedpods`. El jardín modular conserva sus cables y suma tres fuentes de control: reloj, vidrios descubiertos o espejos descubiertos en su misma región. Mantener el aro del núcleo durante medio segundo cambia la fuente; arrastrar a una raíz o tocar núcleo y raíz conecta, y tocar una raíz conectada retira el cable. Los ángulos de vidrio cambian variante, fuerza y cadencia; las rutas reales de espejo distinguen reflejos parciales y conexión completa. Sin fuente descubierta o sin reflejos válidos, espera. Los datos de fuente se guardan con los cables; guardados antiguos usan reloj.

Se transforma el arreglo existente mediante influencia regional, sin sumar osciladores ni crear realimentación de audio. El reloj conserva el comportamiento anterior. Núcleos y hojas reemplazan los rectángulos dibujados; controles de detalle siguen disponibles al tocar sus cuerpos. Pistas, Bitácora y logro **Una misma instalación** reflejan la conexión efectiva. Esto no es aún cableado libre entre cualquier objeto ni una simulación eléctrica completa.

Para probar: Menú → Prototipo → Semillas → Encuentro de prueba → **Instalaciones conectadas · jardín modular**. La prueba coloca al jugador en el jardín inicial (2050, 900), en una partida separada. En esa región, los vidrios están en (1080, 900) y los espejos en (1600, 900): explorarlos y orientarlos antes de volver al módulo. Otras regiones conservan su distribución y rareza; no todas tienen los tres elementos.

Validación: 44 suites Node; conexiones por toque/arrastre, cancelación, selección por permanencia, ángulos reales, influencia, logro y persistencia en móvil y escritorio. Diez renderizados del secuenciador real con módulos conducidos por vidrios/espejos, minimal, tropical, dub, amapiano, nu-disco suave y ambient a 44,1 kHz: pico máximo 0,954510, sin muestras por encima de 0,98. Recarga offline con 69 módulos. Estas mediciones no sustituyen la escucha artística en equipos reales.

## Nueva etapa: vainas musicales orgánicas

Rama `feat/organic-musical-seedpods`, encadenada después de `feat/deep-musical-encounters` y `docs/organic-interaction-direction`. Sustituye el panel de teclas por una vaina con 16 semillas y tres núcleos musicales. Tocar una semilla cambia su paso; tocar un núcleo elige Bajo, Groove o Motivo; arrastrarlo a otro intercambia posiciones y mantenerlo silencia esa parte. El brote inferior cierra la vaina. Conserva los patrones, límites de densidad, afinación y volumen anteriores; no añade un sonido de interfaz.

Probar en Menú → Prototipo → Semillas → Encuentro de prueba → Caja de posibilidades. Su envolvente visual ocupa aproximadamente el 11 % de las pantallas de prueba de 390×844 y 844×390; las líneas dejan ver el mundo detrás. Se verificaron gestos, cancelación, cierre/reapertura y logros en móvil vertical, horizontal y escritorio, las diez familias de encuentros y recarga sin conexión de los 68 módulos. Actualiza las pistas y la descripción de Bitácora; mantiene el logro existente. Culturas y reliquias históricas específicas siguen pendientes.

## Nueva etapa: interacciones profundas

Rama `feat/deep-musical-encounters`, basada en main `2959313`. Tejedoras conectan objetos, animales escuchan frases del jugador y cajas permiten editar pasos y piezas. Cómo probar y próximos bloques: [PROXIMOS_PASOS.md](PROXIMOS_PASOS.md). Las cinco fases anteriores ya están integradas; el resto del texto conserva su contexto histórico.

## Cinco fases anteriores: ya integradas

Orden de integración y pruebas: [FASES.md](FASES.md). Esta rama contiene las fases 1–5; base `main` actualizado `63706eb`. Jay crea PR y merge en orden mediante merge normal.

# HANDOFF · WHITEDOT / Pixel Blanco

> Documento de traspaso para continuar el desarrollo con otra IA (ChatGPT, Claude, etc.) o con otro dev.
> Contexto: HANDOFF, CAMBIOS, PENDIENTES, REVISION y [RAMAS.md](RAMAS.md). Actualizado con espejos y el pedido posterior de música, fijación voluntaria, módulos e interfaz (ver RAMAS.md). Base remota revisada `5413d5f`; esta copia contiene la cadena hasta `feat/15-spacious-blob-worlds`. Implementado y subido no implica integrado en main: Jay hace PR/merge en orden.

- **Juego en vivo:** https://whitedot-inky.vercel.app
- **Repo:** https://github.com/Jaywrkr/WHITEDOT (rama `main`). Cada push a `main` despliega solo en Vercel.
- **Documento de diseño (más largo, visión completa):** https://claude.ai/code/artifact/034e1ffb-4be3-4044-9a25-47da3d713190
- **Código:** HTML en `index.html`, estilos en `styles/game.css` y módulos JavaScript nativos en `src/`. No hay build.

---

## 1. Cómo trabajar con Jay (léelo primero)

- Llámalo **Jay**. Sé directo y práctico, sin halagos. Él prueba en el **móvil**, así que todo tiene que funcionar con el dedo.
- Él da feedback por sensación ("suena robótico", "no siento que cambia"). Tradúcelo a cambios concretos y hazlos. No le devuelvas preguntas técnicas.
- Responde en **español**. Todo el texto del juego está en español.
- Cuando dice "hazlo", quiere el cambio implementado y probado dentro de la etapa acordada, con commit y push en una rama nueva desde `main` actualizado. **Jay crea el PR y hace el merge.** No hacer push directo a `main`, crear PRs ni hacer merges. El despliegue de producción ocurre después de su merge.
- La autorización habitual es por etapa. En esta sesión Jay autorizó explícitamente las primeras diez fases en ramas encadenadas; ver RAMAS.md. Las fases 11–31 no están autorizadas.

## 2. Visión

Un pixel blanco en un mundo negro que va creciendo. **El centro de todo es la MÚSICA**: electrónica que va del ambient al minimal tech house (afro house, minimal house, rominimal, dub techno, deep…).

- **Camino diario:** corto. Construye constancia y racha, y el crecimiento tiene tope por día. Su música es casi ambient. No debe convertirse en grind.
- **Mundo:** se abre después del camino. Es infinito y procedural, y todo genera música. Ahí está la diversión de verdad.
- **Descubrimientos excepcionales:** Jay quiere encontrar cosas mágicas muy rara vez, con identidad propia y difíciles de conseguir. Las reliquias actuales le resultan demasiado fáciles. Primera implementación: sitios fijos raros y constelaciones dormidas; ver `src/relics.js`.
- **Inspiraciones:**
  - Logros absurdos y ocultos estilo *Dungeon Crawler Carl*.
  - Una "Voz del sistema" sarcástica estilo Carl pero también con el humor de Jay.
  - Descubrimiento ordenado estilo *No Man's Sky* / *Astroneer*.
  - Capas musicales estilo *Incredibox*.
  - Infinitud estilo *Minecraft*.
- **Aprender música jugando:** cada región muestra su género, escala e instrumentos.
- **Compartir en redes** (@jaywrkr): tarjetas de constancia y descubrimientos.
- **Estudio portátil:** "lo construyes y lo llevas". Es secuenciador, refugio y checkpoint, y se decora con colores que desbloqueas con logros.
- **Multiplayer o visitas:** más adelante, no ahora.

## 3. Decisiones tomadas (no revertir sin hablar con Jay)

| Tema | Decisión |
|---|---|
| Motor | **Web** (HTML5 + Canvas + Web Audio). Se descartó Godot porque las consolas no son viables y web llega a iOS, Android y PC. Para tiendas, más adelante: Capacitor (móvil) y Tauri (desktop). |
| Laberintos | **Eliminados.** No le gustaron. |
| Slider de estilo musical | **Eliminado.** La intensidad y el género los decide el lugar, no un control. |
| Drone constante | **Prohibido.** No debe quedar nada sonando todo el tiempo. El pad "respira": solo crece después de un cambio de acorde y se apaga solo. |
| Sincronía | Todo lo que toca el jugador se cuantiza al beat (8vos o 16vos), con un poco de jitter para que suene humano y no 100% estricto. |
| Biomas | Cada región tiene un **género real distinto**. Las transiciones son **graduales**, mezcladas en el espacio (como bajar de la sierra a la costa). Las regiones son anchas y tienen mini-biomas adentro. |
| Densidad | Vitalidad continua, mares casi vacíos y oasis densos. FILL es etiqueta regional, no el único control de cantidades. |
| Jardín | Es solo un verbo (sembrar), no el tema del juego. Huertos de ritmo son propuesta futura, junto con otros verbos. |
| UI móvil | Compacta y contextual. Dock con controles del modo; Mundo añadió Eco y FX. Evitar nuevas barras permanentes y solapamientos. |
| Objetos | Tienen autonomía: hacen cosas, no solo suenan. Están en armonía visual y musical con su región. |

## 4. Arquitectura

El juego usa módulos JavaScript nativos (`import`/`export`), servidos por HTTP. `index.html` carga `src/main.js` con `type="module"`. No necesita compilación ni dependencias de aplicación.

`main.js` crea un contexto interno `runtime` e inicializa cada sistema una sola vez en el orden explícito de imports. Cada módulo mantiene sus variables en su propia función `initialize(runtime)`, publica únicamente las referencias usadas por otros sistemas mediante getters y, para estado reasignable, setters. Las referencias a otros sistemas usan `runtime.nombre`; no se expone este contexto en `window`. Los callbacks y eventos empiezan a ejecutarse después de completar la inicialización.

La separación conserva las relaciones originales entre sistemas. Todavía hay acoplamiento mediante el contexto compartido; no son componentes independientes. Antes de cambiar una referencia publicada, revisar sus consumidores. No reinicializar módulos sobre el mismo contexto ni cambiar el orden sin comprobar las dependencias.

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Canvas, HUD, dock, paneles y estructura accesible de la interfaz. |
| `styles/game.css` | Estilos y adaptaciones móviles, en el mismo orden de cascada que antes. |
| `src/main.js` | Contexto compartido, inicialización, normalización de la partida, autosave y arranque del loop. |
| `src/data.js` | Constantes, biomas, géneros, logros, muestras y textos. |
| `src/progress.js` | Guardado v4, días, racha, crecimiento, linterna, RNG y cachés. |
| `src/world.js` | Camino, generación de regiones/chunks, eventos y reliquias. |
| `src/spatial.js` | Presencia por distancia, selección de fuentes cercanas y actualización de voces activas. |
| `src/grammar.js` | Perfiles musicales regionales, ritmo/frase/armonía y atenuación por densidad. |
| `src/references.js` | Familias de referencia y sus patrones de bajo, melodía y percusión. |
| `src/neighborhoods.js` | Campo de tempo/afinación y selección compatible de regiones vecinas. |
| `src/palettes.js` | Paletas tropical, melódica, robótica y disco, asignación regional y patrones. |
| `src/instruments.js` | Nuevos timbres de parciales, FM y filtros, güiro y timbal electrónicos. |
| `src/audio.js` | Web Audio, scheduler, armonía, síntesis, géneros, tracks y ruteo de mezcla. |
| `src/mix.js` (fase 1) | Protección de salida lineal a nivel normal y filtros de retornos de efectos. |
| `src/session.js` | Resumen de exploración y actividad, conservación de la última sesión y tarjeta PNG. |
| `src/effects.js` | Procesamiento local por voz, perfiles regionales y liberación de nodos de audio. |
| `src/relics.js` | Sitios raros estables, resonancia y compatibilidad de reliquias antiguas. |
| `src/pockets.js` | Espacios locales de escucha, ensamble y descubrimiento; distribución estable y pistas discretas. |
| `src/personality.js` | Rasgos estables de movimiento, reacción y respuesta musical por objeto. |
| `src/playthings.js` | Nuevos elementos, generación independiente, reacciones de contacto/pulso y dibujo. |
| `src/scanner.js` | Fuentes musicales cercanas y panel Escuchar durante una pulsación larga o tecla E. |
| `src/journal.js` | Bitácora de lugares, formas, música y logros; compatibilidad de registros v4. |
| `src/gravity.js` | Gravedad estable por región y mezcla de velocidades en bordes y esquinas. |
| `src/voices.js` | Roles, registros e instrumentos de interacción por región; emite sonidos con la síntesis existente. |
| `src/radio.js` | Composición del Mundo por frases y secciones, independiente del movimiento. |
| `src/canvas.js` | Canvas, tamaño, input de movimiento y estado visual temporal. |
| `src/messages.js` | Cola y animación de la Voz del sistema. |
| `src/studio.js` | Muestras, secuenciador radial, bolsa, colores y checkpoint. |
| `src/interactions.js` | Pulsos, colisiones y respuestas sonoras/visuales de objetos y especies. |
| `src/discovery.js` | Descubrimientos, regiones, retos, recolección y recompensas. |
| `src/render.js` | Glifos, loop, dibujo y simulación del Camino y del Mundo. |
| `src/ui.js` | HUD, avisos, logros y entrada/salida del Mundo. |
| `src/sharing.js` | Constelación y tarjetas para compartir. |
| `src/feedback.js` | Señales visuales del rol musical sincronizadas con el inicio del sonido. |
| `src/phenomena.js` | Aves de eco, semilleros de caja y nubes de pulso; generación y reloj audiovisual. |
| `src/patches.js` | Perfiles de material y síntesis procedurales por región/instrumento/rol/objeto (PR #25, integrado). |
| `src/rhythms.js` | Biblioteca ampliada de ritmos por recetas (batería, bajo, frase, instrumentos, escalas, guía) y familias de todos los géneros. |
| …10952 tokens truncated…mo app (PWA) y control táctil

- **Instalable:** `manifest.webmanifest` (pantalla completa, vertical, iconos en `icons/`), `sw.js` (red primero, caché como respaldo sin conexión; cada deploy llega sin quedarse con versiones viejas) y metas de Apple. En el teléfono: Compartir → Añadir a pantalla de inicio (iOS) o Instalar app (Android).
- **Sin gestos del navegador:** `html,body` fijos, `touch-action:none`, `overscroll-behavior:none`, sin zoom (`user-scalable=no`) y `src/pwa.js` bloquea pinza, doble toque y arrastres de página (salvo listas con scroll de los paneles).
- **Control:** joystick flotante. Arrastrar desde cualquier punto de la pantalla mueve al pixel hacia donde mueves el dedo desde donde empezaste; se dibuja un círculo guía. El arrastre también funciona si empieza sobre textos del HUD o la Voz (antes no: por eso "solo iba para arriba"). Un toque en la Voz la sigue abriendo; un toque en el mundo lanza el pulso.
- **Visibilidad:** halo y anillo fino alrededor del pixel en el Mundo; densidad máxima de los oasis reducida a ~2× para no tapar al pixel.
- Prueba: `tests/mobile_smoke.py` (móvil emulado a 3×: sin zoom ni desbordes, arrastre en las cuatro direcciones desde arriba, abajo y centro, manifiesto e iconos).

### Mundo infinito · fase 3: rarezas y ríos

`src/wonders.js`.

**Rarezas que rompen reglas** (`anomalyAt`, semilla `anomaly:v1`, solo en tierra y desde 4 regiones del Origen):

| Nivel | Frecuencia (por región de tierra) | Rarezas |
|---|---|---|
| Raro | 1/250 | **Gravedad invertida** (los controles van al revés), **Región en canon** (eco de un tiempo con mucha realimentación), **Frenesí** (tempo ×1,5) |
| Legendario | 1/1.200 | **El tiempo se detiene** (quieto, el tempo baja a 0,55 y el sonido se oscurece), **Espejo del Origen** (la música del Origen con colores invertidos) |
| Mítico | 1/6.000 | **Luna de oro** (todo dorado, todas las capas abiertas) |

Al entrar, la Voz dice la regla. La primera vez se registra en `S.anomalies`, da 3 unidades de una **muestra única** para el Estudio (reverso, canon, frenesí, tiempo quieto, espejo, luna de oro; solo aparecen en la bolsa cuando las tienes; los retos no las regalan) y logros `rareza1`, `leyenda1` y `mito1` (oculto). El mapa las marca con una estrella del color de su nivel.

**Rumores:** `rumor()` busca la rareza no descubierta más cercana (hasta 45 anillos) y la Voz dice dirección y distancia aproximada ("Dicen que al noreste, a unas 15 regiones, todo lo que tocas te responde en canon"). Salta al llegar a un continente nuevo y cada 15 lugares nuevos, como máximo cada 3 minutos (`S.rumorAt`).

**Ríos** (`riverAt`): curvas de nivel de un campo de ruido (escala 7 regiones), así que son infinitos, continuos y curvos. Miden ~180 px de ancho, ocupan ~0,6 % de la tierra y no entran al mar. Un segundo campo de "altura" define río abajo. El agua se dibuja como trazos que corren río abajo, más brillantes y rápidos donde baja más. En la música, estar en un río sube la energía mínima (más río abajo, más energía) y cada compás caen gotas descendentes a tempo. Primera vez: Voz; un minuto siguiendo el agua: logro `rio1`.

Pendiente de esta fase: confluencias que mezclen géneros, manantiales como hitos de origen, ríos en el mapa y muestras/encuentros raros ligados a fenómenos.

Pruebas: `tests/wonders.mjs` y `tests/wonders_smoke.py`.

### Mundo infinito · fase 4 (parte 1): vida en el tiempo real + volumen

`src/alive.js` y cambios en `wonders.js`.

- **Confluencias:** ahora hay dos familias de ríos (campos de ruido distintos) que se cruzan. En una confluencia la música del otro río (dos regiones río arriba) se mezcla como en una frontera (`MU.confNb`, peso ≥ 0,45), con aviso y logro `confluencia`. Los ríos aparecen en el mapa sobre las regiones visitadas.
- **Tormentas que se mueven:** celdas de 12×12 regiones; en cada ventana de 40 min hay 38 % de probabilidad de tormenta, que vive 80 min, crece y se apaga, y viaja ~2,3 regiones cada 10 min con el viento del día (`windOf`), así que el jugador puede perseguirla. Dependen del reloj real y la semilla, así que son iguales para todos. Dentro: cielo oscuro, cortina de lluvia inclinada, lluvia de notas que se recogen (la misma mecánica que le gusta a Jay, más intensa), sonido más oscuro y truenos. Cerca pero fuera: masa gris en el borde de la pantalla, en su dirección, con relámpagos. Logro `tormenta3`.
- **Estaciones:** cada continente cambia de estación cada semana real, desfasado del resto (`seasonOf`). Primavera +1 BPM y polen; verano +3 BPM y destellos; otoño −1 BPM, hojas y sonido más cálido; invierno −4 BPM, nieve y sonido más oscuro. La estación aparece en la tarjeta del lugar.
- **El mundo te recuerda:** huellas cada 160 px recorridos (`S.steps`, hasta 4.000), dibujadas tenues; al mover el Estudio, el campamento anterior queda como casa apagada (`S.camps`, hasta 30).
- **Volumen (segunda subida, pedida por Jay):** compresor −30 dB 5:1, realce de presencia +3,5 dB a 2,4 kHz (los parlantes del teléfono no dan graves), shelf de agudos en 0, compensación ×6,8 (`LOUD`), limitador a −2 dB y saturación tanh más fuerte. Medido: RMS ~−5,7 dB (antes −9,3; originalmente ~−15,6), picos bajo 0. En iPhone, `navigator.audioSession.type='playback'` hace que suene con el volumen multimedia y aunque esté activo el interruptor de silencio. Escucha suave sigue baja.

Pruebas: `tests/alive.mjs` y `tests/alive_smoke.py`.

Pendiente de la fase 4: capas bajo tierra (1 paso = 8 arriba) y del cielo con ritual de entrada, migraciones con posición por fecha y rastros de otros jugadores.

### Mundo infinito · fase 4 (parte 2): capas

`src/layers.js`. `S.layer` puede ser `superficie`, `bajo` o `cielo`; fuera de la superficie, `layerStep` reemplaza a `worldStep`.

- **Portales y ritual:** grietas al Subsuelo en 1 de cada 14 regiones de tierra (siempre una en la región 1,1, cerca del Origen) y escaleras de luz junto a cada torre de luz (la de la región 2,0 se oye desde el Origen). Cada portal muestra cuántos pulsos necesita (3–5). Hay que lanzarlos seguidos y en el beat (`onBeatNow`) estando a menos de 150 px; uno fuera de tiempo reinicia la cuenta.
- **Subsuelo:** coordenadas propias `S.under`; 1 paso abajo equivale a 8 arriba (`S.wx = under.x × 8`), así que es un atajo para viajar lejos. La linterna se gasta 1,5× más rápido. Visual de cueva con vetas de oro que laten con el beat. Música de región sintética por celda de 1.400 px: dub, dub profundo, dubstep, Berlin School o minimal techno. Se sale por columnas de luz (≈55 % de las celdas, solo donde arriba hay tierra). Se ven de lejos como brillo en el borde. Logros `bajo1` y `atajo` (salir a más de 40 regiones de donde entraste).
- **Cielo:** vista del continente desde arriba (1 región = 60 px): tierra con el color del continente (más clara si la visitaste), mares, hitos, nombres de continentes y nubes. Se mueve 6× más rápido. Un toque baja en ese punto si es tierra. Música ambient. Logro `cielo1`.
- En capas no suenan hitos, ríos ni tormentas, y no se registran lugares (las regiones sintéticas no cuentan como visitadas). Salir del Mundo vuelve a la superficie.

Pruebas: `tests/layers_smoke.py`.

Pendiente de la fase 4: migraciones con posición según la fecha y rastros de otros jugadores (requiere multiplayer).

### Ajuste de mezcla: fuerte pero limpio (Jay: "está muy saturado")

La segunda subida (compensación ×6,8, saturación tanh 1,9) dejaba ~11 % de las muestras por encima de 0,8: sonaba aplastado. Ahora: compresor −26 dB 3,5:1 con ataque de 12 ms (los golpes respiran), presencia +2,5 dB, graves +2 dB, compensación ×5,6 (`LOUD`), limitador a −1 dB y saturación casi lineal (tanh 1,05, solo redondea picos). Medido: RMS ~−8,4 dB con ~5 % de muestras calientes. Sigue unos 7 dB más fuerte que el original y sin el aplastamiento. Si Jay pide más volumen otra vez, subir `LOUD` de a 0,4 y volver a medir con un analizador después del clipper; por encima de ~6,5 vuelve a saturar.

### Hacer música en el lugar: looper, banda y mesa de efectos

**Looper de ecos** (`src/jam.js`): el botón `#bLoop` del dock se arma; la grabación empieza en el siguiente compás y dura 32 semicorcheas. `playVoice` llama a `runtime.loopTap`, que guarda solo lo que suena dentro de los 1,3 s posteriores a una acción del jugador (`markInput` en pulso y toque, y `lastNoteMs` en luces), con un máximo de 48 eventos. El resultado es un eco en tu posición. `loopStep` lo reproduce a tempo con su posición como fuente, así que se oye más cerca y se apaga lejos (deja de sonar a 900 px). Máximo 4 ecos; el más viejo se reemplaza. Junto a un eco, el botón lo borra. Los ecos son temporales y se borran al salir del Mundo. Logros `eco1` y `eco4`.

**Banda de criaturas:** al tocar una criatura, `bandJoin` la pone en su papel según `getVoice` (bajo, percusión, acordes o melodía; los papeles agudo y lead cuentan como melodía). Cada papel tiene un solo miembro, y una criatura nueva reemplaza a la anterior del mismo papel. Con 2 o más miembros, `bandStep` toca partes coordinadas en cada semicorchea (`bandHits`): bajo en 0, 6, 10 y 14; caja en 4 y 12 con fantasmas; acordes cada 2 compases; melodía con el motivo de la criatura en respuesta en compases impares. Los miembros siguen al pixel en formación y hay 4 ranuras B, P, A, M en pantalla. Con la banda completa la energía sube. Logros `banda4`, `familia` (oculto, los 4 del mismo continente) y `viajeros` (oculto, 4 continentes distintos). La banda se disuelve al salir del Mundo.

**Mesa de efectos** (`src/fxpad.js`, cadena en `audio.js`): `master → mfilt → fx.lp → fx.hp → fx.dry → punch` y, en paralelo desde `fx.hp`, envíos a una reverb propia de 4,5 s, a un delay con realimentación filtrada y a un reductor de bits. Todo vuelve a `punch`, sin bucles con la reverb general. `padParams(x,y)`: con x < 0,45 el paso bajo baja de 20 kHz a 200 Hz; con x > 0,55 el paso alto sube de 10 Hz a ~14 kHz; el centro tiene imán y queda limpio. y controla reverb (0–0,85) y eco (0–0,35). Eco: delay de 3 semicorcheas con realimentación 0,72. Robot: envío a reducción de bits y señal seca a 0,6. Stop: filtro y volumen caen en un tiempo y vuelven. Al soltar el pad vuelve a neutro en 0,12 s, salvo con Fijar. El arrastre en el pad no mueve al pixel. Solo existe en el Mundo y se reinicia al salir. Logros `productor`, `robot` y `cinta`.

Pruebas: `tests/jam_smoke.py` y `tests/fx_smoke.py`.

## Estado general revisado (13 de octubre de 2026)

Main `5413d5f` incluye todas las funciones anteriores, looper, banda y mesa de efectos (PR #35). Hay 52 estilos, 11 biomas, continentes, mares, hitos, mapa, rarezas/ríos/confluencias, clima/estaciones/memoria, capas y PWA. En ese main todavía no había favoritos/autopilot; esta cadena añade favoritos, orientación y autopilot. Escenas, red y grabación audio/video siguen pendientes. Ecos/banda son temporales; huellas/campamentos y registros sí se guardan.

La rama `review/claude-audio-clarity` limpia salida y retornos sin cambiar patrones/instrumentos. 26 suites Node, diez smokes y render de audio real aprobados; mediciones, alcance y fallos de integración pendientes en REVISION. Los números RMS anteriores son mediciones históricas, no especificaciones del master actual.

### Nitidez musical y nueva dirección

`mix.js` construye un shaper lineal hasta 0,9 con rodilla final suave, sobremuestreo 4× y trim 0,98. Se añade corte de 20 Hz y se filtran retornos de reverb/eco para evitar acumulación grave, conservando directo y tiempos/feedback. Pad neutro vuelve a Q moderada, con Q=4 durante barridos. No hay realce nuevo de volumen ni cambio de notas/ritmos. Robot sigue disponible como efecto intencional. No garantiza un master profesional final: Jay escucha y afina.

Prueba adicional: `python3 tests/audio_mix.py` (helper de navegador `tests/audio_mix.mjs`, no suite Node). 13 renderizaciones de 10 segundos, picos/dinámica a 44,1/48 kHz y distorsión de salida; parámetros y resultados en REVISION.

Jay quiere muchas más combinaciones de lugares mediante un catálogo que relacione flora, fauna, sonidos, comportamientos, acciones, materiales, densidad e influencias culturales opcionales. Primero coordinar reglas/semillas, luego incorporar contenido. Referencias cromáticas/cinéticas a Felipe Pantone mediante vidrios y espejos originales; mantener negro de fondo y punto blanco. Muchas culturas, no solo Japón/México, con flora/fauna y música relacionadas; inventos históricos, personajes/pistas y mecanismos musicales son propuestas. PENDIENTES detalla fases y criterios; aprobación por etapa.

### Fase 2: integración entre capas y jam

Fuentes automáticas de superficie se suspenden en Subsuelo/Cielo; faros/flores y banda se conservan para el retorno pero no se disparan allí. Cambiar de capa cancela grabación y colas de acciones pendientes. Estudio restaura ADN sintético de capa al salir. Ecos guardan referencia de receta, rasgos de fuente y capa; no parsean claves sintéticas como coordenadas ni suenan en otra capa. Eventos de jugador se etiquetan mediante withVoiceOrigin/argumento explícito; banda/ambiente/eco no se graban. Guardado v4 intacto, ecos siguen temporales. Node y smokes jam/layers/layer_jam aprobados. Orden/base en RAMAS.md.

### Fase 3: Catálogo y recetas de lugar

Rama `feat/03-world-recipe-catalog`. Cada región tiene una receta estable de carácter, materiales, distribución, acciones y presupuestos. Bitácora y Escuchar muestran su carácter; también reconocen Subsuelo y Cielo. El catálogo valida entradas y usa semillas independientes por elemento. Esta base conserva paisaje y música existentes; la distribución se aplica en fase 4. No añade culturas ni objetos nuevos todavía. Verificación: 27 suites Node y smoke móvil/escritorio. Dependencia y orden en RAMAS.md.

### Fase 4: Combinaciones coherentes

Rama `feat/04-coherent-world-combinations`. Las recetas ya distribuyen los elementos nuevos: tres disposiciones, 35 tamaños de población observados, afinidad de movimiento y materiales, y claros de escucha libres. En fronteras se usa el bioma real del chunk con el presupuesto regional. Flora, criaturas, suelo, reliquias y sus IDs anteriores se conservan; las posiciones y tipos de juguetes se regeneran según receta. Se mantiene la música y sus límites, con afinidad suave de material. Verificación: 28 suites Node (fixtures de paisaje excluyen juguetes), combinaciones y smoke móvil/escritorio. Dependencia y orden en RAMAS.md.

### Fase 5: Lenguaje gráfico y capas de información

Rama `polish/05-world-visual-language`. Elementos nuevos, fenómenos e hitos comparten trazos, materiales y límites de brillo; el jugador conserva el blanco principal. Subsuelo y Cielo usan fondo negro, y el Cielo muestra contornos en vez de llenar regiones de color. La banda desplaza sus ranuras cuando hay FX, Escuchar o avisos; la mesa adapta su altura en pantallas cortas. Guía reutilizable en visual.js, sin alterar música. Verificación: 28 suites Node; smokes FX, jam, capas y táctil; capturas móvil/escritorio revisadas. Dependencia y orden en RAMAS.md.

### Fase 6: El ambiente responde a la quietud

Rama `feat/06-stationary-environment`. Tras aproximadamente 60 segundos de escucha activa aparecen respuestas espaciadas de fuentes cercanas o un motivo local cuando no hay objetos. La iniciativa desarrolla tres niveles con el tiempo, respeta el compás y baja suavemente al moverte. Menús, Escuchar, pestaña oculta y audio suspendido no suman tiempo; claros de escucha omiten respuestas extras. Logro El lugar te responde y explicación en Escuchar/Bitácora. Estado temporal, sin drone ni grabación de ambiente. Verificación: 29 suites Node y prueba de iniciativa con síntesis real móvil/escritorio. Dependencia y orden en RAMAS.md.

### Fase 7: Favoritos musicales

Rama `feat/07-musical-favorites`. Menú → Favoritos guarda hasta 64 puntos con nombre, coordenadas, capa y carácter musical; permite renombrar y borrar, y sobrevive a recarga. Bitácora los lista y el mapa marca los de superficie sin revelar terreno adicional. Logro Quiero volver. No es teletransporte ni snapshot del compás; escenas exactas siguen pendientes. Guardado v4 añade favorites versión 1. Verificación: 30 suites Node y smoke de guardado/renombrado/recarga/Bitácora/borrado en móvil y escritorio. Dependencia y orden en RAMAS.md.

### Fase 8: Orientación y regreso

Rama `feat/08-return-navigation`. Cada favorito ofrece Orientar y hay retorno guiado al Estudio. Un indicador compacto muestra dirección, distancia en pasos y llegada, con cancelación; sigue disponible tras recarga. Si el destino está en otra capa indica buscar un acceso. No mueve al jugador ni teletransporta. Logro Otra vez aquí al regresar desde cierta distancia. Guardado v4 añade destination; borrar el favorito cancela su ruta. Verificación: 31 suites Node y smoke móvil/escritorio de dirección, llegada, capas y borrado. Dependencia y orden en RAMAS.md.

### Fase 9: Autopilot musical

Rama `feat/09-musical-autopilot`. Paseo musical desde Favoritos y viaje automático al destino de esta capa. Movimiento lento, pausa en menús/Escuchar/Estudio y al ocultar la pestaña, cancelación manual o con Detener/Escape, llegada y salida del Mundo. Consume linterna normalmente y compensa movimiento invertido. No se reanuda solo tras recarga. Logro Dejarse llevar por un minuto de viaje; el control manual siempre tiene prioridad. Verificación: 32 suites Node y smoke de viaje, pausas, linterna, cancelación y llegada incluso con movimiento invertido en móvil/escritorio. Dependencia y orden en RAMAS.md.

### Fase 10: Tres vidrios cromáticos musicales

Rama `feat/10-chromatic-glass`. Instalaciones originales de tres piezas translúcidas: arrastrar sus aros o usar controles gira las capas, revela figuras por superposición y cambia notas/acento a tempo. Sus voces dependen de la región. La orientación y el descubrimiento se guardan, aparecen en Escuchar y Bitácora, y hay logros por girar y alinear. Un ejemplo está cerca del punto inicial de Origen; otros se distribuyen por receta sin mares. Color local, fondo negro y jugador blanco. Los espejos y cajas musicales son fases futuras. Verificación: 33 suites Node y smoke de arrastre sin mover jugador, controles, respuesta sonora, logros, recarga, Escuchar y Bitácora en móvil/escritorio. Dependencia y orden en RAMAS.md.

## Estado final de la cadena autorizada

Fases 1–10 implementadas en ramas dependientes, listadas con base/commit y verificación en RAMAS. Catálogo y recetas ya influyen en juguetes nuevos; se conserva flora/fauna/paisaje anteriores, mientras nuevas familias de flora/fauna y referencias culturales siguen para etapas futuras. Hay seis arquetipos, tres disposiciones y presupuestos por región. Vidrios son una familia nueva de instalación registrada; no hay espejos ni cajas musicales nuevos todavía.

Favoritos v1 (máximo 64), destination y glassSites (máximo 64) viven en v4, con defaults en fresh para reiniciar correctamente. Escenas/compás exacto y ecos persistentes no están implementados. Autopilot es temporal: nunca arranca solo al recargar, se pausa en menús/Estudio/Escuchar/ocultar pestaña y para al cambiar de capa, salir, llegar o recibir entrada manual. Viaje entre capas requiere encontrar acceso, no teletransporte.

Logros nuevos: escuchaViva, favorito1, regresoMusical, paseo1, vidrio1 y vidrioArmonia (oculto). Se muestran mediante Bitácora y Voz. Favoritos e instalaciones exploradas aparecen en Lugares; Escuchar identifica recetas y voces de vidrios. No se añaden muestras grabadas ni cuentas.

La transición de entrada conserva fondo negro y usa anillos discretos en vez de un flash blanco de pantalla completa. El color de vidrios es local a sus piezas. Es una implementación original de superposición/rotación, no una reproducción de una obra concreta.

Verificación final: npm test, smokes de regresión y nuevos flujos, render offline de audio y revisión de capturas. Las mediciones finales conservan margen de salida; el balance artístico lo prueba Jay con sonido real. Fases 11–31 siguen sin autorización en esta sesión. Orden de integración: 1 → 2 → … → 10.

### Borrar ecos con un toque

Rama `fix/10a-tap-delete-echo`, basada en la fase 10. Toca el anillo azul de un eco para borrarlo; un arrastre sigue moviendo al jugador y no borra. Solo afecta al eco tocado en la capa actual. El botón ⟳ junto al eco sigue siendo una alternativa. No borra árboles ni objetos originales.

### Fase 11: espejos musicales

Rama `feat/11-musical-mirrors`, basada en `fix/10a-tap-delete-echo`. Un punto dorado emite luz: orienta tres espejos para dirigirla al receptor en forma de rombo. Toca un espejo para abrir sus tres controles (0–180°); el contacto no mueve al jugador. La ruta completa revela una figura local y cambia los grados musicales. El origen ofrece una instalación fácil de aprender, a la derecha del inicio, centro (1600,900); los vidrios continúan en (1080,900).

Presencia dispersa por catálogo, posiciones, orientación inicial, rotación del conjunto, figura y voces regionales deterministas. No aparece en mares ni en Vacío. Los demás conjuntos son más difíciles, pero todos tienen una solución. Rayos con un máximo de cuatro rebotes y 800 unidades de recorrido; no producen realimentación sonora. Vidrios y espejos comparten un máximo de una respuesta ambiental por compás, y cada conjunto de espejos responde como máximo cada dos compases. Respetan silencio, capa superficial y claros de escucha. Los pulsos del jugador también activan el emisor.

Hasta 64 instalaciones guardan sus orientaciones y la conexión descubierta. Menú, cambio de capa y salida mantienen la separación de sistemas; panel y vidrios se excluyen entre sí. Escuchar incluye las voces de espejos. Bitácora muestra instalaciones y rutas completadas. Logros: Luz que escucha y Al otro lado del reflejo. No incluye aún espejos unidos a vidrios, puertas ni pistas encadenadas.

Validación: 34 suites de Node, interacción real en móvil/escritorio, ruta conectada, emisión sonora limitada, persistencia, Bitácora, Escuchar y separación de capas. Detalle de variedad actual y cómo repetir la medición en [VARIEDAD.md](VARIEDAD.md).

### Tu presencia transforma la composición

Rama `feat/12-musical-influence`. Las acciones del jugador alimentan bajo, groove, motivo o espacio según identidad de objeto y receta regional. Transforman las partes existentes a compás, sin sumar una melodía infinita. Bajo con hasta ocho ataques por compás, motivos afinados a la escala y timbres del género, compensación de capas y cambios suaves. Aros/prismas crecen al permanecer cerca seis segundos y se reducen al alejarse; el contacto dispara una vez al entrar, los pulsos siguen activándolos. La influencia es temporal y se desvanece, pausada en menús, Escuchar y audio suspendido. Logro Una música que crece; feedback local y explicación en Escuchar. Pruebas de patrones, crecimiento real y renders de audio con influencia máxima; no equivale a certificar calidad artística de master.

### Sonidos libres y fijación voluntaria

Rama `feat/12a-optional-sound-pins`. No se fija ningún sonido por defecto. Menú → Fijar sonidos activa una preferencia explícita: los objetos tocados dejan su voz suave en un anillo azul. Hasta cuatro ecos compartidos con el looper manual, una voz automática por papel musical; otro objeto del mismo papel reemplaza la anterior. Toca el anillo para soltarlo, sin que vuelva a fijarse por quedarte encima; al alejarte y regresar puede fijarse de nuevo. Desactivar la opción suelta los automáticos y conserva los manuales. No captura ambiente, pulsos vacíos ni notas de recoger luz; no usa micrófono. La preferencia se guarda, los sonidos fijados son temporales y no reaparecen tras recargar. Looper de dos compases sigue disponible como herramienta aparte. Logro Déjalo sonando y prueba real de opt-in, reemplazo, liberación y recarga.

### Jardines modulares con cables

Rama `feat/12b-patch-gardens`. Conjuntos dispersos de un reloj y tres entradas de composición, con orden y roles distintos por región. El Origen tiene uno en (2050,900), después de los espejos. Arrastra el aro de salida a una entrada, o toca salida y entrada; toca una entrada conectada para retirar su cable. Cuatro figuras y nivel de influencia firmado permiten transformar o reducir partes. Los cables están desconectados por defecto. Modulan la composición existente a compás, sin sumar osciladores ni crear realimentación. Solo el conjunto conectado más cercano influye; pausa en menús, capas distintas, silencio, pestaña oculta y claros. Hasta 64 conjuntos conservan cables/figura/nivel; la influencia vuelve al acercarte, sin audio fuera del área. Panel local exclusivo, Bitácora y logro Conecta tu idea. Pruebas de gestos reales, guardado y transformación de composición.

### Explorar con más vacío y menos interfaz

Rama `polish/12c-mobile-space`. En el Mundo queda un solo botón permanente (Menú), lugar y linterna discretos. Menú → Instrumentos muestra efectos, Eco, Estudio y regreso; tocar mundo o elegir herramienta guarda la barra. Mostrar detalles recupera contadores/retos, guardado como preferencia; Escuchar incluye el reto. Voz breve ampliable, tarjetas más discretas, controles de 44 px y paneles acotados/desplazables. Grabación muestra un pequeño anillo, no ranuras vacías. Los flashes son locales y mantienen fondo negro. En jardines modulares los cables se manipulan sin abrir parámetros; tocar el cuerpo del módulo abre su panel. Revisión y límites en REVISION_INTERACCIONES.md. Verificado en móvil pequeño, vertical, horizontal y escritorio, con pruebas de acceso real a todas las herramientas.

## Estado del pedido posterior

Las unidades 12 → 12a → 12b → 12c → 12d siguen la rama 11; Jay las integra en orden. `influence.js` transforma el arreglo de radio, `patchgarden.js` dirige esa influencia desde cables físicos, `focusui.js` determina la presentación de exploración y `contact.js` distingue entrar de sostener contacto. Estado nuevo de partida: `autoPins` y `worldDetails` (preferencias), `patchSites` (máximo 64). La influencia musical y los ecos siguen temporales. Nunca marcar cajas/cuerdas/historia/multijugador como implementados.

Revisión técnica/UX: [REVISION_INTERACCIONES.md](REVISION_INTERACCIONES.md). Propuesta narrativa y de consolidación: [DIRECCION_JUEGO.md](DIRECCION_JUEGO.md). Lo recomendado allí no se ha implementado automáticamente.

### Contactos intencionales y dirección común

Rama `fix/12d-contact-intent`. Plantas, árboles, lotos, pilares, cristales y props responden una vez al entrar; salir rearma y pulsar sigue siendo una acción explícita. Menús y Escuchar no consumen el contacto inicial. No se elimina el ambiente ni la radio en quietud. El jardín inicial ofrece Bajo/Groove/Motivo para escuchar la diferencia inmediatamente; los demás conservan sus entradas regionales variadas. DIRECCION_JUEGO.md propone unir Camino, Mundo y Estudio mediante descubrir, componer, retirar y conservar, con Voz contextual y progreso significativo. Es una propuesta posterior, no una historia ya implementada. README, HANDOFF, PENDIENTES, RAMAS y revisión quedan actualizados.

El jardín de Origen ahora ofrece Bajo/Groove/Motivo como demostración inmediata; los demás siguen sorteando sus entradas. La influencia de bajo conserva pasos fuertes y varía contratiempos/notas compatibles también en géneros nativos. El ciclo propuesto en DIRECCION_JUEGO.md y sus cambios de progreso/linterna siguen siendo recomendaciones.

Las criaturas ya no se unen a la banda automáticamente con fijación apagada. Fijar sonidos permite acompañantes musicales; tocar una figura de la banda con aro azul suelta esa voz. Desactivar fijación también suelta la banda. Las voces de criaturas no se duplican en un eco automático y la banda. Su contacto distingue entrar de permanecer; pueden responder espontáneamente como parte del ambiente sin convertirse en acompañantes.

### Interfaz sin notas decorativas

Rama `fix/13-silent-interface`. Botones, Voz y campos no activan el teclado de movimiento ni pulsos; un arrastre sobre texto del HUD solo inicia música cuando se convierte en movimiento real. Soltar sobre interfaz no lanza pulso. Se retiró el arpegio automático de entrada al Mundo y activar Prototipo no inicia audio. Los controles de instrumentos/efectos y el lienzo mantienen sus acciones musicales explícitas. Prueba de teclado en botones, cambios de ajustes, entrada sin jingle y pulso desde canvas.

### Laboratorio de semillas completas

Rama `feat/14-seed-laboratory`. Menú → Prototipo → Semillas permite elegir texto, presets, otra semilla, volver al centro o regresar a Mi partida. Cada semilla reconstruye bioma inicial, música, escala, patrones, criaturas, terreno, atmósfera y continentes; no solo teletransporta a otro género. El centro es tierra segura. Se recarga el contexto para no mezclar cachés/sonidos de dos mundos. Las pruebas tienen guardados separados por semilla y no sobrescriben favoritos ni progreso habitual. El Camino diario conserva su generador. Las semillas de prueba entran al Mundo sin completar el día; no es un desbloqueo de la partida principal. Esta rama aún no dibuja blobs nuevos: llegan en la siguiente unidad.

### Blobs y espacios que respiran

Rama `feat/15-spacious-blob-worlds`. Las semillas de prueba usan biomas de 7200 unidades de ancho (antes 3600); Espacio → Clásico permite comparar y conserva un guardado distinto. El mapa habitual conserva coordenadas. La escena reduce vegetación/fauna/props/juguetes con selección determinista y referencias a los mismos objetos: no cambia IDs ni consume el RNG original, no afecta reliquias, portales ni instalaciones, y Escuchar usa los objetos visibles. Voces ambientales responden menos a menudo y solo un cantor se superpone. Semillas blobs generan habitantes de cuerpos suaves, rasgos distintos y voces graves/medias/percusivas del género; también hay hábitats de blobs dispersos. Dos o tres habitantes cerca del centro permiten probar de inmediato sin llenar el paisaje. No se fuerza agudo y se conserva afinación/tempo regional. Centro seguro, guardados por semilla y layout, vuelta a Mi partida. Validación de generaciones, aislamiento y síntesis de voces en 23 renders.

Estado actual de este pedido: ramas 13 → 14 → 15, separadas de las fases propuestas con esos números en el plan histórico. `seeds.js` controla pruebas por URL; `progress.js` usa guardados separados y hash de mundo, manteniendo hash base para Camino. `REG` vale 8 solo en pruebas Amplio; 4 en mapa habitual/Clásico. `blobs.js` crea rasgos/voces y vistas de chunks calmadas sin mutar el generador. No reinicializar módulos al cambiar semilla: se recarga el contexto. Guía: [MUNDOS_SEMILLAS.md](MUNDOS_SEMILLAS.md).

## Contenido de esta agrupación

- **Fase 1: Base creativa.** Recorrido Camino → Mundo → Estudio, pistas de gestos, sustracción y aros/prismas modelables.
- **Fase 2: Exploración con sentido.** Retos abiertos, capacidades de reliquias, pistas, Voz contextual y modo de creación sin gasto de linterna.
- **Fase 3: Primeros cinco encuentros.** Nubes, tejedoras, pozos de silencio, semillas orbitales y piedras de capas; selector de pruebas en Semillas.
- **Fase 4: Otros cinco encuentros.** Animales de intercambio, corrientes reversibles, flores de presión, esculturas de sombra y cajas de posibilidades.
- **Fase 5: Pulido final.** Paletas de 52 estilos, densidad musical, prioridad del borrado, accesibilidad, móvil y shell offline completo.

</details>

</details>

</details>
