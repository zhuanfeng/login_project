from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

def create_app():
    """创建Flask应用"""
    app = Flask(__name__)
    
    # 配置数据库
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "..", "database.db")}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    
    # 延迟导入数据库模型，避免循环导入
    from .models import db
    db.init_app(app)
    
    # 创建数据表
    with app.app_context():
        db.create_all()
    
    # 注册路由
    from .routes import api
    app.register_blueprint(api)
    
    return app
