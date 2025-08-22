# Apply Track - 大学申请追踪系统

一个现代化的大学申请管理平台，帮助学生和家长追踪申请进度、管理截止日期，优化申请流程。

## 🚀 功能特点

### 🎓 学生功能
- **申请管理**: 添加、编辑和追踪大学申请
- **截止日期提醒**: 智能提醒即将到期的申请
- **进度追踪**: 可视化显示申请完成状态
- **大学搜索**: 根据多种条件筛选适合的大学
- **材料清单**: 管理文书、推荐信、成绩单等申请材料

### 👨‍👩‍👧‍👦 家长功能
- **监控仪表板**: 查看孩子的申请状态
- **费用规划**: 计算和规划大学费用
- **备注系统**: 添加备注和沟通记录
- **进度报告**: 了解申请整体进展

### 🏫 大学数据库
- **全面信息**: 排名、录取率、学费、专业等
- **智能筛选**: 多维度筛选目标院校
- **申请系统**: 支持 Common App、UC 系统等
- **截止日期**: 自动同步各校申请截止时间

## 🛠️ 技术栈

- **前端**: Next.js 14, React 18, TypeScript
- **样式**: Tailwind CSS, Shadcn/UI
- **后端**: Next.js API Routes
- **数据库**: PostgreSQL (Supabase)
- **认证**: Supabase Auth
- **部署**: Vercel

## 📦 快速开始

### 前置要求
- Node.js 18+
- npm 或 yarn
- Supabase 账户

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/yourusername/apply-track.git
   cd apply-track
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   yarn install
   ```

3. **环境配置**
   ```bash
   cp .env.example .env.local
   ```
   
   在 `.env.local` 中填入您的配置：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **数据库设置**
   
   在 Supabase 中执行以下 SQL 文件：
   - `supabase/migrations/20241201000000_initial_schema.sql`
   - `supabase/seed.sql` (可选，用于测试数据)

5. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

6. **访问应用**
   
   打开 [http://localhost:3000](http://localhost:3000)

## 🏗️ 项目结构

```
apply-track/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API 路由
│   │   ├── auth/           # 认证页面
│   │   ├── dashboard/      # 仪表板页面
│   │   └── universities/   # 大学搜索页面
│   ├── components/         # React 组件
│   │   └── ui/            # UI 组件库
│   ├── lib/               # 工具函数
│   └── types/             # TypeScript 类型定义
├── supabase/
│   ├── migrations/        # 数据库迁移文件
│   └── seed.sql          # 示例数据
└── public/               # 静态资源
```

## 📊 数据库设计

### 核心表结构

- **profiles**: 用户基本信息
- **students**: 学生学术信息
- **parents**: 家长信息
- **universities**: 大学信息
- **applications**: 申请记录
- **application_requirements**: 申请材料清单
- **parent_notes**: 家长备注
- **activity_log**: 操作日志

## 🔒 权限管理

### 行级安全策略 (RLS)
- 学生只能访问自己的申请数据
- 家长只能查看关联学生的信息
- 所有敏感操作都有权限验证

### 角色设计
- **Student**: 管理自己的申请
- **Parent**: 监控关联学生的申请
- **Teacher**: 指导多个学生 (未来功能)
- **Admin**: 系统管理 (未来功能)

## 🚀 部署

### Vercel 部署

1. **连接 GitHub**
   - 在 Vercel 中导入项目
   - 连接您的 GitHub 仓库

2. **环境变量**
   在 Vercel 项目设置中添加：
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

3. **自动部署**
   推送到 main 分支即可触发自动部署

### 其他平台

- **Railway**: 支持 PostgreSQL 数据库
- **Netlify**: 适合静态部署
- **Render**: 全栈应用部署

## 🧪 测试

```bash
# 运行测试
npm test

# 运行 E2E 测试
npm run test:e2e

# 代码检查
npm run lint
```

## 📈 性能优化

- **代码分割**: 使用动态导入
- **图片优化**: Next.js Image 组件
- **缓存策略**: API 路由缓存
- **数据库优化**: 索引和查询优化

## 🔧 开发工具

- **ESLint**: 代码规范检查
- **Prettier**: 代码格式化
- **TypeScript**: 类型安全
- **Tailwind CSS**: 样式管理

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 支持

如有问题或建议，请：

- 创建 [Issue](https://github.com/yourusername/apply-track/issues)
- 发送邮件至: support@applytrack.com
- 查看 [文档](https://docs.applytrack.com)

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Supabase](https://supabase.com/) - 后端即服务
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Shadcn/UI](https://ui.shadcn.com/) - UI 组件库

---

**Apply Track** - 让大学申请管理变得简单高效 🎓
