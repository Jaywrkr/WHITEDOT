# Panel8 · evaluación ciega y exigente

**Diez lentes simuladas, cinco revisores nuevos. No opiniones reales ni jurado humano.** Código alpha.192, `a850ceee`. No se suministraron ni consultaron puntuaciones anteriores. [Método](expediente.md), [notas calculadas](evidencia/notas.json).

## Resultado

| Lente | Visual | Audio técnico | Creatividad | Sensación | Cohesión | Pulido | Media |
|---|---:|---:|---:|---:|---:|---:|---:|
| Tetsuya Mizuguchi | 7 | 7 | 6.5 | 6 | 6.5 | 6 | 6.50 |
| Toshio Iwai | 6.5 | 7 | 7 | 6.5 | 6.5 | 6.5 | 6.67 |
| Masaya Matsuura | 6.5 | 7 | 7.5 | 6 | 6.5 | 6 | 6.58 |
| Simogo | 7 | 7 | 7.5 | 6.5 | 7 | 6.5 | 6.92 |
| Ed Key y David Kanaga | 6.5 | 7 | 7.5 | 6 | 7 | 6.5 | 6.75 |
| Jenova Chen | 6.5 | 7 | 7.5 | 5.5 | 6.5 | 6 | 6.50 |
| Conrad Roset | 7 | 7 | 8 | 7 | 7.5 | 7 | 7.25 |
| Ken Wong | 7 | 7 | 7.5 | 6.5 | 7 | 6.5 | 6.92 |
| Lucas Pope | 7 | 7 | 7.5 | 7 | 7.5 | 7 | 7.17 |
| Austin Wintory | 7 | 7 | 7.5 | 7 | 7 | 7 | 7.08 |

**Media provisional: 6.83/10**, resumida6,8. La precisión numérica no implica certeza perceptiva. Audio7,0 describe estructura técnica; no declara música agradable ni desagradable. No se puntúa contra una nota anterior ni se resta por una preferencia estética que Jay ya decidió.

## Fortalezas observadas

- Identidad coherente de negro, Geist, geometría y color ganado. El cubo pequeño permanece como decisión de diseño.
- Menú principal con continuación y tres destinos claros.24 estados medidos sin desbordamiento horizontal, hijos fuera de panel ni objetivos menores de24px.
- Once reglas distintas, geografía sonora y tarjetas que pueden convertirse en voces de casa.
- Guardados, conflictos y rondas con protección y rollback. La casa admitió intercambio de40 objetos en una sonda del revisor.
- Auditoría simbólica nueva:52 estilos,18 influencias,71 comprobaciones aprobadas. Eso acredita variedad estructural, no calidad musical percibida.

## Hallazgos por prioridad

