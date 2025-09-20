# 测试数据插入工具使用说明

## 概述
`insert_test_data.py` 是一个用于快速插入用户测试数据的Python脚本，支持多种数据源和插入方式。

## 使用方法

### 1. 基本使用（插入默认20个用户）
```bash
cd server
python insert_test_data.py
```

### 2. 插入自定义JSON数据
```bash
# 插入单个用户
python insert_test_data.py --data '{"username":"testuser","age":25}'

# 插入多个用户
python insert_test_data.py --data '[{"username":"user1","age":25},{"username":"user2","age":30}]'
```

### 3. 从JSON文件插入
```bash
# 使用示例文件
python insert_test_data.py --file sample_users.json

# 使用自定义文件
python insert_test_data.py --file /path/to/your/users.json
```

### 4. 清空现有数据后插入
```bash
# 清空现有数据，然后插入默认用户
python insert_test_data.py --clear

# 清空现有数据，然后插入自定义数据
python insert_test_data.py --clear --data '[{"username":"newuser","age":25}]'
```

## 数据格式要求

### JSON格式
```json
[
  {
    "username": "用户名",
    "age": 年龄
  }
]
```

### 字段要求
- **username**: 字符串，长度3-20，只允许字母、数字和下划线
- **age**: 整数，范围0-120

## 默认测试数据
脚本内置了20个用户的测试数据：
- alice_chen (25岁)
- bob_wang (30岁)
- charlie_li (22岁)
- ... 等等

## 示例文件
- `sample_users.json`: 包含5个示例用户的JSON文件，可以作为格式参考

## 注意事项
1. 用户名必须唯一，重复的用户名会被跳过
2. 脚本会自动验证数据格式，不符合要求的数据会被跳过
3. 插入过程中会显示详细的成功/失败信息
4. 使用 `--clear` 参数会删除所有现有用户数据，请谨慎使用

## 错误处理
- 数据格式错误：会显示具体的错误信息
- 用户名重复：会跳过并提示
- 数据库错误：会回滚事务并显示错误信息

## 示例输出
```
📋 准备插入 20 条用户数据
✅ 第1条数据插入成功: alice_chen (年龄: 25)
✅ 第2条数据插入成功: bob_wang (年龄: 30)
...
📊 插入结果统计:
✅ 成功: 20 条
❌ 失败: 0 条
📝 总计: 20 条
🗄️  数据库中当前用户总数: 20
🎉 数据插入操作完成!
```
