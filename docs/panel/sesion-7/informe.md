# Séptima auditoría · entender, escuchar y continuar

**Panel simulado. No opiniones reales de creadores, jurado humano ni escucha del auditor.** Revisión integral del sistema, no solo de los tres comentarios nuevos. [Expediente](expediente.md), diez análisis y [notas calculadas](evidencia/notas.json).

## Nota

| Lente | Visual | Audio | Creatividad | Sensación | Cohesión | Pulido | Media |
|---|---:|---:|---:|---:|---:|---:|---:|
| Mizuguchi | 8 | 7.5 | 8.5 | 8 | 7.5 | 7.5 | 7.83 |
| Iwai | 8 | 7 | 8.5 | 8 | 7.5 | 7.5 | 7.75 |
| Matsuura | 8 | 7.5 | 8.5 | 8 | 8 | 7.5 | 7.92 |
| Simogo | 7.5 | 6.5 | 8.5 | 7.5 | 7 | 7.5 | 7.42 |
| Proteus | 8 | 8 | 8.5 | 8 | 7.5 | 8 | 8.00 |
| Jenova Chen | 7.5 | 7 | 8.5 | 7.5 | 7 | 7.5 | 7.50 |
| Conrad Roset | 8 | 7.5 | 8.5 | 8 | 7.5 | 7.5 | 7.83 |
| Ken Wong | 8.5 | 7.5 | 8.5 | 8 | 7.5 | 7.5 | 7.92 |
| Lucas Pope | 8 | 7.5 | 8.5 | 8 | 7.5 | 7.5 | 7.83 |
| Austin Wintory | 7.5 | 6.5 | 8.5 | 7.5 | 7 | 7.5 | 7.42 |

**Referencia actual: 7.74/10, resumida 7,7.** Evalúa alpha.187 con la nueva prueba real de Jay. El 7,9 anterior era técnico y provisional; no sobrevive como aceptación del cierre que Jay acaba de rechazar. El audio del universo le sigue gustando: la objeción es al final5. Alpha.188 corrige causas verificables; hasta que se pruebe no se le inventa una nota superior.

## Lo que ya funciona y se conserva

- Menú: Continuar, tres destinos y secundarios plegados; Jay acepta su organización (`index.html:147–170`). No rehacerlo.
- Once juegos con reglas y puertas en orden, estrellas distintas de moneda (`src/places.js:14–54`).
- Economía ×1/×2/×3 y rondas con guardado antes del premio (`src/spark-rules.js`; `src/places.js:105–118`).
- Casa musical recorrible y tarjetas con uso creativo real: cuatro voces de jardín y brote (`src/collection-garden.js:7–10`).
- Avisos con cola/prioridad/caducidad (`src/notice-lane.js:26–71`); no reemplazarla por nuevos popups.
- Generación y arte existentes. No hace falta añadir biomas, instrumentos ni sistemas para resolver esta revisión.

## Problemas verificados

1. **U05 · Rumbo y botones, P1.** Nombre/distancia estaban abajo y la flecha en otro punto. K7 pone brújula a48px del cubo, nombre/metraje90px arriba, sin área táctil. Sigue el pequeño adelanto de cámara; un favorito o la casa ocultan la sugerencia del anillo. Seguir al anillo cancela el destino anterior (`src/places-ring.js`, `styles/estilo-j.css`).
2. **A04 · Final5, P1, aceptación reabierta.** K3 adaptaba escala pero retenía bajo cuadrado, ácido Q9, pad de sierra y registro elevado (`src/song.js:60–64`, revisión anterior de `journey-finale.js`). No hay evidencia de dos camas permanentes: `audio.js:214` corta el secuenciador. K7 sustituye solo ese arreglo por voces suaves existentes, frase en52–76, notas de acorde, huecos entre frases y pulso electrónico contenido. No modifica MIDI guardado, radio ni síntesis. Escucha de Jay pendiente.
3. **U13 · Destino tras el final, P1.** Antes, esperar/omitir quedaba en casa; solo Explorar salía. Las tres vías ahora comparten salida al Mundo y rumbo a Jardín. Festival conserva su comportamiento. Si no se guarda el cierre, el overlay sigue abierto y permite reintento (`src/journey-finale.js`).
4. **U10 · Aprender los lugares, P1.** Jardín exige círculo≤44 para sembrar/cosechar, alcance≤95 para regar y alternar golpe/«y» (`src/journey-garden.js:23–29,48,62`). La Línea no distingue esos verbos (`journey-pulse.js:105–108`). Un pulso correcto sin efecto no explica el motivo. Próxima mejora: enseñar el gesto con la planta próxima, retirarse tras comprenderlo. No cambiar reglas.
5. **U11 · Ayuda perdida, P1.** `chapterToast/sayOnce` marcan como visto antes de mostrar; una cola rechazada/caducada puede perder la explicación (`src/journey-games.js:13–16`). Marcar por presentación real y permitir repetirla, sin convertir cada error en un aviso.
6. **D05 · Favoritos editados, P1.** Renombrar, borrar y notas ignoran fallo de escritura (`src/favorites.js:42–43,54`). Hay patrón de rollback en rondas/Prisma. No se demuestra una pérdida real: sí un contrato de persistencia incompleto.
7. **A05 · Tu frase por ronda, P2.** `places.js:116` toma últimas8 del buffer global; inicio de ronda no lo delimita. La nota que cierra se añade después de `journeyGamePulse` (`journey-pulse.js:83,90`). Puede mezclar notas anteriores u omitir la última. Delimitar por ronda y conservar archivos viejos.
8. **U12 · Diálogos dinámicos, P2.** Final5 se crea fuera de la lista inicial de accesibilidad (`src/accessibility.js:5,41`). Revisar foco, teclado y lectura para final5/final11; conservar los menús que ya lo hacen bien.

## Próxima fase recomendada

**L1 · Aprender jugando**, empezando por Jardín: demostración breve con sus plantas, distinguir sembrar/regar, respuesta contextual cuando un gesto válido no hace nada y ayuda recuperable. Meta: conseguir la primera flor sin explicación externa. Después aplicar el mismo criterio a los otros lugares, sin agregar otro tutorial permanente.

Luego L2 frase propia, L3 fiabilidad/accesibilidad y L4 aceptación completa. [Plan por ramas y criterios](plan.md). Son propuestas; esta entrega no las implementa automáticamente.

## Muestra visual actual

Se capturaron16 estados nuevos a390×844: inicio, cinco capítulos, seis lugares, anillo, Lugares, canción y chispa salvaje. Normal hostname y webdriver=false, sonido iniciado, cero errores de página. [Manifiesto](evidencia/capturas.json). Se conservan muestras de [inicio](capturas/00-inicio.png), [Jardín](capturas/10-lugar-jardin.png), [Lugares](capturas/21-lugares.png), [canción](capturas/22-cancion.png) y [brújula móvil](capturas/brujula-390.png). El resto de imágenes temporales no viaja con el repositorio.

## Cierre y evidencia

[Verificación K7](evidencia/verificacion.json) distingue pruebas técnicas y escucha. A04, V01 y P01 siguen abiertos a aceptación. U07 incorpora la opinión favorable real del menú, sin certificar cinco sesiones. Los huecos de80,1/81,8min del modelo60%/sin sonido no prueban aburrimiento: no justificar contenido nuevo por esa cifra.
