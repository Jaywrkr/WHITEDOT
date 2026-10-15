# Plan WHITEDOT 2.0

<!-- laboratorio-vivo -->
## Laboratorio Vivo · ciclo actual

[Plan autorizado](PLAN_LABORATORIO_VIVO.md). Una rama por fase; continuar sin confirmaciones intermedias. Jay mantiene PR/merge.

| Fase | Rama | Estado |
|---|---|---|
| L1 · Identidad completa del territorio | `feat/lab-l1-adn-territorial` | Implementada y probada; subida para PR de Jay |
| L2 · Instrumentos y técnicas | `feat/lab-l2-instrumentos` | Implementada y probada; subida para PR de Jay |
| L3 · Músicos, ritmos y frases | `feat/lab-l3-interpretacion` | Implementada y probada; subida para PR de Jay |
| L4 · Paisaje como instrumento | `feat/lab-l4-paisaje` | Implementada y probada; subida para PR de Jay |
| L5 · Aprender jugando | `feat/lab-l5-aprendizaje` | Pendiente |
| L6 · Evolución, viajes y memoria | `feat/lab-l6-exploracion` | Pendiente |
| L7 · Curaduría y cierre | `feat/lab-l7-curaduria` | Pendiente |
<!-- /laboratorio-vivo -->

**Auditoría de aceptación vigente:** [AUDITORIA_ACEPTACION_2.0.md](AUDITORIA_ACEPTACION_2.0.md), rama `audit/cierre-2-validacion`, candidata 2.0.0-rc.9. Incluye A29 y las condiciones externas para cerrar la publicación; las fases de implementación siguientes conservan su entrega.

**Continuación acordada:** [PLAN_CIERRE_2.0.md](PLAN_CIERRE_2.0.md) consolida las siguientes diez fases. No confundir F1 de cierre con la fase visual 1 histórica. Cubo/menú/Bitácora/logros/casa recuperados y probados en F9, ya integrado. Instantánea de main `52fec80`: cierre F1–F10 y pulido F2 integrados; aceptación física pendiente.

| Fase | Rama | Estado |
|---|---|---|
| 1 · Identidades completas de mundos | `feat/cierre-f1-identidades` | En main; aceptación física pendiente |
| 2 · Formas y especies generadas | `feat/cierre-f2-especies` | En main; aceptación física pendiente |
| 3 · Ecosistemas y territorios vivos | `feat/cierre-f3-ecosistemas` | En main; aceptación física pendiente |
| 4 · Instrumentos y síntesis modular | `feat/cierre-f4-sintesis` | En main; aceptación física pendiente |
| 5 · Composición, géneros y mezclas | `feat/cierre-f5-composicion` | En main; aceptación física pendiente |
| 6 · Interacciones que hacen música | `feat/cierre-f6-interacciones` | En main; aceptación física pendiente |
| 7 · Exploración y hallazgos con sentido | `feat/cierre-f7-hallazgos` | En main; aceptación física pendiente |
| 8 · Memoria, regreso y vínculos | `feat/cierre-f8-memoria` | En main; aceptación física pendiente |
| 9 · Juego, interfaz e historia unidos | `feat/cierre-f9-juego` | En main; aceptación física pendiente |
| 10 · Mezcla, auditoría y lanzamiento | `feat/cierre-f10-lanzamiento` | En main; aceptación física pendiente |


## Continuación de pulido

| Bloque | Rama | Estado | Referencia |
|---|---|---|---|
| 1 · Auditoría y defectos comprobados | `feat/cierre-f10-lanzamiento` | En main; aceptación física pendiente | `25732e6` |
| 2 · Primer nivel y guía mínima | `feat/pulido-f2-primer-nivel` | En main; aceptación física pendiente | `2e45cc0` |
| 3 · Guardar, volver y viajar | `feat/pulido-f3-viajes` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | `e5d2da5` |
| 4 · Bitácora visual | `feat/pulido-f4-bitacora` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | `e1a0897` |
| 5 · Tarjetas y ritmo de descubrimiento | `feat/pulido-f5-tarjetas` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | `4cdc59a` |
| 6 · Cincuenta variantes de personajes | `feat/pulido-f6-personajes` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | `1637aed` |
| 7 · Interacciones musicales coherentes | `feat/pulido-f7-interacciones` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | `7af93e2` |
| 8 · Limpieza y aceptación del conjunto | `feat/pulido-f8-cierre` | Implementado y probado; listo para PR de Jay; aceptación física pendiente | `5d02c08` |

