import React, { useState } from 'react';
import { userAPI } from '../services/api';
import './UserForm.css';

const UserForm = () => {
  // 表单状态
  const [formData, setFormData] = useState({
    username: '',
    age: ''
  });

  // 验证错误状态
  const [errors, setErrors] = useState({});
  
  // 提交状态
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 成功消息状态
  const [successMessage, setSuccessMessage] = useState('');

  // 前端实时验证函数
  const validateUsername = (username) => {
    if (!username) {
      return '用户名不能为空';
    }
    if (username.length < 3) {
      return '用户名长度不能少于3个字符';
    }
    if (username.length > 20) {
      return '用户名长度不能超过20个字符';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return '用户名只能包含字母、数字和下划线';
    }
    return '';
  };

  const validateAge = (age) => {
    if (!age) {
      return '年龄不能为空';
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum)) {
      return '年龄必须是有效的整数';
    }
    if (ageNum < 0) {
      return '年龄不能小于0';
    }
    if (ageNum > 120) {
      return '年龄不能超过120岁';
    }
    return '';
  };

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // 更新表单数据
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 清除成功消息
    if (successMessage) {
      setSuccessMessage('');
    }

    // 实时验证
    let error = '';
    if (name === 'username') {
      error = validateUsername(value);
    } else if (name === 'age') {
      error = validateAge(value);
    }

    // 更新错误状态
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // 检查表单是否有效
  const isFormValid = () => {
    const usernameError = validateUsername(formData.username);
    const ageError = validateAge(formData.age);
    
    return !usernameError && !ageError;
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 防止重复提交
    if (isSubmitting) return;

    // 最终验证
    const usernameError = validateUsername(formData.username);
    const ageError = validateAge(formData.age);
    
    if (usernameError || ageError) {
      setErrors({
        username: usernameError,
        age: ageError
      });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // 调用API创建用户
      const result = await userAPI.createUser({
        username: formData.username.trim(),
        age: parseInt(formData.age, 10)
      });

      if (result.success) {
        // 成功：清空表单并显示成功消息
        setFormData({ username: '', age: '' });
        setSuccessMessage('用户创建成功！');
        setErrors({});
      } else {
        // 失败：显示后端返回的错误信息
        const errorData = result.error || {};
        
        // 如果有详细的字段错误信息，优先显示
        if (errorData.details && Object.keys(errorData.details).length > 0) {
          setErrors(errorData.details);
        } else {
          // 否则显示通用错误消息
          setErrors({
            general: errorData.message || '创建用户失败'
          });
        }
        
        // 清除成功消息
        setSuccessMessage('');
        
        // 在控制台打印完整的后端错误信息，便于调试
        console.error('后端返回的完整错误信息:', {
          error: errorData.error,
          message: errorData.message,
          details: errorData.details,
          status: result.status
        });
      }
    } catch (error) {
      setErrors({
        general: '网络错误，请稍后重试'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="user-form-container">
      <div className="user-form-card">
        <h2>用户注册</h2>
        
        {/* 成功消息 */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {/* 通用错误消息 */}
        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="user-form">
          {/* 用户名输入框 */}
          <div className="form-group">
            <label htmlFor="username">用户名 *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={errors.username ? 'error' : ''}
              placeholder="请输入用户名"
              disabled={isSubmitting}
            />
            {errors.username && (
              <span className="field-error">{errors.username}</span>
            )}
          </div>

          {/* 年龄输入框 */}
          <div className="form-group">
            <label htmlFor="age">年龄 *</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className={errors.age ? 'error' : ''}
              placeholder="请输入年龄"
              min="0"
              max="120"
              disabled={isSubmitting}
            />
            {errors.age && (
              <span className="field-error">{errors.age}</span>
            )}
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            className="submit-button"
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? '提交中...' : '创建用户'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
