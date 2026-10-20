> **ARCHIVO HISTÓRICO — NO VIGENTE.** Conserva el texto de otra revisión; no certifica el estado actual ni autoriza ejecutar fases, pendientes o instrucciones. Consultar [traspaso actual](../../HANDOFF_CLAUDE.md) e [índice vigente](../README.md).

# Música nueva como descubrimiento · propuesta de Jay

**Continuación:** [PLAN_CIERRE_2.0.md](PLAN_CIERRE_2.0.md) consolida el trabajo posterior en diez fases. M1 ya está en `main 6702093`. F1 de cierre une paisaje, material, poblaciones y carácter sonoro; no completa los híbridos, síntesis modular ni el 100 % global. Los alcances y criterios musicales de este documento se conservan en F3–F6/F8–F10.

**Estado: M1 autorizada por Jay e implementada en `feat/m1-musical-identity`, desde `main 08d1833`.** M2–M6 siguen como plan. Las primeras 16 recetas son arreglos curados sobre géneros existentes, no un mezclador libre de culturas/géneros.

| Fase | Rama | Estado |
|---|---|---|
| M1 · Identidad musical y ADN individual | `feat/m1-musical-identity` | Implementada y validada; escucha física pendiente |
| M2 · Híbridos y temperamento audible | Por crear | Pendiente |
| M3 · Distribución y sorpresa cercana | Por crear | Base territorial adelantada en M1; fase completa pendiente |
| M4 · Viajes y vínculos recordados | Por crear | Saltos de práctica adelantados en M1; vínculos durables pendientes |
| M5 · Diversidad y cobertura del 100 % | Por crear | Pendiente |
| M6 · Descubrimiento con vida y control | Por crear | Pendiente |

**Alcance M1:** `musical-recipes.js` selecciona receta estable sin tocar RNG visual; `radio.js` aplica motivo, bajo, gramática y expresión; `audio.js` consume swing, aire y tono de pad. Los 52 estilos conservan su batería, tempo y escala; géneros con más de una receta tienen selección regional. Hay silencios, presupuesto melódico y registro acotado. El laboratorio incorpora 16 destinos reales y conserva los 91 anteriores y sus notas.

`living-mind.js` crea perfiles para los 28 linajes activados en `living.js`: decisiones periódicas, límites de territorio, plantas/estructuras inmóviles con apertura/cierre, mirada local y expresiones de sonido. `livingVoice` utiliza preferencias de instrumento/grado, paciencia y energía. Rasgos de actividad se consumen en ecología; las tortugas reciben movimiento lento. El perfil se reconstruye por ID con semilla independiente y sesgos de personalidad anteriores; no requiere reemplazar ni borrar guardados. Frases y estados temporales conservan su duración actual; memoria de vínculos durable corresponde a M4.

Esto **no** es cobertura del 100 % del universo: bandadas, mascota y criaturas procedurales antiguas mantienen sus motores. La prueba de M1 recorre 32 perfiles por cada linaje y exige al menos tres decisiones compatibles; percepción y cobertura global se auditan en M5. Geist Mono pasa a ser la única fuente activa, incluidos títulos y exportaciones; fuentes antiguas y licencias se conservan como archivo.

### Ampliaciones autorizadas durante M1

- **Exploración:** «Saltar» a mano en Mundo; comparar género/receta/bioma y acercar al jugador a habitantes. Retorno desde menú, dirección WD1 persistente, historial acotado, guardado previo y bloqueo durante grabaciones/escaneo. No completa el Camino; los hallazgos del destino se registran normalmente.
- **Territorios:** agrupaciones de flora/fauna compatibles, una a tres dominantes, cuatro densidades, zonas vacías y bandadas comunes con preferencia local. Mantener RNG/coords del terreno y raros/estructuras antiguos; no repartir todas las especies con igual peso. Las frecuencias raras nuevas no están medidas; tarjetas anteriores conservan sus datos.
- **Síntesis creativa:** ocho familias nuevas y 16 programas propios, pasos bajos reales de 12/24/36/48 dB por octava, banda y muesca, barridos acotados por gesto/clima. Señal pequeña en la fuente y programas oídos en Bitácora. Bajos, silencios y presupuesto siguen protegidos; referencia a riqueza de sintetizadores comerciales sin incorporar sus presets/muestras.
- **Pruebas prácticas:** laboratorio de 131 entradas/18 grupos, con 16 destinos, ocho demos de instrumentos y 16 filtros además de los 91 previos. Contacto del cubo y Solo; botones silenciosos.

