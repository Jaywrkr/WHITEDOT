# Fases 2026: mundo vivo y pendientes

Plan pedido por Jay el 21 de octubre de 2026: un mundo mucho más vivo, sin volver lento el dispositivo, más las fases pospuestas. Cada fase vive en su propia rama, encadenada a la anterior (commit y push; Jay crea PR e integra en orden). No sustituye al backlog de lanzamiento D01–D22.

Regla común: cada fase mide su coste por fotograma antes y después, respeta el movimiento reducido con una variante quieta, no consume el RNG antiguo ni mueve mapas, y cierra con auditoría, suites Node y los recorridos afectados (renders de audio si toca sonido).

| Orden | Rama | Fase | Qué cambia |
|---|---|---|---|
| 1 | `claude/fase-r-rendimiento` | R · Rendimiento | Preguntas al documento y a `matchMedia` una vez por fotograma; niebla reutilizada; tope de partículas; audio en pausa con la pestaña oculta. |
| 2 | `claude/fase-v1-luz` | V1 · Luz y hora | Un solo reloj de día y noche (hora real más ciclo del mundo) que tiñe cielo, luz y niebla; amanecer y atardecer visibles; de noche brillan luciérnagas y criaturas, y algunas duermen. |
| 3 | `claude/fase-v2-clima` | V2 · Clima y viento | Ráfagas que cruzan el campo; la hierba se aparta al pasar; salpicaduras y charcos con lluvia; fondos sonoros de viento, lluvia, agua e insectos con panorámica. |
| 4 | `claude/fase-v3-fauna` | V3 · Fauna que convive | Criaturas que siguen el pulso, juegan entre sí, se acercan con curiosidad y cruzan la pantalla; un solo presupuesto de cercanía para todos los sistemas de fauna. |
| 5 | `claude/fase-v4-musica` | V4 · El mundo respira la música | Respiración del cielo en el primer tiempo de cada compás, ondas de luz desde las fuentes que suenan y hierba a tempo. |
| 6 | `claude/fase-v5-sensacion` | V5 · Cámara y sensación | Cámara con inercia y anticipación, pequeño golpe de zoom en contactos grandes, sacudida suave en tormentas; todo apagado con movimiento reducido. |
| 7 | `claude/fase-v6-sucesos` | V6 · Sucesos vivos | Estrellas fugaces, migraciones que cruzan, coros nocturnos y festivales breves según la hora, con un presupuesto de frecuencia. |
| 8 | `claude/fase-3-diversion` | Fase 3 · Diversión | Los ocho ajustes aprobados: carrera, persecución, racha, eco, sombra/lluvia, volumen, encadenar encuentros y llegada de salto. |
| 9 | `claude/fase-a-tu-viaje` | A · Tu viaje | Bitácora, Perfil, Mapa y Favoritos en un solo lugar; cada cifra una vez. |
| 10 | `claude/fase-b-sonido` | B · Sonido | Volumen, energía, sonido, calma y voz en un panel. |
| 11 | `claude/fase-c-menu` | C · Menú y paneles | Un solo tipo de cierre, Ajustes ordenado, menú más corto, sin botones de prueba en producción. |
| 12 | `claude/fase-d-casa` | D · Casa y Crear | Mismo criterio en Casa, Herramientas y Grabar set. |
| 13 | `claude/tienda-tanda-5` | Tienda 5 · Sonido | Voces del pulso, sonido del cubo y notas pisables. |
| 14 | `claude/tienda-tanda-6` | Tienda 6 · El mundo reacciona y locuras | Según el catálogo. |
| 15 | `claude/tienda-tanda-7` | Tienda 7 · Habilidades y economía | Habilidades y ajuste de precios con la medición de minería. |

El estado de cada fase se registra en [CAMBIOS](../CAMBIOS.md) al cerrarla.
