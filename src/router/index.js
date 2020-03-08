import Vue from 'vue'
import Router from 'vue-router'
import Logins from '@/views/logins/logins'
import Chart from '@/views/chart/charts'
import Index from '@/views/index/index'
import Role from '@/views/role/role'
import Home from '@/views/home/home'
import User from '@/views/user/user'
import UserManages from '@/views/userManage/userManages'
import UserSet from '@/views/userManage/userSet/userSet'
import Article from '@/views/article/article'
import UserRole from '@/views/role/userRole'
import ReviewArticle from '@/views/article/reviewArticle'
import PublishArticle from '@/views/article/publishArticle'
import Album from '@/views/album/album'
import UserInfo from '@/views/userManage/userInfo/userInfo'
import FamilyTree from '@/views/familyTree/familyTree'
import Test from '@/views/test'
Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [{
      path: '/index',
      name: 'index',
      component: Index,
      children: [{
          path: 'chart',
          name: 'chart',
          component: Home,
          meta: {
            keepAlive: false
          }
        },
        {
          path: 'home',
          name: 'home',
          component: Chart,
          meta: {
            keepAlive: false
          }
        },
        {
          path: 'user',
          name: 'user',
          component: User,
          meta: {
            keepAlive: false
          }
        },
        {
          path: 'role',
          name: 'role',
          component: Role,
          meta: {
            keepAlive: false
          }
        },
        {
          path: 'userManage',
          name: 'userManage',
          component: UserManages,
          meta: {
            keepAlive: false
          }
        },
        {
          path: 'userSet',
          name: 'userSet',
          component: UserSet,
          meta: {
            keepAlive: false
          }
        },
        {
          path: 'userInfo',
          name: 'userInfo',
          component: UserInfo,
          meta: {
            keepAlive: false
          }
        },

        {
          path: 'article',
          name: 'article',
          component: Article,
          meta: {
            keepAlive: false
          }
        },
        {
          path: 'userRole',
          name: 'userRole',
          component: UserRole,
          meta: {
            keepAlive: false
          }
        },
        {
          path: 'reviewArticle',
          name: 'reviewArticle',
          component: ReviewArticle,
          meta: {
            keepAlive: false
          }
        },
        {
          path: 'publishArticle',
          name: 'publishArticle',
          component: PublishArticle,
          meta: {
            keepAlive: false
          }
        },
        {
          path: 'album',
          name: 'album',
          component: Album,
          meta: {
            keepAlive: false
          }
        },
        {
          path: 'familyTree',
          name: 'familyTree',
          component: FamilyTree,
          meta: {
            keepAlive: false
          }
        },
      ],
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/',
      name: 'login',
      component: Logins,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/test',
      name: 'test',
      component: Test,
      meta: {
        keepAlive: false
      }
    },
  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.auth) {
    //需要认证,则检查token
    if (localStorage.getItem('token')) {
      next();
    } else {
      //登录页
      next({
        name: 'login',
        query: {
          redirect: to.name
        }
      })
    }
  } else {
    next();
  }
})
export default router;
