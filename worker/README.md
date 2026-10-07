# 轻盈计划 AI 助手（Cloudflare Workers AI）

前端是纯静态页面，AI 请求通过 Cloudflare Worker 代理。Workers AI 使用账户自带的免费额度，不需要额外付费 API 密钥。

## 文件说明

- `ai-config.js`：前端 Worker 地址配置。
- `ai-assistant.js`：悬浮聊天面板、流式输出、Markdown、代码复制和历史记录。
- `ai-assistant.css`：桌面与移动端样式。
- `worker/src/index.js`：`POST /api/chat`、CORS、限流和模型回退。
- `worker/wrangler.toml`：Workers AI 与 KV 绑定配置。

## 部署 Worker

```bash
cd worker
npm install
npx wrangler login
npx wrangler kv namespace create RATE_LIMIT_KV
```

把命令返回的 `id` 写入 `worker/wrangler.toml` 的 `[[kv_namespaces]]` 配置，然后部署：

```bash
npx wrangler deploy
```

部署成功后，Wrangler 会输出类似 `https://qingying-plan-ai.<account>.workers.dev` 的地址。

## 配置前端地址

打开根目录的 `ai-config.js`，把占位地址替换为实际 Worker 地址：

```js
window.AI_ASSISTANT_CONFIG = {
  apiBase: 'https://qingying-plan-ai.<account>.workers.dev',
  defaultModel: '@cf/meta/llama-3.1-8b-instruct',
  fallbackModel: '@cf/mistral/mistral-7b-instruct-v0.1'
};
```

`apiBase` 不要以 `/api/chat` 结尾，前端会自动拼接接口路径。

## 本地测试

启动任意静态文件服务器，然后打开 `login.html` 或登录后的页面：

```bash
npx serve .
```

Worker 本地调试：

```bash
cd worker
npx wrangler dev
```

在另一个终端测试流式接口：

```bash
curl -N -X POST http://127.0.0.1:8787/api/chat \
  -H 'Origin: http://localhost:3000' \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"你好"}],"model":"@cf/meta/llama-3.1-8b-instruct","stream":true}'
```

## 重新部署 GitHub Pages

把 `ai-config.js` 的占位地址替换成真实 Worker 地址后，在仓库根目录执行：

```bash
git add ai-config.js ai-assistant.js ai-assistant.css app.js sw.js worker
git commit -m "Switch AI assistant to Cloudflare Workers AI"
git push origin main
```

等待 GitHub Pages 发布完成。由于本项目使用 Service Worker，已有页面首次更新时需要刷新或重新打开一次。

## 线上验收

1. 打开 `https://lee121355.github.io/qingying-plan/login.html` 并登录。
2. 确认右下角出现 AI 悬浮按钮，移动端不会遮住底部导航。
3. 发送消息，确认回复逐段流式显示。
4. 连续追问，确认模型记得上文。
5. 让模型输出 Markdown 和代码块，确认高亮及“复制”按钮可用。
6. 刷新页面，确认历史记录保留；点击清空后确认记录消失。
7. 生成过程中点击停止，确认可以中断。
8. 检查浏览器 Network，请求只发送到 Worker 的 `/api/chat`，没有 DeepSeek 请求。
9. 仓库中搜索付费 API 域名与密钥变量，应无结果。

## 免费额度与限制

- 默认模型：`@cf/meta/llama-3.1-8b-instruct`
- 备用模型：`@cf/mistral/mistral-7b-instruct-v0.1`
- 单条消息最多 4000 字符，最多 20 条消息，最大输出 1024 token。
- 每个 IP 每分钟最多 10 次，每天最多 100 次。
- KV 未绑定时会自动使用内存限流，并在 Worker 日志中输出警告；生产环境建议绑定 KV。
- 免费额度或模型暂时不可用时，前端会显示友好错误提示，不会调用付费接口。
