# Cambios recientes de Kubono

Estado: 21 de octubre de 2026. Código **2.3.0-alpha.91**. Las entradas describen su revisión, no certifican producción.

## Casa viva · C3 · Todo suena · alpha.91

Rama `claude/casa-c3-sonido`, sobre `claude/casa-c2-coleccion`. La Casa se escucha al recorrerla.

- **Al pasar:** el cubo toca cada objeto junto al que camina, una vez cada 2,5 s.
- **Pulso:** suena la voz del cubo y después los cuatro objetos más cercanos, en arpegio. Las criaturas cercanas responden con un pío corto.
- **Ambiente:** cada habitación tiene su aire. La Sala queda en silencio, el Jardín tiene hojas, la Azotea viento y el Sótano un zumbido. Todo se apaga al salir, con el sonido apagado o con un panel abierto.
- **Tienda:** los sonidos comprados para el cubo (sombrero, zumbido, notas al pisar, filtro) también suenan en la Casa.
- **Pruebas:**
  - Nuevas: `house_sound_smoke.py` y `house_ambience_mix.py`. Los cuatro ambientes quedan por debajo de 0,08 de pico a 44,1 y 48 kHz.
  - En PASS: `house_walk`, `house_collection`, `house_v2`, `experience_garden`, `cube_sound`, `house_mix`, `experience_garden_mix`, `shop_sound_mix` y `smoke`.

## Casa viva · C2 · Colección viva · alpha.90

Rama `claude/casa-c2-coleccion`, sobre `claude/casa-c1-caminar`. Lo que coleccionas aparece en la Casa. Mirar nunca cambia la partida.

- **Cuadros en la Sala:** las cuatro tarjetas más raras, con su retrato real y el marco del color de su rareza. Un cuadro vacío anima a buscar más.
- **Estante de trofeos:** un trofeo por cada una de las siete categorías de logros (Camino, Mundo, Música, Vida, Colección, Casa, Secretos). Es dorado si ya ganaste alguno y crece y se llena según la parte completada.
- **Vitrinas en el Sótano:** las seis últimas piezas compradas en la tienda, con su imagen.
- **Jardín de voces:** cada voz es una planta en maceta debajo del lugar donde suena.
- **Criaturas de visita:** las que conociste pasean por su planta, descansan y a veces se acercan al cubo; la mascota lo sigue. El pulso, con la tecla de pulso, las hace saltar con un corazón.
- **Mirar:** tocar un cuadro, un trofeo, una vitrina o una criatura dice qué es, sin caminar.
- **Coste:** 2,8 ms por fotograma en la Casa con todo a la vista (5,3 ms en el Mundo, misma medición).
- **Pruebas:**
  - Nuevas: `house-collection.mjs` (Node) y `house_collection_smoke.py` en móvil y computadora.
  - `house_walk_smoke.py` toca una zona libre de la pared.
  - En PASS: `house_v2`, `experience_garden`, `smoke`, `wonders`, los pulsos del Camino y del Mundo, los gestos de la tienda y los 188 conjuntos de Node.

## Casa viva · C1 · Casa caminable · alpha.89

Rama `claude/casa-c1-caminar`, sobre `claude/casa-c0-modelo`. La Casa deja de ser un plano de cuatro cuadros y pasa a ser una casa de muñecas vista en corte.

- **Plantas:** Azotea arriba, Sala y Jardín al medio, Sótano bajo tierra.
- **Detalles:** tejado de tejas con chimenea, cielo y estrellas según la hora real, suelo con hierba y paredes distintas en cada habitación.
  - Sala: rayas, ventana, sofá, alfombra y lámpara.
  - Jardín: invernadero, macetas y enredadera.
  - Azotea: baranda, telescopio y guirnalda de luces.
  - Sótano: ladrillos, tuberías, el banco del Taller y una lámpara.
  - De noche las lámparas iluminan.
- **Caminar:**
  - El cubo camina con las mismas teclas que en el Mundo y sube o baja con las flechas en las escaleras.
  - Tocar una habitación lo lleva hasta allí, también a otra planta.
  - Las paredes lo detienen, la puerta a una habitación cerrada no se abre y al tocar una habitación cerrada se explica cuántos días faltan.
- **Vista:** la cámara encuadra la planta del cubo entre los contadores y el panel; «Ver casa» muestra la casa entera.
- **El cubo** lleva todo lo que compraste en la tienda, igual que en el Mundo.
- **La música se ve:** en cada habitación, una luz recorre el compás y los objetos brillan al sonar. La izquierda-derecha sigue siendo el tiempo y la altura en la pared la nota; el secuenciador suena igual.
- **Se conserva:** colocar, mover, retirar, el Jardín de voces, el Taller, las visitas y la posición del cubo al recargar.
- **Coste:** 2,1 ms por fotograma en la Casa, frente a 5,2 ms en el Mundo en la misma medición (móvil 390×844 a 2×, sin sonido).
- **Pruebas:**
  - Nuevo `house_walk_smoke.py` en móvil y computadora.
  - `house_v2_smoke.py` y `experience_garden_smoke.py` adaptados a habitaciones rectangulares; esperan a que la cámara se asiente.
  - En PASS: `smoke`, `wonders`, `interface`, `panel_polish`, `accessibility`, `visual_closure`, recorridos de la tienda, `house_mix`, `experience_garden_mix` y los 187 conjuntos de Node.

## Casa viva · C0 · Base · alpha.88