Estas bases adelantan aspectos de M3/M4 por petición de Jay; no dan por completados híbridos libres, ecología global, vínculos durables ni cobertura perceptiva del 100 %.

## Diagnóstico anterior a M1 · 14 de octubre

Alcance: catálogo nuevo de 28 linajes (10 flora, 10 fauna y 8 construcciones), no todas las familias procedurales del universo.

- **28/28, 100 %:** el generador asigna variante, personalidad declarada y horario de actividad. Tener esos campos no prueba una inteligencia diferenciada.
- **9/10, 90 % de su fauna:** la rutina de movimiento consume personalidad tímida/curiosa y produce trayectorias distintas. Una comparación controlada de 120 segundos por especie, mismo jugador y variante, dio separación máxima de 24–28 unidades en esas nueve.
- **Tortuga:** no entra en la lista de movilidad; el ajuste de velocidad para tortuga dentro de la función queda sin alcanzar. Sigue teniendo respuestas a presión/contacto y actividad ecológica. Revisar su intención antes de decidir si camina o reacciona de otras formas.
- **Variedad profunda percibida:** no hay porcentaje global medido. Nueve animales comparten buena parte del motor; tres etiquetas de personalidad no bastan para afirmar comportamientos completamente únicos.
- Criaturas procedurales antiguas reciben rasgos de velocidad, masa, recuperación, timbre y otras variables; aves usan reglas de bandada. Estos sistemas aún no tienen una cobertura de conducta unificada.

Fuentes: `src/living-catalog.js`, `src/living-behavior.js`, `src/living.js`, `src/personality.js`, `src/vida-music.js`. Comprobación read-only con `behavior()` sobre las diez especies; sin cambios de código.

**Meta 100 %:** cada familia registrada tiene un perfil individual determinista que realmente modifica decisiones, expresión visual y respuesta musical dentro de sus capacidades. Es una meta de cobertura y diferencia comprobable; no una promesa de que jamás existan dos ejemplares parecidos.

## Objetivo

Llegar con facilidad a lugares cuya música se reconozca como otra propuesta: techno con blues, dub con jazz, disco con ritmos afro, ambient con cuerdas o electrónica andina con secuencias. No basta cambiar tono, tempo, nombre o semilla. Deben cambiar ritmo, bajo, armonía, articulación y textura de manera coherente.

Conservar fondo negro, objetos pequeños y música agradable. Abrir menús y tocar controles sigue siendo silencioso. Las mezclas frecuentes se descubren fácilmente; reliquias y encuentros especiales mantienen su rareza real.

## Fase M1 · Recetas con identidad audible

Definir una receta versionada: base electrónica, influencia principal, batería/groove, bajo, armonía, frase, instrumentación, producción, energía y espacios de silencio. Separar esta identidad de la semilla visual sin alterar posiciones antiguas.

Primer lote: unas 12–20 recetas completas y contrastantes. Ejemplos: minimal con blues, deep house con soul, dub techno con jazz, disco con percusión afro, IDM con cuerdas, ambient con texturas orgánicas. Son referencias creativas; no copiar grabaciones ni melodías reconocibles.

**Cierre:** comparaciones a volumen similar; una persona distingue propuestas sin leer su etiqueta.

### Extra M1 · ADN musical y ADN de conducta juntos

Dos niveles: la especie define lo que puede hacer; la semilla individual define qué prefiere y cómo decide. Rasgos: curiosidad, cautela, sociabilidad, paciencia, energía, horario, territorio, sensibilidad a movimiento/luz/sonido, memoria y preferencia musical. Rasgos continuos y estrategias compatibles sustituyen la dependencia de tres nombres.

La personalidad debe cambiar decisiones: esperar, acercarse, retirarse, investigar, responder, cooperar o buscar otro estímulo. Una planta puede abrirse, recogerse, transmitir o guardar una frase; una estructura puede tener umbrales y resonancias particulares. Personalidad no obliga a que todo se desplace.

Toda entidad recibe identidad estable y un flujo de semilla nuevo independiente; nada consume el RNG antiguo ni cambia posiciones o IDs existentes. Migrar rasgos anteriores y conservar vínculos ganados.

## Fase M2 · Mezclas compatibles, con una idea dominante

