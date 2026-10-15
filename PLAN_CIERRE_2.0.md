# Cierre 2.0 · diez fases

Orden acordado con Jay después de M1. Consolida los planes anteriores: no son diez fases más encima de cada lista histórica. Jay autoriza implementar F1–F10 consecutivamente, con commit y push por fase. Jay crea PR y merge. No publicar main desde estas ramas.

## Estado y ramas

| Fase | Rama | Estado |
|---|---|---|
| 1 · Identidades completas de mundos | `feat/cierre-f1-identidades` | Implementada y probada; lista para PR de Jay; aceptación física pendiente |
| 2 · Formas y especies generadas | `feat/cierre-f2-especies` | Implementada y probada; lista para PR de Jay; aceptación física pendiente |
| 3 · Ecosistemas y territorios vivos | `feat/cierre-f3-ecosistemas` | Implementada y probada; lista para PR de Jay; aceptación física pendiente |
| 4 · Instrumentos y síntesis modular | `feat/cierre-f4-sintesis` | Implementada y probada; lista para PR de Jay; aceptación física pendiente |
| 5 · Composición, géneros y mezclas | `feat/cierre-f5-composicion` | Implementada y probada; lista para PR de Jay; aceptación física pendiente |
| 6 · Interacciones que hacen música | `feat/cierre-f6-interacciones` | Implementada y probada; lista para PR de Jay; aceptación física pendiente |
| 7 · Exploración y hallazgos con sentido | `feat/cierre-f7-hallazgos` | Implementada y probada; lista para PR de Jay; aceptación física pendiente |
| 8 · Memoria, regreso y vínculos | `feat/cierre-f8-memoria` | Implementada y probada; lista para PR de Jay; aceptación física pendiente |
| 9 · Juego, interfaz e historia unidos | `feat/cierre-f9-juego` | Pendiente |
| 10 · Mezcla, auditoría y lanzamiento | `feat/cierre-f10-lanzamiento` | Pendiente |

F1 sale de `main 6702093`, que integra M1. La siguiente parte de F1 si aún no tiene merge. Si main ya la contiene, comprobar ascendencia y partir de main actualizado. No reescribir ramas publicadas ni hacer merges sin instrucción de Jay. Conservar commits de los padres al integrar ramas dependientes reduce conflictos; cambios paralelos o squash/rebase pueden exigir resolverlos. No prometer ausencia absoluta de conflictos.

## 1 · Identidades completas de mundos

Una receta relaciona espacio, material, color local, habitantes y carácter sonoro. Ocho familias iniciales: Cauces de seda, Raíces entrelazadas, Terrazas de cobre, Jardines orbitales, Arrecifes de cristal, Bóvedas de eco, Estratos de aire e Islas de membranas. Gramáticas con variantes por semilla/región, no ocho mapas fijos ni ocho biomas nuevos.

`world-families.js` selecciona familias compatibles con bioma y afinidad musical. `world-family-art.js` dibuja contornos pequeños en coordenadas del mundo, con desvanecimiento, detalle adaptativo y movimiento reducido. Material compartido por trazo, timbre y filtro; población común y movimiento favorecen la familia. Género, tempo, escala y batería nativos conservados. Brillo, articulación, aire y paleta distinguen el arreglo dentro de límites musicales.

La proyección de habitantes comunes crea nichos y vacíos sin mover terreno ni consumir RNG antiguo. Semillas, versiones de generador, construcciones y raros anteriores conservan coordenadas; habitantes comunes visibles pueden cambiar. Sin cambio de esquema de guardado: el ADN se reconstruye por semilla/región. WD1 sigue apuntando al mismo lugar. El hash histórico de generación excluye únicamente la propiedad aditiva `worldFamily`; su referencia no se cambia.

Saltar valora contraste entre familias y conserva el destino dentro de su región. Bitácora, llegada y semillas identifican el paisaje. Laboratorio: ocho lugares reales con habitantes naturales, sin timbres de prueba forzados; 139 entradas, 19 grupos. Las mismas familias aparecen fuera del laboratorio.

Lista cuando: ocho familias alcanzables en Mundo normal, dibujos y campos espaciales distintos, habitantes compatibles, estilos conservados y retorno exacto. Reconocimiento artístico y escucha en teléfono físico requieren aceptación de Jay. No declara terminada anatomía procedural, ecología completa ni síntesis modular.

## 2 · Formas y especies generadas

Gramáticas de cuerpos, ramas, segmentos, alas, membranas y órganos luminosos. Proporciones, material, movimiento y función musical coherentes; individuos que varían dentro de una especie. Integrar familias antiguas. Reconocer siluetas sin depender del color. Objetos contenidos, sin ilustraciones gigantes ni teclados cuadrados.

## 3 · Ecosistemas y territorios vivos