Rama `claude/casa-c0-modelo`, sobre `claude/casa-plan`. Primera fase de la nueva Casa en vista de casa de muñecas (plan en [Casa viva](docs/CASA_VIVA.md)). Sin cambios visibles.

- **Datos versión 2:**
  - Se conservan objetos, habitaciones, posición y visitantes; los datos desconocidos se guardan sin tocar.
  - Se añaden adornos, colores de objetos y cápsulas, siempre normalizados.
  - El secuenciador suena igual.
  - Una casa de una versión futura se abre solo para leer.
- **Código para visitar:** si la casa solo tiene objetos sigue siendo WH1, que leen versiones anteriores; con adornos o colores es WH2. Se leen los dos.
- Una casa completa ocupa menos de 50 KB dentro de la partida.
- **Pruebas:**
  - Nueva `house-v2.mjs`.
  - En PASS: `house.mjs`, `house_v2_smoke`, `experience_garden_smoke`, `wonders_smoke`, `experience_future_smoke`, `cloud_account_smoke`, el render `house_mix` (pico 0,91) y los 187 conjuntos de Node.
  - Catálogo completo de navegador de la rama `claude/fase-i-textos`: 147/147.

## Fase I · Textos y paneles · alpha.87

Rama `claude/fase-i-textos`, sobre `claude/fase-h2-calidad`. Revisión con capturas de los 23 paneles en móvil y computadora y de todos sus textos visibles.

- **Cerrar:** la «×» de texto, diminuta y desalineada, pasa a ser una X dibujada del mismo tamaño en todos los paneles, centrada con el título.
- **Guardar copia:** el selector de archivo del navegador salía en inglés («Choose File / No file chosen»). Ahora es un botón «Elegir archivo» con el nombre del archivo o «Ningún archivo elegido».
- **Viaja a otra semilla:** fuera del modo de desarrollo ya no muestra semillas de prueba (Blobs, Basalto…), opciones técnicas de paisaje y espacio ni «Biomas de 3600 unidades». El jugador ve dónde está: semilla, lugar y estilo.
- **Ajustes:** cada opción en su línea a lo ancho (el selector de paseo ya no se corta) y los interruptores «Modo» y «Datos del mundo» como filas de lista.
- **Gotas de luz:** con un panel completo abierto se detienen y dejan de aparecer. Antes podían caer sobre el cubo y sonar con el juego pausado. Los paneles ligeros (Sonido, Tu cubo) mantienen el mundo vivo detrás, como antes.
- **Textos:** no quedan textos en inglés ni palabras de prueba visibles para el jugador; los términos (chispas, Bitácora, Tu cubo) se usan igual en todo el juego.
- **Pruebas:**
  - `interface_smoke.py` fallaba a veces porque una gota caía sobre el cubo durante la medición. Ahora retira las gotas antes de medir y pasa 6 de 6.
  - `world_weather_smoke.py` comprueba que las gotas esperan detrás de un panel.

## Fase H · Estabilidad · alpha.86

Ramas `claude/fase-h-estabilidad` (ya en `main`) y `claude/fase-h2-calidad`, sobre `main`.

- **Pruebas que fallaban a veces:**
  - `encounter_depth_smoke.py`: una nota tardía del clic anterior ocupaba el primer lugar de la frase. Ahora la prueba borra las notas en el mismo turno en que toca la frase.
  - `crystal_play_smoke.py`: la persecución usaba una sola flecha a la vez. Ahora persigue en diagonal, como un jugador.
  - Ambas pasan 6 de 6 veces. No eran errores del juego.
- **Calidad gráfica:** Ajustes ofrece Automática, Alta y Ligera. En Automática, si el dispositivo dibuja más lento que unos 40 fotogramas por segundo en dos muestras seguidas, pasa a ligera hasta cerrar el juego: lienzo a 1× en vez de 2×, como máximo 150 partículas en vez de 400 y menos salpicaduras de lluvia. La elección se guarda.
- **Diagnóstico:** los errores que ocurren al jugar se guardan en el dispositivo (los últimos 20, sin datos personales) y Ajustes los copia con «Copiar diagnóstico». Política de privacidad actualizada.
- Pruebas nuevas: `quality-diagnostic.mjs` (Node) y `quality_diagnostic_smoke.py` (calidad a 1× y 2×, cambio automático, recarga, error registrado y copiado). Recorridos de Ajustes, menú, clima, cámara y `smoke` en PASS.

## Fase G · Revisión integral · alpha.85

Rama `claude/fase-g-revision`, sobre `claude/fase-f-cuenta`. Revisión del código nuevo (tienda, menú, cuenta) y cierre completo local.

- **Filtro (tienda):** la música ya no se queda apagada al salir del Mundo, entrar en Casa o empezar una actividad; el filtro se revisa al inicio de cada fotograma y solo actúa en la superficie del Mundo.
- **Subsuelo y Cielo:** el movimiento se mide en la escala de la capa (1:8 y 1:6); hi-hat y Modo DJ ya no se disparan con poco movimiento y el Séquito solo aparece en la superficie.
- **Menú en Casa:** el resumen dice «Casa», no «Camino».
- **Rendimiento:** catálogo consultado por mapa, morse calculado una vez por nombre y la Hierba preguntada una vez por fotograma en vez de una vez por brizna.
- **Medición** (Chromium local, 390×844, sin sonido, paseo de 6 s): 3,8 ms por fotograma sin piezas; 5,3 ms (p95 7,9) con 26 piezas puestas, nuevas y antiguas. Presupuesto: 16,6 ms.
- **Cierre completo local** sobre esta rama, antes del arreglo de `audio_mix.mjs`: navegador 143/146 y audio con un fallo.
  - `interface_smoke` y `sparks_notice_smoke` fallaron por carga con dos trabajadores y pasan al repetirlos.
  - `shop_sound_mix` falló porque el arnés no llamaba a la revisión del filtro; corregido, pasa.
  - `encounter_depth_smoke` es intermitente desde antes de estas fases: falla 3 de 3 en `main` (alpha.66) y también falló en su CI (run 39538532680). En estas ramas falló 2 de 7 veces. En los fallos, la primera de las cuatro notas enseñadas queda con otro desfase armónico que las demás. No se tocó la prueba; queda pendiente de diagnóstico.
