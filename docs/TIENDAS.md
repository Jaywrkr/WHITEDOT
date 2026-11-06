# Material de tienda

Borradores de D07 (fichas), D08 (icono, gráficos y capturas), D09 (clips), D10 (textos de landing) y D11 (press kit). Nada está publicado ni enviado. Precios aprobados; países, editor y correo siguen pendientes en el [plan de lanzamiento](PLAN_LANZAMIENTO.md).

## Cómo se genera

`python3 scripts/store-media.py` abre el juego real en Chromium y guarda todo en `outputs/tienda/`, fuera de Git. Con `--only capturas,iconos,clips` se elige qué generar; `--sizes movil,escritorio` y `--langs es,en` acotan tamaños e idiomas. Tarda unos diez minutos entero.

- **Capturas** (rehechas en alpha.275, Listo 3): ocho escenas por tamaño y por idioma (español e inglés), `TAMAÑO-IDIOMA-N-escena.png`:
  1. `inicio`: guardado nuevo del mundo abierto (`?abierto=1`, sin Viaje ni Camino), la guía en 1/6 y «Llanura · más lejos · 0,5 km».
  2. `escaner`: el dedo mantenido y las marcas del escáner, también en el borde.
  3. `portal`: el portal de Llanura con sus ★.
  4. `ronda`: una ronda del Lago, jugada. Suena la música, el lugar canta su compás y el cubo pulsa en sus pasos con el pulso del juego (el de la barra espaciadora). La Línea y el cubo muestran los aciertos.
  5. `resultado`: la hoja de ★ de esa ronda.
  6. `cubo`: Tu cubo, pestaña Piezas («Cambiar ✦»).
  7. `bitacora`: Bitácora, Logros.
  8. `refugio`: el Refugio, con su primera frase escrita entera.
  - Desde la escena 2, la partida tiene 21 días, tres lugares completos (Llanura, Lago, Bosque), sombrero y mascota y el Refugio con todos los ornamentos. Sigue siendo del mundo abierto.
  - Los avisos pasajeros se ocultan, y la guía desde la escena 2; el resto es el juego tal cual.
- **Iconos y gráficos:** se dibujan con la marca actual (cubo blanco en aro dorado sobre negro), sin canal alfa.
- **Clips:** la pantalla se graba a la mitad y se duplica con píxeles nítidos; el sonido es el del juego, tomado de su salida. El del Mundo empieza con la guía del guardado nuevo y luego camina por una región viva. El de la ronda (`clip-ronda-vertical-*`): el Lago canta su compás y el cubo lo responde a tiempo.

| Archivo | Tamaño | Para |
|---|---|---|
| `capturas/movil-es-*`, `movil-en-*` | 1080×1920 | Google Play, teléfono |
| `capturas/tablet-*` | 1600×2560 | Google Play, tableta de 10" |
| `capturas/iphone-6-9-*` | 1320×2868 | App Store, iPhone 6,9" |
| `capturas/ipad-13-*` | 2064×2752 | App Store, iPad 13" |
| `capturas/escritorio-*` | 1920×1080 | Steam, web y landing |
| `iconos/icono-512-play` | 512×512 | Google Play |
| `iconos/icono-1024-apple` | 1024×1024 | App Store |
| `iconos/icono-adaptativo-432` | 432×432 | Capa del icono adaptativo de Android |
| `iconos/icono-256-steam` | 256×256 | Steam, comunidad |
| `graficos/grafico-play-1024x500` | 1024×500 | Google Play, gráfico destacado |
| `graficos/steam-*` | 1232×706, 920×430, 462×174, 600×900 | Cápsulas de Steam |
| `graficos/og-1200x630` | 1200×630 | Vista previa al compartir |
| `clips/clip-mundo-vertical-es`, `-en`, `clip-refugio-vertical` | 1080×1920, 12–14 s | Tráiler vertical, redes |
| `clips/clip-ronda-vertical-es`, `-en` | 1080×1920, 14 s | Tráiler vertical: cómo se juega una ronda |
| `clips/clip-mundo-horizontal-es`, `-en` | 1920×1080, 14 s | Tráiler de Steam y landing |

Pendiente de Jay:
- La identidad aprobada con violeta eléctrico está en `outputs/kubono-visual/`, fuera de Git y fuera de esta sesión. Los gráficos de ahora usan la marca del juego; se rehacen cuando esa maqueta esté disponible.
- Ver y aprobar el tráiler (más abajo).

