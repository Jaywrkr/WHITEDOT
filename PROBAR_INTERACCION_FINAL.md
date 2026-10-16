# Probar visuales, cajas y perfil

Rama final: `feat/posmusica-05-perfil`. Incluye las entregas anteriores. Abre su Preview cuando Vercel lo genere; este documento no afirma un deploy ya realizado.

## Teléfono

1. **Entrada:** recoge la primera luz del día y entra al Mundo. La flecha llega al cuadrado antes de entrar. No hay sonido de botón. Movimiento reducido evita el desplazamiento y la espera.
2. **Exploración:** camina y usa Saltar. En algunos lugares aparecen órbitas, circuitos, cintas, vidrio o contornos orgánicos. Permanecen zonas vacías. Las figuras se revelan gradualmente; no todos los lugares contienen cada motivo. Los visitantes curiosos se acercan; los esquivos se alejan dentro de su territorio. Los cometas son ocasionales.
3. **Cajas:** toca una con el cubo. Algunas añaden una sorpresa temporal al poder original. Lee ambas duraciones en la tarjeta. Tras Continuar, el control contextual muestra la sorpresa y su tiempo. Deshacer la elimina; Volver revierte un salto activo. Al caducar, el regreso habitual del menú sigue disponible. El borrador solo elimina brotes efímeros nuevos.
4. **Hallazgos:** una tarjeta nueva ocupa la pantalla para examinarla. No caduca mientras la lees. Continuar devuelve el control; los avisos esperan su turno. La colección y las direcciones siguen guardadas.
5. **Perfil:** Menú → Tu perfil. Guarda un nombre, revisa tiempo/distancia y abre colección o lugares. Tiempo por espacio se despliega aparte. Reabre la aplicación: el perfil debe continuar. Los datos nuevos empiezan desde su fecha de medición; la colección anterior sí se conserva.

Prueba vertical y horizontal. Verifica que puedes cerrar cada panel, leer la tarjeta y alcanzar sus botones sin desbordamiento horizontal. El perfil se desplaza verticalmente. También se respeta reducir movimiento del sistema.

## PC

Recorre con flechas o WASD. Abre los paneles con ratón; recórrelos con Tab y Shift+Tab. Escape cierra y devuelve el foco. Los paneles y tarjetas bloquean acciones accidentales detrás.

## Evidencia y límites

Por entrega: auditoría sin errores/advertencias y 130/131/132 suites Node. Navegador enfocado aprobado en los sistemas modificados; recorrido integrado a 320×640, 390×844, 844×390 y 1280×800, con capturas inspeccionadas. Perfil local opcional de Chromium de un solo proceso/contexto por saturación de hilos del contenedor. Las pruebas conservan todas sus aserciones; CI mantiene el navegador normal.

Comando local para recorridos de un único contexto:

```bash
WHITEDOT_TEST_SERIAL_HTTP=1 WHITEDOT_CHROMIUM_SINGLE_PROCESS=1 CHROMIUM_PATH="$PWD/scripts/chromium-constrained.sh" python3 scripts/browser-processes.py --timeout=145 python3 tests/visual_closure_smoke.py
```

No habilitar ese perfil para suites que necesitan contextos simultáneos. CI completo, pruebas en teléfonos físicos y deploy se verifican aparte. La síntesis, instrumentos, composición y mezcla permanecen iguales; esta ampliación no afirma una nueva escucha o masterización.
