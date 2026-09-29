import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Wrench, 
  Sparkles, 
  FileText, 
  Lightbulb,
  ShieldCheck
} from 'lucide-react';
import { AuditResult } from '../types/project';

interface AuditReportModalProps {
  auditResult: AuditResult | null;
  onApplyFixes: (fixedFiles: Record<string, string>) => void;
  onClose: () => void;
  isApplying?: boolean;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  auditResult,
  onApplyFixes,
  onClose,
  isApplying
}) => {
  if (!auditResult) return null;

  const hasFixes = auditResult.fixedFiles && Object.keys(auditResult.fixedFiles).length > 0;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-900/90 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                تقرير فحص وتصحيح أخطاء المشروع
              </h2>
              <p className="text-xs text-slate-400">
                نتائج التحليل الذكي وتوافق حزم أندرويد عبر Gemini
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
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Summary Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>ملخص التقييم العام</span>
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {auditResult.summary}
            </p>
          </div>

          {/* Issues List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-emerald-400" />
              <span>الملاحظات والمشاكل المكتشفة ({auditResult.issuesFound.length})</span>
            </h3>

            {auditResult.issuesFound.length === 0 ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center text-xs text-emerald-300 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>لم يتم العثور على أخطاء حرجة! المشروع جاهز ومؤهل تماماً لبناء الـ APK.</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {auditResult.issuesFound.map((issue, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            issue.type === 'error'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : issue.type === 'warning'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          }`}
                        >
                          {issue.type === 'error' ? 'خطأ' : issue.type === 'warning' ? 'تحذير' : 'تحسين'}
                        </span>
                        <span className="font-mono text-slate-400 text-[11px]">{issue.file}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{issue.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Android Recommendations */}
          {auditResult.androidRecommendations && auditResult.androidRecommendations.length > 0 && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>توصيات أندرويد لتعزيز الأداء والأمان</span>
              </h3>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                {auditResult.androidRecommendations.map((rec, i) => (
                  <li key={i} className="leading-relaxed">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white px-3 py-2 transition"
          >
            إغلاق
          </button>

          {hasFixes ? (
            <button
              onClick={() => onApplyFixes(auditResult.fixedFiles!)}
              disabled={isApplying}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-95 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
            >
              <Wrench className="w-4 h-4" />
              <span>{isApplying ? 'جاري تطبيق الإصلاحات...' : 'تطبيق كافة الإصلاحات التلقائية فوراً'}</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition"
            >
              تم الفحص
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