- La rama de la tanda 7 pasó el catálogo de navegador completo, 145/145. `crystal_play_smoke` falló una vez en una ejecución suelta y pasó las dos siguientes.
- No verificado: CI de estas ramas (no hay PR), escucha física y dispositivos reales.

## Fase F · Cuenta sin fricción · alpha.84

Rama `claude/fase-f-cuenta`, sobre `claude/fase-e-menu`. Sin cambios en la configuración de Supabase.

- **Con sesión guardada:** el juego arranca al momento, sin hoja de acceso ni espera de red; la identidad se comprueba en segundo plano. Si Auth la rechaza, el juego vuelve solo a la entrada.
- **Entrada:** título Kubono, «Entrar» como acción principal, el último correo ya escrito y el cursor en la clave; los botones dicen «Entrando…», «Creando…» o «Confirmando…» mientras trabajan.
- **Alta:** si el correo pide confirmación, el código se escribe en la misma hoja y entras directamente.
- El correo recordado se borra al eliminar la cuenta.
- Recorrido nuevo `account_flow_smoke.py` (Auth simulado y lento, sesión revocada, código de alta); `cloud_account_smoke.py`, `cloud_delete_smoke.py` y `cloud_recovery_smoke.py` en PASS.

## Fase E · Menú profesional · alpha.83

Rama `claude/fase-e-menu`, sobre `claude/tienda-tanda-7`.

- **Cabecera:** tu cubo en su color, tu nombre (o Kubono) y un resumen con tus chispas y el lugar donde estás.
- **Jugar:** cuatro tarjetas con título y una línea que dice qué hay dentro; la de Mundo/Camino cambia su ayuda según dónde estés.
- **Resto:** filas de lista con icono y flecha, una columna en el móvil y dos en pantallas anchas. Grupos: Jugar, Tu viaje, Crear y General.
- **Logros nuevos:** un punto dorado en la Bitácora en lugar del «·».
- Recorridos `menu_v2_smoke.py` e `interface_smoke.py` adaptados a los grupos nuevos.

## Tienda · tanda 7 · Habilidades y economía · alpha.82

Rama `claude/tienda-tanda-7`, sobre `claude/tienda-tanda-6`. Las únicas piezas que ayudan a jugar, en `src/cube-shop-skills.js`, cada una con su límite:

- **Imán corto:** recoge fragmentos un 35 % más lejos.
- **Sprint:** al arrancar tras medio segundo quieto, un acelerón de un segundo; se recarga en seis. Sin botones nuevos y solo con tu propio movimiento, nunca con el piloto automático.
- **Planeo:** en el Cielo, el toque de bajar se convierte en 2,5 s de planeo que puedes dirigir; aterriza donde termina sobre tierra y sobre el mar sigue hasta 6 s y avisa.
- **Economía:** las 78 piezas nuevas cuestan la mitad (catálogo 33790 → 17030 ✦; las tres primeras igual). Con 10 a 14 ✦/min medidos, la tienda completa pasa de 40–56 h a 20–28 h de juego activo. Lo ya comprado no cambia.
- Pruebas: `cube-shop-skills.mjs` (Node) y `cube_skills_smoke.py` (compra, sprint y recarga, planeo y aterrizaje, recarga de página); sumas de tandas anteriores actualizadas a los nuevos precios.

## Tienda · tanda 6 · El mundo reacciona y Locuras · alpha.81

Rama `claude/tienda-tanda-6`, sobre `claude/tienda-tanda-5`. Once piezas (7350 ✦) en `src/cube-shop-wild.js`, solo dibujo:

- **El mundo reacciona:** Linterna (luz cálida en el Subsuelo y farolillo junto al cubo), Hierba (se aparta más ancho y más lejos), Charcos (fijos por lugar; reflejan el cubo al pisarlos y hacen ondas con lluvia), Séquito (tres criaturas conocidas siguen tu camino) y Tu constelación (tu inicial en estrellas, más clara de noche).
- **Locuras:** Morse (tu nombre en el reloj de la música), Mochila (tus tres últimas tarjetas), Pantalla (BPM y género, bajo el cubo), Holograma (tu tarjeta más rara), Disfraces (tres pulsos seguidos: esfera, pirámide o dodecaedro un minuto) y Piel VJ (franjas que laten en los colores de la región).
- Todas tienen versión quieta con movimiento reducido y su imagen en la tienda es su dibujo real.
- Pruebas: `cube-shop-wild.mjs` (Node) y `cube_wild_smoke.py` (compra, juego en movimiento y quieto, recarga, Llevar).

## Tienda · tanda 5 · Sonido · alpha.80

