# Pulido de identidad, colección y música

Nuevo alcance solicitado por Jay después de integrar Experiencia viva. Base inicial: main `d7ea883`, PR #143, con F14 `b2faf63`. Jay integró fase 1 en main `30b2df8`, PR #144. El plan de nueve fases sustituye la organización inicial de seis, por petición expresa de Jay. No reiniciar los planes anteriores.

Una rama por fase; la siguiente parte de la anterior si todavía no está integrada. Codex hace commit y push; Jay crea PR y hace merge. Mantener la ascendencia reduce conflictos; un squash, rebase o cambio externo puede exigir resolverlos. Entregar y probar fase a fase.

| Fase | Rama | Alcance | Estado |
|---|---|---|---|
| 1 · Base de evaluación | `feat/pulido-01-medicion` | Medición y referencias internas | En main, PR #144 |
| 2 · Dirección musical | `feat/pulido-02-direccion-musical` | Identidades, articulación y espacios musicales | Implementada y probada; entrega en esta rama |
| 3 · Territorios coherentes | `feat/pulido-03-territorios` | Música, materiales, color, habitantes y fusiones | Implementada y probada; entrega en esta rama |
| 4 · Interacciones musicales | `feat/pulido-04-interacciones` | Gestos, estilos y paseo opcional | Implementada y probada; entrega en esta rama |
| 5 · Ambiente vivo | `feat/pulido-05-ambiente` | Ensambles, redes y color distante | Implementada y probada; entrega en esta rama |
| 6 · Cubo e interfaz | `feat/pulido-06-cubo-ui` | Personalización reversible y móvil | Implementada y probada; entrega en esta rama |
| 7 · Colección y tarjetas | `feat/pulido-07-coleccion` | Hallazgos, utilidad, procedencia y regreso | Pendiente |
| 8 · Exploración y aprendizaje | `feat/pulido-08-exploracion` | Pistas, memoria reciente y contraste | Pendiente |
| 9 · Curaduría y cierre | `feat/pulido-09-cierre` | Auditoría conjunta y escucha | Pendiente |

## Contrato común

- Negro, Geist Mono, esquinas rectas, selección blanca y dorado para lo ganado. Una indicación breve por momento; textos de interfaz de hasta doce palabras.
- UI silenciosa. Los instrumentos se prueban en un espacio musical deliberado; seleccionar opciones no reproduce notas.
- Conservar todo el progreso, también campos desconocidos y guardados futuros. Cosméticos sin ventajas de poder.
- No mover mapas, favoritos o premios existentes ni consumir sus flujos aleatorios. Buscar novedad seleccionando lugares que ya existen.
- Separar presencia, proximidad, interacción y premio. Una tasa espacial o una simulación no es una probabilidad horaria de jugadores.
- Primero escuchar y organizar lo existente. Las cantidades de catálogo no equivalen a canciones perceptualmente diferentes.
- Por fase: auditoría y Node completos; navegador y renders de audio afectados. Conjunto final: suites completas. CI, teléfono físico y deploy se informan por separado.

## Fase 1 · Base reproducible

### Entrega

- `scripts/encounter-model.mjs`: una hora potencial de exploración o quietud; usa los generadores reales de población, expansión, percusión, reliquias, cajas, bandadas, plantas y santuarios. Conserva la generación acuática y la elegibilidad marítima de las reliquias.
- `npm run audit:encounters`: ejecuta ambos perfiles en seis semillas, con 192 rutas por perfil por defecto. Exporta JSON mediante `--output`. No lee partidas ni entrega premios.
- Exploración: 30 minutos de desplazamiento nominal a 190 unidades/s y 30 de escucha, radio de proximidad 180, superficie. Quietud: una hora en el punto inicial; no inventa nuevas tiradas espaciales por esperar.
- Cada tipo cuenta una vez por ruta. Exporta proporciones e intervalos de Wilson; no convierte un tipo no observado en imposible. Las rutas comparten semillas: los intervalos no cubren todos los errores del modelo.
- `src/listening-reference.js`: diez parejas sobre destinos existentes. Percusión, blues, fiesta, grave/espacio, cuerda/tecla, aire/arco, filtros, óptica y quietud.
- Laboratorio → Notas → Escucha comparada. Seleccionar una pareja es silencioso; A/B abre el destino existente. Usa las notas y veredictos locales del laboratorio. El informe aclara cuando falta evaluar un lado.

### Límites

