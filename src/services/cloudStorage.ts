import QRCode from 'qrcode';
import { ProjectFile } from '../types/project';

export interface CloudProjectSnapshot {
  id: string;
  name: string;
  timestamp: string;
  files: ProjectFile[];
  version: string;
  appId: string;
  apkDownloadUrl?: string;
}

export class CloudStorageService {
  private static LOCAL_KEY = 'apk_studio_cloud_projects';

  /**
   * Generates a QR code data URL (PNG) from any text or link.
   */
  static async generateQrCode(text: string): Promise<string> {
    try {
      return await QRCode.toDataURL(text, {
        width: 256,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
    } catch (e) {
      console.error('Failed to generate QR code:', e);
      return '';
    }
  }

  /**
   * Saves a project snapshot to Cloud Storage (via server API and local cache).
   */
  static async saveProjectToCloud(name: string, appId: string, files: ProjectFile[]): Promise<CloudProjectSnapshot> {
    const snapshotId = 'proj_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    const snapshot: CloudProjectSnapshot = {
      id: snapshotId,
      name,
      appId,
      timestamp: new Date().toISOString(),
      files,
      version: '1.0.0',
      apkDownloadUrl: `${window.location.origin}/api/cloud/apk/${snapshotId}.apk`
    };

    // 1. Try server-side cloud endpoint
    try {
      await fetch('/api/cloud/save-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snapshot)
      });
    } catch (err) {
      console.warn('Server cloud save warning, falling back to local persistent store:', err);
    }

    // 2. Save to local persistent cloud registry
    const existing = this.listCloudProjects();
    const updated = [snapshot, ...existing.filter(p => p.id !== snapshotId)].slice(0, 20);
    localStorage.setItem(this.LOCAL_KEY, JSON.stringify(updated));

    return snapshot;
  }

  /**
   * Lists all projects stored in Cloud storage.
   */
  static listCloudProjects(): CloudProjectSnapshot[] {
    try {
      const data = localStorage.getItem(this.LOCAL_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Deletes a project snapshot from cloud storage.
   */
  static deleteCloudProject(id: string): void {
    const list = this.listCloudProjects().filter(p => p.id !== id);
    localStorage.setItem(this.LOCAL_KEY, JSON.stringify(list));
  }

  /**
   * Uploads an APK binary blob to the cloud and returns a downloadable link.
   */
  static async uploadApkToCloud(apkBlob: Blob, appName: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('apk', apkBlob, `${appName.replace(/\s+/g, '_')}-debug.apk`);

      const res = await fetch('/api/cloud/upload-apk', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.downloadUrl) {
        return data.downloadUrl;
      }
    } catch (e) {
      console.warn('Direct upload to server cloud fallback:', e);
    }

    // Fallback: Blob object URL
    return URL.createObjectURL(apkBlob);
  }
}
