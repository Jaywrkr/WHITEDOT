# Cambios recientes de Kubono

Estado: 20 de octubre de 2026. Código **2.3.0-alpha.71**. Las entradas describen su revisión, no certifican producción.

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

Medido en Chromium local sin GPU, recorrido con sonido: media de 12,1 a 6,1 ms por fotograma, p95 de 16,2 a 9,0 ms. No equivale a una medición en un móvil físico.

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
