import React, { useState, useEffect } from 'react';
import { getImages, getImageVariants } from '../services/cloudflareService';
import type { CloudflareImage } from '../services/cloudflareService';
import Navbar from './Navbar';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<CloudflareImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<CloudflareImage | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      const imageList = await getImages(pageNum, 20);
      setImages(prev => pageNum === 1 ? imageList.images : [...prev, ...imageList.images]);
      setHasMore(imageList.images.length === 20);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载图片失败');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadImages(page + 1);
    }
  };

  const openImageModal = (image: CloudflareImage) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">摄影画廊</h1>
            <p className="text-xl text-gray-600">探索我的摄影作品集</p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>由 Cloudflare Images 提供全球CDN加速</span>
            </div>
          </div>

          {loading && images.length === 0 && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">加载中...</span>
            </div>
          )}

          {error && images.length === 0 && (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={() => loadImages(1)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                重试
              </button>
            </div>
          )}

          {!loading && !error && images.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无图片</h3>
              <p className="text-gray-500">还没有上传任何图片到画廊</p>
            </div>
          )}

          {!loading && !error && images.length > 0 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((image) => {
                  const variants = getImageVariants(image.id);
                  return (
                    <div
                      key={image.id}
                      className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                      onClick={() => openImageModal(image)}
                    >
                      <div className="aspect-w-1 aspect-h-1 w-full">
                        <img
                          src={variants.medium}
                          alt={image.filename}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {image.filename}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(image.uploaded).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 加载更多按钮 */}
              {hasMore && (
                <div className="text-center">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? '加载中...' : '加载更多图片'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 图片详情模态框 */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-6xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-75 z-10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="bg-white rounded-lg overflow-hidden">
              <img
                src={getImageVariants(selectedImage.id).original}
                alt={selectedImage.filename}
                className="max-w-full max-h-[80vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedImage.filename}
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">上传时间:</span>
                    <p>{new Date(selectedImage.uploaded).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">文件ID:</span>
                    <p className="font-mono text-xs">{selectedImage.id}</p>
                  </div>
                  <div>
                    <span className="font-medium">签名URL:</span>
                    <p>{selectedImage.requireSignedURLs ? '是' : '否'}</p>
                  </div>
                  <div>
                    <span className="font-medium">状态:</span>
                    <p>{selectedImage.draft ? '草稿' : '已发布'}</p>
                  </div>
                </div>
                
                {/* 不同尺寸的图片链接 */}
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">不同尺寸:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(getImageVariants(selectedImage.id)).map(([size, url]) => (
                      <a
                        key={size}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm truncate"
                        title={url}
                      >
                        {size}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery; 