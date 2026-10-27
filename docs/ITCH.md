# itch.io (escritorio)

Fase L4 de la [salida web y Android](PLAN_LANZAMIENTO.md#salida-web-y-android). **Jay decidió (27 de octubre): itch.io vende la versión de escritorio como descarga** para Windows, macOS y Linux. La web jugable no se publica abierta. El mismo envoltorio servirá luego para Steam. Nada está subido ni publicado: no hay cuenta de itch.io comprobada en este trabajo. Ficha completa, capturas y privacidad son de L5.

**Por qué escritorio.** itch.io no cobra por jugar un HTML en el navegador: el precio solo bloquea las descargas (foro de itch.io; comprobarlo en el borrador). Y el zip web no sirve como descarga: abierto con doble clic (`file://`) el navegador bloquea los módulos ES y el juego no arranca (comprobado en Chromium).

## Qué es la versión de escritorio

Un envoltorio **Electron** (carpeta `desktop/`) que abre la edición de venta en su propia ventana. Se eligió Electron porque es lo más probado para itch.io y Steam (un ejecutable por sistema, sin instalar nada) y porque el juego corre sobre el mismo Chromium que ya prueban los recorridos.

- **Contenido:** la carpeta que genera `scripts/itch-package.mjs` (edición de venta sellada, sin service worker, sin cuenta ni nube), copiada como `resources/app/game/`. El árbol fuente no se usa.
- **Carga:** protocolo propio `app://kubono/`, para que funcionen los módulos ES y `localStorage`. Solo sirve archivos de la carpeta del juego.
- **Ventana:** 1280 × 800, redimensionable (mínimo 360 × 560), fondo negro. **F11** (o Alt+Intro) cambia a pantalla completa; Escape sigue siendo del juego. Cerrar la ventana cierra el juego.
- **Sin menús** de Electron en Windows y Linux. En macOS queda el menú mínimo del sistema (Salir, Ocultar, Copiar/Pegar, Ventana). **Sin DevTools** en la versión empaquetada.
- **Sin red:** el envoltorio cancela toda petición que no sea del juego y desactiva la descarga de diccionarios de Chromium. Permisos: solo copiar al portapapeles.
- **Una sola instancia:** abrir otra vez enfoca la ventana abierta.
- **Guardado:** en el perfil del usuario, en una carpeta fija por el ID de la app. Se conserva al actualizar.
  - Windows: `%APPDATA%\com.playkubono.kubono`
  - macOS: `~/Library/Application Support/com.playkubono.kubono`
  - Linux: `~/.config/com.playkubono.kubono`
- **ID de la app:** `com.playkubono.kubono`. **Provisional: lo confirma Jay** antes de la primera subida. Cambiarlo después cambia la carpeta del guardado.
- La partida web no aparece sola en la de escritorio: «Guardar copia» (exportar) y abrirla en la otra (importar).
- Sonido: empieza con el primer clic, como en la web.

## Generar los builds

En este repositorio, una vez:

```
cd desktop && npm ci
```

`desktop/` es la única carpeta con dependencias npm (Electron y `@electron/packager`, versiones fijas). `node_modules` queda fuera de Git y el juego sigue sin dependencias ni compilación.

```
node scripts/desktop-package.mjs --platform linux      # o win32, darwin, all
node scripts/desktop-package.mjs --run                 # abre la app con el Electron local (desarrollo)
```

Escribe en `dist/desktop/` (fuera de Git) la carpeta de cada sistema, su archivo y `SHA256SUMS.txt`. Electron 44.7.1.

**Workflow manual** «Desktop builds (itch.io / Steam)» (`.github/workflows/desktop-builds.yml`, solo `workflow_dispatch`): Linux y Windows en Ubuntu (con la prueba de abajo), macOS universal en un Mac. Deja los archivos como artefactos del workflow. No sube nada a itch.io.

Tamaños de alpha.225 (medidos en Linux):

| Sistema | Archivo | Comprimido | Descomprimido |
|---|---|---|---|
| Windows x64 | `kubono-<versión>-windows-x64.zip` (carpeta con `Kubono.exe`, portable) | 151 MB | 370 MB |
| Linux x64 | `kubono-<versión>-linux-x64.tar.gz` (carpeta con `kubono`) | 119 MB | 286 MB |
| macOS arm64 | `kubono-<versión>-macos-arm64.zip` (`Kubono.app`) | 125 MB | 310 MB |
| macOS universal | `kubono-<versión>-macos-universal.zip` (del workflow) | sin medir (unos 250 MB) | — |

El juego son 3,4 MB: el resto es Electron (Chromium).

## Qué falta y riesgos

- **macOS sin firma.** Firmar y notarizar requiere la cuenta de Apple Developer de Jay (US$99 al año). Sin firma, macOS avisa al abrir: hay que ir a Ajustes del Sistema → Privacidad y seguridad → «Abrir igualmente». El build del workflow lleva firma ad hoc (evita el aviso de «dañado» en Apple Silicon); un build de macOS hecho en Linux, no.
- **Windows sin firma.** SmartScreen muestra «Windows protegió su PC» la primera vez: «Más información» → «Ejecutar de todas formas». Se quita con un certificado de firma de código (de pago) y reputación.
- **Linux y el sandbox de Chromium.** En Ubuntu 24.04 y otros que restringen los espacios de nombres de usuario, Electron puede no abrir. Arreglo del jugador: `sudo chown root chrome-sandbox && sudo chmod 4755 chrome-sandbox` en la carpeta, o abrir con `./kubono --no-sandbox`. Conviene ponerlo en la página.
- **Pantalla completa** comprobada solo en la tecla (la toma el envoltorio): Xvfb no tiene gestor de ventanas. Probar F11 en cada sistema.
- **No probado** en Windows ni en macOS reales, ni con itch app, ni con personas. Electron necesita actualizaciones de seguridad: reconstruir con una versión nueva antes de cada salida.
- Iconos: PNG del juego dentro de `.ico` y `.icns`, sin tamaños pequeños dibujados a mano.

## Prueba

`tests/desktop_smoke.py` construye el build de Linux (o usa `KUBONO_DESKTOP_BUILD`), lo abre en Xvfb y lo maneja por el protocolo de DevTools: ventana de 1280 × 800 titulada Kubono, edición de venta desde `app://kubono`, F11 real (XTest) para el envoltorio y no para el juego, sonido tras el primer clic, guardado, cierre con código 0 al cerrar la ventana, partida conservada al reabrir, guardado en `~/.config/com.playkubono.kubono`. Toda conexión pasa por un proxy que solo las anota: **ninguna**, ni de la página ni de Electron; un `fetch` externo deliberado queda bloqueado. `tests/desktop-package.mjs` revisa protocolo, bloqueo, menús, DevTools, carpeta de guardado, contenido y workflow sin Electron.

El zip web y su prueba (`tests/itch_package_smoke.py`) siguen: son la entrada del envoltorio y sirven si algún día se publica la web.

## Configuración de la página

| Campo | Valor |
|---|---|
| Kind of project | **Downloadable** |
| Uploads | Un archivo por sistema, cada uno con su etiqueta: Windows → **Windows**; `linux-x64.tar.gz` → **Linux**; `macos-…zip` → **macOS** |
| Pricing | **Paid**. Precio **pendiente de Jay: US$3,99 o US$4,99** |
| Classification | Games · Genre: Music (o Exploration) |
| Visibility | **Draft** (borrador), nunca «Public» sin autorización de Jay |

Sin zip «played in the browser»: la web no se publica abierta.

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

Pago único. Sin anuncios ni suscripciones; las chispas no se venden. Sin cuenta ni conexión: tu partida se guarda en este ordenador. «Guardar copia» la lleva a otro. Windows, macOS y Linux. En español e inglés. Mejor con auriculares.

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

One-time purchase. No ads, no subscriptions; sparks are never sold. No account, no connection: your game is saved on this computer. "Save a copy" takes it to another one. Windows, macOS and Linux. In English and Spanish. Best with headphones.

### Etiquetas

`music`, `exploration`, `relaxing`, `procedural-generation`, `atmospheric`, `minimalist`, `cube`, `singleplayer`, `offline`, `electronic-music` (itch.io admite hasta 10).

Nombre legal, correo de contacto, capturas y política de privacidad: pendientes (L5 y tareas de Jay).

## Pasos de Jay (borrador privado, sin publicar)

1. Confirmar el ID de la app (`com.playkubono.kubono`) y el precio (US$3,99 o US$4,99).
2. En GitHub → Actions → «Desktop builds (itch.io / Steam)» → «Run workflow» sobre `main`. Descargar los dos artefactos.
3. En itch.io: «Upload new project». Título «Kubono»; «Kind of project»: **Downloadable**.
4. «Uploads»: subir los tres archivos y marcar en cada uno su sistema (Windows, macOS, Linux).
5. «Pricing»: Paid, con el precio elegido.
6. Descripción corta y larga, género y etiquetas de esta guía.
7. «Visibility & access»: **Draft**. Guardar. No pulsar «Public».
8. Con el enlace secreto del borrador, en una ventana privada: comprobar que la descarga pide pagar.
9. Descargar en cada ordenador que tengas: abrir (pasar el aviso de macOS o SmartScreen), jugar, oír, cerrar, volver a abrir y ver que la partida sigue. Probar F11.
10. Anotar lo que falle; no publicar sin decidirlo.

### Con `butler` (opcional)

`butler` es la herramienta de línea de órdenes de itch.io: sube solo lo que cambió y etiqueta el sistema por el nombre del canal. Jay inicia sesión una vez (`butler login`, en su ordenador; la clave no va al repositorio ni a GitHub) y luego:

```
butler push dist/desktop/Kubono-win32-x64 USUARIO/kubono:windows --userversion 2.3.0-alpha.225
butler push dist/desktop/Kubono-linux-x64 USUARIO/kubono:linux --userversion 2.3.0-alpha.225
butler push Kubono-darwin-universal USUARIO/kubono:mac --userversion 2.3.0-alpha.225
```

Para macOS, subir la carpeta que contiene `Kubono.app` descomprimida en un Mac (conserva enlaces y firma). Este trabajo no usa `butler`.

## Steam (después)

El mismo build sirve: Steam recibe las carpetas de `dist/desktop/` (una profundidad por sistema) con SteamPipe. Falta la cuenta de Steamworks, la ficha y decidir si se integran logros o la nube de Steam (hoy no).
