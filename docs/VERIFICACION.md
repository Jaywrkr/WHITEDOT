# Verificación

Desde la raíz, con Node 18 o superior:

```sh
npm run audit:release
npm run test:impact -- --base SHA_BASE
```

Sustituir `SHA_BASE` por la revisión previa al cambio. La selección usa dependencias transitivas y contratos de archivos; una ejecución enfocada no equivale a la suite completa. Documentación sola requiere revisar enlaces y diff, auditoría y contratos afectados, sin navegador/audio.

Para cambios funcionales, ejecutar además un recorrido representativo. Las pruebas Python de navegador requieren Playwright y Chromium en el entorno de pruebas, sin añadir dependencias al juego. Si cambia sonido, ejecutar los renders afectados. Registrar comandos y resultados en la entrega.

Antes de integrar/publicar `main`, comprobar una vez el conjunto final con lógica, auditoría, navegador y audio completos:

```sh
npm test
npm run test:browser
npm run test:audio
```

CI está definido en [checks.yml](../.github/workflows/checks.yml), con navegador y tres grupos de audio. No integrar con comprobaciones pendientes o fallidas. No ejecutar varias suites pesadas simultáneamente ni desactivar aserciones. Documentar por separado CI, pruebas locales, escucha física, dispositivos reales y despliegue.

## Entorno Windows

La conversión automática CRLF de licencias puede alterar sus hashes: comparar con los bytes originales de Git sin modificar licencias ni registrar ajustes locales. Algunas suites antiguas importan rutas absolutas Windows como módulos; un adaptador ESM externo puede ser necesario. Registrar esas adaptaciones, sin presentar una limitación ambiental como fallo del juego.

## Pruebas recientes de referencia

`tests/sparks-economy.mjs`, `tests/crystal-path.mjs` y `tests/crystal-sparks.mjs` cubren lógica. `tests/sparks_economy_smoke.py`, `tests/sparks_notice_smoke.py` y `tests/crystal_path_smoke.py` cubren recorridos reales. [El informe de chispas](../scripts/sparks-progression-validation.json) registra la ejecución anterior; no sustituye verificar cambios posteriores.
