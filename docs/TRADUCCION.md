# Español e inglés

Vigente desde **alpha.224** (fase L2 de la [salida web y Android](PLAN_LANZAMIENTO.md#salida-web-y-android)). Kubono se escribe en español; el inglés es una traducción completa del texto que el jugador lee. [Arquitectura](ARQUITECTURA.md) · [verificación](VERIFICACION.md).

## Cómo funciona

- `src/i18n.js` es el sistema de textos. El español es la clave: `t('Hola, {nombre}', {nombre})` y `translate(texto)` devuelven el texto en el idioma del jugador.
- `src/i18n-en.js` es el diccionario inglés: más de 4000 entradas `«texto español»: «texto inglés»`. Solo se carga cuando hace falta inglés.
- En inglés el sistema traduce en las salidas: el texto y las etiquetas de la página (`aria-label`, `title`, `placeholder`, `alt`) con un `MutationObserver`, el texto del canvas (`fillText`, `strokeText`, `measureText`) y los diálogos del navegador. Así los módulos del juego siguen escribiendo en español y nada se queda fuera.
- En español todas las funciones devuelven su entrada intacta: el juego en español es el de siempre, byte a byte. El observador ni siquiera se instala.
- Búsqueda de una traducción, en este orden: clave exacta; clave con números (`{n}`, por ejemplo `{n} chispas`); clave con partes abiertas (`{}`, por ejemplo `Cerrar {}`), cuyas partes se traducen a su vez; mayúsculas (`DÍA 4` → `DAY 4`); adornos alrededor (`· `, `★`, `«»`, `¿?`, `¡!`); las piezas entre separadores (` · `, `: `, `, `, saltos de línea); frases sueltas; palabras alrededor de números; fechas de `Intl` (`27 oct` → `Oct 27`). En inglés, `50.400` pasa a `50,400`.
- Lo que el jugador escribió (nombres de favoritos, notas, códigos) no se traduce: va dentro de `translate="no"` o en un `textarea`/`input`. Un dato guardado en español, como el nombre de un favorito, se muestra tal como se guardó.

## Idioma

- **Primer arranque:** el del sistema (`navigator.languages`). Cualquier variante de español da español; cualquier otro idioma, inglés.
- **Partidas anteriores a L2:** siguen en español. Si el dispositivo ya tiene una partida (`pixel-blanco-v4` o claves `kubono:`), arranca en español; la partida recibe `lang: 'es'`.
- **Guardado:** `S.lang` (`'es'` o `'en'`) vive en la partida. Un idioma de una versión futura se conserva en la partida sin tocarlo; esta versión muestra su alternativa. «Empezar de cero» conserva el idioma. `kubono:lang` en `localStorage` solo recuerda el último arranque para no mostrar español antes de leer la partida.
- **Ajustes → «Idioma / Language»:** Español o English. Cambia al momento, en ambos sentidos, y se guarda; si la escritura falla, se mantiene el idioma anterior. La etiqueta y las opciones no se traducen.
- `<html lang>` sigue al idioma. `recovery.html` usa el mismo sistema.
- Prueba: `?lang=en` o `?lang=es` fuerza el idioma al arrancar y queda en la partida. Un navegador automatizado (`navigator.webdriver`) arranca en español salvo `?lang=`, para que las pruebas en español sigan leyendo el juego en español.

## Glosario

| Español | Inglés | Nota |
|---|---|---|
| Kubono | Kubono | |
| Tu canción | Your Song | Nombre propio: mayúsculas |
| El Viaje / Viaje | The Journey / Journey | Los cinco capítulos |
| Camino | Path | Los diez cristales del inicio |
| Mundo / Mundo libre | World / Free World | |
| Lugares / los once lugares | Places / the eleven places | |
| Refugio | Refuge | La casa |
| Taller / Núcleo / Prisma | Workshop / Core / Prism | Partes del Refugio |
| Bitácora | Logbook | |
| Tu cubo | Your Cube | La hoja de personalización |
| Llevar / Tienda / Viaje (pestañas) | Wear / Shop / Travel | |
| chispas ✦ | sparks ✦ | |
| estrellas ★ | stars ★ | |
| Maestro / Libre / Jugar | Master / Free / Play | Modos de un lugar |
| Remezcla | Remix | |
| Reto entre dos / marca | Challenge for two / record | Con Luca (alpha.239); «Uno» y «Dos» → «One» y «Two»; un nombre escrito no se traduce |
| Modo tranquilo para niños | Calm mode for kids | Distinto de «Vista tranquila» (Calm view) |
| Cómo jugar | How to play | |
| Ajustes | Settings | |
| Más | More | |
| La Voz | The Voice | El narrador |
| pulso | pulse | |
| eco | echo | |
| hallazgo / tarjeta | find / card | |
| reliquia | relic | |
| encuentro | encounter | |
| Paseo musical | Musical stroll | |
| Mesa de efectos | Effects desk | |
| Estilos / Cruces | Styles / Crossovers | |
| Subsuelo / Superficie / Cielo | Underground / Surface / Sky | Capas |
| Semillas | Seeds | |
| Llanura · Lago · Bosque · Tormenta · Vacío | Plain · Lake · Forest · Storm · Void | Capítulos |
| Jardín · Dunas · Cristales · Faros · Ruinas · Cueva | Garden · Dunes · Crystals · Lighthouses · Ruins · Cave | Lugares |
| Pegar · Encadenar · Rodear · Bailar · Soltar · Sembrar · Surfear · Resonar · Guiar · Reconstruir | Stick · Chain · Circle · Dance · Release · Sow · Surf · Resonate · Guide · Rebuild | Verbos de cada lugar |
| a tiempo / contratiempo / el «y» | on time / off-beat / the «&» | Ritmo; «1 · 2y · 3 · 4» → «1 · 2& · 3 · 4» |
| Do Re Mi Fa Sol La Si | C D E F G A B | Notas |
| Dórica, Frigia, Lidia… | Dorian, Phrygian, Lydian… | Modos |
| Jay · diseño y código / Luca · primer jugador | Jay · design and code / Luca · first player | Créditos |

Géneros (Deep house, Dub techno…) y nombres de instrumentos ya en inglés se conservan. Los nombres generados por sílabas (regiones, continentes) no tienen idioma.

## Estilo

Inglés natural y breve, con el tono del español: frases cortas, una idea por frase, el narrador irónico. Ortografía estadounidense (color, favorites, traveler, center). Mayúscula inicial solo en la primera palabra, salvo los nombres propios del juego.

## Añadir o cambiar un texto

1. Escribir el texto en español en el módulo, como siempre.
2. Añadir su inglés en `src/i18n-en.js`. Si el texto lleva un número, usar `{n}`; si lleva una parte variable, `{}`. Si el inglés cambia el orden, `{1}`, `{2}`…
3. `node scripts/i18n-scan.mjs` lista el español que aún no tiene inglés.
4. Pruebas: `tests/i18n-keys.mjs`, `tests/i18n-coverage.mjs`, `tests/i18n.mjs` y, si cambia una pantalla, `tests/english_*_smoke.py`.
5. Un texto del jugador o un código: `translate="no"`.

## Pruebas

| Prueba | Qué comprueba |
|---|---|
| `tests/i18n-keys.mjs` | Cada clave tiene inglés, mismos marcadores, sin español; ninguna clave sobra |
| `tests/i18n-coverage.mjs` | Todo texto español legible de `src/`, `index.html` y `recovery.html` sale en inglés; excepciones nombradas (ids de lugares de `world-families.js`); español intacto; cableado |
| `tests/i18n.mjs` | Idioma del sistema, partidas antiguas, automatización, guardado, Ajustes con escritura fallida, búsquedas |
| `tests/english_screens_smoke.py` | Inicio, cinco capítulos y seis lugares en inglés a 390×844: sin español ni texto cortado |
| `tests/english_panels_smoke.py` | Anillo, Lugares, Tu canción, chispa salvaje, menú, guía, libro, resultado y favoritos |
| `tests/english_menus_smoke.py` | Las trece hojas de menú en Viaje y Mundo libre; «Idioma / Language» sin traducir |
| `tests/language_choice_smoke.py` | Sistema en inglés y en español, partida antigua, cambio en Ajustes en ambos sentidos con el español restaurado exacto, recarga |

## Límites

- La comprobación de texto cortado mira el DOM. El texto del canvas se revisó en las capturas, no con una medida.
- Las búsquedas (favoritos, estilos, Bitácora) comparan con los nombres en español guardados en los datos: en inglés, buscar por el nombre inglés puede no encontrar.
- Algunas listas se ordenan con el orden alfabético español.
- El manifiesto de la app (`manifest.webmanifest`) y las metas de `index.html` para buscadores siguen en español: las fichas de tienda en inglés son de L5.
- Una etiqueta que un módulo compone leyendo texto ya traducido puede quedar mezclada si se cambia de idioma en mitad de la partida; se corrige al volver a dibujarse o al recargar. Las de cierre de hoja ya leen el español original.
- Revisión del inglés por una persona nativa: pendiente.
