> **Ampliación posterior vigente:** [150 propuestas en diez fases](UNIVERSO_150_IDEAS_FASES.md), con treinta ideas musicales, diez funciones de la Voz y diez de tarjetas añadidas. Este documento conserva la lista de cien y su numeración histórica.

# Universo vivo: 100 propuestas en 10 fases

Ampliación solicitada por Jay el 14 de octubre de 2026. Duplica el plan de [50 propuestas](UNIVERSO_50_IDEAS.md), preserva su alcance y añade especialmente vida, biodiversidad y relaciones entre elementos. **Estado: planificación; ninguna de estas diez fases se implementó en este documento.**

## Base y reglas comunes

Main observado: `704ae07`; aplicación V1 RC6 con interfaz integrada (`9b5fe00`). Catálogo actual: 11 biomas, 33 hábitats, 52 géneros, 81 familias y 18 tipos de tarjeta. Existen criaturas, flora, clima, culturas, capas, favoritos, paseo, quietud, interacción y registro: se amplían y conectan.

- Caminar, tocar con el cubo, permanecer y recorrer alrededor siguen como gestos principales. Las reglas nuevas viven en el mundo; el jugador aprende mirando y escuchando.
- Fondo negro, cubo blanco por defecto, color localizado, siluetas mínimas y espacio para respirar. Las criaturas grandes se representan mediante fragmentos y distancia; un objeto no debe cubrir gran parte de la pantalla.
- Cada región conserva música agradable. La abundancia visual no exige sumar todas sus voces: densidad, registros, volumen y compatibilidad musical forman parte de la receta. La UI sigue silenciosa.
- Cajas: beneficios temporales, acumulación limitada y compañía de caja temporal. Mascotas y hallazgos ya ganados permanecen; el vínculo permanente nuevo se gana con criaturas. Hoy los seis poderes duran 90–240 s, pero pueden acumularse y una caja rara puede dar mascota permanente: son ajustes pendientes, no correcciones ya aplicadas.
- Vida autónoma y comportamientos sencillos: descansar, acercarse, seguir, reunirse, migrar y responder. Simulación cercana y ciclos deterministas para el resto del mundo; sin un sistema de mantenimiento obligatorio de animales o plantas.
- Una rama amplia por fase al implementarla. Este documento se entrega en una sola rama de planificación; no se crean cien ramas ni se cambia el juego durante este turno.
- Es una progresión aproximada de complejidad técnica. Cada fase reutiliza las anteriores y se valida antes de abrir la siguiente; publicación individual puede ocurrir antes de terminar todo el plan, cuando supere su aceptación.

## Fase 1 · Claridad, calma y acciones reversibles · 1–10

**Qué se hará:** ajustar comportamientos presentes y hacer más legibles sus respuestas. Se aprovechan temporizadores, gestos y HUD actuales; todavía no requiere nuevos biomas ni servidor.

1. **Cajas con tiempo real de juego.** Limitar acumulación, pausar duración en menús/suspensión y dar visitas de compañía temporales; conservar progreso ya ganado.
2. **Intervenciones que descansan.** Las transformaciones temporales vuelven suavemente a su estado natural cuando dejas el lugar, salvo las que fijaste deliberadamente.
3. **Deshacer con un gesto.** Revertir la última intervención accidental y mejorar sustitución/borrado de sonidos fijados sin abrir un panel.
4. **Avisos que respetan la exploración.** Afinar frecuencia y contexto para mostrar información útil cuando corresponde, conservando versión/deploy visibles.
5. **Objetos que anticipan su respuesta.** Una inclinación, pequeño pulso o pausa indica si conviene tocar, esperar o rodear.
6. **Interacción cómoda con una mano.** Ajustar tolerancia de contacto, elementos pequeños y lectura según tamaño de pantalla y movimiento.
7. **Aprender mediante encuentros.** Un pequeño recorrido enseña cada gesto haciendo música, con ayudas breves cuando hacen falta.
8. **Calidez de registros.** Más lugares centrados en bajos y medios; los agudos responden al carácter del ambiente.
9. **Ambiente suave.** Refinar viento de dunas, ruido de fondo y lluvia para conservar detalle sin cansancio.
10. **Referencias para orientarse.** Formaciones, rastros y visitantes señalan caminos y puntos guardados de forma discreta.

**Qué se verá al probar:** el mismo mundo resultará más claro y tranquilo. Verificar expiración, ausencia de sonidos de UI y comodidad real con los gestos.

## Fase 2 · Familias combinables y personalidad individual · 11–20

