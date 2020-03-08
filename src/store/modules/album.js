
// import api from '../../fetch/api';
const state = {
    albumShowState: false,
    albumManageState:false,
    albumTypeState:false,
    targetArticleKey:0
  }
  
  const actions = {
    changeAlbumShowState({
      commit
    },albumShowState) {
      commit('CHANGEALBUMSHOWSTATE', albumShowState)
    },
    changeAlbumManageState({
      commit
    },albumManageState) {
      commit('CHANGEALBUMMANAGESTATE', albumManageState)
    },
    changeAlbumTypeState({
      commit
    },albumTypeState) {
      commit('CHANGEALBUMTYPESTATE', albumTypeState)
    },
    setTargetArticleKey({
      commit
    },targetArticleKey) {
      commit('SETTARGETARTICLEKEY', targetArticleKey)
    },
  }
  
  
  const mutations = {
    CHANGEALBUMSHOWSTATE(state, albumShowState) {
      state.albumShowState = albumShowState
    },
    CHANGEALBUMMANAGESTATE(state, albumManageState) {
      state.albumManageState = albumManageState
    },
    CHANGEALBUMTYPESTATE(state, albumTypeState) {
      state.albumTypeState = albumTypeState
    },
    SETTARGETARTICLEKEY(state, targetArticleKey) {
      state.targetArticleKey = targetArticleKey
    },
  }
  
  export default {
    state,
    actions,
    mutations
  }
  