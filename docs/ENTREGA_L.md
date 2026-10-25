# Entrega L1–L4

Ramas encadenadas desde K7 `5f0c5d88`. Jay conserva PR y merge; no se integra en main. Música generativa, mapas, semillas y cubo conservados.

| Fase | Rama | Versión | Resultado |
|---|---|---|---|
| L1 | `pulido/l1-aprender-jugando` | alpha.189 | 247 suites Node, auditoría estática y Jardín real en320/390/1280 aprobados |
| L2 | `pulido/l2-frase-propia` | alpha.190 | 248 suites, cierre dorado real y render de canción aprobados |
| L3 | `pulido/l3-conservar-y-acceder` | alpha.191 | 248 suites y pruebas de cuota/foco aprobadas |
| L4 | `pulido/l4-aceptacion` | — | Pendiente |

L1 añade guía recuperable de tres pasos para once lugares. Jardín demuestra semilla/agua junto a una parcela, sin modificar puntos ni emitir audio. La ayuda contextual aparece brevemente si no avanzas y se retira al cosechar. Menú → Más → Guía → Ver el gesto permite repetirla. La cola confirma presentación antes de guardar una explicación como vista; rechazo, caducidad o cambio de partida no consumen el aprendizaje.

La prueba local usa controles reales, consigue una flor y cosecha. No demuestra que una persona nueva comprenda sin ayuda. No se modificó ningún instrumento/arreglo musical: no corresponde repetir sus renders en L1.

L2 captura hasta ocho notas propias durante la ronda, antes de que el objeto dorado la cierre. La última se conserva; otro lugar o ronda no aporta notas por arrastre. Si no hay notas válidas nuevas, permanece la frase histórica. Fallo de escritura conserva la ronda y su frase para reintentar, sin pagar dos veces. Las notas crudas, escalas y voces existentes no se regeneran.

L3 revierte renombre, notas y borrado de favoritos si guardar falla; borrar no cancela la ruta antes de confirmar. El modo de llegada también vuelve al valor anterior si no se guarda. Los finales dinámicos se integran en la gestión de foco: fondo inerte, Tab contenido y Escape llama al cierre real. Sus paneles detienen interacción de fondo y avisos rutinarios mientras están abiertos; música base y voces no cambian.
