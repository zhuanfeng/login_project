from app import create_app
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 创建应用实例
app = create_app()

if __name__ == '__main__':
    print("starting flask server...")
    print("database will be saved in: server/database.db")
    app.run(debug=True, host='127.0.0.1', port=5000)
