# Fase 3 · composición e instrumentos

> Estado al 13 de octubre de 2026: Entrega integrada por #72. No volver a implementar las cuatro voces ni el arco; sus ampliaciones y escucha siguen pendientes. [Estado actual](ESTADO_ACTUAL.md) · [Pendientes](PENDIENTES.md) · [Handoff](HANDOFF.md).

Bloque desde `main` · `0e289b8`, después de #70/#71. Amplía la reproducción musical; conserva los 11 biomas, 52 estilos, identidades de mundo, coordenadas y guardados.

## Implementación

- Cuatro voces adicionales en `src/instruments.js`: **reed**, triángulo con FM suave y filtro resonante; **membrane**, tres parciales inarmónicos con caída corta; **bowed**, entrada lenta y trémolo de amplitud de 4,2 Hz; **hollow**, ondas cuadrada/triangular con resonador de registro medio. No son muestras externas ni nombres nuevos para un mismo preset.
- Paletas de reproducción: organic/andean incorporan reed; tribal/IDM, membrane; ambient, bowed; dub profundo/electro, hollow. Los instrumentos anteriores siguen disponibles. Las paletas del generador no cambian; la política de reproducción está en `musical-character.js` y también conduce las voces de objetos regionales.
- `composition.js`: ocho frases forman un arco de exposición, respuesta, desarrollo y retirada, dos frases por etapa. El arco se repite con los motivos, secciones y variaciones sembradas existentes; no se presenta como una canción infinita sin repetición.
- Nueve caracteres de arreglo mantienen articulaciones propias de los 52 estilos: ataque, duración, color, acento y respuesta. La síntesis modular recibe esos valores por nota y los combina con materiales regionales. Las voces antiguas de síntesis dedicada mantienen su envolvente; sí reciben la dinámica de frase de la pista.
- En desarrollo, la sección más activa de los caracteres cálido/melódico/disco puede doblar un acento cada cuatro compases con otra nota del acorde. Reparte 70/30 del volumen del acento original; no añade una segunda voz a todo el patrón. Notas acotadas al registro audible, incluida la compensación de octava de cristal.
- Los silencios completos, el bajo, el groove, las respuestas deliberadas y las paletas de los vecinos se conservan. El Camino y el Estudio mantienen sus rutas independientes. Nada se guarda como escena musical.
- Service worker actualizado, con `composition.js` incluido para recarga offline. Bitácora describe los cuatro instrumentos; los registra únicamente cuando pasan por la reproducción habitual. Sin logros artificiales por la actualización.

## Verificación

51 suites Node aprobadas localmente, incluidas las capturas de compatibilidad del mundo original, registros de los 52 estilos, scheduler en quietud, mezcla de vecinos y articulaciones reales de las nuevas voces. `git diff --check` debe pasar antes de integrar.

La integración requiere checks de GitHub: lógica y auditorías de ambos generadores, recorridos de navegador, recarga offline y renders Web Audio. Se añade `composition_mix.py` al comando de audio: ocho mezclas densas, cuatro voces × normal/suave, 48/44,1 kHz, 50 notas explícitas por voz con la ruta de materiales y articulaciones. Verifica señal finita, pico <0,96 y ninguna muestra >0,98. Los renders existentes también siguen activos.

## Cómo escuchar

En Menú → Prototipo → Ritmos, viajar a organic, andean, tribal, IDM, ambient, dub profundo o electro. Escuchar varios minutos, quieto y en movimiento; después comparar modo suave, objetos deliberados y una frontera regional. Las voces alternan por sección: no tienen que sonar todas inmediatamente. Probar Paisajes vivos y Original; volver a un favorito y recargar offline.

## Límites que siguen abiertos

No se añaden géneros, culturas, objetos gráficos ni nuevos controles. Las figuras del atlas esperan las elecciones de Jay. No se rediseñan el Estudio ni las instalaciones de fases posteriores. La preferencia artística, fatiga en escucha larga, batería y balance en Safari/iOS/Android reales requieren escucha y dispositivos reales; los checks automáticos no los certifican.