Colonias, refugios, corredores, claros, costas y lugares escasos. Dominantes, acompañantes y visitantes ligados a clima, hora, música y vecinos. Comportamientos individuales y encuentros, con simulación cercana/lejana acotada. Cada rasgo debe producir conducta observable. Las bases territoriales M1/F1 no equivalen a esta simulación completa.

## 4 · Instrumentos y síntesis modular

Fuentes, filtros, envolventes, moduladores, resonadores, secuenciadores y efectos conectables con tipos compatibles. Profundizar sustractiva, FM, aditiva, tablas de onda, granular real y modelos de cuerdas/membranas. Pianos, teclas, cuerdas, vientos, bajos, percusión y pads sostenidos expresivos. Muestras originales o licenciadas cuando aporten calidad.

Cables que transforman señal/modulación además de notas. Evaluar DSP/AudioWorklet según necesidad: cambiar biblioteca no crea instrumentos. Rutas, resonancia, ganancia y CPU acotadas. Sin prometer equivalencia con Arturia ni usar sus presets/muestras.

## 5 · Composición, géneros y mezclas

Batería, swing, bajo, armonía, fraseo, articulación y desarrollo. Mezclas compatibles de electrónica con blues, jazz, soul y tradiciones investigadas. Reconocer el género por lo que hace. Vecinos mezclables, quietud evolutiva y transiciones, con descansos de agudos y propuestas centradas en graves/medios. No combinar todo con todo sin dirección musical.

## 6 · Interacciones que hacen música

Tocar, rozar, orbitar, permanecer, tensar y conectar producen golpes, frases, bajos, acordes, sostenidos o transformaciones. Roles distintos por mundo, aprendibles durante la visita. Distinguir una fuente al activarla y escuchar qué desaparece al soltarla; el acompañamiento le da espacio sin subir todo.

Percusión natural visible: gotas, semillas, cañas, piedras huecas, membranas, insectos y alas. Rayos con articulaciones y ecos variados. Vidrios, espejos y luz transforman parámetros musicales. Vibración, deformación, material y luz local sincronizados con el audio, evitando resolver cada gesto con un pluck agudo.

## 7 · Exploración y hallazgos con sentido

Pistas, guardianes, puertas musicales, máquinas, ruinas y encuentros culturales documentados. Relacionar flora, fauna, arquitectura y vocabulario musical. Hallazgos cotidianos y excepcionales con condiciones reales; reliquias que abren posibilidades reconocibles. Obras originales o de dominio público cuando corresponda; licencias de grabaciones por separado.

## 8 · Memoria, regreso y vínculos

Extender Saltar, favoritos, orientación y autopilot para buscar afinidades/contrastes. Conservar semilla, versiones, tamaño, capa y coordenadas; identidad/versiones de receta si cambia generación. Migraciones y acceso a mundos antiguos. Volver al carácter del lugar sin congelar tiempo. Vínculos persistentes, preferencias y frases. Tarjetas con lugar, condiciones y observaciones, sin probabilidades inventadas. No reabrir escenas retiradas.

## 9 · Juego, interfaz e historia unidos

Recuperar y validar trabajos locales: cubo, menú, Bitácora, logros y casa **desde arriba**, ya decidida. Conservar Taller radial y progreso. Unir Camino, creación, atención y constancia con guía breve ligada a Jay. Voz contextual según hechos. Móvil con controles mínimos, grabación opcional y borrado intuitivo de ecos. Fondo negro, cubo blanco por defecto, Geist Mono, dorado ganado y UI silenciosa.

## 10 · Mezcla, auditoría y lanzamiento

Comparar mundos/instrumentos a volumen equivalente, con escucha humana y teléfonos reales. Corregir fatiga, repetición, enmascaramiento, balance y niveles. Medir diversidad, actividad de rasgos y duplicados perceptivos; no multiplicar parámetros correlacionados para prometer millones de canciones. Rendimiento, controles, accesibilidad, guardados, copias, migraciones y offline. Auditoría/lógica completas; navegador/audio completos antes de integrar el conjunto; CI aprobado.

Cerrar cuando se reconocen lugares al verlos/escucharlos, se entiende cada gesto y se disfruta una sesión larga. Ideas nuevas pasan al siguiente ciclo salvo defectos bloqueantes. Servidor público, cuentas y duetos por Internet quedan para después.

## Relación con los planes anteriores

- `PLAN_2.0.md` conserva estados reales y trabajos locales; F9 los integra, no los da por publicados.
- `PLAN_MEZCLAS_MUSICALES.md` conserva M1 implementada. Sus pendientes se reparten entre F3–F6 y F8–F10; F1 no completa híbridos, síntesis modular ni cobertura global del 100 %.
- La lista histórica de 150 ideas conserva sus parciales; no se convierte automáticamente en requisito de lanzamiento.

Cada fase actualiza CAMBIOS, estados y handoff con pruebas ejecutadas y límites. Jay autorizó continuar F2–F10 en orden sin confirmaciones intermedias. Entregar cada rama sin hacer merges.