Una base marca el pulso y la estructura; una influencia aporta vocabulario musical. La mezcla puede apoyarse en ritmo, armonía, instrumentos o frase, con pesos controlados. Las combinaciones permitidas se curan: no mezclar todo con todo de forma aleatoria.

Ejemplo techno/blues: batería electrónica estable, bajo sincopado, frase de cuerda pulsada, pentatónica y pregunta/respuesta. Las blue notes son tensiones breves con resolución, no notas cromáticas arbitrarias encima de cualquier acorde. Versiones distintas pueden tener shuffle discreto, acordes cálidos o un carácter más seco y oscuro.

**Cierre:** cada híbrido conserva identidad, tono y transiciones agradables. Hay espacio y silencios, además de capas.

### Extra M2 · Temperamento que se escucha

Vincular conducta y arreglo: una criatura paciente responde después de escuchar; una impulsiva propone acentos breves; una social alterna frases con vecinos; una reservada aporta espacio o graves suaves. Dos ejemplares de la misma especie pueden elegir una articulación, frase, momento y papel distintos.

Las capacidades de especie y la receta limitan qué instrumentos/registros admite cada individuo. Cuerdas, pads, bajos y percusión se reparten con intención. Un director común mantiene tempo, armonía y presupuesto: no todos suenan a la vez ni las criaturas desplazan lo que crea el jugador.

## Fase M3 · Mundos cercanos que también sorprenden

Distribuir recetas por vecindarios con afinidad musical y bolsillos de contraste. Evitar largas caminatas donde cambie el paisaje y la música mantenga la misma firma. El tamaño visual de una región no obliga a que toda ella tenga una única receta musical.

Objetivos iniciales de diseño, pendientes de probar: novedades de frase/timbre cada 45–90 segundos al explorar y un paisaje musical reconociblemente distinto cada 2–4 minutos. Ajustar por fatiga; no imponer cambios bruscos a quien quiera quedarse creando en un estilo.

**Cierre:** un paseo corto ofrece descubrimientos distintos; quedarse en un lugar permite desarrollar su música.

### Extra M3 · Poblaciones con contraste visible

Distribuir perfiles contrastantes cerca sin llenar el paisaje: un curioso se acerca, otro escucha inmóvil, otro prefiere la lluvia o cierta frase. Grupos y horarios distintos producen encuentros; el mismo gesto no provoca una respuesta idéntica en todos.

Reservar refugios tranquilos y rutas de descubrimiento. Activar cálculo y voces solo cerca del jugador; poblaciones lejanas se actualizan con reglas acotadas, no simulando el universo entero. La rareza pertenece a condiciones reales, no a una etiqueta decorativa.

## Fase M4 · Llegar fácilmente y volver a lo que gustó

“Otro lugar” encuentra propuestas poco escuchadas y contrastantes, no solo coordenadas aleatorias. Un modo “Parecido” busca parentesco musical; “Sorpréndeme” ofrece mayor contraste. Mantener un control compacto, sin agregar un panel permanente ni sonidos de UI.

Guardar antes de viajar; conservar regreso y favoritos. Semilla, versiones, capa, coordenadas e identidad/versionado de la receta permiten volver a su carácter musical. La música sigue evolucionando: no se promete reproducir exactamente el mismo instante. Migrar WD1 y partidas antiguas sin borrar nada; no reintroducir escenas musicales guardables retiradas.

**Cierre:** comparar varios mundos rápido, reconocer qué se descubrió y regresar sin perder progreso.

### Extra M4 · Recordar lugares y relaciones

Favoritos conservan receta, coordenadas y versiones; los vínculos importantes conservan identidad, preferencias y frases aprendidas. La criatura puede reconocer la calma o un gesto compartido y contestar distinto al reencontrarse. Su posición o estado temporal puede variar.

Al viajar, se puede buscar contraste musical y de vida. Señales naturales —postura, mirada, inclinación, pulso local— sugieren intención sin flechas ni paneles permanentes. Aprendizaje de gestos mediante encuentros breves; no exigir menús, alimentación o mantenimiento.

## Fase M5 · Combinaciones que se sientan distintas

Multiplicar variaciones de ritmo, bajo, armonía, frase, instrumento y producción dentro de reglas compatibles. Selección determinista y extensible, con límites de registro, densidad y mezcla. Mantener un historial acotado de firmas escuchadas para reducir repeticiones próximas.

