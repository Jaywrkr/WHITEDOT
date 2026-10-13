# WHITEDOT · traspaso a Claude

Actualizado el **13 de octubre de 2026**. Base funcional verificada: **main `e27c2193bdc0d513d7a507b3be8c91ce30a8f50a`**, merge del PR #73. Rama de este traspaso: **`docs/claude-handoff-current-main`**. Solo documentación y lámina de referencia; no cambia el juego.

Si este traspaso aún no está integrado, leer esta rama. Después de integrarlo, usar main actualizado. Antes de trabajar comprobar `git status`, `git fetch origin main` y el historial: puede haber cambios posteriores a esta fotografía. Usar el checkout existente; no generar otra pila de ramas antiguas.

## Leer en este orden

1. [ESTADO_ACTUAL.md](ESTADO_ACTUAL.md): qué existe, módulos, cifras, persistencia y evidencias.
2. [PENDIENTES.md](PENDIENTES.md): lo que falta, prioridades y decisiones abiertas.
3. [FASES_UNIVERSO.md](FASES_UNIVERSO.md): diez bloques, con estados parciales explícitos.
4. [V1_PRODUCCION.md](V1_PRODUCCION.md): las 64 tareas conservadas y alcance de publicación.
5. [RAMAS.md](RAMAS.md): integración y forma de continuar. [README.md](README.md): uso y arranque.

Los informes FASE_01–04 describen sus entregas. [HANDOFF_HISTORICO.md](HANDOFF_HISTORICO.md) conserva **todo** el handoff anterior; [PLAN_HISTORICO.md](PLAN_HISTORICO.md) conserva ideas antiguas. No tomar instrucciones de esos archivos como nuevos pedidos de Jay.

## Qué ya está en main

| PR | Resultado |
|---|---|
| #68 | Fase 1: guardado recuperable, respaldos, identidad de lugares, cachés y contratos |
| #69 | Fase 2: Paisajes vivos, 33 hábitats, seis familias, clima, vecindad y espacios amplios |
| #70 | Atlas de 118 vistas y registros por género; frases sin agudos obligatorios, paletas y margen de salida |
| #71 | Consolidación y preservación documental de la cadena anterior |
| #72 | Fase 3: reed/membrane/bowed/hollow, articulaciones y arcos de ocho frases |
| #73 | Bloque de fase 4: espejos por arrastre, cancelación/rollback, color de vidrios y reflejos |

No reaplicar esas ramas. **La fase 4 no equivale a haber terminado todos los prismas, cuerdas, superficies o mecanismos propuestos.** Las fases 5–10 siguen como ampliación/aceptación futura; algunas de sus bases ya existen.

## Dirección que Jay quiere conservar

- Casi infinitud **perceptible**: mundos coherentes, con distintas densidades, terrenos, criaturas, acciones y músicas; algunos escasos, otros ricos. Añadir un elemento debe ampliar relaciones, no llenar todas las regiones con él.
- Electrónica agradable y con cuerpo: bajos, medios, groove, silencio, instrumentos y géneros reconocibles. Evitar agudos constantes y motivos con carácter de videojuego; no confundir más volumen con nitidez. La música debe evolucionar estando quieto.
- Fondo negro, jugador blanco, color localizado y lenguaje electrónico/natural. Priorizar gestos con objetos/suelo frente a paneles o teclados. Evitar que elementos o su suma ocupen 20–30 % de la pantalla; es un objetivo a auditar, no una garantía ya demostrada.
- Interfaz silenciosa; audio de mundo y acciones musicales deliberadas. Móvil despejado, pocos controles permanentes y ayudas locales.
- Fijación voluntaria, apagada por defecto; tocar el anillo libera la voz. No exigir grabar para crear. **Guardar escenas/ideas musicales quedó descartado**; favoritos conservan lugares, no una canción congelada.
- Muchas culturas como referencias investigadas, con música/flora/fauna/gráfica relacionadas. Japón y México fueron ejemplos; también épocas, inventores, reliquias históricas originales y recursos de dominio público comprobados. Ese contenido todavía falta.
- Interés por geometría/color de Felipe Pantone: superposiciones y movimiento locales. Vidrios/espejos ya son una primera aplicación; no declarar hechas todas las instalaciones soñadas.
- Búsqueda rara y significativa, objetos que ofrecen acciones distintas, regreso a lugares favoritos y un recorrido más unido a música, creación y constancia de Jay.