## Ficha en español

Reescrita para alpha.273 (mundo abierto); alpha.274 quita «pagadas» de las piezas. Cifras comprobadas en el código: once lugares (`PLACES`, de 0,5 a 40 km), 33 ★, 81 piezas de Tu cubo (`CUBE_SHOP`) y 395 logros (399 menos cuatro retirados; un jugador sin Camino ve 394, porque «tope» no se lista).

- **Título (30):** Kubono
- **Descripción breve (80):** Un cubo en un universo que suena. Explora, encuentra once lugares y crea música.

**Descripción larga:**

Eres un cubo en un universo abierto que suena. La música responde a lo que haces.

- **Un mundo abierto desde el primer segundo.** Sin tutorial largo. Camina hacia donde quieras.
- **Once lugares, cada uno más lejos.** El primero está a 0,5 km; el último, a 40 km. Al llegar, su portal aparece delante.
- **Rondas a tiempo.** Cada portal abre una ronda con su propio gesto. Toca a tiempo y gana hasta tres ★. Las 33 son maestría.
- **Un escáner.** Mantén pulsado y una onda muestra lo que hay cerca: criaturas, cajas, secretos.
- **Música que reacciona.** Cada región tiene su género y su ritmo. Lo que tocas, tu racha y tu forma de moverte cambian el arreglo.
- **Tu cubo y tu Refugio.** Más de ochenta piezas para cambiar cómo se ve, se mueve y suena, a cambio de chispas que ganas explorando. Un Refugio que viaja contigo.
- **Una bitácora de todo.** Lugares, géneros escuchados y más de 390 logros.

Pago único. Sin anuncios, sin compras dentro del juego y sin suscripciones: las chispas solo se ganan jugando. Sin cuenta y sin conexión: tu partida se guarda en el dispositivo. En español e inglés. Mejor con auriculares.

## Store listing in English

- **Title (30):** Kubono
- **Short description (80):** A cube in a universe that sounds. Explore, find eleven places, make music.

**Full description:**

You are a cube in an open universe that sounds. The music answers what you do.

- **An open world from the first second.** No long tutorial. Walk wherever you like.
- **Eleven places, each farther away.** The first is 0.5 km away; the last, 40 km. When you get there, its portal appears ahead.
- **Rounds in time.** Each portal opens a round with its own gesture. Tap in time and win up to three ★. All 33 are mastery.
- **A scanner.** Hold, and a wave shows what is near: creatures, boxes, secrets.
- **Music that reacts.** Every region has its own genre and rhythm. What you play, your streak and the way you move change the arrangement.
- **Your cube and your Refuge.** Over eighty pieces that change how it looks, moves and sounds, traded for sparks you earn by exploring. A Refuge that travels with you.
- **A journal of everything.** Places, genres you have heard and over 390 achievements.

One-time purchase. No ads, no in-app purchases and no subscriptions: sparks are only earned by playing. No account and no connection: your game is saved on your device. In English and Spanish. Best with headphones.

## Tráiler

### Montaje

`python3 scripts/trailer.py --media outputs/tienda --out outputs/trailer` corta el tráiler con ffmpeg desde los clips y capturas de arriba. Escribe `trailer-es|en-1920x1080.mp4` y `-1080x1920.mp4`, de 37 s, e `informe.json`; nada entra en Git. Tarda unos dos minutos.

- **Orden:** «Kubono» y «Un cubo. Un universo que suena.» · Mundo · «Explora un universo abierto.» · ronda del Lago · «Once lugares. Cada uno más lejos.» · escáner, portal, Tu cubo y Bitácora (1 s cada una) · «La música responde a lo que haces.» · Refugio · icono, «Kubono» y «Pronto · itch.io · Google Play». En inglés, los mismos carteles traducidos.
- **Imagen:** carteles en Geist Mono sobre negro. En horizontal, la ronda y el Refugio (grabados en vertical) van centrados con bandas negras.
- **Sonido:** el del juego, de los propios clips: Mundo → ronda → Refugio, con fundidos cruzados de 1 s. Cada clip se ve mientras suena su propio audio. Masterizado en dos pasadas de `loudnorm` y medido con `ebur128`: los cuatro dan −15,9 LUFS; pico real −1,8 dBTP (ES horizontal) y −4,7 dBTP (los otros tres). El script falla si se sale de ±0,5 LU o pasa de −1 dBTP.
- **Límites:** nadie lo ha visto ni oído aún, salvo fotogramas sueltos. Sin alojar: el press kit lleva el hueco [ENLACE DEL TRÁILER]. El guion pedía un comienzo del cubo en negro con un pulso; los clips no lo tienen y no se grabó nada nuevo.

