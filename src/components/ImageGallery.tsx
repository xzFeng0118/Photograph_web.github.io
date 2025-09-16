import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

interface Image {
  id: string;
  title: string;
  description?: string;
  category: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  upload_date: string;
  author_name?: string;
}

interface ImageGalleryProps {
  userId?: string; // If provided, shows only user's images
  category?: string; // Filter by category
  showPublic?: boolean; // Show public gallery
}

const ImageGallery = ({ userId, category, showPublic = false }: ImageGalleryProps) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'portrait', label: 'Portrait' },
    { value: 'landscape', label: 'Landscape' },
    { value: 'street', label: 'Street' },
    { value: 'macro', label: 'Macro' },
    { value: 'black-white', label: 'Black & White' },
  ];

  useEffect(() => {
    loadImages();
  }, [userId, category, page]);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('auth_token');
      const headers: any = {};
      
      if (token && !showPublic) {
        headers.Authorization = `Bearer ${token}`;
      }

      const params: any = { page, limit: 20 };
      if (category) {
        params.category = category;
      }

      const endpoint = showPublic 
        ? '/api/images/public/gallery'
        : userId 
        ? '/api/images/my-images'
        : '/api/images/public/gallery';

      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers,
        params,
      });

      if (response.data.success) {
        if (page === 1) {
          setImages(response.data.images || []);
        } else {
          setImages(prev => [...prev, ...(response.data.images || [])]);
        }
        setHasMore(response.data.pagination?.totalPages > page);
      } else {
        throw new Error(response.data.message || 'Failed to load images');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load images';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading images...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => {
            setPage(1);
            loadImages();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Category Filter */}
      <div className="mb-6">
        <select
          value={category || ''}
          onChange={(e) => {
            setPage(1);
            // This would need to be handled by parent component
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Image Grid */}
      {images.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg">No images found</p>
          <p className="text-gray-500 text-sm mt-1">
            {showPublic ? 'Be the first to upload an image!' : 'Upload your first image to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img
                  src={image.file_url}
                  alt={image.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                    {image.category}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 truncate">
                  {image.title}
                </h3>
                {image.description && (
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {image.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDate(image.upload_date)}</span>
                  <span>{formatFileSize(image.file_size)}</span>
                </div>
                {image.author_name && (
                  <p className="text-xs text-gray-400 mt-1">
                    by {image.author_name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && images.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="relative">
              <img
                src={selectedImage.file_url}
                alt={selectedImage.title}
                className="w-full max-h-[70vh] object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedImage.title}
              </h2>
              {selectedImage.description && (
                <p className="text-gray-600 mb-4">
                  {selectedImage.description}
                </p>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {selectedImage.category}
                  </span>
                  <span>{formatDate(selectedImage.upload_date)}</span>
                  <span>{formatFileSize(selectedImage.file_size)}</span>
                </div>
                {selectedImage.author_name && (
                  <span>by {selectedImage.author_name}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;