Las fuentes se muestrean en su posición inicial. No se simulan movimientos de criaturas, clima, niebla, atención humana, mezcla audible o resolución de reliquias. Los inicios son lugares terrestres aleatorios, no el tutorial. Las claves del informe mezclan funciones de diagnóstico, géneros y familias; su cantidad no cuenta nuevos elementos del juego. No se modelan Saltar, poderes ni modificadores de velocidad. El resultado representa oportunidades potenciales; no tarjetas ganadas ni probabilidades universales por hora.

### Herramienta opcional de revisión

No es tarea del jugador ni requisito para continuar. Las siguientes fases se prueban jugando; estas comparaciones permiten investigar diferencias concretas.

1. Abre el preview con `?dev=1` y entra en Prototipo → Laboratorio.
2. Abre Notas → Escucha comparada. Elige Golpe y raspado.
3. Entra en A, escucha y mueve el cubo. Compara Solo y mezcla.
4. Anota lo que funciona o falla; prueba B con el mismo volumen.
5. Copia o descarga el informe. La partida habitual permanece separada.

Repetir con Dos fiestas, Grave y silencio y Cuerda y tecla. Escuchar 90 segundos por lado, sin subir el volumen para favorecer una opción. No se presume escucha física completada.

### Resultado

Aprobados: `npm run audit:release` (0 errores y 0 advertencias), `npm test` (115 suites), `listening_reference_smoke.py`, `lab_smoke.py` (246 destinos), `ui_silence_smoke.py` (móvil y escritorio) y `offline_smoke.py` (177 módulos). Modelo: 192 rutas por perfil, 384 en total; evidencia en `scripts/pulido-01-encounters.json`. Registro de validación: `scripts/pulido-01-validation.json`.

No se modifica síntesis ni mezcla; no se repite audio para esta fase. Suite completa de navegador, CI, deploy y escucha física no se presentan como ejecutados. La revisión de móvil físico conserva el procedimiento anterior.

## Fase 2 · Dirección musical

**Objetivo:** electrónica con cuerpo, groove y personalidades reconocibles. Lo etéreo queda como una posibilidad concreta del universo.

**Implementación:**
- Auditar instrumentos, registros, colas, eco, reverberación, pads y mezcla acumulada.
- Definir perfiles de producción: pulso seco, grave, cálido, orgánico, mecánico, quebrado, cuerdas, disco, cinta, dub y espacios abiertos compatibles.
- Quitar el órgano/pad automático de fondo. Los instrumentos sostenidos siguen disponibles mediante fuentes musicales concretas.
- Volumen directo en menú, sincronizado con Sonido, con guardado de 0–100%. Aumentar ganancia general 1,5× antes del limitador; fader final para música, colas y FX, compartido por la grabación. UI silenciosa.
- Dar protagonistas distintos a cada carácter. Mantener las 52 etiquetas y sus ritmos; profundizar su interpretación.
- Ajustar ataque y duración del arreglo, con límites de registro, preservando pausas y tempo.
- Reemplazar aumentos genéricos de eco/niebla/quietud por decisiones acotadas del estilo. Mantener efectos voluntarios y anomalías explícitas.
- Compartir decisiones de tratamiento entre radio y fuentes locales sin tocar el máster.

**Aceptación:** diferencias de ritmo, timbre, articulación y acústica; los gestos siguen siendo audibles y las mezclas densas conservan margen. Renderizar perfiles y comprobar colas cortas frente a espacios abiertos. Escucha física se declara aparte.

**Prueba como jugador:** abre el preview, entra al Mundo y usa Saltar para recorrer distintos lugares. Escucha el cuerpo del ritmo, el ataque de instrumentos y el espacio entre notas. Permanecer quieto ya no debe convertir automáticamente todo en eco. Tocar objetos sigue aportando voces. Ambient/cosmic pueden conservar amplitud. No necesitas comparar A/B ni escribir informes para jugar.

**Entrega técnica:** `music-direction.js`, salas de 0,32/3,2 s, retornos por estilo, once paletas y articulación de radio viva. No incorpora nuevos géneros ni mueve fuentes del mundo.

**Validación:** auditoría sin errores/advertencias, 116 suites Node, ocho programas de navegador afectados y 84 renders de cuatro programas de audio aprobados. Pico máximo 0,932219; 0% produce silencio y 50% reduce la señal a la mitad. Evidencia: `scripts/pulido-02-validation.json`. Escucha física, CI y deploy separados.

## Fase 3 · Territorios coherentes

**Objetivo:** que un lugar se vea, se comporte y suene como un ecosistema.

