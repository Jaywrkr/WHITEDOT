# Cierre de mejora integral · 2.3.0-alpha.14

Diez fases implementadas sobre la recuperación musical `faa0fe9`. Es una consolidación de lo existente: no añade catálogos, carreras ni persecuciones. Jay conserva PR y merge; Codex no ha hecho merge ni push a main.

El código está entregado en ramas dependientes. **La publicación queda pendiente de CI completo y aceptación física.** No se afirma perfección, escucha en un teléfono real ni un deploy que no haya ocurrido. El artefacto publicado registra su fecha real; el repositorio conserva `deployedAt: null`.

## Orden de revisión

Comprobado al cierre: `origin/main` en `6f00f13a1a60f1245751ae048240a62cc3e1b05d` ya contiene las fases 1–6, incluida `aa43815` mediante PR #175. Sus ramas remotas fueron eliminadas tras integrarse. **Solo quedan por revisar las fases 7 → 8 → 9 → 10.** Los commits anteriores siguen documentados como historial.

| Fase | Rama | Commit de entrega | Qué probar en teléfono |
|---|---|---|---|
| 1 | `mejora/01-identidad-musical` | `6f42e22` | Escucha una zona varios minutos: la radio conserva su motivo. |
| 2 | `mejora/02-composicion` | `48c8293` | Cambia de zona: acompañantes estables y bajo con espacio. |
| 3 | `mejora/03-interacciones` | `6c5e6c5` | Quédate sobre percusión: bombo, caja y hats complementarios. |
| 4 | `mejora/04-mundo` | `b9b8ed1` | Entrada discreta; criaturas dormidas y movimiento reducido. |
| 5 | `mejora/05-encuentros` | `05877fa` | Arrastra, cancela y enseña una frase al animal. |
| 6 | `mejora/06-viajes` | `aa43815` | Busca favoritos por estilo o recuerdo y regresa. |
| 7 | `mejora/07-interfaz` | `6f3ef81` | Cambia tu cubo: prueba, cancela o aplica sin sonido. |
| 8 | `mejora/08-coleccion` | `0d83eea` | Examina una tarjeta y filtra el libro sin superposición. |
| 9 | `mejora/09-recorrido` | `6bc180d` | Toca un objeto en Casa para escucharlo; arrástralo para moverlo. |
| 10 | `mejora/10-cierre` | `0e17e7f` (código) | Camino, Mundo, Casa, cubo y regreso con tu partida anterior. |

Cada rama nace de la anterior. Si se integran por fases, mantener este orden y evitar squash/rebase entre ramas dependientes hasta actualizar sus bases. La relación de dependencia reduce conflictos; cambios externos pueden requerir resolverlos. No se promete ausencia absoluta de conflictos.

## Correcciones del cierre

- Casa deja de reconstruir su estado en cada consulta o dibujo; actualiza habitaciones al cambiar los días. Los objetos existentes conservan sus referencias y datos.
- La vista previa del cubo conserva sus 70 px completos; las acciones siguen accesibles al desplazar.
- Empezar, la flecha animada y la entrada del Mundo no crean audio cuando el jugador lo apagó. La activación con sonido conserva el gesto original del usuario.
- Los recorridos de espejos y vidrios guardan explícitamente «continuar» y la posición antes de comprobar persistencia: volver a explorar y volver al mismo sitio son casos diferentes.
- Favoritos comprueba una llegada nueva desde una visita que todavía no había realizado su salto. Las semillas comparan el guardado habitual con llegada continua, aislando la prueba de la relocalización intencional.
- El jardín termina de examinar las tarjetas mediante su botón antes de abrir el menú. Compartir espera la imagen cargada en vez de leer `naturalWidth` inmediatamente después del clic.
- CI conserva todas las aserciones y las tres particiones de audio. El push final activa el conjunto completo. Los renders de consolidación sin una fase explícita escriben en `/tmp`, sin alterar evidencias históricas.

## Evidencia y límites

Los informes `scripts/mejora-01-validation.json` a `mejora-09-validation.json` conservan sus pruebas enfocadas reales. Hubo 4, 41, 31, 5, 5, 8, 4, 9 y 75 suites Node por fase; tres, cuatro y tres renders en las primeras tres. Son ejecuciones por fase, no un conteo de pruebas únicas.

El informe final `scripts/mejora-10-validation.json` distingue lógica completa, auditoría, recorridos locales, renders y bloqueos. Los cuatro renders finales ejercitan minimal techno, garage, ambient y nu-disco a 44,1/48 kHz, con motivos originales y acompañamiento actual. Picos menores de 0,878, ningún tramo saturado y desajustes de entrada inferiores a 7,4 ms. Estas métricas comprueban salida y reloj; no certifican belleza ni sustituyen escucha humana.

El entorno local arrastra más de 19.000 procesos zombis ajenos al trabajo actual. Algunas ejecuciones de Chromium terminan con `pthread_create: Resource temporarily unavailable`, incluso antes de cargar el juego. No se han tocado procesos ajenos ni desactivado pruebas para ocultarlo. Se registran los recorridos que sí terminaron y los fallos de infraestructura por separado. Las comprobaciones completas de GitHub son obligatorias antes del merge.

Se revisaron además las anotaciones públicas del CI anterior [38945050689](https://github.com/Jaywrkr/WHITEDOT/actions/runs/38945050689): lógica y tres grupos de audio verdes, seis recorridos de navegador fallidos. Eso describe aquella revisión; no se reutiliza como aprobación del conjunto nuevo. Las condiciones incorrectas de esos seis recorridos se corrigen aquí y deben volver a pasar.

## Aceptación de Jay

Abrir el preview normal de cada rama, sin parámetros de desarrollo. Conservar una copia del guardado habitual antes de comparar versiones. Probar teléfono vertical y horizontal; después PC con teclado.

1. Entrar por el Camino, recoger una luz y abrir el Mundo. Volver el mismo día sin límite de tiempo.
2. Escuchar una zona quieto y recorrer estilos distintos. Confirmar groove, transiciones, bajo y detalles agradables con auriculares y altavoz.
3. Permanecer sobre percusión y tocar criaturas: distinguir tu aporte de la música de fondo.
4. Guardar y buscar un lugar; regresar voluntariamente. En una visita nueva, comprobar explorar y continuar por separado.
5. Cambiar el cubo sin aplicarlo, cancelar, volver y aplicar. Los menús deben permanecer silenciosos.
6. Examinar una tarjeta, cerrar y encontrarla en el libro. El hallazgo importante espera su turno.
7. En Casa, tocar escucha sin mover; arrastrar cambia posición. Recargar conserva Casa y Taller.
8. Confirmar versión del preview y fecha real del deploy. No integrar si CI está pendiente o falla.

Si una comprobación falla, corregir su causa en esta misma fase y repetir la cobertura afectada. Nuevas funciones o catálogos quedan para otro ciclo; este cierre no los autoriza.

## Estado remoto registrado

Código enviado: `0e17e7f68507364ad35fa36bfe90b864901bf581`. [CI completo de esta revisión](https://github.com/Jaywrkr/WHITEDOT/actions/runs/38951542059): `queued`, conclusión None. Instantánea en `scripts/mejora-10-ci.json`; pendiente no equivale a aprobado. La actualización documental posterior conserva el código y pruebas de esta revisión. Consultar el resultado actual en GitHub antes de integrar.
