# Expansión rítmica · tres fases amplias

Autorizada por Jay después de la auditoría V1. No publicar ni hacer merge automáticamente: commit/push y Jay revisa. Base pendiente `audit/v1-closure` (797595c), que ya contiene culturas, mascota y cierre. Main observado 8096c8d.

## 1. Percusión en el paisaje · feat/percussion-landscapes · RC2

Ocho familias: piedra de bombo (kick/tom), tronco hueco (conga/tom), raíces de clave (wood/rim), juncos de raspado (guiro/wood), vainas (shaker/wood), concha de timbal (timbale/rim), polvo de palmas (clap/shaker) y charco de toms (tom/conga). El rol siempre es percusión; región/género/variante cambian el instrumento. Ambient y otros estilos tranquilos reducen los timbres brillantes. Son sintetizadores existentes, combinados en objetos/gestos nuevos, no samples descargados ni ocho instrumentos DSP nuevos.

Cruzar = golpe; mover entre juncos/vainas = raspado; rodear concha = acento; quedarse en piedra/tronco/charco = frase de dos golpes al tempo. Salir termina esa frase; ningún registro/fijación es obligatorio. Dos golpes sostenidos y hasta cuatro gestos manuales por compás de tiempo de audio, con curaduría de voces, ganancia espacial y presupuesto ambiental compartido. Quiet pockets no añaden groove sostenido; una interacción deliberada sí puede golpear. Menús, scanner, pestaña oculta, mute y cambio de partida bloquean la emisión. No existe percusión de UI.

Generación `rhythm:placement:v1`: 30% de chunks sin elementos, demás 1–3 agrupados con espacio, sin mar. Caché máxima 64 chunks. Los streams anteriores y coordenadas de favoritos no cambian. Ocho casos nuevos en Laboratorio → Percusión: **62 casos totales**. Scanner explica gesto e instrumento; bitácora lista familias tocadas; dos logros (primera y cuatro familias). Estado `S.rhythmFound` aditivo, compatible con partidas antiguas.

Pruebas: 56 suites Node; flujo móvil nuevo y laboratorio. Render offline en los 52 géneros + ocho casos ambient suave a 44,1 kHz, resultados en `scripts/percussion-audio-validation.json`. Medir señal no equivale a escuchar en un teléfono físico.

## 2. Identidad de publicación · feat/release-identity · RC3

Implementada sobre RC2 (9dbb987). Esquina superior derecha, dos líneas pequeñas sin botones: versión y fecha/hora del deploy en hora local del dispositivo. Permanece visible al ocultarse el HUD musical. Móvil 320/390 px y paisaje 844 px comprobados. Ningún sonido al mostrarse/usar menús.

Regla: **1.0.0-rc.N** para candidatas antes de aceptación, **1.0.0** para primera estable, **1.0.X** correcciones, **1.X.0** ampliaciones compatibles, **2.0.0** cambio mayor incompatible. No incrementar por cada commit; por entrega/probable publicación. `package.json`, HTML y `src/release-info.js` coherentes, auditados. El host conserva una release completa en la caché PWA; no mezcla metadata nueva con código viejo.

El repo aún no tiene host/pipeline de deploy confirmado. `deployedAt:null` muestra **deploy sin registrar**; nunca hora de commit ni fecha inventada. El futuro host aporta sello UTC real y revisión publicada al artefacto:

```bash
node scripts/stamp-deploy.mjs --dir /ruta/artefacto --deployed-at FECHA_ISO_UTC_REAL --revision SHA_PUBLICADO
```

Valores ilustrativos se omiten a propósito. La herramienta valida antes de escribir `src/release-info.js` y una clave de caché específica por timestamp/revisión; no hace el deploy ni verifica la plataforma. Integrarla en el proceso del host junto a la activación de la publicación y comprobar el dato servido. No usar en el checkout como sustituto de publicar. Sin pipeline no se puede certificar hora de último deploy. Los sellos sintéticos en tests son fixtures, no datos de esta entrega.

Pruebas: normalización/timestamps inválidos, sello en artefacto temporal, UI móvil y update real A→B de SW esperando aprobación y offline. Se corrige el test SW que dependía de un nombre fijo de RC1; ahora sigue la versión del repo.

## 3. Minimalismo y búsqueda · feat/minimal-discoveries

Reducir rellenos, halos y detalle sobrante en vidrios/espejos/prisma, conservar geometría jugable. Contador discreto de familias de elementos descubiertas mediante interacción, guardado y bitácora; no sumar el mismo elemento repetidamente ni inventar millones de canciones únicas. Integrar percusión y encuentros con el catálogo. Sorpresas locales raras, con estado explicable y silencio entre respuestas. Documentos/atlas y regresión final.

## Orden de integración

`audit/v1-closure` → fase 1 → fase 2 → fase 3. Cada hija contiene toda la anterior. Puedes probar cada fase y hacer merge normal en orden, o usar **un PR de la última hacia main** para incluir todo. No reintroducir ramas ya contenidas. Squash/rebase o cambios paralelos en main pueden requerir reajuste; no se promete cero conflictos ante modificaciones externas.
