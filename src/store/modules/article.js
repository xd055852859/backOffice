// import api from '../../fetch/api';
const state = {
  articleKey: 0,
  reviewState: false,
  reviewShowState: false,
  viewShowState:false
}

const actions = {
  setArticleKey({
    commit
  }, articleKey) {
    commit('SETARTICLEKEY', articleKey)
  },
  changeReviewState({
    commit
  }, reviewState) {
    commit('CHANGEREVIEWSTATE', reviewState)
  },
  changeReviewShowState({
    commit
  }, reviewShowState) {
    commit('CHANGEREVIEWSHOWSTATE', reviewShowState)
  },
  changeViewShowState({
    commit
  }, viewShowState) {
    commit('CHANGEVIEWSHOWSTATE', viewShowState)
  },
}


const mutations = {
  SETARTICLEKEY(state, articleKey) {
    state.articleKey = articleKey
  },
  CHANGEREVIEWSTATE(state, reviewState) {
    state.reviewState = reviewState
  },
  CHANGEREVIEWSHOWSTATE(state, reviewShowState) {
    state.reviewShowState = reviewShowState
  },
  CHANGEVIEWSHOWSTATE(state, viewShowState) {
    state.viewShowState = viewShowState
  },
}

export default {
  state,
  actions,
  mutations
}
