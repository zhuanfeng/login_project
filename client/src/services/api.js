import axios from 'axios';

// 配置axios实例
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 用户相关API
export const userAPI = {
  // 创建用户
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response) {
        // 服务器返回错误响应
        return { 
          success: false, 
          error: error.response.data,
          status: error.response.status 
        };
      } else if (error.request) {
        // 网络错误
        return { 
          success: false, 
          error: { 
            error: 'network_error', 
            message: '网络连接失败，请检查后端服务是否启动',
            details: {}
          } 
        };
      } else {
        // 其他错误
        return { 
          success: false, 
          error: { 
            error: 'unknown_error', 
            message: error.message || '未知错误',
            details: {}
          } 
        };
      }
    }
  }
};

export default api;
