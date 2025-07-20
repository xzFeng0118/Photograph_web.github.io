# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## 项目结构

```
src/
├── components/
│   ├── Navbar.tsx          # 导航栏组件
│   ├── Gallery.tsx         # 主Gallery组件
│   ├── GalleryGrid.tsx     # 图片网格组件
│   ├── GalleryCategories.tsx # 分类筛选组件
│   └── GalleryModal.tsx    # 图片查看模态框组件
├── data/
│   └── galleryData.ts      # 图片和分类数据
├── App.tsx                 # 主应用组件
└── main.tsx               # 应用入口
```

## 使用方法

### 1. 添加新图片
在 `src/data/galleryData.ts` 文件中添加新的图片数据：

```typescript
{
  id: 10,
  src: "你的图片URL",
  alt: "图片描述",
  category: "landscape", // 分类
  title: "图片标题",
  description: "图片详细描述"
}
```

### 2. 添加新分类
在 `galleryCategories` 数组中添加新分类：

```typescript
{ id: "new-category", name: "新分类名称" }
```

### 3. 自定义样式
所有样式都使用Tailwind CSS类，可以在组件中直接修改className来调整外观。

## 技术栈

- **React 18**: 前端框架
- **TypeScript**: 类型安全
- **Tailwind CSS**: 样式框架
- **Vite**: 构建工具

## 运行项目

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 构建生产版本：
```bash
npm run build
```

## 自定义配置

### 图片数据格式
```typescript
interface Photo {
  id: number;           // 唯一标识符
  src: string;          // 图片URL
  alt: string;          // 图片alt属性
  category: string;     // 分类标识
  title: string;        // 图片标题
  description?: string; // 图片描述（可选）
}
```

### 分类数据格式
```typescript
interface Category {
  id: string;   // 分类标识符
  name: string; // 分类显示名称
}
```

## 扩展功能建议

1. **图片懒加载**: 添加图片懒加载功能提升性能
2. **图片压缩**: 根据设备尺寸加载不同分辨率的图片
3. **搜索功能**: 添加图片搜索功能
4. **收藏功能**: 允许用户收藏喜欢的图片
5. **分享功能**: 添加社交媒体分享按钮
6. **图片下载**: 提供高质量图片下载功能
7. **评论系统**: 添加图片评论功能
8. **用户认证**: 添加用户登录和权限管理

## 许可证

MIT License 