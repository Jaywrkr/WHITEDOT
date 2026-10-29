# Traspaso vigente · alpha.232

**Continuar desde `main`** (27 de octubre de 2026, tras el PR de Q7). Jay crea PR y hace merge salvo que pida otra cosa.

**Cierre del ciclo de diseño (27 de octubre de 2026).** El juego queda completo para esta etapa: E1–E7, P1–P8 y Q1–Q7 están en `main`, todos con CI completo en verde. No hay fases de diseño abiertas. La auditoría externa con Codex quedó descartada por Jay; su [guía](docs/AUDITORIA_EXTERNA.md) se conserva como método.

**Lo siguiente: publicar en web y Android**, en español e inglés, a nombre de Jay, sin cuenta ni nube (como Monument Valley, Alto's o Florence, que son la vara de calidad). Plan L1–L6 y tareas de Jay en [Salida web y Android](docs/PLAN_LANZAMIENTO.md#salida-web-y-android).

Leer [AGENTS](AGENTS.md), [README](README.md), [Arquitectura](docs/ARQUITECTURA.md) y [Verificación](docs/VERIFICACION.md). [HANDOFF_CLAUDE](HANDOFF_CLAUDE.md) solo apunta aquí.

## Qué hay en `main`

| Plan | Qué | PR | Versión |
|---|---|---|---|
| E1–E7 | Fiabilidad, interacción, interfaz, recorrido | #355 | alpha.207 |
| Sesión 10 · P1–P8 | Pantallas limpias, menús, un solo reloj, color ganado, menos contadores; D1–D6 | #357, #358 | alpha.208–215 |
| Sesión 11 · Q1–Q6 | Reglas a la vista, la Cueva cuenta el eco, Tu canción crece y se cierra, Refugio legible, golpe al oírse, día nuevo y un solo gesto; D7, D10, D11 | #359 | alpha.216–221 |
| Sesión 11 · Q7 | Los dos finales en dub techno: subida, golpe en la tónica y corte seco; el tema con sus notas; el Mundo calla bajo el final de los once; D8, D9. Jay oyó y aprobó los renders | PR de Q7 | alpha.222 |
| Lanzamiento · L1–L2 | Edición de venta sin cuenta ni red (una bandera que sella el empaquetador); el juego entero en inglés con elección en Ajustes | PR de L1–L2 | alpha.223–224 |
| Universo vivo · E1–E2 | Encuentros vivos: los once de perseguir y los once de huir, uno cada 60–90 s de viaje en el Mundo libre | #366, #367 | alpha.227–228 |
| Universo vivo · E3 | Los once de hacer: los 33 encuentros vivos completos | #368 | alpha.229 |
| Arreglos de Jay A–E | `?rapido=2` corto, salto tras los once, sin «Estilos», encuentros más claros, «Volver al anillo» | #369, #371 | alpha.230 |
| Universo · F1 | Mapa del cielo: 28 figuras que se unen en el Mundo libre | #372 | alpha.231 |

CI completo en verde en cada merge: lógica, 6 tandas de navegador y 6 de audio. Detalle en [CAMBIOS](CAMBIOS.md).

Para E3, A–E y F1 este traspaso no registra el resultado de CI; su detalle está en [CAMBIOS](CAMBIOS.md).

**En rama, sin PR (28 de octubre de 2026): arreglos de Jay G1–G3** (`jay/arreglos-g`, alpha.232, desde `main` `2b3daf3`). Tras jugar alpha.231: G1, el cierre de cada ronda sobre negro opaco, con sus ★ y un solo botón blanco que sigue; G2, sin «Paseo musical» en ninguna vista; G3, una hoja al cerrarse el final de los once («Completaste los once lugares…», con «Explorar» y el salto a otro paisaje), una vez por partida y guardada en Lugares. Detalle en [CAMBIOS](CAMBIOS.md) y [El mundo](docs/MUNDO.md). Probado en local (lógica y recorridos de navegador); sin CI remoto, sin teléfono ni personas. Jay crea el PR.

**En rama, sin PR (28 de octubre de 2026): H1 · Chispas solo en el universo** (`jay/h1-chispas`, alpha.233, desde `main` `2b3daf3`). Decisión de Jay: los niveles (capítulos, Camino, rondas de los once lugares con Maestro y remezcla) dan ★ y Tu canción, nunca ✦; dentro de un nivel el HUD no muestra ✦ y la hoja de ronda tampoco. Corrección de Jay (PR #374): sin inflación. Chispa suelta 1 ✦ (2 a tiempo, sin ×3); chispa salvaje 15; encuentros, figuras, actividades y travesuras pagan por una regla única, base × dificultad × distancia × rareza. La tienda tarda bastante más (unas 21 h casual y 17 h a tiempo frente a 6,9 y 5,2): precios sin tocar, a decisión de Jay. Sin migración: nadie pierde chispas ni compras. [Economía antes y después](docs/HALLAZGOS_Y_ACTIVIDADES.md#chispas-solo-en-el-universo). Ramas en paralelo: `jay/arreglos-g` (alpha.232) y `jay/h2-refugio`. Probado en local (lógica y recorridos de navegador); sin CI remoto, sin teléfono ni personas. Jay crea el PR.

**En rama, sin PR (29 de octubre de 2026): Mapa del universo** (`jay/mapa-universo`, alpha.235, desde `main` `e5d48fe`, alpha.233; en paralelo `jay/h2-refugio`, alpha.234). Jay: «el mapa tiene que ser perfecto». Pantalla propia desde el dock del Mundo y desde la Bitácora; tres acercamientos (Anillo, Región, Universo) con pellizco, botones y rueda; niebla con el color de cada bioma; anillos de 5, 20 y 50 km con el porcentaje descubierto; tu rumbo, la línea al siguiente lugar, lo tuyo (lugares, Refugio, favoritos, hitos y rumores, figuras del Mapa del cielo, encuentros vivos); tarjeta con «Ir» donde ya se podía ir y «Marcar» en lo demás (una marca, que sigue la brújula); mini-mapa opcional, apagado por defecto. Guardado nuevo `S.universeMap`. Detalle en [El mundo](docs/MUNDO.md#mapa-del-universo) y [CAMBIOS](CAMBIOS.md). Probado en local (lógica y recorridos de navegador); sin CI remoto, sin teléfono ni personas. Jay crea el PR.

**En rama, sin PR (29 de octubre de 2026): Ritmo** (`jay/ritmo`, alpha.237, desde `main` `05b42e4`, alpha.235; en paralelo `jay/volver`, alpha.236, que se mezcla antes). Cuatro modos dentro de los once lugares, con ★ y Tu canción y nunca chispas: **Eco** (un lugar completo de memoria: canta su frase y luego la Línea y el aro no dibujan sus pasos; desde Lugares, el portal y la hoja), **Duelo final** (secreto hasta los once, su final y su nota; en el centro del anillo, los once ritmos en llamada y respuesta; su ★ propia, la Corona de los once y la Bitácora), **Fantasma** (tu mejor camino por lugar en muestras espaciadas, un contorno tenue corre contigo) y **Combo** (estela desde 8 aciertos seguidos; un fallo la apaga suave). Guardado nuevo `S.ritmo`. Detalle en [El mundo](docs/MUNDO.md#ritmo) y [CAMBIOS](CAMBIOS.md). Probado en local (lógica y recorridos de navegador); sin CI remoto, sin teléfono ni personas. Jay crea el PR.

**En rama, sin PR (29 de octubre de 2026): Descubrir** (`jay/descubrir`, alpha.240, desde `jay/ritmo` `14f6627`, alpha.237, PR #378 abierto: dependencia explícita; en paralelo `jay/con-luca`, alpha.239). **Rumores:** completar algo en el universo abierto trae a veces «Dicen que al sureste, a 40 km, canta una ballena.», siempre hacia algo real (figura del cielo, rareza, hito, sonido raro o bioma; lo raro lejos), tres abiertos como mucho, «?» blanco en el Mapa del universo con «Marcar», en la Bitácora con «Soltar», cumplido al llegar; sin chispas. **Álbum de sonidos:** cinco sonidos raros por bioma (55) con `hashKey`, que cantan suave en los compases y se recogen pasando o con un pulso a tiempo (`universeReward`: 8 ✦ nuevo, 1 repetido); la serie completa enciende su arco del Aro de sonidos (dorado, en Tu cubo); tu mezcla de hasta cuatro suena encima de la música mientras el álbum está abierto. Guardados nuevos `S.rumors` y `S.soundAlbum`. La música del Mundo queda idéntica en render; las capas, 28 dB por debajo. [El mundo](docs/MUNDO.md#descubrir), [CAMBIOS](CAMBIOS.md). Probado en local (lógica, recorridos de navegador y render); sin CI remoto, sin teléfono ni personas. Jay crea el PR.

**En `main` (29 de octubre de 2026, PR #375): H2 · Refugio simple** (`jay/h2-refugio`, alpha.234, desde `main` `2b3daf3`; en paralelo `jay/arreglos-g` alpha.232 y `jay/h1-chispas` alpha.233). Jay se agobiaba en el Refugio: ahora es para mirar y escuchar. Una sola pantalla con todas las salas; lo ganado se coloca solo (`house-auto.js`) y lo puesto a mano se respeta; un punto en el menú y «1 nuevo» solo si hay algo nuevo; tres botones (Escuchar, Colocar, Salir); Taller, Prisma, Código, Lugares y Jardín de voces bajo «Más»; el Jardín se llena con las cuatro voces más oídas. Migración de casas v1/v2 sin perder nada. [Casa viva](docs/CASA_VIVA.md), [CAMBIOS](CAMBIOS.md). Probado en local (lógica, recorridos de navegador y render de la casa); sin CI remoto, sin teléfono ni personas. Jay crea el PR.

**En rama, sin PR (29 de octubre de 2026): Ganas de volver** (`jay/volver`, alpha.236, desde `main` `05b42e4`, alpha.235; en paralelo `jay/ritmo`, alpha.237). Racha suave: cada día jugado enciende una estrella blanca en el cielo del Refugio, los días seguidos se unen con un hilo y faltar no quita nada; hitos en la Bitácora; sin chispas. Carta del universo: tras cuatro horas fuera, un aviso pequeño con algo que pasó («Una ola gigante pasó por el Lago»), de los encuentros vivos y las figuras del cielo, con `hashKey` del día, una por apertura, cerrable con un toque, nunca en el Viaje ni en un nivel. Guardados nuevos `S.skyStreak` y `S.universeLetter`. [El mundo](docs/MUNDO.md#ganas-de-volver), [Casa viva](docs/CASA_VIVA.md#cielo-de-días), [CAMBIOS](CAMBIOS.md). Probado en local (lógica y recorridos de navegador); sin CI remoto, sin teléfono ni personas. Jay crea el PR.

## Qué falta

1. **Lanzamiento L3–L6** ([plan](docs/PLAN_LANZAMIENTO.md#salida-web-y-android)): Android de tienda, escritorio en itch.io (descarga Electron; la web no se publica abierta), fichas y privacidad, prueba cerrada. L1 (sin nube) y L2 (inglés) están hechas; el inglés no lo ha revisado ninguna persona nativa. Cada alta, pago y publicación los hace o autoriza Jay.
2. **Teléfono y personas:** Jay y Luca prueban el juego (27 de octubre en curso). Mirar los dos finales dentro del juego con altavoz y auriculares, el toque, la luz con el retraso real del audio, el Refugio y volver al día siguiente. [Protocolo](docs/PRUEBAS_CON_PERSONAS.md); el [registro](docs/aceptacion-e.json) sigue sin participantes.
3. **Ramas viejas** en GitHub: borrarlas a mano (la sesión no tiene permiso). Todas están integradas en `main`.

## Cómo retomar

- Desde `main`, leer este traspaso y el [plan de lanzamiento](docs/PLAN_LANZAMIENTO.md#salida-web-y-android).
- Para un cambio de juego: una rama desde `main`, `npm test`, `node scripts/release-audit.mjs`, los recorridos del sistema tocado y, si cambia el sonido, sus renders ([Verificación](docs/VERIFICACION.md)).
- Para otra revisión creativa: [Panel](docs/PANEL.md) (doce perfiles simulados) o [Auditoría externa](docs/AUDITORIA_EXTERNA.md).

## Notas del panel

| Sesión | Versión | Media | Menús | Detalle visual |
|---|---|---|---|---|
| [10](docs/panel/sesion-10/informe.md) | alpha.207 | 6,7 | 5,5 | 5,5 |
| [11](docs/panel/sesion-11/informe.md) | alpha.215 | 6,7 | 7 | 5,5 |

La 11 no se compara directa con la 10: nueve perfiles no puntuaron Audio y seis no puntuaron Sensación. Son lentes simuladas, no opiniones reales ni escucha humana. La meta es diez en cada categoría; no está acreditada.

## Límites que se mantienen

- Conservar música, síntesis, notas, armonías, mezcla, RNG, mundos, especies y cubo pequeño.
- Guardados antiguos y futuros se migran sin borrar progreso ni premios.
- El [verificador de preservación](scripts/verify-e-preservation.mjs) protege 301 archivos y trece contratos. Lo que cambiaron P3–P8 se compara con `main` tras P8 (`5464612`). Lo que cambiaron Q1–Q6 se compara con el final de Q6 y sus arreglos de CI (`4183856`). Los finales y el silencio del Mundo bajo el final de los once, con Q7 (`fce8496`). `main.js`, `messages.js` y la lista offline de `sw.js`, con el final de L2. Los siete archivos protegidos que cambiaron las notas de Jay (alpha.226: lluvia, saltos, caja, `?rapido=1`), con `702ed7a`. Los ocho que cambiaron los encuentros vivos (alpha.227, rama `universo/e1-perseguir`) y la lista offline de `sw.js`, con `8f0eabb`. Los siete que cambiaron los arreglos de Jay A–E (alpha.230), con `e937e85`. Los cuatro que cambió el Mapa del cielo (alpha.231) y la lista offline de `sw.js`, con `10c3c64`. Los dos que cambiaron los arreglos de Jay G1–G3 (alpha.232) y la lista offline de `sw.js`, con `cff4103`. Los que cambió H1 (alpha.233: rondas, chispas, cristales, actividades, travesuras y remezcla) y la lista offline de `sw.js`, con su capa `approvedH1` (el merge con alpha.232). Lo demás, con la base E. Los tres que cambió el Refugio simple (alpha.234: `house-audio.js`, `house-capsules.js`, `house-guide.js`) y la lista offline de `sw.js`, con la capa `approvedH2`. Los que cambió el Mapa del universo (alpha.235, en rama: `i18n-en.js`) y la lista offline de `sw.js`, con su capa `approvedM`. Los que cambió Ganas de volver (alpha.236, en rama: `main.js`, `i18n-en.js`) y la lista offline de `sw.js`, con su capa `approvedV`. Los que cambió Ritmo (alpha.237, en rama: `i18n-en.js`) y la lista offline de `sw.js`, con su capa `approvedR`. Los que cambió Descubrir (alpha.240, en rama: `main.js`, `render.js`) y la lista offline de `sw.js`, con su capa `approvedD`.
- UI negra, Geist Mono, esquinas rectas, menús silenciosos; dorado solo para ★ y ✦.
- Sin cuenta ni nube: Supabase queda en pausa sin plan de reactivarlo. No reaplicar SQL ni borrar cuentas. `server/` es un prototipo histórico, no un backend activo.
- Tiendas: preparación autorizada (web y Android); publicar requiere la autorización explícita de Jay en cada canal.

## Probar en el teléfono

Abrir una vista previa de Vercel sin `?dev=1`. La de Q7 es [esta](https://whitedot-git-panel11-q7-finales-jaywrkr-1498s-projects.vercel.app) (mismo contenido que `main` tras Q7).

Qué mirar: los dos finales (el del Viaje y el de los once lugares); tocar donde sea y que suene al apoyar el dedo; que la onda y el cubo coincidan con la nota; la Cueva; Lugares y el Refugio; dejar el juego y volver al día siguiente.

Atajos `?lugar=jardin`, `?anillo=1`, `?festival=1` en un perfil temporal; [lista](docs/MUNDO.md#herramientas-de-prueba). No borrar la partida personal ni contar un atajo como recorrido completo.
