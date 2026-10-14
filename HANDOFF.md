# Continuar WHITEDOT · mascota y Tu cubo

Rama actual **feat/pet-and-cube**, basada en **165c376** de la rama cultural. Main remoto sigue en **8096c8d (#77)**: integrar primero `feat/phase-06-cultural-exploration` y después esta rama. Jay crea PR/merge; una rama amplia por bloque. [Entrega nueva](MASCOTA_Y_CUBO.md) · [entrega cultural heredada](FASE_06.md) · [historial íntegro](HANDOFF_HISTORICO.md).

Nuevo: mascota única y ganada, voz melodía/bajo/ritmo por especie, frase/crecimiento guardados, contacto con cubo, sueño, búsqueda local y Bitácora/logros. Tu cubo reutiliza colores y logros, añade estelas/halo/previsualización y enlaza elección con Estudio. Cuatro módulos nuevos, SW renovado. No agrega géneros ni altera ADN/coordenadas.

Persistencia: `S.pet` y `S.cube`, normalizadores puros `pet-model.js`/`cube-model.js`; movimientos/respuestas pendientes son temporales. La mascota escucha solo `playVoice` con origen jugador y emite con sintetizadores directos para evitar realimentación. `petStep` reserva el presupuesto compartido antes de otras instalaciones cuando tiene una respuesta; silencio/culturas/menús siguen mandando. No volver a introducir selector de mascota ni botones en el dock.

Regla: dedo mueve/pulsa, cubo toca. Prueba nueva con webdriver=false. Progreso no penaliza ausencias; ningún control de UI genera audio. La selección del color del Estudio y Tu cubo permanece sincronizada; blanco siempre disponible. No guardar canciones como escenas ni cambiar versiones/mapas sin compatibilidad.

Arranque estático: `python3 -m http.server 8000`, Node >=18 y Python/Playwright/Chromium. Pruebas arrancan servidores propios: `npm test`, `npm run test:browser`, `npm run test:audio`, `python3 scripts/render-visual-atlas.py`. Resultados: **54 suites Node, 37/37 recorridos + offline (95 módulos), 21 renderizados nuevos de mascota**. Caja natural real comprobada aparte tras el reset; atlas 130 vistas. [Detalle](MASCOTA_Y_CUBO.md).

Siguen pendientes teléfono real, relación cultural profunda, narrativa Camino/Mundo/Estudio, edición fina por cubo y cierre de V1. [Lista](PENDIENTES.md).
