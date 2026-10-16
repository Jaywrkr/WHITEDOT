# Interacción final · ampliación autorizada

Jay autorizó estas dos entregas después de Dirección musical. Base: `feat/musica-07-auditoria`. Una rama dependiente por entrega; Codex commit/push, Jay PR/merge. Continuar sin confirmaciones intermedias. No modificar main.

| Entrega | Rama | Estado |
|---|---|---|
| 1 · Interfaz expresiva y hallazgos | `feat/posmusica-01-interfaz` | Implementada localmente; navegador final bloqueado por recursos |
| 2 · Diez familias de miniinstrumentos | `feat/posmusica-02-instrumentos` | Pendiente |

## 1 · Interfaz expresiva y hallazgos

- Animación local y silenciosa en todos los botones, para toque y teclado. En Entrar al Mundo, la flecha alcanza el cuadrado antes de abrir. Movimiento reducido evita desplazamientos y esperas; proteger el doble toque.
- Notificaciones con entrada/salida suave desde arriba, tiempo limitado y una sola visible. Voz, avisos, frases y celebraciones esperan su turno; no ocultar una detrás de otra ni consumir su tiempo mientras no se ve.
- Hallazgos de reliquias y tarjetas: presentación centrada a pantalla completa, ilustración procedural nítida y datos legibles. El jugador decide cuándo continuar para poder examinarla. Repeticiones comunes conservan una presentación breve. Libro, guardados, rareza y exportación se mantienen.
- Negro, Geist Mono, esquinas rectas, dorado para lo ganado. Sin sonidos de UI. Respeto al foco, Escape, movimiento reducido y tamaños de teléfono.

## 2 · Diez familias de miniinstrumentos

Representar familias muy usadas de electrónica; no afirmar un ranking actual sin datos. Sonido original mediante síntesis propia, sin copiar muestras o marcas. Ejemplos de función: caja de ritmo electrónica, bajo ácido, bajo analógico, polifonía cálida, FM, tablas de onda, textura granular, percusión de recortes, modulación y secuenciación/arpegios. Reutilizar y ampliar modelos existentes antes de duplicar motores.

Distribución reproducible por hábitats con semillas independientes, predominio regional y encuentros menos frecuentes. Formas orgánicas/minimales, no teclados ni equipos que tapen el vacío. Toque, cercanía y movimiento aportan gestos musicales claros y distintos. Cada instrumento se afina al acorde audible y sigue la rejilla/tempo local; densidad y ganancia acotadas para convivir con la banda. La búsqueda y la colección registran lo ganado sin alterar posiciones ni guardados anteriores.

## Verificación

Auditoría y Node completos por rama, navegador de los sistemas afectados y renders del audio modificado. Documentar comandos/resultados por entrega. Las suites completas de Dirección musical cierran su propio conjunto anterior; no presentarlas como prueba de ampliaciones posteriores. CI conserva navegador y todos los grupos de audio como condición antes del merge. Escucha física en iOS/Android se registra aparte.
