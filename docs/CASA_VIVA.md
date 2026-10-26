# Casa viva

Propuesta del 21 de octubre de 2026, a partir de la idea de Luca: una casa como la base de Astro Bot, donde todo lo que consigues está a la vista, se puede recorrer y responde. No es backlog de lanzamiento (ese sigue siendo D01–D22). Aprobada por Jay el 21 de octubre como casa de muñecas; sus respuestas están al final. Las seis fases (C0–C5) están hechas en ramas encadenadas; integrarlas es decisión de Jay.

## Estado vigente · alpha.200

- Cuatro habitaciones recorribles de una casa de muñecas: Eco, Jardín de voces, Cielo y Raíz. Cámara, escaleras y vista general en `house.js`/`house-view.js`.
- La posición horizontal sigue marcando paso musical y la altura, nota. Sonido y secuenciador se conservan.
- Modelo2: objetos, adornos, tintes y cápsulas. Migra modelo1; formatos futuros en lectura. Comparte WH1 si solo hay objetos; WH2 para adornos/tintes. Ambos se leen.
- Habitaciones por días o descubrimientos, lo primero; colección, trofeos, visitantes, jardín y Taller están construidos.
- N6 agrupa los40 objetos en «Puedes colocar» y «Por descubrir». N8 aclara qué voz aporta una tarjeta al jardín. [Cierre y límites](panel/candidato-n/informe.md).

## Base anterior a C0–C5 · histórica

- Plano de 2×2 visto desde arriba: Sala, Jardín (3 días), Azotea (7 días) y Sótano (14 días). Módulos: `house.js` (dibujo y gestos), `house-model.js` (datos, 40 objetos, código WH1), `house-audio.js` (secuenciador) y `collection-garden.js` (Jardín de voces).
- El cubo no camina con los controles del Mundo: se toca el plano. Modos Camina, Coloca y Retira; el selector lista los 40 objetos.
- La Casa es un secuenciador: en cada habitación, la posición horizontal de un objeto marca su paso en el compás (16 pasos) y la vertical su nota (`houseStep`, `houseDegree`); cada habitación tiene su filtro y eco. Esta identidad musical se conserva.
- Guardado: `S.house` versión 1 (objetos `{kind,room,x,y}` con x/y de 0 a 1, habitaciones abiertas, posición, visitantes conocidos). Una versión mayor se abre solo para leer. El código WH1 comparte la casa.
- Comparte modo con el Taller (`S.mode='studio'` y `houseActive()`): el botón Taller cambia al panel radial del Estudio.
- Lo que se colecciona en otros sitios (tarjetas raras, logros, piezas de la tienda, criaturas vistas) casi no aparece: siete puntos dorados por logros y alguna criatura de visita.

## Diseño aprobado de C0–C5 · histórico

1. **Un lugar para caminar.** El cubo se mueve con los mismos controles que en el Mundo, con cámara, puertas entre habitaciones y luz según la hora real.
2. **Tu colección, viva.**
   - Las criaturas que conociste pasean y responden a tu pulso.
   - Las tarjetas raras cuelgan como cuadros.
   - Los logros son trofeos en estantes.
   - Las piezas de la tienda están en vitrinas.
   - El Jardín de voces es un jardín de verdad.
3. **Todo suena.** El secuenciador sigue; además, pasar junto a un objeto o lanzarle un pulso lo hace sonar. Recorrer la casa es tocar.
4. **Crece contigo.** Las habitaciones se abren por días (como hoy, nadie pierde nada) o por descubrimientos, lo que llegue antes.
5. **Un juguete.** Una máquina de cápsulas que, con chispas, saca adornos y variantes de objetos.
6. **Visitas.** Un código abre la casa de otra persona para recorrerla, sin poder cambiarla.

## Integración: qué más hay que tocar

