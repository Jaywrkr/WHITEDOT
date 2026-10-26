# Traspaso vigente · alpha.207

**Continuar desde `main`.** Las siete fases E y la limpieza del repositorio entraron en `main` el 26 de octubre de 2026 con el CI completo en verde (PR #355, `d2f93f2e`). Jay crea PR y hace merge; no integrar automáticamente.

**Lo siguiente:** la [sesión 10 del panel](docs/panel/sesion-10/informe.md) revisó alpha.207 desde cero (doce perfiles, media 6,7) y propone el plan P1–P8, una rama `panel10/…` por fase. P6–P8 esperan las decisiones D1–D6 de Jay. No empezar ninguna fase sin su aprobación.

Leer [AGENTS](AGENTS.md), [README](README.md), [Arquitectura](docs/ARQUITECTURA.md) y [Verificación](docs/VERIFICACION.md). [HANDOFF_CLAUDE](HANDOFF_CLAUDE.md) es solo una entrada a este documento.

## Qué hay entregado

| Fase | Rama | Commit funcional |
|---|---|---|
| E1 | `excepcional/e1-fiabilidad` | `955cd6ae` |
| E2 | `excepcional/e2-interaccion` | `f93d4b54` |
| E3 | `excepcional/e3-aprender` | `b8470e7d` |
| E4 | `excepcional/e4-interfaz` | `ce2aca02` |
| E5 | `excepcional/e5-descubrimientos` | `0e0277f5` |
| E6 | `excepcional/e6-recorrido` | `a824224a` |
| E7 | `excepcional/e7-validacion` | `3c9d5dbc` (runtime), `7f6374b3` (registro) |

Cada rama contiene la anterior; la de limpieza parte de E7. Un PR de la última a main contiene el conjunto. Si se revisan por separado, preservar el orden; squash/rebase de una base requiere reajustar sus dependencias.

Cambios: resultados/porcentajes coherentes, luces a tiempo, entradas canceladas con foco/pausa, ayuda contextual, destinos claros, salida explícita del final5, Escape equivalente a Salir, jardín transaccional, libro compacto y favoritos directos sin duplicados. Tu canción identifica la frase personal y respeta el silencio visual. [Detalle E](docs/ENTREGA_E.md).

La limpieza actualiza guías, separa historial, añade este acceso para Claude y retira163 informes generados sin referencias (6.793.912bytes). [Registro de limpieza](docs/LIMPIEZA_REPOSITORIO.md). No cambia código del juego ni versión. Verificación de limpieza:254 suites Node, auditoría y enlaces aprobados; sin repetir navegador/audio.

## Qué está comprobado

- Runtime `3c9d5dbc`, versión `2.3.0-alpha.207`; huella `14154d7032e8041ca7e030a9f44a5ba1a5b4a78d45ba577fb87ccd3bc1f15062`.
- E:254 suites Node, auditoría limpia y veinte recorridos enfocados acumulados; siete renders E1 reutilizados por preservación del sonido.
- 24 capturas de distintas instantáneas y sus evidencias, con manifiesto/alcance; consultar el [informe](docs/panel/candidato-e/informe.md) para no atribuir imágenes antiguas al último commit.
- Vercel confirmó Preview de `7f6374b3`: [abrir E7](https://whitedot-epn5qszxv-jaywrkr-1498s-projects.vercel.app). No equivale a CI completo ni a publicación en tiendas.
- Main alpha.200 tiene CI completo aprobado:[integración](docs/INTEGRACION_ALPHA_200.md). Ese resultado no certifica alpha.207.

## Siguiente paso

1. Hecho: el candidato está en `main` (PR #355, CI completo en verde). Siguiente: las fases P del [panel 10](docs/panel/sesion-10/informe.md) que Jay apruebe.
2. Completar [aceptación](docs/PRUEBAS_CON_PERSONAS.md):cinco sesiones formativas y confirmación independiente de8–12. El [registro](docs/aceptacion-e.json) sigue sin participantes; no rellenarlo con bots ni respuestas supuestas.
3. Comprobar Android físico de gama media, Safari, altavoz/auriculares/Bluetooth, lector, interrupciones y retorno. El gusto musical, reconocimiento de la frase y prominencia de Jardín/Ruinas requieren observación real.
4. Si aparece un fallo, corregir ese criterio con una regresión enfocada. No reabrir planes antiguos ni ampliar el catálogo por una nota simulada.

La meta es diez; aún no está acreditada. El panel son diez lentes simuladas, no opiniones reales ni escucha humana.

## Límites que se mantienen

Conservar música actual, síntesis, notas, armonías, mezcla, RNG, mundos, especies y cubo pequeño. Guardados antiguos/futuros y propiedad de premios se migran sin borrar. El [verificador E](scripts/verify-e-preservation.mjs) protege 301 archivos y trece contratos (P1 abrió `map.js` y `places-ring.js`, solo dibujo; P2, ocho módulos de menú y cuenta).

UI negra, Geist Mono, esquinas rectas, color ganado y menús silenciosos. Supabase/tiendas en pausa; no reaplicar SQL, borrar cuentas, publicar ni contratar. `server/` es prototipo histórico probado, no backend activo. Mantener formatos/fixtures heredados aunque no aparezcan en la UI.

## Probar en el teléfono

Abrir la vista previa sin `?dev=1`. Menú → Cómo jugar explica el gesto actual; Lugares → Seguir señala el destino; Libro → tarjeta permite elegir voz; el nombre del lugar abre Favoritos para volver. En Jardín: acercarse, sembrar en el golpe, regar entre golpes, cosechar y cerrar con el árbol dorado.

Atajos `?lugar=jardin`, `?anillo=1`, `?festival=1` en un perfil temporal; [lista](docs/MUNDO.md#herramientas-de-prueba). No borrar la partida personal ni contar un atajo como recorrido completo.
