> **ARCHIVO HISTÓRICO — NO VIGENTE.** Conserva el texto de otra revisión; no certifica el estado actual ni autoriza ejecutar fases, pendientes o instrucciones. Consultar [traspaso actual](../../HANDOFF_CLAUDE.md) e [índice vigente](../README.md).

# Fase 6 · guardianes y exploración musical

Rama `feat/phase-06-cultural-exploration`, desde **main 8096c8d**, PR #77 de Claude. Una rama reúne revisión de base, primer bloque cultural, Vasto, paseo visible, laboratorio y mejoras de golondrinas. Jay prueba y crea PR/merge.

## Revisión de lo que dejó Claude

#75 añadió cuerdas/prisma/membrana, chorus/phaser/freeze, códigos WD1 y grabación de set; #76 añadió laboratorio, bandadas y flora; #77 cambió el control al cubo y añadió colores, quietud, experimentación y seis poderes. Las tres entregas ya están integradas. Aunque la última rama se llamó expansión-fase-06, **no contenía culturas**.

El dedo mueve el cubo o lanza su pulso; los objetos responden a su recorrido/contacto/quietud. `?dedo=1` conserva edición directa experimental. El código de Claude también activa ese modo con `navigator.webdriver`: por eso la regresión nueva desactiva explícitamente esa bandera para probar el control real. Edición fina de hilos/partes aún no tiene equivalente completo con el cubo.

El jardín modular y el rastro anteriores fueron retirados por Claude. Esta entrega conserva esa decisión y sus datos históricos; no recupera esos sistemas. Se corrigieron runners que pedían sus archivos eliminados, una URL antigua que llamaba al constructor del rastro, referencias de la lámina y tarjetas de Bitácora que seguían anunciando jardines activos. El control de códigos de lugar y Grabar set sí existen ahora; los documentos antiguos que los decían pendientes eran anteriores a #75.

## Ocho estudios y tres recuerdos por estudio

Son **creaciones sintéticas originales inspiradas en tradiciones**, no grabaciones ni obras de artistas reutilizadas, ni simulaciones etnomusicológicas completas. Se mantienen los 52 estilos del generador; estos estudios aportan encuentros/intervalos/ritmos, no ocho géneros nuevos.

| Estudio | Inspiración | Voz |
|---|---|---|
| Jardines del Altiplano | Pentatonía andina | Reed |
| Islas de bronce | Ensamble resonante inspirado en gamelan | Steel |
| Campanas de sabana | Campana y llamada/respuesta africana | Membrane |
| Patios del horizonte | Color hijaz en afinación temperada | Hollow |
| Voces del norte | Llamadas, respiración y paisaje nórdico | Bowed |
| Río de cinco notas | Desarrollo modal inspirado en tradiciones de India | Kalimba |
| Jardines de tinta | Escala in japonesa | Flauta |
| Cauces de cobre | Síncopa de cumbia electrónica | Clav |

Cada estudio tiene escala/ritmo, instrumento, color, marcas y un guardián pequeño original. No se afirma que todos los árboles/animales del bioma ya representen esa tradición; esa relación ecológica más profunda sigue pendiente. Compositores/reliquias históricas documentadas y más personajes/culturas quedan para ampliaciones, con revisión de recurso/licencia cuando corresponda.

### Cómo se juega

1. Encontrar un santuario: candidato en ~12 % de regiones terrestres, con stream `culture:*` propio. Se descarta si no encuentra destino terrestre en las tres coronas vecinas; no hay garantía por región ni un santuario obligatorio en el Origen.
2. Permanecer junto al guardián con música activa. Tras un segundo empieza su llamada de cuatro notas, con pequeñas marcas luminosas equivalentes. La etapa se reconoce solo al terminar el intervalo sonoro, no por tocar un botón. Pausa/mute/ocultación/escáner interrumpen la escucha incompleta.
3. Cruzar dos huellas **en orden**. La segunda conduce a una puerta de otra región terrestre. Después de la primera aparecen trazos locales espaciados en el recorrido; la brújula de las cajas acepta también estos objetivos.
4. Recorrer cuatro piedras con el cubo según la llamada. Cada entrada produce su nota; un error reinicia la respuesta o conserva su primer paso si corresponde. Quedarse encima no añade pasos. Salir de alcance/pausar limpia la respuesta parcial.
5. Al abrir, alcanzar el instrumento/reliquia. Se conserva Voz dormida, Semilla de ritmo y Resonancia antigua, una cadena de tres por estudio: **24 recuerdos posibles**. Cada capítulo propone otra ruta/orden. Volver al guardián permite escuchar y avanzar; al completar los tres puede volver a tocar su recuerdo.

`S.cultures` guarda colecciones 0–3 y hasta 96 etapas de santuario. Respuestas parciales, lección en curso y contactos son temporales. Normalización impide puertas abiertas sin escucha/huellas válidas; caché máxima 128, reconstrucción determinista tras expulsión/recarga. Las posiciones no sustituyen ni redistribuyen elementos anteriores.

El género y el ADN de la región permanecen. Las frases culturales comparten su raíz y se acotan al registro local, incluida la octava de vidrio. Durante la lección se retira el hook automático principal; volúmenes de respuesta contenidos. No se guarda una canción como escena ni se usa micrófono. Bitácora muestra estudios/recuerdos; cuatro logros responden a escucha, puerta, hallazgo y cadena completa.

## Vasto y paseo visible

