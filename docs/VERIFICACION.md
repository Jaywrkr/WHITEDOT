# Verificación

Revisión documental: 20 de octubre de 2026. [Traspaso/evidencia actual](../HANDOFF_CLAUDE.md). Esta revisión no reejecuta baterías de juego, audio ni servicios.

Desde la raíz, con Node 18 o superior:

```sh
npm run audit:release
npm run test:impact -- --base SHA_BASE
```

Sustituir `SHA_BASE` por la revisión previa al cambio. La selección usa dependencias transitivas y contratos de archivos; una ejecución enfocada no equivale a la suite completa. Documentación sola requiere revisar enlaces y diff, auditoría y contratos afectados, sin navegador/audio.

El ejecutor local corre como máximo dos suites Node simultáneas y reutiliza solo resultados correctos de la misma instantánea durante una hora. Cualquier cambio en archivos versionados o no ignorados invalida la caché, incluidos recursos leídos dinámicamente. También compara Node, plataforma, argumentos, entorno y día local. La caché vive en el directorio temporal del sistema; no contiene variables de entorno, solo huellas. El resumen distingue pruebas ejecutadas, reutilizadas y omitidas tras un fallo.

Usar `--no-cache` para forzar ejecución, `--jobs 1` para ejecución serial y `--report RUTA.json` para guardar duraciones y estados. `--list` solo enumera. CI y `npm test` no reutilizan esta caché. Evitar repetir suites pesadas ya aprobadas si no cambió su código; reservar el conjunto completo para el cierre.

Para cambios funcionales, ejecutar además un recorrido representativo. Las pruebas Python de navegador requieren Playwright y Chromium en el entorno de pruebas, sin añadir dependencias al juego. Si cambia sonido, ejecutar los renders afectados. Registrar comandos y resultados en la entrega.

Antes de integrar/publicar `main`, comprobar una vez el conjunto final con lógica, auditoría, navegador y audio completos:

```sh
npm test
npm run test:browser
npm run test:audio
```

CI está definido en [checks.yml](../.github/workflows/checks.yml), con navegador y tres grupos de audio. No integrar con comprobaciones pendientes o fallidas. El catálogo de navegador conserva un límite de 145 segundos por recorrido y hasta dos trabajadores; su contenedor admite 40 minutos, igual que el job de CI, para no cortar todo el catálogo a los 15 minutos. No ejecutar varias suites pesadas simultáneamente ni desactivar aserciones. Documentar por separado CI, pruebas locales, escucha física, dispositivos reales y despliegue.

## Entorno Windows

La conversión automática CRLF de licencias puede alterar sus hashes: comparar con los bytes originales de Git sin modificar licencias ni registrar ajustes locales. Algunas suites antiguas importan rutas absolutas Windows como módulos; un adaptador ESM externo puede ser necesario. Registrar esas adaptaciones, sin presentar una limitación ambiental como fallo del juego.

## Pruebas recientes de referencia

`tests/sparks-economy.mjs`, `tests/crystal-path.mjs` y `tests/crystal-sparks.mjs` cubren lógica. `tests/sparks_economy_smoke.py`, `tests/sparks_notice_smoke.py` y `tests/crystal_path_smoke.py` cubren recorridos reales. [El informe de chispas](../scripts/sparks-progression-validation.json) registra la ejecución anterior; no sustituye verificar cambios posteriores.

## Fixtures de cuenta obligatoria

Desde alpha.57, los recorridos de gameplay/audio que ya instrumentaban main sustituyen explícitamente `await requireAccount()` por `null` en su copia de prueba. Aíslan componentes y conservan sus aserciones; no certifican acceso ni añaden una bandera al producto. `cloud_account_smoke.py` usa la admisión real con Auth/REST simulado y comprueba bloqueo antes del mundo, registro, cuenta persistente/offline, separación entre usuarios y logout. `offline_smoke.py` comprueba el shell offline y que un usuario sin sesión siga bloqueado.

## Evidencia de cuentas y Android que se puede reutilizar

- PC y Safari normal iPhone: aceptación humana de sesión persistente y saldo automático. Android emulado: cuenta real, migración autorizada con 280 archivos idénticos, actualización/reapertura conservando 52 chispas y sesión. Es evidencia de esos recorridos, no de paquetes iOS/desktop o dispositivos Android físicos.
- UI de eliminación (`tests/cloud_delete_smoke.py`) usa Auth/REST simulado; RLS/CAS y RPC se verificaron con datos desechables en transacciones revertidas. No decir que la UI eliminó una cuenta alojada ni repetirlo sobre la cuenta personal.
- `tests/cloud-account.mjs` incluye identidad, persistencia, carreras de sesión y reautenticación de eliminación. La prueba Android `requiresAccountBeforeWorld` comprueba admisión en instalación limpia; no volver a ejecutarla sobre la cuenta conectada esperando que esté bloqueada.
- [CI 39337750907](https://github.com/Jaywrkr/WHITEDOT/actions/runs/39337750907), `165a356`, y [CI 39455805125](https://github.com/Jaywrkr/WHITEDOT/actions/runs/39455805125), `32e2102`, aprobados. El workflow de cuentas compila los paquetes/pruebas; las ejecuciones instrumentadas de actualización/admisión citadas ocurrieron en el emulador local, no se atribuyen al CI.
- Evidencia local `outputs/` fuera del repositorio no viaja al clonar. Los artefactos de CI tienen caducidad; un enlace al run no garantiza que el APK siga descargable.

## Revisar solo documentación

Comprobar enlaces locales de todos los Markdown, separación vigente/histórico, coherencia con los símbolos/contratos citados y `git diff --check`. Ejecutar auditoría estática y consultar `test:impact -- --base SHA --list` antes de decidir qué pruebas corresponden. Si los únicos cambios son Markdown, no volver a probar login, recuperación, dispositivos o audio. Los pushes/PR pueden disparar automáticamente workflows según sus filtros: no atribuirles resultados sin leerlos.

El cierre completo previo a integrar/publicar sigue vigente cuando corresponda; una limpieza documental no lo sustituye ni lo dispara por sí sola. No afirmar «todo probado» con una selección enfocada.
