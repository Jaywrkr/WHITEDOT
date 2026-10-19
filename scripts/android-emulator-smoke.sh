#!/usr/bin/env bash
set -euo pipefail
app=com.jaywrkr.whitedot.preview
apk=android/app/build/outputs/apk/debug/app-debug.apk
testapk=android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk
adb install -r "$apk"
adb install -r "$testapk"
adb shell svc wifi disable
adb shell svc data disable
adb shell screenrecord --time-limit 120 /sdcard/whitedot-preview.mp4 > android-evidence/recording.log 2>&1 &
recording=$!
trap 'adb shell pkill -2 screenrecord || true; wait "$recording" || true; adb pull /sdcard/whitedot-preview.mp4 android-evidence/WHITEDOT-emulator.mp4 || true; adb pull /sdcard/Android/data/'"$app"'/files/. android-evidence/ || true; adb logcat -d > android-evidence/logcat.txt' EXIT
adb shell am instrument -w -e class com.jaywrkr.whitedot.InstallSmokeTest\#launchOfflineRotateAndResume "$app.test/androidx.test.runner.AndroidJUnitRunner" | tee android-evidence/launch-test.txt
grep -q 'OK (1 test)' android-evidence/launch-test.txt
adb shell am force-stop "$app"
adb install -r "$apk"
adb shell am instrument -w -e class com.jaywrkr.whitedot.InstallSmokeTest\#preservesSaveAfterApkReplacement "$app.test/androidx.test.runner.AndroidJUnitRunner" | tee android-evidence/update-test.txt
grep -q 'OK (1 test)' android-evidence/update-test.txt
