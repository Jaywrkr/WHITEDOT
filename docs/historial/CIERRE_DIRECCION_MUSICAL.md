> **ARCHIVO HISTÓRICO — NO VIGENTE.** Conserva el texto de otra revisión; no certifica el estado actual ni autoriza ejecutar fases, pendientes o instrucciones. Consultar [traspaso actual](../../HANDOFF_CLAUDE.md) e [índice vigente](../README.md).

# Auditoría · Dirección musical

Candidata `2.2.0-rc.1`. Rama final `feat/musica-07-auditoria`, desde F6 `97f7c98`. Contiene las siete fases musicales y sus antecesoras de pulido. Jay crea PR y merge; Codex no publica main.

## Qué se evalúa

Una banda electrónica propia por territorio, con tempo local, acordes compartidos y fuentes que participan en esa música. Densidades de una a diez partes, ritmos nativos, instrumentos y tratamientos propios, formas que evolucionan en quietud y transiciones entre territorios. Paletas locales relacionan sonido, flora, fauna e instalaciones sin llenar el negro.

[REFERENCIAS_MUSICALES.md](REFERENCIAS_MUSICALES.md) contiene la matriz: economía/microvariación del minimal techno, llamada/respuesta y doce compases del blues, síncopa y swing de garage, interconexión de disco/funk, capas de afro y respiración de ambient/dub. Hawtin y Clapton son referencias de intención elegidas por Jay. La red impidió descargar previews (HTTP 403); no se realizó análisis directo de esas grabaciones ni escucha física.

## Hallazgos y correcciones de esta auditoría

| Problema | Evidencia | Corrección |
|---|---|---|
| Ambient de dos partes podía comenzar mudo | Región `-29,-12`: cero notas durante cuatro compases | Introducción audible y continuidad de bandas pequeñas; pausas explícitas conservadas |
| Un mundo minimal podía importar un kit completo de otra familia | Se añadían congas y handslap del patrón interlock al patrón nativo | Ritmo nativo dominante; ornamento local acotado y polirritmia vinculada a la influencia apropiada |
| UK garage perdía swing | La plantilla reemplazaba el swing compuesto por cero | Conservar swing de la identidad/frase, dentro de límites |
| Zonas experimentales eludían reloj y armonía | Osciladores libres y racimos microtonales en producción | Color por subdivisiones y acordes; el laboratorio conserva su experimento explícito |
| Visitas de quietud elegían notas en cada pulso | Sorteo de visitante/nota en varias subdivisiones | Respuesta estable por frase y respeto a descansos |
| La mascota podía responder en la tonalidad del destino antes de oírla | Usaba la región bajo el cubo y no el marco audible del cruce | Reloj y acorde del onset para sus voces; registro y especie conservados; 21 renders de producción |
| Un dibujo musical podía conservar notas de otra tonalidad | Melodías guardadas absolutas al cambiar de lugar | Afinar el gesto al acorde del onset actual |
| El primer segundo no entraba en la comprobación de pico | La métrica principal comenzaba tras un segundo | Verificar señal finita y pico de todo el render, también arranque |
| Demostración ternaria en un territorio incompatible | El nuevo respeto al ritmo nativo dejó sin golpes ternarios ese ejemplo del laboratorio | Buscar un territorio con la influencia y capa de percusión correctas; prueba de scheduler con energía controlada |
| La prueba de cables podía comprobar una señal anterior al segundo cable | Esperaba cualquier grafo y luego exigía inmediatamente ambas rutas | Esperar la firma emitida con señal y CV; conservar las mismas exigencias de conexión, audio y retirada |
| Una regresión de encuentros no estaba en la suite de audio | `encounter_mix.py` fuera del manifest | Incorporarla y detectar nuevos programas de audio automáticamente |

`musica-07-intro-regression.json` conserva el caso de introducción. La identificación y corrección de estos fallos precede a las suites finales. No se desactivan pruebas. Una primera pasada de navegador obtuvo 91/92: la demostración de membranas no buscaba un hábitat compatible. Se corrigió y la repetición obtuvo 92/92 más offline. Después se detuvo deliberadamente una pasada de audio para incorporar la corrección de la mascota; esa pasada interrumpida no cuenta como validación completa. Las suites finales se repiten sobre el código corregido.

## Auditoría reproducible

```bash
npm run audit:release
npm test
npm run audit:music -- /tmp/whitedot-music.json
npm run test:browser
npm run test:audio
```

`audit:music` evalúa eventos reales de territorios existentes: 52 estilos, 18 influencias y 128 compases por estilo. La muestra observa 51 gramáticas de batería y pasa 71 comprobaciones de estructura, instrumentos, swing, tempo, forma y fusión. Son criterios estilísticos documentados, no una comparación espectral con grabaciones de artistas. La prueba forma parte de `npm test`.

La suite completa de audio incluye todos los programas `*_mix.py`. El renderizador comprueba el pico de todo el buffer, además de las métricas tras el arranque. `production_mix.py` cubre los 52 estilos en producción y las cuatro clases de zona experimental con ubicaciones reales; los demás programas cubren instrumentos, fuentes, FX, clima, casa, criaturas, juegos ópticos y redes.

**Suites finales aprobadas:** auditoría sin errores ni advertencias, 127 suites Node, 71 comprobaciones estructurales, 92 recorridos de navegador más offline y 39 programas de audio con 915 renders documentados. Pico máximo registrado: 0,934278. Audio a 44,1/48 kHz, incluido arranque. Resultados definitivos en `scripts/musica-07-validation.json`; resumen acústico por programa en `scripts/musica-07-audio.json`. La evidencia histórica se restauró sin sobrescribir sus resultados.

La corrección de la mascota pasa además 21 renders de producción y una regresión de fronteras; `musica-07-pet-regression.json` conserva sus métricas. La prueba de cables pasó dos veces enfocada y de nuevo dentro de la suite completa. Los intentos fallidos o interrumpidos se registran en validation.json; no se confunden con la última pasada verde.

## Escucha y teléfono

1. Abre el Preview de `feat/musica-07-auditoria`.
2. Entra al Mundo y activa sonido tocándolo.
3. Abre Estilos → Cruces: busca Blues modular y Guitarra y máquina.
4. Prueba Disco de secuencias y vuelve a Estilos.
5. Compara minimal techno, UK garage, afro y drum & bass.
6. Usa una sola voz y un ensamble completo, al mismo volumen.
7. Escucha quieto durante dos minutos; después toca y conecta fuentes.
8. Prueba Campo, Paseo y regreso al lugar anterior.
9. Revisa cubo, tarjetas, jardín y recarga de tu guardado.

Escuchar en altavoz/auriculares de iOS y Android, también sesiones largas. Evaluar reconocimiento, groove, equilibrio, fatiga y deseo de quedarse. Las pruebas automáticas comprueban reglas, contraste y estabilidad; no certifican por sí solas gusto musical ni masterización de estudio.

## Integración

Mantener ascendencia y revisar ramas de la antigua a la nueva. Cambios externos, squash o rebase pueden requerir resolver conflictos. CI del PR y artefacto de Vercel se verifican aparte de esta evidencia local. Publicar corresponde a Jay.

## Continuación autorizada

Jay añadió después de este ciclo animaciones de controles, notificaciones exclusivas, tarjetas ilustradas a pantalla completa y diez familias de miniinstrumentos territoriales. Se implementan después de esta rama, en [PLAN_INTERACCION_FINAL.md](PLAN_INTERACCION_FINAL.md). No forman parte de los 915 renders anteriores; tendrán su propia validación.
