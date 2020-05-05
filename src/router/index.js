import Vue from 'vue'
import VueRouter from 'vue-router'


const Home = () => import('views/home/Home')
const Login = () => import('components/Login')
const Welcome = () => import('components/Welcome')
const User = () => import('components/user/User')
const Rights = () => import('components/rights/Rights') 
const Roles = () => import('components/rights/Roles')
const Goods = () => import('components/goods/Goods')
const Params = () => import('components/goods/Params')
const GoodsAdd = () => import('components/goods/GoodsAdd')
const Categories = () => import('components/goods/Categories')
const Orders = () => import('components/orders/Orders')
const Reports = () => import('components/reports/Reports')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home, children: [
      { path: '/', redirect: '/welcome' },
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/goods', component: Goods },
      { path: '/Params', component: Params },
      { path: '/goods/add', component: GoodsAdd },
      { path: '/categories', component: Categories },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports }
    ]
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  // 如果是登录 不要验证
  if (to.path === '/login') return next()
  // 从sessionStrage中获取到保存的token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有tonken 强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
