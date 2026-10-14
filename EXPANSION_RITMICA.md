# Expansión rítmica · tres fases amplias

Autorizada por Jay después de la auditoría V1. No publicar ni hacer merge automáticamente: commit/push y Jay revisa. Base pendiente `audit/v1-closure` (797595c), que ya contiene culturas, mascota y cierre. Main observado 8096c8d.

## 1. Percusión en el paisaje · feat/percussion-landscapes · RC2

Ocho familias: piedra de bombo (kick/tom), tronco hueco (conga/tom), raíces de clave (wood/rim), juncos de raspado (guiro/wood), vainas (shaker/wood), concha de timbal (timbale/rim), polvo de palmas (clap/shaker) y charco de toms (tom/conga). El rol siempre es percusión; región/género/variante cambian el instrumento. Ambient y otros estilos tranquilos reducen los timbres brillantes. Son sintetizadores existentes, combinados en objetos/gestos nuevos, no samples descargados ni ocho instrumentos DSP nuevos.

Cruzar = golpe; mover entre juncos/vainas = raspado; rodear concha = acento; quedarse en piedra/tronco/charco = frase de dos golpes al tempo. Salir termina esa frase; ningún registro/fijación es obligatorio. Dos golpes sostenidos y hasta cuatro gestos manuales por compás de tiempo de audio, con curaduría de voces, ganancia espacial y presupuesto ambiental compartido. Quiet pockets no añaden groove sostenido; una interacción deliberada sí puede golpear. Menús, scanner, pestaña oculta, mute y cambio de partida bloquean la emisión. No existe percusión de UI.

Generación `rhythm:placement:v1`: 30% de chunks sin elementos, demás 1–3 agrupados con espacio, sin mar. Caché máxima 64 chunks. Los streams anteriores y coordenadas de favoritos no cambian. Ocho casos nuevos en Laboratorio → Percusión: **62 casos totales**. Scanner explica gesto e instrumento; bitácora lista familias tocadas; dos logros (primera y cuatro familias). Estado `S.rhythmFound` aditivo, compatible con partidas antiguas.

Pruebas: 56 suites Node; flujo móvil nuevo y laboratorio. Render offline en los 52 géneros + ocho casos ambient suave a 44,1 kHz, resultados en `scripts/percussion-audio-validation.json`. Medir señal no equivale a escuchar en un teléfono físico.

## 2. Identidad de publicación · feat/release-identity

Versión SemVer y fecha/hora de publicación en esquina superior derecha. Nunca sustituir deploy por commit. El repositorio no tiene host/pipeline de publicación verificado: sin dato se muestra «deploy sin registrar». Preparar un sello de publicación para el futuro host y comprobar PWA/offline/versiones coherentes. Cambio pequeño aislado para probar.

## 3. Minimalismo y búsqueda · feat/minimal-discoveries

Reducir rellenos, halos y detalle sobrante en vidrios/espejos/prisma, conservar geometría jugable. Contador discreto de familias de elementos descubiertas mediante interacción, guardado y bitácora; no sumar el mismo elemento repetidamente ni inventar millones de canciones únicas. Integrar percusión y encuentros con el catálogo. Sorpresas locales raras, con estado explicable y silencio entre respuestas. Documentos/atlas y regresión final.

## Orden de integración

`audit/v1-closure` → fase 1 → fase 2 → fase 3. Cada hija contiene toda la anterior. Puedes probar cada fase y hacer merge normal en orden, o usar **un PR de la última hacia main** para incluir todo. No reintroducir ramas ya contenidas. Squash/rebase o cambios paralelos en main pueden requerir reajuste; no se promete cero conflictos ante modificaciones externas.
