> **Ampliado por petición posterior:** [150 propuestas en diez fases](UNIVERSO_150_IDEAS_FASES.md). Esta lista de 50 se conserva íntegra como origen; la nueva contiene una tabla de correspondencia.

# Próximo universo: 50 propuestas

Petición de Jay, 14 de octubre de 2026: integrar lo pendiente en main, mantener beneficios de cajas por tiempo y ampliar dimensiones, música, fauna, seres y edificaciones. **Propuestas para priorizar; no son 50 funciones implementadas.**

## Punto de partida comprobado

V1 RC6 está integrada y subida a main en `9b5fe00`, por autorización explícita de Jay. Única rama remota pendiente antes de la integración: `polish/coherent-game-ui`. Sus padres ya entraron mediante #78–#84. Las antiguas ramas locales de veinte entregas fueron sustituidas por las cinco fases integradas en #58; no reaplicarlas ni resucitar funciones retiradas.

Se conservan 11 biomas base, 33 hábitats, 52 géneros, 81 familias de elementos, 18 tipos de tarjeta y coordenadas con identidad completa WD1. Hay favoritos, navegación, paseo, varias capas, evolución en quietud, criaturas, culturas, Estudio, efectos y libro local. Las propuestas amplían/profundizan esos sistemas; no se consideran ausentes.

Verificación de la aplicación integrada: 59 suites de lógica, 45 recorridos de navegador y offline; [evidencia RC6](../../scripts/interface-validation.json). Publicación y aceptación física siguen separadas del merge.

## Regla prioritaria: cajas por tiempo

Los seis poderes actuales ya son temporales: Cometa 90 s, Imán/Pincel 120 s, Campo 150 s, Brújula 180 s y Compañero 240 s. No se guardan activos. El código usa reloj de sesión y permite sumar duración si se repiten. **Hay una excepción pendiente de corregir:** una caja natural muy rara puede originar una mascota permanente, por una función solicitada anteriormente.

Para cumplir la nueva dirección: los beneficios de caja serán temporales; una caja rara podrá dar una visita de compañía, mientras el vínculo permanente se gane jugando con criaturas. El libro y el registro del descubrimiento pueden conservarse. No borrar retroactivamente mascotas o hallazgos ganados. Repetir un beneficio tendrá un techo; su retirada será gradual y musical. Propongo contar tiempo de juego activo y pausar al abrir menús o suspender el juego. Los valores finales y esa pausa son decisiones de diseño propuestas, no cambios ya aplicados al código.

## 1–20: mejorar lo actual

1. **Cajas con beneficios temporales claros.** Duración limitada, techo de acumulación, compañía de caja temporal y expiración suave; conservar descubrimientos y mascotas ya ganadas.
2. **Mezcla que se autorregula.** Ajustar densidad y niveles según las voces presentes para que una zona rica conserve claridad.
3. **Diversidad de registros.** Lugares centrados en bajos, medios o percusión; reservar los agudos para donde aporten algo.
4. **Géneros con más personalidad.** Afinar articulación, swing, instrumentos y estructura para distinguir estilos por su lenguaje musical.
5. **Interacciones que cambien la composición.** Profundizar en gestos que transformen líneas de bajo, patrones, acordes y silencios del lugar.
6. **Transiciones como una mezcla de DJ.** Refinar entradas y salidas por frase, compatibilidad armónica y control de graves entre regiones.
7. **Quietud de larga duración.** Desarrollar sesiones de 10–20 minutos con movimientos musicales y visitas, sin exigir caminar.
8. **Más producción sonora propia.** Incorporar síntesis y muestras originales cuidadosamente diseñadas para ataques, texturas y cuerpos diferentes.
9. **Deshacer sin ruido visual.** Un gesto sencillo para revertir la última intervención musical accidental y mejorar el reemplazo de sonidos fijados.
10. **Favoritos más expresivos.** Añadir notas del jugador y pistas de carácter musical a los puntos guardados; preservar coordenadas/versiones, sin prometer repetir una canción temporal exacta.
11. **Orientación dentro del paisaje.** Mejorar señales naturales, criaturas guía y referencias para volver sin depender de flechas permanentes.
12. **Aprender jugando.** Afinar el primer recorrido para enseñar contacto, permanencia, órbita y escucha a través de respuestas del mundo.
13. **Historia con identidad de Jay.** Unir Camino, constancia, creación y exploración con fragmentos breves de una historia propia.
14. **Rareza que invite a investigar.** Profundizar en pistas y condiciones de encuentro para que buscar no dependa únicamente de tirar probabilidades.
15. **Expediciones con propósito.** Pequeños objetivos opcionales: seguir una llamada, reconocer un patrón o completar una ruta musical.
16. **Móvil probado de verdad.** Cerrar teclado virtual, lectura, safe areas, consumo, suspensión y audio en iPhone y Android físicos.
17. **Territorio cargado por distancia.** Afinar generación/caché y nivel de detalle para ampliar escala sin acumular objetos o cargar todo a la vez.
18. **Progreso resistente a actualizaciones.** Mejorar migración, respaldos y estabilidad de direcciones al introducir nuevos catálogos.
19. **Duetos con reglas musicales.** Preparar encuentro entre jugadores con reparto de voces, reloj común y límites que mantengan la mezcla agradable.
20. **Publicación preparada.** Host HTTPS, versión y deploy reales, recuperación de partida y base para usuarios cuando se abra ese alcance.

## 21–30: dimensiones y territorio

