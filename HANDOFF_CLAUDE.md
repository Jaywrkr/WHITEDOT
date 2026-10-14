> **Continuidad 2.0:** fase 0 en `v2/f0-coleccion`, desde `main c8d286e`. Reglas y estado vigente en [PLAN_2.0.md](PLAN_2.0.md) y [CAMBIOS.md](CAMBIOS.md). Las referencias alpha que siguen son históricas.
>
> **Colección:** [src/rewards-model.js](src/rewards-model.js) define catálogo, rarezas, migración y concesión idempotente. [src/rewards.js](src/rewards.js) integra `awardReward`, `recordRewardSource`, `rewardPieces`, `ownsReward` y resumen de Bitácora. `progress.js` reconcilia al cargar/cambiar ámbito/guardar; el guardado conserva fechas y piezas futuras. Los 13 cosméticos salen de `cube-model.js`; `data.js` comparte sus colores. [scripts/rewards-audit.mjs](scripts/rewards-audit.mjs) estima ritmo bajo supuestos explícitos, sin telemetría ni promesa de rareza.

> **Trabajo actual: [PLAN_2.0.md](PLAN_2.0.md)** (fases de la 2.0) y reglas de agentes en [AGENTS.md](AGENTS.md).

> **Actualización 14 oct · cierre 1.1.0 con estilo J.** Las ramas `cierre/f1`→`f6` (ver [CAMBIOS.md](CAMBIOS.md)) parten de `main` 959e95e, que ya integra las diez fases. Añaden la capa `styles/estilo-j.css`, textos J, licencia, Open Graph, sets 4:5, sello de deploy en Vercel, ocultan "Cuenta y duetos" sin servidor y estabilizan tres pruebas de navegador. Producción: https://whitedot-inky.vercel.app (Vercel estático; el servidor opcional no corre ahí). Lo que sigue es la [aceptación](ACEPTACION_V1.md). El resto de este documento describe el estado alpha.10.

# Handoff para Claude · Universo vivo

Estado del juego: **1.1.0-alpha.10**. Esta actualización modifica documentación; conserva el código y la versión de la entrega probada. Leer este documento primero: los estados RC y los planes antiguos se conservan como historia y no describen el alcance actual.

## 1. Desde qué rama continuar

- **Rama de este handoff:** `docs/claude-handoff-universe-alpha`, hija de la fase 10; incluye las diez fases y añade esta documentación.
- **Última entrega de código:** `feat/universe-10-server-duets-validation`, commit `57fb5d2a90970edcf9d29cb046dd80e6b16e86b3`.
- **Main remoto comprobado al preparar este handoff:** `704ae071a38785fe1b3af534d8e94d9c98d36d43`. Las diez fases todavía no estaban integradas en main. Volver a comprobar GitHub antes de trabajar: Jay puede haber hecho merge después.
- Flujo acordado: rama nueva, commit y push; Jay revisa, crea los PR y hace merge. Agrupar cambios relacionados para evitar decenas de ramas pequeñas. La petición de este turno es dejar documentación para continuar en Claude.

Si main sigue en esa revisión, partir de esta rama de documentación para conservar todo lo nuevo. No partir de un main antiguo y recrear funcionalidades ya implementadas. No resetear cambios de Jay ni reescribir las ramas publicadas.

[RAMAS.md](docs/historial/RAMAS.md) contiene el orden. Merge normal que conserve los commits: 01 → 10 → este handoff. Evitar squash/rebase de los padres mientras existan ramas dependientes. Las ramas archivadas de entregas anteriores no se vuelven a integrar. El plan `docs/universe-150-phases` ya está incluido en la fase 01.

## 2. Qué se entregó realmente

| Sistema | Estado actual |
|---|---|
| Base procedural | 11 biomas, 33 hábitats y 52 géneros conservados; semillas y posiciones antiguas compatibles |
| Contenido nuevo | 28 linajes: 10 flora, 10 fauna, 8 construcciones; aparición natural, gestos y respuestas musicales |
| Registro y laboratorio | 109 familias registrables, 91 entradas del laboratorio, 49 tipos de tarjeta |
| Música | Gramática regional, swing, articulación, bajos por género, capítulos de radio, acordes con conducción, arpegios, timbres y presupuesto ambiental compartido |
| Vida | Personalidades individuales, actividad, crecimiento visual, ciclos, relaciones por proximidad y transmisión local de frases |
| Arquitectura | Gestos de quietud, órbita, alineación y recorrido; recuerdos persistentes, 12 estudios originales y narrativa opcional del Camino |
| Voz | Texto contextual opcional: discreta, guía o poética; recuerda aprendizajes y guarda mensajes completos |
| Cajas y mascotas | Beneficios nuevos temporales con reloj de juego; compañía de caja temporal; mascotas permanentes ya ganadas conservadas |
| Exploración | Regiones Gran territorio/Inmenso, microhábitats, tres capas existentes, paseo automático con intención y regreso entre semillas |
| Hallazgos | Retratos propios, contexto, observaciones, filtros de colección, exportación PNG y códigos de lugar |
| Servicio opcional | Cuentas/invitados, copias con revisión y conflicto, salas privadas de dos personas y construcciones compartidas; experimental |

