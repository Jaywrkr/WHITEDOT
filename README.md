# Kubono

Un cubo, un universo que suena. Explora, toca a tiempo y construye tu canción con lo que descubres.

Repositorio [Jaywrkr/WHITEDOT](https://github.com/Jaywrkr/WHITEDOT). Versión del código: **2.3.0-alpha.229**. Cuenta opcional y guardado local. Sin publicación en tiendas.

## Estado de la entrega

`main` lleva E1–E7, P1–P8 (sesión 10 del panel) y Q1–Q7 (sesión 11), todo con CI completo en verde. Q7 rehízo los dos finales en dub techno; Jay oyó y aprobó los renders.

**Ciclo de diseño cerrado (27 de octubre).** Siguiente: publicar en web y Android, en español e inglés, sin cuenta ni nube. [Plan de salida](docs/PLAN_LANZAMIENTO.md#salida-web-y-android).

Última revisión del panel: [sesión 11](docs/panel/sesion-11/informe.md), media 6,7 sobre alpha.215. Nadie ha puntuado alpha.222. Vercel publica una vista previa por rama; no hay pruebas con personas ni escucha en teléfono.

## Leer antes de continuar

1. [AGENTS.md](AGENTS.md): reglas y límites.
2. [HANDOFF.md](HANDOFF.md): estado exacto, rama y siguientes pasos.
3. [Arquitectura](docs/ARQUITECTURA.md) y [verificación](docs/VERIFICACION.md).
4. [Índice de documentación](docs/README.md): guías vigentes y registros históricos separados.
5. [Plan de salida web y Android](docs/PLAN_LANZAMIENTO.md#salida-web-y-android): fases L1–L6 y lo que hace Jay.

[Entrada para Claude](HANDOFF_CLAUDE.md) apunta al mismo traspaso; no mantiene un plan paralelo.

## El juego

- **El Viaje:** Camino y cinco capítulos. Aprendes a pegar, encadenar, rodear, bailar y soltar; el cierre abre el Mundo libre.
- **Once lugares:** retos que se abren en orden. ★ por completar, ★★ con 75 % a tiempo y ★★★ con 70 % en Maestro. Las estrellas amplían Tu canción.
- **El universo:** exploración procedural, criaturas, hallazgos, tarjetas, favoritos y música electrónica generativa.
- **El Refugio:** espacio voluntario para tus trofeos, objetos y jardín de voces.

[Reglas del mundo](docs/MUNDO.md) · [El Viaje](docs/VIAJE.md) · [Universo y sonido](docs/UNIVERSO.md).

## Ejecutar

```sh
python3 -m http.server 8000
```

Abre `http://localhost:8000`. Cliente estático con módulos ES, Canvas 2D y Web Audio; sin compilación ni dependencias npm de ejecución. El nombre WHITEDOT permanece en paquetes y claves para conservar partidas.

```sh
npm run audit:release
npm test
```

Pruebas de navegador/audio y configuración de Playwright en [Verificación](docs/VERIFICACION.md). Vercel sirve la raíz (`outputDirectory: "."`); no crear una carpeta `public` para resolver el despliegue.

## Más

[Cambios](CAMBIOS.md) · [Limpieza del repositorio](docs/LIMPIEZA_REPOSITORIO.md) · [Créditos](CREDITOS.md) · [Android](android/README.md) · [Licencia](LICENSE).
