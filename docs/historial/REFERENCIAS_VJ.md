> **ARCHIVO HISTÓRICO — NO VIGENTE.** Conserva el texto de otra revisión; no certifica el estado actual ni autoriza ejecutar fases, pendientes o instrucciones. Consultar [traspaso actual](../../HANDOFF_CLAUDE.md) e [índice vigente](../README.md).

# Referencias VJ de Jay

Se revisó el repositorio público [Jaywrkr/TDAI2026](https://github.com/Jaywrkr/TDAI2026), revisión `0ef40446331225ec82cfeb35d91bef1b772f21a4`. Su README describe un rig de TouchDesigner con 98 escenas. Se leyeron los documentos completos siguientes y se inspeccionaron sus cuatro previews. No se ejecutó TouchDesigner ni se importaron shaders, proyectos, texturas o grabaciones.

| Referencia | Rasgo observado | Adaptación original en WHITEDOT |
|---|---|---|
| `25_PLANT_TRAILS.md` | Tallos analíticos finos y brotes luminosos | Brotes: catorce curvas locales y acentos pequeños |
| `26_COLOR_RIBBON.md` | Tres cintas plegadas, cruces blancos y bordes coloreados | Nudo: tres curvas entrelazadas, sin cubrir el fondo |
| `27_AUDIO_ORBIT.md` | Cuatro anillos de nodos y enlaces cortos | Red orbital: malla radial que respira con el pulso existente |
| `47_PROCEDURAL_SPIDERWEB.md` | Dos telarañas irregulares, blanco y violeta | Telaraña: centros desplazados y contornos finos |

Los documentos de Jay citan tutoriales de [Pao Olea](https://youtube.com/watch?v=Bbc1iiXc2_o), [Visual Systems](https://youtube.com/watch?v=LaXM51XhpJM), [Interactive & Immersive HQ](https://youtube.com/watch?v=kcHhg9JXE90) y [PPPANIK](https://youtube.com/watch?v=dPSB9sudk7Q), respectivamente. Se conserva aquí la procedencia visual; no se afirma propiedad sobre sus materiales.

`src/vj-model.js` incorpora los cuatro motivos mediante un hash independiente sobre áreas VJ existentes. Conserva coordenadas, tamaño, huecos y semillas originales; no añade biomas ni modifica música. La regla secundaria selecciona una de cada siete áreas candidatas por hash, no una frecuencia por hora. Se mantienen los ocho motivos anteriores y se amplía el catálogo a doce.

`src/vj-art.js` dibuja geometría original Canvas, sin buffers históricos ni partículas persistentes. Radio limitado a 140 px y 20 % de cada dimensión de la pantalla, baja opacidad, recorte local y fade gradual. Ese límite corresponde al radio, no a un porcentaje de superficie cubierta. Movimiento reducido congela deformaciones. El pulso visual usa la señal existente: no crea notas, efectos o sonidos de botones.