Aprobado por Jay el 14 de octubre de 2026. Punto de partida: `main` en **1.1.0** (`4ed00ce`), con CI en verde. La 2.0 se construye en ramas. Por excepción explícita de Jay, se integran en `main` las fases 0–2 y la reparación de Vercel; las siguientes conservan el flujo de PR y merge de Jay.

**Hilo común:** encontrar cosas en el universo debe darte algo visible, que se celebre y que puedas usar. Por eso cubo, casa y logros comparten una base (fase 0) en vez de ser sistemas separados.

La continuación autorizada durante esta auditoría se organiza en [PLAN_PULIDO_FINAL.md](PLAN_PULIDO_FINAL.md). F10 entrega la base auditada y los siete bloques siguientes están implementados y publicados en sus ramas. Continuar entre fases autorizadas sin esperar confirmación de Jay. Los apartados históricos siguientes conservan el alcance original; las tablas iniciales y CIERRE_2.0 describen la entrega actual.

## Flujo de trabajo (obligatorio)

- **Una rama por fase**, desde `main` actualizado o desde la fase anterior si depende de ella: `v2/f0-coleccion`, `v2/f1-universo-visual`, etc.
- Commit y push. **Jay crea el PR y hace el merge.** No hacer push a `main` salvo que Jay lo pida en ese momento.
- Validación acordada: durante la fase, pruebas afectadas. Antes de push de rama, auditoría y lógica completas más navegador/audio enfocados según cambios. Antes de integrar/publicar `main`, navegador y audio completos una vez sobre el conjunto final. CI completo debe estar aprobado antes de merge; nunca desactivar pruebas.
- No crear decenas de ramas pequeñas. No reabrir funciones retiradas (ver [HANDOFF_CLAUDE.md](HANDOFF_CLAUDE.md), sección 3).
- Cada fase actualiza [CAMBIOS.md](CAMBIOS.md) y marca su estado en la tabla de abajo.
- Vercel Hobby tiene límite diario de deploys: evitar pushes innecesarios.

## Estado por fase

| Fase | Rama | Estado |
|---|---|---|
| 0 · Base de colección | `v2/f0-coleccion` | Integrada en main por excepción de Jay; pruebas aprobadas |
| 1 · El universo se ve real | `v2/f1-universo-visual` | Integrada en main y probada; 60 FPS físicos por aceptar |
| 2 · Celebración y caja mágica | `v2/f2-celebracion` | Integrada en main por excepción de Jay; pruebas aprobadas |
| 3 · Cubo con 50 personalizaciones | `v2/f3-cubo-50` | Recuperada y probada en cierre F9, ya integrado; aceptación física pendiente |
| 7 · Menú principal limpio | `v2/f7-menu` | Recuperada y probada en cierre F9, ya integrado; aceptación física pendiente |
| 6 · Bitácora perfeccionada | `v2/f6-bitacora` | Recuperada y probada en cierre F9, ya integrado; aceptación física pendiente |
| 4 · Logros 2.0 | `v2/f4-logros` | Recuperada y probada en cierre F9, ya integrado; aceptación física pendiente |
| 5 · La casa del cubo | `v2/f5-casa` | Recuperada y probada en cierre F9, ya integrado; aceptación física pendiente |
| 8 · Pulido y lanzamiento 2.0 | `v2/f8-lanzamiento` | Automatización y pulido cubiertos por cierre F10/pulido F8; aceptación física, CI y publicación pendientes |

**Orden de trabajo:** 0 → 1 → 2 → 3 → 7 → 6 → 4 → 5 → 8. Primero la base y que el mundo se vea profesional; luego celebración y cubo; después menú y bitácora; al final logros y casa, las fases más grandes.

## Prioridad adicional · 14 de octubre · Despliegue e interacción

Esta integración excepcional reunió las fases 0, 1 y 2 y el arreglo de deploy. Las fases 3, 7, 6, 4 y 5 quedaron fuera de aquella publicación; posteriormente se recuperaron y probaron en cierre F9. Están incluidas en cierre F9, ya integrado; la candidata conserva las mejoras de pulido posteriores.

