# Reencuentro · música e identidad del universo

Autorizado por Jay después de identificar `acd766f` en su captura. Seis ramas iniciales y una ampliación autorizada de habitantes, desde main `2f9cf3e`, que ya incluye viaje y reacciones. Jay hace PR y merge. No reiniciar mundos ni colecciones. La referencia anterior `15bbe77` queda como antecedente, no como sustituto de la captura.

| Fase | Rama | Versión | Estado |
|---|---|---|---|
| 1 · Referencia musical | `feat/reencuentro-01-musica` | alpha.17 | Implementada; pruebas enfocadas, DSP pendiente |
| 2 · Contenido visible | `feat/reencuentro-02-catalogo` | alpha.18 | Implementada; validación enfocada |
| 3 · Identidad regional | `feat/reencuentro-03-identidad` | alpha.19 | Implementada; pruebas de renderer, navegador pendiente |
| 4 · Ecosistemas | `feat/reencuentro-04-ecosistemas` | alpha.20 | Implementada; muestreo y pruebas enfocadas |
| 5 · Exploración legible | `feat/reencuentro-05-exploracion` | alpha.21 | Implementada; pruebas enfocadas, CI pendiente |
| 6 · Auditoría | `feat/reencuentro-06-auditoria` | alpha.22 | Implementada; cierre de publicación condicionado a CI y escucha |
| 7 · Habitantes y profundidad | `feat/reencuentro-07-habitantes` | alpha.23 | Implementada; 156 suites completas, navegador/DSP bloqueados por recursos |

## 7 · Más habitantes, fondos lejanos

Petición posterior de Jay: ver mucho más los muñequitos, cientos de variedades y conductas, galaxias/VJ difusos y seres que viajen solos. La rama parte de fase 6, commit `76d4c87`.

`pixel-life-model.js` combina ocho cuerpos con coronas, ojos, patas y marcas; doce actividades reales. Un muestreo de 3.000 genomas observa 2.524 siluetas distintas, no 2.524 especies dibujadas a mano. Las colonias comparten parentesco y actividad dominante, con excepciones individuales. Hay claros y regiones escasas; no se reparte todo por igual. Población efímera, hash independiente, sin consumir RNG ni escribir progreso.

La cohorte pixelada de las especies móviles originales aparece en más familias, conservando bits, voces y coordenadas. El campo visible favorece ligeramente los organismos móviles sin retirar límites, raros ni regiones tranquilas. Los vecinos nuevos usan cuatro roles e instrumentos regionales a través de `playVoice` y `beatSoon`, máximo dos respuestas por compás; no agregan un coro automático. Tocar/contactar provoca una respuesta visual local.

Dos corrientes de viajeros cruzan regiones por su cuenta, incluso con el cubo quieto. Consulta inversa analítica y caché acotada; no se simula todo el universo. No necesitan tocar ni perseguir al jugador. Menús, inspección, escáner y pestaña oculta pausan la actividad; movimiento reducido congela los desplazamientos.

Galaxias más amplias, menor contraste y paralaje lento. Los doce motivos VJ conservan posiciones y aparecen como capas lejanas suavizadas, con borde radial y caché de doce imágenes pequeñas. Los objetos interactivos siguen en primer plano. Escáner y dos prácticas reales del catálogo permiten localizar habitantes y viajeros sin botones nuevos permanentes.

La propuesta posterior de Perplexity/Gemini se evalúa en [PROPUESTA_PULIDO_EXPERIENCIA.md](PROPUESTA_PULIDO_EXPERIENCIA.md). Son recomendaciones para decidir; no otra implementación autorizada ni otra reescritura musical.

## 1 · Referencia musical

Extraer y ejecutar la radio real de acd766f con sus dependencias históricas. Comparar a igual región y compás: motivos, bajos, voz principal, gramática, secciones y expresión. En producción, esa radio vuelve a gobernar los protagonistas. Los acompañantes actuales siguen disponibles, sin reescribir sus frases. Conservar transporte, armonía compartida, transiciones largas, filtros interactivos, duetos y salida protegida. No reponer el órgano continuo.

