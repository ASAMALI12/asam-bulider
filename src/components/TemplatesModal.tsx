import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  ArrowLeft, 
  Smartphone, 
  Layers, 
  ShoppingBag, 
  Bot, 
  CheckSquare, 
  Search, 
  Music
} from 'lucide-react';
import { READY_TEMPLATES, ReadyTemplate } from '../services/readyTemplates';

interface TemplatesModalProps {
  onSelectTemplate: (template: ReadyTemplate) => void;
  onClose: () => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  onSelectTemplate,
  onClose
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ReadyTemplate>(READY_TEMPLATES[0]);
  const [previewTab, setPreviewTab] = useState<'info' | 'preview'>('info');

  const handleApply = () => {
    onSelectTemplate(selectedTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900/90 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-purple-500/20">
              📱
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>قوالب التطبيقات الجاهزة للبناء الفوري</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-semibold">
                  جاهزة ومختبرة
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                اختر تطبيقاً متكاملاً جاهزاً للعمل وتنزيل حزمة الـ APK مباشرة بضغطة زر
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

        {/* Body Split */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left / List of Templates */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-l border-slate-800 p-3 overflow-y-auto space-y-2 bg-slate-950/40">
            <div className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
              التطبيقات المتاحة ({READY_TEMPLATES.length})
            </div>
            {READY_TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplate.id === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-purple-600/15 border-purple-500/50 text-white shadow-md shadow-purple-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white'
                  }`}
                >
                  <div className="text-2xl">{tmpl.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold truncate">{tmpl.name}</h4>
                      <span className="text-[9px] bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded-md border border-slate-700 font-semibold whitespace-nowrap">
                        {tmpl.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{tmpl.category}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right / Selected Template Details & Preview */}
          <div className="flex-1 flex flex-col p-5 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedTemplate.icon}</span>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedTemplate.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedTemplate.appId} • {selectedTemplate.nameEn}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewTab('info')}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition ${
                    previewTab === 'info'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  المعلومات والميزات
                </button>
                <button
                  onClick={() => setPreviewTab('preview')}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition ${
                    previewTab === 'preview'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  معاينة الشاشة الحية
                </button>
              </div>
            </div>

            {previewTab === 'info' ? (
              <div className="space-y-4 flex-1">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">وصف التطبيق:</h4>
                  <p className="text-xs text-slate-200 leading-relaxed">{selectedTemplate.description}</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">الصلاحيات المضمنة تلقائياً:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.permissions.map((perm, i) => (
                      <span key={i} className="text-[11px] bg-slate-900 border border-slate-700 text-emerald-400 font-mono px-2.5 py-1 rounded-lg">
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 text-xs text-emerald-300 leading-relaxed">
                  ✓ عند تطبيق هذا القالب، سيتم تحديث ملفات الواجهة <code className="font-bold">www/index.html</code> وإعدادات <code className="font-bold">capacitor.config.json</code> والصلاحيات فوراً، وتستطيع بعدها الضغط على <strong>بناء وتنزيل APK</strong> للحصول على تطبيق حقيقي قابل للتثبيت!
                </div>
              </div>
            ) : (
              <div className="flex-1 min-h-[300px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden relative">
                <iframe
                  title="Template Live Preview"
                  srcDoc={selectedTemplate.htmlContent}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
                />
              </div>
            )}

            {/* Action Bottom */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <button
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-white px-3 py-2 transition"
              >
                إلغاء
              </button>

              <button
                onClick={handleApply}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition shadow-lg shadow-purple-500/20 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>استخدام هذا التطبيق وتجهيزه للبناء</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