**Implementación:**
- Vincular el carácter musical a las familias visuales existentes, sus materiales, color localizado y densidades.
- Reducir los fondos geométricos repetidos: zonas despejadas y zonas de textura tenue con transición gradual, sin eliminar elementos interactivos.
- Combinar una identidad principal con aportes secundarios compatibles; usar voces, ritmos y fraseos existentes antes de sumar etiquetas.
- Favorecer agrupaciones de especies afines y diferencias individuales; mantener vacío y refugios.
- Mantener rasgos compartidos entre vecinos y transiciones suaves; conservar semilla, coordenadas, reliquias y ejemplares raros.
- Expresar las fusiones mediante comportamiento y respuesta musical, sin superponer dos canciones completas.

**Aceptación:** reconocer territorios por imagen y sonido; no convertir todo el mapa en una mezcla uniforme. Mapas anteriores y direcciones regresan al mismo sitio.

**Implementado:** campo continuo de claros y texturas sobre todas las capas decorativas principales, caché acotada y transición gradual. Orquesta primaria/secundaria coherente entre vecinos. Entradas de acordes breves en estilos armónicos, separadas por ocho compases y respetando descansos; no se restablece un órgano continuo. Sala y eco se mezclan en fronteras. Las fuentes físicas y las rarezas permanecen intactas.

**Prueba como jugador:** usa Saltar o camina hasta pasar entre un claro y una zona de textura. Los elementos musicales siguen respondiendo. Escucha cómo entra alguna voz secundaria y cómo cambia el espacio al acercarte a otro territorio. No hace falta usar A/B.

**Validación F3:** auditoría sin errores/advertencias, 117 suites Node, ocho programas de navegador y treinta renders de audio aprobados. Pico máximo 0,943133. Evidencia: `scripts/pulido-03-validation.json`. Escucha física, CI y deploy separados.

## Fase 4 · Interacciones musicales

**Objetivo:** entender la acción, identificar su fuente y disfrutar su aporte.

**Implementación:**
- Revisar por familia pasar, permanecer, rodear, tensar, soltar y responder.
- Distribuir bajo, percusión, acordes, melodía y transformación según territorio y ejemplar.
- Respuesta visual inmediata pequeña; respuesta audible coordinada con el reloj musical.
- Reservar espacio selectivo en el acompañamiento, sin elevar todo el volumen.
- Mostrar tensión para cuerdas, deformación para membranas y respiración para sostenidos.

**Aceptación:** identificar el aporte del gesto sin manual; contacto sostenido no provoca ráfagas accidentales, ni atraviesa pausas/menús/cambios de capa.

**Ampliación autorizada durante F4:** selector Estilos en producción con búsqueda de destinos reales y marca de escuchado desde el registro audible existente; paseo con pulsos opcionales cada 12–22 segundos activos. Sin notas por botones, sin completar el Camino desde el selector y sin premios manuales por pulsos automáticos. Los gestos conservan prioridad visual y atenúan selectivamente el acompañamiento.

**Validación F4:** auditoría sin errores/advertencias, 118 suites Node, seis programas de navegador y 29 renders de audio aprobados. Pico máximo 0,904554. Evidencia: `scripts/pulido-04-validation.json`. En teléfono: Mundo → Estilos → busca un género → viaja; abre de nuevo tras escucharlo. Activa Paseo y alterna Pulsos: sí/no. CI/deploy/escucha física separados.

## Fase 5 · Ambiente vivo

**Objetivo:** un entorno que participa musicalmente y deja respirar.

**Implementación:**
- Relacionar lluvia, agua, viento, semillas y aleteos con cuerpos y articulaciones diferenciadas.
- Ampliar la percepción de percusión grave/media y respuestas naturales existentes.
- Alternar escucha, llamada, respuesta y descanso de habitantes.
- Evolucionar en quietud mediante fraseo, retirada de capas y pequeños cambios del arreglo.
- Acotar fuentes simultáneas, repetición y actividad; no llenar las zonas tranquilas.

**Aceptación:** permanecer varios minutos y reconocer desarrollo; cambiar de ambiente sin saltos de volumen ni acumulación de agudos.

**Dirección definitiva pedida por Jay:** un solo motor electrónico de producción, sin elegir vivo/clásico. Semillas con bandas de 1–10 partes y baterías nativas reconocibles, kits diferentes, progresión compartida y fraseo estable. La rareza o el movimiento no son requisitos para escuchar una banda completa. Mantener lugares sutiles y silencio deliberado; Campo de escucha atenúa la base y las zonas experimentales ya no eliminan su batería. El selector ofrece un viaje a un ensamble completo existente. Escucha física separada de métricas automáticas.

