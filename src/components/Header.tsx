import React from 'react';
import { 
  Sparkles, 
  Download, 
  Smartphone, 
  Bot, 
  Wrench, 
  FolderArchive,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface HeaderProps {
  onRunAudit: () => void;
  onOpenBuild: () => void;
  onExportZip: () => void;
  onToggleSimulator: () => void;
  onToggleAssistant: () => void;
  showSimulator: boolean;
  showAssistant: boolean;
  issueCount: number;
  isAuditing: boolean;
  isBuilding: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onRunAudit,
  onOpenBuild,
  onExportZip,
  onToggleSimulator,
  onToggleAssistant,
  showSimulator,
  showAssistant,
  issueCount,
  isAuditing,
  isBuilding
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 py-3 sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Project Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-extrabold text-lg">
          APK
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
              APK Studio AI
            </h1>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
              Android v34
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            منصة تطوير وفحص ذكية لبناء وتصدير حزم APK فورية
          </p>
        </div>
      </div>

      {/* Health & Issues summary badge */}
      <div className="hidden lg:flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl">
        {issueCount === 0 ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>المشروع سليم ومستعد للبناء</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
            <AlertTriangle className="w-4 h-4" />
            <span>تم اكتشاف {issueCount} ملاحظة / خطأ</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Run AI Audit & Fix */}
        <button
          onClick={onRunAudit}
          disabled={isAuditing}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl transition shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-50"
          title="فحص شامل وتصحيح تلقائي لكافة أخطاء وتوافق المشروع بالذكاء الاصطناعي"
        >
          <Sparkles className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
          <span>{isAuditing ? 'جاري الفحص والتصحيح...' : 'فحص وتصحيح الأخطاء بالذكاء'}</span>
        </button>

        {/* Build APK Directly */}
        <button
          onClick={onOpenBuild}
          disabled={isBuilding}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-95 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>بناء وتنزيل APK فوراً</span>
        </button>

        {/* Export Project ZIP */}
        <button
          onClick={onExportZip}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs sm:text-sm font-medium px-3 py-2 rounded-xl transition border border-slate-700 cursor-pointer"
          title="تصدير وتنزيل بنية المشروع كاملة كملف مضغوط"
        >
          <FolderArchive className="w-4 h-4 text-slate-300" />
          <span className="hidden md:inline">تصدير المشروع</span>
        </button>

        {/* Toggle Device Simulator */}
        <button
          onClick={onToggleSimulator}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition border cursor-pointer ${
            showSimulator
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
          }`}
          title="معاينة التطبيق داخل محاكي هاتف أندرويد حقيقي"
        >
          <Smartphone className="w-4 h-4" />
          <span className="hidden sm:inline">المحاكي</span>
        </button>

        {/* Toggle AI Assistant */}
        <button
          onClick={onToggleAssistant}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition border cursor-pointer ${
            showAssistant
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
          }`}
          title="فتح المساعد الذكي لتوليد الأكواد وإضافة الميزات"
        >
          <Bot className="w-4 h-4" />
          <span className="hidden sm:inline">المساعد</span>
        </button>
      </div>
    </header>
  );
};
