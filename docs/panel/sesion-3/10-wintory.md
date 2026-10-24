# 3-10 · Austin Wintory (simulación) · tercera sesión, 24 de octubre

> Simulación de su mirada (un tema que crece con el jugador). No es su opinión real ni contiene citas. Leí el código de alpha.167, las capturas de `3/` y ejecuté `play-curve` y `song-tiers`. No oí ningún render ni un teléfono: lo que digo del sonido sale de leer la partitura.

## Notas

| Criterio | Sesión 2 | Hoy | Por qué |
|---|---|---|---|
| Visual | 7,5 | 7,5 | Los anillos (`22`) no muestran el nivel de ★ de cada capa. |
| Audio | 8 | 8,5 | Las ★ cambian la música. El tema sigue siendo un aviso. |
| Creatividad | 8 | 8,5 | Portales y chispa que se oyen desde su lado. |
| Sensación | 7 | 7,5 | Calibración y el lugar que canta su patrón. |
| Cohesión | 6,5 | 7,5 | «Tu canción» es la música del mundo con tus capas. |
| Pulido | 7 | 7 | Notas del final sin ritmo y quizá fuera de tono. |
| **Media** | **(7,3)** | **7,8** | |

## Qué mejoró de verdad

- **Desapareció el house aparte.** El secuenciador del mundo añade tus capas sobre el acorde que suena (`src/song-stage.js:66-69`, `songChord` en `src/song.js:33`). Era mi queja principal.
- **Las ★ suenan.** ★ = un compás sí y otro no; ★★ = la capa entera; ★★★ = variación (`src/song.js:38-41`). En Faros: tres notas del tema, el tema entero o el tema a la octava (`src/song-stage.js:37`).
- **El final es más largo y lleva notas tuyas.** 11 compases de entradas, un compás por lugar con tus notas, 4 de tema y 2 de cola (`src/song-stage.js:14`, `:28-31`). Unos 55–70 s a 96 BPM; menos a tempos rápidos.
- **Se puede llegar:** con 11 ★ (`src/song-stage.js:87`), hacia el minuto 36 al 75 %.

## Qué sigue faltando o salió mal

- **El tema se repite, no se desarrolla.** Cada acierto toca la siguiente nota del tema (`src/journey-pulse.js:75-77`). Cada cierre lo toca entero (`src/journey-victory.js:40-43`). En el final, la capa de Faros lo repite cada dos compases desde el compás 8 (`src/song-stage.js:37`). En su momento (`:39`) ya no es noticia.
- **«Tus notas» no son tuyas del todo.** Se guardan solo las alturas (`src/places.js:90`) y se tocan en corcheas iguales (`src/song-stage.js:38`). El final del Viaje sí conserva tu ritmo (`src/journey-finale.js:23`).
- **Posible choque de tonalidad.** Esas notas se guardan con la escala del lugar (`journey-pulse.js:75`) y se tocan sin adaptar sobre el acorde del mundo en ese momento (`song-stage.js:38`). No lo he oído.
- **Faltan cinco lugares.** El final lee `S.lugares.notes`. Las notas de los capítulos del Viaje viven en `S.journey.notes` (`src/journey-chapters.js:87`). Sin repetir esos capítulos, se oyen notas de seis lugares.
- **No hay apoteosis.** No hay un compás de silencio. No hay chelo. El tema suena una sola vez, en onda cuadrada, dos octavas arriba y flojo (`song.js:68`, `song-stage.js:39`), bajo once capas. El final del Viaje (`journey-finale.js:31`: tema dos veces, la segunda una quinta arriba) sigue siendo más grande. Corrijo la sesión 2: tampoco usa el chelo, toca con `songNote`, onda cuadrada (`journey-finale.js:45`).
- **La variación ★★★ es mecánica.** Octava arriba y eco dos semicorcheas después, igual en los once lugares (`song.js:39-40`).
- **Once voces solistas.** `VICTORY_LEADS` no cambió (`journey-victory.js:7`). La Cueva sigue con patrones al azar (`journey-echo.js:14`), no con el tema.

## Tres acciones

1. **Notas tuyas de verdad, de los once lugares.**
   - Cómo: en `places.js:90`, guardar el grado (`state.degree`) y el paso del compás, no la altura. En `song-stage.js`, sumar las notas de `S.journey.notes`/`steps` de los cinco capítulos. Tocarlas con `themePitch(grado, escala actual)` y con `noteLengths`.
   - Bien cuando: una prueba Node con un guardado que solo tiene el Viaje da notas de 11 lugares, todas en la escala actual.
2. **Una apoteosis de verdad.**
   - Cómo: en `song-stage.js`, durante el final, Faros calla el tema hasta `themeAt`. Un compás de silencio con el `hush` de `journey-victory.js`. Después el tema con `playCello`, dos veces, la segunda una quinta arriba, y un ritardando de dos compases.
   - Bien cuando: dura 60 s o más a 120 BPM. En el render, el chelo queda por encima de las capas. Hay dos enunciados del tema en el final y ninguno antes.
3. **Racionar el tema y darle una sola voz.**
   - Cómo: en `journey-victory.js`, el tema entero solo con una ★ nueva; en el resto de cierres, solo la capa. Una voz: `playCello` en vez de `VICTORY_LEADS`. En `journey-echo.js`, la Cueva canta prefijos del ritmo del tema (de 2 a 5 notas), y el último eco de Maestro es el tema entero.
   - Bien cuando: un contador da cuatro enunciados completos o menos por ronda.

## Decisiones de Jay

- **Umbral de ★★: 75 % (y ★★★ al 70 %).** Con 85 %, la canción del jugador medio no crece durante 84 min tras ganar (`play-curve`). «Mejorar tu marca» no está en el modelo y no dice nada de escuchar.
- **Festival: solo el Viaje.** Su final, con tus notas y tu ritmo, es hoy el mejor momento musical del juego. Hasta que el final de las 11 ★ lo supere, el jurado debe oír el Viaje.
