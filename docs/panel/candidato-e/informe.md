# Candidato E · cierre técnico alpha.207

**Panel simulado: no opiniones reales de los creadores ni jurado humano.** Las siete ramas están encadenadas; Jay conserva PR y merge. [Entrega](../../ENTREGA_E.md) · [traspaso](../../../HANDOFF.md).

Runtime final: `3c9d5dbcc64dbee0f1aa086cd68b8d530a1ceb58`, versión `2.3.0-alpha.207`. Huella `14154d7032e8041ca7e030a9f44a5ba1a5b4a78d45ba577fb87ccd3bc1f15062`. Los commits posteriores de registro no cambian ese runtime. Base main `fd5dfc19`, alpha.200; no se integró main durante E.

## Resultado y cobertura

Cierre técnico local entregado. **La meta diez sigue sin acreditarse.** Las notas describen recortes de código y capturas; no una sesión jugada, una escucha ni aceptación de lanzamiento. No se calcula media general porque Sensación no tiene observaciones y Audio tiene una única valoración estructural.

| Lente simulada | Visual | Audio técnico | Creatividad | Sensación | Cohesión | Pulido |
|---|---:|---:|---:|---:|---:|---:|
| [Mizuguchi](revisores/mizuguchi.json) | — | — | 7,5 | — | 7,5 | 7 |
| [Iwai](revisores/iwai.json) | 7,5 | — | 8 | — | 7,5 | 7 |
| [Matsuura](revisores/matsuura.json) | 7,5 | — | 8 | — | 7,5 | 7,5 |
| [Simogo](revisores/simogo.json) | 7,5 | — | 7,5 | — | 8 | 7,5 |
| [Proteus](revisores/proteus.json) | 7,5 | — | 8 | — | 8 | 7 |
| [Chen](revisores/chen.json) | 7,5 | — | 8,0 | — | 8,0 | 7,5 |
| [Roset](revisores/roset.json) | 8,0 | — | 8,0 | — | 8,0 | 8,0 |
| [Wong](revisores/wong.json) | 8,0 | — | 7,5 | — | 8,0 | 8,0 |
| [Pope](revisores/pope.json) | — | — | 7,5 | — | 8 | 7,5 |
| [Wintory](revisores/wintory.json) | — | 7 | 7,5 | — | 7,5 | 7 |

| Categoría | Media de lo observado | Cobertura |
|---|---:|---:|
| Visual | 7,64 | 7/10 |
| Audio técnico, sin escucha | 7,00 | 1/10 |
| Creatividad | 7,75 | 10/10 |
| Sensación | Sin observar | 0/10 |
| Cohesión | 7,80 | 10/10 |
| Pulido | 7,40 | 10/10 |

[Notas y cálculo](evidencia/notas.json). Cada JSON identifica fuentes, capturas, abstenciones y alcance. Estas medias no son comparables como un experimento causal con el7,6 de la [sesión9](../sesion-9/informe.md): cambiaron revisores y cobertura. No se elevaron notas por pasar pruebas o corregir un hallazgo.

## Qué se corrigió

| Área | Corrección comprobada | Evidencia local |
|---|---|---|
| Resultados |74,6% no aparenta75%;59.999ms sigue siendo0:59; umbrales visibles | `places.mjs`, `result_clarity_smoke.py` |
| Luces del mundo y Estudio | Solo reciben la marca cuando llega la salida estimada; callbacks antiguos descartados | `pulse-output-timing.mjs`, `radio.mjs` |
| Entrada | Pérdida de foco, página oculta y controles cancelan teclas/arrastres/hold | `touch_precision_smoke.py`, `player_touch_smoke.py` en E2 |
| Ayuda | Acción contextual, primer cultivo y árbol dorado; no ofrece salir de la ronda para seguir otro lugar | `guide-context.mjs`, `guide_context_smoke.py`, `place_lesson_smoke.py` |
| Destinos y cierre | Objetivo visible al abrir la lista; scroll y cabeceras coherentes; final5 con salida explícita | `polish_navigation_smoke.py`, `finale_resize_smoke.py` en E4/E6 |
| Teclado | Escape de resultado usa Salir y activa el final real al completar los once lugares | `result_clarity_smoke.py` |
| Jardín de colección | Añadir, retirar, conjuntos y arrastres revierten al fallar guardar; las tarjetas siguen siendo tuyas | `collection_commit_smoke.py` |
| Favoritos | Conserva trabajo pendiente, permite recuperación y abre el destino; un solo listado de visitas | `favorite_save_failure_smoke.py`, `favorites_smoke.py`, `journal_entry_smoke.py` |
| Canción | Nombra tu frase en el tramo audible; historial visual conserva golpes actuales y pausa sin pulsos inventados | `song-tiers.mjs`, `song_authorship_smoke.py` |
| Demostración rítmica | Próximas notas programadas no borran la luz actualmente audible; cola final conservada | `journey-rhythm.mjs`,400ms simulados |
| Libro | Tarjeta antes de controles secundarios; filtros desplegables; contador sin columna partida | `journal_entry_smoke.py`, filtros/foco/presentación/vida |
| Lectura | Nombres de lugares cerrados usan texto legible; colección y ronda se distinguen en resultados | Capturas finales y `result_clarity_smoke.py` |

