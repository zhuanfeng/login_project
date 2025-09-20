#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
测试数据插入脚本
用于快速向数据库插入用户测试数据

使用方法：
1. 插入默认的20个用户: python insert_test_data.py
2. 插入自定义JSON数据: python insert_test_data.py --data '[{"username":"test1","age":25},{"username":"test2","age":30}]'
3. 从JSON文件插入: python insert_test_data.py --file data.json
4. 清空现有数据再插入: python insert_test_data.py --clear
"""

import json
import sys
import argparse
import os
from datetime import datetime
from app import create_app
from app.models import db, User

# 默认的20个用户测试数据
DEFAULT_USERS = [
    {"username": "alice_chen", "age": 25},
    {"username": "bob_wang", "age": 30},
    {"username": "charlie_li", "age": 22},
    {"username": "diana_zhao", "age": 28},
    {"username": "edward_liu", "age": 35},
    {"username": "fiona_xu", "age": 24},
    {"username": "george_sun", "age": 29},
    {"username": "helen_wu", "age": 26},
    {"username": "ivan_zhang", "age": 31},
    {"username": "jenny_huang", "age": 23},
    {"username": "kevin_ma", "age": 27},
    {"username": "linda_zhou", "age": 32},
    {"username": "mike_gao", "age": 24},
    {"username": "nancy_feng", "age": 28},
    {"username": "oscar_ding", "age": 33},
    {"username": "penny_tang", "age": 25},
    {"username": "quinn_yu", "age": 29},
    {"username": "ruby_luo", "age": 26},
    {"username": "steve_han", "age": 34},
    {"username": "tina_cao", "age": 27}
]

def validate_user_data(user_data):
    """
    验证用户数据格式
    """
    if not isinstance(user_data, dict):
        return False, "用户数据必须是字典格式"
    
    if 'username' not in user_data:
        return False, "缺少username字段"
    
    if 'age' not in user_data:
        return False, "缺少age字段"
    
    username = user_data['username']
    age = user_data['age']
    
    # 验证用户名
    if not isinstance(username, str):
        return False, "username必须是字符串"
    
    if len(username) < 3 or len(username) > 20:
        return False, f"username长度必须在3-20之间，当前: {username}"
    
    if not username.replace('_', '').isalnum():
        return False, f"username只能包含字母、数字和下划线，当前: {username}"
    
    # 验证年龄
    if not isinstance(age, int):
        return False, f"age必须是整数，当前: {age}"
    
    if age < 0 or age > 120:
        return False, f"age必须在0-120之间，当前: {age}"
    
    return True, "验证通过"

def insert_users(users_data, clear_existing=False):
    """
    插入用户数据到数据库
    """
    app = create_app()
    
    with app.app_context():
        try:
            # 清空现有数据
            if clear_existing:
                print("清空现有用户数据...")
                User.query.delete()
                db.session.commit()
                print("现有数据已清空")
            
            success_count = 0
            error_count = 0
            
            for i, user_data in enumerate(users_data, 1):
                # 验证数据格式
                is_valid, message = validate_user_data(user_data)
                if not is_valid:
                    print(f"❌ 第{i}条数据验证失败: {message}")
                    print(f"   数据: {user_data}")
                    error_count += 1
                    continue
                
                # 检查用户名是否已存在
                existing_user = User.query.filter_by(username=user_data['username']).first()
                if existing_user:
                    print(f"⚠️  第{i}条数据跳过: 用户名 '{user_data['username']}' 已存在")
                    error_count += 1
                    continue
                
                # 创建用户
                try:
                    user = User(
                        username=user_data['username'],
                        age=user_data['age']
                    )
                    db.session.add(user)
                    db.session.commit()
                    
                    print(f"✅ 第{i}条数据插入成功: {user_data['username']} (年龄: {user_data['age']})")
                    success_count += 1
                    
                except Exception as e:
                    db.session.rollback()
                    print(f"❌ 第{i}条数据插入失败: {str(e)}")
                    print(f"   数据: {user_data}")
                    error_count += 1
            
            print(f"\n📊 插入结果统计:")
            print(f"✅ 成功: {success_count} 条")
            print(f"❌ 失败: {error_count} 条")
            print(f"📝 总计: {len(users_data)} 条")
            
            # 显示当前数据库中的用户总数
            total_users = User.query.count()
            print(f"🗄️  数据库中当前用户总数: {total_users}")
            
        except Exception as e:
            print(f"❌ 数据库操作失败: {str(e)}")
            return False
    
    return True

def load_json_file(file_path):
    """
    从JSON文件加载数据
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        print(f"❌ 文件未找到: {file_path}")
        return None
    except json.JSONDecodeError as e:
        print(f"❌ JSON格式错误: {str(e)}")
        return None
    except Exception as e:
        print(f"❌ 读取文件失败: {str(e)}")
        return None

def main():
    parser = argparse.ArgumentParser(description='用户测试数据插入工具')
    parser.add_argument('--data', type=str, help='JSON格式的用户数据字符串')
    parser.add_argument('--file', type=str, help='包含用户数据的JSON文件路径')
    parser.add_argument('--clear', action='store_true', help='插入前清空现有数据')
    
    args = parser.parse_args()
    
    users_data = None
    
    if args.data:
        # 从命令行参数解析JSON数据
        try:
            users_data = json.loads(args.data)
            if not isinstance(users_data, list):
                users_data = [users_data]  # 如果是单个对象，转换为列表
        except json.JSONDecodeError as e:
            print(f"❌ JSON数据格式错误: {str(e)}")
            return False
    
    elif args.file:
        # 从文件加载JSON数据
        users_data = load_json_file(args.file)
        if users_data is None:
            return False
        
        if not isinstance(users_data, list):
            users_data = [users_data]  # 如果是单个对象，转换为列表
    
    else:
        # 使用默认的20个用户数据
        print("🎯 使用默认的20个用户测试数据")
        users_data = DEFAULT_USERS
    
    print(f"📋 准备插入 {len(users_data)} 条用户数据")
    
    if args.clear:
        response = input("⚠️  确认要清空现有数据吗？(y/N): ")
        if response.lower() != 'y':
            print("❌ 操作已取消")
            return False
    
    # 插入数据
    success = insert_users(users_data, clear_existing=args.clear)
    
    if success:
        print("\n🎉 数据插入操作完成!")
    else:
        print("\n💥 数据插入操作失败!")
        return False
    
    return True

if __name__ == '__main__':
    # 确保在正确的目录中运行
    current_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(current_dir)
    
    success = main()
    sys.exit(0 if success else 1)
