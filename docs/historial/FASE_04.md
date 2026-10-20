> **ARCHIVO HISTÓRICO — NO VIGENTE.** Conserva el texto de otra revisión; no certifica el estado actual ni autoriza ejecutar fases, pendientes o instrucciones. Consultar [traspaso actual](../../HANDOFF_CLAUDE.md) e [índice vigente](../README.md).

# Fase 4 · gestos y color de instalaciones

> Estado al 13 de octubre de 2026: Bloque de gestos/color integrado por #73, incluidas restauración fuera de alcance y protección de vistas previas ante ondas. No cierra todas las familias propuestas de fase 4. [Estado actual](ESTADO_ACTUAL.md) · [Pendientes](PENDIENTES.md) · [Handoff](HANDOFF.md).

Bloque desde main `df725f6` (#72). Esta entrega mejora las instalaciones existentes; no declara implementados todos los candidatos de fase 4 ni rediseña las figuras pendientes de elección.

## Implementado

- **Espejos por arrastre:** tomar directamente el cuerpo y girar alrededor del pivote. Mantiene el ángulo relativo al contacto inicial, sin salto al iniciar. Si se toma el centro exacto, el desplazamiento horizontal gira el objeto de forma estable.
- Gesto separado del joystick: no mueve al jugador, no inicia el escáner ni genera sonar. Un toque corto conserva el panel de ángulos, que sigue disponible como alternativa con controles nativos de teclado.
- Vista previa durante el arrastre, guardado al soltar. Cancelar restaura ángulos y registro guardado. Menús, escaneo, pérdida de foco, mute, cambio de partida/capa y salida de alcance cancelan el gesto; una liberación tardía no confirma una vista previa cancelada.
- Se conserva la ruta de reflexión finita, máximo cuatro rebotes, descubrimientos anteriores, presupuesto musical compartido y respuesta deliberada a tempo. Los pasos automáticos de espejos ahora también se detienen con un modal o la página oculta.
- **Color ligado al gesto:** cada vidrio desplaza hasta 30 grados su matiz según la orientación. Sus tres colores mantienen separación de 120 grados; conserva transparencia y mezcla aditiva existentes. No modifica las notas ni la silueta.
- **Reflejos cromáticos:** el rayo cambia de matiz por tramo después de cada reflexión. La cantidad y longitud de segmentos no aumentan; el rombo y la figura de conexión siguen mostrando el resultado de la ruta.
- Service worker con versión nueva. Sin campos de guardado nuevos, posiciones nuevas ni logros artificiales.

## Verificación

Las suites Node existentes pasan. `tests/mirrors.mjs` añade giro relativo, continuidad angular y color periódico. `tests/mirrors_smoke.py` añade arrastre directo en móvil/escritorio, jugador inmóvil, panel oculto durante el gesto, rollback de cancelación y cancelación al abrir modal. Las pruebas previas de panel, ruta, audio, guardado, escáner y Bitácora siguen activas.

La integración ya ocurrió en #73. Para nuevas modificaciones, repetir lógica, auditorías, regresión de navegador, shell offline y mezclas de audio pertinentes en CI. La revisión visual humana y dispositivos reales siguen pendientes.

## Cómo probar

Desde Original, entrar al Mundo y llegar a los espejos del origen (centro aproximado 1600,900). Arrastrar un cuerpo para girarlo; tocarlo brevemente para abrir los ajustes de precisión. Abrir el menú durante un arrastre y comprobar que vuelve al ángulo anterior. En los vidrios del origen (1080,900), girar los aros y observar el color de cada placa.

## Continúa pendiente

Elegir con Jay las figuras del atlas que se rediseñarán. Nuevas familias de prismas, cuerdas y membranas, movimiento de instalaciones y ampliaciones de materia son candidatos posteriores; esta entrega no los da por terminados.
