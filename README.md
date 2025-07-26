# 🏀 PlayBall - 运动社交应用

<div align="center">

![PlayBall Logo](https://img.shields.io/badge/PlayBall-运动社交-FF976A?style=for-the-badge&logo=basketball&logoColor=white)

**让运动更有趣，让社交更简单**

[![Vue 3](https://img.shields.io/badge/Vue-3.5.17-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Vant](https://img.shields.io/badge/Vant-4.9.21-07C160?style=flat-square)](https://vant-ui.github.io/vant/)
[![Pinia](https://img.shields.io/badge/Pinia-3.0.3-FFD859?style=flat-square)](https://pinia.vuejs.org/)

[在线演示](https://playball.vercel.app) · [功能介绍](#-功能特色) · [快速开始](#-快速开始) · [部署指南](#-部署)

</div>

## 📖 项目简介

PlayBall 是一款专为运动爱好者打造的社交应用，支持多种运动类型，提供场地查找、活动组织、好友互动等功能。采用现代化的技术栈，提供流畅的移动端体验。

### 🎯 核心理念
- **连接运动爱好者** - 让志同道合的人轻松相遇
- **简化运动组织** - 一键发布活动，快速组队
- **优化场地利用** - 智能推荐附近优质场地
- **促进社交互动** - 微信风格聊天，无障碍沟通

## ✨ 功能特色

### 🏃‍♂️ 多运动支持
- 🏀 **篮球** - 街头篮球、正规比赛
- ⚽ **足球** - 五人制、十一人制
- 🏸 **羽毛球** - 单打双打、混合双打
- 🎾 **网球** - 硬地、红土场地
- 🏓 **乒乓球** - 室内外场地
- 🎱 **台球** - 中式、美式台球
- 🏐 **排球** - 室内外排球

### 📍 智能定位
- **GPS精准定位** - 自动获取当前位置
- **地区智能映射** - 数据不足时自动推荐邻近地区
- **场地距离计算** - 显示到各场地的实际距离
- **位置隐私保护** - 用户可控的位置信息分享

### 💬 微信风格聊天
- **纯净聊天界面** - 无导航栏干扰，专注沟通
- **群聊私聊支持** - 灵活的聊天模式
- **消息状态显示** - 已读未读状态清晰可见
- **语音消息支持** - 便捷的语音交流方式

### 🔍 全局搜索
- **场地搜索** - 按名称、位置、设施搜索
- **活动搜索** - 按运动类型、时间、地点筛选
- **玩家搜索** - 寻找合适的运动伙伴
- **智能建议** - 基于历史搜索的智能推荐

### 👥 社交功能
- **好友系统** - 添加好友，建立运动圈子
- **活动发布** - 一键发布运动活动
- **实时通知** - 活动提醒、消息通知
- **个人中心** - 完整的用户资料管理

## 🛠️ 技术栈

### 前端框架
- **Vue 3** - 渐进式JavaScript框架
- **Vite** - 下一代前端构建工具
- **Vue Router** - 官方路由管理器
- **Pinia** - 轻量级状态管理

### UI组件
- **Vant** - 轻量、可靠的移动端组件库
- **自定义组件** - 针对运动场景的专用组件

### 开发工具
- **ESBuild** - 极速JavaScript打包器
- **Sass** - CSS预处理器
- **ESLint** - 代码质量检查

### 地图服务
- **高德地图API** - 位置服务和地图展示
- **逆地理编码** - 坐标转换为地址信息

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖
```bash
# 克隆项目
git clone https://github.com/your-username/playball.git
cd playball

# 安装依赖
npm install
# 或
yarn install
```

### 开发环境
```bash
# 启动开发服务器
npm run dev
# 或
yarn dev

# 访问 http://localhost:5173
```

### 构建生产版本
```bash
# 构建项目
npm run build
# 或
yarn build

# 预览构建结果
npm run preview
# 或
yarn preview
```

## 📁 项目结构

```
playball/
├── public/                 # 静态资源
│   ├── data.json          # 模拟数据
│   └── vite.svg           # 图标
├── src/
│   ├── assets/            # 资源文件
│   ├── components/        # 公共组件
│   │   ├── search/        # 搜索相关组件
│   │   ├── ActivityList.vue
│   │   ├── Chat.vue
│   │   ├── FriendList.vue
│   │   └── ...
│   ├── config/            # 配置文件
│   │   ├── api.js         # API配置
│   │   └── app.js         # 应用配置
│   ├── router/            # 路由配置
│   ├── services/          # 服务层
│   │   ├── api.js         # API服务
│   │   ├── database.js    # 数据服务
│   │   └── notificationService.js
│   ├── stores/            # 状态管理
│   │   ├── user.js        # 用户状态
│   │   ├── locationStore.js
│   │   ├── friendStore.js
│   │   └── ...
│   ├── utils/             # 工具函数
│   ├── views/             # 页面组件
│   │   ├── Basketball.vue
│   │   ├── ChatDetail.vue
│   │   ├── Profile.vue
│   │   └── ...
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── package.json
├── vite.config.js         # Vite配置
└── README.md
```

## 🎨 界面预览

### 首页 - 运动选择
<img src="https://via.placeholder.com/300x600/FF976A/FFFFFF?text=首页" alt="首页" width="200">

### 聊天界面 - 微信风格
<img src="https://via.placeholder.com/300x600/07C160/FFFFFF?text=聊天" alt="聊天" width="200">

### 场地地图 - 智能定位
<img src="https://via.placeholder.com/300x600/1989FA/FFFFFF?text=地图" alt="地图" width="200">

## 🔧 配置说明

### 环境变量
创建 `.env.local` 文件：
```env
# 应用标题
VITE_APP_TITLE=PlayBall

# API基础URL
VITE_API_BASE_URL=http://localhost:5000

# 高德地图API Key
VITE_AMAP_KEY=your_amap_key_here
```

### API配置
```javascript
// src/config/api.js
export const apiConfig = {
  enableBackendAPI: false,    // 是否启用后端API
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
  showRequestLogs: false,     // 开发环境日志
  showErrorLogs: false        // 错误日志
};
```

## 📱 功能演示

### 运动类型切换
```javascript
// 支持的运动类型
const sports = [
  { name: '篮球', path: '/basketball', icon: '🏀' },
  { name: '足球', path: '/football', icon: '⚽' },
  { name: '羽毛球', path: '/badminton', icon: '🏸' },
  // ... 更多运动类型
];
```

### 智能定位功能
```javascript
// 自动获取用户位置
const locationStore = useLocationStore();
await locationStore.initializeLocation();

// 地区数据映射
if (!hasDataForDistrict(district)) {
  // 自动推荐邻近地区
  const nearbyDistrict = findNearbyDistrict(city, district);
  showMappingNotification(nearbyDistrict);
}
```

### 聊天系统
```javascript
// 微信风格聊天界面
const chatTypes = {
  group: '群聊',    // 显示用户名
  private: '私聊'   // 隐藏用户名
};

// 消息类型支持
const messageTypes = ['text', 'image', 'voice', 'location'];
```

## 🚀 部署

### Vercel部署（推荐）
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

# 部署
netlify deploy --prod --dir=dist
```

### 自建服务器
```nginx
# Nginx配置示例
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 贡献方式
1. **Fork** 本仓库
2. **创建** 特性分支 (`git checkout -b feature/AmazingFeature`)
3. **提交** 更改 (`git commit -m 'Add some AmazingFeature'`)
4. **推送** 到分支 (`git push origin feature/AmazingFeature`)
5. **创建** Pull Request

### 开发规范
- 遵循 Vue 3 Composition API 规范
- 使用 ESLint 进行代码检查
- 提交信息遵循 [Conventional Commits](https://conventionalcommits.org/)
- 新功能需要添加相应测试

### Bug报告
使用 [GitHub Issues](https://github.com/your-username/playball/issues) 报告bug，请包含：
- 详细的问题描述
- 复现步骤
- 期望行为
- 实际行为
- 环境信息（浏览器、设备等）

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

### 技术支持
- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Vant](https://vant-ui.github.io/vant/) - 移动端组件库
- [高德地图](https://lbs.amap.com/) - 地图和定位服务

### 设计灵感
- 微信 - 聊天界面设计参考
- 各大运动APP - 功能设计借鉴

## 📞 联系我们

- **项目主页**: [GitHub](https://github.com/your-username/playball)
- **在线演示**: [PlayBall Demo](https://playball.vercel.app)
- **问题反馈**: [Issues](https://github.com/your-username/playball/issues)
- **功能建议**: [Discussions](https://github.com/your-username/playball/discussions)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=your-username/playball&type=Date)](https://star-history.com/#your-username/playball&Date)

---

<div align="center">

**如果这个项目对你有帮助，请给它一个 ⭐️**

Made with ❤️ by [Your Name](https://github.com/your-username)

</div>