Rama `claude/tienda-tanda-5`, sobre `claude/fase-d-casa`. Doce piezas nuevas (6050 ✦) en `src/cube-shop-sound.js`:

- **Voz del pulso** (una a la vez): Bombo 808, Campana FM, Ácido, Corte vocal, Scratch y Acorde. Sintetizadas en el bus de música con la nota del pulso; Acorde toca la armonía de la región. Elegir una voz ganada quita la comprada y al revés.
- **Sonido del cubo** (varias a la vez): Hi-hat al caminar (corcheas), Filtro (la música se abre al acelerar), Tarareo (quieto, tararea bajito), Modo DJ (scratch al dar media vuelta) y Antena (oye la región vecina).
- **Notas pisables** (rastro): deja una nota cada pocos pasos; al volver a pisarla suena. El mismo camino toca siempre la misma melodía.
- Con el sonido apagado o un panel abierto no suena nada nuevo; las marcas se siguen viendo. Cada pieza enseña una marca junto al cubo al sonar, y esa marca es su imagen en la tienda.
- Pruebas: `cube-shop-sound.mjs` (Node), `cube_sound_smoke.py` (compra, juego, silencio, recarga) y `shop_sound_mix.py` (renders a 44,1/48 kHz, pico 0,88 sin saturación; `scripts/shop-sound-audio-validation.json`). `audio_mix.mjs` acepta `shopPieces`.

## Fase D · Casa y Crear · alpha.79

Rama `claude/fase-d-casa`, sobre `claude/fase-c-menu`.

- **Casa:** el panel se ordena en dos filas siempre visibles. Arriba los modos (Camina, Coloca, Retira), con el activo en blanco; abajo Taller, Código y Volver, que antes quedaban ocultos bajo el borde. El selector de objeto solo aparece al colocar. En horizontal el panel pasa a la derecha y deja libre el plano.
- **Casa:** el anuncio de la región ya no tapa las habitaciones.
- **Grabar set:** con el sonido apagado, grabar lo enciende en lugar de no hacer nada.
- **Menú:** Ajustes, Guía de juego y Cuenta llevan icono y la misma letra que el resto; «Cuenta» ya no pierde su estilo al iniciar la cuenta.
- Recorrido `house_v2_smoke.py`: comprueba que todas las acciones de la casa estén a la vista.

## Fase C · Menú y paneles · alpha.78

Rama `claude/fase-c-menu`, sobre `claude/fase-b-sonido`.

- **Menú:** cuatro grupos (Jugar, Tu espacio, Crear, Más); «Sonido» se une a la Bitácora en Tu espacio en lugar de ocupar un grupo para él solo.
- **Botones de cierre:** todos dicen «Cerrar» salvo los que nombran una acción («Seguir jugando», «Volver al mundo»); antes se mezclaban Volver, Listo y Cerrar.
- **Guía:** «Laboratorio» y «Practicar» se quedan: son la lección de escucha y el recorrido de práctica, no botones de prueba.

## Fase B · Sonido en un panel · alpha.77

Rama `claude/fase-b-sonido`, sobre `claude/fase-a-tu-viaje`. El menú ya no repite el control de volumen: volumen, energía, sonido sí/no, calma, repetir y Estilo de La Voz (que sale de Ajustes) viven en el panel «Sonido». El selector conserva su ID y su comportamiento. Recorridos adaptados: `volume_control_smoke.py` y `menu_v2_smoke.py`.

## Fase A · Tu viaje en la Bitácora · alpha.76

Rama `claude/fase-a-tu-viaje`, sobre `claude/fase-3-diversion`. Mapa, Favoritos y Perfil dejan de ser paneles sueltos y pasan a la Bitácora:

- **Lugares:** primero el mapa (con sus cifras, «Ver cerca» y «Compartir»), después guardar y buscar lugares, y debajo los recuerdos y la constelación.
- **Tú:** pestaña nueva con el perfil (nombre, tiempo, distancia y universo descubierto).
- **Menú:** «Tu espacio» queda solo con «Bitácora»; desaparecen «Favoritos» y «Tu perfil». «Mapa» (Jugar) y el nombre del lugar arriba siguen siendo atajos y abren la Bitácora en Lugares.

Las secciones conservan todos sus IDs y eventos: la Bitácora las coloca en su cuerpo al cambiar de pestaña y las guarda en un contenedor oculto al salir, así que nunca dejan de existir en el documento.

Se adaptaron 13 recorridos que abrían los paneles antiguos para que entren por la Bitácora.

## Fase 3 · Diversión · alpha.75

Rama `claude/fase-3-diversion`, sobre `claude/fase-v6-sucesos`. Los ocho ajustes aprobados de la revisión:

1. **Carrera real:**
   - la meta está a 300–380 u, en el sentido contrario a donde llegaste;
   - cuenta 3·2·1 con las notas de la escena;
   - el rival corre a 150 u/s (110 con movimiento reducido) y puede ganar;
   - el texto muestra el tiempo y el resultado («Ganaste la carrera» o «Tu rival llegó primero»).
2. **Fragmento raro:** huye 5 s, hasta 180 u y a 120 u/s, y se puede atrapar mientras corre. Si escapa se apaga y vale 1 ✦ en lugar de su bonificación. La máscara guardada no cambia.
3. **Racha de cadena:** cada aro se aviva con las roturas; desde la tercera aparece «×N» en dorado.
4. **Eco que compite:** su recorrido completo, el eco como cubo con ojos, «Tú 12,3 s · tu eco 14,0 s» y al final «Ganaste a tu eco» o «Tu eco fue más rápido».
5. **Encuentros:**
   - la sombra deja sus pistas a 160 u, corre a 120 u/s y solo cuenta (y se ve) la siguiente;
   - la lluvia sube de verdad y hay que atrapar las gotas a su altura;
   - el imitador y la procesión muestran su progreso («gira 1/2», «140/220»).
