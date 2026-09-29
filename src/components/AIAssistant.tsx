import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Code, 
  Check, 
  Copy, 
  X, 
  Zap, 
  Camera, 
  WifiOff, 
  Bell, 
  Shield 
} from 'lucide-react';
import { ProjectFile } from '../types/project';

interface AIAssistantProps {
  activeFile: ProjectFile | null;
  onApplyCode: (code: string) => void;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  activeFile,
  onApplyCode,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `أهلاً بك! أنا مساعدك الذكي لتطوير تطبيقات أندرويد وCapacitor.
يمكنني مساعدتك في:
• فحص وتصحيح الأكواد واكتشاف الأخطاء البرمجية
• إضافة ميزات الهواتف الأصلية (الكاميرا، الموقع الجغرافي، الإشعارات)
• تسريع التطبيق وجعله يعمل بدون إنترنت (Offline Mode)
• تجهيز إعدادات الـ APK وحماية التطبيق.`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const quickPrompts = [
    { title: 'كود الكاميرا', prompt: 'أضف كود فتح الكاميرا والتقاط صورة وعرضها للمستخدم بطريقة متوافقة مع أندرويد وCapacitor', icon: Camera },
    { title: 'العمل دون إنترنت', prompt: 'أضف كود التخزين المؤقت والعمل دون اتصال بالإنترنت (Offline Mode) للتطبيق', icon: WifiOff },
    { title: 'إشعارات الهاتف', prompt: 'كيف أقوم ببرمجة نظام إشعارات محلية مجدولة داخل التطبيق؟ زودني بالكود الجاهز', icon: Bell },
    { title: 'حماية التطبيق', prompt: 'ما هي أفضل الممارسات لتأمين تطبيق الأندرويد وحماية البيانات الحساسة؟', icon: Shield },
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const newMsgs: Message[] = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          currentFile: activeFile?.path || 'www/index.html',
          content: activeFile?.content || ''
        })
      });

      const data = await res.json();
      if (data.success && data.answer) {
        setMessages([...newMsgs, { role: 'assistant', content: data.answer }]);
      } else {
        setMessages([...newMsgs, { role: 'assistant', content: data.error || 'حدث خطأ في معالجة طلبك.' }]);
      }
    } catch (err: any) {
      setMessages([...newMsgs, { role: 'assistant', content: `تعذر الاتصال بالخادم: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const extractCode = (content: string): string | null => {
    const match = content.match(/```(?:[a-zA-Z]*)\n([\s\S]*?)```/);
    return match ? match[1] : null;
  };

  return (
    <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full z-30 select-none">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">المساعد الذكي (Gemini 3.8)</h3>
            <span className="text-[10px] text-slate-400">تحليل الأكواد وتوليد ميزات أندرويد</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-2 border-b border-slate-800 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        {quickPrompts.map((q, idx) => {
          const Icon = q.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(q.prompt)}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-700 transition cursor-pointer"
            >
              <Icon className="w-3 h-3 text-emerald-400" />
              <span>{q.title}</span>
            </button>
          );
        })}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          const codeSnippet = !isUser ? extractCode(m.content) : null;

          return (
            <div
              key={idx}
              className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap select-text ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none font-sans'
                }`}
              >
                {m.content}

                {/* If code block detected in AI response, offer 1-click apply */}
                {codeSnippet && activeFile && (
                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => onApplyCode(codeSnippet)}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      <Zap className="w-3 h-3" />
                      <span>تطبيق الكود في {activeFile.name}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-blue-400 font-medium py-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>جاري التفكير والتوليد بالذكاء الاصطناعي...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-slate-800 bg-slate-900"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اسأل الذكاء الاصطناعي عن أي كود أو ميزة..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white p-2 rounded-xl transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
