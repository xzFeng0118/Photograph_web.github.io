// ES Module 版本 - Cloudflare D1 数据库连接
// 在本地开发时使用模拟的 D1 接口，部署时使用真实的 D1

class MockD1 {
  constructor() {
    this.users = new Map();
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
              this.users.set(email, { id, email, password_hash });
              return { changes: 1, lastInsertRowid: id };
            }
            return { changes: 0 };
          },
          get: async () => {
            if (sql.includes('SELECT') && sql.includes('WHERE email')) {
              const [email] = params;
              const user = this.users.get(email);
              return user ? { ...user, created_at: new Date().toISOString() } : null;
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
if (isCloudflareWorker) {
  // 在 Cloudflare Workers 中使用真实的 D1
  db = globalThis.env.DB;
} else {
  // 本地开发使用模拟的 D1
  db = new MockD1();
}

export default db;