# WHITEDOT

Un píxel blanco en un mundo negro: explorar, descubrir y hacer música al viajar. Proyecto de Jay · [Jugar](https://whitedot-inky.vercel.app).

Versión en desarrollo: **2.3.0-alpha.55**. La versión publicada depende del último despliegue de `main`; una rama subida no equivale a producción.

## Jugar y avanzar

- En el Camino, romper diez cristales distintos con pulsos manuales abre el Mundo automáticamente.
- En el Mundo, los cristales requieren 1/2/3 impactos y entregan 1/3/5 chispas. Algunos corren al primer golpe; romper uno puede golpear a sus vecinos. La abundancia cambia por región; el paseo automático no recoge.
- Los fragmentos tienen centro blanco y halo dorado. Algunos son cian, escapan brevemente y añaden 3 chispas al valor normal. Recogerlos guarda cada pago por separado.
- Las chispas se guardan por partida. El agotamiento de cristales persiste durante el día; recargar no repite el pago.
- Al ganar las primeras 20 chispas aparece Saltar en la pantalla principal. Cada salto cuesta 20; el botón permanece visible después de gastar. Menú → Viajar y chispas conserva el regreso gratuito y las apariencias por 40/80/150.
- Seis tótems de color, ahora 16 veces más raros, celebran su primer despertar con un espectáculo propio. Aparecen solos o en grupos de dos o tres, en las tres capas. Despiértalos con pulsos, acompaña su esfera o sigue su orientación. Gana su tarjeta y 2 chispas por lugar al día.
- Menú → Guía de juego permite consultar controles, descubrimientos y guardado, o repetir las ayudas. Viajar y chispas reúne compras y metas opcionales.
- Viaje musical distingue seis familias ampliadas con patrones propios: funk/disco, dub/reggae, jazz/bossa, afro/latino, folk/cuerdas y ambient/cámara. Se pueden buscar por su nombre.
- Veinte hallazgos excepcionales dan tarjetas y regalos visuales permanentes para Tu cubo, con frases musicales originales.
- Treinta tipos de actividad aparecen en portales raros, con versiones por semilla. Se resuelven moviendo el cubo; la puerta permite salir. Cada lugar completado entrega 5 chispas una sola vez.
- Ajustes permite ocultar los textos de la exploración; los menús y avisos de guardado siguen disponibles.
- Después de los diez cristales puedes volver al Camino y seguir rompiendo sin sumar.
- Una pista dorada discreta anticipa travesuras cercanas sin revelar su solución. Diez travesuras ocasionales responden al movimiento del cubo: imitadores, lluvia ascendente, sombras, público y otras sorpresas. Dan 3 chispas una sola vez por lugar.
- 120 logros nuevos conectan estas situaciones con actividades, hallazgos y esculturas, con avisos breves y silenciosos agrupados; la Bitácora marca los logros sin consultar.
- Tarjetas, colecciones, logros secretos, distancia, títulos y una meta opcional acompañan el viaje. Los avisos breves no detienen el movimiento.

El progreso se conserva en el navegador. Usa los respaldos del juego antes de cambiar de dispositivo u origen. La economía es local, sin intercambio ni validación remota.

## Ejecutar localmente

Requiere Python para servir archivos; el juego usa módulos ES, Canvas 2D y Web Audio, sin instalación npm ni compilación.

```sh
python -m http.server 8000
```

Abrir `http://localhost:8000`. Para cuenta opcional y respaldo en desarrollo, consultar [Cuenta y respaldo](docs/CUENTA_Y_RESPALDO.md). El backend de [servidor y duetos](docs/SERVIDOR_Y_DUETOS.md) queda como prototipo histórico fuera de este lanzamiento.

## Documentación

- [Plan de lanzamiento](docs/PLAN_LANZAMIENTO.md): calendario propuesto, marca, precio, tiendas, comunicación y próximas decisiones.
- [AGENTS.md](AGENTS.md): reglas de trabajo y verificación.
- [Arquitectura](docs/ARQUITECTURA.md): mapa técnico y límites actuales.
- [Hallazgos y actividades](docs/HALLAZGOS_Y_ACTIVIDADES.md): catálogo actual, gestos y recompensas.
- [Verificación](docs/VERIFICACION.md): comandos y alcance de las pruebas.
- [CAMBIOS.md](CAMBIOS.md): entregas recientes.
- [CREDITOS.md](CREDITOS.md): autoría, tipografías y licencias.
- [Historial](docs/historial/README.md): planes, cierres y documentación anterior; no constituye trabajo pendiente autorizado.

Código y contenido: [todos los derechos reservados](LICENSE). Las tipografías conservan sus propias licencias.
