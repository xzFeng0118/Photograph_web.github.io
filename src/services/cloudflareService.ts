// Cloudflare Images API配置
const CLOUDFLARE_ACCOUNT_ID = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = import.meta.env.VITE_CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_IMAGES_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;

export interface CloudflareImage {
  id: string;
  filename: string;
  uploaded: string;
  requireSignedURLs: boolean;
  variants: string[];
  meta: {
    [key: string]: string;
  };
  draft: boolean;
}

export interface CloudflareImageList {
  images: CloudflareImage[];
  continuation_token?: string;
}

export interface CloudflareResponse<T> {
  success: boolean;
  errors: string[];
  messages: string[];
  result: T;
}

// 创建上传URL（推荐方式）
export const createUploadUrl = async (): Promise<{ uploadURL: string; id: string }> => {
  try {
    const response = await fetch(CLOUDFLARE_IMAGES_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requireSignedURLs: false,
        metadata: {
          uploaded_by: 'photography-website'
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CloudflareResponse<{ uploadURL: string; id: string }> = await response.json();
    
    if (!data.success) {
      throw new Error(data.errors.join(', '));
    }

    return data.result;
  } catch (error) {
    console.error('创建上传URL失败:', error);
    throw new Error('创建上传URL失败');
  }
};

// 上传图片到Cloudflare
export const uploadImage = async (file: File): Promise<CloudflareImage> => {
  try {
    // 第一步：获取上传URL
    const { uploadURL } = await createUploadUrl();

    // 第二步：上传文件
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await fetch(uploadURL, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`上传失败! status: ${uploadResponse.status}`);
    }

    const uploadData = await uploadResponse.json();

    if (!uploadData.success) {
      throw new Error(uploadData.errors.join(', '));
    }

    return uploadData.result;
  } catch (error) {
    console.error('上传图片失败:', error);
    throw new Error('上传图片失败');
  }
};

// 获取图片列表
export const getImages = async (page = 1, perPage = 20): Promise<CloudflareImageList> => {
  try {
    const response = await fetch(`${CLOUDFLARE_IMAGES_URL}?page=${page}&per_page=${perPage}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CloudflareResponse<CloudflareImageList> = await response.json();
    
    if (!data.success) {
      throw new Error(data.errors.join(', '));
    }

    return data.result;
  } catch (error) {
    console.error('获取图片列表失败:', error);
    throw new Error('获取图片列表失败');
  }
};

// 获取单个图片信息
export const getImage = async (imageId: string): Promise<CloudflareImage> => {
  try {
    const response = await fetch(`${CLOUDFLARE_IMAGES_URL}/${imageId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CloudflareResponse<CloudflareImage> = await response.json();
    
    if (!data.success) {
      throw new Error(data.errors.join(', '));
    }

    return data.result;
  } catch (error) {
    console.error('获取图片信息失败:', error);
    throw new Error('获取图片信息失败');
  }
};

// 删除图片
export const deleteImage = async (imageId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${CLOUDFLARE_IMAGES_URL}/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CloudflareResponse<null> = await response.json();
    
    if (!data.success) {
      throw new Error(data.errors.join(', '));
    }

    return true;
  } catch (error) {
    console.error('删除图片失败:', error);
    throw new Error('删除图片失败');
  }
};

// 生成图片URL
export const getImageUrl = (imageId: string, variant = 'public'): string => {
  return `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_ID}/${imageId}/${variant}`;
};

// 获取图片的多种尺寸URL
export const getImageVariants = (imageId: string) => {
  return {
    thumbnail: getImageUrl(imageId, 'thumbnail'),
    small: getImageUrl(imageId, 'small'),
    medium: getImageUrl(imageId, 'medium'),
    large: getImageUrl(imageId, 'large'),
    original: getImageUrl(imageId, 'public'),
  };
}; 