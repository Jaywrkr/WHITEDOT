# El mundo de Kubono

Reglas vigentes del candidato **alpha.218**. [Traspaso](../HANDOFF.md) · [El Viaje](VIAJE.md) · [mapa técnico](ARQUITECTURA.md). Los planes anteriores están construidos o registrados en sus entregas; no son una nueva lista de tareas.

## Propósito y recorrido

Explorar para descubrir sonidos, tocar a tiempo y construir Tu canción. El recorrido principal enseña cinco verbos; después puedes completar los once lugares, explorar el universo y conservar tus hallazgos. El Refugio es voluntario.

| Espacio | Función |
|---|---|
| Viaje | Camino, cinco capítulos y cierre; aprende jugando |
| Once lugares | Rondas que se abren en orden y amplían Tu canción |
| Universo abierto | Música procedural, criaturas, hallazgos, actividades y favoritos |
| Refugio | Trofeos, objetos, colección y jardín de voces |

Volver no es empezar (panel 11, Q6, D7-C). Diez cristales del Camino abren el Mundo la primera vez. Después, un día nuevo te deja donde estabas: en el Mundo, también a mitad del Viaje, o en el Camino. No hay salto diario al cargar. El Camino del día vuelve como paseo: sus diez primeros cristales dan ✦ y el décimo no te mete en el Mundo; «Entrar al Mundo» espera en el dock. Lo prueba `lastWorldDay` o el logro «mundo», que guarda `enterWorld`; no hace falta migrar.

El cubo permanece pequeño. Música, generación y partidas se conservan; color ganado y señales de estado orientan sin llenar el vacío de controles.

## Lugares y avance

| Orden | Lugar | Verbo |
|---|---|---|
| 1 | Llanura | Pegar |
| 2 | Lago | Encadenar |
| 3 | Bosque | Rodear |
| 4 | Tormenta | Bailar |
| 5 | Vacío | Soltar |
| 6 | Jardín | Sembrar |
| 7 | Dunas | Surfear |
| 8 | Cristales | Resonar |
| 9 | Faros | Guiar |
| 10 | Ruinas | Reconstruir |
| 11 | Cueva | Eco |

El Viaje completa las cinco primeras; Jardín queda como siguiente destino. Completar cada lugar abre el siguiente. Los guardados anteriores conservan puertas ya ganadas o visitadas. Puedes repetir los lugares abiertos; no pierdes estrellas.

| Estrella | Condición |
|---|---|
| ★ Completo | Completar la ronda y su cierre |
| ★★ Ritmo | Al menos75% de pulsos a tiempo, con sonido |
| ★★★ Maestro | Completar Maestro con70% a tiempo; requiere★★ para entrar |

Qué cuenta la ronda (panel 11, Q2): mientras el lugar canta su patrón (desde el inicio hasta el fin de sus dos compases, tal como se oyen) los pulsos no cuentan. En la Cueva cuenta el eco, no la corchea: un paso del patrón en el compás de respuesta es acierto; un paso que no está, o fuera de tiempo en ese compás, es fallo; durante la llamada no cuenta nada. La Cueva juzga con el mismo reloj calibrado que el resto (`heardTime`).

Maestro sube tempo10%, objetivo×1,5 y estrecha la ventana. Las once★ completan la canción;33★ abren su versión maestra. Sin sonido se puede ganar★. Reglas canónicas en `src/places.js`.

## Orientación y retorno

