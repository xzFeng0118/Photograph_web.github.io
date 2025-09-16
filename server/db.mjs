// ES Module 版本 - Cloudflare D1 数据库连接
// 在本地开发时使用模拟的 D1 接口，部署时使用真实的 D1

class MockD1 {
  constructor() {
    this.users = new Map();
    this.images = new Map();
    this.categories = new Map();
    this.nextId = 1;
  }

  async prepare(sql) {
    return {
      bind: (...params) => {
        return {
          run: async () => {
            if (sql.includes('INSERT INTO users')) {
              const [id, email, password_hash] = params;
              if (this.users.has(email)) {
                throw new Error('UNIQUE constraint failed: users.email');
              }
              this.users.set(email, { 
                id, 
                email, 
                password_hash, 
                name: null, 
                bio: null, 
                avatar: null, 
                email_verified: false,
                email_verify_token: null,
                email_verify_expires: null,
                created_at: new Date().toISOString() 
              });
              return { changes: 1, lastInsertRowid: id };
            }
            if (sql.includes('UPDATE users SET')) {
              const [name, bio, userId] = params;
              // Find and update user
              for (let [email, user] of this.users) {
                if (user.id === userId) {
                  user.name = name;
                  user.bio = bio;
                  this.users.set(email, user);
                  break;
                }
              }
              return { changes: 1 };
            }
            if (sql.includes('INSERT INTO images')) {
              const [id, userId, title, description, category, fileName, fileUrl, fileSize, mimeType, uploadDate] = params;
              this.images.set(id, {
                id, userId, title, description, category, fileName, fileUrl, fileSize, mimeType, uploadDate
              });
              return { changes: 1 };
            }
            if (sql.includes('UPDATE images SET')) {
              const [title, description, category, updatedDate, imageId] = params;
              const image = this.images.get(imageId);
              if (image) {
                image.title = title;
                image.description = description;
                image.category = category;
                image.updatedDate = updatedDate;
                this.images.set(imageId, image);
              }
              return { changes: 1 };
            }
            if (sql.includes('DELETE FROM images')) {
              const [imageId] = params;
              this.images.delete(imageId);
              return { changes: 1 };
            }
            return { changes: 0 };
          },
          get: async () => {
            if (sql.includes('SELECT') && sql.includes('WHERE email')) {
              const [email] = params;
              const user = this.users.get(email);
              return user ? { ...user, created_at: new Date().toISOString() } : null;
            }
            if (sql.includes('SELECT') && sql.includes('WHERE id')) {
              const [id] = params;
              // Find user by ID
              for (let [email, user] of this.users) {
                if (user.id === id) {
                  return { ...user, created_at: new Date().toISOString() };
                }
              }
              return null;
            }
            if (sql.includes('SELECT') && sql.includes('FROM images')) {
              if (sql.includes('WHERE user_id')) {
                const [userId] = params;
                const userImages = Array.from(this.images.values()).filter(img => img.userId === userId);
                return userImages;
              }
              if (sql.includes('WHERE id') && sql.includes('FROM images')) {
                const [imageId] = params;
                return this.images.get(imageId) || null;
              }
              // Return all images for public gallery
              return Array.from(this.images.values());
            }
            if (sql.includes('SELECT COUNT(*)')) {
              if (sql.includes('FROM images')) {
                if (sql.includes('WHERE user_id')) {
                  const [userId] = params;
                  const userImages = Array.from(this.images.values()).filter(img => img.userId === userId);
                  return { total: userImages.length };
                }
                return { total: this.images.size };
              }
            }
            return null;
          }
        };
      }
    };
  }
}

// 检查是否在 Cloudflare Workers 环境中
const isCloudflareWorker = typeof globalThis.env !== 'undefined' && globalThis.env.DB;

let db;

export const initDb = () => {
  if (!isCloudflareWorker) {
    db = new MockD1();
    console.log('Using local mock D1 database.');
  }
};

if (isCloudflareWorker) {
  // 在 Cloudflare Workers 中使用真实的 D1
  db = globalThis.env.DB;
  console.log('Using Cloudflare D1 database.');
} else {
  initDb(); // 确保本地模拟数据库已初始化
}

export default db;