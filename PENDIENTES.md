# Pendientes vigentes y preparación de V1

El inventario completo y actualizado está en [V1_PRODUCCION.md](V1_PRODUCCION.md): 64 tareas agrupadas, criterios de publicación, expansión musical/procedural y reglas para guardar/volver a lugares. La lista histórica permanece en [PLAN_HISTORICO.md](PLAN_HISTORICO.md); sus estados antiguos no describen la versión actual.

## Integración verificada

Main remoto `93a5323` incluye el PR #66 y toda la secuencia hasta vidrios sin panel (`cfeac0c`) y animal por toque (`991255a`). Esta revisión se agrega a la misma rama del animal.

## Regla de trabajo más reciente

Agrupar muchas mejoras relacionadas en una misma rama, con commits y puntos de prueba por bloque. Propuesta de V1: una rama `release/v1`, un PR final, Jay hace PR/merge. Esta regla reemplaza la anterior de una función por rama. No crear ramas de documentación adicionales para este plan.

## Prioridad

1. Base fiable: integración, identidad versionada, guardado recuperable, respaldos, residencia de cachés y pruebas automatizadas completas.
2. Música: escucha larga, balance por rutas, instrumentos más distintos, formas evolutivas, transiciones y primeras tandas de estilos/FX.
3. Mundo: contratos de contenido comunes, más relaciones/terrenos, cuerdas y suelo, instalaciones, puertas y búsquedas variadas, primeras culturas/personajes/reliquias históricas.
4. Experiencia: Estudio, retorno y compartir lugares, historia/Voz, accesibilidad, UI silenciosa y pruebas con jugadores nuevos.
5. Cierre: candidata de release, dispositivos reales, actualizaciones/migraciones/rollback y correcciones.

Construcción libre, huertos, crafting, comunidades, observatorios/Leonardo, maestros/partituras, exportación de sets y multijugador siguen presentes en el inventario. Su alcance de V1 debe decidirse; no se declaran implementados ni descartados.

## Lo que ya existe

Semillas, 11 biomas, 52 estilos, radio evolutiva, quietud, favoritos/regreso/autopilot, vidrios/espejos/módulos, conexiones regionales, blobs, familias de encuentros, suelo resonante, frases de animales, rastros e instrumento dormido, sustracción, fijación opcional/borrado, modo tranquilo, Bitácora/logros y shell offline local. La secuencia de ocho entregas ya está integrada; este nuevo inventario V1 espera revisión.

## Decisión preservada

Jay descartó añadir escenas/ideas musicales guardables. Favoritos y guardados existentes permanecen. Exportar un set o una construcción es una función diferente; no convertirlo en guardado automático de escenas.
