这是一个用户登录程序，以下是如何配置环境：

1.配置python的环境：pip install -r server/requirements.txt

2.配置react等的环境：

    1).下载node.js（官网https://nodejs.org/），并将其添加到path

    1).npm install

3.启动前后端

    1).启动后端：直接在pycharm中启动run.py或者命令行中python3 run.py

    2).启动前端：npm start

4.启动与初始化数据库

    本项目由sqlite实现数据库功能，无需额外的初始化步骤

5.本地测试方法

    1).批量插入user：可使用insert_test_data.py批量插入用户数据，具体可以参见TEST_DATA_README.md

    2).使用 curl 命令测试 API（确保后端服务已启动在 http://localhost:5000）：

    # 创建用户
    curl -X POST http://localhost:5000/api/users
    -H "Content-Type: application/json"
    -d '{"username": "testuser", "age": 25}'

    # 创建用户（测试验证失败）
    curl -X POST http://localhost:5000/api/users
    -H "Content-Type: application/json"
    -d '{"username": "ab", "age": 150}'

    # 创建用户（测试重复用户名）
    curl -X POST http://localhost:5000/api/users
    -H "Content-Type: application/json"
    -d '{"username": "testuser", "age": 30}'

    # 获取用户列表
    curl -X GET http://localhost:5000/api/users

    # 获取用户列表（带分页）
    curl -X GET "http://localhost:5000/api/users?limit=5&offset=0"

    # 搜索用户（按用户名关键字）
    curl -X GET "http://localhost:5000/api/users?keyword=test"

    # 获取单个用户（假设ID为1）
    curl -X GET http://localhost:5000/api/users/1

    # 获取不存在的用户（测试404）
    curl -X GET http://localhost:5000/api/users/999

    3).使用 Postman 测试 API：

    下载安装：https://www.postman.com/downloads/

    测试用例配置：

    ① 创建用户 (POST)
    URL: http://localhost:5000/api/users
    Method: POST
    Headers: Content-Type: application/json
    Body (raw JSON):
    {
        "username": "testuser123",
        "age": 25
    }

    ② 获取用户列表 (GET)
    URL: http://localhost:5000/api/users
    Method: GET

    ③ 获取用户列表(带分页)
    URL: http://localhost:5000/api/users?limit=5&offset=0
    Method: GET

    ④ 搜索用户
    URL: http://localhost:5000/api/users?keyword=test
    Method: GET

    ⑤ 获取单个用户
    URL: http://localhost:5000/api/users/1
    Method: GET

    ⑥ 测试验证错误
    URL: http://localhost:5000/api/users
    Method: POST
    Headers: Content-Type: application/json
    Body (raw JSON):
    {
        "username": "ab",
        "age": 150
    }
