// 模拟数据库存储
class Database {
  constructor() {
    this.storage = localStorage;
    this.init();
  }

  // 初始化数据库
  init() {
    if (!this.storage.getItem('playball_db')) {
      const initialData = {
        users: [
          {
            id: 1,
            phone: '13800138000',
            password: '123456',
            nickname: '测试用户1',
            avatar: '',
            verified: true,
            level: 2,
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            phone: '13900139000',
            password: '123456',
            nickname: '测试用户2',
            avatar: '',
            verified: false,
            level: 1,
            createdAt: new Date().toISOString()
          }
        ],
        sports: [
          {
            id: 1,
            name: '篮球',
            icon: 'basketball',
            color: '#ff6b35',
            activities: []
          },
          {
            id: 2,
            name: '足球',
            icon: 'football',
            color: '#4caf50',
            activities: []
          },
          {
            id: 3,
            name: '羽毛球',
            icon: 'badminton',
            color: '#2196f3',
            activities: []
          },
          {
            id: 4,
            name: '网球',
            icon: 'tennis',
            color: '#ff9800',
            activities: []
          },
          {
            id: 5,
            name: '乒乓球',
            icon: 'pingpong',
            color: '#9c27b0',
            activities: []
          },
          {
            id: 6,
            name: '台球',
            icon: 'billiards',
            color: '#607d8b',
            activities: []
          },
          {
            id: 7,
            name: '排球',
            icon: 'volleyball',
            color: '#e91e63',
            activities: []
          }
        ],
        venues: [
          {
            id: 1,
            name: '市体育中心',
            address: '市中心体育路123号',
            distance: '1.2km',
            rating: 4.8,
            price: '¥80/小时',
            image: 'https://img01.yzcdn.cn/vant/cat.jpeg',
            sports: [1, 2, 3, 4],
            facilities: ['停车场', '更衣室', '淋浴间', 'WiFi']
          },
          {
            id: 2,
            name: '阳光羽毛球馆',
            address: '阳光大道456号',
            distance: '2.1km',
            rating: 4.6,
            price: '¥60/小时',
            image: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
            sports: [3],
            facilities: ['空调', '更衣室', '免费WiFi']
          },
          {
            id: 3,
            name: '蓝天网球俱乐部',
            address: '蓝天路789号',
            distance: '3.5km',
            rating: 4.9,
            price: '¥120/小时',
            image: 'https://img01.yzcdn.cn/vant/apple-2.jpg',
            sports: [4],
            facilities: ['专业教练', '器材租赁', '休息区', '饮料吧']
          }
        ],
        activities: [
          {
            id: 1,
            title: '周末篮球约战',
            sport: 1,
            venue: 1,
            organizer: '篮球达人',
            time: '2025-01-25 14:00',
            duration: '2小时',
            currentPlayers: 6,
            maxPlayers: 10,
            level: '中级',
            fee: '¥20/人',
            description: '周末篮球约战，欢迎有一定基础的球友参加',
            status: 'recruiting'
          },
          {
            id: 2,
            title: '羽毛球双打练习',
            sport: 3,
            venue: 2,
            organizer: '羽球爱好者',
            time: '2025-01-26 19:00',
            duration: '1.5小时',
            currentPlayers: 3,
            maxPlayers: 4,
            level: '初级',
            fee: '¥15/人',
            description: '羽毛球双打练习，适合初学者',
            status: 'recruiting'
          }
        ],
        userStats: {},
        messages: [],
        teams: []
      };
      
      this.storage.setItem('playball_db', JSON.stringify(initialData));
    }
  }

  // 获取数据
  getData() {
    return JSON.parse(this.storage.getItem('playball_db'));
  }

  // 保存数据
  saveData(data) {
    this.storage.setItem('playball_db', JSON.stringify(data));
  }

  // 获取用户数据
  getUsers() {
    return this.getData().users;
  }

  // 添加用户
  addUser(user) {
    const data = this.getData();
    user.id = Date.now();
    user.createdAt = new Date().toISOString();
    user.stats = {
      participations: 0,
      organized: 0,
      friends: 0,
      rating: 5.0,
      creditScore: 100
    };
    data.users.push(user);
    this.saveData(data);
    return user;
  }

  // 根据手机号查找用户
  findUserByPhone(phone) {
    const users = this.getUsers();
    return users.find(user => user.phone === phone);
  }

  // 验证用户登录
  validateUser(phone, password) {
    const user = this.findUserByPhone(phone);
    return user && user.password === password ? user : null;
  }

  // 获取运动项目
  getSports() {
    return this.getData().sports;
  }

  // 获取场地
  getVenues() {
    return this.getData().venues;
  }

  // 获取活动
  getActivities() {
    return this.getData().activities;
  }

  // 根据运动项目获取活动
  getActivitiesBySport(sportId) {
    const activities = this.getActivities();
    return activities.filter(activity => activity.sport === sportId);
  }

  // 添加活动
  addActivity(activity) {
    const data = this.getData();
    activity.id = Date.now();
    activity.createdAt = new Date().toISOString();
    activity.status = 'recruiting';
    data.activities.push(activity);
    this.saveData(data);
    return activity;
  }

  // 更新用户统计数据
  updateUserStats(userId, stats) {
    const data = this.getData();
    const user = data.users.find(u => u.id === userId);
    if (user) {
      user.stats = { ...user.stats, ...stats };
      this.saveData(data);
    }
  }

  // 获取用户统计数据
  getUserStats(userId) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    return user ? user.stats : null;
  }

  // 清空数据库（用于测试）
  clearDatabase() {
    this.storage.removeItem('playball_db');
    this.init();
  }
}

export default new Database();