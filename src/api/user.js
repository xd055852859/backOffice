import api from './index';
const User = {
  getUserList(params) {
    return api.requests.get(api.requests.APIURL + 'userList', params);
  },
  changeUserList(params) {
    return api.requests.patch(api.requests.APIURL + 'editUser', params);
  },
  deleteUser(params) {
    return api.requests.delete(api.requests.APIURL + 'deleteUser', params);
  },
  getUserInfo(params) {
    return api.requests.get(api.requests.APIURL + 'userInfo', params);
  },
  getUserHomeType(params) {
    return api.requests.get(api.requests.APIURL + 'userHomepage', params);
  },
}
export default User
