# PlayBall 部署平台指南

## 🌐 部署平台选择

根据你的需求和预算，我推荐以下几种部署平台：

## 🚀 推荐部署平台

### 1. Vercel (⭐⭐⭐⭐⭐ 强烈推荐)

**优势:**
- ✅ 零配置部署
- ✅ 自动HTTPS
- ✅ 全球CDN加速
- ✅ Git集成，自动部署
- ✅ 免费额度充足

**部署步骤:**
1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录
3. 点击 "New Project"
4. 选择你的GitHub仓库
5. 配置构建设置：
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   ```
6. 点击 "Deploy"

**自定义域名:**
```bash
# 在Vercel项目设置中添加域名
Domain: your-domain.com
```

---

### 2. Netlify (⭐⭐⭐⭐⭐ 强烈推荐)

**优势:**
- ✅ 拖拽部署
- ✅ 表单处理
- ✅ 无服务器函数
- ✅ 分支预览
- ✅ 免费SSL证书

**部署方法1 - 拖拽部署:**
1. 访问 [netlify.com](https://netlify.com)
2. 注册并登录
3. 将 `dist` 文件夹直接拖拽到部署区域
4. 等待部署完成

**部署方法2 - Git集成:**
1. 连接GitHub仓库
2. 配置构建设置：
   ```
   Build command: npm run build
   Publish directory: dist
   ```
3. 添加环境变量（如需要）

**SPA路由配置:**
创建 `public/_redirects` 文件：
```
/*    /index.html   200
```

---

### 3. GitHub Pages (⭐⭐⭐⭐ 免费推荐)

**优势:**
- ✅ 完全免费
- ✅ GitHub集成
- ✅ 自动部署
- ✅ 自定义域名支持

**部署步骤:**
1. 在GitHub仓库中创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

2. 在仓库设置中启用GitHub Pages
3. 选择 `gh-pages` 分支作为源

**自定义域名:**
在 `public` 目录创建 `CNAME` 文件：
```
your-domain.com
```

---

### 4. 阿里云OSS (⭐⭐⭐⭐ 国内推荐)

**优势:**
- ✅ 国内访问速度快
- ✅ CDN加速
- ✅ 成本低廉
- ✅ 高可用性

**部署步骤:**
1. 创建OSS存储桶
2. 开启静态网站托管
3. 配置索引文档为 `index.html`
4. 配置错误文档为 `index.html` (SPA路由支持)
5. 上传 `dist` 目录内容

**CDN配置:**
1. 创建CDN域名
2. 源站设置为OSS存储桶
3. 配置缓存规则：
   ```
   *.html: 不缓存
   *.js, *.css: 缓存1年
   ```

**自动部署脚本:**
```bash
#!/bin/bash
# 构建项目
npm run build

# 上传到OSS
ossutil cp -r dist/ oss://your-bucket-name/ --update
```

---

### 5. 腾讯云COS (⭐⭐⭐⭐ 国内推荐)

**优势:**
- ✅ 国内访问优化
- ✅ 与微信生态集成
- ✅ 价格实惠
- ✅ 技术支持好

**部署步骤:**
1. 创建COS存储桶
2. 开启静态网站功能
3. 设置索引文档：`index.html`
4. 设置错误文档：`index.html`
5. 上传构建文件

**CDN加速:**
```bash
# 使用腾讯云CLI工具
coscmd upload -r dist/ /
```

---

### 6. 自建服务器 (⭐⭐⭐ 完全控制)

**Nginx配置:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/playball/dist;
    index index.html;

    # SPA路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 启用Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
}
```

**Apache配置:**
创建 `.htaccess` 文件：
```apache
RewriteEngine On
RewriteBase /

# SPA路由支持
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# 启用Gzip压缩
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# 设置缓存
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

---

## 🔧 部署配置文件

### package.json 部署脚本
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview",
    "deploy:vercel": "vercel --prod",
    "deploy:netlify": "netlify deploy --prod --dir=dist",
    "deploy:gh-pages": "gh-pages -d dist"
  }
}
```

### 环境变量配置
创建 `.env.production` 文件：
```env
VITE_APP_TITLE=PlayBall
VITE_API_BASE_URL=https://api.your-domain.com
VITE_CDN_URL=https://cdn.your-domain.com
```

---

## 📊 平台对比

| 平台 | 免费额度 | 自定义域名 | CDN | 构建时间 | 难度 | 推荐指数 |
|------|---------|-----------|-----|---------|------|----------|
| Vercel | 100GB/月 | ✅ | ✅ | 快 | ⭐ | ⭐⭐⭐⭐⭐ |
| Netlify | 100GB/月 | ✅ | ✅ | 快 | ⭐ | ⭐⭐⭐⭐⭐ |
| GitHub Pages | 1GB | ✅ | ✅ | 中等 | ⭐⭐ | ⭐⭐⭐⭐ |
| 阿里云OSS | 按量付费 | ✅ | ✅ | 快 | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 腾讯云COS | 按量付费 | ✅ | ✅ | 快 | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 自建服务器 | 服务器成本 | ✅ | 需配置 | 取决于服务器 | ⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 🎯 推荐方案

### 个人项目/演示
**推荐**: Vercel 或 Netlify
- 零配置，一键部署
- 免费额度充足
- 全球CDN加速
- 自动HTTPS

### 商业项目/国内用户
**推荐**: 阿里云OSS + CDN
- 国内访问速度快
- 成本可控
- 高可用性
- 技术支持完善

### 开源项目
**推荐**: GitHub Pages
- 完全免费
- 与GitHub深度集成
- 社区友好
- 自动部署

---

## 🚀 快速部署命令

### Vercel部署
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录并部署
vercel login
vercel --prod
```

### Netlify部署
```bash
# 安装Netlify CLI
npm i -g netlify-cli

# 登录并部署
netlify login
netlify deploy --prod --dir=dist
```

### GitHub Pages部署
```bash
# 安装gh-pages
npm i -D gh-pages

# 部署到gh-pages分支
npm run build
npx gh-pages -d dist
```

---

## 🔍 部署后检查清单

### 功能检查
- [ ] 首页正常加载
- [ ] 路由跳转正常
- [ ] 静态资源加载正常
- [ ] 移动端适配正常
- [ ] 定位功能正常
- [ ] 聊天功能正常

### 性能检查
- [ ] 页面加载速度 < 3秒
- [ ] Gzip压缩生效
- [ ] 静态资源缓存生效
- [ ] CDN加速生效
- [ ] HTTPS证书正常

### SEO检查
- [ ] 页面标题正确
- [ ] Meta描述设置
- [ ] 图标显示正常
- [ ] 移动端友好
- [ ] 结构化数据

---

## 🎉 部署成功！

选择适合你的部署平台，按照上述步骤操作，你的PlayBall运动社交应用就能成功上线了！

### 推荐部署流程：
1. **开发测试** → Vercel/Netlify (免费快速)
2. **正式上线** → 阿里云OSS/腾讯云COS (国内优化)
3. **开源分享** → GitHub Pages (社区友好)

需要我帮你配置具体的部署平台吗？