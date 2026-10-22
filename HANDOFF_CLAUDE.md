# Traspaso actual para revisar Kubono

**Fecha: 22 de octubre de 2026. Código 2.3.0-alpha.127 en `main`.** Leer [AGENTS.md](AGENTS.md) y [el índice](docs/README.md). El traspaso anterior (alpha.66, cuenta obligatoria) está en [historial](docs/historial/HANDOFF_ALPHA66.md) solo como contexto.

## Petición vigente de Jay

El 22 de octubre una auditoría integral (simulada, solo lectura) produjo un plan por fases; Jay aprobó empezar por la **Fase 0 · Base protegida** y decidió:

| # | Decisión | Respuesta |
|---|---|---|
| 1 | Congelar contenido nuevo | No: se puede seguir añadiendo; nada se integra con la CI en rojo |
| 2 | Duración del Viaje | 15–20 minutos, medidos con personas antes de alargarlo |
| 3 | Demo para Steam | Se decide después de las pruebas con personas |
| 4 | Plataformas | Una primero; se elige en la preparación comercial |
| 5 | Racha | Deja de castigar; frases de disciplina fuera; datos guardados intactos |
| 6 | Mundo libre | Se cierra hasta el final del Viaje, después de arreglar el pulso |
| 7 | Pista en el Viaje | Sí, sin palabras (dedo fantasma) |
| 8 | Dueto | Retirado en la Fase 0 |
| 9 | Músico coautor | Más adelante, cuando el tema suene en el acierto |
| 10 | Identidad violeta en el repo | Cuando lleguemos a la preparación comercial |

Fases del plan: 0 base protegida → 1 pulso justo → 2 Viaje con tiempo → 3 coherencia → 4 rendimiento real → 5 profundidad (idea por idea) → 6 experiencia completa → 7 pruebas con personas → 8 preparación comercial → 9 validación. Ninguna fase empieza sin que Jay apruebe la anterior. La configuración de Supabase sigue detenida.

## Qué existe y dónde

- Repositorio `Jaywrkr/WHITEDOT`; nombre comercial **Kubono**. Identificadores internos, paquete y claves de guardado conservan WHITEDOT para no perder progreso.
- Cliente estático: módulos ES nativos, Canvas 2D y Web Audio, sin dependencias npm ni compilación. Entrada `src/main.js`; mapa en [Arquitectura](docs/ARQUITECTURA.md).
- Modo principal [El Viaje](docs/VIAJE.md); después el Mundo libre, el [universo](docs/UNIVERSO.md) con superbiomas, la [Tienda del cubo](docs/TIENDA_DEL_CUBO.md) y el [Refugio](docs/CASA_VIVA.md).
- **Cuenta opcional** (alpha.98): se juega al instante con guardado local; `account-entry.js` solo pide entrar a quien ya tuvo cuenta en ese dispositivo y no eligió jugar sin ella. [Cuenta y respaldo](docs/CUENTA_Y_RESPALDO.md).
- Android: contenedor WebView de prueba en [android](android/README.md); sin AAB de tienda, proyecto iOS ni builds desktop.

## Estado verificado y límites

- Node: `npm test` con 210 suites en verde (Fase 0).
- La CI de navegador falló de forma intermitente desde el 22 de octubre (flujos distintos en cada ejecución, el job duraba unos 38 de 40 minutos con dos trabajadores). La Fase 0 la reparte en cuatro partes con un trabajador cada una; el resultado se lee en el PR, no se presume.
- Producción de la nube **pendiente**: `src/cloud-config.js` usa Supabase Dev Free y `recoveryUrl` local; `supabase/retention.sql` no está aplicado.
- Compatibilidad comprobada solo en Chromium para alpha.127. iPhone Safari y Android emulado se aceptaron en alpha.57/58 solo para la cuenta.
- Ninguna sesión de juego con personas registrada; la curva del Viaje se midió con un jugador simulado.

## Reglas que no deben reabrirse por documentación vieja

La base musical electrónica y su mezcla con otras familias es identidad; Jay dice que la música está bien. El Viaje no tiene texto en el lienzo. No consumir el RNG antiguo, no mover mapas, conservar guardados. Los 30 tipos de actividad, rarezas y logros ya existen: no son backlog. El único backlog de lanzamiento sigue siendo [D01–D22](docs/PLAN_LANZAMIENTO.md).

## Petición sugerida para abrir una revisión

> Lee AGENTS.md, HANDOFF_CLAUDE.md y la guía del área. Revisa contra el código actual, distingue fallos de pendientes de producción y cita archivo/línea. No implementes, publiques, contrates, borres datos ni repitas baterías completas hasta acordar el detalle.
