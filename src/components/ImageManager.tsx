import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import ImageGallery from './ImageGallery';
import type { CloudflareImage } from '../services/cloudflareService';

const ImageManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('upload');
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUploadSuccess = (image: CloudflareImage) => {
    setUploadSuccess(`图片 "${image.filename}" 上传成功！`);
    setUploadError(null);
    // 3秒后清除成功消息
    setTimeout(() => setUploadSuccess(null), 3000);
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
    setUploadSuccess(null);
    // 5秒后清除错误消息
    setTimeout(() => setUploadError(null), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">图片管理</h1>
        <p className="text-gray-600">使用 Cloudflare Images 安全存储和管理您的摄影作品</p>
      </div>

      {/* 标签页导航 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upload'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            上传图片
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'gallery'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            图片画廊
          </button>
        </nav>
      </div>

      {/* 消息提示 */}
      {uploadSuccess && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{uploadSuccess}</p>
            </div>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{uploadError}</p>
            </div>
          </div>
        </div>
      )}

      {/* 标签页内容 */}
      <div className="min-h-[400px]">
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">上传新图片</h2>
              <ImageUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Cloudflare Images 优势</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 🚀 全球CDN加速，图片加载速度极快</li>
                <li>• 🔒 安全可靠，支持签名URL和访问控制</li>
                <li>• 📱 自动生成多种尺寸，适配不同设备</li>
                <li>• 💰 按使用量计费，成本可控</li>
                <li>• 🛡️ 内置DDoS防护和安全防护</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">使用说明</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 支持 PNG、JPG、GIF、WebP 格式的图片</li>
                <li>• 单个文件大小限制为 10MB</li>
                <li>• 可以拖拽图片到上传区域</li>
                <li>• 上传的图片将存储在 Cloudflare 全球CDN</li>
                <li>• 自动生成缩略图、小图、中图、大图等多种尺寸</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">我的图片</h2>
              <button
                onClick={() => setActiveTab('upload')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                上传新图片
              </button>
            </div>
            <ImageGallery />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageManager; 