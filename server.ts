import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Shared Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: AI Code Doctor / Project Audit & Fix
app.post('/api/ai/audit-and-fix', async (req, res) => {
  try {
    const { files, instructions } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error: 'مفتاح Gemini API غير مهيأ. يرجى التأكد من تعيين المفتاح في إعدادات البيئة.',
      });
    }

    const filesSummary = Object.entries(files || {})
      .map(([fileName, content]) => `--- File: ${fileName} ---\n${String(content).slice(0, 4000)}\n`)
      .join('\n');

    const prompt = `أنت خبير محترف في هندسة تطبيقات الأندرويد وبناء حزم APK ومكتبة Capacitor / Cordova.
قم بفحص المشروع التالي بدقة واكتشاف جميع الأخطاء والمشاكل وتحسين البنية لضمان نجاح بناء APK مباشر وسريع.

الملفات الحالية للمشروع:
${filesSummary}

تعليمات إضافية من المستخدم:
${instructions || 'صحح جميع الأخطاء واجعل التطبيق جاهزاً لبناء APK فورياً وأكثر ذكاءً وقوة مع الحفاظ التام على بنية الملفات.'}

المطلوب:
قم بالرد بصيغة JSON حصراً مطابقة للنموذج التالي (لا تضف أي نص خارج كائن الـ JSON):
{
  "summary": "ملخص شامل باللغة العربية للإصلاحات والتحسينات التي تمت",
  "issuesFound": [
    {"type": "error" | "warning" | "optimization", "file": "اسم الملف", "description": "وصف المشكلة وكيف تم حلها"}
  ],
  "fixedFiles": {
    "اسم الملف": "محتوى الملف المصحح كاملاً وبدقة عالية"
  },
  "androidRecommendations": [
    "توصية تقنية للأندرويد",
    "توصية لتقليل حجم الـ APK أو تحسين الأداء"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        summary: text,
        issuesFound: [],
        fixedFiles: {},
        androidRecommendations: [],
      };
    }

    return res.json({ success: true, data });
  } catch (err: any) {
    console.error('Audit error:', err);
    return res.status(500).json({
      error: err.message || 'حدث خطأ أثناء فحص وتصحيح المشروع بالذكاء الاصطناعي',
    });
  }
});

// API: AI Feature Builder & Code Generation
app.post('/api/ai/ask', async (req, res) => {
  try {
    const { prompt, currentFile, content } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error: 'مفتاح Gemini API غير متوفر في الخادم.',
      });
    }

    const systemPrompt = `أنت مهندس برمجيات متخصص في بناء تطبيقات أندرويد الهجينة (Capacitor/Android Web-to-APK).
قدم إجابة ذكية ومباشرة باللغة العربية، وإذا طلبت كوداً قم بتقديمه كاملاً وجاهزاً للنسخ والتطبيق المباشر.
الملف الحالي المستهدف: ${currentFile || 'www/index.html'}
محتوى الملف الحالي:
\`\`\`
${(content || '').slice(0, 3000)}
\`\`\`
المستخدم يسأل: ${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: systemPrompt,
    });

    return res.json({ success: true, answer: response.text || '' });
  } catch (err: any) {
    console.error('AI ask error:', err);
    return res.status(500).json({ error: err.message || 'فشل توليد الاستجابة' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Mount Vite middlewares in development
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[APK Studio] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
