// API 配置
const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:4000'  // 本地开发
  : 'https://photograph-auth.photoweb.workers.dev';  // 生产环境

// 替换为你的实际 Workers URL
export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/api/health`,
  register: `${API_BASE_URL}/api/auth/register`,
  login: `${API_BASE_URL}/api/auth/login`,
};