6. **Volumen:** travesuras de 0,012/0,014 a 0,06/0,09 y final de actividad de 0,018 a 0,06; los tótems siguen más fuertes (0,28).
7. **Encadenar encuentros:** tras resolver uno, la espera baja de 45 a 12 s y durante los 20 s siguientes la pista dorada alcanza 600 u (en el borde de la pantalla si queda fuera).
8. **Llegada de salto:** el aviso nombra la familia y el estilo del lugar, y suenan dos notas de su música a tempo.

**Pruebas:** nueva `tests/fun-tweaks.mjs`. Dos pruebas se adaptan a los cambios aprobados:
- `crystal_play_smoke.py` persigue sin esperar a que el fragmento se pare y sosteniendo la tecla;
- `universe_mischief_mix.py` admite la nueva ganancia, con pico de 0,87 y sin saturación.

## Fase V6 · Sucesos vivos · alpha.74

Rama `claude/fase-v6-sucesos`, sobre `claude/fase-v5-sensacion`. Sucesos que llegan solos, uno a la vez, con 90 a 180 s entre ellos (el primero tras 40 a 80 s), solo en superficie y fuera de actividades:

- **Estrellas fugaces:** de noche.
- **Festival de luces:** unos 12 s de motas que suben del suelo con los colores de la música.
- **Brisa de luz:** de día, una franja cálida que cruza el campo.

Son decorativos: sin premios, sonido ni texto, y ninguno con movimiento reducido.

**Medición de las fases V1–V6 juntas** (Chromium local sin GPU):
- sin sonido: 3,7 ms por fotograma de media sin piezas y 3,8 ms con 16 piezas, frente a 8,3 y 9,6 ms antes de la fase R;
- con sonido: 7,0 ms, frente a 6,1 ms tras R y 12,1 ms antes.

Los módulos `world-*.js` no aparecen entre los que más consumen.

Archivo nuevo: `world-happenings.js`. Recorrido: `tests/world_happenings_smoke.py`.

## Fase V5 · Cámara y sensación · alpha.73

Rama `claude/fase-v5-sensacion`, sobre `claude/fase-v4-musica` (incluye el arreglo de prueba de la fase R).

Una transformación envuelve el mundo y el cubo, así que todos los sistemas siguen alineados:

- **Anticipación:** al caminar, la vista se adelanta hasta 18 px en la dirección de la marcha y vuelve al centro al parar. No se aplica mientras hay un dedo en la pantalla, para que los toques caigan donde se apunta.
- **Golpe de zoom:** romper un cristal da un toque breve (2 %); una cadena de tres o más, un 4,5 % con una pequeña sacudida.
- **Tormenta:** truenos y rayos sacuden la vista suavemente.

Controles, joystick y avisos quedan fuera de la transformación. Con movimiento reducido no hay nada de esto.

Archivo nuevo: `world-camera.js`. Recorrido: `tests/world_camera_smoke.py`.

## Fase V4 · El mundo respira la música · alpha.72

Rama `claude/fase-v4-musica`, sobre `claude/fase-v3-fauna`. Con sonido:

- el primer tiempo de cada compás tiñe levemente el mundo con el color de la música, algo más cada cuatro compases;
- cada fuente que suena (criaturas, plantas, objetos) suelta un aro de luz, hasta 10 a la vez;
- la hierba guarda algo del pulso.

Sin sonido no pasa nada; con movimiento reducido, ni aros que crecen ni oleadas.

Es solo dibujo y no cambia la música. `feedback.js` expone `soundCuesNow` para reutilizar sus avisos de nota.

Archivo nuevo: `world-music.js`. Recorrido: `tests/world_music_smoke.py`.

## Fase V3 · Fauna que convive · alpha.71

Rama `claude/fase-v3-fauna`, sobre `claude/fase-v2-clima`. Las criaturas de las tres familias (especies del suelo, habitantes de píxel y fauna de la capa viva):

- se mecen al pulso de la música;
- duermen con una «z» lejos del cubo: las de la capa viva siguen su propio descanso, el resto duermen dos de cada tres de noche; cerca del cubo despiertan;
- de día, dos vecinas de la misma especie se saludan con un corazón de píxel.

Cada 45 a 100 s cruza el cielo una bandada: pájaros de día, murciélagos de noche.

Es solo dibujo: movimiento, sonido y reglas de captura no cambian. Con movimiento reducido no hay balanceo, corazones ni bandadas.

La lista de criaturas vivas cercanas (`livingNear`) se calcula una vez por fotograma con `frameMemo`, en lugar de cuatro.

Archivo nuevo: `world-fauna.js`. Recorrido: `tests/world_fauna_smoke.py`.

## Fase V2 · Clima y viento · alpha.70

Rama `claude/fase-v2-clima`, sobre `claude/fase-v1-luz`.