Los hallazgos iniciales de los seis revisores de código se conservan en [precorreccion/](precorreccion/). Sus revisiones finales registran los cierres. Las últimas observaciones de libro/favoritos/contraste fueron comprobadas de nuevo por Iwai, Wong y Roset; no quedan defectos funcionales reproducidos abiertos en ese recorte. Esto no demuestra ausencia universal de errores.

## Lo que se conserva

[Preservación reproducible](evidencia/preservacion.json):311 archivos protegidos idénticos a main y trece contratos de música/reglas. Incluye partituras, notas, armonía, patrones, voces, juicio, reglas, transacciones de ronda y secuenciación del final. `audio.js` solo contiene seis sustituciones visuales autorizadas; las colas de guía y anillos conservan las mismas llamadas de sonido.

La síntesis, mezcla, tempos, transición musical, RNG, mapas, especies y tamaño del cubo no se rehacen. Menús silenciosos, tipografía y progreso conservados. No hay nuevos instrumentos ni expansión. Supabase/tiendas siguen en pausa.

```sh
node scripts/verify-e-preservation.mjs
```

## Pruebas y capturas

- [Auditoría de salida](evidencia/release-audit.json):0errores/0avisos.
- [Lógica completa](evidencia/node.json):254 suites aprobadas sobre el runtime final; [log](evidencia/logs/node.log).
- [Navegador](evidencia/navegador.json):20 recorridos enfocados acumulados en E7. El último libro/favoritos se verifica en320×568,390×844,844×390 y1280×800; favoritos conserva guardado/recarga también en móvil y PC. Los componentes no modificados reutilizan su regresión anterior, con alcance indicado. No es el catálogo completo.
- [Audio de E1](evidencia/foundation-audio-e1.json):siete renders reales de base, pico máximo aproximado0,8804 y sin clipping. Se reutilizan por preservación exacta del sonido; los ajustes posteriores son visuales. No es escucha física ni nuevo catálogo completo de59 pruebas.
- [21 capturas iniciales](capturas-iniciales/manifest.json):runtime `e8368253`,390×844, anteriores al último ajuste de libro/favoritos/contraste.
- [Tres capturas finales](capturas-finales/manifest.json):runtime `3c9d5dbc`, reemplazan visualmente Lugares, libro y Favoritos; no se atribuyen las21 imágenes antiguas a una revisión nueva.

Las rutas `/tmp/e7-final-capturas` de los revisores corresponden a `capturas-iniciales`; `/tmp/e7-capturas-cierre`, a `capturas-finales`. Las tarjetas forzadas llevan Laboratorio: son fixtures, no evidencia de aparición natural ni controles demo del producto.

Durante la escritura de las regresiones se corrigieron dos supuestos del test: la cámara debía llegar a Sala antes del arrastre y el atajo del anillo ya podía tener un contexto de audio. La prueba final verifica cero gráficos/fuentes de sonido nuevos por UI, además de arrastres reales y recarga. Se mantuvieron las aserciones de funcionamiento; no se desactivaron suites.

## Pendientes con criterio concreto

1. **CI completo de E antes de integrar:** lógica, seis grupos de navegador, seis de audio y agregador del PR nuevo. El CI aprobado de alpha.200 no se transfiere a alpha.207.
2. **Comprensión y gusto reales:** [protocolo](../../PRUEBAS_CON_PERSONAS.md), cinco sesiones formativas y confirmación independiente de8–12. Objetivo, primera acción, flor de Jardín, siguiente lugar y reconocimiento de tu frase; registrar también atascos y abandonos.
3. **Dispositivos:** Android de gama media, Safari iOS, altavoz, auriculares, Bluetooth y lector. Los relojes simulados no miden latencia acústica, pantalla, interrupciones o tacto físico.
4. **Riesgo visual acotado:** Proteus observa poca prominencia inicial de camas del Jardín y pilas de Ruinas en imágenes estáticas. No se ha demostrado fallo de comprensión en movimiento. Conservar el arte solicitado; probar primero invitación y ayuda. Si alguien se atasca, ajustar únicamente la señal contextual de la acción.
5. **Finales:** Simogo deja la presentación temporal completa sin observar. Wintory conserva la armonización deliberada como intercambio expresivo pendiente de escucha/reconocimiento, sin cambiar la música aprobada.

[Registro de aceptación](../../aceptacion-e.json):cero participantes y dispositivos físicos pendientes. Auditoría/lógica llevan su evidencia; navegador completo, audio completo y CI permanecen pendientes. El [validador](../../../scripts/acceptance-gate.mjs) no cuenta bots, duplicados ni formularios vacíos; incluso con datos declarados favorables no certifica diez.

## Cómo cerrar después

Jay revisa la última rama, crea PR y espera CI. Después se registran sesiones y dispositivos del candidato identificado. Un problema real reabre su criterio concreto, con corrección y regresión enfocada; no autoriza rehacer la música, aumentar el cubo o abrir otra expansión. Así el cierre conserva evidencia y no depende de subir una nota simulada.
