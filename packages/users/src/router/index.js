import Vue from 'vue';
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
    component: () => import('@/views/Dashboard.vue'),
    beforeEnter: (to, from, next) => verifyLogin(to, from, next),
    children: [ 
      {
        path: 'home',
        name: 'home',
        component: () => import('@/components/dashboard/Home.vue')
      },
      {
        path: 'courses',
        name: 'Couses',
        component: () => import('@/components/dashboard/Courses.vue')
      },
      {
        path: 'coursesAll',
        name: 'Couses',
        component: () => import('@/components/dashboard/CoursesAll.vue')
      },
      {
        path: 'live',
        name: 'live',
        component: () => import('@/components/dashboard/Courses.vue')
      },
      {
        path: 'subscription',
        name: 'Subscription Test',
        component: () => import('@/components/dashboard/SubscriptionTest.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
