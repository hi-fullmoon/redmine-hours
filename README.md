# Redmine Working Hours

### 简介

Redmine Working Hours 是一个用于批量提交 Redmine 工时的命令行工具。通过读取配置文件和模板文件，自动将工时记录推送到 Redmine 服务器。

### 安装

```bash
npm install -g redmine-working-hours
```

### 使用方法

1. 配置文件：创建 `.redmine-wh.config.json` 文件，内容如下：
   ```json
   {
     "API_URL": "https://your-redmine-url.com",
     "API_KEY": "your-api-key"
   }
   ```
2. 模板文件：创建 `template.txt` 文件，内容如下：

   ```
   #issue_id
   date hours comments
   ```

   示例：

   ```
   #146174
   2024-07-01 8 知识卡片功能开发
   2024-07-02 8 知识卡片功能开发
   2024-07-03 8 知识卡片功能开发

   #146175
   2024-07-04 8 单点登录功能开发
   2024-07-05 8 单点登录功能开发
   ```

3. 运行命令：
   ```bash
   redmine-wh
   ```

### 配置选项

- `-c, --config <path>`: 指定配置文件路径
- `-t, --template <path>`: 指定模板文件路径

### 示例

假设配置文件路径为 `.redmine-wh.config.json`，模板文件路径为 `template.txt`，运行以下命令：

```bash
redmine-wh -c .redmine-wh.config.json -t template.txt
```

### 注意事项

- 确保配置文件和模板文件路径正确
- 确保 API 密钥和 URL 正确
- 确保模板文件格式正确
