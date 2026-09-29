import React from 'react';
import { 
  Sparkles, 
  Download, 
  Smartphone, 
  Bot, 
  Wrench, 
  FolderArchive,
  CheckCircle2,
  AlertTriangle,
  Cloud,
  LayoutGrid
} from 'lucide-react';

interface HeaderProps {
  onRunAudit: () => void;
  onOpenBuild: () => void;
  onOpenTemplates: () => void;
  onOpenCloud: () => void;
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
  onOpenTemplates,
  onOpenCloud,
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
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 px-3 sm:px-4 py-2.5 sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3">
      {/* Brand & Project Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-extrabold text-base">
          APK
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-white">
              APK Studio AI
            </h1>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
              Android v34
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden md:block">
            بناء وتصحيح تطبيقات أندرويد مع ربط سحابي وقوالب جاهزة
          </p>
        </div>
      </div>

      {/* Health & Issues summary badge */}
      <div className="hidden xl:flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl">
        {issueCount === 0 ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>المشروع سليم ومستعد للبناء</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>تم اكتشاف {issueCount} ملاحظة / خطأ</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        {/* Ready-made App Templates */}
        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 text-purple-300 border border-purple-500/40 text-xs sm:text-sm font-semibold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition cursor-pointer"
          title="استعراض واختيار تطبيقات جاهزة متكاملة للبناء الفوري"
        >
          <LayoutGrid className="w-4 h-4 text-purple-400" />
          <span>تطبيقات جاهزة</span>
        </button>

        {/* Cloud Sync & Storage */}
        <button
          onClick={onOpenCloud}
          className="flex items-center gap-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs sm:text-sm font-semibold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition cursor-pointer"
          title="حفظ واسترجاع المشروع سحابياً ومسح رمز QR بالهاتف"
        >
          <Cloud className="w-4 h-4 text-cyan-400" />
          <span>تخزين سحابي</span>
        </button>

        {/* Run AI Audit & Fix */}
        <button
          onClick={onRunAudit}
          disabled={isAuditing}
          className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 sm:py-2 rounded-xl transition shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-50"
          title="فحص شامل وتصحيح تلقائي لكافة أخطاء وتوافق المشروع بالذكاء الاصطناعي"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
          <span>{isAuditing ? 'جاري الفحص...' : 'فحص الأخطاء'}</span>
        </button>

        {/* Build APK Directly */}
        <button
          onClick={onOpenBuild}
          disabled={isBuilding}
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-95 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>بناء وتنزيل APK</span>
        </button>

        {/* Export Project ZIP */}
        <button
          onClick={onExportZip}
          className="hidden sm:flex items-center gap-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 text-xs px-2.5 py-2 rounded-xl transition border border-slate-700 cursor-pointer"
          title="تصدير وتنزيل بنية المشروع كاملة كملف مضغوط"
        >
          <FolderArchive className="w-3.5 h-3.5" />
          <span>تصدير ZIP</span>
        </button>

        {/* Toggle Device Simulator */}
        <button
          onClick={onToggleSimulator}
          className={`flex items-center gap-1 px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-medium transition border cursor-pointer ${
            showSimulator
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
          }`}
          title="معاينة التطبيق داخل محاكي هاتف أندرويد حقيقي"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">المحاكي</span>
        </button>

        {/* Toggle AI Assistant */}
        <button
          onClick={onToggleAssistant}
          className={`flex items-center gap-1 px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-medium transition border cursor-pointer ${
            showAssistant
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
          }`}
          title="فتح المساعد الذكي لتوليد الأكواد وإضافة الميزات"
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">المساعد</span>
        </button>
      </div>
    </header>
  );
};
