# Kubono · expediente para la sesión 10 del panel (revisión desde cero)

26 de octubre de 2026. Versión **2.3.0-alpha.207** (commit `2e7f9d1`). Repositorio en `/home/user/WHITEDOT`, rama `review-codex` (es exactamente lo que entra en `main`).

## Cómo es esta sesión

Jay pide que el panel **empiece de cero, sin memoria**. Ningún revisor recuerda sesiones anteriores, notas, planes ni correcciones. Mira la app como si la viera hoy por primera vez y la puntúa por lo que hay, no por cuánto mejoró.

Son **doce** perfiles simulados: los diez de siempre y dos nuevos, una especialista en menús y uno en detalle visual. Son simulaciones de su mirada de diseño a partir de su obra pública. **No son sus opiniones reales.**

**Lucas Pope lidera.** Recibe los doce análisis y entrega a Jay el informe y un plan por fases, cada fase con su rama.

## Qué es Kubono (lo que dice el producto)

Juego musical para teléfono, web y escritorio. Eres un cubo pequeño en un universo negro. El único verbo es **tocar a tiempo**: el juego nunca suena mal, pero solo a tiempo cuenta y da más premio.

- **El Viaje** (≈15–20 min): el Camino y cinco capítulos (Llanura, Lago, Bosque, Tormenta, Vacío). Cada uno enseña un verbo sobre el mismo gesto (Pegar, Encadenar, Rodear, Bailar, Soltar). Termina con el cierre de **Tu canción** y abre el Mundo libre.
- **El Mundo libre**: once lugares en anillo que se abren en orden (los cinco del Viaje + Jardín, Dunas, Cristales, Faros, Ruinas, Cueva). Cada uno da ★ (completar), ★★ (75 % a tiempo, con sonido) y ★★★ (Maestro, 70 %). Cada estrella añade una capa a Tu canción. 11 lugares = victoria; 33 ★ = versión maestra.
- **Universo abierto**: música procedural, criaturas, hallazgos, actividades, favoritos y saltos.
- **Refugio**: casa voluntaria con trofeos, objetos, colección y jardín de voces.
- **Chispas ✦** (se ganan sobre todo a tiempo) compran piezas del cubo en la tienda. Las estrellas no se gastan.
- Cuenta opcional; se juega sin ella.

Guías de diseño: `docs/MUNDO.md`, `docs/VIAJE.md`, `docs/UNIVERSO.md`, `docs/ARQUITECTURA.md`.

## Lo que Jay ya decidió (restricciones, no se discuten)

- **El cubo es pequeño.** No se pide agrandarlo; la legibilidad se busca con contraste, brillo, color y señales, nunca con tamaño.
- **La música le gusta a Jay**: no se rehace la generación musical, armonías ni mezcla. Se puede proponer cómo se presenta o responde, no cambiarla.
- Tocar a tiempo es el verbo. ★★ al 75 %, ★★★ al 70 %. Lugares en orden.
- Narrador solo en la tarjeta de la ronda y en la Bitácora; el Viaje sin rótulos.
- Interfaz: negro puro, esquinas rectas, Geist Mono, blanco para estados, dorado para lo ganado; menús y botones silenciosos.
- Nada ganado se borra. La cuenta en la nube (Supabase) está en pausa.

## Lo que no se sabe

Ningún revisor ha jugado con las manos ni oído el audio en un teléfono. No hay sesiones registradas con jugadores nuevos. Todo lo que se diga del sonido y la sensación sale del código, de las capturas y de lo que se pueda medir. Dilo cuando sea el caso.

## Material

- **Capturas estándar (teléfono 390×844):** `/tmp/claude-0/-home-user-WHITEDOT/27177074-c2b6-540f-a145-69c40272f1e8/scratchpad/panel10/capturas/` — entrada, cinco capítulos, seis lugares, anillo, hoja Lugares, Tu canción, chispa salvaje, menú, guía de Jardín, libro, resultado, favoritos. `manifest.json` describe cada una.
- **Capturas de menús:** `…/panel10/menus/`. Nombre `TAMAÑO-MODO-HOJA.png`: tamaño `tel` (390×844), `hor` (844×390) o `esc` (1280×800); modo `viaje` (por defecto tras el Viaje, oculta parte del menú) o `libre` (vista completa); hojas: menu, menu-mas, ajustes, sonido, tu-cubo, lugares, mapa, bitacora, guia, cuenta, refugio, grabar, semillas. Algunas hojas no se abrieron en modo `viaje` porque su botón está oculto; eso también es un dato.
- **Modelo de dos horas:** `node scripts/play-curve.mjs` (modelo de jugadores simulados, no personas).
- **Código:** `src/` (módulos ES), `index.html`, `styles/estilo-j.css`. Menú en `index.html` (`#mMenu`, «Más» = `#menuMore`), lógica en `src/ui.js`, `src/journey-mode.js` y vecinos.

## Qué NO leer (memoria borrada)

No abras: `docs/panel/**`, `docs/PANEL.md`, `CAMBIOS.md`, `HANDOFF*.md`, `docs/ENTREGA_*.md`, `docs/CIERRE_K.md`, `docs/PULIDO_CIERRE.md`, `docs/INTEGRACION_ALPHA_200.md`, `docs/LIMPIEZA_REPOSITORIO.md`, `docs/aceptacion-e.json`, ni el historial de Git. Si una guía menciona sesiones o notas anteriores del panel, ignóralo.

## Reglas para no estorbar

- **No abras navegadores** (otros once revisores trabajan a la vez). Usa las capturas con la herramienta de lectura de imágenes. Puedes ejecutar Node ligero (`node scripts/play-curve.mjs`, `node -e …`).
- No cambies ningún archivo del repositorio. Escribe solo tu análisis.
