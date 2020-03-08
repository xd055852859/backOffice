import api from './index';
const Role = {
  getRoleList(params) {
    return api.requests.get(api.requests.APIURL + 'roleList', params);
  },
  addRoleList(params) {
    return api.requests.post(api.requests.APIURL + 'addRole', params);
  },
  changeRoleList(params) {
    return api.requests.patch(api.requests.APIURL + 'editRole', params);
  },
  deleteRole(params) {
    return api.requests.delete(api.requests.APIURL + 'deleteRole', params);
  },
  getRoleName(params) {
    return api.requests.get(api.requests.APIURL + 'roleName', params);
  },
  searchRoleMember(params) {
    return api.requests.get(api.requests.APIURL + 'searchUser', params);
  },
  editUserRole(params) {
    return api.requests.patch(api.requests.APIURL + 'editAdmin', params);
  },
  addUserRole(params) {
    return api.requests.post(api.requests.APIURL + 'addAdmin', params);
  },
  getRoleUserList(params) {
    return api.requests.get(api.requests.APIURL + 'adminList', params);
  },
  deleteAdmin(params) {
    return api.requests.delete(api.requests.APIURL + 'deleteAdmin', params);
  },
}
export default Role
