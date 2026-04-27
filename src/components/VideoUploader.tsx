'use client';

import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon, TrashIcon, PlayIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface VideoUploaderProps {
  currentUrl: string;
  onUploadComplete: (url: string) => void;
  onDelete: () => void;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const MAX_MB = 100;
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ currentUrl, onUploadComplete, onDelete }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError('');

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload MP4, WebM, MOV, or AVI.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${MAX_MB} MB.`);
      return;
    }
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError('Video upload is not configured. Please contact support.');
      return;
    }

    setFileName(file.name);
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('resource_type', 'video');
    formData.append('folder', 'business-videos');

    await new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          // Cloudinary processing adds ~10% after 100% upload
          setProgress(Math.min(90, Math.round((e.loaded / e.total) * 90)));
        }
      });

      xhr.addEventListener('load', async () => {
        setProgress(95);
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
            // Save URL to our DB
            const saveRes = await fetch('/api/business/video', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ videoUrl: data.secure_url, publicId: data.public_id }),
            });
            const saveData = await saveRes.json();
            if (saveData.success) {
              setProgress(100);
              onUploadComplete(data.secure_url);
            } else {
              setError(saveData.error || 'Failed to save video. Please try again.');
            }
          } else {
            setError(data.error?.message || 'Upload to Cloudinary failed. Please try again.');
          }
        } catch {
          setError('Unexpected response from upload server.');
        }
        setUploading(false);
        resolve();
      });

      xhr.addEventListener('error', () => {
        setError('Network error. Please check your connection and try again.');
        setUploading(false);
        resolve();
      });

      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);
      xhr.send(formData);
    });
  };

  const handleDelete = async () => {
    if (!window.confirm('Remove the video introduction from your profile?')) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/business/video', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        onDelete();
        setProgress(0);
        setFileName('');
      } else {
        setError(data.error || 'Failed to delete video.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // --- Existing video preview ---
  if (currentUrl && !uploading) {
    return (
      <div className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="aspect-video bg-black">
          <video src={currentUrl} controls className="w-full h-full object-contain" preload="metadata" />
        </div>
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800 flex-wrap gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate">Video uploaded successfully</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-xs px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              <TrashIcon className="w-3.5 h-3.5" />
              {deleting ? 'Removing…' : 'Remove'}
            </button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
        />
      </div>
    );
  }

  // --- Upload zone ---
  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          uploading ? 'cursor-not-allowed opacity-80' :
          dragOver ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 cursor-copy' :
          'border-neutral-300 dark:border-neutral-600 hover:border-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 cursor-pointer'
        }`}
      >
        {uploading ? (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <CloudArrowUpIcon className="w-6 h-6 text-primary-600 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-xs mx-auto">
                {progress < 95 ? `Uploading ${fileName}…` : 'Processing…'}
              </p>
            </div>
            <div className="w-full max-w-xs mx-auto bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-primary-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-neutral-500">{progress}%{progress >= 95 ? ' — almost done' : ''}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-14 h-14 mx-auto bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center">
              <PlayIcon className="w-7 h-7 text-neutral-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                <span className="text-primary-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-neutral-400 mt-1">MP4, WebM, MOV, AVI — up to {MAX_MB} MB</p>
              <p className="text-xs text-neutral-400">Video uploads directly to cloud — no size limits from the server</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">⚠️ {error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
    </div>
  );
};

export default VideoUploader;
