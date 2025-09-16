import { useState, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

interface ImageUploadProps {
  onUploadSuccess?: (image: any) => void;
  onUploadError?: (error: string) => void;
}

const ImageUpload = ({ onUploadSuccess, onUploadError }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'portrait', label: 'Portrait' },
    { value: 'landscape', label: 'Landscape' },
    { value: 'street', label: 'Street' },
    { value: 'macro', label: 'Macro' },
    { value: 'black-white', label: 'Black & White' },
  ];

  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      onUploadError?.('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      onUploadError?.('File size too large. Maximum size is 10MB.');
      return;
    }

    uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      uploadFormData.append('title', formData.title || file.name);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('category', formData.category);

      const response = await axios.post(`${API_BASE_URL}/api/images/upload`, uploadFormData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onUploadSuccess?.(response.data.image);
        // Reset form
        setFormData({ title: '', description: '', category: 'general' });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
      onUploadError?.(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Image</h2>
        
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-700">
                {dragOver ? 'Drop your image here' : 'Drag & drop your image here'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or click to select a file
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {uploading ? 'Uploading...' : 'Choose File'}
            </button>
            
            <p className="text-xs text-gray-400">
              Supports JPEG, PNG, WebP • Max 10MB
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter image title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your image"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="mt-6">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Uploading image...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;