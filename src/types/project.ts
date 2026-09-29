export interface ProjectFile {
  path: string;
  name: string;
  content: string;
  language: 'json' | 'html' | 'yaml' | 'markdown' | 'text' | 'javascript';
  category: 'config' | 'source' | 'ci' | 'docs' | 'permissions';
  isModified?: boolean;
}

export interface AuditIssue {
  type: 'error' | 'warning' | 'optimization';
  file: string;
  description: string;
  autoFixable?: boolean;
}

export interface AuditResult {
  summary: string;
  issuesFound: AuditIssue[];
  fixedFiles?: Record<string, string>;
  androidRecommendations?: string[];
}

export interface BuildLog {
  id: string;
  timestamp: string;
  text: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'step';
}

export type BuildStatus = 'idle' | 'building' | 'success' | 'error';
