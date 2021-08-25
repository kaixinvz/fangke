import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/view/Home'


// import Login from '@/view/Login'

import Login from '@/view/logintwo'
import message from '@/view/visitor/message'
//message_visitor
import message_edit from '@/view/visitor/message_edit'
import message_visitor from '@/view/visitor/message_visitor'
Vue.use(Router)

var router = new Router({

  routes: [{
    path: '/',
    name: '登录',
    component: Login,
    meta:{
      auth:false
    }
  },
  // {
  //   path: '/home',
  //   name: '首页',
  //   component: Home
  // },
  {
    path: '/message/',
    name:'message',
    component: message,
    meta:{
      auth:false
    }
  },
  {
    path: '/message_visitor/',
    name:'message_visitor',
    component: message_visitor,
    meta:{
      auth:true
    }
  },
  {
    path: '/message_edit/',
    name:'message_edit',
    component: message_edit,
    meta:{
      auth:false
    }
  },
  {
    path: '/aq/main',
    name: '主页',
    component: () => import('../view/aq/Main'),
    meta:{
      auth:false
    }
  },
  {
    path: '/visitor',
    name: 'visitor',
    component: () => import('../view/visitor/index'),
    meta:{
      auth:false
    }
  },
 {
   path:'/aq/PasswordChange',
   name:'PasswordChange',
   component: () => import('../view/aq/PasswordChange'),
   meta:{
     auth:false
   }
 },
  ]
})


//ReviewOfLaws






// 路由守卫
router.beforeEach((to, from, next) => {
  var token = window.localStorage.getItem('accessToken')
  if(token){
    if(to.name === '登录') { 
        next('/aq/main') 
        return 
      }
  }
  if(to.meta.auth == false){
    if (to.path != '/') {
      if (!token) {
        return next('/')
      }else{
        next()
      }
    }
  }  
  next()
})
export default router
