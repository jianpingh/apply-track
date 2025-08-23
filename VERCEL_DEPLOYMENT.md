# Vercel Deployment Guide - 完整部署指南

## 🚀 快速部署步骤

### 1. 准备工作
确保你的项目已推送到 GitHub：
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. 部署到 Vercel

#### 方法一：通过 Vercel 网站部署（推荐）
1. 访问 [vercel.com](https://vercel.com)
2. 用 GitHub 账号登录
3. 点击 "New Project"
4. 选择你的 `apply-track` 仓库
5. 点击 "Import"
6. 在 "Configure Project" 页面，Vercel 会自动检测到 Next.js 项目
7. 点击 "Deploy" 开始部署

#### 方法二：通过 Vercel CLI 部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel

# 生产部署
vercel --prod
```

### 3. 配置环境变量

部署完成后，需要在 Vercel Dashboard 中配置环境变量：

1. 进入你的项目 Dashboard
2. 点击 "Settings" 标签
3. 点击左侧 "Environment Variables"
4. 添加以下环境变量（使用 `.env.vercel` 文件中的值）：

```env
NEXT_PUBLIC_SUPABASE_URL=https://jgepefxchovheioqukba.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnZXBlZnhjaG92aGVpb3F1a2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTEzNDksImV4cCI6MjA3MTQyNzM0OX0.Rj-FwlbZyF2mMuu-Ijvd8lvAvkcMyCjnl8bdsalQk3U
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnZXBlZnhjaG92aGVpb3F1a2JhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTg1MTM0OSwiZXhwIjoyMDcxNDI3MzQ5fQ.5z8B0h1vdZD7pahGhrpr1Q6B6nkORVgBs_Ta-gE5fRg
DATABASE_URL=postgresql://postgres:1qaz@WSX!123@db.jgepefxchovheioqukba.supabase.co:5432/postgres
NEXTAUTH_SECRET=super_secure_production_secret_key_minimum_32_characters_long_random_string_for_vercel_deployment
NODE_ENV=production
```

⚠️ **重要**：部署完成后，将 `NEXTAUTH_URL` 更新为你的实际 Vercel 域名：
```env
NEXTAUTH_URL=https://your-actual-app-name.vercel.app
```

### 4. 更新 Supabase 配置

1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. 进入 "Settings" > "API"
4. 在 "URL Configuration" 中添加你的 Vercel 域名到 "Site URL"：
   ```
   https://your-app-name.vercel.app
   ```
5. 在 "Auth" > "URL Configuration" 中添加重定向 URL：
   ```
   https://your-app-name.vercel.app/auth/callback
   ```

### 5. 重新部署

配置完环境变量后，触发重新部署：
1. 在 Vercel Dashboard 中点击 "Deployments" 标签
2. 点击最新部署右侧的三点菜单
3. 选择 "Redeploy"

## 🔧 部署后验证

### 验证清单
- [ ] 网站可以正常访问
- [ ] 用户注册功能正常
- [ ] 用户登录功能正常
- [ ] Dashboard 可以正常显示
- [ ] 数据库连接正常
- [ ] API 接口工作正常

### 测试命令
```bash
# 测试 API 接口
curl https://your-app-name.vercel.app/api/test/database

# 测试用户注册
curl -X POST https://your-app-name.vercel.app/api/test/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpassword"}'
```

## 🔄 自动部署设置

Vercel 会自动监听你的 GitHub 仓库变化：
- 推送到 `main` 分支 = 生产部署
- 推送到其他分支 = 预览部署

## 📊 监控和调试

### 查看部署日志
1. 进入 Vercel Dashboard
2. 点击 "Functions" 标签查看 API 日志
3. 点击 "Deployments" 查看构建日志

### 常见问题解决
1. **构建失败**：检查 `package.json` 依赖
2. **环境变量错误**：确保所有必需变量已配置
3. **数据库连接失败**：验证 `DATABASE_URL` 正确性
4. **认证问题**：检查 Supabase URL 配置

## 🛡️ 安全建议

1. **定期轮换密钥**：定期更新 `NEXTAUTH_SECRET` 和数据库密码
2. **监控访问**：启用 Vercel Analytics
3. **备份数据**：定期备份 Supabase 数据
4. **更新依赖**：定期更新 npm 包

## 📱 自定义域名（可选）

1. 在 Vercel Dashboard 中进入 "Settings" > "Domains"
2. 添加你的自定义域名
3. 按照指示配置 DNS 记录
4. 更新环境变量中的 `NEXTAUTH_URL`

## 🚨 紧急回滚

如果部署出现问题：
1. 进入 "Deployments" 标签
2. 找到之前稳定的部署版本
3. 点击 "Promote to Production"

---

## 一键部署命令

如果你想使用命令行快速部署：

```bash
# 克隆并部署
git clone https://github.com/yourusername/apply-track.git
cd apply-track
npm install
vercel
```

## 需要帮助？

如果遇到问题，请检查：
1. [Vercel 文档](https://vercel.com/docs)
2. [Next.js 部署指南](https://nextjs.org/docs/deployment)
3. [Supabase 生产环境配置](https://supabase.com/docs/guides/platform/going-into-prod)

部署成功后，你的大学申请追踪系统就可以在 `https://your-app-name.vercel.app` 访问了！🎉
