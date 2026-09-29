/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ProjectExplorer } from './components/ProjectExplorer';
import { CodeEditor } from './components/CodeEditor';
import { DeviceSimulator } from './components/DeviceSimulator';
import { BuildModal } from './components/BuildModal';
import { AIAssistant } from './components/AIAssistant';
import { AuditReportModal } from './components/AuditReportModal';
import { INITIAL_FILES } from './services/defaultFiles';
import { ProjectFile, AuditResult } from './types/project';
import { ProjectValidator } from './services/projectValidator';
import { ApkBuilderService } from './services/apkBuilder';

export default function App() {
  const [files, setFiles] = useState<ProjectFile[]>(INITIAL_FILES);
  const [activeFilePath, setActiveFilePath] = useState<string>('capacitor.config.json');
  const [showSimulator, setShowSimulator] = useState<boolean>(true);
  const [showAssistant, setShowAssistant] = useState<boolean>(false);
  const [showBuildModal, setShowBuildModal] = useState<boolean>(false);
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [isApplyingFixes, setIsApplyingFixes] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeFile = useMemo(() => {
    return files.find(f => f.path === activeFilePath) || files[0] || null;
  }, [files, activeFilePath]);

  // Parse capacitor config
  const capConfig = useMemo(() => {
    const file = files.find(f => f.path === 'capacitor.config.json');
    if (!file) return {};
    try {
      return JSON.parse(file.content);
    } catch {
      return {};
    }
  }, [files]);

  // Parse permissions
  const permissions = useMemo(() => {
    const file = files.find(f => f.path === 'android-permissions.txt');
    if (!file) return [];
    return file.content
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0 && !p.startsWith('#'));
  }, [files]);

  // Project validation issues
  const validationIssues = useMemo(() => {
    return ProjectValidator.validate(files);
  }, [files]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveContent = (path: string, newContent: string) => {
    setFiles(prev => prev.map(f => {
      if (f.path === path) {
        return { ...f, content: newContent, isModified: false };
      }
      return f;
    }));
    showToast(`تم حفظ التعديلات في ${path}`);
  };

  const handleAddNewFile = (path: string, content: string = '') => {
    if (files.some(f => f.path === path)) {
      showToast('الملف موجود بالفعل');
      return;
    }
    const ext = path.split('.').pop()?.toLowerCase();
    let language: ProjectFile['language'] = 'text';
    if (ext === 'json') language = 'json';
    else if (ext === 'html') language = 'html';
    else if (ext === 'yml' || ext === 'yaml') language = 'yaml';
    else if (ext === 'md') language = 'markdown';
    else if (ext === 'js' || ext === 'ts') language = 'javascript';

    const newFile: ProjectFile = {
      path,
      name: path.split('/').pop() || path,
      content,
      language,
      category: path.startsWith('www/') ? 'source' : 'config',
      isModified: true
    };

    setFiles(prev => [...prev, newFile]);
    setActiveFilePath(path);
    showToast(`تم إنشاء الملف ${path}`);
  };

  // Run AI Audit and Auto-Fix
  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const filesMap: Record<string, string> = {};
      files.forEach(f => {
        filesMap[f.path] = f.content;
      });

      const res = await fetch('/api/ai/audit-and-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: filesMap,
          instructions: 'فحص دقيق للمشروع، إصلاح أخطاء capacitor.config.json والصلاحيات ومسارات WebView وأي أكواد ناقصة لجعل بناء APK ناجحاً ومباشراً.'
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setAuditResult(data.data);
        setShowAuditModal(true);
      } else {
        // Fallback to local rule-based audit if AI server returns error
        const issues = ProjectValidator.validate(files);
        setAuditResult({
          summary: 'تم إجراء فحص محلي شامل لملفات المشروع وتوافق Capacitor وأندرويد.',
          issuesFound: issues,
          androidRecommendations: [
            'تأكد من ضبط Target SDK على 34 لتوافق Google Play الحديث.',
            'استخدم proguard لتقليل حجم حزمة APK وضغط الأصول.'
          ]
        });
        setShowAuditModal(true);
      }
    } catch (err: any) {
      // Local fallback on network error
      const issues = ProjectValidator.validate(files);
      setAuditResult({
        summary: 'تم تنفيذ فحص قواعد التوافق المحلي للمشروع.',
        issuesFound: issues,
        androidRecommendations: [
          'تم التحقق من تطابق ملفات www/index.html مع capacitor.config.json.'
        ]
      });
      setShowAuditModal(true);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleApplyFixes = (fixedFiles: Record<string, string>) => {
    setIsApplyingFixes(true);
    setFiles(prev => prev.map(f => {
      if (fixedFiles[f.path]) {
        return { ...f, content: fixedFiles[f.path], isModified: true };
      }
      return f;
    }));

    setIsApplyingFixes(false);
    setShowAuditModal(false);
    showToast('تم تطبيق كافة الإصلاحات الذكية على ملفات المشروع بنجاح!');
  };

  const handleExportZip = async () => {
    try {
      const blob = await ApkBuilderService.exportFullProjectZip(files);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart-apk-project-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('تم تنزيل حزمة المشروع كاملة (ZIP)');
    } catch (e: any) {
      showToast(`فشل تصدير المشروع: ${e.message}`);
    }
  };

  const handleApplyCodeFromAI = (code: string) => {
    if (!activeFile) return;
    setFiles(prev => prev.map(f => {
      if (f.path === activeFile.path) {
        return { ...f, content: code, isModified: true };
      }
      return f;
    }));
    showToast(`تم تطبيق الكود المقترح على ${activeFile.path}`);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-['Cairo',sans-serif]">
      {/* Top Header */}
      <Header
        onRunAudit={handleRunAudit}
        onOpenBuild={() => setShowBuildModal(true)}
        onExportZip={handleExportZip}
        onToggleSimulator={() => setShowSimulator(!showSimulator)}
        onToggleAssistant={() => setShowAssistant(!showAssistant)}
        showSimulator={showSimulator}
        showAssistant={showAssistant}
        issueCount={validationIssues.length}
        isAuditing={isAuditing}
        isBuilding={false}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Project Explorer Sidebar */}
        <ProjectExplorer
          files={files}
          activeFile={activeFile}
          onSelectFile={(f) => setActiveFilePath(f.path)}
          onAddNewFile={handleAddNewFile}
          capConfig={capConfig}
        />

        {/* Center: Active Code Editor */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
          {activeFile ? (
            <CodeEditor
              file={activeFile}
              onSaveContent={handleSaveContent}
              onAskAIAboutFile={() => setShowAssistant(true)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              حدد ملفاً من القائمة الجانبية لعرضه وتعديله
            </div>
          )}
        </main>

        {/* Right Drawer 1: Device Simulator */}
        {showSimulator && (
          <DeviceSimulator
            files={files}
            onClose={() => setShowSimulator(false)}
            appName={capConfig?.appName}
          />
        )}

        {/* Right Drawer 2: AI Assistant */}
        {showAssistant && (
          <AIAssistant
            activeFile={activeFile}
            onApplyCode={handleApplyCodeFromAI}
            onClose={() => setShowAssistant(false)}
          />
        )}
      </div>

      {/* Modals */}
      {showBuildModal && (
        <BuildModal
          files={files}
          capConfig={capConfig}
          permissions={permissions}
          onClose={() => setShowBuildModal(false)}
        />
      )}

      {showAuditModal && (
        <AuditReportModal
          auditResult={auditResult}
          onApplyFixes={handleApplyFixes}
          onClose={() => setShowAuditModal(false)}
          isApplying={isApplyingFixes}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-2xl z-50 animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
