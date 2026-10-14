# WHITEDOT · Cierre V1

14 de octubre de 2026 · base `main 704ae07` (V1 RC6). Dos partes: **1. Estilo J** y **2. Auditoría y plan de cierre**. Este documento reemplaza a las listas anteriores de pendientes de V1. Lo que no está aquí pasa a V2.

---

## 1. Estilo J

### De dónde sale

Las fuentes son tus notas: los 100 mandamientos, los posts `#simple` y el formato de reels/frases. Lo que no tengo es la conversación donde definimos el diseño de los posts diarios: colores, tipografía y plantillas exactas. **Antes de aplicar, pásame 3–5 posts publicados o la guía de esa conversación** para calibrar los valores. Los principios de abajo no cambian con eso. Los números (color y tamaños) sí pueden cambiar.

| Principio J | Origen | Qué significa en el juego |
|---|---|---|
| Simple. | Firma de tus posts | Cada pantalla tiene una idea. Si necesita explicación larga, se rediseña. |
| Menos, pero mejor. | Mandamiento 92 | Se quitan elementos antes de añadir otros. |
| El espacio vacío también comunica. | Mandamiento 93 | El negro es el protagonista. La UI no tapa el mundo. |
| Frase corta, golpe directo | jay-frases: máx. 12 palabras | Todo texto del juego cabe en una línea de móvil. |
| Se entiende en segundos, sin audio | jay-reels | Las señales son visuales: forma, posición y blanco o negro. |
| ~~Esto~~ → Esto otro | Posts INSTAETIQUETAR | El tachado-corrección es un recurso gráfico propio de la marca. |
| Juega: música, batería, arte. | Mandamiento 99 | El tono es de juego, no de herramienta técnica. |

### Diagnóstico: dónde no suena a J hoy

La esencia ya es J: vacío negro, un pixel blanco y música. Donde se pierde es en la capa de interfaz, que hoy parece una app oscura genérica:

1. **HUD saturado de datos técnicos.** Al empezar se ven *Día · Era · versión · "deploy sin registrar" · Elementos 0/81 · Racha · ★ · barra · "Recoge luz 0/120" · "Toca en el beat"*: unos diez datos antes de jugar.
2. **El menú es un panel de control.** Tiene 18 acciones en 4 grupos, con estados del tipo "Fijar sonidos: no" o "Modo: explorar", y además "Prototipo" visible.
3. **Textos de ingeniería.** Aparecen "Intensidad musical", "Gravedad norm…", "Progreso y respaldo" y "deploy". J habla directo y humano.
4. **Mucho dorado.** `--gold` se usa 49 veces en CSS: títulos de grupo, números, foco y selección. Si todo es dorado, nada destaca.
5. **Las curvas son de app, no de pixel.** Hay 29 `border-radius`, con 16 px en las hojas y 24 px en los botones. El mundo es pixel y cuadrado; la UI, redondeada.
6. **Silkscreen apenas se usa.** La fuente pixel con más personalidad sale solo en "DÍA 1". Todo lo demás es JetBrains Mono a 10–12 px.

### Sistema visual J (propuesta)

**Color.** Se usan tres valores y un acento:
- `#000` como mundo y fondo de todas las hojas, sin el gris `#090b0d`.
- `#fff` para texto principal y estado activo.
- `#ffffff66` para texto secundario. Un solo gris, no tres.
- **Acento único: dorado `#f0d27a`**, reservado para *lo ganado*: luz de hoy completada, hallazgo raro y color desbloqueado. No se usa en títulos de sección, en foco ni en botones normales. Así un destello dorado significa algo.

**Forma.** Se usan esquinas rectas (`border-radius: 0`) en hojas, botones y avisos, con borde de 1 px blanco al 15 %. La única excepción es el cubo, que define todo. Un elemento activo se invierte a blanco con texto negro, como un pixel encendido.

**Tipografía, en dos niveles:**
- **Silkscreen para el "hook":** título de hoja, frase del día, nombre de zona, hallazgo y cierre. De 24 a 40 px, en mayúsculas cortas.
- **JetBrains Mono para todo lo demás,** con un mínimo de 13 px y sin espaciado ancho ni mayúsculas largas.
- Regla: **una frase grande por pantalla.**

**Firma.** Al cerrar un momento importante (día completado, hallazgo o set grabado) aparece una línea final con **"Simple."**, igual que cierras tus posts. Sale con moderación, no en cada aviso.

**Tachado-corrección.** La Voz usa tu recurso de posts en momentos clave. Ejemplos:
- ~~Recoge 120 luces~~ **Escucha. Toca. Vuelve mañana.**
- ~~Perdiste la racha~~ **Hoy empiezas otra.**
- ~~Más objetos~~ **Menos, pero mejor.** (al retirar capas)

### Cambios concretos por pantalla

