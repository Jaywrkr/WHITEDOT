package com.jaywrkr.whitedot;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Base64;
import android.webkit.*;
import android.view.View;
import android.widget.Toast;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;
import org.json.JSONObject;
import java.io.OutputStream;
import java.util.Collections;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity {
    static final String ORIGIN = "https://appassets.androidplatform.net";
    static final String HOME = ORIGIN + "/assets/game/index.html";
    WebView web;
    final List<String> scriptErrors = new ArrayList<>();
    private ValueCallback<Uri[]> chooser;
    private byte[] pendingDownload;
    private boolean paused;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setNavigationBarColor(Color.BLACK);
        getWindow().setStatusBarColor(Color.BLACK);
        web = new WebView(this);
        web.setBackgroundColor(Color.BLACK);
        setContentView(web);
        web.setOnApplyWindowInsetsListener((view, insets) -> {
            view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                    insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets;
        });
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true); // Only user-selected document URIs; file:// stays disabled.
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setMediaPlaybackRequiresUserGesture(true);
        WebView.setWebContentsDebuggingEnabled((getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0);
        WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
        web.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("https".equals(uri.getScheme()) && "appassets.androidplatform.net".equals(uri.getHost())) return false;
                if (request.isForMainFrame() && request.hasGesture()
                        && ("https".equals(uri.getScheme()) || "mailto".equals(uri.getScheme()))) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); }
                    catch (android.content.ActivityNotFoundException error) { message("No hay una aplicación para abrir este enlace."); }
                }
                return true;
            }
            @Override public void onPageFinished(WebView view, String url) {
                if (paused) view.evaluateJavascript("window.__whitedotHost?.pause()", null);
            }
            @Override public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                view.destroy();
                recreate(); // The next load restores the existing local save.
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onConsoleMessage(ConsoleMessage entry) {
                android.util.Log.d("WHITEDOT", entry.message());
                if (entry.messageLevel() == ConsoleMessage.MessageLevel.ERROR && !entry.message().contains("404"))
                    scriptErrors.add(entry.message());
                return true;
            }
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (chooser != null) chooser.onReceiveValue(null);
                chooser = callback;
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT).setType("*/*").addCategory(Intent.CATEGORY_OPENABLE);
                try { startActivityForResult(intent, 10); }
                catch (android.content.ActivityNotFoundException error) { chooser.onReceiveValue(null); chooser = null; }
                return true;
            }
        });
        if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            WebViewCompat.addWebMessageListener(web, "AndroidFiles", Collections.singleton(ORIGIN),
                    (view, data, origin, mainFrame, reply) -> {
                        if (!mainFrame || !ORIGIN.equals(origin.toString()) || pendingDownload != null) return;
                        try {
                            JSONObject file = new JSONObject(data.getData());
                            String encoded = file.getString("data");
                            if (encoded.length() > 90 * 1024 * 1024) throw new IllegalArgumentException("size");
                            pendingDownload = Base64.decode(encoded, Base64.DEFAULT);
                            if (pendingDownload.length > 64 * 1024 * 1024) throw new IllegalArgumentException("size");
                            String name = file.optString("name", "whitedot").replaceAll("[^a-zA-Z0-9._-]", "_");
                            Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE)
                                    .setType(file.optString("type", "application/octet-stream")).putExtra(Intent.EXTRA_TITLE, name);
                            startActivityForResult(intent, 11);
                        } catch (Exception error) { pendingDownload = null; message("No se pudo preparar el archivo para guardar."); }
                    });
        }
        if (Build.VERSION.SDK_INT >= 33) getOnBackInvokedDispatcher().registerOnBackInvokedCallback(0, this::back);
        web.loadUrl(HOME);
    }
    private void message(String text) { Toast.makeText(this, text, Toast.LENGTH_LONG).show(); }
    private void back() {
        web.evaluateJavascript("(()=>{const greeting=document.getElementById('returnEntrance');if(greeting&&!greeting.hidden){document.getElementById('returnContinue').click();return true;}if(document.querySelector('.modal:not([hidden]),#rareNotice[data-inspect=\"true\"],#celebration[data-inspect=\"true\"]')){document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));return true;}return false;})()",
                handled -> { if (!"true".equals(handled)) finish(); });
    }
    @Override public void onBackPressed() { back(); }
    @Override protected void onPause() {
        paused = true;
        web.evaluateJavascript("window.__whitedotHost?.pause()", result -> { if (paused) { web.onPause(); web.pauseTimers(); } });
        super.onPause();
    }
    @Override protected void onResume() {
        super.onResume(); paused = false;
        if (web != null) { web.resumeTimers(); web.onResume(); web.evaluateJavascript("window.__whitedotHost?.resume()", null); }
    }
    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request == 10 && chooser != null) {
            chooser.onReceiveValue(result == RESULT_OK && data != null ? new Uri[]{data.getData()} : null); chooser = null;
        }
        if (request == 11) {
            byte[] bytes = pendingDownload; pendingDownload = null;
            if (result == RESULT_OK && data != null && bytes != null) {
                try (OutputStream out = getContentResolver().openOutputStream(data.getData())) { out.write(bytes); message("Archivo guardado."); }
                catch (Exception error) { message("No se pudo guardar el archivo."); }
            }
        }
    }
    @Override protected void onDestroy() {
        if (chooser != null) chooser.onReceiveValue(null);
        if (web != null) { web.resumeTimers(); web.destroy(); }
        super.onDestroy();
    }
}
