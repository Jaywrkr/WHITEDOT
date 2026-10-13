# Revisión: música, interacción y espacio móvil

Esta revisión parte de la versión con espejos y continúa lo autorizado por Jay: transformar más la composición, fijar sonidos solo por elección, conectar módulos y recuperar el espacio de exploración. La cadena va después de la fase 11, no directamente sobre main.

## Diagnóstico y decisiones implementadas

1. **Interacción como adorno.** `playVoice` emitía una respuesta afinada, pero la radio mantenía su bajo/motivo casi independientemente. `influence.js` ahora transforma las partes existentes: patrón y timbre de bajo, síncopa/energía, grados y timbres de motivo o huecos entre notas. La respuesta cambia por objeto, receta y género. Se aplica a compás y se desvanece; no fabrica capas ilimitadas ni notas cromáticas al azar.
2. **Contacto repetido sin nueva intención.** Los juguetes se disparaban por cooldown aunque siguieras encima. Ahora distinguen entrar/salir, y algunos permiten permanecer cerca para cultivar influencia. La revisión de los contactos del paisaje tradicional continúa en una unidad propia.
3. **Repetición automática confundida con grabación.** Looper y sonidos fijos son acciones diferentes. La fijación está apagada por defecto, no captura ambiente ni micrófono y tiene reemplazo por papel, liberación directa y protección contra volver a fijar el sonido borrado mientras sigues allí. El looper manual permanece entre herramientas, no como requisito para crear.
4. **Módulos que añaden más ruido.** Los jardines modulares tienen cables de composición, no realimentación de audio arbitraria. Transforman el arreglo ya afinado del lugar, con figura y cantidad positiva/negativa. Un solo conjunto cercano controla a la vez. Sus cables están desconectados inicialmente.
5. **Demasiados controles persistentes.** En exploración queda el menú, una línea de lugar y tiempo de linterna. Herramientas se piden desde Menú → Instrumentos y se guardan al tocar el mundo o escoger una herramienta. Detalles/retos pueden mostrarse voluntariamente, y Escuchar muestra el reto activo.
6. **Paneles que interrumpen un gesto.** Conectar cables ya no abre sus parámetros encima del recorrido. Tocar el cuerpo del módulo abre el panel; sus puertos siguen siendo conexiones. Vidrios/espejos abren controles por contacto explícito. Los paneles de instalaciones son exclusivos entre sí.
7. **Legibilidad y espacio.** Controles relevantes tienen objetivos de 44 px, paneles con alto acotado y desplazamiento, notificaciones breves ampliables, un indicador pequeño de grabación y confirmaciones visuales locales. Se eliminó el relleno dorado de pantalla en los flashes: el fondo queda negro.

## Qué verificar escuchando y jugando

- Permanecer unos seis segundos junto a un aro/prisma: aumenta su figura y transforma una parte, al salir se reduce suavemente. Buscar otro ambiente para comparar papeles.
- Conectar el reloj con Bajo/Groove/Motivo en un jardín; variar figura y cantidad. Debe sentirse como cambiar el arreglo, no como sumar campanas. El cambio es gradual y a compás.
- Con fijación apagada, tocar y salir no deja un eco repetido. Activarla, tocar dos objetos del mismo papel y ver reemplazo. Tocar el anillo suelta la voz.
- En móvil, caminar en varias direcciones con la barra guardada; abrir efectos voluntariamente, cerrar y seguir. Probar pantallas pequeñas y horizontal.

## Evidencia y límites

Hay pruebas del arreglo transformado, inmutabilidad de recetas, límites de notas, crecimiento, pausa y decaimiento; gestos y guardado en Chromium móvil/escritorio; pruebas de interfaz en 360×640, 390×844, 844×390 y escritorio. Los renders de audio ejercitan influencias máximas, densidad, FX y escucha suave a 44,1/48 kHz, con margen de picos y sin muestras casi saturadas.

Eso comprueba funcionamiento y ciertos aspectos de limpieza. No demuestra un master profesional por percepción: falta comparar fragmentos largos del juego en auriculares/altavoces reales, balance subjetivo y fatiga entre géneros. No se cambió el limitador para aparentar más calidad subiendo volumen.

## Deuda que condiciona el siguiente crecimiento

- Cachés base de regiones, biomas, chunks y voces no tienen todavía una política de residencia completa. Un viaje largo necesita límites y reconstrucción determinista antes de añadir cientos de familias.
- Offline sigue incompleto: el Service Worker no precachea todos los módulos y su fallback HTML puede llegar a una petición JS. Instalabilidad no significa funcionamiento offline completo.
- Los sistemas comparten un contexto mutable. Hay guardas de capa/presupuesto, pero conviene extraer contratos de interacción y audio en cambios revisables antes de multijugador.
- No confundir el número de recetas distintas con experiencias que se sienten distintas. La medición en VARIEDAD.md necesita ampliarse cuando cambie su firma; no inventar multiplicaciones independientes.
