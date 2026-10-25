# El panel creativo de Kubono

Guía para repetir la auditoría. La [cuarta sesión](panel/sesion-4/informe.md) está completa sobre alpha.174; sus fases J1–J7 esperan la decisión de Jay. La próxima será la quinta, sobre las correcciones que autorice y sus evidencias. Los perfiles son simulados y las notas pueden subir o bajar.

## 1. Qué es

Un panel de **diez creadores reales, simulados**. Cada perfil mira Kubono con la lente de su obra pública (juegos, entrevistas, charlas). **No son sus opiniones reales** y cada documento lo dice al principio. Sirve para tener diez miradas de diseño distintas y exigentes, no para citar a nadie.

El panel no juega como una persona: lee el código, mira capturas de teléfono, ejecuta bots y modelos y mide. Lo que no puede saber lo dice («nadie lo oyó en un teléfono»).

## 2. Quiénes son y qué miran

| # | Perfil | Obra de referencia | Lente |
|---|---|---|---|
| 1 | Tetsuya Mizuguchi | Rez, Lumines, Tetris Effect | Sinestesia: ver, oír y sentir lo mismo en el mismo instante; latencia; tacto |
| 2 | Toshio Iwai | Otocky, Electroplankton, Tenori-on | La música como juguete; cada sonido una forma; que nunca suene mal |
| 3 | Masaya Matsuura | PaRappa, Vib-Ribbon | Ritmo; una sola línea; acierto con premio y sin castigo; Vibri |
| 4 | Simogo | Device 6, Sayonara Wild Hearts | El juego como disco: pistas en orden, clímax, última pista, final |
| 5 | Ed Key y David Kanaga | Proteus | El mundo que suena al recorrerlo; estaciones; densidad en vez de premio |
| 6 | Jenova Chen | flOw, Journey, Sky | Curva emocional; atención dirigida; ritmo de novedades (regla de 12 min) |
| 7 | Conrad Roset | GRIS, Neva | El color como progreso; imagen sin texto; cada pantalla una ilustración |
| 8 | Ken Wong | Monument Valley, Florence | Cada pantalla una lámina; los primeros minutos; legibilidad en teléfono |
| 9 | Lucas Pope | Papers, Please; Return of the Obra Dinn | Un verbo; legibilidad; reglas contables; menos sistemas y menús |
| 10 | Austin Wintory | Journey, ABZÛ, The Pathless | Un tema que crece con el jugador; silencio; el final musical |

Antes del panel hubo un **jurado de premios** de cinco perfiles (Marina, Ruth, Iñaki, Lucía y Tomás; ver `panel/sesion-1/expediente.md`). Sus notas aparecen como «Jurado (antes)» en la primera sesión. No hace falta repetirlo.

## 3. Cómo se puntúa

Seis ejes, del 0 al 10, con medios puntos:

| Eje | Qué juzga |
|---|---|
| Visual | Si cada pantalla se lee y se recuerda en un teléfono de 390×844 |
| Audio | La música, la mezcla y si el sonido orienta |
| Creatividad | Si la idea es propia y está a la vista |
| Sensación | Si el acierto se siente: tiempo, luz, tacto y sonido a la vez |
| Cohesión | Si todo sirve a una sola idea (tocar a tiempo) y a un solo arco |
| Pulido | Errores, textos, menús, rendimiento y pruebas |

La **media** de cada perfil es la media de sus seis notas. La fila del panel es la media de los diez. **Meta: 8,5 · 9 · 9 · 8,5 · 8,5 · 8,5 (media 8,7).**

## 4. Historial

| Sesión | Fecha | Versión | Visual | Audio | Creat. | Sensación | Cohesión | Pulido | **Media** | Plan que salió |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 22 oct | alpha.96 | 6,5 | 7,9 | 7,9 | 5,6 | 4,8 | 6,1 | **6,4** | Fases 0–9 (el Viaje, el pulso, quitar) |
| 2 | 24 oct | alpha.160 | 7,0 | 8,3 | 8,0 | 6,9 | 6,4 | 6,6 | **7,2** | G1–G7, construido como H1–H7 |
| 3 | 24 oct | alpha.167 | 7,3 | 8,5 | 8,2 | 7,3 | 7,1 | 6,9 | **7,5** | I1–I6 |
| 4 | 25 oct | alpha.174 | 7,7 | 7,8 | 8,4 | 7,7 | 7,7 | 7,3 | **7,7** | J1–J7 propuestas, sin ejecutar |

Lo que se construyó con cada plan está en [CAMBIOS](../CAMBIOS.md) (H1–H7, I1–I6) y en [El mundo](MUNDO.md).

## 5. Cómo se hace una sesión

### Paso 1 · Expediente

