# Cuaderno vivo · veinte mejoras autorizadas

Cada rama parte de la anterior; Jay crea PR y merge. Base: 5ab5952. Música de fondo preservada. La propuesta integral de siete fases sigue pendiente de decisión.

| # | Mejora | Rama | Estado |
|---|---|---|---|
| 1 | Cubo elástico al arrancar | feat/wow-01-cubo | Implementada; ver informe 01 |
| 2 | Tres partículas al frenar | feat/wow-02-frenada | Implementada; ver informe 02 |
| 3 | Presencia cercana | feat/wow-03-presencia | Implementada; ver informe 03 |
| 4 | Miradas hacia el cubo | feat/wow-04-miradas | Implementada; ver informe 04 |
| 5 | Saludos diferentes | feat/wow-05-saludos | Implementada; ver informe 05 |
| 6 | Compañía con espacio propio | feat/wow-06-compania | Implementada; ver informe 06 |
| 7 | Reacciones entre vecinos | feat/wow-07-reacciones | Pendiente |
| 8 | Notas visibles a tiempo | feat/wow-08-notas-visibles | Pendiente |
| 9 | Corriente en conexiones | feat/wow-09-corriente | Pendiente |
| 10 | Constelaciones temporales | feat/wow-10-constelaciones | Pendiente |
| 11 | Huellas de pulso | feat/wow-11-huellas-pulso | Pendiente |
| 12 | Polvo localizado | feat/wow-12-polvo | Pendiente |
| 13 | Cometas variados | feat/wow-13-cometas | Pendiente |
| 14 | Galaxias que respiran | feat/wow-14-galaxias | Pendiente |
| 15 | Anticipación de hallazgos | feat/wow-15-hallazgos | Pendiente |
| 16 | Profundidad en tarjetas | feat/wow-16-profundidad | Pendiente |
| 17 | Barrido de adquisición | feat/wow-17-adquisicion | Pendiente |
| 18 | Álbum con foco | feat/wow-18-album | Pendiente |
| 19 | Firma de favoritos | feat/wow-19-favoritos | Pendiente |
| 20 | Constelación de regreso | feat/wow-20-regresos | Pendiente |

## Verificación

Pruebas enfocadas por entrega; informes scripts/wow-NN-validation.json. Cierre con lógica completa y navegador/audio cuando los recursos lo permitan. No integrar con comprobaciones pendientes. El entorno heredó agotamiento de procesos/hilos: distinguir implementado, comprobado y subido.

## Pendiente externo

Escucha en teléfono, suites de navegador/audio y deploy. La evaluación Perplexity/Gemini permanece en PROPUESTA_PULIDO_EXPERIENCIA.md; no se implementa por esta autorización.

### 1. Cubo elástico al arrancar

El cubo se estira brevemente al arrancar según la dirección real. Superficie y cuerpo comparten pose; sin alterar tamaño físico. Saltos, menús y movimiento reducido restablecen la pose.

### 2. Tres partículas al frenar

Al detenerte quedan tres motas blancas durante 600 ms. Máximo seis; desaparecen al abrir paneles o reducir movimiento. No añaden sonido ni distancia.

### 3. Presencia cercana

Los habitantes y especies se inclinan y abren ligeramente al acercarte. Un arco tenue muestra atención en hasta doce fuentes reales; no aparecen objetos nuevos ni sonidos.

### 4. Miradas hacia el cubo

Los habitantes pixelados y la fauna pixel original miran hacia el cubo cercano. Pupilas de desplazamiento acotado, sin modificar figuras guardadas. Movimiento reducido conserva la mirada fija.

### 5. Saludos diferentes

Tres saludos individuales: reverencia, giro corto o salto. Se activan al entrar en cercanía, con separación de ocho segundos y salida real antes de repetirse. Sin carteles ni sonidos añadidos.

### 6. Compañía con espacio propio

Caminantes y especies que ya te seguían ocupan posiciones distintas, con cuatro distancias y deriva lenta. Conservan sus temporizadores, voces y velocidad; no se crean seguidores artificiales.
