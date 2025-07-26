// 模拟数据库服务
import { nanoid } from 'nanoid';

// 模拟数据库存储
class MockDatabase {
  constructor() {
    this.activities = new Map();
    this.friends = new Map();
    this.locations = new Map();
    this.users = new Map();
    
    // 初始化数据
    this.initializeData();
  }

  // 初始化模拟数据
  initializeData() {
    // 初始化城市和区域数据
    this.initializeLocations();
    
    // 初始化用户数据
    this.initializeUsers();
    
    // 初始化活动数据
    this.initializeActivities();
    
    // 初始化好友数据
    this.initializeFriends();
  }

  // 初始化位置数据
  initializeLocations() {
    const locations = [
      // 北京
      { id: 'bj-cy', city: '北京市', district: '朝阳区', coordinates: [116.4074, 39.9042] },
      { id: 'bj-hd', city: '北京市', district: '海淀区', coordinates: [116.2317, 39.9761] },
      { id: 'bj-xc', city: '北京市', district: '西城区', coordinates: [116.3662, 39.9248] },
      { id: 'bj-dc', city: '北京市', district: '东城区', coordinates: [116.4074, 39.9042] },
      
      // 上海
      { id: 'sh-hp', city: '上海市', district: '黄浦区', coordinates: [121.4737, 31.2304] },
      { id: 'sh-xh', city: '上海市', district: '徐汇区', coordinates: [121.4368, 31.1882] },
      { id: 'sh-cn', city: '上海市', district: '长宁区', coordinates: [121.4204, 31.2206] },
      { id: 'sh-jn', city: '上海市', district: '静安区', coordinates: [121.4484, 31.2290] },
      
      // 广州
      { id: 'gz-th', city: '广州市', district: '天河区', coordinates: [113.3308, 23.1291] },
      { id: 'gz-yh', city: '广州市', district: '越秀区', coordinates: [113.2644, 23.1291] },
      { id: 'gz-lw', city: '广州市', district: '荔湾区', coordinates: [113.2442, 23.1167] },
      { id: 'gz-hp', city: '广州市', district: '海珠区', coordinates: [113.2618, 23.1040] },
      
      // 深圳
      { id: 'sz-ft', city: '深圳市', district: '福田区', coordinates: [114.0579, 22.5431] },
      { id: 'sz-lh', city: '深圳市', district: '罗湖区', coordinates: [114.1245, 22.5455] },
      { id: 'sz-ns', city: '深圳市', district: '南山区', coordinates: [113.9308, 22.5329] },
      { id: 'sz-yb', city: '深圳市', district: '盐田区', coordinates: [114.2366, 22.5582] }
    ];

    locations.forEach(location => {
      this.locations.set(location.id, location);
    });
  }

  // 初始化用户数据
  initializeUsers() {
    const users = [
      {
        id: 'user1',
        name: '张三',
        avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        phone: '13800138001',
        locationId: 'bj-cy',
        isOnline: true,
        lastActiveTime: new Date(),
        favoriteSports: ['basketball', 'football'],
        level: 'intermediate'
      },
      {
        id: 'user2',
        name: '李四',
        avatar: 'https://img01.yzcdn.cn/vant/tree.jpg',
        phone: '13800138002',
        locationId: 'bj-hd',
        isOnline: false,
        lastActiveTime: new Date(Date.now() - 30 * 60 * 1000),
        favoriteSports: ['badminton', 'tennis'],
        level: 'advanced'
      },
      {
        id: 'user3',
        name: '王五',
        avatar: 'https://img01.yzcdn.cn/vant/leaf.jpg',
        phone: '13800138003',
        locationId: 'sh-hp',
        isOnline: true,
        lastActiveTime: new Date(),
        favoriteSports: ['basketball', 'volleyball'],
        level: 'beginner'
      }
    ];

    users.forEach(user => {
      this.users.set(user.id, user);
    });
  }

