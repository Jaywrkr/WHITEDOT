> **ARCHIVO HISTÓRICO — NO VIGENTE.** Conserva el texto de otra revisión; no certifica el estado actual ni autoriza ejecutar fases, pendientes o instrucciones. Consultar [traspaso actual](../../HANDOFF_CLAUDE.md) e [índice vigente](../README.md).

# Referencias y criterios de composición

Referencias de intención elegidas por Jay; material generado original. Se comparan decisiones de composición y producción. No son presets de artistas ni un análisis ya realizado sobre sus grabaciones.

La red bloqueó los previews públicos con HTTP 403. Por tanto, esta primera matriz se apoya en características estilísticas conocidas. La auditoría distingue medidas del motor, análisis directo de grabaciones y escucha física. No atribuir resultados medidos a un artista sin disponer de la fuente.

| Familia | Referencia de intención | Patrones que evaluar | Desarrollo y producción |
|---|---|---|---|
| Minimal techno | Richie Hawtin / Plastikman | Pulso 4/4, bombo estable, bajo contenido, pocas figuras que encajan | Microvariación, silencios, filtros articulados; el interés no depende de muchas notas |
| Blues electrónico | Guitarra eléctrica y fraseo blues; Clapton como referencia de intención | Llamada/respuesta, terceras y séptimas expresivas, forma de doce compases en recetas compatibles | La guitarra respira; bajo y caja siguen la base electrónica, con variaciones de ataque y caída |
| Guitarra y máquina | Guitarra eléctrica, post-disco y electrónica de los ochenta | Backbeat, figura rítmica repetible, bajo complementario, respuestas de teclas | Compresión/filtrado acotados, contraste entre frase y acorde; espacio para los gestos |
| Disco / funk | Bajo, guitarra y teclas entrelazados | Bombo 4/4, contratiempos, síncopas de bajo y acordes cortos | Subdivisiones coordinadas; progresión y variación por bloques |
| UK garage | Batería quebrada y soul electrónico | Patrón 2-step, swing, caja reconocible y bajo que deja espacio | Respuestas de teclas, cambios de densidad y silencios de batería |
| Afro house | Electrónica con percusión estratificada | Pulso estable, acentos cruzados, membrana, madera y shaker con funciones diferentes | Estratos rítmicos, no todas las percusiones golpeando a la vez |
| Ambient techno | Textura, secuencia y desarrollo lento | Pulso implícito o explícito; repetición deliberada, consonancia y respiración | Evitar órgano continuo universal y acumulación de agudos; transiciones largas cuando corresponde |
| Dub techno | Acorde, bajo y eco sincronizado | Anclas graves, stabs y retornos ligados a subdivisiones | Feedback limitado; pausas dejan oír el espacio sin tapar al jugador |

## Qué debe demostrar el motor

- Identidad: diferenciar familia por ritmo, instrumentos y fraseo, conservando variantes internas.
- Tiempo: onsets coordinados con la rejilla y swing de la zona; cada zona puede tener otro BPM.
- Armonía: bajo y apoyos fuertes sobre el acorde, melodías de la escala y acuerdos compartidos entre fuentes vecinas.
- Fusionar: base dominante y un aporte secundario concreto; no superponer bandas completas.
- Forma: motivos reconocibles, exposición/respuesta, crecimiento y retirada por frases. Quietud también desarrolla el arreglo.
- Mezcla: margen de salida, retornos acotados y hueco para la interacción; una medición de RMS no certifica calidad profesional.

## Evaluación de escucha pendiente

Recorrer minimal, blues electrónico, disco/funk, garage, afro y ambient con el mismo volumen. Escuchar quietud, interacción y viaje. Registrar groove, fatiga, deseo de quedarse, reconocimiento de cada fuente y contraste entre territorios. Evaluar teléfonos con altavoz/auriculares y sesiones largas. Los resultados automáticos se registran por separado.

## Resultado estructural del ciclo

La auditoría de [CIERRE_DIRECCION_MUSICAL.md](CIERRE_DIRECCION_MUSICAL.md) usa `npm run audit:music`: 52 estilos nativos, 18 influencias y 128 compases por estilo. Las 71 comprobaciones pasan. Se observan 51 gramáticas rítmicas en la muestra, seis formas de arreglo por estilo, repetición intencional y desarrollo de motivos.

Los controles verifican pulso de minimal/disco/afro, backbeat y swing de garage, tempo rápido de drum & bass, estratos de percusión afro, doce compases de blues y protagonistas reales de guitarra/disco de secuencias. Estas son medidas de los eventos originales del juego; no se atribuyen a grabaciones inaccesibles. Evidencia: `scripts/musica-07-pattern-audit.json`. Renders, transiciones y resultados de suites se registran aparte en el cierre.
