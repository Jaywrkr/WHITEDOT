# Android · vista previa instalable

Se reutiliza el juego actual en un WebView con archivos incluidos mediante `WebViewAssetLoader`. Desde alpha.57 requiere cuenta: el primer acceso necesita conexión; una sesión anterior permite continuar offline. No añade anuncios, cobros ni contenido. Android 8 o superior y Android System WebView actualizado; la primera comprobación se realiza en un emulador Android 15.

## Obtener y probar

El workflow **Android installable preview** compila y prueba solo esta rama. Su artefacto `WHITEDOT-Android-preview` contiene `WHITEDOT-preview.apk`, SHA-256, resultados, capturas y un vídeo corto del emulador. No publica en Google Play.

Sin teléfono: ver el vídeo y las capturas; para jugar, instalar Android Studio, crear un dispositivo en Device Manager y arrastrar el APK a su emulador. El emulador requiere virtualización disponible en el PC. No es necesario instalar el entorno Android para revisar el vídeo.

En un Android prestado, abrir el APK y permitir la instalación desde esa fuente. La edición de prueba usa `com.jaywrkr.whitedot.preview`. No desinstalar para actualizar: usar otro APK de la misma firma o `adb install -r WHITEDOT-preview.apk`. Desinstalar elimina los datos locales. La firma debug se conserva en caché de CI, pero no es una clave de producción ni tiene conservación garantizada; guardar una copia desde el menú antes de sustituir esta vista previa.

El progreso del navegador llega automáticamente al entrar con la misma cuenta y conexión. No hay acciones manuales de exportación/importación en el flujo normal. La app usa su propio origen HTTPS local estable. Los archivos se abren/guardan mediante el selector de Android, sin permiso general de almacenamiento. Exportación limitada a 64 MiB en este primer contenedor.

## Compilar

JDK 17, Android SDK 36, Gradle 8.13 y Node 18 o superior:

```sh
gradle -p android assembleDebug assembleDebugAndroidTest
```

El APK queda en `android/app/build/outputs/apk/debug/app-debug.apk`. Gradle copia los assets a su directorio de compilación; no modifica los módulos originales ni añade dependencias npm al juego. La actualización/offline pertenece al APK, por lo que su copia no incluye el service worker web. El sellado de metadatos reutiliza `stamp-deploy.mjs` con revisión y fecha de compilación reales.

## Resultado de esta vista previa

[CI Android aprobado](https://github.com/Jaywrkr/WHITEDOT/actions/runs/39277322334) sobre `7aeae6a`: APK firmado debug, Android 15 emulado y dos pruebas instrumentadas aprobadas. El artefacto descargado está en `outputs/android-preview/`, fuera del repositorio, con vídeo/capturas y SHA-256 verificado. Android muestra su aviso estándar de pantalla completa en el primer arranque; forma parte del sistema operativo. La reinstalación de prueba usa el mismo APK con `install -r`, no certifica migraciones futuras de formatos.

## Alcance de las pruebas

Contrato de assets, compilación e instalación reales; arranque sin wifi/datos; gesto táctil y AudioContext; menú/Atrás; Home/regreso; rotación; reinstalación conservando saldo y compra. El APK que se entrega no expone `runtime`: la instrumentación de AudioContext vive únicamente en el APK separado de pruebas. Capturas y vídeo proceden del emulador, no de un navegador con dimensiones móviles.

Pendientes antes de tienda: dispositivo físico y escucha humana, probar completamente selección/importación/exportación de archivos en diferentes proveedores Android, versiones adicionales de Android/WebView, clave de publicación y configuración de Play Console. Esta firma debug no sirve como entrega de pago.

Referencia técnica: [contenido local en WebView](https://developer.android.com/develop/ui/views/layout/webapps/load-local-content).

## Comprobación acotada de cuentas

`Android account preview` genera APK y APK de instrumentación en la rama de cuentas, sin publicar en tienda. Usa `-PaccountPreview` para `com.jaywrkr.whitedot.accounts`: instalación separada, sin borrar ni reemplazar los datos de la vista previa anterior. Firma debug exclusiva de prueba. El producto normal conserva su applicationId; no es una nueva edición comercial.

Prueba nueva: `requiresAccountBeforeWorld` sobre una instalación limpia comprueba la entrada obligatoria en el WebView real. Después Jay introduce su contraseña directamente en el emulador para comprobar el saldo con Supabase y la reapertura; nunca enviar la contraseña al chat. Los dos recorridos históricos anteriores son evidencia de un APK previo sin cuentas, no aceptación del nuevo acceso.

Resultado alpha.57: [compilación 0481194 aprobada](https://github.com/Jaywrkr/WHITEDOT/actions/runs/39334695709); ambos APKs descargados y SHA-256 contrastado con el manifiesto. Instalación separada en emulator-5580; `requiresAccountBeforeWorld` real aprobado (`OK (1 test)`, 5,25 s). Pantalla de entrada capturada y app abierta para que Jay introduzca su clave. Pendiente todavía acceso/saldo/reapertura con Supabase real; no equivale a dispositivo físico ni compra de tienda. El acceso local anterior tiene copia y ahora abre el APK de cuentas, sin borrar la aplicación previa.