| Área | Cambio necesario | Riesgo |
|---|---|---|
| Guardado | `S.house` versión 2: habitaciones con tamaño propio, objetos con posición en la habitación, adornos y vitrinas. Migración desde la 1 sin perder objetos ni habitaciones; la 1 se conserva para devolverla al código WH1. Una versión futura sigue siendo de solo lectura. | Medio: se cubre con pruebas de ida y vuelta |
| Compartir | Código WH2 con lo nuevo; WH1 se sigue leyendo. Sin datos personales, salvo que se decida mostrar el nombre. | Bajo |
| Movimiento | La Casa usa los `dx/dy` del fotograma, como el Subsuelo y el Cielo (`layerStep`), con colisiones y puertas. Toque, teclado y joystick quedan iguales. | Medio |
| Modo | Se mantiene `S.mode='studio'` y `houseActive()` para no migrar partidas. Revisar a quién consulta: `audio.js` (pasos), `ui.js` (encabezado), `journal.js`, `universe-mischief.js` e `identity-play.js`. | Bajo |
| Taller | Pasa a ser una mesa dentro de la Casa: al acercarte abre el panel radial de siempre. Un solo nombre, «Taller»; «Desplegar Estudio aquí» del Mundo pasa a decir Taller. | Bajo |
| Cubo y tienda | Las piezas solo se dibujan con `inWorld()`. Hace falta un «cubo visible» que incluya la Casa. Las piezas de aspecto, movimiento, gestos y compañeros se ven en casa; las que reaccionan al mundo (charcos, hierba) no; las de sonido, por decidir. | Medio: muchos módulos |
| Sistemas del Mundo (V1–V6) | Luz, clima, fauna, cámara y sucesos solo corren en el Mundo. La Casa tiene su propia luz (reutiliza `lightOfHour`) y su propia cámara, sin sacudidas. | Bajo |
| Colecciones | Leer sin modificar: `rareCards`/`rarePortrait` (cuadros), `S.ach` y catálogo (trofeos), compras de la tienda con `pieceImage` (vitrinas), `S.livingSeen` y mascota (criaturas). | Bajo |
| Economía | La máquina de cápsulas gasta chispas: precios con la misma medición de la tanda 7, sin dar ventaja. | Medio: decisión de Jay |
| Logros | Logros nuevos de la Casa: primera visita, estantes llenos, jardín completo. La prueba del libro de logros cuenta las entradas y hay que actualizarla. | Bajo |
| Bitácora y menú | «Ver en tu casa» en Colección y Logros; la tarjeta Casa del menú dice qué hay de nuevo. | Bajo |
| Rendimiento | Las paredes y lo fijo se dibujan una vez en un lienzo aparte. Presupuesto: no más caro que el Mundo (hoy 3,8 ms por fotograma) y calidad ligera respetada. | Medio |
| Accesibilidad | Movimiento reducido, foco de teclado en los objetos cercanos y un resumen en texto de lo que hay en cada habitación. | Bajo |
| Nube | `S.house` va dentro de la partida (límite 8 MB); la versión 2 debe quedar por debajo de unos 50 KB. | Bajo |
| Pruebas | Actualizar `house_v2_smoke`, `experience_garden_smoke`/`_mix`, `house_mix`, `wonders_smoke` y `smoke` (Taller), `house.mjs` y la escena `house` de `audio_mix.mjs`. Recorridos nuevos por fase y renders de audio. | — |
| Documentación | `ARQUITECTURA.md`, `CAMBIOS.md`, esta guía y `TIENDA_DEL_CUBO.md` (vitrinas). Privacidad, solo si el código de visita muestra el nombre. | — |

## Fases

Cada fase va en su rama encadenada a la anterior. Yo hago commit y push; Jay crea el PR y lo integra. Cada fase deja el juego completo y jugable.

