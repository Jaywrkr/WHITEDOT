# Jenova Chen lee Kubono · segunda sesión, 24 de octubre (simulación)

*Simulación respetuosa de su filosofía conocida (flow, curva emocional, atención dirigida). No es su opinión real; no hay citas. Fuentes: `06-jenova-chen.md`.*

**Aviso.** `00-inicio.png` es un efecto de la automatización: `navigator.webdriver` hace que el juego arranque en «libre» (`journey-mode.js:7`). La entrada real es `frames/r2/a-inicio-real.png`.

## Qué mejoró desde el 22

- **Hay una curva y tiene final.** Camino, cinco capítulos con un sentimiento cada uno y el Refugio, que toca tu viaje (`docs/VIAJE.md`, `journey-finale.js`). La Tormenta es el pico medido y el Vacío el valle (tabla de densidad de la Fase 7).
- **Los primeros 10 segundos dirigen la atención.** Negro, un cubo, un cristal y «Pulso» (`a-inicio-real.png`). No hay cuenta. Es lo que pedimos.
- **El flow se cuida sin números.** La guía de ocho puntos (F14), la barra que late si no tocas en 5 s (F12) y el dedo fantasma enseñan sin texto. Fuera de tiempo no se castiga.
- **El final cierra.** «Tu canción» junta una capa por lugar (`22-cancion.png`). Ganar significa oír tu música entera. Esa meta es emocional, no contable.

## La curva real de las primeras 2 horas

Intensidad de 0 a 4, leída del código y de las duraciones del expediente, no de personas.

| Min | Qué | Int. | Lectura |
|---|---|---|---|
| 0–3 | Camino, 10 cristales | 1→2 | Soledad, bien |
| 3–16 | Llanura → Lago → Bosque → Tormenta → Vacío | 2·3·3·4·0 | Arco correcto, pero son cinco veces «llenar la barra»: la forma se repite |
| 16–17 | El Refugio toca tu viaje, créditos | 4→0 | El pico del juego |
| 17 | Mundo libre «Todo a la vista» (`journey-finale.js:55`) | **cae** | Contadores, «Estilos» y un logro que se burla: «El Mundo no estaba listo. Tú tampoco» (`frames/r2/g-libre-salvaje.png`) |
| 17–20 | Del centro al portal: 6 000 px | 1 | No se ve ningún portal; solo una flecha. El portal se oye a partir de 1 800 px |
| 20–35 | Rondas de los 5 lugares ya vistos en el Viaje + Jardín | 2, plano | El mismo verbo otra vez, para el ★★ |
| ~35 | **Muro de 6 ★** | **0** | Ver abajo |
| 35–90 | Dunas, Cristales, Faros, Ruinas, Cueva (solo quien llega al 85 %) | 3 a saltos | Un verbo nuevo cada ~12 min: bien |
| 90–130 | Los últimos 9 ★ son rondas Maestro de lugares ya conocidos | 2, plano | 40 minutos de repetición antes del clímax |
| ~130 | 33 ★: «Tu canción» completa | 4 | El clímax llega tarde y después de una meseta |

**Dónde se cae:**
- **El muro de 6 ★.** Sin un 85 % a tiempo solo se gana ★ (`places.js:22`, `RHYTHM_STAR=.85`). El Viaje da 5 y el Jardín 1: eso son 6. Las Dunas piden 8 (`places.js:14`). El jugador simulado de referencia del expediente toca al 75 %: **se queda bloqueado a los ~35 minutos**. Un jugador sin sonido también. Es lo contrario de flOw: el umbral es fijo y no se adapta a la persona.
- **El paso del final al Mundo.** El momento de más emoción da paso, en un segundo, al momento de más ruido.
- **La meseta Maestro.** Para pasar de 24 a 33 ★ hay que repetir con una ventana más estrecha (`MAESTRO_WINDOW=.06`). No hay nada nuevo que ver ni que oír.
- **Dieciséis clímax con la misma forma.** Barra llena, objeto dorado, último pulso. F13 varía la música, pero el gesto es siempre el mismo.

## Notas

| Área | 22 oct | Hoy | Por qué |
|---|---|---|---|
| Visual | 6,5 | 7 | La entrada y los capítulos tienen intención; desde el Refugio no se ve ninguna meta. |
| Audio | 8 | 8,5 | Llegada, Pertenencia, Plenitud y cierres desde la música; falta la intensidad que sube al acercarse a un portal. |
| Creatividad | 8 | 8 | Once verbos rítmicos y una canción que se arma: sólido, sin un momento nuevo tras el Viaje. |
| Sensación | 5,5 | 7 | Tocar a tiempo y la guía de puntos dan flow; el Maestro lo estrecha sin adaptarlo. |
| Cohesión | 4,5 | 6 | El Viaje dirige la atención; el Mundo libre vuelve a repartirla. |
| Pulido | 6 | 6 | El muro de 6 ★ es un fallo de diseño que bloquea; nadie lo ha probado con personas. |
| **Media** | **6,4** | **7,1** | |

## Tres acciones

1. **Quitar el muro: escalera alcanzable y estrellas que se adaptan.**
   - *Cómo:* en `places.js:14`, `need` pasa a 5·6·7·8·9·10. Con solo ★ se llega a la Cueva, y las 33 ★ siguen pidiendo maestría. Además, ★★ también se gana superando tu mejor porcentaje del lugar por 10 puntos tras tres rondas (`roundStars`, nuevo campo normalizado `best`).
   - *Criterio:* en `tests/places.mjs`, un jugador simulado al 60 % abre los 11 lugares. `?prueba=1` no registra ninguna sesión parada más de 10 min sin un lugar nuevo abierto.
2. **Proteger el pico y dar la montaña.**
   - *Cómo:* en `journey-finale.js:55`, deja el Mundo libre en modo tranquilo hasta entrar en el primer portal. En el narrador, ningún logro durante 3 min. En `places-ring.js`, cuando el portal siguiente (`nextPortal`) está fuera de la pantalla, dibuja una columna de luz dorada en la dirección del portal (no solo la flecha del borde). Su nota suena con suelo de ganancia desde el Refugio.
   - *Criterio:* 4 de 5 personas entran al Jardín en menos de 90 s tras los créditos sin leer nada, y no hay ninguna cifra en pantalla hasta entonces.
3. **Medir y romper las mesetas de la curva.**
   - *Cómo:* amplía `scripts/journey-curve.py` para simular 2 h con perfiles al 60, 75 y 90 %. Para cada uno, saca por minuto qué es nuevo (verbo, lugar, capa) y marca los huecos de más de 12 min. Con eso, cada ★★★ añade una variación audible de la capa del lugar en «Tu canción» (`song.js`) y cada 8 ★ el Refugio toca la canción parcial.
   - *Criterio:* ningún perfil pasa más de 12 min sin novedad. La curva simulada, dibujada junto a la de `docs/VIAJE.md`, se compara después con 6 sesiones reales.

## Una decisión que solo Jay puede tomar

La escalera de estrellas (5·8·12·16·20·24) la aprobó Jay el 23 de octubre. Bajarla, o dejar que ★★ se gane por mejora y no solo con un 85 %, cambia ese diseño. Lo decide Jay.
