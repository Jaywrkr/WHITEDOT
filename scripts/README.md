# Herramientas de desarrollo

El juego no ejecuta estos scripts. [Arquitectura](../docs/ARQUITECTURA.md) · [verificación](../docs/VERIFICACION.md) · [traspaso](../HANDOFF.md).

| Herramienta | Uso vigente |
|---|---|
| `release-audit.mjs` | Imports, IDs, caché, versión, Vercel y licencias |
| `test-impact.mjs` | Selección de pruebas afectadas; `--base SHA`, `--list` |
| `run-tests.mjs` | Lógica completa (`npm test`) |
| `run-browser-tests.py` | Catálogo de navegador/audio con Chromium |
| `verify-e-preservation.mjs` | Preservación del candidato E desde main alpha.200 |
| `acceptance-gate.mjs` | Registro humano declarado; no certifica una nota |
| `i18n-scan.mjs` | Lista el texto español del juego que aún no tiene inglés ([Traducción](../docs/TRADUCCION.md)) |
| `panel-capture.py` |21 estados de teléfono con manifiesto SHA/digest; `CAPTURES` limita la selección |
| `bump-version.mjs` | Sincroniza versión de ejecución; no usar por documentos |
| `vercel-build.mjs` / `stamp-deploy.mjs` | Sella el artefacto de publicación |
| `android-assets.mjs` | Copia el cliente al build Android |
| `itch-package.mjs` | Zip de la edición de venta para itch.io en `dist/` ([itch.io](../docs/ITCH.md)) |
| `serve-recovery.py` | Página local de recuperación; no es backend del juego |
| `store-media.py` | Material de tienda en outputs; requiere autorización de ese trabajo |

Otros scripts de análisis/censo/economía permanecen como herramientas de diagnóstico. Sus resultados son modelos o muestras, no escucha humana ni conteos de todo el universo.

## Resultados generados

Los JSON sin consumidores se retiraron en la [limpieza](../docs/LIMPIEZA_REPOSITORIO.md). Las ejecuciones pueden regenerarlos; los nuevos JSON de scripts quedan ignorados. Evidencia revisada del candidato en `docs/panel/candidato-e/evidencia/`; snapshots antiguos todavía referenciados se conservan, con el alcance de su entrega. Un archivo que diga PASS no valida la revisión actual por sí solo.

## Verificadores históricos

`pulido-preservation.mjs` corresponde a J/K y `n-preservation.mjs` al candidato N. Sus informes históricos los referencian; deben ejecutarse sobre la revisión para la que fueron escritos. Fallar ante cambios posteriores es su contrato, no una regresión del producto ni un gate que haya que relajar. E usa `verify-e-preservation.mjs`.

No borrar módulos/datos heredados, salidas personales o claves de jugadores para limpiar un checkout. `outputs/`, caches y entornos locales no se publican.
