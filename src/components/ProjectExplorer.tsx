import React, { useState } from 'react';
import { 
  FileCode, 
  FileJson, 
  FileText, 
  Settings, 
  ShieldCheck, 
  FolderGit2, 
  Plus, 
  Trash2, 
  Layers,
  Sparkles
} from 'lucide-react';
import { ProjectFile } from '../types/project';

interface ProjectExplorerProps {
  files: ProjectFile[];
  activeFile: ProjectFile | null;
  onSelectFile: (file: ProjectFile) => void;
  onAddNewFile: (name: string, content?: string) => void;
  onDeleteFile?: (path: string) => void;
  capConfig: any;
}

export const ProjectExplorer: React.FC<ProjectExplorerProps> = ({
  files,
  activeFile,
  onSelectFile,
  onAddNewFile,
  onDeleteFile,
  capConfig
}) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const getFileIcon = (file: ProjectFile) => {
    switch (file.category) {
      case 'config':
        return <Settings className="w-4 h-4 text-amber-400" />;
      case 'permissions':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'ci':
        return <FolderGit2 className="w-4 h-4 text-purple-400" />;
      case 'source':
        return <FileCode className="w-4 h-4 text-cyan-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    onAddNewFile(newFileName.trim());
    setNewFileName('');
    setShowNewModal(false);
  };

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-l border-slate-800 flex flex-col h-full select-none">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>هيكلية المشروع</span>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
          title="إضافة ملف جديد"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {files.map((file) => {
          const isActive = activeFile?.path === file.path;
          return (
            <div
              key={file.path}
              onClick={() => onSelectFile(file)}
              className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                {getFileIcon(file)}
                <span className="truncate">{file.path}</span>
              </div>

              {file.isModified && (
                <span className="w-2 h-2 rounded-full bg-amber-400" title="تم التعديل" />
              )}
            </div>
          );
        })}
      </div>

      {/* Project Meta Card */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span>حزمة التطبيق:</span>
          <span className="text-slate-200 font-mono text-[11px] truncate max-w-[130px]" title={capConfig?.appId}>
            {capConfig?.appId || 'com.smart.apk'}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>اسم التطبيق:</span>
          <span className="text-slate-200 font-semibold truncate max-w-[130px]">
            {capConfig?.appName || 'Smart APK'}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>إصدار Android SDK:</span>
          <span className="text-emerald-400 font-mono font-bold">API 34 (Android 14)</span>
        </div>
      </div>

      {/* Add File Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl"
          >
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>إضافة ملف جديد للمشروع</span>
            </h3>
            <p className="text-xs text-slate-400">
              أدخل مسار الملف واسمه، مثل <code className="text-emerald-300">www/styles.css</code> أو <code className="text-emerald-300">manifest.json</code>:
            </p>
            <input
              type="text"
              required
              autoFocus
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="www/custom.js"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
              >
                إنشاء الملف
              </button>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
};
