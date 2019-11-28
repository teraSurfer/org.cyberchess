import Vue from 'vue'
import VueRouter from 'vue-router'
import Store from '../store';


Vue.use(VueRouter)

function verifyLogin(to, from, next) {
  if(Store.getters['auth/loggedIn']) {
    next()
  } else {
    next('/');
  }
}

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    beforeEnter: (to, from, next) => {
      if(Store.getters['auth/loggedIn']) {
        next('/dashboard')
      } else {
        next()
      }
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    beforeEnter: (to, from, next) => verifyLogin(to, from, next),
    children: [ 
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/components/dashboard/Home.vue')
      },
      {
        path: 'courses',
        name: 'Courses',
        component: () => import('@/components/dashboard/Courses/Courses.vue')
      },
      {
        path: 'courses/:id',
        name: 'Course',
        component: () => import('@/components/dashboard/Courses/Course.vue')
      },
      {
        path: 'live',
        name: 'Live',
        component: () => import('@/components/dashboard/Live.vue')
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
