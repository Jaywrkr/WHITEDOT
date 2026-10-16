# Interacción final · ampliación autorizada

Jay autorizó estas dos entregas después de Dirección musical. Base: `feat/musica-07-auditoria`. Una rama dependiente por entrega; Codex commit/push, Jay PR/merge. Continuar sin confirmaciones intermedias. No modificar main.

| Entrega | Rama | Estado |
|---|---|---|
| 1 · Interfaz expresiva y hallazgos | `feat/posmusica-01-interfaz` | Incluida y validada con entrega 3; sin PR separado |
| 2 · Diez familias de miniinstrumentos | `feat/posmusica-02-instrumentos` | Pausada por Jay; trabajo incompleto conservado aparte |

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

## Ampliación visual autorizada · 16 de octubre

Jay pidió continuar sin modificar música. El trabajo de miniinstrumentos queda conservado en el stash `Preserve unfinished mini-instruments before visual-only work`, asociado a `feat/posmusica-02-instrumentos`; no está terminado ni publicado.

| Entrega | Rama | Estado |
|---|---|---|
| 3 · Zonas VJ, cometas y encuentros visuales | `feat/posmusica-03-universo-vj` | Implementada y probada: auditoría, 130 suites Node y tres programas de navegador enfocados |
| 4 · Sorpresas temporales de las cajas | `feat/posmusica-04-cajas` | Implementada y probada: auditoría, 131 suites Node y dos programas de navegador enfocados |
| 5 · Perfil y revisión PC/móvil | `feat/posmusica-05-perfil` | Implementada y probada: auditoría, 132 suites Node y navegador integrado en cuatro tamaños |

Ocho motivos originales procedurales: órbitas, circuitos, cintas, vidrio, islas, partitura, abanico y organismo. Inspirados en las imágenes compartidas por Jay, sin reutilizar archivos ajenos. El repositorio TouchDesigner mencionado no está disponible en los checkouts locales inspeccionados; no se afirma haber analizado su código. Ubicaciones independientes de mapas/sonido, vacío entre escenas, fade por distancia, tamaño local y movimiento reducido. Cometas ocasionales; visitantes curiosos y esquivos con territorio acotado. Gestos silenciosos al pulsar/contactar. No altera notas, tempo, instrumentos ni ganancia.

### Cajas · alcance de la entrega 4

Dieciséis sorpresas secundarias originales: Paso de miel, Miniatura, Burbuja, Expansión, Gota viajera, Resorte, Órbitas detrás, Cinta viajera, Polvo de prismas, Lluvia inversa, Tres lunas, Jardín prestado, Eco de siluetas, Vacío amable, Salto inesperado y Halo prisma. Se decide una sorpresa en 45 % de hashes de cajas; no es frecuencia por hora ni una garantía de recorrido. La sorpresa sustituye la anterior; los seis poderes originales conservan su reloj y sus probabilidades. Movimiento, siluetas y rastros son temporales. «Deshacer» elimina la sorpresa; «Volver» revierte el salto mientras está activo. Al caducar sigue disponible el regreso habitual del menú. Borrador solo elimina los brotes efímeros de esta ampliación. No destruye fauna, reliquias, objetos ni colección. No se agregaron sonidos de estelas: Jay pidió conservar la música.

### Perfil · entrega 5

Menú → Tu perfil: nombre local, tiempo activo, distancia caminada (10 unidades internas por metro de juego), sesiones medidas y días con luz. Resumen del progreso existente: lugares, estilos e instrumentos escuchados, familias, tarjetas, cajas y logros. El tiempo por Camino/Mundo/Casa se despliega aparte. Accesos a colección y lugares sin añadir controles al Mundo. Nombre de hasta 24 caracteres; controles táctiles de 44 px e input de 16 px para evitar zoom de iOS.

Los contadores nuevos empiezan desde esta versión y muestran su fecha: no se inventa tiempo ni distancia anteriores. Pausa en menús, vestidor, escaneo y segundo plano; saltos/cambios de capa o semilla no cuentan como caminar. Formatos futuros quedan intactos. Todo viaja en la copia de partida existente, sin cuenta ni servidor obligatorio.

Revisión integrada: cuatro tamaños (320×640, 390×844, 844×390, 1280×800), entrada real, silencio de UI, perfil, persistencia, sorpresas/deshacer, pausa, zonas VJ, tarjetas completas y movimiento reducido. El contenedor conserva procesos zombis ajenos; el navegador normal falló antes de cargar. Un perfil local de Chromium con un solo proceso/contexto permitió completar el recorrido integrado inicial. No equivale a la suite completa ni a probar teléfonos físicos. CI mantiene sus procesos normales y todas las pruebas.
