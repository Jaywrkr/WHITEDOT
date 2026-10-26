# Kubono

Un cubo, un universo que suena. Tocas a tiempo y el mundo responde con música.

Repositorio `Jaywrkr/WHITEDOT`. El jugador solo ve **Kubono**; el repositorio, el paquete Android y las claves de guardado conservan WHITEDOT para no perder progreso. Versión del código: **2.3.0-alpha.200**, fases N en ramas encadenadas ([estado](HANDOFF.md)). No está publicado en tiendas.

## Empezar aquí

| Si quieres… | Lee |
|---|---|
| Saber dónde está el proyecto y qué toca ahora | [HANDOFF.md](HANDOFF.md) |
| Ver las fases N | [Entrega](docs/ENTREGA_N.md) |
| Revisar el candidato actual | [Cierre N](docs/panel/candidato-n/informe.md) y [dictamen ciego](docs/panel/candidato-n/revision-ciega.md) |
| Ver el cierre conservando música y mundos | [Entrega K1–K6](docs/CIERRE_K.md) y [auditoría](docs/panel/sesion-6/informe.md) |
| Repetir la auditoría del panel creativo | [docs/PANEL.md](docs/PANEL.md) |
| Trabajar en el código | [AGENTS.md](AGENTS.md) y [Arquitectura](docs/ARQUITECTURA.md) |
| Encontrar cualquier otro documento | [Índice](docs/README.md) |

## El juego

- **El Viaje:** el Camino y cinco capítulos (Llanura, Lago, Bosque, Tormenta, Vacío). Su cierre recuerda tu canción y te deja en el Mundo libre. El Refugio queda disponible.
- **El Mundo libre:** un anillo de 11 lugares que se abren en orden. Cada uno da ★, ★★ (75 % a tiempo) y ★★★ (Maestro). Las estrellas amplían las capas de tu canción.
- **Tu cubo:** piezas que se compran con chispas: recoger da valor base y tocar a tiempo da más.
- Cuenta opcional: se juega al instante con guardado local.

Diseño completo: [El mundo](docs/MUNDO.md) y [El Viaje](docs/VIAJE.md).

## Ejecutar

```sh
python3 -m http.server 8000
```

Abre `http://localhost:8000`. No hay compilación ni dependencias npm: módulos ES, Canvas 2D y Web Audio. Pruebas: `npm test` (Node) y los recorridos de `tests/` ([Verificación](docs/VERIFICACION.md)).

Para empezar una partida nueva: menú → Ajustes → **Empezar de cero** (dos toques; se guarda una copia).

## Más

[Cambios](CAMBIOS.md) · [Créditos](CREDITOS.md) · [Android](android/README.md) · [Licencia](LICENSE): todos los derechos reservados; las tipografías conservan sus licencias.
