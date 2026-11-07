# Verificación vigente

[Traspaso](../HANDOFF.md) · [evidencia E](panel/candidato-e/informe.md). Registrar qué revisión se probó y distinguir lógica, navegador, renders, CI, despliegue y personas.

## Entorno

Cliente sin compilación ni dependencias npm de ejecución. Node18+; CI usa Node22. Python y Playwright son herramientas de prueba:

```sh
python3 -m pip install -r requirements-dev.txt
python3 -m playwright install chromium
```

`CHROMIUM_PATH` puede apuntar al Chromium del sistema. Para jugar basta `python3 -m http.server 8000`. No iniciar el servidor Python/SQLite histórico como backend del producto.

## Durante la iteración

```sh
npm run audit:release
npm run test:impact -- --base SHA_BASE
```

Usar la revisión anterior al cambio. La selección sigue dependencias transitivas y recursos leídos; `--list` solo enumera. Cachea éxitos de la misma instantánea durante una hora; cambios de archivos/entorno invalidan la caché. Opciones:`--no-cache`, `--jobs 1`, `--report RUTA.json`.

Como máximo dos procesos Node. Navegador/audio pesados, uno después del otro. Corregir causas de intermitencias; no eliminar aserciones. Estabilizar los cambios antes del pase completo final y no repetir catálogo pesado por documentos.

Intermitencias por reloj o por un runner lento (lote de estabilidad, noviembre de 2026). Se corrige la causa en la prueba, con el mismo umbral:

- Lo que sigue al reloj real (tormentas, eventos del día, estaciones, eclipses) empieza en un instante fijo con `pin_clock(page)` de `tests/browser_helpers.py` (2 jun 2026, 02:00 UTC). La hora sigue avanzando a ritmo real.
- Un calendario propio del juego se fija en su punto: `visual2_smoke.py` lleva el eclipse a su centro con `skySecretSkip` antes de medir y antes de comprobar.
- Esperar al fotograma, no a un número de milisegundos: el juego lee los paneles una vez por fotograma.
- Los avisos cuentan su tiempo en ticks propios (0,1 s como máximo): un runner cargado los alarga. Los recorridos de encuentros vivos esperan a que la cola de avisos quede vacía antes de provocar el suyo.
- Varios dispositivos en `cloud_account_smoke.py`: el que no actúa queda «fuera» (`away`) mientras el otro guarda, para que un guardado suyo no adelante la copia.
- Navegación: con `set_default_timeout(10000)` se añade `set_default_navigation_timeout(30000)`. El primer recorrido de un runner frío puede tardar más de 10 s en cargar.
- Una medida de píxeles de un solo fotograma es ruido: `color_earned_smoke.py` usa la mediana de cinco.
- `universe_layers_smoke.py` espera, hasta 6 s, un fotograma con el polvo ámbar; `synth_bank_smoke.py`, el movimiento de filtro de la criatura más cercana (la primera nota puede ser de otra).
- Con el motor pro, tus notas suenan una microtarea después (se agrupan en acordes): contar nodos tras `setTimeout(0)`. El último recorte de salida cambia al llegar la familia de la región: medir la salida después (`victory_live_smoke.py`, desde el compás 2).

## Antes del push

- En local, siempre:`npm test`, `node scripts/release-audit.mjs` y `node scripts/stale-text-check.mjs --base SHA_BASE`. No correr recorridos de navegador ni audio en local, salvo para depurar un fallo concreto (por ejemplo `CHROMIUM_PATH=/ruta/chromium python3 tests/journal_entry_smoke.py`). El CI del PR corre los recorridos afectados.
- `stale-text-check` lista los textos en español que el cambio quitó o reescribió en `src/` e `index.html` (y que ya no aparecen en ninguna parte del juego; la tabla de traducción no cuenta) y las pruebas que aún los esperan. Falla si una prueba espera un texto viejo; las que comprueban que ya no está solo se listan. Tarda menos de un segundo, pero es heurístico y necesita una base, así que no forma parte de `npm test`.
- Sonido modificado:renderizar solo los archivos que Jay va a escuchar. Los renders de prueba los corre el CI.
- Solo documentación/evidencia:enlaces, coherencia de fuentes, `git diff --check`, auditoría y selección de impacto.
- Limpieza de archivos:comprobar referencias y consumidores; no borrar por nombre antiguo un formato, módulo o fixture de compatibilidad.

