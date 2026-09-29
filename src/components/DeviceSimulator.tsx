import React, { useState } from 'react';
import { 
  RotateCw, 
  Smartphone, 
  RefreshCw, 
  Wifi, 
  Battery, 
  Compass, 
  Terminal, 
  ExternalLink,
  Volume2,
  X
} from 'lucide-react';
import { ProjectFile } from '../types/project';

interface DeviceSimulatorProps {
  files: ProjectFile[];
  onClose: () => void;
  appName?: string;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  files,
  onClose,
  appName = 'Smart App'
}) => {
  const [isLandscape, setIsLandscape] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'preview' | 'console'>('preview');
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([
    '[Capacitor] Initializing native plugins...',
    '[WebView] Loaded AndroidScheme: https',
    '[WebView] DomStorage enabled: true',
    '[NativeBridge] Ready for intent dispatch'
  ]);

  // Find index.html inside files
  const indexHtml = files.find(f => f.path === 'www/index.html' || f.path.endsWith('index.html'))?.content || '<h1>لا توجد صفحة رئيسية</h1>';

  const handleRefresh = () => {
    setReloadKey(prev => prev + 1);
    setSimulatedLogs(prev => [...prev, `[System] Reloaded at ${new Date().toLocaleTimeString()}`]);
  };

  return (
    <div className="w-full lg:w-[420px] bg-slate-900 border-r border-slate-800 flex flex-col h-full select-none z-20">
      {/* Simulator Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white">محاكي أندرويد الحقيقي</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLandscape(!isLandscape)}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
            title="تدوير الشاشة أفقي / رأسي"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRefresh}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
            title="إعادة تحميل التطبيق"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition"
            title="إغلاق المحاكي"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs bg-slate-950/40">
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-2 font-medium text-center border-b-2 transition ${
            activeTab === 'preview'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          شاشة الهاتف
        </button>
        <button
          onClick={() => setActiveTab('console')}
          className={`flex-1 py-2 font-medium text-center border-b-2 transition ${
            activeTab === 'console'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          سجل الأحداث (Logcat)
        </button>
      </div>

      {/* Simulator Content */}
      <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-slate-950/80">
        {activeTab === 'preview' ? (
          <div
            className={`transition-all duration-300 relative bg-slate-900 border-4 border-slate-700 shadow-2xl rounded-[40px] overflow-hidden flex flex-col ${
              isLandscape
                ? 'w-[380px] h-[260px]'
                : 'w-[300px] h-[580px]'
            }`}
          >
            {/* Phone Punch-Hole Camera */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-30 border border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-blue-900/60 rounded-full"></div>
            </div>

            {/* Android Status Bar */}
            <div className="h-6 bg-slate-950/80 text-[10px] text-slate-400 px-4 flex items-center justify-between z-20 font-mono">
              <span>09:41</span>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3 h-3 text-slate-300" />
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* Web View Screen */}
            <div className="flex-1 bg-black overflow-hidden relative">
              <iframe
                key={reloadKey}
                title="Android App Preview"
                srcDoc={indexHtml}
                className="w-full h-full border-none select-auto"
                sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
              />
            </div>

            {/* Android Bottom Navigation Pill */}
            <div className="h-4 bg-slate-950 flex items-center justify-center">
              <div className="w-24 h-1 bg-slate-600 rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Logcat Console</span>
              </div>
              <button
                onClick={() => setSimulatedLogs([])}
                className="hover:text-white"
              >
                مسح
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2 space-y-1 text-slate-300">
              {simulatedLogs.map((log, i) => (
                <div key={i} className="text-slate-400 font-mono text-[11px] leading-relaxed">
                  <span className="text-emerald-500 font-bold">INFO: </span>
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Test Sensors */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50 text-xs">
        <p className="text-[11px] text-slate-400 mb-2 font-medium">اختبارات بيئة أندرويد السريعة:</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSimulatedLogs(prev => [...prev, `[Haptics] Vibrate: 200ms executed successfully`])}
            className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 py-1.5 px-2 rounded-lg text-[11px] transition cursor-pointer"
          >
            <Volume2 className="w-3 h-3 text-cyan-400" />
            <span>نبض الاهتزاز</span>
          </button>
          <button
            onClick={() => setSimulatedLogs(prev => [...prev, `[GPS] Location simulated: Lat 24.7136, Lng 46.6753`])}
            className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 py-1.5 px-2 rounded-lg text-[11px] transition cursor-pointer"
          >
            <Compass className="w-3 h-3 text-amber-400" />
            <span>محاكاة GPS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
