# Traspaso para el siguiente agente

**24 de octubre de 2026 · código 2.3.0-alpha.173 en `main`.** Vale para Codex, ChatGPT, Claude o cualquier otro agente. Lee antes [AGENTS.md](AGENTS.md).

## Qué pide Jay ahora

1. **Una cuarta sesión del panel creativo**, hecha igual que las tres anteriores. Todo está en [docs/PANEL.md](docs/PANEL.md): quiénes son, cómo se puntúa, los pasos, el formato, el historial de notas, lo que ya decidió y la petición lista para copiar.
2. **El cubo, pequeño.** A Jay no le gusta grande. La I2 lo agrandó a 24–36 px y hay que volver a un cubo pequeño (`src/render.js:188`, aplicado en `src/render.js:111`). El panel no debe pedir que crezca otra vez.

No se cambia el código del juego por la auditoría hasta que Jay apruebe su plan.

## Qué es Kubono hoy

- Juego musical para teléfono, web y escritorio. Eres un cubo; **tocar a tiempo** es el único verbo. Nunca suena mal; solo a tiempo cuenta.
- **El Viaje** (Camino + Llanura, Lago, Bosque, Tormenta y Vacío, ~15–20 min) termina en el **Refugio**, que toca **tu canción**. Después se abre el **Mundo libre**: un anillo de **11 lugares** que se abren en orden, cada uno con ★ (completar), ★★ (75 % a tiempo) y ★★★ (Maestro, 70 %). Se gana con los once; las 33 ★ son la versión maestra.
- Cada ★ suma una capa de su lugar a la música del mundo. Chispas solo por tocar a tiempo; con ellas se compran piezas del cubo.
- Diseño: [El mundo](docs/MUNDO.md) y [El Viaje](docs/VIAJE.md). Código: [Arquitectura](docs/ARQUITECTURA.md).

## Lo último que se hizo

El panel (tercera sesión, media 7,5) pidió el plan **I1–I6** y se integró completo en `main` con la CI en verde (PR #346–#351):

- I1 narrador solo en la tarjeta y la Bitácora; fuera los «Rompe…».
- I2 cubo de 24–36 px (Jay lo rechaza: ver arriba), color del bioma en toda la pantalla y columna dorada del siguiente portal visible desde lejos.
- I3 luz, vibración y golpe del cubo cuando suena la nota; la Línea anticipa.
- I4 el final usa tus notas de los 11 lugares, en tu ritmo y en la escala; el chelo toca el tema dos veces.
- I5 ★★ al 75 %, ★★★ al 70 %; `?festival=1` es el Viaje entero.
- I6 menú de seis entradas y «Más»; modelo de dos horas que no cuenta compras.

Detalle en [CAMBIOS](CAMBIOS.md).

## Lo que no se sabe

- **Nadie salvo Jay ha jugado** y nadie lo ha oído en un teléfono con auriculares. Todo lo medido sale de bots, capturas y modelos.
- Según el modelo, el jugador del 60 % y el que juega sin sonido no ganan ★★ y su canción deja de crecer al ganar (hacia el minuto 38–40). Está sin resolver.
- El despliegue de Vercel no se comprobó en esta revisión.

## Límites que siguen

- **Supabase en pausa**: no configurar nada de la cuenta en la nube.
- Nunca pedir ni escribir contraseñas, tokens o claves.
- El backlog de lanzamiento es [D01–D22](docs/PLAN_LANZAMIENTO.md); no se ejecuta sin petición.
- La música le gusta a Jay: no se rehace.

## Cómo comprobar

```sh
npm test                          # 240 suites de Node
node scripts/release-audit.mjs    # auditoría de publicación
CHROMIUM_PATH=/opt/pw-browsers/chromium python3 tests/menu_v2_smoke.py   # un recorrido de navegador
```

Más en [Verificación](docs/VERIFICACION.md).
