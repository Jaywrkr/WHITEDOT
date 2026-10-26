# Traspaso · candidato E

Código **2.3.0-alpha.207**, siete fases autorizadas por Jay, encadenadas desde main alpha.200 `fd5dfc19` y la auditoría9 `0457fd06`. Jay mantiene PR y merge; **este trabajo no integra ni publica main**. [Entrega y pruebas por fase](docs/ENTREGA_E.md) · [revisión final](docs/panel/candidato-e/informe.md).

## Ramas, de la anterior a la siguiente

| Fase | Rama | Commit de cierre funcional |
|---|---|---|
| E1 | `excepcional/e1-fiabilidad` | `955cd6ae` |
| E2 | `excepcional/e2-interaccion` | `f93d4b54` |
| E3 | `excepcional/e3-aprender` | `b8470e7d` |
| E4 | `excepcional/e4-interfaz` | `ce2aca02` |
| E5 | `excepcional/e5-descubrimientos` | `0e0277f5` |
| E6 | `excepcional/e6-recorrido` | `a824224a` |
| E7 | `excepcional/e7-validacion` | `3c9d5dbc` (runtime); registro posterior |

La última rama contiene todas las anteriores. Revisar en orden; no rebasar ni hacer squash entre dependencias sin ajustar después sus bases. También puede revisarse el conjunto mediante un PR de la última a main: conserva todas las fases y ejecuta CI completo una sola vez. No se ha creado ningún PR de E.

## Qué cambió

Resultados y porcentajes coherentes; luces a tiempo; entrada cancelada al perder foco; ayuda contextual accesible; lectura, scroll y salidas consistentes; tarjetas y jardín con transacciones; Favoritos conserva y explica trabajo pendiente; cierre identifica tu frase y siguiente destino. La revisión final cierra Escape, redondeos residuales, árbol dorado, arrastres con cuota y pulsos visuales inventados durante silencios.

La música actual, el RNG, las semillas, los mapas, las especies, las voces y el cubo pequeño se conservan. [Verificador](scripts/verify-e-preservation.mjs):311 archivos idénticos a main y trece contratos de música/reglas. El audio cambia solo cuándo recibe luz la interfaz. No se han cambiado síntesis, armonía, notas, arreglos ni mezcla.

## Qué está comprobado y qué falta

Las evidencias exactas y su revisión están en el [informe](docs/panel/candidato-e/informe.md). El candidato tiene254 suites Node; las comprobaciones enfocadas de interfaz, persistencia, sincronía, accesibilidad y offline se registran por separado del catálogo completo. Los siete renders de E1 son reutilizables porque las funciones de sonido se conservaron. No confundir renders, medidas y panel simulado con escucha física.

**CI completo de este candidato, personas y dispositivos físicos siguen pendientes.** El CI de alpha.200 sí aprobó antes de integrar: [registro](docs/INTEGRACION_ALPHA_200.md). No lo atribuir a alpha.207. Antes de integrar E, esperar lógica, seis grupos de navegador, seis de audio y agregador del nuevo PR.

La meta de Jay es diez; no hay un diez acreditado. [Registro vacío de aceptación](docs/aceptacion-e.json) y [protocolo](docs/PRUEBAS_CON_PERSONAS.md):cinco sesiones formativas, confirmación independiente y escucha/dispositivos. El validador informa pendientes y no inventa personas ni certifica una nota.

## Probar sin herramientas de desarrollador

Abrir la vista previa de la última rama, sin `?dev=1`. Durante una ronda, menú → Cómo jugar muestra la acción actual. En Jardín: acercarse, sembrar en el golpe, regar entre golpes, cosechar y cerrar con el árbol dorado. El resultado identifica lugar, colección y ronda; el siguiente destino usa Seguir hacia. Menú → Lugares coloca el objetivo dentro de la lista. Libro → elegir una voz → Ir a mi Refugio. Tu canción distingue capas y frases guardadas para el final.

Para aislar casos sin borrar tu partida: otra sesión/perfil temporal y `?lugar=jardin`, `?anillo=1` o `?festival=1`. Son atajos de comprobación, no prueba de un recorrido continuo. Bluetooth, Safari, lectores y gusto musical requieren personas reales.

Supabase y tiendas siguen en pausa. No abrir otra expansión ni rehacer la música por una nota simulada. Reabrir solo el criterio respaldado por nueva evidencia. [Reglas](AGENTS.md) y [verificación](docs/VERIFICACION.md).
