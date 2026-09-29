# APK Studio AI - منصة بناء وفحص وتوليد تطبيقات أندرويد وAPK

منصة متكاملة لتحويل تطبيقات الويب إلى حزم أندرويد (APK / AAB) باستخدام Capacitor مع فحص ذكي للأخطاء بواسطة Google Gemini 3.8 Flash.

## المميزات الرئيسية
1. **بناء APK فوري ومباشر**:
   - توليد حزم `.apk` مباشرة قابلة للتثبيت.
   - حزمة مشروع أندرويد ستوديو كاملة مع Gradle Wrapper جاهزة للتشغيل (`./gradlew assembleDebug`).
   - خط بناء آلي عبر GitHub Actions (`.github/workflows/android.yml`).
2. **فحص وتصحيح الأخطاء بالذكاء الاصطناعي**:
   - فحص `capacitor.config.json` والصلاحيات `android-permissions.txt`.
   - كشف أخطاء الكود وتحسين الأداء واستجابة التطبيق.
3. **محاكي أندرويد تفاعلي**:
   - معاينة حية للتطبيق داخل إطار هاتف ذكي (Pixel / Galaxy).
   - اختبار مستشعرات الجهاز (الاهتزاز، الـ GPS، الإشعارات، الشبكة).

## خطوات البناء عبر GitHub Actions
1. ارفع المشروع إلى مستودع GitHub.
2. توجه إلى تبويب **Actions** واضغط على سير عمل **Build Android Direct APK**.
3. اضغط **Run workflow**. بعد اكتمال البناء خلال دقيقتين ستجد ملف الـ APK جاهزاً في قسم Artifacts.

## خطوات البناء اليدوي عبر السطر البرمجي
```bash
# تثبيت الاعتماديات
npm install

# بناء ملفات الويب
npm run build

# إضافة منصة أندرويد ومزامنتها
npx cap add android
npx cap sync android

# بناء ملف الـ APK
cd android
./gradlew assembleDebug
```
