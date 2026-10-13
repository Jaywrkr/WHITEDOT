# WHITEDOT · Pixel Blanco

Un punto blanco en un mundo negro que compone música electrónica mientras lo exploras. Camino diario, Mundo procedural y Estudio; 11 biomas y 52 estilos actuales. Por Jay · [@jaywrkr](https://instagram.com/jaywrkr).

## Entrega actual: fase 2 · Paisajes vivos

Rama **`feat/phase-02-living-world-recipes`**, basada en main `e26ef93` (PR #68), que ya incluye fase 1. Añade 33 perfiles de hábitat sobre los 11 biomas, campos de clima/fertilidad, seis familias musicales pequeñas, composición regional y vecinos más relacionados. Amplio vivo: regiones de **10.800 unidades**. [Detalle y límites](FASE_02.md).

**Probar: Menú → Explorar mundos → Paisajes vivos → Humedal / Salinas / Basalto / Micelio.** Toca, modela y permanece cerca de elementos; el color sigue localizado y el menú es el único control permanente. Bitácora y logros registran los descubrimientos nuevos.

La generación Original, sus coordenadas y guardados se conservan. Ambas generaciones tienen direcciones, favoritos y respaldos separados; elegir otra no migra una partida silenciosamente. La base de recuperación/cachés de [fase 1](FASE_01.md) permanece.

Jay ya integró fase 1. Crear el PR de esta fase 2 **directamente hacia main**; Jay lo revisa y hace merge. Una rama amplia por fase: [FASES_UNIVERSO.md](FASES_UNIVERSO.md). El asistente no publica directamente.

## Jugar y probar

- Mueve el punto con arrastre o WASD/flechas. El Camino recoge luz y abre el Mundo; explora, toca, pulsa y escucha. Menú → Instrumentos abre las herramientas; el mundo mantiene el fondo negro y su UI mínima.
- La música evoluciona incluso en quietud. Los gestos cambian bajo, groove, motivo o espacio según la región. La fijación de sonidos es opcional y los ecos se borran tocando su anillo.
- Vidrios: gira sus aros directamente. Espejos: orienta la luz. Jardines: conecta entradas y retira cables tocándolas. Suelo resonante: toca el piso o permanece cerca. Animal de respuesta: tócalo, toca el mundo para enseñarle y vuelve a tocarlo para escuchar su respuesta.
- Menú → Favoritos guarda hasta 64 puntos; Orientar/Viajar funcionan en su mundo/capa compatibles. El audio del instante no se congela como una escena.
- **Menú → Progreso y respaldo** exporta esta partida. Elegir un JSON valida primero; Restaurar conserva una copia previa y recarga. Cada semilla/layout de prueba tiene su propio guardado y respaldo.
- Menú → Prototipo → Semillas permite comparar mundos y encuentros sin reemplazar la partida habitual. Mi partida regresa al guardado principal.

## Desarrollo y verificación

Aplicación estática con módulos ES, Canvas y Web Audio. Sin dependencias de aplicación ni build; no hace falta `npm install`. Sirve por HTTP:

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000`. Para probar:

```bash
python3 -m pip install -r requirements-dev.txt
python3 -m playwright install chromium
npm test
npm run test:browser
npm run test:audio
npm run audit:universe -- 10000 4
```

Para auditar Paisajes vivos: `npm run audit:universe -- 10000 4 2 classic`.

Node >=18; Python/Playwright para navegador y audio. `CHROMIUM_PATH` permite elegir navegador; los runners detectan Chromium del sistema o el de Playwright y levantan sus propios servidores. GitHub Actions ejecuta lógica, auditoría, navegador, offline y audio en PR/main. No despliega desde ese workflow.

Guardado local: borrar los datos del navegador elimina progreso; exporta antes. La identidad reconoce el Original (v1) y Paisajes vivos (v2); las versiones futuras requieren conservar el generador o una migración probada. Los ensayos Chromium y renders no sustituyen pruebas en Safari/Android ni escucha curada real.

## Documentación vigente

[Entrega y pruebas](FASE_02.md) · [Base fiable](FASE_01.md) · [Diez fases](FASES_UNIVERSO.md) · [Inventario V1](V1_PRODUCCION.md) · [Pendientes](PENDIENTES.md) · [Rama y merge](RAMAS.md) · [Continuar trabajo](HANDOFF.md) · [Variedad](VARIEDAD.md).

En el mapa original, la medición antigua mantiene **39.952 recetas detalladas entre 40.000 regiones**; no es el total del universo ni una cifra de canciones únicas. La auditoría de Paisajes vivos mide recetas y vecindad por semilla; esos números no cuentan canciones ni certifican variedad percibida.

<details><summary>Historial de entregas y documentación anterior (estados de rama y conteos históricos)</summary>

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

# WHITEDOT · Pixel Blanco

Un pixel blanco en un mundo negro. Cada día avanzas un camino corto, y cuando lo terminas se abre un **Mundo procedural que compone mientras lo exploras**: 52 géneros electrónicos y once biomas, del ambient al house, techno, bass y otros lenguajes. Cada región tiene su género, su paisaje y sus criaturas, y todo lo que tocas suena a tempo.

**Esta entrega:** cadena hasta `feat/15-spacious-blob-worlds`; ramas en [RAMAS.md](RAMAS.md). Música que responde a tus acciones, fijación voluntaria, módulos con cables y una interfaz de exploración más despejada. El sitio publicado cambia cuando Jay integra en main. Dirección propuesta: [DIRECCION_JUEGO.md](DIRECCION_JUEGO.md); revisión: [REVISION_INTERACCIONES.md](REVISION_INTERACCIONES.md).

**Jugar:** https://whitedot-inky.vercel.app. En el móvil, instálalo como app: en iPhone, Compartir → Añadir a pantalla de inicio. Funciona en móvil y escritorio; toca la pantalla una vez para activar el sonido.

Por Jay · [@jaywrkr](https://instagram.com/jaywrkr)

---

## Cómo se juega

1. **Camino del día:** mueve el pixel (arrastra o usa WASD/flechas) y recoge luces. La barra tiene un tope diario. Volver cada día suma racha.
2. **Mundo:** al terminar el camino entras al Mundo. Tu linterna dura 10 minutos, más 1 minuto por día de racha (máximo 60). El tiempo de linterna se pausa mientras consultas menús y paneles.
3. **Explora:** encontrarás claros de escucha, espacios de ensamble y rincones de descubrimiento. Los elementos nuevos se agrupan para poder tocarlos juntos; en los claros la música automática respira más. El HUD y Escuchar indican el espacio actual. las regiones son grandes y cambian poco a poco, igual que bajar de la sierra a la costa. Cada una tiene un género (afro house, minimal, rominimal, dub techno, acid, garage, electro, progressive house, microhouse, minimal techno, dubstep y drum & bass, tropical house, melodic house, electro robótico y nu-disco…), su escala, su suelo, su aire y su fauna. Aunque te quedes quieto, la música sigue componiendo: cambia frases, instrumentos y secciones con el tiempo y la actividad del ambiente.
4. **Interactúa:**
   - Choca objetos. Encontrarás luces fugitivas, brotes saltarines, cometas flotantes, prismas giratorios y aros resonantes: unos salen volando, otros saltan, giran o resuenan sin moverse. También reaccionan al pulso. Cada objeto tiene rasgos propios: algunos son serenos, otros vivaces o elásticos; varían su movimiento, impulso y recuperación incluso dentro de una misma región.
   - Lanza un **pulso** tocando brevemente la pantalla o con Espacio.
   - **Escuchar:** mantén presionado sin arrastrar durante medio segundo (o mantén E en escritorio). Consulta las fuentes cercanas, su función musical, instrumento, región, género y escala. Suelta para volver a moverte.
   - Deja que las criaturas te sigan y canten.
   - Cumple el reto de cada región.
   - Algunos objetos añaden filtro suave, eco a tempo, espacio o modulación metálica a su voz. Su carácter varía por región y aparece en Escuchar.
   - Escucha el reparto musical del lugar: un árbol, cristal o criatura puede aportar bajos, percusión, acordes o melodías según la región. Su función e instrumento se conservan al volver, pero varían incluso dentro del mismo bioma.
   - Cada región muestra su gravedad al entrar: ligera (más rápido), normal o alta (más lento). La velocidad cambia suavemente en sus fronteras: ligera 1,65×, normal 1× y alta 0,55×.
5. **Estudio:** un secuenciador radial portátil. Lo armas con las muestras que recoges y lo despliegas como refugio, que también sirve de checkpoint.
6. **Bitácora:** consulta lugares y su gravedad, formas agrupadas por función musical, música descubierta y logros. Los logros ocultos se muestran como “???”. La Voz del sistema comenta lo que haces sin pedir permiso.
7. **Sesión:** desde el menú consulta tus descubrimientos nuevos, retos, hallazgos, interacciones y pulsos, junto con los lugares y la música escuchada. Al salir del Mundo se conserva el resumen; puedes compartirlo como imagen.
8. **Compartir:** genera una tarjeta para redes con tu racha y tus descubrimientos.

## Tecnología

- HTML en `index.html`, CSS en `styles/game.css` y módulos JavaScript nativos en `src/`.
- Canvas 2D y Web Audio API. Todo el sonido se sintetiza en vivo, sin samples.
- Sin dependencias de aplicación ni build. `package.json` declara módulos ES y el comando de pruebas core; no hace falta `npm install`.
- Guarda el progreso en `localStorage` (clave `pixel-blanco-v4`).

## Correr local

```bash
python3 -m http.server 8000
```

Desde la carpeta del repositorio, ejecuta ese comando y abre `http://localhost:8000`. También puedes usar `npx serve .` y abrir la dirección que indique ese servidor.

## Deploy

El repo está conectado a Vercel (proyecto `whitedot`). Los cambios se preparan en una rama nueva desde `main` actualizado, se verifican y se suben con commit y push. **Jay crea el PR y hace el merge.** El asistente no hace push directo a `main`, no crea PRs y no hace merges.

Al integrar el PR en `main`, Vercel despliega producción automáticamente. No hay paso de build: Vercel sirve `index.html`, `styles/` y `src/` como archivos estáticos.

## Verificar cambios

```bash
npm test
python3 tests/smoke.py
python3 tests/atlas_smoke.py
python3 tests/world_smoke.py
python3 tests/journey_smoke.py
python3 tests/mobile_smoke.py
python3 tests/wonders_smoke.py
python3 tests/alive_smoke.py
python3 tests/layers_smoke.py
python3 tests/jam_smoke.py
python3 tests/fx_smoke.py
python3 tests/audio_mix.py
```

Las pruebas core necesitan Node. Para las pruebas de navegador necesitas Python y Playwright: instala `tests/requirements.txt` en un entorno virtual (`python3 -m pip install -r tests/requirements.txt`) y usa Chromium instalado en el sistema, o instala el navegador con `python3 -m playwright install chromium`. Puedes indicar su ejecutable mediante `CHROMIUM_PATH`. El smoke test levanta su propio servidor y verifica móvil y escritorio; no evalúa la calidad audible de la música.

Los módulos requieren servir el juego por HTTP; abrir `index.html` mediante `file://` no es el flujo soportado.

Los avisos del sistema ocupan dos líneas; tócalos para leer el mensaje completo. La tarjeta de entrada es breve y los detalles del lugar quedan en Bitácora y Escuchar.

## Escala del mundo

El Mundo está hecho de **continentes** de tamaños muy distintos, cada uno con su nombre, su tono musical, su familia de géneros y su color. Entre ellos hay **mares de silencio** casi vacíos. La vida no está repartida pareja: hay desiertos largos y oasis llenos; al llegar a un oasis después del vacío, la música entra de golpe. Los **hitos** (torres de luz, árboles madre, ciudades de formas, monolitos y faros) se oyen desde lejos y desde su dirección antes de verse. No hay flechas: sigue el sonido.

Mientras más lejos del Origen, más raro: criaturas más grandes, colores imposibles y música desafinada. Con la linterna diaria no llegas lejos en un día, así que tu Estudio es el campamento base. El **Mapa** (menú) solo muestra lo que viste, marca con "?" los hitos que oíste y no visitaste, y se puede compartir.

Muy de vez en cuando aparecen **rarezas** que rompen las reglas (gravedad invertida, regiones en canon, el tiempo que se detiene, la Luna de oro…). La Voz suelta rumores de hacia dónde están, y cada una te da una muestra única para tu Estudio. Los **ríos** cruzan el mundo: síguelos río abajo y la música va subiendo; donde dos ríos se juntan, sus músicas se mezclan. Las **tormentas** viajan con el viento y llueven notas: persíguelas. Cada continente cambia de **estación** cada semana, y el mundo guarda tus **huellas** y tus campamentos antiguos.

Hay **grietas** y **escaleras de luz**: ábrelas lanzando los pulsos que piden, seguidos y en el beat. Abajo, en el **Subsuelo**, cada paso vale ocho de arriba (sales por columnas de luz). Arriba, en el **Cielo**, ves el continente entero y tocas donde quieres bajar.

## Hacer música en el lugar

En el Mundo, el dock tiene dos botones nuevos:

- **⟳ Eco (looper):** grabas 2 compases de lo que tú haces sonar (pulsos, toques, luces) y queda en el mundo como un eco que se repite mientras estás cerca. Puedes tener hasta 4. Toca el anillo azul para borrarlo; junto a él, el mismo botón también sirve.
- **Mesa de efectos (Kaoss pad):** arrastras sobre el pad. Hacia los lados filtras (graves a la izquierda, agudos a la derecha) y hacia arriba das espacio (reverb y eco). Al soltar vuelve a limpio, salvo que actives **Fijar**. También tiene **Eco** (repeticiones largas a tempo), **Robot** (reducción de bits) y **Stop** (frenazo de cinta).
- **Banda de criaturas (estilo Incredibox):** cada criatura que tocas se une con su papel musical: bajo, percusión, acordes o melodía. Te siguen tocando su parte a tempo. Con la banda completa todo sube, y hay combos secretos.

## Atlas de ritmos (para probar)

Menú → Prototipo → **Ritmos** lista todos los géneros del juego ordenados por tempo, confirma que existen en el mundo y muestra cuáles ya escuchaste. **Ir** te lleva a la región más cercana con ese ritmo.

## Dirección del juego

Las reliquias pertenecen a sitios fijos del mundo, sin flecha global ni generación alrededor del jugador. Por chunk hay una probabilidad de 1/48 de un hallazgo, incluyendo constelaciones dormidas (1/384). Cerca del origen no aparecen. Los ecos requieren permanecer cerca 6 segundos y lanzar 3 pulsos; las constelaciones, 12 segundos y 5 pulsos. Al alejarte más de 140 px, la resonancia vuelve a cero. Cada sitio se obtiene una sola vez por partida y queda en tu constelación; su posición es compartida por la semilla del mundo. Las estrellas anteriores se conservan, y las reliquias pendientes del guardado antiguo siguen disponibles durante su día.

## Para seguir desarrollando

Lee **[HANDOFF.md](HANDOFF.md)**. Se complementa con **[CAMBIOS.md](CAMBIOS.md)** (inventario de todo lo añadido respecto al prototipo, referencias y estado de ramas) y **[PENDIENTES.md](PENDIENTES.md)** (plan vigente ordenado y criterios de aceptación). **[REVISION.md](REVISION.md)** recoge la revisión de Claude, mediciones de nitidez y problemas pendientes. HANDOFF explica visión, decisiones, arquitectura, sistemas y pruebas. Está pensado para pegarlo en otra IA (ChatGPT, Claude, etc.) y seguir sin perder nada.

La variedad musical incluye paletas tropicales, melódicas, robóticas y disco, con grooves y escalas propios. Sus instrumentos electrónicos incluyen steel pan, kalimba FM, teclas cálidas, cuerdas, metales, clavinet, bajos filtrados o FM, formantes, güiro y timbal. Escuchar y Bitácora muestran qué aporta cada fuente.

Cada región combina una gramática propia de acentos, armonía, fraseo y brillo, además de su género. La composición evoluciona estando quieto. **Escucha suave**, en el menú, reduce volumen y brillo; puedes combinarla con el control de silencio.

Los objetos y criaturas se oyen más presentes al acercarte y se apagan gradualmente al alejarte. Su volumen sigue la distancia incluso durante la nota; la música de fondo continúa componiendo.

Las regiones vecinas tienden a compartir tempo y afinación. Al acercarte a una frontera se mezclan gradualmente sus percusiones, bajos y melodías.

La biblioteca incluye 52 estilos. La tanda de raíz afroamericana suma Chicago house, Detroit techno, acid house, soulful/gospel house, garage house de Nueva York, ghetto house, footwork, Baltimore club, Jersey club, Miami bass, electro-funk, boogie, boom bap, lo-fi hip hop, trap, G-funk, electro de Detroit y broken beat. Antes había 34 estilos base, entre ellos electrónica andina, amapiano, jazztronica, Berlin School, IDM, cosmic disco, liquid drum & bass y darkwave/EBM. Sus patrones, armonías e instrumentos alimentan la gramática generativa y las mezclas entre regiones vecinas.

El entorno incluye aves de eco que responden a las frases, semilleros que se sacuden con cajas/claps y nubes que lanzan relámpagos graves. También reaccionan al contacto y al pulso; Escuchar identifica su función musical.

Los instrumentos tienen materiales sonoros procedurales —madera cálida, cristal suave, metal filtrado y aire sedoso— y variaciones de ataque, resonancia y armónicos. Cada objeto conserva su timbre al volver; Escuchar muestra su material.

La salida musical conserva sus patrones e instrumentos y reduce la saturación a niveles normales. Los retornos de reverberación y eco dejan más espacio al grave directo. `tests/audio_mix.py` verifica picos, dinámica y coloración con audio renderizado; la calidad perceptiva se valida escuchando.

Capas, Estudio y ecos mantienen su música separada: el looper captura acciones del jugador y conserva el timbre y la capa de origen. Consulta [RAMAS.md](RAMAS.md) para probar e integrar esta sesión en orden. Prueba de integración: `python3 tests/layer_jam_smoke.py`.

Catálogo y recetas de lugar: Cada región tiene una receta estable de carácter, materiales, distribución, acciones y presupuestos. Bitácora y Escuchar muestran su carácter; también reconocen Subsuelo y Cielo. El catálogo valida entradas y usa semillas independientes por elemento. Esta base conserva paisaje y música existentes; la distribución se aplica en fase 4. No añade culturas ni objetos nuevos todavía.

Combinaciones coherentes: Las recetas ya distribuyen los elementos nuevos: tres disposiciones, 35 tamaños de población observados, afinidad de movimiento y materiales, y claros de escucha libres. En fronteras se usa el bioma real del chunk con el presupuesto regional. Flora, criaturas, suelo, reliquias y sus IDs anteriores se conservan; las posiciones y tipos de juguetes se regeneran según receta. Se mantiene la música y sus límites, con afinidad suave de material.

Lenguaje gráfico y capas de información: Elementos nuevos, fenómenos e hitos comparten trazos, materiales y límites de brillo; el jugador conserva el blanco principal. Subsuelo y Cielo usan fondo negro, y el Cielo muestra contornos en vez de llenar regiones de color. La banda desplaza sus ranuras cuando hay FX, Escuchar o avisos; la mesa adapta su altura en pantallas cortas. Guía reutilizable en visual.js, sin alterar música.

El ambiente responde a la quietud: Tras aproximadamente 60 segundos de escucha activa aparecen respuestas espaciadas de fuentes cercanas o un motivo local cuando no hay objetos. La iniciativa desarrolla tres niveles con el tiempo, respeta el compás y baja suavemente al moverte. Menús, Escuchar, pestaña oculta y audio suspendido no suman tiempo; claros de escucha omiten respuestas extras. Logro El lugar te responde y explicación en Escuchar/Bitácora. Estado temporal, sin drone ni grabación de ambiente.

Favoritos musicales: Menú → Favoritos guarda hasta 64 puntos con nombre, coordenadas, capa y carácter musical; permite renombrar y borrar, y sobrevive a recarga. Bitácora los lista y el mapa marca los de superficie sin revelar terreno adicional. Logro Quiero volver. No es teletransporte ni snapshot del compás; escenas exactas siguen pendientes. Guardado v4 añade favorites versión 1.

Orientación y regreso: Cada favorito ofrece Orientar y hay retorno guiado al Estudio. Un indicador compacto muestra dirección, distancia en pasos y llegada, con cancelación; sigue disponible tras recarga. Si el destino está en otra capa indica buscar un acceso. No mueve al jugador ni teletransporta. Logro Otra vez aquí al regresar desde cierta distancia. Guardado v4 añade destination; borrar el favorito cancela su ruta.

Autopilot musical: Paseo musical desde Favoritos y viaje automático al destino de esta capa. Movimiento lento, pausa en menús/Escuchar/Estudio y al ocultar la pestaña, cancelación manual o con Detener/Escape, llegada y salida del Mundo. Consume linterna normalmente y compensa movimiento invertido. No se reanuda solo tras recarga. Logro Dejarse llevar por un minuto de viaje; el control manual siempre tiene prioridad.

Tres vidrios cromáticos musicales: Instalaciones originales de tres piezas translúcidas: arrastrar sus aros o usar controles gira las capas, revela figuras por superposición y cambia notas/acento a tempo. Sus voces dependen de la región. La orientación y el descubrimiento se guardan, aparecen en Escuchar y Bitácora, y hay logros por girar y alinear. Un ejemplo está cerca del punto inicial de Origen; otros se distribuyen por receta sin mares. Color local, fondo negro y jugador blanco. Los espejos y cajas musicales son fases futuras.

## Probar las primeras diez fases de esta sesión

Lee [RAMAS.md](RAMAS.md): las ramas forman una cadena y se integran de la **1 a la 10**. Puedes detenerte y probar cualquiera después de integrar sus anteriores.

- **Favoritos:** menú → Favoritos → Guardar aquí. Renombra o borra puntos; Orientar muestra dirección/distancia y Viajar inicia el recorrido automático en la misma capa. Paseo musical recorre lentamente el mundo. Mover el punto, Detener o Escape devuelve el control; menús pausan y la linterna se consume viajando.
- **Vidrios:** cerca del punto inicial de Origen hay una instalación unos pasos al este. Acércate y arrastra un aro de color: abre los tres controles. Los giros cambian figuras y respuestas musicales; alinear las piezas revela un logro. Sus orientaciones sobreviven a la recarga.
- **Escucha quieta:** un minuto de escucha activa invita al ambiente a responder gradualmente. Menús/Escuchar/audio suspendido no suman tiempo; al moverte se retira suavemente.
- **Eco ⟳:** pulsa para armar, espera al próximo compás y toca objetos/pulsa/recoge luces durante dos compases. Esas acciones se repiten en el lugar. Hasta cuatro ecos; toca su anillo azul para borrarlo. Cerca de uno, el mismo botón también lo borra. No usa micrófono ni exporta audio/video; los ecos siguen siendo temporales.

Además de `npm test` (33 suites), esta cadena añade `layer_jam_smoke.py`, `initiative_smoke.py`, `favorites_smoke.py`, `navigation_smoke.py`, `autopilot_smoke.py` y `glass_smoke.py` en `tests/`. Son pruebas de navegador con los requisitos habituales de Playwright/Chromium. Las fases siguientes (espejos, cajas musicales, escenas, culturas, etc.) quedan pendientes de elegir.

### Borrar ecos con un toque

Rama `fix/10a-tap-delete-echo`, basada en la fase 10. Toca el anillo azul de un eco para borrarlo; un arrastre sigue moviendo al jugador y no borra. Solo afecta al eco tocado en la capa actual. El botón ⟳ junto al eco sigue siendo una alternativa. No borra árboles ni objetos originales.

### Fase 11: espejos musicales

Rama `feat/11-musical-mirrors`, basada en `fix/10a-tap-delete-echo`. Un punto dorado emite luz: orienta tres espejos para dirigirla al receptor en forma de rombo. Toca un espejo para abrir sus tres controles (0–180°); el contacto no mueve al jugador. La ruta completa revela una figura local y cambia los grados musicales. El origen ofrece una instalación fácil de aprender, a la derecha del inicio, centro (1600,900); los vidrios continúan en (1080,900).

Presencia dispersa por catálogo, posiciones, orientación inicial, rotación del conjunto, figura y voces regionales deterministas. No aparece en mares ni en Vacío. Los demás conjuntos son más difíciles, pero todos tienen una solución. Rayos con un máximo de cuatro rebotes y 800 unidades de recorrido; no producen realimentación sonora. Vidrios y espejos comparten un máximo de una respuesta ambiental por compás, y cada conjunto de espejos responde como máximo cada dos compases. Respetan silencio, capa superficial y claros de escucha. Los pulsos del jugador también activan el emisor.

Hasta 64 instalaciones guardan sus orientaciones y la conexión descubierta. Menú, cambio de capa y salida mantienen la separación de sistemas; panel y vidrios se excluyen entre sí. Escuchar incluye las voces de espejos. Bitácora muestra instalaciones y rutas completadas. Logros: Luz que escucha y Al otro lado del reflejo. No incluye aún espejos unidos a vidrios, puertas ni pistas encadenadas.

Validación: 34 suites de Node, interacción real en móvil/escritorio, ruta conectada, emisión sonora limitada, persistencia, Bitácora, Escuchar y separación de capas. Detalle de variedad actual y cómo repetir la medición en [VARIEDAD.md](VARIEDAD.md).

Pruebas de espejos: `node tests/mirrors.mjs` y `python3 tests/mirrors_smoke.py`. Medir variedad: `node scripts/world-variation.mjs 100`.

### Tu presencia transforma la composición

Rama `feat/12-musical-influence`. Las acciones del jugador alimentan bajo, groove, motivo o espacio según identidad de objeto y receta regional. Transforman las partes existentes a compás, sin sumar una melodía infinita. Bajo con hasta ocho ataques por compás, motivos afinados a la escala y timbres del género, compensación de capas y cambios suaves. Aros/prismas crecen al permanecer cerca seis segundos y se reducen al alejarse; el contacto dispara una vez al entrar, los pulsos siguen activándolos. La influencia es temporal y se desvanece, pausada en menús, Escuchar y audio suspendido. Logro Una música que crece; feedback local y explicación en Escuchar. Pruebas de patrones, crecimiento real y renders de audio con influencia máxima; no equivale a certificar calidad artística de master.

### Sonidos libres y fijación voluntaria

Rama `feat/12a-optional-sound-pins`. No se fija ningún sonido por defecto. Menú → Fijar sonidos activa una preferencia explícita: los objetos tocados dejan su voz suave en un anillo azul. Hasta cuatro ecos compartidos con el looper manual, una voz automática por papel musical; otro objeto del mismo papel reemplaza la anterior. Toca el anillo para soltarlo, sin que vuelva a fijarse por quedarte encima; al alejarte y regresar puede fijarse de nuevo. Desactivar la opción suelta los automáticos y conserva los manuales. No captura ambiente, pulsos vacíos ni notas de recoger luz; no usa micrófono. La preferencia se guarda, los sonidos fijados son temporales y no reaparecen tras recargar. Looper de dos compases sigue disponible como herramienta aparte. Logro Déjalo sonando y prueba real de opt-in, reemplazo, liberación y recarga.

### Jardines modulares con cables

Rama `feat/12b-patch-gardens`. Conjuntos dispersos de un reloj y tres entradas de composición, con orden y roles distintos por región. El Origen tiene uno en (2050,900), después de los espejos. Arrastra el aro de salida a una entrada, o toca salida y entrada; toca una entrada conectada para retirar su cable. Cuatro figuras y nivel de influencia firmado permiten transformar o reducir partes. Los cables están desconectados por defecto. Modulan la composición existente a compás, sin sumar osciladores ni crear realimentación. Solo el conjunto conectado más cercano influye; pausa en menús, capas distintas, silencio, pestaña oculta y claros. Hasta 64 conjuntos conservan cables/figura/nivel; la influencia vuelve al acercarte, sin audio fuera del área. Panel local exclusivo, Bitácora y logro Conecta tu idea. Pruebas de gestos reales, guardado y transformación de composición.

### Explorar con más vacío y menos interfaz

Rama `polish/12c-mobile-space`. En el Mundo queda un solo botón permanente (Menú), lugar y linterna discretos. Menú → Instrumentos muestra efectos, Eco, Estudio y regreso; tocar mundo o elegir herramienta guarda la barra. Mostrar detalles recupera contadores/retos, guardado como preferencia; Escuchar incluye el reto. Voz breve ampliable, tarjetas más discretas, controles de 44 px y paneles acotados/desplazables. Grabación muestra un pequeño anillo, no ranuras vacías. Los flashes son locales y mantienen fondo negro. En jardines modulares los cables se manipulan sin abrir parámetros; tocar el cuerpo del módulo abre su panel. Revisión y límites en REVISION_INTERACCIONES.md. Verificado en móvil pequeño, vertical, horizontal y escritorio, con pruebas de acceso real a todas las herramientas.

### Contactos intencionales y dirección común

Rama `fix/12d-contact-intent`. Plantas, árboles, lotos, pilares, cristales y props responden una vez al entrar; salir rearma y pulsar sigue siendo una acción explícita. Menús y Escuchar no consumen el contacto inicial. No se elimina el ambiente ni la radio en quietud. El jardín inicial ofrece Bajo/Groove/Motivo para escuchar la diferencia inmediatamente; los demás conservan sus entradas regionales variadas. DIRECCION_JUEGO.md propone unir Camino, Mundo y Estudio mediante descubrir, componer, retirar y conservar, con Voz contextual y progreso significativo. Es una propuesta posterior, no una historia ya implementada. README, HANDOFF, PENDIENTES, RAMAS y revisión quedan actualizados.

### Probar esta entrega

1. Entra al Mundo y camina: el menú es el único control permanente. Menú → Instrumentos abre Eco, efectos y Estudio; Mostrar detalles recupera contadores.
2. Quédate cerca de un aro/prisma unos seis segundos para cultivar su parte. Al salir se reduce; no necesitas grabar.
3. En Origen, sigue a la derecha: vidrios (1080,900), espejos (1600,900), jardín modular (2050,900). En este último conecta reloj con Bajo, Groove o Motivo y escucha el cambio al compás. Toca el cuerpo del módulo para ajustar figura/cantidad; la entrada conectada retira el cable.
4. Fijar sonidos está apagado. Actívalo desde el menú si quieres repetición; tocar el anillo la suelta. Otro objeto del mismo papel reemplaza su voz.

Las variantes de bajo también alteran acentos compatibles en géneros con patrones nativos, conservando su ancla. No se cambió el nivel de salida para aparentar más calidad. Pruebas nuevas: `node tests/influence.mjs`, `node tests/patchgarden.mjs`, `node tests/contact.mjs`; navegador: `tests/influence_smoke.py`, `tests/pins_smoke.py`, `tests/patchgarden_smoke.py`, `tests/focusui_smoke.py`, `tests/contact_smoke.py`.

Las criaturas ya no se unen a la banda automáticamente con fijación apagada. Fijar sonidos permite acompañantes musicales; tocar una figura de la banda con aro azul suelta esa voz. Desactivar fijación también suelta la banda. Las voces de criaturas no se duplican en un eco automático y la banda. Su contacto distingue entrar de permanecer; pueden responder espontáneamente como parte del ambiente sin convertirse en acompañantes.

Validación de esta entrega: 37 suites de Node, 22 flujos de navegador y 19 renders de mezcla. Evidencia y límites en [REVISION_INTERACCIONES.md](REVISION_INTERACCIONES.md).

### Interfaz sin notas decorativas

Rama `fix/13-silent-interface`. Botones, Voz y campos no activan el teclado de movimiento ni pulsos; un arrastre sobre texto del HUD solo inicia música cuando se convierte en movimiento real. Soltar sobre interfaz no lanza pulso. Se retiró el arpegio automático de entrada al Mundo y activar Prototipo no inicia audio. Los controles de instrumentos/efectos y el lienzo mantienen sus acciones musicales explícitas. Prueba de teclado en botones, cambios de ajustes, entrada sin jingle y pulso desde canvas.

### Laboratorio de semillas completas

Rama `feat/14-seed-laboratory`. Menú → Prototipo → Semillas permite elegir texto, presets, otra semilla, volver al centro o regresar a Mi partida. Cada semilla reconstruye bioma inicial, música, escala, patrones, criaturas, terreno, atmósfera y continentes; no solo teletransporta a otro género. El centro es tierra segura. Se recarga el contexto para no mezclar cachés/sonidos de dos mundos. Las pruebas tienen guardados separados por semilla y no sobrescriben favoritos ni progreso habitual. El Camino diario conserva su generador. Las semillas de prueba entran al Mundo sin completar el día; no es un desbloqueo de la partida principal. Esta rama aún no dibuja blobs nuevos: llegan en la siguiente unidad.

### Blobs y espacios que respiran

Rama `feat/15-spacious-blob-worlds`. Las semillas de prueba usan biomas de 7200 unidades de ancho (antes 3600); Espacio → Clásico permite comparar y conserva un guardado distinto. El mapa habitual conserva coordenadas. La escena reduce vegetación/fauna/props/juguetes con selección determinista y referencias a los mismos objetos: no cambia IDs ni consume el RNG original, no afecta reliquias, portales ni instalaciones, y Escuchar usa los objetos visibles. Voces ambientales responden menos a menudo y solo un cantor se superpone. Semillas blobs generan habitantes de cuerpos suaves, rasgos distintos y voces graves/medias/percusivas del género; también hay hábitats de blobs dispersos. Dos o tres habitantes cerca del centro permiten probar de inmediato sin llenar el paisaje. No se fuerza agudo y se conserva afinación/tempo regional. Centro seguro, guardados por semilla y layout, vuelta a Mi partida. Validación de generaciones, aislamiento y síntesis de voces en 23 renders.

Para comparar mundos completos: **Menú → Prototipo → Semillas → Blobs I / Blobs II**, con Espacio Amplio o Clásico. Hay habitantes cerca del centro para probar sus voces; **Mi partida** vuelve a tu guardado habitual. Detalle en [MUNDOS_SEMILLAS.md](MUNDOS_SEMILLAS.md).

## Contenido de esta agrupación

- **Fase 1: Base creativa.** Recorrido Camino → Mundo → Estudio, pistas de gestos, sustracción y aros/prismas modelables.
- **Fase 2: Exploración con sentido.** Retos abiertos, capacidades de reliquias, pistas, Voz contextual y modo de creación sin gasto de linterna.
- **Fase 3: Primeros cinco encuentros.** Nubes, tejedoras, pozos de silencio, semillas orbitales y piedras de capas; selector de pruebas en Semillas.
- **Fase 4: Otros cinco encuentros.** Animales de intercambio, corrientes reversibles, flores de presión, esculturas de sombra y cajas de posibilidades.
- **Fase 5: Pulido final.** Paletas de 52 estilos, densidad musical, prioridad del borrado, accesibilidad, móvil y shell offline completo.

</details>
