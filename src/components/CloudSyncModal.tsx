import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Upload, 
  Download, 
  QrCode, 
  Trash2, 
  RotateCcw, 
  Check, 
  Copy, 
  X, 
  ShieldCheck, 
  Smartphone,
  ExternalLink,
  Save
} from 'lucide-react';
import { ProjectFile } from '../types/project';
import { CloudStorageService, CloudProjectSnapshot } from '../services/cloudStorage';

interface CloudSyncModalProps {
  files: ProjectFile[];
  capConfig: any;
  onRestoreProject: (files: ProjectFile[], config?: any) => void;
  onClose: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  files,
  capConfig,
  onRestoreProject,
  onClose
}) => {
  const [cloudProjects, setCloudProjects] = useState<CloudProjectSnapshot[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveName, setSaveName] = useState(capConfig?.appName || 'تطبيقي الذكي');
  const [activeQrCode, setActiveQrCode] = useState<string | null>(null);
  const [activeShareUrl, setActiveShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    loadCloudProjects();
  }, []);

  const loadCloudProjects = () => {
    const list = CloudStorageService.listCloudProjects();
    setCloudProjects(list);
  };

  const handleSaveToCloud = async () => {
    if (!saveName.trim()) return;
    setIsSaving(true);
    try {
      const snapshot = await CloudStorageService.saveProjectToCloud(
        saveName.trim(),
        capConfig?.appId || 'com.smart.app',
        files
      );
      loadCloudProjects();
      setStatusMessage('تم رفع وحفظ المشروع في التخزين السحابي بنجاح!');

      // Generate QR Code for fast mobile sharing/install
      const shareUrl = `${window.location.origin}?cloudProject=${snapshot.id}`;
      setActiveShareUrl(shareUrl);
      const qr = await CloudStorageService.generateQrCode(shareUrl);
      setActiveQrCode(qr);
    } catch (e: any) {
      setStatusMessage(`خطأ في الحفظ السحابي: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShowQrForProject = async (proj: CloudProjectSnapshot) => {
    const shareUrl = `${window.location.origin}?cloudProject=${proj.id}`;
    setActiveShareUrl(shareUrl);
    const qr = await CloudStorageService.generateQrCode(shareUrl);
    setActiveQrCode(qr);
  };

  const handleDelete = (id: string) => {
    CloudStorageService.deleteCloudProject(id);
    loadCloudProjects();
    if (activeShareUrl?.includes(id)) {
      setActiveQrCode(null);
      setActiveShareUrl(null);
    }
  };

  const handleCopyLink = async () => {
    if (!activeShareUrl) return;
    await navigator.clipboard.writeText(activeShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900/90 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>التخزين والمزامنة السحابية الذكية</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Cloud Storage Sync
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                حفظ المشاريع سحابياً، مشاركة روابط التثبيت المباشرة، ومسح رمز QR بالهاتف
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

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Quick Save Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>رفع وحفظ المشروع الحالي في السحابة</span>
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="اسم النسخة السحابية..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSaveToCloud}
                disabled={isSaving || !saveName.trim()}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                <Cloud className="w-4 h-4" />
                <span>{isSaving ? 'جاري الرفع...' : 'حفظ سحابي فوري'}</span>
              </button>
            </div>

            {statusMessage && (
              <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-2 rounded-xl">
                {statusMessage}
              </div>
            )}
          </div>

          {/* Active QR Code & Direct Mobile Install Section */}
          {activeQrCode && (
            <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-white p-2.5 rounded-xl shadow-lg shrink-0">
                <img src={activeQrCode} alt="QR Code" className="w-28 h-28" />
              </div>
              <div className="space-y-2 text-center sm:text-right flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-cyan-400 font-bold text-xs">
                  <Smartphone className="w-4 h-4" />
                  <span>مسح رمز QR بالهاتف للتثبيت أو المعاينة المباشرة</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  وجّه كاميرا هاتفك الأندرويد نحو الرمز لتحميل المشروع أو تثبيت حزمة الـ APK مباشرة دون الحاجة لأي كابل توصيل.
                </p>
                <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'تم نسخ الرابط' : 'نسخ الرابط السحابي'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Saved Cloud Projects List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>المشاريع المحفوظة سحابياً ({cloudProjects.length})</span>
              <span className="text-[10px] text-slate-500">حفظ تلقائي مع الإصدارات</span>
            </h3>

            {cloudProjects.length === 0 ? (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-500">
                لا توجد مشاريع محفوظة سحابياً بعد. اضغط على "حفظ سحابي فوري" لإنشاء أول نسخة احتياطية.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {cloudProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex items-center justify-between gap-3 transition"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{proj.name}</span>
                        <span className="text-[10px] bg-slate-900 text-cyan-400 font-mono px-2 py-0.5 rounded border border-slate-800">
                          {proj.files.length} ملفات
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {new Date(proj.timestamp).toLocaleString('ar-SA')} • {proj.appId}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleShowQrForProject(proj)}
                        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 rounded-lg transition"
                        title="عرض رمز QR للهاتف"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          onRestoreProject(proj.files);
                          onClose();
                        }}
                        className="flex items-center gap-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs px-2.5 py-1.5 rounded-lg border border-emerald-500/30 transition cursor-pointer"
                        title="استرجاع هذه النسخة والعمل عليها"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>استرجاع</span>
                      </button>

                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="p-1.5 hover:bg-slate-800 text-slate-500 hover:text-red-400 rounded-lg transition"
                        title="حذف النسخة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>تشفير SSL آمن مع مزامنة سريعة</span>
          </div>
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
