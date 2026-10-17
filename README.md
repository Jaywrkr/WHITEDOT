# WHITEDOT

Un píxel blanco en un mundo negro: explorar, descubrir y hacer música al viajar. Proyecto de Jay · [Jugar](https://whitedot-inky.vercel.app).

Versión en desarrollo: **2.3.0-alpha.44**. La versión publicada depende del último despliegue de `main`; una rama subida no equivale a producción.

## Jugar y avanzar

- En el Camino, romper diez cristales distintos con pulsos manuales abre el Mundo automáticamente.
- En el Mundo, los cristales requieren 1/2/3 impactos y entregan 1/3/5 chispas. La abundancia cambia por región; el paseo automático no recoge.
- Las chispas se guardan por partida. El agotamiento de cristales persiste durante el día; recargar no repite el pago.
- Al ganar las primeras 20 chispas aparece Saltar en la pantalla principal. Cada salto cuesta 20; el botón permanece visible después de gastar. Menú → Viajar y chispas conserva el regreso gratuito y las apariencias por 40/80/150.
- Tarjetas, colecciones, logros secretos, distancia, títulos y una meta opcional acompañan el viaje. Los avisos breves no detienen el movimiento.

El progreso se conserva en el navegador. Usa los respaldos del juego antes de cambiar de dispositivo u origen. La economía es local, sin intercambio ni validación remota.

## Ejecutar localmente

Requiere Python para servir archivos; el juego usa módulos ES, Canvas 2D y Web Audio, sin instalación npm ni compilación.

```sh
python -m http.server 8000
```

Abrir `http://localhost:8000`. Para cuentas y duetos opcionales, consultar [Servidor y duetos](docs/SERVIDOR_Y_DUETOS.md).

## Documentación

- [AGENTS.md](AGENTS.md): reglas de trabajo y verificación.
- [Arquitectura](docs/ARQUITECTURA.md): mapa técnico y límites actuales.
- [Verificación](docs/VERIFICACION.md): comandos y alcance de las pruebas.
- [CAMBIOS.md](CAMBIOS.md): entregas recientes.
- [CREDITOS.md](CREDITOS.md): autoría, tipografías y licencias.
- [Historial](docs/historial/README.md): planes, cierres y documentación anterior; no constituye trabajo pendiente autorizado.

Código y contenido: [todos los derechos reservados](LICENSE). Las tipografías conservan sus propias licencias.
