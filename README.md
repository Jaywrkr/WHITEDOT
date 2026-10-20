# Kubono · repositorio WHITEDOT

Un cubo, un universo y música al viajar. Exploración con una base electrónica, mezclas de otras familias musicales, cristales, rarezas y actividades resueltas con el cubo. Todo lo que ve el jugador dice **Kubono**; el repositorio, el paquete Android y los identificadores internos de guardado y caché conservan WHITEDOT para no perder progreso ni actualizaciones.

Versión del código: **2.3.0-alpha.64**. Estado documental: **20 de octubre de 2026**. Rama de trabajo: `claude/charming-darwin-dvbfc7`, creada desde `main` (`2ff0487`); no equivale a main integrado ni a publicación en tiendas. El estado del sitio existente no se verificó en esta revisión.

## Empezar aquí

- **[Traspaso a Claude](HANDOFF_CLAUDE.md):** estado real, evidencia, pendientes y puntos de revisión.
- **[Índice de documentación](docs/README.md):** qué archivo consultar para cada tema.
- [Plan de lanzamiento](docs/PLAN_LANZAMIENTO.md): decisiones aprobadas y entregables abiertos.
- [AGENTS.md](AGENTS.md): reglas para trabajar en este repositorio.

## Juego y cuenta actuales

- Camino de diez cristales rotos para entrar al Mundo; minería, fragmentos, saltos de pago y regreso gratuito. Saltar se muestra al acumular 20 chispas ganadas, cuesta 20 y permanece visible tras gastar. Apariencias por 40/80/150 chispas.
- Seis esculturas raras, veinte hallazgos, treinta tipos de actividad por semilla y diez encuentros traviesos. Tarjetas, colecciones y logros acompañan el viaje. [Catálogo y recompensas](docs/HALLAZGOS_Y_ACTIVIDADES.md).
- Cuenta obligatoria por correo/contraseña, sesión persistente y progreso automático entre dispositivos. Sin invitado, demo ni botones normales de guardar/respaldar. Solo las divergencias reales requieren elegir una copia. Eliminar la cuenta borra las copias online y la partida de esa cuenta en el dispositivo que lo pide.
- Tras el primer acceso puede continuar offline con la sesión y partida locales; la sincronización necesita red y no garantiza el último cambio si el sistema cierra el proceso antes de enviarlo. La cuenta no concede compras compartidas entre tiendas.
- Música generada con Web Audio, gráficos Canvas y módulos ES nativos. Sin dependencias npm del cliente ni compilación del juego web. Los duetos Python son históricos y no forman parte del lanzamiento.

## Ejecutar localmente

Desde la raíz, con Python:

```sh
python -m http.server 8000
```

Abrir `http://localhost:8000`. El código usa Kubono Dev: se necesita una cuenta existente o alta confirmada, no hay bypass de acceso. La recuperación usa el destino `recoveryUrl` de `src/cloud-config.js`, hoy el [callback local](docs/CUENTA_Y_RESPALDO.md); la página pública y su valor final están pendientes. No subir contraseñas, sesiones, copias privadas ni claves de firma al repositorio.

[Android de prueba](android/README.md) contiene el empaquetado, instalación, firma estable y evidencia del emulador. No hay todavía AAB de tienda, proyecto iOS ni builds desktop aceptados.

## Trabajo y licencia

El trabajo de Supabase quedó **detenido por petición de Jay** para esta revisión documental. Su limpieza de auditoría de siete días sigue preparada pero no aplicada; no continuarla por leer un plan. No publicar, contratar, comprar, crear PR ni integrar main sin autorización. Ver [verificación](docs/VERIFICACION.md) para reutilizar evidencia y ejecutar solo comprobaciones necesarias.

[Cambios recientes](CAMBIOS.md) · [Créditos](CREDITOS.md) · [Historial](docs/historial/README.md).
Código y contenido: [todos los derechos reservados](LICENSE). Las tipografías conservan sus propias licencias.
