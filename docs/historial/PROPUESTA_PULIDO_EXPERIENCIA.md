> **ARCHIVO HISTÓRICO — NO VIGENTE.** Conserva el texto de otra revisión; no certifica el estado actual ni autoriza ejecutar fases, pendientes o instrucciones. Consultar [traspaso actual](../../HANDOFF_CLAUDE.md) e [índice vigente](../README.md).

# Pulir la experiencia · propuesta tras Perplexity y Gemini

Estado: propuesta, no autorización para ejecutar estas fases. Jay pidió contrastar dos textos basados en el README, sin que sus autores hayan jugado. La ampliación de habitantes de Reencuentro 7 sigue siendo un trabajo anterior autorizado y separado.

## Decisión principal

Conservar la música que Jay disfruta. Identificar la revisión exacta que escucha y guardar ejemplos de referencia antes de cualquier trabajo posterior. Esta propuesta mejora descubrimiento, controles, memoria y presentación; no cambia composición, sintetizadores, tempo, armonía ni mezcla de fondo. Un ajuste técnico de audio requeriría un defecto reproducible y comparación con esa referencia.

Los documentos ofrecen hipótesis de producto, no una auditoría jugada. No se han comprobado sus cifras de abandono, conversión o rendimiento. Sus plazos de 30/60/90 segundos son objetivos de prueba, no reglas universales ni resultados medidos en WHITEDOT.

## Qué ya existe

| Recomendación externa | Base real del repositorio | Trabajo útil |
|---|---|---|
| Primer viaje y propósito | onboarding.js, voice-guide.js | Revisar el recorrido completo con personas nuevas; una sola indicación contextual |
| Álbum sonoro | rare-cards.js, element-book.js, collection-garden.js | Unificar lectura, pistas, utilidad y regreso; audición explícita |
| Casa musical | house.js, house-audio.js, house-model.js | Conectar hallazgo → uso en Casa, sin crear otra casa |
| Recuerdos compartibles | share-tools.js usa MediaRecorder, captura del Canvas y audio | Facilitar clips breves a partir del grabador existente; validar formatos móviles |
| Coordenadas compartidas | share-tools.js: WD1; favorites.js; world-memory.js | Hacer guardar/volver más fácil; no inventar otro formato de dirección |
| Modo calma y volumen | controls.js, Sonido, accesibilidad | Reunir ajustes existentes; no activar un nuevo arreglo silenciosamente |
| Menos movimiento | accessibility.js y reducedMotion de los renderers | Comprobar cobertura de todos los efectos, foco, contraste y gestos alternativos |
| Organismos que recuerdan | living-behavior.js, world-memory.js y vínculos existentes | Dar una señal legible al reencuentro; no duplicar otro sistema de afinidad |

La existencia de módulos no acredita una experiencia perfecta ni validación en teléfono. Estos son puntos de integración para revisar, no funciones nuevas por prometer.

## Fases propuestas · una rama amplia por fase

### 1 · Primera sesión comprensible

Revisar Camino, primer toque de audio y entrada al Mundo como un solo recorrido. Enseñar moverse, tocar y conservar mediante tres situaciones jugables y una indicación a la vez. Dar una primera respuesta clara durante el primer minuto como objetivo de playtest, sin imponer una sesión cronometrada. Mantener guía repetible/omitible y acceso completo para jugadores antiguos. El ritual diario no repite el tutorial.

Aceptación: una persona nueva descubre una respuesta y explica qué puede hacer después sin ayuda oral. No se bloquean Casa, estilos ni premios ya obtenidos.

### 2 · Interacción que se entiende

Afinar zonas táctiles, respuesta inmediata de la fuente y confirmación visual del sonido a tempo. Diferenciar tocar, mantener, rodear y conectar donde esos gestos ya existen. Comprobar arrastres accidentales, botones bajo el pulgar, volver/cerrar y deshacer donde sea reversible. Mostrar la ayuda justo al objeto, sin otra capa permanente.

Aceptación: una mano, teléfono vertical/horizontal y PC; reconocer quién respondió sin abrir el escáner. Los controles de interfaz siguen silenciosos.

### 3 · Colección con valor

