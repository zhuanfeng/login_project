# API路由定义
from flask import Blueprint, request, jsonify
from .models import db, User
from .validators import UserValidator

# 创建蓝图
api = Blueprint('api', __name__, url_prefix='/api')

@api.route('/users', methods=['POST'])
def create_user():
    """
    创建用户 API
    POST /api/users
    """
    try:
        # 获取请求数据
        data = request.get_json()
        if not data:
            return jsonify({
                "error": "validation_error",
                "message": "请求数据不能为空",
                "details": {}
            }), 400
        
        username = data.get('username')
        age = data.get('age')
        
        # 清理数据
        cleaned_data = UserValidator.sanitize_user_data(username, age)
        
        # 验证数据
        is_valid, errors = UserValidator.validate_user_data(
            cleaned_data['username'], 
            cleaned_data['age']
        )
        
        if not is_valid:
            return jsonify({
                "error": "validation_error",
                "message": "数据验证失败",
                "details": errors
            }), 400
        
        # 创建用户
        try:
            new_user = User(
                username=cleaned_data['username'],
                age=cleaned_data['age']
            )
            db.session.add(new_user)
            db.session.commit()
            
            return jsonify({
                "message": "用户创建成功",
                "user": new_user.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            # 检查是否是唯一约束冲突
            if "UNIQUE constraint failed" in str(e):
                return jsonify({
                    "error": "conflict",
                    "message": "用户名已存在",
                    "details": {"username": "该用户名已被使用"}
                }), 409
            else:
                return jsonify({
                    "error": "database_error",
                    "message": "数据库操作失败",
                    "details": {}
                }), 500
    
    except Exception as e:
        return jsonify({
            "error": "server_error",
            "message": "服务器内部错误",
            "details": {}
        }), 500

@api.route('/users', methods=['GET'])
def get_users():
    """
    获取用户列表 API
    GET /api/users?keyword=...&limit=...&offset=...
    """
    try:
        # 获取查询参数
        keyword = request.args.get('keyword', '').strip()
        limit = request.args.get('limit', 10, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        # 限制分页参数
        limit = min(max(1, limit), 100)  # 限制在1-100之间
        offset = max(0, offset)  # 不能小于0
        
        # 构建查询
        query = User.query
        
        # 关键字搜索
        if keyword:
            query = query.filter(User.username.contains(keyword))
        
        # 分页查询
        users = query.offset(offset).limit(limit).all()
        
        # 获取总数（用于分页信息）
        total = query.count()
        
        # 转换为字典格式
        users_data = [user.to_dict() for user in users]
        
        return jsonify({
            "users": users_data,
            "pagination": {
                "total": total,
                "limit": limit,
                "offset": offset,
                "has_next": offset + limit < total,
                "has_prev": offset > 0
            }
        }), 200
    
    except Exception as e:
        return jsonify({
            "error": "server_error",
            "message": "服务器内部错误",
            "details": {}
        }), 500

@api.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """
    获取单个用户 API
    GET /api/users/<id>
    """
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({
                "error": "not_found",
                "message": "用户不存在",
                "details": {"user_id": user_id}
            }), 404
        
        return jsonify({
            "user": user.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({
            "error": "server_error",
            "message": "服务器内部错误",
            "details": {}
        }), 500

# 错误处理器
@api.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "not_found",
        "message": "请求的资源不存在",
        "details": {}
    }), 404

@api.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        "error": "method_not_allowed",
        "message": "不支持的请求方法",
        "details": {}
    }), 405