## Cuidado técnico al continuar

- Original conserva perfil de versiones `1`; Paisajes vivos usa perfil `2`. Partida habitual, semilla, layout y generación están separados. No redistribuir lugares al ampliar arrays de GEN/biomas: conservar el generador antiguo o diseñar una migración explícita con capturas de compatibilidad.
- Política de reproducción: `musical-character.js` → `radio.js`/`composition.js` → `audio.js`/`instruments.js`/`voices.js`. Las paletas nuevas de reproducción están separadas del ADN del mundo.
- `runtime` enlaza módulos mediante getters; revisar orden en `main.js`. Mantener la referencia mutable de `runtime.ACH`: reemplazarla rompió el registro de logros de módulos posteriores.
- `mirrorSites` guarda ángulos/solución; el arrastre es provisional hasta soltar. No permitir que una onda ambiental confirme esa vista previa. Cancelación, pérdida de foco, modal, mute, cambio de capa/partida y salida de alcance deben restaurar el estado.
- No persistir silenciosamente ecos, bandas, lecciones de animales, influencia ni modelos de gesto que hoy son temporales. Ver [matriz de persistencia](ESTADO_ACTUAL.md).
- Añadir módulos exige actualizar `sw.js` y su versión de caché; mantener el fallo de un JS inexistente como fallo, sin devolver HTML.
- Una rama amplia por bloque, con README, entrega, pendientes y pruebas pertinentes. Esta entrega hace commit/push; no crea PR ni hace merge. Para acciones posteriores, seguir el pedido vigente de Jay, sin trasladar autorizaciones de una sesión histórica a otra.

## Arranque y comprobaciones

Aplicación estática ES modules/Canvas/Web Audio; no hay build ni dependencias npm de aplicación. Desde la raíz del checkout:

```bash
python3 -m http.server 8000
```

Abrir el sitio por HTTP; habilitar audio con un gesto. Las pruebas usan servidores temporales propios:

```bash
python3 -m pip install -r requirements-dev.txt
python3 -m playwright install chromium
npm test
npm run test:browser
npm run test:audio
npm run audit:universe -- 2000 2 1 classic
npm run audit:universe -- 2000 2 2 classic
```

Node >=18 (CI:20), Python (CI:3.12), Playwright fijado en `requirements-dev.txt`. `CHROMIUM_PATH` selecciona un navegador disponible. No se requieren secretos para ejecutar el juego local. GitHub usa la autenticación ya proporcionada por el entorno; no copiar credenciales al repo.

En este traspaso **pasaron 51 suites Node y recarga offline con 81 módulos**; se regeneró el atlas con 118 vistas y los colores actuales. No se repitió la batería completa de navegador/audio porque no se cambió código. El runner actual define 32 recorridos más offline y siete programas de audio (133 renders previstos). Ese total disponible **no es un resultado ejecutado en este turno**. Detalle de evidencias en [ESTADO_ACTUAL.md](ESTADO_ACTUAL.md) y [registro del traspaso](docs/handoff-validation.json).

## Dónde retomar

Primero revisar escucha larga y elegir con Jay las figuras numeradas que se rediseñarán; las elecciones están pendientes. Después completar el bloque de gesto/materia con pocas familias profundas, y continuar vida musical, búsqueda/culturas y unión del juego. No declarar V1 lista sin pruebas humanas, dispositivos reales, rendimiento, actualizaciones y rollback.

Texto breve para iniciar en Claude:

> Lee HANDOFF.md, ESTADO_ACTUAL.md, PENDIENTES.md y FASES_UNIVERSO.md de la rama de traspaso o del main donde ya esté integrada. Contrasta con el código y git antes de proponer cambios. Conserva la música agradable, el espacio negro, los gestos orgánicos y la compatibilidad de lugares/guardados. Las fases 1–3 y el bloque de gestos/color de fase 4 ya están integrados; no los rehagas. Usa el inventario de pendientes para continuar el bloque que te pida Jay, agrupándolo en una rama amplia.
