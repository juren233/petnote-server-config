# PetNote 服务器配置同步

**⚠️ 本仓库为 PetNote 官方服务器配置仓库，仅供项目维护者使用。**

通过 Cloudflare Workers 全球边缘网络分发 PetNote 官方服务器配置，App 启动时自动获取最新地址。

## 📝 更新服务器地址

### 方法 1: 通过 GitHub 网页编辑（推荐）

1. 打开 [wrangler.toml](./wrangler.toml)
2. 点击右上角 ✏️ 编辑按钮
3. 修改 `OFFICIAL_SERVER_URL` 的值
4. 点击 "Commit changes"
5. Cloudflare 自动部署（约 10-30 秒）

### 方法 2: 通过 Git 克隆

```bash
# 1. 克隆仓库
git clone https://github.com/juren233/petnote-server-config.git
cd petnote-server-config

# 2. 修改配置
vim wrangler.toml
# 编辑 OFFICIAL_SERVER_URL = "wss://新域名/ws"

# 3. 提交并推送
git add wrangler.toml
git commit -m "更新官方服务器地址"
git push

# 4. Cloudflare 自动部署
```

## ⚙️ 首次部署配置（仅管理员）

### 在 Cloudflare Dashboard 绑定 GitHub 仓库

这是推荐的部署方式，比 GitHub Actions + API Token 更安全：

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 左侧选择 "Workers & Pages"
3. 点击 "Create application" → "Pages" 标签
4. 点击 "Connect to Git"
5. 授权 GitHub 并选择 `juren233/petnote-server-config` 仓库
6. 构建配置：
   - **Framework preset**: None
   - **Build command**: (留空)
   - **Build output directory**: `/`
7. 环境变量（可选，或在部署后添加）：
   - `OFFICIAL_SERVER_URL`: `wss://petnote.juren233.top/ws`
8. 点击 "Save and Deploy"

**绑定后的优势**：
- ✅ 无需 API Token（避免泄露风险）
- ✅ 推送代码自动部署
- ✅ Cloudflare 原生集成，更稳定
- ✅ 部署日志在 Cloudflare Dashboard 查看

### Workers 名称建议

建议命名为：`petnote-config` 或 `petnote-server-config`

## 🔍 监控和调试

### 查看部署状态

- **Cloudflare Dashboard**: Workers & Pages → petnote-config → Deployments
- **部署日志**: 点击具体部署查看详细日志

### 测试端点（仅内部测试）

```bash
# 获取当前配置
curl https://你的worker域名.workers.dev/server

# 预期返回
{
  "server_url": "wss://petnote.juren233.top/ws",
  "updated_at": "2026-06-12T12:00:00.000Z",
  "version": "1.0.0"
}
```

### 常见问题

**Q: 推送后没有自动部署**

A: 检查 Cloudflare Dashboard → Workers & Pages → 你的项目 → Settings → Builds & deployments，确认 GitHub 集成状态正常

**Q: 配置更新后 App 没有生效**

A: 
1. 确认 Cloudflare 部署成功（查看 Deployments 页面）
2. 等待 1-5 分钟 CDN 缓存刷新
3. 重启 App（配置在启动时加载）

**Q: 如何回滚到之前的配置**

A:
```bash
# 方法 1: Git 回滚
git log --oneline
git revert <commit-hash>
git push

# 方法 2: Cloudflare Dashboard 回滚
# Deployments → 选择历史版本 → Rollback to this deployment
```

## 🔒 安全提示

- ❌ **不要在公开文档中泄露完整的 Workers URL**
- ❌ **不要在 README 中包含服务器真实 IP 地址**
- ❌ **不要提交包含敏感配置的文件到公开仓库**
- ✅ 仅维护者可访问本仓库
- ✅ Workers URL 仅在 App 代码中硬编码
- ✅ 服务器地址变更通过 Cloudflare 配置，不暴露基础设施细节

## 💰 成本说明

Cloudflare Workers 免费版配额：
- 每天 100,000 次请求
- 100 个 Workers 脚本
- 无限带宽

**当前预估使用量**：< 1,000 次/天（完全在免费额度内）

## 📄 许可证

本配置仓库与 PetNote 项目使用相同的许可证。
