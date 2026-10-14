# WHITEDOT · auditoría de cierre V1 RC1

**13 de octubre de 2026 · candidata `1.0.0-rc.1` · rama `audit/v1-closure`.** Base auditada: `f4c112b`, que incluye culturas y mascota. Main remoto comprobado: `8096c8d` (#77). Esta rama contiene todas esas entregas y las correcciones de cierre: **un único PR hacia main basta**, sin volver a aplicar las ramas anteriores.

## Dictamen

Se cierra el desarrollo funcional de esta versión como **candidata individual, local y contemplativa**. Los errores reproducibles encontrados se corrigen en esta rama; se conserva la identidad de mapas/guardados y el catálogo musical. No se inicia servidor, cuentas ni multijugador.

La candidata necesita aceptación en teléfonos reales y una comprobación del despliegue elegido antes de llamarla versión publicada. “Perfección” no es una propiedad que certifiquen pruebas automáticas: aquí se identifican los límites y las acciones necesarias, con evidencias reproducibles. No hay una nueva lista ilimitada de funciones obligatorias para V1.

## Alcance congelado

| Sistema | Lo integrado y comprobado | Límite de esta versión |
|---|---|---|
| Camino/constancia | Día, luz, progreso, crecimiento, entrada al Mundo y linterna; ayudas y Estudio | Una primera sesión humana debe valorar claridad y ritmo; no hay campaña narrativa completa |
| Mundo | Coordenadas, regiones/chunks, continentes/mar, vecinos relacionados, Original y Paisajes vivos | Procedural 2D, finito por precisión numérica; no una simulación física/ecológica completa |
| Variedad | 11 biomas, 33 hábitats y 52 estilos; recetas, timbres, gramáticas, clima y densidad | Semillas distintas no garantizan canciones o experiencias reconociblemente distintas |
| Espacio | Clásico/Amplio/Vasto, hasta 18.000 unidades por región; claves y direcciones aisladas | Vasto aumenta extensión, conserva el mismo catálogo; no añade por sí solo géneros |
| Música | Radio evolutiva, arcos, bajos/groove/melodía, síntesis, clima, proximidad y control de registro | No es música pregrabada ni mastering artístico/LUFS certificado |
| Producción | Reverb/eco, FX regionales, filtro/robot/chorus/phaser/freeze, modo suave y salida protegida | Falta escucha física larga; no hay mixer independiente por todos los buses |
| Interacciones | Cubo/contacto/recorrido/quietud; suelo, diez encuentros, juguetes, lluvia/rayos, vidrios/espejos, cuerdas/prismas/membranas | Edición fina de algunos hilos/partes conserva modo experimental de dedo |
| Vida | Bandadas, formación, llamadas/respuestas, lira, luciérnagas y flora; quietud/cajas/poderes | Persistencia selectiva; confianza y poderes temporales, no ecosistema histórico completo |
| Búsqueda | Ocho estudios sintéticos inspirados en tradiciones, guardianes, huellas, puertas y 24 recuerdos | No incorpora obras históricas ni personajes culturales investigados; una estructura de búsqueda principal |
| Mascota | Una ganada por actividad/caja rara, tres roles, frase y crecimiento guardados, contacto/sueño/búsqueda local | No hay cría, inventario, cambio de especie ni búsquedas remotas del mapa |
| Cubo/UI | Blanco disponible, colores ganados, estelas/halo, preview, dos controles persistentes en Mundo; UI sin jingles | HUD/voz tienen algunos contadores; zoom/pinch del documento está restringido |
| Crear | Estudio, muestras, bandas y ecos/fijación optativa; borrar por anillo; código WD1 y grabar set | La mayor parte del gesto es temporal. No se guardan canciones como escenas |
| Volver | Favoritos (64), direcciones/semilla/versiones/capa, orientación y autopilot | Sin teletransporte universal ni sincronización entre dispositivos |
| Probar | Laboratorio de 54 casos, anotaciones/exportación; atlas de 130 vistas | Son familias y estados de referencia, no todas las figuras posibles |
| Progreso/offline | Guardado recuperable/versionado, respaldo/importación, cachés limitadas y shell con fuentes locales | Dependiente del almacenamiento del navegador; los registros históricos pueden crecer con viajes muy largos |
| Red | Servido estático, compartibles descargables; grabación explícita sin micrófono | Sin cuentas, backend, guardado remoto, telemetría de servidor o composición multijugador |

La regla jugable es coherente: **caminar → provocar una respuesta → escuchar/modelar → recordar/regresar**. Camino da la entrada y constancia; Mundo permite descubrir/interpretar; Estudio permite ordenar muestras. Mascota, culturas y favoritos refuerzan ese recorrido. El desarrollo narrativo más profundo se conserva para V2, sin atribuirle funciones que aún no existen.

## Hallazgos corregidos

| ID | Problema demostrado | Solución en esta rama | Evidencia |
|---|---|---|---|
| C01 | SW de red primero podía reemplazar archivos individualmente, activar una versión mientras seguía abierta otra y acumular URLs de semillas | Shell de versión completa, caché propia primero, trabajador nuevo esperando y activación explícita; sin cachear consultas arbitrarias | `pwa_updates_smoke.py`: versiones A/B reales, módulos coherentes, 106 assets constantes, preview y fuentes offline |
| C02 | Una pestaña antigua podía sobrescribir el progreso de otra | Comparar el último guardado conocido con el almacenamiento antes de escribir; conflicto conserva el guardado nuevo y permite exportar la copia en memoria | `v1_closure.mjs` y dos páginas reales en `v1_closure_smoke.py` |
| C03 | Reset conservaba poderes, auto, ecos/respuestas y estado corporal; quietud leía `listened` ausente | Limpieza explícita de estados temporales y etiquetas/aria de modo, fijación y suave; cuerpo reinicializado, libro de quietud normalizado y regalos acotados a 200 | Reset real y reentrada al Mundo; suites de guardado/identidad |
| C04 | Forzado experimental del laboratorio podía filtrarse al Estudio; su getter devolvía el nivel anterior | Limitar cálculo/emisión a la superficie y calcular el nivel actual; limpiar identidad al cambiar la partida | Prueba de Estudio inmediata y repetición de 26 mezclas afectadas |
| C05 | Grabar set tomaba audio antes del margen final, dejaba pistas/URLs y no manejaba fallos de inicio | Capturar `headroom`, parar pistas/desconectar el destino, revocar URL anterior y recuperar UI tras error | Dos grabaciones nativas, conexiones de salida y constructor fallido probado |
| C06 | Actualización podía recargar una pestaña que grababa un set o tenía avance sin guardar | Guardado previo, diferir recarga mientras graba y conservar memoria si falla; control solo en menú | Prueba de eventos de actualización/recording y SW real |
| C07 | Fonts de Google e iconos de manifiesto no completaban el shell local | Mismas tipografías empaquetadas con OFL y hashes; cachear fonts y todos los iconos | Auditoría estática y carga offline real |
| C08 | Ayudas/paneles/gestos y un logro seguían anunciando jardín modular/rastro retirados | Retirar UI y callbacks muertos; ayuda de cubo coherente; ocultar logros retirados no obtenidos, conservar históricos obtenidos | Recorridos existentes, auditoría de IDs/imports y Bitácora |
| C09 | Código WD1 aceptaba coordenadas coercibles y capas inválidas como superficie | Validar objeto, semilla, números y capa antes de construir dirección | Payloads nulos, arrays, strings y capa 99 rechazados; round-trip válido conservado |
| C10 | Cambio de mundo dependía del último autosave; el auditor no aceptaba Vasto | Guardar antes de navegar, conservar avance ante fallo; aceptar Vasto y medir sus perfiles | `seeds_smoke.py`, auditorías Original/Vivo/Vasto |
| C11 | Cifras podían incluir flags de contenido retirado como variedad vigente | Firma del auditor v2 excluye patch/trail; receta histórica intacta para compatibilidad | JSON nuevos con `signatureVersion: 2`; capturas del generador antiguo pasan |
| C12 | Pruebas confundían cambio armónico/último autosave con fallos del juego | Inyectar frase exacta en un mismo turno; comparar progreso durable al salir y guardar snapshot aislado del preview | Diálogo en tres tamaños y semillas móvil/escritorio, luego regresión completa |

C02 es una **protección optimista**, no una transacción distribuida: dos escrituras simultáneas que pasen la comprobación en la misma ventana no tienen exclusión atómica. V1 recomienda una pestaña activa. Web Locks/IndexedDB y, para cuentas, control de revisiones en servidor resuelven ese caso en la siguiente arquitectura; no se promete sincronización actual.

## Evidencias de cierre

- **55 suites Node**: versiones/corrupción/cuota/restauración, identidad y mapas antiguos, cachés, música, modelos, mascota y conflictos/actualización.
- **39/39 recorridos de navegador aprobados**, más recarga offline con los 95 módulos; incluye cubo real con webdriver desactivado en las pruebas nuevas, menús silenciosos, progresión, mezcla de sistemas, dos pestañas, grabación nativa y PWA A→B.
- **164 renderizados de audio** en siete programas: 77 base, 14 interacciones profundas, 6 vidrios, 12 ecología, 8 composición, 26 exploración y 21 mascota. Los 52 estilos están presentes; 44,1/48 kHz, normal/suave y mezclas densas. Se repiten los 26 afectados por el cálculo experimental y se conservan esos resultados finales.
- Pico máximo de muestra **0,95759**, señal finita y **cero muestras por encima de 0,98** en las mediciones. La etapa de salida/retornos también pasa sus comprobaciones. Son renders de diez segundos con primer segundo excluido: no prueban fatiga a treinta minutos, altavoces/Safari reales ni true peak/LUFS.
- Integridad: **95 módulos, 224 IDs HTML, 209 referencias de importación, 106 assets del shell**, sin imports/IDs/archivos faltantes; fonts/avisos OFL verificados por hash. `npm run audit:release` pasa y se añade a CI.
- CI remoto: su consulta devolvió **403 Forbidden**. No se atribuye un resultado de GitHub a estas pruebas locales. El workflow solo corre en PR/main: debe aprobarse al crear el PR de esta candidata.

[Resultados de audio](scripts/v1-audio-audit.json) · [integridad](scripts/v1-repository-audit.json) · [registro global](scripts/v1-closure-validation.json).

## Variedad comprobada ahora

Nueva firma v2, tres semillas y 4.000 candidatos por semilla:

| Perfil | Candidatos | Firmas detalladas | Firmas musicales terrestres |
|---|---:|---:|---:|
| Original/Clásico | 12.000 | 11.989 | 7.535 |
| Vivo/Clásico | 12.000 | 12.000 | 7.536 |
| Vivo/Vasto | 12.000 | 12.000 | 7.536 |

[Original](scripts/v1-original-audit.json) · [Vivo](scripts/v1-living-audit.json) · [Vasto](scripts/v1-vast-audit.json). Son muestras estructurales, no el número de mundos completos ni canciones. Las cachés permanecen acotadas. Los conteos históricos de un millón de candidatos usaban otra firma: se conservan como historia, sin extrapolarlos a experiencias únicas de V1.

## Pendientes reales, solución y prioridad

**P0 de aceptación/publicación**: no se pueden sustituir por otro test de Chromium.

| ID | Falta | Acción concreta / criterio de cierre |
|---|---|---|
| A01 | Escucha y controles en dispositivos reales | iPhone/Safari y Android/Chrome, auriculares y altavoz: sesiones de 20–30 min de minimal/dub/ambient, percusivo/tropical, melódico y experimental; quietud, transiciones, mascota, espejos y set. Anotar fatiga, graves/agudos, cortes y gestos; corregir solo hallazgos |
| A02 | Consumo y ciclo de vida real | PWA instalada, ocultar/reanudar, bloqueo de pantalla, cambio de audio y ruta larga; medir batería/memoria/FPS. Sin fallo de progreso ni crecimiento continuo injustificado de recursos |
| A03 | Primera sesión humana | Persona nueva: llegar a Mundo, hacer música con el cubo, entender un encuentro y guardar/volver a un favorito. Si requiere explicación externa, ajustar esa ayuda; evaluar el tamaño de Voz/notificaciones |
| A04 | Publicación y CI de la candidata | Un PR de esta rama hacia main, checks verdes, elegir host HTTPS, backup antes de cambiar origen, verificar subruta/manifest/SW y primer update/rollback. No se desplegó desde esta auditoría |

**P1 conocidos, acotados; no ocultarlos como “todo perfecto”:**

- Zoom/pinch de documento restringido por el control del juego; parte de la UI usa texto pequeño. Solución: permitir zoom en menús sin mover canvas, o escala de UI y revisión con fuentes grandes. La emulación actual verifica tamaños/scroll/foco, no certificación completa de accesibilidad.
- `places`, `cat`, eventos, continentes y algunos históricos pueden crecer durante viajes muy largos; la validación/cuota impide escribir y avisa, pero no hay compactación general. Solución: índices/colecciones en IndexedDB, Bitácora paginada, exportación por bloques y política que conserve contadores y hallazgos. No borrar descubrimientos antiguos a ciegas para pasar la auditoría.
- Algunos controles finos permanecen en `?dedo=1`; la mayoría de pruebas históricas permiten ese modo vía webdriver. Solución V2: gesto equivalente por cubo para edición fina y ampliar cobertura de control real. Los guardianes/mascota/cuerpo ya se prueban sin esa excepción.
- Narrativa Camino/Mundo/Estudio y recompensa expresiva necesitan más profundidad; búsqueda cultural aún comparte una mecánica principal. Solución V2: variaciones de verbos/pistas y memoria musical útil antes de añadir cien objetos nuevos.
- No existe un límite universal de 20–30 % de pantalla por efecto/objeto: Campo y atmósfera pueden ocupar más, con transparencia. Solución: presupuesto por viewport de huella visual, opacidad y duración; revisión en el laboratorio móvil antes de reducir elementos que Jay sí quiera conservar. No se declara aprobado ese criterio estético por pasar tests.
- Formato/captura de sets depende del navegador; error recuperable no equivale a soporte Safari. Solución: matriz física de codecs, descarga/compartir y límite de memoria, con fallback de solo audio si se decide más adelante.
- Prototipo sigue accesible en menú: puede completar día/cambiar fecha/resetear. V1 RC conserva esa herramienta para pruebas. Antes de edición pública final, decidir si ocultarla con una configuración de desarrollo; no confiar en esos campos para cuentas/rankings futuros.

## Qué no está y se pasa a V2

Cuentas/servidor/sincronización y multijugador; historia completa; ecosistema cultural profundo y reliquias históricas investigadas; construir/cablear/crafting; mixer por buses; nuevos estilos con diferencias reales; nuevos motores y formas largas; edición avanzada del Estudio y sesiones compartidas. No se reintroducen escenas musicales guardables descartadas por Jay. [Plan de V2](PLAN_V2.md).

## Integración y operación de esta candidata

1. Probar esta rama y crear **un PR hacia main**. Incluye culturas + mascota + cierre. Si se integran padres antes, conservar merges normales y volver a revisar la diferencia; no sumar tres veces las mismas entregas.
2. Mantener alcance congelado: solo correcciones de fallos/aceptación. El resto entra a V2.
3. Para publicar después: paquete completo de la misma versión bajo HTTPS, `sw.js` revalidable (sin caché HTTP larga), HTML revalidable y assets versionados. La actualización del SW empieza a ser coherente desde RC1; el trabajador anterior no puede corregirse retroactivamente. Para la primera migración, cerrar pestañas viejas y comprobar backup/recarga, o usar una ruta de release nueva.
4. Cambiar dominio/puerto cambia el almacenamiento local. Exportar e importar explícitamente la copia compatible; no prometer que el servidor nuevo encuentre los datos del teléfono.
5. Rollback: conservar el paquete completo anterior y publicar su SW con un nombre de caché nuevo; no reemplazar solo `main.js`. No cambiar generador/identidad ni sobrescribir partidas con una versión incompatible.

Punto final de desarrollo para esta V1: código consolidado y pruebas/documentación reproducibles. Punto de publicación: A01–A04 aceptados y una release de la candidata elegida. Esos son los únicos pasos de cierre, antes de abrir nuevas funciones de V2.
