// import api from '../../fetch/api';
const state = {
  targetUserKey: 0,
  targetUserInfo: {}
}

const actions = {
  setTargetUserKey({
    commit
  }, targetUserKey) {
    commit('SETTARGETUSERKEY', targetUserKey)
  },
  setTargetUserInfo({
    commit
  }, targetUserInfo) {
    commit('SETTARGETUSERINFO', targetUserInfo)
  }
}


const mutations = {
  SETTARGETUSERINFO(state, targetUserInfo) {
    state.targetUserInfo = Object.assign(targetUserInfo)
  },
  SETTARGETUSERKEY(state, targetUserKey) {
    state.targetUserKey = targetUserKey
  },
}

export default {
  state,
  actions,
  mutations
}