Reparación incluida: `fix/vercel-static-output` (`6feac66`) sirve la raíz del juego en lugar de la carpeta `public` inexistente. Conserva el sello de revisión/hora y el SW sin caché HTTP. Jay autorizó a Codex integrar y publicar `main` solo en este caso; las próximas fases vuelven al flujo habitual.

Estado de las peticiones adicionales de Jay, sin eliminar fases ni progreso:

1. **Saltar por el universo · integrado con M1 en main.** Botón «Saltar» visible en Mundo y «Volver al salto» en menú. Selecciona candidatos con contraste y habitantes, conserva progreso/capa, guarda lugar previo y dirección WD1 para recarga. Silencioso; bloqueado durante grabación/escaneo. Aceptación física pendiente. F1 de cierre añade contraste entre paisajes y protege los bordes regionales.
2. **Toques que se entiendan.** Revisar qué recibe cada clic/tap: mostrar una respuesta local inmediata del objeto y un efecto musical identificable, a tempo. Cambiar movimiento, pulso o textura según especie y gesto; alternar graves, medios, percusión y melodía según ambiente. No convertir menús ni tarjetas en instrumentos. Integrar y probar en fase 8, con objetivos táctiles adecuados para móvil.
3. **Percusión natural con diversidad real.** Ya existen nueve familias en `src/percussion-model.js` y `src/percussion.js`; su presencia actual no garantiza que se perciban durante la exploración. Revisar distribución, gestos, alcance, contraste y señales antes de añadir más familias. Variar el rayo: articulación, registro, patrón y eco según clima/género, evitando que toda caja sea el mismo golpe. Explorar gotas sobre hojas, semillas que traquetean, cañas que golpean, piedras huecas, insectos y aleteos como funciones diferenciadas: bombo, rim, tom, shaker, clap y percusión suave. Cada golpe debe tener una señal visual pequeña en su fuente; distribuir apariciones con semillas independientes. Mantener pausas, presupuesto de voces y margen de mezcla. Integrar como trabajo musical de fase 8; comparar géneros y lluvia en teléfono.
4. **Reconocer quién está tocando.** Todo elemento que modifique la música debe indicar cuándo actúa, qué cambió y cuánto dura, mediante animación o rastro local sincronizado. Distinguir escucha por cercanía, contacto, conexión y quietud. Mayor claridad no implica subir todos los volúmenes: contrastar timbre, ritmo y registro sin saturar. Integrar en fase 8; comprobar que las señales respetan fondo negro y espacio libre.

Aceptación: probar tap y arrastre con una mano; identificar fuentes musicales sin leer un panel; escuchar bajos/percusión distintos en varios destinos; volver al lugar anterior sin perder progreso. Validar UI silenciosa, guardados, offline, mezclas densas y movimiento reducido. Saltar y las señales de filtros se implementaron en M1; cierre F6 y pulido F7/F8 implementan y prueban tap, percusión y feedback. La aceptación perceptiva y táctil en teléfonos sigue pendiente.

## Reglas de diseño (estilo J)

- Capa visual: [styles/estilo-j.css](styles/estilo-j.css). Negro puro, esquinas rectas, blanco para estados, **dorado solo para lo ganado**, Geist Mono en toda la interfaz, Canvas y exportaciones (100–900).
- Textos: máximo 12 palabras, una idea, imperativo. Recurso tachado-corrección en la Voz (`"~~antes~~ después"`). Firma *Simple.* solo en momentos importantes.
- UI silenciosa: menús y botones no hacen sonido musical. Las celebraciones son eventos del mundo, a tempo y en la tonalidad del lugar.
- Nunca quitar progreso ganado. Nunca pagar por nada.
- No consumir RNG antiguo al añadir contenido (mueve posiciones existentes): usar semillas nuevas versionadas.

---

## Fase 0 · Base de colección