  // 初始化活动数据
  initializeActivities() {
    const activities = [
      // 北京朝阳区活动
      {
        id: nanoid(),
        title: '朝阳公园篮球约战',
        sport: 'basketball',
        locationId: 'bj-cy',
        venue: '朝阳公园篮球场',
        address: '北京市朝阳区朝阳公园南路1号',
        date: '2024-01-20',
        time: '14:00-16:00',
        maxParticipants: 10,
        currentParticipants: 6,
        organizer: 'user1',
        participants: ['user1', 'user2'],
        level: 'intermediate',
        fee: 0,
        description: '周末篮球友谊赛，欢迎各位球友参加！',
        createdAt: new Date(),
        status: 'active'
      },
      {
        id: nanoid(),
        title: '工体足球训练',
        sport: 'football',
        locationId: 'bj-cy',
        venue: '工人体育场',
        address: '北京市朝阳区工体北路',
        date: '2024-01-21',
        time: '10:00-12:00',
        maxParticipants: 22,
        currentParticipants: 15,
        organizer: 'user1',
        participants: ['user1'],
        level: 'all',
        fee: 50,
        description: '足球训练课，提升技术水平',
        createdAt: new Date(),
        status: 'active'
      },
      
      // 北京海淀区活动
      {
        id: nanoid(),
        title: '奥森公园晨跑',
        sport: 'running',
        locationId: 'bj-hd',
        venue: '奥林匹克森林公园',
        address: '北京市海淀区科荟路33号',
        date: '2024-01-22',
        time: '07:00-08:00',
        maxParticipants: 20,
        currentParticipants: 8,
        organizer: 'user2',
        participants: ['user2'],
        level: 'all',
        fee: 0,
        description: '健康晨跑，呼吸新鲜空气',
        createdAt: new Date(),
        status: 'active'
      },
      
      // 上海黄浦区活动
      {
        id: nanoid(),
        title: '外滩羽毛球对战',
        sport: 'badminton',
        locationId: 'sh-hp',
        venue: '黄浦体育馆',
        address: '上海市黄浦区中山东一路',
        date: '2024-01-23',
        time: '19:00-21:00',
        maxParticipants: 8,
        currentParticipants: 4,
        organizer: 'user3',
        participants: ['user3'],
        level: 'intermediate',
        fee: 80,
        description: '羽毛球技术交流赛',
        createdAt: new Date(),
        status: 'active'
      }
    ];

    activities.forEach(activity => {
      this.activities.set(activity.id, activity);
    });
  }

  // 初始化好友数据
  initializeFriends() {
    const friends = [
      // 北京朝阳区好友
      {
        id: nanoid(),
        name: '篮球达人',
        avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
        locationId: 'bj-cy',
        position: '控卫/PG',
        isOnline: true,
        favoriteSports: ['basketball'],
        level: 'advanced',
        lastActiveTime: new Date()
      },
      {
        id: nanoid(),
        name: '足球小子',
        avatar: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
        locationId: 'bj-cy',
        position: '前锋/FW',
        isOnline: false,
        favoriteSports: ['football'],
        level: 'intermediate',
        lastActiveTime: new Date(Date.now() - 15 * 60 * 1000)
      },
      
      // 北京海淀区好友
      {
        id: nanoid(),
        name: '羽球高手',
        avatar: 'https://img01.yzcdn.cn/vant/apple-2.jpg',
        locationId: 'bj-hd',
        position: '单打',
        isOnline: true,
        favoriteSports: ['badminton'],
        level: 'advanced',
        lastActiveTime: new Date()
      },
      
      // 上海黄浦区好友
      {
        id: nanoid(),
        name: '网球王子',
        avatar: 'https://img01.yzcdn.cn/vant/apple-3.jpg',
        locationId: 'sh-hp',
        position: '底线型',
        isOnline: true,
        favoriteSports: ['tennis'],
        level: 'intermediate',
        lastActiveTime: new Date()
      }
    ];

    friends.forEach(friend => {
      this.friends.set(friend.id, friend);
    });
  }

  // 加载JSON数据文件
  async loadJsonData() {
    try {
      const response = await fetch('/data.json');
      return await response.json();
    } catch (error) {
      // 加载数据文件失败
      return { players: [], activities: [] };
    }
  }

  // 根据位置获取活动列表
  async getActivitiesByLocation(city, district, sport = null) {
    try {
      // 直接从JSON数据中读取，而不是使用内存中的activities
      const data = await this.loadJsonData();
      const activities = data.activities || [];
      
      // 过滤活动数据
      
      let filtered = activities.filter(activity => {
        const matchCity = activity.city === city;
        const matchDistrict = !district || activity.district === district;
        const matchSport = !sport || activity.sport === sport;
        return matchCity && matchDistrict && matchSport;
      });

      // 如果指定地区没有数据，回退到同城市的其他地区
      if (filtered.length === 0 && district) {
        // 没有活动数据，回退到同城市其他地区
        filtered = activities.filter(activity => {
          const matchCity = activity.city === city;
          const matchSport = !sport || activity.sport === sport;
          return matchCity && matchSport;
        });
        // 回退后活动数量
      }

      // 按日期排序
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // 最终活动数量
      return filtered;
    } catch (error) {
      // 获取活动数据失败
      return [];
    }
  }

  // 根据位置获取附近好友
  async getFriendsByLocation(city, district, sport = null) {
    try {
      // 直接从JSON数据中读取球友数据
      const data = await this.loadJsonData();
      const players = data.players || [];
      
      // 过滤球友数据
      
      let filtered = players.filter(player => {
        const matchCity = player.city === city;
        const matchDistrict = !district || player.district === district;
        const matchSport = !sport || (player.sports && player.sports.includes(sport));
        return matchCity && matchDistrict && matchSport;
      });

      // 如果指定地区没有数据，回退到同城市的其他地区
      if (filtered.length === 0 && district) {
        // 没有球友数据，回退到同城市其他地区
        filtered = players.filter(player => {
          const matchCity = player.city === city;
          const matchSport = !sport || (player.sports && player.sports.includes(sport));
          return matchCity && matchSport;
        });
        // 回退后球友数量
      }

      // 按年龄排序，年龄相近的优先
      filtered.sort((a, b) => a.age - b.age);
      
      // 最终球友数量
      return filtered;
    } catch (error) {
      // 获取球友数据失败
      return [];
    }
  }

