# Cambios recientes de Kubono

Estado: 6 de noviembre de 2026. Código **2.3.0-alpha.276** en `main` `968d596` (PR #415); la rama `jay/main-verde-2` repara su CI. Las entradas describen su revisión, no certifican producción.



## CI rápido 2

Rama `jay/ci-rapido-2`, desde `main` `238ce75` (PR #417). Jay aprobó los cuatro cambios («dale»). Objetivo: un PR normal en 5–10 min en vez de 25–40, sin perder el catálogo completo en la cola, la nocturna y (hasta encender la cola) `main`. Guía: [Verificación](docs/VERIFICACION.md#ci). Sin cambios en el juego ni en la versión.

- **Runs viejos cancelados.** Un push nuevo al PR cancela el run en curso. `main`, la cola, la nocturna y los manuales no se cancelan.
- **Cola de fusión.** El workflow acepta `merge_group` y allí corre el catálogo completo. Con la variable `MERGE_QUEUE=on`, un push a `main` corre solo `logic`. Hasta que Jay encienda la cola y la variable, `main` no cambia. Pasos en la guía.
- **Versión solo al publicar.** Las ramas ya no suben la versión; CAMBIOS usa el título de la tanda (`AGENTS.md`). Si un diff solo mueve las cadenas de versión, `flow_impact.py` no elige recorridos por esos archivos. Cada despliegue de Vercel sigue sellando su revisión en la caché del service worker.
- **Imagen de Playwright.** Navegador y audio corren en `mcr.microsoft.com/playwright/python:v1.64.1-resolute` (Ubuntu 26.04, como el runner), con Chromium ya instalado. Se quita `playwright install --with-deps` y `setup-python`; se instalan git y DejaVu.
- **El CI no usaba el Chromium fijado.** `scripts/run-browser-tests.py` toma primero `/usr/bin/chromium`, y el runner trae uno (156.0.8078.0). El Chromium 151 de Playwright 1.62.0 se bajaba y no se usaba. En la imagen 1.62.0 corría ese 151, y «Bitácora» se partía en dos líneas: el menú de 844×390 bajaba 13 px (`menus_size844_smoke.py`, el único fallo de 282 recorridos y 72 renders, runs 42285831734 y 42293289525). Las fuentes no eran la causa: con DejaVu instalado, el mismo fallo. Un diagnóstico temporal en CI (run 42299277589, ya retirado) midió el menú en los dos: mismas fuentes (Geist Mono y DejaVu Sans Mono para ★); solo cambia el navegador. Playwright sube a 1.64.1, que trae Chromium 156.0.8078.4 (`requirements-dev.txt`, `tests/requirements.txt`).
- **`browser-audio` ya no deja pasar rojos.** En ese run el grupo 5 falló y el check salió verde: `bash -e` ignoraba el fallo dentro de `a || { b && c; }`. Ahora sale con `exit 1` explícito, y `tests/flow-impact.mjs` prueba cada resultado. El fallo venía de `main`: un check verde anterior pudo esconder un grupo rojo.
- **Pruebas.** `tests/flow-impact.mjs` (nuevo): un bump real de `bump-version.mjs` no elige recorridos, un cambio real en `index.html` o `sw.js` sí pide todo, y la imagen sigue la versión fijada. `npm test`, `node scripts/release-audit.mjs`, `node scripts/stale-text-check.mjs --base 238ce75`; YAML validado; prueba en seco de `flow_impact.py` sobre un commit de solo versión (0 recorridos). Sin recorridos de navegador en local.
- **CI.** Primer run en la imagen (42285831734, `332a83d`): la imagen baja en unos 25 s por trabajo; 19 de 20 trabajos en verde, todo en 36 min de reloj. Los grupos de navegador tardaron 12–16 min y los de audio 7–10.
- **Límites.** La imagen 1.64.1 aún no ha corrido el catálogo en CI. En un Chromium 151 el menú de 844×390 sí baja 13 px; eso queda en el juego. Las fuentes del sistema de la imagen pueden diferir del runner; el juego usa sus propias fuentes. Sin PR: los cambios de workflow los fusiona Jay.

## Listo 5: landing, privacidad, prensa y tráiler · sitio y documentos

Rama `jay/listo-5`, desde `main` `968d596` (alpha.276). Sin cambios en el juego ni en la versión. Guía: [Material de tienda](docs/TIENDAS.md#sitio-landing-privacidad-y-prensa).

- **Sitio estático en `site/`** (D10, D11), en español e inglés: landing, privacidad y prensa. Negro puro, esquinas rectas y Geist Mono local. Sin scripts, cookies ni peticiones externas. Unos 650 KB.
- **Privacidad** generada desde la parte pública de [Privacidad](docs/PRIVACIDAD.md) con `scripts/site-build.mjs`. Los huecos [NOMBRE LEGAL], [CORREO] y [FECHA] se ven recuadrados.
- **Fuera del juego.** No entra en `sw.js`, itch.io, Android ni escritorio. Vercel lo sirve en `/site/`; `playkubono.com` irá en un proyecto aparte.
- **Tráiler** (D09): `scripts/trailer.py`, 37 s, ES/EN, horizontal y vertical, con el sonido de los clips. −15,9 LUFS; pico real −1,8 dBTP o menos. Los vídeos quedan fuera de Git.
- **Pruebas.** `tests/site.mjs`. `npm test`, `node scripts/release-audit.mjs`, `node scripts/stale-text-check.mjs --base 968d596`. Capturas sin cabeza a 390 y 1280 px.
- **Límites.** Nada publicado. Nadie ha visto el tráiler entero ni lo ha oído. Faltan dominio, editor, correo, fecha, precio y enlaces.

## Main en verde tras el sonido pro 5 · 2.3.0-alpha.276

Rama `jay/main-verde-2`, desde `main` `968d596` (PR #415, fusionado sin CI). El CI de `main` (run 42264652501) falló en los navegadores 5, 6, 8 y 9. Solo cambian pruebas; ni código del juego ni versión.

- **`victory_live_smoke.py`** («close leaves the output alone»). El Jardín es IDM, ahora familia convertida: en su segundo compás, al conocerse la región, el motor pro baja el último recorte un 12 % (de 0,92 a 0,81). La prueba medía antes. Ahora mide desde el compás 2; la aserción sigue: el cierre no toca la salida.
- **`blobs_smoke.py`** («blob has no audible voice»). Con el motor pro, tus notas de un mismo golpe esperan a una microtarea para sonar juntas (acordes, alpha.270). La prueba contaba osciladores al momento; ahora cuenta tras esa espera.
- **`universe_layers_smoke.py`** (polvo ámbar 63 de más de 80) y **`synth_bank_smoke.py`** (`filterMotion` vacío). No se reprodujeron en `968d596`. El ámbar ya fallaba en `4e2fe11` con la CPU limitada ×4 (43 y 57 píxeles). Esperan el fotograma con polvo (hasta 6 s) y el movimiento de filtro de la criatura más cercana. Mismos umbrales.
- **Pruebas.** Antes de #415 (`4e2fe11`) pasan las dos primeras sin cambios; en `968d596`, fallan. Con la rama pasan las cuatro y los diez recorridos de sonido de esos shards. `npm test`, `node scripts/release-audit.mjs`, `node scripts/verify-e-preservation.mjs` y `node scripts/stale-text-check.mjs`.
- **Límites.** CI de la rama sin correr. Sin PR: la rama espera a Jay.

## Sonido pro 5: las nueve familias restantes · 2.3.0-alpha.276

Rama `jay/sonido-pro-5`, desde `main` `4e2fe11` (alpha.275). Último lote del plan aprobado («termina la última tanda de música»). Guía: [Sonido pro](docs/UNIVERSO.md#sonido-pro).

- **Los 52 géneros con el motor.** Disco y funk, UK y breaks, Club de bajos, DnB y dubstep, Hip-hop, Electro, Ambient, Jazz y Experimental: 30 géneros, cada uno con su kit. Mismo motor y mismos ganchos; tempo, swing, patrones, armonía, regiones y relevos de DJ no cambian.
- **Sonidos nuevos.** Bajo slap, reese, wobble (LFO a tiempo), boom de 808 con deslizamiento, contrabajo oscuro. Clavinet, metales, talkbox, vocoder y saxo de formantes (sin voces grabadas), lead de G-funk con portamento, campanas FM, nubes de granos. Phaser con flanger para las cuerdas de disco, bucle de filtro, saturación cálida en el deck, vinilo y cinta para lo-fi, caja con puerta para EBM, escobillas y ride para jazz, stutters sin azar para experimental.
- **Capa del pulso.** Donde el bombo no cae en cada pulso, los hats y cajas fantasma, el vinilo y la respuesta al jugador cuelgan del primer golpe de cada pulso.
- **Ambient y heart.** No tienen batería: el motor se crea con su primera nota (antes solo con un golpe). Heart toca el stab de dub en el motor.
- **Tu interacción.** `front` entre 0,68 y 0,8 y una respuesta al groove por familia. «Sonido clásico» apaga también estas familias.
- **Sin `audio.js` nuevo.** Nada nuevo en pantalla ni en ajustes. Las cinco familias anteriores suenan igual: los golpes compartidos son idénticos muestra a muestra (caja incluida, ahora afinable por kit).
- **Renders** (motor real, offline, 44,1 kHz, 36 s, un género por familia; `sonido-pro-5/final/`, fuera de Git). LUFS / dBTP del MP3: nudisco −9,2 / −1,2; garage −9,8 / −1,1; ghetto −9,2 / −1,3; dnb −9,5 / −1,8; boombap −9,2 / −1,8; electro −9,6 / −1,4; ambient −14,1 / −1,2; jazztronica −10,3 / −1,9; idm −10,4 / −1,4. Cuatro MP3 llevan un recorte de 0,45–1,1 dB para quedar en −1 dBTP tras codificar. El nivel de cada género se calibró con renders de 16 s de los 30.
- **CPU.** Nodos creados por segundo (todo el juego, render): de 22 (ambient) a 155 (electro, dnb y algorave); los lotes anteriores llegaban a 189. No se midió en teléfono.
- **Pruebas.** `tests/sound-pro.mjs`: los 30 perfiles, los golpes nuevos, cada golpe con el azar clásico, cada bajo y cada voz nuevos, el deslizamiento del 808, la capa del pulso, los stutters, ambient sin batería, tus voces y «Sonido clásico». `npm test`, `node scripts/release-audit.mjs`, `node scripts/stale-text-check.mjs --base 4e2fe11` y `node scripts/verify-e-preservation.mjs`. Sin recorridos de navegador en local.
- **Límites.** Nadie lo ha escuchado. Medido solo con LUFS, true peak y bandas. Boom bap y lo-fi quedan oscuros (su composición no trae hats). DnB brilla arriba por la caja. Ambient suena solo cuerdas en 36 s. CPU de teléfono sin medir. Sin PR: la rama espera a Jay.

## Listo 3: pestañas enteras, la frase del Refugio y una ronda jugada en los medios · 2.3.0-alpha.275

Rama `jay/listo-3`, desde `main` `662bf57`. Tres detalles que Jay aprobó tras generar los medios de tienda. Guías: [Material de tienda](docs/TIENDAS.md), [Traducción](docs/TRADUCCION.md), [Casa viva](docs/CASA_VIVA.md).

- **Pestañas de la Bitácora enteras.** En inglés, a 360 px, «Achievements» se partía («Achievemen/ts»); a 320 px, también «Colección» y «Collection». Ahora ningún nombre se corta. En teléfono son tres columnas que toman el ancho de su nombre más largo; en pantallas anchas, una fila de seis. Mismos textos y mismos ID. Comprobado en ES/EN a 320, 360, 390, 600, 601, 800 y 1280 px.
- **La frase del Refugio, entera.** La Voz del Refugio («Tu Refugio viaja contigo. Se abre donde estés.») admite tres líneas en vez de dos. En una franja horizontal estrecha (640×360) el inglés ocupa tres y ya no se corta. En la captura de escritorio se veía a medio escribir: el script ahora espera a la frase entera.
- **Ronda jugada en los medios.** En `scripts/store-media.py`, la captura `ronda` suena y se juega: el Lago canta su compás y el cubo pulsa en sus pasos con el pulso del juego (`runtime.sonar`, el de la barra espaciadora). La Línea y el cubo muestran los aciertos. Nuevo clip `clip-ronda-vertical-es` y `-en`. Sin cambios en la interfaz.
- **Sin dB en el Mundo abierto.** Al revisar las capturas, el rótulo de un sonido cercano decía «Bajo · Filtro 24 dB» («Bass · Filter 24 dB»). En un guardado del mundo abierto (sin Viaje ni Camino) dice «Bajo · Filtro»; los guardados con Viaje o Camino lo conservan (`feedback.js`).
- **Preservación.** Capa `approvedLISTO3` (`c3670d9`) en `verify-e-preservation.mjs` para `feedback.js` y `scanner.js`; sin archivos de música.
- **Escáner sin textos montados.** En inglés, dos nombres del escáner se pisaban («Light · 11 m» junto a «Light · 13 m»): las marcas se separaban por el largo del nombre en español. Ahora se separan por el nombre tal como se escribe (`scanner.js`); en español no cambia nada. Mientras se mantiene el dedo, la línea del objetivo («Tormenta · más lejos · 3 km») se aparta, como ya hacían los avisos, y vuelve al soltar.
- **Medios.** El aviso de zona pasajero se oculta en las capturas, como los demás avisos. En teléfono, la frase del Refugio tapa el nombre de una sala: allí la captura espera a que se haya leído.
- **Pruebas.** `tests/listo3_layout_smoke.py`: pestañas en una línea, sin desbordar, ES/EN a 320, 360, 390 y 1280 px; la frase del Refugio entera a 640×360, 1280×720 y 320×568; la línea del objetivo apartada durante el escaneo. `tests/feedback.mjs`: el rótulo sin dB en el mundo abierto y con dB tras el Viaje.
- **Límites.** Medios regenerados fuera de Git. No probado en teléfono ni con personas.

## Listo 2: sin verbos de compra, Ámbar sin Camino, Android sin red y medios de tienda · 2.3.0-alpha.274

Rama `jay/listo-2`, desde `main` `496eb6d`. Preparación de venta que Jay aprobó. Guías: [Tienda del cubo](docs/TIENDA_DEL_CUBO.md), [Mundo](docs/MUNDO.md), [Privacidad](docs/PRIVACIDAD.md), [Material de tienda](docs/TIENDAS.md), [Android](android/README.md).

- **Piezas sin verbos de compra.** En Tu cubo, «Comprar» pasa a «Cambiar ✦» («Trade ✦»); «Compraste …», a «Conseguiste …» («You got …»); «Comprado N», a «Con chispas N» («With sparks N»); «Compra permanente», a «Para siempre» («Yours to keep»); «Voz comprada», a «Voz de chispas» («Spark voice»). «Cómo jugar»: las chispas «se cambian por apariencias y saltos» y «cada apariencia se consigue una sola vez». Mismos ID. Las fichas dicen «a cambio de chispas» («traded for sparks»).
- **Ámbar sin Camino.** Un guardado del mundo abierto gana Ámbar al completar tres lugares (★ en tres de los once). Lo da `migrateRewards` al guardar; la pista dice «Completa tres lugares.». `tope` sigue dándolo a cualquier guardado, con su fecha; un guardado del Viaje solo tiene esa ruta. Sin RNG.
- **Android sin `INTERNET` en la edición de venta.** Con `KUBONO_EDITION=store`, `android/app/src/store/AndroidManifest.xml` quita el permiso al fusionar el manifiesto. El juego se sirve desde el APK (`WebViewAssetLoader`) y los enlaces se abren fuera. La vista previa con cuenta lo conserva para su nube.
- **Medios de tienda.** `scripts/store-media.py` parte de un guardado nuevo del mundo abierto (`?abierto=1`): ocho escenas (inicio con la guía, escáner, portal, ronda, hoja de ★, Tu cubo, Bitácora, Refugio) en cinco tamaños, en español e inglés; clips del Mundo en los dos idiomas. Siguen fuera de Git.
- **Preservación.** Capa `approvedLISTO2` (`03d2200`) en `verify-e-preservation.mjs` para seis archivos protegidos que cambian (`cube.js`, `i18n-en.js`, `journal-model.js`, `rewards-model.js`, `sparks.js`, `wardrobe-model.js`); sin archivos de música.
- **Pruebas.** `tests/wardrobe.mjs` (Ámbar: tres lugares sí, dos no, Viaje solo con `tope`, fecha de `tope`, pista) y `tests/sale-edition.mjs` (manifiesto de venta sin `INTERNET`). En local: `npm test`, `node scripts/release-audit.mjs`, `node scripts/stale-text-check.mjs --base 496eb6d`, `node scripts/verify-e-preservation.mjs` y, uno a uno, los recorridos que tocan estos textos y módulos: `cube_shop`, `wardrobe`, `rewards`, `sparks_economy`, `cube_editor`, `cube_face`, `cube_moves`, `cube_skills`, `cube_sound`, `cube_trails`, `cube_wild`, `game_loop`, `house_collection`, `house_walk`, `mundo_abierto`, `english_menus`, `english_panels`, `english_screens`, `journal_v2` y `journal_entry`. Todo en verde. `store-media.py` corrió entero: 80 capturas, 4 iconos, 6 gráficos y 5 clips.
- **Límites.** El APK de venta sin `INTERNET` no se ha compilado ni abierto en un emulador: aquí no hay SDK de Android. No probado en teléfono ni con personas.

## Listo 1: primer minuto del mundo abierto y fichas · 2.3.0-alpha.273

Rama `jay/listo-1`, desde `main` `2760513`. Arreglos que Jay aprobó tras la auditoría de venta del 6 de noviembre. Guías: [Primer minuto](docs/MUNDO.md#primer-minuto-del-mundo-abierto), [Material de tienda](docs/TIENDAS.md), [Privacidad](docs/PRIVACIDAD.md).

- **Guía del mundo abierto.** Solo para guardados que nunca tuvieron Camino. Un guardado nuevo empezaba en «4/6» y se quedaba en «Guarda con el marcador…», pasos del Camino. Ahora tiene seis pasos propios, desde 1/6: moverse, caminar hacia Llanura, seguir la flecha al portal, tocar a tiempo, la primera ★ y escanear. Avanzan con hechos reales y se conservan al recargar. El Viaje conserva sus seis pasos.
- **El objetivo a la vista.** «Llanura · más lejos · 0,5 km» ya no se oculta bajo la guía en el mundo abierto. El cubo no cambia.
- **Sin Camino que nunca existió.** Para quien nunca tuvo Camino: sin «Volver al Camino» en el menú; el grupo de logros «Camino» se llama «Días» (Bitácora y estante del Refugio); «tope» no se lista hasta ganarse; «Recuerdos del Camino» pasa a «Recuerdos del viaje». Los guardados con Camino lo conservan todo.
- **Cómo jugar.** Para quien no tuvo Camino: mundo abierto, escáner, lugares, rondas y chispas, sin cristales. Quien tuvo Camino conserva sus líneas.
- **Sin BPM ni dB a la vista,** en español e inglés: línea de la región, Bitácora, favoritos, la pieza «Pantalla» (solo el género) y dos notas de géneros.
- **«Tienda» pasa a «Piezas»** («Pieces») en Tu cubo, con sus textos (sin «tienda» ni «comprar en la tienda»). Mismos ID. Las chispas solo se ganan.
- **Fichas y legal.** Fichas ES/EN de Google Play e itch.io reescritas: mundo abierto, escáner, once lugares de 0,5 a 40 km, rondas, música que reacciona, más de 390 logros (395; 394 sin Camino), sin conexión, sin anuncios, sin compras dentro del juego, pago único, sin cuenta. El inglés ya no dice que el juego está en español. Privacidad nueva para esta edición (no se recoge nada), en español e inglés, con `[NOMBRE LEGAL]`, `[CORREO]` y `[FECHA]` para Jay. `LICENSE` cita la OFL 1.1 de Geist Mono; `CREDITOS.md` ya no habla de la cuenta.
- **Preservación.** Capa `approvedLISTO1` (`fa98bf5`) en `verify-e-preservation.mjs` para los diez archivos protegidos que cambian; los contratos musicales no cambian.
- **Pruebas.** `tests/onboarding.mjs` (guía abierta, Viaje intacto, `caminoPast`), `tests/region-notice.mjs` (sin BPM), `tests/mundo_abierto_smoke.py` (primer paso y «Volver al Camino»), `alive_smoke.py` y `house_collection_smoke.py` (textos nuevos). En local: `npm test`, `node scripts/release-audit.mjs`, `node scripts/stale-text-check.mjs --base 2760513` y `node scripts/verify-e-preservation.mjs`. Una comprobación en Chromium a 390×844, español e inglés, guardado nuevo sin parámetros: de 1/6 a 6/6 con una ronda simulada, sin errores. Recorridos de navegador sin correr en local; los corre el CI del PR.
- **CI del PR #411.** `after_journey_smoke.py` y `panel_polish_smoke.py` fallaban porque la guía y «Cómo jugar» nuevas también llegaban a guardados con Camino; ahora solo a los que no lo tuvieron. `viaje_a_smoke.py` fallaba también en `main` el 6 de noviembre: la boya del encargo cae, según el día, en el km 8, 9, 11 o 12 (`ordersFor`), y en el 12 el paseo alcanza el Hábitat. La prueba lo tiene en cuenta.
- **Límites.** No probado en teléfono ni con personas. Las capturas y clips de tienda siguen siendo de antes del mundo abierto (`store-media.py`): hay que rehacerlos. Siguen «Comprar» y «Compraste» con chispas dentro de Tu cubo. Ámbar (pide «tope») no se puede ganar sin Camino. El permiso `INTERNET` de Android sigue.

## Sonido pro 4: melodic y orgánico, afro y latino · 2.3.0-alpha.271

Rama `jay/sonido-pro-4`, desde `origin/jay/musica-interaccion` (PR #408 sin integrar). Cuarto lote del plan aprobado, dos familias en uno. Guía: [Sonido pro](docs/UNIVERSO.md#sonido-pro).

- **Dos familias más.** «Melodic y orgánico» (`melodic`, `organic`) y «Afro y latino» (`afro`, `amapiano`, `tribal`, `andean`). `andean` pasa de la primera a la segunda. Mismo motor y mismos ganchos; tempo, swing, patrones y armonía no cambian.
- **Melodic y orgánico.** Bombo suave y redondo, plucks al eco largo, pads anchos en la sala larga, percusión de mano y shakers delante, bombeo suave. Melodic: plucks (también el tine piano), pads que se abren cada 32 compases, el tom grave en la sala. Organic: el bombo más suave, congas con más cuerpo, cuerda pulsada (Karplus-Strong) y teclas cálidas.
- **Afro y latino.** Congas, toms, madera y shakers con cuerpo y sala. Afro: marimba, flauta y percusión. Amapiano: log drum como bajo (tambor afinado que cae sobre la nota, con golpe y saturación) y piano. Tribal: toms largos y golpes de formantes tipo canto, sin voz grabada. Andina: flauta de pan con aliento y vibrato, plucks de doble cuerda tipo charango (rasgueo en los acordes) y bombo legüero con parche.
- **Tu interacción.** `front` 0,7 en las dos familias. La capa de groove responde con su tambor (`answer`): conga, tom en tribal, madera en la andina. Tu bajo en amapiano suena como log drum.
- **Sin `audio.js` nuevo.** Nada nuevo en pantalla ni en ajustes. Las demás familias suenan igual: los toms y congas solo cambian de duración y van al eco en los kits que lo piden (`tomDecay`, `congaDecay`); el parche del bombo usa su propio azar.
- **«Sonido clásico»** también apaga estas familias. Guardado sin cambios (`S.soundPro` versión 1).
- **Renders** (motor real, offline, 44,1 kHz; directorio del lote `sonido-pro-4/`, fuera de Git): viaje de 90 s organic → andina → amapiano, clásico −15,5 LUFS / −1,2 dBTP y nuevo −9,5 / −1,7. 40 s de cada género: melodic −10,0 / −1,8, organic −10,1 / −1,6, afro −9,6 / −1,9, amapiano −9,7 / −2,0, tribal −9,4 / −1,9, andina −10,4 / −1,6.
- **CPU.** Nodos creados por segundo (todo el juego, render): viaje clásico 108, nuevo 96; quieto, melodic 84, organic 32, afro 77, amapiano 72, tribal 118, andina 34. No se midió en teléfono.
- **Pruebas.** `tests/sound-pro.mjs` amplía: las dos familias y sus seis perfiles, el bombo legüero y la cuerda pulsada (afinada), cada instrumento nuevo en el motor, el log drum, el rasgueo, la respuesta del groove, tus voces en estas familias, mezcla de DJ hacia y desde ellas, «Sonido clásico». `npm test`, `node scripts/release-audit.mjs`, `node scripts/verify-e-preservation.mjs` y `node scripts/stale-text-check.mjs --base origin/jay/musica-interaccion`. Sin recorridos de navegador.
- **Límites.** Nadie lo ha escuchado. Melodic queda oscuro en su render (poco por encima de 1 kHz; en 40 s casi no suena su melodía). El log drum suena en todo bajo de amapiano, también en `p_woodybass`. CPU de teléfono sin medir. Sin PR: la rama espera a Jay.

## Música e interacción · 2.3.0-alpha.270

Rama `jay/musica-interaccion`, desde `main` `cae66bb`. Jay (5 de noviembre): «La interacción mía con los elementos… siento que está menos que antes. La música debería depender más de mi interacción, pero tampoco como para perder la identidad.» Guía: [Sonido pro](docs/UNIVERSO.md#sonido-pro).

- **La causa, medida.** En las familias pro, lo que tocas seguía sonando con los sintes clásicos. La mezcla pro es 2,9 dB más fuerte que la clásica, y el recorte final de pico (−1,1 dB) baja también tus toques. En tech house, tus toques quedaban a −12,7 dB de la música; con «Sonido clásico», a −8,7. En la racha de pulsos, 5 dB por debajo del clásico. El pulso a tiempo (la nota del tema) ni siquiera pasaba por el motor: se toca fuera de toda voz.
- **Tus toques, con los instrumentos de la familia.** Toques, pulsos, respuestas de la onda y poderes (`player`, `field`) suenan en el motor: notas sueltas con la melodía de la familia (chop en tech, teclas o pads en house, stab o arpegio en techno), notas a la vez como acorde, bajo y percusión con su kit. Mismo tiempo (la rejilla de siempre), mismo tono, mismo azar. Salen por el bus que les dio el juego (distancia, efectos), fuera del sidechain y del agache de los gestos.
- **El tema a tiempo rebota en el eco.** Sus tres notas van al eco de la familia; con racha, también a la sala larga (y a la cinta en techno).
- **El arreglo te responde, dentro de la composición.** Tu influencia sobre el lugar (`influence.js`), lo que has tocado en los últimos segundos, la racha y caminar: abren o cierran el filtro de pads, cuerdas, arpegios y stabs; suben hats y hats fantasma; añaden un shaker a contratiempo y, más arriba, una conga. Cada cuatro pulsos seguidos a tiempo, riser sobre el compás, palmas de relleno y platillo. Mismo tempo, armonía y patrones.
- **Quieto, nada cambia.** Sin jugador, cada factor es neutro: el render quieto queda a −70 dB de `main` (redondeo).
- **Nivel por familia.** Medido contra cada mezcla: tech 0,3, house × 0,75, techno × 0,6 (`front` en `sound-profiles.js`).
- **Sin `audio.js` nuevo.** Todo entra por los ganchos ya aprobados (`PRO1_LINES`). Nada nuevo en pantalla ni en ajustes. «Sonido clásico» lo apaga todo. Las once familias clásicas no cambian.
- **Renders** (motor real, offline, 44,1 kHz; directorio del lote `musica-interaccion/`, fuera de Git): A/B de 60 s con un jugador simulado. Toques frente a la música: tech house −12,7 → −7,0 dB, deep −3,1 → −3,2 dB (ya alto; ahora en la paleta), melodic techno −11,1 → −5,7 dB. LUFS / dBTP después: −9,7 / −1,3, −10,6 / −1,4, −9,3 / −1,5. Quieto en tech house, −9,8 / −1,3.
- **CPU.** Nodos creados por segundo (todo el juego): tech house 149 → 162, deep 123 → 134, melodic techno 151 → 177 tocando; quieto, igual. No se midió en teléfono.
- **Pruebas.** `tests/sound-pro.mjs` amplía: toques en el motor y en el bus del toque, acorde, bajo, percusión y sus sorteos, `field`, el tema y su eco, familias clásicas y «Sonido clásico», filtro que se abre y se cierra, capa de percusión, racha con riser y su ruptura, y el quieto idéntico. `tests/audio_mix.mjs` acepta `playerBatch` ('on' o 'silent'). `npm test`, `node scripts/release-audit.mjs` y `node scripts/stale-text-check.mjs --base origin/main`. Sin recorridos de navegador.
- **Límites.** Nadie lo ha escuchado. El pulso a tiempo está simulado en el render. Pasar junto a elementos solo suena distinto si el juego ya lo tocaba como toque del jugador. CPU de teléfono sin medir.

## Directo mundo abierto · 2.3.0-alpha.269

Rama `jay/mundo-abierto`, desde `main` `372419e`. Jay (5 de noviembre): «Quitemos Llanura… de una vez al mundo abierto. No debe aparecer el anillo. Directo mundo abierto.» Guía: [Directo mundo abierto](docs/MUNDO.md#directo-mundo-abierto).

- **Empiezas en el Mundo.** Un guardado nuevo entra al Mundo al cargar: sin Camino, sin Viaje, sin capítulo de la Llanura y sin ventana. Vista completa. El radar empieza en el nivel 1. La línea bajo el HUD dice «Llanura · más lejos · 0,5 km».
- **Los once por distancia.** La Llanura es un lugar más, el primero, a 0,5 km. Tabla sin cambios: 0,5 · 1 · 2 · 3 · 5 · 8 · 12 · 17 · 23 · 30 · 40 km. Cada portal aparece delante al cruzar su distancia a pie; la flecha `lugar` apunta al siguiente sin ★; Lugares dice «Más lejos · X km» antes.
- **Sin anillo.** Ni portales en anillo, ni centro, ni «Volver al anillo» (Lugares, mapa, satélites), ni brújula de lugares. `#lugaresRing` sigue en la página, oculto. El mapa llama «Cerca» a su acercamiento más próximo, centrado en ti. El Duelo final pasa al origen; desde un satélite, «Volver al origen».
- **El progreso se conserva.** `S.lugares` pasa a la versión 4: cada lugar ganado del anillo (y cada capítulo guardado) va a su distancia, en la dirección de su ángulo antiguo, guardado y visitable. Estrellas, récords, notas, rondas, `seen`, `kept`, `won`, `master` y `credited` se quedan. El Viaje no cambia de formato: `open` (sin Viaje) y, si el Mundo se dio al empezar, `freeGiven`. A mitad del Viaje: Mundo libre con capítulos, notas y colores.
- **Reapuntado.** Radar por trofeos (nivel 2 con el primero; nadie baja). Reto entre dos, salto «Otro paisaje» y su primer salto gratis, la primera media hora y la vista tranquila: ya no esperan al Viaje terminado. El final de los once y sus créditos no cambian; el final del Viaje queda para el festival y las pruebas.
- **El Viaje se conserva para pruebas.** `?festival=1`, `?capitulo=`, `?viaje=1`, `?testSeed=` y `?lab=1` empiezan como antes, igual que los navegadores automatizados sin `?abierto=1`.
- **Pruebas.** Nuevas: `tests/mundo_abierto.mjs` y `tests/mundo_abierto_smoke.py` (ejecutada en local, 390×844 y 1280×800). Reescritas a la regla nueva: `places-ring.mjs`, `lugares-encuentran.mjs`, `places.mjs`, `recorrer.mjs`, `universe-map.mjs`, `lugares_encuentran_smoke.py`, `ring_smoke.py`, `ritmo_duelo_smoke.py`, `recorrer_smoke.py`, `arreglos_ae_smoke.py`, `universe_map_smoke.py`, `universe_map_mark_smoke.py`, `universe_map_english_smoke.py`, `compass_handoff_smoke.py`, `sale_edition_smoke.py`. Con `?viaje=1`, porque prueban el Viaje: `journey_entry_smoke.py`, `free_world_return_smoke.py`, `player_touch_smoke.py`, `notas_jay_smoke.py`, `sky_map_halo_smoke.py`, `live_do_c_smoke.py`, `live_flee_c_smoke.py`, `rapido2_viaje_smoke.py`. Ninguna desactivada. `npm test`, `node scripts/release-audit.mjs` y `node scripts/stale-text-check.mjs --base origin/main`. Los demás recorridos de navegador no se ejecutaron en local (regla rápida): los corre el CI.
- **Arreglos del CI (PR #406).** Arranque abierto sin el saludo de vuelta: el primer toque cae en el Mundo y enciende el sonido. «Continuar» del saludo también lo enciende: con el Mundo libre para todos, suele ser el primer toque de una visita (lo pide `itch_package_smoke.py`). Lugares es una columna: solo la lista cede altura y «Cerrar» queda entero en 390×844 (`arreglos_ae_smoke.py`; las reglas de «Volver al anillo» se van). Con `?viaje=1`, porque prueban el Viaje: el dedo de `beat_by_cube_smoke.py` y el capítulo de `live_encounters_smoke.py`. Preservación: capa nueva al commit de código de `jay/arreglos-main` (desde `main` `cae66bb`) para `main.js`, `return-entrance.js` y `pet.js` (`state.heard` de PR #404 llegó tras cortar la capa del mundo abierto). Los cuatro recorridos, `verify-e-preservation.mjs`, `npm test`, `release-audit` y `stale-text-check`, en local.
- **Main en verde (tras PR #407).** «Continuar» del saludo enciende el sonido solo con un dedo real (`isTrusted`): un clic de script no es gesto, así que menús, Diario y cubo siguen sin audio (`journal_v2`, `journal_scale`, `reactive_ecology`, `cube_editor`). Lugares se alinea dos veces: las pistas de desplazamiento restan altura a la lista; la segunda pasada fija filas enteras y, si no caben la anterior y la siguiente, abre en la siguiente (`clean_screens`, `polish_navigation`). Preservación: capa `approvedFIX2` al commit de código. En local.
- **Límites.** Nadie lo ha jugado. Sin teléfono ni personas. Sin `audio.js` ni música.

## Sonido pro 3: techno · 2.3.0-alpha.268

Rama `jay/sonido-pro-3`, desde `origin/jay/sonido-pro-2` (PR #403 sin integrar). Tercer lote del plan aprobado. Guía: [Sonido pro](docs/UNIVERSO.md#sonido-pro).

- **Tercera familia: techno** (`dub`, `acid`, `minimaltechno`, `detroit`, `melodictechno`). `melodictechno` pasa de «Melodic y orgánico» a esta familia. Mismo motor y mismos ganchos; tempo, swing, patrones y armonía no cambian.
- **La familia.** Bombo con rumble (cola con paso bajo, saturada y bombeada por el siguiente bombo), bajo en sub y medio con sidechain más hondo, pads y stabs anchos, sala larga, eco en ping-pong y un eco de cinta nuevo (oscuro, saturado, con vaivén). Toda la melodía.
- **Un toque por género.** Dub: stabs al eco de cinta y sala brumosa, sub profundo. Acid: 303 más duro que el de acid house (resonancia 20, más saturación, acentos y slides) y bombo con más pegada. Minimal: seco y corto, bombo de clic, casi sin sala ni eco. Detroit: cuerdas de cuatro sierras, hats 909, acordes tipo Rhodes. Melodic: arpegios anchos y pads que se abren en cada frase de 32 compases.
- **`audio.js`: una línea más, por revisar.** Commit aparte «audio.js lines for Jay's approval»: el stab de `dubChord` pregunta antes al motor, nota a nota, con las mismas notas y sin azar; sin el motor suena el stab de siempre. Heart (ambient) sigue clásico. La preservación la admite exactamente (`PRO3_LINES`). Ningún otro archivo protegido cambia.
- **Transiciones.** Las de DJ ya funcionan dentro, hacia y desde la familia: el bombo de techno y su rumble caen el último medio compás antes del relevo, y el bajo descansa.
- **«Sonido clásico»** también apaga techno. Guardado sin cambios (`S.soundPro` versión 1).
- **Renders** (motor real, offline, 44,1 kHz; directorio del lote `sonido-pro-3/`, fuera de Git): viaje de 90 s melodic techno → acid → detroit → dub, clásico −12,0 LUFS / −0,5 dBTP y nuevo −9,3 / −1,0. 40 s de cada género: dub −9,9 / −1,9, acid −8,4 / −1,5, minimal −9,5 / −1,6, detroit −9,0 / −1,1, melodic −9,9 / −1,7.
- **CPU.** Nodos de Web Audio creados por segundo (todo el juego, render): viaje clásico 159, nuevo 189; quieto, dub 41, acid 159, minimal 94, detroit 109, melodic 82. No se midió en teléfono.
- **Pruebas.** `tests/sound-pro.mjs` amplía: la familia y sus cinco perfiles, el rumble, el stab de dub (sin contar como instrumento), el 303 más resonante, cuerdas y arpegios, la apertura de melodic, mezcla de DJ de techno a house, «Sonido clásico». `npm test`, `node scripts/release-audit.mjs` y `node scripts/stale-text-check.mjs --base origin/jay/sonido-pro-2`. Sin recorridos de navegador, por la regla rápida.
- **Límites.** Nadie lo ha escuchado todavía. En el render de dub la composición no llega a tocar su acorde de dub (energía baja en 40 s): los stabs son la melodía. El limitador de `audio.js` fija el volumen final; el nivel del deck mueve poco el LUFS. CPU de teléfono sin medir. Sin PR: la rama espera a Jay.


## Pruebas estables: mascota y escáner (sin subir versión)

`main` salió en rojo por dos recorridos que leen el juego mientras sigue vivo.
- `pet_smoke`: la frase puede cambiar si la mascota oye otra nota del jugador cerca; la prueba exige que nunca aprenda su propia frase (`petState.heard` guarda la última nota oída y su tiempo).
- `escaner_nms_smoke`: `elementBook` y `cat` pueden crecer mientras el mundo suena; escanear no debe borrar ni cambiar nada de lo que había. El resto se compara igual que antes.

## Sonido pro 2: house clásico · 2.3.0-alpha.267

Rama `jay/sonido-pro-2`, desde `main` `ff8f5d8`. Segundo lote del plan aprobado. Guía: [Sonido pro](docs/UNIVERSO.md#sonido-pro).

- **Segunda familia: house clásico** (`deep`, `chicago`, `soulful`, `garagehouse`, `acidhouse`, `progressive`, `tropical`). `tropical` pasa de «Melodic y orgánico» a esta familia, como pidió Jay. Mismo motor y mismos ganchos; tempo, swing, patrones y armonía no cambian.
- **La familia.** Cálida donde el tech es seco. Toda la melodía (el tech suena la mitad), tocada según el instrumento que eligió la composición: órgano de registros, teclas tipo Rhodes, mazos, pads o supersierra. Acordes anchos en una sala larga nueva, bombeo más suave, bajo en sub y medio con sidechain. Cada deck sale a 0,8 del nivel del tech para la misma sonoridad.
- **Un toque por género.** Deep: bombo suave y redondo, acordes de pad cálidos. Chicago: bombo 909 crudo (más clic y saturación), hats brillantes, palma seca y stabs brillantes. Soulful y garage: acordes de órgano, hats fantasma con el shuffle del género. Acid house: línea ácida de 303 en la voz del bajo (sierra, filtro resonante con envolvente, acentos y slides fijos por paso, sin azar, y un ciclo de filtro de 16 compases). Progressive: pads y lead que se abren a lo largo de cada frase de 32 compases. Tropical: mazos tipo marimba, más sala y eco, bombo suave.
- **Acordes sobre el instrumento de la melodía.** En house, las notas que suenan a la vez que una nota de la melodía, con su mismo instrumento, suenan como acorde. El tech no cambia.
- **`audio.js`: una línea más, por revisar.** Commit aparte «audio.js lines for Jay's approval»: el acorde de órgano de deep y progressive (`organChord`) pregunta antes al motor, con la misma nota y el mismo azar; sin el motor suena el órgano de siempre. Sin esa línea, esos acordes siguen con el órgano clásico. La preservación la admite exactamente (`PRO2_LINES`). Ningún otro archivo protegido cambia.
- **Transiciones.** Las de DJ ya funcionan dentro, hacia y desde la familia: el bombo de house también cae el último medio compás antes del relevo, y el bajo descansa.
- **«Sonido clásico»** también apaga house. Guardado sin cambios (`S.soundPro` versión 1).
- **Renders** (motor real, offline, 44,1 kHz; directorio del lote `sonido-pro-2/`, fuera de Git): viaje de 90 s soulful → deep → tropical → jazztronica, clásico −11,4 LUFS / −1,2 dBTP y nuevo −10,9 / −1,1. 40 s de cada género: deep −10,3 / −1,6, chicago −9,0 / −1,4, soulful −9,4 / −1,3, garage −8,9 / −1,5, acid −9,3 / −1,5, progressive −8,7 / −1,8, tropical −9,6 / −1,7.
- **CPU.** Nodos de Web Audio creados por segundo (todo el juego, render): viaje clásico 151, nuevo 145; quieto, deep 71, chicago 122, soulful 99, garage 70, acid 141, progressive 97, tropical 77. No se midió en teléfono.
- **Pruebas.** `tests/sound-pro.mjs` amplía: la familia y sus siete perfiles, la línea ácida (sierra resonante y slides), cada tipo de voz, el acorde de órgano, la apertura de progressive, mezcla de DJ de house a tech y vuelta, «Sonido clásico». `npm test`, `node scripts/release-audit.mjs` y `node scripts/stale-text-check.mjs --base origin/main`. Sin recorridos de navegador, por la regla rápida.
- **Límites.** Nadie lo ha escuchado todavía. En garage los acordes de órgano quedan bajos y estrechos al principio del render (el patrón los toca con energía alta). CPU de teléfono sin medir. Sin PR: la rama espera a Jay.

## Sonido pro 1: tech house y minimal · 2.3.0-alpha.266

Rama `jay/sonido-pro-1`, desde `main` `5d211f5`. Plan aprobado por Jay (5 de noviembre): la música del universo como electrónica profesional de 2026, sin perder los 52 géneros, sus tempos, ritmos, armonía ni regiones. Guía: [Sonido pro](docs/UNIVERSO.md#sonido-pro).

- **Un motor compartido.** `sound-profiles.js` (catorce familias de sonido para los 52 géneros, perfiles, ajuste y plan de transiciones) y `sound-pro.js` (el motor). Ambos una vez en `SHELL`. La composición no cambia: `audio.js` decide cada golpe y cada nota y pregunta al motor antes de sonar.
- **Primera familia: tech house y minimal** (`techhouse`, `minimal`, `rominimal`, `microhouse`), en la dirección del 08. Batería por capas sintetizada una vez en buffers, bajo partido en sub y medio con sidechain, chops vocales sintéticos y stabs abiertos, la mitad de la melodía, sala generada, eco en ping-pong, pegamento y saturación. Mismos golpes, mismas velocidades relativas y el mismo azar que el sonido clásico. Se añaden hats fantasma suaves en las semicorcheas impares.
- **Las otras trece familias** suenan como siempre hasta su lote.
- **Cambios de región como un DJ.** Desde las señales del viaje (`territory-journey.js` no cambia): la región que llega entra filtrada y sin graves, riser dos compases antes, sin bombo el último medio compás, impacto en el relevo y cambio de graves. Platillo cada 16 compases y barrido en el último de cada 32. Solo si una de las dos regiones es de una familia convertida.
- **«Sonido clásico»** en Sonido › Avanzado (`#classicSound`), apagado por defecto. `S.soundPro` `{version:1,classic}` se normaliza al leer, sin borrar nada; si el guardado falla, vuelve atrás.
- **`audio.js`, línea a línea.** Commit aparte «audio.js lines for Jay's approval»: once golpes de la batería, el bajo y la melodía preguntan al motor; `drums()` dice de qué género es cada golpe; el techo de confort puede subir a 16 kHz bajo una familia convertida. Sin el motor, todo suena como antes. La preservación (`approvedPRO1`) admite exactamente esas líneas.
- **Preservación:** capa `approvedPRO1` (`8d6cee8`, el commit de código: `main.js`, `i18n-en.js` y la lista offline de `sw.js`); `audio.js` debe ser el aprobado más exactamente las líneas de `PRO1_LINES`.
- **Renders** (motor real del juego, offline, 44,1 kHz): viaje de 90 s tech house → minimal → microhouse → rominimal, clásico −12,1 LUFS / −1,2 dBTP y nuevo −9,7 / −1,1 (ancho 0,00 → 0,07; sobre 4 kHz 0,0 → 1,3 %); 45 s de cada género nuevo: tech house −10,1 / −1,8, minimal −9,1 / −1,1, rominimal −8,6 / −1,7, microhouse −9,3 / −1,4; 60 s de acid house (clásico) a tech house −11,4 / −1,1. Archivos y lista en el directorio de trabajo del lote (`sonido-pro-1/`, fuera de Git).
- **CPU.** Nodos de Web Audio creados por segundo en el render (todo el juego): viaje clásico 139, nuevo 165 (+18 %); quieto, tech house 75 (clásico 66), minimal 68, rominimal 112, microhouse 107. Los golpes salen de buffers hechos una vez (10 como máximo en el viaje). No se midió en teléfono.
- **Pruebas.** Nueva `tests/sound-pro.mjs` (familias, perfiles, ajuste y su guardado, plan de transiciones contra el viaje real, golpes, contrato del motor y sus líneas). `tests/audio_mix.mjs` acepta `soundPro` ('pro' o 'classic'; sin él, las suites de mezcla no cargan el motor) y cuenta nodos creados. `npm test`, `node scripts/release-audit.mjs` y `node scripts/stale-text-check.mjs --base origin/main` en verde. Sin recorridos de navegador ni suites de mezcla, por la regla rápida de Jay: solo los renders para escuchar.
- **Límites.** Nadie lo ha escuchado todavía (ni Jay, ni en teléfono, ni con auriculares). CPU de teléfono sin medir. Las suites de mezcla de CI no cargan el motor nuevo. Sin PR: la rama espera la revisión de Jay de las líneas de `audio.js`.

## CI rápido (proceso, sin cambio de código del juego)

Rama `jay/ci-rapido`, desde `main`. Aprobado por Jay para acortar esperas. Guía: [Verificación](docs/VERIFICACION.md#ci).

- **PR:** lógica completa y solo los recorridos de navegador y audio afectados (`tests/flow_impact.py`, nuevo); el núcleo compartido o lo dudoso corre todo. Se mantienen los grupos y el check `browser-audio`, verde si no hay nada elegido.
- **`main`, nocturna (06:17 UTC) y manual:** catálogo completo.
- **En local:** `npm test`, `release-audit` y `stale-text-check`; navegador solo para depurar. Ver [AGENTS](AGENTS.md).
- Sin subir versión.

## Los lugares te encuentran · 2.3.0-alpha.264

Rama `jay/lugares-te-encuentran`, desde `origin/jay/escaner-nms` (dependencia explícita: PR #398, alpha.263). Aprobado por Jay el 5 de noviembre («Me gusta, hazlo así»). Guía: [Los lugares te encuentran](docs/MUNDO.md#los-lugares-te-encuentran) y [El Viaje](docs/VIAJE.md).

- **Once distancias.** Los once lugares están a una distancia fija del origen: 0,5 · 1 · 2 · 3 · 5 · 8 · 12 · 17 · 23 · 30 · 40 km, en su orden de siempre (`PLACE_KM`). La primera vez que cruzas esa distancia a pie, su portal aparece 150 m por delante, en tu rumbo, y se guarda. Se encuentra vaya por donde vaya. Un salto no cuenta como caminar; si ya estás más allá del siguiente lugar, aparece en tu siguiente paso.
- **El radar capta su señal.** Una flecha de la capa de flechas, con el icono `lugar` y su distancia, apunta siempre al siguiente lugar sin ★ cuyo portal existe (sustituye la luz del borde del anillo). Antes: «Lago · más lejos · 1 km» bajo el HUD, en el objetivo y en Lugares. Aviso al encontrarlo: «Una señal: Lago.».
- **Sin orden.** Todo lugar está abierto tras el Viaje; se entra por su portal. Lugares deja un solo «Seguir», el del siguiente encontrado.
- **Cada trofeo mejora el radar.** Nivel 2 tras el Viaje (120 m); 140, 160 y 180 m con dos, tres y cuatro trofeos; nivel 3 (flechas del registro y «?») con cinco, de 200 a 300 m con los once. Antes el nivel 3 pedía los once. El nivel 4 sigue pidiendo los once y los km; la Carga sigue en 4c 20 s. Ningún guardado baja de nivel.
- **El Viaje, un lugar.** Camino, Llanura y su final. Al guardar la Llanura su portal lleva al Refugio. El final y su música no cambian de código (suena la frase de la Llanura y el tema). El festival conserva sus cinco capítulos.
- **Tu progreso intacto.** `S.lugares` pasa a la versión 3: `found` (portales encontrados) y `ring` (lugares que se quedan en el anillo). Los lugares ya ganados, y todo capítulo guardado en el Viaje, siguen ganados y en su sitio del anillo, con el mismo centro. Solo los no ganados pasan a la distancia. Un guardado a mitad del Viaje conserva sus capítulos guardados y termina el que está jugando. Estrellas, récords, notas, `seen`, `kept`, `won` y `master` se conservan; una versión futura no se toca.
- **Para probar.** `?anillo=1` (y `?lugar=`) trae los otros seis ya encontrados en su sitio del anillo antiguo, para llegar a cualquier portal; `?anillo=1&lejos=1`, nada encontrado.
- **Sin cambios** en `audio.js`, en las rondas, estrellas, Maestro, Libre, Eco ni retos, ni en el tamaño del cubo. Ningún módulo nuevo (`sw.js` solo cambia su clave). Sin RNG: las posiciones salen del rumbo del jugador o de `portalSpots`.
- **Preservación:** capa `approvedLTE`.
- **Pruebas.** Nuevas `tests/lugares-encuentran.mjs` y `tests/lugares_encuentran_smoke.py` (390×844 y 1280×800). Actualizadas a las reglas nuevas, sin desactivar ninguna: `places.mjs`, `places-ring.mjs`, `places-durability.mjs`, `game-objective.mjs`, `journey-chapters.mjs`, `refugio-lugares.mjs`, `wild.mjs`; en navegador `ring_smoke.py` (sin orden), `journey_chapters_smoke.py` y `rapido2_viaje_smoke.py` (el Viaje de un lugar), `journey_finale_smoke.py`, `free_world_return_smoke.py` y los de los juegos del Viaje (`journey_chain`, `journey_dance`, `journey_lasso`, `journey_release`: llegan a su capítulo por índice), `escaner_smoke.py`, `escaner_nms_smoke.py`, `carga_smoke.py` y `flechas_smoke.py` (nivel 2 con un trofeo; la flecha `lugar` ocupa un sitio) y `universe_map_smoke.py` (ya no hay lugar cerrado).
- **Resultados.** `npm test`: 303 suites. `node scripts/release-audit.mjs`: sin errores. 105 recorridos de navegador y audio de lugares, anillo, Viaje, Escáner, flechas y mapa (incluidos `journey_mix.py` y `journey_finale_mix.py`, que no cambian), bajo el candado, todos en verde tras los cambios. No probado en teléfono ni con personas; nadie ha escuchado el final de un solo capítulo.


## El Escáner como No Man's Sky · 2.3.0-alpha.263

Rama `jay/escaner-nms`, desde `main` `72a5bd1` (alpha.262, con T0–T4). Pedido de Jay (resumido): el escáner como en No Man's Sky, solo el icono y un texto corto, nada que tape la vista; cada tipo siempre con el mismo icono; en el mapa, lo que ya conoce no puede ser «?»; el avance no se toca. Guía: [El Escáner](docs/MUNDO.md#el-escáner).

- **Marcas en vez de panel.** Dedo quieto 500 ms o la tecla E, como antes; la onda es la misma. Cada cosa al alcance se vuelve una marca: su icono y «Nombre · distancia» («Caja · 240 m»). Lo lejano o fuera de la pantalla va al borde, en su dirección; lo que se ve más allá del anillo, sobre sí mismo; lo que está pegado al cubo, en un anillo a su alrededor (nunca sobre el cubo). Ocho como mucho, en el orden del registro; ninguna tapa a otra ni a una flecha. Se quedan 7 s tras escanear y se apagan en 1 s: la vista vuelve a estar limpia. Una hoja las borra al instante. Nivel 1: solo iconos.
- **Sin panel «Cerca».** `#scanner` y sus ids siguen en la página, ocultos; solo `?dev=1` lo muestra (con `data-detail` de cada voz). Se va el «tocar una fila marca el mapa»: el mapa conserva su «Marcar». Mientras el dedo está quieto, los avisos y el HUD del poder se apartan (`body[data-scan]`).
- **Un icono por tipo, en todas partes.** Nuevo `src/scan-icons.js` (una vez en `SHELL`): 28 pictogramas blancos de línea, horneados una vez. Los usan las marcas, la capa de flechas (el tipo decide el icono, no la forma que ofrece cada sistema) y el Mapa del universo (también su leyenda). El oro sigue solo para lo ganado. Leyenda en [El Escáner](docs/MUNDO.md#un-icono-por-tipo).
- **«?» solo para lo no descubierto.** Un tipo secreto muestra su icono en cuanto encontraste uno: cristales de cometa, sondas, sonidos raros, el asteroide. Un hito oído ya es un hito. Siguen «?» los rumores, la coordenada secreta de una sonda y lo de las bandas lejanas hasta el nivel 4.
- **Por qué el mapa estaba lleno de «?».** Cada hito oído de lejos (`S.heardLm`, hasta 600, uno de cada diez regiones, se oyen a 1,1 km) se dibujaba como «?» gris, aunque su tarjeta ya decía qué era («Estrella guía»). Además la bengala y los encargos de la tanda A entraban en el mapa como rumor («?» en un cuadrado). Ahora el hito oído es el icono de hito, tenue; la bengala y el encargo, su icono. Nada nuevo se revela: solo cambia cómo se dibuja lo que el mapa ya tenía. La nota de la Bitácora dice «N hitos oídos sin visitar».
- **Guardado y avance.** Sin cambios: ningún campo nuevo ni migración. Los niveles y el alcance siguen (1 corto, 2 tras el Viaje, 3 con los once, 4 por distancia; la Carga, al máximo 20 s).
- **Coste** (`escaner_smoke.py`, `?anillo=1`, llamadas al lienzo por fotograma): sin escanear 1004 y escaneando 1016 a 390×844; 1694 y 1708 a 1280×800 (una pasada). Sin degradados ni `shadowBlur`; iconos horneados. Movimiento reducido: las marcas salen a la vez, sin anillo que viaja ni destello. Calidad ligera: sin halo ni destello.
- **Preservación:** capa `approvedNMS`.
- **Pruebas.** Nuevas `tests/escaner-nms.mjs` (colocación en anillo y borde, tope, sin solapes, la tabla de iconos y su uso en Escáner, flechas y mapa) y `tests/escaner_nms_smoke.py` (390×844 y 1280×800: marcas con icono y texto en el borde, sin panel, vista limpia al apagarse, ninguna flecha sobre una marca, el mapa con hitos y «?» solo para el rumor, leyenda con los mismos iconos, el guardado intacto). Al día, sin desactivar nada: `escaner_smoke`, `flechas_smoke`, `carga_smoke`, `secretos_cielo_smoke` (el segundo cristal y la sonda ya conocida llevan su icono), `smoke`, `focusui_smoke`, `mirrors_smoke` y `scanner-arrows.mjs`. Capturas antes y después en el scratchpad de la sesión (no en Git).
- **Límites.** Probado en local (lógica y Chromium sin interfaz). Sin CI remoto, sin teléfono y sin personas. Los iconos son una primera tanda: Jay no los ha visto.

## La carga (coherencia T3) · 2.3.0-alpha.262

Rama `jay/coherencia-t3`, desde `jay/coherencia-t4` `fbec1b7` (alpha.261, que ya contiene T0, T1 y T2; dependencia explícita). Plan de coherencia, tanda T3, con la decisión 4 de Jay aprobada (una caja, un poder, sin sorpresas). Guía: [La carga](docs/MUNDO.md#la-carga).

- **El radar siempre está.** El Escáner no necesita cajas; la carga es un extra.
- **La Brújula pasa a ser la Carga.** Su caja pone el Escáner en el nivel más alto (4c, 1200 m) durante 20 s de juego, y una sola flecha blanca, en la capa de flechas de T2, señala lo más raro sin encontrar, con su distancia. La caja ya no dibuja sus cuatro flechas ni guarda su propia lista de lo raro.
- **El Compañero usa el mismo registro:** una flecha de la capa hacia lo más raro, al alcance de la partida.
- **Una caja, un poder, un aviso.** Las 16 sorpresas se retiran: ninguna caja las da, no se pueden dar, no se dibujan ni suenan. `#surpriseHud` conserva su id, siempre oculto. La tarjeta de la caja no nombra sorpresa.
- **Guardados.** Sin migración: `brujula` y `poder_brujula` se quedan (el logro se llama «Carga»). `S.boxSurprises` se conserva; una sorpresa guardada activa termina sin más y sus datos siguen en el guardado. Ningún logro dependía de una sorpresa.
- **Sin cambios** en `audio.js`, azar antiguo, posiciones y probabilidades de las cajas, ids de HTML ni premios. Se van las notas de las cinco estelas de sorpresa.
- **El color del lugar, entero en las formas.** T2 quitó la luz de color de la región vecina en el borde (ahora una flecha blanca); con ella se iba parte del color del capítulo recuperado. El pigmento pasa de 0,7 a 1 (`PIGMENT`, `world-sheet.js`): el color del lugar va completo a las formas, el fondo sigue negro, la flecha sigue blanca y el oro sigue para lo ganado. En `color_earned_smoke`, el mínimo estable sube de 1,3 % a 3,4 % de croma (`main` `d5a4f27`: 1,6 %, por eso la prueba fallaba a veces también allí).
- **Preservación:** capa `approvedT3`.
- **Pruebas.** Nuevas `tests/carga.mjs` y `tests/carga_smoke.py` (390×844 y 1280×800: sin caja, nivel 2 y ninguna flecha a 900 m; con la Carga, su aviso, nivel 4c, una flecha blanca a lo más raro y el escáner que llega a 900 m; a los 20 s, vuelta al nivel 2). `tests/box-surprises.mjs` y `tests/box_surprises_smoke.py` comprueban ahora que no hay sorpresas y que un guardado con una activa carga bien. Ajustadas a la regla nueva, sin desactivar nada: `avisos_oro_smoke`, `power_cards_smoke`, `sparks_economy_smoke`, `visual_closure_smoke` y `micro_mix.py`.
- **Límites.** Probado en local (lógica y Chromium sin interfaz). Sin CI remoto, sin teléfono, sin escucha y sin personas. Las otras flechas del nivel 4c dependen de lo que registren las tandas futuras (hoy ninguna cosa es de nivel 4).


## Avisos y oro (coherencia T4) · 2.3.0-alpha.261

Rama `jay/coherencia-t4`, desde `jay/coherencia-t1` `fa47285` (alpha.259, con T0; dependencia explícita). Plan de coherencia, tanda T4, con las doce decisiones aprobadas por Jay. Un solo estilo de aviso y la regla del oro. Guía: [Luz común](docs/MUNDO.md#luz-común).

- **Un aviso: «Nombre · una frase.»** Sin «¡» ni «!» en ningún texto del juego: la caja ya no dice «¡Zum! Eres cometa» sino «Cometa · Corre y suena.»; «récord nuevo», «Gol», «Nueva marca.», «Ya». «Poder renovado» pasa a «Cometa · Poder renovado.».
- **Una caja, un aviso.** Mientras su tarjeta se ve, los HUD del poder y de la sorpresa esperan debajo; después, un solo reloj (el del poder). La sorpresa que te movió conserva su «Volver». Los logros de la caja (`caja1`, `caja5`, `poder_*`) se guardan sin leer en la Bitácora, sin aviso detrás de la tarjeta (`quietAchievements(ids)`).
- **«Aquí empiezan…» se va.** Cada banda dice «Radares de ritmo · Empiezan aquí.». Un aviso por cruce: el de lo más lejano; lo demás espera, callado, en la Bitácora. Entre dos, 12 s de juego como mínimo (antes 4,5 s, y una cola). Límite: sale al cruzar el km, no al ver la cosa.
- **El narrador se ríe con el niño, no de él.** Reescritas 24 líneas que se burlaban o guiñaban a adultos («dejaste atrás tu dignidad», «Tus vecinos te odian», «Muy inútil», alquiler, pasaporte, industria musical…). La voz juguetona se queda.
- **Oro solo para lo ganado.** Una regla en el aviso: `.toast em` es blanco y `#toast[data-earned="true"] em` dorado. La cola marca `data-earned` con la categoría `ganado` u `options.earned` (logros, colores, compras, tarjetas nuevas, muestras únicas y lo ya marcado). En blanco: «✦ 0 chispas» (clase `empty`), el HUD del poder, `#routeAuto` pulsado, `.fxpad i`, la línea del narrador, la flecha y el nombre de la Brújula, el pincel, el brazo del Campo, la reliquia aún sin ganar (antes cian y lila), las casas apagadas de los campamentos, el festival de luces, el anillo del evento Eclipse, la pista de las travesuras, el destello devuelto del púlsar y el aro del bucle. Fuera la regla vacía `.place-narrator`.
- **Luna blanca** (antes «Luna de oro»): la rareza mítica es blanca, con su regla y su rumor. El id `luna` y la muestra guardada no cambian.
- **Sin cian ni lila.** `CARD_TIERS` es una sola tabla (`TIER_INK` para el Refugio y Tu cubo): una tarjeta del libro es ganada, en dorado; el nivel se dice con su nombre. El bucle (`jam.js`) y el resumen del Atlas, en blanco.
- **Lienzo a 12 px como mínimo** (45 llamadas de 9–11 px), salvo en los archivos de borde de T2 (`viaje-a/c/d`, `lejos-b`, `recorrer`, `descubrir`, `vida`).
- **Se queda:** el pop dorado al abrir una caja y su tarjeta (Visual 1, aprobado), ★, ✦ ganadas, el cubo dorado y lo completo. Sin cambios en `audio.js`, guardados, recompensas ni ids.
- **Pruebas.** Nuevas `tests/avisos-oro.mjs` (sin «¡» en los textos legibles, la caja, el narrador, las bandas y la regla del oro en CSS y lienzo) y `tests/avisos_oro_smoke.py` (390×844: una caja, un aviso y un reloj; «✦ 0» blanco y «✦ 5» dorado; nombre cotidiano blanco y ganado dorado; un aviso de banda por cruce). Actualizadas las que leían los textos viejos (`viaje_a/c/d`, `lejos_b`, `luca`, `fewer-counters` y sus recorridos). Capturas antes y después en el scratchpad de la sesión (no en Git).
- **Con T2 fusionada.** Las flechas de borde y el panel «Cerca» de T2 siguen esta regla: blancos, sin oro, avisos «Nombre · frase». Ninguna flecha de borde es dorada. Al fusionar, los archivos de borde de T2 (`viaje-a/c/d`, `lejos-b`, `recorrer`, `descubrir`, `vida`) pasan también a 12 px (17 llamadas de 10–11 px), y el rótulo de la bandada (`vida.js`) pasa de dorado a blanco.
- **Límites.** Probado en local (lógica y Chromium sin interfaz). Sin CI remoto, sin teléfono, sin escucha y sin personas. Las marcas de borde y la flecha de la bandada son de T2. El resto de textos, nombres y biomas, de T5 y T6.


## Una capa de flechas (coherencia T2) · 2.3.0-alpha.260

Rama `jay/coherencia-t2`, desde `jay/coherencia-t1` `fa47285` (alpha.259; dependencia explícita, con T0 dentro). Plan de coherencia, tanda T2, con las doce decisiones aprobadas por Jay. Guía: [Una capa de flechas](docs/MUNDO.md#una-capa-de-flechas).

- **Un solo lenguaje para «hay algo allí»:** una flecha blanca pequeña en el borde, con el icono del Escáner o «?» (secreto o solo oído). Tres como mucho: primero lo tuyo (reto, bengala), luego lo raro, luego lo que se hace, luego el camino; dentro, lo más cercano. Una flecha por cosa; ninguna encima de otra.
- **Las marcas viejas pasan a la capa:** Descubrir (juego, hallazgo, caja, sonido raro), Recorrer (boya con su km, satélite), Secretos del cielo (eclipse, cristal, sonda), tandas A, B, C y D, pistas de hallazgo (eran puntos cian), chispa salvaje sin sonido (era dorada), la bandada que enseña una caja (era dorada), los hitos (eran brillo y rayos de color) y la región vecina (era una luz de color; ahora solo si no hay nada más). Ninguna marca dorada ni cian.
- **La tanda B deja una sola marca** (antes, una por tipo). **La sonda tiene su «?» también con sonido.** Las cosas de B, C y D son «?» hasta el nivel 4 del Escáner.
- **Nivel 3 del Escáner, con los once lugares** (`S.lugares.won`): 300 m, el registro también señala (rumores, cristales de cometa y asteroide secreto nuevos en el registro, como «?»). Al soltar, «Cerca» se queda 4 s y **una fila pone la marca en el Mapa del universo** (la marca única). `SCAN_OPEN = 3`.
- **Movimiento reducido:** sin aparecer poco a poco. **Calidad ligera:** sin halo. Flecha e iconos horneados; sin degradados ni `shadowBlur`.
- **Coste** (`?anillo=1`, llamadas al lienzo por fotograma, mediana de tres, a 3/15/35/65 km): 758/477/3778/1058 → 753/459/3771/1046 a 390×844 y 1481/761/7377/1948 → 1476/742/7375/1932 a 1280×800; con el nivel 3 abierto, igual o menos en los ocho.
- **Sin cambios** en qué son las cosas, premios, sonidos, `audio.js`, azar antiguo, ids de HTML ni guardados (la marca usa `S.universeMap.mark`). La Brújula sigue igual hasta T3.
- **Preservación:** capa `approvedT2`.
- **Pruebas.** Nuevas `tests/scanner-arrows.mjs` y `tests/flechas_smoke.py` (390×844 y 1280×800: solo blanco, tres como mucho, nivel 2 frente a 3, «?» del secreto y del rumor, una fila marca el mapa y una marca nueva sustituye a la anterior, movimiento reducido, calidad ligera y coste). Al día: `scanner-model.mjs` (nivel 3), `secretos_cielo_smoke.py` (la sonda con sonido lleva «?»), y `recorrer`, `viaje_a`, `descubrir_sonidos`, `arreglos30_mundo` y `journey_ui` comprueban que su marca entra en la capa. Capturas en el scratchpad de la sesión (no en Git).
- **Límites.** Probado en local (lógica y Chromium sin interfaz). Sin CI remoto, sin teléfono, sin escucha y sin personas. Sin carga (T3) ni nivel 4.


## El Escáner, núcleo (coherencia T1) · 2.3.0-alpha.259

Rama `jay/coherencia-t1`, desde `jay/menus` `7acb2b2` (alpha.257, PR #394; dependencia explícita). Plan de coherencia, tanda T1, con las doce decisiones aprobadas por Jay. Lleva dentro T0 (`jay/coherencia-t0`, alpha.258, PR #395), fusionada sobre esta rama. Guía: [El Escáner](docs/MUNDO.md#el-escáner).

- **Siempre está** (dedo quieto 500 ms o la tecla E) y crece con el avance. Nivel 1 desde el inicio: onda corta (40 m) y formas sin nombre. Nivel 2 tras el Viaje: 120 m, «Nombre · distancia» («Sonda · 80 m»).
- **La onda.** Un anillo blanco sale del cubo; lo que toca se enciende con un icono pequeño. Lo nuevo, blanco; lo encontrado, tenue. El cubo no crece. Sin sonido nuevo.
- **Panel «Cerca»** (antes «Escuchar»): tres filas, una por cosa, sin BPM (bug 16), sin ids ni «Blob», sin el reto de región. El detalle técnico de las voces sale de la vista (Bitácora › Música; `data-detail` para desarrollo). Ids `#scanner*` conservados.
- **Con el escáner abierto**, los HUD de poder y de sorpresa se apartan (bug 12, la parte del escáner).
- **Escanear no calla nada** (bug 8): `paused()` deja de mirar `r.scanning` en seis módulos. Las sondas pitan y el eclipse sigue oscuro mientras escaneas. Sin cambios en `audio.js`.
- **Registro** `src/scanner-model.js` (puro): `registerScan`, `scanLevel`, `scanNear`, `scanPage`, `scanSiteAt` (`hashKey`). Niveles 3 y 4a–4c escritos y cerrados (`SCAN_OPEN = 2`); `scanBandEntry`, enganche listo para `registerBand`. Dibujo en `src/scanner-art.js`. Ambos, una vez en el `SHELL` de `sw.js`.
- **Guardado:** sin campos nuevos. Lo encontrado se lee de lo ya guardado (colección de elementos, formas, reliquias, juegos, sondas).
- **Coste:** iconos horneados, sin degradados ni `shadowBlur` por fotograma. Escaneando, unas 20 llamadas más al lienzo por fotograma (994–999 → 1012–1022 a 390×844; 1708–1714 → 1729–1740 a 1280×800). Movimiento reducido y calidad ligera, con sus variantes.
- **Preservación:** capa `approvedT1` (`render.js`, `scanner.js` y la concha).
- **Pruebas.** Nuevas `tests/scanner-model.mjs` y `tests/escaner_smoke.py` (390×844 y 1280×800: nivel 1 frente a nivel 2, onda, nombres solo en el 2, HUD apartados, sonda y eclipse mientras escaneas, movimiento reducido, calidad ligera y coste). Capturas antes y después en el scratchpad de la sesión (no en Git).
- **Límites.** Probado en local (lógica y Chromium sin interfaz). Sin CI remoto, sin teléfono, sin escucha y sin personas. Sin flechas de borde ni nivel 3 (T2), sin carga (T3). Las voces conservan su radio corto de antes (25 m).


## Coherencia, tanda 0 · los bugs sueltos · 2.3.0-alpha.258

Rama `jay/coherencia-t0`, desde `jay/menus` `c56a632` (alpha.257, PR #394: dependencia explícita). Tanda T0 del plan «Kubono coherente», con las doce decisiones aprobadas por Jay el 4 de noviembre. Solo arreglos: mismas mecánicas, sin tocar `audio.js` ni el azar antiguo, y ningún guardado pierde nada. Guía: [El mundo](docs/MUNDO.md#coherencia-tanda-0-alpha258).

- **El cubo no crece** (bug 2, decisión 4). «Expansión» queda retirada (`RETIRED_SURPRISES` en `box-surprises-model.js`). Sigue en la lista, así que las demás cajas conservan la sorpresa de su semilla; la que la sacaba no da ninguna, `giveSurprise('grande')` no hace nada y una guardada activa no agranda. «El cubo crece contigo» pasa a «Tu luz se queda contigo».
- **Sin personas en pantalla** (bug 3). Los estudios «Campo del canon», «Molino de memoria» y «Cámara modal» y el recuerdo «constancia» del Camino ya no nombran a Bach, Leonardo, Hildegard ni a Jay. Los créditos del final se quedan.
- **Chispa salvaje** (bug 1). `wildPay` en `wild.js`: paga solo con `sparkEconomy.version===1` (una versión futura queda intacta), nunca en el laboratorio ni en otra tierra, y deja su línea en el registro. Tampoco aparece en esos dos casos. El importe sigue en 15 ✦ hasta la tanda de economía.
- **Ámbar se gana** (bug 4). El décimo cristal del Camino da `tope` («Completaste el Camino de hoy.»), el logro que pide Ámbar. `dorada` y `s10` quedan en `RETIRED_ACHIEVEMENTS`: quien los ganó los conserva.
- **«Ya puedes saltar»** solo cuando el salto existe, con los once completos (bug 5).
- **Logros sin ✦** en su aviso: «Logro · …» (bug 6).
- **El día cuenta jugando** (bug 7). Al guardar una ronda de un lugar (Reto entre dos y Libre incluidos) o el Duelo, `onFirstLight` marca el día: se enciende su estrella.
- **Luz con su sonido** (bug 9). La canción del cielo (`lejos-b.js`), el aro del álbum (`descubrir.js`) y el destello del púlsar (`viaje-c.js`) usan `audibleTime`.
- **«Lo que hay más lejos»** sin «20 de 20»: el resumen ya no cuenta bandas alcanzadas como cosas encontradas; con todas alcanzadas dice «Llegaste a todo.» (bug 10).
- **La hoja de la ronda** (bug 11). Mientras espera su caída, la ruta no salta al lugar siguiente; con el Refugio abierto espera a que se cierre. La espera de la caída no cambia.
- **Mapa del universo** (bug 13): pasados 50 km, la cabecera habla del último anillo.
- **Textos** (bugs 14, 15, 17, 18, 21, 22): sin verbo repetido en los rumores («suena una estrella que zumba»); la fusión de sonidos se anuncia una vez; «Ir solo» por «Autopilot»; «Tu cubo · Chispas» y «Conservas tus chispas»; plurales y «4 nov» en Bitácora › Hoy y Logros; el encuentro vivo no repite su título (polilla, ola y polen).
- **Una ventana a tiempo** (bug 19): el Duelo usa `ON_TIME` (±80 ms), no ±90.
- **`?rapido`** no hace nada en la edición de venta (bug 20).
- **Fuera de esta tanda.** Bug 8 (el escáner calla balizas), 12 (avisos que se tapan) y 16 (BPM del escáner) van con el escáner (T1) y la carga (T3): no se tocan `scanner.js` ni el panel.
- **Inglés** al día en `src/i18n-en.js`. ID de HTML conservados. Preservación: capa `approvedT0`.
- **Pruebas.** Una comprobación nueva por bug en las pruebas de modelo (`wild`, `box-surprises`, `living-buildings`, `crystal-play`, `fewer-counters`, `places-durability`, `one-clock`, `viaje_a`, `places-ring`, `universe-map`, `descubrir`, `lejos_b`, `autopilot`, `sparks-economy`, `ritmo`, `rapido-2`, `journal`, `live-encounters-clear`); cada una falla con alpha.257 y pasa con el arreglo, salvo la de textos de `sparks-economy`, escrita después. `crystal_path_smoke.py` comprueba Ámbar en el navegador.


## Menús para jugadores · 2.3.0-alpha.257

Rama `jay/menus`, desde `main` `c5b796f` (alpha.256). Pedido de Jay («haz lo de los menús»), tras la auditoría de menús: un juego en producción no enseña herramientas de prueba, y Luca entiende los menús. Misma función; sin cambio de progreso ni de formato de guardado. Guía: [Arquitectura](docs/ARQUITECTURA.md#interfaz-y-guía).

- **Fuera de la vista del jugador**, solo con `body.dev` (localhost, `?dev=1`, navegador automatizado): ajuste de tiempo (la calibración automática y `S.latencyNudge` siguen), línea del deploy, diagnóstico, «Datos del mundo» (salvo encendido, para poder apagarlo), campo libre de semilla y semillas de prueba. La versión queda, pequeña. Fuera el «Simple.» del pie del menú. Nada se borra.
- **Cuenta en pausa.** Con la nube en pausa el jugador no ve «Cuenta»; «Guardar copia» aparece en «Más» › Tú, como en la edición de venta. Supabase y su configuración, sin tocar.
- **Un volumen**, en Ajustes. El de «Más sonido» sigue en la página, oculto y sincronizado.
- **«Más sonido»:** Música y Calma a la vista; Energía, Repetir, Escenas y Estilo de La Voz, plegados en «Avanzado».
- **Dos nombres claros:** «Mostrar todo: sí / no» (antes «Vista completa / tranquila»), «Modo niños» (antes «Modo tranquilo para niños», con la línea «Más fácil y sin prisa. Solo da ★.» y la hoja «Modo niños: ★ ganada.»). Mismos modos y claves.
- **Fuera «Modo crear»** (`#bCreateMode`), por decisión de Jay: ningún sistema leía `S.relaxedCreate`, así que el botón no cambiaba nada. El valor guardado se conserva tal cual.
- **Paseo automático:** tres opciones, Paisaje, Criaturas y Hallazgos. «Afinidad» y «contraste» guardados siguen funcionando y no se reescriben; la lista los enseña como «Hallazgos».
- **Ajustes en orden:** Volumen, Idioma, Modo niños, Vibración, Daltonismo y Calidad («Lo básico»); luego «Más opciones»; «Partida» con la versión y, al final y aparte, «Empezar de cero», que ya pedía «¿Seguro?».
- **«Volver al Camino»** sale de «Más»: en el Mundo cierra «Jugar», a la vista.
- **Mapa:** el menú ya enseñaba un solo botón de mapa (`#bMap`); `#bUniverseMap` vive en el dock. Sin cambio.
- **Bitácora › Tú:** primero ★ de 33, lugares de 11, días con luz y logros; Regiones, Continentes y Récord, al final.
- **ID de HTML conservados.** Inglés al día en `src/i18n-en.js`. Preservación: capa `approvedMN` (`living-discoveries.js`).
- **Pruebas.** Nueva `tests/menus_produccion_smoke.py`: sin `body.dev`, a 390×844 y 1280×800, nada de lo anterior a la vista, y con `body.dev` las herramientas siguen. Actualizadas las que leían los nombres viejos, el volumen de «Más sonido», el lugar de `#bPrimary` o «Guardar copia» oculto en la web. Capturas antes y después en el scratchpad de la sesión (no en Git).
- **Límites.** Probado en local (lógica y recorridos de navegador en Chromium sin interfaz). Sin CI remoto, sin teléfono y sin Luca.


## Cerrar el portal · 2.3.0-alpha.256

Rama `jay/portal-close`, desde `main` (alpha.255). Nota de Jay: al volver al Jardín ya completo, la hoja del portal no se cerraba; solo se salía entrando en el nivel. Guía: [El mundo](docs/MUNDO.md#lugares-y-avance).

- **Causa.** Con una hoja abierta, el anillo olvidaba en qué portal estaba el cubo. Al cerrarla, el cubo seguía dentro y la hoja se abría otra vez en el siguiente fotograma.
- **Arreglo** (`src/places-ring.js`, `tick`). Con una hoja abierta el anillo recuerda el portal. «Cerrar» (o Escape) la deja cerrada; salir y entrar de nuevo vuelve a preguntar. Rondas, estrellas y guardado no cambian.
- **Prueba.** `tests/ring_smoke.py` camina con las flechas hasta la Llanura, cierra la hoja y comprueba que sigue cerrada y sin ronda. Falla con alpha.255 y pasa con el arreglo.

## Visual 3 · el ambiente · 2.3.0-alpha.255

Rama `jay/visual-3`, desde `jay/visual-2` `a5f253f` (alpha.254, PR #391 abierto: dependencia explícita). Pedido de Jay: que todo se vea más profesional y «wow», igual de jugable y sin subir el coste. Es la tanda 4 de la auditoría visual, el ambiente, con el kit existente. Guía: [El mundo](docs/MUNDO.md#visual-3-el-ambiente).

- **Módulo nuevo** `src/ambient-art.js`, una vez en `SHELL`. Lo cargan `render.js`, `universe-layers.js`, `lejos-b.js`, `house.js` y `refugio-lugares.js`. Expone `runtime.ambientState` para las pruebas. Posiciones por `hashKey`; nada del azar antiguo.
- **Estrellas de fondo en tres capas de paralaje** (0,03, 0,07 y 0,14 de la cámara). Cada capa repite el dibujo de una tesela, puesto una vez. Lejanas y medias van en unas pocas rutas por color y brillo; las cercanas, en un sprite con halo, y alguna destella. Respetan bioma, niebla y hora. Antes eran 110 `fillRect` por fotograma. Se probaron teselas enteras como imagen: en el navegador costaban más que los puntos, así que se descartaron.
- **Aurora.** La banda del cielo (evento de región y Canción del cielo) es una tira pintada una vez que se desliza con el tiempo, con brillo, cresta y cortinas. Las cortinas de la región Aurora y de la Canción son otra tira por tinta; cerca del cubo siguen las columnas que se apartan. En la escena de la Canción, los `stroke` bajan de 701 a 173 por fotograma.
- **Bosque y Jardín.** Suelo propio y quieto, cacheado por celda (cinco variantes por bioma). Bosque: nubes de polvo, cúmulos y filamentos. Jardín: zarcillos, hojas, esporas y motas. Se apaga lejos del cubo.
- **Huella de las escenas.** Solo con «Escenas» encendido y un escenario sonando. Haces de luz desde su lado, que barren despacio y brillan en el tiempo. Un suelo de 5 × 5 baldosas que late; en el Patio, un anillo de luces en la clave. Colores por escena y género, nunca dorado. Apagado el ajuste, nada. `audio.js` y `scenes-audio.js` no cambian: solo se lee `sceneState`.
- **Refugio.** Luz cálida en cada sala abierta, con su charco en el suelo. Sombra suave bajo el cubo. Brillo dorado en lo ganado: estrellas del cielo del Refugio y ★ de la estantería. La luz del paso del compás sale de una tira (antes, un degradado por sala y fotograma con sonido). El fondo conserva su degradado: como sprite escalado costaba más. Disposición, controles e ID, iguales.
- **Movimiento reducido:** las estrellas, en una sola profundidad y sin destello; aurora, haces y suelo de escena, quietos. **Calidad ligera:** dos capas de estrellas, sin suelo nuevo, sin haces, la aurora de antes y sin luz sumada en el Refugio.
- **Sin cambios.** Mecánicas, posiciones, colisiones, guardado, sonido, RNG e ID de HTML se mantienen. El cubo no crece.
- **Medido** (Chromium sin interfaz, 390×844, DPR 1, frente a `a5f253f`). La CPU es la media de tres pasadas alternas por árbol. Las llamadas (`fillRect`, `stroke`, `fill` y `drawImage`) y los degradados son por fotograma, de una pasada con contadores:

  | Escena | CPU del navegador por fotograma (ms) | Fotogramas/s | JS p50 (ms) | Llamadas · degradados |
  |---|---|---|---|---|
  | Inicio | 37,8 → 38,4 | 40 → 38 | 6,8 → 7,5 | 1 101 → 1 018 · 0 → 0 |
  | Bosque | 27,0 → 28,5 | 50 → 48 | 6,8 → 7,1 | 1 123 → 1 046 · 0 → 0 |
  | Jardín | 28,0 → 29,6 | 51 → 49 | 8,0 → 7,9 | 1 122 → 1 044 · 0 → 0 |
  | Vacío | 31,7 → 32,9 | 45 → 43 | 6,3 → 6,3 | 453 → 368 · 0 → 0 |
  | Jardín, movimiento reducido | 28,2 → 27,2 | 49 → 50 | 7,6 → 6,8 | 1 097 → 1 009 · 0 → 0 |
  | Jardín, calidad ligera | 27,5 → 26,4 | 52 → 54 | 7,0 → 6,8 | 729 → 627 · 0 → 0 |
  | Aurora (evento y región) | 33,6 → 31,1 | 41 → 46 | 8,5 → 6,9 | 1 529 → 729 · 0 → 0 |
  | Canción del cielo, aurora | 31,1 → 29,6 | 45 → 46 | 7,3 → 7,1 | 2 099 → 1 510 · 0 → 0 |
  | Escenario, «Escenas» apagado | 36,8 → 35,1 | 41 → 43 | 8,7 → 8,4 | 3 933 → 3 840 · 0 → 0 |
  | Almacén sonando | 29,4 → 29,7 | 48 → 48 | 7,1 → 7,1 | 3 426 → 3 432 · 0 → 0 |
  | Patio latino sonando | 30,7 → 37,8 | 46 → 40 | 7,5 → 9,3 | 1 038 → 914 · 0 → 0 |
  | Refugio | 15,9 → 16,3 | 60 → 60 | 4,8 → 5,1 | 367 → 281 · 1 → 1 |

  Media de CPU en las doce escenas: 29,8 → 30,2 ms, dentro del ruido del servidor (4 núcleos compartidos, rasterizado por software; la misma escena varía hasta 15 ms entre pasadas). En el Refugio, tres pasadas tras devolver el fondo a su degradado. El Patio sube en las pasadas entre árboles, pero no al encender y apagar el ambiente en la misma página: +1,2 y +3,4 ms en dos series de seis. Esa prueba, en la misma página, da de −2,9 a +3,4 ms por escena, con media de +0,4 ms. El suelo de Bosque y Jardín es lo que más pesa (+1,5 a +3 ms) y por eso se dibuja solo cerca del cubo. Se probaron teselas enteras de estrellas como imagen: costaban 3–4 ms más y se descartaron. No se midió en teléfono: hay que hacerlo con `?medir=1`.

- **Pruebas nuevas.** `tests/visual3.mjs`: posiciones sin azar, tiras periódicas con la onda de antes, rutas por color y brillo, una profundidad con movimiento reducido, escenas sin dorado, huella solo con el ajuste y un escenario sonando, y el dibujo de antes sin lienzo. `tests/visual3_smoke.py`: 390×844 y 1280×800 en Bosque, Jardín, Vacío, aurora, escena apagada, Almacén, Patio, movimiento reducido, calidad ligera y Refugio. Comprueba que no hay errores, degradados por fotograma ni `shadowBlur`, que las cachés se asientan y que las llamadas quedan bajo las de `a5f253f`.
- **Capturas** antes (`a5f253f`) y después, con el mismo nombre, en el scratchpad de la sesión (`visual3-shots/antes` y `despues`). No están en Git.
- **Preservación.** Capa `approvedV3` (`73e0625`, el commit de código), primera en la cadena, para `render.js` y `universe-layers.js`. La lista offline de `sw.js` se compara con ella: un módulo nuevo. `house.js` y `refugio-lugares.js` ya estaban permitidos; `lejos-b.js` no está en la base protegida.
- **Límites.** Probado en local: lógica, recorridos de navegador de los sistemas tocados, `audio_mix.py` y `scenes_mix.py`. `visual2_smoke.py` falló una vez en el eclipse, que depende del reloj; repetido, pasa en `a5f253f` y aquí. Sin CI remoto, sin teléfono y sin personas.


## Visual 2 · el cielo y los objetos grandes · 2.3.0-alpha.254

Rama `jay/visual-2`, desde `jay/visual-1` `1d51eab` (alpha.253, PR #390 abierto: dependencia explícita). Pedido de Jay: que todo lo del mundo se vea más profesional y «wow», igual de jugable y sin subir el coste. Son las tandas 2 y 3 de la auditoría visual, con el kit de visual 1. Guía: [El mundo](docs/MUNDO.md#visual-2-el-cielo-y-los-objetos-grandes).

- **El kit** (`src/fx-kit.js`) gana `bake()`, un dibujo hecho una vez al doble de resolución con su propia caché, y `streak()`, una estela de luz en un sprite girado. La caché de brillos pasa de 40 a 96. Ningún módulo nuevo.
- **El cielo.**
  - Meteoros con cabeza de luz y cola.
  - Cristales de cometa con coma y dos colas opuestas al cubo.
  - Corona del eclipse con rayos finos y diamante al cubrirse.
  - Sonda legible: disco oscuro, contorno claro, paneles y antena; su luz parpadea sumada.
  - Estrellas del Mapa del cielo con cuatro puntas, la línea que se escribe con una luz en la punta y pops al completar la figura.
  - Satélite con luz cálida que cae suave (antes, un disco plano), una luz que recorre su anillo y doble contorno.
  - Boyas con reflejo y luz al compás; bengala, púlsares, asteroide secreto, luna y luces de la corona de la tanda D.
- **Los objetos grandes.**
  - Tótems pintados una vez por pieza, con borde de luz y algo menos de saturación, sombra de contacto y la luz del bioma detrás.
  - Portales de actividades que aparecen, con anillo de guiones que gira y luz al esperar dentro.
  - Portales de otra regla, hitos con rayos desde el borde, y percusión y micro-instrumentos que se iluminan y hacen pop.
  - Mascota y bandadas en chispas sumadas; crías con halo en el Refugio.
  - Los objetos de las tandas A–D, con sombra, luz y doble contorno; cada cumplido hace un pop en la capa común, dorado solo si se gana.
- **El coste.** No queda ningún degradado por fotograma en estas escenas. Pasan a sprites el charco del bioma, el alba, el ocaso y la noche, la cubierta y la bruma de la niebla, el borde de la tormenta, la luz del borde hacia el siguiente lugar, las salidas bajo tierra, la pelota, la bengala, la estrella del eclipse, la luna y la nebulosa. Los micro-instrumentos usan un `Path2D` por tipo.
- **Sin cambios.** Mecánicas, posiciones, colisiones, guardado, sonido (`audio.js` intacto), RNG e ID de HTML se mantienen. El cubo no crece. Con movimiento reducido nada nuevo gira ni hace pop. En calidad ligera no hay luz sumada ni doble contorno, y los meteoros y el cometa vuelven a sus líneas.
- **Medido** (Chromium sin interfaz, 390×844, DPR 1, frente a `1d51eab`). La CPU es la media de dos pasadas alternas. Las llamadas al lienzo (`fillRect`, `stroke`, `fill` y `drawImage`) y los degradados son por fotograma, de una pasada con contadores:

  | Escena | CPU del navegador por fotograma (ms) | Fotogramas/s | JS p50 (ms) | Llamadas · degradados |
  |---|---|---|---|---|
  | Inicio | 25,0 → 25,4 | 47 → 47 | 6,0 → 5,9 | 1 082 → 1 094 · 7 → 0 |
  | Cristal de cometa | 27,7 → 26,4 | 43 → 46 | 6,6 → 6,6 | 1 041 → 1 055 · 7 → 0 |
  | Sonda | 22,5 → 24,2 | 52 → 49 | 5,6 → 6,4 | 1 185 → 1 190 · 7 → 0 |
  | Eclipse | 21,8 → 21,9 | 58 → 56 | 5,2 → 5,2 | 405 → 496 · 9 → 0 |
  | Boya | 21,0 → 19,1 | 55 → 59 | 6,2 → 5,8 | 1 026 → 1 077 · 9 → 0 |
  | Satélite | 29,3 → 30,5 | 38 → 39 | 6,6 → 6,8 | 1 352 → 1 369 · 5 → 0 |
  | Meteoros | 19,2 → 18,2 | 56 → 60 | 5,3 → 4,8 | 893 → 840 · 5 → 0 |
  | Figura del cielo | 28,5 → 27,0 | 41 → 44 | 6,7 → 6,2 | 2 313 → 2 250 · 5 → 0 |
  | Tótems | 29,9 → 26,5 | 38 → 43 | 6,6 → 5,9 | 782 → 784 · 11 → 0 |
  | Portal de actividad | 20,4 → 21,6 | 57 → 54 | 5,2 → 5,5 | 459 → 419 · 6 → 1 |
  | Hito · en el borde | 23,6 → 23,0 · 24,5 → 22,6 | 51 → 51 · 48 → 51 | 6,9 → 6,7 · 6,5 → 6,4 | 1 069 → 1 023 · 5 → 0 |
  | Pelota de luz | 22,3 → 19,4 | 52 → 59 | 7,7 → 6,2 | 2 257 → 2 205 · 10 → 0 |
  | Púlsar | 26,5 → 24,7 | 44 → 48 | 7,1 → 5,9 | 965 → 924 · 7 → 0 |
  | Asteroide por capas | 26,0 → 26,4 | 48 → 46 | 6,2 → 6,5 | 1 686 → 1 625 · 6 → 0 |
  | Portal de otra regla | 18,5 → 18,0 | 57 → 59 | 5,8 → 5,2 | 408 → 366 · 5 → 0 |
  | Estación | 17,5 → 17,1 | 59 → 60 | 5,0 → 5,2 | — · 4 → 0 |
  | Región apagada | 20,8 → 20,9 | 55 → 55 | 5,1 → 5,5 | 762 → 723 · 6 → 0 |
  | Bandada y mascota | 30,1 → 24,5 | 43 → 49 | 7,3 → 6,3 | 1 080 → 1 066 · 8 → 0 |

  Media de CPU en las 19 escenas: 24,0 → 23,0 ms, de −5,6 a +1,7 ms según la escena, dentro del ruido del servidor (4 núcleos, rasterizado por software). El eclipse depende del reloj y su pasada con contadores lo cogió más cubierto; la de la estación no es comparable porque se movió el encuadre. No se midió en teléfono: hay que hacerlo con `?medir=1`.
- **Pruebas nuevas.** `tests/visual2.mjs`: tótems en piezas cacheadas (y los degradados de antes sin lienzo), la estela y la caché de `bake`. `tests/visual2_smoke.py`: 16 escenas del cielo y de los objetos en 390×844 y 1280×800. Comprueba que no hay errores ni degradados por fotograma ni `shadowBlur`, que las cachés se asientan y que las llamadas quedan bajo las de `1d51eab`. También que un tambor golpeado hace pop, que no hay pop con movimiento reducido y que la calidad ligera no suma luz.
- **Capturas** antes (`1d51eab`) y después, con el mismo nombre, en el scratchpad de la sesión (`visual2-shots/antes` y `despues`). No están en Git.
- **Preservación.** Capa `approvedV2`, primera en la cadena, para los trece archivos protegidos que cambian. La lista offline de `sw.js` se compara con ella y no cambia, salvo la clave de versión.
- **Límites.** Probado en local: lógica, recorridos de navegador de los sistemas tocados y `audio_mix.py`. Sin CI remoto, sin teléfono y sin personas.


## Visual 1 · luz común · 2.3.0-alpha.253

Rama `jay/visual-1`, desde `main` `c8842cd` (alpha.247); antes alpha.250.

- **Mezclada sobre las tandas C y D.** Un merge une `jay/viaje-d` (alpha.252, PR #389, con C, B y A); la versión pasa a alpha.253. Tras la unión pasan en local `release-audit`, `npm test` (295 suites), `verify-e-preservation`, los recorridos de navegador de visual 1, de las tandas A–D y de los sistemas tocados, y `audio_mix.py` y `viaje_d_mix.py`. Los umbrales de `visual1_smoke.py` no cambian: con las tandas siguen por debajo (inicio en el teléfono, 7 degradados y unos 1 008 `fillRect` por fotograma; Cristales, unos 240 `stroke`).

El resto de la entrada describe la tanda gráfica. Tandas 0 y 1 de la auditoría visual, aprobadas por Jay: el mundo más acabado, sin subir el peso ni el trabajo por fotograma. Guía: [El mundo](docs/MUNDO.md#luz-común).

- **Kit nuevo** `src/fx-kit.js`. Brillo desde sprites cacheados por color (encima o sumado con `lighter`), doble contorno fino, aparición con *ease out back*, pop común y pool fijo de chispas (256; 96 en ligera). También respiración al compás, sombra de contacto falsa y tono del bioma. Dorado solo para lo ganado. `render.js` crea la capa común `runtime.fxLayer` y la dibuja tras `drawWorldSheetGrey`, con las partículas.
- **Familias.**
  - Encuentros vivos: brillo sumado, estela, aparición y pop al ganar.
  - Cajas: brillo que respira, sombra, doble contorno, aparición y pop dorado al abrir.
  - Chispa salvaje: halo dorado, tres motas y pops al saltar y al atraparla.
  - Maravillas: aparición, respiración, brillo, doble contorno, anillo que se escribe al acercarte y pop dorado.
  - Cristales de chispa: luz del bioma, aparición, brillo en la arista con el pulso, golpe sin `shadowBlur` y pops.
  - Sonidos raros: aparición, luz del bioma, tres ondas y pop dorado al guardarlo.
  - Partículas: chispas sumadas.
  - Ondas de pulso: se apagan con *ease out*, llevan un eco fino y la onda a tiempo brilla.
- **Tanda 0, el coste.** Habitantes píxel en un sprite por glifo. La retícula de Cristales, en una ruta por color, y las bandas de Dunas, en una por celda. `rk()` cachea por celda el mismo número que `rand()`. Pasan a sprites los degradados por fotograma de la niebla, la caja, los `glow()`, el halo del cubo, el charco de luz, la quietud y los colores lejanos. La sombra de contacto ya no usa `shadowBlur`. La paleta viva tiene caché en dos generaciones y no usa regex con alfa variable. `runtime.parts` se compacta en su sitio, reutiliza objetos (`runtime.newPart`) y toma el color una vez.
- **Sin cambios.** Mecánicas, posiciones, colisiones, guardado, sonido (`audio.js` intacto), RNG e ID de HTML se mantienen. El cubo no crece. Con movimiento reducido no hay pop, aparición, estela, eco ni ondas nuevas. En calidad ligera, la mitad de chispas, sin doble contorno ni brillo sumado, y partículas en cuadrados.
- **Medido** (Chromium sin interfaz, 390×844, DPR 1, mismos escenarios que la auditoría). Mediana de tres pasadas alternas, antes (`c8842cd`) → después:

  | Escena | CPU del navegador por fotograma (ms) | Fotogramas/s | JS p50 / p95 (ms) | Llamadas por fotograma: `fillRect` · `stroke` · degradados |
  |---|---|---|---|---|
  | Inicio (Jardín) | 23,9 → 21,4 | 46 → 52 | 5,3 / 6,6 → 4,9 / 7,1 | 1 771 → 1 008 · 14 → 13 · 31 → 7 |
  | Cristales | 27,7 → 21,9 | 41 → 51 | 6,1 / 9,6 → 5,5 / 7,4 | 2 639 → 452 · 1 561 → 243 · 39 → 7 |
  | Dunas | 19,0 → 16,2 | 58 → 60 | 5,2 / 7,6 → 5,0 / 7,4 | 1 492 → 830 · 1 313 → 140 · 21 → 5 |
  | Tormenta | 22,2 → 19,6 | 52 → 58 | 5,1 / 7,1 → 5,2 / 6,9 | 1 197 → 396 · 123 → 123 · 37 → 5 |
  | Lago | 26,9 → 24,9 | 42 → 46 | 5,1 / 6,4 → 5,1 / 7,8 | 1 070 → 392 · 324 → 325 · 16 → 6 |
  | Vacío | 18,8 → 17,4 | 59 → 60 | 4,8 / 7,2 → 5,0 / 7,1 | 448 → 316 · 31 → 34 · 24 → 8 |
  | Lago, 3 ondas y unas 400 partículas | 30,8 → 26,7 | 41 → 45 | 6,5 / 8,4 → 6,1 / 7,8 | 1 235 → 420 · 348 → 354 · 16 → 6 |
  | Encuentro vivo | 27,6 → 24,3 | 44 → 49 | 5,1 / 8,6 → 4,9 / 8,3 | 1 057 → 377 · 320 → 322 · 15 → 6 |

  La CPU suma todos los procesos del navegador, leída de `/proc`, en un servidor de 4 núcleos con rasterizado por software. `drawImage` sube de 0–19 a 42–203 por los sprites. La CPU baja entre un 7 y un 21 % con los efectos nuevos dibujados. El JS por fotograma queda igual dentro del ruido. No se midió en teléfono: hay que hacerlo con `?medir=1`.
- **Pruebas nuevas.** `tests/fx-kit.mjs` cubre el kit, la caché de la paleta, `rk` y la retícula, que dibuja las mismas aristas que antes. `tests/visual1_smoke.py` recorre 390×844 y 1280×800: sin errores, pop dorado al abrir una caja, nada nuevo con movimiento reducido, la mitad de chispas en ligera y llamadas por fotograma bajo las de `main`, sin `shadowBlur`.
- **Capturas** antes y después en el scratchpad de la sesión (`visual1-shots/antes` y `despues`, mismos nombres). No están en Git.
- **Preservación.** Capa `approvedV1` para los catorce archivos protegidos que cambian y la lista offline de `sw.js` (un módulo nuevo). Tras la unión, `approvedV1` apunta al commit de merge con `jay/viaje-d`; debajo, `approvedVD`, `approvedVC`, `approvedVB` y `approvedVA`.
- **Límites.** Probado en local (lógica, recorridos de navegador y `audio_mix.py`). Sin CI remoto, sin teléfono y sin personas.


## Lo que hay más lejos, tanda D · 2.3.0-alpha.252

Rama `jay/viaje-d`, desde `jay/viaje-a` `1ea7e84` (alpha.248, PR #387: dependencia explícita, trae la API de bandas), con `jay/viaje-c` unida por un merge (alpha.251, la tanda C de 30–60 km, que ya une `jay/viaje-b`, alpha.249, PR #388; segunda dependencia explícita). En paralelo `jay/visual-1` (alpha.250), sin tocar. Tanda D del pedido de Jay: lo que hay a 60 km o más. Guía: [El mundo](docs/MUNDO.md#tanda-d-60-km-o-más).

- **Portal de otra regla** (desde 60 km). Durante 2 min el cubo se mueve por otra regla: órbita alrededor de un punto, rebote en postes o hielo. Seis luces dentro. Al salir, todo como antes. Una consulta nueva en `render.js` (`runtime.motionRule`), nula fuera de un portal.
- **Estación del día** (desde 65 km). Cinco salas; en cada una eliges la siguiente entre tres puertas (un reto o un premio). Tres retos (compás, memoria, luces) y tres premios con sello. Se rehace cada día (`hashKey` de la fecha y del camino elegido).
- **Barrido a tempo** (desde 70 km, dentro de cada satélite). Cuadrícula de 10 × 8 en dos tonos; la línea pasa al compás y borra los cuadrados de 2 × 2 de un tono. 90 s, puntuación y récord.
- **Herencia de la mascota** (desde 80 km). Un nido da una cría a tu mascota: hereda color, notas y ritmo; «Cruce» y «Eco doble» son raros. Se ve en Bitácora › «Crías» y en el Refugio. Solo viaja si la eliges; tu mascota espera entera. `pet.js` no cambia.
- **Eclipse que cambia** (desde 90 km). Mientras dura un eclipse de Secretos del cielo, aparece la corona (seis luces) y el pulso deja estela, que también atrapa. `secretos-cielo.js` solo gana la lectura `r.skyEclipse()`.
- **Premios:** por `universeReward`, fácil, una vez al día por cosa: 15 ✦ a esta distancia (portal, estación con tres retos, barrido desde 16 casillas, corona). Las crías no pagan.
- **Una escena a la vez:** portal y hoja (`#mViajeD`) son escenas por `r.bandAttach`. La tanda D pregunta `r.bandBusy('D')`: la escena de otra tanda (A, B o C) la hace esperar, y la suya no la detiene. Los botones de la hoja no suenan.
- **Guardado nuevo** `S.viajeD` (versión 1). Campos desconocidos y versiones futuras se conservan. Si guardar falla, todo vuelve, mascota y chispas incluidas.
- Enganches: `main.js` (inicia `viaje-d.js`), `render.js` (tick, dibujo y `motionRule`), `journal.js` (sección «Crías»), `house.js` (las crías en el Refugio), `index.html` (la hoja `#mViajeD`), `estilo-j.css`, `i18n-en.js`, `sw.js` (tres módulos).
- **Sonido medido por render** (`tests/viaje_d_mix.py`): la música del Mundo es idéntica a alpha.248; los sonidos nuevos quedan 33,8 y 34,8 dB por debajo. `audio.js` y `pet.js` no cambian.
- Pruebas nuevas: `tests/viaje_d.mjs`, `tests/viaje_d_smoke.py` (390×844 y 1280×800, y paso en inglés; 106 s) y `tests/viaje_d_mix.py`. `tests/audio_mix.mjs` gana `viajeDBatch`. `tests/viaje_a_smoke.py` acepta las bandas aún no alcanzadas de B, C y D.
- Preservación: `main.js`, `render.js` y la lista offline de `sw.js`, con la capa `approvedVD` (el commit que une la tanda C; `approvedVC`, `approvedVB` y `approvedVA` debajo). Orden en `main.js`: bandas, A, B, C, D. Probado en local; sin CI remoto, sin teléfono ni personas.

## Lo que hay más lejos, tanda C · 2.3.0-alpha.251

Rama `jay/viaje-c`, desde `jay/viaje-a` `1ea7e84` (alpha.248, PR #387: dependencia explícita, trae la API de bandas), con `jay/viaje-b` unida por un merge (alpha.249, PR #388: la tanda B de 10–30 km, que ya contiene A y `main`; segunda dependencia explícita). Pedido de Jay: veinte ideas por distancia; esta tanda, 30–60 km. En paralelo `jay/visual-1` (alpha.250) y `jay/viaje-d` (alpha.252), que esta rama no toca. Guía: [El mundo](docs/MUNDO.md#lo-que-hay-más-lejos-tanda-c).

- **Púlsares** (desde 30 km; Clair Obscur y Saros). Seis destellos avisados por tanda. Con sonido, un pulso a tiempo en su golpe los devuelve como nota del acorde y suma a la racha; sin sonido, apartarse los esquiva y cuenta igual. Sin daño ni derrota.
- **Asteroides por capas** (desde 35 km; Donkey Kong Bananza). De 3 a 5 capas de colores que se rompen a pulsos, hasta uno de siete núcleos. Las capas rotas se guardan.
- **Tirolinas de luz** (desde 40 km; Death Stranding 2). Un pulso en una boya pisada tiende una línea hacia la boya de la que vienes; otro pulso te lleva por ella en pocos segundos. Solo entre boyas pisadas, como la puerta de los satélites.
- **Mares de polvo** (desde 45 km; Mina the Hollower). Un anillo de rocas hace de muro en la superficie; un pulso hunde el cubo, que pasa por debajo y sale por el otro lado. En el centro, a veces, un hallazgo que solo se ve hundido. Bajo el polvo la música suena apagada (filtro de confort, como el eclipse).
- **Kit de herramientas** (desde 50 km; Hades II). Red, imán y caña, para siempre, en cajas. Abren bancos de luz, chatarra de satélite y pozos de estrellas; se recogen pasando o pulsando cerca, sin botón nuevo.
- **Premios** por `universeReward`: tanda de púlsar 15 ✦ a 30 km (una vez al día por púlsar, racha de 4 o más), núcleo 12 (una vez por asteroide), hallazgo bajo el polvo 12 (una vez por mar), punto 12 desde 50 km (una vez al día). Herramientas y tirolinas, sin chispas.
- **Una escena a la vez:** tanda de púlsar, viaje en tirolina y tiempo bajo el polvo, con `r.bandAttach` (`busy`). La tanda C pregunta `r.bandBusy('C')`: la escena de otra tanda (un reto de A, una región apagada de B) la hace esperar, y la suya no la detiene. A y B preguntan `r.bandBusy('A')` y `r.bandBusy('B')`, como trae `jay/viaje-b`.
- **Guardado nuevo** `S.viajeC` (versión 1). Se conservan campos desconocidos; una versión futura no se toca. Si guardar falla, todo vuelve, chispas incluidas.
- **Sonido medido por render** (`tests/viaje_c_mix.py`). La música del Mundo es idéntica a alpha.248; los sonidos nuevos quedan 31,2 y 32,3 dB por debajo; bajo el polvo los agudos bajan 18–26 dB sin cambiar el nivel y vuelven solos. `audio.js` no cambia.
- Pruebas nuevas: `tests/viaje_c.mjs`, `tests/viaje_c_smoke.py` (390×844 y 1280×800, e inglés; 114 s) y `tests/viaje_c_mix.py`. `tests/audio_mix.mjs` gana `viajeCBatch` y `dust`. `tests/viaje_a_smoke.py` acepta las bandas aún no alcanzadas de B y C; `tests/viaje_c_smoke.py` da por vistas todas las bandas de menos de 30 km. Una clave repetida de `i18n-en.js` («Campana de polvo», en B y C) queda una vez.
- Preservación: cambian `main.js`, `render.js` y la lista offline de `sw.js` (dos módulos), con la capa `approvedVC` (el commit que une la tanda B; `approvedVB` y `approvedVA` debajo). Orden en `main.js`: bandas, tanda A, tanda B, tanda C. Probado en local; sin CI remoto, sin teléfono ni personas.


## Lejos del origen, tanda B · 2.3.0-alpha.249

Rama `jay/viaje-b`, desde `jay/secretos-2` `e16d9f7` (alpha.247, PR #386 sin fusionar: dependencia explícita), con `jay/viaje-a` unida por un merge (alpha.248, PR #387 sin fusionar: la tanda A de 0–10 km y el módulo de bandas; segunda dependencia explícita). Pedido de Jay: repartir ideas por distancia al origen para que llegar lejos sea un premio. Esta tanda, de 10 a 30 km. Guía: [El mundo](docs/MUNDO.md#lejos-del-origen-tanda-b). Código: `src/lejos-b-model.js` (reglas) y `src/lejos-b.js` (juego).

- **Dónde.** Celdas de 800 m con `hashKey`; tres de cada cinco tienen una cosa de un tipo cuya banda alcanza ese punto, lejos de los satélites. Cada cosa sigue apareciendo más allá de su banda. Desde 800 m, una marca en el borde.
- **Región apagada (10 km).** Gris, con la música unos 10 dB más baja. Cuatro brasas: pasar y pulsar a tiempo (sin sonido, pasar). Revivida para siempre: color, peces de luz y música; en el Mapa del universo.
- **Hábitat (12 km).** Un nido y dos o tres elementos (roca, agua, luz). Pasar por ellos los junta y llega una de cuatro criaturas, que te reconoce al volver.
- **Canción del cielo (15 km).** Cuatro piedras que insinúan su frase. Cuatro notas en orden y a tiempo cambian el cielo un minuto: aurora, lluvia de estrellas o nebulosa, con los dibujos de `universe-layers.js`.
- **Fusión de sonidos (20 km).** Se abre al llegar a 20 km. En el Refugio, «Más › Fusión de sonidos»: dos sonidos del álbum dan uno nuevo, fijo por el par y en la escala. Entra en el álbum («Fusiones») y en la mezcla.
- **Postal de buscar (25 km).** Una criatura perdió cinco cosas entre muchas estrellas. Un pulso las ilumina; pasar las encuentra. Las cinco dan su postal.
- **Premios.** Por `universeReward`, como un encuentro vivo fácil: región revivida 8–15 ✦, hábitat 8–11, primera canción de un sitio 8–15. Postal y fusión, sin chispas: su página y su sonido.
- **La música de la región apagada.** Por `runtime.musicDuck`, la línea de `audio.js` autorizada en alpha.246. `audio.js` no cambia.
- **Una escena a la vez.** Nada responde con otra escena. Postal, cielo cercano o región apagada hacen esperar a encuentros, figuras, lluvias y eclipses (`lejosBBusy`, leído por `live-encounters.js`, `sky-map.js`, `descubrir.js`, `recorrer.js` y `secretos-cielo.js`, y por las bandas en `r.bandBusy()`). Un reto de la tanda A espera a estas escenas, y estas al reto (`r.bandBusy('A')`, `r.bandBusy('B')`).
- **En las bandas de la tanda A.** `lejos-b-model.js` registra las cinco con `registerBand`: un aviso al cruzar 10, 12, 15, 20 y 25 km («Aquí empiezan las regiones apagadas.») y su fila en Bitácora › «Lo que hay más lejos», con su línea («2 revividas»). `lejos-b.js` engancha su escena y sus líneas con `r.bandAttach`. A 10 km salen dos avisos seguidos: tablones y regiones apagadas.
- **Bitácora** › «Lejos del origen · N», solo con lo encontrado. **Mapa del universo:** regiones revividas y hábitats.
- **Guardado nuevo** `S.lejosB` (versión 1). La fusión escribe además su sonido en `S.soundAlbum.sounds`. Una partida anterior empieza vacía; se conservan campos desconocidos; una versión futura solo se lee. Si guardar falla, todo vuelve, álbum y chispas incluidos.
- **Sonido medido por render** (`tests/lejos_b_mix.py`). La música del Mundo es idéntica a alpha.247. Los sonidos nuevos quedan 29,9 y 30,9 dB por debajo. En una región apagada la salida baja 10,4 dB y al revivir vuelve a menos de 0,02 dB.
- Pruebas nuevas: `tests/lejos_b.mjs`, `tests/lejos_b_smoke.py` (390×844, 1280×800 e inglés) y `tests/lejos_b_mix.py`. `tests/audio_mix.mjs` gana `lejosBatch` y `deadRegion`.
- Preservación: cambian `main.js`, `render.js` y la lista offline de `sw.js`, con la capa `approvedVB` (el commit que une la tanda A; `approvedVA` debajo). Probado en local; sin CI remoto, sin teléfono ni personas.


## Lo que hay más lejos, tanda A · 2.3.0-alpha.248

Rama `jay/viaje-a`, desde `jay/secretos-2` `e16d9f7` (alpha.247, PR #386 sin fusionar: dependencia explícita). Pedido de Jay: veinte ideas repartidas por distancia al origen, para que llegar más lejos sea en sí una recompensa. Esta es la tanda A, 0–10 km; B (10–30 km) va en paralelo en `jay/viaje-b`. Guía: [El mundo](docs/MUNDO.md#lo-que-hay-más-lejos).

- **Bandas** (`src/bandas-model.js`, `src/bandas.js`). Cada cosa se registra con el km donde empieza y sigue apareciendo más allá (sitios fijos por `hashKey`). Un aviso discreto la primera vez que cruzas 1, 2, 5 y 10 km («Aquí empiezan los radares de ritmo.»). Bitácora › Mapa › «Lo que hay más lejos»: las bandas alcanzadas con sus cosas; las que faltan, «?» con su km. API documentada para las tandas B, C y D (`registerBand`, `bandSiteAt`, `r.bandAttach`).
- **Interruptor de reto** (desde 500 m). Tocarlo empieza un reto de 30 s sin menú: cinco aros en orden (pulso a tiempo; sin sonido, pasar por ellos). Desde 5 km, la mitad son de ocho luces que recoger.
- **Radar de ritmo** (desde 1 km). Cuenta tu racha de pulsos a tiempo al pasar por su zona de 30 m y guarda tu récord por radar. Sin sonido lo dice y no cuenta.
- **Pelota de luz** (desde 2 km). Se patea con el pulso, rebota en las rocas con notas del acorde y entra en una portería de 15 m entre dos rocas: «¡Gol!» con una fiesta pequeña. Pensada para Luca.
- **Bengala** (desde 0 km). Menú › Más › «Lanzar bengala»: una luz alta donde estás, con su marca en el borde desde cualquier distancia, su «?» en el Mapa del universo y dos notas cada cuatro compases desde su lado. Al volver se apaga. Sin control nuevo en pantalla: el pulso largo ya abre el escáner.
- **Tablón de encargos** (desde el primer satélite, 10 km). Tres encargos al día de criaturas: recoger un sonido raro, ir a una boya (con su «?» en el mapa) y cazar un encuentro vivo o ganar un reto. Se cumplen donde pasan; hasta seis abiertos.
- **Premios:** por `universeReward`, una vez al día por cosa: reto 10 ✦ (15 a tiempo), récord de radar 10, primer gol del día 10 (15 a tiempo), encargo 15 a 10 km. Bengala y bandas, sin chispas.
- **Una escena a la vez:** un reto detiene encuentros vivos, figuras, meteoros, eclipses y marcas del borde (`r.bandBusy`, una línea en `live-encounters.js`, `sky-map.js`, `descubrir.js`, `recorrer.js` y `secretos-cielo.js`). El Mapa del universo lee `r.bandMapPoints`; la Bitácora, `r.bandasSection`.
- **Guardados nuevos** `S.bandas` y `S.viajeA` (versión 1). Una partida anterior empieza vacía y da por dados, en silencio, los avisos de lo ya alcanzado. Se conservan campos desconocidos; una versión futura no se toca. Si guardar falla, todo vuelve, chispas incluidas.
- **Sonido medido por render** (`tests/viaje_a_mix.py`). La música del Mundo es idéntica a alpha.247. Aros, radar, pelota, gol y bengala quedan 32,5 y 34,2 dB por debajo. `audio.js` no cambia.
- Pruebas nuevas: `tests/viaje_a.mjs`, `tests/viaje_a_smoke.py` (390×844 y 1280×800, e inglés; 97 s) y `tests/viaje_a_mix.py`. `tests/audio_mix.mjs` gana `viajeBatch`.
- Preservación: cambian `main.js`, `render.js` y la lista offline de `sw.js` (cuatro módulos), con la capa `approvedVA`. Probado en local; sin CI remoto, sin teléfono ni personas.


## Secretos del cielo · 2.3.0-alpha.247

Rama `jay/secretos-2`, desde `main` `783a704` (alpha.246). Segunda tanda de secretos, aprobada por Jay: cuatro cosas, todas del espacio. Guía: [El mundo](docs/MUNDO.md#secretos). Código: `src/secretos-cielo-model.js` (reglas) y `src/secretos-cielo.js` (juego).

- **Meteoros que se cazan.** Una lluvia de siete estrellas fugaces pasa junto al cubo cada 5–9 min de juego en el Mundo libre (`hashKey` del número de lluvia). Con sonido, un pulso a tiempo cuando una pasa cerca la caza. Sin sonido, pasar por ella o cualquier pulso cerca (como la chispa salvaje desde alpha.242). Paga como un encuentro vivo, por `universeReward`: base 5 × difícil 2 × distancia, por la parte cazada. Una lluvia entera cerca del origen da 10 ✦; a tiempo, 15.
- **50 cristales de cometa** en puntos fijos (`hashKey`), de 1,7 a 89 km; cuatro a menos de 3 km. Se ven en pantalla y brillan en el borde desde 150 m. Se recogen pasando o con un pulso. Sin chispas. Los 50 dan la **Órbita de cometa**: tres cristales dorados que giran junto al cubo, que no crece. Se quita en Tu cubo › Secretos, junto al Cubo dorado.
- **Sondas perdidas.** Doce, fijas (`hashKey`), de 2 a 46 km. Con sonido pitan en los compases, más fuerte al acercarse (dos notas en la quinta). Sin sonido, una marca en el borde. Encontrar una da una coordenada secreta hacia un cristal, el asteroide secreto o un satélite de descanso: un «?» blanco en el Mapa del universo, con «Marcar». Se cumple al llegar.
- **Eclipse.** Uno de cada tres cuadros de 4 × 4 km tiene una estrella y un planeta. El planeta la tapa 12 s en cada vuelta de 4–6 min, según el reloj del dispositivo. Si el cubo está a 70 m en ese momento, la pantalla se oscurece y la música se apaga en agudos durante 8 s. Luego vuelve sola.
- **Cómo cambia la música.** Por el filtro de confort que ya expone `audio.js` (`runtime.comfortLowpass`). Mientras dura, se mantiene a 650 Hz; al acabar, `applyComfort` lo devuelve. `audio.js` no cambia.
- **Una escena a la vez.** No empieza lluvia ni eclipse con un encuentro vivo, una figura o una travesura. Mientras duran, encuentros y figuras esperan y las marcas del borde callan (`skySecretBusy`).
- **Bitácora** › Secretos: cada página solo cuando se encuentra («Cristales de cometa · N de 50», sondas con sus coordenadas, estrellas cazadas, eclipse). Lo demás, «?».
- **Guardado nuevo** `S.skySecrets` (versión 1): cristales, sondas, coordenadas, lluvias, eclipses y la órbita puesta. Una partida anterior empieza vacía; se conservan campos desconocidos; una versión futura solo se lee. Si guardar falla, todo vuelve, chispas incluidas.
- **Sonido medido por render** (`tests/secretos_cielo_mix.py`). La música del Mundo es idéntica a alpha.246. Pitidos, meteoros y cristales quedan 31–33 dB por debajo. El eclipse baja los agudos 23–32 dB, deja el nivel igual y vuelve en 2–3 s.
- Pruebas nuevas: `tests/secretos_cielo.mjs`, `tests/secretos_cielo_smoke.py` (390×844, 1280×800 e inglés) y `tests/secretos_cielo_mix.py`. `tests/audio_mix.mjs` gana `skySecretBatch` y `eclipse`. `tests/secretos_smoke.py` cuenta ahora ocho «?».
- Preservación: cambian `main.js`, `render.js` y la lista offline de `sw.js`, con la capa `approvedF5b`. Probado en local; sin CI remoto, sin teléfono ni personas.


## Satélite limpio · 2.3.0-alpha.246

Rama `jay/satelite-limpio`, desde `main` `d4f62d2` (alpha.245). Pedido por Jay. Dentro de un satélite de descanso, la música baja por igual y ya no suena más espaciosa.

- **Motor:** una línea de `audio.js`, autorizada por Jay. `musicVolume` multiplica por `runtime.musicDuck`, que vale 1 en todo lo demás. El contrato de preservación sujeta `audio.js` a Q7, más la línea de las escenas y esta.
- **Recorrer lejos** (`recorrer.js`): ya no toca el bus seco. Pone `runtime.musicDuck` en `SAT_DUCK` (0,84 dentro y 1 fuera) y lleva la salida a su nivel en 0,6 s. `recorrerState()` informa `musicDuck`.
- **Pruebas:** `tests/recorrer.mjs` y `tests/recorrer_smoke.py` siguen `musicDuck`. `tests/recorrer_mix.py` comprueba además que la bajada es estable de ventana en ventana. `tests/audio_mix.mjs` usa la misma vía.

## Recorrer lejos (F2, primera tanda) · 2.3.0-alpha.245

Rama `jay/boyas`, desde `main` `48fd03f` (alpha.242). Mezclada después con `main` (Escenas, alpha.243, PR #382, y Secretos, alpha.244, PR #383). Aprobado por Jay: ideas 59 y 66 del [catálogo](docs/IDEAS_UNIVERSO.md#f2--recorrer-lejos-5966-115119-y-57) y la puerta de la decisión 11. Guía: [El mundo](docs/MUNDO.md#recorrer-lejos).

- **Boyas de luz** (`recorrer.js`, `recorrer-model.js`). En cada km de distancia al origen, un anillo de boyas blancas a 1 km una de otra, cada una con su número. La siguiente hacia fuera se marca en el borde. Al pasar a 15 m, una nota suave del acorde que suena, en el pulso. Unas 100 en un cuadrado de 10 × 10 km; en pantalla, una a la vez. Se eligió la distancia al origen (decisión 5) y no el km caminado: así están fijas en el mapa y nada se mueve.
- **Satélites de descanso.** En cada anillo de 10 km, uno cada ~10 km, con luz cálida. Desde 6 km, marca en el borde. Al entrar se guarda como punto de retorno («Satélite de descanso · 10 km · Punto de retorno guardado»). Dentro, la música baja 1,0–1,5 dB (medido por render).
- **La puerta.** Desde dentro de un satélite visitado, «Ir por la puerta» lleva a otro visitado (tarjeta del Mapa del universo o Bitácora) y «Volver al anillo», al anillo. Nunca a un sitio no pisado: no es un salto libre.
- **Mapa y Bitácora.** Los satélites visitados salen en el Mapa del universo (cuerpo con dos paneles). En la Bitácora, Mapa › «Recorrer lejos · N satélites», con la boya más lejana.
- **Sin chispas.** Ni las boyas (señalan el camino; pagar cada km haría de caminar recto la mejor renta, contra H1) ni los satélites (lo especial no paga, decisión 9). La puerta no cuesta ni paga.
- **Sonido.** La nota de la boya y las dos del satélite quedan 27,5 y 29,0 dB bajo la música (`tests/recorrer_mix.py`). La bajada usa el bus seco de la mezcla (`runtime.bus` a 0,5); `audio.js` no cambia. El compresor recupera parte y la sala y el eco no bajan, así que dentro suena algo más espacioso. Una bajada limpia de todo exigiría tocar `audio.js`.
- **Guardado nuevo** `S.recorrer` (versión 1): satélites visitados (con su mundo y día), el último, la boya más lejana y cuántas pasaste. Una partida anterior empieza vacía; se conservan campos desconocidos; una versión futura solo se lee. Si guardar falla, todo vuelve como estaba.
- Pruebas nuevas: `tests/recorrer.mjs`, `tests/recorrer_smoke.py` (390×844, 1280×800 e inglés) y `tests/recorrer_mix.py` (render). `tests/audio_mix.mjs` gana `recorrerBatch` y `recorrerDuck`.
- Preservación: cambian `main.js`, `render.js`, `i18n-en.js` y la lista offline de `sw.js`, con la capa `approvedF2`. Probado en local; sin CI remoto, sin teléfono ni personas.

Estado anterior: 3 de noviembre de 2026. Código **2.3.0-alpha.242** en la rama `jay/arreglos-30`.

## Secretos · 2.3.0-alpha.244

Rama `jay/secretos`, desde `main` `48fd03f` (alpha.242). Mezclada después con `main` (Escenas, alpha.243, PR #382). Iba a ser alpha.245; pasa a alpha.244 porque entra antes que `jay/boyas`. Primera tanda de F5, aprobada por Jay tras una auditoría de media hora sin ningún easter egg. Guía: [El mundo](docs/MUNDO.md#secretos).

- **Código de flechas** ↑↑↓↓←→←→ con teclado o deslizamientos: destello blanco, arpegio de ocho notas en la armonía y ocho cuadritos alrededor del cubo; vuelve solo en 20 s.
- **Logo siete veces** (cabecera del menú): el cubo pone cara rara 10 s. Silencioso.
- **Origen, 42, 77 y 100 km:** página en la Bitácora, aviso y acorde corto, una vez cada uno.
- **Cubo dorado** a 100 km: marco dorado pegado al cubo, que no crece; se quita en Tu cubo (`#cubeSecretSection`, `#cubeSecretGold`).
- **Asteroide secreto** con una nota breve y neutra, en un punto fijo a unos 4,2 km.
- **Fechas reales** sin red: nieve de estrellas (24–25 dic), fuegos (31 dic–1 ene), luna llena real de noche (calculada) y globos de luz el 1 de agosto, sin nombrar a nadie ni guardar el año. Se apagan con movimiento reducido; no se añadió interruptor.
- **Bitácora** › Mapa › «Secretos · N»: lo encontrado; lo demás, «?».
- Ninguno paga chispas. Sin azar: puntos fijos, nada del mapa se mueve.
- Guardado nuevo `S.secrets` (versión 1), normalizado y migrado; versiones futuras solo se leen.
- Sonido medido por render (`tests/secretos_mix.py`): la música del Mundo, idéntica a alpha.242; los arpegios y acordes, 27–28 dB por debajo. `audio.js` no cambia; `tests/audio_mix.mjs` gana la opción `secretBatch`.
- Pruebas nuevas: `tests/secretos.mjs`, `tests/secretos_smoke.py` (390×844 y 1280×800, reloj simulado) y `tests/secretos_mix.py`.
- Preservación: cambian a propósito `main.js`, `render.js` y la lista offline de `sw.js` (dos módulos nuevos), con la capa `approvedF5`. Probado en local; sin CI remoto, sin teléfono ni personas.

Estado anterior: 3 de noviembre de 2026. Código **2.3.0-alpha.242** en la rama `jay/arreglos-30`.

## Escenas musicales, entrega 1 · 2.3.0-alpha.243

Rama `jay/escenas`, desde `main` (`67f031b`, alpha.240), mezclada después con `main` (Arreglos de la media hora, alpha.242, PR #381). Iba a ser alpha.241; pasa a alpha.243. Aprobado por Jay: cada escenario se siente como un club o un festival concreto, con variación sin fin, sin quitar ni cambiar nada de la música que ya suena. Guía: [Universo](docs/UNIVERSO.md#escenas-musicales). La rama `jay/arreglos-30` (alpha.242) va en paralelo y no se toca.

- **Ajuste «Escenas: más variedad»** en Sonido, apagado por defecto, guardado en `S.scenes` con migración segura (sin borrar nada; versión futura leída apagada). Apagado, el render es el de `main`.
- **Escenarios** por `hashKey('scene:v1:'+zona)`: uno en cada diez zonas de 2×2 regiones cerca del origen, uno en cada seis más allá de 5 km, solo donde el género tiene escena. Se oyen desde 520 m y suben poco a poco; al irse, bajan en tres compases y el bus se suelta.
- **Almacén** (techno, minimal, acid, EBM): bombo largo y rumble, hats de semicorchea, ride con aire, 303 resonante con envolvente que sube, golpes metálicos; breakdown, riser y caída. **Patio latino** (tech house, minimal, deep, afro): congas, bongós, timbal, cencerro en clave, shaker con swing, bajo rodante, chops vocales sintéticos de formantes y un paso alto que se abre.
- **La mano** de cada escenario (hats, swing, kit, filtro, relleno cada 8/16, arco de 32/64 compases) y patrones nuevos en cada vuelta del arco. Todas las notas salen del acorde que suena; la armonía no cambia.
- **Motor:** una línea en `audio.js` (`runtime.sceneStep?.(s,bar,t)`, tras `phenomenaStep`), autorizada por Jay. Bus propio hacia la etapa de salida tras el compresor de la música. Línea al entrar: «Escena · Almacén» / «Escena · Patio latino».
- **Pruebas:** `tests/scenes.mjs`, `tests/scenes_mix.py` (apagado = `main` en tres géneros; encendido, en 64 compases: picos 0,93, 3,6–3,7 % de energía sobre 4 kHz frente a 0,01–0,02 %, rango 6,5–6,8 dB frente a 3,6–4,8, timbre a 8,7–9,4 dB de la base), `tests/scenes_smoke.py` (390×844 y 1280×800). `tests/audio_mix.mjs` admite renders de hasta 180 s y la opción `stageScene`. Verificador de preservación: capa `approvedS`.
- **Límites:** sin escucha en teléfono ni auriculares, CPU móvil sin medir, sin CI remoto ni personas. En la caída la escena suma unos 5 dB y el limitador trabaja más. Sin marca en el Mapa ni la Bitácora.

## Arreglos de la media hora · 2.3.0-alpha.242

Rama `jay/arreglos-30`, desde `main` `67f031b` (alpha.240). alpha.241 es `jay/escenas`, que esta rama no toca. Aprobado por Jay tras una sesión de bot de media hora en el Mundo libre sin sonido. Ningún encuentro, figura, actividad ni nota de música cambia. Guía: [El mundo](docs/MUNDO.md#arreglos-de-la-media-hora).

- **Chispa salvaje sin sonido** (`wild.js`). Con el sonido apagado, pasar por ella (4 m) la atrapa, por los mismos 15 ✦; el aviso dice «Una chispa salvaje. Pasa por ella.». Con sonido, los cinco pulsos a tiempo de siempre. Se eligió atraparla y no ocultarla: sin sonido sigue habiendo algo que buscar con la flecha del borde.
- **Rumores** (`descubrir-model.js`, `descubrir.js`). Si ninguno abierto queda a 3 km o menos, el siguiente apunta a 1–3 km (claves propias `rumor:near:v1`). Llegan espaciados, 100 s de juego como mínimo. Cada cumplido debe otro, que llega 75 s después (`S.rumors.owed`, hasta tres). Tras completar algo, la tirada espera 3 s (`RUMOR_AFTER`) para que primero salga su propio aviso (el halo, un encuentro nuevo).
- **Encuentros vivos** (`live-encounters-model.js`, `livePick`). Nunca el mismo dos veces seguidas (`live:other:v1`, último en `S.liveEncounters.last`). A menos de 5 km del origen, la mitad de los turnos del Vacío los toma el bioma de tierra más cercano (`live:void:v1`). La tirada de siempre (`live:pick:v1`) decide primero.
- **Travesuras** (`universe-mischief.js`). Sin avance, a los 10 s dejan de retener encuentros y figuras (`mischiefBusy`); a los 40 s se despiden solas («Se despidió.»), sin coste.
- **Marcas en el borde** (`descubrir.js`). Actividades (cuadrado), hallazgos del cubo (rombo) y cajas mágicas (rombo con punto) a 300 m o menos dejan una marca blanca en el borde, como los sonidos raros.
- **Logros en la primera media hora** (`achievements.js`). Durante los primeros 30 min del Mundo libre (`S.firstWorldSeconds`), los menores («· N») no avisan y los demás llegan de uno en uno cada 3 min, el más especial primero. Todos quedan sin leer en la Bitácora. Una partida con 40 logros o más cuenta como pasada.
- **Medido con el bot de audit30** (12 min por recorrido, sin sonido, mismo nombre y semilla; antes = `main` alpha.240):

| Recorrido | Avisos de logro | Rumores: km y segundo del tercero | Encuentros del Vacío | Travesura retenida |
|---|---|---|---|---|
| Cerca del origen | 30 → 4 (≈75 → 10 en 30 min) | 40, 15, 30 km · 167 s → 2, 15, 1 km · 274 s | 5 de 7 → 3 de 7 | — |
| A 25 km | 32 → 4 | tercero a 276 s → 345 s | 2 de 6 → 5 de 8 (regla solo bajo 5 km) | — |
| Cerca, sin escape del bot | 19 → 4 | tercero a 167 s → 306 s | 1 de 1 → 0 de 5 | ≈390 s («Escultura bailarina») → ≈85 s (dos «Paisaje contenido» de ~48 s) |

  Modelo de 60 rutas de 30 min (`measure-live`): encuentros repetidos seguidos 113 de 1 404 → 0 (cerca) y 109 → 0 (a 25 km); parte del Vacío cerca del origen 48 % → 25 %; el rumor más cercano de los tres primeros a 3 km o menos, 50 % → 100 % de las rutas. Marcas del borde: alguna visible en el 60 % del tiempo cerca del origen y el 46 % a 25 km. Chispa salvaje: el bot no la persigue y sale «Se fue» igual (6 de 6); yendo hacia ella como haría quien ve la flecha, 7 atrapadas de 7 y ningún «Se fue» en 12 min. Antes, sin sonido, era imposible atraparla sin pulsar cinco veces.
- Guardado: `S.rumors.owed`, `S.liveEncounters.last` y `S.firstWorldSeconds`, solo cuando hay valor; las versiones no cambian; los campos desconocidos y las versiones futuras se conservan.
- Pruebas nuevas: `tests/arreglos30.mjs`, `tests/arreglos30_mundo_smoke.py` y `tests/arreglos30_escenas_smoke.py` (390×844 y 1280×800). `tests/live-encounters-runtime.mjs` sigue la nueva tirada y la travesura que se despide.
- Preservación: cambian a propósito `wild.js`, `universe-mischief.js` y `achievements.js`, con la capa `approvedA30`. Probado en local; sin CI remoto, sin teléfono ni personas.


## Descubrir · 2.3.0-alpha.240

Rama `jay/descubrir`, desde `jay/ritmo` (`14f6627`, alpha.237), mezclada después con `main` (Ritmo ya en `main`, `20008af`). La versión es alpha.240: alpha.239 es «Con Luca» (`jay/con-luca`, PR #379), que esta rama no toca. Aprobado por Jay: rumores y álbum de sonidos en el universo abierto. Guía: [El mundo](docs/MUNDO.md#descubrir).

- **Rumores.** Completar un encuentro vivo, una figura del Mapa del cielo, una actividad o una travesura trae a veces (el primero siempre; luego cerca de uno de cada dos, por `hashKey`) un aviso: «Rumor · Dicen que al sureste, a 40 km, canta una ballena.». Apunta siempre a algo que está allí, a esa distancia y en ese rumbo: una figura del cielo de las de día, una rareza, un hito, un sonido raro o, si no, el bioma. Lejos manda lo raro (desde 20 km rarezas y figuras raras; desde 50 km, leyendas). Tres abiertos como mucho, sin caducidad. En el Mapa del universo, un «?» blanco cuya tarjeta ofrece «Marcar» (la brújula lo sigue); en la Bitácora, con dónde está ahora, «Marcar» y «Soltar» (sin coste). Al llegar se cumple: aviso, «Cumplido · …» en la Bitácora y la marca se quita. No paga chispas.
- **Álbum de sonidos.** Cinco sonidos raros por bioma (55), uno por celda de 600 m con `hashKey`, del bioma de allí; el cuarto y el quinto, más raros cerca del origen. Cantan cada dos compases a menos de 260 m (punto del color del bioma, aro blanco de cerca, marca blanca en el borde si no se ve). Se recogen pasando por ellos o con un pulso a tiempo cerca. Premio por `universeReward`: nuevo, como un encuentro vivo raro (8 ✦ cerca, 11 a tiempo); repetido en otro sitio, 1 ✦. La serie completa de un bioma enciende su arco del **Aro de sonidos** (dorado, alrededor del cubo; se quita en Tu cubo), sin chispas.
- **Tu mezcla.** En el álbum (Bitácora › Mapa › «Abrir el álbum») eliges hasta cuatro y suenan juntos en bucle suave, en los compases de la música que suena, encima de ella. «Parar» o cerrar el álbum lo para.
- **Sonido:** capas encima, en la escala y el pulso del lugar (los compases de `MU.sq`; `audio.js` intacto), con un recorte por instrumento medido por render. La música del Mundo es idéntica a alpha.237 y alpha.226; los sonidos quedan 28,0 y 28,9 dB por debajo (`tests/descubrir_mix.py`).
- **Guardado nuevo:** `S.rumors` y `S.soundAlbum` (versión 1). Partidas anteriores empiezan vacías; campos desconocidos conservados; una versión futura solo se lee; un fallo al guardar deshace todo (chispas incluidas).
- Cableado: `main.js` arranca `descubrir.js`; `render.js` le da su paso, su dibujo y el Aro; `journal.js` su sección; `universe-map*.js` el icono, la tarjeta y `setMapMark` (la leyenda separa «Rumor» y «Hito oído»); `index.html` añade `mSoundAlbum` y `cubeSoundSection` (ningún id quitado); `estilo-j.css`; inglés en `i18n-en.js`.
- Pruebas nuevas: `tests/descubrir.mjs`, `tests/descubrir_rumores_smoke.py`, `tests/descubrir_sonidos_smoke.py` (390×844 y 1280×800, inglés) y `tests/descubrir_mix.py`; `tests/audio_mix.mjs` gana la tanda `soundBatch`.
- Preservación: cambian a propósito `main.js`, `render.js` y la lista offline de `sw.js` (dos módulos nuevos), con su capa `approvedD`. Probado en local; sin CI remoto, sin teléfono ni personas.
Estado: 29 de octubre de 2026. Código **2.3.0-alpha.239** en la rama `jay/con-luca`. Las entradas describen su revisión, no certifican producción.


## Con Luca · 2.3.0-alpha.239

Rama `jay/con-luca`, desde `jay/ritmo` (`14f6627`, alpha.237; PR #378 abierto): **depende de Ritmo** (usa su fantasma). En paralelo va `jay/descubrir` (alpha.238), que esta rama no toca. Aprobado por Jay para jugar con Luca en el mismo teléfono, sin cuentas ni red; ni chispas ni cambios en la música. Guía: [El mundo](docs/MUNDO.md#con-luca).

- **Reto entre dos** (`src/duos.js`, `src/duos-model.js`). Dos jugadores locales (nombre de hasta 8 letras y un símbolo blanco; «Uno» y «Dos» por defecto). Desde Lugares («Reto entre dos ›», cerca del anillo; lejos manda «Volver al anillo») o la hoja del portal («Reto»). La hoja dice «Marca de Dos: 0:42 · ¿la superas?»; durante la ronda, «● Uno · 0:12 / 0:42»; el fantasma del rival corre contigo. Al cerrar, sin castigo: «Primera marca.», «¡Nueva marca!», «Empate con la marca.», «Casi: a 1,2 s.» o «A 12,3 s de la marca.», y «Le toca a ▲ Dos» como único botón blanco. Una marca por lugar, con su camino; se borra con dos toques. **Decisión:** el reto es una ronda normal (mismas ★, Tu canción y récord); solo la marca es aparte.
- **Modo tranquilo para niños** (`src/tranquilo.js`, `src/tranquilo-model.js`). Ajustes → «Modo tranquilo para niños». En las rondas (no Maestro, que se oculta) y en el Viaje: sin reloj (el círculo de la Tormenta espera, el Jardín no se marchita, los Faros siguen 32 compases, los Cristales suenan 64 tiempos, la ola de las Dunas desde 70 u), ventana a tiempo de ±140 ms, la Línea y el aro del cubo más grandes y claros, y lo siguiente marcado con un aro blanco o una flecha en el borde. El cubo sigue pequeño. **Decisión de ★:** jugado así cuenta como sin sonido: ★ sí, ★★ y ★★★ no (la ventana ancha las regalaría); la hoja lo dice. Nada ganado se pierde; se apaga cuando se quiera.
- **Guardados nuevos** `S.duos` y `S.tranquilo` (versión 1 cada uno). Se conservan campos desconocidos; una versión futura no se toca ni se escribe. `S.retos` (retos de región) no cambia.
- Cableado: `places-ring.js` carga los dos módulos; `places.js` (solo la hoja: título «Reto», filas, Maestro oculto y el turno; los contratos de reglas y ronda intactos), `ritmo.js` (el fantasma del rival), `journey-pulse.js` (Línea, aro y objetivo; el juicio intacto), `journey-garden.js` (fuera de su contrato), `refugio-lugares.js`, `index.html` (`mDuo`, `duoLive`, `portalDuo`, `placeDuo`, `lugaresDuo`, `calmKids`; ningún id quitado) y `estilo-j.css`.
- Pruebas nuevas: `tests/luca.mjs`, `tests/luca_reto_smoke.py` y `tests/luca_tranquilo_smoke.py` (390×844 y 1280×800, inglés).
- Preservación: cambian a propósito `i18n-en.js`, `journey-dance.js`, `journey-guide.js`, `journey-resonance.js` y `journey-surf.js` (una línea cada uno: preguntan su valor tranquilo) y la lista offline de `sw.js` (cuatro módulos), con la capa `approvedL5`. Probado en local; sin CI remoto, sin teléfono ni niños.

Estado: 29 de octubre de 2026. Código **2.3.0-alpha.237** en la rama `jay/ritmo`. Las entradas describen su revisión, no certifican producción.


## Ritmo · 2.3.0-alpha.237

Rama `jay/ritmo`, desde `main` (`05b42e4`, alpha.235). En paralelo va `jay/volver` (alpha.236, «Ganas de volver»); esta rama se mezcla después. Aprobado por Jay: cuatro modos dentro de los once lugares, que dan ★ y hacen crecer Tu canción, **nunca chispas** (los niveles no pagan, `LEVEL_SPARKS=0`). Guía: [El mundo](docs/MUNDO.md#ritmo).

- **Eco.** Un lugar ya completo, de memoria: canta su frase como siempre y después la Línea y el aro del cubo dejan de dibujar sus pasos. Desde Lugares («Eco» en cada fila completa), la hoja del portal y la hoja de resultado. No en la primera vez, no en la Cueva (ya es de memoria), solo con sonido (sin sonido vuelven las señales). Es una ronda normal: ★, ★★ y Tu canción como siempre. La hoja dice «Lago · Eco» y «De memoria, sin señales.». «Dejar la ronda» sale sin perder nada.
- **Duelo final.** Tras los once, su final y su nota (`eleven-note.js`), un lugar secreto en el centro del anillo: rombo blanco con columna de luz (blanco = siguiente) y un aviso, una vez. Lugares lo lleva («Duelo final · en el centro del anillo ›»). Al entrar, una hoja negra: «Jugar» o «Ahora no». Canta los once ritmos en orden, un compás cada uno (la Cueva, cuatro corcheas fijas por `hashKey`), y respondes en el siguiente; la Línea muestra el ritmo en juego. Siempre se termina: su ★ (propia, fuera de las 33) llega al completarlo, sin umbral. La primera vez, la **Corona de los once** (once puntos dorados alrededor del cubo; se quita en Tu cubo) y su entrada en la Bitácora. Salir: «Dejar la ronda» o alejarse 1200 u; no se pierde nada. `?rapido=1` y `?rapido=2` cantan cuatro ritmos.
- **Fantasma.** Cada ronda normal o Eco guarda su camino (una muestra cada 600 ms, como mucho 160; si no caben, se quedan la mitad y el paso se dobla). La siguiente ronda de ese lugar dibuja el contorno discontinuo del cubo por ese camino; se desvanece al pasar su tiempo. Solo una ronda más rápida lo sustituye: «Le ganaste a tu fantasma · 0:04.»; más lenta: «Tu fantasma · 0:02.». Maestro, Remezcla y Libre no lo usan.
- **Combo.** Con 8 aciertos seguidos en una ronda (o en el duelo) el cubo deja una estela de cuadros blancos que crece hasta 40; un fallo la apaga en 0,8 s. Solo dibujo: no quita nada ni suena.
- **Guardado nuevo** `S.ritmo` (versión 1): Eco por lugar, un fantasma por lugar, el duelo y el aviso. Se conservan campos desconocidos; una versión futura no se toca ni se escribe. Ningún otro formato cambia.
- **Sonido:** solo el duelo canta, encima y suave, con el clic y la nota con que cada lugar ya canta su frase (`hatHit`, `pluck`). La música base no cambia.
- Cableado sin tocar archivos protegidos salvo el inglés: `places-ring.js` carga `ritmo.js` y le pasa el compás; `journey-pulse.js` (Línea y aro), `canvas.js` (tocar en cualquier sitio durante el duelo), `places.js` (la hoja), `refugio-lugares.js`, `journal.js`, `index.html` (`portalEcho`, `placeEcho`, `mDuel`, `lugaresDuel`, `cubeRitmoSection`; ningún id quitado) y `estilo-j.css`.
- Pruebas nuevas: `tests/ritmo.mjs`, `tests/ritmo_eco_smoke.py`, `tests/ritmo_fantasma_smoke.py` y `tests/ritmo_duelo_smoke.py` (390×844 y 1280×800, inglés).
- Preservación: cambian a propósito `i18n-en.js` y la lista offline de `sw.js` (dos módulos nuevos), con su capa `approvedR`. Probado en local; sin CI remoto, sin teléfono ni personas.

Estado: 29 de octubre de 2026. Código **2.3.0-alpha.236** en la rama `jay/volver`. Las entradas describen su revisión, no certifican producción.


## Ganas de volver · 2.3.0-alpha.236

Rama `jay/volver`, desde `main` (`05b42e4`, alpha.235). En paralelo va `jay/ritmo` (alpha.237), que esta rama no toca. Aprobado por Jay: racha suave y carta del universo; sin castigos, sin chispas (lo especial no paga ✦). Guías: [El mundo](docs/MUNDO.md#ganas-de-volver) y [Casa viva](docs/CASA_VIVA.md#cielo-de-días).

- **Racha suave** (`src/sky-streak.js`). Construida sobre el contador de días que ya había (`onFirstLight`: `S.lastDay`, `S.streak`, `S.totalDays`; decisión 5A), sin duplicarlo. Cada día jugado enciende una estrella blanca en el cielo del Refugio; los días seguidos se unen con un hilo. Faltar no quita nada: las estrellas y el hilo viejo se quedan y al volver empieza otro hilo. Ayer aún cuenta. El rótulo solo dice lo que hay («N estrellas · N días seguidos»; sin estrellas, «Juega hoy y se enciende una estrella.»). Tocar el cielo lo explica. Encima de la casa en teléfono; a la derecha del Cielo en pantalla ancha. Posiciones por `hashKey` del número de estrella: lo nuevo no mueve lo anterior.
- **Hitos en la Bitácora:** 3, 7, 14, 30, 60, 100 y 365 días seguidos; 10, 30, 100 y 365 estrellas, con su fecha, en la tarjeta «Cielo del Refugio» (Mapa › Recuerdos y vínculos). El día del hito, el rótulo dice «Hito: …». Sin aviso extra (los logros «Racha de N» siguen como estaban).
- **Carta del universo** (`src/universe-letter.js`). Tras cuatro horas o más fuera, un aviso pequeño: «Mientras no estabas · Una ola gigante pasó por el Lago.». Sale de los encuentros vivos de cada bioma (31 frases; «Tu reflejo» y «Tu eco» fuera) y de las figuras del Mapa del cielo unidas; primero lo que conoces. `hashKey` del día; una por apertura; cola de avisos (`#toast`, nivel 2, 7 s); un toque la cierra; no bloquea. Espera al saludo, a las hojas, al Viaje y la vista tranquila, a una ronda, actividad o encuentro vivo y a los finales; con los textos del universo apagados no sale. Sin humanos. La primera apertura no trae carta.
- **Guardado nuevo:** `S.skyStreak` y `S.universeLetter` (versión 1 cada uno). Se migran sin perder campos: una partida anterior enciende todos sus días ya jugados; una versión futura solo se lee. Si escribir falla, la estrella o la carta no cuentan y se reintenta. Ningún otro formato cambia.
- **Toques:** `house.js` llama al dibujo del cielo y a su toque (archivo ya abierto en preservación); `journal.js` añade la tarjeta; `main.js` inicia los dos módulos; `sw.js` los lista una vez; `estilo-j.css` deja tocar la carta. Inglés en `i18n-en.js`. Música y sonido sin cambios (nada nuevo suena).
- Pruebas nuevas: `tests/sky-streak.mjs`, `tests/universe-letter.mjs` y `tests/volver_smoke.py` (390×844 y 1280×800). No se ajustó ninguna prueba existente.
- Preservación: cambian a propósito `main.js`, `i18n-en.js` y la lista offline de `sw.js` (dos módulos nuevos), con su capa `approvedV`. Probado en local; sin CI remoto, sin teléfono ni personas.


## Mapa del universo · 2.3.0-alpha.235

Rama `jay/mapa-universo`, desde `main` (`e5d48fe`, alpha.233). En paralelo va `jay/h2-refugio` (alpha.234, Refugio simple). Aprobado por Jay: «el mapa tiene que ser perfecto». Guía: [El mundo](docs/MUNDO.md#mapa-del-universo).

- **Pantalla propia.** Un toque desde el botón del mapa junto al menú (`#bUniverseMap`), en el Mundo libre tras el Viaje. La pestaña Mapa de la Bitácora muestra una vista quieta de lo descubierto; «Abrir el mapa» o tocarla abre la misma pantalla. Sustituye al recuadro de cuadros marrones (`map.js` ya no dibuja, conserva `mapData`, la nota, «Ir a» y Compartir, que usa el dibujo nuevo). No se quitó ningún control.
- **Tres acercamientos:** Anillo, Región y Universo, con «+» y «−», pellizco y rueda; arrastrar desplaza; ◎ centra en ti. Lejos, los once lugares son un anillo pequeño.
- **Niebla real:** lo visitado con el color de su bioma, en discos suaves que se funden; lo demás negro. Anillos a 5, 20 y 50 km del origen y el porcentaje descubierto del primero sin completar. Un anillo entero descubierto se guarda, se pinta en dorado y avisa una vez; sin chispas (lo especial no paga, decisión 9).
- **Tú y lo tuyo:** el cubo con su rumbo, una línea blanca al siguiente lugar con su distancia, los once con sus ★, el Refugio, favoritos, hitos y rumores «?», rarezas, figuras del Mapa del cielo completas y a medias, y los encuentros vivos que viste (se anotan al terminar). Leyenda plegable.
- **Tarjeta al tocar:** «Ir» solo donde ya se podía ir (un lugar pisado o con ★, el siguiente desde lejos, «Volver al anillo», un favorito), con las funciones de Lugares y Favoritos: sin saltos libres antes de los once. Lo demás, «Marcar»: una sola marca, guardada; la brújula del cubo y la línea bajo el HUD la siguen; se quita en su tarjeta, al llegar o con «Seguir hacia».
- **Mini-mapa** opcional en Ajustes, apagado por defecto (el Mundo ya orienta con brújula y columna de luz); encendido, 90 px abajo a la izquierda, sin tapar HUD ni avisos.
- **Rendimiento:** nada se dibuja con el mapa cerrado; la niebla va cacheada. En Chromium sin GPU abre en 24 ms (600 regiones) y 56 ms (3.000). Sin medida en teléfono.
- **Guardado nuevo** `S.universeMap` (versión 1, migrado sin perder campos; una versión futura se respeta). Ningún otro formato cambia. Inglés en `i18n-en.js`. Música y sonido sin cambios (el mapa no suena).
- Pruebas nuevas: `tests/universe-map.mjs`, `tests/universe_map_smoke.py`, `tests/universe_map_mark_smoke.py` y `tests/universe_map_english_smoke.py`. Ajustadas sin quitar aserciones de otras cosas: `refugio-legible.mjs` (el dibujo llena su caja, ahora en `universe-map.js`), `journey_smoke.py` («Abrir el mapa» abre la pantalla; se vuelve para Compartir) y `focusui_smoke.py` (el dock del Mundo tiene menú y mapa).
- Preservación: cambian a propósito `i18n-en.js` y la lista offline de `sw.js` (tres módulos nuevos), con su capa `approvedM`. `map.js` y `places-ring.js` ya estaban abiertos (P1). Probado en local; sin CI remoto, sin teléfono ni personas.
Estado: 28 de octubre de 2026. Código **2.3.0-alpha.234** en la rama `jay/h2-refugio` (en `main`, alpha.233). Las entradas describen su revisión, no certifican producción.


## Refugio simple (H2) · 2.3.0-alpha.234

Rama `jay/h2-refugio`, desde `main` (`2b3daf3`, alpha.231), con `main` alpha.233 fusionado después (`e5d48fe`: `jay/arreglos-g` alpha.232 y `jay/h1-chispas` alpha.233). Esta rama no toca la economía de chispas ni la hoja de fin de ronda. Jay: «jugué mucho tiempo y cada vez que veía el Refugio más me agobiaba y no hacía nada». Dirección aprobada: **«Tu Refugio» es para mirar y escuchar, no para administrar.** Guía: [Casa viva](docs/CASA_VIVA.md).

- **Una sola pantalla.** La casa de frente y entera, sin cámara ni escaleras: las salas abiertas se ven de un vistazo. Flechas y toques no mueven el cubo. Una sala cerrada es una silueta con su nombre y, en medio, solo la condición más cercana: «Se abre con 3 lugares más» (regla D3 intacta). En teléfono, la pared «★ N / 33» no se dibuja (el HUD lo dice) y los trofeos se encogen para no pisarse; el toque sobre un objeto se ajusta al tamaño de la casa.
- **Se decora sola.** `src/house-auto.js` coloca lo ganado en un sitio con sentido: el primer pulso en Eco, los recuerdos de lugares en el Cielo, lo vivo en el Jardín de voces, las cajas en la Raíz. Una sala cerrada presta su sitio a Eco; al abrirse, lo automático se muda. Cada sitio depende solo del objeto y de la sala (`hashKey`, sin RNG): lo nuevo nunca mueve lo anterior. Las constelaciones del Mapa del cielo aparecen en lo alto del Cielo. Los objetos van en blanco: dorado solo para ★ y ✦.
- **Lo puesto a mano se respeta.** Lo movido en Colocar pierde la marca automática y se queda; lo guardado (arrastrar fuera) no vuelve solo. Mirar nunca arrastra.
- **Un solo aviso.** Un punto blanco en Refugio del menú solo cuando hay algo nuevo a la vista (trofeos, ★, objetos, constelaciones, voces, tarjetas, piezas, visitas o salas). Al entrar, «1 nuevo» y «Nuevo: 1 trofeo, 2 ★» durante 8 s, con lo recién llegado marcado en blanco; queda visto y el punto se apaga. Sin nada nuevo no insiste: «Prisma listo» ya no se anuncia.
- **Tres botones.** **Escuchar** (la casa toca lo ganado durante cuatro compases con el audio de `house-audio.js`, cada sala tan cerca como la del cubo; «Parar» lo corta), **Colocar** («Listo») y **Salir**. Sin Escuchar, la casa ya no secuencia sus objetos sola: suenan su aire y lo que tocas. La línea de encima siempre dice el siguiente paso («Siguiente: Bosque.»).
- **«Más».** Lugares, Taller (cuenta para «Disco del Taller»), Prisma · 60 ✦ (el primer toque pregunta; precio y premios iguales), Código (visitas) y Jardín de voces con sus conjuntos. El Prisma y el disco del Taller ya no se dibujan en Eco ni responden a Enter. «Ver refugio» queda oculto. Todos los ids se conservan.
- **Jardín de voces.** Se llena solo, al abrirse la sala, con tus cuatro voces más oídas (momentos en que la oíste, después rareza y novedad). Si eliges, quitas o cargas un conjunto, la elección es tuya y no cambia sola; un jardín ya elegido se respeta.
- **Tienda y apariencia.** Ya vivían solo en Tu cubo (Llevar, Tienda, Chispas). El Refugio no tenía accesos duplicados que quitar; las columnas de la Raíz siguen mostrando lo comprado.
- **Guardado.** La casa sigue en versión 2: marcas nuevas (`autoRule`, `auto`, `fresh`, `away`, `seen.v`) que una versión anterior conserva sin usar; códigos WH1/WH2 iguales. Migración de casas v1 y v2: objetos colocados a mano, posiciones, salas, adornos, tintes, cápsulas, visitas y conjuntos se conservan; lo que ya había cuenta como puesto a mano y la primera colocación no cuenta como «nuevo». Una casa futura no se toca.
- HUD del Refugio: «Mira y escucha.» y «Refugio» sin contador. Cómo jugar: «Lo que ganas se coloca solo. Míralo y escúchalo.» Inglés en `i18n-en.js`.
- **Pruebas.** Nueva: `tests/refugio-simple.mjs` (sitios deterministas sin RNG, migración v1/v2 con objetos a mano, lo guardado y lo movido, jardín automático, aviso «nuevo», tres botones y «Más»). Ajustadas a la nueva vista, sin quitar aserciones de otras cosas: `house_walk_smoke.py` (ahora una pantalla), `house_sound_smoke.py` (casa callada al mirar, Escuchar y Parar), `house_v2_smoke.py`, `house_visit_smoke.py`, `house_capsules_smoke.py`, `refugio_legible_smoke.py`, `refugio_lugares_smoke.py`, `rules_in_sight_smoke.py`, `experience_garden_smoke.py`, `collection_commit_smoke.py`, `smoke.py`, `wonders_smoke.py`, `house-guide.mjs`, `refugio-legible.mjs` y la escena de casa de `audio_mix.mjs` (escuchando).
- **Sonido.** La síntesis, las notas y el eco por sala no cambian; Escuchar solo decide cuándo suena la casa y quita la atenuación de las otras salas. Renders: `house_mix.py` (pico 0,904; antes 0,907), `house_ambience_mix.py` y `experience_garden_mix.py` (0,882, igual) en verde. Escucha en teléfono: pendiente.
- **Preservación.** Cambian a propósito tres archivos protegidos (`house-audio.js`, `house-capsules.js`, `house-guide.js`) y la lista offline de `sw.js` (un módulo nuevo), con su capa `approvedH2` sobre el merge de `main` alpha.233 (`b8f103e`), que ya contiene G y H1; el roce y el pulso de `house.js` y las voces del jardín quedan idénticos. Probado en local (`npm test`, auditoría, 40 recorridos de navegador y tres renders); tras el merge, de nuevo `npm test` (315 suites), auditoría, verificador y 16 recorridos (los de la casa, `arreglos_g_smoke`, `eleven_note_smoke` y `sparks_economy_smoke`) en verde; sin CI remoto, sin teléfono ni personas.


## Chispas solo en el universo (H1) · 2.3.0-alpha.233

Rama `jay/h1-chispas`, desde `main` (`2b3daf3`, alpha.231). En paralelo van `jay/arreglos-g` (alpha.232) y `jay/h2-refugio`. Decisión de Jay: las chispas de los niveles no se mezclan con las del mundo abierto. Guía: [El mundo](docs/MUNDO.md#chispas-y-colección) y [economía antes y después](docs/HALLAZGOS_Y_ACTIVIDADES.md#chispas-solo-en-el-universo).

- **Los niveles dan ★ y Tu canción, no ✦.** Cerrar una ronda (también Maestro y remezcla) no paga chispas (`LEVEL_SPARKS` en `spark-rules.js`; `places.js`, `wild.js`). El Camino es parte del Viaje: sus cristales dan luz, no ✦, también en el paseo del día (`sparks.js`, `crystal-sparks.js`). Dentro de un nivel no se abren actividades ni travesuras, las esculturas no pagan y las metas de chispas esperan a que salgas.
- **HUD y hoja.** Dentro de un nivel (y con la hoja de la ronda abierta) el HUD muestra ★ y lugares, sin ✦. La hoja de fin de ronda dice el tiempo y el récord, sin chispas. En el Mundo libre el contador ✦ vuelve igual.
- **Sin inflación (corrección de Jay, PR #374).** Chispa suelta = 1 ✦ (cada fragmento de cristal), a tiempo 2; desaparece el ×3 de la racha de ocho. Lo que se persigue vale más, como antes: fragmento raro +3, chispa salvaje 15 ✦. Lo que aparece o hay que hacer (encuentros vivos, figuras del Mapa del cielo, actividades, travesuras) paga por una regla única en `spark-rules.js` (`universeReward`): base × dificultad × distancia × rareza, ×1,5 a tiempo. Bases 5, 4, 10 y 4; dificultad 1/1,5/2 (encuentros medidos por bots, figuras por estrellas, actividades por tamaño); distancia al origen ×1/1,5/2/3 (5, 20 y 50 km); rareza ×1/1,5/3 (La Mano, leyenda). Un encuentro fácil cerca da 5 ✦; uno difícil a más de 50 km, 30; La Mano lejos, 54.
- **Economía** (`node scripts/play-curve.mjs`; el modelo ya no paga rondas y supone 1,6 min de Mundo tras cada ronda). Chispas a 30/60/120 min, alpha.231 → alpha.233: 60 %, 486/1.626/3.915 → 108/427/1.065; 75 %, 679/2.175/6.054 → 184/577/1.336; 90 %, 890/3.074/7.217 → 211/737/1.686; sin sonido, 532/1.634/3.884 → 100/358/886. Tienda completa con la mitad del tiempo en lugares: 6,9 → 20,7 h y 5,2 → 17,2 h. Precios sin tocar: propuestas para Jay en [HALLAZGOS](docs/HALLAZGOS_Y_ACTIVIDADES.md#chispas-solo-en-el-universo).
- **Ritmo de la tienda:** Jay eligió dejarla lenta a propósito, como colección larga (unas 20 h). Los precios no cambian.
- **Guardado.** Sin migración ni cambio de formato: nadie pierde chispas ni compras; las ya ganadas en rondas se quedan. Una ronda a medias se termina sin chispas.
- **Textos.** «Cómo jugar» dice que las chispas se ganan en el universo abierto, no en los niveles, que los lugares dan estrellas y Tu canción, que una chispa suelta vale 1 (2 a tiempo) y que encuentros y travesuras dan más si son difíciles o lejanos; inglés en `i18n-en.js`.
- Pruebas actualizadas sin quitar aserciones de otras cosas: lógica (`spark-rules`, `play-curve`, `spark-economy-sim`, `sparks-economy`, `places*`, `crystal-*`, encuentros vivos, Mapa del cielo) y recorridos de navegador (lugares, hoja de ronda, remezcla, Camino, cristales, encuentros vivos, Mapa del cielo, Viaje, inglés). Capturas a 390×844 del HUD en un nivel, la hoja y el HUD en el Mundo.
- Preservación: cambian a propósito archivos protegidos (rondas, chispas, cristales, actividades, travesuras, remezcla y la lista offline de `sw.js` por la versión), con su capa `approvedH1`. Probado en local; sin CI remoto, sin teléfono ni personas.


## Arreglos de Jay G1–G3 · 2.3.0-alpha.232

Rama `jay/arreglos-g`, desde `main` (`2b3daf3`, alpha.231 con A–E y el Mapa del cielo). Jay jugó alpha.231 y pidió tres arreglos.

- **G1 · El cierre de cada ronda, limpio.** Jay: «Cuando se acabe un nivel, pantalla en negro, sale el botón de las estrellas, se presiona lo que el usuario quiera y seguimos». El orden de P4 no cambia: la hoja espera a que se oiga el fin de la caída de dos compases. Ahora la pantalla pasa a negro opaco (antes un velo negro al 80 % dejaba ver el Mundo detrás) y la hoja aparece encima con sus ★: dorado solo lo ganado. Un solo botón blanco, el que sigue: «Seguir hacia …»; sin siguiente lugar en el camino (antes no quedaba ninguno blanco), «Otra vez». Tocar el negro no la cierra ni mueve el cubo; el Mundo no se ve detrás y los avisos esperan a que se cierre. «Otra vez», «Seguir hacia …», «Maestro» y «Cerrar» siguen como estaban. Los capítulos del Viaje no usan esta hoja (abren su portal en el Mundo) y la ronda Libre sigue sin hoja (solo música). La ronda que completa los once sigue pasando sola al final (D5).
- **G2 · Sin «Paseo musical».** El botón ▷ del Mundo (`#bAuto`) y su gemelo en Favoritos (`#favWalk`) quedan ocultos en todas las vistas; ids y código se conservan y las pruebas lo activan por código (`startAutopilot`). Su logro «Dejarse llevar» queda retirado: lo conserva quien ya lo tenga y no se pide a nadie más. «Viajar automáticamente» (▶ de una ruta a un favorito) no cambia.
- **G3 · Mensaje al completar los once.** Al cerrarse el final de los once (su música no cambia), una hoja sobre negro: «Completaste los once lugares. Aún te quedan estrellas por ganar en cada uno: ★★ a tiempo, ★★★ Maestro. Ya puedes saltar a otro paisaje. El primer salto es gratis. El universo es infinito. Explóralo: encontrarás maravillas.» Un botón blanco, «Explorar», la cierra y te deja en el Mundo, con «Otro paisaje» en el dock (regla B de alpha.230). Sale una sola vez (`S.elevenNote`, versión 1, migrado sin perder campos; una versión futura se respeta); si falla el guardado, no se repite en la sesión. Las partidas que ya tenían los once lo ven una vez al volver al Mundo. Lugares lo guarda: «Completaste los once lugares ›». Sin ★ por ganar, la línea de estrellas no sale; con el salto gratis ya usado, solo «Ya puedes saltar a otro paisaje». Módulo nuevo `src/eleven-note.js`.
- Inglés de todo lo nuevo en `i18n-en.js`.
- Pruebas nuevas: `tests/eleven-note.mjs`, `tests/arreglos_g_smoke.py` (G1 y G2), `tests/eleven_note_smoke.py` (G3, también en inglés). Ajustadas: `focusui_smoke.py` y `cultures_smoke.py` (ya no pulsan ▷).
- Preservación: cambian a propósito dos archivos protegidos (`main.js`, que carga el módulo nuevo, y `achievement-metadata.js`, el logro retirado) y la lista offline de `sw.js` (un módulo nuevo), con su capa `approvedG`. Sonido sin cambios (sin render nuevo). Probado en local; sin CI remoto, sin teléfono ni personas.

## Mapa del cielo (F1) · 2.3.0-alpha.231

Rama `universo/f1-mapa-del-cielo`, desde `main` (`ccb661a`, alpha.230). Primera fase del [catálogo del universo](docs/IDEAS_UNIVERSO.md), elegida por Jay con sus decisiones del 28 de octubre. Guía: [Mapa del cielo](docs/HALLAZGOS_Y_ACTIVIDADES.md#mapa-del-cielo).

- **Estrellas que se unen.** En el Mundo libre, tras el Viaje, estrellas tenues forman 28 figuras con nombre: el zodiaco (12), el cielo del norte (5), el del sur (3) y ocho propias, con «La Mano» como guiño secreto. Se colocan con `hashKey` en celdas de 500 m, como mucho una por celda; más de noche (hora real) y en el Vacío, los Púlsares y la región Constelaciones. Rareza por distancia al origen: cortas cerca, zodiaco desde 5 km, raras desde 20, la leyenda desde 50; Osa Mayor al norte, Cruz del Sur al sur. Nada del mapa se mueve.
- **Unir en orden.** Al acercarse: «Mapa del cielo · Orión». La siguiente estrella va en blanco con aro y la flecha blanca la señala; pasar por otra no hace nada. Un pulso a tiempo cerca enciende la siguiente y la de después si está igual de cerca. Cada estrella suena con una nota de la escala del lugar a la corchea siguiente y su línea crece en un pulso. Completa, brilla 3 s, toca su motivo de 5–8 notas una octava arriba y queda como un dibujo tenue.
- **Reversible.** Alejarse la deja a medias y guardada («Orión · 4 de 7 · guardada»); al volver sigue igual. La Bitácora la muestra con su dirección y «Soltar». Sin tiempo límite ni castigo.
- **Uno a la vez.** Las estrellas esperan mientras hay un encuentro vivo o una travesura; mientras se une una figura no empieza ninguno, el reloj de los encuentros espera y vuelve a cero al acabar (`liveEncounterRest`).
- **Premios.** 10 ✦, o 15 ✦ con un pulso a tiempo, la primera vez por figura, con un aviso; repetir no paga (la ficha dice «paga chispas una vez»; lo repetible ya lo pagan los encuentros). El zodiaco completo da el **halo de estrellas** dorado alrededor del cubo, con su aviso; se quita y se pone en Tu cubo → Llevar («Mapa del cielo», `#cubeSkyHalo`). Economía (`node scripts/play-curve.mjs`, alpha.230 → alpha.231, a los 120 min): 60 % 3.874 → 3.915, 75 % 6.010 → 6.054, 90 % 7.133 → 7.217, sin sonido 3.852 → 3.884 ✦; menos del 3 %, y se detiene.
- **Bitácora.** Mapa → «Mapa del cielo · N de 28»: las figuras a medias y cada serie con sus figuras dibujadas o en silueta.
- **Sonido.** Estrella a 0,012 y motivo a 0,02, en la escala y la corchea del lugar. Render (`tests/sky_map_mix.py`): la música del Mundo igual que en alpha.230 y alpha.226; las notas, 32,8–32,9 dB por debajo. Escucha en teléfono: pendiente.
- **Guardado.** `S.skyMap` versión 1, migrado sin perder nada (campos y figuras desconocidos conservados, versión futura intacta), acotado a 64 figuras a medias y 200 completas por sitio.
- **Atajo** `?cielo=orion` (cualquiera de los 28 ids), en [herramientas](docs/MUNDO.md#herramientas-de-prueba).
- Inglés de todo lo nuevo en `i18n-en.js` («Sky map»).
- Pruebas nuevas: `tests/sky-map.mjs`, `tests/sky-map-runtime.mjs`, `tests/sky_map_smoke.py`, `tests/sky_map_halo_smoke.py`, `tests/sky_map_mix.py`. Ampliadas: `tests/play-curve.mjs` y `tests/audio_mix.mjs` (`skyBatch`).
- Preservación: cambian a propósito cuatro archivos protegidos (`main.js`, `render.js`, `universe-mischief.js` y la vista previa de `cube.js`) y la lista offline de `sw.js` (tres módulos nuevos), con su capa `approvedF1`. Probado en local; sin CI remoto, sin teléfono ni personas.

## Arreglos de Jay A–E · 2.3.0-alpha.230

Rama `jay/arreglos-a-e`, desde `main` (`25ed913`, alpha.229 con `?rapido=2`). Jay jugó alpha.229 y pidió cinco arreglos. Regla para todos: siempre se ve el siguiente paso, siempre se puede volver sin perder nada, nada cambia para siempre sin avisar, sin castigos.

- **A · `?rapido=2` corto de verdad.** Además del veinteavo: el Camino pide **2 cristales** (los otros ocho cuentan como hechos, marcados `rapido:`), y un capítulo cumplido abre su portal **a 1 s** en vez de esperar a que suene su cierre (4–6 s). Cada capítulo se cierra en 2–3 pulsos. Tras recargar, el Vacío conserva su cielo corto (antes volvía a 12 estrellas). El final del Viaje no cambia (su música está aprobada; «Saltar» lo cierra al momento). `?rapido=1` y el juego normal, igual. **Medido** con un bot que camina a la velocidad del cubo y toca a tiempo, de la primera pantalla al Mundo libre a 390×844 (`tests/rapido2_viaje_smoke.py`): **69,0 s** (antes 112,7 s; final 35,6 s incluido). Una persona tardará más (leer, buscar): unos 2–3 min estimados, no medidos.
- **B · «Otro paisaje» y «Viajar a otra tierra» tras los once lugares.** Antes no aparecen en ninguna parte: ni en el dock, ni en «Más», ni en Tu cubo (su botón, su texto y la meta «Ahorrar para un salto»), y el código rechaza el salto. El primer salto gratis (`S.journey.freeJumpUsed`) es el primero tras los once. «Volver al punto anterior» sigue igual. Quien ya está en otra semilla conserva el camino de vuelta; `?dev=1` y un servidor local conservan sus herramientas.
- **C · Sin «Estilos».** `#bStyles` queda oculto en todas las vistas (id y hoja conservados; `openMusicTravel` la abre por código para las pruebas).
- **D · Encuentros vivos más claros.** Al empezar, su nombre y su verbo («Polilla de luz · atrápala») con su línea debajo. En los tres verbos, un aro blanco fino alrededor del cubo con el tiempo que queda (se llena en los de huir que basta aguantar, como antes) y una flecha blanca siempre visible al siguiente paso (la de perseguir era del color del bioma). Al ganar, una explosión de luz breve en el color del bioma; al escaparse o fallar, se aleja despacio desvaneciéndose (1,4 s) con su despedida. Después, una línea: «Polilla · atrapada · +15 ✦», «Ola · te alcanzó · sin premio». Las palabras siguen «Textos en el universo» y la vista tranquila; el aro, la flecha y el final no. Reglas, premios y frecuencia sin cambios.
- **E · No quedar a 77 km sin salida.** Lugares ofrece **«Volver al anillo»** siempre tras el Viaje, gratis: lleva al centro del anillo, un paso hacia el siguiente portal (nunca a un lugar nuevo ni a otra tierra), y la brújula apunta al siguiente lugar. Lejos del anillo va primero; dentro, bajo «Seguir hacia …». Pasa por el mismo viaje que los demás, así que «Volver al punto anterior» te devuelve donde estabas. El «Ir» de lejos (alpha.226) sigue siendo solo al siguiente lugar, junto a su portal, a más de 9600 px: no es un salto libre.
- Inglés de todo lo nuevo en `i18n-en.js`.
- Pruebas nuevas: `tests/rapido-2.mjs`, `tests/live-encounters-clear.mjs`, `tests/rapido2_viaje_smoke.py`, `tests/live_clear_smoke.py`, `tests/arreglos_ae_smoke.py`. Ajustadas a la nueva regla del salto: `practice-travel.mjs`, `sparks-economy.mjs`, `notas_jay_smoke.py`, `crystal_play_smoke.py`, `entry_jump_smoke.py`, `journey_ui_smoke.py`, `practice_travel_smoke.py`, `game_loop_smoke.py`, `sparks_economy_smoke.py`. Abren «Estilos» por código: `ambient_world`, `focusui`, `lab_score`, `micro_instruments`, `music_menu`, `music_travel`.
- Preservación: cambian a propósito siete archivos protegidos (`chapter-test.js`, `crystal-sparks.js`, `journey-chapters.js`, `journey-release.js`, `music-travel.js`, `practice-travel.js`, `sparks.js`), con su capa `approvedAE`. Sonido sin cambios (sin render nuevo). Probado en local; sin CI remoto, sin teléfono ni personas.

## Prueba más rápida · `?rapido=2`

Jay pidió pasar los cinco capítulos aún más rápido para probarlo todo. `?rapido=2` pone las metas de capítulos y rondas a un veinteavo, con el mismo guardado propio que `?rapido=1`. Sin el parámetro nada cambia. Recorrido `notas_jay_smoke` ampliado.

## Encuentros vivos · tanda 3 (hacer) · 2.3.0-alpha.229

Rama `universo/e3-hacer`, desde `main` (`fc7c4f8`, alpha.228, con las tandas 1 y 2 integradas). Tercera y última de las tandas que aprobó Jay: con ella están los 33. Guía: [Encuentros vivos](docs/HALLAZGOS_Y_ACTIVIDADES.md#encuentros-vivos).

- **Los once de hacer**, sobre el mismo motor (filas, un comportamiento corto cada uno y la regla `hacer`): cinco motas en orden, estrellita perdida, burbujas al ritmo, guardián de piedra, cinco brotes, caravana, nodos que suenan, cuatro púlsares, antena caída, luciérnagas del pozo y constelación. Tareas de 26–30 s con el objetivo a la vista: números, destino marcado, pasos en cuadraditos bajo el cubo y un arco que se vacía con el tiempo.
- **Perseguir, huir o hacer:** el temporizador común de 60–90 s no cambia; la misma tirada (`live:pick:v1`) se reparte ahora en tercios. Frente a alpha.228, las tiradas de 1/3 a 0,5 pasan de perseguir a huir y las de 2/3 en adelante, de huir a hacer (en 20.000 tiradas: 33,3 / 33,4 / 33,3 %).
- **Tocar a tiempo ayuda siempre:** suma 1 s (hasta 6) y cuenta doble, acelera, protege o evita que se apague, según el encuentro. Se completa también sin tocar a tiempo y sin sonido (reloj fijo; los nodos quedan numerados). **Fallar no castiga:** si se acaba el tiempo, se seca un brote o te alejas, una despedida amable y sin premio. 10 ✦, o 15 ✦ con un pulso a tiempo; la primera vez de cada uno, a la Bitácora (33 en «Encuentros vivos», 190 familias) con un aviso (D3).
- **Dificultad medida** (bots en `tests/live-encounters.mjs`, 20 posiciones): reaccionando 1,5 s tarde y sin tocar a tiempo se completan los once siempre (también a 140 u/s y sin sonido); con pulsos a tiempo, siempre y más rápido. Un bot no duda: una persona tardará más.
- **Sonido:** la música no cambia. Al completar suena la nota discreta de las otras tandas; los nodos del Prisma suenan, más bajo, al encenderse y al tocarlos. Render: música igual a alpha.226 y las treinta y ocho notas 28,8–29,6 dB bajo la música.
- **Economía** sin cambios de importes ni precios. Modelo de dos horas, alpha.228 → alpha.229, jugador al 75 %: 30 min 671 → 673 ✦, 60 min 2.149 → 2.154, 120 min 6.000 → 6.010; tienda entera 6,9 h (casual) y 5,3 → 5,2 h (a tiempo).
- «Cómo jugar» dice «huir o hacer algo». Inglés completo en `i18n-en.js`. Atajo `?encuentro=motas` (o cualquiera de los treinta y tres).
- Pruebas nuevas: `tests/live_do_a_smoke.py`, `tests/live_do_b_smoke.py`, `tests/live_do_c_smoke.py` (con `tests/live_do_helpers.py`). Ampliadas: `live-encounters.mjs`, `live-encounters-runtime.mjs`, `live_encounters_mix.py` y `audio_mix.mjs`. Ajustadas a las 190 familias: `element_book`, `journal-album`, `discoveries_smoke.py`.
- Preservación: no cambia ningún archivo protegido (sin capa `approvedE3`). No probado en teléfono ni con personas; sin CI remoto.

## Encuentros vivos · tanda 2 (huir) · 2.3.0-alpha.228

Rama `universo/e2-huir`, desde `main` (`36fab14`, alpha.227, con la tanda 1 integrada). Segunda de las tres tandas que aprobó Jay. Guía: [Encuentros vivos](docs/HALLAZGOS_Y_ACTIVIDADES.md#encuentros-vivos).

- **Los once de huir**, sobre el mismo motor (filas, un comportamiento corto cada uno y la regla `huir`): remolino de polvo, enjambre celoso, ola gigante, derrumbe al compás, nube de polen, tormenta de arena, rayos del prisma, ondas del púlsar, lluvia de llamaradas, pozo que arrastra y agujero negro. Escapar es llegar a un lugar seguro visible, salir de un círculo, alejarse o aguantar 10–14 s.
- **Perseguir o huir:** el temporizador común de 60–90 s no cambia; la tirada que ya existía (`live:pick:v1`) elige: por debajo de 0,5, el de perseguir de siempre; desde 0,5, el de huir del bioma. Cuándo y dónde aparecen, igual.
- **Tocar a tiempo ayuda siempre:** un pulso a tiempo protege 1 s y, según el encuentro, deshace, frena, sopla o te hace saltar fuera. **Que te alcance no castiga:** el cubo se desvía un segundo, una despedida amable y sin premio. 10 ✦ al escapar, 15 ✦ si usaste un pulso a tiempo; la primera vez de cada uno, a la Bitácora (22 en «Encuentros vivos», 179 familias) con un aviso (D3).
- **Legibilidad:** amenaza en el color del bioma, lugar seguro en blanco, flecha blanca junto al cubo y arco que se llena si basta aguantar. Las criaturas de la tanda 1 se perdían sobre algunas luces: halo más fuerte, disco oscuro y aro fino de su color; mismo tamaño, cubo igual de pequeño.
- **Sonido:** la música no cambia. Al escapar suena la misma nota discreta de la tanda 1. Render: música igual a alpha.226 y las veintidós notas 28,6–29,8 dB bajo la música.
- **Economía** sin cambios de importes ni precios. Modelo de dos horas, alpha.227 → alpha.228, jugador al 75 %: 30 min 669 → 671 ✦, 60 min 2.142 → 2.149, 120 min 5.985 → 6.000; tienda entera, 7 → 6,9 h (casual).
- «Cómo jugar» dice que unas veces hay que atrapar y otras huir. Inglés completo en `i18n-en.js`. Atajo `?encuentro=ola` (o cualquiera de los veintidós).
- Pruebas nuevas: `tests/live_flee_a_smoke.py`, `tests/live_flee_b_smoke.py`, `tests/live_flee_c_smoke.py` (con `tests/live_flee_helpers.py`; tres archivos para quedar bajo 145 s). Ampliadas: `live-encounters.mjs`, `live-encounters-runtime.mjs`, `live_encounters_mix.py` (y `audio_mix.mjs`). Ajustadas a las 179 familias: `element_book`, `journal-album`, `discoveries_smoke.py`; `live_encounters_smoke.py` filtra los de perseguir.
- Preservación: no cambia ningún archivo protegido (sin capa nueva). No probado en teléfono ni con personas; sin CI remoto. La tanda 3 (hacer), pendiente.

## Encuentros vivos · tanda 1 (perseguir) · 2.3.0-alpha.227

Rama `universo/e1-perseguir`, **sobre `lanzamiento/m1-notas-jay`** (`2ae74a8`, alpha.226, PR #365 aún sin merge): dependencia explícita. Jay pidió algo que perseguir, huir o hacer en cada bioma; aprobó 33 encuentros en tres tandas. Esta es la primera. Guía: [Encuentros vivos](docs/HALLAZGOS_Y_ACTIVIDADES.md#encuentros-vivos).

- **Motor común** (`src/live-encounters-model.js`, `src/live-encounters.js`, `src/live-encounters-art.js`, en `SHELL` una vez cada uno). Uno cada 60–90 s de viaje en el Mundo libre, delante del cubo, de `hashKey`; nunca en capítulos, rondas, su tarjeta, finales, actividades, el Refugio ni bajo tierra. Uno a la vez, también con las travesuras (`universe-mischief.js` espera a que acabe). Las tandas 2 y 3 añaden filas, un comportamiento corto y la regla de su verbo.
- **Los once de perseguir**: polilla de luz, racimo saltarín, pez de onda, tambor rodante, semilla traviesa, cometa en el viento, tu reflejo, púlsar fugaz, llamarada viva, tu eco y estrella fugaz. Un pulso a tiempo cerca lo atrapa (o lo frena); alcanzarlo moviéndose también vale, pero cuesta más. Si se escapa, una línea de despedida y nada más.
- **Chispas al completarlos**: 10 ✦, 15 ✦ con un pulso a tiempo, cada vez. La primera de cada tipo va a la Bitácora (Colección, «Encuentros vivos»: 157 → 168 familias) con un solo aviso que la nombra (D3). Cobro y Bitácora, atómicos.
- **Economía al alza** (Jay): rondas 60–120 → 80–170 ✦; actividades 5 → 15 ✦ y travesuras 3 → 10 ✦, una vez por lugar (`spark-rules.js` reúne los importes). Precios sin cambios. Modelo de dos horas, jugador al 75 %: 30 min 474 → 669 ✦, 60 min 1.524 → 2.142, 120 min 4.259 → 5.985, piezas 45 → 53; toda la tienda, de 9,4 a 7 h (casual). Ningún guardado pierde chispas ni compras; no cambia ningún formato.
- **Sonido**: la música no cambia. Al atrapar, una nota de la armonía que suena con el instrumento melódico del lugar, a 0,02 de ganancia y en el pulso. `tests/live_encounters_mix.py` (nuevo): la música del Mundo renderizada desde este árbol y desde `2ae74a8` tiene el mismo pico y el mismo nivel en cada medio segundo (deriva ≤ 0,0003 dB, la del propio render), y las once notas quedan 29–31 dB bajo la música.
- **Dibujo**: formas simples en la luz del color de su bioma, del tamaño del cubo; una flecha pequeña junto al cubo (o en el borde) dice hacia dónde. Se dibujan sobre la luz del Mundo (`render.js`), para que se lean de noche. Una línea al aparecer; «Textos en el universo» la oculta. Cubo igual de pequeño.
- **Ayuda**: «Cómo jugar» explica los encuentros vivos en una línea y que las travesuras dan diez chispas. Inglés completo en `i18n-en.js`.
- **Atajo** `?encuentro=polilla` (o cualquiera de los once): ese encuentro tras 3 s de viaje. [Herramientas de prueba](docs/MUNDO.md#herramientas-de-prueba).
- Pruebas nuevas: `tests/live-encounters.mjs`, `tests/live-encounters-runtime.mjs`, `tests/live_encounters_smoke.py` (los once forzados, persecución, atrapar a tiempo, chispas, escape sin castigo, uno a la vez con travesuras, nunca en rondas, capítulos ni final; capturas a 390×844) y `tests/live_encounters_mix.py`. Ajustadas a los importes nuevos: `spark-rules`, `places`, `places-boundaries`, `places-durability`, `play-curve`, `spark-economy-sim`, `universe-activities-runtime`, `universe-mischief-runtime`, `universe_activities_smoke.py`; a las 168 familias: `element_book`, `journal-album`, `discoveries_smoke.py`. `tests/audio_mix.mjs` gana `liveBatch`.
- Preservación: capa `approvedE1` para los archivos protegidos que cambian a propósito (`main.js`, `render.js`, `universe-mischief.js`, `universe-mischief-art.js`, `universe-activities.js`, `spark-rules.js`, `element-book-model.js`, `content-manifest.js` y la lista offline de `sw.js`).
- No probado en teléfono ni con personas; sin CI remoto. Las tandas 2 (huir) y 3 (hacer), pendientes.


## Notas de Jay · 2.3.0-alpha.226

Rama `lanzamiento/m1-notas-jay`, desde `main` (`7106240`, alpha.225). Jay jugó `main` y pidió seis cambios.

- **Lluvia ligera.** La cama de ruido de la lluvia (`RAIN_BED`, `world-weather.js`) baja 12 dB, en calma y en tormenta. Render aislado nuevo, `tests/rain_mix.py`: −52,3 → −64,3 dBFS en calma y −43,8 → −55,8 dBFS en tormenta, a 48 kHz, frente a −13,6 dBFS de la música. Notas, armonías y el resto de la mezcla, iguales. Guía: [Universo](docs/UNIVERSO.md).
- **Final del Viaje más corto y «Saltar».** Mismo arreglo de Q7; el marco es más corto (reunión 0,8 s, silencio 1 s, «Tu mundo se abrió» 3,5 s) y nunca más lento que 120 BPM. Con el tempo por defecto y notas en los cinco capítulos: 44 s → 33 s; en el mundo más lento, 48 s → 33 s. «Saltar» (antes «Seguir explorando», abajo y a los 2 s) va arriba a la derecha, pequeño y negro, y responde a los 0,6 s; Escape igual. Deja el mismo estado que esperar al final. Guía: [Viaje](docs/VIAJE.md).
- **Ir a otro lugar tras el Viaje.** «Otro paisaje» está a la vista desde el primer momento y el primer salto es gratis; volver al punto anterior sigue gratis. Lejos del anillo, Lugares ofrece «Ir» al siguiente lugar, gratis.
- **Sin salto en los niveles.** En un capítulo del Viaje, en una ronda y bajo el final se ocultan «Otro paisaje», «Volver al punto anterior» y «Viajar a otra tierra»; el código también los rechaza. IDs conservados. Guía: [Mundo](docs/MUNDO.md#orientación-y-retorno).
- **Caja mágica.** Una línea con gracia y los segundos («¡Zum! Eres cometa: corre y suena. 20 s»), con «Ver» y ×; 300 × 60 px y entera en 390×844 y en escritorio (antes 180 px recortados). Inglés incluido. Guía: [Hallazgos](docs/HALLAZGOS_Y_ACTIVIDADES.md).
- **`?rapido=1`.** Metas de capítulos y rondas a un quinto, en un guardado propio (`kubono:rapido`) y sin cuenta. Sin el parámetro nada cambia. [Herramientas de prueba](docs/MUNDO.md#herramientas-de-prueba).
- Pruebas: `tests/notas_jay_smoke.py` (nuevo) y `tests/rain_mix.py` (nuevo); `tests/journey-finale.mjs` ajustado a «Saltar» a los 0,6 s y al marco corto.
- Preservación: capa `approvedM1` para los archivos protegidos que cambian a propósito (`world-weather.js`, `practice-travel.js`, `chapter-test.js`, `celebration.js`, `sparks.js`, `progress.js`, `main.js`). La partitura y el arreglo del final siguen protegidos tal como los aprobó Q7.
- No probado en teléfono ni con personas; la lluvia, medida en render, no escuchada en altavoz.


## L4 · Escritorio en itch.io · 2.3.0-alpha.225

Rama `lanzamiento/l4-itch`, sobre `main` (con L1 y L2). Fila L4 de la [salida web y Android](docs/PLAN_LANZAMIENTO.md#salida-web-y-android). Guía: [itch.io](docs/ITCH.md).

**Decisión de Jay (27 de octubre): itch.io vende la versión de escritorio como descarga** (Windows, macOS, Linux). itch.io no cobra por jugar un HTML en el navegador, y el zip web no arranca desde `file://`. La web no se publica abierta.

- Envoltorio Electron 44.7.1 en `desktop/` (`main.cjs`, `serve.cjs`; su `package.json` y `package-lock.json`; `node_modules` fuera de Git). Es la única excepción a «sin npm»: empaqueta aparte, el juego no cambia. Carga la carpeta sellada de `itch-package.mjs` por `app://kubono/`; ventana 1280×800 redimensionable, F11 o Alt+Intro para pantalla completa; sin menús (macOS: el mínimo), sin DevTools empaquetado, sin red (cancela toda petición ajena y la descarga de diccionarios), una sola instancia, guardado en el perfil bajo `com.playkubono.kubono` (ID provisional, lo confirma Jay).
- `node scripts/desktop-package.mjs --platform linux|win32|darwin|all` escribe `dist/desktop/`: Windows x64 zip portable (151 MB), Linux x64 tar.gz (119 MB), macOS zip `.app` sin firmar (arm64: 125 MB; universal desde el workflow). Workflow manual `desktop-builds.yml`: artefactos, nada se sube a itch.io.
- `docs/ITCH.md` reescrita para la descarga: archivos y etiquetas por sistema, precio US$4,99 e ID `com.playkubono.kubono` confirmados por Jay, borrador privado, `butler` opcional, firma de macOS y SmartScreen pendientes, sandbox de Linux.
- Pruebas nuevas: `tests/desktop-package.mjs` y `tests/desktop_smoke.py` (build de Linux en Xvfb: arranca en edición de venta, F11 real para el envoltorio, sonido tras el clic, guarda, cierra con código 0, reabre con la partida, ninguna conexión vista por un proxy que lo anota todo). No probado en Windows ni macOS reales.

Primera parte de la fase (zip web, sigue y es la entrada del envoltorio):

- `node scripts/itch-package.mjs` escribe `dist/kubono-itch-<versión>.zip` (`dist/` fuera de Git), sin dependencias: copia solo el juego, sella la edición de venta con `set-edition.mjs` y la versión con el commit, y deja `index.html` en la raíz. alpha.225: 340 archivos, 1,44 MB.
- En itch.io no hay service worker: el zip no lleva `sw.js` y su `index.html` lleva una marca que `src/pwa.js` respeta. Sin enlaces a la vista previa de Vercel. Las rutas ya eran relativas. Vercel y Android no cambian.
- `docs/ITCH.md`: textos ES/EN, etiquetas, marco 390×844 con pantalla completa, pasos del borrador privado. Resultó que un juego HTML se juega gratis en itch.io y que el zip no sirve como descarga (`file://`): de ahí la decisión de arriba.
- Música, mapas, guardado y textos del juego sin cambios.
- Pruebas: `tests/itch-package.mjs` y `tests/itch_package_smoke.py` (zip en `/html/123456/`, en un marco de otro sitio: arranca, suena tras tocar, guarda y recarga, exporta la copia, español e inglés, nada fuera de su carpeta). No probado en itch.io real ni en teléfono.

## L2 · Inglés · 2.3.0-alpha.224

Rama `lanzamiento/l2-ingles`, sobre `lanzamiento/l1-sin-nube`. Fila L2 de la [salida web y Android](docs/PLAN_LANZAMIENTO.md#salida-web-y-android). Guía: [Español e inglés](docs/TRADUCCION.md).

- Sistema de textos sin dependencias: `src/i18n.js` (`t(clave, variables)`, `translate`) y el diccionario `src/i18n-en.js` (más de 4000 textos), los dos en `SHELL`. La clave es el texto español. En inglés se traduce en las salidas: texto y etiquetas de la página, texto del canvas y diálogos del navegador. En español no se instala nada: el juego es el mismo.
- Traducido todo lo visible: menús, hojas, avisos, narrador y La Voz, Bitácora, Lugares, tarjetas, logros, nombres de lugares, especies y regiones, Ajustes, Refugio, Tu canción, créditos, guía «Cómo jugar», `recovery.html` y el texto del canvas. Glosario en la guía («Tu canción» → «Your Song», «El Viaje» → «The Journey», Refugio → Refuge, Bitácora → Logbook).
- Idioma: el del sistema en el primer arranque; las partidas anteriores siguen en español. Se guarda en la partida (`lang`) y se elige en Ajustes → «Idioma / Language» (cambia al momento; si guardar falla, se queda el anterior). `<html lang>` acorde. `?lang=en|es` para probar. Un arranque en inglés espera su texto (como mucho 4 s) para no mostrar español.
- «Cómo jugar»: «El progreso se guarda en este dispositivo.» (antes «este navegador»), válido para la app Android. Es el único cambio de texto en español.
- Los nombres que el jugador escribió (favoritos) no se traducen. En inglés, los nombres de superbiomas de la Bitácora ya no se cortan.
- No cambian la música, los mapas, el progreso ni los ID de HTML.
- Pruebas nuevas: `tests/i18n-keys.mjs`, `tests/i18n-coverage.mjs`, `tests/i18n.mjs`, `tests/english_screens_smoke.py`, `tests/english_panels_smoke.py`, `tests/english_menus_smoke.py` y `tests/language_choice_smoke.py`. Herramienta: `scripts/i18n-scan.mjs`.
- Límites: el texto cortado se mide en el DOM; el canvas se revisó en capturas. Búsquedas y órdenes alfabéticos siguen los nombres en español. Manifiesto y metas para buscadores siguen en español (L5). Sin revisión de una persona nativa.

## L1 · Versión de venta sin nube · 2.3.0-alpha.223

Rama `lanzamiento/l1-sin-nube`, sobre `claude/charming-darwin-dvbfc7`. Fila L1 de la [salida web y Android](docs/PLAN_LANZAMIENTO.md#salida-web-y-android).

- Una sola bandera: `EDITION` en `src/edition.js` (nuevo, en `SHELL`). La fuente dice `'web'`; la edición de venta es `'store'`. El empaquetador la sella en su copia con `scripts/set-edition.mjs` (nuevo), que no toca el árbol fuente. Android: `KUBONO_EDITION=store` al compilar. Un valor desconocido también apaga la nube.
- En `'store'`: ningún cliente de cuenta ni petición a Supabase; Cuenta y su hoja ocultas; «Guardar copia» aparece en «Más» en su lugar; los textos de la cuenta en Cómo jugar y Tú se ocultan; `recovery.html` no consulta nada.
- Siguen el guardado local, exportar e importar copia y «Empezar de cero».
- Partidas existentes: sin sesión, la de siempre. Con sesión guardada, su identificador se lee solo en el dispositivo para cargar `kubono:user:ID:…`; no se borra nada.
- La web de Vercel sigue en `'web'`: es lo de menos riesgo para quien tiene sesión. La nube sigue en pausa. Supabase no se tocó.
- No cambian la música, los mapas, el cubo ni la web actual.
- Pruebas: `tests/sale_edition_smoke.py` (partida guardada por la web, con y sin sesión, carga en la edición de venta; inicio, Viaje, Mundo, menú, Ajustes y Refugio sin peticiones fuera del origen; ningún botón de cuenta; exportar copia; «Empezar de cero» disponible) y `tests/sale-edition.mjs` (bandera, sello y lectura local de la sesión).
- Límites: el recorrido bloquea el service worker para ver todas las peticiones de la página. Aún no probado en el AAB (L3) ni en el zip de itch.io (L4). · sin cambio de versión

Rama `claude/charming-darwin-dvbfc7`, sobre Q7. Petición de Jay del 27 de octubre.

- Nota de cierre en [HANDOFF](HANDOFF.md): E1–E7, P1–P8 y Q1–Q7 en `main`; sin fases de diseño abiertas; cómo retomar.
- La auditoría con Codex queda descartada; su guía se conserva como método.
- [Plan de salida web y Android](docs/PLAN_LANZAMIENTO.md#salida-web-y-android): decisiones de Jay (web y Android, cobro, español e inglés, a su nombre) y la recomendación aceptada de salir sin nube. Fases L1–L6 y tareas que solo puede hacer Jay.
- No cambia el juego.
## Q7 · Los finales suenan a final · 2.3.0-alpha.222

Rama `panel11/q7-finales`, con `main` integrado (alpha.221). **Jay oyó los renders en dub techno y los aprobó el 27 de octubre.** Wintory; Simogo para la forma. Decisiones de Jay: D8-B y D9-B + C. Es la única fase que cambia música. Tras oír los primeros renders («parece música de videojuego de niños»), Jay pidió algo más radical: **dub techno / minimal**, y que cada final acabe con **subida, golpe y corte seco**. Esta entrada describe ya ese arreglo; el de chelo queda en Git.

- Voces propias de los finales (`createDub` en `song-stage.js`, sin módulo nuevo): bombo 4/4 profundo, sub-bajo (seno con su octava para altavoces pequeños), hats a contratiempo, rim lanzado al eco, stabs de acorde con sierras desafinadas y su propio filtro, eco de corchea con puntillo con realimentación y reverb larga oscura. Ruido y sala deterministas: no usan `Math.random` ni el RNG antiguo. Fuera el chelo y el arpegio. La radio, las voces y la mezcla del Mundo libre no cambian; «Tu canción» desde Lugares y la vista previa de un trofeo siguen con las voces de `song.js`.
- Subida: el paso bajo de los acordes se abre de 260 Hz a 5,2 kHz y el cuerpo pasa del 25 % al 100 % del nivel. Golpe: bombo, sub, impacto y un stab sostenido de tónica sus2 con la tónica arriba. Corte seco en el último «1»: la salida del final, eco y sala incluidos, baja a cero en 6 ms y la realimentación se corta.
- D8-B (final del Viaje): el tema conserva sus seis alturas (en La mayor, La Si Mi Re Do♯ La, dos vueltas iguales, una octava en 52–76), ahora como nota superior de los stabs dub. Entra el bombo con el sub; por capítulo se suman bajo dub, hats y rim, stabs y la sala (vi, IV, vi, V; tónica bajo el tema). Riser en la segunda vuelta; el golpe es la última nota del tema, la tónica; corte al final de la partitura. Misma duración, mismos visuales y «Tu mundo se abrió».
- D9-B (final de los once): la radio del Mundo calla desde su primer «1» hasta cerrar la escena; el Mundo sigue su curso y el final toma su swing. Las capas entran por sus ★ (D1) con voces dub. Tus frases suenan en la voz dub, fuera del filtro cerrado. Bajo tus frases y el silencio la subida hace un respiro (*breakdown*) y deja sitio; sigue con el tema.
- D9-C: coda escrita. En los tres últimos compases los stabs tocan el tema entero, con anacrusa de medio compás. Los dos primeros suben (filtro abierto y riser). En el «1» del último compás llega el golpe en la tónica, y en el siguiente «1», el último, el corte seco. Nada empieza después del golpe. No depende del nivel de Faros. Se conservan el arco, `credited`, el cierre a los 7 s y la falta de tarjeta (Q3).
- Pruebas: `tests/journey-finale-harmony.mjs` (seis alturas del tema en stabs, 396 contextos; frases en la voz dub; inicio solo con bombo y sub; golpe en la tónica sostenido hasta el corte; riser que cae en el golpe; nada tras el golpe), `tests/song-tiers.mjs` (coda con las seis notas, golpe sus2 en la tónica, riser, nada tras el último «1», con los once a ★ y a ★★ en tres escalas), `tests/song-transport.mjs` (silencio de la radio; las fuentes dub caen en el swing del Mundo, ±2 ms; el final no usa las voces de `song.js`), `tests/song-for-everyone.mjs` (frase en voz dub). `journey_finale_mix.py` y `song_stage_mix.py` exigen ahora corte seco (300 ms tras el último «1» ≥ 40 dB bajo el pico) y subida (primer cuarto ≥ 6 dB bajo el segundo más fuerte).
- Renders en `docs/panel/sesion-11/escucha/` (WAV mono, 22 050 Hz), con el mismo método: final del Viaje con su reproductor offline (normalizado a pico −1,9 dBFS); final de los once sobre el programador real del Mundo (`audio.js`, género minimal, La menor), a ★ y a ★★. Los «antes» son los de antes de Q7.
- Medidas de los renders: pico −1,9 / −1,0 / −1,1 dBFS; los 300 ms tras el último «1» quedan 127 / 76 / 76 dB bajo el pico; subida 16 / 11 / 8,5 dB. En los once el «1» se mide como se oye: la cadena maestra retrasa unos 21 ms. Las seis notas del tema son la clase de altura dominante en cada nota de las dos vueltas.
- Límites: medidas, no escucha. Jay aún no ha oído este arreglo; no hay escucha en teléfono. El sub-bajo apenas se oye en altavoces de teléfono: su octava y el clic del bombo llevan el pulso. `journey_finale_smoke.py` tarda ≈ 130 s, igual que en la base (CI corta a 145 s).


## Documentación al día y guía de auditoría externa · sin cambio de versión

Rama `claude/charming-darwin-dvbfc7`, sobre `main` (`1a898ce`). Petición de Jay antes de una auditoría en Codex.

- Nueva [guía de auditoría externa](docs/AUDITORIA_EXTERNA.md): qué queremos, qué no se discute, cómo se puntúa, qué entregar y cómo se decide aquí cada propuesta (sí, no o después, con la nota esperada).
- README, HANDOFF, HANDOFF_CLAUDE, índice, PANEL y AGENTS reflejan alpha.221 en `main` y Q7 pendiente de escucha.
- No cambia el juego.
## Q6 · Volver y tocar en el Mundo libre · 2.3.0-alpha.221

Rama `panel11/q6-mundo-libre`, sobre `panel11/q5-golpe-al-oirse` (informe de la sesión 11). Chen e Iwai. Decisiones de Jay: D7-C y D11-B.

- D7-C: quien abrió el Mundo alguna vez no vuelve a pagar diez cristales. Un día nuevo ya no saca del Mundo, tampoco a mitad del Viaje: cargas donde estabas, sin salto diario. Quien estaba en el Camino sigue en el Camino, con «Entrar al Mundo» en el dock.
- El dato es `lastWorldDay` o el logro «mundo»; los dos los guarda `enterWorld` y nada los borra. No hace falta marcador nuevo ni migración. El Estudio abierto desde el Mundo vuelve al Mundo.
- El Camino del día vuelve como paseo: sus diez primeros cristales dan ✦ (en el Viaje siguen callados, como antes). El décimo solo abre la puerta la primera vez; después no te mete en el Mundo.
- D11-B: en el Universo abierto el pulso suena al apoyar el dedo, como en el Camino, los capítulos y las rondas. Mantener 500 ms abre el escáner y arrastrar camina; al soltar no suena otro pulso. Se integra el cambio de Q5: el modo dedo de las pruebas (`?dedo`) conserva sus gestos sobre objetos al soltar, y ahí un toque quieto que no abre el escáner sigue siendo pulso.
- Jugador nuevo: igual que antes, empieza en el Camino y necesita diez cristales, también en un día nuevo.
- No cambia: notas, voces, mezcla, el cubo (pequeño), mapas, semillas ni guardados.
- Pruebas: `tests/crystal-path.mjs` afirma que el jugador nuevo sigue necesitando los diez cristales en un día nuevo (línea 26) y añade el que vuelve: guardado en el Mundo a mitad del Viaje con `todayKey` de ayer, guardado antiguo con solo el logro, Estudio, ✦ del paseo y sin entrada forzada. `tests/free_world_return_smoke.py` (navegador): jugador nuevo en el Camino; un guardado en el Bosque con `todayKey` de ayer carga en el Bosque; en el Universo abierto, 40 toques a tiempo con mediana ≤ 15 ms y p95 ≤ 30 ms del `pointerdown` a la nota (sin latencia de salida), un pulso por toque, escáner a los 500 ms y arrastre que camina. `tests/touch_precision_smoke.py` afirma ahora que en el Mundo libre el vacío pulsa al apoyar, una sola vez, y que arrastrar camina y mantener abre el escáner. `tests/strike_heard_smoke.py`: los toques quietos de 100, 300, 470 y 600 ms pulsan una vez al apoyar; el de 600 ms abre además el escáner.
- Límite: sin prueba en teléfono ni con personas. Quien se queda en el Mundo ya no recibe el salto diario al cargar; lo recibe al entrar desde el Camino.

## Q5 · El golpe al oírse · 2.3.0-alpha.220

Rama `panel11/q5-golpe-al-oirse`, sobre `panel11/q4-refugio-y-lugares` (informe de la sesión 11). Mizuguchi; Iwai para el toque. Incluye D10-B en el acierto.

- La onda nace con su nota: se crea en el punto del toque y se dibuja, y empieza a alcanzar objetos, cuando su nota se oye (`cueDelay`, en el acierto y fuera de tiempo). Al tocar solo aparece la marca de la Línea. Sin sonido o con el audio suspendido, sale al momento.
- El toque fuera de tiempo (y el pulso demasiado seguido) suena en la siguiente semicorchea ya programada a 20 ms o más (`touchSlot`, `touchSoon`), no en el siguiente paso aún sin programar. Comparte con la cola el límite de 4 voces por paso. Modelo a 96 BPM: mediana 98 ms y p95 167 ms (antes, 195 y 265).
- En el Mundo libre, un toque quieto que no abre el escáner es pulso, dure lo que dure: de 450 a 500 ms ya no queda mudo.
- D10-B: en el acierto, solo el marco del cubo y el «1» son dorados. La onda, la marca de la Línea y el arco del acierto (`hitFlash`) pasan a blanco.
- No cambia: notas, voces, mezcla, la regla D2 del Mundo libre, el tic de la ronda, los cuadros del eco de la Cueva, el cubo (pequeño), mapas, semillas ni guardados.
- Pruebas: `tests/touch-timing.mjs` (modelo del programador a 96 BPM: mediana ≤ 100 ms, p95 ≤ 180 ms, ≤ 4 voces por paso) y `tests/strike_heard_smoke.py` (latencia 0,25 s: la onda vence a ≤ 20 ms de su nota; tras un acierto, el único trazo dorado es el marco; toques de 100, 300, 470 y 600 ms dan pulso o escáner). `tests/journey-pulse.mjs` afirma ahora el arco blanco del acierto.
- Límite: en Chromium sin pantalla el temporizador dispara la onda 2–60 ms tarde bajo carga, como el aterrizaje del cubo. Sin prueba en teléfono ni con personas.

## Q4 · Refugio y Lugares legibles · 2.3.0-alpha.219

Rama `panel11/q4-refugio-y-lugares`, sobre `panel11/q3-tu-cancion` (informe de la sesión 11). Wong, Nesbitt y Hodent.

- Refugio: los rótulos de sala se miden con `measureText` y van tras la esquina de su sala, sin cruzar otro texto ni el marco. Si no caben enteros en la franja de la casa, no se dibujan (antes «RAÍZ» salía cortado en horizontal). La barra de pasos y la luz de cada sala quedan sobre su suelo; antes cruzaban el rótulo de la sala de abajo.
- En vertical, la Voz va bajo el último rótulo de sala, en la franja libre antes del panel. Ya no tapa «Cielo». En horizontal sigue sobre el panel lateral.
- «PRISMA» va encima del prisma, no sobre la línea del suelo.
- Salas cerradas, Taller, Prisma y Núcleo a 4,5:1 o más (`#ffffff8c`; eran `#ffffff4d` y `#ffffff73`). Las salas abiertas, `#ffffffcc`.
- Cada sala cerrada muestra solo la condición más cercana, con un número: «Cielo · faltan 3 lugares» (`roomNeed`: la menor parte que falta; empate, lugares). Tocarla dice lo mismo. La regla D3 no cambia: lugares o ★, lo que ocurra primero.
- Lugares: «↑ N más arriba» cuando hay filas arriba. ★ a 17 px (cada ★ mide 12 px o más). «Ir» y «Seguir» de 72 px, en la línea del nombre.
- Con logros sin leer, ☰ → Bitácora abre en Logros (2 toques). Si no, donde se dejó.
- El mapa llena su caja: mínimo de 4 regiones por lado (eran 12) y margen fijo de 24 px. El círculo del origen no pasa de 12 px.
- Se conserva lo de Q1: lugares en blanco y `#houseStars` dice «Lugares», sin número. Nuevo ID `#lugaresScrollUp`; los demás se conservan.
- No cambia: cubo (tampoco el del Refugio), música, mapas, semillas, guardados, salas ni objetos.
- Pruebas: `tests/refugio-legible.mjs` (la condición más cercana en todos los estados cerrados, un solo número, D3 igual) y `tests/refugio_legible_smoke.py` (teléfono, horizontal y escritorio: ningún texto cruza otro, la Voz ni el marco; rótulos ≥ 4,5:1; Llanura o «↑»; ★ ≥ 10 px; «Ir» y «Seguir» del mismo ancho a ±2 px del nombre; Bitácora en Logros; mapa ≥ 40 % de su caja). `favorites_smoke.py` comprueba que la Bitácora abre en Logros solo con logros sin leer; ese recorrido, `creative_smoke.py`, `glass_smoke.py`, `mirrors_smoke.py`, `encounter_depth_smoke.py` y `smoke.py` pasan a la pestaña Mapa antes de buscar en ella.

## Q3 · Tu canción se ve crecer y se cierra · 2.3.0-alpha.218

Rama `panel11/q3-tu-cancion`, sobre `panel11/q2-lo-que-cuenta` (informe de la sesión 11). Iwai, Simogo y Chen; Pope para el arco.

- El aro de cada capa con ★ se llena en proporción a lo que suena, contado en sus golpes (`layerShare`): Lago a ★ 12/24, a 1,5 16/24, a 1,94 23/24. Sin cifra. Colchón y Eco ya suenan enteros con ★: su arco va cerrado.
- ★, ★★ y ★★★ también por forma: arco sin relleno; aro relleno; aro relleno con un aro exterior fino. El color por saturación sigue.
- Sin velo dorado fuera del final.
- La tarjeta dice «Tu capa de Lago creció» solo si la ronda hizo crecer la capa (`layerGrew`, la misma regla que «crece» en `play-curve.mjs`).
- Tras el final de once no vuelve la tarjeta. La ronda se conserva: ★ y récord en Lugares, logros en la Bitácora.
- Créditos una vez de verdad: al mostrarlos se guarda `credited` (campo nuevo, `false` por defecto; se normaliza sin borrar nada). Un final repetido acaba en «Tu canción está completa».
- El final de once (y la versión maestra) se cierra solo 7 s después de su último compás.
- No cambia: notas, voces, arreglo, mezcla, umbrales, cubo ni ID de HTML. El final del Viaje sigue dibujando sus anillos como antes.
- Pruebas: `tests/song-grows.mjs` (arco ≤ 1/16 de los golpes que suenan en las once capas, tres arcos distintos, forma por estrella, línea de crecimiento igual a «crece», `credited` en el guardado). Se actualizan `song-for-everyone.mjs`, `song_finale_flow_smoke.py` (sin tarjeta tras «Seguir»; el segundo final sin nombres y cerrado 5–10 s después del último compás), `result_clarity_smoke.py` y `song_stage_smoke.py` (Ruinas ★ sin relleno, ★★ relleno, sin velo).

## Q2 · Lo que cuenta la ronda · 2.3.0-alpha.217

Rama `panel11/q2-lo-que-cuenta`, sobre `panel11/q1-reglas-a-la-vista` (informe de la sesión 11). Matsuura; Mizuguchi para el reloj.

- La Cueva cuenta el eco, no la corchea. El juego dice qué cuenta cada pulso (`counts`) antes de actuar: un paso del patrón es acierto; un paso equivocado, o fuera de tiempo en el compás de respuesta, es fallo; durante la llamada no cuenta. La gota dorada sigue contando y cierra la ronda.
- La Cueva juzga con `heardTime` (el reloj calibrado). `journey-pulse.js` le pasa el momento oído del toque.
- Los pulsos mientras el lugar canta su patrón no cuentan: desde el inicio de la ronda hasta el fin de sus dos compases, tal como se oyen (`rhythmDemo` en `journey-rhythm.js`). Vale también para los capítulos del Viaje. Sin sonido no se canta y todo cuenta, como antes.
- Aviso: la Cueva será algo más difícil. Es lo justo: la tarjeta mide lo que el lugar pide.
- No cambia: ventana de ±80 ms, umbrales, ★ ya ganadas, música, guardados.
- Pruebas: `tests/round-counts.mjs` (un acierto y un eco equivocado dan 50 %; la llamada no suma; con calibración 0,15 se acepta el borde del compás de respuesta; doce toques durante los dos compases cantados dejan `run.total` a 0).

## Q1 · Reglas a la vista · 2.3.0-alpha.216

Rama `panel11/q1-reglas-a-la-vista`, sobre `claude/charming-darwin-dvbfc7` (informe de la sesión 11). Nesbitt y Hodent; Roset para el dorado. D10-B de Jay para ✦.

- Dorado solo para lo ganado. Las cifras de lugares van en blanco: «Lugares 5 / 11», el estante del Refugio («★ N / 33», sin «LUGARES») y la línea de remezcla. «Explorar a pie» es un botón blanco. Las marcas de no leído de Bitácora, Menú y Tu cubo van en blanco. En el mapa, la marca del Refugio también. Las ★ bajo trofeos y portales siguen doradas.
- ✦ sigue dorada, pero ya no es mayor que ★: las tres cifras del HUD miden 11 px, peso 500. Sin hueco cuando `#sparkGain` está vacío; las tres acaban en la misma x.
- Una cifra por concepto: `#houseStars` dice «Lugares», sin número (conserva su ID). Una palabra por cuenta: el mapa dice «portales abiertos» y «tu Refugio».
- «Vista tranquila»: título y subtítulo dicen el estado. El subtítulo nombra Tu cubo, cifras y herramientas.
- Un mensaje al salir del Viaje: fuera «Se abre el Mundo libre.». «Prólogo» va a la Bitácora sin aviso. El final aterriza en el Refugio sin la voz de primera visita (se oye en la primera visita real). Hasta el primer portal, un color o una pieza ganados esperan en Tu cubo sin aviso.
- No cambia: música, cubo, mapas, guardados, umbrales ni el dorado de los objetos de juego, del cielo del final ni de los títulos de cierre.
- Pruebas: `tests/rules-in-sight.mjs` y `tests/rules_in_sight_smoke.py` (sin píxel dorado fuera de ★/✦ en Lugares, Refugio y mapa; HUD alineado). Se actualizan `journey-finale.mjs`, `journey_finale_smoke.py` (ningún aviso entre «Tu mundo se abrió» y el primer toque) y `refugio_lugares_smoke.py`; `crystal_play_smoke.py` y `entry_jump_smoke.py` piden ahora ✦ al tamaño de ★ (antes ≥ 14 px). Auditoría, `npm test` y 49 recorridos de navegador aprobados. `verify-e-preservation` señala `achievements.js` y `celebration.js` (solo avisos). Cabeceras de `docs/VIAJE.md` y `docs/MUNDO.md` en alpha.216.

- Arreglo en el PR de Q1–Q6: los avisos de descubrimiento («Vida», «Forma nueva», «Familia nueva», «Reliquia», «Récord») también callan desde «Tu mundo se abrió» hasta el primer portal; lo encontrado se guarda igual (`src/discovery.js`).

## Sesión 11 del panel · sin cambio de versión

Rama `claude/charming-darwin-dvbfc7`. Petición de Jay: revisar de nuevo con puntuación.

- Doce perfiles sobre alpha.215: puntuación ciega y después contraste con la sesión 10. [Informe](docs/panel/sesion-11/informe.md), [expediente](docs/panel/sesion-11/expediente.md) y doce análisis en `docs/panel/sesion-11/`.
- Media 6,7, Menús 7, Detalle visual 5,5. Plan Q1–Q7 y decisiones D7–D11. No cambia el juego.
- Capturas de menús adaptadas al menú de P2 (`docs/panel/sesion-11/evidencia/capturas-menus.py`).

## Verificador de preservación tras P3–P8 · sin cambio de versión

Rama `claude/charming-darwin-dvbfc7`, sobre `main` (`5464612`). Petición de Jay.

- `scripts/verify-e-preservation.mjs` añade una segunda referencia: `main` tras P8 (`5464612`, PR #357 y #358 con CI completo). Los 56 archivos protegidos que cambiaron P3–P8 y los contratos del final de once, el final del Viaje, el Jardín, la ronda y el paso del final se comparan con ella byte a byte. El resto sigue comparándose con la base E.
- No abre ningún archivo nuevo a cambios: la lista permitida no crece. Revisado antes de fijarlo: en los módulos de sonido, P5 solo movió las luces a la nota oída y añadió el pulso suave aprobado; notas y síntesis no cambian.
- Pruebas: el verificador pasa (301 archivos, 13 contratos) y falla al tocar un archivo fijado (`interactions.js`) o una nota del final (`song-stage.js`). Auditoría y `npm test` aprobados. Sin navegador ni audio: no cambia el juego.

## P8 · Menos contadores · 2.3.0-alpha.215

Rama `panel10/p8-menos-contadores`, sobre `panel10/p7-color-ganado`. Pope, con Hodent para las hojas (panel 10); D3 = A + B de Jay.

- Un solo ★: las reliquias del Mundo (`S.stars`) se llaman «Reliquias» en la Constelación, la Bitácora, la hoja de salida, el aviso al encontrarlas, las imágenes para compartir y tres logros (`estrella1`, `e30`, `e100`; mismos ID, nada ganado se pierde). El HUD ya no escribe `#starsN`; el elemento sigue en la página, oculto. `#oStars` (hoja `#mOut`, sin llamada viva a `exitWorld(true)`) se conserva y dice «Reliquias».
- Vista completa con tres cifras: ★ de 33 (`#hudStars`, dorado), ✦ y lugares de 11 (`#hudPlaces`), desde que se abren los lugares. Día, distancia, elementos y la meta de chispas salen del HUD (los ID siguen). Regiones, continentes y récord pasan de Mapa a «Tú» en la Bitácora. En el Mundo, la línea de objetivo dice «Explora a tu ritmo» en vez de «Regiones N · Formas N».
- Sin contadores a cero en hojas de primer nivel: menú (✦ y ★ solo con valor), Tu cubo (saldo y regalos), Mapa (favoritos, hitos, oídos, rarezas, lugares abiertos) y Refugio («0 sonando», «0 de 40»).
- Refugio (D3-B): las salas se abren por lugares completos o por ★ (Jardín 6 o 9 ★, Cielo 8 o 15 ★, Raíz 11 o 24 ★), nunca por días. Al cargar, una casa sin `roomRule: 2` suma las salas que abría la regla antigua (3/7/14 días o 8/20/40 logros): ninguna sala abierta se cierra. Casas de versión futura intactas.
- Como mucho un logro por aviso: «✦ Logro · nombre»; los demás esperan, sin leer, en la Bitácora. No se retira ningún logro ni se crean logros de tiempo o distancia.
- No cambian el cubo, la música, chispas, piezas compradas, semillas ni mapas.
- Pruebas: `tests/fewer-counters.mjs` (migración, regla de salas, ★ único, tres cifras, un logro por aviso); actualizadas a la regla nueva `house*.mjs`, `release-closure.mjs` y los recorridos de Refugio, menú, HUD y Tu cubo. `menus_smoke.py` comprueba que el HUD muestra como máximo tres cifras.

## P7 · El color se gana y se ve · 2.3.0-alpha.214

Rama `panel10/p7-color-ganado`, sobre `panel10/p6-tu-cancion`. Roset, Nesbitt, Wong y Mizuguchi (panel 10); D4 de Jay.

- Color del lugar (D4): portales completos, marcas de capítulo, mapa y trofeos del Refugio toman el color de su lugar (`earnedColor`, `color-safe.js`). Abiertos sin completar, en blanco; la columna y la baliza, en blanco. El dorado queda para las ★.
- Pigmento, no velo: se quita el relleno plano del bioma recuperado. Su color entra en las formas con una mezcla `color` que deja el negro negro. La luz del bioma es un charco menor alrededor del cubo; el amanecer y el atardecer ya no tiñen toda la pantalla; la niebla es algo más fina.
- El color vuelve en un compás (2,4–3 s): el gris se retira en un círculo desde el cubo hasta el borde, con un frente fino de su color. Con movimiento reducido, fundido del mismo largo.
- Menos textura en Lago (dos ondas por estanque), Dunas (una de cada dos franjas) y Ruinas (marcas del suelo más tenues). Caminantes y criaturas de píxeles a un tercio de brillo en el Viaje y en las rondas.
- El Camino del Viaje no escribe «Pulso»: el cristal cercano late con el golpe.
- Daltonismo: `SAFE_COLORS` sin repetidos. Dunas, Cristales y Ruinas pasan a ocre, verde pálido y azul pizarra, separados en deuteranopía, protanopía y tritanopía simuladas.
- Cueva: la llama roja se queda; los cuadros del eco pasan a blanco y dorado, todos de 7 px. Refugio: «cerca», «armado» y el paso del Taller en blanco. «Grabar»: píldora blanca con un punto cuadrado que parpadea.
- No cambian el cubo, la música, las semillas, las posiciones ni los mapas.
- Medida de Roset con `scripts/panel-capture.py` (390×844; «encendido» = canal máximo > 10, «color» = croma > 24). Capítulos y lugares, antes → después: Lago 34 → 14 % encendido, Dunas 57 → 19 %, Vacío 29 → 7 %, Cristales 25 → 10 %, Ruinas 15 → 8 %; máximo 19 % (Dunas). Anillo (Bosque recuperado, con niebla): mediana (33,42,37) → (3,17,8) y color 0,13 → 17,8 %. Los capítulos aún pálidos siguen grises a propósito. En un capítulo de Lago recuperado: mediana (1,7,12) y 5,5 % con color; el gris pasa de 1 a 0,05 en 2,2 s.
- Pruebas: `tests/color-earned.mjs` (Node) y `tests/color_earned_smoke.py` (navegador). `echo_smoke.py` falla también en la rama base (la tarjeta de la Cueva no sale en 15 s); no lo causa esta fase.

## P6 · Tocar donde sea y Tu canción para todos · 2.3.0-alpha.213

Rama `panel10/p6-tu-cancion`, sobre `panel10/p5-un-solo-reloj`. Mizuguchi, Chen, Wintory, Simogo e Iwai (panel 10); D1-B, D2-A y D5 de Jay.

- Tocar donde sea (D2-A): en el Camino, los capítulos del Viaje y las rondas de lugar, el pulso suena al apoyar el dedo en cualquier punto del lienzo. Arrastrar sigue caminando y descansar abre el escáner. En el Mundo libre no cambia: el cubo al apoyar, el vacío al soltar. Guía, lección y pista del Camino dicen «Toca al ritmo. Arrastra para moverte.».
- La capa crece (D1-B): entre ★ y ★★, cada 1,25 puntos de tu mejor porcentaje desde el 55 % suma un tiempo de los compases callados (≈ 62 % de la capa al 60 %, tres cuartos al 67 %). La melodía de Faros gana una cuarta y quinta nota. Una ronda sin sonido ya no sube el mejor porcentaje. Umbrales de estrellas sin cambio.
- `scripts/play-curve.mjs` cuenta el evento «crece» en la regla de 12 min. El modelo cambia su supuesto de reintentos: tras un segundo reintento que no suma nada, pasa al lugar siguiente. Resultado: el 60 % cumple hasta el minuto 120 (mayor hueco 8,9 min; 13 veces crece). Con el supuesto anterior quedaba en 12,2 min. Sin sonido sigue sin cumplir (81,8 min).
- La victoria de una ronda suena al nivel ganado (su ★ con crecimiento, ★★ o ★★★), no siempre ★★. Los capítulos del Viaje siguen con la capa entera.
- El gran final (D5): la ronda que completa los once desemboca sola en él, sin tarjeta delante; la escena se abre 0,3 s antes del fin de la caída y su primer compás es el siguiente «1». La tarjeta sale al cerrar el final. Durante tus frases y la primera vuelta del tema solo siguen colchón y bajo; las demás capas vuelven en la segunda vuelta. Tu frase suena con el arpegio suave del final del Viaje en lugar de `lead`. Créditos de autoría solo en el final de once; el del Viaje dice solo «Tu mundo se abrió» y la versión maestra solo sus dos líneas.
- Sin rótulo en el compás de silencio. En el anillo de Tu canción, ★, ★★ y ★★★ se distinguen por saturación (45, 75 y 100 %); el blanco del Vacío, por brillo.
- No cambian la generación, las notas, las armonías, la síntesis, la música del Mundo ni las notas guardadas. Medida de Wintory (todas las capas en ★★, seis notas por lugar): compás de frase 6 de 9 eventos tuyos (antes 6 de 65); compás del tema 3 ajenos (antes 59). En ★★★: 6 de 12 y 6 ajenos.
- Pruebas: `tests/song-for-everyone.mjs` (Node), `tests/tap_anywhere_smoke.py` y `tests/song_finale_flow_smoke.py` (navegador). Se actualizan `play-curve.mjs`, `journey-finale.mjs`, `touch_precision_smoke.py`, `song_authorship_smoke.py`, `journey_finale_smoke.py` y `result_clarity_smoke.py`, que afirmaban lo anterior. `tap_anywhere_smoke.py`: 40 toques en un capítulo, del `pointerdown` a la nota p95 ≈ 12,5 ms (sin contar la latencia de salida). `song_stage_mix.py` mide el hueco: frase −27,4 dB frente a −23,5 dB con todas las capas (base: −23,6); primera vuelta del tema −26,0 frente a −23,1 en la segunda (base: −23,1 y −23,0). `journey_finale_mix.py` y `victory_mix.py` sin cambios (picos 0,144 y 0,179). `victory_live_smoke.py` falla igual en la rama base (7532 ms frente a un margen de 7500), no por esta fase. `surf_smoke.py` espera la tarjeta 15 s. Renders sin escucha humana: Jay debe oír el final antes de integrar. Sin teléfono.

## P5 · Un solo reloj · 2.3.0-alpha.212

Rama `panel10/p5-un-solo-reloj`, sobre `panel10/p4-cierre-de-ronda`. Mizuguchi e Iwai (panel 10).

- Un reloj para la luz: `cueDelay` y `audibleTime` incluyen la latencia de salida y la calibración (`latencyNudge`). Pasan a él los temporizadores con `ac.currentTime` crudo: vidrio, espejos, materia, vida, iniciativa, hitos, quietud, cajas, especies (`render.js`), señales (`feedback.js`), parches, eco, victoria, tienda del cubo y `jam.js`. También los dibujos que comparaban con el reloj crudo: Momentos, capas del universo, encuentros, estudio, culturas, percusión, microinstrumentos, fenómenos y la espera de la tarjeta.
- La calibración mueve la luz: con `latencyNudge` 0,15 el cursor de la Línea cruza el paso 0 cuando se oye su bombo, y el aterrizaje del acierto espera lo mismo. El juicio no cambia.
- Un golpe, una imagen: el acierto ya no engorda el cubo al tocar; solo golpea al oírse. Fuera de tiempo, el cubo engorda cuando suena su nota cuantizada. La onda sigue saliendo al tocar.
- Ningún toque mudo: el pulso demasiado seguido suena con su misma voz al 45 % en la siguiente semicorchea (como mucho 4 por paso, 8 pendientes). Sigue sin juzgarse y deja su marca gris.
- No cambian la generación musical, las voces, la mezcla, la ventana de ±80 ms ni el límite entre toques (240 ms, o dos tercios de corchea en ritmos de corcheas). El ambiente sigue con el reloj de audio: es sonido, no luz. El rayo de Tormenta tampoco cambia: su destello dispara el trueno en el mismo instante, y retrasarlo movería el sonido.
- Pruebas: `tests/one-clock.mjs` (Node): sin temporizadores crudos, brillo ≤ 20 ms tras su nota con 250 ms de latencia, cursor y aterrizaje con `latencyNudge` 0,15, un pico por acierto, diez toques a 8 Hz con diez sonidos y ≤ 4 por semicorchea. `echo_smoke.py` espera la tarjeta 15 s, como los recorridos que P4 ya ajustó (la espera de la caída rozaba los 5 s). Renders aprobados: `shop_sound_mix`, `wardrobe_mix`, `music_direction_mix`, `glass_mix`, `percussion_mix`, `micro_mix`, `journey_mix`, `journey_finale_mix`, `victory_mix` y `audio_mix`. Picos frente a la base: tienda 0,88252 / 0,88252, vestuario 0,88169 / 0,88168, percusión 0,87975 / 0,87975. Sin teléfono físico, auriculares Bluetooth ni personas.

## P4 · El cierre de la ronda · 2.3.0-alpha.211

Rama `panel10/p4-cierre-de-ronda`, sobre `panel10/p3-golpe-en-el-cubo`. Simogo, Chen, Matsuura y Pope (panel 10); D1 y D3 de Jay.

- La tarjeta de resultado espera el fin de la caída de la victoria, tal como se oye (`journeyVictoryState().end` más la latencia de salida). Sin sonido sigue a 1,2 s.
- La tarjeta ya no muestra logros. Los de la ronda van a la Bitácora, con su marca de no leídos y sin aviso; mientras la tarjeta espera tampoco sale ninguno.
- Entre 70 y 74,9 % sin ★★: «A 0,4 de ★★» (décimas que faltan, sin redondear hacia arriba) y «Otra vez» junto a «Seguir hacia».
- Cuenta en vivo sin texto: un tic al final de la Línea se enciende en dorado mientras los pulsos a tiempo alcanzan el 75 % (70 % en Maestro). Usa el mismo cálculo que la tarjeta. No sale en Libre ni sin sonido.
- Tras la victoria (D1): objetivo, menú, columna dorada, brújula, nota guía del portal y «Seguir hacia» de la tarjeta apuntan al lugar sin ★★ con mejor porcentaje; con todas las ★★, al que no tiene ★★★. Con 33 ★ vuelve «Explora a tu ritmo».
- Sin cambios en umbrales, redondeo, música ni guardados. El final de los once sigue llegando al cerrar la tarjeta (P6).
- Pruebas: `tests/round-close.mjs` (Node) y `tests/round_close_smoke.py` (navegador; diez rondas del Jardín). Se actualizan `game-objective.mjs`, `places-ring.mjs` y `clean_screens_smoke.py`, que afirmaban lo anterior. En seis recorridos de lugar la espera de la tarjeta pasa de 5 a 15 s, porque ahora espera la caída. `scripts/panel-capture.py` espera a la tarjeta en `33-resultado`. Sin teléfono físico ni personas.

## P3 · El golpe junto al cubo · 2.3.0-alpha.210

Rama `panel10/p3-golpe-en-el-cubo`, sobre `panel10/p2-menus`. Matsuura, Wong y Mizuguchi (panel 10).

- Dedo fantasma: anillo de 1 px con punto de 3 px que nace junto al cubo. En reposo cabe en 14×14 y su centro queda a 27 px del cubo. Arrastra desde el cubo y vuelve a su lado para tocar.
- El dedo late en los pasos del lugar (`journeyRhythmState().steps`), en tiempo audible: Dunas y Lago en 2·6·10·14, Faros en 1·3·y. Antes latía con el pulso crudo y antes de oírse.
- Un anillo fino se cierra sobre el cubo en los cuatro pasos previos a cada paso que cuenta; llega al radio mínimo con la marca de la Línea y es dorado en el «1». El cubo no cambia de tamaño. Con movimiento reducido no se mueve.
- Línea: base a alfa .38 sobre una franja negra (medida en captura: 97, antes 41–48). El «1» se pinta en dorado cuando cuenta.
- Marcas de capítulo de 4 px, solo dentro de un capítulo; ya no aparecen en las rondas de lugar.
- Las chispas doradas de los diez juegos vuelan a la posición real de `#bar`, leída una vez por tamaño, no a `barY=42`.
- Sin cambios en música, ventana de ±80 ms, umbrales, guardados ni tamaño del cubo (6×6 px en `00-inicio`, igual que antes).
- Pruebas: `tests/beat-by-cube.mjs` (Node) y `tests/beat_by_cube_smoke.py` (navegador). El vuelo de la chispa se prueba con su función de dibujo y la barra real, no con una ronda jugada. Sin teléfono físico ni personas.

## P2 · Menús · 2.3.0-alpha.209

Rama `panel10/p2-menus`, sobre `panel10/p1-pantallas-limpias`. Estructura de Hodent y retícula de Nesbitt (panel 10). Se reordena; no se añaden destinos.

- Jugar: «Seguir hacia …» y debajo Lugares, Tu cubo, Refugio y Bitácora. Ajustes y Cómo jugar, siempre a la vista. La fila reparte el ancho entre los botones visibles: sin huecos.
- Cabecera: ★ n/33 primero y en dorado. La vista tranquila no muestra cifras, pero conserva Lugares (★ a dos toques) y Bitácora. Tu cubo y la tienda siguen solo en la completa (regla del Viaje).
- «Más» se abre cerrado. Ir: «Volver al Camino» en el Mundo o «Explorar» fuera de él, Mapa y favoritos, «Volver al punto anterior», «Viajar a otra tierra». Crear: Efectos y eco, «Grabar 60 s», Compartir. Tú: Vista, Cuenta («Opcional»), Guardar copia, Actualizar. Un rótulo sin filas se oculta.
- Un botón para cada viaje: `#bPrimary` ya no cae en «Ayuda y cuenta» y `#bWorld` se oculta cuando no haría nada.
- Una palabra por concepto: favoritos en `#era`, Mapa, la búsqueda y el perfil; «Modo crear: sí/no»; «Otras formas de jugar».
- Ajustes empieza con el volumen y va en tres bloques: Sonido y tiempo, Ver y sentir, Partida («Empezar de cero» al final, con borde). «Más sonido» vuelve a Ajustes al cerrarse o con Escape.
- Todos los cierres inferiores dicen «Cerrar». Pestañas de la Bitácora con `role="tab"` y `aria-selected`; un solo estado activo. Casillas cuadradas. Texto de menú desde 12 px; `.spark-goal` y `.spark-power button` a 44 px. Avatar de 12 px en su marco; foco de «Más» con el contorno común.
- Cuenta (D6 = A): «Opcional. Se juega sin cuenta.». Con la nube en pausa (`CLOUD_CONFIG.paused`) no hay «Crear cuenta» ni «Eliminar cuenta», ni aviso de nube en el Mundo. «Salir de cuenta» solo con sesión.
- En horizontal la fila principal va en una línea por botón; el menú cabe con «Más» cerrado en 390×844, 844×390 y 1280×800.
- Sin cambios en música, cubo, mapas ni guardados. IDs conservados; nuevos `rMenuVolume` y `menuVolumeNow` (el código ya los esperaba).
- Pruebas: `tests/menus_smoke.py` (tres tamaños, ambas vistas, cada botón visible actúa) y `tests/menu_v2_smoke.py` actualizada. Sin teléfono físico ni personas.

## P1 · Pantallas limpias · 2.3.0-alpha.208

Rama `panel10/p1-pantallas-limpias`, sobre `claude/charming-darwin-dvbfc7`. Detalle visual de Nesbitt (panel 10), prioridad alta y media.

- Palabras enteras o con guion: «Copiar diagnóstico» y la versión ya no se parten; el diagnóstico va en dos columnas.
- Lugares abre en filas enteras en teléfono, horizontal y escritorio; la cita de la remezcla no se parte.
- Fuera de pantalla, la columna dorada del portal es una luz de 140 px a la altura del rumbo, con degradado.
- Refugio: en horizontal la casa encaja a la izquierda del panel; la Voz baja bajo y = 120 (en horizontal, sobre el panel); los rótulos se miden y no cruzan el borde.
- Menú: la cabecera tapa el margen superior en horizontal; el pie se funde cuando hay más debajo.
- Filas de botones con la misma altura; «Seguir» va primero y a todo el ancho en resultado, Lugares, portal y guía.
- Tu canción abre con el foco en su título oculto, no en «Otra vez».
- Las muestras forzadas no muestran «Laboratorio» ni su código fuera del laboratorio.
- Mapa: la leyenda va por elementos, sin separador colgante, y deja aire antes de los botones. «Se guarda una copia» en gris.
- Sin cambios en música, cubo, guardados ni estructura del menú (P2).
- Pruebas: `tests/clean_screens_smoke.py` (tres tamaños) y `tests/places-ring.mjs` ampliada. Sin teléfono físico.

## Panel, sesión 10 · sin versión

Rama `claude/charming-darwin-dvbfc7`, sobre `main` (alpha.207, tras integrar E1–E7 y la limpieza en el PR #355). Solo documentación.

- Doce perfiles simulados revisaron la app con la memoria borrada: los diez de siempre más Celia Hodent (menús) y Harry Nesbitt (detalle visual). Media 6,7; Menús 5,5; Detalle visual 5,5.
- Pope consolidó un plan por fases P1–P8, cada una con su rama `panel10/…`, y seis decisiones para Jay (D1–D6). [Informe](docs/panel/sesion-10/informe.md).
- Sin escucha en teléfono ni pruebas con personas.

## Traspaso y limpieza · misma versiónalpha.207

README, HANDOFF canónico y entrada para Claude; guías técnicas consolidadas, historial separado y estados corregidos. Retirados163 informes generados sin referencias, con manifiesto recuperable en Git. Código, música, mundos y partidas intactos. [Detalle](docs/LIMPIEZA_REPOSITORIO.md).

## E7 · 2.3.0-alpha.207

Candidato de validación, verificador de preservación y registro de aceptación sin puntuaciones inventadas. Libro compacto, filtros plegables, favoritos directos sin listado duplicado, destinos cerrados legibles; concordancia en Favoritos; cierre con Escape, porcentajes, final del Jardín y arrastres transaccionales. Luces de patrones, Refugio y canción siguen su instante audible y respetan los silencios. [Entrega](docs/ENTREGA_E.md).

## E6 · 2.3.0-alpha.206

La canción identifica tu aporte en el tramo real y distingue la vista de capas del final personal. Cierre coherente hacia el Mundo libre. Música y notas guardadas intactas. [Entrega](docs/ENTREGA_E.md).

## E5 · 2.3.0-alpha.205

Selección de voces clara y acceso al Refugio desde el libro. Ediciones del jardín con rollback al fallar escritura; tarjetas conservadas. Favoritos identifica trabajo pendiente sin eliminarlo. [Entrega](docs/ENTREGA_E.md).

## E4 · 2.3.0-alpha.204

Lugares enfoca el siguiente destino y explica el desplazamiento; cierres de cabecera consistentes. Final5 con salida explícita, sin omisión al tocar el fondo. Etiquetas pendientes y controles de tarjeta legibles. [Entrega](docs/ENTREGA_E.md).

## E3 · 2.3.0-alpha.203

Ayuda directa desde el menú; una acción actual resaltada, sin objetivo duplicado. Jardín comparte su objetivo real con la demostración y distingue sembrar, regar y cosechar. [Entrega](docs/ENTREGA_E.md).

## E2 · 2.3.0-alpha.202

Entradas canceladas al perder foco/abrir controles, sin pulsos al cancelar. Primer tiempo legible y espera visual distinta de avance. Música y tamaño del cubo intactos. [Entrega](docs/ENTREGA_E.md).

## E1 · 2.3.0-alpha.201

Resultados precisos: porcentaje no redondea a una estrella sin ganar; cronómetro coherente y umbrales visibles. Avisos visuales residuales siguen salida audible y descartan callbacks obsoletos, sin cambiar sonido. [Plan y entrega](docs/ENTREGA_E.md).

## Panel9 · evaluación de alpha.200 integrada

Diez revisores nuevos y16 capturas actuales. Nota provisional7,6; audio técnico y sensación sin aceptación física. Se conservan todas las notas anteriores y su distinto alcance. Se reproducen redondeo de porcentaje/cronómetro en resultados y se verifica sincronía visual residual. Solo documentación y evidencia; no cambia música, mundos, progreso ni versión. [Informe](docs/panel/sesion-9/informe.md).

## Integración de alpha.200

Jay autoriza incorporar a main la pila completa de23 commits hasta `2048e245`, mediante una sola integración. El catálogo de audio pasa de tres a seis grupos aislados tras agotar40 minutos: conserva todas sus59 pruebas. Se conserva el runtime ya entregado; se actualizan estado y traspaso. El catálogo completo detectó ocho pruebas antiguas: se ajustan a recompensas K2, ayudas explícitas, menú compacto, guía/teletransporte por lugar, poderes combinados y la etiqueta «Otro paisaje», conservando sus comprobaciones funcionales. CI completo del PR354 aprobado y merge realizado. [Registro](docs/INTEGRACION_ALPHA_200.md). La aceptación con personas sigue pendiente.

## N8 · 2.3.0-alpha.200

Candidato alpha.200 con revisión independiente, cierres de fallos reproducidos y preservación verificada. Corregidos multitáctil, pausa retenida tras salto, abandono fallido, interpretación de fuente compartida, lectura de aprendizaje incompleto y métricas de Camino/once rondas. No se certifica nueve ni producción sin evidencia humana y CI.

Verificación: 253 suites Node; regresiones de táctil, tarjetas, métricas, foco, cuota y offline aprobadas. UI24 sin desbordamientos/objetivos<24px;16 capturas nuevas;186 renders de técnicas.311 archivos protegidos idénticos a la auditoría; voces/generadores conservados. Catálogo completo/CI, teléfono y personas pendientes.

## N7 · 2.3.0-alpha.199

Pausa del final11 silencia toda la salida, incluidas colas, y vuelve en el paso real del tema. Reloj visual sigue salida audible. Escenario avanza por pasos de transporte, sin saltar al cambiar tempo. Metadata absoluta real, época al reanudar campaña y ritmo nuevo en final5; corregida importación de su reloj y cancelación del escenario anterior. Generadores/voces conservados.

Verificación: 253 suites Node y regresiones focalizadas aprobadas. round_timing_smoke.py, journey_finale_smoke.py y song_stage_smoke.py reales aprobados; pausa completa pico0, retorno0,873; seis renders final5 pico0,144; final11 pico0,389. Sin saturación. Auditoría limpia. Escucha física pendiente.

## N6 · 2.3.0-alpha.198

Aviso de hallazgo permite Ver tarjeta: inspección completa voluntaria, función musical explícita, rareza/procedencia y reloj detenido hasta volver. No añade sonido ni interrumpe automáticamente. Libro conserva identidad. Cambio de interpretación revierte si guardar falla. Selector de casa agrupa disponibles y por descubrir sin ocultar objetos.

Verificación: 252 suites Node; card_inspect_smoke.py y rare_cards_smoke.py aprobados en móvil/horizontal/PC; cuenta atrás y movimiento detenidos, avisos en cola, libro y40 objetos preservados. Auditoría limpia. Valor emocional pendiente con personas.

## N5 · 2.3.0-alpha.197

Ayuda explícita distingue vuelta abierta/cerrada, luces dentro, flor próxima, círculo del rayo y falta de espacio en Vacío. Observación opcional amplía métricas por lugar: primer avance, tiempo activo/sin progreso y ayuda. No fuerza Refugio ni recorta metas sin personas; calibración de esfuerzo pendiente.

Verificación: 251 suites Node; playtest_smoke.py ampliado y after_journey_smoke.py aprobados. Marcha real27,8s hacia Jardín,6465 unidades, gasto0. Auditoría limpia. Duración, emoción y deseo de continuar requieren sesiones nuevas.

## N4 · 2.3.0-alpha.196

Finales actualizan ancho y altura de su canvas. Guía contextual reduce texto repetido y explica pulso/movimiento. Jerarquía y salidas adaptadas a pantalla baja, áreas seguras y contenido largo, sin redibujar mundo ni cubo.

Verificación: 250 suites Node; finale_resize_smoke.py, interface_smoke.py (cinco tamaños, ocho paneles) y guide_context_smoke.py aprobados. Auditoría limpia. Lector y pantalla física pendientes.

## N3 · 2.3.0-alpha.195

La canción da a cada frase los compases necesarios; no descarta notas del mismo paso. Capturas nuevas guardan posición absoluta junto al paso juzgado; campaña deja de guardar el cabezal adelantado. Guardados antiguos conservados con orden compatible; pausas muy largas se abrevían por compases completos, sin afirmar reconstrucción histórica.

Verificación: 250 suites Node, round_phrase_smoke.py y render song_stage_mix.py aprobados; pico0,389 sin saturación. Auditoría limpia. Reconocimiento/agrado físico pendientes.

## N2 · 2.3.0-alpha.194

Tocar el área del cubo emite al apoyar, una sola vez; fuera conserva arrastre, escáner y toque al soltar. Ecos, banda, cristales, Línea y reacciones comparten referencia audible. Vacío distingue pulso musical válido de avance: espera en blanco sin premio visual falso. Sin cambiar síntesis ni patrones.

Verificación: 249 suites Node; touch_precision_smoke.py y journey_pulse_smoke.py aprobados. Despacho explícito menor de40ms en navegador, no latencia acústica física. Auditoría limpia. Bluetooth/teléfono pendientes.

## N1 · 2.3.0-alpha.193

La guía recupera reglas del capítulo activo, condición pendiente y portal. Eco anuncia su acción real. Títulos y subtítulos secundarios separados. Sin nuevas interrupciones automáticas ni cambios de reglas.

Verificación: 249 suites Node aprobadas; guide_context_smoke.py en320/390/1280 aprobado; auditoría sin errores/avisos. Comprensión humana pendiente.

## Octava auditoría · revisión ciega de alpha.192

Rama documental `audit/panel-8-revision-ciega`, desde L4 `a850ceee`; misma versión y runtime intacto. Cinco revisores nuevos, diez lentes simuladas sin notas previas; media6,83 por rúbrica exigente.16 capturas y24 paneles actuales,71 comprobaciones musicales simbólicas y sondas de frase, tiempo, input y tamaño de finales. Audio técnico sin escucha; notas sensoriales provisionales. Diez hallazgos nuevos enlazados después de puntuar; M1–M4 propuestos sin implementar. Informe en docs/panel/sesion-8/informe.md.

## L4 · Validación técnica · alpha.192

- Camino táctil, marcha al Jardín, premios y final11 comprobados en recorridos enfocados.
- Corregida una carrera de avisos: un mensaje cotidiano no borra una explicación importante pendiente; aprendizaje con categoría propia.
- Un formato futuro instalado durante la espera no recibe cambios; guardado fallido restaura exactamente la ayuda anterior.
- Registro de evidencia y preservación; cinco sesiones, escucha física y CI completo de PR siguen pendientes. Sin puntuación humana inventada ni publicación en main.

## L3 · Conservar y acceder · alpha.191

- Renombre, notas y borrado de favoritos con rollback si escribir falla; mantiene datos y ruta.
- Modo de llegada vuelve a su valor anterior si no se conserva.
- Finales dinámicos con foco aislado, Tab contenido y Escape que usa su cierre real. El fondo deja de recibir acciones/avisos durante el panel.
- 248 suites y recorridos de cuota/foco en teléfono/PC aprobados; regresiones de menús y recuperación comprobadas. Sin cambios de música generativa ni arte.

## L2 · Tu frase propia · alpha.190

- Captura de hasta ocho notas por ronda, registrada antes del cierre del objeto dorado; incluye el último pulso.
- No toma notas del historial general ni de la ronda anterior. Sin notas nuevas válidas, conserva la frase guardada.
- Premio y frase comparten guardado con rollback; reintento sin pago duplicado.
- 248 suites y cierre dorado real aprobados. Motor, voces, escalas y generación del mundo conservados.

## L1 · Aprender jugando · alpha.189

- Once reglas recuperables en la guía, tres pasos por lugar.
- Jardín muestra círculo, semilla y riego sin cambiar su estado ni producir audio. Ayuda breve por falta de progreso, retirada al cosechar y repetible a voluntad.
- Ayudas guardadas como vistas al presentarse realmente; rechazo, cola, fallo de escritura y partida sustituida no inventan aprendizaje.
- 247 suites, auditoría y ciclo real de flor/cosecha en320/390/1280 aprobados. Comprensión sin ayuda humana pendiente.

## K7 · Rumbo cercano y despedida · alpha.188

Rama `pulido/k7-rumbo-y-despedida`, desde K6; Jay conserva PR y merge.

- Flecha alrededor del cubo, nombre/metraje encima y sin área táctil. Sigue el leve adelanto de cámara; favorito/casa y anillo no dan dos rumbos simultáneos.
- Final5 cambia exclusivamente su arreglo local: voces existentes suaves, pulso contenido, notas de acorde en registro medio, sin bajo cuadrado/ácido/pad de sierra ni duplicación aguda. No cambia radio, MIDI guardado ni generación de mundos.
- Esperar, omitir y Explorar abren Mundo libre con rumbo a Jardín, sin salto. Festival intacto; cierre reintentable si guardar falla.
- Séptima auditoría integral: diez lentes simuladas, referencia7,7 con feedback de Jay. Menú aceptado; escucha del nuevo final y sesiones humanas pendientes. Plan L1–L4 propuesto, no ejecutado.
- Evidencia y límites en docs/panel/sesion-7/evidencia/verificacion.json.

## Entrega unificada · alpha.181

Jay autorizó integrar el cierre completo en `main`: cubo pequeño, auditorías y fases J1–J7, hasta `e6c0a3a6`. Se conserva exactamente ese código; esta integración solo actualiza el estado documental y verifica el conjunto en GitHub. La versión no cambia y la aceptación física/de publicación sigue separada.

## J7 · Comprobación y cierre técnico · alpha.181

- Posición y parámetros conservados al fallar una entrada; tarjeta anterior invalidada al sustituir la partida.
- Reintento real del objeto final conserva su referencia; cierre cuenta compases vivos con tempo variable.
- 245 suites, regresiones enfocadas, offline y 64 estados de UI aprobados; catálogo inicial y repeticiones documentados.
- Auditoría posterior por los mismos diez perfiles simulados; evidencia y pendientes separados de la aceptación humana.
- Guardia reproducible de 305 archivos protegidos, arte SVG y reglas originales.
- Registro conserva cada ID y sus pruebas; no declara producción o un 10 por simulación.
- Ramas encadenadas J1–J7; Jay mantiene PR y merge. Ver `docs/panel/sesion-5/informe.md`.

## J6 · Sincronía · alpha.180

- El acento visual sigue el instante real programado de la nota y su salida estimada, hasta 400 ms.
- Sin recorte artificial a 250 ms; cancelación al reiniciar o cambiar de escena y sin respuestas tardías en segundo plano.
- Se conserva exactamente la regla de programación sonora; contacto y movimiento reducido intactos.

## J5 · Continuidad creativa · alpha.179

- La tarjeta confirma cuándo se conserva tu frase para el final.
- Tu canción desde Lugares permite volver al final existente, con las notas actuales; Otra vez repite esa versión.
- El modelo separa capas ganadas e interpretaciones completadas. No predice abandono ni cuenta compras como música.
- Mismos generadores, instrumentos y arreglo del final; sin contenido adicional.

## J4 · Una meta compartida · alpha.178

- Guía y menú leen el capítulo o siguiente lugar real; experiencias extra claramente opcionales.
- Lugares y Refugio priorizan completar once; estrellas de maestría y chispas se distinguen.
- La guía permanece accesible durante el Viaje. No se alteran desbloqueos, economía ni posición.

## J3 · UI de producción · alpha.177

- Viaje queda para la campaña: el selector dice Vista y la pestaña de recursos, Chispas.
- Mapa distingue las regiones guardadas de los once Lugares.
- Escuchar y responder conserva la práctica musical; diagnóstico de versión en Ajustes.
- El resultado de ronda espera a que cierre otro panel. Diseño, controles e IDs conservados.

## J2 · Cierre musical · alpha.176

- Cierre con la capa ganada en el acorde vivo; fuera riser, crash, lead ajeno y corte de salida.
- Cancelación de notas del cierre al cambiar de escena; la radio no se automatiza.
- Cristales y segunda pasada del final respetan su marco armónico.
- 242 suites, cierre vivo y renders de victoria/canción/final aprobados. Escucha de Jay pendiente.

## J1 · Base fiable · alpha.175

- Premios de ronda durables y reintentos sin duplicación en los once lugares.
- Lectura segura de formatos futuros, conservados sin mutación.
- Pruebas de visitas, semillas y cuenta esperan sus límites reales de operación.
- Generación musical, mundos, aspecto y umbrales conservados. Evidencia en `docs/PULIDO_CIERRE.md`.

## Cuarta auditoría · sin otra versión

Rama `audit/panel-4-cierre`, dependiente de `fix/cubo-pequeno` (04ae8bdd). No cambia el juego respecto a esa revisión.

- Diez lentes simuladas, expediente e informe: media orientativa 7,7 (antes 7,5). No son opiniones reales de los autores.
- 16 capturas con gate normal, 60 estados de UI en cuatro tamaños, modelo de dos horas y 11 renders de cierre. Tacto real de navegador aprobado; no personas ni teléfono físico.
- Contratos reproducidos: notas fuera de escala en capa/final, premio anunciado con guardado fallido, lector de formato futuro y límite de sincronía. El CI del main base tiene tres grupos de navegador fallidos; no se certifica como verde.
- Registro de 14 hallazgos y plan J1–J7, pendiente de Jay. Música base y contenido se conservan; Supabase sigue en pausa.
- Herramientas `panel-capture.py` y `panel-measures.py` evitan confundir el modo de desarrollo con el aspecto normal. Evidencia en `docs/panel/sesion-4/`.

## Cubo pequeño · alpha.174

Rama `fix/cubo-pequeno`, desde `main` 676ac511. Petición de Jay: quitar la ampliación general de la I2.

- Tamaño natural, entre 6 y 12 px antes de pulsos y efectos temporales. Las caras equipadas conservan su mínimo existente de 10 px.
- No cambian alcance, colisiones, movimiento, música, economía, guardados ni posiciones.
- Verificado: 240 suites Node y `cube_face_smoke.py` (13 piezas, caras visibles, movimiento, hábitos, persistencia y tamaño real del cubo).
- El tamaño definitivo requiere la aceptación de Jay en su teléfono. No se afirma despliegue ni CI de esta rama.

## Documentación y panel · sin versión

Rama `claude/charming-darwin-dvbfc7`, sobre `main` (alpha.173). Solo documentación y una herramienta; el juego no cambia.

- **Panel creativo para repetirlo:** [docs/PANEL.md](docs/PANEL.md) explica quiénes son los diez perfiles simulados, los seis ejes, el historial de notas (6,4 → 7,2 → 7,5), los pasos de una sesión, el formato de los informes, lo que Jay ya decidió y la petición para la cuarta sesión. Los informes, expedientes y los treinta análisis están en `docs/panel/sesion-1…3/`.
- **`scripts/panel-capture.py`:** las 16 capturas de teléfono que juzga el panel.
- **El cubo pequeño:** Jay no quiere el cubo grande de la I2. Queda anotado en el panel, en [El mundo](docs/MUNDO.md) (regla 6), en [HANDOFF](HANDOFF.md) y en [AGENTS](AGENTS.md); el cambio de código está pendiente.
- **Repositorio más limpio:** README, índice, AGENTS y traspaso reescritos (`HANDOFF_CLAUDE.md` pasa a `HANDOFF.md`). Se borraron `docs/historial/` (85 documentos), `docs/FASES_2026.md`, `docs/SERVIDOR_Y_DUETOS.md`, `docs/handoff-validation.json`, cuatro capturas sueltas en la raíz y las entradas de este archivo anteriores a alpha.142. Todo sigue en Git en la revisión `5914ca9`.

## I6 · Menos ruido y modelo honesto · alpha.173

Rama `claude/i6-menos-ruido`, sobre `claude/i5-decisiones` (dependencia explícita).

- **Menú de seis entradas:** Tu cubo, Mundo, Lugares (nuevo en el menú), Refugio, Sonido y Ajustes. El resto (Mapa, Bitácora, Herramientas, Grabar set, otra semilla, Compartir, Mundo libre, Guía, Cuenta…) queda plegado en «Más», cerrado por defecto. Mismos ID.
- **Modelo honesto (`scripts/play-curve.mjs`):** la regla de 12 min cuenta solo lo que hace crecer la canción; las piezas compradas ya no la cumplen. Nuevo jugador sin sonido y un minuto de «riesgo de abandono».
- **Lo que mide:** el jugador del 75 % y el del 90 % cumplen (máximo 10,7 y 5,6 min sin crecer). **El del 60 % y el que juega sin sonido no:** sin ★★, su canción deja de crecer al ganar (minutos 38–40) durante unos 80 min. Queda abierto; es un modelo, no una medida con personas.
- Pruebas: `menu_v2_smoke.py` (seis entradas y «Más» cerrado), `play-curve.mjs` y las pruebas que pulsan botones del menú abren «Más» antes.

## I5 · Decisiones de Jay · alpha.172

Rama `claude/i5-decisiones`, sobre `claude/i4-final` (dependencia explícita). Jay aprobó las recomendaciones de la tercera sesión del panel.

- **★★ al 75 %** de pulsos a tiempo (antes 85 %) y **★★★ al 70 %** en la ronda Maestro (antes 80 %). En el modelo de dos horas, el jugador que acierta 75 de cada 100 llega a 28 ★ y su canción nunca pasa más de 11 min sin crecer (antes 85 min parada tras ganar). El del 60 % sigue sin ★★.
- **Festival = el Viaje entero:** `?festival=1` ya no termina tras el Lago; sigue por el Bosque, la Tormenta y el Vacío, y el último portal abre el final del Refugio con tu frase y «Otra persona». Créditos: «El Viaje».
- Pruebas: `places.mjs` (75/70 %), `play-curve.mjs` (sin muro al 75 %), `festival-color.mjs`, `journey-finale.mjs` y `festival_smoke.py` (el Lago lleva al Bosque; el Vacío al final).

## I4 · El final que respira · alpha.171

Rama `claude/i4-final`, sobre `claude/i3-instante` (dependencia explícita).

- **Tus notas de los 11 lugares:** el final de «Tu canción» toma las notas de la última ronda de cada lugar y, para los cinco del Viaje que no hayas rejugado, las de su capítulo (antes solo sonaban las de 6 lugares).
- **Con tu ritmo y en la escala del mundo:** cada nota suena en el paso del compás en que la tocaste (se guarda `S.lugares.noteSteps`, normalizado) y se lleva a la nota más cercana de la escala que suena (`snapToScale`).
- **El tema es un momento:** la capa de Faros ya no repite el tema durante el final; tras tus notas, un compás de silencio y el chelo toca el tema dos veces, la segunda una quinta arriba. Los créditos salen al final, no antes.
- **Al menos un minuto:** a tempo rápido, las capas siguen sonando tras el tema hasta llegar a 60 s.
- **No hecho:** el ritardando. El final suena sobre el secuenciador del mundo, que no puede frenar una sola canción.
- Pruebas: `song-tiers.mjs`, `places.mjs`, `song_stage_smoke.py` (créditos con más margen) y `song_stage_mix.py` (render: pico 0,389; «lleno» medido en la cola).

## I3 · Un solo instante · alpha.170

Rama `claude/i3-instante`, sobre `claude/i2-se-vea` (dependencia explícita).

- **Luz, tacto y sonido a la vez:** en un acierto, el brillo dorado del cubo, la vibración y un pequeño golpe del cubo se programan para el momento en que suena la nota (`landDelay`: entre 0 y 250 ms después del toque, contando la latencia de salida). Con movimiento reducido no hay golpe.
- **La Línea anticipa:** cada paso que cuenta crece y se enciende durante los cuatro pasos anteriores a que llegue el cursor (`approach`).
- **Calibración más segura:** solo mide sobre las negras (en el Jardín o la Cueva, que cuentan corcheas, podía tomar el paso equivocado) y nunca mientras el lugar canta su patrón.
- Pruebas: `journey-pulse.mjs` (`landDelay`, `approach`).

## I2 · Que se vea · alpha.169

Rama `claude/i2-se-vea`, sobre `claude/i1-coherencia` (dependencia explícita).

- **El cubo se lee en todas partes:** 1,6× su tamaño, entre 24 y 36 px, en el Camino (antes 6 px), el Mundo y los lugares; las caras caben siempre.
- **El color ganado se ve:** un bioma recuperado lava toda la pantalla con su color además de la luz alrededor del cubo. En el anillo, el 24 % de la pantalla tiene color (antes 5–9 %, medido en capturas de teléfono).
- **La columna dorada desde lejos:** el portal siguiente del camino se marca desde cualquier distancia; fuera de pantalla, la columna queda en el borde de su lado y sustituye a la flecha (`edgeColumn`).
- Pruebas: `cube_face_smoke.py` (24–36 px) y `places-ring.mjs` (columna en el borde).

## I1 · Coherencia · alpha.168

Rama `claude/i1-coherencia`, desde `main`. Tercera sesión del panel: restos que contradecían las decisiones de Jay.

- **El narrador solo en la tarjeta y la Bitácora:** los avisos de logro ya no llevan su frase.
- **Calma tras los créditos:** entre el final del Viaje y el primer portal no se anuncia ningún logro (quedan en la Bitácora) y desaparece el aviso «Tus ✦ cambian tu cubo»; Tu cubo queda marcado.
- **Fuera «Rompe…»:** el Camino, la ayuda y los avisos hablan de tocar a tiempo y de abrir el Mundo con diez cristales.
- **Sin cifras de umbral:** la tarjeta dice «Ritmo · X % a tiempo» y «Maestro», y el narrador ya no dice «Ochenta y cinco por ciento».
- Pruebas: `release-closure.mjs` (aviso sin narrador y calma tras los créditos) y `journey_finale_smoke.py` (marca sin aviso).

## H7 · Medir · alpha.167

Rama `claude/h7-medir`, sobre `claude/h6-escucha` (dependencia explícita).

- **Modelo de las dos primeras horas** (`scripts/play-curve.mjs`, prueba `tests/play-curve.mjs`): tres jugadores al 60, 75 y 90 % a tiempo, del Viaje a los 11 lugares en orden y luego ★★ y Maestro. Los tres ganan antes de 40 minutos y nunca pasan más de 7 sin una novedad (la regla del panel es 12).
- **Hallazgo:** con ★★ al 85 %, a quien acierta 60 o 75 de cada 100 la canción deja de crecer tras ganar (80–85 min sin una capa nueva). El modelo compara la variante ★★ 75 % / ★★★ 70 %. No se cambió ninguna regla: lo decide Jay (`docs/MUNDO.md`, «Las dos primeras horas»).
- `scripts/journey-curve.py` (nivel y densidad del Viaje en el navegador) sigue igual: dos horas no caben en un navegador; el modelo nuevo mide el progreso, no el audio.
- Pendientes: festival (recomendación: solo el Viaje), sesiones con Luca y escucha en un teléfono.

## H6 · Mundo que se escucha · alpha.166

Rama `claude/h6-escucha`, sobre `claude/h5-reglas` (dependencia explícita).

- **La chispa salvaje se encuentra con el oído:** canta una nota del acorde en cada pulso, desde su lado (izquierda o derecha) y más fuerte cuanto más cerca. La flecha en el borde de la pantalla solo aparece con el sonido apagado.
- **Los portales suenan desde su dirección:** el más cercano, en el «1», como antes, pero desde su lado. El siguiente del camino suena suave en el «3» desde mucho más lejos (se oye ya en el Refugio) y guía hasta él.
- La remezcla diaria no cambia.
- Pruebas: `spatial.mjs` (paneo y su cadena), `wild.mjs`, `places-ring.mjs`; `wild_smoke.py` comprueba que la chispa canta y `ring_smoke.py` que el siguiente portal se oye desde su lado. No se oyó en un teléfono ni con auriculares.

## H5 · Reglas claras · alpha.165

Rama `claude/h5-reglas`, sobre `claude/h4-cancion` (dependencia explícita).

- **Solo a tiempo da chispas, también en el Mundo libre:** fuera de tiempo el pulso suena y rompe, pero vale ×0 (antes ×1); a tiempo ×2 y con racha de 8, ×3. Sin sonido no hay compás que cumplir y todo cuenta ×1. La simulación de la economía da la tienda completa en 10,5 h a quien acierta seis de cada diez (antes 9,4) y en 7,2 h a quien acierta nueve (antes 7,0).
- **El Viaje sin rótulos:** los capítulos ya no escriben sus reglas ni avisan del objeto dorado; lo enseñan el gesto, la barra que late y el lugar que canta su patrón.
- **Cada lugar dice cada frase una vez**, la primera vez, y nunca más (guardado en `S.journey.lines`).
- **El narrador en su sitio:** durante una ronda no aparece ningún aviso de logro; la tarjeta de la ronda dice el logro ganado con la frase del narrador. Fuera de las rondas, como siempre. El logro «Treinta y tres» llega con las 33 ★, no con los 11 lugares.
- **Menú:** no se acortó. Ya está en grupos («Jugar» y el resto) y unas 30 pruebas pulsan sus botones; recortarlo merece su propia fase con Jay.
- Pruebas actualizadas: `spark-rules.mjs` y `spark_rhythm_smoke.py` (fuera de tiempo rompe pero no da), `spark-economy-sim.mjs`, y los juegos del Viaje (`journey-*.mjs`, `journey_stick_smoke.py`, `journey_chain_smoke.py`) comprueban que no hay rótulos.

## H4 · Tu canción · alpha.164

Rama `claude/h4-cancion`, sobre `claude/h3-camino` (dependencia explícita).

- **Tu canción es la música del juego:** ya no es un house aparte en La mayor a 120 BPM que callaba el Mundo. El Mundo sigue sonando en su tono y tempo, y el secuenciador añade encima, desde el siguiente «1», la capa de cada lugar ganado sobre el acorde que suena.
- **Las estrellas la hacen crecer:** ★ un fragmento (un compás de cada dos), ★★ la capa entera, ★★★ su variación (una octava arriba, más suave, y los golpes con eco). La capa de los Faros es el tema del cubo en el tono del lugar.
- **El final con los 11 (60–90 s según el tempo):** las capas entran una por compás; después, tus notas de cada lugar en orden (las 8 últimas de su mejor ronda, un compás por lugar); al final, el tema del cubo sobre todo. La versión maestra (33 ★) lo toca todo en su variación.
- **Trofeos:** tocar uno en el Refugio suena su capa dos compases, con sus estrellas, sobre la música.
- Las notas de cada lugar se guardan en `S.lugares.notes` (hasta 8, normalizadas).
- Pruebas: `tests/song-tiers.mjs` (niveles, plan del final, tus notas y el tema); `tests/song_stage_mix.py` (el final maestro renderizado sobre una música de prueba: pico 0,39, más lleno al entrar las capas); `song_stage_smoke.py` comprueba que el Mundo sigue sonando debajo. Límite: falta oírlo en un teléfono.

## H3 · El camino · alpha.163

Rama `claude/h3-camino`, sobre `claude/h2-que-se-sienta` (dependencia explícita).

- **En orden:** tras el Viaje, Jardín → Dunas → Cristales → Faros → Ruinas → Cueva; cada uno se abre al completar el anterior. Ya no hacen falta ★★ para avanzar: un niño que acierta el 75 % llega al final.
- **Ganar = los 11 completos.** Suena el final verdadero («Los 11 lugares»). Con las 33 ★ vuelve, una vez, como versión maestra («Las 33 ★»).
- **Luz al siguiente:** una columna dorada sobre el portal del siguiente lugar del camino; la flecha del borde apunta a él.
- **«Siguiente · lugar»** en la tarjeta de la ronda: lleva a su portal y empieza su ronda.
- **Modo Libre:** un lugar completo ofrece Jugar, Libre y Maestro (con ★★). Libre no tiene barra, estrellas ni chispas; al cerrar su objeto dorado vuelve al portal con su música.
- Textos: un portal cerrado dice «X se abre al completar Y»; Lugares dice «Siguiente: X»; los créditos del Viaje, «Once lugares te esperan».
- **Guardados:** versión 2 de `S.lugares`. Un guardado de antes conserva abiertos los lugares que sus estrellas abrían (`kept`). Nada se borra.
- Pruebas actualizadas a las reglas nuevas: `places.mjs`, `places-ring.mjs`, `refugio-lugares.mjs`, `journey-finale.mjs`, `ring_smoke.py` (Libre sin barra), `refugio_lugares_smoke.py`, `song_stage_smoke.py` (final con 11 y versión maestra con 33), `places_smoke.py` («Siguiente · Jardín»).

## H2 · Que se sienta · alpha.162

Rama `claude/h2-que-se-sienta`, sobre `claude/h1-que-se-vea` (dependencia explícita).

- **Calibración sin menú:** los primeros 12 pulsos cerca de un tiempo miden cuánto tarde oyen y tocan este jugador, este teléfono y estos auriculares. Si coinciden (la mitad central dentro de 60 ms), ese retraso se guarda y cuenta en todo «a tiempo». Quien toca disperso no queda «calibrado»: se sigue midiendo. En Ajustes, «Ajustar el tiempo» lo mueve de 10 en 10 ms o lo mide otra vez.
- **Una sola guía:** los pasos que cuenta el lugar se levantan en la Línea (el «1» en dorado cuando cuenta). Se quitan los puntos bajo el cubo y los del Vacío.
- **El lugar canta su patrón antes:** al empezar una ronda o un capítulo con ritmo, durante dos compases desde el siguiente «1» suenan un golpe y una nota en cada paso que cuenta, y la Línea brilla con ellos. Se retiran las frases «Aquí se toca en el «y»…».
- **El cubo cambia con la racha (Vibri):** cada 4 aciertos seguidos gana una forma (esquinas, rombo, doble marco dorado que gira); un fallo quita una, nunca todas.
- **Ruinas, arreglo:** los pulsos se agrupan por compás con el reloj de audio. Antes se redondeaba una hora del reloj de la página y, si el compás empezaba cerca del borde del redondeo, tres pasos del mismo compás contaban en dos compases distintos y no ponían piedra.
- Pruebas: `tests/rhythm-calibration.mjs` (un jugador simulado 150 ms tarde pasa de fuera de tiempo a tiempo); `tests/journey-rhythm.mjs` (formas y canto de dos compases). Las pruebas de navegador que pulsan en un paso concreto aceptan el primer fotograma tras el paso (antes podían saltarlo).

## H1 · Que se vea · alpha.161

Rama `claude/h1-que-se-vea`, desde `main`. Primera fase del plan integrado que Jay aprobó tras la segunda sesión del panel ([El mundo](docs/MUNDO.md)).

- **El acierto se ve siempre:** el cubo brilla en dorado en cada pulso a tiempo, también en teléfonos que vibran (antes solo sin vibración). La onda de un pulso a tiempo es dorada y algo más gruesa.
- **El cubo se ve en el teléfono:** en el Mundo se dibuja 1,6 veces su tamaño, entre 16 y 30 px (antes 6–22). Solo cambia el dibujo: alcances, choques y el crecimiento por nivel siguen igual.
- **El oro sigue dorado:** el gris de un lugar aún sin color ya no filtra toda la pantalla; se pinta solo sobre el suelo, antes de los juegos, el cubo y los portales.
- **Color como tono:** un lugar con su color recuperado se tiñe más de él (luz del 18–30 % en vez de 5–12 %).
- **Cerrar un lugar recupera su color** para siempre.
- **Lugares:** un lugar con ★ ya no dice «Sin visitar»; la remezcla deja de ser un segundo botón dorado.
- **Ruinas, arreglo** (visto en la CI de esta fase): los pulsos se agrupan por compás con el reloj de audio; redondear una hora del reloj de la página podía partir un compás en dos y tres pasos no ponían piedra. Las pruebas que pulsan en un paso concreto aceptan el primer fotograma tras el paso.
- `cube_face_smoke` mide el cubo nuevo: 16 px sin cara, unos 27 con ella.
- Pruebas: `world-sheet.mjs` y `world_sheet_smoke.py` comprueban el gris en el lienzo y la pantalla sin filtro. `?anillo=1` y `?lugar=` siembran los colores de los cinco capítulos, como una partida real tras el Viaje.

## F18 · Mundo salvaje · alpha.160

Rama `claude/f18-salvaje`, sobre `claude/f17-cueva` (dependencia explícita).

- **Chispa salvaje:** al explorar el Mundo libre, entre uno y dos minutos después de la anterior (y tras unos 1 200 px andados), aparece una chispa dorada por delante del cubo. Cinco pulsos a tiempo a su lado la atrapan: +15 ✦. Cada pulso la hace saltar un poco; a los 30 s se va sin castigo. Si sale de la pantalla, una flecha dorada la señala.
- **Remezcla diaria:** cada día un lugar abierto se juega con el ritmo de otro (por ejemplo, la Llanura en «1 · 3 · y»). Está en la hoja Lugares del Refugio. Paga 30 ✦ más al cerrarla y 20 más si superas el mejor porcentaje a tiempo del día. No hay Maestro de la remezcla. Jardín, Dunas, Vacío y Cueva no se remezclan: su juego depende de su propio ritmo.
- Pruebas: `tests/wild.mjs`, `tests/wild_smoke.py` (teléfono y escritorio). Límite: el ritmo de aparición se fijó por diseño, no se midió con personas.

## F17 · Cueva · alpha.159

Rama `claude/f17-cueva`, sobre `claude/f16-ruinas` (dependencia explícita).

- **Eco:** la cueva canta un patrón durante un compás y tú lo repites en el siguiente. Bajo el cubo, ocho casillas son las corcheas del compás: mientras canta se encienden en rojo sus pasos; mientras respondes, esperan los tuyos y se vuelven doradas.
- Todos los pasos a tiempo y ninguno de más es un eco: vale 6 más 2 por paso y el siguiente patrón tiene un paso más (de 2 a 5). Una respuesta con errores suma 2 por paso acertado y acorta el siguiente. El patrón siempre empieza en el «1».
- El secuenciador de la música canta la llamada, así que siempre cae en su compás.
- **Final:** con la barra llena cae una gota dorada; un pulso a tiempo la atrapa. Su trofeo son ondas de eco. Se abre con 24 ★; `?lugar=cueva`.
- **Con la Cueva, los once lugares tienen juego: ya se pueden ganar las 33 ★.**
- Meta 250. Media de 30 jugadores simulados: 2:27 con el 75 % a tiempo, 1:34 con el 90 % (los patrones largos valen más), 3:08 en Maestro.
- Pruebas: `tests/journey-echo.mjs`, `tests/echo_smoke.py` (teléfono y escritorio). Las pruebas de navegador de Faros, Ruinas y ritmos pulsan teniendo en cuenta la latencia de salida.

## F16 · Ruinas · alpha.158

Rama `claude/f16-ruinas`, sobre `claude/f15-faros` (dependencia explícita).

- **Reconstruye:** ocho columnas rotas en anillo; algunas conservan una o dos piedras. Junto a una columna, toca el patrón de las Ruinas, «1 · 2y · 3 · 4». Tres de sus cuatro pasos en un mismo compás ponen una piedra (los cuatro en Maestro). Bajo la columna, tres marcas cuentan los pasos de este compás.
- **Arcos:** una columna tiene siete piedras. Dos columnas enteras vecinas levantan un arco dorado, que vale más.
- **Final:** con la barra llena llega una piedra dorada; un pulso a tiempo la coloca. Su trofeo es un arco. Se abre con 20 ★; `?lugar=ruinas`.
- Meta 265 de 284 posibles; en Maestro, toda la ruina. Simulación (modelo, jugador que no se distrae): 2:13 con el 75 % a tiempo, 1:51 con el 90 %, 4:15 en Maestro. Una persona tardará algo más.
- Pruebas: `tests/journey-rebuild.mjs`, `tests/rebuild_smoke.py` (teléfono y escritorio).

## F15 · Faros · alpha.157

Rama `claude/f15-faros`, sobre `claude/f14-ritmos` (dependencia explícita).

- **Guía:** el cubo es un faro. Seis barcos esperan perdidos en la oscuridad alrededor del puerto, donde empieza la ronda. Un pulso a tiempo cerca de un barco lo enciende: te sigue dos compases, y cada pulso a tiempo cerca lo mantiene encendido. Llévalo encendido al puerto y atraca. Otro barco ocupa su lugar.
- **Convoy:** un barco vale 4; cada otro barco encendido que venga con él suma 2 (hasta 10). Traer varios a la vez rinde más.
- **Ritmo:** destellos en «1 · 3 · y». El haz gira con el compás desde el cubo y destella al tocar.
- Una flecha dorada en el borde señala el puerto mientras llevas barcos; si no llevas, una blanca señala el barco más cercano.
- **Final:** con la barra llena llega un barco dorado; un pulso a tiempo lo enciende. Su trofeo es un faro. Se abre con 16 ★; `?lugar=faros`.
- Meta 260. Simulación (modelo): 2:28 con el 75 % a tiempo, 2:23 con el 90 %, 3:30 en Maestro.
- Pruebas: `tests/journey-guide.mjs`, `tests/guide_smoke.py` (teléfono y escritorio).

## F14 · Ritmos · alpha.156

Rama `claude/f14-ritmos`, sobre `claude/f13-victoria-musica` (dependencia explícita).

- **Cada lugar con su ritmo** (tabla aprobada en [El mundo](docs/MUNDO.md)): el Lago como lugar y las Dunas en el «y»; la Tormenta «1 · 2 · y» (también en el Viaje); los Cristales «1 · y · 2»; el Jardín siembra y cosecha a tiempo y riega en el «y». Llanura y Bosque siguen a tiempo; el Vacío, en el «1».
- **Solo cuenta el paso del ritmo:** un pulso en otro paso, aunque caiga en un tiempo, no hace nada. La marca de la Línea se pone en el paso que respondiste.
- **Guía de puntos bajo el cubo:** ocho corcheas; las que cuentan se ven, el «1» en dorado, la del momento brilla y un aro marca el último acierto. La primera vez que aparece un ritmo nuevo, una línea lo dice.
- Dos corcheas seguidas están a 250 ms a 120 BPM y el toque descartaba pulsos a menos de 240 ms; con un ritmo de corcheas ese límite baja a dos tercios de una corchea.
- La ola de las Dunas pasa en el «y».
- Pruebas: `tests/journey-rhythm.mjs`; `tests/rhythm_smoke.py` (Lago, Cristales y Tormenta del Viaje: sus pasos cuentan, los demás no); `garden_smoke` siembra en el tiempo y riega en el «y»; `surf_smoke` comprueba la ola en el «y»; los pulsos de prueba de 19 pruebas siguen el ritmo del lugar. Límite: la simulación del Jardín da el mismo tiempo (2:24); los demás tiempos no se volvieron a medir.

## F13 · Victoria con tu música · alpha.155

Rama `claude/f13-victoria-musica`, sobre `claude/f12-primer-minuto` (dependencia explícita).

- **El cierre sale de la música que suena:** durante un compás el filtro de la música se cierra bajo un ruido que sube; el último medio tiempo es silencio de verdad (también el eco); en el «1» vuelve la misma música, en su tono y tempo, con algo más encima.
- **Lo que se suma:** la capa del lugar en Tu canción (bombo en la Llanura, bajo dub en el Lago, arpegio en el Jardín…) y el tema del cubo con el timbre del lugar. La capa la toca el secuenciador semicorchea a semicorchea, sobre el acorde que suena en el mundo en cada compás; por eso no puede desafinar.
- Los drops de género propio (house, dub, disco…) se retiran: Jay los oyó ajenos al resto de la música.
- Pruebas: `tests/journey-victory.mjs` (la capa sigue al acorde del mundo); `tests/victory_mix.py` renderiza los once cierres sobre una música de prueba (silencio de −109 dB, vuelta más llena, pico 0,57); `tests/victory_live_smoke.py` en el juego real (32 semicorcheas, salida y filtro enteros después, la música sigue). Límite: falta la escucha de Jay.

## F12 · Primer minuto · alpha.154

Rama `claude/f12-primer-minuto`, desde `main`.

- **La barra late antes del primer pulso:** en el Camino y en un capítulo del Viaje, si pasan cinco segundos sin cuadros abiertos y sin ningún pulso, la barra de arriba se ilumina suave en cada tiempo de la música (a 120 BPM antes de que suene, como en un teléfono antes del primer toque). El primer pulso la apaga. Se suma al dedo fantasma de la pista.
- **Llanura más larga:** meta 150 (antes 60). Jay la terminó en menos de un minuto ya sabiendo jugar; con esta meta debería durar unos 2:30. Los demás capítulos se miden en su prueba antes de tocarlos.
- **Plan nuevo F12–F19** en [El mundo](docs/MUNDO.md): victoria con la música que suena (F13), ritmos distintos por lugar (F14, con el reparto aprobado), Faros, Ruinas y Cueva (F15–F17), Mundo salvaje (F18) y cierre con personas (F19).
- CI: las pruebas de navegador pasan de 4 a 6 grupos; con las pruebas de los lugares, dos grupos superaban los 30 minutos y se cancelaban.
- Pruebas: `tests/bar-beat-hint.mjs`, `tests/bar_beat_hint_smoke.py` (teléfono y escritorio: no bajo la bienvenida, sí cinco segundos después, se apaga con el primer pulso); `journey_stick_smoke` usa la meta nueva. Límite: la duración de la Llanura es una estimación a partir del tiempo de Jay.

## F11 · Cristales · alpha.153

Rama `claude/f11-cristales`, sobre `claude/f10-dunas` (dependencia explícita).

- **Resuena:** nueve cristales alrededor de donde empieza la ronda, tres de cada nota (triángulo, rombo y hexágono). Un pulso a tiempo cerca hace sonar los cristales al alcance; cada uno sigue sonando unos 16 tiempos mientras su arco dorado se apaga. Fuera de tiempo no suena nada.
- **Acorde:** cuando suenan a la vez las tres notas distintas, forman un acorde: vale mucho más y los tres callan para empezar el siguiente. Tres marcas bajo el cubo muestran qué notas suenan.
- **Final:** con la barra llena llega un cristal dorado; un pulso a tiempo lo hace cantar. Su drop es trance y su trofeo, un hexágono. Se abre con 12 ★; `?lugar=cristales`.
- **Ritmo:** meta 260. Media de 100 rondas simuladas: 2:27 con el 70 % a tiempo, 2:03 con el 90 %, 3:29 en Maestro (sonido de 15 tiempos y barra ×1,5). Es un modelo.
- El fondo se oscurece un poco más que en otros lugares: la malla de triángulos del bioma competía con los cristales.
- Pruebas: `tests/journey-resonance.mjs`, `tests/resonance_smoke.py` (teléfono y escritorio), `victory_mix.py` con ocho drops.

## F10 · Dunas · alpha.152

Rama `claude/f10-dunas`, sobre `claude/f9-jardin` (dependencia explícita).

- **Surfea:** olas de arena cruzan las dunas, una por compás. Un círculo marca dónde pasará la cresta de la próxima y un arco alrededor se cierra hasta su tiempo. Dentro del círculo, un pulso a tiempo justo cuando pasa la cresta la surfea: la ola te empuja y la barra se llena. Dentro del círculo pero en otro tiempo, o fuera de tiempo, no pasa nada.
- **Racha:** 2, 3 y 4 por ola seguida (marcas doradas bajo el cubo); dejar pasar una ola empieza de nuevo. En Maestro el círculo es más pequeño y la barra ×1,5.
- **Final:** con la barra llena llega una ola dorada; surfearla cierra la ronda. Su drop es afro house y su trofeo, una ola.
- **Se abre con 8 ★.** `?lugar=dunas` da a su guardado de prueba las estrellas que pide.
- Las olas siguen la rejilla de tiempos de la música aunque cambie de tempo (al llegar a las Dunas o en Maestro).
- **Ritmo:** meta 150. Media de 200 rondas simuladas (una ola cada dos segundos): 2:33 surfeando el 65 %, 1:41 con el 85 %, 3:48 en Maestro. Es un modelo.
- Pruebas: `tests/journey-surf.mjs`, `tests/surf_smoke.py` (teléfono y escritorio), `victory_mix.py` con siete drops.

## F9 · Jardín · alpha.151

Rama `claude/f9-jardin`, sobre `claude/f8-logros` (dependencia explícita).

- **Siembra:** ocho parcelas alrededor de donde empieza la ronda, cerca y lejos alternadas. Un pulso a tiempo sobre una parcela vacía siembra; cada pulso a tiempo hace crecer lo que hay al alcance (semilla, brote, capullo, flor); sobre una flor, la recoge y la parcela queda libre. Fuera de tiempo no pasa nada.
- **Cuidar:** una planta sin atender ocho compases se marchita un paso. Un arco dorado alrededor de cada planta muestra el tiempo que le queda; parpadea al final. En Maestro, seis compases y barra ×1,5.
- **Sonido:** cada flor añade la nota siguiente de un arpegio sobre el acorde (la capa del Jardín en tu canción); su cierre suena a garage.
- **Final:** con la barra llena llega un árbol dorado; un pulso a tiempo lo hace florecer y cierra la ronda con estrellas, chispas y su tarjeta. Su trofeo es una flor.
- **Abre con 5 ★:** el Viaje terminado ya lo abre; su portal está en el anillo y `?lugar=jardin` lo prueba.
- **Arreglo para todas las rondas (F4):** con «Todo a la vista», la barra de arriba no se veía ni mostraba el avance de la ronda, y los efectos sobre el cubo no se dibujaban. Ahora la barra sigue la ronda en los dos modos.
- **Ritmo:** meta 360. Un jugador simulado (150 px/s, un pulso por segundo, un segundo para situarse en cada parcela) tarda 2:24 con el 75 % a tiempo, 2:08 con el 90 % y 3:31 en Maestro; una persona tarda algo más. Es un modelo, no una medida con personas.
- Pruebas: `tests/journey-garden.mjs` (lógica y ritmo), `tests/garden_smoke.py` (teléfono y escritorio, los dos modos de pantalla), `victory_mix.py` con seis drops; `places`, `places-ring`, `refugio-lugares` y sus pruebas de navegador ahora usan las Dunas como lugar cerrado.

## F8 · Logros del narrador · alpha.150

Rama `claude/f8-logros`, sobre `claude/f7-cancion` (dependencia explícita).

- **El narrador:** los logros hablan con voz burlona, al estilo de *Dungeon Crawler Carl*, para todas las edades. Al ganar uno, el aviso muestra el título y debajo su frase; en la Bitácora, la frase va en dorado bajo cada logro ganado.
- **Nada ganado se pierde:** 40 logros que ya existían conservan su id, su título y su fecha; solo cambia su voz (Día 1, El Mundo, Cajas, Cometa, Freeze, Contratiempo, Atlas, Rachas, la Luna de oro…).
- **23 logros nuevos** para los lugares, las estrellas, el anillo y tu canción: Una estrella, Ritmo, Maestro, Cinco Maestros, Casi ritmo, Con prisa, Sin prisa, Inquilino, Contra ti, Turismo intensivo, 10/20/33 estrellas, Puerta cerrada, Conocido del anillo, A medias, Caminar es de otros, Presumido, Fan número uno y Prólogo; y tres secretos (Sospechoso, Valiente, Madrugada).
- Se ganan solos al cerrar una ronda, al tocar un portal cerrado, al dejar una ronda, al viajar rápido, al tocar un trofeo, al escuchar tu canción y al terminar el Viaje. Varios a la vez se anuncian juntos («4 logros nuevos»), como antes.
- Pruebas: `tests/narrator.mjs` (cada frase pertenece a un logro que existe, ningún id nuevo reutiliza uno viejo, frases de 20 palabras o menos, lo que gana cada ronda); `achievements_v2_smoke` y `universe_mischief_smoke` cuentan 376 + 23 logros. Límite: los textos siguen el tono de la muestra que vio Jay; él no los ha aprobado uno por uno y cualquier frase se cambia en `narrator.js` sin tocar nada más.

## F7 · Tu canción · alpha.149

Rama `claude/f7-cancion`, sobre `claude/f6-refugio` (dependencia explícita).

- **Una canción, once capas:** ocho compases de house a 120 BPM en La mayor (La, Mi, Fa♯m, Re). Cada lugar da una capa: Llanura bombo, Lago bajo dub, Bosque palmas y platillos, Tormenta ácido, Vacío colchón, Jardín arpegio, Dunas percusión, Cristales campanas, Faros la melodía del cubo, Ruinas acordes y Cueva eco.
- **Final del Viaje nuevo:** cada capítulo ocupa dos compases; su capa entra bajo tus notas a tiempo, con tu ritmo, y su anillo se enciende con su nombre y su verbo. Después, el tema dos veces sobre las cinco capas, y aparecen apagados los seis lugares por venir. Termina en «Tu mundo se abrió · 11 lugares · 33 ★», con los once anillos y el botón «Explorar». Ya no hay violonchelo.
- **En el Refugio:** tocar un trofeo hace sonar su capa dos compases. En Lugares, «Tu canción» la toca con las capas ganadas: once anillos, los tuyos encendidos y latiendo, los que faltan punteados («Tu canción · 5 de 11»). La música del Mundo espera mientras suena.
- **Ganar el juego:** con las 33 ★, al cerrar la tarjeta de la ronda, entran las once capas una por compás y termina en «Las 33 ★ · Tu canción está completa». Solo una vez; luego se escucha desde Lugares.
- El festival conserva su final con «Otra persona».
- Pruebas: `tests/song_mix.py` (render sin conexión: cada capa se oye, las once juntas sin saturar, pico 0,50), `tests/song_stage_smoke.py`, y `journey-finale.mjs`, `journey_finale_smoke.py` y `festival_smoke.py` actualizadas. Límite: no se escuchó en un teléfono; las capas de los seis lugares nuevos suenan desde ya, aunque sus juegos lleguen en F9–F14.

## F6 · El Refugio como centro · alpha.148

Rama `claude/f6-refugio`, sobre `claude/f5-anillo` (dependencia explícita).

- **Muro de estrellas:** en la Sala, «LUGARES · ★ N / 33»; en la barra de la casa, el botón «★ N / 33».
- **Sala de trofeos:** once zócalos; cada lugar con su ★ pone ahí el objeto dorado de su juego (pegar, cadena, lazo, espiral, estrella), más brillante con cada estrella. Al tocarlo dice su lugar, sus estrellas y su % a tiempo, y suena su nota en tres pasos (su capa de la canción llega en F7).
- **Mesa de lugares:** tocar el muro o «★ N / 33» abre Lugares: los once con sus estrellas, su % o lo que piden, «Sin visitar», la siguiente meta («Jardín se abre con 5 ★. Faltan 2.») e «Ir» a los ya visitados.
- **Puerta al anillo:** «Salir al anillo» e «Ir» dejan el Refugio; «Ir» te deja junto al portal.
- En una visita a otro Refugio no se muestran tus estrellas.
- Pruebas: `tests/refugio-lugares.mjs` y `tests/refugio_lugares_smoke.py` (teléfono y escritorio); las seis pruebas de navegador de la casa siguen pasando. Límites: en una visita aún no se ven las estrellas del dueño (el código de casa no las lleva); la capa musical de cada trofeo llega en F7.

## F5 · El anillo · alpha.147

Rama `claude/f5-anillo`, sobre `claude/f4-estrellas` (dependencia explícita).

- **Portales:** los 11 lugares forman un anillo dorado alrededor del Refugio, a 6000 px de su puerta (unos 32 s a pie). Si un portal cae en el mar, se corre por su radio hasta tierra. El anillo sigue al Refugio cuando se mueve; antes del primer Refugio queda donde se abrió el Mundo libre.
- **Entrar:** caminar hacia un portal abierto empieza su ronda. Con ★★, primero «Jugar» o «Maestro». Uno cerrado avisa cuántas ★ pide y cuántas tienes.
- **Sin palabras en la pantalla tranquila:** las estrellas se dibujan; un cerrado muestra un arco dorado con las ★ que llevas de las que pide. Con «Todo a la vista» también se escriben el nombre y lo que pide.
- **Sonido:** en cada «1» del compás suena la nota del portal más cercano (una por lugar), más fuerte al acercarse; los cerrados, más bajo.
- **Flecha:** en el borde de la pantalla, hacia el lugar abierto más cercano que aún no has visitado o que no tiene su ★.
- **Volver:** «Salir» en la tarjeta, «Dejar la ronda» en el menú (solo durante una ronda) y una recarga a mitad de ronda te dejan junto al portal.
- **Mapa:** los portales con sus estrellas, y «Ir a» con los lugares ya visitados: viaje rápido gratis junto a su portal.
- **`?anillo=1`:** el Mundo libre tras el Viaje, sin ronda, con el guardado de prueba de `?lugar=`.
- Pruebas: `tests/places-ring.mjs` y `tests/ring_smoke.py` (teléfono y escritorio). Límites: los portales aún no están en su bioma (la ronda sí lleva a él); la mesa del mapa del Refugio llega en F6; no se midió el paseo con personas.

## F4 · Lugares y estrellas · alpha.146

Rama `claude/f4-estrellas`, sobre `claude/f3-chispas` (dependencia explícita).

- **Rondas:** tras el Viaje, cada capítulo es un lugar que se puede volver a jugar. Una ronda es su juego con la barra vacía, en su bioma, y termina con su objeto dorado y su drop.
- **Estrellas:** ★ al completar; ★★ con el 85 % de pulsos a tiempo; ★★★ en la versión Maestro (se abre con ★★: tempo +10 %, barra ×1,5 y margen a tiempo más estrecho) con el 80 %. Sin sonido, solo ★. Las estrellas no dan chispas.
- **Del Viaje:** al cumplir un capítulo se gana su ★, y su ★★ si se jugó con el 85 % a tiempo. Quien ya lo había cumplido recibe su ★.
- **Chispas:** cada ronda paga 60–120 ✦ según el % a tiempo (Maestro el doble; desde la cuarta del día en ese lugar, la mitad).
- **Tarjeta de resultado:** las tres estrellas (las nuevas brillan), qué pide cada una con tu %, el tiempo, las chispas, «récord», y los botones «Otra vez», «Maestro» y «Salir».
- El estado del capítulo del Viaje no se pierde: se guarda aparte durante la ronda y vuelve al terminar. Una ronda a medias se descarta al recargar.
- Las estrellas viven en `S.lugares`: `S.places` ya guarda las regiones visitadas del mapa y no se toca.
- **`?lugar=lago`** (`&maestro=1`) prueba una ronda con su propio guardado. Los portales para entrar llegan en F5.
- Pruebas: `tests/places.mjs` y `tests/places_smoke.py` (incluye recarga). Límite: no se probó la sincronización en la nube de `S.lugares`.

## F3 · Economía de chispas · alpha.145

Rama `claude/f3-chispas`, sobre `claude/f2-victoria` (dependencia explícita). Las chispas sirven para comprar; las estrellas, para avanzar y ganar.

- **Tocar a tiempo vale más en el Mundo libre:** lo que rompe un pulso a tiempo da el doble de chispas, y desde el octavo pulso a tiempo seguido, el triple. El «+n ✦» lo dice en dorado: «×2», «×3». La racha se rompe fuera de tiempo o tras 4 s sin tocar. Sin sonido no hay multiplicador, porque sin beat todo pulso cuenta como a tiempo.
- **Rondas de los lugares** (se usarán en F4): 60 ✦ + 6 por cada 10 % a tiempo (60–120), Maestro el doble; desde la cuarta ronda del día en un mismo lugar, la mitad.
- **Simulación** (`scripts/spark-economy.mjs`): la minería medida a ×2 y ×3 es exactamente el doble y el triple; con la mitad del tiempo en lugares, la tienda completa (17 030 ✦, sin cambiar precios) lleva unas 9,4 horas tocando a tiempo seis de cada diez pulsos y unas 7 tocando nueve de cada diez. Antes, de 20 a 28 horas. Es un modelo, no una medida con personas.
- Pruebas: `tests/spark-rules.mjs`, `tests/spark-economy-sim.mjs` y `tests/spark_rhythm_smoke.py`.

## F2 · Sonido de victoria · alpha.144

Rama `claude/f2-victoria`, sobre `claude/f1-ritmo` (dependencia explícita). A Jay el sonido al completar un nivel le pareció horrible, triste y nada electrónico: era el tema en violonchelo.

- **El drop:** al cerrar un capítulo, desde el siguiente «1»: un compás de ruido que sube mientras la música se filtra hacia abajo, medio tiempo de silencio y dos compases con el beat completo y el tema del cubo en un sintetizador. El filtro de la música se abre de golpe en el drop.
- **Un estilo por capítulo:** Llanura house (bombo a negras, palmas, acordes a contratiempo), Lago dub (medio tiempo, ecos), Bosque disco (bajo en octavas, charles en semicorcheas), Tormenta techno (bombo duro, bajo grave, línea ácida) y Vacío ambient (sin percusión: un pad y el tema en campanas con eco).
- El portal se abre al terminar el drop. Sin sonido no suena nada y el portal espera lo de siempre.
- **Mezcla:** `tests/victory_mix.py` renderiza los cinco drops: sube, hay silencio antes del drop, el drop es lo más fuerte y el pico queda en 0,57 (margen sobre la música). Los sonidos de los cinco juegos se revisaron por nivel frente a los del juego; no se renderizaron aparte.
- Pruebas: `tests/journey-victory.mjs`, `tests/victory_mix.py`; la prueba de la Llanura comprueba que el filtro de la música se vuelve a abrir.

## F1 · Ritmo de los niveles · alpha.143

Rama `claude/f1-ritmo`, sobre `claude/f0-viaje-juegos` (dependencia explícita). Jay tardó 8 min en la Llanura, menos de 1 en el Lago y el Bosque, 3 en la Tormenta, y el Vacío le pareció demasiado rápido. Meta: 2:30–3:00 por capítulo.

- **Llanura:** meta 60 (antes 120); más cosas cerca (más de 8 celdas de 10) y más piedras y cometas.
- **Lago:** meta 340 (antes 100); los racimos, más separados.
- **Bosque:** meta 240 (antes 100); cada luciérnaga vale como mucho 3.
- **Tormenta:** meta 250 (antes 100); el primer círculo aparece junto al cubo, para aprender la regla de inmediato.
- **Vacío:** solo se suelta en el «1» del compás; cuatro puntos bajo el cubo cuentan el compás y el primero, dorado, es el «1». Cada estrella pide su cielo, a 100 px de las demás: hay que moverse para dibujar la constelación. Sin sonido vale cualquier pulso.
- **Medida:** un jugador simulado (150 px/s, 80 % de aciertos), calibrado con los tiempos de Jay, estima 2:20–2:55 por capítulo. Es una estimación: la confirman la prueba de Jay y las notas de `?prueba=1`.
- Los juegos reciben el paso del compás de cada pulso.

## F0 · El Viaje por juegos en `main` · alpha.142

Rama `claude/f0-viaje-juegos`, desde `main` (alpha.141, con los cinco capítulos integrados en las PR #315–#319). Primera fase del plan aprobado en [El mundo](docs/MUNDO.md).

- **[El mundo](docs/MUNDO.md):** el plan completo, F0–F16, con chispas para comprar y estrellas para avanzar y ganar.
- **`?capitulo=`** (`llanura`, `lago`, `bosque`, `tormenta`, `vacio`): abre el Viaje directamente en ese capítulo, sin cuenta y con su propio guardado; cada carga empieza el capítulo de nuevo.
- **El festival** juega el Lago nuevo: termina al abrir la flor dorada.
- Cada juego vuelve a leer su estado si el guardado lo reemplaza.
- **Bosque:** la estela dura 8 s (antes 5): una vuelta a paso normal tarda unos 4,6 s y en un teléfono lento no llegaba a cerrarse.
- El saludo de regreso ya no reabre la bienvenida del Camino si ya se dio por vista (`?capitulo=` la dejaba encima del capítulo).
- Pruebas: `tests/chapter_test_smoke.py`; `tests/festival_smoke.py` usa el Lago nuevo.

## Antes de alpha.142

Las entradas anteriores (alpha.58–alpha.141: universo, superbiomas, fases 0–7, Viaje por juegos) se quitaron de este archivo el 24 de octubre de 2026. Siguen en Git: `git show 5914ca9:CAMBIOS.md`.

## Integración confirmada en main

[PR #353](https://github.com/Jaywrkr/WHITEDOT/pull/353) · [CI de integración](https://github.com/Jaywrkr/WHITEDOT/actions/runs/40164328278) aprobado: lógica, seis grupos de navegador, tres de audio y agregador. Se conserva alpha.181 y el mismo runtime; aceptación humana y tiendas permanecen pendientes.

## Sexta auditoría · experiencia real de Jay

Rama `audit/panel-6-experiencia-real`, desde main `3c5fd7b6`, misma versión alpha.181. Revisión documental, sin cambios al juego. Se verifica la falta de acceso inicial gratuito al siguiente lugar, salto de paisaje ajeno al anillo, rumbo sin Y, centro móvil del anillo y ruta musical final5 que conservaba su arreglo anterior. Aviso X1 recortado reproducido con geometría controlada.

[Sexta sesión](docs/panel/sesion-6/informe.md): media provisional7,2 frente a8,1 por nueva evidencia humana, no por una regresión de código nueva. [K1–K5](docs/panel/sesion-6/plan.md) propuestas; no implementadas. U03/U04 reabiertos; A04/U05–U08 nuevos; V01 con rechazo concreto de Jay. Pruebas y límites en el expediente; generadores, arte y progreso intactos.

## alpha.182 · K1 · guía a pie al anillo

Desde la auditoría `7476aa7a`, rama `pulido/k1-guia-anillo`. Seguir hacia el siguiente lugar orienta sin mover ni cobrar. Nombre/distancia, indicador de ocho rumbos y ancla del anillo migrada desde la ubicación vigente, independiente de la casa portátil. Si falla guardar, se revierte la migración. El siguiente resultado también propone caminar. Música, generación y estrellas conservadas.

## alpha.183 · K2 · recoger siempre tiene valor

Rama `pulido/k2-economia-chispas` desde K1. Fuera de tempo×1, a tiempo×2 y racha×3. Recuperación de pendientes con multiplicador cero, sin reemitir fragmentos cobrados ni alterar saldo/precios/estrellas. Simulación económica alineada con esa regla. Música y mundo conservados.

## alpha.184 · K3 · final5 en su contexto musical

Rama `pulido/k3-final-viaje` desde K2. El final de cinco círculos interpreta las notas guardadas en escala/tono y tempo de salida (90–150 BPM), con las mismas voces existentes, entradas separadas y menor ácido. La cama y las frases comparten armonía; una envolvente local deja silencio real antes de créditos y se cancela al salir. Cada círculo sigue ataques de su capa. No se modifican radio, instrumentos, generadores o MIDI guardados.

## alpha.185 · K4 · menú y avisos adaptables

Rama `pulido/k4-interfaz-clara` desde K3. Continuar/Seguir principal, tres destinos, utilidades discretas y sonido en Ajustes, conservando IDs/capacidades. Explorar en la partida terminada conserva el Mundo. Avisos territoriales cortos con columnas mínimas y ajuste de línea; ayuda de guardar situada junto al marcador. No cambia música o dibujo del mundo.

## alpha.186 · K5 · guía tras el Viaje

Rama `pulido/k5-recorrido-contextual` desde K4. Créditos explican cinco completados y seis nuevos; Explorar a pie sale del Refugio y activa el rumbo, sin trasladar al portal. La guía ofrece el mismo destino y agrupa experiencias opcionales. Tras terminar el Viaje se oculta la antigua lección automática de guardar sin borrar hechos; Practicar la reactiva voluntariamente. Formatos futuros y progreso se conservan.

## alpha.187 · K6 · verificación e integración del cierre

Rama `pulido/k6-validacion-cierre` desde K5. Marcha con teclas reales hasta Jardín sin asignar coordenadas, recompensa acelerada por el controlador real, rumbo a Dunas y recarga. Seguir también funciona tras volver al Camino; regreso al Camino queda en Más y sus controles/pruebas reflejan su ubicación. Regiones y Otro paisaje distinguen metas; viaje rápido voluntario a capítulos ya completos. Dos desbordamientos con texto doble corregidos. Guardia de preservación permite solo la integración/UI autorizadas y conserva297 archivos/voz/generación/arte.

[Entrega](docs/CIERRE_K.md):246 suites,48 muestras UI y recorridos afectados aprobados; cinco renders final5 reutilizados con código sonoro intacto. Canonical U03–U09/A04/E01 actualizados; aceptación humana/CI remoto no declarados. Nota técnica provisional7,9 del panel simulado, sin escucha del auditor. Main no se modifica.
