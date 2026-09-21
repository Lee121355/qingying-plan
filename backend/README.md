# DeepSeek V4.1 Flash 安全代理

前端不会保存 DeepSeek API 密钥。代理部署到 Cloudflare Workers 后，网站只调用 Worker 地址。

1. 安装并登录 Wrangler：`npm install -g wrangler`、`wrangler login`。
2. 将 `wrangler.toml.example` 复制为 `wrangler.toml`。
3. 在 `backend` 目录执行 `wrangler secret put DEEPSEEK_API_KEY`，按提示输入密钥。
4. 执行 `wrangler deploy`，取得 Worker 的 HTTPS 地址。
5. 将该地址写入网站根目录 `ai-config.json` 的 `endpoint` 字段后重新部署 GitHub Pages。

Worker 仅允许 `https://lee121355.github.io`、本机 `localhost` 与 `127.0.0.1` 发起请求。生产密钥只存在于 Cloudflare 的加密机密存储中。

默认模型为 DeepSeek V4.1 Flash，其官方 API 标识是 `deepseek-flash`。如需临时切换模型，可在 Worker 中设置 `DEEPSEEK_MODEL` 环境变量；不要把 API 密钥写入前端文件。