**Qué se hará:** ampliar el catálogo existente con datos reutilizables de hábitat, conducta y voz. Un solo contenido podrá aparecer con muchas personalidades coherentes; no se sustituye todo el generador.

11. **Catálogo ampliable.** Registrar flora, fauna, arquitectura y sonidos mediante familias con parámetros compatibles.
12. **Densidades propias.** Lugares despoblados, dispersos, de pequeños grupos o exuberantes, con límites de representación y de voces.
13. **Identidad estable por semilla.** Mantener direcciones y versiones originales al ampliar catálogos, sin desplazar favoritos existentes.
14. **Linajes de seres.** Variaciones reconocibles de silueta, desplazamiento, voz, horario y hábitat dentro de una misma familia.
15. **Personalidad por ejemplar.** Un individuo puede ser curioso, tímido, lento o sociable; compartir especie no obliga a moverse igual.
16. **Papel musical por ambiente.** Profundizar el reparto de bajos, percusión, armonía y detalles según especie y lugar.
17. **Afinidades ecológicas.** Definir qué flores, seres, materiales y climas se buscan entre sí para usarlos después en relaciones vivas.
18. **Ritmos de actividad.** Definir ciclos de reposo, movimiento y canto coherentes con el reloj del mundo.
19. **Rarezas con condiciones.** Registrar qué hace excepcional una variante y cuál es la población a la que pertenece su probabilidad.
20. **Laboratorio de biodiversidad.** Comparar ejemplares, densidades, sonidos y semillas sin introducir sonidos de UI ni contaminar la partida normal.

**Qué se verá al probar:** una misma familia tendrá ejemplares distinguibles en diferentes lugares. Las recetas antiguas y direcciones guardadas deben seguir reproduciéndose.

## Fase 3 · Flora que actúa como un instrumento vivo · 21–30

**Qué se hará:** desarrollar diez familias de respuestas vegetales con el repertorio de gestos existente. Crecen, cambian y se relacionan con ambiente y música; cada familia admite variaciones de fase 2.

21. **Árboles respirantes.** Ramas que se abren o inclinan y modulan bajos, acordes o percusión según el hábitat.
22. **Frutos de ritmo.** Semillas y frutos que caen, flotan o ruedan con ataques de madera, toms y golpes suaves.
23. **Enredaderas conductoras.** Filamentos naturales conectan elementos cercanos y transmiten un patrón o modulación, directamente en el mundo.
24. **Redes de hongos.** Pequeños grupos responden por debajo del suelo y propagan frases graves entre sus nodos.
25. **Flores de presión expresivas.** Profundizar apertura, inclinación y permanencia para transformar armonía y dinámica.
26. **Juncos de viento.** Cambian su movimiento y aportan raspados, contratiempos o pulsos filtrados.
27. **Musgo que amortigua.** Rincones suaves reducen brillo y densidad para ofrecer descanso musical.
28. **Cactus de pulsos.** Absorben una llamada del jugador y la devuelven después como un patrón afinado.
29. **Semillas viajeras.** El ambiente transporta semillas a pequeños refugios donde aparecen nuevas respuestas vegetales.
30. **Colonias de líquenes.** Formas geométricas diminutas se expanden sobre piedras y responden como una superficie musical compartida.

**Qué se verá al probar:** se podrá permanecer en un pequeño jardín y hacer música con varios gestos. No se reintroducen el antiguo jardín modular ni sus paneles retirados.

## Fase 4 · Más animales y seres con formas propias · 31–40

**Qué se hará:** crear familias de criaturas que reutilicen seguimiento, curiosidad, agrupación y respuesta musical. Ninguna exige cuidados obligatorios y su canto respeta la mezcla del lugar.

31. **Mantas sonoras.** Planean y cambian pads cálidos y filtros al inclinarse.
32. **Ciervos de resonancia.** Antenas finas y pasos que desarrollan líneas de bajo; cada ejemplar tiene su cadencia.
33. **Tortugas de piedra.** Toms y bombos espaciados responden a tu proximidad y al descanso del animal.
34. **Escarabajos relojeros.** Sus huellas organizan madera, rim y síncopas con patrones compatibles entre ejemplares.
35. **Medusas pulsantes.** Membranas mínimas respiran acordes, subgraves o percusión según la zona.
36. **Lombrices secuenciadoras.** Sus recorridos alteran el orden de una frase de bajo o ritmo en el suelo.
37. **Ballenas del vacío.** Encuentros raros con cantos graves y fragmentos luminosos que sugieren tamaño sin llenar la pantalla.
38. **Polillas del eco.** Visitan flores y recuerdan fragmentos de lo que tocaste para responder o guiarte.
39. **Crustáceos de cristal.** Pequeñas pinzas y caparazones articulan percusión contenida de madera o metal.
40. **Blobs sociales.** Ampliar los blobs con maneras distintas de reunirse, separarse, descansar y transformar su voz.