Un documento corto para el panel: versión y fecha; qué decidió Jay desde la última sesión; qué se hizo (fase por fase, con números medidos); qué sigue igual; lo que **no** se sabe (personas, teléfono real); capturas disponibles; archivos útiles. Modelos: `panel/sesion-2/expediente.md` y `panel/sesion-3/expediente.md`.

### Paso 2 · Material

- **Capturas de teléfono:** `OUT=carpeta python3 scripts/panel-capture.py` (Chromium y Playwright de Python). Saca 16 capturas a 390×844: entrada, cinco capítulos del Viaje, seis lugares, anillo, hoja Lugares, Tu canción y chispa salvaje. Simula un navegador normal; sin eso el juego abre el modo «Todo a la vista» de los navegadores automatizados y la captura engaña (error de la sesión 2).
- **Atajos de URL:** `?capitulo=`, `?lugar=` (`&maestro=1`), `?anillo=1`, `?festival=1`, `?prueba=1`, `?medir=1`. Lista en [El mundo · Herramientas de prueba](MUNDO.md#herramientas-de-prueba).
- **Acceso al estado:** las pruebas sirven `src/main.js` añadiendo `window.__r=runtime;`. Con eso se lee y se fuerza el juego (`__r.S`, `__r.openLugares()`, `__r.openSong()`, `__r.wildSpawn()`). `runtime` no existe en producción.
- **Modelo de dos horas:** `node scripts/play-curve.mjs` (y `--json`). Juega cuatro perfiles simulados (60 %, 75 %, 90 % a tiempo y sin sonido) y mide la victoria, las ★ y el mayor hueco sin que crezca la canción. Es un modelo, no personas.
- **Medidas propias:** cada perfil puede medir lo que necesite (píxeles del cubo, cuánto color hay en pantalla, retraso entre toque y nota) con Playwright. Guarda lo que midas junto a su análisis.

### Paso 3 · Diez análisis

Un archivo por perfil (`01-mizuguchi.md` … `10-wintory.md`), con esta forma:

1. Cabecera: «Simulación de su mirada… No es su opinión real.», versión, qué revisó.
2. **Notas:** tabla de los seis ejes con una frase de «por qué» cada uno, y la media (con la anterior entre paréntesis).
3. **Qué mejoró de verdad**, comprobado en el código con `archivo:línea` o en una captura.
4. **Qué sigue faltando o salió mal**, también con `archivo:línea` o medida.
5. **Qué haría ahora:** pocas propuestas, concretas, con dónde se tocaría.
6. Opinión sobre las decisiones pendientes de Jay, si las hay.

Regla: **todo hallazgo se verifica en el código o se mide**. Una frase de otro documento no basta.

### Paso 4 · Informe consolidado

Un `informe.md` con esta estructura (modelo: `panel/sesion-3/informe.md`):

1. **Notas:** tabla de los diez, fila «Hoy», filas de las sesiones anteriores y la meta. Una línea con lo que más subió y lo que más falta.
2. **En qué coinciden:** puntos numerados, cada uno con quién lo dijo y la prueba (`archivo:línea`, medida o captura).
3. **Decisiones pendientes de Jay:** solo lo que necesita su elección, con la opinión del panel y **una recomendación**.
4. **Plan:** fases con letra nueva (la cuarta propuso **J1–J7**; la siguiente conserva los IDs abiertos antes de proponer más), cada una con qué cambia, dónde y «Bien cuando:» (criterio medible). Primero lo que no necesita decisión.
5. **Ideas para más adelante** (sin consenso).
6. **Lo que ningún panel puede sustituir:** jugarlo con Luca y oírlo en un teléfono.

### Paso 5 · A Jay

Un resumen corto en español: la media nueva, las tres o cuatro cosas que más importan, las decisiones que le tocan y el plan. Jay decide; el panel no ejecuta.

## 6. Cómo escribir

- Español, frases cortas, una idea por frase. Sin jerga de diseño sin explicar.
- Cifras y nombres de archivo exactos. Nada de «parece» sin decir por qué.
- Separar siempre: **aprobado**, **construido**, **probado** (bot, captura) y **probado con personas**. Hoy nada está probado con personas.
- No inventar citas reales de los creadores.

## 7. Lo que Jay ya decidió (no reabrir)

- El verbo es **tocar a tiempo**. Nunca suena mal; solo a tiempo cuenta (y da chispas).
- **El Viaje** es el juego principal (Camino y cinco capítulos, ~15–20 min) y termina en el Refugio con tu canción; después se abre el Mundo libre.
- Once lugares en anillo, abiertos **en orden**. Se gana con los once; las 33 ★ son la versión maestra. ★ = fragmento de la capa del lugar, ★★ = capa entera, ★★★ = variación.
- **★★ al 75 %** a tiempo; **★★★ al 70 %** en la ronda Maestro.
- **Festival** (`?festival=1`) = el Viaje entero hasta los créditos, sin anillo, tienda ni remezcla.
- Narrador solo en la tarjeta de la ronda y en la Bitácora. Sin rótulos en el Viaje.
- Cuenta opcional; se juega sin ella. **La configuración de Supabase está en pausa**: no tocarla.
- La música (base electrónica mezclada con otras familias) le gusta a Jay: no se rehace.
- Nada ganado se borra; los guardados se migran.
- Mundo libre tranquilo por defecto: **no**.

### Nuevo, 24 de octubre: **el cubo pequeño**

A Jay **no le gusta el cubo grande; le gusta pequeño.** La I2 lo agrandó a 24–36 px en el Camino, el Mundo y los lugares porque el panel (Ken Wong, Mizuguchi) pedía verlo en el teléfono. Esa petición queda **rechazada**:

- El panel debe tomar el cubo pequeño como regla y **no volver a pedir que crezca**.
- La legibilidad se busca por otros medios: contraste, el brillo dorado al acertar, Vibri, la Línea, el halo o el color alrededor, nunca el tamaño.
- **Construido en alpha.174**, rama `fix/cubo-pequeno`, desde main 676ac511: 6–12 px de tamaño natural antes de pulsos y efectos temporales; las caras conservan el mínimo existente de 10 px. `CUBE_MIN`, `CUBE_MAX` y `cubeView` en `src/render.js` solo cambian el dibujo. El tamaño exacto lo confirma Jay en su teléfono.

## 8. Qué quedó abierto tras la tercera sesión

- **El cubo pequeño:** construido en alpha.174; aceptación física de Jay pendiente.
- **Perfiles modelados del 60 % y sin sonido:** según `scripts/play-curve.mjs`, no consiguen ★★ y pasan unos 80 minutos sin nuevas capas tras ganar. Sus notas y el mundo sí pueden variar; el modelo no mide abandono. Los perfiles de 75 % y 90 % no superan doce minutos entre capas.
- **Sin ritardando** en el final de Tu canción: el secuenciador del mundo no puede frenar una sola canción (I4).
- Hay feedback de Jay, incluido el rechazo al cierre musical. Faltan sesiones documentadas de nuevos jugadores y validación instrumentada de calibración, paneo, faro y final en teléfono. Guía: [Pruebas con personas](PRUEBAS_CON_PERSONAS.md).
- Ideas sin consenso: Libre que no se acaba y Tu canción tocable capa a capa (Iwai); el anillo como acorde (Proteus); pasar de un lugar al siguiente sin tarjeta (Simogo).

## 9. Petición para la siguiente sesión, tras las correcciones autorizadas

Copia esto en Codex o ChatGPT con el repositorio abierto:

> Lee `AGENTS.md`, `HANDOFF.md`, `docs/PANEL.md` y `docs/panel/sesion-4/seguimiento.json`. Cuando Jay autorice la reevaluación, haz la **quinta sesión** siguiendo la sección 5: captura con el hostname normal, mide y escribe diez análisis y el informe en `docs/panel/sesion-5/`. Compara con la cuarta, conserva el cubo pequeño y los criterios, y vuelve a cada ID. Solo cierra un hallazgo con su revisión, regresión y aceptación. Distingue bot, modelo, escucha física, CI y despliegue. La nota puede subir o bajar. No implementes otro plan ni contenido por hacer la auditoría.

## 10. Ciclo de cierre

La petición actual de Jay exige integrar lo existente antes de ampliar. El registro de la sesión 4 contiene ID, prioridad, evidencia, fase y criterio de cierre. Cada fase autorizada añade revisión y resultado de su regresión. La reevaluación conserva los abiertos; ni un commit, ni una nota mayor, ni un test aislado los cierra. La meta orientativa sigue en 8,7, acompañada de candidato verde y aceptación humana; no hay garantía de un 10 simulado.

## 11. Archivo

- [Sesión 1](panel/sesion-1/informe.md) · [expediente](panel/sesion-1/expediente.md) · diez análisis en `panel/sesion-1/`.
- [Sesión 2](panel/sesion-2/informe.md) · [expediente](panel/sesion-2/expediente.md) · diez análisis en `panel/sesion-2/`.
- [Sesión 3](panel/sesion-3/informe.md) · [expediente](panel/sesion-3/expediente.md) · diez análisis en `panel/sesion-3/`.

- [Sesión 4](panel/sesion-4/informe.md) · [expediente](panel/sesion-4/expediente.md) · [registro de 14 hallazgos](panel/sesion-4/seguimiento.json) · diez análisis y evidencia reproducible en `panel/sesion-4/`.

Los expedientes y análisis citan rutas y versiones de su día (por ejemplo `3-extra-mz/`). Esas capturas no están en Git; se rehacen con `scripts/panel-capture.py`.
