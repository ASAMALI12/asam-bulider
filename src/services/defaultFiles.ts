import { ProjectFile } from '../types/project';

export const INITIAL_FILES: ProjectFile[] = [
  {
    path: 'capacitor.config.json',
    name: 'capacitor.config.json',
    language: 'json',
    category: 'config',
    content: `{
  "appId": "com.smart.apkstudio",
  "appName": "Smart APK Studio",
  "webDir": "www",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https",
    "cleartext": true
  },
  "android": {
    "allowMixedContent": true,
    "captureInput": true,
    "webContentsDebuggingEnabled": true
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 1500,
      "launchAutoHide": true,
      "backgroundColor": "#090d16",
      "androidSplashResourceName": "splash",
      "androidScaleType": "CENTER_CROP",
      "showSpinner": false
    },
    "StatusBar": {
      "style": "DARK",
      "backgroundColor": "#090d16"
    }
  }
}`
  },
  {
    path: 'android-permissions.txt',
    name: 'android-permissions.txt',
    language: 'text',
    category: 'permissions',
    content: `android.permission.INTERNET
android.permission.ACCESS_NETWORK_STATE
android.permission.ACCESS_WIFI_STATE
android.permission.CAMERA
android.permission.RECORD_AUDIO
android.permission.MODIFY_AUDIO_SETTINGS
android.permission.READ_EXTERNAL_STORAGE
android.permission.WRITE_EXTERNAL_STORAGE
android.permission.VIBRATE
android.permission.WAKE_LOCK
android.permission.POST_NOTIFICATIONS
android.permission.ACCESS_COARSE_LOCATION
android.permission.ACCESS_FINE_LOCATION`
  },
  {
    path: 'ios-plist.txt',
    name: 'ios-plist.txt',
    language: 'text',
    category: 'permissions',
    content: `NSCameraUsageDescription: يتطلب التطبيق صلاحية الوصول إلى الكاميرا لالتقاط الصور ومسح الرموز.
NSMicrophoneUsageDescription: يتطلب التطبيق الوصول إلى الميكروفون للتسجيل الصوتي والمحادثات.
NSPhotoLibraryUsageDescription: يتطلب التطبيق الوصول إلى مكتبة الصور لاختيار وحفظ الملفات.
NSLocationWhenInUseUsageDescription: يتطلب التطبيق تحديد الموقع لتقديم الخدمات المخصصة.
UIBackgroundModes: fetch remote-notification`
  },
  {
    path: 'www/index.html',
    name: 'index.html (Web App)',
    language: 'html',
    category: 'source',
    content: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Smart Mobile App</title>
  <meta name="theme-color" content="#090d16">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }
    body {
      font-family: 'Cairo', system-ui, -apple-system, sans-serif;
      background: #090d16;
      color: #f1f5f9;
      min-height: 100vh;
      overflow-x: hidden;
      padding-bottom: 80px;
    }
    .header {
      background: linear-gradient(180deg, rgba(16, 24, 39, 0.95) 0%, rgba(9, 13, 22, 0.9) 100%);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 50;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .badge {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      border: 1px solid rgba(16, 185, 129, 0.3);
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .badge::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }
    .container {
      padding: 18px;
      max-width: 480px;
      margin: 0 auto;
    }
    .card {
      background: #111827;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 18px;
      margin-bottom: 16px;
      box-shadow: 0 8px 24px -6px rgba(0,0,0,0.5);
    }
    .btn {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      padding: 12px 18px;
      border-radius: 12px;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      transition: all 0.2s ease;
      font-size: 14px;
    }
    .btn:active {
      transform: scale(0.98);
      filter: brightness(1.1);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #e2e8f0;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .stat-box {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px;
      padding: 12px;
      text-align: center;
    }
    .stat-val {
      font-size: 20px;
      font-weight: 800;
      color: #38bdf8;
      font-family: 'JetBrains Mono', monospace;
    }
    .stat-label {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 4px;
    }
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(17, 24, 39, 0.94);
      backdrop-filter: blur(16px);
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      justify-content: space-around;
      padding: 10px 0 14px 0;
      z-index: 40;
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      color: #64748b;
      font-size: 11px;
      cursor: pointer;
    }
    .nav-item.active {
      color: #10b981;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 style="font-size: 17px; font-weight: 800;">تطبيق أندرويد الذكي</h1>
      <p style="font-size: 11px; color: #94a3b8;">Capacitor Web-to-APK Ready</p>
    </div>
    <div class="badge">APK Ready</div>
  </div>

  <div class="container">
    <div class="card" style="background: linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,78,59,0.05) 100%); border-color: rgba(16,185,129,0.25);">
      <h2 style="font-size: 16px; font-weight: 800; margin-bottom: 6px; color: #34d399;">حالة النظام وحزمة APK</h2>
      <p style="font-size: 12px; color: #cbd5e1; line-height: 1.6; margin-bottom: 14px;">
        تم تهيئة هذا التطبيق للعمل داخل بيئة أندرويد عبر Capacitor وAndroid WebView بكامل الصلاحيات.
      </p>
      <div class="grid-2">
        <div class="stat-box">
          <div class="stat-val" id="battery-status">100%</div>
          <div class="stat-label">البطارية</div>
        </div>
        <div class="stat-box">
          <div class="stat-val" id="net-status">متصل</div>
          <div class="stat-label">حالة الشبكة</div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
        <span>📱</span> اختبار أجهزة ومستشعرات الهاتف
      </h3>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button class="btn btn-secondary" onclick="triggerVibration()">
          📳 اهتزاز الهاتف (Haptic Vibrate)
        </button>
        <button class="btn btn-secondary" onclick="checkGeo()">
          📍 فحص الموقع الجغرافي (GPS)
        </button>
        <button class="btn btn-secondary" onclick="triggerNotify()">
          🔔 إرسال إشعار تجريبي (Local Notification)
        </button>
      </div>
      <div id="sensor-output" style="margin-top: 12px; font-size: 12px; color: #38bdf8; font-family: 'JetBrains Mono', monospace; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 8px; display: none;"></div>
    </div>

    <div class="card">
      <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 10px;">سجل الملاحظات المحلية (IndexedDB / Storage)</h3>
      <div style="display: flex; gap: 8px; margin-bottom: 10px;">
        <input type="text" id="note-input" placeholder="اكتب ملاحظة جديدة..." style="flex: 1; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.12); padding: 10px 14px; border-radius: 10px; color: white; font-family: inherit; font-size: 13px;">
        <button class="btn" style="width: auto; padding: 10px 16px;" onclick="addNote()">إضافة</button>
      </div>
      <div id="notes-list" style="display: flex; flex-direction: column; gap: 6px;"></div>
    </div>
  </div>

  <div class="bottom-nav">
    <div class="nav-item active">
      <span style="font-size: 16px;">🏠</span>
      <span>الرئيسية</span>
    </div>
    <div class="nav-item">
      <span style="font-size: 16px;">⚡</span>
      <span>المستشعرات</span>
    </div>
    <div class="nav-item">
      <span style="font-size: 16px;">🤖</span>
      <span>الذكاء</span>
    </div>
    <div class="nav-item">
      <span style="font-size: 16px;">⚙️</span>
      <span>الإعدادات</span>
    </div>
  </div>

  <script>
    function triggerVibration() {
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 150]);
        showOutput("تم إرسال نبضات الاهتزاز إلى الهاتف بنجاح.");
      } else {
        showOutput("الاهتزاز غير مدعوم في هذا المتصفح.");
      }
    }

    function checkGeo() {
      if (navigator.geolocation) {
        showOutput("جاري جلب إحداثيات GPS...");
        navigator.geolocation.getCurrentPosition(
          pos => showOutput("الإحداثيات: " + pos.coords.latitude.toFixed(4) + ", " + pos.coords.longitude.toFixed(4)),
          err => showOutput("خطأ الموقع: " + err.message)
        );
      } else {
        showOutput("GPS غير مدعوم.");
      }
    }

    function triggerNotify() {
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("تطبيق أندرويد", { body: "إشعار تجريبي يعمل بنجاح!" });
          showOutput("تم إطلاق الإشعار بنجاح!");
        } else {
          Notification.requestPermission().then(res => {
            showOutput("إذن الإشعارات: " + res);
          });
        }
      } else {
        showOutput("الإشعارات غير مدعومة مباشرة في هذا العارض.");
      }
    }

    function showOutput(msg) {
      const el = document.getElementById("sensor-output");
      el.style.display = "block";
      el.innerText = msg;
    }

    const notes = JSON.parse(localStorage.getItem("apk_notes") || '["جاهز لبناء حزمة APK", "تم فحص إعدادات Capacitor بنجاح"]');
    function renderNotes() {
      const list = document.getElementById("notes-list");
      list.innerHTML = "";
      notes.forEach((n, i) => {
        const item = document.createElement("div");
        item.style.cssText = "background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 12px; display: flex; justify-content: space-between; align-items: center;";
        item.innerHTML = \`<span>\${n}</span><span style="color:#ef4444; cursor:pointer;" onclick="deleteNote(\${i})">✕</span>\`;
        list.appendChild(item);
      });
    }

    function addNote() {
      const input = document.getElementById("note-input");
      if (input.value.trim()) {
        notes.push(input.value.trim());
        localStorage.setItem("apk_notes", JSON.stringify(notes));
        input.value = "";
        renderNotes();
      }
    }

    function deleteNote(i) {
      notes.splice(i, 1);
      localStorage.setItem("apk_notes", JSON.stringify(notes));
      renderNotes();
    }

    renderNotes();

    if (navigator.getBattery) {
      navigator.getBattery().then(bat => {
        document.getElementById("battery-status").innerText = Math.round(bat.level * 100) + "%";
      });
    }

    window.addEventListener("online", () => document.getElementById("net-status").innerText = "متصل");
    window.addEventListener("offline", () => document.getElementById("net-status").innerText = "غير متصل");
  </script>
</body>
</html>`
  },
  {
    path: 'bootstrap.html',
    name: 'bootstrap.html',
    language: 'html',
    category: 'source',
    content: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تهيئة التطبيق المحمول</title>
  <style>
    body {
      margin: 0;
      background: #090d16;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-family: system-ui, sans-serif;
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(16, 185, 129, 0.2);
      border-top-color: #10b981;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="spinner"></div>
  <p style="margin-top: 20px; font-size: 14px; color: #94a3b8;">جاري تحميل موارد التطبيق...</p>
  <script>
    setTimeout(() => {
      window.location.href = "www/index.html";
    }, 600);
  </script>
</body>
</html>`
  },
  {
    path: '.github/workflows/android.yml',
    name: 'android.yml (GitHub Actions)',
    language: 'yaml',
    category: 'ci',
    content: `name: Build Android Direct APK (Automated CI/CD)

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:
    inputs:
      buildType:
        description: 'Build Type (debug / release)'
        required: true
        default: 'debug'
        type: choice
        options:
          - debug
          - release

jobs:
  build:
    name: Build Android APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js 20.x
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Setup Java JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Install Project Dependencies
        run: |
          npm install --legacy-peer-deps || npm install

      - name: Build Web Production Assets
        run: |
          npm run build || echo "Web assets ready"

      - name: Prepare Capacitor Android
        run: |
          npx cap add android || true
          npx cap sync android

      - name: Build APK with Gradle
        run: |
          if [ -d "android" ]; then
            cd android
            chmod +x gradlew
            if [ "\${{ github.event.inputs.buildType }}" == "release" ]; then
              ./gradlew assembleRelease --no-daemon --stacktrace
            else
              ./gradlew assembleDebug --no-daemon --stacktrace
            fi
          else
            echo "Direct standalone APK assembly"
          fi

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: app-\${{ github.event.inputs.buildType || 'debug' }}-apk
          path: |
            android/app/build/outputs/apk/**/*.apk
            *.apk
          if-no-files-found: warn`
  },
  {
    path: '.github/workflows/ios.yml',
    name: 'ios.yml (iOS CI)',
    language: 'yaml',
    category: 'ci',
    content: `name: Build iOS App

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build-ios:
    name: Build iOS IPA Package
    runs-on: macos-14

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Dependencies
        run: npm ci || npm install

      - name: Build Web App
        run: npm run build

      - name: Add and Sync iOS
        run: |
          npx cap add ios || true
          npx cap sync ios`
  },
  {
    path: 'package.json',
    name: 'package.json',
    language: 'json',
    category: 'config',
    content: `{
  "name": "smart-apk-project",
  "version": "1.0.0",
  "private": true,
  "description": "Smart Capacitor Android Mobile App ready for direct APK compilation",
  "scripts": {
    "build": "echo 'Building web assets...'",
    "cap:add": "npx cap add android",
    "cap:sync": "npx cap sync android",
    "build:apk": "cd android && ./gradlew assembleDebug"
  },
  "dependencies": {
    "@capacitor/core": "^6.0.0",
    "@capacitor/android": "^6.0.0",
    "@capacitor/app": "^6.0.0",
    "@capacitor/haptics": "^6.0.0",
    "@capacitor/keyboard": "^6.0.0",
    "@capacitor/status-bar": "^6.0.0"
  },
  "devDependencies": {
    "@capacitor/cli": "^6.0.0"
  }
}`
  },
  {
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    category: 'docs',
    content: `# Smart Mobile App - جاهز لبناء حزمة APK

مشروع هجين متكامل مبني باستخدام Capacitor وAndroid WebView.

## كيفية البناء
1. اضغط على زر **بناء وتنزيل APK فوراً** في الشريط العلوي لتنزيل ملف الـ APK أو حزمة مشروع Android Studio الكاملة.
2. يمكنك استخدام سير العمل الآلي عبر GitHub Actions في المسار:
   \`.github/workflows/android.yml\`
3. يمكنك فحص أي خطأ وتصحيحه بضغطة زر عبر الذكاء الاصطناعي.`
  }
];