1. **P1 · Ayuda incompleta durante el Viaje (U14).** `voice-guide.js:24` consulta lecciones solo mediante `placeRun()?.id`. En campaña no hay ronda; la guía ofrece objetivo genérico. `journey-games.js:13` suprime explicación textual allí y `estilo-j.css:538` oculta el primer tutorial. Los gestos abstractos no enseñan necesariamente rodear, cerrar o dejar espacio. Reutilizar lecciones en el capítulo actual y hacer visible la condición pendiente desde ayuda explícita, manteniendo el lienzo tranquilo. Evidencia de implementación; el atasco humano es un riesgo, no una frecuencia medida.
2. **P1 · Juicio y despacho del toque separados (S02).** El tiempo se recoge al apoyar (`canvas.js:38`), pero `sonar` se llama al levantar (`:61`). La nota se programa desde entonces (`interactions.js:51`, `journey-pulse.js:26`). Sonda nueva: sostener220ms produjo despacho246ms después del apoyo. Fue con sonido desactivado para aislar entrada; no es medición de latencia acústica. En sonido activo la regla de emisión conserva esa dependencia de soltar. Afinar gesto y referencia audible sin generar sonidos adicionales.
3. **P1 · Reproducción abrevia la frase conservada (A06).** Se guardan ocho notas/pasos, pero el final asigna un compás y admite solo dos por paso (`song-stage.js:48–51`). Sonda: ocho notas en paso0 → dos eventos personales. Capturar bien no basta para escuchar toda la frase. Mantener orden/tiempo por compás o explicar una transformación deliberada; sin reescribir datos históricos.
4. **P2 · Paso guardado en campaña adelantado (A07).** El pulso calcula paso0 y la memoria de capítulos recibe `MU.step=2` (`journey-pulse.js:77,91`, `journey-chapters.js:89`). La misma interpretación se trata distinto en campaña/rondas. Usar el instante juzgado con una posición temporal inequívoca.
5. **P2 · Silencio parcial en final11 (A08).** `stageEvents` devuelve cero capas en su compás de pausa, pero `audio.js:214,277–293` mantiene el fondo antes de llamar al escenario. No se acredita silencio de toda la mezcla. Coordinar los buses existentes respetando la música base; efecto acústico pendiente de medición/escucha.
6. **P2 · Más: título/subtítulo pegados (U15).** Capturas320/390 y texto medido: «LugaresSiguiente: Jardín.» / «MapaRegiones y favoritos». `index.html:157–158`, `estilo-j.css:492`. Separar con la misma jerarquía tipográfica ya usada en destinos principales.
7. **P2 · Eco anuncia grabar pero puede borrar (U16).** `index.html:84` ofrece grabación; `jam.js:50–54` borra un eco cercano antes de armar. Actualizar acción/etiqueta y conservar la interacción espacial para borrar.
8. **P2 · Vacío: acierto sin acción (S03).** La Línea representa solo0, el juez acepta cuatro tiempos y el juego espera al1 (`journey-rhythm.js:9`, `journey-release.js:42`). Separar pulso musical válido y gesto que avanza, evitando feedback contradictorio.
9. **P2 · Luces con relojes distintos (S04).** Pulso compensa salida; ecos/banda/objetos/cristales usan currentTime directo (`jam.js:95,123`, `wow-feel.js:41–46`, `crystal-sparks.js:38`). Divergencia de implementación comprobable; magnitud percibida dependiente del dispositivo.
10. **P2 · Finales no reaccionan al cambio solo vertical (U17).** `journey-finale.js:90` y `song-stage.js:91` actualizan ambos ejes únicamente al variar anchura. Sondas actuales confirman buffer antiguo al cambiar844→700 y700→600 manteniendo390px. Corregir ambas dimensiones sin rediseñar el final.

## Riesgos de diseño, no bugs cerrados

El dedo fantasma gris comparte gramática con entidades: inferencia visual de ambigüedad; Faros ofrece una jerarquía interna más clara para enseñar. Bosque pide240puntos y los grupos normales aportan9–18: unas14–27 capturas si solo usa esos grupos. No son minutos humanos ni prueba de aburrimiento. La economía presupone rondas universales de2,75min; calibrar con recorridos reales por lugar.

El crecimiento temporal al acumular/soltar excede la base pequeña del cubo. Es una decisión mecánica existente: revisar coherencia visual preservando su intención; **no** tratarlo como orden para agrandar el cubo ni eliminar una mecánica sin evaluar.

## Qué haría primero

1. **Claridad del gesto:** ayuda contextual de capítulos, condición pendiente, Eco y textos de Más.
2. **Fidelidad musical del jugador:** misma referencia para juicio, captura, reproducción y luz; no perder notas en el final.
3. **Puesta en escena y comprobación:** silencio del final, tamaño del buffer y esfuerzo por lugar; luego escuchar y observar personas sin ayuda.

Son recomendaciones, no autorización para implementarlas en esta auditoría. No añadir biomas, monedas o instrumentos para elevar la nota. [Plan de corrección propuesto](plan.md).

## Alcance de las pruebas

[Sondas](evidencia/sondas-navegador.json), [frase/tiempo](evidencia/frase-tiempo.json), [UI24](evidencia/ui.json), [capturas16](evidencia/capturas.json), [música simbólica](evidencia/musica-simbolica.json). Se conservan ocho capturas representativas; las demás son temporales. No se repitió toda la suite ni se hicieron cambios al runtime. Audio, sensación y retención requieren evidencia humana. No se promete10 ni cierre de producción por esta nota.