La recuperación no es una réplica idéntica del master: síntesis, mezcla, gestos y acompañantes modernos permanecen. La captura tampoco contiene semilla, coordenadas ni una grabación de la sesión. El fixture identifica decisiones compositivas verificables, no una valoración de belleza.

## 2 · Contenido visible

Inventario reproducible de familias: generación, renderer, ruta musical e interacción. Muestra de distribución con denominadores explícitos, sin inventar probabilidad por hora. Galería interna reutilizando el laboratorio; mostrar la apariencia y abrir su práctica. Recuperar sprites originales en una familia regional, respetando blobs, anatomías actuales, IDs y lugares guardados.

## 3 · Identidad regional

Extender las ocho familias existentes con una gramática visual coherente: especies pixeladas, membranas, filamentos y formas de cristal con escala, distribución, contornos y presencia diferentes. Las variaciones de individuos deben conservar parentesco reconocible. No multiplicar etiquetas sin cambiar experiencia.

## 4 · Ecosistemas

Núcleos, colonias, corredores y claros sobre habitantes reales. Conservar ejemplares raros y arquitectura en sus coordenadas. Organizar la visibilidad/actividad de comunes sin sustituir mapas guardados ni repartir todas las especies por todas partes. Vincular movimientos y relaciones a la identidad local; conservar sitios vacíos.

## 5 · Exploración legible

Pistas periféricas hacia lugares reales con contenido distinto, sin flechas permanentes ni avisos nuevos. Selección de salto que valore también ecosistema y aspecto, además de género. Dar contexto breve sobre el lugar y acceso al laboratorio desde la guía existente; conservar favoritos y direcciones.

## 6 · Auditoría

Ejecutar el inventario contra el mundo real muestreado, comprobar accesibilidad de todas las familias, la presencia de protagonistas originales y variedad perceptible en regiones. Comparar referencia histórica y producción con acompañantes. Validar teléfono/PC, guardados, silencio de UI, movimiento reducido y límites de dibujo. Registrar diferencias entre programación musical, métricas DSP y escucha física; CI completo pendiente no equivale a cierre de publicación.

### Evidencia de contenido

`node scripts/content-audit.mjs 256 /tmp/contenido.json` registra presencia por chunk, rutas declaradas y huecos de práctica. No mide probabilidad por hora. Catálogo: 157 familias coleccionables; entradas del laboratorio y familias se unen por ID, no son nuevas especies. Las rutas declaradas se contrastan con archivos existentes; que exista una ruta no prueba una interacción audible. Los elementos sin práctica individual quedan explícitos en `withoutPractice`. Galería: Laboratorio → Catálogo; filtrar y abrir el elemento real. Los retratos son ejemplares, no todas las variaciones individuales.

Fase 2: navegador local sin cerrar por agotamiento de hilos; la primera ejecución del perfil CDP detectó un clic sin apertura, cuyo perfil no desplazaba controles de paneles con scroll. Se corrigió el perfil local, pero los intentos posteriores no iniciaron Chromium. No se afirma UI aprobada: el recorrido portable sigue obligatorio en CI. Módulo de galería probado con adaptador DOM, separado de layout real.

## Cierre del conjunto

Ver [CIERRE_REENCUENTRO.md](CIERRE_REENCUENTRO.md) y [INVENTARIO_UNIVERSO.md](INVENTARIO_UNIVERSO.md). Implementación de seis fases; publicación pendiente de CI, navegador, DSP y escucha física. No presentar el inventario declarado como cobertura sensorial completa. La fase 6 conserva dos generaciones y las decisiones de la referencia, añade localizadores reales de los cinco aspectos y mantiene el informe de huecos.
