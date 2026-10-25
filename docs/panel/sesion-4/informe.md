# Kubono · cuarta sesión del panel creativo

**Código alpha.174 · revisión de juego 04ae8bdd · main base 676ac511.** Rama de auditoría `audit/panel-4-cierre`, dependiente de `fix/cubo-pequeno`.

Diez lentes **simuladas**, no opiniones reales de sus creadores ni diez evaluadores humanos. Las notas son juicios de diseño apoyados en código, capturas, pruebas y modelos. **No son una certificación de calidad ni de publicación.**

## 1. Resultado y comparación

| Lente | Visual | Audio | Creat. | Sensación | Cohesión | Pulido | Media | Anterior |
|---|---|---|---|---|---|---|---|---|
| Tetsuya Mizuguchi | 8,0 | 7,5 | 8,5 | 8,0 | 8,0 | 7,5 | **7,9** | 7,7 |
| Toshio Iwai | 7,5 | 7,5 | 8,5 | 8,0 | 7,5 | 7,5 | **7,8** | 7,4 |
| Masaya Matsuura | 7,5 | 8,0 | 8,5 | 8,0 | 8,0 | 7,5 | **7,9** | 7,8 |
| Simogo | 8,0 | 7,5 | 8,5 | 7,5 | 8,0 | 7,5 | **7,8** | 7,7 |
| Ed Key y David Kanaga | 8,0 | 8,0 | 8,5 | 7,5 | 7,5 | 7,5 | **7,8** | 7,3 |
| Jenova Chen | 7,5 | 8,0 | 8,0 | 7,5 | 7,5 | 7,0 | **7,6** | 7,7 |
| Conrad Roset | 8,0 | 8,0 | 8,5 | 7,5 | 8,0 | 7,5 | **7,9** | 7,3 |
| Ken Wong | 7,5 | 8,0 | 8,0 | 7,5 | 7,5 | 7,0 | **7,6** | 7,4 |
| Lucas Pope | 7,5 | 8,0 | 8,0 | 7,5 | 7,5 | 6,5 | **7,5** | 7,2 |
| Austin Wintory | 7,5 | 7,0 | 8,5 | 7,5 | 7,5 | 7,0 | **7,5** | 7,8 |
| **Panel 4** | 7,7 | 7,8 | 8,4 | 7,7 | 7,7 | 7,3 | **7,7** | 7,5 |
| Panel 3 | 7,3 | 8,5 | 8,2 | 7,3 | 7,1 | 6,9 | **7,5** | |
| Panel 2 | 7,0 | 8,3 | 8,0 | 6,9 | 6,4 | 6,6 | **7,2** | |
| Panel 1 | 6,5 | 7,9 | 7,9 | 5,6 | 4,8 | 6,1 | **6,4** | |
| Meta vigente | 8,5 | 9,0 | 9,0 | 8,5 | 8,5 | 8,5 | **8,7** | |

Media calculada sobre las sesenta notas originales, no sobre filas ya redondeadas. [Datos de puntuación](evidencia/notas.json).

**La versión mejora en lectura, respuesta y cohesión. El audio se reevalúa a la baja:** el feedback de Jay y los nuevos contratos muestran que un cierre puede tener volumen correcto y aun sonar ajeno o incluir notas fuera de escala. La mayor cobertura también revela fallos de persistencia y un CI rojo. No se compensan esos hallazgos contando más funciones.

El cubo pequeño está implementado y probado en la rama previa. Las propuestas J1–J7 siguientes **no están implementadas ni aprobadas por este informe**. La auditoría está completa; el ciclo de correcciones y aceptación permanece abierto.

## 2. Material que se revisó

