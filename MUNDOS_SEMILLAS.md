## Paisajes vivos · Fase 2

**Menú → Explorar mundos** permite elegir Paisajes vivos u Original, Amplio/Clásico y semilla/preset. Humedal, Salinas, Basalto y Micelio proponen hábitats distintos con un elemento musical cercano para aprender. La entrada anterior desde Prototipo permanece.

Paisajes vivos usa versiones de generador/catálogo/layout `2`; su Amplio mide 10.800 unidades. Original conserva versión `1` y Amplio 7.200; Clásico mide 3.600 en ambos. Una URL sin `generation=2` sigue abriendo Original. Cada combinación de semilla/layout/generación conserva su partida, favoritos y respaldos propios; cambiar una no migra el habitual. **Mi partida** regresa a ese guardado.

[Alcance completo](FASE_02.md). El resto del documento describe la introducción original de semillas/blobs y sus medidas históricas.

# Probar mundos, blobs y espacios

## Cómo probar

1. Menú → Prototipo → Semillas. Se puede abrir desde Camino o Mundo.
2. Elegir Blobs I, Blobs II, Otra tierra, escribir una semilla de hasta 40 caracteres o pulsar Otra semilla. La misma semilla y el mismo espacio reproducen el mundo.
3. Amplio usa biomas de 7200 unidades; Clásico usa 3600. Ambos tienen guardados de prueba independientes. No se escalan favoritos de la partida habitual.
4. Se inicia en el centro de la región inicial, en tierra. Volver al centro reconstruye el contexto y recarga la linterna de prueba. Mi partida restaura la partida habitual.
5. En un mundo de blobs hay dos o tres habitantes cerca del centro. Si no oyes música, toca el mundo una vez. Camina, pulsa o activa Fijar sonidos para experimentar con sus papeles. Sus voces pueden ser bajo, percusión, acorde o motivo; no agudos por defecto. Cambiar una semilla cambia también música, criaturas, suelo, aire y continentes.

No hace falta completar el Camino para una prueba. Esa excepción no desbloquea el Mundo de la partida habitual. Los guardados usan otro espacio de localStorage: `pixel-blanco-v4:preview:<semilla>` para Clásico y `pixel-blanco-v4:preview-wide:<semilla>` para Amplio. Los ecos y la influencia temporal siguen siendo temporales. El selector recarga la página para evitar mezclar cachés, capas y sonidos de mundos distintos. No es un servidor multijugador ni un selector de mundos publicado fuera de Prototipo.

## Qué significa menos abrumador

La escena selecciona un subconjunto estable de vegetación, criaturas, props, cristales, pilares y juguetes. Conserva las referencias e identidades de los objetos elegidos y deja intactos los lugares de reliquias, los portales, los faros y las instalaciones. Escuchar usa la misma selección para no anunciar voces de objetos ocultos. Los coleccionables con eliminación activa conservan sus listas compartidas.

La densidad sigue variando por región: no se fuerza que todas estén igual de vacías. En el mapa habitual cambia la selección visible/interactuable, no la escala de coordenadas ni la identidad de los lugares guardados. En las semillas Amplio cada bioma ocupa el doble de ancho, cuatro veces el área. El jugador conserva su velocidad; hay más tiempo para permanecer en un ambiente.

La radio continúa componiendo en quietud. Las respuestas espontáneas de objetos son menos frecuentes y se limita a un cantor por respuesta, dejando espacio a bajo, batería y motivo. Los blobs mantienen los instrumentos del género y registros bajos/medios; sus notas no son cromáticas al azar. Los renders controlan margen y muestras casi saturadas, no certifican que todas las combinaciones agraden por igual.

## Interfaz y sonido

Menús, campos y botones no disparan pulsos ni notas decorativas. Se eliminó el arpegio de entrada y el teclado de movimiento ignora controles y modales. La música existente puede seguir sonando mientras se usa la interfaz. Los gestos sobre objetos, lienzo, instrumentos y efectos siguen siendo acciones musicales.

## Validación

`npm test` incluye semillas y blobs: identidad determinista, cambios completos de mundo, separación de claves, Camino diario estable, tamaño de biomas, voces de blobs sin rol agudo, selección de escena sin mutar los objetos y habitantes cerca del centro.

Pruebas de navegador: `tests/ui_silence_smoke.py`, `tests/seeds_smoke.py`, `tests/blobs_smoke.py`, más regresión de exploración, movimiento móvil, contactos, Eco/banda, influencia, Atlas, interfaz, capas e instalaciones. Audio offline incluye cuatro casos densos con voces de blobs, además de los casos normales y de influencia/FX, a 44,1/48 kHz.

El cálculo histórico de VARIEDAD.md corresponde al mapa original. No se multiplicó por el número de semillas para presentar un total ficticio de experiencias distintas.