21. **Escalas de universo.** Región → continente → mundo → constelación de mundos, cada escala con identidad y rutas guardables.
22. **Biomas mucho más extensos.** Grandes territorios de un carácter musical donde experimentar largo tiempo, con densidad variable y rincones internos.
23. **Biomas híbridos.** Cruces coherentes de ecosistemas y lenguajes musicales, con fronteras graduales y especies propias.
24. **Más profundidad.** Ampliar las capas actuales con cavernas, raíces profundas, copas y alturas; vínculos musicales entre niveles.
25. **Estaciones propias por mundo.** Ciclos que cambien fauna, floración, agua, luz y composición sin perder la identidad del lugar.
26. **Desiertos de silencio.** Inmensidad casi vacía y pocos encuentros significativos; música contenida y viento leve.
27. **Océanos y archipiélagos vivos.** Dar más juego al mar: corrientes, costas, criaturas y lugares de escucha submarina.
28. **Geometrías sorprendentes.** Territorios anulares, islas encadenadas, fracturas, valles largos y suelos plegados, representados con trazos simples.
29. **Clima con comportamiento local.** Profundizar la lluvia con gotas graves, granizo de madera, niebla de acordes y tormentas de diferentes perfiles.
30. **Lugares que recuerdan tu presencia.** Cambios locales persistentes y discretos en flora o respuestas musicales cuando regresas.

## 31–40: animales, seres y flora

31. **Mantas sonoras.** Pequeñas criaturas planeadoras cuya inclinación transforma pads cálidos y filtros lentos.
32. **Ciervos de resonancia.** Antenas de luz y pasos que construyen bajos; cada ejemplar con conducta propia.
33. **Tortugas de piedra.** Andar lento que compone toms y bombos espaciados; acercarte modifica su groove.
34. **Escarabajos relojeros.** Huellas que organizan madera, rim y síncopas; grupos con distintos patrones compatibles.
35. **Medusas pulsantes.** Formas mínimas de membrana que respiran acordes, subgraves o percusión según su hábitat.
36. **Lombrices secuenciadoras.** Excavan trazos que cambian el orden de una frase de bajo o un patrón rítmico.
37. **Ballenas del vacío.** Encuentros muy raros con cantos graves y pausados; se perciben por fragmentos luminosos, sin llenar la pantalla.
38. **Linajes de seres procedurales.** Familias con combinaciones de silueta, movimiento, sociabilidad, horarios, hábitat y voz que produzcan especies reconocibles.
39. **Árboles respirantes y frutos de ritmo.** Flora que crece, se inclina o desprende frutos con voces diferentes; cada individuo reacciona con su propia cadencia.
40. **Enredaderas y jardines conductores.** Filamentos vivos que conectan seres/objetos y transmiten ritmo o armonía como un circuito natural.

## 41–50: arquitectura, culturas y sorpresa

41. **Edificaciones de raíces.** Refugios nacidos del terreno, con cámaras pequeñas que cambian resonancia y registro al recorrerlas.
42. **Molinos de agua musical.** Corrientes que mueven mecanismos mínimos de percusión, swing o secuencias.
43. **Catedrales de silencio.** Cuevas o ruinas abiertas donde posición y distancia revelan armonías y reverberación contenida.
44. **Observatorios vivos.** Aros y estrellas locales que alineas caminando para componer ciclos largos o abrir rutas.
45. **Plazas de encuentro musical.** Lugares poco densos donde criaturas y, después, jugadores sostengan una composición compartida.
46. **Laberintos de luz y reflejo.** Ampliar espejos/puertas con caminos variables que se resuelvan por luz, posición y escucha.
47. **Puentes de resonancia.** Estructuras delicadas que aparecen al relacionar dos patrones y permiten cruzar grandes espacios.
48. **Más encuentros culturales coherentes.** Ampliar los ocho estudios actuales con tradiciones de muchas regiones; relacionar ritmo, instrumentos, arquitectura, flora y seres en una interpretación propia.
49. **Reliquias históricas con función.** Más mecanismos, instrumentos y partituras de dominio público reinterpretados: encontrarlos permite jugar musicalmente, además de registrar una tarjeta.
50. **Convergencias excepcionales.** Clima, seres y ciclos se alinean para abrir una visita a un lugar extraordinario; conservar su hallazgo y una forma clara de saber cuándo regresar.

## Orden de trabajo recomendado

Una rama amplia por bloque: **A. Cajas y producción musical (1–9); B. Exploración, relato y cierre móvil (10–18); C. Generación ampliable y territorio (21–30); D. Linajes y ecosistemas (31–40); E. Arquitectura y búsqueda (41–50); F. Infraestructura y duetos (19–20).** Ajustar el tamaño de cada bloque después de probarlo; no crear cincuenta ramas pequeñas.

Antes de ampliar el catálogo, separar parámetros compatibles de terreno, clima, densidad, música, comportamiento, fauna, flora, arquitectura y rareza. Registrar contenido una vez y permitir múltiples variaciones por semilla, manteniendo direcciones y versiones de lugares antiguos. No mezclar todo indiscriminadamente: presupuestos de voces/elementos y compatibilidad musical son parte de cada receta.

La meta es mucha variedad perceptible, no únicamente nombres, colores o tonos distintos. Medir recetas y firmas musicales/visuales de muestras grandes, tasa de repetición y casos escuchables. No declarar millones de mundos/canciones distintos sin esa evidencia. Las dimensiones de terreno y las variantes de contenido son medidas diferentes.