**Qué se verá al probar:** lugares con especies y comportamientos reconocibles; poca fauna también debe poder dar una escena interesante. Validar forma, reacción y registros musicales de cada familia.

## Fase 5 · Más profundidad musical y producción · 41–50

**Qué se hará:** ampliar el sonido y la composición sobre familias ya visibles. Separar variación de timbre, articulación y estructura, preservando armonía y una mezcla agradable.

41. **Estilos con lenguaje propio.** Afinar swing, bajos, articulaciones, percusión y estructuras para que los géneros tengan más personalidad.
42. **Producción sonora original.** Más resonadores, ondas, modulaciones y muestras propias cuidadosamente diseñadas para cuerpos diferentes.
43. **Mezcla adaptativa.** Repartir espacio entre registros y limitar densidad de voces cuando el ecosistema está activo.
44. **Gestos que componen.** Intervenciones más profundas en líneas de bajo, patrones, acordes y pausas, con respuesta entendible.
45. **Paletas de percusión por mundo.** Más cuerpos y articulaciones graves/medias en piedras, frutos, seres y suelos.
46. **Transiciones por frase.** Refinar cambios de región como una mezcla de DJ: tempo, armonía y graves organizados.
47. **Capítulos musicales en quietud.** Una estancia larga tiene desarrollo, descansos y nuevas combinaciones durante 10–20 minutos.
48. **Conversaciones musicales entre seres.** Frases compatibles pasan entre fauna, flora y jugador, con descansos y límites de participación.
49. **Materiales con acústica propia.** Piedra, agua, madera y cavidades aplican resonancias y espacio moderado sin perder claridad.
50. **Crear mediante silencio.** Profundizar los gestos que retiran, amortiguan o sustituyen partes de la composición.

**Qué se verá al probar:** permanecer y tocar en un mismo lugar produce cambios musicales significativos. Verificar los géneros existentes y nuevos perfiles en mezclas densas/suaves y escucha física.

## Fase 6 · Relaciones, clima y ciclos del ecosistema · 51–60

**Qué se hará:** conectar las afinidades de fase 2 con la flora y fauna creadas. Usar estados y ciclos sencillos, simulando detalle alrededor del jugador y resolviendo el resto por reloj/semilla.

51. **Climas de distintas voces.** Profundizar lluvia grave, granizo de madera, niebla armónica y vientos con diferentes articulaciones.
52. **Estaciones particulares.** Cada mundo cambia floración, población y composición según sus propios ciclos.
53. **Vida diurna y nocturna.** Unas especies descansan cuando otras aparecen; la música acompaña esa rotación.
54. **Polinización visible.** Visitantes llevan pequeñas señales entre plantas y despiertan nuevas respuestas musicales.
55. **Simbiosis de sonido.** Parejas naturales de planta y animal producen un comportamiento o patrón que no aparece por separado.
56. **Refugios y descanso.** Los seres buscan pequeños rincones donde sus movimientos y voces cambian de intensidad.
57. **Colonias temporales.** Grupos se forman alrededor de un árbol, piedra o corriente y luego se dispersan.
58. **Migraciones entre regiones.** Bandadas transportan un carácter musical compatible y generan encuentros al cruzarse.
59. **Mareas y humedad.** Corrientes y charcos alteran vegetación, rutas de seres y timbres del paisaje.
60. **Ciclos de crecimiento.** Brotes, frutos y nacimientos aparecen en ciclos observables, con recuperación natural del ecosistema.

**Qué se verá al probar:** suceden cosas aunque el jugador no intervenga. La experiencia no depende de simular cada organismo del universo en todo momento.

## Fase 7 · Territorio mucho más grande y diverso · 61–70

**Qué se hará:** ampliar escala después de validar coste y biodiversidad. Cargar por cercanía, conservar generadores antiguos y probar tamaños mayores como nuevos perfiles.

