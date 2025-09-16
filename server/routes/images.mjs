// 图片上传和管理路由
import express from 'express';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { r2Service } from '../services/r2Service.mjs';
import { generateUniqueFileName } from '../services/r2Service.mjs';
import db from '../db.mjs';

const router = express.Router();

// 配置 multer 用于内存存储
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
    }
  },
});

// 验证用户身份
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    if (!token) {
      return res.status(401).json({ message: 'Missing token' });
    }

    // 简单的 JWT 验证（生产环境建议使用专门的 JWT 库）
    let payload;
    try {
      payload = JSON.parse(atob(token));
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.userId = payload.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// 上传图片
router.post('/upload', authenticateUser, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const { title, description, category } = req.body;
    const userId = req.userId;

    // 上传到 R2
    const uploadResult = await r2Service.uploadImage(req.file, userId);
    
    if (!uploadResult.success) {
      return res.status(500).json({ message: 'Failed to upload image' });
    }

    // 保存图片信息到数据库
    const imageId = randomUUID();
    const stmt = await db.prepare(`
      INSERT INTO images (id, user_id, title, description, category, file_name, file_url, file_size, mime_type, upload_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    await stmt.bind(
      imageId,
      userId,
      title || req.file.originalname,
      description || null,
      category || 'general',
      uploadResult.fileName,
      uploadResult.url,
      req.file.size,
      req.file.mimetype,
      new Date().toISOString()
    ).run();

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      image: {
        id: imageId,
        title: title || req.file.originalname,
        description: description || null,
        category: category || 'general',
        fileName: uploadResult.fileName,
        url: uploadResult.url,
        size: req.file.size,
        mimeType: req.file.mimetype,
        uploadDate: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: error.message || 'Upload failed' 
    });
  }
});

// 获取用户图片列表
router.get('/my-images', authenticateUser, async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const userId = req.userId;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM images WHERE user_id = ?';
    let params = [userId];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY upload_date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const stmt = await db.prepare(query);
    const images = await stmt.bind(...params).all();

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM images WHERE user_id = ?';
    let countParams = [userId];

    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    const countStmt = await db.prepare(countQuery);
    const countResult = await countStmt.bind(...countParams).first();

    res.json({
      success: true,
      images: images || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        totalPages: Math.ceil(countResult.total / limit),
      },
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ message: 'Failed to get images' });
  }
});

// 获取单张图片详情
router.get('/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;

    const stmt = await db.prepare('SELECT * FROM images WHERE id = ?');
    const image = await stmt.bind(imageId).first();

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({
      success: true,
      image,
    });
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ message: 'Failed to get image' });
  }
});

// 更新图片信息
router.put('/:imageId', authenticateUser, async (req, res) => {
  try {
    const { imageId } = req.params;
    const { title, description, category } = req.body;
    const userId = req.userId;

    // 检查图片是否存在且属于当前用户
    const checkStmt = await db.prepare('SELECT user_id FROM images WHERE id = ?');
    const image = await checkStmt.bind(imageId).first();

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (image.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // 更新图片信息
    const updateStmt = await db.prepare(`
      UPDATE images 
      SET title = ?, description = ?, category = ?, updated_date = ?
      WHERE id = ?
    `);

    await updateStmt.bind(
      title || null,
      description || null,
      category || 'general',
      new Date().toISOString(),
      imageId
    ).run();

    // 获取更新后的图片信息
    const getStmt = await db.prepare('SELECT * FROM images WHERE id = ?');
    const updatedImage = await getStmt.bind(imageId).first();

    res.json({
      success: true,
      message: 'Image updated successfully',
      image: updatedImage,
    });
  } catch (error) {
    console.error('Update image error:', error);
    res.status(500).json({ message: 'Failed to update image' });
  }
});

// 删除图片
router.delete('/:imageId', authenticateUser, async (req, res) => {
  try {
    const { imageId } = req.params;
    const userId = req.userId;

    // 检查图片是否存在且属于当前用户
    const checkStmt = await db.prepare('SELECT file_name, user_id FROM images WHERE id = ?');
    const image = await checkStmt.bind(imageId).first();

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (image.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // 从 R2 删除图片
    await r2Service.deleteImage(image.file_name);

    // 从数据库删除记录
    const deleteStmt = await db.prepare('DELETE FROM images WHERE id = ?');
    await deleteStmt.bind(imageId).run();

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Failed to delete image' });
  }
});

// 生成预签名上传 URL
router.post('/presigned-url', authenticateUser, async (req, res) => {
  try {
    const { fileName, contentType } = req.body;
    const userId = req.userId;

    if (!fileName || !contentType) {
      return res.status(400).json({ message: 'File name and content type are required' });
    }

    const result = await r2Service.generatePresignedUploadUrl(fileName, contentType, userId);

    res.json({
      success: true,
      uploadUrl: result.uploadUrl,
      publicUrl: result.publicUrl,
    });
  } catch (error) {
    console.error('Presigned URL error:', error);
    res.status(500).json({ message: 'Failed to generate presigned URL' });
  }
});

// 获取公开图片列表（用于展示）
router.get('/public/gallery', async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT i.*, u.name as author_name, u.email as author_email
      FROM images i
      LEFT JOIN users u ON i.user_id = u.id
      WHERE 1=1
    `;
    let params = [];

    if (category) {
      query += ' AND i.category = ?';
      params.push(category);
    }

    query += ' ORDER BY i.upload_date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const stmt = await db.prepare(query);
    const images = await stmt.bind(...params).all();

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM images';
    let countParams = [];

    if (category) {
      countQuery += ' WHERE category = ?';
      countParams.push(category);
    }

    const countStmt = await db.prepare(countQuery);
    const countResult = await countStmt.bind(...countParams).first();

    res.json({
      success: true,
      images: images || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        totalPages: Math.ceil(countResult.total / limit),
      },
    });
  } catch (error) {
    console.error('Get public gallery error:', error);
    res.status(500).json({ message: 'Failed to get gallery' });
  }
});

export default router;