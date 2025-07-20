import React, { useState, useEffect } from 'react';
import { getImages, deleteImage, getImageVariants } from '../services/cloudflareService';
import type { CloudflareImage } from '../services/cloudflareService';

const ImageGallery: React.FC = () => {
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

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('确定要删除这张图片吗？')) return;

    try {
      await deleteImage(imageId);
      setImages(images.filter(img => img.id !== imageId));
      if (selectedImage?.id === imageId) {
        setSelectedImage(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败');
    }
  };

  const openImageModal = (image: CloudflareImage) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };



  if (loading && images.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">加载中...</span>
      </div>
    );
  }

  if (error && images.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => loadImages(1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => {
          const variants = getImageVariants(image.id);
          return (
            <div
              key={image.id}
              className="relative group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={variants.thumbnail}
                alt={image.filename}
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => openImageModal(image)}
                loading="lazy"
              />
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {image.filename}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(image.uploaded).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDeleteImage(image.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="删除图片"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '加载中...' : '加载更多'}
          </button>
        </div>
      )}

      {/* 图片详情模态框 */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 z-10"
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

export default ImageGallery; 