# WHITEDOT · Pixel Blanco

Un pixel blanco en un mundo negro. Cada día avanzas un camino corto, y cuando lo terminas se abre un **Mundo infinito y procedural donde todo hace música**: electrónica que va del ambient al minimal tech house. Cada región tiene su género, su paisaje y sus criaturas, y todo lo que tocas suena a tempo.

**Jugar:** https://whitedot-inky.vercel.app. En el móvil, instálalo como app: en iPhone, Compartir → Añadir a pantalla de inicio. Funciona en móvil y escritorio; toca la pantalla una vez para activar el sonido.

Por Jay · [@jaywrkr](https://instagram.com/jaywrkr)

---

## Cómo se juega

1. **Camino del día:** mueve el pixel (arrastra o usa WASD/flechas) y recoge luces. La barra tiene un tope diario. Volver cada día suma racha.
2. **Mundo:** al terminar el camino entras al Mundo. Tu linterna dura 10 minutos, más 1 minuto por día de racha (máximo 60). El tiempo de linterna se pausa mientras consultas menús y paneles.
3. **Explora:** encontrarás claros de escucha, espacios de ensamble y rincones de descubrimiento. Los elementos nuevos se agrupan para poder tocarlos juntos; en los claros la música automática respira más. El HUD y Escuchar indican el espacio actual. las regiones son grandes y cambian poco a poco, igual que bajar de la sierra a la costa. Cada una tiene un género (afro house, minimal, rominimal, dub techno, acid, garage, electro, progressive house, microhouse, minimal techno, dubstep y drum & bass, tropical house, melodic house, electro robótico y nu-disco…), su escala, su suelo, su aire y su fauna. Aunque te quedes quieto, la música sigue componiendo: cambia frases, instrumentos y secciones con el tiempo y la actividad del ambiente.
4. **Interactúa:**
   - Choca objetos. Encontrarás luces fugitivas, brotes saltarines, cometas flotantes, prismas giratorios y aros resonantes: unos salen volando, otros saltan, giran o resuenan sin moverse. También reaccionan al pulso. Cada objeto tiene rasgos propios: algunos son serenos, otros vivaces o elásticos; varían su movimiento, impulso y recuperación incluso dentro de una misma región.
   - Lanza un **pulso** tocando brevemente la pantalla o con Espacio.
   - **Escuchar:** mantén presionado sin arrastrar durante medio segundo (o mantén E en escritorio). Consulta las fuentes cercanas, su función musical, instrumento, región, género y escala. Suelta para volver a moverte.
   - Deja que las criaturas te sigan y canten.
   - Cumple el reto de cada región.
   - Algunos objetos añaden filtro suave, eco a tempo, espacio o modulación metálica a su voz. Su carácter varía por región y aparece en Escuchar.
   - Escucha el reparto musical del lugar: un árbol, cristal o criatura puede aportar bajos, percusión, acordes o melodías según la región. Su función e instrumento se conservan al volver, pero varían incluso dentro del mismo bioma.
   - Cada región muestra su gravedad al entrar: ligera (más rápido), normal o alta (más lento). La velocidad cambia suavemente en sus fronteras: ligera 1,65×, normal 1× y alta 0,55×.
5. **Estudio:** un secuenciador radial portátil. Lo armas con las muestras que recoges y lo despliegas como refugio, que también sirve de checkpoint.
6. **Bitácora:** consulta lugares y su gravedad, formas agrupadas por función musical, música descubierta y logros. Los logros ocultos se muestran como “???”. La Voz del sistema comenta lo que haces sin pedir permiso.
7. **Sesión:** desde el menú consulta tus descubrimientos nuevos, retos, hallazgos, interacciones y pulsos, junto con los lugares y la música escuchada. Al salir del Mundo se conserva el resumen; puedes compartirlo como imagen.
8. **Compartir:** genera una tarjeta para redes con tu racha y tus descubrimientos.

## Tecnología

- HTML en `index.html`, CSS en `styles/game.css` y módulos JavaScript nativos en `src/`.
- Canvas 2D y Web Audio API. Todo el sonido se sintetiza en vivo, sin samples.
- Sin dependencias de aplicación ni build. `package.json` declara módulos ES y el comando de pruebas core; no hace falta `npm install`.
- Guarda el progreso en `localStorage` (clave `pixel-blanco-v4`).

## Correr local

```bash
python3 -m http.server 8000
```

Desde la carpeta del repositorio, ejecuta ese comando y abre `http://localhost:8000`. También puedes usar `npx serve .` y abrir la dirección que indique ese servidor.

## Deploy

El repo está conectado a Vercel (proyecto `whitedot`). Los cambios se preparan en una rama nueva desde `main` actualizado, se verifican y se suben con commit y push. **Jay crea el PR y hace el merge.** El asistente no hace push directo a `main`, no crea PRs y no hace merges.

Al integrar el PR en `main`, Vercel despliega producción automáticamente. No hay paso de build: Vercel sirve `index.html`, `styles/` y `src/` como archivos estáticos.

## Verificar cambios

```bash
npm test
python3 tests/smoke.py
python3 tests/atlas_smoke.py
python3 tests/world_smoke.py
python3 tests/journey_smoke.py
python3 tests/mobile_smoke.py
python3 tests/wonders_smoke.py
python3 tests/alive_smoke.py
python3 tests/layers_smoke.py
python3 tests/jam_smoke.py
python3 tests/fx_smoke.py
python3 tests/audio_mix.py
```

Las pruebas core necesitan Node. Para las pruebas de navegador necesitas Python y Playwright: instala `tests/requirements.txt` en un entorno virtual (`python3 -m pip install -r tests/requirements.txt`) y usa Chromium instalado en el sistema, o instala el navegador con `python3 -m playwright install chromium`. Puedes indicar su ejecutable mediante `CHROMIUM_PATH`. El smoke test levanta su propio servidor y verifica móvil y escritorio; no evalúa la calidad audible de la música.

Los módulos requieren servir el juego por HTTP; abrir `index.html` mediante `file://` no es el flujo soportado.

Los avisos del sistema ocupan dos líneas; tócalos para leer el mensaje completo. La tarjeta de entrada es breve y los detalles del lugar quedan en Bitácora y Escuchar.

## Escala del mundo

El Mundo está hecho de **continentes** de tamaños muy distintos, cada uno con su nombre, su tono musical, su familia de géneros y su color. Entre ellos hay **mares de silencio** casi vacíos. La vida no está repartida pareja: hay desiertos largos y oasis llenos; al llegar a un oasis después del vacío, la música entra de golpe. Los **hitos** (torres de luz, árboles madre, ciudades de formas, monolitos y faros) se oyen desde lejos y desde su dirección antes de verse. No hay flechas: sigue el sonido.

Mientras más lejos del Origen, más raro: criaturas más grandes, colores imposibles y música desafinada. Con la linterna diaria no llegas lejos en un día, así que tu Estudio es el campamento base. El **Mapa** (menú) solo muestra lo que viste, marca con "?" los hitos que oíste y no visitaste, y se puede compartir.

Muy de vez en cuando aparecen **rarezas** que rompen las reglas (gravedad invertida, regiones en canon, el tiempo que se detiene, la Luna de oro…). La Voz suelta rumores de hacia dónde están, y cada una te da una muestra única para tu Estudio. Los **ríos** cruzan el mundo: síguelos río abajo y la música va subiendo; donde dos ríos se juntan, sus músicas se mezclan. Las **tormentas** viajan con el viento y llueven notas: persíguelas. Cada continente cambia de **estación** cada semana, y el mundo guarda tus **huellas** y tus campamentos antiguos.

Hay **grietas** y **escaleras de luz**: ábrelas lanzando los pulsos que piden, seguidos y en el beat. Abajo, en el **Subsuelo**, cada paso vale ocho de arriba (sales por columnas de luz). Arriba, en el **Cielo**, ves el continente entero y tocas donde quieres bajar.

## Hacer música en el lugar

En el Mundo, el dock tiene dos botones nuevos:

- **⟳ Eco (looper):** grabas 2 compases de lo que tú haces sonar (pulsos, toques, luces) y queda en el mundo como un eco que se repite mientras estás cerca. Puedes tener hasta 4. Junto a un eco, el mismo botón lo borra.
- **Mesa de efectos (Kaoss pad):** arrastras sobre el pad. Hacia los lados filtras (graves a la izquierda, agudos a la derecha) y hacia arriba das espacio (reverb y eco). Al soltar vuelve a limpio, salvo que actives **Fijar**. También tiene **Eco** (repeticiones largas a tempo), **Robot** (reducción de bits) y **Stop** (frenazo de cinta).
- **Banda de criaturas (estilo Incredibox):** cada criatura que tocas se une con su papel musical: bajo, percusión, acordes o melodía. Te siguen tocando su parte a tempo. Con la banda completa todo sube, y hay combos secretos.

## Atlas de ritmos (para probar)

Menú → Prototipo → **Ritmos** lista todos los géneros del juego ordenados por tempo, confirma que existen en el mundo y muestra cuáles ya escuchaste. **Ir** te lleva a la región más cercana con ese ritmo.

## Dirección del juego

Las reliquias pertenecen a sitios fijos del mundo, sin flecha global ni generación alrededor del jugador. Por chunk hay una probabilidad de 1/48 de un hallazgo, incluyendo constelaciones dormidas (1/384). Cerca del origen no aparecen. Los ecos requieren permanecer cerca 6 segundos y lanzar 3 pulsos; las constelaciones, 12 segundos y 5 pulsos. Al alejarte más de 140 px, la resonancia vuelve a cero. Cada sitio se obtiene una sola vez por partida y queda en tu constelación; su posición es compartida por la semilla del mundo. Las estrellas anteriores se conservan, y las reliquias pendientes del guardado antiguo siguen disponibles durante su día.

## Para seguir desarrollando

Lee **[HANDOFF.md](HANDOFF.md)**. Se complementa con **[CAMBIOS.md](CAMBIOS.md)** (inventario de todo lo añadido respecto al prototipo, referencias y estado de ramas) y **[PENDIENTES.md](PENDIENTES.md)** (plan vigente ordenado y criterios de aceptación). **[REVISION.md](REVISION.md)** recoge la revisión de Claude, mediciones de nitidez y problemas pendientes. HANDOFF explica visión, decisiones, arquitectura, sistemas y pruebas. Está pensado para pegarlo en otra IA (ChatGPT, Claude, etc.) y seguir sin perder nada.

La variedad musical incluye paletas tropicales, melódicas, robóticas y disco, con grooves y escalas propios. Sus instrumentos electrónicos incluyen steel pan, kalimba FM, teclas cálidas, cuerdas, metales, clavinet, bajos filtrados o FM, formantes, güiro y timbal. Escuchar y Bitácora muestran qué aporta cada fuente.

Cada región combina una gramática propia de acentos, armonía, fraseo y brillo, además de su género. La composición evoluciona estando quieto. **Escucha suave**, en el menú, reduce volumen y brillo; puedes combinarla con el control de silencio.

Los objetos y criaturas se oyen más presentes al acercarte y se apagan gradualmente al alejarte. Su volumen sigue la distancia incluso durante la nota; la música de fondo continúa componiendo.

Las regiones vecinas tienden a compartir tempo y afinación. Al acercarte a una frontera se mezclan gradualmente sus percusiones, bajos y melodías.

La biblioteca incluye 52 estilos. La tanda de raíz afroamericana suma Chicago house, Detroit techno, acid house, soulful/gospel house, garage house de Nueva York, ghetto house, footwork, Baltimore club, Jersey club, Miami bass, electro-funk, boogie, boom bap, lo-fi hip hop, trap, G-funk, electro de Detroit y broken beat. Antes había 34 estilos base, entre ellos electrónica andina, amapiano, jazztronica, Berlin School, IDM, cosmic disco, liquid drum & bass y darkwave/EBM. Sus patrones, armonías e instrumentos alimentan la gramática generativa y las mezclas entre regiones vecinas.

El entorno incluye aves de eco que responden a las frases, semilleros que se sacuden con cajas/claps y nubes que lanzan relámpagos graves. También reaccionan al contacto y al pulso; Escuchar identifica su función musical.

Los instrumentos tienen materiales sonoros procedurales —madera cálida, cristal suave, metal filtrado y aire sedoso— y variaciones de ataque, resonancia y armónicos. Cada objeto conserva su timbre al volver; Escuchar muestra su material.

La salida musical conserva sus patrones e instrumentos y reduce la saturación a niveles normales. Los retornos de reverberación y eco dejan más espacio al grave directo. `tests/audio_mix.py` verifica picos, dinámica y coloración con audio renderizado; la calidad perceptiva se valida escuchando.

Capas, Estudio y ecos mantienen su música separada: el looper captura acciones del jugador y conserva el timbre y la capa de origen. Consulta [RAMAS.md](RAMAS.md) para probar e integrar esta sesión en orden. Prueba de integración: `python3 tests/layer_jam_smoke.py`.

Catálogo y recetas de lugar: Cada región tiene una receta estable de carácter, materiales, distribución, acciones y presupuestos. Bitácora y Escuchar muestran su carácter; también reconocen Subsuelo y Cielo. El catálogo valida entradas y usa semillas independientes por elemento. Esta base conserva paisaje y música existentes; la distribución se aplica en fase 4. No añade culturas ni objetos nuevos todavía.

Combinaciones coherentes: Las recetas ya distribuyen los elementos nuevos: tres disposiciones, 35 tamaños de población observados, afinidad de movimiento y materiales, y claros de escucha libres. En fronteras se usa el bioma real del chunk con el presupuesto regional. Flora, criaturas, suelo, reliquias y sus IDs anteriores se conservan; las posiciones y tipos de juguetes se regeneran según receta. Se mantiene la música y sus límites, con afinidad suave de material.

Lenguaje gráfico y capas de información: Elementos nuevos, fenómenos e hitos comparten trazos, materiales y límites de brillo; el jugador conserva el blanco principal. Subsuelo y Cielo usan fondo negro, y el Cielo muestra contornos en vez de llenar regiones de color. La banda desplaza sus ranuras cuando hay FX, Escuchar o avisos; la mesa adapta su altura en pantallas cortas. Guía reutilizable en visual.js, sin alterar música.

El ambiente responde a la quietud: Tras aproximadamente 60 segundos de escucha activa aparecen respuestas espaciadas de fuentes cercanas o un motivo local cuando no hay objetos. La iniciativa desarrolla tres niveles con el tiempo, respeta el compás y baja suavemente al moverte. Menús, Escuchar, pestaña oculta y audio suspendido no suman tiempo; claros de escucha omiten respuestas extras. Logro El lugar te responde y explicación en Escuchar/Bitácora. Estado temporal, sin drone ni grabación de ambiente.

Favoritos musicales: Menú → Favoritos guarda hasta 64 puntos con nombre, coordenadas, capa y carácter musical; permite renombrar y borrar, y sobrevive a recarga. Bitácora los lista y el mapa marca los de superficie sin revelar terreno adicional. Logro Quiero volver. No es teletransporte ni snapshot del compás; escenas exactas siguen pendientes. Guardado v4 añade favorites versión 1.

Orientación y regreso: Cada favorito ofrece Orientar y hay retorno guiado al Estudio. Un indicador compacto muestra dirección, distancia en pasos y llegada, con cancelación; sigue disponible tras recarga. Si el destino está en otra capa indica buscar un acceso. No mueve al jugador ni teletransporta. Logro Otra vez aquí al regresar desde cierta distancia. Guardado v4 añade destination; borrar el favorito cancela su ruta.
