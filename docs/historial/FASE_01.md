# Fase 1 · Base fiable para un universo ampliable

> Estado al 13 de octubre de 2026: Entrega integrada por #68. Sus cifras/versiones describen el bloque original; el estado vigente reconoce Original y Paisajes vivos. [Estado actual](ESTADO_ACTUAL.md) · [Pendientes](PENDIENTES.md) · [Handoff](HANDOFF.md).

Esta guía describe la entrega `7bed0ca`. La continuación [fase 2](FASE_02.md) agrega Paisajes vivos y reconoce versiones v1/v2; los límites de esta guía sobre reconocer solo v1 corresponden a su momento de entrega.

Rama `feat/phase-01-universe-foundation`, basada en main `7a0e8ff` (PR #67). Jay crea el PR hacia main y hace merge. Una sola rama reúne guardado, coordenadas, memoria, contratos, auditoría y automatización. No añade biomas, instrumentos o géneros ni cambia el secuenciador/mezcla.

## Qué puede probar Jay

1. **Menú → Progreso y respaldo → Exportar esta partida.** Descarga un JSON con progreso, favoritos, Estudio y ajustes de instalaciones guardados. No exporta audio ni sonidos temporales.
2. Cambia algo en esa partida, elige el archivo y pulsa **Restaurar copia elegida**. Valida primero; conserva el guardado anterior en `:before-restore` y recarga. Elegir el archivo no reemplaza nada todavía.
3. Las semillas de Prototipo tienen respaldos separados. Un respaldo de otra semilla/layout o de la partida habitual se rechaza: abre su partida correspondiente antes de restaurarlo.
4. Guarda y recarga un favorito; Orientar/Viajar siguen disponibles en su mundo y versión compatibles. Favoritos antiguos reciben automáticamente la identidad de la partida en que ya estaban.
5. Explora y regresa: el contenido base expulsado de las cachés se regenera con la misma receta/posiciones. Animaciones y estados temporales no son una grabación del instante anterior; los descubrimientos y ajustes persistidos permanecen en el guardado.

No hay botón nuevo sobre el mundo ni notas al usar estos controles. El panel es opcional, se adapta a móvil y usa el gestor existente de foco/pausa. La fase técnica conserva la Bitácora/logros anteriores; no añade logros artificiales.

## Guardado y recuperación

`saveVersion: 1` envuelve lógicamente la estructura v4 existente; las claves `pixel-blanco-v4` y las claves de prueba se conservan. Valida JSON, tipos esenciales, estructuras usadas al iniciar, posiciones, sesión/bitácora, límite de 8 MiB UTF-8, profundidad/complejidad y claves peligrosas. Completa campos antiguos ausentes sin descartar el Estudio ni descubrimientos válidos.

La primera sobrescritura de una sesión conserva la última partida válida cargada en `:backup`. Es un punto de recuperación, **no un historial de todos los autoguardados**. Si el guardado principal está corrupto y existe copia válida, se abre esa copia con escritura bloqueada y se ofrece **Recuperar copia válida**. Confirmar la recuperación conserva el original corrupto antes de reemplazarlo. Si no hay copia, o la identidad es de una versión incompatible, abre una sesión segura sin sobrescribir el original. Se puede descargar ese original por separado para revisión.

Los errores de lectura/cuota ya no se ocultan: hay aviso discreto y estado en el panel. La memoria de la sesión sigue accesible para exportación. Si falla la copia previa a una restauración, no se reemplaza el guardado principal. Borrar los datos del navegador sigue borrando el almacenamiento local; no existe sincronización en nube ni entre dispositivos. Se recomienda exportar una copia antes de borrar datos o cambiar navegador.

## Dirección de lugar y compatibilidad

Identidad: `{seed, layout, generatorVersion, catalogVersion, layoutVersion}`. Dirección de favorito: esa identidad más `{layer, x, y}`. Versiones actuales: todas `1`; layouts `classic` y `wide`. Las coordenadas permiten volver a un punto; la radio sigue evolucionando y no conserva el audio exacto que sonaba.

Una dirección ajena o futura no inicia orientación/autopilot ni se interpreta como si fuera del mundo actual. Las partidas futuras se preservan y no se convierten silenciosamente. La fase 1 reconoce solamente el generador actual: para publicar un generador/catálogo nuevo habrá que conservar el anterior o implementar y probar una migración explícita. Una etiqueta de versión por sí sola no resuelve esa futura compatibilidad.

## Memoria y contenido ampliable

| Caché | Máximo de entradas |
|---|---:|
| Regiones | 128 |
| Biomas | 256 |
| Chunks del mundo | 128 |
| Chunks del Camino | 128 |
| Semillas continentales | 128 |
| Regiones continentales | 256 |

`BoundedMap` renueva la prioridad al acceder y expulsa la entrada menos reciente. `worldCacheStats()` expone residencia y expulsiones para auditoría. Estos son límites de entradas, no una medición garantizada de megabytes ni de batería en cualquier dispositivo. Los registros persistentes de descubrimientos no se recortan por una expulsión de caché.

`contentDirectory` reúne 24 contratos de contenido existente: trece definiciones del catálogo, diez familias de encuentros y un rastro. IDs, versión, biomas, acciones, materiales, papeles musicales, rareza y unidad de generación se validan. La API de expansión usa flujos aleatorios separados para presencia, papel, material y variante, de modo que registrar otro elemento no consume el azar de los anteriores.

El directorio es la base común para expansión: **las ubicaciones existentes siguen usando sus generadores originales**. El mar, las capas, las excepciones de Origen y los límites finales de densidad siguen perteneciendo a esos generadores. La fase 2 debe conectar nuevo contenido a sus reglas de composición y convivencia; registrar una definición ahora no la dibuja ni crea un instrumento automáticamente.

Los presupuestos de voces y respuestas musicales existentes se mantienen. Esta fase no sube el volumen ni altera timbres para aparentar variedad.

## Auditoría reproducible

```bash
npm run audit:universe -- 10000 4
node scripts/world-variation.mjs 100
```

Auditoría nueva: 40.000 candidatos entre `original` y `foundation-1/2/3`, layout clásico; **39.880 firmas detalladas distintas** y **24.350 firmas musicales terrestres distintas**. Incluye secuencias/patrones discretos y verifica las cachés al terminar cada semilla. Resultados en [scripts/phase-01-universe-sample.json](../../scripts/phase-01-universe-sample.json).

La firma antigua sigue dando exactamente 39.952 recetas detalladas, 23.418 regiones terrestres y 9.732 perfiles musicales terrestres en 40.000 regiones del mapa original. Las dos firmas y ventanas son diferentes: no comparar sus cifras como aumento de variedad. No cuentan canciones, mundos completos ni diferencias percibidas. El comando nuevo admite hasta un millón de candidatos por ejecución; esa capacidad de muestreo no afirma que ya haya un millón de experiencias distintas.

## Verificación y entorno

Aplicación estática: Node para pruebas, Python para servidor/navegador, sin `npm install` ni build. `requirements-dev.txt` fija Playwright; `CHROMIUM_PATH` permite elegir un ejecutable y el runner encuentra el navegador de Playwright cuando no existe Chromium del sistema.

```bash
python3 -m pip install -r requirements-dev.txt
python3 -m playwright install chromium
npm test
npm run test:browser
npm run test:audio
```

`npm test` descubre todas las suites Node con aserciones y excluye el ayudante Web Audio. El runner de navegador descubre los recorridos `*smoke.py` y luego valida el shell offline. El runner de audio conserva fallos de los cinco programas de renderizado. GitHub Actions usa estos mismos comandos en PR y pushes a main; no despliega ni modifica el repositorio.

Se comprueban migración antigua, importación/rechazo, corrupción, copia previa, almacenamiento lleno, direcciones ajenas, viaje/regreso después de expulsión y aislamiento de flujos aleatorios. Pruebas de respaldo con gestos reales en 390×844, 844×390 y 1280×800. Pasaron 48 suites Node, 31 recorridos Chromium, offline con 77 módulos y 113 renders de audio (pico máximo 0,954512; sin muestras por encima de 0,98). La validación final se registra en [HANDOFF.md](HANDOFF.md) y [scripts/phase-01-validation.json](../../scripts/phase-01-validation.json). Los renders controlan márgenes de salida; no certifican master profesional ni sustituyen la escucha en auriculares/altavoces reales. Safari/iPhone, Android y PWA instalada siguen pendientes de validación en equipos reales.
