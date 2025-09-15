// Cloudflare Workers 版本

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS 处理
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 健康检查
      if (url.pathname === '/api/health') {
        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // 注册接口
      if (url.pathname === '/api/auth/register' && request.method === 'POST') {
        const { email, password } = await request.json();
        
        if (!email || !password || password.length < 8) {
          return new Response(JSON.stringify({ message: 'Invalid email or password too short' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // 简单的密码哈希（生产环境建议使用 bcrypt）
        const passwordHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
        const passwordHashHex = Array.from(new Uint8Array(passwordHash))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

        const id = crypto.randomUUID();
        const stmt = env.DB.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)');
        
        try {
          await stmt.bind(id, email, passwordHashHex).run();
          return new Response(JSON.stringify({ id, email }), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } catch (error) {
          if (error.message.includes('UNIQUE constraint')) {
            return new Response(JSON.stringify({ message: 'Email already registered' }), {
              status: 409,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          throw error;
        }
      }

      // 登录接口
      if (url.pathname === '/api/auth/login' && request.method === 'POST') {
        const { email, password } = await request.json();
        
        if (!email || !password) {
          return new Response(JSON.stringify({ message: 'Missing email or password' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // 计算密码哈希
        const passwordHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
        const passwordHashHex = Array.from(new Uint8Array(passwordHash))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

        const stmt = env.DB.prepare('SELECT id, email, password_hash FROM users WHERE email = ? LIMIT 1');
        const user = await stmt.bind(email).first();

        if (!user || user.password_hash !== passwordHashHex) {
          return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // 生成简单的 JWT（生产环境建议使用专门的 JWT 库）
        const payload = { userId: user.id, email: user.email };
        const token = btoa(JSON.stringify(payload));

        return new Response(JSON.stringify({ 
          token, 
          user: { id: user.id, email: user.email } 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ message: 'Not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ message: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};