# Kubono: expediente para el panel creativo (22 de octubre de 2026)

## Qué es

«Un cubo. Un universo que suena.» Juego de exploración musical para móvil, web y escritorio. Eres un cubo blanco en un universo negro de puntos de luz; cada lugar tiene su música (generada en tiempo real con Web Audio) y lo que haces la cambia. Desarrollador independiente (Jay, Ecuador) con su hijo Luca como primer tester. Código: JavaScript nativo, Canvas 2D y Web Audio, sin motor. Todo el juego está en español. Precio previsto: pago único US$2,99 móvil / US$4,99 escritorio, sin anuncios ni suscripciones. Versión 2.3.0-alpha.96.

Repositorio legible en `/home/user/wtc` (269 módulos en `src/`). Archivos clave si quieres leer código: `src/audio.js` (motor musical), `src/musical-conductor.js`, `src/render.js`, `src/onboarding.js`, `src/interactions.js`, `src/data.js` (biomas, textos de La Voz), `src/house*.js` (Refugio), `src/cube-shop-*.js` (tienda), `docs/ARQUITECTURA.md`, `CAMBIOS.md`.

## Primeros minutos (así lo vive un jurado)

1. **Pantalla de cuenta obligatoria** (correo + clave de 12 caracteres). No hay invitado ni demo. Imagen: `frames/0-entrada-cuenta.png`.
2. Ventana «Descubre cómo suena el universo. Explora. Crea tu música. Conserva lo que encuentres. Arrastra hacia un cristal. Lanza un pulso para romperlo. Rompe diez para entrar al Mundo.» Imagen: `frames/1-primer-minuto.png`.
3. **Camino**: negro casi total, el cubo y unos cristales; pista «Arrastra para acercarte a un cristal · 1/6». HUD con «Día 1», «Era I · Pixel», «Caminado 0 m», «0 chispas», «Rompe cristales 0/10». Imagen: `frames/2-camino.png`.
4. Al romper diez cristales entras al **Mundo**.

## El Mundo

- 11 biomas (Llanura, Bosque, Lago, Ruinas, Jardín, Dunas, Cristales, Faros, Tormenta, Cueva, Vacío), cada uno con escala, tempo, kit rítmico, timbres y una consigna («Los pilares son tambores. Choca con ellos.», «El ácido sigue tu velocidad. Los rayos caen en el beat.», «Todo lo que tocas vuelve en eco.», «Nada. Solo tú y tus notas.»).
- Continentes sonoros con nombre, familia musical y tónica («Tierra de Origen · continente gigante · House y disco · tono de Do»); 52 géneros, mezclas híbridas, regiones con identidad musical.
- Capas: Subsuelo y Cielo.
- Fauna y criaturas que te siguen (linajes), clima, luz por hora real, cámara.
- El pulso rompe cristales; los fragmentos son «chispas» (moneda).
- 6 esculturas raras, 20 hallazgos (maravillas musicales: gramófono gigante, etc.), 30 tipos de actividad por semilla, 10 «encuentros traviesos» con humor (logros como «Abogado de las piedras», «El paraguas no sirve»).
- Tarjetas raras coleccionables con retrato vectorial.
- Autopiloto, saltos de pago (20 chispas) a otro lugar, favoritos, mapa, constelación de recorridos.
- Imágenes del Mundo en móvil: `frames/mundo-6.png`, `frames/mundo-13.png`, `../tienda/capturas/movil-1-mundo.png`, `../tienda/capturas/escritorio-1-mundo.png`. A esa escala se ve sobre todo negro con pequeños glifos de colores y el cubo con sombrero.

## Sistemas encima del núcleo