| Fase | Rama | Qué entrega | Cómo se comprueba |
|---|---|---|---|
| C0 · Base | `claude/casa-c0-modelo` | Modelo versión 2 y migración desde la 1, WH2 con lectura de WH1, «cubo visible» para la tienda. Sin cambios visibles. | Pruebas Node de migración de ida y vuelta, partidas antiguas y futuras, tamaño |
| C1 · Casa caminable | `claude/casa-c1-caminar` | Habitaciones conectadas, cámara, puertas, luz por la hora, el cubo con su vestuario y el secuenciador intacto. Colocar objetos caminando hasta el sitio y pulsando; arrastrar sigue funcionando. | Recorrido en móvil y computadora, render de audio de la Casa, medición por fotograma |
| C2 · Colección viva | `claude/casa-c2-coleccion` | Cuadros con tarjetas raras, estantes con trofeos, vitrinas de la tienda, criaturas paseando, jardín de voces físico. | Recorridos con partidas vacías y llenas; nada se modifica al mirar |
| C3 · Todo suena | `claude/casa-c3-sonido` | Sonido al pasar y al pulsar, respuesta de las criaturas, ambiente por habitación. | Renders de audio sin saturación, silencio con sonido apagado y con paneles |
| C4 · Crece y juega | `claude/casa-c4-crece` | Habitaciones por descubrimientos, máquina de cápsulas, logros de la Casa, Taller como mesa. | Economía medida, logros, recorrido del Taller |
| C5 · Visitas y cierre | `claude/casa-c5-visitas` | Visitar casas con WH2 (solo lectura), Bitácora y menú enlazados, accesibilidad, rendimiento, documentación y catálogo completo de navegador y audio. | Cierre completo de la guía de verificación |

Orden de merge: C0 → C5. C0 y C1 son las más delicadas (datos y controles); a partir de C2 cada fase añade sin tocar lo anterior.

## Estado

- **C0** (alpha.88): datos versión 2, migración y códigos WH2.
- **C1** (alpha.89): casa de muñecas caminable.
- **C2** (alpha.90): colección viva.
- **C3** (alpha.91): todo suena.
- **C4** (alpha.92): crece y juega.
- **C7** (alpha.96): Refugio. Jay pidió que no se viera infantil: la casa de muñecas pasa a ser cuatro cámaras de luz con forma de partitura, coherente con el resto del juego. Mismos datos, chispas y logros.
- **C6** (alpha.94): la casa viaja contigo. Casa y Taller son una sola entrada; panel de cuatro botones.
- **C5** (alpha.93): visitas, Bitácora y menú, accesibilidad y cierre. Casa 2,7 ms por fotograma frente a 4,7 ms del Mundo (móvil 390×844 a 2×, sin sonido, todo a la vista).

## Respuestas de Jay (21 de octubre)

- **Vista:** por decidir entre primera persona y casa de muñecas. Se hicieron bocetos de ambas.
  - Recomendación: casa de muñecas. Se ve todo de un vistazo, el cubo se ve con su vestuario, encaja en Canvas 2D y en el estilo de píxeles, y es ligera en móviles.
  - La primera persona exige un motor de rayos nuevo, esconde al cubo y sus piezas de la tienda, y puede marear en pantallas pequeñas.
  - Posible término medio: casa de muñecas y, al acercarse a un cuadro o una vitrina, una vista de cerca en primera persona.
- **Orden al entrar:** el de la propuesta. Primero las criaturas, luego los trofeos y la música.
- **Máquina de cápsulas:** de todo. Adornos, colores para los objetos y sonidos nuevos.
- **Piezas de sonido de la tienda:** sí suenan dentro de la Casa.
- **Nombre del dueño al visitar:** solo cuando el juego tenga varios jugadores. Hasta entonces el código de visita no lleva nombre.

## Preguntas originales

1. ¿La Casa se ve desde arriba, como el Mundo, o de lado, como una casa de muñecas en corte?
2. ¿Qué te gustaría encontrar al entrar: tus criaturas, tus trofeos o tu música sonando?
3. ¿Qué saca la máquina de cápsulas: adornos, variantes de color de los objetos o sonidos nuevos?
4. ¿Las piezas de sonido de la tienda (hi-hat, filtro…) suenan también dentro de casa?
5. ¿Al visitar otra casa se ve el nombre de su dueño?
