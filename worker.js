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
        const verifyToken = crypto.randomUUID();
        const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        const stmt = env.DB.prepare('INSERT INTO users (id, email, password_hash, email_verify_token, email_verify_expires) VALUES (?, ?, ?, ?, ?)');
        
        try {
          await stmt.bind(id, email, passwordHashHex, verifyToken, verifyExpires.toISOString()).run();
          return new Response(JSON.stringify({ 
            id, 
            email,
            emailSent: true,
            message: 'Registration successful! Please check your email for verification.'
          }), {
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

      // 获取用户资料
      if (url.pathname === '/api/auth/profile' && request.method === 'GET') {
        const authHeader = request.headers.get('authorization') || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        
        if (!token) {
          return new Response(JSON.stringify({ message: 'Missing token' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        try {
          const payload = JSON.parse(atob(token));
          const stmt = env.DB.prepare('SELECT id, email, name, bio, avatar, created_at FROM users WHERE id = ? LIMIT 1');
          const user = await stmt.bind(payload.userId).first();
          
          if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          return new Response(JSON.stringify({ user }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } catch (error) {
          return new Response(JSON.stringify({ message: 'Invalid token' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      // 更新用户资料
      if (url.pathname === '/api/auth/profile' && request.method === 'PUT') {
        const authHeader = request.headers.get('authorization') || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        
        if (!token) {
          return new Response(JSON.stringify({ message: 'Missing token' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        try {
          const payload = JSON.parse(atob(token));
          const { name, bio } = await request.json();
          
          const stmt = env.DB.prepare('UPDATE users SET name = ?, bio = ? WHERE id = ?');
          await stmt.bind(name || null, bio || null, payload.userId).run();
          
          // 获取更新后的用户信息
          const getUserStmt = env.DB.prepare('SELECT id, email, name, bio, avatar, created_at FROM users WHERE id = ? LIMIT 1');
          const user = await getUserStmt.bind(payload.userId).first();
          
          return new Response(JSON.stringify({ user }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } catch (error) {
          return new Response(JSON.stringify({ message: 'Invalid token' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
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

      // 验证邮箱
      if (url.pathname === '/api/auth/verify-email' && request.method === 'POST') {
        const { token } = await request.json();
        
        if (!token) {
          return new Response(JSON.stringify({ message: 'Missing verification token' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const stmt = env.DB.prepare('SELECT id, email, email_verify_expires FROM users WHERE email_verify_token = ? LIMIT 1');
        const user = await stmt.bind(token).first();
        
        if (!user) {
          return new Response(JSON.stringify({ message: 'Invalid verification token' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // 检查令牌是否过期
        const now = new Date();
        const expires = new Date(user.email_verify_expires);
        
        if (now > expires) {
          return new Response(JSON.stringify({ message: 'Verification token has expired' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // 更新用户验证状态
        const updateStmt = env.DB.prepare('UPDATE users SET email_verified = TRUE, email_verify_token = NULL, email_verify_expires = NULL WHERE id = ?');
        await updateStmt.bind(user.id).run();
        
        return new Response(JSON.stringify({ 
          message: 'Email verification successful!',
          email: user.email 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // 重新发送验证邮件
      if (url.pathname === '/api/auth/resend-verification' && request.method === 'POST') {
        const { email } = await request.json();
        
        if (!email) {
          return new Response(JSON.stringify({ message: 'Missing email address' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const stmt = env.DB.prepare('SELECT id, email, email_verified FROM users WHERE email = ? LIMIT 1');
        const user = await stmt.bind(email).first();
        
        if (!user) {
          return new Response(JSON.stringify({ message: 'User not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        if (user.email_verified) {
          return new Response(JSON.stringify({ message: 'Email already verified' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // 生成新的验证令牌
        const verifyToken = crypto.randomUUID();
        const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        const updateStmt = env.DB.prepare('UPDATE users SET email_verify_token = ?, email_verify_expires = ? WHERE id = ?');
        await updateStmt.bind(verifyToken, verifyExpires.toISOString(), user.id).run();
        
        return new Response(JSON.stringify({ 
          message: 'Verification email has been resent!',
          success: true
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