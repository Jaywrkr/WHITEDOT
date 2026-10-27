# itch.io (web)

Fase L4 de la [salida web y Android](PLAN_LANZAMIENTO.md#salida-web-y-android). Precio web **US$3,99** (Jay, 27 de octubre). Nada está subido ni publicado: no hay cuenta de itch.io comprobada en este trabajo. Ficha completa, capturas y privacidad son de L5.

## Duda abierta que bloquea el cobro

**Hay que confirmarlo en itch.io antes de fijar el precio.** Según su foro (respuestas de la comunidad y de un moderador, no la documentación oficial), un juego HTML de itch.io **se juega gratis en el navegador**: el precio solo cubre los archivos descargables. No se pudo leer la documentación oficial desde esta sesión.

Cómo comprobarlo en el borrador:
1. Subir el zip como HTML y fijar el precio (US$3,99, «Paid»).
2. Abrir la página del borrador en una ventana privada, sin sesión (con el enlace secreto de borrador).
3. Mirar si el juego arranca sin comprar. Si arranca, el navegador es gratis.

Si el navegador es gratis, hay tres caminos. Decide Jay:
- **A. Web gratis, cobro en Android.** El juego entero gratis en itch.io (con donación opcional) y US$2,99 en Google Play. Cambia el modelo aprobado.
- **B. Venta como descarga.** El comprador baja un archivo. **El zip actual no sirve así:** abierto con doble clic (`file://`) el navegador bloquea los módulos ES y el juego no arranca (comprobado en Chromium). Haría falta un envoltorio de escritorio (el canal de US$4,99, aún sin hacer) o un lanzador local. Es trabajo nuevo.
- **C. Web de pago en otro sitio.** Cobro y control de acceso propios (por ejemplo en `playkubono.com`). Contradice «sin cuenta ni nube» y «no implementar cobro propio sin decidirlo».

No hay demo: el plan dice «sin demo comercial», así que no se propone un recorte gratis.

## Generar el zip

```
node scripts/itch-package.mjs
```

Escribe `dist/kubono-itch-<versión>.zip` (`dist/` no entra en Git). Copia solo el juego (`index.html`, `manifest.webmanifest`, `src/`, `styles/`, `assets/`, `icons/`), sella la **edición de venta** con `set-edition.mjs` en esa copia y sella versión, commit y hora de empaquetado. Quedan fuera pruebas, documentación, Android, servidor, scripts, Supabase, `recovery.html` (página de cuenta), `sw.js`, `package.json` y la imagen para compartir. `index.html` va en la raíz, como exige itch.io.

Para alpha.225: **340 archivos, 3,41 MB sin comprimir y 1,44 MB el zip.** El límite de itch.io para HTML es de unos 1000 archivos y 500 MB: el script falla si se pasa. Empaquetar desde un commit limpio, para que el commit sellado sea el real.

## Cómo funciona dentro de itch.io

itch.io sirve el zip desde su CDN, en una carpeta (`/html/NÚMERO/index.html`), dentro de un `<iframe>` de la página del juego.

- **Rutas.** Todas son relativas (`./src/…`, `./styles/…`, manifiesto e iconos). Funcionan en cualquier carpeta.
- **Service worker: apagado en itch.io.** El zip no lleva `sw.js` e `index.html` lleva `<meta name="kubono-service-worker" content="off">`; `src/pwa.js` no registra nada si lo ve. Motivos: dentro de un marco de otro sitio el worker es poco fiable (Firefox y Safari lo limitan); cada subida nueva cambia la carpeta y dejaría workers y cachés viejos en el teléfono del jugador; y sin conexión la página de itch.io tampoco abre. Vercel sigue igual (registra `./sw.js` en https). Android ya iba sin worker.
- **Guardado.** `localStorage` es del dominio del CDN de itch.io, no de Vercel: una partida de Vercel no aparece en itch.io. Para pasarla: «Guardar copia» (exportar e importar). Las subidas nuevas conservan la partida (el dominio no cambia). El navegador separa ese almacenamiento por sitio: la partida del marco en itch.io no es la misma que la del enlace directo al CDN. El CDN de itch.io podría compartir su cuota con otros juegos; una partida pesa unos 5 KB y, si guardar falla, el juego avisa y ofrece exportar. En Safari con «Bloquear todas las cookies» puede no haber almacenamiento.
- **Sonido.** Empieza con el primer toque dentro del marco, como en la web.
- **Pantalla completa.** El juego no usa la API de pantalla completa: se adapta al tamaño del marco. La pantalla completa la da el botón de itch.io.
- **Orientación.** El juego funciona vertical y horizontal (manifiesto `any`; probado a 390×844 y 1280×800).
- **Sin peticiones externas.** La edición de venta no llama a Supabase ni a otro servidor; el zip no enlaza a la vista previa de Vercel (se quitan `og:url` y `og:image`).

Prueba: `tests/itch_package_smoke.py` genera el zip, lo sirve en `/html/123456/` dentro de un marco de otro sitio y comprueba arranque, sonido tras tocar, guardado tras recargar, copia exportada, español e inglés (`?lang=en`), cero peticiones fuera de la carpeta y cero errores. `tests/itch-package.mjs` revisa el contenido del zip. **No probado en itch.io real, ni en teléfono, ni con personas.**

## Configuración de la página

| Campo | Valor |
|---|---|
| Kind of project | **HTML** |
| Uploads | El zip, marcado «This file will be played in the browser» |
| Pricing | US$3,99 («Paid»), si se confirma la duda de arriba |
| Embed options | Marco **390 × 844**; «Mobile friendly» activado; orientación **Default**; «Fullscreen button» activado; «Automatically start on page load» desactivado; «Click to launch in fullscreen» desactivado |
| Classification | Games · Genre: Music (o Exploration) |
| Visibility | **Draft** (borrador), nunca «Public» sin autorización de Jay |

**Por qué 390 × 844.** Es el tamaño en que se diseñó y se prueba el juego, incluido el criterio de L2 («los textos no se cortan a 390×844»). Es vertical, como se juega en el teléfono. En un portátil de 768 px de alto el marco no cabe entero: la página se desplaza y el botón de pantalla completa da la vista grande, donde el juego se adapta a horizontal. Si Jay lo ve incómodo en su portátil, probar 360 × 720 en el borrador antes de cambiar nada.

**Orientación Default** porque el juego se adapta a las dos; forzar vertical obligaría a girar a quien juega acostado o en tableta.

**Arranque al tocar** (no automático): el sonido necesita un toque y el juego pesa poco.

## Textos de la página

### Español

- **Título:** Kubono
- **Descripción corta:** Un cubo, un universo que suena. Explora, rompe cristales y crea tu música.
- **Descripción larga:**

Eres un cubo en un universo que suena. Cada lugar tiene su música, y lo que haces la cambia.

- **Explora un mundo musical.** Once paisajes, del Bosque a la Tormenta, cada uno con su escala, su ritmo y sus instrumentos. Bajo tierra y en el cielo hay otras capas.
- **Rompe y recoge.** Lanza pulsos para romper cristales; sus fragmentos son chispas.
- **Descubre.** Criaturas que te siguen, escenas raras y maravillas musicales que solo pasan una vez.
- **Tu Refugio viaja contigo.** Se despliega desde el cubo donde estés. Coloca objetos que suenan y compón en el Taller.
- **Tu cubo, a tu manera.** Más de ochenta piezas para cambiar cómo se ve, se mueve y suena.

Pago único. Sin anuncios ni suscripciones; las chispas no se venden. Sin cuenta: tu partida se guarda en este navegador. «Guardar copia» la lleva a otro dispositivo. En español e inglés. Mejor con auriculares.

### English

- **Title:** Kubono
- **Short description:** A cube in a universe that sounds. Explore, break crystals, make music.
- **Long description:**

You are a cube in a universe that sounds. Every place has its own music, and what you do changes it.

- **Explore a musical world.** Eleven landscapes, from the Forest to the Storm, each with its own scale, rhythm and instruments. There are more layers underground and in the sky.
- **Break and collect.** Send pulses to break crystals; their fragments are sparks.
- **Discover.** Creatures that follow you, odd scenes and musical wonders that happen only once.
- **Your Refuge travels with you.** It unfolds from the cube wherever you are. Place objects that play and compose in the Workshop.
- **Your cube, your way.** Over eighty pieces that change how it looks, moves and sounds.

One-time purchase. No ads, no subscriptions; sparks are never sold. No account: your game is saved in this browser. "Save a copy" takes it to another device. In English and Spanish. Best with headphones.

### Etiquetas

`music`, `exploration`, `relaxing`, `procedural-generation`, `atmospheric`, `minimalist`, `cube`, `singleplayer`, `mobile`, `electronic-music` (itch.io admite hasta 10).

Nombre legal, correo de contacto, capturas y política de privacidad: pendientes (L5 y tareas de Jay).

## Pasos de Jay (borrador privado, sin publicar)

1. Generar el zip en un commit limpio de `main`: `node scripts/itch-package.mjs`.
2. En itch.io: «Upload new project».
3. Título «Kubono»; «Kind of project»: **HTML**.
4. «Uploads»: subir `dist/kubono-itch-<versión>.zip` y marcar «This file will be played in the browser».
5. «Embed options»: los valores de la tabla de arriba.
6. «Pricing»: dejar **sin precio** hasta resolver la duda; luego probar con US$3,99 como se explica arriba.
7. Descripción corta y larga, género y etiquetas de esta guía.
8. «Visibility & access»: **Draft**. Guardar. No pulsar «Public».
9. Abrir la vista previa del borrador en el escritorio y en el teléfono: jugar, tocar para oír, cerrar, volver a abrir y ver que la partida sigue. Probar el botón de pantalla completa y girar el teléfono.
10. Anotar lo que falle; no publicar sin decidirlo.
