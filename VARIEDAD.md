# Variedad actual: medición reproducible

El juego genera regiones de un mismo mapa continuo y compartido. «Mundos» aquí significa variantes de regiones, no partidas ni universos independientes. No existe un contador de experiencias perceptualmente únicas.

Medición en `feat/11-musical-mirrors`: `node scripts/world-variation.mjs 100`. Examina las 40.000 regiones con índices de -100 a 99 en ambos ejes, incluidos mares. La herramienta no modifica partidas.

| Medida | Resultado |
|---|---:|
| Regiones examinadas | 40.000 |
| Biomas presentes | 11 |
| Géneros electrónicos presentes | 52 |
| Combinaciones bioma + género + gravedad | 1.563 |
| Recetas discretas: anteriores + arquetipo + material + disposición + vidrios/espejos presentes | 21.031 |
| Combinaciones musicales: bioma + género + tempo + escala + instrumentos de bajo/melodía | 9.807 |
| Variantes detalladas de música, patrones, hábitat, suelo, aire y receta | 39.952 |
| Regiones terrestres | 23.418 |
| Instalaciones de tres vidrios | 7.218 |
| Instalaciones de espejos | 4.985 |

Estos números se superponen: no se suman. El último resultado no usa nombres, coordenadas, IDs, ángulos interactivos ni flotantes continuos para fabricar singularidad. Excluye más detalles, como especies individuales, afinaciones, acontecimientos y cambios temporales. Tampoco asegura que 39.952 variantes se sientan muy distintas al oído.

La muestra comparable anterior de 10.000 regiones tiene ahora 1.517 combinaciones básicas, 5.717 clases de recetas, 4.238 combinaciones musicales y 9.996 variantes detalladas bajo esta definición. La cifra previa de 10.000 recetas distintas utilizaba otra firma; no debe interpretarse como un incremento o una pérdida de contenido.

**Cifra comprobada actual: al menos 39.952 variantes regionales detalladas en esta muestra; el total del mapa no se ha enumerado.** Millones sigue siendo una posibilidad combinatoria y objetivo de diversidad, no un millón de experiencias diferentes ya comprobadas. Los hashes de 32 bits y las correlaciones entre categorías también impiden prometer singularidad absoluta para un mapa ilimitado.

El crecimiento seguirá con familias que cambien las acciones: cajas musicales, cuerdas, mecanismos y encuentros; cada incorporación usará su propio sorteo de presencia y comportamiento. Vidrios y espejos ya varían por región y conservan orientaciones de jugador. Las culturas, espejos combinados con vidrios, pistas encadenadas y cajas musicales siguen pendientes según PENDIENTES.md.
