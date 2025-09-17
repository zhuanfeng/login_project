from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    # 主键，自增整型
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # 用户名：字符串，唯一，长度3-20
    username = db.Column(db.String(20), unique=True, nullable=False)
    
    # 年龄：整型，不为空
    age = db.Column(db.Integer, nullable=False)
    
    # 创建时间：时间戳，自动生成UTC时间
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def to_dict(self):
        """将模型转换为字典格式，便于JSON序列化"""
        return {
            'id': self.id,
            'username': self.username,
            'age': self.age,
            'created_at': self.created_at.isoformat() + 'Z'  # ISO格式的UTC时间
        }