61. **Carga de territorio por distancia.** Generar y conservar lo necesario para la zona actual, con cachés acotadas.
62. **Detalle según cercanía.** A distancia, siluetas y señales; cerca, conducta, interacción y textura musical.
63. **Vasto ampliado.** Probar regiones de aproximadamente 50.000–100.000 unidades por lado mediante perfiles/versiones nuevos; no rescalar mapas ya guardados.
64. **Microhábitats dentro del bioma.** Un territorio grande puede contener claros, refugios, jardines y pequeñas comunidades del mismo carácter musical.
65. **Fronteras híbridas.** Mezclar ecosistemas vecinos gradualmente y darles encuentros propios.
66. **Más capas verticales.** Expandir raíces, cavernas, copas y alturas conservando enlaces y música entre niveles.
67. **Desiertos de silencio.** Extensiones tranquilas, pocos elementos y grandes distancias con encuentros significativos.
68. **Océanos y archipiélagos vivos.** Corrientes, costas y poblaciones acuáticas vuelven explorables más áreas del mar.
69. **Geometrías singulares.** Territorios anulares, fracturas, valles, deltas y suelos plegados mediante líneas discretas.
70. **Islas en altura.** Archipiélagos suspendidos y rutas entre pequeños refugios, con fauna y corrientes propias.

**Qué se verá al probar:** hay tiempo para habitar un bioma y descubrir varios ambientes internos. Los tamaños son objetivos experimentales, no una capacidad nueva ya medida; Vasto actual sigue en 18.000 unidades por lado.

## Fase 8 · Arquitectura y encuentros culturales vivos · 71–80

**Qué se hará:** introducir construcciones pequeñas y distribuibles, ligadas a hábitat, materiales y música. Se recorren con el cubo; no requieren un editor de construcción para disfrutarlas.

71. **Edificaciones de raíces.** Refugios nacidos del suelo con cámaras de distinta resonancia y pequeñas comunidades.
72. **Molinos musicales.** Agua o viento mueven mecanismos mínimos de percusión, swing y secuencias.
73. **Catedrales de silencio.** Cavidades y ruinas abiertas revelan armonías según distancia y posición.
74. **Observatorios vivos.** Aros y estrellas locales se alinean caminando para desarrollar ciclos largos o abrir rutas.
75. **Plazas musicales.** Sitios despejados reúnen fauna y posteriormente jugadores alrededor de una composición.
76. **Laberintos de luz y reflejo.** Ampliar vidrios/espejos con rutas y superposiciones de color localizadas en objetos.
77. **Puentes de resonancia.** Relacionar patrones despierta una estructura delicada para cruzar un espacio.
78. **Más tradiciones culturales.** Ampliar los ocho estudios actuales relacionando música, formas, flora, seres y arquitectura con referencias propias.
79. **Reliquias históricas funcionales.** Mecanismos, instrumentos y partituras de dominio público permiten jugar musicalmente y guardar un descubrimiento.
80. **Refugios de membrana.** Estructuras ligeras que se abren con brisa o contacto y filtran armonías del entorno.

**Qué se verá al probar:** cada construcción tiene una función musical, un lugar ecológico y una figura legible. Las culturas se amplían con investigación y creaciones originales, no como decorado intercambiable.

## Fase 9 · Búsqueda, memoria y mundos conectados · 81–90

**Qué se hará:** convertir la biodiversidad en descubrimientos y recorridos que se puedan recordar. Expandir el libro y la memoria local con límites claros de guardado.

81. **Rareza investigable.** Encuentros excepcionales dependen de condiciones que pueden aprenderse, con pistas y probabilidades contextualizadas.
82. **Expediciones pequeñas.** Seguir una llamada, reconocer una combinación o recorrer una ruta opcional tiene un resultado propio.
83. **Convergencias excepcionales.** Clima, ciclos y seres se alinean para abrir una visita a un lugar extraordinario.
84. **Favoritos con memoria musical.** Añadir notas, carácter, hábitat y momento del encuentro, conservando identidad completa de coordenadas.
85. **Paisajes que recuerdan.** Cambios locales discretos se conservan para que el regreso tenga significado.
86. **Compañía ganada por vínculo.** Ampliar aprendizaje y crecimiento de mascotas permanentes mediante encuentros naturales; las visitas de cajas siguen temporales.
87. **Constelaciones de mundos.** Conectar regiones, continentes y mundos mediante rutas guardables e identidades estables.
88. **Historia breve de Jay.** Fragmentos de creación, constancia y curiosidad unen Camino, mundo y descubrimientos.
89. **Libro de vida y hallazgos.** Ampliar registro de linajes, encuentros y relaciones; distinguir familia, variante y ejemplar raro.
90. **Paseos musicales con propósito.** Profundizar el modo auto con recorridos tranquilos, ecológicos o de búsqueda; recuperar control con el gesto habitual.