- **16 capturas** a 390×844, con hostname `kubono.localhost` y `navigator.webdriver=false`. Ninguna activa `body.dev`. [Mosaico](capturas/contacto.png), [originales y manifiesto](capturas/manifest.json).
- **60 estados de UI**: quince superficies en 320×568, 390×844, 844×390 y 1280×800. Cero errores de página o desbordamientos en las superficies medidas; sin texto DOM visible menor de 11 px ni áreas activadoras menores de 24 px en esas muestras. No es una certificación de todas las combinaciones. [Datos](evidencia/ui-medidas.json), [mosaico](capturas/ui-contacto.png).
- **240 suites Node**, auditoría estática y recorrido de trece piezas de cara/hábitos/accesorios aprobados en la rama del cubo.
- **Tacto real de navegador:** `player_touch_smoke.py` aprueba Camino, diez cristales, llegada al Mundo y continuidad tras un fotograma fallido. No es un teléfono físico ni una persona.
- **11 renders de cierres** aprobados: pico máximo 0,573, sin clipping y silencio de al menos −109 dBFS en la muestra. Usan una base de prueba, no todos los arreglos de producción. [Datos](evidencia/cierres-audio.json).
- **Modelo de dos horas** y contratos de armonía/persistencia/latencia. [Modelo](evidencia/progresion.json), [contratos](evidencia/contratos.json), [sonda reproducible](contratos.mjs).
- **CI consultado, no supuesto:** [run 40139955994](https://github.com/Jaywrkr/WHITEDOT/actions/runs/40139955994) del main base. Lógica y tres grupos de audio verdes; navegador 1, 3 y 4 rojos. El detalle de logs quedó bloqueado por el proxy (403), así que no se atribuye una causa a sus recorridos. [Registro](evidencia/ci-base.json).

Las herramientas esperan la entrada al Mundo, respetan la puerta normal de cuenta y usan guardados de prueba propios. Fuerzan estados/paneles para inspeccionarlos; no simulan la comprensión ni la diversión de una persona. No se comprobó Vercel, tiendas, latencia física ni Supabase en producción.

## 3. Conclusiones integrales

### El cierre musical todavía contradice la intención de Jay · A01–A03

Mizuguchi, Iwai, Simogo, Proteus y Wintory convergen en esta prioridad. `src/journey-victory.js:7,17,21–42` conserva una selección propia de leads, ruido ascendente, crash, silencio global y tema agudo. Que siga el tempo no convierte esos timbres en parte del arreglo que el jugador ya oye.

Hay además dos ejemplos reproducibles, no solo una preferencia:
- `src/song.js:28`: Cristales resta tres semitonos a una nota del acorde. Sobre La–Do–Mi produce **Do♯ (MIDI 73)**. También falla sobre un acorde menor diatónico en la escala mayor de Prisma.
- `src/song-stage.js:52`: la segunda pasada suma siete semitonos fijos; en La menor convierte **Si en Fa♯**.

Las capas se reutilizan en cierre, trofeo y canción; la corrección debe comprobar los tres recorridos. La tarjeta de una ronda se programa a **1,2 s** (`src/places.js:95`), mientras el cierre actual dura unos **6 s a 120 BPM**. Se debe comprobar también el paso a otro lugar mientras siguen notas antiguas programadas.

**Recomendación:** una variación breve de una voz/capa que ya esté sonando, en el acorde y compás actuales, reconocible después en Tu canción. Mantener la radio, los géneros y los instrumentos de base que le gustan a Jay. Sin remate genérico obligatorio.

### La integración también necesita contratos de datos · D01–D02, S01

La lente de Pope encuentra un fallo que las 240 suites actuales no cubren: con `save()===false` al cerrar una ronda, `placeFinish` devuelve éxito, concede dos estrellas y 120 chispas en RAM; la copia guardada aún tiene cero. No se afirma que ocurra en toda partida: se reproduce con una persistencia simulada que falla. Un aviso del guardador central no vuelve durable ese premio.

Un formato futuro `{version:9,unknown:'keep'}` conserva sus datos, pero el lector `places()` lanza `SyntaxError`. Debe existir una vista segura de incompatibilidad.

El CI base tiene tres grupos de navegador fallidos. La auditoría local enfocada no los vuelve verdes. Antes de cerrar una versión hay que identificar sus flujos y causas y comprobar el candidato completo.

### El problema de UI es de significado y recorrido, además de apariencia · U01–U04

Wong, Roset, Simogo, Matsuura, Pope y Chen tienen aquí material concreto:
- **Viaje** nombra campaña, pestaña de chispas/saltos y selector de densidad visual. **Lugares** puede ser el anillo de retos o mapa/favoritos de la Bitácora.
- La guía mantiene cuatro experiencias anteriores y dirige a Tu cubo → Viaje, mientras la campaña y el anillo ya tienen un siguiente paso calculable.
- La hoja enfatiza **★ 5/33**, aunque ganar requiere completar **once lugares** y 33 es la versión maestra. El código distingue ambas cosas; la jerarquía principal debería hacerlo también.

[Guía actual](capturas/ui-guia.png) · [Tu cubo](capturas/ui-cubo-viaje.png) · [Once lugares](capturas/ui-lugares.png).

En las capturas normales **Prototipo y el catálogo técnico están ocultos correctamente** (`src/release-ui.js:9`, `styles/estilo-j.css:105–108`). El Laboratorio de la guía es una práctica real de escuchar/responder (`src/lab-learning.js:8`), no el panel de desarrollo: conviene nombrarlo según su acción, no eliminarlo por una búsqueda de palabras.

`deploy sin registrar` es el fallback del cliente local sin sellar. No se presenta como fallo probado de Vercel. El acabado de producción debe ordenar la terminología y la ubicación del diagnóstico, conservando trazabilidad y sin declarar una salida que no ha ocurrido.

### El modelo detecta una meseta, pero no demuestra abandono · P01

| Perfil | Completa once | ★ a 120 min | Mayor hueco sin nueva capa |
|---|---|---|---|
| 60 % | 39,9 min | 11 | 80,1 min |
| 75 % | 35,5 min | 28 | 10,7 min |
| 90 % | 32,9 min | 33 | 5,6 min |
| Sin sonido | 38,2 min | 11 | 81,8 min |

Chen, Iwai y Proteus piden distinguir **terminar la campaña** de **seguir creando**. `src/places.js:94` ya actualiza tus notas al rejugar; el mundo también evoluciona. El modelo solo cuenta ciertos eventos: no prueba ochenta minutos de audio idéntico ni predice científicamente que alguien abandone.

**Recomendación:** hacer visible/audible la variación personal que ya se conserva y explicar qué queda tras ganar. Mantener los umbrales 75/70 % aprobados. No resolver una métrica con nuevas monedas, compras contadas como música o contenido adicional.

### La sincronía mejoró y todavía tiene un límite verificable · T01

I3 programa el acento junto a la nota, pero `landDelay` limita a 250 ms mientras `outputLatency` admite 400 ms (`src/journey-pulse.js:24–25`). Ese caso deja el acento al menos 150 ms por delante del oído. La prueba es matemática; no se declara una medición de Bluetooth.

Conservar una respuesta inmediata de contacto y ligar el acento musical al instante de salida estimado. Confirmarlo en un teléfono real.

## 4. Decisiones que sí corresponden a Jay

| Tema | Recomendación |
|---|---|
| Sonido de cierre | Ya está decidida la dirección: detalle de la música presente, luego reconocible en Tu canción. Jay escucha la propuesta terminada en J2. |
| Cubo | Dirección ya decidida e implementada. Confirmar en teléfono el rango pequeño, con caras y movimiento reducido. |
| Después de ganar | Tratarlo como continuidad creativa y exploración de lo ya construido. Medir nuevas frases y disfrute; no exigir infinitas estrellas para validar el mundo abierto. |
| Puntuación aceptable | Mantener la meta existente de **8,7** y sus objetivos por eje, junto con cero P0/P1 abiertos, candidato verde y aceptación humana. Un 10 simulado por sí solo no cierra una versión. |

## 5. Plan propuesto · una rama por fase tras autorización

El alcance es **mejorar e integrar lo existente**. La música base, mapas, progreso y catálogo se conservan. Las ramas se encadenan cuando su dependencia aún no está integrada.

| Fase | Rama propuesta | Qué cambia | Bien cuando |
|---|---|---|---|
| **J1 · Base fiable** | `pulido/j1-base-fiable` | S01, D01, D02: diagnosticar los tres grupos rojos, hacer durable el premio de ronda y leer estados futuros con seguridad | Flujos fallidos identificados y reproducidos; fallo de guardar no produce éxito no durable ni duplicados; formato futuro intacto sin excepción; candidato con checks requeridos verdes |
| **J2 · Cierre dentro de la música** | `pulido/j2-cierre-musical` | A01–A03: sustituir el remate externo por una variación del arreglo presente; corregir notas de capas/final y coordinar resultado/cambio de lugar | Cierre, trofeo y Tu canción comparten contribución; marcos armónicos válidos en regiones reales; sin notas antiguas sobre la siguiente escena; renders afectados y escucha de Jay aprobados |
| **J3 · UI de producción** | `pulido/j3-interfaz-produccion` | U01–U02: vocabulario único, hojas coherentes, práctica con nombre claro, diagnóstico en su lugar y gates de desarrollo comprobados | Ruta normal sin herramientas o rótulos de demo; funciones útiles conservadas; móvil/horizontal/escritorio, teclado y movimiento reducido; sin sonido implícito en controles |
| **J4 · Una meta actual** | `pulido/j4-meta-compartida` | U03–U04: guía, menú, resultado y Refugio leen capítulo/siguiente lugar real; once completos y 33 maestría separados de la moneda | Un mismo estado propone un mismo destino en todas las superficies; jugador nuevo distingue terminar, dominar y comprar; camino guardado intacto |
| **J5 · Continuidad creativa** | `pulido/j5-continuidad` | P01: hacer perceptible lo que cambia con tus notas y reutilizar prácticas, trofeos y mundo abierto después de ganar | Variación personal demostrable por datos y audio; reglas de estrellas conservadas; modelo distingue capas, frases y compras; interés contrastado con personas |
| **J6 · Un solo instante** | `pulido/j6-sincronia` | T01: contacto y acento musical con sus tiempos correctos; revisar transiciones y latencias altas | Pruebas con 0–400 ms y pausas/cambio de salida; acento ligado a salida estimada; aceptación en teléfono y movimiento reducido |
| **J7 · Cerrar y reevaluar** | `pulido/j7-cierre` | V01: regresar a cada ID, repetir medidas comparables, sesión 5 del mismo panel y prueba humana del candidato | Criterios y evidencias cerrados; suite completa verde; Jay acepta cubo/música; sesiones humanas documentadas; puntuación y límites publicados sin afirmar un deploy no verificado |

Los cierres de J2 no se arreglan solamente bajando volumen; sus renders actuales ya tienen margen. J3 tampoco consiste en ocultar funciones por el nombre de un archivo.

## 6. Ciclo de cierre para conservar todos los pendientes

El registro canónico es [seguimiento.json](seguimiento.json): **14 hallazgos** con ID, evidencia, estado, prioridad, fase y criterio. K01 está corregido técnicamente; su aceptación física permanece en V01.

1. **Aprobar alcance y decisión pendiente.** No convertir cada idea de un perfil en una función.
2. **Reproducir antes de corregir.** Añadir la regresión adecuada al implementar, sin desactivar pruebas.
3. **Corregir y comprobar el mismo criterio.** Registrar revisión, comando, resultado y límites junto al ID. Una nota narrativa no lo cierra.
4. **Verificar la integración.** En premios: jugar → ganar → escuchar → conservar → volver a oír, con recarga y fallo de escritura. En UI: misma meta y mismo destino.
5. **Reevaluar sobre una instantánea nueva.** Mismos diez perfiles y seis ejes, capturas normales y modelos comparables. Las notas pueden subir o bajar; se actualizan por evidencia, no por la necesidad de llegar a 10.
6. **Cierre humano y técnico.** Cero bloqueos abiertos y aceptación del candidato. Hasta entonces el siguiente ciclo conserva estas tareas, en vez de abrir otra expansión.

**El panel 5 deberá volver a cada ID**, explicar qué evidencia cambió y conservar los no resueltos. No basta con que una fase diga «hecha».

## 7. Fuera del ciclo y límites de lanzamiento

Nuevos animales, biomas, instrumentos, retos, sistemas sociales y otros catálogos esperan. No se cambian Supabase, SQL, cuentas de tienda o servicios de pago: siguen en sus guías y en pausa cuando corresponde. El proyecto aún no está publicado en tiendas.

Hay feedback de Jay sobre el cierre y la UI, pero faltan sesiones documentadas con personas nuevas y escucha instrumentada de estos cambios en teléfono. La auditoría recomienda, mide y registra; **no garantiza una puntuación de 10 ni una experiencia humana por simulación**.

### Entrega y prueba breve

1. PR de `fix/cubo-pequeno` primero; revisión de juego `04ae8bdd`.
2. PR de `audit/panel-4-cierre` después; su dependencia es esa rama y añade documentación/herramientas de auditoría, sin otro cambio del juego.
3. En el preview del cubo, abrir una partida normal, caminar y equipar una cara ya disponible. Confirmar tamaño y lectura; no hace falta añadir `?dev=1`.
4. Revisar J1–J7 y decidir el ciclo. La reparación de los cierres musicales sigue como propuesta J2.
