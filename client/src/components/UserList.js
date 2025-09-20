import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import './UserList.css';

const UserList = () => {
  // 用户列表状态
  const [users, setUsers] = useState([]);
  
  // 加载状态
  const [loading, setLoading] = useState(true);
  
  // 错误状态
  const [error, setError] = useState('');

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // 加载用户列表
  const loadUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await userAPI.getUserList();
      
      if (result.success) {
        setUsers(result.data.users || []);
      } else {
        setError(result.error?.message || '获取用户列表失败');
      }
    } catch (error) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时加载用户列表
  useEffect(() => {
    loadUsers();
  }, []);

  // 刷新列表
  const handleRefresh = () => {
    loadUsers();
  };

  if (loading) {
    return (
      <div className="user-list-container">
        <div className="user-list-card">
          <h2>用户列表</h2>
          <div className="loading">加载中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list-container">
        <div className="user-list-card">
          <h2>用户列表</h2>
          <div className="error-message">{error}</div>
          <button onClick={handleRefresh} className="refresh-button">
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <div className="user-list-card">
        <div className="user-list-header">
          <h2>用户列表</h2>
          <button onClick={handleRefresh} className="refresh-button">
            刷新
          </button>
        </div>
        
        {users.length === 0 ? (
          <div className="empty-state">
            <p>暂无用户数据</p>
          </div>
        ) : (
          <div className="user-table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>用户名</th>
                  <th>年龄</th>
                  <th>创建时间</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td className="username">{user.username}</td>
                    <td>{user.age}</td>
                    <td className="created-time">{formatDate(user.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="user-count">
          共 {users.length} 个用户
        </div>
      </div>
    </div>
  );
};

export default UserList;
