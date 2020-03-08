import api from './index';
const Article = {
  getArticleList(params) {
    return api.requests.get(api.requests.APIURL + 'albumList', params);
  },
  getArticleMusic(params) {
    return api.requests.get(api.requests.HOMEURL + 'album/backGroundMusicList', params);
  },
  getQiNiuUpToken(params) {
    return api.requests.get(api.requests.HOMEURL + 'upTokenQiniu/getQiNiuUpToken', params);
  },
  saveArticle(params) {
    return api.requests.post(api.requests.HOMEURL + 'album/article', params);
  },
  saveStory(params) {
    return api.requests.post(api.requests.HOMEURL + 'album', params);
  },
  /**
   * 修改审核状态
   */
  changeReviewState(params) {
    return api.requests.patch(api.requests.APIURL + 'setAlbumProperty', params);
  },
  deleteArticle(params) {
    return api.requests.delete(api.requests.APIURL + 'deleteAlbum', params);
  },
  getArticleDetail(params) {
    return api.requests.get(api.requests.HOMEURL + 'album/detailNew', params);
  },
}
export default Article