Las diez ramas tienen una implementación integrada. Eso no significa que se hayan terminado todas las ampliaciones de las 150 ideas: **105 base jugable, 40 parciales, 2 pendientes y 3 externas**. La lista exacta, con alcance y fuentes para cada idea, está en [COBERTURA_150_UNIVERSO.md](COBERTURA_150_UNIVERSO.md). No marcar los parciales como completos al actualizar los documentos.

## 3. Dirección creativa que debe conservarse

- Fondo negro, espacio y silencio visual. Cubo blanco por defecto; personalización ganada. Color principalmente en objetos, encuentros y huellas musicales.
- Línea gráfica sencilla, natural y electrónica. Mantener objetos grandes contenidos; evitar paneles permanentes, teclados cuadrados y efectos que tapen la exploración.
- La interacción normal sucede **con el cubo**: caminar, tocar, permanecer, rodear, empujar. El dedo mueve el cubo; `?dedo=1` y automatización conservan un modo de pruebas heredado.
- UI silenciosa: menús, botones, autenticación, tarjetas y exportaciones no generan sonidos musicales.
- Música electrónica cálida, agradable y nítida. Alternar graves, medios, percusión, espacio y melodía según género y ambiente; no resolver toda interacción con una nota aguda. Preservar la lluvia y el viento suave.
- La música debe evolucionar aunque la persona permanezca quieta. Más elementos deben aportar funciones distintas y pausas, sin aumentar continuamente la densidad.
- Fijar sonidos permanece desactivado por defecto. Conservar borrado/sustitución de ecos y explicar sus gestos con claridad.
- Hallazgos raros por condiciones reales, sin inflar probabilidades ni confundir familias con ejemplares. Culturas diversas como inspiración documentada; no afirmar autenticidad de una interpretación sin investigación.
- Todo debe sentirse unido al Camino, la atención, crear, perseverar y compartir. Primero ordenar y mejorar lo existente antes de añadir capas de controles.

## 4. Mapa técnico para continuar

Aplicación estática de módulos JS nativos, Canvas y Web Audio. No requiere instalar dependencias npm ni compilar para ejecutarse. Node >=18 para pruebas; Python para servidor y pruebas de navegador. La aceptación de navegador usa Playwright y Chromium.

| Archivos | Responsabilidad y precaución |
|---|---|
| [src/main.js](src/main.js) | Composición de sistemas y runtime. Inicialización única; getters no redefinibles. No exponer runtime en producción; las pruebas lo instrumentan al servir el módulo |
| [src/world-identity.js](src/world-identity.js), [src/seeds.js](src/seeds.js) | Identidad, versiones, perfiles, separación de partidas y retorno WD1. Guardar antes de salir y preservar coordenadas/capa exactas |
| [src/living-catalog.js](src/living-catalog.js), [src/living.js](src/living.js) | Catálogo/distribución y comportamiento integrado; semillas independientes `living:*:v1`, caché de 48 sectores, escucha y presupuesto ambiental |
| [src/living-art.js](src/living-art.js), [src/living-portraits.js](src/living-portraits.js) | Glifos y retratos originales de los 28 linajes |
| [src/living-synthesis.js](src/living-synthesis.js), [src/living-voicing.js](src/living-voicing.js), [src/instruments.js](src/instruments.js) | Timbres, articulaciones y acordes. Mantener niveles, registro y cachés acotados; no introducir notas fuera de la armonía por ratios mayores fijos |
| [src/living-composition.js](src/living-composition.js), [src/radio.js](src/radio.js) | Capítulos, bancos y variación. En duetos, frase y armonía derivan del reloj de sala para admitir entrada tardía |
| [src/living-behavior.js](src/living-behavior.js), [src/living-ecology.js](src/living-ecology.js), [src/living-terrain.js](src/living-terrain.js) | Movimiento, relaciones/ciclos y microhábitats. Movimiento nuevo local y acotado; no es simulación de poblaciones completa |
| [src/living-buildings.js](src/living-buildings.js), [src/living-studies.js](src/living-studies.js) | Construcciones, gestos, recuerdos y estudios culturales/históricos originales |
| [src/living-state.js](src/living-state.js) | Normalizar importaciones/guardados y reiniciar extensiones al cambiar ámbito; no filtrar progreso entre semillas |
| [src/power-clock.js](src/power-clock.js), [src/cajas.js](src/cajas.js), [src/voice-guide.js](src/voice-guide.js) | Tiempo activo, beneficios y Voz; pausar con herramientas, paneles, pestaña oculta y fuera del mundo |
| [src/living-discoveries.js](src/living-discoveries.js), [src/rare-cards.js](src/rare-cards.js), [src/favorites.js](src/favorites.js) | Registro real, contexto, tarjetas, rutas y favoritos |
| [src/connection.js](src/connection.js), [src/duet-model.js](src/duet-model.js), [server/app.py](server/app.py) | Cliente/API opcionales, sincronía, reparto de voces, cuentas y copias |
| [styles/interface.css](styles/interface.css), [src/accessibility.js](src/accessibility.js), [sw.js](sw.js) | Interfaz común, foco/cierres y shell offline. Todo módulo nuevo debe precachearse una sola vez |

