> **ARCHIVO HISTÓRICO — NO VIGENTE.** Conserva el texto de otra revisión; no certifica el estado actual ni autoriza ejecutar fases, pendientes o instrucciones. Consultar [traspaso actual](../../HANDOFF_CLAUDE.md) e [índice vigente](../README.md).

# Pendientes vigentes · Universo vivo

Estado vigente: **1.1.0-alpha.10**, con diez fases acumuladas en `feat/universe-10-server-duets-validation` (código `57fb5d2`). Este handoff añade documentación en `docs/claude-handoff-universe-alpha`. Main remoto comprobado: `704ae07`; las fases aún no estaban integradas. Volver a verificar antes de continuar.

- [Empezar aquí: handoff para Claude](HANDOFF_CLAUDE.md)
- [Entrega, ramas y límites](ENTREGA_UNIVERSO_VIVO.md)
- [Cómo probar](PROBAR_UNIVERSO_VIVO.md)
- [Cobertura de las 150 ideas](COBERTURA_150_UNIVERSO.md)
- [Servidor y duetos](../SERVIDOR_Y_DUETOS.md)

**105 base jugable, 40 parciales, 2 pendientes y 3 externas**. Una base jugable todavía requiere aceptación humana. La [matriz completa](COBERTURA_150_UNIVERSO.md) es la lista exhaustiva por idea; el [handoff](HANDOFF_CLAUDE.md) explica dependencias y fuentes.

Orden recomendado para la siguiente iteración:

1. Escucha y juego de lo integrado: variedad perceptible, exceso de agudos, percusión, quietud, densidad y limpieza visual; retirar o afinar lo que no aporta.
2. Gestos intuitivos, anticipación por especie, recorrido de aprendizaje, deshacer general y comparación de variantes en laboratorio.
3. Transiciones musicales, tensión/resolución, conducción de las voces anteriores y control continuo de viento/agua.
4. Redes y colonización persistentes, poblaciones/migraciones, bordes, jardines y rutas de costa/cielo; los nuevos movimientos actuales son locales.
5. Arquitectura acústica, residentes, rutas físicas, laberintos ópticos, pistas/expediciones ecológicas y colecciones detalladas.
6. Investigación cultural/histórica: fuentes y representaciones cuidadas. **Pendientes no iniciados:** idea 101 (más alturas) e idea 114 (réplicas/partituras históricas funcionales documentadas).
7. **Aceptación externa:** teléfonos reales (141), host HTTPS/deploy (143) y playtest/escucha/publicación gradual (150). Completar operación de cuentas, copias, salas y calibración por Internet según parciales 144–149.

No borrar mascotas ganadas, partidas ni coordenadas para ampliar contenido. El servidor nuevo tiene una base funcional; faltan recuperación/borrado de cuentas, operación, respaldos, monitorización y escalado antes de abrir registro público. Mantener el modo local/offline.

<details>
<summary>Historial de planes y entregas anteriores</summary>

<!-- universo-vivo -->
Implementación en curso: **fase 10/10 · 1.1.0-alpha.10**. Cambios, pruebas, ramas y límites en [ENTREGA_UNIVERSO_VIVO.md](ENTREGA_UNIVERSO_VIVO.md). Plan: [150 ideas](UNIVERSO_150_IDEAS_FASES.md). Las secciones anteriores se conservan como historial.
<!-- /universo-vivo -->

# Interfaz integrada · V1 RC6

