# 数据验证器
import re
from typing import Tuple, Optional
from .models import User, db

class UserValidator:
    """用户数据验证器"""
    
    @staticmethod
    def validate_username(username: str) -> Tuple[bool, Optional[str]]:
        """
        验证用户名
        
        Args:
            username: 用户名字符串
            
        Returns:
            (是否有效, 错误信息)
        """
        if not username:
            return False, "用户名不能为空"
        
        # 去除前后空格
        username = username.strip()
        
        # 检查长度
        if len(username) < 3:
            return False, "用户名长度不能少于3个字符"
        
        if len(username) > 20:
            return False, "用户名长度不能超过20个字符"
        
        # 检查字符格式：只允许字母、数字、下划线
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            return False, "用户名只能包含字母、数字和下划线"
        
        return True, None
    
    @staticmethod
    def validate_age(age) -> Tuple[bool, Optional[str]]:
        """
        验证年龄
        
        Args:
            age: 年龄值（可能是字符串或整数）
            
        Returns:
            (是否有效, 错误信息)
        """
        # 检查是否为空
        if age is None or age == '':
            return False, "年龄不能为空"
        
        # 尝试转换为整数
        try:
            age = int(age)
        except (ValueError, TypeError):
            return False, "年龄必须是有效的整数"
        
        # 检查年龄范围
        if age < 0:
            return False, "年龄不能小于0"
        
        if age > 120:
            return False, "年龄不能超过120岁"
        
        return True, None
    
    @staticmethod
    def check_username_exists(username: str) -> bool:
        """
        检查用户名是否已存在
        
        Args:
            username: 用户名
            
        Returns:
            True如果用户名已存在，False如果不存在
        """
        try:
            user = User.query.filter_by(username=username.strip()).first()
            return user is not None
        except Exception:
            # 数据库查询出错时，为安全起见返回True（假设已存在）
            return True
    
    @classmethod
    def validate_user_data(cls, username: str, age) -> Tuple[bool, dict]:
        """
        验证完整的用户数据
        
        Args:
            username: 用户名
            age: 年龄
            
        Returns:
            (是否有效, 错误详情字典)
        """
        errors = {}
        
        # 验证用户名
        username_valid, username_error = cls.validate_username(username)
        if not username_valid:
            errors['username'] = username_error
        else:
            # 只有用户名格式有效时才检查重复性
            if cls.check_username_exists(username):
                errors['username'] = "用户名已存在"
        
        # 验证年龄
        age_valid, age_error = cls.validate_age(age)
        if not age_valid:
            errors['age'] = age_error
        
        # 返回验证结果
        is_valid = len(errors) == 0
        return is_valid, errors
    
    @staticmethod
    def sanitize_user_data(username: str, age) -> dict:
        """
        清理和格式化用户数据
        
        Args:
            username: 原始用户名
            age: 原始年龄
            
        Returns:
            清理后的数据字典
        """
        # 清理用户名
        clean_username = username.strip() if username else ""
        
        # 清理年龄
        try:
            clean_age = int(age) if age is not None else None
        except (ValueError, TypeError):
            clean_age = None
        
        return {
            'username': clean_username,
            'age': clean_age
        }
