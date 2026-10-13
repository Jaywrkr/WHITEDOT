# Revisión visual y musical · 13 de octubre de 2026

Entrega en `fix/musical-registers-and-visual-inventory`, desde main `ffc5578` (PR #69: Paisajes vivos ya integrado). Jay pidió revisar las figuras antes de rediseñarlas y corregir la repetición de voces agudas. Este bloque precede a la ampliación de instrumentos de fase 3; no declara terminadas las fases futuras.

## Lámina para elegir qué mejorar

[Imagen completa: atlas visual](docs/images/atlas-visual.png) · [Índice numerado y archivos de origen](docs/images/atlas-visual.json).

118 vistas dibujadas con los renderizadores del juego: punto/luz/Estudio/campamento; seis formas de plantas; siete objetos pequeños; árboles, pilares, cristales, faros, agua, lotos, estalactitas y flores sembradas; caminantes, luciérnagas, bandadas, seis criaturas procedurales y cuatro blobs; cinco juguetes; seis familias de Paisajes vivos; diez encuentros y suelo desplegado; doce glifos de reliquia; vidrios/espejos/jardín modular; cinco hitos; portales, rastros y capas Subsuelo/Cielo; ave, semillero, nube, pulso, eco, cable de luz, relámpago, lluvia y cuatro partículas estacionales; río, seis suelos, cuatro atmósferas y cinco relieves vivos.

Son familias y estados de referencia, no 118 especies nuevas ni todas las semillas posibles. Los dibujos están ampliados para inspección: no representan cuánto espacio ocupan al jugar. Los fondos y trazos tenues conservan su opacidad nativa. No incluye paneles de UI, diseños descartados ni objetos culturales que todavía son propuestas. No rediseña ningún objeto.

Para regenerar: `python3 scripts/render-visual-atlas.py` con Playwright/Chromium. El script instrumenta módulos únicamente en un navegador aislado; no expone métodos internos en el juego distribuido ni cambia la partida habitual. La lámina es una captura del Canvas real, no una ilustración generada de cómo podrían verse las cosas.

## Qué causaba los agudos repetidos

- El Original asignaba una función aguda de 72–84 MIDI a objetos de cualquier estilo. Los perfiles vivos ya eran más contenidos, pero la política no cubría todo el sistema.
- Las voces regionales añadían teclas y órgano genéricos a varias paletas. Géneros distintos podían responder con los mismos timbres.
- La radio exigía siempre una nota melódica de anclaje; no había frases completas dedicadas solo a la base.
- El sintetizador de vidrio añade una octava. La pista automática y el ave no compensaban ese desplazamiento al limitar sus notas.
- Algunas capas rítmicas añadían acordes y blips una octava arriba, encima del motivo.

## Cambios implementados

`src/musical-character.js` establece una política explícita para los 52 estilos actuales: registro audible, presupuesto de notas por sección, presencia melódica, brillo y permiso de voces superiores. Nueve caracteres de arreglo se combinan con las recetas, BPM, swing, escalas, instrumentos y patrones propios que ya tiene cada género; no sustituyen esos 52 estilos por nueve canciones.

| Carácter | Ejemplos | Registro del motivo, MIDI | Notas máximas por sección, antes del límite regional |
|---|---|---:|---|
| Base profunda | minimal, dub techno, acid, tech house | 45–65 | 0 / 1 / 2 / 0 |
| Bass y breaks | dubstep, drum & bass, footwork, trap | 48–68 | 0 / 2 / 3 / 0 |
| Cálido | deep house, amapiano, jazztronica, soulful | 50–71 | 0 / 2 / 4 / 1 |
| Orgánico | afro, tropical, andino, organic house | 52–72 | 0 / 2 / 4 / 1 |
| Melódico | progressive, melodic techno, Detroit, liquid | 53–76 | 0 / 3 / 5 / 1 |
| Disco | nu-disco, cosmic disco, boogie | 52–76 | 0 / 3 / 5 / 2 |
| Calma | ambient, dub profundo, downtempo | 45–67 | 0 / 1 / 2 / 0 |
| Máquina | electro, robótico, electro-funk, club | 48–70 | 0 / 2 / 4 / 1 |
| Quebrado | IDM, algorave, broken beat | 50–72 | 0 / 2 / 4 / 1 |

- Las secciones avanzan por cuatro estados; todas pueden empezar desde un estado sembrado diferente. La base respira sin un hook obligatorio; vuelve la melodía cuando corresponde. La evolución continúa estando quieto, usando los relojes de frase existentes.
- Durante esas frases bajan también hats/shakers automáticos, adornos rítmicos y aves automáticas. El bajo y el patrón principal permanecen; ambient puede sostener su pad grave/medio en vez de quedarse sin fondo.
- Las voces regionales graves evitan una función aguda obligatoria. Los estilos que permiten esa función tienen techo de 76, no 84. Los objetos dejan de añadir instrumentos genéricos a toda paleta.
- Dub privilegia órgano; minimal combina teclas/clavinet; UK garage teclas cálidas; downtempo rhodes/flauta; minimal techno órgano; dub profundo órgano/flauta. Los demás conservan sus paletas específicas. Los tipos de síntesis existentes no cambian.
- Pista, ave, voces y vidrios respetan el registro audible, compensando la octava del sintetizador de vidrio. Acordes de dub/house y blips de microhouse tienen más cuerpo; las esporas no reintroducen una campana muy alta en una sección grave.
- Ríos usan menos gotas, registro y timbre de su género, y descansan con la frase. La iniciativa en quietud puede responder con un bajo en una sección sin motivo, en vez de forzar otra campana. Los hitos lejanos conservan su señal y silueta sonora, con registro ajustado al ambiente.
- Solo las respuestas melódicas automáticas descansan: tocar un objeto deliberadamente sigue dando respuesta. Los graves, percusión y acordes conservan sus funciones; fijación, aprendizaje y gestos siguen disponibles.
- Los vecinos mantienen su groove, timbre y registro propios sobre el centro armónico compartido al mezclarse. El modo suave sigue disponible; el balance por género se aplica también en modo normal.
- Ganancia final de seguridad .95 en ambas generaciones. Una prueba densa de amapiano alcanzó .9793 con el margen anterior: la nueva reserva protege las mezclas graves densas sin elevar la ganancia de compensación ni añadir distorsión continua.
- SW actualizado con el módulo nuevo y una versión de caché distinta. Ningún control de UI crea sonido nuevo. La Bitácora sigue registrando instrumentos que realmente se reproducen; este ajuste técnico no añade logros ficticios.

No cambia el mapa, las coordenadas, las semillas, los guardados, los 11 biomas, los 33 hábitats ni el catálogo de 52 estilos. Las auditorías estructurales anteriores siguen siendo mediciones de recetas, no canciones únicas. La reproducción de un lugar sí puede sonar más grave y espaciosa: ese es el objetivo del ajuste.

## Verificación

Pasaron **50 suites Node**, **32 recorridos Chromium** y recarga offline con **80 módulos**. Tras el último ajuste de ríos/iniciativa/hitos se revalidaron también sus recorridos afectados en móvil y escritorio. La lámina genera **118 vistas** con nombres y archivos de origen.

Pasaron **125 renders Web Audio**: los 52 estilos, escenas densas, encuentros, conexiones, rastros, vidrios y Paisajes vivos, normal/suave a 44,1/48 kHz. Pico máximo **0.957476**, ninguna muestra por encima de 0,98. [Resultados completos](scripts/register-review-validation.json). Comandos: `npm test`, `npm run test:browser`, `npm run test:audio`, `python3 scripts/render-visual-atlas.py`.

Las pruebas comprueban que todos los estilos alternen base/melodía sin borrar su bajo, que los gestos deliberados se escuchen, que los registros incluyan la octava audible real y que el mapa anterior conserve su captura dorada. La prueba de mezcla de vecinos escucha un ciclo más largo para incluir sus frases de descanso. Los fixtures de navegador aíslan el evento de ave de sus emisiones anteriores y silencian la partida de origen antes de fotografiar el guardado, evitando confundir nuevos instrumentos escuchados con corrupción por cambio de semilla.

Los renders verifican niveles y funcionamiento; la preferencia artística requiere escuchar. Pendiente: comparar cada estilo durante sesiones largas con auriculares/altavoces, Safari/iOS/Android reales, y elegir con Jay las figuras numeradas que rediseñaremos. Más síntesis, articulaciones, patrones y contrastes culturales siguen en fase 3 y fases posteriores.
