# Entrega K1–K6 · alpha.187

**Continuación autorizada:** K7 (`pulido/k7-rumbo-y-despedida`, alpha.188) parte de K6 y se integra después. Corrige rumbo/coda/salida según nueva prueba de Jay. [Estado y auditoría actual](panel/sesion-7/informe.md). Este documento conserva evidencia histórica de K1–K6.

Las seis fases están implementadas técnicamente. Rama por fase, encadenadas desde auditoría `7476aa7a` y main `3c5fd7b6`. Jay conserva PR y merge; no se integra esta entrega en main por parte del agente.

| Fase | Rama | Versión | Commit de la fase |
|---|---|---|---|
| K1 | `pulido/k1-guia-anillo` | alpha.182 | `6828339b` |
| K2 | `pulido/k2-economia-chispas` | alpha.183 | `cbec239e` |
| K3 | `pulido/k3-final-viaje` | alpha.184 | `3da51c4d` |
| K4 | `pulido/k4-interfaz-clara` | alpha.185 | `3af4da37` |
| K5 | `pulido/k5-recorrido-contextual` | alpha.186 | `a0ccfffe` |
| K6 | `pulido/k6-validacion-cierre` | alpha.187 | `ceb33ca9` |

Integrar en ese orden. Cada rama posterior incluye la anterior; no volver a incorporar por separado la rama de auditoría. No borrar las ramas para probarlas. Si main cambia por otro trabajo, comprobar el candidato conjunto antes de integrar.

## Qué cambia

- K1: rumbo a pie al siguiente lugar, nombre/distancia y ocho direcciones; ancla migrada y fija. Seguir no cobra ni lleva al portal automáticamente.
- K2: fragmentos recogidos dan base×1; a tiempo×2 y ocho aciertos×3. Pendientes antiguos×0 cobran su base; recogidos no se duplican. Estrellas y precios intactos.
- K3: final5 en el contexto de salida, frases interpretadas sin cambiar MIDI guardado, voces existentes y salida silenciosa. Admite frases parciales y salida durante fade.
- K4: Continuar y tres destinos; utilidades discretas, sonido en Ajustes y vuelta al Camino en Más. Avisos territoriales legibles y ayuda de guardar cerca del marcador. Controles y pruebas siguen sus ubicaciones reales.
- K5: cinco de once y seis por descubrir; Explorar a pie sale junto al Refugio y orienta. Guía contextual, prácticas opcionales y lección de guardar retirada de la presentación automática tras el Viaje.
- K6: prueba caminada, recompensa/recarga y rumbo a Dunas; guía válida al volver desde Camino, etiquetas Regiones/Otro paisaje, viaje rápido voluntario a capítulos ya completos, ajustes de texto ampliado y revisión de los mismos hallazgos.

## Comprobación

[Registro completo](panel/sesion-6/evidencia/verificacion-k6.json), [preservación](panel/sesion-6/evidencia/preservacion-k6.json), [renders final5](panel/sesion-6/evidencia/final5-k3.json), [UI normal](panel/sesion-6/evidencia/ui-k6.json) y [texto doble](panel/sesion-6/evidencia/ui-200-k6.json).

246 suites Node aprobadas; auditoría sin errores/avisos. 297 archivos protegidos idénticos al cubo pequeño: radio, generadores, assets y otras hojas de estilo. Las implementaciones de voces y reglas puras de los once juegos permanecen iguales. La lista de integración revisada y la hoja de UI autorizada se excluyen explícitamente; no se afirma identidad de todo el árbol. Inventario SVG conservado, permitiendo reordenar los controles.

La marcha automatizada llegó a Jardín en 29.2 s, desde6000 unidades, con gasto0. Usa controles reales y lee la dirección; no escribe coordenadas durante el recorrido. Después se acelera únicamente el cierre mediante el controlador real de premios, se pulsa la acción a Dunas y se comprueba recarga. No es una sesión humana ni una partida de veinte minutos sin fixtures.

También aprobaron paseo automático, eco/banda, efectos, volumen silencioso y guardado de estudio/sesión. Las muestras de UI cubren cuatro tamaños,24 estados normales y24 con texto doblado. Se corrigieron dos desbordamientos medidos en320 con texto ampliado. Son muestras de navegador local, no certificación de un teléfono físico.

Se reutilizan los renders afectados aprobados cuando no cambia el audio. No se repite el catálogo entero de navegador/audio por cambios de UI; el CI completo corresponde al candidato de PR antes de integrar. No se declara CI remoto, Vercel de esta rama, tiendas o escucha humana.

## Prueba en teléfono

1. Abrir el preview normal, sin parámetros de desarrollo. Tras el final, pulsar Explorar a pie o Seguir hacia Jardín: caminar siguiendo rumbo/distancia. No se gasta saldo ni se salta al portal.
2. Recoger fragmentos fuera de tempo y comparar con un cristal roto a tiempo. Comprobar saldo después de cerrar/abrir la app.
3. Escuchar el final5 completo y su salida anticipada, con altavoz y auriculares. Confirmar que el cierre resulte agradable y que no quede la antigua cama sobre créditos.
4. Abrir menú, Ajustes → Sonido, Lugares y la guía. Comprobar retrato, horizontal y texto grande; observar que no reaparezca la vieja lección automática de guardar.
5. Completar Jardín, seguir hacia Dunas y recargar. Confirmar su estrella, saldo y destino.

## Cierre humano

El panel simulado revisó las correcciones: nota técnica provisional 7,9 frente a7,2. [Reevaluación](panel/sesion-6/cierre-k6.md). No es escucha ni jurado humano. V01 mantiene pendiente la aceptación de Jay del final5/interfaz en teléfono y cinco sesiones sin ayuda, dos con personas poco habituadas a jugar. P01 conserva su pendiente de interés tras ganar. No se abre otra expansión para elevar la nota. Supabase y tiendas siguen en pausa.