- **Viento:** ráfagas que cruzan el campo en la dirección del viento del día (cambia cada día).
- **Paso del cubo:** la hierba se aparta a ambos lados.
- **Lluvia:** cuando llueve (tormenta o lluvia de notas), el suelo muestra salpicaduras, hasta 36 a la vez.
- **Sonido:**
  - lluvia de fondo, ruido filtrado y muy bajo;
  - de noche, fuera de mar, cueva, vacío y dunas, grillos breves repartidos a izquierda y derecha.

Todo pasa por el bus del juego y queda en silencio con el sonido apagado. Con movimiento reducido no hay ráfagas, estela ni salpicaduras.

Archivo nuevo: `world-weather.js`. `audio.js` expone `noiseBuffer` para reutilizar el ruido existente. Recorrido: `tests/world_weather_smoke.py`.

## Fase V1 · Luz y hora · alpha.69

Rama `claude/fase-v1-luz`, sobre `claude/fase-r-rendimiento`. El ciclo de día del mundo (diez minutos, ya existía y solo movía la niebla) se ve:

- **Noche:** un azul profundo cubre todo menos la linterna del cubo, las estrellas brillan más y salen luciérnagas (6 a 16 puntos).
- **Amanecer y atardecer:** un tinte cálido al amanecer y rosado al atardecer.
- **Hora real:** si es de noche en la hora del jugador, las noches del mundo son algo más oscuras.

Solo en la superficie; con movimiento reducido, las luciérnagas quedan quietas.

Coste: un degradado y unos 16 puntos por fotograma.

Archivos: `world-light-model.js` (pura, `tests/world-light.mjs`) y `world-light.js`. Recorrido: `tests/world_light_smoke.py`.

## Fase R · Rendimiento · alpha.68

Rama `claude/fase-r-rendimiento`, sobre `claude/charming-darwin-dvbfc7` (alpha.67). Primera de las [Fases 2026](docs/FASES_2026.md).

- Cada fotograma preguntaba unas 150 veces si había un panel abierto (`document.querySelector`) y 78 veces si se pedía movimiento reducido (`matchMedia`). Ahora `frame-state.js` contesta una vez por fotograma y los 68 módulos lo leen de ahí. Fuera del fotograma (teclas, temporizadores) se sigue preguntando directamente.
- La niebla dibujaba 18 degradados por fotograma; ahora reutiliza una mancha ya pintada por tono.
- Las partículas tienen un tope de 400.
- Con la pestaña oculta, el audio se suspende y vuelve como estaba al regresar.

Medido en Chromium local sin GPU, recorrido con sonido: media de 12,1 a 6,1 ms por fotograma, p95 de 16,2 a 9,0 ms. No equivale a una medición en un móvil físico. Catálogo de navegador local: `lab_score_smoke.py` comparaba el número de ondas en dos momentos y la onda de su propio toque podía terminar entre medias; ahora comprueba que abrir Sonido no lanza pulsos.

## Rendimiento con muchas piezas · alpha.67

Medido en Chromium local sin GPU, como tiempo de dibujo por fotograma tras un recorrido en ocho:

| Piezas puestas | Media | p95 |
|---|---|---|
| Ninguna | 8,3 ms | 12,8 ms |
| 16 piezas (Patitas, Enjambre, cara, cuatro hábitos, Jardín, Imitador, Eco rítmico y los cinco gestos) | 9,6 ms | 13,7 ms |
| Grafiti, Bola de disco y Fantasma | 9,8 ms | 14,1 ms |

Grafiti costaba 10,8 ms de media porque trazaba cada tramo por separado. Ahora agrupa los tramos por color y cinco pasos de desvanecimiento, con el mismo aspecto. La variación entre mediciones ronda ±0,8 ms. No equivale a una medición en un móvil físico.

## Tienda del cubo, tanda 4 · alpha.66

**Formas del pulso** (cada onda lleva su forma; el alcance es siempre el del pulso original):
- Cuadrado, Estrella, Doble anillo, Espiral y Rayo.
- Eco rítmico: dos ecos detrás de la onda, a una corchea.
- Cargado: brilla más cuanto más esperas entre pulsos, hasta 4 s. Sustituye a «mantén pulsado» para no cambiar los controles.

Una forma a la vez: comprar o elegir una devuelve la forma ganada al pulso original, y elegir una ganada la quita.

**Gestos** (puedes llevar varios):
- Pose: quieto 5 s.
- Voltereta: dos pulsos seguidos.
- Confeti: al ganar un logro o una recompensa de chispas.
- Baile: cuatro giros en 2,5 s.
- Baile de victoria: al volver de una actividad completada.

2770 ✦ en total. Nuevos `cube-shop-pulse.js` (dibujo de formas, también usado por las imágenes de la tienda) y `cube-shop-moves.js` (gestos), con un gancho más en `render.js`.

`tests/cube_moves_smoke.py` comprueba:
- las 12 piezas, en movimiento y quietas;
- que cada onda lleva la forma con el alcance y la forma de impacto del pulso original;
- la exclusión de formas;
- que cada gesto salta con su causa real;
- que todo se conserva tras recargar.

## Tu cubo, un solo lugar · alpha.65

Pedido por Jay: «Tu cubo» y «Viajar y chispas» se juntan en un solo panel. Arriba, el cubo vivo con todo lo que llevas y tus ✦. Tres pestañas:

- **Llevar:** lo ganado jugando y lo comprado, por ranura; tocar lo pone o lo quita al momento, sin Aplicar ni Cancelar. Un solo rastro a la vez.
- **Tienda:** solo lo que no tienes, con precio junto al nombre. Al comprar te lo pones y pasa a Llevar. Sin vista previa: cada imagen es el dibujo real de la pieza. `cube-shop-preview.js` la genera en una escena corta (andar, pararse, girar) usando los mismos módulos de dibujo del juego.
- **Viaje:** saltar, volver, meta, colecciones, título e historial.