`npm test` no reutiliza la caché de impacto. No atribuir las pruebas de otra instantánea a una nueva sin explicar preservación/alcance.

## CI

- **Pull request:** la lógica completa (`npm test`, auditorías) y solo los recorridos de navegador y audio que el diff afecta. `tests/flow_impact.py` los elige a partir del commit de fusión frente a su primer padre y los imprime en el registro del trabajo `select`. Documentación sola: ningún recorrido. Un flujo cambiado: ese flujo. Un módulo de `src/`: los recorridos con su nombre o que lo citan (o a su familia, `scanner.js` y `scanner-model.js`, o a quien lo importa), más todo el audio si el render de audio lo carga. Núcleo compartido (`src/main.js`, `src/audio.js`, `src/render.js`, `index.html`, `styles/`, `sw.js`, `assets/`, el arnés y sus helpers, los workflows), un módulo que importan quince o más, un módulo que ningún recorrido de navegador cita o una ruta desconocida: catálogo completo. Prueba en seco: `python3 tests/flow_impact.py --files src/scanner.js` (o `--base REV`).
- **Un push nuevo al PR cancela su run en curso** (`concurrency`). Los de `main`, la cola de fusión, la nocturna y los manuales no se cancelan.
- **Versión solo en el diff:** con `--base`, un archivo que solo cambia las cadenas que escribe `bump-version.mjs` (`index.html`, `sw.js`, `package.json`, `src/release-info.js`) no elige recorridos. Un cambio real en esos archivos sigue pidiendo el catálogo completo. Prueba: `tests/flow-impact.mjs`.
- **Cola de fusión (`merge_group`), nocturna (06:17 UTC) y manual:** catálogo completo.
- **`main`:** catálogo completo mientras la cola de fusión esté apagada. Con la variable `MERGE_QUEUE=on`, un push a `main` corre solo `logic`: ese commit ya pasó el catálogo completo en la cola. La nocturna sigue completa. Si `main` o la nocturna salen en rojo, arreglarlo es lo primero.
- `browser-audio` sigue siendo el check obligatorio: un tipo sin recorridos elegidos se salta y cuenta como verde. Cualquier otro resultado (rojo, cancelado, salto con recorridos elegidos) lo pone en rojo. Hasta el 6 de noviembre de 2026 dejaba pasar un grupo en rojo: `bash -e` ignora un fallo dentro de `a || { b && c; }`. `tests/flow-impact.mjs` ejecuta su guion con cada resultado.
- **Imagen de navegador:** los trabajos `browser` y `audio` corren en `mcr.microsoft.com/playwright/python:v1.64.1-resolute` (Ubuntu 26.04, como el runner), la versión de `requirements-dev.txt`. Chromium 156 ya está en `/ms-playwright`; no se instala en cada run. Al subir Playwright, cambiar las dos cosas a la vez (`tests/flow-impact.mjs` lo comprueba). La imagen no trae git: el trabajo lo instala antes del checkout, con DejaVu (la reserva del runner para ★ ✦ ☰).
- **Qué Chromium.** `scripts/run-browser-tests.py` usa `CHROMIUM_PATH`, luego `chromium` del sistema y, si no hay, el de Playwright. Hasta el 6 de noviembre de 2026 el CI corría el Chromium del runner (156), no el fijado. El navegador cambia el diseño: con Chromium 151, «Bitácora» se parte y el menú de 844×390 baja 13 px. En local, un Chromium del sistema de otra versión puede dar otro resultado.

### Encender la cola de fusión (Jay)

Hasta hacer estos pasos no cambia nada: `main` sigue con el catálogo completo.

1. GitHub → WHITEDOT → **Settings → Rules → Rulesets** (o **Branches → Branch protection rules**) → la regla de `main`.
2. Activar **Require merge queue**. Dejar el método de fusión que se use hoy.
3. En **Require status checks to pass**, exigir `logic` y `browser-audio`.
4. Guardar.
5. **Settings → Secrets and variables → Actions → pestaña Variables → New repository variable**. Nombre `MERGE_QUEUE`, valor `on`. Guardar.

Después, en cada PR: **Merge when ready** (o **Add to merge queue**). La cola corre el catálogo completo sobre `main` + el PR y fusiona si sale verde. Para volver atrás: borrar la variable (o cambiarla a `off`) y quitar la cola.

