# Viaje y ecosistemas reactivos

Petición vigente de Jay, posterior a la mejora integral. Dos ramas dependientes; Jay crea PR y merge. No sustituir mapas, progreso ni catálogo. La ampliación visual está autorizada explícitamente.

| Fase | Rama | Versión | Estado |
|---|---|---|---|
| 1 · Viaje continuo | `feat/viaje-musical-continuo` | 2.3.0-alpha.15 | Implementada; validación local enfocada, DSP pendiente |
| 2 · Ecosistemas reactivos | `feat/ecosistemas-reactivos` | 2.3.0-alpha.16 | Implementada; navegador/lógica enfocados, CI pendiente |

## 1 · Viaje continuo

Núcleos musicales desplazados del centro geométrico; mezcla espacial de dos territorios. Invitados entran cada cuatro compases; relevo principal cada ocho, conservando las dos radios y sus frases. Mezcla progresiva, tempo limitado a dos BPM por compás. Cada territorio conserva su tempo propio. El viento baja diez veces y la niebla toma el color local.

Cada visita automática asigna una región nueva mediante cursor persistente y espiral sin repeticiones. Se retiran todos los candidatos examinados. Se respetan regreso deliberado, favoritos y direcciones compartidas. La garantía depende de conservar el guardado y del espacio finito de coordenadas; no es un universo matemáticamente infinito. No cambia el RNG anterior.

Distancia caminada visible arriba a la derecha: suma movimiento real, incluidas capas, excluye saltos. Conserva distancia histórica. Bienvenida breve para quien vuelve; tutorial inicial intacto. Dos gradientes periféricos apuntan a núcleos vecinos reales, se atenúan y protegen el centro negro.

Validación: suites Node afectadas, motor real con grafo de grabación durante 180 segundos y navegador real a 390/844/1280 px. El grafo verifica programación, no sonido resultante. Los renders DSP no finalizaron: Chromium agotó los hilos disponibles en el contenedor. No se afirma escucha, mezcla aprobada, CI completo ni deploy. Ver scripts/viaje-01-validation.json. CI y escucha física deben cerrar el audio antes de integrar.

## 2 · Reacciones del entorno

Actividad, sensibilidad y contagio regionales independientes de la densidad musical. Lugares tranquilos, grupos reactivos y zonas festivas; pausas, límites y movimiento reducido. Sin controles nuevos ni sonidos de interfaz.

Diez gestos: deformar contornos; abrir flores; peinar niebla; unir constelaciones por orden de visita; estirar formas; transportar color temporal; dejar ecos; abrir/envolver enjambres; tejer hilos; transformar formas según velocidad, quietud o recorrido circular. Combinaciones: niebla revela conexiones, color despierta flores, semillas atraen enjambres. Usar habitantes reales y efectos locales efímeros; no fabricar progreso ni modificar coordenadas de objetos.

## Prueba de Jay

En el preview de fase 1, vuelve a abrir con una partida existente: bienvenida breve y llegada diferente. Camina, mira el contador; pulsa Saltar y comprueba que no suma. Sigue los gradientes y usa Paseo para escuchar transiciones largas. Repite con sonido apagado. Favoritos debe volver exactamente al punto elegido. En fase 2, acercarse, tocar, rodear y quedarse junto a organismos debe producir respuestas distintas, sin cubrir el vacío.

## Cierre de fase 2

Tres regímenes regionales: 32 % quieto, 50 % reactivo y 18 % festivo en la regla de selección, no una medición de todas las regiones. Actividad, sensibilidad y contagio tienen semillas separadas. Máximo de respuestas nuevas simultáneas: 3/7/11; al pasar de régimen, los efectos anteriores terminan su desvanecimiento. Contactos acotados a 72, fuentes examinadas a 48. Respuestas caducan en 2,8–4,4 segundos; conexiones duran hasta 12 segundos, color hasta nueve. Estas son duraciones visuales, no beneficios guardados ni cambios musicales.

Deformación aplicada al glifo de flora/fauna/arquitectura y miniinstrumentos. Niebla abre hasta tres pequeñas ventanas; no vuelve transparente toda la pantalla. Menús, escáner, capas distintas de superficie y pestaña oculta pausan el sistema. Movimiento reducido muestra contornos sin vuelos ni deformación. Viajes y partidas nuevas limpian efectos. La guía existente recibe una sola frase; ningún botón nuevo.

Comprobaciones: tests/reactive-ecology.mjs verifica diez gramáticas, regímenes, contacto, toque, espera, órbita, límites, inmutabilidad y saltos. tests/reactive_ecology_smoke.py recorre 390/844/1280 px y alcanza las diez rutas del renderer mediante habitantes nativos. El perfil local usa Chromium real por CDP para evitar el puente Node bajo agotamiento de hilos; no es aceptación en teléfono físico. Ver scripts/viaje-02-validation.json.

Orden nuevo de PR: viaje continuo, después ecosistemas reactivos. Viaje parte de mejora/10-cierre: conservar primero la integración de las mejoras anteriores pendientes (7 → 8 → 9 → 10). Las ramas se encadenan; cambios externos posteriores pueden necesitar actualización. No se promete ausencia de conflictos frente a modificaciones futuras de main.