### Guion (30–45 s)

Regla del plan: primero una acción del cubo y su respuesta. Solo funciones reales, música del juego.

1. **0–4 s:** el cubo en negro, un pulso, y el mundo responde con su música.
2. **4–14 s:** recorrido por el Mundo (`clip-mundo-*`): cambia el paisaje y cambia la música.
3. **14–24 s:** el Refugio se despliega desde el cubo, que camina por sus cámaras; un pulso, y las criaturas responden (`clip-refugio-vertical`).
4. **24–32 s:** un portal y su ronda a tiempo; cortes rápidos del escáner, Tu cubo y Bitácora (capturas).
5. **32–40 s:** «Un cubo. Un universo que suena.» y el logo.

## Sitio: landing, privacidad y prensa

`site/` tiene el sitio estático: `index.html` y `en.html` (landing), `privacidad.html` y `privacy.html`, `prensa.html` y `press.html`, `site.css`, las fuentes Geist Mono (con su licencia OFL) y las imágenes (seis capturas de escritorio por idioma en WebP de 1280×720, icono, cabecera y la imagen para compartir). Unos 650 KB en total.

- **Se genera** con `node scripts/site-build.mjs`; `--check` dice si alguna página quedó atrás. Las de privacidad salen de la parte pública de [Privacidad](PRIVACIDAD.md), sin las notas de Jay: tras cambiar ese texto, se vuelve a generar. `tests/site.mjs` lo comprueba.
- **Sin rastreo.** Sin scripts, cookies, analítica ni peticiones externas: todo es local. Los botones de tienda son textos («Pronto en itch.io», «Pronto en Google Play»), no enlaces.
- **Huecos visibles.** [NOMBRE LEGAL], [CORREO], [FECHA] y el enlace del tráiler salen recuadrados hasta completarlos.
- **Fuera del juego.** No está en `SHELL` de `sw.js` ni en el zip de itch.io (`GAME_PATHS`), Android o escritorio.
- **Cómo se sirve.** El despliegue actual del juego en Vercel sirve la raíz del repositorio, así que el sitio se ve en `/site/` sin tocar el juego. Para `playkubono.com` (no comprado): un proyecto de Vercel aparte con directorio raíz `site/`, sin build. Al publicarlo, el alojamiento guarda registros técnicos de las visitas: nombrarlo en la privacidad entonces.
- **Límites.** Comprobado con capturas sin cabeza a 390 y 1280 px. No publicado. `og:image` es relativa hasta que haya dominio. Sin clip en bucle: el vídeo pesaría más que todo el sitio.

## Landing (textos)

- **Arriba:** Kubono · Un cubo. Un universo que suena. Clip horizontal en bucle, sin sonido hasta que se toca.
- **Tres ideas:** Explora un universo abierto · Once lugares, cada uno más lejos · Música que reacciona.
- **Tu Refugio:** «Tu Refugio viaja contigo», con la captura del Refugio entero.
- **Comprar:** botones de cada tienda disponible, con precio. Sin demo.
- **Pie:** privacidad, soporte, eliminación de datos y créditos.

## Press kit

- **Datos:** Kubono. Desarrollo independiente. Plataformas: Android, iOS/iPadOS, web y escritorio, cada una cuando esté lista. Precio: US$2,99 móvil, US$4,99 escritorio, pago único, sin compras dentro del juego. Idiomas: español e inglés.
- **Descripción corta:** Un cubo explora un universo abierto donde cada región suena distinta; encuentra once lugares cada vez más lejos, juega sus rondas a tiempo y la música responde a lo que hace.
- **Contenido:** la carpeta `outputs/tienda` (capturas, iconos, gráficos y clips).
- **Página:** `site/prensa.html` y `site/press.html`. Precio y fecha salen «por confirmar».
- **Pendiente:** fecha, nombre del editor, contacto de prensa, enlace del tráiler y enlaces de tiendas.
