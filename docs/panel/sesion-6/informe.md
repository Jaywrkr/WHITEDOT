# Sexta sesión · experiencia real tras el Viaje

**25 oct · alpha.181 · `3c5fd7b6`. Auditoría y plan, sin implementación.** [Expediente](expediente.md) · [plan K1–K5](plan.md) · [registro canónico](../sesion-4/seguimiento.json).

## Valoración

La media provisional baja de **8,1 a 7,2**. No ha cambiado el código: la prueba real de Jay revela que la orientación y el final del Viaje no estaban validados como experiencia. La nota anterior medía correcciones técnicas con un alcance insuficiente para cerrar esos puntos.

Diez lentes simuladas a partir de dos revisiones de fuente y la consolidación; no opiniones reales de esos creadores, jurado humano ni escucha del auditor. Cinco lentes de navegación conservan la referencia de audio anterior; las otras penalizan la integración del final5 por el relato y los contratos comprobados. No se califica de nuevo la música base que Jay quiere conservar.

| Lente | Visual | Audio | Creat. | Sensación | Cohesión | Pulido | Media |
|---|---|---|---|---|---|---|---|
| Tetsuya Mizuguchi | 8,0 | 7,0 | 8,5 | 7,5 | 7,0 | 7,0 | **7,5** |
| Toshio Iwai | 7,5 | 7,0 | 8,5 | 7,5 | 7,0 | 7,0 | **7,4** |
| Masaya Matsuura | 7,0 | 8,0 | 8,5 | 7,0 | 6,5 | 6,5 | **7,3** |
| Simogo | 8,0 | 6,5 | 8,5 | 7,5 | 6,5 | 7,0 | **7,3** |
| Ed Key y David Kanaga | 7,0 | 8,0 | 8,5 | 7,0 | 7,0 | 6,5 | **7,3** |
| Jenova Chen | 6,5 | 8,0 | 8,0 | 6,5 | 6,0 | 6,0 | **6,8** |
| Conrad Roset | 8,0 | 7,0 | 8,5 | 8,0 | 7,5 | 7,0 | **7,7** |
| Ken Wong | 6,0 | 8,0 | 8,0 | 6,5 | 6,5 | 6,0 | **6,8** |
| Lucas Pope | 6,5 | 8,0 | 8,0 | 6,5 | 6,0 | 5,5 | **6,8** |
| Austin Wintory | 7,5 | 6,5 | 8,5 | 7,5 | 6,5 | 7,0 | **7,3** |
| **Hoy** | 7,2 | 7,4 | 8,4 | 7,2 | 6,7 | 6,6 | **7,2** |

Las sesenta notas y medias sin redondear están en [notas.json](evidencia/notas.json). No se sube una nota por documentar un problema.

## En qué coincide la revisión

1. **El siguiente reto existe, pero no es accesible de forma clara.** Tras los cinco capítulos, Jardín es el siguiente y `seen` puede estar vacío. Lugares solo ofrece Ir si ya lo viste (`refugio-lugares.js:55–60`). Salir al anillo cierra la hoja y sale de casa, sin acercarte a un portal (`:68`). Después de una ronda sí hay Siguiente que transporta gratis: falta esa misma continuidad en el primer acceso (Matsuura, Wong, Pope, Chen).
2. **El salto de veinte chispas tiene otro objetivo.** Elige contraste de paisaje/música hasta aproximadamente ±80 regiones, sin buscar portales (`practice-travel.js:19–33,75–79`). No prueba un cobro indebido; prueba una expectativa mal resuelta. Avanzar al siguiente reto debe ser gratis y visible (Pope, Proteus, Chen).
3. **La orientación pierde información y el destino puede cambiar.** `edgeColumn` solo conserva X (`places-ring.js:21,64`); norte y sur dan la misma columna. El anillo sigue `studio.x/y` (`:33–34`) y desplegar Refugio los cambia (`house.js:51,110`). Radio nominal 6000, unos 31,6 s rectos a velocidad base190; entrada a menos de40. No basta decir que hay un faro: hay que comprobar que conduce (Mizuguchi, Wong, Proteus).
4. **El final de cinco círculos es otra música anterior.** `journey-finale.js:42–45` sigue usando cama fija de La mayor/120 BPM y notas guardadas crudas con voz cuadrada. La radio deja de programar pasos durante él (`audio.js:213–214`): no se demuestra una doble radio continua. Se demuestran posibles notas fuera de su cama fija y un silencio incumplido. En el modelo, partitura28 s, cama30 s y un pad hasta32 s, ya durante créditos. La segunda pasada del tema +7 sí queda en La mayor; no se le atribuye un error que no tiene (Iwai, Simogo, Wintory).
5. **Menú y avisos necesitan jerarquía y medidas mejores.** Seis tarjetas principales con subtítulos, controles secundarios y HUD visible compiten. Las muestras generales no dan desbordamiento del contenedor; el control X1 territorial sí da hijos de464 px, con borde derecho530,3 en pantalla390. El padre se recorta, así el chequeo antiguo del contenedor no lo detecta. [Captura](capturas/territorio-390.png). Es una reproducción de geometría controlada, no aún la captura exacta de Jay (Wong, Pope; medidas del auditor).
6. **Las pruebas anteriores no cerraban estas preguntas.** Los smokes de anillo colocan al jugador sobre coordenadas; el modelo de duración presupone desplazamientos sin pérdida. Los tests de final5 conservan MIDI crudo y usan sonido apagado; el test de armonía se centra en final11. Los once renders de victoria no son el final5. CI verde certifica esos contratos, no orientación autónoma o música aprobada al oído.

