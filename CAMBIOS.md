# Cambios recientes

## Cristales juguetones y chispas visibles

Rama `feat/playful-crystal-sparks`, dependiente de `6fd8ec6` (entregas anteriores aún pendientes en main remoto `81856a3`). Fragmentos con esquirla de centro blanco, halo, flotación lenta y estela corta. Contador de 14 px, saldo dorado y +✦ hacia él; destello de recogida, grietas más visibles y aviso/luz única al alcanzar el primer salto disponible.

En el Mundo, aproximadamente uno de cada ocho cristales puede soltar un fragmento cian con estrella y bono de 3 chispas. Escapa durante dos segundos hasta 100 unidades y queda disponible; se recoge al acercarse a 32 unidades. Algunos cristales medianos/grandes corren al primer golpe, con patas y rastro breve, durante dos segundos hasta 90 unidades. Sin penalización por dejarlos: se detienen. Los fragmentos normales mantienen radio 70. Con movimiento reducido no hay persecución ni vuelo; todos conservan alcance 70 y sus premios.

Romper un cristal del Mundo envía una onda de radio 240, un impacto por vecino y hasta ocho impactos adicionales por cadena inicial. El Camino conserva sus diez cristales sin cadenas ni persecuciones. Solo los pulsos manuales inician minería; paseo automático no recoge. Reparto normal total 1/3/5, más el bono raro cuando corresponde; cada fragmento cobrado se guarda por separado, con rollback de escritura y sin duplicación al recargar. Sin premio retroactivo en cristales antiguos agotados. Hash nuevo independiente, misma retícula y mapas.

El paisaje modula suavemente su brillo cercano con el beat real existente. No añade sonido ni cambia composición, mezcla, física o controles. Se desactiva con silencio, pausa y movimiento reducido. Shell actualizado una sola vez para el módulo nuevo; sellado de versión/caché existente.

Auditoría sin errores/avisos, 87 suites Node afectadas y pruebas Chrome de persecución/bono, guardados, economía, Camino, intro/salto y offline aprobadas. Diff y capturas revisados. Comandos, huellas y límites en [el informe](scripts/crystal-play-validation.json). No se certifican suites completas de navegador/audio, CI, dispositivos físicos ni despliegue.

## Salto ganado e intro visible

Rama `fix/earned-jump-and-intro`, dependiente de la limpieza documental `7f77842` y de la entrega de chispas aún no integrada en main remoto `81856a3`. Al acumular 20 chispas ganadas aparece Saltar en el dock. Permanece visible tras gastar y recargar; sin saldo suficiente se desactiva. Cada salto conserva el coste de 20 y el regreso gratuito. El menú mantiene su propio control, sin duplicar IDs ni sobrescribir el botón principal.

La intro ya no se omite por tutorial pendiente o primera visita: frase y `.simple`, cierre automático a los 2,4 s o por toque/Escape. Al cerrar se recupera la primera guía, sin saltarse sus pasos. Movimiento reducido sin animación de sistema; sin cambios musicales ni de progreso. Versión y caché mediante el sellado existente.

Verificación: auditoría sin errores/avisos; diez suites Node afectadas aprobadas. Regresión Chrome de entrada, firma legible, guía pendiente, minería manual de la chispa 20, salto cobrado, botón persistente, recarga y regreso gratuito en 320/390/844/1280 px; además movimiento reducido. Compatibilidad de viajes, economía y regreso, más diez roturas reales del Camino, probadas por separado. Comandos y huellas en [el informe](scripts/entry-jump-validation.json). Pruebas enfocadas; sin suite completa, audio nuevo, CI ni despliegue certificado.

## Documentación consolidada

Cuatro documentos en la raíz y tres guías operativas en `docs/`. Planes, cierres, inventarios y handoffs anteriores se conservan en [historial](docs/historial/README.md), sin autorizar trabajo nuevo. README y mapa técnico reflejan las chispas; las instrucciones ya no declaran varios ciclos vigentes. Créditos distinguen cliente local de servidor opcional. Sin cambios del juego, versión ni caché.

Validación: auditoría de publicación, contrato de actualización de versión, selección de pruebas afectadas, enlaces de guías vigentes y revisión de diff. La evidencia histórica conserva sus revisiones originales; no implica CI ni despliegue actual.

## Chispas · economía, recorrido y avisos