Usar el álbum y las tarjetas existentes como recuerdos del encuentro: imagen protagonista, función, lugar y gesto. Separar primera adquisición, repetición y hallazgo excepcional. Auditar frecuencia y celebraciones contra los generadores reales; distinguir probabilidad de aparición de probabilidad por hora. Ofrecer Escuchar explícito, Volver y el uso disponible en Casa. Abrir una tarjeta no reproduce música automáticamente ni altera la mezcla.

Una receta/semilla recrea el encuentro según su versión, pero no equivale a una grabación exacta. Los clips se capturan únicamente por petición y con almacenamiento/exportación controlados. No guardar audio continuo de cada encuentro.

Aceptación: sin duplicados molestos ni avisos apilados; cada acción tiene un efecto real. Guardados antiguos y futuros conservados.

### 4 · Explorar con curiosidad

Aprovechar gradientes, habitantes y recuerdos para proponer un próximo descubrimiento real y cercano. Una invitación opcional, sin flecha permanente ni misión obligatoria. Conservar viaje aleatorio y acceso a los 52 estilos; favorecer contraste sin repetir la misma combinación reciente. Hacer visibles el regreso y los favoritos en el flujo existente.

Aceptación: las pistas conducen a contenido generado real; los saltos no suman distancia caminada. La entrada nueva conserva posibilidad de regresar a lugares queridos.

### 5 · Casa y recuerdos compartibles

Completar el trayecto entre tarjeta, objeto compatible y Casa. Hacer evidente cómo escuchar, colocar, quitar y crear una pequeña composición con lo ganado, sin imponer una nueva economía. Aprovechar el grabador actual para una postal breve con vista previa y exportación manual; comprobar WebM/MP4 y capacidades reales de iOS/Android. Mantener dirección WD1 y compartir enlace, con QR como comodidad opcional posterior.

Aceptación: desde un hallazgo hasta un uso creativo y un recuerdo exportable, sin perder propiedad ni exigir servidor. Alternativa clara cuando no exista grabación de vídeo.

### 6 · Un mismo lenguaje en todo el juego

Auditar menú, perfil, favoritos, tarjetas, Casa y guía; agrupar acciones sin duplicar cinco menús nuevos. Tipografía Geist Mono, jerarquía, contraste, áreas de 44 px donde corresponda, esquinas rectas y dorado ganado. Cubrir teclado, foco, zoom, zonas seguras, movimiento reducido y reconocimiento sin depender solo del color. Ayuda de instalación PWA opcional tras una sesión útil, sin banner insistente. No prometer instalar automáticamente en iOS.

Aceptación: claridad con poco texto, cero desbordamiento y avisos de prioridad correcta en varios tamaños. Mantener el espacio negro y el protagonista visible.

### 7 · Cierre medido y jugado

Ejecutar el conjunto final: regresión de música conservada, guardados, offline, instalación, reanudación de audio, sesión larga, batería y render. Comparar auriculares/altavoz en teléfonos reales. Probar con personas nuevas y registrar sus dudas antes de añadir más contenido. Medir localmente tiempos hasta primer sonido y primer recuerdo como diagnóstico; telemetría remota, retención y cuentas necesitan decisiones de servicio y privacidad separadas.

Aceptación: defectos reproducibles resueltos, resultados por revisión y límites externos explícitos. No prometer ausencia absoluta de errores ni equivalencia de una métrica DSP con disfrute musical.

## Qué no incorporaría a este cierre

- Cambiar tonalidad/tempo globales por la hora real: pondría en riesgo la música aprobada y sus transiciones.
- Bloquear funciones existentes para fabricar progresión o forzar un tutorial de 90 segundos.
- Sonido automático en tarjetas, menús o botones; golpes de sub obligatorios.
- Otra Casa, otro álbum, otro código de coordenadas o nuevos controles de calma duplicados.
- Rachas punitivas, urgencia por horas exclusivas, notificaciones externas o premios por ansiedad.
- Monetizar cosméticos, exportaciones o el Estudio: contradice la regla vigente de no pagar por nada.
- Capacitor/tiendas como arreglo inmediato: empaquetar no garantiza mejor rendimiento, audio en segundo plano ni aceptación en tiendas.
- Vibración como requisito universal: Safari/iPhone no ofrece la misma compatibilidad que Android. Cualquier háptica sería opcional y secundaria, con alternativa visual.

El objetivo del siguiente ciclo es hacer comprensible y disfrutable lo existente. Las siete fases se proponen para decisión de Jay; no se han iniciado por recibir los documentos externos.