Los portales abiertos son blancos; los completos, del color de su lugar (también en el mapa y en los trofeos del Refugio). El dorado queda para lo ganado: ★ y ✦, con ✦ nunca mayor que ★ (panel 10, P7, D4; panel 11, D10-B). En el acierto, un oro por golpe: el marco del cubo y el «1»; la onda, la marca de la Línea y el arco del acierto son blancos (Q5). Las cifras de lugares, los botones y los avisos van en blanco: «Lugares 5 / 11», la marca de no leído y el botón del Refugio. El botón del Refugio dice «Lugares», sin número; el estante dice «★ N / 33» en blanco. El mapa dice «portales abiertos» y «tu Refugio». «Vista tranquila» oculta Tu cubo, cifras y herramientas; su subtítulo lo dice. En modo daltonismo, `SAFE_COLORS` da un color distinto a cada lugar. Una columna blanca y la brújula junto al cubo indican rumbo y distancia. Con el portal fuera de pantalla, la columna es una luz de 140 px en el borde, a la altura del rumbo. **Seguir hacia** activa una ruta a pie; no teletransporta al acabar la ronda. Con los once completos, objetivo y columna señalan el lugar sin ★★ con mejor porcentaje (después, sin ★★★). Con 33★ vuelve «Explora a tu ritmo». Menú → Lugares abre la lista en filas enteras, con el destino actual bajo la fila anterior, y permite viajar a los lugares habilitados para ello. Si quedan filas arriba, «↑ N más arriba» lo dice. Cada fila lleva nombre, ★ de 12 px o más y su acción («Ir» o «Seguir», del mismo ancho) en la misma línea (panel 11, Q4). Con logros sin leer, la Bitácora abre en Logros; si no, donde se dejó. El mapa llena su caja: mínimo de 4 regiones por lado y margen de 24 px.

Guardar un lugar conserva semilla/identidad, capa y coordenadas. Tocar el nombre del territorio abre Favoritos en el destino guardado; **Ir a este lugar** vuelve a su dirección compatible. No se promete una instantánea congelada de la música, que sigue evolucionando.

Los saltos pagados, el regreso y la distancia caminada tienen reglas propias; saltar no cuenta como caminar. [Universo](UNIVERSO.md) y `practice-travel.js`.

## Chispas y colección

Chispas✦ y estrellas★ son distintas. Las chispas compran piezas y viajes; las estrellas nunca se gastan.

Un solo ★ (panel 10, P8, D3-A): ★ y «Estrellas» solo cuentan las de los lugares (`S.lugares.stars`, máximo 33). Las reliquias del Mundo (`S.stars`) se llaman «Reliquias» en la Constelación, la Bitácora y las tarjetas. En la vista completa, el HUD muestra tres cifras: ★ de 33, ✦ y lugares de 11, al mismo tamaño y peso y alineadas a la derecha (panel 11, Q1). Día, distancia, regiones, continentes y récord están en «Tú» de la Bitácora; la meta de chispas, en Tu cubo. Ninguna hoja de primer nivel muestra un contador a cero. Cada aviso nombra como mucho un logro; los demás esperan en la Bitácora.

Recoger fragmentos conserva valor base fuera de tempo. A tiempo se multiplica×2, o×3 desde la racha de ocho. Completar una ronda da60–120✦; Maestro duplica. Tras las tres primeras rondas diarias de un lugar se reduce ese premio a la mitad. Encuentros, remezclas y algunos logros tienen reglas adicionales. Fuente: `src/spark-rules.js`.

Las tarjetas guardan el hallazgo, su procedencia y una interpretación musical. Puedes elegir hasta cuatro voces para el jardín sin consumir la propiedad. Libro, filtros, selección y Refugio comparten estado. [Hallazgos](HALLAZGOS_Y_ACTIVIDADES.md) · [Casa](CASA_VIVA.md).

## Tu canción

Cada lugar aporta una capa. ★ da un fragmento,★★ la capa completa y★★★ su variación. Los trofeos permiten recordar su capa. La vista ordinaria explica qué está ganado; las frases personales se escuchan en el final.

Entre ★ y ★★ la capa crece con tu mejor porcentaje a tiempo en ese lugar (D1-B, panel 10, P6). Desde el 55 %, cada 1,25 puntos suma un tiempo de los compases que ★ deja callados: primero el último de cada uno. Al 60 % suena cerca del 62 % de la capa; al 67 %, tres cuartos. Solo sube con rondas con sonido. Los umbrales de las estrellas no cambian. El anillo de Tu canción distingue ★, ★★ y ★★★ por forma (panel 11, Q3): con ★, un arco tan largo como lo que suena de la capa, sin relleno; con ★★, el aro entero y relleno; con ★★★, además un aro exterior fino. El arco se mide en los golpes de la capa: al 60 % la mitad y algo más, al 73,75 % casi entero. Colchón (Vacío) y Eco (Cueva) ya suenan enteros con ★, así que su arco va cerrado. Sin cifra. El color sigue: saturación por estrella; el blanco del Vacío, por brillo. El velo dorado solo sale en el final. Si una ronda hace crecer la capa, la tarjeta lo dice: «Tu capa de Lago creció». Ninguna otra ronda lo muestra; una ★ o una ★★ nuevas no son crecer. La victoria de una ronda suena al nivel ganado: con ★, la mitad de los compases que con ★★.

