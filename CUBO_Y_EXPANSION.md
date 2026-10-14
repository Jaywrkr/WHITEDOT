> Estado posterior: **1.1.0-alpha.10**, diez ramas del universo vivo. [Entrega y validación](ENTREGA_UNIVERSO_VIVO.md), [cobertura y pendientes](COBERTURA_150_UNIVERSO.md). El contenido que sigue conserva el contexto original de este documento; sus cifras/pendientes históricos no sustituyen el estado nuevo. Para continuar en Claude, leer primero [HANDOFF_CLAUDE.md](HANDOFF_CLAUDE.md).

# El cubo toca el mundo + expansión (rama `feat/expansion-fase-06`)

Entrega de Claude **integrada por #77 en main8096c8d**. **Incluye las dos ramas anteriores** (`feat/phase-04-materia-y-compartir` y `feat/laboratorio-y-fase-05`): basta con hacer merge de esta.

## 1. El cubo es lo único que interactúa (hecho)
- El dedo solo **mueve el cubo** y, con un toque, **lanza el pulso desde el cubo**. Ya no se manipulan objetos con el dedo.
- Modo dedo solo para pruebas: `?dedo=1` o automatización (`navigator.webdriver`). Así las pruebas viejas siguen pasando. Módulo `src/body.js` (posición, velocidad, quietud del cubo y utilidades de contacto).
- **Cuerdas**: el cubo cruza una cuerda despacio y la engancha; empujar la tensa y **suena al tensarse** (tres niveles); atravesarla o salir por un lado la suelta con su tensión; cruzar rápido rasguea.
- **Prisma**: se gira **rodeándolo** con el cubo (anillo de 30–118 px). Cada cristal que se enciende suena al momento; **los cristales encendidos ahora se ven**: haz de color hasta el cristal, halo, rombo lleno y destello. Al salir del anillo suena el acorde.
- **Membrana**: entrar golpea (más fuerte si llegas rápido); quedarse encima redobla.
- **Espejos**: el cubo **empuja** un espejo como puerta giratoria. **Conectar la luz al receptor ahora se nota**: acorde que sube con bajo, destello de color en todo el lugar, la luz corre por el camino y queda una capa sonando cada compás mientras siga conectado.
- **Vidrios**: pasar por el asa de un aro lo engancha; rodear el centro lo arrastra.
- **Aves**: el cubo pasa por un ave = tu llamada. Toque muy visible: anillo dorado, nota que sube, color en el fondo; aviso «Te contestan en dos compases…» y la respuesta llega con hilos de luz hasta el cubo.
  - **Formación (nuevo)**: si confían y te mueves, te siguen 45 s y repiten tu llamada mientras viajas.
  - **Grullas**: más grandes (cuello y patas), notas más fuertes y ondas en el suelo.
  - **Ave lira**: cola de lira dorada; **copia lo último que tocaste en cualquier parte**, con adornos.
- **Flora**: el cubo la riega al tocarla.
- **Encuentros (10 familias)**: adaptador de cuerpo. Entrar con el cubo = tocar; moverse dentro = moldear (como arrastrar); salir = soltar. Las ediciones finas de dedo (partes de la caja, hilos de la tejedora) quedan solo en modo dedo: **revisarlas en el Laboratorio**.
- Juguetes: ya respondían al choque; textos actualizados.

## 2. Quitado
- **Jardín modular** y **Rastro musical** (módulos, pruebas y entradas del Laboratorio). Las partidas que los tenían no se rompen (los datos viejos se ignoran).

