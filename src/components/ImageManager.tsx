import { useState } from 'react';
import Navbar from './Navbar';
import ImageUpload from './ImageUpload';
import ImageGallery from './ImageGallery';

const ImageManager = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'my-images' | 'gallery'>('upload');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUploadSuccess = (image: any) => {
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Photo Management</h1>
            <p className="text-gray-600">Upload, organize, and showcase your photography</p>
          </div>

          {/* Success Message */}
          {uploadSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Image uploaded successfully!
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'upload'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('my-images')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'my-images'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    My Images
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'gallery'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Public Gallery
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'upload' && (
              <ImageUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            )}
            
            {activeTab === 'my-images' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">My Images</h2>
                  <p className="text-gray-600">Manage your uploaded images</p>
                </div>
                <ImageGallery userId="current" />
              </div>
            )}
            
            {activeTab === 'gallery' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Public Gallery</h2>
                  <p className="text-gray-600">Browse images from all photographers</p>
                </div>
                <ImageGallery showPublic={true} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImageManager;