# Aceptación V1

Esto no lo cubren las pruebas automáticas: lo haces tú con teléfonos y personas reales. Usa la **vista previa de Vercel** de la rama, o producción después del merge. Anota cada fallo con teléfono, navegador y qué hiciste. **Solo se corrige en V1 lo que impide jugar, oír o guardar.** Todo lo demás va a [PLAN_V2.md](PLAN_V2.md).

## 1. Teléfonos (unos 30 min por equipo)

| # | Prueba | iPhone (Safari) | Android (Chrome) |
|---|---|---|---|
| 1 | Abrir el enlace, tocar y oír música | ☐ | ☐ |
| 2 | Completar el Camino y entrar al Mundo | ☐ | ☐ |
| 3 | 20 min con audífonos: volumen cómodo, sin cortes ni saturación | ☐ | ☐ |
| 4 | 5 min con altavoz del teléfono: se oye bajo y ritmo | ☐ | ☐ |
| 5 | Instalar como app y abrirla sin conexión | ☐ | ☐ |
| 6 | Bloquear pantalla 2 min y volver: sigue, sin sonido duplicado | ☐ | ☐ |
| 7 | Girar el teléfono: el menú y las hojas caben | ☐ | ☐ |
| 8 | Grabar set de 30 s, descargarlo y verlo en la galería (4:5) | ☐ | ☐ |
| 9 | Compartir mi día: la tarjeta se guarda | ☐ | ☐ |
| 10 | Menú → Guardar copia: exportar el archivo | ☐ | ☐ |
| 11 | Batería tras 30 min (anota %): ____ | ☐ | ☐ |
| 12 | El pie del menú muestra versión y fecha de deploy reales | ☐ | ☐ |
| 13 | Tocar 5 linajes vivos distintos (flora, fauna, construcción): cada uno responde | ☐ | ☐ |
| 14 | 10 min quieto en un lugar: la música evoluciona sin cansar | ☐ | ☐ |

## 2. Tres personas nuevas (10 min cada una)

Dales el teléfono **sin explicar nada**. Observa y no ayudes. Anota:

| Pregunta | P1 | P2 | P3 |
|---|---|---|---|
| ¿Entendió que debía arrastrar? (sí/no y en cuántos segundos) | | | |
| ¿Descubrió el pulso al tocar? | | | |
| ¿Llegó al Mundo? | | | |
| ¿Abrió el menú? ¿Qué buscó? | | | |
| ¿Dónde se quedó trabado? | | | |
| Lo que dijo al terminar (literal) | | | |

Si dos de tres se traban en el mismo punto, se cambia el texto o la ayuda de ese punto. No se añaden tutoriales.

## 3. Duetos (opcional, con el servidor)

Solo si vas a ofrecer duetos: levanta `python3 server/app.py` en un host HTTPS propio y prueba dos teléfonos en redes distintas (sala, entrada tardía, latencia, reconexión). En Vercel no hay servidor y la opción no aparece; no bloquea la 1.1.0.

## 4. Lo que ya está comprobado en automático

Integridad del shell, suites de lógica, recorridos de navegador en 320–1280 px, offline, mezclas de audio renderizadas y API/duetos con servidor local. Ver [README](../../README.md#verificar). Esto no sustituye escuchar en un teléfono.

## Resultado

- [ ] Ningún fallo bloqueante abierto
- [ ] Fallos no bloqueantes anotados en PLAN_V2
- [ ] Jay aprueba el estilo J en móvil y escritorio

Cuando las tres casillas estén marcadas, la V1 está terminada. Simple.
