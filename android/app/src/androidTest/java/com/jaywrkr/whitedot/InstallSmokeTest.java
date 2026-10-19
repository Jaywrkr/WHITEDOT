package com.jaywrkr.whitedot;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.os.SystemClock;
import android.view.MotionEvent;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.io.File;
import java.io.FileOutputStream;
import java.util.Collections;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.Assert.*;

@RunWith(AndroidJUnit4.class)
public class InstallSmokeTest {
    private final android.app.Instrumentation instrumentation = InstrumentationRegistry.getInstrumentation();
    private MainActivity activity;
    private void start() throws Exception {
        Intent intent = new Intent(instrumentation.getTargetContext(), MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        activity = (MainActivity) instrumentation.startActivitySync(intent);
        until("document.readyState==='complete'&&!!document.getElementById('hcGo')");
    }
    private String js(String source) throws Exception {
        AtomicReference<String> value = new AtomicReference<>();CountDownLatch done = new CountDownLatch(1);
        instrumentation.runOnMainSync(() -> activity.web.evaluateJavascript(source, result -> { value.set(result);done.countDown(); }));
        assertTrue("JavaScript callback: " + source, done.await(10, TimeUnit.SECONDS));return value.get();
    }
    private void until(String predicate) throws Exception {
        long end = SystemClock.uptimeMillis() + 35000;
        while (SystemClock.uptimeMillis() < end) { if ("true".equals(js(predicate))) return;Thread.sleep(200); }
        fail("Timed out: " + predicate + " errors=" + activity.scriptErrors);
    }
    private void screenshot(String name) throws Exception {
        Bitmap image = instrumentation.getUiAutomation().takeScreenshot();
        try (FileOutputStream out = new FileOutputStream(new File(activity.getExternalFilesDir(null), name))) {
            assertNotNull(image);image.compress(Bitmap.CompressFormat.PNG, 100, out);
        }
    }
    @Test public void launchOfflineRotateAndResume() throws Exception {
        start();
        assertTrue(WebViewFeature.isFeatureSupported(WebViewFeature.DOCUMENT_START_SCRIPT));
        instrumentation.runOnMainSync(() -> {
            WebViewCompat.addDocumentStartJavaScript(activity.web,
                    "window.__testAudio=[];window.__suspendCount=0;const AC=window.AudioContext;window.AudioContext=new Proxy(AC,{construct(T,a){const c=new T(...a),s=c.suspend.bind(c);c.suspend=()=>{__suspendCount++;return s();};__testAudio.push(c);return c;}});",
                    Collections.singleton(MainActivity.ORIGIN));
            activity.web.reload();
        });
        until("document.readyState==='complete'&&!!document.getElementById('hcGo')&&typeof window.__whitedotHost==='object'");
        js("document.getElementById('returnContinue').click();document.getElementById('hcGo').click()");
        Thread.sleep(700);
        int[] location = new int[2];instrumentation.runOnMainSync(() -> activity.web.getLocationOnScreen(location));
        float x = location[0] + activity.web.getWidth() / 2f, y = location[1] + activity.web.getHeight() / 2f;
        long now = SystemClock.uptimeMillis();
        instrumentation.sendPointerSync(MotionEvent.obtain(now, now, MotionEvent.ACTION_DOWN, x, y, 0));
        instrumentation.sendPointerSync(MotionEvent.obtain(now, now + 80, MotionEvent.ACTION_UP, x, y, 0));
        until("__testAudio.some(c=>c.state==='running')");
        screenshot("android-portrait.png");
        js("document.getElementById('bMenu').click()");until("!document.getElementById('mMenu').hidden");
        screenshot("android-menu.png");
        instrumentation.runOnMainSync(() -> activity.onBackPressed());until("document.getElementById('mMenu').hidden");
        instrumentation.getUiAutomation().executeShellCommand("input keyevent 3").close();Thread.sleep(1000);
        Intent resume = new Intent(instrumentation.getTargetContext(), MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        instrumentation.getTargetContext().startActivity(resume);
        until("__suspendCount>0&&__testAudio.some(c=>c.state==='running')");
        instrumentation.runOnMainSync(() -> activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE));
        until("innerWidth>innerHeight");screenshot("android-landscape.png");
        assertEquals("false", js("document.documentElement.scrollWidth>innerWidth+1"));
        instrumentation.runOnMainSync(() -> activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT));
        until("innerHeight>innerWidth");Thread.sleep(2500);
        // Seed a valid non-empty wallet using the installed save format, then verify across reinstall -r.
        js("(()=>{const k='pixel-blanco-v4',s=JSON.parse(localStorage.getItem(k));s.sparks=137;s.sparkEconomy.earned=177;s.sparkEconomy.spent=40;s.sparkEconomy.purchases.dust=true;s.sparkEconomy.equipped='dust';localStorage.setItem(k,JSON.stringify(s));localStorage.setItem('android-update-probe','137:dust');})()");
        assertTrue(activity.scriptErrors.toString(), activity.scriptErrors.isEmpty());
        instrumentation.runOnMainSync(() -> activity.finish());
    }
    @Test public void preservesSaveAfterApkReplacement() throws Exception {
        start();
        assertEquals("\"137:dust\"", js("localStorage.getItem('android-update-probe')"));
        until("(()=>{const s=JSON.parse(localStorage.getItem('pixel-blanco-v4'));return s?.sparks===137&&s.sparkEconomy.purchases.dust&&s.sparkEconomy.equipped==='dust';})()");
        assertTrue(activity.scriptErrors.toString(), activity.scriptErrors.isEmpty());
        screenshot("android-after-update.png");
        instrumentation.runOnMainSync(() -> activity.finish());
    }
}