Para el catálogo completo en local (solo al depurar):`npm run test:browser` y `npm run test:audio`, uno después del otro.

[checks.yml](../.github/workflows/checks.yml) reparte navegador en diez grupos y audio en ocho (en un PR, hasta diez y ocho sobre lo elegido), con agregador obligatorio (`browser-audio`). `WHITEDOT_BROWSER_SHARD=i/N` y `WHITEDOT_AUDIO_SHARD=i/N` seleccionan grupos; no omiten pruebas. `WHITEDOT_BROWSER_FLOWS` y `WHITEDOT_AUDIO_FLOWS` (lista separada por comas) limitan el catálogo; vacías, todo. `tests/flow_shards.py` equilibra los grupos con los segundos medidos en CI (`tests/flow-durations.json`); un recorrido nuevo cuenta como la mediana de su tipo. `python3 tests/flow_shards.py --list browser 10` (o `audio 8`) enseña el reparto y comprueba que cada recorrido va a un solo grupo; `--from-logs` rehace la tabla con registros de `gh run view RUN --log`. Plan: unos 15 min por grupo de navegador y 13 por grupo de audio, más bajar la imagen (con seis grupos tardaban de 20 a 29 min). Son 19 trabajos a la vez, dentro del límite de 20 del plan gratuito de GitHub. Cada trabajo tiene 40 min; cada recorrido conserva su límite (145 s navegador, 895 s audio). `living_mix.py` renderiza la primera mitad del catálogo vivo y `living_b_mix.py` la segunda: juntas pasaban de diez minutos en un solo recorrido. No integrar con checks pendientes o en rojo.

CI del PR354/alpha.200 aprobado:[registro](INTEGRACION_ALPHA_200.md). E/alpha.207 tiene254 suites Node y veinte recorridos enfocados locales; su catálogo completo/CI y aceptación física siguen pendientes. Vercel Preview aprobado no equivale a esos checks.

## Fixturas y accesibilidad

Las pruebas instrumentan una copia de `src/main.js`; el runtime no se expone en producción. La mayoría aísla Mundo/componentes y puede sustituir `requireAccount()`; eso no certifica Auth. `cloud_account_smoke.py` cubre el acceso real con Auth/REST simulado. La cuenta del producto es opcional.

`player_touch_smoke.py` usa gestos reales y navegador sin marca de automatización. `offline_smoke.py` comprueba el shell offline. Las imágenes de `panel-capture.py` son fixtures identificadas con SHA/digest; no prueban rareza, rendimiento físico o comprensión humana.

Idioma (L2): un navegador automatizado arranca en español; los recorridos que ocultan la marca de automatización declaran también un sistema en español (`navigator.languages`). Los recorridos `english_*_smoke.py` y `language_choice_smoke.py` prueban el inglés ([Traducción](TRADUCCION.md)). Los paneles plegados deben abrirse antes de usar sus controles. Mantener ID, foco, pausa, cierres equivalentes y silencio de UI. El libro tiene filtros secundarios plegables; Favoritos abre su destino dentro de la Bitácora.

## Preservación y aceptación

```sh
node scripts/verify-e-preservation.mjs
node scripts/acceptance-gate.mjs docs/aceptacion-e.json
```

