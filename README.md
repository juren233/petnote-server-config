# PetNote 服务器配置同步

通过 Cloudflare Workers 全球边缘网络分发 PetNote 官方服务器配置，App 启动时自动获取最新地址。

## 🌐 端点信息

- **配置端点**: `https://petnote-config.c237b2d42470636339faa8103380f0ed.workers.dev/server`
- **当前服务器**: `wss://petnote.juren233.top/ws`
- **自动部署**: GitHub Actions（推送到 main 分支自动触发）
- **全球 CDN**: Cloudflare 300+ 节点

## 📝 更新服务器地址

### 方法 1: 通过 Git（推荐）

```bash
# 1. 克隆仓库
git clone https://github.com/juren233/petnote-server-config.git
cd petnote-server-config

# 2. 修改配置
vim wrangler.toml
# 编辑 OFFICIAL_SERVER_URL = "wss://新域名/ws"

# 3. 提交并推送
git add wrangler.toml
git commit -m "更新官方服务器地址为 wss://新域名/ws"
git push

# 4. 查看部署状态
# 访问 https://github.com/juren233/petnote-server-config/actions
```

### 方法 2: 通过 GitHub 网页（最快）

1. 打开 [wrangler.toml](./wrangler.toml)
2. 点击右上角 ✏️ 编辑按钮
3. 修改 `OFFICIAL_SERVER_URL` 的值
4. 点击 "Commit changes"
5. 自动部署约 30 秒完成

## 🧪 测试端点

```bash
# 获取当前配置
curl https://petnote-config.c237b2d42470636339faa8103380f0ed.workers.dev/server

# 预期返回
{
  "server_url": "wss://petnote.juren233.top/ws",
  "updated_at": "2026-06-12T12:00:00.000Z",
  "version": "1.0.0"
}
```

## ⚙️ 首次部署配置

### 1. 获取 Cloudflare API Token

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击右上角头像 → "My Profile"
3. 左侧选择 "API Tokens"
4. 点击 "Create Token"
5. 使用模板 "Edit Cloudflare Workers"
6. 配置权限：
   - Account Resources: Include → 你的账号 → Workers Scripts:Edit
7. 点击 "Continue to summary" → "Create Token"
8. 复制生成的 Token（**只显示一次**）

### 2. 配置 GitHub Secrets

1. 打开 [仓库设置](https://github.com/juren233/petnote-server-config/settings/secrets/actions)
2. 点击 "New repository secret"
3. 添加以下两个 Secret：

   **Secret 1:**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Secret: 粘贴刚才复制的 API Token
   
   **Secret 2:**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Secret: `c237b2d42470636339faa8103380f0ed`

4. 点击 "Add secret"

### 3. 触发首次部署

```bash
# 推送任意更改触发部署
git commit --allow-empty -m "触发首次部署"
git push

# 或者在 GitHub 网页操作
# Actions 标签页 → Deploy to Cloudflare Workers → Run workflow
```

## 🔍 监控和调试

### 查看部署状态

- **GitHub Actions 日志**: [Actions 标签页](https://github.com/juren233/petnote-server-config/actions)
- **Cloudflare Workers 日志**: [Dashboard](https://dash.cloudflare.com/) → Workers & Pages → petnote-config

### 常见问题

**Q: 部署失败，提示 "Authentication error"**

A: 检查 GitHub Secrets 中的 `CLOUDFLARE_API_TOKEN` 是否正确设置

**Q: 配置更新后 App 没有生效**

A: 
1. 确认 GitHub Actions 部署成功
2. 等待 1-5 分钟 CDN 缓存刷新
3. 重启 App（配置在启动时加载）

**Q: 如何回滚到之前的配置**

A:
```bash
# 查看历史提交
git log --oneline

# 回滚到指定提交
git revert <commit-hash>
git push
```

## 💰 成本和限额

| 项目 | 免费额度 | 当前使用 |
|------|---------|---------|
| Workers 请求数 | 100,000/天 | < 1,000/天 |
| Workers 脚本数 | 100 个 | 1 个 |
| GitHub Actions | 2000 分钟/月 | < 10 分钟/月 |

**结论**: 完全在免费额度内，无需付费。

## 📦 本地开发（可选）

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 本地开发服务器
wrangler dev

# 手动部署（已配置自动部署，通常不需要）
wrangler deploy
```

## 📄 许可证

本配置仓库与 PetNote 项目使用相同的许可证。
