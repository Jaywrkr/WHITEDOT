# Material de tienda

Borradores de D07 (fichas), D08 (icono, gráficos y capturas), D09 (clips), D10 (textos de landing) y D11 (press kit). Nada está publicado ni enviado. Precios aprobados; países, editor y correo siguen pendientes en el [plan de lanzamiento](PLAN_LANZAMIENTO.md).

## Cómo se genera

`python3 scripts/store-media.py` abre el juego real en Chromium y guarda todo en `outputs/tienda/`, fuera de Git. Con `--only capturas,iconos,clips` se elige qué generar.

- **Capturas:** seis escenas en cada tamaño: Mundo, Refugio, Refugio entero, Taller, Tienda del cubo y Bitácora.
  - Partida preparada: día 22, sombrero y mascota, Refugio con todos los ornamentos.
  - Los avisos pasajeros se ocultan; el resto es el juego tal cual.
- **Iconos y gráficos:** se dibujan con la marca actual (cubo blanco en aro dorado sobre negro), sin canal alfa.
- **Clips:** la pantalla se graba a la mitad y se duplica con píxeles nítidos; el sonido es el del juego, tomado de su salida.

| Archivo | Tamaño | Para |
|---|---|---|
| `capturas/movil-*` | 1080×1920 | Google Play, teléfono |
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
| `clips/clip-mundo-vertical`, `clip-refugio-vertical` | 1080×1920, 12–14 s | Tráiler vertical, redes |
| `clips/clip-mundo-horizontal` | 1920×1080, 14 s | Tráiler de Steam y landing |

Pendiente de Jay:
- La identidad aprobada con violeta eléctrico está en `outputs/kubono-visual/`, fuera de Git y fuera de esta sesión. Los gráficos de ahora usan la marca del juego; se rehacen cuando esa maqueta esté disponible.
- El tráiler final se monta con estos clips; el guion está más abajo.

## Ficha en español

- **Título (30):** Kubono
- **Descripción breve (80):** Un cubo, un universo que suena. Explora, rompe cristales y crea tu música.

**Descripción larga:**

Eres un cubo en un universo que suena. Cada lugar tiene su música, y lo que haces la cambia.

- **Explora un mundo musical.** Once paisajes, del Bosque a la Tormenta, cada uno con su escala, su ritmo y sus instrumentos. Bajo tierra y en el cielo hay otras capas.
- **Rompe y recoge.** Lanza pulsos para romper cristales; sus fragmentos son chispas.
- **Descubre.** Criaturas que te siguen, escenas raras y maravillas musicales que solo pasan una vez.
- **Tu Refugio viaja contigo.** Se despliega desde el cubo donde estés: cuatro cámaras de luz que son partituras. Coloca objetos que suenan, enciende tus tarjetas raras, gira el Prisma y compón en el Taller.
- **Tu cubo, a tu manera.** Más de ochenta piezas para cambiar cómo se ve, se mueve y suena.
- **Una bitácora de todo.** Lugares, géneros escuchados y 376 logros.

Pago único. Sin anuncios ni suscripciones, y las chispas no se venden. Se juega sin cuenta; una cuenta con correo guarda tu avance en la nube.

## Store listing in English

The game is in Spanish. Until it is localised, the English listing must say so.

- **Title (30):** Kubono
- **Short description (80):** A cube in a universe that sounds. Explore, break crystals, make music.

**Full description:**

You are a cube in a universe that sounds. Every place has its own music, and what you do changes it.

- **Explore a musical world.** Eleven landscapes, from the Forest to the Storm, each with its own scale, rhythm and instruments. There are more layers underground and in the sky.
- **Break and collect.** Send pulses to break crystals; their fragments are sparks.
- **Discover.** Creatures that follow you, odd scenes and musical wonders that happen only once.
- **Your Refuge travels with you.** It unfolds from the cube wherever you are: four chambers of light that are musical scores. Place objects that play, light up your rare cards, turn the Prism and compose in the Workshop.
- **Your cube, your way.** Over eighty pieces that change how it looks, moves and sounds.
- **A journal of everything.** Places, genres you have heard and 376 achievements.

One-time purchase. No ads, no subscriptions, sparks are never sold. No account needed to play; an account with email keeps your progress in the cloud. Text is in Spanish.

## Tráiler (guion, 30–45 s)

Regla del plan: primero una acción del cubo y su respuesta. Solo funciones reales, música del juego.

1. **0–4 s:** el cubo en negro, un pulso, el primer cristal se rompe y suena.
2. **4–14 s:** recorrido por el Mundo (`clip-mundo-*`): cambia el paisaje y cambia la música.
3. **14–24 s:** el Refugio se despliega desde el cubo, que camina por sus cámaras; un pulso, y las criaturas responden (`clip-refugio-vertical`).
4. **24–32 s:** cortes rápidos de Taller, Tienda del cubo y Bitácora (capturas).
5. **32–40 s:** «Un cubo. Un universo que suena.» y el logo.

## Landing (textos)

- **Arriba:** Kubono · Un cubo. Un universo que suena. Clip horizontal en bucle, sin sonido hasta que se toca.
- **Tres ideas:** Explora un universo sonoro · Rompe, recoge y avanza · Descubre escenas raras.
- **Tu Refugio:** «Tu Refugio viaja contigo», con la captura del Refugio entero.
- **Comprar:** botones de cada tienda disponible, con precio. Sin demo.
- **Pie:** privacidad, soporte, eliminación de datos y créditos.

## Press kit

- **Datos:** Kubono. Desarrollo independiente. Plataformas: Android, iOS/iPadOS, web y escritorio, cada una cuando esté lista. Precio: US$2,99 móvil, US$4,99 escritorio, pago único. Idioma: español.
- **Descripción corta:** Un cubo explora un universo donde cada lugar suena distinto; rompe cristales, descubre criaturas y compone en un Refugio de luz que viaja con él.
- **Contenido:** la carpeta `outputs/tienda` (capturas, iconos, gráficos y clips).
- **Pendiente:** fecha, nombre del editor, contacto de prensa y enlaces de tiendas.
