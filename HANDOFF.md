# Continuar WHITEDOT · guardianes y exploración

Base: **main 8096c8d, #77**. Rama actual: **feat/phase-06-cultural-exploration**, todavía para revisión/PR de Jay. [Entrega completa](FASE_06.md). Leer después [ESTADO_ACTUAL.md](ESTADO_ACTUAL.md), [PENDIENTES.md](PENDIENTES.md) y [FASES_UNIVERSO.md](FASES_UNIVERSO.md). Todo el handoff anterior permanece en [HANDOFF_HISTORICO.md](HANDOFF_HISTORICO.md).

## Lo de Claude ya integrado

#74 integró el handoff, #75 materia/FX/códigos/set, #76 laboratorio/vida y #77 cubo/expansión. No reaplicar ramas antiguas ni afirmar que faltan cuerdas/prismas/membranas, códigos, grabación o primeras bandadas. Claude retiró jardín modular/rastro; sus campos históricos no significan que los sistemas sigan disponibles. La rama expansión-fase-06 no había implementado culturas.

**Regla actual de interacción:** dedo = mover cubo/pulso; cubo = contacto/recorrido/quietud. Hay modo dedo `?dedo=1` y una excepción heredada para webdriver. Las pruebas nuevas desactivan webdriver para verificar control real. No usar el resultado de una prueba de dedo como evidencia suficiente para el cubo.

## Entrega de esta rama

- Ocho estudios culturales originales, guardianes/llamadas, dos huellas, piedras en orden y tres recuerdos por estudio; Bitácora/logros y persistencia acotada. `culture-model.js` puro; `cultures.js` runtime. No cambian GEN/biomas ni importan música de artistas.
- Vasto, REG 20/18.000 unidades; clave de prueba y dirección completas separadas. No cambia la partida principal ni Clásico/Amplio.
- Paseo visible y giro aleatorio cada 40–90 s activos, con anticipación de mar y recuperación manual. Mantener pausa/capa/destino.
- Laboratorio 54: guardianes, seis poderes, quietud por etapas y cuatro modos experimentales. Forzado solo en el laboratorio; los encuentros naturales siguen siendo raros.
- Golondrinas viajeras, regalo tras dos minutos de formación, señal local de cajas y respuestas entre bandadas por turnos.
- Registros/niveles contenidos de cajas/quietud/experimental; pausa y velocidad inmediata; runners/Bitácora/lámina sin referencias activas a sistemas retirados.

Música: `musical-character.js` y `composition.js` siguen separados del generador. No ampliar arrays de GEN/biomas sin compatibilidad explícita. Original/vivo permanecen en perfiles 1/2; layout ahora puede ser clásico/amplio/vasto. FAVORITOS y WD1 incluyen esa identidad. No guardar escenas/ideas musicales: los recuerdos son progreso de búsqueda y fragmentos originales, no audio congelado.

Los datos de jardines/rastros anteriores quedan históricos. Nuevos datos: `S.cultures` (colecciones y hasta 96 santuarios), `S.formationGifts` (hasta 96), más los campos de Claude ya existentes (`vida`, `boxes`, `listened`, `materiaSites`). Secuencias/llamadas/confianza/poderes/modelos de gesto siguen temporales.

## Arranque y verificación

Aplicación estática sin build/npm install; servir la raíz por HTTP con `python3 -m http.server 8000`. Node >=18; Python/Playwright de requirements-dev y Chromium. Las pruebas arrancan servidores propios:

```bash
npm test
npm run test:browser
npm run test:audio
npm run audit:universe -- 2000 2 1 classic
npm run audit:universe -- 2000 2 2 classic
python3 scripts/render-visual-atlas.py
```

`CHROMIUM_PATH` selecciona navegador. SW debe incluir cada módulo nuevo y renovar caché. Mantener referencia mutable de ACH. Pausar gestos/escucha con menús, ocultación, escáner y mute según el módulo; no confirmar vistas previas por un evento ambiental.

Resultados: **53 suites Node, 36/36 recorridos de navegador + offline (91 módulos), 143 renderizados de audio en 52 estilos**. Pruebas de reinicio cultural/vida y Bitácora repetidas tras los ajustes finales. [Detalle](FASE_06.md) y [mediciones](scripts/phase-06-validation.json). No interpretar aprobación de Chromium/offline como escucha física del teléfono. Pendientes inmediatos: probar allí espejos, grullas, poderes y experimental; relación cultura/biología más profunda, edición fina por cubo y coherencia narrativa/primera sesión. La selección de figuras de Jay sigue pendiente. Una rama amplia por bloque; esta entrega hace commit/push y Jay crea PR/merge.
