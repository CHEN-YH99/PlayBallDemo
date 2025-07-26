// 应用配置
export const appConfig = {
  // 开发环境配置
  development: {
    // 是否启用后端API（设为false直接使用本地数据，避免网络错误）
    enableBackendAPI: false,
    // 后端API地址
    apiBaseURL: 'http://localhost:5000/api',
    // API超时时间
    apiTimeout: 5000,
    // 是否显示调试信息
    debug: true
  },
  
  // 生产环境配置
  production: {
    enableBackendAPI: true,
    apiBaseURL: '/api',
    apiTimeout: 10000,
    debug: false
  }
};

// 获取当前环境配置
export function getCurrentConfig() {
  const env = process.env.NODE_ENV || 'development';
  return appConfig[env] || appConfig.development;
}

// 检查是否启用后端API
export function isBackendAPIEnabled() {
  return getCurrentConfig().enableBackendAPI;
}