El menú pierde «Viajar y chispas» y «Tu cubo» pasa a Jugar.

Corrige un fallo de alpha.64: si se reemplazaba la partida en marcha, el dibujo de rastros fallaba en cada fotograma; lo destapó `pet_smoke.py`.

Pruebas adaptadas sin quitar aserciones de comportamiento: `cube_editor`, `wardrobe`, `music_menu`, `musical_wonders`, `pet`, `pulse_forms`, `panel_polish`, `sparks_economy`, `game_loop` y las tres de la tienda. La de rastros además comprueba que un rastro ganado y uno comprado se excluyen.

## Tienda del cubo, tanda 3 · alpha.64

Rastros: Grafiti (pinta el suelo con los colores de la música y se borra en 25 s), Cometa, Huellas del día, Jardín (flores que crecen y se marchitan en 45 s) y Arcoíris (12 s tras romper tres cristales en 1,2 s). Compañeros: Nube, Pájaro (se posa encima al parar), Imitador (repite tu camino con 0,7 s de retraso, sin alejarse), Satélite DJ (avanza un octavo de vuelta por pulso; sin sonido gira despacio) y Fantasma de ayer (tu recorrido del día anterior en miniatura alrededor del cubo). 4750 ✦. Nuevo `cube-shop-world.js` con dos ganchos en `render.js`: rastros antes del cubo y compañero después. Huellas y Fantasma guardan `S.cubeRoute`: hasta 600 pasos de hoy y 120 puntos del último día jugado, solo en superficie y solo con una de esas piezas puesta; el resto vive en memoria y se reinicia al saltar. `tests/cube_trails_smoke.py` compra y equipa las 10, comprueba el arcoíris tras una cadena, el paso de hoy a ayer y la recarga.

## Tienda del cubo, tanda 2 · alpha.63

Ojos: Serio, Dormilón, Curioso, Travieso y Rubor. Hábitos, que se encienden juntos: Bostezo (quieto más de seis segundos), Saludo (guiña a la criatura que llega), Estornudo (aire de esporas, polvo o niebla) y Mareo (seis giros en tres segundos). Accesorios: Bigote, Gorrito, Gafas de sol y Monóculo. 900 ✦ en total. Nuevo gancho `drawCubeShopOver` en `render.js`; la cara se dibuja en píxeles enteros y, mientras llevas ojos, accesorio o hábitos, el cubo se dibuja con al menos 10 px (niveles 1 a 3; desde el nivel 4 ya los supera). Es solo dibujo: alcance y colisiones conservan el tamaño real. Con Enjambre la cara va en el primer mini cubo. Si un hábito necesita cara y no llevas ojos, usa unos ojos simples mientras dura. Solo dibujo y partículas, sin cambios de juego. `tests/cube_face_smoke.py` compra las 13, las ve en movimiento y quietas, dispara los cuatro hábitos y el rubor con sus causas reales y comprueba la recarga.

## Tienda del cubo, tanda 1 · alpha.62

Movimiento: Gelatina, Patinador, Pogo, Gusano, Ingravidez, Rodar, Patitas y Parpadeo. Cuerpo: Latido, Dado, Camaleón, Racha, Pecera, Origami, Ensamblaje, Bola de disco y Enjambre. Precios del catálogo (150 a 1.200 ✦). Nuevo `cube-shop-art.js` enganchado a `render.js`; solo dibujo, sin cambios de juego. `tests/cube_shop_smoke.py` compra y equipa las 17, comprueba que el cubo se ve en movimiento y quieto, y que lo equipado sobrevive a la recarga; la revisión visual ampliada corrigió Enjambre, Patitas y Racha en cubos pequeños.

## Tienda del cubo, tanda 0 · alpha.61

Nuevo `cube-shop-model.js` con las 14 ranuras del catálogo. Polvo viajero, Pulso facetado y Órbita personal pasan a Rastro, Forma del pulso y Compañero, y se pueden llevar las tres a la vez; lo equipado en guardados anteriores se migra a su ranura y `equipped` se conserva para dispositivos sin actualizar. Piezas de versiones futuras se mantienen mientras estén compradas. El panel de chispas agrupa la tienda por ranura. Pruebas: `tests/cube-shop.mjs` y equipar/quitar por ranura en `tests/sparks-economy.mjs`.

## Fase 2 y catálogo de la tienda · alpha.61

Fase 2: meta y título «Universo completo» (actividades, hallazgos, travesuras y esculturas); Polvo viajero visible con movimiento reducido; portales de actividad del 6 % al 15 % de celdas y esculturas del 1,5 % al 3 %, sin mover sitios existentes. Arreglos pedidos por Jay: «Viajar a otra semilla» y el catálogo de laboratorio ocultos en producción, con bloqueo de viajes a otras semillas; marca Kubono en todo lo visible (identificadores internos conservados); un lugar nuevo por día en lugar de en cada recarga. El tope de minería quedó descartado a favor de una tienda grande: catálogo aprobado en [Tienda del cubo](docs/TIENDA_DEL_CUBO.md), sin implementar.

## Fase 1 de pulido: integridad y textos · alpha.60

