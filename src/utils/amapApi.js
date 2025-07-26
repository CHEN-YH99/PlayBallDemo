import axios from 'axios';

// 高德地图API服务
class AmapApiService {
  constructor() {
    this.apiKey = '429928e780b76af87f93f96d32d21ec5';
    this.baseURL = 'https://restapi.amap.com/v3';
  }

  // 使用JSONP方式请求（解决跨域问题）
  jsonpRequest(url, params = {}) {
    return new Promise((resolve, reject) => {
      const callbackName = `amapCallback_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const script = document.createElement('script');
      
      // 添加API密钥和回调参数
      const requestParams = {
        key: this.apiKey,
        callback: callbackName,
        ...params
      };

      // 构建查询字符串
      const queryString = new URLSearchParams(requestParams).toString();
      const fullUrl = `${url}?${queryString}`;

      // 设置超时
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('请求超时'));
      }, 10000);

      // 清理函数
      const cleanup = () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        if (window[callbackName]) {
          delete window[callbackName];
        }
        clearTimeout(timeout);
      };

      // 设置回调函数
      window[callbackName] = (data) => {
        cleanup();
        resolve({
          data,
          status: 200,
          statusText: 'OK'
        });
      };

      // 错误处理
      script.onerror = () => {
        cleanup();
        reject(new Error('脚本加载失败'));
      };

      // console.log('JSONP请求URL:', fullUrl);
      script.src = fullUrl;
      document.head.appendChild(script);
    });
  }

  // 逆地理编码 - 将经纬度转换为地址
  async reverseGeocode(longitude, latitude) {
    const params = {
      location: `${longitude},${latitude}`,
      radius: 1000,
      extensions: 'base'
    };

    return this.jsonpRequest(`${this.baseURL}/geocode/regeo`, params);
  }

  // IP定位 - 根据IP获取位置信息
  async getLocationByIP() {
    return this.jsonpRequest(`${this.baseURL}/ip`, {});
  }
}

// 创建实例
const amapApi = new AmapApiService();

export default amapApi;