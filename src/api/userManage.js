import api from './index';
const UserManage = {
  getFriendList(params) {
    return api.requests.get(api.requests.APIURL + 'friendList', params)
  },
  getIcareList(params) {
    return api.requests.get(api.requests.APIURL + 'icareList', params)
  },
  getFansList(params) {
    return api.requests.get(api.requests.APIURL + 'fansList', params)
  },
  getUserTree(params) {
    return api.requests.get(api.requests.APIURL + 'userTree', params);
  },
  getFaceReport(params) {
    return api.requests.get(api.requests.APIURL + 'faceReport', params);
  },
  getUserPayment(params) {
    return api.requests.get(api.requests.APIURL + 'userPayment', params);
  },
  getuserOperations(params) {
    return api.requests.get(api.requests.APIURL + 'userOperations', params);
  },
  editUser(params) {
    return api.requests.patch(api.requests.APIURL + 'editUser', params);
  },
}
export default UserManage
