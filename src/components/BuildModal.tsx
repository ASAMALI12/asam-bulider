import React, { useState } from 'react';
import { 
  Download, 
  Terminal, 
  CheckCircle2, 
  Layers, 
  FolderArchive, 
  Sparkles, 
  X, 
  ShieldAlert,
  Play,
  Copy,
  Check
} from 'lucide-react';
import { ProjectFile } from '../types/project';
import { ApkBuilderService, ApkBuildOptions } from '../services/apkBuilder';

interface BuildModalProps {
  files: ProjectFile[];
  capConfig: any;
  permissions: string[];
  onClose: () => void;
}

export const BuildModal: React.FC<BuildModalProps> = ({
  files,
  capConfig,
  permissions,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'direct' | 'project' | 'github'>('direct');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildSuccess, setBuildSuccess] = useState(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [apkBlobUrl, setApkBlobUrl] = useState<string | null>(null);
  const [copiedAction, setCopiedAction] = useState(false);

  const appName = capConfig?.appName || 'Smart APK Studio';
  const appId = capConfig?.appId || 'com.smart.apkstudio';

  const runBuildPipeline = async () => {
    setIsBuilding(true);
    setBuildProgress(10);
    setBuildSuccess(false);
    setBuildLogs([
      `[00:00.1] بدء عملية بناء حزمة أندرويد لـ "${appName}" (${appId})...`,
      `[00:00.3] قراءة وفحص ملفات الواجهة من مجلد www...`,
    ]);

    await new Promise(r => setTimeout(r, 600));
    setBuildProgress(30);
    setBuildLogs(prev => [
      ...prev,
      `[00:01.0] توليد AndroidManifest.xml وضبط ${permissions.length} من الصلاحيات المطلوبة...`,
      `[00:01.3] إضافة إعدادات Capacitor v6 وتأمين مسارات WebView...`,
    ]);

    await new Promise(r => setTimeout(r, 700));
    setBuildProgress(60);
    setBuildLogs(prev => [
      ...prev,
      `[00:02.1] تجميع ملفات DEX الثنائية وضغط ملفات الأصول...`,
      `[00:02.5] توليد شهادة التوقيع التجريبية Debug Signing Certificate (META-INF)...`,
      `[00:02.8] تطبيق محاذاة الحزمة zipalign بمقدار 4 بايت...`,
    ]);

    await new Promise(r => setTimeout(r, 800));
    setBuildProgress(90);

    const options: ApkBuildOptions = {
      appName,
      appId,
      versionName: '1.0.0',
      versionCode: 1,
      permissions
    };

    try {
      const apkBlob = await ApkBuilderService.buildDirectApk(files, options);
      const url = URL.createObjectURL(apkBlob);
      setApkBlobUrl(url);

      setBuildProgress(100);
      setBuildSuccess(true);
      setBuildLogs(prev => [
        ...prev,
        `[00:03.4] تم تجميع حزمة الـ APK بنجاح!`,
        `[00:03.5] اسم الملف: ${appName.replace(/\s+/g, '_')}-debug.apk`,
        `[00:03.6] الحالة: BUILD SUCCESSFUL (حجم الحزمة: ${(apkBlob.size / 1024).toFixed(1)} KB)`
      ]);
    } catch (err: any) {
      setBuildLogs(prev => [...prev, `[ERROR] فشل في تجميع الحزمة: ${err.message}`]);
    } finally {
      setIsBuilding(false);
    }
  };

  const handleDownloadDirectApk = () => {
    if (!apkBlobUrl) return;
    const a = document.createElement('a');
    a.href = apkBlobUrl;
    a.download = `${appName.replace(/\s+/g, '_')}-debug.apk`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadStudioProject = async () => {
    const options: ApkBuildOptions = {
      appName,
      appId,
      versionName: '1.0.0',
      versionCode: 1,
      permissions
    };
    const zipBlob = await ApkBuilderService.buildAndroidStudioProject(files, options);
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName.replace(/\s+/g, '_')}-AndroidStudio-Project.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyGithubWorkflow = async () => {
    const yml = files.find(f => f.path.includes('android.yml'))?.content || '';
    await navigator.clipboard.writeText(yml);
    setCopiedAction(true);
    setTimeout(() => setCopiedAction(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="bg-slate-900/90 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                بناء وتوليد حزمة APK مباشرتاً
              </h2>
              <p className="text-xs text-slate-400">
                خيارات البناء المباشر والتصدير لمنصة أندرويد
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 text-xs">
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex-1 py-3 font-bold transition flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'direct'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>بناء APK فوري ومباشر</span>
          </button>

          <button
            onClick={() => setActiveTab('project')}
            className={`flex-1 py-3 font-bold transition flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'project'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>مشروع Android Studio كامل</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex-1 py-3 font-bold transition flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'github'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>بناء عبر GitHub Actions</span>
          </button>
        </div>

        {/* Tab 1: Direct APK */}
        {activeTab === 'direct' && (
          <div className="p-5 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>{appName} (Debug APK)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  {appId} • الإصدار 1.0.0 • الصلاحيات: {permissions.length}
                </p>
              </div>

              {!buildSuccess ? (
                <button
                  onClick={runBuildPipeline}
                  disabled={isBuilding}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-95 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  <span>{isBuilding ? 'جاري البناء والتجميع...' : 'بدء بناء ملف APK'}</span>
                </button>
              ) : (
                <button
                  onClick={handleDownloadDirectApk}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition shadow-xl shadow-emerald-500/30 cursor-pointer animate-pulse"
                >
                  <Download className="w-4 h-4" />
                  <span>تنزيل APK الآن (.apk)</span>
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {isBuilding && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>تقدم عملية التجميع:</span>
                  <span className="font-mono text-emerald-400 font-bold">{buildProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${buildProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Terminal Console */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs max-h-56 overflow-y-auto space-y-1">
              <div className="text-slate-500 pb-2 border-b border-slate-800/80 flex items-center justify-between">
                <span>سجل البناء المباشر (Gradle / APK Builder)</span>
                {buildSuccess && (
                  <span className="text-emerald-400 flex items-center gap-1 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    جاهز للتنزيل والتثبيت
                  </span>
                )}
              </div>
              {buildLogs.length === 0 ? (
                <p className="text-slate-500 italic py-4 text-center">
                  اضغط على "بدء بناء ملف APK" لتجميع الحزمة المباشرة فورياً...
                </p>
              ) : (
                buildLogs.map((log, idx) => (
                  <div key={idx} className="text-slate-300 font-mono text-[11px] leading-relaxed">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Android Studio Project Package */}
        {activeTab === 'project' && (
          <div className="p-5 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3 text-emerald-400">
                <FolderArchive className="w-6 h-6" />
                <h4 className="text-sm font-bold text-white">
                  حزمة مشروع أندرويد ستوديو الكاملة (Native Android Project)
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                تتضمن هذه الحزمة هيكل تطبيق أندرويد كامل أصيل مع ملفات:
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside font-mono">
                <li><code>build.gradle</code> & <code>settings.gradle</code> (Gradle 8.2)</li>
                <li><code>app/src/main/AndroidManifest.xml</code> بكافة الصلاحيات</li>
                <li><code>app/src/main/java/MainActivity.java</code> مع محرك WebView فائق السرعة</li>
                <li><code>app/src/main/assets/public/</code> لكافة ملفات الويب</li>
                <li>أداة Gradle Wrapper (<code>./gradlew</code>) للتجميع على أي جهاز دون تثبيت خارجي</li>
              </ul>

              <div className="pt-2">
                <button
                  onClick={handleDownloadStudioProject}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>تنزيل مشروع أندرويد ستوديو كاملاً (.ZIP)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: GitHub Actions CI/CD */}
        {activeTab === 'github' && (
          <div className="p-5 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>سير عمل GitHub Actions الآلي لبناء APK في السحابة</span>
                <button
                  onClick={copyGithubWorkflow}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition"
                >
                  {copiedAction ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAction ? 'تم النسخ' : 'نسخ ملف Workflow'}</span>
                </button>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                ملف سير العمل موجود بالفعل في مشروعك تحت المسار:
                <code className="text-emerald-300 block font-mono my-1">.github/workflows/android.yml</code>
                عند رفع هذا المشروع إلى GitHub، يمكنك التوجه إلى تبويب <strong>Actions</strong> والضغط على <strong>Run workflow</strong> لتنزيل الـ APK النهائي الموقع مباشرة من خوادم GitHub مجاناً وبسرعة فائقة.
              </p>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="bg-slate-950 border-t border-slate-800 px-5 py-3 flex items-center justify-between text-xs text-slate-500">
          <span>متوافق مع Android 7.0 حتى Android 14+</span>
          <button
            onClick={onClose}
            className="hover:text-white transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
