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
      console.error('创建用户API错误:', error);
      
      if (error.response) {
        // 服务器返回错误响应
        console.error('后端返回错误:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        return { 
          success: false, 
          error: error.response.data,
          status: error.response.status 
        };
      } else if (error.request) {
        // 网络错误
        console.error('网络请求错误:', error.request);
        return { 
          success: false, 
          error: { 
            error: 'NETWORK_ERROR', 
            message: '网络连接失败，请检查后端服务是否启动',
            details: { request: error.request }
          } 
        };
      } else {
        // 其他错误
        console.error('请求配置错误:', error.message);
        return { 
          success: false, 
          error: { 
            error: 'REQUEST_CONFIG_ERROR', 
            message: error.message || '请求配置错误',
            details: { originalError: error.toString() }
          } 
        };
      }
    }
  },

  // 获取用户列表
  getUserList: async (params = {}) => {
    try {
      const response = await api.get('/users', { params });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('获取用户列表API错误:', error);
      
      if (error.response) {
        // 服务器返回错误响应
        console.error('后端返回错误:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        return { 
          success: false, 
          error: error.response.data,
          status: error.response.status 
        };
      } else if (error.request) {
        // 网络错误
        console.error('网络请求错误:', error.request);
        return { 
          success: false, 
          error: { 
            error: 'NETWORK_ERROR', 
            message: '网络连接失败，请检查后端服务是否启动',
            details: { request: error.request }
          } 
        };
      } else {
        // 其他错误
        console.error('请求配置错误:', error.message);
        return { 
          success: false, 
          error: { 
            error: 'REQUEST_CONFIG_ERROR', 
            message: error.message || '请求配置错误',
            details: { originalError: error.toString() }
          } 
        };
      }
    }
  }
};

export default api;
