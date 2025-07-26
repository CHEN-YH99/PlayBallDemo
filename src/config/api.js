// API配置
export const apiConfig = {
  // 是否启用后端API（开发环境可以设置为false避免网络错误）
  enableBackendAPI: false,
  
  // 后端API基础URL
  baseURL: 'http://localhost:5000/api',
  
  // 请求超时时间
  timeout: 5000,
  
  // 是否显示API请求日志
  showRequestLogs: false,
  
  // 是否显示API错误日志
  showErrorLogs: false
};

// 根据环境自动配置
try {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.MODE === 'development') {
      // 开发环境：禁用后端API，减少错误日志
      apiConfig.enableBackendAPI = false;
      apiConfig.showRequestLogs = false;
      apiConfig.showErrorLogs = false;
    } else if (import.meta.env.MODE === 'production') {
      // 生产环境：启用后端API
      apiConfig.enableBackendAPI = true;
      apiConfig.showRequestLogs = false;
      apiConfig.showErrorLogs = true;
    }
  }
} catch (error) {
  // 在Node.js环境中运行时，使用默认配置
}