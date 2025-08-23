# 环境配置说明

## 环境文件优先级和用途

### 🏠 开发环境 (Development)
- **默认文件**: `.env.local`
- **用途**: 本地开发时使用
- **特点**: 包含开发用的数据库、调试设置等
- **端口**: 3001 (避免与其他服务冲突)

### 🏭 生产环境 (Production)  
- **默认文件**: `.env.production`
- **用途**: 生产部署时使用
- **特点**: 包含生产数据库、安全设置、性能优化等
- **端口**: 3000

### 📁 文件说明

| 文件名 | 用途 | 是否提交到Git |
|--------|------|---------------|
| `.env.example` | 模板文件，展示所有需要的变量 | ✅ 是 |
| `.env.local` | 本地开发配置 | ❌ 否 |
| `.env.development` | 开发环境配置 | ❌ 否 |
| `.env.production` | 生产环境配置 | ❌ 否 |
| `.env.production.local` | 生产环境本地覆盖 | ❌ 否 |

### 🔄 加载顺序

**开发模式** (`NODE_ENV=development`):
1. `.env` (基础)
2. `.env.local` (本地覆盖) ⭐ **主要使用**
3. `.env.development` (开发环境)
4. `.env.development.local` (开发环境本地覆盖)

**生产模式** (`NODE_ENV=production`):
1. `.env` (基础)
2. `.env.local` (本地覆盖)
3. `.env.production` (生产环境) ⭐ **主要使用**
4. `.env.production.local` (生产环境本地覆盖)

### 🚀 快速开始

```bash
# 1. 复制模板文件
cp .env.example .env.local

# 2. 编辑本地配置
# 在 .env.local 中填入你的 Supabase 配置

# 3. 启动开发服务器
npm run dev
```

### 🔒 安全注意事项

- 永远不要提交包含真实密钥的 `.env.*` 文件
- 生产环境和开发环境使用不同的 Supabase 项目
- `NEXTAUTH_SECRET` 在生产环境中必须是随机生成的强密钥
- 定期轮换生产环境的密钥