- **Catálogo único de recompensas** (módulo nuevo, por ejemplo `src/rewards-model.js`) para cubo, casa y logros. Cada pieza tiene id, tipo, rareza, fuente, pista y fecha de obtención.
- **5 rarezas:** común, poco común, rara, épica y mítica, con su color y su nivel de celebración.
- **Fuentes:** biomas, 28 linajes, cajas, constancia, 12 estudios culturales, clima, capas (superficie, subsuelo, cielo), hallazgos raros y logros.
- **Migración** de guardados: los 13 cosméticos actuales del cubo (`src/cube-model.js`) entran al catálogo; nadie pierde nada.
- **Simulador de ritmo de desbloqueo** (`scripts/rewards-audit.mjs`), al estilo de las auditorías existentes.

**Lista cuando:** cualquier sistema entrega una pieza con una llamada y el simulador reporta cuánto tarda cada rareza.

## Fase 1 · El universo se ve real

Situación actual: la luz es un degradado blanco aditivo (`src/render.js`). No hay oscuridad ni niebla con profundidad. Los objetos se dibujan opacos hasta un radio fijo (linajes 750 px en `src/living.js`, bandadas 2.200 en `src/render.js`) y desaparecen de golpe.

- **Niebla gradual:** oscuridad en capas alrededor del cubo con bordes suaves y ruido sutil. Densidad según bioma, clima y hora.
- **Sin pop:** opacidad por distancia (aparecer y desaparecer suave), carga anticipada un anillo fuera de pantalla y margen para que no parpadeen en los bordes.
- **Profundidad:** 3 planos con paralaje.
- **Detalles de realidad** en trazo simple: textura de suelo por bioma, hierba y ramas con viento, sombras suaves, reflejos en agua y huellas que se borran.
- **Luz:** ciclo día/noche, amanecer y atardecer, criaturas que brillan de noche y linterna que tiembla al acabarse.
- **Clima con cuerpo:** lluvia que moja, niebla que oculta y revela, viento con partículas.
- **Rendimiento:** nivel de detalle según el dispositivo.

**Lista cuando:** se cruzan 5 regiones sin ver aparecer ni desaparecer nada de golpe y se sostienen 60 FPS en gama media.

## Fase 2 · Celebración y caja mágica

Situación actual: la tarjeta de caja es mínima (`src/rare-cards.js`, `src/rare-card-art.js`, `src/cajas.js`, 6 poderes en `src/expansion-music.js`).

- **Apertura animada:** la caja se abre en pixeles, sale el poder y la tarjeta entra a tempo.
- **Tarjeta nueva por poder:** ilustración propia, nombre grande, rareza, efecto, duración y Compartir 4:5.
- **Tres niveles de celebración:**
  - Común: aviso de 2 s.
  - Rara: tarjeta y destello.
  - Épica o mítica: pantalla breve, frase J y *Simple.*
- **Cola de celebraciones:** nunca dos a la vez, nunca encima de un menú.
- Remate musical corto en la tonalidad del lugar.

## Fase 3 · Cubo con 50 personalizaciones

- **12 colores, 8 materiales, 6 formas o bordes, 8 estelas, 6 halos, 5 auras y 5 voces del pulso.**
- Por rareza: 15 comunes, 15 poco comunes, 10 raras, 7 épicas y 3 míticas.
- **Vestidor** con vista previa y sonido; lo que falta aparece en silueta con pista.
- **Ritmo objetivo:** la mitad en 2 semanas de juego diario; raras en 1–3 meses; míticas, 6 meses o más.

## Fase 4 · Logros 2.0

- **De unos 138 a unos 250**, en 7 categorías: Camino, Mundo, Música, Vida, Colección, Casa y Secretos.
- Niveles bronce, plata y oro. **Cada logro entrega algo** del catálogo.
- Quitar los que premian repetir sin sentido.

## Fase 5 · La casa del cubo (Estudio 2.0)

Situación actual: secuenciador radial (`src/studio.js`).

- **Casa en pixeles vista desde arriba** (confirmada por Jay el 14 de octubre de 2026):
  - Zonas del plano = registros: graves, medios y agudos.
  - Izquierda a derecha = momento del compás.
  - Cerca del cubo = más fuerte.
- **Unos 40 objetos que suenan**, ganados con logros, hallazgos y linajes.
- **Habitaciones** que se abren con constancia (sala, jardín, azotea y sótano), cada una con su acústica.
- **Visitas** de la mascota y de criaturas conocidas.
- **Compartir:** grabar un set en la casa y un código para visitarla.
- **El estudio radial** se conserva como "taller". Migración sin pérdidas.