No consumir RNG antiguo para añadir contenido: cambia posiciones existentes. Versionar los flujos de generación cuando corresponda. Mantener el control de audio también en callbacks programados, para que abrir UI no deje disparar una nota pendiente. El shell offline tuvo un fallo por un asset duplicado: ya corregido y auditado; no duplicar rutas al ampliar el precache.

## 5. Tamaño, coordenadas y variedad: cifras que sí podemos afirmar

Los tamaños son lados de **región**, no el borde total del mapa:

| Perfil | Unidades por lado de región |
|---|---|
| Clásico | 3.600 |
| Amplio | 7.200 en generación 1; 10.800 en generación 2 |
| Vasto | 18.000 |
| Gran territorio | 50.400 |
| Inmenso | 100.800 |

Tres capas actuales: superficie, bajo y cielo. Direcciones de magnitud menor de 10^12 por eje. Semilla + versiones de generador/catálogo/layout + tamaño + capa + coordenadas permiten guardar y volver con WD1; los favoritos ya permiten abrir lugares de otra semilla. Volver al punto no garantiza que un animal móvil o evento temporal siga allí.

[La muestra registrada](scripts/living-universe-validation.json) cubre 10.000 regiones en 20 semillas: 10.000 recetas estructurales distintas; 6.327 regiones terrestres con 6.327 firmas musicales distintas; aparecen los 52 géneros, 11 biomas y 28 linajes. **No es un conteo total de mundos ni prueba de 10.000 canciones perceptiblemente diferentes.** No extrapolar a millones ni multiplicar variables correlacionadas. La variedad que importa todavía debe comprobarse escuchando y jugando.

## 6. Pruebas y cómo reproducirlas

La entrega de código dejó **71 suites Node, 49 recorridos de navegador más offline y 253 renders de audio en 9 programas** aprobados. Audio a 44,1/48 kHz, pico máximo observado 0,9576108456 y cero muestras calientes. HTTP/SQLite y duetos entre dos navegadores también comprobados. [Evidencia consolidada](scripts/universe-phase-validation.json), [audio de los linajes](scripts/living-audio-validation.json).

Desde la raíz:

```sh
npm test
npm run audit:release
npm run test:browser
npm run test:audio
python3 tests/server_api.py
python3 tests/duet_smoke.py
node scripts/living-universe-audit.mjs
```

Consultar [PROBAR_UNIVERSO_VIVO.md](PROBAR_UNIVERSO_VIVO.md) para los gestos, laboratorio y pruebas manuales. Las pruebas de API usan datos temporales. La auditoría de integridad comprobó 123 módulos, 263 IDs de HTML, 287 imports estáticos y 135 assets únicos del shell; detecta rutas/enlaces rotos y duplicados offline. Las cifras registran la entrega, no sustituyen ejecutar los checks afectados tras cambiar código.

Estas métricas comprueban regresiones, audio finito y margen de nivel. **No certifican gusto musical, masterización profesional, batería, latencia física, rendimiento en teléfonos reales o preparación de producción.** La actualización de este handoff solo requiere auditoría documental e integridad; no atribuirle una nueva ejecución de toda la suite.

## 7. Pendientes y orden de continuación

