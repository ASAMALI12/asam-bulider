import { ProjectFile, AuditIssue } from '../types/project';

export class ProjectValidator {
  static validate(files: ProjectFile[]): AuditIssue[] {
    const issues: AuditIssue[] = [];

    // 1. Check capacitor.config.json
    const capFile = files.find(f => f.path === 'capacitor.config.json');
    if (!capFile) {
      issues.push({
        type: 'error',
        file: 'capacitor.config.json',
        description: 'ملف capacitor.config.json مفقود، وهو مطلوب لبناء بيئة أندرويد عبر Capacitor.',
        autoFixable: true
      });
    } else {
      try {
        const config = JSON.parse(capFile.content);
        if (!config.appId) {
          issues.push({
            type: 'error',
            file: 'capacitor.config.json',
            description: 'معرف التطبيق appId مفقود في ملف التكوين.',
            autoFixable: true
          });
        } else if (!/^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/.test(config.appId)) {
          issues.push({
            type: 'warning',
            file: 'capacitor.config.json',
            description: `معرف الحزمة (${config.appId}) قد لا يتوافق مع معايير Google Play (يجب أن يكون بصيغة com.company.app).`,
            autoFixable: true
          });
        }

        if (config.webDir !== 'www') {
          issues.push({
            type: 'warning',
            file: 'capacitor.config.json',
            description: `مسار webDir مضبوط على "${config.webDir}" بدلاً من "www"، يرجى التأكد من تطابق المجلد مع ملفات الويب.`,
            autoFixable: true
          });
        }
      } catch (e: any) {
        issues.push({
          type: 'error',
          file: 'capacitor.config.json',
          description: `خطأ في صيغة JSON لملف capacitor.config.json: ${e.message}`,
          autoFixable: true
        });
      }
    }

    // 2. Check www/index.html
    const indexHtml = files.find(f => f.path === 'www/index.html' || f.path.endsWith('index.html'));
    if (!indexHtml) {
      issues.push({
        type: 'error',
        file: 'www/index.html',
        description: 'الملف الرئيسي للواجهة www/index.html غير موجود.',
        autoFixable: true
      });
    } else {
      const content = indexHtml.content;
      if (!content.includes('viewport')) {
        issues.push({
          type: 'warning',
          file: indexHtml.path,
          description: 'علامة viewport meta مفقودة؛ قد تظهر الشاشة غير متجاوبة على شاشات الهواتف.',
          autoFixable: true
        });
      }

      // Check geolocation permission
      if (content.includes('geolocation') && !files.find(f => f.path === 'android-permissions.txt')?.content.includes('ACCESS_FINE_LOCATION')) {
        issues.push({
          type: 'warning',
          file: 'android-permissions.txt',
          description: 'التطبيق يستخدم نظام تحديد الموقع الجغرافي (GPS) دون إضافة صلاحية ACCESS_FINE_LOCATION في ملف الصلاحيات.',
          autoFixable: true
        });
      }

      // Check camera permission
      if ((content.includes('getUserMedia') || content.includes('camera')) && !files.find(f => f.path === 'android-permissions.txt')?.content.includes('CAMERA')) {
        issues.push({
          type: 'warning',
          file: 'android-permissions.txt',
          description: 'يتم استخدام الكاميرا دون تضمين صلاحية android.permission.CAMERA في ملف الصلاحيات.',
          autoFixable: true
        });
      }

      // Check vibrate permission
      if (content.includes('navigator.vibrate') && !files.find(f => f.path === 'android-permissions.txt')?.content.includes('VIBRATE')) {
        issues.push({
          type: 'optimization',
          file: 'android-permissions.txt',
          description: 'يوصى بإضافة صلاحية android.permission.VIBRATE لضمان عمل الاهتزاز على كافة إصدارات أندرويد.',
          autoFixable: true
        });
      }
    }

    // 3. Check GitHub Action Workflow
    const workflow = files.find(f => f.path === '.github/workflows/android.yml');
    if (!workflow) {
      issues.push({
        type: 'warning',
        file: '.github/workflows/android.yml',
        description: 'ملف سير عمل البناء الآلي لـ APK مفقود، يوصى بإنشائه لتمكين بناء APK سحابياً عبر GitHub Actions.',
        autoFixable: true
      });
    }

    return issues;
  }
}
