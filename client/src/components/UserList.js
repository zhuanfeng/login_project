import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { userAPI } from '../services/api';
import './UserList.css';

const UserList = () => {
  // 用户列表状态
  const [users, setUsers] = useState([]);
  
  // 加载状态
  const [loading, setLoading] = useState(true);
  
  // 错误状态
  const [error, setError] = useState('');
  
  // 搜索关键字状态
  const [keyword, setKeyword] = useState('');

  // 格式化日期 - 使用useCallback确保函数稳定
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }, []);

  // 加载用户列表 - 使用useCallback避免重复创建
  const loadUsers = useCallback(async (searchKeyword = '') => {
    setLoading(true);
    setError('');
    
    try {
      const params = {};
      if (searchKeyword.trim()) {
        params.keyword = searchKeyword.trim();
      }
      
      const result = await userAPI.getUserList(params);
      
      if (result.success) {
        setUsers(result.data.users || []);
      } else {
        // 显示后端返回的具体错误信息
        const errorData = result.error || {};
        console.error('获取用户列表失败:', {
          error: errorData.error,
          message: errorData.message,
          details: errorData.details,
          status: result.status
        });
        
        // 优先显示后端返回的具体错误信息
        let errorMessage = '获取用户列表失败';
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = `错误类型: ${errorData.error}`;
        }
        
        setError(errorMessage);
      }
    } catch (error) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, []);

  // 组件挂载时加载用户列表
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // 搜索关键字变化时实时搜索 - 使用防抖延迟
  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers(keyword);
    }, 300); // 300ms防抖延迟

    return () => clearTimeout(timer);
  }, [keyword, loadUsers]);

  // 刷新列表 - 使用useCallback确保函数稳定
  const handleRefresh = useCallback(() => {
    setKeyword(''); // 清空搜索关键字
    loadUsers(); // 重新加载所有数据
  }, [loadUsers]);

  // 处理搜索输入 - 使用useCallback确保函数稳定
  const handleSearchChange = useCallback((e) => {
    setKeyword(e.target.value);
  }, []);

  // 清空搜索 - 使用useCallback确保函数稳定
  const handleClearSearch = useCallback(() => {
    setKeyword('');
  }, []);

  // 搜索框组件 - 使用useMemo优化渲染
  const searchBoxComponent = useMemo(() => (
    <div className="user-list-header">
      <h2>用户列表</h2>
      <div className="header-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索用户名..."
            value={keyword}
            onChange={handleSearchChange}
            className="search-input"
          />
          {keyword && (
            <button 
              onClick={handleClearSearch} 
              className="clear-search-btn"
              title="清空搜索"
            >
              ×
            </button>
          )}
        </div>
        <button onClick={handleRefresh} className="refresh-button">
          刷新
        </button>
      </div>
    </div>
  ), [keyword, handleSearchChange, handleClearSearch, handleRefresh]);

  // 列表内容组件 - 使用useMemo优化渲染
  const listContentComponent = useMemo(() => {
    if (loading) {
      return <div className="loading">加载中...</div>;
    }

    if (error) {
      return (
        <>
          <div className="error-message">{error}</div>
          <button onClick={handleRefresh} className="refresh-button">
            重新加载
          </button>
        </>
      );
    }

    if (users.length === 0) {
      return (
        <div className="empty-state">
          {keyword ? (
            <p>未找到包含 "{keyword}" 的用户</p>
          ) : (
            <p>暂无用户数据</p>
          )}
        </div>
      );
    }

    return (
      <>
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
        <div className="user-count">
          共 {users.length} 个用户
        </div>
      </>
    );
  }, [users, loading, error, keyword, handleRefresh, formatDate]);

  return (
    <div className="user-list-container">
      <div className="user-list-card">
        {searchBoxComponent}
        {listContentComponent}
      </div>
    </div>
  );
};

export default UserList;