Rama `claude/charming-darwin-dvbfc7` desde `main` `9953eed`, tras la revisión completa del juego. Bitácora con etiquetas «Elementos», «Linajes» y «Caminantes» en lugar de cifras desfasadas (109/28 frente a 157/48 reales). Seis avisos y el Perfil dejaban de apuntar a «Menú → Guardar copia» u «Otros mundos», controles que ya no existen; ahora dicen qué pasó o nombran «Viajar a otra semilla». Retirado el panel de logros antiguo `mAch`, sin acceso. Viaje musical y galería reciben la × común. «Saltar · N ✦» se deriva de `SPARK_JUMP_COST`; el panel de chispas deja de invitar a ahorrar cuando ya tienes todas las apariencias; las insignias «en un paseo» reinician tarjetas y vecinos al saltar, como ya hacían distancia y ancla. Aviso breve al cambiar el día dentro del Mundo. Restaurar desde la nube una copia en el otro modo pasa por la transición normal: antes, elegir la copia online del Camino estando en el Mundo dejaba región y música del Mundo activas. `cloud_account_smoke.py` lo comprueba (falla sin la corrección) y su paso de Cuenta ya no compite con el aviso de divergencia.


## Fixture del visitante nuevo · tras 9953eed

CI de `main` sobre alpha.59: `logic`, `audio (1)` y `audio (2)` verdes, `browser` 130/131 por una carrera de tiempo en `first_level_smoke.py` (ventana del saludo). Solo cambia la fixture; sin cambios de producto ni versión.

## Recuperación configurable, borrado local y CI · alpha.59

Rama `claude/charming-darwin-dvbfc7` desde `feature/account-recovery-link` (`3175b41`). `recoveryUrl` en `cloud-config.js`, validado en `cloud-client.js` (local HTTP o HTTPS limpio) y aviso de puerto 3000 solo con destino local. Eliminar cuenta pide credenciales, luego confirmación, y tras el RPC `purgeUserStorage` borra en el dispositivo solo las claves de esa cuenta. Fixtures de navegador adaptadas a la cuenta obligatoria y al menú sin «Guardar copia»; `checks.yml` con historial completo en `browser`; `bump-version.mjs` reconoce la etiqueta «Versión del código» del README consolidado. Evidencia local: Node de cuentas y nueve recorridos en PASS; catálogo completo, Android y Supabase sin ejecutar. CI de `main` sigue rojo hasta integrar.

## Consolidación para revisión con Claude · 3175b41

Documentación vigente con índice y traspaso en raíz. Corregidas referencias a cuenta opcional, guardado manual, demo, firma por caché y migración pendiente. Plan de lanzamiento con decisiones actuales y estados separados de implementación/prueba/publicación. Documentos históricos identificados como archivo; evidencia anterior preservada y enlazada. 100 Markdown revisados (16 vigentes/84 históricos); 1661 enlaces locales sin roturas y referencias de código/locales comprobadas. Auditoría estática sin errores/avisos; selección de impacto: cero suites Node. Sin cambios de código, nuevas pruebas funcionales ni actividad Supabase.

## Retención gratuita · 32e2102

GitHub Actions configurado a siete días para nuevos logs/artefactos; workflows alineados y [CI aprobado](https://github.com/Jaywrkr/WHITEDOT/actions/runs/39455805125). Tarea local horaria con archivos permitidos para respaldos de migración y logs inactivos, sin incluir firma ni partida activa. Fixture vencida borrada, reciente/clave conservadas; aplicación real inicial cero borrados. Limpieza de Supabase preparada pero no aplicada por solicitud caducada. Trabajo detenido por Jay para revisión documental.

## Privacidad y producción · 8a8a20a, 200da32

Borradores de privacidad, eliminación y lista de producción. Jay aprueba público de 16 años o más y los plazos registrados en [configuración](docs/CONFIGURACION_PRODUCCION.md). Datos legales, país, mercados y correo público pendientes; no se activó verificación de edad ni se publicó política.

## Firma estable y migración · 165a356, c538a1d

[Compilación estable](https://github.com/Jaywrkr/WHITEDOT/actions/runs/39337750907), copia privada local y secreto CI; sin regeneración silenciosa de identidad por perder una caché. Actualización aislada mantiene 137 chispas y compra. Migración real autorizada en emulador: 280 archivos privados restaurados idénticos, cuenta conectada y saldo 52/72 ganadas/20 gastadas tras actualización y reapertura. Lanzador actualizado y respaldos locales retenidos temporalmente. Firma de vista previa, no de tienda.

## Cuenta obligatoria y progreso automático · alpha.55–58

Admisión antes del runtime, sesión persistente, guardados locales aislados por cuenta y conciliación automática cada cinco segundos. Sin invitado/demo ni controles normales de respaldo. Conflictos reales conservan ambas copias y piden elegir; CAS evita reemplazar revisiones ajenas. Reautenticación de eliminación corregida sin recarga prematura. Evidencia real PC/iPhone/emulador y pruebas enfocadas en [cuentas](docs/CUENTA_Y_RESPALDO.md), con límites explícitos.

## Entregas anteriores

[Registro detallado hasta alpha.58](docs/historial/CAMBIOS_HASTA_ALPHA_58.md) conserva comandos, revisiones, incidencias y pruebas de sus entregas. [Archivo anterior a la primera consolidación](docs/historial/CAMBIOS_ANTES_CONSOLIDACION.md). No usar las instrucciones antiguas de cuenta opcional, guardar manualmente o firmar solo con caché como comportamiento vigente.
