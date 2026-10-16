# Probar la ampliación completa

Rama final: `feat/posmusica-08-cierre`. Incluye las entregas anteriores. [Preview de la revisión funcional 7e28462](https://whitedot-k2955refm-jaywrkr-1498s-projects.vercel.app). Vercel informa despliegue correcto; la comprobación procede del estado de GitHub, no de una prueba física. No necesitas parámetros dev.

## Teléfono

1. **Entrada:** recoge la primera luz del día y entra al Mundo. La flecha llega al cuadrado antes de entrar. No hay sonido de botón. Movimiento reducido evita el desplazamiento y la espera.
2. **Exploración:** camina y usa Saltar. En algunos lugares aparecen órbitas, circuitos, cintas, vidrio o contornos orgánicos. Permanecen zonas vacías. Las figuras se revelan gradualmente; no todos los lugares contienen cada motivo. Los visitantes curiosos se acercan; los esquivos se alejan dentro de su territorio. Los cometas son ocasionales.
3. **Cajas:** toca una con el cubo. Algunas añaden una sorpresa temporal al poder original. Lee ambas duraciones en la tarjeta. Tras Continuar, el control contextual muestra la sorpresa y su tiempo. Deshacer la elimina; Volver revierte un salto activo. Al caducar, el regreso habitual del menú sigue disponible. El borrador solo elimina brotes efímeros nuevos.
4. **Hallazgos:** una tarjeta excepcional nueva ocupa la pantalla para examinarla. No caduca mientras la lees. Continuar devuelve el control; los avisos esperan su turno. La colección y las direcciones siguen guardadas.
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

## Instrumentos · entrega 6

Abre Estilos → Explora instrumentos vivos en el Preview de esta rama, sin parámetros dev. Acerca el cubo a un instrumento: debe responder visual y auditivamente. Entra, sal y vuelve; permanece dentro para escuchar el patrón. Rodea una raíz ácida o un anillo para variar su filtro/modulación. Cada región tiene familias predominantes; no contiene las diez juntas. El escáner explica el gesto y el libro conserva las familias descubiertas. Algunos lugares siguen vacíos.

Si una caja entrega Órbitas detrás, Cinta viajera, Polvo de prismas, Lluvia inversa o Eco de siluetas, camina para escuchar su aporte. Deshacer lo detiene; no hay notas de botón ni nuevos disparos con un menú abierto. Revisa bajo volumen primero y compara con altavoz y auriculares del teléfono: la audición física queda pendiente hasta hacerla realmente.

## Recorrido y VJ · entrega 7

Menú → Tu recorrido. Mira las cuatro experiencias y abre Qué puedes encontrar. Practicar vuelve a las indicaciones pequeñas; Omitir las retira. No debes perder favoritos, tarjetas ni progreso. Con sonido apagado la guía pide activarlo antes de dar el encuentro por aprendido.

Explora buscando brotes luminosos, un pequeño nudo de cintas, telarañas o redes de anillos. Son motivos localizados, no fondos permanentes; queda vacío entre ellos. Se mantienen ocho motivos anteriores. Reducir movimiento congela su deformación. La guía y sus botones no crean audio.

## Avisos, Imán y percusión

Prueba varias interacciones seguidas: los avisos pequeños se agrupan, los relevantes son breves y solo un hallazgo excepcional ocupa la pantalla hasta continuar. Al volver de un menú no deben aparecer mensajes viejos. Renovar un poder no abre otra tarjeta.

Con Imán, acércate a fuentes pequeñas: siguen al cubo y su turno musical dibuja un vínculo. Deben distinguirse sobre la base sin aumentar toda la mezcla. Se añaden Hongo de caja, Hojas de escobillas, Cuenco de barro, Semillas de lluvia, Guijarros de aro y Pétalos de palmas en hábitats afines. El Laboratorio existente permite comparar sus golpes sin esperar un encuentro natural. El toque también responde visualmente con sonido apagado. Revisa volumen bajo y alto en altavoz y auriculares; no consta aceptación física hasta hacerla.