| Pantalla | Hoy | Estilo J |
|---|---|---|
| **HUD Camino** | ~10 datos arriba | `DÍA 1` a la izquierda y barra de luz fina. Nada más. Racha, estrellas y elementos pasan a Bitácora. Versión y deploy van al pie del menú. |
| **HUD Mundo** | Lugar · gravedad · hora · versión · elementos · aviso de recorrido | Solo el nombre del lugar en Silkscreen, que se desvanece a los 4 s. El aviso de recorrido pasa a una línea, sin caja. |
| **Bienvenida** | Hoja con 4 pasos numerados | Tres pantallas con una frase cada una: **ARRASTRA.** / **TOCA.** / **VUELVE MAÑANA.**, con el gesto animado detrás. Cierre: *Simple.* |
| **Menú** | 18 acciones en 4 grupos | **Seis entradas grandes:** Camino · Mundo · Estudio · Bitácora · Tu cubo · Ajustes. Herramientas, intensidad, escucha suave, fijar y grabar quedan dentro de Estudio/Herramientas. Progreso, respaldo, detalles y compartir van a Ajustes. Prototipo sale en producción. |
| **Cierre del día** | Tabla de métricas | Una frase grande (**DÍA 7. CRECISTE.**), un número y un botón. |
| **Tarjeta de hallazgo** | Tarjeta con nombre, rareza, lugar y probabilidad | Ilustración grande en negro, nombre en Silkscreen y rareza en dorado. El resto va en "ver más". |
| **Voz** | Etiqueta "Sistema" y mensaje largo | Sin etiqueta. Máximo 12 palabras. Tachado-corrección en los momentos clave. |
| **Compartir / Grabar set** | Formulario funcional | La salida es **un post J**: video o imagen 4:5 en negro, el cubo, el nombre del lugar en Silkscreen y la firma `WHITEDOT · @jaywrkr`. Esto convierte el juego en contenido para tu cuenta. |

### Reglas de texto (aplicar el editor J a todo el juego)

- Máximo 12 palabras por mensaje y una idea por mensaje.
- Verbos en imperativo y en segunda persona: *Toca. Escucha. Quita.*
- Sin jerga: "deploy", "intensidad musical", "respaldo", "modo", "fijar sonidos: no".
- Renombres propuestos: *Intensidad musical* → **Energía** · *Escucha suave* → **Calma** · *Fijar sonidos* → **Repetir** · *Progreso y respaldo* → **Guardar copia** · *Mostrar detalles* → **Más info**.
- Sin burlas por fallar un día (ya estaba en `DIRECCION_JUEGO.md`). El tono es directo, no duro.

### Qué no se toca (la esencia)

El fondo negro, el pixel/cubo blanco y su crecimiento, el mundo dibujado en Canvas, la música, el silencio de la UI (sin sonidos de menú), los colores ganados, las coordenadas, los guardados y el catálogo (11 biomas, 33 hábitats, 52 géneros, 81 familias, 18 tarjetas). **El rediseño es de la capa de interfaz y el texto, no de la generación ni del audio.**

---

## 2. Auditoría de cierre

### Dictamen

**El juego está funcionalmente completo para una V1.** Tiene Camino, Mundo, Estudio, criaturas, culturas, hallazgos, mascota, cubo, efectos, PWA offline y guardado local. Hoy pasan **59 suites de lógica** y la auditoría de release; `npm test` y `npm run audit:release` se volvieron a ejecutar en esta revisión.

**Lo que falta no es contenido. Falta terminar:** publicarlo, probarlo con personas y teléfonos reales y dejar de añadir. El riesgo principal del proyecto es la expansión continua. En 107 commits hubo 6 RC, y cada "cierre" se reabrió con funciones nuevas. Hay 37 documentos `.md` (570 KB) que repiten el mismo estado. **La V1 se cierra congelando el alcance.**

### Hallazgos

Prioridad: **B** = bloquea publicar · **A** = necesario para 1.0 · **C** = conveniente, no bloquea.

| # | Hallazgo | Evidencia | P |
|---|---|---|---|
| 1 | No hay URL pública HTTPS | El HUD muestra "deploy sin registrar"; no hay host elegido | **B** |
| 2 | No se ha probado en un iPhone ni un Android reales | A01/A02 pendientes desde RC1 | **B** |
| 3 | No ha jugado una persona nueva sin instrucciones | A03 pendiente desde RC1 | **B** |
| 4 | El CI en GitHub nunca se confirmó en verde | Consultas devolvieron 403; existe `checks.yml` | **B** |
| 5 | La UI no tiene identidad J (parte 1) | Diagnóstico arriba | **A** |
| 6 | "Prototipo" y herramientas de desarrollo visibles en producción | `index.html:113` `devbox` | **A** |
| 7 | Una caja rara puede dar mascota permanente, en contra de tu regla de "beneficios de caja temporales" | `UNIVERSO_50_IDEAS.md`, "Regla prioritaria" | **A** |
| 8 | La licencia del código no está definida | `CREDITOS.md`: "no asigna licencia al código"; no hay `LICENSE` | **A** |
| 9 | La versión sigue en RC | `package.json 1.0.0-rc.6`, `<title>` "V1 RC6" | **A** |
| 10 | Documentación inmanejable | 37 `.md`; README de 54 KB con cuatro RC apilados; ESTADO/HANDOFF/PENDIENTES comparten encabezados duplicados | **A** |
| 11 | Sin vista previa al compartir el enlace | 0 etiquetas `og:` en `index.html` | **A** |
| 12 | No hay página de privacidad ni de contacto | Guardado solo local, pero no está explicado al jugador | **C** |
| 13 | El Canvas no es accesible con lector de pantalla | Ya documentado; los menús sí son accesibles | **C**, V2 |
| 14 | El historial de guardado no se compacta en partidas muy largas | `HANDOFF.md` | **C**, vigilar en la prueba real |

