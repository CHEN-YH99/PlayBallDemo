import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'

export const useActivityStore = defineStore('activity', {
  state: () => ({
    loading: false,
    refreshing: false,
    finished: false,
    pageSize: 3,
    currentPage: 1,
    displayedActivities: [],
    currentSport: 'basketball', // 当前运动类型
    activitiesBySport: {
      basketball: [
        {
          id: nanoid(),
          title: '温馨假日3V3篮球赛',
          isNewbie: true,
          price: 48,
          time: '周日 14:00-16:00',
          date: '7月20日',
          location: '橙郡假日篮球馆',
          branch: '国贸CBD店',
          participants: {
            current: 4,
            total: 8
          },
          intensity: 2,
          status: 'recruiting',
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
        },
        {
          id: nanoid(),
          title: '周末5V5篮球对抗赛',
          isNewbie: false,
          price: 60,
          time: '周六 10:00-12:00',
          date: '7月19日',
          location: '阳光篮球馆',
          branch: '朝阳区店',
          participants: {
            current: 8,
            total: 10
          },
          intensity: 3,
          status: 'recruiting',
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg'
        },
        {
          id: nanoid(),
          title: '篮球技巧训练营',
          isNewbie: true,
          price: 35,
          time: '周五 19:00-21:00',
          date: '7月18日',
          location: '星光篮球馆',
          branch: '望京店',
          participants: {
            current: 6,
            total: 12
          },
          intensity: 1,
          status: 'recruiting',
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
        }
      ],
      football: [
        {
          id: nanoid(),
          title: '周末5V5足球友谊赛',
          isNewbie: false,
          price: 60,
          time: '周六 10:00-12:00',
          date: '7月19日',
          location: '阳光体育公园',
          branch: '朝阳区店',
          participants: {
            current: 8,
            total: 10
          },
          intensity: 3,
          status: 'recruiting',
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg'
        },
        {
          id: nanoid(),
          title: '足球基础训练课',
          isNewbie: true,
          price: 45,
          time: '周日 09:00-11:00',
          date: '7月21日',
          location: '绿茵足球场',
          branch: '海淀区店',
          participants: {
            current: 12,
            total: 16
          },
          intensity: 2,
          status: 'recruiting',
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
        }
      ],
      badminton: [
        {
          id: nanoid(),
          title: '初级羽毛球训练营',
          isNewbie: true,
          price: 35,
          time: '周五 19:00-21:00',
          date: '7月18日',
          location: '星光羽毛球馆',
          branch: '望京店',
          participants: {
            current: 6,
            total: 8
          },
          intensity: 1,
          status: 'recruiting',
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
        },
        {
          id: nanoid(),
          title: '羽毛球双打比赛',
          isNewbie: false,
          price: 50,
          time: '周六 14:00-16:00',
          date: '7月20日',
          location: '飞羽羽毛球馆',
          branch: '朝阳店',
          participants: {
            current: 6,
            total: 8
          },
          intensity: 2,
          status: 'recruiting',
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg'
        }
      ],
      tennis: [
        {
          id: nanoid(),
          title: '夏日网球友谊赛',
          isNewbie: false,
          price: 55,
          time: '周六 08:00-10:00',
          date: '7月26日',
          location: '阳光网球俱乐部',
          branch: '海淀区店',
          participants: {
            current: 2,
            total: 4
          },
          intensity: 2,
          status: 'recruiting',
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg'
        },
        {
          id: nanoid(),
          title: '网球入门体验课',
          isNewbie: true,
          price: 40,
          time: '周日 10:00-12:00',
          date: '7月21日',
          location: '网球之家',
          branch: '西城区店',
          participants: {
            current: 3,
            total: 6
          },
          intensity: 1,
          status: 'recruiting',
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
        }
      ],
      pingpong: [
        {
          id: nanoid(),
          title: '乒乓球技巧提升班',
          isNewbie: false,
          price: 30,
          time: '周三 19:00-21:00',
          date: '7月17日',
          location: '乒乓球俱乐部',
          branch: '东城区店',
          participants: {
            current: 4,
            total: 8
          },
          intensity: 2,
          status: 'recruiting',
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg'
        }
      ],
      billiards: [
        {
          id: nanoid(),
          title: '台球8球比赛',
          isNewbie: false,
          price: 25,
          time: '周五 20:00-22:00',
          date: '7月19日',
          location: '星牌台球厅',
          branch: '三里屯店',
          participants: {
            current: 6,
            total: 8
          },
          intensity: 2,
          status: 'recruiting',
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
        }
      ],
      volleyball: [
        {
          id: nanoid(),
          title: '沙滩排球体验赛',
          isNewbie: true,
          price: 40,
          time: '周六 16:00-18:00',
          date: '7月20日',
          location: '沙滩排球场',
          branch: '奥森公园店',
          participants: {
            current: 8,
            total: 12
          },
          intensity: 2,
          status: 'recruiting',
          image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg'
        }
      ]
    }
  }),

  getters: {
    // 获取当前运动类型的所有活动
    allActivities: (state) => {
      return state.activitiesBySport[state.currentSport] || []
    },

    getActivityById: (state) => (id) => {
      const currentActivities = state.activitiesBySport[state.currentSport] || [];
      return currentActivities.find(activity => activity.id === id)
    },

    getRecruitingActivities: (state) => {
      const currentActivities = state.activitiesBySport[state.currentSport] || [];
      return currentActivities.filter(activity => activity.status === 'recruiting')
    },

    getNewbieActivities: (state) => {
      const currentActivities = state.activitiesBySport[state.currentSport] || [];
      return currentActivities.filter(activity => activity.isNewbie)
    },

    activities: (state) => {
      return state.displayedActivities
    }
  },

  actions: {
    // 初始化加载数据
    initializeData() {
      this.currentPage = 1;
      this.displayedActivities = [];
      this.loadMoreActivities();
    },

    // 加载更多数据
    loadMoreActivities() {
      this.loading = true;

      // 模拟网络请求延迟
      setTimeout(() => {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = this.currentPage * this.pageSize;
        const newActivities = this.allActivities.slice(start, end);

        // 添加新数据到显示列表
        this.displayedActivities = [...this.displayedActivities, ...newActivities];

        // 更新状态
        this.loading = false;
        this.currentPage += 1;

        // 判断是否已加载全部数据
        if (this.displayedActivities.length >= this.allActivities.length) {
          this.finished = true;
        }
      }, 500);
    },

    // 刷新数据
    refreshActivities() {
      this.refreshing = true;
      this.finished = false;

      return new Promise((resolve) => {
        // 模拟网络请求延迟
        setTimeout(() => {
          // 重置页码和显示数据
          this.currentPage = 1;
          this.displayedActivities = [];

          // 重新加载第一页数据
          this.loadMoreActivities();
          this.refreshing = false;
          resolve();
        }, 1000);
      });
    },

    addActivity(activity) {
      this.allActivities.push({
        id: nanoid(),
        ...activity
      });

      // 如果没有加载完所有数据，则不需要立即显示新添加的活动
      if (this.finished) {
        this.displayedActivities.push({
          id: nanoid(),
          ...activity
        });
      }
    },

    updateActivity(id, updatedData) {
      // 更新全部数据中的活动
      const allIndex = this.allActivities.findIndex(activity => activity.id === id);
      if (allIndex !== -1) {
        this.allActivities[allIndex] = { ...this.allActivities[allIndex], ...updatedData };
      }

      // 更新显示数据中的活动
      const displayIndex = this.displayedActivities.findIndex(activity => activity.id === id);
      if (displayIndex !== -1) {
        this.displayedActivities[displayIndex] = { ...this.displayedActivities[displayIndex], ...updatedData };
      }
    },

    deleteActivity(id) {
      // 从全部数据中删除
      const allIndex = this.allActivities.findIndex(activity => activity.id === id);
      if (allIndex !== -1) {
        this.allActivities.splice(allIndex, 1);
      }

      // 从显示数据中删除
      const displayIndex = this.displayedActivities.findIndex(activity => activity.id === id);
      if (displayIndex !== -1) {
        this.displayedActivities.splice(displayIndex, 1);
      }
    },

    joinActivity(id) {
      // 在全部数据中查找并更新活动
      const allActivity = this.allActivities.find(activity => activity.id === id);
      if (allActivity && allActivity.participants.current < allActivity.participants.total) {
        allActivity.participants.current++;
        if (allActivity.participants.current === allActivity.participants.total) {
          allActivity.status = 'full';
        }
      }

      // 在显示数据中查找并更新活动
      const displayActivity = this.displayedActivities.find(activity => activity.id === id);
      if (displayActivity && displayActivity.participants.current < displayActivity.participants.total) {
        displayActivity.participants.current++;
        if (displayActivity.participants.current === displayActivity.participants.total) {
          displayActivity.status = 'full';
        }
      }
    },

    // 切换运动类型
    setSportType(sportType) {
      if (this.currentSport !== sportType) {
        this.currentSport = sportType;
        // 切换运动类型时重新初始化数据
        this.initializeData();
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
    }
  }
})