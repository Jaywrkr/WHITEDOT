# Después de V1 · publicar y abrir V2

La auditoría de [V1 RC1](AUDITORIA_V1.md) congela las funciones actuales. Este documento es un plan, no funciones ya implementadas. Una rama amplia por bloque, commit/push; Jay revisa PR/merge. No se inicia ninguna integración de servidor en esta sesión.

## 0. Publicar la versión individual

Elegir un host estático HTTPS (por ejemplo Cloudflare Pages, Netlify o equivalente) después de la aceptación de teléfono y CI. Preparar una release completa, probar subruta, caché/update/rollback, exportación/importación por cambio de origen y soporte básico. No se necesita base de datos ni cuenta para alojar el juego actual. Resultado: URL pública de la V1 congelada, sin mezclar código nuevo de V2.

## 1. Identidad y progreso sincronizado

Elegir proveedor y modelo de datos antes de escribir un login. Recomendación de diseño: partida anónima local sigue funcionando; iniciar sesión ofrece importar una copia explícitamente. Datos separados para perfil, progreso, favoritos/códigos, mascota y registros de búsqueda. Generador/semilla/versiones/capa/coordenadas viajan completos.

Revisiones de guardado en servidor, política de conflicto, exportación y recuperación; tratar el avance local como entrada a validar. No sumar automáticamente logros o mascotas de dos partidas. IndexedDB permite dividir históricos grandes y trabajar offline; colas con IDs y reintentos evitan duplicados. Aceptación: dos dispositivos guardan/recuperan sin pisarse, desconexión/reconexión y recuperación comprobadas.

## 2. Dos personas en el mismo mundo

Sala con semilla/versiones compatibles, presencia de puntos distinguibles, reloj musical compartido y papeles. Presupuesto conjunto de sonidos, notas cuantizadas y elección de quién aporta bajo/groove/melodía para que encontrarse no duplique toda la mezcla. Reconexión, latencia, participantes silenciados/que salen y propiedad de datos. Primero dueto acotado; después ampliar número de jugadores si la escucha lo admite.

No enviar audio continuamente como base del sistema: intercambiar eventos y tiempos para síntesis local compatible. Aceptación: verse/encontrarse y hacer música juntos en dos teléfonos reales, con retrasos y reconexión, manteniendo groove y claridad.

## 3. Afinar control, historia y memoria

Edición fina por cubo de hilos/suelos/Estudio, UI adaptable y zoom accesible; reducir notificaciones redundantes. Unir constancia de Jay, Camino, exploración y creación con voz contextual y objetivos opcionales claros. Memorias/recompensas expresivas y relaciones de mascota sin barras de mantenimiento ni castigos.

No volver a introducir escenas musicales guardables descartadas. Profundizar la frase que una criatura aprende y el uso de hallazgos en el Estudio, sin convertir todo en inventario. Aceptación: primera sesión entendible sin explicación externa y motivos para volver al mismo lugar.

## 4. Variedad que realmente se escucha y se juega

Medir diferencias de batería, bajo, armonía, timbre, densidad y evolución antes de ampliar nombres. Primer lote curado de nuevos motores/estilos, arreglos largos, tensión/resolución y mixer por buses. Comparaciones a oído, mono/estéreo, volúmenes y fatiga en teléfonos. Cada nuevo elemento debe tener varios comportamientos compatibles y presencia propia, con mapas versionados.

Ampliar las culturas con investigación concreta, vínculo con materiales/flora/fauna y mecanismos distintos; figuras/reliquias históricas solo con recursos y derechos documentados. Más búsquedas con espejos, color/luz, criaturas y puertas que cambien de verbo. Construcción/cableado/ecosistemas vienen después de validar esas reglas y sus costes.

Resultado buscado: mundos perceptiblemente diferentes, no multiplicaciones teóricas del catálogo ni millones de “canciones únicas” por declarar distintas semillas.
