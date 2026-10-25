# Expediente · cuarta sesión de Kubono

## Instantánea y petición

Código **2.3.0-alpha.174**, rama de juego `fix/cubo-pequeno`, commit `04ae8bdd`, desde main `676ac511` (alpha.173, PR #352). Auditoría en `audit/panel-4-cierre`, dependiente de la rama del cubo. Módulos ES nativos, Canvas 2D, Web Audio; 312 módulos y 240 suites Node.

Jay autorizó avanzar el cubo pequeño y completar la auditoría antes de decidir las acciones. Añadió tres condiciones: el cierre de nivel debe salir de la música presente y quedar en Tu canción; la UI debe sentirse de producción; integrar economía, juego, mundo y música antes de ampliar contenido. Pide un ciclo que no olvide pendientes y permita reevaluar.

## Qué cambió desde el panel 3

I1–I6 ya están en main: narrador limitado, color recuperado y portal visible, acento programado con la nota, final con tus notas/ritmo/escala, umbrales 75/70 %, festival completo y menú de seis entradas.

El cubo de la I2 fue rechazado. `04ae8bdd` elimina la ampliación: 6–12 px de base, con mínimo existente de 10 px para las caras; los pulsos y poderes conservan su efecto. No cambia física, música, progreso ni posiciones. Falta aceptación de tamaño en teléfono.

La documentación pasó a guías por tema; los planes históricos no autorizan trabajo nuevo. Supabase sigue en pausa.

## Evidencia reunida en esta sesión

- Capturas normales: dieciséis a 390×844, sin `body.dev`, con audio iniciado por el script. [Manifiesto](capturas/manifest.json). Son fixtures, no juego humano.
- UI: sesenta estados, cuatro tamaños. Se espera el Mundo y se activa la vista libre como hace el final real. Se cuentan áreas clicables de etiquetas y se excluyen descendientes ocultos; la medición anterior a esos ajustes se descartó. [Datos](evidencia/ui-medidas.json).
- 240 suites Node, auditoría de release, caras del cubo y tacto real de navegador aprobados. No suite completa de navegador/audio local.
- Once cierres offline aprobados contra su base de prueba: pico máximo 0,573. [Datos](evidencia/cierres-audio.json).
- [Progresión](evidencia/progresion.json): 60 % y sin sonido quedan con once estrellas a dos horas. 75 % llega a 28; 90 % a 33 en 94,1 min.
- [Contratos](evidencia/contratos.json): Cristales y quinta fija fuera de escala en contextos válidos; éxito de ronda sin guardar durable; lectura de formato futuro que lanza excepción; techo visual de 250 ms.
- [CI base](evidencia/ci-base.json): logic y audio verdes; browser 1/3/4 rojos en run 40139955994. Logs bloqueados por proxy; causa individual aún desconocida.

## Lectura de las capturas

[Contactos de mundo](capturas/contacto.png) y [UI](capturas/ui-contacto.png). El fondo permanece negro y el cubo pequeño; los lugares tienen formas distintas y el color recuperado se ve en el anillo. La UI medida no se desborda. La guía y los nombres todavía mezclan rutas anteriores; la hoja destaca 33 estrellas frente a once lugares.

El Prototipo no aparece en el origen normal. Laboratorio en la guía es una práctica útil; no se clasifica como panel técnico por coincidir el nombre. `deploy sin registrar` procede de la copia local sin sellar, no de un Vercel observado.

## Qué no se puede concluir

No se oyó la mezcla como una persona ni se midió teléfono físico. Los datos de guardado usan un fallo simulado; no se provocó cuota real ni se tocó una cuenta. El modelo no predice abandono validado ni ochenta minutos de música idéntica: tus notas y el mundo pueden variar sin otra estrella.

No se verificaron despliegue ni tiendas, no se reconfiguró Supabase, no se cambió el motor musical y no se implementó J1–J7.

## Reproducción

```sh
OUT=/tmp/kubono-panel-4/capturas CHROMIUM_PATH=/usr/bin/chromium python3 scripts/panel-capture.py
OUT=/tmp/kubono-panel-4 CHROMIUM_PATH=/usr/bin/chromium python3 scripts/panel-measures.py
node scripts/play-curve.mjs --json
node docs/panel/sesion-4/contratos.mjs
CHROMIUM_PATH=/usr/bin/chromium python3 tests/player_touch_smoke.py
CHROMIUM_PATH=/usr/bin/chromium python3 tests/victory_mix.py
```

El último comando actualiza su informe habitual; esta sesión conservó la medición en evidencia y restauró el informe previo sin cambiar juego ni prueba. El hostname local de auditoría se resuelve a 127.0.0.1 y permite comprobar el gate de producción sin exponer servicios.

Cada hallazgo está en [seguimiento.json](seguimiento.json), con criterio y fase. El [informe](informe.md) contiene la decisión consolidada; los diez análisis no son opiniones reales de los autores de referencia.