## 3. Expansión (hecho)
- **Más colores**: paleta viva de 36 muestras aplicada al dibujar (`src/visual.js`: `SWATCHES`, `installVivid`). Rojos, naranjas, rosas, blancos (perla, nieve, marfil), cianes, violetas y verdes; el amarillo es una muestra más. **No cambia datos de lugares** (las pruebas de huella siguen iguales).
- **Atmósfera de color**: nubes del color del lugar detrás de todo; suben con la quietud y con los logros (`colorPulse`).
- **Quietud viva** (`src/quietud.js`): quedarte en un sitio avanza por etapas: 20 s color · 50 s voz nueva del lugar · 90 s visitas (luces que orbitan y las bandadas confían) · 140 s giro (barrido de filtro, variante y más experimental) · 200 s regalo (caja misteriosa) · 300 s ritual (lugar «escuchado»: al volver empieza más adelante). Anillo dorado alrededor del cubo marca cuánto falta.
- **Música experimental** (`src/expansion-music.js`, `src/experimental.js`): ~22 % de regiones con nivel >0.3 y ~7 % sin pulso. Depende de semilla propia, bioma, aire, anomalía, hora (noche) y quietud. Modos: Sin pulso (eventos fuera de la rejilla, crescendos al revés), Métrica impar (ciclos 3/5, 4/7, 5/11, 5/13), Fallas (ráfagas cortadas) y Microtonos (racimos desafinados que laten). ≥0.7 calla batería y pista; 0.4–0.7 la batería se deshace. Interferencias de color sutiles en esas zonas.
- **Cajas misteriosas** (`src/cajas.js`): ~4 % de chunks + regalos de la quietud. El cubo las abre. Poderes temporales (no se guardan):
  - **Campo de escucha** (150 s): calla la música del lugar; un brazo gira una vuelta por compás y toca solo lo que está dentro del campo.
  - **Cometa** (90 s): velocidad ×2.2 y estela que suena.
  - **Brújula** (180 s): flechas en el borde hacia cajas, materia, aves lira (y santuarios cuando existan).
  - **Imán** (120 s): lo pequeño te sigue en órbita y suena por turnos.
  - **Pincel sonoro** (120 s): tu camino deja notas que se repiten cada dos compases.
  - **Compañero** (240 s): una luz te sigue, contesta lo que tocas y apunta a lo raro.

## Pruebas
- Node: 52 suites PASS (`npm test`).
- Navegador nuevas: `tests/cuerpo_smoke.py` (solo el cubo toca), `tests/expansion_smoke.py` (caja, campo, cometa, quietud, zona experimental).
- `tests/offline_smoke.py`: cobertura de módulos OK; la última aserción falla igual en `main` (entorno).
- **No se corrió la suite completa de navegador** en esta entrega (falta de tiempo). Hacerlo antes de V1.

## Lista original para Codex (estado actualizado en FASE_06.md)

Esta rama resuelve los primeros bloques culturales, Vasto, auto visible, laboratorio y golondrinas. Teléfono real sigue pendiente; resultados y límites en [FASE_06.md](FASE_06.md). El texto siguiente conserva lo solicitado al cerrar Claude, no una lista de funciones que aún falten todas.
1. **Fase 6 · Culturas y búsquedas** (no empezada): 6–8 culturas originales inspiradas en tradiciones reales (andina pentatónica, gamelan/pelog, campana africana 12/8, maqam hijaz, joik nórdico, raga, in japonés, cumbia), cada una con escala, instrumentos, ritmo, colores y glifo. Santuarios (~12 % de regiones, semilla propia) con **guardianes** originales que te enseñan una canción-llave; **pistas encadenadas** hacia una **puerta musical** en una región vecina que se abre tocando con el cubo sus piedras en orden; dentro, **reliquias / instrumentos dormidos** que se coleccionan (cadena de 3 por cultura). La brújula ya acepta `runtime.cultureTargets()`.
2. **Mundo más grande**: añadir layout `vasto` (REG 20 → regiones de 18 000) en `world-identity.js` (layouts permitidos), `progress.js` (parámetro layout), `data.js` (getter REG), `seeds.js` (opción y por defecto en «Otra semilla»), `previewKey`. La partida principal no se toca.
3. **Modo auto visible**: botón en el dock que activa el paseo con dirección aleatoria (hoy está escondido en Favoritos: `startAutopilot('wander')`), que gire suave, esquive el mar y cambie de rumbo cada 40–90 s; tocar el joystick devuelve el control.
4. **Laboratorio**: añadir cajas y poderes, zona experimental y quietud; revisar textos de «qué probar» ahora que todo es con el cubo.
5. **Escuchar en el teléfono**: volumen de espejos conectados, grullas, campo de escucha y zonas experimentales; que nada sature.
6. Ideas con golondrinas (Jay pidió más): carreras de formación (si mantienes la formación 2 min, abren una caja), bandadas que se cruzan y mezclan llamadas, golondrinas que señalan cajas cuando confían.
7. Correr `npm run test:browser` completo y ajustar pruebas viejas que dependan del dedo si algo cambió.
