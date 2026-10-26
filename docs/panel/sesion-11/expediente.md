# Kubono · expediente para la sesión 11 del panel

26 de octubre de 2026. Versión **2.3.0-alpha.215**, `main` en `5464612` (PR #358). Repositorio en `/home/user/WHITEDOT`.

## Cómo es esta sesión

Jay pide una revisión nueva, con puntuación. Son los mismos **doce** perfiles simulados de la sesión 10: simulaciones de su mirada de diseño a partir de su obra pública. **No son sus opiniones reales.** Lucas Pope lidera y consolida.

Desde la sesión 10 se construyó su plan entero, P1–P8, con las decisiones D1–D6 de Jay. Esta sesión responde a dos preguntas, en este orden:

1. **Puntuación ciega.** Cada perfil mira alpha.215 y pone sus notas por lo que hay hoy. Mientras puntúa no lee notas anteriores.
2. **Contraste.** Con las notas ya escritas, lee su propio análisis de la sesión 10 y dice qué cerró P1–P8, qué sigue abierto y qué empeoró. Las notas no se cambian después de leerlo.

## Qué es Kubono

Juego musical para teléfono, web y escritorio. Eres un cubo pequeño en un universo negro. El único verbo es **tocar a tiempo**: el juego nunca suena mal, pero solo a tiempo cuenta y da más premio.

- **El Viaje** (≈15–20 min): el Camino y cinco capítulos (Llanura, Lago, Bosque, Tormenta, Vacío). Termina con «Tu mundo se abrió» y abre el Mundo libre.
- **El Mundo libre:** once lugares en anillo, en orden. ★ completar, ★★ 75 % a tiempo, ★★★ Maestro al 70 %. Cada estrella hace crecer Tu canción; la ronda que completa los once desemboca en el final.
- **Universo abierto:** música procedural, criaturas, hallazgos, favoritos y saltos.
- **Refugio:** casa voluntaria; sus salas se abren por lugares completos o por ★.
- **Chispas ✦** compran piezas del cubo. Cuenta opcional; la nube está en pausa.

Guías: `docs/MUNDO.md`, `docs/VIAJE.md`, `docs/UNIVERSO.md`, `docs/ARQUITECTURA.md`.

## Qué decidió Jay desde la sesión 10 (D1–D6, no se reabren)

- **D1:** la capa de cada lugar crece con el mejor porcentaje a tiempo.
- **D2:** tocar donde sea; el pulso suena al apoyar el dedo; arrastrar camina.
- **D3:** tres cifras a la vista (★ de 33, ✦, lugares de 11); salas del Refugio por lugares o ★, sin cerrar las abiertas; como mucho un logro por aviso.
- **D4:** el color del lugar marca lo completo; dorado solo para ★.
- **D5:** la undécima ronda pasa sola al final; tu frase suena sobre colchón y bajo; créditos una sola vez; el Viaje termina con «Tu mundo se abrió».
- **D6:** «Crear cuenta» y «Eliminar cuenta» ocultos mientras la nube está en pausa.

## Qué se construyó (P1–P8)

| Fase | Versión | Qué cambió |
|---|---|---|
| P1 Pantallas limpias | alpha.208 | Leyenda del mapa en piezas; luz del portal fuera de pantalla; sin Laboratorio a la vista |
| P2 Menús | alpha.209 | Menú reordenado y renombrado; «Sonido» dentro de Ajustes; D6 |
| P3 El golpe junto al cubo | alpha.210 | Las lecciones del Viaje responden junto al cubo |
| P4 El cierre de la ronda | alpha.211 | Resultado tras la caída de la ronda; porcentajes coherentes |
| P5 Un solo reloj | alpha.212 | Luz y señales a la hora en que se oye la nota; ningún toque mudo (pulso suave) |
| P6 Tocar donde sea y Tu canción | alpha.213 | D2, D1 y D5 |
| P7 El color se gana | alpha.214 | D4 en portales, marcas, mapa y eco |
| P8 Menos contadores | alpha.215 | D3; «Reliquias» separadas de las ★ |

El detalle de cada fase está en `CAMBIOS.md` (secciones «P1» a «P8»). **Léelo solo en el paso 2**, después de puntuar.

CI completo en verde en `main` (lógica, 6 tandas de navegador, 6 de audio). El verificador de preservación pasa (301 archivos, 13 contratos).

## Lo que no se sabe

Nadie ha jugado con las manos ni oído el audio en un teléfono. No hay sesiones con jugadores nuevos. El retraso real de audio en Android o Bluetooth no está medido. Lo que se diga del sonido y la sensación sale del código, las capturas y las medidas. Dilo cuando sea el caso.

## Material

Carpeta base: `/tmp/claude-0/-home-user-WHITEDOT/27177074-c2b6-540f-a145-69c40272f1e8/scratchpad/panel11/`.

- **Capturas estándar** (390×844), `capturas/`: entrada, cinco capítulos, seis lugares, anillo, hoja Lugares, Tu canción, chispa salvaje, menú, guía de Jardín, libro, resultado, favoritos. `manifest.json` describe cada una. Tarjetas y resultado son escenas forzadas.
- **Capturas de menús**, `menus/`: `TAMAÑO-MODO-HOJA.png`; tamaño `tel` (390×844), `hor` (844×390) o `esc` (1280×800); modo `viaje` o `libre`. En modo `viaje` no se abren Tu cubo, Mapa, Grabar ni Semillas porque sus botones solo existen en el modo libre; Semillas tampoco se abre en libre porque está oculto mientras no viajas por semillas. Eso también es un dato. Script: `docs/panel/sesion-11/evidencia/capturas-menus.py`.
- **Modelo de dos horas:** `node scripts/play-curve.mjs` (jugadores simulados, no personas).
- **Código:** `src/`, `index.html`, `styles/estilo-j.css`.

## Qué leer y qué no

- **Paso 1 (puntuar):** código, capturas, guías de diseño, este expediente. No abras `docs/panel/**`, `docs/PANEL.md`, `CAMBIOS.md`, `HANDOFF*.md` ni `docs/ENTREGA_*.md`.
- **Paso 2 (contrastar):** tu propio análisis en `docs/panel/sesion-10/NN-perfil.md`, la sección del plan P1–P8 de `docs/panel/sesion-10/informe.md` y las secciones P de `CAMBIOS.md`.

## Reglas para no estorbar

- No abras navegadores: otros once revisores trabajan a la vez. Usa las capturas. Node ligero sí.
- No cambies ningún archivo del repositorio salvo tu análisis.
