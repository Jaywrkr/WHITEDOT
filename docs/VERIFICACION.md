# Verificación vigente

[Traspaso](../HANDOFF.md) · [evidencia E](panel/candidato-e/informe.md). Registrar qué revisión se probó y distinguir lógica, navegador, renders, CI, despliegue y personas.

## Entorno

Cliente sin compilación ni dependencias npm de ejecución. Node18+; CI usa Node22. Python y Playwright son herramientas de prueba:

```sh
python3 -m pip install -r requirements-dev.txt
python3 -m playwright install chromium
```

`CHROMIUM_PATH` puede apuntar al Chromium del sistema. Para jugar basta `python3 -m http.server 8000`. No iniciar el servidor Python/SQLite histórico como backend del producto.

## Durante la iteración

```sh
npm run audit:release
npm run test:impact -- --base SHA_BASE
```

Usar la revisión anterior al cambio. La selección sigue dependencias transitivas y recursos leídos; `--list` solo enumera. Cachea éxitos de la misma instantánea durante una hora; cambios de archivos/entorno invalidan la caché. Opciones:`--no-cache`, `--jobs 1`, `--report RUTA.json`.

Como máximo dos procesos Node. Navegador/audio pesados, uno después del otro. Corregir causas de intermitencias; no eliminar aserciones. Estabilizar los cambios antes del pase completo final y no repetir catálogo pesado por documentos.

## Antes del push

- Cambios funcionales:`npm run audit:release`, `npm test` y recorridos del sistema cambiado, por ejemplo `CHROMIUM_PATH=/ruta/chromium python3 tests/journal_entry_smoke.py`.
- Sonido modificado:renders afectados. Si se conserva exactamente, documentar la comprobación y qué render se reutiliza.
- Solo documentación/evidencia:enlaces, coherencia de fuentes, `git diff --check`, auditoría y selección de impacto. Sin navegador/audio innecesarios.
- Limpieza de archivos:comprobar referencias y consumidores; no borrar por nombre antiguo un formato, módulo o fixture de compatibilidad.

`npm test` no reutiliza la caché de impacto. No atribuir las pruebas de otra instantánea a una nueva sin explicar preservación/alcance.

## Antes de integrar main

Comprobar una vez el candidato final completo:

```sh
npm run audit:release
npm test
npm run test:browser
npm run test:audio
```

[checks.yml](../.github/workflows/checks.yml) reparte navegador y audio en seis grupos por catálogo, con agregador obligatorio. `WHITEDOT_BROWSER_SHARD=i/6` y `WHITEDOT_AUDIO_SHARD=i/6` seleccionan grupos; no omiten pruebas. El grupo de navegador tiene30min; cada recorrido conserva su límite. No integrar con checks pendientes o en rojo.

CI del PR354/alpha.200 aprobado:[registro](INTEGRACION_ALPHA_200.md). E/alpha.207 tiene254 suites Node y veinte recorridos enfocados locales; su catálogo completo/CI y aceptación física siguen pendientes. Vercel Preview aprobado no equivale a esos checks.

## Fixturas y accesibilidad

Las pruebas instrumentan una copia de `src/main.js`; el runtime no se expone en producción. La mayoría aísla Mundo/componentes y puede sustituir `requireAccount()`; eso no certifica Auth. `cloud_account_smoke.py` cubre el acceso real con Auth/REST simulado. La cuenta del producto es opcional.

`player_touch_smoke.py` usa gestos reales y navegador sin marca de automatización. `offline_smoke.py` comprueba el shell offline. Las imágenes de `panel-capture.py` son fixtures identificadas con SHA/digest; no prueban rareza, rendimiento físico o comprensión humana.

Los paneles plegados deben abrirse antes de usar sus controles. Mantener ID, foco, pausa, cierres equivalentes y silencio de UI. El libro tiene filtros secundarios plegables; Favoritos abre su destino dentro de la Bitácora.

## Preservación y aceptación

```sh
node scripts/verify-e-preservation.mjs
node scripts/acceptance-gate.mjs docs/aceptacion-e.json
```

El primero protege 301 archivos y trece contratos desde main alpha.200 (P1 abrió `map.js` y `places-ring.js`, solo dibujo; P2, ocho módulos de menú y cuenta). Lo que cambiaron P3–P8 se compara con `main` tras P8 (`5464612`) y lo que cambiaron Q1–Q6 con el final de Q6 (`4183856`); Q7 lo actualizará con sus contratos musicales cuando Jay apruebe la escucha. El segundo informa del registro declarado; `--require-ready` devuelve2 mientras haya criterios pendientes. Ese resultado esperado no es una suite rota ni un permiso para inventar participantes. Ver [protocolo](PRUEBAS_CON_PERSONAS.md).

Los verificadores históricos `n-preservation.mjs` y `pulido-preservation.mjs` pertenecen a sus revisiones. No usarlos como gate actual ni alterar sus referencias para forzar verde. [Herramientas](../scripts/README.md).

## Escucha pendiente

Q7 (alpha.222, panel 11) cambia los finales con D8-B y D9-B + C. Los renders están en [escucha](panel/sesion-11/escucha/): Viaje antes y después; once a ★ antes y después; once a ★★ después. Son renders offline en Chromium, sin oído humano. **Pendiente: escucha de Jay**, en teléfono con auriculares (mejor Bluetooth), con fecha y dispositivo anotados aquí. No integrar Q7 sin ella.

## Teléfonos y evidencia anterior

`?medir=1` muestra mediana/p95 de fotogramas, calidad y densidad. Registrar dispositivo, navegador, escena, altavoz/auriculares/Bluetooth, rotación, bloqueo, llamada y regreso. Chromium sin GPU no representa un teléfono.

Safari/PC y Android emulado tienen evidencia histórica de cuenta en [Cuenta y progreso](CUENTA_Y_RESPALDO.md); no acredita aceptación física del candidato E, iOS nativo, ports desktop o publicación. Las versiones futuras y fallos de escritura deben conservar progreso.

En Windows, respetar bytes/licencias y rutas ESM; no guardar conversiones locales CRLF como cambios del juego. Los registros de CI y cuentas anteriores permanecen en sus entregas y Git; un artefacto remoto puede caducar.
