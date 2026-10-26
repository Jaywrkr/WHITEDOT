# Limpieza para el traspaso ·26 de octubre de2026

Rama `chore/claude-handoff-cleanup`, desde E7 `7f6374b3`. Misma versión **alpha.207** y mismo runtime. [Traspaso vigente](../HANDOFF.md).

## Cambios

- README y HANDOFF señalan rama real, main, estado de CI, Preview y pendientes. HANDOFF_CLAUDE es un enlace de entrada al traspaso canónico.
- Guías de arquitectura, Viaje, mundo, Refugio y verificación consolidadas. Se retiran del texto vigente reglas sustituidas: Festival hasta Lago, salida obligatoria a casa, UI con notas propias, duración original40min y solo premios a tiempo.
- Índice separa guías vigentes, aceptación, lanzamiento e historial. Se corrigen estados de CI/precios y fases ya construidas; las evidencias históricas permanecen identificadas.
- Herramientas actuales y verificadores históricos diferenciados en [scripts](../scripts/README.md). El [prototipo server](../server/README.md) conserva su test y no se presenta como backend de producción.
- Retirados **163 informes JSON generados**,6.793.912bytes, sin referencias en código, pruebas, workflows o documentos anteriores a la limpieza. También se revisaron consumidores dinámicos de JSON. Los archivos regenerables nuevos quedan ignorados.
- Se conservan los snapshots todavía referenciados, evidencias E, fixtures, licencias, assets, módulos heredados y datos de compatibilidad. No se borran salidas personales, ramas remotas ni partidas.

## Recuperación y verificación

[Manifiesto](mantenimiento/limpieza-2026-10-26.json):ruta, tamaño y SHA256 de cada informe retirado. Todo permanece en Git; para consultar uno:

```sh
git show 7f6374b3:scripts/wow-01-validation.json
```

No se modifica ningún archivo de ejecución:src, styles, assets, icons, HTML, package, service worker, Vercel y Android se conservan. La huella E sigue siendo `14154d7032e8041ca7e030a9f44a5ba1a5b4a78d45ba577fb87ccd3bc1f15062`.

Comprobado en esta limpieza:254 suites Node aprobadas, auditoría0errores/0avisos,149 Markdown sin enlaces/anchors rotos, diff limpio y archivos de ejecución idénticos a E7. La selección de impacto de nueve suites queda cubierta por el pase completo. Navegador/audio no se repiten por metadatos. Resultado y huellas en el manifiesto. La evidencia E de254 suites y veinte recorridos pertenece a su entrega; este mantenimiento no inventa un catálogo audiovisual nuevo ni prueba con personas.