El final de los cinco capítulos abre el Mundo libre. El final de once lugares reúne entradas, tus frases, una pausa y el tema;33★ ofrece la versión maestra. Ambos conservan la música aprobada. La UI sigue el transporte audible y distingue tu interpretación del acompañamiento.

La ronda que completa los once desemboca sola en el final (D5): la escena se abre antes de que acabe la caída y su primer compás llega con el siguiente «1». Al cerrar el final no sale la tarjeta de esa ronda (panel 11, Q3): sus ★ y su récord quedan en Lugares y sus logros en la Bitácora. Durante tus frases y la primera vuelta del tema solo siguen el colchón (Vacío) y el bajo (Lago); las demás capas vuelven en la segunda vuelta. Tu frase suena con el arpegio suave del final del Viaje. El compás de silencio no lleva rótulo. Los créditos de autoría salen una sola vez, en el final de once; el guardado anota `credited` cuando se muestran. Si el final vuelve a sonar, acaba en «Tu canción está completa». La versión maestra muestra solo sus dos líneas. El final se cierra solo 7 s después de su último compás, como el del Viaje. Bajo el final de once la radio del Mundo calla desde su primer «1» hasta que se cierra la escena; el Mundo sigue su curso y el final toma su swing (panel 11, Q7, D9-B). Acaba en una coda escrita (D9-C): el chelo toca el tema entero, cae en la tónica sobre el último «1», un compás de colchón y bajo en la tónica y corte. No depende del nivel de Faros.

Los resultados nombran lugar, colección y ronda; muestran umbrales reales y siguiente paso. La tarjeta espera a que se oiga el fin de la caída de dos compases. No muestra logros: van a la Bitácora, sin aviso. Entre 70 y 74,9 % sin ★★ dice cuánto falta («A 0,4 de ★★») y pone «Otra vez» junto a «Seguir hacia». Durante la ronda, un tic al final de la Línea se enciende en dorado mientras el porcentaje alcanza la estrella siguiente (75 %; 70 % en Maestro). Salir y Escape comprueban el mismo final (la versión maestra llega así). Efectos de UI silenciosos.

## Ayuda

Menú → **Cómo jugar** recupera la regla actual. En Jardín indica aproximación, siembra en el golpe, riego entre golpes, cosecha y árbol dorado. Ver el gesto repite una demostración; la guía no obliga a abandonar una ronda ni a visitar el Refugio.

Las duraciones son objetivos de diseño, no tiempos garantizados de jugadores. El Viaje apunta a15–20min; esfuerzo, comprensión, reconocimiento musical y deseo de seguir requieren personas.

## Herramientas de prueba

| URL | Uso |
|---|---|
| `?capitulo=llanura` | Aísla uno de los cinco capítulos |
| `?lugar=jardin` | Aísla cualquiera de los once lugares |
| `?lugar=jardin&maestro=1` | Ronda Maestro |
| `?anillo=1` | Mundo libre posterior al Viaje |
| `?festival=1` | Viaje completo con guardado separado y reinicio para otra persona |
| `?prueba=1` / `?prueba=ver` | Observaciones locales de prueba |
| `?medir=1` | Medida local de fotogramas |
| `?clasico=1` | Comparación heredada de capítulos, mantenida por compatibilidad |

Usar perfiles temporales; no borrar la partida personal. Atajos no equivalen a completar el recorrido. El producto no requiere`?dev=1` ni expone runtime; las pruebas lo instrumentan al servir main.

[Verificación](VERIFICACION.md) · [aceptación pendiente](PRUEBAS_CON_PERSONAS.md) · [entrega E](ENTREGA_E.md).
