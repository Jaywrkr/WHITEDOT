# Panel 05 · Ed Key y David Kanaga (Proteus) · segunda sesión, 24 de octubre

*Simulación respetuosa de su filosofía conocida. No es su opinión real; no hay citas. Principios y fuentes: `05-proteus.md`.*

**Aviso sobre la evidencia.** `00-inicio.png` no es lo que ve un jugador nuevo. Con Playwright, `navigator.webdriver` hace que `journeyDefault()` (`src/journey-mode.js:7`) elija «libre». Por eso sale la ventana vieja con «Día 1», «0 chispas» y «Rompe diez». Repetimos la captura ocultando `webdriver`: `frames/r2/a-inicio-real.png`. Tampoco nadie ha jugado esto salvo Jay.

## Qué mejoró desde el 22

- **La primera pantalla escucha.** En `a-inicio-real.png` se ve negro, un cubo, dos cristales y una palabra: «Pulso». Ni contadores ni ventanas. Es lo que pedimos.
- **El pulso ya no rompe por romper.** Solo un pulso a tiempo hace algo, y fuera de tiempo no pasa nada (`docs/MUNDO.md`, regla 1). El verbo dejó de ser extracción.
- **Los portales suenan.** El portal más cercano toca su nota en el «1», más fuerte cuanto más cerca (`places-ring.js`, `musicStep`). Es proximidad audible.
- **Cada capítulo tiene una textura propia.** Hay círculos en el Lago (`02`), líneas de lluvia en la Tormenta (`04`) y vacío de verdad en el Vacío (`05`). El color se gana bioma a bioma (`world-sheet.js`).
- **El cierre sale de la música que suena.** El filtro se cierra, hay medio tiempo de silencio y vuelve la misma música con algo más (F13). Eso es Dyad: no hay fanfarria aparte.

## Qué sigue mal

- **Tras el Viaje vuelve el juego de servicio.** El final llama a `setJourneyMode('libre')` (`journey-finale.js:55`). La primera pantalla del Mundo libre (`frames/r2/g-libre-salvaje.png`) muestra «Caminado · 0 m», «0 chispas», «Próximo salto · 0/20 ✦», «Estilos» y un logro con burla: «El Mundo no estaba listo. Tú tampoco». El silencio del final dura un segundo.
- **El Mundo salvaje es ahora relleno entre portales.** Su único sistema nuevo es una chispa dorada con temporizador de 30 s, cinco saltos, una flecha y tres avisos de texto («Una chispa salvaje.», «Se fue.», «Atrapada · +15 ✦») (`wild.js`). No suena por sí sola: no se encuentra con el oído, se persigue con la vista. Es un recado, no un encuentro.
- **El anillo calla casi todo el camino.** El radio es 6 000 px y el portal se oye a 1 800 (`PORTAL_HEAR`). Los primeros 4 200 px desde el Refugio no traen ninguna voz de portal. A medio camino entre dos portales, la ganancia es casi cero (`near²`). Solo suena un portal a la vez.
- **Entre portales no hay lugar.** `frames/r2/c-entre-portales.png` es un campo uniforme de burbujas y glifos de 10 px, sin hito ni horizonte. Las criaturas siguen siendo glifos diminutos (en todas las capturas).
- **La versión tranquila apaga el oro.** Cuando el bioma no tiene su color recuperado, el filtro `saturate(.12)` se aplica al canvas entero (`world-sheet.js:21`). En `20-anillo.png` y `23-salvaje.png`, los portales y la chispa salen grises.
- **Las estaciones existen, pero no se oyen.** `alive.js` cambia la estación de cada continente una vez por semana real. En una sesión nunca se nota. No hay un tiempo con forma en el Mundo.
- **Once lugares, una sola forma.** Todos tienen una barra arriba, un verbo, un objeto dorado y un último pulso. La línea de progreso aparece en todas las capturas de lugar. Es un catálogo de juegos de ritmo bien hechos, no once maneras de escuchar.

## Notas

| Eje | 22 oct | Hoy | Por qué |
|---|---|---|---|
| Visual | 6 | 6,5 | Los capítulos tienen textura; el Mundo libre sigue sin masa ni hitos y los glifos son diminutos. |
| Audio | 8 | 8,5 | Tema, cierres desde la música y portales con voz; el anillo calla en la mayor parte del trayecto. |
| Creatividad | 7,5 | 7,5 | Verbos rítmicos ingeniosos, pero once lugares con la misma plantilla de barra. |
| Sensación | 5,5 | 7 | «Solo a tiempo pasa algo» y la guía de ocho puntos hacen del pulso un gesto musical. |
| Cohesión | 4,5 | 6 | El Viaje es una obra; tras él vuelven las chispas, los saltos y la burla. |
| Pulido | 6 | 6,5 | La entrada es limpia y sin cuenta; el filtro gris se come el oro y hay aviso de texto en la exploración. |
| **Media** | **6,3** | **7,0** | |

## Tres acciones

1. **Que el final no se rompa al salir.**
   - *Qué:* el Mundo libre empieza en pantalla tranquila y la economía vive en el Refugio.
   - *Cómo:* en `journey-finale.js:55`, marca `j.finished`/`j.free` sin pasar a `'libre'`. En `narrator`, no dispares el logro «El Mundo» durante los 3 primeros minutos. En `world-sheet.js`, `pale()` devuelve falso si `freeOpen(S.journey)`; o excluye del filtro el oro dibujando portales y chispa en una capa aparte.
   - *Criterio:* tras los créditos no hay ninguna cifra ni ningún aviso hasta que el jugador abre el Refugio, y en la captura el oro de los portales mide `#f0d27a`.
2. **Cambiar la chispa salvaje por voces salvajes.**
   - *Qué:* un encuentro que se halla con el oído y que suma su voz a la mezcla.
   - *Cómo:* en `wild.js`, `spawn()` crea una fuente con `withSpatialVoice` (`spatial.js`) que canta un motivo de tres notas en la escala de la región cada dos compases. No hay aviso ni flecha durante los primeros 20 s. Cinco pulsos a tiempo cerca hacen que responda en tu rejilla y te siga hasta el borde de la región como voz extra. Las 15 ✦ se abonan en silencio en la Bitácora. Conserva `normalizeWild` y el contador `caught`.
   - *Criterio:* con la pantalla oscurecida, 3 de 4 personas la encuentran en menos de 45 s (`?prueba=1`), y los avisos de texto en la exploración son cero.
3. **Que el anillo sea un paisaje sonoro, no un único punto.**
   - *Qué:* oír todos los lugares abiertos, cada uno desde su dirección, desde el Refugio hasta su puerta.
   - *Cómo:* en `places-ring.js`, `musicStep` toca cada portal abierto en su propio paso del compás (índice → semicorchea) y no solo el más cercano en el «1». Ganancia con suelo: `max(.15, near²)`. `StereoPannerNode` según el ángulo. `PORTAL_HEAR ≥ RING_RADIUS + 1000`. En el centro, los portales ganados forman el acorde de «Tu canción».
   - *Criterio:* un render offline de un paseo del centro a un portal muestra el nivel de ese portal subiendo sin cortes. Además, con los ojos cerrados, 3 de 4 personas señalan la dirección correcta.

## Una decisión que solo Jay puede tomar

¿El Mundo libre tras el Viaje es «Todo a la vista» (chispas, saltos, narrador) o tranquilo por defecto, con la economía solo en el Refugio? Hoy el código elige «Todo a la vista». Nosotros elegiríamos tranquilo.
