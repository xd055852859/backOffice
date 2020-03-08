// import api from '../../fetch/api';
const state = {
    dataShowState: false,
  }
  
  const actions = {
    changeDataShowState({
      commit
    }, dataShowState) {
      commit('CHANGEDATASHOWSTATE', dataShowState)
    },
  }
  const mutations = {
    CHANGEDATASHOWSTATE(state, dataShowState) {
        state.dataShowState = dataShowState
      },
  }
  
  export default {
    state,
    actions,
    mutations
  }
  