**Qué se verá al probar:** explorar y regresar tienen propósito sin imponer una lista obligatoria de tareas. Un favorito conserva lugar/identidad; una canción temporal exacta no se promete por guardar coordenadas.

## Fase 10 · Aceptación, publicación y creación compartida · 91–100

**Qué se hará:** cerrar la versión individual y después añadir infraestructura/conexión de forma gradual. Es la fase de mayor complejidad por dispositivos, servicios, sincronización y continuidad de partidas.

91. **Aceptación en teléfonos reales.** Probar escucha, teclado, batería, memoria, suspensión, orientación y grabación en iPhone/Android físicos.
92. **Progreso resistente a versiones.** Validar migraciones, respaldos, recuperación y direcciones antiguas con los catálogos ampliados.
93. **Host HTTPS y deploy verificable.** Publicar con caché, actualización segura y fecha real de versión; preservar partidas al cambiar origen.
94. **Usuarios opcionales.** Mantener acceso sencillo al juego y vincular progreso a una identidad cuando el jugador lo quiera.
95. **Continuidad entre dispositivos.** Sincronizar descubrimientos, favoritos y progreso con manejo explícito de conflictos.
96. **Encuentros en salas pequeñas.** Compartir un acceso y verse como cubos distinguibles, con presencia visual discreta.
97. **Reloj musical compartido.** Sincronizar tempo, compás y eventos para que las interacciones encajen entre jugadores.
98. **Duetos con reparto de voces.** Organizar contribuciones de bajo, percusión y armonía para conservar claridad colectiva.
99. **Lugares compartidos persistentes.** Guardar cambios de una pequeña comunidad musical sin llenar el mundo de paneles o edificios pesados.
100. **Publicación por etapas y escucha humana.** Comprobar variedad perceptible, comodidad y disfrute con personas; publicar bloques validados y observar dónde sigue repitiéndose la experiencia.

**Qué se verá al probar:** una versión individual estable y, posteriormente, la posibilidad de encontrarse y crear música juntos. Servidor/cuentas/multijugador son propuestas; esta documentación no publica ni configura servicios.

## Revisión de cada fase

La complejidad del sistema interno puede crecer; los gestos básicos y la claridad de la experiencia se conservan. Para aceptar una fase: comprobar respuesta musical, diversidad perceptible, espacio visual, funcionamiento móvil, límite de voces/objetos, direcciones/guardados, registro y actualización offline. Ejecutar solo las pruebas pertinentes a su cambio y hacer escucha humana cuando cambie música.

Medir por separado extensión física, variedad de recetas, linajes y experiencias musicales. Buscar un universo de millones de combinaciones coherentes; no afirmar millones de canciones/especies distintas antes de medir repeticiones y evaluar ejemplos. Más tamaño por sí mismo no certifica más biodiversidad.

## Cobertura del plan anterior

Se mantiene el documento de 50 como historia. Correspondencia de cada propuesta original con sus puntos ampliados:

| Original | Puntos del nuevo plan | Original | Puntos del nuevo plan |
|---|---|---|---|
| 1 | 1, 86 | 26 | 67 |
| 2 | 43 | 27 | 68 |
| 3 | 8, 16 | 28 | 69, 70 |
| 4 | 41 | 29 | 51 |
| 5 | 44, 50 | 30 | 85 |
| 6 | 46 | 31 | 31 |
| 7 | 47, 53 | 32 | 32 |
| 8 | 42, 45 | 33 | 33 |
| 9 | 2, 3 | 34 | 34 |
| 10 | 84 | 35 | 35 |
| 11 | 10, 90 | 36 | 36 |
| 12 | 5, 7 | 37 | 37 |
| 13 | 88 | 38 | 14, 15 |
| 14 | 19, 81 | 39 | 21, 22, 25 |
| 15 | 82 | 40 | 23, 24 |
| 16 | 6, 91 | 41 | 71 |
| 17 | 61, 62 | 42 | 72 |
| 18 | 13, 92 | 43 | 73 |
| 19 | 96, 97, 98 | 44 | 74 |
| 20 | 93, 94, 95 | 45 | 75, 99 |
| 21 | 87 | 46 | 76 |
| 22 | 63, 64 | 47 | 77 |
| 23 | 65 | 48 | 78 |
| 24 | 66 | 49 | 79 |
| 25 | 18, 52, 59, 60 | 50 | 83 |