Son **once lugares totales**, incluidos cinco ya completados; quedan seis. Camino y Refugio no añaden otros dos retos. Los créditos «Once lugares te esperan» pueden sugerir once adicionales. Corregir la explicación no añade lugares.

## Hallazgos y estado

- **U03 y U04 reabiertos**: nombres/objetivo compartido corregidos técnicamente; acceso y comprensión no aceptados con esta evidencia.
- **A04 nuevo**: el final5 no es el final11 de A03. A01 conserva la mejora de victoria breve comunicada por Jay; A02/A03 conservan sus correcciones locales, sin declararlas aceptación de todos los finales.
- **U05–U08 nuevos**: rumbo incompleto, anillo móvil, menú recargado y texto territorial recortado.
- **V01 sigue abierto**, ahora con evidencia humana negativa concreta. P01 no se cierra por una simulación. Persistencia y CI no se reabren sin un fallo nuevo.

## Plan y decisiones

[Cinco fases K1–K5](plan.md): acceso gratuito y orientación; final5 coherente; menú y pantallas; guía contextual; comprobación real de todo el recorrido. Cada una en una rama encadenada. Primero reparar lo existente, sin catálogo nuevo.

No hace falta una decisión para confirmar las causas. La ejecución del plan queda pendiente de la respuesta de Jay: este encargo pidió revisar y proponer antes de implementar. Las capturas pendientes se incorporan a U08/K3; no bloquean la corrección posterior de lo ya reproducido.

## Evidencia y límites

[Modelos](evidencia/modelos.json), [24 estados UI](evidencia/ui-medidas.json), [cuatro controles X1](evidencia/territorio-control.json), [menú](capturas/menu-390.png), [Lugares](capturas/lugares-390.png). Cuatro tamaños:320×568,390×844,844×390,1280×800; origen normal y `webdriver=false`, sin errores de página. En las primeras cuatro muestras territoriales el aviso estaba oculto: no certifican su tamaño. En el control adicional se fija el atributo X1 sobre un ticket persistente X2 para medir el mismo CSS con contenido real. No certifica su cola natural.

Pruebas ligeras de reglas aprobadas: `places-ring`, `refugio-lugares`, `journey-finale`, `song-harmony`. No hubo renders nuevos, escucha del auditor, partida nueva de veinte minutos ni cinco participantes. El relato de Jay no identifica coordenadas, guardado o dispositivo. No se usa el clip o el pico como prueba de calidad musical.

**La fase no está lista para declararse aceptada.** Conservar generadores, arte y progreso; resolver estos puntos y verificar la aceptación antes de ampliar. Supabase sigue en pausa.

Verificación de esta entrega documental: **245 suites Node**, auditoría de release sin errores/avisos y enlaces locales revisados. [Registro](evidencia/verificacion.json). Árbol ejecutable idéntico a `3c5fd7b6`; no hay correcciones implementadas por esta revisión.
