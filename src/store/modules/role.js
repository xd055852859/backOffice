// import api from '../../fetch/api';
const state = {
   roleId:0,
   userRoleId:0,
   roleShowState:false,
   roleUserShowState:false
}

const actions = {
    setRoleId({ commit }, roleId) {
        commit('SETROLEID', roleId)
    },
    setUserRoleId({ commit }, userRoleId) {
        commit('SETUSERROLEID', userRoleId)
    },
    changeRoleShowState({ commit }, roleShowState) {
        commit('CHANGEROLESHOWSTATE', roleShowState)
    },
    changeUserRoleShowState({ commit }, roleUserShowState) {
        commit('CHANGEUSERROLESHOWSTATE', roleUserShowState)
    },
}


const mutations = {
    SETROLEID(state, roleId) {
        state.roleId = roleId
    },
    SETUSERROLEID(state, userRoleId) {
        state.userRoleId = userRoleId
    },
    CHANGEROLESHOWSTATE(state, roleShowState){
        state.roleShowState = roleShowState
    },
    CHANGEUSERROLESHOWSTATE(state, roleUserShowState){
        state.roleUserShowState = roleUserShowState
    },
}

export default {
    state,
    actions, 
    mutations
}