Rama `feat/sparks-progression`, desde main remoto `81856a3`. Primera etapa del plan acordado: una moneda por partida, saldo conservado, total ganado/gastado y minería diaria persistente. Daño, rotura y recogida se guardan; ni recargar ni volver al mismo cristal duplica el pago. Las operaciones revierten saldo/propiedad si falla la escritura, y el salto guarda destino y coste juntos. Las demostraciones no generan saldo; sus tarjetas se marcan como muestras. Se conservan formatos futuros y el progreso anterior.

Saltar sale del dock y pasa a Menú → Viajar y chispas: 20 chispas, regreso gratuito. Compras permanentes con vista previa y equipar/quitar: Polvo viajero 40, Pulso facetado 80, Órbita personal 150. Son capas visuales adicionales; conservan las apariencias ganadas, la física y el alcance del pulso. Tres colecciones retroactivas pagan una vez: Primera banda (+15), Vecinos extraños (+15), Pequeñas maravillas (+25). Ocho logros secretos, hitos de 1/5/10 km, títulos elegibles, historial y una meta opcional bajo el saldo. Distancia caminada existente, sin sumar teletransportes ni pagar monedas por estar inactivo.

Dos formas de aviso: delta agrupado junto al saldo durante 1,5 s y tarjeta breve (~3 s), una a la vez. Los duplicados no interrumpen. Los hallazgos permanecen en el libro; abrir detalles es una decisión del jugador. Los problemas de guardado quedan visibles hasta recuperarse o abrir su atención. Cajas originales de 20 s; sorpresas de 10–20 s; sin acumular duraciones. Indicadores y Deshacer; compartir/leer conserva acceso explícito. Sin nuevos sonidos de interfaz ni cambios de síntesis/composición.

Validación: auditoría sin errores/advertencias; 106 suites Node afectadas; pruebas de economía/rollback, minería tras recarga, compra/equipamiento, salto y regreso, metas, tarjetas sin pausa, cajas/Deshacer y tres tamaños. Seis renders de celebración a 44,1/48 kHz, pico 0,882635. Simulación reproducible de tres recorridos de diez minutos: 31/90/129 chispas; precios iniciales, no medición con jugadores. Comandos y límites en scripts/sparks-progression-validation.json; revisión visual y diff sin errores. Adaptaciones Windows de ESM/licencias y Playwright externo sin dependencias nuevas del juego. No se certifican suites completas de navegador/audio, CI ni despliegue. Jay conserva PR/merge.

Límites: libro de minería diario de hasta 8192 sitios; saldo local de cada partida, sin validación remota ni intercambio. Destellos y constelación personal corresponden a la ampliación posterior acordada.

## Cristales · distribución, Camino y entrada directa

Rama `feat/crystal-path-entry`, desde main `d404b52`. Cristales facetados con relleno tenue y caras interiores; una retícula independiente separa sus posiciones y regiones de 1200 unidades alternan abundancia escasa, media y alta. Se conservan los tres tamaños, impactos y valores del Mundo.

El Camino conserva su trazado y cambia sus luces recogibles por cristales pequeños. Diez cristales distintos rotos por pulso manual completan la entrada diaria; el décimo entra automáticamente, sin botón ni bienvenida del Mundo. Cada rotura cuenta una vez y aporta una chispa; el progreso parcial se guarda, no se duplica tras recargar y se reinicia al cambiar de día. Las luces antiguas no abren esta puerta. Las partidas antiguas que ya estaban dentro del Mundo conservan el acceso; regresar voluntariamente al Camino no fuerza otra entrada. Las vistas de prueba por semilla mantienen su acceso directo.

Firma literal `.simple` después de la frase de regreso y en la primera bienvenida. El contador pasa de Canvas a un elemento debajo de la distancia, alineado y adaptable al área segura en móvil, horizontal y escritorio. Sin cambios de audio; caché mediante el sellado de publicación existente.

Verificación: `npm run test:impact -- --base d404b52`, 87 suites afectadas aprobadas; `node tests/crystal-path.mjs` y `node tests/crystal-sparks.mjs`, incluyendo migración, densidad, separación, diez roturas únicas y regreso al Camino. `npm run audit:release` sin errores/advertencias; recorridos Chrome `tests/crystal_path_smoke.py` y `tests/crystal_sparks_smoke.py`, revisión visual y `git diff --check`. Entorno Windows con adaptación ESM y licencias originales para auditoría, fuera del commit. Pruebas enfocadas; sin suite completa navegador/audio, aceptación física ni despliegue certificado. Jay conserva PR/merge.


[Historial completo anterior](docs/historial/CAMBIOS_ANTES_CONSOLIDACION.md). Las entradas antiguas describen su revisión; la persistencia diaria actual sustituye el reinicio de cristales por sesión.