- **Tu cubo / Tienda:** 81 piezas compradas con chispas (formas de moverse, ojos, hábitos, accesorios, rastros, compañeros, formas y voces del pulso, sonidos del cubo, locuras, habilidades). Precio total 17030 ✦ (20–28 h de juego).
- **Logros:** 376 en 7 categorías; **Bitácora** con 6 pestañas (Hoy, Colección, Lugares, Música, Logros, Tú).
- **Refugio** (rediseñado ayer, antes una casa de muñecas): cuatro cámaras de luz que son partituras (horizontal = compás de 16 pasos, vertical = nota). Colocas 40 objetos ganados que suenan en su paso; un Prisma da ornamentos/sonidos/colores por 60 chispas; el Taller es un secuenciador radial; colección a la vista (paneles de tarjetas, constelación de logros, columnas con piezas compradas); criaturas de visita; se despliega desde el cubo donde estés; códigos para visitar el Refugio de otro. Imágenes: `../tienda/capturas/escritorio-3-refugio-entero.png`, `frames/refugio-5.png`.
- **Menú:** Tu cubo, Mundo, Refugio, Mapa, Bitácora, Sonido, Grabar set, Viajar a otra semilla, Compartir, Ajustes, Guía de juego. Imagen: `frames/3-menu.png`.
- Grabar set (exportar música), laboratorio musical, duetos históricos, cuenta y sincronización en la nube.
- Accesibilidad: lector de pantalla (resumen de cada cámara), teclado, movimiento reducido, calidad gráfica automática.

## Estética

Negro puro, blanco, dorado solo para lo ganado, Geist Mono, esquinas rectas, píxeles y líneas finas, textos breves en español. Cada bioma con color propio sutil.

## Audio

Música generativa en Web Audio: síntesis propia (bajos, leads, percusión, ruido), mezcla con limitador, reverb y delay, por región: escala, tempo, recetas rítmicas, géneros e híbridos. Las acciones tocan voces (pulso, objetos, criaturas, cristales); renders de prueba sin saturación a 44,1 y 48 kHz. Clips con audio real en `../tienda/clips/` (no puedes oírlos; describe lo que esperarías comprobar).

## Simulación previa: jurado de premios (5 perfiles)

Rúbrica 1–10: Visual, Audio, Creatividad, Sensación de juego, Cohesión, Pulido/accesibilidad.

| Juez | Visual | Audio | Creat. | Sensación | Cohesión | Pulido | Media |
|---|---|---|---|---|---|---|---|
| Marina (IGF audio) | 7 | 8,5 | 8 | 6 | 6 | 7 | 7,1 |
| Tomás (BAFTA arte) | 7 | 7,5 | 7,5 | 6 | 5,5 | 6,5 | 6,7 |
| Lucía (Apple Design) | 7,5 | 7,5 | 7 | 6 | 6 | 5 | 6,5 |
| Iñaki (IndieCade/Nuovo) | 7 | 8 | 7 | 6 | 4,5 | 6,5 | 6,5 |
| Ruth (Seumas McNally/TGA) | 7 | 8 | 7,5 | 6 | 5 | 6 | 6,6 |
| **Panel** | 7,1 | 7,9 | 7,4 | 6,0 | 5,4 | 6,2 | 6,7 |

Comentarios clave:
- Marina: la música suena aunque no hagas nada; quiere que la acción la provoque al instante y un clímax.
- Tomás: Mundo oscuro y vacío en móvil; HUD con texto en cada esquina.
- Lucía: la cuenta obligatoria mata el primer minuto; muchos menús y texto; falta tacto (vibración), «música visible».
- Iñaki: la idea es preciosa pero la tapan tienda, chispas, cápsulas, 376 logros, actividades, travesuras, campamentos… parece juego de servicio.
- Ruth: no hay arco ni final; todo es infinito y de igual intensidad; pide 3 momentos memorables y un cierre.

Plan del jurado: F1 build de festival (sin cuenta, sin tienda/cifras, ES+EN, viaje curado 30–45 min); F2 una idea (ocultar/fusionar sistemas, HUD mínimo); F3 música que responde (cambio audible en <1 compás, modulación entre regiones, clímax por bioma); F4 momentos firma y final (Refugio toca tu viaje); F5 sensación y vista (vibración, Mundo legible, color por bioma, música visible); F6 pruebas con personas y cierre.

## Objetivo de Jay

Que el juego pase a ser ganador: Seumas McNally Grand Prize del IGF y, si es posible, juego del año indie. Lo que Jay valora: que sea muy visual, armónico y artístico; ya rechazó lo infantil (la casa de muñecas). Restricciones técnicas: Canvas 2D + Web Audio, sin dependencias; conservar el progreso de los jugadores.
