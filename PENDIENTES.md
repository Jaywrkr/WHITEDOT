# Pendientes vigentes y preparación de V1

La secuencia vigente está en [FASES_UNIVERSO.md](FASES_UNIVERSO.md): diez fases amplias, una rama por fase. El inventario detallado sigue en [V1_PRODUCCION.md](V1_PRODUCCION.md). La lista histórica permanece en [PLAN_HISTORICO.md](PLAN_HISTORICO.md); sus estados antiguos no describen la versión actual.

## Fases 1 y 2 integradas; revisión visual y musical preparada

`feat/phase-01-universe-foundation`: identidad de lugares/favoritos, guardado validado, recuperación y respaldo/importación, cachés acotadas, contratos ampliables, auditoría y automatización de pruebas. Detalle y límites: [FASE_01.md](FASE_01.md). No se han ampliado todavía biomas, géneros o instrumentos; no se ha certificado V1 en dispositivos reales.

`feat/phase-02-living-world-recipes` continúa desde fase 1: Paisajes vivos, 33 hábitats, seis familias, vecindad/clima/relieve, selector y registros del juego. [Detalle](FASE_02.md). Sigue sin ampliar el catálogo de 52 estilos/modelos de instrumento; esa es fase 3.

## Integración verificada

Base remota: `ffc5578`, PR #69; fases 1 y 2 ya integradas. Incluye el inventario V1 y toda la secuencia anterior, hasta vidrios sin panel y animal por toque.

## Regla de trabajo más reciente

Agrupar muchas mejoras relacionadas en una misma rama por fase, con commits y puntos de prueba por bloque. Jay hace PR/merge. Las próximas fases parten de la anterior si está pendiente o del main actualizado después del merge. No crear ramas de documentación separadas.

## Prioridad

1. Probar/merge de `fix/musical-registers-and-visual-inventory`: [118 vistas reales y contraste de registros](REVISION_REGISTROS.md). Elegir con Jay las figuras a mejorar; escuchar especialmente dub, minimal, ambient, amapiano, disco y melodic durante varios minutos. Validar Safari/Android reales y actualizaciones/rollback. El Original v1 ya se conserva junto a Paisajes vivos v2; futuras versiones deberán mantener esa compatibilidad.
2. Música: escucha larga, balance por rutas, instrumentos más distintos, formas evolutivas, transiciones y primeras tandas de estilos/FX.
3. Mundo: contratos de contenido comunes, más relaciones/terrenos, cuerdas y suelo, instalaciones, puertas y búsquedas variadas, primeras culturas/personajes/reliquias históricas.
4. Experiencia: Estudio, retorno y compartir lugares, historia/Voz, accesibilidad, UI silenciosa y pruebas con jugadores nuevos.
5. Cierre: candidata de release, dispositivos reales, actualizaciones/migraciones/rollback y correcciones.

Construcción libre, huertos, crafting, comunidades, observatorios/Leonardo, maestros/partituras, exportación de sets y multijugador siguen presentes en el inventario. Su alcance de V1 debe decidirse; no se declaran implementados ni descartados.

## Lo que ya existe

Semillas, 11 biomas, 52 estilos, radio evolutiva, quietud, favoritos/regreso/autopilot, vidrios/espejos/módulos, conexiones regionales, blobs, familias de encuentros, suelo resonante, frases de animales, rastros e instrumento dormido, sustracción, fijación opcional/borrado, modo tranquilo, Bitácora/logros y shell offline local. La secuencia de ocho entregas ya está integrada; este nuevo inventario V1 espera revisión.

## Decisión preservada

Jay descartó añadir escenas/ideas musicales guardables. Favoritos y guardados existentes permanecen. Exportar un set o una construcción es una función diferente; no convertirlo en guardado automático de escenas.
