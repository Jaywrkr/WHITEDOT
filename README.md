# Kubono

Un cubo, un universo que suena. Tocas a tiempo y el mundo responde con música.

Repositorio `Jaywrkr/WHITEDOT`. El jugador solo ve **Kubono**; el repositorio, el paquete Android y las claves de guardado conservan WHITEDOT para no perder progreso. Versión del código: **2.3.0-alpha.174**, rama `fix/cubo-pequeno`, desde `main` 676ac511. No está publicado en tiendas.

## Empezar aquí

| Si quieres… | Lee |
|---|---|
| Saber dónde está el proyecto y qué toca ahora | [HANDOFF.md](HANDOFF.md) |
| Repetir la auditoría del panel creativo | [docs/PANEL.md](docs/PANEL.md) |
| Trabajar en el código | [AGENTS.md](AGENTS.md) y [Arquitectura](docs/ARQUITECTURA.md) |
| Encontrar cualquier otro documento | [Índice](docs/README.md) |

## El juego

- **El Viaje:** el Camino y cinco capítulos (Llanura, Lago, Bosque, Tormenta, Vacío). Termina en el Refugio, que toca tu canción.
- **El Mundo libre:** un anillo de 11 lugares que se abren en orden. Cada uno da ★, ★★ (75 % a tiempo) y ★★★ (Maestro). Cada estrella suma una capa a la música del mundo.
- **Tu cubo:** piezas que se compran con chispas, que solo se ganan tocando a tiempo.
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