  // 获取位置ID
  getLocationId(city, district) {
    for (const [id, location] of this.locations) {
      if (location.city === city && location.district === district) {
        return id;
      }
    }
    return null;
  }

  // 创建新活动
  createActivity(activityData) {
    const activity = {
      id: nanoid(),
      ...activityData,
      currentParticipants: 1,
      participants: [activityData.organizer],
      createdAt: new Date(),
      status: 'active'
    };

    this.activities.set(activity.id, activity);
    return activity;
  }

  // 加入活动
  joinActivity(activityId, userId) {
    const activity = this.activities.get(activityId);
    if (!activity) return { success: false, message: '活动不存在' };

    if (activity.participants.includes(userId)) {
      return { success: false, message: '已经参加了此活动' };
    }

    if (activity.currentParticipants >= activity.maxParticipants) {
      return { success: false, message: '活动人数已满' };
    }

    activity.participants.push(userId);
    activity.currentParticipants++;
    
    return { success: true, activity };
  }

  // 退出活动
  leaveActivity(activityId, userId) {
    const activity = this.activities.get(activityId);
    if (!activity) return { success: false, message: '活动不存在' };

    const index = activity.participants.indexOf(userId);
    if (index === -1) {
      return { success: false, message: '未参加此活动' };
    }

    activity.participants.splice(index, 1);
    activity.currentParticipants--;
    
    return { success: true, activity };
  }

  // 更新用户位置
  updateUserLocation(userId, city, district) {
    const user = this.users.get(userId);
    if (!user) return false;

    const locationId = this.getLocationId(city, district);
    if (!locationId) return false;

    user.locationId = locationId;
    user.lastActiveTime = new Date();
    
    return true;
  }

  // 获取所有支持的城市和区域
  async getAllLocations() {
    const data = await this.loadJsonData();
    const locationsByCity = new Map();
    
    // 从球友和活动数据中提取城市和地区信息
    const allItems = [...(data.players || []), ...(data.activities || [])];
    
    for (const item of allItems) {
      const city = item.city;
      const district = item.district;
      
      if (city) {
        if (!locationsByCity.has(city)) {
          locationsByCity.set(city, new Set());
        }
        if (district) {
          locationsByCity.get(city).add(district);
        }
      }
    }

    // 转换Set为Array以便JSON序列化
    const result = {};
    for (const [city, districts] of locationsByCity) {
      result[city] = Array.from(districts);
    }
    
    return result;
  }

  // 搜索活动
  searchActivities(query, city = null, district = null, sport = null) {
    let activities = Array.from(this.activities.values());

    // 按位置过滤
    if (city && district) {
      const locationId = this.getLocationId(city, district);
      if (locationId) {
        activities = activities.filter(activity => activity.locationId === locationId);
      }
    }

    // 按运动类型过滤
    if (sport) {
      activities = activities.filter(activity => activity.sport === sport);
    }

    // 按关键词搜索
    if (query) {
      const lowerQuery = query.toLowerCase();
      activities = activities.filter(activity => 
        activity.title.toLowerCase().includes(lowerQuery) ||
        activity.description.toLowerCase().includes(lowerQuery) ||
        activity.venue.toLowerCase().includes(lowerQuery)
      );
    }

    return activities
      .filter(activity => activity.status === 'active')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(activity => ({
        ...activity,
        location: this.locations.get(activity.locationId),
        organizerInfo: this.users.get(activity.organizer)
      }));
  }
}

// 创建全局数据库实例
export const mockDatabase = new MockDatabase();

// 导出数据库操作方法
export default {
  // 数据加载
  loadJsonData: () => 
    mockDatabase.loadJsonData(),

  // 活动相关
  getActivitiesByLocation: async (city, district, sport) => 
    await mockDatabase.getActivitiesByLocation(city, district, sport),
  
  createActivity: (activityData) => 
    mockDatabase.createActivity(activityData),
  
  joinActivity: (activityId, userId) => 
    mockDatabase.joinActivity(activityId, userId),
  
  leaveActivity: (activityId, userId) => 
    mockDatabase.leaveActivity(activityId, userId),
  
  searchActivities: (query, city, district, sport) => 
    mockDatabase.searchActivities(query, city, district, sport),

  // 好友相关
  getFriendsByLocation: async (city, district, sport) => 
    await mockDatabase.getFriendsByLocation(city, district, sport),

  // 位置相关
  getAllLocations: async () => 
    await mockDatabase.getAllLocations(),
  
  updateUserLocation: (userId, city, district) => 
    mockDatabase.updateUserLocation(userId, city, district),

  // 获取数据库实例（用于调试）
  getInstance: () => mockDatabase
};