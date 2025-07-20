# Cloudflare Images 设置指南

## 1. 创建 Cloudflare 账户

1. 访问 [Cloudflare 官网](https://www.cloudflare.com/)
2. 注册并登录您的账户
3. 添加您的域名（如果还没有的话）

## 2. 启用 Cloudflare Images

1. 在 Cloudflare 控制台中，找到 "Images" 产品
2. 点击 "Get started" 启用 Images 服务
3. 选择您的账户（Account ID 会自动生成）

## 3. 创建 API Token

1. 在 Cloudflare 控制台中，进入 "My Profile" → "API Tokens"
2. 点击 "Create Token"
3. 选择 "Custom token" 模板
4. 配置权限：
   - **Account**: Cloudflare Images:Edit
   - **Zone**: 选择您的域名（如果需要）
5. 设置 Token 名称，如 "Photography Website Images"
6. 点击 "Continue to summary" 然后 "Create Token"
7. **重要**: 复制生成的 Token，它只会显示一次！

## 4. 获取 Account ID

1. 在 Cloudflare 控制台中，右侧边栏会显示您的 Account ID
2. 或者进入 "My Profile" → "Account Home" 查看

## 5. 配置环境变量

在项目根目录创建 `.env` 文件：

```env
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id_here
VITE_CLOUDFLARE_API_TOKEN=your_api_token_here
```

## 6. 配置图片变体（可选）

在 Cloudflare Images 控制台中，您可以配置不同的图片变体：

1. 进入 Images → Settings → Variants
2. 创建以下变体：
   - `thumbnail`: 150x150, fit: cover
   - `small`: 300x300, fit: cover
   - `medium`: 600x600, fit: cover
   - `large`: 1200x1200, fit: cover
   - `public`: 原始尺寸

## 7. 功能说明

### 上传功能
- 支持拖拽上传
- 支持点击选择文件
- 文件大小限制：10MB
- 支持格式：PNG、JPG、GIF、WebP
- 实时上传进度显示

### 管理功能
- 查看所有上传的图片
- 删除图片
- 查看图片详情
- 分页加载
- 响应式布局

### CDN 优势
- 全球 CDN 加速
- 自动图片优化
- 多种尺寸变体
- 安全访问控制

## 8. 安全注意事项

### API Token 安全
- 不要在代码中硬编码 Token
- 使用环境变量管理敏感信息
- 定期轮换 API Token
- 设置最小权限原则

### 访问控制
- 可以启用签名 URL 来限制访问
- 设置域名白名单
- 配置 CORS 策略

## 9. 成本说明

Cloudflare Images 按使用量计费：

- **存储**: $5/月/100,000 张图片
- **带宽**: $0.40/GB
- **转换**: $0.40/1,000 次转换

对于个人摄影网站，通常每月成本很低。

## 10. 故障排除

### 常见错误

1. **401 Unauthorized**
   - 检查 API Token 是否正确
   - 确认 Token 有足够的权限

2. **403 Forbidden**
   - 检查 Account ID 是否正确
   - 确认 Images 服务已启用

3. **CORS 错误**
   - 在 Cloudflare 控制台配置 CORS 策略
   - 检查域名设置

4. **上传失败**
   - 检查文件大小是否超过限制
   - 确认文件格式支持
   - 检查网络连接

### 开发环境调试

1. 检查浏览器控制台错误信息
2. 确认环境变量已正确加载
3. 验证 API 调用是否成功
4. 检查网络请求状态

## 11. 生产环境部署

### Vercel 部署
1. 在 Vercel 项目设置中添加环境变量
2. 重新部署项目

### 其他平台
1. 在平台设置中配置环境变量
2. 确保环境变量名称正确

## 12. 性能优化建议

1. **使用合适的图片变体**
   - 缩略图使用 `thumbnail` 变体
   - 列表页使用 `small` 或 `medium` 变体
   - 详情页使用 `large` 或 `original` 变体

2. **启用懒加载**
   - 使用 `loading="lazy"` 属性
   - 实现虚拟滚动（大量图片时）

3. **缓存策略**
   - 利用 Cloudflare 的缓存机制
   - 设置合适的缓存头

## 13. 监控和分析

在 Cloudflare 控制台中，您可以查看：

- 图片上传统计
- 带宽使用情况
- 转换次数
- 错误率统计

这些数据可以帮助您优化使用和成本。 