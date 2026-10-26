# Kubono

Un cubo, un universo que suena. Explora, toca a tiempo y construye tu canción con lo que descubres.

Repositorio [Jaywrkr/WHITEDOT](https://github.com/Jaywrkr/WHITEDOT). Versión del código: **2.3.0-alpha.214**. Cuenta opcional y guardado local. Sin publicación en tiendas.

## Estado de la entrega

Las siete fases E y la limpieza están en `main` desde el 26 de octubre (PR #355). La última revisión del panel es la [sesión 10](docs/panel/sesion-10/informe.md), con el plan P1–P8. Jay crea los PR y hace merge.

Runtime E: `3c9d5dbc`; cierre y evidencias: `7f6374b3`. La limpieza documental conserva exactamente el juego. [Entrega E1–E7](docs/ENTREGA_E.md) · [auditoría y pendientes](docs/panel/candidato-e/informe.md).

[Probar la vista previa E7](https://whitedot-epn5qszxv-jaywrkr-1498s-projects.vercel.app). Vercel confirmó ese despliegue; el CI completo del candidato y la aceptación con personas siguen pendientes.

## Leer antes de continuar

1. [AGENTS.md](AGENTS.md): reglas y límites.
2. [HANDOFF.md](HANDOFF.md): estado exacto, rama y siguientes pasos.
3. [Arquitectura](docs/ARQUITECTURA.md) y [verificación](docs/VERIFICACION.md).
4. [Índice de documentación](docs/README.md): guías vigentes y registros históricos separados.

[Entrada para Claude](HANDOFF_CLAUDE.md) apunta al mismo traspaso; no mantiene un plan paralelo.

## El juego

- **El Viaje:** Camino y cinco capítulos. Aprendes a pegar, encadenar, rodear, bailar y soltar; el cierre abre el Mundo libre.
- **Once lugares:** retos que se abren en orden. ★ por completar, ★★ con75% a tiempo y ★★★ con70% en Maestro. Las estrellas amplían Tu canción.
- **El universo:** exploración procedural, criaturas, hallazgos, tarjetas, favoritos y música electrónica generativa.
- **El Refugio:** espacio voluntario para tus trofeos, objetos y jardín de voces.

[Reglas del mundo](docs/MUNDO.md) · [El Viaje](docs/VIAJE.md) · [Universo y sonido](docs/UNIVERSO.md).

## Ejecutar

```sh
python3 -m http.server 8000
```

Abre `http://localhost:8000`. Cliente estático con módulos ES, Canvas2D y Web Audio; sin compilación ni dependencias npm de ejecución. El nombre WHITEDOT permanece en paquetes y claves para conservar partidas.

```sh
npm run audit:release
npm test
```

Pruebas de navegador/audio y configuración de Playwright en [Verificación](docs/VERIFICACION.md). Vercel sirve la raíz (`outputDirectory: "."`); no crear una carpeta `public` para resolver el despliegue.

## Más

[Cambios](CAMBIOS.md) · [Limpieza del repositorio](docs/LIMPIEZA_REPOSITORIO.md) · [Créditos](CREDITOS.md) · [Android](android/README.md) · [Licencia](LICENSE).