### Tres decisiones tuyas antes de empezar

1. **Host:** recomiendo **Vercel** (ya tienes el conector, es estático y no necesita build) o GitHub Pages. Con cualquiera de los dos, `scripts/stamp-deploy.mjs` registra la fecha real.
2. **Licencia del código:** "Todos los derechos reservados" (recomendado si WHITEDOT es marca personal) o MIT.
3. **Hallazgo 7 (mascota de caja):** recomiendo aplicarlo en V1. Es pequeño y coherente con tu regla: la caja rara da una *visita* temporal y el vínculo permanente se gana jugando. No se borra ninguna mascota ya ganada.

### Plan de cierre

Una rama `release/v1.0.0` con un PR por bloque, en orden. **Regla del cierre: solo entra lo que está en esta tabla. Toda idea nueva va a `PLAN_V2.md`.**

| Bloque | Qué | Hecho cuando… | Estimado |
|---|---|---|---|
| **0. Congelar** | Rama `release/v1.0.0`, tres decisiones, 3–5 posts tuyos de referencia | Decisiones escritas en este documento | ½ día |
| **1. Estilo J: base** | Tokens (color, forma, tipografía), nuevo HUD, menú de seis entradas, Prototipo fuera de producción (#5, #6) | Capturas a 390×844 y 1280×800 aprobadas por ti; 45 recorridos de navegador en verde con IDs actualizados | 2 días |
| **2. Estilo J: voz** | Reescribir todos los textos con las reglas J, nueva bienvenida, cierre de día, Voz con tachado, firma *Simple.* | Ningún texto supera 12 palabras salvo la Bitácora; revisado por ti en una lista única | 1–2 días |
| **3. Cierre funcional** | Mascota de caja temporal (#7), `LICENSE` (#8), `og:` e imagen de compartir J (#11), salida de Grabar set como post 4:5 | Pruebas de cajas/mascota nuevas en verde; enlace con vista previa en WhatsApp/IG | 1 día |
| **4. Publicación técnica** | Host HTTPS, `stamp-deploy`, CI de GitHub en verde en `main` (#1, #4) | URL pública abre offline tras la primera visita; badge con fecha real; check verde visible | ½ día |
| **5. Aceptación real** | iPhone y Android: 30 min con audífonos y altavoz, instalar PWA, suspender y volver, grabar set. **Tres personas nuevas** juegan 10 min sin explicación (#2, #3) | Lista de fallos; se corrigen **solo los que bloquean** jugar, oír o guardar | 3 días |
| **6. Release** | Versión `1.0.0`, tag, release notes, consolidar docs (#9, #10) | README de una página; histórico en `docs/historial/`; `CAMBIOS.md` con la entrada 1.0.0 | 1 día |
| **7. Lanzamiento** | Contenido para @jaywrkr: un reel (hook "Un pixel blanco. Un mundo que suena.") y un carrusel con capturas J | Publicado con el enlace | ½ día |

**Total: unos 10 días de trabajo**, de los cuales 3 son de prueba con personas y teléfonos, que no se pueden saltar.

### Documentación final propuesta (bloque 6)

```
README.md          → qué es, cómo jugar, cómo correrlo, enlace público (1 página)
CAMBIOS.md         → changelog, empezando por 1.0.0
CREDITOS.md        → fuentes, licencias, autor
CIERRE_V1.md       → este documento (decisiones y aceptación)
PLAN_V2.md         → todo lo que no entra (incluye las 50 ideas)
docs/historial/    → FASE_*, REVISION_*, HANDOFF_HISTORICO, PLAN_HISTORICO, RAMAS, etc.
```

### Definición de "V1 terminada"

- [ ] URL pública HTTPS con fecha de deploy real
- [ ] CI verde en `main`
- [ ] UI con estilo J aprobada por Jay en móvil y escritorio
- [ ] Probado en iPhone y Android reales, sin fallos bloqueantes
- [ ] Tres personas nuevas entendieron arrastrar, tocar y volver sin ayuda
- [ ] `v1.0.0` etiquetada, README de una página, licencia definida
- [ ] Publicado en @jaywrkr

### Fuera de V1 (ya documentado, va a V2)

Las 50 propuestas de `UNIVERSO_50_IDEAS.md` (salvo la #1 parcial: la mascota de caja), multijugador y duetos, cuentas y sincronización, mixer, más géneros y biomas, accesibilidad del Canvas y compactación del historial.

> Termina más cosas de las que empiezas. Simple.
