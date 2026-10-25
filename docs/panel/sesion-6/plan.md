# Plan de corrección · K1–K5

**Propuesto, no implementado.** Una rama por fase desde la anterior si no está integrada. Commit/push a cada rama; Jay crea PR y merge. Se conserva la base alpha.181: generadores, semillas, biomas, flora, fauna, arte, cubo pequeño y progreso. Solo se modifica el arreglo del final5 autorizado por el feedback, la orientación y la interfaz.

| Fase | Rama | Problema que cierra |
|---|---|---|
| K1 · Llegar sin perderse | `pulido/k1-acceso-anillo` | U03, U04, U05, U06 |
| K2 · Final de cinco capítulos | `pulido/k2-final-viaje` | A04; aceptación concreta de V01 |
| K3 · Menú y pantallas claros | `pulido/k3-menu-adaptable` | U07, U08; coherencia U01/U02 |
| K4 · Un recorrido comprensible | `pulido/k4-guia-contextual` | U03/U04 y continuidad P01 |
| K5 · Cierre comprobado | `pulido/k5-validacion-real` | Regresiones, V01 y límites abiertos |

## K1 · Llegar sin perderse

- Una acción **Continuar · Jardín** al terminar el Viaje, en Lugares y como acción principal del menú. Gratis, con cero chispas y sin exigir haber visitado su portal. Reutiliza `ringGo` y el orden ya existente; no abre retos posteriores.
- Al preferir caminar, dirección bidimensional, destino y distancia discreta. La columna y el sonido acompañan; no sustituyen el rumbo. Sin mensajes constantes.
- Separar el ancla del anillo de desplegar la casa portátil: migrar una referencia estable desde las coordenadas vigentes, sin mover el universo, borrar estrellas o perder accesos previos. Mantener ruta válida al entrar/salir del Refugio, cambiar capa y saltar.
- Diferenciar **Otro paisaje · 20 ✦** de continuar retos. El salto exploratorio y el regreso gratis se conservan; no se cobra por el camino principal ni se promete llegar al anillo.
- Mostrar cinco de once completos y seis por descubrir. Distinguir regiones recorridas de retos.

**Bien cuando:** tras los créditos, Jardín comienza en como máximo dos acciones, desde dentro o fuera del Refugio, con saldo cero. Ocho rumbos señalan correctamente; la referencia se conserva al recargar/desplegar casa. Salto y regreso respetan saldo, posición y distancia caminada. Una migración fallida no modifica el guardado.

## K2 · Final de cinco capítulos

- Corregir únicamente `journey-finale`: las frases guardadas y su acompañamiento deben compartir armonía y un tempo coherente con el contexto elegido. Conservar ritmo y notas originales en el guardado; adaptar la interpretación al reproducir.
- Evitar otra melodía de ondas cuadradas que tape lo que se estaba escuchando. Reutilizar voces existentes, entradas espaciadas, balance y respiración; no añadir instrumentos, géneros ni cambiar la radio generativa.
- Ajustar ataques y colas para que el silencio anunciado exista y los créditos no reciban un pad residual. Salir/saltar cancela la salida del final sin cortar otras músicas.
- Ligar el pulso de cada círculo a su capa musical, conservando geometría y arte.
- La guardia de preservación se ajusta solo para permitir este arreglo expresamente solicitado; los otros generadores y assets siguen protegidos.

**Bien cuando:** contrato armónico con frases de los cinco biomas y transposiciones; render del recorrido real de llegada, final completo y salida anticipada. No hay ataques en el silencio y las colas cumplen un umbral documentado. Comparar también cierre breve y final11 para evitar regresiones. Jay acepta final5 en altavoz y auriculares: una medición de pico no sustituye esa escucha.

## K3 · Menú y pantallas claros

- Una acción Continuar y tres accesos de primer nivel: **Explorar**, **Tu cubo**, **Refugio**. Es una propuesta de jerarquía, no funciones nuevas. Colección y Ajustes como accesos secundarios claros; sonido dentro de Ajustes.
- Reubicar las herramientas en su contexto: creación en Refugio; guardar/viajar en exploración; colección en Bitácora; cuenta y copias en Ajustes. Conservar capacidades y IDs, eliminando accesos duplicados donde no aportan. Evitar otro cajón largo de Más.
- Menos subtítulos y bordes simultáneos; encabezado y cierre consistentes. Una jerarquía estable en PC y móvil, sin retocar el mundo dibujado. Menús silenciosos.
- Avisos de territorio: nombre y dato útil, texto limitado y legible; el resto en la ficha existente. Corregir mínimos de las columnas, ancho y ajuste de línea, no tapar el error con un recorte global. Integrar las capturas que Jay aporte.
- Revisar modal, fila de acciones, barra superior, safe areas, teclado, orientación y texto ampliado. Medir también hijos y texto recortado: el chequeo anterior solo de contenedores no basta.

**Bien cuando:** 320×568, 390×844, horizontal y escritorio; nombres largos reales y texto al 200 %. Sin hijos fuera del panel, acciones inaccesibles ni avisos superpuestos. Las funciones permanecen localizables y el siguiente lugar destaca antes que una compra. Capturas revisadas, no solo contadores DOM.

## K4 · Un recorrido comprensible

- Al abrir el mundo: **Cinco completos. Quedan seis por descubrir.** Una sola orientación contextual al siguiente lugar; sin un nuevo tutorial largo ni carrusel obligatorio.
- La guía muestra primero la acción que corresponde al estado actual. Reliquias, prácticas y exploración musical se consultan después, como actividades opcionales.
- Quitar contradicciones antiguas del glosario y de las etiquetas: retos/estrellas frente a regiones/chispas. No explicar de nuevo lo que ya aprendiste.
- Mantener el mismo destino en créditos, guía, menú, mapa y resultado. Tras cada reto, siguiente paso claro; al completar once, final y continuidad creativa ya existentes.

**Bien cuando:** alguien nuevo explica qué persigue, distingue retos de moneda y continúa sin instrucciones externas. No aparecen ayudas repetidas al volver ni se borra lo aprendido. Nunca se fuerza una compra para progresar.

## K5 · Cierre comprobado

- Regresiones enfocadas durante K1–K4; comprobar una vez el candidato completo antes de integrar. No repetir suites pesadas por cada cambio de texto.
- Una prueba real de punta a punta comienza en los créditos con cero chispas, abre Jardín sin inyectar su coordenada, continúa a Dunas y conserva progreso al recargar. Otra cubre la ruta a pie y el Refugio portátil.
- Render específico final5 con frases conocidas, llegada real, pausas/salida y variantes de tono; comparar los otros finales. Escucha física de Jay y cinco sesiones sin ayuda, dos con personas poco habituadas a jugar, como ya pide V01. Registrar tiempo hasta Jardín, desvíos y uso de ayuda.
- Reevaluar los mismos IDs y seis ejes. Si falla una aceptación, corregir su fase; no crear otra expansión para subir la nota. Publicar evidencia, versión y pendientes reales.

**Bien cuando:** fallos descritos reproducidos y corregidos, lógica/navegador/audio del candidato aprobados, UI aceptada en teléfono y final5 aceptado al oído. La puntuación orienta; un 10 simulado no decide el cierre. Ningún servicio o tienda se configura en este plan.
