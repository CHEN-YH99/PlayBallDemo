import { createWebHistory, createRouter } from 'vue-router'
import BasketballView from '../views/Basketball.vue'
import LocationView from '../components/Location.vue'
import PublishView from '../views/PublishView.vue'
import ChatView from '../components/Chat.vue'
import ProfileView from '../views/Profile.vue'
import SettingsView from '../views/Settings.vue'
import { authGuard } from '../utils/authGuard.js'

const routes = [
  {
    path: '/',
    redirect: '/basketball'
  },
  {
    path: '/basketball',
    name: 'basketball',
    component: BasketballView,
    meta: { sport: '篮球' }
  },
  {
    path: '/football',
    name: 'football', 
    component: BasketballView,
    meta: { sport: '足球' }
  },
  {
    path: '/badminton',
    name: 'badminton',
    component: BasketballView,
    meta: { sport: '羽毛球' }
  },
  {
    path: '/tennis',
    name: 'tennis',
    component: BasketballView,
    meta: { sport: '网球' }
  },
  {
    path: '/pingpong',
    name: 'pingpong',
    component: BasketballView,
    meta: { sport: '乒乓球' }
  },
  {
    path: '/billiards',
    name: 'billiards',
    component: BasketballView,
    meta: { sport: '台球' }
  },
  {
    path: '/volleyball',
    name: 'volleyball',
    component: BasketballView,
    meta: { sport: '排球' }
  },
  {
    path: '/location',
    name: 'location',
    component: LocationView,
    meta: { page: '场地' }
  },
  {
    path: '/message',
    name: 'message',
    component: ChatView,
    meta: { page: '消息' }
  },
  {
    path: '/user',
    name: 'user',
    component: ProfileView,
    meta: { page: '我的' }
  },
  {
    path: '/publish',
    name: 'publish',
    component: PublishView,
    meta: { page: '发布', requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { page: '设置' }
  },

  {
    path: '/friend/:id',
    name: 'friend-detail',
    component: () => import('../views/FriendDetail.vue'),
    meta: { page: '好友详情' }
  },
  {
    path: '/nearby',
    name: 'nearby',
    component: () => import('../views/NearbyView.vue'),
    meta: { page: '附近' }
  },
  {
    path: '/friends',
    name: 'friends',
    component: () => import('../views/FriendsView.vue'),
    meta: { page: '好友列表', requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { page: '登录' }
  },
  {
    path: '/activity/:id',
    name: 'activity-detail',
    component: () => import('../views/ActivityDetail.vue'),
    meta: { page: '活动详情', requiresAuth: true }
  },
  {
    path: '/chat/:id',
    name: 'chat-detail',
    component: () => import('../views/ChatDetail.vue'),
    meta: { page: '聊天详情' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 使用认证守卫
router.beforeEach(authGuard)

export default router