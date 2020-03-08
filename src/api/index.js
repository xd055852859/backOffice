import axios from 'axios';
import router from '../router'
import ElementUI from 'element-ui'
import qs from 'qs'
import Login from './login'
import User from './user';
import Role from './role';
import UserManage from './userManage';
import Article from './article';
import Album from './album';
import Home from './home';
//拦截axios请求,讲token提前放入请求头中
axios.interceptors.request.use(
  config => {
    //若存在令牌放入请求头
    if (localStorage.getItem('token')) {
      config.headers.token = localStorage.getItem('token')
    }
    return config
  }
)
// const APIURL = 'http://192.168.1.101:8051/api/';
// let token = null;

axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据 
    // 否则的话抛出错误
    if (response.status === 200) {
      if (response.data.statusCode == "701") {
        ElementUI.Message.error("登录失效")
        // 清除token
        localStorage.clear();
        // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面 
        setTimeout(() => {
          router.push({
            name: "login"
          });
        }, 2000);
      } else {
        return Promise.resolve(response);
      }
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是2开头的的情况
  // 这里可以跟你们的后台开发人员协商好统一的错误状态码 
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  // 下面列举几个常见的操作，其他需求可自行扩展
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。  
        //  case 701:   
        //   router.replace({   
        //   path: '/login',   
        //   query: { 
        //    redirect: router.currentRoute.fullPath 
        //   }
        //   });
        //   break;

        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面  

        // 404请求不存在
        case 404:
          this.$message.error("网络请求不存在")
          break;
          // 其他错误，直接抛出错误提示
        default:
          this.$message.error(error.response.data.message);
      }
      return Promise.reject(error.response);
    }
  });
const requests = {
  // APIURL: 'http://192.168.1.101:8087/',
  APIURL: 'https://statisticsdata.qingtime.cn/',
  HOMEURL: 'https://home.qingtime.cn/home/',
  get: (url, params) => {
    // todo ping
    return new Promise((resolve, reject) => {
      axios.get(url, {
          params
        })
        .then(response => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    });
  },
  post: (url, params) => {
    return new Promise((resolve, reject) => {
      axios.post(url, params)
        .then(response => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    });
  },
  patch: (url, params) => {
    return new Promise(async function (resolve, reject) {
      axios.patch(url, params)
        .then(response => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    });
  },
  delete: (url, params) => {
    return new Promise(async function (resolve, reject) {
      axios.delete(url, {
          data: params,
          // paramsSerializer: params => {
          //   return qs.stringify(params, { indices: false })
          // }
        })
        .then(response => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    });
  },
};
console.log('user', User);
export default {
  requests,
  Home,
  User,
  Role,
  UserManage,
  Article,
  Login,
  Album
}
