import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import Database from '../services/database.js'
import { useLocationStore } from './locationStore.js'

export const useFriendStore = defineStore('friend', {
  state: () => ({
    currentSport: 'basketball', // 当前运动类型
    currentCity: '北京市',
    currentDistrict: '朝阳区',
    friends: [], // 当前位置的好友列表
    loading: false,
    lastUpdateTime: null,
    friendsBySport: {
      basketball: [
        {
          id: nanoid(),
          name: "飞人刘",
          position: "控卫/SG",
          avatar: "https://img01.yzcdn.cn/vant/cat.jpeg",
          isOnline: true,
        },
        {
          id: nanoid(),
          name: "篮球高手",
          position: "中锋/C",
          avatar: "https://img01.yzcdn.cn/vant/apple-1.jpg",
          isOnline: false,
        },
        {
          id: nanoid(),
          name: "球王James",
          position: "前锋/PF",
          avatar: "https://img01.yzcdn.cn/vant/apple-2.jpg",
          isOnline: true,
        },
        {
          id: nanoid(),
          name: "投篮王",
          position: "得分后卫/SG",
          avatar: "https://img01.yzcdn.cn/vant/apple-3.jpg",
          isOnline: false,
        },
        {
          id: nanoid(),
          name: "篮板王",
          position: "大前锋/PF",
          avatar: "https://img01.yzcdn.cn/vant/cat.jpeg",
          isOnline: true,
        },
        {
          id: nanoid(),
          name: "组织者",
          position: "控卫/PG",
          avatar: "https://img01.yzcdn.cn/vant/apple-1.jpg",
          isOnline: false,
        }
      ],
      football: [
        {
          id: nanoid(),
          name: "足球小子",
          position: "前锋/FW",
          avatar: "https://img01.yzcdn.cn/vant/cat.jpeg",
          isOnline: true,
        },
        {
          id: nanoid(),
          name: "守门员王",
          position: "门将/GK",
          avatar: "https://img01.yzcdn.cn/vant/apple-1.jpg",
          isOnline: false,
        },
        {
          id: nanoid(),
          name: "中场大师",
          position: "中场/MF",
          avatar: "https://img01.yzcdn.cn/vant/apple-2.jpg",
          isOnline: true,
        },
        {
          id: nanoid(),
          name: "后卫铁闸",
          position: "后卫/DF",
          avatar: "https://img01.yzcdn.cn/vant/apple-3.jpg",
          isOnline: false,
        },
        {
          id: nanoid(),
          name: "边锋快马",
          position: "边锋/WF",
          avatar: "https://img01.yzcdn.cn/vant/cat.jpeg",
          isOnline: true,
        },
        {
          id: nanoid(),
          name: "中后卫",
          position: "中后卫/CB",
          avatar: "https://img01.yzcdn.cn/vant/apple-1.jpg",
          isOnline: false,
        }
      ],
      badminton: [
        {
          id: nanoid(),
          name: "羽球王",
          position: "单打",
          avatar: "https://img01.yzcdn.cn/vant/cat.jpeg",
          isOnline: true,
        },
        {
          id: nanoid(),
          name: "双打高手",
          position: "双打",
          avatar: "https://img01.yzcdn.cn/vant/apple-1.jpg",
          isOnline: false,
        },
        {
          id: nanoid(),
          name: "扣杀王",
          position: "进攻型",
          avatar: "https://img01.yzcdn.cn/vant/apple-2.jpg",
          isOnline: true,
        },
        {
          id: nanoid(),
          name: "防守专家",
          position: "防守型",
          avatar: "https://img01.yzcdn.cn/vant/apple-3.jpg",
          isOnline: false,
        },
        {
          id: nanoid(),
          name: "网前高手",
          position: "网前型",
          avatar: "https://img01.yzcdn.cn/vant/cat.jpeg",
          isOnline: true,
        },
        {
          id: nanoid(),
          name: "全能选手",
          position: "全能型",
          avatar: "https://img01.yzcdn.cn/vant/apple-1.jpg",
          isOnline: false,
        }
      ],
      tennis: [
        {
          id: nanoid(),
          name: "网球达人",
          position: "单打",
          avatar: "https://img01.yzcdn.cn/vant/cat.jpeg",
          isOnline: true,
        },
        {
          id: nanoid(),
          name: "发球机器",
          position: "发球型",
          avatar: "https://img01.yzcdn.cn/vant/apple-1.jpg",
          isOnline: false,
        },
        {
          id: nanoid(),
          name: "底线王",
          position: "底线型",
          avatar: "https://img01.yzcdn.cn/vant/apple-2.jpg",
          isOnline: true,
        },
        {
          id: nanoid(),
          name: "上网专家",
          position: "上网型",
          avatar: "https://img01.yzcdn.cn/vant/apple-3.jpg",
          isOnline: false,
        },
        {
          id: nanoid(),
          name: "双打王",
          position: "双打",
          avatar: "https://img01.yzcdn.cn/vant/cat.jpeg",
          isOnline: true,
        }
      ],
      pingpong: [
        {
          id: nanoid(),
          name: "乒乓高手",
          position: "直拍",
          avatar: "https://img01.yzcdn.cn/vant/cat.jpeg",
          isOnline: true,
        },
        {
          id: nanoid(),
          name: "横拍王",
          position: "横拍",
          avatar: "https://img01.yzcdn.cn/vant/apple-1.jpg",
          isOnline: false,
        },
        {
          id: nanoid(),
          name: "旋球大师",
          position: "技术型",
          avatar: "https://img01.yzcdn.cn/vant/apple-2.jpg",
          isOnline: true,
        },
        {
          id: nanoid(),
          name: "快攻手",
          position: "快攻型",
          avatar: "https://img01.yzcdn.cn/vant/apple-3.jpg",
          isOnline: false,
        },
        {
          id: nanoid(),
          name: "削球手",
          position: "削球型",
          avatar: "https://img01.yzcdn.cn/vant/cat.jpeg",
          isOnline: true,
        }
      ],
      billiards: [
        {
          id: nanoid(),
          name: "台球王子",
          position: "8球",
          avatar: "https://img01.yzcdn.cn/vant/cat.jpeg",
          isOnline: true,
        },
        {
          id: nanoid(),
          name: "斯诺克高手",
          position: "斯诺克",
          avatar: "https://img01.yzcdn.cn/vant/apple-1.jpg",
          isOnline: false,
        },
        {
          id: nanoid(),
          name: "九球达人",
          position: "9球",
          avatar: "https://img01.yzcdn.cn/vant/apple-2.jpg",
          isOnline: true,
        },
        {
          id: nanoid(),
          name: "中式八球王",
          position: "中式八球",
          avatar: "https://img01.yzcdn.cn/vant/apple-3.jpg",
          isOnline: false,
        },
        {
          id: nanoid(),
          name: "开球专家",
          position: "开球型",
          avatar: "https://img01.yzcdn.cn/vant/cat.jpeg",
          isOnline: true,
        }
      ],
      volleyball: [
        {
          id: nanoid(),
          name: "排球队长",
          position: "主攻",
          avatar: "https://img01.yzcdn.cn/vant/cat.jpeg",
          isOnline: true,
        },
        {
          id: nanoid(),
          name: "二传手",
          position: "二传",
          avatar: "https://img01.yzcdn.cn/vant/apple-1.jpg",
          isOnline: false,
        },
        {
          id: nanoid(),
          name: "副攻王",
          position: "副攻",
          avatar: "https://img01.yzcdn.cn/vant/apple-2.jpg",
          isOnline: true,
        },
        {
          id: nanoid(),
          name: "接应二传",
          position: "接应",
          avatar: "https://img01.yzcdn.cn/vant/apple-3.jpg",
          isOnline: false,
        },
        {
          id: nanoid(),
          name: "自由人",
          position: "自由人",
          avatar: "https://img01.yzcdn.cn/vant/cat.jpeg",
          isOnline: true,
        },
        {
          id: nanoid(),
          name: "全能攻手",
          position: "全能型",
          avatar: "https://img01.yzcdn.cn/vant/apple-1.jpg",
          isOnline: false,
        }
      ]
    }
  }),

  getters: {
    // 获取当前位置和运动类型的球友
    currentFriends: (state) => {
      // 确保 friends 是数组
      if (!Array.isArray(state.friends)) {
        return state.friendsBySport[state.currentSport] || [];
      }
      
      // 如果有从数据库加载的数据，使用数据库数据
      if (state.friends.length > 0) {
        // 获取当前运动的中文名称（在getter中直接定义映射）
        const sportMap = {
          basketball: '篮球',
          football: '足球',
          badminton: '羽毛球',
          tennis: '网球',
          pingpong: '乒乓球',
          billiards: '台球',
          volleyball: '排球'
        };
        const chineseSport = sportMap[state.currentSport] || state.currentSport;
        
        return state.friends
          .filter(friend => {
            // 检查好友是否参与当前运动
            return friend.sports && friend.sports.includes(chineseSport);
          })
          .map(friend => ({
            ...friend,
            // 为兼容性添加缺失的字段
            position: friend.position || '球友',
            isOnline: friend.isOnline !== undefined ? friend.isOnline : Math.random() > 0.5,
            favoriteSports: friend.sports || []
          }));
      }
      
      // 否则使用静态数据
      return state.friendsBySport[state.currentSport] || [];
    },

    // 获取静态数据的球友（兼容旧版本）
    staticFriends: (state) => {
      return state.friendsBySport[state.currentSport] || []
    },

    // 获取在线球友
    onlineFriends: (state) => {
      const currentFriends = state.friendsBySport[state.currentSport] || [];
      return currentFriends.filter(friend => friend.isOnline)
    },

    // 获取球友总数
    friendsCount: (state) => {
      const currentFriends = state.friendsBySport[state.currentSport] || [];
      return currentFriends.length
    },

    // 获取在线球友数量
    onlineFriendsCount: (state) => {
      const currentFriends = state.friendsBySport[state.currentSport] || [];
      return currentFriends.filter(friend => friend.isOnline).length
    },

    // 运动类型标题映射
    sportTitles: () => ({
      basketball: '篮球',
      football: '足球',
      badminton: '羽毛球',
      tennis: '网球',
      pingpong: '乒乓球',
      billiards: '台球',
      volleyball: '排球'
    }),

    // 动态标题
    friendListTitle: (state) => {
      const sportTitles = {
        basketball: '篮球',
        football: '足球',
        badminton: '羽毛球',
        tennis: '网球',
        pingpong: '乒乓球',
        billiards: '台球',
        volleyball: '排球'
      };
      return `附近${sportTitles[state.currentSport]}球友`;
    }
  },

  actions: {
    // 初始化好友数据
    async initializeFriends() {
      try {
        // 使用默认位置（北京市朝阳区）
        if (!this.currentCity) {
          this.currentCity = '北京市';
          this.currentDistrict = '朝阳区';
        }
        
        // 加载好友数据
        await this.loadFriends();
      } catch (error) {
        // 初始化好友数据失败
      }
    },

    // 运动类型映射（英文到中文）
    getSportNameInChinese(sportType) {
      const sportMap = {
        basketball: '篮球',
        football: '足球',
        badminton: '羽毛球',
        tennis: '网球',
        pingpong: '乒乓球',
        billiards: '台球',
        volleyball: '排球'
      };
      return sportMap[sportType] || sportType;
    },

    // 加载好友数据
    async loadFriends(forceRefresh = false) {
      if (this.loading) return;
      
      // 检查是否需要更新
      if (!forceRefresh && this.lastUpdateTime) {
        const now = new Date();
        const lastUpdate = new Date(this.lastUpdateTime);
        const diffMinutes = (now - lastUpdate) / (1000 * 60);
        if (diffMinutes < 2) return; // 2分钟内不重复加载
      }

      this.loading = true;
      
      try {
        // 将英文运动类型转换为中文
        const chineseSport = this.getSportNameInChinese(this.currentSport);
        
        // 从数据库获取当前位置的好友
        const friends = await Database.getFriendsByLocation(
          this.currentCity,
          this.currentDistrict,
          chineseSport
        );
        
        this.friends = friends || [];
        this.lastUpdateTime = new Date();
        
        // 加载好友完成
      } catch (error) {
        // 加载好友失败
      } finally {
        this.loading = false;
      }
    },

    // 设置当前运动类型
    async setSportType(sportType) {
      if (this.currentSport !== sportType) {
        this.currentSport = sportType;
        await this.loadFriends(true); // 强制刷新
      }
    },

    // 切换位置
    async setLocation(city, district) {
      if (this.currentCity !== city || this.currentDistrict !== district) {
        this.currentCity = city;
        this.currentDistrict = district;
        
        // 重新加载好友
        await this.loadFriends(true);
      }
    },

    // 根据路径获取运动类型
    getSportTypeFromPath(path) {
      if (path.includes('basketball')) return 'basketball';
      if (path.includes('football')) return 'football';
      if (path.includes('badminton')) return 'badminton';
      if (path.includes('tennis')) return 'tennis';
      if (path.includes('pingpong')) return 'pingpong';
      if (path.includes('billiards')) return 'billiards';
      if (path.includes('volleyball')) return 'volleyball';
      return 'basketball'; // 默认返回篮球
    },

    // 添加球友
    addFriend(friend) {
      const currentFriends = this.friendsBySport[this.currentSport];
      if (currentFriends) {
        currentFriends.push({
          id: nanoid(),
          ...friend
        });
      }
    },

    // 删除球友
    removeFriend(friendId) {
      const currentFriends = this.friendsBySport[this.currentSport];
      if (currentFriends) {
        const index = currentFriends.findIndex(friend => friend.id === friendId);
        if (index !== -1) {
          currentFriends.splice(index, 1);
        }
      }
    },

    // 更新球友在线状态
    updateFriendOnlineStatus(friendId, isOnline) {
      const currentFriends = this.friendsBySport[this.currentSport];
      if (currentFriends) {
        const friend = currentFriends.find(f => f.id === friendId);
        if (friend) {
          friend.isOnline = isOnline;
        }
      }
    },

    // 获取指定运动类型的球友
    getFriendsBySport(sportType) {
      return this.friendsBySport[sportType] || [];
    },

    // 根据ID获取好友信息（在所有运动类型中查找）
    getFriendById(friendId) {
      for (const sportType in this.friendsBySport) {
        const friends = this.friendsBySport[sportType];
        const friend = friends.find(f => f.id === friendId);
        if (friend) {
          return {
            ...friend,
            sportType, // 添加运动类型信息
            // 添加一些默认的详细信息
            bio: friend.bio || `我是一名${this.sportTitles[sportType]}爱好者，喜欢和朋友们一起运动！`,
            tags: friend.tags || ['运动爱好者', '友善'],
            favoriteSports: friend.favoriteSports || [this.sportTitles[sportType]],
            stats: friend.stats || {
              participations: Math.floor(Math.random() * 50) + 10,
              organized: Math.floor(Math.random() * 20) + 2,
              friends: Math.floor(Math.random() * 200) + 50,
              rating: (Math.random() * 1 + 4).toFixed(1)
            },
            recentActivities: friend.recentActivities || [
              {
                id: 1,
                title: `${this.sportTitles[sportType]}友谊赛`,
                sport: this.sportTitles[sportType],
                time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' ' + 
                      String(Math.floor(Math.random() * 12) + 8).padStart(2, '0') + ':00'
              }
            ]
          };
        }
      }
      return null; // 如果没有找到，返回null
    }
  }
})