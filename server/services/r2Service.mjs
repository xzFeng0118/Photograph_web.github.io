// R2 图片上传服务
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

// R2 配置
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'your-account-id';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || 'your-access-key';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || 'your-secret-key';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'photograph-images';

// 创建 S3 客户端（R2 兼容 S3 API）
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// 生成唯一文件名
export function generateUniqueFileName(originalName, userId) {
  const timestamp = Date.now();
  const randomId = randomUUID().slice(0, 8);
  const extension = originalName.split('.').pop();
  return `${userId}/${timestamp}-${randomId}.${extension}`;
}

// 上传图片到 R2
export async function uploadImageToR2(file, userId) {
  try {
    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
    }

    // 检查文件大小（最大 10MB）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 10MB.');
    }

    const fileName = generateUniqueFileName(file.originalname, userId);
    
    const uploadParams = {
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        userId: userId,
        originalName: file.originalname,
        uploadDate: new Date().toISOString(),
      },
    };

    const command = new PutObjectCommand(uploadParams);
    const result = await s3Client.send(command);

    return {
      success: true,
      fileName: fileName,
      url: `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${fileName}`,
      etag: result.ETag,
    };
  } catch (error) {
    console.error('R2 upload error:', error);
    throw error;
  }
}

// 生成预签名 URL（用于直接上传）
export async function generatePresignedUploadUrl(fileName, contentType, userId) {
  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      ContentType: contentType,
      Metadata: {
        userId: userId,
        uploadDate: new Date().toISOString(),
      },
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1小时有效期
    
    return {
      success: true,
      uploadUrl: signedUrl,
      publicUrl: `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${fileName}`,
    };
  } catch (error) {
    console.error('Presigned URL generation error:', error);
    throw error;
  }
}

// 生成预签名 URL（用于查看图片）
export async function generatePresignedViewUrl(fileName) {
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1小时有效期
    
    return {
      success: true,
      viewUrl: signedUrl,
    };
  } catch (error) {
    console.error('Presigned view URL generation error:', error);
    throw error;
  }
}

// 删除图片
export async function deleteImageFromR2(fileName) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
    });

    await s3Client.send(command);
    
    return {
      success: true,
      message: 'Image deleted successfully',
    };
  } catch (error) {
    console.error('R2 delete error:', error);
    throw error;
  }
}

// 获取图片信息
export async function getImageInfo(fileName) {
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
    });

    const result = await s3Client.send(command);
    
    return {
      success: true,
      contentType: result.ContentType,
      contentLength: result.ContentLength,
      lastModified: result.LastModified,
      metadata: result.Metadata,
    };
  } catch (error) {
    console.error('Get image info error:', error);
    throw error;
  }
}

// 模拟 R2 服务（用于本地开发）
export class MockR2Service {
  constructor() {
    this.images = new Map();
  }

  async uploadImage(file, userId) {
    const fileName = generateUniqueFileName(file.originalname, userId);
    const mockUrl = `https://mock-r2.example.com/${fileName}`;
    
    this.images.set(fileName, {
      userId,
      originalName: file.originalname,
      contentType: file.mimetype,
      size: file.size,
      uploadDate: new Date().toISOString(),
      url: mockUrl,
    });

    console.log(`📸 [Mock R2] Image uploaded: ${fileName}`);
    
    return {
      success: true,
      fileName: fileName,
      url: mockUrl,
      etag: `"${randomUUID()}"`,
    };
  }

  async generatePresignedUploadUrl(fileName, contentType, userId) {
    const mockUploadUrl = `https://mock-r2.example.com/upload/${fileName}?token=mock-token`;
    const mockPublicUrl = `https://mock-r2.example.com/${fileName}`;
    
    console.log(`📸 [Mock R2] Generated presigned URL for: ${fileName}`);
    
    return {
      success: true,
      uploadUrl: mockUploadUrl,
      publicUrl: mockPublicUrl,
    };
  }

  async generatePresignedViewUrl(fileName) {
    const mockViewUrl = `https://mock-r2.example.com/view/${fileName}?token=mock-token`;
    
    console.log(`📸 [Mock R2] Generated view URL for: ${fileName}`);
    
    return {
      success: true,
      viewUrl: mockViewUrl,
    };
  }

  async deleteImage(fileName) {
    this.images.delete(fileName);
    console.log(`📸 [Mock R2] Image deleted: ${fileName}`);
    
    return {
      success: true,
      message: 'Image deleted successfully',
    };
  }

  async getImageInfo(fileName) {
    const image = this.images.get(fileName);
    if (!image) {
      throw new Error('Image not found');
    }
    
    return {
      success: true,
      contentType: image.contentType,
      contentLength: image.size,
      lastModified: new Date(image.uploadDate),
      metadata: {
        userId: image.userId,
        originalName: image.originalName,
        uploadDate: image.uploadDate,
      },
    };
  }
}

// 根据环境选择服务
const isProduction = process.env.NODE_ENV === 'production' && R2_ACCESS_KEY_ID !== 'your-access-key';
export const r2Service = isProduction ? {
  uploadImage: uploadImageToR2,
  generatePresignedUploadUrl,
  generatePresignedViewUrl,
  deleteImage: deleteImageFromR2,
  getImageInfo,
} : new MockR2Service();