1. **Aceptación del juego actual.** Probar encuentros naturales y laboratorio; escuchar géneros contrastantes, quietud larga, zonas densas, percusión, registros bajos y duetos. Registrar repetición real, acumulación de agudos y ruido visual con casos reproducibles. Quitar/afinar lo que distraiga antes de sumar contenido.
2. **Interacción y orientación.** Mejor anticipación por especie (idea 5), recorrido natural corto (7), deshacer general (3) y comparador de variantes/densidades (25). Afinar gestos continuos de flores/membranas y edición de conexiones; mantener movilidad con una mano y UI silenciosa.
3. **Profundidad musical.** Transiciones más largas (66), tensión/resolución (74), conducción de voces antiguas además de los acordes nuevos (75) y relación continua de viento/agua con swing (107). Revisar percepción de género sin renumerar los 52 IDs existentes.
4. **Ecología y territorios.** Redes extensas, colonización persistente, poblaciones, migraciones, bordes híbridos, jardines, rutas costeras/cielo y constelación de lugares. La fauna nueva se mueve localmente; los microhábitats dibujados no son aún rutas físicas o archipiélagos navegables.
5. **Arquitectura, búsqueda e historia.** Espacios acústicos/residentes, puentes que abran rutas reales, laberintos ópticos, expediciones ecológicas y colecciones instrumentales/culturales. Los espejos y vidrios previos funcionan; la arboleda nueva no es todavía un laberinto completo. Investigar y citar referencias antes de profundizar las culturas.
6. **Ideas aún no iniciadas.** 101: más alturas que las tres capas actuales. 114: réplicas/partituras históricas funcionales y documentadas. Los 12 estudios originales actuales no cumplen por sí solos esa segunda propuesta.
7. **Servicio y publicación.** Aceptación física en iPhone/Android (141), alojamiento HTTPS y deploy real (143), escucha/playtest y publicación gradual (150). Cuentas, copias, salas y edición compartida tienen bases, pero la operación pública y la calibración por Internet siguen parciales (144–149).

El detalle de los 40 parciales está en la matriz; esta priorización agrupa trabajo y no elimina propuestas. La próxima rama debe responder a la instrucción nueva de Jay; este handoff no exige implementar todos los pendientes antes de mostrarle mejoras concretas.

## 8. Servicio, despliegue y límites operativos

```sh
python3 server/app.py --host 127.0.0.1 --port 8080
```

Servidor opcional Python estándar/SQLite, mismo origen. Consultar [SERVIDOR_Y_DUETOS.md](SERVIDOR_Y_DUETOS.md). Progreso local/offline sigue disponible sin cuentas. SQLite en `server/data` está excluido de Git; no subir bases, sesiones ni credenciales.

Cuentas con scrypt, sesiones HttpOnly/SameSite, origen/CSRF y límites. Copias con revisión y conflicto sin sobrescribir. Salas privadas de dos voces; audio sintetizado localmente, reloj/armonía compartidos, invitación, presencia y construcciones abiertas persistentes. Salas de hasta dos horas, presencia de 30 segundos, ámbito ±5.000 unidades. Salas en RAM de un proceso: un reinicio las corta; cuentas/copias/marcas quedan en SQLite.

Faltan recuperación/borrado de cuentas, operación/respaldos/monitorización, revisión de abuso y escalado, dispositivos/redes reales y host público. No hay servidor público desplegado ni sesión de escucha física realizada. El borrador guardado de configuración del entorno Codex tampoco publica el juego.

[src/release-info.js](src/release-info.js) conserva `deployedAt: null` y `revision: null`. Registrar revisión y hora real con [scripts/stamp-deploy.mjs](scripts/stamp-deploy.mjs) **sobre el artefacto publicado** cuando haya deploy. Un commit, una prueba o este handoff no generan una fecha de publicación.

## 9. Lectura recomendada y actualización al devolverlo

1. Este handoff y [ESTADO_ACTUAL.md](docs/historial/ESTADO_ACTUAL.md).
2. [PROBAR_UNIVERSO_VIVO.md](PROBAR_UNIVERSO_VIVO.md) y [ENTREGA_UNIVERSO_VIVO.md](docs/historial/ENTREGA_UNIVERSO_VIVO.md).
3. [COBERTURA_150_UNIVERSO.md](COBERTURA_150_UNIVERSO.md), [PENDIENTES.md](docs/historial/PENDIENTES.md) y [SERVIDOR_Y_DUETOS.md](SERVIDOR_Y_DUETOS.md).
4. [UNIVERSO_150_IDEAS_FASES.md](docs/historial/UNIVERSO_150_IDEAS_FASES.md) como visión de diseño; [CUBO_Y_EXPANSION.md](docs/historial/CUBO_Y_EXPANSION.md) como contexto heredado de Claude. Sus estados originales son históricos.

Al terminar en Claude, actualizar estado, pendientes, matriz afectada, guía de prueba, entrega/ramas y handoff. Anotar rama/commit, comportamiento cambiado, migraciones, pruebas realmente ejecutadas y pendientes. Mantener evidencias históricas separadas de las nuevas; no declarar main actualizado ni un deploy sin comprobarlo.