## Fase 6 · Bitácora perfeccionada

De 6 pestañas a 5 secciones:

| Sección | Qué reúne |
|---|---|
| **Hoy** | Lo que pasó en la sesión (absorbe "Sesión") |
| **Colección** | Álbum visual: cubo, casa, tarjetas, 109 elementos y 28 linajes, con siluetas y pistas |
| **Lugares** | Lugares, favoritos y constelación de recorridos (absorbe "Constelación") |
| **Música** | Géneros escuchados (x/52), instrumentos y sets |
| **Logros** | Por categoría y nivel, con progreso y fecha (reemplaza la hoja vieja `mAch`) |

- Ilustraciones, filtros, búsqueda y anillos de progreso.
- "Lo próximo": la Voz sugiere qué buscar según donde estás.

## Fase 7 · Menú principal limpio

Todos los botones actuales funcionan, pero hay duplicados y herencia: Constelación, Sesión y la hoja vieja de Logros repiten la Bitácora; "Otros mundos" abre una herramienta de pruebas; hay 4 interruptores de sonido sueltos y el modo "Explorar con linterna" confunde.

| Grupo | Contenido |
|---|---|
| **Jugar** (6 grandes) | Mundo/Camino · Casa · Bitácora · Mapa · Tu cubo · Favoritos |
| **Crear** | Herramientas · Grabar set |
| **Sonido** (una hoja) | Volumen, Energía, Calma y Repetir juntos |
| **Más** | Compartir · Guardar copia · Ajustes (Paseo, Voz, Más info, modo de juego) · Viajar a otra semilla · Cuenta y duetos (solo si hay servidor) |

Conservar los IDs de botón existentes donde sea posible: las pruebas de navegador los usan.

## Fase 8 · Pulido y lanzamiento 2.0

Arte final, sonido de celebraciones, prueba en teléfonos ([ACEPTACION_V1.md](ACEPTACION_V1.md) como base), playtest con personas nuevas, rendimiento, migración de guardados y lanzamiento con contenido J ([LANZAMIENTO.md](LANZAMIENTO.md)).

---

## 10 ideas creativas (después de la fase 5, 3–4 por ronda)

1. **Cazar tormentas.** Un frente cruza el mapa; dentro, la lluvia toca el género del lugar y deja materiales raros para el cubo.
2. **Dibujar con tu camino.** Si tu recorrido traza una figura (círculo, espiral, estrella), se abre un evento o portal.
3. **La banda de tu casa.** Las criaturas conocidas se mudan a tu casa y tocan contigo.
4. **Fósiles de canciones.** En el subsuelo excavas fragmentos de una melodía; con los 4, suena en tu casa.
5. **Radio pirata.** Estaciones escondidas transmiten un set que grabaste días atrás.
6. **Noche de la ballena.** Con la luna llena real aparece la ballena del vacío.
7. **Piel de bioma.** Si pasas mucho tiempo en un bioma, tu cubo se tiñe de él por un rato.
8. **Carreras de luz.** Rutas contrarreloj donde tocar a tiempo te acelera.
9. **Jardín de semillas.** Semillas de cada bioma que crecen en tu casa con días reales.
10. **Botella al mar.** Un código WD1 lleva un lugar y una melodía tuya; quien lo abre encuentra tu eco ahí. Sin servidor.

## Decisiones pendientes de Jay

1. **Resuelta:** casa vista desde arriba, confirmada por Jay.
2. Arte: ilustrador de pixel (recomendado para 50 piezas, 40 objetos y 6 tarjetas) o arte procedural.
3. Qué 3–4 ideas creativas van en la primera ronda.

Mientras no estén decididas, las fases 0–3, 6 y 7 pueden avanzar. La vista de la fase 5 ya está decidida; se implementa después de la 4.

## Agrupación histórica del cierre

La siguiente lista documenta el alcance que se agrupó para el cierre. Las fases 3, 7, 6, 4 y 5 ya se recuperaron, integraron y probaron en cierre F9; F10 y pulido F2–F8 completan las soluciones posteriores. La recuperación F9 ya está integrada; los bloques posteriores conservan sus estados en las tablas iniciales. No volver a ejecutarlas por estos verbos históricos. Consultar CIERRE_2.0 para los pendientes externos actuales.

