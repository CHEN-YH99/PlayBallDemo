# PlayBall Vercel 部署教程

## 🚀 Vercel 部署指南

Vercel是最适合Vue项目的部署平台，零配置、自动HTTPS、全球CDN，完美支持你的PlayBall应用！

## 📋 部署前准备

### 1. 确认项目状态
- ✅ 项目已完成构建 (`npm run build`)
- ✅ `dist` 目录存在且包含所有文件
- ✅ 代码已推送到GitHub仓库

### 2. 项目结构检查
```
PlayBall/
├── dist/                 # 构建输出目录
│   ├── assets/          # 静态资源
│   ├── index.html       # 入口文件
│   └── data.json        # 数据文件
├── src/                 # 源代码
├── package.json         # 项目配置
└── vite.config.js       # 构建配置
```

## 🌐 方法一：Web界面部署（推荐新手）

### 步骤1：访问Vercel
1. 打开 [vercel.com](https://vercel.com)
2. 点击 **"Start Deploying"** 或 **"Sign Up"**

### 步骤2：账号注册/登录
1. 选择 **"Continue with GitHub"**
2. 授权Vercel访问你的GitHub账号
3. 完成账号设置

### 步骤3：导入项目
1. 在Vercel仪表板点击 **"New Project"**
2. 选择 **"Import Git Repository"**
3. 找到你的PlayBall项目仓库
4. 点击 **"Import"**

### 步骤4：配置项目设置
```
Project Name: playball (或你喜欢的名称)
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 步骤5：环境变量（可选）
如果需要设置环境变量：
```
VITE_APP_TITLE=PlayBall
VITE_API_BASE_URL=https://api.your-domain.com
```

### 步骤6：部署
1. 点击 **"Deploy"**
2. 等待构建完成（通常1-3分钟）
3. 部署成功后会显示预览链接

## 💻 方法二：CLI部署（推荐开发者）

### 步骤1：安装Vercel CLI
```bash
# 全局安装Vercel CLI
npm install -g vercel

# 或使用yarn
yarn global add vercel
```

### 步骤2：登录Vercel
```bash
# 登录到Vercel账号
vercel login

# 按提示选择登录方式（推荐GitHub）
```

### 步骤3：初始化项目
```bash
# 在项目根目录运行
vercel

# 首次运行会询问配置：
# ? Set up and deploy "~/PlayBall"? [Y/n] y
# ? Which scope do you want to deploy to? [选择你的账号]
# ? Link to existing project? [N/y] n
# ? What's your project's name? playball
# ? In which directory is your code located? ./
```

### 步骤4：配置构建设置
Vercel会自动检测到Vite项目，如果需要手动配置，创建 `vercel.json`：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

### 步骤5：部署到生产环境
```bash
# 部署到生产环境
vercel --prod

# 或简写
vercel -p
```

## 🔧 高级配置

### 1. 自定义域名
在Vercel项目设置中：
1. 进入 **"Domains"** 标签
2. 添加你的域名：`your-domain.com`
3. 按提示配置DNS记录

### 2. 环境变量管理
```bash
# 添加环境变量
vercel env add VITE_APP_TITLE production

# 列出环境变量
vercel env ls

# 删除环境变量
vercel env rm VITE_APP_TITLE production
```

### 3. SPA路由配置
创建 `vercel.json` 文件：
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 4. 性能优化配置
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "functions": {
    "app/api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 📱 部署后验证

### 1. 功能检查清单
- [ ] 首页正常加载
- [ ] 路由跳转正常（篮球、足球等页面）
- [ ] 静态资源加载正常（CSS、JS、图片）
- [ ] 移动端适配正常
- [ ] 定位功能正常
- [ ] 聊天功能正常
- [ ] 搜索功能正常

### 2. 性能检查
```bash
# 使用Lighthouse检查性能
npx lighthouse https://your-app.vercel.app --view

# 或在Chrome DevTools中运行Lighthouse
```

### 3. 访问测试
- **桌面端**: Chrome、Firefox、Safari
- **移动端**: iOS Safari、Android Chrome
- **网络环境**: WiFi、4G、3G

## 🔄 自动部署设置

### Git集成自动部署
1. 每次推送到 `main` 分支自动部署到生产环境
2. 每次推送到其他分支创建预览部署
3. Pull Request自动创建预览链接

### 部署钩子
在 `package.json` 中添加部署脚本：
```json
{
  "scripts": {
    "build": "vite build",
    "deploy": "vercel --prod",
    "deploy:preview": "vercel"
  }
}
```

## 📊 Vercel 仪表板功能

### 1. 部署历史
- 查看所有部署记录
- 回滚到之前版本
- 比较不同版本差异

### 2. 分析数据
- 访问量统计
- 性能指标
- 错误监控
- 用户地理分布

### 3. 团队协作
- 邀请团队成员
- 设置权限级别
- 协作部署管理

## 🎯 最佳实践

### 1. 分支策略
```
main分支 → 生产环境 (your-app.vercel.app)
develop分支 → 预览环境 (your-app-git-develop.vercel.app)
feature分支 → 临时预览 (your-app-git-feature.vercel.app)
```

### 2. 环境变量管理
```bash
# 开发环境
VITE_API_BASE_URL=http://localhost:5000

# 生产环境
VITE_API_BASE_URL=https://api.your-domain.com
```

### 3. 构建优化
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          vant: ['vant']
        }
      }
    }
  }
})
```

## 🚨 常见问题解决

### 问题1：构建失败
```bash
# 检查Node.js版本
node --version

# 清理依赖重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题2：路由404错误
确保 `vercel.json` 包含SPA重写规则：
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 问题3：静态资源加载失败
检查 `vite.config.js` 中的 `base` 配置：
```javascript
export default defineConfig({
  base: '/', // 确保是根路径
})
```

### 问题4：环境变量不生效
确保环境变量以 `VITE_` 开头：
```bash
VITE_APP_TITLE=PlayBall  # ✅ 正确
APP_TITLE=PlayBall       # ❌ 错误
```

## 🎉 部署成功！

### 你的应用链接
- **生产环境**: `https://your-app.vercel.app`
- **自定义域名**: `https://your-domain.com` (如已配置)

### 下一步
1. **分享你的应用** - 发送链接给朋友测试
2. **监控性能** - 使用Vercel Analytics
3. **收集反馈** - 根据用户反馈优化
4. **持续改进** - 定期更新和优化

## 📞 获取帮助

### Vercel资源
- [官方文档](https://vercel.com/docs)
- [社区论坛](https://github.com/vercel/vercel/discussions)
- [Discord社区](https://vercel.com/discord)

### 技术支持
- Vercel支持邮箱：support@vercel.com
- GitHub Issues：提交技术问题
- 社区Stack Overflow：搜索解决方案

---

## 🚀 立即开始部署

选择你喜欢的方式开始部署：

### 快速部署（推荐）
```bash
# 1. 安装CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel --prod
```

### Web界面部署
1. 访问 [vercel.com](https://vercel.com)
2. 连接GitHub
3. 导入项目
4. 一键部署

你的PlayBall运动社交应用即将在全球用户面前闪亮登场！🏀⚽🏸