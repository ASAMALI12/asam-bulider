import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RotateCcw, 
  Copy, 
  Check, 
  Code2, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { ProjectFile } from '../types/project';

interface CodeEditorProps {
  file: ProjectFile;
  onSaveContent: (path: string, newContent: string) => void;
  onRevertOriginal?: (path: string) => void;
  onAskAIAboutFile?: (file: ProjectFile) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  file,
  onSaveContent,
  onRevertOriginal,
  onAskAIAboutFile
}) => {
  const [content, setContent] = useState(file.content);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    setContent(file.content);
    setIsSaved(true);
  }, [file.path, file.content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsSaved(e.target.value === file.content);
  };

  const handleSave = () => {
    onSaveContent(file.path, content);
    setIsSaved(true);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Line count for gutter
  const lineCount = content.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden h-full">
      {/* Editor Top Bar */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-2 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-200">
            {file.path}
          </span>
          {!isSaved && (
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
              تعديلات غير محفوظة
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onAskAIAboutFile && (
            <button
              onClick={() => onAskAIAboutFile(file)}
              className="flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs px-2.5 py-1.5 rounded-lg transition cursor-pointer"
              title="سؤال الذكاء الاصطناعي عن هذا الملف أو تحسينه"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>فحص بالذكاء</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
            title="نسخ المحتوى"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaved}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer"
            title="حفظ التعديلات (Ctrl+S)"
          >
            <Save className="w-3.5 h-3.5" />
            <span>حفظ</span>
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative font-mono text-xs">
        {/* Line Numbers Column */}
        <div className="w-12 bg-slate-900/40 select-none py-3 text-right pr-3 pl-1 text-slate-600 font-mono text-[11px] overflow-hidden border-l border-slate-800/60 hidden sm:block">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-5 h-5">{num}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={content}
          onChange={handleChange}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
              e.preventDefault();
              handleSave();
            }
          }}
          spellCheck={false}
          className="flex-1 w-full h-full bg-slate-950 text-slate-200 p-3 leading-5 resize-none focus:outline-none font-mono selection:bg-emerald-600 selection:text-white border-none"
          placeholder="اكتب كود الملف هنا..."
        />
      </div>

      {/* Editor Footer */}
      <div className="bg-slate-900/60 border-t border-slate-800 px-4 py-1.5 text-[11px] text-slate-500 flex items-center justify-between font-mono">
        <div className="flex items-center gap-4">
          <span>الأسطر: {lineCount}</span>
          <span>الحجم: {(content.length / 1024).toFixed(1)} KB</span>
          <span>الترميز: UTF-8</span>
        </div>
        <div>
          <span>{file.language.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
