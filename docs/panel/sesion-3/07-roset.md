# 3-07 · Conrad Roset, tercera lectura (24 oct, tarde)

> Simulación de su mirada de diseño a partir de su obra pública (ver `07-roset.md`). No es su opinión real. Sin citas.

Capturas: `3/` y las mías en `3-extra-rp/`. Medí el color con un script sobre los PNG.

## Notas

| Criterio | Sesión 2 | Hoy | Por qué |
|---|---|---|---|
| Visual | 6,5 | 7 | El cubo pesa más y el gris ya no apaga el oro. El tono ganado sigue siendo débil. |
| Audio | 8 | 8,5 | Tu canción es por fin la música del mundo, que crece. No la he oído. |
| Creatividad | 8 | 8 | Sin ideas nuevas. Bien: era el momento de pulir. |
| Sensación | 6,5 | 7 | Vibri, brillo dorado siempre y calibración. Las manchas siguen sin existir. |
| Cohesión | 6,5 | 7 | Viaje mudo con dedo fantasma; gris → color también en los lugares. |
| Pulido | 6,5 | 6,5 | Quedan «Rompe…» en el HTML y el narrador en avisos del Mundo libre. |
| **Media** | **7,0** | **7,3** | |

## Qué mejoró de verdad

- **El Viaje es mudo.** `chapterToast` no dice nada si `journeyQuiet()` y no hay ronda (`src/journey-games.js:13`). Lo sustituye un dedo fantasma tras 4 s sin tocar (`src/journey-hint.js:2-5`). Era mi acción 3.
- **El oro queda por encima del gris.** El gris se pinta en el lienzo antes de los juegos (`src/world-sheet.js:28`). Ya no se apaga lo ganado.
- **El gris llega a los lugares.** Una ronda del Jardín o la Cueva empieza gris (`pale: true`, comprobado) y se colorea al cerrar el tema a tiempo (`src/journey-pulse.js:78`). Es la idea de GRIS, ahora en todo el anillo.
- **`?anillo=1` siembra los cinco colores** (`journeyColors` devuelve los cinco). Lo pedí.
- **El narrador sale de la ronda.** Habla en la tarjeta (`src/places.js:101`), no encima del juego.

## Qué sigue faltando o salió mal

- **El tono no llega.** H1 prometía un lavado del 18–30 %. El código es un degradado radial centrado (`src/world-sheet.js:34`): 18–30 % solo en el centro, cae a cero. En el anillo (Bosque recuperado) el píxel central es (42, 51, 43). Solo el **9 %** de los píxeles no negros cae en el verde del Bosque. Mi criterio era ≥ 20 %. Lo cumple solo Faros (39 %), por su haz amarillo.
- **Los glifos no usan el tono.** Siguen con su paleta propia: motas azules y magenta en el anillo (capturas 20 y 23).
- **Ninguna mancha.** No hay marcas de mundo por pulso. La música solo deja rastro en la Línea. Mi acción 2 no se hizo.
- **«Rompe» sigue vivo.** `index.html:54` («Rompe diez cristales…»), `:198`, `:216` y `:231`. El verbo ya no es romper.
- **El narrador se cuela en el Mundo libre.** `announce()` pone la frase en el aviso (`src/achievements.js:14`). Jay decidió «solo en la tarjeta y la Bitácora». En mi captura aparece «3 logros nuevos · Bitácora» nada más entrar.
- **Al recuperar un lugar solo cambia el halo**, no el dibujo (por el código; no jugué una ronda entera para verlo).

## Mis tres acciones

1. **Lavado de pantalla, no halo.**
   - `src/world-sheet.js:34`: tras el halo, si el bioma está recuperado, un `fillRect` de todo el lienzo con su tono al 18 % y `globalCompositeOperation='soft-light'`; el halo encima.
   - Bien cuando: en `20-anillo.png` ≥ 20 % de píxeles no negros a ±20° del tono del bioma (el mismo script).
2. **Que el dibujo hable el tono.**
   - Glifos y decorados del bioma recuperado con `placeColor(id)` en vez de su paleta (`src/universe-layers.js:213` ya pasa `ink`; usarlo en los glifos).
   - Bien cuando: en el anillo no hay motas de otro matiz dentro del bioma.
3. **Limpiar la voz antigua.**
   - Reescribir `index.html:54,198,216,231` sin «Rompe». Quitar la frase del aviso en `achievements.js:14`: solo «Logro · título».
   - Bien cuando: `grep -n Rompe index.html src/onboarding.js` vacío y ningún aviso fuera de la tarjeta lleva frase del narrador.

## Decisiones de Jay

- **Umbral de ★★: 75 %.** Para mí las estrellas son color, y el color tiene que seguir llegando. Con el 85 % el jugador del 75 % pasa 85 min sin capa nueva: se queda en blanco y negro después de ganar. «Mejorar tu marca» no se ve en pantalla. 75 % sí.
- **Festival: solo el Viaje y su final.** Es lo que tiene arco: gris, cinco colores, cierre. El anillo es un segundo disco. Al jurado se le enseña una obra entera, no un catálogo.
