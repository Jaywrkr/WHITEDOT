# Cambios recientes de Kubono

Estado: 20 de octubre de 2026. Código **2.3.0-alpha.63**. Las entradas describen su revisión, no certifican producción.

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