**Peticiones incorporadas a F5:** manchas multicolor tenues, localizadas y graduales como galaxias lejanas; territorios ricos en redes conectables sin alterar los elementos anteriores. Ensambles complementarios en algunos territorios, conservando otros mínimos. Motivos reconocibles y desarrollo por frases: sorpresa armónica y tímbrica, evitando punteos automáticos sin continuidad.

**Validación F5:** auditoría sin errores/advertencias, 120 suites Node, doce programas de navegador y 87 renders de audio aprobados. Incluye los 52 estilos, un acompañamiento de un instrumento y bandas con diez partes que emiten al menos diez timbres sin tocar objetos, también drum & bass rápido. Pico máximo 0,933802. Evidencia: `scripts/pulido-05-validation.json`. En teléfono: Mundo → Estilos → Escucha un ensamble completo; prueba también Explora redes musicales y Paseo. No requiere modo desarrollador. CI/deploy/escucha física separados.

## Fase 6 · Cubo e interfaz

**Objetivo:** una identidad personal clara que convive con el paisaje.

**Implementación:**
- Organizar Apariencia, Movimiento y Voz; conservar IDs y propiedad.
- Vista previa real, prueba reversible y aplicación coherente.
- Diferenciar equipado, ganado y bloqueado; condiciones breves y piezas ganadas primero.
- Conservar el blanco y la silueta del cubo; cosméticos sin ventajas de poder.
- Revisar móvil, foco, objetivos táctiles, contraste y movimiento reducido. Sin sonido de interfaz.

**Aceptación:** probar, comparar, restaurar y salir sin pérdida de configuración; acceder con teclado, lector y teléfono pequeño.

**Validación F6:** auditoría sin errores/advertencias, 120 suites Node, siete programas de navegador y cuatro renders de audio aprobados. Pico máximo 0,873580. Evidencia: `scripts/pulido-06-validation.json`. En teléfono: Menú → Tu cubo; prueba piezas, cambia pestaña y cancela. Reabre, prueba y aplica. Restaurar blanco no consume premios. Sonido → Energía cambia la intensidad sin seleccionar otro género. CI/deploy/escucha física separados.

## Fase 7 · Colección y tarjetas

**Objetivo:** encuentros con significado, recuerdo y utilidad musical.

**Implementación:**
- Frente con retrato, nombre, rareza y función; detalle con procedencia, condiciones y vuelta.
- Celebración local proporcional; repeticiones discretas y registro íntegro.
- Diferenciar tipo nuevo, ejemplar distinto e interpretación aprendida.
- Mejorar álbum y conexión con jardín/técnicas existentes; nunca consumir tarjetas.
- Distinguir presencia, despertar y premio; probabilidades con su unidad real.

**Aceptación:** entender qué se encontró, por qué importa y qué hacer con ello. Los avisos permiten seguir jugando; versiones futuras y datos desconocidos sobreviven.

## Fase 8 · Exploración y aprendizaje

**Objetivo:** descubrir nuevas maneras de hacer música sin tareas obligatorias.

**Implementación:**
- Enseñar un gesto mediante señales y situaciones; instrucciones breves solo cuando hagan falta.
- Memoria reciente de timbres, funciones y paisajes para sugerir contraste.
- Saltar selecciona destinos existentes; no modifica rarezas ni crea premios por menú.
- Pistas y relaciones optativas entre habitantes, objetos y lugares.
- Guardar y volver desde el contexto, con direcciones completas y controles sencillos.

**Aceptación:** descubrir tres acciones distintas sin manual y volver al lugar deseado conservando progresión.

## Fase 9 · Curaduría y cierre

**Objetivo:** comprobar la experiencia integrada, no declarar perfección por cantidad de contenido.

**Implementación:**
- Seleccionar recetas mediante escucha comparable: groove, fraseo, fatiga, claridad, espacio y deseo de quedarse.
- Ajustar mezclas débiles o repetitivas conservando historial y descubrimientos.
- Recorrer tutorial, mundo, cubo, tarjetas, jardín, guardar y regresar.
- Auditoría y Node completos; suites completas de navegador/offline y audio sobre el conjunto.
- Registrar CI, artefacto desplegado, teléfonos y escucha larga por separado.

**Aceptación:** pruebas verdes, límites explícitos, progreso conservado y procedimiento para cada comprobación externa. Una métrica automática no acredita gusto musical ni masterización profesional.