1. **Fase 3:** cerrar vestidor de 50 piezas, pistas, apariencia en el mundo y voces del pulso; conservar las 13 piezas anteriores. Validar voces y guardar/reabrir.
2. **Fase 7:** cerrar menú compacto y sonido en una hoja; viajes reales entre semillas, más botón provisional “Otro lugar” en pantalla principal y regreso al destino anterior. No confundir viajes con el laboratorio.
3. **Fase 6:** cerrar cinco secciones de Bitácora: Hoy, Colección, Lugares, Música y Logros; búsqueda, filtros, siluetas, coordenadas/WD1, fechas, sets y sugerencias de Voz.
4. **Fase 4:** cerrar 250 logros con siete categorías y recompensas reales; conservar los antiguos ganados y retirar incentivos de repetición vacía.
5. **Fase 5:** cerrar casa vista desde arriba, 40 objetos musicales, cuatro habitaciones/acústicas, visitas, set y código de visita. Conservar el Taller radial y los guardados.
6. **Fase 8:** respuesta de toque/contacto/quietud más clara; percusión natural fácil de encontrar y rayos menos repetitivos; bajos, medios, cuerdas y pads; pulido gráfico y móvil; guía/storytelling, Voz congruente, rendimiento, migraciones, escucha humana y lanzamiento. El cambio de Geist y la primera mejora de colores/instrumentos tienen una rama conjunta; no completan por sí solos esta fase.

### Fases musicales autorizadas

| Fase | Rama | Estado |
|---|---|---|
| M1 · Identidad musical y ADN individual | `feat/m1-musical-identity` | Integrada en `main 6702093`; pruebas aprobadas, escucha física pendiente |
| M2–M6 · Mezclas, distribución, viajes, diversidad y juego | Distribuidas en cierre F3–F10 | Alcance consolidado implementado y probado; no crear otras cinco ramas duplicadas |

M1 no renumera la fase visual 1 integrada. [Plan y alcance histórico](PLAN_MEZCLAS_MUSICALES.md). Jay autorizó después cierre F1–F10 y pulido F2–F8 consecutivamente: esa autorización reemplaza la espera que figuraba aquí. El criterio de escucha humana sigue pendiente hasta probar en teléfono.

### Ampliaciones posteriores, pendientes de elegir y calendarizar

- **Diversidad musical y descubrimiento:** [PLAN_MEZCLAS_MUSICALES.md](PLAN_MEZCLAS_MUSICALES.md) conserva el alcance original. Cierre F3–F10 implementa ecosistemas locales, síntesis, dieciséis influencias compatibles y vínculos persistentes; no equivale a mezclas arbitrarias, simulación global o cobertura perceptiva certificada del 100 %. Esas ampliaciones y la escucha humana conservan su alcance separado.
- **Vida y territorios:** redes editables de enredaderas/hongos, colonias persistentes, migraciones entre regiones, jardines, costas variables, fronteras híbridas y nuevas rutas/alturas. Incluye tormentas explorables y figuras trazadas con el camino.
- **Búsqueda e historia:** pistas encadenadas, puertas musicales, laberintos de color/espejos, puentes que abran rutas, tradiciones investigadas y reliquias históricas funcionales documentadas. Fósiles de canciones, jardines de semillas, radio pirata, noche de la ballena y botellas con ecos siguen como ideas para seleccionar.
- **Control y memoria:** deshacer general, recorrido natural que enseñe gestos, comparador de variantes, colección instrumental/cultural y constelación de mundos. Unir Camino, atención, creación y constancia de Jay sin llenar la pantalla.
- **Servicio público:** alojamiento del backend opcional, recuperación/borrado de cuentas, copias entre dispositivos, reconexión por Internet, latencia y duetos en teléfonos reales; respaldos y operación. Vercel estático no aloja este backend.

La matriz histórica conserva 40 propuestas parciales, 2 pendientes y 3 externas: [COBERTURA_150_UNIVERSO.md](COBERTURA_150_UNIVERSO.md). Esta agrupación las organiza; no las declara terminadas ni exige implementar todas antes de cerrar 2.0.
