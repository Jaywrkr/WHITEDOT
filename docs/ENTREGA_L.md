# Entrega L1–L4

Ramas encadenadas desde K7 `5f0c5d88`. Jay conserva PR y merge; no se integra en main. Música generativa, mapas, semillas y cubo conservados.

| Fase | Rama | Versión | Resultado |
|---|---|---|---|
| L1 | `pulido/l1-aprender-jugando` | alpha.189 | 247 suites Node, auditoría estática y Jardín real en320/390/1280 aprobados |
| L2 | `pulido/l2-frase-propia` | alpha.190 | 248 suites, cierre dorado real y render de canción aprobados |
| L3 | `pulido/l3-conservar-y-acceder` | alpha.191 | 248 suites y pruebas de cuota/foco aprobadas |
| L4 | `pulido/l4-aceptacion` | alpha.192 | 248 suites y recorridos enfocados aprobados; personas/CI de PR pendientes |

L1 añade guía recuperable de tres pasos para once lugares. Jardín demuestra semilla/agua junto a una parcela, sin modificar puntos ni emitir audio. La ayuda contextual aparece brevemente si no avanzas y se retira al cosechar. Menú → Más → Guía → Ver el gesto permite repetirla. La cola confirma presentación antes de guardar una explicación como vista; rechazo, caducidad o cambio de partida no consumen el aprendizaje.

La prueba local usa controles reales, consigue una flor y cosecha. No demuestra que una persona nueva comprenda sin ayuda. No se modificó ningún instrumento/arreglo musical: no corresponde repetir sus renders en L1.

L2 captura hasta ocho notas propias durante la ronda, antes de que el objeto dorado la cierre. La última se conserva; otro lugar o ronda no aporta notas por arrastre. Si no hay notas válidas nuevas, permanece la frase histórica. Fallo de escritura conserva la ronda y su frase para reintentar, sin pagar dos veces. Las notas crudas, escalas y voces existentes no se regeneran.

L3 revierte renombre, notas y borrado de favoritos si guardar falla; borrar no cancela la ruta antes de confirmar. El modo de llegada también vuelve al valor anterior si no se guarda. Los finales dinámicos se integran en la gestión de foco: fondo inerte, Tab contenido y Escape llama al cierre real. Sus paneles detienen interacción de fondo y avisos rutinarios mientras están abiertos; música base y voces no cambian.

## L4 · Cierre técnico y aceptación pendiente

Se comprueban Camino táctil, marcha al Jardín sin salto/gasto, rondas y final11. En la repetición se detectó que un aviso cotidiano podía sustituir una ayuda importante de su misma categoría mientras esperaba: ahora solo reemplaza avisos de prioridad igual o menor. Aprendizaje tiene categoría propia. Se conserva la aserción de presentación real y se añade la colisión de prioridades detrás de un menú. También se protege un formato futuro instalado mientras esperaba un aviso y se restaura exactamente la versión previa de la ayuda si guardar falla.

| Comprobación | Estado |
|---|---|
| Comprensión sin ayuda, cinco personas, dos no habituales | Pendiente de personas reales |
| Escucha final5/final11 en altavoz y auriculares físicos | Pendiente de Jay |
| Lector de pantalla en dispositivo real | Pendiente; teclado/ARIA se verifican localmente |
| CI completo del candidato conjunto | Pendiente de PR; workflow se dispara en PR/main, no en estas ramas |
| Main / servicios / tiendas | Sin cambios; no publicado por esta entrega |

La referencia del panel sigue7,7 sobre la versión que probó Jay. No se eleva por pruebas automatizadas. L4 no declara producción terminada: registra qué se verificó y qué necesita evidencia humana. [Guía de sesión](PRUEBAS_CON_PERSONAS.md), [evidencia](panel/sesion-7/evidencia/cierre-l.json).

## Cómo probar

1. Jardín: menú → Más → Guía. Lee los tres pasos y pulsa Ver el gesto. Acércate al círculo, siembra, riega y cosecha; la demostración se retira.
2. Completa dos rondas cortas del mismo lugar; Tu canción conserva la frase nueva, incluida su última nota, sin tomar notas del anterior.
3. Edita nombre y notas de un favorito. Cierra y vuelve a abrir: deben mantenerse. La simulación de fallo de disco es automática; no se pide llenar el teléfono.
4. En PC abre Tu canción: Tab queda dentro; Escape cierra de verdad. Tras el final5 vuelves al Mundo libre.

Ramas y commits previos: L1 `3e0d3554`, L2 `d7bfc921`, L3 `507cc746`. L4 parte de L3; cada una contiene la anterior. Jay mantiene PR y merge.