Una firma musical describe diferencias reales: patrón de batería, swing, papel del bajo, movimiento armónico, contorno de frase, articulación y espacio. Rechazar candidatos demasiado parecidos a los últimos; no usar el nombre del género como prueba de novedad.

Se puede aspirar a miles de recetas compatibles. La cifra se obtendrá de un catálogo/simulador real con deduplicación y reglas; no multiplicar variables correlacionadas ni afirmar miles de canciones perceptiblemente únicas sin escucharlas.

**Cierre:** auditoría de diversidad y escucha humana muestran contraste y ausencia de repeticiones cercanas, sin elevar la densidad continuamente.

### Extra M5 · Medir el 100 %, no contar campos

Crear un registro común de cobertura para fauna nueva, bandadas, mascotas, criaturas procedurales, flora y elementos interactivos. Cobertura = familias que pasan las pruebas de perfil activo / todas las familias registradas. Cada familia debe demostrar decisiones, expresión visual y respuesta musical diferenciadas; ningún rasgo cuenta si se almacena pero nunca se usa.

Ensayar varios individuos por familia con los mismos estímulos: acercamiento lento/rápido, toque, quietud, percusión, melodía, clima y vecinos. Comparar decisiones, trayectorias/posturas, latencias, aprendizaje, instrumentos, ritmo y silencios. Detectar genes sin efecto y perfiles casi idénticos; ampliar estrategias o corregir el motor.

Meta inicial por familia: al menos tres respuestas contrastantes observables en estímulos adecuados, con señales legibles y música diferenciable. Es criterio propuesto de aceptación, no un resultado actual. Confirmar con personas; las diferencias numéricas pequeñas no bastan.

## Fase M6 · Descubrimiento con vida y control creativo

Relacionar cada receta con flora, fauna, materiales y gestos. En un lugar los árboles sostienen cuerdas y las gotas percusión; en otro los árboles aportan bajos y las aves contestan frases. Los roles deben ser aprendibles durante la estancia.

Los objetos introducen, sustituyen o transforman capas con una respuesta local visible. Mostrar colores musicales propios; el dorado indica lo ganado. Culturas: investigar, documentar y relacionar música/materiales/vida con cuidado, sin etiquetar una síntesis como auténtica por su nombre.

Quietud: la receta desarrolla capítulos, silencios y nuevas frases por sí sola. Voz breve y opcional: puede anunciar “Techno con blues. Escucha las cuerdas.” o sugerir un gesto. La Bitácora registra identidad, lugar e influencia; tarjetas especiales solo para hallazgos realmente excepcionales.

**Cierre:** tocar y quedarse modifican la música de forma reconocible; teléfonos y nuevos jugadores confirman claridad, disfrute y ganas de volver.

### Extra M6 · Conducta que genera descubrimientos y juego

Cada especie ofrece interacciones claras y personalidades propias. Un ejemplar propone seguirlo a una textura nueva; otro contesta un motivo; otro reúne una pequeña banda; otro responde solo después de una escucha tranquila. La flora y los espacios modifican condiciones para esos encuentros.

La relación crece al explorar y crear, perceptible en movimiento, forma y sonido. Recordar lo importante sin barras ni castigos. La Voz describe observaciones reales; las tarjetas registran comportamientos o combinaciones excepcionales con lugar y condiciones, sin inventar probabilidades.

Aceptar el conjunto cuando personas nuevas reconocen distintos temperamentos sin etiquetas, escuchan las consecuencias de sus acciones, encuentran música diferente con facilidad y pueden volver a un vínculo. Revisar legibilidad móvil, fatiga, rendimiento y límites de voces antes de ampliar más contenido.

## Orden y validación

M1 → M2 → M3 → M4 → M5 → M6. Priorizar pocas mezclas realmente distintas antes de ampliar el catálogo. Una rama amplia por fase cuando Jay autorice empezar; integrar con las fases vigentes de PLAN_2.0 sin renumerarlas todavía. Música y conducta avanzan juntas en estas seis fases; no abrir seis ramas adicionales para el mismo trabajo.

Pruebas afectadas durante cada fase; auditoría y lógica completas antes de push de rama; CI completo antes de merge; suite completa una vez sobre el conjunto de publicación. Registrar rendimientos y hacer comparaciones a oído en teléfono. Audio finito y sin clipping no certifica variedad perceptible ni calidad artística.