El primero protege 301 archivos y trece contratos desde main alpha.200 (P1 abrió `map.js` y `places-ring.js`, solo dibujo; P2, ocho módulos de menú y cuenta). Lo que cambiaron P3–P8 se compara con `main` tras P8 (`5464612`) y lo que cambiaron Q1–Q6 con el final de Q6 (`4183856`); Q7 lo actualizará con sus contratos musicales cuando Jay apruebe la escucha. Los archivos protegidos que cambiaron las notas de Jay (alpha.226) se comparan con `702ed7a` (capa `approvedM1`); los que cambiaron los encuentros vivos (alpha.227: el motor en el fotograma, `main.js`, travesuras, Bitácora y chispas) y la lista offline de `sw.js`, con `8f0eabb` (capa `approvedE1`); los siete que cambiaron los arreglos de Jay A–E (alpha.230: `?rapido=2`, el salto tras los once lugares, «Estilos» oculto), con `e937e85` (capa `approvedAE`); los cuatro que cambió el Mapa del cielo (alpha.231: `main.js`, `render.js`, `universe-mischief.js` y la vista previa de `cube.js`) y la lista offline de `sw.js`, con `10c3c64` (capa `approvedF1`); los dos que cambiaron los arreglos de Jay G1–G3 (alpha.232: `main.js` carga la hoja tras los once y `achievement-metadata.js` retira «Dejarse llevar») y la lista offline de `sw.js`, con `cff4103` (capa `approvedG`); los que cambió H1 (alpha.233: chispas solo en el universo) y la lista offline de `sw.js`, con el merge de `main` (alpha.232) en `jay/h1-chispas` (capa `approvedH1`: el commit de la corrección de Jay sin inflación, que ya contiene G); los tres que cambió el Refugio simple (alpha.234: Escuchar en `house-audio.js`, el Prisma y el Taller fuera de Eco en `house-capsules.js`, el aviso único en `house-guide.js`) y la lista offline de `sw.js`, con el merge de `main` alpha.233 en `jay/h2-refugio` (capa `approvedH2`); los que cambió el Mapa del universo (alpha.235: el inglés de `i18n-en.js`) y la lista offline de `sw.js` (tres módulos nuevos), con el merge de `main` alpha.234 en `jay/mapa-universo` (capa `approvedM`); la partitura del final sigue con Q7. Escenas (alpha.243) añade la capa `approvedS` (`0ff4046`: `main.js`, `i18n-en.js` y la lista offline) y exige que `audio.js` sea el motor de Q7 más exactamente una línea, `runtime.sceneStep?.(s,bar,t)`, autorizada por Jay. `tests/audio_mix.mjs` admite renders de hasta 180 s; los de más de un minuto son muy lentos (unos diez minutos por render de 120 s), así que `tests/scenes_mix.py` mide 30 s del arco con `sceneFrom`. El segundo informa del registro declarado; `--require-ready` devuelve2 mientras haya criterios pendientes. Ese resultado esperado no es una suite rota ni un permiso para inventar participantes. Ver [protocolo](PRUEBAS_CON_PERSONAS.md).

Listo 1 (alpha.273) añade la capa `approvedLISTO1` (`fa98bf5`): la guía del mundo abierto, los textos sin Camino, sin BPM y «Piezas», y sus cadenas en inglés; los contratos musicales no cambian.

Los verificadores históricos `n-preservation.mjs` y `pulido-preservation.mjs` pertenecen a sus revisiones. No usarlos como gate actual ni alterar sus referencias para forzar verde. [Herramientas](../scripts/README.md).

## Escucha de Jay

Q7 (alpha.222, panel 11) cambia los finales con D8-B y D9-B + C. Los renders están en [escucha](panel/sesion-11/escucha/): Viaje antes y después; once a ★ antes y después; once a ★★ después. Son renders offline en Chromium. Corte seco y subida medidos en `journey_finale_mix.py` y `song_stage_mix.py`.

- **27 de octubre de 2026, primera escucha:** Jay rechazó el arreglo de chelo («parece música de videojuego de niños»). Pidió electrónica underground: dub techno / minimal, con subida, golpe y corte seco.
- **27 de octubre de 2026, segunda escucha:** Jay oyó los renders en dub techno y los aprobó («me gusta»). Los escuchó como archivos enviados en la conversación; no indicó dispositivo ni salida.
- **Pendiente:** oír los dos finales dentro del juego en un teléfono, con altavoz y con auriculares. El sub-bajo casi no se oye en altavoz de teléfono.

## Teléfonos y evidencia anterior

`?medir=1` muestra mediana/p95 de fotogramas, calidad y densidad. Registrar dispositivo, navegador, escena, altavoz/auriculares/Bluetooth, rotación, bloqueo, llamada y regreso. Chromium sin GPU no representa un teléfono.

Safari/PC y Android emulado tienen evidencia histórica de cuenta en [Cuenta y progreso](CUENTA_Y_RESPALDO.md); no acredita aceptación física del candidato E, iOS nativo, ports desktop o publicación. Las versiones futuras y fallos de escritura deben conservar progreso.

En Windows, respetar bytes/licencias y rutas ESM; no guardar conversiones locales CRLF como cambios del juego. Los registros de CI y cuentas anteriores permanecen en sus entregas y Git; un artefacto remoto puede caducar.