**1.0.0-rc.6 · polish/coherent-game-ui**, basada en **main 2a7dce0 (#84)**, que ya integra `feat/rare-discovery-cards` (14e6862). Mejora conjunta de menú, HUD, hojas, Bitácora, favoritos, mapas, Estudio, efectos, mensajes, prototipo y accesibilidad. Fondo negro y cubo siguen como centro de la experiencia. **Menú → Herramientas** muestra Efectos, Eco y Estudio; **Intensidad musical** vuelve accesible el control existente. [Auditoría, capturas y decisiones](AUDITORIA_INTERFAZ.md).

**59 suites de lógica, 45 recorridos de navegador y offline aprobados**, además de la auditoría de integridad sin errores ni avisos. Las pruebas y sus límites se registran en [evidencia RC6](../../scripts/interface-validation.json). Se mantienen 11 biomas, 33 hábitats, 52 géneros, 81 familias y 18 tipos de tarjeta. Sin cambios de generación/DSP ni nueva publicación. **RC6 integrada y subida a main en 9b5fe00**, por autorización explícita de Jay. La rama de interfaz y sus padres ya están integrados; no requieren otro PR. Teléfono real, CI remoto y deploy HTTPS siguen pendientes.

Los estados RC5/RC4/RC1 siguientes son fotografías históricas; la entrega vigente está arriba.

**Plan ampliado vigente:** [150 propuestas en 10 fases](UNIVERSO_150_IDEAS_FASES.md): las cien anteriores, treinta musicales, diez funciones de la Voz y diez propuestas de tarjetas. Son propuestas; los planes de 50/100 quedan como historia. Primera prioridad: beneficios temporales de cajas, techo de acumulación y revisar la compañía permanente procedente de una caja; no borrar progreso ya ganado.

# Libro de hallazgos · V1 RC5

**1.0.0-rc.5 · feat/rare-discovery-cards**, hija de **feat/minimal-discoveries (30d337f)**. Tarjetas discretas para hallazgos raros con nombre, ilustración, lugar, rareza contextual, fecha y coordenadas. **Bitácora → Hallazgos** guarda cada ejemplar y ofrece código/Orientar. 18 tipos de tarjeta; el contador de 81 familias permanece aparte. [Detalle y pruebas](HALLAZGOS_RAROS.md).

**59 suites de lógica, 43 recorridos de navegador + offline aprobados**, con rechecks de los flujos afectados. Las 225 mezclas pertenecen a RC4: esta entrega añade UI/registro y conserva la música. Versión/deploy visible actualizado a RC5; fecha de publicación aún sin registrar. Main comprobado: 8096c8d. Un PR de esta rama hacia main contiene todas las anteriores pendientes; Jay crea PR/merge.

Los estados RC4/RC1 siguientes son fotografías históricas; la entrega vigente está arriba.

# Expansión autorizada después de la auditoría

Estado actual: **1.0.0-rc.4 · feat/minimal-discoveries**, hija de **feat/release-identity (67aef5f)**. La petición nueva de Jay reabre desarrollo: percusión jugable, versión/deploy visible, minimalismo y registro de elementos en tres ramas amplias. [Entrega vigente y orden](EXPANSION_RITMICA.md). Main sigue en **8096c8d**; Jay crea PR/merge. La auditoría y los pendientes de teléfono/host/CI siguen vigentes.

Actualización RC4: **nueve familias de percusión (incluido fósil raro), contador de 81 familias, versión/deploy visible, instalaciones simplificadas y atlas de 139 vistas**. Laboratorio de 63 casos. Generador base preservado: 11 biomas, 33 hábitats y 52 estilos. No hay deploy nuevo registrado ni cambios en main desde esta sesión. **58 suites de lógica, 42 recorridos + offline y 225 renders de audio aprobados**; [evidencias de esta entrega](../../scripts/expansion-validation.json). Un PR de la rama final hacia main incluye las tres fases y todos sus padres pendientes; puedes probar cada rama por separado.

Los datos RC1 siguientes son la fotografía anterior, conservada como historia; su congelación queda sustituida por este alcance nuevo.

# Pendientes tras el cierre de V1 RC1

Desarrollo funcional congelado en **audit/v1-closure**. [Auditoría completa](AUDITORIA_V1.md) contiene cada hallazgo, evidencia y solución. La candidata incluye culturas y mascota; no se solicitan más ramas pequeñas ni se consideran ausentes sistemas presentes.

## Antes de publicación

1. A01: escuchar/controlar en iPhone y Android reales, auriculares/altavoz, sesiones largas y grabar set.
2. A02: PWA instalada, suspensión/reanudación, memoria/FPS/batería y ruta larga.
3. A03: primera sesión de alguien nuevo; ajustar solo las ayudas que no entienda.
4. A04: revisar **un PR de esta rama hacia main**, checks verdes y elegir después host HTTPS; probar backup/cambio de origen y update/rollback.

Solo las correcciones de hallazgos de esa aceptación entran a V1. No se publica ni se configura un servidor desde esta auditoría. Consulta de CI remoto bloqueada por 403; no es una certificación de su estado.

## Límites conocidos

Protección entre pestañas optimista; históricos largos sin compactación general; texto/zoom y presupuesto visual no aprobados en hardware; algunas ediciones finas dependen del modo dedo; codecs de grabación dependientes del navegador; prototipo visible. Soluciones y prioridades explícitas en la auditoría. No se borran hallazgos previos para simular que estos límites desaparecieron.

## Después: V2

Publicar V1 individual → identidad/progreso sincronizado → dueto musical → control/historia/memoria → variedad perceptible/culturas/ecosistemas. [Plan por bloques](PLAN_V2.md). Construcción/cableado, mixer y más motores/géneros no son funciones obligatorias nuevas de esta V1. Mantener blanco disponible, mascota ganada, música cuidada y UI mínima. No reintroducir escenas guardables descartadas.

<details><summary>Ideas e inventario previos; conservados para V2, no una lista nueva de obligaciones de V1</summary>

# Actualización · mascota y cubo

Rama `feat/pet-and-cube` sobre la entrega cultural pendiente (`165c376`): mascota ganada/persistente con tres roles musicales, crecimiento, contacto y búsqueda local; colores ganados/estelas/halo en Tu cubo, sin sonidos de UI. [Inventario y límites](MASCOTA_Y_CUBO.md). Main sigue en `8096c8d`; no afirmar que estas ramas ya están integradas. Teléfono real y restantes ampliaciones de V1 siguen pendientes.

# Pendientes vigentes · desde main 8096c8d y rama fase 6

Actualizado el 13 de octubre de 2026, tras integrar #74–#77 y preparar esta rama. [Estado comprobado](ESTADO_ACTUAL.md) · [handoff para Claude](HANDOFF.md) · [diez fases](FASES_UNIVERSO.md) · [64 tareas conservadas](V1_PRODUCCION.md).

## Estado del regreso desde Claude

Main 8096c8d integra #74–#77: materia, FX nuevos, códigos/set, laboratorio, vida, cubo, quietud, cajas y experimental. Jardín modular/rastro retirados. Esta rama implementa [FASE_06.md](FASE_06.md): primer bloque cultural, Vasto, paseo visible, laboratorio 54 y golondrinas, con regresión completa. No repetir la lista antigua de funciones ausentes.

## Lista que dejó Claude: resultado y límite

1. Culturas/búsquedas: ocho estudios, guardianes/llamadas, huellas, puertas y tres recuerdos por estudio implementados. Pendientes personajes/obras históricas investigadas y relación más profunda con flora/fauna/materiales; no se declara agotada toda la fase 6.
2. Mundo más grande: Vasto de 18.000, guardado/identidad aislados y selector, implementado.
3. Auto visible: botón compacto, giro suave, 40–90 s activos y prevención de entrada al mar, implementado. Refugios complejos/rutas largas pueden ampliarse.
4. Laboratorio: 54 casos incluyendo culturas, poderes, quietud y experimental; textos del cubo y tarjeta acotada, implementado.
5. Teléfono real: **pendiente**. Se prueban Chromium emulado/WebAudio offline; faltan escuchar altavoces/auriculares, Safari real, volumen/fatiga, batería y grabación del set en esos equipos.
6. Golondrinas: formación con regalo, permanencia entre regiones, señales de cajas y cruces con respuesta por turnos, implementados como primer bloque; más conductas siguen posibles.
7. Regresión de navegador: ejecutada al cierre y resultados en FASE_06.md; no afirmar que pruebas de dedo equivalen a control normal. Las nuevas búsquedas se prueban con webdriver desactivado.

## Prioridad siguiente

- Escucha física y elecciones visuales de Jay, especialmente atmósfera nueva, conectados, grullas, cajas y experimental; revisar la suma de capas y no solo un objeto.
- Gramática de acciones del cubo y edición fina de suelos/hilos sin depender de ?dedo; primera sesión sin instrucciones externas.
- Profundidad cultural/ecológica y búsqueda con recompensas expresivas; evitar convertir todos los paisajes en la misma cadena de cuatro piedras.
- Unir Camino/Mundo/Estudio, Voz y constancia; rendimiento/actualización/rollback y cierre de alcance de V1.

## Música que aún puede profundizarse

- Más instrumentos con identidades reales: cuerdas pulsadas, tubos, láminas, resonadores, aditiva/tablas de onda/ruido articulado. Fase 3 añadió cuatro motores y articulaciones; no equivale a todos los candidatos ni a una canción de forma ilimitada.
- Ampliar de 52 hacia 80/100 estilos solo si cambian realmente batería, bajo, armonía, timbre, swing y evolución; contrastar duplicados con el catálogo presente. Muchos géneros culturales solicitados aún son candidatos.
- Transiciones, tensión/resolución, memoria breve, formas más largas y diferencias audibles por material/gesto. El arco de ocho frases ya existe y se repite con variaciones; no venderlo como ausencia total de repetición.
- Mixer con rutas reales por bajo/percusión/acordes/motivo/ambiente, mute/solo y control compacto; sustracción/influencia no son ese mixer.
- Flanger, resonadores y granular con fuentes/buffers y costes definidos. Reverb, delay, chorus, phaser y freeze breve ya existen; revisar sus resultados en teléfono.
- Conversaciones/bandas más expresivas y presupuestos conjuntos. El animal aprende una frase corta de gestos; no escucha micrófono ni improvisa diálogo general.

## Mundo, vida y búsqueda

- Más relaciones de ecosistema, fauna/flora con conducta e instrumentos propios, visitantes y llamadas/respuestas; ya hay diferencias individuales, aves, semilleros, lluvia, estaciones y ríos.
- Contratos/versiones/presencia aplicados más uniformemente a sistemas históricos; recetar compatibilidad y rareza antes de multiplicar contenido. Paisajes vivos ya aplica contratos a sus seis familias.
- Cadenas de búsqueda variadas, puertas musicales, despertar instrumentos de distintas maneras y rarezas con capacidades expresivas; la nueva cadena cultural es un primer bloque, sin constituir un sistema completo de aventuras.
- **Culturas e historia:** muchas culturas, épocas y referencias originales relacionadas con música/materiales/biología/movimiento/gráfica; no solo Japón/México. Personajes, reliquias/compositores históricos y mecanismos inspirados en Leonardo siguen pendientes. Revisar dominio público/licencias por recurso concreto, separando una obra antigua de una grabación o imagen moderna.
- Jardines/cableado más profundos y acotados, mecanismos musicales, huertos de ritmo, construcción/crafting y comunidades/escenarios: propuestas, todavía sin arquitectura/persistencia completa ni alcance cerrado de V1.
- Migraciones con rutas, gigantes, manantiales, ciclo día/noche y consecuencias ecológicas persistentes: ampliación. No reintroducir cajas rectangulares como sustituto del suelo.

## Recorrer, crear y compartir

- Profundizar el Estudio, edición/retirada, relación con la banda, aprendizajes y materiales; explicar qué se conserva.
- Códigos WD1 ya implementados por Claude: revisar UX/intercambio/compatibilidad, incluidos Vasto y mundos ajenos. Favoritos no sincroniza entre dispositivos.
- Grabar set de pantalla/audio hasta 60s ya existe por Claude; verificar formatos y descarga/compartir en teléfonos reales. No equivale a sincronización ni publicación automática.
- Multijugador sigue sin implementar: backend/proveedor, reloj/armonía común, papeles, latencia, reconexión y guardados/propiedad requieren un bloque propio. Dos puntos compartiendo un mundo no aparecen por tener semillas iguales.

## Cierre de V1 aún pendiente

Pruebas reales de batería/memoria en rutas largas, PWA instalada, suspensión/reanudación y tamaños; actualización de caché sin mezcla, migraciones futuras/rollback; primera sesión humana; auditar accesibilidad/zoom/teclado y controles heredados, movilidad/gravedad y notificaciones; créditos/licencias, versión visible, soporte y candidata congelada. La existencia de CI y un merge no certifica aceptación musical o producción.

## Decisiones y flujo preservados

No añadir escenas/ideas musicales guardables: opción descartada por Jay. La fijación es voluntaria; favorecer crear sin grabar. No añadir logros por una operación técnica. Mantenimiento de README/pendientes/entrega en una rama amplia por bloque, con pruebas pertinentes; no volver a treinta ramas pequeñas. Esta rama contiene código, pruebas y documentación. La próxima entrega debe apoyarse en su integración y seguir el alcance que Jay pida.

</details>

</details>
