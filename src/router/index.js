import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('../components/Login.vue')
const Home = () => import('../views/home/Home.vue')
const Welcome = () => import('../views/home/Welcome.vue')
const Users = () => import('../views/home/children/Users.vue')

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome
      },
      {
        path:'/users',
        component:Users
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

// 为路由对象添加beforeeach 导航守卫
router.beforeEach((to, from, next) => {
  // 如果用户访问的登录页，直接放行
  if (to.path === '/login') return next() // 直接放行
  // 从 sessionStorage中获取到 保存的taken值
  const takened = window.sessionStorage.getItem('token')
  // 没有token，强制跳转到登录页
  if (!takened) return next('/login') // 强制跳转

  next()
})

export default router