- Layout de prueba **Vasto**: REG 20 × WCH 900 = **18.000 unidades por región**, para Original y Paisajes vivos. Clásico/Amplio y la partida habitual conservan claves y coordenadas. Vasto tiene guardado propio `preview-vasto`, perfiles de generación existentes y direcciones/códigos compatibles. Otra semilla propone Vasto; el tamaño está explícito en el selector.
- En el Mundo quedan dos controles compactos permanentes: **paseo y menú**. Paseo inicia/detiene wander, gira suavemente, propone cambios cada 40–90 segundos activos y mira el terreno hacia delante para evitar entrar al mar. Si no encuentra dirección segura espera; joystick/teclado recuperan el control. No crea jingle de UI.
- Destino/favoritos y pausa/cambio de capa conservan sus reglas. No hay nuevo teletransporte universal.

## Laboratorio y golondrinas

El laboratorio pasa de 32 casos presentes tras las retiradas de Claude a **54**: añade ocho guardianes, seis cajas/poderes, cuatro etapas de quietud y cuatro modos experimentales. Los textos explican el cubo. Cada guardián se fuerza solo en la prueba, con rutas terrestres reales. Cada poder se abre pasando el cubo por su caja; cambiar caso limpia los anteriores. Quietud permite comenzar en 20/90/200/300 segundos sin esperar; los modos experimentales se fijan solo dentro del laboratorio. Notas/veredictos/informe se conservan.

La tarjeta de prueba tiene altura acotada/desplazamiento para dejar accesible el dock en móvil. Las expectativas de regresión se actualizaron al control visible de paseo y al catálogo real, sin retirar comprobaciones de aislamiento o gestos.

Golondrinas:

- Hasta dos bandadas viajeras permanecen disponibles al cruzar regiones, en vez de desaparecer al salir del vecindario de su casa; adaptan el canto al ambiente actual.
- Dos minutos en formación, con confianza, movimiento y cercanía, dejan una caja de brújula. Registro de regalo por bandada acotado a 96; no se repite inmediatamente al recargar. Al reemplazar/reiniciar la partida se inicializa el registro, se vacían las bandadas viajeras y sus frases; la Bitácora cultural también acepta el estado nuevo antes del próximo cuadro.
- Con confianza señalan cajas cercanas con una marca local pequeña.
- Bandadas confiadas que se cruzan pueden responder a la frase de la otra por turnos, máximo tres notas y presupuesto de instalaciones compartido. No son dos capas continuas compitiendo.

## Claridad y base corregida

Las cajas y quietud añadían otra vez melodías +12/+24 semitonos sin respetar carácter. Se acotaron al registro audible del lugar y se usan sus paletas; regalos tienen una respuesta más breve, sin cascada de campanas altas. Quietud y poderes detienen respuestas con modal/ocultación; la quietud no acumula tiempo escuchado con audio silenciado/suspendido ni caminando. Cometa actualiza velocidad inmediatamente al obtenerse; velocidad y campo se limitan a la superficie del Mundo, sin acelerar el Camino ni silenciar el Estudio/otras capas.

El espejo conectado limita su segunda respuesta a una vez por compás, incluso si se recibe de nuevo el mismo paso. Glitch usa menos golpes, ruido de banda más baja y tono triangular con nivel menor; las voces experimentales tienen registro local y cents acotados. No se quita la experimentación ni se promete que todas las combinaciones gusten igual. El modo suave permanece. La escucha en un **teléfono real sigue pendiente**: la emulación y Web Audio offline comprueban funcionamiento/niveles, no altavoces, Safari real, fatiga o gusto.

## Verificación

Resultados de la entrega: **53 suites Node**; audio de los seis programas: **143 renderizados**, incluidos los **52 estilos** y 26 mezclas nuevas de exploración. Pico máximo de muestra **0,9576** y fracción de muestras ≥0,995 **cero** en estos escenarios. Los datos incluyen registro de instrumentos y escucha cultural realmente completada; [mediciones](../../scripts/phase-06-validation.json). La salida y retornos existentes también pasan sus comprobaciones de distorsión/filtro. No es una medición de true peak, loudness LUFS ni una escucha artística.

Esta entrega generó **124 vistas** de familias, incluyendo los guardianes y materia; la ampliación posterior de [mascota y cubo](MASCOTA_Y_CUBO.md) lleva el atlas vigente a **130**. [Atlas](../images/atlas-visual.png). Es una muestra, no todas las variantes ni todo encuentro generado.

Navegador: **36/36 recorridos aprobados**, más recarga offline con **91 módulos** y rechazo correcto de JavaScript ausente. Pruebas adicionales de guardianes/reinicio en 390×844 y 844×390 y de Bitácora móvil/escritorio también aprobadas tras los ajustes finales. Comandos: `npm test`, `npm run test:browser`, `npm run test:audio`, `python3 scripts/render-visual-atlas.py`.

La búsqueda nueva se verifica sin modo dedo en 390×844 y 844×390: escucha completa, mute, huellas, puerta, tres recuerdos, recarga, Vasto, botón auto y regalo de formación. Modelos prueban presencia rara, ocho estudios, rutas terrestres, secuencias y guardados acotados. Se mantienen capturas de compatibilidad de mapas y claves antiguas.

Audio añade `exploration_mix.py`: ocho estudios y mezclas densas de espejo conectado, grullas, quietud, campo/cometa/pincel/compañero, glitch/micro; normal/suave a 48/44,1 kHz. Se ejecutan también los 52 estilos y escenarios existentes. No confundir pico de muestras con master artístico.

## Qué sigue

Teléfono real; más relación cultura/biología/materiales, personajes y reliquias históricas investigadas; edición fina de encuentros por cubo; profundidad de recuerdos/Estudio e instalaciones; revisión del exceso de atmósfera y capas; narrativa/primera sesión, rendimiento y aceptación de V1. Ver [PENDIENTES.md](PENDIENTES.md).
