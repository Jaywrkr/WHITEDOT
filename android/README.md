# Android · vista previa instalable

Se reutiliza el juego actual en un WebView con archivos incluidos mediante `WebViewAssetLoader`. No necesita conexión para arrancar; las funciones del servidor opcional conservan sus límites. No añade anuncios, cobros, cuentas ni contenido. Android 8 o superior y Android System WebView actualizado; la primera comprobación se realiza en un emulador Android 15.

## Obtener y probar

El workflow **Android installable preview** compila y prueba solo esta rama. Su artefacto `WHITEDOT-Android-preview` contiene `WHITEDOT-preview.apk`, SHA-256, resultados, capturas y un vídeo corto del emulador. No publica en Google Play.

Sin teléfono: ver el vídeo y las capturas; para jugar, instalar Android Studio, crear un dispositivo en Device Manager y arrastrar el APK a su emulador. El emulador requiere virtualización disponible en el PC. No es necesario instalar el entorno Android para revisar el vídeo.

En un Android prestado, abrir el APK y permitir la instalación desde esa fuente. La edición de prueba usa `com.jaywrkr.whitedot.preview`. No desinstalar para actualizar: usar otro APK de la misma firma o `adb install -r WHITEDOT-preview.apk`. Desinstalar elimina los datos locales. La firma debug se conserva en caché de CI, pero no es una clave de producción ni tiene conservación garantizada; guardar una copia desde el menú antes de sustituir esta vista previa.

Los datos del navegador no aparecen automáticamente en la aplicación: exportar una copia desde la web e importarla con el menú existente. La app usa su propio origen HTTPS local estable. Los archivos se abren/guardan mediante el selector de Android, sin permiso general de almacenamiento. Exportación limitada a 64 MiB en este primer contenedor.

## Compilar

JDK 17, Android SDK 36, Gradle 8.13 y Node 18 o superior:

```sh
gradle -p android assembleDebug assembleDebugAndroidTest
```

El APK queda en `android/app/build/outputs/apk/debug/app-debug.apk`. Gradle copia los assets a su directorio de compilación; no modifica los módulos originales ni añade dependencias npm al juego. La actualización/offline pertenece al APK, por lo que su copia no incluye el service worker web. El sellado de metadatos reutiliza `stamp-deploy.mjs` con revisión y fecha de compilación reales.

## Alcance de las pruebas

Contrato de assets, compilación e instalación reales; arranque sin wifi/datos; gesto táctil y AudioContext; menú/Atrás; Home/regreso; rotación; reinstalación conservando saldo y compra. El APK que se entrega no expone `runtime`: la instrumentación de AudioContext vive únicamente en el APK separado de pruebas. Capturas y vídeo proceden del emulador, no de un navegador con dimensiones móviles.

Pendientes antes de tienda: dispositivo físico y escucha humana, probar completamente selección/importación/exportación de archivos en diferentes proveedores Android, versiones adicionales de Android/WebView, clave de publicación y configuración de Play Console. Esta firma debug no sirve como entrega de pago.

Referencia técnica: [contenido local en WebView](https://developer.android.com/develop/ui/views/layout/webapps/load-local-content).
