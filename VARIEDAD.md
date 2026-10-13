> Estado tras Claude/fase 6: el generador mantiene 11 biomas, 33 hábitats y 52 estilos; Vasto cambia la extensión, y los ocho estudios culturales son encuentros nuevos. Esta medición anterior no los contabiliza. Claude retiró el jardín modular/rastro anteriores. Para el inventario vigente, ver [FASE_06.md](FASE_06.md) y [ESTADO_ACTUAL.md](ESTADO_ACTUAL.md).

# Variedad: mediciones y alcance vigente

Main e27c219 mantiene 11 biomas y 52 estilos. Fase 3 añadió cuatro timbres/arcos de reproducción y fase 4 gestos/color, sin cambiar el ADN del generador. Los conteos de abajo son auditorías históricas de recetas: no canciones únicas ni mediciones nuevas de diferencia audible. [Cifras del código y evidencias](ESTADO_ACTUAL.md).

## Fase 2 · Paisajes vivos y medición grande

La revisión de [registros musicales y figuras](REVISION_REGISTROS.md) no amplía estos conteos: cambia el arreglo audible de los estilos existentes sin modificar las recetas del generador.

Los 11 biomas base y 52 estilos permanecen; se agregan 33 perfiles de hábitat y seis familias de materia musical. La generación Original conserva exactamente las cifras anteriores.

Auditar ambas generaciones con `npm run audit:universe -- 10000 4 1 classic` y `npm run audit:universe -- 10000 4 2 classic`. En 40.000 candidatos, el vivo presenta 39.998 firmas detalladas; vecinos terrestres con bioma coincidente 57,2 % (original 9,7 %), género coincidente 34,0 % (original 14,8 %). [Resultado vivo](scripts/phase-02-universe-sample.json) y [original](scripts/phase-02-original-sample.json).

`npm run audit:universe -- 250000 4 2 classic` muestreó un millón de candidatos: **999.512 recetas detalladas distintas** y **586.200 firmas musicales terrestres**, según [la firma discreta del auditor](scripts/phase-02-million-sample.json). No cuenta canciones, mundos completos ni diferencias perceptuales, y la firma nueva incluye variables ecológicas/arquitecturas ausentes en v1. Mantener cachés acotadas hace viable recorrer nuevas regiones; no declara el universo infinito literal. [Alcance y límites](FASE_02.md).

## Fase 1: auditoría y conservación del generador

El generador actual se mantiene. Repetir `node scripts/world-variation.mjs 100` conserva exactamente los resultados de 40.000 regiones descritos debajo. La nueva herramienta `npm run audit:universe -- 10000 4` mide otras firmas discretas (incluye patrones/secuencias) entre cuatro semillas: 39.880 firmas detalladas y 24.350 firmas musicales terrestres en 40.000 candidatos. [Resultado reproducible](scripts/phase-01-universe-sample.json) y [método/límites](FASE_01.md).

Son muestras y firmas distintas: no compararlas como crecimiento de variedad ni como canciones únicas. El auditor admite hasta un millón de candidatos; todavía no se ha añadido ningún bioma o género nuevo en fase 1.

# Variedad actual: medición reproducible

El juego genera regiones de un mismo mapa continuo y compartido. «Mundos» aquí significa variantes de regiones, no partidas ni universos independientes. No existe un contador de experiencias perceptualmente únicas.

Medición renovada en `feat/intuitive-animal-dialogue` (`991255a`), con comparación separada de tierra y distintas semillas: `node scripts/world-variation.mjs 100`. Examina las 40.000 regiones con índices de -100 a 99 en ambos ejes, incluidos mares. La herramienta no modifica partidas.

| Medida | Resultado |
|---|---:|
| Regiones examinadas | 40.000 |
| Biomas presentes | 11 |
| Géneros electrónicos presentes | 52 |
| Combinaciones bioma + género + gravedad | 1.563 |
| Recetas discretas: anteriores + arquetipo + material + disposición + vidrios/espejos/módulos presentes | 21.454 |
| Combinaciones musicales: bioma + género + tempo + escala + instrumentos de bajo/melodía | 9.807 |
| Variantes detalladas de música, patrones, hábitat, suelo, aire y receta | 39.952 |
| Regiones terrestres | 23.418 |
| Recetas terrestres detalladas distintas | 23.418 |
| Perfiles musicales terrestres básicos | 9.732 |
| Instalaciones de tres vidrios | 7.218 |
| Instalaciones de espejos | 4.985 |
| Jardines modulares | 3.955 |

Estos números se superponen: no se suman. El último resultado no usa nombres, coordenadas, IDs, ángulos interactivos ni flotantes continuos para fabricar singularidad. Excluye más detalles, como especies individuales, afinaciones, acontecimientos y cambios temporales. Tampoco asegura que 39.952 variantes se sientan muy distintas al oído.

La medición histórica de la fase 11 sobre 10.000 regiones tenía 1.517 combinaciones básicas, 5.717 clases de recetas, 4.238 combinaciones musicales y 9.996 variantes detalladas bajo esta definición. La cifra previa de 10.000 recetas distintas utilizaba otra firma; no debe interpretarse como un incremento o una pérdida de contenido.

**Cifra comprobada actual: al menos 39.952 variantes regionales detalladas en esta muestra; el total del mapa no se ha enumerado.** Millones sigue siendo una posibilidad combinatoria y objetivo de diversidad, no un millón de experiencias diferentes ya comprobadas. Los hashes de 32 bits y las correlaciones entre categorías también impiden prometer singularidad absoluta para un mapa ilimitado.

## Comparación entre semillas y promedio local

Se midieron `original`, `blobs-01`, `blobs-02`, `bosque-01` y `jay-v1`, cada una en 1.600 regiones (extensión 20), con el mismo tamaño clásico de región: 3.600 unidades. Promedio por muestra: 1.600 recetas detalladas, 947,6 regiones terrestres, 871 perfiles musicales básicos contando mar y 837,4 perfiles musicales terrestres. No es un promedio del total de universos ni una muestra aleatoria de todas las semillas. Tampoco se suman perfiles de muestras distintas sin deduplicarlos.

El catálogo contiene 52 estilos y 35 identificadores de instrumento en sus paletas de género; la Bitácora describe 38 instrumentos incluyendo otros del motor. Presets generativos y parámetros no se cuentan como instrumentos nuevos.

Resultados completos: [scripts/v1-variation-sample.json](scripts/v1-variation-sample.json). Reproducir: `node scripts/world-variation.mjs 100` y `node scripts/world-variation.mjs 20 blobs-01` (repetir con las otras semillas).

El suelo resonante, los rastros encadenados y las conexiones regionales ya existen; esta firma no los utiliza para inflar singularidad. La expansión pendiente y la estrategia para medir diferencias perceptibles están en [V1_PRODUCCION.md](V1_PRODUCCION.md). Millones es un objetivo de validación futura, todavía no una cifra comprobada por esta medición.
